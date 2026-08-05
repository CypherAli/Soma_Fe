import bpy, sys
from mathutils import Vector

# In bbox thế giới của các object khớp từ khoá -> lấy số thật để đặt hộp cắt
# cho region_config.py, thay vì đoán toạ độ.
#   blender --background Startup.blend --python query_bbox.py -- "từ khoá" ["từ khoá" ...]
# Mỗi từ khoá in ra: bbox GỘP của mọi object khớp + 3 object đại diện.

KWS = [k.lower() for k in sys.argv[sys.argv.index('--') + 1:]]


def wbb(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs))),
            Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))))


sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

for kw in KWS:
    mn = Vector((1e9,) * 3); mx = Vector((-1e9,) * 3)
    hits = []
    for o in bpy.data.objects:
        if o.type not in ('MESH', 'CURVE') or o.name.endswith(('.j', '.t', '.g')):
            continue
        if o.type == 'MESH' and len(o.data.vertices) < 10:
            continue
        if kw not in o.name.lower():
            continue
        a, b = wbb(o)
        for i in range(3):
            mn[i] = min(mn[i], a[i]); mx[i] = max(mx[i], b[i])
        hits.append((o.name, o.type, sysmap.get(o.name, "?").split(":")[0]))
    if not hits:
        print(f"BBOX {kw!r}: KHÔNG CÓ")
        continue
    print(f"BBOX {kw!r}: n={len(hits)} x=({mn.x:.3f},{mx.x:.3f}) y=({mn.y:.3f},{mx.y:.3f}) "
          f"z=({mn.z:.3f},{mx.z:.3f})")
    for h in hits[:4]:
        print(f"      {h[2]:>2} {h[1]:<5} {h[0]}")
