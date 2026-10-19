
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Cột sống" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có xương cụt — nêu rõ trong phần giới thiệu, không giấu.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-spine.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const spineScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/spine.ts#spineScene", {
  "slug": "cot-song",
  "title": {
    "vi": "Cột sống",
    "en": "The Vertebral Column",
    "zh": "脊柱"
  },
  "latin": "Columna vertebralis",
  "intro": {
    "vi": "Cột sống gồm 7 đốt cổ, 12 đốt ngực, 5 đốt thắt lưng, xương cùng (5 đốt dính) và xương cụt, xếp thành bốn đường cong sinh lý: cổ và thắt lưng ưỡn ra trước, ngực và cùng gù ra sau. Đốt sống to dần từ trên xuống vì phải chịu sức nặng tăng dần. Giữa các thân đốt là đĩa gian đốt sống giảm chấn. Mỗi đoạn tô một màu; bộ dữ liệu này không có xương cụt.",
    "en": "The vertebral column has 7 cervical, 12 thoracic and 5 lumbar vertebrae, the sacrum (5 fused vertebrae) and the coccyx, arranged in four physiological curves: the cervical and lumbar regions curve forward (lordosis), the thoracic and sacral regions backward (kyphosis). Vertebrae grow larger downward because they carry increasing weight. Intervertebral discs cushion the vertebral bodies. Each region has its own colour; this dataset has no coccyx.",
    "zh": "脊柱由7块颈椎、12块胸椎、5块腰椎、骶骨（5块融合椎骨）和尾骨组成，形成四个生理弯曲：颈曲与腰曲前凸，胸曲与骶曲后凸。椎骨自上而下逐渐增大，因为承受的重量逐渐增加。椎间盘在椎体之间起缓冲作用。各段以不同颜色区分；本数据集无尾骨。"
  },
  "groups": [
    {
      "key": "dot-doi",
      "name": {
        "vi": "Đốt đội (C1)",
        "en": "Atlas (C1)",
        "zh": "寰椎（C1）"
      },
      "latin": "Atlas (C1)",
      "note": {
        "vi": "Đốt sống duy nhất KHÔNG có thân — chỉ là một vòng xương với hai khối bên đỡ lồi cầu xương chẩm. Khớp đội-chẩm cho động tác gật đầu (\"yes\").",
        "en": "The only vertebra with NO body — just a ring of bone with two lateral masses carrying the occipital condyles. The atlanto-occipital joint allows nodding (\"yes\").",
        "zh": "唯一没有椎体的椎骨——仅为骨环，两侧块承托枕髁。寰枕关节完成点头（“是”）动作。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ3176"
      ]
    },
    {
      "key": "dot-truc",
      "name": {
        "vi": "Đốt trục (C2)",
        "en": "Axis (C2)",
        "zh": "枢椎（C2）"
      },
      "latin": "Axis (C2)",
      "note": {
        "vi": "Mỏm răng nhô lên từ thân đốt, cắm vào vòng đốt đội làm trục cho động tác xoay đầu (\"no\") — một nửa biên độ xoay cổ nằm ở khớp này. Gãy mỏm răng là tổn thương nguy hiểm vì sát hành não.",
        "en": "The dens rises from its body into the ring of the atlas and acts as the pivot for turning the head (\"no\") — half of all neck rotation happens here. A fracture of the dens is dangerous because it lies against the medulla.",
        "zh": "齿突自椎体向上伸入寰椎环内，作为转头（“不”）的枢轴——颈部一半的旋转发生于此。齿突骨折因紧邻延髓而十分危险。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ3177"
      ]
    },
    {
      "key": "dot-co",
      "name": {
        "vi": "Đốt sống cổ C3–C7",
        "en": "Cervical vertebrae C3–C7",
        "zh": "颈椎 C3–C7"
      },
      "latin": "Vertebrae cervicales C3–C7",
      "note": {
        "vi": "Thân nhỏ, mỏm ngang có lỗ cho động mạch đốt sống đi lên não. C7 có mỏm gai dài nhất, sờ thấy rõ ở gáy (đốt sống lồi) — mốc để đếm đốt khi khám.",
        "en": "Small bodies, and transverse processes pierced by a foramen for the vertebral artery on its way to the brain. C7 has the longest spinous process, easily felt at the base of the neck (vertebra prominens) — the landmark for counting vertebrae on examination.",
        "zh": "椎体小，横突有孔供椎动脉上行入脑。C7棘突最长，在颈后易于触及（隆椎）——是体检时计数椎骨的标志。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ3161",
        "FJ3164",
        "FJ3167",
        "FJ3170",
        "FJ3172"
      ]
    },
    {
      "key": "dot-nguc",
      "name": {
        "vi": "Đốt sống ngực T1–T12",
        "en": "Thoracic vertebrae T1–T12",
        "zh": "胸椎 T1–T12"
      },
      "latin": "Vertebrae thoracicae T1–T12",
      "note": {
        "vi": "Có diện khớp với xương sườn ở thân và mỏm ngang — đặc điểm chỉ đốt ngực mới có. Mỏm gai dài, chúc xuống chồng lên nhau như ngói lợp nên đoạn ngực ít cử động nhất.",
        "en": "They carry facets for the ribs on their bodies and transverse processes — a feature unique to thoracic vertebrae. Their long spinous processes slope down and overlap like roof tiles, which makes this the least mobile region.",
        "zh": "椎体及横突上有肋凹与肋骨相关节——为胸椎所特有。棘突长且向下倾斜，如屋瓦般叠覆，故胸段活动度最小。"
      },
      "tint": "#d9a066",
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
        "FJ3175"
      ]
    },
    {
      "key": "dot-that-lung",
      "name": {
        "vi": "Đốt sống thắt lưng L1–L5",
        "en": "Lumbar vertebrae L1–L5",
        "zh": "腰椎 L1–L5"
      },
      "latin": "Vertebrae lumbales L1–L5",
      "note": {
        "vi": "Thân to nhất, hình hạt đậu, chịu phần lớn trọng lượng thân trên. Tuỷ sống thường tận hết ở ngang L1–L2, nên chọc dò dịch não tuỷ ở khe L3–L4 hoặc L4–L5 không chạm tuỷ.",
        "en": "The largest, kidney-shaped bodies, carrying most of the upper body's weight. The spinal cord usually ends at L1–L2, so a lumbar puncture at L3–L4 or L4–L5 does not touch the cord.",
        "zh": "椎体最大，呈肾形，承担上半身大部分重量。脊髓通常终止于L1–L2水平，因此在L3–L4或L4–L5间隙行腰椎穿刺不会触及脊髓。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ3157",
        "FJ3159",
        "FJ3162",
        "FJ3165",
        "FJ3168"
      ]
    },
    {
      "key": "xuong-cung",
      "name": {
        "vi": "Xương cùng",
        "en": "Sacrum",
        "zh": "骶骨"
      },
      "latin": "Os sacrum",
      "note": {
        "vi": "Năm đốt cùng dính thành một khối hình tam giác, khớp hai bên với xương chậu qua khớp cùng-chậu, truyền trọng lượng thân xuống hai chân. (Atlas không có xương cụt nối tiếp bên dưới.)",
        "en": "Five sacral vertebrae fused into one triangular block, joined on each side to the hip bones at the sacroiliac joints, transmitting the trunk's weight to the legs. (The atlas has no coccyx below it.)",
        "zh": "五块骶椎融合成三角形骨块，两侧经骶髂关节与髋骨相连，将躯干重量传至下肢。（图谱中其下方无尾骨。）"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ3393"
      ]
    },
    {
      "key": "dia-dem",
      "name": {
        "vi": "Đĩa gian đốt sống",
        "en": "Intervertebral discs",
        "zh": "椎间盘"
      },
      "latin": "Disci intervertebrales",
      "note": {
        "vi": "Nhân nhầy ở giữa, bao quanh bởi vòng sợi. Vòng sợi mỏng nhất ở phía sau-bên, nên thoát vị đĩa đệm thường lồi về phía sau-bên chèn rễ thần kinh — hay gặp nhất ở L4–L5 và L5–S1 gây đau thần kinh toạ.",
        "en": "A gel-like nucleus pulposus surrounded by the annulus fibrosus. The annulus is thinnest posterolaterally, so a disc herniation usually bulges posterolaterally onto a nerve root — most often at L4–L5 and L5–S1, causing sciatica.",
        "zh": "中央为髓核，周围为纤维环。纤维环后外侧最薄，故椎间盘突出多向后外侧压迫神经根——以L4–L5和L5–S1最常见，引起坐骨神经痛。"
      },
      "tint": "#9fc6d6",
      "parts": [
        "FJ3202",
        "FJ3203",
        "FJ3204",
        "FJ3205",
        "FJ3206",
        "FJ3207",
        "FJ3208",
        "FJ3209",
        "FJ3210",
        "FJ3211",
        "FJ3212",
        "FJ3213",
        "FJ3214",
        "FJ3215",
        "FJ3216",
        "FJ3217",
        "FJ3218",
        "FJ3219",
        "FJ3220",
        "FJ3221",
        "FJ3222",
        "FJ3223",
        "FJ3224"
      ]
    }
  ]
});
