# Cấu hình vùng cho export_region.py — MỖI VÙNG = MỘT MODEL NHIỀU LỚP.
#
# Toạ độ đo THẬT bằng query_bbox.py trên Startup.blend (không đoán):
#   người cao ~1.7m, gốc ở sàn; bên PHẢI cơ thể là X ÂM; Y+ là phía SAU.
#   Mốc hay dùng: bàn tay z 0.74–0.88 · khuỷu z 1.03–1.13 · ổ chảo vai z 1.36–1.40
#   · cơ hoành z 1.04–1.27 · phổi z 1.17–1.43 · gan z 1.09–1.26 · thận z 1.04–1.17
#   · thanh quản z 1.46–1.50 · lưỡi z 1.50–1.54 · hốc mắt z 1.56–1.65 · ốc tai z 1.575.
#
# Khoá cấu hình:
#   box          (x0,x1,y0,y1,z0,z1) hộp cắt
#   side         "r"/"l" giữ một bên, None lấy cả hai
#   *_kw         True = lấy hết nhóm đó trong hộp; list = lọc theo từ khoá tên
#                bone_kw(hệ1) joint_kw(hệ3) muscle_kw(hệ4) organ_kw(hệ8)
#                organ6_kw(lách ở hệ6) sense_kw(mắt/tai/não ở hệ7)
#   *_drop       từ khoá loại trừ
#   vessels/nerves  True/False (curve hệ5/hệ7 -> ống)
#   lymph        True để lấy hạch
#   skin         True để bọc da voxel; skin_bones = True(mọi xương đã chọn)
#                hoặc list tên xương cho vào khối bọc

# Cấu trúc của vùng KHÁC hay lọt vào hộp do lọc theo tâm bbox (mạch tạng bụng,
# mạch chi dưới). Vùng nào cần thì tự thêm curve_drop riêng.
DROP_CURVE_KW = [
    "iliac", "femoral", "popliteal", "tibial", "fibular", "peroneal", "plantar",
    "sural", "sciatic", "obturator", "pudendal", "sacral", "uterine", "testicular",
    "renal", "suprarenal", "mesenteric", "coeliac", "celiac", "splenic", "gastric",
    "hepatic", "cystic", "pancreatic", "rectal", "vesical", "prostatic",
]

# Mạch/ống của LỒNG NGỰC và CHẬU HÔNG hay lọt vào hộp của các scene tạng bụng:
# mạch phổi, phế quản phân thuỳ, mạch vành, mạch mông và mạch sinh dục ngoài đều
# là đường cong DÀI, tâm bbox của chúng rơi vào ổ bụng dù bản thân mạch nằm hẳn
# ở ngực hoặc đáy chậu. Đã đo trên file cũ: peritoneum_full.glb có 25 mạch phổi,
# 22 mạch chậu–sinh dục và 7 mạch vành trên tổng 115 mesh.
THORAX_PELVIS_DROP_KW = [
    "pulmonary", "lobar", "lingular", "segmental", "basal", "bronch",
    # Z-Anatomy đặt tên vài tĩnh mạch phổi KHÔNG có chữ "pulmonary"
    # ("Medial vein of right lung") nên phải chặn thêm theo cụm này.
    "of right lung", "of left lung",
    "coronary artery", "coronary sinus", "cardiac vein", "interventricular",
    "circumflex artery of heart",
    "ventricle", "atrial", "penis", "penile", "gluteal", "iliolumbar",
    "intercostal", "azygos", "phrenic", "subcostal", "thoracic",
]

# Hộp trùm cả người, dùng cho 7 hệ toàn thân ở cuối file (không cắt gì).
FULLBODY_BOX = (-0.45, 0.45, -0.35, 0.35, -0.05, 1.80)

