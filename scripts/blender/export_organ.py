import bpy, sys

# Script CHUNG cho scene "cô lập cơ quan" (không cắt/không bịt nắp) — dùng khi
# cấu trúc cần thiết đã là mesh RIÊNG BIỆT KHÉP KÍN sẵn trong Z-Anatomy (VD 8
# phân thuỳ Couinaud của gan), khác với cut_abdomen.py phải bisect+cap vì cắt
# ngang một khối liền (mặt cắt cơ thể).
#
# Dùng: blender --background Startup.blend --python export_organ.py -- out.glb "Tên object 1" "Tên object 2" ...

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
names = argv[1:]

kept = []
for nm in names:
    o = bpy.data.objects.get(nm)
    if not o or o.type != 'MESH':
        print("MISSING", nm)
        continue
    kept.append(o)

for o in bpy.data.objects:
    try:
        o.select_set(False)
    except Exception:
        pass

for o in kept:
    o.hide_viewport = False
    try:
        o.hide_set(False)
    except Exception:
        pass
    o.select_set(True)

total_tris = sum(len(o.data.polygons) for o in kept)
print("EXPORT", len(kept), "approx_tris", total_tris)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
