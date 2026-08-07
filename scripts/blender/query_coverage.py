import bpy, sys, os, collections
from mathutils import Vector

# ĐẾM XEM MỖI BỘ LỌC CỦA export_region.py LOẠI MẤT BAO NHIÊU OBJECT.
# Dùng khi một hệ ra ít cấu trúc hơn hẳn số object có trong Startup.blend —
# đừng đoán bộ lọc nào có lỗi, đo từng bước.
#
#   blender -b Startup.blend --python query_coverage.py -- <tien to he, vd "8:">

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from region_config import FULLBODY_BOX  # noqa: E402

PREFIX = (sys.argv[sys.argv.index('--') + 1:] or ["8:"])[0]
x0, x1, y0, y1, z0, z1 = FULLBODY_BOX
MARKER_SUFFIX = ('.j', '.t', '.g')

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

stage = collections.Counter()
examples = collections.defaultdict(list)


def note(key, name):
    stage[key] += 1
    if len(examples[key]) < 8:
        examples[key].append(name)


for o in bpy.data.objects:
    if not sysmap.get(o.name, "").startswith(PREFIX):
        continue
    stage["0_tong"] += 1
    nm = o.name.lower()

    if o.type == 'CURVE':
        note("1_curve (can organ_tubes/vessels de lay)", o.name)
        continue
    if o.type != 'MESH':
        note("2_khong phai mesh", o.name)
        continue
    if o.name.endswith(MARKER_SUFFIX):
        note("3_moc .j/.t/.g", o.name)
        continue
    if len(o.data.vertices) < 10:
        note("4_duoi 10 dinh", o.name)
        continue

    # bộ lọc hậu tố của collect_meshes: chỉ nhận không hậu tố, .l, .r, hoặc số
    tail = nm.rsplit('.', 1)[-1] if '.' in nm else ''
    if tail and tail not in ('l', 'r') and not tail.isdigit():
        note("5_hau to la (vd .el/.o1r) BI LOAI", o.name)
        continue

    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    mn = Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs)))
    mx = Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs)))
    c = (mn + mx) / 2
    pad = 0.02
    if not (x0 - pad <= c.x <= x1 + pad and y0 - pad <= c.y <= y1 + pad
            and z0 - pad <= c.z <= z1 + pad):
        note("6_tam nam ngoai hop", o.name)
        continue

    note("7_LAY DUOC", o.name)

print(f"=== HE {PREFIX} ===")
for k in sorted(stage):
    print(f"{k:<42} {stage[k]:>5}   {', '.join(examples[k][:5])[:110]}")
