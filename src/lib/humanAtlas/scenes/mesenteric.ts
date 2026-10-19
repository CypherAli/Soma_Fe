
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Mạch mạc treo và ruột" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-mesenteric.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const mesentericScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/mesenteric.ts#mesentericScene", {
  "slug": "mach-mac-treo",
  "title": {
    "vi": "Mạch mạc treo và ruột",
    "en": "Mesenteric Vessels and the Bowel",
    "zh": "肠系膜血管与肠"
  },
  "latin": "Vasa mesenterica",
  "intro": {
    "vi": "Ruột được nuôi theo nguồn gốc phôi: động mạch mạc treo tràng TRÊN nuôi ruột giữa (tá tràng đoạn dưới → 2/3 phải đại tràng ngang), mạc treo tràng DƯỚI nuôi ruột sau (1/3 trái đại tràng ngang → trực tràng trên). Hai vùng nối nhau qua cung bờ (Drummond) — chỗ nối yếu nhất ở góc lách là nơi thiếu máu đại tràng hay xảy ra. Tĩnh mạch đi kèm mang máu về tĩnh mạch cửa. Đỏ đậm: vùng mạc treo tràng trên; đỏ cam: vùng mạc treo tràng dưới; tím: tĩnh mạch.",
    "en": "The bowel is supplied according to its embryonic origin: the SUPERIOR mesenteric artery feeds the midgut (lower duodenum → right two-thirds of the transverse colon), the INFERIOR mesenteric the hindgut (left third of the transverse colon → upper rectum). The two territories meet through the marginal artery (of Drummond) — its weakest link at the splenic flexure is where colonic ischaemia usually strikes. The accompanying veins carry blood to the portal vein. Deep red: superior mesenteric territory; orange-red: inferior mesenteric territory; violet: veins.",
    "zh": "肠道按胚胎来源供血：肠系膜上动脉供应中肠（十二指肠下段→横结肠右2/3），肠系膜下动脉供应后肠（横结肠左1/3→直肠上段）。两区借边缘动脉（Drummond动脉）相连——其在脾曲处最薄弱，是结肠缺血的好发部位。伴行静脉将血液送至门静脉。深红：肠系膜上动脉区；橙红：肠系膜下动脉区；紫色：静脉。"
  },
  "fadedGroups": [
    "ruot-non",
    "dai-trang"
  ],
  "groups": [
    {
      "key": "dm-mttt",
      "name": {
        "vi": "Động mạch mạc treo tràng trên",
        "en": "Superior mesenteric artery",
        "zh": "肠系膜上动脉"
      },
      "latin": "A. mesenterica superior",
      "note": {
        "vi": "Tách từ động mạch chủ ngang L1, chui dưới cổ tuỵ rồi bắt chéo trước đoạn ba tá tràng. Thân chính cho 15–20 nhánh hỗng-hồi tràng về bên trái. Tắc cấp (thường do cục máu từ tim) gây thiếu máu toàn bộ ruột non: đau bụng dữ dội mà bụng mềm.",
        "en": "Arises from the aorta at L1, passes under the neck of the pancreas and crosses in front of the third part of the duodenum. Its trunk gives 15–20 jejunal and ileal branches to the left. Acute occlusion (usually by an embolus from the heart) makes the whole small bowel ischaemic: severe pain with a soft abdomen.",
        "zh": "于L1平面发自主动脉，经胰颈后方下行并跨过十二指肠水平部前方。主干向左发出15–20条空、回肠动脉。急性闭塞（多为心源性栓子）导致全小肠缺血：腹痛剧烈而腹部柔软。"
      },
      "tint": "#b8434f",
      "parts": [
        "FJ1928",
        "FJ3437"
      ]
    },
    {
      "key": "nhanh-mttt",
      "name": {
        "vi": "Nhánh đại tràng của mạc treo tràng trên",
        "en": "Colic branches of the SMA",
        "zh": "肠系膜上动脉结肠支"
      },
      "latin": "Aa. ileocolica, colica dextra, colica media",
      "note": {
        "vi": "Động mạch hồi-đại tràng (cho nhánh manh tràng và động mạch ruột thừa), đại tràng phải và đại tràng giữa. Động mạch ruột thừa là động mạch tận — tắc do viêm là lý do ruột thừa viêm dễ hoại tử và thủng.",
        "en": "The ileocolic (with caecal branches and the appendicular artery), right colic and middle colic arteries. The appendicular artery is an end artery — its thrombosis in inflammation is why appendicitis gangrenes and perforates so readily.",
        "zh": "回结肠动脉（发出盲肠支和阑尾动脉）、右结肠动脉和中结肠动脉。阑尾动脉为终末动脉——炎症时血栓形成，故阑尾炎易坏疽穿孔。"
      },
      "tint": "#d0685a",
      "parts": [
        "FJ2034",
        "FJ3406",
        "FJ3410",
        "FJ3414",
        "FJ3439",
        "FJ3542",
        "FJ3553",
        "FJ3590"
      ]
    },
    {
      "key": "dm-mttd",
      "name": {
        "vi": "Mạc treo tràng dưới và nhánh",
        "en": "Inferior mesenteric artery and branches",
        "zh": "肠系膜下动脉及分支"
      },
      "latin": "A. mesenterica inferior",
      "note": {
        "vi": "Tách ngang L3, cho động mạch đại tràng trái, các động mạch xích-ma và tận hết bằng động mạch trực tràng trên. Khi mổ phình động mạch chủ bụng thường phải thắt nó — đại tràng trái sống nhờ cung bờ từ mạc treo tràng trên.",
        "en": "Arises at L3 and gives the left colic and sigmoid arteries, ending as the superior rectal artery. It is often ligated in abdominal aortic aneurysm repair — the left colon then survives on the marginal artery from the SMA.",
        "zh": "于L3平面发出，分出左结肠动脉和乙状结肠动脉，终支为直肠上动脉。腹主动脉瘤修补术中常需结扎——此时左半结肠依靠来自肠系膜上动脉的边缘动脉存活。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3442",
        "FJ3399",
        "FJ3428",
        "FJ3494",
        "FJ3638",
        "FJ3656"
      ]
    },
    {
      "key": "cung-bo",
      "name": {
        "vi": "Cung bờ đại tràng",
        "en": "Marginal artery of the colon",
        "zh": "结肠边缘动脉"
      },
      "latin": "A. marginalis coli (Drummond)",
      "note": {
        "vi": "Chuỗi động mạch nối liên tục dọc bờ trong đại tràng, nối hai vùng mạc treo tràng trên và dưới. Mạch thẳng từ cung đi vào thành ruột — thắt quá sát bờ ruột khi cắt đại tràng làm hoại tử miệng nối.",
        "en": "A continuous chain of anastomoses along the inner border of the colon, linking the superior and inferior mesenteric territories. Straight vessels run from it into the bowel wall — ligating too close to the bowel during colectomy starves the anastomosis.",
        "zh": "沿结肠内侧缘连续的动脉吻合链，连接肠系膜上、下动脉供血区。由此发出直血管进入肠壁——结肠切除时结扎过于靠近肠壁会导致吻合口缺血。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ3534"
      ]
    },
    {
      "key": "tm-mac-treo",
      "name": {
        "vi": "Tĩnh mạch mạc treo và tĩnh mạch cửa",
        "en": "Mesenteric veins and portal vein",
        "zh": "肠系膜静脉与门静脉"
      },
      "latin": "Vv. mesentericae",
      "note": {
        "vi": "Mỗi động mạch có tĩnh mạch cùng tên. Mạc treo tràng trên nằm BÊN PHẢI động mạch cùng tên, hợp với tĩnh mạch lách sau cổ tuỵ thành tĩnh mạch cửa; mạc treo tràng dưới thường đổ vào tĩnh mạch lách. Máu từ ruột mang chất hấp thu vào gan trước khi về tim.",
        "en": "Each artery has a vein of the same name. The superior mesenteric vein lies to the RIGHT of its artery and joins the splenic vein behind the neck of the pancreas to form the portal vein; the inferior mesenteric usually drains into the splenic vein. Blood from the bowel carries absorbed nutrients to the liver before returning to the heart.",
        "zh": "每条动脉均有同名静脉伴行。肠系膜上静脉位于同名动脉右侧，在胰颈后方与脾静脉汇合成门静脉；肠系膜下静脉通常汇入脾静脉。来自肠道的血液携带吸收的营养物质先入肝，再回心。"
      },
      "tint": "#7a6aa6",
      "parts": [
        "FJ1853",
        "FJ3400",
        "FJ3415",
        "FJ3429",
        "FJ3438",
        "FJ3440",
        "FJ3443",
        "FJ3495",
        "FJ3543",
        "FJ3591",
        "FJ3639",
        "FJ3641",
        "FJ3647",
        "FJ3657"
      ]
    },
    {
      "key": "dm-chu-bung",
      "name": {
        "vi": "Động mạch chủ bụng",
        "en": "Abdominal aorta",
        "zh": "腹主动脉"
      },
      "latin": "Aorta abdominalis",
      "note": {
        "vi": "Nguồn của cả hai động mạch mạc treo. Góc giữa động mạch chủ và mạc treo tràng trên kẹp đoạn ba tá tràng — góc hẹp (người sụt cân nhanh) gây tắc tá tràng (hội chứng động mạch mạc treo tràng trên).",
        "en": "The source of both mesenteric arteries. The angle between the aorta and SMA grips the third part of the duodenum — when it narrows (after rapid weight loss) the duodenum is obstructed (superior mesenteric artery syndrome).",
        "zh": "两条肠系膜动脉的发源处。主动脉与肠系膜上动脉之间的夹角夹持十二指肠水平部——夹角变窄（快速消瘦后）可致十二指肠梗阻（肠系膜上动脉综合征）。"
      },
      "tint": "#8f2f3a",
      "parts": [
        "FJ1932"
      ]
    },
    {
      "key": "ruot-non",
      "name": {
        "vi": "Hỗng tràng và hồi tràng",
        "en": "Jejunum and ileum",
        "zh": "空肠与回肠"
      },
      "latin": "Jejunum · Ileum",
      "note": {
        "vi": "Ruột non treo bằng mạc treo. Hỗng tràng (trên-trái) thành dày, cung mạch ít tầng, mạch thẳng dài; hồi tràng (dưới-phải) nhiều tầng cung, mạch thẳng ngắn — dấu hiệu phân biệt khi mổ. Để màu gốc làm nền.",
        "en": "The small bowel hangs on its mesentery. The jejunum (upper left) has a thick wall, few arcades and long straight vessels; the ileum (lower right) has many tiers of arcades and short straight vessels — the way to tell them apart at surgery. Shown in natural colour as background.",
        "zh": "小肠借肠系膜悬挂。空肠（左上）壁厚、动脉弓少、直血管长；回肠（右下）动脉弓层数多、直血管短——手术中据此鉴别。以原色作为背景。"
      },
      "parts": [
        "FJ2574",
        "FJ2575",
        "FJ2576",
        "FJ2577",
        "FJ2578",
        "FJ2579",
        "FJ2580",
        "FJ2581",
        "FJ2582",
        "FJ2583",
        "FJ2584",
        "FJ2585",
        "FJ2586",
        "FJ2587",
        "FJ2588",
        "FJ2589",
        "FJ2590",
        "FJ2591",
        "FJ2592",
        "FJ2593",
        "FJ2594",
        "FJ2595",
        "FJ2596",
        "FJ2597",
        "FJ2598",
        "FJ2599",
        "FJ2600",
        "FJ2601",
        "FJ2602",
        "FJ2603",
        "FJ2604",
        "FJ2605",
        "FJ2606",
        "FJ2607",
        "FJ2608",
        "FJ2609",
        "FJ2610",
        "FJ2611",
        "FJ2612",
        "FJ2613",
        "FJ2614",
        "FJ2615",
        "FJ2616",
        "FJ2617",
        "FJ2618",
        "FJ2619",
        "FJ2620",
        "FJ2621",
        "FJ2622",
        "FJ2623",
        "FJ2624",
        "FJ2625",
        "FJ2626",
        "FJ2627",
        "FJ2628",
        "FJ3396"
      ]
    },
    {
      "key": "dai-trang",
      "name": {
        "vi": "Đại tràng, ruột thừa và trực tràng",
        "en": "Colon, appendix and rectum",
        "zh": "结肠、阑尾与直肠"
      },
      "latin": "Colon · Rectum",
      "note": {
        "vi": "Đại tràng lên, ngang, xuống và trực tràng, cùng ruột thừa, dải cơ dọc (taenia) và mạc treo đại tràng ngang. Góc lách — ranh giới hai vùng mạc treo — là \"vùng đầu nguồn\" dễ thiếu máu. (Atlas không có đại tràng xích-ma riêng.)",
        "en": "The ascending, transverse and descending colon and rectum, with the appendix, taeniae and transverse mesocolon. The splenic flexure — the border between the two mesenteric territories — is a \"watershed\" prone to ischaemia. (The atlas has no separate sigmoid colon mesh.)",
        "zh": "升结肠、横结肠、降结肠和直肠，以及阑尾、结肠带和横结肠系膜。脾曲——两个肠系膜供血区的交界——是易缺血的“分水岭”。（图谱中无独立的乙状结肠网格。）"
      },
      "parts": [
        "FJ2565",
        "FJ2566",
        "FJ2567",
        "FJ2568",
        "FJ2569",
        "FJ2570",
        "FJ2571",
        "FJ2572",
        "FJ3397",
        "FJ3398"
      ]
    }
  ]
});
