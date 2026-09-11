/**
 * Scene "Vòng mạch tuỵ–tá tràng" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Hệ mạc" cũ: atlas không có mạc nông, mạc sâu.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-f.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const pancreaticoduodenalScene: AtlasSceneDef = {
  "slug": "he-mac",
  "title": {
    "vi": "Tuỵ, tá tràng và vòng mạch tuỵ–tá tràng",
    "en": "Pancreas, Duodenum and the Pancreaticoduodenal Arcades",
    "zh": "胰、十二指肠与胰十二指肠动脉弓"
  },
  "latin": "Arcus pancreaticoduodenales",
  "system": "cardiovascular",
  "intro": {
    "vi": "Đầu tuỵ nằm trong khung chữ C của tá tràng, và hai cơ quan dùng chung một hệ mạch. Động mạch tuỵ–tá tràng trên (trước, sau) tách từ động mạch vị–tá tràng, thuộc thân tạng. Động mạch tuỵ–tá tràng dưới (trước, sau) tách từ động mạch mạc treo tràng trên. Chúng nối nhau thành hai vòng trước và sau đầu tuỵ, là cầu nối giữa hệ thân tạng và hệ mạc treo tràng trên. Vì dùng chung mạch, mổ cắt khối tá tuỵ (Whipple) phải lấy cả đầu tuỵ và tá tràng. Thân, đuôi tuỵ được nuôi bởi các nhánh từ động mạch lách. Mạch đỏ–xanh; tuỵ, tá tràng mờ sẵn.",
    "en": "The head of the pancreas sits in the C-loop of the duodenum, and the two organs share one blood supply. The superior pancreaticoduodenal arteries (anterior, posterior) come from the gastroduodenal, a coeliac branch. The inferior pancreaticoduodenal arteries (anterior, posterior) come from the superior mesenteric. They join in anterior and posterior arcades round the pancreatic head, a bridge between the coeliac and superior mesenteric systems. Because the supply is shared, a Whipple resection removes the pancreatic head and duodenum together. The body and tail of the pancreas are fed by branches of the splenic artery. Vessels red and blue; pancreas and duodenum faded.",
    "zh": "胰头位于十二指肠C形弯内，二者共用一套血供。胰十二指肠上动脉（前、后）发自胃十二指肠动脉（属腹腔干）；胰十二指肠下动脉（前、后）发自肠系膜上动脉。它们在胰头前后吻合成前、后两弓，连接腹腔干系与肠系膜上动脉系。由于共用血供，胰十二指肠切除术（Whipple术）须同时切除胰头和十二指肠。胰体、胰尾由脾动脉分支供血。血管红蓝；胰和十二指肠淡化。"
  },
  "frameGroups": [
    "tren",
    "duoi",
    "than-duoi",
    "tm"
  ],
  "fadedGroups": [
    "tang"
  ],
  "groups": [
    {
      "key": "tren",
      "name": {
        "vi": "Nguồn trên: vị–tá tràng, tuỵ–tá tràng trên",
        "en": "From above: gastroduodenal and superior pancreaticoduodenal",
        "zh": "上方来源：胃十二指肠动脉、胰十二指肠上动脉"
      },
      "latin": "A. gastroduodenalis · Aa. pancreaticoduodenales superiores",
      "note": {
        "vi": "Động mạch vị–tá tràng đi sau hành tá tràng. Loét mặt sau hành tá tràng có thể ăn thủng nó, gây chảy máu ồ ạt.",
        "en": "The gastroduodenal runs behind the duodenal bulb; a posterior ulcer can erode it and bleed massively.",
        "zh": "胃十二指肠动脉行于十二指肠球后方，后壁溃疡可侵蚀之致大出血。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ3078",
        "FJ3409",
        "FJ3432",
        "FJ3557"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Nguồn dưới: mạc treo tràng trên, tuỵ–tá tràng dưới",
        "en": "From below: superior mesenteric and inferior pancreaticoduodenal",
        "zh": "下方来源：肠系膜上动脉、胰十二指肠下动脉"
      },
      "latin": "A. mesenterica superior · Aa. pancreaticoduodenales inferiores",
      "note": {
        "vi": "Khi thân tạng hẹp, máu chảy ngược qua vòng này từ mạc treo tràng trên lên nuôi gan, lách. Vòng khi đó giãn to và có thể thành phình mạch.",
        "en": "When the coeliac trunk is narrowed, blood flows backwards through these arcades from the superior mesenteric to feed liver and spleen; they enlarge and can become aneurysmal.",
        "zh": "腹腔干狭窄时，血液经此弓由肠系膜上动脉逆流供应肝脾，吻合弓扩张，甚至形成动脉瘤。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1928",
        "FJ3401",
        "FJ3446",
        "FJ3546"
      ]
    },
    {
      "key": "than-duoi",
      "name": {
        "vi": "Nhánh nuôi thân và đuôi tuỵ",
        "en": "Branches to the body and tail",
        "zh": "胰体尾分支"
      },
      "latin": "Aa. pancreatica dorsalis, magna, caudae, inferior",
      "note": {
        "vi": "Động mạch tuỵ lưng, tuỵ lớn và đuôi tuỵ tách từ động mạch lách; động mạch tuỵ dưới chạy dọc bờ dưới tuỵ.",
        "en": "The dorsal, great and caudal pancreatic arteries arise from the splenic; the inferior pancreatic runs along the lower border.",
        "zh": "胰背动脉、胰大动脉和胰尾动脉发自脾动脉；胰下动脉沿胰下缘走行。"
      },
      "tint": "#e39a7a",
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
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch tuỵ–tá tràng và tĩnh mạch cửa",
        "en": "Pancreaticoduodenal veins and portal vein",
        "zh": "胰十二指肠静脉与门静脉"
      },
      "latin": "Vv. pancreaticoduodenales · V. portae hepatis",
      "note": {
        "vi": "Tĩnh mạch cửa hình thành sau cổ tuỵ. U đầu tuỵ xâm lấn tĩnh mạch này là yếu tố quyết định có mổ được hay không.",
        "en": "The portal vein forms behind the pancreatic neck; invasion of it by a head tumour is a key factor in whether the tumour is resectable.",
        "zh": "门静脉在胰颈后方形成；胰头肿瘤是否侵犯门静脉是决定能否切除的关键。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ1853",
        "FJ3545",
        "FJ3641",
        "FJ3646",
        "FJ3655"
      ]
    },
    {
      "key": "ong",
      "name": {
        "vi": "Ống tuỵ",
        "en": "Pancreatic duct",
        "zh": "胰管"
      },
      "latin": "Ductus pancreaticus",
      "note": {
        "vi": "Ống tuỵ chính hợp với ống mật chủ đổ vào nhú tá lớn. Sỏi kẹt ở chỗ này gây viêm tuỵ cấp do sỏi mật.",
        "en": "The main pancreatic duct joins the bile duct at the major duodenal papilla; a stone lodged there causes gallstone pancreatitis.",
        "zh": "主胰管与胆总管汇合开口于十二指肠大乳头；结石嵌顿于此致胆源性胰腺炎。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1896",
        "FJ2630"
      ]
    },
    {
      "key": "tang",
      "name": {
        "vi": "Tuỵ và tá tràng (mốc)",
        "en": "Pancreas and duodenum (landmarks)",
        "zh": "胰与十二指肠（标志）"
      },
      "latin": "Pancreas · Duodenum",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ1895",
        "FJ2573"
      ]
    }
  ]
};
