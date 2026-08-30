# ĐẶT HOTSPOT LÊN MẪU VẬT THÚ Y — công cụ đọc toạ độ từ ảnh
#
#   # 1. Chụp một ảnh chiếu TRỰC GIAO kèm bảng quy đổi:
#   blender -b --python hotspot_probe.py -- <glb> --shot out.png --axis x
#
#   # 2. Nhìn ảnh, chọn điểm theo toạ độ ảnh chuẩn hoá (0..1), rồi bắn tia:
#   blender -b --python hotspot_probe.py -- <glb> --pick 0.42,0.31 0.66,0.55 --axis x
#
# VÌ SAO PHẢI CÓ: mẫu quét thú y là khối liền, tên mesh chỉ là "Object_0" nên
# không thể gắn nhãn theo tên như bên người — hotspot buộc phải đặt theo TOẠ ĐỘ.
# Mà đoán toạ độ bằng mắt trên một hộp bao thì trượt ra ngoài mặt xương ngay.
#
# Chiếu trực giao làm việc đọc toạ độ thành phép tính thẳng: ảnh phẳng, không có
# phối cảnh, nên (u,v) trên ảnh quy đổi tuyến tính ra hai trục thế giới; trục
# còn lại tìm bằng cách bắn tia vào lưới. Kết quả in ra là ĐỘ LỆCH SO VỚI TÂM
# HỘP BAO — đúng hệ toạ độ mà <Center> bên web dựng ra.

import bpy, sys, os, json, math
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
GLB = os.path.abspath(args[0])


def opt(name, default=None):
    return args[args.index(name) + 1] if name in args else default


AXIS = opt('--axis', 'x')          # trục NHÌN DỌC THEO: x = nhìn ngang
SHOT = opt('--shot')
RES = int(opt('--res', '1000'))
MARKS = []
if '--marks' in args:
    for a in args[args.index('--marks') + 1:]:
        if a.startswith('--'):
            break
        MARKS.append(tuple(float(v) for v in a.split(',')))

PICKS = []
if '--pick' in args:
    for a in args[args.index('--pick') + 1:]:
        if a.startswith('--'):
            break
        PICKS.append(tuple(float(v) for v in a.split(',')))

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)

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

# Blender nhập glTF có xoay trục: glTF (X phải, Y lên, Z ra trước) thành Blender
# (X phải, Y ra sau, Z lên). Quy đổi ngược lại lúc in ra để con số dán thẳng vào
# models.ts được, không phải nhớ đổi trục trong đầu.
def to_gltf(v):
    return (v.x, v.z, -v.y)


print(f"[probe] bbox blender x={size.x:.3f} y={size.y:.3f} z={size.z:.3f} span={span:.3f}")
print(f"[probe] centre blender=({centre.x:.3f},{centre.y:.3f},{centre.z:.3f})")

# Hai trục nằm trong mặt phẳng ảnh, ứng với chiều NGANG và DỌC của ảnh.
PLANE = {'x': ('y', 'z'), 'y': ('x', 'z'), 'z': ('x', 'y')}[AXIS]
half = {'x': size.x, 'y': size.y, 'z': size.z}
uu, vv = PLANE
ortho = max(getattr(size, uu), getattr(size, vv)) * 1.06

# Điểm đánh dấu dựng TRƯỚC camera để chúng lọt vào khung: nhận toạ độ theo hệ
# glTF (đúng con số sẽ dán vào models.ts) rồi đổi ngược về hệ Blender. Không có
# bước dựng lại này thì không có cách nào biết điểm vừa tính có nằm đúng chỗ
# định gắn hay đã trượt sang xương khác.
for i, m in enumerate(MARKS):
    gx, gy, gz = m
    rel = Vector((gx, -gz, gy))          # nghịch đảo của to_gltf
    bpy.ops.mesh.primitive_uv_sphere_add(radius=span * 0.022, location=centre + rel)
    ball = bpy.context.active_object
    mat = bpy.data.materials.new(f'mark{i}')
    mat.use_nodes = False
    mat.diffuse_color = [(1, 0.15, 0.1, 1), (0.15, 0.85, 1, 1), (1, 0.85, 0.1, 1)][i % 3]
    ball.data.materials.append(mat)

if SHOT:
    cam_data = bpy.data.cameras.new('probe')
    cam_data.type = 'ORTHO'
    cam_data.ortho_scale = ortho
    # Mặt phẳng cắt gần/xa mặc định của Blender là 0,1–100 đơn vị. Mẫu ngựa có
    # hộp bao rộng 3282 đơn vị nên camera đứng xa gần 10.000 — vật thể nằm hẳn
    # ngoài vùng nhìn và ảnh ra ĐEN TRƠN, không báo lỗi gì. Đặt theo kích thước
    # thật của mẫu.
    cam_data.clip_start = span * 0.01
    cam_data.clip_end = span * 10
    cam = bpy.data.objects.new('probe', cam_data)
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
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.render.resolution_x = scene.render.resolution_y = RES
    scene.render.film_transparent = False
    scene.render.filepath = os.path.abspath(SHOT)
    bpy.ops.render.render(write_still=True)
    # Bảng quy đổi đi kèm ảnh: không có nó thì tấm ảnh chỉ là tấm ảnh.
    meta = {
        'axis': AXIS, 'ortho': ortho, 'res': RES,
        'centre_blender': [centre.x, centre.y, centre.z],
        'plane': [uu, vv], 'span': span,
    }
    with open(os.path.splitext(SHOT)[0] + '.json', 'w') as f:
        json.dump(meta, f, indent=1)
    print(f"[probe] RENDERED {SHOT}  ortho={ortho:.3f}")

if PICKS:
    depsgraph = bpy.context.evaluated_depsgraph_get()
    out = []
    for (u, v) in PICKS:
        # (u,v) là toạ độ ảnh chuẩn hoá, gốc ở góc TRÁI TRÊN như mọi trình xem ảnh.
        du = (u - 0.5) * ortho
        dv = (0.5 - v) * ortho
        origin = Vector(centre)
        setattr(origin, uu, getattr(centre, uu) + du)
        setattr(origin, vv, getattr(centre, vv) + dv)
        step = span * 3
        direction = Vector((0, 0, 0))
        # Bắn từ phía camera vào; trục x nhìn từ +x nên tia đi theo -x.
        sign = -1 if AXIS in ('x', 'z') else 1
        setattr(direction, AXIS, sign)
        setattr(origin, AXIS, getattr(centre, AXIS) - sign * step)
        hit, loc, nor, idx, obj, mat = bpy.context.scene.ray_cast(depsgraph, origin, direction)
        if not hit:
            print(f"[probe] ({u},{v}) TRƯỢT — không chạm lưới")
            out.append(None)
            continue
        rel = loc - centre
        g = to_gltf(rel)
        print(f"[probe] ({u},{v}) → gltf offset [{g[0]:.3f}, {g[1]:.3f}, {g[2]:.3f}]"
              f"   (chuẩn hoá theo span: [{g[0]/span:.3f}, {g[1]/span:.3f}, {g[2]/span:.3f}])")
        out.append([round(x, 3) for x in g])
    print('[probe] JSON ' + json.dumps(out))
