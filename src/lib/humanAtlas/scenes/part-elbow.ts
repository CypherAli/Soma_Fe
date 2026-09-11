/**
 * Bài bộ phận "Khuỷu" học theo lớp, dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu bao khớp, dây chằng bên, dây chằng vòng, dây thần kinh.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partElbowScene: AtlasSceneDef = {
  "slug": "bo-phan-khuyu",
  "title": {
    "vi": "Khuỷu — học theo lớp",
    "en": "The Elbow — Layer by Layer",
    "zh": "肘——分层学习"
  },
  "latin": "Cubitus",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là lớp xương: đầu dưới xương cánh tay, xương quay, xương trụ. Ròng rọc khớp với xương trụ như bản lề, chỏm con khớp với chỏm quay xoay tròn. Bật lớp Cơ gấp–duỗi, rồi lớp Cơ sấp–ngửa để phân biệt hai cặp động tác của khuỷu. Bật lớp Mạch máu để thấy động mạch cánh tay chia đôi ở hố khuỷu và vòng nối quanh khớp. Bộ dữ liệu không có dây chằng và dây thần kinh.",
    "en": "It opens on the bones: lower humerus, radius and ulna. The trochlea hinges with the ulna and the capitulum meets the spinning radial head. Turn on Flexors–extensors, then Pronators–supinators, to separate the elbow's two pairs of movements. Turn on Vessels to see the brachial artery dividing in the cubital fossa and the loop around the joint. The dataset has no ligaments or nerves.",
    "zh": "打开时显示骨层：肱骨下端、桡骨和尺骨。滑车与尺骨构成铰链，肱骨小头与旋转的桡骨头相关节。先后开启“屈伸肌”和“旋前旋后肌”，区分肘的两组动作；开启“血管”可见肱动脉在肘窝分叉及关节周围的吻合环。数据集中无韧带和神经。"
  },
  "frameGroups": [
    "co-khuyu",
    "ngua",
    "vong-noi"
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
        "canh-tay",
        "quay",
        "tru"
      ],
      "on": true
    },
    {
      "key": "gap-duoi",
      "name": {
        "vi": "Cơ gấp–duỗi",
        "en": "Flexors–extensors",
        "zh": "屈伸肌"
      },
      "groups": [
        "nhi-dau",
        "co-canh-tay",
        "canh-tay-quay",
        "tam-dau",
        "co-khuyu"
      ]
    },
    {
      "key": "sap-ngua",
      "name": {
        "vi": "Cơ sấp–ngửa",
        "en": "Pronators–supinators",
        "zh": "旋前旋后肌"
      },
      "groups": [
        "sap-tron",
        "ngua"
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
        "vong-noi",
        "tm"
      ]
    }
  ],
  "groups": [
    {
      "key": "canh-tay",
      "name": {
        "vi": "Xương cánh tay (ròng rọc, chỏm con, hai mỏm trên lồi cầu)",
        "en": "Humerus (trochlea, capitulum, epicondyles)",
        "zh": "肱骨（滑车、小头、内外上髁）"
      },
      "latin": "Humerus",
      "note": {
        "vi": "Mỏm trên lồi cầu ngoài là nguyên uỷ cơ duỗi (đau ở đây là khuỷu tay quần vợt), mỏm trong là nguyên uỷ cơ gấp.",
        "en": "The lateral epicondyle is the extensor origin (pain here is tennis elbow); the medial is the flexor origin.",
        "zh": "外上髁为伸肌起点（此处疼痛即网球肘），内上髁为屈肌起点。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3262"
      ]
    },
    {
      "key": "quay",
      "name": {
        "vi": "Xương quay",
        "en": "Radius",
        "zh": "桡骨"
      },
      "latin": "Radius",
      "note": {
        "vi": "Chỏm quay xoay trong dây chằng vòng khi sấp–ngửa.",
        "en": "The radial head spins in the annular ligament during pronation and supination.",
        "zh": "旋前旋后时桡骨头在环状韧带内旋转。"
      },
      "tint": "#d98c5f",
      "parts": [
        "FJ3277"
      ]
    },
    {
      "key": "tru",
      "name": {
        "vi": "Xương trụ (mỏm khuỷu, mỏm vẹt)",
        "en": "Ulna (olecranon, coronoid)",
        "zh": "尺骨（鹰嘴、冠突）"
      },
      "latin": "Ulna",
      "note": {
        "vi": "Mỏm khuỷu là điểm tì khi chống tay, nơi bám của cơ tam đầu.",
        "en": "The olecranon is the point of the elbow and the triceps insertion.",
        "zh": "鹰嘴为肘尖，肱三头肌止点。"
      },
      "tint": "#c9b98f",
      "parts": [
        "FJ3286"
      ]
    },
    {
      "key": "nhi-dau",
      "name": {
        "vi": "Cơ nhị đầu",
        "en": "Biceps",
        "zh": "肱二头肌"
      },
      "latin": "M. biceps brachii",
      "note": {
        "vi": "Gấp khuỷu và là cơ ngửa mạnh nhất.",
        "en": "Flexes the elbow and is the strongest supinator.",
        "zh": "屈肘，也是最强的旋后肌。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1478M",
        "FJ1512M"
      ]
    },
    {
      "key": "co-canh-tay",
      "name": {
        "vi": "Cơ cánh tay",
        "en": "Brachialis",
        "zh": "肱肌"
      },
      "latin": "M. brachialis",
      "note": {
        "vi": "Cơ gấp khuỷu thuần tuý, nằm dưới nhị đầu.",
        "en": "The pure elbow flexor, beneath biceps.",
        "zh": "单纯屈肘肌，位于肱二头肌深面。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1486M"
      ]
    },
    {
      "key": "canh-tay-quay",
      "name": {
        "vi": "Cơ cánh tay–quay",
        "en": "Brachioradialis",
        "zh": "肱桡肌"
      },
      "latin": "M. brachioradialis",
      "note": {
        "vi": "Gấp khuỷu mạnh nhất ở tư thế nửa sấp, như khi cầm cốc.",
        "en": "Strongest in mid-pronation, as when holding a cup.",
        "zh": "半旋前位（如握杯）时屈肘最强。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1487M"
      ]
    },
    {
      "key": "tam-dau",
      "name": {
        "vi": "Cơ tam đầu",
        "en": "Triceps",
        "zh": "肱三头肌"
      },
      "latin": "M. triceps brachii",
      "note": {
        "vi": "Cơ duỗi khuỷu duy nhất đáng kể; ba đầu hội vào mỏm khuỷu.",
        "en": "The main elbow extensor; its three heads meet on the olecranon.",
        "zh": "主要伸肘肌；三头汇于鹰嘴。"
      },
      "tint": "#6f8fbf",
      "parts": [
        "FJ1477M",
        "FJ1479M",
        "FJ1480M"
      ]
    },
    {
      "key": "co-khuyu",
      "name": {
        "vi": "Cơ khuỷu",
        "en": "Anconeus",
        "zh": "肘肌"
      },
      "latin": "M. anconeus",
      "note": {
        "vi": "Cơ nhỏ phụ duỗi và căng bao khớp phía sau.",
        "en": "A small helper in extension that tenses the back of the capsule.",
        "zh": "辅助伸肘并紧张关节囊后部的小肌。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ1485M"
      ]
    },
    {
      "key": "sap-tron",
      "name": {
        "vi": "Cơ sấp tròn, sấp vuông",
        "en": "Pronator teres and quadratus",
        "zh": "旋前圆肌、旋前方肌"
      },
      "latin": "Mm. pronator teres et quadratus",
      "note": {
        "vi": "Kéo xương quay bắt chéo trước xương trụ — úp bàn tay.",
        "en": "Swing the radius across the ulna, turning the palm down.",
        "zh": "使桡骨交叉于尺骨前方——使掌心向下。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1474M",
        "FJ1503M",
        "FJ1516M"
      ]
    },
    {
      "key": "ngua",
      "name": {
        "vi": "Cơ ngửa",
        "en": "Supinator",
        "zh": "旋后肌"
      },
      "latin": "M. supinator",
      "note": {
        "vi": "Quấn quanh cổ xương quay, cùng nhị đầu ngửa bàn tay. Nhánh sâu dây quay xuyên qua cơ này.",
        "en": "Wraps the radial neck and, with biceps, turns the palm up. The deep branch of the radial nerve pierces it.",
        "zh": "包绕桡骨颈，与肱二头肌共同使掌心向上。桡神经深支穿过此肌。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1505M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch cánh tay, quay, trụ",
        "en": "Brachial, radial and ulnar arteries",
        "zh": "肱动脉、桡动脉、尺动脉"
      },
      "latin": "A. brachialis → A. radialis, A. ulnaris",
      "note": {
        "vi": "Động mạch cánh tay chia đôi ở hố khuỷu, ngay trong gân nhị đầu.",
        "en": "The brachial divides in the cubital fossa, just medial to the biceps tendon.",
        "zh": "肱动脉在肘窝内、肱二头肌腱内侧分叉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2219",
        "FJ2223",
        "FJ2242",
        "FJ2258"
      ]
    },
    {
      "key": "vong-noi",
      "name": {
        "vi": "Vòng nối quanh khuỷu",
        "en": "Anastomosis around the elbow",
        "zh": "肘关节动脉网"
      },
      "latin": "Rete articulare cubiti",
      "note": {
        "vi": "Nhánh bên của động mạch cánh tay đi xuống nối với nhánh quặt ngược đi lên.",
        "en": "Collateral branches of the brachial descend to meet recurrent branches climbing up.",
        "zh": "肱动脉侧副支下行，与上行的返支吻合。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ2215",
        "FJ2241",
        "FJ2243",
        "FJ2259",
        "FJ2261",
        "FJ2331",
        "FJ2374"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch nông vùng khuỷu",
        "en": "Superficial veins at the elbow",
        "zh": "肘部浅静脉"
      },
      "latin": "Vv. superficiales cubiti",
      "note": {
        "vi": "Tĩnh mạch giữa khuỷu nối tĩnh mạch đầu với tĩnh mạch nền — chỗ lấy máu chuẩn.",
        "en": "The median cubital vein links cephalic and basilic — the standard site for drawing blood.",
        "zh": "肘正中静脉连接头静脉与贵要静脉——标准采血部位。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2218",
        "FJ2220",
        "FJ2234",
        "FJ2235"
      ]
    }
  ]
};
