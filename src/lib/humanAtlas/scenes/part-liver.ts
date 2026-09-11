/**
 * Bài bộ phận "Gan — học theo lớp" học theo lớp — nhóm lấy từ liver.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partLiverScene: AtlasSceneDef = {
  "slug": "bo-phan-gan",
  "title": {
    "vi": "Gan — học theo lớp",
    "en": "The Liver — Layer by Layer",
    "zh": "肝——分层学习"
  },
  "latin": "Hepar",
  "system": "digestive",
  "intro": {
    "vi": "Mở ra là tám phân thùy gan theo Couinaud, mỗi phân thùy một màu. Mỗi phân thùy có cuống mạch–mật riêng nên có thể cắt riêng từng phân thùy. Bật lớp Đường mật để thấy túi mật và cây đường mật. Bật lớp Mạch máu để thấy tĩnh mạch cửa, động mạch gan (hai nguồn máu vào) và tĩnh mạch gan (đường ra). Nên làm mờ các phân thùy để nhìn cây mạch bên trong.",
    "en": "It opens on the eight Couinaud segments, each in its own colour. Each segment has its own vascular–biliary pedicle, so it can be removed on its own. Turn on Bile ducts for the gallbladder and biliary tree. Turn on Vessels for the portal vein and hepatic artery (the two inflows) and the hepatic veins (the outflow). Fade the segments to see the trees inside.",
    "zh": "打开时显示Couinaud八个肝段，每段一种颜色。每段有独立的血管–胆管蒂，可单独切除。开启“胆道”可见胆囊和胆管树；开启“血管”可见门静脉、肝动脉（两路入肝血流）及肝静脉（出肝通路）。将肝段淡化可见内部管道树。"
  },
  "layers": [
    {
      "key": "phan-thuy",
      "name": {
        "vi": "Phân thùy",
        "en": "Segments",
        "zh": "肝段"
      },
      "groups": [
        "phan-thuy-1",
        "phan-thuy-2",
        "phan-thuy-3",
        "phan-thuy-4",
        "phan-thuy-5",
        "phan-thuy-6",
        "phan-thuy-7",
        "phan-thuy-8"
      ],
      "on": true
    },
    {
      "key": "mat",
      "name": {
        "vi": "Đường mật",
        "en": "Bile ducts",
        "zh": "胆道"
      },
      "groups": [
        "tui-mat",
        "duong-mat"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Mạch máu",
        "en": "Vessels",
        "zh": "血管"
      },
      "groups": [
        "tm-cua",
        "dm-gan",
        "tm-gan"
      ]
    }
  ],
  "groups": [
    {
      "key": "phan-thuy-1",
      "name": {
        "vi": "Phân thuỳ I (thuỳ đuôi)",
        "en": "Segment I (caudate lobe)",
        "zh": "I段（尾状叶）"
      },
      "latin": "Segmentum I · Lobus caudatus",
      "note": {
        "vi": "Thuỳ đuôi nằm sau, ôm lấy tĩnh mạch chủ dưới. Nó nhận máu từ CẢ nhánh phải lẫn nhánh trái của tĩnh mạch cửa và động mạch gan, lại đổ máu thẳng vào tĩnh mạch chủ dưới qua các tĩnh mạch gan nhỏ riêng — nên trong hội chứng Budd-Chiari (tắc ba tĩnh mạch gan chính) thuỳ đuôi vẫn được dẫn lưu và phì đại bù.",
        "en": "The caudate lobe lies posteriorly, wrapped around the inferior vena cava. It receives blood from BOTH the right and left branches of the portal vein and hepatic artery, and drains straight into the IVC through its own small hepatic veins — so in Budd-Chiari syndrome (occlusion of the three main hepatic veins) it keeps draining and hypertrophies.",
        "zh": "尾状叶位于后方，环抱下腔静脉。它同时接受门静脉和肝动脉左、右两支的血供，并经独立的肝短静脉直接汇入下腔静脉——因此在布-加综合征（三条主肝静脉阻塞）时尾状叶仍能引流并代偿性肥大。"
      },
      "tint": "#c9a36c",
      "parts": [
        "FJ2816"
      ]
    },
    {
      "key": "phan-thuy-2",
      "name": {
        "vi": "Phân thuỳ II",
        "en": "Segment II",
        "zh": "II段"
      },
      "latin": "Segmentum II",
      "note": {
        "vi": "Phân thuỳ sau-ngoài của gan trái, nằm trên phân thuỳ III. Nhận nhánh bên-trên của tĩnh mạch cửa trái và đổ về tĩnh mạch gan trái. Cùng phân thuỳ III tạo nên thuỳ trái kinh điển (bên trái dây chằng liềm).",
        "en": "The posterolateral segment of the left liver, lying above segment III. It is supplied by the lateral superior branch of the left portal vein and drains into the left hepatic vein. Together with segment III it forms the classical left lobe (left of the falciform ligament).",
        "zh": "左肝后外侧段，位于III段上方。由门静脉左支外上支供血，回流至肝左静脉。与III段共同构成传统意义上的左叶（镰状韧带左侧）。"
      },
      "tint": "#9c4f3f",
      "parts": [
        "FJ2818"
      ]
    },
    {
      "key": "phan-thuy-3",
      "name": {
        "vi": "Phân thuỳ III",
        "en": "Segment III",
        "zh": "III段"
      },
      "latin": "Segmentum III",
      "note": {
        "vi": "Phân thuỳ trước-ngoài của gan trái. Khối II + III (thuỳ trái bên) có cuống mạch gọn và kích thước vừa với ổ bụng trẻ nhỏ, nên là mảnh ghép kinh điển khi hiến gan từ người sống cho trẻ em.",
        "en": "The anterolateral segment of the left liver. Segments II + III (the left lateral section) have a compact pedicle and a size that fits a small child's abdomen, making them the classic graft in living-donor liver transplantation for children.",
        "zh": "左肝前外侧段。II + III段（左外叶）血管蒂紧凑、体积适合幼儿腹腔，是儿童活体肝移植的经典供肝。"
      },
      "tint": "#b8674f",
      "parts": [
        "FJ2819"
      ]
    },
    {
      "key": "phan-thuy-4",
      "name": {
        "vi": "Phân thuỳ IV (thuỳ vuông)",
        "en": "Segment IV (quadrate lobe)",
        "zh": "IV段（方叶）"
      },
      "latin": "Segmentum IV",
      "note": {
        "vi": "Nằm giữa dây chằng liềm và giường túi mật; phần dưới mặt tạng chính là thuỳ vuông. Về chức năng nó thuộc GAN TRÁI (nhận nhánh tĩnh mạch cửa trái) dù trông như nằm ở giữa — ranh giới thật giữa gan phải và trái là đường Cantlie từ giường túi mật tới tĩnh mạch chủ dưới, không phải dây chằng liềm.",
        "en": "Lies between the falciform ligament and the gallbladder bed; its lower visceral part is the quadrate lobe. Functionally it belongs to the LEFT liver (it is fed by the left portal vein) even though it looks central — the true right/left division is Cantlie's line from the gallbladder bed to the IVC, not the falciform ligament.",
        "zh": "位于镰状韧带与胆囊床之间，其脏面下部即方叶。尽管看似居中，功能上属于左半肝（由门静脉左支供血）——真正的左右肝分界是从胆囊床至下腔静脉的Cantlie线，而非镰状韧带。"
      },
      "tint": "#c98361",
      "parts": [
        "FJ2820"
      ]
    },
    {
      "key": "phan-thuy-5",
      "name": {
        "vi": "Phân thuỳ V",
        "en": "Segment V",
        "zh": "V段"
      },
      "latin": "Segmentum V",
      "note": {
        "vi": "Phân thuỳ trước-dưới của gan phải, áp sát giường túi mật. Cùng phân thuỳ VIII tạo thành khu trước phải, cấp máu bởi nhánh trước của tĩnh mạch cửa phải; tĩnh mạch gan giữa chạy ở ranh giới V/IV.",
        "en": "The anteroinferior segment of the right liver, pressed against the gallbladder bed. With segment VIII it forms the right anterior section, fed by the anterior branch of the right portal vein; the middle hepatic vein runs along the V/IV boundary.",
        "zh": "右肝前下段，紧贴胆囊床。与VIII段组成右前叶，由门静脉右前支供血；肝中静脉走行于V/IV段交界。"
      },
      "tint": "#8f5a48",
      "parts": [
        "FJ2821"
      ]
    },
    {
      "key": "phan-thuy-6",
      "name": {
        "vi": "Phân thuỳ VI",
        "en": "Segment VI",
        "zh": "VI段"
      },
      "latin": "Segmentum VI",
      "note": {
        "vi": "Phân thuỳ sau-dưới của gan phải, phần thấp và ngoài nhất của gan — cửa sổ siêu âm dễ nhất qua khoang liên sườn dưới phải. Cùng phân thuỳ VII tạo khu sau phải, dẫn lưu về tĩnh mạch gan phải. (Atlas gán nhãn phân thuỳ bằng tên sai lệch; ở đây đã gán lại theo vị trí đo được.)",
        "en": "The posteroinferior segment of the right liver — the lowest, most lateral part of the organ and the easiest ultrasound window through the lower right intercostal spaces. With segment VII it forms the right posterior section, draining to the right hepatic vein. (The atlas mislabels its segments; they are reassigned here by measured position.)",
        "zh": "右肝后下段，是肝脏最低、最外侧的部分，也是经右下肋间最易获得超声声窗的区域。与VII段组成右后叶，回流至肝右静脉。（图谱原始段名有误，此处已按实测位置重新标定。）"
      },
      "tint": "#a86e5a",
      "parts": [
        "FJ2822"
      ]
    },
    {
      "key": "phan-thuy-7",
      "name": {
        "vi": "Phân thuỳ VII",
        "en": "Segment VII",
        "zh": "VII段"
      },
      "latin": "Segmentum VII",
      "note": {
        "vi": "Phân thuỳ sau-trên của gan phải, nằm cao dưới vòm hoành phải và bị lồng ngực che — khó sờ, khó tiếp cận khi phẫu thuật nội soi. Áp xe gan hay gặp ở đây vì đây là vùng nhu mô lớn nhận nhiều máu cửa. (Mảnh gốc bị atlas ghi nhầm là \"VIII\".)",
        "en": "The posterosuperior segment of the right liver, high under the right dome of the diaphragm and hidden by the rib cage — hard to palpate and hard to reach laparoscopically. Liver abscesses favour it because it is a large block of parenchyma with abundant portal flow. (The source mesh is mislabelled \"VIII\" in the atlas.)",
        "zh": "右肝后上段，位于右膈顶下方，被胸廓遮挡——难以触及，腹腔镜也难以到达。因实质体积大、门静脉血流丰富，肝脓肿好发于此。（该网格在图谱中被误标为“VIII”。）"
      },
      "tint": "#7a4a3d",
      "parts": [
        "FJ2823"
      ]
    },
    {
      "key": "phan-thuy-8",
      "name": {
        "vi": "Phân thuỳ VIII",
        "en": "Segment VIII",
        "zh": "VIII段"
      },
      "latin": "Segmentum VIII",
      "note": {
        "vi": "Phân thuỳ trước-trên của gan phải, thường có thể tích lớn nhất. Nằm kẹp giữa tĩnh mạch gan giữa và tĩnh mạch gan phải, ngay dưới vòm hoành.",
        "en": "The anterosuperior segment of the right liver, usually the largest by volume. It is wedged between the middle and right hepatic veins, directly beneath the diaphragm.",
        "zh": "右肝前上段，通常体积最大。夹于肝中静脉与肝右静脉之间，紧贴膈下。"
      },
      "tint": "#b77f6c",
      "parts": [
        "FJ2824"
      ]
    },
    {
      "key": "tui-mat",
      "name": {
        "vi": "Túi mật và ống túi mật",
        "en": "Gallbladder and cystic duct",
        "zh": "胆囊与胆囊管"
      },
      "latin": "Vesica biliaris",
      "note": {
        "vi": "Túi mật nằm trong giường túi mật giữa phân thuỳ IV và V, dự trữ và cô đặc mật tới khoảng 10 lần. Ống túi mật nối vào ống gan chung tạo ống mật chủ; sỏi kẹt ở cổ túi mật gây cơn đau quặn và viêm túi mật cấp.",
        "en": "The gallbladder sits in its bed between segments IV and V and stores bile, concentrating it about tenfold. The cystic duct joins the common hepatic duct to form the common bile duct; a stone lodged in the gallbladder neck causes biliary colic and acute cholecystitis.",
        "zh": "胆囊位于IV段与V段之间的胆囊床内，储存胆汁并将其浓缩约10倍。胆囊管与肝总管汇合成胆总管；结石嵌顿于胆囊颈可引起胆绞痛和急性胆囊炎。"
      },
      "tint": "#5f8a45",
      "parts": [
        "FJ2817",
        "FJ3080"
      ]
    },
    {
      "key": "duong-mat",
      "name": {
        "vi": "Đường mật trong gan",
        "en": "Intrahepatic bile ducts",
        "zh": "肝内胆管"
      },
      "latin": "Ductus biliferi",
      "note": {
        "vi": "Mật đi NGƯỢC chiều máu: từ các ống mật phân thuỳ gom về ống gan phải và trái, hợp thành ống gan chung ở rốn gan. Mỗi phân thuỳ có ống mật riêng đi kèm nhánh tĩnh mạch cửa và động mạch gan cùng tên — bộ ba cửa (portal triad) — nên cắt bỏ một phân thuỳ không ảnh hưởng dẫn lưu mật của phân thuỳ bên cạnh.",
        "en": "Bile flows OPPOSITE to blood: segmental ducts converge into the right and left hepatic ducts, which join as the common hepatic duct at the hilum. Each segment has its own duct running with the portal vein and hepatic artery branches of the same name — the portal triad — which is why one segment can be resected without compromising biliary drainage of its neighbours.",
        "zh": "胆汁流向与血流相反：各段胆管汇合成左、右肝管，于肝门处合成肝总管。每一肝段均有自己的胆管，与同名门静脉支和肝动脉支伴行——即门管三联——因此切除一个肝段不会影响相邻肝段的胆汁引流。"
      },
      "tint": "#6f9a4f",
      "parts": [
        "FJ1883",
        "FJ3071",
        "FJ3072",
        "FJ3079",
        "FJ3088",
        "FJ3089",
        "FJ3090",
        "FJ3096",
        "FJ3103",
        "FJ3104",
        "FJ3105",
        "FJ3108",
        "FJ3109",
        "FJ3110",
        "FJ3123"
      ]
    },
    {
      "key": "tm-cua",
      "name": {
        "vi": "Tĩnh mạch cửa",
        "en": "Hepatic portal vein",
        "zh": "肝门静脉"
      },
      "latin": "Vena portae hepatis",
      "note": {
        "vi": "Mang khoảng 75% lượng máu vào gan — máu tĩnh mạch từ dạ dày, ruột, lách, tuỵ, giàu chất hấp thu nhưng nghèo oxy. Chia nhánh phải và trái, rồi nhánh phân thuỳ: CHÍNH cách chia nhánh của tĩnh mạch cửa là nền của hệ phân thuỳ Couinaud. Tô tím để phân biệt với tĩnh mạch gan.",
        "en": "Delivers about 75% of the liver's blood — venous blood from the stomach, intestines, spleen and pancreas, rich in absorbed nutrients but poor in oxygen. It divides into right and left branches, then segmental branches: its branching pattern IS the basis of the Couinaud segments. Coloured violet to tell it apart from the hepatic veins.",
        "zh": "供应肝脏约75%的血流——来自胃、肠、脾、胰的静脉血，富含吸收的营养但含氧低。先分左右支，再分段支：Couinaud分段正是以门静脉的分支方式为基础。此处以紫色区别于肝静脉。"
      },
      "tint": "#7a6aa6",
      "parts": [
        "FJ1853",
        "FJ1893",
        "FJ1913",
        "FJ1914",
        "FJ2404",
        "FJ2405",
        "FJ3073",
        "FJ3074",
        "FJ3102",
        "FJ3111",
        "FJ3112",
        "FJ3113",
        "FJ3122",
        "FJ3124",
        "FJ3125",
        "FJ3126",
        "FJ3127",
        "FJ3128"
      ]
    },
    {
      "key": "dm-gan",
      "name": {
        "vi": "Động mạch gan",
        "en": "Hepatic artery",
        "zh": "肝动脉"
      },
      "latin": "Arteria hepatica",
      "note": {
        "vi": "Chỉ mang khoảng 25% lượng máu nhưng gần một nửa lượng oxy cho gan, và là nguồn nuôi DUY NHẤT của đường mật. Vì thế tắc động mạch gan sau ghép gan gây hoại tử đường mật dù nhu mô vẫn còn máu cửa.",
        "en": "Carries only about 25% of the liver's blood but nearly half of its oxygen, and is the ONLY supply to the bile ducts. That is why hepatic artery thrombosis after liver transplantation causes biliary necrosis even though the parenchyma still receives portal blood.",
        "zh": "仅提供肝脏约25%的血流，却供应近一半的氧，且是胆管的唯一血供。因此肝移植后肝动脉血栓会导致胆管坏死，即使肝实质仍有门静脉血供。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1874",
        "FJ1916",
        "FJ1924",
        "FJ3075",
        "FJ3076",
        "FJ3078",
        "FJ3081",
        "FJ3091",
        "FJ3092",
        "FJ3093",
        "FJ3095",
        "FJ3106",
        "FJ3107",
        "FJ3114",
        "FJ3115",
        "FJ3116",
        "FJ3117"
      ]
    },
    {
      "key": "tm-gan",
      "name": {
        "vi": "Tĩnh mạch gan",
        "en": "Hepatic veins",
        "zh": "肝静脉"
      },
      "latin": "Venae hepaticae",
      "note": {
        "vi": "Ba tĩnh mạch gan (phải, giữa, trái) chạy GIỮA các phân thuỳ — ngược với bộ ba cửa chạy ở TÂM phân thuỳ — rồi đổ vào tĩnh mạch chủ dưới sát cơ hoành. Tĩnh mạch gan giữa nằm đúng mặt phẳng Cantlie chia gan phải và trái.",
        "en": "The three hepatic veins (right, middle, left) run BETWEEN the segments — the opposite of the portal triads, which run through their CENTRE — and empty into the IVC just below the diaphragm. The middle hepatic vein lies exactly in Cantlie's plane dividing the right and left liver.",
        "zh": "三条肝静脉（右、中、左）走行于肝段之间——与走行于肝段中心的门管三联相反——在膈下汇入下腔静脉。肝中静脉恰好位于划分左右半肝的Cantlie平面上。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ1867",
        "FJ2414",
        "FJ2415",
        "FJ2416",
        "FJ3083",
        "FJ3084",
        "FJ3085",
        "FJ3086",
        "FJ3097",
        "FJ3098",
        "FJ3099",
        "FJ3100",
        "FJ3101",
        "FJ3118",
        "FJ3119",
        "FJ3120",
        "FJ3121"
      ]
    }
  ]
};
