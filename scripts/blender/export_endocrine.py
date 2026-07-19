import bpy, sys

# Hệ nội tiết tổng quan: các tuyến nội tiết chính ở đúng vị trí cơ thể, từ
# tuyến yên/tùng (trong sọ, Z~1.6) xuống tuyến giáp (cổ) → tuyến ức (ngực) →
# tuyến thượng thận + tuỵ (bụng trên, Z~1.1). Tất cả Mesh khép kín sẵn.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]

mesh_names = [
    "Adenohypophysis", "Neurohypophysis", "Pineal gland",
    "Thyroid gland",
    "Left lobe of thymus", "Right lobe of thymus",
    "Suprarenal gland.l", "Suprarenal gland.r",
    "Pancreas",
]

kept = []
for nm in mesh_names:
    o = bpy.data.objects.get(nm)
    if o and o.type == 'MESH':
        kept.append(o)
    else:
        print("MISSING", nm)

for o in bpy.data.objects:
    try: o.select_set(False)
    except Exception: pass
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

total_tris = sum(len(o.data.polygons) for o in kept)
print("EXPORT", len(kept), "tris", total_tris)
print("KEPT_NAMES", [o.name for o in kept])
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
