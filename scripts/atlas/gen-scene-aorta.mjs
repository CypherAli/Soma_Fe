/**
 * Sinh scene "Cây động mạch chủ và vòng Willis" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-aorta.mjs
 *
 * Khảo sát (survey.mjs --dup + đo khoảng cách lưới) cho ra danh sách bản
 * sao phải bỏ — atlas chứa nhiều mảnh cùng mạch ở hai mức chi tiết:
 *   FJ3427 "Descending aorta"   bản thô phủ cả ĐM chủ ngực + bụng (lệch 5,6mm)
 *   FJ2013, FJ3421              trùng thân tạng FJ1846 (0,0mm)
 *   FJ2011, FJ3644              trùng ĐM mạc treo tràng trên FJ1928 (≤1,1mm)
 *   FJ1844                      trùng ĐM nền FJ1672 (0,8mm)
 *   FJ2038, FJ2046              "Right/Left renal artery" trùng thân ĐM thận
 *                               FJ3576/FJ3476 (1,1–1,5mm)
 *   FJ3640, FJ3544, FJ3420      ba bản khác của ĐM lách, giữ FJ2562
 * Atlas KHÔNG có động mạch cảnh ngoài.
 */
import { byRe, byName, emit } from "./lib.mjs";

const A = (re) => byRe(re, ["arterial"]);

