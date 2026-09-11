/**
 * Sinh scene "Giải phẫu Tim" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-heart.mjs
 *
 * Nội dung ba ngôn ngữ (T3) giống hệ SceneModule cũ, để khu atlas không thành
 * ốc đảo chỉ có tiếng Việt.
 */
import fs from "fs";

const root = "C:/Users/trinh/Downloads/đồ án/Soma_Fe/";
const atlas = JSON.parse(fs.readFileSync(root + "public/human-atlas/atlas.json", "utf8"));
const P = atlas.parts;
const byRe = (re) => P.filter((p) => re.test(p.name)).map((p) => p.id);
const byName = (...n) => P.filter((p) => n.includes(p.name)).map((p) => p.id);

/**
 * Mảnh bị LOẠI dù đúng tên.
 * FJ3659 là đoạn tĩnh mạch chủ dưới chạy xuống ổ bụng: dài 14cm trong khi cả
 * quả tim chỉ cao 9cm.
 */
const EXCLUDE = new Set(["FJ3659"]);

/**
 * ---- MÀU THEO MỨC OXY, KHÔNG THEO HỆ ----
 * Atlas tô theo `system`: arterial đỏ, venous xanh. Vòng tiểu tuần hoàn là
 * ngoại lệ lớn nhất của quy tắc đó, để nguyên là DẠY SAI:
 *   - Động mạch phổi mang máu NGHÈO oxy -> phải XANH (atlas đang tô đỏ)
 *   - Tĩnh mạch phổi mang máu GIÀU oxy  -> phải ĐỎ  (atlas đang tô xanh)
 * Thêm nữa, quy ước dạy học tô nửa tim phải xanh / nửa tim trái đỏ.
 */
const DEOXY = "#527c9f";
const OXY = "#c05245";

/*
 * TĨNH MẠCH CHỦ ĐÃ BỎ KHỎI BÀI (theo yêu cầu, và có cơ sở đo được).
 * Lưới gốc chỉ 324 tam giác cho một ống dài 9,6cm (tỉ lệ dài/mảnh 4,2) — là
 * hình trụ ép đùn chứ không phải mạch máu dựng từ dữ liệu giải phẫu, nhìn như
 * một cái cọc đâm xuyên tâm nhĩ.
 * Muốn bật lại: thêm nhóm với byName("Superior vena cava", "Inferior vena cava").
 */

