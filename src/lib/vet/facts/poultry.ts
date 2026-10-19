
import { bindContentSource } from "@/lib/content/source";
import type { VetFact } from "../types";

/**
 * GIA CẦM (gà nhà, Gallus gallus domesticus).
 *
 * Nguồn: King & McLelland, *Birds: Their Structure and Function*, 2nd ed. ·
 * Nomina Anatomica Avium, 2nd ed. (1993) · König & Liebich (phần gia cầm).
 *
 * LƯU Ý THUẬT NGỮ: giải phẫu chim dùng bộ danh pháp RIÊNG (NAA), không phải
 * NAV của thú có vú. Nhiều tên gọi không có tương ứng ở thú — "syrinx",
 * "proventriculus", "pygostyle" — nên đừng dịch bừa sang thuật ngữ thú có vú.
 */

const KING = "King & McLelland, Birds: Their Structure and Function, 2nd ed.";
const NAA = "Nomina Anatomica Avium, 2nd ed. (1993)";

export const poultryFacts: VetFact[] = bindContentSource("data:src/lib/vet/facts/poultry.ts#poultryFacts", [
  {
    id: "chicken-air-sacs",
    species: ["chicken"],
    system: "respiratory",
    region: "trunk",
    name: { vi: "Túi khí và phổi không giãn nở", en: "Air sacs and the rigid lung", zh: "气囊与不扩张的肺" },
    nav: "Sacci pneumatici, pulmo",
    note: {
      vi: "Gà có chín túi khí (một túi cổ, hai túi ngực trước, hai túi ngực sau, hai túi bụng, một túi đòn, một túi gian đòn) nối với phổi. Phổi gà nhỏ, DÍNH chặt vào xương sườn và KHÔNG giãn nở; khí đi một chiều qua các ống khí (parabronchi) nhờ hai chu kỳ thở, nên phổi luôn được thông khí kể cả khi thở ra.",
      en: "The chicken has nine air sacs (cervical, two cranial thoracic, two caudal thoracic, two abdominal, clavicular and interclavicular) connected to the lungs. The lung is small, firmly attached to the ribs and does NOT expand; air moves one-way through parabronchi over two breathing cycles, so gas exchange continues even during expiration.",
      zh: "鸡有九个气囊（颈气囊、两个前胸气囊、两个后胸气囊、两个腹气囊、锁骨气囊与锁间气囊）与肺相连。禽肺小，紧附于肋骨且不扩张；空气经副支气管作单向流动，需两个呼吸周期，故呼气时仍进行气体交换。",
    },
    compare: {
      vi: "Phổi thú có vú là túi cụt: khí vào rồi ra cùng đường, luôn còn khí cặn. Phổi chim hiệu quả hơn hẳn — đó là lý do chim bay được ở độ cao mà thú có vú đã thiếu oxy. Chim cũng KHÔNG có cơ hoành; hô hấp nhờ cử động xương ức và sườn.",
      en: "The mammalian lung is a blind sac: air enters and leaves by the same route and residual air always remains. The avian lung is far more efficient — which is why birds fly at altitudes where mammals are already hypoxic. Birds also have NO diaphragm; breathing is driven by movement of the sternum and ribs.",
      zh: "哺乳动物的肺为盲囊：气体经同一路径进出，始终残留余气。禽肺效率高得多——故鸟类可在哺乳动物已缺氧的高度飞行。鸟亦无膈；呼吸依靠胸骨与肋骨的运动。",
    },
    clinical: {
      vi: "Giữ chặt gà hoặc đè lên ngực làm gà ngạt rất nhanh vì không có cơ hoành để bù. Túi khí thông với xoang khí trong xương nên nhiễm trùng đường hô hấp lan tới xương và khớp; đây cũng là lý do gây mê gia cầm cần theo dõi rất sát.",
      en: "Restraining a bird tightly or pressing on its chest asphyxiates it quickly, since there is no diaphragm to compensate. The air sacs communicate with pneumatised bones, so respiratory infection spreads to bone and joints; this is also why avian anaesthesia demands close monitoring.",
      zh: "紧握禽体或压迫胸部会迅速导致窒息，因无膈可代偿。气囊与气化骨相通，故呼吸道感染可蔓延至骨与关节；这也是禽类麻醉需密切监护的原因。",
    },
    source: KING,
    keys: ["tui khi ga", "air sac", "phoi chim", "khong co co hoanh"],
  },
  {
    id: "chicken-crop-gizzard",
    species: ["chicken"],
    system: "digestive",
    region: "neck",
    name: { vi: "Diều, dạ dày tuyến và mề", en: "Crop, proventriculus and gizzard", zh: "嗉囊、腺胃与肌胃" },
    nav: "Ingluvies, proventriculus, ventriculus muscularis",
    note: {
      vi: "Thức ăn xuống diều (túi chứa ở thực quản, trước lối vào ngực), rồi tới dạ dày tuyến tiết HCl và pepsin, cuối cùng vào mề — khối cơ dày lót màng sừng, nghiền thức ăn cùng với sỏi nuốt vào. Gà không có răng; mề thay hoàn toàn chức năng nhai.",
      en: "Food passes into the crop (an oesophageal storage sac at the thoracic inlet), then the proventriculus which secretes HCl and pepsin, and finally the gizzard — a thick muscular mill lined by a horny membrane that grinds food together with swallowed grit. Chickens have no teeth; the gizzard replaces mastication entirely.",
      zh: "食物先入嗉囊（胸腔入口前的食管贮存囊），再至分泌盐酸与胃蛋白酶的腺胃，最后进入肌胃——内衬角质膜的厚肌质磨盘，与吞入的砂砾共同磨碎食物。鸡无牙，肌胃完全取代咀嚼。",
    },
    compare: {
      vi: "Thú có vú nhai bằng răng rồi mới nuốt; gà nuốt trước, nghiền sau. Nếu ví von: mề của gà làm việc của răng hàm, còn dạ dày tuyến làm việc của dạ dày người.",
      en: "Mammals chew before swallowing; the bird swallows first and grinds afterwards. By analogy: the gizzard does the work of the molars while the proventriculus does the work of the human stomach.",
      zh: "哺乳动物先咀嚼后吞咽；禽则先吞后磨。可作类比：肌胃行臼齿之职，腺胃行人胃之职。",
    },
    clinical: {
      vi: "Diều bị nghẽn (impacted crop) hoặc chua diều là bệnh thường gặp khi ăn chất độn chuồng, dây, cỏ dài. Thiếu sỏi trong khẩu phần chăn thả làm giảm hiệu quả nghiền của mề. Khi mổ khám, mở mề là bước tìm dị vật và độc chất.",
      en: "Impacted or sour crop is common when birds eat litter, string or long fibre. Lack of grit in free-range diets reduces gizzard grinding. At post-mortem, opening the gizzard is the step that reveals foreign bodies and toxins.",
      zh: "误食垫料、绳线或长纤维时常见嗉囊阻塞或酸嗉。放养禽日粮缺砂砾会降低肌胃研磨效率。剖检时，切开肌胃是发现异物与毒物的关键步骤。",
    },
    source: KING,
    keys: ["dieu ga", "me ga", "crop", "gizzard", "da day tuyen"],
  },
  {
    id: "chicken-cloaca",
    species: ["chicken"],
    system: "urogenital",
    region: "tail",
    name: { vi: "Ổ nhớp (cloaca)", en: "The cloaca", zh: "泄殖腔" },
    nav: "Cloaca: coprodeum, urodeum, proctodeum",
    note: {
      vi: "Một khoang chung cuối cùng nhận cả phân, nước tiểu và sản phẩm sinh dục, chia thành ba ngăn: coprodeum (phân), urodeum (niệu–sinh dục) và proctodeum (mở ra ngoài). Gà không có bàng quang; nước tiểu là urat đặc màu trắng thải cùng phân.",
      en: "A single terminal chamber receiving faeces, urine and reproductive products, divided into coprodeum (faeces), urodeum (urogenital) and proctodeum (opening outward). Chickens have no urinary bladder; urine is a white urate paste voided with the droppings.",
      zh: "末端共用腔，接纳粪便、尿液与生殖产物，分为粪道、泄殖道与肛道三部。鸡无膀胱；尿为白色尿酸盐糊状物，与粪便一同排出。",
    },
    compare: {
      vi: "Thú có vú tách ba đường: hậu môn, niệu đạo, đường sinh dục riêng (trừ vài loài đơn huyệt). Gà gộp cả ba — nên phân gà bình thường luôn có 'mũ' trắng, đó là nước tiểu chứ không phải bất thường.",
      en: "Mammals separate the three tracts — anus, urethra and genital passage (except monotremes). Birds combine all three, which is why normal chicken droppings always carry a white cap: that is urine, not an abnormality.",
      zh: "哺乳动物将三条通道分开——肛门、尿道与生殖道（单孔类除外）。禽则三者合一，故正常鸡粪总带白色「帽」，那是尿液而非异常。",
    },
    clinical: {
      vi: "Sa ổ nhớp hay gặp ở gà mái đẻ trứng quá to hoặc đẻ sớm. Xác định giới tính gà con bằng cách banh ổ nhớp (vent sexing) dựa trên gờ sinh dục rất nhỏ trong proctodeum. Thụ tinh tự nhiên là 'hôn ổ nhớp' vì gà trống không có dương vật thật.",
      en: "Cloacal prolapse is common in hens laying oversized eggs or coming into lay too early. Vent sexing of chicks reads the tiny genital eminence within the proctodeum. Natural mating is a 'cloacal kiss' — the cock has no true penis.",
      zh: "产过大蛋或过早开产的母鸡常见泄殖腔脱垂。雏鸡翻肛鉴别依据肛道内极小的生殖突起。自然交配为「泄殖腔吻」——公鸡无真正的阴茎。",
    },
    source: NAA,
    keys: ["o nhop", "cloaca", "phan ga", "vent sexing"],
  },
  {
    id: "chicken-left-ovary",
    species: ["chicken"],
    system: "urogenital",
    region: "trunk",
    name: { vi: "Chỉ buồng trứng trái phát triển", en: "Only the left ovary develops", zh: "仅左侧卵巢发育" },
    nav: "Ovarium sinistrum, oviductus sinister",
    note: {
      vi: "Ở gà mái, chỉ buồng trứng và ống dẫn trứng BÊN TRÁI phát triển; bên phải thoái hoá từ giai đoạn phôi. Ống dẫn trứng trái dài 60–70 cm gồm năm đoạn: phễu (thụ tinh), phần tạo lòng trắng, eo (tạo màng vỏ), tử cung/tuyến vỏ (tạo vỏ canxi, ~20 giờ) và âm đạo.",
      en: "In the hen only the LEFT ovary and oviduct develop; the right side regresses in the embryo. The 60–70 cm left oviduct has five parts: infundibulum (fertilisation), magnum (albumen), isthmus (shell membranes), uterus/shell gland (calcified shell, about 20 hours) and vagina.",
      zh: "母鸡仅左侧卵巢与输卵管发育，右侧于胚胎期退化。长 60–70 厘米的左输卵管分五段：漏斗部（受精）、膨大部（蛋白）、峡部（壳膜）、子宫／壳腺部（钙化蛋壳，约 20 小时）与阴道部。",
    },
    compare: {
      vi: "Thú có vú giữ cả hai buồng trứng và hai sừng tử cung. Chim bỏ hẳn một bên để giảm khối lượng khi bay — cùng lý do với xương rỗng khí.",
      en: "Mammals keep both ovaries and both uterine horns. Birds abandoned one side to save weight for flight — the same logic as pneumatised bones.",
      zh: "哺乳动物保留双侧卵巢与双子宫角。鸟类舍弃一侧以减轻飞行重量——与骨骼气化同理。",
    },
    clinical: {
      vi: "Vì trứng hình thành trong ống dẫn khoảng 24–26 giờ, gà đẻ tối đa gần một quả mỗi ngày và đẻ muộn dần trong ngày. Viêm phúc mạc do lòng đỏ (egg yolk peritonitis) xảy ra khi trứng rụng lọt ra ngoài phễu — nguyên nhân chết hay gặp của gà mái đẻ.",
      en: "Because an egg takes 24–26 hours in the oviduct, a hen can lay at most about one egg a day and lays progressively later each day. Egg yolk peritonitis occurs when an ovulated yolk misses the infundibulum — a common cause of death in laying hens.",
      zh: "蛋在输卵管中形成需 24–26 小时，故母鸡每日至多产一枚，且每日产蛋时间渐晚。排出的卵黄未被漏斗部接住即发生卵黄性腹膜炎——产蛋鸡常见死因。",
    },
    source: KING,
    keys: ["buong trung ga", "ong dan trung", "de trung", "egg yolk peritonitis"],
  },
  {
    id: "chicken-pneumatic-bones",
    species: ["chicken"],
    system: "skeletal",
    region: "whole",
    name: { vi: "Xương rỗng khí và lườn ức", en: "Pneumatic bones and the keel", zh: "含气骨与龙骨突" },
    nav: "Ossa pneumatica, carina sterni",
    note: {
      vi: "Nhiều xương của gà (xương cánh tay, xương ức, đốt sống, một số xương sọ) chứa khoang khí nối thẳng với hệ túi khí. Xương ức mang một mào lớn — lườn ức — là chỗ bám của cơ ngực chiếm tới 15–20% khối lượng cơ thể.",
      en: "Many bones of the chicken (humerus, sternum, vertebrae, some skull bones) contain air spaces continuous with the air-sac system. The sternum bears a large crest — the keel — the origin of pectoral muscles that make up 15–20% of body mass.",
      zh: "鸡的许多骨（肱骨、胸骨、椎骨、部分颅骨）含有与气囊系统相通的气腔。胸骨具大嵴——龙骨突——是占体重 15–20% 的胸肌的起点。",
    },
    compare: {
      vi: "Xương thú có vú chứa tuỷ ở mọi xương dài. Ở gà, tuỷ tạo máu tập trung nhiều hơn ở xương chi dưới và trong 'xương tuỷ' (medullary bone) — kho canxi đặc biệt hình thành ở gà mái trước khi đẻ để làm vỏ trứng.",
      en: "Mammalian long bones all contain marrow. In the chicken haematopoietic marrow is concentrated more in the leg bones, and hens form a special calcium store, medullary bone, before lay to supply the eggshell.",
      zh: "哺乳动物长骨皆含骨髓。鸡的造血骨髓更集中于腿骨，母鸡在开产前形成特殊的钙贮备——髓质骨，用以形成蛋壳。",
    },
    clinical: {
      vi: "Không truyền dịch hay tiêm vào xương rỗng khí (xương cánh tay) vì thuốc chảy thẳng vào túi khí gây chết đuối trong; đường tiêm trong xương ở gia cầm dùng xương chày hoặc xương trụ. Lườn ức nhô rõ là dấu hiệu sụt cân — đánh giá thể trạng gia cầm sờ chính chỗ này.",
      en: "Never give intraosseous fluids into a pneumatic bone (the humerus): fluid runs straight into the air sacs and drowns the bird; use the tibiotarsus or ulna instead. A prominent keel indicates weight loss — body condition scoring in poultry is done by palpating exactly there.",
      zh: "切勿经含气骨（肱骨）作骨内输液：液体会直接流入气囊致「内溺」；应使用胫跗骨或尺骨。龙骨突明显提示体重下降——禽类体况评分正是触摸此处。",
    },
    source: KING,
    keys: ["xuong rong khi", "luon uc", "keel", "pneumatic bone", "truyen dich trong xuong"],
  },
  {
    id: "chicken-syrinx",
    species: ["chicken"],
    system: "respiratory",
    region: "neck",
    name: { vi: "Syrinx — cơ quan phát âm của chim", en: "The syrinx", zh: "鸣管" },
    nav: "Syrinx",
    note: {
      vi: "Chim phát âm bằng syrinx, nằm ở chỗ khí quản chia đôi thành hai phế quản gốc, sâu trong lồng ngực — không phải bằng thanh quản. Thanh quản của chim có sụn nhưng không có dây thanh.",
      en: "Birds produce sound with the syrinx, located where the trachea divides into the two primary bronchi, deep within the thorax — not with the larynx. The avian larynx has cartilages but no vocal folds.",
      zh: "鸟以鸣管发声，位于气管分为两支主支气管处、胸腔深部，而非借喉。禽喉有软骨但无声带。",
    },
    compare: {
      vi: "Người và thú có vú phát âm ở thanh quản, ngay đầu trên khí quản. Vì syrinx nằm ở chỗ chia đôi, nhiều loài chim điều khiển hai bên độc lập và hát được hai nốt cùng lúc — điều bất khả với thanh quản người.",
      en: "Humans and mammals phonate at the larynx, at the top of the trachea. Because the syrinx sits at the bifurcation, many birds control the two sides independently and can sing two notes at once — impossible for the human larynx.",
      zh: "人与哺乳动物在气管上端的喉发声。鸣管位于分叉处，故许多鸟可分别控制两侧、同时发出两个音——人喉无法做到。",
    },
    clinical: {
      vi: "Tiếng thở khò khè hoặc mất tiếng ở gia cầm thường do tổn thương sâu tại syrinx (nấm Aspergillus, giun khí quản Syngamus) chứ không phải viêm thanh quản; nội soi phải đưa ống xuống tận chỗ chia đôi khí quản mới nhìn thấy.",
      en: "Wheezing or voice loss in poultry usually reflects disease deep at the syrinx (Aspergillus, the gapeworm Syngamus) rather than laryngitis; endoscopy must reach the tracheal bifurcation to see it.",
      zh: "禽的喘鸣或失声通常源于鸣管深部病变（曲霉、气管开口虫），而非喉炎；内镜须抵达气管分叉方能观察。",
    },
    source: NAA,
    keys: ["syrinx", "phat am chim", "khan tieng ga", "aspergillus"],
  },
  {
    id: "chicken-red-blood-cells",
    species: ["chicken"],
    system: "cardiovascular",
    region: "whole",
    name: { vi: "Hồng cầu có nhân và tim gia cầm", en: "Nucleated red cells and the avian heart", zh: "有核红细胞与禽心脏" },
    nav: "Erythrocytus, cor",
    note: {
      vi: "Hồng cầu gia cầm hình bầu dục và CÓ NHÂN. Tim gà lớn tương đối (khoảng 0,5–0,8% khối lượng cơ thể) và nhịp rất nhanh: 250–350 lần/phút ở gà trưởng thành. Thân nhiệt bình thường 40,5–42 °C.",
      en: "Avian erythrocytes are oval and NUCLEATED. The heart is relatively large (about 0.5–0.8% of body mass) and beats fast: 250–350 per minute in an adult chicken. Normal body temperature is 40.5–42 °C.",
      zh: "禽红细胞呈椭圆形且有核。心脏相对较大（约占体重 0.5–0.8%），心率快：成年鸡每分钟 250–350 次。正常体温 40.5–42 °C。",
    },
    compare: {
      vi: "Hồng cầu thú có vú mất nhân khi trưởng thành (trừ lạc đà giữ hình bầu dục nhưng vẫn không nhân). Vì thế đếm hồng cầu gia cầm bằng máy đếm tự động của thú có vú sẽ sai — máy đọc nhân thành bạch cầu.",
      en: "Mammalian red cells lose their nucleus at maturity (camelids keep an oval shape but are still anucleate). Consequently automated mammalian haematology analysers misread avian blood — they count the nuclei as leucocytes.",
      zh: "哺乳动物红细胞成熟时脱核（骆驼科呈椭圆形但仍无核）。故哺乳动物用自动血液分析仪会误读禽血——把细胞核计为白细胞。",
    },
    clinical: {
      vi: "Công thức máu gia cầm phải đếm tay trên tiêu bản. Thân nhiệt cao và nhịp tim nhanh khiến gia cầm chịu stress nhiệt kém — chỉ cần chuồng nóng thêm vài độ là chết hàng loạt.",
      en: "Avian haematology must be done manually on a smear. The high body temperature and heart rate leave little reserve against heat stress — a few degrees of extra house temperature causes mass mortality.",
      zh: "禽类血常规须在涂片上人工计数。体温高、心率快使其耐热储备很小——舍温仅升高数度即可造成大批死亡。",
    },
    source: KING,
    keys: ["hong cau ga", "nucleated rbc", "nhiet do ga", "nhip tim ga"],
  },
  {
    id: "chicken-comb-wattles",
    species: ["chicken"],
    system: "integument",
    region: "head",
    name: { vi: "Mào và tích — bộ tản nhiệt kiêm chỉ báo sức khoẻ", en: "Comb and wattles", zh: "鸡冠与肉髯" },
    nav: "Crista, palea",
    note: {
      vi: "Mào và tích là những nếp da giàu mạch máu, không có lông và không có tuyến mồ hôi; máu chảy qua đây thải nhiệt trực tiếp ra không khí. Kích thước và màu sắc phụ thuộc hormone sinh dục.",
      en: "Comb and wattles are richly vascular skin folds, featherless and without sweat glands; blood flowing through them dumps heat straight into the air. Their size and colour depend on sex hormones.",
      zh: "鸡冠与肉髯为血管丰富的皮肤褶，无羽、无汗腺；流经其中的血液将热量直接散入空气。其大小与颜色取决于性激素。",
    },
    compare: {
      vi: "Thú có vú tản nhiệt bằng mồ hôi (người, ngựa) hoặc thở gấp (chó, lợn). Gia cầm không có tuyến mồ hôi nên dựa vào thở gấp cộng với các vùng da trần này — tai thỏ giữ vai trò tương tự ở loài gặm nhấm nuôi.",
      en: "Mammals shed heat by sweating (human, horse) or panting (dog, pig). Poultry have no sweat glands and rely on panting plus these bare skin areas — the rabbit's ear plays the same role among pet mammals.",
      zh: "哺乳动物通过出汗（人、马）或喘息（犬、猪）散热。禽无汗腺，依靠喘息与这些裸露皮肤区——兔耳在宠物哺乳动物中扮演相同角色。",
    },
    clinical: {
      vi: "Mào nhợt gợi thiếu máu hoặc nhiễm ký sinh trùng; mào tím tái là dấu hiệu thiếu oxy hoặc bệnh tim–hô hấp; mào teo nhỏ ở gà mái nghĩa là đã ngừng đẻ. Đây là chỉ báo khám nhanh cả đàn.",
      en: "A pale comb suggests anaemia or parasitism; a cyanotic comb indicates hypoxia or cardio-respiratory disease; a shrunken comb in a hen means she has stopped laying. It is the quickest flock-level indicator.",
      zh: "冠色苍白提示贫血或寄生虫病；发绀提示缺氧或心肺疾病；母鸡冠萎缩表示已停产。这是群体快速判断的指标。",
    },
    source: KING,
    keys: ["mao ga", "tich ga", "comb", "wattle", "tan nhiet"],
  },
  {
    id: "chicken-medullary-bone",
    species: ["chicken"],
    system: "skeletal",
    region: "trunk",
    name: {
      vi: "Xương tuỷ — kho canxi làm vỏ trứng",
      en: "Medullary bone — the calcium store for the eggshell",
      zh: "髓质骨——蛋壳的钙库",
    },
    nav: "Os medullare",
    note: {
      vi: "Trước khi bắt đầu đẻ, estrogen khiến gà mái lấp đầy lòng tuỷ của xương đùi, xương chày và xương sườn bằng một loại xương xốp riêng gọi là xương tuỷ. Mỗi vỏ trứng cần khoảng 2 g canxi, phần lớn phải huy động trong đêm khi diều đã rỗng — xương tuỷ tan ra để cấp, rồi được xây lại vào ban ngày.",
      en: "Before lay begins, oestrogen makes the hen fill the marrow cavity of femur, tibiotarsus and ribs with a special spongy bone called medullary bone. Each shell needs about 2 g of calcium, most of it mobilised overnight when the crop is empty — medullary bone dissolves to supply it and is rebuilt during the day.",
      zh: "开产前，雌激素促使母鸡在股骨、胫跗骨与肋骨的骨髓腔内充填一种特殊的海绵状骨，称髓质骨。每枚蛋壳约需2克钙，其中大部分须于夜间嗉囊排空时动员——髓质骨溶解以供给，白昼再行重建。",
    },
    compare: {
      vi: "Không loài thú có vú nào có mô này. Người mang thai và bò vắt sữa cũng huy động canxi từ xương, nhưng lấy từ chính xương đặc và xương xốp sẵn có chứ không dựng thêm một kho riêng. Xương tuỷ chỉ thấy ở chim mái đang đẻ — đây cũng là cách các nhà cổ sinh vật xác định giới tính và trạng thái sinh sản của hoá thạch khủng long.",
      en: "No mammal has this tissue. Pregnant women and dairy cows also mobilise skeletal calcium, but from existing cortical and trabecular bone rather than by building a dedicated store. Medullary bone is found only in laying female birds — and is how palaeontologists sex dinosaur fossils and read their reproductive state.",
      zh: "哺乳类无此组织。孕妇与泌乳奶牛亦动员骨钙，但取自既有的皮质骨与松质骨，而非另建专门储库。髓质骨仅见于产蛋期雌鸟——古生物学家亦据此判定恐龙化石的性别与生殖状态。",
    },
    clinical: {
      vi: "Gà mái đẻ sản lượng cao mà khẩu phần thiếu canxi hoặc vitamin D3 sẽ rút cạn cả xương tuỷ lẫn xương đặc, dẫn tới 'mệt mỏi gà lồng' (cage layer fatigue): gà liệt, xương đùi gãy tự phát. Cho ăn canxi hạt thô vào buổi chiều để canxi còn nằm lại trong mề suốt đêm là biện pháp dựa thẳng trên giải phẫu này.",
      en: "A high-producing hen on a diet short of calcium or vitamin D3 depletes both medullary and cortical bone, giving cage layer fatigue: the hen goes down and the femur fractures spontaneously. Feeding coarse particulate calcium in the afternoon, so that it stays in the gizzard overnight, is a management measure resting directly on this anatomy.",
      zh: "高产蛋鸡若日粮缺钙或缺维生素D3，将耗竭髓质骨与皮质骨，导致笼养蛋鸡疲劳症：母鸡瘫痪，股骨自发性骨折。于下午投喂粗颗粒钙源，使其整夜滞留于肌胃，正是直接基于该解剖特点的管理措施。",
    },
    source: KING,
    keys: ["xuong tuy", "medullary bone", "vo trung", "canxi", "cage layer fatigue"],
  },
  {
    id: "chicken-caeca",
    species: ["chicken"],
    system: "digestive",
    region: "trunk",
    name: {
      vi: "Hai manh tràng của gà",
      en: "The paired caeca of the fowl",
      zh: "鸡的成对盲肠",
    },
    nav: "Caeca (intestinum caecum dextrum et sinistrum)",
    note: {
      vi: "Gà có HAI manh tràng dài 12–25 cm, mọc đối xứng ở chỗ nối ruột non với ruột già. Chúng lên men vi sinh phần xơ còn sót và hấp thu nước; chỉ nhận được phần dịch mịn vì nhu động ngược lọc lại ở lỗ manh tràng. Manh tràng xả 1–2 lần mỗi ngày, ra phân nhão màu nâu sẫm khác hẳn phân thường.",
      en: "The fowl has TWO caeca, 12–25 cm long, arising symmetrically at the junction of small and large intestine. They ferment residual fibre and absorb water, receiving only the fine fraction because antiperistalsis sorts material at the caecal openings. They empty once or twice a day as a pasty dark-brown dropping quite unlike normal faeces.",
      zh: "鸡有两条盲肠，长12–25厘米，对称起于小肠与大肠交界处。其发酵残余纤维并吸收水分，因盲肠口的逆蠕动筛选，仅接纳细微食糜。盲肠每日排空一至两次，排出糊状深褐色粪便，与常粪迥异。",
    },
    compare: {
      vi: "Người chỉ còn một manh tràng ngắn với ruột thừa tiêu giảm. Ngựa có một manh tràng khổng lồ 25–35 lít là thùng lên men chính. Chó mèo manh tràng nhỏ, gần như vô dụng. Bò không có manh tràng đáng kể vì việc lên men đã làm ở dạ cỏ. Kiểu MỘT ĐÔI manh tràng là đặc trưng của chim.",
      en: "Humans keep a single short caecum with a vestigial appendix. The horse has one enormous 25–35 litre caecum as its main fermentation vat. Dog and cat have a small, nearly functionless caecum. Cattle have no caecum worth the name, fermentation happening in the rumen. The PAIRED pattern is characteristic of birds.",
      zh: "人仅保留一条短盲肠及退化的阑尾。马有一条25–35升的巨大盲肠，为其主要发酵罐。犬猫盲肠短小，近乎无功能。牛无值得一提的盲肠，发酵在瘤胃完成。成对盲肠则为鸟类特征。",
    },
    clinical: {
      vi: "Manh tràng là nơi cư trú của Eimeria tenella (cầu trùng manh tràng) và của Histomonas meleagridis — phân manh tràng lẫn máu là dấu hiệu kinh điển của cầu trùng manh tràng. Đây cũng là ổ chứa Salmonella và Campylobacter trong chuỗi thực phẩm, nên lấy mẫu giám sát an toàn thực phẩm là lấy dịch manh tràng chứ không lấy phân trực tràng.",
      en: "The caeca house Eimeria tenella (caecal coccidiosis) and Histomonas meleagridis — bloody caecal droppings are the classic sign of caecal coccidiosis. They are also the reservoir of Salmonella and Campylobacter in the food chain, which is why food-safety surveillance samples caecal content rather than rectal faeces.",
      zh: "盲肠是柔嫩艾美耳球虫（盲肠球虫病）与火鸡组织滴虫的寄居部位——血性盲肠粪便是盲肠球虫病的典型征象。盲肠亦为食物链中沙门氏菌与弯曲菌的贮存所，故食品安全监测采集盲肠内容物而非直肠粪便。",
    },
    source: KING,
    keys: ["manh trang", "caeca", "cau trung", "coccidiosis", "salmonella"],
  },
]);
