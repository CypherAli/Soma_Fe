/**
 * Đợt 4F — sáu slug cuối còn chạy Z-Anatomy, dựng từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-batch-f.mjs
 *
 *   moc-xuong-chi-tren / moc-xuong-chi-duoi — GIỮ chủ đề: atlas không có sụn
 *     tiếp hợp, nên mốc cốt hoá được dạy trong ghi chú từng xương.
 *   mo-lien-ket — GIỮ chủ đề: gom mọi mô liên kết đặc atlas có.
 *   ĐỔI CHỦ ĐỀ:
 *     co-truoc-cot-song-co → Cơ trước cột sống cổ và cơ bậc thang (bài riêng, giữ mô hình tai Z-Anatomy)
 *     he-mac         → Vòng mạch tuỵ–tá tràng (atlas không có mạc)
 *     tuyen-noi-tiet → Lỗ trên lồng ngực (trùng "he-noi-tiet"; atlas không có tuyến giáp)
 */
import { byRe, emit, leftSide, betweenY, OXY, DEOXY } from "./lib.mjs";

const ART = ["arterial"];
const VEN = ["venous"];
const BONE = ["skeletal"];
const SIDE = "(left |right )?";
const R = (s, sys) => byRe(new RegExp(s, "i"), sys);
const L = (s, sys, y0 = 0, y1 = 1.6) => betweenY(leftSide(R(s, sys)), y0, y1);

// ───────────────────── 1. Xương chi trên và mốc cốt hoá ─────────────────────
emit({
  file: "upper-limb-ossification",
  script: "batch-f",
  exportName: "upperLimbOssificationScene",
  header: 'Scene "Xương chi trên và mốc cốt hoá" dựng từ bộ atlas BodyParts3D.\n\nAtlas không có sụn tiếp hợp/điểm cốt hoá riêng — mốc thời gian ghi trong ghi chú từng xương.',
  scene: {
    slug: "moc-xuong-chi-tren",
    title: { vi: "Xương chi trên và mốc cốt hoá", en: "Bones of the Upper Limb and their Ossification", zh: "上肢骨及其骨化" },
    latin: "Ossa membri superioris",
    intro: {
      vi: "Chi trên có 32 xương mỗi bên: đai vai (đòn, vai), cánh tay, cẳng tay (quay, trụ), 8 xương cổ tay, 5 xương đốt bàn và 14 đốt ngón. Hầu hết xương dài cốt hoá sụn: thân cốt hoá trước sinh, còn các đầu có điểm cốt hoá thứ phát xuất hiện rồi dính dần tới tuổi dậy thì. Xương đòn là ngoại lệ, cốt hoá màng sớm nhất cơ thể (tuần 5–6 thai kỳ). Mốc xuất hiện và dính của từng điểm dùng để đọc tuổi xương trên phim tay. Mỗi đoạn chi một màu; mốc cốt hoá ghi trong ghi chú. Bộ dữ liệu là xương người trưởng thành, không có sụn tiếp hợp.",
      en: "Each upper limb has 32 bones: the girdle (clavicle, scapula), humerus, forearm (radius, ulna), 8 carpals, 5 metacarpals and 14 phalanges. Most long bones ossify in cartilage: the shaft ossifies before birth, while secondary centres appear at the ends and fuse gradually up to puberty. The clavicle is the exception, ossifying in membrane — the first bone in the body to do so (fetal weeks 5–6). The timing of each centre's appearance and fusion is used to read bone age on a hand X-ray. Each limb segment has its own colour; ossification timings are in the notes. The dataset is an adult skeleton with no growth plates.",
      zh: "每侧上肢有32块骨：肩带（锁骨、肩胛骨）、肱骨、前臂（桡骨、尺骨）、8块腕骨、5块掌骨和14块指骨。大多数长骨为软骨内成骨：骨干于出生前骨化，两端的继发骨化中心相继出现并于青春期前后愈合。锁骨例外，为膜内成骨，是全身最早骨化的骨（胚胎第5–6周）。各骨化中心出现与愈合的时间用于手部X线判读骨龄。每段肢体一种颜色，骨化时间见注释。数据集为成人骨骼，无骺板。",
    },
  },
  frame: ["dai-vai", "canh-tay", "cang-tay", "co-tay", "ban-ngon"],
  groups: [
    {
      key: "dai-vai",
      tint: "#b58bc4",
      latin: "Clavicula · Scapula",
      name: { vi: "Đai vai: xương đòn, xương vai", en: "Girdle: clavicle and scapula", zh: "肩带：锁骨与肩胛骨" },
      note: {
        vi: "Xương đòn cốt hoá màng từ tuần 5–6 thai kỳ, nhưng đầu trong lại dính muộn nhất cơ thể (khoảng 25 tuổi). Xương vai có điểm cốt hoá ở mỏm quạ khoảng 1 tuổi. Mỏm cùng vai có thể không dính (os acromiale), dễ nhầm với gãy xương.",
        en: "The clavicle ossifies in membrane from fetal weeks 5–6, yet its medial end is the last epiphysis in the body to fuse (about 25). The scapula's coracoid centre appears at about 1 year. The acromion may fail to fuse (os acromiale), easily mistaken for a fracture.",
        zh: "锁骨于胚胎第5–6周膜内骨化，但其内侧端是全身最晚愈合的骨骺（约25岁）。肩胛骨喙突骨化中心约1岁出现；肩峰可不愈合（肩峰小骨），易误诊为骨折。",
      },
      ids: L(`^(left )?(clavicle|scapula)$`, BONE),
    },
    {
      key: "canh-tay",
      tint: "#c9705f",
      latin: "Humerus",
      name: { vi: "Xương cánh tay", en: "Humerus", zh: "肱骨" },
      note: {
        vi: "Đầu trên có ba điểm (chỏm, củ lớn, củ bé), dính khoảng 18–20 tuổi; đây là đầu “mọc” chính của xương. Đầu dưới có bốn điểm, xuất hiện theo thứ tự nhớ bằng chữ CRITOE: chỏm con (1 tuổi), chỏm quay (3), mỏm trên lồi cầu trong (5), ròng rọc (7), mỏm khuỷu (9), mỏm trên lồi cầu ngoài (11). Thứ tự này giúp đọc phim khuỷu ở trẻ.",
        en: "The upper end has three centres (head, greater and lesser tubercles) fusing at about 18–20; it is the bone's main growing end. The lower end has four, and elbow centres appear in the order CRITOE: capitulum (1 year), radial head (3), medial epicondyle (5), trochlea (7), olecranon (9), lateral epicondyle (11). The order helps read children's elbow X-rays.",
        zh: "上端有三个骨化中心（头、大结节、小结节），约18–20岁愈合，是肱骨的主要生长端。肘部骨化中心出现顺序可记为CRITOE：肱骨小头（1岁）、桡骨头（3）、内上髁（5）、滑车（7）、鹰嘴（9）、外上髁（11），用于判读儿童肘部X线。",
      },
      ids: L(`^(left )?humerus$`, BONE),
    },
    {
      key: "cang-tay",
      tint: "#e8883d",
      latin: "Radius · Ulna",
      name: { vi: "Xương quay và xương trụ", en: "Radius and ulna", zh: "桡骨与尺骨" },
      note: {
        vi: "Ở cả hai xương, đầu dưới là đầu mọc chính. Đầu dưới xương quay xuất hiện khoảng 1 tuổi và dính khoảng 18–20 tuổi. Gãy qua sụn tiếp hợp đầu dưới xương quay (phân loại Salter–Harris) là tổn thương sụn tiếp hợp hay gặp nhất ở trẻ.",
        en: "In both bones the lower end is the main growing end. The distal radial centre appears at about 1 year and fuses at about 18–20. A fracture through the distal radial growth plate (Salter–Harris) is the commonest growth-plate injury in children.",
        zh: "两骨均以下端为主要生长端。桡骨远端骨化中心约1岁出现、18–20岁愈合。经桡骨远端骺板的骨折（Salter–Harris分型）是儿童最常见的骺板损伤。",
      },
      ids: L(`^(left )?(radius|ulna)$`, BONE),
    },
    {
      key: "co-tay",
      tint: "#e6c14a",
      latin: "Ossa carpi",
      name: { vi: "Tám xương cổ tay", en: "The eight carpal bones", zh: "八块腕骨" },
      note: {
        vi: "Lúc sinh chưa có xương cổ tay nào cốt hoá. Xương cả và móc xuất hiện đầu tiên (khoảng 2–3 tháng), xương đậu cuối cùng (khoảng 9–12 tuổi). Đếm số xương cổ tay trên phim là cách ước tuổi xương đơn giản ở trẻ nhỏ.",
        en: "No carpal bone is ossified at birth. The capitate and hamate appear first (about 2–3 months), the pisiform last (about 9–12 years). Counting carpals on an X-ray is a simple bone-age estimate in young children.",
        zh: "出生时腕骨均未骨化。头状骨和钩骨最先出现（约2–3个月），豌豆骨最晚（约9–12岁）。在X线上计数腕骨是估计幼儿骨龄的简便方法。",
      },
      ids: L(`^(left )?(scaphoid|lunate|triquetral|pisiform|trapezium|trapezoid|capitate|hamate)$`, BONE),
    },
    {
      key: "ban-ngon",
      tint: "#6f93b8",
      latin: "Ossa metacarpi · Phalanges",
      name: { vi: "Xương đốt bàn và đốt ngón", en: "Metacarpals and phalanges", zh: "掌骨与指骨" },
      note: {
        vi: "Mỗi xương chỉ có một điểm cốt hoá đầu. Ở đốt bàn II–V điểm này nằm ở chỏm (đầu xa). Ở đốt bàn I và mọi đốt ngón, nó nằm ở nền (đầu gần). Vì thế đốt bàn I giống một đốt ngón hơn.",
        en: "Each has only one epiphysis. In metacarpals 2–5 it is at the head (distal); in the first metacarpal and all phalanges it is at the base (proximal). That is why the first metacarpal behaves more like a phalanx.",
        zh: "每骨仅一个骨骺：第2–5掌骨在头（远端），第1掌骨和所有指骨在底（近端）。因此第1掌骨更像一节指骨。",
      },
      ids: L(`^(left )?(first|second|third|fourth|fifth) metacarpal bone$|phalanx of (left )?(thumb|index finger|middle finger|ring finger|little finger)$`, BONE),
    },
  ],
});

