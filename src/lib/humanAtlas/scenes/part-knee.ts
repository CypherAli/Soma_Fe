/**
 * Bài bộ phận "Gối" học theo lớp, dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chằng chéo/bên, sụn chêm, bao khớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partKneeScene: AtlasSceneDef = {
  "slug": "bo-phan-goi",
  "title": {
    "vi": "Gối — học theo lớp",
    "en": "The Knee — Layer by Layer",
    "zh": "膝——分层学习"
  },
  "latin": "Genu",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra chỉ có lớp xương: đầu dưới xương đùi, xương bánh chè, đầu trên xương chày và xương mác. Bật lớp Cơ để thấy cơ nào bắt qua gối và kéo theo hướng nào. Bật lớp Mạch máu để thấy động mạch khoeo và năm động mạch gối. Bấm vào từng cấu trúc để đọc ghi chú, hoặc dùng nút Cô lập để xem riêng. Bộ dữ liệu không có dây chằng chéo, dây chằng bên và sụn chêm.",
    "en": "It opens on the bones alone: the lower femur, patella, upper tibia and fibula. Turn on Muscles to see which muscles cross the knee and which way they pull. Turn on Vessels to see the popliteal artery and the five genicular arteries. Tap any structure to read its note, or Isolate it. The dataset has no cruciate or collateral ligaments and no menisci.",
    "zh": "打开时仅显示骨层：股骨下端、髌骨、胫骨上端和腓骨。开启“肌”层可见跨膝的肌肉及其牵拉方向；开启“血管”层可见腘动脉和五条膝动脉。点击任一结构阅读注释，或使用“孤立”单独查看。数据集中无交叉韧带、侧副韧带和半月板。"
  },
  "frameGroups": [
    "banh-che",
    "khoeo",
    "dm"
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
        "loi-cau",
        "banh-che",
        "mam-chay",
        "mac"
      ],
      "on": true
    },
    {
      "key": "co",
      "name": {
        "vi": "Cơ",
        "en": "Muscles",
        "zh": "肌"
      },
      "groups": [
        "tu-dau",
        "dui-sau",
        "chan-ngong",
        "bung-chan",
        "khoeo",
        "chau-chay"
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
      "key": "loi-cau",
      "name": {
        "vi": "Xương đùi (lồi cầu trong, ngoài)",
        "en": "Femur (medial and lateral condyles)",
        "zh": "股骨（内、外侧髁）"
      },
      "latin": "Femur",
      "note": {
        "vi": "Hai lồi cầu tròn lăn và trượt trên mâm chày. Lồi cầu trong dài hơn nên khi duỗi hết xương đùi xoay trong để khoá gối. Rãnh ròng rọc phía trước là nơi xương bánh chè trượt.",
        "en": "The two rounded condyles roll and glide on the tibial plateau. The medial condyle is longer, so at full extension the femur rotates medially to lock the knee. The trochlear groove in front is where the patella glides.",
        "zh": "两个圆形股骨髁在胫骨平台上滚动和滑动。内侧髁较长，完全伸直时股骨内旋锁定膝关节。前方滑车沟为髌骨滑动之处。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3259"
      ]
    },
    {
      "key": "banh-che",
      "name": {
        "vi": "Xương bánh chè",
        "en": "Patella",
        "zh": "髌骨"
      },
      "latin": "Patella",
      "note": {
        "vi": "Xương vừng lớn nhất cơ thể, nằm trong gân cơ tứ đầu. Nó tăng cánh tay đòn khi duỗi gối khoảng 30%. Mặt sau có sụn dày nhất cơ thể.",
        "en": "The largest sesamoid bone, lying in the quadriceps tendon. It lengthens the extensor lever arm by about 30%. Its back carries the thickest cartilage in the body.",
        "zh": "人体最大的籽骨，位于股四头肌腱内，使伸膝力臂增加约30%。其后面有全身最厚的软骨。"
      },
      "tint": "#f2c14e",
      "parts": [
        "FJ3275"
      ]
    },
    {
      "key": "mam-chay",
      "name": {
        "vi": "Xương chày (mâm chày, lồi củ chày)",
        "en": "Tibia (plateau and tuberosity)",
        "zh": "胫骨（平台与粗隆）"
      },
      "latin": "Tibia",
      "note": {
        "vi": "Mâm chày gần như phẳng, nên độ vững của gối dựa vào dây chằng và sụn chêm. Lồi củ chày phía trước là chỗ bám của gân bánh chè.",
        "en": "The plateau is almost flat, so knee stability rests on ligaments and menisci. The tibial tuberosity in front anchors the patellar tendon.",
        "zh": "胫骨平台几乎平坦，膝关节稳定性依赖韧带和半月板。前方胫骨粗隆为髌韧带附着处。"
      },
      "tint": "#d98c5f",
      "parts": [
        "FJ3282"
      ]
    },
    {
      "key": "mac",
      "name": {
        "vi": "Xương mác (chỏm mác)",
        "en": "Fibula (head)",
        "zh": "腓骨（腓骨头）"
      },
      "latin": "Fibula",
      "note": {
        "vi": "Không tham gia khớp gối nhưng chỏm mác là chỗ bám của nhị đầu đùi và dây chằng bên ngoài. Dây mác chung vòng quanh cổ xương mác.",
        "en": "Takes no part in the knee joint, but its head anchors biceps femoris and the lateral collateral ligament. The common fibular nerve winds round its neck.",
        "zh": "不参与膝关节，但腓骨头为股二头肌和外侧副韧带附着处。腓总神经绕腓骨颈走行。"
      },
      "tint": "#b8a88a",
      "parts": [
        "FJ3260"
      ]
    },
    {
      "key": "tu-dau",
      "name": {
        "vi": "Cơ tứ đầu đùi",
        "en": "Quadriceps femoris",
        "zh": "股四头肌"
      },
      "latin": "M. quadriceps femoris",
      "note": {
        "vi": "Bốn đầu: thẳng đùi, rộng ngoài, rộng giữa, rộng trong — hội vào gân bánh chè. Cơ duỗi gối duy nhất.",
        "en": "Four heads — rectus femoris and vastus lateralis, intermedius and medialis — joining in the patellar tendon. The only knee extensor.",
        "zh": "四个头——股直肌、股外侧肌、股中间肌、股内侧肌——汇成髌韧带。唯一的伸膝肌。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1433M",
        "FJ1441M",
        "FJ1442M",
        "FJ1443M"
      ]
    },
    {
      "key": "dui-sau",
      "name": {
        "vi": "Nhóm đùi sau",
        "en": "Hamstrings",
        "zh": "腘绳肌"
      },
      "latin": "Mm. ischiocrurales",
      "note": {
        "vi": "Bán gân, bán màng (trong) và nhị đầu đùi (ngoài) gấp gối, tạo hai bờ trên của hố khoeo.",
        "en": "Semitendinosus and semimembranosus (medial) and biceps femoris (lateral) flex the knee and form the upper borders of the popliteal fossa.",
        "zh": "半腱肌、半膜肌（内侧）和股二头肌（外侧）屈膝，构成腘窝上界。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1395M",
        "FJ1435M",
        "FJ1436M",
        "FJ1444M"
      ]
    },
    {
      "key": "chan-ngong",
      "name": {
        "vi": "Cơ may, cơ thon (chân ngỗng)",
        "en": "Sartorius and gracilis (pes anserinus)",
        "zh": "缝匠肌、股薄肌（鹅足）"
      },
      "latin": "Pes anserinus",
      "note": {
        "vi": "Cùng bán gân bám mặt trong đầu trên xương chày như bàn chân ngỗng.",
        "en": "With semitendinosus they insert on the upper medial tibia like a goose's foot.",
        "zh": "与半腱肌共同止于胫骨上端内侧，形如鹅足。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1421M",
        "FJ1434M"
      ]
    },
    {
      "key": "bung-chan",
      "name": {
        "vi": "Cơ bụng chân và cơ gan chân",
        "en": "Gastrocnemius and plantaris",
        "zh": "腓肠肌与跖肌"
      },
      "latin": "M. gastrocnemius · M. plantaris",
      "note": {
        "vi": "Hai đầu bám hai lồi cầu đùi nên vừa gấp gối vừa gấp gan bàn chân.",
        "en": "Its two heads arise from the femoral condyles, so it flexes both knee and ankle.",
        "zh": "两头起于股骨两髁，故既屈膝又跖屈足。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1394M",
        "FJ1397M",
        "FJ1429M"
      ]
    },
    {
      "key": "khoeo",
      "name": {
        "vi": "Cơ khoeo",
        "en": "Popliteus",
        "zh": "腘肌"
      },
      "latin": "M. popliteus",
      "note": {
        "vi": "Mở khoá gối khi bắt đầu gấp bằng cách xoay ngoài xương đùi.",
        "en": "Unlocks the knee at the start of flexion by rotating the femur laterally.",
        "zh": "屈膝开始时使股骨外旋以解锁膝关节。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1430M"
      ]
    },
    {
      "key": "chau-chay",
      "name": {
        "vi": "Dải chậu–chày",
        "en": "Iliotibial tract",
        "zh": "髂胫束"
      },
      "latin": "Tractus iliotibialis",
      "note": {
        "vi": "Dải cân mặt ngoài đùi, bám lồi củ Gerdy của xương chày, giữ vững mặt ngoài gối.",
        "en": "Fascial band of the outer thigh inserting on Gerdy's tubercle, steadying the outer knee.",
        "zh": "大腿外侧筋膜带，止于胫骨Gerdy结节，稳定膝外侧。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1423M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch khoeo và năm động mạch gối",
        "en": "Popliteal artery and the five genicular arteries",
        "zh": "腘动脉与五条膝动脉"
      },
      "latin": "A. poplitea · Aa. genus",
      "note": {
        "vi": "Động mạch khoeo nằm sâu nhất, sát xương đùi. Năm động mạch gối ôm quanh khớp thành vòng nối.",
        "en": "The popliteal artery lies deepest, on the femur. Five genicular arteries ring the joint as an anastomosis.",
        "zh": "腘动脉位置最深，紧贴股骨。五条膝动脉环绕关节形成吻合。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2069",
        "FJ2076",
        "FJ2077",
        "FJ2080",
        "FJ2083",
        "FJ2084",
        "FJ2086"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch khoeo, hiển bé, gối",
        "en": "Popliteal, small saphenous and genicular veins",
        "zh": "腘静脉、小隐静脉与膝静脉"
      },
      "latin": "V. poplitea · V. saphena parva",
      "note": {
        "vi": "Tĩnh mạch khoeo nằm nông hơn động mạch; tĩnh mạch hiển bé đổ vào nó.",
        "en": "The popliteal vein lies superficial to the artery; the small saphenous joins it.",
        "zh": "腘静脉位于动脉浅面，小隐静脉注入其中。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2107",
        "FJ2108",
        "FJ2117",
        "FJ2124",
        "FJ2125"
      ]
    }
  ]
};
