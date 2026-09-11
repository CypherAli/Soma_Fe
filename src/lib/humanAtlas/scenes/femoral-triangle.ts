/**
 * Scene "Tam giác đùi" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chằng bẹn, bao đùi và dây đùi.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const femoralTriangleScene: AtlasSceneDef = {
  "slug": "tam-giac-dui",
  "title": {
    "vi": "Tam giác đùi",
    "en": "The Femoral Triangle",
    "zh": "股三角"
  },
  "latin": "Trigonum femorale",
  "intro": {
    "vi": "Tam giác đùi nằm ở mặt trước trên đùi, ngay dưới nếp bẹn. Đáy là dây chằng bẹn (không có trong bộ dữ liệu), bờ ngoài là cơ may, bờ trong là cơ khép dài. Nền hố gồm cơ thắt lưng–chậu ở ngoài và cơ lược ở trong. Trong tam giác, từ ngoài vào trong là dây đùi, động mạch đùi, tĩnh mạch đùi, rồi ống đùi. Sinh viên thường nhớ bằng chữ NAVY. Đây là chỗ bắt mạch đùi, đặt catheter tim và nơi thoát vị đùi. Tĩnh mạch hiển lớn đổ vào tĩnh mạch đùi tại đây.",
    "en": "The femoral triangle lies on the upper front of the thigh, just below the groin crease. Its base is the inguinal ligament (not in the dataset), its lateral border sartorius and its medial border adductor longus. The floor is iliopsoas laterally and pectineus medially. Inside, from lateral to medial, lie the femoral nerve, artery, vein and the femoral canal, remembered as NAVY. It is the site for the femoral pulse, cardiac catheter access and femoral hernia. The great saphenous vein joins the femoral vein here.",
    "zh": "股三角位于大腿前上部、腹股沟皱襞下方：底为腹股沟韧带（数据集中无），外侧界为缝匠肌，内侧界为长收肌；底由外侧的髂腰肌和内侧的耻骨肌构成。内容由外向内为股神经、股动脉、股静脉、股管，口诀NAVY。此处为触摸股动脉搏动、心导管穿刺及股疝的部位。大隐静脉在此注入股静脉。"
  },
  "frameGroups": [
    "bo",
    "nen",
    "dm",
    "tm"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "bo",
      "name": {
        "vi": "Hai bờ: cơ may và cơ khép dài",
        "en": "Borders: sartorius and adductor longus",
        "zh": "两界：缝匠肌与长收肌"
      },
      "latin": "M. sartorius · M. adductor longus",
      "note": {
        "vi": "Cơ may là cơ dài nhất cơ thể, chạy chéo từ gai chậu trước trên xuống mặt trong gối. Nó giúp ngồi xếp bằng: gấp, dạng, xoay ngoài hông và gấp gối.",
        "en": "Sartorius is the longest muscle in the body, running obliquely from the anterior superior iliac spine to the inner knee. It helps sit cross-legged: flexing, abducting and laterally rotating the hip and flexing the knee.",
        "zh": "缝匠肌是人体最长的肌肉，自髂前上棘斜向下至膝内侧，参与盘腿坐：屈、外展、外旋髋并屈膝。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1402M",
        "FJ1434M"
      ]
    },
    {
      "key": "nen",
      "name": {
        "vi": "Nền: cơ thắt lưng–chậu và cơ lược",
        "en": "Floor: iliopsoas and pectineus",
        "zh": "底：髂腰肌与耻骨肌"
      },
      "latin": "M. iliopsoas · M. pectineus",
      "note": {
        "vi": "Nền dốc như máng, lõm vào giữa, nên mạch đùi nằm sâu trong rãnh này.",
        "en": "The floor slopes like a gutter towards the middle, so the femoral vessels sit deep in the groove.",
        "zh": "底呈沟槽状向中间凹陷，股血管深居其中。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1422M",
        "FJ1427M",
        "FJ1431M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch đùi và nhánh",
        "en": "Femoral artery and branches",
        "zh": "股动脉及分支"
      },
      "latin": "A. femoralis · A. circumflexa femoris lateralis",
      "note": {
        "vi": "Tiếp nối động mạch chậu ngoài sau dây chằng bẹn, ở điểm giữa gai chậu trước trên và khớp mu. Đây là đường vào kinh điển để chụp mạch vành. Nó cho động mạch đùi sâu và các nhánh mũ đùi.",
        "en": "Continues the external iliac artery behind the inguinal ligament, at the midpoint between the anterior superior iliac spine and the pubic symphysis. This is the classic access route for coronary angiography. It gives the deep femoral and the circumflex femoral branches.",
        "zh": "在腹股沟韧带后方续于髂外动脉，位于髂前上棘与耻骨联合连线中点，是冠状动脉造影的经典入路。发出股深动脉和旋股动脉分支。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2074",
        "FJ2078",
        "FJ3466",
        "FJ3529"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch đùi và hiển lớn",
        "en": "Femoral and great saphenous veins",
        "zh": "股静脉与大隐静脉"
      },
      "latin": "V. femoralis · V. saphena magna",
      "note": {
        "vi": "Tĩnh mạch đùi nằm trong động mạch. Tĩnh mạch hiển lớn đổ vào nó qua lỗ tĩnh mạch hiển. Van ở chỗ nối này hỏng là nguyên nhân chính của giãn tĩnh mạch chi dưới.",
        "en": "The femoral vein lies medial to the artery. The great saphenous vein joins it through the saphenous opening; failure of the valve at this junction is the main cause of leg varicose veins.",
        "zh": "股静脉位于动脉内侧。大隐静脉经隐静脉裂孔注入，此处瓣膜功能不全是下肢静脉曲张的主要原因。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2099",
        "FJ2102",
        "FJ2122",
        "FJ2188",
        "FJ2189"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chậu và đùi (mốc)",
        "en": "Hip bone and femur (landmarks)",
        "zh": "髋骨与股骨（标志）"
      },
      "latin": "Os coxae · Femur",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3259",
        "FJ3288"
      ]
    }
  ]
};
