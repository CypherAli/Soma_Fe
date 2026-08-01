import bpy, sys

# CÁNH TAY FLAGSHIP (chi trên phải): xương + cơ + động mạch + tĩnh mạch + thần kinh.
# - Xương/cơ: mesh từ nhóm vùng "Right upper limb" (đúng giải phẫu).
# - Mạch/thần kinh: curve (hệ 5/7) → convert sang ống mesh, giữ nguyên bevel.
# - Tô màu giải phẫu chuẩn NGAY khi export (bake vào glb).
# Dùng: blender --background Startup.blend --python export_arm_v2.py -- out.glb

OUT = sys.argv[sys.argv.index('--') + 1:][0]

# ---- màu theo lớp (dùng NODE Base Color để export đúng sang glTF) ----
def mat(name, rgb):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (rgb[0], rgb[1], rgb[2], 1)
    b.inputs["Roughness"].default_value = 0.72
    b.inputs["Metallic"].default_value = 0.0
    m.diffuse_color = (rgb[0], rgb[1], rgb[2], 1)
    return m
M_BONE   = mat("arm_bone",   (0.91, 0.86, 0.75))
M_MUSCLE = mat("arm_muscle", (0.62, 0.17, 0.14))
M_ARTERY = mat("arm_artery", (0.75, 0.15, 0.12))
M_VEIN   = mat("arm_vein",   (0.16, 0.30, 0.60))
M_NERVE  = mat("arm_nerve",  (0.86, 0.72, 0.20))

def set_mat(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

# Giữ FASCIA làm lớp vỏ ngoài (da surrogate); chỉ bỏ túi hoạt dịch/bao gân/hãm gân
CLUTTER = ["bursa", "sheath", "retinaculum"]
kept = []

# 1) XƯƠNG + CƠ (mesh) từ Right upper limb
region = bpy.data.collections.get("Right upper limb")
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, "?")
    nm = o.name.lower()
    if s.startswith("1:"):
        set_mat(o, M_BONE); kept.append(o)
    elif s.startswith("4:") and not any(k in nm for k in CLUTTER):
        set_mat(o, M_MUSCLE); kept.append(o)

# 2) MẠCH + THẦN KINH (curve → mesh), bên phải, đặc trưng cánh tay
FACE_LEG = ["maxillary", "mandibular", "trigeminal", "facial", "ophthalmic",
            "femoral", "sciatic", "tibial", "peroneal", "saphenous", "obturator",
            "of thigh", "of leg", "plantar", "of foot", "sural", "gluteal"]
NERVE_K = ["median nerve", "ulnar nerve", "radial nerve", "musculocutaneous",
           "axillary nerve", "brachial plexus", "trunk of brachial", "cord of brachial",
           "of median nerve", "of ulnar nerve", "of radial nerve", "of axillary nerve"]
VESSEL_K = ["brachial artery", "deep artery of arm", "radial artery", "ulnar artery",
            "axillary artery", "cephalic vein", "basilic vein", "brachial vein",
            "median cubital", "palmar arch", "radial vein", "ulnar vein", "axillary vein",
            "digital artery", "digital vein", "of the arm", "interosseous artery"]

def collect_curves(coll_name, keys, kind):
    c = bpy.data.collections.get(coll_name)
    picked = []
    for o in c.all_objects:
        if o.type != 'CURVE' or o.name.endswith(('.j', '.t', '.g')):
            continue
        nm = o.name.lower()
        if not nm.endswith('.r'):
            continue
        if any(x in nm for x in FACE_LEG):
            continue
        if not any(k in nm for k in keys):
            continue
        picked.append((o, kind))
    return picked

curve_jobs = collect_curves("7: Nervous system & Sense organs", NERVE_K, "nerve") \
           + collect_curves("5: Cardiovascular system", VESSEL_K, "vessel")
print("CURVE_JOBS", len(curve_jobs))
_cok = 0

for o, kind in curve_jobs:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.data = o.data.copy()  # single-user
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    try:
        bpy.ops.object.convert(target='MESH')
    except Exception as e:
        print("CONV_FAIL", o.name, e); continue
    if o.type != 'MESH' or len(o.data.vertices) < 4:
        print("SKIP_SMALL", o.name, o.type, len(o.data.vertices) if o.type=='MESH' else '-')
        continue
    _cok += 1
    kept.append(o)  # màu do VIEWER tô theo tên
print("CURVE_CONVERTED", _cok)

# ---- export ----
bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

tris = sum(len(o.data.polygons) for o in kept)
print("EXPORT_ARM_V2 meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True, export_materials='EXPORT')
print("DONE", OUT)
