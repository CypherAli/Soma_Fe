import bpy
reg = bpy.data.collections.get("Right upper limb")
print("REGION_OBJS", len(reg.all_objects) if reg else "NONE")
for o in reg.all_objects:
    if o.type != 'MESH':
        continue
    n = o.name.lower()
    if any(k in n for k in ["radius", "ulna", "humerus", "scaphoid", "capitate"]):
        print("BONE", repr(o.name), "verts", len(o.data.vertices))
