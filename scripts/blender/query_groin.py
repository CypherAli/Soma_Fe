import bpy, sys, os
from mathutils import Vector

# Truy các mảnh nằm ĐÚNG vùng vạt lởm chởm ở háng của lớp da toàn thân: đếm số
# ĐỈNH rơi vào hộp (chứ không xét tâm bbox — mảnh dài như cơ may có tâm ở tận
# đùi nhưng đầu trên vẫn thò ra ở háng). Chỉ liệt kê những mảnh CÒN LẠI sau
# muscle_drop của vùng fullbody_skin, tức đúng những gì đã đi vào khối bọc.

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from region_config import REGIONS  # noqa: E402

CFG = REGIONS["fullbody_skin"]
DROP = [k.lower() for k in CFG.get("muscle_drop", [])]
BONE_KW = [k.lower() for k in CFG.get("bone_kw", [])]

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

# hộp vạt: mặt TRƯỚC vùng bẹn (Y+ là phía sau nên mặt trước là y âm)
x0, x1, y0, y1, z0, z1 = -0.17, 0.17, -0.26, -0.02, 0.86, 1.00

rows = []
for o in bpy.data.objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    sysname = sysmap.get(o.name, "")
    nm = o.name.lower()
    if sysname.startswith("4:"):
        if any(k in nm for k in DROP):
            continue
    elif sysname.startswith("1:"):
        if not any(k in nm for k in BONE_KW):
            continue
    else:
        continue
    mw = o.matrix_world
    n = 0
    for v in o.data.vertices:
        w = mw @ v.co
        if x0 <= w.x <= x1 and y0 <= w.y <= y1 and z0 <= w.z <= z1:
            n += 1
    if not n:
        continue
    cs = [mw @ Vector(c) for c in o.bound_box]
    d = Vector((max(c.x for c in cs) - min(c.x for c in cs),
                max(c.y for c in cs) - min(c.y for c in cs),
                max(c.z for c in cs) - min(c.z for c in cs)))
    rows.append((n, o.name, sysname[:1], round(min(d), 3), len(o.data.vertices)))

rows.sort(reverse=True)
print("=== VAT HANG:", len(rows), "manh ===")
for n, name, s, thin, nv in rows:
    print(f"{s} {name[:52]:<52} dinh_trong_hop {n:>5}/{nv:<6} be_day {thin}")
