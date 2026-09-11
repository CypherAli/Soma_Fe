/**
 * Đợt 4A — tám scene chi trên, dựng từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-batch-a.mjs
 *
 * Mọi scene chỉ lấy tay TRÁI (x > 0) và lọc theo độ cao vì atlas có lưới đặt
 * tên sai vùng (bẫy #11–#12 trong docs/atlas-scene-playbook.md).
 *
 * "khop-vai-khuyu" và "dam-roi-canh-tay" ĐỔI CHỦ ĐỀ: atlas không có dây chằng
 * và không có thần kinh ngoại biên, nên hai bài cũ không dựng được. Thay bằng
 * hai chủ đề chưa có trong thư viện: vòng nối động mạch quanh vai và cung động
 * mạch gan tay.
 */
import { byRe, emit, leftSide, betweenY, OXY, DEOXY } from "./lib.mjs";

const L = (re, sys, y0 = 0.65, y1 = 1.52) => betweenY(leftSide(byRe(re, sys)), y0, y1);
const MU = ["muscular", "skeletal"];
const ART = ["arterial"];
const VEN = ["venous"];
const BONE = ["skeletal"];

// ───────────────────────── 1. Cánh tay ─────────────────────────
emit({
  file: "arm-region",
  script: "batch-a",
  exportName: "armRegionScene",
  header: 'Scene "Giải phẫu cánh tay" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu thần kinh ngoại biên (cơ bì, quay, trụ, giữa) và vách gian cơ.',
  scene: {
    slug: "giai-phau-canh-tay",
    title: { vi: "Giải phẫu cánh tay", en: "Anatomy of the Arm", zh: "臂部解剖" },
    latin: "Brachium",
    intro: {
      vi: "Cánh tay là đoạn chi trên từ vai tới khuỷu, quanh một xương duy nhất là xương cánh tay. Vách gian cơ chia nó thành hai khu. Khu trước là các cơ gấp: nhị đầu, cơ cánh tay và quạ–cánh tay. Khu sau là cơ duỗi tam đầu. Động mạch cánh tay đi dọc rãnh nhị đầu trong; động mạch cánh tay sâu vòng ra sau theo rãnh thần kinh quay. Mỗi khu cơ một tông màu, động mạch đỏ, tĩnh mạch xanh. Bộ dữ liệu không có thần kinh ngoại biên và vách gian cơ.",
      en: "The arm is the segment of the upper limb from shoulder to elbow, built around a single bone, the humerus. Intermuscular septa divide it into two compartments. The anterior compartment holds the flexors: biceps, brachialis and coracobrachialis. The posterior compartment holds the extensor, triceps. The brachial artery runs in the medial bicipital groove; the deep brachial artery winds backwards along the radial groove. Each compartment has its own colour family, arteries are red and veins blue. The dataset has no peripheral nerves or intermuscular septa.",
      zh: "臂是上肢从肩到肘的一段，只有一块骨——肱骨。肌间隔将其分为两个骨筋膜鞘：前群为屈肌（肱二头肌、肱肌、喙肱肌），后群为伸肌肱三头肌。肱动脉行于肱二头肌内侧沟，肱深动脉沿桡神经沟绕向后方。每个肌群一种色系，动脉红色、静脉蓝色。数据集中无周围神经和肌间隔。",
    },
  },
  faded: ["xuong-vai"],
  frame: ["truoc", "sau", "xuong"],
  groups: [
    {
      key: "truoc",
      tint: "#c9705f",
      latin: "Compartimentum brachii anterius",
      name: { vi: "Khu cơ trước (cơ gấp)", en: "Anterior compartment (flexors)", zh: "前群（屈肌）" },
      note: {
        vi: "Nhị đầu (đầu dài, đầu ngắn) gấp khuỷu và là cơ ngửa cẳng tay mạnh nhất. Cơ cánh tay nằm dưới nó, là cơ gấp khuỷu thuần tuý. Quạ–cánh tay khép và gấp vai. Cả ba do dây cơ bì chi phối.",
        en: "Biceps (long and short heads) flexes the elbow and is the strongest supinator of the forearm. Brachialis lies beneath it and is a pure elbow flexor. Coracobrachialis flexes and adducts the shoulder. All three are supplied by the musculocutaneous nerve.",
        zh: "肱二头肌（长头、短头）屈肘，也是最强的前臂旋后肌。肱肌位于其深面，是单纯的屈肘肌。喙肱肌使肩屈和内收。三者均受肌皮神经支配。",
      },
      ids: L(/head of (left |right )?biceps brachii$|^(left |right )?(brachialis|coracobrachialis)$/i, MU, 1.1, 1.45),
    },
    {
      key: "sau",
      tint: "#6f8fbf",
      latin: "Compartimentum brachii posterius",
      name: { vi: "Khu cơ sau (cơ duỗi)", en: "Posterior compartment (extensors)", zh: "后群（伸肌）" },
      note: {
        vi: "Tam đầu có ba đầu: đầu dài bám củ dưới ổ chảo nên còn duỗi vai; đầu ngoài và đầu trong bám thân xương cánh tay, hai bên rãnh thần kinh quay. Ba đầu hợp thành gân bám mỏm khuỷu. Cơ khuỷu nhỏ phụ duỗi. Dây quay chi phối.",
        en: "Triceps has three heads: the long head arises from the infraglenoid tubercle and so also extends the shoulder; the lateral and medial heads arise from the humeral shaft on either side of the radial groove. They unite in a tendon on the olecranon. The small anconeus assists extension. Supplied by the radial nerve.",
        zh: "肱三头肌有三个头：长头起于盂下结节，故亦伸肩；外侧头和内侧头起于肱骨干桡神经沟两侧。三头合成肌腱止于鹰嘴。小的肘肌辅助伸肘。受桡神经支配。",
      },
      ids: L(/head of (left |right )?triceps brachii$|^(left |right )?anconeus$/i, MU, 1.05, 1.45),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "A. brachialis · A. profunda brachii",
      name: { vi: "Động mạch cánh tay và nhánh bên", en: "Brachial artery and its branches", zh: "肱动脉及其分支" },
      note: {
        vi: "Tiếp nối động mạch nách từ bờ dưới cơ tròn lớn, đi dọc bờ trong nhị đầu tới hố khuỷu. Nhánh cánh tay sâu đi cùng dây quay; các nhánh bên trụ trên và dưới nối với nhánh quặt ngược quanh khuỷu. Đây là chỗ đo huyết áp và bắt mạch ở nếp khuỷu.",
        en: "Continues the axillary artery from the lower border of teres major and runs along the medial border of biceps to the cubital fossa. The deep brachial branch travels with the radial nerve; the superior and inferior ulnar collaterals join recurrent branches around the elbow. This is where blood pressure is measured and the pulse felt at the elbow crease.",
        zh: "自大圆肌下缘续于腋动脉，沿肱二头肌内侧缘下行至肘窝。肱深动脉伴桡神经；尺侧上、下副动脉与肘关节周围的返动脉吻合。此处为测血压和肘窝触脉之处。",
      },
      ids: L(/^(left |right )?(brachial|deep brachial|superior ulnar collateral|inferior ulnar collateral) artery$|collateral branch of (left |right )?deep brachial artery$/i, ART, 1.1, 1.4),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. cephalica · V. basilica · Vv. brachiales",
      name: { vi: "Tĩnh mạch nông và sâu", en: "Superficial and deep veins", zh: "浅静脉与深静脉" },
      note: {
        vi: "Tĩnh mạch đầu chạy ngoài nhị đầu lên rãnh delta–ngực; tĩnh mạch nền chạy trong, xuyên cân giữa cánh tay đổ vào tĩnh mạch cánh tay. Tĩnh mạch cánh tay đi kèm động mạch.",
        en: "The cephalic vein runs lateral to biceps up to the deltopectoral groove; the basilic vein runs medially and pierces the deep fascia at mid-arm to join the brachial veins, which accompany the artery.",
        zh: "头静脉行于肱二头肌外侧，上至三角胸肌沟；贵要静脉行于内侧，在臂中部穿深筋膜汇入肱静脉。肱静脉伴行动脉。",
      },
      ids: L(/^(left |right )?(cephalic|basilic|medial brachial) vein$/i, VEN, 1.05, 1.42),
    },
    {
      key: "xuong",
      latin: "Humerus",
      name: { vi: "Xương cánh tay", en: "Humerus", zh: "肱骨" },
      note: {
        vi: "Xương dài duy nhất của cánh tay. Gãy thân xương ngang rãnh thần kinh quay dễ gây liệt dây quay, biểu hiện bàn tay rũ.",
        en: "The only long bone of the arm. A shaft fracture at the radial groove readily injures the radial nerve, causing wrist drop.",
        zh: "臂部唯一的长骨。桡神经沟处骨干骨折易损伤桡神经，致腕下垂。",
      },
      ids: L(/^(left )?humerus$/i, BONE),
    },
    {
      key: "xuong-vai",
      latin: "Scapula · Clavicula",
      name: { vi: "Xương vai và xương đòn (mốc)", en: "Scapula and clavicle (landmarks)", zh: "肩胛骨与锁骨（标志）" },
      note: {
        vi: "Mờ sẵn — chỉ để thấy nguyên uỷ của nhị đầu, quạ–cánh tay và đầu dài tam đầu.",
        en: "Faded — shown only for the origins of biceps, coracobrachialis and the long head of triceps.",
        zh: "淡化——仅用于显示肱二头肌、喙肱肌和肱三头肌长头的起点。",
      },
      ids: L(/^(left )?(scapula|clavicle)$/i, BONE, 1.2, 1.6),
    },
  ],
});

