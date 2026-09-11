/**
 * Scene "Động mạch não trước" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Tai đầy đủ" cũ: atlas chỉ có một lưới tai ngoài, không có tai giữa và tai trong.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const acaScene: AtlasSceneDef = {
  "slug": "tai-day-du",
  "title": {
    "vi": "Động mạch não trước và nhánh vỏ",
    "en": "The Anterior Cerebral Artery",
    "zh": "大脑前动脉"
  },
  "latin": "A. cerebri anterior",
  "system": "cardiovascular",
  "intro": {
    "vi": "Động mạch não trước là nhánh tận nhỏ hơn của động mạch cảnh trong. Nó chạy ra trước trên dây thị giác, nối với bên đối diện qua động mạch thông trước, rồi vòng quanh gối thể chai. Tại đây nó chia hai nhánh chính: động mạch quanh thể chai, bám sát thể chai, và động mạch viền–thể chai, chạy trong rãnh đai. Hai nhánh này nuôi mặt trong thuỳ trán và thuỳ đỉnh, gồm cả tiểu thuỳ cạnh trung tâm, vùng vận động và cảm giác của chân. Tắc động mạch não trước vì thế gây yếu chân đối bên nhiều hơn tay. Mỗi nhánh một sắc đỏ; não mờ sẵn.",
    "en": "The anterior cerebral artery is the smaller terminal branch of the internal carotid. It runs forward above the optic nerve, links with its partner through the anterior communicating artery, then curves round the genu of the corpus callosum. There it divides into two main branches: the pericallosal artery, which hugs the corpus callosum, and the callosomarginal artery, which runs in the cingulate sulcus. They supply the medial surface of the frontal and parietal lobes, including the paracentral lobule, the motor and sensory area for the leg. So an anterior cerebral occlusion weakens the opposite leg more than the arm. Each branch has its own shade of red; the brain is faded.",
    "zh": "大脑前动脉是颈内动脉较小的终支，向前行于视神经上方，经前交通动脉与对侧相连，再绕胼胝体膝部，分为两大支：紧贴胼胝体的胼周动脉和行于扣带沟内的胼缘动脉。它们供应额叶和顶叶内侧面，包括旁中央小叶——下肢的运动和感觉区。故大脑前动脉闭塞时对侧下肢无力重于上肢。每支一种红色调；脑淡化。"
  },
  "frameGroups": [
    "goc",
    "quanh",
    "vien",
    "nen"
  ],
  "fadedGroups": [
    "nao"
  ],
  "groups": [
    {
      "key": "goc",
      "name": {
        "vi": "Đoạn đầu (A1) và động mạch thông trước",
        "en": "First segment (A1) and anterior communicating artery",
        "zh": "A1段与前交通动脉"
      },
      "latin": "A. cerebri anterior (pars precommunicalis) · A. communicans anterior",
      "note": {
        "vi": "Động mạch thông trước ngắn, nối hai bên và là vị trí phình mạch não hay gặp nhất. Phình ở đây vỡ gây xuất huyết dưới nhện.",
        "en": "The short anterior communicating artery links the two sides and is the commonest site of cerebral aneurysm; rupture causes subarachnoid haemorrhage.",
        "zh": "前交通动脉短小，连接两侧，是颅内动脉瘤最常见部位，破裂致蛛网膜下腔出血。"
      },
      "tint": "#8f2d2d",
      "parts": [
        "FJ1654",
        "FJ1654M",
        "FJ1655"
      ]
    },
    {
      "key": "quanh",
      "name": {
        "vi": "Động mạch quanh thể chai và nhánh trước chêm",
        "en": "Pericallosal artery and precuneal branch",
        "zh": "胼周动脉与楔前支"
      },
      "latin": "A. pericallosa · R. precunealis",
      "note": {
        "vi": "Chạy sát mặt trên thể chai về sau, tới lồi thể chai. Nhánh trước chêm nuôi hồi trước chêm ở mặt trong thuỳ đỉnh.",
        "en": "Runs back along the upper surface of the corpus callosum to the splenium. The precuneal branch supplies the precuneus on the medial parietal surface.",
        "zh": "沿胼胝体上面向后至压部。楔前支供应顶叶内侧面的楔前叶。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1671",
        "FJ1671M",
        "FJ1699",
        "FJ1699M"
      ]
    },
    {
      "key": "vien",
      "name": {
        "vi": "Động mạch viền–thể chai và các nhánh",
        "en": "Callosomarginal artery and its branches",
        "zh": "胼缘动脉及其分支"
      },
      "latin": "A. callosomarginalis et rami",
      "note": {
        "vi": "Chạy trong rãnh đai, cho các nhánh trán trong (trước, giữa, sau) và nhánh cạnh trung tâm. Nhánh cạnh trung tâm nuôi tiểu thuỳ cạnh trung tâm, nơi chỉ huy vận động chân và bàng quang.",
        "en": "Runs in the cingulate sulcus and gives the internal frontal branches (anterior, intermediate, posterior) and the paracentral branch. The paracentral branch feeds the paracentral lobule, which controls the leg and bladder.",
        "zh": "行于扣带沟内，发出额内侧支（前、中、后）和旁中央支。旁中央支供应旁中央小叶，支配下肢和膀胱。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1676",
        "FJ1676M",
        "FJ1681",
        "FJ1681M",
        "FJ1696",
        "FJ1696M",
        "FJ1697",
        "FJ1697M",
        "FJ1698",
        "FJ1698M",
        "FJ1722",
        "FJ1722M"
      ]
    },
    {
      "key": "nen",
      "name": {
        "vi": "Động mạch trán–nền trong",
        "en": "Medial frontobasal artery",
        "zh": "额底内侧动脉"
      },
      "latin": "A. frontobasalis medialis",
      "note": {
        "vi": "Nhánh đầu tiên sau động mạch thông trước, nuôi mặt dưới trong thuỳ trán (hồi thẳng, hành khứu).",
        "en": "The first branch after the anterior communicating artery, supplying the inferomedial frontal lobe (gyrus rectus, olfactory bulb).",
        "zh": "前交通动脉后的第一支，供应额叶下内侧面（直回、嗅球）。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1690",
        "FJ1690M"
      ]
    },
    {
      "key": "canh",
      "name": {
        "vi": "Động mạch cảnh trong (nguồn)",
        "en": "Internal carotid artery (source)",
        "zh": "颈内动脉（来源）"
      },
      "latin": "A. carotis interna",
      "note": {
        "vi": "Chia tận thành động mạch não trước và não giữa ở mặt dưới não, cạnh chất thủng trước.",
        "en": "Ends by dividing into the anterior and middle cerebral arteries under the brain, beside the anterior perforated substance.",
        "zh": "在脑底前穿质旁分为大脑前动脉和大脑中动脉。"
      },
      "tint": "#b03a48",
      "parts": [
        "FJ1682",
        "FJ1682M"
      ]
    },
    {
      "key": "nao",
      "name": {
        "vi": "Thể chai và bán cầu (mốc)",
        "en": "Corpus callosum and hemispheres (landmarks)",
        "zh": "胼胝体与大脑半球（标志）"
      },
      "latin": "Corpus callosum · Hemispheria",
      "note": {
        "vi": "Mờ sẵn. Bỏ mờ thể chai để thấy động mạch quanh thể chai ôm lấy nó.",
        "en": "Faded. Unfade the corpus callosum to see the pericallosal artery wrapping it.",
        "zh": "淡化。取消胼胝体淡化可见胼周动脉环绕之。"
      },
      "parts": [
        "FJ1739",
        "FJ1740",
        "FJ1742"
      ]
    }
  ]
};
