/**
 * Bài bộ phận "Đùi và mông — học theo lớp" học theo lớp — nhóm lấy từ thigh-muscles.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partThighScene: AtlasSceneDef = {
  "slug": "bo-phan-dui",
  "title": {
    "vi": "Đùi và mông — học theo lớp",
    "en": "Thigh and Buttock — Layer by Layer",
    "zh": "大腿与臀——分层学习"
  },
  "latin": "Femur · Regio glutealis",
  "system": "muscular",
  "intro": {
    "vi": "Mở ra là ba khoang cơ đùi quanh xương đùi; tắt bật từng khoang để học. Khoang trước là tứ đầu và cơ may, duỗi gối, do dây đùi chi phối. Khoang trong là nhóm khép, do dây bịt chi phối. Khoang sau là nhóm ụ ngồi–cẳng chân, gấp gối, do dây ngồi chi phối. Lớp Mông gồm ba cơ mông và nhóm xoay ngoài.",
    "en": "It opens on the three muscle compartments around the femur; switch them off and on one at a time. The anterior compartment is quadriceps and sartorius: they extend the knee, supplied by the femoral nerve. The medial compartment is the adductors, supplied by the obturator nerve. The posterior compartment is the hamstrings: they flex the knee, supplied by the sciatic nerve. The Gluteal layer holds the three gluteals and the lateral rotators.",
    "zh": "打开时显示股骨周围的三个肌群，请逐一关闭和开启：前群为股四头肌和缝匠肌，伸膝，受股神经支配；内侧群为内收肌群，受闭孔神经支配；后群为腘绳肌，屈膝，受坐骨神经支配。“臀部”层含三块臀肌和外旋肌群。"
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
        "xuong"
      ],
      "on": true
    },
    {
      "key": "mong",
      "name": {
        "vi": "Vùng mông",
        "en": "Gluteal region",
        "zh": "臀部"
      },
      "groups": [
        "mong-lon",
        "mong-nho-be",
        "xoay-ngoai"
      ]
    },
    {
      "key": "truoc",
      "name": {
        "vi": "Khoang trước",
        "en": "Anterior compartment",
        "zh": "前群"
      },
      "groups": [
        "tu-dau",
        "may-that-lung-chau"
      ],
      "on": true
    },
    {
      "key": "trong",
      "name": {
        "vi": "Khoang trong",
        "en": "Medial compartment",
        "zh": "内侧群"
      },
      "groups": [
        "khep"
      ],
      "on": true
    },
    {
      "key": "sau",
      "name": {
        "vi": "Khoang sau",
        "en": "Posterior compartment",
        "zh": "后群"
      },
      "groups": [
        "u-ngoi-cang"
      ],
      "on": true
    }
  ],
  "groups": [
    {
      "key": "mong-lon",
      "name": {
        "vi": "Cơ mông lớn",
        "en": "Gluteus maximus",
        "zh": "臀大肌"
      },
      "latin": "M. gluteus maximus",
      "note": {
        "vi": "Cơ lớn nhất cơ thể, duỗi hông khi leo dốc, đứng dậy, chạy — đi trên mặt phẳng hầu như không dùng tới. Tiêm bắp ở góc phần tư trên-ngoài mông để tránh thần kinh ngồi đi dưới cơ.",
        "en": "The largest muscle in the body, extending the hip when climbing, rising from a chair or running — barely used on level walking. Intramuscular injections go in the upper outer quadrant to avoid the sciatic nerve beneath it.",
        "zh": "人体最大的肌肉，在爬坡、起立、奔跑时伸髋——平地行走时几乎不参与。肌内注射选在臀部外上象限，以避开其深面的坐骨神经。"
      },
      "tint": "#8f2f3a",
      "parts": [
        "FJ1418M"
      ]
    },
    {
      "key": "mong-nho-be",
      "name": {
        "vi": "Cơ mông nhỡ, mông bé và căng mạc đùi",
        "en": "Gluteus medius, minimus and tensor fasciae latae",
        "zh": "臀中肌、臀小肌与阔筋膜张肌"
      },
      "latin": "Mm. glutei medius et minimus · M. tensor fasciae latae",
      "note": {
        "vi": "Dạng hông và giữ khung chậu không sụp về bên chân đang nhấc. Liệt (tổn thương thần kinh mông trên) gây dấu Trendelenburg: đứng một chân thì hông bên kia tụt xuống, đi lạch bạch.",
        "en": "Abduct the hip and stop the pelvis dropping toward the lifted leg. Their paralysis (superior gluteal nerve injury) gives the Trendelenburg sign: standing on one leg, the opposite hip sags, and the gait waddles.",
        "zh": "外展髋关节，并防止骨盆向抬起腿的一侧下沉。其麻痹（臀上神经损伤）出现Trendelenburg征：单腿站立时对侧髋部下沉，步态摇摆。"
      },
      "tint": "#b8434f",
      "parts": [
        "FJ1419M",
        "FJ1420M",
        "FJ1423M",
        "FJ1438M"
      ]
    },
    {
      "key": "xoay-ngoai",
      "name": {
        "vi": "Nhóm cơ xoay ngoài hông",
        "en": "Deep lateral rotators of the hip",
        "zh": "髋外旋肌群"
      },
      "latin": "Mm. rotatores externi",
      "note": {
        "vi": "Hình lê, sinh đôi trên/dưới, bịt trong/ngoài, vuông đùi. Cơ hình lê là mốc của vùng mông: thần kinh ngồi thường chui ra dưới bờ dưới cơ này — co thắt hình lê có thể chèn dây ngồi.",
        "en": "Piriformis, the gemelli, obturator internus and externus, quadratus femoris. Piriformis is the landmark of the gluteal region: the sciatic nerve usually emerges below its lower border — piriformis spasm can compress the nerve.",
        "zh": "梨状肌、上下孖肌、闭孔内肌和闭孔外肌、股方肌。梨状肌是臀区的标志：坐骨神经通常自其下缘穿出——梨状肌痉挛可压迫该神经。"
      },
      "tint": "#d98a2b",
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
      "key": "tu-dau",
      "name": {
        "vi": "Cơ tứ đầu đùi",
        "en": "Quadriceps femoris",
        "zh": "股四头肌"
      },
      "latin": "M. quadriceps femoris",
      "note": {
        "vi": "Thẳng đùi (vượt cả khớp hông) và ba cơ rộng ngoài, trong, giữa, hội tụ vào gân bánh chè — duỗi gối. Phản xạ gân bánh chè thử khoanh tuỷ L3–L4. Cơ rộng trong teo nhanh nhất sau chấn thương gối.",
        "en": "Rectus femoris (which also crosses the hip) and vastus lateralis, medialis and intermedius, converging on the patellar tendon to extend the knee. The knee jerk tests cord segments L3–L4. Vastus medialis wastes fastest after knee injury.",
        "zh": "股直肌（跨越髋关节）及股外侧肌、股内侧肌、股中间肌，汇合于髌腱，伸膝。膝跳反射检查L3–L4脊髓节段。膝部损伤后股内侧肌萎缩最快。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ1433M",
        "FJ1441M",
        "FJ1442M",
        "FJ1443M"
      ]
    },
    {
      "key": "may-that-lung-chau",
      "name": {
        "vi": "Cơ may và cơ thắt lưng-chậu",
        "en": "Sartorius and iliopsoas",
        "zh": "缝匠肌与髂腰肌"
      },
      "latin": "M. sartorius · M. iliopsoas",
      "note": {
        "vi": "Cơ may — cơ dài nhất cơ thể — chéo từ gai chậu trước trên xuống mặt trong gối, tạo bờ ngoài tam giác đùi. Cơ thắt lưng lớn và cơ chậu chung gân bám mấu chuyển bé — cơ gấp hông mạnh nhất; áp xe cạnh cột sống có thể lan theo bao cơ thắt lưng xuống bẹn.",
        "en": "Sartorius — the longest muscle in the body — runs obliquely from the anterior superior iliac spine to the medial knee, forming the lateral border of the femoral triangle. Psoas major and iliacus share a tendon to the lesser trochanter — the strongest hip flexor; a paravertebral abscess can track down the psoas sheath into the groin.",
        "zh": "缝匠肌——人体最长的肌肉——自髂前上棘斜行至膝内侧，构成股三角外侧界。腰大肌与髂肌共腱止于小转子——最强的屈髋肌；椎旁脓肿可沿腰大肌鞘下行至腹股沟。"
      },
      "tint": "#6fa3c8",
      "parts": [
        "FJ1422M",
        "FJ1431M",
        "FJ1434M"
      ]
    },
    {
      "key": "khep",
      "name": {
        "vi": "Nhóm cơ khép",
        "en": "Adductor group",
        "zh": "内收肌群"
      },
      "latin": "Mm. adductores",
      "note": {
        "vi": "Khép dài, ngắn, lớn, bé, cơ lược và cơ thon — khép đùi, do thần kinh bịt chi phối (riêng phần ụ ngồi của khép lớn do thần kinh ngồi). Căng cơ khép dài là chấn thương \"đau háng\" hay gặp ở cầu thủ bóng đá.",
        "en": "Adductor longus, brevis, magnus and minimus, pectineus and gracilis — adducting the thigh, supplied by the obturator nerve (except the ischial part of adductor magnus, by the sciatic). An adductor longus strain is the classic footballer's \"groin pull\".",
        "zh": "长收肌、短收肌、大收肌、小收肌、耻骨肌和股薄肌——内收大腿，受闭孔神经支配（大收肌坐骨部除外，由坐骨神经支配）。长收肌拉伤是足球运动员典型的“腹股沟拉伤”。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ1401M",
        "FJ1402M",
        "FJ1403M",
        "FJ1404M",
        "FJ1421M",
        "FJ1427M"
      ]
    },
    {
      "key": "u-ngoi-cang",
      "name": {
        "vi": "Nhóm cơ ụ ngồi-cẳng chân (hamstring)",
        "en": "Hamstrings",
        "zh": "腘绳肌"
      },
      "latin": "Mm. ischiocrurales",
      "note": {
        "vi": "Nhị đầu đùi, bán gân, bán mạc — từ ụ ngồi xuống cẳng chân, vượt hai khớp nên vừa duỗi hông vừa gấp gối. Hay bị rách khi chạy nước rút. Đầu ngắn nhị đầu đùi là cơ duy nhất nhóm này không bám ụ ngồi.",
        "en": "Biceps femoris, semitendinosus and semimembranosus — from the ischial tuberosity to the leg, crossing two joints so they extend the hip and flex the knee. Often torn in sprinting. The short head of biceps femoris is the only one that does not arise from the ischium.",
        "zh": "股二头肌、半腱肌、半膜肌——自坐骨结节至小腿，跨越两个关节，故既伸髋又屈膝。短跑时易撕裂。股二头肌短头是该群唯一不起自坐骨的肌肉。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1395M",
        "FJ1435M",
        "FJ1436M",
        "FJ1444M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương (mốc)",
        "en": "Bones (landmarks)",
        "zh": "骨（标志）"
      },
      "latin": "Os coxae · Femur · Patella · Tibia · Fibula",
      "note": {
        "vi": "Xương chậu, xương cùng, đùi, bánh chè, chày, mác — mờ sẵn để thấy nguyên uỷ và bám tận.",
        "en": "Hip bone, sacrum, femur, patella, tibia, fibula — faded so origins and insertions show through.",
        "zh": "髋骨、骶骨、股骨、髌骨、胫骨、腓骨——淡化以显示起止点。"
      },
      "parts": [
        "FJ3259",
        "FJ3260",
        "FJ3275",
        "FJ3282",
        "FJ3288",
        "FJ3393"
      ]
    }
  ]
};