// ───────────────────────── 2. Đai vai ─────────────────────────
emit({
  file: "shoulder-girdle",
  script: "batch-a",
  exportName: "shoulderGirdleScene",
  header: 'Scene "Đai vai" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu cơ lưng rộng, dây chằng quạ–đòn và bao khớp.',
  scene: {
    slug: "giai-phau-dai-vai",
    title: { vi: "Đai vai và cơ vận động xương vai", en: "The Shoulder Girdle", zh: "肩带" },
    latin: "Cingulum pectorale",
    intro: {
      vi: "Đai vai gồm xương đòn và xương vai. Nó chỉ nối với thân mình qua một khớp nhỏ là khớp ức–đòn, còn lại được treo bằng cơ. Nhờ vậy xương vai trượt tự do trên lồng ngực và cánh tay giơ được quá đầu. Scene chia các cơ theo hướng kéo xương vai: nâng (thang trên, nâng vai), kéo vào trong (thang giữa, trám), kéo ra trước (răng trước, ngực bé) và cơ delta phủ ngoài. Bộ dữ liệu không có cơ lưng rộng và dây chằng quạ–đòn.",
      en: "The shoulder girdle is the clavicle and scapula. It joins the trunk at only one small joint, the sternoclavicular joint; the rest is slung by muscles. This lets the scapula glide freely over the rib cage so the arm can be raised overhead. The scene groups the muscles by how they pull the scapula: elevators (upper trapezius, levator scapulae), retractors (middle trapezius, rhomboids), protractors (serratus anterior, pectoralis minor), with deltoid covering the outside. The dataset has no latissimus dorsi or coracoclavicular ligament.",
      zh: "肩带由锁骨和肩胛骨组成，仅借胸锁关节一个小关节连于躯干，其余靠肌肉悬吊，使肩胛骨在胸廓上自由滑动，手臂得以举过头顶。本场景按牵拉肩胛骨的方向分组：上提（斜方肌上部、肩胛提肌）、后缩（斜方肌中部、菱形肌）、前伸（前锯肌、胸小肌），外覆三角肌。数据集中无背阔肌和喙锁韧带。",
    },
  },
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Clavicula · Scapula",
      name: { vi: "Xương đòn và xương vai", en: "Clavicle and scapula", zh: "锁骨与肩胛骨" },
      note: {
        vi: "Xương đòn là thanh chống giữ vai cách xa lồng ngực. Nó gãy nhiều nhất ở chỗ nối 1/3 giữa và 1/3 ngoài. Xương vai có gai vai, mỏm cùng vai, mỏm quạ và ổ chảo nông.",
        en: "The clavicle is a strut holding the shoulder away from the chest. It fractures most often at the junction of its middle and lateral thirds. The scapula carries the spine, acromion, coracoid process and a shallow glenoid cavity.",
        zh: "锁骨是使肩部远离胸廓的支撑杆，最常在中外1/3交界处骨折。肩胛骨有肩胛冈、肩峰、喙突和浅的关节盂。",
      },
      ids: L(/^(left )?(clavicle|scapula)$/i, BONE, 1.2, 1.6),
    },
    {
      key: "nang",
      tint: "#b58bc4",
      latin: "M. trapezius · M. levator scapulae",
      name: { vi: "Nhóm nâng và kéo vào trong: cơ thang, nâng vai", en: "Elevators and retractors: trapezius, levator scapulae", zh: "上提与后缩肌：斜方肌、肩胛提肌" },
      note: {
        vi: "Cơ thang có ba phần: phần xuống nâng vai, phần ngang kéo vai vào trong, phần lên hạ vai. Phần xuống và phần lên cùng xoay xương vai để ổ chảo hướng lên khi giơ tay quá 90°. Cơ nâng vai nâng góc trên xương vai.",
        en: "Trapezius has three parts: descending elevates, transverse retracts, ascending depresses. Descending and ascending parts together rotate the scapula so the glenoid faces upward when the arm rises above 90°. Levator scapulae raises the superior angle.",
        zh: "斜方肌分三部：降部上提、横部后缩、升部下降肩胛。上下两部共同使肩胛骨旋转，举臂超过90°时关节盂朝上。肩胛提肌上提肩胛骨上角。",
      },
      ids: L(/part of (left |right )?trapezius$|^(left |right )?levator scapulae$/i, MU, 1.2, 1.62).concat(leftSide(byRe(/part of (left |right )?trapezius$/i, MU))),
    },
    {
      key: "tram",
      tint: "#8a6fb0",
      latin: "Mm. rhomboidei",
      name: { vi: "Cơ trám lớn và trám bé", en: "Rhomboid major and minor", zh: "大、小菱形肌" },
      note: {
        vi: "Nối gai đốt sống C7–T5 với bờ trong xương vai. Kéo xương vai vào trong và xoay ổ chảo xuống, đối lực với cơ răng trước.",
        en: "Link the spines of C7–T5 to the medial border of the scapula. They retract the scapula and rotate the glenoid downward, opposing serratus anterior.",
        zh: "连接C7–T5棘突与肩胛骨内侧缘。使肩胛骨后缩并使关节盂下旋，与前锯肌相拮抗。",
      },
      ids: leftSide(byRe(/^(left |right )?rhomboid (major|minor)$/i, MU)),
    },
    {
      key: "rang-truoc",
      tint: "#e39a7a",
      latin: "M. serratus anterior · M. pectoralis minor · M. subclavius",
      name: { vi: "Nhóm kéo ra trước: răng trước, ngực bé, dưới đòn", en: "Protractors: serratus anterior, pectoralis minor, subclavius", zh: "前伸肌：前锯肌、胸小肌、锁骨下肌" },
      note: {
        vi: "Cơ răng trước ép xương vai sát lồng ngực và kéo nó ra trước, như khi đấm. Liệt dây ngực dài làm xương vai vểnh lên như cánh chim. Cơ ngực bé kéo mỏm quạ xuống trước; cơ dưới đòn giữ xương đòn.",
        en: "Serratus anterior holds the scapula against the chest wall and draws it forward, as in punching. Long thoracic nerve palsy makes the scapula stick out like a wing. Pectoralis minor pulls the coracoid down and forward; subclavius steadies the clavicle.",
        zh: "前锯肌使肩胛骨紧贴胸壁并前拉（如出拳）。胸长神经麻痹致翼状肩胛。胸小肌将喙突拉向前下；锁骨下肌稳定锁骨。",
      },
      ids: leftSide(byRe(/^(left |right )?(serratus anterior|pectoralis minor|subclavius)$/i, MU)),
    },
    {
      key: "delta",
      tint: "#c9705f",
      latin: "M. deltoideus",
      name: { vi: "Cơ delta (ba phần)", en: "Deltoid (three parts)", zh: "三角肌（三部）" },
      note: {
        vi: "Phủ ngoài khớp vai, tạo đường cong của vai. Phần đòn gấp vai, phần cùng vai dạng vai từ 15° tới 90°, phần gai duỗi vai. Dây nách chi phối — dễ tổn thương khi trật khớp vai.",
        en: "Covers the shoulder joint and gives the shoulder its contour. The clavicular part flexes, the acromial part abducts from about 15° to 90°, the spinal part extends. Supplied by the axillary nerve — at risk in shoulder dislocation.",
        zh: "覆盖肩关节，形成肩部轮廓。锁骨部屈肩，肩峰部使肩外展约15°至90°，肩胛冈部伸肩。受腋神经支配——肩关节脱位时易受损。",
      },
      ids: L(/part of (left |right )?deltoid$/i, MU, 1.25, 1.5),
    },
    {
      key: "xuong-canh-tay",
      latin: "Humerus · Sternum · Costae",
      name: { vi: "Xương cánh tay, xương ức (mốc)", en: "Humerus and sternum (landmarks)", zh: "肱骨与胸骨（标志）" },
      note: {
        vi: "Mờ sẵn — cho thấy đai vai treo vào thân mình chỉ ở khớp ức–đòn.",
        en: "Faded — showing that the girdle joins the trunk only at the sternoclavicular joint.",
        zh: "淡化——显示肩带仅在胸锁关节处连于躯干。",
      },
      ids: L(/^(left )?humerus$/i, BONE).concat(byRe(/^(manubrium of sternum|body of sternum)$/i, BONE)),
    },
  ],
  faded: ["xuong-canh-tay"],
});

