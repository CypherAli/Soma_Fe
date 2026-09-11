/**
 * Scene "Tuyến thượng thận" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Tuyến giáp" cũ: atlas không có tuyến giáp, cận giáp. Atlas thiếu ĐM thượng thận trên.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const adrenalScene: AtlasSceneDef = {
  "slug": "tuyen-giap",
  "title": {
    "vi": "Tuyến thượng thận và mạch nuôi",
    "en": "The Adrenal Glands and their Vessels",
    "zh": "肾上腺及其血管"
  },
  "latin": "Glandulae suprarenales",
  "system": "endocrine",
  "intro": {
    "vi": "Hai tuyến thượng thận úp trên cực trên hai thận, nằm sau phúc mạc, trong cùng bao mỡ thận. Mỗi tuyến có hai phần. Vỏ ngoài từ trung bì, tiết aldosteron, cortisol và androgen. Tuỷ trong từ mào thần kinh, tiết adrenalin và noradrenalin. Tuyến được ba nguồn động mạch nuôi: trên (từ động mạch hoành dưới), giữa (từ động mạch chủ) và dưới (từ động mạch thận). Nhưng mỗi tuyến chỉ đổ về một tĩnh mạch. Tĩnh mạch phải ngắn, đổ thẳng vào tĩnh mạch chủ dưới nên dễ rách khi mổ. Tĩnh mạch trái đổ vào tĩnh mạch thận trái. Bộ dữ liệu không có động mạch thượng thận trên. Tuyến màu cam, động mạch đỏ, tĩnh mạch xanh; thận mờ sẵn.",
    "en": "The two adrenal glands cap the upper poles of the kidneys, behind the peritoneum within the renal fat. Each has two parts. The outer cortex, from mesoderm, makes aldosterone, cortisol and androgens. The inner medulla, from neural crest, makes adrenaline and noradrenaline. Each gland has three arterial sources: superior (from the inferior phrenic), middle (from the aorta) and inferior (from the renal artery). But it drains through a single vein. The right vein is short and enters the inferior vena cava directly, so it tears easily at surgery. The left drains into the left renal vein. The dataset has no superior suprarenal artery. The glands are orange, arteries red, veins blue; kidneys are faded.",
    "zh": "两侧肾上腺覆于肾上极，位于腹膜后、肾脂肪囊内。每侧分两部：外层皮质源于中胚层，分泌醛固酮、皮质醇和雄激素；内层髓质源于神经嵴，分泌肾上腺素和去甲肾上腺素。每腺有三个动脉来源：上（来自膈下动脉）、中（来自主动脉）、下（来自肾动脉），但仅一条静脉回流。右肾上腺静脉短，直接注入下腔静脉，手术时易撕裂；左侧注入左肾静脉。数据集中无肾上腺上动脉。腺体橙色，动脉红，静脉蓝；肾淡化。"
  },
  "frameGroups": [
    "tuyen",
    "dm",
    "tm",
    "than"
  ],
  "fadedGroups": [
    "than"
  ],
  "groups": [
    {
      "key": "tuyen",
      "name": {
        "vi": "Tuyến thượng thận phải và trái",
        "en": "Right and left adrenal glands",
        "zh": "左、右肾上腺"
      },
      "latin": "Glandula suprarenalis",
      "note": {
        "vi": "Vỏ có ba lớp: cầu (aldosteron), bó (cortisol), lưới (androgen). U tuỷ thượng thận tiết adrenalin từng cơn gây tăng huyết áp kịch phát, vã mồ hôi, hồi hộp.",
        "en": "The cortex has three zones: glomerulosa (aldosterone), fasciculata (cortisol), reticularis (androgens). A phaeochromocytoma of the medulla releases bursts of adrenaline, causing paroxysmal hypertension, sweating and palpitations.",
        "zh": "皮质分三带：球状带（醛固酮）、束状带（皮质醇）、网状带（雄激素）。髓质嗜铬细胞瘤阵发性释放肾上腺素，致阵发性高血压、出汗和心悸。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3129",
        "FJ3130"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch thượng thận giữa và dưới",
        "en": "Middle and inferior suprarenal arteries",
        "zh": "肾上腺中、下动脉"
      },
      "latin": "Aa. suprarenales media et inferior",
      "note": {
        "vi": "Tuyến thượng thận là một trong những cơ quan được cấp máu nhiều nhất tính theo khối lượng.",
        "en": "Gram for gram, the adrenal is among the best-perfused organs in the body.",
        "zh": "按单位重量计，肾上腺是血供最丰富的器官之一。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ3467",
        "FJ3472",
        "FJ3584",
        "FJ3586"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch thượng thận",
        "en": "Suprarenal veins",
        "zh": "肾上腺静脉"
      },
      "latin": "Vv. suprarenales",
      "note": {
        "vi": "Lấy máu tĩnh mạch thượng thận hai bên để tìm bên tiết aldosteron thừa trong cường aldosteron nguyên phát.",
        "en": "Sampling both adrenal veins locates the side making excess aldosterone in primary hyperaldosteronism.",
        "zh": "原发性醛固酮增多症需双侧肾上腺静脉采血以定位分泌过多的一侧。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3480",
        "FJ3580"
      ]
    },
    {
      "key": "mach-lon",
      "name": {
        "vi": "Động mạch chủ bụng, thận và tĩnh mạch chủ dưới (nguồn)",
        "en": "Abdominal aorta, renal vessels and IVC (sources)",
        "zh": "腹主动脉、肾血管与下腔静脉（来源）"
      },
      "latin": "Aorta abdominalis · A. renalis · V. cava inferior · V. renalis",
      "note": {
        "vi": "Cho thấy tĩnh mạch thượng thận phải đổ thẳng vào tĩnh mạch chủ, còn bên trái đi vòng qua tĩnh mạch thận.",
        "en": "Shows the right adrenal vein entering the IVC directly while the left goes via the renal vein.",
        "zh": "显示右肾上腺静脉直接注入下腔静脉，左侧经肾静脉回流。"
      },
      "tint": "#d99a8f",
      "parts": [
        "FJ1932",
        "FJ2038",
        "FJ2046",
        "FJ3441",
        "FJ3477",
        "FJ3478",
        "FJ3577",
        "FJ3578",
        "FJ3659"
      ]
    },
    {
      "key": "than",
      "name": {
        "vi": "Thận (mốc)",
        "en": "Kidneys (landmarks)",
        "zh": "肾（标志）"
      },
      "latin": "Renes",
      "note": {
        "vi": "Mờ sẵn. Thận ghép hay thận lạc chỗ không kéo tuyến thượng thận theo, vì hai cơ quan có nguồn gốc phôi khác nhau.",
        "en": "Faded. A transplanted or ectopic kidney does not take the adrenal with it, because the two have different embryonic origins.",
        "zh": "淡化。移植肾或异位肾不会带动肾上腺，因二者胚胎起源不同。"
      },
      "parts": [
        "FJ3145",
        "FJ3147"
      ]
    }
  ]
};
