import bpy, sys, bmesh
from mathutils import Vector
import os as _os
sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from clip_box import clip_box as _clip_box, clip_above_z as _clip_above_z, clip_ellipse_z as _clip_ellipse_z  # noqa: E402

# CỔ (flagship) — đầy đủ nhiều lớp như Đầu/Tay:
#   Đốt sống cổ C1-C7 + xương móng + SỤN THANH QUẢN (giáp/nhẫn/phễu) +
#   cơ cổ (ức-đòn-chũm, thang, bậc thang, dưới móng, thanh quản…) +
#   ĐM/TM cổ (cảnh, cảnh trong, dưới đòn, giáp…) + thần kinh cổ (lang thang, hoành,
#   đám rối cổ, quặt ngược thanh quản…) + hạch cổ + da bọc.
# Lọc mạch/TK theo bbox LÕI (cột sống cổ + thanh quản) + whitelist tên vùng cổ.
# Dùng: blender --background Startup.blend --python export_neck.py -- out.glb [fast]

_args = sys.argv[sys.argv.index('--') + 1:]
OUT = _args[0]
FAST = "fast" in _args

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

def wbb(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs))),
            Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))))

region = bpy.data.collections.get("Neck")
kept = []
solids = []  # xương+cơ -> bọc da
DROP = ["bursa", "sheath", "retinaculum", "fascia"]

# ---- Ứng viên xương (hệ1) + cơ (hệ4) trong region Neck ----
cand_bone, cand_muscle = [], []
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, "?"); nm = o.name.lower()
    if s.startswith("1:"):
        cand_bone.append(o)
    elif s.startswith("4:") and not any(k in nm for k in DROP):
        cand_muscle.append(o)

# ---- bbox LÕI: chỉ cột sống cổ + móng + sụn thanh quản (không theo cơ thang/levator) ----
CORE = ["vertebra c", "atlas", "axis", "hyoid", "thyroid cartilage", "cricoid",
        "arytenoid", "corniculate", "cuneiform cartilage", "epiglottis"]
BMN = Vector((1e9,)*3); BMX = Vector((-1e9,)*3)
for o in cand_bone:
    if any(k in o.name.lower() for k in CORE):
        mn, mx = wbb(o)
        for i in range(3): BMN[i] = min(BMN[i], mn[i]); BMX[i] = max(BMX[i], mx[i])
ext = (BMX - BMN)
BMN.x -= ext.x * 0.55; BMX.x += ext.x * 0.55
BMN.y -= ext.y * 0.55; BMX.y += ext.y * 0.55
BMN.z -= ext.z * 0.10; BMX.z += ext.z * 0.02   # hạn chế trườn lên mặt / xuống ngực
print("NECK_COREBBOX", [round(v, 3) for v in BMN], [round(v, 3) for v in BMX])
def cin(o):
    mn, mx = wbb(o); c = (mn + mx) / 2
    return all(BMN[i] <= c[i] <= BMX[i] for i in range(3))

# ---- Giữ TẤT CẢ xương cổ; cơ CHỈ giữ khi TÂM nằm trong vùng cổ (bỏ thang/dựng sống lưng) ----
# Bỏ thêm theo tên các cơ lưng/vai trườn dài (kể cả khi tâm lọt bbox)
MUSCLE_DROP = ["trapezius", "levator scapulae", "iliocostalis", "longissimus",
    "spinalis", "semispinalis", "splenius", "multifidus", "rotatores", "serratus",
    "rhomboid", "interspinales", "intertransversarii", "erector"]
for o in cand_bone:
    kept.append(o); solids.append(o)
for o in cand_muscle:
    if any(k in o.name.lower() for k in MUSCLE_DROP):
        continue
    try:
        if cin(o): kept.append(o); solids.append(o)
    except Exception:
        pass
print("NECK_BONES", len(cand_bone), "NECK_MUSCLES_KEPT", len(solids) - len(cand_bone))

# ---- 2) MẠCH + THẦN KINH: curve trong bbox lõi + whitelist tên vùng cổ ----
NECK_KEEP = ["carotid", "jugular", "subclavian", "brachiocephalic", "vertebral artery",
    "vertebral vein", "thyroid", "thyrocervical", "costocervical", "transverse cervical",
    "deep cervical", "spinal", "vagus", "phrenic", "cervical", "laryngeal", "ansa",
    "hypoglossal", "accessory nerve", "sympathetic", "recurrent", "scalene",
    "supraclavicular", "brachial plexus", "trunk of", "dorsal scapular", "suprascapular"]
def collect_curves(coll):
    c = bpy.data.collections.get(coll); out = []
    for o in c.all_objects:
        if o.type != 'CURVE' or o.name.endswith(('.j', '.t', '.g')):
            continue
        nm = o.name.lower()
        if not any(k in nm for k in NECK_KEEP):
            continue
        try:
            if cin(o): out.append(o)
        except Exception:
            pass
    return out

