import bpy
import sys

coll = bpy.data.collections.get("1: Skeletal system")
if coll is None:
    print("COLLECTION NOT FOUND")
    sys.exit(1)

objs = list(coll.all_objects)
print(f"TOTAL_OBJECTS {len(objs)}")

real_mesh = []
marker = []
other_type = []

for o in objs:
    name = o.name
    if name.endswith(('.j', '.t', '.g')):
        marker.append((name, o.type))
        continue
    if o.type == 'MESH':
        nverts = len(o.data.vertices)
        if nverts < 10:
            marker.append((name, f"MESH_TINY_{nverts}v"))
        else:
            real_mesh.append((name, nverts))
    else:
        other_type.append((name, o.type))

print(f"REAL_MESH_COUNT {len(real_mesh)}")
print(f"MARKER_COUNT {len(marker)}")
print(f"OTHER_TYPE_COUNT {len(other_type)}")

print("---OTHER_TYPES---")
for n, t in other_type[:50]:
    print(f"OTHER {n} | {t}")

print("---REAL_MESH_NAMES---")
for n, v in sorted(real_mesh):
    print(f"MESH {n} | verts={v}")
