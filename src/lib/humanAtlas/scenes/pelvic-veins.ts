
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Tĩnh mạch vùng chậu hông" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Đám rối thắt lưng–cùng" cũ: atlas không có thần kinh ngoại biên. Atlas không có ĐM mông, ĐM thẹn trong.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const pelvicVeinsScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/pelvic-veins.ts#pelvicVeinsScene", {
  "slug": "dam-roi-that-lung-cung",
  "title": {
    "vi": "Hệ tĩnh mạch chậu",
    "en": "The Iliac Venous System",
    "zh": "髂静脉系统"
  },
  "latin": "Vv. iliacae et tributaria",
  "system": "cardiovascular",
  "intro": {
    "vi": "Máu từ chi dưới và chậu hông về tim qua hệ tĩnh mạch chậu. Tĩnh mạch chậu ngoài nối tiếp tĩnh mạch đùi. Tĩnh mạch chậu trong nhận máu từ thành chậu (mông, bịt, cùng) và tạng chậu (thẹn trong, trực tràng). Hai tĩnh mạch hợp thành tĩnh mạch chậu chung trước khớp cùng–chậu. Hai tĩnh mạch chậu chung hợp thành tĩnh mạch chủ dưới ngang L5. Tĩnh mạch chậu chung trái bị động mạch chậu chung phải đè lên. Đó là lý do huyết khối tĩnh mạch sâu gặp ở chân trái nhiều hơn (hội chứng May–Thurner). Mỗi nhóm nhánh một sắc xanh; động mạch và xương mờ sẵn.",
    "en": "Blood from the lower limbs and pelvis returns through the iliac veins. The external iliac vein continues the femoral vein. The internal iliac vein collects from the pelvic wall (gluteal, obturator, sacral) and pelvic organs (internal pudendal, rectal). The two join as the common iliac vein in front of the sacroiliac joint. The two common iliacs form the inferior vena cava at L5. The left common iliac vein is pinched by the right common iliac artery crossing over it. That is why deep vein thrombosis is more common in the left leg (May–Thurner syndrome). Each tributary group has its own shade of blue; arteries and bones are faded.",
    "zh": "下肢和盆部血液经髂静脉系统回心。髂外静脉续于股静脉；髂内静脉收集盆壁（臀、闭孔、骶）和盆腔脏器（阴部内、直肠）的血液。二者在骶髂关节前方合成髂总静脉，两侧髂总静脉在L5平面汇成下腔静脉。左髂总静脉受右髂总动脉跨越压迫，故左下肢深静脉血栓更常见（May–Thurner综合征）。每组属支一种蓝色调，动脉和骨骼淡化。"
  },
  "frameGroups": [
    "chung",
    "ngoai",
    "trong",
    "thanh",
    "tang"
  ],
  "fadedGroups": [
    "dm",
    "xuong"
  ],
  "groups": [
    {
      "key": "chung",
      "name": {
        "vi": "Tĩnh mạch chậu chung và cùng giữa",
        "en": "Common iliac and median sacral veins",
        "zh": "髂总静脉与骶正中静脉"
      },
      "latin": "Vv. iliacae communes · V. sacralis mediana",
      "note": {
        "vi": "Tĩnh mạch chủ dưới nằm bên phải động mạch chủ. Vì thế tĩnh mạch chậu chung trái dài hơn và phải băng qua đường giữa.",
        "en": "The inferior vena cava lies to the right of the aorta, so the left common iliac vein is longer and must cross the midline.",
        "zh": "下腔静脉位于主动脉右侧，故左髂总静脉较长且须跨越中线。"
      },
      "tint": "#34597a",
      "parts": [
        "FJ3465",
        "FJ3541",
        "FJ3566"
      ]
    },
    {
      "key": "ngoai",
      "name": {
        "vi": "Tĩnh mạch chậu ngoài và thượng vị dưới",
        "en": "External iliac and inferior epigastric veins",
        "zh": "髂外静脉与腹壁下静脉"
      },
      "latin": "V. iliaca externa · V. epigastrica inferior",
      "note": {
        "vi": "Chạy dọc bờ chậu hông, nằm trong động mạch. Tĩnh mạch thượng vị dưới đổ vào ngay trên dây chằng bẹn.",
        "en": "Runs along the pelvic brim medial to the artery. The inferior epigastric vein joins it just above the inguinal ligament.",
        "zh": "沿骨盆上口行于动脉内侧。腹壁下静脉在腹股沟韧带稍上方注入。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3484",
        "FJ3512",
        "FJ3522",
        "FJ3523",
        "FJ3524",
        "FJ3568",
        "FJ3605"
      ]
    },
    {
      "key": "trong",
      "name": {
        "vi": "Tĩnh mạch chậu trong",
        "en": "Internal iliac vein",
        "zh": "髂内静脉"
      },
      "latin": "V. iliaca interna",
      "note": {
        "vi": "Thân ngắn nằm sâu trong chậu hông, sau trong động mạch cùng tên. Các nhánh của nó nối rộng với nhau thành đám rối quanh tạng.",
        "en": "A short trunk deep in the pelvis, posteromedial to its artery; its tributaries interconnect widely as plexuses around the organs.",
        "zh": "短干，深居盆内，位于同名动脉后内侧；其属支在脏器周围广泛吻合成丛。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ3469",
        "FJ3470",
        "FJ3471",
        "FJ3570",
        "FJ3571",
        "FJ3572",
        "FJ3607",
        "FJ3608",
        "FJ3609"
      ]
    },
    {
      "key": "thanh",
      "name": {
        "vi": "Nhánh thành: mông, bịt, cùng ngoài, chậu–thắt lưng",
        "en": "Parietal tributaries: gluteal, obturator, lateral sacral, iliolumbar",
        "zh": "壁支：臀、闭孔、骶外侧、髂腰静脉"
      },
      "latin": "Vv. gluteae, obturatoria, sacrales laterales, iliolumbalis",
      "note": {
        "vi": "Tĩnh mạch mông trên và dưới đi qua lỗ trên và dưới cơ hình lê. Tĩnh mạch bịt đi qua ống bịt.",
        "en": "The superior and inferior gluteal veins pass above and below piriformis; the obturator vein passes through the obturator canal.",
        "zh": "臀上、下静脉分别经梨状肌上、下孔；闭孔静脉经闭膜管。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ3510",
        "FJ3513",
        "FJ3526",
        "FJ3527",
        "FJ3531",
        "FJ3603",
        "FJ3606",
        "FJ3611",
        "FJ3612",
        "FJ3616"
      ]
    },
    {
      "key": "tang",
      "name": {
        "vi": "Nhánh tạng: thẹn trong, trực tràng trên",
        "en": "Visceral tributaries: internal pudendal, superior rectal",
        "zh": "脏支：阴部内静脉、直肠上静脉"
      },
      "latin": "V. pudenda interna · V. rectalis superior",
      "note": {
        "vi": "Tĩnh mạch trực tràng trên đổ về tĩnh mạch mạc treo tràng dưới (hệ cửa). Tĩnh mạch trực tràng giữa và dưới đổ về hệ chủ. Vì thế trực tràng là một vòng nối cửa–chủ; tăng áp cửa làm giãn các tĩnh mạch này.",
        "en": "The superior rectal vein drains to the inferior mesenteric (portal system), while the middle and inferior rectal veins drain to the caval system. So the rectum is a portocaval anastomosis, and portal hypertension dilates these veins.",
        "zh": "直肠上静脉汇入肠系膜下静脉（门静脉系），直肠中、下静脉汇入腔静脉系，故直肠为门腔吻合部位，门静脉高压时这些静脉扩张。"
      },
      "tint": "#4a7a8c",
      "parts": [
        "FJ3525",
        "FJ3610",
        "FJ3657"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch chậu (mờ sẵn — đối chiếu)",
        "en": "Iliac arteries (faded — for comparison)",
        "zh": "髂动脉（淡化——对照）"
      },
      "latin": "Aa. iliacae communes, internae, externae",
      "note": {
        "vi": "Bỏ mờ để thấy động mạch chậu chung phải băng ngang trước tĩnh mạch chậu chung trái.",
        "en": "Unfade to see the right common iliac artery crossing in front of the left common iliac vein.",
        "zh": "取消淡化可见右髂总动脉跨越左髂总静脉前方。"
      },
      "tint": "#d99a8f",
      "parts": [
        "FJ3464",
        "FJ3466",
        "FJ3468",
        "FJ3565",
        "FJ3567",
        "FJ3569"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chậu, cùng, L5 (mốc)",
        "en": "Pelvic bones and L5 (landmarks)",
        "zh": "骨盆骨与L5（标志）"
      },
      "latin": "Os sacrum · Ossa coxae · L5",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3152",
        "FJ3168",
        "FJ3288",
        "FJ3393"
      ]
    }
  ]
});
