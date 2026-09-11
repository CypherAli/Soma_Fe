/**
 * Đợt 4C — đầu, cổ và thần kinh trung ương, dựng từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-batch-c.mjs
 *
 * Mạch não trong atlas có cặp mã phải/trái (FJxxxx và FJxxxxM) — lấy cả hai.
 * Hốc mắt chỉ lấy bên TRÁI (bẫy #13: lưới mắt phải lỗi).
 *
 * ĐỔI CHỦ ĐỀ (atlas không có tai, xoang tĩnh mạch, dây VII–VIII, cơ nhai, hạch):
 *   tai-day-du            → Động mạch não trước
 *   khop-thai-duong-ham   → Động mạch não giữa
 *   ho-duoi-thai-duong    → Động mạch não sau
 *   xoang-tinh-mach-mang-cung → Nhánh xuyên sâu và động mạch mạch mạc
 *   goc-cau-tieu-nao      → Hệ đốt sống–thân nền và động mạch tiểu não
 *   than-nao-day-so-full  → Nhân nền và bao trong
 *   tieu-nao-day-du       → Hồi và thùy vỏ đại não
 *   co-mat-than-kinh-vii  → Thể chai và các mép liên bán cầu
 *   hach-co               → Xương móng và cơ trên–dưới móng
 */
import { byRe, emit, leftSide, OXY } from "./lib.mjs";

const ART = ["arterial"];
const NER = ["nervous"];
const BONE = ["skeletal"];
const MU = ["muscular", "skeletal", "respiratory"];
const SIDE = "(left |right )?";
const A = (s) => byRe(new RegExp(s, "i"), ART);

const STEM = () => byRe(/^(midbrain|pons|medulla oblongata|cerebellum)$/i, NER);

// ───────────────────── 1. Động mạch não trước (đổi chủ đề) ─────────────────────
emit({
  file: "aca",
  script: "batch-c",
  exportName: "acaScene",
  header: 'Scene "Động mạch não trước" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Tai đầy đủ" cũ: atlas chỉ có một lưới tai ngoài, không có tai giữa và tai trong.',
  scene: {
    slug: "tai-day-du",
    system: "cardiovascular",
    title: { vi: "Động mạch não trước và nhánh vỏ", en: "The Anterior Cerebral Artery", zh: "大脑前动脉" },
    latin: "A. cerebri anterior",
    intro: {
      vi: "Động mạch não trước là nhánh tận nhỏ hơn của động mạch cảnh trong. Nó chạy ra trước trên dây thị giác, nối với bên đối diện qua động mạch thông trước, rồi vòng quanh gối thể chai. Tại đây nó chia hai nhánh chính: động mạch quanh thể chai, bám sát thể chai, và động mạch viền–thể chai, chạy trong rãnh đai. Hai nhánh này nuôi mặt trong thuỳ trán và thuỳ đỉnh, gồm cả tiểu thuỳ cạnh trung tâm, vùng vận động và cảm giác của chân. Tắc động mạch não trước vì thế gây yếu chân đối bên nhiều hơn tay. Mỗi nhánh một sắc đỏ; não mờ sẵn.",
      en: "The anterior cerebral artery is the smaller terminal branch of the internal carotid. It runs forward above the optic nerve, links with its partner through the anterior communicating artery, then curves round the genu of the corpus callosum. There it divides into two main branches: the pericallosal artery, which hugs the corpus callosum, and the callosomarginal artery, which runs in the cingulate sulcus. They supply the medial surface of the frontal and parietal lobes, including the paracentral lobule, the motor and sensory area for the leg. So an anterior cerebral occlusion weakens the opposite leg more than the arm. Each branch has its own shade of red; the brain is faded.",
      zh: "大脑前动脉是颈内动脉较小的终支，向前行于视神经上方，经前交通动脉与对侧相连，再绕胼胝体膝部，分为两大支：紧贴胼胝体的胼周动脉和行于扣带沟内的胼缘动脉。它们供应额叶和顶叶内侧面，包括旁中央小叶——下肢的运动和感觉区。故大脑前动脉闭塞时对侧下肢无力重于上肢。每支一种红色调；脑淡化。",
    },
  },
  faded: ["nao"],
  frame: ["goc", "quanh", "vien", "nen"],
  groups: [
    {
      key: "goc",
      tint: "#8f2d2d",
      latin: "A. cerebri anterior (pars precommunicalis) · A. communicans anterior",
      name: { vi: "Đoạn đầu (A1) và động mạch thông trước", en: "First segment (A1) and anterior communicating artery", zh: "A1段与前交通动脉" },
      note: {
        vi: "Động mạch thông trước ngắn, nối hai bên và là vị trí phình mạch não hay gặp nhất. Phình ở đây vỡ gây xuất huyết dưới nhện.",
        en: "The short anterior communicating artery links the two sides and is the commonest site of cerebral aneurysm; rupture causes subarachnoid haemorrhage.",
        zh: "前交通动脉短小，连接两侧，是颅内动脉瘤最常见部位，破裂致蛛网膜下腔出血。",
      },
      ids: A(`^${SIDE}anterior cerebral artery$|^anterior communicating artery$`),
    },
    {
      key: "quanh",
      tint: OXY,
      latin: "A. pericallosa · R. precunealis",
      name: { vi: "Động mạch quanh thể chai và nhánh trước chêm", en: "Pericallosal artery and precuneal branch", zh: "胼周动脉与楔前支" },
      note: {
        vi: "Chạy sát mặt trên thể chai về sau, tới lồi thể chai. Nhánh trước chêm nuôi hồi trước chêm ở mặt trong thuỳ đỉnh.",
        en: "Runs back along the upper surface of the corpus callosum to the splenium. The precuneal branch supplies the precuneus on the medial parietal surface.",
        zh: "沿胼胝体上面向后至压部。楔前支供应顶叶内侧面的楔前叶。",
      },
      ids: A(`^${SIDE}pericallosal artery$|precuneal branch of ${SIDE}pericallosal artery$`),
    },
    {
      key: "vien",
      tint: "#e8883d",
      latin: "A. callosomarginalis et rami",
      name: { vi: "Động mạch viền–thể chai và các nhánh", en: "Callosomarginal artery and its branches", zh: "胼缘动脉及其分支" },
      note: {
        vi: "Chạy trong rãnh đai, cho các nhánh trán trong (trước, giữa, sau) và nhánh cạnh trung tâm. Nhánh cạnh trung tâm nuôi tiểu thuỳ cạnh trung tâm, nơi chỉ huy vận động chân và bàng quang.",
        en: "Runs in the cingulate sulcus and gives the internal frontal branches (anterior, intermediate, posterior) and the paracentral branch. The paracentral branch feeds the paracentral lobule, which controls the leg and bladder.",
        zh: "行于扣带沟内，发出额内侧支（前、中、后）和旁中央支。旁中央支供应旁中央小叶，支配下肢和膀胱。",
      },
      ids: A(`^${SIDE}callosomarginal artery$|branch of ${SIDE}callosomarginal artery$`),
    },
    {
      key: "nen",
      tint: "#e39a7a",
      latin: "A. frontobasalis medialis",
      name: { vi: "Động mạch trán–nền trong", en: "Medial frontobasal artery", zh: "额底内侧动脉" },
      note: {
        vi: "Nhánh đầu tiên sau động mạch thông trước, nuôi mặt dưới trong thuỳ trán (hồi thẳng, hành khứu).",
        en: "The first branch after the anterior communicating artery, supplying the inferomedial frontal lobe (gyrus rectus, olfactory bulb).",
        zh: "前交通动脉后的第一支，供应额叶下内侧面（直回、嗅球）。",
      },
      ids: A(`^${SIDE}medial frontobasal artery$`),
    },
    {
      key: "canh",
      tint: "#b03a48",
      latin: "A. carotis interna",
      name: { vi: "Động mạch cảnh trong (nguồn)", en: "Internal carotid artery (source)", zh: "颈内动脉（来源）" },
      note: {
        vi: "Chia tận thành động mạch não trước và não giữa ở mặt dưới não, cạnh chất thủng trước.",
        en: "Ends by dividing into the anterior and middle cerebral arteries under the brain, beside the anterior perforated substance.",
        zh: "在脑底前穿质旁分为大脑前动脉和大脑中动脉。",
      },
      ids: A(`^${SIDE}internal carotid artery$`),
    },
    {
      key: "nao",
      latin: "Corpus callosum · Hemispheria",
      name: { vi: "Thể chai và bán cầu (mốc)", en: "Corpus callosum and hemispheres (landmarks)", zh: "胼胝体与大脑半球（标志）" },
      note: {
        vi: "Mờ sẵn. Bỏ mờ thể chai để thấy động mạch quanh thể chai ôm lấy nó.",
        en: "Faded. Unfade the corpus callosum to see the pericallosal artery wrapping it.",
        zh: "淡化。取消胼胝体淡化可见胼周动脉环绕之。",
      },
      ids: byRe(/^corpus callosum$|^(left |right )?cingulate gyrus$/i, NER),
    },
  ],
});

