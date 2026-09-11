/**
 * Scene "Đại não: thuỳ, hồi và não thất" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-brain.mjs — mọi mã FJ đều là mảnh
 * CÓ THẬT trong manifest. Đừng sửa tay file này.
 *
 * Đã xử lý:
 *  1. Não thất lấy theo tên — atlas xếp chúng vào hệ `cardiac`.
 *  2. Thuỳ không có sẵn dạng khối; gộp các hồi theo phân thuỳ giải phẫu.
 *  3. Bỏ dây thị giác (chạy ra nhãn cầu, làm phình khung ngắm).
 */
import type { AtlasSceneDef } from "./types";

export const brainScene: AtlasSceneDef = {
  slug: "dai-nao",
  title: {
    vi: "Đại não: thuỳ, hồi và não thất",
    en: "Cerebrum: Lobes, Gyri & Ventricles",
    zh: "大脑：脑叶、脑回与脑室",
  },
  latin: "Cerebrum",
  intro: {
    vi: "Mỗi bán cầu đại não chia thành các thuỳ trán, đỉnh, thái dương, chẩm và thuỳ đảo giấu bên trong; rãnh trung tâm ngăn hồi vận động (đỏ) với hồi cảm giác (xanh). Bên dưới vỏ là chất trắng, nhân nền, đồi thị và hệ não thất chứa dịch não tuỷ. Màu ở đây theo thuỳ để dễ học — não thật gần như cùng một màu. Dùng Làm mờ hoặc mặt cắt để nhìn các cấu trúc sâu.",
    en: "Each cerebral hemisphere is divided into frontal, parietal, temporal and occipital lobes, with the insula hidden inside; the central sulcus separates the motor gyrus (red) from the sensory gyrus (blue). Beneath the cortex lie the white matter, basal nuclei, thalamus and the ventricles filled with cerebrospinal fluid. Colours here follow the lobes for easier study — the real brain is nearly uniform. Use Fade or the cross-section to see the deep structures.",
    zh: "每侧大脑半球分为额叶、顶叶、颞叶、枕叶，岛叶深藏其内；中央沟分隔运动回（红色）与感觉回（蓝色）。皮质之下是白质、基底核、丘脑以及充满脑脊液的脑室系统。此处按脑叶配色以便学习——真实大脑几乎为同一颜色。使用“淡化”或切面查看深部结构。",
  },
  frameGroups: ["thuy-tran","hoi-truoc-trung-tam","hoi-sau-trung-tam","thuy-dinh","thuy-thai-duong","thuy-cham","tieu-nao","than-nao"],
  groups: [
    {
        "key": "thuy-tran",
        "name": {
            "vi": "Thuỳ trán",
            "en": "Frontal lobe",
            "zh": "额叶"
        },
        "latin": "Lobus frontalis",
        "note": {
            "vi": "Gồm hồi trán trên, giữa, dưới và các hồi ổ mắt. Là nơi lập kế hoạch, ra quyết định và kiểm soát hành vi. Hồi trán dưới bán cầu trội chứa vùng Broca — tổn thương gây mất ngôn ngữ vận động: hiểu được nhưng nói không trôi.",
            "en": "Comprises the superior, middle and inferior frontal gyri and the orbital gyri. It handles planning, decision-making and behavioural control. The inferior frontal gyrus of the dominant hemisphere holds Broca's area — damage causes expressive aphasia: comprehension is kept but speech is halting.",
            "zh": "由额上回、额中回、额下回及眶回组成，负责计划、决策与行为控制。优势半球额下回含布罗卡区——损伤导致运动性失语：能理解但言语不流利。"
        },
        "tint": "#8fb3b0",
        "parts": [
            "FJ1744",
            "FJ1745",
            "FJ1787",
            "FJ1788",
            "FJ1793",
            "FJ1794",
            "FJ1833",
            "FJ1834"
        ]
    },
    {
        "key": "hoi-truoc-trung-tam",
        "name": {
            "vi": "Hồi trước trung tâm (vỏ vận động)",
            "en": "Precentral gyrus (motor cortex)",
            "zh": "中央前回（运动皮质）"
        },
        "latin": "Gyrus precentralis",
        "note": {
            "vi": "Vỏ vận động chính, nằm ngay trước rãnh trung tâm. Cơ thể được chiếu lộn ngược lên hồi này (người nhỏ vận động — homunculus): chân ở mặt trong gần đường giữa, bàn tay và mặt chiếm vùng rất rộng ở mặt ngoài. Mỗi bán cầu điều khiển nửa người BÊN ĐỐI DIỆN.",
            "en": "The primary motor cortex, just in front of the central sulcus. The body is mapped upside-down onto it (the motor homunculus): the leg on the medial surface near the midline, with the hand and face taking up a very large area on the lateral surface. Each hemisphere controls the OPPOSITE side of the body.",
            "zh": "初级运动皮质，位于中央沟前方。身体以倒置方式投射于此（运动小人）：下肢在近中线的内侧面，手和面部在外侧面占据很大面积。每侧半球控制对侧身体。"
        },
        "tint": "#c05245",
        "parts": [
            "FJ1800",
            "FJ1801"
        ]
    },
    {
        "key": "hoi-sau-trung-tam",
        "name": {
            "vi": "Hồi sau trung tâm (vỏ cảm giác)",
            "en": "Postcentral gyrus (sensory cortex)",
            "zh": "中央后回（感觉皮质）"
        },
        "latin": "Gyrus postcentralis",
        "note": {
            "vi": "Vỏ cảm giác thân thể chính, ngay sau rãnh trung tâm, mở đầu thuỳ đỉnh. Nhận cảm giác sờ, đau, nhiệt, tư thế từ nửa người bên đối diện qua đồi thị, cũng theo bản đồ người nhỏ lộn ngược như hồi trước trung tâm.",
            "en": "The primary somatosensory cortex, just behind the central sulcus at the front of the parietal lobe. It receives touch, pain, temperature and position sense from the opposite half of the body via the thalamus, mapped as the same inverted homunculus as the precentral gyrus.",
            "zh": "初级躯体感觉皮质，位于中央沟后方、顶叶最前部。经丘脑接收对侧半身的触、痛、温及位置觉，与中央前回一样呈倒置小人分布。"
        },
        "tint": "#527c9f",
        "parts": [
            "FJ1797",
            "FJ1798"
        ]
    },
    {
        "key": "thuy-dinh",
        "name": {
            "vi": "Thuỳ đỉnh",
            "en": "Parietal lobe",
            "zh": "顶叶"
        },
        "latin": "Lobus parietalis",
        "note": {
            "vi": "Tiểu thuỳ đỉnh trên cùng hồi trên viền và hồi góc (tiểu thuỳ đỉnh dưới). Tích hợp cảm giác thành nhận thức không gian. Tổn thương hồi góc bán cầu trội gây hội chứng Gerstmann (không viết, không tính, lẫn phải-trái, không nhận ra ngón tay); tổn thương thuỳ đỉnh phải gây chứng lãng quên nửa bên trái.",
            "en": "The superior parietal lobule plus the supramarginal and angular gyri (the inferior parietal lobule). It integrates sensation into spatial awareness. Damage to the dominant angular gyrus causes Gerstmann syndrome (agraphia, acalculia, left-right confusion, finger agnosia); right parietal damage causes neglect of the left side.",
            "zh": "包括顶上小叶及缘上回、角回（顶下小叶），将感觉整合为空间认知。优势半球角回损伤导致Gerstmann综合征（失写、失算、左右混淆、手指失认）；右顶叶损伤导致左侧忽略。"
        },
        "tint": "#cfa94f",
        "parts": [
            "FJ1732",
            "FJ1733",
            "FJ1835",
            "FJ1836",
            "FJ1841",
            "FJ1842"
        ]
    },
    {
        "key": "thuy-thai-duong",
        "name": {
            "vi": "Thuỳ thái dương",
            "en": "Temporal lobe",
            "zh": "颞叶"
        },
        "latin": "Lobus temporalis",
        "note": {
            "vi": "Hồi thái dương trên, giữa, dưới và hồi chẩm-thái dương (hồi hình thoi). Hồi thái dương trên chứa vỏ thính giác; phần sau của nó ở bán cầu trội là vùng Wernicke — tổn thương gây mất ngôn ngữ cảm nhận: nói trôi chảy nhưng vô nghĩa, không hiểu lời người khác. Hồi hình thoi nhận diện khuôn mặt.",
            "en": "The superior, middle and inferior temporal gyri and the fusiform (occipitotemporal) gyrus. The superior temporal gyrus holds the auditory cortex; its posterior part in the dominant hemisphere is Wernicke's area — damage causes receptive aphasia: fluent but meaningless speech and poor comprehension. The fusiform gyrus recognises faces.",
            "zh": "包括颞上、中、下回及梭状回（枕颞回）。颞上回含听觉皮质，其优势半球后部为韦尼克区——损伤导致感觉性失语：言语流利但无意义、理解障碍。梭状回负责面孔识别。"
        },
        "tint": "#7fa878",
        "parts": [
            "FJ1746",
            "FJ1747",
            "FJ1783",
            "FJ1784",
            "FJ1789",
            "FJ1790",
            "FJ1837",
            "FJ1838",
            "FJ1839",
            "FJ1840"
        ]
    },
    {
        "key": "thuy-cham",
        "name": {
            "vi": "Thuỳ chẩm",
            "en": "Occipital lobe",
            "zh": "枕叶"
        },
        "latin": "Lobus occipitalis",
        "note": {
            "vi": "Trung tâm thị giác. Vỏ thị giác chính nằm quanh rãnh cựa ở mặt trong. Tổn thương một bên gây bán manh đồng danh BÊN ĐỐI DIỆN nhưng thường chừa vùng hoàng điểm, vì cực chẩm được cả động mạch não giữa lẫn não sau cấp máu.",
            "en": "The visual centre. The primary visual cortex surrounds the calcarine sulcus on the medial surface. A one-sided lesion causes a contralateral homonymous hemianopia that often spares the macula, because the occipital pole is supplied by both the middle and posterior cerebral arteries.",
            "zh": "视觉中枢，初级视皮质位于内侧面距状沟周围。单侧损伤导致对侧同向偏盲，但常保留黄斑视力，因枕极同时接受大脑中动脉和大脑后动脉供血。"
        },
        "tint": "#c98a6b",
        "parts": [
            "FJ1791",
            "FJ1792"
        ]
    },
    {
        "key": "thuy-dao",
        "name": {
            "vi": "Thuỳ đảo",
            "en": "Insula",
            "zh": "岛叶"
        },
        "latin": "Insula",
        "note": {
            "vi": "Thuỳ bị giấu sâu dưới rãnh bên, bị các nắp của thuỳ trán, đỉnh, thái dương che kín — muốn thấy phải làm mờ các thuỳ đó. Xử lý vị giác, cảm giác nội tạng và cảm xúc; động mạch não giữa chạy trên mặt thuỳ đảo.",
            "en": "A lobe hidden deep in the lateral sulcus, covered by the opercula of the frontal, parietal and temporal lobes — fade those lobes to see it. It processes taste, visceral sensation and emotion; the middle cerebral artery runs across its surface.",
            "zh": "深藏于外侧沟内的脑叶，被额、顶、颞叶的岛盖完全覆盖——需淡化这些脑叶才能看到。负责味觉、内脏感觉与情绪，大脑中动脉走行于其表面。"
        },
        "tint": "#a98bc0",
        "parts": [
            "FJ1748",
            "FJ1749"
        ]
    },
    {
        "key": "he-vien",
        "name": {
            "vi": "Hệ viền",
            "en": "Limbic system",
            "zh": "边缘系统"
        },
        "latin": "Systema limbicum",
        "note": {
            "vi": "Vòng cấu trúc ở mặt trong bán cầu: hồi đai, hồi cạnh hải mã, hồi hải mã, hạnh nhân, vòm não và thể vú. Hồi hải mã tạo trí nhớ mới — nó teo sớm trong bệnh Alzheimer; hạnh nhân gắn cảm xúc sợ hãi. Vòng Papez nối hải mã → vòm → thể vú → đồi thị → hồi đai.",
            "en": "A ring of structures on the medial surface: the cingulate and parahippocampal gyri, hippocampus, amygdala, fornix and mammillary bodies. The hippocampus forms new memories — it shrinks early in Alzheimer's disease; the amygdala attaches fear to experiences. The Papez circuit links hippocampus → fornix → mammillary body → thalamus → cingulate gyrus.",
            "zh": "位于半球内侧面的环形结构：扣带回、海马旁回、海马、杏仁体、穹窿及乳头体。海马形成新记忆——阿尔茨海默病时最早萎缩；杏仁体赋予经历恐惧情绪。Papez环路：海马→穹窿→乳头体→丘脑→扣带回。"
        },
        "tint": "#d19aa3",
        "parts": [
            "FJ1739",
            "FJ1740",
            "FJ1741",
            "FJ1753",
            "FJ1756",
            "FJ1759",
            "FJ1768",
            "FJ1778",
            "FJ1785",
            "FJ1786",
            "FJ1804",
            "FJ1807",
            "FJ1815",
            "FJ1825",
            "FJ1829"
        ]
    },
    {
        "key": "the-chai",
        "name": {
            "vi": "Thể chai và các mép",
            "en": "Corpus callosum and commissures",
            "zh": "胼胝体与连合"
        },
        "latin": "Corpus callosum",
        "note": {
            "vi": "Bó sợi trắng lớn nhất nối hai bán cầu, cùng mép trước và mép sau. Vách trong suốt căng giữa thể chai và vòm, ngăn hai não thất bên. Cắt thể chai (điều trị động kinh kháng thuốc) tạo \"não chia đôi\": vật cầm tay trái mà mắt không thấy thì không gọi được tên.",
            "en": "The largest white-matter bundle linking the two hemispheres, together with the anterior and posterior commissures. The septum pellucidum stretches between the corpus callosum and fornix, separating the two lateral ventricles. Cutting the corpus callosum (for drug-resistant epilepsy) creates a \"split brain\": an unseen object held in the left hand cannot be named.",
            "zh": "连接两侧半球的最大白质纤维束，另有前连合与后连合。透明隔张于胼胝体与穹窿之间，分隔两侧侧脑室。切断胼胝体（治疗难治性癫痫）会形成“裂脑”：左手握住但看不见的物体无法说出名称。"
        },
        "tint": "#e3d3b0",
        "parts": [
            "FJ1734",
            "FJ1742",
            "FJ1799",
            "FJ1832"
        ]
    },
    {
        "key": "nhan-nen",
        "name": {
            "vi": "Nhân nền và bao trong",
            "en": "Basal nuclei and internal capsule",
            "zh": "基底核与内囊"
        },
        "latin": "Nuclei basales",
        "note": {
            "vi": "Nhân đuôi, nhân bèo sẫm, nhân cầu nhạt điều chỉnh vận động qua vòng nối với vỏ não và đồi thị — hỏng vòng này là bệnh Parkinson và Huntington. Bao trong là dải chất trắng hẹp chen giữa chúng, chứa bó tháp: một ổ nhồi máu nhỏ ở đây liệt cả nửa người đối diện.",
            "en": "The caudate nucleus, putamen and globus pallidus tune movement through loops with the cortex and thalamus — failure of these loops underlies Parkinson's and Huntington's disease. The internal capsule is the narrow white-matter band squeezed between them carrying the corticospinal tract: a small infarct here paralyses the whole opposite half of the body.",
            "zh": "尾状核、壳核、苍白球通过与皮质和丘脑的环路调节运动——环路失常即帕金森病与亨廷顿病的基础。内囊是夹于其间的狭窄白质带，含皮质脊髓束：此处一个小梗死即可导致对侧偏瘫。"
        },
        "tint": "#8f78b3",
        "parts": [
            "FJ1750",
            "FJ1751",
            "FJ1754",
            "FJ1757",
            "FJ1776",
            "FJ1802",
            "FJ1805",
            "FJ1823"
        ]
    },
    {
        "key": "gian-nao",
        "name": {
            "vi": "Đồi thị và vùng dưới đồi",
            "en": "Thalamus and hypothalamus",
            "zh": "丘脑与下丘脑"
        },
        "latin": "Diencephalon",
        "note": {
            "vi": "Đồi thị là trạm chuyển tiếp: gần như mọi cảm giác (trừ khứu giác) đều dừng ở đây trước khi lên vỏ não; thể gối ngoài chuyển thị giác, thể gối trong chuyển thính giác. Vùng dưới đồi nhỏ nhưng điều khiển thân nhiệt, đói, khát và tuyến yên qua củ xám. Giao thoa và dải thị giác nằm ở đáy.",
            "en": "The thalamus is a relay station: almost every sensation (except smell) stops here before reaching the cortex; the lateral geniculate body relays vision and the medial geniculate body hearing. The small hypothalamus controls body temperature, hunger, thirst and the pituitary via the tuber cinereum. The optic chiasm and tracts lie on its base.",
            "zh": "丘脑是中继站：除嗅觉外几乎所有感觉在抵达皮质前都在此换元；外侧膝状体中继视觉，内侧膝状体中继听觉。下丘脑体积小，却经灰结节控制体温、饥饿、口渴及垂体。视交叉和视束位于其底部。"
        },
        "tint": "#5f9e9a",
        "parts": [
            "FJ1743",
            "FJ1760",
            "FJ1764",
            "FJ1766",
            "FJ1771",
            "FJ1773",
            "FJ1777",
            "FJ1780",
            "FJ1782",
            "FJ1808",
            "FJ1813",
            "FJ1816",
            "FJ1816M",
            "FJ1818",
            "FJ1820",
            "FJ1824",
            "FJ1827",
            "FJ1828"
        ]
    },
    {
        "key": "nao-that",
        "name": {
            "vi": "Hệ não thất",
            "en": "Ventricular system",
            "zh": "脑室系统"
        },
        "latin": "Ventriculi encephali",
        "note": {
            "vi": "Dịch não tuỷ do đám rối mạch mạc tiết ra, chảy từ hai não thất bên qua lỗ gian thất xuống não thất III, qua cống não xuống não thất IV rồi ra khoang dưới nhện. Cống não là chỗ hẹp nhất — tắc ở đây gây não úng thủy. (Atlas xếp nhầm các não thất vào hệ tim.)",
            "en": "Cerebrospinal fluid, made by the choroid plexus, flows from the two lateral ventricles through the interventricular foramina into the third ventricle, down the cerebral aqueduct to the fourth ventricle and out into the subarachnoid space. The aqueduct is the narrowest point — blockage here causes hydrocephalus. (The atlas misfiles the ventricles under the heart.)",
            "zh": "脑脊液由脉络丛分泌，自两侧侧脑室经室间孔流入第三脑室，经中脑导水管至第四脑室，再进入蛛网膜下腔。导水管最狭窄——此处阻塞导致脑积水。（图谱误将脑室归入心脏系统。）"
        },
        "tint": "#6fb3d4",
        "parts": [
            "FJ1730",
            "FJ1731",
            "FJ1738",
            "FJ1752",
            "FJ1755",
            "FJ1767",
            "FJ1803",
            "FJ1814"
        ]
    },
    {
        "key": "chat-trang",
        "name": {
            "vi": "Chất trắng bán cầu",
            "en": "Cerebral white matter",
            "zh": "大脑半球白质"
        },
        "latin": "Substantia alba hemispherii",
        "note": {
            "vi": "Khối sợi trục có myelin nằm dưới vỏ. Trong bộ dữ liệu này chất trắng mỗi bán cầu là MỘT khối lớn bao quanh nhân nền và não thất — làm mờ nó hoặc bật mặt cắt để thấy cấu trúc sâu.",
            "en": "The mass of myelinated axons beneath the cortex. In this dataset each hemisphere's white matter is ONE large block surrounding the basal nuclei and ventricles — fade it or turn on the cross-section to see the deep structures.",
            "zh": "皮质下的有髓轴突团块。本数据集中每侧半球白质为一个整体，包绕基底核与脑室——淡化它或开启切面即可看到深部结构。"
        },
        "parts": [
            "FJ1758",
            "FJ1806"
        ]
    },
    {
        "key": "than-nao",
        "name": {
            "vi": "Thân não",
            "en": "Brainstem",
            "zh": "脑干"
        },
        "latin": "Truncus encephali",
        "note": {
            "vi": "Trung não (có củ não sinh tư và cuống đại não), cầu não và hành não. Chứa nhân của 10/12 đôi dây thần kinh sọ và trung tâm hô hấp, tim mạch — tổn thương nhỏ cũng có thể chết người. Tụt hạnh nhân tiểu não chèn vào hành não là cơ chế tử vong của tăng áp lực nội sọ.",
            "en": "The midbrain (with its colliculi and cerebral peduncles), pons and medulla oblongata. It houses the nuclei of 10 of the 12 cranial nerves and the respiratory and cardiovascular centres — even a small lesion can be fatal. Tonsillar herniation compressing the medulla is how raised intracranial pressure kills.",
            "zh": "包括中脑（含上下丘及大脑脚）、脑桥与延髓。容纳12对脑神经中10对的核团及呼吸、心血管中枢——即使小病灶也可致命。小脑扁桃体疝压迫延髓是颅内压增高致死的机制。"
        },
        "tint": "#b39478",
        "parts": [
            "FJ1735",
            "FJ1736",
            "FJ1761",
            "FJ1762",
            "FJ1763",
            "FJ1769",
            "FJ1770",
            "FJ1774",
            "FJ1775",
            "FJ1779",
            "FJ1809",
            "FJ1810",
            "FJ1817",
            "FJ1821",
            "FJ1822",
            "FJ1826",
            "FJ1831"
        ]
    },
    {
        "key": "tieu-nao",
        "name": {
            "vi": "Tiểu não",
            "en": "Cerebellum",
            "zh": "小脑"
        },
        "latin": "Cerebellum",
        "note": {
            "vi": "Nằm sau thân não, dưới lều tiểu não. Điều hoà thăng bằng, trương lực và phối hợp động tác CÙNG BÊN (khác đại não). Tổn thương gây thất điều: đi loạng choạng, run khi cử động hướng đích. Atlas chỉ có tiểu não dạng khối nguyên, không tách thuỳ giun hay hạnh nhân.",
            "en": "Lies behind the brainstem, beneath the tentorium. It governs balance, tone and coordination on the SAME side (unlike the cerebrum). Damage causes ataxia: an unsteady gait and intention tremor. The atlas only has the cerebellum as a single block, with no separate vermis or tonsils.",
            "zh": "位于脑干后方、小脑幕下方，调节同侧的平衡、肌张力与协调运动（与大脑相反）。损伤导致共济失调：步态不稳、意向性震颤。图谱中小脑仅为整体，未分出蚓部或扁桃体。"
        },
        "tint": "#c7a27a",
        "parts": [
            "FJ1781",
            "FJ1830"
        ]
    },
    {
        "key": "leu-tieu-nao",
        "name": {
            "vi": "Lều tiểu não",
            "en": "Tentorium cerebelli",
            "zh": "小脑幕"
        },
        "latin": "Tentorium cerebelli",
        "note": {
            "vi": "Nếp màng cứng căng như mái lều giữa thuỳ chẩm và tiểu não, chia hộp sọ thành tầng trên lều và dưới lều. Khối choán chỗ trên lều đẩy hồi móc thuỳ thái dương qua khuyết lều, chèn dây III gây giãn đồng tử cùng bên. (Atlas không có liềm đại não.)",
            "en": "A fold of dura stretched like a tent roof between the occipital lobes and cerebellum, dividing the skull into supratentorial and infratentorial compartments. A supratentorial mass pushes the uncus through the tentorial notch, compressing cranial nerve III and dilating the pupil on that side. (The atlas has no falx cerebri.)",
            "zh": "硬脑膜皱襞，如帐篷顶张于枕叶与小脑之间，将颅腔分为幕上与幕下。幕上占位可将颞叶钩回推入小脑幕切迹，压迫动眼神经致同侧瞳孔散大。（图谱中无大脑镰。）"
        },
        "parts": [
            "FJ1843"
        ]
    }
],
};
