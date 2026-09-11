/**
 * Scene "Động mạch não sau" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Hố dưới thái dương" cũ: atlas không có cơ chân bướm, ĐM hàm, dây hàm dưới.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const pcaScene: AtlasSceneDef = {
  "slug": "ho-duoi-thai-duong",
  "title": {
    "vi": "Động mạch não sau và nhánh vỏ",
    "en": "The Posterior Cerebral Artery",
    "zh": "大脑后动脉"
  },
  "latin": "A. cerebri posterior",
  "system": "cardiovascular",
  "intro": {
    "vi": "Hai động mạch não sau là hai nhánh tận của động mạch thân nền, tách ở bờ trên cầu não. Đoạn trước thông (P1) nối với động mạch thông sau để khép vòng Willis. Sau đó động mạch vòng quanh cuống đại não, chia thành động mạch chẩm ngoài (nuôi mặt dưới thuỳ thái dương) và động mạch chẩm trong (nuôi thuỳ chẩm). Nhánh cựa của động mạch chẩm trong nuôi vỏ thị giác. Tắc động mạch não sau gây mất nửa thị trường đối bên, thường còn giữ thị lực trung tâm vì cực chẩm có thêm máu từ động mạch não giữa. Mỗi nhánh một sắc đỏ; thân não và thuỳ chẩm mờ sẵn.",
    "en": "The two posterior cerebral arteries are the terminal branches of the basilar artery, arising at the upper border of the pons. The precommunicating segment (P1) meets the posterior communicating artery to close the circle of Willis. The artery then winds round the cerebral peduncle and divides into the lateral occipital artery (to the inferior temporal lobe) and the medial occipital artery (to the occipital lobe). The calcarine branch of the medial occipital feeds the visual cortex. Posterior cerebral occlusion causes opposite homonymous hemianopia, often sparing central vision because the occipital pole also receives middle cerebral blood. Each branch has its own shade of red; brainstem and occipital lobe are faded.",
    "zh": "两侧大脑后动脉为基底动脉的终支，在脑桥上缘发出。交通前部（P1）与后交通动脉相接，闭合Willis环。随后绕大脑脚，分为枕外侧动脉（供应颞叶下面）和枕内侧动脉（供应枕叶），后者的距状沟支供应视皮质。大脑后动脉闭塞致对侧同向偏盲，常保留中心视力，因枕极亦受大脑中动脉供血。每支一种红色调；脑干和枕叶淡化。"
  },
  "frameGroups": [
    "goc",
    "cham-ngoai",
    "cham-trong",
    "thong-sau"
  ],
  "fadedGroups": [
    "nao"
  ],
  "groups": [
    {
      "key": "than-nen",
      "name": {
        "vi": "Động mạch thân nền (nguồn)",
        "en": "Basilar artery (source)",
        "zh": "基底动脉（来源）"
      },
      "latin": "A. basilaris",
      "note": {
        "vi": "Chia đôi ở rãnh cầu–cuống. Dây III thoát ra giữa động mạch não sau và động mạch tiểu não trên, nên phình mạch ở đây có thể gây liệt dây III.",
        "en": "Divides at the pontomesencephalic junction. Nerve III emerges between the posterior cerebral and superior cerebellar arteries, so an aneurysm here can palsy nerve III.",
        "zh": "在脑桥中脑沟处分叉。动眼神经穿行于大脑后动脉与小脑上动脉之间，此处动脉瘤可致动眼神经麻痹。"
      },
      "tint": "#8f2d2d",
      "parts": [
        "FJ1672"
      ]
    },
    {
      "key": "goc",
      "name": {
        "vi": "Đoạn trước thông (P1) và sau thông (P2)",
        "en": "Precommunicating (P1) and postcommunicating (P2) parts",
        "zh": "交通前部（P1）与交通后部（P2）"
      },
      "latin": "Pars precommunicalis (P1) · Pars postcommunicalis (P2)",
      "note": {
        "vi": "Khoảng 20% người có động mạch não sau nhận máu chủ yếu từ động mạch cảnh trong qua thông sau (kiểu thai nhi). Khi đó P1 rất nhỏ.",
        "en": "In about 20% of people the posterior cerebral gets most of its blood from the internal carotid via the posterior communicating (fetal pattern); P1 is then tiny.",
        "zh": "约20%人群的大脑后动脉主要经后交通动脉由颈内动脉供血（胚胎型），此时P1很细。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1714",
        "FJ1714M",
        "FJ1723",
        "FJ1723M"
      ]
    },
    {
      "key": "thong-sau",
      "name": {
        "vi": "Động mạch thông sau",
        "en": "Posterior communicating artery",
        "zh": "后交通动脉"
      },
      "latin": "A. communicans posterior",
      "note": {
        "vi": "Nối hệ cảnh trong với hệ thân nền. Phình ở chỗ nối với cảnh trong hay gây liệt dây III kèm giãn đồng tử.",
        "en": "Links the carotid and vertebrobasilar systems. An aneurysm at its junction with the carotid classically causes nerve III palsy with a dilated pupil.",
        "zh": "连接颈内动脉系与椎基底动脉系。其与颈内动脉连接处的动脉瘤典型地引起伴瞳孔散大的动眼神经麻痹。"
      },
      "tint": "#b03a48",
      "parts": [
        "FJ1713",
        "FJ1713M"
      ]
    },
    {
      "key": "cham-ngoai",
      "name": {
        "vi": "Động mạch chẩm ngoài và nhánh thái dương",
        "en": "Lateral occipital artery and temporal branches",
        "zh": "枕外侧动脉及颞支"
      },
      "latin": "A. occipitalis lateralis et rr. temporales",
      "note": {
        "vi": "Các nhánh thái dương trước, giữa, sau nuôi mặt dưới thuỳ thái dương, gồm hồi hải mã và hồi chẩm–thái dương (hồi hình thoi, vùng nhận diện khuôn mặt).",
        "en": "Its anterior, middle and posterior temporal branches supply the inferior temporal surface, including the parahippocampal and fusiform gyri (the face-recognition area).",
        "zh": "颞前、中、后支供应颞叶下面，包括海马旁回和梭状回（面孔识别区）。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1661",
        "FJ1661M",
        "FJ1680",
        "FJ1680M",
        "FJ1687",
        "FJ1687M",
        "FJ1719",
        "FJ1719M"
      ]
    },
    {
      "key": "cham-trong",
      "name": {
        "vi": "Động mạch chẩm trong và nhánh lồi thể chai",
        "en": "Medial occipital artery and splenial branch",
        "zh": "枕内侧动脉与胼胝体压部支"
      },
      "latin": "A. occipitalis medialis · R. corporis callosi dorsalis (a. splenialis)",
      "note": {
        "vi": "Chia nhánh cựa (vỏ thị giác) và nhánh đỉnh–chẩm. Nhánh lồi thể chai nối với động mạch quanh thể chai của hệ não trước.",
        "en": "Divides into calcarine (visual cortex) and parieto-occipital branches. The splenial branch joins the pericallosal artery of the anterior system.",
        "zh": "分为距状沟支（视皮质）和顶枕支。压部支与大脑前动脉系的胼周动脉吻合。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1677",
        "FJ1677M",
        "FJ1678",
        "FJ1678M",
        "FJ1691",
        "FJ1691M"
      ]
    },
    {
      "key": "nao",
      "name": {
        "vi": "Thân não, thuỳ chẩm (mốc)",
        "en": "Brainstem and occipital lobe (landmarks)",
        "zh": "脑干与枕叶（标志）"
      },
      "latin": "Truncus encephali · Lobus occipitalis",
      "note": {
        "vi": "Mờ sẵn — thấy động mạch vòng quanh cuống đại não để ra sau.",
        "en": "Faded — showing the artery winding round the cerebral peduncle to reach the back of the brain.",
        "zh": "淡化——显示动脉绕大脑脚行向后方。"
      },
      "parts": [
        "FJ1770",
        "FJ1774",
        "FJ1775",
        "FJ1783",
        "FJ1784",
        "FJ1785",
        "FJ1786",
        "FJ1791",
        "FJ1792",
        "FJ1817",
        "FJ1821",
        "FJ1822"
      ]
    }
  ]
};
