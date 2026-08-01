import bpy, sys
from mathutils import Vector

# CÁNH TAY v3 — chuẩn giáo trình: xương + cơ + mạc + TRỌN mạch/thần kinh/bạch huyết
# của chi trên PHẢI, lọc theo KHÔNG GIAN (bounding box cánh tay) nên đủ nhánh,
# không lẫn chân. Curve không bevel -> thêm bevel_depth nhỏ để thành ống.
# Dùng: blender --background Startup.blend --python export_arm_v3.py -- out.glb

OUT = sys.argv[sys.argv.index('--') + 1:][0]

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

def world_bbox(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    mn = Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs)))
    mx = Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs)))
    return mn, mx

# 1) XƯƠNG + CƠ + MẠC từ nhóm vùng Right upper limb -> đồng thời tính bbox cánh tay
region = bpy.data.collections.get("Right upper limb")
kept = []
solids = []  # xương+cơ, dùng để bọc da
BMN = Vector((1e9, 1e9, 1e9)); BMX = Vector((-1e9, -1e9, -1e9))
DROP = ["bursa", "sheath", "retinaculum", "fascia"]  # bỏ mạc: da voxel thay thế
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, "?")
    nm = o.name.lower()
    if s.startswith("1:") or (s.startswith("4:") and not any(k in nm for k in DROP)):
        kept.append(o); solids.append(o)
        mn, mx = world_bbox(o)
        for i in range(3):
            BMN[i] = min(BMN[i], mn[i]); BMX[i] = max(BMX[i], mx[i])

# nới bbox 12%
pad = (BMX - BMN) * 0.12
BMN -= pad; BMX += pad
print("ARM_BBOX", [round(v,3) for v in BMN], [round(v,3) for v in BMX])

def center_in_bbox(o):
    mn, mx = world_bbox(o)
    c = (mn + mx) / 2
    return all(BMN[i] <= c[i] <= BMX[i] for i in range(3))

def mostly_in_bbox(o):
    # Trọn cấu trúc nằm trong vùng tay (nới thêm chút ở đầu) -> bỏ phần trườn về thân
    mn, mx = world_bbox(o)
    lo = BMN.copy(); hi = BMX.copy()
    ext = (BMX - BMN) * 0.06
    lo -= ext; hi += ext
    return all(lo[i] <= mn[i] and mx[i] <= hi[i] for i in range(3))

# 2) MẠCH (hệ 5) + THẦN KINH (hệ 7): lấy curve trong bbox cánh tay, convert -> ống
def collect_curves(coll):
    c = bpy.data.collections.get(coll)
    out = []
    for o in c.all_objects:
        if o.type != 'CURVE' or o.name.endswith(('.j', '.t', '.g')):
            continue
        if not o.name.lower().endswith('.r'):
            continue
        try:
            if mostly_in_bbox(o):  # trọn trong vùng tay -> bỏ mạch/tk trườn về thân
                out.append(o)
        except Exception:
            pass
    return out

nerve_curves = collect_curves("7: Nervous system & Sense organs")
vessel_curves = collect_curves("5: Cardiovascular system")
print("ARM_NERVE_CURVES", len(nerve_curves), "ARM_VESSEL_CURVES", len(vessel_curves))

conv_ok = 0
tubes = []  # ống mạch/tk (để da bọc luôn)
for o in nerve_curves + vessel_curves:
    o.data = o.data.copy()  # single-user
    # thêm bevel nếu curve chưa có độ dày (không thì ra mesh rỗng/vô hình)
    if getattr(o.data, "bevel_depth", 0.0) == 0.0 and getattr(o.data, "bevel_object", None) is None:
        o.data.bevel_depth = 0.0011
        o.data.bevel_resolution = 1
    # API: đánh giá bevel -> mesh, KHÔNG cần operator (tránh view-layer excluded)
    dg = bpy.context.evaluated_depsgraph_get()
    oe = o.evaluated_get(dg)
    try:
        me = bpy.data.meshes.new_from_object(oe)
    except Exception:
        continue
    if not me or len(me.vertices) < 4 or len(me.polygons) < 1:
        continue
    nb = bpy.data.objects.new("tube_" + o.name, me)
    bpy.context.scene.collection.objects.link(nb)
    nb.matrix_world = o.matrix_world.copy()
    kept.append(nb); tubes.append(nb); conv_ok += 1
print("CURVE_CONVERTED", conv_ok)

# 3) BẠCH HUYẾT (hệ 6): mesh trong bbox cánh tay
lymph = bpy.data.collections.get("6: Lymphoid organs")
ln = 0
for o in lymph.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 6 or o.name.endswith(('.j', '.t', '.g')):
        continue
    if not o.name.lower().endswith('.r'):
        continue
    try:
        if center_in_bbox(o):
            kept.append(o); ln += 1
    except Exception:
        pass
print("ARM_LYMPH", ln)

# 4b) DA FULL — bọc voxel toàn bộ xương+cơ (phủ cả bàn tay)
try:
    bpy.ops.object.select_all(action='DESELECT')
    dupes = []
    for o in solids:  # CHỈ xương+cơ -> silhouette sạch, không bị mạch/tk làm chồng lớp
        d = o.copy(); d.data = o.data.copy()
        bpy.context.scene.collection.objects.link(d)
        d.matrix_world = o.matrix_world.copy()
        dupes.append(d)
    bpy.context.view_layer.objects.active = dupes[0]
    for d in dupes:
        d.select_set(True)
    bpy.ops.object.join()
    env = bpy.context.view_layer.objects.active
    rm = env.modifiers.new("rm", 'REMESH'); rm.mode = 'VOXEL'; rm.voxel_size = 0.005
    sm = env.modifiers.new("sm", 'SMOOTH'); sm.iterations = 3; sm.factor = 0.9
    dm = env.modifiers.new("dec", 'DECIMATE'); dm.ratio = 0.5
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
    # thổi phồng ra ngoài + shade smooth (hết facet "ảo")
    import bmesh
    bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
    for v in bm.verts:
        v.co += v.normal * 0.011
    bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    skin = bpy.data.objects.new("Skin envelope", me)
    bpy.context.scene.collection.objects.link(skin)
    skin.matrix_world = env.matrix_world.copy()
    kept.append(skin)
    print("SKIN_TRIS", len(me.polygons))
except Exception as e:
    print("SKIN_FAIL", repr(e))

# ---- export ----
bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

tris = sum(len(o.data.polygons) for o in kept if o.type == 'MESH')
print("EXPORT_ARM_V3 meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
