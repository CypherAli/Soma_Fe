import bpy, sys, math
from mathutils import Vector

# Render thumbnail cánh tay: nạp arm.glb -> tô màu theo mô -> ẩn da -> chụp.
# Dùng: blender --background --python render_arm_thumb.py -- public/models/arm.glb out.jpg

argv = sys.argv[sys.argv.index('--') + 1:]
GLB, OUT = argv[0], argv[1]

# xoá scene mặc định
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)

BONE = ["humerus", "radius", "ulna", "scaphoid", "lunate", "triquetrum", "pisiform",
        "trapezium", "trapezoid", "capitate", "hamate", "metacarpal", "phalanx",
        "clavicle", "scapula", "bone"]
NERVE = ["nerve", "plexus", "cord", "trunk of brachial", "division of", "sympathetic", "roots of brachial"]

def mat(name, rgb):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (rgb[0], rgb[1], rgb[2], 1)
    b.inputs["Roughness"].default_value = 0.7
    return m
M = {
    "muscle": mat("muscle", (0.62, 0.17, 0.14)),
    "artery": mat("artery", (0.75, 0.15, 0.12)),
    "vein": mat("vein", (0.16, 0.30, 0.60)),
    "nerve": mat("nerve", (0.86, 0.72, 0.20)),
    "lymph": mat("lymph", (0.37, 0.62, 0.34)),
    "bone": mat("bone", (0.91, 0.86, 0.75)),
}

def cat(nm):
    n = nm.lower()
    if "skin" in n or "envelope" in n or "fascia" in n: return "skin"
    if "lymph" in n or "node" in n: return "lymph"
    if any(k in n for k in NERVE): return "nerve"
    if "artery" in n or "palmar arch" in n: return "artery"
    if "vein" in n: return "vein"
    if any(k in n for k in BONE): return "bone"
    return "muscle"

mn = Vector((1e9,)*3); mx = Vector((-1e9,)*3)
for o in list(bpy.data.objects):
    if o.type != 'MESH':
        continue
    c = cat(o.name + " " + (o.parent.name if o.parent else ""))
    if c == "skin":
        bpy.data.objects.remove(o, do_unlink=True); continue  # ẩn da
    o.data.materials.clear(); o.data.materials.append(M[c])
    # Khung ảnh chỉ theo CƠ + XƯƠNG (cánh tay), bỏ mạch/tk trườn về thân
    if c in ("muscle", "bone"):
        for corner in o.bound_box:
            w = o.matrix_world @ Vector(corner)
            for i in range(3):
                mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])

center = (mn + mx) / 2
size = (mx - mn).length

# camera + track-to
empty = bpy.data.objects.new("t", None); bpy.context.scene.collection.objects.link(empty)
empty.location = center
cd = bpy.data.cameras.new("c"); cam = bpy.data.objects.new("c", cd)
bpy.context.scene.collection.objects.link(cam)
cam.location = center + Vector((size * 0.42, -size * 0.9, size * 0.05))
tc = cam.constraints.new('TRACK_TO'); tc.target = empty
tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
cd.lens = 62
bpy.context.scene.camera = cam

# đèn
for pos, e in [((size, -size, size), 4.0), ((-size, -size*0.5, size*0.6), 2.0)]:
    ld = bpy.data.lights.new("l", 'SUN'); ld.energy = e
    lo = bpy.data.objects.new("l", ld); bpy.context.scene.collection.objects.link(lo)
    lo.location = center + Vector(pos)
    lo.rotation_euler = (math.radians(50), 0, math.radians(30))

# nền kem
world = bpy.data.worlds.new("w"); bpy.context.scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.956, 0.937, 0.902, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 1.0

sc = bpy.context.scene
sc.view_settings.view_transform = 'Standard'  # nền kem đúng màu, không bị Filmic làm xám
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = 640; sc.render.resolution_y = 640
sc.render.image_settings.file_format = 'JPEG'
sc.render.image_settings.quality = 90
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)
