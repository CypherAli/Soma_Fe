import bpy, sys, bmesh
from mathutils import Vector

# ĐAI VAI – NÁCH (bên PHẢI): xương đòn – xương vai – đầu trên xương cánh tay,
# cơ vai/ngực/lưng bám vai, ĐÁM RỐI CÁNH TAY đầy đủ (rễ → thân → ngành → bó),
# bó mạch nách (ĐM/TM nách và các nhánh), hạch nách, bọc da voxel.
# Khối được CẮT HỘP quanh vai (giống cách làm cổ/thân) để thành một block gọn.
# Dùng: blender --background Startup.blend --python export_shoulder.py -- out.glb [fast]

_args = sys.argv[sys.argv.index('--') + 1:]
OUT = _args[0]
FAST = "fast" in _args

# ---- hộp cắt vùng vai (đo từ dữ liệu thật: bên phải X âm) ----
X_MED, X_LAT = -0.34, 0.005   # giữ nửa phải, chừa chút qua đường giữa cho xương ức
Z_BOT, Z_TOP = 1.10, 1.50
Y_BACK, Y_FRONT = -0.16, 0.16

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)


def wbb(o):
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (Vector((min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs))),
            Vector((max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))))


def overlaps_box(o, pad=0.0):
    mn, mx = wbb(o)
    return (mx.x >= X_MED - pad and mn.x <= X_LAT + pad and
            mx.z >= Z_BOT - pad and mn.z <= Z_TOP + pad and
            mx.y >= Y_BACK - pad and mn.y <= Y_FRONT + pad)


def center_in_box(o, pad=0.02):
    mn, mx = wbb(o)
    c = (mn + mx) / 2
    return (X_MED - pad <= c.x <= X_LAT + pad and Z_BOT - pad <= c.z <= Z_TOP + pad
            and Y_BACK - pad <= c.y <= Y_FRONT + pad)


# ---- 1) XƯƠNG: đai vai + đầu trên xương cánh tay + khung sườn làm nền bám ----
BONE_NAMES = {"clavicle.r", "scapula.r", "humerus.r", "sternum", "manubrium of sternum",
              "body of sternum", "xiphoid process"}
BONE_KW = ["rib.r", "costal cartilage", "vertebra c", "vertebra t"]

kept, solids, bones, muscles = [], [], [], []
for o in bpy.data.objects:
    if o.type != 'MESH' or len(o.data.vertices) < 10 or o.name.endswith(('.j', '.t', '.g')):
        continue
    if not sysmap.get(o.name, "").startswith("1:"):
        continue
    nm = o.name.lower()
    hit = nm in BONE_NAMES or any(k in nm for k in BONE_KW)
    if not hit or nm.endswith('.l'):
        continue
    if not overlaps_box(o):
        continue
    kept.append(o); solids.append(o); bones.append(o)
print("SHOULDER_BONES", len(bones))

# ---- 2) CƠ: nhóm bám đai vai (bên phải), lấy theo TÊN cho chắc chắn ----
MUSCLE_KW = ["deltoid", "pectoralis major", "pectoralis minor", "subclavius",
             "serratus anterior", "latissimus dorsi", "teres major", "teres minor",
             "supraspinatus", "infraspinatus", "subscapularis", "trapezius",
             "rhomboid", "levator scapulae", "coracobrachialis",
             "biceps brachii", "triceps brachii", "head of biceps brachii",
             "head of triceps brachii", "intercostal"]
DROP_SOFT = ["bursa", "sheath", "retinaculum", "fascia", "aponeurosis"]
nmus = 0
for o in bpy.data.objects:
    if o.type != 'MESH' or len(o.data.vertices) < 40 or o.name.endswith(('.j', '.t', '.g')):
        continue
    if not sysmap.get(o.name, "").startswith("4:"):
        continue
    nm = o.name.lower()
    # bỏ mesh phụ (.el/.ol/.e1r… = điểm bám, không phải thân cơ)
    if nm.rsplit('.', 1)[-1] not in ("r", "l") or nm.endswith('.l'):
        continue
    if not any(k in nm for k in MUSCLE_KW) or any(k in nm for k in DROP_SOFT):
        continue
    if not overlaps_box(o):
        continue
    kept.append(o); solids.append(o); muscles.append(o); nmus += 1
