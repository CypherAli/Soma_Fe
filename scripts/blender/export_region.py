import bpy, sys, os, bmesh
from mathutils import Vector

# XUẤT MODEL NHIỀU LỚP THEO VÙNG — script dùng chung cho mọi vùng cơ thể.
# Gộp kinh nghiệm của export_arm_v3 / export_neck / export_trunk / export_shoulder
# thành một chỗ; mỗi vùng chỉ còn là một entry cấu hình trong region_config.py.
#
#   blender --background Startup.blend --python export_region.py -- <outdir> <vùng> [vùng...]
#   blender --background Startup.blend --python export_region.py -- <outdir> ALL
#
# Cấu hình mỗi vùng (xem region_config.py) gồm: hộp cắt, bên (.r/.l), từ khoá
# chọn xương/cơ/khớp/tạng, có bọc da hay không.
#
# BA BẪY ĐÃ TRẢ GIÁ, ĐỪNG SỬA MẤT (chi tiết ở hàm build_skin):
#  1. bản sao thừa hưởng trạng thái ẩn -> select_set() không ăn -> join() gộp thiếu
#     mà KHÔNG báo lỗi;
#  2. voxel remesh cần mặt KÍN -> phải bọc da TRƯỚC khi cắt hộp;
#  3. một số mesh xương (sườn/đốt sống/xương ức) phá level set của OpenVDB ->
#     chỉ bọc từ cơ + vài xương chỉ định trong `skin_bones`.

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from region_config import REGIONS, DROP_CURVE_KW, FULLBODY  # noqa: E402

_args = sys.argv[sys.argv.index('--') + 1:]
OUTDIR = _args[0]
WANTED = _args[1:]
if WANTED == ["ALL"]:
    WANTED = list(REGIONS)
elif WANTED == ["FULLBODY"]:
    WANTED = list(FULLBODY)

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

MARKER_SUFFIX = ('.j', '.t', '.g')


def wbb(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs))),
            Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))))


def side_ok(name, side):
    """`.l`/`.r` là hậu tố bên. side=None: lấy cả hai (cấu trúc giữa thân)."""
    nm = name.lower()
    if side is None:
        return True
    other = '.l' if side == 'r' else '.r'
    return not nm.endswith(other)


def is_body_mesh(o, min_verts=10):
    return (o.type == 'MESH' and len(o.data.vertices) >= min_verts
            and not o.name.endswith(MARKER_SUFFIX))


def hit_kw(nm, kws):
    """kws=True nghĩa là lấy TẤT CẢ nhóm đó trong hộp; list = lọc theo từ khoá."""
    return True if kws is True else any(k in nm for k in kws)


