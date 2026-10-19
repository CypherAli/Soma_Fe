
import { bindContentSource } from "@/lib/content/source";
import type { T3 } from "@/lib/homeContent";
import type { VetSpeciesKey, VetSystemKey } from "./types";

/**
 * BỆNH THÚ Y — mỗi bệnh neo vào MỘT mục giải phẫu.
 *
 * Đây là lý do khu bệnh này tồn tại, và cũng là chỗ nó khác một danh sách bệnh
 * thông thường: `factId` bắt buộc phải trỏ tới một mục có thật trong kho giải
 * phẫu. Bò chướng hơi dạ cỏ vì dạ cỏ nằm đâu và to bằng nào; mèo bị dị vật
 * dạng dây vì gai lưỡi cong về sau; ngựa chết vì tắc mũi vì nó không thở miệng
 * được. Bỏ mối nối ấy đi thì còn lại là một quyển sổ tay bệnh — thứ đã có đầy,
 * và không dính gì tới một atlas giải phẫu.
 *
 * Kiểm thử `npm run test:vet-kb` chặn `factId` trỏ vào chỗ không tồn tại.
 *
 * Mức độ dùng lại đúng ba bậc của bên người (`Severity` trong lib/pathologies)
 * để hai khu đọc lên cùng một ngôn ngữ:
 *   critical — chậm là chết, tính bằng giờ
 *   warning  — phải xử trí, không cấp cứu ngay
 *   info     — cần biết để không chẩn đoán nhầm
 */
export type VetSeverity = "info" | "warning" | "critical";

export type VetDisease = {
  id: string;
  species: VetSpeciesKey[];
  system: VetSystemKey;
  name: T3;
  /** Tên lâm sàng quốc tế / Latin — để tra tiếp trong giáo trình. */
  term: string;
  severity: VetSeverity;
  /** Mục giải phẫu giải thích vì sao bệnh này xảy ra. BẮT BUỘC có thật. */
  factId: string;
  /** Giải phẫu dẫn tới bệnh như thế nào. */
  mechanism: T3;
  /** Dấu hiệu nhận ra trên con vật. */
  signs: T3;
  /** Điểm mấu chốt khi xử trí. */
  management: T3;
  source: string;
  keys?: string[];
};

const KL = "König & Liebich, Veterinary Anatomy of Domestic Mammals, 7th ed. (2020)";
const DYCE = "Dyce, Sack & Wensing, Textbook of Veterinary Anatomy, 5th ed. (2018)";
const KING = "King & McLelland, Birds: Their Structure and Function, 2nd ed.";

