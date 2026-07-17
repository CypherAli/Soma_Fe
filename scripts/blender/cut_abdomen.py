import bpy, sys, bmesh
from mathutils import Vector

argv = sys.argv[sys.argv.index('--')+1:]
out = argv[0]
col_names = argv[1:]

Z_TOP = 1.28     # mặt cắt ngang trên (trên tạng bụng) — mở bụng
Z_BOT = 0.87     # nâng cao hơn khớp mu, KHÔNG chứa bộ phận sinh dục
X_ARM = 0.165    # mesh có TÂM |X|>ngưỡng = tay/vai bên → xoá (thân bụng ~±0.15)
X_CLIP = 0.19    # cắt phẳng đứng 2 bên bỏ overhang lateral (mẩu vai/tay sát thân)

# Cấu trúc CẦN giữ riêng để còn bấm chọn được (hotspot) — không gộp/giảm poly.
HERO_NAMES = {"Vertebra T12", "Liver", "Stomach", "Spleen", "Kidney.l", "Kidney.r"}

# Bỏ chi (tay/chân) + vai theo TÊN (lọc |X| không tách hết mẩu vai sát thân).
LIMB_KW = ["brachi", "humer", "radius", "ulna", "carp", "metacarp", "digitorum",
           "digiti", "pollic", " hand", "finger", "phalan", "antebrach", "forearm",
           "deltoid", "bicep", "tricep", "femor", "femur", "thigh", "patell",
           "tibia", "fibula", "gastrocn", "soleus", "tarsal", " foot", " toe",
           "hallucis", "peroneus", "popliteus", "sartorius", "gracilis",
           "quadratus femoris", "obturator", "teres", "infraspin", "supraspin",
           "subscapular", "scapula", "clavicle", "coracobrach", "acromio",
           "supinator", "pronator", "anconeus", "brachii", "brachial", "axilla"]
# Lớp KHÔNG bịt nắp (để hở nhìn vào trong): da/mạc + peritoneum (bao lớn che tạng).
NO_CAP_MAT = ["fascia", "superficial", "skin", "peritoneum"]

def limb_name(nm):
    low = nm.lower()
    return any(k in low for k in LIMB_KW)

def mat_is_wall(o):
    for m in o.data.materials:
        if m and any(k in m.name.lower() for k in NO_CAP_MAT):
            return True
    return False

def mat_base(o):
    if not o.data.materials or not o.data.materials[0]:
        return "misc"
    import re
    return re.sub(r"-\d+$", "", o.data.materials[0].name).strip() or "misc"

def world_bbox(obj):
    mw = obj.matrix_world
    cs = [mw @ Vector(c) for c in obj.bound_box]
    xs=[c.x for c in cs]; ys=[c.y for c in cs]; zs=[c.z for c in cs]
    return (min(xs),min(ys),min(zs)),(max(xs),max(ys),max(zs))

# Gom object từ các collection chỉ định
objs = []
for cname in col_names:
    col = bpy.data.collections.get(cname)
    if not col:
        print("WARN missing collection", cname); continue
    for o in col.all_objects:
        if o.type == 'MESH':
            objs.append(o)
print("CANDIDATES", len(objs))

for o in bpy.data.objects:
    try: o.select_set(False)
    except: pass

kept = []
deleted = 0
for o in objs:
    try:
        (xmn,ymn,zmn),(xmx,ymx,zmx) = world_bbox(o)
    except Exception:
        continue
    xc = (xmn + xmx) / 2
    is_hero = o.name in HERO_NAMES
    # Xoá nếu: hẳn ngoài dải bụng / tâm lệch bên (tay-chân bên) / tên là chi.
    # Hero KHÔNG bị lọc theo X (VD Kidney.r có thể lệch phải hơn ngưỡng chung).
    if zmn > Z_TOP or zmx < Z_BOT or limb_name(o.name) or (not is_hero and abs(xc) > X_ARM):
        try:
            bpy.data.objects.remove(o, do_unlink=True); deleted += 1
        except: pass
        continue
    kept.append(o)
