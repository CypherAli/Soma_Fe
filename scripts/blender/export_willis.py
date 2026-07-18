import bpy, sys

# Đa giác Willis: vòng nối động mạch ở nền sọ. Tất cả Curve, bevel_depth
# 0.0005 (AN TOÀN) trừ Anterior communicating artery vốn đã là Mesh sẵn.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]

curve_names = [
    "Anterior cerebral artery.l", "Anterior cerebral artery.r",
    "Internal carotid artery.l", "Internal carotid artery.r",
    "Posterior communicating artery.l", "Posterior communicating artery.r",
    "Posterior cerebral artery.l", "Posterior cerebral artery.r",
    "Basilar artery", "Vertebral artery.l", "Vertebral artery.r",
]
mesh_names = ["Anterior communicating artery"]

converted = []
for nm in curve_names:
    o = bpy.data.objects.get(nm)
    if not o or o.type != 'CURVE':
        print("MISSING", nm); continue
    # Nhiều cặp trái/phải Z-Anatomy DÙNG CHUNG 1 curve data-block (chỉ khác
    # transform mirror) — convert thẳng làm mất object còn lại dùng chung
    # data đó (đã verify thật: 5/5 cặp .l/.r trong Circle of Willis đều
    # same_data=True). Tách bản sao data RIÊNG trước khi convert.
    if o.data.users > 1:
        o.data = o.data.copy()
    with bpy.context.temp_override(active_object=o, object=o,
                                    selected_objects=[o], selected_editable_objects=[o]):
        bpy.ops.object.convert(target='MESH')
    if o.type == 'MESH' and len(o.data.vertices) > 0:
        converted.append(o)
    else:
        print("CONVERT_EMPTY", nm)
print("CONVERTED", len(converted))

kept = list(converted)
for nm in mesh_names:
    o = bpy.data.objects.get(nm)
    if o:
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

total_tris = sum(len(o.data.polygons) for o in kept if o.type == 'MESH')
print("EXPORT", len(kept), "approx_tris", total_tris)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
