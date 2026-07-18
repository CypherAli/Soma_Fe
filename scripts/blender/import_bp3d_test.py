import bpy, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
rectum_obj = argv[0]
ileocecal_obj = argv[1]

def world_bbox(obj):
    mw = obj.matrix_world
    cs = [mw @ Vector(c) for c in obj.bound_box]
    xs=[c.x for c in cs]; ys=[c.y for c in cs]; zs=[c.z for c in cs]
    return (min(xs),min(ys),min(zs)),(max(xs),max(ys),max(zs))

for nm in ["Sigmoid colon", "Ascending colon"]:
    o = bpy.data.objects.get(nm)
    if o:
        (xmn,ymn,zmn),(xmx,ymx,zmx) = world_bbox(o)
        print(f"ZA_BBOX|{nm}|x=({xmn:.3f},{xmx:.3f})|y=({ymn:.3f},{ymx:.3f})|z=({zmn:.3f},{zmx:.3f})")

before = set(bpy.data.objects.keys())
bpy.ops.wm.obj_import(filepath=rectum_obj, forward_axis='Y', up_axis='Z')
bpy.ops.wm.obj_import(filepath=ileocecal_obj, forward_axis='Y', up_axis='Z')
after = set(bpy.data.objects.keys())
new_objs = [bpy.data.objects[n] for n in (after - before)]
print("IMPORTED", [o.name for o in new_objs])

for o in new_objs:
    o.scale = (0.001, 0.001, 0.001)
    bpy.context.view_layer.update()
    (xmn,ymn,zmn),(xmx,ymx,zmx) = world_bbox(o)
    print(f"IMPORTED_BBOX_SCALED|{o.name}|x=({xmn:.3f},{xmx:.3f})|y=({ymn:.3f},{ymx:.3f})|z=({zmn:.3f},{zmx:.3f})")
