/**
 * Đợt 4B — chi dưới và chậu hông, dựng từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-batch-b.mjs
 *
 * Chi dưới chỉ lấy bên TRÁI (x > 0) và lọc theo độ cao (bẫy #11: FJ2091
 * "calcaneal branches" nằm ở y=0,88; FJ2190 "Right fibular vein" nằm ở đùi trái).
 *
 * ĐỔI CHỦ ĐỀ (atlas không có thần kinh ngoại biên, dây chằng, cơ mặt):
 *   khop-hang-dui         → Nhóm cơ khép đùi
 *   than-kinh-toa         → Vùng đùi sau (cơ ụ ngồi–cẳng chân)
 *   co-mat                → Khoang cẳng chân trước và ngoài
 *   vung-ben              → Vòng nối động mạch quanh gối
 *   tuy-song-dam-roi      → Bốn lớp cơ gan chân
 *   ong-song-that-lung    → Cơ thắt lưng–chậu
 *   dam-roi-that-lung-cung→ Tĩnh mạch chậu hông
 */
import { byRe, emit, leftSide, betweenY, OXY, DEOXY } from "./lib.mjs";

const L = (re, sys, y0 = 0, y1 = 1.05) => betweenY(leftSide(byRe(re, sys)), y0, y1);
const MU = ["muscular", "skeletal"];
const ART = ["arterial"];
const VEN = ["venous"];
const BONE = ["skeletal"];
const FOOT_BONES = /^(left )?(talus|calcaneus|navicular bone of foot|cuboid bone|(medial|intermediate|lateral) cuneiform bone|(first|second|third|fourth|fifth) metatarsal bone)$|phalanx of (left )?(big|second|third|fourth|little) toe$|^sesamoid bone of (left )?foot$/i;

// ───────────────────────── 1. Khớp gối ─────────────────────────
emit({
  file: "knee-joint",
  script: "batch-b",
  exportName: "kneeJointScene",
  header: 'Scene "Khớp gối" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng chéo, dây chằng bên, sụn chêm và bao khớp — bài dạy xương + cơ vận động.',
  scene: {
    slug: "khop-goi",
    title: { vi: "Khớp gối: xương và cơ vận động", en: "The Knee Joint: Bones and Movers", zh: "膝关节：骨与运动肌" },
    latin: "Articulatio genus",
    intro: {
      vi: "Khớp gối là khớp lớn nhất cơ thể. Lồi cầu xương đùi tròn đặt trên mâm chày gần như phẳng, nên độ vững dựa gần hết vào dây chằng và cơ. Xương bánh chè nằm trong gân cơ tứ đầu, làm tăng cánh tay đòn khi duỗi gối. Xương mác không tham gia khớp gối. Scene chia cơ theo động tác: duỗi (tứ đầu), gấp (nhóm đùi sau, cơ bụng chân), và cơ khoeo mở khoá gối. Bộ dữ liệu không có dây chằng chéo, dây chằng bên và sụn chêm; phần này chỉ mô tả trong ghi chú.",
      en: "The knee is the largest joint in the body. The rounded femoral condyles sit on an almost flat tibial plateau, so stability depends almost entirely on ligaments and muscles. The patella lies within the quadriceps tendon and lengthens its lever arm in extension. The fibula takes no part in the knee joint. The scene groups muscles by action: extension (quadriceps), flexion (hamstrings, gastrocnemius) and popliteus, which unlocks the knee. The dataset has no cruciate or collateral ligaments and no menisci; these appear only in the notes.",
      zh: "膝关节是人体最大的关节。圆形的股骨髁置于近乎平坦的胫骨平台上，稳定性几乎全靠韧带和肌肉。髌骨位于股四头肌腱内，伸膝时增大力臂。腓骨不参与膝关节。本场景按动作分组：伸（股四头肌）、屈（腘绳肌、腓肠肌）以及解锁膝关节的腘肌。数据集中无交叉韧带、侧副韧带和半月板，仅在注释中描述。",
    },
  },
  frame: ["xuong", "duoi", "gap", "khoeo"],
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Femur · Tibia · Patella · Fibula",
      name: { vi: "Xương đùi, chày, bánh chè, mác", en: "Femur, tibia, patella, fibula", zh: "股骨、胫骨、髌骨、腓骨" },
      note: {
        vi: "Khi duỗi hết, xương đùi xoay trong nhẹ trên xương chày để khoá gối, nhờ vậy đứng lâu mà cơ gần như nghỉ. Dây chằng chéo trước chặn xương chày trượt ra trước; đây là dây chằng hay đứt nhất khi xoay người đột ngột.",
        en: "At full extension the femur rotates slightly medially on the tibia and locks the knee, so we can stand with the muscles almost at rest. The anterior cruciate ligament stops the tibia sliding forward; it is the ligament most often torn in a sudden pivot.",
        zh: "完全伸直时股骨在胫骨上轻度内旋而锁定膝关节，使人站立时肌肉几乎放松。前交叉韧带阻止胫骨前移，是突然扭转时最常断裂的韧带。",
      },
      ids: L(/^(left )?(femur|tibia|patella|fibula)$/i, BONE),
    },
    {
      key: "duoi",
      tint: "#6f8fbf",
      latin: "M. quadriceps femoris",
      name: { vi: "Cơ tứ đầu đùi (duỗi gối)", en: "Quadriceps femoris (knee extensor)", zh: "股四头肌（伸膝）" },
      note: {
        vi: "Gồm cơ thẳng đùi, rộng ngoài, rộng trong và rộng giữa, hội vào gân bánh chè bám lồi củ chày. Rộng trong có thớ dưới chếch, giữ bánh chè không trượt ra ngoài; cơ này teo sớm sau chấn thương gối.",
        en: "Rectus femoris and vastus lateralis, medialis and intermedius converge on the patellar tendon to the tibial tuberosity. The oblique lower fibres of vastus medialis stop the patella slipping laterally; this muscle wastes early after a knee injury.",
        zh: "由股直肌、股外侧肌、股内侧肌和股中间肌组成，汇成髌韧带止于胫骨粗隆。股内侧肌下部斜行纤维防止髌骨外滑；膝损伤后此肌最早萎缩。",
      },
      ids: L(/^(left |right )?(rectus femoris|vastus (lateralis|medialis|intermedius))$/i, MU, 0.4, 0.9),
    },
    {
      key: "gap",
      tint: "#c9705f",
      latin: "Mm. biceps femoris, semitendinosus, semimembranosus, gastrocnemius",
      name: { vi: "Cơ gấp gối: nhóm đùi sau và cơ bụng chân", en: "Knee flexors: hamstrings and gastrocnemius", zh: "屈膝肌：腘绳肌与腓肠肌" },
      note: {
        vi: "Nhị đầu đùi bám chỏm mác; bán gân và bán màng bám mặt trong xương chày. Cơ bụng chân có hai đầu bám hai lồi cầu đùi nên cũng gấp gối.",
        en: "Biceps femoris inserts on the fibular head; semitendinosus and semimembranosus on the medial tibia. Gastrocnemius arises by two heads from the femoral condyles, so it also flexes the knee.",
        zh: "股二头肌止于腓骨头；半腱肌和半膜肌止于胫骨内侧。腓肠肌两头起于股骨两髁，故亦屈膝。",
      },
      ids: L(/head of (left |right )?(biceps femoris|gastrocnemius)$|^(left |right )?(semitendinosus|semimembranosus)$/i, MU, 0.3, 0.8),
    },
    {
      key: "chan-ngong",
      tint: "#e6c14a",
      latin: "Pes anserinus: Mm. sartorius, gracilis, semitendinosus",
      name: { vi: "Cơ may và cơ thon (chân ngỗng)", en: "Sartorius and gracilis (pes anserinus)", zh: "缝匠肌与股薄肌（鹅足）" },
      note: {
        vi: "Gân cơ may, cơ thon và cơ bán gân bám chung ở mặt trong đầu trên xương chày, xoè ra như chân ngỗng. Túi hoạt dịch dưới chỗ bám này hay viêm, gây đau mặt trong gối.",
        en: "The tendons of sartorius, gracilis and semitendinosus insert together on the upper medial tibia, spreading like a goose's foot. The bursa beneath them often inflames, causing medial knee pain.",
        zh: "缝匠肌、股薄肌和半腱肌腱共同止于胫骨上端内侧，展开如鹅足。其下滑囊常发炎，引起膝内侧疼痛。",
      },
      ids: L(/^(left |right )?(sartorius|gracilis)$/i, MU, 0.4, 0.9),
    },
    {
      key: "khoeo",
      tint: "#e8883d",
      latin: "M. popliteus",
      name: { vi: "Cơ khoeo (mở khoá gối)", en: "Popliteus (unlocks the knee)", zh: "腘肌（解锁膝关节）" },
      note: {
        vi: "Cơ nhỏ, chéo sau khớp, từ lồi cầu ngoài xương đùi tới mặt sau xương chày. Khi bắt đầu gấp, nó xoay ngoài xương đùi để mở khoá gối.",
        en: "A small muscle crossing behind the joint from the lateral femoral condyle to the back of the tibia. At the start of flexion it rotates the femur laterally to unlock the knee.",
        zh: "斜跨关节后方的小肌，自股骨外侧髁至胫骨后面。屈膝开始时使股骨外旋以解锁膝关节。",
      },
      ids: L(/^(left |right )?popliteus$/i, MU),
    },
    {
      key: "dai-chau-chay",
      tint: "#9fb8a0",
      latin: "Tractus iliotibialis",
      name: { vi: "Dải chậu–chày", en: "Iliotibial tract", zh: "髂胫束" },
      note: {
        vi: "Dải cân dày ở mặt ngoài đùi, bám lồi củ Gerdy của xương chày, giữ vững mặt ngoài gối. Nó cọ vào lồi cầu ngoài xương đùi gây đau gối ở người chạy bộ.",
        en: "A thick fascial band on the outer thigh inserting on Gerdy's tubercle of the tibia, steadying the outer knee. Friction over the lateral femoral condyle causes runner's knee pain.",
        zh: "大腿外侧的厚筋膜带，止于胫骨Gerdy结节，稳定膝外侧。在股骨外侧髁上摩擦可致跑步者膝痛。",
      },
      ids: L(/^(left )?iliotibial tract$/i, ["skeletal", "connective"]),
    },
  ],
});

