# -*- coding: utf-8 -*-
"""Render ảnh minh hoạ VỊ TRÍ TỔN THƯƠNG cho từng bệnh, từ model của dự án.

Vì sao không dùng hình quét từ giáo trình: hình vẽ và ảnh lâm sàng là phần
được bảo hộ bản quyền chặt nhất. Render từ model của chính dự án cho ảnh gốc,
đồng bộ phong cách với viewer 3D, và thể hiện được đúng mesh tổn thương đã
neo trong lesion-map.ts — thứ mà một hình quét tĩnh không làm được.

    blender -b --factory-startup --python render_lesion.py -- \
        <model.glb> <"Tên mesh gốc"> <out.png> [zoom] [góc]

Bẫy đã dính, giữ nguyên cách xử lý:
  • render.filepath phải là đường dẫn TUYỆT ĐỐI. Sau read_factory_settings,
    đường dẫn tương đối được hiểu theo gốc ổ đĩa nên ảnh ghi lạc chỗ mà Blender
    vẫn báo "RENDERED" bình thường — không có lỗi để mà biết.
  • So khớp tên mesh theo tên GỐC trong glTF (có khoảng trắng, có dấu chấm),
    không phải tên đã sanitize ở runtime web.
  • Model đối xứng hai bên: chỉ giữ mesh khớp chính xác, các hậu tố .l/.r được
    coi là cùng một cấu trúc và đều được tô sáng.
"""
import math
import os
import sys

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
GLB = os.path.abspath(args[0])
TARGET = args[1]
OUT = os.path.abspath(args[2])
ZOOM = float(args[3]) if len(args) > 3 else 1.0
ANGLE = args[4] if len(args) > 4 else "front"

HILITE = (0.78, 0.26, 0.18, 1.0)   # đất nung, cùng tông --acc của site
CONTEXT = (0.86, 0.83, 0.77, 1.0)  # giấy ngà cho mô xung quanh
CONTEXT_ALPHA = 0.24

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)


def is_target(name: str) -> bool:
    """Khớp mesh đích, chấp nhận hậu tố bên .l/.r và hậu tố nhân bản .001."""
    raw = name
    for suffix in (".l", ".r", ".L", ".R"):
        if raw.endswith(suffix):
            raw = raw[: -len(suffix)]
    return raw == TARGET or name == TARGET


def make_mat(name, rgba, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = 0.55
    if alpha < 1.0:
        bsdf.inputs["Alpha"].default_value = alpha
        m.blend_method = "BLEND"
    return m


mat_hi = make_mat("lesion_hi", HILITE)
mat_ctx = make_mat("lesion_ctx", CONTEXT, CONTEXT_ALPHA)

hits = []
for ob in list(bpy.context.scene.objects):
    if ob.type != "MESH":
        continue
    ob.data.materials.clear()
    if is_target(ob.name):
        ob.data.materials.append(mat_hi)
        hits.append(ob)
    else:
        ob.data.materials.append(mat_ctx)

if not hits:
    print(f"LESION_NOT_FOUND {TARGET}")
    sys.exit(3)
print(f"LESION_HIT {len(hits)} mesh")

# Khung hình bám vào mesh tổn thương, không phải cả model — nếu bám cả model
# thì mọi bệnh đều ra một tấm ảnh toàn thân giống hệt nhau.
lo = Vector((1e9, 1e9, 1e9))
hi = Vector((-1e9, -1e9, -1e9))
for ob in hits:
    for corner in ob.bound_box:
        p = ob.matrix_world @ Vector(corner)
        lo = Vector((min(lo[i], p[i]) for i in range(3)))
        hi = Vector((max(hi[i], p[i]) for i in range(3)))
centre = (lo + hi) / 2
radius = max((hi - lo).length / 2, 1e-4)

# Giữ lại mô xung quanh trong bán kính hẹp, XOÁ phần ở xa. Để nguyên cả 122
# mesh ổ bụng thì các mặt trong suốt chồng lên nhau thành một mảng nhiễu trắng,
# không đọc được cơ quan nào với cơ quan nào.
CONTEXT_R = radius * 7.0
removed = 0
for ob in list(bpy.context.scene.objects):
    if ob.type != "MESH" or ob in hits:
        continue
    c = ob.matrix_world @ (Vector(ob.bound_box[0]) + Vector(ob.bound_box[6])) / 2
    if (c - centre).length > CONTEXT_R:
        bpy.data.objects.remove(ob, do_unlink=True)
        removed += 1
print(f"CONTEXT giữ lại trong bán kính {CONTEXT_R:.3f}, xoá {removed} mesh ở xa")

print(f"BBOX centre={tuple(round(v,4) for v in centre)} radius={radius:.4f}")

scene = bpy.context.scene
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 50
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

dist = radius * 8.5 * ZOOM
rad = {"front": 0.0, "back": math.pi, "left": -math.pi / 2, "right": math.pi / 2}.get(ANGLE, 0.0)
cam.location = centre + Vector((math.sin(rad) * dist, -math.cos(rad) * dist, dist * 0.30))
direction = centre - cam.location
cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

key = bpy.data.objects.new("key", bpy.data.lights.new("key", type="AREA"))
# Công suất đèn vùng phải tỉ lệ với BÌNH PHƯƠNG KHOẢNG CÁCH (nghịch đảo bình
# phương), không phải với bình phương bán kính vật. Đặt theo radius khiến ảnh
# cháy trắng ~2e4 lần khi vật nhỏ như túi mật.
key.data.energy = 45 * (dist ** 2)
key.data.size = radius * 4
key.location = centre + Vector((dist * 0.6, -dist * 0.7, dist * 0.8))
scene.collection.objects.link(key)

fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", type="AREA"))
fill.data.energy = key.data.energy * 0.35
fill.data.size = radius * 6
fill.location = centre + Vector((-dist * 0.8, -dist * 0.4, 0))
scene.collection.objects.link(fill)

# Tên engine EEVEE đổi giữa các bản Blender (BLENDER_EEVEE / BLENDER_EEVEE_NEXT).
# Dò trong danh sách hợp lệ thay vì đặt cứng, không thì script chết ở máy khác.
_engines = bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items.keys()
scene.render.engine = next(
    (e for e in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE") if e in _engines), "BLENDER_WORKBENCH"
)
print("ENGINE " + scene.render.engine)
# View transform mặc định (AgX/Filmic) làm nhạt hẳn màu bão hoà — màu đất nung
# đặt ở HILITE ra thành nâu xám. Dùng Standard để màu render đúng như khai báo.
try:
    scene.view_settings.view_transform = "Standard"
except TypeError:
    pass
scene.render.resolution_x = 1000
scene.render.resolution_y = 750
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print(f"RENDERED {OUT}")
