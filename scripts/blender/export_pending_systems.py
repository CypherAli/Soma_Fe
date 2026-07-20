"""Xuất 4 scene còn thiếu: thính giác, sinh sản nam, mạc, mô liên kết.

    blender --background Startup.blend --python export_pending_systems.py -- <thư_mục_ra>

Mọi tên mesh/curve dưới đây đã được xác nhận tồn tại thật bằng
`query_structures.py` trước khi viết vào file — không tên nào là phỏng đoán.

GHI CHÚ DỮ LIỆU THIẾU (đã tìm kỹ, không phải bỏ sót):
  - Ống bán khuyên (semicircular canals), cơ bàn đạp (stapedius), cơ căng
    màng nhĩ (tensor tympani), ống tai ngoài: KHÔNG tồn tại trong Z-Anatomy.
    Tiền đình (Vestibule) có, nhưng không tách riêng 3 ống bán khuyên.
  - Cơ quan sinh dục nữ: KHÔNG có trong Z-Anatomy lẫn BodyParts3D — cả hai
    bộ dữ liệu đều dựng trên cơ thể nam.
  - Mô mỡ (adipose): 0 mesh trong Z-Anatomy.
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from soma_export import export_batch  # noqa: E402


def out_dir() -> str:
    argv = sys.argv[sys.argv.index("--") + 1 :]
    if not argv:
        raise SystemExit("THIẾU tham số: thư mục đầu ra")
    return argv[0]


# --- Hệ thính giác -----------------------------------------------------------
# Chỉ lấy bên TRÁI cho gọn và dễ nhìn, cùng quy ước đã dùng ở scene Mắt.
# Chuỗi dẫn truyền âm: màng nhĩ → búa → đe → bàn đạp → tiền đình/ốc tai.
AUDITORY = {
    "mesh": [
        "Tympanic membrane.l",
        "Malleus.l",
        "Incus.l",
        "Stapes.l",
        "Cochlea.l",
        "Vestibule.l",
        "Auditory tube.l",
    ],
    "curve": [
        "Vestibulocochlear nerve (VIII).l",
        "Vestibular nerve.l",
        "Chorda tympani.l",
    ],
}

# --- Hệ sinh sản nam ---------------------------------------------------------
# Bàng quang giữ lại làm mốc giải phẫu: tuyến tiền liệt nằm ngay dưới nó.
REPRODUCTIVE_MALE = {
    "mesh": [
        "Testis.l",
        "Testis.r",
        "Epididymis.l",
        "Epididymis.r",
        "Seminal gland.l",
        "Seminal gland.r",
        "Prostate",
        "Corpus cavernosum of penis",
        "Corpus spongiosum of penis",
        "Glans penis",
        "Urinary bladder",
    ],
    "curve": ["Ductus deferens.l", "Ductus deferens.r"],
}

# --- Hệ mạc ------------------------------------------------------------------
# CỐ Ý KHÔNG lấy "Tensor fasciae latae" — đó là CƠ căng mạc đùi, không phải
# mạc, dù tên có chữ "fasciae".
FASCIA_NAMES = [
    "Antebrachial fascia",
    "Anterior layer of thoracolumbar fascia",
    "Brachial fascia",
    "Clavipectoral fascia",
    "Crural fascia",
    "Deltoid fascia",
    "Dorsal fascia of hand",
    "Fascia lata",
    "Iliopsoas fascia",
    "Investing abdominal fascia",
    "Masseteric fascia",
    "Middle layer of thoracolumbar fascia",
    "Pectoral fascia",
    "Piriformis fascia",
    "Popliteal fascia",
    "Posterior layer of thoracolumbar fascia",
    "Superficial investing cervical fascia",
    "Superficial layer of temporal fascia",
]

FASCIA = {
    "mesh": [f"{name}.{side}" for name in FASCIA_NAMES for side in ("l", "r")]
    # Hai mạc này nằm giữa thân, không có cặp trái/phải
    + ["Diaphragmatic fascia", "Transversalis fascia"],
}

# --- Mô liên kết đặc ---------------------------------------------------------
# Ba dạng cấu trúc liên kết đặc: cân (tấm), mạc giữ gân (dải), túi hoạt dịch
# (bao chứa dịch). Dây chằng KHÔNG gộp vào đây vì đã thuộc scene khớp.
APONEUROSES = ["Epicranial aponeurosis", "Palmar aponeurosis", "Plantar aponeurosis"]

RETINACULA = [
    "Extensor retinaculum of wrist",
    "Flexor retinaculum of wrist",
    "Flexor retinaculum of ankle",
    "Inferior extensor retinaculum of ankle",
    "Superior extensor retinaculum of ankle",
    "Inferior fibular retinaculum",
    "Superior fibular retinaculum",
    "Medial patellar retinaculum",
]

BURSAE = [
    "Anserine bursa",
    "Bicipitoradial bursa",
    "Coracobrachial bursa",
    "Deep infrapatellar bursa",
    "Bursa of piriformis muscle",
    "Intermuscular gluteal bursae",
    "Lateral subtendinous bursa of gastrocnemius muscle",
    "Medial subtendinous bursa of gastrocnemius muscle",
    "Sciatic bursa of gluteus maximus muscle",
    "Sciatic bursa of obturator internus",
    "Inferior subtendinous bursa of biceps femoris muscle",
]

CONNECTIVE = {
    "mesh": [
        f"{name}.{side}"
        for name in APONEUROSES + RETINACULA + BURSAE
        for side in ("l", "r")
    ],
}


SCENES = {
    "auditory_system.glb": AUDITORY,
    "male_reproductive.glb": REPRODUCTIVE_MALE,
    "fascia_system.glb": FASCIA,
    "connective_tissue.glb": CONNECTIVE,
}

export_batch(SCENES, out_dir())
