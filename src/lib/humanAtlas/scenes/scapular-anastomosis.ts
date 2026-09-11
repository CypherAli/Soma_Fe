/**
 * Scene "Vòng nối động mạch quanh vai" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Khớp vai–khuỷu" cũ: atlas không có dây chằng/bao khớp nên bài khớp không dựng chuẩn được.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const scapularAnastomosisScene: AtlasSceneDef = {
  "slug": "khop-vai-khuyu",
  "title": {
    "vi": "Động mạch nách và vòng nối quanh vai",
    "en": "Axillary Artery and the Scapular Anastomosis",
    "zh": "腋动脉与肩胛动脉网"
  },
  "latin": "A. axillaris · Rete scapulare",
  "system": "cardiovascular",
  "intro": {
    "vi": "Động mạch nách đi từ bờ ngoài xương sườn I tới bờ dưới cơ tròn lớn. Cơ ngực bé chia nó làm ba đoạn, mỗi đoạn cho nhánh riêng. Các nhánh này nối với nhánh của động mạch dưới đòn quanh xương vai, gọi là vòng nối quanh vai. Vì thế thắt động mạch nách phía trên nhánh dưới vai thì cánh tay vẫn được nuôi. Mỗi hệ nhánh một sắc đỏ riêng; tĩnh mạch đi kèm màu xanh; xương và cơ mờ sẵn.",
    "en": "The axillary artery runs from the outer border of the first rib to the lower border of teres major. Pectoralis minor divides it into three parts, each with its own branches. These branches join branches of the subclavian artery around the scapula, forming the scapular anastomosis. That is why tying the axillary artery above the subscapular branch still leaves the arm supplied. Each branch system has its own shade of red; companion veins are blue; bones and muscles are faded.",
    "zh": "腋动脉自第1肋外缘至大圆肌下缘，被胸小肌分为三段，各段发出不同分支。这些分支在肩胛骨周围与锁骨下动脉的分支吻合，形成肩胛动脉网，故在肩胛下动脉起点以上结扎腋动脉，上肢仍有血供。每组分支一种红色调，伴行静脉蓝色，骨骼和肌肉淡化。"
  },
  "frameGroups": [
    "nach",
    "duoi-vai",
    "mu-canh-tay",
    "cung-vai",
    "tm"
  ],
  "fadedGroups": [
    "xuong",
    "co"
  ],
  "groups": [
    {
      "key": "nach",
      "name": {
        "vi": "Động mạch dưới đòn và động mạch nách",
        "en": "Subclavian and axillary arteries",
        "zh": "锁骨下动脉与腋动脉"
      },
      "latin": "A. subclavia · A. axillaris",
      "note": {
        "vi": "Cùng một thân mạch đổi tên theo mốc: dưới đòn tới bờ ngoài xương sườn I, nách tới bờ dưới cơ tròn lớn, rồi thành động mạch cánh tay.",
        "en": "One continuous trunk renamed at landmarks: subclavian to the outer border of rib 1, axillary to the lower border of teres major, then brachial.",
        "zh": "同一动脉干按标志更名：至第1肋外缘为锁骨下动脉，至大圆肌下缘为腋动脉，其后为肱动脉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2216",
        "FJ3479"
      ]
    },
    {
      "key": "cung-vai",
      "name": {
        "vi": "Nhánh ngực–cùng vai, trên vai, vai sau",
        "en": "Thoraco-acromial, suprascapular and dorsal scapular arteries",
        "zh": "胸肩峰动脉、肩胛上动脉、肩胛背动脉"
      },
      "latin": "A. thoracoacromialis · A. suprascapularis · A. dorsalis scapulae",
      "note": {
        "vi": "Thân ngực–cùng vai (đoạn 2 động mạch nách) chia nhánh cùng vai, delta, ngực. Hai nhánh trên vai và vai sau đến từ động mạch dưới đòn, xuống hố trên gai, dưới gai và bờ trong xương vai. Đó là phía trên của vòng nối.",
        "en": "The thoraco-acromial trunk (second part of the axillary) splits into acromial, deltoid and pectoral branches. The suprascapular and dorsal scapular arteries come from the subclavian and descend to the supraspinous and infraspinous fossae and the medial border of the scapula — the upper limb of the anastomosis.",
        "zh": "胸肩峰动脉干（腋动脉第二段）分为肩峰支、三角肌支和胸肌支。肩胛上动脉和肩胛背动脉来自锁骨下动脉，下行至冈上窝、冈下窝和肩胛骨内侧缘，构成动脉网的上部。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2211",
        "FJ2230",
        "FJ2232",
        "FJ2251",
        "FJ2252",
        "FJ2330"
      ]
    },
    {
      "key": "duoi-vai",
      "name": {
        "vi": "Động mạch dưới vai và hai nhánh tận",
        "en": "Subscapular artery and its two terminal branches",
        "zh": "肩胛下动脉及其两终支"
      },
      "latin": "A. subscapularis · A. circumflexa scapulae · A. thoracodorsalis",
      "note": {
        "vi": "Nhánh lớn nhất của động mạch nách (đoạn 3). Nó chia thành động mạch mũ vai, vòng ra hố dưới gai, và động mạch ngực–lưng, đi xuống cùng dây ngực–lưng. Đây là phía dưới của vòng nối.",
        "en": "The largest branch of the axillary artery (third part). It splits into the circumflex scapular artery, which winds round to the infraspinous fossa, and the thoracodorsal artery, which descends with the thoracodorsal nerve — the lower limb of the anastomosis.",
        "zh": "腋动脉最大分支（第三段）。分为旋肩胛动脉（绕至冈下窝）和胸背动脉（伴胸背神经下行），构成动脉网的下部。"
      },
      "tint": "#b03a48",
      "parts": [
        "FJ1976",
        "FJ2221",
        "FJ2246",
        "FJ2253"
      ]
    },
    {
      "key": "mu-canh-tay",
      "name": {
        "vi": "Động mạch mũ cánh tay trước và sau",
        "en": "Anterior and posterior circumflex humeral arteries",
        "zh": "旋肱前、后动脉"
      },
      "latin": "Aa. circumflexae humeri anterior et posterior",
      "note": {
        "vi": "Vòng quanh cổ phẫu thuật xương cánh tay. Động mạch mũ sau đi cùng dây nách qua lỗ tứ giác, nên gãy cổ phẫu thuật có thể tổn thương cả hai.",
        "en": "Encircle the surgical neck of the humerus. The posterior one passes with the axillary nerve through the quadrangular space, so a surgical-neck fracture can injure both.",
        "zh": "环绕肱骨外科颈。旋肱后动脉与腋神经同穿四边孔，故外科颈骨折可同时损伤二者。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ2212",
        "FJ2239",
        "FJ2240"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch nách và tĩnh mạch đi kèm",
        "en": "Axillary vein and companion veins",
        "zh": "腋静脉及伴行静脉"
      },
      "latin": "V. axillaris et venae comitantes",
      "note": {
        "vi": "Tĩnh mạch nách nằm trong động mạch; các nhánh cùng tên đi kèm nhánh động mạch.",
        "en": "The axillary vein lies medial to the artery; tributaries of the same names accompany the arterial branches.",
        "zh": "腋静脉位于动脉内侧；同名属支伴行各动脉分支。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2213",
        "FJ2217",
        "FJ2222",
        "FJ2233",
        "FJ2247",
        "FJ2250",
        "FJ2254"
      ]
    },
    {
      "key": "co",
      "name": {
        "vi": "Cơ ngực bé, tròn lớn, dưới vai (mốc)",
        "en": "Pectoralis minor, teres major, subscapularis (landmarks)",
        "zh": "胸小肌、大圆肌、肩胛下肌（标志）"
      },
      "latin": "Mm. pectoralis minor, teres major, subscapularis",
      "note": {
        "vi": "Cơ ngực bé là mốc chia ba đoạn động mạch nách; cơ tròn lớn là mốc kết thúc nó.",
        "en": "Pectoralis minor marks the three parts of the axillary artery; teres major marks its end.",
        "zh": "胸小肌为腋动脉分段标志；大圆肌为其终点标志。"
      },
      "tint": "#c9a79e",
      "parts": [
        "FJ1456M",
        "FJ1504M",
        "FJ1507M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương vai, đòn, cánh tay (mốc)",
        "en": "Scapula, clavicle, humerus (landmarks)",
        "zh": "肩胛骨、锁骨、肱骨（标志）"
      },
      "latin": "Scapula · Clavicula · Humerus",
      "note": {
        "vi": "Mờ sẵn để vòng nối quanh xương vai hiện rõ.",
        "en": "Faded so the loop around the scapula stands out.",
        "zh": "淡化，使肩胛骨周围的吻合环清晰可见。"
      },
      "parts": [
        "FJ3237",
        "FJ3262",
        "FJ3279"
      ]
    }
  ]
};
