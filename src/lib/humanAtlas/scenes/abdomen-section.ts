/**
 * Scene "Mặt cắt ngang bụng" (tầng L1) dựng từ bộ atlas BodyParts3D.
 * 
 * Mặt cắt bật sẵn — xem `clip`.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-abdomen-section.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const abdomenSectionScene: AtlasSceneDef = {
  "slug": "mat-cat-ngang-bung",
  "title": {
    "vi": "Mặt cắt ngang bụng (tầng L1)",
    "en": "Transverse Section of the Abdomen (L1)",
    "zh": "腹部横断面（L1平面）"
  },
  "latin": "Planum transpyloricum",
  "view": "top",
  "intro": {
    "vi": "Lát cắt ngang qua thân đốt L1 — mặt phẳng qua môn vị, tầng chứa nhiều mốc nhất ổ bụng: gan, túi mật, môn vị, tuỵ, lách, hai thận, động mạch chủ, tĩnh mạch chủ dưới. Mặt cắt đã BẬT SẴN; kéo thanh trượt mặt cắt để đi lên xuống từng tầng như lướt phim CT, hoặc tắt để nhìn nguyên khối. Mỗi tạng một màu.",
    "en": "An axial slice through the body of L1 — the transpyloric plane, the most landmark-rich level of the abdomen: liver, gallbladder, pylorus, pancreas, spleen, both kidneys, aorta and IVC. The cross-section is ON from the start; drag the section slider to move up and down like scrolling a CT scan, or switch it off to see everything whole. Each organ has its own colour.",
    "zh": "经L1椎体的横断面——幽门平面，腹部标志最丰富的层面：肝、胆囊、幽门、胰、脾、两肾、主动脉、下腔静脉。切面已预先开启；拖动切面滑块可像浏览CT一样上下移动层面，或关闭切面查看整体。各器官以不同颜色显示。"
  },
  "clip": {
    "axis": "y",
    "percent": 67,
    "keepPositive": false
  },
  "groups": [
    {
      "key": "cot-song",
      "name": {
        "vi": "Đốt sống T12–L2",
        "en": "Vertebrae T12–L2",
        "zh": "T12–L2椎骨"
      },
      "latin": "Vertebrae T12–L2",
      "note": {
        "vi": "Mốc định tầng: lát cắt qua thân L1. Trên CT, cột sống luôn ở giữa-sau, là điểm bắt đầu để đọc mọi mặt cắt ngang.",
        "en": "The level marker: this slice passes through the body of L1. On CT the spine always sits posterior-central — the starting point for reading any axial slice.",
        "zh": "定位标志：此层面经L1椎体。CT上脊柱总位于中后部——阅读任何横断面的起点。"
      },
      "parts": [
        "FJ3156",
        "FJ3157",
        "FJ3159"
      ]
    },
    {
      "key": "gan-mat",
      "name": {
        "vi": "Gan và túi mật",
        "en": "Liver and gallbladder",
        "zh": "肝与胆囊"
      },
      "latin": "Hepar · Vesica biliaris",
      "note": {
        "vi": "Chiếm gần hết nửa phải lát cắt. Quy ước đọc CT: bên phải người bệnh nằm bên TRÁI màn hình — nhìn từ chân lên.",
        "en": "Fills most of the right half of the slice. CT convention: the patient's right is on the LEFT of the screen — viewed from the feet.",
        "zh": "占据层面右半的大部分。CT阅片惯例：患者右侧显示在屏幕左侧——即从足侧向头侧观察。"
      },
      "tint": "#9a4e3e",
      "parts": [
        "FJ2816",
        "FJ2818",
        "FJ2819",
        "FJ2820",
        "FJ2821",
        "FJ2822",
        "FJ2823",
        "FJ2824",
        "FJ2817"
      ]
    },
    {
      "key": "da-day-ta-trang",
      "name": {
        "vi": "Dạ dày và tá tràng",
        "en": "Stomach and duodenum",
        "zh": "胃与十二指肠"
      },
      "latin": "Gaster · Duodenum",
      "note": {
        "vi": "Mặt phẳng qua môn vị (Addison) ngang L1 cắt qua môn vị, đầu tuỵ, rốn hai thận và đáy túi mật — một lát cắt chứa nhiều mốc nhất ổ bụng.",
        "en": "The transpyloric plane (Addison's) at L1 crosses the pylorus, pancreatic head, both renal hila and the gallbladder fundus — the most landmark-rich slice of the abdomen.",
        "zh": "经L1的幽门平面（Addison平面）穿过幽门、胰头、两肾门和胆囊底——腹部标志最丰富的层面。"
      },
      "tint": "#e8a37a",
      "parts": [
        "FJ2564",
        "FJ2573"
      ]
    },
    {
      "key": "tuy",
      "name": {
        "vi": "Tuỵ",
        "en": "Pancreas",
        "zh": "胰"
      },
      "latin": "Pancreas",
      "note": {
        "vi": "Nằm ngang trước động mạch chủ và cột sống — nên lực ép trước-sau (tay lái) dập tuỵ vào cột sống.",
        "en": "Lies across the front of the aorta and spine — so an anteroposterior blow (steering wheel) crushes it against the spine.",
        "zh": "横卧于主动脉和脊柱前方——故前后方向的暴力（方向盘）可将胰挤压于脊柱上。"
      },
      "tint": "#e0b36a",
      "parts": [
        "FJ2629"
      ]
    },
    {
      "key": "lach",
      "name": {
        "vi": "Lách",
        "en": "Spleen",
        "zh": "脾"
      },
      "latin": "Splen",
      "note": {
        "vi": "Ở sau-ngoài bên trái, sát cơ hoành và xương sườn IX–XI.",
        "en": "Posterolateral on the left, against the diaphragm and ribs IX–XI.",
        "zh": "位于左后外侧，紧贴膈和第9–11肋。"
      },
      "tint": "#7a3a4f",
      "parts": [
        "FJ2561"
      ]
    },
    {
      "key": "than",
      "name": {
        "vi": "Thận và tuyến thượng thận",
        "en": "Kidneys and adrenals",
        "zh": "肾与肾上腺"
      },
      "latin": "Renes · Glandulae suprarenales",
      "note": {
        "vi": "Hai bên cột sống, sau phúc mạc. Ở tầng L1 thường cắt qua rốn thận trái, còn thận phải (thấp hơn) cắt qua cực trên.",
        "en": "Either side of the spine, retroperitoneal. At L1 the slice usually passes through the left renal hilum but only the upper pole of the (lower) right kidney.",
        "zh": "位于脊柱两侧腹膜后。L1层面通常经过左肾门，而位置较低的右肾仅切到上极。"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ3129",
        "FJ3130",
        "FJ3145",
        "FJ3147"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch chủ và mạc treo tràng trên",
        "en": "Aorta and superior mesenteric artery",
        "zh": "主动脉与肠系膜上动脉"
      },
      "latin": "Aorta · A. mesenterica superior",
      "note": {
        "vi": "Động mạch chủ ngay trước-trái thân đốt sống; mạc treo tràng trên tách ra phía trước ở tầng này.",
        "en": "The aorta sits just anterior-left of the vertebral body; the SMA arises from its front at this level.",
        "zh": "主动脉紧贴椎体左前方；肠系膜上动脉在此平面自其前壁发出。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1846",
        "FJ1928",
        "FJ1932"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch chủ dưới và tĩnh mạch cửa",
        "en": "IVC and portal vein",
        "zh": "下腔静脉与门静脉"
      },
      "latin": "V. cava inferior · V. portae",
      "note": {
        "vi": "Tĩnh mạch chủ dưới bên phải động mạch chủ; tĩnh mạch cửa ở trước hơn, sau cổ tuỵ.",
        "en": "The IVC lies right of the aorta; the portal vein lies further forward, behind the neck of the pancreas.",
        "zh": "下腔静脉位于主动脉右侧；门静脉更靠前，位于胰颈后方。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ1853",
        "FJ3441",
        "FJ3659",
        "FJ3477",
        "FJ3478",
        "FJ3577",
        "FJ3578"
      ]
    },
    {
      "key": "dai-trang",
      "name": {
        "vi": "Đại tràng",
        "en": "Colon",
        "zh": "结肠"
      },
      "latin": "Colon",
      "note": {
        "vi": "Góc gan và góc lách đại tràng ở hai bên, đại tràng ngang phía trước.",
        "en": "The hepatic and splenic flexures at the sides, the transverse colon in front.",
        "zh": "两侧为结肠肝曲和脾曲，前方为横结肠。"
      },
      "tint": "#a8764f",
      "parts": [
        "FJ2566",
        "FJ2567",
        "FJ2572"
      ]
    },
    {
      "key": "co",
      "name": {
        "vi": "Cơ hoành và cơ thắt lưng",
        "en": "Diaphragm and psoas",
        "zh": "膈与腰大肌"
      },
      "latin": "Diaphragma · M. psoas major",
      "note": {
        "vi": "Hai trụ hoành ôm động mạch chủ ở tầng này; cơ thắt lưng lớn bắt đầu xuất hiện hai bên thân đốt.",
        "en": "The two crura of the diaphragm hug the aorta at this level; psoas major begins to appear beside the vertebral bodies.",
        "zh": "此平面两膈脚环抱主动脉；腰大肌开始出现于椎体两侧。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ3131",
        "FJ1431",
        "FJ1431M"
      ]
    }
  ]
};
