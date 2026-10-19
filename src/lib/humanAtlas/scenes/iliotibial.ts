
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Dải chậu chày và vùng đùi ngoài" (bên trái) dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu cân đùi, túi hoạt dịch mấu chuyển, thần kinh mông trên.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-iliotibial.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const iliotibialScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/iliotibial.ts#iliotibialScene", {
  "slug": "dai-chau-chay",
  "title": {
    "vi": "Dải chậu chày và vùng đùi ngoài",
    "en": "Iliotibial Band and Lateral Thigh",
    "zh": "髂胫束与大腿外侧"
  },
  "latin": "Tractus iliotibialis",
  "intro": {
    "vi": "Dải chậu chày là phần dày lên của cân đùi ở mặt ngoài, căng từ mào chậu tới lồi củ Gerdy ở xương chày. Hai cơ \"căng\" nó từ trên: cơ căng mạc đùi phía trước và cơ mông lớn phía sau. Dải này giữ vững gối và hông khi đứng một chân; cọ xát lên lồi cầu ngoài xương đùi gây hội chứng dải chậu chày ở người chạy bộ. Bộ dữ liệu không có cân đùi và túi hoạt dịch; xương mờ sẵn.",
    "en": "The iliotibial band is the thickened lateral part of the fascia lata, running from the iliac crest to Gerdy's tubercle on the tibia. Two muscles tension it from above: tensor fasciae latae in front and gluteus maximus behind. It stabilises the hip and knee in single-leg stance; friction over the lateral femoral condyle causes iliotibial band syndrome in runners. The dataset lacks the fascia lata and bursae; bones are faded.",
    "zh": "髂胫束是阔筋膜外侧的增厚部分，自髂嵴延至胫骨Gerdy结节。两块肌肉从上方牵张它：前方的阔筋膜张肌和后方的臀大肌。单腿站立时稳定髋、膝关节；在股骨外侧髁上反复摩擦导致跑步者的髂胫束综合征。数据集中无阔筋膜和滑囊；骨骼淡化。"
  },
  "frameGroups": [
    "dai-chau-chay",
    "cang-mac-dui",
    "mong-lon",
    "mong-nho-be",
    "hinh-le",
    "rong-ngoai",
    "nhi-dau-dui"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "dai-chau-chay",
      "name": {
        "vi": "Dải chậu chày",
        "en": "Iliotibial tract",
        "zh": "髂胫束"
      },
      "latin": "Tractus iliotibialis",
      "note": {
        "vi": "Dải xơ dày ở mặt ngoài đùi. Khi gối gập khoảng 30° nó trượt qua lồi cầu ngoài xương đùi — điểm đau của hội chứng dải chậu chày. Là mảnh ghép hay dùng để tái tạo dây chằng.",
        "en": "A thick fibrous band along the outer thigh. At about 30° of knee flexion it slides over the lateral femoral condyle — the pain point of iliotibial band syndrome. It is a common graft source for ligament reconstruction.",
        "zh": "大腿外侧的厚纤维带。膝关节屈曲约30°时滑过股骨外侧髁——即髂胫束综合征的疼痛点。常用作韧带重建的移植材料。"
      },
      "tint": "#e8e0c0",
      "parts": [
        "FJ1423M"
      ]
    },
    {
      "key": "cang-mac-dui",
      "name": {
        "vi": "Cơ căng mạc đùi",
        "en": "Tensor fasciae latae",
        "zh": "阔筋膜张肌"
      },
      "latin": "M. tensor fasciae latae",
      "note": {
        "vi": "Từ gai chậu trước trên, bám vào dải chậu chày. Gấp, dạng, xoay trong hông và căng dải — hỗ trợ giữ gối duỗi thẳng khi đứng. (Atlas xếp cơ này vào hệ mô liên kết.)",
        "en": "From the anterior superior iliac spine into the iliotibial band. It flexes, abducts and medially rotates the hip and tensions the band — helping lock the extended knee when standing. (The atlas files it under connective tissue.)",
        "zh": "起自髂前上棘，止于髂胫束。屈、外展、内旋髋关节并紧张髂胫束——协助站立时维持膝关节伸直。（图谱将其归入结缔组织。）"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1438M"
      ]
    },
    {
      "key": "mong-lon",
      "name": {
        "vi": "Cơ mông lớn",
        "en": "Gluteus maximus",
        "zh": "臀大肌"
      },
      "latin": "M. gluteus maximus",
      "note": {
        "vi": "Khoảng 3/4 thớ cơ bám vào dải chậu chày chứ không vào xương đùi. Túi hoạt dịch mấu chuyển nằm giữa cơ và mấu chuyển lớn — viêm gây đau mặt ngoài hông khi nằm nghiêng (không có trong dữ liệu).",
        "en": "About three-quarters of its fibres insert into the iliotibial band rather than the femur. The trochanteric bursa lies between the muscle and the greater trochanter — its inflammation causes lateral hip pain when lying on that side (not in this data).",
        "zh": "约3/4的肌纤维止于髂胫束而非股骨。转子囊位于该肌与大转子之间——发炎时侧卧引起髋外侧疼痛（数据中无此结构）。"
      },
      "tint": "#8f2f3a",
      "parts": [
        "FJ1418M"
      ]
    },
    {
      "key": "mong-nho-be",
      "name": {
        "vi": "Cơ mông nhỡ và mông bé",
        "en": "Gluteus medius and minimus",
        "zh": "臀中肌与臀小肌"
      },
      "latin": "Mm. glutei medius et minimus",
      "note": {
        "vi": "Bám mấu chuyển lớn, dạng hông và giữ khung chậu thăng bằng. Rách gân mông nhỡ ở người lớn tuổi là nguyên nhân hay bị bỏ sót của đau hông ngoài.",
        "en": "Insert on the greater trochanter, abducting the hip and keeping the pelvis level. A gluteus medius tendon tear in older adults is an often-missed cause of lateral hip pain.",
        "zh": "止于大转子，外展髋关节并维持骨盆水平。老年人臀中肌腱撕裂是髋外侧疼痛常被忽视的原因。"
      },
      "tint": "#b8434f",
      "parts": [
        "FJ1419M",
        "FJ1420M"
      ]
    },
    {
      "key": "hinh-le",
      "name": {
        "vi": "Cơ hình lê",
        "en": "Piriformis",
        "zh": "梨状肌"
      },
      "latin": "M. piriformis",
      "note": {
        "vi": "Từ mặt trước xương cùng qua khuyết ngồi lớn tới mấu chuyển lớn, chia khuyết thành trên và dưới cơ hình lê — mốc tìm mạch và thần kinh mông.",
        "en": "From the front of the sacrum through the greater sciatic notch to the greater trochanter, splitting the notch into supra- and infrapiriform spaces — the landmark for the gluteal vessels and nerves.",
        "zh": "自骶骨前面经坐骨大孔至大转子，将坐骨大孔分为梨状肌上孔和下孔——寻找臀部血管神经的标志。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ1428M"
      ]
    },
    {
      "key": "rong-ngoai",
      "name": {
        "vi": "Cơ rộng ngoài",
        "en": "Vastus lateralis",
        "zh": "股外侧肌"
      },
      "latin": "M. vastus lateralis",
      "note": {
        "vi": "Phần lớn nhất của cơ tứ đầu, nằm ngay dưới dải chậu chày. Là vị trí tiêm bắp an toàn ở trẻ nhỏ (1/3 giữa mặt ngoài đùi) vì xa mạch và thần kinh lớn.",
        "en": "The largest part of the quadriceps, lying just beneath the iliotibial band. It is the safe intramuscular injection site in infants (middle third of the outer thigh) because it is away from large vessels and nerves.",
        "zh": "股四头肌最大的部分，位于髂胫束深面。是婴幼儿安全的肌内注射部位（大腿外侧中1/3），因远离大血管和神经。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ1442M"
      ]
    },
    {
      "key": "nhi-dau-dui",
      "name": {
        "vi": "Cơ nhị đầu đùi",
        "en": "Biceps femoris",
        "zh": "股二头肌"
      },
      "latin": "M. biceps femoris",
      "note": {
        "vi": "Ranh giới sau của vùng đùi ngoài, bám chỏm xương mác. Thần kinh mác chung chạy dọc bờ trong gân cơ này rồi vòng quanh cổ xương mác — dễ bị tổn thương khi gãy cổ xương mác.",
        "en": "The posterior border of the lateral thigh, inserting on the head of the fibula. The common fibular nerve runs along its medial edge and winds around the fibular neck — easily injured in a fibular neck fracture.",
        "zh": "大腿外侧区的后界，止于腓骨头。腓总神经沿其肌腱内侧缘下行并绕腓骨颈——腓骨颈骨折时易受损。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1395M",
        "FJ1444M"
      ]
    },
    {
      "key": "dm-mu-dui",
      "name": {
        "vi": "Động mạch mũ đùi ngoài",
        "en": "Lateral circumflex femoral artery",
        "zh": "旋股外侧动脉"
      },
      "latin": "A. circumflexa femoris lateralis, ramus descendens",
      "note": {
        "vi": "Nhánh xuống chạy giữa cơ thẳng đùi và rộng ngoài — là cuống mạch của vạt đùi trước ngoài (ALT flap), vạt tự do dùng nhiều nhất trong tạo hình.",
        "en": "Its descending branch runs between rectus femoris and vastus lateralis — the pedicle of the anterolateral thigh (ALT) flap, the most widely used free flap in reconstructive surgery.",
        "zh": "其降支行于股直肌与股外侧肌之间——是股前外侧皮瓣（ALT皮瓣）的血管蒂，整形外科最常用的游离皮瓣。"
      },
      "tint": "#e07a6a",
      "parts": [
        "FJ2063",
        "FJ2078"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương (mốc)",
        "en": "Bones (landmarks)",
        "zh": "骨（标志）"
      },
      "latin": "Os coxae · Femur · Tibia · Fibula",
      "note": {
        "vi": "Xương chậu, đùi, chày, mác — mờ sẵn để thấy dải căng từ mào chậu tới lồi củ Gerdy.",
        "en": "Hip bone, femur, tibia, fibula — faded to show the band running from the iliac crest to Gerdy's tubercle.",
        "zh": "髋骨、股骨、胫骨、腓骨——淡化以显示髂胫束自髂嵴至Gerdy结节的走行。"
      },
      "parts": [
        "FJ3259",
        "FJ3260",
        "FJ3275",
        "FJ3282",
        "FJ3288"
      ]
    }
  ]
});
