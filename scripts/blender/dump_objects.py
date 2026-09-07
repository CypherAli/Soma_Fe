import bpy, sys, json
from mathutils import Vector

# Dump MỌI object (mesh + curve) của Startup.blend ra JSON: tên, hệ, loại, số
# đỉnh và bbox thế giới. Dùng để thiết kế hộp cắt vùng mới mà không phải mở
# Blender GUI và không phải đoán toạ độ.
#   blender --background Startup.blend --python dump_objects.py -- out.json
OUT = sys.argv[sys.argv.index('--') + 1]

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

rows = []
for o in bpy.data.objects:
    if o.type not in ('MESH', 'CURVE'):
        continue
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    mn = [min(c[i] for c in cs) for i in range(3)]
    mx = [max(c[i] for c in cs) for i in range(3)]
    rows.append({
        "name": o.name,
        "sys": sysmap.get(o.name, "?"),
        "type": o.type,
        "verts": len(o.data.vertices) if o.type == 'MESH' else 0,
        "bb": [round(v, 4) for v in mn + mx],
    })

with open(OUT, "w", encoding="utf8") as f:
    json.dump(rows, f, ensure_ascii=False)
print("objects:", len(rows))
