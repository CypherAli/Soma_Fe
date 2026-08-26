import type { VetFact } from "../types";

/**
 * CHÓ và MÈO — thú nhỏ, phần lâm sàng phòng khám gặp nhiều nhất.
 *
 * Nguồn: König & Liebich, *Veterinary Anatomy of Domestic Mammals*, 7th ed.
 * (2020) · Dyce, Sack & Wensing, *Textbook of Veterinary Anatomy*, 5th ed.
 * (2018) · Evans & de Lahunta, *Miller's Anatomy of the Dog*, 4th ed. (2013).
 * Thuật ngữ Latin theo NAV 6th ed. (2017).
 */

const KL = "König & Liebich, Veterinary Anatomy of Domestic Mammals, 7th ed. (2020)";
const MILLER = "Evans & de Lahunta, Miller's Anatomy of the Dog, 4th ed. (2013)";
const DYCE = "Dyce, Sack & Wensing, Textbook of Veterinary Anatomy, 5th ed. (2018)";

export const smallAnimalFacts: VetFact[] = [
  // ---------- BỘ XƯƠNG ----------
  {
    id: "dog-dental-formula",
    species: ["dog"],
    system: "digestive",
    region: "head",
    name: { vi: "Công thức răng chó", en: "Dental formula of the dog", zh: "犬齿式" },
    nav: "Dentes permanentes",
    note: {
      vi: "Chó trưởng thành có 42 răng vĩnh viễn: 2×(I 3/3, C 1/1, P 4/4, M 2/3). Răng sữa chỉ có 28 chiếc (không có răng hàm M) và mọc đủ lúc 6–8 tuần; thay răng xong khoảng 6–7 tháng tuổi. Răng ăn thịt (carnassial) là P4 hàm trên và M1 hàm dưới — cặp răng lớn nhất, cắt như lưỡi kéo.",
      en: "The adult dog has 42 permanent teeth: 2×(I 3/3, C 1/1, P 4/4, M 2/3). The deciduous set has only 28 teeth (no molars) and is complete by 6–8 weeks; permanent dentition is in place by about 6–7 months. The carnassial pair — upper P4 and lower M1 — are the largest cheek teeth and shear against each other like scissor blades.",
      zh: "成年犬有 42 枚恒齿：2×(I 3/3, C 1/1, P 4/4, M 2/3)。乳齿仅 28 枚（无臼齿），6–8 周龄出齐，约 6–7 月龄换牙完成。裂齿为上颌 P4 与下颌 M1，是最大的颊齿，如剪刀般剪切。",
    },
    compare: {
      vi: "Người 32 răng, răng hàm phẳng để nghiền; chó 42 răng, thân răng nhọn hình chóp để cắt và giữ mồi. Chó không nhai theo kiểu nghiền ngang — khớp thái dương hàm chỉ cho chuyển động lên xuống.",
      en: "Humans have 32 teeth with flat grinding molars; the dog has 42 teeth with pointed cusps built for cutting and holding. Dogs cannot grind laterally — the temporomandibular joint allows essentially only a hinge movement.",
      zh: "人有 32 枚牙、臼齿面平用于研磨；犬有 42 枚牙、牙尖锐利，用于切割与咬持。犬不能横向研磨——颞下颌关节基本只能作铰链式开合。",
    },
    clinical: {
      vi: "Răng sữa nanh không rụng (persistent deciduous canine) rất hay gặp ở chó nhỏ giống toy, phải nhổ để tránh lệch khớp cắn và bệnh nha chu. Răng ăn thịt P4 hàm trên là răng hay gãy nhất do gặm xương, và áp-xe chân răng của nó gây rò dưới mắt.",
      en: "Persistent deciduous canines are common in toy breeds and must be extracted to prevent malocclusion and periodontal disease. The upper P4 carnassial is the tooth most often fractured by bone chewing; a root abscess of this tooth drains as the classic infraorbital fistula below the eye.",
      zh: "小型玩赏犬常见乳犬齿滞留，需拔除以免咬合不正与牙周病。上颌 P4 裂齿因啃骨最易折断，其齿根脓肿可在眼下形成典型的眶下瘘管。",
    },
    source: MILLER,
    keys: ["cong thuc rang cho", "rang cho", "carnassial", "dental formula dog"],
  },
  {
    id: "cat-dental-formula",
    species: ["cat"],
    system: "digestive",
    region: "head",
    name: { vi: "Công thức răng mèo", en: "Dental formula of the cat", zh: "猫齿式" },
    nav: "Dentes permanentes",
    note: {
      vi: "Mèo trưởng thành có 30 răng vĩnh viễn: 2×(I 3/3, C 1/1, P 3/2, M 1/1). Ít răng hơn chó vì tiêu giảm các răng tiền hàm và hàm — mèo là loài ăn thịt bắt buộc, hầu như không nghiền thức ăn. Răng ăn thịt cũng là P4 trên và M1 dưới.",
      en: "The adult cat has 30 permanent teeth: 2×(I 3/3, C 1/1, P 3/2, M 1/1). It has fewer teeth than the dog because premolars and molars are reduced — the cat is an obligate carnivore and barely grinds food at all. The carnassials are again upper P4 and lower M1.",
      zh: "成年猫有 30 枚恒齿：2×(I 3/3, C 1/1, P 3/2, M 1/1)。因前臼齿与臼齿退化而少于犬——猫为专性肉食动物，几乎不研磨食物。裂齿同为上颌 P4 与下颌 M1。",
    },
    compare: {
      vi: "Chó 42 răng, mèo 30 răng. Chó còn giữ răng hàm dưới M3 để nghiền chút ít (chó là loài ăn tạp thiên thịt), mèo mất hẳn.",
      en: "42 teeth in the dog against 30 in the cat. The dog keeps a lower M3 for some grinding (it is an omnivorous-leaning carnivore); the cat has lost it entirely.",
      zh: "犬 42 枚、猫 30 枚。犬保留下颌 M3 以作少量研磨（偏杂食性），猫则完全缺失。",
    },
    clinical: {
      vi: "Tổn thương tiêu răng do hủy cốt bào (FORL/tooth resorption) gặp ở hơn một phần ba mèo trưởng thành, hay bắt đầu ở P3–P4 hàm dưới; chỉ chụp X-quang trong miệng mới phân loại được, và răng đã tiêu chân thì nhổ theo kiểu cắt thân răng.",
      en: "Tooth resorption (FORL) affects over a third of adult cats, typically starting at the mandibular P3–P4; only intraoral radiographs allow classification, and teeth with resorbed roots are managed by crown amputation rather than full extraction.",
      zh: "牙吸收（FORL）见于三分之一以上成年猫，多始于下颌 P3–P4；须口内 X 线片方能分型，齿根已吸收者行冠切术而非完整拔除。",
    },
    source: KL,
    keys: ["cong thuc rang meo", "rang meo", "forl", "dental formula cat"],
  },
  {
    id: "dogcat-vertebral-formula",
    species: ["dog", "cat"],
    system: "skeletal",
    region: "trunk",
    name: { vi: "Công thức đốt sống", en: "Vertebral formula", zh: "椎式" },
    nav: "Columna vertebralis",
    note: {
      vi: "Chó và mèo: C7 T13 L7 S3 Cd20–23 (đuôi thay đổi nhiều theo giống). Bảy đốt sống cổ là hằng số của gần như mọi thú có vú, dù cổ dài hay ngắn. Ba đốt cùng hợp nhất thành xương cùng.",
      en: "Dog and cat: C7 T13 L7 S3 Cd20–23 (the caudal count varies widely with breed). Seven cervical vertebrae is near-invariant across mammals regardless of neck length. The three sacral vertebrae fuse into the sacrum.",
      zh: "犬与猫：C7 T13 L7 S3 Cd20–23（尾椎数随品种差异大）。七枚颈椎在哺乳动物中几乎恒定，与颈的长短无关。三枚荐椎融合为荐骨。",
    },
    compare: {
      vi: "Người C7 T12 L5 S5 Cc4. Chó mèo có thêm một đốt ngực (13 đôi xương sườn thay vì 12) và nhiều hơn hai đốt thắt lưng — cột sống thắt lưng dài và mềm chính là thứ cho phép chúng phi nước đại kiểu uốn lưng.",
      en: "Humans are C7 T12 L5 S5 Cc4. Dogs and cats have one extra thoracic vertebra (13 rib pairs instead of 12) and two extra lumbar vertebrae — that long, flexible lumbar spine is what allows the bounding gallop.",
      zh: "人为 C7 T12 L5 S5 Cc4。犬猫多一枚胸椎（13 对肋而非 12 对）、多两枚腰椎——腰段长而柔韧，正是其屈伸式奔跑的基础。",
    },
    clinical: {
      vi: "Thoát vị đĩa đệm Hansen type I hay xảy ra ở khoảng T12–L2 của các giống lùn sụn (dachshund, beagle, bulldog Pháp); vị trí này là bản lề giữa đoạn ngực cứng và đoạn thắt lưng mềm.",
      en: "Hansen type I disc extrusion clusters around T12–L2 in chondrodystrophic breeds (dachshund, beagle, French bulldog); that level is the hinge between the stiff thoracic and the mobile lumbar spine.",
      zh: "Hansen I 型椎间盘突出多集中于软骨发育不良品种（腊肠犬、比格犬、法斗）的 T12–L2；该处正是僵硬胸段与灵活腰段之间的枢纽。",
    },
    source: DYCE,
    keys: ["cong thuc dot song", "dot song cho meo", "vertebral formula"],
  },
  {
    id: "dogcat-clavicle",
    species: ["dog", "cat"],
    system: "skeletal",
    region: "forelimb",
    name: { vi: "Xương đòn tiêu giảm và khớp nối chi trước", en: "Reduced clavicle and the forelimb attachment", zh: "退化的锁骨与前肢连接" },
    nav: "Clavicula",
    note: {
      vi: "Chó gần như không còn xương đòn (chỉ là một mảnh gân nhỏ trong cơ đòn cánh tay, thường không thấy trên phim); mèo còn một xương đòn nhỏ hình thoi nhưng KHÔNG khớp với xương ức hay xương bả vai — nó nằm lơ lửng trong cơ. Chi trước nối vào thân hoàn toàn bằng cơ (synsarcosis), không có khớp xương nào.",
      en: "The dog's clavicle is reduced to a small tendinous intersection within the brachiocephalicus (often invisible radiographically); the cat retains a small spindle-shaped clavicle that articulates with nothing — it floats within muscle. The forelimb is attached to the trunk purely by muscle (synsarcosis), with no bony joint at all.",
      zh: "犬的锁骨退化为臂头肌内的一小段腱划（X 线常不可见）；猫保留一枚梭形小锁骨，但不与胸骨或肩胛骨形成关节，游离于肌肉之中。前肢完全以肌肉与躯干相连（肌连结），无任何骨性关节。",
    },
    compare: {
      vi: "Ở người, xương đòn chống đỡ vai ra xa thân và cho cánh tay xoay rộng để cầm nắm. Chó mèo hy sinh biên độ đó để lấy sải chân dài và giảm chấn khi chạy — bả vai trượt trên thành ngực như một cái nhíp.",
      en: "In humans the clavicle struts the shoulder away from the trunk and gives the arm the wide arc needed for manipulation. Dogs and cats trade that range for stride length and shock absorption — the scapula slides on the chest wall like a leaf spring.",
      zh: "人的锁骨把肩支离躯干，使上肢获得抓握所需的大范围活动。犬猫以此换取步幅与缓冲——肩胛骨如板簧般在胸壁上滑动。",
    },
    clinical: {
      vi: "Vì không có khớp xương, chi trước chó mèo không bao giờ 'trật khớp vai với thân' như trật khớp ức–đòn ở người; nhưng ngã từ trên cao có thể rách toác các cơ này (brachial avulsion) và làm chi trước lệch hẳn.",
      en: "Because there is no bony joint, the canine or feline forelimb never dislocates from the trunk the way a human sternoclavicular joint does; a fall from height can, however, tear these muscles (brachial avulsion) and displace the whole limb.",
      zh: "因无骨性关节，犬猫前肢不会像人的胸锁关节那样脱位；但高处坠落可撕裂这些肌肉（臂部撕脱），使整个前肢移位。",
    },
    source: MILLER,
    keys: ["xuong don cho meo", "clavicle dog cat", "synsarcosis"],
  },
  {
    id: "cat-claw-retraction",
    species: ["cat"],
    system: "integument",
    region: "forelimb",
    name: { vi: "Vuốt thu rút được của mèo", en: "The cat's retractile claw", zh: "猫的可伸缩爪" },
    nav: "Unguicula, ligamenta dorsalia elastica",
    note: {
      vi: "Đốt ngón III của mèo mang vuốt và được giữ ở tư thế thu vào nhờ dây chằng đàn hồi mặt lưng; vuốt chỉ bung ra khi cơ gấp sâu các ngón co chủ động. Vì thế trạng thái nghỉ là vuốt được cất kín, không mòn khi đi.",
      en: "The cat's third phalanx carries the claw and is held retracted by dorsal elastic ligaments; the claw is protracted only by active contraction of the deep digital flexor. The resting state is therefore claw-sheathed, so it never wears down on the ground.",
      zh: "猫的第三指（趾）骨携爪，由背侧弹性韧带维持于收回位；仅当指深屈肌主动收缩时爪方伸出。故静息时爪被收鞘，行走不磨损。",
    },
    compare: {
      vi: "Chó không có cơ chế này: vuốt luôn lộ, chạm đất khi đi nên mòn tự nhiên và cùn. Đó là lý do vết cào của mèo sắc và sâu hơn hẳn, còn vuốt chó thì dùng để bám khi chạy.",
      en: "The dog has no such mechanism: its claws are permanently exposed, contact the ground and are worn blunt. Hence a cat scratch is far sharper and deeper, while dog claws serve as running spikes.",
      zh: "犬无此机制：爪常露、着地磨钝。故猫抓伤远比犬更锐深，而犬爪用于奔跑抓地。",
    },
    clinical: {
      vi: "Cắt vuốt kiểu onychectomy thực chất là cắt bỏ cả đốt ngón III, gây đau mạn và thay đổi dáng đi — nhiều nước đã cấm. Vuốt mọc quá dài ở mèo già hoặc mèo ít vận động có thể xuyên vào đệm thịt.",
      en: "Onychectomy is in fact amputation of the entire third phalanx, causing chronic pain and altered gait — it is banned in many countries. In old or inactive cats an overgrown claw can curl into the digital pad.",
      zh: "去爪术实为切除整个第三指骨，可致慢性疼痛与步态改变，多国已禁止。老年或活动少的猫，爪过长可刺入趾垫。",
    },
    source: KL,
    keys: ["vuot meo", "retractile claw", "onychectomy"],
  },
  {
    id: "dog-gastric-torsion-anatomy",
    species: ["dog"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Dạ dày chó và cơ sở giải phẫu của xoắn dạ dày", en: "The dog's stomach and the anatomy behind GDV", zh: "犬胃与胃扩张扭转的解剖基础" },
    nav: "Ventriculus, ligamentum hepatogastricum",
    note: {
      vi: "Dạ dày chó là dạ dày đơn giản, dung tích lớn, nằm gần như hoàn toàn trong vòm sườn khi rỗng. Nó chỉ được cố định chắc ở hai đầu — tâm vị bởi thực quản, môn vị bởi tá tràng và mạc nối nhỏ — còn phần thân thì tự do trong ổ bụng.",
      en: "The dog's stomach is a simple, capacious single-chambered organ lying almost entirely within the costal arch when empty. It is firmly anchored only at its two ends — the cardia by the oesophagus and the pylorus by the duodenum and lesser omentum — while the body hangs free.",
      zh: "犬胃为单室简单胃，容量大，空虚时几乎完全位于肋弓内。仅两端被牢固固定——贲门借食管、幽门借十二指肠与小网膜——胃体则游离于腹腔。",
    },
    compare: {
      vi: "Cùng là dạ dày đơn như người, nhưng người có mạc treo ngắn và tư thế đứng nên dạ dày ít xoay; chó ngực sâu (Great Dane, becgie) có khoang bụng trước rộng, dạ dày căng hơi có thể xoay quanh trục thực quản–môn vị tới 180–360°.",
      en: "It is a simple stomach as in humans, but the human stomach is held short by its mesentery and the upright posture; in deep-chested dogs (Great Dane, German shepherd) the roomy cranial abdomen lets a gas-filled stomach rotate 180–360° about the oesophago-pyloric axis.",
      zh: "与人同为单室胃，但人体直立且系膜短，胃不易旋转；深胸犬种（大丹、德牧）前腹腔宽大，充气之胃可绕食管—幽门轴旋转 180–360°。",
    },
    clinical: {
      vi: "Giãn–xoắn dạ dày (GDV) là cấp cứu ngoại khoa: dạ dày xoắn làm tắc tĩnh mạch cửa và tĩnh mạch chủ sau, gây sốc trong vài giờ. Phẫu thuật gắn dạ dày vào thành bụng phải (gastropexy) là biện pháp dự phòng tái phát, dựa đúng vào chỗ yếu giải phẫu nói trên.",
      en: "Gastric dilatation–volvulus is a surgical emergency: the twisted stomach obstructs the portal vein and caudal vena cava and causes shock within hours. Right-sided gastropexy prevents recurrence by fixing precisely the anatomical weak point described above.",
      zh: "胃扩张扭转为外科急症：扭转之胃压迫门静脉与后腔静脉，数小时内致休克。右侧胃固定术正是针对上述解剖薄弱点以防复发。",
    },
    source: MILLER,
    keys: ["xoan da day cho", "gdv", "chuong hoi da day", "gastropexy"],
  },
  {
    id: "cat-obligate-carnivore-gi",
    species: ["cat"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Ống tiêu hoá mèo — loài ăn thịt bắt buộc", en: "The cat's gut — an obligate carnivore", zh: "猫的消化道——专性肉食" },
    nav: "Intestinum tenue, caecum",
    note: {
      vi: "Ruột mèo ngắn: tổng chiều dài ống tiêu hoá chỉ khoảng 4 lần chiều dài thân, manh tràng bé tí và không có ý nghĩa lên men. Thức ăn thịt tiêu hoá nhanh, không cần đoạn ruột dài để lên men chất xơ.",
      en: "The cat's gut is short: total length is only about four times body length, and the caecum is vestigial with no fermentative role. Meat is digested quickly and needs no long fermentation chamber.",
      zh: "猫肠道短：消化道全长约为体长的四倍，盲肠极小、无发酵作用。肉类消化迅速，无需长段发酵。",
    },
    compare: {
      vi: "Tỉ lệ chiều dài ruột trên thân: mèo ~4:1, chó ~6:1, lợn ~14:1, ngựa ~12:1, bò ~20:1. Con số này phản ánh thẳng khẩu phần — càng nhiều chất xơ thì đường ruột càng dài và càng có buồng lên men lớn.",
      en: "Gut-to-body-length ratios: cat ≈4:1, dog ≈6:1, pig ≈14:1, horse ≈12:1, cattle ≈20:1. The figure maps directly onto diet — the more fibre, the longer the gut and the bigger the fermentation chamber.",
      zh: "肠道与体长之比：猫约 4:1，犬约 6:1，猪约 14:1，马约 12:1，牛约 20:1。该比值直接反映食性——纤维越多，肠道越长、发酵腔越大。",
    },
    clinical: {
      vi: "Vì là loài ăn thịt bắt buộc, mèo không tự tổng hợp đủ taurine, arginine, vitamin A dạng hoạt động và acid arachidonic — cho mèo ăn khẩu phần chó hoặc khẩu phần chay gây bệnh cơ tim giãn và thoái hoá võng mạc do thiếu taurine.",
      en: "As an obligate carnivore the cat cannot make enough taurine, arginine, preformed vitamin A or arachidonic acid — feeding dog food or a vegetarian diet causes taurine-deficiency dilated cardiomyopathy and retinal degeneration.",
      zh: "作为专性肉食动物，猫无法自足合成牛磺酸、精氨酸、活性维生素 A 与花生四烯酸——喂犬粮或素食日粮可致牛磺酸缺乏性扩张型心肌病与视网膜变性。",
    },
    source: KL,
    keys: ["ruot meo", "an thit bat buoc", "taurine", "obligate carnivore"],
  },
  {
    id: "dogcat-os-penis-bone",
    species: ["dog", "cat"],
    system: "urogenital",
    region: "trunk",
    name: { vi: "Xương dương vật (os penis)", en: "The os penis", zh: "阴茎骨" },
    nav: "Os penis",
    note: {
      vi: "Chó và mèo đực có một xương thật nằm trong dương vật, mang một rãnh ở mặt bụng chứa niệu đạo. Ở chó xương này dài và chắc; ở mèo nhỏ hơn nhiều.",
      en: "Male dogs and cats have a true bone within the penis, grooved ventrally to carry the urethra. In the dog it is long and stout; in the cat much smaller.",
      zh: "公犬与公猫的阴茎内有一真骨，腹侧有沟容纳尿道。犬的较长而粗壮，猫的则小得多。",
    },
    compare: {
      vi: "Người không có xương này. Ngựa, bò và lợn cũng không — nên đây là đặc điểm phân biệt rõ của thú ăn thịt trong nhóm gia súc nuôi.",
      en: "Humans have no such bone. Neither do horses, cattle or pigs — so it is a clear distinguishing feature of the carnivores among domestic species.",
      zh: "人无此骨。马、牛、猪亦无——故为家养动物中食肉类的明显区别特征。",
    },
    clinical: {
      vi: "Rãnh niệu đạo trong xương này là chỗ hẹp nhất của đường tiểu chó đực, nên sỏi tiết niệu hầu như luôn kẹt ở đó; đặt ống thông phải men theo rãnh. Đây là kiến thức giải phẫu quyết định trong cấp cứu tắc niệu đạo.",
      en: "The urethral groove within this bone is the narrowest point of the male dog's urinary tract, so uroliths almost always lodge there; a catheter must be threaded along the groove. This is the decisive anatomical fact in urethral obstruction emergencies.",
      zh: "该骨内的尿道沟是公犬尿路最狭窄处，尿石几乎总嵌顿于此；导尿须沿沟推进。此为尿道阻塞急救中的关键解剖要点。",
    },
    source: DYCE,
    keys: ["os penis", "xuong duong vat", "tac nieu dao cho"],
  },
  {
    id: "dogcat-anal-sacs",
    species: ["dog", "cat"],
    system: "integument",
    region: "tail",
    name: { vi: "Túi hậu môn", en: "Anal sacs", zh: "肛门腺囊" },
    nav: "Sinus paranales",
    note: {
      vi: "Hai túi nằm giữa cơ thắt hậu môn trong và ngoài, ở vị trí 4 giờ và 8 giờ quanh hậu môn, đổ ra ngoài qua một ống ngắn ngay rìa hậu môn. Chất tiết nặng mùi, dùng để đánh dấu.",
      en: "A pair of sacs lying between the internal and external anal sphincters at the four- and eight-o'clock positions, draining through a short duct at the anal margin. The secretion is pungent and serves in scent marking.",
      zh: "位于肛门内、外括约肌之间，约在四点与八点位置的一对囊，经短导管开口于肛缘。分泌物气味强烈，用于标记。",
    },
    compare: {
      vi: "Người không có cấu trúc tương ứng. Đây là tuyến da biệt hoá riêng của thú ăn thịt.",
      en: "There is no human counterpart; these are specialised skin glands of carnivores.",
      zh: "人无对应结构；此为食肉动物特化的皮肤腺。",
    },
    clinical: {
      vi: "Tắc và viêm túi hậu môn là lý do khiến chó 'lê mông' trên sàn; áp-xe vỡ ra ngoài cạnh hậu môn. Cắt bỏ túi phải rất thận trọng vì thần kinh trực tràng đuôi đi ngay sát — tổn thương gây mất trương lực cơ thắt hậu môn.",
      en: "Impaction and infection make dogs scoot along the floor; abscesses rupture beside the anus. Sacculectomy demands care because the caudal rectal nerve runs immediately adjacent — damaging it leaves the anal sphincter atonic.",
      zh: "阻塞与感染使犬在地面「拖臀」；脓肿可于肛旁破溃。摘除术须谨慎，因尾直肠神经紧邻其旁，损伤可致肛门括约肌失张。",
    },
    source: MILLER,
    keys: ["tui hau mon", "anal sac", "le mong"],
  },
  {
    id: "dog-tympanic-bulla",
    species: ["dog", "cat"],
    system: "senses",
    region: "head",
    name: { vi: "Bọng nhĩ và ống tai ngoài hình chữ L", en: "Tympanic bulla and the L-shaped ear canal", zh: "鼓泡与 L 形外耳道" },
    nav: "Bulla tympanica, meatus acusticus externus",
    note: {
      vi: "Ống tai ngoài của chó mèo gồm một đoạn thẳng đứng rồi gấp gần vuông góc thành đoạn nằm ngang mới tới màng nhĩ. Tai giữa nằm trong bọng nhĩ — một khoang xương phồng ở nền sọ; ở mèo bọng nhĩ bị một vách xương chia thành hai ngăn.",
      en: "The external canal of dog and cat runs vertically, then turns nearly at a right angle into a horizontal segment before reaching the eardrum. The middle ear lies in the tympanic bulla, a bony bubble on the skull base; in the cat a bony septum divides the bulla into two compartments.",
      zh: "犬猫外耳道先垂直下行，再近乎直角转为水平段方达鼓膜。中耳位于颅底膨大的鼓泡内；猫的鼓泡被骨性隔分为两室。",
    },
    compare: {
      vi: "Ống tai người ngắn và gần như thẳng, soi tai là thấy màng nhĩ ngay. Ở chó mèo phải kéo vành tai lên và ra ngoài để duỗi thẳng chỗ gấp mới nhìn được màng nhĩ.",
      en: "The human canal is short and nearly straight, so the eardrum is seen at once. In dog and cat the pinna must be pulled up and out to straighten the bend before the eardrum comes into view.",
      zh: "人的外耳道短而近直，检耳即见鼓膜。犬猫须将耳廓向上外牵拉以拉直弯曲处，方能看到鼓膜。",
    },
    clinical: {
      vi: "Chỗ gấp giữ lại ráy và dịch viêm nên viêm tai ngoài rất hay tái phát, nhất là chó tai cụp. Ở mèo, vách chia bọng nhĩ khiến polyp mũi hầu hay nằm ở ngăn lưng và khiến hội chứng Horner xuất hiện sau can thiệp tai giữa.",
      en: "The bend traps wax and exudate, so otitis externa recurs readily, especially in drop-eared breeds. In the cat the divided bulla harbours nasopharyngeal polyps in the dorsal compartment and explains Horner's syndrome after middle-ear procedures.",
      zh: "弯曲处滞留耵聍与渗出，故外耳炎易复发，垂耳品种尤甚。猫鼓泡分隔，鼻咽息肉常位于背侧室，也解释了中耳操作后出现的霍纳氏综合征。",
    },
    source: KL,
    keys: ["bong nhi", "ong tai cho", "viem tai ngoai", "tympanic bulla"],
  },
  {
    id: "dogcat-third-eyelid",
    species: ["dog", "cat", "horse", "cattle", "pig"],
    system: "senses",
    region: "head",
    name: { vi: "Mí mắt thứ ba (màng nictitans)", en: "The third eyelid", zh: "第三眼睑（瞬膜）" },
    nav: "Palpebra tertia, glandula palpebrae tertiae",
    note: {
      vi: "Một nếp kết mạc có sụn nâng đỡ, nằm ở góc trong mắt, quét ngang giác mạc khi nhãn cầu thụt vào. Tuyến của mí thứ ba tiết khoảng 30–50% lượng nước mắt.",
      en: "A conjunctival fold supported by cartilage at the medial canthus, sweeping across the cornea as the globe retracts. Its gland produces roughly 30–50% of the tear film.",
      zh: "位于内眼角、由软骨支撑的结膜褶，眼球回缩时横扫角膜。其腺体分泌约占泪液的 30–50%。",
    },
    compare: {
      vi: "Ở người chỉ còn dấu vết là nếp bán nguyệt nhỏ ở góc trong mắt, không cử động được và không có tuyến.",
      en: "In humans only a vestige remains — the small immobile plica semilunaris at the medial canthus, without a gland.",
      zh: "人仅遗留内眼角处不能活动的半月襞，且无腺体。",
    },
    clinical: {
      vi: "Sa tuyến mí thứ ba ('cherry eye') phải khâu vùi lại chứ KHÔNG cắt bỏ — cắt tuyến gây khô mắt (KCS) suốt đời. Mí thứ ba nhô ra cả hai bên ở mèo là dấu hiệu bệnh toàn thân, một bên kèm co đồng tử là hội chứng Horner.",
      en: "Prolapse of the gland ('cherry eye') must be repositioned surgically, never excised — removal causes lifelong keratoconjunctivitis sicca. Bilateral third-eyelid protrusion in cats signals systemic illness; unilateral protrusion with miosis suggests Horner's syndrome.",
      zh: "腺体脱出（「樱桃眼」）须手术复位，切不可切除——切除将致终身干性角结膜炎。猫双侧瞬膜突出提示全身性疾病；单侧突出伴瞳孔缩小则提示霍纳氏综合征。",
    },
    source: KL,
    keys: ["mi mat thu ba", "cherry eye", "third eyelid", "nictitans"],
  },
  {
    id: "dog-thoracic-limb-weight",
    species: ["dog", "cat", "horse", "cattle"],
    system: "muscular",
    region: "forelimb",
    name: { vi: "Phân bố trọng lượng lên bốn chân", en: "Weight distribution over four limbs", zh: "四肢负重分配" },
    nav: "Membrum thoracicum, membrum pelvinum",
    note: {
      vi: "Ở thú bốn chân đứng yên, chi trước chịu khoảng 60% trọng lượng, chi sau khoảng 40%. Chi trước đỡ tải, chi sau tạo lực đẩy.",
      en: "In a standing quadruped the forelimbs carry about 60% of body weight and the hindlimbs about 40%. The forelimb supports; the hindlimb propels.",
      zh: "四足动物站立时，前肢约承担体重的 60%，后肢约 40%。前肢负重，后肢提供推进。",
    },
    compare: {
      vi: "Người đứng hai chân dồn 100% lên chi dưới, chi trên tự do hoàn toàn. Đây là khác biệt cơ học nền tảng, kéo theo mọi khác biệt về hình dạng xương chậu, cột sống và bàn chân.",
      en: "A biped puts 100% on the hindlimbs and frees the forelimbs entirely. This is the fundamental mechanical difference from which all the differences in pelvis, spine and foot shape follow.",
      zh: "人两足站立时 100% 由下肢承担，上肢完全解放。这一根本力学差异衍生出骨盆、脊柱与足形态的一切不同。",
    },
    clinical: {
      vi: "Vì thế chó què chi trước thường biểu hiện bằng gật đầu khi bước xuống chân lành, còn què chi sau thì thấy hông nhô lên bên chân đau — hai kiểu quan sát khác nhau khi khám dáng đi.",
      en: "Consequently forelimb lameness shows as a head nod that drops onto the sound limb, whereas hindlimb lameness shows as a hip hike over the painful side — two distinct observations in a gait examination.",
      zh: "因此前肢跛行表现为头随健肢着地而下点，后肢跛行则表现为患侧髋部上抬——步态检查中的两种不同观察点。",
    },
    source: DYCE,
    keys: ["phan bo trong luong", "que chan", "lameness", "weight distribution"],
  },
];