print("KEPT", len(kept), "DELETED", deleted)

def bisect_obj(o, do_cap, do_xclip=True):
    me = o.data
    bm = bmesh.new(); bm.from_mesh(me)
    mw = o.matrix_world; mwi = mw.inverted()
    planes = [
        (Vector((0,0,Z_TOP)),  Vector((0,0,1)),  True,  do_cap),
        (Vector((0,0,Z_BOT)),  Vector((0,0,1)),  False, False),
    ]
    if do_xclip:
        planes += [
            (Vector((X_CLIP,0,0)), Vector((1,0,0)),  True,  False),
            (Vector((-X_CLIP,0,0)),Vector((1,0,0)),  False, False),
        ]
    for co_w, no_w, keep_neg, cap in planes:
        co_local = mwi @ co_w
        no_local = (mwi.to_3x3() @ no_w).normalized()
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        res = bmesh.ops.bisect_plane(bm, geom=geom, dist=1e-6,
                                     plane_co=co_local, plane_no=no_local,
                                     clear_inner=(not keep_neg),
                                     clear_outer=keep_neg)
        if cap:
            cut = [e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
            if cut:
                try: bmesh.ops.edgeloop_fill(bm, edges=cut)
                except Exception:
                    try: bmesh.ops.triangle_fill(bm, edges=cut, use_beauty=True)
                    except: pass
    try:
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    except Exception:
        pass
    bm.to_mesh(me)
    me.update()
    bm.free()

capped = 0
for o in list(kept):
    try:
        # Hero KHÔNG cắt X (giữ nguyên hình dạng thật để label/bbox chuẩn).
        bisect_obj(o, do_cap=not mat_is_wall(o), do_xclip=(o.name not in HERO_NAMES))
        capped += 1
    except Exception as e:
        print("BISECT FAIL", o.name, str(e)[:60])
print("CAPPED", capped)

for o in list(kept):
    if o.type=='MESH' and len(o.data.vertices)==0:
        try:
            bpy.data.objects.remove(o, do_unlink=True); kept.remove(o)
        except: pass

# KHÔNG gộp (join) theo tên material nữa: Z-Anatomy TÁI SỬ DỤNG tên material
# dùng chung giữa các cơ quan không liên quan (VD "Right atrium" từng dính
# material tên "Trapezius" của cơ lưng) — join theo tên material đã LÀM
# HỎNG GIẢI PHẪU (dính nhầm tim vào cơ lưng thành 1 khối). Giữ mỗi object
# riêng biệt, chỉ giảm poly từng cái — an toàn, không đổi danh tính mesh.
merged = [o for o in kept if o.name not in HERO_NAMES]
print("NON-HERO (giữ riêng, sẽ giảm poly)", len(merged))

# Giảm poly khối đã gộp (không phải hero) — decimate_collapse qua bmesh, ratio
# thấp vẫn đủ nhận diện hình khối/màu ở bối cảnh nền, không cần chi tiết mịn.
DECIMATE_RATIO = 0.35
decimated = 0
for o in merged:
    if o.name in HERO_NAMES:
        continue
    try:
        mod = o.modifiers.new(name="Decimate", type='DECIMATE')
        mod.ratio = DECIMATE_RATIO
        with bpy.context.temp_override(active_object=o, object=o, selected_objects=[o],
                                        selected_editable_objects=[o]):
            bpy.ops.object.modifier_apply(modifier=mod.name)
        decimated += 1
    except Exception as e:
        print("DECIMATE FAIL", o.name, str(e)[:80])
print("DECIMATED", decimated, "/", len(merged) - len(HERO_NAMES & {o.name for o in merged}))

final = [o for o in bpy.data.objects
         if o.type=='MESH' and (o in merged or o.name in HERO_NAMES) and len(o.data.vertices)>0]
for o in final:
    o.hide_viewport=False
    try: o.hide_set(False)
    except: pass
    o.select_set(True)
total_tris = sum(len(o.data.polygons) for o in final)
print("EXPORT", len(final), "approx_tris", total_tris)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
