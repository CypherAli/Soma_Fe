/**
 * Scene "Cơ dựng sống và cơ ngang gai" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Cơ bụng" cũ: atlas thiếu cơ thẳng bụng, chéo trong, ngang bụng. Atlas thiếu cơ nhiều chân.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const erectorSpinaeScene: AtlasSceneDef = {
  "slug": "co-bung",
  "title": {
    "vi": "Cơ lưng sâu: dựng sống và ngang gai",
    "en": "The Deep Back: Erector Spinae and Transversospinales",
    "zh": "背深肌：竖脊肌与横突棘肌"
  },
  "latin": "Mm. erector spinae · Mm. transversospinales",
  "system": "muscular",
  "intro": {
    "vi": "Cơ lưng thật (cơ lưng sâu) nằm trong rãnh hai bên gai đốt sống, do nhánh sau dây sống chi phối. Cơ dựng sống ở nông, gồm ba cột từ ngoài vào trong: chậu–sườn, cơ dài và cơ gai. Nó duỗi và giữ thẳng cột sống, là cơ chống trọng lực chính khi đứng. Sâu hơn là nhóm ngang gai (bán gai, xoay) chạy chéo từ mỏm ngang lên gai, xoay và giữ vững từng đốt. Sâu nhất là cơ gian gai và gian ngang nối từng đốt kề. Mỗi cột một tông màu; cột sống và xương sườn mờ sẵn. Bộ dữ liệu không có cơ nhiều chân.",
    "en": "The true (deep) back muscles lie in the groove either side of the spines and are supplied by the posterior rami of the spinal nerves. Erector spinae is superficial, in three columns from lateral to medial: iliocostalis, longissimus and spinalis. It extends and holds the spine erect, the main antigravity muscle in standing. Deeper lies the transversospinalis group (semispinalis, rotatores), running obliquely from transverse processes up to spines, rotating and stabilising each segment. Deepest are the interspinales and intertransversarii linking adjacent vertebrae. Each column has its own colour family; spine and ribs are faded. The dataset has no multifidus.",
    "zh": "固有背肌（背深肌）位于棘突两侧沟内，受脊神经后支支配。竖脊肌居浅层，由外向内分三柱：髂肋肌、最长肌、棘肌，伸直并维持脊柱挺立，是站立时主要的抗重力肌。深层为横突棘肌群（半棘肌、回旋肌），自横突斜向上至棘突，旋转并稳定各节段。最深为连接相邻椎骨的棘间肌和横突间肌。每柱一种色系；脊柱和肋骨淡化。数据集中无多裂肌。"
  },
  "frameGroups": [
    "chau-suon",
    "dai",
    "gai",
    "ban-gai",
    "sau"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "chau-suon",
      "name": {
        "vi": "Cột ngoài: cơ chậu–sườn",
        "en": "Lateral column: iliocostalis",
        "zh": "外侧柱：髂肋肌"
      },
      "latin": "M. iliocostalis (lumborum, thoracis, cervicis)",
      "note": {
        "vi": "Từ mào chậu và xương cùng lên góc các xương sườn và mỏm ngang đốt cổ dưới. Co một bên làm nghiêng thân cùng bên.",
        "en": "From the iliac crest and sacrum up to the angles of the ribs and the lower cervical transverse processes. Acting alone it bends the trunk to its own side.",
        "zh": "自髂嵴和骶骨上至各肋角及下颈椎横突。单侧收缩使躯干侧屈。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1526",
        "FJ1526M",
        "FJ1527",
        "FJ1527M",
        "FJ1528",
        "FJ1528M"
      ]
    },
    {
      "key": "dai",
      "name": {
        "vi": "Cột giữa: cơ dài",
        "en": "Intermediate column: longissimus",
        "zh": "中间柱：最长肌"
      },
      "latin": "M. longissimus (thoracis, cervicis, capitis)",
      "note": {
        "vi": "Cột dài và to nhất, lên tới tận mỏm chũm xương thái dương. Co thắt cơ dài thắt lưng là nguyên nhân hay gặp của đau lưng cấp.",
        "en": "The longest and bulkiest column, reaching as high as the mastoid process. Spasm of the lumbar part is a common cause of acute low back pain.",
        "zh": "最长最粗的一柱，上达颞骨乳突。腰部最长肌痉挛是急性腰痛的常见原因。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1533",
        "FJ1533M",
        "FJ1534",
        "FJ1534M",
        "FJ1535",
        "FJ1535M"
      ]
    },
    {
      "key": "gai",
      "name": {
        "vi": "Cột trong: cơ gai",
        "en": "Medial column: spinalis",
        "zh": "内侧柱：棘肌"
      },
      "latin": "M. spinalis",
      "note": {
        "vi": "Mảnh nhất, nối gai với gai, rõ nhất ở đoạn ngực.",
        "en": "The slenderest, running spine to spine, best developed in the thoracic region.",
        "zh": "最细，连于棘突之间，胸段最发达。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1543",
        "FJ1543M",
        "FJ1544",
        "FJ1544M"
      ]
    },
    {
      "key": "ban-gai",
      "name": {
        "vi": "Nhóm ngang gai: cơ bán gai",
        "en": "Transversospinalis: semispinalis",
        "zh": "横突棘肌：半棘肌"
      },
      "latin": "M. semispinalis (thoracis, cervicis, capitis)",
      "note": {
        "vi": "Vượt qua 4–6 đốt. Bán gai đầu là cơ lớn nhất vùng gáy, giữ đầu ngửa.",
        "en": "Spans 4–6 vertebrae. Semispinalis capitis is the largest muscle of the nape and holds the head up.",
        "zh": "跨越4–6个椎骨。头半棘肌是项部最大肌，维持头部后仰。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1538",
        "FJ1538M",
        "FJ1539",
        "FJ1539M",
        "FJ1540",
        "FJ1540M"
      ]
    },
    {
      "key": "xoay",
      "name": {
        "vi": "Nhóm ngang gai: cơ xoay",
        "en": "Transversospinalis: rotatores",
        "zh": "横突棘肌：回旋肌"
      },
      "latin": "Mm. rotatores",
      "note": {
        "vi": "Ngắn nhất, chỉ vượt 1–2 đốt, dày đặc thụ thể cảm nhận tư thế. Chúng giống cảm biến hơn là động cơ.",
        "en": "The shortest, spanning 1–2 vertebrae and dense with position-sense receptors — more sensors than motors.",
        "zh": "最短，仅跨1–2个椎骨，富含本体感受器——更像传感器而非动力源。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ1522",
        "FJ1522M",
        "FJ1524",
        "FJ1524M",
        "FJ1525",
        "FJ1525M"
      ]
    },
    {
      "key": "sau",
      "name": {
        "vi": "Lớp sâu nhất: gian gai, gian ngang, nâng sườn",
        "en": "Deepest layer: interspinales, intertransversarii, levatores costarum",
        "zh": "最深层：棘间肌、横突间肌、肋提肌"
      },
      "latin": "Mm. interspinales · intertransversarii · levatores costarum",
      "note": {
        "vi": "Nối từng đốt kề nhau. Cơ nâng sườn từ mỏm ngang tới xương sườn bên dưới, phụ nâng sườn khi thở.",
        "en": "Link each vertebra to the next. The levatores costarum run from transverse processes to the rib below and help raise the ribs in breathing.",
        "zh": "连接相邻椎骨。肋提肌自横突至下位肋，辅助呼吸时提肋。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1462",
        "FJ1462M",
        "FJ1463",
        "FJ1463M",
        "FJ1547",
        "FJ1547M",
        "FJ1548",
        "FJ1548M",
        "FJ1549",
        "FJ1549M",
        "FJ1550",
        "FJ1550M",
        "FJ1551",
        "FJ1551M",
        "FJ1552",
        "FJ1552M",
        "FJ1553",
        "FJ1553M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Cột sống, xương sườn, xương cùng (mốc)",
        "en": "Spine, ribs, sacrum (landmarks)",
        "zh": "脊柱、肋骨、骶骨（标志）"
      },
      "latin": "Columna vertebralis · Costae · Os sacrum",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3154",
        "FJ3155",
        "FJ3156",
        "FJ3158",
        "FJ3160",
        "FJ3163",
        "FJ3166",
        "FJ3169",
        "FJ3171",
        "FJ3173",
        "FJ3174",
        "FJ3175",
        "FJ3157",
        "FJ3159",
        "FJ3162",
        "FJ3165",
        "FJ3168",
        "FJ3161",
        "FJ3164",
        "FJ3167",
        "FJ3170",
        "FJ3172",
        "FJ3393"
      ]
    }
  ]
};
