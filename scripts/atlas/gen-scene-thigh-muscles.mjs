/**
 * Sinh scene "Cơ Đùi và Mông" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-thigh-muscles.mjs
 *
 * Chi dưới TRÁI. Lọc cả `muscular`, `skeletal`, `connective` vì atlas xếp dải
 * chậu-chày vào `skeletal` và cơ căng mạc đùi vào `connective`. Nhóm theo
 * KHOANG và chức năng, mỗi khoang một tông, vì mỗi khoang một dây thần kinh.
 */
import { byRe, emit, leftSide } from "./lib.mjs";

const M = (re) => leftSide(byRe(re, ["muscular", "skeletal", "connective"]));

emit({
  file: "thigh-muscles",
  exportName: "thighMusclesScene",
  header: 'Scene "Cơ Đùi và Mông" (bên trái) dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "co-dui-mong",
    title: { vi: "Cơ Đùi và Mông", en: "Muscles of the Thigh and Gluteal Region", zh: "大腿与臀部肌" },
    latin: "Musculi femoris et regionis glutealis",
    intro: {
      vi: "Đùi có ba khoang, mỗi khoang một dây thần kinh: TRƯỚC (tứ đầu, may — duỗi gối, thần kinh đùi), TRONG (nhóm khép — thần kinh bịt), SAU (nhóm ụ ngồi-cẳng chân — gấp gối, duỗi hông, thần kinh ngồi). Vùng mông gồm cơ mông lớn duỗi hông và cơ mông nhỡ, bé giữ thăng bằng khung chậu khi đi. Mỗi nhóm một tông màu; xương mờ sẵn.",
      en: "The thigh has three compartments, each with its own nerve: ANTERIOR (quadriceps, sartorius — knee extension, femoral nerve), MEDIAL (adductors — obturator nerve), POSTERIOR (hamstrings — knee flexion and hip extension, sciatic nerve). The gluteal region holds gluteus maximus, extending the hip, and gluteus medius and minimus, which keep the pelvis level when walking. Each group has its own colour family; bones are faded.",
      zh: "大腿分三个骨筋膜室，各有一条神经：前群（股四头肌、缝匠肌——伸膝，股神经），内侧群（内收肌群——闭孔神经），后群（腘绳肌——屈膝伸髋，坐骨神经）。臀区有伸髋的臀大肌，以及行走时维持骨盆水平的臀中肌、臀小肌。每群一种色系；骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["mong-lon", "mong-nho-be", "xoay-ngoai", "tu-dau", "may-that-lung-chau", "khep", "u-ngoi-cang"],
  groups: [
    {
      key: "mong-lon",
      tint: "#8f2f3a",
      latin: "M. gluteus maximus",
      name: { vi: "Cơ mông lớn", en: "Gluteus maximus", zh: "臀大肌" },
      note: {
        vi: "Cơ lớn nhất cơ thể, duỗi hông khi leo dốc, đứng dậy, chạy — đi trên mặt phẳng hầu như không dùng tới. Tiêm bắp ở góc phần tư trên-ngoài mông để tránh thần kinh ngồi đi dưới cơ.",
        en: "The largest muscle in the body, extending the hip when climbing, rising from a chair or running — barely used on level walking. Intramuscular injections go in the upper outer quadrant to avoid the sciatic nerve beneath it.",
        zh: "人体最大的肌肉，在爬坡、起立、奔跑时伸髋——平地行走时几乎不参与。肌内注射选在臀部外上象限，以避开其深面的坐骨神经。",
      },
      ids: M(/gluteus maximus$/i),
    },
    {
      key: "mong-nho-be",
      tint: "#b8434f",
      latin: "Mm. glutei medius et minimus · M. tensor fasciae latae",
      name: { vi: "Cơ mông nhỡ, mông bé và căng mạc đùi", en: "Gluteus medius, minimus and tensor fasciae latae", zh: "臀中肌、臀小肌与阔筋膜张肌" },
      note: {
        vi: "Dạng hông và giữ khung chậu không sụp về bên chân đang nhấc. Liệt (tổn thương thần kinh mông trên) gây dấu Trendelenburg: đứng một chân thì hông bên kia tụt xuống, đi lạch bạch.",
        en: "Abduct the hip and stop the pelvis dropping toward the lifted leg. Their paralysis (superior gluteal nerve injury) gives the Trendelenburg sign: standing on one leg, the opposite hip sags, and the gait waddles.",
        zh: "外展髋关节，并防止骨盆向抬起腿的一侧下沉。其麻痹（臀上神经损伤）出现Trendelenburg征：单腿站立时对侧髋部下沉，步态摇摆。",
      },
      ids: M(/gluteus (medius|minimus)$|tensor fasciae latae$|iliotibial tract$/i),
    },
    {
      key: "xoay-ngoai",
      tint: "#d98a2b",
      latin: "Mm. rotatores externi",
      name: { vi: "Nhóm cơ xoay ngoài hông", en: "Deep lateral rotators of the hip", zh: "髋外旋肌群" },
      note: {
        vi: "Hình lê, sinh đôi trên/dưới, bịt trong/ngoài, vuông đùi. Cơ hình lê là mốc của vùng mông: thần kinh ngồi thường chui ra dưới bờ dưới cơ này — co thắt hình lê có thể chèn dây ngồi.",
        en: "Piriformis, the gemelli, obturator internus and externus, quadratus femoris. Piriformis is the landmark of the gluteal region: the sciatic nerve usually emerges below its lower border — piriformis spasm can compress the nerve.",
        zh: "梨状肌、上下孖肌、闭孔内肌和闭孔外肌、股方肌。梨状肌是臀区的标志：坐骨神经通常自其下缘穿出——梨状肌痉挛可压迫该神经。",
      },
      ids: M(/piriformis$|gemellus (superior|inferior)$|obturator (internus|externus)$|quadratus femoris$/i),
    },
    {
      key: "tu-dau",
      tint: "#527c9f",
      latin: "M. quadriceps femoris",
      name: { vi: "Cơ tứ đầu đùi", en: "Quadriceps femoris", zh: "股四头肌" },
      note: {
        vi: "Thẳng đùi (vượt cả khớp hông) và ba cơ rộng ngoài, trong, giữa, hội tụ vào gân bánh chè — duỗi gối. Phản xạ gân bánh chè thử khoanh tuỷ L3–L4. Cơ rộng trong teo nhanh nhất sau chấn thương gối.",
        en: "Rectus femoris (which also crosses the hip) and vastus lateralis, medialis and intermedius, converging on the patellar tendon to extend the knee. The knee jerk tests cord segments L3–L4. Vastus medialis wastes fastest after knee injury.",
        zh: "股直肌（跨越髋关节）及股外侧肌、股内侧肌、股中间肌，汇合于髌腱，伸膝。膝跳反射检查L3–L4脊髓节段。膝部损伤后股内侧肌萎缩最快。",
      },
      ids: M(/rectus femoris$|vastus (lateralis|medialis|intermedius)$/i),
    },
    {
      key: "may-that-lung-chau",
      tint: "#6fa3c8",
      latin: "M. sartorius · M. iliopsoas",
      name: { vi: "Cơ may và cơ thắt lưng-chậu", en: "Sartorius and iliopsoas", zh: "缝匠肌与髂腰肌" },
      note: {
        vi: "Cơ may — cơ dài nhất cơ thể — chéo từ gai chậu trước trên xuống mặt trong gối, tạo bờ ngoài tam giác đùi. Cơ thắt lưng lớn và cơ chậu chung gân bám mấu chuyển bé — cơ gấp hông mạnh nhất; áp xe cạnh cột sống có thể lan theo bao cơ thắt lưng xuống bẹn.",
        en: "Sartorius — the longest muscle in the body — runs obliquely from the anterior superior iliac spine to the medial knee, forming the lateral border of the femoral triangle. Psoas major and iliacus share a tendon to the lesser trochanter — the strongest hip flexor; a paravertebral abscess can track down the psoas sheath into the groin.",
        zh: "缝匠肌——人体最长的肌肉——自髂前上棘斜行至膝内侧，构成股三角外侧界。腰大肌与髂肌共腱止于小转子——最强的屈髋肌；椎旁脓肿可沿腰大肌鞘下行至腹股沟。",
      },
      ids: M(/sartorius$|psoas major$|iliacus$/i),
    },
    {
      key: "khep",
      tint: "#7fa878",
      latin: "Mm. adductores",
      name: { vi: "Nhóm cơ khép", en: "Adductor group", zh: "内收肌群" },
      note: {
        vi: "Khép dài, ngắn, lớn, bé, cơ lược và cơ thon — khép đùi, do thần kinh bịt chi phối (riêng phần ụ ngồi của khép lớn do thần kinh ngồi). Căng cơ khép dài là chấn thương \"đau háng\" hay gặp ở cầu thủ bóng đá.",
        en: "Adductor longus, brevis, magnus and minimus, pectineus and gracilis — adducting the thigh, supplied by the obturator nerve (except the ischial part of adductor magnus, by the sciatic). An adductor longus strain is the classic footballer's \"groin pull\".",
        zh: "长收肌、短收肌、大收肌、小收肌、耻骨肌和股薄肌——内收大腿，受闭孔神经支配（大收肌坐骨部除外，由坐骨神经支配）。长收肌拉伤是足球运动员典型的“腹股沟拉伤”。",
      },
      ids: M(/adductor (longus|brevis|magnus|minimus)$|pectineus$|gracilis$/i),
    },
    {
      key: "u-ngoi-cang",
      tint: "#9b6fae",
      latin: "Mm. ischiocrurales",
      name: { vi: "Nhóm cơ ụ ngồi-cẳng chân (hamstring)", en: "Hamstrings", zh: "腘绳肌" },
      note: {
        vi: "Nhị đầu đùi, bán gân, bán mạc — từ ụ ngồi xuống cẳng chân, vượt hai khớp nên vừa duỗi hông vừa gấp gối. Hay bị rách khi chạy nước rút. Đầu ngắn nhị đầu đùi là cơ duy nhất nhóm này không bám ụ ngồi.",
        en: "Biceps femoris, semitendinosus and semimembranosus — from the ischial tuberosity to the leg, crossing two joints so they extend the hip and flex the knee. Often torn in sprinting. The short head of biceps femoris is the only one that does not arise from the ischium.",
        zh: "股二头肌、半腱肌、半膜肌——自坐骨结节至小腿，跨越两个关节，故既伸髋又屈膝。短跑时易撕裂。股二头肌短头是该群唯一不起自坐骨的肌肉。",
      },
      ids: M(/biceps femoris$|semitendinosus$|semimembranosus$/i),
    },
    {
      key: "xuong",
      latin: "Os coxae · Femur · Patella · Tibia · Fibula",
      name: { vi: "Xương (mốc)", en: "Bones (landmarks)", zh: "骨（标志）" },
      note: {
        vi: "Xương chậu, xương cùng, đùi, bánh chè, chày, mác — mờ sẵn để thấy nguyên uỷ và bám tận.",
        en: "Hip bone, sacrum, femur, patella, tibia, fibula — faded so origins and insertions show through.",
        zh: "髋骨、骶骨、股骨、髌骨、胫骨、腓骨——淡化以显示起止点。",
      },
      ids: leftSide(byRe(/hip bone$|femur$|patella$|tibia$|fibula$/i, ["skeletal"])).concat(byRe(/^sacrum$/i)),
    },
  ],
});
