import bpy
from mathutils import Vector
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        print('SYSTEM', col.name, len(col.all_objects))
for o in bpy.data.objects:
    if o.type == 'MESH' and any(k in o.name.lower() for k in ['mandible', 'vertebra c7', 'vertebra c1', 'sternum', 'xiphoid', 'clavicle', 'deltoid', 'pectoral major']):
        cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
        print('LANDMARK', o.name, [round(min(c[i] for c in cs),4) for i in range(3)], [round(max(c[i] for c in cs),4) for i in range(3)])
