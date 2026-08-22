import bpy, os, sys, math, json
from mathutils import Vector

# Render a quick preview of a glb, coloring meshes by the same category rules
# as the web viewer (skin/muscle/brain/bone). Usage:
#   blender -b --python render_glb_preview.py -- in.glb out.png [skinalpha]
args = sys.argv[sys.argv.index('--')+1:]
# Đổi sang đường dẫn TUYỆT ĐỐI trước khi giao cho Blender: đường dẫn tương đối
# trong render.filepath được Blender hiểu là tương đối với tệp .blend, mà ở đây
# ta đã read_factory_settings nên gốc thành ổ đĩa — ảnh ghi lạc vào C:\public\
# và báo "RENDERED" như thường, không hề có lỗi để mà biết.
GLB, OUT = os.path.abspath(args[0]), os.path.abspath(args[1])
SKIN_ALPHA = float(args[2]) if len(args) > 2 else 1.0
FRAME = args[3] if len(args) > 3 else "head"   # "head" | "eye"
HIDE = set((args[4].split(",") if len(args) > 4 else []))  # cat ẩn, vd "skin,muscle,bone"
# Hệ số khoảng cách camera. <1 là thu gần lại: cấu trúc nhỏ và rải rác (hạch
# bạch huyết, tuyến nội tiết, xương con tai giữa) có hộp bao trải rộng nhưng
# vật thể chỉ là mấy chấm, khung mặc định chụp ra gần như một tấm ảnh trống.
ZOOM = float(args[5]) if len(args) > 5 else 1.0
# "r"/"l" = chỉ giữ một bên cơ thể. Model đối xứng (hai bàn tay, hai nhãn cầu,
# hai chuỗi xương con) có hộp bao trùm cả KHOẢNG TRỐNG giữa hai bên, nên khung
# hình phải lùi thật xa và mỗi bên chỉ còn một chấm nhỏ ở góc.
SIDE = args[6] if len(args) > 6 else ""
# Góc mở phải bằng ĐÚNG `fov` của Canvas bên web (40°), không thì cùng một
# khoảng cách vẫn ra hai cỡ vật thể khác nhau.
FOV_DEG = 40.0

# wipe default scene
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)

# Giữ ĐỒNG BỘ với BONE_KEYS trong src/lib/anatomy/layers.ts — nếu thiếu tên
# xương chi (radius/ulna/phalanx…) thì preview tô nhầm chúng thành cơ.
BONE = ["humerus","radius","ulna","scaphoid","lunate","triquetrum","pisiform","trapezium",
        "trapezoid","capitate","hamate","metacarpal","phalanx","clavicle","scapula",
        "frontal","parietal","occipital","temporal bone","sphenoid","ethmoid","nasal","lacrimal",
        "maxilla","zygomatic","palatine","vomer","mandible","hyoid","concha","incus","malleus",
        "stapes","tooth","incisor","canine","premolar","molar","cartilage","tarsus","bone",
        # Giữ đồng bộ với BONE_KEYS của layers.ts: thiếu nhóm này thì preview tô
        # đốt sống, xương cùng, xương ức và xương đùi thành màu cơ.
        "vertebra","atlas","axis","sacrum","coccyx","sternum","manubrium","xiphoid",
        "rib","costal","femur","patella","tibia","fibula","calcaneus","talus",
        "navicular","cuboid","cuneiform","metatarsal","ilium","ischium","pubis"]