// ───────────────────── 2. Xương chi dưới và mốc cốt hoá ─────────────────────
emit({
  file: "lower-limb-ossification",
  script: "batch-f",
  exportName: "lowerLimbOssificationScene",
  header: 'Scene "Xương chi dưới và mốc cốt hoá" dựng từ bộ atlas BodyParts3D.\n\nAtlas không có sụn tiếp hợp/điểm cốt hoá riêng — mốc thời gian ghi trong ghi chú từng xương.',
  scene: {
    slug: "moc-xuong-chi-duoi",
    title: { vi: "Xương chi dưới và mốc cốt hoá", en: "Bones of the Lower Limb and their Ossification", zh: "下肢骨及其骨化" },
    latin: "Ossa membri inferioris",
    intro: {
      vi: "Chi dưới có 31 xương mỗi bên: xương chậu, đùi, bánh chè, chày, mác, 7 xương cổ chân, 5 xương đốt bàn và 14 đốt ngón. Xương chậu hình thành từ ba xương (cánh chậu, ngồi, mu) dính nhau ở ổ cối. Điểm cốt hoá đầu dưới xương đùi có từ lúc sinh, nên pháp y dùng nó xác định thai đủ tháng. Chi dưới mọc dài chủ yếu quanh gối, ở đầu dưới xương đùi và đầu trên xương chày. Mỗi đoạn một màu; mốc cốt hoá ghi trong ghi chú. Bộ dữ liệu là xương người trưởng thành, không có sụn tiếp hợp.",
      en: "Each lower limb has 31 bones: hip bone, femur, patella, tibia, fibula, 7 tarsals, 5 metatarsals and 14 phalanges. The hip bone forms from three bones (ilium, ischium, pubis) fusing at the acetabulum. The centre for the lower femur is present at birth, so forensic experts use it to confirm a full-term fetus. The lower limb grows mainly around the knee, at the lower femur and upper tibia. Each segment has its own colour; ossification timings are in the notes. The dataset is an adult skeleton with no growth plates.",
      zh: "每侧下肢有31块骨：髋骨、股骨、髌骨、胫骨、腓骨、7块跗骨、5块跖骨和14块趾骨。髋骨由髂骨、坐骨、耻骨在髋臼处融合而成。股骨下端骨化中心出生时即已存在，法医据此判定足月胎儿。下肢主要在膝周（股骨下端和胫骨上端）生长。每段一种颜色，骨化时间见注释。数据集为成人骨骼，无骺板。",
    },
  },
  frame: ["chau", "dui", "cang-chan", "co-chan", "ban-ngon"],
  groups: [
    {
      key: "chau",
      tint: "#b58bc4",
      latin: "Os coxae",
      name: { vi: "Xương chậu", en: "Hip bone", zh: "髋骨" },
      note: {
        vi: "Sụn chữ Y ở ổ cối nối cánh chậu, xương ngồi, xương mu, dính khoảng 15–17 tuổi. Mào chậu cốt hoá từ ngoài vào trong. Mức độ cốt hoá mào chậu (dấu Risser) cho biết cột sống còn phát triển hay không, dùng khi theo dõi vẹo cột sống.",
        en: "The Y-shaped triradiate cartilage in the acetabulum joins ilium, ischium and pubis and fuses at about 15–17. The iliac crest ossifies from lateral to medial; its extent (Risser sign) shows whether the spine is still growing, used in managing scoliosis.",
        zh: "髋臼内Y形软骨连接髂骨、坐骨和耻骨，约15–17岁愈合。髂嵴由外向内骨化，其程度（Risser征）反映脊柱是否仍在生长，用于脊柱侧弯的随访。",
      },
      ids: L(`^(left )?hip bone$`, BONE),
    },
    {
      key: "dui",
      tint: "#c9705f",
      latin: "Femur · Patella",
      name: { vi: "Xương đùi và xương bánh chè", en: "Femur and patella", zh: "股骨与髌骨" },
      note: {
        vi: "Đầu dưới xương đùi xuất hiện khoảng tuần 36 thai kỳ. Chỏm xương đùi xuất hiện khoảng 6 tháng tuổi; ở trẻ 10–15 tuổi, chỏm có thể trượt khỏi sụn tiếp hợp (trượt chỏm xương đùi). Bánh chè là xương vừng lớn nhất, cốt hoá khoảng 3–6 tuổi; nhiều điểm không dính tạo bánh chè hai mảnh.",
        en: "The lower femoral centre appears at about fetal week 36. The femoral head appears at about 6 months; between 10 and 15 it can slip off its growth plate (slipped capital femoral epiphysis). The patella, the largest sesamoid, ossifies at 3–6 years; unfused centres give a bipartite patella.",
        zh: "股骨下端骨化中心约胚胎第36周出现。股骨头约6月龄出现；10–15岁时可沿骺板滑脱（股骨头骨骺滑脱）。髌骨为最大的籽骨，3–6岁骨化；多个中心不愈合形成二分髌骨。",
      },
      ids: L(`^(left )?(femur|patella)$`, BONE),
    },
    {
      key: "cang-chan",
      tint: "#e8883d",
      latin: "Tibia · Fibula",
      name: { vi: "Xương chày và xương mác", en: "Tibia and fibula", zh: "胫骨与腓骨" },
      note: {
        vi: "Đầu trên xương chày xuất hiện lúc sinh, dính khoảng 16–18 tuổi. Lồi củ chày là mỏm riêng; ở trẻ hay chơi thể thao, gân bánh chè kéo liên tục gây đau lồi củ (bệnh Osgood–Schlatter). Xương mác là ngoại lệ: đầu dưới xuất hiện trước và dính trước đầu trên.",
        en: "The upper tibial centre is present at birth and fuses at 16–18. The tibial tuberosity is a separate apophysis; in sporty children repeated pull of the patellar tendon makes it painful (Osgood–Schlatter disease). The fibula is the exception: its lower end appears and fuses before its upper end.",
        zh: "胫骨上端骨化中心出生时即有，16–18岁愈合。胫骨粗隆为独立骨突，爱运动的儿童因髌韧带反复牵拉致其疼痛（Osgood–Schlatter病）。腓骨例外：下端比上端先出现、先愈合。",
      },
      ids: L(`^(left )?(tibia|fibula)$`, BONE),
    },
    {
      key: "co-chan",
      tint: "#e6c14a",
      latin: "Ossa tarsi",
      name: { vi: "Bảy xương cổ chân", en: "The seven tarsal bones", zh: "七块跗骨" },
      note: {
        vi: "Xương gót và xương sên đã cốt hoá lúc sinh, xương hộp ngay trước hoặc sau sinh. Xương thuyền xuất hiện muộn nhất (khoảng 3 tuổi); thiếu máu nuôi lúc này gây hoại tử xương thuyền ở trẻ (bệnh Köhler). Mỏm sau xương gót có điểm riêng, hay đau ở trẻ 8–12 tuổi (bệnh Sever).",
        en: "The calcaneus and talus are ossified at birth, the cuboid around birth. The navicular is last (about 3 years); a blood-supply lapse then causes its necrosis in children (Köhler disease). The back of the calcaneus has its own apophysis, often painful at 8–12 years (Sever disease).",
        zh: "跟骨和距骨出生时已骨化，骰骨在出生前后骨化。足舟骨最晚（约3岁），此时血供不足可致儿童足舟骨坏死（Köhler病）。跟骨后部有独立骨突，8–12岁常疼痛（Sever病）。",
      },
      ids: L(`^(left )?(talus|calcaneus|navicular bone of foot|cuboid bone|(medial|intermediate|lateral) cuneiform bone)$`, BONE),
    },
    {
      key: "ban-ngon",
      tint: "#6f93b8",
      latin: "Ossa metatarsi · Phalanges",
      name: { vi: "Xương đốt bàn và đốt ngón chân", en: "Metatarsals and phalanges of the foot", zh: "跖骨与趾骨" },
      note: {
        vi: "Như bàn tay: đốt bàn II–V có điểm ở chỏm, còn đốt bàn I và các đốt ngón có điểm ở nền. Nền đốt bàn V có mỏm riêng ở trẻ, dễ nhầm với gãy.",
        en: "As in the hand: metatarsals 2–5 have their epiphysis at the head, the first metatarsal and phalanges at the base. The base of the fifth metatarsal has its own apophysis in children, easily mistaken for a fracture.",
        zh: "同手部：第2–5跖骨骨骺在头，第1跖骨和趾骨在底。儿童第5跖骨底有独立骨突，易误诊为骨折。",
      },
      ids: L(`^(left )?(first|second|third|fourth|fifth) metatarsal bone$|phalanx of (left )?(big|second|third|fourth|little) toe$|^sesamoid bone of (left )?foot$`, BONE),
    },
  ],
});

