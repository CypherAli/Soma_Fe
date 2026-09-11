/**
 * Scene "Động mạch não giữa" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Khớp thái dương–hàm" cũ: atlas không có cơ nhai, đĩa khớp và dây chằng khớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const mcaScene: AtlasSceneDef = {
  "slug": "khop-thai-duong-ham",
  "title": {
    "vi": "Động mạch não giữa và nhánh vỏ",
    "en": "The Middle Cerebral Artery",
    "zh": "大脑中动脉"
  },
  "latin": "A. cerebri media",
  "system": "cardiovascular",
  "intro": {
    "vi": "Động mạch não giữa là nhánh tận lớn nhất của động mạch cảnh trong. Nó chạy ngang ra ngoài trong rãnh bên (đoạn bướm, M1), cho các động mạch trung tâm trước ngoài chui vào nhân nền. Tới thuỳ đảo, nó chia các nhánh (đoạn đảo, M2), rồi toả ra phủ gần hết mặt ngoài bán cầu. Vùng nó nuôi gồm vỏ vận động và cảm giác của mặt và tay, cùng vùng ngôn ngữ Broca và Wernicke ở bán cầu ưu thế. Vì thế đột quỵ não giữa gây liệt mặt–tay đối bên và mất ngôn ngữ. Đây là động mạch hay bị tắc nhất trong đột quỵ. Nhánh trán, đỉnh, thái dương mỗi nhóm một sắc đỏ; não mờ sẵn.",
    "en": "The middle cerebral artery is the largest terminal branch of the internal carotid. It runs laterally in the lateral sulcus (sphenoidal segment, M1), giving the anterolateral central arteries that plunge into the basal nuclei. At the insula it divides (insular segment, M2), then fans out over most of the lateral hemisphere. Its territory includes the motor and sensory cortex for face and arm, and Broca's and Wernicke's language areas in the dominant hemisphere. So a middle cerebral stroke causes opposite face–arm weakness and aphasia. It is the artery most often blocked in stroke. Frontal, parietal and temporal branch groups each have a shade of red; the brain is faded.",
    "zh": "大脑中动脉是颈内动脉最大的终支，横行于外侧沟内（蝶部，M1），发出前外侧中央动脉进入基底核；至岛叶分支（岛部，M2），再散布于大脑半球外侧面大部。其供血区包括面部和上肢的运动与感觉皮质，以及优势半球的Broca和Wernicke语言区，故大脑中动脉卒中致对侧面–臂瘫痪和失语。它是卒中最常闭塞的动脉。额、顶、颞支各一种红色调；脑淡化。"
  },
  "frameGroups": [
    "goc",
    "tran",
    "dinh",
    "thai-duong"
  ],
  "fadedGroups": [
    "nao"
  ],
  "groups": [
    {
      "key": "goc",
      "name": {
        "vi": "Đoạn bướm (M1) và đoạn đảo (M2)",
        "en": "Sphenoidal (M1) and insular (M2) segments",
        "zh": "蝶部（M1）与岛部（M2）"
      },
      "latin": "Pars sphenoidalis (M1) · Pars insularis (M2)",
      "note": {
        "vi": "M1 là đích của lấy huyết khối cơ học trong đột quỵ cấp. Ở thuỳ đảo, thân chính thường chia hai: thân trên cho nhánh trán–đỉnh, thân dưới cho nhánh thái dương.",
        "en": "M1 is the target of mechanical thrombectomy in acute stroke. At the insula the trunk usually divides in two: a superior trunk to frontal–parietal branches and an inferior trunk to temporal branches.",
        "zh": "M1是急性卒中机械取栓的靶点。在岛叶主干通常分为上干（额顶支）和下干（颞支）。"
      },
      "tint": "#8f2d2d",
      "parts": [
        "FJ1660",
        "FJ1660M",
        "FJ1692",
        "FJ1692M",
        "FJ1694",
        "FJ1694M",
        "FJ1718",
        "FJ1718M"
      ]
    },
    {
      "key": "trung-tam",
      "name": {
        "vi": "Động mạch trung tâm trước ngoài (vân–đậu)",
        "en": "Anterolateral central (lenticulostriate) arteries",
        "zh": "前外侧中央动脉（豆纹动脉）"
      },
      "latin": "Aa. centrales anterolaterales (lenticulostriatae)",
      "note": {
        "vi": "Các nhánh xuyên nhỏ, vuông góc, nuôi nhân bèo và bao trong. Chúng chịu áp lực cao nên dễ vỡ ở người tăng huyết áp, được gọi là “động mạch đột quỵ”.",
        "en": "Small perforators at right angles that feed the lentiform nucleus and internal capsule. They bear high pressure and rupture readily in hypertension — the “arteries of stroke”.",
        "zh": "垂直发出的细小穿支，供应豆状核和内囊。承受高压，高血压时易破裂，称“卒中动脉”。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1662",
        "FJ1662M",
        "FJ1663",
        "FJ1663M"
      ]
    },
    {
      "key": "tran",
      "name": {
        "vi": "Nhánh trán: trán–nền ngoài, trước trán, rãnh trước trung tâm, rãnh trung tâm",
        "en": "Frontal branches: lateral frontobasal, prefrontal, precentral and central sulcal",
        "zh": "额支：额底外侧、额前、中央前沟、中央沟动脉"
      },
      "latin": "Aa. frontobasalis lateralis, prefrontalis, sulci precentralis, sulci centralis",
      "note": {
        "vi": "Nuôi thuỳ trán ngoài, hồi trước trung tâm (vận động mặt–tay) và vùng Broca ở hồi trán dưới.",
        "en": "Supply the lateral frontal lobe, the precentral gyrus (face–arm motor) and Broca's area in the inferior frontal gyrus.",
        "zh": "供应额叶外侧、中央前回（面–臂运动区）及额下回Broca区。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1664",
        "FJ1664M",
        "FJ1665",
        "FJ1665M",
        "FJ1668",
        "FJ1668M",
        "FJ1669",
        "FJ1669M",
        "FJ1670",
        "FJ1670M",
        "FJ1685",
        "FJ1685M",
        "FJ1686",
        "FJ1686M",
        "FJ1724",
        "FJ1724M"
      ]
    },
    {
      "key": "dinh",
      "name": {
        "vi": "Nhánh đỉnh: rãnh sau trung tâm, đỉnh trước, đỉnh sau, hồi góc",
        "en": "Parietal branches: postcentral sulcal, anterior and posterior parietal, angular",
        "zh": "顶支：中央后沟、顶前、顶后动脉及角回支"
      },
      "latin": "Aa. sulci postcentralis, parietales anterior et posterior, r. gyri angularis",
      "note": {
        "vi": "Nuôi hồi sau trung tâm (cảm giác) và thuỳ đỉnh dưới. Tổn thương hồi góc ở bán cầu ưu thế gây mất đọc, mất viết, mất tính (hội chứng Gerstmann).",
        "en": "Supply the postcentral gyrus (sensation) and inferior parietal lobule. Damage to the angular gyrus in the dominant hemisphere causes alexia, agraphia and acalculia (Gerstmann syndrome).",
        "zh": "供应中央后回（感觉）和顶下小叶。优势半球角回损伤致失读、失写、失算（Gerstmann综合征）。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1666",
        "FJ1666M",
        "FJ1667",
        "FJ1667M",
        "FJ1673",
        "FJ1673M",
        "FJ1716",
        "FJ1716M"
      ]
    },
    {
      "key": "thai-duong",
      "name": {
        "vi": "Nhánh thái dương: cực thái dương, thái dương trước, giữa, sau, thái dương–chẩm",
        "en": "Temporal branches: polar, anterior, middle, posterior, temporo-occipital",
        "zh": "颞支：颞极、颞前、颞中、颞后、颞枕支"
      },
      "latin": "Rr. temporales · A. temporalis polaris · R. temporooccipitalis",
      "note": {
        "vi": "Nuôi mặt ngoài thuỳ thái dương, gồm vùng Wernicke (hiểu lời nói) ở phần sau hồi thái dương trên.",
        "en": "Supply the lateral temporal lobe, including Wernicke's area (comprehension) in the posterior superior temporal gyrus.",
        "zh": "供应颞叶外侧面，包括颞上回后部的Wernicke区（语言理解）。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1659",
        "FJ1659M",
        "FJ1693",
        "FJ1693M",
        "FJ1712",
        "FJ1712M",
        "FJ1717",
        "FJ1717M",
        "FJ1729",
        "FJ1729M"
      ]
    },
    {
      "key": "nao",
      "name": {
        "vi": "Thuỳ đảo và các hồi mặt ngoài (mốc)",
        "en": "Insula and lateral gyri (landmarks)",
        "zh": "岛叶与外侧面脑回（标志）"
      },
      "latin": "Insula · Gyri",
      "note": {
        "vi": "Mờ sẵn. Bỏ mờ thuỳ đảo để thấy đoạn M2 nằm trên nó.",
        "en": "Faded. Unfade the insula to see M2 lying on it.",
        "zh": "淡化。取消岛叶淡化可见M2段位于其上。"
      },
      "parts": [
        "FJ1744",
        "FJ1745",
        "FJ1748",
        "FJ1749",
        "FJ1797",
        "FJ1798",
        "FJ1800",
        "FJ1801"
      ]
    }
  ]
};