const groups = [
  {
    key: "nhi-phai",
    tint: DEOXY,
    latin: "Atrium dextrum",
    name: { vi: "Tâm nhĩ phải", en: "Right atrium", zh: "右心房" },
    note: {
      vi: "Nhận máu nghèo oxy từ tĩnh mạch chủ trên và dưới đổ về, rồi xuống tâm thất phải qua van ba lá. Nút xoang nhĩ — máy tạo nhịp tự nhiên của tim — nằm trong thành buồng này.",
      en: "Receives oxygen-poor blood from the superior and inferior vena cava, then passes it to the right ventricle through the tricuspid valve. The sinoatrial node, the heart's natural pacemaker, sits in this chamber's wall.",
      zh: "接收来自上、下腔静脉的低氧血，经三尖瓣流入右心室。心脏的天然起搏点窦房结即位于此腔壁内。",
    },
    ids: byName("Cavity of right atrium", "Wall of right atrium"),
  },
  {
    key: "that-phai",
    tint: DEOXY,
    latin: "Ventriculus dexter",
    name: { vi: "Tâm thất phải", en: "Right ventricle", zh: "右心室" },
    note: {
      vi: "Bơm máu nghèo oxy vào thân động mạch phổi. Thành mỏng hơn thất trái vì chỉ phải thắng sức cản thấp của vòng tiểu tuần hoàn. Ba cơ nhú kéo giữ lá van ba lá.",
      en: "Pumps oxygen-poor blood into the pulmonary trunk. Its wall is thinner than the left ventricle because it only has to overcome the low resistance of the pulmonary circuit. Three papillary muscles anchor the tricuspid leaflets.",
      zh: "将低氧血泵入肺动脉干。因只需克服肺循环的低阻力，其室壁较左心室薄。三块乳头肌牵拉固定三尖瓣叶。",
    },
    ids: byName("Cavity of right ventricle").concat(byRe(/papillary muscle of right ventricle/i)),
  },
  {
    key: "nhi-trai",
    tint: OXY,
    latin: "Atrium sinistrum",
    name: { vi: "Tâm nhĩ trái", en: "Left atrium", zh: "左心房" },
    note: {
      vi: "Nhận máu giàu oxy từ bốn tĩnh mạch phổi, đổ xuống tâm thất trái qua van hai lá. Thành mỏng vì chỉ đẩy máu một quãng ngắn.",
      en: "Receives oxygen-rich blood from the four pulmonary veins and passes it to the left ventricle through the mitral valve. Its wall is thin because it only moves blood a short distance.",
      zh: "接收四条肺静脉回流的富氧血，经二尖瓣流入左心室。因输送距离短，房壁较薄。",
    },
    ids: byName("Cavity of left atrium", "Wall of left atrium"),
  },
  {
    key: "that-trai",
    tint: OXY,
    latin: "Ventriculus sinister",
    name: { vi: "Tâm thất trái", en: "Left ventricle", zh: "左心室" },
    note: {
      vi: "Buồng bơm chính của cơ thể. Thành dày gấp nhiều lần thất phải vì phải tạo áp lực đẩy máu đi khắp vòng tuần hoàn hệ thống. Cơ nhú bên giữ lá van hai lá.",
      en: "The body's main pumping chamber. Its wall is several times thicker than the right ventricle because it must generate the pressure that drives blood through the systemic circulation. The lateral papillary muscle anchors the mitral leaflets.",
      zh: "全身主要的泵血腔。因需产生驱动体循环的压力，室壁厚度为右心室的数倍。外侧乳头肌固定二尖瓣叶。",
    },
    ids: byName("Cavity of left ventricle").concat(
      byRe(/papillary muscle of left ventricle|head of lateral papillary/i),
    ),
  },
  {
    key: "thanh-that",
    latin: "Myocardium ventriculare",
    name: { vi: "Thành cơ thất", en: "Ventricular myocardium", zh: "心室肌壁" },
    note: {
      vi: "Khối cơ tim bao cả hai thất — trong bộ dữ liệu này hai thất dùng CHUNG một khối thành, không tách riêng được. Bật mặt cắt lát ngang sẽ thấy rõ chênh lệch bề dày giữa hai bên.",
      en: "The muscle mass enclosing both ventricles. In this dataset the two ventricles SHARE a single wall mesh and cannot be separated. Turn on the transverse cross-section to see the difference in wall thickness between the two sides.",
      zh: "包绕两个心室的心肌整体。本数据集中两室共用同一壁网格，无法单独分离。开启横断切面即可看清两侧壁厚差异。",
    },
    ids: byName("Wall of ventricle"),
  },

  {
    key: "van-ba-la",
    latin: "Valva tricuspidalis",
    name: { vi: "Van ba lá", en: "Tricuspid valve", zh: "三尖瓣" },
    note: {
      vi: "Ngăn tâm nhĩ phải với tâm thất phải, gồm lá trước, lá sau và lá vách. Đóng khi thất co để máu không trào ngược lên nhĩ.",
      en: "Separates the right atrium from the right ventricle; it has an anterior, a posterior and a septal leaflet. It closes during ventricular contraction so blood cannot flow back into the atrium.",
      zh: "分隔右心房与右心室，由前叶、后叶和隔叶组成。心室收缩时关闭，防止血液反流入心房。",
    },
    ids: byRe(/leaflet of tricuspid valve$/i),
  },
  {
    key: "van-hai-la",
    latin: "Valva mitralis",
    name: { vi: "Van hai lá", en: "Mitral valve", zh: "二尖瓣" },
    note: {
      vi: 'Ngăn tâm nhĩ trái với tâm thất trái, chỉ có lá trước và lá sau — tên "hai lá" từ đó mà ra.',
      en: 'Separates the left atrium from the left ventricle. It has only an anterior and a posterior leaflet, which is where the name "bicuspid" comes from.',
      zh: "分隔左心房与左心室，仅有前叶与后叶两片瓣叶，故又称二尖瓣。",
    },
    ids: byRe(/leaflet of mitral valve$/i),
  },
  {
    key: "van-dm-phoi",
    latin: "Valva trunci pulmonalis",
    name: { vi: "Van động mạch phổi", en: "Pulmonary valve", zh: "肺动脉瓣" },
    note: {
      vi: "Ba cánh bán nguyệt ở lối ra của thất phải. Mở khi thất co, đóng khi thất giãn để máu không chảy ngược về thất.",
      en: "Three semilunar cusps at the outflow of the right ventricle. They open as the ventricle contracts and close as it relaxes, preventing backflow into the ventricle.",
      zh: "位于右心室流出道的三个半月瓣。心室收缩时开放，舒张时关闭，防止血液反流回心室。",
    },
    ids: byRe(/cusp of pulmonary valve$/i),
  },
  {
    key: "van-dm-chu",
    latin: "Valva aortae",
    name: { vi: "Van động mạch chủ", en: "Aortic valve", zh: "主动脉瓣" },
    note: {
      vi: "Ba cánh bán nguyệt ở lối ra của thất trái. Ngay trên van này là lỗ xuất phát của hai động mạch vành.",
      en: "Three semilunar cusps at the outflow of the left ventricle. The openings of the two coronary arteries lie just above this valve.",
      zh: "位于左心室流出道的三个半月瓣。两条冠状动脉的开口就在此瓣上方。",
    },
    ids: byRe(/cusp of aortic valve$/i),
  },

  {
    key: "than-dm-phoi",
    tint: DEOXY,
    latin: "Truncus pulmonalis",
    name: {
      vi: "Thân và động mạch phổi",
      en: "Pulmonary trunk and arteries",
      zh: "肺动脉干及肺动脉",
    },
    note: {
      vi: 'ĐỘNG mạch nhưng mang máu NGHÈO oxy — ngoại lệ của quy tắc "động mạch đỏ". Thất phải bơm vào thân động mạch phổi, chia đôi lên hai phổi.',
      en: 'An ARTERY that carries oxygen-POOR blood — the exception to the "arteries are red" rule. The right ventricle pumps into the pulmonary trunk, which divides to reach both lungs.',
      zh: "虽为动脉却输送低氧血，是动脉即红色这一规则的例外。右心室将血液泵入肺动脉干，再分为左右两支进入双肺。",
    },
    ids: byName("Pulmonary trunk", "Right pulmonary artery", "Left pulmonary artery"),
  },
  {
    key: "tm-phoi",
    tint: OXY,
    latin: "Venae pulmonales",
    name: { vi: "Tĩnh mạch phổi", en: "Pulmonary veins", zh: "肺静脉" },
    note: {
      vi: "TĨNH mạch nhưng mang máu GIÀU oxy — ngoại lệ còn lại. Bốn tĩnh mạch phổi đưa máu đã trao đổi khí về tâm nhĩ trái.",
      en: "VEINS that carry oxygen-RICH blood — the other exception. Four pulmonary veins return freshly oxygenated blood to the left atrium.",
      zh: "虽为静脉却输送富氧血，是另一个例外。四条肺静脉将完成气体交换的血液送回左心房。",
    },
    ids: byRe(/pulmonary vein$/i),
  },
  {
    key: "dm-chu",
    latin: "Aorta",
    name: { vi: "Động mạch chủ", en: "Aorta", zh: "主动脉" },
    note: {
      vi: "Máu giàu oxy rời thất trái qua động mạch chủ lên, vòng qua quai động mạch chủ rồi đi nuôi toàn thân.",
      en: "Oxygen-rich blood leaves the left ventricle through the ascending aorta, curves around the aortic arch and travels on to supply the whole body.",
      zh: "富氧血自左心室经升主动脉射出，绕过主动脉弓后输送至全身。",
    },
    ids: byName("Ascending aorta", "Arch of aorta"),
  },

  {
    key: "dm-vanh",
    latin: "Arteriae coronariae",
    name: { vi: "Động mạch vành", en: "Coronary arteries", zh: "冠状动脉" },
    note: {
      vi: "Tim tự nuôi mình bằng hai động mạch vành tách ra ngay trên van động mạch chủ. Tắc nhánh liên thất trước (LAD) chạy dọc rãnh gian thất trước gây nhồi máu thành trước.",
      en: "The heart feeds itself through two coronary arteries arising just above the aortic valve. Occlusion of the left anterior descending branch, which runs along the anterior interventricular groove, causes an anterior wall infarction.",
      zh: "心脏依靠主动脉瓣上方发出的两条冠状动脉自我供血。走行于前室间沟的前降支闭塞可导致前壁心肌梗死。",
    },
    ids: byRe(/coronary artery$/i),
  },
  {
    key: "tm-vanh",
    latin: "Sinus coronarius",
    name: {
      vi: "Tĩnh mạch vành và xoang vành",
      en: "Cardiac veins and coronary sinus",
      zh: "心静脉与冠状窦",
    },
    note: {
      vi: "Máu nuôi cơ tim gom về tĩnh mạch tim lớn rồi xoang vành, đổ thẳng vào tâm nhĩ phải.",
      en: "Blood that has supplied the myocardium collects into the great cardiac vein and then the coronary sinus, which drains directly into the right atrium.",
      zh: "营养心肌后的血液汇入心大静脉，再经冠状窦直接回流入右心房。",
    },
    ids: byName("Coronary sinus", "Great cardiac vein").concat(
      byRe(/^Anterior interventricular vein$/i),
    ),
  },
];

