/**
 * Scene "Giải phẫu đầu" (tổng quan) dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu cơ mặt, cơ nhai, tuyến mang tai, tai và xoang tĩnh mạch.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const headOverviewScene: AtlasSceneDef = {
  "slug": "giai-phau-dau",
  "title": {
    "vi": "Giải phẫu đầu: tổng quan theo lớp",
    "en": "Anatomy of the Head: an Overview by Layer",
    "zh": "头部解剖：分层概览"
  },
  "latin": "Caput",
  "intro": {
    "vi": "Đầu gồm hai phần: sọ não bọc và bảo vệ não, sọ mặt làm khung cho mắt, mũi, miệng. Scene đi từ ngoài vào trong. Lớp ngoài là xương sọ não (trán, đỉnh, chẩm, thái dương, bướm, sàng) và xương sọ mặt (hàm trên, gò má, mũi, hàm dưới). Tiếp theo là não, gồm đại não, tiểu não và thân não, cùng các mạch não. Sau đó là mắt, răng, lưỡi và hầu. Có thể làm mờ lớp xương để nhìn vào trong. Bộ dữ liệu không có cơ mặt, cơ nhai, tuyến mang tai và tai; các phần này có ở bài chuyên đề khác nếu atlas đủ dữ liệu.",
    "en": "The head has two parts: the neurocranium, which encloses and protects the brain, and the viscerocranium, which frames the eyes, nose and mouth. The scene works from outside in. The outer layer is the bones of the neurocranium (frontal, parietal, occipital, temporal, sphenoid, ethmoid) and of the face (maxilla, zygomatic, nasal, mandible). Next comes the brain, with cerebrum, cerebellum and brainstem, and its arteries. Then come the eyes, teeth, tongue and pharynx. Fade the bone layer to look inside. The dataset has no facial or masticatory muscles, parotid gland or ear; these are covered in other topic scenes where the atlas has the data.",
    "zh": "头部分两部分：脑颅包裹保护脑，面颅构成眼、鼻、口的支架。本场景由外向内：外层为脑颅骨（额、顶、枕、颞、蝶、筛骨）和面颅骨（上颌、颧、鼻、下颌骨）；其次为脑（大脑、小脑、脑干）及脑血管；再为眼、牙、舌和咽。可将骨层淡化以观察内部。数据集中无面肌、咀嚼肌、腮腺和耳，这些在atlas数据充足时另有专题场景。"
  },
  "frameGroups": [
    "so-nao",
    "so-mat"
  ],
  "groups": [
    {
      "key": "so-nao",
      "name": {
        "vi": "Sọ não",
        "en": "Neurocranium",
        "zh": "脑颅"
      },
      "latin": "Neurocranium",
      "note": {
        "vi": "Tám xương: trán, hai đỉnh, chẩm, hai thái dương, bướm, sàng. Chỗ bốn xương trán, đỉnh, thái dương, bướm gặp nhau là điểm pterion, vùng xương mỏng nhất; ngay dưới là động mạch màng não giữa. Chấn thương ở đây dễ gây máu tụ ngoài màng cứng.",
        "en": "Eight bones: frontal, two parietals, occipital, two temporals, sphenoid, ethmoid. The pterion, where frontal, parietal, temporal and sphenoid meet, is the thinnest spot, with the middle meningeal artery right beneath. A blow here readily causes an extradural haematoma.",
        "zh": "八块骨：额骨、两顶骨、枕骨、两颞骨、蝶骨、筛骨。额、顶、颞、蝶四骨交会处为翼点，骨质最薄，其下为脑膜中动脉，此处外伤易致硬膜外血肿。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3199",
        "FJ3200",
        "FJ3274",
        "FJ3281",
        "FJ3309",
        "FJ3380",
        "FJ3386",
        "FJ3394"
      ]
    },
    {
      "key": "so-mat",
      "name": {
        "vi": "Sọ mặt",
        "en": "Viscerocranium (facial skeleton)",
        "zh": "面颅"
      },
      "latin": "Viscerocranium",
      "note": {
        "vi": "Hàm trên, gò má, mũi, lệ, khẩu cái, xoăn mũi dưới (mỗi thứ một đôi), cùng xương lá mía và hàm dưới. Hàm dưới là xương duy nhất của đầu cử động được.",
        "en": "Paired maxillae, zygomatic, nasal, lacrimal, palatine and inferior nasal conchae, plus the vomer and mandible. The mandible is the only movable bone of the head.",
        "zh": "成对的上颌骨、颧骨、鼻骨、泪骨、腭骨、下鼻甲，以及犁骨和下颌骨。下颌骨是头部唯一可动的骨。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3263",
        "FJ3265",
        "FJ3269",
        "FJ3272",
        "FJ3273",
        "FJ3287",
        "FJ3289",
        "FJ3369",
        "FJ3371",
        "FJ3375",
        "FJ3378",
        "FJ3379",
        "FJ3392",
        "FJ3395"
      ]
    },
    {
      "key": "dai-nao",
      "name": {
        "vi": "Đại não",
        "en": "Cerebrum",
        "zh": "大脑"
      },
      "latin": "Cerebrum",
      "note": {
        "vi": "Chiếm khoảng 85% khối lượng não. Hai bán cầu nối qua thể chai.",
        "en": "About 85% of brain mass; the two hemispheres are joined by the corpus callosum.",
        "zh": "约占脑重的85%，两半球借胼胝体相连。"
      },
      "tint": "#e8b4b8",
      "parts": [
        "FJ1732",
        "FJ1733",
        "FJ1739",
        "FJ1740",
        "FJ1744",
        "FJ1745",
        "FJ1746",
        "FJ1747",
        "FJ1748",
        "FJ1749",
        "FJ1758",
        "FJ1783",
        "FJ1784",
        "FJ1785",
        "FJ1786",
        "FJ1787",
        "FJ1788",
        "FJ1789",
        "FJ1790",
        "FJ1791",
        "FJ1792",
        "FJ1793",
        "FJ1794",
        "FJ1797",
        "FJ1798",
        "FJ1800",
        "FJ1801",
        "FJ1806",
        "FJ1833",
        "FJ1834",
        "FJ1835",
        "FJ1836",
        "FJ1837",
        "FJ1838",
        "FJ1839",
        "FJ1840",
        "FJ1841",
        "FJ1842"
      ]
    },
    {
      "key": "tieu-than",
      "name": {
        "vi": "Tiểu não và thân não",
        "en": "Cerebellum and brainstem",
        "zh": "小脑与脑干"
      },
      "latin": "Cerebellum · Truncus encephali",
      "note": {
        "vi": "Tiểu não nằm trong hố sọ sau dưới lều tiểu não. Thân não nối đại não với tuỷ sống và chứa nhân các dây sọ III–XII.",
        "en": "The cerebellum lies in the posterior cranial fossa under the tentorium. The brainstem links cerebrum and spinal cord and holds the nuclei of cranial nerves III–XII.",
        "zh": "小脑位于小脑幕下的颅后窝。脑干连接大脑与脊髓，含第III–XII对脑神经核。"
      },
      "tint": "#c98bb0",
      "parts": [
        "FJ1769",
        "FJ1770",
        "FJ1775",
        "FJ1781",
        "FJ1817",
        "FJ1822",
        "FJ1830",
        "FJ1831"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch não",
        "en": "Cerebral arteries",
        "zh": "脑动脉"
      },
      "latin": "Aa. carotides internae · vertebrales · circulus arteriosus",
      "note": {
        "vi": "Hai động mạch cảnh trong và hai động mạch đốt sống nối nhau thành vòng Willis ở nền não. Não chỉ nặng khoảng 2% cơ thể nhưng nhận khoảng 15% cung lượng tim.",
        "en": "Two internal carotids and two vertebrals join in the circle of Willis at the base of the brain. The brain is about 2% of body weight but receives about 15% of cardiac output.",
        "zh": "两侧颈内动脉和椎动脉在脑底吻合成Willis环。脑重约占体重2%，却接受约15%的心输出量。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1654",
        "FJ1654M",
        "FJ1655",
        "FJ1660",
        "FJ1660M",
        "FJ1672",
        "FJ1682",
        "FJ1682M",
        "FJ1692",
        "FJ1692M",
        "FJ1694",
        "FJ1694M",
        "FJ1713",
        "FJ1713M",
        "FJ1714",
        "FJ1714M",
        "FJ1723",
        "FJ1723M",
        "FJ1725",
        "FJ1725M"
      ]
    },
    {
      "key": "mat",
      "name": {
        "vi": "Nhãn cầu và cơ vận nhãn (bên trái)",
        "en": "Eyeball and extraocular muscles (left)",
        "zh": "眼球与眼外肌（左侧）"
      },
      "latin": "Bulbus oculi · Mm. bulbi",
      "note": {
        "vi": "Chỉ dựng mắt trái vì lưới mắt phải của bộ dữ liệu bị lỗi. Bài Hốc mắt có chi tiết hơn.",
        "en": "Only the left eye is shown because the dataset's right-eye meshes are faulty. See the Orbit scene for detail.",
        "zh": "因数据集右眼网格有误，仅显示左眼。详见眼眶场景。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1289",
        "FJ1294",
        "FJ1295",
        "FJ1297",
        "FJ1304",
        "FJ1305",
        "FJ1308",
        "FJ1317",
        "FJ1322",
        "FJ1323",
        "FJ1331"
      ]
    },
    {
      "key": "mieng",
      "name": {
        "vi": "Răng, lưỡi và hầu",
        "en": "Teeth, tongue and pharynx",
        "zh": "牙、舌与咽"
      },
      "latin": "Dentes · Lingua · Pharynx",
      "note": {
        "vi": "Hầu là ngã tư của đường thở và đường ăn. Các cơ khít hầu đẩy viên thức ăn xuống thực quản.",
        "en": "The pharynx is the crossroads of airway and foodway; its constrictors push the bolus into the oesophagus.",
        "zh": "咽是呼吸道与消化道的交叉口，咽缩肌将食团推入食管。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1254",
        "FJ1255",
        "FJ1256",
        "FJ1257",
        "FJ1258",
        "FJ1259",
        "FJ1260",
        "FJ1261",
        "FJ1262",
        "FJ1263",
        "FJ1264",
        "FJ1265",
        "FJ1266",
        "FJ1267",
        "FJ1268",
        "FJ1269",
        "FJ1270",
        "FJ1271",
        "FJ1272",
        "FJ1273",
        "FJ1274",
        "FJ1275",
        "FJ1276",
        "FJ1277",
        "FJ1278",
        "FJ1279",
        "FJ1280",
        "FJ1281",
        "FJ2740",
        "FJ2742",
        "FJ2747",
        "FJ2752",
        "FJ2754",
        "FJ2759",
        "FJ2761"
      ]
    }
  ]
};
