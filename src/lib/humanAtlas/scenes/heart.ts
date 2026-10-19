
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Giải phẫu Tim" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-heart.mjs — mọi mã FJ đều là mảnh
 * CÓ THẬT trong manifest. Đừng sửa tay file này.
 *
 * Ba điều đã xử lý mà bộ dữ liệu gốc làm sai, thiếu hoặc quá thô:
 *  1. Không lấy cả `system === 'cardiac'`: 5/23 mảnh của hệ đó là NÃO THẤT
 *     (human-atlas xếp nhầm vì trùng chữ "ventricle").
 *  2. Màu tô theo MỨC OXY chứ không theo hệ — xem chú thích trong script.
 *  3. Bỏ tĩnh mạch chủ: lưới gốc chỉ 324 tam giác cho ống dài 9,6cm, nhìn như
 *     cái cọc đâm xuyên tâm nhĩ.
 */
import type { AtlasSceneDef } from "./types";

export const heartScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/heart.ts#heartScene", {
  slug: "giai-phau-tim",
  title: { vi: "Giải phẫu Tim", en: "Anatomy of the Heart", zh: "心脏解剖" },
  latin: "Cor",
  intro: {
    vi: "Tim là khối cơ rỗng bốn buồng nằm trong trung thất giữa. Nửa phải (tô xanh) nhận máu nghèo oxy rồi bơm lên phổi; nửa trái (tô đỏ) nhận máu giàu oxy rồi bơm đi khắp cơ thể. Màu ở đây theo MỨC OXY chứ không theo động mạch hay tĩnh mạch — nên động mạch phổi màu xanh còn tĩnh mạch phổi màu đỏ.",
    en: "The heart is a hollow four-chambered muscle in the middle mediastinum. The right side (blue) receives oxygen-poor blood and pumps it to the lungs; the left side (red) receives oxygen-rich blood and pumps it to the whole body. Colour here follows OXYGEN LEVEL rather than artery-versus-vein, which is why the pulmonary artery is blue and the pulmonary veins are red.",
    zh: "心脏是位于中纵隔的四腔中空肌性器官。右半（蓝色）接收低氧血并泵向肺部；左半（红色）接收富氧血并泵向全身。此处配色依据含氧量而非动静脉之分，因此肺动脉为蓝色、肺静脉为红色。",
  },
  frameGroups: ["nhi-phai","that-phai","nhi-trai","that-trai","thanh-that","van-ba-la","van-hai-la","van-dm-phoi","van-dm-chu","than-dm-phoi","tm-phoi","dm-chu","dm-vanh","tm-vanh"],
  groups: [
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
        "key": "dm-vanh",
        "name": {
            "vi": "Động mạch vành",
            "en": "Coronary arteries",
            "zh": "冠状动脉"
        },
        "latin": "Arteriae coronariae",
        "note": {
            "vi": "Tim tự nuôi mình bằng hai động mạch vành tách ra ngay trên van động mạch chủ. Tắc nhánh liên thất trước (LAD) chạy dọc rãnh gian thất trước gây nhồi máu thành trước.",
            "en": "The heart feeds itself through two coronary arteries arising just above the aortic valve. Occlusion of the left anterior descending branch, which runs along the anterior interventricular groove, causes an anterior wall infarction.",
            "zh": "心脏依靠主动脉瓣上方发出的两条冠状动脉自我供血。走行于前室间沟的前降支闭塞可导致前壁心肌梗死。"
        },
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
            "FJ2649",
            "FJ2650",
            "FJ2651",
            "FJ2652",
            "FJ2653",
            "FJ2654",
            "FJ2667",
            "FJ2668",
            "FJ2671",
            "FJ2672",
            "FJ2673",
            "FJ2674",
            "FJ2675",
            "FJ2677",
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
            "FJ2723",
            "FJ2737"
        ]
    },
    {
        "key": "tm-vanh",
        "name": {
            "vi": "Tĩnh mạch vành và xoang vành",
            "en": "Cardiac veins and coronary sinus",
            "zh": "心静脉与冠状窦"
        },
        "latin": "Sinus coronarius",
        "note": {
            "vi": "Máu nuôi cơ tim gom về tĩnh mạch tim lớn rồi xoang vành, đổ thẳng vào tâm nhĩ phải.",
            "en": "Blood that has supplied the myocardium collects into the great cardiac vein and then the coronary sinus, which drains directly into the right atrium.",
            "zh": "营养心肌后的血液汇入心大静脉，再经冠状窦直接回流入右心房。"
        },
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
    }
],
});
