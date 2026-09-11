/**
 * Scene "Hầu và thanh quản" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu niêm mạc hầu, amidan và vòi tai.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const pharynxLarynxScene: AtlasSceneDef = {
  "slug": "hau-thanh-quan",
  "title": {
    "vi": "Cơ hầu và thanh quản",
    "en": "The Pharynx and Larynx",
    "zh": "咽肌与喉"
  },
  "latin": "Pharynx · Larynx",
  "intro": {
    "vi": "Hầu là ống cơ dài khoảng 12cm, từ nền sọ tới ngang C6, sau mũi, miệng và thanh quản. Thành hầu có hai lớp cơ. Lớp vòng gồm ba cơ khít hầu trên, giữa, dưới, lồng vào nhau như ba cái cốc, bám vào đường đan giữa phía sau. Lớp dọc gồm cơ trâm–hầu, khẩu cái–hầu, vòi–hầu, nâng hầu lên khi nuốt. Thanh quản nằm trước hầu dưới, là khung sụn bảo vệ đường thở và phát âm. Mỗi lớp một tông màu; sụn thanh quản xanh nhạt; cột sống cổ mờ sẵn.",
    "en": "The pharynx is a muscular tube about 12cm long, from the skull base to C6, behind the nose, mouth and larynx. Its wall has two muscle layers. The circular layer is the superior, middle and inferior constrictors, stacked like three cups and meeting at the midline raphe behind. The longitudinal layer is stylopharyngeus, palatopharyngeus and salpingopharyngeus, which raise the pharynx in swallowing. The larynx lies in front of the lower pharynx, a cartilage frame that guards the airway and makes voice. Each layer has its own colour family; laryngeal cartilages are pale blue; the cervical spine is faded.",
    "zh": "咽是长约12cm的肌性管道，自颅底至C6平面，位于鼻、口、喉的后方。咽壁有两层肌：环行层为上、中、下咽缩肌，如三只杯子套叠，后方止于正中咽缝；纵行层为茎突咽肌、腭咽肌、咽鼓管咽肌，吞咽时上提咽。喉位于咽下部前方，是保护气道和发音的软骨支架。每层一种色系；喉软骨浅蓝；颈椎淡化。"
  },
  "frameGroups": [
    "khit",
    "doc",
    "sun",
    "noi-tai"
  ],
  "fadedGroups": [
    "cot-song"
  ],
  "groups": [
    {
      "key": "khit",
      "name": {
        "vi": "Ba cơ khít hầu (lớp vòng)",
        "en": "The three constrictors (circular layer)",
        "zh": "三块咽缩肌（环行层）"
      },
      "latin": "Mm. constrictores pharyngis superior, medius, inferior",
      "note": {
        "vi": "Co lần lượt từ trên xuống, đẩy viên thức ăn vào thực quản. Giữa phần chéo và phần ngang của cơ khít dưới có vùng yếu (tam giác Killian); túi thừa Zenker phồng ra ở đây.",
        "en": "They contract in sequence from above down, driving the bolus into the oesophagus. Between the oblique and transverse parts of the inferior constrictor is a weak area (Killian's triangle), where a Zenker's diverticulum bulges out.",
        "zh": "自上而下依次收缩，将食团推入食管。咽下缩肌斜部与横部之间有薄弱区（Killian三角），Zenker憩室由此膨出。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ2740",
        "FJ2742",
        "FJ2747",
        "FJ2752",
        "FJ2754",
        "FJ2759"
      ]
    },
    {
      "key": "doc",
      "name": {
        "vi": "Cơ dọc hầu",
        "en": "Longitudinal muscles",
        "zh": "咽纵行肌"
      },
      "latin": "Mm. stylopharyngeus, palatopharyngeus, salpingopharyngeus",
      "note": {
        "vi": "Cơ trâm–hầu là cơ duy nhất do dây IX chi phối, chui giữa cơ khít trên và khít giữa.",
        "en": "Stylopharyngeus is the only muscle supplied by nerve IX; it slips in between the superior and middle constrictors.",
        "zh": "茎突咽肌是唯一受舌咽神经支配的肌肉，穿行于咽上缩肌与咽中缩肌之间。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ2743",
        "FJ2745",
        "FJ2746",
        "FJ2755",
        "FJ2757",
        "FJ2758"
      ]
    },
    {
      "key": "dan",
      "name": {
        "vi": "Đường đan hầu và đường đan chân bướm–hàm",
        "en": "Pharyngeal and pterygomandibular raphes",
        "zh": "咽缝与翼下颌缝"
      },
      "latin": "Raphe pharyngis · Raphe pterygomandibularis",
      "note": {
        "vi": "Đường đan chân bướm–hàm nối cơ khít trên với cơ mút; đây là mốc gây tê thần kinh răng dưới.",
        "en": "The pterygomandibular raphe joins the superior constrictor to buccinator — the landmark for an inferior alveolar nerve block.",
        "zh": "翼下颌缝连接咽上缩肌与颊肌，是下牙槽神经阻滞麻醉的标志。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ2744",
        "FJ2749",
        "FJ2756",
        "FJ2763",
        "FJ2764"
      ]
    },
    {
      "key": "sun",
      "name": {
        "vi": "Sụn thanh quản và xương móng",
        "en": "Laryngeal cartilages and hyoid",
        "zh": "喉软骨与舌骨"
      },
      "latin": "Cartilagines laryngis · Os hyoideum",
      "note": {
        "vi": "Sụn giáp (lồi thanh quản, “trái cổ”), sụn nhẫn (vòng kín duy nhất của đường thở), nắp thanh môn, hai sụn phễu. Mở màng nhẫn–giáp là đường thở cấp cứu nhanh nhất.",
        "en": "Thyroid cartilage (the laryngeal prominence, “Adam's apple”), cricoid (the only complete ring of the airway), epiglottis and the two arytenoids. Opening the cricothyroid membrane is the fastest emergency airway.",
        "zh": "甲状软骨（喉结）、环状软骨（气道唯一完整的环）、会厌和两块杓状软骨。环甲膜切开是最快的紧急气道。"
      },
      "tint": "#a8d0e6",
      "parts": [
        "FJ2440",
        "FJ2770",
        "FJ2772",
        "FJ2773",
        "FJ2775",
        "FJ2776",
        "FJ2792",
        "FJ2793",
        "FJ2795",
        "FJ2808"
      ]
    },
    {
      "key": "noi-tai",
      "name": {
        "vi": "Cơ nội tại thanh quản",
        "en": "Intrinsic laryngeal muscles",
        "zh": "喉内肌"
      },
      "latin": "Mm. laryngis",
      "note": {
        "vi": "Cơ nhẫn–phễu sau là cơ duy nhất mở thanh môn. Liệt cả hai dây thanh quản quặt ngược làm hai dây thanh khép, gây khó thở cấp.",
        "en": "Posterior crico-arytenoid is the only muscle that opens the glottis. Bilateral recurrent laryngeal palsy leaves the cords closed and causes acute breathlessness.",
        "zh": "环杓后肌是唯一开大声门的肌肉。双侧喉返神经麻痹致声带闭合，引起急性呼吸困难。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2774",
        "FJ2778",
        "FJ2780",
        "FJ2781",
        "FJ2782",
        "FJ2783",
        "FJ2784",
        "FJ2785",
        "FJ2788",
        "FJ2791",
        "FJ2796",
        "FJ2798",
        "FJ2799",
        "FJ2800",
        "FJ2801",
        "FJ2802",
        "FJ2803",
        "FJ2806",
        "FJ2809"
      ]
    },
    {
      "key": "day",
      "name": {
        "vi": "Màng và dây chằng thanh quản",
        "en": "Laryngeal membranes and ligaments",
        "zh": "喉的膜与韧带"
      },
      "latin": "Membrana thyrohyoidea · Conus elasticus · Lig. vocale",
      "note": {
        "vi": "Dây chằng thanh âm là bờ trên tự do của nón đàn hồi, làm lõi dây thanh.",
        "en": "The vocal ligament is the free upper edge of the conus elasticus and the core of the vocal cord.",
        "zh": "声韧带是弹性圆锥的游离上缘，为声带的核心。"
      },
      "tint": "#d9cfb8",
      "parts": [
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
      "key": "cot-song",
      "name": {
        "vi": "Cột sống cổ (mốc)",
        "en": "Cervical spine (landmark)",
        "zh": "颈椎（标志）"
      },
      "latin": "Vertebrae cervicales",
      "note": {
        "vi": "Mờ sẵn — hầu nằm ngay trước thân đốt C1–C6.",
        "en": "Faded — the pharynx lies directly in front of C1–C6.",
        "zh": "淡化——咽紧贴C1–C6椎体前方。"
      },
      "parts": [
        "FJ3161",
        "FJ3164",
        "FJ3167",
        "FJ3170",
        "FJ3176",
        "FJ3177"
      ]
    }
  ]
};
