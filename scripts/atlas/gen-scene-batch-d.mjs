/**
 * Đợt 4D — đầu, cổ, thần kinh trung ương (bài giữ nguyên chủ đề), dựng từ
 * atlas BodyParts3D. Chạy: node scripts/atlas/gen-scene-batch-d.mjs
 *
 * Hốc mắt chỉ lấy bên TRÁI (bẫy #13: lưới mắt phải lỗi). Bài nào atlas thiếu
 * cấu trúc thì nói rõ trong intro, không vẽ thay bằng cấu trúc khác.
 */
import { byRe, emit, leftSide, P, OXY, DEOXY } from "./lib.mjs";

/** Đỉnh tuyến yên (m) — mốc đặt lát cắt nền sọ ngay trên hố yên. */
const PITUITARY_TOP = P.find((p) => p.name === "Pituitary gland").bounds[1][1];

const ART = ["arterial"];
const VEN = ["venous"];
const NER = ["nervous"];
const BONE = ["skeletal"];
const MU = ["muscular", "skeletal", "respiratory"];
const SIDE = "(left |right )?";
const A = (s) => byRe(new RegExp(s, "i"), ART);
const STEM = () => byRe(/^(midbrain|pons|medulla oblongata|cerebellum)$/i, NER);
const TEETH = () => byRe(/secondary (molar|premolar|incisor|canine) tooth$/i, BONE);

// ───────────────────────── 1. Giải phẫu đầu (tổng quan) ─────────────────────────
emit({
  file: "head-overview",
  script: "batch-d",
  exportName: "headOverviewScene",
  header: 'Scene "Giải phẫu đầu" (tổng quan) dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu cơ mặt, cơ nhai, tuyến mang tai, tai và xoang tĩnh mạch.',
  scene: {
    slug: "giai-phau-dau",
    title: { vi: "Giải phẫu đầu: tổng quan theo lớp", en: "Anatomy of the Head: an Overview by Layer", zh: "头部解剖：分层概览" },
    latin: "Caput",
    intro: {
      vi: "Đầu gồm hai phần: sọ não bọc và bảo vệ não, sọ mặt làm khung cho mắt, mũi, miệng. Scene đi từ ngoài vào trong. Lớp ngoài là xương sọ não (trán, đỉnh, chẩm, thái dương, bướm, sàng) và xương sọ mặt (hàm trên, gò má, mũi, hàm dưới). Tiếp theo là não, gồm đại não, tiểu não và thân não, cùng các mạch não. Sau đó là mắt, răng, lưỡi và hầu. Có thể làm mờ lớp xương để nhìn vào trong. Bộ dữ liệu không có cơ mặt, cơ nhai, tuyến mang tai và tai; các phần này có ở bài chuyên đề khác nếu atlas đủ dữ liệu.",
      en: "The head has two parts: the neurocranium, which encloses and protects the brain, and the viscerocranium, which frames the eyes, nose and mouth. The scene works from outside in. The outer layer is the bones of the neurocranium (frontal, parietal, occipital, temporal, sphenoid, ethmoid) and of the face (maxilla, zygomatic, nasal, mandible). Next comes the brain, with cerebrum, cerebellum and brainstem, and its arteries. Then come the eyes, teeth, tongue and pharynx. Fade the bone layer to look inside. The dataset has no facial or masticatory muscles, parotid gland or ear; these are covered in other topic scenes where the atlas has the data.",
      zh: "头部分两部分：脑颅包裹保护脑，面颅构成眼、鼻、口的支架。本场景由外向内：外层为脑颅骨（额、顶、枕、颞、蝶、筛骨）和面颅骨（上颌、颧、鼻、下颌骨）；其次为脑（大脑、小脑、脑干）及脑血管；再为眼、牙、舌和咽。可将骨层淡化以观察内部。数据集中无面肌、咀嚼肌、腮腺和耳，这些在atlas数据充足时另有专题场景。",
    },
  },
  frame: ["so-nao", "so-mat"],
  groups: [
    {
      key: "so-nao",
      tint: "#d9cfb8",
      latin: "Neurocranium",
      name: { vi: "Sọ não", en: "Neurocranium", zh: "脑颅" },
      note: {
        vi: "Tám xương: trán, hai đỉnh, chẩm, hai thái dương, bướm, sàng. Chỗ bốn xương trán, đỉnh, thái dương, bướm gặp nhau là điểm pterion, vùng xương mỏng nhất; ngay dưới là động mạch màng não giữa. Chấn thương ở đây dễ gây máu tụ ngoài màng cứng.",
        en: "Eight bones: frontal, two parietals, occipital, two temporals, sphenoid, ethmoid. The pterion, where frontal, parietal, temporal and sphenoid meet, is the thinnest spot, with the middle meningeal artery right beneath. A blow here readily causes an extradural haematoma.",
        zh: "八块骨：额骨、两顶骨、枕骨、两颞骨、蝶骨、筛骨。额、顶、颞、蝶四骨交会处为翼点，骨质最薄，其下为脑膜中动脉，此处外伤易致硬膜外血肿。",
      },
      ids: byRe(/^(frontal bone|occipital bone|sphenoid bone|ethmoid)$|^(left |right )?(parietal|temporal) bone$/i, BONE),
    },
    {
      key: "so-mat",
      tint: "#e6d7b0",
      latin: "Viscerocranium",
      name: { vi: "Sọ mặt", en: "Viscerocranium (facial skeleton)", zh: "面颅" },
      note: {
        vi: "Hàm trên, gò má, mũi, lệ, khẩu cái, xoăn mũi dưới (mỗi thứ một đôi), cùng xương lá mía và hàm dưới. Hàm dưới là xương duy nhất của đầu cử động được.",
        en: "Paired maxillae, zygomatic, nasal, lacrimal, palatine and inferior nasal conchae, plus the vomer and mandible. The mandible is the only movable bone of the head.",
        zh: "成对的上颌骨、颧骨、鼻骨、泪骨、腭骨、下鼻甲，以及犁骨和下颌骨。下颌骨是头部唯一可动的骨。",
      },
      ids: byRe(/^(left |right )?(maxilla|zygomatic bone|nasal bone|lacrimal bone|palatine bone|inferior nasal concha)$|^(vomer|mandible)$/i, ["skeletal", "sensory", "respiratory"]),
    },
    {
      key: "dai-nao",
      tint: "#e8b4b8",
      latin: "Cerebrum",
      name: { vi: "Đại não", en: "Cerebrum", zh: "大脑" },
      note: {
        vi: "Chiếm khoảng 85% khối lượng não. Hai bán cầu nối qua thể chai.",
        en: "About 85% of brain mass; the two hemispheres are joined by the corpus callosum.",
        zh: "约占脑重的85%，两半球借胼胝体相连。",
      },
      ids: byRe(/^white matter of (left |right )?cerebral hemisphere$|gyrus$|^(left |right )?(insula|occipital lobe|superior parietal lobule)$|^orbital gyrus$/i, NER),
    },
    {
      key: "tieu-than",
      tint: "#c98bb0",
      latin: "Cerebellum · Truncus encephali",
      name: { vi: "Tiểu não và thân não", en: "Cerebellum and brainstem", zh: "小脑与脑干" },
      note: {
        vi: "Tiểu não nằm trong hố sọ sau dưới lều tiểu não. Thân não nối đại não với tuỷ sống và chứa nhân các dây sọ III–XII.",
        en: "The cerebellum lies in the posterior cranial fossa under the tentorium. The brainstem links cerebrum and spinal cord and holds the nuclei of cranial nerves III–XII.",
        zh: "小脑位于小脑幕下的颅后窝。脑干连接大脑与脊髓，含第III–XII对脑神经核。",
      },
      ids: STEM(),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "Aa. carotides internae · vertebrales · circulus arteriosus",
      name: { vi: "Động mạch não", en: "Cerebral arteries", zh: "脑动脉" },
      note: {
        vi: "Hai động mạch cảnh trong và hai động mạch đốt sống nối nhau thành vòng Willis ở nền não. Não chỉ nặng khoảng 2% cơ thể nhưng nhận khoảng 15% cung lượng tim.",
        en: "Two internal carotids and two vertebrals join in the circle of Willis at the base of the brain. The brain is about 2% of body weight but receives about 15% of cardiac output.",
        zh: "两侧颈内动脉和椎动脉在脑底吻合成Willis环。脑重约占体重2%，却接受约15%的心输出量。",
      },
      ids: A(`^${SIDE}(internal carotid|vertebral|anterior cerebral|posterior communicating) artery$|^basilar artery$|^anterior communicating artery$|part of ${SIDE}(middle|posterior) cerebral artery$`),
    },
    {
      key: "mat",
      tint: "#6f93b8",
      latin: "Bulbus oculi · Mm. bulbi",
      name: { vi: "Nhãn cầu và cơ vận nhãn (bên trái)", en: "Eyeball and extraocular muscles (left)", zh: "眼球与眼外肌（左侧）" },
      note: {
        vi: "Chỉ dựng mắt trái vì lưới mắt phải của bộ dữ liệu bị lỗi. Bài Hốc mắt có chi tiết hơn.",
        en: "Only the left eye is shown because the dataset's right-eye meshes are faulty. See the Orbit scene for detail.",
        zh: "因数据集右眼网格有误，仅显示左眼。详见眼眶场景。",
      },
      ids: leftSide(byRe(/^(left |right )?(sclera|cornea|iris|lens|vitreous body|(superior|inferior|medial|lateral) rectus|(superior|inferior) oblique)$/i, ["sensory", "muscular"])),
    },
    {
      key: "mieng",
      tint: "#e8883d",
      latin: "Dentes · Lingua · Pharynx",
      name: { vi: "Răng, lưỡi và hầu", en: "Teeth, tongue and pharynx", zh: "牙、舌与咽" },
      note: {
        vi: "Hầu là ngã tư của đường thở và đường ăn. Các cơ khít hầu đẩy viên thức ăn xuống thực quản.",
        en: "The pharynx is the crossroads of airway and foodway; its constrictors push the bolus into the oesophagus.",
        zh: "咽是呼吸道与消化道的交叉口，咽缩肌将食团推入食管。",
      },
      ids: TEETH().concat(byRe(/^tongue$|pharyngeal constrictor$/i, ["digestive", "respiratory"])),
    },
  ],
});