emit({
  file: "aorta",
  exportName: "aortaScene",
  header:
    'Scene "Cây động mạch chủ và vòng Willis" dựng từ bộ atlas BodyParts3D.\n\nĐã bỏ 11 bản sao trùng lưới; atlas không có động mạch cảnh ngoài.',
  scene: {
    slug: "he-dong-mach-chu",
    title: {
      vi: "Cây động mạch chủ và vòng Willis",
      en: "The Aortic Tree & Circle of Willis",
      zh: "主动脉树与Willis环",
    },
    latin: "Aorta · Circulus arteriosus cerebri",
    intro: {
      vi: "Động mạch chủ rời thất trái, đi lên, uốn thành cung rồi chạy xuống dọc cột sống qua ngực và bụng, chia đôi thành hai động mạch chậu chung ở ngang L4. Trên đường đi nó cho các nhánh lên đầu và tay (từ cung), nhánh nuôi tạng bụng và thận. Não được cấp máu từ hai động mạch cảnh trong và hai động mạch đốt sống, nối nhau thành vòng Willis ở đáy não. Bộ dữ liệu không có động mạch cảnh ngoài.",
      en: "The aorta leaves the left ventricle, rises, arches over and runs down beside the spine through the chest and abdomen, dividing into the two common iliac arteries at L4. Along the way it gives branches to the head and arms (from the arch), and to the abdominal organs and kidneys. The brain is supplied by the two internal carotid and two vertebral arteries, linked into the circle of Willis at its base. The dataset has no external carotid artery.",
      zh: "主动脉起自左心室，上升后弯成弓形，再沿脊柱下行经胸腹部，于L4水平分为两条髂总动脉。沿途发出至头颈及上肢的分支（来自主动脉弓），以及至腹腔脏器和肾脏的分支。脑由两条颈内动脉和两条椎动脉供血，二者在脑底吻合成Willis环。数据集中无颈外动脉。",
    },
  },
  exclude: ["FJ3427", "FJ2013", "FJ3421", "FJ2011", "FJ3644", "FJ1844", "FJ2038", "FJ2046", "FJ3640", "FJ3544", "FJ3420"],
  groups: [
    {
      key: "dm-chu-len-cung",
      tint: "#c05245",
      latin: "Aorta ascendens · Arcus aortae",
      name: { vi: "Động mạch chủ lên và cung động mạch chủ", en: "Ascending aorta and aortic arch", zh: "升主动脉与主动脉弓" },
      note: {
        vi: "Đoạn chịu áp lực cao nhất cơ thể, ngay sau van động mạch chủ. Hai động mạch vành tách ra ở gốc động mạch chủ lên. Cung động mạch chủ vắt qua phế quản gốc trái; dây thanh quản quặt ngược trái vòng dưới cung — phình cung có thể gây khàn tiếng.",
        en: "The highest-pressure segment in the body, just beyond the aortic valve. The two coronary arteries arise at the root of the ascending aorta. The arch passes over the left main bronchus, and the left recurrent laryngeal nerve hooks beneath it — an arch aneurysm can cause hoarseness.",
        zh: "紧接主动脉瓣、全身压力最高的一段。两条冠状动脉起自升主动脉根部。主动脉弓跨过左主支气管，左喉返神经勾绕其下——主动脉弓动脉瘤可致声音嘶哑。",
      },
      ids: byName("Ascending aorta", "Arch of aorta"),
    },
    {
      key: "nhanh-cung",
      tint: "#d0685a",
      latin: "Truncus brachiocephalicus · Aa. carotides communes · Aa. subclaviae",
      name: { vi: "Ba nhánh của cung", en: "Branches of the arch", zh: "主动脉弓三大分支" },
      note: {
        vi: "Từ phải sang trái: thân cánh tay đầu (chia động mạch cảnh chung phải và dưới đòn phải), động mạch cảnh chung trái, động mạch dưới đòn trái. Hai bên KHÔNG đối xứng — bên phải có thân chung, bên trái tách thẳng từ cung.",
        en: "From right to left: the brachiocephalic trunk (dividing into the right common carotid and right subclavian), the left common carotid and the left subclavian. The two sides are NOT symmetrical — the right has a common trunk, the left arises straight from the arch.",
        zh: "自右向左依次为：头臂干（分为右颈总动脉和右锁骨下动脉）、左颈总动脉、左锁骨下动脉。两侧并不对称——右侧有共干，左侧直接起自主动脉弓。",
      },
      ids: A(/brachiocephalic artery$|common carotid artery$|subclavian artery$/i),
    },
    {
      key: "cap-mau-nao",
      tint: "#b8434f",
      latin: "Aa. carotides internae · Aa. vertebrales · A. basilaris",
      name: { vi: "Động mạch cảnh trong, đốt sống và nền", en: "Internal carotid, vertebral and basilar arteries", zh: "颈内动脉、椎动脉与基底动脉" },
      note: {
        vi: "Bốn nguồn máu lên não: hai động mạch cảnh trong đi trước (cấp khoảng 80%) và hai động mạch đốt sống đi trong lỗ mỏm ngang đốt cổ, hợp thành động mạch nền trước cầu não. Hẹp chỗ chia đôi động mạch cảnh chung là nguồn gốc hay gặp của đột quỵ.",
        en: "The four inflows to the brain: the two internal carotids in front (about 80% of the supply) and the two vertebrals, which climb through the cervical transverse foramina and join as the basilar artery in front of the pons. Narrowing at the carotid bifurcation is a common source of stroke.",
        zh: "脑的四条供血来源：前方两条颈内动脉（约供80%）与两条椎动脉——后者穿颈椎横突孔上行，在脑桥前方汇合成基底动脉。颈总动脉分叉处狭窄是卒中的常见来源。",
      },
      ids: A(/internal carotid artery$|vertebral artery$|^basilar artery$/i),
    },
    {
      key: "vong-willis",
      tint: "#e07a6a",
      latin: "Circulus arteriosus cerebri",
      name: { vi: "Vòng Willis", en: "Circle of Willis", zh: "Willis环" },
      note: {
        vi: "Vòng nối ở đáy não: hai động mạch não trước nối qua động mạch thông trước, động mạch cảnh trong nối động mạch não sau qua động mạch thông sau. Khi một nguồn bị tắc từ từ, vòng này bù máu. Chỗ chia nhánh của vòng — nhất là động mạch thông trước — là nơi hay gặp phình mạch não gây xuất huyết dưới nhện.",
        en: "The anastomotic ring at the base of the brain: the two anterior cerebrals are joined by the anterior communicating artery, and each internal carotid joins the posterior cerebral through a posterior communicating artery. If one inflow closes slowly, the circle compensates. Its branch points — especially the anterior communicating artery — are where berry aneurysms form and rupture into subarachnoid haemorrhage.",
        zh: "脑底的动脉吻合环：两条大脑前动脉经前交通动脉相连，颈内动脉经后交通动脉与大脑后动脉相连。一条供血来源缓慢闭塞时，此环可代偿。环的分叉处——尤其是前交通动脉——是囊状动脉瘤的好发部位，破裂导致蛛网膜下腔出血。",
      },
      // Neo ^…$: "Hypothalamic branch of … posterior communicating artery" là NHÁNH, không phải đoạn của vòng.
      ids: A(/^(left |right )?anterior cerebral artery$|^anterior communicating artery$|^(left|right) posterior communicating artery$|precommunicating part of .* posterior cerebral artery|postcommunicating part of .* posterior cerebral artery|sphenoid part of .* middle cerebral artery/i),
    },
    {
      key: "dm-chu-nguc",
      tint: "#c05245",
      latin: "Aorta thoracica",
      name: { vi: "Động mạch chủ ngực", en: "Descending thoracic aorta", zh: "胸主动脉" },
      note: {
        vi: "Chạy xuống bên trái cột sống trong trung thất sau, cho các động mạch gian sườn sau, phế quản, thực quản. Qua lỗ động mạch chủ của cơ hoành ngang T12 thì thành động mạch chủ bụng. Bóc tách týp B (Stanford) bắt đầu ngay sau chỗ tách động mạch dưới đòn trái và thường điều trị nội khoa; týp A — khởi phát ở động mạch chủ lên, chiếm khoảng 2/3 — là cấp cứu ngoại khoa.",
        en: "Descends to the left of the spine in the posterior mediastinum, giving posterior intercostal, bronchial and oesophageal branches. It becomes the abdominal aorta as it passes through the aortic hiatus of the diaphragm at T12. A Stanford type B dissection starts just beyond the left subclavian origin and is usually managed medically; type A — arising in the ascending aorta, about two-thirds of cases — is a surgical emergency.",
        zh: "在后纵隔沿脊柱左侧下行，发出肋间后动脉、支气管动脉和食管动脉。于T12水平穿膈主动脉裂孔后移行为腹主动脉。Stanford B型夹层起始于左锁骨下动脉起点稍远处，多行内科治疗；A型——起于升主动脉，约占2/3——属外科急症。",
      },
      ids: byName("Descending thoracic aorta"),
    },
    {
      key: "dm-chu-bung",
      tint: "#c05245",
      latin: "Aorta abdominalis",
      name: { vi: "Động mạch chủ bụng", en: "Abdominal aorta", zh: "腹主动脉" },
      note: {
        vi: "Từ T12 đến L4, nằm trước cột sống, lệch trái. Phình động mạch chủ bụng hay gặp ở đoạn DƯỚI động mạch thận ở nam giới lớn tuổi hút thuốc — sờ thấy khối đập theo nhịp mạch quanh rốn.",
        en: "From T12 to L4, in front of the spine and slightly to the left. Abdominal aortic aneurysms typically form BELOW the renal arteries in older male smokers — felt as a pulsatile mass around the umbilicus.",
        zh: "自T12至L4，位于脊柱前方稍偏左。腹主动脉瘤多发于肾动脉以下段，好发于吸烟的老年男性——脐周可触及搏动性肿块。",
      },
      ids: byName("Abdominal aorta"),
    },
    {
      key: "than-tang",
      tint: "#d0685a",
      latin: "Truncus coeliacus",
      name: { vi: "Thân tạng và nhánh", en: "Coeliac trunk and branches", zh: "腹腔干及其分支" },
      note: {
        vi: "Nhánh trước đầu tiên của động mạch chủ bụng, ngang T12, ngắn chỉ 1–2cm rồi chia ba: động mạch vị trái, lách và gan chung — nuôi các tạng thuộc ruột trước (dạ dày, tá tràng đoạn đầu, gan, tuỵ, lách).",
        en: "The first anterior branch of the abdominal aorta, at T12, only 1–2cm long before splitting into three: the left gastric, splenic and common hepatic arteries — supplying the foregut organs (stomach, first part of the duodenum, liver, pancreas, spleen).",
        zh: "腹主动脉第一条前壁分支，平T12，长仅1–2cm即分为三支：胃左动脉、脾动脉和肝总动脉——供应前肠器官（胃、十二指肠上部、肝、胰、脾）。",
      },
      ids: byName("Celiac artery", "Left gastric artery", "Common hepatic artery").concat(byName("Splenic artery").filter((id) => id === "FJ2562")),
    },
    {
      key: "mac-treo",
      tint: "#b8434f",
      latin: "Aa. mesentericae superior et inferior",
      name: { vi: "Động mạch mạc treo tràng trên và dưới", en: "Superior and inferior mesenteric arteries", zh: "肠系膜上、下动脉" },
      note: {
        vi: "Mạc treo tràng trên (ngang L1) nuôi ruột giữa: toàn bộ ruột non đến 2/3 đại tràng ngang. Mạc treo tràng dưới (ngang L3) nuôi ruột sau đến trực tràng. Thắt tắc cấp mạc treo tràng trên gây thiếu máu ruột — đau bụng dữ dội nhưng khám bụng lại ít dấu hiệu.",
        en: "The superior mesenteric (at L1) supplies the midgut: all of the small bowel to two-thirds of the transverse colon. The inferior mesenteric (at L3) supplies the hindgut down to the rectum. Acute SMA occlusion causes mesenteric ischaemia — severe pain out of proportion to the examination findings.",
        zh: "肠系膜上动脉（平L1）供应中肠：全部小肠至横结肠右2/3。肠系膜下动脉（平L3）供应后肠直至直肠。肠系膜上动脉急性闭塞导致肠缺血——腹痛剧烈但体征轻微，二者不相称。",
      },
      ids: byName("Superior mesenteric artery", "Inferior mesenteric artery"),
    },
    {
      key: "dm-than",
      tint: "#d0685a",
      latin: "Aa. renales",
      name: { vi: "Động mạch thận", en: "Renal arteries", zh: "肾动脉" },
      note: {
        vi: "Tách hai bên ngang L1–L2; bên phải dài hơn vì phải vòng sau tĩnh mạch chủ dưới. Trong xoang thận chia nhánh trước và sau — đây là động mạch tận, không nối nhau, nên tắc một nhánh gây nhồi máu hình chêm một vùng thận.",
        en: "Arise on each side at L1–L2; the right is longer because it passes behind the inferior vena cava. In the renal sinus they divide into anterior and posterior divisions — end arteries that do not anastomose, so blocking one causes a wedge-shaped renal infarct.",
        zh: "于L1–L2水平发自两侧；右侧较长，因须经下腔静脉后方。在肾窦内分为前、后两支——为终末动脉，互不吻合，一支阻塞即致楔形肾梗死。",
      },
      ids: A(/trunk of (left|right) renal artery|division of (left|right) renal artery|ureteric segment of (left|right) renal artery/i),
    },
    {
      key: "dm-chau",
      tint: "#b8434f",
      latin: "Aa. iliacae communes, externae, internae",
      name: { vi: "Động mạch chậu", en: "Iliac arteries", zh: "髂动脉" },
      note: {
        vi: "Động mạch chủ bụng chia đôi ngang L4 (ngang rốn) thành hai động mạch chậu chung; mỗi bên lại chia chậu trong (nuôi tạng chậu hông, mông) và chậu ngoài — đi dưới dây chằng bẹn thành động mạch đùi.",
        en: "The abdominal aorta bifurcates at L4 (umbilical level) into the two common iliacs; each divides into the internal iliac (pelvic organs and buttock) and the external iliac, which passes under the inguinal ligament to become the femoral artery.",
        zh: "腹主动脉于L4（平脐）分为两条髂总动脉；各自再分为髂内动脉（供应盆腔脏器与臀部）和髂外动脉——后者经腹股沟韧带深面延续为股动脉。",
      },
      ids: A(/(common|external|internal) iliac artery$/i),
    },
  ],
});
