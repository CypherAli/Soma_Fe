
import { bindContentSource } from "@/lib/content/source";
/**
 * Bài bộ phận "Hông" học theo lớp, dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu bao khớp, dây chằng chậu–đùi, dây ngồi.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partHipScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/part-hip.ts#partHipScene", {
  "slug": "bo-phan-hong",
  "title": {
    "vi": "Hông — học theo lớp",
    "en": "The Hip — Layer by Layer",
    "zh": "髋——分层学习"
  },
  "latin": "Regio coxae",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là lớp xương: xương chậu với ổ cối sâu ôm chỏm xương đùi, cùng xương cùng. Bật lớp Cơ sâu để thấy cơ thắt lưng–chậu (gấp) và nhóm xoay ngoài ngắn. Bật lớp Cơ nông để thấy ba cơ mông và nhóm khép. Bật lớp Mạch máu để thấy động mạch đùi, nhánh mũ đùi và tĩnh mạch mông. Bộ dữ liệu không có bao khớp và dây ngồi.",
    "en": "It opens on the bones: the hip bone with its deep acetabulum cupping the femoral head, and the sacrum. Turn on Deep muscles for iliopsoas (flexion) and the short lateral rotators. Turn on Superficial muscles for the three gluteals and the adductors. Turn on Vessels for the femoral artery, circumflex branches and gluteal veins. The dataset has no capsule or sciatic nerve.",
    "zh": "打开时显示骨层：髋骨（深的髋臼包绕股骨头）和骶骨。开启“深层肌”可见髂腰肌（屈髋）和短外旋肌群；开启“浅层肌”可见三块臀肌和内收肌群；开启“血管”可见股动脉、旋股支和臀静脉。数据集中无关节囊和坐骨神经。"
  },
  "frameGroups": [
    "chau",
    "mong"
  ],
  "layers": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương",
        "en": "Bones",
        "zh": "骨"
      },
      "groups": [
        "chau",
        "dui",
        "cung"
      ],
      "on": true
    },
    {
      "key": "co-sau",
      "name": {
        "vi": "Cơ sâu",
        "en": "Deep muscles",
        "zh": "深层肌"
      },
      "groups": [
        "that-lung-chau",
        "xoay-ngoai"
      ]
    },
    {
      "key": "co-nong",
      "name": {
        "vi": "Cơ nông",
        "en": "Superficial muscles",
        "zh": "浅层肌"
      },
      "groups": [
        "mong",
        "khep"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Mạch máu",
        "en": "Vessels",
        "zh": "血管"
      },
      "groups": [
        "dm",
        "tm"
      ]
    }
  ],
  "groups": [
    {
      "key": "chau",
      "name": {
        "vi": "Xương chậu (ổ cối)",
        "en": "Hip bone (acetabulum)",
        "zh": "髋骨（髋臼）"
      },
      "latin": "Os coxae",
      "note": {
        "vi": "Ba xương cánh chậu, ngồi, mu dính nhau ở ổ cối. Ổ cối sâu nên khớp hông vững hơn khớp vai nhiều.",
        "en": "Ilium, ischium and pubis fuse at the acetabulum. The deep socket makes the hip far more stable than the shoulder.",
        "zh": "髂骨、坐骨、耻骨在髋臼处融合。髋臼深，使髋关节远比肩关节稳定。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3288"
      ]
    },
    {
      "key": "dui",
      "name": {
        "vi": "Xương đùi (chỏm, cổ, hai mấu chuyển)",
        "en": "Femur (head, neck, trochanters)",
        "zh": "股骨（头、颈、大小转子）"
      },
      "latin": "Femur",
      "note": {
        "vi": "Cổ xương đùi hợp với thân góc khoảng 125°; gãy cổ ở người già dễ hoại tử chỏm.",
        "en": "The neck meets the shaft at about 125°; neck fractures in the elderly risk necrosis of the head.",
        "zh": "股骨颈与干约成125°；老年人股骨颈骨折易致股骨头坏死。"
      },
      "tint": "#d9c08a",
      "parts": [
        "FJ3259"
      ]
    },
    {
      "key": "cung",
      "name": {
        "vi": "Xương cùng",
        "en": "Sacrum",
        "zh": "骶骨"
      },
      "latin": "Os sacrum",
      "note": {
        "vi": "Khớp với xương chậu ở khớp cùng–chậu, truyền sức nặng thân mình xuống chi dưới.",
        "en": "Joins the hip bones at the sacroiliac joints, passing body weight to the legs.",
        "zh": "借骶髂关节与髋骨相连，将躯干重量传至下肢。"
      },
      "tint": "#c9b98f",
      "parts": [
        "FJ3393"
      ]
    },
    {
      "key": "that-lung-chau",
      "name": {
        "vi": "Cơ thắt lưng–chậu",
        "en": "Iliopsoas",
        "zh": "髂腰肌"
      },
      "latin": "M. iliopsoas",
      "note": {
        "vi": "Cơ gấp hông mạnh nhất, bám mấu chuyển bé.",
        "en": "The strongest hip flexor, inserting on the lesser trochanter.",
        "zh": "最强的屈髋肌，止于小转子。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1422M",
        "FJ1431M"
      ]
    },
    {
      "key": "xoay-ngoai",
      "name": {
        "vi": "Nhóm xoay ngoài ngắn",
        "en": "Short lateral rotators",
        "zh": "短外旋肌群"
      },
      "latin": "Mm. pelvitrochanterici",
      "note": {
        "vi": "Hình lê, sinh đôi, bịt trong–ngoài, vuông đùi — như chóp xoay của hông.",
        "en": "Piriformis, gemelli, obturators, quadratus femoris — the hip's rotator cuff.",
        "zh": "梨状肌、上下孖肌、闭孔内外肌、股方肌——髋的“肩袖”。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1416M",
        "FJ1417M",
        "FJ1425M",
        "FJ1426M",
        "FJ1428M",
        "FJ1432M"
      ]
    },
    {
      "key": "mong",
      "name": {
        "vi": "Ba cơ mông",
        "en": "The three gluteals",
        "zh": "三块臀肌"
      },
      "latin": "Mm. glutei",
      "note": {
        "vi": "Mông lớn duỗi hông; mông nhỡ, bé dạng hông và giữ khung chậu thăng bằng khi bước.",
        "en": "Maximus extends the hip; medius and minimus abduct and keep the pelvis level in walking.",
        "zh": "臀大肌伸髋；臀中、小肌外展髋并在行走时维持骨盆水平。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1418M",
        "FJ1419M",
        "FJ1420M"
      ]
    },
    {
      "key": "khep",
      "name": {
        "vi": "Nhóm cơ khép",
        "en": "Adductors",
        "zh": "内收肌群"
      },
      "latin": "Mm. adductores",
      "note": {
        "vi": "Khép dài, ngắn, lớn, lược, thon — hay căng rách ở người đá bóng.",
        "en": "Adductor longus, brevis and magnus, pectineus and gracilis — often strained in footballers.",
        "zh": "长收肌、短收肌、大收肌、耻骨肌、股薄肌——足球运动员常拉伤。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1401M",
        "FJ1402M",
        "FJ1403M",
        "FJ1404M",
        "FJ1421M",
        "FJ1427M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch đùi và mũ đùi",
        "en": "Femoral and circumflex femoral arteries",
        "zh": "股动脉与旋股动脉"
      },
      "latin": "A. femoralis · A. circumflexa femoris lateralis",
      "note": {
        "vi": "Các nhánh mũ đùi vòng quanh cổ xương đùi và nuôi chỏm.",
        "en": "The circumflex branches ring the femoral neck and feed the head.",
        "zh": "旋股支环绕股骨颈并供应股骨头。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2074",
        "FJ2078",
        "FJ3466"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch đùi, mông, mũ đùi",
        "en": "Femoral, gluteal and circumflex veins",
        "zh": "股静脉、臀静脉、旋股静脉"
      },
      "latin": "Vv. femoralis, gluteae",
      "note": {
        "vi": "Tĩnh mạch mông trên, dưới đi qua hai lỗ trên và dưới cơ hình lê.",
        "en": "The superior and inferior gluteal veins pass above and below piriformis.",
        "zh": "臀上、下静脉经梨状肌上、下孔。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2099",
        "FJ2102",
        "FJ2188",
        "FJ2189",
        "FJ3513",
        "FJ3531"
      ]
    }
  ]
});
