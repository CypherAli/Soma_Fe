import type { VetFact } from "../types";

/**
 * HỆ CƠ CỦA THÚ NHỎ — mười nhóm cơ đọc được trên mẫu vật lột da.
 *
 * VÌ SAO CÓ TỆP NÀY. Mẫu écorché mèo (westerly, CC BY) là một khối quét liền:
 * chỉ MỘT vật liệu, và tách theo mảnh rời thì ra 9.050 mảnh vụn của phép quét
 * chứ không phải từng cơ. Nghĩa là không thể bấm chọn từng cơ như bên người.
 *
 * Thứ vẫn làm được, và là cách các atlas giấy vẫn dùng suốt trăm năm: ĐÁNH SỐ
 * TRÊN HÌNH. Mỗi nhóm cơ dưới đây gắn với một điểm toạ độ trên mẫu vật (khai ở
 * `softTissue.ts`, dò bằng `scripts/vet/hotspot_probe.py`), bấm vào là ra tên
 * NAV và nội dung. Chọn đúng mười nhóm ĐỌC ĐƯỢC TỪ NGOÀI trên tư thế đứng —
 * không liệt kê cơ nằm sâu mà mẫu vật không cho thấy, vì chỉ vào chỗ không nhìn
 * thấy gì thì người học không kiểm chứng được.
 *
 * Nội dung viết cho CẢ chó và mèo khi cấu trúc giống nhau, và phần `compare`
 * nói rõ chỗ mèo khác chó — đó là lý do tồn tại của khu thú y.
 *
 * Nguồn: König & Liebich 7th ed. (2020) · Evans & de Lahunta, Miller's Anatomy
 * of the Dog 4th ed. (2013) · Dyce, Sack & Wensing 5th ed. (2018). Thuật ngữ
 * Latin theo NAV 6th ed. (2017).
 */

const KL = "König & Liebich, Veterinary Anatomy of Domestic Mammals, 7th ed. (2020)";
const MILLER = "Evans & de Lahunta, Miller's Anatomy of the Dog, 4th ed. (2013)";
const DYCE = "Dyce, Sack & Wensing, Textbook of Veterinary Anatomy, 5th ed. (2018)";