// ───────────────────── 2. Động mạch não giữa (đổi chủ đề) ─────────────────────
emit({
  file: "mca",
  script: "batch-c",
  exportName: "mcaScene",
  header: 'Scene "Động mạch não giữa" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Khớp thái dương–hàm" cũ: atlas không có cơ nhai, đĩa khớp và dây chằng khớp.',
  scene: {
    slug: "khop-thai-duong-ham",
    system: "cardiovascular",
    title: { vi: "Động mạch não giữa và nhánh vỏ", en: "The Middle Cerebral Artery", zh: "大脑中动脉" },
    latin: "A. cerebri media",
    intro: {
      vi: "Động mạch não giữa là nhánh tận lớn nhất của động mạch cảnh trong. Nó chạy ngang ra ngoài trong rãnh bên (đoạn bướm, M1), cho các động mạch trung tâm trước ngoài chui vào nhân nền. Tới thuỳ đảo, nó chia các nhánh (đoạn đảo, M2), rồi toả ra phủ gần hết mặt ngoài bán cầu. Vùng nó nuôi gồm vỏ vận động và cảm giác của mặt và tay, cùng vùng ngôn ngữ Broca và Wernicke ở bán cầu ưu thế. Vì thế đột quỵ não giữa gây liệt mặt–tay đối bên và mất ngôn ngữ. Đây là động mạch hay bị tắc nhất trong đột quỵ. Nhánh trán, đỉnh, thái dương mỗi nhóm một sắc đỏ; não mờ sẵn.",
      en: "The middle cerebral artery is the largest terminal branch of the internal carotid. It runs laterally in the lateral sulcus (sphenoidal segment, M1), giving the anterolateral central arteries that plunge into the basal nuclei. At the insula it divides (insular segment, M2), then fans out over most of the lateral hemisphere. Its territory includes the motor and sensory cortex for face and arm, and Broca's and Wernicke's language areas in the dominant hemisphere. So a middle cerebral stroke causes opposite face–arm weakness and aphasia. It is the artery most often blocked in stroke. Frontal, parietal and temporal branch groups each have a shade of red; the brain is faded.",
      zh: "大脑中动脉是颈内动脉最大的终支，横行于外侧沟内（蝶部，M1），发出前外侧中央动脉进入基底核；至岛叶分支（岛部，M2），再散布于大脑半球外侧面大部。其供血区包括面部和上肢的运动与感觉皮质，以及优势半球的Broca和Wernicke语言区，故大脑中动脉卒中致对侧面–臂瘫痪和失语。它是卒中最常闭塞的动脉。额、顶、颞支各一种红色调；脑淡化。",
    },
  },
  faded: ["nao"],
  frame: ["goc", "tran", "dinh", "thai-duong"],
  groups: [
    {
      key: "goc",
      tint: "#8f2d2d",
      latin: "Pars sphenoidalis (M1) · Pars insularis (M2)",
      name: { vi: "Đoạn bướm (M1) và đoạn đảo (M2)", en: "Sphenoidal (M1) and insular (M2) segments", zh: "蝶部（M1）与岛部（M2）" },
      note: {
        vi: "M1 là đích của lấy huyết khối cơ học trong đột quỵ cấp. Ở thuỳ đảo, thân chính thường chia hai: thân trên cho nhánh trán–đỉnh, thân dưới cho nhánh thái dương.",
        en: "M1 is the target of mechanical thrombectomy in acute stroke. At the insula the trunk usually divides in two: a superior trunk to frontal–parietal branches and an inferior trunk to temporal branches.",
        zh: "M1是急性卒中机械取栓的靶点。在岛叶主干通常分为上干（额顶支）和下干（颞支）。",
      },
      ids: A(`^sphenoid part of ${SIDE}middle cerebral artery$|^insular part of ${SIDE}middle cerebral artery$|trunk of inferior terminal branch of ${SIDE}middle cerebral artery$`),
    },
    {
      key: "trung-tam",
      tint: "#d9534f",
      latin: "Aa. centrales anterolaterales (lenticulostriatae)",
      name: { vi: "Động mạch trung tâm trước ngoài (vân–đậu)", en: "Anterolateral central (lenticulostriate) arteries", zh: "前外侧中央动脉（豆纹动脉）" },
      note: {
        vi: "Các nhánh xuyên nhỏ, vuông góc, nuôi nhân bèo và bao trong. Chúng chịu áp lực cao nên dễ vỡ ở người tăng huyết áp, được gọi là “động mạch đột quỵ”.",
        en: "Small perforators at right angles that feed the lentiform nucleus and internal capsule. They bear high pressure and rupture readily in hypertension — the “arteries of stroke”.",
        zh: "垂直发出的细小穿支，供应豆状核和内囊。承受高压，高血压时易破裂，称“卒中动脉”。",
      },
      ids: A(`^anterolateral central branch of ${SIDE}middle cerebral artery$`),
    },
    {
      key: "tran",
      tint: OXY,
      latin: "Aa. frontobasalis lateralis, prefrontalis, sulci precentralis, sulci centralis",
      name: { vi: "Nhánh trán: trán–nền ngoài, trước trán, rãnh trước trung tâm, rãnh trung tâm", en: "Frontal branches: lateral frontobasal, prefrontal, precentral and central sulcal", zh: "额支：额底外侧、额前、中央前沟、中央沟动脉" },
      note: {
        vi: "Nuôi thuỳ trán ngoài, hồi trước trung tâm (vận động mặt–tay) và vùng Broca ở hồi trán dưới.",
        en: "Supply the lateral frontal lobe, the precentral gyrus (face–arm motor) and Broca's area in the inferior frontal gyrus.",
        zh: "供应额叶外侧、中央前回（面–臂运动区）及额下回Broca区。",
      },
      ids: A(`^${SIDE}(lateral frontobasal|prefrontal) artery$|^artery of ${SIDE}precentral sulcus$|^artery of central sulcus$`),
    },
    {
      key: "dinh",
      tint: "#e8883d",
      latin: "Aa. sulci postcentralis, parietales anterior et posterior, r. gyri angularis",
      name: { vi: "Nhánh đỉnh: rãnh sau trung tâm, đỉnh trước, đỉnh sau, hồi góc", en: "Parietal branches: postcentral sulcal, anterior and posterior parietal, angular", zh: "顶支：中央后沟、顶前、顶后动脉及角回支" },
      note: {
        vi: "Nuôi hồi sau trung tâm (cảm giác) và thuỳ đỉnh dưới. Tổn thương hồi góc ở bán cầu ưu thế gây mất đọc, mất viết, mất tính (hội chứng Gerstmann).",
        en: "Supply the postcentral gyrus (sensation) and inferior parietal lobule. Damage to the angular gyrus in the dominant hemisphere causes alexia, agraphia and acalculia (Gerstmann syndrome).",
        zh: "供应中央后回（感觉）和顶下小叶。优势半球角回损伤致失读、失写、失算（Gerstmann综合征）。",
      },
      ids: A(`^artery of ${SIDE}postcentral sulcus$|^${SIDE}(anterior|posterior) parietal artery$|^branch of ${SIDE}middle cerebral artery to ${SIDE}angular gyrus$`),
    },
    {
      key: "thai-duong",
      tint: "#e39a7a",
      latin: "Rr. temporales · A. temporalis polaris · R. temporooccipitalis",
      name: { vi: "Nhánh thái dương: cực thái dương, thái dương trước, giữa, sau, thái dương–chẩm", en: "Temporal branches: polar, anterior, middle, posterior, temporo-occipital", zh: "颞支：颞极、颞前、颞中、颞后、颞枕支" },
      note: {
        vi: "Nuôi mặt ngoài thuỳ thái dương, gồm vùng Wernicke (hiểu lời nói) ở phần sau hồi thái dương trên.",
        en: "Supply the lateral temporal lobe, including Wernicke's area (comprehension) in the posterior superior temporal gyrus.",
        zh: "供应颞叶外侧面，包括颞上回后部的Wernicke区（语言理解）。",
      },
      ids: A(`^${SIDE}(polar temporal|anterior temporal) artery$|^(middle|posterior) temporal branch of ${SIDE}middle cerebral artery$|^temporo-occipital branch of ${SIDE}middle cerebral artery$`),
    },
    {
      key: "nao",
      latin: "Insula · Gyri",
      name: { vi: "Thuỳ đảo và các hồi mặt ngoài (mốc)", en: "Insula and lateral gyri (landmarks)", zh: "岛叶与外侧面脑回（标志）" },
      note: {
        vi: "Mờ sẵn. Bỏ mờ thuỳ đảo để thấy đoạn M2 nằm trên nó.",
        en: "Faded. Unfade the insula to see M2 lying on it.",
        zh: "淡化。取消岛叶淡化可见M2段位于其上。",
      },
      ids: byRe(/^(left |right )?(insula|precentral gyrus|postcentral gyrus|inferior frontal gyrus)$/i, NER),
    },
  ],
});

