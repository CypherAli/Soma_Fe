/**
 * Bài bộ phận "Bàn tay" học theo lớp, dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây thần kinh giữa/trụ, bao gân, cân gan tay.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partHandScene: AtlasSceneDef = {
  "slug": "bo-phan-ban-tay",
  "title": {
    "vi": "Bàn tay — học theo lớp",
    "en": "The Hand — Layer by Layer",
    "zh": "手——分层学习"
  },
  "latin": "Manus",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là 27 xương: 8 xương cổ tay, 5 xương đốt bàn và 14 đốt ngón, mỗi vùng một màu. Bật lớp Cơ nội tại để thấy ô mô cái, ô mô út và các cơ gian cốt, cơ giun làm nên sự khéo léo của bàn tay. Bật lớp Mạch máu để thấy hai cung động mạch gan tay nông và sâu. Bộ dữ liệu không có dây thần kinh và bao gân.",
    "en": "It opens on the 27 bones: 8 carpals, 5 metacarpals and 14 phalanges, each region in its own colour. Turn on Intrinsic muscles to see the thenar and hypothenar eminences and the interossei and lumbricals behind the hand's dexterity. Turn on Vessels for the superficial and deep palmar arches. The dataset has no nerves or tendon sheaths.",
    "zh": "打开时显示27块骨：8块腕骨、5块掌骨和14块指骨，各区一种颜色。开启“手固有肌”可见鱼际、小鱼际及骨间肌、蚓状肌——手部灵巧的基础；开启“血管”可见掌浅弓和掌深弓。数据集中无神经和腱鞘。"
  },
  "layers": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương",
        "en": "Bones",
        "zh": "骨"
      },
      "groups": [
        "co-tay",
        "dot-ban",
        "dot-ngon"
      ],
      "on": true
    },
    {
      "key": "co",
      "name": {
        "vi": "Cơ nội tại",
        "en": "Intrinsic muscles",
        "zh": "手固有肌"
      },
      "groups": [
        "mo-cai",
        "mo-ut",
        "khep-cai",
        "gian-cot"
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
        "cung-nong",
        "cung-sau",
        "tm"
      ]
    }
  ],
  "groups": [
    {
      "key": "co-tay",
      "name": {
        "vi": "Tám xương cổ tay",
        "en": "The eight carpals",
        "zh": "八块腕骨"
      },
      "latin": "Ossa carpi",
      "note": {
        "vi": "Hai hàng: thuyền, nguyệt, tháp, đậu và thang, thê, cả, móc. Xương thuyền gãy nhiều nhất khi ngã chống tay.",
        "en": "Two rows: scaphoid, lunate, triquetrum, pisiform and trapezium, trapezoid, capitate, hamate. The scaphoid breaks most often in a fall on the hand.",
        "zh": "两列：手舟骨、月骨、三角骨、豌豆骨和大多角骨、小多角骨、头状骨、钩骨。摔倒手撑地时手舟骨最常骨折。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3257",
        "FJ3261",
        "FJ3268",
        "FJ3276",
        "FJ3278",
        "FJ3283",
        "FJ3284",
        "FJ3285"
      ]
    },
    {
      "key": "dot-ban",
      "name": {
        "vi": "Năm xương đốt bàn",
        "en": "Five metacarpals",
        "zh": "五块掌骨"
      },
      "latin": "Ossa metacarpi",
      "note": {
        "vi": "Đốt bàn I ngắn, khớp yên ngựa với xương thang nên ngón cái đối chiếu được.",
        "en": "The short first metacarpal has a saddle joint with the trapezium, so the thumb can oppose.",
        "zh": "第1掌骨短，与大多角骨构成鞍状关节，使拇指能对掌。"
      },
      "tint": "#d98c5f",
      "parts": [
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252"
      ]
    },
    {
      "key": "dot-ngon",
      "name": {
        "vi": "Mười bốn đốt ngón",
        "en": "Fourteen phalanges",
        "zh": "十四节指骨"
      },
      "latin": "Phalanges",
      "note": {
        "vi": "Ngón cái hai đốt, các ngón khác ba đốt.",
        "en": "The thumb has two, the other fingers three.",
        "zh": "拇指两节，其余各指三节。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ3183",
        "FJ3184",
        "FJ3186",
        "FJ3187",
        "FJ3188",
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
    },
    {
      "key": "mo-cai",
      "name": {
        "vi": "Ô mô cái",
        "en": "Thenar eminence",
        "zh": "鱼际"
      },
      "latin": "Eminentia thenaris",
      "note": {
        "vi": "Dạng ngắn, gấp ngắn và đối chiếu ngón cái — teo khi dây giữa bị chèn trong ống cổ tay.",
        "en": "Abductor, flexor and opponens pollicis — they waste when the median nerve is compressed in the carpal tunnel.",
        "zh": "拇短展肌、拇短屈肌、拇对掌肌——腕管内正中神经受压时萎缩。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1469M",
        "FJ1483M",
        "FJ1501M",
        "FJ1514M"
      ]
    },
    {
      "key": "mo-ut",
      "name": {
        "vi": "Ô mô út",
        "en": "Hypothenar eminence",
        "zh": "小鱼际"
      },
      "latin": "Eminentia hypothenaris",
      "note": {
        "vi": "Dạng, gấp ngắn và đối chiếu ngón út; do dây trụ chi phối.",
        "en": "Abductor, flexor and opponens digiti minimi; supplied by the ulnar nerve.",
        "zh": "小指展肌、小指短屈肌、小指对掌肌；受尺神经支配。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1466M",
        "FJ1470M",
        "FJ1482M"
      ]
    },
    {
      "key": "khep-cai",
      "name": {
        "vi": "Cơ khép ngón cái",
        "en": "Adductor pollicis",
        "zh": "拇收肌"
      },
      "latin": "M. adductor pollicis",
      "note": {
        "vi": "Kẹp chặt ngón cái vào bàn tay; yếu cơ này làm dấu hiệu Froment dương tính.",
        "en": "Clamps the thumb to the palm; its weakness gives a positive Froment sign.",
        "zh": "使拇指紧贴手掌；其无力致Froment征阳性。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1481M",
        "FJ1515M"
      ]
    },
    {
      "key": "gian-cot",
      "name": {
        "vi": "Cơ gian cốt và cơ giun",
        "en": "Interossei and lumbricals",
        "zh": "骨间肌与蚓状肌"
      },
      "latin": "Mm. interossei · lumbricales",
      "note": {
        "vi": "Gian cốt mu dạng, gian cốt gan khép ngón; cơ giun gấp khớp bàn–ngón và duỗi khớp liên đốt — tư thế cầm bút.",
        "en": "Dorsal interossei abduct, palmar adduct; lumbricals flex the knuckles and straighten the finger joints — the pen-holding posture.",
        "zh": "骨间背侧肌外展、骨间掌侧肌内收；蚓状肌屈掌指关节、伸指间关节——握笔姿势。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1509M",
        "FJ1510M",
        "FJ1511M"
      ]
    },
    {
      "key": "cung-nong",
      "name": {
        "vi": "Cung động mạch gan tay nông",
        "en": "Superficial palmar arch",
        "zh": "掌浅弓"
      },
      "latin": "Arcus palmaris superficialis",
      "note": {
        "vi": "Chủ yếu từ động mạch trụ, nằm ngang mép ngón cái dạng hết cỡ.",
        "en": "Mainly from the ulnar artery, level with the web of the fully abducted thumb.",
        "zh": "主要来自尺动脉，平拇指充分外展时的指蹼。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2248",
        "FJ2315",
        "FJ2316",
        "FJ2317",
        "FJ2333",
        "FJ2334",
        "FJ2335",
        "FJ2336",
        "FJ2337"
      ]
    },
    {
      "key": "cung-sau",
      "name": {
        "vi": "Cung động mạch gan tay sâu",
        "en": "Deep palmar arch",
        "zh": "掌深弓"
      },
      "latin": "Arcus palmaris profundus",
      "note": {
        "vi": "Chủ yếu từ động mạch quay, cao hơn cung nông khoảng 1cm.",
        "en": "Mainly from the radial artery, about 1cm higher.",
        "zh": "主要来自桡动脉，约高于掌浅弓1cm。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ2227",
        "FJ2237",
        "FJ2314",
        "FJ2332",
        "FJ2338",
        "FJ2339"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch bàn tay",
        "en": "Veins of the hand",
        "zh": "手部静脉"
      },
      "latin": "Venae manus",
      "note": {
        "vi": "Máu dồn về mạng tĩnh mạch mu tay — chỗ đặt kim truyền quen thuộc.",
        "en": "Blood gathers in the dorsal venous network — a familiar cannulation site.",
        "zh": "血液汇入手背静脉网——常用的输液部位。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2228",
        "FJ2229",
        "FJ2249"
      ]
    }
  ]
};
