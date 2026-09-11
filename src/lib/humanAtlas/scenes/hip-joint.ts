/**
 * Scene "Khớp hông" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu bao khớp, dây chằng chậu–đùi, sụn viền ổ cối.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const hipJointScene: AtlasSceneDef = {
  "slug": "khop-hang",
  "title": {
    "vi": "Khớp hông: xương và cơ vận động",
    "en": "The Hip Joint: Bones and Movers",
    "zh": "髋关节：骨与运动肌"
  },
  "latin": "Articulatio coxae",
  "intro": {
    "vi": "Khớp hông là khớp chỏm–ổ sâu: chỏm xương đùi nằm gọn trong ổ cối, nên vững hơn khớp vai rất nhiều nhưng kém linh động hơn. Scene chia cơ theo động tác. Gấp là cơ thắt lưng–chậu. Duỗi và dạng là các cơ mông. Xoay ngoài là các cơ chậu hông–mấu chuyển ngắn: hình lê, sinh đôi, bịt, vuông đùi. Máu nuôi chỏm đi chủ yếu qua các nhánh mũ đùi dọc cổ xương đùi. Bộ dữ liệu không có bao khớp và dây chằng.",
    "en": "The hip is a deep ball-and-socket joint: the femoral head sits snugly in the acetabulum, so it is far more stable than the shoulder but less mobile. The scene groups muscles by action. Flexion is iliopsoas. Extension and abduction are the gluteals. Lateral rotation is the short pelvitrochanteric muscles: piriformis, gemelli, obturators and quadratus femoris. Blood reaches the femoral head mainly through circumflex branches along the neck. The dataset has no capsule or ligaments.",
    "zh": "髋关节为深的球窝关节，股骨头嵌于髋臼内，远比肩关节稳定但灵活性较差。本场景按动作分组：屈为髂腰肌；伸和外展为臀肌；外旋为短的盆转子肌（梨状肌、上下孖肌、闭孔肌、股方肌）。股骨头血供主要经沿股骨颈的旋股动脉分支。数据集中无关节囊和韧带。"
  },
  "frameGroups": [
    "xuong",
    "gap",
    "mong",
    "xoay-ngoai"
  ],
  "groups": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chậu và xương đùi",
        "en": "Hip bone and femur",
        "zh": "髋骨与股骨"
      },
      "latin": "Os coxae · Femur",
      "note": {
        "vi": "Cổ xương đùi hợp với thân một góc khoảng 125°. Gãy cổ xương đùi ở người già có thể cắt đứt mạch nuôi chỏm, dẫn tới hoại tử chỏm. Vì vậy người già gãy cổ xương đùi thường được thay khớp.",
        "en": "The femoral neck meets the shaft at about 125°. A neck fracture in the elderly can cut the vessels to the head and cause avascular necrosis. That is why these fractures are often treated with joint replacement.",
        "zh": "股骨颈与股骨干约成125°。老年人股骨颈骨折可切断股骨头血供，导致缺血性坏死，故常行关节置换。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3259",
        "FJ3288"
      ]
    },
    {
      "key": "gap",
      "name": {
        "vi": "Gấp hông: cơ thắt lưng lớn và cơ chậu",
        "en": "Hip flexors: psoas major and iliacus",
        "zh": "屈髋肌：腰大肌与髂肌"
      },
      "latin": "M. iliopsoas",
      "note": {
        "vi": "Hai cơ chung một gân bám mấu chuyển bé. Đây là cơ gấp hông mạnh nhất, dùng khi leo cầu thang và ngồi dậy.",
        "en": "Share one tendon to the lesser trochanter — the strongest hip flexor, used in climbing stairs and sitting up.",
        "zh": "二肌共腱止于小转子，是最强的屈髋肌，用于爬楼梯和坐起。"
      },
      "tint": "#6f8fbf",
      "parts": [
        "FJ1422M",
        "FJ1431M"
      ]
    },
    {
      "key": "mong",
      "name": {
        "vi": "Duỗi và dạng: ba cơ mông",
        "en": "Extensors and abductors: the three gluteals",
        "zh": "伸肌与外展肌：三块臀肌"
      },
      "latin": "Mm. glutei maximus, medius, minimus",
      "note": {
        "vi": "Mông lớn duỗi hông mạnh khi đứng dậy, leo dốc. Mông nhỡ và mông bé dạng hông, giữ khung chậu thăng bằng khi đứng một chân. Yếu hai cơ này thì hông bên kia sụt xuống khi bước (dấu hiệu Trendelenburg).",
        "en": "Gluteus maximus powerfully extends the hip when rising or climbing. Gluteus medius and minimus abduct and keep the pelvis level on one leg. When they are weak, the opposite hip drops with each step (Trendelenburg sign).",
        "zh": "臀大肌在起立、登坡时有力伸髋。臀中肌和臀小肌外展髋并在单腿站立时维持骨盆水平；二者无力时行走对侧骨盆下沉（Trendelenburg征）。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1418M",
        "FJ1419M",
        "FJ1420M"
      ]
    },
    {
      "key": "xoay-ngoai",
      "name": {
        "vi": "Xoay ngoài: nhóm chậu hông–mấu chuyển",
        "en": "Lateral rotators: the pelvitrochanteric group",
        "zh": "外旋肌：盆转子肌群"
      },
      "latin": "Mm. piriformis, gemelli, obturatorii, quadratus femoris",
      "note": {
        "vi": "Từ trên xuống: hình lê, sinh đôi trên, bịt trong, sinh đôi dưới, vuông đùi; bịt ngoài nằm sâu phía trước. Chúng như chóp xoay của hông, ép chỏm vào ổ cối. Dây ngồi thoát ra dưới cơ hình lê.",
        "en": "From above down: piriformis, gemellus superior, obturator internus, gemellus inferior, quadratus femoris, with obturator externus deep in front. They act like a rotator cuff for the hip, pressing the head into the acetabulum. The sciatic nerve emerges below piriformis.",
        "zh": "自上而下：梨状肌、上孖肌、闭孔内肌、下孖肌、股方肌，闭孔外肌位于深前方。它们如同髋的“肩袖”，将股骨头压向髋臼。坐骨神经自梨状肌下缘穿出。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1416M",
        "FJ1417M",
        "FJ1425M",
        "FJ1426M",
        "FJ1428M",
        "FJ1432M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch đùi và mũ đùi ngoài",
        "en": "Femoral and lateral circumflex femoral arteries",
        "zh": "股动脉与旋股外侧动脉"
      },
      "latin": "A. circumflexa femoris lateralis · A. femoralis",
      "note": {
        "vi": "Các nhánh mũ đùi tạo vòng quanh cổ xương đùi, cho nhánh võng lên nuôi chỏm. Nhánh mũ đùi trong quan trọng nhất nhưng bộ dữ liệu chỉ có tĩnh mạch đi kèm của nó.",
        "en": "The circumflex femoral branches ring the femoral neck and send retinacular branches up to the head. The medial circumflex is the most important, but the dataset has only its companion vein.",
        "zh": "旋股动脉分支环绕股骨颈，发出支持带支上行供应股骨头。旋股内侧动脉最重要，但数据集中仅有其伴行静脉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2074",
        "FJ2078",
        "FJ2188",
        "FJ2189"
      ]
    }
  ]
};