// ───────────────────── 3. Mô liên kết đặc ─────────────────────
emit({
  file: "dense-connective",
  script: "batch-f",
  exportName: "denseConnectiveScene",
  header: 'Scene "Mô liên kết đặc" dựng từ bộ atlas BodyParts3D.\n\nGom mọi gân, dây chằng, màng, mạc giữ gân atlas có. Atlas thiếu phần lớn dây chằng khớp và túi hoạt dịch.',
  scene: {
    slug: "mo-lien-ket",
    title: { vi: "Mô liên kết đặc: gân, dây chằng, màng, mạc giữ gân", en: "Dense Connective Tissue: Tendons, Ligaments, Membranes, Retinacula", zh: "致密结缔组织：肌腱、韧带、膜与支持带" },
    latin: "Textus connectivus densus",
    intro: {
      vi: "Mô liên kết đặc chủ yếu là sợi collagen xếp chặt, chịu lực kéo rất lớn nhưng ít mạch máu, nên lành chậm. Theo chức năng có năm loại. Gân nối cơ vào xương. Dây chằng nối xương với xương. Màng gian cốt căng giữa hai xương. Mạc giữ gân giữ gân áp sát khớp. Đường đan và cân là nơi cơ bám vào nhau. Scene gom mọi cấu trúc loại này mà bộ dữ liệu có, rải khắp cơ thể, mỗi loại một màu. Xương làm mờ sẵn để biết vị trí. Bộ dữ liệu không có phần lớn dây chằng khớp lớn và túi hoạt dịch.",
      en: "Dense connective tissue is mostly tightly packed collagen fibres, very strong in tension but poorly vascularised, so it heals slowly. By function there are five kinds. Tendons join muscle to bone. Ligaments join bone to bone. Interosseous membranes stretch between two bones. Retinacula hold tendons against joints. Raphes and aponeuroses are where muscles attach to each other. The scene gathers every such structure in the dataset, scattered across the body, with one colour per kind. Bones are faded for orientation. The dataset lacks most major joint ligaments and the bursae.",
      zh: "致密结缔组织主要由紧密排列的胶原纤维构成，抗拉力极强但血供少，愈合慢。按功能分五类：肌腱连接肌与骨；韧带连接骨与骨；骨间膜张于两骨之间；支持带使肌腱紧贴关节；缝与腱膜为肌与肌相互附着处。本场景汇集数据集中所有此类结构，散布全身，每类一种颜色，骨骼淡化以便定位。数据集中缺少大部分大关节韧带和滑囊。",
    },
  },
  faded: ["xuong"],
  groups: [
    {
      key: "gan",
      tint: "#f0ede4",
      latin: "Tendines",
      name: { vi: "Gân", en: "Tendons", zh: "肌腱" },
      note: {
        vi: "Gân gót là gân to nhất, chịu lực gấp khoảng 8–12 lần trọng lượng cơ thể khi chạy. Gân trung gian cơ hai bụng và gân cơ nâng mi là ví dụ gân nhỏ.",
        en: "The calcaneal tendon is the largest, bearing about 8–12 times body weight in running. The intermediate tendon of digastric and the levator palpebrae tendon are small examples.",
        zh: "跟腱最粗，跑步时承受约8–12倍体重。二腹肌中间腱和上睑提肌腱为小肌腱的例子。",
      },
      ids: R(`^${SIDE}calcaneal tendon$|intermediate tendon$|^tendon of ${SIDE}levator palpebrae superioris$`, ["connective"]),
    },
    {
      key: "day-chang",
      tint: "#e6c14a",
      latin: "Ligamenta",
      name: { vi: "Dây chằng", en: "Ligaments", zh: "韧带" },
      note: {
        vi: "Dây chằng gan chân dài giữ vòm bàn chân; dây chằng trâm–móng treo xương móng; dây chằng thanh âm là lõi dây thanh; dây chằng hãm của cơ vận nhãn giới hạn tầm liếc. Dây chằng giãn quá 6–8% chiều dài thì bắt đầu rách.",
        en: "The long plantar ligament holds the arch; the stylohyoid ligament slings the hyoid; the vocal ligament cores the vocal cord; the check ligaments limit eye movement. Ligaments begin to tear when stretched beyond 6–8% of their length.",
        zh: "足底长韧带维持足弓；茎突舌骨韧带悬吊舌骨；声韧带为声带核心；眼肌节制韧带限制眼球运动范围。韧带拉长超过6–8%即开始撕裂。",
      },
      ids: R(`ligament( of ${SIDE}(lateral|medial) rectus)?$|^check ligament|^${SIDE}long plantar ligament$|conus elasticus$|thyrohyoid membrane$`, ["connective"]),
    },
    {
      key: "mang",
      tint: "#9fb8a0",
      latin: "Membranae interosseae",
      name: { vi: "Màng gian cốt", en: "Interosseous membranes", zh: "骨间膜" },
      note: {
        vi: "Căng giữa quay–trụ và chày–mác, chuyển lực giữa hai xương và làm vách ngăn các khoang cơ.",
        en: "Stretched between radius and ulna and between tibia and fibula, they transfer load between the bones and wall off the muscle compartments.",
        zh: "张于桡尺骨之间和胫腓骨之间，在两骨间传递负荷并分隔肌群。",
      },
      ids: R(`^interosseous membrane of ${SIDE}(forearm|leg)$`, ["connective"]),
    },
    {
      key: "mac-giu",
      tint: "#b58bc4",
      latin: "Retinacula · Trochlea",
      name: { vi: "Mạc giữ gân và ròng rọc", en: "Retinacula and pulleys", zh: "支持带与滑车" },
      note: {
        vi: "Mạc giữ gân gấp cổ tay là mái ống cổ tay. Ròng rọc cơ chéo trên là vòng sụn–xơ đổi hướng gân như ròng rọc thật.",
        en: "The flexor retinaculum of the wrist roofs the carpal tunnel. The trochlea of superior oblique is a fibrocartilage loop that turns the tendon like a real pulley.",
        zh: "腕屈肌支持带构成腕管顶。上斜肌滑车是纤维软骨环，如真正的滑轮般改变肌腱方向。",
      },
      ids: R(`^flexor retinaculum of ${SIDE}wrist$|^trochlea of ${SIDE}superior oblique$`, ["sensory", "connective"]),
    },
    {
      key: "dan-can",
      tint: "#e39a7a",
      latin: "Raphae · Aponeuroses · Tractus iliotibialis · Arcus tendineus",
      name: { vi: "Đường đan, cân, dải chậu–chày, cung gân", en: "Raphes, aponeuroses, iliotibial tract, tendinous arch", zh: "缝、腱膜、髂胫束、腱弓" },
      note: {
        vi: "Đường trắng là nơi cân cơ thành bụng hai bên gặp nhau. Đường đan hầu nối các cơ khít hầu. Cung gân cơ nâng hậu môn là chỗ bám của hoành chậu. Dải chậu–chày là phần dày của mạc đùi.",
        en: "The linea alba is where the abdominal aponeuroses of both sides meet. The pharyngeal raphe joins the constrictors. The tendinous arch of levator ani anchors the pelvic diaphragm. The iliotibial tract is a thickening of the fascia lata.",
        zh: "白线为两侧腹肌腱膜交会处；咽缝连接咽缩肌；肛提肌腱弓为盆膈附着处；髂胫束为阔筋膜增厚部分。",
      },
      ids: R(`^linea alba$|raphe$|tendinous arch of levator ani$`, ["connective"]).concat(R(`^${SIDE}iliotibial tract$`, ["skeletal", "connective"])),
    },
    {
      key: "xuong",
      latin: "Skeleton",
      name: { vi: "Các xương làm mốc", en: "Landmark bones", zh: "标志骨" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: R(`^(left )?(tibia|fibula|radius|ulna|calcaneus|hip bone)$|^mandible$|^hyoid bone$|^sacrum$`, BONE),
    },
  ],
});

// ─────────── 4. Cơ trước cột sống cổ và cơ bậc thang (đổi chủ đề) ───────────
emit({
  file: "prevertebral",
  script: "batch-f",
  exportName: "prevertebralScene",
  header: 'Scene "Cơ trước cột sống cổ và cơ bậc thang" dựng từ bộ atlas BodyParts3D.\n\nBài cơ cổ độc lập; mô hình tai Z-Anatomy giữ đường dẫn he-thinh-giac.',
  scene: {
    slug: "co-truoc-cot-song-co",
    system: "muscular",
    title: { vi: "Cơ trước cột sống cổ và cơ bậc thang", en: "Prevertebral and Scalene Muscles", zh: "椎前肌与斜角肌" },
    latin: "Mm. prevertebrales · Mm. scaleni",
    intro: {
      vi: "Sát mặt trước cột sống cổ là nhóm cơ trước cột sống: cơ dài cổ, dài đầu, thẳng đầu trước và thẳng đầu ngoài. Chúng gấp cổ và đầu, và giữ đường cong cổ. Bị giãn đột ngột khi va chạm xe từ phía sau, chúng gây chấn thương kiểu “roi quất”. Ở hai bên là ba cơ bậc thang, đi từ mỏm ngang đốt cổ xuống xương sườn I và II. Chúng nâng sườn khi hít vào gắng sức. Giữa cơ bậc thang trước và giữa có khe cho động mạch dưới đòn và đám rối cánh tay đi qua. Khe hẹp gây hội chứng lối ra lồng ngực. Mỗi nhóm một tông màu; cột sống mờ sẵn.",
      en: "Against the front of the cervical spine lie the prevertebral muscles: longus colli, longus capitis, rectus capitis anterior and rectus capitis lateralis. They flex the neck and head and hold the cervical curve. Suddenly stretched in a rear-end collision, they are injured in whiplash. At the sides are the three scalenes, running from the cervical transverse processes to ribs 1 and 2. They lift the ribs in forced inspiration. Between scalenus anterior and medius is a gap for the subclavian artery and brachial plexus. A tight gap causes thoracic outlet syndrome. Each group has its own colour family; the spine is faded.",
      zh: "紧贴颈椎前面为椎前肌：颈长肌、头长肌、头前直肌和头外侧直肌，屈颈屈头并维持颈曲；追尾车祸时突然被牵拉而致“挥鞭伤”。两侧为三块斜角肌，自颈椎横突至第1、2肋，用力吸气时提肋。前、中斜角肌之间的间隙有锁骨下动脉和臂丛通过，间隙狭窄致胸廓出口综合征。每组一种色系；脊柱淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["truoc-song", "bac-thang"],
  groups: [
    {
      key: "truoc-song",
      tint: "#c9705f",
      latin: "Mm. longus colli, longus capitis",
      name: { vi: "Cơ dài cổ và dài đầu", en: "Longus colli and longus capitis", zh: "颈长肌与头长肌" },
      note: {
        vi: "Cơ dài cổ có ba phần (chéo trên, dọc giữa, chéo dưới) ôm mặt trước thân đốt từ đốt đội tới T3. Thân giao cảm cổ nằm ngay trên mặt trước cơ.",
        en: "Longus colli has three parts (superior oblique, vertical, inferior oblique) hugging the vertebral bodies from atlas to T3. The cervical sympathetic trunk lies on its front.",
        zh: "颈长肌分上斜部、垂直部、下斜部，贴附寰椎至T3椎体前面。颈交感干位于其前面。",
      },
      ids: R(`part of ${SIDE}longus colli$|^${SIDE}longus capitis$`, ["muscular"]),
    },
    {
      key: "thang-dau",
      tint: "#e39a7a",
      latin: "Mm. rectus capitis anterior et lateralis",
      name: { vi: "Cơ thẳng đầu trước và ngoài", en: "Rectus capitis anterior and lateralis", zh: "头前直肌与头外侧直肌" },
      note: {
        vi: "Hai cơ ngắn nối đốt đội với nền xương chẩm, gấp và nghiêng đầu tại khớp đội–chẩm.",
        en: "Two short muscles linking the atlas to the occipital base, flexing and tilting the head at the atlanto-occipital joint.",
        zh: "两块短肌连接寰椎与枕骨底，在寰枕关节处屈头和侧屈头。",
      },
      ids: R(`^${SIDE}rectus capitis (anterior|lateralis)$`, ["muscular"]),
    },
    {
      key: "bac-thang",
      tint: "#6f93b8",
      latin: "Mm. scaleni anterior, medius, posterior",
      name: { vi: "Ba cơ bậc thang", en: "The three scalenes", zh: "三块斜角肌" },
      note: {
        vi: "Bậc thang trước bám củ cơ bậc thang ở sườn I. Dây hoành chạy chéo trên mặt trước cơ này. Tĩnh mạch dưới đòn đi trước cơ, còn động mạch dưới đòn đi sau.",
        en: "Scalenus anterior inserts on the scalene tubercle of rib 1. The phrenic nerve slants down across its front. The subclavian vein passes in front of it, the artery behind.",
        zh: "前斜角肌止于第1肋斜角肌结节，膈神经斜行于其前面。锁骨下静脉经其前方，锁骨下动脉经其后方。",
      },
      ids: R(`^${SIDE}scalenus (anterior|medius|posterior)$`, ["muscular"]),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "A. subclavia · A. vertebralis",
      name: { vi: "Động mạch dưới đòn và đốt sống", en: "Subclavian and vertebral arteries", zh: "锁骨下动脉与椎动脉" },
      note: {
        vi: "Động mạch đốt sống chui vào lỗ mỏm ngang C6, trong tam giác giữa cơ dài cổ và bậc thang trước.",
        en: "The vertebral artery enters the C6 transverse foramen from the triangle between longus colli and scalenus anterior.",
        zh: "椎动脉自颈长肌与前斜角肌之间的三角进入C6横突孔。",
      },
      ids: R(`^${SIDE}(subclavian|vertebral) artery$`, ART).filter((id) => betweenY([id], 1.35, 1.6).length),
    },
    {
      key: "xuong",
      latin: "Vertebrae cervicales · Costae I–II · Os occipitale",
      name: { vi: "Cột sống cổ, sườn I–II, xương chẩm (mốc)", en: "Cervical spine, ribs 1–2, occipital (landmarks)", zh: "颈椎、第1–2肋、枕骨（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: R(`^(atlas|axis|occipital bone)$|^(third|fourth|fifth|sixth|seventh) cervical vertebra$|^(first|second|third) thoracic vertebra$|^${SIDE}(first|second) rib$`, BONE),
    },
  ],
});

// ─────────────── 5. Vòng mạch tuỵ–tá tràng (đổi chủ đề) ───────────────
emit({
  file: "pancreaticoduodenal",
  script: "batch-f",
  exportName: "pancreaticoduodenalScene",
  header: 'Scene "Vòng mạch tuỵ–tá tràng" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Hệ mạc" cũ: atlas không có mạc nông, mạc sâu.',
  scene: {
    slug: "he-mac",
    system: "cardiovascular",
    title: { vi: "Tuỵ, tá tràng và vòng mạch tuỵ–tá tràng", en: "Pancreas, Duodenum and the Pancreaticoduodenal Arcades", zh: "胰、十二指肠与胰十二指肠动脉弓" },
    latin: "Arcus pancreaticoduodenales",
    intro: {
      vi: "Đầu tuỵ nằm trong khung chữ C của tá tràng, và hai cơ quan dùng chung một hệ mạch. Động mạch tuỵ–tá tràng trên (trước, sau) tách từ động mạch vị–tá tràng, thuộc thân tạng. Động mạch tuỵ–tá tràng dưới (trước, sau) tách từ động mạch mạc treo tràng trên. Chúng nối nhau thành hai vòng trước và sau đầu tuỵ, là cầu nối giữa hệ thân tạng và hệ mạc treo tràng trên. Vì dùng chung mạch, mổ cắt khối tá tuỵ (Whipple) phải lấy cả đầu tuỵ và tá tràng. Thân, đuôi tuỵ được nuôi bởi các nhánh từ động mạch lách. Mạch đỏ–xanh; tuỵ, tá tràng mờ sẵn.",
      en: "The head of the pancreas sits in the C-loop of the duodenum, and the two organs share one blood supply. The superior pancreaticoduodenal arteries (anterior, posterior) come from the gastroduodenal, a coeliac branch. The inferior pancreaticoduodenal arteries (anterior, posterior) come from the superior mesenteric. They join in anterior and posterior arcades round the pancreatic head, a bridge between the coeliac and superior mesenteric systems. Because the supply is shared, a Whipple resection removes the pancreatic head and duodenum together. The body and tail of the pancreas are fed by branches of the splenic artery. Vessels red and blue; pancreas and duodenum faded.",
      zh: "胰头位于十二指肠C形弯内，二者共用一套血供。胰十二指肠上动脉（前、后）发自胃十二指肠动脉（属腹腔干）；胰十二指肠下动脉（前、后）发自肠系膜上动脉。它们在胰头前后吻合成前、后两弓，连接腹腔干系与肠系膜上动脉系。由于共用血供，胰十二指肠切除术（Whipple术）须同时切除胰头和十二指肠。胰体、胰尾由脾动脉分支供血。血管红蓝；胰和十二指肠淡化。",
    },
  },
  faded: ["tang"],
  frame: ["tren", "duoi", "than-duoi", "tm"],
  groups: [
    {
      key: "tren",
      tint: OXY,
      latin: "A. gastroduodenalis · Aa. pancreaticoduodenales superiores",
      name: { vi: "Nguồn trên: vị–tá tràng, tuỵ–tá tràng trên", en: "From above: gastroduodenal and superior pancreaticoduodenal", zh: "上方来源：胃十二指肠动脉、胰十二指肠上动脉" },
      note: {
        vi: "Động mạch vị–tá tràng đi sau hành tá tràng. Loét mặt sau hành tá tràng có thể ăn thủng nó, gây chảy máu ồ ạt.",
        en: "The gastroduodenal runs behind the duodenal bulb; a posterior ulcer can erode it and bleed massively.",
        zh: "胃十二指肠动脉行于十二指肠球后方，后壁溃疡可侵蚀之致大出血。",
      },
      ids: R(`^trunk of gastroduodenal artery$|superior pancreaticoduodenal artery$|^common hepatic artery$`, ART),
    },
    {
      key: "duoi",
      tint: "#e8883d",
      latin: "A. mesenterica superior · Aa. pancreaticoduodenales inferiores",
      name: { vi: "Nguồn dưới: mạc treo tràng trên, tuỵ–tá tràng dưới", en: "From below: superior mesenteric and inferior pancreaticoduodenal", zh: "下方来源：肠系膜上动脉、胰十二指肠下动脉" },
      note: {
        vi: "Khi thân tạng hẹp, máu chảy ngược qua vòng này từ mạc treo tràng trên lên nuôi gan, lách. Vòng khi đó giãn to và có thể thành phình mạch.",
        en: "When the coeliac trunk is narrowed, blood flows backwards through these arcades from the superior mesenteric to feed liver and spleen; they enlarge and can become aneurysmal.",
        zh: "腹腔干狭窄时，血液经此弓由肠系膜上动脉逆流供应肝脾，吻合弓扩张，甚至形成动脉瘤。",
      },
      ids: R(`inferior pancreaticoduodenal artery$|^superior mesenteric artery$`, ART),
    },
    {
      key: "than-duoi",
      tint: "#e39a7a",
      latin: "Aa. pancreatica dorsalis, magna, caudae, inferior",
      name: { vi: "Nhánh nuôi thân và đuôi tuỵ", en: "Branches to the body and tail", zh: "胰体尾分支" },
      note: {
        vi: "Động mạch tuỵ lưng, tuỵ lớn và đuôi tuỵ tách từ động mạch lách; động mạch tuỵ dưới chạy dọc bờ dưới tuỵ.",
        en: "The dorsal, great and caudal pancreatic arteries arise from the splenic; the inferior pancreatic runs along the lower border.",
        zh: "胰背动脉、胰大动脉和胰尾动脉发自脾动脉；胰下动脉沿胰下缘走行。",
      },
      ids: R(`^(dorsal|great|caudal|inferior) pancreatic artery$|^splenic artery$`, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. pancreaticoduodenales · V. portae hepatis",
      name: { vi: "Tĩnh mạch tuỵ–tá tràng và tĩnh mạch cửa", en: "Pancreaticoduodenal veins and portal vein", zh: "胰十二指肠静脉与门静脉" },
      note: {
        vi: "Tĩnh mạch cửa hình thành sau cổ tuỵ. U đầu tuỵ xâm lấn tĩnh mạch này là yếu tố quyết định có mổ được hay không.",
        en: "The portal vein forms behind the pancreatic neck; invasion of it by a head tumour is a key factor in whether the tumour is resectable.",
        zh: "门静脉在胰颈后方形成；胰头肿瘤是否侵犯门静脉是决定能否切除的关键。",
      },
      ids: R(`pancreaticoduodenal vein$|^hepatic portal vein$|^splenic vein$`, VEN),
    },
    {
      key: "ong",
      tint: "#e6c14a",
      latin: "Ductus pancreaticus",
      name: { vi: "Ống tuỵ", en: "Pancreatic duct", zh: "胰管" },
      note: {
        vi: "Ống tuỵ chính hợp với ống mật chủ đổ vào nhú tá lớn. Sỏi kẹt ở chỗ này gây viêm tuỵ cấp do sỏi mật.",
        en: "The main pancreatic duct joins the bile duct at the major duodenal papilla; a stone lodged there causes gallstone pancreatitis.",
        zh: "主胰管与胆总管汇合开口于十二指肠大乳头；结石嵌顿于此致胆源性胰腺炎。",
      },
      ids: R(`^pancreatic duct( tree)?$`),
    },
    {
      key: "tang",
      latin: "Pancreas · Duodenum",
      name: { vi: "Tuỵ và tá tràng (mốc)", en: "Pancreas and duodenum (landmarks)", zh: "胰与十二指肠（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: R(`^(pancreas|duodenum)$`),
    },
  ],
});

// ─────────────── 6. Lỗ trên lồng ngực (đổi chủ đề) ───────────────
emit({
  file: "thoracic-outlet",
  script: "batch-f",
  exportName: "thoracicOutletScene",
  header: 'Scene "Lỗ trên lồng ngực" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Tuyến nội tiết" cũ (trùng "he-noi-tiet"; atlas không có tuyến giáp). Atlas thiếu đám rối cánh tay, dây hoành, dây X.',
  scene: {
    slug: "tuyen-noi-tiet",
    system: "cardiovascular",
    title: { vi: "Lỗ trên lồng ngực và các cấu trúc đi qua", en: "The Superior Thoracic Aperture", zh: "胸廓上口" },
    latin: "Apertura thoracis superior",
    intro: {
      vi: "Lỗ trên lồng ngực là vòng xương hình quả thận, giới hạn bởi đốt T1, đôi xương sườn I và bờ trên cán ức. Nó nghiêng xuống trước, nên đỉnh phổi nhô lên trên xương đòn. Qua lỗ này có khí quản, thực quản, các động mạch cảnh chung và dưới đòn, tĩnh mạch cánh tay–đầu và tuyến ức. Ở hai bên, bó mạch dưới đòn vượt qua xương sườn I giữa các cơ bậc thang và xương đòn. Xương sườn cổ hoặc cơ bậc thang phì đại có thể chèn vào đây. Mỗi hệ một màu; xương đóng khung.",
      en: "The superior thoracic aperture is a kidney-shaped bony ring bounded by T1, the first ribs and the upper border of the manubrium. It slopes down and forward, so the lung apex rises above the clavicle. Through it pass the trachea, oesophagus, common carotid and subclavian arteries, brachiocephalic veins and thymus. At the sides the subclavian vessels cross the first rib between the scalenes and the clavicle. A cervical rib or bulky scalene can compress them there. Each system has its own colour; the bones frame the view.",
      zh: "胸廓上口为肾形骨环，由T1、第1肋和胸骨柄上缘围成，向前下倾斜，故肺尖高出锁骨。经此通过的有气管、食管、颈总动脉和锁骨下动脉、头臂静脉及胸腺。两侧锁骨下血管在斜角肌与锁骨之间越过第1肋，颈肋或肥大的斜角肌可在此压迫之。每个系统一种颜色；骨骼构成框架。",
    },
  },
  frame: ["xuong", "dm", "tm", "tang"],
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Vertebra T1 · Costae I · Manubrium",
      name: { vi: "Vòng xương: T1, sườn I, cán ức, xương đòn", en: "The bony ring: T1, first ribs, manubrium, clavicles", zh: "骨环：T1、第1肋、胸骨柄、锁骨" },
      note: {
        vi: "Xương sườn I ngắn, dẹt, rộng nhất; có rãnh cho động mạch và tĩnh mạch dưới đòn ở hai bên củ cơ bậc thang.",
        en: "The first rib is the shortest, flattest and broadest, grooved for the subclavian artery and vein on either side of the scalene tubercle.",
        zh: "第1肋最短、最扁、最宽，斜角肌结节前后有锁骨下静脉沟和动脉沟。",
      },
      ids: R(`^first thoracic vertebra$|^manubrium$|^${SIDE}(first rib|first costal cartilage|clavicle)$`, BONE),
    },
    {
      key: "bac-thang",
      tint: "#6f93b8",
      latin: "Mm. scaleni anterior et medius",
      name: { vi: "Cơ bậc thang trước và giữa", en: "Scalenus anterior and medius", zh: "前、中斜角肌" },
      note: {
        vi: "Khe bậc thang giữa hai cơ là chỗ chèn ép hay gặp nhất của hội chứng lối ra lồng ngực.",
        en: "The interscalene gap between them is the commonest site of compression in thoracic outlet syndrome.",
        zh: "两肌之间的斜角肌间隙是胸廓出口综合征最常见的受压部位。",
      },
      ids: R(`^${SIDE}scalenus (anterior|medius)$`, ["muscular"]),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "Arcus aortae · Truncus brachiocephalicus · Aa. carotides communes, subclaviae",
      name: { vi: "Động mạch: cung chủ, cánh tay–đầu, cảnh chung, dưới đòn", en: "Arteries: aortic arch, brachiocephalic, common carotid, subclavian", zh: "动脉：主动脉弓、头臂干、颈总动脉、锁骨下动脉" },
      note: {
        vi: "Động mạch dưới đòn đi sau cơ bậc thang trước. Bị chèn lâu có thể gây phình sau chỗ hẹp và cục máu đông trôi xuống tay.",
        en: "The subclavian artery passes behind scalenus anterior. Long-standing compression can cause a post-stenotic aneurysm and clots that travel to the hand.",
        zh: "锁骨下动脉经前斜角肌后方。长期受压可致狭窄后动脉瘤及血栓脱落至手部。",
      },
      ids: R(`^arch of aorta$|^brachiocephalic artery$|^${SIDE}(common carotid|subclavian|vertebral|internal thoracic) artery$|^${SIDE}thyrocervical trunk$`, ART).filter((id) => betweenY([id], 1.3, 1.52).length),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. subclaviae, jugulares internae, brachiocephalicae · V. cava superior",
      name: { vi: "Tĩnh mạch: dưới đòn, cảnh trong, cánh tay–đầu, chủ trên", en: "Veins: subclavian, internal jugular, brachiocephalic, SVC", zh: "静脉：锁骨下、颈内、头臂静脉与上腔静脉" },
      note: {
        vi: "Tĩnh mạch dưới đòn đi trước cơ bậc thang trước, giữa xương đòn và sườn I. Vận động tay quá mức ở vận động viên có thể gây huyết khối ở đây (hội chứng Paget–Schroetter).",
        en: "The subclavian vein runs in front of scalenus anterior, between clavicle and first rib; strenuous arm use in athletes can cause thrombosis here (Paget–Schroetter syndrome).",
        zh: "锁骨下静脉经前斜角肌前方、锁骨与第1肋之间；运动员过度用臂可致此处血栓（Paget–Schroetter综合征）。",
      },
      ids: R(`^${SIDE}(subclavian|internal jugular|brachiocephalic) vein$|^superior vena cava$`, VEN),
    },
    {
      key: "tang",
      tint: "#6fae9f",
      latin: "Trachea · Oesophagus · Thymus",
      name: { vi: "Khí quản, thực quản, tuyến ức", en: "Trachea, oesophagus, thymus", zh: "气管、食管、胸腺" },
      note: {
        vi: "Thực quản nằm sau khí quản, trước cột sống. Tuyến ức ở trẻ lớn có thể lên tới cổ qua lỗ này.",
        en: "The oesophagus lies behind the trachea and in front of the spine. In children the thymus can extend up into the neck through the aperture.",
        zh: "食管位于气管后方、脊柱前方。儿童胸腺可经此口向上延伸至颈部。",
      },
      ids: R(`^trachea$|^esophagus$|lobe of thymus$`),
    },
  ],
});
