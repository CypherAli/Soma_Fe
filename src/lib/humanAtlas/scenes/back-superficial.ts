/**
 * Scene "Vùng lưng — lớp nông" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas KHÔNG có cơ lưng rộng và cân ngực–thắt lưng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const backSuperficialScene: AtlasSceneDef = {
  "slug": "vung-lung",
  "title": {
    "vi": "Vùng lưng: lớp cơ nông và trung gian",
    "en": "The Back: Superficial and Intermediate Muscles",
    "zh": "背部：浅层与中间层肌"
  },
  "latin": "Regio dorsalis",
  "intro": {
    "vi": "Cơ lưng chia ba lớp. Lớp nông nối chi trên với thân mình: cơ thang, cơ lưng rộng, cơ trám, cơ nâng vai. Chúng do dây thần kinh của chi trên (nhánh trước) chi phối, và dây XI cho riêng cơ thang. Lớp trung gian là hai cơ răng sau trên và dưới, bám vào xương sườn, phụ hô hấp. Lớp sâu là cơ lưng thật (xem bài Cơ lưng sâu). Scene dựng lớp nông và trung gian; mỗi cơ một màu; xương mờ sẵn. Bộ dữ liệu không có cơ lưng rộng, cơ lớn nhất vùng lưng.",
    "en": "The back muscles lie in three layers. The superficial layer ties the upper limb to the trunk: trapezius, latissimus dorsi, rhomboids and levator scapulae. They are supplied by nerves of the upper limb (anterior rami), with nerve XI for trapezius. The intermediate layer is serratus posterior superior and inferior, attached to the ribs, accessory to breathing. The deep layer is the true back muscles (see the Deep Back scene). The scene shows the superficial and intermediate layers, one colour per muscle, bones faded. The dataset lacks latissimus dorsi, the largest back muscle.",
    "zh": "背肌分三层：浅层连接上肢与躯干（斜方肌、背阔肌、菱形肌、肩胛提肌），受上肢神经（前支）支配，斜方肌由副神经支配；中间层为上、下后锯肌，附于肋骨，辅助呼吸；深层为固有背肌（见背深肌场景）。本场景显示浅层与中间层，每肌一种颜色，骨骼淡化。数据集中无背部最大的背阔肌。"
  },
  "frameGroups": [
    "thang",
    "tram",
    "rang-sau"
  ],
  "fadedGroups": [
    "xuong",
    "dung-song"
  ],
  "groups": [
    {
      "key": "thang",
      "name": {
        "vi": "Cơ thang (ba phần)",
        "en": "Trapezius (three parts)",
        "zh": "斜方肌（三部）"
      },
      "latin": "M. trapezius",
      "note": {
        "vi": "Hai cơ thang hai bên ghép thành hình thang, phủ gáy và lưng trên. Phần lên kéo xương vai xuống và cùng phần xuống xoay ổ chảo lên.",
        "en": "The two trapezii form a trapezoid over the nape and upper back. The ascending part depresses the scapula and, with the descending part, rotates the glenoid upward.",
        "zh": "两侧斜方肌合成斜方形，覆盖项部和上背。升部下降肩胛骨，并与降部共同使关节盂上旋。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1520",
        "FJ1520M",
        "FJ1521",
        "FJ1521M",
        "FJ1554",
        "FJ1554M"
      ]
    },
    {
      "key": "tram",
      "name": {
        "vi": "Cơ trám và cơ nâng vai",
        "en": "Rhomboids and levator scapulae",
        "zh": "菱形肌与肩胛提肌"
      },
      "latin": "Mm. rhomboidei · M. levator scapulae",
      "note": {
        "vi": "Nằm dưới cơ thang, do dây vai sau chi phối. Yếu cơ trám làm bờ trong xương vai tách khỏi lồng ngực khi đẩy tay.",
        "en": "Lie under trapezius and are supplied by the dorsal scapular nerve. Weak rhomboids let the medial border of the scapula lift off the chest when pushing.",
        "zh": "位于斜方肌深面，受肩胛背神经支配。菱形肌无力时推物肩胛骨内侧缘离开胸壁。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1532",
        "FJ1532M",
        "FJ1536",
        "FJ1536M",
        "FJ1537",
        "FJ1537M"
      ]
    },
    {
      "key": "tron-lon",
      "name": {
        "vi": "Cơ tròn lớn",
        "en": "Teres major",
        "zh": "大圆肌"
      },
      "latin": "M. teres major",
      "note": {
        "vi": "Được gọi là “trợ thủ của cơ lưng rộng”: cùng khép, duỗi, xoay trong cánh tay.",
        "en": "Called “latissimus's little helper”: it adducts, extends and medially rotates the arm with it.",
        "zh": "称为“背阔肌的助手”，协同内收、伸和内旋上臂。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1507",
        "FJ1507M"
      ]
    },
    {
      "key": "rang-sau",
      "name": {
        "vi": "Lớp trung gian: cơ răng sau trên và dưới",
        "en": "Intermediate layer: serratus posterior superior and inferior",
        "zh": "中间层：上、下后锯肌"
      },
      "latin": "Mm. serratus posterior superior et inferior",
      "note": {
        "vi": "Cơ mỏng bám xương sườn, do dây gian sườn chi phối. Răng sau trên được cho là nâng sườn, răng sau dưới hạ sườn; vai trò hô hấp nhỏ.",
        "en": "Thin muscles on the ribs, supplied by intercostal nerves. The superior is thought to raise the ribs and the inferior to lower them; their breathing role is small.",
        "zh": "附于肋骨的薄肌，受肋间神经支配。上后锯肌被认为提肋，下后锯肌降肋，呼吸作用甚小。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1541",
        "FJ1541M",
        "FJ1542",
        "FJ1542M"
      ]
    },
    {
      "key": "dung-song",
      "name": {
        "vi": "Cơ dựng sống (lớp sâu — mờ sẵn)",
        "en": "Erector spinae (deep layer — faded)",
        "zh": "竖脊肌（深层——淡化）"
      },
      "latin": "M. erector spinae",
      "note": {
        "vi": "Bỏ mờ để thấy lớp sâu nằm dưới hai lớp trên.",
        "en": "Unfade to see the deep layer beneath the two above.",
        "zh": "取消淡化可见上两层下方的深层。"
      },
      "tint": "#c9a79e",
      "parts": [
        "FJ1526",
        "FJ1526M",
        "FJ1527",
        "FJ1527M",
        "FJ1528",
        "FJ1528M",
        "FJ1534",
        "FJ1534M",
        "FJ1535",
        "FJ1535M",
        "FJ1543",
        "FJ1543M",
        "FJ1544",
        "FJ1544M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương vai, sườn, cột sống (mốc)",
        "en": "Scapulae, ribs, spine (landmarks)",
        "zh": "肩胛骨、肋骨、脊柱（标志）"
      },
      "latin": "Scapula · Costae · Columna vertebralis",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3279",
        "FJ3384",
        "FJ3154",
        "FJ3155",
        "FJ3156",
        "FJ3158",
        "FJ3160",
        "FJ3163",
        "FJ3166",
        "FJ3169",
        "FJ3171",
        "FJ3173",
        "FJ3174",
        "FJ3175",
        "FJ3225",
        "FJ3226",
        "FJ3227",
        "FJ3228",
        "FJ3229",
        "FJ3230",
        "FJ3231",
        "FJ3232",
        "FJ3233",
        "FJ3234",
        "FJ3235",
        "FJ3236",
        "FJ3330",
        "FJ3331",
        "FJ3332",
        "FJ3334",
        "FJ3336",
        "FJ3338",
        "FJ3340",
        "FJ3342",
        "FJ3344",
        "FJ3346",
        "FJ3347",
        "FJ3348"
      ]
    }
  ]
};
