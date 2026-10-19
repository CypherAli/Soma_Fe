
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Đai vai" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu cơ lưng rộng, dây chằng quạ–đòn và bao khớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const shoulderGirdleScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/shoulder-girdle.ts#shoulderGirdleScene", {
  "slug": "giai-phau-dai-vai",
  "title": {
    "vi": "Đai vai và cơ vận động xương vai",
    "en": "The Shoulder Girdle",
    "zh": "肩带"
  },
  "latin": "Cingulum pectorale",
  "intro": {
    "vi": "Đai vai gồm xương đòn và xương vai. Nó chỉ nối với thân mình qua một khớp nhỏ là khớp ức–đòn, còn lại được treo bằng cơ. Nhờ vậy xương vai trượt tự do trên lồng ngực và cánh tay giơ được quá đầu. Scene chia các cơ theo hướng kéo xương vai: nâng (thang trên, nâng vai), kéo vào trong (thang giữa, trám), kéo ra trước (răng trước, ngực bé) và cơ delta phủ ngoài. Bộ dữ liệu không có cơ lưng rộng và dây chằng quạ–đòn.",
    "en": "The shoulder girdle is the clavicle and scapula. It joins the trunk at only one small joint, the sternoclavicular joint; the rest is slung by muscles. This lets the scapula glide freely over the rib cage so the arm can be raised overhead. The scene groups the muscles by how they pull the scapula: elevators (upper trapezius, levator scapulae), retractors (middle trapezius, rhomboids), protractors (serratus anterior, pectoralis minor), with deltoid covering the outside. The dataset has no latissimus dorsi or coracoclavicular ligament.",
    "zh": "肩带由锁骨和肩胛骨组成，仅借胸锁关节一个小关节连于躯干，其余靠肌肉悬吊，使肩胛骨在胸廓上自由滑动，手臂得以举过头顶。本场景按牵拉肩胛骨的方向分组：上提（斜方肌上部、肩胛提肌）、后缩（斜方肌中部、菱形肌）、前伸（前锯肌、胸小肌），外覆三角肌。数据集中无背阔肌和喙锁韧带。"
  },
  "fadedGroups": [
    "xuong-canh-tay"
  ],
  "groups": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương đòn và xương vai",
        "en": "Clavicle and scapula",
        "zh": "锁骨与肩胛骨"
      },
      "latin": "Clavicula · Scapula",
      "note": {
        "vi": "Xương đòn là thanh chống giữ vai cách xa lồng ngực. Nó gãy nhiều nhất ở chỗ nối 1/3 giữa và 1/3 ngoài. Xương vai có gai vai, mỏm cùng vai, mỏm quạ và ổ chảo nông.",
        "en": "The clavicle is a strut holding the shoulder away from the chest. It fractures most often at the junction of its middle and lateral thirds. The scapula carries the spine, acromion, coracoid process and a shallow glenoid cavity.",
        "zh": "锁骨是使肩部远离胸廓的支撑杆，最常在中外1/3交界处骨折。肩胛骨有肩胛冈、肩峰、喙突和浅的关节盂。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3237",
        "FJ3279"
      ]
    },
    {
      "key": "nang",
      "name": {
        "vi": "Nhóm nâng và kéo vào trong: cơ thang, nâng vai",
        "en": "Elevators and retractors: trapezius, levator scapulae",
        "zh": "上提与后缩肌：斜方肌、肩胛提肌"
      },
      "latin": "M. trapezius · M. levator scapulae",
      "note": {
        "vi": "Cơ thang có ba phần: phần xuống nâng vai, phần ngang kéo vai vào trong, phần lên hạ vai. Phần xuống và phần lên cùng xoay xương vai để ổ chảo hướng lên khi giơ tay quá 90°. Cơ nâng vai nâng góc trên xương vai.",
        "en": "Trapezius has three parts: descending elevates, transverse retracts, ascending depresses. Descending and ascending parts together rotate the scapula so the glenoid faces upward when the arm rises above 90°. Levator scapulae raises the superior angle.",
        "zh": "斜方肌分三部：降部上提、横部后缩、升部下降肩胛。上下两部共同使肩胛骨旋转，举臂超过90°时关节盂朝上。肩胛提肌上提肩胛骨上角。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1520M",
        "FJ1521M",
        "FJ1532M",
        "FJ1554M"
      ]
    },
    {
      "key": "tram",
      "name": {
        "vi": "Cơ trám lớn và trám bé",
        "en": "Rhomboid major and minor",
        "zh": "大、小菱形肌"
      },
      "latin": "Mm. rhomboidei",
      "note": {
        "vi": "Nối gai đốt sống C7–T5 với bờ trong xương vai. Kéo xương vai vào trong và xoay ổ chảo xuống, đối lực với cơ răng trước.",
        "en": "Link the spines of C7–T5 to the medial border of the scapula. They retract the scapula and rotate the glenoid downward, opposing serratus anterior.",
        "zh": "连接C7–T5棘突与肩胛骨内侧缘。使肩胛骨后缩并使关节盂下旋，与前锯肌相拮抗。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1536M",
        "FJ1537M"
      ]
    },
    {
      "key": "rang-truoc",
      "name": {
        "vi": "Nhóm kéo ra trước: răng trước, ngực bé, dưới đòn",
        "en": "Protractors: serratus anterior, pectoralis minor, subclavius",
        "zh": "前伸肌：前锯肌、胸小肌、锁骨下肌"
      },
      "latin": "M. serratus anterior · M. pectoralis minor · M. subclavius",
      "note": {
        "vi": "Cơ răng trước ép xương vai sát lồng ngực và kéo nó ra trước, như khi đấm. Liệt dây ngực dài làm xương vai vểnh lên như cánh chim. Cơ ngực bé kéo mỏm quạ xuống trước; cơ dưới đòn giữ xương đòn.",
        "en": "Serratus anterior holds the scapula against the chest wall and draws it forward, as in punching. Long thoracic nerve palsy makes the scapula stick out like a wing. Pectoralis minor pulls the coracoid down and forward; subclavius steadies the clavicle.",
        "zh": "前锯肌使肩胛骨紧贴胸壁并前拉（如出拳）。胸长神经麻痹致翼状肩胛。胸小肌将喙突拉向前下；锁骨下肌稳定锁骨。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1456M",
        "FJ1459M",
        "FJ1460M"
      ]
    },
    {
      "key": "delta",
      "name": {
        "vi": "Cơ delta (ba phần)",
        "en": "Deltoid (three parts)",
        "zh": "三角肌（三部）"
      },
      "latin": "M. deltoideus",
      "note": {
        "vi": "Phủ ngoài khớp vai, tạo đường cong của vai. Phần đòn gấp vai, phần cùng vai dạng vai từ 15° tới 90°, phần gai duỗi vai. Dây nách chi phối — dễ tổn thương khi trật khớp vai.",
        "en": "Covers the shoulder joint and gives the shoulder its contour. The clavicular part flexes, the acromial part abducts from about 15° to 90°, the spinal part extends. Supplied by the axillary nerve — at risk in shoulder dislocation.",
        "zh": "覆盖肩关节，形成肩部轮廓。锁骨部屈肩，肩峰部使肩外展约15°至90°，肩胛冈部伸肩。受腋神经支配——肩关节脱位时易受损。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1467M",
        "FJ1468M",
        "FJ1513M"
      ]
    },
    {
      "key": "xuong-canh-tay",
      "name": {
        "vi": "Xương cánh tay, xương ức (mốc)",
        "en": "Humerus and sternum (landmarks)",
        "zh": "肱骨与胸骨（标志）"
      },
      "latin": "Humerus · Sternum · Costae",
      "note": {
        "vi": "Mờ sẵn — cho thấy đai vai treo vào thân mình chỉ ở khớp ức–đòn.",
        "en": "Faded — showing that the girdle joins the trunk only at the sternoclavicular joint.",
        "zh": "淡化——显示肩带仅在胸锁关节处连于躯干。"
      },
      "parts": [
        "FJ3262",
        "FJ3178"
      ]
    }
  ]
});
