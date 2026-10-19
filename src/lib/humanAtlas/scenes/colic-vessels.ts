
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Đại tràng, mạc treo và mạch đại tràng" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Phúc mạc và mạc treo" cũ: atlas chỉ có mạc treo đại tràng ngang và mạc treo ruột thừa, không có phúc mạc thành, mạc nối.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const colicVesselsScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/colic-vessels.ts#colicVesselsScene", {
  "slug": "phuc-mac-mac-treo",
  "title": {
    "vi": "Đại tràng, mạc treo và mạch đại tràng",
    "en": "The Colon, its Mesenteries and Vessels",
    "zh": "结肠、系膜与结肠血管"
  },
  "latin": "Colon · Mesocolon · Aa. colicae",
  "system": "digestive",
  "intro": {
    "vi": "Đại tràng đi thành khung quanh ruột non: manh tràng và ruột thừa, đại tràng lên, ngang, xuống, xích-ma, rồi trực tràng. Đại tràng ngang và xích-ma có mạc treo nên di động. Đại tràng lên và xuống dính vào thành bụng sau. Máu nuôi đến từ hai nguồn. Động mạch mạc treo tràng trên (ruột giữa) cho hồi–đại tràng, đại tràng phải, đại tràng giữa. Động mạch mạc treo tràng dưới (ruột sau) cho đại tràng trái, xích-ma, trực tràng trên. Các nhánh nối nhau dọc bờ mạc treo thành động mạch bờ. Điểm nối yếu ở góc lách dễ thiếu máu khi tụt huyết áp. Ruột mờ sẵn; mạch đỏ–xanh.",
    "en": "The colon frames the small intestine: caecum and appendix, ascending, transverse, descending and sigmoid colon, then rectum. The transverse and sigmoid colon have mesenteries and are mobile. The ascending and descending colon are fixed to the posterior wall. Blood comes from two sources. The superior mesenteric (midgut) gives the ileocolic, right colic and middle colic arteries. The inferior mesenteric (hindgut) gives the left colic, sigmoid and superior rectal arteries. They link along the mesenteric border as the marginal artery. The weak link at the splenic flexure is prone to ischaemia when blood pressure falls. The bowel is faded; vessels are red and blue.",
    "zh": "结肠环绕小肠成框：盲肠和阑尾、升结肠、横结肠、降结肠、乙状结肠，再为直肠。横结肠和乙状结肠有系膜而可移动；升、降结肠固定于腹后壁。血供来自两个来源：肠系膜上动脉（中肠）发出回结肠、右结肠、中结肠动脉；肠系膜下动脉（后肠）发出左结肠、乙状结肠和直肠上动脉。各支沿系膜缘吻合成边缘动脉。结肠脾曲处吻合薄弱，低血压时易缺血。肠管淡化；血管红蓝。"
  },
  "frameGroups": [
    "tren",
    "duoi",
    "bo",
    "mac-treo"
  ],
  "fadedGroups": [
    "ruot"
  ],
  "groups": [
    {
      "key": "tren",
      "name": {
        "vi": "Nhánh mạc treo tràng trên: hồi–đại tràng, đại tràng phải, giữa",
        "en": "Superior mesenteric branches: ileocolic, right colic, middle colic",
        "zh": "肠系膜上动脉分支：回结肠、右结肠、中结肠动脉"
      },
      "latin": "Aa. ileocolica, colica dextra, colica media",
      "note": {
        "vi": "Động mạch hồi–đại tràng cho động mạch ruột thừa đi trong mạc treo ruột thừa. Thắt nó là bước chính khi cắt ruột thừa.",
        "en": "The ileocolic gives the appendicular artery in the mesoappendix; ligating it is the key step of appendicectomy.",
        "zh": "回结肠动脉发出行于阑尾系膜内的阑尾动脉，结扎之是阑尾切除术的关键步骤。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2034",
        "FJ3414",
        "FJ3439",
        "FJ3494",
        "FJ3542",
        "FJ3590"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Nhánh mạc treo tràng dưới: xích-ma, trực tràng trên",
        "en": "Inferior mesenteric branches: sigmoid, superior rectal",
        "zh": "肠系膜下动脉分支：乙状结肠、直肠上动脉"
      },
      "latin": "Aa. sigmoideae · A. rectalis superior",
      "note": {
        "vi": "Động mạch trực tràng trên là nhánh tận, xuống sau trực tràng. Cắt đại tràng xích-ma phải bảo tồn nó hoặc giữ đủ vòng nối.",
        "en": "The superior rectal is the terminal branch, descending behind the rectum; sigmoid resections must preserve it or keep enough collateral flow.",
        "zh": "直肠上动脉为终支，行于直肠后方；乙状结肠切除时须保留之或保证足够侧支。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3638",
        "FJ3656"
      ]
    },
    {
      "key": "bo",
      "name": {
        "vi": "Động mạch bờ (Drummond)",
        "en": "Marginal artery (of Drummond)",
        "zh": "边缘动脉（Drummond动脉）"
      },
      "latin": "A. marginalis coli",
      "note": {
        "vi": "Chạy liên tục dọc bờ trong đại tràng, nối hệ trên và dưới. Nó cho các mạch thẳng đi vào thành ruột.",
        "en": "Runs continuously along the inner border of the colon, linking the two systems and giving the vasa recta into the wall.",
        "zh": "沿结肠内缘连续走行，连接上下两系，发出直小血管入肠壁。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ3534"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch đại tràng",
        "en": "Colic veins",
        "zh": "结肠静脉"
      },
      "latin": "Vv. colicae · V. rectalis superior",
      "note": {
        "vi": "Đi kèm động mạch, đổ về hệ cửa. Ung thư đại tràng di căn gan theo đường này.",
        "en": "Accompany the arteries into the portal system — the route by which colon cancer spreads to the liver.",
        "zh": "伴行动脉汇入门静脉系统，结肠癌经此途径转移至肝。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3400",
        "FJ3415",
        "FJ3429",
        "FJ3440",
        "FJ3495",
        "FJ3543",
        "FJ3591",
        "FJ3639",
        "FJ3657"
      ]
    },
    {
      "key": "mac-treo",
      "name": {
        "vi": "Mạc treo đại tràng ngang, mạc treo ruột thừa, dải cơ dọc",
        "en": "Transverse mesocolon, mesoappendix, taeniae coli",
        "zh": "横结肠系膜、阑尾系膜、结肠带"
      },
      "latin": "Mesocolon transversum · Mesoappendix · Taenia coli",
      "note": {
        "vi": "Mạc treo đại tràng ngang chia ổ bụng thành tầng trên và tầng dưới mạc treo. Ba dải cơ dọc hội tụ ở gốc ruột thừa, là mốc tìm ruột thừa khi mổ.",
        "en": "The transverse mesocolon divides the abdomen into supracolic and infracolic compartments. The three taeniae converge at the base of the appendix — the way to find it at surgery.",
        "zh": "横结肠系膜将腹腔分为结肠上区和结肠下区。三条结肠带汇聚于阑尾根部，是术中寻找阑尾的标志。"
      },
      "tint": "#f0e3b0",
      "parts": [
        "FJ2568",
        "FJ2569",
        "FJ2570",
        "FJ3397",
        "FJ3398"
      ]
    },
    {
      "key": "ruot",
      "name": {
        "vi": "Manh tràng, đại tràng, trực tràng (mốc)",
        "en": "Caecum, colon, rectum (landmarks)",
        "zh": "盲肠、结肠、直肠（标志）"
      },
      "latin": "Caecum · Colon · Rectum",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ2565",
        "FJ2566",
        "FJ2567",
        "FJ2571",
        "FJ2572"
      ]
    }
  ]
});
