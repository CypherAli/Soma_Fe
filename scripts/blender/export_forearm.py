import bpy, sys, bmesh
from mathutils import Vector

# CẲNG TAY – BÀN TAY (mẫu cho điều khiển cử chỉ): từ KHUỶU đến hết NGÓN TAY.
# Nhiều lớp bóc tách: da → cơ → động mạch → tĩnh mạch → thần kinh → xương.
# Cắt tại mốc khuỷu = đỉnh xương quay/trụ; bỏ cánh tay trên, vai, đòn.
# Dùng: blender --background Startup.blend --python export_forearm.py -- out.glb [fast]

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

region = bpy.data.collections.get("Right upper limb")
kept, solids = [], []

# ---- mốc KHUỶU: đỉnh xương quay + trụ (tay buông xuôi nên khuỷu ở Z cao hơn bàn tay) ----
ELBOW_Z = -1e9
for o in region.all_objects:
    if o.type == 'MESH' and o.name.lower().split('.')[0] in ("radius", "ulna"):
        mn, mx = wbb(o)
        ELBOW_Z = max(ELBOW_Z, mx.z)
print("FOREARM_ELBOW_Z", round(ELBOW_Z, 4))
CUT_Z = ELBOW_Z + 0.005   # chừa mỏm khuỷu

# cơ/xương thuộc cánh tay trên – vai (loại theo TÊN, kể cả khi bbox chạm vùng cẳng tay)
DROP_PROX = ["humerus", "clavicle", "scapula", "deltoid", "biceps", "triceps", "brachialis",
    "coracobrachialis", "supraspinatus", "infraspinatus", "subscapularis", "teres",
    "intermuscular septum", "pectoralis", "latissimus", "rhomboid", "trapezius", "serratus"]
DROP_SOFT = ["bursa", "sheath", "retinaculum", "fascia"]

def below_elbow(o):
    mn, mx = wbb(o)
    return ((mn.z + mx.z) / 2) < CUT_Z

# ---- 1) XƯƠNG (hệ1) + CƠ (hệ4) dưới khuỷu ----
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, "?"); nm = o.name.lower()
    if any(k in nm for k in DROP_PROX):
        continue
    if not (s.startswith("1:") or (s.startswith("4:") and not any(k in nm for k in DROP_SOFT))):
        continue
    if below_elbow(o):
        kept.append(o); solids.append(o)
print("FOREARM_BONES+MUSCLES", len(solids))

# ---- bbox cẳng tay (từ xương+cơ đã giữ) để lọc mạch/thần kinh ----
BMN = Vector((1e9,)*3); BMX = Vector((-1e9,)*3)
for o in solids:
    mn, mx = wbb(o)
    for i in range(3): BMN[i] = min(BMN[i], mn[i]); BMX[i] = max(BMX[i], mx[i])
pad = (BMX - BMN) * 0.10
BMN -= pad; BMX += pad
BMX.z = min(BMX.z, CUT_Z + 0.01)
print("FOREARM_BBOX", [round(v, 3) for v in BMN], [round(v, 3) for v in BMX])

def mostly_in(o):
    mn, mx = wbb(o)
    c = (mn + mx) / 2
    return all(BMN[i] <= c[i] <= BMX[i] for i in range(3)) and mx.z <= CUT_Z + 0.02

# ---- 2) MẠCH (hệ5) + THẦN KINH (hệ7): curve bên phải, trong vùng cẳng tay ----
def collect_curves(coll):
    c = bpy.data.collections.get(coll); out = []
    for o in c.all_objects:
        if o.type != 'CURVE' or o.name.endswith(('.j', '.t', '.g')):
            continue
        if not o.name.lower().endswith('.r'):
            continue
        try:
            if mostly_in(o): out.append(o)
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
    print("FOREARM_VES", len(ves), "FOREARM_NER", len(ner))
    print("VESSEL_TUBES", curves_to_tubes(ves, 0.0011))
    print("NERVE_TUBES", curves_to_tubes(ner, 0.0012))

# ---- 3) DA: bọc voxel xương+cơ ----
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
    env.modifiers.new("rm", 'REMESH').mode = 'VOXEL'; env.modifiers["rm"].voxel_size = 0.0045
    sm = env.modifiers.new("sm", 'SMOOTH'); sm.iterations = 4; sm.factor = 0.8
    env.modifiers.new("dec", 'DECIMATE').ratio = 0.5
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
    for v in bm.verts: v.co += v.normal * 0.010
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    skin = bpy.data.objects.new("Skin envelope", me)
    bpy.context.scene.collection.objects.link(skin)
    skin.matrix_world = env.matrix_world.copy()
    kept.append(skin)
    print("SKIN_TRIS", len(me.polygons))
except Exception as e:
    print("SKIN_FAIL", repr(e))

# ---- 4) CẮT NGANG tại khuỷu cho mọi mesh (mặt cắt gọn, không thò lên cánh tay) ----
def clip_top(o, is_skin):
    zc = CUT_Z + (0.004 if is_skin else 0.0)
    me = o.data; mw = o.matrix_world
    bm = bmesh.new(); bm.from_mesh(me); kill = []
    for f in bm.faces:
        if (mw @ f.calc_center_median()).z > zc:
            kill.append(f)
    if kill: bmesh.ops.delete(bm, geom=kill, context='FACES')
    bm.to_mesh(me); bm.free()
for o in list(kept):
    if o.type == 'MESH':
        try: clip_top(o, o.name == "Skin envelope")
        except Exception as e: print("CLIP_FAIL", o.name, repr(e))
kept = [o for o in kept if o.type != 'MESH' or len(o.data.polygons) > 0]

# ---- export ----
bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)
tris = sum(len(o.data.polygons) for o in kept if o.type == 'MESH')
print("EXPORT_FOREARM meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
