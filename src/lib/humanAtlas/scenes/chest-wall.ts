
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Thành ngực" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu mạc nội ngực và màng phổi thành.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const chestWallScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/chest-wall.ts#chestWallScene", {
  "slug": "thanh-nguc",
  "title": {
    "vi": "Thành ngực: xương sườn và cơ gian sườn",
    "en": "The Chest Wall: Ribs and Intercostal Muscles",
    "zh": "胸壁：肋与肋间肌"
  },
  "latin": "Paries thoracis",
  "intro": {
    "vi": "Thành ngực là khung xương–cơ có thể co giãn. Mỗi khoang gian sườn có ba lớp cơ. Gian sườn ngoài có thớ chạy xuống trước, nâng sườn khi hít vào. Gian sườn trong có thớ chạy xuống sau, hạ sườn khi thở ra gắng sức. Gian sườn trong cùng nằm sâu nhất. Bó mạch–thần kinh gian sườn chạy giữa lớp trong và trong cùng, trong rãnh ở bờ dưới xương sườn. Vì thế chọc dò màng phổi phải đi sát bờ trên xương sườn dưới. Xương sườn chia ba nhóm: thật (I–VII), giả (VIII–X), cụt (XI–XII). Mỗi lớp cơ một tông; mỗi nhóm sườn một sắc.",
    "en": "The chest wall is a flexible frame of bone and muscle. Each intercostal space has three muscle layers. External intercostals run down and forward and raise the ribs in inspiration. Internal intercostals run down and back and lower the ribs in forced expiration. The innermost intercostals lie deepest. The intercostal neurovascular bundle runs between the internal and innermost layers, in the groove on the lower border of each rib. So a chest drain or tap must pass just above the upper border of the rib below. The ribs form three groups: true (1–7), false (8–10) and floating (11–12). Each muscle layer has its own colour family, each rib group its own shade.",
    "zh": "胸壁是可伸缩的骨肌框架。每个肋间隙有三层肌：肋间外肌纤维向前下，吸气时提肋；肋间内肌纤维向后下，用力呼气时降肋；肋间最内肌居最深。肋间血管神经束行于肋间内肌与最内肌之间、肋骨下缘的肋沟内，故胸腔穿刺须紧贴下位肋骨上缘进针。肋分三组：真肋（1–7）、假肋（8–10）、浮肋（11–12）。每层肌一种色系，每组肋一种色调。"
  },
  "frameGroups": [
    "suon-that",
    "suon-gia",
    "gian-ngoai",
    "gian-trong"
  ],
  "groups": [
    {
      "key": "suon-that",
      "name": {
        "vi": "Sườn thật (I–VII), sụn sườn và xương ức",
        "en": "True ribs (1–7), costal cartilages and sternum",
        "zh": "真肋（1–7）、肋软骨与胸骨"
      },
      "latin": "Costae verae (I–VII) · Cartilagines costales · Sternum",
      "note": {
        "vi": "Mỗi sườn thật nối thẳng vào xương ức bằng sụn sườn riêng. Sụn sườn là sụn hyalin, làm lồng ngực đàn hồi; hồi sức tim phổi đè sâu 5–6cm được là nhờ nó.",
        "en": "Each true rib reaches the sternum by its own costal cartilage. The costal cartilages are hyaline and make the cage springy; they are what lets CPR compress the chest 5–6cm.",
        "zh": "每条真肋借各自的肋软骨直接连于胸骨。肋软骨为透明软骨，使胸廓富有弹性，心肺复苏按压5–6cm深度依赖于此。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3228",
        "FJ3229",
        "FJ3230",
        "FJ3231",
        "FJ3232",
        "FJ3233",
        "FJ3234",
        "FJ3334",
        "FJ3336",
        "FJ3338",
        "FJ3340",
        "FJ3342",
        "FJ3344",
        "FJ3346",
        "FJ3239",
        "FJ3242",
        "FJ3245",
        "FJ3248",
        "FJ3251",
        "FJ3254",
        "FJ3255",
        "FJ3333",
        "FJ3335",
        "FJ3337",
        "FJ3339",
        "FJ3341",
        "FJ3343",
        "FJ3345",
        "FJ3153",
        "FJ3178",
        "FJ3290"
      ]
    },
    {
      "key": "suon-gia",
      "name": {
        "vi": "Sườn giả (VIII–X) và sườn cụt (XI–XII)",
        "en": "False (8–10) and floating (11–12) ribs",
        "zh": "假肋（8–10）与浮肋（11–12）"
      },
      "latin": "Costae spuriae (VIII–X) · Costae fluctuantes (XI–XII)",
      "note": {
        "vi": "Sụn của sườn VIII–X nối vào sụn sườn trên nó, tạo bờ sườn. Sườn XI–XII đầu trước tự do trong cơ thành bụng.",
        "en": "The cartilages of ribs 8–10 join the cartilage above, forming the costal margin. Ribs 11–12 end freely in the abdominal wall muscles.",
        "zh": "第8–10肋软骨连于上位肋软骨，形成肋弓。第11–12肋前端游离于腹壁肌中。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3225",
        "FJ3226",
        "FJ3227",
        "FJ3235",
        "FJ3236",
        "FJ3330",
        "FJ3331",
        "FJ3332",
        "FJ3347",
        "FJ3348"
      ]
    },
    {
      "key": "gian-ngoai",
      "name": {
        "vi": "Cơ gian sườn ngoài",
        "en": "External intercostals",
        "zh": "肋间外肌"
      },
      "latin": "Mm. intercostales externi",
      "note": {
        "vi": "Phía trước, từ sụn sườn trở vào, cơ thay bằng màng gian sườn ngoài.",
        "en": "In front, from the costal cartilages inward, the muscle is replaced by the external intercostal membrane.",
        "zh": "前方自肋软骨向内，肌被肋间外膜取代。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1451",
        "FJ1451M"
      ]
    },
    {
      "key": "gian-trong",
      "name": {
        "vi": "Cơ gian sườn trong",
        "en": "Internal intercostals",
        "zh": "肋间内肌"
      },
      "latin": "Mm. intercostales interni",
      "note": {
        "vi": "Phía sau, từ góc sườn trở vào, cơ thay bằng màng gian sườn trong.",
        "en": "Behind, from the rib angles inward, the muscle is replaced by the internal intercostal membrane.",
        "zh": "后方自肋角向内，肌被肋间内膜取代。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1455",
        "FJ1455M"
      ]
    },
    {
      "key": "trong-cung",
      "name": {
        "vi": "Cơ gian sườn trong cùng và cơ ngang ngực",
        "en": "Innermost intercostals and transversus thoracis",
        "zh": "肋间最内肌与胸横肌"
      },
      "latin": "Mm. intercostales intimi · M. transversus thoracis",
      "note": {
        "vi": "Lớp sâu nhất, cùng hướng thớ với gian sườn trong. Cơ ngang ngực ở mặt sau xương ức.",
        "en": "The deepest layer, with fibres running like the internals. Transversus thoracis lies on the back of the sternum.",
        "zh": "最深层，纤维方向同肋间内肌。胸横肌位于胸骨后面。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1454",
        "FJ1454M",
        "FJ1461",
        "FJ1461M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch gian sườn sau và ngực trong",
        "en": "Posterior intercostal and internal thoracic arteries",
        "zh": "肋间后动脉与胸廓内动脉"
      },
      "latin": "Aa. intercostales posteriores · A. thoracica interna",
      "note": {
        "vi": "Động mạch gian sườn sau từ động mạch chủ ngực chạy ra trước, nối với nhánh gian sườn trước của động mạch ngực trong. Trong hẹp eo động mạch chủ, các vòng nối này to ra và gặm bờ dưới xương sườn, thấy được trên phim X quang.",
        "en": "The posterior intercostals from the thoracic aorta run forward to meet the anterior intercostal branches of the internal thoracic. In coarctation of the aorta these loops enlarge and notch the lower rib borders, visible on X-ray.",
        "zh": "肋间后动脉发自胸主动脉，向前与胸廓内动脉的肋间前支吻合。主动脉缩窄时这些吻合支扩张，侵蚀肋骨下缘，X线可见肋骨切迹。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1935",
        "FJ1937",
        "FJ1939",
        "FJ1950",
        "FJ1961",
        "FJ1967",
        "FJ1970",
        "FJ1972",
        "FJ1973",
        "FJ1974",
        "FJ1975",
        "FJ1977"
      ]
    }
  ]
});