export const muscleFacts: VetFact[] = [
  {
    id: "dogcat-brachiocephalicus",
    species: ["dog", "cat"],
    system: "muscular",
    region: "neck",
    name: {
      vi: "Cơ cánh tay – đầu",
      en: "Brachiocephalic muscle",
      zh: "臂头肌",
    },
    nav: "M. brachiocephalicus",
    note: {
      vi: "Dải cơ dài chạy từ xương cánh tay lên đầu và cổ, tạo nên đường gờ nổi rõ nhất ở mặt bên cổ. Ở thú bốn chân nó gồm hai phần nối nhau bằng một vạch gân ngang (clavicular intersection) — chính là di tích của xương đòn đã tiêu biến. Khi chi trước tì đất, cơ kéo đầu và cổ nghiêng sang bên; khi chi trước đưa lên, nó đẩy chi ra trước.",
      en: "A long strap running from the humerus up to the head and neck, forming the most prominent ridge on the side of the neck. In quadrupeds it consists of two portions joined by a transverse clavicular intersection — the remnant of the vanished clavicle. With the forelimb planted it draws the head and neck laterally; with the limb raised it protracts the limb.",
      zh: "自肱骨延至头颈的长带状肌，构成颈侧最明显的隆起。四足动物中该肌由两部分经横行的锁骨腱划相连——即退化锁骨的遗迹。前肢着地时牵引头颈侧偏；前肢抬起时则前伸该肢。",
    },
    compare: {
      vi: "Ở người phần tương ứng tách hẳn thành cơ ức–đòn–chũm và cơ thang, vì xương đòn của người còn nguyên và làm chỗ bám thật. Chó mèo mất xương đòn nên hai phần dính liền thành một dải duy nhất — đó là lý do chi trước thú bốn chân nối với thân chỉ bằng cơ, không bằng khớp xương.",
      en: "In humans the equivalent splits into sternocleidomastoid and trapezius because the human clavicle persists and gives a real bony attachment. Dog and cat have lost the clavicle, so the two parts remain fused into a single strap — this is why the quadruped forelimb attaches to the trunk by muscle alone, with no bony joint.",
      zh: "人类因锁骨完整并提供真正的骨性附着，相应结构分化为胸锁乳突肌与斜方肌。犬猫锁骨退化，两部分融合为单一肌带——这正是四足动物前肢仅以肌肉、而非骨关节与躯干相连的原因。",
    },
    clinical: {
      vi: "Rãnh cảnh (sulcus jugularis) nằm ngay dưới bờ bụng của cơ này — đây là mốc sờ để lấy máu tĩnh mạch cảnh, thao tác thường quy ở mèo và chó nhỏ khi tĩnh mạch chi quá bé. Bấm nhẹ đầu dưới rãnh cho tĩnh mạch nổi rồi đâm kim theo hướng về đầu.",
      en: "The jugular groove lies immediately ventral to the ventral border of this muscle — the palpation landmark for jugular venepuncture, routine in cats and small dogs whose limb veins are too small. Occlude the groove at its lower end to raise the vein, then direct the needle towards the head.",
      zh: "颈静脉沟紧位于该肌腹侧缘之下，是颈静脉采血的触诊标志；猫与小型犬四肢静脉过细时常规采用此法。于沟下端压迫使静脉充盈，再朝头侧进针。",
    },
    source: KL,
    keys: ["co canh tay dau", "brachiocephalicus", "ranh canh", "jugular groove", "lay mau tinh mach canh"],
  },
  {
    id: "dogcat-trapezius",
    species: ["dog", "cat"],
    system: "muscular",
    region: "trunk",
    name: { vi: "Cơ thang", en: "Trapezius", zh: "斜方肌" },
    nav: "M. trapezius",
    note: {
      vi: "Cơ mỏng hình tam giác phủ vùng u vai, bám từ dây chằng gáy và các mỏm gai đốt sống ngực xuống gai xương bả vai. Chia hai phần cổ và ngực. Nhiệm vụ là nâng và giữ xương bả vai áp vào thành ngực — nó là một trong những dây treo giữ cả chi trước vào thân.",
      en: "A thin triangular sheet over the withers, running from the nuchal ligament and thoracic spinous processes down to the scapular spine. It has cervical and thoracic parts. Its job is to elevate the scapula and hold it against the chest wall — one of the slings by which the whole forelimb hangs from the trunk.",
      zh: "覆于鬐甲部的薄三角形肌片，起自项韧带与胸椎棘突，止于肩胛冈，分颈部与胸部两部。作用为提升肩胛骨并使其贴附胸壁——是悬吊整个前肢于躯干的吊带之一。",
    },
    compare: {
      vi: "Ở người cơ thang kéo xương bả và xương đòn, và vì người đứng hai chân nên nó chủ yếu chống lại trọng lượng cánh tay treo xuống. Ở chó mèo nó là thành phần của BỘ MÁY TREO NGỰC: chi trước không có khớp với thân, toàn bộ trọng lượng phần trước cơ thể truyền qua các cơ này chứ không qua xương.",
      en: "In humans the trapezius moves scapula and clavicle, and because we stand bipedally it mainly resists the hanging weight of the arm. In dog and cat it is part of the thoracic sling: the forelimb has no joint with the trunk, so the entire weight of the forequarters passes through these muscles rather than through bone.",
      zh: "人的斜方肌牵动肩胛骨与锁骨，因直立行走主要对抗上肢下垂之重量。犬猫的斜方肌则是胸廓吊带的组成部分：前肢与躯干无关节相连，前躯全部体重经由这些肌肉而非骨骼传递。",
    },
    clinical: {
      vi: "Vùng cơ thang và dưới da giữa hai bả vai là chỗ tiêm dưới da quy ước ở chó mèo vì da ở đây lỏng và nhấc lên được. Tuy nhiên với mèo, hướng dẫn hiện nay khuyên KHÔNG tiêm vaccine ở vùng này mà chuyển xuống phần xa của chi, vì sarcoma tại chỗ tiêm ở mèo nếu mọc giữa hai bả vai thì gần như không cắt hết được.",
      en: "The trapezius region and the loose skin between the shoulder blades is the conventional subcutaneous injection site in dogs and cats, because the skin here lifts freely. For cats, however, current guidance is NOT to give vaccines here but distally on a limb: a feline injection-site sarcoma arising between the scapulae is very nearly impossible to excise completely.",
      zh: "斜方肌区及两肩胛间的松弛皮肤是犬猫常规皮下注射部位，因该处皮肤易于提起。但对猫，现行指南主张疫苗不在此处注射而改于肢体远端：猫注射部位肉瘤若发生于肩胛间，几乎无法完整切除。",
    },
    source: MILLER,
    keys: ["co thang", "trapezius", "bo may treo nguc", "thoracic sling", "tiem duoi da"],
  },
  {
    id: "dogcat-deltoideus",
    species: ["dog", "cat"],
    system: "muscular",
    region: "forelimb",
    name: { vi: "Cơ delta", en: "Deltoid muscle", zh: "三角肌" },
    nav: "M. deltoideus",
    note: {
      vi: "Cơ phủ mặt ngoài khớp vai, bám từ gai xương bả vai và mỏm cùng vai xuống lồi củ delta của xương cánh tay. Ở chó mèo cơ có hai phần: phần gai (pars scapularis) và phần mỏm cùng (pars acromialis). Nhiệm vụ chính là gấp khớp vai và xoay xương cánh tay ra ngoài.",
      en: "Covers the lateral aspect of the shoulder joint, arising from the scapular spine and acromion and inserting on the deltoid tuberosity of the humerus. In dog and cat it has two parts — pars scapularis and pars acromialis. Its main action is to flex the shoulder and rotate the humerus laterally.",
      zh: "覆盖肩关节外侧，起自肩胛冈与肩峰，止于肱骨三角肌粗隆。犬猫的三角肌分肩胛部与肩峰部两部。主要作用为屈肩关节并使肱骨外旋。",
    },
    compare: {
      vi: "Cơ delta người có ba phần và bám cả vào xương đòn, nên nâng được cánh tay lên ngang vai và cao hơn — cử động mà chó mèo không làm được. Chó mèo mất xương đòn nên phần đòn của cơ delta cũng mất, biên độ vai vì thế gần như chỉ còn gấp – duỗi trong mặt phẳng đứng dọc.",
      en: "The human deltoid has three parts and also attaches to the clavicle, which is what allows the arm to be abducted to shoulder height and beyond — a movement dog and cat cannot perform. Having lost the clavicle they also lost the clavicular part, so shoulder excursion is essentially limited to flexion and extension in the sagittal plane.",
      zh: "人的三角肌分三部并附着于锁骨，故上肢可外展至肩高以上——此动作犬猫无法完成。犬猫锁骨退化，三角肌锁骨部亦随之消失，肩关节活动基本限于矢状面的屈伸。",
    },
    clinical: {
      vi: "Thần kinh nách (n. axillaris) chi phối cơ này chạy vòng quanh cổ xương cánh tay, nên trật khớp vai hoặc gãy đầu gần xương cánh tay dễ làm tổn thương nó. Dấu hiệu là con vật không gấp được vai và teo cơ vùng delta thấy rõ sau vài tuần.",
      en: "The axillary nerve supplying this muscle winds around the neck of the humerus, so shoulder luxation or a proximal humeral fracture readily injures it. The sign is loss of shoulder flexion, with visible wasting over the deltoid region within a few weeks.",
      zh: "支配该肌的腋神经绕肱骨颈走行，故肩关节脱位或肱骨近端骨折易致其损伤。表现为肩关节不能屈曲，数周内三角肌区可见明显萎缩。",
    },
    source: KL,
    keys: ["co delta", "deltoideus", "than kinh nach", "axillary nerve", "trat khop vai"],
  },
  {
    id: "dogcat-triceps-brachii",
    species: ["dog", "cat"],
    system: "muscular",
    region: "forelimb",
    name: { vi: "Cơ tam đầu cánh tay", en: "Triceps brachii", zh: "肱三头肌" },
    nav: "M. triceps brachii",
    note: {
      vi: "Khối cơ lớn nhất của chi trước, chiếm gần trọn góc giữa xương bả vai và xương cánh tay. Gồm bốn đầu ở chó mèo (dài, ngoài, trong, phụ) — đầu dài bám vào bờ sau xương bả vai, ba đầu còn lại bám vào xương cánh tay; tất cả tụ về mỏm khuỷu. Nhiệm vụ là duỗi khớp khuỷu và chống đỡ trọng lượng khi chi tì đất.",
      en: "The largest muscle mass of the forelimb, filling most of the angle between scapula and humerus. Dog and cat have four heads (long, lateral, medial, accessory) — the long head from the caudal border of the scapula, the others from the humerus; all converge on the olecranon. It extends the elbow and props the limb against body weight in stance.",
      zh: "前肢最大的肌块，几乎充满肩胛骨与肱骨之间的夹角。犬猫有四个头（长头、外侧头、内侧头、副头）——长头起自肩胛骨后缘，其余起自肱骨，共同止于鹰嘴。作用为伸肘并在站立负重时支撑该肢。",
    },
    compare: {
      vi: "Người có ba đầu, chó mèo có bốn — thêm đầu phụ (caput accessorium). Khác biệt quan trọng hơn là chức năng: ở người cơ tam đầu chỉ duỗi khuỷu, ở thú bốn chân nó phải GIỮ khuỷu khỏi gập lại dưới sức nặng cơ thể suốt thời gian đứng, nên khối cơ to hơn hẳn so với tỉ lệ cơ thể.",
      en: "Humans have three heads, dog and cat four — the extra one is the accessory head. The more important difference is functional: in humans the triceps merely extends the elbow, whereas in a quadruped it must hold the elbow from collapsing under body weight throughout standing, so the muscle mass is proportionally far larger.",
      zh: "人有三个头，犬猫有四个——多出副头。更重要的差异在功能：人的肱三头肌仅伸肘，而四足动物需在整个站立过程中防止肘关节在体重下塌陷，故其肌块比例明显更大。",
    },
    clinical: {
      vi: "Liệt thần kinh quay đoạn cao làm mất chức năng cơ này: con vật không duỗi được khuỷu, chi khuỵu xuống và mu bàn chân quét đất khi đi. Phân biệt với liệt quay đoạn thấp — đoạn thấp vẫn duỗi được khuỷu, chỉ mất duỗi cổ chân và ngón.",
      en: "High radial nerve paralysis abolishes this muscle: the animal cannot extend the elbow, the limb buckles and the dorsum of the paw is dragged along the ground. Distinguish it from low radial paralysis, in which elbow extension is preserved and only carpal and digital extension are lost.",
      zh: "高位桡神经麻痹使该肌功能丧失：动物不能伸肘，患肢塌陷，行走时以爪背拖地。须与低位桡神经麻痹鉴别——后者伸肘功能保留，仅丧失腕与指的伸展。",
    },
    source: MILLER,
    keys: ["co tam dau", "triceps", "than kinh quay", "radial nerve", "liet quay"],
  },
  {
    id: "dogcat-latissimus-dorsi",
    species: ["dog", "cat"],
    system: "muscular",
    region: "trunk",
    name: { vi: "Cơ lưng rộng", en: "Latissimus dorsi", zh: "背阔肌" },
    nav: "M. latissimus dorsi",
    note: {
      vi: "Tấm cơ rộng hình quạt phủ thành ngực bên, bám gốc vào cân ngực–thắt lưng và các xương sườn cuối, hội tụ thành một gân dẹt bám vào lồi củ tròn lớn mặt trong xương cánh tay. Cơ kéo chi trước về sau và về sát thân; khi chi tì đất thì nó kéo THÂN tiến về phía trước — đây mới là vai trò chính lúc chạy.",
      en: "A broad fan over the lateral chest wall, arising from the thoracolumbar fascia and last ribs and converging into a flat tendon on the teres major tuberosity of the medial humerus. It draws the forelimb caudally and towards the body; with the limb planted it instead pulls the TRUNK forwards — its principal role in locomotion.",
      zh: "覆于胸侧壁的宽阔扇形肌，起自胸腰筋膜与后位肋骨，汇成扁腱止于肱骨内侧的大圆肌粗隆。作用为向后并向内牵引前肢；当前肢着地时则牵引躯干前移——这才是奔跑时的主要作用。",
    },
    compare: {
      vi: "Cùng tên cùng chỗ bám như ở người, nhưng nhiệm vụ đảo ngược: người dùng nó để kéo cánh tay xuống (leo trèo, bơi), thú bốn chân dùng nó để kéo thân qua chi đang tì đất. Ở mèo cơ này mỏng và dài hơn chó — phù hợp với biên độ vươn mình lớn khi chạy nước rút và khi leo.",
      en: "Same name and same attachments as in humans, but the task is reversed: humans use it to pull the arm down (climbing, swimming), the quadruped uses it to pull the trunk over the planted limb. In the cat it is thinner and longer than in the dog, matching the greater trunk extension used in sprinting and climbing.",
      zh: "名称与附着与人相同，但功用相反：人用以下拉上肢（攀爬、游泳），四足动物则用以将躯干拉过着地的前肢。猫的背阔肌较犬更薄更长，与其冲刺及攀爬时更大的躯干伸展幅度相称。",
    },
    clinical: {
      vi: "Bờ sau của cơ là mốc rạch da chuẩn cho phẫu thuật mở lồng ngực khoang liên sườn: đường rạch đi ngay sau bờ cơ để tách cơ ra trước chứ không cắt qua. Cơ này cũng hay được dùng làm vạt cơ có cuống che khuyết hổng thành ngực rộng.",
      en: "Its caudal border is the standard skin-incision landmark for intercostal thoracotomy: the incision runs just behind the border so the muscle is retracted forwards rather than cut. It is also a common pedicled muscle flap for covering large chest-wall defects.",
      zh: "其后缘是肋间开胸术皮肤切口的标准标志：切口紧沿后缘，使该肌向前牵开而非切断。该肌亦常用作带蒂肌瓣以修补胸壁大面积缺损。",
    },
    source: DYCE,
    keys: ["co lung rong", "latissimus", "mo long nguc", "thoracotomy", "vat co"],
  },
  {
    id: "dogcat-obliquus-externus",
    species: ["dog", "cat"],
    system: "muscular",
    region: "trunk",
    name: {
      vi: "Cơ chéo bụng ngoài",
      en: "External abdominal oblique",
      zh: "腹外斜肌",
    },
    nav: "M. obliquus externus abdominis",
    note: {
      vi: "Lớp ngoài cùng trong bốn lớp cơ thành bụng. Bám gốc bằng những mấu răng cưa vào mặt ngoài các xương sườn — chính hàng răng cưa này nhìn thấy rõ trên mẫu vật lột da — rồi chạy chếch xuống dưới và về sau, tận cùng bằng một cân rộng góp phần tạo đường trắng. Sợi cơ hướng từ trên–trước xuống dưới–sau.",
      en: "The outermost of the four abdominal wall layers. It arises by serrated digitations from the outer surface of the ribs — the row of serrations clearly visible on an écorché — then runs obliquely caudoventrally and ends in a broad aponeurosis contributing to the linea alba. Its fibres run cranio-dorsal to caudo-ventral.",
      zh: "腹壁四层肌中最外层。以锯齿状肌齿起自肋骨外面——去皮标本上清晰可见的锯齿列即此——继而斜向后下走行，终于宽阔腱膜并参与构成白线。肌纤维方向为前上至后下。",
    },
    compare: {
      vi: "Cùng hướng sợi như ở người, nhưng gánh nặng khác hẳn: bụng người treo theo chiều dọc còn bụng thú bốn chân treo ngang như chiếc võng, nên bốn lớp cơ bụng phải chịu lực kéo liên tục của toàn bộ nội tạng. Đó là lý do thoát vị thành bụng ở chó mèo hay xảy ra sau chấn thương hơn là do yếu cơ đơn thuần.",
      en: "The fibre direction is the same as in humans, but the load is quite different: the human abdomen hangs vertically whereas the quadruped abdomen hangs sideways like a hammock, so the four layers carry the continuous pull of the whole viscera. This is why abdominal wall hernias in dog and cat follow trauma more often than simple muscular weakness.",
      zh: "肌纤维方向与人相同，但受力迥异：人的腹部纵向悬垂，四足动物的腹部则如吊床般横向悬挂，四层腹肌须持续承受全部内脏的牵拉。故犬猫腹壁疝多继发于外伤，而非单纯肌力不足。",
    },
    clinical: {
      vi: "Cân của cơ này tạo nên vòng bẹn nông — nơi thoát vị bẹn đi qua, và ở chó đực là đường đi của thừng tinh. Đường mổ sườn bên (flank approach) khi triệt sản mèo cái đi xuyên qua đúng cơ này: tách theo hướng sợi chứ không cắt ngang thì thành bụng liền tốt hơn nhiều.",
      en: "Its aponeurosis forms the superficial inguinal ring — the exit of inguinal hernias and, in the male dog, the route of the spermatic cord. The flank approach for feline ovariectomy passes through this very muscle: splitting it along its fibres rather than cutting across them gives a far sounder body wall.",
      zh: "其腱膜构成腹股沟浅环——腹股沟疝的出口，在公犬亦为精索通路。母猫卵巢摘除的肋腹入路正穿经此肌：顺纤维方向钝性分离而非横断，腹壁愈合远为牢固。",
    },
    source: KL,
    keys: ["co cheo bung ngoai", "external oblique", "vong ben", "inguinal ring", "trien san meo duong suon"],
  },
  {
    id: "dogcat-gluteus-medius",
    species: ["dog", "cat"],
    system: "muscular",
    region: "hindlimb",
    name: { vi: "Cơ mông giữa", en: "Middle gluteal muscle", zh: "臀中肌" },
    nav: "M. gluteus medius",
    note: {
      vi: "Cơ mông lớn nhất và khoẻ nhất ở chó mèo, phủ mặt ngoài cánh xương chậu và bám vào mấu chuyển lớn xương đùi. Nó duỗi khớp háng và dạng chi — là cơ sinh lực đẩy chính khi bật nhảy và khi tăng tốc. Ở thú bốn chân cơ mông giữa lớn hơn cơ mông nông, ngược hẳn với người.",
      en: "The largest and strongest gluteal muscle in dog and cat, covering the lateral face of the ilial wing and inserting on the greater trochanter of the femur. It extends the hip and abducts the limb — the main propulsive muscle in jumping and acceleration. In quadrupeds the middle gluteal is larger than the superficial gluteal, the reverse of the human arrangement.",
      zh: "犬猫最大最强的臀肌，覆盖髂骨翼外面，止于股骨大转子。作用为伸髋并外展该肢——是跳跃与加速时的主要推进肌。四足动物的臀中肌大于臀浅肌，与人恰好相反。",
    },
    compare: {
      vi: "Ở người cơ mông LỚN mới là cơ mông to nhất, vì đứng hai chân cần giữ thân thẳng trên háng. Chó mèo không có nhu cầu ấy nên cơ mông nông nhỏ đi, còn cơ mông giữa phình ra để đẩy. Mèo có cơ mông giữa dày hơn chó theo tỉ lệ — đó là một phần lý do mèo bật cao gấp nhiều lần chiều cao thân.",
      en: "In humans the gluteus MAXIMUS is the largest, because bipedal stance requires the trunk to be held upright over the hip. Dog and cat have no such need, so the superficial gluteal is reduced while the middle gluteal enlarges for propulsion. The cat's middle gluteal is proportionally thicker than the dog's — part of why a cat can jump many times its own body height.",
      zh: "人以臀大肌为最大，因直立姿势需将躯干撑于髋上。犬猫无此需求，臀浅肌因而缩小，臀中肌则增大以供推进。猫的臀中肌比例上厚于犬——这是猫能跃起数倍体高的原因之一。",
    },
    clinical: {
      vi: "Khối cơ này là vị trí tiêm bắp cổ điển ở chó, nhưng phải tiêm vào phần TRƯỚC của khối, tránh xa phía sau nơi thần kinh toạ đi qua khuyết ngồi lớn — tiêm sai chỗ gây liệt toạ, con vật lê bàn chân sau. Với mèo hiện nay ưu tiên tiêm bắp ở cơ lưng thắt lưng hoặc cơ tứ đầu vì khối mông của mèo mỏng.",
      en: "This mass is the classical intramuscular injection site in the dog, but the needle must go into the CRANIAL part, well away from the sciatic nerve passing through the greater sciatic notch — a misplaced injection causes sciatic paralysis and the animal knuckles the hind paw. In cats the lumbar epaxial or quadriceps muscles are now preferred, because the feline gluteal mass is thin.",
      zh: "该肌块是犬的经典肌肉注射部位，但须注入其前部，远离经坐骨大切迹走行的坐骨神经——注射位置不当可致坐骨神经麻痹，动物后爪拖曳。猫因臀部肌块菲薄，现多首选腰背最长肌或股四头肌注射。",
    },
    source: MILLER,
    keys: ["co mong giua", "gluteus medius", "tiem bap", "than kinh toa", "sciatic"],
  },
  {
    id: "dogcat-biceps-femoris",
    species: ["dog", "cat"],
    system: "muscular",
    region: "hindlimb",
    name: { vi: "Cơ hai đầu đùi", en: "Biceps femoris", zh: "股二头肌" },
    nav: "M. biceps femoris",
    note: {
      vi: "Cơ dài nhất và nông nhất trong nhóm cơ sau đùi, tạo nên toàn bộ đường viền sau của đùi nhìn từ bên. Bám gốc ở ụ ngồi và dây chằng cùng–ngồi, toả xuống bám vào xương bánh chè, mào xương chày và qua gân gót. Duỗi háng, gấp gối và tham gia duỗi cổ chân.",
      en: "The longest and most superficial of the caudal thigh muscles, forming the entire caudal contour of the thigh in lateral view. It arises from the ischiatic tuber and sacrotuberous ligament and spreads to the patella, tibial crest and the common calcanean tendon. It extends the hip, flexes the stifle and assists hock extension.",
      zh: "股后肌群中最长最浅者，构成侧面观整个股部后缘轮廓。起自坐骨结节与骶结节韧带，分布止于髌骨、胫骨嵴及跟总腱。作用为伸髋、屈膝并协助伸跗关节。",
    },
    compare: {
      vi: "Người có cơ hai đầu đùi hai đầu (dài và ngắn); chó mèo chỉ có một đầu ở ụ ngồi và không có đầu ngắn ở xương đùi. Điểm khác đáng nói hơn là cơ ở thú bốn chân bám tới tận gân gót, nên nó nối háng với cổ chân thành một chuỗi truyền lực — cử động một khớp kéo theo khớp kia, không tách rời như ở người.",
      en: "The human biceps femoris has two heads (long and short); dog and cat have only the ischiatic head and no short femoral head. The more telling difference is that in quadrupeds the muscle reaches the calcanean tendon, linking hip to hock in a single force chain — moving one joint necessarily moves the other, unlike the more independent human arrangement.",
      zh: "人的股二头肌有长短两头；犬猫仅有坐骨头而无股骨短头。更值得注意的差异是四足动物该肌延伸至跟腱，将髋与跗连成一条力链——一个关节的活动必然牵动另一个，不似人的相对独立。",
    },
    clinical: {
      vi: "Thần kinh toạ chạy sát mặt sâu của cơ này, nên đây là đường vào chuẩn để bộc lộ thần kinh toạ khi nối thần kinh hoặc khi phong bế. Bờ trước của cơ cũng là mốc để sờ tìm gân gót và đánh giá đứt gân gót — chấn thương hay gặp ở chó chạy nhiều.",
      en: "The sciatic nerve runs immediately deep to this muscle, making it the standard approach for exposing the nerve for repair or for a regional block. Its cranial border is also the landmark for palpating the common calcanean tendon and assessing rupture — a frequent injury in active working dogs.",
      zh: "坐骨神经紧贴该肌深面走行，故此处是显露坐骨神经以行修补或神经阻滞的标准入路。其前缘亦为触诊跟总腱及判断其断裂的标志——此损伤在活动量大的工作犬中常见。",
    },
    source: KL,
    keys: ["co hai dau dui", "biceps femoris", "gan got", "calcanean tendon", "than kinh toa"],
  },
  {
    id: "dogcat-quadriceps",
    species: ["dog", "cat"],
    system: "muscular",
    region: "hindlimb",
    name: { vi: "Cơ tứ đầu đùi", en: "Quadriceps femoris", zh: "股四头肌" },
    nav: "M. quadriceps femoris",
    note: {
      vi: "Khối cơ mặt trước đùi gồm bốn phần: cơ thẳng đùi bám ở xương chậu, ba cơ rộng bám quanh thân xương đùi. Cả bốn tụ vào một gân chung ôm lấy xương bánh chè rồi bám vào mào xương chày. Đây là cơ duỗi gối duy nhất — không có cơ nào thay thế được nó.",
      en: "The mass on the cranial thigh, of four parts: rectus femoris from the pelvis and three vasti from the shaft of the femur. All four converge on a common tendon that encloses the patella and inserts on the tibial crest. It is the sole extensor of the stifle — no other muscle can substitute for it.",
      zh: "股前部肌块，由四部分组成：起自骨盆的股直肌与起自股骨体的三块股肌。四者汇成包绕髌骨的总腱，止于胫骨嵴。此为膝关节唯一的伸肌——无其他肌肉可代偿。",
    },
    compare: {
      vi: "Cấu tạo giống người, nhưng ở chó mèo khớp gối luôn hơi gấp khi đứng chứ không duỗi thẳng khoá lại như đầu gối người. Nghĩa là cơ tứ đầu phải co giữ liên tục suốt thời gian đứng — thú bốn chân không có cơ chế 'khoá gối' tiết kiệm sức như người, còn ngựa thì có (bộ máy đứng).",
      en: "Structurally as in humans, but in dog and cat the stifle is always somewhat flexed in stance rather than locked straight as the human knee is. The quadriceps must therefore contract continuously throughout standing — these species have no energy-saving knee-locking mechanism, unlike the horse with its stay apparatus.",
      zh: "结构与人相同，但犬猫站立时膝关节始终略屈，不似人膝可伸直锁定。故股四头肌在整个站立期间须持续收缩——此类动物无人类式的省力锁膝机制，而马则具备（站立装置）。",
    },
    clinical: {
      vi: "Co rút cơ tứ đầu (quadriceps contracture) là biến chứng đáng sợ sau gãy xương đùi ở chó con: cơ dính vào ổ gãy, gối bị khoá ở tư thế duỗi cứng và chi thành vô dụng. Phòng bằng cách vận động sớm sau kết hợp xương chứ không bó bột bất động lâu.",
      en: "Quadriceps contracture is the feared complication of femoral fracture in puppies: the muscle adheres to the fracture callus, the stifle locks in rigid extension and the limb becomes useless. Prevention is early mobilisation after fixation, not prolonged immobilisation in a cast.",
      zh: "股四头肌挛缩是幼犬股骨骨折的可怕并发症：肌肉与骨痂粘连，膝关节被锁定于强直伸展位，患肢丧失功能。预防在于内固定后早期活动，而非长期石膏制动。",
    },
    source: MILLER,
    keys: ["co tu dau", "quadriceps", "co rut co tu dau", "contracture", "gay xuong dui"],
  },
  {
    id: "dogcat-gastrocnemius",
    species: ["dog", "cat"],
    system: "muscular",
    region: "hindlimb",
    name: { vi: "Cơ bụng chân", en: "Gastrocnemius", zh: "腓肠肌" },
    nav: "M. gastrocnemius",
    note: {
      vi: "Cơ tạo nên khối bắp chân, có hai đầu bám vào hai lồi trên lồi cầu xương đùi và tận cùng bằng phần lớn nhất của gân gót chung bám vào mỏm gót. Duỗi cổ chân và gấp gối. Trong mỗi đầu cơ thường có một xương vừng nhỏ (fabella) nằm ngay sau lồi cầu đùi.",
      en: "Forms the calf mass, arising by two heads from the supracondylar tuberosities of the femur and ending as the largest component of the common calcanean tendon on the calcaneal tuber. It extends the hock and flexes the stifle. Each head usually contains a small sesamoid — the fabella — lying just behind the femoral condyle.",
      zh: "构成小腿肌块，以两头起自股骨髁上结节，终为跟总腱最大的组成部分，止于跟结节。作用为伸跗关节、屈膝关节。每头内通常含一小籽骨（腓肠豆），位于股骨髁后方。",
    },
    compare: {
      vi: "Người đi bằng cả bàn chân (plantigrade) nên cơ bụng chân chỉ nhấc gót khi bước; chó mèo đi bằng ngón (digitigrade), cổ chân luôn nâng khỏi mặt đất và cơ này phải chịu tải suốt. Xương vừng fabella thì người không có — thấy nó trên phim X-quang gối chó mèo là bình thường, đừng nhầm là mảnh xương vỡ.",
      en: "Humans are plantigrade, so the gastrocnemius merely lifts the heel during gait; dog and cat are digitigrade, the hock never touches the ground and the muscle is loaded throughout stance. The fabella has no human counterpart — seeing it on a canine or feline stifle radiograph is normal and must not be mistaken for a fracture fragment.",
      zh: "人为跖行，腓肠肌仅在步态中抬起足跟；犬猫为趾行，跗关节始终离地，该肌在整个支撑期持续负荷。腓肠豆为人所无——犬猫膝关节 X 线片上见到它属正常，切勿误认为骨折碎片。",
    },
    clinical: {
      vi: "Đứt gân gót chung làm con vật đi bằng cả bàn chân sau, cổ chân sát đất — dáng đi rất đặc trưng, nhìn là nhận ra. Hay gặp ở chó lớn tuổi giống Doberman và ở vết cắt do mảnh kim loại. Phải cố định cổ chân ở tư thế duỗi nhiều tuần sau khi khâu gân.",
      en: "Rupture of the common calcanean tendon makes the animal walk on the whole hind foot with the hock down to the ground — a plantigrade stance so characteristic it is recognised at a glance. It is seen in older large-breed dogs, notably Dobermanns, and after lacerations from sheet metal. The hock must be immobilised in extension for several weeks after tendon repair.",
      zh: "跟总腱断裂使动物以整个后足着地行走、跗关节触地——此跖行姿势极具特征，一望即知。多见于老龄大型犬（尤其杜宾）及金属片割伤之后。腱修补后须将跗关节固定于伸展位数周。",
    },
    source: DYCE,
    keys: ["co bung chan", "gastrocnemius", "fabella", "dut gan got", "di bang ca ban chan"],
  },
  {
    id: "dogcat-biceps-brachii",
    species: ["dog", "cat"],
    system: "muscular",
    region: "forelimb",
    name: { vi: "Cơ hai đầu cánh tay", en: "Biceps brachii", zh: "肱二头肌" },
    nav: "M. biceps brachii",
    note: {
      vi: "Cơ nằm ở mặt trước xương cánh tay, bám gốc bằng một gân duy nhất vào lồi củ trên ổ chảo của xương bả vai, gân ấy chạy trong rãnh gian củ rồi bám vào xương quay và xương trụ. Gấp khuỷu và duỗi vai. Vì gân đầu dài bắc qua khớp vai, cơ này còn giữ vai khỏi bung ra khi chi chịu tải.",
      en: "Lies on the cranial aspect of the humerus, arising by a single tendon from the supraglenoid tubercle of the scapula; that tendon runs in the intertubercular groove before the muscle inserts on radius and ulna. It flexes the elbow and extends the shoulder. Because the tendon of origin bridges the shoulder joint, the muscle also stabilises that joint under load.",
      zh: "位于肱骨前面，以单一肌腱起自肩胛骨盂上结节，该腱经结节间沟走行，肌止于桡骨与尺骨。作用为屈肘、伸肩。因起始腱跨越肩关节，该肌亦在负重时稳定肩关节。",
    },
    compare: {
      vi: "Người có HAI đầu (nên mới gọi là cơ hai đầu) và cơ này còn ngửa được cẳng tay — động tác xoay lòng bàn tay lên. Chó mèo chỉ có MỘT đầu, và cẳng tay của chúng gần như không ngửa được vì xương quay và xương trụ dính chặt vào nhau. Mèo còn xoay được chút ít nên vờn và ôm mồi được; chó thì gần như không.",
      en: "Humans have TWO heads (hence the name) and the muscle also supinates the forearm — turning the palm up. Dog and cat have only ONE head, and their forearm barely supinates because radius and ulna are tightly bound together. The cat retains a little rotation, enough to bat and to clasp prey; the dog has almost none.",
      zh: "人有两个头（故名二头肌），且该肌尚能使前臂旋后——即掌心向上。犬猫仅一个头，且因桡尺骨紧密结合，前臂几乎不能旋后。猫尚保留少许旋转，足以拨弄并抱持猎物；犬则几乎没有。",
    },
    clinical: {
      vi: "Viêm gân đầu dài cơ hai đầu là nguyên nhân què chi trước mạn tính hay gặp ở chó lớn vận động nhiều. Khám bằng cách gấp vai đồng thời duỗi khuỷu để căng gân — con vật đau thì rụt chi lại. Chẩn đoán xác nhận bằng siêu âm rãnh gian củ, chỗ gân dễ dày lên và có dịch.",
      en: "Bicipital tenosynovitis is a common cause of chronic forelimb lameness in active large-breed dogs. Test it by flexing the shoulder while extending the elbow to put the tendon on stretch — a painful dog withdraws the limb. Confirm by ultrasound of the intertubercular groove, where the tendon thickens and effusion collects.",
      zh: "肱二头肌腱鞘炎是活跃大型犬慢性前肢跛行的常见原因。检查时屈肩同时伸肘以牵张该腱——疼痛者会缩回患肢。确诊依靠结节间沟超声检查，可见腱增厚并伴积液。",
    },
    source: MILLER,
    keys: ["co hai dau canh tay", "biceps brachii", "viem gan", "que chi truoc", "ranh gian cu"],
  },
  {
    id: "dogcat-masseter",
    species: ["dog", "cat"],
    system: "muscular",
    region: "head",
    name: { vi: "Cơ cắn", en: "Masseter", zh: "咬肌" },
    nav: "M. masseter",
    note: {
      vi: "Khối cơ dày phủ mặt ngoài nhánh xương hàm dưới, bám từ cung gò má xuống hố cơ cắn. Cùng với cơ thái dương, nó là cơ khép hàm chính và sinh gần như toàn bộ lực cắn. Ở mèo cơ thái dương lớn hơn cơ cắn; ở chó tỉ lệ hai cơ thay đổi mạnh theo giống.",
      en: "The thick mass covering the lateral face of the mandibular ramus, from the zygomatic arch down into the masseteric fossa. With the temporalis it is the principal jaw-closing muscle and generates almost all of the bite force. In the cat the temporalis outweighs the masseter; in the dog the ratio varies widely with breed.",
      zh: "覆盖下颌支外面的厚实肌块，起自颧弓，止于咬肌窝。与颞肌共同构成闭颌的主要肌肉，几乎产生全部咬合力。猫的颞肌大于咬肌；犬两肌之比则因品种差异极大。",
    },
    compare: {
      vi: "Người có cơ cắn khoẻ để nghiền ngang, và khớp thái dương hàm cho hàm trượt sang bên. Chó mèo thì khớp ấy gần như là bản lề thuần: hàm chỉ mở ra khép vào. Vì thế lực cắn của chúng dồn hết vào răng ăn thịt để CẮT, không dàn ra mặt răng để nghiền.",
      en: "Humans have a strong masseter for lateral grinding, and a temporomandibular joint that lets the jaw slide sideways. In dog and cat that joint is essentially a pure hinge: the jaw only opens and closes. Their bite force is therefore concentrated on the carnassial teeth for shearing rather than spread over grinding surfaces.",
      zh: "人的咬肌强大以行横向研磨，颞下颌关节允许下颌侧滑。犬猫的该关节基本为纯铰链：下颌仅能开合。故其咬合力集中于裂齿以行剪切，而非分散于研磨面。",
    },
    clinical: {
      vi: "Viêm cơ nhai ở chó là bệnh tự miễn đánh vào sợi cơ loại 2M chỉ có ở nhóm cơ này: giai đoạn cấp mặt sưng và đau, giai đoạn mạn thì cơ teo lõm hai bên đầu và con vật KHÔNG há được miệng. Chẩn đoán bằng kháng thể kháng 2M; điều trị corticoid liều cao, để muộn thì xơ hoá không hồi phục.",
      en: "Masticatory muscle myositis in the dog is an autoimmune attack on type 2M fibres found only in this muscle group: acutely the face is swollen and painful, chronically the muscles waste into hollows over the skull and the animal CANNOT open its mouth. Diagnosis is by anti-2M antibody titre; treatment is high-dose corticosteroid, and if left late the fibrosis is irreversible.",
      zh: "犬咀嚼肌炎是针对仅存于该肌群的 2M 型肌纤维的自身免疫病：急性期面部肿胀疼痛，慢性期肌肉萎缩致头部两侧凹陷，动物无法张口。经抗 2M 抗体效价确诊；以大剂量糖皮质激素治疗，延误则纤维化不可逆。",
    },
    source: MILLER,
    keys: ["co can", "masseter", "viem co nhai", "khong ha duoc mieng", "luc can"],
  },
  {
    id: "dogcat-pectoralis",
    species: ["dog", "cat"],
    system: "muscular",
    region: "trunk",
    name: { vi: "Cơ ngực", en: "Pectoral muscles", zh: "胸肌" },
    nav: "Mm. pectorales",
    note: {
      vi: "Nhóm cơ nằm giữa xương ức và mặt trong chi trước, gồm phần nông và phần sâu. Chúng khép chi trước vào thân và giữ cho thân khỏi tụt xuống giữa hai chi khi đứng — cùng với cơ răng bụng và cơ thang, chúng làm nên bộ máy treo ngực.",
      en: "The group between the sternum and the medial side of the forelimb, in superficial and deep parts. They adduct the limb and stop the trunk from sinking between the forelimbs in stance — with serratus ventralis and trapezius they form the thoracic sling.",
      zh: "位于胸骨与前肢内侧之间的肌群，分浅部与深部。作用为内收前肢，并在站立时防止躯干下沉于两前肢之间——与腹侧锯肌、斜方肌共同构成胸廓吊带。",
    },
    compare: {
      vi: "Cơ ngực người to và khoẻ vì tay dùng để kéo và đẩy; ở chó mèo nó tương đối mỏng, vì gánh nặng chính do cơ răng bụng chịu. Điểm khác quyết định: người có xương đòn chống ngang giữ vai ra xa thân, thú bốn chân không có — nên cơ ngực của chúng vừa treo vừa giữ ngang, hai việc cùng lúc.",
      en: "The human pectoralis is large and powerful because the arm pulls and pushes; in dog and cat it is relatively thin, the main load being borne by serratus ventralis. The decisive difference: humans have a clavicle strutting the shoulder away from the trunk, quadrupeds do not — so their pectorals both suspend and stabilise laterally at the same time.",
      zh: "人的胸大肌粗壮，因上肢需推拉发力；犬猫的胸肌相对菲薄，主要负荷由腹侧锯肌承担。关键差异在于：人有锁骨将肩撑离躯干，四足动物没有——故其胸肌须同时承担悬吊与侧向稳定两项任务。",
    },
    clinical: {
      vi: "Vùng cơ ngực nông là chỗ đặt kim gây tê thấm khi mổ thoát vị rốn hoặc rạch da đường giữa bụng trước. Quan trọng hơn: chó con mắc hội chứng bơi có lồng ngực bẹt do nằm sấp lâu, cơ ngực co rút khép chi vào — sửa bằng buộc chân tạm và cho nằm nghiêng, càng sớm càng phục hồi hoàn toàn.",
      en: "The superficial pectoral region is where infiltration anaesthesia is placed for umbilical hernia repair or a cranial ventral midline incision. More importantly: swimmer puppies develop a flattened thorax from lying sternally, with contracted pectorals holding the limbs adducted — corrected by temporary hobbles and lateral recumbency, and the earlier this is done the more complete the recovery.",
      zh: "胸浅肌区为脐疝修补或腹前正中切口浸润麻醉的进针部位。更重要的是：游泳幼犬综合征因长期伏卧致胸廓扁平、胸肌挛缩使四肢内收——以临时绑腿并改侧卧矫正，越早处理恢复越完全。",
    },
    source: KL,
    keys: ["co nguc", "pectoralis", "bo may treo nguc", "swimmer puppy", "hoi chung boi"],
  },
  {
    id: "dogcat-antebrachial-extensors",
    species: ["dog", "cat"],
    system: "muscular",
    region: "forelimb",
    name: {
      vi: "Nhóm cơ duỗi cẳng tay",
      en: "Extensor group of the antebrachium",
      zh: "前臂伸肌群",
    },
    nav: "Mm. extensores antebrachii",
    note: {
      vi: "Nhóm cơ nằm ở mặt trước – ngoài cẳng tay, gồm cơ duỗi cổ tay quay, cơ duỗi chung các ngón và cơ duỗi ngoài các ngón. Bụng cơ nằm ở nửa trên cẳng tay rồi thu thành gân dài chạy qua cổ tay xuống các ngón — vì thế nửa dưới cẳng tay thú bốn chân gần như chỉ còn gân và da.",
      en: "The group on the craniolateral antebrachium: extensor carpi radialis, common digital extensor and lateral digital extensor. The bellies sit in the proximal half of the forearm and taper into long tendons crossing the carpus to the digits — which is why the distal half of a quadruped forearm is little more than tendon and skin.",
      zh: "位于前臂前外侧的肌群，包括桡侧腕伸肌、指总伸肌与指外侧伸肌。肌腹位于前臂近半，向下移行为跨越腕关节至各指的长腱——故四足动物前臂远半几乎只剩肌腱与皮肤。",
    },
    compare: {
      vi: "Người có thêm cơ ngửa và cơ sấp cho phép xoay lòng bàn tay; chó mèo gần như mất hẳn động tác ấy vì xương quay và xương trụ dính chặt. Đổi lại phần xa chi nhẹ bẫng — khối cơ dồn hết về gần thân, quán tính nhỏ, nên guồng chân nhanh hơn nhiều so với tay người.",
      en: "Humans also have supinator and pronator muscles that rotate the palm; dog and cat have essentially lost that movement because radius and ulna are bound together. In exchange the distal limb is very light — the muscle mass is concentrated proximally, inertia is low, and the limb can be cycled far faster than a human arm.",
      zh: "人另有旋后肌与旋前肌可使掌心翻转；犬猫因桡尺骨紧密结合基本丧失此动作。代价换来的是远端肢体极轻——肌块集中于近端，惯量小，摆动频率远高于人的上肢。",
    },
    clinical: {
      vi: "Vì phần xa chi chỉ có gân và da, vết thương ở cẳng tay dưới và cổ tay chó mèo rất dễ lộ gân và không có cơ để che kín — đó là lý do vết thương vùng này lâu liền, hay phải ghép da hoặc để liền thứ phát. Ống truyền tĩnh mạch đầu cũng đi dọc mặt trước cẳng tay ngay trên nhóm cơ này.",
      en: "Because the distal limb is only tendon and skin, wounds of the distal forearm and carpus in dog and cat readily expose tendon with no muscle to cover them — which is why wounds here heal slowly and often need a skin graft or second-intention healing. The cephalic vein used for intravenous catheters also runs down the cranial forearm directly over this group.",
      zh: "因远端肢体仅有肌腱与皮肤，犬猫前臂远端及腕部创伤极易暴露肌腱且无肌肉可供覆盖——故此处创口愈合缓慢，常需植皮或二期愈合。静脉留置针所用的头静脉亦沿前臂前面、正走行于该肌群之上。",
    },
    source: MILLER,
    keys: ["co duoi cang tay", "extensor", "tinh mach dau", "cephalic", "vet thuong lo gan"],
  },
  {
    id: "dogcat-semitendinosus",
    species: ["dog", "cat"],
    system: "muscular",
    region: "hindlimb",
    name: { vi: "Cơ bán gân", en: "Semitendinosus", zh: "半腱肌" },
    nav: "M. semitendinosus",
    note: {
      vi: "Cơ nằm ở mặt sau đùi, ngay sau cơ hai đầu đùi, tạo nên đường viền sau cùng của đùi nhìn từ bên. Bám gốc ở ụ ngồi, xuống bám vào mào xương chày và gân gót. Duỗi háng, gấp gối, và khi chi tì đất thì đẩy thân tiến về trước.",
      en: "Lies on the caudal thigh immediately behind biceps femoris, forming the hindmost contour of the thigh in lateral view. It arises from the ischiatic tuber and inserts on the tibial crest and the calcanean tendon. It extends the hip, flexes the stifle, and with the limb planted drives the body forwards.",
      zh: "位于股后部，紧邻股二头肌之后，构成侧面观股部最后缘。起自坐骨结节，止于胫骨嵴与跟腱。作用为伸髋、屈膝，并在该肢着地时推动躯体前进。",
    },
    compare: {
      vi: "Cùng tên với cơ bán gân của người, nhưng ở chó mèo nó dày và ngắn hơn nhiều theo tỉ lệ, vì háng của thú bốn chân luôn gấp chứ không duỗi thẳng như người đứng. Ở bò và ngựa cơ này là khối thịt lớn nhất của đùi sau — chính là phần thịt mông người ta vẫn ăn.",
      en: "The same name as the human semitendinosus, but in dog and cat it is proportionally much thicker and shorter, because the quadruped hip is always flexed rather than extended as in human stance. In cattle and horses this is the largest meat mass of the caudal thigh — the cut sold as topside.",
      zh: "与人的半腱肌同名，但犬猫的该肌比例上更厚更短，因四足动物髋关节始终屈曲，不似人直立时伸展。牛马的此肌为股后最大的肉块——即市售的后腿肉。",
    },
    clinical: {
      vi: "Cơ bán gân là nơi lấy vạt cơ có cuống che khuyết hổng vùng đáy chậu và trực tràng sau khi cắt u quanh hậu môn. Ở chó chăn cừu và chó làm việc còn gặp bệnh xơ hoá cơ bán gân: dáng đi giật đặc trưng, bước sau ngắn và xoay vào trong, hầu như không chữa được.",
      en: "Semitendinosus is the donor for a pedicled muscle flap covering perineal and rectal defects after perianal tumour excision. Working and herding dogs also suffer gracilis-semitendinosus fibrotic myopathy: a characteristic snapping gait with a shortened, internally rotated hind stride, for which there is essentially no cure.",
      zh: "半腱肌是肛周肿瘤切除后修补会阴与直肠缺损的带蒂肌瓣供体。牧羊犬与工作犬另可发生股薄肌-半腱肌纤维性肌病：步态呈特征性弹跳、后肢步幅缩短并内旋，基本无法治愈。",
    },
    source: DYCE,
    keys: ["co ban gan", "semitendinosus", "vat co", "xo hoa co", "dang di giat"],
  },
];