// ───────────────────────── 3. Chóp xoay ─────────────────────────
emit({
  file: "rotator-cuff",
  script: "batch-a",
  exportName: "rotatorCuffScene",
  header: 'Scene "Chóp xoay vai" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu bao khớp, sụn viền ổ chảo và túi hoạt dịch dưới mỏm cùng vai.',
  scene: {
    slug: "chop-xoay-vai",
    title: { vi: "Chóp xoay vai", en: "The Rotator Cuff", zh: "肩袖" },
    latin: "Musculi rotatores humeri",
    intro: {
      vi: "Khớp vai có chỏm to trên một ổ chảo nông như quả bóng trên đĩa, nên rất linh động và cũng dễ trật. Bốn cơ chóp xoay ôm quanh chỏm, giữ nó áp vào ổ chảo trong mọi tư thế. Đó là cơ trên gai, dưới gai, tròn bé và dưới vai. Mỗi cơ tô một màu riêng để thấy chỗ bám trên các củ xương cánh tay. Cơ delta và xương làm mờ sẵn. Bộ dữ liệu không có bao khớp và túi hoạt dịch.",
      en: "The shoulder is a large head on a shallow socket, like a ball on a saucer — very mobile and easy to dislocate. Four rotator cuff muscles wrap the head and keep it pressed into the glenoid in every position: supraspinatus, infraspinatus, teres minor and subscapularis. Each has its own colour to show where it inserts on the humeral tubercles. Deltoid and bones are faded. The dataset has no joint capsule or bursae.",
      zh: "肩关节头大盂浅，如球置于碟上，灵活而易脱位。四块肩袖肌包绕肱骨头，在各种姿势下将其压向关节盂：冈上肌、冈下肌、小圆肌和肩胛下肌。每块肌肉一种颜色，以显示其在肱骨结节上的止点。三角肌和骨骼淡化。数据集中无关节囊和滑囊。",
    },
  },
  faded: ["delta", "xuong"],
  frame: ["tren-gai", "duoi-gai", "tron-be", "duoi-vai"],
  groups: [
    {
      key: "tren-gai",
      tint: "#d9534f",
      latin: "M. supraspinatus",
      name: { vi: "Cơ trên gai", en: "Supraspinatus", zh: "冈上肌" },
      note: {
        vi: "Nằm trong hố trên gai, gân chui dưới mỏm cùng vai bám củ lớn. Khởi động dạng vai trong khoảng 15° đầu. Gân này bị kẹp và rách nhiều nhất trong hội chứng chèn ép dưới mỏm cùng vai.",
        en: "Lies in the supraspinous fossa; its tendon passes under the acromion to the greater tubercle. It starts abduction over the first 15° or so. This tendon is the one most often impinged and torn under the acromion.",
        zh: "位于冈上窝，肌腱经肩峰下止于大结节。启动肩外展（约前15°）。肩峰下撞击综合征中最常受压和撕裂的是此腱。",
      },
      ids: L(/^(left |right )?supraspinatus( muscle)?$/i, MU, 1.3, 1.5),
    },
    {
      key: "duoi-gai",
      tint: "#e8883d",
      latin: "M. infraspinatus",
      name: { vi: "Cơ dưới gai", en: "Infraspinatus", zh: "冈下肌" },
      note: {
        vi: "Phủ hố dưới gai, bám mặt giữa củ lớn. Là cơ xoay ngoài chính của cánh tay. Cùng cơ trên gai do dây trên vai chi phối.",
        en: "Fills the infraspinous fossa and inserts on the middle facet of the greater tubercle. It is the main lateral rotator of the arm. Like supraspinatus it is supplied by the suprascapular nerve.",
        zh: "占据冈下窝，止于大结节中部压迹，是臂的主要外旋肌。与冈上肌同受肩胛上神经支配。",
      },
      ids: L(/^(left |right )?infraspinatus( muscle)?$/i, MU, 1.25, 1.5),
    },
    {
      key: "tron-be",
      tint: "#e6c14a",
      latin: "M. teres minor",
      name: { vi: "Cơ tròn bé", en: "Teres minor", zh: "小圆肌" },
      note: {
        vi: "Dọc bờ ngoài xương vai, bám mặt dưới củ lớn, xoay ngoài cùng cơ dưới gai. Do dây nách chi phối. Đừng nhầm với cơ tròn lớn: cơ đó không thuộc chóp xoay và xoay trong.",
        en: "Runs along the lateral border of the scapula to the lower facet of the greater tubercle, rotating laterally with infraspinatus. Supplied by the axillary nerve. Do not confuse it with teres major, which is not part of the cuff and rotates medially.",
        zh: "沿肩胛骨外侧缘止于大结节下压迹，与冈下肌共同外旋，受腋神经支配。勿与大圆肌混淆——后者不属肩袖，作用为内旋。",
      },
      ids: L(/^(left |right )?teres minor$/i, MU, 1.25, 1.5),
    },
    {
      key: "duoi-vai",
      tint: "#5b9bd5",
      latin: "M. subscapularis",
      name: { vi: "Cơ dưới vai", en: "Subscapularis", zh: "肩胛下肌" },
      note: {
        vi: "Lót mặt trước xương vai, áp sát lồng ngực, bám củ bé. Là cơ lớn nhất chóp xoay và là cơ xoay trong chính. Nó chặn chỏm không trượt ra trước.",
        en: "Lines the front of the scapula against the chest wall and inserts on the lesser tubercle. It is the largest cuff muscle and the main medial rotator. It stops the head sliding forward.",
        zh: "衬于肩胛骨前面紧贴胸廓，止于小结节。是肩袖中最大的肌肉，也是主要内旋肌，阻止肱骨头向前滑脱。",
      },
      ids: L(/^(left |right )?subscapularis$/i, MU, 1.2, 1.5),
    },
    {
      key: "tron-lon",
      tint: "#8d7bb5",
      latin: "M. teres major",
      name: { vi: "Cơ tròn lớn (so sánh — không thuộc chóp xoay)", en: "Teres major (for comparison — not a cuff muscle)", zh: "大圆肌（对照——非肩袖肌）" },
      note: {
        vi: "Đi từ góc dưới xương vai tới mép củ bé. Nó khép và xoay trong cánh tay, không bám bao khớp nên không giữ vững chỏm.",
        en: "Runs from the inferior angle of the scapula to the crest of the lesser tubercle. It adducts and medially rotates the arm; it does not blend with the capsule, so it does not stabilise the head.",
        zh: "自肩胛骨下角至小结节嵴。使臂内收和内旋；不与关节囊融合，故不稳定肱骨头。",
      },
      ids: L(/^(left |right )?teres major$/i, MU, 1.2, 1.5),
    },
    {
      key: "delta",
      tint: "#c9a79e",
      latin: "M. deltoideus",
      name: { vi: "Cơ delta (mờ sẵn)", en: "Deltoid (faded)", zh: "三角肌（淡化）" },
      note: {
        vi: "Phủ ngoài chóp xoay. Nếu chóp xoay yếu, lực kéo lên của delta đẩy chỏm chạm mỏm cùng vai thay vì làm dạng tay.",
        en: "Covers the cuff. If the cuff is weak, deltoid's upward pull jams the head against the acromion instead of abducting the arm.",
        zh: "覆盖肩袖外面。肩袖无力时，三角肌向上的拉力会使肱骨头撞击肩峰而非外展手臂。",
      },
      ids: L(/part of (left |right )?deltoid$/i, MU, 1.25, 1.5),
    },
    {
      key: "xuong",
      latin: "Scapula · Humerus · Clavicula",
      name: { vi: "Xương vai, cánh tay, đòn (mốc)", en: "Scapula, humerus, clavicle (landmarks)", zh: "肩胛骨、肱骨、锁骨（标志）" },
      note: {
        vi: "Mờ sẵn. Chú ý ổ chảo chỉ bằng khoảng 1/3 diện tích chỏm xương cánh tay.",
        en: "Faded. Note that the glenoid is only about a third the size of the humeral head.",
        zh: "淡化。注意关节盂面积仅约为肱骨头的1/3。",
      },
      ids: L(/^(left )?(scapula|humerus|clavicle)$/i, BONE, 1.1, 1.6),
    },
  ],
});

