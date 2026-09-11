/**
 * Scene "Tim: buồng, van và mạch vành" — ghép nhóm đã duyệt của scene tim mẫu
 * và scene động mạch vành.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-heart-full.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const heartFullScene: AtlasSceneDef = {
  "slug": "tim-day-du",
  "title": {
    "vi": "Tim: buồng, van và mạch vành",
    "en": "The Heart: Chambers, Valves & Coronaries",
    "zh": "心脏：心腔、瓣膜与冠脉"
  },
  "latin": "Cor",
  "intro": {
    "vi": "Bài đầy đủ: bốn buồng tim với cơ nhú, bốn van, các mạch lớn và cây mạch vành chi tiết tới từng nhánh (LAD, mũ, vành phải, liên thất sau) cùng các tĩnh mạch tim đổ về xoang vành. Buồng và mạch lớn tô theo mức oxy (xanh nghèo oxy, đỏ giàu oxy); mạch vành mỗi nhánh một màu. Bật mặt cắt để thấy van và cơ nhú bên trong.",
    "en": "The complete lesson: the four chambers with their papillary muscles, the four valves, the great vessels and a detailed coronary tree down to each branch (LAD, circumflex, right coronary, posterior descending) with the cardiac veins draining to the coronary sinus. Chambers and great vessels follow oxygen level (blue poor, red rich); each coronary branch has its own colour. Turn on the cross-section to see the valves and papillary muscles inside.",
    "zh": "完整课程：四个心腔及乳头肌、四个瓣膜、大血管，以及细化至各分支的冠状动脉树（前降支、旋支、右冠状动脉、后降支）和汇入冠状窦的心静脉。心腔和大血管按含氧量着色（蓝为低氧，红为富氧）；每条冠脉分支各一色。开启切面可见内部的瓣膜和乳头肌。"
  },
  "frameGroups": [
    "nhi-phai",
    "that-phai",
    "nhi-trai",
    "that-trai",
    "thanh-that",
    "van-ba-la",
    "van-hai-la",
    "van-dm-phoi",
    "van-dm-chu",
    "than-dm-phoi",
    "tm-phoi",
    "dm-chu"
  ],
  "groups": [
    {
      "key": "nhi-phai",
      "name": {
        "vi": "Tâm nhĩ phải",
        "en": "Right atrium",
        "zh": "右心房"
      },
      "latin": "Atrium dextrum",
      "note": {
        "vi": "Nhận máu nghèo oxy từ tĩnh mạch chủ trên và dưới đổ về, rồi xuống tâm thất phải qua van ba lá. Nút xoang nhĩ — máy tạo nhịp tự nhiên của tim — nằm trong thành buồng này.",
        "en": "Receives oxygen-poor blood from the superior and inferior vena cava, then passes it to the right ventricle through the tricuspid valve. The sinoatrial node, the heart's natural pacemaker, sits in this chamber's wall.",
        "zh": "接收来自上、下腔静脉的低氧血，经三尖瓣流入右心室。心脏的天然起搏点窦房结即位于此腔壁内。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2424",
        "FJ2439"
      ]
    },
    {
      "key": "that-phai",
      "name": {
        "vi": "Tâm thất phải",
        "en": "Right ventricle",
        "zh": "右心室"
      },
      "latin": "Ventriculus dexter",
      "note": {
        "vi": "Bơm máu nghèo oxy vào thân động mạch phổi. Thành mỏng hơn thất trái vì chỉ phải thắng sức cản thấp của vòng tiểu tuần hoàn. Ba cơ nhú kéo giữ lá van ba lá.",
        "en": "Pumps oxygen-poor blood into the pulmonary trunk. Its wall is thinner than the left ventricle because it only has to overcome the low resistance of the pulmonary circuit. Three papillary muscles anchor the tricuspid leaflets.",
        "zh": "将低氧血泵入肺动脉干。因只需克服肺循环的低阻力，其室壁较左心室薄。三块乳头肌牵拉固定三尖瓣叶。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2423",
        "FJ2419",
        "FJ2430",
        "FJ2437"
      ]
    },
    {
      "key": "nhi-trai",
      "name": {
        "vi": "Tâm nhĩ trái",
        "en": "Left atrium",
        "zh": "左心房"
      },
      "latin": "Atrium sinistrum",
      "note": {
        "vi": "Nhận máu giàu oxy từ bốn tĩnh mạch phổi, đổ xuống tâm thất trái qua van hai lá. Thành mỏng vì chỉ đẩy máu một quãng ngắn.",
        "en": "Receives oxygen-rich blood from the four pulmonary veins and passes it to the left ventricle through the mitral valve. Its wall is thin because it only moves blood a short distance.",
        "zh": "接收四条肺静脉回流的富氧血，经二尖瓣流入左心室。因输送距离短，房壁较薄。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2425",
        "FJ2438"
      ]
    },
    {
      "key": "that-trai",
      "name": {
        "vi": "Tâm thất trái",
        "en": "Left ventricle",
        "zh": "左心室"
      },
      "latin": "Ventriculus sinister",
      "note": {
        "vi": "Buồng bơm chính của cơ thể. Thành dày gấp nhiều lần thất phải vì phải tạo áp lực đẩy máu đi khắp vòng tuần hoàn hệ thống. Cơ nhú bên giữ lá van hai lá.",
        "en": "The body's main pumping chamber. Its wall is several times thicker than the right ventricle because it must generate the pressure that drives blood through the systemic circulation. The lateral papillary muscle anchors the mitral leaflets.",
        "zh": "全身主要的泵血腔。因需产生驱动体循环的压力，室壁厚度为右心室的数倍。外侧乳头肌固定二尖瓣叶。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2422",
        "FJ2418",
        "FJ2429"
      ]
    },
    {
      "key": "thanh-that",
      "name": {
        "vi": "Thành cơ thất",
        "en": "Ventricular myocardium",
        "zh": "心室肌壁"
      },
      "latin": "Myocardium ventriculare",
      "note": {
        "vi": "Khối cơ tim bao cả hai thất — trong bộ dữ liệu này hai thất dùng CHUNG một khối thành, không tách riêng được. Bật mặt cắt lát ngang sẽ thấy rõ chênh lệch bề dày giữa hai bên.",
        "en": "The muscle mass enclosing both ventricles. In this dataset the two ventricles SHARE a single wall mesh and cannot be separated. Turn on the transverse cross-section to see the difference in wall thickness between the two sides.",
        "zh": "包绕两个心室的心肌整体。本数据集中两室共用同一壁网格，无法单独分离。开启横断切面即可看清两侧壁厚差异。"
      },
      "parts": [
        "FJ2428"
      ]
    },
    {
      "key": "van-ba-la",
      "name": {
        "vi": "Van ba lá",
        "en": "Tricuspid valve",
        "zh": "三尖瓣"
      },
      "latin": "Valva tricuspidalis",
      "note": {
        "vi": "Ngăn tâm nhĩ phải với tâm thất phải, gồm lá trước, lá sau và lá vách. Đóng khi thất co để máu không trào ngược lên nhĩ.",
        "en": "Separates the right atrium from the right ventricle; it has an anterior, a posterior and a septal leaflet. It closes during ventricular contraction so blood cannot flow back into the atrium.",
        "zh": "分隔右心房与右心室，由前叶、后叶和隔叶组成。心室收缩时关闭，防止血液反流入心房。"
      },
      "parts": [
        "FJ2421",
        "FJ2433",
        "FJ2436"
      ]
    },
    {
      "key": "van-hai-la",
      "name": {
        "vi": "Van hai lá",
        "en": "Mitral valve",
        "zh": "二尖瓣"
      },
      "latin": "Valva mitralis",
      "note": {
        "vi": "Ngăn tâm nhĩ trái với tâm thất trái, chỉ có lá trước và lá sau — tên \"hai lá\" từ đó mà ra.",
        "en": "Separates the left atrium from the left ventricle. It has only an anterior and a posterior leaflet, which is where the name \"bicuspid\" comes from.",
        "zh": "分隔左心房与左心室，仅有前叶与后叶两片瓣叶，故又称二尖瓣。"
      },
      "parts": [
        "FJ2420",
        "FJ2432"
      ]
    },
    {
      "key": "van-dm-phoi",
      "name": {
        "vi": "Van động mạch phổi",
        "en": "Pulmonary valve",
        "zh": "肺动脉瓣"
      },
      "latin": "Valva trunci pulmonalis",
      "note": {
        "vi": "Ba cánh bán nguyệt ở lối ra của thất phải. Mở khi thất co, đóng khi thất giãn để máu không chảy ngược về thất.",
        "en": "Three semilunar cusps at the outflow of the right ventricle. They open as the ventricle contracts and close as it relaxes, preventing backflow into the ventricle.",
        "zh": "位于右心室流出道的三个半月瓣。心室收缩时开放，舒张时关闭，防止血液反流回心室。"
      },
      "parts": [
        "FJ2417",
        "FJ2427",
        "FJ2434"
      ]
    },
    {
      "key": "van-dm-chu",
      "name": {
        "vi": "Van động mạch chủ",
        "en": "Aortic valve",
        "zh": "主动脉瓣"
      },
      "latin": "Valva aortae",
      "note": {
        "vi": "Ba cánh bán nguyệt ở lối ra của thất trái. Ngay trên van này là lỗ xuất phát của hai động mạch vành.",
        "en": "Three semilunar cusps at the outflow of the left ventricle. The openings of the two coronary arteries lie just above this valve.",
        "zh": "位于左心室流出道的三个半月瓣。两条冠状动脉的开口就在此瓣上方。"
      },
      "parts": [
        "FJ2426",
        "FJ2431",
        "FJ2435"
      ]
    },
    {
      "key": "than-dm-phoi",
      "name": {
        "vi": "Thân và động mạch phổi",
        "en": "Pulmonary trunk and arteries",
        "zh": "肺动脉干及肺动脉"
      },
      "latin": "Truncus pulmonalis",
      "note": {
        "vi": "ĐỘNG mạch nhưng mang máu NGHÈO oxy — ngoại lệ của quy tắc \"động mạch đỏ\". Thất phải bơm vào thân động mạch phổi, chia đôi lên hai phổi.",
        "en": "An ARTERY that carries oxygen-POOR blood — the exception to the \"arteries are red\" rule. The right ventricle pumps into the pulmonary trunk, which divides to reach both lungs.",
        "zh": "虽为动脉却输送低氧血，是动脉即红色这一规则的例外。右心室将血液泵入肺动脉干，再分为左右两支进入双肺。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2924",
        "FJ2966",
        "FJ3019"
      ]
    },
    {
      "key": "tm-phoi",
      "name": {
        "vi": "Tĩnh mạch phổi",
        "en": "Pulmonary veins",
        "zh": "肺静脉"
      },
      "latin": "Venae pulmonales",
      "note": {
        "vi": "TĨNH mạch nhưng mang máu GIÀU oxy — ngoại lệ còn lại. Bốn tĩnh mạch phổi đưa máu đã trao đổi khí về tâm nhĩ trái.",
        "en": "VEINS that carry oxygen-RICH blood — the other exception. Four pulmonary veins return freshly oxygenated blood to the left atrium.",
        "zh": "虽为静脉却输送富氧血，是另一个例外。四条肺静脉将完成气体交换的血液送回左心房。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2925",
        "FJ2933",
        "FJ2944",
        "FJ2950",
        "FJ2955",
        "FJ3020",
        "FJ3040"
      ]
    },
    {
      "key": "dm-chu",
      "name": {
        "vi": "Động mạch chủ",
        "en": "Aorta",
        "zh": "主动脉"
      },
      "latin": "Aorta",
      "note": {
        "vi": "Máu giàu oxy rời thất trái qua động mạch chủ lên, vòng qua quai động mạch chủ rồi đi nuôi toàn thân.",
        "en": "Oxygen-rich blood leaves the left ventricle through the ascending aorta, curves around the aortic arch and travels on to supply the whole body.",
        "zh": "富氧血自左心室经升主动脉射出，绕过主动脉弓后输送至全身。"
      },
      "parts": [
        "FJ3411",
        "FJ3413"
      ]
    },
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
    }
  ]
};
