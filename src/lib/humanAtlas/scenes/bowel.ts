
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Ruột non và ruột già" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có đại tràng xích-ma và manh tràng tách riêng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-bowel.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const bowelScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/bowel.ts#bowelScene", {
  "slug": "ruot-non-ruot-gia",
  "title": {
    "vi": "Ruột non và ruột già",
    "en": "Small and Large Intestine",
    "zh": "小肠与大肠"
  },
  "latin": "Intestinum tenue · Intestinum crassum",
  "intro": {
    "vi": "Ruột non (hỗng tràng + hồi tràng, dài 6–7m) treo trên mạc treo, là nơi hấp thu chính. Ruột già (khoảng 1,5m) khung quanh ruột non như chữ U ngược, hấp thu nước. Phân biệt ruột già nhờ ba dải cơ dọc, bướu đại tràng và bờm mỡ. Hỗng tràng và hồi tràng được tô ba sắc theo đoạn gần – giữa – xa. Bộ dữ liệu không có đại tràng xích-ma và manh tràng tách riêng.",
    "en": "The small intestine (jejunum + ileum, 6–7m) hangs on its mesentery and is the main site of absorption. The large intestine (about 1.5m) frames it like an inverted U and absorbs water. The large bowel is recognised by its three taeniae, haustra and fatty appendages. Jejunum and ileum are shaded by proximal, middle and distal segments. The dataset has no separate sigmoid colon or caecum.",
    "zh": "小肠（空肠+回肠，长6–7m）借肠系膜悬挂，是主要吸收部位。大肠（约1.5m）如倒U形框绕小肠，吸收水分。大肠借三条结肠带、结肠袋和肠脂垂辨认。空肠和回肠按近、中、远段分色。数据集中无单独的乙状结肠和盲肠。"
  },
  "groups": [
    {
      "key": "hong-gan",
      "name": {
        "vi": "Hỗng tràng đoạn gần",
        "en": "Proximal jejunum",
        "zh": "空肠近段"
      },
      "latin": "Jejunum, pars proximalis",
      "note": {
        "vi": "Bắt đầu ở góc tá-hỗng tràng (dây chằng Treitz) — mốc chia xuất huyết tiêu hoá trên và dưới. Thành dày, lòng rộng, nếp vòng cao.",
        "en": "Begins at the duodenojejunal flexure (ligament of Treitz) — the landmark dividing upper from lower GI bleeding. Thick wall, wide lumen, tall circular folds.",
        "zh": "起于十二指肠空肠曲（Treitz韧带）——划分上、下消化道出血的标志。肠壁厚、管腔宽、环形皱襞高。"
      },
      "tint": "#f0cf5a",
      "parts": [
        "FJ2606",
        "FJ2617",
        "FJ2622",
        "FJ2623",
        "FJ2624",
        "FJ2625",
        "FJ2626",
        "FJ2627"
      ]
    },
    {
      "key": "hong-giua-xa",
      "name": {
        "vi": "Hỗng tràng đoạn giữa và xa",
        "en": "Middle and distal jejunum",
        "zh": "空肠中远段"
      },
      "latin": "Jejunum, partes media et distalis",
      "note": {
        "vi": "Mạch thẳng dài, ít tầng cung mạch, ít mỡ mạc treo — mạc treo trông \"trong\" khi soi đèn. Nơi hấp thu phần lớn đường, đạm, béo.",
        "en": "Long straight vessels, few arcades, little mesenteric fat — the mesentery looks \"windowed\" against the light. Where most sugar, protein and fat are absorbed.",
        "zh": "直血管长、动脉弓层数少、系膜脂肪少——对光可见系膜“透亮区”。大部分糖、蛋白质、脂肪在此吸收。"
      },
      "tint": "#e8c53d",
      "parts": [
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
        "FJ2618",
        "FJ2619",
        "FJ2620",
        "FJ2621",
        "FJ2628"
      ]
    },
    {
      "key": "hoi-gan-giua",
      "name": {
        "vi": "Hồi tràng đoạn gần và giữa",
        "en": "Proximal and middle ileum",
        "zh": "回肠近中段"
      },
      "latin": "Ileum, partes proximalis et media",
      "note": {
        "vi": "Thành mỏng hơn, nhiều tầng cung mạch, mạc treo dày mỡ. Mảng Peyer (mô bạch huyết) tập trung dần về phía hồi tràng — nơi thương hàn gây loét thủng.",
        "en": "Thinner wall, many tiers of arcades, fatty mesentery. Peyer's patches (lymphoid tissue) increase toward the ileum — where typhoid ulcers perforate.",
        "zh": "肠壁较薄，动脉弓层数多，系膜脂肪厚。集合淋巴小结（Peyer斑）向回肠逐渐增多——伤寒溃疡穿孔好发于此。"
      },
      "tint": "#d9d27a",
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
        "FJ2596",
        "FJ2600",
        "FJ2601",
        "FJ2602",
        "FJ2603",
        "FJ2604",
        "FJ2605"
      ]
    },
    {
      "key": "hoi-xa",
      "name": {
        "vi": "Hồi tràng đoạn cuối và góc hồi-manh tràng",
        "en": "Terminal ileum and ileocaecal junction",
        "zh": "回肠末段与回盲部"
      },
      "latin": "Ileum terminale",
      "note": {
        "vi": "Hấp thu vitamin B12 và muối mật. Bệnh Crohn hay khu trú ở đây. Túi thừa Meckel nằm cách góc hồi-manh tràng khoảng 60cm. Van hồi-manh tràng ngăn phân trào ngược.",
        "en": "Absorbs vitamin B12 and bile salts. Crohn's disease favours this segment. Meckel's diverticulum lies about 60cm from the ileocaecal junction. The ileocaecal valve prevents reflux of stool.",
        "zh": "吸收维生素B12和胆盐。克罗恩病好发于此段。梅克尔憩室位于距回盲部约60cm处。回盲瓣防止粪便反流。"
      },
      "tint": "#b5c77a",
      "parts": [
        "FJ2587",
        "FJ2588",
        "FJ2589",
        "FJ2590",
        "FJ2591",
        "FJ2592",
        "FJ2593",
        "FJ2594",
        "FJ2595",
        "FJ2597",
        "FJ2598",
        "FJ2599"
      ]
    },
    {
      "key": "ruot-thua",
      "name": {
        "vi": "Ruột thừa và mạc treo",
        "en": "Appendix and mesoappendix",
        "zh": "阑尾与阑尾系膜"
      },
      "latin": "Appendix vermiformis",
      "note": {
        "vi": "Gốc ruột thừa cố định ở chỗ ba dải cơ dọc hội tụ, chiếu lên điểm McBurney (1/3 ngoài đường nối gai chậu trước trên – rốn); đầu ruột thừa thì di động, hay nằm sau manh tràng — nên đau có thể không điển hình.",
        "en": "The base of the appendix is fixed where the three taeniae meet, projecting to McBurney's point (one-third of the way from the anterior superior iliac spine to the umbilicus); its tip is mobile, often retrocaecal — so the pain can be atypical.",
        "zh": "阑尾根部固定于三条结肠带汇合处，体表投影为McBurney点（髂前上棘至脐连线的外1/3处）；尖端活动，常位于盲肠后——故疼痛可不典型。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2565",
        "FJ3397"
      ]
    },
    {
      "key": "dai-trang-len",
      "name": {
        "vi": "Đại tràng lên",
        "en": "Ascending colon",
        "zh": "升结肠"
      },
      "latin": "Colon ascendens",
      "note": {
        "vi": "Dính vào thành bụng sau (sau phúc mạc). Ung thư đại tràng phải hay chảy máu rỉ rả gây thiếu máu, ít gây tắc vì phân còn lỏng.",
        "en": "Fixed to the posterior abdominal wall (retroperitoneal). Right-sided colon cancer tends to ooze blood and cause anaemia rather than obstruction, because the stool is still liquid.",
        "zh": "固定于腹后壁（腹膜后位）。右半结肠癌多表现为慢性失血性贫血，较少梗阻，因此处粪便尚稀。"
      },
      "tint": "#a8764f",
      "parts": [
        "FJ2566"
      ]
    },
    {
      "key": "dai-trang-ngang",
      "name": {
        "vi": "Đại tràng ngang và mạc treo",
        "en": "Transverse colon and mesocolon",
        "zh": "横结肠及其系膜"
      },
      "latin": "Colon transversum",
      "note": {
        "vi": "Treo trên mạc treo đại tràng ngang nên rất di động, có thể võng xuống tới chậu hông. Mạc treo này chia ổ bụng thành tầng trên và dưới mạc treo.",
        "en": "Hangs on the transverse mesocolon, so it is very mobile and can sag down into the pelvis. This mesocolon divides the abdomen into supracolic and infracolic compartments.",
        "zh": "借横结肠系膜悬挂，活动度大，可下垂至盆腔。此系膜将腹腔分为结肠上区和结肠下区。"
      },
      "tint": "#8f6a4a",
      "parts": [
        "FJ2572",
        "FJ3398"
      ]
    },
    {
      "key": "dai-trang-xuong",
      "name": {
        "vi": "Đại tràng xuống",
        "en": "Descending colon",
        "zh": "降结肠"
      },
      "latin": "Colon descendens",
      "note": {
        "vi": "Sau phúc mạc, dọc sườn trái. Lòng hẹp hơn, phân đặc hơn — ung thư đại tràng trái hay gây tắc ruột và thay đổi thói quen đi ngoài.",
        "en": "Retroperitoneal, down the left flank. Its lumen is narrower and the stool firmer — left-sided colon cancer tends to cause obstruction and a change in bowel habit.",
        "zh": "腹膜后位，沿左侧腹下行。管腔较窄、粪便较干——左半结肠癌多引起肠梗阻和排便习惯改变。"
      },
      "tint": "#7a5a3d",
      "parts": [
        "FJ2567"
      ]
    },
    {
      "key": "truc-trang",
      "name": {
        "vi": "Trực tràng",
        "en": "Rectum",
        "zh": "直肠"
      },
      "latin": "Rectum",
      "note": {
        "vi": "Không có dải cơ dọc, bướu hay bờm mỡ — ba dải cơ loe ra thành lớp cơ dọc liên tục. Bóng trực tràng chứa phân, căng giãn gây cảm giác mót rặn.",
        "en": "Has no taeniae, haustra or fatty appendages — the taeniae spread into a continuous longitudinal muscle coat. The rectal ampulla stores stool, and its stretching gives the urge to defecate.",
        "zh": "无结肠带、结肠袋和肠脂垂——结肠带在此散开为连续的纵行肌层。直肠壶腹储存粪便，其扩张引起便意。"
      },
      "tint": "#5f3a30",
      "parts": [
        "FJ2571"
      ]
    },
    {
      "key": "dai-co-mac-treo",
      "name": {
        "vi": "Dải cơ dọc và mạc treo ruột non",
        "en": "Taeniae and small-bowel mesentery",
        "zh": "结肠带与小肠系膜"
      },
      "latin": "Taeniae coli · Mesenterium",
      "note": {
        "vi": "Ba dải cơ dọc (tự do, mạc nối, mạc treo) chạy dọc đại tràng. Rễ mạc treo ruột non chỉ dài 15cm chạy chéo từ góc tá-hỗng tràng tới hố chậu phải, nhưng bờ ruột dài 6m — nên mạc treo xếp nếp như quạt.",
        "en": "The three taeniae (libera, omentalis, mesocolica) run the length of the colon. The root of the small-bowel mesentery is only 15cm long, running obliquely from the duodenojejunal flexure to the right iliac fossa, yet its bowel edge is 6m — so the mesentery pleats like a fan.",
        "zh": "三条结肠带（独立带、网膜带、系膜带）沿结肠全长走行。小肠系膜根仅长15cm，自十二指肠空肠曲斜向右髂窝，而其肠缘长达6m——故系膜呈扇形折叠。"
      },
      "tint": "#e0c78c",
      "parts": [
        "FJ2568",
        "FJ2569",
        "FJ2570",
        "FJ3396"
      ]
    }
  ]
});
