/**
 * Scene "Thân tạng" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Cân ngực–thắt lưng" cũ: atlas không có cân ngực–thắt lưng, cơ vuông thắt lưng, cơ lưng rộng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const celiacScene: AtlasSceneDef = {
  "slug": "can-nguc-that-lung",
  "title": {
    "vi": "Thân tạng và các nhánh",
    "en": "The Coeliac Trunk and its Branches",
    "zh": "腹腔干及其分支"
  },
  "latin": "Truncus coeliacus",
  "system": "cardiovascular",
  "intro": {
    "vi": "Thân tạng là nhánh trước đầu tiên của động mạch chủ bụng, tách ngang T12 ngay dưới lỗ động mạch chủ của cơ hoành. Nó chỉ dài khoảng 1–2cm rồi chia ba: động mạch vị trái, lách và gan chung. Ba nhánh này nuôi toàn bộ ruột trước: thực quản bụng, dạ dày, tá tràng nửa trên, gan, túi mật, tuỵ và lách. Động mạch gan chung cho động mạch vị–tá tràng rồi thành động mạch gan riêng. Loét mặt sau hành tá tràng có thể ăn thủng động mạch vị–tá tràng gây xuất huyết tiêu hoá nặng. Mỗi nhánh một sắc đỏ; tạng mờ sẵn.",
    "en": "The coeliac trunk is the first anterior branch of the abdominal aorta, arising at T12 just below the aortic hiatus of the diaphragm. It runs only 1–2cm before dividing in three: the left gastric, splenic and common hepatic arteries. These supply the whole foregut: abdominal oesophagus, stomach, upper duodenum, liver, gallbladder, pancreas and spleen. The common hepatic gives the gastroduodenal artery and continues as the hepatic artery proper. A posterior duodenal ulcer can erode the gastroduodenal artery and cause major gastrointestinal bleeding. Each branch has its own shade of red; the organs are faded.",
    "zh": "腹腔干是腹主动脉的第一条前支，在T12平面膈主动脉裂孔稍下方发出，仅长1–2cm即分为三支：胃左动脉、脾动脉和肝总动脉，供应整个前肠：腹段食管、胃、十二指肠上半、肝、胆囊、胰和脾。肝总动脉发出胃十二指肠动脉后续为肝固有动脉。十二指肠球后壁溃疡可侵蚀胃十二指肠动脉，致大量消化道出血。每支一种红色调；脏器淡化。"
  },
  "frameGroups": [
    "than",
    "vi-trai",
    "lach",
    "gan"
  ],
  "fadedGroups": [
    "tang"
  ],
  "groups": [
    {
      "key": "than",
      "name": {
        "vi": "Động mạch chủ bụng và thân tạng",
        "en": "Abdominal aorta and coeliac trunk",
        "zh": "腹主动脉与腹腔干"
      },
      "latin": "Aorta abdominalis · Truncus coeliacus",
      "note": {
        "vi": "Dây chằng cung giữa của cơ hoành có thể đè vào gốc thân tạng, gây đau bụng sau ăn (hội chứng dây chằng cung giữa).",
        "en": "The median arcuate ligament of the diaphragm can compress the origin of the trunk and cause pain after eating (median arcuate ligament syndrome).",
        "zh": "膈正中弓状韧带可压迫腹腔干起始部，引起餐后腹痛（正中弓状韧带综合征）。"
      },
      "tint": "#8f2d2d",
      "parts": [
        "FJ1846",
        "FJ1932"
      ]
    },
    {
      "key": "vi-trai",
      "name": {
        "vi": "Động mạch vị (trái và phải)",
        "en": "Gastric arteries (left and right)",
        "zh": "胃左、右动脉"
      },
      "latin": "A. gastrica sinistra et dextra",
      "note": {
        "vi": "Động mạch vị trái đi dọc bờ cong nhỏ, cho nhánh thực quản. Nó nối với động mạch vị phải (từ động mạch gan) thành cung bờ cong nhỏ.",
        "en": "The left gastric runs along the lesser curvature and gives oesophageal branches. It joins the right gastric (from the hepatic) to form the lesser-curvature arcade.",
        "zh": "胃左动脉沿胃小弯走行并发出食管支，与胃右动脉（来自肝动脉）吻合成胃小弯动脉弓。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ3499",
        "FJ3594"
      ]
    },
    {
      "key": "lach",
      "name": {
        "vi": "Động mạch lách và nhánh tuỵ",
        "en": "Splenic artery and pancreatic branches",
        "zh": "脾动脉及胰支"
      },
      "latin": "A. splenica · Aa. pancreaticae · A. gastroomentalis sinistra",
      "note": {
        "vi": "Nhánh to nhất, chạy ngoằn ngoèo dọc bờ trên tuỵ, cho động mạch tuỵ lưng, tuỵ lớn, đuôi tuỵ và vị–mạc nối trái.",
        "en": "The largest branch, tortuous along the upper border of the pancreas, giving the dorsal, great and caudal pancreatic arteries and the left gastro-omental artery.",
        "zh": "最大分支，沿胰上缘迂曲走行，发出胰背动脉、胰大动脉、胰尾动脉和胃网膜左动脉。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2562",
        "FJ3419",
        "FJ3420",
        "FJ3430",
        "FJ3433",
        "FJ3444",
        "FJ3544",
        "FJ3640"
      ]
    },
    {
      "key": "gan",
      "name": {
        "vi": "Động mạch gan chung, gan riêng, vị–tá tràng",
        "en": "Common hepatic, hepatic proper and gastroduodenal arteries",
        "zh": "肝总动脉、肝固有动脉、胃十二指肠动脉"
      },
      "latin": "A. hepatica communis → A. hepatica propria · A. gastroduodenalis",
      "note": {
        "vi": "Động mạch gan riêng đi trong dây chằng gan–tá tràng cùng ống mật chủ và tĩnh mạch cửa. Kẹp dây chằng này (thủ thuật Pringle) cầm máu tạm khi mổ gan.",
        "en": "The hepatic artery proper runs in the hepatoduodenal ligament with the bile duct and portal vein; clamping the ligament (Pringle manoeuvre) controls bleeding during liver surgery.",
        "zh": "肝固有动脉与胆总管、门静脉同行于肝十二指肠韧带内；阻断该韧带（Pringle法）可在肝手术中暂时止血。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3078",
        "FJ3081",
        "FJ3401",
        "FJ3409",
        "FJ3432",
        "FJ3446",
        "FJ3501",
        "FJ3546",
        "FJ3557",
        "FJ3596"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch lách và vị",
        "en": "Splenic and gastric veins",
        "zh": "脾静脉与胃静脉"
      },
      "latin": "V. splenica · Vv. gastricae",
      "note": {
        "vi": "Tĩnh mạch lách hợp với tĩnh mạch mạc treo tràng trên sau cổ tuỵ thành tĩnh mạch cửa. Tĩnh mạch vị trái nối với tĩnh mạch thực quản; khi tăng áp cửa, chỗ nối này thành giãn tĩnh mạch thực quản.",
        "en": "The splenic vein joins the superior mesenteric behind the pancreatic neck to form the portal vein. The left gastric vein connects with oesophageal veins; in portal hypertension this becomes oesophageal varices.",
        "zh": "脾静脉在胰颈后方与肠系膜上静脉汇合成门静脉。胃左静脉与食管静脉相通，门静脉高压时形成食管静脉曲张。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3500",
        "FJ3502",
        "FJ3595",
        "FJ3597",
        "FJ3641"
      ]
    },
    {
      "key": "tang",
      "name": {
        "vi": "Dạ dày, lách, tuỵ, tá tràng (mốc)",
        "en": "Stomach, spleen, pancreas, duodenum (landmarks)",
        "zh": "胃、脾、胰、十二指肠（标志）"
      },
      "latin": "Gaster · Lien · Pancreas · Duodenum",
      "note": {
        "vi": "Mờ sẵn — vùng nuôi của ruột trước.",
        "en": "Faded — the foregut territory.",
        "zh": "淡化——前肠供血区。"
      },
      "parts": [
        "FJ1895",
        "FJ2561",
        "FJ2564",
        "FJ2573"
      ]
    }
  ]
};
