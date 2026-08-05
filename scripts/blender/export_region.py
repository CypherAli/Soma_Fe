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
from region_config import REGIONS, DROP_CURVE_KW  # noqa: E402

_args = sys.argv[sys.argv.index('--') + 1:]
OUTDIR = _args[0]
WANTED = _args[1:]
if WANTED == ["ALL"]:
    WANTED = list(REGIONS)

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
        counts = {}
        for prefix, kws, drop, names, tag in specs:
            if kws is None and names is None:
                continue          # vùng này không lấy nhóm đó
            n = 0
            for o in bpy.data.objects:
                if not is_body_mesh(o) or not sysmap.get(o.name, "").startswith(prefix):
                    continue
                nm = o.name.lower()
                if not side_ok(nm, self.side):
                    continue
                ok = (names is not None and nm in names) or (kws is not None and hit_kw(nm, kws))
                if not ok or any(k in nm for k in drop):
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
        drop = DROP_CURVE_KW + list(c.get("curve_drop", []))
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
        sm = env.modifiers.new("sm", 'SMOOTH'); sm.iterations = 4; sm.factor = 0.85
        env.modifiers.new("dec", 'DECIMATE').ratio = 0.5
        dg = bpy.context.evaluated_depsgraph_get()
        me = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
        bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
        for v in bm.verts:
            v.co += v.normal * self.cfg.get("inflate", 0.010)
        bm.to_mesh(me); bm.free()
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
