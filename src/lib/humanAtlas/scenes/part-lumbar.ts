/**
 * Bài bộ phận "Cột sống thắt lưng — học theo lớp" học theo lớp — nhóm lấy từ lumbar-spine.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partLumbarScene: AtlasSceneDef = {
  "slug": "bo-phan-cot-song-that-lung",
  "title": {
    "vi": "Cột sống thắt lưng — học theo lớp",
    "en": "The Lumbar Spine — Layer by Layer",
    "zh": "腰椎——分层学习"
  },
  "latin": "Vertebrae lumbales",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là năm đốt thắt lưng và xương cùng. Đây là các đốt to nhất vì chịu sức nặng lớn nhất. Bật lớp Đĩa đệm để thấy đĩa L4–L5 và L5–S1, hai đĩa thoát vị nhiều nhất. Bật lớp Cơ để thấy cơ dựng sống và cơ thắt lưng hai bên cột sống.",
    "en": "It opens on the five lumbar vertebrae and the sacrum, the largest vertebrae because they carry the most weight. Turn on Discs for L4–L5 and L5–S1, the two most often herniated. Turn on Muscles for erector spinae and psoas beside the spine.",
    "zh": "打开时显示五块腰椎和骶骨，因承重最大而最粗大。开启“椎间盘”可见最常突出的L4–L5和L5–S1椎间盘；开启“肌”可见脊柱两侧的竖脊肌和腰大肌。"
  },
  "layers": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương",
        "en": "Bones",
        "zh": "骨"
      },
      "groups": [
        "l1-l3",
        "l4-l5",
        "xuong-cung"
      ],
      "on": true
    },
    {
      "key": "dia",
      "name": {
        "vi": "Đĩa đệm",
        "en": "Discs",
        "zh": "椎间盘"
      },
      "groups": [
        "dia-dem"
      ]
    },
    {
      "key": "co",
      "name": {
        "vi": "Cơ",
        "en": "Muscles",
        "zh": "肌"
      },
      "groups": [
        "co-canh-song"
      ]
    }
  ],
  "groups": [
    {
      "key": "l1-l3",
      "name": {
        "vi": "Đốt thắt lưng L1–L3",
        "en": "Lumbar vertebrae L1–L3",
        "zh": "腰椎 L1–L3"
      },
      "latin": "Vertebrae L1–L3",
      "note": {
        "vi": "Tuỷ sống thường tận ở ngang L1–L2 (nón tuỷ). Gãy lún L1 do loãng xương hay gặp ở chỗ chuyển tiếp ngực–thắt lưng.",
        "en": "The spinal cord usually ends at L1–L2 (the conus medullaris). Osteoporotic compression fractures favour L1 at the thoracolumbar junction.",
        "zh": "脊髓通常终止于L1–L2（脊髓圆锥）。骨质疏松性压缩骨折好发于胸腰交界处的L1。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ3157",
        "FJ3159",
        "FJ3162"
      ]
    },
    {
      "key": "l4-l5",
      "name": {
        "vi": "Đốt thắt lưng L4–L5",
        "en": "Lumbar vertebrae L4–L5",
        "zh": "腰椎 L4–L5"
      },
      "latin": "Vertebrae L4–L5",
      "note": {
        "vi": "Đường nối hai mào chậu cắt ngang mỏm gai L4 (đường Tuffier) — mốc chọc dò tuỷ sống ở khe L3–L4 hoặc L4–L5. Trượt đốt sống hay gặp ở L4–L5 và L5–S1.",
        "en": "The line joining the iliac crests crosses the L4 spinous process (Tuffier's line) — the landmark for lumbar puncture at L3–L4 or L4–L5. Spondylolisthesis is commonest at L4–L5 and L5–S1.",
        "zh": "两髂嵴最高点连线平L4棘突（Tuffier线）——在L3–L4或L4–L5间隙行腰椎穿刺的标志。椎体滑脱好发于L4–L5和L5–S1。"
      },
      "tint": "#5f9e6a",
      "parts": [
        "FJ3165",
        "FJ3168"
      ]
    },
    {
      "key": "dia-dem",
      "name": {
        "vi": "Đĩa gian đốt thắt lưng",
        "en": "Lumbar intervertebral discs",
        "zh": "腰椎间盘"
      },
      "latin": "Disci intervertebrales lumbales",
      "note": {
        "vi": "Thoát vị sau-bên ở tầng L4–L5 chèn rễ L5 (không phải L4, vì rễ L4 đã ra lỗ liên hợp phía trên): yếu gấp mu ngón cái, tê mu bàn chân. L5–S1 chèn S1: mất phản xạ gót. (Nhân nhầy không tách riêng trong dữ liệu.)",
        "en": "A posterolateral herniation at L4–L5 compresses the L5 root (not L4, which has already left through the foramen above): weak big-toe dorsiflexion, numb dorsum of the foot. At L5–S1 it hits S1: lost ankle jerk. (The nucleus pulposus is not separate in this data.)",
        "zh": "L4–L5后外侧突出压迫L5神经根（而非L4，因L4已从上方椎间孔穿出）：拇趾背伸无力、足背麻木。L5–S1突出压迫S1：跟腱反射消失。（数据中髓核未单独分出。）"
      },
      "tint": "#9fc6d6",
      "parts": [
        "FJ3211",
        "FJ3212",
        "FJ3214",
        "FJ3215",
        "FJ3216",
        "FJ3217"
      ]
    },
    {
      "key": "xuong-cung",
      "name": {
        "vi": "Xương cùng",
        "en": "Sacrum",
        "zh": "骶骨"
      },
      "latin": "Os sacrum",
      "note": {
        "vi": "Góc giữa L5 và xương cùng (góc thắt lưng–cùng) là điểm gấp khúc chịu lực cắt lớn — lý do L5–S1 hay thoái hoá và trượt.",
        "en": "The angle between L5 and the sacrum (the lumbosacral angle) is a bend that takes heavy shear forces — why L5–S1 so often degenerates and slips.",
        "zh": "L5与骶骨之间的夹角（腰骶角）是承受较大剪切力的转折点——这正是L5–S1易退变和滑脱的原因。"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ3393"
      ]
    },
    {
      "key": "co-canh-song",
      "name": {
        "vi": "Cơ thắt lưng lớn và cơ nhỏ cạnh sống",
        "en": "Psoas major and small paraspinal muscles",
        "zh": "腰大肌与椎旁小肌"
      },
      "latin": "M. psoas major · Mm. intertransversarii · interspinales",
      "note": {
        "vi": "Cơ thắt lưng lớn bám thân và mỏm ngang L1–L5; các cơ gian mỏm ngang, gian gai, xoay nối từng đốt, cảm nhận tư thế và giữ vững từng tầng. Teo nhóm cơ sâu này gặp ở người đau lưng mạn.",
        "en": "Psoas major attaches to the bodies and transverse processes of L1–L5; the intertransverse, interspinous and rotator muscles link each level, sensing posture and stabilising segment by segment. These deep muscles waste in chronic back pain.",
        "zh": "腰大肌附着于L1–L5椎体和横突；横突间肌、棘间肌、回旋肌连接各节段，感知姿势并逐节稳定脊柱。慢性腰痛患者此深层肌群萎缩。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1431",
        "FJ1431M",
        "FJ1522",
        "FJ1522M",
        "FJ1547",
        "FJ1547M",
        "FJ1548",
        "FJ1548M",
        "FJ1550",
        "FJ1550M"
      ]
    }
  ]
};
