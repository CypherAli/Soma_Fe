import bpy, sys
from mathutils import Vector

# Nhập Rectum + Ileocecal junction từ BodyParts3D (nguồn gốc chuẩn CC BY-SA
# 2.1 JP mà Z-Anatomy cũng dẫn xuất từ đó) để bù 2 cấu trúc KHÔNG có trong
# Startup.blend hiện tại. Đã verify: trục X/Z của file OBJ gốc BodyParts3D
# TRÙNG HỆ QUY CHIẾU với Z-Anatomy (cùng đơn vị mm->m, cùng chiều) khi import
# với forward_axis='Y', up_axis='Z' (KHÔNG dùng mặc định của Blender — mặc
# định tự xoay trục theo quy ước OBJ Y-up, làm sai lệch hoàn toàn). Trục Y
# (độ sâu trước-sau) bị lệch gốc toạ độ giữa 2 bộ dữ liệu — bù bằng offset
# đo thực nghiệm (khớp tâm bbox với Sigmoid colon / Ascending colon).

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
rectum_path = argv[1]
ileocecal_path = argv[2]

def world_bbox(obj):
    mw = obj.matrix_world
    cs = [mw @ Vector(c) for c in obj.bound_box]
    xs=[c.x for c in cs]; ys=[c.y for c in cs]; zs=[c.z for c in cs]
    return (min(xs),min(ys),min(zs)),(max(xs),max(ys),max(zs))

before = set(bpy.data.objects.keys())
bpy.ops.wm.obj_import(filepath=rectum_path, forward_axis='Y', up_axis='Z')
bpy.ops.wm.obj_import(filepath=ileocecal_path, forward_axis='Y', up_axis='Z')
after = set(bpy.data.objects.keys())
new_objs = {o.name: o for o in (bpy.data.objects[n] for n in (after - before))}

rectum = new_objs.get("FJ2571")
ileocecal = new_objs.get("FJ2599")
rectum.name = "Rectum"
ileocecal.name = "Ileocecal junction"

for o in (rectum, ileocecal):
    o.scale = (0.001, 0.001, 0.001)
bpy.context.view_layer.update()

# Offset Y đo thực nghiệm (xem import_bp3d_test.py) — khớp tâm bbox với
# cấu trúc Z-Anatomy liền kề đã biết vị trí đúng.
rectum.location.y += 0.0895
ileocecal.location.x += -0.0225
ileocecal.location.y += 0.109
bpy.context.view_layer.update()

for o in (rectum, ileocecal):
    (xmn,ymn,zmn),(xmx,ymx,zmx) = world_bbox(o)
    print(f"FINAL_BBOX|{o.name}|x=({xmn:.3f},{xmx:.3f})|y=({ymn:.3f},{ymx:.3f})|z=({zmn:.3f},{zmx:.3f})")

sigmoid = bpy.data.objects.get("Sigmoid colon")
ascending = bpy.data.objects.get("Descending colon")  # dùng làm neo bổ sung nếu cần
appendix = bpy.data.objects.get("Vermiform appendix")
ascending_colon = bpy.data.objects.get("Ascending colon")

kept = [rectum, ileocecal]
for extra in [sigmoid, ascending_colon, appendix, bpy.data.objects.get("Transverse colon"),
              bpy.data.objects.get("Descending colon")]:
    if extra:
        kept.append(extra)

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
