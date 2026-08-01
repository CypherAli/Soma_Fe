import bpy, sys

# Export sọ 3D (cranium + mặt + hàm) từ Z-Anatomy cho hero turntable.
# Loại: răng lẻ (chỉ có molar → nham nhở), xoang (nội), xương móng (rời).
# Decimate TỪNG mesh (không join — tránh dính danh tính). Nén Draco.
#
# Dùng: blender --background Startup.blend --python export_skull.py -- public/models/skull.glb

OUT = sys.argv[sys.argv.index('--') + 1:][0]

KEYS = ["frontal bone", "parietal", "occipital", "temporal bone", "sphenoid",
        "ethmoid", "nasal bone", "lacrimal", "maxilla", "zygomatic", "palatine",
        "inferior nasal concha", "vomer", "mandible"]
EXCLUDE = ["tooth", "molar", "hyoid", "sinus", "cells of ethmoid"]

def want(nm):
    n = nm.lower()
    if any(x in n for x in EXCLUDE):
        return False
    return any(k in n for k in KEYS)

coll = bpy.data.collections.get("1: Skeletal system")
pool = list(coll.all_objects) if coll else list(bpy.data.objects)

kept = []
for o in pool:
    if o.name.endswith(('.j', '.t', '.g')):
        continue
    if o.type != 'MESH' or len(o.data.vertices) < 10:
        continue
    if not want(o.name):
        continue
    kept.append(o)

# reset selection + visibility
for o in bpy.data.objects:
    try: o.select_set(False)
    except Exception: pass

bpy.ops.object.select_all(action='DESELECT')

for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

# Không decimate: 65k verts đủ nhẹ + mesh .l/.r share data (apply modifier lỗi).
tris = sum(len(o.data.polygons) for o in kept)
print("EXPORT_SKULL meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
