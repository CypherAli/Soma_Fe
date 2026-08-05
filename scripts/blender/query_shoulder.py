import bpy
from mathutils import Vector

# Liệt kê dữ liệu thật cho vùng ĐAI VAI – NÁCH trước khi viết script export:
# cơ vai/ngực/lưng bám vai, đám rối cánh tay, bó mạch nách, hạch nách.
# Dùng: blender --background Startup.blend --python query_shoulder.py

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

regmap = {}
for name in ("Right upper limb", "Trunk", "Neck", "Head"):
    c = bpy.data.collections.get(name)
    if c:
        for o in c.all_objects:
            regmap.setdefault(o.name, name)


def wbb(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs))),
            Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))))


KW = ["deltoid", "pectoralis", "latissimus", "trapezius", "rhomboid", "serratus",
      "supraspinatus", "infraspinatus", "subscapularis", "teres", "levator scapulae",
      "coracobrachialis", "biceps", "triceps", "subclavius", "omohyoid",
      "scapula", "clavicle", "humerus", "acromion", "coracoid",
      "brachial plexus", "axillary", "subclavian", "thoraco", "thoracic nerve",
      "suprascapular", "musculocutaneous", "median nerve", "ulnar nerve", "radial nerve",
      "circumflex", "subscapular", "cephalic vein", "lateral thoracic",
      "cord", "trunk of brachial", "root", "division"]

rows = []
for o in bpy.data.objects:
    if o.name.endswith(('.j', '.t', '.g')):
        continue
    nm = o.name.lower()
    if not any(k in nm for k in KW):
        continue
    if o.type == 'MESH':
        n = len(o.data.vertices)
        if n < 10:
            continue
    elif o.type == 'CURVE':
        n = -1
    else:
        continue
    mn, mx = wbb(o)
    c = (mn + mx) / 2
    rows.append((o.name, o.type, n, sysmap.get(o.name, "?").split(":")[0],
                 regmap.get(o.name, "-"), round(c.x, 3), round(c.y, 3), round(c.z, 3)))

rows.sort(key=lambda r: (r[3], r[0]))
print("=== SHOULDER/AXILLA CANDIDATES ===")
for r in rows:
    print(f"{r[3]:>3} {r[1]:<5} v={r[2]:<6} reg={r[4]:<17} c=({r[5]},{r[6]},{r[7]})  {r[0]}")
print("TOTAL", len(rows))
