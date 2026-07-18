import bpy, sys

# Scene tổng quan toàn hệ tiêu hoá — gộp mọi mesh THẬT đã xác nhận từ các
# scene riêng lẻ trước đó (không cắt/không bịt nắp, chỉ lắp ráp nguyên khối
# đúng vị trí gốc trong Startup.blend). Jejunum là Curve nên convert riêng
# (đã test an toàn, xem query_jejunum.py/test_jejunum_convert.py). Rectum +
# Ileocecal junction lấy từ BodyParts3D (không có trong Startup.blend, xem
# cut_colon_v2.py để biết chi tiết offset toạ độ đã verify).

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
rectum_path = argv[1]
ileocecal_path = argv[2]

mesh_names = [
    "Posterior segment of liver (I)",
    "Left posterior lateral segment of liver (II)",
    "Left anterior lateral segment of liver (III)",
    "Left medial segment of liver (IV)",
    "Anterior medial segment of liver (V)",
    "Anterior lateral segment of liver (VI)",
    "Posterior lateral segment of liver (VII)",
    "Posterior medial segment of liver (VIII)",
    "Gallbladder",
    "Stomach",
    "Duodenum",
    "Pancreas",
    "Ascending colon",
    "Transverse colon",
    "Descending colon",
    "Sigmoid colon",
    "Vermiform appendix",
]

jejunum = bpy.data.objects.get("Jejunum")
if jejunum and jejunum.type == 'CURVE':
    with bpy.context.temp_override(active_object=jejunum, object=jejunum,
                                    selected_objects=[jejunum], selected_editable_objects=[jejunum]):
        bpy.ops.object.convert(target='MESH')
    print("CONVERTED Jejunum")
else:
    print("MISSING Jejunum")

kept = []
for nm in mesh_names:
    o = bpy.data.objects.get(nm)
    if not o:
        print("MISSING", nm); continue
    kept.append(o)
if jejunum:
    kept.append(jejunum)

before_objs = set(bpy.data.objects.keys())
bpy.ops.wm.obj_import(filepath=rectum_path, forward_axis='Y', up_axis='Z')
bpy.ops.wm.obj_import(filepath=ileocecal_path, forward_axis='Y', up_axis='Z')
after_objs = set(bpy.data.objects.keys())
new_objs = {o.name: o for o in (bpy.data.objects[n] for n in (after_objs - before_objs))}
rectum = new_objs.get("FJ2571")
ileocecal = new_objs.get("FJ2599")
if rectum and ileocecal:
    rectum.name = "Rectum"
    ileocecal.name = "Ileocecal junction"
    for o in (rectum, ileocecal):
        o.scale = (0.001, 0.001, 0.001)
    bpy.context.view_layer.update()
    rectum.location.y += 0.0895
    ileocecal.location.x += -0.0225
    ileocecal.location.y += 0.109
    bpy.context.view_layer.update()
    kept.append(rectum)
    kept.append(ileocecal)
else:
    print("MISSING BP3D import")

for o in bpy.data.objects:
    try: o.select_set(False)
    except Exception: pass
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

total_tris = sum(len(o.data.polygons) for o in kept)
print("EXPORT", len(kept), "approx_tris", total_tris)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=True, export_yup=True)
print("DONE", out)
