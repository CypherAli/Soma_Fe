import bpy, sys

# Hệ tiết niệu tổng quan: thận + bể thận + tuyến thượng thận + bàng quang (Mesh
# sẵn) + niệu quản + niệu đạo (Curve → Mesh AN TOÀN, giữ nguyên bevel như bài
# học export_intestine/willis; tách data.copy() cho cặp .l/.r dùng chung block).

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]

mesh_names = [
    "Kidney.l", "Kidney.r",
    "Renal pelvis.l", "Renal pelvis.r",
    "Suprarenal gland.l", "Suprarenal gland.r",
    "Urinary bladder",
]
curve_names = ["Ureter.l", "Ureter.r", "Urethra"]

kept = []
for nm in mesh_names:
    o = bpy.data.objects.get(nm)
    if o and o.type == 'MESH':
        kept.append(o)
    else:
        print("MISSING_MESH", nm)

for nm in curve_names:
    o = bpy.data.objects.get(nm)
    if not o or o.type != 'CURVE':
        print("MISSING_CURVE", nm); continue
    if o.data.users > 1:
        o.data = o.data.copy()
    with bpy.context.temp_override(active_object=o, object=o,
                                    selected_objects=[o], selected_editable_objects=[o]):
        bpy.ops.object.convert(target='MESH')
    if o.type == 'MESH' and len(o.data.vertices) > 0:
        kept.append(o)
    else:
        print("CONVERT_EMPTY", nm)

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
print("KEPT_NAMES", [o.name for o in kept])
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
