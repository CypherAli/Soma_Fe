/**
 * Sinh scene "Mặt cắt ngang bụng" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-abdomen-section.mjs
 *
 * Bài bản chất là MỘT LÁT CẮT ngang qua L1 (mặt phẳng qua môn vị). Scene
 * khai `clip` để mặt cắt bật sẵn; `percent` tính từ hộp bao Y của chính các
 * mảnh trong bài sao cho lát rơi đúng giữa thân đốt L1 (đo từ atlas).
 * Giữ nửa DƯỚI (keepPositive=false) để nhìn mặt cắt từ trên xuống như phim CT
 * lật ngược. Gan lấy 8 phân thuỳ đã kiểm (bỏ bản sao), tuỵ lấy FJ2629.
 */
import { byRe, byName, emit, P, DEOXY, OXY } from "./lib.mjs";

const LIVER = ["FJ2816", "FJ2818", "FJ2819", "FJ2820", "FJ2821", "FJ2822", "FJ2823", "FJ2824"];

const groups = [
  {
    key: "cot-song",
    latin: "Vertebrae T12–L2",
    name: { vi: "Đốt sống T12–L2", en: "Vertebrae T12–L2", zh: "T12–L2椎骨" },
    note: {
      vi: "Mốc định tầng: lát cắt qua thân L1. Trên CT, cột sống luôn ở giữa-sau, là điểm bắt đầu để đọc mọi mặt cắt ngang.",
      en: "The level marker: this slice passes through the body of L1. On CT the spine always sits posterior-central — the starting point for reading any axial slice.",
      zh: "定位标志：此层面经L1椎体。CT上脊柱总位于中后部——阅读任何横断面的起点。",
    },
    ids: byRe(/^(twelfth thoracic|first lumbar|second lumbar) vertebra$/i, ["skeletal"]),
  },
  {
    key: "gan-mat",
    tint: "#9a4e3e",
    latin: "Hepar · Vesica biliaris",
    name: { vi: "Gan và túi mật", en: "Liver and gallbladder", zh: "肝与胆囊" },
    note: {
      vi: "Chiếm gần hết nửa phải lát cắt. Quy ước đọc CT: bên phải người bệnh nằm bên TRÁI màn hình — nhìn từ chân lên.",
      en: "Fills most of the right half of the slice. CT convention: the patient's right is on the LEFT of the screen — viewed from the feet.",
      zh: "占据层面右半的大部分。CT阅片惯例：患者右侧显示在屏幕左侧——即从足侧向头侧观察。",
    },
    ids: LIVER.concat(byName("Gallbladder")),
  },
  {
    key: "da-day-ta-trang",
    tint: "#e8a37a",
    latin: "Gaster · Duodenum",
    name: { vi: "Dạ dày và tá tràng", en: "Stomach and duodenum", zh: "胃与十二指肠" },
    note: {
      vi: "Mặt phẳng qua môn vị (Addison) ngang L1 cắt qua môn vị, đầu tuỵ, rốn hai thận và đáy túi mật — một lát cắt chứa nhiều mốc nhất ổ bụng.",
      en: "The transpyloric plane (Addison's) at L1 crosses the pylorus, pancreatic head, both renal hila and the gallbladder fundus — the most landmark-rich slice of the abdomen.",
      zh: "经L1的幽门平面（Addison平面）穿过幽门、胰头、两肾门和胆囊底——腹部标志最丰富的层面。",
    },
    ids: byName("Stomach", "Duodenum"),
  },
  {
    key: "tuy",
    tint: "#e0b36a",
    latin: "Pancreas",
    name: { vi: "Tuỵ", en: "Pancreas", zh: "胰" },
    note: {
      vi: "Nằm ngang trước động mạch chủ và cột sống — nên lực ép trước-sau (tay lái) dập tuỵ vào cột sống.",
      en: "Lies across the front of the aorta and spine — so an anteroposterior blow (steering wheel) crushes it against the spine.",
      zh: "横卧于主动脉和脊柱前方——故前后方向的暴力（方向盘）可将胰挤压于脊柱上。",
    },
    ids: byName("Parenchyma of pancreas"),
  },
  {
    key: "lach",
    tint: "#7a3a4f",
    latin: "Splen",
    name: { vi: "Lách", en: "Spleen", zh: "脾" },
    note: {
      vi: "Ở sau-ngoài bên trái, sát cơ hoành và xương sườn IX–XI.",
      en: "Posterolateral on the left, against the diaphragm and ribs IX–XI.",
      zh: "位于左后外侧，紧贴膈和第9–11肋。",
    },
    ids: byName("Spleen"),
  },
  {
    key: "than",
    tint: "#c98a6b",
    latin: "Renes · Glandulae suprarenales",
    name: { vi: "Thận và tuyến thượng thận", en: "Kidneys and adrenals", zh: "肾与肾上腺" },
    note: {
      vi: "Hai bên cột sống, sau phúc mạc. Ở tầng L1 thường cắt qua rốn thận trái, còn thận phải (thấp hơn) cắt qua cực trên.",
      en: "Either side of the spine, retroperitoneal. At L1 the slice usually passes through the left renal hilum but only the upper pole of the (lower) right kidney.",
      zh: "位于脊柱两侧腹膜后。L1层面通常经过左肾门，而位置较低的右肾仅切到上极。",
    },
    ids: byRe(/^(left|right) kidney$|adrenal gland$/i),
  },
  {
    key: "mach",
    tint: OXY,
    latin: "Aorta · A. mesenterica superior",
    name: { vi: "Động mạch chủ và mạc treo tràng trên", en: "Aorta and superior mesenteric artery", zh: "主动脉与肠系膜上动脉" },
    note: {
      vi: "Động mạch chủ ngay trước-trái thân đốt sống; mạc treo tràng trên tách ra phía trước ở tầng này.",
      en: "The aorta sits just anterior-left of the vertebral body; the SMA arises from its front at this level.",
      zh: "主动脉紧贴椎体左前方；肠系膜上动脉在此平面自其前壁发出。",
    },
    ids: byName("Abdominal aorta", "Superior mesenteric artery", "Celiac artery").filter((id) => !["FJ2011", "FJ2013"].includes(id)),
  },
  {
    key: "tm",
    tint: DEOXY,
    latin: "V. cava inferior · V. portae",
    name: { vi: "Tĩnh mạch chủ dưới và tĩnh mạch cửa", en: "IVC and portal vein", zh: "下腔静脉与门静脉" },
    note: {
      vi: "Tĩnh mạch chủ dưới bên phải động mạch chủ; tĩnh mạch cửa ở trước hơn, sau cổ tuỵ.",
      en: "The IVC lies right of the aorta; the portal vein lies further forward, behind the neck of the pancreas.",
      zh: "下腔静脉位于主动脉右侧；门静脉更靠前，位于胰颈后方。",
    },
    ids: byName("Inferior vena cava", "Hepatic portal vein").concat(byRe(/^(left|right) renal vein$/i, ["venous"])),
  },
  {
    key: "dai-trang",
    tint: "#a8764f",
    latin: "Colon",
    name: { vi: "Đại tràng", en: "Colon", zh: "结肠" },
    note: {
      vi: "Góc gan và góc lách đại tràng ở hai bên, đại tràng ngang phía trước.",
      en: "The hepatic and splenic flexures at the sides, the transverse colon in front.",
      zh: "两侧为结肠肝曲和脾曲，前方为横结肠。",
    },
    ids: byRe(/^(ascending|transverse|descending) colon$/i),
  },
  {
    key: "co",
    // Không trùng đỏ động mạch chủ ngay cạnh.
    tint: "#b58bc4",
    latin: "Diaphragma · M. psoas major",
    name: { vi: "Cơ hoành và cơ thắt lưng", en: "Diaphragm and psoas", zh: "膈与腰大肌" },
    note: {
      vi: "Hai trụ hoành ôm động mạch chủ ở tầng này; cơ thắt lưng lớn bắt đầu xuất hiện hai bên thân đốt.",
      en: "The two crura of the diaphragm hug the aorta at this level; psoas major begins to appear beside the vertebral bodies.",
      zh: "此平面两膈脚环抱主动脉；腰大肌开始出现于椎体两侧。",
    },
    ids: byName("Diaphragm").concat(byRe(/psoas major$/i, ["muscular"])),
  },
];

