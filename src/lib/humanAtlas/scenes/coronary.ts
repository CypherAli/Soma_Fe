/**
 * Scene "Động mạch vành" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-coronary.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const coronaryScene: AtlasSceneDef = {
  "slug": "dong-mach-vanh",
  "title": {
    "vi": "Động mạch vành",
    "en": "Coronary Circulation",
    "zh": "冠状循环"
  },
  "latin": "Arteriae et venae cordis",
  "intro": {
    "vi": "Tim tự nuôi mình bằng hai động mạch vành tách từ gốc động mạch chủ. Vành TRÁI chia ngay thành liên thất trước (LAD — nuôi thành trước và 2/3 trước vách liên thất) và mũ (LCx — thành bên). Vành PHẢI chạy trong rãnh vành phải, cho nhánh bờ và thường cả liên thất sau (nuôi thành dưới), cùng nút xoang và nút nhĩ thất. Máu tĩnh mạch gom về xoang vành rồi đổ vào nhĩ phải. Mỗi nhánh chính một màu; thành tim để mờ làm nền.",
    "en": "The heart feeds itself through two coronary arteries arising from the aortic root. The LEFT divides at once into the anterior interventricular (LAD — anterior wall and anterior two-thirds of the septum) and the circumflex (LCx — lateral wall). The RIGHT runs in the right coronary groove, giving marginal branches and usually the posterior interventricular (inferior wall), as well as the SA and AV nodal arteries. Venous blood gathers in the coronary sinus, which drains into the right atrium. Each main branch has its own colour; the heart wall is shown as background.",
    "zh": "心脏依靠起自主动脉根部的两条冠状动脉自我供血。左冠状动脉随即分为前室间支（LAD——供应前壁及室间隔前2/3）和旋支（LCx——供应侧壁）。右冠状动脉走行于右冠状沟，发出缘支，通常还发出后室间支（供应下壁）以及窦房结、房室结动脉。静脉血汇入冠状窦后注入右心房。各主要分支以不同颜色显示；心壁作为背景。"
  },
  "groups": [
    {
      "key": "than-chung-trai",
      "name": {
        "vi": "Thân chung động mạch vành trái",
        "en": "Left main coronary artery",
        "zh": "左冠状动脉主干"
      },
      "latin": "A. coronaria sinistra (truncus)",
      "note": {
        "vi": "Đoạn ngắn 1–2cm từ xoang vành trái đến chỗ chia LAD và mũ. Hẹp thân chung đe doạ cùng lúc khoảng 3/4 cơ thất trái — tổn thương \"widow maker\", thường phải mổ bắc cầu.",
        "en": "A short 1–2cm segment from the left aortic sinus to the LAD/circumflex bifurcation. A left main stenosis threatens about three-quarters of the left ventricle at once — the \"widow maker\" lesion, usually treated by bypass surgery.",
        "zh": "自左主动脉窦至前降支/旋支分叉处的1–2cm短段。左主干狭窄同时威胁左心室约3/4心肌——即“寡妇制造者”病变，通常需行冠状动脉旁路移植术。"
      },
      "tint": "#8f2f3a",
      "parts": [
        "FJ2737"
      ]
    },
    {
      "key": "lad",
      "name": {
        "vi": "Liên thất trước (LAD) và nhánh",
        "en": "Anterior interventricular (LAD) and branches",
        "zh": "前室间支（LAD）及分支"
      },
      "latin": "R. interventricularis anterior (LAD)",
      "note": {
        "vi": "Chạy trong rãnh liên thất trước tới mỏm tim. Nhánh chéo nuôi thành trước-bên, nhánh vách xuyên vào vách liên thất (nuôi bó His), nhánh nón nối với nón phải. Tắc LAD gây nhồi máu thành trước — ST chênh lên V1–V4, vùng nhồi máu lớn nhất.",
        "en": "Runs down the anterior interventricular groove to the apex. Diagonal branches supply the anterolateral wall, septal branches plunge into the septum (supplying the bundle of His), the conus branch meets the right conus artery. LAD occlusion causes an anterior infarct — ST elevation in V1–V4, the largest territory.",
        "zh": "沿前室间沟下行至心尖。对角支供应前侧壁，间隔支穿入室间隔（供应希氏束），圆锥支与右圆锥动脉吻合。前降支闭塞导致前壁梗死——V1–V4导联ST段抬高，梗死范围最大。"
      },
      "tint": "#d6457f",
      "parts": [
        "FJ2631",
        "FJ2632",
        "FJ2633",
        "FJ2634",
        "FJ2635",
        "FJ2636",
        "FJ2637",
        "FJ2638",
        "FJ2639",
        "FJ2640",
        "FJ2641",
        "FJ2642",
        "FJ2643",
        "FJ2644",
        "FJ2645",
        "FJ2646",
        "FJ2647",
        "FJ2648",
        "FJ2732",
        "FJ2733",
        "FJ2734"
      ]
    },
    {
      "key": "mu",
      "name": {
        "vi": "Nhánh mũ (LCx)",
        "en": "Circumflex branch (LCx)",
        "zh": "旋支（LCx）"
      },
      "latin": "R. circumflexus (LCx)",
      "note": {
        "vi": "Vòng sang trái trong rãnh vành, nuôi thành bên và sau thất trái cùng nhĩ trái. Tắc mũ gây nhồi máu thành bên (I, aVL, V5–V6) — hay bị bỏ sót vì điện tim thay đổi kín đáo.",
        "en": "Curves left in the coronary groove, supplying the lateral and posterior left ventricular wall and the left atrium. Circumflex occlusion causes a lateral infarct (I, aVL, V5–V6) — often missed because the ECG changes are subtle.",
        "zh": "沿冠状沟向左绕行，供应左心室侧壁、后壁及左心房。旋支闭塞导致侧壁梗死（I、aVL、V5–V6导联）——因心电图改变隐匿常被漏诊。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2649",
        "FJ2650",
        "FJ2651",
        "FJ2652",
        "FJ2653",
        "FJ2654"
      ]
    },
    {
      "key": "vanh-phai",
      "name": {
        "vi": "Động mạch vành phải và nhánh bờ",
        "en": "Right coronary artery and marginal branches",
        "zh": "右冠状动脉及缘支"
      },
      "latin": "A. coronaria dextra",
      "note": {
        "vi": "Từ xoang vành phải chạy trong rãnh vành phải, cho nhánh nón phải, các nhánh thất trước và nhánh bờ nuôi thất phải. Ở khoảng 60% người nó cho động mạch nút xoang, ở ~80% cho động mạch nút nhĩ thất — nên nhồi máu vành phải hay kèm nhịp chậm, bloc nhĩ thất.",
        "en": "From the right aortic sinus it runs in the right coronary groove, giving the right conus artery, anterior ventricular branches and marginal branches to the right ventricle. In about 60% it supplies the SA node and in ~80% the AV node — so right coronary infarcts often bring bradycardia and AV block.",
        "zh": "起自右主动脉窦，走行于右冠状沟，发出右圆锥动脉、心室前支和缘支供应右心室。约60%人的窦房结动脉、约80%人的房室结动脉来自右冠状动脉——故右冠梗死常伴心动过缓和房室传导阻滞。"
      },
      "tint": "#b8434f",
      "parts": [
        "FJ2667",
        "FJ2668",
        "FJ2670",
        "FJ2671",
        "FJ2672",
        "FJ2673",
        "FJ2674",
        "FJ2675",
        "FJ2676",
        "FJ2677",
        "FJ2723"
      ]
    },
    {
      "key": "lien-that-sau",
      "name": {
        "vi": "Liên thất sau và nhánh thất sau",
        "en": "Posterior interventricular and posterior ventricular branches",
        "zh": "后室间支与左室后支"
      },
      "latin": "R. interventricularis posterior (PDA)",
      "note": {
        "vi": "Chạy trong rãnh liên thất sau, nuôi thành dưới và 1/3 sau vách liên thất. Động mạch nào cho nhánh này quyết định \"ưu thế\" vành (ưu thế phải ở ~70% người, như trong dữ liệu này). Tắc gây nhồi máu thành dưới — ST chênh lên II, III, aVF.",
        "en": "Runs in the posterior interventricular groove, supplying the inferior wall and the posterior third of the septum. Whichever artery gives this branch defines coronary \"dominance\" (right-dominant in ~70%, as in this dataset). Occlusion causes an inferior infarct — ST elevation in II, III, aVF.",
        "zh": "走行于后室间沟，供应下壁及室间隔后1/3。由哪条动脉发出此支决定冠状动脉“优势型”（约70%为右优势型，本数据集亦然）。闭塞导致下壁梗死——II、III、aVF导联ST段抬高。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ2692",
        "FJ2693",
        "FJ2694",
        "FJ2695",
        "FJ2696",
        "FJ2697",
        "FJ2698",
        "FJ2699",
        "FJ2700",
        "FJ2714",
        "FJ2715",
        "FJ2716",
        "FJ2717",
        "FJ2718",
        "FJ2719",
        "FJ2720",
        "FJ2721",
        "FJ2722",
        "FJ2735",
        "FJ2736"
      ]
    },
    {
      "key": "xoang-vanh",
      "name": {
        "vi": "Xoang vành và tĩnh mạch tim lớn",
        "en": "Coronary sinus and great cardiac vein",
        "zh": "冠状窦与心大静脉"
      },
      "latin": "Sinus coronarius · V. cordis magna",
      "note": {
        "vi": "Tĩnh mạch tim lớn đi cùng LAD rồi theo rãnh vành trái ra sau thành xoang vành, đổ vào nhĩ phải. Xoang vành là đường đưa điện cực thất trái trong máy tạo nhịp tái đồng bộ (CRT).",
        "en": "The great cardiac vein accompanies the LAD, then follows the left coronary groove backward to become the coronary sinus, which empties into the right atrium. The coronary sinus is the route for the left ventricular lead in cardiac resynchronisation therapy (CRT).",
        "zh": "心大静脉与前降支伴行，再沿左冠状沟向后移行为冠状窦，注入右心房。冠状窦是心脏再同步化治疗（CRT）放置左心室电极的通路。"
      },
      "tint": "#3f6a8f",
      "parts": [
        "FJ2655",
        "FJ2656",
        "FJ2657",
        "FJ2658",
        "FJ2659",
        "FJ2660",
        "FJ2661",
        "FJ2662",
        "FJ2663",
        "FJ2664",
        "FJ2665"
      ]
    },
    {
      "key": "tm-tim",
      "name": {
        "vi": "Các tĩnh mạch tim khác",
        "en": "Other cardiac veins",
        "zh": "其他心静脉"
      },
      "latin": "Vv. cordis",
      "note": {
        "vi": "Tĩnh mạch tim giữa (đi cùng liên thất sau), tim nhỏ, sau thất trái và các tĩnh mạch bờ đổ vào xoang vành. Riêng các tĩnh mạch tim trước đổ THẲNG vào nhĩ phải, không qua xoang vành.",
        "en": "The middle cardiac (with the posterior interventricular artery), small cardiac, posterior left ventricular and marginal veins drain into the coronary sinus. The anterior cardiac veins alone empty STRAIGHT into the right atrium, bypassing the sinus.",
        "zh": "心中静脉（与后室间支伴行）、心小静脉、左室后静脉及缘静脉汇入冠状窦。唯有心前静脉直接注入右心房，不经冠状窦。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ2678",
        "FJ2679",
        "FJ2680",
        "FJ2681",
        "FJ2682",
        "FJ2683",
        "FJ2684",
        "FJ2685",
        "FJ2686",
        "FJ2687",
        "FJ2688",
        "FJ2689",
        "FJ2690",
        "FJ2691",
        "FJ2701",
        "FJ2702",
        "FJ2703",
        "FJ2704",
        "FJ2705",
        "FJ2706",
        "FJ2707",
        "FJ2708",
        "FJ2709",
        "FJ2710",
        "FJ2711",
        "FJ2712",
        "FJ2713",
        "FJ2724",
        "FJ2725",
        "FJ2727",
        "FJ2728",
        "FJ2729",
        "FJ2730",
        "FJ2731"
      ]
    },
    {
      "key": "thanh-tim",
      "name": {
        "vi": "Thành tim (nền)",
        "en": "Heart wall (background)",
        "zh": "心壁（背景）"
      },
      "latin": "Myocardium",
      "note": {
        "vi": "Thành thất và thành hai nhĩ, để làm nền cho cây mạch. Bấm Làm mờ nhóm này để thấy các nhánh vách xuyên vào trong vách liên thất.",
        "en": "The ventricular and atrial walls, shown as a backdrop for the vessels. Fade this group to see the septal branches plunging into the interventricular septum.",
        "zh": "心室壁与两侧心房壁，作为血管的背景。淡化此组可看到穿入室间隔的间隔支。"
      },
      "parts": [
        "FJ2428",
        "FJ2438",
        "FJ2439",
        "FJ2966",
        "FJ3413"
      ]
    }
  ]
};
