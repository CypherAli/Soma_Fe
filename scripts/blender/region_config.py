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

    # ---------- Nhóm C: đầu – mặt – cổ ----------
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
    ),
    "stomach": dict(
        out="stomach_duodenum.glb", side=None,
        box=(-0.075, 0.125, -0.105, 0.045, 1.060, 1.265),
        organ_kw=["stomach", "duoden", "pylor", "oesophagus", "esophagus", "omentum"],
        organ_tubes=True,
        vessels=True, nerves=True, skin=False,
        curve_keep_names=["gastric", "gastro", "splenic", "coeliac", "celiac", "hepatic",
                          "pancreaticoduodenal", "vagus"],
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
    "peritoneum": dict(
        out="peritoneum_full.glb", side=None,
        box=(-0.155, 0.155, -0.125, 0.105, 0.790, 1.290),
        organ_kw=["omentum", "mesent", "mesocolon", "peritone", "falciform",
                  "ligament of liver", "coronary ligament", "gastrosplenic", "gastrocolic"],
        vessels=True, nerves=False, skin=False,
        curve_keep_names=["mesenteric", "gastro", "splenic"],
    ),

    # ---------- Nhóm F: thần kinh ----------
    "cerebrum": dict(
        out="cerebrum_full.glb", side=None,
        box=(-0.095, 0.095, -0.095, 0.095, 1.545, 1.760),
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
        out="skeletal.glb", side=None, box=FULLBODY_BOX,
        bone_kw=True, vessels=False, nerves=False, skin=False, clip=False,
    ),
    "fb_joints": dict(
        out="joints.glb", side=None, box=FULLBODY_BOX,
        joint_kw=True, vessels=False, nerves=False, skin=False, clip=False,
    ),
    "fb_muscular": dict(
        out="muscular.glb", side=None, box=FULLBODY_BOX,
        muscle_kw=True, vessels=False, nerves=False, skin=False, clip=False,
    ),
    # curve_res=4: ống mạch/thần kinh chỉ dày 1,3–1,4mm, để mặc định 12 phân
    # đoạn dọc là thừa và làm file mạch toàn thân nặng 9,4MB.
    # curve_drop: bỏ luôn mạch và thần kinh của dương vật cho khớp với việc đã
    # bỏ cơ quan sinh dục ngoài ở hệ Nội tạng.
    "fb_cardiovascular": dict(
        out="cardiovascular.glb", side=None, box=FULLBODY_BOX,
        heart_kw=True, vessels=True, nerves=False, skin=False, clip=False,
        curve_drop_default=False, curve_res=4,
        curve_drop=["penis", "scrot", "testicular", "deferential", "cremasteric"],
    ),
    "fb_nervous": dict(
        out="nervous.glb", side=None, box=FULLBODY_BOX,
        sense_kw=True, vessels=False, nerves=True, skin=False, clip=False,
        curve_drop_default=False, curve_res=4,
        curve_drop=["penis", "scrot"],
    ),
    "fb_visceral": dict(
        out="visceral.glb", side=None, box=FULLBODY_BOX,
        organ_kw=True, organ_tubes=True,
        # Bỏ hẳn cơ quan sinh dục ngoài khỏi model toàn thân (quyết định của
        # chủ đồ án). Dữ liệu vẫn còn trong Startup.blend nếu sau này cần.
        organ_drop=["penis", "scrot", "testis", "epididym", "spermatic", "seminal",
                    "prostat", "cavernosum", "spongiosum", "glans", "bulbourethral",
                    "ductus deferens", "vas deferens"],
        vessels=False, nerves=False, skin=False, clip=False,
    ),
    "fb_lymphoid": dict(
        out="lymphoid.glb", side=None, box=FULLBODY_BOX,
        organ6_kw=True, lymph=True,
        vessels=False, nerves=False, skin=False, clip=False,
        curve_drop_default=False,
    ),
}

# 7 hệ toàn thân — chạy: export_region.py -- public/models FULLBODY
FULLBODY = ["fb_skeletal", "fb_joints", "fb_muscular", "fb_cardiovascular",
            "fb_nervous", "fb_visceral", "fb_lymphoid"]
