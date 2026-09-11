/**
 * Scene "Vùng đùi sau" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Thần kinh tọa" cũ: atlas không có thần kinh ngoại biên chi dưới.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const hamstringsScene: AtlasSceneDef = {
  "slug": "than-kinh-toa",
  "title": {
    "vi": "Vùng đùi sau: nhóm cơ ụ ngồi–cẳng chân",
    "en": "Posterior Thigh: the Hamstrings",
    "zh": "大腿后区：腘绳肌"
  },
  "latin": "Compartimentum femoris posterius",
  "system": "muscular",
  "intro": {
    "vi": "Khoang sau đùi chứa ba cơ đi từ ụ ngồi xuống cẳng chân: bán gân, bán màng và đầu dài nhị đầu đùi. Chúng bắt chéo cả hông lẫn gối, nên vừa duỗi hông vừa gấp gối. Đầu ngắn nhị đầu chỉ bắt chéo gối. Phần gân của cơ khép lớn cũng bám ụ ngồi và thường được xếp vào nhóm này. Căng rách cơ đùi sau là chấn thương hay gặp nhất khi chạy nước rút. Dây ngồi đi dọc giữa khoang nhưng bộ dữ liệu không có. Mỗi cơ một màu, xương và cơ mông mờ sẵn.",
    "en": "The posterior compartment holds three muscles running from the ischial tuberosity to the leg: semitendinosus, semimembranosus and the long head of biceps femoris. They cross both hip and knee, so they extend the hip and flex the knee. The short head of biceps crosses only the knee. The hamstring part of adductor magnus also arises from the tuberosity and is often counted with them. Hamstring strain is the commonest injury in sprinting. The sciatic nerve runs down the middle of the compartment but is not in the dataset. Each muscle has its own colour; bones and gluteals are faded.",
    "zh": "大腿后群有三块自坐骨结节至小腿的肌肉：半腱肌、半膜肌和股二头肌长头。它们跨髋和膝两关节，故伸髋并屈膝；股二头肌短头只跨膝。大收肌腘绳部也起于坐骨结节，常归入此组。腘绳肌拉伤是短跑中最常见的损伤。坐骨神经沿后群中线下行，但数据集中没有。每块肌肉一种颜色，骨骼和臀肌淡化。"
  },
  "frameGroups": [
    "ban-gan",
    "ban-mang",
    "nhi-dau",
    "khep-lon"
  ],
  "fadedGroups": [
    "xuong",
    "mong"
  ],
  "groups": [
    {
      "key": "ban-gan",
      "name": {
        "vi": "Cơ bán gân",
        "en": "Semitendinosus",
        "zh": "半腱肌"
      },
      "latin": "M. semitendinosus",
      "note": {
        "vi": "Nửa dưới là gân tròn dài, bám chân ngỗng. Gân này thường được lấy để tái tạo dây chằng chéo trước.",
        "en": "Its lower half is a long round tendon to the pes anserinus, often harvested for anterior cruciate ligament reconstruction.",
        "zh": "下半为细长圆腱，止于鹅足，常用于前交叉韧带重建。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1436M"
      ]
    },
    {
      "key": "ban-mang",
      "name": {
        "vi": "Cơ bán màng",
        "en": "Semimembranosus",
        "zh": "半膜肌"
      },
      "latin": "M. semimembranosus",
      "note": {
        "vi": "Có màng gân dẹt ở đầu trên, nằm dưới cơ bán gân. Bám mặt sau lồi cầu trong xương chày và toả sợi làm dây chằng khoeo chéo.",
        "en": "Has a flat membranous upper tendon and lies beneath semitendinosus. Inserts on the back of the medial tibial condyle and sends fibres as the oblique popliteal ligament.",
        "zh": "上端为扁平膜状腱，位于半腱肌深面。止于胫骨内侧髁后面，并延续为腘斜韧带。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1435M"
      ]
    },
    {
      "key": "nhi-dau",
      "name": {
        "vi": "Cơ nhị đầu đùi (đầu dài, đầu ngắn)",
        "en": "Biceps femoris (long and short heads)",
        "zh": "股二头肌（长头、短头）"
      },
      "latin": "M. biceps femoris (caput longum, caput breve)",
      "note": {
        "vi": "Đầu dài từ ụ ngồi, đầu ngắn từ đường ráp xương đùi; hội thành gân bám chỏm xương mác. Đầu dài là phần bị căng rách nhiều nhất.",
        "en": "The long head arises from the ischial tuberosity and the short head from the linea aspera; they join in a tendon on the fibular head. The long head is the part most often strained.",
        "zh": "长头起于坐骨结节，短头起于股骨粗线，合腱止于腓骨头。长头最常拉伤。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1395M",
        "FJ1444M"
      ]
    },
    {
      "key": "khep-lon",
      "name": {
        "vi": "Cơ khép lớn (phần gân – so sánh)",
        "en": "Adductor magnus (hamstring part — for comparison)",
        "zh": "大收肌（腘绳部——对照）"
      },
      "latin": "M. adductor magnus",
      "note": {
        "vi": "Phần ụ ngồi của nó do dây ngồi chi phối và duỗi hông giống nhóm đùi sau, nhưng không vượt qua gối.",
        "en": "Its ischial part is supplied by the sciatic nerve and extends the hip like the hamstrings, but it does not cross the knee.",
        "zh": "其坐骨部受坐骨神经支配，与腘绳肌同样伸髋，但不跨膝。"
      },
      "tint": "#6f8fbf",
      "parts": [
        "FJ1403M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Các động mạch xiên",
        "en": "Perforating arteries",
        "zh": "穿动脉"
      },
      "latin": "Aa. perforantes",
      "note": {
        "vi": "Tách từ động mạch đùi sâu, xuyên ra sau nuôi nhóm đùi sau. Khoang này không có động mạch lớn riêng.",
        "en": "From the deep femoral artery, piercing backwards to feed the hamstrings — the compartment has no large artery of its own.",
        "zh": "发自股深动脉，向后穿出供应腘绳肌——此群无自己的大动脉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2090",
        "FJ2094"
      ]
    },
    {
      "key": "mong",
      "name": {
        "vi": "Cơ mông lớn (mờ sẵn)",
        "en": "Gluteus maximus (faded)",
        "zh": "臀大肌（淡化）"
      },
      "latin": "M. gluteus maximus",
      "note": {
        "vi": "Phủ lên nguyên uỷ của nhóm đùi sau ở ụ ngồi.",
        "en": "Covers the hamstring origin at the ischial tuberosity.",
        "zh": "覆盖坐骨结节处腘绳肌起点。"
      },
      "tint": "#c9a79e",
      "parts": [
        "FJ1418M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chậu, đùi, chày, mác (mốc)",
        "en": "Hip bone, femur, tibia, fibula (landmarks)",
        "zh": "髋骨、股骨、胫骨、腓骨（标志）"
      },
      "latin": "Os coxae · Femur · Tibia · Fibula",
      "note": {
        "vi": "Mờ sẵn. Chú ý ụ ngồi — nguyên uỷ chung của cả nhóm.",
        "en": "Faded. Note the ischial tuberosity — the common origin of the group.",
        "zh": "淡化。注意坐骨结节——本组的共同起点。"
      },
      "parts": [
        "FJ3259",
        "FJ3260",
        "FJ3282",
        "FJ3288"
      ]
    }
  ]
};
