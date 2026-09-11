/**
 * Sinh scene "Vùng mông" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-gluteal.mjs
 *
 * Bên TRÁI. Khảo sát: đủ ba cơ mông và nhóm xoay ngoài, tĩnh mạch mông trên/
 * dưới. THIẾU thần kinh ngồi, động mạch mông, dây chằng cùng-ụ ngồi và dây
 * chằng chỏm đùi — bài mất phần thần kinh, nêu rõ ở intro.
 */
import { byRe, emit, leftSide, DEOXY } from "./lib.mjs";

const M = (re) => leftSide(byRe(re, ["muscular", "connective"]));

emit({
  file: "gluteal",
  exportName: "glutealScene",
  header: 'Scene "Vùng mông" (bên trái) dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu thần kinh ngồi, động mạch mông và dây chằng vùng mông.',
  scene: {
    slug: "vung-mong",
    title: { vi: "Vùng mông", en: "The Gluteal Region", zh: "臀区" },
    latin: "Regio glutealis",
    intro: {
      vi: "Ba lớp cơ: nông là cơ mông lớn; giữa là cơ mông nhỡ; sâu là cơ mông bé và nhóm xoay ngoài (hình lê, sinh đôi, bịt trong, vuông đùi). Cơ hình lê là chìa khoá: mạch và thần kinh mông trên chui ra trên nó, còn thần kinh ngồi, mạch mông dưới chui ra dưới nó. Tiêm bắp ở góc phần tư trên-ngoài để tránh thần kinh ngồi. Bộ dữ liệu không có thần kinh ngồi và động mạch mông; xương mờ sẵn.",
      en: "Three layers: superficial gluteus maximus; middle gluteus medius; deep gluteus minimus and the lateral rotators (piriformis, gemelli, obturator internus, quadratus femoris). Piriformis is the key: the superior gluteal vessels and nerve emerge above it, the sciatic nerve and inferior gluteal vessels below. Intramuscular injections go in the upper outer quadrant to avoid the sciatic nerve. The dataset lacks the sciatic nerve and gluteal arteries; bones are faded.",
      zh: "分三层：浅层为臀大肌；中层为臀中肌；深层为臀小肌及外旋肌群（梨状肌、上下孖肌、闭孔内肌、股方肌）。梨状肌是关键：臀上血管神经自其上缘穿出，坐骨神经和臀下血管自其下缘穿出。肌内注射选在外上象限以避开坐骨神经。数据集中无坐骨神经和臀部动脉；骨骼淡化。",
    },
  },
  faded: ["xuong"],
  // Căn theo cơ: xương đùi (46cm) trong nhóm mốc kéo khung xuống tận gối.
  frame: ["mong-lon", "mong-nho", "mong-be", "hinh-le", "xoay-ngoai", "tm-mong"],
  groups: [
    {
      key: "mong-lon",
      tint: "#8f2f3a",
      latin: "M. gluteus maximus",
      name: { vi: "Cơ mông lớn", en: "Gluteus maximus", zh: "臀大肌" },
      note: {
        vi: "Lớp nông, do thần kinh mông dưới chi phối. Liệt cơ này: khó leo cầu thang, đứng dậy khỏi ghế — người bệnh ngả người ra sau khi bước (dáng đi mông lớn).",
        en: "The superficial layer, supplied by the inferior gluteal nerve. Its paralysis makes climbing stairs and rising from a chair hard — the patient lurches backward with each step (gluteus maximus gait).",
        zh: "浅层，受臀下神经支配。其麻痹导致上楼梯、从椅子上站起困难——患者每步向后倾斜（臀大肌步态）。",
      },
      ids: M(/gluteus maximus$/i),
    },
    {
      key: "mong-nho",
      tint: "#b8434f",
      latin: "M. gluteus medius",
      name: { vi: "Cơ mông nhỡ", en: "Gluteus medius", zh: "臀中肌" },
      note: {
        vi: "Lớp giữa, dạng hông và giữ khung chậu thăng bằng khi đứng một chân (thần kinh mông trên). Tiêm sai vị trí làm tổn thương thần kinh mông trên gây dáng đi Trendelenburg.",
        en: "The middle layer, abducting the hip and keeping the pelvis level on one leg (superior gluteal nerve). A misplaced injection injuring that nerve causes a Trendelenburg gait.",
        zh: "中层，外展髋关节并在单腿站立时维持骨盆水平（臀上神经）。注射部位不当损伤臀上神经导致Trendelenburg步态。",
      },
      ids: M(/gluteus medius$/i),
    },
    {
      key: "mong-be",
      tint: "#d0685a",
      latin: "M. gluteus minimus",
      name: { vi: "Cơ mông bé", en: "Gluteus minimus", zh: "臀小肌" },
      note: {
        vi: "Lớp sâu nhất của nhóm mông, cùng tác dụng với mông nhỡ và thêm xoay trong đùi.",
        en: "The deepest gluteal, sharing the actions of gluteus medius and adding medial rotation of the thigh.",
        zh: "臀肌最深层，作用与臀中肌相同，并可内旋大腿。",
      },
      ids: M(/gluteus minimus$/i),
    },
    {
      key: "hinh-le",
      tint: "#e8a33d",
      latin: "M. piriformis",
      name: { vi: "Cơ hình lê", en: "Piriformis", zh: "梨状肌" },
      note: {
        vi: "Chìa khoá của vùng mông. Ở khoảng 10–15% người, một phần thần kinh ngồi xuyên QUA cơ này — gốc của hội chứng cơ hình lê (đau thần kinh toạ không do đĩa đệm).",
        en: "The key to the region. In about 10–15% of people part of the sciatic nerve passes THROUGH this muscle — the basis of piriformis syndrome (sciatica not caused by a disc).",
        zh: "臀区的关键。约10–15%的人坐骨神经部分穿过此肌——梨状肌综合征（非椎间盘源性坐骨神经痛）的解剖基础。",
      },
      ids: M(/piriformis$/i),
    },
    {
      key: "xoay-ngoai",
      tint: "#d98a2b",
      latin: "Mm. gemelli · obturator internus · quadratus femoris",
      name: { vi: "Sinh đôi, bịt trong, vuông đùi", en: "Gemelli, obturator internus, quadratus femoris", zh: "孖肌、闭孔内肌、股方肌" },
      note: {
        vi: "Nhóm xoay ngoài sâu nằm dưới cơ hình lê. Thần kinh ngồi chạy xuống TRÊN MẶT các cơ này — khi mổ thay khớp háng lối sau phải cắt chúng và dễ kéo căng thần kinh ngồi.",
        en: "The deep lateral rotators below piriformis. The sciatic nerve runs down ON their surface — in a posterior approach hip replacement they are cut and the sciatic nerve is at risk of stretching.",
        zh: "梨状肌下方的深层外旋肌群。坐骨神经沿其表面下行——髋关节后入路置换术中需切断这些肌肉，坐骨神经易受牵拉。",
      },
      ids: M(/gemellus (superior|inferior)$|obturator internus$|quadratus femoris$/i),
    },
    {
      key: "tm-mong",
      tint: DEOXY,
      latin: "Vv. gluteae",
      name: { vi: "Tĩnh mạch mông trên và dưới", en: "Superior and inferior gluteal veins", zh: "臀上、下静脉" },
      note: {
        vi: "Đi kèm động mạch cùng tên (không có trong dữ liệu) qua khuyết ngồi lớn, trên và dưới cơ hình lê.",
        en: "Accompany the arteries of the same name (absent from this data) through the greater sciatic notch, above and below piriformis.",
        zh: "与同名动脉（数据中缺失）伴行，经坐骨大孔分别于梨状肌上、下方穿出。",
      },
      ids: leftSide(byRe(/gluteal vein$/i, ["venous"])),
    },
    {
      key: "xuong",
      latin: "Os coxae · Os sacrum · Femur",
      name: { vi: "Xương chậu, cùng, đùi (mốc)", en: "Hip bone, sacrum, femur (landmarks)", zh: "髋骨、骶骨、股骨（标志）" },
      note: {
        vi: "Mờ sẵn. Khuyết ngồi lớn và mấu chuyển lớn là hai mốc để định vị các cơ sâu.",
        en: "Faded. The greater sciatic notch and greater trochanter are the two landmarks for placing the deep muscles.",
        zh: "已淡化。坐骨大切迹和大转子是定位深层肌的两个标志。",
      },
      ids: leftSide(byRe(/hip bone$|femur$/i, ["skeletal"])).concat(byRe(/^sacrum$/i)),
    },
  ],
});