print("SHOULDER_MUSCLES", nmus)

# ---- 3) MẠCH + THẦN KINH (curve) ----
# tên KHÔNG có hậu tố .r (mạch dưới đòn đặt tên theo bên sẵn trong tên)
NO_SUFFIX_OK = ["right subclavian artery", "right subclavian vein",
                "right brachiocephalic vein", "roots of brachial plexus"]
# Cấu trúc của VÙNG KHÁC nhưng bbox lọt vào hộp vai (mạch mặt – hàm – tai, mạch
# tạng bụng…). Lọc theo tên vì lọc theo không gian không tách được.
DROP_CURVE_KW = ["renal", "suprarenal", "palatine", "buccal", "bucinator", "mental",
                 "alveolar", "lingual", "chorda", "tympani", "parotid", "mastoid",
                 "maxillary", "facial", "pharyngeal", "jugulodigastric", "submandibular",
                 "occipital", "ophthalmic", "meningeal", "hypoglossal", "glossopharyngeal",
                 "labial", "retromandibular", "infra-orbital", "mandibular node",
                 "carotid", "thyroid", "phrenic", "coeliac", "celiac", "mesenteric",
                 "hepatic", "splenic", "gastric", "lumbar", "iliac"]


def collect_curves(coll):
    c = bpy.data.collections.get(coll)
    out = []
    for o in c.all_objects:
        if o.type != 'CURVE' or o.name.endswith(('.j', '.t', '.g')):
            continue
        nm = o.name.lower()
        if not (nm.endswith('.r') or any(k in nm for k in NO_SUFFIX_OK)):
            continue
        if any(k in nm for k in DROP_CURVE_KW):
            continue
        try:
            if center_in_box(o):
                out.append(o)
        except Exception:
            pass
    return out


def curves_to_tubes(curves, depth):
    n = 0
    for o in curves:
        o.data = o.data.copy()          # cặp .l/.r hay dùng chung data-block
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
        nb = bpy.data.objects.new(o.name, me)
        bpy.context.scene.collection.objects.link(nb)
        nb.matrix_world = o.matrix_world.copy()
        kept.append(nb)
        n += 1
    return n


if not FAST:
    ves = collect_curves("5: Cardiovascular system")
    ner = collect_curves("7: Nervous system & Sense organs")
    print("SHOULDER_VES", len(ves), "SHOULDER_NER", len(ner))
    print("VESSEL_TUBES", curves_to_tubes(ves, 0.0013))
    print("NERVE_TUBES", curves_to_tubes(ner, 0.0014))

    # ---- 4) HẠCH NÁCH ----
    nl = 0
    lym = bpy.data.collections.get("6: Lymphoid organs")
    for o in lym.all_objects:
        if o.type != 'MESH' or len(o.data.vertices) < 6 or o.name.endswith(('.j', '.t', '.g')):
            continue
        nm = o.name.lower()
        if not nm.endswith('.r') or any(k in nm for k in DROP_CURVE_KW):
            continue
        if center_in_box(o):
            kept.append(o); nl += 1
    print("SHOULDER_LYMPH", nl)

# ---- 5) Bản sao xương+cơ CHƯA CẮT để bọc da ----
# Voxel remesh (OpenVDB) cần mặt KÍN mới dựng được level set; nếu bọc từ mesh đã
# cắt hở thì trả về khối rỗng vài trăm tam giác. Vì vậy phải nhân bản trước khi
# cắt, bọc da xong mới cắt lớp da theo cùng hộp.
# CHỈ bọc từ cơ + xương đòn/xương vai/xương cánh tay: xương sườn, đốt sống và
# xương ức trong bộ này làm hỏng level set của voxel remesh (đo riêng từng cái:
# gộp 44 xương -> 112 tam giác, trong khi 30 cơ -> 27.200). Các xương đó nằm
# trong lòng khối cơ nên không ảnh hưởng hình dáng ngoài của da.
KEY_BONES = ("clavicle.r", "scapula.r", "humerus.r")
skin_src = []
for o in muscles + [b for b in bones if b.name.lower() in KEY_BONES]:
    d = o.copy(); d.data = o.data.copy()
    bpy.context.scene.collection.objects.link(d)
    d.matrix_world = o.matrix_world.copy()
    # bỏ ẩn TRƯỚC khi select: bản sao thừa hưởng trạng thái ẩn của object gốc,
    # mà object ẩn thì select_set() không ăn -> join() gộp thiếu, không báo lỗi.
    d.hide_viewport = False
    try:
        d.hide_set(False)
    except Exception:
        pass
    skin_src.append(d)