// ─────────────── 4. Vòng nối động mạch quanh vai (đổi chủ đề) ───────────────
emit({
  file: "scapular-anastomosis",
  script: "batch-a",
  exportName: "scapularAnastomosisScene",
  header: 'Scene "Vòng nối động mạch quanh vai" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Khớp vai–khuỷu" cũ: atlas không có dây chằng/bao khớp nên bài khớp không dựng chuẩn được.',
  scene: {
    slug: "khop-vai-khuyu",
    system: "cardiovascular",
    title: { vi: "Động mạch nách và vòng nối quanh vai", en: "Axillary Artery and the Scapular Anastomosis", zh: "腋动脉与肩胛动脉网" },
    latin: "A. axillaris · Rete scapulare",
    intro: {
      vi: "Động mạch nách đi từ bờ ngoài xương sườn I tới bờ dưới cơ tròn lớn. Cơ ngực bé chia nó làm ba đoạn, mỗi đoạn cho nhánh riêng. Các nhánh này nối với nhánh của động mạch dưới đòn quanh xương vai, gọi là vòng nối quanh vai. Vì thế thắt động mạch nách phía trên nhánh dưới vai thì cánh tay vẫn được nuôi. Mỗi hệ nhánh một sắc đỏ riêng; tĩnh mạch đi kèm màu xanh; xương và cơ mờ sẵn.",
      en: "The axillary artery runs from the outer border of the first rib to the lower border of teres major. Pectoralis minor divides it into three parts, each with its own branches. These branches join branches of the subclavian artery around the scapula, forming the scapular anastomosis. That is why tying the axillary artery above the subscapular branch still leaves the arm supplied. Each branch system has its own shade of red; companion veins are blue; bones and muscles are faded.",
      zh: "腋动脉自第1肋外缘至大圆肌下缘，被胸小肌分为三段，各段发出不同分支。这些分支在肩胛骨周围与锁骨下动脉的分支吻合，形成肩胛动脉网，故在肩胛下动脉起点以上结扎腋动脉，上肢仍有血供。每组分支一种红色调，伴行静脉蓝色，骨骼和肌肉淡化。",
    },
  },
  faded: ["xuong", "co"],
  frame: ["nach", "duoi-vai", "mu-canh-tay", "cung-vai", "tm"],
  groups: [
    {
      key: "nach",
      tint: OXY,
      latin: "A. subclavia · A. axillaris",
      name: { vi: "Động mạch dưới đòn và động mạch nách", en: "Subclavian and axillary arteries", zh: "锁骨下动脉与腋动脉" },
      note: {
        vi: "Cùng một thân mạch đổi tên theo mốc: dưới đòn tới bờ ngoài xương sườn I, nách tới bờ dưới cơ tròn lớn, rồi thành động mạch cánh tay.",
        en: "One continuous trunk renamed at landmarks: subclavian to the outer border of rib 1, axillary to the lower border of teres major, then brachial.",
        zh: "同一动脉干按标志更名：至第1肋外缘为锁骨下动脉，至大圆肌下缘为腋动脉，其后为肱动脉。",
      },
      ids: L(/^(left |right )?(subclavian|axillary) artery$/i, ART, 1.3, 1.6),
    },
    {
      key: "cung-vai",
      tint: "#e8883d",
      latin: "A. thoracoacromialis · A. suprascapularis · A. dorsalis scapulae",
      name: { vi: "Nhánh ngực–cùng vai, trên vai, vai sau", en: "Thoraco-acromial, suprascapular and dorsal scapular arteries", zh: "胸肩峰动脉、肩胛上动脉、肩胛背动脉" },
      note: {
        vi: "Thân ngực–cùng vai (đoạn 2 động mạch nách) chia nhánh cùng vai, delta, ngực. Hai nhánh trên vai và vai sau đến từ động mạch dưới đòn, xuống hố trên gai, dưới gai và bờ trong xương vai. Đó là phía trên của vòng nối.",
        en: "The thoraco-acromial trunk (second part of the axillary) splits into acromial, deltoid and pectoral branches. The suprascapular and dorsal scapular arteries come from the subclavian and descend to the supraspinous and infraspinous fossae and the medial border of the scapula — the upper limb of the anastomosis.",
        zh: "胸肩峰动脉干（腋动脉第二段）分为肩峰支、三角肌支和胸肌支。肩胛上动脉和肩胛背动脉来自锁骨下动脉，下行至冈上窝、冈下窝和肩胛骨内侧缘，构成动脉网的上部。",
      },
      ids: L(/thoraco-acromial artery$|^(left |right )?(suprascapular|dorsal scapular) artery$/i, ART, 1.25, 1.6),
    },
    {
      key: "duoi-vai",
      tint: "#b03a48",
      latin: "A. subscapularis · A. circumflexa scapulae · A. thoracodorsalis",
      name: { vi: "Động mạch dưới vai và hai nhánh tận", en: "Subscapular artery and its two terminal branches", zh: "肩胛下动脉及其两终支" },
      note: {
        vi: "Nhánh lớn nhất của động mạch nách (đoạn 3). Nó chia thành động mạch mũ vai, vòng ra hố dưới gai, và động mạch ngực–lưng, đi xuống cùng dây ngực–lưng. Đây là phía dưới của vòng nối.",
        en: "The largest branch of the axillary artery (third part). It splits into the circumflex scapular artery, which winds round to the infraspinous fossa, and the thoracodorsal artery, which descends with the thoracodorsal nerve — the lower limb of the anastomosis.",
        zh: "腋动脉最大分支（第三段）。分为旋肩胛动脉（绕至冈下窝）和胸背动脉（伴胸背神经下行），构成动脉网的下部。",
      },
      ids: L(/^(left |right )?(subscapular|circumflex scapular|thoracodorsal|lateral thoracic) artery$/i, ART, 1.25, 1.5),
    },
    {
      key: "mu-canh-tay",
      tint: "#e39a7a",
      latin: "Aa. circumflexae humeri anterior et posterior",
      name: { vi: "Động mạch mũ cánh tay trước và sau", en: "Anterior and posterior circumflex humeral arteries", zh: "旋肱前、后动脉" },
      note: {
        vi: "Vòng quanh cổ phẫu thuật xương cánh tay. Động mạch mũ sau đi cùng dây nách qua lỗ tứ giác, nên gãy cổ phẫu thuật có thể tổn thương cả hai.",
        en: "Encircle the surgical neck of the humerus. The posterior one passes with the axillary nerve through the quadrangular space, so a surgical-neck fracture can injure both.",
        zh: "环绕肱骨外科颈。旋肱后动脉与腋神经同穿四边孔，故外科颈骨折可同时损伤二者。",
      },
      ids: L(/^(left |right )?(anterior|posterior) circumflex humeral artery$/i, ART, 1.3, 1.45),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "V. axillaris et venae comitantes",
      name: { vi: "Tĩnh mạch nách và tĩnh mạch đi kèm", en: "Axillary vein and companion veins", zh: "腋静脉及伴行静脉" },
      note: {
        vi: "Tĩnh mạch nách nằm trong động mạch; các nhánh cùng tên đi kèm nhánh động mạch.",
        en: "The axillary vein lies medial to the artery; tributaries of the same names accompany the arterial branches.",
        zh: "腋静脉位于动脉内侧；同名属支伴行各动脉分支。",
      },
      ids: L(/^(left |right )?(axillary|subscapular|circumflex scapular|thoracodorsal|lateral thoracic|suprascapular|anterior circumflex humeral) vein$/i, VEN, 1.25, 1.55),
    },
    {
      key: "co",
      tint: "#c9a79e",
      latin: "Mm. pectoralis minor, teres major, subscapularis",
      name: { vi: "Cơ ngực bé, tròn lớn, dưới vai (mốc)", en: "Pectoralis minor, teres major, subscapularis (landmarks)", zh: "胸小肌、大圆肌、肩胛下肌（标志）" },
      note: {
        vi: "Cơ ngực bé là mốc chia ba đoạn động mạch nách; cơ tròn lớn là mốc kết thúc nó.",
        en: "Pectoralis minor marks the three parts of the axillary artery; teres major marks its end.",
        zh: "胸小肌为腋动脉分段标志；大圆肌为其终点标志。",
      },
      ids: L(/^(left |right )?(pectoralis minor|teres major|subscapularis)$/i, MU, 1.2, 1.5),
    },
    {
      key: "xuong",
      latin: "Scapula · Clavicula · Humerus",
      name: { vi: "Xương vai, đòn, cánh tay (mốc)", en: "Scapula, clavicle, humerus (landmarks)", zh: "肩胛骨、锁骨、肱骨（标志）" },
      note: {
        vi: "Mờ sẵn để vòng nối quanh xương vai hiện rõ.",
        en: "Faded so the loop around the scapula stands out.",
        zh: "淡化，使肩胛骨周围的吻合环清晰可见。",
      },
      ids: L(/^(left )?(scapula|clavicle|humerus)$/i, BONE, 1.1, 1.6),
    },
  ],
});