def cat(n):
    n=n.lower()
    if ("skin" in n or "envelope" in n or "fascia" in n or "aponeurosis" in n
            or "nail" in n or "perionyx" in n or "onych" in n): return "skin"
    if "cornea" in n: return "cornea"
    if "iris" in n: return "iris"
    if "vitreous" in n or "posterior segment" in n: return "vitreous"
    if any(k in n for k in ["sclera","eyeball","lens"]): return "eye"
    # giống pickCat của viewer: xét tĩnh mạch TRƯỚC ("Deep venous palmar arch" là
    # cung tĩnh mạch), và bắt "arter" để khớp cả số nhiều "arteries".
    is_vein = "vein" in n or "venous" in n or "vena cava" in n
    if not is_vein and ("arter" in n or "aorta" in n or "pulmonary trunk" in n
                        or "palmar arch" in n or "carpal arch" in n or "anastomosis" in n):
        return "artery"
    if is_vein: return "vein"
    # Giống pickCat: nhận đích danh khoang não TRƯỚC nhánh tim, vì "ventricle"
    # dùng chung cho buồng tim lẫn não thất.
    if any(k in n for k in ["lateral ventricle","third ventricle","fourth ventricle",
                            "choroid plexus","septum pellucidum","aqueduct","falx",
                            "tentorium","dura","arachnoid","pia mater"]): return "brain"
    if any(k in n for k in ["atrium","ventricle","papillary","leaflet","valve","chordae"]): return "heart"
    if any(k in n for k in ["lung","lobe of","pleura","bronch","trachea"]): return "lung"
    if "liver" in n or "hepat" in n: return "liver"
    if "spleen" in n or "splenic" in n: return "spleen"
    if "kidney" in n or "renal" in n or "suprarenal" in n or "adrenal" in n: return "kidney"
    if "pancrea" in n: return "pancreas"
    if any(k in n for k in ["stomach","gastric","colon","intestine","duoden","jejun","ileum",
        "caecum","appendix","taenia","omentum","meso","gallbladder","bile"]): return "gut"
    if "brain" in n or "commissure" in n: return "brain"
    if "nerve" in n or "plexus" in n: return "nerve"
    # Giống pickCat: SỤN xét trước, rồi tới mô liên kết. Dây chằng và bao khớp
    # của bàn tay có sẵn tên xương trong đó ("Deep transverse METACARPAL
    # ligament", "Radiocarpal capsule") nên nếu nhảy thẳng xuống BONE thì
    # preview tô chúng thành xương trắng, trong khi viewer tô màu mô mềm.
    if "cartilage" in n: return "bone"
    if any(k in n for k in ["ligament","membrane","capsule","labrum","retinacul",
                            "disc","meniscus","bursa","tendon","sheath"]): return "muscle"
    if any(k in n for k in BONE): return "bone"
    return "muscle"

COL={"skin":(0.886,0.706,0.561,1),"muscle":(0.62,0.169,0.137,1),
     "brain":(0.843,0.659,0.635,1),"bone":(0.914,0.863,0.745,1),
     "artery":(0.753,0.224,0.169,1),"vein":(0.173,0.353,0.627,1),
     "nerve":(0.863,0.706,0.180,1),"eye":(0.93,0.93,0.95,1),
     "iris":(0.29,0.196,0.125,1),"vitreous":(0.06,0.06,0.09,1),
     "cornea":(0.87,0.91,0.95,1),
     "heart":(0.557,0.184,0.165,1),"lung":(0.851,0.549,0.580,1),"liver":(0.431,0.231,0.204,1),
     "spleen":(0.42,0.231,0.353,1),"kidney":(0.478,0.290,0.227,1),"pancreas":(0.792,0.663,0.420,1),
     "gut":(0.788,0.561,0.388,1)}
CATROOT_HIDE={"heart":"organ","lung":"organ","liver":"organ","spleen":"organ","kidney":"organ",
     "pancreas":"organ","gut":"organ","iris":"eye","vitreous":"eye","cornea":"eye"}
def _srgb_to_linear(c):
    """Đổi màu sRGB sang tuyến tính.

    Bảng COL chép nguyên các mã màu của viewer, mà mã màu web là sRGB; ô
    "Base Color" của Blender lại nhận giá trị TUYẾN TÍNH. Nhét thẳng số sRGB vào
    đó là mọi màu bị sáng lên một bậc: tim đỏ sẫm #8E2F2A ra thành hồng cá hồi,
    gan nâu ra thành be — cả bảng màu theo mô bệt lại thành một sắc hồng nhạt
    như nhau. Đây mới là lý do ảnh trông "cháy", không phải do đèn.
    """
    return tuple(
        (v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4) if i < 3 else v
        for i, v in enumerate(c)
    )


