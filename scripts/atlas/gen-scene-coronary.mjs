/**
 * Sinh scene "Động mạch vành" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-coronary.mjs
 *
 * Khảo sát: atlas có cây vành rất chi tiết (~100 mảnh): thân chung trái,
 * liên thất trước với nhánh chéo/vách/nón, mũ, thân vành phải với nhánh bờ,
 * nhánh thất, liên thất sau; và đủ tĩnh mạch tim đổ về xoang vành.
 * Nhóm theo VÙNG CƠ TIM ĐƯỢC NUÔI — thứ sinh viên cần để đọc điện tim và
 * chụp mạch vành — mỗi nhánh chính một màu. Thành tim để làm nền, không tô.
 */
import { byRe, byName, emit } from "./lib.mjs";

const A = (re) => byRe(re, ["arterial"]);
const V = (re) => byRe(re, ["venous"]);

emit({
  file: "coronary",
  exportName: "coronaryScene",
  header: 'Scene "Động mạch vành" dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "dong-mach-vanh",
    title: { vi: "Động mạch vành", en: "Coronary Circulation", zh: "冠状循环" },
    latin: "Arteriae et venae cordis",
    intro: {
      vi: "Tim tự nuôi mình bằng hai động mạch vành tách từ gốc động mạch chủ. Vành TRÁI chia ngay thành liên thất trước (LAD — nuôi thành trước và 2/3 trước vách liên thất) và mũ (LCx — thành bên). Vành PHẢI chạy trong rãnh vành phải, cho nhánh bờ và thường cả liên thất sau (nuôi thành dưới), cùng nút xoang và nút nhĩ thất. Máu tĩnh mạch gom về xoang vành rồi đổ vào nhĩ phải. Mỗi nhánh chính một màu; thành tim để mờ làm nền.",
      en: "The heart feeds itself through two coronary arteries arising from the aortic root. The LEFT divides at once into the anterior interventricular (LAD — anterior wall and anterior two-thirds of the septum) and the circumflex (LCx — lateral wall). The RIGHT runs in the right coronary groove, giving marginal branches and usually the posterior interventricular (inferior wall), as well as the SA and AV nodal arteries. Venous blood gathers in the coronary sinus, which drains into the right atrium. Each main branch has its own colour; the heart wall is shown as background.",
      zh: "心脏依靠起自主动脉根部的两条冠状动脉自我供血。左冠状动脉随即分为前室间支（LAD——供应前壁及室间隔前2/3）和旋支（LCx——供应侧壁）。右冠状动脉走行于右冠状沟，发出缘支，通常还发出后室间支（供应下壁）以及窦房结、房室结动脉。静脉血汇入冠状窦后注入右心房。各主要分支以不同颜色显示；心壁作为背景。",
    },
  },
  groups: [
    {
      key: "than-chung-trai",
      tint: "#8f2f3a",
      latin: "A. coronaria sinistra (truncus)",
      name: { vi: "Thân chung động mạch vành trái", en: "Left main coronary artery", zh: "左冠状动脉主干" },
      note: {
        vi: "Đoạn ngắn 1–2cm từ xoang vành trái đến chỗ chia LAD và mũ. Hẹp thân chung đe doạ cùng lúc khoảng 3/4 cơ thất trái — tổn thương \"widow maker\", thường phải mổ bắc cầu.",
        en: "A short 1–2cm segment from the left aortic sinus to the LAD/circumflex bifurcation. A left main stenosis threatens about three-quarters of the left ventricle at once — the \"widow maker\" lesion, usually treated by bypass surgery.",
        zh: "自左主动脉窦至前降支/旋支分叉处的1–2cm短段。左主干狭窄同时威胁左心室约3/4心肌——即“寡妇制造者”病变，通常需行冠状动脉旁路移植术。",
      },
      ids: A(/^trunk of left coronary artery$/i),
    },
    {
      key: "lad",
      // Hồng cánh sen: trên bài tim đầy đủ, đỏ OXY đã dành cho buồng tim trái.
      tint: "#d6457f",
      latin: "R. interventricularis anterior (LAD)",
      name: { vi: "Liên thất trước (LAD) và nhánh", en: "Anterior interventricular (LAD) and branches", zh: "前室间支（LAD）及分支" },
      note: {
        vi: "Chạy trong rãnh liên thất trước tới mỏm tim. Nhánh chéo nuôi thành trước-bên, nhánh vách xuyên vào vách liên thất (nuôi bó His), nhánh nón nối với nón phải. Tắc LAD gây nhồi máu thành trước — ST chênh lên V1–V4, vùng nhồi máu lớn nhất.",
        en: "Runs down the anterior interventricular groove to the apex. Diagonal branches supply the anterolateral wall, septal branches plunge into the septum (supplying the bundle of His), the conus branch meets the right conus artery. LAD occlusion causes an anterior infarct — ST elevation in V1–V4, the largest territory.",
        zh: "沿前室间沟下行至心尖。对角支供应前侧壁，间隔支穿入室间隔（供应希氏束），圆锥支与右圆锥动脉吻合。前降支闭塞导致前壁梗死——V1–V4导联ST段抬高，梗死范围最大。",
      },
      ids: A(/anterior interventricular branch of left coronary|diagonal branch of anterior descending|conus branch of anterior interventricular|anterior branch of anterior interventricular|septal branch of anterior interventricular artery/i),
    },
    {
      key: "mu",
      tint: "#e8883d",
      latin: "R. circumflexus (LCx)",
      name: { vi: "Nhánh mũ (LCx)", en: "Circumflex branch (LCx)", zh: "旋支（LCx）" },
      note: {
        vi: "Vòng sang trái trong rãnh vành, nuôi thành bên và sau thất trái cùng nhĩ trái. Tắc mũ gây nhồi máu thành bên (I, aVL, V5–V6) — hay bị bỏ sót vì điện tim thay đổi kín đáo.",
        en: "Curves left in the coronary groove, supplying the lateral and posterior left ventricular wall and the left atrium. Circumflex occlusion causes a lateral infarct (I, aVL, V5–V6) — often missed because the ECG changes are subtle.",
        zh: "沿冠状沟向左绕行，供应左心室侧壁、后壁及左心房。旋支闭塞导致侧壁梗死（I、aVL、V5–V6导联）——因心电图改变隐匿常被漏诊。",
      },
      ids: A(/circumflex branch of left coronary artery/i),
    },
    {
      key: "vanh-phai",
      tint: "#b8434f",
      latin: "A. coronaria dextra",
      name: { vi: "Động mạch vành phải và nhánh bờ", en: "Right coronary artery and marginal branches", zh: "右冠状动脉及缘支" },
      note: {
        vi: "Từ xoang vành phải chạy trong rãnh vành phải, cho nhánh nón phải, các nhánh thất trước và nhánh bờ nuôi thất phải. Ở khoảng 60% người nó cho động mạch nút xoang, ở ~80% cho động mạch nút nhĩ thất — nên nhồi máu vành phải hay kèm nhịp chậm, bloc nhĩ thất.",
        en: "From the right aortic sinus it runs in the right coronary groove, giving the right conus artery, anterior ventricular branches and marginal branches to the right ventricle. In about 60% it supplies the SA node and in ~80% the AV node — so right coronary infarcts often bring bradycardia and AV block.",
        zh: "起自右主动脉窦，走行于右冠状沟，发出右圆锥动脉、心室前支和缘支供应右心室。约60%人的窦房结动脉、约80%人的房室结动脉来自右冠状动脉——故右冠梗死常伴心动过缓和房室传导阻滞。",
      },
      ids: A(/^trunk of right coronary artery$|right conus artery|anterior ventricular branch of right coronary|marginal branch of right coronary/i),
    },
    {
      key: "lien-that-sau",
      tint: "#d98a2b",
      latin: "R. interventricularis posterior (PDA)",
      name: { vi: "Liên thất sau và nhánh thất sau", en: "Posterior interventricular and posterior ventricular branches", zh: "后室间支与左室后支" },
      note: {
        vi: "Chạy trong rãnh liên thất sau, nuôi thành dưới và 1/3 sau vách liên thất. Động mạch nào cho nhánh này quyết định \"ưu thế\" vành (ưu thế phải ở ~70% người, như trong dữ liệu này). Tắc gây nhồi máu thành dưới — ST chênh lên II, III, aVF.",
        en: "Runs in the posterior interventricular groove, supplying the inferior wall and the posterior third of the septum. Whichever artery gives this branch defines coronary \"dominance\" (right-dominant in ~70%, as in this dataset). Occlusion causes an inferior infarct — ST elevation in II, III, aVF.",
        zh: "走行于后室间沟，供应下壁及室间隔后1/3。由哪条动脉发出此支决定冠状动脉“优势型”（约70%为右优势型，本数据集亦然）。闭塞导致下壁梗死——II、III、aVF导联ST段抬高。",
      },
      ids: A(/posterior interventricular branch of right coronary|septal branch of right posterior interventricular|posterior ventricular branch of right coronary/i),
    },
    {
      key: "xoang-vanh",
      tint: "#3f6a8f",
      latin: "Sinus coronarius · V. cordis magna",
      name: { vi: "Xoang vành và tĩnh mạch tim lớn", en: "Coronary sinus and great cardiac vein", zh: "冠状窦与心大静脉" },
      note: {
        vi: "Tĩnh mạch tim lớn đi cùng LAD rồi theo rãnh vành trái ra sau thành xoang vành, đổ vào nhĩ phải. Xoang vành là đường đưa điện cực thất trái trong máy tạo nhịp tái đồng bộ (CRT).",
        en: "The great cardiac vein accompanies the LAD, then follows the left coronary groove backward to become the coronary sinus, which empties into the right atrium. The coronary sinus is the route for the left ventricular lead in cardiac resynchronisation therapy (CRT).",
        zh: "心大静脉与前降支伴行，再沿左冠状沟向后移行为冠状窦，注入右心房。冠状窦是心脏再同步化治疗（CRT）放置左心室电极的通路。",
      },
      ids: V(/^coronary sinus$|^great cardiac vein$|^anterior interventricular vein$/i),
    },
    {
      key: "tm-tim",
      tint: "#6f93b8",
      latin: "Vv. cordis",
      name: { vi: "Các tĩnh mạch tim khác", en: "Other cardiac veins", zh: "其他心静脉" },
      note: {
        vi: "Tĩnh mạch tim giữa (đi cùng liên thất sau), tim nhỏ, sau thất trái và các tĩnh mạch bờ đổ vào xoang vành. Riêng các tĩnh mạch tim trước đổ THẲNG vào nhĩ phải, không qua xoang vành.",
        en: "The middle cardiac (with the posterior interventricular artery), small cardiac, posterior left ventricular and marginal veins drain into the coronary sinus. The anterior cardiac veins alone empty STRAIGHT into the right atrium, bypassing the sinus.",
        zh: "心中静脉（与后室间支伴行）、心小静脉、左室后静脉及缘静脉汇入冠状窦。唯有心前静脉直接注入右心房，不经冠状窦。",
      },
      ids: V(/middle cardiac vein$|small cardiac vein$|anterior cardiac vein$|posterior vein of left ventricle$|marginal vein$/i),
    },
    {
      key: "thanh-tim",
      latin: "Myocardium",
      name: { vi: "Thành tim (nền)", en: "Heart wall (background)", zh: "心壁（背景）" },
      note: {
        vi: "Thành thất và thành hai nhĩ, để làm nền cho cây mạch. Bấm Làm mờ nhóm này để thấy các nhánh vách xuyên vào trong vách liên thất.",
        en: "The ventricular and atrial walls, shown as a backdrop for the vessels. Fade this group to see the septal branches plunging into the interventricular septum.",
        zh: "心室壁与两侧心房壁，作为血管的背景。淡化此组可看到穿入室间隔的间隔支。",
      },
      ids: byName("Wall of ventricle", "Wall of left atrium", "Wall of right atrium", "Ascending aorta", "Pulmonary trunk"),
    },
  ],
});
