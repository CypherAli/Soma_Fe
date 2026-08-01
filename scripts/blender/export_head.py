import bpy, sys, bmesh
from mathutils import Vector

# ĐẦU v2 (flagship) — ĐẦY ĐỦ như cánh tay:
#   Xương sọ + Cơ mặt/nhai + MẮT THẬT (sclera/giác mạc/mống mắt) +
#   Mạch máu (ĐM/TM mặt–sọ) + Thần kinh sọ (I,II,III,V…) + Não (khối gộp) + Da bọc.
# Lọc mạch/thần kinh theo KHÔNG GIAN (bbox đầu) nên đủ nhánh 2 bên, không lẫn thân.
# Dùng: blender --background Startup.blend --python export_head.py -- out.glb

_args = sys.argv[sys.argv.index('--') + 1:]
OUT = _args[0]
FAST = "fast" in _args  # bỏ qua mạch/thần kinh (dựng nhanh để tinh chỉnh da/mắt/miệng)

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

def wbb(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs))),
            Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))))

region = bpy.data.collections.get("Head")
kept = []
solids = []  # xương+cơ -> dùng bọc da
DROP = ["bursa", "sheath", "retinaculum", "fascia"]

# ---- 1) XƯƠNG (hệ 1) + CƠ (hệ 4), đồng thời tính bbox đầu ----
BMN = Vector((1e9,)*3); BMX = Vector((-1e9,)*3)
for o in region.all_objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    s = sysmap.get(o.name, "?")
    nm = o.name.lower()
    if s.startswith("1:") or (s.startswith("4:") and not any(k in nm for k in DROP)):
        kept.append(o); solids.append(o)
        mn, mx = wbb(o)
        for i in range(3): BMN[i] = min(BMN[i], mn[i]); BMX[i] = max(BMX[i], mx[i])
pad = (BMX - BMN) * 0.10; BMN -= pad; BMX += pad
print("HEAD_BBOX", [round(v, 3) for v in BMN], [round(v, 3) for v in BMX])

def center_in(o):
    mn, mx = wbb(o); c = (mn + mx) / 2
    return all(BMN[i] <= c[i] <= BMX[i] for i in range(3))

# ---- 2) MẮT THẬT: sclera (lòng trắng) + giác mạc + mống mắt, cả 2 bên ----
EYE_KEEP = ["sclera", "cornea", "iris", "vitreous"]  # vitreous -> tạo đồng tử tối (lòng đen)
eyes = []
for o in region.all_objects:
    if o.type != 'MESH' or o.name.endswith(('.j', '.t', '.g')) or len(o.data.vertices) < 30:
        continue
    n = o.name.lower()
    if any(n.startswith(k) or (" " + k) in n for k in EYE_KEEP):
        kept.append(o); eyes.append(o)
print("HEAD_EYES", len(eyes))

# ---- 3) MẠCH (hệ 5) + THẦN KINH (hệ 7): curve trong bbox đầu -> ống ----
def collect_curves(coll):
    c = bpy.data.collections.get(coll)
    out = []
    for o in c.all_objects:
        if o.type != 'CURVE' or o.name.endswith(('.j', '.t', '.g')):
            continue
        try:
            if center_in(o):
                out.append(o)
        except Exception:
            pass
    return out

vessels = collect_curves("5: Cardiovascular system")
nerves = collect_curves("7: Nervous system & Sense organs")
print("HEAD_VESSELS", len(vessels), "HEAD_NERVES", len(nerves))

def curves_to_tubes(curves, depth):
    n = 0
    for o in curves:
        o.data = o.data.copy()
        if getattr(o.data, "bevel_depth", 0.0) == 0.0 and getattr(o.data, "bevel_object", None) is None:
            o.data.bevel_depth = depth
            o.data.bevel_resolution = 1
        dg = bpy.context.evaluated_depsgraph_get()
        try:
            me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
        except Exception:
            continue
        if not me or len(me.vertices) < 4 or len(me.polygons) < 1:
            continue
        nb = bpy.data.objects.new(o.name, me)   # GIỮ tên giải phẫu -> viewer tự phân lớp
        bpy.context.scene.collection.objects.link(nb)
        nb.matrix_world = o.matrix_world.copy()
        kept.append(nb); n += 1
    return n

if not FAST:
    print("VESSEL_TUBES", curves_to_tubes(vessels, 0.0010))
    print("NERVE_TUBES", curves_to_tubes(nerves, 0.0013))

# ---- 4) NÃO: gộp voxel thành 1 khối mượt ----
def voxel_merge(objs, name, vsize):
    if not objs:
        return
    bpy.ops.object.select_all(action='DESELECT')
    dupes = []
    for o in objs:
        d = o.copy(); d.data = o.data.copy()
        bpy.context.scene.collection.objects.link(d)
        d.matrix_world = o.matrix_world.copy(); dupes.append(d)
    bpy.context.view_layer.objects.active = dupes[0]
    for d in dupes: d.select_set(True)
    bpy.ops.object.join()
    e = bpy.context.view_layer.objects.active
    e.modifiers.new("rm", 'REMESH').mode = 'VOXEL'; e.modifiers["rm"].voxel_size = vsize
    sm = e.modifiers.new("sm", 'SMOOTH'); sm.iterations = 4; sm.factor = 1.0
    e.modifiers.new("dec", 'DECIMATE').ratio = 0.4
    dgx = bpy.context.evaluated_depsgraph_get()
    mex = bpy.data.meshes.new_from_object(e.evaluated_get(dgx))
    for p in mex.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(name, mex)
    bpy.context.scene.collection.objects.link(ob)
    ob.matrix_world = e.matrix_world.copy()
    kept.append(ob)
    print("BRAIN_MASS TRIS", len(mex.polygons))