// ───────────────────────── 5. Hố khuỷu ─────────────────────────
emit({
  file: "cubital-fossa",
  script: "batch-a",
  exportName: "cubitalFossaScene",
  header: 'Scene "Hố khuỷu" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây giữa, cân nhị đầu và gân nhị đầu tách riêng.',
  scene: {
    slug: "ho-khuyu",
    title: { vi: "Hố khuỷu", en: "The Cubital Fossa", zh: "肘窝" },
    latin: "Fossa cubitalis",
    intro: {
      vi: "Hố khuỷu là hõm tam giác ở mặt trước khuỷu. Bờ ngoài là cơ cánh tay–quay, bờ trong là cơ sấp tròn, nền là cơ cánh tay và cơ ngửa. Trong hố, động mạch cánh tay chia đôi thành động mạch quay và trụ, ngay trong gân nhị đầu. Dây giữa nằm trong nữa nhưng bộ dữ liệu không có. Phía nông là mạng tĩnh mạch hình chữ M, nơi lấy máu và truyền dịch. Xương làm mờ sẵn.",
      en: "The cubital fossa is the triangular hollow at the front of the elbow. Its lateral border is brachioradialis, its medial border pronator teres, and its floor brachialis and supinator. Inside it the brachial artery divides into radial and ulnar arteries, just medial to the biceps tendon. The median nerve lies further medial but is not in the dataset. Superficially lies the M-shaped venous pattern used for blood draws and drips. Bones are faded.",
      zh: "肘窝是肘前方的三角形凹陷：外侧界为肱桡肌，内侧界为旋前圆肌，窝底为肱肌和旋后肌。窝内肱动脉在肱二头肌腱内侧分为桡动脉和尺动脉；正中神经位于更内侧，但数据集中没有。浅层为M形静脉网，用于抽血和输液。骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["bo", "nen", "nhi-dau", "dm", "tm-nong"],
  groups: [
    {
      key: "bo",
      tint: "#b58bc4",
      latin: "M. brachioradialis · M. pronator teres",
      name: { vi: "Hai bờ: cơ cánh tay–quay và cơ sấp tròn", en: "The borders: brachioradialis and pronator teres", zh: "两侧界：肱桡肌与旋前圆肌" },
      note: {
        vi: "Cơ cánh tay–quay (bờ ngoài) gấp khuỷu ở tư thế nửa sấp, do dây quay chi phối. Cơ sấp tròn (bờ trong) có hai đầu; dây giữa chui giữa hai đầu này và có thể bị chèn ép tại đây.",
        en: "Brachioradialis (lateral border) flexes the elbow in mid-pronation and is supplied by the radial nerve. Pronator teres (medial border) has two heads; the median nerve passes between them and can be compressed there.",
        zh: "肱桡肌（外侧界）在半旋前位屈肘，受桡神经支配。旋前圆肌（内侧界）有两个头，正中神经穿行其间，可在此受压。",
      },
      ids: L(/^(left |right )?brachioradialis$|head of (left |right )?pronator teres$/i, MU, 0.95, 1.2),
    },
    {
      key: "nen",
      tint: "#8a6fb0",
      latin: "M. brachialis · M. supinator",
      name: { vi: "Nền hố: cơ cánh tay và cơ ngửa", en: "The floor: brachialis and supinator", zh: "窝底：肱肌与旋后肌" },
      note: {
        vi: "Cơ cánh tay bám mỏm vẹt xương trụ; cơ ngửa quấn quanh cổ xương quay. Nhánh sâu dây quay xuyên qua cơ ngửa.",
        en: "Brachialis inserts on the coronoid process of the ulna; supinator wraps the neck of the radius. The deep branch of the radial nerve pierces supinator.",
        zh: "肱肌止于尺骨冠突；旋后肌包绕桡骨颈。桡神经深支穿旋后肌。",
      },
      ids: L(/^(left |right )?(brachialis|supinator)$/i, MU, 1.0, 1.25),
    },
    {
      key: "nhi-dau",
      tint: "#c9705f",
      latin: "M. biceps brachii",
      name: { vi: "Cơ nhị đầu (gân vào hố)", en: "Biceps brachii (tendon enters the fossa)", zh: "肱二头肌（腱入肘窝）" },
      note: {
        vi: "Gân nhị đầu là mốc sờ được giữa hố: động mạch cánh tay nằm ngay trong gân. Cân nhị đầu (không có trong bộ dữ liệu) trải chéo vào trong, che động mạch.",
        en: "The biceps tendon is the palpable landmark in the middle of the fossa: the brachial artery lies just medial to it. The bicipital aponeurosis (not in the dataset) fans medially over the artery.",
        zh: "肱二头肌腱是窝中可触及的标志，肱动脉紧贴其内侧。肱二头肌腱膜（数据集中无）向内斜铺，覆盖动脉。",
      },
      ids: L(/head of (left |right )?biceps brachii$/i, MU, 1.05, 1.45),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "A. brachialis → A. radialis, A. ulnaris",
      name: { vi: "Động mạch cánh tay chia đôi", en: "Brachial artery and its bifurcation", zh: "肱动脉分叉" },
      note: {
        vi: "Chia đôi ngang cổ xương quay. Động mạch quay đi nông ra ngoài. Động mạch trụ chui sâu dưới cơ sấp tròn và cho động mạch gian cốt chung. Các nhánh quặt ngược đi lên, nối với các nhánh bên của động mạch cánh tay.",
        en: "Divides at the level of the neck of the radius. The radial artery runs superficially and laterally. The ulnar artery dives deep to pronator teres and gives the common interosseous artery. Recurrent branches climb to join the collateral branches of the brachial.",
        zh: "在桡骨颈平面分叉。桡动脉浅行向外；尺动脉潜入旋前圆肌深面并发出骨间总动脉。各返支上行，与肱动脉的侧副支吻合。",
      },
      ids: L(/^(left |right )?(brachial|radial|ulnar|common interosseous|radial recurrent|anterior ulnar recurrent|posterior ulnar recurrent) artery$/i, ART, 0.95, 1.3),
    },
    {
      key: "tm-nong",
      tint: DEOXY,
      latin: "V. mediana cubiti · V. cephalica · V. basilica",
      name: { vi: "Tĩnh mạch nông vùng khuỷu", en: "Superficial veins at the elbow", zh: "肘部浅静脉" },
      note: {
        vi: "Tĩnh mạch giữa khuỷu nối tĩnh mạch đầu (ngoài) với tĩnh mạch nền (trong). Nó to, cố định và nằm trên cân nhị đầu, cân này ngăn nó với động mạch. Vì thế đây là chỗ lấy máu chuẩn.",
        en: "The median cubital vein links the cephalic vein (lateral) to the basilic vein (medial). It is large and fixed, and it lies on the bicipital aponeurosis, which separates it from the artery. That makes it the standard site for drawing blood.",
        zh: "肘正中静脉连接头静脉（外侧）和贵要静脉（内侧）。它粗大、固定，位于肱二头肌腱膜之上，腱膜将其与动脉隔开，因此是标准的采血部位。",
      },
      ids: L(/^(left |right )?(median cubital|cephalic|basilic|median antebrachial) vein$/i, VEN, 0.95, 1.25),
    },
    {
      key: "xuong",
      latin: "Humerus · Radius · Ulna",
      name: { vi: "Đầu dưới xương cánh tay, xương quay, trụ (mốc)", en: "Distal humerus, radius, ulna (landmarks)", zh: "肱骨下端、桡骨、尺骨（标志）" },
      note: {
        vi: "Mờ sẵn. Đường nối hai mỏm trên lồi cầu là bờ trên của hố.",
        en: "Faded. The line between the two epicondyles is the upper border of the fossa.",
        zh: "淡化。两上髁连线为肘窝上界。",
      },
      ids: L(/^(left )?(humerus|radius|ulna)$/i, BONE),
    },
  ],
});

// ───────────────────────── 6. Khớp khuỷu ─────────────────────────
emit({
  file: "elbow-joint",
  script: "batch-a",
  exportName: "elbowJointScene",
  header: 'Scene "Khớp khuỷu" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu bao khớp, dây chằng bên và dây chằng vòng — bài dạy xương khớp + cơ vận động + vòng nối mạch.',
  scene: {
    slug: "khop-khuyu",
    title: { vi: "Khớp khuỷu: xương, cơ vận động và vòng nối mạch", en: "The Elbow Joint: Bones, Movers and Anastomosis", zh: "肘关节：骨、运动肌与动脉网" },
    latin: "Articulatio cubiti",
    intro: {
      vi: "Khớp khuỷu gồm ba khớp chung một bao. Khớp cánh tay–trụ và cánh tay–quay cho gấp và duỗi; khớp quay–trụ trên cho sấp và ngửa cẳng tay. Scene chia cơ theo động tác: gấp, duỗi, sấp–ngửa. Màng gian cốt nối hai xương cẳng tay. Quanh khuỷu có vòng nối giữa nhánh bên động mạch cánh tay và các nhánh quặt ngược. Bộ dữ liệu không có bao khớp và dây chằng, nên phần dây chằng chỉ được mô tả trong ghi chú.",
      en: "The elbow is three joints sharing one capsule. The humero-ulnar and humeroradial joints flex and extend; the proximal radio-ulnar joint pronates and supinates the forearm. The scene groups the muscles by action: flexion, extension, pronation–supination. The interosseous membrane ties the two forearm bones. Around the elbow, collateral branches of the brachial artery join recurrent branches. The dataset has no capsule or ligaments, so those appear only in the notes.",
      zh: "肘关节由三个关节共用一个关节囊：肱尺关节和肱桡关节司屈伸，桡尺近侧关节司前臂旋前旋后。本场景按动作分组：屈、伸、旋前旋后。骨间膜连接前臂两骨。肘周肱动脉侧副支与返支吻合。数据集中无关节囊和韧带，仅在注释中描述。",
    },
  },
  frame: ["xuong", "gap", "duoi", "sap-ngua"],
  groups: [
    {
      key: "xuong",
      tint: "#d9cfb8",
      latin: "Humerus · Radius · Ulna",
      name: { vi: "Ba xương tạo khớp", en: "The three articulating bones", zh: "构成关节的三块骨" },
      note: {
        vi: "Ròng rọc xương cánh tay khớp khuyết ròng rọc xương trụ như bản lề; chỏm con khớp chỏm xương quay. Chỏm quay xoay trong dây chằng vòng. Ở trẻ nhỏ, kéo mạnh tay có thể làm chỏm quay tuột khỏi dây chằng này.",
        en: "The trochlea of the humerus fits the trochlear notch of the ulna like a hinge; the capitulum meets the radial head. The radial head spins inside the annular ligament. In small children a sharp pull on the arm can slip the radial head out of it.",
        zh: "肱骨滑车与尺骨滑车切迹构成铰链；肱骨小头与桡骨头相关节。桡骨头在环状韧带内旋转；幼儿手臂被猛拉时桡骨头可从中滑脱（牵拉肘）。",
      },
      ids: L(/^(left )?(humerus|radius|ulna)$/i, BONE),
    },
    {
      key: "gap",
      tint: "#c9705f",
      latin: "Mm. biceps brachii, brachialis, brachioradialis",
      name: { vi: "Cơ gấp khuỷu", en: "Elbow flexors", zh: "屈肘肌" },
      note: {
        vi: "Cơ cánh tay gấp ở mọi tư thế cẳng tay; nhị đầu mạnh nhất khi ngửa; cánh tay–quay mạnh nhất ở tư thế nửa sấp, như khi cầm cốc.",
        en: "Brachialis flexes in every forearm position; biceps is strongest in supination; brachioradialis is strongest in mid-pronation, as when holding a cup.",
        zh: "肱肌在前臂任何位置都能屈肘；肱二头肌在旋后位最强；肱桡肌在半旋前位（如握杯）最强。",
      },
      ids: L(/head of (left |right )?biceps brachii$|^(left |right )?(brachialis|brachioradialis)$/i, MU, 1.0, 1.45),
    },
    {
      key: "duoi",
      tint: "#6f8fbf",
      latin: "M. triceps brachii · M. anconeus",
      name: { vi: "Cơ duỗi khuỷu", en: "Elbow extensors", zh: "伸肘肌" },
      note: {
        vi: "Tam đầu bám mỏm khuỷu; cơ khuỷu nhỏ căng bao khớp phía sau khi duỗi.",
        en: "Triceps inserts on the olecranon; the small anconeus tenses the back of the capsule during extension.",
        zh: "肱三头肌止于鹰嘴；小的肘肌在伸肘时紧张关节囊后部。",
      },
      ids: L(/head of (left |right )?triceps brachii$|^(left |right )?anconeus$/i, MU, 1.05, 1.45),
    },
    {
      key: "sap-ngua",
      tint: "#e8883d",
      latin: "Mm. pronator teres, pronator quadratus, supinator",
      name: { vi: "Cơ sấp và cơ ngửa", en: "Pronators and supinator", zh: "旋前肌与旋后肌" },
      note: {
        vi: "Sấp tròn và sấp vuông kéo xương quay bắt chéo trước xương trụ. Cơ ngửa, cùng nhị đầu, xoay nó về lại. Ngửa mạnh hơn sấp, nên ốc vít có ren thuận cho người thuận tay phải.",
        en: "Pronator teres and pronator quadratus swing the radius across the ulna. Supinator, with biceps, turns it back. Supination is the stronger movement, which is why screws are threaded for right-handers.",
        zh: "旋前圆肌与旋前方肌使桡骨交叉于尺骨前方；旋后肌与肱二头肌使其转回。旋后力量大于旋前，因此螺丝的螺纹为右利手设计。",
      },
      ids: L(/head of (left |right )?pronator teres$|^(left |right )?(pronator quadratus|supinator)$/i, MU, 0.88, 1.12),
    },
    {
      key: "mang",
      tint: "#9fb8a0",
      latin: "Membrana interossea antebrachii",
      name: { vi: "Màng gian cốt cẳng tay", en: "Interosseous membrane of the forearm", zh: "前臂骨间膜" },
      note: {
        vi: "Thớ màng chạy chếch xuống trong, từ xương quay sang xương trụ. Nhờ vậy lực đè lên bàn tay (tì vào xương quay) được chuyển sang xương trụ rồi lên khuỷu.",
        en: "Its fibres run obliquely down and medially from radius to ulna. So force through the hand, which bears on the radius, passes to the ulna and on to the elbow.",
        zh: "纤维自桡骨斜向内下至尺骨，使经手传至桡骨的力转移到尺骨再传向肘部。",
      },
      ids: L(/^interosseous membrane of (left )?forearm$/i, ["connective"]),
    },
    {
      key: "vong-noi",
      tint: OXY,
      latin: "Rete articulare cubiti",
      name: { vi: "Vòng nối động mạch quanh khuỷu", en: "Arterial anastomosis around the elbow", zh: "肘关节动脉网" },
      note: {
        vi: "Các nhánh bên trụ trên và dưới, nhánh bên quay và bên giữa của động mạch cánh tay đi xuống. Chúng nối với nhánh quặt ngược quay, quặt ngược trụ và quặt ngược gian cốt đi lên. Vòng nối nuôi chi khi động mạch cánh tay bị tắc dưới nhánh sâu.",
        en: "The superior and inferior ulnar collaterals and the radial and middle collaterals descend from the brachial artery. They meet the radial, ulnar and interosseous recurrent arteries climbing up. The loop keeps the limb supplied if the brachial is blocked below the deep branch.",
        zh: "尺侧上、下副动脉及桡侧副动脉、中副动脉自肱动脉下行，与上行的桡侧返动脉、尺侧返动脉、骨间返动脉吻合。当肱动脉在肱深动脉以下阻塞时，此网维持肢体血供。",
      },
      ids: L(/(superior|inferior) ulnar collateral artery$|collateral branch of (left |right )?deep brachial artery$|(radial|anterior ulnar|posterior ulnar|interosseous) recurrent artery$|^(left |right )?recurrent interosseous artery$/i, ART, 1.0, 1.25),
    },
  ],
});

// ───────────────────── 7. Cổ tay và ống cổ tay ─────────────────────
emit({
  file: "carpal-tunnel",
  script: "batch-a",
  exportName: "carpalTunnelScene",
  header: 'Scene "Cổ tay và ống cổ tay" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây giữa, dây trụ và các dây chằng cổ tay.',
  scene: {
    slug: "co-tay-ong-co-tay",
    title: { vi: "Xương cổ tay và ống cổ tay", en: "The Carpus and Carpal Tunnel", zh: "腕骨与腕管" },
    latin: "Carpus · Canalis carpi",
    intro: {
      vi: "Tám xương cổ tay xếp thành hai hàng và tạo một máng lõm ở mặt gan tay. Mạc giữ gân gấp căng ngang trên máng, biến nó thành ống cổ tay. Trong ống có chín gân gấp: bốn gân gấp nông, bốn gân gấp sâu, một gân gấp dài ngón cái. Dây giữa cũng chạy trong ống nhưng bộ dữ liệu không có. Ống chật nên chỉ cần phù nề nhẹ là dây giữa bị chèn ép, gây hội chứng ống cổ tay. Hai hàng xương mang hai màu, gân gấp mỗi cơ một màu.",
      en: "The eight carpal bones form two rows and a hollow gutter on the palmar side. The flexor retinaculum spans the gutter and turns it into the carpal tunnel. Through it run nine flexor tendons: four of flexor superficialis, four of flexor profundus and one of flexor pollicis longus. The median nerve also runs through it but is not in the dataset. The tunnel is tight, so slight swelling compresses the median nerve and causes carpal tunnel syndrome. The two rows of bones have two colours, and each flexor has its own.",
      zh: "八块腕骨排成两列，在掌侧形成凹槽；屈肌支持带横跨其上，构成腕管。管内有九条屈肌腱：指浅屈肌腱4条、指深屈肌腱4条、拇长屈肌腱1条。正中神经也经管内走行，但数据集中没有。腕管狭窄，轻度水肿即可压迫正中神经，引起腕管综合征。两列腕骨两种颜色，每块屈肌一种颜色。",
    },
  },
  frame: ["hang-tren", "hang-duoi", "mac-giu", "gan"],
  faded: ["xuong-dai"],
  groups: [
    {
      key: "hang-tren",
      tint: "#e6c14a",
      latin: "Os scaphoideum, lunatum, triquetrum, pisiforme",
      name: { vi: "Hàng trên: thuyền, nguyệt, tháp, đậu", en: "Proximal row: scaphoid, lunate, triquetrum, pisiform", zh: "近侧列：手舟骨、月骨、三角骨、豌豆骨" },
      note: {
        vi: "Xương thuyền gãy nhiều nhất khi ngã chống tay. Máu nuôi nó đi từ đầu xa lên, nên gãy ở eo dễ gây hoại tử cực gần. Xương nguyệt dễ trật ra trước và đè vào ống cổ tay.",
        en: "The scaphoid is the bone most often broken in a fall on the outstretched hand. Its blood enters distally, so a waist fracture risks necrosis of the proximal pole. The lunate can dislocate forward into the carpal tunnel.",
        zh: "手舟骨是摔倒手撑地时最常骨折的腕骨。其血供自远端进入，腰部骨折易致近端缺血坏死。月骨可向前脱位压入腕管。",
      },
      ids: L(/^(left )?(scaphoid|lunate|triquetral|pisiform)$/i, BONE, 0.8, 0.95),
    },
    {
      key: "hang-duoi",
      tint: "#d98c5f",
      latin: "Os trapezium, trapezoideum, capitatum, hamatum",
      name: { vi: "Hàng dưới: thang, thê, cả, móc", en: "Distal row: trapezium, trapezoid, capitate, hamate", zh: "远侧列：大多角骨、小多角骨、头状骨、钩骨" },
      note: {
        vi: "Xương cả lớn nhất, nằm giữa. Móc xương móc và xương đậu tạo bờ trong của ống; củ xương thang và củ xương thuyền tạo bờ ngoài. Xương thang khớp yên ngựa với xương đốt bàn I, nên ngón cái đối chiếu được.",
        en: "The capitate is the largest and sits in the centre. The hook of the hamate and the pisiform form the medial wall of the tunnel; the tubercles of the trapezium and scaphoid form the lateral wall. The trapezium's saddle joint with the first metacarpal lets the thumb oppose.",
        zh: "头状骨最大，居中。钩骨钩和豌豆骨构成腕管内侧壁，大多角骨结节和手舟骨结节构成外侧壁。大多角骨与第1掌骨构成鞍状关节，使拇指能对掌。",
      },
      ids: L(/^(left )?(trapezium|trapezoid|capitate|hamate)$/i, BONE, 0.8, 0.95),
    },
    {
      key: "mac-giu",
      tint: "#9fb8a0",
      latin: "Retinaculum musculorum flexorum",
      name: { vi: "Mạc giữ gân gấp (mái ống cổ tay)", en: "Flexor retinaculum (roof of the tunnel)", zh: "屈肌支持带（腕管顶）" },
      note: {
        vi: "Dải xơ dày căng từ xương đậu và móc xương móc sang xương thuyền và xương thang. Phẫu thuật giải phóng ống cổ tay là cắt dải này.",
        en: "A thick fibrous band stretched from the pisiform and hook of hamate to the scaphoid and trapezium. Carpal tunnel release is division of this band.",
        zh: "自豌豆骨和钩骨钩横跨至手舟骨和大多角骨的坚厚纤维带。腕管松解术即切开此带。",
      },
      ids: L(/^flexor retinaculum of (left )?wrist$/i, ["sensory", "connective"]),
    },
    {
      key: "gan",
      tint: "#c9705f",
      latin: "Mm. flexor digitorum superficialis et profundus, flexor pollicis longus",
      name: { vi: "Ba cơ có gân đi trong ống", en: "The three muscles whose tendons pass through", zh: "腱穿腕管的三块肌" },
      note: {
        vi: "Gấp nông (bốn gân, lớp trước) gấp đốt giữa; gấp sâu (bốn gân, lớp sau) gấp đốt xa; gấp dài ngón cái đi riêng phía ngoài. Bao hoạt dịch chung bọc các gân này; viêm bao gân cũng làm hẹp ống.",
        en: "Superficialis (four tendons, front layer) flexes the middle phalanges; profundus (four tendons, back layer) flexes the distal phalanges; flexor pollicis longus runs separately on the lateral side. A common synovial sheath wraps them, and tenosynovitis also narrows the tunnel.",
        zh: "指浅屈肌（4腱，前层）屈中节指骨；指深屈肌（4腱，后层）屈远节指骨；拇长屈肌腱单独行于外侧。屈肌总腱鞘包裹诸腱，腱鞘炎也会使腕管变窄。",
      },
      ids: L(/^(left |right )?(flexor digitorum superficialis|flexor digitorum profundus|flexor pollicis longus)$/i, MU, 0.85, 1.05),
    },
    {
      key: "ngoai-ong",
      tint: "#b58bc4",
      latin: "M. flexor carpi radialis · M. palmaris longus · M. flexor carpi ulnaris",
      name: { vi: "Gân nằm ngoài ống", en: "Tendons outside the tunnel", zh: "腕管外的肌腱" },
      note: {
        vi: "Gan tay dài đi nông trên mạc giữ gân gấp và là mốc tìm dây giữa ngay dưới nó; khoảng 14% người không có cơ này. Gấp cổ tay quay đi trong một ngăn riêng. Gấp cổ tay trụ bám xương đậu.",
        en: "Palmaris longus runs superficial to the retinaculum and marks the median nerve just beneath it; about 14% of people lack it. Flexor carpi radialis runs in its own compartment. Flexor carpi ulnaris inserts on the pisiform.",
        zh: "掌长肌行于屈肌支持带浅面，其下方即正中神经；约14%的人缺如。桡侧腕屈肌行于独立的鞘内；尺侧腕屈肌止于豌豆骨。",
      },
      ids: L(/^(left |right )?(flexor carpi radialis|palmaris longus)$|head of (left |right )?flexor carpi ulnaris$/i, MU, 0.85, 1.1),
    },
    {
      key: "dm-tru",
      tint: OXY,
      latin: "A. ulnaris · A. radialis",
      name: { vi: "Động mạch trụ và quay ở cổ tay", en: "Ulnar and radial arteries at the wrist", zh: "腕部尺动脉与桡动脉" },
      note: {
        vi: "Động mạch trụ đi nông trên mạc giữ gân gấp, cạnh xương đậu, trong ống Guyon cùng dây trụ. Động mạch quay nằm ngoài gân gấp cổ tay quay, là chỗ bắt mạch quay.",
        en: "The ulnar artery passes superficial to the retinaculum beside the pisiform, in Guyon's canal with the ulnar nerve. The radial artery lies lateral to the flexor carpi radialis tendon — the site of the radial pulse.",
        zh: "尺动脉在豌豆骨旁行于屈肌支持带浅面，与尺神经同在Guyon管内。桡动脉位于桡侧腕屈肌腱外侧，是桡动脉搏动触诊处。",
      },
      ids: L(/^(left |right )?(ulnar|radial) artery$/i, ART, 0.8, 1.2),
    },
    {
      key: "xuong-dai",
      latin: "Radius · Ulna · Ossa metacarpi",
      name: { vi: "Xương quay, trụ, đốt bàn (mốc)", en: "Radius, ulna, metacarpals (landmarks)", zh: "桡骨、尺骨、掌骨（标志）" },
      note: {
        vi: "Mờ sẵn để hai hàng xương cổ tay nổi rõ.",
        en: "Faded so the two carpal rows stand out.",
        zh: "淡化，使两列腕骨突出。",
      },
      ids: L(/^(left )?(radius|ulna|(first|second|third|fourth|fifth) metacarpal bone)$/i, BONE),
    },
  ],
});

// ─────────────── 8. Cung động mạch gan tay (đổi chủ đề) ───────────────
emit({
  file: "palmar-arches",
  script: "batch-a",
  exportName: "palmarArchesScene",
  header: 'Scene "Cung động mạch gan tay và mạch bàn tay" dựng từ bộ atlas BodyParts3D.\n\nThay bài "Đám rối cánh tay" cũ: atlas không có thần kinh ngoại biên chi trên.',
  scene: {
    slug: "dam-roi-canh-tay",
    system: "cardiovascular",
    title: { vi: "Cung động mạch gan tay và mạch bàn tay", en: "Palmar Arches and Vessels of the Hand", zh: "掌动脉弓与手部血管" },
    latin: "Arcus palmaris superficialis et profundus",
    intro: {
      vi: "Bàn tay nhận máu từ hai động mạch quay và trụ, nối nhau thành hai cung gan tay. Cung nông chủ yếu từ động mạch trụ, nằm ngang mức mép ngón cái dạng tối đa. Cung sâu chủ yếu từ động mạch quay, cao hơn khoảng 1cm. Từ hai cung tách ra các động mạch gan ngón chung và riêng. Nhờ hai nguồn nối nhau, tắc một động mạch vẫn còn nguồn kia nuôi tay; nghiệm pháp Allen kiểm tra điều này trước khi lấy động mạch quay. Mỗi cung một sắc đỏ, tĩnh mạch xanh, xương mờ.",
      en: "The hand is fed by the radial and ulnar arteries, which join to form two palmar arches. The superficial arch comes mainly from the ulnar artery and lies level with the web of the fully abducted thumb. The deep arch comes mainly from the radial artery and lies about 1cm higher. From the arches arise the common and proper palmar digital arteries. Because two sources join, blocking one still leaves the other to feed the hand; the Allen test checks this before the radial artery is harvested. Each arch has its own shade of red, veins are blue and bones faded.",
      zh: "手部由桡、尺动脉供血，二者吻合成两个掌弓。掌浅弓主要来自尺动脉，平拇指充分外展时的指蹼；掌深弓主要来自桡动脉，高约1cm。两弓发出指掌侧总动脉和指掌侧固有动脉。由于双源吻合，一支阻塞仍有另一支供血；取桡动脉前用Allen试验检查。每弓一种红色调，静脉蓝色，骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["nong", "sau", "ngon", "mu", "tm"],
  groups: [
    {
      key: "nguon",
      tint: "#8f2d2d",
      latin: "A. radialis · A. ulnaris",
      name: { vi: "Động mạch quay và trụ (đoạn cổ tay)", en: "Radial and ulnar arteries (wrist segment)", zh: "桡动脉与尺动脉（腕段）" },
      note: {
        vi: "Động mạch trụ đi thẳng vào gan tay thành cung nông. Động mạch quay vòng ra mu tay qua hõm lào giải phẫu, xuyên khoang gian đốt bàn I rồi vào gan tay thành cung sâu.",
        en: "The ulnar artery runs straight into the palm as the superficial arch. The radial artery winds to the back of the hand through the anatomical snuffbox, pierces the first intermetacarpal space and enters the palm as the deep arch.",
        zh: "尺动脉直入手掌成为掌浅弓。桡动脉经解剖学鼻烟窝绕至手背，穿第1掌骨间隙进入手掌形成掌深弓。",
      },
      ids: L(/^(left |right )?(radial|ulnar) artery$/i, ART, 0.8, 1.1),
    },
    {
      key: "nong",
      tint: OXY,
      latin: "Arcus palmaris superficialis · Aa. digitales palmares communes",
      name: { vi: "Cung gan tay nông và động mạch gan ngón chung", en: "Superficial palmar arch and common palmar digital arteries", zh: "掌浅弓与指掌侧总动脉" },
      note: {
        vi: "Nằm ngay dưới cân gan tay, trên các gân gấp. Cho ba hoặc bốn động mạch gan ngón chung, mỗi động mạch chia đôi ở mép ngón.",
        en: "Lies just under the palmar aponeurosis, over the flexor tendons. It gives three or four common palmar digital arteries, each dividing at a finger web.",
        zh: "位于掌腱膜深面、屈肌腱浅面，发出3–4条指掌侧总动脉，各在指蹼处分叉。",
      },
      ids: L(/superficial palmar arterial arch$|common palmar digital artery$/i, ART, 0.78, 0.9),
    },
    {
      key: "sau",
      tint: "#e8883d",
      latin: "Arcus palmaris profundus · Aa. metacarpales palmares",
      name: { vi: "Cung gan tay sâu và nhánh", en: "Deep palmar arch and its branches", zh: "掌深弓及其分支" },
      note: {
        vi: "Nằm sâu dưới gân gấp, trên nền xương đốt bàn. Cho động mạch gan đốt bàn, động mạch chính ngón cái và động mạch quay ngón trỏ.",
        en: "Lies deep to the flexor tendons on the metacarpal bases. It gives the palmar metacarpal arteries, the princeps pollicis and the radialis indicis.",
        zh: "位于屈肌腱深面、掌骨底上，发出掌心动脉、拇主要动脉和示指桡侧动脉。",
      },
      ids: L(/deep palmar arch$|palmar metacarpal artery$|arteria princeps pollicis$|arteria radialis indicis$/i, ART, 0.8, 0.9),
    },
    {
      key: "ngon",
      tint: "#e39a7a",
      latin: "Aa. digitales palmares propriae",
      name: { vi: "Động mạch gan ngón riêng", en: "Proper palmar digital arteries", zh: "指掌侧固有动脉" },
      note: {
        vi: "Mỗi ngón có hai động mạch chạy dọc hai bờ bên. Vì vậy gây tê gốc ngón phải tiêm cả hai bên.",
        en: "Each finger has two, running along its sides. That is why a digital block is injected on both sides.",
        zh: "每指两条，沿两侧缘走行，故指根阻滞需两侧注射。",
      },
      ids: L(/proper palmar digital artery of (left )?\w+ (finger)$|arteria radialis indicis$/i, ART, 0.72, 0.8),
    },
    {
      key: "mu",
      tint: "#b03a48",
      latin: "Rete carpale dorsale · Aa. metacarpales dorsales",
      name: { vi: "Mạng mạch mu cổ tay và mu tay", en: "Dorsal carpal network and dorsal metacarpal arteries", zh: "腕背网与掌背动脉" },
      note: {
        vi: "Nhánh mu cổ tay của động mạch quay và trụ tạo mạng mu cổ tay. Từ đó tách ra động mạch mu đốt bàn và mu ngón.",
        en: "The dorsal carpal branches of the radial and ulnar arteries form the dorsal carpal network, which gives the dorsal metacarpal and dorsal digital arteries.",
        zh: "桡、尺动脉腕背支构成腕背网，发出掌背动脉和指背动脉。",
      },
      ids: L(/dorsal carpal branch of (left |right )?(radial|ulnar) artery$|^(left )?dorsal carpal branch of ulnar artery$|^set of dorsal (metacarpal|digital) arteries$/i, ART, 0.76, 0.9),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Arcus venosi palmares · Rete venosum dorsale manus",
      name: { vi: "Tĩnh mạch bàn tay", en: "Veins of the hand", zh: "手部静脉" },
      note: {
        vi: "Cung tĩnh mạch gan tay nông và sâu đi kèm hai cung động mạch. Phần lớn máu bàn tay dồn ra mạng tĩnh mạch mu tay, là gốc của tĩnh mạch đầu và tĩnh mạch nền. Vì thế mu tay là chỗ đặt kim truyền quen thuộc.",
        en: "Superficial and deep palmar venous arches accompany the arterial arches. Most blood from the hand drains to the dorsal venous network, the origin of the cephalic and basilic veins. That is why the back of the hand is a familiar cannulation site.",
        zh: "掌浅、深静脉弓伴行两动脉弓。手部大部分血液汇入手背静脉网，为头静脉和贵要静脉的起源，故手背是常用的输液穿刺部位。",
      },
      ids: L(/palmar venous arch$|dorsal venous network of (left )?hand$|palmar metacarpal vein$|palmar digital vein/i, VEN, 0.72, 0.92),
    },
    {
      key: "xuong",
      latin: "Ossa carpi, metacarpi, phalanges",
      name: { vi: "Xương bàn tay (mốc)", en: "Bones of the hand (landmarks)", zh: "手骨（标志）" },
      note: {
        vi: "Mờ sẵn để hai cung nổi lên trên nền xương đốt bàn.",
        en: "Faded so the arches stand out against the metacarpals.",
        zh: "淡化，使两弓在掌骨背景上突出。",
      },
      ids: L(/^(left )?(scaphoid|lunate|triquetral|pisiform|trapezium|trapezoid|capitate|hamate|(first|second|third|fourth|fifth) metacarpal bone)$|phalanx of (left )?\w+( finger)?$/i, BONE, 0.7, 0.95),
    },
  ],
});
