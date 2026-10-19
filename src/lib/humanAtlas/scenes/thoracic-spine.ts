
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Cột sống ngực" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu tuỷ sống, dây chằng dọc và dây chằng vàng. Thiếu đĩa T12.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const thoracicSpineScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/thoracic-spine.ts#thoracicSpineScene", {
  "slug": "cot-song-nguc",
  "title": {
    "vi": "Cột sống ngực",
    "en": "The Thoracic Spine",
    "zh": "胸椎"
  },
  "latin": "Vertebrae thoracicae",
  "intro": {
    "vi": "Mười hai đốt sống ngực có đặc điểm riêng là có diện khớp với xương sườn: ở thân đốt (khớp chỏm sườn) và ở mỏm ngang (khớp sườn–mỏm ngang). Đoạn ngực cong lồi ra sau (gù sinh lý). Nhờ gắn với lồng ngực, đoạn này ít cử động nhất cột sống nhưng vững nhất. Chỗ nối ngực–thắt lưng (T11–L2) chuyển từ đoạn cứng sang đoạn động nên hay gãy nhất trong chấn thương. Scene chia ba đoạn trên, giữa, dưới mỗi đoạn một màu. Đĩa gian đốt màu xanh; xương sườn và động mạch chủ ngực mờ sẵn.",
    "en": "The twelve thoracic vertebrae are distinguished by facets for the ribs, on the bodies (costovertebral joints) and on the transverse processes (costotransverse joints). The thoracic spine curves backward (physiological kyphosis). Tied to the rib cage, it is the least mobile but most stable part of the spine. The thoracolumbar junction (T11–L2), where the stiff segment meets the mobile one, is the commonest site of spinal fracture. The scene divides upper, middle and lower thirds, each with its own colour. Discs are blue; ribs and the thoracic aorta are faded.",
    "zh": "十二块胸椎的特点是有与肋相关节的关节面：椎体上（肋头关节）和横突上（肋横突关节）。胸段向后凸（生理性后凸）。因与胸廓相连，是脊柱中活动最少但最稳定的部分。胸腰交界（T11–L2）由僵硬段过渡为活动段，是脊柱骨折最常见部位。本场景分上、中、下三段，各一种颜色；椎间盘蓝色；肋骨和胸主动脉淡化。"
  },
  "frameGroups": [
    "tren",
    "giua",
    "duoi",
    "dia"
  ],
  "fadedGroups": [
    "suon",
    "mach"
  ],
  "groups": [
    {
      "key": "tren",
      "name": {
        "vi": "Đoạn trên T1–T4",
        "en": "Upper segment T1–T4",
        "zh": "上段T1–T4"
      },
      "latin": "Vertebrae T1–T4",
      "note": {
        "vi": "T1 giống đốt cổ, có diện khớp chỏm sườn I nguyên vẹn. Gai T1 và gai C7 là hai gai nổi rõ nhất ở gốc cổ.",
        "en": "T1 resembles a cervical vertebra and carries a whole facet for rib 1. The spines of C7 and T1 are the most prominent at the base of the neck.",
        "zh": "T1似颈椎，有完整的第1肋头关节面。C7和T1棘突是颈根部最突出的两个棘突。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3158",
        "FJ3160",
        "FJ3163",
        "FJ3166"
      ]
    },
    {
      "key": "giua",
      "name": {
        "vi": "Đoạn giữa T5–T8 (đốt ngực điển hình)",
        "en": "Middle segment T5–T8 (typical thoracic)",
        "zh": "中段T5–T8（典型胸椎）"
      },
      "latin": "Vertebrae T5–T8",
      "note": {
        "vi": "Thân hình tim, gai dài chúc xuống chồng lên nhau như ngói. Lỗ đốt sống tròn và nhỏ, nên tuỷ ngực dễ tổn thương khi trật đốt.",
        "en": "Heart-shaped bodies and long spines sloping down and overlapping like roof tiles. The vertebral foramen is small and round, so the thoracic cord is easily injured in dislocation.",
        "zh": "椎体呈心形，棘突长而下斜，如瓦片重叠。椎孔小而圆，脱位时胸髓易受损。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3169",
        "FJ3171",
        "FJ3173",
        "FJ3174"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Đoạn dưới T9–T12 (chuyển tiếp)",
        "en": "Lower segment T9–T12 (transitional)",
        "zh": "下段T9–T12（过渡段）"
      },
      "latin": "Vertebrae T9–T12",
      "note": {
        "vi": "T11–T12 chỉ có diện khớp chỏm sườn nguyên, không có diện khớp mỏm ngang. Diện khớp dưới T12 quay ra ngoài như đốt thắt lưng.",
        "en": "T11–T12 have whole rib-head facets and no transverse-process facets. T12's lower articular facets face laterally like a lumbar vertebra.",
        "zh": "T11–T12仅有完整肋头关节面，无横突肋凹。T12下关节突朝外，同腰椎。"
      },
      "tint": "#c9b98f",
      "parts": [
        "FJ3154",
        "FJ3155",
        "FJ3156",
        "FJ3175"
      ]
    },
    {
      "key": "dia",
      "name": {
        "vi": "Đĩa gian đốt ngực",
        "en": "Thoracic intervertebral discs",
        "zh": "胸椎间盘"
      },
      "latin": "Disci intervertebrales thoracici",
      "note": {
        "vi": "Mỏng nhất cột sống. Thoát vị đĩa ngực hiếm vì lồng ngực hạn chế cử động.",
        "en": "The thinnest in the spine; thoracic disc herniation is rare because the rib cage limits movement.",
        "zh": "脊柱中最薄的椎间盘；因胸廓限制活动，胸椎间盘突出少见。"
      },
      "tint": "#8fc1e3",
      "parts": [
        "FJ3203",
        "FJ3204",
        "FJ3205",
        "FJ3206",
        "FJ3207",
        "FJ3208",
        "FJ3209",
        "FJ3210",
        "FJ3222",
        "FJ3223",
        "FJ3224"
      ]
    },
    {
      "key": "suon",
      "name": {
        "vi": "Xương sườn (mốc)",
        "en": "Ribs (landmarks)",
        "zh": "肋骨（标志）"
      },
      "latin": "Costae",
      "note": {
        "vi": "Mờ sẵn — thấy chỗ khớp với thân và mỏm ngang.",
        "en": "Faded — showing where they meet the bodies and transverse processes.",
        "zh": "淡化——显示与椎体和横突的关节处。"
      },
      "parts": [
        "FJ3225",
        "FJ3226",
        "FJ3227",
        "FJ3228",
        "FJ3229",
        "FJ3230",
        "FJ3231",
        "FJ3232",
        "FJ3233",
        "FJ3234",
        "FJ3235",
        "FJ3236",
        "FJ3330",
        "FJ3331",
        "FJ3332",
        "FJ3334",
        "FJ3336",
        "FJ3338",
        "FJ3340",
        "FJ3342",
        "FJ3344",
        "FJ3346",
        "FJ3347",
        "FJ3348"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch chủ ngực và tĩnh mạch đơn (liên quan)",
        "en": "Thoracic aorta and azygos vein (relations)",
        "zh": "胸主动脉与奇静脉（毗邻）"
      },
      "latin": "Aorta thoracica · V. azygos",
      "note": {
        "vi": "Động mạch chủ đi bên trái thân đốt, tĩnh mạch đơn bên phải.",
        "en": "The aorta runs left of the vertebral bodies, the azygos vein to the right.",
        "zh": "主动脉行于椎体左侧，奇静脉行于右侧。"
      },
      "tint": "#d99a8f",
      "parts": [
        "FJ1931",
        "FJ3416"
      ]
    }
  ]
});
