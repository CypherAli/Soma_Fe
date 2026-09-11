/**
 * Scene "Mô liên kết đặc" dựng từ bộ atlas BodyParts3D.
 * 
 * Gom mọi gân, dây chằng, màng, mạc giữ gân atlas có. Atlas thiếu phần lớn dây chằng khớp và túi hoạt dịch.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-f.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const denseConnectiveScene: AtlasSceneDef = {
  "slug": "mo-lien-ket",
  "title": {
    "vi": "Mô liên kết đặc: gân, dây chằng, màng, mạc giữ gân",
    "en": "Dense Connective Tissue: Tendons, Ligaments, Membranes, Retinacula",
    "zh": "致密结缔组织：肌腱、韧带、膜与支持带"
  },
  "latin": "Textus connectivus densus",
  "intro": {
    "vi": "Mô liên kết đặc chủ yếu là sợi collagen xếp chặt, chịu lực kéo rất lớn nhưng ít mạch máu, nên lành chậm. Theo chức năng có năm loại. Gân nối cơ vào xương. Dây chằng nối xương với xương. Màng gian cốt căng giữa hai xương. Mạc giữ gân giữ gân áp sát khớp. Đường đan và cân là nơi cơ bám vào nhau. Scene gom mọi cấu trúc loại này mà bộ dữ liệu có, rải khắp cơ thể, mỗi loại một màu. Xương làm mờ sẵn để biết vị trí. Bộ dữ liệu không có phần lớn dây chằng khớp lớn và túi hoạt dịch.",
    "en": "Dense connective tissue is mostly tightly packed collagen fibres, very strong in tension but poorly vascularised, so it heals slowly. By function there are five kinds. Tendons join muscle to bone. Ligaments join bone to bone. Interosseous membranes stretch between two bones. Retinacula hold tendons against joints. Raphes and aponeuroses are where muscles attach to each other. The scene gathers every such structure in the dataset, scattered across the body, with one colour per kind. Bones are faded for orientation. The dataset lacks most major joint ligaments and the bursae.",
    "zh": "致密结缔组织主要由紧密排列的胶原纤维构成，抗拉力极强但血供少，愈合慢。按功能分五类：肌腱连接肌与骨；韧带连接骨与骨；骨间膜张于两骨之间；支持带使肌腱紧贴关节；缝与腱膜为肌与肌相互附着处。本场景汇集数据集中所有此类结构，散布全身，每类一种颜色，骨骼淡化以便定位。数据集中缺少大部分大关节韧带和滑囊。"
  },
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "gan",
      "name": {
        "vi": "Gân",
        "en": "Tendons",
        "zh": "肌腱"
      },
      "latin": "Tendines",
      "note": {
        "vi": "Gân gót là gân to nhất, chịu lực gấp khoảng 8–12 lần trọng lượng cơ thể khi chạy. Gân trung gian cơ hai bụng và gân cơ nâng mi là ví dụ gân nhỏ.",
        "en": "The calcaneal tendon is the largest, bearing about 8–12 times body weight in running. The intermediate tendon of digastric and the levator palpebrae tendon are small examples.",
        "zh": "跟腱最粗，跑步时承受约8–12倍体重。二腹肌中间腱和上睑提肌腱为小肌腱的例子。"
      },
      "tint": "#f0ede4",
      "parts": [
        "FJ1343",
        "FJ1405",
        "FJ1405M",
        "FJ1581"
      ]
    },
    {
      "key": "day-chang",
      "name": {
        "vi": "Dây chằng",
        "en": "Ligaments",
        "zh": "韧带"
      },
      "latin": "Ligamenta",
      "note": {
        "vi": "Dây chằng gan chân dài giữ vòm bàn chân; dây chằng trâm–móng treo xương móng; dây chằng thanh âm là lõi dây thanh; dây chằng hãm của cơ vận nhãn giới hạn tầm liếc. Dây chằng giãn quá 6–8% chiều dài thì bắt đầu rách.",
        "en": "The long plantar ligament holds the arch; the stylohyoid ligament slings the hyoid; the vocal ligament cores the vocal cord; the check ligaments limit eye movement. Ligaments begin to tear when stretched beyond 6–8% of their length.",
        "zh": "足底长韧带维持足弓；茎突舌骨韧带悬吊舌骨；声韧带为声带核心；眼肌节制韧带限制眼球运动范围。韧带拉长超过6–8%即开始撕裂。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1284",
        "FJ1292",
        "FJ1334",
        "FJ1335",
        "FJ1424",
        "FJ1424M",
        "FJ2763",
        "FJ2764",
        "FJ2771",
        "FJ2777",
        "FJ2779",
        "FJ2786",
        "FJ2787",
        "FJ2789",
        "FJ2790",
        "FJ2794",
        "FJ2797",
        "FJ2804",
        "FJ2805",
        "FJ2807"
      ]
    },
    {
      "key": "mang",
      "name": {
        "vi": "Màng gian cốt",
        "en": "Interosseous membranes",
        "zh": "骨间膜"
      },
      "latin": "Membranae interosseae",
      "note": {
        "vi": "Căng giữa quay–trụ và chày–mác, chuyển lực giữa hai xương và làm vách ngăn các khoang cơ.",
        "en": "Stretched between radius and ulna and between tibia and fibula, they transfer load between the bones and wall off the muscle compartments.",
        "zh": "张于桡尺骨之间和胫腓骨之间，在两骨间传递负荷并分隔肌群。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1392",
        "FJ1392M",
        "FJ1476",
        "FJ1476M"
      ]
    },
    {
      "key": "mac-giu",
      "name": {
        "vi": "Mạc giữ gân và ròng rọc",
        "en": "Retinacula and pulleys",
        "zh": "支持带与滑车"
      },
      "latin": "Retinacula · Trochlea",
      "note": {
        "vi": "Mạc giữ gân gấp cổ tay là mái ống cổ tay. Ròng rọc cơ chéo trên là vòng sụn–xơ đổi hướng gân như ròng rọc thật.",
        "en": "The flexor retinaculum of the wrist roofs the carpal tunnel. The trochlea of superior oblique is a fibrocartilage loop that turns the tendon like a real pulley.",
        "zh": "腕屈肌支持带构成腕管顶。上斜肌滑车是纤维软骨环，如真正的滑轮般改变肌腱方向。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1329",
        "FJ1380",
        "FJ1471",
        "FJ1471M"
      ]
    },
    {
      "key": "dan-can",
      "name": {
        "vi": "Đường đan, cân, dải chậu–chày, cung gân",
        "en": "Raphes, aponeuroses, iliotibial tract, tendinous arch",
        "zh": "缝、腱膜、髂胫束、腱弓"
      },
      "latin": "Raphae · Aponeuroses · Tractus iliotibialis · Arcus tendineus",
      "note": {
        "vi": "Đường trắng là nơi cân cơ thành bụng hai bên gặp nhau. Đường đan hầu nối các cơ khít hầu. Cung gân cơ nâng hậu môn là chỗ bám của hoành chậu. Dải chậu–chày là phần dày của mạc đùi.",
        "en": "The linea alba is where the abdominal aponeuroses of both sides meet. The pharyngeal raphe joins the constrictors. The tendinous arch of levator ani anchors the pelvic diaphragm. The iliotibial tract is a thickening of the fascia lata.",
        "zh": "白线为两侧腹肌腱膜交会处；咽缝连接咽缩肌；肛提肌腱弓为盆膈附着处；髂胫束为阔筋膜增厚部分。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1448",
        "FJ1465",
        "FJ1465M",
        "FJ2553",
        "FJ2744",
        "FJ2749",
        "FJ2756",
        "FJ1423",
        "FJ1423M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Các xương làm mốc",
        "en": "Landmark bones",
        "zh": "标志骨"
      },
      "latin": "Skeleton",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ2772",
        "FJ3256",
        "FJ3260",
        "FJ3277",
        "FJ3282",
        "FJ3286",
        "FJ3288",
        "FJ3289",
        "FJ3393"
      ]
    }
  ]
};