// ───────────────────────── 2. Thân não ─────────────────────────
emit({
  file: "brainstem",
  script: "batch-d",
  exportName: "brainstemScene",
  header: 'Scene "Thân não" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu các dây thần kinh sọ III–XII (chỉ có dây II, IV và nhánh dây III trong hốc mắt).',
  scene: {
    slug: "than-nao-day-so",
    title: { vi: "Thân não: trung não, cầu não, hành não", en: "The Brainstem: Midbrain, Pons, Medulla", zh: "脑干：中脑、脑桥、延髓" },
    latin: "Truncus encephali",
    intro: {
      vi: "Thân não dài chỉ khoảng 7cm, nối đại não với tuỷ sống, gồm trung não, cầu não và hành não. Mọi đường vận động và cảm giác đi qua đây. Thân não chứa nhân các dây sọ III–XII, trung tâm hô hấp, tim mạch và hệ lưới giữ tỉnh táo. Vì thế một ổ tổn thương nhỏ ở thân não cũng có thể gây hôn mê hoặc tử vong. Mặt sau trung não có bốn củ não sinh tư (hai trên cho thị giác, hai dưới cho thính giác). Cống não đi qua trung não, nối não thất ba với não thất bốn. Mỗi tầng một màu; tiểu não và động mạch thân nền mờ sẵn. Bộ dữ liệu không có các dây thần kinh sọ bám thân não.",
      en: "The brainstem is only about 7cm long and links cerebrum to spinal cord; it comprises midbrain, pons and medulla. Every motor and sensory pathway passes through it. It holds the nuclei of cranial nerves III–XII, the respiratory and cardiovascular centres and the reticular activating system that keeps us awake. So a small lesion here can cause coma or death. On the back of the midbrain are the four colliculi (the superior pair for vision, the inferior pair for hearing). The cerebral aqueduct runs through the midbrain, joining the third and fourth ventricles. Each level has its own colour; the cerebellum and basilar artery are faded. The dataset has no cranial nerve roots on the brainstem.",
      zh: "脑干长约7cm，连接大脑与脊髓，由中脑、脑桥和延髓组成。所有运动和感觉通路均经此。脑干含第III–XII对脑神经核、呼吸与心血管中枢及维持清醒的网状激活系统，故小病灶即可致昏迷或死亡。中脑背面有四个丘（上丘司视觉，下丘司听觉）。中脑水管贯穿中脑，连接第三、第四脑室。每层一种颜色；小脑和基底动脉淡化。数据集中无附着于脑干的脑神经。",
    },
  },
  faded: ["tieu-nao", "than-nen"],
  frame: ["trung-nao", "cau", "hanh"],
  groups: [
    {
      key: "trung-nao",
      tint: "#b58bc4",
      latin: "Mesencephalon · Pedunculi cerebri · Fossa interpeduncularis",
      name: { vi: "Trung não và cuống đại não", en: "Midbrain and cerebral peduncles", zh: "中脑与大脑脚" },
      note: {
        vi: "Cuống đại não mang bó vỏ–gai xuống. Dây III thoát ra ở hố gian cuống. Thoát vị móc hải mã đè vào cuống và dây III, gây giãn đồng tử cùng bên, là dấu hiệu nguy hiểm trong chấn thương sọ não.",
        en: "The peduncles carry the corticospinal tracts down. Nerve III emerges in the interpeduncular fossa. Uncal herniation presses on the peduncle and nerve III, dilating the pupil on the same side — a danger sign in head injury.",
        zh: "大脑脚内有皮质脊髓束下行。动眼神经自脚间窝穿出。钩回疝压迫大脑脚和动眼神经致同侧瞳孔散大，是颅脑外伤的危险征象。",
      },
      ids: byRe(/^(midbrain|peduncle of midbrain|interpeduncular fossa)$/i, NER),
    },
    {
      key: "cu",
      tint: "#e6c14a",
      latin: "Colliculi superiores et inferiores · Brachia",
      name: { vi: "Củ não sinh tư và cánh tay củ", en: "Colliculi and their brachia", zh: "上丘、下丘及其臂" },
      note: {
        vi: "Củ trên điều khiển phản xạ nhìn, nối với thể gối ngoài qua cánh tay củ trên. Củ dưới là trạm thính giác, nối với thể gối trong qua cánh tay củ dưới.",
        en: "The superior colliculi drive visual reflexes and connect to the lateral geniculate body by the superior brachium. The inferior colliculi are an auditory relay, connected to the medial geniculate body by the inferior brachium.",
        zh: "上丘司视觉反射，借上丘臂连外侧膝状体；下丘为听觉中继，借下丘臂连内侧膝状体。",
      },
      ids: byRe(/^(left |right )?(superior|inferior) colliculus$|^brachium of (left |right )?(superior|inferior) colliculus$|^(left |right )?(medial|lateral) geniculate body$/i, NER),
    },
    {
      key: "cau",
      tint: "#e8883d",
      latin: "Pons",
      name: { vi: "Cầu não", en: "Pons", zh: "脑桥" },
      note: {
        vi: "Phần bụng phình to chứa nhân cầu, chuyển tín hiệu từ vỏ não sang tiểu não. Chứa nhân dây V–VIII. Xuất huyết cầu não gây đồng tử co nhỏ như đầu kim và hôn mê sâu.",
        en: "Its bulging ventral part holds the pontine nuclei, relaying cortex to cerebellum. It houses the nuclei of nerves V–VIII. A pontine haemorrhage gives pinpoint pupils and deep coma.",
        zh: "膨大的腹侧部含脑桥核，将皮质信息传至小脑；含第V–VIII对脑神经核。脑桥出血致针尖样瞳孔和深昏迷。",
      },
      ids: byRe(/^pons$/i, NER),
    },
    {
      key: "hanh",
      tint: "#d9534f",
      latin: "Medulla oblongata",
      name: { vi: "Hành não", en: "Medulla oblongata", zh: "延髓" },
      note: {
        vi: "Có tháp hành, nơi bó vỏ–gai bắt chéo sang bên đối diện. Chứa trung tâm hô hấp, tim mạch và nhân dây IX–XII. Tụt kẹt hạnh nhân tiểu não chèn hành não gây ngừng thở.",
        en: "Carries the pyramids, where the corticospinal tracts cross. It holds the respiratory and cardiovascular centres and the nuclei of nerves IX–XII. Tonsillar herniation compressing the medulla stops breathing.",
        zh: "有锥体，皮质脊髓束在此交叉。含呼吸、心血管中枢和第IX–XII对脑神经核。小脑扁桃体疝压迫延髓致呼吸停止。",
      },
      ids: byRe(/^medulla oblongata$/i, NER),
    },
    {
      key: "cong",
      tint: "#5b9bd5",
      latin: "Aqueductus cerebri · Ventriculus quartus · Canalis centralis",
      name: { vi: "Cống não, não thất bốn, ống trung tâm", en: "Cerebral aqueduct, fourth ventricle, central canal", zh: "中脑水管、第四脑室、中央管" },
      note: {
        vi: "Cống não hẹp nhất trong hệ não thất. Hẹp cống bẩm sinh là nguyên nhân hay gặp của não úng thuỷ ở trẻ.",
        en: "The aqueduct is the narrowest point of the ventricular system; congenital aqueductal stenosis is a common cause of hydrocephalus in infants.",
        zh: "中脑水管是脑室系统最狭窄处，先天性水管狭窄是婴儿脑积水的常见原因。",
      },
      ids: byRe(/^cerebral aqueduct$|^fourth ventricle$|^central canal of spinal cord$/i),
    },
    {
      key: "tieu-nao",
      latin: "Cerebellum",
      name: { vi: "Tiểu não (mốc)", en: "Cerebellum (landmark)", zh: "小脑（标志）" },
      note: {
        vi: "Mờ sẵn — nằm sau cầu não và hành não, làm mái não thất bốn.",
        en: "Faded — lies behind the pons and medulla and roofs the fourth ventricle.",
        zh: "淡化——位于脑桥和延髓后方，构成第四脑室顶。",
      },
      ids: byRe(/^cerebellum$/i, NER),
    },
    {
      key: "than-nen",
      tint: "#d99a8f",
      latin: "A. basilaris · Aa. vertebrales",
      name: { vi: "Động mạch thân nền và đốt sống (mốc)", en: "Basilar and vertebral arteries (landmarks)", zh: "基底动脉与椎动脉（标志）" },
      note: {
        vi: "Mờ sẵn — nuôi toàn bộ thân não.",
        en: "Faded — they supply the whole brainstem.",
        zh: "淡化——供应整个脑干。",
      },
      ids: A(`^basilar artery$|^${SIDE}vertebral artery$`),
    },
  ],
});

// ───────────────────────── 3. Tiểu não ─────────────────────────
emit({
  file: "cerebellum",
  script: "batch-d",
  exportName: "cerebellumScene",
  header: 'Scene "Tiểu não" dựng từ bộ atlas BodyParts3D.\n\nAtlas có một lưới tiểu não cho mỗi bên (không tách thuỳ, nhộng, nhân răng, cuống tiểu não).',
  scene: {
    slug: "tieu-nao",
    title: { vi: "Tiểu não và liên quan", en: "The Cerebellum and its Relations", zh: "小脑及其毗邻" },
    latin: "Cerebellum",
    intro: {
      vi: "Tiểu não nằm trong hố sọ sau, dưới lều tiểu não, sau cầu não và hành não. Nó chỉ nặng khoảng 10% khối lượng não nhưng chứa hơn một nửa số neuron. Tiểu não không khởi động vận động mà so sánh ý định với thực hiện, rồi chỉnh cho mượt và chính xác. Tổn thương tiểu não gây mất điều hoà cùng bên: đi loạng choạng, run khi với đồ, nói ngắt quãng. Scene cho thấy tiểu não, lều tiểu não, não thất bốn mà nó làm mái, thân não phía trước và ba đôi động mạch nuôi. Bộ dữ liệu không tách thuỳ, nhộng và nhân tiểu não.",
      en: "The cerebellum sits in the posterior cranial fossa, under the tentorium, behind the pons and medulla. It is only about 10% of brain mass but holds more than half its neurons. It does not start movement; it compares intention with performance and smooths and corrects it. Cerebellar damage causes ataxia on the same side: a staggering gait, tremor on reaching, broken speech. The scene shows the cerebellum, the tentorium, the fourth ventricle it roofs, the brainstem in front and the three pairs of arteries that feed it. The dataset does not separate lobes, vermis or cerebellar nuclei.",
      zh: "小脑位于颅后窝、小脑幕下、脑桥和延髓后方。其重量仅占脑的约10%，却含一半以上的神经元。小脑不启动运动，而是比较意图与执行并加以平滑校正。小脑损伤致同侧共济失调：步态蹒跚、意向性震颤、言语断续。本场景显示小脑、小脑幕、其构成顶部的第四脑室、前方的脑干及三对供血动脉。数据集中未分出小脑叶、蚓部和小脑核。",
    },
  },
  faded: ["than-nao"],
  frame: ["tieu-nao", "leu", "mach"],
  groups: [
    {
      key: "tieu-nao",
      tint: "#c98bb0",
      latin: "Cerebellum",
      name: { vi: "Tiểu não (hai bán cầu)", en: "Cerebellum (two hemispheres)", zh: "小脑（两半球）" },
      note: {
        vi: "Nhộng ở giữa điều hoà thăng bằng thân mình; bán cầu ở hai bên điều hoà vận động chi cùng bên. Hạnh nhân tiểu não có thể tụt qua lỗ lớn khi tăng áp lực nội sọ.",
        en: "The midline vermis governs trunk balance; the hemispheres coordinate the limbs on the same side. The cerebellar tonsils can herniate through the foramen magnum when intracranial pressure rises.",
        zh: "中线蚓部调节躯干平衡；两侧半球协调同侧肢体。颅内压增高时小脑扁桃体可疝入枕骨大孔。",
      },
      ids: byRe(/^cerebellum$/i, NER),
    },
    {
      key: "leu",
      tint: "#9fb8a0",
      latin: "Tentorium cerebelli",
      name: { vi: "Lều tiểu não", en: "Tentorium cerebelli", zh: "小脑幕" },
      note: {
        vi: "Nếp màng cứng như mái lều, ngăn đại não với tiểu não. Khuyết lều ở phía trước cho thân não đi qua; móc hải mã có thể tụt qua khuyết này.",
        en: "A tent-like fold of dura separating cerebrum from cerebellum. The tentorial notch in front lets the brainstem through; the uncus can herniate through it.",
        zh: "帐篷状硬脑膜皱襞，分隔大脑与小脑。前方的幕切迹供脑干通过，钩回可经此疝出。",
      },
      ids: byRe(/^tentorium cerebelli$/i, NER),
    },
    {
      key: "nao-that",
      tint: "#5b9bd5",
      latin: "Ventriculus quartus",
      name: { vi: "Não thất bốn", en: "Fourth ventricle", zh: "第四脑室" },
      note: {
        vi: "Nằm giữa tiểu não ở sau và cầu–hành ở trước. U tiểu não ở trẻ em (u nguyên bào tuỷ) hay chèn não thất này, gây não úng thuỷ.",
        en: "Lies between the cerebellum behind and the pons and medulla in front. Childhood cerebellar tumours (medulloblastoma) often block it and cause hydrocephalus.",
        zh: "位于后方小脑与前方脑桥、延髓之间。儿童小脑肿瘤（髓母细胞瘤）常压迫之致脑积水。",
      },
      ids: byRe(/^fourth ventricle$/i),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "Aa. cerebelli superior, inferior anterior, inferior posterior",
      name: { vi: "Ba đôi động mạch tiểu não", en: "The three pairs of cerebellar arteries", zh: "三对小脑动脉" },
      note: {
        vi: "Tiểu não trên (mặt trên), tiểu não trước dưới (mặt trước dưới) và tiểu não sau dưới (mặt sau dưới). Chi tiết hơn ở bài hệ đốt sống–thân nền.",
        en: "Superior (upper surface), anterior inferior (front of the underside) and posterior inferior (back of the underside). See the vertebrobasilar scene for detail.",
        zh: "小脑上动脉（上面）、小脑下前动脉（下面前部）和小脑下后动脉（下面后部）。详见椎基底动脉系场景。",
      },
      ids: A(`cerebellar artery$|superior vermian branch`),
    },
    {
      key: "than-nao",
      latin: "Truncus encephali",
      name: { vi: "Thân não (mốc)", en: "Brainstem (landmark)", zh: "脑干（标志）" },
      note: {
        vi: "Mờ sẵn — tiểu não nối với thân não qua ba đôi cuống tiểu não (không có trong bộ dữ liệu).",
        en: "Faded — the cerebellum joins the brainstem by three pairs of peduncles (not in the dataset).",
        zh: "淡化——小脑借三对小脑脚与脑干相连（数据集中无）。",
      },
      ids: byRe(/^(midbrain|pons|medulla oblongata)$/i, NER),
    },
  ],
});

