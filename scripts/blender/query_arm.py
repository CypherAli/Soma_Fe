import bpy

# Liệt kê cấu trúc CHI TRÊN (cánh tay đầy đủ) trong Z-Anatomy, gom theo hệ.
# Lọc TRỪ chi dưới để không lẫn (nhiều tên cơ trùng arm/leg).

ARM = ["humerus", "radius", "ulna", "scaphoid", "lunate", "triquetrum", "pisiform",
       "trapezium", "trapezoid", "capitate", "hamate", "metacarpal", "clavicle",
       "scapula", "deltoid", "brachii", "brachialis", "brachioradialis",
       "coracobrachialis", "anconeus", "carpi", "pollicis", "supinator", "pronator",
       "digitorum", "indicis", "digiti minimi", "interosse", "lumbric",
       "median nerve", "ulnar nerve", "radial nerve", "musculocutaneous", "axillary",
       "brachial", "radial artery", "ulnar artery", "digital", "phalan"]
# Trừ những gì thuộc chi dưới / bàn chân / thân
LEG = ["femoris", "femur", "tibia", "fibula", "foot", "hallucis", "plantar",
       "pedis", "peroneus", "popliteus", "gastrocnemius", "soleus", "gluteus",
       "longus" if False else "cruris", "tarsal", "calcane", "talus", "navicular",
       "cuboid", "cuneiform", "sole of", "toe", "leg", "thigh", "hip", "sartorius"]

def is_arm(name):
    n = name.lower()
    if any(x in n for x in LEG):
        return False
    return any(k in n for k in ARM)

# map object -> hệ (collection cấp 1)
sys_of = {}
for c in bpy.data.collections:
    if c.name[:2].strip().rstrip(":").isdigit() or (c.name[0].isdigit()):
        for o in c.all_objects:
            sys_of.setdefault(o.name, c.name)

groups = {}
for o in bpy.data.objects:
    if o.name.endswith(('.j', '.t', '.g')):
        continue
    if o.type != 'MESH' or len(o.data.vertices) < 10:
        continue
    if not is_arm(o.name):
        continue
    g = sys_of.get(o.name, "?")
    groups.setdefault(g, []).append((o.name, len(o.data.vertices)))

total = 0
for g in sorted(groups):
    items = sorted(groups[g])
    vv = sum(v for _, v in items)
    total += vv
    print(f"=== {g} === count={len(items)} verts={vv}")
    for n, v in items:
        print(f"  {n} | {v}")
print(f"TOTAL_MESH {sum(len(v) for v in groups.values())} TOTAL_VERTS {total}")