// ───────────────────── 3. Động mạch não sau (đổi chủ đề) ─────────────────────
emit({
  file: "pca",
  script: "batch-c",
  exportName: "pcaScene",
  header: 'Scene "Động mạch não sau" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Hố dưới thái dương" cũ: atlas không có cơ chân bướm, ĐM hàm, dây hàm dưới.',
  scene: {
    slug: "ho-duoi-thai-duong",
    system: "cardiovascular",
    title: { vi: "Động mạch não sau và nhánh vỏ", en: "The Posterior Cerebral Artery", zh: "大脑后动脉" },
    latin: "A. cerebri posterior",
    intro: {
      vi: "Hai động mạch não sau là hai nhánh tận của động mạch thân nền, tách ở bờ trên cầu não. Đoạn trước thông (P1) nối với động mạch thông sau để khép vòng Willis. Sau đó động mạch vòng quanh cuống đại não, chia thành động mạch chẩm ngoài (nuôi mặt dưới thuỳ thái dương) và động mạch chẩm trong (nuôi thuỳ chẩm). Nhánh cựa của động mạch chẩm trong nuôi vỏ thị giác. Tắc động mạch não sau gây mất nửa thị trường đối bên, thường còn giữ thị lực trung tâm vì cực chẩm có thêm máu từ động mạch não giữa. Mỗi nhánh một sắc đỏ; thân não và thuỳ chẩm mờ sẵn.",
      en: "The two posterior cerebral arteries are the terminal branches of the basilar artery, arising at the upper border of the pons. The precommunicating segment (P1) meets the posterior communicating artery to close the circle of Willis. The artery then winds round the cerebral peduncle and divides into the lateral occipital artery (to the inferior temporal lobe) and the medial occipital artery (to the occipital lobe). The calcarine branch of the medial occipital feeds the visual cortex. Posterior cerebral occlusion causes opposite homonymous hemianopia, often sparing central vision because the occipital pole also receives middle cerebral blood. Each branch has its own shade of red; brainstem and occipital lobe are faded.",
      zh: "两侧大脑后动脉为基底动脉的终支，在脑桥上缘发出。交通前部（P1）与后交通动脉相接，闭合Willis环。随后绕大脑脚，分为枕外侧动脉（供应颞叶下面）和枕内侧动脉（供应枕叶），后者的距状沟支供应视皮质。大脑后动脉闭塞致对侧同向偏盲，常保留中心视力，因枕极亦受大脑中动脉供血。每支一种红色调；脑干和枕叶淡化。",
    },
  },
  faded: ["nao"],
  frame: ["goc", "cham-ngoai", "cham-trong", "thong-sau"],
  groups: [
    {
      key: "than-nen",
      tint: "#8f2d2d",
      latin: "A. basilaris",
      name: { vi: "Động mạch thân nền (nguồn)", en: "Basilar artery (source)", zh: "基底动脉（来源）" },
      note: {
        vi: "Chia đôi ở rãnh cầu–cuống. Dây III thoát ra giữa động mạch não sau và động mạch tiểu não trên, nên phình mạch ở đây có thể gây liệt dây III.",
        en: "Divides at the pontomesencephalic junction. Nerve III emerges between the posterior cerebral and superior cerebellar arteries, so an aneurysm here can palsy nerve III.",
        zh: "在脑桥中脑沟处分叉。动眼神经穿行于大脑后动脉与小脑上动脉之间，此处动脉瘤可致动眼神经麻痹。",
      },
      ids: A(`^basilar artery$`),
    },
    {
      key: "goc",
      tint: OXY,
      latin: "Pars precommunicalis (P1) · Pars postcommunicalis (P2)",
      name: { vi: "Đoạn trước thông (P1) và sau thông (P2)", en: "Precommunicating (P1) and postcommunicating (P2) parts", zh: "交通前部（P1）与交通后部（P2）" },
      note: {
        vi: "Khoảng 20% người có động mạch não sau nhận máu chủ yếu từ động mạch cảnh trong qua thông sau (kiểu thai nhi). Khi đó P1 rất nhỏ.",
        en: "In about 20% of people the posterior cerebral gets most of its blood from the internal carotid via the posterior communicating (fetal pattern); P1 is then tiny.",
        zh: "约20%人群的大脑后动脉主要经后交通动脉由颈内动脉供血（胚胎型），此时P1很细。",
      },
      ids: A(`^(pre|post)communicating part of ${SIDE}posterior cerebral artery$`),
    },
    {
      key: "thong-sau",
      tint: "#b03a48",
      latin: "A. communicans posterior",
      name: { vi: "Động mạch thông sau", en: "Posterior communicating artery", zh: "后交通动脉" },
      note: {
        vi: "Nối hệ cảnh trong với hệ thân nền. Phình ở chỗ nối với cảnh trong hay gây liệt dây III kèm giãn đồng tử.",
        en: "Links the carotid and vertebrobasilar systems. An aneurysm at its junction with the carotid classically causes nerve III palsy with a dilated pupil.",
        zh: "连接颈内动脉系与椎基底动脉系。其与颈内动脉连接处的动脉瘤典型地引起伴瞳孔散大的动眼神经麻痹。",
      },
      ids: A(`^${SIDE}posterior communicating artery$`),
    },
    {
      key: "cham-ngoai",
      tint: "#e8883d",
      latin: "A. occipitalis lateralis et rr. temporales",
      name: { vi: "Động mạch chẩm ngoài và nhánh thái dương", en: "Lateral occipital artery and temporal branches", zh: "枕外侧动脉及颞支" },
      note: {
        vi: "Các nhánh thái dương trước, giữa, sau nuôi mặt dưới thuỳ thái dương, gồm hồi hải mã và hồi chẩm–thái dương (hồi hình thoi, vùng nhận diện khuôn mặt).",
        en: "Its anterior, middle and posterior temporal branches supply the inferior temporal surface, including the parahippocampal and fusiform gyri (the face-recognition area).",
        zh: "颞前、中、后支供应颞叶下面，包括海马旁回和梭状回（面孔识别区）。",
      },
      ids: A(`^${SIDE}lateral occipital artery$|temporal branch(es)? of ${SIDE}lateral occipital artery$`),
    },
    {
      key: "cham-trong",
      tint: "#e39a7a",
      latin: "A. occipitalis medialis · R. corporis callosi dorsalis (a. splenialis)",
      name: { vi: "Động mạch chẩm trong và nhánh lồi thể chai", en: "Medial occipital artery and splenial branch", zh: "枕内侧动脉与胼胝体压部支" },
      note: {
        vi: "Chia nhánh cựa (vỏ thị giác) và nhánh đỉnh–chẩm. Nhánh lồi thể chai nối với động mạch quanh thể chai của hệ não trước.",
        en: "Divides into calcarine (visual cortex) and parieto-occipital branches. The splenial branch joins the pericallosal artery of the anterior system.",
        zh: "分为距状沟支（视皮质）和顶枕支。压部支与大脑前动脉系的胼周动脉吻合。",
      },
      ids: A(`^${SIDE}(medial occipital|splenial) artery$`),
    },
    {
      key: "nao",
      latin: "Truncus encephali · Lobus occipitalis",
      name: { vi: "Thân não, thuỳ chẩm (mốc)", en: "Brainstem and occipital lobe (landmarks)", zh: "脑干与枕叶（标志）" },
      note: {
        vi: "Mờ sẵn — thấy động mạch vòng quanh cuống đại não để ra sau.",
        en: "Faded — showing the artery winding round the cerebral peduncle to reach the back of the brain.",
        zh: "淡化——显示动脉绕大脑脚行向后方。",
      },
      ids: byRe(/^(midbrain|pons|peduncle of midbrain)$|^(left |right )?(occipital lobe|fusiform gyrus|parahippocampal gyrus)$/i, NER),
    },
  ],
});

