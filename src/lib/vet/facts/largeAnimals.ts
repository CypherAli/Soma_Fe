import type { VetFact } from "../types";

/**
 * NGỰA, BÒ và LỢN — gia súc lớn và lợn.
 *
 * Nguồn: König & Liebich, *Veterinary Anatomy of Domestic Mammals*, 7th ed.
 * (2020) · Dyce, Sack & Wensing, *Textbook of Veterinary Anatomy*, 5th ed.
 * (2018) · Sisson & Grossman, *The Anatomy of the Domestic Animals*, 5th ed.
 * Thuật ngữ Latin theo NAV 6th ed. (2017).
 */

const KL = "König & Liebich, Veterinary Anatomy of Domestic Mammals, 7th ed. (2020)";
const DYCE = "Dyce, Sack & Wensing, Textbook of Veterinary Anatomy, 5th ed. (2018)";
const SISSON = "Sisson & Grossman, The Anatomy of the Domestic Animals, 5th ed.";

export const largeAnimalFacts: VetFact[] = [
  // ============================ NGỰA ============================
  {
    id: "horse-stay-apparatus",
    species: ["horse"],
    system: "muscular",
    region: "hindlimb",
    name: { vi: "Bộ máy đứng (stay apparatus)", en: "The stay apparatus", zh: "站立装置" },
    nav: "Apparatus staticus",
    note: {
      vi: "Hệ thống gân và dây chằng cho ngựa đứng ngủ mà gần như không tốn công cơ. Ở chi sau, mấu bánh chè trong móc lên mào xương bánh chè khiến khớp đùi–chày–bánh chè khoá lại; chi trước thì cơ nhị đầu và cơ gấp các ngón có phần gân chạy suốt (lacertus fibrosus, dây chằng phụ) giữ khớp thẳng.",
      en: "A system of tendons and ligaments that lets the horse sleep standing with almost no muscular effort. In the hindlimb the medial patellar ligament hooks over the trochlear ridge of the femur and locks the stifle; in the forelimb the biceps and digital flexors have through-running tendinous cords (lacertus fibrosus, accessory ligaments) that hold the joints extended.",
      zh: "一套肌腱与韧带系统，使马几乎不耗肌力即可站立睡眠。后肢的内侧膝直韧带钩挂于股骨滑车嵴而锁定膝关节；前肢的肱二头肌与指屈肌具贯通性腱索（腱弓、附韧带）维持关节伸直。",
    },
    compare: {
      vi: "Người và chó phải dùng cơ liên tục để đứng nên đều nằm khi ngủ sâu. Bò cũng nằm để nhai lại. Chỉ ngựa (và các loài họ ngựa) có cơ chế khoá khớp hoàn chỉnh này — di sản của loài thú chạy trốn trên đồng cỏ trống.",
      en: "Humans and dogs need continuous muscle activity to stand, so both lie down for deep sleep; cattle also lie to ruminate. Only the horse and its relatives have this complete joint-locking mechanism — the legacy of a flight animal on open grassland.",
      zh: "人与犬站立需持续肌肉活动，故深睡时卧下；牛亦卧地反刍。唯马属动物具备这一完整的关节锁定机制——开阔草原上逃避型动物的遗产。",
    },
    clinical: {
      vi: "Khoá bánh chè lên trên (upward fixation of the patella) là khi cơ chế này không nhả ra được: chi sau cứng ở tư thế duỗi, ngựa kéo chân theo. Ngược lại, ngựa buộc phải nằm lâu (như sau mổ) rất dễ tiêu cơ và loét tì đè vì cả cơ thể không được thiết kế để nằm.",
      en: "Upward fixation of the patella is this mechanism failing to release: the hindlimb locks in extension and the horse drags the leg. Conversely a horse forced to stay recumbent (after surgery) readily develops myopathy and pressure sores, because the whole body is not built for lying down.",
      zh: "膝盖骨上方固定即该机制无法解锁：后肢僵于伸展位，马拖行患肢。反之，被迫长期躺卧（如术后）的马易发肌病与压迫性溃疡，因其整体构造本不适于卧位。",
    },
    source: DYCE,
    keys: ["bo may dung", "stay apparatus", "ngua dung ngu", "khoa banh che"],
  },
  {
    id: "horse-hoof",
    species: ["horse"],
    system: "integument",
    region: "hindlimb",
    name: { vi: "Móng ngựa và lá móng", en: "The hoof and its laminae", zh: "马蹄与蹄叶" },
    nav: "Ungula, lamellae epidermales",
    note: {
      vi: "Ngựa đi trên một ngón duy nhất (ngón III), bao bọc trong móng sừng. Xương móng (đốt ngón III) được treo vào thành móng bằng khoảng 600 lá biểu bì lồng vào lá chân bì — không phải đặt lên nền móng. Đệm gót và vòm móng có chức năng bơm máu trở về khi bước.",
      en: "The horse walks on a single digit (III) enclosed in a horny hoof. The distal phalanx is suspended from the hoof wall by some 600 epidermal laminae interlocking with dermal laminae — it does not rest on the sole. The digital cushion and hoof arch pump blood back up with every step.",
      zh: "马以单趾（第三趾）行走，包于角质蹄内。蹄骨（第三趾骨）借约 600 片表皮蹄叶与真皮蹄叶互嵌而悬吊于蹄壁，并非坐落于蹄底。蹄枕与蹄拱在每一步中将血液泵回。",
    },
    compare: {
      vi: "Người đi bằng cả bàn chân (bàn chân dẹt tiếp đất), chó mèo đi bằng ngón, ngựa đi bằng đầu ngón — ba mức nâng cao dần: plantigrade, digitigrade, unguligrade. Bò và lợn cũng unguligrade nhưng đi trên hai ngón chẵn.",
      en: "Humans are plantigrade (whole sole down), dogs and cats digitigrade (on the toes), horses unguligrade (on the tip of the digit) — three successive degrees of elevation. Cattle and pigs are also unguligrade but walk on two even-numbered digits.",
      zh: "人为跖行（全掌着地），犬猫为趾行（以趾着地），马为蹄行（以趾端着地）——三级递进。牛与猪亦为蹄行，但以两个偶数趾着地。",
    },
    clinical: {
      vi: "Viêm lá móng (laminitis) là hư hại chính hệ treo này: xương móng tụt xuống và xoay, có thể xuyên qua nền móng. Vì thế bệnh cực đau và có thể phải chấm dứt sinh mạng — hiểu cơ chế treo là hiểu vì sao nó nặng đến vậy.",
      en: "Laminitis is failure of that suspensory system: the distal phalanx sinks and rotates and may penetrate the sole. That is why the disease is so painful and can be life-ending — understanding the suspension explains its severity.",
      zh: "蹄叶炎即该悬吊系统的破坏：蹄骨下沉并旋转，甚至穿透蹄底。故此病极痛且可致命——理解悬吊机制便理解其严重性。",
    },
    source: KL,
    keys: ["mong ngua", "laminitis", "viem la mong", "hoof"],
  },
  {
    id: "horse-large-colon",
    species: ["horse"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Đại tràng ngựa và lên men ở ruột sau", en: "The equine large colon and hindgut fermentation", zh: "马的大结肠与后肠发酵" },
    nav: "Colon crassum, caecum",
    note: {
      vi: "Ngựa lên men chất xơ ở RUỘT SAU: manh tràng dung tích 25–35 lít và đại tràng lớn gấp đôi hình chữ U kép, tổng cộng chứa được gần 100 lít. Đại tràng lớn có bốn đoạn với hai chỗ hẹp đột ngột — khúc gấp xương chậu và khúc gấp hoành phải.",
      en: "The horse ferments fibre in the HINDGUT: a caecum of 25–35 litres and a double-horseshoe large colon, together holding nearly 100 litres. The large colon has four segments with two abrupt narrowings — the pelvic flexure and the right dorsal/diaphragmatic flexure.",
      zh: "马在后肠发酵纤维：盲肠容积 25–35 升，大结肠呈双马蹄形，两者合计可容近 100 升。大结肠分四段，并有两处骨性狭窄——骨盆曲与右背（膈）曲。",
    },
    compare: {
      vi: "Bò lên men ở DẠ DÀY TRƯỚC (dạ cỏ) rồi mới tiêu hoá bằng men; ngựa tiêu hoá bằng men trước, lên men sau. Hệ quả: bò tận dụng protein vi sinh vật tốt hơn, còn ngựa ăn được cỏ chất lượng thấp nhưng đổi lại rất dễ đau bụng.",
      en: "Cattle ferment in the FOREstomach and only then digest enzymatically; the horse digests enzymatically first and ferments afterwards. As a result cattle harvest microbial protein far better, while the horse can live on poorer forage but pays for it with a colic-prone gut.",
      zh: "牛先在前胃发酵、后行酶解；马先酶解、后发酵。故牛更善于利用微生物蛋白，马虽可利用较差草料，代价是极易发生腹痛。",
    },
    clinical: {
      vi: "Hai chỗ hẹp nói trên là nơi tắc phân hay xảy ra nhất, và cả đại tràng lớn chỉ neo lỏng nên có thể di lệch hoặc xoắn. Khám qua trực tràng nhằm sờ đúng khúc gấp xương chậu là bước cơ bản khi ngựa đau bụng.",
      en: "Those two narrowings are the commonest sites of impaction, and the whole large colon is only loosely anchored, so it can displace or volvulate. Rectal palpation aimed at the pelvic flexure is a basic step in every colic examination.",
      zh: "上述两处狭窄是便塞最常见部位，且整段大结肠仅松散固定，可发生移位或扭转。腹痛检查中，经直肠触摸骨盆曲是基本步骤。",
    },
    source: DYCE,
    keys: ["dai trang ngua", "dau bung ngua", "colic", "len men ruot sau"],
  },
  {
    id: "horse-no-vomiting",
    species: ["horse"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Ngựa không nôn được", en: "Why the horse cannot vomit", zh: "马为何不能呕吐" },
    nav: "Cardia, ostium cardiacum",
    note: {
      vi: "Tâm vị ngựa có lớp cơ vòng rất dày và thực quản đi vào dạ dày theo góc rất xiên, tạo một van một chiều gần như tuyệt đối. Dạ dày lại nhỏ (8–15 lít) so với khối lượng cơ thể.",
      en: "The equine cardia has an exceptionally thick muscular ring and the oesophagus enters the stomach at a very oblique angle, forming an almost absolute one-way valve. The stomach itself is small (8–15 litres) for the body mass.",
      zh: "马的贲门肌环极厚，食管以很斜的角度进入胃，形成近乎绝对的单向阀。胃本身容积偏小（8–15 升），与体重不相称。",
    },
    compare: {
      vi: "Chó nôn rất dễ (là phản xạ bảo vệ hữu ích khi ăn phải chất độc); người nôn được; loài nhai lại thì trào ngược có chủ đích để nhai lại. Ngựa là ngoại lệ — không nôn, không nhai lại.",
      en: "Dogs vomit readily (a useful protective reflex after eating poison); humans vomit; ruminants regurgitate on purpose to chew the cud. The horse is the exception — it neither vomits nor ruminates.",
      zh: "犬极易呕吐（误食毒物时的有益保护反射）；人可呕吐；反刍动物有意逆呕以反刍。马是例外——既不呕吐也不反刍。",
    },
    clinical: {
      vi: "Vì thế dạ dày ngựa căng hơi hoặc đầy dịch có thể VỠ, và đó là lý do phải đặt ống thông mũi–dạ dày để giải áp ngay khi ngựa đau bụng nặng. Cũng vì thế không thể gây nôn để xử lý ngộ độc ở ngựa.",
      en: "A distended equine stomach can therefore RUPTURE, which is why nasogastric intubation to decompress is mandatory in severe colic. It also means poisoning in horses can never be managed by inducing emesis.",
      zh: "因此马胃胀满可致破裂，故重症腹痛必须下鼻胃管减压。也因此马中毒时无法以催吐处理。",
    },
    source: KL,
    keys: ["ngua khong non", "vo da day ngua", "ong thong mui da day"],
  },
  {
    id: "horse-guttural-pouch",
    species: ["horse"],
    system: "respiratory",
    region: "head",
    name: { vi: "Túi khí hầu (guttural pouch)", en: "The guttural pouch", zh: "咽鼓管囊（喉囊）" },
    nav: "Diverticulum tubae auditivae",
    note: {
      vi: "Hai túi khí lớn là chỗ phình của ống tai giữa, nằm hai bên vùng hầu, mỗi túi chứa được khoảng 300–500 ml. Thành túi có động mạch cảnh trong, các dây thần kinh sọ IX, X, XI, XII và thân giao cảm cổ chạy sát ngay dưới lớp niêm mạc.",
      en: "Two large air sacs, diverticula of the auditory tube, lie on either side of the pharynx and hold roughly 300–500 ml each. Their walls carry the internal carotid artery and cranial nerves IX, X, XI, XII plus the cervical sympathetic trunk immediately beneath the mucosa.",
      zh: "两个大气囊为咽鼓管的膨出，位于咽两侧，每侧容积约 300–500 毫升。囊壁黏膜下紧贴走行内颈动脉与第 IX、X、XI、XII 对脑神经及颈交感干。",
    },
    compare: {
      vi: "Người và các loài gia súc khác không có cấu trúc này — đây là đặc điểm riêng của họ ngựa. Ở người, ống tai giữa chỉ là một ống hẹp không phình thành túi.",
      en: "Neither humans nor other domestic species have this structure — it is peculiar to equids. In humans the auditory tube is a narrow channel with no such diverticulum.",
      zh: "人与其他家畜均无此结构，为马属动物特有。人的咽鼓管仅为狭窄管道，无此膨出。",
    },
    clinical: {
      vi: "Nhiễm nấm trong túi (guttural pouch mycosis) ăn mòn động mạch cảnh trong gây chảy máu mũi ồ ạt, có thể tử vong; viêm túi sau bệnh viêm hạch truyền nhiễm (strangles) tạo ổ mủ đóng cục và biến ngựa thành vật mang trùng. Tổn thương thần kinh trong thành túi gây khó nuốt hoặc hội chứng Horner.",
      en: "Guttural pouch mycosis erodes the internal carotid and causes fatal epistaxis; empyema after strangles leaves inspissated pus (chondroids) and turns the horse into a carrier. Damage to the nerves in the pouch wall causes dysphagia or Horner's syndrome.",
      zh: "喉囊真菌病可侵蚀内颈动脉致致命性鼻出血；马腺疫后的囊脓肿遗留干结脓块（软骨样体），使马成为带菌者。囊壁神经受损则致吞咽困难或霍纳氏综合征。",
    },
    source: DYCE,
    keys: ["tui khi hau", "guttural pouch", "chay mau mui ngua", "strangles"],
  },
  {
    id: "horse-splint-bones",
    species: ["horse"],
    system: "skeletal",
    region: "forelimb",
    name: { vi: "Xương bàn tiêu giảm (splint bones)", en: "The splint bones", zh: "残余掌（跖）骨" },
    nav: "Os metacarpale II et IV",
    note: {
      vi: "Ngựa chỉ còn xương bàn III chịu lực; xương bàn II và IV thoái hoá thành hai que xương mảnh áp hai bên, gọi là splint bone, không tiếp đất. Ngón I và V mất hoàn toàn.",
      en: "Only metacarpal III bears weight in the horse; metacarpals II and IV are reduced to slender splints applied to its sides and never touch the ground. Digits I and V are lost entirely.",
      zh: "马仅第三掌骨承重；第二、第四掌骨退化为贴附其两侧的细骨条，不着地。第一、第五指完全缺失。",
    },
    compare: {
      vi: "Người có đủ 5 xương bàn; chó có 5 (ngón I là ngón treo); bò và lợn còn hai ngón chức năng; ngựa chỉ còn một. Đây là chuỗi tiêu giảm ngón kinh điển theo hướng chạy nhanh trên nền cứng.",
      en: "Humans have five metacarpals; the dog has five (digit I being the dewclaw); cattle and pigs retain two functional digits; the horse just one. This is the classic reduction series toward speed on hard ground.",
      zh: "人有五枚掌骨；犬有五枚（第一指为悬趾）；牛与猪保留两个功能趾；马仅一个。这是趋向硬地高速奔跑的经典趾数退化序列。",
    },
    clinical: {
      vi: "Viêm màng xương ở chỗ dây chằng gian cốt nối splint bone với xương bàn III sinh 'splints' — cục xương nổi đau ở ngựa non tập luyện nặng. Gãy đầu dưới splint bone hay đi kèm viêm dây chằng treo móng.",
      en: "Periostitis where the interosseous ligament binds a splint bone to metacarpal III produces 'splints' — painful bony swellings in young horses in hard training. Fracture of the distal splint bone often accompanies suspensory ligament desmitis.",
      zh: "骨间韧带将残余掌骨与第三掌骨相连处的骨膜炎形成「掌骨骨瘤」——重训幼马的疼痛性骨性隆起。远端残余掌骨骨折常伴悬韧带炎。",
    },
    source: SISSON,
    keys: ["splint bone", "xuong ban ngua", "metacarpal"],
  },

  // ============================ BÒ ============================
  {
    id: "cattle-four-stomachs",
    species: ["cattle"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Bốn túi dạ dày của loài nhai lại", en: "The four-chambered ruminant stomach", zh: "反刍动物的四室胃" },
    nav: "Rumen, reticulum, omasum, abomasum",
    note: {
      vi: "Dạ cỏ (rumen) 100–200 lít chiếm gần hết nửa bụng trái; dạ tổ ong (reticulum) nhỏ, nằm trước nhất, sát cơ hoành ngang mức xương sườn 6–7; dạ lá sách (omasum) có hàng trăm lá hút nước; dạ múi khế (abomasum) là dạ dày thật, tiết HCl và pepsin. Ba túi đầu là dạ dày trước, không có tuyến tiêu hoá.",
      en: "The rumen (100–200 L) fills most of the left half of the abdomen; the reticulum is small and most cranial, against the diaphragm at rib 6–7; the omasum has hundreds of laminae that absorb water; the abomasum is the true glandular stomach secreting HCl and pepsin. The first three are the forestomachs and have no digestive glands.",
      zh: "瘤胃（100–200 升）几乎占据左半腹；网胃小而最靠前，紧贴膈，位于第 6–7 肋水平；瓣胃具数百片瓣叶以吸收水分；真胃分泌盐酸与胃蛋白酶。前三室为前胃，无消化腺。",
    },
    compare: {
      vi: "Chó, mèo, ngựa, lợn và người đều chỉ có một túi dạ dày có tuyến. Loài nhai lại 'nuôi' vi sinh vật trong dạ cỏ để phân giải cellulose — thứ mà không enzym nào của động vật có vú làm được.",
      en: "Dog, cat, horse, pig and human all have a single glandular stomach. Ruminants instead farm microbes in the rumen to break down cellulose — something no mammalian enzyme can do.",
      zh: "犬、猫、马、猪与人均仅有一个具腺胃。反刍动物则在瘤胃中「养殖」微生物以分解纤维素——任何哺乳动物自身的酶都无法做到。",
    },
    clinical: {
      vi: "Vị trí dạ tổ ong ngay sát cơ hoành và màng ngoài tim giải thích bệnh viêm dạ tổ ong–màng tim do dị vật ('hardware disease'): dây thép, đinh lẫn trong thức ăn xuyên qua thành dạ tổ ong đâm vào màng ngoài tim. Chướng hơi dạ cỏ cấp thì chọc dò ở hõm hông TRÁI.",
      en: "The reticulum's position against the diaphragm and pericardium explains traumatic reticulopericarditis ('hardware disease'): swallowed wire or nails perforate its wall into the pericardium. Acute ruminal bloat is relieved by trocarisation in the LEFT paralumbar fossa.",
      zh: "网胃紧贴膈与心包，故有创伤性网胃—心包炎（「金属异物病」）：随饲料吞入的铁丝、钉子穿透网胃壁刺入心包。急性瘤胃胀气须在左侧肷窝穿刺放气。",
    },
    source: KL,
    keys: ["da co", "da to ong", "da la sach", "da mui khe", "rumen", "nhai lai"],
  },
  {
    id: "cattle-dental-pad",
    species: ["cattle"],
    system: "digestive",
    region: "head",
    name: { vi: "Gối răng và cách bò cắt cỏ", en: "The dental pad and how cattle graze", zh: "齿垫与牛的采食方式" },
    nav: "Pulvinus dentalis",
    note: {
      vi: "Bò không có răng cửa và răng nanh ở hàm TRÊN — thay vào đó là một tấm sừng dày gọi là gối răng. Công thức răng: 2×(I 0/4, C 0/0, P 3/3, M 3/3) = 32 răng. Bò cuộn lưỡi quanh búi cỏ rồi ép cỏ vào gối răng và dùng răng cửa hàm dưới cắt.",
      en: "Cattle have no upper incisors or canines — a thick horny dental pad replaces them. Dental formula: 2×(I 0/4, C 0/0, P 3/3, M 3/3) = 32 teeth. The animal wraps its tongue round a tuft of grass, presses it against the pad and shears with the lower incisors.",
      zh: "牛无上门齿与犬齿，代之以厚角质齿垫。齿式：2×(I 0/4, C 0/0, P 3/3, M 3/3) = 32 枚。牛以舌卷绕草束，压于齿垫，再用下门齿切断。",
    },
    compare: {
      vi: "Ngựa có đủ răng cửa cả hai hàm nên gặm được cỏ sát đất — vì thế ngựa có thể gặm trụi bãi cỏ, còn bò chỉ cắt được phần cỏ đủ dài để lưỡi cuộn. Đây là kiến thức nền của quản lý bãi chăn.",
      en: "Horses have incisors in both jaws and can crop grass close to the ground — which is why horses can graze a pasture bare while cattle can only take grass long enough for the tongue to gather. This underpins pasture management.",
      zh: "马上下颌均有门齿，可贴地啃食——故马能把草地啃光，而牛只能采食足够长以供舌卷绕的草。这是牧场管理的基础。",
    },
    clinical: {
      vi: "Xem mức mòn và thay của bốn đôi răng cửa dưới là cách đoán tuổi bò trên thực địa (răng cửa vĩnh viễn thứ nhất mọc ~2 tuổi, đủ bốn đôi ~4 tuổi).",
      en: "Wear and eruption of the four pairs of lower incisors is the field method for ageing cattle (first permanent incisor at about 2 years, all four pairs by about 4 years).",
      zh: "观察下颌四对门齿的磨损与替换是现场估算牛龄的方法（第一对恒门齿约 2 岁萌出，四对齐全约 4 岁）。",
    },
    source: DYCE,
    keys: ["goi rang", "dental pad", "rang bo", "doan tuoi bo"],
  },
  {
    id: "cattle-udder-suspension",
    species: ["cattle"],
    system: "integument",
    region: "trunk",
    name: { vi: "Vú bò và hệ thống treo", en: "The bovine udder and its suspensory apparatus", zh: "牛乳房与其悬吊装置" },
    nav: "Uber, ligamentum suspensorium uberis",
    note: {
      vi: "Vú bò gồm bốn tuyến riêng biệt (bốn 'khoang'), mỗi khoang có bể sữa và núm vú riêng, không thông nhau. Toàn bộ khối vú nặng 30–50 kg khi đầy sữa được treo bằng dây chằng treo giữa (lá đàn hồi từ thành bụng) và các lá bên.",
      en: "The bovine udder consists of four separate glands (quarters), each with its own gland sinus and teat, with no communication between them. The whole mass, 30–50 kg when full, is slung by the median suspensory ligament (elastic sheets from the abdominal wall) and lateral laminae.",
      zh: "牛乳房由四个彼此独立的腺体（乳区）组成，各有乳窦与乳头，互不相通。充满乳汁时重 30–50 公斤的整个乳房由正中悬韧带（来自腹壁的弹性板）与侧板悬吊。",
    },
    compare: {
      vi: "Vú người là hai tuyến trên thành ngực, mỗi tuyến có 15–20 ống dẫn mở riêng ở núm; bò có bốn tuyến ở vùng bẹn với ống dẫn tập trung về một bể mỗi khoang. Chó và lợn có nhiều đôi vú dọc hai bên bụng (chó 4–5 đôi, lợn 6–8 đôi).",
      en: "The human breast is a pair of glands on the chest wall, each opening by 15–20 separate ducts; the cow has four inguinal glands, each draining into a single sinus. Dogs and pigs have several pairs along the belly (dog 4–5, pig 6–8 pairs).",
      zh: "人乳房为胸壁上一对腺体，各以 15–20 条乳管开口；牛为腹股沟区四个腺体，各汇入一个乳窦。犬与猪沿腹壁有多对乳头（犬 4–5 对，猪 6–8 对）。",
    },
    clinical: {
      vi: "Vì bốn khoang độc lập, viêm vú có thể chỉ ở một khoang và điều trị theo từng khoang. Dây chằng treo giữa đứt làm vú tụt xuống, núm chĩa ra ngoài, máy vắt sữa không gắn được — lý do loại thải bò sữa rất thường gặp.",
      en: "Because the quarters are independent, mastitis can involve one quarter only and is treated quarter by quarter. Breakdown of the median suspensory ligament drops the udder and turns the teats outward so the milking cluster will not attach — a common reason for culling dairy cows.",
      zh: "四个乳区各自独立，故乳房炎可仅累及一区，并按区治疗。正中悬韧带断裂使乳房下垂、乳头外翻，挤奶杯无法附着——奶牛淘汰的常见原因。",
    },
    source: KL,
    keys: ["vu bo", "viem vu", "mastitis", "day chang treo vu"],
  },
  {
    id: "cattle-paralumbar-fossa",
    species: ["cattle"],
    system: "skeletal",
    region: "trunk",
    name: { vi: "Hõm hông trái — cửa vào ổ bụng bò", en: "The left paralumbar fossa", zh: "左侧肷窝" },
    nav: "Fossa paralumbalis",
    note: {
      vi: "Vùng tam giác lõm giữa mỏm ngang các đốt thắt lưng, xương sườn cuối và cơ chéo bụng. Bên trái, ngay dưới thành bụng là dạ cỏ; bên phải là ruột và manh tràng. Bò có 13 đôi xương sườn, công thức đốt sống C7 T13 L6 S5 Cd18–20.",
      en: "The triangular hollow between the lumbar transverse processes, the last rib and the abdominal oblique muscles. On the left the rumen lies immediately beneath the wall; on the right, intestine and caecum. Cattle have 13 rib pairs; vertebral formula C7 T13 L6 S5 Cd18–20.",
      zh: "位于腰椎横突、最后肋与腹斜肌之间的三角形凹陷。左侧腹壁下即为瘤胃，右侧为肠与盲肠。牛有 13 对肋；椎式 C7 T13 L6 S5 Cd18–20。",
    },
    compare: {
      vi: "Người không có 'hõm hông' dùng làm cửa mổ vì tư thế đứng và cơ thành bụng khác hẳn; ở bò, đây là đường vào ổ bụng chuẩn và mổ được trên con vật đang ĐỨNG, chỉ cần gây tê vùng.",
      en: "Humans have no comparable surgical fossa, given upright posture and different abdominal musculature; in cattle it is the standard approach to the abdomen and allows surgery on the STANDING animal under regional anaesthesia alone.",
      zh: "人因直立姿势与腹壁肌肉不同而无类似的手术凹窝；在牛，此处是进入腹腔的标准入路，仅需区域麻醉即可对站立的牛施术。",
    },
    clinical: {
      vi: "Mở dạ cỏ (rumenotomy), chọc hơi, mổ lấy thai và xử lý xoắn dạ múi khế đều đi qua hõm hông. Nghe và gõ vùng này để đánh giá nhu động dạ cỏ (bình thường 1–2 lần/phút) là bước khám cơ bản.",
      en: "Rumenotomy, trocarisation, caesarean section and correction of abomasal volvulus are all performed through this fossa. Auscultation and percussion here to assess ruminal contractions (normally 1–2 per minute) is a routine examination step.",
      zh: "瘤胃切开术、穿刺放气、剖宫产与真胃扭转矫正均经此窝进行。在此听诊与叩诊以评估瘤胃蠕动（正常每分钟 1–2 次）是常规检查步骤。",
    },
    source: DYCE,
    keys: ["hom hong", "paralumbar fossa", "mo da co", "rumenotomy"],
  },
  {
    id: "cattle-cloven-hoof",
    species: ["cattle", "pig"],
    system: "integument",
    region: "hindlimb",
    name: { vi: "Móng chẻ hai ngón", en: "The cloven hoof", zh: "偶蹄" },
    nav: "Ungulae, digiti III et IV",
    note: {
      vi: "Bò và lợn đi trên hai ngón chức năng III và IV, mỗi ngón có móng riêng; ngón II và V thành hai móng treo phía sau, không tiếp đất khi đi trên nền cứng. Ở bò, ngón ngoài của chân sau thường to hơn và chịu tải nhiều hơn.",
      en: "Cattle and pigs walk on two functional digits, III and IV, each with its own claw; digits II and V remain as dewclaws that do not touch firm ground. In cattle the lateral claw of the hindlimb is usually larger and carries more load.",
      zh: "牛与猪以第三、第四功能趾行走，各具一蹄；第二、第五趾退化为悬蹄，在硬地不着地。牛后肢外侧蹄通常较大且负重更多。",
    },
    compare: {
      vi: "Ngựa một ngón, bò lợn hai ngón, chó mèo bốn ngón chạm đất, người cả bàn — bốn kiểu nâng đỡ khác nhau, và mỗi kiểu quyết định bệnh chân đặc trưng của loài đó.",
      en: "One digit in the horse, two in cattle and pigs, four ground-contact digits in dog and cat, the whole sole in humans — four different support patterns, each dictating that species' characteristic foot disease.",
      zh: "马一趾、牛猪二趾、犬猫四趾着地、人全掌——四种支撑方式，各自决定该物种特有的足病。",
    },
    clinical: {
      vi: "Vì ngón ngoài chân sau chịu tải nặng hơn, loét gan bàn chân và bệnh móng thối ở bò hầu như luôn ở ngón đó; cắt sửa móng theo nguyên tắc là chuyển tải sang ngón trong. Què chân là tổn thất kinh tế lớn thứ ba của đàn bò sữa.",
      en: "Because the lateral hind claw is overloaded, sole ulcers and claw horn lesions in cattle almost always occur there; corrective trimming works by shifting load to the medial claw. Lameness is the third largest economic loss in dairy herds.",
      zh: "因后肢外侧蹄超负荷，牛的蹄底溃疡与蹄角质病变几乎总发生于此；修蹄的原理即把负荷转移至内侧蹄。跛行是奶牛群第三大经济损失。",
    },
    source: KL,
    keys: ["mong che", "cloven hoof", "que chan bo", "loet gan ban chan"],
  },
  {
    id: "cattle-jugular-groove",
    species: ["cattle", "horse"],
    system: "cardiovascular",
    region: "neck",
    name: { vi: "Rãnh tĩnh mạch cổ", en: "The jugular groove", zh: "颈静脉沟" },
    nav: "Sulcus jugularis, vena jugularis externa",
    note: {
      vi: "Rãnh dọc bên cổ giữa cơ ức–đầu và cơ đòn–cánh tay, chứa tĩnh mạch cổ ngoài — mạch to nhất dễ tiếp cận nhất trên gia súc lớn. Ép ở đầu dưới rãnh thì tĩnh mạch nổi căng lên.",
      en: "A longitudinal furrow on the side of the neck between the sternocephalicus and brachiocephalicus, containing the external jugular vein — the largest and most accessible vessel in large animals. Pressure at its lower end distends the vein.",
      zh: "颈侧胸头肌与臂头肌之间的纵沟，内含颈外静脉——大动物最粗且最易接近的血管。在沟的下端加压可使静脉充盈显现。",
    },
    compare: {
      vi: "Ở người, tĩnh mạch cổ trong nằm sâu cạnh động mạch cảnh trong bao cảnh và không dùng để lấy máu thường quy; tĩnh mạch tay là chỗ tiêm. Ở bò và ngựa, tĩnh mạch cổ ngoài là đường tiêm truyền chuẩn.",
      en: "In humans the internal jugular lies deep in the carotid sheath and is not used for routine sampling; arm veins are. In cattle and horses the external jugular is the standard route for sampling and infusion.",
      zh: "人的颈内静脉深藏于颈动脉鞘内，不作常规采血；常用上肢静脉。在牛与马，颈外静脉是采血与输液的标准途径。",
    },
    clinical: {
      vi: "Lấy máu, truyền dịch số lượng lớn và tiêm thuốc đều qua rãnh này. Ở ngựa phải cẩn thận vì động mạch cảnh chung nằm ngay sâu dưới đó — tiêm thuốc nhầm vào động mạch gây co giật và tử vong tức thì.",
      en: "Blood sampling, large-volume fluid therapy and injections all use this groove. In the horse care is essential because the common carotid artery lies just deep to it — inadvertent intra-arterial injection causes immediate seizures and death.",
      zh: "采血、大量输液与注射均经此沟。马须格外小心，因颈总动脉紧位其深面——误行动脉内注射可立即引起抽搐与死亡。",
    },
    source: DYCE,
    keys: ["ranh tinh mach co", "jugular groove", "lay mau bo", "tiem tinh mach co"],
  },

  // ============================ LỢN ============================
  {
    id: "pig-skin-model",
    species: ["pig"],
    system: "integument",
    region: "whole",
    name: { vi: "Da lợn — mô hình gần người nhất", en: "Pig skin as a human model", zh: "猪皮——最接近人的模型" },
    nav: "Integumentum commune",
    note: {
      vi: "Da lợn có lớp sừng dày, ít lông, mỡ dưới da dày và mạng mạch da theo kiểu nhánh xuyên cơ — cấu trúc và tính chất cơ học rất gần da người. Lợn cũng gần như không có tuyến mồ hôi có chức năng điều nhiệt.",
      en: "Pig skin has a thick stratum corneum, sparse hair, thick subcutis and a musculocutaneous pattern of blood supply — structurally and mechanically the closest of all domestic species to human skin. Pigs also have virtually no thermoregulatory sweat glands.",
      zh: "猪皮角质层厚、被毛稀疏、皮下脂肪厚，血供为肌皮型——在结构与力学上是家畜中最接近人皮的。猪也几乎没有具体温调节功能的汗腺。",
    },
    compare: {
      vi: "Da chó mèo mỏng hơn, lông dày, mạch da đi theo kiểu nhánh da trực tiếp — nên vạt da chó lành khác hẳn và không suy ra được cho người. Đó là lý do y học tái tạo dùng lợn làm mô hình, không dùng chó.",
      en: "Dog and cat skin is thinner, densely haired and supplied by direct cutaneous arteries — canine skin flaps therefore behave differently and do not extrapolate to humans. Hence reconstructive research uses the pig, not the dog.",
      zh: "犬猫皮较薄、被毛密，由直接皮动脉供血——故犬皮瓣行为不同，不能外推至人。因此重建医学采用猪而非犬作模型。",
    },
    clinical: {
      vi: "Vì không có tuyến mồ hôi hữu hiệu, lợn tản nhiệt bằng cách thở gấp và dầm nước — chuồng nuôi thiếu nước tắm hoặc phun sương là gây stress nhiệt thật sự, không phải chuyện tiện nghi.",
      en: "Lacking effective sweat glands, pigs lose heat by panting and wallowing — housing without wallows or sprinklers causes genuine heat stress, not merely discomfort.",
      zh: "因缺乏有效汗腺，猪靠喘息与泥浴散热——没有泥浴或喷淋的猪舍会造成真正的热应激，而非仅是舒适度问题。",
    },
    source: KL,
    keys: ["da lon", "pig skin", "stress nhiet lon", "mo hinh da nguoi"],
  },
  {
    id: "pig-inguinal-hernia",
    species: ["pig"],
    system: "urogenital",
    region: "trunk",
    name: { vi: "Ống bẹn rộng và thoát vị bẹn ở lợn", en: "The wide inguinal canal and scrotal hernia in pigs", zh: "猪的宽阔腹股沟管与腹股沟疝" },
    nav: "Canalis inguinalis",
    note: {
      vi: "Ống bẹn của lợn ngắn và rộng, vòng bẹn trong lớn hơn hẳn so với chó hay ngựa. Ở lợn đực, ống này là đường tinh hoàn đi xuống và vẫn rộng sau khi xuống.",
      en: "The pig's inguinal canal is short and wide, with an internal ring notably larger than in dog or horse. In the boar it is the route of testicular descent and remains wide afterwards.",
      zh: "猪的腹股沟管短而宽，内环明显大于犬或马。在公猪，此管为睾丸下降的通路，且下降后仍保持宽阔。",
    },
    compare: {
      vi: "Chó, mèo và ngựa có vòng bẹn hẹp hơn nên thoát vị bẹn bẩm sinh ít gặp hơn; ở lợn thì đây là tật di truyền phổ biến, tỉ lệ đủ cao để ảnh hưởng chọn giống.",
      en: "Dog, cat and horse have narrower rings, so congenital inguinal hernia is less common; in pigs it is a frequent heritable defect at rates high enough to matter in breeding selection.",
      zh: "犬、猫与马的腹股沟环较窄，故先天性腹股沟疝较少；在猪则为常见的遗传缺陷，其发生率足以影响育种选择。",
    },
    clinical: {
      vi: "Thoát vị bẹn/bìu ở lợn con thường phải mổ và loại khỏi đàn giống. Thiến lợn con qua đường bìu là thao tác thường quy, nhưng ở con có vòng bẹn rộng thì rất dễ gây thoát vị ruột sau thiến nếu không khâu đúng lớp.",
      en: "Scrotal hernia in piglets usually needs surgery and exclusion from the breeding herd. Open castration through the scrotum is routine, but in a piglet with a wide ring it readily leads to intestinal herniation unless the layers are closed correctly.",
      zh: "仔猪腹股沟／阴囊疝通常需手术，并从种群中剔除。经阴囊的开放去势为常规操作，但腹股沟环宽者若未正确缝合各层，极易术后发生肠疝。",
    },
    source: DYCE,
    keys: ["thoat vi ben lon", "hernia lon", "thien lon", "ong ben"],
  },
  {
    id: "pig-single-stomach-omnivore",
    species: ["pig"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Dạ dày và ruột lợn — ăn tạp thật sự", en: "The pig's gut — a true omnivore", zh: "猪的胃肠——真正的杂食者" },
    nav: "Ventriculus, diverticulum ventriculi, colon spirale",
    note: {
      vi: "Lợn có một dạ dày đơn nhưng mang một túi phụ nhỏ ở tâm vị (diverticulum ventriculi) và một dải mô sừng quanh tâm vị. Đại tràng cuộn thành hình xoắn ốc gọn trong bụng trái; manh tràng có dung tích đáng kể và vẫn lên men được chất xơ ở mức trung bình.",
      en: "The pig has a single stomach but with a small gastric diverticulum at the cardia and a horny area around it. The colon is coiled into a compact spiral in the left abdomen; the caecum is sizeable and still ferments a moderate amount of fibre.",
      zh: "猪为单胃，但贲门处有一小胃盲囊，周围有角质区。结肠在左腹盘成紧凑的螺旋；盲肠容积可观，仍可发酵中等量的纤维。",
    },
    compare: {
      vi: "So sánh khả năng dùng chất xơ: bò (dạ cỏ) > ngựa (manh–đại tràng) > lợn (manh tràng vừa) > chó > mèo. Ống tiêu hoá lợn giống người nhất về men và cấu tạo — nên lợn là mô hình dinh dưỡng cho người.",
      en: "Fibre-handling capacity ranks: cattle (rumen) > horse (caecum–colon) > pig (moderate caecum) > dog > cat. The pig's gut is the closest to the human in enzymes and structure, which is why it serves as a nutritional model for humans.",
      zh: "利用纤维的能力排序：牛（瘤胃）>马（盲结肠）>猪（中等盲肠）>犬>猫。猪的消化道在酶与结构上最接近人，故用作人的营养学模型。",
    },
    clinical: {
      vi: "Xoắn ruột/xoắn mạc treo là nguyên nhân chết đột ngột hay gặp ở lợn vỗ béo cho ăn nhiều bữa lớn; vùng tâm vị có mô sừng dễ loét khi khẩu phần nghiền quá mịn — loét dạ dày vùng tâm vị là bệnh của chăn nuôi công nghiệp.",
      en: "Intestinal or mesenteric volvulus is a common cause of sudden death in finishing pigs fed large infrequent meals; the horny cardiac region ulcerates readily when the diet is ground too finely — gastric ulceration of the pars oesophagea is a disease of intensive production.",
      zh: "肠或肠系膜扭转是育肥猪采食大而少餐时突然死亡的常见原因；饲料粉碎过细时贲门角质区易发溃疡——食管部胃溃疡是集约化生产的疾病。",
    },
    source: KL,
    keys: ["da day lon", "ruot lon", "loet da day lon", "an tap"],
  },
  {
    id: "pig-teeth-needle",
    species: ["pig"],
    system: "digestive",
    region: "head",
    name: { vi: "Răng nanh sữa và công thức răng lợn", en: "Needle teeth and the pig's dental formula", zh: "仔猪犬齿与猪齿式" },
    nav: "Dentes decidui, dentes permanentes",
    note: {
      vi: "Lợn có bộ răng đầy đủ nhất trong các loài gia súc: 44 răng vĩnh viễn, 2×(I 3/3, C 1/1, P 4/4, M 3/3) — đúng bộ răng nguyên thuỷ của thú có vú. Lợn con sinh ra đã có 8 răng sữa nhọn (răng nanh và răng cửa góc), gọi là 'răng kim'.",
      en: "The pig has the most complete dentition of the domestic species: 44 permanent teeth, 2×(I 3/3, C 1/1, P 4/4, M 3/3) — the ancestral mammalian formula. Piglets are born with eight sharp deciduous teeth (canines and corner incisors), the so-called needle teeth.",
      zh: "猪的牙列在家畜中最完整：恒齿 44 枚，2×(I 3/3, C 1/1, P 4/4, M 3/3)——即哺乳动物的原始齿式。仔猪出生即有 8 枚锐利乳齿（犬齿与角门齿），俗称「针齿」。",
    },
    compare: {
      vi: "44 răng của lợn nhiều hơn chó (42), người (32), mèo (30) và bò (32). Con số này phản ánh chế độ ăn tạp: lợn vừa cắn vừa nghiền được.",
      en: "The pig's 44 teeth exceed the dog's 42, the human's 32, the cat's 30 and cattle's 32. The number reflects an omnivorous diet: the pig both cuts and grinds.",
      zh: "猪的 44 枚牙多于犬 42、人 32、猫 30 与牛 32。该数目反映杂食性：猪既能切割又能研磨。",
    },
    clinical: {
      vi: "Răng kim làm rách vú lợn mẹ và mặt các con cùng ổ khi tranh vú, nên trước đây bị bấm hàng loạt; nay khuyến cáo chỉ mài tròn khi thật cần vì bấm sát gây lộ tuỷ và áp-xe. Răng nanh lợn đực trưởng thành mọc liên tục và phải cắt định kỳ để an toàn cho người nuôi.",
      en: "Needle teeth lacerate the sow's udder and littermates' faces during teat fighting, so they used to be clipped routinely; current advice is to grind them only when necessary, since close clipping exposes pulp and causes abscesses. The boar's canines grow continuously and are trimmed periodically for handler safety.",
      zh: "针齿在争乳时会划伤母猪乳房与同窝仔猪面部，过去常规剪除；现主张仅在必要时磨圆，因贴根剪断会暴露牙髓并致脓肿。公猪犬齿终生生长，须定期修剪以保障人员安全。",
    },
    source: KL,
    keys: ["rang lon", "rang kim", "needle teeth", "cong thuc rang lon"],
  },
  {
    id: "pig-heart-model",
    species: ["pig"],
    system: "cardiovascular",
    region: "trunk",
    name: { vi: "Tim lợn — quả tim gần tim người nhất", en: "The pig heart as a human analogue", zh: "猪心——最接近人心的心脏" },
    nav: "Cor, valva atrioventricularis",
    note: {
      vi: "Tim lợn trưởng thành nặng khoảng 300–500 g, kích thước và tỉ lệ buồng rất gần tim người; van hai lá, van động mạch chủ và hệ mạch vành cũng tương tự. Khác biệt chính: lợn có tĩnh mạch đơn trái (vena azygos sinistra) đổ vào xoang vành, người thì không.",
      en: "The adult pig heart weighs about 300–500 g, with chamber proportions very close to the human heart; the mitral and aortic valves and the coronary tree are likewise similar. The main difference: the pig has a left azygos vein draining into the coronary sinus, which humans lack.",
      zh: "成年猪心重约 300–500 克，腔室比例与人心极为接近；二尖瓣、主动脉瓣与冠状动脉分布亦相似。主要差异：猪有左奇静脉汇入冠状窦，人则无。",
    },
    compare: {
      vi: "Tim bò và ngựa lớn hơn nhiều và có xương tim (os cordis) trong bộ khung sợi — lợn và người thì không. Đó là lý do van tim lợn được dùng làm van sinh học cấy cho người, chứ không phải van bò dùng nguyên hình.",
      en: "Cattle and horse hearts are far larger and contain an os cordis within the fibrous skeleton; pig and human hearts do not. That is why porcine valves are used as bioprosthetic valves in humans, rather than bovine valves used whole.",
      zh: "牛与马的心脏大得多，纤维骨架中含心骨；猪与人则无。故临床采用猪瓣膜作生物瓣植入人体，而非整体使用牛瓣。",
    },
    clinical: {
      vi: "Vì sự tương đồng này, lợn là mô hình chuẩn cho phẫu thuật tim, đặt stent và nghiên cứu ghép dị loài. Trên thực địa, mốc nghe tim lợn nằm ở khoang liên sườn 3–5 bên trái, ngay sau khuỷu.",
      en: "This similarity makes the pig the standard model for cardiac surgery, stenting and xenotransplantation research. In the field, the pig's heart is auscultated in the third to fifth left intercostal space, just behind the elbow.",
      zh: "正因如此相似，猪成为心脏外科、支架置入与异种移植研究的标准模型。现场听诊猪心的位置在左侧第 3–5 肋间、紧靠肘后。",
    },
    source: DYCE,
    keys: ["tim lon", "pig heart", "van tim sinh hoc", "ghep di loai"],
  },
  {
    id: "pig-nose-snout",
    species: ["pig"],
    system: "senses",
    region: "head",
    name: { vi: "Mõm lợn và xương mõm", en: "The snout and the os rostri", zh: "猪吻与吻骨" },
    nav: "Rostrum, os rostri",
    note: {
      vi: "Đầu mõm lợn có một xương nhỏ riêng — xương mõm (os rostri) — nằm trong sụn vách mũi, cứng hoá để chịu lực khi ủi đất. Đĩa mõm giàu thụ thể xúc giác và tuyến, là cơ quan thăm dò chính của lợn.",
      en: "The tip of the pig's snout contains its own small bone, the os rostri, ossified within the nasal septal cartilage to withstand the force of rooting. The snout disc is densely supplied with tactile receptors and glands and is the pig's main exploratory organ.",
      zh: "猪吻端含一枚独有小骨——吻骨，在鼻中隔软骨内骨化，以承受拱土之力。吻盘富含触觉感受器与腺体，是猪主要的探查器官。",
    },
    compare: {
      vi: "Không loài gia súc nào khác có xương này. Mũi người, chó, bò đều chỉ có sụn ở đầu mũi.",
      en: "No other domestic species has this bone; the nose of human, dog and cattle ends in cartilage alone.",
      zh: "其他家畜均无此骨；人、犬、牛的鼻端仅为软骨。",
    },
    clinical: {
      vi: "Ủi đất là tập tính bắt buộc chứ không phải thói quen: nuôi nền cứng không cho ủi gây stress và cắn đuôi nhau. Xỏ vòng mũi để chặn ủi là biện pháp gây đau, nhiều quy chuẩn phúc lợi đã hạn chế.",
      en: "Rooting is a behavioural need, not a habit: housing on hard floors that prevents it causes stress and tail biting. Nose-ringing to stop rooting is painful and is restricted under many welfare standards.",
      zh: "拱土是行为需求而非习惯：硬地饲养无法拱土会引起应激与咬尾。为阻止拱土而穿鼻环会造成疼痛，多项福利标准已加以限制。",
    },
    source: KL,
    keys: ["mom lon", "os rostri", "ui dat", "snout"],
  },
];