class Region:
    def __init__(self, key, cfg):
        self.key = key
        self.cfg = cfg
        x0, x1, y0, y1, z0, z1 = cfg["box"]
        self.x0, self.x1, self.y0, self.y1, self.z0, self.z1 = x0, x1, y0, y1, z0, z1
        self.side = cfg.get("side")
        self.kept, self.muscles, self.bones = [], [], []

    # ---- lọc không gian ----
    def overlaps(self, o, pad=0.0):
        mn, mx = wbb(o)
        return (mx.x >= self.x0 - pad and mn.x <= self.x1 + pad and
                mx.y >= self.y0 - pad and mn.y <= self.y1 + pad and
                mx.z >= self.z0 - pad and mn.z <= self.z1 + pad)

    def center_in(self, o, pad=0.02):
        mn, mx = wbb(o)
        c = (mn + mx) / 2
        return (self.x0 - pad <= c.x <= self.x1 + pad and self.y0 - pad <= c.y <= self.y1 + pad
                and self.z0 - pad <= c.z <= self.z1 + pad)

    # ---- 1) mesh cứng: xương / khớp / cơ / tạng ----
    def collect_meshes(self):
        c = self.cfg
        specs = [
            ("1:", c.get("bone_kw"), c.get("bone_drop", []), c.get("bone_names"), "bone"),
            ("3:", c.get("joint_kw"), c.get("joint_drop", []), None, "joint"),
            ("4:", c.get("muscle_kw"), c.get("muscle_drop", []), None, "muscle"),
            ("5:", c.get("heart_kw"), c.get("organ_drop", []), None, "organ"),  # buồng tim/van
            ("8:", c.get("organ_kw"), c.get("organ_drop", []), None, "organ"),
            ("6:", c.get("organ6_kw"), [], None, "organ"),   # lách nằm ở nhóm bạch huyết
            ("7:", c.get("sense_kw"), c.get("sense_drop", []), None, "organ"),  # mắt/tai/não
        ]
        keep = [k.lower() for k in c.get("keep_kw", [])]
        # Ngưỡng số đỉnh: mặc định 10 để loại mảnh rác, NHƯNG Z-Anatomy dựng
        # nhiều dây chằng bằng đúng 4–9 đỉnh (dây chằng cùng-đòn, ức-đòn,
        # sên-mác…) và tuyến cận giáp 9 đỉnh. Với vùng toàn thân phải hạ xuống,
        # nếu không mất 114 dây chằng khớp và cả 4 tuyến cận giáp. Mesh không có
        # mặt nào vẫn bị loại ở bước cuối của run() nên không sợ rác.
        min_verts = c.get("min_verts", 10)
        counts = {}
        for prefix, kws, drop, names, tag in specs:
            if kws is None and names is None:
                continue          # vùng này không lấy nhóm đó
            n = 0
            for o in bpy.data.objects:
                if not is_body_mesh(o, min_verts) or not sysmap.get(o.name, "").startswith(prefix):
                    continue
                nm = o.name.lower()
                if not side_ok(nm, self.side):
                    continue
                ok = (names is not None and nm in names) or (kws is not None and hit_kw(nm, kws))
                if not ok:
                    continue
                # keep_kw thắng *_drop: vài tấm cân/dây chằng tuy khớp từ khoá
                # loại trừ chung ("fascia", "ligament", "aponeurosis") nhưng lại
                # CHÍNH LÀ bề mặt cơ thể ở chỗ đó — cân đùi, dây chằng bẹn, cân
                # sọ. Bỏ chúng đi là thủng một mảng đúng chỗ ấy.
                if any(k in nm for k in drop) and not any(k in nm for k in keep):
                    continue
                # mesh phụ điểm bám tên dạng .el/.o1r -> chỉ nhận hậu tố bên hoặc không hậu tố
                tail = nm.rsplit('.', 1)[-1] if '.' in nm else ''
                if tail and tail not in ('l', 'r') and not tail.isdigit():
                    continue
                # xương/cơ/khớp lấy theo GIAO NHAU với hộp (cắt lấy phần trong
                # hộp là hợp lý); tạng lấy theo TÂM, nếu không gan/phổi/dạ dày
                # chỉ cần chạm mép hộp là lọt vào mọi scene lân cận.
                if not (self.center_in(o) if tag == "organ" else self.overlaps(o)):
                    continue
                self.kept.append(o)
                if tag == "muscle":
                    self.muscles.append(o)
                elif tag == "bone":
                    self.bones.append(o)
                n += 1
            counts[tag] = counts.get(tag, 0) + n
        print(f"[{self.key}] mesh {counts}")

    # ---- 2) mạch / thần kinh (curve -> ống) ----
    def collect_tubes(self):
        c = self.cfg
        # DROP_CURVE_KW sinh ra để chặn mạch VÙNG KHÁC lọt vào hộp của một vùng
        # nhỏ. Với vùng toàn thân thì nó lại cắt mất đúng những mạch cần lấy
        # (chậu, đùi, thận, tạng…) — đặt curve_drop_default=False để tắt.
        drop = list(c.get("curve_drop", []))
        if c.get("curve_drop_default", True):
            drop = DROP_CURVE_KW + drop
        keep_names = [k.lower() for k in c.get("curve_keep_names", [])]
        # Hệ 8 cũng có CURVE (thực quản, phế quản, ống mật, niệu quản) — không lấy
        # thì scene thiếu hẳn các ống này mà không có dấu hiệu gì.
        for coll, want, depth, tag in (
                ("5: Cardiovascular system", c.get("vessels", True), c.get("vessel_bevel", 0.0013), "ves"),
                ("7: Nervous system & Sense organs", c.get("nerves", True), c.get("nerve_bevel", 0.0014), "ner"),
                ("8: Visceral systems", c.get("organ_tubes", False), c.get("organ_bevel", 0.0035), "org")):
            if not want:
                continue
            src = []
            for o in bpy.data.collections[coll].all_objects:
                if o.type != 'CURVE' or o.name.endswith(MARKER_SUFFIX):
                    continue
                nm = o.name.lower()
                named = any(k in nm for k in keep_names)
                if not named:
                    if not side_ok(nm, self.side) or any(k in nm for k in drop):
                        continue
                if self.center_in(o):
                    src.append(o)
            print(f"[{self.key}] {tag} curves {len(src)} -> tubes {self.tubes(src, depth)}")

    def tubes(self, curves, depth):
        n = 0
        for o in curves:
            o.data = o.data.copy()   # cặp .l/.r hay dùng chung data-block
            if getattr(o.data, "bevel_depth", 0.0) == 0.0 and getattr(o.data, "bevel_object", None) is None:
                o.data.bevel_depth = depth
                o.data.bevel_resolution = 1
            # Số phân đoạn DỌC theo đường cong. Mặc định của Blender là 12 —
            # thừa cho ống bán kính 1,3mm và là lý do file mạch toàn thân phình
            # lên 9,4MB. Hạ xuống còn đủ mượt mà nhẹ hơn nhiều.
            res = self.cfg.get("curve_res")
            if res:
                o.data.resolution_u = res
            dg = bpy.context.evaluated_depsgraph_get()
            try:
                me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
            except Exception:
                continue
            if not me or len(me.polygons) < 1:
                continue
            nb = bpy.data.objects.new(o.name, me)
            bpy.context.scene.collection.objects.link(nb)
            nb.matrix_world = o.matrix_world.copy()
            self.kept.append(nb)
            n += 1
        return n

    # ---- 3) hạch bạch huyết ----
    def collect_lymph(self):
        if not self.cfg.get("lymph"):
            return
        n = 0
        drop = DROP_CURVE_KW + list(self.cfg.get("curve_drop", []))
        for o in bpy.data.collections["6: Lymphoid organs"].all_objects:
            if not is_body_mesh(o, 6):
                continue
            nm = o.name.lower()
            if not side_ok(nm, self.side) or any(k in nm for k in drop):
                continue
            if "node" not in nm:
                continue
            if self.center_in(o):
                self.kept.append(o)
                n += 1
        print(f"[{self.key}] lymph {n}")

    # ---- 4) da: bọc voxel ----
    def build_skin(self):
        if not self.cfg.get("skin"):
            return None
        want = self.cfg.get("skin_bones", [])
        if want is True:
            src = self.muscles + self.bones
        else:
            names = [n.lower() for n in want]
            src = self.muscles + [b for b in self.bones if b.name.lower() in names]
        # Mảnh của hệ KHÁC được đắp thêm vào khối bọc (không xuất ra như một lớp
        # riêng): nhãn cầu lấp hốc mắt, nếu không mặt có hai hố sâu hoắm.
        extra = [k.lower() for k in self.cfg.get("skin_extra_kw", [])]
        if extra:
            n = 0
            for o in bpy.data.objects:
                if not is_body_mesh(o) or o in src:
                    continue
                nm = o.name.lower()
                if any(k in nm for k in extra) and side_ok(nm, self.side) and self.overlaps(o):
                    src.append(o)
                    n += 1
            print(f"[{self.key}] skin extra {n}")
        if not src:
            print(f"[{self.key}] SKIN_SKIP (không có cơ)")
            return None
        bpy.ops.object.select_all(action='DESELECT')
        dupes = []
        for o in src:
            d = o.copy(); d.data = o.data.copy()
            bpy.context.scene.collection.objects.link(d)
            d.matrix_world = o.matrix_world.copy()
            # (bẫy 1) object ẩn thì select_set() không ăn -> join() gộp thiếu
            d.hide_viewport = False
            try:
                d.hide_set(False)
            except Exception:
                pass
            dupes.append(d)
        bpy.context.view_layer.objects.active = dupes[0]
        for d in dupes:
            d.select_set(True)
        bpy.ops.object.join()
        env = bpy.context.view_layer.objects.active
        rm = env.modifiers.new("rm", 'REMESH'); rm.mode = 'VOXEL'
        rm.voxel_size = self.cfg.get("voxel", 0.005)
        sm = env.modifiers.new("sm", 'SMOOTH')
        sm.iterations = self.cfg.get("smooth", 4); sm.factor = self.cfg.get("smooth_factor", 0.85)
        env.modifiers.new("dec", 'DECIMATE').ratio = 0.5
        dg = bpy.context.evaluated_depsgraph_get()
        me = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
        mw = env.matrix_world
        # Phồng theo VÙNG chứ không đều toàn thân: thân mình cần phồng nhiều để
        # lấp khe giữa các bó cơ (nếu không sẽ có rãnh dọc giữa ngực/bụng và
        # hõm ở mặt trong đùi), còn bàn tay/bàn chân/mặt chỉ chịu được vài mm —
        # phồng bằng nhau là ngón tay dính thành găng, mặt phù thành khối.
        #   inflate_zones = [((x0,x1,y0,y1,z0,z1), giá_trị), ...]  — xét theo TOẠ
        #   ĐỘ THẾ GIỚI; không vùng nào trùm thì dùng `inflate`.
        #
        # Ranh giới vùng phải CHUYỂN MƯỢT: cắt cứng thì chênh lệch vài mm giữa
        # hai vùng in ra thành gờ nổi đúng theo hình cái hộp — đã thấy một vệt
        # chữ V vắt ngang háng đúng mặt phẳng z của hộp thân mình.
        base = self.cfg.get("inflate", 0.010)
        zones = self.cfg.get("inflate_zones", [])
        fade = self.cfg.get("inflate_fade", 0.06)

        def zone_weight(w, box):
            """1 ở giữa hộp, giảm dần về 0 trong dải `fade` quanh mép hộp."""
            zx0, zx1, zy0, zy1, zz0, zz1 = box
            k = 1.0
            for c, lo, hi in ((w.x, zx0, zx1), (w.y, zy0, zy1), (w.z, zz0, zz1)):
                d = min(c - (lo - fade), (hi + fade) - c)
                if d <= 0:
                    return 0.0
                t = min(1.0, d / (2 * fade))
                k *= t * t * (3 - 2 * t)      # smoothstep
            return k

        # Mỗi vùng khai báo (hộp, lượng_phồng) hoặc (hộp, lượng_phồng, lượng_co).
        # Co ÍT hơn phồng là chừa lại một lớp đệm dưới da — bàn tay/bàn chân cần
        # thế, vì co đúng bằng lượng phồng thì da bám sát xương, ngón tay trông
        # khẳng khiu như bộ xương.
        ratio_default = self.cfg.get("shrink_ratio", 1.0)

        def amount_at(w, shrink):
            if not zones:
                return base * (ratio_default if shrink else 1.0)
            best_k, best_zone = 0.0, None
            for z in zones:
                k = zone_weight(w, z[0])
                if k > best_k:
                    best_k, best_zone = k, z
            if best_zone is None:
                return base * (ratio_default if shrink else 1.0)
            val = best_zone[2] if (shrink and len(best_zone) > 2) else best_zone[1]
            if shrink and len(best_zone) <= 2:
                val *= ratio_default
            b = base * (ratio_default if shrink else 1.0)
            return b + (val - b) * best_k

        def offset(mesh, sign):
            """Đẩy mọi đỉnh theo pháp tuyến, lượng đẩy tra theo vùng."""
            bm = bmesh.new(); bm.from_mesh(mesh); bm.normal_update()
            for v in bm.verts:
                v.co += v.normal * (sign * amount_at(mw @ v.co, sign < 0))
            bm.to_mesh(mesh); bm.free()

        offset(me, +1)

        # HAI LƯỢT (tuỳ chọn): lượt 1 phồng, lượt 2 remesh lại rồi CO ĐÚNG BẰNG
        # lượng đã phồng. Đây là cách duy nhất xoá được vạt mỏng rìa rách (cân
        # đùi, dây chằng bẹn ở nếp bẹn): tấm mỏng phồng hai mặt thành khối dày
        # 2·d, co d là biến mất, còn thân người phồng d rồi co d thì về nguyên.
        # Vì lượng phồng đã theo vùng nên lượng co cũng phải theo vùng — co đều
        # một con số là bàn tay teo mất ngón.
        if self.cfg.get("two_pass"):
            tmp = bpy.data.objects.new("skin_pass1", me)
            bpy.context.scene.collection.objects.link(tmp)
            tmp.matrix_world = env.matrix_world.copy()
            r2 = tmp.modifiers.new("rm2", 'REMESH'); r2.mode = 'VOXEL'
            r2.voxel_size = self.cfg.get("voxel2", 0.008)
            s2 = tmp.modifiers.new("sm2", 'SMOOTH')
            s2.iterations = self.cfg.get("smooth2", 12); s2.factor = 1.0
            tmp.modifiers.new("dec2", 'DECIMATE').ratio = 0.6
            dg = bpy.context.evaluated_depsgraph_get()
            me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
            offset(me, -1)
            bpy.data.objects.remove(tmp, do_unlink=True)

        # ĐÁNH BÓNG sau khi phồng. Phồng theo pháp tuyến giữ nguyên mọi chỗ gồ
        # ghề của khối cơ nên bề mặt trông "độn" — làm mượt nhẹ ở BƯỚC CUỐI mới
        # xoá được, làm mượt trước khi phồng (modifier ở trên) thì không.
        polish = self.cfg.get("polish", 0)
        if polish:
            tmp = bpy.data.objects.new("skin_polish", me)
            bpy.context.scene.collection.objects.link(tmp)
            tmp.matrix_world = env.matrix_world.copy()
            sp = tmp.modifiers.new("sp", 'SMOOTH')
            sp.iterations = polish; sp.factor = self.cfg.get("polish_factor", 0.6)
            dg = bpy.context.evaluated_depsgraph_get()
            me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
            bpy.data.objects.remove(tmp, do_unlink=True)

        for p in me.polygons:
            p.use_smooth = True
        skin = bpy.data.objects.new("Skin envelope", me)
        bpy.context.scene.collection.objects.link(skin)
        skin.matrix_world = env.matrix_world.copy()
        self.kept.append(skin)
        print(f"[{self.key}] skin tris {len(me.polygons)}")
        bpy.data.objects.remove(env, do_unlink=True)
        return skin

    # ---- 5) cắt hộp ----
    def clip(self, o, margin=0.0):
        me = o.data; mw = o.matrix_world
        bm = bmesh.new(); bm.from_mesh(me)
        kill = []
        for f in bm.faces:
            c = mw @ f.calc_center_median()
            if (c.x < self.x0 - margin or c.x > self.x1 + margin or
                    c.y < self.y0 - margin or c.y > self.y1 + margin or
                    c.z < self.z0 - margin or c.z > self.z1 + margin):
                kill.append(f)
        if kill:
            bmesh.ops.delete(bm, geom=kill, context='FACES')
        loose = [v for v in bm.verts if not v.link_faces]
        if loose:
            bmesh.ops.delete(bm, geom=loose, context='VERTS')
        bm.to_mesh(me); bm.free()

    def run(self):
        self.collect_meshes()
        self.collect_tubes()
        self.collect_lymph()
        skin = self.build_skin() if self.cfg.get("skin") else None
        if self.cfg.get("clip", True):
            for o in list(self.kept):
                if o.type != 'MESH':
                    continue
                try:
                    self.clip(o, self.cfg.get("skin_margin", 0.006) if o is skin else 0.0)
                except Exception as e:
                    print(f"[{self.key}] CLIP_FAIL {o.name} {e!r}")
        # skin_only: chỉ xuất lớp da (dùng cho model toàn thân — 7 hệ đã có file riêng)
        if self.cfg.get("skin_only") and skin is not None:
            self.kept = [skin]
        self.kept = [o for o in self.kept if o.type != 'MESH' or len(o.data.polygons) > 0]

        out = os.path.join(OUTDIR, self.cfg["out"])
        bpy.ops.object.select_all(action='DESELECT')
        for o in self.kept:
            o.hide_viewport = False
            try:
                o.hide_set(False)
            except Exception:
                pass
            o.select_set(True)
        tris = sum(len(o.data.polygons) for o in self.kept if o.type == 'MESH')
        print(f"[{self.key}] EXPORT meshes {len(self.kept)} tris {tris} -> {out}")
        bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
            export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
            export_apply=False, export_yup=True)
        print(f"[{self.key}] DONE")


for key in WANTED:
    cfg = REGIONS.get(key)
    if not cfg:
        print("UNKNOWN REGION", key)
        continue
    # mỗi vùng chạy trên bản blend gốc để lần trước không cắt lẹm dữ liệu lần sau
    bpy.ops.wm.revert_mainfile()
    sysmap = {}
    for col in bpy.data.collections:
        if col.name[:1].isdigit():
            for o in col.all_objects:
                sysmap.setdefault(o.name, col.name)
    Region(key, cfg).run()
print("ALL_DONE")
