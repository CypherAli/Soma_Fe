import bpy, sys

# Giải phẫu Mắt (mắt trái): nhãn cầu (củng mạc + giác mạc + thuỷ tinh thể +
# võng mạc) + 6 cơ vận nhãn + cơ nâng mi. BỎ thể kính (vitreous body) vì khối
# gel này lấp đầy nhãn cầu, che khuất mọi cấu trúc bên trong. Tất cả Mesh sẵn.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]

mesh_names = [
    "Sclera.l", "Cornea.l", "Lens.l", "Retina.l",
    "Superior rectus muscle.l", "Inferior rectus muscle.l",
    "Medial rectus muscle.l", "Lateral rectus muscle.l",
    "Superior oblique muscle.l", "Inferior oblique muscle.l",
    "Levator palpebrae superioris.l",
    "Trochlea of superior oblique muscle.l",
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