export const vetDiseases: VetDisease[] = bindContentSource("data:src/lib/vet/diseases.ts#vetDiseases", [
  // ============================ CHÓ ============================
  {
    id: "dog-gdv",
    species: ["dog"],
    system: "digestive",
    name: {
      vi: "Chướng hơi – xoắn dạ dày (GDV)",
      en: "Gastric dilatation–volvulus (GDV)",
      zh: "胃扩张−扭转（GDV）",
    },
    term: "Dilatatio et volvulus ventriculi",
    severity: "critical",
    factId: "dog-gastric-torsion-anatomy",
    mechanism: {
      vi: "Dạ dày chó treo lỏng, chỉ neo ở tâm vị và môn vị, lại nằm trong lồng ngực sâu và hẹp của các giống lớn. Khi căng hơi, khối dạ dày quay quanh trục nối hai điểm neo ấy — xoắn xong thì hơi không thoát được nữa, áp lực dồn lên tĩnh mạch chủ sau và làm nghẽn máu về tim.",
      en: "The dog's stomach hangs loosely, anchored only at cardia and pylorus, inside the deep narrow chest of the large breeds. Once distended with gas the whole organ rotates about the axis joining those two anchors; the gas can no longer escape and the rising pressure occludes the caudal vena cava, cutting venous return.",
      zh: "犬胃悬挂松弛，仅在贲门与幽门处固定，且位于大型犬深而窄的胸腔内。一旦积气膨大，整个胃即绕此两固定点连线旋转；气体无法排出，压力升高压迫后腔静脉，阻断静脉回流。",
    },
    signs: {
      vi: "Bụng trước căng cứng gõ vang trống, nôn khan không ra gì, chảy dãi, đứng không yên, niêm mạc nhợt rồi tím, mạch nhanh yếu. Diễn biến tính bằng giờ.",
      en: "A tense, tympanic cranial abdomen, unproductive retching, drooling, restlessness, mucous membranes pale then cyanotic, pulse fast and weak. The course is measured in hours.",
      zh: "前腹紧张、叩诊呈鼓音，干呕无物，流涎，焦躁不安，黏膜先苍白后发绀，脉快而弱。病程以小时计。",
    },
    management: {
      vi: "Giảm áp dạ dày và chống sốc TRƯỚC, mổ tháo xoắn sau. Mổ xong bắt buộc khâu cố định dạ dày vào thành bụng (gastropexy) — không cố định thì tái phát tới 80%.",
      en: "Decompress the stomach and treat shock FIRST, then operate to derotate. A gastropexy fixing the stomach to the body wall is mandatory at surgery — without it recurrence reaches 80%.",
      zh: "先胃减压并抗休克，再手术复位。术中必须行胃固定术将胃固定于腹壁——否则复发率高达80%。",
    },
    source: KL,
    keys: ["xoan da day", "gdv", "chuong hoi", "gastropexy"],
  },
  {
    id: "dog-cherry-eye",
    species: ["dog", "cat"],
    system: "senses",
    name: {
      vi: "Sa tuyến mí thứ ba (cherry eye)",
      en: "Prolapse of the gland of the third eyelid (cherry eye)",
      zh: "第三眼睑腺脱出（樱桃眼）",
    },
    term: "Prolapsus glandulae palpebrae tertiae",
    severity: "warning",
    factId: "dogcat-third-eyelid",
    mechanism: {
      vi: "Dây chằng giữ tuyến của mí thứ ba vào quanh ổ mắt yếu bẩm sinh, tuyến bật ra khỏi vị trí và lộ thành khối đỏ tròn ở góc trong mắt. Tuyến này tiết 30–50% lượng nước mắt.",
      en: "The ligament tethering the gland of the third eyelid to the periorbita is congenitally weak; the gland flips out and appears as a round red mass at the medial canthus. That gland produces 30–50% of the tear film.",
      zh: "第三眼睑腺与眶周组织之间的韧带先天薄弱，腺体翻出，于内眼角呈圆形红色隆起。该腺分泌泪液的30–50%。",
    },
    signs: {
      vi: "Khối đỏ hồng tròn nhô ở góc trong mắt, thường một bên trước rồi bên kia. Hay gặp ở Bulldog, Beagle, Cocker.",
      en: "A round pink-red mass at the medial canthus, usually one eye first and the other later. Common in Bulldogs, Beagles and Cockers.",
      zh: "内眼角出现圆形粉红色隆起，通常先发一侧、随后另一侧。多见于斗牛犬、比格犬与可卡犬。",
    },
    management: {
      vi: "Khâu vùi tuyến trở lại, TUYỆT ĐỐI không cắt bỏ: cắt tuyến là mất nửa lượng nước mắt và con vật khô mắt (KCS) suốt đời.",
      en: "Reposition the gland with a pocket technique; never excise it — removing the gland costs half the tear production and leaves the animal with lifelong keratoconjunctivitis sicca.",
      zh: "以包埋术将腺体复位，切不可切除：切除即丧失半数泪液分泌，动物将终身干性角结膜炎。",
    },
    source: KL,
    keys: ["cherry eye", "sa tuyen", "mi mat thu ba", "kcs"],
  },
  {
    id: "dog-boas",
    species: ["dog"],
    system: "respiratory",
    name: {
      vi: "Hội chứng tắc nghẽn đường thở giống đầu ngắn",
      en: "Brachycephalic obstructive airway syndrome (BOAS)",
      zh: "短头品种阻塞性气道综合征",
    },
    term: "Syndroma obstructionis brachycephalicum",
    severity: "critical",
    factId: "dog-brachycephalic-airway",
    mechanism: {
      vi: "Xương mặt bị chọn giống rút ngắn nhưng mô mềm bên trong không ngắn theo: lỗ mũi hẹp, màn hầu quá dài thò vào thanh quản, cuốn mũi lấn ra sau. Gắng thở lâu ngày kéo theo lộn túi thanh quản và sập thanh quản.",
      en: "Selective breeding shortened the facial skeleton but not the soft tissue inside it: stenotic nostrils, an overlong soft palate dipping into the larynx, conchae growing backwards. Chronic inspiratory effort then everts the laryngeal saccules and collapses the larynx.",
      zh: "选育缩短了面部骨骼，其内软组织却未随之缩短：鼻孔狭窄、软腭过长垂入喉腔、鼻甲向后增生。长期用力吸气继而导致喉小囊外翻与喉塌陷。",
    },
    signs: {
      vi: "Thở ồn cả khi nghỉ, ngáy, không chịu được nóng và vận động, ngất khi gắng sức, trào ngược thường xuyên.",
      en: "Noisy breathing even at rest, snoring, intolerance of heat and exercise, exertional syncope, frequent regurgitation.",
      zh: "静息时即呼吸有声、打鼾，不耐热与运动，运动性晕厥，频繁反流。",
    },
    management: {
      vi: "Phẫu thuật mở rộng lỗ mũi và cắt ngắn màn hầu, làm sớm trước khi thanh quản sập. Gây mê là lúc nguy hiểm nhất: đặt nội khí quản thật nhanh, rút ống thật muộn.",
      en: "Surgical widening of the nostrils and shortening of the soft palate, done early, before the larynx collapses. Anaesthesia is the dangerous moment: intubate very early, extubate very late.",
      zh: "手术扩张鼻孔并缩短软腭，宜早于喉塌陷之前进行。麻醉期最危险：尽早插管、尽迟拔管。",
    },
    source: KL,
    keys: ["boas", "dau ngan", "man hau", "pug", "bulldog"],
  },
  {
    id: "dog-otitis-externa",
    species: ["dog", "cat"],
    system: "senses",
    name: {
      vi: "Viêm tai ngoài",
      en: "Otitis externa",
      zh: "外耳炎",
    },
    term: "Otitis externa",
    severity: "warning",
    factId: "dog-tympanic-bulla",
    mechanism: {
      vi: "Ống tai ngoài của chó gấp khúc hình chữ L: một đoạn thẳng đứng rồi mới quặt ngang vào màng nhĩ. Dịch tiết và ráy đọng lại ở khuỷu ấy không tự thoát ra được, thành môi trường cho vi khuẩn và nấm men.",
      en: "The dog's external ear canal is L-shaped: a vertical segment turning horizontally before the eardrum. Secretion and wax collect at that bend and cannot drain out, creating a culture medium for bacteria and yeast.",
      zh: "犬外耳道呈L形：先为垂直段，再转为水平段通向鼓膜。分泌物与耵聍积于转折处而无法自行排出，成为细菌与酵母菌的培养环境。",
    },
    signs: {
      vi: "Gãi tai, lắc đầu, nghiêng đầu một bên, ống tai đỏ và có mùi, dịch nâu đen hoặc mủ.",
      en: "Scratching, head shaking, a head tilt to one side, a red malodorous canal, dark brown or purulent discharge.",
      zh: "抓耳、甩头、头偏向一侧，耳道发红有臭味，分泌物呈深褐色或化脓性。",
    },
    management: {
      vi: "Phải soi tai xác định màng nhĩ còn nguyên trước khi nhỏ thuốc — màng nhĩ thủng mà nhỏ aminoglycosid là gây điếc. Rửa ống tai theo đúng hình chữ L, kéo vành tai lên cho đoạn đứng thẳng ra.",
      en: "Otoscope first to confirm the eardrum is intact — instilling aminoglycosides through a ruptured drum causes deafness. Flush along the L-shape, pulling the pinna upward to straighten the vertical canal.",
      zh: "用药前须耳镜确认鼓膜完整——鼓膜穿孔时滴入氨基糖苷类可致耳聋。沿L形冲洗，并向上牵拉耳廓以拉直垂直段。",
    },
    source: KL,
    keys: ["viem tai", "otitis", "ong tai hinh L", "bong nhi"],
  },

  // ============================ MÈO ============================
  {
    id: "cat-linear-foreign-body",
    species: ["cat"],
    system: "digestive",
    name: {
      vi: "Dị vật dạng dây",
      en: "Linear foreign body",
      zh: "线性异物",
    },
    term: "Corpus alienum lineare",
    severity: "critical",
    factId: "cat-tongue-papillae",
    mechanism: {
      vi: "Gai lưỡi hoá sừng cong về phía sau nên thứ đã vào miệng mèo chỉ đi được một chiều là nuốt xuống. Sợi dây mắc lại ở hãm lưỡi, đầu kia trôi theo ruột; ruột co bóp dồn lên sợi dây cố định, xếp ruột lại như rèm và sợi dây cứa vào bờ mạc treo ở nhiều chỗ.",
      en: "The backward-curving keratinised papillae mean anything entering the cat's mouth can only travel one way — down. The thread anchors under the tongue while the far end travels on; peristalsis then bunches the bowel along the fixed thread like a curtain, and the thread saws into the mesenteric border at several points.",
      zh: "向后弯曲的角化乳头使入口之物只能一路下行。线端固定于舌系带，远端随肠管前行；蠕动使肠管沿固定的线堆叠如帘，线在多处切入肠系膜缘。",
    },
    signs: {
      vi: "Nôn kéo dài, bỏ ăn, đau bụng, có khi sờ thấy ruột thành búi. Rất nhiều ca có sợi dây quấn quanh gốc lưỡi mà không ai nhìn.",
      en: "Persistent vomiting, anorexia, abdominal pain, sometimes a palpable bunched intestinal mass. In many cases a thread is looped around the base of the tongue and simply never looked for.",
      zh: "持续呕吐、厌食、腹痛，有时可触及成团肠管。许多病例的线就绕在舌根，只是无人查看。",
    },
    management: {
      vi: "Mèo nôn cấp nào cũng phải NÂNG LƯỠI kiểm tra hãm lưỡi. Thấy dây thì tuyệt đối không kéo — kéo là cứa đứt ruột; phải mổ và cắt dây ở nhiều đoạn.",
      en: "Every acutely vomiting cat needs the tongue lifted and the frenulum inspected. If a thread is found, never pull it — pulling saws through the bowel; it must be released surgically at several levels.",
      zh: "凡急性呕吐的猫均须抬舌检查舌系带。发现线体切勿牵拉——牵拉将割穿肠壁；须手术分段剪断取出。",
    },
    source: KL,
    keys: ["di vat dang day", "linear foreign body", "ham luoi", "meo non"],
  },
  {
    id: "cat-hepatic-lipidosis",
    species: ["cat"],
    system: "digestive",
    name: {
      vi: "Gan nhiễm mỡ ở mèo",
      en: "Feline hepatic lipidosis",
      zh: "猫肝脂沉积症",
    },
    term: "Lipidosis hepatis felina",
    severity: "critical",
    factId: "cat-obligate-carnivore-gi",
    mechanism: {
      vi: "Mèo là loài ăn thịt bắt buộc: gan luôn chạy các men phân giải đạm ở mức cao và không hạ xuống được khi đói. Nhịn ăn vài ngày là mỡ từ kho dự trữ đổ về gan nhanh hơn khả năng gan chuyển hoá, tế bào gan ứ mỡ và suy chức năng.",
      en: "The cat is an obligate carnivore: its liver runs protein-catabolising enzymes at a high fixed rate and cannot down-regulate them during fasting. A few days without food and fat mobilises to the liver faster than the liver can process it; hepatocytes fill with lipid and fail.",
      zh: "猫为专性肉食动物：肝脏蛋白分解酶维持高水平且在饥饿时无法下调。数日不进食，脂肪动员至肝脏的速度超过肝脏处理能力，肝细胞充满脂滴而功能衰竭。",
    },
    signs: {
      vi: "Mèo béo bỏ ăn vài ngày rồi vàng da, sụt cân nhanh, nôn, chảy dãi. Thường khởi phát sau một stress bất kỳ: đổi nhà, mất bạn cùng nhà, một bệnh khác.",
      en: "An overweight cat stops eating for a few days, then becomes jaundiced, loses weight fast, vomits and drools. It usually follows any stressor: a house move, the loss of a companion, another illness.",
      zh: "肥胖猫数日不食后出现黄疸、迅速消瘦、呕吐、流涎。通常继发于任何应激：搬家、同伴丧失或其他疾病。",
    },
    management: {
      vi: "Cốt lõi là ĐƯA ĐỦ ĐẠM VÀO bằng ống xông, không phải truyền dịch đường. Mèo bỏ ăn quá ba ngày là phải can thiệp dinh dưỡng, đừng chờ.",
      en: "The core of treatment is getting enough PROTEIN in by feeding tube, not glucose-containing fluids. Any cat anorexic for more than three days needs nutritional intervention — do not wait.",
      zh: "治疗核心是经饲管补足蛋白质，而非输注含糖液体。厌食超过三天的猫即须营养干预，不可等待。",
    },
    source: KL,
    keys: ["gan nhiem mo", "hepatic lipidosis", "meo bo an", "vang da"],
  },
  {
    id: "cat-pra-fundus",
    species: ["cat", "dog"],
    system: "senses",
    name: {
      vi: "Đọc đáy mắt: thảm sáng bình thường hay bệnh",
      en: "Reading the fundus: normal tapetum or disease",
      zh: "眼底判读：正常照膜抑或病变",
    },
    term: "Fundus tapetalis et atapetalis",
    severity: "info",
    factId: "cat-tapetum-lucidum",
    mechanism: {
      vi: "Nửa trên đáy mắt có thảm sáng nên loé sáng, nửa dưới không có nên tối màu — hai vùng khác nhau rõ rệt là BÌNH THƯỜNG. Khi lớp võng mạc phía trước mỏng đi, ánh sáng tới thảm sáng nhiều hơn và vùng ấy phản quang mạnh bất thường.",
      en: "The upper fundus is tapetal and reflective, the lower is non-tapetal and dark — the sharp difference between them is NORMAL. When the overlying retina thins, more light reaches the tapetum and that zone becomes abnormally hyper-reflective.",
      zh: "眼底上半部有照膜而反光，下半部无照膜而暗——两区分明属正常。当其前方视网膜变薄，到达照膜的光线增多，该区即呈异常强反光。",
    },
    signs: {
      vi: "Phản quang tăng lan toả kèm mạch máu võng mạc teo nhỏ: teo võng mạc tiến triển. Ngược lại vùng thảm sáng tối đi, mờ: phù hoặc bong võng mạc.",
      en: "Diffuse hyper-reflectivity with attenuated retinal vessels: progressive retinal atrophy. Conversely a dulled, darkened tapetal zone: retinal oedema or detachment.",
      zh: "弥漫性强反光伴视网膜血管变细：进行性视网膜萎缩。反之照膜区变暗、模糊：视网膜水肿或脱离。",
    },
    management: {
      vi: "Không nhầm hai vùng sinh lý thành tổn thương là việc đầu tiên. Mèo mù đột ngột phải đo huyết áp ngay: tăng huyết áp gây bong võng mạc là nguyên nhân hàng đầu và hồi phục được nếu xử trí sớm.",
      en: "Step one is not mistaking the two physiological zones for lesions. A cat that goes suddenly blind needs its blood pressure measured immediately: hypertensive retinal detachment is the leading cause and is reversible if treated early.",
      zh: "首要是不将两个生理分区误判为病变。猫突然失明须立即测量血压：高血压性视网膜脱离为首要病因，早期治疗可逆。",
    },
    source: KL,
    keys: ["soi day mat", "tham sang", "tapetum", "teo vong mac", "mu dot ngot"],
  },

  // ============================ NGỰA ============================
  {
    id: "horse-colon-torsion",
    species: ["horse"],
    system: "digestive",
    name: {
      vi: "Đau bụng ngựa do xoắn đại tràng",
      en: "Equine colic from large colon volvulus",
      zh: "马大结肠扭转性腹痛",
    },
    term: "Volvulus coli ascendentis",
    severity: "critical",
    factId: "horse-large-colon",
    mechanism: {
      vi: "Đại tràng lớn của ngựa dài khoảng 3–4 m, chứa tới 80 lít, gấp làm bốn đoạn hình móng ngựa mà PHẦN LỚN không có mạc treo cố định — nó nằm tự do trong ổ bụng. Một khối lỏng lẻo nặng như vậy rất dễ xoay quanh trục của chính nó, và xoay quá 270° là mạch máu bị thắt.",
      en: "The horse's large colon is 3–4 m long, holds up to 80 litres and folds into four horseshoe limbs that are largely WITHOUT a fixing mesentery — it lies free in the abdomen. Such a heavy, loosely held mass rotates about its own axis easily, and beyond 270° the blood supply is strangulated.",
      zh: "马大结肠长3–4米，容积达80升，折成四段马蹄形，且大部分无固定肠系膜——游离于腹腔内。如此沉重而松弛的团块极易绕自身轴旋转，超过270°即绞窄血供。",
    },
    signs: {
      vi: "Đau dữ dội không dứt: lăn lộn, cào đất, ngoái nhìn bụng, vã mồ hôi. Mạch trên 60, bụng chướng nhanh. Khác với đau bụng do co thắt, loại này không đỡ khi dùng giảm đau.",
      en: "Violent unrelenting pain: rolling, pawing, flank-watching, sweating. Heart rate over 60, rapid abdominal distension. Unlike spasmodic colic it does not respond to analgesia.",
      zh: "剧烈而持续的腹痛：打滚、刨地、回顾腹部、出汗。心率超过60，腹围迅速增大。与痉挛性腹痛不同，本病对镇痛无反应。",
    },
    management: {
      vi: "Đau bụng ngựa không đỡ sau giảm đau là chỉ định mổ, tính bằng giờ. Ngựa không nôn được (cơ thắt tâm vị và góc thực quản–dạ dày một chiều) nên không tự giải áp được như chó — đặt ống thông mũi–dạ dày là thao tác bắt buộc.",
      en: "Equine colic unrelieved by analgesia is a surgical case, and the clock is in hours. The horse cannot vomit (a powerful cardiac sphincter and an acute oesophago-gastric angle make it one-way), so unlike a dog it cannot decompress itself — passing a nasogastric tube is mandatory.",
      zh: "镇痛无效的马腹痛即为手术指征，时间以小时计。马不能呕吐（贲门括约肌强大且食管胃角锐利，形成单向结构），故不能如犬般自行减压——必须下鼻胃管。",
    },
    source: DYCE,
    keys: ["dau bung ngua", "colic", "xoan dai trang", "ong thong mui da day"],
  },
  {
    id: "horse-laminitis",
    species: ["horse"],
    system: "integument",
    name: {
      vi: "Viêm móng (laminitis)",
      en: "Laminitis",
      zh: "蹄叶炎",
    },
    term: "Pododermatitis aseptica diffusa",
    severity: "critical",
    factId: "horse-hoof",
    mechanism: {
      vi: "Xương móng không tựa lên đế mà được TREO vào vách móng bằng khoảng 600 lá sừng cài vào nhau. Khi lớp lá ấy viêm và mất bám, toàn bộ trọng lượng con vật kéo xương móng tụt xuống và xoay mũi xuống, có khi thủng qua đế móng.",
      en: "The pedal bone does not rest on the sole; it is SUSPENDED from the hoof wall by some 600 interlocking laminae. When those laminae inflame and lose their grip, the animal's whole weight drags the bone down and rotates its tip downward, sometimes through the sole.",
      zh: "蹄骨并非支撑于蹄底，而是借约600片相互嵌合的蹄叶悬吊于蹄壁。蹄叶发炎失去附着后，动物全部体重将蹄骨下拉并使其尖端向下旋转，甚至穿透蹄底。",
    },
    signs: {
      vi: "Đứng dồn trọng lượng ra sau, hai chân trước duỗi về trước để đỡ đau, ngại quay vòng, mạch động mạch ngón đập mạnh, móng nóng. Thường sau ăn quá nhiều tinh bột, sau viêm nhiễm nặng, hoặc do rối loạn nội tiết.",
      en: "The horse rocks its weight backwards, planting the forefeet ahead of itself, is reluctant to turn, has bounding digital pulses and hot hooves. It commonly follows carbohydrate overload, severe sepsis, or endocrine disease.",
      zh: "马将体重后移，前肢前伸支撑，不愿转弯，指动脉搏动强烈，蹄部发热。常继发于碳水化合物过食、严重脓毒症或内分泌疾病。",
    },
    management: {
      vi: "Cấp cứu chỉnh hình: đỡ đế móng, hạn chế vận động tuyệt đối, xử lý nguyên nhân gốc. Chụp X-quang nghiêng để đo góc xoay xương móng — đó là con số quyết định tiên lượng, không phải mức độ đau.",
      en: "An orthopaedic emergency: support the sole, enforce strict box rest, treat the underlying cause. Lateral radiographs to measure rotation of the pedal bone give the prognosis — not the degree of pain.",
      zh: "属矫形急症：支撑蹄底、严格限制运动、处理原发病因。侧位X线测量蹄骨旋转角度方能判断预后——而非疼痛程度。",
    },
    source: DYCE,
    keys: ["viem mong", "laminitis", "xuong mong", "la sung"],
  },
  {
    id: "horse-guttural-pouch-mycosis",
    species: ["horse"],
    system: "respiratory",
    name: {
      vi: "Nấm túi khí hầu",
      en: "Guttural pouch mycosis",
      zh: "喉囊真菌病",
    },
    term: "Mycosis diverticuli tubae auditivae",
    severity: "critical",
    factId: "horse-guttural-pouch",
    mechanism: {
      vi: "Túi khí hầu là chỗ phình của vòi tai, và ĐỘNG MẠCH CẢNH TRONG cùng các dây thần kinh sọ IX–XII chạy ngay dưới niêm mạc của nó. Mảng nấm ăn mòn qua lớp niêm mạc mỏng ấy là chạm thẳng vào thành động mạch.",
      en: "The guttural pouch is a diverticulum of the auditory tube, and the INTERNAL CAROTID ARTERY together with cranial nerves IX–XII runs immediately beneath its lining. A fungal plaque eroding through that thin lining reaches the arterial wall directly.",
      zh: "喉囊为咽鼓管的憩室，颈内动脉与第IX–XII对脑神经紧邻其黏膜下方走行。真菌斑块侵蚀该薄层黏膜后即直达动脉壁。",
    },
    signs: {
      vi: "Chảy máu mũi tự phát, không do vận động, tái đi tái lại và mỗi lần một nhiều hơn — đây là dấu hiệu báo trước. Kèm theo có thể khó nuốt, liệt màn hầu, hội chứng Horner do tổn thương thần kinh sọ.",
      en: "Spontaneous epistaxis unrelated to exercise, recurring and heavier each time — this is the warning sign. Dysphagia, palatal paresis and Horner's syndrome may accompany it from cranial nerve damage.",
      zh: "与运动无关的自发性鼻出血，反复发作且一次比一次量大——此为预警征象。可伴吞咽困难、软腭麻痹及因脑神经受损所致的霍纳氏综合征。",
    },
    management: {
      vi: "Chảy máu mũi tái phát ở ngựa phải nội soi túi khí hầu, không được coi là chảy máu mũi thường. Điều trị là gây tắc mạch bằng bóng hoặc coil — chờ đến khi xuất huyết ồ ạt thì tỷ lệ tử vong rất cao.",
      en: "Recurrent epistaxis in a horse demands endoscopy of the guttural pouch; it must never be dismissed as a simple nosebleed. Treatment is arterial occlusion with a balloon or coils — waiting for the fatal haemorrhage carries a very high mortality.",
      zh: "马反复鼻出血须行喉囊内窥镜检查，绝不可视为普通鼻衄。治疗为球囊或弹簧圈栓塞动脉——待大出血发生则死亡率极高。",
    },
    source: DYCE,
    keys: ["tui khi hau", "guttural pouch", "chay mau mui", "dong mach canh"],
  },
  {
    id: "horse-enamel-points",
    species: ["horse"],
    system: "digestive",
    name: {
      vi: "Gai men răng và loét má",
      en: "Sharp enamel points and buccal ulceration",
      zh: "釉质尖刺与颊部溃疡",
    },
    term: "Puncta enameli acuta",
    severity: "warning",
    factId: "horse-hypsodont-teeth",
    mechanism: {
      vi: "Hàm trên ngựa rộng hơn hàm dưới, nên khi nhai đưa ngang thì mép NGOÀI của răng trên và mép TRONG của răng dưới không chạm vào nhau để mài. Răng lại trồi 2–3 mm mỗi năm, phần không mài ấy thành hàng gai men sắc.",
      en: "The horse's upper jaw is wider than the lower, so in the sideways chewing stroke the OUTER edge of the upper teeth and the INNER edge of the lower never meet to wear. With the teeth erupting 2–3 mm a year, those unworn edges grow into rows of sharp enamel points.",
      zh: "马上颌宽于下颌，故侧向咀嚼时上齿外缘与下齿内缘无法互相磨耗。牙齿每年萌出2–3毫米，这些未被磨及的边缘遂形成成排锐利的釉质尖刺。",
    },
    signs: {
      vi: "Nhả nắm cỏ đã nhai dở (quidding), nhai nghiêng một bên, chảy dãi, sụt cân, cắn hàm thiếc khó chịu. Vành má có vết loét đối diện hàng răng trên.",
      en: "Dropping half-chewed boluses (quidding), chewing on one side, drooling, weight loss, resentment of the bit. Ulcers appear on the cheek opposite the upper cheek teeth.",
      zh: "吐出半嚼的草团、单侧咀嚼、流涎、消瘦、抗拒衔铁。颊黏膜在上颊齿相对处出现溃疡。",
    },
    management: {
      vi: "Giũa răng (floating) định kỳ, thường mỗi 6–12 tháng. Ngựa trên 25 tuổi thì phải khám răng TRƯỚC khi kết luận sụt cân do nguyên nhân khác — thân răng dự trữ đã hết, con vật không nhai nổi cỏ khô nữa.",
      en: "Routine rasping ('floating'), usually every 6–12 months. In a horse over 25 the mouth must be examined BEFORE attributing weight loss to anything else — the reserve crown is spent and the animal can no longer chew hay.",
      zh: "定期锉齿，通常每6–12个月一次。25岁以上的马在归因消瘦于其他病因之前必须先检查口腔——储备齿冠已耗尽，无法再咀嚼干草。",
    },
    source: DYCE,
    keys: ["gai men", "giua rang", "floating", "quidding", "sut can ngua gia"],
  },

  // ============================ BÒ ============================
  {
    id: "cattle-ruminal-tympany",
    species: ["cattle"],
    system: "digestive",
    name: {
      vi: "Chướng hơi dạ cỏ",
      en: "Ruminal tympany (bloat)",
      zh: "瘤胃臌气",
    },
    term: "Tympania ruminis",
    severity: "critical",
    factId: "cattle-four-stomachs",
    mechanism: {
      vi: "Vi sinh vật dạ cỏ sinh 30–50 lít khí mỗi giờ, thoát ra nhờ ợ hơi. Khi khí bị giữ lại — do bọt bền không vỡ được (chướng hơi bọt, sau ăn cỏ họ đậu), hoặc do tắc thực quản — dạ cỏ 100–200 lít căng ra, đè cơ hoành và tĩnh mạch chủ.",
      en: "Ruminal microbes produce 30–50 litres of gas an hour, cleared by eructation. When the gas is trapped — by a stable foam that cannot break (frothy bloat, after legume pasture) or by oesophageal obstruction — the 100–200 litre rumen distends and presses on the diaphragm and vena cava.",
      zh: "瘤胃微生物每小时产气30–50升，靠嗳气排出。当气体滞留——因稳定泡沫无法破裂（泡沫性臌气，见于采食豆科牧草后）或食管阻塞——容积100–200升的瘤胃膨大，压迫膈肌与腔静脉。",
    },
    signs: {
      vi: "Hõm hông TRÁI phồng căng rõ, gõ vang trống, con vật khó thở, há mồm thở, đứng dạng chân. Thở miệng ở bò là dấu hiệu cấp cứu vì bò bình thường không thở miệng.",
      en: "The LEFT paralumbar fossa bulges tightly and is tympanic on percussion; the animal is dyspnoeic, breathes with its mouth open and stands with the legs abducted. Open-mouth breathing in cattle is an emergency sign, because a normal ox does not do it.",
      zh: "左侧腹肋窝明显膨隆紧张、叩诊呈鼓音，动物呼吸困难、张口呼吸、四肢外展站立。牛张口呼吸即为急症征象，因正常牛不会如此。",
    },
    management: {
      vi: "Đặt ống thông dạ cỏ trước; nếu là chướng hơi bọt thì ống không ra khí, phải đưa thuốc phá bọt. Nguy kịch thì chọc troca qua hõm hông TRÁI — đúng chỗ dạ cỏ nằm sát thành bụng, chọc bên phải là vào ruột.",
      en: "Pass a stomach tube first; in frothy bloat no gas comes and an antifoaming agent must go in. If life-threatening, trocarise through the LEFT paralumbar fossa — where the rumen lies against the body wall; the right side would enter intestine.",
      zh: "先下胃管；泡沫性臌气时无气排出，须投服消泡剂。危及生命时经左侧腹肋窝穿刺——该处瘤胃紧贴腹壁；右侧穿刺将刺入肠管。",
    },
    source: DYCE,
    keys: ["chuong hoi", "bloat", "da co", "hom hong trai", "troca"],
  },
  {
    id: "cattle-hardware-disease",
    species: ["cattle"],
    system: "digestive",
    name: {
      vi: "Viêm dạ tổ ong – màng bụng do dị vật",
      en: "Traumatic reticuloperitonitis (hardware disease)",
      zh: "创伤性网胃腹膜炎（金属异物病）",
    },
    term: "Reticuloperitonitis traumatica",
    severity: "critical",
    factId: "cattle-four-stomachs",
    mechanism: {
      vi: "Bò nuốt vội không chọn lọc nên dây thép, đinh theo thức ăn vào dạ tổ ong — túi nằm THẤP NHẤT và ở phía trước nhất, sát ngay sau cơ hoành ngang mức xương sườn 6–7. Vật nhọn đọng lại đó, co bóp đẩy nó xuyên qua thành, qua cơ hoành, có khi tới màng ngoài tim.",
      en: "Cattle swallow rapidly and without selection, so wire and nails pass with the feed into the reticulum — the LOWEST and most cranial compartment, lying directly behind the diaphragm at the level of ribs 6–7. The sharp object settles there and contractions drive it through the wall, through the diaphragm, sometimes as far as the pericardium.",
      zh: "牛采食迅速且不加选择，铁丝、钉子随饲料进入网胃——该胃位置最低且最靠前，紧贴膈肌后方，相当于第6–7肋水平。尖锐异物沉积于此，胃收缩将其推穿胃壁、膈肌，甚至可达心包。",
    },
    signs: {
      vi: "Đột ngột giảm ăn và giảm sữa, lưng cong, đi đứng thận trọng, rên khi nằm xuống. Ấn mạnh vùng ức hoặc dồn lưng gây đau rõ. Tới màng ngoài tim thì có tiếng cọ, tĩnh mạch cổ nổi, phù hầu.",
      en: "Sudden drop in appetite and milk yield, an arched back, careful movement, a grunt on lying down. Firm pressure over the xiphoid or a withers pinch elicits clear pain. If the pericardium is reached there is a friction rub, distended jugular veins and brisket oedema.",
      zh: "食欲与产奶量骤降，弓背，行动谨慎，卧下时发出呻吟。剑突部加压或捏鬐甲可引出明显疼痛。累及心包时出现摩擦音、颈静脉怒张与胸垂水肿。",
    },
    management: {
      vi: "Cho nam châm lưu dạ tổ ong là biện pháp phòng chuẩn của cả đàn. Đã thủng tới màng ngoài tim thì tiên lượng rất xấu, thường loại thải. Nhớ rằng nghe tim bò bình thường KHÔNG có tiếng cọ — có là bệnh.",
      en: "A retained reticular magnet is the standard herd-level prevention. Once the pericardium is involved the prognosis is poor and culling is usual. Remember that a normal bovine heart has NO friction rub — its presence is pathological.",
      zh: "投服网胃磁铁是群体标准预防措施。一旦累及心包则预后不良，通常淘汰。须记住正常牛心音无摩擦音——出现即属病理。",
    },
    source: DYCE,
    keys: ["hardware disease", "da to ong", "nam cham", "viem mang ngoai tim"],
  },
  {
    id: "cattle-retained-placenta",
    species: ["cattle"],
    system: "urogenital",
    name: {
      vi: "Sót nhau",
      en: "Retained fetal membranes",
      zh: "胎衣不下",
    },
    term: "Retentio secundinarum",
    severity: "warning",
    factId: "cattle-cotyledonary-placenta",
    mechanism: {
      vi: "Nhau bò nối với tử cung ở 70–120 điểm rời rạc, mỗi điểm là một núm thịt khớp với một đài nhau. Muốn tống nhau ra thì phải tách rời ở TỪNG điểm một; chỉ cần một phần không tách là cả màng nhau còn treo lại.",
      en: "The bovine placenta attaches at 70–120 discrete sites, each a caruncle interlocking with a cotyledon. Expulsion requires separation at EVERY one of them; if some fail to release, the whole membrane stays hanging.",
      zh: "牛胎盘于70–120个离散部位附着，每处由子宫阜与子叶嵌合。排出须在每一处分离；只要部分未能脱离，整个胎衣即滞留。",
    },
    signs: {
      vi: "Màng nhau còn treo ngoài âm hộ quá 12–24 giờ sau đẻ. Gặp ở 5–15% ca đẻ thường, cao hơn nhiều sau đẻ khó, sinh đôi, đẻ non hoặc thiếu selen.",
      en: "Membranes still hanging from the vulva more than 12–24 hours after calving. It occurs in 5–15% of normal calvings, far more after dystocia, twins, premature birth or selenium deficiency.",
      zh: "产后12–24小时以上胎衣仍垂于阴门之外。见于5–15%的正常分娩，难产、双胎、早产或缺硒后比例远高。",
    },
    management: {
      vi: "TUYỆT ĐỐI không kéo nhau ra: giật đứt núm thịt gây chảy máu và viêm tử cung nặng hơn hẳn. Cắt gọn phần thò ra, theo dõi sốt và dịch hôi, chỉ dùng kháng sinh toàn thân khi con vật có biểu hiện toàn thân.",
      en: "Never pull the membranes: tearing the caruncles causes haemorrhage and a far worse metritis. Trim the protruding part, monitor for fever and fetid discharge, and use systemic antibiotics only if the cow becomes systemically ill.",
      zh: "切勿强拉胎衣：扯裂子宫阜将致出血与远为严重的子宫炎。剪去外露部分，监测发热与恶臭排出物，仅在母牛出现全身症状时使用全身抗生素。",
    },
    source: KL,
    keys: ["sot nhau", "retained placenta", "nhau da dai", "viem tu cung"],
  },
  {
    id: "cattle-calf-scours-groove",
    species: ["cattle"],
    system: "digestive",
    name: {
      vi: "Tiêu chảy bê do rãnh thực quản không khép",
      en: "Calf scours from failure of the reticular groove",
      zh: "食管沟闭合不全所致犊牛腹泻",
    },
    term: "Insufficientia sulci reticuli",
    severity: "warning",
    factId: "cattle-reticular-groove",
    mechanism: {
      vi: "Bê bú thì rãnh thực quản khép thành ống kín đưa sữa đi thẳng xuống dạ múi khế. Uống xô quá vội, sữa nguội, hay bú không đúng tư thế thì rãnh không khép; sữa rơi vào dạ cỏ — nơi bê con chưa có hệ vi sinh — và lên men thối.",
      en: "When a calf suckles, the reticular groove closes into a sealed tube carrying milk straight to the abomasum. Drinking too fast from a bucket, cold milk, or the wrong head position leaves the groove open; milk falls into the rumen — which in a young calf has no microflora yet — and putrefies.",
      zh: "犊牛吮吸时食管沟闭合成密闭管道，将乳汁直送皱胃。以桶饮乳过快、乳温过低或姿势不当时该沟不闭合；乳汁落入尚无微生物区系的瘤胃而腐败。",
    },
    signs: {
      vi: "Bê nuôi bằng xô tiêu chảy, bụng chướng, chậm lớn, phân chua mùi. Bê bú mẹ trực tiếp ít gặp hơn hẳn.",
      en: "Bucket-fed calves with diarrhoea, a distended abdomen, poor growth and sour-smelling faeces. Calves suckling the dam directly are far less affected.",
      zh: "桶饲犊牛腹泻、腹围膨大、生长迟缓、粪便酸臭。直接哺乳的犊牛发病显著较少。",
    },
    management: {
      vi: "Sửa cách cho ăn trước khi nghĩ tới thuốc: sữa ấm 38–39 °C, núm vú cao ngang tầm đầu bê ngẩng lên như khi bú mẹ, cho ăn lượng nhỏ nhiều lần. Đây là bệnh của KỸ THUẬT NUÔI, không phải của mầm bệnh.",
      en: "Correct the feeding before reaching for drugs: milk at 38–39 °C, a teat held at the height the calf's head reaches when suckling the dam, smaller and more frequent feeds. This is a disease of husbandry, not of a pathogen.",
      zh: "先纠正饲喂方式再考虑用药：乳温38–39°C，奶嘴高度与犊牛哺乳时抬头位置相当，少量多次饲喂。此为饲养管理之病，而非病原之病。",
    },
    source: DYCE,
    keys: ["tieu chay be", "ranh thuc quan", "be uong xo", "calf scours"],
  },

  // ============================ LỢN ============================
  {
    id: "pig-inguinal-hernia-clinical",
    species: ["pig"],
    system: "urogenital",
    name: {
      vi: "Thoát vị bẹn – bìu ở lợn đực",
      en: "Inguinal and scrotal hernia in the boar",
      zh: "公猪腹股沟疝与阴囊疝",
    },
    term: "Hernia inguinalis et scrotalis",
    severity: "warning",
    factId: "pig-inguinal-hernia",
    mechanism: {
      vi: "Ống bẹn của lợn rộng và ngắn hơn các loài khác, lại tồn tại lâu sau khi tinh hoàn đã xuống. Ruột non chui qua ống ấy xuống bìu, nhất là khi lợn con rặn hoặc bị nâng bằng hai chân sau.",
      en: "The pig's inguinal canal is wider and shorter than in other species and stays patent long after the testes have descended. Small intestine slips through it into the scrotum, especially when the piglet strains or is lifted by the hind legs.",
      zh: "猪的腹股沟管较其他物种更宽更短，且在睾丸下降后长期保持开放。小肠经此进入阴囊，尤其在仔猪努责或被提起后肢时。",
    },
    signs: {
      vi: "Một bên bìu to lên, sờ mềm, đẩy vào được khi lợn nằm ngửa. Nghẹt thì bìu căng cứng, đau, lợn bỏ ăn và nôn.",
      en: "One side of the scrotum enlarges, feels soft and can be pushed back when the pig is held on its back. If strangulated the scrotum becomes tense and painful, and the pig stops eating and vomits.",
      zh: "单侧阴囊增大、触之柔软，仰卧保定时可回纳。发生嵌顿时阴囊紧张疼痛，猪停食并呕吐。",
    },
    management: {
      vi: "Thiến lợn có thoát vị phải mổ theo đường kín và khâu bịt ống bẹn — thiến kiểu hở thường quy là ruột tụt hẳn ra ngoài. Kiểm tra bìu TRƯỚC mỗi ca thiến là quy tắc, vì đây là tật di truyền phổ biến ở lợn.",
      en: "Castrating an affected pig requires a closed technique with closure of the inguinal ring — a routine open castration lets the intestine fall out. Checking the scrotum BEFORE every castration is the rule, this being a common heritable defect in pigs.",
      zh: "对患猪去势须采用闭合式术式并缝闭腹股沟环——常规开放式去势会致肠管脱出。每次去势前检查阴囊是必须遵守的规程，因该缺陷在猪中为常见遗传病。",
    },
    source: KL,
    keys: ["thoat vi ben", "hernia", "thien lon", "ong ben"],
  },
  {
    id: "pig-heat-stress",
    species: ["pig"],
    system: "integument",
    name: {
      vi: "Stress nhiệt ở lợn",
      en: "Heat stress in the pig",
      zh: "猪热应激",
    },
    term: "Stressus thermicus",
    severity: "warning",
    factId: "pig-skin-model",
    mechanism: {
      vi: "Lợn gần như không có tuyến mồ hôi có chức năng điều nhiệt, lại phủ lớp mỡ dưới da dày và ít lông che nắng. Con đường thải nhiệt gần như duy nhất là thở nhanh và tiếp xúc với bề mặt mát — nên chuồng nóng ẩm là lợn không hạ nhiệt được.",
      en: "The pig has virtually no thermoregulatory sweat glands, carries a thick subcutaneous fat layer and has too little hair for shade. Its only real routes for heat loss are panting and contact with a cool surface — so in a hot humid house the pig simply cannot shed heat.",
      zh: "猪几乎无具调温功能的汗腺，皮下脂肪层厚而被毛稀少难以遮阳。散热途径几乎仅剩喘息与接触凉面——故在高温高湿猪舍中猪无法散热。",
    },
    signs: {
      vi: "Thở nhanh nông, nằm dài trên nền ẩm, giảm ăn rõ, lợn nái giảm tiết sữa và giảm tỷ lệ thụ thai. Da vùng ít lông có thể cháy nắng đỏ rồi bong.",
      en: "Rapid shallow panting, lying stretched out on wet flooring, a marked drop in feed intake, reduced milk yield and conception rate in sows. Sparsely haired skin may sunburn, redden and peel.",
      zh: "呼吸浅快，伸展卧于湿地面，采食量明显下降，母猪泌乳量与受胎率降低。被毛稀疏处皮肤可发生日晒伤、发红脱皮。",
    },
    management: {
      vi: "Giải pháp là môi trường chứ không phải thuốc: phun sương kết hợp quạt gió, nền mát, che nắng, cho ăn vào lúc mát trong ngày. Nhớ rằng da lợn giống da người nên cũng cháy nắng thật.",
      en: "The answer is environmental, not pharmaceutical: misting combined with air movement, cool flooring, shade, and feeding during the cooler hours. Remember that pig skin resembles human skin and genuinely sunburns.",
      zh: "解决之道在环境而非药物：喷雾配合通风、凉爽地面、遮阳，并在凉爽时段饲喂。须记住猪皮肤类似人皮肤，确会日晒伤。",
    },
    source: KL,
    keys: ["stress nhiet", "heat stress", "lon khong co mo hoi", "chay nang"],
  },

  // ============================ GÀ ============================
  {
    id: "chicken-caecal-coccidiosis",
    species: ["chicken"],
    system: "digestive",
    name: {
      vi: "Cầu trùng manh tràng",
      en: "Caecal coccidiosis",
      zh: "盲肠球虫病",
    },
    term: "Coccidiosis caecalis (Eimeria tenella)",
    severity: "warning",
    factId: "chicken-caeca",
    mechanism: {
      vi: "Eimeria tenella ký sinh riêng ở biểu mô hai manh tràng — nơi thức ăn đọng lâu nhất và nhu động ngược đưa dịch mịn vào. Ký sinh trùng nhân lên phá huỷ biểu mô làm chảy máu vào lòng manh tràng.",
      en: "Eimeria tenella parasitises the epithelium of the two caeca specifically — the site where content dwells longest and where antiperistalsis delivers the fine fraction. Its multiplication destroys the epithelium and bleeds into the caecal lumen.",
      zh: "柔嫩艾美耳球虫专门寄生于两条盲肠的上皮——该处内容物滞留最久，且逆蠕动将细微食糜送入。虫体增殖破坏上皮，向盲肠腔内出血。",
    },
    signs: {
      vi: "Phân manh tràng lẫn máu tươi, gà ủ rũ xù lông, giảm ăn, chết rải rác ở đàn 3–6 tuần tuổi. Mổ khám thấy hai manh tràng căng đầy máu đông.",
      en: "Frank blood in the caecal droppings, huddled ruffled birds, reduced intake and scattered deaths in flocks aged 3–6 weeks. At post-mortem both caeca are distended with clotted blood.",
      zh: "盲肠粪便带鲜血，鸡精神沉郁、羽毛蓬乱、采食减少，3–6周龄鸡群零星死亡。剖检见两条盲肠充满凝血块。",
    },
    management: {
      vi: "Phân biệt phân manh tràng bình thường (nhão, nâu sẫm, 1–2 lần/ngày) với phân có máu — nhầm hai thứ này là chẩn đoán sai cả đàn. Phòng bằng vaccine hoặc thuốc trộn thức ăn và giữ nền chuồng khô, vì noãn nang cần ẩm mới hoá bào tử.",
      en: "Distinguish the normal caecal dropping (pasty, dark brown, once or twice a day) from a bloody one — confusing the two misdiagnoses the whole flock. Prevention is by vaccine or in-feed coccidiostat plus dry litter, since oocysts need moisture to sporulate.",
      zh: "须区分正常盲肠粪便（糊状、深褐色、每日一至两次）与血便——二者混淆将导致全群误诊。预防依靠疫苗或饲料添加抗球虫药，并保持垫料干燥，因卵囊需湿度方能孢子化。",
    },
    source: KING,
    keys: ["cau trung", "coccidiosis", "manh trang", "phan mau"],
  },
  {
    id: "chicken-cage-layer-fatigue",
    species: ["chicken"],
    system: "skeletal",
    name: {
      vi: "Mệt mỏi gà đẻ lồng",
      en: "Cage layer fatigue",
      zh: "笼养蛋鸡疲劳症",
    },
    term: "Osteoporosis gallinarum ovipositantium",
    severity: "warning",
    factId: "chicken-medullary-bone",
    mechanism: {
      vi: "Mỗi vỏ trứng cần khoảng 2 g canxi, phần lớn huy động trong đêm khi diều đã rỗng, lấy từ xương tuỷ trong lòng xương đùi và xương chày. Khẩu phần thiếu canxi hoặc vitamin D3 thì gà rút cạn xương tuỷ rồi ăn sang cả xương đặc.",
      en: "Each shell needs about 2 g of calcium, most of it mobilised overnight when the crop is empty, drawn from the medullary bone inside femur and tibiotarsus. On a diet short of calcium or vitamin D3 the hen exhausts the medullary bone and then erodes cortical bone too.",
      zh: "每枚蛋壳约需2克钙，多在夜间嗉囊排空时动员，取自股骨与胫跗骨内的髓质骨。日粮缺钙或维生素D3时，母鸡耗尽髓质骨后继而侵蚀皮质骨。",
    },
    signs: {
      vi: "Gà đẻ sản lượng cao đột nhiên liệt, nằm nghiêng, vẫn tỉnh táo và vẫn ăn nếu với tới được. Xương đùi gãy tự phát, vỏ trứng mỏng dần trước đó.",
      en: "A high-producing hen suddenly goes down, lies on her side, remains alert and will still eat if she can reach food. Femurs fracture spontaneously, and shell quality had been thinning beforehand.",
      zh: "高产蛋鸡突然瘫痪、侧卧，神志清醒且若能够到饲料仍会采食。股骨自发性骨折，此前蛋壳已渐变薄。",
    },
    management: {
      vi: "Cho canxi dạng HẠT THÔ vào buổi chiều để canxi nằm lại trong mề suốt đêm — đúng lúc gà cần. Canxi bột mịn cho buổi sáng đi qua quá nhanh, không cứu được ban đêm.",
      en: "Feed COARSE particulate calcium in the afternoon so that it stays in the gizzard overnight — exactly when the hen needs it. Fine powdered calcium fed in the morning passes through too fast to help at night.",
      zh: "于下午投喂粗颗粒钙源，使其整夜滞留于肌胃——正值母鸡需钙之时。晨饲的细粉状钙通过过快，无助于夜间需求。",
    },
    source: KING,
    keys: ["ga liet", "cage layer fatigue", "xuong tuy", "canxi", "vo trung mong"],
  },
  {
    id: "chicken-airsacculitis",
    species: ["chicken"],
    system: "respiratory",
    name: {
      vi: "Viêm túi khí",
      en: "Airsacculitis",
      zh: "气囊炎",
    },
    term: "Aerosacculitis",
    severity: "critical",
    factId: "chicken-air-sacs",
    mechanism: {
      vi: "Phổi chim không giãn nở; không khí được chín túi khí bơm qua phổi theo một chiều, và các túi ấy len cả vào trong lòng xương. Túi khí có thành rất mỏng, gần như không có mạch máu và không có đại thực bào tuần tra như phổi — nên mầm bệnh vào đó gần như không bị chặn.",
      en: "The bird's lung does not expand; nine air sacs pump air through it in one direction, and those sacs extend even into the bones. Air sac walls are extremely thin, nearly avascular and lack the patrolling macrophages of lung tissue — so a pathogen reaching them meets almost no defence.",
      zh: "禽肺不扩张；九个气囊将空气单向泵过肺脏，且气囊延伸至骨内。气囊壁极薄、几无血管，亦无肺组织中巡查的巨噬细胞——故病原体进入后几乎不受阻拦。",
    },
    signs: {
      vi: "Thở khò khè, há mỏ thở, chảy nước mắt mũi, giảm ăn và giảm đẻ cả đàn. Mổ khám thấy túi khí đục như sương rồi đóng bã đậu vàng.",
      en: "Râles, open-mouth breathing, ocular and nasal discharge, flock-wide drops in intake and lay. At post-mortem the air sacs are cloudy, then filled with yellow caseous material.",
      zh: "呼吸啰音、张口呼吸、流泪流涕，全群采食与产蛋下降。剖检见气囊混浊，继而充满黄色干酪样物。",
    },
    management: {
      vi: "Bụi chuồng và amoniac là yếu tố khởi phát chính, nên thông gió là biện pháp gốc chứ không phải kháng sinh. Vì túi khí len vào xương, nhiễm trùng lan được tới xương — đó là lý do viêm túi khí ở gà hay kèm viêm xương tuỷ.",
      en: "House dust and ammonia are the main triggers, so ventilation, not antibiotics, is the root measure. Because the sacs extend into the bones, infection can spread there — which is why airsacculitis in poultry is often accompanied by osteomyelitis.",
      zh: "舍内粉尘与氨气为主要诱因，故通风而非抗生素才是根本措施。因气囊延伸入骨，感染可蔓延至骨——这正是禽气囊炎常伴骨髓炎的原因。",
    },
    source: KING,
    keys: ["viem tui khi", "airsacculitis", "tui khi", "thong gio", "amoniac"],
  },
]);

export const vetDiseasesOfSpecies = (species: VetSpeciesKey) =>
  vetDiseases.filter((d) => d.species.includes(species));

export const vetDisease = (id: string) => vetDiseases.find((d) => d.id === id);
