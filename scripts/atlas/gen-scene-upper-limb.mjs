/**
 * Sinh scene "Đai vai và Chi trên" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-upper-limb.mjs
 *
 * Chỉ lấy chi trên BÊN TRÁI (như scene Z-Anatomy cũ): hai tay cách nhau
 * ~60cm, lấy cả hai thì mỗi bên chỉ còn một vệt nhỏ trong khung ngắm.
 * Lọc theo hệ `skeletal` vì nhiều cơ cẳng tay mang tên xương ("… of ulna").
 */
import { byRe, emit, leftSide } from "./lib.mjs";

const L = (re) => leftSide(byRe(re, ["skeletal"]));

emit({
  file: "upper-limb",
  exportName: "upperLimbScene",
  header: 'Scene "Đai vai và Chi trên" (bên trái) dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "dai-vai-chi-tren",
    title: { vi: "Đai vai và Chi trên", en: "Shoulder Girdle and Upper Limb", zh: "肩带与上肢" },
    latin: "Cingulum pectorale · Membrum superius",
    intro: {
      vi: "Chi trên (bên trái) treo vào thân chỉ qua MỘT khớp xương: khớp ức-đòn. Phần còn lại của đai vai — xương vai — được giữ bằng cơ, nên vai có biên độ cử động lớn nhất cơ thể nhưng cũng dễ trật nhất. Từ vai xuống: xương cánh tay, hai xương cẳng tay (quay ở ngoài, trụ ở trong), 8 xương cổ tay, 5 xương đốt bàn và 14 đốt ngón.",
      en: "The upper limb (left side shown) hangs from the trunk by only ONE bony joint: the sternoclavicular joint. The rest of the shoulder girdle — the scapula — is held by muscle, giving the shoulder the greatest range of motion in the body but also making it the easiest to dislocate. From the shoulder down: the humerus, the two forearm bones (radius laterally, ulna medially), 8 carpals, 5 metacarpals and 14 phalanges.",
      zh: "上肢（此处为左侧）仅通过一个骨性关节——胸锁关节——与躯干相连。肩带其余部分即肩胛骨靠肌肉固定，因此肩关节活动度为全身最大，也最易脱位。自肩向下依次为：肱骨、前臂两骨（外侧桡骨、内侧尺骨）、8块腕骨、5块掌骨和14节指骨。",
    },
  },
  groups: [
    {
      key: "xuong-don",
      tint: "#d9a066",
      latin: "Clavicula",
      name: { vi: "Xương đòn", en: "Clavicle", zh: "锁骨" },
      note: {
        vi: "Thanh chống duy nhất nối chi trên với thân, hình chữ S. Là xương gãy nhiều nhất cơ thể, thường ở chỗ nối 1/3 giữa và 1/3 ngoài khi ngã chống tay. Mạch dưới đòn và đám rối cánh tay chạy ngay bên dưới.",
        en: "The only strut connecting the upper limb to the trunk, S-shaped. It is the most frequently fractured bone in the body, usually at the junction of its middle and lateral thirds after a fall on an outstretched hand. The subclavian vessels and brachial plexus run just beneath it.",
        zh: "连接上肢与躯干的唯一骨性支柱，呈S形。是全身最常骨折的骨，多因手撑地跌倒而发生于中外1/3交界处。锁骨下血管和臂丛紧贴其下方走行。",
      },
      ids: L(/clavicle$/i),
    },
    {
      key: "xuong-vai",
      tint: "#c98a5a",
      latin: "Scapula",
      name: { vi: "Xương vai", en: "Scapula", zh: "肩胛骨" },
      note: {
        vi: "Xương dẹt hình tam giác trượt trên thành ngực sau. Ổ chảo nông chỉ ôm khoảng 1/3 chỏm xương cánh tay — chính vì thế khớp vai linh hoạt nhưng hay trật ra trước. Mỏm cùng vai và mỏm quạ là chỗ bám của nhiều cơ và dây chằng.",
        en: "A flat triangular bone gliding over the back of the chest wall. Its shallow glenoid cavity holds only about a third of the humeral head — which is why the shoulder is so mobile yet dislocates anteriorly so often. The acromion and coracoid process anchor many muscles and ligaments.",
        zh: "三角形扁骨，在胸后壁上滑动。关节盂浅，仅容纳肱骨头约1/3——这正是肩关节灵活却常向前脱位的原因。肩峰和喙突为多块肌肉和韧带的附着点。",
      },
      ids: L(/scapula$/i),
    },
    {
      key: "xuong-canh-tay",
      tint: "#e3c27a",
      latin: "Humerus",
      name: { vi: "Xương cánh tay", en: "Humerus", zh: "肱骨" },
      note: {
        vi: "Ba điểm gãy, ba dây thần kinh: cổ phẫu thuật — thần kinh nách; rãnh xoắn giữa thân — thần kinh quay (bàn tay rũ); mỏm trên lồi cầu trong — thần kinh trụ (\"xương buồn cười\").",
        en: "Three fracture sites, three nerves: the surgical neck — axillary nerve; the spiral groove mid-shaft — radial nerve (wrist drop); the medial epicondyle — ulnar nerve (the \"funny bone\").",
        zh: "三个骨折部位对应三条神经：外科颈——腋神经；骨干中段桡神经沟——桡神经（垂腕）；内上髁——尺神经（“麻筋”）。",
      },
      ids: L(/humerus$/i),
    },
    {
      key: "xuong-quay",
      tint: "#7fa878",
      latin: "Radius",
      name: { vi: "Xương quay", en: "Radius", zh: "桡骨" },
      note: {
        vi: "Nằm phía ngón cái, xoay quanh xương trụ trong động tác sấp-ngửa. Đầu dưới to, gánh phần lớn lực từ bàn tay — gãy đầu dưới xương quay (gãy Pouteau-Colles) là gãy xương hay gặp nhất ở người cao tuổi khi ngã chống tay.",
        en: "On the thumb side, rotating around the ulna in pronation and supination. Its broad distal end takes most of the force from the hand — a distal radius (Colles') fracture is the commonest fracture in older people falling on an outstretched hand.",
        zh: "位于拇指侧，在旋前旋后时绕尺骨转动。下端宽大，承受来自手的大部分力量——桡骨远端骨折（Colles骨折）是老年人手撑地跌倒时最常见的骨折。",
      },
      ids: L(/radius$/i),
    },
    {
      key: "xuong-tru",
      tint: "#5f9ea3",
      latin: "Ulna",
      name: { vi: "Xương trụ", en: "Ulna", zh: "尺骨" },
      note: {
        vi: "Nằm phía ngón út. Mỏm khuỷu ôm lấy ròng rọc xương cánh tay tạo khớp khuỷu bản lề — chính mỏm này là chỗ ta chống khuỷu tay. Hai xương cẳng tay nối nhau bằng màng gian cốt nên gãy một xương thường kèm trật khớp ở đầu kia.",
        en: "On the little-finger side. The olecranon hooks around the trochlea of the humerus to form the hinge of the elbow — it is the point you lean on. The two forearm bones are bound by the interosseous membrane, so a fracture of one often comes with a dislocation at the other end.",
        zh: "位于小指侧。鹰嘴钩绕肱骨滑车构成肘部屈戌关节——即支肘时着力之处。前臂两骨借骨间膜相连，故一骨骨折常伴另一端关节脱位。",
      },
      ids: L(/ulna$/i),
    },
    {
      key: "xuong-co-tay",
      tint: "#9b6fae",
      latin: "Ossa carpi",
      name: { vi: "Xương cổ tay", en: "Carpal bones", zh: "腕骨" },
      note: {
        vi: "Hai hàng: hàng trên (thuyền, nguyệt, tháp, đậu) và hàng dưới (thang, thê, cả, móc). Xương thuyền hay gãy nhất và dễ hoại tử vì máu đi vào từ đầu xa.",
        en: "Two rows: proximal (scaphoid, lunate, triquetrum, pisiform) and distal (trapezium, trapezoid, capitate, hamate). The scaphoid is the most often fractured and prone to necrosis because its blood enters from the distal end.",
        zh: "分两排：近侧列（手舟骨、月骨、三角骨、豌豆骨）和远侧列（大多角骨、小多角骨、头状骨、钩骨）。手舟骨最易骨折且易坏死，因血供自远端进入。",
      },
      ids: L(/(scaphoid|lunate|triquetral|pisiform|trapezium|trapezoid|capitate|hamate)$/i),
    },
    {
      key: "xuong-ban-ngon-tay",
      tint: "#6f93b8",
      latin: "Ossa metacarpi · Phalanges",
      name: { vi: "Xương đốt bàn và đốt ngón tay", en: "Metacarpals and phalanges", zh: "掌骨与指骨" },
      note: {
        vi: "5 xương đốt bàn và 14 đốt ngón: mỗi ngón có đốt gần, giữa, xa, riêng ngón cái chỉ có hai đốt. Xương đốt bàn I ngắn và tự do nhất, cho ngón cái đối chiếu với các ngón khác — động tác cầm nắm đặc trưng của người.",
        en: "5 metacarpals and 14 phalanges: each finger has proximal, middle and distal phalanges, except the thumb, which has two. The first metacarpal is the shortest and most mobile, letting the thumb oppose the other fingers — the defining human grip.",
        zh: "5块掌骨和14节指骨：每指有近节、中节、远节指骨，拇指仅两节。第一掌骨最短、最灵活，使拇指能与其余手指对掌——人类特有的抓握动作。",
      },
      ids: L(/metacarpal bone$|phalanx of left (thumb|index finger|middle finger|ring finger|little finger)$/i),
    },
  ],
});
