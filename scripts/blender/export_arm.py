import bpy, sys

# Export CÁNH TAY (chi trên PHẢI) đầy đủ từ Z-Anatomy.
# Nguồn: nhóm vùng "Right upper limb" (Z-Anatomy tự gom đúng giải phẫu).
# Giữ: xương (hệ 1) + cơ thật (hệ 4). Loại: mạc/bao/bao gân/hãm gân (bọc ngoài
# che cơ), mesh nhóm vùng (hệ 9), khớp (hệ 3, để lộ cơ). Nén Draco.
#
# Dùng: blender --background Startup.blend --python export_arm.py -- public/models/arm.glb

OUT = sys.argv[sys.argv.index('--') + 1:][0]

CLUTTER = ["fascia", "bursa", "sheath", "retinaculum"]

# map object -> hệ cấp 1
sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

region = bpy.data.collections.get("Right upper limb")
kept = []
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10:
        continue
    if o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, "?")
    if not (s.startswith("1:") or s.startswith("4:")):
        continue  # chỉ xương + cơ
    if any(k in o.name.lower() for k in CLUTTER):
        continue  # bỏ mạc/bao che cơ
    kept.append(o)

bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

tris = sum(len(o.data.polygons) for o in kept)
print("EXPORT_ARM meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
