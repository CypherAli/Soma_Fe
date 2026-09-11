/**
 * Scene "Bộ răng" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas có 28 răng vĩnh viễn, không có răng khôn.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-teeth.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const teethScene: AtlasSceneDef = {
  "slug": "bo-rang",
  "title": {
    "vi": "Bộ răng",
    "en": "The Dentition",
    "zh": "牙列"
  },
  "latin": "Dentes",
  "intro": {
    "vi": "Người trưởng thành có 32 răng vĩnh viễn, mỗi phần tư hàm gồm 2 răng cửa, 1 răng nanh, 2 răng tiền hàm và 3 răng hàm (công thức 2-1-2-3). Bộ dữ liệu này có 28 chiếc — thiếu 4 răng khôn. Hình dạng đi theo chức năng: răng cửa cắt, răng nanh xé, răng tiền hàm và răng hàm nghiền. Mỗi loại răng tô một màu; xương hàm để màu gốc làm nền.",
    "en": "An adult has 32 permanent teeth; each quadrant holds 2 incisors, 1 canine, 2 premolars and 3 molars (dental formula 2-1-2-3). This dataset has 28 — the 4 wisdom teeth are missing. Shape follows function: incisors cut, canines tear, premolars and molars grind. Each tooth type has its own colour; the jaws are left in their natural colour as background.",
    "zh": "成人有32颗恒牙，每个象限含2颗切牙、1颗尖牙、2颗前磨牙和3颗磨牙（牙式2-1-2-3）。本数据集有28颗——缺4颗智齿。形态与功能相应：切牙切断、尖牙撕裂、前磨牙与磨牙研磨。每类牙各用一色；颌骨保留原色作为背景。"
  },
  "groups": [
    {
      "key": "rang-cua",
      "name": {
        "vi": "Răng cửa",
        "en": "Incisors",
        "zh": "切牙"
      },
      "latin": "Dentes incisivi",
      "note": {
        "vi": "8 răng cửa (giữa và bên, trên và dưới), thân dẹt như lưỡi đục, một chân răng, dùng để cắt thức ăn. Răng cửa giữa hàm dưới mọc lúc khoảng 6–7 tuổi, cùng đợt với răng hàm lớn I — là những răng vĩnh viễn mọc sớm nhất.",
        "en": "8 incisors (central and lateral, upper and lower) with flat chisel-like crowns and a single root, used for cutting food. The lower central incisors erupt at about 6–7 years, together with the first molars — the earliest permanent teeth.",
        "zh": "共8颗切牙（中切牙与侧切牙，上下颌），牙冠扁平如凿，单根，用于切断食物。下颌中切牙约6–7岁萌出，与第一磨牙同期——为最早萌出的恒牙。"
      },
      "tint": "#e8d9a8",
      "parts": [
        "FJ1258",
        "FJ1259",
        "FJ1265",
        "FJ1266",
        "FJ1272",
        "FJ1273",
        "FJ1279",
        "FJ1280"
      ]
    },
    {
      "key": "rang-nanh",
      "name": {
        "vi": "Răng nanh",
        "en": "Canines",
        "zh": "尖牙"
      },
      "latin": "Dentes canini",
      "note": {
        "vi": "4 răng nanh, chân dài nhất trong bộ răng (răng nanh trên có thể dài tới 27mm), giúp xé thức ăn và giữ hình dáng góc miệng. Nhờ chân dài, đây thường là răng còn lại lâu nhất ở người già.",
        "en": "4 canines with the longest roots of any teeth (the upper canine can reach 27mm), used for tearing and supporting the corner of the mouth. Thanks to those roots they are often the last teeth to be lost in old age.",
        "zh": "共4颗尖牙，牙根为全口最长（上颌尖牙可达27mm），用于撕裂食物并支撑口角外形。因根长，常是老年人最后脱落的牙。"
      },
      "tint": "#d9a066",
      "parts": [
        "FJ1260",
        "FJ1267",
        "FJ1274",
        "FJ1281"
      ]
    },
    {
      "key": "rang-tien-ham",
      "name": {
        "vi": "Răng tiền hàm",
        "en": "Premolars",
        "zh": "前磨牙"
      },
      "latin": "Dentes premolares",
      "note": {
        "vi": "8 răng tiền hàm, mặt nhai có hai núm, thay cho răng hàm sữa. Hay bị nhổ khi chỉnh nha để lấy chỗ cho các răng khác xếp thẳng hàng.",
        "en": "8 premolars with two-cusped chewing surfaces, replacing the primary molars. They are the teeth most often extracted in orthodontics to make room for the others to align.",
        "zh": "共8颗前磨牙，咬合面有两个牙尖，替换乳磨牙。正畸治疗中最常拔除它们，为其他牙齿排齐腾出空间。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ1255",
        "FJ1257",
        "FJ1262",
        "FJ1264",
        "FJ1269",
        "FJ1271",
        "FJ1277",
        "FJ1278"
      ]
    },
    {
      "key": "rang-ham",
      "name": {
        "vi": "Răng hàm lớn",
        "en": "Molars",
        "zh": "磨牙"
      },
      "latin": "Dentes molares",
      "note": {
        "vi": "8 răng hàm lớn I và II (thiếu răng hàm III — răng khôn). Mặt nhai rộng nhiều núm, nghiền thức ăn; răng hàm trên có ba chân, hàm dưới hai chân. Răng hàm lớn I mọc lúc 6 tuổi, không thay — rãnh sâu mặt nhai khiến nó sâu răng sớm nhất.",
        "en": "8 first and second molars (the third molars — wisdom teeth — are missing). Broad multi-cusped surfaces grind food; upper molars have three roots, lower molars two. The first molar erupts at 6, is never replaced, and its deep fissures make it the first tooth to decay.",
        "zh": "共8颗第一、第二磨牙（缺第三磨牙即智齿）。咬合面宽、多牙尖，研磨食物；上颌磨牙三根，下颌磨牙两根。第一磨牙6岁萌出、终生不换，其深窝沟使之最早发生龋坏。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1254",
        "FJ1256",
        "FJ1261",
        "FJ1263",
        "FJ1268",
        "FJ1270",
        "FJ1275",
        "FJ1276"
      ]
    },
    {
      "key": "loi",
      "name": {
        "vi": "Lợi (nướu)",
        "en": "Gingiva",
        "zh": "牙龈"
      },
      "latin": "Gingiva",
      "note": {
        "vi": "Niêm mạc ôm cổ răng và phủ xương ổ răng. Viêm lợi không điều trị lan xuống dây chằng quanh răng thành viêm nha chu — nguyên nhân mất răng hàng đầu ở người lớn. (Atlas xếp lợi vào hệ xương.)",
        "en": "The mucosa hugging the tooth necks and covering the alveolar bone. Untreated gingivitis spreads to the periodontal ligament as periodontitis — the leading cause of tooth loss in adults. (The atlas files the gingiva under the skeleton.)",
        "zh": "包绕牙颈并覆盖牙槽骨的黏膜。牙龈炎未经治疗可向下蔓延至牙周膜形成牙周炎——成人失牙的首要原因。（图谱将牙龈归入骨骼系统。）"
      },
      "tint": "#d98c8c",
      "parts": [
        "FJ1252",
        "FJ1253"
      ]
    },
    {
      "key": "xuong-ham-tren",
      "name": {
        "vi": "Xương hàm trên",
        "en": "Maxillae",
        "zh": "上颌骨"
      },
      "latin": "Maxilla",
      "note": {
        "vi": "Mang cung răng trên trong mỏm huyệt răng. Chân răng hàm trên có thể nhô vào đáy xoang hàm, nên nhổ răng này có thể thủng xoang.",
        "en": "Carries the upper arch in its alveolar process. Upper molar roots can project into the floor of the maxillary sinus, so extracting them can perforate the sinus.",
        "zh": "借牙槽突承载上牙弓。上颌磨牙根可突入上颌窦底，拔除时可能穿通上颌窦。"
      },
      "parts": [
        "FJ3269",
        "FJ3375"
      ]
    },
    {
      "key": "xuong-ham-duoi",
      "name": {
        "vi": "Xương hàm dưới",
        "en": "Mandible",
        "zh": "下颌骨"
      },
      "latin": "Mandibula",
      "note": {
        "vi": "Mang cung răng dưới. Thần kinh huyệt răng dưới chạy trong ống hàm dưới ngay dưới chân răng hàm — gây tê ở lỗ hàm dưới làm tê cả nửa cung răng dưới và nửa môi dưới.",
        "en": "Carries the lower arch. The inferior alveolar nerve runs in the mandibular canal just below the molar roots — an injection at the mandibular foramen numbs half the lower arch and half the lower lip.",
        "zh": "承载下牙弓。下牙槽神经走行于磨牙根下方的下颌管内——在下颌孔处阻滞麻醉可使半侧下牙弓及半侧下唇麻木。"
      },
      "parts": [
        "FJ3289"
      ]
    }
  ]
};