// ───────────── 4. Nhánh xuyên sâu và động mạch mạch mạc (đổi chủ đề) ─────────────
emit({
  file: "deep-perforators",
  script: "batch-c",
  exportName: "deepPerforatorsScene",
  header: 'Scene "Nhánh xuyên sâu và động mạch mạch mạc" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Xoang tĩnh mạch màng cứng" cũ: atlas không có màng cứng (chỉ có lều tiểu não) và không có xoang tĩnh mạch.',
  scene: {
    slug: "xoang-tinh-mach-mang-cung",
    system: "cardiovascular",
    title: { vi: "Nhánh xuyên sâu và động mạch mạch mạc", en: "Deep Perforating and Choroidal Arteries", zh: "深穿支与脉络膜动脉" },
    latin: "Aa. centrales · A. choroidea anterior",
    intro: {
      vi: "Phần sâu của não (nhân nền, đồi thị, bao trong) không được nuôi bởi nhánh vỏ mà bởi các nhánh xuyên nhỏ tách thẳng từ vòng Willis và các thân động mạch lớn. Chúng là động mạch tận, không nối nhau. Tắc một nhánh xuyên gây nhồi máu nhỏ gọi là nhồi máu ổ khuyết. Ổ khuyết ở bao trong có thể gây liệt nửa người rất rõ dù ổ tổn thương chỉ vài milimét. Các động mạch mạch mạc nuôi đám rối mạch mạc tiết dịch não tuỷ. Mỗi nguồn một sắc đỏ; nhân nền và đồi thị mờ sẵn.",
      en: "The deep brain (basal nuclei, thalamus, internal capsule) is fed not by cortical branches but by small perforators arising directly from the circle of Willis and the large trunks. They are end arteries with no anastomoses. Blocking one causes a small infarct called a lacune. A lacune in the internal capsule can cause a dense hemiplegia even though it measures only a few millimetres. The choroidal arteries feed the choroid plexus, which secretes cerebrospinal fluid. Each source has its own shade of red; basal nuclei and thalamus are faded.",
      zh: "脑深部（基底核、丘脑、内囊）不由皮质支而由直接发自Willis环和大动脉干的细小穿支供血。它们是终动脉，无吻合。单支闭塞导致腔隙性梗死；内囊腔隙虽仅数毫米，也可引起明显偏瘫。脉络膜动脉供应分泌脑脊液的脉络丛。每个来源一种红色调；基底核和丘脑淡化。",
    },
  },
  faded: ["moc"],
  frame: ["van-dau", "mach-mac-truoc", "doi-thi", "mach-mac-sau"],
  groups: [
    {
      key: "van-dau",
      tint: "#d9534f",
      latin: "Aa. centrales anterolaterales (từ ĐM não giữa)",
      name: { vi: "Động mạch vân–đậu (từ não giữa)", en: "Lenticulostriate arteries (from the middle cerebral)", zh: "豆纹动脉（来自大脑中动脉）" },
      note: {
        vi: "Nuôi nhân bèo, phần lớn nhân đuôi và nhánh trước bao trong. Là nơi hay gặp xuất huyết não do tăng huyết áp.",
        en: "Feed the lentiform nucleus, most of the caudate and the anterior limb of the internal capsule; the classic site of hypertensive haemorrhage.",
        zh: "供应豆状核、尾状核大部和内囊前肢，是高血压性脑出血的好发部位。",
      },
      ids: A(`^anterolateral central branch of ${SIDE}middle cerebral artery$`),
    },
    {
      key: "mach-mac-truoc",
      tint: OXY,
      latin: "A. choroidea anterior",
      name: { vi: "Động mạch mạch mạc trước", en: "Anterior choroidal artery", zh: "脉络膜前动脉" },
      note: {
        vi: "Tách từ động mạch cảnh trong, nuôi đám rối mạch mạc sừng thái dương, dải thị và nhánh sau bao trong. Tắc nó gây liệt, mất cảm giác và mất nửa thị trường đối bên.",
        en: "From the internal carotid, it feeds the choroid plexus of the temporal horn, the optic tract and the posterior limb of the internal capsule. Occlusion gives opposite hemiplegia, hemianaesthesia and hemianopia.",
        zh: "发自颈内动脉，供应颞角脉络丛、视束和内囊后肢。闭塞致对侧偏瘫、偏身感觉障碍和偏盲。",
      },
      ids: A(`^${SIDE}anterior choroidal artery$|^branch of ${SIDE}anterior choroidal artery to posterior limb of ${SIDE}internal capsule$`),
    },
    {
      key: "doi-thi",
      tint: "#e8883d",
      latin: "Aa. thalamoperforantes · thalamogeniculatae · centrales posteromediales",
      name: { vi: "Nhánh xuyên đồi thị (từ não sau và thông sau)", en: "Thalamic perforators (from the posterior cerebral and posterior communicating)", zh: "丘脑穿支（来自大脑后动脉和后交通动脉）" },
      note: {
        vi: "Động mạch xuyên đồi thị, gối–đồi thị và trung tâm sau trong nuôi đồi thị và vùng dưới đồi. Nhồi máu đồi thị có thể gây đau dữ dội nửa người đối bên (hội chứng Dejerine–Roussy).",
        en: "The thalamoperforating, thalamogeniculate and posteromedial central arteries feed the thalamus and hypothalamus. A thalamic infarct can cause severe pain in the opposite half of the body (Dejerine–Roussy syndrome).",
        zh: "丘脑穿通动脉、丘脑膝状体动脉和后内侧中央动脉供应丘脑和下丘脑。丘脑梗死可致对侧半身剧痛（Dejerine–Roussy综合征）。",
      },
      ids: A(`^${SIDE}(thalamoperforating|thalamogeniculate) artery$|^posteromedial central branch of ${SIDE}posterior cerebral artery$|^hypothalamic branch of ${SIDE}posterior communicating artery$`),
    },
    {
      key: "mach-mac-sau",
      tint: "#e39a7a",
      latin: "A. choroidea posterior medialis",
      name: { vi: "Động mạch mạch mạc sau trong", en: "Posterior medial choroidal artery", zh: "脉络膜后内侧动脉" },
      note: {
        vi: "Từ động mạch não sau, nuôi đám rối mạch mạc não thất ba và mái não thất ba.",
        en: "From the posterior cerebral, it feeds the choroid plexus and roof of the third ventricle.",
        zh: "发自大脑后动脉，供应第三脑室脉络丛及其顶部。",
      },
      ids: A(`^${SIDE}posterior medial choroidal artery$`),
    },
    {
      key: "dam-roi",
      tint: "#9fb8a0",
      latin: "Plexus choroideus",
      name: { vi: "Đám rối mạch mạc não thất bên", en: "Choroid plexus of the lateral ventricle", zh: "侧脑室脉络丛" },
      note: {
        vi: "Tiết khoảng 500ml dịch não tuỷ mỗi ngày.",
        en: "Secretes about 500ml of cerebrospinal fluid a day.",
        zh: "每日分泌约500ml脑脊液。",
      },
      ids: byRe(/^choroid plexus of cerebral hemisphere$/i, ["sensory", "nervous"]),
    },
    {
      key: "moc",
      latin: "Nuclei basales · Thalamus · Capsula interna",
      name: { vi: "Nhân nền, đồi thị, bao trong (mốc)", en: "Basal nuclei, thalamus, internal capsule (landmarks)", zh: "基底核、丘脑、内囊（标志）" },
      note: {
        vi: "Mờ sẵn — vùng nuôi của các nhánh xuyên.",
        en: "Faded — the territory of the perforators.",
        zh: "淡化——穿支的供血区。",
      },
      ids: byRe(/^(left |right )?(caudate nucleus|putamen|globus pallidus|thalamus|internal capsule)$/i, NER),
    },
  ],
});