brain_objs = []
for cn in ("Cerebrum", "Brainstem", "Cerebellum", "Diencephalon"):
    c = bpy.data.collections.get(cn)
    if c:
        for o in c.all_objects:
            if o.type == 'MESH' and len(o.data.vertices) >= 80 and not o.name.endswith(('.j', '.t', '.g')):
                brain_objs.append(o)
voxel_merge(brain_objs, "Brain mass", 0.0022)

# ---- 5) DA: bọc voxel 2 lượt (bắc qua hốc mắt/khe miệng) -> mặt sạch, không "chảy" ----
sclera_fill = [o for o in region.all_objects
               if o.type == 'MESH' and o.name.lower().startswith("sclera") and len(o.data.vertices) >= 50]
try:
    bpy.ops.object.select_all(action='DESELECT')
    dupes = []
    for o in [k for k in solids if sysmap.get(k.name, '').startswith(('1:', '4:'))] + sclera_fill:
        d = o.copy(); d.data = o.data.copy()
        bpy.context.scene.collection.objects.link(d)
        d.matrix_world = o.matrix_world.copy(); dupes.append(d)
    bpy.context.view_layer.objects.active = dupes[0]
    for d in dupes: d.select_set(True)
    bpy.ops.object.join()
    env = bpy.context.view_layer.objects.active
    # PASS 1 — voxel mịn weld thành vỏ liền + phồng 1cm để da bắc qua hốc lõm
    env.modifiers.new("rm", 'REMESH').mode = 'VOXEL'; env.modifiers["rm"].voxel_size = 0.0040
    dg = bpy.context.evaluated_depsgraph_get()
    me1 = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me1); bm.normal_update()
    for v in bm.verts: v.co += v.normal * 0.008   # phồng đủ bắc qua khe, vẫn phủ ngoài cơ
    bm.to_mesh(me1); bm.free()
    tmp = bpy.data.objects.new("skin_tmp", me1)
    bpy.context.scene.collection.objects.link(tmp)
    tmp.matrix_world = env.matrix_world.copy()
    # PASS 2 — voxel hàn lần 2 + smooth vừa (mí/má/môi mượt) + co nhẹ -> da ôm nhưng luôn phủ ngoài cơ
    tmp.modifiers.new("rm2", 'REMESH').mode = 'VOXEL'; tmp.modifiers["rm2"].voxel_size = 0.0055
    sm = tmp.modifiers.new("sm", 'SMOOTH'); sm.iterations = 6; sm.factor = 0.5
    tmp.modifiers.new("dec", 'DECIMATE').ratio = 0.5
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
    for v in bm.verts: v.co -= v.normal * 0.0035  # co nhẹ (net ~+4mm) -> không lòi cơ, không bóng
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    skin = bpy.data.objects.new("Skin envelope", me)
    bpy.context.scene.collection.objects.link(skin)
    skin.matrix_world = env.matrix_world.copy()
    # ---- Tạo NÉT MẶT tự nhiên trên da: khe mắt hẹp (chỉ lộ nhãn cầu) + rãnh môi khép ----
    FWD = Vector((0, -1, 0))  # mặt nhìn về -Y (mũi ở -Y)
    def centroid(o):
        return o.matrix_world @ (sum((v.co for v in o.data.vertices), Vector()) / len(o.data.vertices))
    def add_cutter(center, scale, name):
        cb = bmesh.new(); bmesh.ops.create_icosphere(cb, subdivisions=3, radius=1.0)
        cme = bpy.data.meshes.new(name); cb.to_mesh(cme); cb.free()
        cob = bpy.data.objects.new(name, cme)
        bpy.context.scene.collection.objects.link(cob)
        cob.location = center; cob.scale = scale
        cutters.append(cob)
    cutters = []
    # khe mắt: hạnh nhân HẸP tại giác mạc -> chỉ lộ dải nhãn cầu (mống mắt/lòng đen), né vòng cơ
    for c in [o for o in region.all_objects if o.type == 'MESH'
              and o.name.lower().startswith("cornea") and len(o.data.vertices) >= 30]:
        add_cutter(centroid(c) + FWD * 0.001, (0.0115, 0.012, 0.0052), "eyecut")
    # rãnh môi khép: ellip dẹt NÔNG ở mặt trước môi (không chạm răng -> không nhe răng)
    inc = [o for o in region.all_objects if o.type == 'MESH'
           and 'incisor' in o.name.lower() and len(o.data.vertices) >= 20]
    if inc:
        mc = Vector((0, 0, 0))
        for o in inc: mc += centroid(o)
        mc /= len(inc)
        add_cutter(mc + FWD * 0.010, (0.019, 0.007, 0.0028), "mouthcut")  # nông -> chỉ là đường môi
    for cob in cutters:
        md = skin.modifiers.new(cob.name, 'BOOLEAN')
        md.operation = 'DIFFERENCE'; md.object = cob; md.solver = 'EXACT'
    if cutters:
        dg = bpy.context.evaluated_depsgraph_get()
        me = bpy.data.meshes.new_from_object(skin.evaluated_get(dg))
        skin.modifiers.clear(); skin.data = me
        for p in me.polygons: p.use_smooth = True
    # đẩy nhãn cầu (sclera/giác mạc/mống mắt) ra trước ~2.5mm cho lấp đầy khe mắt
    for e in eyes:
        e.location = e.location + FWD * 0.0025
    kept.append(skin)
    print("SKIN_TRIS", len(me.polygons), "HOLES", len(cutters))
except Exception as e:
    print("SKIN_FAIL", repr(e))

# ---- export ----
bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

tris = sum(len(o.data.polygons) for o in kept if o.type == 'MESH')
print("EXPORT_HEAD meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
