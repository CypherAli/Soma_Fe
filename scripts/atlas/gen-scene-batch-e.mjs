/**
 * Đợt 4E — thân mình (ngực, bụng, lưng), dựng từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-batch-e.mjs
 *
 * Tên "segmental artery/vein" dùng chung cho phổi, thận, gan — luôn lọc độ
 * cao vùng ngực (y 1,15–1,50) khi lấy mạch phân thùy phổi.
 *
 * ĐỔI CHỦ ĐỀ (atlas không có tuyến giáp, cơ thẳng/chéo trong/ngang bụng,
 * cân ngực–thắt lưng, phúc mạc thành, hạch–mạch bạch huyết, thân giao cảm,
 * tuyến vú, màng phổi):
 *   tuyen-giap          → Tuyến thượng thận
 *   co-bung             → Cơ dựng sống và cơ ngang gai
 *   can-nguc-that-lung  → Thân tạng và các nhánh
 *   phuc-mac-mac-treo   → Đại tràng, mạc treo và mạch đại tràng
 *   he-bach-huyet       → Tuyến ức và lách
 *   than-kinh-tu-chu    → Hệ tĩnh mạch đơn và mạch gian sườn
 *   vung-nguc-tuyen-vu  → Cơ vùng ngực
 *   mang-phoi           → Động mạch và tĩnh mạch phổi phân thùy
 */
import { byRe, emit, betweenY, fromScene, OXY, DEOXY } from "./lib.mjs";

const ART = ["arterial"];
const VEN = ["venous"];
const BONE = ["skeletal"];
const MU = ["muscular", "skeletal"];
const SIDE = "(left |right )?";
const R = (s, sys) => byRe(new RegExp(s, "i"), sys);
const RIBS = () => R(`^${SIDE}(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) rib$`, BONE);
const CART = () => R(`^${SIDE}(first|second|third|fourth|fifth|sixth|seventh) costal cartilage$`, BONE);
const STERNUM = () => R(`^(manubrium|body of sternum|xiphoid process)$`, BONE);
const TVERT = () => R(`^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) thoracic vertebra$`, BONE);
const LVERT = () => R(`^(first|second|third|fourth|fifth) lumbar vertebra$`, BONE);
const LUNG_Y = (ids) => betweenY(ids, 1.15, 1.5);

// ───────────────────────── 1. Giải phẫu thân mình ─────────────────────────
emit({
  file: "trunk-overview",
  script: "batch-e",
  exportName: "trunkOverviewScene",
  header: 'Scene "Giải phẫu thân mình" (tổng quan) dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu nhu mô phổi, màng phổi, phúc mạc, cơ thẳng bụng và cơ lưng rộng.',
  scene: {
    slug: "giai-phau-than",
    title: { vi: "Giải phẫu thân mình: tổng quan theo lớp", en: "Anatomy of the Trunk: an Overview by Layer", zh: "躯干解剖：分层概览" },
    latin: "Truncus",
    intro: {
      vi: "Thân mình gồm ngực và bụng, ngăn nhau bởi cơ hoành. Scene đi từ ngoài vào trong: khung xương (lồng ngực, cột sống), lớp cơ thành (ngực lớn, răng trước, chéo bụng ngoài, gian sườn, hoành), rồi đến tạng. Trong ngực có tim, các mạch lớn và cây phế quản. Trong bụng có dạ dày, gan, lách, tuỵ, ruột và thận. Làm mờ từng lớp để bóc tách như trên bàn mổ. Bộ dữ liệu không có nhu mô phổi (chỉ có cây phế quản), màng phổi, phúc mạc, cơ thẳng bụng và cơ lưng rộng.",
      en: "The trunk is the thorax and abdomen, separated by the diaphragm. The scene works from outside in: the skeleton (rib cage, spine), the muscular wall (pectoralis major, serratus anterior, external oblique, intercostals, diaphragm), then the organs. The thorax holds the heart, great vessels and bronchial tree. The abdomen holds the stomach, liver, spleen, pancreas, intestines and kidneys. Fade each layer to dissect as on the table. The dataset has no lung tissue (only the bronchial tree), pleura, peritoneum, rectus abdominis or latissimus dorsi.",
      zh: "躯干由胸部和腹部组成，以膈分隔。本场景由外向内：骨架（胸廓、脊柱）、肌性壁（胸大肌、前锯肌、腹外斜肌、肋间肌、膈），再到脏器。胸腔内有心、大血管和支气管树；腹腔内有胃、肝、脾、胰、肠和肾。逐层淡化可如解剖台上般剥离。数据集中无肺实质（仅有支气管树）、胸膜、腹膜、腹直肌和背阔肌。",
    },
  },
  frame: ["xuong", "co"],
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Compages thoracis · Columna vertebralis",
      name: { vi: "Lồng ngực và cột sống", en: "Rib cage and spine", zh: "胸廓与脊柱" },
      note: {
        vi: "12 đôi xương sườn, xương ức, 12 đốt sống ngực và 5 đốt thắt lưng. Lồng ngực bảo vệ tim phổi và nửa trên gan, lách.",
        en: "Twelve pairs of ribs, the sternum, 12 thoracic and 5 lumbar vertebrae. The cage shields heart, lungs and the upper liver and spleen.",
        zh: "12对肋、胸骨、12块胸椎和5块腰椎。胸廓保护心、肺及肝脾上部。",
      },
      ids: RIBS().concat(CART(), STERNUM(), TVERT(), LVERT()),
    },
    {
      key: "co",
      tint: "#c9705f",
      latin: "Mm. pectoralis major, serratus anterior, obliquus externus, intercostales",
      name: { vi: "Cơ thành ngực–bụng", en: "Muscles of the chest and abdominal wall", zh: "胸腹壁肌" },
      note: {
        vi: "Cơ gian sườn nâng hạ xương sườn khi thở. Cơ chéo bụng ngoài là lớp nông nhất của thành bụng bên, thớ chạy như tay đút túi quần.",
        en: "The intercostals raise and lower the ribs in breathing. External oblique is the outermost layer of the lateral abdominal wall, its fibres running like hands in trouser pockets.",
        zh: "肋间肌在呼吸时升降肋骨。腹外斜肌为腹外侧壁最浅层，纤维走向如双手插入裤袋。",
      },
      ids: R(`part of ${SIDE}pectoralis major$|^${SIDE}(serratus anterior|external oblique)$|intercostal muscle$`, MU),
    },
    {
      key: "hoanh",
      tint: "#e8883d",
      latin: "Diaphragma",
      name: { vi: "Cơ hoành", en: "Diaphragm", zh: "膈" },
      note: {
        vi: "Cơ hô hấp chính, hình vòm. Khi co, vòm hạ xuống khoảng 1,5cm lúc thở thường, làm lồng ngực tăng thể tích.",
        en: "The main muscle of breathing, dome-shaped. Contracting, it descends about 1.5cm in quiet breathing and enlarges the chest.",
        zh: "主要呼吸肌，呈穹窿状，收缩时平静呼吸下降约1.5cm，扩大胸腔容积。",
      },
      ids: R(`^diaphragm$`, ["muscular"]),
    },
    {
      key: "tim",
      tint: "#b03a48",
      latin: "Cor",
      name: { vi: "Tim", en: "Heart", zh: "心" },
      note: {
        vi: "Nằm trong trung thất giữa, hai phần ba lệch trái đường giữa. Chi tiết ở bài Giải phẫu tim.",
        en: "In the middle mediastinum, two-thirds left of the midline. See the Heart scene for detail.",
        zh: "位于中纵隔，约2/3在中线左侧。详见心脏场景。",
      },
      ids: fromScene("heart", ["nhi-phai", "that-phai", "nhi-trai", "that-trai"]),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "Aorta · Vv. cavae · Truncus pulmonalis",
      name: { vi: "Mạch lớn", en: "Great vessels", zh: "大血管" },
      note: {
        vi: "Động mạch chủ đi từ tim, uốn cung rồi xuống dọc cột sống; tĩnh mạch chủ trên và dưới đổ về nhĩ phải.",
        en: "The aorta leaves the heart, arches and descends along the spine; the superior and inferior venae cavae return to the right atrium.",
        zh: "主动脉出心后成弓，再沿脊柱下行；上、下腔静脉回流入右心房。",
      },
      ids: R(`^(ascending aorta|arch of aorta|descending thoracic aorta|abdominal aorta|pulmonary trunk)$`, ART).concat(R(`^(superior|inferior) vena cava$`, VEN)),
    },
    {
      key: "tho",
      tint: "#6fae9f",
      latin: "Trachea · Arbor bronchialis",
      name: { vi: "Khí quản và cây phế quản", en: "Trachea and bronchial tree", zh: "气管与支气管树" },
      note: {
        vi: "Khí quản chia đôi ngang T4–T5. Phế quản gốc phải ngắn, to và dốc hơn bên trái, nên dị vật hay rơi vào phổi phải.",
        en: "The trachea divides at T4–T5. The right main bronchus is shorter, wider and steeper, so inhaled objects usually go right.",
        zh: "气管在T4–T5平面分叉。右主支气管短、粗、陡，故异物多坠入右肺。",
      },
      ids: R(`^trachea$|main bronchus|bronchial tree$`, ["respiratory"]),
    },
    {
      key: "bung",
      tint: "#e6c14a",
      latin: "Viscera abdominis",
      name: { vi: "Tạng bụng", en: "Abdominal organs", zh: "腹腔脏器" },
      note: {
        vi: "Gan lớn nhất, dưới vòm hoành phải. Dạ dày và lách bên trái. Tuỵ và thận nằm sau phúc mạc, áp vào thành bụng sau.",
        en: "The liver, the largest, lies under the right dome of the diaphragm; stomach and spleen are on the left. Pancreas and kidneys lie behind the peritoneum against the posterior wall.",
        zh: "肝最大，位于右膈穹窿下；胃和脾在左侧。胰和肾位于腹膜后，贴附腹后壁。",
      },
      ids: R(`^(esophagus|stomach|duodenum|ascending colon|transverse colon|descending colon|appendix|rectum|spleen|pancreas)$|part of (jejunum|ileum)$|^${SIDE}kidney$`).concat(fromScene("liver", ["phan-thuy-1", "phan-thuy-2", "phan-thuy-3", "phan-thuy-4", "phan-thuy-5", "phan-thuy-6", "phan-thuy-7", "phan-thuy-8", "tui-mat"])),
    },
  ],
  // Lớp cơ thành che kín tạng (đã chụp kiểm) — mở trang đã thấy tạng qua lớp mờ.
  faded: ["xuong", "co", "hoanh"],
});

// ───────────────────────── 2. Hệ nội tiết ─────────────────────────
emit({
  file: "endocrine",
  script: "batch-e",
  exportName: "endocrineScene",
  header: 'Scene "Hệ nội tiết" dựng từ bộ atlas BodyParts3D.\n\nAtlas KHÔNG có tuyến giáp và cận giáp — nói rõ trong intro, không thay bằng cấu trúc khác.',
  scene: {
    slug: "he-noi-tiet",
    title: { vi: "Các tuyến nội tiết", en: "The Endocrine Glands", zh: "内分泌腺" },
    latin: "Glandulae endocrinae",
    intro: {
      vi: "Tuyến nội tiết đổ hormon thẳng vào máu, không qua ống dẫn. Chúng nằm rải khắp cơ thể. Vùng dưới đồi và tuyến yên ở nền não điều khiển các tuyến khác qua trục hạ đồi–tuyến yên. Tuyến tùng tiết melatonin theo nhịp ngày đêm. Tuyến ức nuôi lympho T, rất lớn ở trẻ em rồi teo dần. Tuyến thượng thận úp trên hai thận, tiết cortisol, aldosteron và adrenalin. Tuỵ nội tiết (đảo Langerhans) tiết insulin và glucagon. Tinh hoàn tiết testosteron. Bộ dữ liệu không có tuyến giáp và cận giáp. Scene có ít mảnh vì các tuyến nhỏ và xa nhau; mỗi tuyến một màu.",
      en: "Endocrine glands release hormones straight into the blood, without ducts, and are scattered through the body. The hypothalamus and pituitary at the base of the brain control the others through the hypothalamic–pituitary axis. The pineal releases melatonin on a day–night rhythm. The thymus trains T lymphocytes; it is large in childhood and then shrinks. The adrenals sit on the kidneys and release cortisol, aldosterone and adrenaline. The endocrine pancreas (islets of Langerhans) releases insulin and glucagon. The testes release testosterone. The dataset has no thyroid or parathyroid glands. The scene has few pieces because the glands are small and far apart; each gland has its own colour.",
      zh: "内分泌腺将激素直接释放入血，无导管，散布全身。脑底的下丘脑和垂体经下丘脑–垂体轴调控其他腺体。松果体按昼夜节律分泌褪黑素。胸腺培育T淋巴细胞，儿童期很大，此后逐渐萎缩。肾上腺位于两肾上方，分泌皮质醇、醛固酮和肾上腺素。胰腺内分泌部（胰岛）分泌胰岛素和胰高血糖素。睾丸分泌睾酮。数据集中无甲状腺和甲状旁腺。因腺体小且分散，场景部件较少；每个腺一种颜色。",
    },
  },
  groups: [
    {
      key: "ha-doi-yen",
      tint: "#d9534f",
      latin: "Hypothalamus · Hypophysis",
      name: { vi: "Vùng dưới đồi và tuyến yên", en: "Hypothalamus and pituitary", zh: "下丘脑与垂体" },
      note: {
        vi: "Tuyến yên nặng chưa tới 1g nhưng điều khiển tuyến giáp, thượng thận, sinh dục, và tiết hormon tăng trưởng, prolactin. Thuỳ sau chứa ADH và oxytocin do vùng dưới đồi làm ra.",
        en: "The pituitary weighs under 1g yet drives the thyroid, adrenals and gonads and releases growth hormone and prolactin. Its posterior lobe stores ADH and oxytocin made in the hypothalamus.",
        zh: "垂体不足1g，却调控甲状腺、肾上腺和性腺，并分泌生长激素和催乳素。垂体后叶储存下丘脑合成的抗利尿激素和催产素。",
      },
      ids: R(`^pituitary gland$|^hypothalamus$|^tuber cinereum$`),
    },
    {
      key: "tung",
      tint: "#b58bc4",
      latin: "Glandula pinealis",
      name: { vi: "Tuyến tùng", en: "Pineal gland", zh: "松果体" },
      note: {
        vi: "Tiết melatonin khi trời tối. Thường vôi hoá ở người lớn, là mốc đường giữa trên phim X quang và CT.",
        en: "Releases melatonin in darkness. Often calcified in adults, a midline marker on X-ray and CT.",
        zh: "黑暗时分泌褪黑素。成人常钙化，是X线和CT上的中线标志。",
      },
      ids: R(`^pineal body$`),
    },
    {
      key: "uc",
      tint: "#8fb0c8",
      latin: "Thymus",
      name: { vi: "Tuyến ức", en: "Thymus", zh: "胸腺" },
      note: {
        vi: "Nằm trung thất trên, sau xương ức. Tiết thymosin; u tuyến ức hay đi kèm bệnh nhược cơ.",
        en: "In the superior mediastinum behind the sternum; it secretes thymosin. Thymoma is often associated with myasthenia gravis.",
        zh: "位于胸骨后方的上纵隔，分泌胸腺素。胸腺瘤常伴重症肌无力。",
      },
      ids: R(`lobe of thymus$`),
    },
    {
      key: "thuong-than",
      tint: "#e8883d",
      latin: "Glandulae suprarenales",
      name: { vi: "Tuyến thượng thận", en: "Adrenal glands", zh: "肾上腺" },
      note: {
        vi: "Vỏ tiết corticoid, tuỷ tiết catecholamin. Tuyến phải hình tháp, tuyến trái hình bán nguyệt. Chi tiết ở bài Tuyến thượng thận.",
        en: "The cortex makes corticosteroids and the medulla catecholamines. The right gland is pyramidal, the left crescentic. See the Adrenal scene for detail.",
        zh: "皮质分泌皮质激素，髓质分泌儿茶酚胺。右侧呈锥形，左侧呈半月形。详见肾上腺场景。",
      },
      ids: R(`^${SIDE}adrenal gland$`),
    },
    {
      key: "tuy",
      tint: "#e6c14a",
      latin: "Pancreas (pars endocrina)",
      name: { vi: "Tuỵ (phần nội tiết)", en: "Pancreas (endocrine part)", zh: "胰（内分泌部）" },
      note: {
        vi: "Khoảng một triệu đảo Langerhans chỉ chiếm 1–2% khối tuỵ, tập trung nhiều ở đuôi tuỵ. Tế bào beta tiết insulin; mất chúng gây đái tháo đường týp 1.",
        en: "About a million islets of Langerhans make up only 1–2% of the pancreas, most numerous in the tail. Beta cells make insulin; losing them causes type 1 diabetes.",
        zh: "约100万个胰岛仅占胰腺的1–2%，以胰尾最多。β细胞分泌胰岛素，其丧失致1型糖尿病。",
      },
      // Chỉ lấy "Pancreas" (FJ1895): "Parenchyma of pancreas" là lưới trùng cùng chỗ (audit).
      ids: R(`^pancreas$`),
    },
    {
      key: "tinh-hoan",
      tint: "#6fae7f",
      latin: "Testes",
      name: { vi: "Tinh hoàn (tế bào Leydig)", en: "Testes (Leydig cells)", zh: "睾丸（间质细胞）" },
      note: {
        vi: "Tế bào Leydig giữa các ống sinh tinh tiết testosteron dưới tác dụng của LH từ tuyến yên.",
        en: "Leydig cells between the seminiferous tubules release testosterone under pituitary LH.",
        zh: "生精小管之间的间质细胞在垂体LH作用下分泌睾酮。",
      },
      ids: R(`^${SIDE}testis$`),
    },
  ],
});

