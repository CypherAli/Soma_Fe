/**
 * Scene "Cơ thắt lưng–chậu" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Ống sống thắt lưng" cũ: atlas không có tủy, chùm đuôi ngựa, dây chằng vàng. Thiếu cơ thắt lưng bé, cơ vuông thắt lưng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const iliopsoasScene: AtlasSceneDef = {
  "slug": "ong-song-that-lung",
  "title": {
    "vi": "Cơ thắt lưng–chậu",
    "en": "The Iliopsoas",
    "zh": "髂腰肌"
  },
  "latin": "M. iliopsoas",
  "system": "muscular",
  "intro": {
    "vi": "Cơ thắt lưng–chậu là cầu nối duy nhất bằng cơ giữa cột sống và chi dưới. Cơ thắt lưng lớn đi từ thân và mỏm ngang T12–L5, chạy dọc bờ chậu hông. Cơ chậu phủ hố chậu. Hai cơ chung gân chui dưới dây chằng bẹn, bám mấu chuyển bé xương đùi. Đây là cơ gấp hông mạnh nhất. Ổ áp xe cạnh cột sống có thể lan theo bao cơ thắt lưng xuống tận bẹn. Động mạch và tĩnh mạch chậu ngoài chạy dọc bờ trong cơ thắt lưng. Bộ dữ liệu không có cơ thắt lưng bé và cơ vuông thắt lưng.",
    "en": "The iliopsoas is the only muscular bridge between the spine and the lower limb. Psoas major arises from the bodies and transverse processes of T12–L5 and runs along the pelvic brim. Iliacus fills the iliac fossa. They share a tendon that passes under the inguinal ligament to the lesser trochanter. This is the strongest hip flexor. A paraspinal abscess can track down inside the psoas sheath as far as the groin. The external iliac artery and vein run along the medial border of psoas. The dataset has no psoas minor or quadratus lumborum.",
    "zh": "髂腰肌是脊柱与下肢之间唯一的肌性桥梁。腰大肌起于T12–L5椎体和横突，沿骨盆上口下行；髂肌占据髂窝。二肌共腱经腹股沟韧带下方止于股骨小转子，是最强的屈髋肌。脊柱旁脓肿可沿腰大肌鞘下行至腹股沟。髂外动静脉沿腰大肌内侧缘走行。数据集中无腰小肌和腰方肌。"
  },
  "frameGroups": [
    "that-lung",
    "chau",
    "xuong"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "that-lung",
      "name": {
        "vi": "Cơ thắt lưng lớn",
        "en": "Psoas major",
        "zh": "腰大肌"
      },
      "latin": "M. psoas major",
      "note": {
        "vi": "Đám rối thắt lưng nằm ngay trong khối cơ này, nên cơ co cứng có thể kích thích dây đùi. Khi ngồi dậy từ tư thế nằm, cơ kéo cột sống thắt lưng ưỡn ra trước.",
        "en": "The lumbar plexus lies within this muscle, so spasm can irritate the femoral nerve. When sitting up from lying, it pulls the lumbar spine forward into lordosis.",
        "zh": "腰丛位于此肌内部，痉挛可刺激股神经。从卧位坐起时它将腰椎拉向前方。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1431",
        "FJ1431M"
      ]
    },
    {
      "key": "chau",
      "name": {
        "vi": "Cơ chậu",
        "en": "Iliacus",
        "zh": "髂肌"
      },
      "latin": "M. iliacus",
      "note": {
        "vi": "Hình quạt phủ hố chậu, hội vào bờ ngoài gân cơ thắt lưng. Máu tụ trong cơ chậu (ở người dùng thuốc chống đông) có thể chèn dây đùi.",
        "en": "Fan-shaped, filling the iliac fossa and joining the lateral side of the psoas tendon. A haematoma in iliacus (in anticoagulated patients) can compress the femoral nerve.",
        "zh": "扇形，占据髂窝，并入腰大肌腱外侧。髂肌内血肿（抗凝患者）可压迫股神经。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1422",
        "FJ1422M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch chậu chung và chậu ngoài",
        "en": "Common and external iliac arteries",
        "zh": "髂总动脉与髂外动脉"
      },
      "latin": "Aa. iliacae communes et externae",
      "note": {
        "vi": "Chạy dọc bờ trong cơ thắt lưng lớn tới dây chằng bẹn.",
        "en": "Run along the medial border of psoas major to the inguinal ligament.",
        "zh": "沿腰大肌内侧缘下行至腹股沟韧带。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ3464",
        "FJ3466",
        "FJ3565",
        "FJ3567"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch chậu chung và chậu ngoài",
        "en": "Common and external iliac veins",
        "zh": "髂总静脉与髂外静脉"
      },
      "latin": "Vv. iliacae communes et externae",
      "note": {
        "vi": "Nằm sau trong động mạch cùng tên.",
        "en": "Lie posteromedial to the arteries of the same name.",
        "zh": "位于同名动脉的后内侧。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3465",
        "FJ3484",
        "FJ3522",
        "FJ3523",
        "FJ3524",
        "FJ3566",
        "FJ3568"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Cột sống thắt lưng, xương chậu, đùi (mốc)",
        "en": "Lumbar spine, hip bones, femora (landmarks)",
        "zh": "腰椎、髋骨、股骨（标志）"
      },
      "latin": "Vertebrae lumbales · Os coxae · Femur",
      "note": {
        "vi": "Mờ sẵn — thấy nguyên uỷ ở thân và mỏm ngang đốt sống và chỗ bám ở mấu chuyển bé.",
        "en": "Faded — showing the origin from the vertebral bodies and transverse processes and the insertion on the lesser trochanter.",
        "zh": "淡化——显示起于椎体和横突、止于小转子。"
      },
      "parts": [
        "FJ3152",
        "FJ3156",
        "FJ3157",
        "FJ3159",
        "FJ3162",
        "FJ3165",
        "FJ3168",
        "FJ3288",
        "FJ3393",
        "FJ3259",
        "FJ3365"
      ]
    }
  ]
};
