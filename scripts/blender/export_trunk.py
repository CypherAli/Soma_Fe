import bpy, sys, bmesh
from mathutils import Vector

# THÂN TRÊN (flagship, ĐẦY ĐỦ CẢ TẠNG) — nhiều lớp bóc tách:
#   Xương (sườn/ức/cột sống ngực-thắt lưng/đòn) + Cơ (ngực/lưng/bụng/liên sườn/hoành) +
#   NỘI TẠNG (tim + phổi + gan + dạ dày + ruột + thận + tụy + túi mật…) +
#   Động/tĩnh mạch (chủ, chủ dưới, phổi…) + thần kинh (liên sườn, giao cảm) + hạch + da.
# Lọc theo bbox thân (sườn+ức+đốt sống T/L) -> bỏ chi/đầu/cơ quan chậu.
# Dùng: blender --background Startup.blend --python export_trunk.py -- out.glb [fast]

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

region = bpy.data.collections.get("Trunk")
kept = []
solids = []  # xương+cơ -> bọc da (KHÔNG gồm tạng)

# ---- bbox thân: sườn + ức + đốt sống ngực/thắt lưng ----
CORE = ["rib", "sternum", "costal cartilage", "vertebra t", "vertebra l"]
BMN = Vector((1e9,)*3); BMX = Vector((-1e9,)*3)
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 20: continue
    if sysmap.get(o.name, '').startswith('1:') and any(k in o.name.lower() for k in CORE):
        mn, mx = wbb(o)
        for i in range(3): BMN[i] = min(BMN[i], mn[i]); BMX[i] = max(BMX[i], mx[i])
ext = (BMX - BMN)
BMN.x -= ext.x*0.14; BMX.x += ext.x*0.14
BMN.y -= ext.y*0.30; BMX.y += ext.y*0.22
BMN.z -= ext.z*0.03; BMX.z += ext.z*0.03
print("TRUNK_BBOX", [round(v, 3) for v in BMN], [round(v, 3) for v in BMX])
def cin(o):
    mn, mx = wbb(o); c = (mn + mx) / 2
    return all(BMN[i] <= c[i] <= BMX[i] for i in range(3))

DROP_M = ["fascia", "membrane", "aponeurosis", "sheath", "retinaculum", "raphe"]
DROP_ARM = ["deltoid", "biceps", "triceps", "brachialis", "coracobrachialis", "supraspinatus",
    "infraspinatus", "teres", "subscapularis"]  # cơ vai/tay trườn vào bbox -> bỏ cho gọn thân
# ---- XƯƠNG (hệ1) + CƠ (hệ4) trong bbox ----
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, "?"); nm = o.name.lower()
    if not cin(o):
        continue
    if s.startswith("1:"):
        kept.append(o); solids.append(o)
    elif s.startswith("4:") and not any(k in nm for k in DROP_M) and not any(k in nm for k in DROP_ARM):
        kept.append(o); solids.append(o)
print("TRUNK_BONES+MUSCLES", len(solids))

# ---- NỘI TẠNG: hệ 8 (tạng) + hệ 5 mesh (TIM) trong bbox, bỏ cơ quan chậu/sinh dục ----
DROP_ORG = ["penis", "prostate", "bladder", "rectum", "seminal", "corpus cavern",
    "corpus spong", "glans", "vagina", "uterus", "ovary", "testis", "scrotum", "anal"]
organs = 0
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 20 or o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, ""); nm = o.name.lower()
    if (s.startswith("8:") or s.startswith("5:")) and cin(o) and not any(k in nm for k in DROP_ORG):
        if o not in kept:
            kept.append(o); organs += 1
print("TRUNK_ORGANS+HEART", organs)

# ---- MẠCH (hệ5 curve) + THẦN KINH (hệ7 curve) trong bbox -> ống ----
def collect_curves(coll):
    c = bpy.data.collections.get(coll); out = []
    for o in c.all_objects:
        if o.type != 'CURVE' or o.name.endswith(('.j', '.t', '.g')):
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
    print("TRUNK_VES", len(ves), "TRUNK_NER", len(ner))
    print("VESSEL_TUBES", curves_to_tubes(ves, 0.0016))
    print("NERVE_TUBES", curves_to_tubes(ner, 0.0016))
    # HẠCH (hệ6)
    ln = 0
    for o in region.all_objects:
        if o.type == 'MESH' and sysmap.get(o.name, '').startswith('6:') and len(o.data.vertices) >= 6 \
           and not o.name.endswith(('.j', '.t', '.g')) and cin(o) and o not in kept:
            kept.append(o); ln += 1
    print("TRUNK_LYMPH", ln)

# ---- DA: bọc voxel xương+cơ (thành thân) 2 lượt ----
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
    env.modifiers.new("rm", 'REMESH').mode = 'VOXEL'; env.modifiers["rm"].voxel_size = 0.006
    dg = bpy.context.evaluated_depsgraph_get()
    me1 = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me1); bm.normal_update()
    for v in bm.verts: v.co += v.normal * 0.014
    bm.to_mesh(me1); bm.free()
    tmp = bpy.data.objects.new("skin_tmp", me1)
    bpy.context.scene.collection.objects.link(tmp)
    tmp.matrix_world = env.matrix_world.copy()
    tmp.modifiers.new("rm2", 'REMESH').mode = 'VOXEL'; tmp.modifiers["rm2"].voxel_size = 0.008
    sm = tmp.modifiers.new("sm", 'SMOOTH'); sm.iterations = 8; sm.factor = 0.5
    tmp.modifiers.new("dec", 'DECIMATE').ratio = 0.45
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
    for v in bm.verts: v.co -= v.normal * 0.008
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    skin = bpy.data.objects.new("Skin envelope", me)
    bpy.context.scene.collection.objects.link(skin)
    skin.matrix_world = env.matrix_world.copy()
    kept.append(skin)
    print("SKIN_TRIS", len(me.polygons))
except Exception as e:
    print("SKIN_FAIL", repr(e))

# ---- CLIP hai bên: tỉa cơ vai/tay & mỏm ngang trườn ra ngoài thành thân ----
cx = (BMN.x + BMX.x) / 2
cy = (BMN.y + BMX.y) / 2
def clip_sides(o, is_skin):
    rx = 0.165 if is_skin else 0.150
    ry = 0.150 if is_skin else 0.140
    zhi = 1.450 if is_skin else 1.440   # cắt mẩu cơ cổ thò lên trên vai
    zlo = 0.995 if is_skin else 1.005   # cắt mẩu cơ chậu/đùi thò xuống dưới bụng
    me = o.data; mw = o.matrix_world
    bm = bmesh.new(); bm.from_mesh(me); kill = []
    for f in bm.faces:
        c = mw @ f.calc_center_median()
        if ((c.x - cx) / rx) ** 2 + ((c.y - cy) / ry) ** 2 > 1.0 or c.z > zhi or c.z < zlo:
            kill.append(f)
    if kill: bmesh.ops.delete(bm, geom=kill, context='FACES')
    bm.to_mesh(me); bm.free()
for o in list(kept):
    if o.type == 'MESH':
        try: clip_sides(o, o.name == "Skin envelope")
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
print("EXPORT_TRUNK meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
