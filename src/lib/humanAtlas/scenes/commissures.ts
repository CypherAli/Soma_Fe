/**
 * Scene "Thể chai và các mép liên bán cầu" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Cơ mặt và thần kinh VII" cũ: atlas không có cơ bám da mặt và dây VII.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const commissuresScene: AtlasSceneDef = {
  "slug": "co-mat-than-kinh-vii",
  "title": {
    "vi": "Thể chai, vòm não và các mép liên bán cầu",
    "en": "Corpus Callosum, Fornix and Commissures",
    "zh": "胼胝体、穹窿与连合"
  },
  "latin": "Commissurae telencephali",
  "system": "nervous",
  "intro": {
    "vi": "Hai bán cầu trao đổi thông tin qua các bó sợi bắt ngang đường giữa, gọi là mép. Lớn nhất là thể chai, gồm khoảng 200 triệu sợi, chia thành mỏ, gối, thân và lồi. Mép trước nối hai thuỳ thái dương và vùng khứu. Mép sau nằm trên cống não, dùng cho phản xạ đồng tử. Vòm não là bó ra của hải mã, uốn cong dưới thể chai rồi tận ở thể vú. Hai trụ vòm nối nhau qua mép vòm. Vách trong suốt căng giữa thể chai và vòm. Mỗi cấu trúc một màu; não thất bên mờ sẵn.",
    "en": "The two hemispheres communicate through bundles of fibres crossing the midline, called commissures. The largest is the corpus callosum, about 200 million fibres, divided into rostrum, genu, body and splenium. The anterior commissure links the temporal lobes and olfactory areas. The posterior commissure lies above the cerebral aqueduct and serves the pupillary reflex. The fornix is the output tract of the hippocampus, arching beneath the corpus callosum to end in the mammillary bodies. Its two crura are joined by the commissure of the fornix. The septum pellucidum stretches between the corpus callosum and fornix. Each structure has its own colour; the lateral ventricles are faded.",
    "zh": "两半球经跨越中线的纤维束（连合）交换信息。最大者为胼胝体，约2亿根纤维，分嘴、膝、干、压部。前连合连接两侧颞叶和嗅区；后连合位于中脑水管上方，参与瞳孔反射。穹窿是海马的传出束，在胼胝体下方弓形走行，止于乳头体；两侧穹窿脚借穹窿连合相连。透明隔张于胼胝体与穹窿之间。每个结构一种颜色；侧脑室淡化。"
  },
  "frameGroups": [
    "the-chai",
    "vom",
    "mep",
    "vach"
  ],
  "fadedGroups": [
    "nao-that"
  ],
  "groups": [
    {
      "key": "the-chai",
      "name": {
        "vi": "Thể chai",
        "en": "Corpus callosum",
        "zh": "胼胝体"
      },
      "latin": "Corpus callosum",
      "note": {
        "vi": "Cắt thể chai từng được dùng chữa động kinh kháng thuốc. Người bệnh sau mổ không gọi được tên vật cầm ở tay trái khi nhắm mắt, vì thông tin không sang được bán cầu ngôn ngữ (hội chứng tách não).",
        "en": "Cutting it was once used to treat drug-resistant epilepsy. Afterwards, patients cannot name an object held in the left hand with eyes closed, because the information cannot reach the language hemisphere (split-brain syndrome).",
        "zh": "胼胝体切开术曾用于治疗药物难治性癫痫。术后患者闭眼时无法说出左手所持物体名称，因信息不能传至语言半球（裂脑综合征）。"
      },
      "tint": "#e3e0d6",
      "parts": [
        "FJ1742"
      ]
    },
    {
      "key": "vom",
      "name": {
        "vi": "Vòm não và mép vòm",
        "en": "Fornix and its commissure",
        "zh": "穹窿与穹窿连合"
      },
      "latin": "Fornix · Commissura fornicis",
      "note": {
        "vi": "Mắt xích của vòng Papez (hải mã → vòm → thể vú → đồi thị → hồi đai). Tổn thương hai bên gây mất trí nhớ mới.",
        "en": "A link in the Papez circuit (hippocampus → fornix → mammillary body → thalamus → cingulate gyrus). Bilateral damage impairs forming new memories.",
        "zh": "Papez环路的一环（海马→穹窿→乳头体→丘脑→扣带回）。双侧损伤致近记忆障碍。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1741",
        "FJ1756",
        "FJ1804"
      ]
    },
    {
      "key": "mep",
      "name": {
        "vi": "Mép trước, mép sau và cuống tùng",
        "en": "Anterior, posterior and habenular commissures",
        "zh": "前连合、后连合与缰连合"
      },
      "latin": "Commissura anterior · Commissura posterior · Commissura habenularum",
      "note": {
        "vi": "Mép trước và mép sau là hai mốc dựng hệ toạ độ chuẩn (đường AC–PC) trong chụp và phẫu thuật định vị não.",
        "en": "The anterior and posterior commissures are the two landmarks of the standard AC–PC coordinate line used in brain imaging and stereotactic surgery.",
        "zh": "前、后连合是脑成像和立体定向手术中标准AC–PC坐标线的两个标志。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1734",
        "FJ1743",
        "FJ1799"
      ]
    },
    {
      "key": "vach",
      "name": {
        "vi": "Vách trong suốt và mảnh cùng",
        "en": "Septum pellucidum and lamina terminalis",
        "zh": "透明隔与终板"
      },
      "latin": "Septum pellucidum · Lamina terminalis",
      "note": {
        "vi": "Vách trong suốt ngăn sừng trán hai não thất bên. Mảnh cùng là thành trước não thất ba, đánh dấu đầu mút ống thần kinh phôi.",
        "en": "The septum pellucidum divides the frontal horns of the two lateral ventricles. The lamina terminalis is the front wall of the third ventricle, marking the end of the embryonic neural tube.",
        "zh": "透明隔分隔两侧侧脑室前角。终板为第三脑室前壁，标志胚胎神经管的末端。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1764",
        "FJ1832"
      ]
    },
    {
      "key": "the-vu",
      "name": {
        "vi": "Thể vú (tận của vòm)",
        "en": "Mammillary bodies (end of the fornix)",
        "zh": "乳头体（穹窿终点）"
      },
      "latin": "Corpora mammillaria",
      "note": {
        "vi": "Teo thể vú gặp trong hội chứng Wernicke–Korsakoff do thiếu vitamin B1 ở người nghiện rượu.",
        "en": "Mammillary atrophy is seen in Wernicke–Korsakoff syndrome from thiamine deficiency in alcoholism.",
        "zh": "酒精中毒维生素B1缺乏所致Wernicke–Korsakoff综合征可见乳头体萎缩。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1768",
        "FJ1815"
      ]
    },
    {
      "key": "hai-ma",
      "name": {
        "vi": "Hải mã (gốc của vòm)",
        "en": "Hippocampus (origin of the fornix)",
        "zh": "海马（穹窿起点）"
      },
      "latin": "Hippocampus",
      "note": {
        "vi": "Nằm ở sàn sừng thái dương não thất bên. Là nơi đầu tiên teo trong bệnh Alzheimer.",
        "en": "Lies in the floor of the temporal horn of the lateral ventricle and is the first region to shrink in Alzheimer's disease.",
        "zh": "位于侧脑室下角底，阿尔茨海默病中最早萎缩。"
      },
      "tint": "#c98bb0",
      "parts": [
        "FJ1759",
        "FJ1807"
      ]
    },
    {
      "key": "nao-that",
      "name": {
        "vi": "Não thất bên và não thất ba (mốc)",
        "en": "Lateral and third ventricles (landmarks)",
        "zh": "侧脑室与第三脑室（标志）"
      },
      "latin": "Ventriculi laterales et tertius",
      "note": {
        "vi": "Mờ sẵn — thể chai làm mái, vòm làm bờ trong của não thất bên.",
        "en": "Faded — the corpus callosum forms the roof, and the fornix the medial edge, of the lateral ventricle.",
        "zh": "淡化——胼胝体构成侧脑室顶，穹窿构成其内侧缘。"
      },
      "parts": [
        "FJ1730",
        "FJ1767",
        "FJ1814"
      ]
    }
  ]
};