mats={}
for k,c in COL.items():
    m=bpy.data.materials.new(k); m.use_nodes=True
    bsdf=m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value=_srgb_to_linear(c)
    bsdf.inputs["Roughness"].default_value=0.85
    if k=="skin" and SKIN_ALPHA<1:
        bsdf.inputs["Alpha"].default_value=SKIN_ALPHA; m.blend_method='BLEND'
    if k=="cornea":  # giác mạc trong suốt -> lộ mống mắt/đồng tử
        bsdf.inputs["Alpha"].default_value=0.16; m.blend_method='BLEND'
    mats[k]=m

objs=[o for o in bpy.data.objects if o.type=='MESH']
if SIDE in ("r", "l"):
    other = ".l" if SIDE == "r" else ".r"
    for o in list(objs):
        nm = o.name.lower()
        # tên có dạng "Scaphoid bone.l" hoặc "Median nerve.l.001"
        if nm.endswith(other) or (other + ".") in nm:
            bpy.data.objects.remove(o, do_unlink=True)
    objs=[o for o in bpy.data.objects if o.type=='MESH']

# ẩn (xoá) các mesh thuộc cat trong HIDE (gộp cat con về cat gốc)
if HIDE:
    for o in list(objs):
        root=CATROOT_HIDE.get(cat(o.name),cat(o.name))
        if root in HIDE:
            bpy.data.objects.remove(o, do_unlink=True)
    objs=[o for o in bpy.data.objects if o.type=='MESH']
mn=Vector((1e9,)*3); mx=Vector((-1e9,)*3)
emn=Vector((1e9,)*3); emx=Vector((-1e9,)*3); has_eye=False
for o in objs:
    ck=cat(o.name)
    o.data.materials.clear(); o.data.materials.append(mats[ck])
    for c in o.bound_box:
        w=o.matrix_world@Vector(c)
        for i in range(3): mn[i]=min(mn[i],w[i]); mx[i]=max(mx[i],w[i])
        if ck in ("eye","iris","cornea"):
            has_eye=True
            for i in range(3): emn[i]=min(emn[i],w[i]); emx[i]=max(emx[i],w[i])
# KHUNG HÌNH CHUẨN: đọc `src/lib/anatomy/modelFrames.json` — đúng bảng mà viewer
# dùng. Trước đây file này tự tính hộp bao và tự nhân hệ số, nên ảnh thumbnail
# và trang xem là hai khung hình khác nhau của cùng một model; sửa một bên
# không bao giờ kéo bên kia theo.
def _std_frame():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "..", "..", "src", "lib", "anatomy", "modelFrames.json")
    try:
        with open(os.path.normpath(path), encoding="utf-8") as fh:
            table = json.load(fh)["frames"]
    except Exception as e:
        print("[frame] KHÔNG đọc được modelFrames.json:", e)
        return None
    entry = table.get(os.path.basename(GLB))
    if not entry:
        print("[frame] model chưa có trong bảng, chạy: npm run models:frames")
        return None
    return entry

def _fit(dims):
    """Khoảng cách camera — ĐÚNG công thức `fitDistance` bên web.

    Bao theo hình TRỤ ĐỨNG: bề ngang cần chừa là đường chéo mặt bằng (vật thể
    xoay quanh trục đứng), chiều cao thì không đổi khi xoay. Ảnh vuông nên góc
    mở ngang bằng góc mở dọc. Trục đứng của Blender là Z.
    """
    half_h = dims.z / 2
    half_w = math.hypot(dims.x, dims.y) / 2
    return max(half_h, half_w) / math.tan(math.radians(FOV_DEG) / 2) * 1.18 * ZOOM


# Cắt một bên hay soi mắt là CỐ Ý xem một phần khác của model, lúc đó bảng khung
# (đo trên TOÀN BỘ model) không còn tả đúng thứ đang nằm trong hình — phải tự đo
# lại trên phần còn hiện. Nhưng CÔNG THỨC canh khung thì vẫn y nguyên, nên cả bộ
# ảnh vẫn cùng một hướng nhìn, cùng mép chừa, cùng cỡ biểu kiến.
_std = None if (SIDE or (FRAME == "eye" and has_eye)) else _std_frame()
if _std:
    # Bảng khung ghi theo hệ Y-up của glTF: (x, y, z)_web -> (x, -z, y)_blender.
    _c, _s = _std["center"], _std["size"]
    ctr = Vector((_c[0], -_c[2], _c[1])); dims = Vector((_s[0], _s[2], _s[1]))
    rad = _std["radius"]