// ─────────────── 3. Tuyến thượng thận (đổi chủ đề) ───────────────
emit({
  file: "adrenal",
  script: "batch-e",
  exportName: "adrenalScene",
  header: 'Scene "Tuyến thượng thận" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Tuyến giáp" cũ: atlas không có tuyến giáp, cận giáp. Atlas thiếu ĐM thượng thận trên.',
  scene: {
    slug: "tuyen-giap",
    system: "endocrine",
    title: { vi: "Tuyến thượng thận và mạch nuôi", en: "The Adrenal Glands and their Vessels", zh: "肾上腺及其血管" },
    latin: "Glandulae suprarenales",
    intro: {
      vi: "Hai tuyến thượng thận úp trên cực trên hai thận, nằm sau phúc mạc, trong cùng bao mỡ thận. Mỗi tuyến có hai phần. Vỏ ngoài từ trung bì, tiết aldosteron, cortisol và androgen. Tuỷ trong từ mào thần kinh, tiết adrenalin và noradrenalin. Tuyến được ba nguồn động mạch nuôi: trên (từ động mạch hoành dưới), giữa (từ động mạch chủ) và dưới (từ động mạch thận). Nhưng mỗi tuyến chỉ đổ về một tĩnh mạch. Tĩnh mạch phải ngắn, đổ thẳng vào tĩnh mạch chủ dưới nên dễ rách khi mổ. Tĩnh mạch trái đổ vào tĩnh mạch thận trái. Bộ dữ liệu không có động mạch thượng thận trên. Tuyến màu cam, động mạch đỏ, tĩnh mạch xanh; thận mờ sẵn.",
      en: "The two adrenal glands cap the upper poles of the kidneys, behind the peritoneum within the renal fat. Each has two parts. The outer cortex, from mesoderm, makes aldosterone, cortisol and androgens. The inner medulla, from neural crest, makes adrenaline and noradrenaline. Each gland has three arterial sources: superior (from the inferior phrenic), middle (from the aorta) and inferior (from the renal artery). But it drains through a single vein. The right vein is short and enters the inferior vena cava directly, so it tears easily at surgery. The left drains into the left renal vein. The dataset has no superior suprarenal artery. The glands are orange, arteries red, veins blue; kidneys are faded.",
      zh: "两侧肾上腺覆于肾上极，位于腹膜后、肾脂肪囊内。每侧分两部：外层皮质源于中胚层，分泌醛固酮、皮质醇和雄激素；内层髓质源于神经嵴，分泌肾上腺素和去甲肾上腺素。每腺有三个动脉来源：上（来自膈下动脉）、中（来自主动脉）、下（来自肾动脉），但仅一条静脉回流。右肾上腺静脉短，直接注入下腔静脉，手术时易撕裂；左侧注入左肾静脉。数据集中无肾上腺上动脉。腺体橙色，动脉红，静脉蓝；肾淡化。",
    },
  },
  faded: ["than"],
  // Căn cả hai thận: chỉ căn theo tuyến + mạch nhỏ thì khung sát quá, ĐM chủ/TM chủ và
  // thận tràn khỏi màn hình (kiểm trang 12/09).
  frame: ["tuyen", "dm", "tm", "than"],
  groups: [
    {
      key: "tuyen",
      tint: "#e8883d",
      latin: "Glandula suprarenalis",
      name: { vi: "Tuyến thượng thận phải và trái", en: "Right and left adrenal glands", zh: "左、右肾上腺" },
      note: {
        vi: "Vỏ có ba lớp: cầu (aldosteron), bó (cortisol), lưới (androgen). U tuỷ thượng thận tiết adrenalin từng cơn gây tăng huyết áp kịch phát, vã mồ hôi, hồi hộp.",
        en: "The cortex has three zones: glomerulosa (aldosterone), fasciculata (cortisol), reticularis (androgens). A phaeochromocytoma of the medulla releases bursts of adrenaline, causing paroxysmal hypertension, sweating and palpitations.",
        zh: "皮质分三带：球状带（醛固酮）、束状带（皮质醇）、网状带（雄激素）。髓质嗜铬细胞瘤阵发性释放肾上腺素，致阵发性高血压、出汗和心悸。",
      },
      ids: R(`^${SIDE}adrenal gland$`),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "Aa. suprarenales media et inferior",
      name: { vi: "Động mạch thượng thận giữa và dưới", en: "Middle and inferior suprarenal arteries", zh: "肾上腺中、下动脉" },
      note: {
        vi: "Tuyến thượng thận là một trong những cơ quan được cấp máu nhiều nhất tính theo khối lượng.",
        en: "Gram for gram, the adrenal is among the best-perfused organs in the body.",
        zh: "按单位重量计，肾上腺是血供最丰富的器官之一。",
      },
      ids: R(`^${SIDE}(middle|inferior) suprarenal artery$`, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. suprarenales",
      name: { vi: "Tĩnh mạch thượng thận", en: "Suprarenal veins", zh: "肾上腺静脉" },
      note: {
        vi: "Lấy máu tĩnh mạch thượng thận hai bên để tìm bên tiết aldosteron thừa trong cường aldosteron nguyên phát.",
        en: "Sampling both adrenal veins locates the side making excess aldosterone in primary hyperaldosteronism.",
        zh: "原发性醛固酮增多症需双侧肾上腺静脉采血以定位分泌过多的一侧。",
      },
      ids: R(`^${SIDE}suprarenal vein$`, VEN),
    },
    {
      key: "mach-lon",
      tint: "#d99a8f",
      latin: "Aorta abdominalis · A. renalis · V. cava inferior · V. renalis",
      name: { vi: "Động mạch chủ bụng, thận và tĩnh mạch chủ dưới (nguồn)", en: "Abdominal aorta, renal vessels and IVC (sources)", zh: "腹主动脉、肾血管与下腔静脉（来源）" },
      note: {
        vi: "Cho thấy tĩnh mạch thượng thận phải đổ thẳng vào tĩnh mạch chủ, còn bên trái đi vòng qua tĩnh mạch thận.",
        en: "Shows the right adrenal vein entering the IVC directly while the left goes via the renal vein.",
        zh: "显示右肾上腺静脉直接注入下腔静脉，左侧经肾静脉回流。",
      },
      ids: R(`^abdominal aorta$|^${SIDE}renal artery$`, ART).concat(R(`^inferior vena cava$|^${SIDE}renal vein$`, VEN)),
    },
    {
      key: "than",
      latin: "Renes",
      name: { vi: "Thận (mốc)", en: "Kidneys (landmarks)", zh: "肾（标志）" },
      note: {
        vi: "Mờ sẵn. Thận ghép hay thận lạc chỗ không kéo tuyến thượng thận theo, vì hai cơ quan có nguồn gốc phôi khác nhau.",
        en: "Faded. A transplanted or ectopic kidney does not take the adrenal with it, because the two have different embryonic origins.",
        zh: "淡化。移植肾或异位肾不会带动肾上腺，因二者胚胎起源不同。",
      },
      ids: R(`^${SIDE}kidney$`),
    },
  ],
});

// ───────────────────────── 4. Thành bụng ─────────────────────────
emit({
  file: "abdominal-wall",
  script: "batch-e",
  exportName: "abdominalWallScene",
  header: 'Scene "Thành bụng trước bên" dựng từ bộ atlas BodyParts3D.\n\nAtlas KHÔNG có cơ thẳng bụng, chéo bụng trong, ngang bụng, bao cơ thẳng — chỉ có chéo bụng ngoài và đường trắng.',
  scene: {
    slug: "thanh-bung",
    title: { vi: "Thành bụng trước bên: cơ chéo ngoài, đường trắng, mạch thượng vị", en: "The Anterolateral Abdominal Wall", zh: "腹前外侧壁" },
    latin: "Paries abdominis anterolateralis",
    intro: {
      vi: "Thành bụng trước bên có ba lớp cơ dẹt: chéo ngoài, chéo trong và ngang bụng. Thớ của ba lớp bắt chéo nhau như ván ép, nên thành bụng mỏng mà chắc. Ở giữa, cân của chúng bọc cơ thẳng bụng rồi gặp nhau thành đường trắng. Bộ dữ liệu chỉ có cơ chéo ngoài, đường trắng và các mạch thượng vị, nên scene dạy lớp nông và hệ mạch. Động mạch thượng vị trên (từ ngực trong) và thượng vị dưới (từ chậu ngoài) nối nhau trong bao cơ thẳng. Đó là một đường vòng nối giữa chi trên và chi dưới. Cơ màu đỏ, cân trắng, mạch đỏ–xanh; khung xương mờ sẵn.",
      en: "The anterolateral abdominal wall has three flat muscle layers: external oblique, internal oblique and transversus abdominis. Their fibres cross like plywood, so the wall is thin but strong. In the midline their aponeuroses sheath rectus abdominis and meet as the linea alba. The dataset has only external oblique, the linea alba and the epigastric vessels, so the scene teaches the superficial layer and the vessels. The superior epigastric artery (from the internal thoracic) and the inferior epigastric (from the external iliac) join inside the rectus sheath. This is a bypass route between the upper and lower body. Muscle is red, aponeurosis white, vessels red and blue; the skeleton is faded.",
      zh: "腹前外侧壁有三层扁肌：腹外斜肌、腹内斜肌和腹横肌，纤维如胶合板般交叉，使腹壁薄而坚韧。在中线处其腱膜包裹腹直肌后汇合成白线。数据集中仅有腹外斜肌、白线和腹壁血管，故本场景讲授浅层和血管。腹壁上动脉（来自胸廓内动脉）与腹壁下动脉（来自髂外动脉）在腹直肌鞘内吻合，是上下半身之间的侧支通路。肌红色，腱膜白色，血管红蓝；骨架淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["cheo-ngoai", "duong-trang", "dm", "tm"],
  groups: [
    {
      key: "cheo-ngoai",
      tint: "#c9705f",
      latin: "M. obliquus externus abdominis",
      name: { vi: "Cơ chéo bụng ngoài", en: "External oblique", zh: "腹外斜肌" },
      note: {
        vi: "Mọc từ 8 xương sườn dưới, đan răng cưa với cơ răng trước. Bờ dưới cân của nó cuộn lại thành dây chằng bẹn (không có trong bộ dữ liệu).",
        en: "Arises from the lower eight ribs, interdigitating with serratus anterior. The lower edge of its aponeurosis rolls under to form the inguinal ligament (not in the dataset).",
        zh: "起于下8肋，与前锯肌呈锯齿状交错。其腱膜下缘卷曲形成腹股沟韧带（数据集中无）。",
      },
      ids: R(`^${SIDE}external oblique$`, ["muscular"]),
    },
    {
      key: "duong-trang",
      tint: "#f0ede4",
      latin: "Linea alba",
      name: { vi: "Đường trắng", en: "Linea alba", zh: "白线" },
      note: {
        vi: "Dải cân giữa, từ mũi ức tới khớp mu, ít mạch máu nên là đường mổ bụng kinh điển. Rốn nằm trên đường này. Chỗ yếu có thể gây thoát vị trên rốn.",
        en: "The midline aponeurotic band from xiphoid to pubic symphysis; nearly bloodless, it is the classic incision. The umbilicus lies on it, and weak spots cause epigastric hernias.",
        zh: "自剑突至耻骨联合的中线腱膜带，血管少，为经典腹部切口。脐位于其上，薄弱处可致上腹疝。",
      },
      ids: R(`^linea alba$`, ["connective"]),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "Aa. epigastricae superior, inferior, superficialis",
      name: { vi: "Động mạch thượng vị trên, dưới, nông", en: "Superior, inferior and superficial epigastric arteries", zh: "腹壁上、下、浅动脉" },
      note: {
        vi: "Động mạch thượng vị dưới là mốc phân biệt thoát vị bẹn trực tiếp (trong mạch) và gián tiếp (ngoài mạch). Chọc dẫn lưu bụng phải tránh đường đi của nó.",
        en: "The inferior epigastric artery separates direct (medial) from indirect (lateral) inguinal hernias; abdominal drains must avoid its course.",
        zh: "腹壁下动脉是区分腹股沟直疝（内侧）与斜疝（外侧）的标志；腹腔穿刺引流须避开其走行。",
      },
      ids: R(`^${SIDE}(superior|inferior|superficial) epigastric artery$|^${SIDE}(internal thoracic|musculophrenic) artery$`, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. epigastricae",
      name: { vi: "Tĩnh mạch thượng vị", en: "Epigastric veins", zh: "腹壁静脉" },
      note: {
        vi: "Trong tăng áp tĩnh mạch cửa, tĩnh mạch quanh rốn nối với tĩnh mạch thượng vị giãn to, toả ra như đầu sứa.",
        en: "In portal hypertension the paraumbilical veins link to the epigastric veins, which dilate and radiate like a medusa's head.",
        zh: "门静脉高压时脐周静脉与腹壁静脉吻合并扩张，呈放射状如海蛇头。",
      },
      ids: R(`^${SIDE}(superior|inferior|superficial) epigastric vein$`, VEN),
    },
    {
      key: "xuong",
      latin: "Costae VII–XII · Ossa coxae",
      name: { vi: "Bờ sườn và xương chậu (mốc)", en: "Costal margin and hip bones (landmarks)", zh: "肋弓与髋骨（标志）" },
      note: {
        vi: "Mờ sẵn — hai khung bám trên và dưới của thành bụng.",
        en: "Faded — the upper and lower frames of the wall.",
        zh: "淡化——腹壁上下附着框架。",
      },
      ids: R(`^${SIDE}(seventh|eighth|ninth|tenth|eleventh|twelfth) rib$|^${SIDE}(seventh) costal cartilage$|^xiphoid process$|^${SIDE}hip bone$`, BONE),
    },
  ],
});

// ─────────────── 5. Cơ dựng sống và ngang gai (đổi chủ đề) ───────────────
emit({
  file: "erector-spinae",
  script: "batch-e",
  exportName: "erectorSpinaeScene",
  header: 'Scene "Cơ dựng sống và cơ ngang gai" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Cơ bụng" cũ: atlas thiếu cơ thẳng bụng, chéo trong, ngang bụng. Atlas thiếu cơ nhiều chân.',
  scene: {
    slug: "co-bung",
    system: "muscular",
    title: { vi: "Cơ lưng sâu: dựng sống và ngang gai", en: "The Deep Back: Erector Spinae and Transversospinales", zh: "背深肌：竖脊肌与横突棘肌" },
    latin: "Mm. erector spinae · Mm. transversospinales",
    intro: {
      vi: "Cơ lưng thật (cơ lưng sâu) nằm trong rãnh hai bên gai đốt sống, do nhánh sau dây sống chi phối. Cơ dựng sống ở nông, gồm ba cột từ ngoài vào trong: chậu–sườn, cơ dài và cơ gai. Nó duỗi và giữ thẳng cột sống, là cơ chống trọng lực chính khi đứng. Sâu hơn là nhóm ngang gai (bán gai, xoay) chạy chéo từ mỏm ngang lên gai, xoay và giữ vững từng đốt. Sâu nhất là cơ gian gai và gian ngang nối từng đốt kề. Mỗi cột một tông màu; cột sống và xương sườn mờ sẵn. Bộ dữ liệu không có cơ nhiều chân.",
      en: "The true (deep) back muscles lie in the groove either side of the spines and are supplied by the posterior rami of the spinal nerves. Erector spinae is superficial, in three columns from lateral to medial: iliocostalis, longissimus and spinalis. It extends and holds the spine erect, the main antigravity muscle in standing. Deeper lies the transversospinalis group (semispinalis, rotatores), running obliquely from transverse processes up to spines, rotating and stabilising each segment. Deepest are the interspinales and intertransversarii linking adjacent vertebrae. Each column has its own colour family; spine and ribs are faded. The dataset has no multifidus.",
      zh: "固有背肌（背深肌）位于棘突两侧沟内，受脊神经后支支配。竖脊肌居浅层，由外向内分三柱：髂肋肌、最长肌、棘肌，伸直并维持脊柱挺立，是站立时主要的抗重力肌。深层为横突棘肌群（半棘肌、回旋肌），自横突斜向上至棘突，旋转并稳定各节段。最深为连接相邻椎骨的棘间肌和横突间肌。每柱一种色系；脊柱和肋骨淡化。数据集中无多裂肌。",
    },
  },
  faded: ["xuong"],
  frame: ["chau-suon", "dai", "gai", "ban-gai", "sau"],
  groups: [
    {
      key: "chau-suon",
      tint: "#c9705f",
      latin: "M. iliocostalis (lumborum, thoracis, cervicis)",
      name: { vi: "Cột ngoài: cơ chậu–sườn", en: "Lateral column: iliocostalis", zh: "外侧柱：髂肋肌" },
      note: {
        vi: "Từ mào chậu và xương cùng lên góc các xương sườn và mỏm ngang đốt cổ dưới. Co một bên làm nghiêng thân cùng bên.",
        en: "From the iliac crest and sacrum up to the angles of the ribs and the lower cervical transverse processes. Acting alone it bends the trunk to its own side.",
        zh: "自髂嵴和骶骨上至各肋角及下颈椎横突。单侧收缩使躯干侧屈。",
      },
      ids: R(`^${SIDE}iliocostalis (lumborum|thoracis|cervicis)$`, ["muscular"]),
    },
    {
      key: "dai",
      tint: "#e8883d",
      latin: "M. longissimus (thoracis, cervicis, capitis)",
      name: { vi: "Cột giữa: cơ dài", en: "Intermediate column: longissimus", zh: "中间柱：最长肌" },
      note: {
        vi: "Cột dài và to nhất, lên tới tận mỏm chũm xương thái dương. Co thắt cơ dài thắt lưng là nguyên nhân hay gặp của đau lưng cấp.",
        en: "The longest and bulkiest column, reaching as high as the mastoid process. Spasm of the lumbar part is a common cause of acute low back pain.",
        zh: "最长最粗的一柱，上达颞骨乳突。腰部最长肌痉挛是急性腰痛的常见原因。",
      },
      ids: R(`^${SIDE}longissimus (thoracis|cervicis|capitis)$`, ["muscular"]),
    },
    {
      key: "gai",
      tint: "#e6c14a",
      latin: "M. spinalis",
      name: { vi: "Cột trong: cơ gai", en: "Medial column: spinalis", zh: "内侧柱：棘肌" },
      note: {
        vi: "Mảnh nhất, nối gai với gai, rõ nhất ở đoạn ngực.",
        en: "The slenderest, running spine to spine, best developed in the thoracic region.",
        zh: "最细，连于棘突之间，胸段最发达。",
      },
      ids: R(`^${SIDE}spinalis( thoracis)?$`, ["muscular"]),
    },
    {
      key: "ban-gai",
      tint: "#6f93b8",
      latin: "M. semispinalis (thoracis, cervicis, capitis)",
      name: { vi: "Nhóm ngang gai: cơ bán gai", en: "Transversospinalis: semispinalis", zh: "横突棘肌：半棘肌" },
      note: {
        vi: "Vượt qua 4–6 đốt. Bán gai đầu là cơ lớn nhất vùng gáy, giữ đầu ngửa.",
        en: "Spans 4–6 vertebrae. Semispinalis capitis is the largest muscle of the nape and holds the head up.",
        zh: "跨越4–6个椎骨。头半棘肌是项部最大肌，维持头部后仰。",
      },
      ids: R(`^${SIDE}semispinalis (thoracis|cervicis|capitis)$`, ["muscular"]),
    },
    {
      key: "xoay",
      tint: "#8fb0c8",
      latin: "Mm. rotatores",
      name: { vi: "Nhóm ngang gai: cơ xoay", en: "Transversospinalis: rotatores", zh: "横突棘肌：回旋肌" },
      note: {
        vi: "Ngắn nhất, chỉ vượt 1–2 đốt, dày đặc thụ thể cảm nhận tư thế. Chúng giống cảm biến hơn là động cơ.",
        en: "The shortest, spanning 1–2 vertebrae and dense with position-sense receptors — more sensors than motors.",
        zh: "最短，仅跨1–2个椎骨，富含本体感受器——更像传感器而非动力源。",
      },
      ids: R(`^${SIDE}(cervical|thoracic|lumbar) rotator$`, ["muscular"]),
    },
    {
      key: "sau",
      tint: "#9fb8a0",
      latin: "Mm. interspinales · intertransversarii · levatores costarum",
      name: { vi: "Lớp sâu nhất: gian gai, gian ngang, nâng sườn", en: "Deepest layer: interspinales, intertransversarii, levatores costarum", zh: "最深层：棘间肌、横突间肌、肋提肌" },
      note: {
        vi: "Nối từng đốt kề nhau. Cơ nâng sườn từ mỏm ngang tới xương sườn bên dưới, phụ nâng sườn khi thở.",
        en: "Link each vertebra to the next. The levatores costarum run from transverse processes to the rib below and help raise the ribs in breathing.",
        zh: "连接相邻椎骨。肋提肌自横突至下位肋，辅助呼吸时提肋。",
      },
      ids: R(`interspinal(es|is) (cervicis|thoracis|lumborum)$|intertransversari(i|us)$|levatores costarum`, ["muscular"]),
    },
    {
      key: "xuong",
      latin: "Columna vertebralis · Costae · Os sacrum",
      name: { vi: "Cột sống, xương sườn, xương cùng (mốc)", en: "Spine, ribs, sacrum (landmarks)", zh: "脊柱、肋骨、骶骨（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: TVERT().concat(LVERT(), R(`^sacrum$|^(third|fourth|fifth|sixth|seventh) cervical vertebra$`, BONE)),
    },
  ],
});

// ───────────────────────── 6. Vùng lưng (lớp nông) ─────────────────────────
emit({
  file: "back-superficial",
  script: "batch-e",
  exportName: "backSuperficialScene",
  header: 'Scene "Vùng lưng — lớp nông" dựng từ bộ atlas BodyParts3D.\n\nAtlas KHÔNG có cơ lưng rộng và cân ngực–thắt lưng.',
  scene: {
    slug: "vung-lung",
    title: { vi: "Vùng lưng: lớp cơ nông và trung gian", en: "The Back: Superficial and Intermediate Muscles", zh: "背部：浅层与中间层肌" },
    latin: "Regio dorsalis",
    intro: {
      vi: "Cơ lưng chia ba lớp. Lớp nông nối chi trên với thân mình: cơ thang, cơ lưng rộng, cơ trám, cơ nâng vai. Chúng do dây thần kinh của chi trên (nhánh trước) chi phối, và dây XI cho riêng cơ thang. Lớp trung gian là hai cơ răng sau trên và dưới, bám vào xương sườn, phụ hô hấp. Lớp sâu là cơ lưng thật (xem bài Cơ lưng sâu). Scene dựng lớp nông và trung gian; mỗi cơ một màu; xương mờ sẵn. Bộ dữ liệu không có cơ lưng rộng, cơ lớn nhất vùng lưng.",
      en: "The back muscles lie in three layers. The superficial layer ties the upper limb to the trunk: trapezius, latissimus dorsi, rhomboids and levator scapulae. They are supplied by nerves of the upper limb (anterior rami), with nerve XI for trapezius. The intermediate layer is serratus posterior superior and inferior, attached to the ribs, accessory to breathing. The deep layer is the true back muscles (see the Deep Back scene). The scene shows the superficial and intermediate layers, one colour per muscle, bones faded. The dataset lacks latissimus dorsi, the largest back muscle.",
      zh: "背肌分三层：浅层连接上肢与躯干（斜方肌、背阔肌、菱形肌、肩胛提肌），受上肢神经（前支）支配，斜方肌由副神经支配；中间层为上、下后锯肌，附于肋骨，辅助呼吸；深层为固有背肌（见背深肌场景）。本场景显示浅层与中间层，每肌一种颜色，骨骼淡化。数据集中无背部最大的背阔肌。",
    },
  },
  faded: ["xuong"],
  frame: ["thang", "tram", "rang-sau"],
  groups: [
    {
      key: "thang",
      tint: "#b58bc4",
      latin: "M. trapezius",
      name: { vi: "Cơ thang (ba phần)", en: "Trapezius (three parts)", zh: "斜方肌（三部）" },
      note: {
        vi: "Hai cơ thang hai bên ghép thành hình thang, phủ gáy và lưng trên. Phần lên kéo xương vai xuống và cùng phần xuống xoay ổ chảo lên.",
        en: "The two trapezii form a trapezoid over the nape and upper back. The ascending part depresses the scapula and, with the descending part, rotates the glenoid upward.",
        zh: "两侧斜方肌合成斜方形，覆盖项部和上背。升部下降肩胛骨，并与降部共同使关节盂上旋。",
      },
      ids: R(`part of ${SIDE}trapezius$`, ["muscular"]),
    },
    {
      key: "tram",
      tint: "#8a6fb0",
      latin: "Mm. rhomboidei · M. levator scapulae",
      name: { vi: "Cơ trám và cơ nâng vai", en: "Rhomboids and levator scapulae", zh: "菱形肌与肩胛提肌" },
      note: {
        vi: "Nằm dưới cơ thang, do dây vai sau chi phối. Yếu cơ trám làm bờ trong xương vai tách khỏi lồng ngực khi đẩy tay.",
        en: "Lie under trapezius and are supplied by the dorsal scapular nerve. Weak rhomboids let the medial border of the scapula lift off the chest when pushing.",
        zh: "位于斜方肌深面，受肩胛背神经支配。菱形肌无力时推物肩胛骨内侧缘离开胸壁。",
      },
      ids: R(`^${SIDE}(rhomboid major|rhomboid minor|levator scapulae)$`, MU),
    },
    {
      key: "tron-lon",
      tint: "#e39a7a",
      latin: "M. teres major",
      name: { vi: "Cơ tròn lớn", en: "Teres major", zh: "大圆肌" },
      note: {
        vi: "Được gọi là “trợ thủ của cơ lưng rộng”: cùng khép, duỗi, xoay trong cánh tay.",
        en: "Called “latissimus's little helper”: it adducts, extends and medially rotates the arm with it.",
        zh: "称为“背阔肌的助手”，协同内收、伸和内旋上臂。",
      },
      ids: R(`^${SIDE}teres major$`, MU),
    },
    {
      key: "rang-sau",
      tint: "#e8883d",
      latin: "Mm. serratus posterior superior et inferior",
      name: { vi: "Lớp trung gian: cơ răng sau trên và dưới", en: "Intermediate layer: serratus posterior superior and inferior", zh: "中间层：上、下后锯肌" },
      note: {
        vi: "Cơ mỏng bám xương sườn, do dây gian sườn chi phối. Răng sau trên được cho là nâng sườn, răng sau dưới hạ sườn; vai trò hô hấp nhỏ.",
        en: "Thin muscles on the ribs, supplied by intercostal nerves. The superior is thought to raise the ribs and the inferior to lower them; their breathing role is small.",
        zh: "附于肋骨的薄肌，受肋间神经支配。上后锯肌被认为提肋，下后锯肌降肋，呼吸作用甚小。",
      },
      ids: R(`^${SIDE}serratus posterior (superior|inferior)$`, ["muscular"]),
    },
    {
      key: "dung-song",
      tint: "#c9a79e",
      latin: "M. erector spinae",
      name: { vi: "Cơ dựng sống (lớp sâu — mờ sẵn)", en: "Erector spinae (deep layer — faded)", zh: "竖脊肌（深层——淡化）" },
      note: {
        vi: "Bỏ mờ để thấy lớp sâu nằm dưới hai lớp trên.",
        en: "Unfade to see the deep layer beneath the two above.",
        zh: "取消淡化可见上两层下方的深层。",
      },
      ids: R(`^${SIDE}(iliocostalis|longissimus) (lumborum|thoracis|cervicis)$|^${SIDE}spinalis( thoracis)?$`, ["muscular"]),
    },
    {
      key: "xuong",
      latin: "Scapula · Costae · Columna vertebralis",
      name: { vi: "Xương vai, sườn, cột sống (mốc)", en: "Scapulae, ribs, spine (landmarks)", zh: "肩胛骨、肋骨、脊柱（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: R(`^${SIDE}scapula$`, BONE).concat(TVERT(), RIBS()),
    },
  ],
  faded: ["xuong", "dung-song"],
});

// ───────────────────────── 7. Thành ngực ─────────────────────────
emit({
  file: "chest-wall",
  script: "batch-e",
  exportName: "chestWallScene",
  header: 'Scene "Thành ngực" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu mạc nội ngực và màng phổi thành.',
  scene: {
    slug: "thanh-nguc",
    title: { vi: "Thành ngực: xương sườn và cơ gian sườn", en: "The Chest Wall: Ribs and Intercostal Muscles", zh: "胸壁：肋与肋间肌" },
    latin: "Paries thoracis",
    intro: {
      vi: "Thành ngực là khung xương–cơ có thể co giãn. Mỗi khoang gian sườn có ba lớp cơ. Gian sườn ngoài có thớ chạy xuống trước, nâng sườn khi hít vào. Gian sườn trong có thớ chạy xuống sau, hạ sườn khi thở ra gắng sức. Gian sườn trong cùng nằm sâu nhất. Bó mạch–thần kinh gian sườn chạy giữa lớp trong và trong cùng, trong rãnh ở bờ dưới xương sườn. Vì thế chọc dò màng phổi phải đi sát bờ trên xương sườn dưới. Xương sườn chia ba nhóm: thật (I–VII), giả (VIII–X), cụt (XI–XII). Mỗi lớp cơ một tông; mỗi nhóm sườn một sắc.",
      en: "The chest wall is a flexible frame of bone and muscle. Each intercostal space has three muscle layers. External intercostals run down and forward and raise the ribs in inspiration. Internal intercostals run down and back and lower the ribs in forced expiration. The innermost intercostals lie deepest. The intercostal neurovascular bundle runs between the internal and innermost layers, in the groove on the lower border of each rib. So a chest drain or tap must pass just above the upper border of the rib below. The ribs form three groups: true (1–7), false (8–10) and floating (11–12). Each muscle layer has its own colour family, each rib group its own shade.",
      zh: "胸壁是可伸缩的骨肌框架。每个肋间隙有三层肌：肋间外肌纤维向前下，吸气时提肋；肋间内肌纤维向后下，用力呼气时降肋；肋间最内肌居最深。肋间血管神经束行于肋间内肌与最内肌之间、肋骨下缘的肋沟内，故胸腔穿刺须紧贴下位肋骨上缘进针。肋分三组：真肋（1–7）、假肋（8–10）、浮肋（11–12）。每层肌一种色系，每组肋一种色调。",
    },
  },
  frame: ["suon-that", "suon-gia", "gian-ngoai", "gian-trong"],
  groups: [
    {
      key: "suon-that",
      tint: "#d9cfb8",
      latin: "Costae verae (I–VII) · Cartilagines costales · Sternum",
      name: { vi: "Sườn thật (I–VII), sụn sườn và xương ức", en: "True ribs (1–7), costal cartilages and sternum", zh: "真肋（1–7）、肋软骨与胸骨" },
      note: {
        vi: "Mỗi sườn thật nối thẳng vào xương ức bằng sụn sườn riêng. Sụn sườn là sụn hyalin, làm lồng ngực đàn hồi; hồi sức tim phổi đè sâu 5–6cm được là nhờ nó.",
        en: "Each true rib reaches the sternum by its own costal cartilage. The costal cartilages are hyaline and make the cage springy; they are what lets CPR compress the chest 5–6cm.",
        zh: "每条真肋借各自的肋软骨直接连于胸骨。肋软骨为透明软骨，使胸廓富有弹性，心肺复苏按压5–6cm深度依赖于此。",
      },
      ids: R(`^${SIDE}(first|second|third|fourth|fifth|sixth|seventh) rib$`, BONE).concat(CART(), STERNUM()),
    },
    {
      key: "suon-gia",
      tint: "#e6d7b0",
      latin: "Costae spuriae (VIII–X) · Costae fluctuantes (XI–XII)",
      name: { vi: "Sườn giả (VIII–X) và sườn cụt (XI–XII)", en: "False (8–10) and floating (11–12) ribs", zh: "假肋（8–10）与浮肋（11–12）" },
      note: {
        vi: "Sụn của sườn VIII–X nối vào sụn sườn trên nó, tạo bờ sườn. Sườn XI–XII đầu trước tự do trong cơ thành bụng.",
        en: "The cartilages of ribs 8–10 join the cartilage above, forming the costal margin. Ribs 11–12 end freely in the abdominal wall muscles.",
        zh: "第8–10肋软骨连于上位肋软骨，形成肋弓。第11–12肋前端游离于腹壁肌中。",
      },
      ids: R(`^${SIDE}(eighth|ninth|tenth|eleventh|twelfth) rib$`, BONE),
    },
    {
      key: "gian-ngoai",
      tint: "#c9705f",
      latin: "Mm. intercostales externi",
      name: { vi: "Cơ gian sườn ngoài", en: "External intercostals", zh: "肋间外肌" },
      note: {
        vi: "Phía trước, từ sụn sườn trở vào, cơ thay bằng màng gian sườn ngoài.",
        en: "In front, from the costal cartilages inward, the muscle is replaced by the external intercostal membrane.",
        zh: "前方自肋软骨向内，肌被肋间外膜取代。",
      },
      ids: R(`^${SIDE}external intercostal muscle$`, ["muscular"]),
    },
    {
      key: "gian-trong",
      tint: "#e8883d",
      latin: "Mm. intercostales interni",
      name: { vi: "Cơ gian sườn trong", en: "Internal intercostals", zh: "肋间内肌" },
      note: {
        vi: "Phía sau, từ góc sườn trở vào, cơ thay bằng màng gian sườn trong.",
        en: "Behind, from the rib angles inward, the muscle is replaced by the internal intercostal membrane.",
        zh: "后方自肋角向内，肌被肋间内膜取代。",
      },
      ids: R(`^${SIDE}internal intercostal muscle$`, ["muscular"]),
    },
    {
      key: "trong-cung",
      tint: "#e6c14a",
      latin: "Mm. intercostales intimi · M. transversus thoracis",
      name: { vi: "Cơ gian sườn trong cùng và cơ ngang ngực", en: "Innermost intercostals and transversus thoracis", zh: "肋间最内肌与胸横肌" },
      note: {
        vi: "Lớp sâu nhất, cùng hướng thớ với gian sườn trong. Cơ ngang ngực ở mặt sau xương ức.",
        en: "The deepest layer, with fibres running like the internals. Transversus thoracis lies on the back of the sternum.",
        zh: "最深层，纤维方向同肋间内肌。胸横肌位于胸骨后面。",
      },
      ids: R(`^${SIDE}innermost intercostal muscle$|^${SIDE}transversus thoracis$`, ["muscular"]),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "Aa. intercostales posteriores · A. thoracica interna",
      name: { vi: "Động mạch gian sườn sau và ngực trong", en: "Posterior intercostal and internal thoracic arteries", zh: "肋间后动脉与胸廓内动脉" },
      note: {
        vi: "Động mạch gian sườn sau từ động mạch chủ ngực chạy ra trước, nối với nhánh gian sườn trước của động mạch ngực trong. Trong hẹp eo động mạch chủ, các vòng nối này to ra và gặm bờ dưới xương sườn, thấy được trên phim X quang.",
        en: "The posterior intercostals from the thoracic aorta run forward to meet the anterior intercostal branches of the internal thoracic. In coarctation of the aorta these loops enlarge and notch the lower rib borders, visible on X-ray.",
        zh: "肋间后动脉发自胸主动脉，向前与胸廓内动脉的肋间前支吻合。主动脉缩窄时这些吻合支扩张，侵蚀肋骨下缘，X线可见肋骨切迹。",
      },
      ids: R(`intercostal arter(y|ies)$|^${SIDE}(internal thoracic|subcostal) artery$`, ART),
    },
  ],
});

// ───────────────────────── 8. Khớp ức–đòn ─────────────────────────
emit({
  file: "sternoclavicular",
  script: "batch-e",
  exportName: "sternoclavicularScene",
  header: 'Scene "Khớp ức–đòn" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu đĩa khớp, bao khớp, dây chằng ức–đòn và sườn–đòn — bài dạy xương + cơ + liên quan mạch.',
  scene: {
    slug: "khop-uc-don",
    title: { vi: "Khớp ức–đòn: xương, cơ và liên quan", en: "The Sternoclavicular Joint: Bones, Muscles and Relations", zh: "胸锁关节：骨、肌与毗邻" },
    latin: "Articulatio sternoclavicularis",
    intro: {
      vi: "Khớp ức–đòn là khớp duy nhất nối chi trên với thân mình. Đầu trong xương đòn tựa vào khuyết đòn của cán ức và sụn sườn I. Mặt khớp không khớp nhau, được một đĩa sụn chêm vào giữa. Nhờ các dây chằng rất khoẻ, xương đòn gãy trước khi khớp này trật. Khi trật ra sau, đầu xương đòn có thể đè vào tĩnh mạch cánh tay–đầu, động mạch và khí quản ngay phía sau. Đây là cấp cứu. Scene cho thấy xương, cơ bám quanh khớp và mạch lớn liên quan. Bộ dữ liệu không có đĩa khớp và dây chằng.",
      en: "The sternoclavicular joint is the only joint linking the upper limb to the trunk. The medial end of the clavicle rests on the clavicular notch of the manubrium and the first costal cartilage. The surfaces are incongruent and an articular disc sits between them. Its ligaments are so strong that the clavicle breaks before the joint dislocates. When it does dislocate backwards, the clavicle can press on the brachiocephalic vein, artery and trachea right behind it — an emergency. The scene shows the bones, the muscles around the joint and the great vessels nearby. The dataset has no disc or ligaments.",
      zh: "胸锁关节是上肢与躯干之间唯一的关节。锁骨内侧端靠于胸骨柄锁切迹和第1肋软骨上，关节面不相适应，中间有关节盘。其韧带极强，锁骨往往先骨折而关节不脱位。若向后脱位，锁骨内端可压迫其正后方的头臂静脉、动脉和气管，属急症。本场景显示骨、关节周围肌肉及毗邻大血管。数据集中无关节盘和韧带。",
    },
  },
  frame: ["xuong", "co", "mach"],
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Manubrium sterni · Clavicula · Costa I",
      name: { vi: "Cán ức, xương đòn, xương sườn I và sụn sườn I", en: "Manubrium, clavicle, first rib and costal cartilage", zh: "胸骨柄、锁骨、第1肋及肋软骨" },
      note: {
        vi: "Đầu trong xương đòn là nơi cốt hoá muộn nhất cơ thể (khoảng 25 tuổi). Pháp y dùng mốc này để ước tuổi.",
        en: "The medial end of the clavicle is the last growth centre in the body to fuse (about age 25); forensic experts use it to estimate age.",
        zh: "锁骨内侧端是全身最晚闭合的骨化中心（约25岁），法医以此推断年龄。",
      },
      ids: R(`^manubrium$|^${SIDE}(clavicle|first rib|first costal cartilage)$`, BONE),
    },
    {
      key: "co",
      tint: "#c9705f",
      latin: "M. sternocleidomastoideus · M. subclavius · M. pectoralis major (pars clavicularis)",
      name: { vi: "Cơ bám quanh khớp", en: "Muscles around the joint", zh: "关节周围肌" },
      note: {
        vi: "Đầu ức và đầu đòn của cơ ức–đòn–chũm bám ngay trên khớp. Cơ dưới đòn giữ xương đòn áp vào khớp. Phần đòn cơ ngực lớn bám nửa trong xương đòn.",
        en: "The sternal and clavicular heads of sternocleidomastoid attach right above the joint. Subclavius holds the clavicle against it. The clavicular part of pectoralis major attaches to the medial half of the clavicle.",
        zh: "胸锁乳突肌胸骨头和锁骨头附于关节正上方；锁骨下肌将锁骨压向关节；胸大肌锁骨部附于锁骨内侧半。",
      },
      ids: R(`^${SIDE}(sternocleidomastoid|subclavius)$|^clavicular part of ${SIDE}pectoralis major$`, MU),
    },
    {
      key: "mach",
      tint: DEOXY,
      latin: "Vv. brachiocephalicae · V. cava superior",
      name: { vi: "Tĩnh mạch cánh tay–đầu (ngay sau khớp)", en: "Brachiocephalic veins (just behind the joint)", zh: "头臂静脉（关节正后方）" },
      note: {
        vi: "Tĩnh mạch cánh tay–đầu mỗi bên hình thành ngay sau khớp, do tĩnh mạch cảnh trong hợp với dưới đòn.",
        en: "Each brachiocephalic vein forms just behind the joint, where the internal jugular meets the subclavian.",
        zh: "每侧头臂静脉在关节正后方由颈内静脉与锁骨下静脉汇合而成。",
      },
      ids: R(`^${SIDE}(brachiocephalic|subclavian|internal jugular) vein$|^superior vena cava$`, VEN),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "Truncus brachiocephalicus · Aa. carotis communis, subclavia",
      name: { vi: "Thân cánh tay–đầu, cảnh chung, dưới đòn", en: "Brachiocephalic trunk, common carotid, subclavian", zh: "头臂干、颈总动脉、锁骨下动脉" },
      note: {
        vi: "Thân cánh tay–đầu chia đôi ngay sau khớp ức–đòn phải.",
        en: "The brachiocephalic trunk divides just behind the right sternoclavicular joint.",
        zh: "头臂干在右胸锁关节正后方分叉。",
      },
      ids: R(`^brachiocephalic artery$|^arch of aorta$|^${SIDE}(common carotid|subclavian) artery$`, ART),
    },
    {
      key: "khi-quan",
      tint: "#6fae9f",
      latin: "Trachea",
      name: { vi: "Khí quản", en: "Trachea", zh: "气管" },
      note: {
        vi: "Nằm giữa hai khớp, sau cán ức.",
        en: "Lies between the two joints, behind the manubrium.",
        zh: "位于两关节之间、胸骨柄后方。",
      },
      ids: R(`^trachea$`, ["respiratory"]),
    },
  ],
});

// ───────────────────────── 9. Cột sống ngực ─────────────────────────
emit({
  file: "thoracic-spine",
  script: "batch-e",
  exportName: "thoracicSpineScene",
  header: 'Scene "Cột sống ngực" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu tuỷ sống, dây chằng dọc và dây chằng vàng. Thiếu đĩa T12.',
  scene: {
    slug: "cot-song-nguc",
    title: { vi: "Cột sống ngực", en: "The Thoracic Spine", zh: "胸椎" },
    latin: "Vertebrae thoracicae",
    intro: {
      vi: "Mười hai đốt sống ngực có đặc điểm riêng là có diện khớp với xương sườn: ở thân đốt (khớp chỏm sườn) và ở mỏm ngang (khớp sườn–mỏm ngang). Đoạn ngực cong lồi ra sau (gù sinh lý). Nhờ gắn với lồng ngực, đoạn này ít cử động nhất cột sống nhưng vững nhất. Chỗ nối ngực–thắt lưng (T11–L2) chuyển từ đoạn cứng sang đoạn động nên hay gãy nhất trong chấn thương. Scene chia ba đoạn trên, giữa, dưới mỗi đoạn một màu. Đĩa gian đốt màu xanh; xương sườn và động mạch chủ ngực mờ sẵn.",
      en: "The twelve thoracic vertebrae are distinguished by facets for the ribs, on the bodies (costovertebral joints) and on the transverse processes (costotransverse joints). The thoracic spine curves backward (physiological kyphosis). Tied to the rib cage, it is the least mobile but most stable part of the spine. The thoracolumbar junction (T11–L2), where the stiff segment meets the mobile one, is the commonest site of spinal fracture. The scene divides upper, middle and lower thirds, each with its own colour. Discs are blue; ribs and the thoracic aorta are faded.",
      zh: "十二块胸椎的特点是有与肋相关节的关节面：椎体上（肋头关节）和横突上（肋横突关节）。胸段向后凸（生理性后凸）。因与胸廓相连，是脊柱中活动最少但最稳定的部分。胸腰交界（T11–L2）由僵硬段过渡为活动段，是脊柱骨折最常见部位。本场景分上、中、下三段，各一种颜色；椎间盘蓝色；肋骨和胸主动脉淡化。",
    },
  },
  faded: ["suon", "mach"],
  frame: ["tren", "giua", "duoi", "dia"],
  groups: [
    {
      key: "tren",
      tint: "#e6d7b0",
      latin: "Vertebrae T1–T4",
      name: { vi: "Đoạn trên T1–T4", en: "Upper segment T1–T4", zh: "上段T1–T4" },
      note: {
        vi: "T1 giống đốt cổ, có diện khớp chỏm sườn I nguyên vẹn. Gai T1 và gai C7 là hai gai nổi rõ nhất ở gốc cổ.",
        en: "T1 resembles a cervical vertebra and carries a whole facet for rib 1. The spines of C7 and T1 are the most prominent at the base of the neck.",
        zh: "T1似颈椎，有完整的第1肋头关节面。C7和T1棘突是颈根部最突出的两个棘突。",
      },
      ids: R(`^(first|second|third|fourth) thoracic vertebra$`, BONE),
    },
    {
      key: "giua",
      tint: "#d9cfb8",
      latin: "Vertebrae T5–T8",
      name: { vi: "Đoạn giữa T5–T8 (đốt ngực điển hình)", en: "Middle segment T5–T8 (typical thoracic)", zh: "中段T5–T8（典型胸椎）" },
      note: {
        vi: "Thân hình tim, gai dài chúc xuống chồng lên nhau như ngói. Lỗ đốt sống tròn và nhỏ, nên tuỷ ngực dễ tổn thương khi trật đốt.",
        en: "Heart-shaped bodies and long spines sloping down and overlapping like roof tiles. The vertebral foramen is small and round, so the thoracic cord is easily injured in dislocation.",
        zh: "椎体呈心形，棘突长而下斜，如瓦片重叠。椎孔小而圆，脱位时胸髓易受损。",
      },
      ids: R(`^(fifth|sixth|seventh|eighth) thoracic vertebra$`, BONE),
    },
    {
      key: "duoi",
      tint: "#c9b98f",
      latin: "Vertebrae T9–T12",
      name: { vi: "Đoạn dưới T9–T12 (chuyển tiếp)", en: "Lower segment T9–T12 (transitional)", zh: "下段T9–T12（过渡段）" },
      note: {
        vi: "T11–T12 chỉ có diện khớp chỏm sườn nguyên, không có diện khớp mỏm ngang. Diện khớp dưới T12 quay ra ngoài như đốt thắt lưng.",
        en: "T11–T12 have whole rib-head facets and no transverse-process facets. T12's lower articular facets face laterally like a lumbar vertebra.",
        zh: "T11–T12仅有完整肋头关节面，无横突肋凹。T12下关节突朝外，同腰椎。",
      },
      ids: R(`^(ninth|tenth|eleventh|twelfth) thoracic vertebra$`, BONE),
    },
    {
      key: "dia",
      tint: "#8fc1e3",
      latin: "Disci intervertebrales thoracici",
      name: { vi: "Đĩa gian đốt ngực", en: "Thoracic intervertebral discs", zh: "胸椎间盘" },
      note: {
        vi: "Mỏng nhất cột sống. Thoát vị đĩa ngực hiếm vì lồng ngực hạn chế cử động.",
        en: "The thinnest in the spine; thoracic disc herniation is rare because the rib cage limits movement.",
        zh: "脊柱中最薄的椎间盘；因胸廓限制活动，胸椎间盘突出少见。",
      },
      ids: R(`^intervertebral disk of (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh) thoracic vertebra$`, BONE),
    },
    {
      key: "suon",
      latin: "Costae",
      name: { vi: "Xương sườn (mốc)", en: "Ribs (landmarks)", zh: "肋骨（标志）" },
      note: {
        vi: "Mờ sẵn — thấy chỗ khớp với thân và mỏm ngang.",
        en: "Faded — showing where they meet the bodies and transverse processes.",
        zh: "淡化——显示与椎体和横突的关节处。",
      },
      ids: RIBS(),
    },
    {
      key: "mach",
      tint: "#d99a8f",
      latin: "Aorta thoracica · V. azygos",
      name: { vi: "Động mạch chủ ngực và tĩnh mạch đơn (liên quan)", en: "Thoracic aorta and azygos vein (relations)", zh: "胸主动脉与奇静脉（毗邻）" },
      note: {
        vi: "Động mạch chủ đi bên trái thân đốt, tĩnh mạch đơn bên phải.",
        en: "The aorta runs left of the vertebral bodies, the azygos vein to the right.",
        zh: "主动脉行于椎体左侧，奇静脉行于右侧。",
      },
      ids: R(`^descending thoracic aorta$`, ART).concat(R(`^azygos vein$`, VEN)),
    },
  ],
});

// ─────────────── 10. Thân tạng và các nhánh (đổi chủ đề) ───────────────
emit({
  file: "celiac",
  script: "batch-e",
  exportName: "celiacScene",
  header: 'Scene "Thân tạng" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Cân ngực–thắt lưng" cũ: atlas không có cân ngực–thắt lưng, cơ vuông thắt lưng, cơ lưng rộng.',
  scene: {
    slug: "can-nguc-that-lung",
    system: "cardiovascular",
    title: { vi: "Thân tạng và các nhánh", en: "The Coeliac Trunk and its Branches", zh: "腹腔干及其分支" },
    latin: "Truncus coeliacus",
    intro: {
      vi: "Thân tạng là nhánh trước đầu tiên của động mạch chủ bụng, tách ngang T12 ngay dưới lỗ động mạch chủ của cơ hoành. Nó chỉ dài khoảng 1–2cm rồi chia ba: động mạch vị trái, lách và gan chung. Ba nhánh này nuôi toàn bộ ruột trước: thực quản bụng, dạ dày, tá tràng nửa trên, gan, túi mật, tuỵ và lách. Động mạch gan chung cho động mạch vị–tá tràng rồi thành động mạch gan riêng. Loét mặt sau hành tá tràng có thể ăn thủng động mạch vị–tá tràng gây xuất huyết tiêu hoá nặng. Mỗi nhánh một sắc đỏ; tạng mờ sẵn.",
      en: "The coeliac trunk is the first anterior branch of the abdominal aorta, arising at T12 just below the aortic hiatus of the diaphragm. It runs only 1–2cm before dividing in three: the left gastric, splenic and common hepatic arteries. These supply the whole foregut: abdominal oesophagus, stomach, upper duodenum, liver, gallbladder, pancreas and spleen. The common hepatic gives the gastroduodenal artery and continues as the hepatic artery proper. A posterior duodenal ulcer can erode the gastroduodenal artery and cause major gastrointestinal bleeding. Each branch has its own shade of red; the organs are faded.",
      zh: "腹腔干是腹主动脉的第一条前支，在T12平面膈主动脉裂孔稍下方发出，仅长1–2cm即分为三支：胃左动脉、脾动脉和肝总动脉，供应整个前肠：腹段食管、胃、十二指肠上半、肝、胆囊、胰和脾。肝总动脉发出胃十二指肠动脉后续为肝固有动脉。十二指肠球后壁溃疡可侵蚀胃十二指肠动脉，致大量消化道出血。每支一种红色调；脏器淡化。",
    },
  },
  faded: ["tang"],
  frame: ["than", "vi-trai", "lach", "gan"],
  groups: [
    {
      key: "than",
      tint: "#8f2d2d",
      latin: "Aorta abdominalis · Truncus coeliacus",
      name: { vi: "Động mạch chủ bụng và thân tạng", en: "Abdominal aorta and coeliac trunk", zh: "腹主动脉与腹腔干" },
      note: {
        vi: "Dây chằng cung giữa của cơ hoành có thể đè vào gốc thân tạng, gây đau bụng sau ăn (hội chứng dây chằng cung giữa).",
        en: "The median arcuate ligament of the diaphragm can compress the origin of the trunk and cause pain after eating (median arcuate ligament syndrome).",
        zh: "膈正中弓状韧带可压迫腹腔干起始部，引起餐后腹痛（正中弓状韧带综合征）。",
      },
      ids: R(`^(celiac trunk|celiac artery|abdominal aorta)$`, ART),
    },
    {
      key: "vi-trai",
      tint: OXY,
      latin: "A. gastrica sinistra et dextra",
      name: { vi: "Động mạch vị (trái và phải)", en: "Gastric arteries (left and right)", zh: "胃左、右动脉" },
      note: {
        vi: "Động mạch vị trái đi dọc bờ cong nhỏ, cho nhánh thực quản. Nó nối với động mạch vị phải (từ động mạch gan) thành cung bờ cong nhỏ.",
        en: "The left gastric runs along the lesser curvature and gives oesophageal branches. It joins the right gastric (from the hepatic) to form the lesser-curvature arcade.",
        zh: "胃左动脉沿胃小弯走行并发出食管支，与胃右动脉（来自肝动脉）吻合成胃小弯动脉弓。",
      },
      // Neo đầu: "gastric artery$" trần bắt nhầm "superior epigastric artery" (bẫy #6).
      ids: R(`^${SIDE}gastric artery$`, ART),
    },
    {
      key: "lach",
      tint: "#e8883d",
      latin: "A. splenica · Aa. pancreaticae · A. gastroomentalis sinistra",
      name: { vi: "Động mạch lách và nhánh tuỵ", en: "Splenic artery and pancreatic branches", zh: "脾动脉及胰支" },
      note: {
        vi: "Nhánh to nhất, chạy ngoằn ngoèo dọc bờ trên tuỵ, cho động mạch tuỵ lưng, tuỵ lớn, đuôi tuỵ và vị–mạc nối trái.",
        en: "The largest branch, tortuous along the upper border of the pancreas, giving the dorsal, great and caudal pancreatic arteries and the left gastro-omental artery.",
        zh: "最大分支，沿胰上缘迂曲走行，发出胰背动脉、胰大动脉、胰尾动脉和胃网膜左动脉。",
      },
      ids: R(`^splenic artery$|^(dorsal|great|caudal|inferior) pancreatic artery$`, ART),
    },
    {
      key: "gan",
      tint: "#e6c14a",
      latin: "A. hepatica communis → A. hepatica propria · A. gastroduodenalis",
      name: { vi: "Động mạch gan chung, gan riêng, vị–tá tràng", en: "Common hepatic, hepatic proper and gastroduodenal arteries", zh: "肝总动脉、肝固有动脉、胃十二指肠动脉" },
      note: {
        vi: "Động mạch gan riêng đi trong dây chằng gan–tá tràng cùng ống mật chủ và tĩnh mạch cửa. Kẹp dây chằng này (thủ thuật Pringle) cầm máu tạm khi mổ gan.",
        en: "The hepatic artery proper runs in the hepatoduodenal ligament with the bile duct and portal vein; clamping the ligament (Pringle manoeuvre) controls bleeding during liver surgery.",
        zh: "肝固有动脉与胆总管、门静脉同行于肝十二指肠韧带内；阻断该韧带（Pringle法）可在肝手术中暂时止血。",
      },
      ids: R(`^(common hepatic artery|hepatic artery proper|trunk of gastroduodenal artery)$|gastro-epiploic artery$|pancreaticoduodenal artery$`, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. splenica · Vv. gastricae",
      name: { vi: "Tĩnh mạch lách và vị", en: "Splenic and gastric veins", zh: "脾静脉与胃静脉" },
      note: {
        vi: "Tĩnh mạch lách hợp với tĩnh mạch mạc treo tràng trên sau cổ tuỵ thành tĩnh mạch cửa. Tĩnh mạch vị trái nối với tĩnh mạch thực quản; khi tăng áp cửa, chỗ nối này thành giãn tĩnh mạch thực quản.",
        en: "The splenic vein joins the superior mesenteric behind the pancreatic neck to form the portal vein. The left gastric vein connects with oesophageal veins; in portal hypertension this becomes oesophageal varices.",
        zh: "脾静脉在胰颈后方与肠系膜上静脉汇合成门静脉。胃左静脉与食管静脉相通，门静脉高压时形成食管静脉曲张。",
      },
      ids: R(`^splenic vein$|^${SIDE}gastric vein$|^${SIDE}gastroepiploic vein$`, VEN),
    },
    {
      key: "tang",
      latin: "Gaster · Lien · Pancreas · Duodenum",
      name: { vi: "Dạ dày, lách, tuỵ, tá tràng (mốc)", en: "Stomach, spleen, pancreas, duodenum (landmarks)", zh: "胃、脾、胰、十二指肠（标志）" },
      note: {
        vi: "Mờ sẵn — vùng nuôi của ruột trước.",
        en: "Faded — the foregut territory.",
        zh: "淡化——前肠供血区。",
      },
      ids: R(`^(stomach|spleen|pancreas|duodenum)$`),
    },
  ],
});

// ─────────────── 11. Đại tràng, mạc treo và mạch (đổi chủ đề) ───────────────
emit({
  file: "colic-vessels",
  script: "batch-e",
  exportName: "colicVesselsScene",
  header: 'Scene "Đại tràng, mạc treo và mạch đại tràng" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Phúc mạc và mạc treo" cũ: atlas chỉ có mạc treo đại tràng ngang và mạc treo ruột thừa, không có phúc mạc thành, mạc nối.',
  scene: {
    slug: "phuc-mac-mac-treo",
    system: "digestive",
    title: { vi: "Đại tràng, mạc treo và mạch đại tràng", en: "The Colon, its Mesenteries and Vessels", zh: "结肠、系膜与结肠血管" },
    latin: "Colon · Mesocolon · Aa. colicae",
    intro: {
      vi: "Đại tràng đi thành khung quanh ruột non: manh tràng và ruột thừa, đại tràng lên, ngang, xuống, xích-ma, rồi trực tràng. Đại tràng ngang và xích-ma có mạc treo nên di động. Đại tràng lên và xuống dính vào thành bụng sau. Máu nuôi đến từ hai nguồn. Động mạch mạc treo tràng trên (ruột giữa) cho hồi–đại tràng, đại tràng phải, đại tràng giữa. Động mạch mạc treo tràng dưới (ruột sau) cho đại tràng trái, xích-ma, trực tràng trên. Các nhánh nối nhau dọc bờ mạc treo thành động mạch bờ. Điểm nối yếu ở góc lách dễ thiếu máu khi tụt huyết áp. Ruột mờ sẵn; mạch đỏ–xanh.",
      en: "The colon frames the small intestine: caecum and appendix, ascending, transverse, descending and sigmoid colon, then rectum. The transverse and sigmoid colon have mesenteries and are mobile. The ascending and descending colon are fixed to the posterior wall. Blood comes from two sources. The superior mesenteric (midgut) gives the ileocolic, right colic and middle colic arteries. The inferior mesenteric (hindgut) gives the left colic, sigmoid and superior rectal arteries. They link along the mesenteric border as the marginal artery. The weak link at the splenic flexure is prone to ischaemia when blood pressure falls. The bowel is faded; vessels are red and blue.",
      zh: "结肠环绕小肠成框：盲肠和阑尾、升结肠、横结肠、降结肠、乙状结肠，再为直肠。横结肠和乙状结肠有系膜而可移动；升、降结肠固定于腹后壁。血供来自两个来源：肠系膜上动脉（中肠）发出回结肠、右结肠、中结肠动脉；肠系膜下动脉（后肠）发出左结肠、乙状结肠和直肠上动脉。各支沿系膜缘吻合成边缘动脉。结肠脾曲处吻合薄弱，低血压时易缺血。肠管淡化；血管红蓝。",
    },
  },
  faded: ["ruot"],
  frame: ["tren", "duoi", "bo", "mac-treo"],
  groups: [
    {
      key: "tren",
      tint: OXY,
      latin: "Aa. ileocolica, colica dextra, colica media",
      name: { vi: "Nhánh mạc treo tràng trên: hồi–đại tràng, đại tràng phải, giữa", en: "Superior mesenteric branches: ileocolic, right colic, middle colic", zh: "肠系膜上动脉分支：回结肠、右结肠、中结肠动脉" },
      note: {
        vi: "Động mạch hồi–đại tràng cho động mạch ruột thừa đi trong mạc treo ruột thừa. Thắt nó là bước chính khi cắt ruột thừa.",
        en: "The ileocolic gives the appendicular artery in the mesoappendix; ligating it is the key step of appendicectomy.",
        zh: "回结肠动脉发出行于阑尾系膜内的阑尾动脉，结扎之是阑尾切除术的关键步骤。",
      },
      ids: R(`ileocolic artery$|^${SIDE}colic artery$|^middle colic artery$|branch of (inferior branch of )?(ileocolic|colic) artery$`, ART),
    },
    {
      key: "duoi",
      tint: "#e8883d",
      latin: "Aa. sigmoideae · A. rectalis superior",
      name: { vi: "Nhánh mạc treo tràng dưới: xích-ma, trực tràng trên", en: "Inferior mesenteric branches: sigmoid, superior rectal", zh: "肠系膜下动脉分支：乙状结肠、直肠上动脉" },
      note: {
        vi: "Động mạch trực tràng trên là nhánh tận, xuống sau trực tràng. Cắt đại tràng xích-ma phải bảo tồn nó hoặc giữ đủ vòng nối.",
        en: "The superior rectal is the terminal branch, descending behind the rectum; sigmoid resections must preserve it or keep enough collateral flow.",
        zh: "直肠上动脉为终支，行于直肠后方；乙状结肠切除时须保留之或保证足够侧支。",
      },
      ids: R(`^sigmoid artery$|^superior rectal artery$`, ART),
    },
    {
      key: "bo",
      tint: "#e39a7a",
      latin: "A. marginalis coli",
      name: { vi: "Động mạch bờ (Drummond)", en: "Marginal artery (of Drummond)", zh: "边缘动脉（Drummond动脉）" },
      note: {
        vi: "Chạy liên tục dọc bờ trong đại tràng, nối hệ trên và dưới. Nó cho các mạch thẳng đi vào thành ruột.",
        en: "Runs continuously along the inner border of the colon, linking the two systems and giving the vasa recta into the wall.",
        zh: "沿结肠内缘连续走行，连接上下两系，发出直小血管入肠壁。",
      },
      ids: R(`marginal (colic artery|artery of colon)$`, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. colicae · V. rectalis superior",
      name: { vi: "Tĩnh mạch đại tràng", en: "Colic veins", zh: "结肠静脉" },
      note: {
        vi: "Đi kèm động mạch, đổ về hệ cửa. Ung thư đại tràng di căn gan theo đường này.",
        en: "Accompany the arteries into the portal system — the route by which colon cancer spreads to the liver.",
        zh: "伴行动脉汇入门静脉系统，结肠癌经此途径转移至肝。",
      },
      ids: R(`colic vein$|^ileocolic vein$|^sigmoid vein$|^superior rectal vein$`, VEN),
    },
    {
      key: "mac-treo",
      tint: "#f0e3b0",
      latin: "Mesocolon transversum · Mesoappendix · Taenia coli",
      name: { vi: "Mạc treo đại tràng ngang, mạc treo ruột thừa, dải cơ dọc", en: "Transverse mesocolon, mesoappendix, taeniae coli", zh: "横结肠系膜、阑尾系膜、结肠带" },
      note: {
        vi: "Mạc treo đại tràng ngang chia ổ bụng thành tầng trên và tầng dưới mạc treo. Ba dải cơ dọc hội tụ ở gốc ruột thừa, là mốc tìm ruột thừa khi mổ.",
        en: "The transverse mesocolon divides the abdomen into supracolic and infracolic compartments. The three taeniae converge at the base of the appendix — the way to find it at surgery.",
        zh: "横结肠系膜将腹腔分为结肠上区和结肠下区。三条结肠带汇聚于阑尾根部，是术中寻找阑尾的标志。",
      },
      ids: R(`^transverse mesocolon$|^mesoappendix$|^taenia`),
    },
    {
      key: "ruot",
      latin: "Caecum · Colon · Rectum",
      name: { vi: "Manh tràng, đại tràng, trực tràng (mốc)", en: "Caecum, colon, rectum (landmarks)", zh: "盲肠、结肠、直肠（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: R(`^(appendix|ascending colon|transverse colon|descending colon|sigmoid colon|rectum|caecum|cecum)$`),
    },
  ],
});

// ─────────────── 12. Tuyến ức và lách (đổi chủ đề) ───────────────
emit({
  file: "lymphoid-organs",
  script: "batch-e",
  exportName: "lymphoidOrgansScene",
  header: 'Scene "Tuyến ức và lách" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Hệ bạch huyết" cũ: atlas không có hạch, mạch bạch huyết, ống ngực.',
  scene: {
    slug: "he-bach-huyet",
    title: { vi: "Cơ quan lympho: tuyến ức và lách", en: "Lymphoid Organs: Thymus and Spleen", zh: "淋巴器官：胸腺与脾" },
    latin: "Organa lymphoidea: thymus, lien",
    intro: {
      vi: "Cơ quan lympho chia hai loại. Cơ quan trung ương (tuỷ xương, tuyến ức) là nơi lympho bào sinh ra và được huấn luyện. Cơ quan ngoại vi (lách, hạch, amidan) là nơi chúng gặp kháng nguyên. Tuyến ức ở trung thất trên huấn luyện lympho T nhận biết “ta” và “lạ”. Nó lớn nhất ở tuổi dậy thì rồi thoái hoá thành mỡ. Lách ở hạ sườn trái, lọc máu và loại hồng cầu già. Người đã cắt lách dễ bị nhiễm khuẩn có vỏ bọc nặng. Bộ dữ liệu không có hạch và mạch bạch huyết, nên scene chỉ dựng hai cơ quan này cùng mạch nuôi.",
      en: "Lymphoid organs are of two kinds. Central organs (bone marrow, thymus) are where lymphocytes are made and trained. Peripheral organs (spleen, nodes, tonsils) are where they meet antigen. The thymus in the superior mediastinum trains T cells to tell self from non-self. It is largest at puberty, then turns to fat. The spleen, under the left ribs, filters blood and removes old red cells. People without a spleen are prone to severe infection by encapsulated bacteria. The dataset has no lymph nodes or lymphatic vessels, so the scene shows only these two organs and their vessels.",
      zh: "淋巴器官分两类：中枢淋巴器官（骨髓、胸腺）是淋巴细胞生成和训练之处；周围淋巴器官（脾、淋巴结、扁桃体）是其接触抗原之处。上纵隔的胸腺训练T细胞识别“自我”与“非我”，青春期最大，此后逐渐脂肪化。脾位于左季肋区，滤血并清除衰老红细胞；脾切除者易发生荚膜菌重症感染。数据集中无淋巴结和淋巴管，故仅显示这两个器官及其血管。",
    },
  },
  faded: ["moc"],
  frame: ["uc", "lach"],
  groups: [
    {
      key: "uc",
      tint: "#8fb0c8",
      latin: "Thymus (lobus dexter et sinister)",
      name: { vi: "Tuyến ức (hai thuỳ)", en: "Thymus (two lobes)", zh: "胸腺（左右叶）" },
      note: {
        vi: "Nằm sau cán ức, trước các mạch lớn. Ở trẻ nhỏ nó to, có thể thấy trên phim X quang như cánh buồm. Không có tuyến ức bẩm sinh (hội chứng DiGeorge) gây suy giảm miễn dịch tế bào.",
        en: "Lies behind the manubrium in front of the great vessels. In infants it is large and can look like a sail on X-ray. Its congenital absence (DiGeorge syndrome) causes cellular immunodeficiency.",
        zh: "位于胸骨柄后、大血管前。婴幼儿胸腺大，X线上可呈帆状。先天缺如（DiGeorge综合征）致细胞免疫缺陷。",
      },
      ids: R(`lobe of thymus$`),
    },
    {
      key: "lach",
      tint: "#8f5a8a",
      latin: "Lien (splen)",
      name: { vi: "Lách", en: "Spleen", zh: "脾" },
      note: {
        vi: "Nằm dọc sườn IX–XI bên trái, bình thường không sờ thấy. Là tạng hay vỡ nhất trong chấn thương bụng kín.",
        en: "Lies along ribs 9–11 on the left and is normally not palpable. It is the organ most often ruptured in blunt abdominal trauma.",
        zh: "沿左侧第9–11肋分布，正常时不能触及。是闭合性腹部外伤中最常破裂的脏器。",
      },
      ids: R(`^spleen$`),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "A. splenica · A. thoracica interna",
      name: { vi: "Động mạch lách và ngực trong", en: "Splenic and internal thoracic arteries", zh: "脾动脉与胸廓内动脉" },
      note: {
        vi: "Tuyến ức được nuôi chủ yếu bởi nhánh của động mạch ngực trong. Lách được nuôi bởi động mạch lách, chia 5–6 nhánh vào rốn lách; các nhánh là động mạch tận nên lách hay nhồi máu hình chêm.",
        en: "The thymus is fed mainly by branches of the internal thoracic. The spleen is fed by the splenic artery, which splits into 5–6 end branches at the hilum, so splenic infarcts are wedge-shaped.",
        zh: "胸腺主要由胸廓内动脉分支供血。脾由脾动脉供血，在脾门分为5–6条终支，故脾梗死呈楔形。",
      },
      ids: R(`^splenic artery$|^${SIDE}internal thoracic artery$`, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. splenica · Vv. brachiocephalicae",
      name: { vi: "Tĩnh mạch lách và cánh tay–đầu", en: "Splenic and brachiocephalic veins", zh: "脾静脉与头臂静脉" },
      note: {
        vi: "Tĩnh mạch tuyến ức đổ vào tĩnh mạch cánh tay–đầu trái. Tĩnh mạch lách đổ về hệ cửa; tăng áp cửa làm lách to.",
        en: "Thymic veins drain to the left brachiocephalic vein. The splenic vein drains to the portal system, so portal hypertension enlarges the spleen.",
        zh: "胸腺静脉汇入左头臂静脉。脾静脉汇入门静脉系统，门静脉高压致脾大。",
      },
      ids: R(`^splenic vein$|^${SIDE}brachiocephalic vein$`, VEN),
    },
    {
      key: "moc",
      latin: "Sternum · Costae · Gaster · Pancreas",
      name: { vi: "Xương ức, sườn, dạ dày, tuỵ (mốc)", en: "Sternum, ribs, stomach, pancreas (landmarks)", zh: "胸骨、肋骨、胃、胰（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: STERNUM().concat(R(`^(stomach|pancreas)$`), R(`^left (ninth|tenth|eleventh) rib$`, BONE)),
    },
  ],
});

// ─────────── 13. Hệ tĩnh mạch đơn và mạch gian sườn (đổi chủ đề) ───────────
emit({
  file: "azygos",
  script: "batch-e",
  exportName: "azygosScene",
  header: 'Scene "Hệ tĩnh mạch đơn và mạch gian sườn" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Thần kinh tự chủ" cũ: atlas không có thân giao cảm, dây X, đám rối tạng.',
  scene: {
    slug: "than-kinh-tu-chu",
    system: "cardiovascular",
    title: { vi: "Hệ tĩnh mạch đơn và mạch gian sườn", en: "The Azygos System and Intercostal Vessels", zh: "奇静脉系与肋间血管" },
    latin: "Systema azygos · Vasa intercostalia",
    intro: {
      vi: "Thành ngực được nuôi theo từng khoang gian sườn. Động mạch gian sườn sau từ động mạch chủ ngực, động mạch gian sườn trước từ động mạch ngực trong; hai nguồn nối nhau trong mỗi khoang. Máu tĩnh mạch về hệ tĩnh mạch đơn. Bên phải, tĩnh mạch đơn chạy dọc thân đốt, vòng qua cuống phổi phải rồi đổ vào tĩnh mạch chủ trên. Bên trái có tĩnh mạch bán đơn và bán đơn phụ, băng qua đường giữa đổ vào tĩnh mạch đơn. Khi tĩnh mạch chủ dưới bị tắc, hệ đơn là đường vòng đưa máu từ nửa dưới cơ thể về tim. Động mạch đỏ, tĩnh mạch xanh; lồng ngực mờ sẵn.",
      en: "The chest wall is supplied space by space. Posterior intercostal arteries come from the thoracic aorta, anterior intercostals from the internal thoracic, and the two meet in each space. Venous blood returns through the azygos system. On the right, the azygos vein runs up the vertebral bodies, arches over the right lung root and enters the superior vena cava. On the left, the hemiazygos and accessory hemiazygos cross the midline to join the azygos. If the inferior vena cava is blocked, the azygos system is the bypass that returns blood from the lower body to the heart. Arteries red, veins blue; the rib cage is faded.",
      zh: "胸壁按肋间隙分段供血：肋间后动脉来自胸主动脉，肋间前动脉来自胸廓内动脉，二者在各肋间隙吻合。静脉血经奇静脉系回流：右侧奇静脉沿椎体上行，绕右肺根上方注入上腔静脉；左侧半奇静脉和副半奇静脉越过中线汇入奇静脉。下腔静脉阻塞时，奇静脉系是下半身血液回心的侧支通路。动脉红，静脉蓝；胸廓淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["don", "ban-don", "gs-sau", "nguc-trong"],
  groups: [
    {
      key: "don",
      tint: "#34597a",
      latin: "V. azygos · V. cava superior",
      name: { vi: "Tĩnh mạch đơn và tĩnh mạch chủ trên", en: "Azygos vein and superior vena cava", zh: "奇静脉与上腔静脉" },
      note: {
        vi: "Cung tĩnh mạch đơn vắt qua cuống phổi phải ngang T4. Trên phim X quang, nó là bóng tròn nhỏ ở góc khí–phế quản phải.",
        en: "The azygos arch hooks over the right lung root at T4; on X-ray it is the small round shadow in the right tracheobronchial angle.",
        zh: "奇静脉弓在T4平面跨越右肺根上方，X线上为右气管支气管角处的小圆形影。",
      },
      ids: R(`^azygos vein$|^superior vena cava$`, VEN),
    },
    {
      key: "ban-don",
      tint: DEOXY,
      latin: "V. hemiazygos · V. hemiazygos accessoria",
      name: { vi: "Tĩnh mạch bán đơn và bán đơn phụ", en: "Hemiazygos and accessory hemiazygos veins", zh: "半奇静脉与副半奇静脉" },
      note: {
        vi: "Bán đơn nhận các khoang gian sườn dưới trái, bán đơn phụ nhận các khoang giữa trái. Cả hai băng sau động mạch chủ, đổ vào tĩnh mạch đơn.",
        en: "The hemiazygos drains the lower left spaces and the accessory hemiazygos the middle left spaces; both cross behind the aorta to the azygos.",
        zh: "半奇静脉收集左下部肋间隙，副半奇静脉收集左中部肋间隙，二者均经主动脉后方汇入奇静脉。",
      },
      ids: R(`hemiazygos vein$`, VEN),
    },
    {
      key: "tm-gian-suon",
      tint: "#6f93b8",
      latin: "Vv. intercostales · V. subcostalis",
      name: { vi: "Tĩnh mạch gian sườn và dưới sườn", en: "Intercostal and subcostal veins", zh: "肋间静脉与肋下静脉" },
      note: {
        vi: "Tĩnh mạch gian sườn trên (khoang 2–3) đổ vào tĩnh mạch đơn bên phải và cánh tay–đầu bên trái.",
        en: "The superior intercostal vein (spaces 2–3) drains to the azygos on the right and the brachiocephalic on the left.",
        zh: "肋间最上静脉（第2–3间隙）右侧汇入奇静脉，左侧汇入头臂静脉。",
      },
      ids: R(`intercostal vein|^${SIDE}subcostal vein$`, VEN),
    },
    {
      key: "gs-sau",
      tint: OXY,
      latin: "Aorta thoracica · Aa. intercostales posteriores · A. subcostalis",
      name: { vi: "Động mạch chủ ngực và gian sườn sau", en: "Thoracic aorta and posterior intercostal arteries", zh: "胸主动脉与肋间后动脉" },
      note: {
        vi: "Chín đôi gian sườn sau (khoang 3–11) và một đôi dưới sườn tách từ động mạch chủ ngực. Hai khoang đầu nhận từ thân sườn–cổ.",
        en: "Nine pairs of posterior intercostals (spaces 3–11) and one subcostal pair arise from the thoracic aorta; the first two spaces are fed from the costocervical trunk.",
        zh: "9对肋间后动脉（第3–11间隙）和1对肋下动脉发自胸主动脉；第1–2间隙由肋颈干供应。",
      },
      ids: R(`^descending thoracic aorta$|intercostal arter(y|ies)$|^${SIDE}subcostal artery$`, ART),
    },
    {
      key: "nguc-trong",
      tint: "#e8883d",
      latin: "Vasa thoracica interna · Aa. musculophrenica, epigastrica superior",
      name: { vi: "Động–tĩnh mạch ngực trong và nhánh tận", en: "Internal thoracic vessels and terminal branches", zh: "胸廓内动静脉及其终支" },
      note: {
        vi: "Chạy dọc hai bờ xương ức, cách bờ khoảng 1cm. Ở khoang VI chia thành nhánh cơ–hoành và thượng vị trên.",
        en: "Run beside the sternum about 1cm from its edge and divide at the sixth space into musculophrenic and superior epigastric branches.",
        zh: "沿胸骨两侧缘约1cm下行，在第6肋间隙分为肌膈支和腹壁上支。",
      },
      ids: R(`^${SIDE}(internal thoracic|musculophrenic|superior epigastric) (artery|vein)$|anterior intercostal veins$`, ["arterial", "venous"]),
    },
    {
      key: "xuong",
      latin: "Costae · Vertebrae thoracicae · Sternum",
      name: { vi: "Lồng ngực (mốc)", en: "Rib cage (landmark)", zh: "胸廓（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: RIBS().concat(TVERT(), STERNUM()),
    },
  ],
});

// ─────────────── 14. Cơ vùng ngực (đổi chủ đề) ───────────────
emit({
  file: "pectoral-region",
  script: "batch-e",
  exportName: "pectoralRegionScene",
  header: 'Scene "Cơ vùng ngực" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Vùng ngực và tuyến vú" cũ: atlas không có tuyến vú và hạch nách.',
  scene: {
    slug: "vung-nguc-tuyen-vu",
    system: "muscular",
    title: { vi: "Cơ vùng ngực và mạch nuôi", en: "Muscles of the Pectoral Region", zh: "胸前区肌与血管" },
    latin: "Regio pectoralis",
    intro: {
      vi: "Vùng ngực có bốn cơ nối chi trên với thành ngực. Cơ ngực lớn hình quạt, gồm phần đòn, phần ức–sườn và phần bụng. Cơ ngực bé nằm dưới nó, là mốc chia động mạch nách. Cơ dưới đòn nhỏ, nằm dưới xương đòn. Cơ răng trước ôm thành ngực bên. Tuyến vú (không có trong bộ dữ liệu) nằm trên mạc cơ ngực lớn; ung thư xâm lấn cơ này làm khối u dính, không di động được. Mạch nuôi chính là nhánh ngực của động mạch ngực–cùng vai và động mạch ngực ngoài. Mỗi cơ một màu; lồng ngực mờ sẵn.",
      en: "The pectoral region has four muscles linking the upper limb to the chest wall. Pectoralis major is fan-shaped, with clavicular, sternocostal and abdominal parts. Pectoralis minor lies beneath it and marks the parts of the axillary artery. The small subclavius lies under the clavicle. Serratus anterior wraps the lateral chest wall. The breast (not in the dataset) sits on the fascia of pectoralis major; cancer invading the muscle makes the lump fixed. The main supply is the pectoral branch of the thoraco-acromial artery and the lateral thoracic artery. Each muscle has its own colour; the rib cage is faded.",
      zh: "胸前区有四块连接上肢与胸壁的肌：胸大肌呈扇形，分锁骨部、胸肋部和腹部；胸小肌位于其深面，是腋动脉分段标志；锁骨下肌小，位于锁骨下方；前锯肌包绕胸外侧壁。乳腺（数据集中无）位于胸大肌筋膜上；乳腺癌侵及此肌时肿块固定不动。主要血供为胸肩峰动脉胸肌支和胸外侧动脉。每肌一种颜色；胸廓淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["nguc-lon", "nguc-be", "rang-truoc"],
  groups: [
    {
      key: "nguc-lon",
      tint: "#c9705f",
      latin: "M. pectoralis major (partes clavicularis, sternocostalis, abdominalis)",
      name: { vi: "Cơ ngực lớn (ba phần)", en: "Pectoralis major (three parts)", zh: "胸大肌（三部）" },
      note: {
        vi: "Khép và xoay trong cánh tay. Phần đòn gấp vai; phần ức–sườn duỗi cánh tay đang gấp. Bờ dưới tạo nếp nách trước.",
        en: "Adducts and medially rotates the arm. The clavicular part flexes the shoulder; the sternocostal part extends the flexed arm. Its lower edge forms the anterior axillary fold.",
        zh: "内收并内旋上臂。锁骨部屈肩；胸肋部使已屈的上臂伸展。下缘构成腋前襞。",
      },
      ids: R(`part of ${SIDE}pectoralis major$`, ["muscular"]),
    },
    {
      key: "nguc-be",
      tint: "#e8883d",
      latin: "M. pectoralis minor",
      name: { vi: "Cơ ngực bé", en: "Pectoralis minor", zh: "胸小肌" },
      note: {
        vi: "Từ xương sườn III–V tới mỏm quạ. Ba mức hạch nách trong ung thư vú được xác định theo cơ này: dưới, sau và trên cơ ngực bé.",
        en: "From ribs 3–5 to the coracoid. The three levels of axillary nodes in breast cancer are defined by it: below, behind and above pectoralis minor.",
        zh: "自第3–5肋至喙突。乳腺癌腋窝淋巴结三个水平以此肌划分：胸小肌下缘以下、后方和上缘以上。",
      },
      ids: R(`^${SIDE}pectoralis minor$`, ["muscular"]),
    },
    {
      key: "duoi-don",
      tint: "#e6c14a",
      latin: "M. subclavius",
      name: { vi: "Cơ dưới đòn", en: "Subclavius", zh: "锁骨下肌" },
      note: {
        vi: "Như đệm giữa xương đòn gãy và bó mạch dưới đòn phía dưới.",
        en: "Acts as a cushion between a broken clavicle and the subclavian vessels beneath.",
        zh: "如垫子般隔开骨折的锁骨与其下方的锁骨下血管。",
      },
      ids: R(`^${SIDE}subclavius$`, ["muscular"]),
    },
    {
      key: "rang-truoc",
      tint: "#e39a7a",
      latin: "M. serratus anterior",
      name: { vi: "Cơ răng trước", en: "Serratus anterior", zh: "前锯肌" },
      note: {
        vi: "Các răng cưa bám tám xương sườn trên. Dây ngực dài chạy trên mặt ngoài cơ, dễ tổn thương khi nạo hạch nách, gây xương vai vểnh.",
        en: "Its serrations grip the upper eight ribs. The long thoracic nerve runs on its surface and is at risk in axillary clearance, causing a winged scapula.",
        zh: "锯齿附于上8肋。胸长神经行于其表面，腋窝清扫时易损伤，致翼状肩胛。",
      },
      ids: R(`^${SIDE}serratus anterior$`, ["muscular"]),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "A. thoracoacromialis · A. thoracica lateralis",
      name: { vi: "Động mạch ngực–cùng vai và ngực ngoài", en: "Thoraco-acromial and lateral thoracic arteries", zh: "胸肩峰动脉与胸外侧动脉" },
      note: {
        vi: "Nhánh ngực của động mạch ngực–cùng vai là cuống mạch của vạt cơ ngực lớn, loại vạt hay dùng trong phẫu thuật tái tạo đầu–cổ.",
        en: "The pectoral branch of the thoraco-acromial artery is the pedicle of the pectoralis major flap, a workhorse in head and neck reconstruction.",
        zh: "胸肩峰动脉胸肌支是胸大肌皮瓣的血管蒂，该皮瓣常用于头颈部重建。",
      },
      ids: R(`thoraco-acromial artery$|^${SIDE}lateral thoracic artery$`, ART),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. thoracica lateralis · V. cephalica",
      name: { vi: "Tĩnh mạch ngực ngoài và tĩnh mạch đầu", en: "Lateral thoracic and cephalic veins", zh: "胸外侧静脉与头静脉" },
      note: {
        vi: "Tĩnh mạch đầu chạy trong rãnh delta–ngực, mốc của đường mổ vào khớp vai phía trước.",
        en: "The cephalic vein runs in the deltopectoral groove, the landmark for the anterior approach to the shoulder.",
        zh: "头静脉行于三角胸肌沟内，是肩关节前入路的标志。",
      },
      ids: betweenY(R(`^${SIDE}(lateral thoracic|cephalic) vein$`, VEN), 1.2, 1.5),
    },
    {
      key: "xuong",
      latin: "Costae · Sternum · Clavicula",
      name: { vi: "Xương sườn, ức, đòn (mốc)", en: "Ribs, sternum, clavicles (landmarks)", zh: "肋骨、胸骨、锁骨（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: RIBS().concat(STERNUM(), CART(), R(`^${SIDE}clavicle$`, BONE)),
    },
  ],
});

// ─────────── 15. Động mạch và tĩnh mạch phổi phân thùy (đổi chủ đề) ───────────
emit({
  file: "pulmonary-segments",
  script: "batch-e",
  exportName: "pulmonarySegmentsScene",
  header: 'Scene "Động mạch và tĩnh mạch phổi phân thùy" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Màng phổi" cũ: atlas không có màng phổi. Màu theo vòng tiểu tuần hoàn: ĐM phổi xanh (máu nghèo oxy), TM phổi đỏ.',
  scene: {
    slug: "mang-phoi",
    system: "respiratory",
    title: { vi: "Động mạch và tĩnh mạch phổi phân thùy", en: "Segmental Pulmonary Arteries and Veins", zh: "肺段动脉与肺段静脉" },
    latin: "Aa. et Vv. segmentales pulmonis",
    intro: {
      vi: "Mỗi phổi chia thành các phân thùy phế quản–phổi, khoảng 10 bên phải và 8–10 bên trái. Mỗi phân thùy có phế quản và động mạch phân thùy riêng đi ở giữa, nên có thể cắt bỏ riêng một phân thùy. Tĩnh mạch lại chạy giữa các phân thùy, làm mốc ranh giới khi mổ. Trong vòng tiểu tuần hoàn, động mạch phổi mang máu nghèo oxy nên tô xanh, tĩnh mạch phổi mang máu giàu oxy nên tô đỏ. Scene chia động mạch theo thuỳ; cây phế quản mờ sẵn làm nền.",
      en: "Each lung divides into bronchopulmonary segments, about 10 on the right and 8–10 on the left. Each segment has its own segmental bronchus and artery running through its centre, so a single segment can be removed. The veins run between segments and mark the boundaries at surgery. In the pulmonary circulation the arteries carry deoxygenated blood and are coloured blue; the veins carry oxygenated blood and are coloured red. The scene groups the arteries by lobe; the bronchial tree is faded as a background.",
      zh: "每侧肺分为若干支气管肺段，右肺约10个，左肺8–10个。每段有自己的段支气管和段动脉行于其中央，故可单独切除一个肺段；静脉行于段间，是术中划分边界的标志。肺循环中肺动脉运送缺氧血，故涂蓝色；肺静脉运送含氧血，涂红色。场景按肺叶分组动脉；支气管树淡化作背景。",
    },
  },
  faded: ["phe-quan"],
  frame: ["than", "tren", "giua", "duoi", "tm"],
  groups: [
    {
      key: "than",
      tint: "#34597a",
      latin: "Truncus pulmonalis · Aa. pulmonales dextra et sinistra",
      name: { vi: "Thân và động mạch phổi phải, trái", en: "Pulmonary trunk and right and left pulmonary arteries", zh: "肺动脉干与左、右肺动脉" },
      note: {
        vi: "Thân động mạch phổi chia đôi dưới cung động mạch chủ. Huyết khối lớn kẹt ở chỗ chia (thuyên tắc hình yên ngựa) có thể gây đột tử.",
        en: "The trunk divides beneath the aortic arch. A large clot lodged at the bifurcation (saddle embolus) can cause sudden death.",
        zh: "肺动脉干在主动脉弓下方分叉。大血栓骑跨于分叉处（骑跨栓）可致猝死。",
      },
      ids: LUNG_Y(R(`^pulmonary trunk$|^${SIDE}pulmonary artery$`, ART)),
    },
    {
      key: "tren",
      tint: DEOXY,
      latin: "Aa. segmentales lobi superioris · Aa. lingulares",
      name: { vi: "Động mạch thuỳ trên và lưỡi", en: "Upper lobe and lingular arteries", zh: "上叶及舌段动脉" },
      note: {
        vi: "Phân thùy đỉnh, sau, trước. Bên trái có thêm hai phân thùy lưỡi (trên, dưới), tương ứng thuỳ giữa phổi phải.",
        en: "Apical, posterior and anterior segments; the left adds the superior and inferior lingular segments, the counterpart of the right middle lobe.",
        zh: "尖段、后段、前段；左肺另有上、下舌段，相当于右肺中叶。",
      },
      ids: LUNG_Y(R(`(apical|posterior|anterior) segmental artery$|lingular artery$|(part|branch) of ${SIDE}(apical|posterior|anterior) segmental artery$`, ART)),
    },
    {
      key: "giua",
      tint: "#6f93b8",
      latin: "Aa. segmentales lobi medii",
      name: { vi: "Động mạch thuỳ giữa (phải)", en: "Middle lobe arteries (right)", zh: "中叶动脉（右）" },
      note: {
        vi: "Hai phân thùy ngoài và trong. Thuỳ giữa hay xẹp do phế quản dài, hẹp, bị hạch đè (hội chứng thuỳ giữa).",
        en: "Lateral and medial segments. The middle lobe often collapses because its long narrow bronchus is compressed by nodes (middle lobe syndrome).",
        zh: "外侧段和内侧段。中叶支气管细长，易受淋巴结压迫而肺不张（中叶综合征）。",
      },
      ids: LUNG_Y(R(`(lateral|medial) segmental artery$|branch of ${SIDE}(lateral|medial) segmental artery$`, ART)),
    },
    {
      key: "duoi",
      tint: "#8fb0c8",
      latin: "Aa. segmentales lobi inferioris",
      name: { vi: "Động mạch thuỳ dưới", en: "Lower lobe arteries", zh: "下叶动脉" },
      note: {
        vi: "Phân thùy trên (đỉnh thuỳ dưới) và bốn phân thùy nền: trong, trước, ngoài, sau. Người nằm ngửa hít sặc thì dịch vào phân thùy trên thuỳ dưới.",
        en: "The superior segment (apex of the lower lobe) and four basal segments: medial, anterior, lateral, posterior. Aspiration when lying supine goes to the superior segment of the lower lobe.",
        zh: "上段（下叶尖）及四个基底段：内、前、外、后。仰卧位误吸时液体进入下叶上段。",
      },
      ids: LUNG_Y(R(`(superior|medial basal|anterior basal|lateral basal|posterior basal) segmental artery$|branch of ${SIDE}superior segmental artery$`, ART)),
    },
    {
      key: "tm",
      tint: OXY,
      latin: "Vv. pulmonales et segmentales",
      name: { vi: "Tĩnh mạch phổi và tĩnh mạch phân thùy", en: "Pulmonary and segmental veins", zh: "肺静脉与肺段静脉" },
      note: {
        vi: "Bốn tĩnh mạch phổi (hai trên, hai dưới) đổ vào nhĩ trái. Sóng điện bất thường từ lỗ tĩnh mạch phổi khởi phát rung nhĩ; triệt đốt quanh lỗ này là cách điều trị.",
        en: "Four pulmonary veins (two superior, two inferior) enter the left atrium. Stray impulses from the vein openings trigger atrial fibrillation, treated by ablation around them.",
        zh: "四条肺静脉（上、下各二）汇入左心房。肺静脉口的异常电冲动可触发心房颤动，治疗方法为环肺静脉消融。",
      },
      ids: LUNG_Y(R(`pulmonary vein$|segmental vein$|lingular vein$|part of ${SIDE}(apical|anterior|medial|lateral) segmental vein$|trunk of ${SIDE}apical segmental vein$`, VEN)),
    },
    {
      key: "phe-quan",
      latin: "Arbor bronchialis",
      name: { vi: "Cây phế quản (mốc)", en: "Bronchial tree (landmark)", zh: "支气管树（标志）" },
      note: {
        vi: "Mờ sẵn — động mạch đi sát phế quản cùng tên.",
        en: "Faded — each artery hugs the bronchus of the same name.",
        zh: "淡化——每支动脉紧贴同名支气管。",
      },
      ids: R(`^trachea$|main bronchus|bronchial tree$`, ["respiratory"]),
    },
  ],
});

// ───────────────────────── 16. Cây phế quản phân thùy ─────────────────────────
emit({
  file: "bronchial-tree",
  script: "batch-e",
  exportName: "bronchialTreeScene",
  header: 'Scene "Cây phế quản phân thùy" dựng từ bộ atlas BodyParts3D.\n\nAtlas không có nhu mô phổi — cây phế quản là hình ảnh chính của phổi trong bộ dữ liệu.',
  scene: {
    slug: "phoi-cay-phe-quan",
    title: { vi: "Khí quản và cây phế quản phân thùy", en: "Trachea and the Segmental Bronchial Tree", zh: "气管与肺段支气管树" },
    latin: "Trachea · Arbor bronchialis",
    intro: {
      vi: "Khí quản chia hai phế quản gốc ở carina (ngang T4–T5). Phế quản gốc phải ngắn, to, gần thẳng đứng, chia ba phế quản thùy (trên, giữa, dưới). Phế quản gốc trái dài, nằm ngang hơn để vòng dưới cung động mạch chủ, chia hai phế quản thùy (trên kèm lưỡi, và dưới). Mỗi phế quản thùy lại chia thành phế quản phân thùy, là đơn vị để đọc phim và phẫu thuật. Scene tô mỗi thuỳ một màu. Nhờ vậy dễ nhận ra phân thùy nào ứng với thuỳ nào, và vì sao dị vật hay rơi vào phế quản phải.",
      en: "The trachea divides into the two main bronchi at the carina (T4–T5). The right main bronchus is short, wide and nearly vertical, and splits into three lobar bronchi (upper, middle, lower). The left is longer and more horizontal, passing under the aortic arch, and splits into two (upper with lingula, and lower). Each lobar bronchus divides into segmental bronchi, the units for reading scans and for surgery. The scene gives each lobe its own colour. That makes it easy to see which segment belongs to which lobe, and why inhaled objects usually go right.",
      zh: "气管在隆嵴（T4–T5）分为左右主支气管。右主支气管短、粗、近乎垂直，分为三个叶支气管（上、中、下）；左主支气管较长、较水平，从主动脉弓下方绕过，分为两个叶支气管（上叶含舌段、下叶）。每个叶支气管再分为段支气管，是阅片和手术的单位。本场景每叶一种颜色，便于辨认各段所属肺叶，以及异物为何多入右侧。",
    },
  },
  frame: ["khi-quan", "tren", "giua", "luoi", "duoi"],
  groups: [
    {
      key: "khi-quan",
      tint: "#e3e0d6",
      latin: "Trachea · Bronchi principales",
      name: { vi: "Khí quản và phế quản gốc", en: "Trachea and main bronchi", zh: "气管与主支气管" },
      note: {
        vi: "Khí quản dài khoảng 10–12cm, có 16–20 vòng sụn hình chữ C hở phía sau. Carina là vùng rất nhạy, chạm vào gây ho dữ dội.",
        en: "The trachea is 10–12cm long with 16–20 C-shaped cartilage rings open behind. The carina is exquisitely sensitive; touching it triggers violent coughing.",
        zh: "气管长约10–12cm，有16–20个后方开口的C形软骨环。隆嵴极为敏感，触及可引起剧烈咳嗽。",
      },
      ids: R(`^trachea$|main bronchus( proper)?$`, ["respiratory"]),
    },
    {
      key: "tren",
      tint: "#5b9bd5",
      latin: "Bronchi segmentales lobi superioris (B1–B3)",
      name: { vi: "Thuỳ trên: đỉnh, sau, trước", en: "Upper lobe: apical, posterior, anterior", zh: "上叶：尖段、后段、前段" },
      note: {
        vi: "Phân thùy đỉnh và sau thuỳ trên là nơi lao phổi hay khu trú, vì nơi này thông khí tốt hơn tưới máu.",
        en: "The apical and posterior upper-lobe segments are the favourite site of tuberculosis, where ventilation exceeds blood flow.",
        zh: "上叶尖段和后段是肺结核好发部位，因该处通气大于血流。",
      },
      ids: R(`^${SIDE}(apical|posterior|anterior) segmental bronchial tree$`, ["respiratory"]),
    },
    {
      key: "giua",
      tint: "#6fae7f",
      latin: "Bronchi segmentales lobi medii (B4–B5)",
      name: { vi: "Thuỳ giữa (phải): ngoài, trong", en: "Middle lobe (right): lateral, medial", zh: "中叶（右）：外侧段、内侧段" },
      note: {
        vi: "Chỉ có ở phổi phải.",
        en: "Present only in the right lung.",
        zh: "仅右肺有。",
      },
      ids: R(`^${SIDE}(lateral|medial) segmental bronchial tree$`, ["respiratory"]),
    },
    {
      key: "luoi",
      tint: "#e6c14a",
      latin: "Bronchi lingulares (B4–B5 trái)",
      name: { vi: "Lưỡi phổi (trái): trên, dưới", en: "Lingula (left): superior, inferior", zh: "舌段（左）：上舌段、下舌段" },
      note: {
        vi: "Thuộc thuỳ trên trái, tương ứng thuỳ giữa phải.",
        en: "Part of the left upper lobe, matching the right middle lobe.",
        zh: "属左上叶，相当于右中叶。",
      },
      ids: R(`lingular bronchial tree$`, ["respiratory"]),
    },
    {
      key: "duoi",
      tint: "#e8883d",
      latin: "Bronchi segmentales lobi inferioris (B6–B10)",
      name: { vi: "Thuỳ dưới: trên và bốn phân thùy nền", en: "Lower lobe: superior and four basal segments", zh: "下叶：上段与四个基底段" },
      note: {
        vi: "Phân thùy nền sau là nơi dịch hít sặc đọng khi người bệnh ngồi hoặc đứng.",
        en: "The posterior basal segment is where aspirated fluid settles when the patient is upright.",
        zh: "直立位时误吸液体积聚于后基底段。",
      },
      ids: R(`^${SIDE}(superior|medial basal|anterior basal|lateral basal|posterior basal) segmental bronchial tree$`, ["respiratory"]),
    },
  ],
});

// ───────────────────────── 17. Giải phẫu phổi (cuống phổi) ─────────────────────────
emit({
  file: "lung-root",
  script: "batch-e",
  exportName: "lungRootScene",
  header: 'Scene "Giải phẫu phổi — cuống phổi" dựng từ bộ atlas BodyParts3D.\n\nAtlas không có nhu mô phổi và màng phổi — bài dạy các thành phần cuống phổi và hai hệ mạch.',
  scene: {
    slug: "giai-phau-phoi",
    title: { vi: "Phổi: cuống phổi và hai hệ mạch", en: "The Lungs: Lung Roots and Two Circulations", zh: "肺：肺根与两套血管" },
    latin: "Pulmones · Radix pulmonis",
    intro: {
      vi: "Phổi có hai hệ mạch. Hệ chức năng là động mạch và tĩnh mạch phổi, trao đổi khí. Hệ dinh dưỡng là động mạch phế quản từ động mạch chủ, nuôi chính cây phế quản. Mọi thành phần vào ra phổi qua cuống phổi ở rốn phổi: phế quản gốc, động mạch phổi, hai tĩnh mạch phổi, động mạch phế quản. Thứ tự từ trên xuống khác nhau giữa hai bên. Bên phải, phế quản thuỳ trên nằm cao nhất. Bên trái, động mạch phổi nằm cao nhất. Bộ dữ liệu không có nhu mô phổi và màng phổi, nên scene dựng cuống phổi và các hệ ống. Động mạch phổi xanh, tĩnh mạch phổi đỏ, phế quản trắng.",
      en: "The lungs have two circulations. The functional one is the pulmonary arteries and veins, which exchange gas. The nutritive one is the bronchial arteries from the aorta, which feed the airways themselves. Everything enters and leaves through the lung root at the hilum: main bronchus, pulmonary artery, two pulmonary veins, bronchial arteries. The top-to-bottom order differs between sides. On the right the upper-lobe bronchus is highest. On the left the pulmonary artery is highest. The dataset has no lung tissue or pleura, so the scene builds the roots and the branching systems. Pulmonary arteries blue, pulmonary veins red, bronchi white.",
      zh: "肺有两套血管：功能血管为肺动脉和肺静脉，进行气体交换；营养血管为发自主动脉的支气管动脉，营养气道本身。所有结构经肺门处的肺根出入：主支气管、肺动脉、两条肺静脉、支气管动脉。自上而下的排列两侧不同：右侧上叶支气管最高，左侧肺动脉最高。数据集中无肺实质和胸膜，故本场景构建肺根及各管道系统。肺动脉蓝，肺静脉红，支气管白。",
    },
  },
  faded: ["tim"],
  frame: ["phe-quan-p", "phe-quan-t", "dm-phoi", "tm-phoi"],
  groups: [
    {
      key: "phe-quan-p",
      tint: "#e3e0d6",
      latin: "Arbor bronchialis dexter",
      name: { vi: "Cây phế quản phải (3 thuỳ)", en: "Right bronchial tree (3 lobes)", zh: "右支气管树（3叶）" },
      note: {
        vi: "Phế quản thuỳ trên phải tách rất sớm, trước khi vào rốn phổi, nên nằm trên động mạch phổi (phế quản trên động mạch).",
        en: "The right upper-lobe bronchus branches very early, before the hilum, so it lies above the pulmonary artery (the eparterial bronchus).",
        zh: "右上叶支气管在入肺门前即发出，位于肺动脉上方（动脉上支气管）。",
      },
      ids: R(`^trachea$|^right main bronchus|^right .*bronchial tree$`, ["respiratory"]),
    },
    {
      key: "phe-quan-t",
      tint: "#cfc8b8",
      latin: "Arbor bronchialis sinister",
      name: { vi: "Cây phế quản trái (2 thuỳ)", en: "Left bronchial tree (2 lobes)", zh: "左支气管树（2叶）" },
      note: {
        vi: "Phổi trái nhỏ hơn vì nhường chỗ cho tim (khuyết tim).",
        en: "The left lung is smaller, making room for the heart (the cardiac notch).",
        zh: "左肺较小，为心脏让出空间（心切迹）。",
      },
      ids: R(`^left main bronchus|^left .*bronchial tree$|^(superior|inferior) lingular bronchial tree$`, ["respiratory"]),
    },
    {
      key: "dm-phoi",
      tint: DEOXY,
      latin: "Truncus pulmonalis · Aa. pulmonales",
      name: { vi: "Động mạch phổi (máu nghèo oxy)", en: "Pulmonary arteries (deoxygenated blood)", zh: "肺动脉（缺氧血）" },
      note: {
        vi: "Áp lực chỉ khoảng 25/10 mmHg, bằng 1/5 tuần hoàn lớn. Tăng áp động mạch phổi làm thất phải phì đại rồi suy.",
        en: "Pressure is only about 25/10 mmHg, a fifth of the systemic circuit. Pulmonary hypertension makes the right ventricle thicken and then fail.",
        zh: "压力仅约25/10 mmHg，为体循环的1/5。肺动脉高压致右心室肥厚继而衰竭。",
      },
      ids: LUNG_Y(R(`^pulmonary trunk$|^${SIDE}pulmonary artery$|segmental artery$|lingular artery$`, ART)),
    },
    {
      key: "tm-phoi",
      tint: OXY,
      latin: "Vv. pulmonales",
      name: { vi: "Tĩnh mạch phổi (máu giàu oxy)", en: "Pulmonary veins (oxygenated blood)", zh: "肺静脉（含氧血）" },
      note: {
        vi: "Ở rốn phổi, tĩnh mạch phổi dưới nằm thấp nhất ở cả hai bên.",
        en: "At the hilum the inferior pulmonary vein is the lowest structure on both sides.",
        zh: "肺门处两侧均以下肺静脉位置最低。",
      },
      ids: LUNG_Y(R(`pulmonary vein$|segmental vein$|lingular vein$`, VEN)),
    },
    {
      key: "phe-quan-dm",
      tint: "#e8883d",
      latin: "Aa. bronchiales",
      name: { vi: "Động mạch phế quản (hệ dinh dưỡng)", en: "Bronchial arteries (nutritive supply)", zh: "支气管动脉（营养血管）" },
      note: {
        vi: "Từ động mạch chủ ngực, áp lực hệ thống. Ho ra máu nặng thường xuất phát từ đây và được điều trị bằng nút mạch phế quản.",
        en: "From the thoracic aorta at systemic pressure. Massive haemoptysis usually comes from these vessels and is treated by bronchial artery embolisation.",
        zh: "发自胸主动脉，承受体循环压力。大咯血多源于此，可行支气管动脉栓塞治疗。",
      },
      ids: R(`^bronchial artery$|^bronchial branch of arch of aorta$`, ART),
    },
    {
      key: "tim",
      latin: "Cor · Arcus aortae",
      name: { vi: "Tim và cung động mạch chủ (mốc)", en: "Heart and aortic arch (landmarks)", zh: "心与主动脉弓（标志）" },
      note: {
        vi: "Mờ sẵn — phế quản gốc trái vòng dưới cung động mạch chủ.",
        en: "Faded — the left main bronchus passes beneath the aortic arch.",
        zh: "淡化——左主支气管从主动脉弓下方绕过。",
      },
      ids: fromScene("heart", ["nhi-phai", "that-phai", "nhi-trai", "that-trai"]).concat(R(`^arch of aorta$`, ART)),
    },
  ],
});