# ---- 6) CẮT HỘP xương + cơ (bản gốc) về đúng khối vai ----
def clip_box(o, margin=0.0):
    me = o.data; mw = o.matrix_world
    bm = bmesh.new(); bm.from_mesh(me)
    kill = []
    for f in bm.faces:
        c = mw @ f.calc_center_median()
        if (c.z > Z_TOP + margin or c.z < Z_BOT - margin or c.x < X_MED - margin
                or c.x > X_LAT + margin or c.y < Y_BACK - margin or c.y > Y_FRONT + margin):
            kill.append(f)
    if kill:
        bmesh.ops.delete(bm, geom=kill, context='FACES')
    # BẮT BUỘC dọn đỉnh mồ côi: xoá mặt vẫn để lại đỉnh ở vị trí cũ (tận thắt
    # lưng), làm bbox mesh vẫn khổng lồ -> voxel remesh bọc da bị vượt hạn mức.
    loose = [v for v in bm.verts if not v.link_faces]
    if loose:
        bmesh.ops.delete(bm, geom=loose, context='VERTS')
    bm.to_mesh(me); bm.free()


for o in list(kept):
    if o.type == 'MESH':
        try:
            clip_box(o)
        except Exception as e:
            print("CLIP_FAIL", o.name, repr(e))
kept = [o for o in kept if o.type != 'MESH' or len(o.data.polygons) > 0]
solids = [o for o in solids if len(o.data.polygons) > 0]
print("AFTER_CLIP kept", len(kept), "solids", len(solids))

# ---- 7) DA: bọc voxel quanh bản sao CHƯA CẮT ----
try:
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = skin_src[0]
    for d in skin_src:
        d.select_set(True)
    bpy.ops.object.join()
    env = bpy.context.view_layer.objects.active
    print("SKIN_JOIN objs", len(skin_src), "-> verts", len(env.data.vertices),
          "polys", len(env.data.polygons), "dims", tuple(round(v, 3) for v in env.dimensions))
    rm = env.modifiers.new("rm", 'REMESH'); rm.mode = 'VOXEL'; rm.voxel_size = 0.005
    sm = env.modifiers.new("sm", 'SMOOTH'); sm.iterations = 4; sm.factor = 0.85
    env.modifiers.new("dec", 'DECIMATE').ratio = 0.5
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(env.evaluated_get(dg))
    bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
    for v in bm.verts:
        v.co += v.normal * 0.010
    bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    skin = bpy.data.objects.new("Skin envelope", me)
    bpy.context.scene.collection.objects.link(skin)
    skin.matrix_world = env.matrix_world.copy()
    kept.append(skin)
    print("SKIN_TRIS", len(me.polygons))
except Exception as e:
    print("SKIN_FAIL", repr(e))

# ---- 7) Cắt nốt phần ống mạch/thần kinh và lớp da vừa dựng ----
# (da chừa thêm 6mm để trùm mép cơ, không để lộ vệt cơ ở rìa khối cắt)
for o in list(kept):
    if o.type == 'MESH' and o not in solids:
        try:
            clip_box(o, 0.006 if o.name == "Skin envelope" else 0.0)
        except Exception as e:
            print("CLIP_FAIL", o.name, repr(e))
kept = [o for o in kept if o.type != 'MESH' or len(o.data.polygons) > 0]

# ---- export ----
bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.hide_viewport = False
    try:
        o.hide_set(False)
    except Exception:
        pass
    o.select_set(True)
tris = sum(len(o.data.polygons) for o in kept if o.type == 'MESH')
print("EXPORT_SHOULDER meshes", len(kept), "tris", tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", OUT)
