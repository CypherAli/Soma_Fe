/**
 * Scene "Vùng mông" (bên trái) dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu thần kinh ngồi, động mạch mông và dây chằng vùng mông.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-gluteal.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const glutealScene: AtlasSceneDef = {
  "slug": "vung-mong",
  "title": {
    "vi": "Vùng mông",
    "en": "The Gluteal Region",
    "zh": "臀区"
  },
  "latin": "Regio glutealis",
  "intro": {
    "vi": "Ba lớp cơ: nông là cơ mông lớn; giữa là cơ mông nhỡ; sâu là cơ mông bé và nhóm xoay ngoài (hình lê, sinh đôi, bịt trong, vuông đùi). Cơ hình lê là chìa khoá: mạch và thần kinh mông trên chui ra trên nó, còn thần kinh ngồi, mạch mông dưới chui ra dưới nó. Tiêm bắp ở góc phần tư trên-ngoài để tránh thần kinh ngồi. Bộ dữ liệu không có thần kinh ngồi và động mạch mông; xương mờ sẵn.",
    "en": "Three layers: superficial gluteus maximus; middle gluteus medius; deep gluteus minimus and the lateral rotators (piriformis, gemelli, obturator internus, quadratus femoris). Piriformis is the key: the superior gluteal vessels and nerve emerge above it, the sciatic nerve and inferior gluteal vessels below. Intramuscular injections go in the upper outer quadrant to avoid the sciatic nerve. The dataset lacks the sciatic nerve and gluteal arteries; bones are faded.",
    "zh": "分三层：浅层为臀大肌；中层为臀中肌；深层为臀小肌及外旋肌群（梨状肌、上下孖肌、闭孔内肌、股方肌）。梨状肌是关键：臀上血管神经自其上缘穿出，坐骨神经和臀下血管自其下缘穿出。肌内注射选在外上象限以避开坐骨神经。数据集中无坐骨神经和臀部动脉；骨骼淡化。"
  },
  "frameGroups": [
    "mong-lon",
    "mong-nho",
    "mong-be",
    "hinh-le",
    "xoay-ngoai",
    "tm-mong"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "mong-lon",
      "name": {
        "vi": "Cơ mông lớn",
        "en": "Gluteus maximus",
        "zh": "臀大肌"
      },
      "latin": "M. gluteus maximus",
      "note": {
        "vi": "Lớp nông, do thần kinh mông dưới chi phối. Liệt cơ này: khó leo cầu thang, đứng dậy khỏi ghế — người bệnh ngả người ra sau khi bước (dáng đi mông lớn).",
        "en": "The superficial layer, supplied by the inferior gluteal nerve. Its paralysis makes climbing stairs and rising from a chair hard — the patient lurches backward with each step (gluteus maximus gait).",
        "zh": "浅层，受臀下神经支配。其麻痹导致上楼梯、从椅子上站起困难——患者每步向后倾斜（臀大肌步态）。"
      },
      "tint": "#8f2f3a",
      "parts": [
        "FJ1418M"
      ]
    },
    {
      "key": "mong-nho",
      "name": {
        "vi": "Cơ mông nhỡ",
        "en": "Gluteus medius",
        "zh": "臀中肌"
      },
      "latin": "M. gluteus medius",
      "note": {
        "vi": "Lớp giữa, dạng hông và giữ khung chậu thăng bằng khi đứng một chân (thần kinh mông trên). Tiêm sai vị trí làm tổn thương thần kinh mông trên gây dáng đi Trendelenburg.",
        "en": "The middle layer, abducting the hip and keeping the pelvis level on one leg (superior gluteal nerve). A misplaced injection injuring that nerve causes a Trendelenburg gait.",
        "zh": "中层，外展髋关节并在单腿站立时维持骨盆水平（臀上神经）。注射部位不当损伤臀上神经导致Trendelenburg步态。"
      },
      "tint": "#b8434f",
      "parts": [
        "FJ1419M"
      ]
    },
    {
      "key": "mong-be",
      "name": {
        "vi": "Cơ mông bé",
        "en": "Gluteus minimus",
        "zh": "臀小肌"
      },
      "latin": "M. gluteus minimus",
      "note": {
        "vi": "Lớp sâu nhất của nhóm mông, cùng tác dụng với mông nhỡ và thêm xoay trong đùi.",
        "en": "The deepest gluteal, sharing the actions of gluteus medius and adding medial rotation of the thigh.",
        "zh": "臀肌最深层，作用与臀中肌相同，并可内旋大腿。"
      },
      "tint": "#d0685a",
      "parts": [
        "FJ1420M"
      ]
    },
    {
      "key": "hinh-le",
      "name": {
        "vi": "Cơ hình lê",
        "en": "Piriformis",
        "zh": "梨状肌"
      },
      "latin": "M. piriformis",
      "note": {
        "vi": "Chìa khoá của vùng mông. Ở khoảng 10–15% người, một phần thần kinh ngồi xuyên QUA cơ này — gốc của hội chứng cơ hình lê (đau thần kinh toạ không do đĩa đệm).",
        "en": "The key to the region. In about 10–15% of people part of the sciatic nerve passes THROUGH this muscle — the basis of piriformis syndrome (sciatica not caused by a disc).",
        "zh": "臀区的关键。约10–15%的人坐骨神经部分穿过此肌——梨状肌综合征（非椎间盘源性坐骨神经痛）的解剖基础。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ1428M"
      ]
    },
    {
      "key": "xoay-ngoai",
      "name": {
        "vi": "Sinh đôi, bịt trong, vuông đùi",
        "en": "Gemelli, obturator internus, quadratus femoris",
        "zh": "孖肌、闭孔内肌、股方肌"
      },
      "latin": "Mm. gemelli · obturator internus · quadratus femoris",
      "note": {
        "vi": "Nhóm xoay ngoài sâu nằm dưới cơ hình lê. Thần kinh ngồi chạy xuống TRÊN MẶT các cơ này — khi mổ thay khớp háng lối sau phải cắt chúng và dễ kéo căng thần kinh ngồi.",
        "en": "The deep lateral rotators below piriformis. The sciatic nerve runs down ON their surface — in a posterior approach hip replacement they are cut and the sciatic nerve is at risk of stretching.",
        "zh": "梨状肌下方的深层外旋肌群。坐骨神经沿其表面下行——髋关节后入路置换术中需切断这些肌肉，坐骨神经易受牵拉。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ1416M",
        "FJ1417M",
        "FJ1426M",
        "FJ1432M"
      ]
    },
    {
      "key": "tm-mong",
      "name": {
        "vi": "Tĩnh mạch mông trên và dưới",
        "en": "Superior and inferior gluteal veins",
        "zh": "臀上、下静脉"
      },
      "latin": "Vv. gluteae",
      "note": {
        "vi": "Đi kèm động mạch cùng tên (không có trong dữ liệu) qua khuyết ngồi lớn, trên và dưới cơ hình lê.",
        "en": "Accompany the arteries of the same name (absent from this data) through the greater sciatic notch, above and below piriformis.",
        "zh": "与同名动脉（数据中缺失）伴行，经坐骨大孔分别于梨状肌上、下方穿出。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3513",
        "FJ3531"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chậu, cùng, đùi (mốc)",
        "en": "Hip bone, sacrum, femur (landmarks)",
        "zh": "髋骨、骶骨、股骨（标志）"
      },
      "latin": "Os coxae · Os sacrum · Femur",
      "note": {
        "vi": "Mờ sẵn. Khuyết ngồi lớn và mấu chuyển lớn là hai mốc để định vị các cơ sâu.",
        "en": "Faded. The greater sciatic notch and greater trochanter are the two landmarks for placing the deep muscles.",
        "zh": "已淡化。坐骨大切迹和大转子是定位深层肌的两个标志。"
      },
      "parts": [
        "FJ3259",
        "FJ3288",
        "FJ3393"
      ]
    }
  ]
};
