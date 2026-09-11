/**
 * Bài bộ phận "Cổ chân–bàn chân" học theo lớp, dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chằng delta, dây chằng bên ngoài, cân gan chân, dây thần kinh.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partFootScene: AtlasSceneDef = {
  "slug": "bo-phan-co-chan-ban-chan",
  "title": {
    "vi": "Cổ chân và bàn chân — học theo lớp",
    "en": "Ankle and Foot — Layer by Layer",
    "zh": "踝与足——分层学习"
  },
  "latin": "Tarsus · Pes",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là 26 xương bàn chân cùng đầu dưới xương chày, xương mác. Hậu túc, trung túc và tiền túc mỗi vùng một màu, dễ thấy các vòm bàn chân. Bật lớp Gân cẳng chân để thấy các gân từ cẳng chân vòng qua mắt cá xuống bàn chân. Bật lớp Cơ gan chân để thấy các cơ nội tại. Bật lớp Mạch máu để thấy động mạch mu chân và động mạch gan chân. Bộ dữ liệu không có dây chằng cổ chân và cân gan chân.",
    "en": "It opens on the 26 bones of the foot with the lower tibia and fibula. Hindfoot, midfoot and forefoot each have a colour, so the arches stand out. Turn on Leg tendons to see the tendons curving round the malleoli into the foot. Turn on Sole muscles for the intrinsic muscles. Turn on Vessels for the dorsalis pedis and plantar arteries. The dataset has no ankle ligaments or plantar aponeurosis.",
    "zh": "打开时显示足部26块骨及胫腓骨下端。后足、中足、前足各一种颜色，足弓清晰可见。开启“小腿肌腱”可见绕踝进入足部的肌腱；开启“足底肌”可见足固有肌；开启“血管”可见足背动脉和足底动脉。数据集中无踝韧带和足底腱膜。"
  },
  "frameGroups": [
    "hau-tuc",
    "trung-tuc",
    "tien-tuc"
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
        "cang-chan",
        "hau-tuc",
        "trung-tuc",
        "tien-tuc"
      ],
      "on": true
    },
    {
      "key": "gan",
      "name": {
        "vi": "Gân cẳng chân",
        "en": "Leg tendons",
        "zh": "小腿肌腱"
      },
      "groups": [
        "gap-mu",
        "mac",
        "gan-got",
        "sau-sau"
      ]
    },
    {
      "key": "co",
      "name": {
        "vi": "Cơ gan chân",
        "en": "Sole muscles",
        "zh": "足底肌"
      },
      "groups": [
        "co-gan-chan"
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
        "dm-mu",
        "dm-gan",
        "tm"
      ]
    }
  ],
  "groups": [
    {
      "key": "cang-chan",
      "name": {
        "vi": "Đầu dưới xương chày và mác (hai mắt cá)",
        "en": "Lower tibia and fibula (the malleoli)",
        "zh": "胫腓骨下端（内外踝）"
      },
      "latin": "Tibia · Fibula",
      "note": {
        "vi": "Hai mắt cá kẹp xương sên như một cái mộng.",
        "en": "The two malleoli grip the talus like a mortise.",
        "zh": "内外踝如榫卯般夹住距骨。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3260",
        "FJ3282"
      ]
    },
    {
      "key": "hau-tuc",
      "name": {
        "vi": "Hậu túc: sên, gót",
        "en": "Hindfoot: talus and calcaneus",
        "zh": "后足：距骨、跟骨"
      },
      "latin": "Talus · Calcaneus",
      "note": {
        "vi": "Xương sên không có cơ bám, máu nuôi nghèo; xương gót lớn nhất, chịu lực khi tiếp đất.",
        "en": "The talus has no muscle attachments and a poor blood supply; the calcaneus is the largest and takes heel strike.",
        "zh": "距骨无肌肉附着、血供差；跟骨最大，承受足跟着地冲击。"
      },
      "tint": "#d98c5f",
      "parts": [
        "FJ3256",
        "FJ3280"
      ]
    },
    {
      "key": "trung-tuc",
      "name": {
        "vi": "Trung túc: thuyền, hộp, ba chêm",
        "en": "Midfoot: navicular, cuboid, cuneiforms",
        "zh": "中足：足舟骨、骰骨、楔骨"
      },
      "latin": "Os naviculare, cuboideum, cuneiformia",
      "note": {
        "vi": "Xương thuyền là đỉnh vòm dọc trong; ba xương chêm khoá vòm ngang.",
        "en": "The navicular crowns the medial arch; the cuneiforms lock the transverse arch.",
        "zh": "足舟骨为内侧纵弓顶点；三块楔骨锁住横弓。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3258",
        "FJ3264",
        "FJ3267",
        "FJ3271"
      ]
    },
    {
      "key": "tien-tuc",
      "name": {
        "vi": "Tiền túc: đốt bàn, đốt ngón, xương vừng",
        "en": "Forefoot: metatarsals, phalanges, sesamoids",
        "zh": "前足：跖骨、趾骨、籽骨"
      },
      "latin": "Metatarsi · Phalanges",
      "note": {
        "vi": "Đốt bàn II dài và cố định nhất, hay gãy mỏi ở người lính.",
        "en": "The second metatarsal is the longest and most fixed, the site of march fractures.",
        "zh": "第2跖骨最长最固定，是行军骨折的好发部位。"
      },
      "tint": "#9fb8a0",
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
        "FJ3266",
        "FJ3270",
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
    },
    {
      "key": "gap-mu",
      "name": {
        "vi": "Gân khoang trước (gấp mu)",
        "en": "Anterior compartment tendons (dorsiflexors)",
        "zh": "前群肌腱（背屈）"
      },
      "latin": "Tendines compartimenti anterioris",
      "note": {
        "vi": "Chày trước, duỗi dài ngón cái, duỗi dài các ngón, mác ba đi trước cổ chân.",
        "en": "Tibialis anterior, extensor hallucis and digitorum longus and fibularis tertius cross the front of the ankle.",
        "zh": "胫骨前肌、拇长伸肌、趾长伸肌、第三腓骨肌经踝前方。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1406M",
        "FJ1407M",
        "FJ1408M",
        "FJ1411M",
        "FJ1439M"
      ]
    },
    {
      "key": "mac",
      "name": {
        "vi": "Gân cơ mác (lật ngoài)",
        "en": "Fibular tendons (evertors)",
        "zh": "腓骨肌腱（外翻）"
      },
      "latin": "Mm. fibulares",
      "note": {
        "vi": "Vòng sau mắt cá ngoài; mác dài luồn dưới gan chân tới đốt bàn I.",
        "en": "They pass behind the lateral malleolus; longus crosses the sole to the first metatarsal.",
        "zh": "经外踝后方；腓骨长肌腱经足底至第1跖骨。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1409M",
        "FJ1410M"
      ]
    },
    {
      "key": "gan-got",
      "name": {
        "vi": "Gân gót và tam đầu cẳng chân",
        "en": "Calcaneal tendon and triceps surae",
        "zh": "跟腱与小腿三头肌"
      },
      "latin": "Tendo calcaneus · M. triceps surae",
      "note": {
        "vi": "Gân to và khoẻ nhất cơ thể, lực đẩy chính khi bước.",
        "en": "The body's thickest, strongest tendon — the main push-off in walking.",
        "zh": "人体最粗最强的肌腱，行走时的主要推进力。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1405M",
        "FJ1394M",
        "FJ1397M",
        "FJ1437M"
      ]
    },
    {
      "key": "sau-sau",
      "name": {
        "vi": "Gân khoang sau sâu (ống cổ chân)",
        "en": "Deep posterior tendons (tarsal tunnel)",
        "zh": "后群深层肌腱（踝管）"
      },
      "latin": "Tendines compartimenti posterioris profundi",
      "note": {
        "vi": "Chày sau, gấp dài các ngón, gấp dài ngón cái vòng sau mắt cá trong.",
        "en": "Tibialis posterior, flexor digitorum longus and flexor hallucis longus pass behind the medial malleolus.",
        "zh": "胫骨后肌、趾长屈肌、拇长屈肌经内踝后方。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1414M",
        "FJ1415M",
        "FJ1440M"
      ]
    },
    {
      "key": "co-gan-chan",
      "name": {
        "vi": "Cơ gan chân",
        "en": "Muscles of the sole",
        "zh": "足底肌"
      },
      "latin": "Mm. plantae",
      "note": {
        "vi": "Bốn lớp cơ dưới cân gan chân giữ các vòm khi đứng và bước.",
        "en": "Four layers under the plantar aponeurosis hold the arches in standing and walking.",
        "zh": "足底腱膜下的四层肌在站立和行走时维持足弓。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1383M",
        "FJ1384M",
        "FJ1385M",
        "FJ1386M",
        "FJ1387M",
        "FJ1388M",
        "FJ1389M",
        "FJ1390M",
        "FJ1391M",
        "FJ1393M",
        "FJ1396M",
        "FJ1398M",
        "FJ1399M",
        "FJ1400M",
        "FJ1412M",
        "FJ1413M",
        "FJ1445M",
        "FJ3307"
      ]
    },
    {
      "key": "dm-mu",
      "name": {
        "vi": "Động mạch mu chân",
        "en": "Dorsalis pedis artery",
        "zh": "足背动脉"
      },
      "latin": "A. dorsalis pedis",
      "note": {
        "vi": "Bắt mạch giữa gân duỗi dài ngón cái và gân duỗi các ngón.",
        "en": "Its pulse is felt between the extensor hallucis longus and extensor digitorum tendons.",
        "zh": "在拇长伸肌腱与趾长伸肌腱之间可触及搏动。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2065",
        "FJ2067",
        "FJ2068",
        "FJ2073",
        "FJ2081"
      ]
    },
    {
      "key": "dm-gan",
      "name": {
        "vi": "Động mạch chày sau và gan chân",
        "en": "Posterior tibial and plantar arteries",
        "zh": "胫后动脉与足底动脉"
      },
      "latin": "Aa. plantares",
      "note": {
        "vi": "Bắt mạch chày sau giữa mắt cá trong và gân gót.",
        "en": "The posterior tibial pulse is felt between the medial malleolus and the calcaneal tendon.",
        "zh": "胫后动脉搏动于内踝与跟腱之间触及。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ2079",
        "FJ2082",
        "FJ2085",
        "FJ2087"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch bàn chân",
        "en": "Veins of the foot",
        "zh": "足部静脉"
      },
      "latin": "Venae pedis",
      "note": {
        "vi": "Cung tĩnh mạch mu chân là gốc của tĩnh mạch hiển lớn và hiển bé.",
        "en": "The dorsal venous arch gives rise to the great and small saphenous veins.",
        "zh": "足背静脉弓为大、小隐静脉的起源。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2059",
        "FJ2060",
        "FJ2118",
        "FJ2128"
      ]
    }
  ]
};