REGIONS = {
    # ---------- Nhóm B: chi trên ----------
    # Hộp đo lại 2026-08-18 bằng query_bbox.py: khối bàn tay phải nằm trong
    #   x -0.340..-0.224 · y -0.100..-0.004 · z 0.698..0.868
    # (đốt xa ngón II–IV z 0.699–0.722, móng z 0.699–0.780). Hộp cũ z0=0.730 CẮT
    # CỤT ba đầu ngón: model thiếu hẳn đốt xa ngón trỏ/giữa/nhẫn. z0=0.688 lấy
    # trọn đầu ngón (chừa thêm 12mm cho lớp da voxel phồng ra), z1=0.930 giữ đoạn cổ tay + đầu dưới quay–trụ làm mốc.
    "hand": dict(
        out="hand_detail.glb", side="r",
        box=(-0.352, -0.185, -0.118, 0.095, 0.676, 0.930),
        # min_verts=4: Z-Anatomy dựng dây chằng gian cốt cổ tay (thuyền–nguyệt,
        # nguyệt–tháp, cả–móc…), đĩa sụn khớp quay–trụ dưới (TFCC) và nhiều bao
        # gân bằng đúng 4–11 đỉnh. Ngưỡng mặc định 10 loại mất ~20 dây chằng cổ
        # tay — đúng phần "chi tiết" mà scene này tồn tại để dạy.
        min_verts=4,
        bone_kw=True, joint_kw=True, muscle_kw=True,
        # Móng tay + mầm móng nằm ở hệ 9 (nhóm "vùng cơ thể"); gọi ĐÍCH DANH,
        # không lấy cả nhóm vì phần còn lại chỉ là mảng nhãn bề mặt (Palm,
        # Dorsum of hand…) đắp chồng lên da.
        region_kw=["nail plate", "perionyx"],
        vessels=True, nerves=True, skin=True, skin_bones=True,
        # Thân ĐM quay/trụ và thân TK giữa/trụ/quay có tâm bbox nằm tận cẳng tay
        # nên phép xét tâm loại chúng ra — mà thiếu chúng thì ống cổ tay không
        # có thần kinh giữa, ống Guyon không có bó mạch–thần kinh trụ.
        curve_keep_names=["radial artery", "ulnar artery", "median nerve",
                          "ulnar nerve", "superficial branch of radial nerve",
                          "princeps pollicis", "radialis indicis",
                          "cephalic vein", "basilic vein"],
        voxel=0.0035, inflate=0.008,
    ),
    "joints_upper": dict(
        out="upper_limb_joints.glb", side="r",
        box=(-0.305, -0.055, -0.115, 0.135, 0.975, 1.465),
        bone_kw=True,
        bone_drop=["rib", "vertebra", "costal", "sternum", "xiphoid", "hip bone", "sacrum",
                   "coccyx", "ilium", "ischium", "pubis"],
        joint_kw=True,
        joint_drop=["sacro", "iliolumbar", "intercostal", "costo", "pubic", "hip"],
        vessels=False, nerves=False, skin=False,
    ),

    # ---------- Nhóm B2: chi dưới ----------
    # Toạ độ đo bằng query_bbox.py (bên PHẢI cơ thể là X ÂM):
    #   xương đùi z 0.430–0.884 · dây chằng chéo z 0.414–0.457 · bánh chè z 0.347–0.564
    #   · khớp háng z 0.804–0.889 · cơ mông z 0.709–0.997 · cơ dép z 0.134–0.410
    #   · gân gót z 0.025–0.245 · xương gót z 0.011–0.063 · xương bàn chân z 0.006–0.072.
    "knee": dict(
        out="knee_joint.glb", side="r", min_verts=4,
        box=(-0.150, -0.005, -0.075, 0.105, 0.330, 0.580),
        bone_kw=True, joint_kw=True,
        muscle_kw=["quadriceps", "vastus", "rectus femoris", "biceps femoris",
                   "semitendinosus", "semimembranosus", "gastrocnemius", "popliteus",
                   "sartorius", "gracilis", "plantaris", "retinaculum"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["popliteal", "genicular", "sural", "saphenous", "tibial nerve",
                          "fibular nerve", "peroneal nerve"],
    ),
    "hip_thigh": dict(
        out="hip_thigh.glb", side="r", min_verts=4,
        box=(-0.160, -0.005, -0.085, 0.125, 0.560, 1.000),
        bone_kw=["femur", "hip bone", "ilium", "ischium", "pubis", "sacrum", "patella"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "sterno", "acromio", "costo",
                    "intervertebral", "ankle", "tarsal", "longitudinal ligament",
                    "intercornual", "ligamenta flava", "nucleus pulposus"],
        muscle_kw=True,
        # Mép trên hộp chạm thành bụng và sàn chậu: cơ chéo bụng, cơ dựng sống,
        # cơ nâng hậu môn không thuộc bài "khớp háng – đùi" mà lại che kín khối
        # mông khi xem từ sau.
        muscle_drop=["abdominal oblique", "transversus abdominis", "rectus abdominis",
                     "thoracolumbar", "iliocostalis", "longissimus", "multifidus",
                     "intertransversarii", "interspinales", "anal sphincter", "coccygeus",
                     "levator ani", "iliococcygeus", "pubococcygeus", "puborectalis",
                     "bulbospongiosus", "ischiocavernosus", "urethral sphincter",
                     "cremaster", "dartos", "latissimus", "quadratus lumborum",
                     "rotatores", "pyramidalis", "pubo-analis", "linea alba",
                     "transversalis", "investing abdominal"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["femoral", "profunda femoris", "obturator", "gluteal", "sciatic",
                          "saphenous", "circumflex femoral", "perforating"],
        curve_drop=["appendicular", "ileocolic", "colic", "mesenteric", "penis", "penile",
                    "cauda equina", "rectal", "vesical", "prostatic", "uterine"],
    ),
    # Khớp háng RIÊNG — chi dưới đã có khớp gối, cổ chân, còn khớp háng thì
    # trước nay chỉ nằm lẫn trong vùng "khớp háng – đùi" cùng toàn bộ khối cơ
    # mông và cơ đùi, che kín chính cái ổ khớp. Hộp bám sát ổ cối và đầu trên
    # xương đùi (ổ cối z 0.841–0.889, dây chằng chậu–đùi z 0.811–0.887), lấy
    # xuống 0.755 để còn mấu chuyển lớn – bé làm mốc.
    "hip_joint": dict(
        out="hip_joint.glb", side="r", min_verts=4,
        box=(-0.145, -0.010, -0.075, 0.080, 0.755, 0.920),
        bone_kw=["femur", "hip bone", "ilium", "ischium", "pubis", "sacrum"],
        joint_kw=True,
        # Khớp mu và khớp cùng–chậu nằm sát trong hộp nhưng là bài khác (chậu
        # hông); giữ lại thì hình đọc thành "nửa khung chậu" chứ không phải một
        # khớp háng.
        joint_drop=["pubic symphysis", "sacro-iliac", "sacroiliac", "intervertebral",
                    "ligamenta flava", "longitudinal ligament", "knee", "patell",
                    "ankle", "tarsal", "costo", "shoulder", "elbow", "wrist"],
        muscle_kw=["obturator", "gemellus", "piriformis", "quadratus femoris",
                   "iliopsoas", "psoas", "iliacus", "pectineus", "rectus femoris",
                   "gluteus minimus"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["obturator", "circumflex femoral", "gluteal", "sciatic",
                          "femoral artery", "femoral vein", "femoral nerve"],
        curve_drop=["appendicular", "colic", "mesenteric", "rectal", "vesical",
                    "prostatic", "penis", "penile", "saphenous", "popliteal"],
    ),
    "leg_foot": dict(
        out="leg_foot.glb", side="r", min_verts=4,
        # z1 dừng ở 0.410 (dưới khe khớp gối) để không lặp lại chính khớp gối —
        # dây chằng chéo, sụn chêm đã là nội dung của scene "khop-goi".
        box=(-0.150, -0.005, -0.100, 0.110, 0.000, 0.410),
        bone_kw=True, joint_kw=True, muscle_kw=True,
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["tibial", "fibular", "peroneal", "dorsalis pedis", "plantar",
                          "saphenous", "sural", "arcuate artery"],
    ),

    # Bàn chân CHI TIẾT — bản đối xứng của "bàn tay chi tiết" ở chi dưới.
    # Vùng "cẳng chân – bàn chân" lấy cả khối cơ cẳng chân nên bàn chân chỉ còn
    # là một mẩu nhỏ cuối hình; ở đây hộp bám sát bàn chân (xương gót z 0.011–
    # 0.063, sên z 0.050–0.085, đốt bàn z 0.006–0.072, cân gan chân z 0.007–
    # 0.026) và min_verts=4 để giữ dây chằng gan chân, xương vừng, gân nhỏ.
    "foot_detail": dict(
        out="foot_detail.glb", side="r", min_verts=4,
        box=(-0.152, -0.005, -0.135, 0.105, 0.000, 0.115),
        bone_kw=True, joint_kw=True, muscle_kw=True,
        vessels=True, nerves=True, skin=True, skin_bones=True,
        # Gân cơ chày sau, mác dài, gấp/duỗi ngón dài có thân nằm ở cẳng chân
        # nên phép xét tâm bbox loại hết — mà thiếu chúng thì gan chân không còn
        # dây chằng động và vòm bàn chân mất phần giữ chủ động.
        curve_keep_names=["plantar", "dorsalis pedis", "tibial", "fibular", "peroneal",
                          "arcuate artery", "sural", "saphenous"],
        voxel=0.0035, inflate=0.008,
    ),

    # ---------- Nhóm B3: chậu hông, lưng, thành ngực ----------
    # Đo bằng query_bbox.py: cơ nâng hậu môn z 0.819–0.868 · bàng quang z 0.829–0.882
    # · cơ thang z 1.120–1.575 · cơ lưng rộng z 0.932–1.342 · cơ gian sườn z 0.982–1.442
    # · xương ức z 1.240–1.404 · đám rối cánh tay z 1.378–1.505 · cơ delta z 1.251–1.436.
    "pelvis_perineum": dict(
        out="pelvis_perineum.glb", side=None, min_verts=4,
        box=(-0.140, 0.140, -0.095, 0.105, 0.755, 0.960),
        bone_kw=["hip bone", "sacrum", "coccyx", "ilium", "ischium", "pubis", "femur"],
        joint_kw=True,
        muscle_kw=["levator ani", "coccygeus", "iliococcygeus", "pubococcygeus",
                   "puborectalis", "pubo-analis", "sphincter", "bulbospongiosus",
                   "ischiocavernosus", "transverse perineal", "obturator internus",
                   "piriformis"],
        organ_kw=["bladder", "urethra", "rectum", "anal", "prostate", "seminal",
                  "ductus deferens", "ejaculatory"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["pudendal", "internal iliac", "vesical", "rectal", "prostatic",
                          "obturator", "gluteal", "sacral"],
        curve_drop=["appendicular", "ileocolic", "mesenteric", "colic", "femoral artery",
                    "profunda"],
    ),
    "back_muscles": dict(
        out="back_muscles.glb", side=None, min_verts=4,
        # y0=0.005 giữ lại đúng nửa SAU thân mình — vùng lưng theo nghĩa lâm sàng.
        box=(-0.200, 0.200, 0.005, 0.145, 0.900, 1.580),
        bone_kw=["vertebra", "rib", "scapula", "sacrum", "ilium", "hip bone", "occipital"],
        muscle_kw=True,
        # Hộp trải từ mông tới gáy nên chạm cả khối mông và gốc chi trên: không
        # loại thì scene "cơ lưng" có nguyên cơ mông lớn và cơ nhị đầu cánh tay.
        muscle_drop=["pectoralis", "sternocleidomastoid", "abdominis", "external abdominal",
                     "internal abdominal", "transversus abdominis", "scalene", "platysma",
                     "gluteus", "iliacus", "psoas", "piriformis", "gemellus", "obturator",
                     "quadratus femoris", "deltoid", "brachii", "brachialis",
                     "coracobrachialis", "supinator", "pronator", "anconeus"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["dorsal", "posterior intercostal", "lumbar", "transverse cervical",
                          "dorsal scapular", "thoracodorsal", "suprascapular"],
    ),
    "thoracic_wall": dict(
        out="thoracic_wall.glb", side=None, min_verts=4,
        box=(-0.170, 0.170, -0.145, 0.170, 0.980, 1.450),
        bone_kw=["rib", "sternum", "costal", "xiphoid", "vertebra t", "clavicle"],
        joint_kw=True, joint_drop=["shoulder", "elbow", "hip", "knee", "sacro"],
        muscle_kw=["intercostal", "transversus thoracis", "subcostal", "serratus posterior",
                   "levatores costarum", "diaphragm"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["intercostal", "internal thoracic", "musculophrenic",
                          "superior epigastric", "thoracic"],
        curve_drop=["pulmonary", "lobar", "bronch", "coronary artery", "cardiac vein"],
    ),
    "shoulder_axilla": dict(
        out="shoulder_axilla.glb", side="r", min_verts=4,
        box=(-0.250, -0.015, -0.095, 0.135, 1.190, 1.530),
        bone_kw=["scapula", "clavicle", "humerus", "rib", "sternum"],
        joint_kw=True, joint_drop=["hip", "knee", "ankle", "wrist", "carpal", "vertebra"],
        muscle_kw=["deltoid", "pectoralis", "serratus anterior", "subscapularis",
                   "supraspinatus", "infraspinatus", "teres", "coracobrachialis",
                   "biceps brachii", "triceps brachii", "latissimus dorsi", "subclavius",
                   "trapezius", "rhomboid", "levator scapulae", "omohyoid"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["axillary", "brachial", "subclavian", "thoraco-acromial",
                          "circumflex humeral", "subscapular", "suprascapular", "cephalic",
                          "median nerve", "ulnar nerve", "radial nerve", "musculocutaneous",
                          "plexus", "trunk of brachial", "cord", "lateral thoracic",
                          "thoracodorsal", "long thoracic"],
        curve_drop=["pulmonary", "lobar", "lingular", "of right lung", "of left lung",
                    "bronch", "coronary", "cardiac vein", "mesenteric", "colic"],
    ),
    "inguinal_region": dict(
        out="inguinal_region.glb", side="r", min_verts=4,
        box=(-0.135, -0.005, -0.115, 0.025, 0.850, 1.070),
        bone_kw=["hip bone", "pubis", "ilium", "femur"],
        joint_kw=True,
        muscle_kw=["abdominal oblique", "transversus abdominis", "rectus abdominis",
                   "cremaster", "pyramidalis", "iliacus", "psoas", "pectineus", "sartorius",
                   "inguinal ligament", "lacunar", "pectineal ligament", "conjoint"],
        organ_kw=["spermatic", "ductus deferens", "testis", "epididymis"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["epigastric", "femoral", "circumflex iliac", "external iliac",
                          "ilio-inguinal", "iliohypogastric", "genitofemoral", "cremasteric",
                          "testicular"],
        curve_drop=["mesenteric", "colic", "appendicular", "marginal artery", "ileal",
                    "pulmonary", "bronch"],
    ),

    # ---------- Nhóm C: đầu – mặt – cổ ----------
    "face_muscles": dict(
        out="face_muscles.glb", side=None, min_verts=4,
        box=(-0.090, 0.090, -0.115, 0.025, 1.460, 1.665),
        bone_kw=["maxilla", "mandible", "zygomatic", "nasal", "frontal bone"],
        muscle_kw=["orbicularis", "zygomaticus", "levator labii", "levator anguli",
                   "depressor", "risorius", "buccinator", "mentalis", "nasalis",
                   "procerus", "corrugator", "platysma", "occipitofrontalis", "frontalis",
                   "auricular"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["facial", "labial", "angular", "infra-orbital", "mental",
                          "buccal", "zygomatic", "temporal branch", "marginal mandibular",
                          "cervical branch"],
    ),
    "tmj_mastication": dict(
        out="tmj_mastication.glb", side=None, min_verts=4,
        box=(-0.095, 0.095, -0.085, 0.045, 1.470, 1.610),
        bone_kw=["mandible", "temporal bone", "zygomatic", "sphenoid", "maxilla", "hyoid"],
        joint_kw=True,
        muscle_kw=["masseter", "temporalis", "pterygoid", "mylohyoid", "digastric",
                   "geniohyoid", "stylohyoid"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["maxillary", "masseteric", "deep temporal", "mandibular nerve",
                          "inferior alveolar", "lingual nerve", "buccal", "auriculotemporal",
                          "trigeminal", "facial"],
    ),
    "cervical_spine": dict(
        out="cervical_spine.glb", side=None, min_verts=4,
        box=(-0.070, 0.070, -0.030, 0.095, 1.410, 1.580),
        bone_kw=["vertebra c", "atlas", "axis", "occipital"],
        joint_kw=True,
        muscle_kw=["longus colli", "longus capitis", "rectus capitis", "obliquus capitis",
                   "scalene", "splenius", "semispinalis", "multifidus", "intertransversarii"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["vertebral", "spinal", "cervical", "occipital"],
    ),
    "lumbar_spine": dict(
        out="lumbar_spine.glb", side=None, min_verts=4,
        box=(-0.090, 0.090, -0.035, 0.095, 0.930, 1.160),
        bone_kw=["vertebra l", "sacrum", "coccyx", "ilium", "hip bone", "rib"],
        joint_kw=True,
        muscle_kw=["psoas", "quadratus lumborum", "multifidus", "erector spinae",
                   "iliocostalis", "longissimus", "spinalis", "intertransversarii",
                   "interspinales", "rotatores"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["lumbar", "spinal", "cauda equina", "iliolumbar", "sacral"],
        curve_drop=["mesenteric", "colic", "appendicular", "renal", "gonadal"],
    ),

    # Cột sống NGỰC — mảnh còn thiếu giữa cột sống cổ và cột sống thắt lưng.
    # Đây là đoạn duy nhất có khớp SƯỜN–ĐỐT SỐNG, và cũng là đoạn tuỷ hay bị
    # tổn thương do gãy lún. Đốt T1–T12 đo được z 1.112–1.453, x ±0.039; nới x
    # ra ±0.115 để lấy chỏm sườn và khớp sườn–mỏm ngang.
    "thoracic_spine": dict(
        out="thoracic_spine.glb", side=None, min_verts=4,
        box=(-0.115, 0.115, -0.045, 0.115, 1.100, 1.465),
        bone_kw=["vertebra t", "rib", "costal cartilage"],
        joint_kw=True,
        # Đai vai gắn vào lồng ngực NGAY TRONG hộp: dây chằng ức–đòn, quạ–đòn,
        # gian đòn không thuộc bài cột sống ngực mà lại nằm chắn phía trước.
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "hip", "knee", "ankle",
                    "acromio", "clavicul", "conoid", "trapezoid", "temporo",
                    "crico", "thyro", "C5-C6", "C6-C7", "L1-L2"],
        muscle_kw=["multifidus", "rotatores", "semispinalis", "spinalis", "longissimus",
                   "iliocostalis", "levatores costarum", "intertransversarii",
                   "interspinales", "serratus posterior"],
        muscle_drop=["capitis"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["posterior intercostal", "intercostal nerve", "azygos",
                          "thoracic duct", "sympathetic", "splanchnic", "radicular",
                          "spinal", "subcostal", "thoracic aorta"],
        # Lọc theo TÂM bbox kéo vào đủ thứ đi ngang qua ngực: mạch phân thuỳ
        # phổi, tĩnh mạch tim, đám rối cánh tay, mạch tuyến giáp – cảnh – dưới
        # đòn. Chúng đều là bài khác, mà lại là đường cong dài nên che kín cột
        # sống khi xem từ trước.
        curve_drop=["lung", "pulmonary", "lobar", "lingular", "segmental", "bronch",
                    "cardiac", "ventricle", "atrial", "coronary", "interventricular",
                    "circumflex artery of heart", "accessory nerve", "thyrocervical",
                    "costocervical",
                    "brachial plexus", "trunk of brachial", "pectoral", "acromial",
                    "subscapular", "scapular", "long thoracic", "lateral thoracic",
                    "internal thoracic", "thyroid", "carotid", "jugular", "subclavian",
                    "brachiocephalic", "axillary", "cervical artery", "suprascapular",
                    "phrenic", "aortic arch", "ascending aorta", "abdominal aorta",
                    "vena cava", "gastro-omental", "mesenteric", "renal", "colic",
                    "gastric", "hepatic", "splenic", "iliac", "femoral"],
    ),

    "skull_base": dict(
        out="skull_base.glb", side=None,
        box=(-0.105, 0.105, -0.135, 0.125, 1.480, 1.735),
        bone_kw=True, bone_drop=["vertebra t", "rib", "clavicle", "scapula", "costal"],
        vessels=True, nerves=True, skin=False,
    ),
    "orbit": dict(
        out="orbit_eye.glb", side=None,
        box=(-0.088, 0.088, -0.108, 0.045, 1.532, 1.668),
        bone_kw=True,
        muscle_kw=["rectus", "oblique", "levator palpebrae", "orbicularis oculi",
                   "corrugator", "procerus"],
        sense_kw=["sclera", "cornea", "iris", "lens", "retina", "choroid", "ciliary",
                  "vitreous", "lacrimal", "conjunctiva", "eyelid", "optic"],
        vessels=True, nerves=True, skin=False,
    ),
    "ear": dict(
        out="ear_full.glb", side=None,
        box=(-0.080, 0.080, -0.040, 0.055, 1.548, 1.610),
        bone_kw=True,
        sense_kw=["cochlea", "vestibul", "semicircular", "tympanic", "malleus", "incus",
                  "stapes", "labyrinth", "auditory", "utricle", "saccule", "ampulla"],
        vessels=True, nerves=True, skin=False,
    ),
    "nose_sinus": dict(
        out="nose_sinus.glb", side=None,
        box=(-0.058, 0.058, -0.140, 0.035, 1.515, 1.665),
        bone_kw=True, bone_drop=["mandible", "tooth", "incisor", "canine", "premolar", "molar"],
        organ_kw=["nasal", "sinus", "septum", "choana", "nasopharynx"],
        sense_kw=["olfactory"],
        vessels=True, nerves=True, skin=False,
    ),
    "mouth": dict(
        out="mouth_tongue.glb", side=None,
        box=(-0.068, 0.068, -0.108, 0.035, 1.445, 1.600),
        bone_kw=True, bone_drop=["parietal", "occipital", "frontal bone"],
        muscle_kw=["tongue", "glossus", "masseter", "temporalis", "pterygoid", "mylohyoid",
                   "geniohyoid", "digastric", "buccinator", "orbicularis oris", "palat",
                   "risorius", "depressor", "mentalis"],
        organ_kw=["tongue", "salivary", "parotid", "submandibular gland", "sublingual",
                  "oral", "palate", "uvula", "tonsil"],
        vessels=True, nerves=True, skin=False,
    ),
    "pharynx_larynx": dict(
        out="pharynx_larynx.glb", side=None,
        box=(-0.058, 0.058, -0.062, 0.048, 1.385, 1.595),
        bone_kw=["hyoid", "cartilage"],
        muscle_kw=["constrictor", "arytenoid", "cricothyroid", "vocalis", "pharyngeus",
                   "thyrohyoid", "cricopharyngeus", "mylohyoid", "geniohyoid", "stylohyoid",
                   "hyoglossus", "sternohyoid", "omohyoid", "digastric"],
        organ_kw=["pharynx", "larynx", "epiglottis", "vocal", "vestibular fold", "trachea",
                  "oesophagus", "esophagus", "thyroid gland", "parathyroid"],
        vessels=True, nerves=True, skin=False,
    ),

    # ---------- Nhóm D: ngực ----------
    "heart": dict(
        out="heart_full.glb", side=None,
        box=(-0.095, 0.105, -0.095, 0.065, 1.185, 1.395),
        heart_kw=True,   # buồng tim, van, màng ngoài tim nằm ở hệ 5 chứ không phải hệ 8
        organ_kw=["pericard", "oesophagus", "esophagus", "trachea", "bronch"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["coronary", "cardiac", "aorta", "pulmonary", "vena cava"],
        # bỏ mạch thành ngực: tâm bbox của chúng lọt vào hộp tim, để lại hàng
        # chục mẩu ống cắt ngang lởm chởm quanh quả tim.
        curve_drop=["intercostal", "subcostal", "thoracic artery", "musculophrenic",
                    "epigastric", "pericardiacophrenic", "bronchial"],
    ),
    "lungs": dict(
        out="lungs_airways.glb", side=None,
        box=(-0.165, 0.165, -0.115, 0.105, 1.140, 1.455),
        organ_kw=["lung", "lobe", "bronch", "trachea", "pleura", "carina"],
        organ_tubes=True,
        vessels=True, nerves=True, lymph=True, skin=False,
        curve_drop=["axillary", "jugular", "cervical", "supraclavicular", "parotid",
                    "submandibular", "mastoid", "brachial nodes", "pyloric", "hepatic nodes"],
        curve_keep_names=["pulmonary", "bronchial", "phrenic", "vagus"],
    ),
    "mediastinum": dict(
        out="mediastinum.glb", side=None,
        box=(-0.095, 0.095, -0.085, 0.085, 1.140, 1.480),
        bone_kw=["sternum", "manubrium", "vertebra t"],
        heart_kw=True, organ6_kw=["thymus"], organ_tubes=True,
        organ_kw=["trachea", "bronch", "oesophagus", "esophagus", "thymus", "pericard",
                  "lung", "lobe of"],
        curve_drop=["axillary", "jugular", "cervical", "supraclavicular", "parotid",
                    "submandibular", "mastoid", "pyloric", "gastric nodes"],
        vessels=True, nerves=True, lymph=True, skin=False,
        curve_keep_names=["aorta", "vena cava", "brachiocephalic", "azygos", "thoracic duct",
                          "phrenic", "vagus", "laryngeal", "sympathetic", "pulmonary"],
    ),
    "diaphragm": dict(
        out="diaphragm_full.glb", side=None,
        box=(-0.165, 0.165, -0.125, 0.095, 1.010, 1.300),
        bone_kw=["rib", "costal cartilage", "sternum", "xiphoid", "vertebra t", "vertebra l"],
        muscle_kw=["diaphragm", "intercostal", "transversus thoracis", "psoas",
                   "quadratus lumborum"],
        organ_kw=["oesophagus", "esophagus"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["phrenic", "aorta", "vena cava", "intercostal"],
    ),

    # ---------- Nhóm E: bụng ----------
    "abdominal_wall": dict(
        out="abdominal_wall.glb", side=None,
        box=(-0.185, 0.185, -0.145, 0.105, 0.845, 1.305),
        bone_kw=["rib", "costal cartilage", "hip bone", "pubis", "vertebra l", "sacrum",
                 "xiphoid", "sternum"],
        muscle_kw=["rectus abdominis", "oblique", "transversus abdominis", "pyramidalis",
                   "cremaster", "psoas", "quadratus lumborum", "iliacus"],
        vessels=True, nerves=True, skin=True, skin_bones=[],
        curve_keep_names=["epigastric", "iliohypogastric", "ilio-inguinal", "intercostal",
                          "subcostal", "lumbar"],
    ),
    "liver": dict(
        out="liver_biliary.glb", side=None,
        box=(-0.135, 0.115, -0.115, 0.075, 1.050, 1.290),
        organ_kw=["liver", "hepat", "gallbladder", "bile", "cystic", "falciform", "portal"],
        organ_tubes=True,
        vessels=True, nerves=False, skin=False,
        curve_keep_names=["hepatic", "portal", "cystic", "coeliac", "celiac", "gastric"],
        # organ_tubes kéo theo CURVE của hệ 8, trong đó có phế quản phân thuỳ
        # (phổi nằm ngay trên gan nên tâm bbox rơi vào hộp) — file cũ có 18 ống
        # phế quản nằm lửng lơ trên lá gan.
        curve_drop=THORAX_PELVIS_DROP_KW,
    ),
    "stomach": dict(
        out="stomach_duodenum.glb", side=None,
        box=(-0.075, 0.125, -0.105, 0.045, 1.060, 1.265),
        organ_kw=["stomach", "duoden", "pylor", "oesophagus", "esophagus", "omentum"],
        organ_tubes=True,
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["gastric", "gastro", "splenic", "coeliac", "celiac", "hepatic",
                          "pancreaticoduodenal", "vagus"],
        # Cùng lý do như vùng gan, thêm thần kinh THÀNH BỤNG/THÀNH NGỰC (gian
        # sườn, chậu–hạ vị) vốn không liên quan dạ dày — thần kinh cần giữ ở đây
        # là dây X (vagus), đã nằm trong curve_keep_names.
        curve_drop=THORAX_PELVIS_DROP_KW + ["iliohypogastric", "ilioinguinal", "genitofemoral"],
    ),
    "intestines": dict(
        out="intestines_full.glb", side=None,
        box=(-0.145, 0.145, -0.105, 0.095, 0.760, 1.210),
        organ_kw=["intestine", "jejun", "ileum", "ileal", "colon", "caecum", "cecum",
                  "appendix", "rectum", "mesent", "taenia", "mesocolon"],
        organ_tubes=True,
        vessels=True, nerves=False, lymph=True, skin=False,
        curve_keep_names=["mesenteric", "colic", "rectal", "ileal", "jejunal", "sigmoid"],
    ),
    "pancreas_spleen": dict(
        out="pancreas_spleen.glb", side=None,
        box=(-0.075, 0.135, -0.075, 0.075, 1.040, 1.235),
        organ_kw=["pancrea", "duoden"], organ6_kw=["spleen"],
        vessels=True, nerves=False, skin=False,
        curve_keep_names=["splenic", "pancreatic", "coeliac", "celiac", "gastric", "portal"],
    ),
    "urinary": dict(
        out="urinary_full.glb", side=None,
        box=(-0.125, 0.125, -0.045, 0.095, 0.880, 1.215),
        organ_kw=["kidney", "renal", "ureter", "suprarenal", "adrenal", "bladder", "urethra"],
        organ_tubes=True,
        vessels=True, nerves=False, skin=False,
        curve_keep_names=["renal", "suprarenal", "ureteric", "gonadal", "testicular", "aorta",
                          "vena cava", "lumbar"],
    ),
    # Scene này KHÔNG chỉ có mấy tấm mạc: mạc nối lớn rủ từ bờ cong lớn dạ dày,
    # mạc treo đại tràng ngang căng giữa hai tầng — không có dạ dày, gan, ruột
    # làm mốc thì các tấm mạc lơ lửng, người học không đọc ra được chúng bám vào
    # đâu. Vì vậy lấy thêm các tạng lân cận làm KHUNG THAM CHIẾU (người dùng vẫn
    # tắt được bằng lớp "Nội tạng" trên bảng Lớp giải phẫu).
    # Hộp: z0 nâng từ 0.790 lên 0.940 (ngang eo chậu) — mức cũ thò xuống tận đáy
    # chậu nên kéo theo mạch mông và mạch sinh dục ngoài.
    "peritoneum": dict(
        out="peritoneum_full.glb", side=None,
        box=(-0.155, 0.155, -0.125, 0.105, 0.940, 1.290),
        organ_kw=["omentum", "mesent", "mesocolon", "peritone", "falciform",
                  "ligament of liver", "coronary ligament", "gastrosplenic", "gastrocolic",
                  "stomach", "duoden", "liver", "hepat", "gallbladder",
                  "jejun", "ileum", "ileal", "colon", "caecum", "cecum", "taenia",
                  "appendix"],
        organ6_kw=["spleen"],
        # Ruột non trong Z-Anatomy là CURVE (hỗng tràng), chỉ ra mesh khi bật
        # organ_tubes — mà "ruột treo lơ lửng trên mạc treo" là ý chính của bài.
        organ_tubes=True,
        vessels=True, nerves=False, skin=False,
        # Mạch đi TRONG mạc treo chính là nội dung bài học ("mạc treo là con
        # đường của mạch máu"), nên giữ trọn bộ mạch tiêu hoá và bộ ba cửa ở bờ
        # tự do mạc nối nhỏ; chặn hẳn mạch ngực và chậu.
        curve_keep_names=["mesenteric", "colic", "ileocolic", "appendicular", "marginal",
                          "sigmoid", "gastro", "gastric", "splenic", "hepatic", "portal",
                          "coeliac", "celiac", "cystic", "pancreatic"],
        curve_drop=THORAX_PELVIS_DROP_KW,
    ),

    # ---------- Nhóm F: thần kinh ----------
    "cerebrum": dict(
        out="cerebrum_full.glb", side=None,
        # z0 hạ từ 1.545 xuống 1.528: vùng dưới đồi nằm vắt qua mức cũ nên bản
        # cắt cũ chỉ giữ được một mẩu, còn bản cắt mới (bisect đúng mặt phẳng)
        # cắt sạch làm mất hẳn mesh — nhãn "Vùng dưới đồi" trỏ vào khoảng không.
        box=(-0.095, 0.095, -0.095, 0.095, 1.528, 1.760),
        # keep_kw: lấy theo phép GIAO thay vì theo tâm — bbox của Hypothalamus
        # trong Startup.blend trải từ z 1,148 tới 1,624 m nên tâm rơi tận ngực.
        keep_kw=["hypothalamus"],
        sense_kw=["cerebr", "gyrus", "lobe", "cortex", "insula", "corpus callosum", "fornix",
                  "hippocamp", "amygdala", "ventricle", "septum pellucidum", "white matter",
                  "caudate", "putamen", "pallidus", "thalam", "claustrum"],
        vessels=True, nerves=False, skin=False,
        curve_keep_names=["cerebral", "communicating", "choroidal", "callosal"],
    ),
    "brainstem": dict(
        out="brainstem_full.glb", side=None,
        box=(-0.058, 0.058, -0.045, 0.075, 1.485, 1.665),
        sense_kw=["medulla", "pons", "midbrain", "mesencephal", "olive", "peduncle",
                  "colliculus", "tegment", "substantia nigra", "red nucleus", "nucleus",
                  "pyramid", "reticular", "aqueduct", "fourth ventricle"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["basilar", "vertebral", "cerebellar", "nerve"],
    ),
    "cerebellum": dict(
        out="cerebellum_full.glb", side=None,
        box=(-0.085, 0.085, 0.000, 0.100, 1.530, 1.670),
        sense_kw=["cerebell", "vermis", "tonsil", "flocculus", "dentate", "nodulus",
                  "fourth ventricle", "peduncle"],
        vessels=True, nerves=False, skin=False,
        curve_keep_names=["cerebellar", "basilar", "vertebral"],
    ),
    "spinal_cord": dict(
        out="spinal_cord.glb", side=None,
        box=(-0.135, 0.135, -0.025, 0.105, 0.960, 1.570),
        bone_kw=["vertebra", "sacrum", "atlas", "axis"],
        sense_kw=["spinal cord", "horn", "funiculus", "cauda equina", "filum", "conus",
                  "dura", "arachnoid", "denticulate", "ganglion"],
        vessels=False, nerves=True, skin=False,
        curve_keep_names=["spinal", "root", "plexus", "trunk of brachial", "sympathetic",
                          "intercostal", "phrenic", "femoral", "sciatic", "obturator"],
    ),

    # ---------- Nhóm G: hệ thống ----------
    "aorta_tree": dict(
        out="arterial_tree.glb", side=None,
        box=(-0.155, 0.155, -0.105, 0.105, 0.820, 1.760),
        vessels=True, nerves=False, skin=False, clip=True,
        curve_keep_names=["aorta", "carotid", "subclavian", "brachiocephalic", "vertebral",
                          "basilar", "cerebral", "communicating", "coeliac", "celiac",
                          "mesenteric", "renal", "iliac", "intercostal", "lumbar", "gastric",
                          "splenic", "hepatic", "thyroid", "phrenic", "suprarenal", "gonadal",
                          "sacral", "ophthalmic", "maxillary", "facial", "temporal"],
    ),
    "lymphatic": dict(
        out="lymphatic_system.glb", side=None,
        box=(-0.225, 0.225, -0.155, 0.135, 0.700, 1.640),
        organ_kw=["thymus", "tonsil"], organ6_kw=True,
        vessels=False, nerves=False, lymph=True, skin=False, clip=False,
    ),

    # ---------- Nhóm H: đợt vùng thứ ba ----------
    # Bảy vùng dưới đây lấp đúng những chỗ 34 vùng trước bỏ trống: đường về của
    # máu (mới có cây động mạch), dịch não tuỷ, nội tiết, đám rối chi dưới (mới
    # có đám rối cánh tay ở shoulder_axilla), cổ tay, vùng mông và sinh dục nam.

    "ventricles_meninges": dict(
        out="ventricles_meninges.glb", side=None,
        box=(-0.100, 0.100, -0.105, 0.125, 1.520, 1.730),
        # Vòm sọ để người xem định vị được não thất nằm sâu tới đâu.
        bone_kw=["frontal bone", "parietal bone", "occipital bone", "temporal bone",
                 "sphenoid", "ethmoid"],
        # Xoang trán/bướm và các nhóm tế bào sàng là hốc chứa KHÍ, không dính
        # gì tới đường dịch não tuỷ; để lại chỉ làm rối hình vòm sọ.
        bone_drop=["cells of", "sinus of"],
        sense_kw=["ventricle", "choroid plexus", "aqueduct", "septum pellucidum",
                  "corpus callosum", "falx", "tentorium", "dura", "cerebral peduncle"],
        # Màng cứng tuỷ trải từ z 1,055 tới 1,545 nên TÂM của nó rơi tận ngực và
        # phép xét tâm loại mất — ép sang phép giao để lấy đúng đoạn trong sọ.
        keep_kw=["dura"],
        vessels=False, nerves=False, skin=False,
    ),

    "venous_portal": dict(
        out="venous_portal.glb", side=None,
        box=(-0.170, 0.170, -0.115, 0.115, 0.900, 1.500),
        vessels=True, nerves=False, skin=False, clip=True,
        # DROP_CURVE_KW mặc định chặn "renal"/"hepatic"/"mesenteric"/"splenic" —
        # với vùng khác đó là mạch tạng lọt vào hộp, nhưng ở ĐÂY chúng chính là
        # nội dung bài học (tĩnh mạch thận, tĩnh mạch gan, hệ cửa). Phải tắt.
        curve_drop_default=False,
        curve_keep_names=["vena cava", "portal", "azygos", "vein", "venous"],
        # Chỉ giữ đường VỀ: động mạch cùng hộp sẽ che kín cây tĩnh mạch, mà cây
        # động mạch đã có scene riêng (`he-dong-mach-chu`).
        curve_drop=["artery", "arteries", "arterial", "aorta", "aortic", "trunk",
                    "nerve", "duct", "lymphatic"],
    ),

    "endocrine_glands": dict(
        out="endocrine_glands.glb", side=None, min_verts=4,
        box=(-0.140, 0.140, -0.115, 0.115, 0.700, 1.700),
        # Cột sống + xương ức làm mốc: tuyến nội tiết nằm rải khắp người, thả
        # trôi trong không gian trống thì không định vị được tuyến nào ở đâu.
        bone_kw=["vertebra", "sternum", "sacrum"],
        organ_kw=["thyroid gland", "parathyroid", "suprarenal gland", "pineal gland",
                  "adenohypophysis", "neurohypophysis", "pancreas", "testis",
                  "islet", "hypophysis"],
        organ6_kw=["thymus"],
        vessels=False, nerves=False, skin=False,
    ),

    "lumbosacral_plexus": dict(
        out="lumbosacral_plexus.glb", side="r", min_verts=4,
        box=(-0.165, 0.020, -0.075, 0.125, 0.480, 1.270),
        bone_kw=["lumbar vertebra", "vertebra l", "sacrum", "coccyx", "hip bone",
                 "ilium", "ischium", "pubis", "femur"],
        muscle_kw=["psoas", "iliacus", "quadratus lumborum", "piriformis",
                   "obturator internus", "gluteus"],
        # Túi hoạt dịch và mạc cơ bám quanh mấu chuyển lọt vào theo từ khoá cơ
        # ("Trochanteric bursa of gluteus maximus muscle") — 8 khối tròn nhỏ
        # che mất đúng chỗ dây toạ chui ra dưới cơ hình lê.
        muscle_drop=["bursa", "fascia"],
        vessels=False, nerves=True, skin=False,
        # Y HỆT lý do ở venous_portal: DROP_CURVE_KW chặn sẵn "sciatic",
        # "obturator", "pudendal", "sacral" — đúng bốn thứ vùng này cần nhất.
        curve_drop_default=False,
        curve_keep_names=["femoral nerve", "obturator nerve", "sciatic", "gluteal nerve",
                          "pudendal", "genitofemoral", "iliohypogastric", "ilio-inguinal",
                          "lateral cutaneous nerve of thigh", "posterior cutaneous nerve",
                          "tibial nerve", "common fibular", "lumbar plexus", "sacral plexus",
                          "nerve to", "lumbosacral trunk"],
        curve_drop=["intercostal", "sural"],
    ),

    "wrist_carpal": dict(
        out="wrist_carpal.glb", side="r", min_verts=4,
        box=(-0.325, -0.190, -0.070, 0.020, 0.795, 0.905),
        bone_kw=["carpal", "scaphoid", "lunate", "triquetrum", "pisiform", "trapezium",
                 "trapezoid", "capitate", "hamate", "radius", "ulna", "metacarpal"],
        joint_kw=True,
        muscle_kw=["retinaculum", "flexor digitorum", "flexor pollicis", "flexor carpi",
                   "extensor carpi", "extensor digitorum", "palmaris", "abductor pollicis",
                   "pronator quadratus", "lumbrical", "thenar", "hypothenar"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["median", "ulnar", "radial", "palmar", "interosseous", "digital"],
    ),

    "gluteal_region": dict(
        out="gluteal_region.glb", side="r", min_verts=4,
        box=(-0.165, 0.005, -0.005, 0.135, 0.690, 1.030),
        bone_kw=["hip bone", "ilium", "ischium", "pubis", "sacrum", "coccyx", "femur"],
        joint_kw=True,
        # Mép trên hộp chạm đoạn thắt lưng cùng nên kéo theo cả đĩa đệm L3–S1,
        # dây chằng dọc và dây chằng vàng: đó là nội dung của scene cột sống
        # thắt lưng, không phải vùng mông.
        joint_drop=["knee", "elbow", "shoulder", "ankle", "wrist", "intervertebral",
                    "longitudinal ligament", "flava", "interspinous", "intercornual",
                    "nucleus pulposus", "supraspinous"],
        muscle_kw=["gluteus", "piriformis", "gemellus", "obturator internus",
                   "quadratus femoris", "tensor fasciae latae", "sacrotuberous"],
        muscle_drop=["bursa"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["gluteal", "sciatic", "pudendal", "internal iliac",
                          "posterior cutaneous nerve of thigh", "nerve to", "obturator"],
        curve_drop=["mesenteric", "colic", "renal", "hepatic", "cerebral", "coronary",
                    "appendicular", "median sacral", "iliolumbar",
                    # Mạch tinh hoàn và mạch trực tràng trên chỉ đi NGANG qua hộp
                    # trên đường xuống chậu; đuôi ngựa thì nằm hẳn trong ống sống.
                    "testicular", "anorectal", "cauda equina"],
    ),

    "male_genital": dict(
        out="male_genital.glb", side=None, min_verts=4,
        box=(-0.090, 0.090, -0.125, 0.070, 0.690, 0.910),
        bone_kw=["pubis", "hip bone", "ischium"],
        # KHÔNG khai muscle_kw: đã tra Startup.blend, Z-Anatomy không có mesh cơ
        # bìu, cơ hành xốp, cơ ngồi hang hay cơ thắt niệu đạo. Khai từ khoá chết
        # ở đây chỉ làm người đọc cấu hình tưởng scene có mà thật ra không.
        organ_kw=["testis", "epididymis", "corpus cavernosum", "corpus spongiosum",
                  "penis", "glans", "scrotum", "tunica", "seminal", "prostate",
                  "bulbo-urethral", "urethra", "ductus deferens", "ejaculatory"],
        # Ống dẫn tinh, niệu đạo và ống phóng tinh là CURVE ở hệ 8 — không bật
        # organ_tubes thì scene sinh dục mất đúng cái đường dẫn của nó.
        organ_tubes=True,
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["penis", "penile", "pudendal", "testicular", "scrotal",
                          "deferential", "perineal", "urethra", "ductus deferens",
                          "cremasteric", "vesical"],
        # Hộp nằm ngay dưới chạc đùi nên mạch và thần kinh CHI DƯỚI có tâm rơi
        # vào đây rất nhiều (30 đường ở bản chạy đầu: mạch đùi, mạch mông, dây
        # toạ, dây hiển). Chặn dứt khoát, giữ lại đúng nhánh sinh dục.
        curve_drop=["mesenteric", "colic", "renal artery", "hepatic", "cerebral",
                    "coronary", "pulmonary", "popliteal", "femoral", "gluteal",
                    "circumflex", "perforating", "sciatic", "saphenous",
                    "lateral sacral", "piriformis", "quadratus femoris",
                    "obturator", "anorectal", "iliac"],
    ),

    # ---------- Nhóm I: đợt vùng thứ tư ----------
    # Bảy vùng khớp và vùng giải phẫu kinh điển hay hỏi thi, chọn theo chỗ còn
    # trống sau ba đợt trước. KHÔNG có vùng sinh dục trong đợt này.

    "salivary_glands": dict(
        curve_only_named=True,
        out="salivary_glands.glb", side=None, min_verts=4,
        box=(-0.090, 0.090, -0.090, 0.030, 1.470, 1.610),
        bone_kw=["mandible", "maxilla", "temporal bone", "styloid", "hyoid"],
        muscle_kw=["masseter", "buccinator", "digastric", "mylohyoid", "stylohyoid",
                   "platysma", "pterygoid"],
        organ_kw=["parotid", "submandibular gland", "sublingual gland", "duct"],
        organ_tubes=True,
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["facial", "retromandibular", "maxillary", "lingual",
                          "glossopharyngeal", "auriculotemporal", "external carotid",
                          "superficial temporal", "duct"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral"],
    ),

    "dural_sinuses": dict(
        curve_only_named=True,
        out="dural_sinuses.glb", side=None, min_verts=4,
        box=(-0.095, 0.095, -0.100, 0.115, 1.540, 1.730),
        bone_kw=["frontal bone", "parietal bone", "occipital bone", "temporal bone",
                 "sphenoid"],
        bone_drop=["cells of", "sinus of"],
        sense_kw=["falx", "tentorium"],
        # Xoang hang là MESH nằm ở hệ 5 (mạch) chứ không phải đường cong, nên
        # curve_keep_names không với tới — phải gọi qua heart_kw (khoá đọc hệ 5).
        heart_kw=["cavernous sinus"],
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        # Xoang màng cứng nằm trong hệ mạch (hệ 5) nhưng tên KHÔNG có chữ "vein"
        # nào — phải gọi đích danh từng xoang, lọc theo từ khoá tĩnh mạch là mất sạch.
        curve_keep_names=["sagittal sinus", "transverse sinus", "sigmoid sinus",
                          "straight sinus", "occipital sinus", "cavernous",
                          "petrosal sinus", "sphenoparietal", "confluence",
                          "emissary", "diploic"],
        curve_drop=["coronary", "pulmonary", "mesenteric", "renal", "iliac", "femoral"],
    ),

    "popliteal_fossa": dict(
        out="popliteal_fossa.glb", side="r", min_verts=4,
        box=(-0.150, -0.005, 0.000, 0.115, 0.330, 0.620),
        bone_kw=["femur", "tibia", "fibula", "patella"],
        joint_kw=True, joint_drop=["hip", "ankle", "shoulder", "elbow", "wrist", "intervertebral"],
        muscle_kw=["biceps femoris", "semitendinosus", "semimembranosus", "gastrocnemius",
                   "popliteus", "plantaris", "sartorius", "gracilis", "soleus"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["popliteal", "genicular", "sural", "tibial", "fibular",
                          "peroneal", "saphenous"],
        curve_drop=["mesenteric", "renal", "hepatic", "cerebral", "coronary", "pudendal"],
    ),

    "neck_triangles": dict(
        curve_only_named=True,
        out="neck_triangles.glb", side="r", min_verts=4,
        box=(-0.090, 0.010, -0.085, 0.075, 1.340, 1.600),
        bone_kw=["clavicle", "hyoid", "mandible", "vertebra c", "sternum", "scapula"],
        muscle_kw=["sternocleidomastoid", "omohyoid", "sternohyoid", "sternothyroid",
                   "thyrohyoid", "digastric", "stylohyoid", "mylohyoid", "scalene",
                   "levator scapulae", "trapezius", "platysma", "longus"],
        organ_kw=["thyroid gland", "parathyroid", "trachea", "oesophagus", "esophagus",
                  "larynx", "pharynx"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["carotid", "jugular", "subclavian", "vertebral", "thyroid",
                          "vagus", "accessory", "hypoglossal", "phrenic", "cervical",
                          "brachial plexus", "ansa"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral",
                    "renal", "hepatic",
                    # Mép trên hộp chạm nền sọ: mạch màng não, mạch góc mắt và dây
                    # VI thuộc vùng mặt – sọ, không phải tam giác cổ.
                    "meningeal", "angular", "abducens", "ophthalmic", "maxillary",
                    "temporal", "auricular", "occipital artery", "lingual", "labial"],
    ),

    "retroperitoneum": dict(
        curve_only_named=True,
        out="retroperitoneum.glb", side=None, min_verts=4,
        box=(-0.150, 0.150, -0.020, 0.120, 0.950, 1.330),
        bone_kw=["vertebra l", "vertebra t1", "sacrum", "rib", "ilium", "hip bone"],
        muscle_kw=["psoas", "quadratus lumborum", "iliacus", "diaphragm", "transversus abdominis"],
        organ_kw=["kidney", "ureter", "suprarenal", "renal pelvis", "calix", "calyx",
                  "pancreas", "duodenum"],
        organ_tubes=True,
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["renal", "suprarenal", "gonadal", "testicular", "ovarian",
                          "lumbar", "aorta", "vena cava", "coeliac", "celiac",
                          "mesenteric", "splanchnic", "sympathetic", "ureter"],
        # Phế quản phân thuỳ và mạch phổi là đường cong DÀI, tâm bbox của chúng
        # rơi vào ổ bụng dù bản thân chúng nằm hẳn trong lồng ngực — bản chạy đầu
        # có cả "bronchus of left lung" nằm giữa scene khoang sau phúc mạc.
        curve_drop=["cerebral", "coronary", "pulmonary", "facial", "carotid", "popliteal",
                    "of left lung", "of right lung", "bronch", "segmental", "lobar",
                    "cervical", "meningeal", "thyroid", "brachial", "axillary"],
    ),

    "elbow_joint": dict(
        out="elbow_joint.glb", side="r", min_verts=4,
        box=(-0.290, -0.130, -0.090, 0.090, 0.985, 1.175),
        bone_kw=["humerus", "radius", "ulna"],
        joint_kw=True,
        joint_drop=["shoulder", "hip", "knee", "ankle", "wrist", "carpal", "intervertebral",
                    "sterno", "acromio", "costo"],
        muscle_kw=["biceps brachii", "brachialis", "brachioradialis", "triceps", "anconeus",
                   "pronator teres", "supinator", "flexor carpi", "extensor carpi",
                   "flexor digitorum", "extensor digitorum", "palmaris"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["brachial", "radial", "ulnar", "interosseous", "median",
                          "collateral", "recurrent", "cephalic", "basilic"],
    ),

    "ankle_joint": dict(
        out="ankle_joint.glb", side="r", min_verts=4,
        box=(-0.140, -0.010, -0.090, 0.075, 0.000, 0.150),
        bone_kw=["tibia", "fibula", "talus", "calcaneus", "navicular", "cuboid",
                 "cuneiform", "metatarsal"],
        joint_kw=True, joint_drop=["knee", "hip", "shoulder", "elbow", "wrist", "intervertebral"],
        muscle_kw=["retinaculum", "tibialis", "fibularis", "peroneus", "flexor digitorum",
                   "flexor hallucis", "extensor digitorum", "extensor hallucis",
                   "gastrocnemius", "soleus", "plantaris", "calcaneal tendon"],
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["tibial", "fibular", "peroneal", "dorsalis pedis", "plantar",
                          "saphenous", "sural", "malleolar", "tarsal"],
    ),

    # ---------- Nhóm J: đợt vùng thứ năm (14 vùng chuyên đề) ----------
    # Mười bốn vùng bổ sung, chọn theo NGUYÊN TẮC KHÔNG CHỒNG LẤN: mỗi vùng ở
    # đây là một chủ đề mà các scene đã có không dạy được — đám rối cánh tay
    # (đã có đám rối thắt lưng cùng, chi trên thì chưa), chuỗi hạch giao cảm,
    # đường thị giác, tam giác cảnh, tuyến vú, thực quản, bàng quang – tiền
    # liệt, khớp cùng chậu, chóp xoay, gân gót – ống cổ chân, tĩnh mạch hiển,
    # hạch cổ, màng phổi, tuyến giáp.
    # Toạ độ hộp đều lấy từ bbox THẬT của chính các cấu trúc đó, dump bằng
    # `dump_objects.py` (X ÂM là bên PHẢI cơ thể, Y+ là phía SAU).

    # Đám rối: rễ C5–T1 x -0,122..0 · y 0,005..0,035 · z 1,378..1,505.
    # Hộp kéo xuống z 1,265 để lấy trọn hố nách và ba dây tận (giữa, trụ, quay),
    # ra trước tới y -0,078 cho cơ ức đòn chũm và xương đòn làm mốc.
    "brachial_plexus": dict(
        # curve_only_named: hộp này trùm cả nền cổ nên phép xét TÂM kéo vào cả
        # mạch mặt (mặt, hàm trên, môi, cằm) lẫn mạch phổi phân thuỳ — đã đo:
        # 60 "động mạch" trong lần xuất thử, quá nửa không liên quan đám rối.
        curve_only_named=True,
        out="brachial_plexus.glb", side="r", min_verts=4,
        box=(-0.190, -0.002, -0.078, 0.085, 1.265, 1.552),
        bone_kw=["clavicle", "first rib", "second rib", "third rib", "scapula",
                 "vertebra", "humerus", "sternum", "manubrium"],
        muscle_kw=["scalenus", "sternocleidomastoid", "subclavius", "pectoralis minor",
                   "omohyoid", "levator scapulae", "serratus anterior", "trapezius"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["brachial plexus", "median nerve", "ulnar nerve", "radial nerve",
                          "musculocutaneous", "axillary nerve", "long thoracic",
                          "thoracodorsal", "suprascapular", "subscapular nerve",
                          "pectoral nerve", "dorsal scapular", "phrenic nerve",
                          "subclavian", "axillary artery", "axillary vein",
                          "thoracoacromial", "transverse cervical", "cephalic vein"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral",
                    "renal", "hepatic", "gastric"],
    ),

    # Chuỗi hạch giao cảm z 1,133..1,505 (mesh hạch, hệ 7) và dây X z 1,105..1,576.
    # Lấy CẢ HAI BÊN: bài học chính là sự đối xứng của hai chuỗi hạch cạnh sống.
    "autonomic_nerves": dict(
        out="autonomic_nerves.glb", side=None, min_verts=4,
        curve_only_named=True,
        box=(-0.095, 0.095, -0.080, 0.115, 1.020, 1.560),
        bone_kw=["vertebra", "rib", "sternum", "manubrium"],
        sense_kw=["ganglia of sympathetic"],
        organ_kw=["oesophagus", "trachea", "heart"],
        organ_tubes=True,
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["sympathetic", "vagus", "phrenic nerve", "recurrent laryngeal",
                          "cardiac nerve", "cardiac plexus", "splanchnic",
                          "intercostal nerve", "thoracic aorta", "oesophagus", "trachea"],
        curve_drop=["cerebral", "coronary", "pulmonary artery", "mesenteric", "iliac",
                    "femoral", "renal", "brachial plexus"],
    ),

    # Đường thị giác: TK II và giao thoa z 1,593..1,616 · dải thị · thể gối ngoài
    # z 1,608..1,616 · rãnh cựa z 1,602..1,635 · cực chẩm. Hộp ôm trọn từ nhãn
    # cầu (y -0,090) ra tới cực chẩm (y +0,108).
    "visual_pathway": dict(
        out="visual_pathway.glb", side=None, min_verts=4,
        curve_only_named=True,
        box=(-0.062, 0.062, -0.090, 0.108, 1.555, 1.700),
        sense_kw=["optic", "geniculate body", "calcarine", "cuneus", "occipital pole",
                  "eyeball", "sclera", "cornea", "lens", "vitreous", "retina",
                  "choroid", "iris", "thalamus", "superior colliculus"],
        # "choroid" định lấy màng mạch của nhãn cầu, nhưng nó nuốt luôn ĐÁM RỐI
        # MẠCH MẠC của não thất — hai khối đỏ nằm chắn ngay giữa đường thị giác.
        sense_drop=["precuneus", "medial geniculate", "choroid plexus"],
        bone_kw=["sphenoid"],
        vessels=False, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["optic nerve", "oculomotor"],
        curve_drop=["artery", "vein", "sinus"],
    ),

    # Tam giác cảnh: chạc đôi động mạch cảnh chung nằm ngang bờ trên sụn giáp
    # (z ~1,46); hộp z 1,355..1,622 lấy từ gốc cổ tới nền sọ.
    "carotid_neck": dict(
        out="carotid_neck.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.080, -0.002, -0.075, 0.050, 1.355, 1.622),
        bone_kw=["hyoid", "mandible", "vertebra", "clavicle", "temporal bone", "cartilage"],
        muscle_kw=["sternocleidomastoid", "omohyoid", "sternohyoid", "sternothyroid",
                   "digastric", "stylohyoid", "thyrohyoid", "mylohyoid", "platysma",
                   "constrictor"],
        organ_kw=["thyroid gland", "larynx", "pharynx", "trachea", "submandibular gland"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["carotid", "jugular", "facial artery", "facial vein",
                          "lingual artery", "superior thyroid", "inferior thyroid",
                          "occipital artery", "ascending pharyngeal", "maxillary artery",
                          "superficial temporal", "vagus", "hypoglossal", "accessory nerve",
                          "ansa cervicalis", "sympathetic", "glossopharyngeal"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral"],
    ),

    # Vùng ngực trước và tuyến vú: mảng nhãn vùng vú (hệ 9) x 0..0,148 ·
    # y -0,131..-0,070 · z 1,179..1,325. Hộp phủ từ xương đòn xuống nếp dưới vú.
    "pectoral_breast": dict(
        out="pectoral_breast.glb", side="r", min_verts=4,
        box=(-0.200, -0.002, -0.140, 0.035, 1.140, 1.435),
        bone_kw=["rib", "sternum", "costal cartilage", "clavicle", "scapula", "humerus"],
        muscle_kw=["pectoralis", "subclavius", "serratus anterior", "latissimus",
                   "external abdominal oblique", "rectus abdominis", "intercostal"],
        region_kw=["mammary region", "inframammary region"],
        # Hạch: gọi theo TỪ KHOÁ chứ không bật `lymph=True`. Hộp ngực đủ rộng
        # để phép xét tâm kéo vào 29 nhóm hạch, quá nửa là hạch trung thất và
        # hạch cổ — bài học ở đây chỉ là đường dẫn lưu của tuyến vú.
        organ6_kw=["axillary nodes", "pectoral nodes", "interpectoral", "parasternal",
                   "subscapular nodes", "apical nodes", "supraclavicular"],
        # curve_only_named: không có nó thì phép xét tâm kéo vào 55 động mạch và
        # 33 tĩnh mạch, phần lớn là mạch cổ – mặt – phổi đi ngang qua hộp.
        curve_only_named=True,
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["thoracoacromial", "internal thoracic", "lateral thoracic",
                          "intercostal", "thoracodorsal", "long thoracic", "pectoral nerve",
                          "cephalic vein", "axillary artery", "axillary vein",
                          "musculophrenic", "superior epigastric"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral",
                    "renal", "hepatic"],
    ),

    # Thực quản: đường cong hệ 8, đi từ bờ dưới sụn nhẫn (z ~1,46) qua lỗ thực
    # quản của cơ hoành (z ~1,15) tới tâm vị. Hộp gồm cả cơ hoành và cột sống
    # ngực để thấy ba chỗ hẹp và đoạn bụng ngắn của thực quản.
    "oesophagus": dict(
        out="oesophagus.glb", side=None, min_verts=4,
        curve_only_named=True,
        box=(-0.095, 0.095, -0.075, 0.100, 1.030, 1.500),
        bone_kw=["vertebra", "sternum", "manubrium", "cartilage"],
        muscle_kw=["diaphragm", "crus", "constrictor", "cricopharyngeus"],
        organ_kw=["oesophagus", "stomach", "trachea", "pharynx", "larynx"],
        organ_tubes=True,
        # Chỉ những nhóm hạch NẰM DỌC thực quản, gọi đích danh. Bật `lymph=True`
        # cho hộp dài từ cổ xuống tâm vị này thì được 54 nhóm hạch của cả cổ,
        # trung thất và ổ bụng phủ kín thực quản.
        organ6_kw=["juxta-oesophageal", "tracheobronchial", "paratracheal",
                   "prevertebral nodes", "coeliac nodes", "left gastric nodes"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["oesophag", "azygos", "thoracic aorta", "left gastric",
                          "vagus", "recurrent laryngeal", "thoracic duct", "bronchial",
                          "inferior thyroid", "trachea"],
        curve_drop=["cerebral", "coronary", "pulmonary artery", "iliac", "femoral",
                    "mesenteric", "renal", "splenic"],
    ),

    # Bàng quang z 0,829..0,882 · tiền liệt z 0,809..0,832 · túi tinh z 0,828..0,859
    # · niệu đạo z 0,745..0,831. Hộp z 0,715..0,935 lấy trọn đường tiểu dưới.
    "bladder_prostate": dict(
        out="bladder_prostate.glb", side=None, min_verts=4,
        box=(-0.090, 0.090, -0.100, 0.090, 0.715, 0.935),
        bone_kw=["hip bone", "pubis", "ischium", "ilium", "sacrum", "coccyx"],
        joint_kw=True,
        # Khớp háng nằm sát hộp và có tới 18 dây chằng — chúng thuộc bài "khớp
        # háng" đã có scene riêng, ở đây chỉ tổ ôm kín bàng quang.
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "ankle", "tarsal", "knee",
                    "costo", "sterno", "acromio", "intervertebral", "acetabul",
                    "hip joint", "head of femur", "ischiofemoral", "pubofemoral",
                    "triradiate", "obturator membrane"],
        muscle_kw=["levator ani", "coccygeus", "sphincter", "obturator internus",
                   "bulbospongiosus", "ischiocavernosus", "perineal"],
        organ_kw=["bladder", "urethra", "prostate", "seminal", "ductus deferens",
                  "ureter", "rectum", "anal canal"],
        organ_tubes=True,
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["vesical", "prostatic", "pudendal", "obturator", "internal iliac",
                          "rectal", "ureter", "deferential"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric artery", "femoral",
                    "renal artery", "hepatic", "gluteal", "testicular", "penis", "penile",
                    "sciatic", "saphenous", "piriformis", "quadratus femoris",
                    "external iliac", "sacral", "perforating"],
    ),

    # Khớp cùng chậu và hệ dây chằng chậu: dây chằng cùng-ụ ngồi z 0,809..0,900,
    # cùng-gai z 0,850..0,911, xương cùng z 0,866..0,981. Lấy CẢ HAI BÊN vì bài
    # học là vòng chậu khép kín truyền lực từ cột sống xuống hai chi dưới.
    "pelvic_ligaments": dict(
        out="pelvic_ligaments.glb", side=None, min_verts=4,
        box=(-0.150, 0.150, -0.020, 0.125, 0.770, 1.040),
        bone_kw=["sacrum", "coccyx", "hip bone", "ilium", "ischium", "pubis",
                 "vertebra l", "lumbar vertebra", "femur"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "ankle", "tarsal", "knee",
                    "costo", "sterno", "acromio", "temporomandibular"],
        vessels=False, nerves=False, skin=False,
    ),

    # Chóp xoay: trên gai z 1,378..1,411 · dưới gai z 1,286..1,399 · tròn bé
    # z 1,295..1,385 · dưới vai z 1,264..1,396. Hộp ôm trọn bốn cơ và khớp ổ chảo.
    "rotator_cuff": dict(
        # Hộp vai nằm ngay cạnh hố nách: phép xét tâm kéo vào 61 mạch và 31 dây
        # thần kinh của cả đám rối cánh tay, che kín bốn cơ chóp xoay.
        curve_only_named=True,
        out="rotator_cuff.glb", side="r", min_verts=4,
        box=(-0.208, -0.010, -0.020, 0.130, 1.230, 1.432),
        bone_kw=["scapula", "humerus", "clavicle"],
        joint_kw=True,
        joint_drop=["elbow", "wrist", "carpal", "hip", "knee", "ankle", "tarsal",
                    "costo", "sterno", "intervertebral", "sacro", "pubic"],
        muscle_kw=["supraspinatus", "infraspinatus", "teres minor", "teres major",
                   "subscapularis", "deltoid", "biceps brachii", "coracobrachialis",
                   "triceps brachii", "bursa"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["suprascapular", "circumflex humeral", "subscapular",
                          "axillary nerve", "thoracoacromial"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral",
                    "renal", "hepatic", "gastric"],
    ),

    # Gân gót z 0,025..0,245 · cơ dép z 0,134..0,409 · mạc giữ gân gấp cổ chân
    # · xương gót z 0,011..0,063. Hộp z -0,005..0,300 lấy trọn phần sau cổ chân.
    "ankle_achilles": dict(
        out="ankle_achilles.glb", side="r", min_verts=4,
        box=(-0.140, -0.002, -0.045, 0.120, -0.005, 0.300),
        bone_kw=["calcaneus", "talus", "tibia", "fibula", "navicular", "cuboid",
                 "cuneiform", "metatarsal"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "hip", "knee", "costo",
                    "sterno", "intervertebral", "sacro", "pubic"],
        muscle_kw=["calcaneal tendon", "soleus", "gastrocnemius", "plantaris",
                   "flexor hallucis longus", "flexor digitorum longus", "tibialis posterior",
                   "retinaculum", "abductor hallucis", "plantar aponeurosis", "peroneus",
                   "fibularis", "bursa"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["posterior tibial", "anterior tibial", "fibular", "peroneal",
                          "plantar", "sural", "saphenous", "tibial nerve", "malleolar",
                          "calcaneal"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "renal", "hepatic",
                    "gastric", "uterine", "iliac"],
    ),

    # Tĩnh mạch hiển lớn z 0,058..0,855 (từ mắt cá trong tới lỗ tĩnh mạch hiển ở
    # nếp bẹn), hiển bé z 0,034..0,490. Chỉ giữ đường VỀ: kèm động mạch vào là
    # cây động mạch che kín hệ nông, mà đó không phải bài học của scene này.
    "saphenous_veins": dict(
        out="saphenous_veins.glb", side="r", min_verts=4,
        box=(-0.165, -0.002, -0.095, 0.125, -0.005, 0.905),
        bone_kw=["femur", "tibia", "fibula", "patella", "hip bone", "talus", "calcaneus",
                 "metatarsal", "tarsal"],
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        curve_keep_names=["saphenous", "femoral vein", "popliteal vein", "perforating vein",
                          "dorsal venous", "external iliac vein", "tibial vein",
                          "fibular vein", "plantar venous"],
        curve_drop=["artery", "arteries", "aorta", "nerve", "duct", "lymphatic", "trunk"],
    ),

    # Hạch cổ: chuỗi cảnh trong bám dọc tĩnh mạch cảnh trong, hạch dưới hàm,
    # dưới cằm, mang tai, thượng đòn. Mốc cơ ức đòn chũm và cơ vai móng chính là
    # ranh giới các NHÓM HẠCH theo phân vùng ngoại khoa (level I–VI).
    "cervical_nodes": dict(
        out="cervical_nodes.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.085, -0.002, -0.085, 0.065, 1.350, 1.625),
        bone_kw=["mandible", "hyoid", "clavicle", "vertebra", "temporal bone"],
        muscle_kw=["sternocleidomastoid", "omohyoid", "digastric", "trapezius", "scalenus",
                   "mylohyoid", "platysma", "stylohyoid"],
        organ_kw=["submandibular gland", "parotid", "thyroid gland", "larynx", "pharynx"],
        lymph=True,
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        curve_keep_names=["jugular", "carotid", "facial vein", "thoracic duct",
                          "transverse cervical", "subclavian vein"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral"],
    ),

    # Màng phổi (một mesh liên tục, x -0,132..0,131 · y -0,104..0,085 ·
    # z 1,168..1,432) cùng lồng ngực và cơ hoành: bài học là hai lá màng phổi và
    # ngách sườn – hoành, chỗ thấp nhất của khoang, nơi dịch đọng và là điểm chọc dò.
    "pleura": dict(
        out="pleura.glb", side=None, min_verts=4,
        box=(-0.150, 0.150, -0.120, 0.105, 1.010, 1.460),
        bone_kw=["rib", "sternum", "costal cartilage", "vertebra", "clavicle", "manubrium"],
        muscle_kw=["diaphragm", "intercostal", "crus"],
        organ_kw=["pleura", "lung", "lobe of lung", "trachea", "bronch", "pericard"],
        vessels=False, nerves=False, skin=False,
    ),

    # Tuyến giáp z 1,381..1,510 (hai thuỳ ôm hai bên khí quản, eo tuyến bắc ngang
    # vòng sụn 2–4) và 4 tuyến cận giáp — mỗi tuyến cận giáp chỉ có 9 ĐỈNH nên
    # min_verts phải hạ xuống, để mặc định 10 là mất sạch cả bốn.
    "thyroid_parathyroid": dict(
        out="thyroid_parathyroid.glb", side=None, min_verts=4,
        curve_only_named=True,
        box=(-0.075, 0.075, -0.065, 0.040, 1.340, 1.535),
        bone_kw=["hyoid", "cartilage", "clavicle", "sternum", "manubrium", "vertebra"],
        muscle_kw=["sternothyroid", "sternohyoid", "omohyoid", "cricothyroid",
                   "constrictor", "sternocleidomastoid", "thyrohyoid"],
        organ_kw=["thyroid gland", "parathyroid", "trachea", "larynx", "oesophagus",
                  "pharynx"],
        organ_tubes=True,
        lymph=True,
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["thyroid", "carotid", "jugular", "recurrent laryngeal", "vagus",
                          "laryngeal", "thyrocervical", "subclavian"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "iliac", "femoral"],
    ),

    # ---------- Nhóm K: đợt vùng thứ sáu (10 vùng chuyên đề) ----------
    # Vẫn theo nguyên tắc KHÔNG CHỒNG LẤN: mỗi vùng ở đây là một bài mà 103
    # scene trước không dạy được. Ba loại còn hổng rõ nhất sau đợt J:
    #   – đường đi của MỘT dây thần kinh sọ lớn (V) và bộ lệ,
    #   – các khoang phẫu tích kinh điển chưa có (hố dưới thái dương, tam giác
    #     đùi, vùng gáy, khớp ức đòn, ống sống),
    #   – CÂY MẠCH của từng chi, xem riêng động mạch và tĩnh mạch (atlas mới chỉ
    #     có cây động mạch chủ toàn thân và hệ tĩnh mạch nông chi dưới).

    # Rễ cảm giác/vận động dây V x ±0,023 · z 1,543..1,610; các ngành V1 V2 V3
    # toả ra tới x ±0,076 · y -0,088. Hộp ôm trọn từ hạch tới nhánh tận ở mặt.
    "trigeminal_nerve": dict(
        out="trigeminal_nerve.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.082, -0.002, -0.092, 0.062, 1.515, 1.685),
        bone_kw=["sphenoid", "temporal bone", "maxilla", "mandible", "zygomatic",
                 "frontal bone", "palatine", "nasal bone"],
        bone_drop=["cells of"],
        sense_kw=["trigeminal", "geniculate ganglion"],
        vessels=False, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["trigeminal", "ophthalmic nerve", "maxillary nerve",
                          "mandibular nerve", "frontal nerve", "supra-orbital",
                          "supraorbital", "supratrochlear", "nasociliary", "infratrochlear",
                          "lacrimal nerve", "infra-orbital", "infraorbital", "zygomatic nerve",
                          "alveolar", "palatine nerve", "nasopalatine", "buccal nerve",
                          "lingual nerve", "auriculotemporal", "mental nerve",
                          "masseteric", "deep temporal", "mylohyoid"],
        curve_drop=["facial nerve", "vagus", "glossopharyngeal", "hypoglossal", "accessory",
                    "optic", "oculomotor", "trochlear", "abducens", "vestibulocochlear"],
    ),

    # Bộ lệ: tuyến lệ ở góc trên ngoài ổ mắt, tiểu quản – túi lệ – ống lệ mũi
    # chạy xuống ngách mũi dưới. Toàn bộ khối x ±0,051 · y -0,076..-0,034 ·
    # z 1,555..1,612 — hộp chỉ nhỉnh hơn chút để lấy thêm xương ổ mắt làm mốc.
    "lacrimal_apparatus": dict(
        out="lacrimal_apparatus.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.058, -0.002, -0.090, -0.012, 1.540, 1.628),
        bone_kw=["lacrimal bone", "maxilla", "frontal bone", "nasal bone", "ethmoid",
                 "concha", "zygomatic", "sphenoid", "palatine"],
        bone_drop=["cells of"],
        muscle_kw=["orbicularis oculi", "levator palpebrae", "rectus", "oblique"],
        sense_kw=["lacrimal", "nasolacrimal", "eyeball", "sclera", "cornea", "conjunctiva",
                  "eyelid", "tarsus"],
        organ_kw=["nasal cavity", "nasal meatus"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["lacrimal", "ophthalmic artery", "angular", "infra-orbital",
                          "infraorbital", "supraorbital", "supra-orbital"],
        curve_drop=["cerebral", "carotid", "maxillary artery", "facial artery"],
    ),

    # Hố dưới thái dương: khoang giữa ngành hàm dưới và thành bên hầu, chứa hai
    # cơ chân bướm, động mạch hàm trên và thần kinh hàm dưới. Cơ chân bướm
    # x ±0,043 · y -0,042..-0,008 · z 1,526..1,584; hộp mở rộng ra ngoài tới
    # ngành hàm dưới (x -0,085) và lên tới hố thái dương.
    "infratemporal_fossa": dict(
        out="infratemporal_fossa.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.088, -0.002, -0.062, 0.024, 1.495, 1.615),
        bone_kw=["mandible", "maxilla", "sphenoid", "temporal bone", "zygomatic", "palatine"],
        bone_drop=["cells of"],
        muscle_kw=["pterygoid", "temporalis", "masseter", "buccinator", "tensor",
                   "levator veli", "styloglossus", "stylopharyngeus"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "hip", "knee", "ankle",
                    "tarsal", "costo", "sterno", "intervertebral", "sacro", "pubic"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["maxillary artery", "middle meningeal", "inferior alveolar",
                          "posterior superior alveolar", "sphenopalatine", "deep temporal",
                          "masseteric", "buccal", "descending palatine", "pterygoid",
                          "mandibular nerve", "lingual nerve", "auriculotemporal",
                          "chorda tympani", "mylohyoid", "retromandibular", "pterygoid plexus"],
        curve_drop=["cerebral", "vertebral", "coronary", "pulmonary", "femoral", "iliac"],
    ),

    # Ống sống: bao màng cứng tuỷ (một mesh 18k đỉnh, z 1,055..1,545), đuôi ngựa
    # z 0,873..1,142, cùng đốt sống – đĩa đệm – dây chằng vàng. Hộp lấy từ đoạn
    # ngực thấp xuống hết xương cùng để thấy đúng tầng chọc dò tuỷ sống.
    "spinal_canal": dict(
        # Hộp cũ (z 0,84..1,56) chạy từ chậu hông lên tận nền sọ nên kéo vào cả
        # dây chằng thái dương hàm, dây chằng trâm móng, khớp háng và bảy dây
        # thần kinh sọ — 171 mesh cho một bài về ống sống. Nay thu về ĐÚNG đoạn
        # ngực thấp – thắt lưng – cùng: chóp tuỷ nằm ngang T12–L1 (z ~1,14),
        # đuôi ngựa z 0,873..1,142, tức là đúng tầm chọc dò tuỷ sống.
        curve_only_named=True,
        out="spinal_canal.glb", side=None, min_verts=4,
        box=(-0.058, 0.058, -0.012, 0.108, 0.855, 1.235),
        bone_kw=["vertebra", "sacrum", "coccyx"],
        joint_kw=["ligamenta flava", "longitudinal ligament", "interspinous", "supraspinous",
                  "intervertebral disc", "nucleus pulposus", "intertransverse"],
        sense_kw=["spinal dura", "spinal cord", "denticulate", "conus"],
        # Bao màng cứng tuỷ và tuỷ sống là MỘT mesh dài chạy suốt từ cổ xuống
        # thắt lưng, tâm bbox của nó nằm tận đoạn ngực nên phép xét tâm (áp dụng
        # cho nhóm "organ") loại thẳng nó ra — mất đúng nội dung chính của scene.
        # keep_kw buộc dùng phép GIAO NHAU với hộp, phần thừa đã bị bước cắt lo.
        keep_kw=["spinal dura", "spinal cord", "denticulate", "conus"],
        vessels=False, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["cauda equina", "root of spinal", "radicular"],
        curve_drop=["brachial plexus", "sympathetic", "facial", "vagus", "accessory",
                    "hypoglossal", "glossopharyngeal", "chorda", "pectoral", "thoracic",
                    "scapular", "piriformis", "quadratus femoris", "intercostal",
                    "cerebral", "coronary", "pulmonary", "iliac", "femoral", "sciatic",
                    "obturator", "pudendal", "gluteal"],
    ),

    # Tam giác đùi: đáy là dây chằng bẹn (z 0,840..0,953), hai cạnh là cơ may và
    # cơ khép dài; trong tam giác có bó mạch – thần kinh đùi. Hộp kéo xuống
    # z 0,560 để lấy trọn ống cơ khép nơi động mạch đùi chui ra hố khoeo.
    "femoral_triangle": dict(
        out="femoral_triangle.glb", side="r", min_verts=4,
        box=(-0.138, -0.002, -0.078, 0.062, 0.555, 0.985),
        bone_kw=["hip bone", "femur", "pubis", "ilium", "ischium", "sacrum"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "knee", "ankle", "tarsal",
                    "costo", "sterno", "acromio", "intervertebral", "temporomandibular"],
        muscle_kw=["sartorius", "adductor", "pectineus", "iliopsoas", "psoas", "iliacus",
                   "gracilis", "rectus femoris", "vastus", "tensor fasciae", "obturator externus",
                   "quadratus femoris", "inguinal", "fascia lata", "cribriform"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["femoral", "circumflex femoral", "external iliac", "obturator",
                          "saphenous", "genitofemoral", "epigastric", "external pudendal",
                          "perforating", "descending genicular"],
        curve_drop=["cerebral", "coronary", "pulmonary", "mesenteric", "renal", "hepatic",
                    "gastric", "internal iliac", "gluteal", "sciatic", "pudendal",
                    "penis", "penile", "anorectal", "appendicular", "testicular",
                    "iliolumbar", "sacral", "piriformis", "quadratus femoris"],
    ),

    # Vùng gáy: cơ bán gai đầu – cổ (z 1,150..1,503), cơ gối đầu – cổ
    # (z 1,285..1,573), cơ thang, cùng động mạch đốt sống z 1,420..1,579 chui
    # trong lỗ mỏm ngang. Hộp lấy nửa phải từ mỏm chũm xuống bờ trên bả vai.
    "posterior_neck": dict(
        out="posterior_neck.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.095, -0.002, -0.005, 0.118, 1.320, 1.595),
        bone_kw=["vertebra", "atlas", "axis", "occipital bone", "temporal bone", "scapula",
                 "first rib", "second rib", "clavicle"],
        muscle_kw=["semispinalis", "splenius", "trapezius", "levator scapulae", "longissimus",
                   "rhomboid", "multifidus", "interspinales", "intertransversarii",
                   "rectus capitis", "obliquus capitis", "sternocleidomastoid", "scalenus",
                   "iliocostalis", "spinalis", "serratus posterior"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "hip", "knee", "ankle", "tarsal",
                    "sacro", "pubic", "temporomandibular"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["vertebral", "occipital artery", "deep cervical", "transverse cervical",
                          "cervical nerve", "accessory nerve", "occipital nerve",
                          "dorsal scapular", "suboccipital"],
        curve_drop=["cerebral", "coronary", "pulmonary", "facial", "maxillary", "lingual",
                    "thyroid", "brachial plexus", "median", "ulnar nerve", "radial nerve"],
    ),

    # Khớp ức đòn: diện khớp x -0,034..0,030 · y -0,056..-0,019 · z 1,381..1,416.
    # Dây chằng ức đòn, sườn đòn và gian đòn chỉ có 4–8 ĐỈNH nên min_verts phải
    # hạ xuống, để mặc định 10 là mất sạch chính nội dung của scene.
    "sternoclavicular": dict(
        out="sternoclavicular.glb", side=None, min_verts=4,
        curve_only_named=True,
        box=(-0.080, 0.080, -0.072, 0.022, 1.345, 1.445),
        bone_kw=["clavicle", "sternum", "manubrium", "first rib", "second rib", "vertebra"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "hip", "knee", "ankle", "tarsal",
                    "sacro", "pubic", "temporomandibular", "acromio"],
        muscle_kw=["sternocleidomastoid", "subclavius", "sternohyoid", "sternothyroid",
                   "pectoralis major", "scalenus"],
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        curve_keep_names=["subclavian", "brachiocephalic", "internal thoracic", "jugular",
                          "common carotid", "vena cava"],
        curve_drop=["cerebral", "coronary", "pulmonary", "facial", "maxillary"],
    ),

    # Cây động mạch chi trên: dưới đòn (z ~1,45) → nách → cánh tay (z 1,090..1,366)
    # → quay/trụ → hai cung gan tay (z ~0,74). Hộp trùm cả chi phải, xương giữ
    # lại làm mốc — bảng lớp của viewer cho phép làm mờ xương khi cần nhìn mạch.
    "upper_limb_arteries": dict(
        curve_only_named=True,
        out="upper_limb_arteries.glb", side="r", min_verts=4,
        box=(-0.365, -0.002, -0.125, 0.105, 0.655, 1.475),
        bone_kw=["clavicle", "scapula", "humerus", "radius", "ulna", "carpal", "scaphoid",
                 "lunate", "triquetrum", "pisiform", "trapezium", "trapezoid", "capitate",
                 "hamate", "metacarpal", "phalanx"],
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        curve_keep_names=["subclavian artery", "axillary artery", "brachial artery",
                          "radial artery", "ulnar artery", "interosseous artery",
                          "palmar arch", "digital arteries", "circumflex humeral",
                          "subscapular artery", "thoraco-acromial", "princeps pollicis",
                          "radialis indicis", "recurrent artery", "metacarpal arteries",
                          "collateral artery", "thyrocervical", "costocervical"],
        curve_drop=["vein", "veins", "nerve", "nerves", "lymph", "duct", "plexus",
                    "vertebral", "carotid", "thoracic artery", "intercostal"],
    ),

    # Cây tĩnh mạch chi trên: hệ NÔNG (đầu, nền, giữa khuỷu) và hệ SÂU đi kèm
    # động mạch. Cùng hộp với cây động mạch để hai scene khớp khung hình nhau,
    # nhưng chỉ giữ đường VỀ — có cả động mạch thì cây tĩnh mạch bị che kín.
    "upper_limb_veins": dict(
        curve_only_named=True,
        out="upper_limb_veins.glb", side="r", min_verts=4,
        box=(-0.365, -0.002, -0.125, 0.105, 0.655, 1.475),
        bone_kw=["clavicle", "scapula", "humerus", "radius", "ulna", "carpal", "scaphoid",
                 "lunate", "triquetrum", "pisiform", "trapezium", "trapezoid", "capitate",
                 "hamate", "metacarpal", "phalanx"],
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        curve_keep_names=["cephalic", "basilic", "median cubital", "median vein",
                          "median antebrachial", "brachial vein", "axillary vein",
                          "subclavian vein", "radial vein", "ulnar vein", "interosseous vein",
                          "dorsal venous network", "metacarpal veins", "digital veins",
                          "palmar venous", "brachiocephalic vein"],
        curve_drop=["artery", "arteries", "nerve", "nerves", "lymph", "duct", "trunk"],
    ),

    # Cây động mạch chi dưới: chậu ngoài (z 0,891..0,987) → đùi → khoeo
    # (z 0,374..0,566) → chày trước/sau và mác → cung gan chân. Đối xứng với
    # scene tĩnh mạch hiển đã có, nhưng chỉ giữ đường ĐI.
    "lower_limb_arteries": dict(
        curve_only_named=True,
        out="lower_limb_arteries.glb", side="r", min_verts=4,
        box=(-0.172, -0.002, -0.102, 0.132, -0.005, 1.005),
        bone_kw=["femur", "tibia", "fibula", "patella", "hip bone", "talus", "calcaneus",
                 "navicular", "cuboid", "cuneiform", "metatarsal", "phalanx", "sacrum"],
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        curve_keep_names=["iliac artery", "femoral artery", "deep artery of thigh",
                          "circumflex femoral", "popliteal artery", "genicular",
                          "tibial artery", "fibular artery", "peroneal artery",
                          "dorsalis pedis", "plantar artery", "plantar arch", "arcuate artery",
                          "metatarsal arteries", "digital arteries", "obturator artery",
                          "gluteal artery", "perforating arteries", "descending genicular",
                          "tarsal artery", "malleolar"],
        curve_drop=["vein", "veins", "nerve", "nerves", "lymph", "duct", "pudendal",
                    "rectal", "vesical", "uterine", "sacral"],
    ),

    # ---------- Nhóm L: đợt vùng thứ bảy (6 vùng chuyên đề) ----------
    # KHÔNG dựng cơ quan sinh dục (yêu cầu của chủ đồ án). Sáu vùng còn lại
    # chọn theo chỗ hổng: hố khuỷu, mạch mạc treo, góc cầu tiểu não, dải chậu
    # chày, đường đi thần kinh toạ và cân ngực – thắt lưng.

    # Hố khuỷu: gân nhị đầu ở giữa, động mạch cánh tay và thần kinh giữa vào
    # trong, thần kinh quay ra ngoài. Gân nhị đầu z 1,050..1,408, cơ sấp tròn
    # z 0,974..1,125 — hộp z 0,955..1,185 lấy trọn nếp khuỷu và chỗ chia đôi mạch.
    "cubital_fossa": dict(
        out="cubital_fossa.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.302, -0.055, -0.065, 0.095, 0.955, 1.185),
        bone_kw=["humerus", "radius", "ulna"],
        joint_kw=True,
        joint_drop=["shoulder", "hip", "knee", "ankle", "tarsal", "carpal", "costo",
                    "sterno", "intervertebral", "sacro", "pubic", "acromio"],
        muscle_kw=["biceps brachii", "brachialis", "brachioradialis", "pronator",
                   "triceps brachii", "supinator", "flexor carpi", "extensor carpi",
                   "palmaris", "anconeus", "flexor digitorum", "extensor digitorum"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["brachial artery", "radial artery", "ulnar artery", "recurrent",
                          "interosseous", "median nerve", "radial nerve", "ulnar nerve",
                          "musculocutaneous", "cephalic", "basilic", "median cubital",
                          "median vein", "brachial vein", "collateral"],
        curve_drop=["cerebral", "coronary", "pulmonary", "femoral", "iliac", "renal"],
    ),

    # Mạch mạc treo: động mạch mạc treo tràng trên tách khỏi động mạch chủ ngang
    # L1 (z ~1,14) rồi toả hình quạt vào ruột non và đại tràng phải; tĩnh mạch
    # cùng tên đi kèm bên phải rồi hợp với tĩnh mạch lách thành tĩnh mạch cửa.
    "mesenteric_vessels": dict(
        out="mesenteric_vessels.glb", side=None, min_verts=4,
        curve_only_named=True,
        box=(-0.135, 0.135, -0.105, 0.085, 0.845, 1.190),
        bone_kw=["vertebra"],
        organ_kw=["jejunum", "ileum", "colon", "caecum", "appendix", "duodenum",
                  "pancreas", "peritoneum", "omentum"],
        organ_tubes=True,
        vessels=True, nerves=False, skin=False,
        curve_drop_default=False,
        curve_keep_names=["mesenteric", "ileocolic", "colic", "jejunal", "ileal",
                          "marginal artery", "sigmoid", "appendicular", "portal",
                          "splenic vein", "abdominal aorta", "gastro-omental",
                          "pancreaticoduodenal"],
        curve_drop=["cerebral", "coronary", "pulmonary", "femoral", "renal artery",
                    "testicular", "ovarian", "uterine", "vesical", "pudendal", "penis"],
    ),

    # Góc cầu tiểu não: khe giữa cầu não, tiểu não và xương đá, nơi dây VII và
    # dây VIII cùng đi vào ống tai trong. Ốc tai z 1,575..1,584, dây VIII
    # z 1,577..1,582, cuống tiểu não z 1,581..1,603.
    "cerebellopontine_angle": dict(
        out="cerebellopontine_angle.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.058, -0.002, -0.012, 0.058, 1.548, 1.618),
        bone_kw=["temporal bone", "occipital bone", "sphenoid"],
        bone_drop=["cells of"],
        sense_kw=["cochlea", "vestibul", "semicircular", "cerebellar peduncle", "pons",
                  "medulla", "cerebellum", "flocculus", "trigeminal", "olive"],
        sense_drop=["choroid plexus"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["facial nerve", "vestibulocochlear", "trigeminal",
                          "glossopharyngeal", "vagus", "abducens", "labyrinthine",
                          "cerebellar artery", "basilar", "vertebral artery"],
        curve_drop=["carotid", "maxillary", "facial artery", "occipital artery",
                    "meningeal", "coronary", "pulmonary"],
    ),

    # Dải chậu chày: tấm gân dẹt chạy suốt mặt ngoài đùi từ mào chậu tới lồi cầu
    # ngoài xương chày (x tới -0,161 · z -0,001..0,998). Lấy kèm cơ căng mạc đùi,
    # cơ mông lớn – nhỡ và túi hoạt dịch mấu chuyển z 0,816..0,858.
    "iliotibial_tract": dict(
        out="iliotibial_tract.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.175, -0.002, -0.065, 0.125, 0.320, 1.015),
        bone_kw=["femur", "hip bone", "tibia", "fibula", "patella", "ilium", "ischium"],
        joint_kw=True,
        joint_drop=["shoulder", "elbow", "wrist", "carpal", "ankle", "tarsal", "costo",
                    "sterno", "intervertebral", "temporomandibular"],
        muscle_kw=["iliotibial", "tensor fasciae", "gluteus", "vastus lateralis",
                   "biceps femoris", "fascia lata", "bursa", "sartorius", "rectus femoris",
                   "piriformis", "quadratus femoris"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["superior gluteal", "inferior gluteal", "circumflex femoral",
                          "lateral femoral cutaneous", "perforating", "descending genicular",
                          "superior lateral genicular"],
        curve_drop=["cerebral", "coronary", "pulmonary", "internal iliac", "pudendal",
                    "rectal", "vesical", "obturator", "testicular", "penis", "sciatic"],
    ),

    # Đường đi thần kinh toạ: từ khuyết ngồi lớn dưới cơ hình lê (z ~0,90) chạy
    # giữa ụ ngồi và mấu chuyển lớn, xuống mặt sau đùi rồi chia đôi ở đỉnh hố
    # khoeo (z ~0,54). Bbox thật của dây: x ±0,080 · y 0,016..0,072 · z 0,540..0,978.
    "sciatic_course": dict(
        out="sciatic_course.glb", side="r", min_verts=4,
        curve_only_named=True,
        box=(-0.135, -0.002, -0.005, 0.120, 0.325, 1.010),
        bone_kw=["hip bone", "femur", "ischium", "ilium", "sacrum", "tibia", "fibula"],
        muscle_kw=["gluteus", "piriformis", "obturator internus", "gemellus",
                   "quadratus femoris", "biceps femoris", "semitendinosus",
                   "semimembranosus", "adductor magnus", "gastrocnemius"],
        vessels=True, nerves=True, skin=False,
        curve_drop_default=False,
        curve_keep_names=["sciatic", "tibial nerve", "common fibular", "peroneal nerve",
                          "posterior femoral cutaneous", "superior gluteal nerve",
                          "inferior gluteal", "nerve to", "popliteal", "perforating"],
        curve_drop=["cerebral", "coronary", "pulmonary", "pudendal", "rectal", "vesical",
                    "obturator artery", "testicular", "penis", "uterine"],
    ),

    # Cân ngực – thắt lưng: ba lá cân bọc khối cơ dựng sống và cơ vuông thắt
    # lưng, nối cơ lưng rộng ở trên với cơ mông lớn ở dưới thành một dải truyền
    # lực chéo qua lưng. Lá cân z 0,927..1,163; lấy cả hai bên vì bài học là
    # đường truyền lực CHÉO từ vai bên này sang mông bên kia.
    "thoracolumbar_fascia": dict(
        out="thoracolumbar_fascia.glb", side=None, min_verts=4,
        box=(-0.150, 0.150, 0.015, 0.120, 0.860, 1.265),
        bone_kw=["vertebra", "rib", "sacrum", "hip bone", "ilium"],
        muscle_kw=["thoracolumbar", "erector", "iliocostalis", "longissimus", "spinalis",
                   "multifidus", "latissimus", "serratus posterior", "quadratus lumborum",
                   "gluteus maximus", "abdominal oblique", "transversus abdominis",
                   "interspinales", "intertransversarii", "trapezius", "rhomboid"],
        joint_kw=["ligamenta flava", "supraspinous", "interspinous", "iliolumbar",
                  "sacro-iliac", "intervertebral disc"],
        vessels=False, nerves=False, skin=False,
    ),

    # ---------- Nhóm M: mốc xương, nguyên uỷ và bám tận ----------
    # Hai model cho trang "Mốc xương, nguyên uỷ & bám tận". Nội dung chính là
    # MẢNG ĐIỂM BÁM của hệ 2 trong Z-Anatomy: mỗi cơ để lại trên xương một mảng
    # nguyên uỷ (đuôi ".o") và một mảng bám tận (đuôi ".e"), đắp đúng lên mặt
    # xương. Không lấy khối cơ (hệ 4) vì cơ che kín xương, mất hẳn thứ cần xem.

    "landmarks_upper": dict(
        out="landmarks_upper.glb", side="r", min_verts=3,
        box=(-0.370, -0.002, -0.130, 0.140, 0.640, 1.480),
        bone_kw=["clavicle", "scapula", "humerus", "radius", "ulna", "scaphoid",
                 "lunate", "triquetrum", "pisiform", "trapezium", "trapezoid",
                 "capitate", "hamate", "metacarpal", "phalanx"],
        insertion_kw=True,
        vessels=False, nerves=False, skin=False,
    ),

    "landmarks_lower": dict(
        out="landmarks_lower.glb", side="r", min_verts=3,
        box=(-0.175, -0.002, -0.105, 0.135, -0.005, 1.020),
        bone_kw=["hip bone", "ilium", "ischium", "pubis", "femur", "patella",
                 "tibia", "fibula", "talus", "calcaneus", "navicular", "cuboid",
                 "cuneiform", "metatarsal", "phalanx", "sacrum"],
        insertion_kw=True,
        vessels=False, nerves=False, skin=False,
    ),

    # ---------- Nhóm Z: 7 hệ TOÀN THÂN cho trang /viewer ----------
    # Bản export tháng 7/2026 dùng export_system.py chỉ lấy object MESH, mà mạch
    # máu và thần kinh ngoại biên trong Z-Anatomy là CURVE nên mất sạch:
    # cardiovascular.glb cũ chỉ có 22 cấu trúc (quả tim + 4 mảnh lạc ở đầu),
    # nervous.glb cũ chỉ có não/tuỷ, không một dây thần kinh chi nào. Ở đây dựng
    # lại bằng export_region.py vì nó có collect_tubes() đổi curve thành ống.
    #
    # Giữ nguyên MỘT FILE MỖI HỆ đúng tên cũ để bảng lớp của viewer không phải
    # sửa gì. curve_drop_default=False vì DROP_CURVE_KW vốn để chặn mạch vùng
    # khác lọt vào hộp nhỏ — với toàn thân nó cắt mất đúng thứ cần lấy.
    "fb_skeletal": dict(
        out="skeletal.glb", side=None, box=FULLBODY_BOX, min_verts=1,
        bone_kw=True, vessels=False, nerves=False, skin=False, clip=False,
    ),
    "fb_joints": dict(
        out="joints.glb", side=None, box=FULLBODY_BOX, min_verts=1,
        joint_kw=True, vessels=False, nerves=False, skin=False, clip=False,
    ),
    "fb_muscular": dict(
        out="muscular.glb", side=None, box=FULLBODY_BOX, min_verts=1,
        muscle_kw=True, vessels=False, nerves=False, skin=False, clip=False,
    ),
    # curve_res=4: ống mạch/thần kinh chỉ dày 1,3–1,4mm, để mặc định 12 phân
    # đoạn dọc là thừa và làm file mạch toàn thân nặng 9,4MB.
    # curve_drop: bỏ luôn mạch và thần kinh của dương vật cho khớp với việc đã
    # bỏ cơ quan sinh dục ngoài ở hệ Nội tạng.
    "fb_cardiovascular": dict(
        out="cardiovascular.glb", side=None, box=FULLBODY_BOX, min_verts=1,
        heart_kw=True, vessels=True, nerves=False, skin=False, clip=False,
        curve_drop_default=False, curve_res=4,
        curve_drop=["penis", "scrot", "testicular", "deferential", "cremasteric"],
    ),
    "fb_nervous": dict(
        out="nervous.glb", side=None, box=FULLBODY_BOX, min_verts=1,
        sense_kw=True, vessels=False, nerves=True, skin=False, clip=False,
        curve_drop_default=False, curve_res=4,
        curve_drop=["penis", "scrot"],
    ),
    "fb_visceral": dict(
        out="visceral.glb", side=None, box=FULLBODY_BOX, min_verts=1,
        organ_kw=True, organ_tubes=True,
        # Bỏ hẳn cơ quan sinh dục ngoài khỏi model toàn thân (quyết định của
        # chủ đồ án). Dữ liệu vẫn còn trong Startup.blend nếu sau này cần.
        organ_drop=["penis", "scrot", "testis", "epididym", "spermatic", "seminal",
                    "prostat", "cavernosum", "spongiosum", "glans", "bulbourethral",
                    "ductus deferens", "vas deferens"],
        vessels=False, nerves=False, skin=False, clip=False,
    ),
    "fb_lymphoid": dict(
        out="lymphoid.glb", side=None, box=FULLBODY_BOX, min_verts=1,
        organ6_kw=True, lymph=True,
        vessels=False, nerves=False, skin=False, clip=False,
        curve_drop_default=False,
    ),
}

# 7 hệ toàn thân — chạy: export_region.py -- public/models FULLBODY
FULLBODY = ["fb_skeletal", "fb_joints", "fb_muscular", "fb_cardiovascular",
            "fb_nervous", "fb_visceral", "fb_lymphoid"]