// Lát cắt ngang giữa thân L1, tính theo hộp bao Y của CHÍNH scene (clipBoxOf).
const bb = (id) => P.find((p) => p.id === id).bounds;
const all = groups.flatMap((g) => g.ids).filter((id) => !["FJ2011", "FJ2013"].includes(id));
const yMin = Math.min(...all.map((id) => bb(id)[0][1]));
const yMax = Math.max(...all.map((id) => bb(id)[1][1]));
const l1 = bb(byRe(/^first lumbar vertebra$/i)[0]);
const cutY = (l1[0][1] + l1[1][1]) / 2;
const percent = Math.round(((cutY - yMin) / (yMax - yMin)) * 100);
console.log(`lat cat L1 y=${cutY.toFixed(3)} trong [${yMin.toFixed(3)}, ${yMax.toFixed(3)}] -> ${percent}%`);

emit({
  file: "abdomen-section",
  exportName: "abdomenSectionScene",
  header: 'Scene "Mặt cắt ngang bụng" (tầng L1) dựng từ bộ atlas BodyParts3D.\n\nMặt cắt bật sẵn — xem `clip`.',
  scene: {
    slug: "mat-cat-ngang-bung",
    title: { vi: "Mặt cắt ngang bụng (tầng L1)", en: "Transverse Section of the Abdomen (L1)", zh: "腹部横断面（L1平面）" },
    latin: "Planum transpyloricum",
    // Nhìn TỪ TRÊN XUỐNG mặt cắt của nửa dưới. Góc ¾ mặc định làm mặt cắt thành một vạch,
    // chỉ thấy đại tràng và cơ thắt lưng bên dưới (user báo, đã chụp kiểm).
    view: "top",
    intro: {
      vi: "Lát cắt ngang qua thân đốt L1 — mặt phẳng qua môn vị, tầng chứa nhiều mốc nhất ổ bụng: gan, túi mật, môn vị, tuỵ, lách, hai thận, động mạch chủ, tĩnh mạch chủ dưới. Mặt cắt đã BẬT SẴN; kéo thanh trượt mặt cắt để đi lên xuống từng tầng như lướt phim CT, hoặc tắt để nhìn nguyên khối. Mỗi tạng một màu.",
      en: "An axial slice through the body of L1 — the transpyloric plane, the most landmark-rich level of the abdomen: liver, gallbladder, pylorus, pancreas, spleen, both kidneys, aorta and IVC. The cross-section is ON from the start; drag the section slider to move up and down like scrolling a CT scan, or switch it off to see everything whole. Each organ has its own colour.",
      zh: "经L1椎体的横断面——幽门平面，腹部标志最丰富的层面：肝、胆囊、幽门、胰、脾、两肾、主动脉、下腔静脉。切面已预先开启；拖动切面滑块可像浏览CT一样上下移动层面，或关闭切面查看整体。各器官以不同颜色显示。",
    },
  },
  exclude: ["FJ2011", "FJ2013", "FJ3421"],
  clip: { axis: "y", percent, keepPositive: false },
  groups,
});