def curves_to_tubes(curves, depth):
    n = 0
    for o in curves:
        o.data = o.data.copy()
        if getattr(o.data, "bevel_depth", 0.0) == 0.0 and getattr(o.data, "bevel_object", None) is None:
            o.data.bevel_depth = depth; o.data.bevel_resolution = 1
        dg = bpy.context.evaluated_depsgraph_get()
        try:
            me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
        except Exception:
            continue
        if not me or len(me.vertices) < 4 or len(me.polygons) < 1:
            continue
        nb = bpy.data.objects.new(o.name, me)
        bpy.context.scene.collection.objects.link(nb)
        nb.matrix_world = o.matrix_world.copy()
        kept.append(nb); n += 1
    return n

if not FAST:
    ves = collect_curves("5: Cardiovascular system")
    ner = collect_curves("7: Nervous system & Sense organs")
    print("NECK_VESSELS", len(ves), "NECK_NERVES", len(ner))
    print("VESSEL_TUBES", curves_to_tubes(ves, 0.0013))
    print("NERVE_TUBES", curves_to_tubes(ner, 0.0013))

# ---- 3) HẠCH bạch huyết (hệ6) trong bbox lõi ----
if not FAST:
    lymph = bpy.data.collections.get("6: Lymphoid organs")
    ln = 0
    for o in lymph.all_objects:
        if o.type != 'MESH' or len(o.data.vertices) < 6 or o.name.endswith(('.j', '.t', '.g')):
            continue
        try:
            if cin(o): kept.append(o); ln += 1
        except Exception:
            pass
    # cả hạch cổ nằm trong region Neck
    for o in region.all_objects:
        if o.type == 'MESH' and sysmap.get(o.name, '').startswith('6:') \
           and len(o.data.vertices) >= 6 and o not in kept and not o.name.endswith(('.j','.t','.g')):
            kept.append(o); ln += 1
    print("NECK_LYMPH", ln)

# ---- 4) DA: bọc voxel xương+cơ (cổ+vai) — 1 lượt, phồng nhẹ ----
try:
    bpy.ops.object.select_all(action='DESELECT')
    dupes = []
    for o in solids:
        d = o.copy(); d.data = o.data.copy()
        bpy.context.scene.collection.objects.link(d)
        d.matrix_world = o.matrix_world.copy(); dupes.append(d)
    bpy.context.view_layer.objects.active = dupes[0]
    for d in dupes: d.select_set(True)
    bpy.ops.object.join()
    env = bpy.context.view_layer.objects.active
    # PASS 1 — voxel + phồng để BẮC QUA khe giữa các cơ (cổ có nhiều khe) -> vỏ liền
    env.modifiers.new("rm", 'REMESH').mode = 'VOXEL'; env.modifiers["rm"].voxel_size = 0.005
    dg = bpy.context.evaluated_depsgraph_get()
    me1 = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me1); bm.normal_update()
    for v in bm.verts: v.co += v.normal * 0.013
    bm.to_mesh(me1); bm.free()
    tmp = bpy.data.objects.new("skin_tmp", me1)
    bpy.context.scene.collection.objects.link(tmp)
    tmp.matrix_world = env.matrix_world.copy()
    # PASS 2 — voxel hàn + smooth mạnh (trụ cổ mượt) + co lại -> không phồng, không lòi cơ
    tmp.modifiers.new("rm2", 'REMESH').mode = 'VOXEL'; tmp.modifiers["rm2"].voxel_size = 0.0065
    sm = tmp.modifiers.new("sm", 'SMOOTH'); sm.iterations = 8; sm.factor = 0.5
    tmp.modifiers.new("dec", 'DECIMATE').ratio = 0.5
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
    for v in bm.verts: v.co -= v.normal * 0.006
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    skin = bpy.data.objects.new("Skin envelope", me)
    bpy.context.scene.collection.objects.link(skin)
    skin.matrix_world = env.matrix_world.copy()
    kept.append(skin)
    print("SKIN_TRIS", len(me.polygons))
except Exception as e:
    print("SKIN_FAIL", repr(e))

# ---- CLIP về TRỤ CỔ: bỏ phần xòe ra vai (cơ vai-móng, bám xương đòn) cho gọn đẹp ----
# Cắt theo ống elip đứng quanh trục cổ + giới hạn cao-thấp. Cắt ĐỀU mọi mesh -> mặt cắt phẳng gọn.
cx = (BMN.x + BMX.x) / 2
cy = (BMN.y + BMX.y) / 2 - 0.005
def clip_column(o, is_skin):
    # da clip RỘNG hơn cơ -> da phủ trùm mép cắt (không lòi cơ răng cưa)
    rx = 0.078 if is_skin else 0.069
    ry = 0.076 if is_skin else 0.067
    # Trụ elip xấp xỉ bằng 28 mặt phẳng tiếp tuyến rồi bịt nắp (clip_box.py).
    _clip_ellipse_z(o, cx, cy, rx, ry)
for o in list(kept):
    if o.type == 'MESH':
        try: clip_column(o, o.name == "Skin envelope")
        except Exception as e: print("CLIP_FAIL", o.name, repr(e))
# bỏ mesh rỗng sau khi clip
kept = [o for o in kept if o.type != 'MESH' or len(o.data.polygons) > 0]
print("AFTER_CLIP meshes", len([o for o in kept if o.type=='MESH']))

# ---- export ----
bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)
tris = sum(len(o.data.polygons) for o in kept if o.type == 'MESH')
print("EXPORT_NECK meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