// ─────────────── 2. Vòng nối động mạch quanh gối (đổi chủ đề) ───────────────
emit({
  file: "genicular-anastomosis",
  script: "batch-b",
  exportName: "genicularAnastomosisScene",
  header: 'Scene "Vòng nối động mạch quanh gối" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Vùng bẹn" cũ: atlas không có ống bẹn, dây chằng bẹn, thừng tinh.',
  scene: {
    slug: "vung-ben",
    system: "cardiovascular",
    title: { vi: "Động mạch khoeo và vòng nối quanh gối", en: "Popliteal Artery and the Genicular Anastomosis", zh: "腘动脉与膝关节动脉网" },
    latin: "A. poplitea · Rete articulare genus",
    intro: {
      vi: "Động mạch đùi chui qua lỗ gân cơ khép ra sau gối thành động mạch khoeo. Đây là mạch nằm sâu nhất trong hố khoeo, sát xương đùi. Nó cho năm động mạch gối ôm quanh khớp, nối với động mạch gối xuống (từ động mạch đùi), nhánh xuống của động mạch mũ đùi ngoài và nhánh quặt ngược chày trước. Vòng nối này không đủ nuôi cẳng chân khi động mạch khoeo tắc đột ngột. Vì thế trật khớp gối có tổn thương động mạch là cấp cứu mạch máu. Mỗi nguồn một sắc đỏ, tĩnh mạch xanh, xương mờ sẵn.",
      en: "The femoral artery passes through the adductor hiatus to the back of the knee as the popliteal artery. It is the deepest structure in the popliteal fossa, lying on the femur. It gives five genicular arteries that encircle the joint and join the descending genicular (from the femoral), the descending branch of the lateral circumflex femoral and the anterior tibial recurrent. This loop cannot sustain the leg if the popliteal artery is blocked suddenly. So a knee dislocation with arterial injury is a vascular emergency. Each source has its own shade of red, veins are blue and bones faded.",
      zh: "股动脉穿收肌腱裂孔至膝后成为腘动脉，是腘窝内最深的结构，紧贴股骨。它发出五条膝动脉环绕关节，并与膝降动脉（来自股动脉）、旋股外侧动脉降支及胫前返动脉吻合。腘动脉突然阻塞时此吻合网不足以供应小腿，故膝关节脱位合并动脉损伤属血管急症。每个来源一种红色调，静脉蓝色，骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["khoeo", "goi", "tren", "duoi"],
  groups: [
    {
      key: "khoeo",
      tint: OXY,
      latin: "A. femoralis → A. poplitea",
      name: { vi: "Động mạch đùi và động mạch khoeo", en: "Femoral and popliteal arteries", zh: "股动脉与腘动脉" },
      note: {
        vi: "Động mạch khoeo kết thúc ở bờ dưới cơ khoeo, chia thành động mạch chày trước và chày sau. Phình động mạch khoeo là phình mạch ngoại vi hay gặp nhất.",
        en: "The popliteal artery ends at the lower border of popliteus by dividing into anterior and posterior tibial arteries. Popliteal aneurysm is the most common peripheral aneurysm.",
        zh: "腘动脉在腘肌下缘分为胫前、胫后动脉。腘动脉瘤是最常见的周围动脉瘤。",
      },
      ids: L(/^(left |right )?(femoral|popliteal) artery$/i, ART, 0.35, 0.9),
    },
    {
      key: "goi",
      tint: "#e8883d",
      latin: "Aa. genus superiores, media, inferiores",
      name: { vi: "Năm động mạch gối", en: "The five genicular arteries", zh: "五条膝动脉" },
      note: {
        vi: "Gối trên trong và trên ngoài vòng trên lồi cầu; gối dưới trong và dưới ngoài vòng dưới mâm chày; gối giữa xuyên bao khớp nuôi dây chằng chéo. Chúng dễ bị tổn thương khi phẫu thuật nội soi và thay khớp gối.",
        en: "The medial and lateral superior genicular arteries circle above the condyles; the medial and lateral inferior circle below the tibial plateau; the middle genicular pierces the capsule to supply the cruciates. They are at risk in arthroscopy and knee replacement.",
        zh: "膝上内、外侧动脉绕行髁上方；膝下内、外侧动脉绕行胫骨平台下方；膝中动脉穿关节囊供应交叉韧带。关节镜和膝关节置换术中易受损。",
      },
      ids: L(/^(left |right )?(lateral superior|medial superior|middle|inferior lateral|inferior medial) genicular artery$/i, ART, 0.35, 0.6),
    },
    {
      key: "tren",
      tint: "#b03a48",
      latin: "A. descendens genus · R. descendens a. circumflexae femoris lateralis",
      name: { vi: "Nguồn từ trên: gối xuống, nhánh xuống mũ đùi ngoài", en: "From above: descending genicular, descending lateral circumflex", zh: "上方来源：膝降动脉、旋股外侧动脉降支" },
      note: {
        vi: "Động mạch gối xuống tách từ động mạch đùi trong ống cơ khép. Nhánh xuống của mũ đùi ngoài chạy trong cơ rộng ngoài xuống gối. Hai nguồn này nối vòng quanh gối với các động mạch gối.",
        en: "The descending genicular leaves the femoral in the adductor canal. The descending branch of the lateral circumflex femoral runs down in vastus lateralis to the knee. Both join the genicular loop.",
        zh: "膝降动脉在收肌管内发自股动脉；旋股外侧动脉降支沿股外侧肌下行至膝。二者参与膝周吻合。",
      },
      ids: L(/^(left |right )?descending genicular artery$|descending branch of (left |right )?lateral circumflex femoral artery$/i, ART, 0.4, 0.9),
    },
    {
      key: "duoi",
      tint: "#e39a7a",
      latin: "A. recurrens tibialis anterior · A. tibialis anterior",
      name: { vi: "Nguồn từ dưới: quặt ngược chày trước", en: "From below: anterior tibial recurrent", zh: "下方来源：胫前返动脉" },
      note: {
        vi: "Tách từ động mạch chày trước ngay khi nó xuyên màng gian cốt. Nó đi ngược lên nối với hai động mạch gối dưới.",
        en: "Arises from the anterior tibial artery just after it pierces the interosseous membrane, and climbs to join the inferior genicular arteries.",
        zh: "胫前动脉穿骨间膜后即发出，逆行向上与膝下动脉吻合。",
      },
      ids: L(/^(left |right )?anterior tibial recurrent artery$/i, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. poplitea · Vv. genus",
      name: { vi: "Tĩnh mạch khoeo và tĩnh mạch gối", en: "Popliteal and genicular veins", zh: "腘静脉与膝静脉" },
      note: {
        vi: "Tĩnh mạch khoeo nằm nông hơn động mạch. Huyết khối tĩnh mạch sâu ở đây có thể bong ra gây thuyên tắc phổi.",
        en: "The popliteal vein lies superficial to the artery. A deep vein thrombosis here can break off and cause pulmonary embolism.",
        zh: "腘静脉位于动脉浅面。此处深静脉血栓脱落可致肺栓塞。",
      },
      ids: L(/^(left |right )?(popliteal|genicular) vein$/i, VEN, 0.35, 0.6),
    },
    {
      key: "xuong",
      latin: "Femur · Tibia · Patella · Fibula",
      name: { vi: "Xương vùng gối (mốc)", en: "Bones of the knee (landmarks)", zh: "膝部骨（标志）" },
      note: {
        vi: "Mờ sẵn để vòng mạch quanh khớp nổi rõ.",
        en: "Faded so the vascular ring stands out.",
        zh: "淡化，使关节周围血管环清晰。",
      },
      ids: L(/^(left )?(femur|tibia|patella|fibula)$/i, BONE),
    },
  ],
});

// ───────────────────────── 3. Hố khoeo ─────────────────────────
emit({
  file: "popliteal-fossa",
  script: "batch-b",
  exportName: "poplitealFossaScene",
  header: 'Scene "Hố khoeo" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chày, dây mác chung và hạch khoeo.',
  scene: {
    slug: "ho-khoeo",
    title: { vi: "Hố khoeo", en: "The Popliteal Fossa", zh: "腘窝" },
    latin: "Fossa poplitea",
    intro: {
      vi: "Hố khoeo là hõm hình trám sau gối. Bờ trên trong là cơ bán gân và bán màng, bờ trên ngoài là nhị đầu đùi. Hai bờ dưới là hai đầu cơ bụng chân (và cơ gan chân ở ngoài). Nền hố là mặt sau xương đùi và cơ khoeo. Từ nông vào sâu có dây chày, tĩnh mạch khoeo, rồi động mạch khoeo nằm sâu nhất; bộ dữ liệu không có dây thần kinh. Bắt mạch khoeo phải gấp gối nhẹ cho cân chùng. Các cơ bờ mỗi bên một tông, mạch máu đỏ–xanh, xương mờ sẵn.",
      en: "The popliteal fossa is the diamond-shaped hollow behind the knee. Its upper medial border is semitendinosus and semimembranosus, its upper lateral border biceps femoris. The two lower borders are the heads of gastrocnemius (with plantaris laterally). Its floor is the back of the femur and popliteus. From superficial to deep lie the tibial nerve, the popliteal vein and, deepest, the popliteal artery; the dataset has no nerves. To feel the popliteal pulse, flex the knee slightly so the fascia slackens. Border muscles have one colour family per side, vessels red and blue, bones faded.",
      zh: "腘窝是膝后菱形凹陷：上内侧界为半腱肌和半膜肌，上外侧界为股二头肌，下两界为腓肠肌两头（外侧有跖肌）；窝底为股骨后面和腘肌。由浅入深为胫神经、腘静脉，最深为腘动脉；数据集中无神经。触摸腘动脉需轻度屈膝使筋膜松弛。两侧界肌各一色系，血管红蓝，骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["tren-trong", "tren-ngoai", "duoi", "nen", "dm", "tm"],
  groups: [
    {
      key: "tren-trong",
      tint: "#b58bc4",
      latin: "Mm. semitendinosus, semimembranosus",
      name: { vi: "Bờ trên trong: bán gân, bán màng", en: "Upper medial border: semitendinosus, semimembranosus", zh: "上内侧界：半腱肌、半膜肌" },
      note: {
        vi: "Bán gân có gân dài mảnh nằm nông; bán màng dẹt nằm dưới. Kén khoeo (kén Baker) thường thoát ra giữa cơ bán màng và đầu trong cơ bụng chân.",
        en: "Semitendinosus has a long slender superficial tendon; semimembranosus lies flat beneath it. A Baker's cyst usually bulges between semimembranosus and the medial head of gastrocnemius.",
        zh: "半腱肌腱细长位于浅层；半膜肌扁平位于其深面。腘窝囊肿（Baker囊肿）常突出于半膜肌与腓肠肌内侧头之间。",
      },
      ids: L(/^(left |right )?(semitendinosus|semimembranosus)$/i, MU, 0.4, 0.8),
    },
    {
      key: "tren-ngoai",
      tint: "#8a6fb0",
      latin: "M. biceps femoris",
      name: { vi: "Bờ trên ngoài: nhị đầu đùi", en: "Upper lateral border: biceps femoris", zh: "上外侧界：股二头肌" },
      note: {
        vi: "Dây mác chung chạy sát bờ trong gân nhị đầu rồi vòng quanh cổ xương mác. Gãy cổ xương mác hoặc bó bột chật có thể làm liệt dây này, gây bàn chân rũ.",
        en: "The common fibular nerve hugs the medial edge of the biceps tendon, then winds round the fibular neck. A fibular-neck fracture or a tight cast can paralyse it, causing foot drop.",
        zh: "腓总神经紧贴股二头肌腱内缘，再绕腓骨颈。腓骨颈骨折或石膏过紧可致其麻痹，出现足下垂。",
      },
      ids: L(/head of (left |right )?biceps femoris$/i, MU, 0.4, 0.8),
    },
    {
      key: "duoi",
      tint: "#c9705f",
      latin: "M. gastrocnemius · M. plantaris",
      name: { vi: "Hai bờ dưới: cơ bụng chân và cơ gan chân", en: "Lower borders: gastrocnemius and plantaris", zh: "下两界：腓肠肌与跖肌" },
      note: {
        vi: "Hai đầu cơ bụng chân đóng hai cạnh dưới của hình trám. Cơ gan chân nhỏ, gân dài nhất cơ thể, hay được lấy làm mảnh ghép gân.",
        en: "The two heads of gastrocnemius close the lower sides of the diamond. The small plantaris has the longest tendon in the body and is often harvested as a tendon graft.",
        zh: "腓肠肌两头构成菱形下两边。跖肌细小，其肌腱为全身最长，常被取作肌腱移植材料。",
      },
      ids: L(/head of (left |right )?gastrocnemius$|^(left |right )?plantaris$/i, MU, 0.2, 0.5),
    },
    {
      key: "nen",
      tint: "#e8883d",
      latin: "M. popliteus",
      name: { vi: "Nền: cơ khoeo", en: "Floor: popliteus", zh: "窝底：腘肌" },
      note: {
        vi: "Phủ mặt sau xương chày, là phần dưới của nền hố. Phần trên của nền là mặt khoeo xương đùi.",
        en: "Covers the back of the tibia and forms the lower floor; the upper floor is the popliteal surface of the femur.",
        zh: "覆盖胫骨后面，构成窝底下部；上部为股骨腘面。",
      },
      ids: L(/^(left |right )?popliteus$/i, MU),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "A. poplitea",
      name: { vi: "Động mạch khoeo và nhánh gối", en: "Popliteal artery and genicular branches", zh: "腘动脉及膝支" },
      note: {
        vi: "Nằm sâu nhất, sát xương đùi, nên gãy trên lồi cầu xương đùi có thể làm đoạn gãy đâm vào nó.",
        en: "The deepest structure, lying on the femur, so a supracondylar femoral fracture can drive a fragment into it.",
        zh: "位置最深，紧贴股骨，故股骨髁上骨折时骨折端可刺伤它。",
      },
      ids: L(/^(left |right )?popliteal artery$|genicular artery$/i, ART, 0.38, 0.56),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. poplitea · V. saphena parva",
      name: { vi: "Tĩnh mạch khoeo và tĩnh mạch hiển bé", en: "Popliteal and small saphenous veins", zh: "腘静脉与小隐静脉" },
      note: {
        vi: "Tĩnh mạch hiển bé đi dọc bắp chân phía sau, xuyên cân khoeo đổ vào tĩnh mạch khoeo. Van ở chỗ đổ này hỏng gây giãn tĩnh mạch bắp chân.",
        en: "The small saphenous vein runs up the back of the calf and pierces the popliteal fascia to join the popliteal vein. Failure of the valve at this junction causes calf varicose veins.",
        zh: "小隐静脉沿小腿后面上行，穿腘筋膜注入腘静脉。此处瓣膜功能不全导致小腿静脉曲张。",
      },
      ids: L(/^(left |right )?(popliteal|small saphenous|genicular) vein$/i, VEN, 0.2, 0.6),
    },
    {
      key: "xuong",
      latin: "Femur · Tibia · Fibula",
      name: { vi: "Xương đùi, chày, mác (mốc)", en: "Femur, tibia, fibula (landmarks)", zh: "股骨、胫骨、腓骨（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: L(/^(left )?(femur|tibia|fibula|patella)$/i, BONE),
    },
  ],
});

// ───────────────────────── 4. Khớp cổ chân ─────────────────────────
emit({
  file: "ankle-joint",
  script: "batch-b",
  exportName: "ankleJointScene",
  header: 'Scene "Khớp cổ chân" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng delta, dây chằng bên ngoài và mạc giữ gân — bài dạy xương + cơ vận động.',
  scene: {
    slug: "khop-co-chan",
    title: { vi: "Khớp cổ chân: xương và cơ vận động", en: "The Ankle: Bones and Movers", zh: "踝关节：骨与运动肌" },
    latin: "Articulatio talocruralis",
    intro: {
      vi: "Khớp cổ chân (khớp sên–cẳng chân) là một mộng. Hai mắt cá chày và mác kẹp ròng rọc xương sên, cho gấp mu và gấp gan. Lật trong và lật ngoài diễn ra ở khớp dưới sên, giữa xương sên và xương gót. Mọi gân vận động cổ chân chạy qua đây từ cẳng chân. Scene chia chúng theo tác dụng: gấp mu (khoang trước), gấp gan (tam đầu cẳng chân), lật trong (chày sau) và lật ngoài (cơ mác). Bộ dữ liệu không có dây chằng; bong gân lật trong chỉ được mô tả trong ghi chú.",
      en: "The ankle (talocrural) joint is a mortise: the tibial and fibular malleoli grip the trochlea of the talus, allowing dorsiflexion and plantarflexion. Inversion and eversion take place at the subtalar joint, between talus and calcaneus. Every tendon that moves the ankle crosses here from the leg. The scene groups them by action: dorsiflexion (anterior compartment), plantarflexion (triceps surae), inversion (tibialis posterior) and eversion (fibulares). The dataset has no ligaments; the classic inversion sprain appears only in the notes.",
      zh: "踝关节（距小腿关节）呈榫卯结构：胫、腓两踝夹住距骨滑车，产生背屈和跖屈；内翻、外翻发生在距骨与跟骨间的距下关节。所有运动踝的肌腱均自小腿经此。本场景按作用分组：背屈（前群）、跖屈（小腿三头肌）、内翻（胫骨后肌）、外翻（腓骨肌）。数据集中无韧带；典型的内翻扭伤仅在注释中描述。",
    },
  },
  frame: ["xuong", "gap-mu", "gap-gan", "lat-trong", "lat-ngoai"],
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Tibia · Fibula · Talus · Calcaneus · Os naviculare",
      name: { vi: "Xương chày, mác, sên, gót, thuyền", en: "Tibia, fibula, talus, calcaneus, navicular", zh: "胫骨、腓骨、距骨、跟骨、足舟骨" },
      note: {
        vi: "Ròng rọc xương sên phía trước rộng hơn phía sau, nên khi gấp mu khớp khít và vững nhất. Khi gấp gan (đi giày cao gót, bước hụt) khớp lỏng, dễ lật. Dây chằng sên–mác trước ở mặt ngoài là dây rách đầu tiên trong bong gân lật trong.",
        en: "The talar trochlea is wider in front than behind, so the joint is tightest and most stable in dorsiflexion. In plantarflexion (high heels, a missed step) it is loose and rolls easily. The anterior talofibular ligament on the outer side is the first to tear in an inversion sprain.",
        zh: "距骨滑车前宽后窄，背屈时关节最紧密稳定；跖屈时（穿高跟鞋、踩空）松弛易翻转。外侧的距腓前韧带是内翻扭伤中最先撕裂的韧带。",
      },
      ids: L(/^(left )?(tibia|fibula|talus|calcaneus|navicular bone of foot)$/i, BONE),
    },
    {
      key: "gap-mu",
      tint: "#6f8fbf",
      latin: "Mm. tibialis anterior, extensor hallucis longus, extensor digitorum longus, fibularis tertius",
      name: { vi: "Gấp mu: khoang trước cẳng chân", en: "Dorsiflexors: anterior compartment", zh: "背屈肌：小腿前群" },
      note: {
        vi: "Chày trước là cơ gấp mu mạnh nhất và cũng lật trong. Duỗi dài ngón cái, duỗi dài các ngón và mác ba đi cùng. Liệt dây mác sâu làm bàn chân rũ, người bệnh phải nhấc cao gối khi bước.",
        en: "Tibialis anterior is the strongest dorsiflexor and also inverts. Extensor hallucis longus, extensor digitorum longus and fibularis tertius join it. Deep fibular nerve palsy gives foot drop, and the patient lifts the knee high to walk.",
        zh: "胫骨前肌是最强的背屈肌并使足内翻；拇长伸肌、趾长伸肌和第三腓骨肌协同。腓深神经麻痹致足下垂，患者行走需高抬膝（跨阈步态）。",
      },
      ids: L(/^(left |right )?(tibialis anterior|extensor hallucis longus|extensor digitorum longus|fibularis tertius)$/i, MU, 0, 0.5),
    },
    {
      key: "gap-gan",
      tint: "#c9705f",
      latin: "M. triceps surae · Tendo calcaneus",
      name: { vi: "Gấp gan: cơ tam đầu cẳng chân và gân gót", en: "Plantarflexors: triceps surae and calcaneal tendon", zh: "跖屈肌：小腿三头肌与跟腱" },
      note: {
        vi: "Hai đầu cơ bụng chân và cơ dép hội thành gân gót, bám mặt sau xương gót. Đây là gân to và khoẻ nhất cơ thể, là lực đẩy chính khi đi, chạy, nhảy.",
        en: "The two heads of gastrocnemius and soleus merge into the calcaneal tendon on the back of the calcaneus — the thickest and strongest tendon in the body, the main push-off in walking, running and jumping.",
        zh: "腓肠肌两头与比目鱼肌合成跟腱，止于跟骨后面——全身最粗最强的肌腱，是行走、奔跑和跳跃的主要蹬地力量。",
      },
      ids: L(/head of (left |right )?gastrocnemius$|^(left |right )?(soleus|plantaris)$/i, MU, 0.1, 0.5).concat(L(/^(left )?calcaneal tendon$/i, ["connective"])),
    },
    {
      key: "lat-trong",
      tint: "#e6c14a",
      latin: "Mm. tibialis posterior, flexor digitorum longus, flexor hallucis longus",
      name: { vi: "Lật trong và gấp gan phụ: khoang sau sâu", en: "Invertors: deep posterior compartment", zh: "内翻肌：小腿后群深层" },
      note: {
        vi: "Ba gân vòng sau mắt cá trong. Chày sau là cơ lật trong chính và đỡ vòm dọc trong; suy gân chày sau là nguyên nhân hay gặp của bàn chân bẹt mắc phải ở người lớn.",
        en: "Three tendons pass behind the medial malleolus. Tibialis posterior is the main invertor and supports the medial longitudinal arch; its tendon failure is a common cause of acquired flat foot in adults.",
        zh: "三条肌腱绕内踝后方。胫骨后肌是主要内翻肌，并支撑足内侧纵弓；其肌腱功能不全是成人获得性扁平足的常见原因。",
      },
      ids: L(/^(left |right )?(tibialis posterior|flexor digitorum longus|flexor hallucis longus)$/i, MU, 0.05, 0.5),
    },
    {
      key: "lat-ngoai",
      tint: "#e8883d",
      latin: "Mm. fibularis longus et brevis",
      name: { vi: "Lật ngoài: cơ mác dài và mác ngắn", en: "Evertors: fibularis longus and brevis", zh: "外翻肌：腓骨长肌与腓骨短肌" },
      note: {
        vi: "Hai gân vòng sau mắt cá ngoài. Mác ngắn bám nền xương đốt bàn V; mác dài luồn dưới gan chân tới xương đốt bàn I. Chúng chống lại lật trong; khi bong gân mạnh, mác ngắn có thể giật bong mảnh nền xương đốt bàn V.",
        en: "Two tendons pass behind the lateral malleolus. Fibularis brevis inserts on the base of the fifth metatarsal; fibularis longus crosses under the sole to the first metatarsal. They resist inversion; in a severe sprain brevis can avulse the base of the fifth metatarsal.",
        zh: "两条肌腱绕外踝后方。腓骨短肌止于第5跖骨底；腓骨长肌经足底至第1跖骨。二者对抗内翻；严重扭伤时腓骨短肌可撕脱第5跖骨底。",
      },
      ids: L(/^(left |right )?fibularis (longus|brevis)$/i, MU, 0, 0.5),
    },
  ],
});

// ─────────────────── 5. Gân gót và ống cổ chân ───────────────────
emit({
  file: "tarsal-tunnel",
  script: "batch-b",
  exportName: "tarsalTunnelScene",
  header: 'Scene "Gân gót và ống cổ chân" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chày và mạc giữ gân gấp.',
  scene: {
    slug: "gan-got-ong-co-chan",
    title: { vi: "Gân gót và ống cổ chân", en: "Calcaneal Tendon and Tarsal Tunnel", zh: "跟腱与踝管" },
    latin: "Tendo calcaneus · Canalis malleolaris",
    intro: {
      vi: "Sau mắt cá trong là ống cổ chân, được mạc giữ gân gấp phủ lên. Các thành phần xếp từ trước ra sau: gân chày sau, gân gấp dài các ngón, động mạch và tĩnh mạch chày sau, dây chày, gân gấp dài ngón cái. Sinh viên thường nhớ thứ tự này bằng câu “Tom, Dick And Very Nervous Harry”. Bộ dữ liệu không có dây chày. Phía sau cùng là gân gót. Mỗi gân một màu, mạch máu đỏ–xanh, xương mờ sẵn.",
      en: "Behind the medial malleolus lies the tarsal tunnel, roofed by the flexor retinaculum. From front to back its contents are: tibialis posterior tendon, flexor digitorum longus tendon, posterior tibial artery and veins, tibial nerve, and flexor hallucis longus tendon. Students remember the order as “Tom, Dick And Very Nervous Harry”. The dataset has no tibial nerve. Furthest back lies the calcaneal tendon. Each tendon has its own colour, vessels are red and blue, and bones are faded.",
      zh: "内踝后方为踝管，由屈肌支持带覆盖。管内由前向后依次为：胫骨后肌腱、趾长屈肌腱、胫后动静脉、胫神经、拇长屈肌腱；学生常用口诀“Tom, Dick And Very Nervous Harry”记忆。数据集中无胫神经。最后方为跟腱。每条肌腱一种颜色，血管红蓝，骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["chay-sau", "gap-ngon", "mach", "gap-cai", "gan-got"],
  groups: [
    {
      key: "chay-sau",
      tint: "#e6c14a",
      latin: "M. tibialis posterior",
      name: { vi: "Gân chày sau (T)", en: "Tibialis posterior (T)", zh: "胫骨后肌腱（T）" },
      note: {
        vi: "Nằm trước nhất, sát mắt cá trong, bám củ xương thuyền và toả ra gần hết các xương cổ chân ở gan chân.",
        en: "The most anterior, right against the malleolus; it inserts on the navicular tuberosity and fans out to most tarsal bones on the sole.",
        zh: "最靠前，紧贴内踝，止于足舟骨粗隆并扩展至足底大部分跗骨。",
      },
      ids: L(/^(left |right )?tibialis posterior$/i, MU, 0, 0.5),
    },
    {
      key: "gap-ngon",
      tint: "#e8883d",
      latin: "M. flexor digitorum longus",
      name: { vi: "Gân gấp dài các ngón (D)", en: "Flexor digitorum longus (D)", zh: "趾长屈肌腱（D）" },
      note: {
        vi: "Ở gan chân chia bốn gân tới đốt xa ngón II–V; cơ vuông gan chân kéo thẳng hướng lực của nó.",
        en: "In the sole it splits into four tendons to the distal phalanges of toes 2–5; quadratus plantae straightens its line of pull.",
        zh: "在足底分为四腱至第2–5趾远节趾骨；足底方肌校正其牵拉方向。",
      },
      ids: L(/^(left |right )?flexor digitorum longus$/i, MU, 0, 0.5),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "A. tibialis posterior → Aa. plantares medialis et lateralis",
      name: { vi: "Động mạch chày sau (A)", en: "Posterior tibial artery (A)", zh: "胫后动脉（A）" },
      note: {
        vi: "Bắt mạch được giữa mắt cá trong và gân gót. Dưới mạc giữ gân gấp, nó chia thành động mạch gan chân trong và ngoài. Mất mạch ở đây là dấu hiệu bệnh động mạch chi dưới.",
        en: "Its pulse is felt between the medial malleolus and the calcaneal tendon. Under the retinaculum it divides into medial and lateral plantar arteries. An absent pulse here is a sign of lower-limb arterial disease.",
        zh: "可在内踝与跟腱之间触及搏动。在屈肌支持带下分为足底内、外侧动脉。此处搏动消失提示下肢动脉疾病。",
      },
      ids: L(/^(left |right )?(posterior tibial|medial plantar|lateral plantar) artery$/i, ART, 0, 0.45),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. tibiales posteriores (V)",
      name: { vi: "Tĩnh mạch chày sau (V)", en: "Posterior tibial veins (V)", zh: "胫后静脉（V）" },
      note: {
        vi: "Thường đi thành đôi hai bên động mạch.",
        en: "Usually paired, one on each side of the artery.",
        zh: "通常成对伴行于动脉两侧。",
      },
      ids: L(/^(left |right )?posterior tibial vein$/i, VEN, 0, 0.45),
    },
    {
      key: "gap-cai",
      tint: "#c9705f",
      latin: "M. flexor hallucis longus",
      name: { vi: "Gân gấp dài ngón cái (H)", en: "Flexor hallucis longus (H)", zh: "拇长屈肌腱（H）" },
      note: {
        vi: "Nằm sau cùng trong ống, chạy trong rãnh ở mặt sau xương sên và dưới mỏm chân đế sên của xương gót. Nó là lực đẩy cuối khi rời ngón cái khỏi mặt đất.",
        en: "The most posterior content, running in a groove on the back of the talus and under the sustentaculum tali. It gives the final push as the big toe leaves the ground.",
        zh: "管内最靠后，行于距骨后面的沟内及跟骨载距突下方，是拇趾离地时的最后推力。",
      },
      ids: L(/^(left |right )?flexor hallucis longus$/i, MU, 0, 0.5),
    },
    {
      key: "gan-got",
      tint: "#9fb8a0",
      latin: "Tendo calcaneus · M. soleus",
      name: { vi: "Gân gót và cơ dép", en: "Calcaneal tendon and soleus", zh: "跟腱与比目鱼肌" },
      note: {
        vi: "Gân gót đứt thường ở đoạn cách chỗ bám 2–6cm, vùng ít mạch nuôi. Nghiệm pháp Thompson: bóp bắp chân mà bàn chân không gấp gan là gân đã đứt.",
        en: "The tendon usually ruptures 2–6cm above its insertion, where blood supply is poorest. Thompson test: squeezing the calf fails to plantarflex the foot if the tendon is torn.",
        zh: "跟腱断裂常发生于止点上方2–6cm的乏血管区。Thompson试验：挤压小腿足不跖屈即提示跟腱断裂。",
      },
      ids: L(/^(left )?calcaneal tendon$/i, ["connective"]).concat(L(/^(left |right )?soleus$/i, MU, 0.1, 0.5)),
    },
    {
      key: "xuong",
      latin: "Tibia · Fibula · Talus · Calcaneus",
      name: { vi: "Xương chày, mác, sên, gót (mốc)", en: "Tibia, fibula, talus, calcaneus (landmarks)", zh: "胫骨、腓骨、距骨、跟骨（标志）" },
      note: {
        vi: "Mờ sẵn. Mắt cá trong là mốc trước của ống.",
        en: "Faded. The medial malleolus is the front landmark of the tunnel.",
        zh: "淡化。内踝为踝管前方标志。",
      },
      ids: L(/^(left )?(tibia|fibula|talus|calcaneus)$/i, BONE),
    },
  ],
});

// ───────────────────────── 6. Khớp hông ─────────────────────────
emit({
  file: "hip-joint",
  script: "batch-b",
  exportName: "hipJointScene",
  header: 'Scene "Khớp hông" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu bao khớp, dây chằng chậu–đùi, sụn viền ổ cối.',
  scene: {
    slug: "khop-hang",
    title: { vi: "Khớp hông: xương và cơ vận động", en: "The Hip Joint: Bones and Movers", zh: "髋关节：骨与运动肌" },
    latin: "Articulatio coxae",
    intro: {
      vi: "Khớp hông là khớp chỏm–ổ sâu: chỏm xương đùi nằm gọn trong ổ cối, nên vững hơn khớp vai rất nhiều nhưng kém linh động hơn. Scene chia cơ theo động tác. Gấp là cơ thắt lưng–chậu. Duỗi và dạng là các cơ mông. Xoay ngoài là các cơ chậu hông–mấu chuyển ngắn: hình lê, sinh đôi, bịt, vuông đùi. Máu nuôi chỏm đi chủ yếu qua các nhánh mũ đùi dọc cổ xương đùi. Bộ dữ liệu không có bao khớp và dây chằng.",
      en: "The hip is a deep ball-and-socket joint: the femoral head sits snugly in the acetabulum, so it is far more stable than the shoulder but less mobile. The scene groups muscles by action. Flexion is iliopsoas. Extension and abduction are the gluteals. Lateral rotation is the short pelvitrochanteric muscles: piriformis, gemelli, obturators and quadratus femoris. Blood reaches the femoral head mainly through circumflex branches along the neck. The dataset has no capsule or ligaments.",
      zh: "髋关节为深的球窝关节，股骨头嵌于髋臼内，远比肩关节稳定但灵活性较差。本场景按动作分组：屈为髂腰肌；伸和外展为臀肌；外旋为短的盆转子肌（梨状肌、上下孖肌、闭孔肌、股方肌）。股骨头血供主要经沿股骨颈的旋股动脉分支。数据集中无关节囊和韧带。",
    },
  },
  frame: ["xuong", "gap", "mong", "xoay-ngoai"],
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Os coxae · Femur",
      name: { vi: "Xương chậu và xương đùi", en: "Hip bone and femur", zh: "髋骨与股骨" },
      note: {
        vi: "Cổ xương đùi hợp với thân một góc khoảng 125°. Gãy cổ xương đùi ở người già có thể cắt đứt mạch nuôi chỏm, dẫn tới hoại tử chỏm. Vì vậy người già gãy cổ xương đùi thường được thay khớp.",
        en: "The femoral neck meets the shaft at about 125°. A neck fracture in the elderly can cut the vessels to the head and cause avascular necrosis. That is why these fractures are often treated with joint replacement.",
        zh: "股骨颈与股骨干约成125°。老年人股骨颈骨折可切断股骨头血供，导致缺血性坏死，故常行关节置换。",
      },
      ids: L(/^(left )?(hip bone|femur)$/i, BONE),
    },
    {
      key: "gap",
      tint: "#6f8fbf",
      latin: "M. iliopsoas",
      name: { vi: "Gấp hông: cơ thắt lưng lớn và cơ chậu", en: "Hip flexors: psoas major and iliacus", zh: "屈髋肌：腰大肌与髂肌" },
      note: {
        vi: "Hai cơ chung một gân bám mấu chuyển bé. Đây là cơ gấp hông mạnh nhất, dùng khi leo cầu thang và ngồi dậy.",
        en: "Share one tendon to the lesser trochanter — the strongest hip flexor, used in climbing stairs and sitting up.",
        zh: "二肌共腱止于小转子，是最强的屈髋肌，用于爬楼梯和坐起。",
      },
      ids: L(/^(left |right )?(psoas major|iliacus)$/i, MU, 0.75, 1.2),
    },
    {
      key: "mong",
      tint: "#c9705f",
      latin: "Mm. glutei maximus, medius, minimus",
      name: { vi: "Duỗi và dạng: ba cơ mông", en: "Extensors and abductors: the three gluteals", zh: "伸肌与外展肌：三块臀肌" },
      note: {
        vi: "Mông lớn duỗi hông mạnh khi đứng dậy, leo dốc. Mông nhỡ và mông bé dạng hông, giữ khung chậu thăng bằng khi đứng một chân. Yếu hai cơ này thì hông bên kia sụt xuống khi bước (dấu hiệu Trendelenburg).",
        en: "Gluteus maximus powerfully extends the hip when rising or climbing. Gluteus medius and minimus abduct and keep the pelvis level on one leg. When they are weak, the opposite hip drops with each step (Trendelenburg sign).",
        zh: "臀大肌在起立、登坡时有力伸髋。臀中肌和臀小肌外展髋并在单腿站立时维持骨盆水平；二者无力时行走对侧骨盆下沉（Trendelenburg征）。",
      },
      ids: L(/^(left |right )?gluteus (maximus|medius|minimus)$/i, MU),
    },
    {
      key: "xoay-ngoai",
      tint: "#e8883d",
      latin: "Mm. piriformis, gemelli, obturatorii, quadratus femoris",
      name: { vi: "Xoay ngoài: nhóm chậu hông–mấu chuyển", en: "Lateral rotators: the pelvitrochanteric group", zh: "外旋肌：盆转子肌群" },
      note: {
        vi: "Từ trên xuống: hình lê, sinh đôi trên, bịt trong, sinh đôi dưới, vuông đùi; bịt ngoài nằm sâu phía trước. Chúng như chóp xoay của hông, ép chỏm vào ổ cối. Dây ngồi thoát ra dưới cơ hình lê.",
        en: "From above down: piriformis, gemellus superior, obturator internus, gemellus inferior, quadratus femoris, with obturator externus deep in front. They act like a rotator cuff for the hip, pressing the head into the acetabulum. The sciatic nerve emerges below piriformis.",
        zh: "自上而下：梨状肌、上孖肌、闭孔内肌、下孖肌、股方肌，闭孔外肌位于深前方。它们如同髋的“肩袖”，将股骨头压向髋臼。坐骨神经自梨状肌下缘穿出。",
      },
      ids: L(/^(left |right )?(piriformis|gemellus (superior|inferior)|obturator (internus|externus)|quadratus femoris)$/i, MU),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "A. circumflexa femoris lateralis · A. femoralis",
      name: { vi: "Động mạch đùi và mũ đùi ngoài", en: "Femoral and lateral circumflex femoral arteries", zh: "股动脉与旋股外侧动脉" },
      note: {
        vi: "Các nhánh mũ đùi tạo vòng quanh cổ xương đùi, cho nhánh võng lên nuôi chỏm. Nhánh mũ đùi trong quan trọng nhất nhưng bộ dữ liệu chỉ có tĩnh mạch đi kèm của nó.",
        en: "The circumflex femoral branches ring the femoral neck and send retinacular branches up to the head. The medial circumflex is the most important, but the dataset has only its companion vein.",
        zh: "旋股动脉分支环绕股骨颈，发出支持带支上行供应股骨头。旋股内侧动脉最重要，但数据集中仅有其伴行静脉。",
      },
      ids: L(/^(left |right )?(femoral|lateral circumflex femoral) artery$/i, ART, 0.7, 0.95).concat(L(/^(left |right )?(lateral|medial) circumflex femoral vein$/i, VEN)),
    },
  ],
});

// ─────────────── 7. Nhóm cơ khép đùi (đổi chủ đề) ───────────────
emit({
  file: "adductors",
  script: "batch-b",
  exportName: "adductorsScene",
  header: 'Scene "Nhóm cơ khép đùi" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Khớp hông–đùi" cũ (trùng nội dung với "Khớp hông"; atlas không có dây chằng) bằng khoang trong của đùi.',
  scene: {
    slug: "khop-hang-dui",
    system: "muscular",
    title: { vi: "Nhóm cơ khép đùi (khoang trong)", en: "The Adductor Group (Medial Compartment)", zh: "大腿内收肌群（内侧群）" },
    latin: "Compartimentum femoris mediale",
    intro: {
      vi: "Khoang trong của đùi chứa các cơ khép, đi từ ngành xương mu và ngành ngồi tới đường ráp xương đùi. Xếp theo lớp: nông là cơ lược, khép dài và thon; giữa là khép ngắn; sâu là khép lớn và khép bé. Cơ bịt ngoài nằm sâu nhất. Các cơ này khép đùi và giữ khung chậu vững khi bước. Chúng hay bị căng rách ở người đá bóng. Dây bịt chi phối gần hết nhóm, nhưng bộ dữ liệu không có dây này. Mỗi lớp một tông màu, xương mờ sẵn.",
      en: "The medial compartment of the thigh holds the adductors, running from the pubic and ischial rami to the linea aspera of the femur. By layer: superficial are pectineus, adductor longus and gracilis; middle is adductor brevis; deep are adductor magnus and minimus. Obturator externus lies deepest. They adduct the thigh and steady the pelvis in gait, and are often strained in footballers. The obturator nerve supplies most of the group, but it is not in the dataset. Each layer has its own colour family and bones are faded.",
      zh: "大腿内侧群为内收肌，自耻骨支和坐骨支至股骨粗线。按层次：浅层为耻骨肌、长收肌和股薄肌；中层为短收肌；深层为大收肌和小收肌；闭孔外肌最深。它们内收大腿并在步行中稳定骨盆，足球运动员常拉伤。闭孔神经支配大部分肌肉，但数据集中无此神经。每层一种色系，骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["nong", "giua", "sau", "bit"],
  groups: [
    {
      key: "nong",
      tint: "#e39a7a",
      latin: "Mm. pectineus, adductor longus, gracilis",
      name: { vi: "Lớp nông: lược, khép dài, thon", en: "Superficial layer: pectineus, adductor longus, gracilis", zh: "浅层：耻骨肌、长收肌、股薄肌" },
      note: {
        vi: "Khép dài tạo bờ trong tam giác đùi và là cơ khép hay bị căng nhất. Cơ thon là cơ duy nhất của nhóm vượt qua gối; nó thường được lấy làm mảnh ghép tái tạo dây chằng chéo.",
        en: "Adductor longus forms the medial border of the femoral triangle and is the adductor most often strained. Gracilis is the only one that crosses the knee; it is often harvested for cruciate ligament reconstruction.",
        zh: "长收肌构成股三角内侧界，是最常拉伤的内收肌。股薄肌是本组唯一跨膝的肌肉，常被取作交叉韧带重建的移植物。",
      },
      ids: L(/^(left |right )?(pectineus|adductor longus|gracilis)$/i, MU),
    },
    {
      key: "giua",
      tint: "#c9705f",
      latin: "M. adductor brevis",
      name: { vi: "Lớp giữa: khép ngắn", en: "Middle layer: adductor brevis", zh: "中层：短收肌" },
      note: {
        vi: "Nằm sau cơ lược và khép dài. Hai nhánh trước và sau của dây bịt kẹp cơ này ở giữa.",
        en: "Lies behind pectineus and adductor longus. The anterior and posterior branches of the obturator nerve sandwich it.",
        zh: "位于耻骨肌和长收肌后方；闭孔神经前、后支夹于其前后。",
      },
      ids: L(/^(left |right )?adductor brevis$/i, MU),
    },
    {
      key: "sau",
      tint: "#8a6fb0",
      latin: "Mm. adductor magnus, adductor minimus",
      name: { vi: "Lớp sâu: khép lớn, khép bé", en: "Deep layer: adductor magnus and minimus", zh: "深层：大收肌、小收肌" },
      note: {
        vi: "Khép lớn có hai phần. Phần khép do dây bịt chi phối; phần gân (phần ụ ngồi) do dây ngồi chi phối và duỗi hông như nhóm đùi sau. Giữa hai phần có lỗ gân cơ khép, nơi mạch đùi ra khoeo. Khép bé là phần trên cùng tách riêng.",
        en: "Adductor magnus has two parts. The adductor part is supplied by the obturator nerve; the hamstring (ischial) part is supplied by the sciatic nerve and extends the hip like the hamstrings. Between them is the adductor hiatus, where the femoral vessels pass to the popliteal fossa. Adductor minimus is its separate uppermost part.",
        zh: "大收肌分两部：内收部受闭孔神经支配；腘绳部（坐骨部）受坐骨神经支配，如腘绳肌般伸髋。两部之间为收肌腱裂孔，股血管经此至腘窝。小收肌为其最上方独立部分。",
      },
      ids: L(/^(left |right )?adductor (magnus|minimus)$/i, MU),
    },
    {
      key: "bit",
      tint: "#6f8fbf",
      latin: "M. obturator externus",
      name: { vi: "Cơ bịt ngoài", en: "Obturator externus", zh: "闭孔外肌" },
      note: {
        vi: "Phủ mặt ngoài màng bịt, gân vòng sau cổ xương đùi. Nó xoay ngoài đùi và cũng được dây bịt chi phối.",
        en: "Covers the outer face of the obturator membrane; its tendon passes behind the femoral neck. It rotates the thigh laterally and is also supplied by the obturator nerve.",
        zh: "覆盖闭孔膜外面，肌腱经股骨颈后方；使大腿外旋，亦受闭孔神经支配。",
      },
      ids: L(/^(left |right )?obturator externus$/i, MU),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "A. femoralis · Aa. perforantes",
      name: { vi: "Động mạch đùi và các động mạch xiên", en: "Femoral and perforating arteries", zh: "股动脉与穿动脉" },
      note: {
        vi: "Động mạch đùi đi trong ống cơ khép giữa cơ rộng trong và khép dài. Các động mạch xiên (từ động mạch đùi sâu) xuyên qua chỗ bám khép lớn ra sau đùi.",
        en: "The femoral artery runs in the adductor canal between vastus medialis and adductor longus. The perforating arteries (from the deep femoral) pierce the adductor magnus insertion to reach the back of the thigh.",
        zh: "股动脉行于股内侧肌与长收肌之间的收肌管内。穿动脉（来自股深动脉）穿大收肌止点至大腿后部。",
      },
      ids: L(/^(left |right )?femoral artery$|^set of perforating arteries$/i, ART, 0.55, 0.9),
    },
    {
      key: "xuong",
      latin: "Os coxae · Femur",
      name: { vi: "Xương chậu và xương đùi (mốc)", en: "Hip bone and femur (landmarks)", zh: "髋骨与股骨（标志）" },
      note: {
        vi: "Mờ sẵn — thấy nguyên uỷ ở ngành mu, ngồi và chỗ bám dọc đường ráp.",
        en: "Faded — showing the origins on the pubic and ischial rami and the insertions along the linea aspera.",
        zh: "淡化——显示耻骨支、坐骨支起点及沿股骨粗线的止点。",
      },
      ids: L(/^(left )?(hip bone|femur)$/i, BONE),
    },
  ],
});

// ───────────────────────── 8. Tam giác đùi ─────────────────────────
emit({
  file: "femoral-triangle",
  script: "batch-b",
  exportName: "femoralTriangleScene",
  header: 'Scene "Tam giác đùi" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng bẹn, bao đùi và dây đùi.',
  scene: {
    slug: "tam-giac-dui",
    title: { vi: "Tam giác đùi", en: "The Femoral Triangle", zh: "股三角" },
    latin: "Trigonum femorale",
    intro: {
      vi: "Tam giác đùi nằm ở mặt trước trên đùi, ngay dưới nếp bẹn. Đáy là dây chằng bẹn (không có trong bộ dữ liệu), bờ ngoài là cơ may, bờ trong là cơ khép dài. Nền hố gồm cơ thắt lưng–chậu ở ngoài và cơ lược ở trong. Trong tam giác, từ ngoài vào trong là dây đùi, động mạch đùi, tĩnh mạch đùi, rồi ống đùi. Sinh viên thường nhớ bằng chữ NAVY. Đây là chỗ bắt mạch đùi, đặt catheter tim và nơi thoát vị đùi. Tĩnh mạch hiển lớn đổ vào tĩnh mạch đùi tại đây.",
      en: "The femoral triangle lies on the upper front of the thigh, just below the groin crease. Its base is the inguinal ligament (not in the dataset), its lateral border sartorius and its medial border adductor longus. The floor is iliopsoas laterally and pectineus medially. Inside, from lateral to medial, lie the femoral nerve, artery, vein and the femoral canal, remembered as NAVY. It is the site for the femoral pulse, cardiac catheter access and femoral hernia. The great saphenous vein joins the femoral vein here.",
      zh: "股三角位于大腿前上部、腹股沟皱襞下方：底为腹股沟韧带（数据集中无），外侧界为缝匠肌，内侧界为长收肌；底由外侧的髂腰肌和内侧的耻骨肌构成。内容由外向内为股神经、股动脉、股静脉、股管，口诀NAVY。此处为触摸股动脉搏动、心导管穿刺及股疝的部位。大隐静脉在此注入股静脉。",
    },
  },
  faded: ["xuong"],
  frame: ["bo", "nen", "dm", "tm"],
  groups: [
    {
      key: "bo",
      tint: "#b58bc4",
      latin: "M. sartorius · M. adductor longus",
      name: { vi: "Hai bờ: cơ may và cơ khép dài", en: "Borders: sartorius and adductor longus", zh: "两界：缝匠肌与长收肌" },
      note: {
        vi: "Cơ may là cơ dài nhất cơ thể, chạy chéo từ gai chậu trước trên xuống mặt trong gối. Nó giúp ngồi xếp bằng: gấp, dạng, xoay ngoài hông và gấp gối.",
        en: "Sartorius is the longest muscle in the body, running obliquely from the anterior superior iliac spine to the inner knee. It helps sit cross-legged: flexing, abducting and laterally rotating the hip and flexing the knee.",
        zh: "缝匠肌是人体最长的肌肉，自髂前上棘斜向下至膝内侧，参与盘腿坐：屈、外展、外旋髋并屈膝。",
      },
      ids: L(/^(left |right )?(sartorius|adductor longus)$/i, MU),
    },
    {
      key: "nen",
      tint: "#8a6fb0",
      latin: "M. iliopsoas · M. pectineus",
      name: { vi: "Nền: cơ thắt lưng–chậu và cơ lược", en: "Floor: iliopsoas and pectineus", zh: "底：髂腰肌与耻骨肌" },
      note: {
        vi: "Nền dốc như máng, lõm vào giữa, nên mạch đùi nằm sâu trong rãnh này.",
        en: "The floor slopes like a gutter towards the middle, so the femoral vessels sit deep in the groove.",
        zh: "底呈沟槽状向中间凹陷，股血管深居其中。",
      },
      ids: L(/^(left |right )?(psoas major|iliacus|pectineus)$/i, MU, 0.7, 1.2),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "A. femoralis · A. circumflexa femoris lateralis",
      name: { vi: "Động mạch đùi và nhánh", en: "Femoral artery and branches", zh: "股动脉及分支" },
      note: {
        vi: "Tiếp nối động mạch chậu ngoài sau dây chằng bẹn, ở điểm giữa gai chậu trước trên và khớp mu. Đây là đường vào kinh điển để chụp mạch vành. Nó cho động mạch đùi sâu và các nhánh mũ đùi.",
        en: "Continues the external iliac artery behind the inguinal ligament, at the midpoint between the anterior superior iliac spine and the pubic symphysis. This is the classic access route for coronary angiography. It gives the deep femoral and the circumflex femoral branches.",
        zh: "在腹股沟韧带后方续于髂外动脉，位于髂前上棘与耻骨联合连线中点，是冠状动脉造影的经典入路。发出股深动脉和旋股动脉分支。",
      },
      ids: L(/^(left |right )?(external iliac|femoral|lateral circumflex femoral|superficial epigastric) artery$/i, ART, 0.65, 1.0),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. femoralis · V. saphena magna",
      name: { vi: "Tĩnh mạch đùi và hiển lớn", en: "Femoral and great saphenous veins", zh: "股静脉与大隐静脉" },
      note: {
        vi: "Tĩnh mạch đùi nằm trong động mạch. Tĩnh mạch hiển lớn đổ vào nó qua lỗ tĩnh mạch hiển. Van ở chỗ nối này hỏng là nguyên nhân chính của giãn tĩnh mạch chi dưới.",
        en: "The femoral vein lies medial to the artery. The great saphenous vein joins it through the saphenous opening; failure of the valve at this junction is the main cause of leg varicose veins.",
        zh: "股静脉位于动脉内侧。大隐静脉经隐静脉裂孔注入，此处瓣膜功能不全是下肢静脉曲张的主要原因。",
      },
      ids: L(/^(left |right )?(femoral|great saphenous|deep femoral|superficial epigastric|lateral circumflex femoral|medial circumflex femoral) vein$/i, VEN, 0.55, 1.0),
    },
    {
      key: "xuong",
      latin: "Os coxae · Femur",
      name: { vi: "Xương chậu và đùi (mốc)", en: "Hip bone and femur (landmarks)", zh: "髋骨与股骨（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: L(/^(left )?(hip bone|femur)$/i, BONE),
    },
  ],
});

// ─────────────────── 9. Xương bàn chân và mạch mu chân ───────────────────
emit({
  file: "foot-bones-dorsum",
  script: "batch-b",
  exportName: "footBonesDorsumScene",
  header: 'Scene "Xương bàn chân và mạch mu chân" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng lò xo, cân gan chân; có dây chằng gan chân dài.',
  scene: {
    slug: "ban-chan-chi-tiet",
    title: { vi: "Xương bàn chân và mạch mu chân", en: "Bones of the Foot and Dorsal Vessels", zh: "足骨与足背血管" },
    latin: "Ossa pedis · A. dorsalis pedis",
    intro: {
      vi: "Bàn chân có 26 xương, chia ba vùng. Hậu túc gồm sên và gót. Trung túc gồm thuyền, hộp và ba chêm. Tiền túc gồm năm xương đốt bàn và các đốt ngón, thêm hai xương vừng dưới chỏm đốt bàn I. Chúng xếp thành vòm dọc trong, vòm dọc ngoài và vòm ngang để chia sức nặng. Dây chằng gan chân dài giữ vòm dọc ngoài. Trên mu chân, động mạch mu chân tiếp nối động mạch chày trước; bắt mạch được giữa gân duỗi dài ngón cái và gân duỗi các ngón. Mỗi vùng xương một màu.",
      en: "The foot has 26 bones in three regions. The hindfoot is the talus and calcaneus. The midfoot is the navicular, cuboid and three cuneiforms. The forefoot is the five metatarsals and the phalanges, plus two sesamoids under the first metatarsal head. They form the medial and lateral longitudinal arches and the transverse arch to spread body weight. The long plantar ligament holds the lateral arch. On the dorsum, the dorsalis pedis artery continues the anterior tibial; its pulse is felt between the extensor hallucis longus and extensor digitorum tendons. Each region of bones has its own colour.",
      zh: "足有26块骨，分三区：后足为距骨和跟骨；中足为足舟骨、骰骨和三块楔骨；前足为五块跖骨和趾骨，另有两块籽骨位于第1跖骨头下。它们构成内侧纵弓、外侧纵弓和横弓以分散体重。足底长韧带维持外侧纵弓。足背动脉续于胫前动脉，在拇长伸肌腱与趾长伸肌腱之间可触及搏动。每区骨一种颜色。",
    },
  },
  frame: ["hau", "trung", "tien", "ngon"],
  groups: [
    {
      key: "hau",
      tint: "#d98c5f",
      latin: "Talus · Calcaneus",
      name: { vi: "Hậu túc: xương sên, xương gót", en: "Hindfoot: talus and calcaneus", zh: "后足：距骨与跟骨" },
      note: {
        vi: "Xương sên không có cơ bám và phần lớn phủ sụn, nên máu nuôi nghèo; gãy cổ xương sên dễ gây hoại tử. Xương gót là xương cổ chân lớn nhất, gãy khi ngã từ trên cao đập gót xuống.",
        en: "The talus has no muscle attachments and is mostly covered by cartilage, so its blood supply is poor; a neck fracture risks necrosis. The calcaneus is the largest tarsal bone and breaks in falls from a height onto the heel.",
        zh: "距骨无肌肉附着且大部被软骨覆盖，血供差，颈部骨折易致坏死。跟骨是最大的跗骨，高处坠落足跟着地时易骨折。",
      },
      ids: L(/^(left )?(talus|calcaneus)$/i, BONE),
    },
    {
      key: "trung",
      tint: "#e6c14a",
      latin: "Os naviculare, cuboideum, cuneiformia",
      name: { vi: "Trung túc: thuyền, hộp, ba chêm", en: "Midfoot: navicular, cuboid, three cuneiforms", zh: "中足：足舟骨、骰骨、三块楔骨" },
      note: {
        vi: "Xương thuyền là đỉnh vòm dọc trong. Ba xương chêm hình nêm, xếp như đá khoá vòm ngang. Đường khớp giữa hậu túc và trung túc (khớp Chopart) là chỗ phẫu thuật cắt cụt.",
        en: "The navicular is the keystone of the medial arch. The three wedge-shaped cuneiforms lock the transverse arch like voussoirs. The joint line between hind- and midfoot (Chopart's joint) is a level for amputation.",
        zh: "足舟骨为内侧纵弓顶点。三块楔形楔骨如拱石般锁住横弓。后足与中足间关节线（Chopart关节）为截肢平面之一。",
      },
      ids: L(/^(left )?(navicular bone of foot|cuboid bone|(medial|intermediate|lateral) cuneiform bone)$/i, BONE),
    },
    {
      key: "tien",
      tint: "#9fb8a0",
      latin: "Ossa metatarsi · Ossa sesamoidea",
      name: { vi: "Tiền túc: năm xương đốt bàn và xương vừng", en: "Forefoot: five metatarsals and sesamoids", zh: "前足：五块跖骨与籽骨" },
      note: {
        vi: "Xương đốt bàn II dài và cố định nhất, hay bị gãy mỏi ở người lính và vận động viên. Hai xương vừng nằm trong gân gấp ngắn ngón cái, đỡ chỏm đốt bàn I.",
        en: "The second metatarsal is the longest and most fixed, the classic site of stress (march) fractures in soldiers and athletes. The two sesamoids lie in the flexor hallucis brevis tendons under the first metatarsal head.",
        zh: "第2跖骨最长且最固定，是士兵和运动员疲劳（行军）骨折的典型部位。两块籽骨位于拇短屈肌腱内，承托第1跖骨头。",
      },
      ids: L(/^(left )?(first|second|third|fourth|fifth) metatarsal bone$|^sesamoid bone of (left )?foot$/i, BONE),
    },
    {
      key: "ngon",
      tint: "#8fb0c8",
      latin: "Phalanges pedis",
      name: { vi: "Các đốt ngón chân", en: "Phalanges of the toes", zh: "趾骨" },
      note: {
        vi: "Ngón cái chỉ có hai đốt, các ngón khác có ba. Ngón út thường dính đốt giữa với đốt xa.",
        en: "The big toe has two phalanges, the others three. In the little toe the middle and distal phalanges are often fused.",
        zh: "拇趾两节，其余各趾三节；小趾中、远节常融合。",
      },
      ids: L(/phalanx of (left )?(big|second|third|fourth|little) toe$/i, BONE),
    },
    {
      key: "day-chang",
      tint: "#b58bc4",
      latin: "Lig. plantare longum",
      name: { vi: "Dây chằng gan chân dài", en: "Long plantar ligament", zh: "足底长韧带" },
      note: {
        vi: "Dây chằng dài nhất bàn chân, từ mặt dưới xương gót tới xương hộp và nền các xương đốt bàn. Nó giữ vòm dọc ngoài và tạo mái cho gân cơ mác dài.",
        en: "The longest ligament of the foot, from the underside of the calcaneus to the cuboid and metatarsal bases. It holds the lateral arch and roofs the fibularis longus tendon.",
        zh: "足部最长的韧带，自跟骨下面至骰骨和跖骨底，维持外侧纵弓并构成腓骨长肌腱的顶。",
      },
      ids: L(/^(left )?long plantar ligament$/i, ["connective"]),
    },
    {
      key: "dm-mu",
      tint: OXY,
      latin: "A. dorsalis pedis · A. arcuata",
      name: { vi: "Động mạch mu chân và cung", en: "Dorsalis pedis artery and arcuate artery", zh: "足背动脉与弓状动脉" },
      note: {
        vi: "Cho động mạch cổ chân ngoài, động mạch cung (tách động mạch mu đốt bàn) và nhánh gan chân sâu xuyên xuống nối cung gan chân. Mất mạch mu chân gặp trong bệnh động mạch ngoại biên; khoảng 10% người bình thường không bắt được mạch này.",
        en: "Gives the lateral tarsal artery, the arcuate artery (which gives the dorsal metatarsals) and the deep plantar branch, which dives to join the plantar arch. An absent dorsalis pedis pulse suggests peripheral arterial disease, though about 10% of healthy people lack a palpable one.",
        zh: "发出跗外侧动脉、弓状动脉（发出跖背动脉）和足底深支（下穿与足底弓吻合）。足背动脉搏动消失提示周围动脉病，但约10%正常人触不到。",
      },
      ids: L(/^(left |right )?(dorsalis pedis|arcuate|lateral tarsal|deep plantar) artery$|^dorsal digital artery of foot$/i, ART, 0, 0.12),
    },
    {
      key: "tm-mu",
      tint: DEOXY,
      latin: "Arcus venosus dorsalis pedis",
      name: { vi: "Cung tĩnh mạch mu chân", en: "Dorsal venous arch of the foot", zh: "足背静脉弓" },
      note: {
        vi: "Đầu trong của cung thành tĩnh mạch hiển lớn (đi trước mắt cá trong), đầu ngoài thành tĩnh mạch hiển bé (đi sau mắt cá ngoài).",
        en: "Its medial end becomes the great saphenous vein (in front of the medial malleolus), its lateral end the small saphenous vein (behind the lateral malleolus).",
        zh: "其内侧端延续为大隐静脉（经内踝前方），外侧端延续为小隐静脉（经外踝后方）。",
      },
      ids: L(/^dorsal venous arch of (left )?foot$/i, VEN, 0, 0.1),
    },
  ],
});

// ─────────────── 10. Vùng đùi sau (đổi chủ đề) ───────────────
emit({
  file: "hamstrings",
  script: "batch-b",
  exportName: "hamstringsScene",
  header: 'Scene "Vùng đùi sau" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Thần kinh tọa" cũ: atlas không có thần kinh ngoại biên chi dưới.',
  scene: {
    slug: "than-kinh-toa",
    system: "muscular",
    title: { vi: "Vùng đùi sau: nhóm cơ ụ ngồi–cẳng chân", en: "Posterior Thigh: the Hamstrings", zh: "大腿后区：腘绳肌" },
    latin: "Compartimentum femoris posterius",
    intro: {
      vi: "Khoang sau đùi chứa ba cơ đi từ ụ ngồi xuống cẳng chân: bán gân, bán màng và đầu dài nhị đầu đùi. Chúng bắt chéo cả hông lẫn gối, nên vừa duỗi hông vừa gấp gối. Đầu ngắn nhị đầu chỉ bắt chéo gối. Phần gân của cơ khép lớn cũng bám ụ ngồi và thường được xếp vào nhóm này. Căng rách cơ đùi sau là chấn thương hay gặp nhất khi chạy nước rút. Dây ngồi đi dọc giữa khoang nhưng bộ dữ liệu không có. Mỗi cơ một màu, xương và cơ mông mờ sẵn.",
      en: "The posterior compartment holds three muscles running from the ischial tuberosity to the leg: semitendinosus, semimembranosus and the long head of biceps femoris. They cross both hip and knee, so they extend the hip and flex the knee. The short head of biceps crosses only the knee. The hamstring part of adductor magnus also arises from the tuberosity and is often counted with them. Hamstring strain is the commonest injury in sprinting. The sciatic nerve runs down the middle of the compartment but is not in the dataset. Each muscle has its own colour; bones and gluteals are faded.",
      zh: "大腿后群有三块自坐骨结节至小腿的肌肉：半腱肌、半膜肌和股二头肌长头。它们跨髋和膝两关节，故伸髋并屈膝；股二头肌短头只跨膝。大收肌腘绳部也起于坐骨结节，常归入此组。腘绳肌拉伤是短跑中最常见的损伤。坐骨神经沿后群中线下行，但数据集中没有。每块肌肉一种颜色，骨骼和臀肌淡化。",
    },
  },
  faded: ["xuong", "mong"],
  frame: ["ban-gan", "ban-mang", "nhi-dau", "khep-lon"],
  groups: [
    {
      key: "ban-gan",
      tint: "#e39a7a",
      latin: "M. semitendinosus",
      name: { vi: "Cơ bán gân", en: "Semitendinosus", zh: "半腱肌" },
      note: {
        vi: "Nửa dưới là gân tròn dài, bám chân ngỗng. Gân này thường được lấy để tái tạo dây chằng chéo trước.",
        en: "Its lower half is a long round tendon to the pes anserinus, often harvested for anterior cruciate ligament reconstruction.",
        zh: "下半为细长圆腱，止于鹅足，常用于前交叉韧带重建。",
      },
      ids: L(/^(left |right )?semitendinosus$/i, MU),
    },
    {
      key: "ban-mang",
      tint: "#c9705f",
      latin: "M. semimembranosus",
      name: { vi: "Cơ bán màng", en: "Semimembranosus", zh: "半膜肌" },
      note: {
        vi: "Có màng gân dẹt ở đầu trên, nằm dưới cơ bán gân. Bám mặt sau lồi cầu trong xương chày và toả sợi làm dây chằng khoeo chéo.",
        en: "Has a flat membranous upper tendon and lies beneath semitendinosus. Inserts on the back of the medial tibial condyle and sends fibres as the oblique popliteal ligament.",
        zh: "上端为扁平膜状腱，位于半腱肌深面。止于胫骨内侧髁后面，并延续为腘斜韧带。",
      },
      ids: L(/^(left |right )?semimembranosus$/i, MU),
    },
    {
      key: "nhi-dau",
      tint: "#8a6fb0",
      latin: "M. biceps femoris (caput longum, caput breve)",
      name: { vi: "Cơ nhị đầu đùi (đầu dài, đầu ngắn)", en: "Biceps femoris (long and short heads)", zh: "股二头肌（长头、短头）" },
      note: {
        vi: "Đầu dài từ ụ ngồi, đầu ngắn từ đường ráp xương đùi; hội thành gân bám chỏm xương mác. Đầu dài là phần bị căng rách nhiều nhất.",
        en: "The long head arises from the ischial tuberosity and the short head from the linea aspera; they join in a tendon on the fibular head. The long head is the part most often strained.",
        zh: "长头起于坐骨结节，短头起于股骨粗线，合腱止于腓骨头。长头最常拉伤。",
      },
      ids: L(/head of (left |right )?biceps femoris$/i, MU),
    },
    {
      key: "khep-lon",
      tint: "#6f8fbf",
      latin: "M. adductor magnus",
      name: { vi: "Cơ khép lớn (phần gân – so sánh)", en: "Adductor magnus (hamstring part — for comparison)", zh: "大收肌（腘绳部——对照）" },
      note: {
        vi: "Phần ụ ngồi của nó do dây ngồi chi phối và duỗi hông giống nhóm đùi sau, nhưng không vượt qua gối.",
        en: "Its ischial part is supplied by the sciatic nerve and extends the hip like the hamstrings, but it does not cross the knee.",
        zh: "其坐骨部受坐骨神经支配，与腘绳肌同样伸髋，但不跨膝。",
      },
      ids: L(/^(left |right )?adductor magnus$/i, MU),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "Aa. perforantes",
      name: { vi: "Các động mạch xiên", en: "Perforating arteries", zh: "穿动脉" },
      note: {
        vi: "Tách từ động mạch đùi sâu, xuyên ra sau nuôi nhóm đùi sau. Khoang này không có động mạch lớn riêng.",
        en: "From the deep femoral artery, piercing backwards to feed the hamstrings — the compartment has no large artery of its own.",
        zh: "发自股深动脉，向后穿出供应腘绳肌——此群无自己的大动脉。",
      },
      ids: L(/^set of perforating arteries$/i, ART, 0.55, 0.9),
    },
    {
      key: "mong",
      tint: "#c9a79e",
      latin: "M. gluteus maximus",
      name: { vi: "Cơ mông lớn (mờ sẵn)", en: "Gluteus maximus (faded)", zh: "臀大肌（淡化）" },
      note: {
        vi: "Phủ lên nguyên uỷ của nhóm đùi sau ở ụ ngồi.",
        en: "Covers the hamstring origin at the ischial tuberosity.",
        zh: "覆盖坐骨结节处腘绳肌起点。",
      },
      ids: L(/^(left |right )?gluteus maximus$/i, MU),
    },
    {
      key: "xuong",
      latin: "Os coxae · Femur · Tibia · Fibula",
      name: { vi: "Xương chậu, đùi, chày, mác (mốc)", en: "Hip bone, femur, tibia, fibula (landmarks)", zh: "髋骨、股骨、胫骨、腓骨（标志）" },
      note: {
        vi: "Mờ sẵn. Chú ý ụ ngồi — nguyên uỷ chung của cả nhóm.",
        en: "Faded. Note the ischial tuberosity — the common origin of the group.",
        zh: "淡化。注意坐骨结节——本组的共同起点。",
      },
      ids: L(/^(left )?(hip bone|femur|tibia|fibula)$/i, BONE),
    },
  ],
});

// ─────────────── 11. Khoang cẳng chân trước và ngoài (đổi chủ đề) ───────────────
emit({
  file: "leg-anterior-lateral",
  script: "batch-b",
  exportName: "legAnteriorLateralScene",
  header: 'Scene "Khoang cẳng chân trước và ngoài" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Cơ mặt" cũ: atlas không có cơ bám da mặt.',
  scene: {
    slug: "co-mat",
    system: "muscular",
    title: { vi: "Khoang cẳng chân trước và ngoài", en: "Anterior and Lateral Compartments of the Leg", zh: "小腿前群与外侧群" },
    latin: "Compartimentum cruris anterius et laterale",
    intro: {
      vi: "Cẳng chân được xương chày, xương mác, màng gian cốt và vách gian cơ chia thành các khoang cân kín. Khoang trước chứa bốn cơ gấp mu và động mạch chày trước. Khoang ngoài chứa cơ mác dài và mác ngắn. Vì khoang bó chặt trong cân, chảy máu hay phù sau gãy xương chày làm áp lực tăng nhanh, gây hội chứng chèn ép khoang. Khoang trước bị nhiều nhất và phải mở cân cấp cứu. Mỗi khoang một tông màu, mạch máu đỏ–xanh, xương mờ sẵn.",
      en: "The tibia, fibula, interosseous membrane and intermuscular septa divide the leg into closed fascial compartments. The anterior compartment holds four dorsiflexors and the anterior tibial artery. The lateral compartment holds fibularis longus and brevis. Because they are tightly bound, bleeding or swelling after a tibial fracture raises the pressure fast and causes compartment syndrome. The anterior compartment is the most often affected and needs an emergency fasciotomy. Each compartment has its own colour family, vessels are red and blue, and bones are faded.",
      zh: "胫骨、腓骨、骨间膜和肌间隔将小腿分为封闭的骨筋膜鞘。前群含四块背屈肌和胫前动脉；外侧群含腓骨长肌和腓骨短肌。由于筋膜紧束，胫骨骨折后出血或水肿使压力迅速升高，引起骨筋膜室综合征，前群最常受累，需紧急切开减压。每群一种色系，血管红蓝，骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["truoc", "ngoai", "dm"],
  groups: [
    {
      key: "truoc",
      tint: "#6f8fbf",
      latin: "Mm. tibialis anterior, extensor hallucis longus, extensor digitorum longus, fibularis tertius",
      name: { vi: "Khoang trước: bốn cơ gấp mu", en: "Anterior compartment: four dorsiflexors", zh: "前群：四块背屈肌" },
      note: {
        vi: "Từ trong ra ngoài: chày trước, duỗi dài ngón cái, duỗi dài các ngón, mác ba. Gân chày trước là gân nổi rõ nhất ở trước cổ chân khi kéo mũi chân lên. Dây mác sâu chi phối.",
        en: "From medial to lateral: tibialis anterior, extensor hallucis longus, extensor digitorum longus, fibularis tertius. The tibialis anterior tendon is the most prominent at the front of the ankle when the toes are pulled up. Supplied by the deep fibular nerve.",
        zh: "由内向外：胫骨前肌、拇长伸肌、趾长伸肌、第三腓骨肌。勾脚时胫骨前肌腱在踝前最为明显。受腓深神经支配。",
      },
      ids: L(/^(left |right )?(tibialis anterior|extensor hallucis longus|extensor digitorum longus|fibularis tertius)$/i, MU, 0, 0.5),
    },
    {
      key: "mu-chan",
      tint: "#8fb0c8",
      latin: "M. extensor hallucis brevis",
      name: { vi: "Cơ duỗi ngắn ngón cái (mu chân)", en: "Extensor hallucis brevis (dorsum of foot)", zh: "拇短伸肌（足背）" },
      note: {
        vi: "Cơ nội tại duy nhất ở mu chân có trong bộ dữ liệu, cũng do dây mác sâu chi phối.",
        en: "The only intrinsic muscle of the dorsum in the dataset; also supplied by the deep fibular nerve.",
        zh: "数据集中足背唯一的足固有肌，亦受腓深神经支配。",
      },
      ids: L(/^(left |right )?extensor hallucis brevis$/i, MU, 0, 0.15),
    },
    {
      key: "ngoai",
      tint: "#e8883d",
      latin: "Mm. fibularis longus et brevis",
      name: { vi: "Khoang ngoài: mác dài và mác ngắn", en: "Lateral compartment: fibularis longus and brevis", zh: "外侧群：腓骨长肌与腓骨短肌" },
      note: {
        vi: "Lật ngoài bàn chân. Mác dài còn đỡ vòm ngang khi luồn dưới gan chân. Dây mác nông chi phối.",
        en: "They evert the foot; fibularis longus also supports the transverse arch as it crosses the sole. Supplied by the superficial fibular nerve.",
        zh: "使足外翻；腓骨长肌腱经足底时还支撑横弓。受腓浅神经支配。",
      },
      ids: L(/^(left |right )?fibularis (longus|brevis)$/i, MU, 0, 0.5),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "A. tibialis anterior → A. dorsalis pedis",
      name: { vi: "Động mạch chày trước và mu chân", en: "Anterior tibial and dorsalis pedis arteries", zh: "胫前动脉与足背动脉" },
      note: {
        vi: "Xuyên màng gian cốt vào khoang trước, đi xuống trên màng này, qua trước cổ chân thành động mạch mu chân. Khoang ngoài không có động mạch riêng; máu nuôi đến từ nhánh động mạch mác.",
        en: "Pierces the interosseous membrane into the anterior compartment, descends on it and crosses the ankle as the dorsalis pedis. The lateral compartment has no artery of its own and is fed by fibular branches.",
        zh: "穿骨间膜入前群，沿骨间膜下行，经踝前成为足背动脉。外侧群无自己的动脉，由腓动脉分支供血。",
      },
      ids: L(/^(left |right )?(anterior tibial|anterior tibial recurrent|dorsalis pedis) artery$/i, ART, 0, 0.5),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. tibiales anteriores",
      name: { vi: "Tĩnh mạch chày trước", en: "Anterior tibial veins", zh: "胫前静脉" },
      note: {
        vi: "Đi kèm động mạch, đổ lên tĩnh mạch khoeo.",
        en: "Accompany the artery and drain up to the popliteal vein.",
        zh: "伴行动脉，上行注入腘静脉。",
      },
      ids: L(/^(left |right )?anterior tibial vein$/i, VEN, 0, 0.5),
    },
    {
      key: "mang",
      tint: "#9fb8a0",
      latin: "Membrana interossea cruris",
      name: { vi: "Màng gian cốt cẳng chân", en: "Interosseous membrane of the leg", zh: "小腿骨间膜" },
      note: {
        vi: "Vách sau của khoang trước, cũng là chỗ bám của nhiều cơ.",
        en: "The back wall of the anterior compartment and an attachment for many muscles.",
        zh: "前群的后壁，也是多块肌肉的附着处。",
      },
      ids: L(/^interosseous membrane of (left )?leg$/i, ["connective"]),
    },
    {
      key: "xuong",
      latin: "Tibia · Fibula · Ossa pedis",
      name: { vi: "Xương chày, mác và bàn chân (mốc)", en: "Tibia, fibula and foot bones (landmarks)", zh: "胫骨、腓骨与足骨（标志）" },
      note: {
        vi: "Mờ sẵn. Mặt trong xương chày nằm ngay dưới da, không có cơ che.",
        en: "Faded. The medial surface of the tibia lies just under the skin with no muscle cover.",
        zh: "淡化。胫骨内侧面直接位于皮下，无肌肉覆盖。",
      },
      ids: L(/^(left )?(tibia|fibula)$/i, BONE).concat(L(FOOT_BONES, BONE)),
    },
  ],
});

// ─────────────── 12. Bốn lớp cơ gan chân (đổi chủ đề) ───────────────
emit({
  file: "plantar-layers",
  script: "batch-b",
  exportName: "plantarLayersScene",
  header: 'Scene "Bốn lớp cơ gan chân" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Tủy sống và đám rối" cũ: atlas chỉ có ống trung tâm tủy, không có tủy sống và rễ thần kinh.',
  scene: {
    slug: "tuy-song-dam-roi",
    system: "muscular",
    title: { vi: "Bốn lớp cơ gan chân", en: "The Four Layers of the Sole", zh: "足底四层肌" },
    latin: "Musculi plantae pedis",
    intro: {
      vi: "Cơ gan chân xếp thành bốn lớp dưới cân gan chân. Lớp 1 gồm dạng ngón cái, gấp ngắn các ngón và dạng ngón út. Lớp 2 gồm cơ vuông gan chân, các cơ giun, cùng gân gấp dài các ngón và gấp dài ngón cái. Lớp 3 gồm gấp ngắn ngón cái, khép ngón cái và gấp ngắn ngón út. Lớp 4 gồm các cơ gian cốt, cùng gân chày sau và mác dài. Chúng giữ vòm bàn chân khi đứng và bước. Mạch gan chân đi giữa lớp 1 và lớp 2, còn cung gan chân nằm giữa lớp 3 và lớp 4. Mỗi lớp một màu, xương mờ sẵn.",
      en: "The muscles of the sole lie in four layers beneath the plantar aponeurosis. Layer 1 is abductor hallucis, flexor digitorum brevis and abductor digiti minimi. Layer 2 is quadratus plantae and the lumbricals, with the flexor digitorum longus and flexor hallucis longus tendons. Layer 3 is flexor hallucis brevis, adductor hallucis and flexor digiti minimi brevis. Layer 4 is the interossei, with the tibialis posterior and fibularis longus tendons. They hold the arches in standing and walking. The plantar vessels run between layers 1 and 2; the plantar arch lies between layers 3 and 4. Each layer has its own colour and bones are faded.",
      zh: "足底肌在足底腱膜下分四层：第1层为拇展肌、趾短屈肌、小趾展肌；第2层为足底方肌、蚓状肌及趾长屈肌腱、拇长屈肌腱；第3层为拇短屈肌、拇收肌、小趾短屈肌；第4层为骨间肌及胫骨后肌腱、腓骨长肌腱。它们在站立和行走时维持足弓。足底血管行于第1、2层之间，足底弓位于第3、4层之间。每层一种颜色，骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["lop1", "lop2", "lop3", "lop4"],
  groups: [
    {
      key: "lop1",
      tint: "#e39a7a",
      latin: "Mm. abductor hallucis, flexor digitorum brevis, abductor digiti minimi",
      name: { vi: "Lớp 1 (nông nhất)", en: "Layer 1 (most superficial)", zh: "第1层（最浅）" },
      note: {
        vi: "Ba cơ nằm song song từ củ xương gót ra trước. Gấp ngắn các ngón ở giữa gấp đốt giữa ngón II–V.",
        en: "Three parallel muscles running forward from the calcaneal tuberosity. Flexor digitorum brevis, in the middle, flexes the middle phalanges of toes 2–5.",
        zh: "三块肌自跟骨结节向前平行排列。居中的趾短屈肌屈第2–5趾中节。",
      },
      ids: L(/^(left |right )?(abductor hallucis|flexor digitorum brevis)$|^abductor digiti minimi of (left )?foot$/i, MU, 0, 0.12),
    },
    {
      key: "lop2",
      tint: "#c9705f",
      latin: "M. quadratus plantae · Mm. lumbricales",
      name: { vi: "Lớp 2: vuông gan chân và cơ giun", en: "Layer 2: quadratus plantae and lumbricals", zh: "第2层：足底方肌与蚓状肌" },
      note: {
        vi: "Cơ vuông gan chân bám vào gân gấp dài các ngón, nắn thẳng hướng kéo chéo của gân. Bốn cơ giun mọc từ các gân này, gấp khớp đốt bàn–ngón.",
        en: "Quadratus plantae attaches to the flexor digitorum longus tendon and straightens its oblique pull. The four lumbricals arise from these tendons and flex the metatarsophalangeal joints.",
        zh: "足底方肌附着于趾长屈肌腱，校正其斜向牵拉；四块蚓状肌起自这些肌腱，屈跖趾关节。",
      },
      ids: L(/^(left |right )?flexor accessorius$|lumbrical of (left )?foot$/i, MU, 0, 0.12),
    },
    {
      key: "lop3",
      tint: "#e6c14a",
      latin: "Mm. flexor hallucis brevis, adductor hallucis, flexor digiti minimi brevis",
      name: { vi: "Lớp 3: cơ ngắn của ngón cái và ngón út", en: "Layer 3: short muscles of the big and little toes", zh: "第3层：拇趾与小趾的短肌" },
      note: {
        vi: "Gấp ngắn ngón cái có hai đầu, mỗi đầu chứa một xương vừng. Khép ngón cái có đầu chéo và đầu ngang, giữ vòm ngang. Cơ đối ngón út ở chân chỉ là thớ nhỏ của gấp ngắn ngón út.",
        en: "Flexor hallucis brevis has two heads, each containing a sesamoid. Adductor hallucis has oblique and transverse heads and holds the transverse arch. Opponens digiti minimi of the foot is only a small slip of flexor digiti minimi brevis.",
        zh: "拇短屈肌两头各含一籽骨。拇收肌有斜头和横头，维持横弓。足的小趾对跖肌仅为小趾短屈肌的小束。",
      },
      ids: L(/head of (left |right )?(flexor hallucis brevis|adductor hallucis)$|^(flexor digiti minimi brevis|opponens digiti minimi) of (left )?foot$/i, MU, 0, 0.12),
    },
    {
      key: "lop4",
      tint: "#8fb0c8",
      latin: "Mm. interossei plantares",
      name: { vi: "Lớp 4 (sâu nhất): cơ gian cốt gan chân", en: "Layer 4 (deepest): plantar interossei", zh: "第4层（最深）：骨间足底肌" },
      note: {
        vi: "Ba cơ gian cốt gan chân khép các ngón III–V về trục ngón II. Bộ dữ liệu không có cơ gian cốt mu chân (dạng ngón).",
        en: "The three plantar interossei adduct toes 3–5 towards the axis of the second toe. The dataset lacks the dorsal interossei (the abductors).",
        zh: "三块骨间足底肌使第3–5趾向第2趾轴线内收。数据集中无骨间背侧肌（外展肌）。",
      },
      ids: L(/plantar interosseous of (left )?foot$/i, MU, 0, 0.12),
    },
    {
      key: "gan-dai",
      tint: "#b58bc4",
      latin: "Tendines mm. flexoris digitorum longi et flexoris hallucis longi",
      name: { vi: "Gân gấp dài (đi trong lớp 2)", en: "Long flexor tendons (in layer 2)", zh: "长屈肌腱（行于第2层）" },
      note: {
        vi: "Hai gân này bắt chéo nhau ở gan chân (nút Henry), gân gấp dài ngón cái đi dưới.",
        en: "The two tendons cross in the sole (the knot of Henry), flexor hallucis longus passing deep.",
        zh: "二腱在足底交叉（Henry结），拇长屈肌腱行于深面。",
      },
      ids: L(/^(left |right )?(flexor digitorum longus|flexor hallucis longus)$/i, MU, 0, 0.5),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "Aa. plantares medialis et lateralis · Arcus plantaris",
      name: { vi: "Động mạch gan chân và cung gan chân", en: "Plantar arteries and plantar arch", zh: "足底动脉与足底弓" },
      note: {
        vi: "Động mạch gan chân ngoài lớn hơn, vòng vào sâu thành cung gan chân và nối với nhánh gan chân sâu của động mạch mu chân. Từ cung tách động mạch gan đốt bàn và gan ngón.",
        en: "The lateral plantar artery is larger and curves deep to form the plantar arch, joining the deep plantar branch of the dorsalis pedis. The arch gives the plantar metatarsal and digital arteries.",
        zh: "足底外侧动脉较大，向深部弯曲形成足底弓，与足背动脉的足底深支吻合。弓发出跖足底动脉和趾足底动脉。",
      },
      ids: L(/^(left |right )?(medial plantar|lateral plantar|superficial medial plantar) artery$|^(left )?plantar arch$|^plantar metatarsal artery$|plantar digital arteries/i, ART, 0, 0.1),
    },
    {
      key: "xuong",
      latin: "Ossa pedis",
      name: { vi: "Xương bàn chân (mốc)", en: "Foot bones (landmarks)", zh: "足骨（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: L(FOOT_BONES, BONE),
    },
  ],
});

// ─────────────── 13. Cơ thắt lưng–chậu (đổi chủ đề) ───────────────
emit({
  file: "iliopsoas",
  script: "batch-b",
  exportName: "iliopsoasScene",
  header: 'Scene "Cơ thắt lưng–chậu" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Ống sống thắt lưng" cũ: atlas không có tủy, chùm đuôi ngựa, dây chằng vàng. Thiếu cơ thắt lưng bé, cơ vuông thắt lưng.',
  scene: {
    slug: "ong-song-that-lung",
    system: "muscular",
    title: { vi: "Cơ thắt lưng–chậu", en: "The Iliopsoas", zh: "髂腰肌" },
    latin: "M. iliopsoas",
    intro: {
      vi: "Cơ thắt lưng–chậu là cầu nối duy nhất bằng cơ giữa cột sống và chi dưới. Cơ thắt lưng lớn đi từ thân và mỏm ngang T12–L5, chạy dọc bờ chậu hông. Cơ chậu phủ hố chậu. Hai cơ chung gân chui dưới dây chằng bẹn, bám mấu chuyển bé xương đùi. Đây là cơ gấp hông mạnh nhất. Ổ áp xe cạnh cột sống có thể lan theo bao cơ thắt lưng xuống tận bẹn. Động mạch và tĩnh mạch chậu ngoài chạy dọc bờ trong cơ thắt lưng. Bộ dữ liệu không có cơ thắt lưng bé và cơ vuông thắt lưng.",
      en: "The iliopsoas is the only muscular bridge between the spine and the lower limb. Psoas major arises from the bodies and transverse processes of T12–L5 and runs along the pelvic brim. Iliacus fills the iliac fossa. They share a tendon that passes under the inguinal ligament to the lesser trochanter. This is the strongest hip flexor. A paraspinal abscess can track down inside the psoas sheath as far as the groin. The external iliac artery and vein run along the medial border of psoas. The dataset has no psoas minor or quadratus lumborum.",
      zh: "髂腰肌是脊柱与下肢之间唯一的肌性桥梁。腰大肌起于T12–L5椎体和横突，沿骨盆上口下行；髂肌占据髂窝。二肌共腱经腹股沟韧带下方止于股骨小转子，是最强的屈髋肌。脊柱旁脓肿可沿腰大肌鞘下行至腹股沟。髂外动静脉沿腰大肌内侧缘走行。数据集中无腰小肌和腰方肌。",
    },
  },
  faded: ["xuong"],
  frame: ["that-lung", "chau", "xuong"],
  groups: [
    {
      key: "that-lung",
      tint: "#c9705f",
      latin: "M. psoas major",
      name: { vi: "Cơ thắt lưng lớn", en: "Psoas major", zh: "腰大肌" },
      note: {
        vi: "Đám rối thắt lưng nằm ngay trong khối cơ này, nên cơ co cứng có thể kích thích dây đùi. Khi ngồi dậy từ tư thế nằm, cơ kéo cột sống thắt lưng ưỡn ra trước.",
        en: "The lumbar plexus lies within this muscle, so spasm can irritate the femoral nerve. When sitting up from lying, it pulls the lumbar spine forward into lordosis.",
        zh: "腰丛位于此肌内部，痉挛可刺激股神经。从卧位坐起时它将腰椎拉向前方。",
      },
      ids: byRe(/^(left |right )?psoas major$/i, ["muscular"]),
    },
    {
      key: "chau",
      tint: "#e8883d",
      latin: "M. iliacus",
      name: { vi: "Cơ chậu", en: "Iliacus", zh: "髂肌" },
      note: {
        vi: "Hình quạt phủ hố chậu, hội vào bờ ngoài gân cơ thắt lưng. Máu tụ trong cơ chậu (ở người dùng thuốc chống đông) có thể chèn dây đùi.",
        en: "Fan-shaped, filling the iliac fossa and joining the lateral side of the psoas tendon. A haematoma in iliacus (in anticoagulated patients) can compress the femoral nerve.",
        zh: "扇形，占据髂窝，并入腰大肌腱外侧。髂肌内血肿（抗凝患者）可压迫股神经。",
      },
      ids: byRe(/^(left |right )?iliacus$/i, ["muscular"]),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "Aa. iliacae communes et externae",
      name: { vi: "Động mạch chậu chung và chậu ngoài", en: "Common and external iliac arteries", zh: "髂总动脉与髂外动脉" },
      note: {
        vi: "Chạy dọc bờ trong cơ thắt lưng lớn tới dây chằng bẹn.",
        en: "Run along the medial border of psoas major to the inguinal ligament.",
        zh: "沿腰大肌内侧缘下行至腹股沟韧带。",
      },
      ids: byRe(/^(left |right )?(common|external) iliac artery$/i, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. iliacae communes et externae",
      name: { vi: "Tĩnh mạch chậu chung và chậu ngoài", en: "Common and external iliac veins", zh: "髂总静脉与髂外静脉" },
      note: {
        vi: "Nằm sau trong động mạch cùng tên.",
        en: "Lie posteromedial to the arteries of the same name.",
        zh: "位于同名动脉的后内侧。",
      },
      ids: byRe(/^(left |right )?(common|external) iliac vein$/i, VEN),
    },
    {
      key: "xuong",
      latin: "Vertebrae lumbales · Os coxae · Femur",
      name: { vi: "Cột sống thắt lưng, xương chậu, đùi (mốc)", en: "Lumbar spine, hip bones, femora (landmarks)", zh: "腰椎、髋骨、股骨（标志）" },
      note: {
        vi: "Mờ sẵn — thấy nguyên uỷ ở thân và mỏm ngang đốt sống và chỗ bám ở mấu chuyển bé.",
        en: "Faded — showing the origin from the vertebral bodies and transverse processes and the insertion on the lesser trochanter.",
        zh: "淡化——显示起于椎体和横突、止于小转子。",
      },
      ids: byRe(/^(first|second|third|fourth|fifth) lumbar vertebra$|^twelfth thoracic vertebra$|^(left |right )?hip bone$|^sacrum$/i, BONE).concat(byRe(/^(left |right )?femur$/i, BONE)),
    },
  ],
});

// ───────────────────────── 14. Khớp cùng–chậu ─────────────────────────
emit({
  file: "sacroiliac",
  script: "batch-b",
  exportName: "sacroiliacScene",
  header: 'Scene "Khớp cùng–chậu và vành chậu" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng cùng–chậu, cùng–gai, cùng–củ và xương cụt.',
  scene: {
    slug: "khop-cung-chau",
    title: { vi: "Khớp cùng–chậu và vành chậu", en: "The Sacroiliac Joint and Pelvic Ring", zh: "骶髂关节与骨盆环" },
    latin: "Articulatio sacroiliaca · Cingulum pelvicum",
    intro: {
      vi: "Vành chậu là một vòng xương khép kín. Phía sau là xương cùng, kẹp giữa hai xương chậu bằng hai khớp cùng–chậu. Phía trước hai xương chậu gặp nhau ở khớp mu. Khớp cùng–chậu gần như không cử động. Mặt khớp gồ ghề, cài vào nhau, cùng các dây chằng rất khoẻ phía sau, truyền toàn bộ sức nặng thân mình xuống chi dưới. Vì là vòng kín, vỡ vành chậu thường gãy ở hai chỗ. Cơ hình lê đi qua khuyết ngồi lớn và là mốc của vùng này. Bộ dữ liệu không có dây chằng và xương cụt.",
      en: "The pelvic ring is a closed ring of bone. Behind, the sacrum is wedged between the two hip bones at the two sacroiliac joints. In front, the hip bones meet at the pubic symphysis. The sacroiliac joint barely moves. Its rough, interlocking surfaces and very strong posterior ligaments carry the whole weight of the trunk to the lower limbs. Because the ring is closed, pelvic ring fractures usually break in two places. Piriformis passes through the greater sciatic notch and is the key landmark here. The dataset has no ligaments or coccyx.",
      zh: "骨盆环是闭合的骨环：后方骶骨借两侧骶髂关节嵌于两髋骨之间，前方两髋骨在耻骨联合相接。骶髂关节几乎不动，其粗糙交锁的关节面和强大的后部韧带将躯干全部重量传至下肢。由于为闭合环，骨盆环骨折常有两处断裂。梨状肌穿坐骨大切迹，是本区关键标志。数据集中无韧带和尾骨。",
    },
  },
  frame: ["cung", "chau", "l5"],
  groups: [
    {
      key: "cung",
      tint: "#e6c14a",
      latin: "Os sacrum",
      name: { vi: "Xương cùng", en: "Sacrum", zh: "骶骨" },
      note: {
        vi: "Năm đốt cùng dính thành một khối tam giác. Mặt nhĩ ở hai bên khớp với xương chậu. Các lỗ cùng trước cho các nhánh trước dây sống cùng đi ra.",
        en: "Five sacral vertebrae fused into a triangle. The auricular surfaces on each side articulate with the hip bones. The anterior sacral foramina transmit the anterior rami of the sacral nerves.",
        zh: "五块骶椎融合成三角形骨块。两侧耳状面与髋骨相关节。骶前孔有骶神经前支穿出。",
      },
      ids: byRe(/^sacrum$/i, BONE),
    },
    {
      key: "chau",
      tint: "#d9cfb8",
      latin: "Os coxae (ilium, ischium, pubis)",
      name: { vi: "Hai xương chậu", en: "The two hip bones", zh: "两块髋骨" },
      note: {
        vi: "Mỗi xương do cánh chậu, xương ngồi, xương mu dính lại ở ổ cối, hoàn tất lúc khoảng 16–18 tuổi. Mào chậu ngang mức L4, là mốc chọc dò tuỷ sống.",
        en: "Each is the ilium, ischium and pubis fused at the acetabulum, complete by about 16–18 years. The iliac crests lie level with L4, the landmark for lumbar puncture.",
        zh: "每块由髂骨、坐骨、耻骨在髋臼处融合而成，约16–18岁完成。两侧髂嵴最高点连线平L4，为腰椎穿刺标志。",
      },
      ids: byRe(/^(left |right )?hip bone$/i, BONE),
    },
    {
      key: "l5",
      tint: "#8fb0c8",
      latin: "Vertebra L5 · Discus L5–S1",
      name: { vi: "Đốt sống L5 và đĩa L5–S1", en: "L5 vertebra and the L5–S1 disc", zh: "L5椎骨与L5–S1椎间盘" },
      note: {
        vi: "Khớp thắt lưng–cùng chịu lực cắt lớn vì mặt trên xương cùng nghiêng ra trước. Đĩa L5–S1 cùng L4–L5 là hai đĩa thoát vị nhiều nhất.",
        en: "The lumbosacral junction bears high shear because the top of the sacrum tilts forward. The L5–S1 disc, with L4–L5, is the one most often herniated.",
        zh: "由于骶骨上面前倾，腰骶连接承受较大剪力。L5–S1与L4–L5椎间盘是最常突出的两个。",
      },
      ids: byRe(/^fifth lumbar vertebra$|^intervertebral disk of fifth lumbar vertebra$/i, BONE),
    },
    {
      key: "hinh-le",
      tint: "#c9705f",
      latin: "M. piriformis",
      name: { vi: "Cơ hình lê", en: "Piriformis", zh: "梨状肌" },
      note: {
        vi: "Mọc từ mặt trước xương cùng, qua khuyết ngồi lớn tới mấu chuyển lớn. Nó chia khuyết ngồi lớn thành hai lỗ trên và dưới cơ hình lê. Dây ngồi thường ra ở lỗ dưới; khi dây xuyên qua cơ có thể gây hội chứng cơ hình lê.",
        en: "Arises from the front of the sacrum and passes through the greater sciatic notch to the greater trochanter. It divides the notch into spaces above and below it. The sciatic nerve usually exits below it; when the nerve pierces the muscle, piriformis syndrome can result.",
        zh: "起于骶骨前面，穿坐骨大切迹止于大转子，将坐骨大孔分为梨状肌上孔和下孔。坐骨神经通常经下孔穿出；神经穿过肌肉时可致梨状肌综合征。",
      },
      ids: byRe(/^(left |right )?piriformis$/i, ["muscular"]),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. sacrales laterales · V. sacralis mediana · V. iliolumbalis",
      name: { vi: "Tĩnh mạch cùng và chậu–thắt lưng", en: "Sacral and iliolumbar veins", zh: "骶静脉与髂腰静脉" },
      note: {
        vi: "Đám rối tĩnh mạch trước xương cùng rất dày. Gãy xương cùng hoặc mổ vùng này có thể chảy máu khó cầm.",
        en: "The presacral venous plexus is dense; sacral fractures or surgery here can bleed heavily and be hard to control.",
        zh: "骶前静脉丛密集，骶骨骨折或手术时出血难以控制。",
      },
      ids: byRe(/^(left |right )?lateral sacral vein$|^median sacral vein$|^(left |right )?iliolumbar vein$/i, VEN),
    },
  ],
});

// ─────────────── 15. Tĩnh mạch chậu hông (đổi chủ đề) ───────────────
emit({
  file: "pelvic-veins",
  script: "batch-b",
  exportName: "pelvicVeinsScene",
  header: 'Scene "Tĩnh mạch vùng chậu hông" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Đám rối thắt lưng–cùng" cũ: atlas không có thần kinh ngoại biên. Atlas không có ĐM mông, ĐM thẹn trong.',
  scene: {
    slug: "dam-roi-that-lung-cung",
    system: "cardiovascular",
    title: { vi: "Hệ tĩnh mạch chậu", en: "The Iliac Venous System", zh: "髂静脉系统" },
    latin: "Vv. iliacae et tributaria",
    intro: {
      vi: "Máu từ chi dưới và chậu hông về tim qua hệ tĩnh mạch chậu. Tĩnh mạch chậu ngoài nối tiếp tĩnh mạch đùi. Tĩnh mạch chậu trong nhận máu từ thành chậu (mông, bịt, cùng) và tạng chậu (thẹn trong, trực tràng). Hai tĩnh mạch hợp thành tĩnh mạch chậu chung trước khớp cùng–chậu. Hai tĩnh mạch chậu chung hợp thành tĩnh mạch chủ dưới ngang L5. Tĩnh mạch chậu chung trái bị động mạch chậu chung phải đè lên. Đó là lý do huyết khối tĩnh mạch sâu gặp ở chân trái nhiều hơn (hội chứng May–Thurner). Mỗi nhóm nhánh một sắc xanh; động mạch và xương mờ sẵn.",
      en: "Blood from the lower limbs and pelvis returns through the iliac veins. The external iliac vein continues the femoral vein. The internal iliac vein collects from the pelvic wall (gluteal, obturator, sacral) and pelvic organs (internal pudendal, rectal). The two join as the common iliac vein in front of the sacroiliac joint. The two common iliacs form the inferior vena cava at L5. The left common iliac vein is pinched by the right common iliac artery crossing over it. That is why deep vein thrombosis is more common in the left leg (May–Thurner syndrome). Each tributary group has its own shade of blue; arteries and bones are faded.",
      zh: "下肢和盆部血液经髂静脉系统回心。髂外静脉续于股静脉；髂内静脉收集盆壁（臀、闭孔、骶）和盆腔脏器（阴部内、直肠）的血液。二者在骶髂关节前方合成髂总静脉，两侧髂总静脉在L5平面汇成下腔静脉。左髂总静脉受右髂总动脉跨越压迫，故左下肢深静脉血栓更常见（May–Thurner综合征）。每组属支一种蓝色调，动脉和骨骼淡化。",
    },
  },
  faded: ["dm", "xuong"],
  frame: ["chung", "ngoai", "trong", "thanh", "tang"],
  groups: [
    {
      key: "chung",
      tint: "#34597a",
      latin: "Vv. iliacae communes · V. sacralis mediana",
      name: { vi: "Tĩnh mạch chậu chung và cùng giữa", en: "Common iliac and median sacral veins", zh: "髂总静脉与骶正中静脉" },
      note: {
        vi: "Tĩnh mạch chủ dưới nằm bên phải động mạch chủ. Vì thế tĩnh mạch chậu chung trái dài hơn và phải băng qua đường giữa.",
        en: "The inferior vena cava lies to the right of the aorta, so the left common iliac vein is longer and must cross the midline.",
        zh: "下腔静脉位于主动脉右侧，故左髂总静脉较长且须跨越中线。",
      },
      ids: byRe(/^(left |right )?common iliac vein$|^median sacral vein$/i, VEN),
    },
    {
      key: "ngoai",
      tint: DEOXY,
      latin: "V. iliaca externa · V. epigastrica inferior",
      name: { vi: "Tĩnh mạch chậu ngoài và thượng vị dưới", en: "External iliac and inferior epigastric veins", zh: "髂外静脉与腹壁下静脉" },
      note: {
        vi: "Chạy dọc bờ chậu hông, nằm trong động mạch. Tĩnh mạch thượng vị dưới đổ vào ngay trên dây chằng bẹn.",
        en: "Runs along the pelvic brim medial to the artery. The inferior epigastric vein joins it just above the inguinal ligament.",
        zh: "沿骨盆上口行于动脉内侧。腹壁下静脉在腹股沟韧带稍上方注入。",
      },
      ids: byRe(/^(left |right )?(external iliac|inferior epigastric) vein$/i, VEN),
    },
    {
      key: "trong",
      tint: "#6f93b8",
      latin: "V. iliaca interna",
      name: { vi: "Tĩnh mạch chậu trong", en: "Internal iliac vein", zh: "髂内静脉" },
      note: {
        vi: "Thân ngắn nằm sâu trong chậu hông, sau trong động mạch cùng tên. Các nhánh của nó nối rộng với nhau thành đám rối quanh tạng.",
        en: "A short trunk deep in the pelvis, posteromedial to its artery; its tributaries interconnect widely as plexuses around the organs.",
        zh: "短干，深居盆内，位于同名动脉后内侧；其属支在脏器周围广泛吻合成丛。",
      },
      ids: byRe(/^(left |right )?internal iliac vein$/i, VEN),
    },
    {
      key: "thanh",
      tint: "#8fb0c8",
      latin: "Vv. gluteae, obturatoria, sacrales laterales, iliolumbalis",
      name: { vi: "Nhánh thành: mông, bịt, cùng ngoài, chậu–thắt lưng", en: "Parietal tributaries: gluteal, obturator, lateral sacral, iliolumbar", zh: "壁支：臀、闭孔、骶外侧、髂腰静脉" },
      note: {
        vi: "Tĩnh mạch mông trên và dưới đi qua lỗ trên và dưới cơ hình lê. Tĩnh mạch bịt đi qua ống bịt.",
        en: "The superior and inferior gluteal veins pass above and below piriformis; the obturator vein passes through the obturator canal.",
        zh: "臀上、下静脉分别经梨状肌上、下孔；闭孔静脉经闭膜管。",
      },
      ids: byRe(/^(left |right )?(superior gluteal|inferior gluteal|obturator|lateral sacral|iliolumbar) vein$/i, VEN),
    },
    {
      key: "tang",
      tint: "#4a7a8c",
      latin: "V. pudenda interna · V. rectalis superior",
      name: { vi: "Nhánh tạng: thẹn trong, trực tràng trên", en: "Visceral tributaries: internal pudendal, superior rectal", zh: "脏支：阴部内静脉、直肠上静脉" },
      note: {
        vi: "Tĩnh mạch trực tràng trên đổ về tĩnh mạch mạc treo tràng dưới (hệ cửa). Tĩnh mạch trực tràng giữa và dưới đổ về hệ chủ. Vì thế trực tràng là một vòng nối cửa–chủ; tăng áp cửa làm giãn các tĩnh mạch này.",
        en: "The superior rectal vein drains to the inferior mesenteric (portal system), while the middle and inferior rectal veins drain to the caval system. So the rectum is a portocaval anastomosis, and portal hypertension dilates these veins.",
        zh: "直肠上静脉汇入肠系膜下静脉（门静脉系），直肠中、下静脉汇入腔静脉系，故直肠为门腔吻合部位，门静脉高压时这些静脉扩张。",
      },
      ids: byRe(/^(left |right )?internal pudendal vein$|^superior rectal vein$/i, VEN),
    },
    {
      key: "dm",
      tint: "#d99a8f",
      latin: "Aa. iliacae communes, internae, externae",
      name: { vi: "Động mạch chậu (mờ sẵn — đối chiếu)", en: "Iliac arteries (faded — for comparison)", zh: "髂动脉（淡化——对照）" },
      note: {
        vi: "Bỏ mờ để thấy động mạch chậu chung phải băng ngang trước tĩnh mạch chậu chung trái.",
        en: "Unfade to see the right common iliac artery crossing in front of the left common iliac vein.",
        zh: "取消淡化可见右髂总动脉跨越左髂总静脉前方。",
      },
      ids: byRe(/^(left |right )?(common|internal|external) iliac artery$/i, ART),
    },
    {
      key: "xuong",
      latin: "Os sacrum · Ossa coxae · L5",
      name: { vi: "Xương chậu, cùng, L5 (mốc)", en: "Pelvic bones and L5 (landmarks)", zh: "骨盆骨与L5（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: byRe(/^sacrum$|^(left |right )?hip bone$|^fifth lumbar vertebra$/i, BONE),
    },
  ],
});
