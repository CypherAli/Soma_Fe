import bpy, sys

# Động mạch vành + tĩnh mạch tim: đều là Curve, bevel_depth 0.0005 (AN TOÀN,
# giống Jejunum/Bile duct đã verify) — KHÔNG đổi bevel_depth. Xuất kèm 4
# buồng tim nguyên khối (không cắt) làm bối cảnh giải phẫu.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]

curve_names = [
    "Left coronary artery", "Right coronary artery", "Anterior interventricular artery",
    "Right inferolateral branch of right coronary artery",
    "Septal branches of anterior interventricular artery", "Coronary sinus",
    "Inferior vein of left ventricle", "Inferior vein of left ventricle (//Posterior '')",
]
mesh_context_names = ["Left atrium", "Right atrium", "Left ventricle", "Right ventricle", "Pulmonary trunk"]

converted = []
for nm in curve_names:
    o = bpy.data.objects.get(nm)
    if not o or o.type != 'CURVE':
        print("MISSING", nm); continue
    with bpy.context.temp_override(active_object=o, object=o,
                                    selected_objects=[o], selected_editable_objects=[o]):
        bpy.ops.object.convert(target='MESH')
    if o.type == 'MESH' and len(o.data.vertices) > 0:
        converted.append(o)
    else:
        print("CONVERT_EMPTY", nm)
print("CONVERTED", len(converted))

kept = list(converted)
for nm in mesh_context_names:
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