const seen = new Set();
const clean = [];
for (const g of groups) {
  const ids = [...new Set(g.ids)].filter((id) => !seen.has(id) && !EXCLUDE.has(id));
  ids.forEach((id) => seen.add(id));
  if (!ids.length) {
    console.error("NHOM RONG:", g.key);
    continue;
  }
  clean.push({ key: g.key, name: g.name, latin: g.latin, note: g.note, tint: g.tint, parts: ids });
}
console.log("So nhom:", clean.length, "| tong manh:", seen.size);
clean.forEach((g) =>
  console.log(" ", g.key.padEnd(14), String(g.parts.length).padStart(3), g.tint ? "to " + g.tint : ""),
);

const ts = `/**
 * Scene "Giải phẫu Tim" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-heart.mjs — mọi mã FJ đều là mảnh
 * CÓ THẬT trong manifest. Đừng sửa tay file này.
 *
 * Ba điều đã xử lý mà bộ dữ liệu gốc làm sai, thiếu hoặc quá thô:
 *  1. Không lấy cả \`system === 'cardiac'\`: 5/23 mảnh của hệ đó là NÃO THẤT
 *     (human-atlas xếp nhầm vì trùng chữ "ventricle").
 *  2. Màu tô theo MỨC OXY chứ không theo hệ — xem chú thích trong script.
 *  3. Bỏ tĩnh mạch chủ: lưới gốc chỉ 324 tam giác cho ống dài 9,6cm, nhìn như
 *     cái cọc đâm xuyên tâm nhĩ.
 */
import type { AtlasSceneDef } from "./types";

export const heartScene: AtlasSceneDef = {
  slug: "giai-phau-tim",
  title: { vi: "Giải phẫu Tim", en: "Anatomy of the Heart", zh: "心脏解剖" },
  latin: "Cor",
  intro: {
    vi: "Tim là khối cơ rỗng bốn buồng nằm trong trung thất giữa. Nửa phải (tô xanh) nhận máu nghèo oxy rồi bơm lên phổi; nửa trái (tô đỏ) nhận máu giàu oxy rồi bơm đi khắp cơ thể. Màu ở đây theo MỨC OXY chứ không theo động mạch hay tĩnh mạch — nên động mạch phổi màu xanh còn tĩnh mạch phổi màu đỏ.",
    en: "The heart is a hollow four-chambered muscle in the middle mediastinum. The right side (blue) receives oxygen-poor blood and pumps it to the lungs; the left side (red) receives oxygen-rich blood and pumps it to the whole body. Colour here follows OXYGEN LEVEL rather than artery-versus-vein, which is why the pulmonary artery is blue and the pulmonary veins are red.",
    zh: "心脏是位于中纵隔的四腔中空肌性器官。右半（蓝色）接收低氧血并泵向肺部；左半（红色）接收富氧血并泵向全身。此处配色依据含氧量而非动静脉之分，因此肺动脉为蓝色、肺静脉为红色。",
  },
  frameGroups: ${JSON.stringify(clean.map((g) => g.key))},
  groups: ${JSON.stringify(clean, null, 4)},
};
`;
fs.writeFileSync(root + "src/lib/humanAtlas/scenes/heart.ts", ts);
console.log("da ghi src/lib/humanAtlas/scenes/heart.ts");
