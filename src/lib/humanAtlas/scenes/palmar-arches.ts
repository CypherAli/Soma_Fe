/**
 * Scene "Cung động mạch gan tay và mạch bàn tay" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Đám rối cánh tay" cũ: atlas không có thần kinh ngoại biên chi trên.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const palmarArchesScene: AtlasSceneDef = {
  "slug": "dam-roi-canh-tay",
  "title": {
    "vi": "Cung động mạch gan tay và mạch bàn tay",
    "en": "Palmar Arches and Vessels of the Hand",
    "zh": "掌动脉弓与手部血管"
  },
  "latin": "Arcus palmaris superficialis et profundus",
  "system": "cardiovascular",
  "intro": {
    "vi": "Bàn tay nhận máu từ hai động mạch quay và trụ, nối nhau thành hai cung gan tay. Cung nông chủ yếu từ động mạch trụ, nằm ngang mức mép ngón cái dạng tối đa. Cung sâu chủ yếu từ động mạch quay, cao hơn khoảng 1cm. Từ hai cung tách ra các động mạch gan ngón chung và riêng. Nhờ hai nguồn nối nhau, tắc một động mạch vẫn còn nguồn kia nuôi tay; nghiệm pháp Allen kiểm tra điều này trước khi lấy động mạch quay. Mỗi cung một sắc đỏ, tĩnh mạch xanh, xương mờ.",
    "en": "The hand is fed by the radial and ulnar arteries, which join to form two palmar arches. The superficial arch comes mainly from the ulnar artery and lies level with the web of the fully abducted thumb. The deep arch comes mainly from the radial artery and lies about 1cm higher. From the arches arise the common and proper palmar digital arteries. Because two sources join, blocking one still leaves the other to feed the hand; the Allen test checks this before the radial artery is harvested. Each arch has its own shade of red, veins are blue and bones faded.",
    "zh": "手部由桡、尺动脉供血，二者吻合成两个掌弓。掌浅弓主要来自尺动脉，平拇指充分外展时的指蹼；掌深弓主要来自桡动脉，高约1cm。两弓发出指掌侧总动脉和指掌侧固有动脉。由于双源吻合，一支阻塞仍有另一支供血；取桡动脉前用Allen试验检查。每弓一种红色调，静脉蓝色，骨骼淡化。"
  },
  "frameGroups": [
    "nong",
    "sau",
    "ngon",
    "mu",
    "tm"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "nguon",
      "name": {
        "vi": "Động mạch quay và trụ (đoạn cổ tay)",
        "en": "Radial and ulnar arteries (wrist segment)",
        "zh": "桡动脉与尺动脉（腕段）"
      },
      "latin": "A. radialis · A. ulnaris",
      "note": {
        "vi": "Động mạch trụ đi thẳng vào gan tay thành cung nông. Động mạch quay vòng ra mu tay qua hõm lào giải phẫu, xuyên khoang gian đốt bàn I rồi vào gan tay thành cung sâu.",
        "en": "The ulnar artery runs straight into the palm as the superficial arch. The radial artery winds to the back of the hand through the anatomical snuffbox, pierces the first intermetacarpal space and enters the palm as the deep arch.",
        "zh": "尺动脉直入手掌成为掌浅弓。桡动脉经解剖学鼻烟窝绕至手背，穿第1掌骨间隙进入手掌形成掌深弓。"
      },
      "tint": "#8f2d2d",
      "parts": [
        "FJ2242",
        "FJ2258"
      ]
    },
    {
      "key": "nong",
      "name": {
        "vi": "Cung gan tay nông và động mạch gan ngón chung",
        "en": "Superficial palmar arch and common palmar digital arteries",
        "zh": "掌浅弓与指掌侧总动脉"
      },
      "latin": "Arcus palmaris superficialis · Aa. digitales palmares communes",
      "note": {
        "vi": "Nằm ngay dưới cân gan tay, trên các gân gấp. Cho ba hoặc bốn động mạch gan ngón chung, mỗi động mạch chia đôi ở mép ngón.",
        "en": "Lies just under the palmar aponeurosis, over the flexor tendons. It gives three or four common palmar digital arteries, each dividing at a finger web.",
        "zh": "位于掌腱膜深面、屈肌腱浅面，发出3–4条指掌侧总动脉，各在指蹼处分叉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2248",
        "FJ2315",
        "FJ2316",
        "FJ2317",
        "FJ2337"
      ]
    },
    {
      "key": "sau",
      "name": {
        "vi": "Cung gan tay sâu và nhánh",
        "en": "Deep palmar arch and its branches",
        "zh": "掌深弓及其分支"
      },
      "latin": "Arcus palmaris profundus · Aa. metacarpales palmares",
      "note": {
        "vi": "Nằm sâu dưới gân gấp, trên nền xương đốt bàn. Cho động mạch gan đốt bàn, động mạch chính ngón cái và động mạch quay ngón trỏ.",
        "en": "Lies deep to the flexor tendons on the metacarpal bases. It gives the palmar metacarpal arteries, the princeps pollicis and the radialis indicis.",
        "zh": "位于屈肌腱深面、掌骨底上，发出掌心动脉、拇主要动脉和示指桡侧动脉。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2227",
        "FJ2237",
        "FJ2314",
        "FJ2338",
        "FJ2339"
      ]
    },
    {
      "key": "ngon",
      "name": {
        "vi": "Động mạch gan ngón riêng",
        "en": "Proper palmar digital arteries",
        "zh": "指掌侧固有动脉"
      },
      "latin": "Aa. digitales palmares propriae",
      "note": {
        "vi": "Mỗi ngón có hai động mạch chạy dọc hai bờ bên. Vì vậy gây tê gốc ngón phải tiêm cả hai bên.",
        "en": "Each finger has two, running along its sides. That is why a digital block is injected on both sides.",
        "zh": "每指两条，沿两侧缘走行，故指根阻滞需两侧注射。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ2332",
        "FJ2333",
        "FJ2334",
        "FJ2335",
        "FJ2336"
      ]
    },
    {
      "key": "mu",
      "name": {
        "vi": "Mạng mạch mu cổ tay và mu tay",
        "en": "Dorsal carpal network and dorsal metacarpal arteries",
        "zh": "腕背网与掌背动脉"
      },
      "latin": "Rete carpale dorsale · Aa. metacarpales dorsales",
      "note": {
        "vi": "Nhánh mu cổ tay của động mạch quay và trụ tạo mạng mu cổ tay. Từ đó tách ra động mạch mu đốt bàn và mu ngón.",
        "en": "The dorsal carpal branches of the radial and ulnar arteries form the dorsal carpal network, which gives the dorsal metacarpal and dorsal digital arteries.",
        "zh": "桡、尺动脉腕背支构成腕背网，发出掌背动脉和指背动脉。"
      },
      "tint": "#b03a48",
      "parts": [
        "FJ2231",
        "FJ2236",
        "FJ2318",
        "FJ2348"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch bàn tay",
        "en": "Veins of the hand",
        "zh": "手部静脉"
      },
      "latin": "Arcus venosi palmares · Rete venosum dorsale manus",
      "note": {
        "vi": "Cung tĩnh mạch gan tay nông và sâu đi kèm hai cung động mạch. Phần lớn máu bàn tay dồn ra mạng tĩnh mạch mu tay, là gốc của tĩnh mạch đầu và tĩnh mạch nền. Vì thế mu tay là chỗ đặt kim truyền quen thuộc.",
        "en": "Superficial and deep palmar venous arches accompany the arterial arches. Most blood from the hand drains to the dorsal venous network, the origin of the cephalic and basilic veins. That is why the back of the hand is a familiar cannulation site.",
        "zh": "掌浅、深静脉弓伴行两动脉弓。手部大部分血液汇入手背静脉网，为头静脉和贵要静脉的起源，故手背是常用的输液穿刺部位。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2228",
        "FJ2229",
        "FJ2238",
        "FJ2249",
        "FJ2319",
        "FJ2320",
        "FJ2321",
        "FJ2322",
        "FJ2323",
        "FJ2324",
        "FJ2325",
        "FJ2326",
        "FJ2327",
        "FJ2328",
        "FJ2329",
        "FJ2340"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương bàn tay (mốc)",
        "en": "Bones of the hand (landmarks)",
        "zh": "手骨（标志）"
      },
      "latin": "Ossa carpi, metacarpi, phalanges",
      "note": {
        "vi": "Mờ sẵn để hai cung nổi lên trên nền xương đốt bàn.",
        "en": "Faded so the arches stand out against the metacarpals.",
        "zh": "淡化，使两弓在掌骨背景上突出。"
      },
      "parts": [
        "FJ3183",
        "FJ3184",
        "FJ3186",
        "FJ3187",
        "FJ3188",
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252",
        "FJ3257",
        "FJ3261",
        "FJ3268",
        "FJ3276",
        "FJ3278",
        "FJ3283",
        "FJ3284",
        "FJ3285",
        "FJ3291",
        "FJ3296",
        "FJ3297",
        "FJ3299",
        "FJ3313",
        "FJ3314",
        "FJ3316",
        "FJ3317",
        "FJ3318"
      ]
    }
  ]
};
