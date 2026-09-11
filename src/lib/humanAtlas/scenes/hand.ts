/**
 * Scene "Xương Bàn tay" (bàn tay trái) dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-hand.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const handScene: AtlasSceneDef = {
  "slug": "ban-tay",
  "title": {
    "vi": "Xương Bàn tay",
    "en": "Bones of the Hand",
    "zh": "手骨"
  },
  "latin": "Ossa manus",
  "intro": {
    "vi": "Bàn tay có 27 xương: 8 xương cổ tay xếp hai hàng, 5 xương đốt bàn và 14 đốt ngón. Hàng cổ tay tạo thành một máng lõm ở mặt gan tay; mạc giữ gân gấp căng qua máng đó thành ống cổ tay, nơi thần kinh giữa dễ bị chèn. Mỗi hàng xương tô một màu.",
    "en": "The hand has 27 bones: 8 carpals in two rows, 5 metacarpals and 14 phalanges. The carpals form a palmar gutter; the flexor retinaculum spans it to make the carpal tunnel, where the median nerve is easily compressed. Each row is coloured separately.",
    "zh": "手有27块骨：8块腕骨排成两列、5块掌骨和14节指骨。腕骨在掌侧形成凹槽，屈肌支持带横跨其上构成腕管，正中神经易在此受压。每列骨各用一色。"
  },
  "groups": [
    {
      "key": "co-tay-hang-tren",
      "name": {
        "vi": "Hàng cổ tay trên",
        "en": "Proximal carpal row",
        "zh": "近侧列腕骨"
      },
      "latin": "Ossa carpi, ordo proximalis",
      "note": {
        "vi": "Thuyền, nguyệt, tháp, đậu (từ ngoài vào). Thuyền và nguyệt khớp với đầu dưới xương quay. Gãy xương thuyền đau ở hõm lào giải phẫu; xương nguyệt là xương cổ tay hay trật nhất, có thể lồi vào ống cổ tay chèn thần kinh giữa. Xương đậu là xương vừng nằm trong gân cơ gấp cổ tay trụ.",
        "en": "Scaphoid, lunate, triquetrum, pisiform (lateral to medial). The scaphoid and lunate articulate with the distal radius. A scaphoid fracture is tender in the anatomical snuffbox; the lunate is the most commonly dislocated carpal and can push into the carpal tunnel onto the median nerve. The pisiform is a sesamoid bone in the flexor carpi ulnaris tendon.",
        "zh": "由外向内为手舟骨、月骨、三角骨、豌豆骨。手舟骨与月骨与桡骨远端相关节。手舟骨骨折在鼻烟窝有压痛；月骨是最常脱位的腕骨，可突入腕管压迫正中神经。豌豆骨是尺侧腕屈肌腱内的籽骨。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ3268",
        "FJ3276",
        "FJ3278",
        "FJ3285"
      ]
    },
    {
      "key": "co-tay-hang-duoi",
      "name": {
        "vi": "Hàng cổ tay dưới",
        "en": "Distal carpal row",
        "zh": "远侧列腕骨"
      },
      "latin": "Ossa carpi, ordo distalis",
      "note": {
        "vi": "Thang, thê, cả, móc. Xương thang tạo khớp yên ngựa với đốt bàn I — khớp cho ngón cái xoay đối chiếu, cũng là nơi thoái hoá khớp hay gặp. Xương cả lớn nhất; móc của xương móc là bờ trong ống cổ tay và thành của ống Guyon (thần kinh trụ).",
        "en": "Trapezium, trapezoid, capitate, hamate. The trapezium forms the saddle joint with the first metacarpal — the joint that lets the thumb oppose, and a common site of osteoarthritis. The capitate is the largest; the hook of the hamate forms the medial edge of the carpal tunnel and a wall of Guyon's canal (ulnar nerve).",
        "zh": "大多角骨、小多角骨、头状骨、钩骨。大多角骨与第一掌骨构成鞍状关节——拇指对掌的关节，也是骨关节炎好发部位。头状骨最大；钩骨钩构成腕管内侧缘及Guyon管（尺神经）一壁。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ3257",
        "FJ3261",
        "FJ3283",
        "FJ3284"
      ]
    },
    {
      "key": "dot-ban",
      "name": {
        "vi": "Xương đốt bàn tay (I–V)",
        "en": "Metacarpals (I–V)",
        "zh": "掌骨（I–V）"
      },
      "latin": "Ossa metacarpi I–V",
      "note": {
        "vi": "Năm xương dài nhỏ tạo lòng bàn tay, đánh số từ ngón cái. Gãy cổ xương đốt bàn V khi đấm vào vật cứng gọi là \"gãy võ sĩ\".",
        "en": "Five small long bones forming the palm, numbered from the thumb. A fracture of the neck of the fifth metacarpal from punching a hard object is called a \"boxer's fracture\".",
        "zh": "五块小长骨构成手掌，自拇指侧起编号。拳击硬物导致第五掌骨颈骨折，称为“拳击手骨折”。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252"
      ]
    },
    {
      "key": "dot-gan",
      "name": {
        "vi": "Đốt ngón gần",
        "en": "Proximal phalanges",
        "zh": "近节指骨"
      },
      "latin": "Phalanges proximales",
      "note": {
        "vi": "Đốt dài nhất của mỗi ngón, khớp với đầu xương đốt bàn tạo khớp đốt bàn-ngón (khớp \"đốt tay\" khi nắm tay lại).",
        "en": "The longest phalanx of each digit, meeting the metacarpal head at the metacarpophalangeal joint (the knuckle when you make a fist).",
        "zh": "每指最长的一节，与掌骨头构成掌指关节（握拳时的指节）。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ3313",
        "FJ3314",
        "FJ3316",
        "FJ3317",
        "FJ3318"
      ]
    },
    {
      "key": "dot-giua",
      "name": {
        "vi": "Đốt ngón giữa",
        "en": "Middle phalanges",
        "zh": "中节指骨"
      },
      "latin": "Phalanges mediae",
      "note": {
        "vi": "Chỉ bốn ngón dài có đốt giữa; ngón cái không có. Khớp liên đốt gần giữa đốt gần và đốt giữa là nơi hay bị kẹt, trật khi chơi bóng.",
        "en": "Only the four fingers have a middle phalanx; the thumb has none. The proximal interphalangeal joint between the proximal and middle phalanges is the one most often jammed or dislocated in ball sports.",
        "zh": "仅四个长指有中节指骨，拇指无。近节与中节之间的近侧指间关节是球类运动中最常戳伤或脱位的关节。"
      },
      "tint": "#cfa94f",
      "parts": [
        "FJ3291",
        "FJ3296",
        "FJ3297",
        "FJ3299"
      ]
    },
    {
      "key": "dot-xa",
      "name": {
        "vi": "Đốt ngón xa",
        "en": "Distal phalanges",
        "zh": "远节指骨"
      },
      "latin": "Phalanges distales",
      "note": {
        "vi": "Đốt cuối, đỡ móng và búp ngón. Đầu xa loe ra thành gò đốt xa, nơi tập trung dày đặc thụ thể cảm giác. Đứt gân duỗi ở đây làm đốt xa gập rũ (ngón tay hình vồ).",
        "en": "The end phalanx, supporting the nail and fingertip pad. Its tip flares into the ungual tuberosity, packed with sensory receptors. Rupture of the extensor tendon here leaves the tip drooping (mallet finger).",
        "zh": "末节，承托指甲和指腹。远端膨大为甲粗隆，感觉感受器密集。此处伸肌腱断裂致末节下垂（锤状指）。"
      },
      "tint": "#d9a066",
      "parts": [
        "FJ3183",
        "FJ3184",
        "FJ3186",
        "FJ3187",
        "FJ3188"
      ]
    }
  ]
};
