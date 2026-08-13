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
    "hand": dict(
        out="hand_detail.glb", side="r",
        box=(-0.345, -0.185, -0.095, 0.095, 0.730, 0.930),
        bone_kw=True, joint_kw=True, muscle_kw=True,
        vessels=True, nerves=True, skin=True, skin_bones=True,
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