elif FRAME == "eye" and has_eye:
    ctr = (emn + emx) / 2; rad = max((emx - emn)) / 2; dims = emx - emn
else:
    ctr = (mn + mx) / 2; rad = max((mx - mn)) / 2; dims = mx - mn
dist = _fit(dims)
cam_d=bpy.data.cameras.new("c"); cam=bpy.data.objects.new("c",cam_d)
cam_d.sensor_fit='AUTO'; cam_d.angle=math.radians(FOV_DEG)
# Mặt phẳng cắt phải co theo KÍCH THƯỚC VẬT THỂ. Mặc định của Blender là cắt gần
# 0,1 m: model nhỏ (xương con tai giữa 4mm, tai trong 4cm, nhãn cầu 3cm) đứng
# cách camera chưa tới 0,1 m nên bị xén sạch — ảnh ra một màu nền trơn mà render
# vẫn báo thành công, không có lỗi nào để mà biết.
cam_d.clip_start = max(dist * 0.001, 1e-5)
cam_d.clip_end = dist * 100
bpy.context.scene.collection.objects.link(cam)
# Hướng nhìn chuẩn, khớp VIEW_DIR trong src/lib/anatomy/modelFrame.ts.
# Web dùng hệ Y-up (x phải, y lên, z ra phía người xem) còn Blender là Z-up với
# -Y là hướng nhìn từ trước, nên (x, y, z)_web -> (x, -z, y)_blender.
_d = Vector((0.18, 0.12, 1.0)).normalized()
cam.location = ctr + Vector((_d.x, -_d.z, _d.y)) * dist
dir=(ctr-cam.location).normalized()
cam.rotation_euler=(math.atan2(math.hypot(dir.x,dir.y),-dir.z), 0, math.atan2(dir.x,-dir.y)*-1+math.pi)
# aim via track
tt=cam.constraints.new('TRACK_TO');
emp=bpy.data.objects.new("t",None); bpy.context.scene.collection.objects.link(emp); emp.location=ctr
tt.target=emp; tt.track_axis='TRACK_NEGATIVE_Z'; tt.up_axis='UP_Y'
bpy.context.scene.camera=cam

# lights
# Ba mặt trời với tổng năng lượng 6,5 cộng nền sáng 0,6 làm ảnh CHÁY: màu tạng
# vốn được mã hoá theo mô (tim đỏ sẫm, gan nâu, ruột nâu vàng) bị đẩy hết về
# một sắc hồng nhạt như nhau, mất luôn ý nghĩa phân biệt. Hạ xuống mức đọc rõ
# được màu mà vẫn đủ sáng để thấy khối.
for pos,e in [((rad*4,-rad*4,rad*5),2.1),((-rad*4,-rad*2,rad*2),0.85),((0,rad*3,rad*2),0.55)]:
    ld=bpy.data.lights.new("l",'SUN'); ld.energy=e; lo=bpy.data.objects.new("l",ld)
    bpy.context.scene.collection.objects.link(lo); lo.location=ctr+Vector(pos)
    d=(ctr-lo.location).normalized(); lo.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
w=bpy.data.worlds.new("w"); w.use_nodes=True
w.node_tree.nodes["Background"].inputs[0].default_value=(0.957,0.937,0.902,1)
w.node_tree.nodes["Background"].inputs[1].default_value=0.35
bpy.context.scene.world=w

sc=bpy.context.scene
sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=900; sc.render.resolution_y=900
sc.render.film_transparent=False
# Giữ ĐÚNG màu đã khai trong COL: bộ chuyển mặc định của Blender kéo tương phản
# và làm nhạt sắc, khiến bảng màu theo mô không còn khớp với màu trong viewer.
try:
    sc.view_settings.view_transform='Standard'
except Exception as e:
    print("[view] không đặt được view_transform:", e)
sc.render.filepath=OUT
bpy.ops.render.render(write_still=True)
print("RENDERED",OUT)