// ─────────── 5. Hệ đốt sống–thân nền và động mạch tiểu não (đổi chủ đề) ───────────
emit({
  file: "vertebrobasilar",
  script: "batch-c",
  exportName: "vertebrobasilarScene",
  header: 'Scene "Hệ đốt sống–thân nền và động mạch tiểu não" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Góc cầu–tiểu não" cũ: atlas không có dây VII, VIII và các dây sọ khác ở góc cầu–tiểu não.',
  scene: {
    slug: "goc-cau-tieu-nao",
    system: "cardiovascular",
    title: { vi: "Hệ đốt sống–thân nền và động mạch tiểu não", en: "The Vertebrobasilar System and Cerebellar Arteries", zh: "椎基底动脉系与小脑动脉" },
    latin: "Systema vertebrobasilare",
    intro: {
      vi: "Hai động mạch đốt sống đi qua lỗ lớn xương chẩm, chạy mặt trước hành não rồi hợp thành động mạch thân nền ở bờ dưới cầu não. Hệ này nuôi thân não, tiểu não và phần sau đại não. Mỗi tầng có một đôi động mạch tiểu não. Động mạch tiểu não sau dưới tách từ động mạch đốt sống, động mạch tiểu não trước dưới và động mạch tiểu não trên tách từ thân nền. Dọc thân nền còn có các nhánh cầu não. Tắc thân nền gây hội chứng khoá trong: tỉnh nhưng liệt tứ chi, chỉ còn cử động mắt dọc. Mỗi động mạch một sắc đỏ; thân não và tiểu não mờ sẵn.",
      en: "The two vertebral arteries pass through the foramen magnum, run up the front of the medulla and join as the basilar artery at the lower border of the pons. This system feeds the brainstem, cerebellum and back of the cerebrum. Each level has a pair of cerebellar arteries. The posterior inferior cerebellar comes from the vertebral; the anterior inferior and superior cerebellar come from the basilar. Pontine branches arise along the basilar. Basilar occlusion causes locked-in syndrome: the patient is awake but quadriplegic, able to move only the eyes vertically. Each artery has its own shade of red; brainstem and cerebellum are faded.",
      zh: "两侧椎动脉经枕骨大孔入颅，沿延髓前面上行，在脑桥下缘合成基底动脉。该系统供应脑干、小脑和大脑后部。每一平面有一对小脑动脉：小脑下后动脉发自椎动脉，小脑下前动脉和小脑上动脉发自基底动脉；沿基底动脉还有脑桥支。基底动脉闭塞致闭锁综合征：意识清醒但四肢瘫痪，仅能垂直运动眼球。每条动脉一种红色调；脑干和小脑淡化。",
    },
  },
  faded: ["nao"],
  frame: ["dot-song", "than-nen", "pica", "aica", "sca"],
  groups: [
    {
      key: "dot-song",
      tint: "#8f2d2d",
      latin: "A. vertebralis (pars intracranialis) · A. spinalis anterior",
      name: { vi: "Động mạch đốt sống và tuỷ sống trước", en: "Vertebral and anterior spinal arteries", zh: "椎动脉与脊髓前动脉" },
      note: {
        vi: "Hai nhánh nhỏ từ hai động mạch đốt sống hợp thành động mạch tuỷ sống trước, đi xuống khe giữa trước của tuỷ, nuôi 2/3 trước tuỷ sống.",
        en: "Small branches from both vertebrals unite as the anterior spinal artery, which descends in the anterior median fissure and supplies the front two-thirds of the spinal cord.",
        zh: "两侧椎动脉的小支合成脊髓前动脉，沿前正中裂下行，供应脊髓前2/3。",
      },
      ids: A(`^${SIDE}vertebral artery$|^${SIDE}anterior spinal artery$`),
    },
    {
      key: "than-nen",
      tint: OXY,
      latin: "A. basilaris · Aa. pontis",
      name: { vi: "Động mạch thân nền và nhánh cầu", en: "Basilar artery and pontine branches", zh: "基底动脉与脑桥支" },
      note: {
        vi: "Nằm trong rãnh nền mặt trước cầu não. Nhánh cầu trong và cầu ngoài xuyên thẳng vào cầu não.",
        en: "Lies in the basilar groove on the front of the pons. Medial and lateral pontine branches pierce straight into it.",
        zh: "位于脑桥前面的基底沟内。脑桥内、外侧支直接穿入脑桥。",
      },
      ids: A(`^basilar artery$|branch of ${SIDE}pontine artery$`),
    },
    {
      key: "pica",
      tint: "#e8883d",
      latin: "A. inferior posterior cerebelli (PICA)",
      name: { vi: "Động mạch tiểu não sau dưới", en: "Posterior inferior cerebellar artery (PICA)", zh: "小脑下后动脉（PICA）" },
      note: {
        vi: "Nhánh lớn nhất của động mạch đốt sống, uốn quanh hành não, nuôi mặt dưới tiểu não và phần ngoài hành não. Tắc nó gây hội chứng hành não ngoài (Wallenberg): chóng mặt, nuốt khó, mất cảm giác đau–nhiệt ở mặt cùng bên và thân đối bên.",
        en: "The largest branch of the vertebral; it loops round the medulla to the underside of the cerebellum and the lateral medulla. Occlusion gives lateral medullary (Wallenberg) syndrome: vertigo, dysphagia, loss of pain and temperature on the same side of the face and the opposite side of the body.",
        zh: "椎动脉最大分支，绕延髓至小脑下面和延髓外侧。闭塞致延髓背外侧（Wallenberg）综合征：眩晕、吞咽困难、同侧面部和对侧躯体痛温觉丧失。",
      },
      ids: A(`^${SIDE}posterior inferior cerebellar artery$`),
    },
    {
      key: "aica",
      tint: "#e6c14a",
      latin: "A. inferior anterior cerebelli (AICA)",
      name: { vi: "Động mạch tiểu não trước dưới", en: "Anterior inferior cerebellar artery (AICA)", zh: "小脑下前动脉（AICA）" },
      note: {
        vi: "Chạy qua góc cầu–tiểu não, sát dây VII và VIII, thường cho động mạch mê đạo vào tai trong. Tắc nó có thể gây điếc đột ngột kèm chóng mặt.",
        en: "Crosses the cerebellopontine angle beside nerves VII and VIII and often gives the labyrinthine artery to the inner ear. Occlusion can cause sudden deafness with vertigo.",
        zh: "经脑桥小脑角，紧邻面神经和前庭蜗神经，常发出迷路动脉入内耳。闭塞可致突发性耳聋伴眩晕。",
      },
      ids: A(`^anterior inferior cerebellar artery$`),
    },
    {
      key: "sca",
      tint: "#e39a7a",
      latin: "A. superior cerebelli et rami",
      name: { vi: "Động mạch tiểu não trên và nhánh", en: "Superior cerebellar artery and branches", zh: "小脑上动脉及分支" },
      note: {
        vi: "Tách ngay dưới chỗ chia đôi thân nền, chia nhánh trong (có nhánh nhộng trên) và nhánh ngoài, nuôi mặt trên tiểu não. Một quai của nó có thể đè vào rễ dây V, gây đau dây sinh ba.",
        en: "Arises just below the basilar bifurcation and divides into medial (with the superior vermian branch) and lateral branches to the upper cerebellum. A loop can press on the root of nerve V and cause trigeminal neuralgia.",
        zh: "在基底动脉分叉稍下方发出，分为内侧支（含上蚓支）和外侧支，供应小脑上面。其襻可压迫三叉神经根致三叉神经痛。",
      },
      ids: A(`^${SIDE}superior cerebellar artery$|branch of ${SIDE}superior cerebellar artery$|superior vermian branch`),
    },
    {
      key: "nao",
      latin: "Truncus encephali · Cerebellum",
      name: { vi: "Thân não và tiểu não (mốc)", en: "Brainstem and cerebellum (landmarks)", zh: "脑干与小脑（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: STEM(),
    },
  ],
});

// ─────────────────── 6. Nhân nền và bao trong (đổi chủ đề) ───────────────────
emit({
  file: "basal-nuclei",
  script: "batch-c",
  exportName: "basalNucleiScene",
  header: 'Scene "Nhân nền và bao trong" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Thân não đầy đủ" cũ (trùng nội dung với bài "Thân não"). Atlas thiếu nhân dưới đồi, chất đen.',
  scene: {
    slug: "than-nao-day-so-full",
    system: "nervous",
    title: { vi: "Nhân nền và bao trong", en: "The Basal Nuclei and Internal Capsule", zh: "基底核与内囊" },
    latin: "Nuclei basales · Capsula interna",
    intro: {
      vi: "Nhân nền là các khối chất xám nằm sâu trong bán cầu, điều hoà khởi động và dập tắt vận động. Nhân đuôi cong theo não thất bên. Nhân bèo gồm bèo sẫm ở ngoài và cầu nhạt ở trong. Nhân đuôi và bèo sẫm cùng gọi là thể vân. Bao trong là dải chất trắng hình chữ V kẹp giữa nhân đuôi, đồi thị và nhân bèo. Mọi đường vận động và cảm giác đi qua đây, nên một ổ nhồi máu nhỏ ở bao trong cũng gây liệt nửa người. Hạnh nhân nằm cuối đuôi nhân đuôi, thuộc hệ viền. Mỗi nhân một màu; não thất bên mờ sẵn.",
      en: "The basal nuclei are deep grey masses in the hemisphere that help start and stop movement. The caudate curves along the lateral ventricle. The lentiform nucleus is the putamen outside and the globus pallidus inside. The caudate and putamen together are the striatum. The internal capsule is a V-shaped band of white matter squeezed between the caudate, thalamus and lentiform. Every motor and sensory pathway passes through it, so even a small infarct there causes hemiplegia. The amygdala sits at the tip of the caudate tail and belongs to the limbic system. Each nucleus has its own colour; the lateral ventricles are faded.",
      zh: "基底核是大脑半球深部的灰质团块，调节运动的启动与终止。尾状核沿侧脑室弯曲；豆状核外为壳、内为苍白球；尾状核与壳合称纹状体。内囊是夹于尾状核、丘脑和豆状核之间的V形白质带，所有运动和感觉通路均经此，故内囊小梗死即可致偏瘫。杏仁体位于尾状核尾端，属边缘系统。每个核一种颜色；侧脑室淡化。",
    },
  },
  faded: ["nao-that"],
  frame: ["duoi", "beo-sam", "cau-nhat", "bao-trong", "doi-thi"],
  groups: [
    {
      key: "duoi",
      tint: "#5b9bd5",
      latin: "Nucleus caudatus",
      name: { vi: "Nhân đuôi", en: "Caudate nucleus", zh: "尾状核" },
      note: {
        vi: "Đầu to lồi vào sừng trán não thất bên, thân và đuôi uốn theo não thất. Teo đầu nhân đuôi là dấu hiệu của bệnh Huntington (múa giật).",
        en: "Its large head bulges into the frontal horn of the lateral ventricle; body and tail curve with the ventricle. Atrophy of the caudate head is the hallmark of Huntington's disease (chorea).",
        zh: "头部膨大突入侧脑室前角，体、尾沿侧脑室弯曲。尾状核头萎缩是亨廷顿病（舞蹈病）的特征。",
      },
      ids: byRe(/^(left |right )?caudate nucleus$/i, NER),
    },
    {
      key: "beo-sam",
      tint: "#e8883d",
      latin: "Putamen",
      name: { vi: "Bèo sẫm", en: "Putamen", zh: "壳" },
      note: {
        vi: "Phần ngoài của nhân bèo, cùng nhân đuôi nhận tín hiệu từ vỏ não và chất đen. Thiếu dopamin từ chất đen tới đây gây bệnh Parkinson. Đây cũng là vị trí xuất huyết não do tăng huyết áp hay gặp nhất.",
        en: "The outer part of the lentiform nucleus; with the caudate it receives input from the cortex and substantia nigra. Loss of nigral dopamine here causes Parkinson's disease. It is also the commonest site of hypertensive haemorrhage.",
        zh: "豆状核外侧部，与尾状核一起接受皮质和黑质的输入。黑质多巴胺缺失致帕金森病。也是高血压性脑出血最常见的部位。",
      },
      ids: byRe(/^(left |right )?putamen$/i, NER),
    },
    {
      key: "cau-nhat",
      tint: "#e6c14a",
      latin: "Globus pallidus",
      name: { vi: "Cầu nhạt", en: "Globus pallidus", zh: "苍白球" },
      note: {
        vi: "Phần trong của nhân bèo, nhạt màu vì nhiều sợi có myelin. Đây là đầu ra chính của nhân nền, về đồi thị.",
        en: "The inner part of the lentiform, pale from its many myelinated fibres. It is the main output of the basal nuclei, to the thalamus.",
        zh: "豆状核内侧部，因富含有髓纤维而色淡，是基底核的主要输出核，投射至丘脑。",
      },
      ids: byRe(/^(left |right )?globus pallidus$/i, NER),
    },
    {
      key: "bao-trong",
      tint: "#e3e0d6",
      latin: "Capsula interna",
      name: { vi: "Bao trong", en: "Internal capsule", zh: "内囊" },
      note: {
        vi: "Có trụ trước (giữa nhân đuôi và nhân bèo), gối, và trụ sau (giữa đồi thị và nhân bèo). Bó vỏ–gai đi ở trụ sau; bó vỏ–nhân đi ở gối.",
        en: "Has an anterior limb (between caudate and lentiform), a genu, and a posterior limb (between thalamus and lentiform). The corticospinal tract runs in the posterior limb, the corticobulbar in the genu.",
        zh: "分前肢（尾状核与豆状核之间）、膝和后肢（丘脑与豆状核之间）。皮质脊髓束行于后肢，皮质核束行于膝部。",
      },
      ids: byRe(/^(left |right )?internal capsule$/i, NER),
    },
    {
      key: "doi-thi",
      tint: "#b58bc4",
      latin: "Thalamus",
      name: { vi: "Đồi thị (mốc phía trong)", en: "Thalamus (medial landmark)", zh: "丘脑（内侧标志）" },
      note: {
        vi: "Không thuộc nhân nền nhưng là trạm trung chuyển của vòng nhân nền–đồi thị–vỏ não.",
        en: "Not a basal nucleus, but the relay in the basal ganglia–thalamus–cortex loop.",
        zh: "不属基底核，但为基底核–丘脑–皮质环路的中继站。",
      },
      ids: byRe(/^(left |right )?thalamus$/i, NER),
    },
    {
      key: "hanh-nhan",
      tint: "#d9534f",
      latin: "Corpus amygdaloideum",
      name: { vi: "Hạnh nhân", en: "Amygdala", zh: "杏仁体" },
      note: {
        vi: "Nằm trong cực thái dương, ở cuối đuôi nhân đuôi. Xử lý sợ hãi và cảm xúc; chức năng thuộc hệ viền.",
        en: "Lies in the temporal pole at the end of the caudate tail. It processes fear and emotion and belongs functionally to the limbic system.",
        zh: "位于颞极内、尾状核尾端。处理恐惧和情绪，功能上属边缘系统。",
      },
      ids: byRe(/^(left |right )?amygdala$/i, NER),
    },
    {
      key: "nao-that",
      latin: "Ventriculi laterales",
      name: { vi: "Não thất bên (mốc)", en: "Lateral ventricles (landmarks)", zh: "侧脑室（标志）" },
      note: {
        vi: "Mờ sẵn — thấy nhân đuôi uốn theo thành não thất.",
        en: "Faded — showing the caudate following the ventricular wall.",
        zh: "淡化——显示尾状核沿脑室壁弯曲。",
      },
      ids: byRe(/^(left |right )?lateral ventricle$/i),
    },
  ],
});

// ─────────────────── 7. Hồi và thùy vỏ đại não (đổi chủ đề) ───────────────────
emit({
  file: "cortex-gyri",
  script: "batch-c",
  exportName: "cortexGyriScene",
  header: 'Scene "Hồi và thùy vỏ đại não" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Tiểu não đầy đủ" cũ (trùng bài "Tiểu não"; atlas chỉ có một lưới tiểu não). Chỉ bán cầu trái.',
  scene: {
    slug: "tieu-nao-day-du",
    system: "nervous",
    title: { vi: "Hồi và thùy vỏ đại não", en: "Gyri and Lobes of the Cerebral Cortex", zh: "大脑皮质的脑回与脑叶" },
    latin: "Gyri et lobi cerebri",
    intro: {
      vi: "Vỏ đại não gấp nếp thành hồi và rãnh, nhờ vậy khoảng hai phần ba diện tích nằm khuất trong rãnh. Rãnh trung tâm chia thuỳ trán với thuỳ đỉnh. Rãnh bên tách thuỳ thái dương, và thuỳ đảo nằm sâu trong rãnh này. Thuỳ chẩm nằm sau. Scene dựng bán cầu trái, là bán cầu ưu thế ngôn ngữ ở đa số người, và tô mỗi thuỳ một tông màu. Nhờ vậy dễ định vị vùng vận động, cảm giác, ngôn ngữ, thị giác. Thể chai và thân não mờ sẵn.",
      en: "The cerebral cortex is folded into gyri and sulci, so about two-thirds of it lies hidden in the sulci. The central sulcus separates the frontal and parietal lobes. The lateral sulcus sets off the temporal lobe, and the insula lies deep within it. The occipital lobe lies behind. The scene shows the left hemisphere, dominant for language in most people, with one colour family per lobe. That makes the motor, sensory, language and visual areas easy to locate. The corpus callosum and brainstem are faded.",
      zh: "大脑皮质折叠成回和沟，约三分之二面积隐于沟内。中央沟分隔额叶和顶叶；外侧沟分出颞叶，岛叶深藏其中；枕叶位于后方。本场景显示左半球（多数人的语言优势半球），每个脑叶一种色系，便于定位运动、感觉、语言和视觉区。胼胝体和脑干淡化。",
    },
  },
  faded: ["moc"],
  frame: ["tran", "van-dong", "dinh", "thai-duong", "cham"],
  groups: [
    {
      key: "tran",
      tint: "#6f93b8",
      latin: "Gyri frontales superior, medius, inferior · Gyri orbitales",
      name: { vi: "Thuỳ trán: hồi trán trên, giữa, dưới, hồi ổ mắt", en: "Frontal lobe: superior, middle, inferior frontal and orbital gyri", zh: "额叶：额上、中、下回与眶回" },
      note: {
        vi: "Vỏ trước trán điều hành lập kế hoạch, kiềm chế và nhân cách. Hồi trán dưới bên trái chứa vùng Broca; tổn thương gây nói ngọng ngắt quãng nhưng vẫn hiểu lời.",
        en: "Prefrontal cortex governs planning, inhibition and personality. The left inferior frontal gyrus holds Broca's area; damage gives halting, effortful speech with comprehension preserved.",
        zh: "前额叶皮质司计划、抑制和人格。左额下回含Broca区，损伤致言语断续费力但理解保留。",
      },
      ids: leftSide(byRe(/^(left |right )?(superior|middle|inferior) frontal gyrus$|^orbital gyrus$/i, NER)),
    },
    {
      key: "van-dong",
      tint: "#d9534f",
      latin: "Gyrus precentralis",
      name: { vi: "Hồi trước trung tâm (vỏ vận động)", en: "Precentral gyrus (motor cortex)", zh: "中央前回（运动皮质）" },
      note: {
        vi: "Vỏ vận động chính, xếp theo người tí hon đảo ngược: chân ở mặt trong, tay và mặt ở mặt ngoài. Mỗi bán cầu điều khiển nửa người đối bên.",
        en: "The primary motor cortex, laid out as an upside-down homunculus: leg on the medial surface, hand and face on the lateral surface. Each hemisphere controls the opposite half of the body.",
        zh: "初级运动皮质，呈倒置小人排列：下肢在内侧面，手和面部在外侧面。每侧半球支配对侧半身。",
      },
      ids: leftSide(byRe(/^(left |right )?precentral gyrus$/i, NER)),
    },
    {
      key: "dinh",
      tint: "#e8883d",
      latin: "Gyrus postcentralis · Lobulus parietalis superior · Gyri supramarginalis et angularis",
      name: { vi: "Thuỳ đỉnh: hồi sau trung tâm, tiểu thuỳ đỉnh trên, hồi trên viền, hồi góc", en: "Parietal lobe: postcentral, superior parietal, supramarginal, angular", zh: "顶叶：中央后回、顶上小叶、缘上回、角回" },
      note: {
        vi: "Hồi sau trung tâm là vỏ cảm giác thân thể chính. Tiểu thuỳ đỉnh dưới (hồi trên viền, hồi góc) tích hợp ngôn ngữ đọc–viết. Tổn thương thuỳ đỉnh phải gây mất chú ý nửa người trái.",
        en: "The postcentral gyrus is the primary somatosensory cortex. The inferior parietal lobule (supramarginal and angular gyri) integrates reading and writing. Right parietal damage causes neglect of the left side.",
        zh: "中央后回为初级躯体感觉皮质。顶下小叶（缘上回、角回）整合读写功能。右顶叶损伤致左侧忽略。",
      },
      ids: leftSide(byRe(/^(left |right )?(postcentral gyrus|superior parietal lobule|supramarginal gyrus|angular gyrus)$/i, NER)),
    },
    {
      key: "thai-duong",
      tint: "#6fae7f",
      latin: "Gyri temporales superior, medius, inferior · Gyrus fusiformis",
      name: { vi: "Thuỳ thái dương: hồi thái dương trên, giữa, dưới, hồi hình thoi", en: "Temporal lobe: superior, middle, inferior temporal and fusiform gyri", zh: "颞叶：颞上、中、下回与梭状回" },
      note: {
        vi: "Hồi thái dương trên chứa vỏ thính giác và, ở phần sau bên trái, vùng Wernicke; tổn thương gây nói trôi chảy nhưng vô nghĩa và không hiểu lời. Hồi hình thoi nhận diện khuôn mặt.",
        en: "The superior temporal gyrus holds the auditory cortex and, posteriorly on the left, Wernicke's area; damage gives fluent but meaningless speech with poor comprehension. The fusiform gyrus recognises faces.",
        zh: "颞上回含听觉皮质，左侧后部为Wernicke区，损伤致言语流利但无意义、理解障碍。梭状回司面孔识别。",
      },
      ids: leftSide(byRe(/part of (left |right )?superior temporal gyrus$|^(left |right )?(middle|inferior) temporal gyrus$|^(left |right )?fusiform gyrus$/i, NER)),
    },
    {
      key: "dao",
      tint: "#e6c14a",
      latin: "Insula",
      name: { vi: "Thuỳ đảo", en: "Insula", zh: "岛叶" },
      note: {
        vi: "Nằm khuất dưới các nắp trán, đỉnh, thái dương. Xử lý vị giác, cảm giác nội tạng và nhận biết trạng thái cơ thể.",
        en: "Hidden beneath the frontal, parietal and temporal opercula. It handles taste, visceral sensation and awareness of the body's state.",
        zh: "隐于额、顶、颞盖之下。司味觉、内脏感觉及对身体状态的觉知。",
      },
      ids: leftSide(byRe(/^(left |right )?insula$/i, NER)),
    },
    {
      key: "cham",
      tint: "#b58bc4",
      latin: "Lobus occipitalis",
      name: { vi: "Thuỳ chẩm (vỏ thị giác)", en: "Occipital lobe (visual cortex)", zh: "枕叶（视皮质）" },
      note: {
        vi: "Vỏ thị giác chính nằm hai bờ rãnh cựa ở mặt trong. Bán cầu trái nhận nửa thị trường phải của cả hai mắt.",
        en: "The primary visual cortex lines the calcarine sulcus on the medial surface. The left hemisphere receives the right visual field of both eyes.",
        zh: "初级视皮质位于内侧面距状沟两岸。左半球接收双眼右侧视野。",
      },
      ids: leftSide(byRe(/^(left |right )?occipital lobe$/i, NER)),
    },
    {
      key: "vien",
      tint: "#c98bb0",
      latin: "Gyrus cinguli · Gyrus parahippocampalis",
      name: { vi: "Hồi đai và hồi cạnh hải mã (mặt trong)", en: "Cingulate and parahippocampal gyri (medial surface)", zh: "扣带回与海马旁回（内侧面）" },
      note: {
        vi: "Hai hồi ôm quanh thể chai và thân não thành thuỳ viền, liên quan cảm xúc và trí nhớ.",
        en: "Arching round the corpus callosum and brainstem, they form the limbic lobe, involved in emotion and memory.",
        zh: "环绕胼胝体和脑干构成边缘叶，与情绪和记忆有关。",
      },
      ids: leftSide(byRe(/^(left |right )?(cingulate|parahippocampal) gyrus$/i, NER)),
    },
    {
      key: "moc",
      latin: "Corpus callosum · Truncus encephali · Cerebellum",
      name: { vi: "Thể chai, thân não, tiểu não (mốc)", en: "Corpus callosum, brainstem, cerebellum (landmarks)", zh: "胼胝体、脑干、小脑（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: byRe(/^corpus callosum$/i, NER).concat(STEM()),
    },
  ],
});

// ─────────────── 8. Thể chai và các mép liên bán cầu (đổi chủ đề) ───────────────
emit({
  file: "commissures",
  script: "batch-c",
  exportName: "commissuresScene",
  header: 'Scene "Thể chai và các mép liên bán cầu" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Cơ mặt và thần kinh VII" cũ: atlas không có cơ bám da mặt và dây VII.',
  scene: {
    slug: "co-mat-than-kinh-vii",
    system: "nervous",
    title: { vi: "Thể chai, vòm não và các mép liên bán cầu", en: "Corpus Callosum, Fornix and Commissures", zh: "胼胝体、穹窿与连合" },
    latin: "Commissurae telencephali",
    intro: {
      vi: "Hai bán cầu trao đổi thông tin qua các bó sợi bắt ngang đường giữa, gọi là mép. Lớn nhất là thể chai, gồm khoảng 200 triệu sợi, chia thành mỏ, gối, thân và lồi. Mép trước nối hai thuỳ thái dương và vùng khứu. Mép sau nằm trên cống não, dùng cho phản xạ đồng tử. Vòm não là bó ra của hải mã, uốn cong dưới thể chai rồi tận ở thể vú. Hai trụ vòm nối nhau qua mép vòm. Vách trong suốt căng giữa thể chai và vòm. Mỗi cấu trúc một màu; não thất bên mờ sẵn.",
      en: "The two hemispheres communicate through bundles of fibres crossing the midline, called commissures. The largest is the corpus callosum, about 200 million fibres, divided into rostrum, genu, body and splenium. The anterior commissure links the temporal lobes and olfactory areas. The posterior commissure lies above the cerebral aqueduct and serves the pupillary reflex. The fornix is the output tract of the hippocampus, arching beneath the corpus callosum to end in the mammillary bodies. Its two crura are joined by the commissure of the fornix. The septum pellucidum stretches between the corpus callosum and fornix. Each structure has its own colour; the lateral ventricles are faded.",
      zh: "两半球经跨越中线的纤维束（连合）交换信息。最大者为胼胝体，约2亿根纤维，分嘴、膝、干、压部。前连合连接两侧颞叶和嗅区；后连合位于中脑水管上方，参与瞳孔反射。穹窿是海马的传出束，在胼胝体下方弓形走行，止于乳头体；两侧穹窿脚借穹窿连合相连。透明隔张于胼胝体与穹窿之间。每个结构一种颜色；侧脑室淡化。",
    },
  },
  faded: ["nao-that"],
  frame: ["the-chai", "vom", "mep", "vach"],
  groups: [
    {
      key: "the-chai",
      tint: "#e3e0d6",
      latin: "Corpus callosum",
      name: { vi: "Thể chai", en: "Corpus callosum", zh: "胼胝体" },
      note: {
        vi: "Cắt thể chai từng được dùng chữa động kinh kháng thuốc. Người bệnh sau mổ không gọi được tên vật cầm ở tay trái khi nhắm mắt, vì thông tin không sang được bán cầu ngôn ngữ (hội chứng tách não).",
        en: "Cutting it was once used to treat drug-resistant epilepsy. Afterwards, patients cannot name an object held in the left hand with eyes closed, because the information cannot reach the language hemisphere (split-brain syndrome).",
        zh: "胼胝体切开术曾用于治疗药物难治性癫痫。术后患者闭眼时无法说出左手所持物体名称，因信息不能传至语言半球（裂脑综合征）。",
      },
      ids: byRe(/^corpus callosum$/i, NER),
    },
    {
      key: "vom",
      tint: "#b58bc4",
      latin: "Fornix · Commissura fornicis",
      name: { vi: "Vòm não và mép vòm", en: "Fornix and its commissure", zh: "穹窿与穹窿连合" },
      note: {
        vi: "Mắt xích của vòng Papez (hải mã → vòm → thể vú → đồi thị → hồi đai). Tổn thương hai bên gây mất trí nhớ mới.",
        en: "A link in the Papez circuit (hippocampus → fornix → mammillary body → thalamus → cingulate gyrus). Bilateral damage impairs forming new memories.",
        zh: "Papez环路的一环（海马→穹窿→乳头体→丘脑→扣带回）。双侧损伤致近记忆障碍。",
      },
      ids: byRe(/^(left |right )?fornix of forebrain$|^commissure of fornix of forebrain$/i, NER),
    },
    {
      key: "mep",
      tint: "#e8883d",
      latin: "Commissura anterior · Commissura posterior · Commissura habenularum",
      name: { vi: "Mép trước, mép sau và cuống tùng", en: "Anterior, posterior and habenular commissures", zh: "前连合、后连合与缰连合" },
      note: {
        vi: "Mép trước và mép sau là hai mốc dựng hệ toạ độ chuẩn (đường AC–PC) trong chụp và phẫu thuật định vị não.",
        en: "The anterior and posterior commissures are the two landmarks of the standard AC–PC coordinate line used in brain imaging and stereotactic surgery.",
        zh: "前、后连合是脑成像和立体定向手术中标准AC–PC坐标线的两个标志。",
      },
      ids: byRe(/^(anterior|posterior) commissure$|^habenula$/i, NER),
    },
    {
      key: "vach",
      tint: "#9fb8a0",
      latin: "Septum pellucidum · Lamina terminalis",
      name: { vi: "Vách trong suốt và mảnh cùng", en: "Septum pellucidum and lamina terminalis", zh: "透明隔与终板" },
      note: {
        vi: "Vách trong suốt ngăn sừng trán hai não thất bên. Mảnh cùng là thành trước não thất ba, đánh dấu đầu mút ống thần kinh phôi.",
        en: "The septum pellucidum divides the frontal horns of the two lateral ventricles. The lamina terminalis is the front wall of the third ventricle, marking the end of the embryonic neural tube.",
        zh: "透明隔分隔两侧侧脑室前角。终板为第三脑室前壁，标志胚胎神经管的末端。",
      },
      ids: byRe(/^septum of telencephalon$|^lamina terminalis$/i, NER),
    },
    {
      key: "the-vu",
      tint: "#d9534f",
      latin: "Corpora mammillaria",
      name: { vi: "Thể vú (tận của vòm)", en: "Mammillary bodies (end of the fornix)", zh: "乳头体（穹窿终点）" },
      note: {
        vi: "Teo thể vú gặp trong hội chứng Wernicke–Korsakoff do thiếu vitamin B1 ở người nghiện rượu.",
        en: "Mammillary atrophy is seen in Wernicke–Korsakoff syndrome from thiamine deficiency in alcoholism.",
        zh: "酒精中毒维生素B1缺乏所致Wernicke–Korsakoff综合征可见乳头体萎缩。",
      },
      ids: byRe(/^mammillary body$/i, NER),
    },
    {
      key: "hai-ma",
      tint: "#c98bb0",
      latin: "Hippocampus",
      name: { vi: "Hải mã (gốc của vòm)", en: "Hippocampus (origin of the fornix)", zh: "海马（穹窿起点）" },
      note: {
        vi: "Nằm ở sàn sừng thái dương não thất bên. Là nơi đầu tiên teo trong bệnh Alzheimer.",
        en: "Lies in the floor of the temporal horn of the lateral ventricle and is the first region to shrink in Alzheimer's disease.",
        zh: "位于侧脑室下角底，阿尔茨海默病中最早萎缩。",
      },
      ids: byRe(/^(left |right )?hippocampus$/i, NER),
    },
    {
      key: "nao-that",
      latin: "Ventriculi laterales et tertius",
      name: { vi: "Não thất bên và não thất ba (mốc)", en: "Lateral and third ventricles (landmarks)", zh: "侧脑室与第三脑室（标志）" },
      note: {
        vi: "Mờ sẵn — thể chai làm mái, vòm làm bờ trong của não thất bên.",
        en: "Faded — the corpus callosum forms the roof, and the fornix the medial edge, of the lateral ventricle.",
        zh: "淡化——胼胝体构成侧脑室顶，穹窿构成其内侧缘。",
      },
      ids: byRe(/^(left |right )?lateral ventricle$|^third ventricle$/i),
    },
  ],
});

// ─────────────── 9. Xương móng và cơ trên–dưới móng (đổi chủ đề) ───────────────
emit({
  file: "hyoid-muscles",
  script: "batch-c",
  exportName: "hyoidMusclesScene",
  header: 'Scene "Xương móng và cơ trên–dưới móng" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Hạch cổ" cũ: atlas không có hạch bạch huyết.',
  scene: {
    slug: "hach-co",
    system: "muscular",
    title: { vi: "Xương móng và cơ trên–dưới móng", en: "The Hyoid and Supra- and Infrahyoid Muscles", zh: "舌骨与舌骨上、下肌群" },
    latin: "Os hyoideum · Mm. suprahyoidei et infrahyoidei",
    intro: {
      vi: "Xương móng hình chữ U, là xương duy nhất không khớp với xương nào khác, treo giữa hàm dưới và thanh quản bằng hai nhóm cơ. Nhóm trên móng (hai bụng, trâm–móng, hàm–móng, cằm–móng) nâng xương móng và làm sàn miệng. Nhóm dưới móng, gọi là cơ dải (ức–móng, ức–giáp, giáp–móng, vai–móng), hạ xương móng và thanh quản. Hai nhóm phối hợp khi nuốt và nói. Mỗi nhóm một tông màu; xương hàm, sọ và cột sống cổ mờ sẵn.",
      en: "The U-shaped hyoid is the only bone that articulates with no other bone; it hangs between the mandible and larynx on two groups of muscles. The suprahyoids (digastric, stylohyoid, mylohyoid, geniohyoid) raise the hyoid and form the floor of the mouth. The infrahyoids, or strap muscles (sternohyoid, sternothyroid, thyrohyoid, omohyoid), lower the hyoid and larynx. The two groups work together in swallowing and speech. Each group has its own colour family; mandible, skull and cervical spine are faded.",
      zh: "U形舌骨是唯一不与其他骨相关节的骨，借两组肌肉悬于下颌骨与喉之间。舌骨上肌群（二腹肌、茎突舌骨肌、下颌舌骨肌、颏舌骨肌）上提舌骨并构成口底；舌骨下肌群即带状肌（胸骨舌骨肌、胸骨甲状肌、甲状舌骨肌、肩胛舌骨肌）下降舌骨和喉。两组在吞咽和发音时协同。每组一种色系；下颌骨、颅骨和颈椎淡化。",
    },
  },
  faded: ["moc"],
  frame: ["mong", "tren", "duoi"],
  groups: [
    {
      key: "mong",
      tint: "#d9cfb8",
      latin: "Os hyoideum · Cartilago thyroidea",
      name: { vi: "Xương móng và sụn giáp", en: "Hyoid bone and thyroid cartilage", zh: "舌骨与甲状软骨" },
      note: {
        vi: "Gãy xương móng gợi ý bị bóp cổ trong pháp y. Màng giáp–móng nối xương móng với sụn giáp.",
        en: "A fractured hyoid suggests manual strangulation in forensic practice. The thyrohyoid membrane joins it to the thyroid cartilage.",
        zh: "法医学中舌骨骨折提示扼颈。甲状舌骨膜连接舌骨与甲状软骨。",
      },
      ids: byRe(/^hyoid bone$|^thyroid cartilage$/i, BONE).concat(byRe(/thyrohyoid (membrane|ligament)$/i, ["connective"])),
    },
    {
      key: "tren",
      tint: "#e8883d",
      latin: "Mm. digastricus, stylohyoideus, mylohyoideus, geniohyoideus",
      name: { vi: "Nhóm trên móng", en: "Suprahyoid group", zh: "舌骨上肌群" },
      note: {
        vi: "Cơ hai bụng có gân trung gian treo vào xương móng qua quai xơ. Cơ hàm–móng là sàn miệng thật sự. Nhóm này kéo xương móng lên trước khi nuốt, mở lối vào thực quản.",
        en: "Digastric has an intermediate tendon slung to the hyoid by a fibrous loop. Mylohyoid is the true floor of the mouth. The group pulls the hyoid up and forward in swallowing, opening the way into the oesophagus.",
        zh: "二腹肌中间腱借纤维襻悬于舌骨。下颌舌骨肌构成真正的口底。吞咽时此组肌将舌骨拉向前上，开放食管入口。",
      },
      ids: byRe(/^(left |right )?(digastric|stylohyoid|mylohyoid|geniohyoid)$/i, MU).concat(byRe(/intermediate tendon$/i, ["connective"])),
    },
    {
      key: "duoi",
      tint: "#6f93b8",
      latin: "Mm. sternohyoideus, sternothyroideus, thyrohyoideus, omohyoideus",
      name: { vi: "Nhóm dưới móng (cơ dải)", en: "Infrahyoid (strap) group", zh: "舌骨下肌群（带状肌）" },
      note: {
        vi: "Do quai cổ chi phối. Khi mổ tuyến giáp phải tách đường giữa hai cơ ức–móng để vào tuyến. Cơ vai–móng có hai bụng, bắt chéo trước bó mạch cảnh.",
        en: "Supplied by the ansa cervicalis. In thyroid surgery the surgeon splits the midline between the sternohyoids to reach the gland. Omohyoid has two bellies and crosses in front of the carotid sheath.",
        zh: "受颈袢支配。甲状腺手术需沿两侧胸骨舌骨肌之间的中线分开进入。肩胛舌骨肌有两个肌腹，斜跨颈动脉鞘前方。",
      },
      ids: byRe(/^(left |right )?(sternohyoid|sternothyroid|thyrohyoid|omohyoid)$/i, MU),
    },
    {
      key: "moc",
      latin: "Mandibula · Os temporale · Vertebrae cervicales · Sternum",
      name: { vi: "Xương hàm dưới, thái dương, đốt cổ, xương ức (mốc)", en: "Mandible, temporal bones, cervical vertebrae, sternum (landmarks)", zh: "下颌骨、颞骨、颈椎、胸骨（标志）" },
      note: {
        vi: "Mờ sẵn — thấy các điểm treo của hai nhóm cơ.",
        en: "Faded — showing where the two groups are anchored.",
        zh: "淡化——显示两组肌肉的附着点。",
      },
      ids: byRe(/^mandible$|^(left |right )?temporal bone$|^(third|fourth|fifth|sixth|seventh) cervical vertebra$|^manubrium of sternum$/i, BONE),
    },
  ],
});
