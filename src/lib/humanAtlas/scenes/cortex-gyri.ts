/**
 * Scene "Hồi và thùy vỏ đại não" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Tiểu não đầy đủ" cũ (trùng bài "Tiểu não"; atlas chỉ có một lưới tiểu não). Chỉ bán cầu trái.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const cortexGyriScene: AtlasSceneDef = {
  "slug": "tieu-nao-day-du",
  "title": {
    "vi": "Hồi và thùy vỏ đại não",
    "en": "Gyri and Lobes of the Cerebral Cortex",
    "zh": "大脑皮质的脑回与脑叶"
  },
  "latin": "Gyri et lobi cerebri",
  "system": "nervous",
  "intro": {
    "vi": "Vỏ đại não gấp nếp thành hồi và rãnh, nhờ vậy khoảng hai phần ba diện tích nằm khuất trong rãnh. Rãnh trung tâm chia thuỳ trán với thuỳ đỉnh. Rãnh bên tách thuỳ thái dương, và thuỳ đảo nằm sâu trong rãnh này. Thuỳ chẩm nằm sau. Scene dựng bán cầu trái, là bán cầu ưu thế ngôn ngữ ở đa số người, và tô mỗi thuỳ một tông màu. Nhờ vậy dễ định vị vùng vận động, cảm giác, ngôn ngữ, thị giác. Thể chai và thân não mờ sẵn.",
    "en": "The cerebral cortex is folded into gyri and sulci, so about two-thirds of it lies hidden in the sulci. The central sulcus separates the frontal and parietal lobes. The lateral sulcus sets off the temporal lobe, and the insula lies deep within it. The occipital lobe lies behind. The scene shows the left hemisphere, dominant for language in most people, with one colour family per lobe. That makes the motor, sensory, language and visual areas easy to locate. The corpus callosum and brainstem are faded.",
    "zh": "大脑皮质折叠成回和沟，约三分之二面积隐于沟内。中央沟分隔额叶和顶叶；外侧沟分出颞叶，岛叶深藏其中；枕叶位于后方。本场景显示左半球（多数人的语言优势半球），每个脑叶一种色系，便于定位运动、感觉、语言和视觉区。胼胝体和脑干淡化。"
  },
  "frameGroups": [
    "tran",
    "van-dong",
    "dinh",
    "thai-duong",
    "cham"
  ],
  "fadedGroups": [
    "moc"
  ],
  "groups": [
    {
      "key": "tran",
      "name": {
        "vi": "Thuỳ trán: hồi trán trên, giữa, dưới, hồi ổ mắt",
        "en": "Frontal lobe: superior, middle, inferior frontal and orbital gyri",
        "zh": "额叶：额上、中、下回与眶回"
      },
      "latin": "Gyri frontales superior, medius, inferior · Gyri orbitales",
      "note": {
        "vi": "Vỏ trước trán điều hành lập kế hoạch, kiềm chế và nhân cách. Hồi trán dưới bên trái chứa vùng Broca; tổn thương gây nói ngọng ngắt quãng nhưng vẫn hiểu lời.",
        "en": "Prefrontal cortex governs planning, inhibition and personality. The left inferior frontal gyrus holds Broca's area; damage gives halting, effortful speech with comprehension preserved.",
        "zh": "前额叶皮质司计划、抑制和人格。左额下回含Broca区，损伤致言语断续费力但理解保留。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1744",
        "FJ1787",
        "FJ1793",
        "FJ1833"
      ]
    },
    {
      "key": "van-dong",
      "name": {
        "vi": "Hồi trước trung tâm (vỏ vận động)",
        "en": "Precentral gyrus (motor cortex)",
        "zh": "中央前回（运动皮质）"
      },
      "latin": "Gyrus precentralis",
      "note": {
        "vi": "Vỏ vận động chính, xếp theo người tí hon đảo ngược: chân ở mặt trong, tay và mặt ở mặt ngoài. Mỗi bán cầu điều khiển nửa người đối bên.",
        "en": "The primary motor cortex, laid out as an upside-down homunculus: leg on the medial surface, hand and face on the lateral surface. Each hemisphere controls the opposite half of the body.",
        "zh": "初级运动皮质，呈倒置小人排列：下肢在内侧面，手和面部在外侧面。每侧半球支配对侧半身。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1800"
      ]
    },
    {
      "key": "dinh",
      "name": {
        "vi": "Thuỳ đỉnh: hồi sau trung tâm, tiểu thuỳ đỉnh trên, hồi trên viền, hồi góc",
        "en": "Parietal lobe: postcentral, superior parietal, supramarginal, angular",
        "zh": "顶叶：中央后回、顶上小叶、缘上回、角回"
      },
      "latin": "Gyrus postcentralis · Lobulus parietalis superior · Gyri supramarginalis et angularis",
      "note": {
        "vi": "Hồi sau trung tâm là vỏ cảm giác thân thể chính. Tiểu thuỳ đỉnh dưới (hồi trên viền, hồi góc) tích hợp ngôn ngữ đọc–viết. Tổn thương thuỳ đỉnh phải gây mất chú ý nửa người trái.",
        "en": "The postcentral gyrus is the primary somatosensory cortex. The inferior parietal lobule (supramarginal and angular gyri) integrates reading and writing. Right parietal damage causes neglect of the left side.",
        "zh": "中央后回为初级躯体感觉皮质。顶下小叶（缘上回、角回）整合读写功能。右顶叶损伤致左侧忽略。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1732",
        "FJ1797",
        "FJ1835",
        "FJ1841"
      ]
    },
    {
      "key": "thai-duong",
      "name": {
        "vi": "Thuỳ thái dương: hồi thái dương trên, giữa, dưới, hồi hình thoi",
        "en": "Temporal lobe: superior, middle, inferior temporal and fusiform gyri",
        "zh": "颞叶：颞上、中、下回与梭状回"
      },
      "latin": "Gyri temporales superior, medius, inferior · Gyrus fusiformis",
      "note": {
        "vi": "Hồi thái dương trên chứa vỏ thính giác và, ở phần sau bên trái, vùng Wernicke; tổn thương gây nói trôi chảy nhưng vô nghĩa và không hiểu lời. Hồi hình thoi nhận diện khuôn mặt.",
        "en": "The superior temporal gyrus holds the auditory cortex and, posteriorly on the left, Wernicke's area; damage gives fluent but meaningless speech with poor comprehension. The fusiform gyrus recognises faces.",
        "zh": "颞上回含听觉皮质，左侧后部为Wernicke区，损伤致言语流利但无意义、理解障碍。梭状回司面孔识别。"
      },
      "tint": "#6fae7f",
      "parts": [
        "FJ1746",
        "FJ1783",
        "FJ1789",
        "FJ1837",
        "FJ1839"
      ]
    },
    {
      "key": "dao",
      "name": {
        "vi": "Thuỳ đảo",
        "en": "Insula",
        "zh": "岛叶"
      },
      "latin": "Insula",
      "note": {
        "vi": "Nằm khuất dưới các nắp trán, đỉnh, thái dương. Xử lý vị giác, cảm giác nội tạng và nhận biết trạng thái cơ thể.",
        "en": "Hidden beneath the frontal, parietal and temporal opercula. It handles taste, visceral sensation and awareness of the body's state.",
        "zh": "隐于额、顶、颞盖之下。司味觉、内脏感觉及对身体状态的觉知。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1748"
      ]
    },
    {
      "key": "cham",
      "name": {
        "vi": "Thuỳ chẩm (vỏ thị giác)",
        "en": "Occipital lobe (visual cortex)",
        "zh": "枕叶（视皮质）"
      },
      "latin": "Lobus occipitalis",
      "note": {
        "vi": "Vỏ thị giác chính nằm hai bờ rãnh cựa ở mặt trong. Bán cầu trái nhận nửa thị trường phải của cả hai mắt.",
        "en": "The primary visual cortex lines the calcarine sulcus on the medial surface. The left hemisphere receives the right visual field of both eyes.",
        "zh": "初级视皮质位于内侧面距状沟两岸。左半球接收双眼右侧视野。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1791"
      ]
    },
    {
      "key": "vien",
      "name": {
        "vi": "Hồi đai và hồi cạnh hải mã (mặt trong)",
        "en": "Cingulate and parahippocampal gyri (medial surface)",
        "zh": "扣带回与海马旁回（内侧面）"
      },
      "latin": "Gyrus cinguli · Gyrus parahippocampalis",
      "note": {
        "vi": "Hai hồi ôm quanh thể chai và thân não thành thuỳ viền, liên quan cảm xúc và trí nhớ.",
        "en": "Arching round the corpus callosum and brainstem, they form the limbic lobe, involved in emotion and memory.",
        "zh": "环绕胼胝体和脑干构成边缘叶，与情绪和记忆有关。"
      },
      "tint": "#c98bb0",
      "parts": [
        "FJ1739",
        "FJ1785"
      ]
    },
    {
      "key": "moc",
      "name": {
        "vi": "Thể chai, thân não, tiểu não (mốc)",
        "en": "Corpus callosum, brainstem, cerebellum (landmarks)",
        "zh": "胼胝体、脑干、小脑（标志）"
      },
      "latin": "Corpus callosum · Truncus encephali · Cerebellum",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ1742",
        "FJ1769",
        "FJ1770",
        "FJ1775",
        "FJ1781",
        "FJ1817",
        "FJ1822",
        "FJ1830",
        "FJ1831"
      ]
    }
  ]
};
