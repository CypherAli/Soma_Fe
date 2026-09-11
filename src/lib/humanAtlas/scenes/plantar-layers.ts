/**
 * Scene "Bốn lớp cơ gan chân" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Tủy sống và đám rối" cũ: atlas chỉ có ống trung tâm tủy, không có tủy sống và rễ thần kinh.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const plantarLayersScene: AtlasSceneDef = {
  "slug": "tuy-song-dam-roi",
  "title": {
    "vi": "Bốn lớp cơ gan chân",
    "en": "The Four Layers of the Sole",
    "zh": "足底四层肌"
  },
  "latin": "Musculi plantae pedis",
  "system": "muscular",
  "intro": {
    "vi": "Cơ gan chân xếp thành bốn lớp dưới cân gan chân. Lớp 1 gồm dạng ngón cái, gấp ngắn các ngón và dạng ngón út. Lớp 2 gồm cơ vuông gan chân, các cơ giun, cùng gân gấp dài các ngón và gấp dài ngón cái. Lớp 3 gồm gấp ngắn ngón cái, khép ngón cái và gấp ngắn ngón út. Lớp 4 gồm các cơ gian cốt, cùng gân chày sau và mác dài. Chúng giữ vòm bàn chân khi đứng và bước. Mạch gan chân đi giữa lớp 1 và lớp 2, còn cung gan chân nằm giữa lớp 3 và lớp 4. Mỗi lớp một màu, xương mờ sẵn.",
    "en": "The muscles of the sole lie in four layers beneath the plantar aponeurosis. Layer 1 is abductor hallucis, flexor digitorum brevis and abductor digiti minimi. Layer 2 is quadratus plantae and the lumbricals, with the flexor digitorum longus and flexor hallucis longus tendons. Layer 3 is flexor hallucis brevis, adductor hallucis and flexor digiti minimi brevis. Layer 4 is the interossei, with the tibialis posterior and fibularis longus tendons. They hold the arches in standing and walking. The plantar vessels run between layers 1 and 2; the plantar arch lies between layers 3 and 4. Each layer has its own colour and bones are faded.",
    "zh": "足底肌在足底腱膜下分四层：第1层为拇展肌、趾短屈肌、小趾展肌；第2层为足底方肌、蚓状肌及趾长屈肌腱、拇长屈肌腱；第3层为拇短屈肌、拇收肌、小趾短屈肌；第4层为骨间肌及胫骨后肌腱、腓骨长肌腱。它们在站立和行走时维持足弓。足底血管行于第1、2层之间，足底弓位于第3、4层之间。每层一种颜色，骨骼淡化。"
  },
  "frameGroups": [
    "lop1",
    "lop2",
    "lop3",
    "lop4"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "lop1",
      "name": {
        "vi": "Lớp 1 (nông nhất)",
        "en": "Layer 1 (most superficial)",
        "zh": "第1层（最浅）"
      },
      "latin": "Mm. abductor hallucis, flexor digitorum brevis, abductor digiti minimi",
      "note": {
        "vi": "Ba cơ nằm song song từ củ xương gót ra trước. Gấp ngắn các ngón ở giữa gấp đốt giữa ngón II–V.",
        "en": "Three parallel muscles running forward from the calcaneal tuberosity. Flexor digitorum brevis, in the middle, flexes the middle phalanges of toes 2–5.",
        "zh": "三块肌自跟骨结节向前平行排列。居中的趾短屈肌屈第2–5趾中节。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1390M",
        "FJ1400M",
        "FJ1413M"
      ]
    },
    {
      "key": "lop2",
      "name": {
        "vi": "Lớp 2: vuông gan chân và cơ giun",
        "en": "Layer 2: quadratus plantae and lumbricals",
        "zh": "第2层：足底方肌与蚓状肌"
      },
      "latin": "M. quadratus plantae · Mm. lumbricales",
      "note": {
        "vi": "Cơ vuông gan chân bám vào gân gấp dài các ngón, nắn thẳng hướng kéo chéo của gân. Bốn cơ giun mọc từ các gân này, gấp khớp đốt bàn–ngón.",
        "en": "Quadratus plantae attaches to the flexor digitorum longus tendon and straightens its oblique pull. The four lumbricals arise from these tendons and flex the metatarsophalangeal joints.",
        "zh": "足底方肌附着于趾长屈肌腱，校正其斜向牵拉；四块蚓状肌起自这些肌腱，屈跖趾关节。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1383M",
        "FJ1385M",
        "FJ1387M",
        "FJ1389M",
        "FJ1412M"
      ]
    },
    {
      "key": "lop3",
      "name": {
        "vi": "Lớp 3: cơ ngắn của ngón cái và ngón út",
        "en": "Layer 3: short muscles of the big and little toes",
        "zh": "第3层：拇趾与小趾的短肌"
      },
      "latin": "Mm. flexor hallucis brevis, adductor hallucis, flexor digiti minimi brevis",
      "note": {
        "vi": "Gấp ngắn ngón cái có hai đầu, mỗi đầu chứa một xương vừng. Khép ngón cái có đầu chéo và đầu ngang, giữ vòm ngang. Cơ đối ngón út ở chân chỉ là thớ nhỏ của gấp ngắn ngón út.",
        "en": "Flexor hallucis brevis has two heads, each containing a sesamoid. Adductor hallucis has oblique and transverse heads and holds the transverse arch. Opponens digiti minimi of the foot is only a small slip of flexor digiti minimi brevis.",
        "zh": "拇短屈肌两头各含一籽骨。拇收肌有斜头和横头，维持横弓。足的小趾对跖肌仅为小趾短屈肌的小束。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1391M",
        "FJ1393M",
        "FJ1396M",
        "FJ1398M",
        "FJ1399M",
        "FJ1445M"
      ]
    },
    {
      "key": "lop4",
      "name": {
        "vi": "Lớp 4 (sâu nhất): cơ gian cốt gan chân",
        "en": "Layer 4 (deepest): plantar interossei",
        "zh": "第4层（最深）：骨间足底肌"
      },
      "latin": "Mm. interossei plantares",
      "note": {
        "vi": "Ba cơ gian cốt gan chân khép các ngón III–V về trục ngón II. Bộ dữ liệu không có cơ gian cốt mu chân (dạng ngón).",
        "en": "The three plantar interossei adduct toes 3–5 towards the axis of the second toe. The dataset lacks the dorsal interossei (the abductors).",
        "zh": "三块骨间足底肌使第3–5趾向第2趾轴线内收。数据集中无骨间背侧肌（外展肌）。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ1384M",
        "FJ1386M",
        "FJ1388M"
      ]
    },
    {
      "key": "gan-dai",
      "name": {
        "vi": "Gân gấp dài (đi trong lớp 2)",
        "en": "Long flexor tendons (in layer 2)",
        "zh": "长屈肌腱（行于第2层）"
      },
      "latin": "Tendines mm. flexoris digitorum longi et flexoris hallucis longi",
      "note": {
        "vi": "Hai gân này bắt chéo nhau ở gan chân (nút Henry), gân gấp dài ngón cái đi dưới.",
        "en": "The two tendons cross in the sole (the knot of Henry), flexor hallucis longus passing deep.",
        "zh": "二腱在足底交叉（Henry结），拇长屈肌腱行于深面。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1414M",
        "FJ1415M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch gan chân và cung gan chân",
        "en": "Plantar arteries and plantar arch",
        "zh": "足底动脉与足底弓"
      },
      "latin": "Aa. plantares medialis et lateralis · Arcus plantaris",
      "note": {
        "vi": "Động mạch gan chân ngoài lớn hơn, vòng vào sâu thành cung gan chân và nối với nhánh gan chân sâu của động mạch mu chân. Từ cung tách động mạch gan đốt bàn và gan ngón.",
        "en": "The lateral plantar artery is larger and curves deep to form the plantar arch, joining the deep plantar branch of the dorsalis pedis. The arch gives the plantar metatarsal and digital arteries.",
        "zh": "足底外侧动脉较大，向深部弯曲形成足底弓，与足背动脉的足底深支吻合。弓发出跖足底动脉和趾足底动脉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2079",
        "FJ2082",
        "FJ2085",
        "FJ2089",
        "FJ2092",
        "FJ2095",
        "FJ2096"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương bàn chân (mốc)",
        "en": "Foot bones (landmarks)",
        "zh": "足骨（标志）"
      },
      "latin": "Ossa pedis",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3179",
        "FJ3180",
        "FJ3181",
        "FJ3182",
        "FJ3185",
        "FJ3241",
        "FJ3244",
        "FJ3247",
        "FJ3250",
        "FJ3253",
        "FJ3256",
        "FJ3258",
        "FJ3264",
        "FJ3266",
        "FJ3267",
        "FJ3270",
        "FJ3271",
        "FJ3280",
        "FJ3293",
        "FJ3294",
        "FJ3295",
        "FJ3298",
        "FJ3311",
        "FJ3312",
        "FJ3315",
        "FJ3328",
        "FJ3329"
      ]
    }
  ]
};