// ───────────────────────── 4. Hệ não thất ─────────────────────────
emit({
  file: "ventricles",
  script: "batch-d",
  exportName: "ventriclesScene",
  header: 'Scene "Hệ não thất" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu màng não (chỉ có lều tiểu não), khoang dưới nhện và các bể.',
  scene: {
    slug: "nao-that-mang-nao",
    title: { vi: "Hệ não thất và dịch não tuỷ", en: "The Ventricular System", zh: "脑室系统" },
    latin: "Systema ventriculare",
    intro: {
      vi: "Não có bốn khoang chứa dịch thông nhau. Hai não thất bên nằm trong hai bán cầu, thông với não thất ba qua lỗ gian não thất (lỗ Monro). Não thất ba thông với não thất bốn qua cống não. Đám rối mạch mạc tiết khoảng 500ml dịch não tuỷ mỗi ngày. Dịch chảy theo đường này, thoát ra khoang dưới nhện rồi được hấp thu. Tắc ở bất kỳ chỗ hẹp nào gây não úng thuỷ. Scene tô hệ não thất màu xanh dịch; đồi thị, nhân đuôi và thể chai (thành não thất) mờ sẵn. Bộ dữ liệu không có màng não ngoài lều tiểu não.",
      en: "The brain has four connected fluid-filled cavities. The two lateral ventricles lie in the hemispheres and open into the third ventricle through the interventricular foramina (of Monro). The third ventricle opens into the fourth through the cerebral aqueduct. The choroid plexus secretes about 500ml of cerebrospinal fluid a day. The fluid flows along this path, leaves into the subarachnoid space and is absorbed. A block at any narrow point causes hydrocephalus. The scene colours the ventricles fluid-blue; thalamus, caudate and corpus callosum (the ventricular walls) are faded. The dataset has no meninges apart from the tentorium.",
      zh: "脑内有四个相通的充液腔。两侧侧脑室位于大脑半球内，经室间孔（Monro孔）通第三脑室；第三脑室经中脑水管通第四脑室。脉络丛每日分泌约500ml脑脊液，沿此路径流动，进入蛛网膜下腔后被吸收。任何狭窄处阻塞均致脑积水。本场景将脑室涂成液体蓝色；丘脑、尾状核和胼胝体（脑室壁）淡化。数据集中除小脑幕外无脑膜。",
    },
  },
  faded: ["thanh"],
  frame: ["ben", "ba", "bon"],
  groups: [
    {
      key: "ben",
      tint: "#5b9bd5",
      latin: "Ventriculi laterales",
      name: { vi: "Hai não thất bên", en: "The two lateral ventricles", zh: "两侧侧脑室" },
      note: {
        vi: "Mỗi não thất có sừng trán, phần trung tâm, sừng chẩm và sừng thái dương, uốn hình chữ C theo bán cầu. Chọc dẫn lưu não thất thường vào sừng trán bên phải.",
        en: "Each has a frontal horn, central part, occipital horn and temporal horn, curving in a C with the hemisphere. External ventricular drains are usually placed in the right frontal horn.",
        zh: "每侧有前角、中央部、后角和下角，随半球呈C形弯曲。脑室外引流通常置于右侧前角。",
      },
      ids: byRe(/^(left |right )?lateral ventricle$/i),
    },
    {
      key: "monro",
      tint: "#8fc1e3",
      latin: "Foramen interventriculare",
      name: { vi: "Lỗ gian não thất (Monro)", en: "Interventricular foramen (of Monro)", zh: "室间孔（Monro孔）" },
      note: {
        vi: "U nang keo ở não thất ba có thể bít lỗ này như nút van, gây đau đầu từng cơn và có thể đột tử.",
        en: "A colloid cyst of the third ventricle can plug it like a ball valve, causing episodic headache and even sudden death.",
        zh: "第三脑室胶样囊肿可如球阀般堵塞此孔，致阵发性头痛甚至猝死。",
      },
      ids: byRe(/^interventricular foramen$/i),
    },
    {
      key: "ba",
      tint: "#3f7fbf",
      latin: "Ventriculus tertius",
      name: { vi: "Não thất ba", en: "Third ventricle", zh: "第三脑室" },
      note: {
        vi: "Khe hẹp giữa hai đồi thị. Sàn là vùng dưới đồi; mở thông sàn não thất ba qua nội soi là cách chữa não úng thuỷ tắc nghẽn.",
        en: "A narrow slit between the two thalami, floored by the hypothalamus; endoscopic third ventriculostomy through this floor treats obstructive hydrocephalus.",
        zh: "两丘脑间的狭窄裂隙，底为下丘脑；内镜第三脑室底造瘘术用于治疗梗阻性脑积水。",
      },
      ids: byRe(/^third ventricle$/i),
    },
    {
      key: "cong",
      tint: "#2e5f8f",
      latin: "Aqueductus cerebri",
      name: { vi: "Cống não", en: "Cerebral aqueduct", zh: "中脑水管" },
      note: {
        vi: "Ống hẹp khoảng 1–2mm xuyên trung não, là chỗ tắc hay gặp nhất.",
        en: "A 1–2mm channel through the midbrain, the commonest site of obstruction.",
        zh: "贯穿中脑的1–2mm细管，是最常见的阻塞部位。",
      },
      ids: byRe(/^cerebral aqueduct$/i, NER),
    },
    {
      key: "bon",
      tint: "#6fae9f",
      latin: "Ventriculus quartus · Canalis centralis",
      name: { vi: "Não thất bốn và ống trung tâm", en: "Fourth ventricle and central canal", zh: "第四脑室与中央管" },
      note: {
        vi: "Dịch thoát ra khoang dưới nhện qua lỗ giữa và hai lỗ bên của não thất bốn; phía dưới nối với ống trung tâm tuỷ sống.",
        en: "Fluid leaves into the subarachnoid space through the median and two lateral apertures of the fourth ventricle; below, it continues as the central canal of the cord.",
        zh: "脑脊液经第四脑室正中孔和两外侧孔进入蛛网膜下腔；向下续为脊髓中央管。",
      },
      ids: byRe(/^fourth ventricle$|^central canal of spinal cord$/i),
    },
    {
      key: "dam-roi",
      tint: "#e39a7a",
      latin: "Plexus choroideus",
      name: { vi: "Đám rối mạch mạc", en: "Choroid plexus", zh: "脉络丛" },
      note: {
        vi: "Mạng mao mạch phủ biểu mô, nằm trong não thất bên. Thường vôi hoá ở người lớn nên thấy trên phim CT.",
        en: "A tuft of capillaries covered by epithelium in the lateral ventricles; often calcified in adults and visible on CT.",
        zh: "覆有上皮的毛细血管丛，位于侧脑室内；成人常钙化，CT可见。",
      },
      ids: byRe(/^choroid plexus of cerebral hemisphere$/i),
    },
    {
      key: "leu",
      tint: "#9fb8a0",
      latin: "Tentorium cerebelli",
      name: { vi: "Lều tiểu não (màng cứng)", en: "Tentorium cerebelli (dura)", zh: "小脑幕（硬脑膜）" },
      note: {
        vi: "Phần màng cứng duy nhất có trong bộ dữ liệu.",
        en: "The only part of the dura in the dataset.",
        zh: "数据集中唯一的硬脑膜部分。",
      },
      ids: byRe(/^tentorium cerebelli$/i, NER),
    },
    {
      key: "thanh",
      latin: "Thalamus · Nucleus caudatus · Corpus callosum",
      name: { vi: "Đồi thị, nhân đuôi, thể chai (thành não thất)", en: "Thalamus, caudate, corpus callosum (ventricular walls)", zh: "丘脑、尾状核、胼胝体（脑室壁）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: byRe(/^(left |right )?(thalamus|caudate nucleus)$|^corpus callosum$/i, NER),
    },
  ],
});

// ───────────────────────── 5. Nền sọ ─────────────────────────
emit({
  file: "skull-base",
  script: "batch-d",
  exportName: "skullBaseScene",
  header: 'Scene "Nền sọ" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu các dây thần kinh sọ qua lỗ nền sọ (trừ dây II) và xoang tĩnh mạch.',
  scene: {
    slug: "so-nen-so",
    // Nhìn TỪ TRÊN XUỐNG sau lát cắt ngang (xem `clip` bên dưới): góc ¾ mặc định chỉ thấy vòm
    // sọ, ba hố sọ bị che hết (kiểm trang 12/09).
    view: "top",
    title: { vi: "Nền sọ và các cấu trúc đi qua", en: "The Cranial Base", zh: "颅底" },
    latin: "Basis cranii",
    intro: {
      vi: "Nhìn từ trên, nền sọ chia thành ba hố như bậc thang. Hố sọ trước (xương trán, sàng) đỡ thuỳ trán. Hố sọ giữa (xương bướm, thái dương) đỡ thuỳ thái dương và có hố yên chứa tuyến yên. Hố sọ sau (xương chẩm, thái dương) chứa tiểu não và thân não, có lỗ lớn cho hành não đi qua. Động mạch cảnh trong chui qua ống cảnh; động mạch đốt sống qua lỗ lớn. Vỡ nền sọ trước gây chảy dịch não tuỷ qua mũi và bầm quanh mắt (mắt gấu trúc). Mỗi xương một màu; não mờ sẵn.",
      en: "Seen from above, the cranial base steps down in three fossae. The anterior fossa (frontal, ethmoid) carries the frontal lobes. The middle fossa (sphenoid, temporal) carries the temporal lobes and holds the sella turcica with the pituitary. The posterior fossa (occipital, temporal) holds the cerebellum and brainstem and has the foramen magnum for the medulla. The internal carotid enters through the carotid canal, the vertebral through the foramen magnum. An anterior base fracture leaks cerebrospinal fluid from the nose and bruises round the eyes (raccoon eyes). Each bone has its own colour; the brain is faded.",
      zh: "从上面观，颅底呈阶梯状分为三个窝：颅前窝（额骨、筛骨）承托额叶；颅中窝（蝶骨、颞骨）承托颞叶，有容纳垂体的蝶鞍；颅后窝（枕骨、颞骨）容纳小脑和脑干，有供延髓通过的枕骨大孔。颈内动脉经颈动脉管入颅，椎动脉经枕骨大孔入颅。颅前窝骨折致脑脊液鼻漏和眶周淤血（熊猫眼）。每块骨一种颜色；脑淡化。",
    },
  },
  faded: ["nao"],
  frame: ["tran-sang", "buom", "thai-duong", "cham"],
  // Bỏ vòm sọ: cắt ngang ngay trên hố yên, giữ nửa DƯỚI — lộ ba hố sọ như ảnh giáo trình.
  clip: { atY: PITUITARY_TOP + 0.012, keepPositive: false },
  groups: [
    {
      key: "tran-sang",
      tint: "#e6d7b0",
      latin: "Os frontale · Os ethmoidale",
      name: { vi: "Hố trước: xương trán và xương sàng", en: "Anterior fossa: frontal and ethmoid", zh: "颅前窝：额骨与筛骨" },
      note: {
        vi: "Mảnh sàng thủng lỗ cho sợi khứu giác. Nó rất mỏng, nên vỡ ở đây gây mất ngửi và rò dịch não tuỷ ra mũi.",
        en: "The cribriform plate is perforated for the olfactory fibres. It is very thin, so a fracture here causes loss of smell and CSF rhinorrhoea.",
        zh: "筛板有嗅丝穿过的小孔，非常薄，骨折致嗅觉丧失和脑脊液鼻漏。",
      },
      ids: byRe(/^frontal bone$|^ethmoid$/i, BONE),
    },
    {
      key: "buom",
      tint: "#e6c14a",
      latin: "Os sphenoidale",
      name: { vi: "Hố giữa: xương bướm (hố yên)", en: "Middle fossa: sphenoid (sella turcica)", zh: "颅中窝：蝶骨（蝶鞍）" },
      note: {
        vi: "Thân xương bướm có hố yên ở giữa. Hai cánh bướm có khe ổ mắt trên, lỗ tròn, lỗ bầu dục cho các dây III–VI và nhánh dây V. Phẫu thuật u tuyến yên thường đi qua xoang bướm từ mũi.",
        en: "Its body carries the sella turcica. The wings hold the superior orbital fissure, foramen rotundum and foramen ovale for nerves III–VI and branches of V. Pituitary tumours are usually removed through the sphenoid sinus via the nose.",
        zh: "蝶骨体中央有蝶鞍。蝶骨翼有眶上裂、圆孔、卵圆孔，供第III–VI对脑神经及三叉神经分支通过。垂体瘤常经鼻蝶窦入路切除。",
      },
      ids: byRe(/^sphenoid bone$/i, BONE),
    },
    {
      key: "thai-duong",
      tint: "#d98c5f",
      latin: "Os temporale (pars petrosa)",
      name: { vi: "Xương thái dương (phần đá)", en: "Temporal bones (petrous part)", zh: "颞骨（岩部）" },
      note: {
        vi: "Phần đá như bờ đá ngăn hố giữa với hố sau, chứa tai giữa, tai trong và ống cảnh. Vỡ xương đá gây chảy máu hoặc dịch não tuỷ qua tai và bầm sau tai (dấu hiệu Battle).",
        en: "The petrous ridge separates the middle and posterior fossae and houses the middle and inner ear and the carotid canal. A petrous fracture causes blood or CSF from the ear and bruising behind it (Battle's sign).",
        zh: "岩部如岩嵴分隔颅中窝与颅后窝，内含中耳、内耳和颈动脉管。岩部骨折致耳漏血或脑脊液及耳后淤斑（Battle征）。",
      },
      ids: byRe(/^(left |right )?temporal bone$/i, BONE),
    },
    {
      key: "cham",
      tint: "#b58bc4",
      latin: "Os occipitale",
      name: { vi: "Hố sau: xương chẩm (lỗ lớn)", en: "Posterior fossa: occipital (foramen magnum)", zh: "颅后窝：枕骨（枕骨大孔）" },
      note: {
        vi: "Lỗ lớn cho hành não, động mạch đốt sống và rễ tuỷ của dây XI đi qua. Hai lồi cầu chẩm khớp với đốt đội.",
        en: "The foramen magnum passes the medulla, the vertebral arteries and the spinal roots of nerve XI. The occipital condyles articulate with the atlas.",
        zh: "枕骨大孔有延髓、椎动脉和副神经脊髓根通过。枕髁与寰椎相关节。",
      },
      ids: byRe(/^occipital bone$/i, BONE),
    },
    {
      key: "yen",
      tint: "#d9534f",
      latin: "Hypophysis · Chiasma opticum · Nn. optici",
      name: { vi: "Tuyến yên, giao thị, dây thị giác", en: "Pituitary, optic chiasm, optic nerves", zh: "垂体、视交叉、视神经" },
      note: {
        vi: "Giao thị nằm ngay trên tuyến yên. U tuyến yên phát triển lên trên đè giao thị, gây mất hai nửa thị trường phía thái dương.",
        en: "The optic chiasm lies just above the pituitary. A pituitary tumour growing upward presses on it, causing loss of both temporal visual fields.",
        zh: "视交叉位于垂体正上方。垂体瘤向上生长压迫视交叉，致双颞侧偏盲。",
      },
      ids: byRe(/^pituitary gland$/i).concat(byRe(/^optic chiasm$|^(left |right )?optic nerve$/i, NER)),
    },
    {
      key: "mach",
      tint: OXY,
      latin: "A. carotis interna · A. vertebralis · A. basilaris",
      name: { vi: "Động mạch cảnh trong, đốt sống, thân nền", en: "Internal carotid, vertebral and basilar arteries", zh: "颈内动脉、椎动脉、基底动脉" },
      note: {
        vi: "Động mạch cảnh trong đi qua ống cảnh trong xương đá, rồi uốn cong hình chữ S cạnh thân xương bướm (xi phông cảnh).",
        en: "The internal carotid runs through the carotid canal in the petrous bone, then bends in an S beside the sphenoid body (the carotid siphon).",
        zh: "颈内动脉经岩部的颈动脉管，再在蝶骨体旁呈S形弯曲（颈动脉虹吸部）。",
      },
      ids: A(`^${SIDE}(internal carotid|vertebral) artery$|^basilar artery$`),
    },
    {
      key: "nao",
      latin: "Truncus encephali · Cerebellum",
      name: { vi: "Thân não và tiểu não (mốc)", en: "Brainstem and cerebellum (landmarks)", zh: "脑干与小脑（标志）" },
      note: {
        vi: "Mờ sẵn — nằm trong hố sọ sau.",
        en: "Faded — they fill the posterior fossa.",
        zh: "淡化——位于颅后窝。",
      },
      ids: STEM(),
    },
  ],
});

// ───────────────────────── 6. Mũi và xoang ─────────────────────────
emit({
  file: "nose-sinuses",
  script: "batch-d",
  exportName: "noseSinusesScene",
  header: 'Scene "Mũi và xoang cạnh mũi" dựng từ bộ atlas BodyParts3D.\n\nAtlas không có lòng xoang và niêm mạc — xoang được học qua các xương chứa chúng.',
  scene: {
    slug: "mui-xoang",
    title: { vi: "Mũi ngoài, hốc mũi và các xương chứa xoang", en: "The Nose and Paranasal Sinuses", zh: "外鼻、鼻腔与鼻窦" },
    latin: "Nasus · Sinus paranasales",
    intro: {
      vi: "Mũi ngoài có khung trên là hai xương mũi, khung dưới là các sụn. Vách mũi gồm sụn vách, xương lá mía và mảnh thẳng xương sàng. Thành ngoài hốc mũi có ba xoăn mũi. Bốn đôi xoang cạnh mũi là các hốc khí trong xương hàm trên, trán, sàng và bướm, đều đổ vào hốc mũi. Bộ dữ liệu không dựng lòng xoang, nên scene tô từng xương chứa xoang để học vị trí. Ống lệ–mũi cũng đổ vào hốc mũi, dưới xoăn mũi dưới. Mỗi xương một màu; sụn màu xanh nhạt.",
      en: "The external nose has two nasal bones above and cartilages below. The septum is septal cartilage, vomer and the perpendicular plate of the ethmoid. The lateral wall of the nasal cavity carries three conchae. The four pairs of paranasal sinuses are air cells in the maxilla, frontal, ethmoid and sphenoid bones, all draining into the nasal cavity. The dataset does not model the sinus cavities, so the scene colours each bone that holds a sinus. The nasolacrimal duct also opens into the nose, under the inferior concha. Each bone has its own colour; cartilage is pale blue.",
      zh: "外鼻上部支架为两块鼻骨，下部为软骨。鼻中隔由鼻中隔软骨、犁骨和筛骨垂直板构成。鼻腔外侧壁有三个鼻甲。四对鼻窦是上颌骨、额骨、筛骨和蝶骨内的含气腔，均开口于鼻腔。数据集中未建窦腔，故本场景为含窦的各骨着色以学习位置。鼻泪管亦开口于鼻腔下鼻甲下方。每块骨一种颜色；软骨浅蓝。",
    },
  },
  // Căn theo MŨI; xương trán (cả vòm) mờ sẵn — để nguyên thì nó choán nửa khung, tràn mép trên.
  frame: ["sun", "mui", "ham-tren"],
  faded: ["tran"],
  groups: [
    {
      key: "sun",
      tint: "#a8d0e6",
      latin: "Cartilagines nasi",
      name: { vi: "Sụn mũi: sụn vách, sụn bên, sụn cánh lớn", en: "Nasal cartilages: septal, lateral, major alar", zh: "鼻软骨：鼻中隔软骨、鼻外侧软骨、大翼软骨" },
      note: {
        vi: "Sụn cánh lớn tạo đầu và cánh mũi. Phía trước dưới vách mũi có vùng Kiesselbach giàu mạch; khoảng 90% ca chảy máu mũi xuất phát từ đây.",
        en: "The major alar cartilages shape the tip and wings. The front of the septum holds Kiesselbach's area, rich in vessels, where about 90% of nosebleeds arise.",
        zh: "大翼软骨构成鼻尖和鼻翼。鼻中隔前下部为血管丰富的Kiesselbach区，约90%鼻出血源于此。",
      },
      ids: byRe(/nasal cartilage$|major alar cartilage$/i, ["respiratory", "skeletal"]),
    },
    {
      key: "mui",
      tint: "#e6d7b0",
      latin: "Ossa nasalia · Vomer · Conchae nasales inferiores",
      name: { vi: "Xương mũi, lá mía, xoăn mũi dưới", en: "Nasal bones, vomer, inferior conchae", zh: "鼻骨、犁骨、下鼻甲" },
      note: {
        vi: "Xương mũi hay gãy nhất vùng mặt. Xoăn mũi dưới là một xương riêng; ống lệ–mũi đổ vào ngách dưới nó.",
        en: "The nasal bones are the most often broken facial bones. The inferior concha is a separate bone; the nasolacrimal duct opens into the meatus beneath it.",
        zh: "鼻骨是面部最常骨折的骨。下鼻甲为独立骨，鼻泪管开口于其下方的下鼻道。",
      },
      ids: byRe(/^(left |right )?nasal bone$|^vomer$|^(left |right )?inferior nasal concha$/i, ["skeletal", "respiratory"]),
    },
    {
      key: "ham-tren",
      tint: "#e8883d",
      latin: "Maxilla (sinus maxillaris)",
      name: { vi: "Xương hàm trên — xoang hàm", en: "Maxilla — maxillary sinus", zh: "上颌骨——上颌窦" },
      note: {
        vi: "Xoang lớn nhất. Lỗ thông nằm cao trên thành trong nên dịch khó thoát khi nằm thẳng. Chân răng hàm trên sát sàn xoang, nên nhổ răng có thể thủng vào xoang và viêm răng lan thành viêm xoang.",
        en: "The largest sinus. Its opening is high on the medial wall, so it drains poorly when upright. The roots of the upper molars lie against its floor, so an extraction can perforate it and dental infection can spread into it.",
        zh: "最大的鼻窦。开口位于内侧壁高处，直立时引流不畅。上颌磨牙牙根紧邻窦底，拔牙可致穿孔，牙源性感染可蔓延为鼻窦炎。",
      },
      ids: byRe(/^(left |right )?maxilla$/i, BONE),
    },
    {
      key: "tran",
      tint: "#b58bc4",
      latin: "Os frontale (sinus frontalis)",
      name: { vi: "Xương trán — xoang trán", en: "Frontal bone — frontal sinus", zh: "额骨——额窦" },
      note: {
        vi: "Nằm sau cung mày, đổ xuống ngách mũi giữa. Xoang trán chưa có lúc mới sinh, phát triển rõ sau khoảng 7 tuổi.",
        en: "Behind the brow ridges, draining down into the middle meatus. It is absent at birth and becomes clear after about age 7.",
        zh: "位于眉弓后方，向下开口于中鼻道。出生时缺如，约7岁后明显发育。",
      },
      ids: byRe(/^frontal bone$/i, BONE),
    },
    {
      key: "sang",
      tint: "#6fae7f",
      latin: "Os ethmoidale (cellulae ethmoidales)",
      name: { vi: "Xương sàng — các xoang sàng", en: "Ethmoid — ethmoidal air cells", zh: "筛骨——筛窦" },
      note: {
        vi: "Nhiều tế bào khí nhỏ giữa hốc mũi và hốc mắt, ngăn với hốc mắt bởi mảnh giấy rất mỏng. Viêm xoang sàng ở trẻ có thể lan vào hốc mắt.",
        en: "Many small air cells between the nasal cavity and the orbit, separated from the orbit by the paper-thin lamina papyracea. Ethmoiditis in children can spread into the orbit.",
        zh: "鼻腔与眼眶之间的众多小气房，借极薄的纸样板与眶相隔。儿童筛窦炎可蔓延入眶。",
      },
      ids: byRe(/^ethmoid$/i, BONE),
    },
    {
      key: "buom",
      tint: "#e6c14a",
      latin: "Os sphenoidale (sinus sphenoidalis)",
      name: { vi: "Xương bướm — xoang bướm", en: "Sphenoid — sphenoid sinus", zh: "蝶骨——蝶窦" },
      note: {
        vi: "Nằm sâu nhất, ngay dưới tuyến yên, hai bên là động mạch cảnh trong và dây thị giác.",
        en: "The deepest sinus, just under the pituitary, flanked by the internal carotids and optic nerves.",
        zh: "位置最深，位于垂体正下方，两侧为颈内动脉和视神经。",
      },
      ids: byRe(/^sphenoid bone$/i, BONE),
    },
    {
      key: "khau-cai",
      tint: "#d9cfb8",
      latin: "Ossa palatina · Ossa lacrimalia",
      name: { vi: "Xương khẩu cái và xương lệ", en: "Palatine and lacrimal bones", zh: "腭骨与泪骨" },
      note: {
        vi: "Xương khẩu cái làm sàn sau hốc mũi; xương lệ ở thành trong hốc mắt, chứa hố túi lệ.",
        en: "The palatine bones form the back of the nasal floor; the lacrimal bones sit in the medial orbital wall and hold the fossa for the lacrimal sac.",
        zh: "腭骨构成鼻腔底后部；泪骨位于眶内侧壁，有泪囊窝。",
      },
      ids: byRe(/^(left |right )?(palatine|lacrimal) bone$/i, ["skeletal", "sensory"]),
    },
  ],
});

// ───────────────────────── 7. Miệng, lưỡi, răng ─────────────────────────
emit({
  file: "oral-cavity",
  script: "batch-d",
  exportName: "oralCavityScene",
  header: 'Scene "Miệng, lưỡi và răng" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu cơ nội tại lưỡi, cơ trâm–lưỡi, khẩu cái–lưỡi, amidan.',
  scene: {
    slug: "mieng-luoi-rang",
    title: { vi: "Ổ miệng: răng, lưỡi và vòm miệng", en: "The Oral Cavity: Teeth, Tongue and Palate", zh: "口腔：牙、舌与腭" },
    latin: "Cavitas oris",
    intro: {
      vi: "Ổ miệng được giới hạn trước bởi môi, hai bên bởi má, trên bởi vòm miệng, dưới bởi lưỡi và sàn miệng. Người trưởng thành có 32 răng vĩnh viễn, mỗi cung 16 chiếc: 4 răng cửa, 2 răng nanh, 4 răng hàm nhỏ, 6 răng hàm lớn. Lưỡi là khối cơ di động do dây XII vận động. Cơ cằm–lưỡi, cơ chính của lưỡi, kéo lưỡi ra trước và giữ đường thở thông khi ngủ. Vòm miệng mềm nâng lên khi nuốt để bịt đường lên mũi. Mỗi nhóm răng một tông, lưỡi đỏ hồng, cơ vòm tím; xương hàm mờ sẵn.",
      en: "The oral cavity is bounded by the lips in front, the cheeks at the sides, the palate above and the tongue and floor of the mouth below. Adults have 32 permanent teeth, 16 per arch: 4 incisors, 2 canines, 4 premolars, 6 molars. The tongue is a mobile mass of muscle moved by nerve XII. Genioglossus, its main muscle, protrudes it and keeps the airway open in sleep. The soft palate rises during swallowing to seal off the nose. Each tooth group has its own shade, the tongue is pink-red and the palatal muscles purple; the jaws are faded.",
      zh: "口腔前界为唇，两侧为颊，上为腭，下为舌和口底。成人有32颗恒牙，每弓16颗：切牙4、尖牙2、前磨牙4、磨牙6。舌是由舌下神经支配的可动肌块。颏舌肌为舌的主要肌肉，使舌前伸并在睡眠时保持气道通畅。吞咽时软腭上提封闭鼻咽。每组牙一种色调，舌粉红，腭肌紫色；颌骨淡化。",
    },
  },
  faded: ["ham"],
  frame: ["cua-nanh", "ham-nho", "ham-lon", "luoi", "vom"],
  groups: [
    {
      key: "cua-nanh",
      tint: "#f2ecd8",
      latin: "Dentes incisivi et canini",
      name: { vi: "Răng cửa và răng nanh", en: "Incisors and canines", zh: "切牙与尖牙" },
      note: {
        vi: "Răng cửa cắt, răng nanh xé. Răng nanh có chân dài nhất, là trụ góc của cung răng.",
        en: "Incisors cut and canines tear. The canine has the longest root and anchors the corner of the arch.",
        zh: "切牙切断，尖牙撕裂。尖牙牙根最长，是牙弓转角的支柱。",
      },
      ids: byRe(/secondary (incisor|canine) tooth$/i, BONE),
    },
    {
      key: "ham-nho",
      tint: "#e6d7b0",
      latin: "Dentes premolares",
      name: { vi: "Răng hàm nhỏ", en: "Premolars", zh: "前磨牙" },
      note: {
        vi: "Hai núm, nghiền thức ăn. Không có ở bộ răng sữa; răng hàm nhỏ thay chỗ răng hàm sữa.",
        en: "Two cusps, for crushing. Absent from the milk dentition; they replace the milk molars.",
        zh: "双尖，研磨食物。乳牙列中无；前磨牙替换乳磨牙。",
      },
      ids: byRe(/secondary premolar tooth$/i, BONE),
    },
    {
      key: "ham-lon",
      tint: "#d9c08a",
      latin: "Dentes molares",
      name: { vi: "Răng hàm lớn", en: "Molars", zh: "磨牙" },
      note: {
        vi: "Mặt nhai rộng, nhiều núm. Răng số 8 (hàm lớn thứ ba) mọc muộn nhất, hay mọc lệch; bộ dữ liệu không có răng này.",
        en: "Broad multi-cusped chewing surfaces. The third molar (wisdom tooth) erupts last and is often impacted; the dataset lacks it.",
        zh: "咬合面宽大多尖。第三磨牙（智齿）萌出最晚，常阻生；数据集中无此牙。",
      },
      ids: byRe(/secondary molar tooth$/i, BONE),
    },
    {
      key: "loi",
      tint: "#e8a0a0",
      latin: "Gingiva",
      name: { vi: "Lợi (nướu)", en: "Gingiva", zh: "牙龈" },
      note: {
        vi: "Niêm mạc bám chặt vào xương ổ răng và cổ răng.",
        en: "Mucosa bound tightly to the alveolar bone and the necks of the teeth.",
        zh: "紧附于牙槽骨和牙颈的黏膜。",
      },
      ids: byRe(/^gingiva of (upper|lower) jaw$/i),
    },
    {
      key: "luoi",
      tint: "#d9534f",
      latin: "Lingua · Mm. genioglossus, hyoglossus",
      name: { vi: "Lưỡi và cơ ngoại lai", en: "Tongue and extrinsic muscles", zh: "舌与舌外肌" },
      note: {
        vi: "Liệt dây XII một bên: khi thè, lưỡi lệch về bên liệt vì cơ cằm–lưỡi bên lành đẩy mạnh hơn. Cơ móng–lưỡi kéo lưỡi xuống.",
        en: "With one-sided nerve XII palsy, the protruded tongue deviates to the paralysed side because the healthy genioglossus pushes harder. Hyoglossus pulls the tongue down.",
        zh: "单侧舌下神经麻痹时，伸舌偏向患侧，因健侧颏舌肌推力更强。舌骨舌肌使舌下降。",
      },
      ids: byRe(/^tongue$/i).concat(byRe(/^(left |right )?(genioglossus|hyoglossus)$/i, MU)),
    },
    {
      key: "vom",
      tint: "#b58bc4",
      latin: "Mm. levator et tensor veli palatini, m. uvulae",
      name: { vi: "Cơ vòm miệng mềm", en: "Muscles of the soft palate", zh: "软腭肌" },
      note: {
        vi: "Cơ nâng màn hầu nâng vòm; cơ căng màn hầu căng vòm và mở vòi tai khi nuốt (vì thế nuốt giúp cân bằng áp suất tai khi đi máy bay). Liệt dây X một bên làm lưỡi gà lệch về bên lành.",
        en: "Levator veli palatini raises the palate; tensor veli palatini tightens it and opens the auditory tube when we swallow (which is why swallowing equalises ear pressure on a plane). A one-sided vagal palsy deviates the uvula to the healthy side.",
        zh: "腭帆提肌上提软腭；腭帆张肌紧张软腭并在吞咽时开放咽鼓管（故乘飞机时吞咽可平衡耳压）。单侧迷走神经麻痹时悬雍垂偏向健侧。",
      },
      ids: byRe(/^(left |right )?(levator veli palatini|tensor veli palatini)$|^uvular muscle$/i, MU),
    },
    {
      key: "moi",
      tint: "#e39a7a",
      latin: "Labia oris",
      name: { vi: "Môi", en: "Lips", zh: "唇" },
      note: {
        vi: "Ranh giới trước của ổ miệng.",
        en: "The front boundary of the oral cavity.",
        zh: "口腔前界。",
      },
      ids: byRe(/^lip$/i),
    },
    {
      key: "ham",
      latin: "Maxilla · Mandibula · Os palatinum",
      name: { vi: "Xương hàm trên, hàm dưới, khẩu cái (mốc)", en: "Maxillae, mandible, palatine bones (landmarks)", zh: "上颌骨、下颌骨、腭骨（标志）" },
      note: {
        vi: "Mờ sẵn — xương hàm trên và khẩu cái tạo vòm miệng cứng.",
        en: "Faded — the maxillae and palatine bones form the hard palate.",
        zh: "淡化——上颌骨和腭骨构成硬腭。",
      },
      ids: byRe(/^(left |right )?(maxilla|palatine bone)$|^mandible$/i, BONE),
    },
  ],
});

// ───────────────────────── 8. Hầu và thanh quản ─────────────────────────
emit({
  file: "pharynx-larynx",
  script: "batch-d",
  exportName: "pharynxLarynxScene",
  header: 'Scene "Hầu và thanh quản" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu niêm mạc hầu, amidan và vòi tai.',
  scene: {
    slug: "hau-thanh-quan",
    title: { vi: "Cơ hầu và thanh quản", en: "The Pharynx and Larynx", zh: "咽肌与喉" },
    latin: "Pharynx · Larynx",
    intro: {
      vi: "Hầu là ống cơ dài khoảng 12cm, từ nền sọ tới ngang C6, sau mũi, miệng và thanh quản. Thành hầu có hai lớp cơ. Lớp vòng gồm ba cơ khít hầu trên, giữa, dưới, lồng vào nhau như ba cái cốc, bám vào đường đan giữa phía sau. Lớp dọc gồm cơ trâm–hầu, khẩu cái–hầu, vòi–hầu, nâng hầu lên khi nuốt. Thanh quản nằm trước hầu dưới, là khung sụn bảo vệ đường thở và phát âm. Mỗi lớp một tông màu; sụn thanh quản xanh nhạt; cột sống cổ mờ sẵn.",
      en: "The pharynx is a muscular tube about 12cm long, from the skull base to C6, behind the nose, mouth and larynx. Its wall has two muscle layers. The circular layer is the superior, middle and inferior constrictors, stacked like three cups and meeting at the midline raphe behind. The longitudinal layer is stylopharyngeus, palatopharyngeus and salpingopharyngeus, which raise the pharynx in swallowing. The larynx lies in front of the lower pharynx, a cartilage frame that guards the airway and makes voice. Each layer has its own colour family; laryngeal cartilages are pale blue; the cervical spine is faded.",
      zh: "咽是长约12cm的肌性管道，自颅底至C6平面，位于鼻、口、喉的后方。咽壁有两层肌：环行层为上、中、下咽缩肌，如三只杯子套叠，后方止于正中咽缝；纵行层为茎突咽肌、腭咽肌、咽鼓管咽肌，吞咽时上提咽。喉位于咽下部前方，是保护气道和发音的软骨支架。每层一种色系；喉软骨浅蓝；颈椎淡化。",
    },
  },
  faded: ["cot-song"],
  frame: ["khit", "doc", "sun", "noi-tai"],
  groups: [
    {
      key: "khit",
      tint: "#c9705f",
      latin: "Mm. constrictores pharyngis superior, medius, inferior",
      name: { vi: "Ba cơ khít hầu (lớp vòng)", en: "The three constrictors (circular layer)", zh: "三块咽缩肌（环行层）" },
      note: {
        vi: "Co lần lượt từ trên xuống, đẩy viên thức ăn vào thực quản. Giữa phần chéo và phần ngang của cơ khít dưới có vùng yếu (tam giác Killian); túi thừa Zenker phồng ra ở đây.",
        en: "They contract in sequence from above down, driving the bolus into the oesophagus. Between the oblique and transverse parts of the inferior constrictor is a weak area (Killian's triangle), where a Zenker's diverticulum bulges out.",
        zh: "自上而下依次收缩，将食团推入食管。咽下缩肌斜部与横部之间有薄弱区（Killian三角），Zenker憩室由此膨出。",
      },
      ids: byRe(/pharyngeal constrictor$/i, MU),
    },
    {
      key: "doc",
      tint: "#b58bc4",
      latin: "Mm. stylopharyngeus, palatopharyngeus, salpingopharyngeus",
      name: { vi: "Cơ dọc hầu", en: "Longitudinal muscles", zh: "咽纵行肌" },
      note: {
        vi: "Cơ trâm–hầu là cơ duy nhất do dây IX chi phối, chui giữa cơ khít trên và khít giữa.",
        en: "Stylopharyngeus is the only muscle supplied by nerve IX; it slips in between the superior and middle constrictors.",
        zh: "茎突咽肌是唯一受舌咽神经支配的肌肉，穿行于咽上缩肌与咽中缩肌之间。",
      },
      ids: byRe(/^(left |right )?(stylopharyngeus|palatopharyngeus|salpingopharyngeus)$/i, MU),
    },
    {
      key: "dan",
      tint: "#9fb8a0",
      latin: "Raphe pharyngis · Raphe pterygomandibularis",
      name: { vi: "Đường đan hầu và đường đan chân bướm–hàm", en: "Pharyngeal and pterygomandibular raphes", zh: "咽缝与翼下颌缝" },
      note: {
        vi: "Đường đan chân bướm–hàm nối cơ khít trên với cơ mút; đây là mốc gây tê thần kinh răng dưới.",
        en: "The pterygomandibular raphe joins the superior constrictor to buccinator — the landmark for an inferior alveolar nerve block.",
        zh: "翼下颌缝连接咽上缩肌与颊肌，是下牙槽神经阻滞麻醉的标志。",
      },
      ids: byRe(/pharyngeal raphe$|pterygomandibular raphe$|stylohyoid ligament$/i, ["connective"]),
    },
    {
      key: "sun",
      tint: "#a8d0e6",
      latin: "Cartilagines laryngis · Os hyoideum",
      name: { vi: "Sụn thanh quản và xương móng", en: "Laryngeal cartilages and hyoid", zh: "喉软骨与舌骨" },
      note: {
        vi: "Sụn giáp (lồi thanh quản, “trái cổ”), sụn nhẫn (vòng kín duy nhất của đường thở), nắp thanh môn, hai sụn phễu. Mở màng nhẫn–giáp là đường thở cấp cứu nhanh nhất.",
        en: "Thyroid cartilage (the laryngeal prominence, “Adam's apple”), cricoid (the only complete ring of the airway), epiglottis and the two arytenoids. Opening the cricothyroid membrane is the fastest emergency airway.",
        zh: "甲状软骨（喉结）、环状软骨（气道唯一完整的环）、会厌和两块杓状软骨。环甲膜切开是最快的紧急气道。",
      },
      ids: byRe(/^(thyroid|cricoid) cartilage$|^epiglottis$|^(left |right )?(arytenoid|corniculate|cuneiform) cartilage$|^hyoid bone$/i, ["skeletal", "respiratory"]),
    },
    {
      key: "noi-tai",
      tint: "#e8883d",
      latin: "Mm. laryngis",
      name: { vi: "Cơ nội tại thanh quản", en: "Intrinsic laryngeal muscles", zh: "喉内肌" },
      note: {
        vi: "Cơ nhẫn–phễu sau là cơ duy nhất mở thanh môn. Liệt cả hai dây thanh quản quặt ngược làm hai dây thanh khép, gây khó thở cấp.",
        en: "Posterior crico-arytenoid is the only muscle that opens the glottis. Bilateral recurrent laryngeal palsy leaves the cords closed and causes acute breathlessness.",
        zh: "环杓后肌是唯一开大声门的肌肉。双侧喉返神经麻痹致声带闭合，引起急性呼吸困难。",
      },
      ids: byRe(/crico-arytenoid$|arytenoid$|cricothyroid$|thyro-arytenoid$|vocalis$|aryepiglotticus$/i, ["muscular"]),
    },
    {
      key: "day",
      tint: "#d9cfb8",
      latin: "Membrana thyrohyoidea · Conus elasticus · Lig. vocale",
      name: { vi: "Màng và dây chằng thanh quản", en: "Laryngeal membranes and ligaments", zh: "喉的膜与韧带" },
      note: {
        vi: "Dây chằng thanh âm là bờ trên tự do của nón đàn hồi, làm lõi dây thanh.",
        en: "The vocal ligament is the free upper edge of the conus elasticus and the core of the vocal cord.",
        zh: "声韧带是弹性圆锥的游离上缘，为声带的核心。",
      },
      ids: byRe(/thyrohyoid (membrane|ligament)$|conus elasticus$|vocal ligament$|cricothyroid ligament$|epiglottic ligament$/i, ["connective"]),
    },
    {
      key: "cot-song",
      latin: "Vertebrae cervicales",
      name: { vi: "Cột sống cổ (mốc)", en: "Cervical spine (landmark)", zh: "颈椎（标志）" },
      note: {
        vi: "Mờ sẵn — hầu nằm ngay trước thân đốt C1–C6.",
        en: "Faded — the pharynx lies directly in front of C1–C6.",
        zh: "淡化——咽紧贴C1–C6椎体前方。",
      },
      ids: byRe(/^(atlas|axis)$|^(third|fourth|fifth|sixth) cervical vertebra$/i, BONE),
    },
  ],
});

// ───────────────────── 9. Sàn miệng và tuyến nước bọt ─────────────────────
emit({
  file: "salivary",
  script: "batch-d",
  exportName: "salivaryScene",
  header: 'Scene "Sàn miệng và tuyến nước bọt" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu tuyến mang tai và các ống tiết (ống Wharton, ống Stensen).',
  scene: {
    slug: "tuyen-nuoc-bot",
    title: { vi: "Tuyến dưới hàm, dưới lưỡi và sàn miệng", en: "Submandibular and Sublingual Glands and the Floor of the Mouth", zh: "下颌下腺、舌下腺与口底" },
    latin: "Glandulae submandibularis et sublingualis",
    intro: {
      vi: "Có ba đôi tuyến nước bọt lớn: mang tai, dưới hàm và dưới lưỡi. Bộ dữ liệu không có tuyến mang tai. Cơ hàm–móng là mốc then chốt vì nó chia sàn miệng thành hai tầng. Tuyến dưới lưỡi nằm trên cơ. Tuyến dưới hàm vòng quanh bờ sau cơ, phần lớn nằm dưới trong tam giác dưới hàm. Tuyến dưới hàm tiết khoảng 70% nước bọt lúc nghỉ. Ống của nó dài và đi ngược lên nên hay bị sỏi. Mỗi tuyến một màu, cơ sàn miệng tông cam; xương hàm dưới mờ sẵn. Chú ý: bộ dữ liệu không có ống tiết.",
      en: "There are three pairs of major salivary glands: parotid, submandibular and sublingual; the dataset has no parotid. Mylohyoid is the key landmark because it divides the floor of the mouth into two storeys. The sublingual gland lies above it. The submandibular gland wraps round its back edge, with most of the gland below it in the submandibular triangle. The submandibular gland makes about 70% of resting saliva. Its duct is long and runs uphill, so it is the commonest site of salivary stones. Each gland has its own colour and the floor muscles are orange; the mandible is faded. Note: the dataset has no ducts.",
      zh: "大唾液腺有三对：腮腺、下颌下腺、舌下腺；数据集中无腮腺。下颌舌骨肌是关键标志，将口底分为上下两层：舌下腺位于其上；下颌下腺绕其后缘，大部位于其下方的下颌下三角内。下颌下腺分泌约70%的静息唾液，其导管长且向上走行，最易形成涎石。每个腺一种颜色，口底肌橙色；下颌骨淡化。注意：数据集中无导管。",
    },
  },
  faded: ["ham"],
  frame: ["duoi-ham", "duoi-luoi", "ham-mong", "khac"],
  groups: [
    {
      key: "duoi-ham",
      tint: "#e6c14a",
      latin: "Glandula submandibularis",
      name: { vi: "Tuyến dưới hàm", en: "Submandibular gland", zh: "下颌下腺" },
      note: {
        vi: "Sờ được dưới bờ hàm dưới. Ống Wharton mở ở cục dưới lưỡi, cạnh hãm lưỡi. Mổ lấy tuyến có nguy cơ tổn thương nhánh bờ hàm dưới của dây VII, dây lưỡi và dây XII.",
        en: "Palpable under the lower border of the mandible. Wharton's duct opens at the sublingual papilla beside the frenulum. Removing the gland risks the marginal mandibular branch of VII, the lingual nerve and nerve XII.",
        zh: "可于下颌骨下缘下方触及。下颌下腺管（Wharton管）开口于舌系带旁的舌下阜。切除该腺有损伤面神经下颌缘支、舌神经和舌下神经的风险。",
      },
      ids: byRe(/^(left |right )?submandibular gland$/i),
    },
    {
      key: "duoi-luoi",
      tint: "#e39a7a",
      latin: "Glandula sublingualis",
      name: { vi: "Tuyến dưới lưỡi", en: "Sublingual gland", zh: "舌下腺" },
      note: {
        vi: "Nhỏ nhất, nằm ngay dưới niêm mạc sàn miệng, đổ bằng nhiều ống nhỏ. Tắc ống tạo nang nhái (ranula).",
        en: "The smallest, just under the mucosa of the floor of the mouth, draining by many small ducts. A blocked duct forms a ranula.",
        zh: "最小，位于口底黏膜下，借多条小管开口。导管阻塞形成舌下囊肿（蛤蟆肿）。",
      },
      ids: byRe(/^(left |right )?sublingual gland$/i),
    },
    {
      key: "ham-mong",
      tint: "#e8883d",
      latin: "M. mylohyoideus",
      name: { vi: "Cơ hàm–móng (hoành miệng)", en: "Mylohyoid (the oral diaphragm)", zh: "下颌舌骨肌（口膈）" },
      note: {
        vi: "Hai cơ gặp nhau ở đường giữa như một cái võng. Nhiễm trùng răng hàm dưới lan dưới cơ này có thể gây viêm tấy sàn miệng (Ludwig), đẩy lưỡi lên và làm tắc đường thở.",
        en: "The two muscles meet in the midline like a hammock. Infection from the lower molars spreading below it can cause Ludwig's angina, pushing the tongue up and blocking the airway.",
        zh: "两侧肌在中线相会如吊床。下颌磨牙感染蔓延至其下方可致路德维希咽峡炎，将舌推高而阻塞气道。",
      },
      ids: byRe(/^(left |right )?mylohyoid$/i, MU),
    },
    {
      key: "khac",
      tint: "#c9705f",
      latin: "Mm. digastricus, geniohyoideus, hyoglossus",
      name: { vi: "Cơ hai bụng, cằm–móng, móng–lưỡi", en: "Digastric, geniohyoid, hyoglossus", zh: "二腹肌、颏舌骨肌、舌骨舌肌" },
      note: {
        vi: "Hai bụng cơ hai bụng cùng bờ hàm dưới tạo tam giác dưới hàm. Cơ móng–lưỡi là mốc: ống tuyến dưới hàm và dây lưỡi đi mặt ngoài cơ.",
        en: "The two bellies of digastric and the lower border of the mandible form the submandibular triangle. Hyoglossus is a landmark: the submandibular duct and lingual nerve run on its outer surface.",
        zh: "二腹肌两腹与下颌骨下缘围成下颌下三角。舌骨舌肌为标志：下颌下腺管和舌神经行于其外侧面。",
      },
      ids: byRe(/^(left |right )?(digastric|geniohyoid|hyoglossus)$/i, MU),
    },
    {
      key: "luoi",
      tint: "#d98fa0",
      latin: "Lingua · Os hyoideum",
      name: { vi: "Lưỡi và xương móng", en: "Tongue and hyoid", zh: "舌与舌骨" },
      note: {
        vi: "Tuyến dưới lưỡi nằm hai bên gốc lưỡi, dưới niêm mạc.",
        en: "The sublingual glands lie either side of the root of the tongue, under the mucosa.",
        zh: "舌下腺位于舌根两侧的黏膜下。",
      },
      ids: byRe(/^tongue$/i).concat(byRe(/^hyoid bone$/i, BONE)),
    },
    {
      key: "ham",
      latin: "Mandibula",
      name: { vi: "Xương hàm dưới (mốc)", en: "Mandible (landmark)", zh: "下颌骨（标志）" },
      note: {
        vi: "Mờ sẵn. Hố dưới hàm ở mặt trong xương, dưới đường hàm–móng, chứa tuyến dưới hàm.",
        en: "Faded. The submandibular fossa on its inner surface, below the mylohyoid line, holds the submandibular gland.",
        zh: "淡化。其内面下颌舌骨线下方的下颌下窝容纳下颌下腺。",
      },
      ids: byRe(/^mandible$/i, BONE),
    },
  ],
});

// ───────────────────────── 10. Tam giác cổ ─────────────────────────
emit({
  file: "neck-triangles",
  script: "batch-d",
  exportName: "neckTrianglesScene",
  header: 'Scene "Tam giác cổ" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây X, XI, XII, đám rối cổ, ĐM cảnh ngoài và tĩnh mạch cảnh ngoài.',
  scene: {
    slug: "tam-giac-co",
    title: { vi: "Các tam giác cổ", en: "The Triangles of the Neck", zh: "颈部三角" },
    latin: "Trigona colli",
    intro: {
      vi: "Cơ ức–đòn–chũm chéo qua cổ, chia mỗi bên thành tam giác cổ trước và tam giác cổ sau. Tam giác trước giới hạn bởi đường giữa, bờ hàm dưới và cơ ức–đòn–chũm. Hai bụng cơ hai bụng và cơ vai–móng chia nó thành bốn tam giác nhỏ: dưới cằm, dưới hàm, cảnh, cơ. Tam giác cảnh chứa bó mạch cảnh, gồm động mạch cảnh chung và cảnh trong cùng tĩnh mạch cảnh trong. Tam giác sau nằm giữa cơ ức–đòn–chũm, cơ thang và xương đòn. Các cơ ranh giới mỗi cơ một màu; mạch đỏ–xanh. Bộ dữ liệu không có thần kinh và động mạch cảnh ngoài.",
      en: "Sternocleidomastoid runs obliquely across the neck and divides each side into anterior and posterior triangles. The anterior triangle is bounded by the midline, the lower border of the mandible and sternocleidomastoid. The two bellies of digastric and omohyoid divide it into four smaller triangles: submental, submandibular, carotid and muscular. The carotid triangle holds the carotid sheath: common and internal carotid arteries and the internal jugular vein. The posterior triangle lies between sternocleidomastoid, trapezius and the clavicle. Each boundary muscle has its own colour; vessels are red and blue. The dataset has no nerves or external carotid artery.",
      zh: "胸锁乳突肌斜跨颈部，将每侧分为颈前三角和颈后三角。颈前三角由中线、下颌骨下缘和胸锁乳突肌围成，被二腹肌两腹和肩胛舌骨肌分为四个小三角：颏下、下颌下、颈动脉和肌三角。颈动脉三角内有颈动脉鞘：颈总动脉、颈内动脉和颈内静脉。颈后三角位于胸锁乳突肌、斜方肌和锁骨之间。各边界肌一种颜色；血管红蓝。数据集中无神经和颈外动脉。",
    },
  },
  faded: ["xuong"],
  frame: ["uc-don-chum", "thang", "hai-bung", "vai-mong", "canh", "tm"],
  groups: [
    {
      key: "uc-don-chum",
      tint: "#b58bc4",
      latin: "M. sternocleidomastoideus",
      name: { vi: "Cơ ức–đòn–chũm (ranh giới chung)", en: "Sternocleidomastoid (the dividing muscle)", zh: "胸锁乳突肌（分界肌）" },
      note: {
        vi: "Co một bên làm nghiêng đầu cùng bên và xoay mặt sang bên đối diện. Co rút bẩm sinh gây vẹo cổ ở trẻ sơ sinh.",
        en: "Acting alone it tilts the head to its own side and turns the face to the opposite side. Congenital shortening causes torticollis in infants.",
        zh: "单侧收缩使头倾向同侧、面转向对侧。先天性挛缩致婴儿斜颈。",
      },
      ids: byRe(/^(left |right )?sternocleidomastoid$/i, MU),
    },
    {
      key: "thang",
      tint: "#8a6fb0",
      latin: "M. trapezius (pars descendens)",
      name: { vi: "Cơ thang (bờ sau tam giác sau)", en: "Trapezius (posterior border of the posterior triangle)", zh: "斜方肌（颈后三角后界）" },
      note: {
        vi: "Dây XI chạy chéo qua tam giác sau, nông ngay dưới da, rồi vào mặt sâu cơ thang. Sinh thiết hạch ở vùng này dễ cắt phải dây.",
        en: "Nerve XI crosses the posterior triangle just under the skin to reach the deep surface of trapezius; a lymph node biopsy here can easily cut it.",
        zh: "副神经斜穿颈后三角，位置表浅，再进入斜方肌深面。此处淋巴结活检易误伤。",
      },
      ids: byRe(/^descending part of (left |right )?trapezius$/i, MU),
    },
    {
      key: "hai-bung",
      tint: "#e8883d",
      latin: "M. digastricus · M. stylohyoideus",
      name: { vi: "Cơ hai bụng và trâm–móng (bờ trên)", en: "Digastric and stylohyoid (upper boundaries)", zh: "二腹肌与茎突舌骨肌（上界）" },
      note: {
        vi: "Bụng sau cơ hai bụng là bờ trên tam giác cảnh; bụng trước tạo tam giác dưới cằm với đường giữa.",
        en: "The posterior belly is the upper border of the carotid triangle; the anterior belly forms the submental triangle with the midline.",
        zh: "二腹肌后腹为颈动脉三角上界；前腹与中线围成颏下三角。",
      },
      ids: byRe(/^(left |right )?(digastric|stylohyoid)$/i, MU),
    },
    {
      key: "vai-mong",
      tint: "#e6c14a",
      latin: "M. omohyoideus",
      name: { vi: "Cơ vai–móng (chia tam giác cảnh và tam giác cơ)", en: "Omohyoid (divides carotid from muscular triangle)", zh: "肩胛舌骨肌（分隔颈动脉三角与肌三角）" },
      note: {
        vi: "Bụng trên là bờ dưới tam giác cảnh; bụng dưới chia tam giác sau thành tam giác chẩm và tam giác vai–đòn.",
        en: "Its superior belly is the lower border of the carotid triangle; the inferior belly divides the posterior triangle into occipital and supraclavicular parts.",
        zh: "上腹为颈动脉三角下界；下腹将颈后三角分为枕三角和锁骨上三角。",
      },
      ids: byRe(/^(left |right )?omohyoid$/i, MU),
    },
    {
      key: "canh",
      tint: OXY,
      latin: "Aa. carotides communis et interna",
      name: { vi: "Động mạch cảnh chung và cảnh trong", en: "Common and internal carotid arteries", zh: "颈总动脉与颈内动脉" },
      note: {
        vi: "Chia đôi ngang bờ trên sụn giáp (C3–C4). Xoang cảnh ở chỗ chia là thụ thể áp lực; xoa vùng này làm chậm nhịp tim.",
        en: "Divides at the upper border of the thyroid cartilage (C3–C4). The carotid sinus at the bifurcation is a baroreceptor; massaging it slows the heart.",
        zh: "在甲状软骨上缘（C3–C4）分叉。分叉处的颈动脉窦为压力感受器，按摩可减慢心率。",
      },
      ids: A(`^${SIDE}(common|internal) carotid artery$`),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. jugularis interna",
      name: { vi: "Tĩnh mạch cảnh trong", en: "Internal jugular vein", zh: "颈内静脉" },
      note: {
        vi: "Nằm ngoài động mạch cảnh trong bao cảnh. Là đường đặt catheter tĩnh mạch trung tâm, vào ở đỉnh tam giác giữa hai bó cơ ức–đòn–chũm.",
        en: "Lies lateral to the carotid in the sheath; the route for central venous catheters, entered at the apex of the triangle between the two heads of sternocleidomastoid.",
        zh: "在颈动脉鞘内位于颈动脉外侧；中心静脉置管常于胸锁乳突肌两头间三角尖端穿刺。",
      },
      ids: byRe(/^(left |right )?internal jugular vein$/i, VEN),
    },
    {
      key: "xuong",
      latin: "Mandibula · Os hyoideum · Clavicula",
      name: { vi: "Hàm dưới, xương móng, xương đòn (mốc)", en: "Mandible, hyoid, clavicles (landmarks)", zh: "下颌骨、舌骨、锁骨（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: byRe(/^mandible$|^hyoid bone$|^(left |right )?clavicle$/i, BONE),
    },
  ],
});

// ───────────────────────── 11. Động mạch cảnh ─────────────────────────
emit({
  file: "carotid-system",
  script: "batch-d",
  exportName: "carotidSystemScene",
  header: 'Scene "Động mạch cảnh và dưới đòn" dựng từ bộ atlas BodyParts3D.\n\nAtlas KHÔNG có động mạch cảnh ngoài và nhánh — bài dạy cảnh chung, cảnh trong và các thân của ĐM dưới đòn.',
  scene: {
    slug: "dong-mach-canh",
    title: { vi: "Động mạch cảnh và dưới đòn vùng cổ", en: "Carotid and Subclavian Arteries in the Neck", zh: "颈部颈动脉与锁骨下动脉" },
    latin: "Aa. carotides · A. subclavia",
    intro: {
      vi: "Bên phải, thân cánh tay–đầu tách từ cung động mạch chủ rồi chia thành động mạch cảnh chung và dưới đòn phải. Bên trái, hai động mạch này tách thẳng từ cung. Động mạch cảnh chung lên cổ trong bao cảnh, chia đôi ngang C4. Cảnh trong không cho nhánh nào ở cổ, đi thẳng vào sọ. Động mạch dưới đòn cho động mạch đốt sống, thân giáp–cổ, thân sườn–cổ và động mạch ngực trong. Hẹp gốc động mạch dưới đòn có thể làm máu chảy ngược động mạch đốt sống, gây chóng mặt khi dùng tay (hội chứng trộm máu dưới đòn). Bộ dữ liệu không có động mạch cảnh ngoài.",
      en: "On the right, the brachiocephalic trunk leaves the aortic arch and divides into the right common carotid and subclavian arteries. On the left, both arise directly from the arch. The common carotid climbs the neck in the carotid sheath and divides at C4. The internal carotid gives no branches in the neck and goes straight into the skull. The subclavian gives the vertebral artery, the thyrocervical and costocervical trunks and the internal thoracic artery. Narrowing at the start of the subclavian can reverse flow in the vertebral artery and cause dizziness on using the arm (subclavian steal). The dataset has no external carotid artery.",
      zh: "右侧头臂干发自主动脉弓，分为右颈总动脉和右锁骨下动脉；左侧二者直接发自主动脉弓。颈总动脉在颈动脉鞘内上行，于C4平面分叉。颈内动脉在颈部不发分支，直接入颅。锁骨下动脉发出椎动脉、甲状颈干、肋颈干和胸廓内动脉。锁骨下动脉起始部狭窄可致椎动脉血液逆流，用手时头晕（锁骨下动脉盗血综合征）。数据集中无颈外动脉。",
    },
  },
  faded: ["moc"],
  frame: ["goc", "canh-chung", "canh-trong", "dot-song", "duoi-don", "than"],
  groups: [
    {
      key: "goc",
      tint: "#8f2d2d",
      latin: "Arcus aortae · Truncus brachiocephalicus",
      name: { vi: "Cung động mạch chủ và thân cánh tay–đầu", en: "Aortic arch and brachiocephalic trunk", zh: "主动脉弓与头臂干" },
      note: {
        vi: "Ba nhánh của cung, từ phải sang trái: thân cánh tay–đầu, cảnh chung trái, dưới đòn trái.",
        en: "The arch's three branches, right to left: brachiocephalic trunk, left common carotid, left subclavian.",
        zh: "主动脉弓三大分支自右向左：头臂干、左颈总动脉、左锁骨下动脉。",
      },
      ids: A(`^arch of aorta$|^brachiocephalic artery$`),
    },
    {
      key: "canh-chung",
      tint: OXY,
      latin: "A. carotis communis",
      name: { vi: "Động mạch cảnh chung", en: "Common carotid artery", zh: "颈总动脉" },
      note: {
        vi: "Mạch cảnh bắt ở bờ trước cơ ức–đòn–chũm, ngang sụn giáp. Xơ vữa hay gặp nhất ở chỗ chia đôi; mảng bong ra gây đột quỵ.",
        en: "The carotid pulse is felt at the front edge of sternocleidomastoid, level with the thyroid cartilage. Atheroma is commonest at the bifurcation; fragments break off and cause stroke.",
        zh: "颈动脉搏动于胸锁乳突肌前缘、甲状软骨平面触及。动脉粥样硬化最常见于分叉处，斑块脱落致卒中。",
      },
      ids: A(`^${SIDE}common carotid artery$`),
    },
    {
      key: "canh-trong",
      tint: "#b03a48",
      latin: "A. carotis interna · A. ophthalmica",
      name: { vi: "Động mạch cảnh trong và động mạch mắt", en: "Internal carotid and ophthalmic arteries", zh: "颈内动脉与眼动脉" },
      note: {
        vi: "Nhánh đầu tiên trong sọ là động mạch mắt. Vì vậy mù thoáng qua một mắt (amaurosis fugax) là dấu hiệu báo trước của hẹp động mạch cảnh cùng bên.",
        en: "Its first intracranial branch is the ophthalmic artery. So transient blindness in one eye (amaurosis fugax) warns of stenosis in the carotid on that side.",
        zh: "其颅内第一分支为眼动脉，故一过性单眼黑矇是同侧颈动脉狭窄的预警。",
      },
      ids: A(`^${SIDE}(internal carotid|ophthalmic) artery$`),
    },
    {
      key: "duoi-don",
      tint: "#e8883d",
      latin: "A. subclavia · A. thoracica interna",
      name: { vi: "Động mạch dưới đòn và ngực trong", en: "Subclavian and internal thoracic arteries", zh: "锁骨下动脉与胸廓内动脉" },
      note: {
        vi: "Cơ bậc thang trước chia động mạch dưới đòn làm ba đoạn. Động mạch ngực trong (vú trong) đi dọc bờ xương ức, là mạch ghép bắc cầu chủ–vành bền nhất.",
        en: "Scalenus anterior divides the subclavian into three parts. The internal thoracic (internal mammary) runs beside the sternum and is the most durable coronary bypass graft.",
        zh: "前斜角肌将锁骨下动脉分为三段。胸廓内动脉沿胸骨缘下行，是最耐久的冠状动脉旁路移植血管。",
      },
      ids: A(`^${SIDE}(subclavian|internal thoracic) artery$`),
    },
    {
      key: "dot-song",
      tint: "#e39a7a",
      latin: "A. vertebralis",
      name: { vi: "Động mạch đốt sống", en: "Vertebral artery", zh: "椎动脉" },
      note: {
        vi: "Nhánh đầu tiên của động mạch dưới đòn, chui lên qua lỗ mỏm ngang C6–C1.",
        en: "The first branch of the subclavian, climbing through the transverse foramina of C6 to C1.",
        zh: "锁骨下动脉第一分支，经C6至C1横突孔上行。",
      },
      ids: A(`^${SIDE}vertebral artery$`),
    },
    {
      key: "than",
      tint: "#e6c14a",
      latin: "Truncus thyrocervicalis · Truncus costocervicalis",
      name: { vi: "Thân giáp–cổ, sườn–cổ và nhánh", en: "Thyrocervical and costocervical trunks and branches", zh: "甲状颈干、肋颈干及分支" },
      note: {
        vi: "Thân giáp–cổ cho động mạch giáp dưới (nuôi tuyến giáp và cận giáp, đi sát dây thanh quản quặt ngược), cổ nông, trên vai. Thân sườn–cổ cho động mạch cổ sâu và gian sườn trên cùng.",
        en: "The thyrocervical trunk gives the inferior thyroid (to thyroid and parathyroids, close to the recurrent laryngeal nerve), superficial cervical and suprascapular arteries. The costocervical trunk gives the deep cervical and supreme intercostal arteries.",
        zh: "甲状颈干发出甲状腺下动脉（供应甲状腺和甲状旁腺，紧邻喉返神经）、颈浅动脉和肩胛上动脉；肋颈干发出颈深动脉和最上肋间动脉。",
      },
      ids: A(`^${SIDE}(thyrocervical|costocervical) trunk$|^${SIDE}(inferior thyroid|superficial cervical|deep cervical|superior intercostal|suprascapular) artery$`),
    },
    {
      key: "moc",
      latin: "Vertebrae cervicales · Clavicula · Costa I",
      name: { vi: "Cột sống cổ, xương đòn, xương sườn I (mốc)", en: "Cervical spine, clavicles, first ribs (landmarks)", zh: "颈椎、锁骨、第1肋（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: byRe(/^(atlas|axis)$|^(third|fourth|fifth|sixth|seventh) cervical vertebra$|^(left |right )?(clavicle|first rib)$/i, BONE),
    },
  ],
});

// ───────────────────── 12. Thần kinh mắt (V1) ─────────────────────
emit({
  file: "ophthalmic-nerve",
  script: "batch-d",
  exportName: "ophthalmicNerveScene",
  header: 'Scene "Thần kinh mắt (V1)" dựng từ bộ atlas BodyParts3D.\n\nAtlas CHỈ có nhánh V1 trong hốc mắt (không có hạch sinh ba, V2, V3). Bên trái (bẫy #13).',
  scene: {
    slug: "than-kinh-sinh-ba",
    title: { vi: "Thần kinh mắt (V1) và các dây trong hốc mắt", en: "The Ophthalmic Nerve (V1) and Orbital Nerves", zh: "眼神经（V1）与眶内神经" },
    latin: "N. ophthalmicus",
    intro: {
      vi: "Dây sinh ba (V) có ba nhánh: mắt (V1), hàm trên (V2), hàm dưới (V3). Bộ dữ liệu chỉ có nhánh V1 trong hốc mắt nên scene tập trung vào đây. V1 là nhánh cảm giác, qua khe ổ mắt trên và chia ba: dây trán, dây lệ và dây mũi–mi. Dây trán cho dây trên ổ mắt và trên ròng rọc, nuôi cảm giác trán. Dây mũi–mi cho dây mi dài (cảm giác giác mạc) và dây sàng. Vì thế zona ở V1 có mụn nước đầu mũi (dấu Hutchinson), báo hiệu nguy cơ tổn thương mắt. Scene còn có dây vận nhãn III, IV và hạch mi để so sánh. Dây cảm giác màu vàng, dây vận động màu cam; nhãn cầu và cơ mờ sẵn.",
      en: "The trigeminal nerve (V) has three divisions: ophthalmic (V1), maxillary (V2) and mandibular (V3). The dataset has only V1 in the orbit, so the scene focuses there. V1 is sensory; it passes through the superior orbital fissure and splits into three: frontal, lacrimal and nasociliary nerves. The frontal nerve gives the supraorbital and supratrochlear nerves to the forehead. The nasociliary gives the long ciliary nerves (corneal sensation) and ethmoidal nerves. So shingles in V1 with blisters on the nose tip (Hutchinson's sign) warns of eye involvement. The scene also shows the motor nerves III and IV and the ciliary ganglion for comparison. Sensory nerves are yellow, motor orange; the eyeball and muscles are faded.",
      zh: "三叉神经（V）分三支：眼神经（V1）、上颌神经（V2）、下颌神经（V3）。数据集中仅有眶内的V1，故本场景以此为主。V1为感觉神经，经眶上裂分为额神经、泪腺神经和鼻睫神经。额神经发出眶上神经和滑车上神经，分布于前额；鼻睫神经发出睫状长神经（角膜感觉）和筛神经。故V1带状疱疹出现鼻尖水疱（Hutchinson征）提示眼部受累。场景还显示动眼、滑车神经及睫状神经节作对照。感觉神经黄色，运动神经橙色；眼球和眼肌淡化。",
    },
  },
  faded: ["mat"],
  frame: ["goc", "tran", "mui-mi", "le"],
  groups: [
    {
      key: "goc",
      tint: "#d9a400",
      latin: "N. ophthalmicus",
      name: { vi: "Thân dây mắt (V1)", en: "Ophthalmic nerve trunk (V1)", zh: "眼神经干（V1）" },
      note: {
        vi: "Đi trong thành ngoài xoang tĩnh mạch hang rồi chia nhánh trước khi vào hốc mắt.",
        en: "Runs in the lateral wall of the cavernous sinus and divides just before entering the orbit.",
        zh: "行于海绵窦外侧壁，入眶前分支。",
      },
      ids: leftSide(byRe(/^(left |right )?ophthalmic nerve$/i, NER)),
    },
    {
      key: "tran",
      tint: "#f2c14e",
      latin: "N. frontalis · N. supraorbitalis · N. supratrochlearis",
      name: { vi: "Dây trán và hai nhánh tận", en: "Frontal nerve and its two terminal branches", zh: "额神经及其两终支" },
      note: {
        vi: "Chạy trên cơ nâng mi, chia dây trên ổ mắt (qua khuyết trên ổ mắt) và dây trên ròng rọc. Hai dây này là đích gây tê vùng trán.",
        en: "Runs on levator palpebrae and divides into the supraorbital nerve (through the supraorbital notch) and supratrochlear nerve — the targets for a forehead block.",
        zh: "行于上睑提肌上方，分为眶上神经（经眶上切迹）和滑车上神经，为前额阻滞麻醉的靶点。",
      },
      ids: leftSide(byRe(/^(left |right )?(frontal|supra-orbital|supratrochlear) nerve$/i, NER)),
    },
    {
      key: "mui-mi",
      tint: "#e6d36a",
      latin: "N. nasociliaris et rami",
      name: { vi: "Dây mũi–mi và nhánh", en: "Nasociliary nerve and branches", zh: "鼻睫神经及分支" },
      note: {
        vi: "Cho dây mi dài (cảm giác giác mạc, nhánh vào của phản xạ giác mạc), dây sàng trước và sau, dây dưới ròng rọc, cùng nhánh thông với hạch mi.",
        en: "Gives the long ciliary nerves (corneal sensation, the afferent limb of the corneal reflex), the anterior and posterior ethmoidal nerves, the infratrochlear nerve and a communicating branch to the ciliary ganglion.",
        zh: "发出睫状长神经（角膜感觉，角膜反射传入支）、筛前和筛后神经、滑车下神经，以及至睫状神经节的交通支。",
      },
      ids: leftSide(byRe(/^(left |right )?(nasociliary|long ciliary|anterior ethmoidal|posterior ethmoidal|infratrochlear) nerve$|communicating branch of (left |right )?nasociliary nerve/i, NER)),
    },
    {
      key: "le",
      tint: "#c9b458",
      latin: "N. lacrimalis",
      name: { vi: "Dây lệ", en: "Lacrimal nerve", zh: "泪腺神经" },
      note: {
        vi: "Nhánh nhỏ nhất, chạy dọc bờ trên cơ thẳng ngoài tới tuyến lệ. Nó mang thêm sợi tiết dịch từ dây VII, mượn đường qua nhánh V2.",
        en: "The smallest branch, running along the upper border of lateral rectus to the lacrimal gland. It also carries secretory fibres from nerve VII, borrowed via a V2 branch.",
        zh: "最细的分支，沿外直肌上缘至泪腺，并借V2分支携带来自面神经的分泌纤维。",
      },
      ids: leftSide(byRe(/^(left |right )?lacrimal nerve$/i, NER)),
    },
    {
      key: "van-dong",
      tint: "#e8883d",
      latin: "N. oculomotorius (rr. superior, inferior) · N. trochlearis",
      name: { vi: "Dây vận nhãn III và IV (so sánh)", en: "Oculomotor (III) and trochlear (IV) nerves (for comparison)", zh: "动眼神经（III）与滑车神经（IV）（对照）" },
      note: {
        vi: "Dây III chia nhánh trên (cơ thẳng trên, nâng mi) và nhánh dưới (thẳng trong, thẳng dưới, chéo dưới). Dây IV chỉ vận động cơ chéo trên.",
        en: "Nerve III splits into a superior branch (superior rectus, levator) and an inferior branch (medial and inferior rectus, inferior oblique). Nerve IV supplies only superior oblique.",
        zh: "动眼神经分上支（上直肌、上睑提肌）和下支（内直肌、下直肌、下斜肌）。滑车神经仅支配上斜肌。",
      },
      ids: leftSide(byRe(/branch of (left |right )?oculomotor nerve$|^(left |right )?trochlear nerve$/i, NER)),
    },
    {
      key: "hach-mi",
      tint: "#6fae7f",
      latin: "Ganglion ciliare · Nn. ciliares breves",
      name: { vi: "Hạch mi và dây mi ngắn", en: "Ciliary ganglion and short ciliary nerves", zh: "睫状神经节与睫状短神经" },
      note: {
        vi: "Hạch phó giao cảm của dây III. Dây mi ngắn mang sợi làm co đồng tử và điều tiết. Đây là nhánh ra của phản xạ ánh sáng.",
        en: "The parasympathetic ganglion of nerve III. The short ciliary nerves carry fibres that constrict the pupil and accommodate the lens — the efferent limb of the light reflex.",
        zh: "动眼神经的副交感神经节。睫状短神经携带缩瞳和调节纤维，为光反射的传出支。",
      },
      ids: leftSide(byRe(/^(left |right )?ciliary ganglion$|^short ciliary nerve$/i, NER)),
    },
    {
      key: "thi",
      tint: "#e3e0d6",
      latin: "N. opticus",
      name: { vi: "Dây thị giác (II)", en: "Optic nerve (II)", zh: "视神经（II）" },
      note: {
        vi: "Mốc trung tâm của hốc mắt; động mạch mắt đi bên dưới nó qua ống thị giác.",
        en: "The central landmark of the orbit; the ophthalmic artery runs beneath it through the optic canal.",
        zh: "眶内中央标志；眼动脉在其下方经视神经管入眶。",
      },
      ids: leftSide(byRe(/^(left |right )?optic nerve$/i, NER)),
    },
    {
      key: "mat",
      latin: "Bulbus oculi · Mm. bulbi",
      name: { vi: "Nhãn cầu và cơ vận nhãn (mốc)", en: "Eyeball and extraocular muscles (landmarks)", zh: "眼球与眼外肌（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: leftSide(byRe(/^(left |right )?(sclera|cornea|(superior|inferior|medial|lateral) rectus|(superior|inferior) oblique|levator palpebrae superioris)$/i, ["sensory", "muscular"])),
    },
  ],
});

// ───────────────────────── 13. Lệ đạo ─────────────────────────
emit({
  file: "lacrimal",
  script: "batch-d",
  exportName: "lacrimalScene",
  header: 'Scene "Bộ lệ" dựng từ bộ atlas BodyParts3D. Bên trái (bẫy #13).',
  scene: {
    slug: "le-dao",
    title: { vi: "Bộ lệ: tuyến lệ và đường dẫn lệ", en: "The Lacrimal Apparatus", zh: "泪器" },
    latin: "Apparatus lacrimalis",
    intro: {
      vi: "Nước mắt được tuyến lệ tiết ra ở góc trên ngoài hốc mắt. Mỗi lần chớp mắt, nước mắt được đẩy chéo qua giác mạc về góc trong, đọng ở hồ lệ. Từ đó nó chảy qua điểm lệ vào hai lệ quản trên và dưới, rồi vào túi lệ nằm trong hố xương lệ. Cuối cùng nó theo ống lệ–mũi xuống ngách mũi dưới. Vì thế khóc thì chảy nước mũi, và nhỏ thuốc mắt có thể thấy vị đắng ở họng. Tắc ống lệ–mũi bẩm sinh làm trẻ sơ sinh chảy nước mắt liên tục. Mỗi đoạn một sắc xanh; nhãn cầu và xương mờ sẵn.",
      en: "Tears are secreted by the lacrimal gland in the upper outer corner of the orbit. Each blink sweeps them obliquely across the cornea to the inner corner, where they pool in the lacrimal lake. From there they drain through the puncta into the upper and lower canaliculi, then into the lacrimal sac in the fossa of the lacrimal bone. Finally they run down the nasolacrimal duct into the inferior meatus of the nose. That is why crying makes the nose run, and eye drops can be tasted in the throat. Congenital blockage of the nasolacrimal duct makes newborns' eyes water constantly. Each segment has its own shade of blue; the eyeball and bones are faded.",
      zh: "泪液由位于眶外上角的泪腺分泌。每次眨眼将泪液斜向扫过角膜至内眦，积于泪湖；再经泪点进入上、下泪小管，汇入位于泪骨窝内的泪囊；最后沿鼻泪管下行至下鼻道。故哭泣时流鼻涕，滴眼药后咽部可尝到苦味。先天性鼻泪管阻塞致新生儿持续流泪。每段一种蓝色调；眼球和骨骼淡化。",
    },
  },
  faded: ["mat", "xuong"],
  frame: ["tuyen", "ho", "le-quan", "tui", "ong"],
  groups: [
    {
      key: "tuyen",
      tint: "#e6c14a",
      latin: "Glandula lacrimalis",
      name: { vi: "Tuyến lệ", en: "Lacrimal gland", zh: "泪腺" },
      note: {
        vi: "Gân cơ nâng mi chia tuyến thành phần ổ mắt và phần mi. Tuyến do sợi phó giao cảm của dây VII chi phối, nên liệt dây VII trước hạch gối gây khô mắt.",
        en: "The levator aponeurosis divides it into orbital and palpebral parts. It is driven by parasympathetic fibres of nerve VII, so a facial palsy proximal to the geniculate ganglion causes a dry eye.",
        zh: "上睑提肌腱膜将其分为眶部和睑部。受面神经副交感纤维支配，故膝神经节近端的面神经麻痹致眼干。",
      },
      ids: leftSide(byRe(/^(left |right )?lacrimal gland$/i)),
    },
    {
      key: "ho",
      tint: "#a8d0e6",
      latin: "Lacus lacrimalis",
      name: { vi: "Hồ lệ", en: "Lacrimal lake", zh: "泪湖" },
      note: {
        vi: "Khoang nhỏ ở góc mắt trong, nơi nước mắt đọng trước khi vào điểm lệ.",
        en: "The small pool at the inner corner where tears collect before entering the puncta.",
        zh: "内眦处的小凹，泪液在进入泪点前积聚于此。",
      },
      ids: leftSide(byRe(/^(left |right )?lacrimal lake$/i)),
    },
    {
      key: "le-quan",
      tint: "#8fc1e3",
      latin: "Canaliculi lacrimales",
      name: { vi: "Lệ quản trên và dưới", en: "Upper and lower canaliculi", zh: "上、下泪小管" },
      note: {
        vi: "Mỗi lệ quản đi thẳng đứng khoảng 2mm rồi ngoặt ngang khoảng 8mm. Rách mi gần góc trong có thể đứt lệ quản, cần khâu nối sớm.",
        en: "Each runs vertically for about 2mm then turns horizontally for about 8mm. An eyelid tear near the inner corner can sever one and needs early repair.",
        zh: "各泪小管先垂直约2mm，再转为水平约8mm。内眦附近的眼睑裂伤可断裂泪小管，需早期吻合。",
      },
      ids: leftSide(byRe(/^(left |right )?lacrimal canaliculus$/i)),
    },
    {
      key: "tui",
      tint: "#5b9bd5",
      latin: "Saccus lacrimalis",
      name: { vi: "Túi lệ", en: "Lacrimal sac", zh: "泪囊" },
      note: {
        vi: "Nằm trong hố túi lệ giữa xương lệ và mỏm trán xương hàm trên. Viêm túi lệ gây sưng đỏ góc mắt trong.",
        en: "Sits in the lacrimal fossa between the lacrimal bone and the frontal process of the maxilla. Dacryocystitis makes the inner corner red and swollen.",
        zh: "位于泪骨与上颌骨额突之间的泪囊窝内。泪囊炎致内眦红肿。",
      },
      ids: leftSide(byRe(/^(left |right )?lacrimal sac$/i)),
    },
    {
      key: "ong",
      tint: "#2e5f8f",
      latin: "Ductus nasolacrimalis",
      name: { vi: "Ống lệ–mũi", en: "Nasolacrimal duct", zh: "鼻泪管" },
      note: {
        vi: "Dài khoảng 12–18mm, đổ vào ngách mũi dưới dưới xoăn mũi dưới, có van Hasner ở đầu dưới.",
        en: "About 12–18mm long, opening into the inferior meatus under the inferior concha, guarded below by the valve of Hasner.",
        zh: "长约12–18mm，开口于下鼻甲下方的下鼻道，下端有Hasner瓣。",
      },
      ids: leftSide(byRe(/^(left |right )?nasolacrimal duct$/i)),
    },
    {
      key: "day-le",
      tint: "#f2c14e",
      latin: "N. lacrimalis",
      name: { vi: "Dây lệ", en: "Lacrimal nerve", zh: "泪腺神经" },
      note: {
        vi: "Nhánh V1 tới tuyến lệ, mang cảm giác và sợi tiết dịch mượn từ dây VII.",
        en: "The V1 branch to the gland, carrying sensation and secretory fibres borrowed from nerve VII.",
        zh: "至泪腺的V1分支，携带感觉纤维及借自面神经的分泌纤维。",
      },
      ids: leftSide(byRe(/^(left |right )?lacrimal nerve$/i, NER)),
    },
    {
      key: "mi",
      tint: "#d9cfb8",
      latin: "Tarsi superior et inferior",
      name: { vi: "Sụn mi trên và dưới", en: "Upper and lower tarsal plates", zh: "上、下睑板" },
      note: {
        vi: "Khung đặc của mi mắt, chứa tuyến Meibomius tiết lớp dầu của phim nước mắt.",
        en: "The firm skeleton of the lids, holding the meibomian glands that make the oily layer of the tear film.",
        zh: "眼睑的致密支架，内含睑板腺，分泌泪膜油脂层。",
      },
      ids: leftSide(byRe(/^tarsal plate of (left |right )?(upper|lower) eyelid$/i)),
    },
    {
      key: "mat",
      latin: "Bulbus oculi",
      name: { vi: "Nhãn cầu (mốc)", en: "Eyeball (landmark)", zh: "眼球（标志）" },
      note: {
        vi: "Mờ sẵn.",
        en: "Faded.",
        zh: "淡化。",
      },
      ids: leftSide(byRe(/^(left |right )?(sclera|cornea)$/i, ["sensory"])),
    },
    {
      key: "xuong",
      latin: "Os lacrimale · Maxilla · Concha nasalis inferior",
      name: { vi: "Xương lệ, hàm trên, xoăn mũi dưới (mốc)", en: "Lacrimal bone, maxilla, inferior concha (landmarks)", zh: "泪骨、上颌骨、下鼻甲（标志）" },
      note: {
        vi: "Mờ sẵn — thấy đường ống đi xuống mũi.",
        en: "Faded — showing the duct's course down into the nose.",
        zh: "淡化——显示鼻泪管下行入鼻的走行。",
      },
      ids: leftSide(byRe(/^(left |right )?(lacrimal bone|maxilla|inferior nasal concha)$/i, ["skeletal", "sensory", "respiratory"])),
    },
  ],
});
