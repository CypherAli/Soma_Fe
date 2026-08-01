import bpy

# Liệt kê các mesh xương sọ (cranium + mặt) trong Z-Anatomy để export sọ 3D.
KEYS = [
    "frontal bone", "parietal", "occipital", "temporal bone", "sphenoid",
    "ethmoid", "nasal bone", "lacrimal", "maxilla", "zygomatic", "palatine",
    "inferior nasal concha", "vomer", "mandible", "hyoid",
    "tooth", "teeth", "dental",
]

def is_skull(name):
    n = name.lower()
    # loại các phần không thuộc sọ dù trùng chữ (vd 'temporal' của thuỳ não)
    return any(k in n for k in KEYS)

coll = bpy.data.collections.get("1: Skeletal system")
pool = list(coll.all_objects) if coll else list(bpy.data.objects)

real, tiny, nonmesh = [], [], []
for o in pool:
    nm = o.name
    if nm.endswith(('.j', '.t', '.g')):
        continue
    if not is_skull(nm):
        continue
    if o.type != 'MESH':
        nonmesh.append((nm, o.type)); continue
    v = len(o.data.vertices)
    (real if v >= 10 else tiny).append((nm, v))

print("SKULL_REAL_MESH", len(real))
for n, v in sorted(real):
    print(f"MESH | {n} | verts={v}")
print("SKULL_TINY", len(tiny))
for n, v in sorted(tiny):
    print(f"TINY | {n} | {v}")
print("SKULL_NONMESH", len(nonmesh))
for n, t in nonmesh:
    print(f"NONMESH | {n} | {t}")
print("TOTAL_VERTS", sum(v for _, v in real))
