# RENDER KIỂM PHÂN MẢNH — tô mỗi vùng một màu rồi chụp một ảnh chiếu trực giao
#
#   blender -b --python render_segments.py -- seg.glb out.png [--axis x]
#
# Bước bắt buộc sau khi chạy `segment_by_seeds.py`: con số phần trăm mặt không
# nói được vùng có bám đúng khối cơ hay không. Phải nhìn. Đây cũng là cách phát
# hiện một vùng ăn lan sang nửa kia con vật — chuyện đã xảy ra khi toạ độ điểm
# mồi còn sai hệ trục.

import bpy, sys, os, math
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
SRC, DST = os.path.abspath(args[0]), os.path.abspath(args[1])
AXIS = args[args.index('--axis') + 1] if '--axis' in args else 'x'
RES = int(args[args.index('--res') + 1] if '--res' in args else 1000)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

meshes = [o for o in bpy.data.objects if o.type == 'MESH' and len(o.data.polygons)]
pts = []
for o in meshes:
    for v in o.data.vertices:
        pts.append(o.matrix_world @ v.co)
mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
centre = (mn + mx) / 2
size = mx - mn
span = max(size)

# Bảng màu tách bạch nhau về sắc độ, KHÔNG phải màu mô: mục đích ở đây là đọc
# ranh giới cho rõ, không phải nhìn cho đẹp.
PALETTE = [
    (0.90, 0.25, 0.22), (0.20, 0.55, 0.90), (0.95, 0.75, 0.20), (0.30, 0.75, 0.40),
    (0.75, 0.35, 0.85), (0.95, 0.55, 0.20), (0.25, 0.80, 0.80), (0.85, 0.45, 0.60),
    (0.55, 0.75, 0.25), (0.45, 0.40, 0.90), (0.95, 0.40, 0.45), (0.20, 0.70, 0.60),
    (0.80, 0.65, 0.35), (0.60, 0.60, 0.70),
]
for i, m in enumerate(bpy.data.materials):
    c = PALETTE[i % len(PALETTE)]
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (c[0], c[1], c[2], 1.0)
        bsdf.inputs['Roughness'].default_value = 0.85
    print(f'[render] vùng {i}: {m.name}')

PLANE = {'x': ('y', 'z'), 'y': ('x', 'z'), 'z': ('x', 'y')}[AXIS]
uu, vv = PLANE
ortho = max(getattr(size, uu), getattr(size, vv)) * 1.06

cam_data = bpy.data.cameras.new('cam')
cam_data.type = 'ORTHO'
cam_data.ortho_scale = ortho
cam_data.clip_start = span * 0.01
cam_data.clip_end = span * 10
cam = bpy.data.objects.new('cam', cam_data)
bpy.context.collection.objects.link(cam)
dist = span * 3
if AXIS == 'x':
    cam.location = centre + Vector((dist, 0, 0))
    cam.rotation_euler = (math.radians(90), 0, math.radians(90))
elif AXIS == 'y':
    cam.location = centre + Vector((0, -dist, 0))
    cam.rotation_euler = (math.radians(90), 0, 0)
else:
    cam.location = centre + Vector((0, 0, dist))
    cam.rotation_euler = (0, 0, 0)
bpy.context.scene.camera = cam

light = bpy.data.objects.new('key', bpy.data.lights.new('key', 'SUN'))
light.data.energy = 4
light.rotation_euler = (math.radians(50), math.radians(20), math.radians(35))
bpy.context.collection.objects.link(light)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in {
    i.identifier for i in scene.render.bl_rna.properties['engine'].enum_items
} else 'BLENDER_WORKBENCH'
if scene.render.engine == 'BLENDER_WORKBENCH':
    # Workbench mặc định tô một màu cho tất cả — phải bảo nó lấy màu vật liệu,
    # không thì ảnh ra xám trơn và cả bước kiểm này thành vô nghĩa.
    scene.display.shading.color_type = 'MATERIAL'
scene.render.resolution_x = scene.render.resolution_y = RES
scene.render.filepath = DST
bpy.ops.render.render(write_still=True)
print(f'[render] ĐÃ GHI {DST}')
