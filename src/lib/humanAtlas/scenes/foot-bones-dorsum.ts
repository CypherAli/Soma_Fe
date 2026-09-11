/**
 * Scene "Xương bàn chân và mạch mu chân" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chằng lò xo, cân gan chân; có dây chằng gan chân dài.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const footBonesDorsumScene: AtlasSceneDef = {
  "slug": "ban-chan-chi-tiet",
  "title": {
    "vi": "Xương bàn chân và mạch mu chân",
    "en": "Bones of the Foot and Dorsal Vessels",
    "zh": "足骨与足背血管"
  },
  "latin": "Ossa pedis · A. dorsalis pedis",
  "intro": {
    "vi": "Bàn chân có 26 xương, chia ba vùng. Hậu túc gồm sên và gót. Trung túc gồm thuyền, hộp và ba chêm. Tiền túc gồm năm xương đốt bàn và các đốt ngón, thêm hai xương vừng dưới chỏm đốt bàn I. Chúng xếp thành vòm dọc trong, vòm dọc ngoài và vòm ngang để chia sức nặng. Dây chằng gan chân dài giữ vòm dọc ngoài. Trên mu chân, động mạch mu chân tiếp nối động mạch chày trước; bắt mạch được giữa gân duỗi dài ngón cái và gân duỗi các ngón. Mỗi vùng xương một màu.",
    "en": "The foot has 26 bones in three regions. The hindfoot is the talus and calcaneus. The midfoot is the navicular, cuboid and three cuneiforms. The forefoot is the five metatarsals and the phalanges, plus two sesamoids under the first metatarsal head. They form the medial and lateral longitudinal arches and the transverse arch to spread body weight. The long plantar ligament holds the lateral arch. On the dorsum, the dorsalis pedis artery continues the anterior tibial; its pulse is felt between the extensor hallucis longus and extensor digitorum tendons. Each region of bones has its own colour.",
    "zh": "足有26块骨，分三区：后足为距骨和跟骨；中足为足舟骨、骰骨和三块楔骨；前足为五块跖骨和趾骨，另有两块籽骨位于第1跖骨头下。它们构成内侧纵弓、外侧纵弓和横弓以分散体重。足底长韧带维持外侧纵弓。足背动脉续于胫前动脉，在拇长伸肌腱与趾长伸肌腱之间可触及搏动。每区骨一种颜色。"
  },
  "frameGroups": [
    "hau",
    "trung",
    "tien",
    "ngon"
  ],
  "groups": [
    {
      "key": "hau",
      "name": {
        "vi": "Hậu túc: xương sên, xương gót",
        "en": "Hindfoot: talus and calcaneus",
        "zh": "后足：距骨与跟骨"
      },
      "latin": "Talus · Calcaneus",
      "note": {
        "vi": "Xương sên không có cơ bám và phần lớn phủ sụn, nên máu nuôi nghèo; gãy cổ xương sên dễ gây hoại tử. Xương gót là xương cổ chân lớn nhất, gãy khi ngã từ trên cao đập gót xuống.",
        "en": "The talus has no muscle attachments and is mostly covered by cartilage, so its blood supply is poor; a neck fracture risks necrosis. The calcaneus is the largest tarsal bone and breaks in falls from a height onto the heel.",
        "zh": "距骨无肌肉附着且大部被软骨覆盖，血供差，颈部骨折易致坏死。跟骨是最大的跗骨，高处坠落足跟着地时易骨折。"
      },
      "tint": "#d98c5f",
      "parts": [
        "FJ3256",
        "FJ3280"
      ]
    },
    {
      "key": "trung",
      "name": {
        "vi": "Trung túc: thuyền, hộp, ba chêm",
        "en": "Midfoot: navicular, cuboid, three cuneiforms",
        "zh": "中足：足舟骨、骰骨、三块楔骨"
      },
      "latin": "Os naviculare, cuboideum, cuneiformia",
      "note": {
        "vi": "Xương thuyền là đỉnh vòm dọc trong. Ba xương chêm hình nêm, xếp như đá khoá vòm ngang. Đường khớp giữa hậu túc và trung túc (khớp Chopart) là chỗ phẫu thuật cắt cụt.",
        "en": "The navicular is the keystone of the medial arch. The three wedge-shaped cuneiforms lock the transverse arch like voussoirs. The joint line between hind- and midfoot (Chopart's joint) is a level for amputation.",
        "zh": "足舟骨为内侧纵弓顶点。三块楔形楔骨如拱石般锁住横弓。后足与中足间关节线（Chopart关节）为截肢平面之一。"
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
      "key": "tien",
      "name": {
        "vi": "Tiền túc: năm xương đốt bàn và xương vừng",
        "en": "Forefoot: five metatarsals and sesamoids",
        "zh": "前足：五块跖骨与籽骨"
      },
      "latin": "Ossa metatarsi · Ossa sesamoidea",
      "note": {
        "vi": "Xương đốt bàn II dài và cố định nhất, hay bị gãy mỏi ở người lính và vận động viên. Hai xương vừng nằm trong gân gấp ngắn ngón cái, đỡ chỏm đốt bàn I.",
        "en": "The second metatarsal is the longest and most fixed, the classic site of stress (march) fractures in soldiers and athletes. The two sesamoids lie in the flexor hallucis brevis tendons under the first metatarsal head.",
        "zh": "第2跖骨最长且最固定，是士兵和运动员疲劳（行军）骨折的典型部位。两块籽骨位于拇短屈肌腱内，承托第1跖骨头。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ3241",
        "FJ3244",
        "FJ3247",
        "FJ3250",
        "FJ3253",
        "FJ3266",
        "FJ3270"
      ]
    },
    {
      "key": "ngon",
      "name": {
        "vi": "Các đốt ngón chân",
        "en": "Phalanges of the toes",
        "zh": "趾骨"
      },
      "latin": "Phalanges pedis",
      "note": {
        "vi": "Ngón cái chỉ có hai đốt, các ngón khác có ba. Ngón út thường dính đốt giữa với đốt xa.",
        "en": "The big toe has two phalanges, the others three. In the little toe the middle and distal phalanges are often fused.",
        "zh": "拇趾两节，其余各趾三节；小趾中、远节常融合。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ3179",
        "FJ3180",
        "FJ3181",
        "FJ3182",
        "FJ3185",
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
      "key": "day-chang",
      "name": {
        "vi": "Dây chằng gan chân dài",
        "en": "Long plantar ligament",
        "zh": "足底长韧带"
      },
      "latin": "Lig. plantare longum",
      "note": {
        "vi": "Dây chằng dài nhất bàn chân, từ mặt dưới xương gót tới xương hộp và nền các xương đốt bàn. Nó giữ vòm dọc ngoài và tạo mái cho gân cơ mác dài.",
        "en": "The longest ligament of the foot, from the underside of the calcaneus to the cuboid and metatarsal bases. It holds the lateral arch and roofs the fibularis longus tendon.",
        "zh": "足部最长的韧带，自跟骨下面至骰骨和跖骨底，维持外侧纵弓并构成腓骨长肌腱的顶。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1424M"
      ]
    },
    {
      "key": "dm-mu",
      "name": {
        "vi": "Động mạch mu chân và cung",
        "en": "Dorsalis pedis artery and arcuate artery",
        "zh": "足背动脉与弓状动脉"
      },
      "latin": "A. dorsalis pedis · A. arcuata",
      "note": {
        "vi": "Cho động mạch cổ chân ngoài, động mạch cung (tách động mạch mu đốt bàn) và nhánh gan chân sâu xuyên xuống nối cung gan chân. Mất mạch mu chân gặp trong bệnh động mạch ngoại biên; khoảng 10% người bình thường không bắt được mạch này.",
        "en": "Gives the lateral tarsal artery, the arcuate artery (which gives the dorsal metatarsals) and the deep plantar branch, which dives to join the plantar arch. An absent dorsalis pedis pulse suggests peripheral arterial disease, though about 10% of healthy people lack a palpable one.",
        "zh": "发出跗外侧动脉、弓状动脉（发出跖背动脉）和足底深支（下穿与足底弓吻合）。足背动脉搏动消失提示周围动脉病，但约10%正常人触不到。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2067",
        "FJ2068",
        "FJ2072",
        "FJ2073",
        "FJ2081"
      ]
    },
    {
      "key": "tm-mu",
      "name": {
        "vi": "Cung tĩnh mạch mu chân",
        "en": "Dorsal venous arch of the foot",
        "zh": "足背静脉弓"
      },
      "latin": "Arcus venosus dorsalis pedis",
      "note": {
        "vi": "Đầu trong của cung thành tĩnh mạch hiển lớn (đi trước mắt cá trong), đầu ngoài thành tĩnh mạch hiển bé (đi sau mắt cá ngoài).",
        "en": "Its medial end becomes the great saphenous vein (in front of the medial malleolus), its lateral end the small saphenous vein (behind the lateral malleolus).",
        "zh": "其内侧端延续为大隐静脉（经内踝前方），外侧端延续为小隐静脉（经外踝后方）。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2059",
        "FJ2060"
      ]
    }
  ]
};
