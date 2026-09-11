/**
 * Scene "Tổng quan hệ tiêu hoá" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-digestive.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const digestiveScene: AtlasSceneDef = {
  "slug": "tong-quan-he-tieu-hoa",
  "title": {
    "vi": "Tổng quan hệ tiêu hoá",
    "en": "Overview of the Digestive System",
    "zh": "消化系统概览"
  },
  "latin": "Systema digestorium",
  "intro": {
    "vi": "Ống tiêu hoá từ miệng tới hậu môn dài khoảng 5–7m ở người sống (đo trên xác lên tới 8–9m vì mất trương lực cơ): thực quản → dạ dày → tá tràng → hỗng tràng → hồi tràng → đại tràng → trực tràng. Hai tuyến lớn đổ vào tá tràng: gan (qua đường mật) và tuỵ. Mỗi đoạn một màu theo chức năng: vùng tiêu hoá hoá học tông cam, vùng hấp thu tông vàng, vùng hấp thu nước và tạo phân tông nâu. Bộ dữ liệu không có hầu và đại tràng xích-ma tách riêng.",
    "en": "The gut runs about 8–9m from mouth to anus: oesophagus → stomach → duodenum → jejunum → ileum → colon → rectum. Two large glands drain into the duodenum: the liver (through the bile ducts) and the pancreas. Each segment is coloured by function: chemical digestion in oranges, absorption in yellows, water absorption and stool formation in browns. The dataset has no pharynx and no separate sigmoid colon.",
    "zh": "消化管自口至肛门长约8–9m：食管→胃→十二指肠→空肠→回肠→结肠→直肠。两大消化腺开口于十二指肠：肝（经胆道）和胰。各段按功能着色：化学消化为橙色系，吸收为黄色系，水分吸收与粪便形成为棕色系。数据集中无咽部，也无单独的乙状结肠。"
  },
  "groups": [
    {
      "key": "luoi-tuyen",
      "name": {
        "vi": "Lưỡi và tuyến nước bọt",
        "en": "Tongue and salivary glands",
        "zh": "舌与唾液腺"
      },
      "latin": "Lingua · Glandulae salivariae",
      "note": {
        "vi": "Tiêu hoá bắt đầu ở miệng: nhai, trộn với nước bọt chứa amylase. Atlas có tuyến dưới hàm và dưới lưỡi, không có tuyến mang tai.",
        "en": "Digestion starts in the mouth: chewing and mixing with saliva containing amylase. The atlas has the submandibular and sublingual glands, but no parotid.",
        "zh": "消化始于口腔：咀嚼并与含淀粉酶的唾液混合。图谱有下颌下腺和舌下腺，无腮腺。"
      },
      "tint": "#d98c8c",
      "parts": [
        "FJ2761",
        "FJ2765",
        "FJ2766",
        "FJ2767",
        "FJ2768"
      ]
    },
    {
      "key": "thuc-quan",
      "name": {
        "vi": "Thực quản",
        "en": "Oesophagus",
        "zh": "食管"
      },
      "latin": "Oesophagus",
      "note": {
        "vi": "Ống cơ dài 25cm, đẩy thức ăn bằng nhu động qua trung thất sau, xuyên cơ hoành ngang T10. Cơ thắt dưới yếu gây trào ngược dạ dày-thực quản.",
        "en": "A 25cm muscular tube pushing food by peristalsis through the posterior mediastinum and piercing the diaphragm at T10. A weak lower sphincter causes gastro-oesophageal reflux.",
        "zh": "长25cm的肌性管道，借蠕动经后纵隔输送食物，于T10平面穿膈。下括约肌松弛导致胃食管反流。"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ2563"
      ]
    },
    {
      "key": "da-day",
      "name": {
        "vi": "Dạ dày",
        "en": "Stomach",
        "zh": "胃"
      },
      "latin": "Gaster",
      "note": {
        "vi": "Chứa 1–1,5 lít, nhào trộn thức ăn với acid và pepsin thành dưỡng chấp. Tâm vị, đáy vị, thân vị, hang vị và môn vị; loét dạ dày hay ở bờ cong nhỏ.",
        "en": "Holds 1–1.5 litres and churns food with acid and pepsin into chyme. Cardia, fundus, body, antrum and pylorus; gastric ulcers favour the lesser curvature.",
        "zh": "容量1–1.5升，将食物与胃酸、胃蛋白酶搅拌成食糜。分贲门、胃底、胃体、胃窦和幽门；胃溃疡好发于胃小弯。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2564"
      ]
    },
    {
      "key": "ta-trang",
      "name": {
        "vi": "Tá tràng",
        "en": "Duodenum",
        "zh": "十二指肠"
      },
      "latin": "Duodenum",
      "note": {
        "vi": "Đoạn đầu ruột non hình chữ C ôm đầu tuỵ; mật và dịch tuỵ đổ vào ở bóng Vater đoạn hai. Loét tá tràng hay gặp hơn loét dạ dày, chủ yếu ở hành tá tràng.",
        "en": "The C-shaped first part of the small bowel wrapping the pancreatic head; bile and pancreatic juice enter at the ampulla of Vater in its second part. Duodenal ulcers are commoner than gastric ones, mostly in the duodenal cap.",
        "zh": "小肠起始段，呈C形环抱胰头；胆汁和胰液在降部的Vater壶腹流入。十二指肠溃疡比胃溃疡多见，主要位于球部。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ2573"
      ]
    },
    {
      "key": "gan-mat",
      "name": {
        "vi": "Gan và túi mật",
        "en": "Liver and gallbladder",
        "zh": "肝与胆囊"
      },
      "latin": "Hepar · Vesica biliaris",
      "note": {
        "vi": "Tuyến lớn nhất cơ thể (~1,5kg): tạo mật, chuyển hoá, dự trữ glycogen, khử độc. Túi mật cô đặc mật và tống xuống tá tràng khi ăn chất béo. Chi tiết phân thuỳ xem bài Giải phẫu Gan.",
        "en": "The largest gland in the body (~1.5kg): makes bile, handles metabolism, stores glycogen and detoxifies. The gallbladder concentrates bile and squeezes it into the duodenum after a fatty meal. See the Liver lesson for the segments.",
        "zh": "人体最大的腺体（约1.5kg）：分泌胆汁、参与代谢、储存糖原、解毒。胆囊浓缩胆汁，进食脂肪后将其排入十二指肠。肝段详见“肝脏解剖”一课。"
      },
      "tint": "#9a4e3e",
      "parts": [
        "FJ2816",
        "FJ2818",
        "FJ2819",
        "FJ2820",
        "FJ2821",
        "FJ2822",
        "FJ2823",
        "FJ2824",
        "FJ2817",
        "FJ3079",
        "FJ3080"
      ]
    },
    {
      "key": "tuy",
      "name": {
        "vi": "Tuỵ",
        "en": "Pancreas",
        "zh": "胰"
      },
      "latin": "Pancreas",
      "note": {
        "vi": "Tiết khoảng 1,5 lít dịch tuỵ mỗi ngày chứa men tiêu hoá cả ba nhóm chất (đạm, béo, đường) và bicarbonat trung hoà acid dạ dày; đảo tuỵ tiết insulin.",
        "en": "Secretes about 1.5 litres of pancreatic juice a day, with enzymes for all three nutrient groups (protein, fat, carbohydrate) and bicarbonate to neutralise stomach acid; its islets secrete insulin.",
        "zh": "每天分泌约1.5升胰液，含消化三大营养素（蛋白质、脂肪、糖类）的酶及中和胃酸的碳酸氢盐；胰岛分泌胰岛素。"
      },
      "tint": "#e0b36a",
      "parts": [
        "FJ2629",
        "FJ2630"
      ]
    },
    {
      "key": "hong-trang",
      "name": {
        "vi": "Hỗng tràng",
        "en": "Jejunum",
        "zh": "空肠"
      },
      "latin": "Jejunum",
      "note": {
        "vi": "2/5 đầu của ruột non sau tá tràng, nằm trên-trái ổ bụng. Nếp niêm mạc cao và dày — nơi hấp thu phần lớn chất dinh dưỡng.",
        "en": "The first two-fifths of the small bowel after the duodenum, in the upper left abdomen. Its mucosal folds are tall and dense — where most nutrients are absorbed.",
        "zh": "十二指肠之后小肠的前2/5，位于腹腔左上部。黏膜皱襞高而密——大部分营养物质在此吸收。"
      },
      "tint": "#e8c53d",
      "parts": [
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
        "FJ2628"
      ]
    },
    {
      "key": "hoi-trang",
      "name": {
        "vi": "Hồi tràng",
        "en": "Ileum",
        "zh": "回肠"
      },
      "latin": "Ileum",
      "note": {
        "vi": "3/5 cuối ruột non, dưới-phải ổ bụng, đổ vào manh tràng qua van hồi-manh tràng. Đoạn cuối hồi tràng hấp thu vitamin B12 và muối mật — cắt đoạn này gây thiếu máu hồng cầu to.",
        "en": "The last three-fifths of the small bowel, lower right abdomen, entering the caecum through the ileocaecal valve. The terminal ileum absorbs vitamin B12 and bile salts — removing it causes megaloblastic anaemia.",
        "zh": "小肠的后3/5，位于腹腔右下部，经回盲瓣入盲肠。回肠末段吸收维生素B12和胆盐——切除后可致巨幼细胞贫血。"
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
        "FJ2605"
      ]
    },
    {
      "key": "dai-trang",
      "name": {
        "vi": "Đại tràng và ruột thừa",
        "en": "Colon and appendix",
        "zh": "结肠与阑尾"
      },
      "latin": "Colon",
      "note": {
        "vi": "Đại tràng lên, ngang, xuống hấp thu nước và điện giải, tạo khuôn phân. Ba dải cơ dọc (taenia) hội tụ ở gốc ruột thừa — mốc tìm ruột thừa khi mổ.",
        "en": "The ascending, transverse and descending colon absorb water and electrolytes and shape the stool. The three taeniae converge at the base of the appendix — the landmark for finding it at surgery.",
        "zh": "升结肠、横结肠、降结肠吸收水分和电解质并形成粪便。三条结肠带汇聚于阑尾根部——术中寻找阑尾的标志。"
      },
      "tint": "#a8764f",
      "parts": [
        "FJ2565",
        "FJ2566",
        "FJ2567",
        "FJ2568",
        "FJ2569",
        "FJ2570",
        "FJ2572",
        "FJ3398"
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
        "vi": "Đoạn cuối chứa phân trước khi tống ra ngoài. Nằm sát mặt trước xương cùng; thăm trực tràng sờ được tiền liệt tuyến ở nam.",
        "en": "The final segment, storing stool before defecation. It lies against the front of the sacrum; a rectal examination can feel the prostate in men.",
        "zh": "末段，排便前储存粪便。紧贴骶骨前面；男性直肠指检可触及前列腺。"
      },
      "tint": "#7a4a3d",
      "parts": [
        "FJ2571"
      ]
    }
  ]
};
