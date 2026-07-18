import bpy, sys

# Sửa lỗ hổng lớn: export_multi.py gốc chỉ lấy o.type=='MESH' nên bỏ sót
# TOÀN BỘ 654 object mạch máu (Curve) trong collection "5: Cardiovascular
# system" — /viewer full-body chỉ có tim + 3 mạch nhỏ vùng đầu (22 mesh),
# không hề có động mạch chủ hay bất kỳ mạch lớn nào. Áp dụng kỹ thuật
# Curve->Mesh đã verify AN TOÀN trong phiên digestive (KHÔNG đổi bevel_depth,
# xem project memory) cho TẤT CẢ curve, không riêng 1-2 cái.
#
# Giảm bevel_resolution trước khi convert (mặc định nhiều nguồn cao ->
# nhiều cạnh quanh ống, không cần thiết ở khoảng cách xem toàn thân) +
# decimate nhẹ sau đó để giữ file đủ nhẹ cho ~650+ object cùng lúc.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]

col = bpy.data.collections.get("5: Cardiovascular system")
mesh_objs = [o for o in col.all_objects if o.type == 'MESH']
curve_objs = [o for o in col.all_objects if o.type == 'CURVE']
print("MESH_COUNT", len(mesh_objs), "CURVE_COUNT", len(curve_objs))

converted = []
failed = 0
for o in curve_objs:
    try:
        o.data.bevel_resolution = min(o.data.bevel_resolution, 2)
        with bpy.context.temp_override(active_object=o, object=o,
                                        selected_objects=[o], selected_editable_objects=[o]):
            bpy.ops.object.convert(target='MESH')
        if o.type == 'MESH' and len(o.data.vertices) > 0:
            converted.append(o)
        else:
            failed += 1
    except Exception as e:
        failed += 1
        print("CONVERT_FAIL", o.name, str(e)[:80])
print("CONVERTED", len(converted), "FAILED", failed)

# Decimate nhẹ mọi mesh mạch máu (không phải hero, không cần chi tiết mịn ở
# tầm nhìn toàn thân) để kiểm soát dung lượng — cùng kỹ thuật cut_abdomen.py.
decimated = 0
for o in converted:
    try:
        mod = o.modifiers.new(name="Decimate", type='DECIMATE')
        mod.ratio = 0.5
        with bpy.context.temp_override(active_object=o, object=o, selected_objects=[o],
                                        selected_editable_objects=[o]):
            bpy.ops.object.modifier_apply(modifier=mod.name)
        decimated += 1
    except Exception as e:
        print("DECIMATE_FAIL", o.name, str(e)[:80])
print("DECIMATED", decimated)

kept = mesh_objs + converted
for o in bpy.data.objects:
    try: o.select_set(False)
    except Exception: pass
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    try:
        o.select_set(True)
    except Exception:
        pass

total_tris = sum(len(o.data.polygons) for o in kept if o.type == 'MESH' and len(o.data.vertices) > 0)
print("EXPORT", len(kept), "approx_tris", total_tris)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
