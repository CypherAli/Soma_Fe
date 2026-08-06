import bpy, sys, math
from mathutils import Vector

# Render CẬN CẢNH một vùng của glb để soi lỗi bề mặt (vạt, gờ, rãnh) — bản
# render toàn thân 900px không đủ pixel cho những chỗ như háng hay mặt.
#   blender -b --python render_glb_zoom.py -- in.glb out.png cx cy cz radius [azimuth_deg]
args = sys.argv[sys.argv.index('--') + 1:]
GLB, OUT = args[0], args[1]
CTR = Vector((float(args[2]), float(args[3]), float(args[4])))
RAD = float(args[5])
AZ = math.radians(float(args[6])) if len(args) > 6 else 0.0

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)

mat = bpy.data.materials.new("skin"); mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
bsdf.inputs["Base Color"].default_value = (0.886, 0.706, 0.561, 1)
bsdf.inputs["Roughness"].default_value = 0.75
for o in bpy.data.objects:
    if o.type == 'MESH':
        o.data.materials.clear(); o.data.materials.append(mat)

cam_d = bpy.data.cameras.new("c"); cam = bpy.data.objects.new("c", cam_d)
bpy.context.scene.collection.objects.link(cam)
dist = RAD * 3.2
cam.location = CTR + Vector((math.sin(AZ) * dist, -math.cos(AZ) * dist, RAD * 0.15))
emp = bpy.data.objects.new("t", None); bpy.context.scene.collection.objects.link(emp)
emp.location = CTR
tt = cam.constraints.new('TRACK_TO'); tt.target = emp
tt.track_axis = 'TRACK_NEGATIVE_Z'; tt.up_axis = 'UP_Y'
cam_d.lens = 85
bpy.context.scene.camera = cam

for pos, e in [((RAD * 4, -RAD * 5, RAD * 4), 4.0), ((-RAD * 4, -RAD * 3, RAD * 2), 1.6),
               ((0, RAD * 4, RAD * 3), 1.0)]:
    ld = bpy.data.lights.new("l", 'SUN'); ld.energy = e
    lo = bpy.data.objects.new("l", ld); bpy.context.scene.collection.objects.link(lo)
    lo.location = CTR + Vector(pos)
    lo.rotation_euler = (CTR - lo.location).normalized().to_track_quat('-Z', 'Y').to_euler()

w = bpy.data.worlds.new("w"); w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = (0.957, 0.937, 0.902, 1)
w.node_tree.nodes["Background"].inputs[1].default_value = 0.6
bpy.context.scene.world = w

sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = 900; sc.render.resolution_y = 900
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT)
