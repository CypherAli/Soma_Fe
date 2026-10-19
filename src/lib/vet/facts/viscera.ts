
import { bindContentSource } from "@/lib/content/source";
import type { VetFact } from "../types";

/**
 * NỘI TẠNG VÀ CẤU TRÚC VÙNG — các mục gắn với mẫu vật 3D đã nạp.
 *
 * Mỗi mục ở đây tồn tại vì có MỘT ĐIỂM CỤ THỂ trên một mẫu vật để chỉ vào: gan
 * chó, tim chó, tai chó, đại tràng ngựa, khớp gối ngựa, dạ cỏ bò, khung chậu
 * bò. Đó cũng là kỷ luật đặt ra cho tệp này — không viết mục nào mà không chỉ
 * được trên mẫu vật, vì bên thú y điều nguy hiểm nhất là nói về một cấu trúc mà
 * người học không kiểm chứng được bằng mắt.
 *
 * Cách đặt điểm: dựng ảnh chiếu trực giao bằng `scripts/vet/hotspot_probe.py`,
 * chọn toạ độ trên ảnh, bắn tia vào lưới, rồi RENDER LẠI có đánh dấu để nhìn
 * xem điểm có rơi đúng cấu trúc không. Chỗ nào hình không đủ rõ để khẳng định
 * thì đặt điểm ở mức CƠ QUAN chứ không claim tên bộ phận con — thà nói ít mà
 * đúng.
 *
 * Nguồn: König & Liebich 7th ed. (2020) · Evans & de Lahunta, Miller's Anatomy
 * of the Dog 4th ed. (2013) · Dyce, Sack & Wensing 5th ed. (2018). Thuật ngữ
 * Latin theo NAV 6th ed. (2017).
 */

const KL = "König & Liebich, Veterinary Anatomy of Domestic Mammals, 7th ed. (2020)";
const MILLER = "Evans & de Lahunta, Miller's Anatomy of the Dog, 4th ed. (2013)";
const DYCE = "Dyce, Sack & Wensing, Textbook of Veterinary Anatomy, 5th ed. (2018)";

export const visceraFacts: VetFact[] = bindContentSource("data:src/lib/vet/facts/viscera.ts#visceraFacts", [
  // ── CHÓ · TIM ────────────────────────────────────────────────────────────
  {
    id: "dogcat-heart-position",
    species: ["dog", "cat"],
    system: "cardiovascular",
    region: "trunk",
    name: {
      vi: "Vị trí quả tim trong lồng ngực",
      en: "Position of the heart in the thorax",
      zh: "心脏在胸腔内的位置",
    },
    nav: "Cor",
    note: {
      vi: "Tim chó mèo nằm gần như giữa lồng ngực, chiếm khoảng khoang liên sườn 3 đến 6, hơi lệch trái. Trục dài của tim chạy chếch từ trên–trước xuống dưới–sau, mỏm tim chạm sát xương ức ở khoang liên sườn 5–6. Tim chiếm khoảng 2,5–3,5 lần bề rộng một đốt sống ngực trên phim nghiêng — thước đo VHS dùng để đánh giá tim to.",
      en: "The heart of dog and cat sits almost mid-thorax, spanning roughly the 3rd to 6th intercostal spaces and displaced slightly to the left. Its long axis runs craniodorsal to caudoventral, the apex resting near the sternum at the 5th–6th space. On a lateral radiograph it measures about 2.5–3.5 vertebral body lengths — the basis of the vertebral heart score used to judge cardiomegaly.",
      zh: "犬猫心脏几乎位于胸腔中部，约占第 3 至第 6 肋间隙，略偏左侧。心长轴自前上斜向后下，心尖于第 5–6 肋间贴近胸骨。侧位片上约相当于 2.5–3.5 个胸椎椎体长——即评估心脏增大的椎体心脏评分依据。",
    },
    compare: {
      vi: "Tim người nằm lệch trái rõ rệt và mỏm tim chỉ sang trái, vì lồng ngực người dẹt theo chiều trước–sau. Lồng ngực chó mèo dẹt theo chiều BÊN, nên tim nằm giữa hơn và nghe tim hai bên đều rõ — điều không đúng ở người.",
      en: "The human heart is markedly left-shifted with the apex pointing left, because the human chest is flattened front-to-back. The canine and feline chest is flattened side-to-side, so the heart lies more centrally and is clearly audible on both sides — which is not true in humans.",
      zh: "人的心脏明显偏左、心尖指向左侧，因人胸廓前后扁平。犬猫胸廓左右扁平，故心脏位置更居中，两侧听诊均清晰——此点与人不同。",
    },
    clinical: {
      vi: "Bốn điểm nghe van theo thứ tự PAM–T: bên TRÁI từ trên xuống là van động mạch phổi (KLS 3), van động mạch chủ (KLS 4), van hai lá (KLS 5); bên PHẢI là van ba lá (KLS 3–4). Tiếng thổi tâm thu mạnh nhất ở mỏm tim trái là dấu hiệu kinh điển của bệnh thoái hoá van hai lá — bệnh tim mắc phải hay gặp nhất ở chó nhỏ.",
      en: "The four valve auscultation points follow PAM–T: on the LEFT from dorsal to ventral, pulmonic (ICS 3), aortic (ICS 4), mitral (ICS 5); on the RIGHT, tricuspid (ICS 3–4). A systolic murmur loudest over the left apex is the classic sign of myxomatous mitral valve disease — the commonest acquired heart disease of small-breed dogs.",
      zh: "四个瓣膜听诊点按 PAM–T 顺序：左侧自上而下为肺动脉瓣（第 3 肋间）、主动脉瓣（第 4 肋间）、二尖瓣（第 5 肋间）；右侧为三尖瓣（第 3–4 肋间）。左心尖部最响的收缩期杂音是黏液瘤性二尖瓣病的典型体征——小型犬最常见的后天性心脏病。",
    },
    source: MILLER,
    keys: ["vi tri tim", "nghe tim", "VHS", "vertebral heart score", "van hai la", "tieng thoi"],
  },
  {
    id: "dogcat-aortic-arch",
    species: ["dog", "cat"],
    system: "cardiovascular",
    region: "trunk",
    name: { vi: "Cung động mạch chủ", en: "Aortic arch", zh: "主动脉弓" },
    nav: "Arcus aortae",
    note: {
      vi: "Động mạch chủ rời tâm thất trái, vòng lên rồi bẻ sang TRÁI và ra sau, đi tiếp thành động mạch chủ ngực nằm dưới cột sống. Ở chó mèo cung này chỉ cho hai nhánh lớn: thân cánh tay–đầu (brachiocephalic trunk) rồi động mạch dưới đòn trái. Thực quản và khí quản chui qua vòng do cung động mạch chủ, dây chằng động mạch và thân phổi quây lại.",
      en: "The aorta leaves the left ventricle, arches upward then bends to the LEFT and caudally, continuing as the thoracic aorta beneath the vertebral column. In dog and cat the arch gives only two large branches: the brachiocephalic trunk, then the left subclavian artery. The oesophagus and trachea pass through the ring formed by the arch, the ligamentum arteriosum and the pulmonary trunk.",
      zh: "主动脉自左心室发出，先弓向上再折向左侧并向后延续为胸主动脉，位于脊柱下方。犬猫主动脉弓仅发出两大分支：臂头干与左锁骨下动脉。食管与气管穿行于主动脉弓、动脉韧带及肺动脉干围成的环内。",
    },
    compare: {
      vi: "Cung động mạch chủ người cho BA nhánh (thân cánh tay–đầu, cảnh chung trái, dưới đòn trái); chó mèo chỉ có hai vì động mạch cảnh chung trái tách ra từ thân cánh tay–đầu. Bò và lợn còn gộp nhiều hơn nữa — chỉ một thân chung duy nhất. Biết kiểu phân nhánh của từng loài là bắt buộc khi luồn ống thông hoặc đọc hình mạch.",
      en: "The human aortic arch gives THREE branches (brachiocephalic trunk, left common carotid, left subclavian); dog and cat give only two, because the left common carotid arises from the brachiocephalic trunk. Cattle and pig consolidate further, into a single common trunk. Knowing each species' branching pattern is essential for catheterisation and for reading angiograms.",
      zh: "人的主动脉弓发出三大分支（臂头干、左颈总动脉、左锁骨下动脉）；犬猫仅两支，因左颈总动脉起自臂头干。牛与猪进一步合并为单一总干。掌握各物种的分支型式，对插管与血管造影判读必不可少。",
    },
    clinical: {
      vi: "Tồn tại cung động mạch chủ phải (PRAA) là dị tật vòng mạch hay gặp nhất: cung nằm bên phải nên vòng mạch siết lấy thực quản, thức ăn đặc không qua được. Chó con nôn ra thức ăn chưa tiêu NGAY SAU KHI cai sữa sang thức ăn đặc, thực quản phình to phía trước tim trên phim — mổ cắt dây chằng động mạch là chữa được, để muộn thì thực quản giãn vĩnh viễn.",
      en: "Persistent right aortic arch is the commonest vascular ring anomaly: the arch lies on the right, so the ring strangles the oesophagus and solid food cannot pass. The puppy regurgitates undigested food from the moment it is weaned onto solids, with the oesophagus ballooning cranial to the heart on radiographs. Surgical division of the ligamentum arteriosum is curative — left late, the oesophagus stays permanently dilated.",
      zh: "永存右主动脉弓是最常见的血管环畸形：弓位于右侧，血管环勒紧食管，固体食物无法通过。幼犬自断奶改食固体食物起即反流未消化食物，X 线可见心前食管球状扩张。手术切断动脉韧带可治愈；延误则食管永久扩张。",
    },
    source: KL,
    keys: ["cung dong mach chu", "aortic arch", "PRAA", "vong mach", "vascular ring", "non tra"],
  },

  // ── CHÓ · GAN ────────────────────────────────────────────────────────────
  {
    id: "dogcat-liver-lobes",
    species: ["dog", "cat"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Các thuỳ gan", en: "Lobes of the liver", zh: "肝叶" },
    nav: "Lobi hepatis",
    note: {
      vi: "Gan chó mèo chia thuỳ SÂU và rõ, gồm sáu thuỳ: trái ngoài, trái trong, vuông, phải trong, phải ngoài và thuỳ đuôi (thuỳ đuôi có thêm mỏm đuôi và mỏm nhú). Gan nằm gần trọn dưới vòm sườn, mặt trước áp vào cơ hoành. Ở con vật khoẻ mạnh KHÔNG sờ thấy gan quá bờ sườn cuối.",
      en: "The liver of dog and cat is deeply and clearly lobated, with six lobes: left lateral, left medial, quadrate, right medial, right lateral and caudate (the caudate bearing caudate and papillary processes). It lies almost entirely under the costal arch, its cranial surface against the diaphragm. In a healthy animal the liver is NOT palpable beyond the last rib.",
      zh: "犬猫肝分叶深而清晰，共六叶：左外叶、左内叶、方叶、右内叶、右外叶与尾状叶（尾状叶另具尾状突与乳头突）。肝几乎完全位于肋弓之下，前面贴附膈。健康动物的肝不应超出最后肋触及。",
    },
    compare: {
      vi: "Gan người chỉ chia bốn thuỳ nông, gần như một khối liền. Gan chó mèo chia sâu tới mức mỗi thuỳ gần như một cơ quan riêng có cuống mạch riêng — điều này khiến XOẮN THUỲ GAN xảy ra được ở chó mèo mà ở người thì gần như không. Đổi lại, cắt một thuỳ gan ở chó mèo dễ hơn nhiều so với cắt gan phân thuỳ ở người.",
      en: "The human liver has only four shallow lobes and is nearly a single mass. In dog and cat the division is so deep that each lobe is almost an organ in itself with its own vascular pedicle — which makes liver LOBE TORSION possible in these species, whereas it is virtually unknown in humans. In exchange, removing a single lobe is far simpler than human segmental hepatectomy.",
      zh: "人肝仅四叶且分叶浅，近乎一整块。犬猫的分叶极深，每叶几乎自成一器官并有独立血管蒂——故犬猫可发生肝叶扭转，而人几乎不见。相应地，犬猫切除单一肝叶远较人的肝段切除简便。",
    },
    clinical: {
      vi: "Sinh thiết gan qua da nhắm vào thuỳ trái ngoài, đâm kim ngay sau mỏm ức lệch trái dưới hướng dẫn siêu âm — tránh túi mật và mạch rốn gan. Gan sờ được quá bờ sườn ở chó là bất thường: nghĩ tới gan to do suy tim phải, u lympho hoặc bệnh nội tiết (cường vỏ thượng thận).",
      en: "Percutaneous liver biopsy targets the left lateral lobe, the needle entering just caudal to the xiphoid slightly to the left under ultrasound guidance — avoiding the gallbladder and the hilar vessels. A liver palpable beyond the costal arch in a dog is abnormal: think right-sided heart failure, lymphoma, or endocrine disease such as hyperadrenocorticism.",
      zh: "经皮肝活检以左外叶为目标，超声引导下于剑突后稍偏左进针，避开胆囊与肝门血管。犬肝超出肋弓可触及即属异常：应考虑右心衰、淋巴瘤或内分泌病（肾上腺皮质功能亢进）。",
    },
    source: MILLER,
    keys: ["thuy gan", "liver lobes", "sinh thiet gan", "xoan thuy gan", "gan to"],
  },
  {
    id: "dogcat-gallbladder",
    species: ["dog", "cat"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Túi mật", en: "Gallbladder", zh: "胆囊" },
    nav: "Vesica biliaris",
    note: {
      vi: "Túi hình quả lê nằm trong hố giữa thuỳ vuông và thuỳ phải trong của gan, chứa và cô đặc mật giữa các bữa. Ống túi mật hợp với ống gan thành ống mật chủ, đổ vào tá tràng ở nhú tá lớn. Ở MÈO ống mật chủ và ống tuỵ hợp lại TRƯỚC khi vào tá tràng — ở chó thì hai ống đổ riêng.",
      en: "A pear-shaped sac lying in the fossa between the quadrate and right medial lobes, storing and concentrating bile between meals. The cystic duct joins the hepatic ducts as the bile duct, which opens into the duodenum at the major duodenal papilla. In the CAT the bile duct and pancreatic duct unite BEFORE entering the duodenum — in the dog they open separately.",
      zh: "梨形囊，位于方叶与右内叶之间的胆囊窝内，在两餐之间贮存并浓缩胆汁。胆囊管与肝管合成胆总管，开口于十二指肠大乳头。猫的胆总管与胰管在进入十二指肠前即已汇合，而犬则分别开口。",
    },
    compare: {
      vi: "NGỰA VÀ HƯƠU KHÔNG CÓ TÚI MẬT — chúng ăn liên tục cả ngày nên mật chảy thẳng vào ruột, không cần chỗ chứa. Đây là ví dụ sạch nhất của nguyên tắc 'hình thái theo kiểu ăn': loài ăn theo bữa (chó, mèo, người, bò) thì có túi mật, loài gặm cỏ liên tục thì không.",
      en: "THE HORSE AND DEER HAVE NO GALLBLADDER — they eat continuously all day, so bile flows straight into the gut and no reservoir is needed. This is the cleanest illustration of form following feeding pattern: meal-eaters (dog, cat, human, ox) have a gallbladder, continuous grazers do not.",
      zh: "马与鹿无胆囊——它们全天持续采食，胆汁直接流入肠道，无需贮存。这是「形态随采食方式」原则最清晰的例证：分餐进食者（犬、猫、人、牛）有胆囊，持续采食者则无。",
    },
    clinical: {
      vi: "Mucocele túi mật ở chó là khối mật đặc như thạch làm tắc và có thể vỡ túi mật — trên siêu âm cho hình 'quả kiwi cắt đôi', là chỉ định mổ cắt túi mật. Ở mèo, do ống mật và ống tuỵ chung một lối vào, viêm đường mật thường kéo theo viêm tuỵ và viêm ruột cùng lúc — gọi là bộ ba viêm (triaditis), một hội chứng KHÔNG có ở chó.",
      en: "Canine gallbladder mucocele is a mass of gelatinous bile that obstructs and may rupture the gallbladder — the ultrasonographic 'kiwi-fruit' pattern is an indication for cholecystectomy. In the cat, because bile and pancreatic ducts share one entry, cholangitis commonly drags pancreatitis and enteritis along with it — feline triaditis, a syndrome the dog does NOT get.",
      zh: "犬胆囊黏液囊肿为胶冻样胆汁团块，可致梗阻甚至胆囊破裂——超声呈「猕猴桃切面」征，是胆囊切除的指征。猫因胆管与胰管共用一个开口，胆管炎常同时牵连胰腺炎与肠炎——称猫三联炎，此综合征犬不发生。",
    },
    source: KL,
    keys: ["tui mat", "gallbladder", "ngua khong co tui mat", "mucocele", "triaditis", "viem tuy meo"],
  },

  // ── CHÓ · TAI ────────────────────────────────────────────────────────────
  {
    id: "dogcat-ear-canal",
    species: ["dog", "cat"],
    system: "senses",
    region: "head",
    name: {
      vi: "Ống tai ngoài hình chữ L",
      en: "The L-shaped external ear canal",
      zh: "L 形外耳道",
    },
    nav: "Meatus acusticus externus",
    note: {
      vi: "Ống tai ngoài của chó mèo gồm HAI đoạn gập góc gần vuông: đoạn đứng đi từ loa tai xuống dưới, rồi gập vào trong thành đoạn ngang chạy tới màng nhĩ. Chỗ gập ấy làm ống tai thành một cái bẫy: dịch tiết, ráy và nước đọng lại ở đáy đoạn đứng chứ không tự chảy ra được.",
      en: "The external ear canal of dog and cat has TWO segments meeting at nearly a right angle: a vertical canal running down from the pinna, then bending medially into a horizontal canal that reaches the eardrum. That bend turns the canal into a trap: discharge, wax and water collect at the bottom of the vertical canal instead of draining out.",
      zh: "犬猫外耳道由近乎直角相接的两段构成：自耳廓向下的垂直部，随后向内折转为通向鼓膜的水平部。此折角使耳道成为陷阱：分泌物、耵聍与积水滞留于垂直部底部而无法自行排出。",
    },
    compare: {
      vi: "Ống tai người gần như thẳng và ngắn, nên tự làm sạch được và soi tai chỉ cần kéo nhẹ vành tai. Ống tai chó mèo dài, gập góc và có lông — muốn nhìn màng nhĩ phải kéo THẲNG loa tai lên trên và ra ngoài để duỗi chỗ gập, không làm thế thì ống soi chỉ chạm vào thành ống.",
      en: "The human ear canal is short and nearly straight, so it self-cleans and otoscopy needs only a gentle pull on the auricle. The canine and feline canal is long, angled and hairy — to see the eardrum the pinna must be pulled straight up and out to straighten the bend, otherwise the otoscope merely abuts the canal wall.",
      zh: "人的外耳道短而近直，可自洁，耳镜检查仅需轻拉耳廓。犬猫耳道长、成角且有毛——欲窥鼓膜须将耳廓向上外方拉直以展平折角，否则耳镜只能抵住道壁。",
    },
    clinical: {
      vi: "Chỗ gập chữ L là lý do giải phẫu khiến viêm tai ngoài ở chó tai cụp (Cocker, Poodle) tái đi tái lại: thuốc nhỏ khó tới đáy ống mà dịch viêm thì không thoát. Viêm mạn tính lâu ngày làm sụn ống tai vôi hoá, ống hẹp bít lại — lúc đó chỉ còn cách cắt bỏ toàn bộ ống tai kèm nạo bóng nhĩ (TECA-BO).",
      en: "The L-bend is the anatomical reason otitis externa recurs in drop-eared dogs (Cocker, Poodle): drops struggle to reach the depths while inflammatory discharge cannot escape. Long-standing inflammation calcifies the canal cartilage and the lumen closes — at which point total ear canal ablation with bulla osteotomy is the only remaining option.",
      zh: "L 形折角是垂耳犬（可卡、贵宾）外耳炎反复发作的解剖学原因：滴剂难达深部，炎性分泌物又无法排出。长期炎症使耳道软骨钙化、管腔闭塞——此时唯有全耳道切除加鼓泡骨切开术可行。",
    },
    source: MILLER,
    keys: ["ong tai", "ear canal", "viem tai ngoai", "otitis", "soi tai", "TECA"],
  },

  // ── NGỰA · ĐẠI TRÀNG ─────────────────────────────────────────────────────
  {
    id: "horse-pelvic-flexure",
    species: ["horse"],
    system: "digestive",
    region: "trunk",
    name: { vi: "Khúc gấp chậu hông", en: "Pelvic flexure", zh: "骨盆曲" },
    nav: "Flexura pelvina",
    note: {
      vi: "Chỗ ngoặt hình chữ U ở đầu sau của đại tràng lớn, nơi đại tràng bụng trái quặt ngược lên thành đại tràng lưng trái. Đây là điểm HẸP NHẤT trên toàn bộ đại tràng lớn: lòng ống thu nhỏ đột ngột ngay tại khúc quành, rồi lại nở ra ngay sau đó.",
      en: "The U-turn at the caudal end of the large colon, where the left ventral colon doubles back to become the left dorsal colon. It is the NARROWEST point of the entire large colon: the lumen contracts abruptly at the bend and widens again immediately beyond it.",
      zh: "大结肠后端的 U 形折转处，左下大结肠于此回折为左上大结肠。此处是整个大结肠最狭窄之点：肠腔于折转处骤然缩窄，其后随即又扩张。",
    },
    compare: {
      vi: "Người và chó không có cấu trúc tương đương — đại tràng của chúng đường kính khá đều. Chỗ hẹp đột ngột giữa một ống rộng là hệ quả của việc ngựa nhét cả một thùng lên men vào ổ bụng: đại tràng lớn phải gập đôi lại hai lần mới nằm vừa, và mỗi chỗ gập là một điểm yếu.",
      en: "Neither human nor dog has an equivalent — their colons are of fairly even calibre. An abrupt narrowing in the middle of a wide tube is the consequence of packing an entire fermentation vat into the abdomen: the equine large colon must fold on itself twice to fit, and every fold is a weak point.",
      zh: "人与犬无对应结构——其结肠管径较为均一。宽阔管道中骤然出现的狭窄，是将整个发酵桶塞入腹腔的后果：马的大结肠须两度折叠方能容纳，而每一处折叠都是薄弱点。",
    },
    clinical: {
      vi: "Đây là VỊ TRÍ TẮC PHÂN HAY GẶP NHẤT trong đau bụng ngựa. Ngựa ăn cỏ khô thô, uống ít nước hoặc đổi thức ăn đột ngột thì phân đóng lại đúng chỗ hẹp này. Khám trực tràng sờ thấy một khối chắc như khúc dồi ở phía trước bên trái khoang chậu là chẩn đoán gần như chắc chắn — phần lớn ca chữa nội khoa được bằng dầu khoáng và bù dịch, không phải mổ.",
      en: "This is the COMMONEST SITE OF IMPACTION in equine colic. A horse on coarse hay, drinking little, or changed abruptly onto new feed packs ingesta at exactly this narrowing. Rectal examination finding a firm sausage-like mass cranio-ventral and to the left is near-diagnostic — most cases resolve medically with mineral oil and fluids rather than surgery.",
      zh: "此处是马疝痛中最常见的阻塞部位。饲喂粗硬干草、饮水不足或突然换料的马，食糜恰在此狭窄处堆积。直肠检查于左前下方触及腊肠样坚实团块几可确诊——多数病例经石蜡油与补液内科治疗即可缓解，无需手术。",
    },
    source: DYCE,
    keys: ["khuc gap chau hong", "pelvic flexure", "tac phan", "impaction", "dau bung ngua", "colic"],
  },
  {
    id: "horse-colon-taeniae",
    species: ["horse"],
    system: "digestive",
    region: "trunk",
    name: {
      vi: "Dải cơ dọc và túi phình của đại tràng",
      en: "Taeniae and haustra of the large colon",
      zh: "大结肠的结肠带与肠袋",
    },
    nav: "Taeniae coli · Haustra coli",
    note: {
      vi: "Lớp cơ dọc của đại tràng ngựa không phủ đều mà tụ thành những DẢI dày gọi là taenia. Dải ngắn hơn ống ruột nên kéo thành ruột dồn lại thành từng TÚI PHÌNH (haustra) — chính là những ngấn nhìn thấy rõ trên mẫu vật. Số dải khác nhau theo đoạn: đại tràng bụng có 4 dải và nhiều túi phình, đại tràng lưng trái chỉ 1 dải và gần như nhẵn.",
      en: "The longitudinal muscle of the equine colon is not spread evenly but gathered into thick BANDS, the taeniae. Being shorter than the gut tube they pucker the wall into pouches — the haustra, the sacculations clearly visible on the specimen. The number of bands differs by segment: the ventral colon has four taeniae and abundant haustra, the left dorsal colon only one and is nearly smooth.",
      zh: "马结肠的纵行肌并非均匀分布，而是聚成粗厚的结肠带。因带短于肠管，遂将肠壁牵拢成袋状隆起，即标本上清晰可见的肠袋。各段带数不同：下大结肠有 4 条带、肠袋丰富，左上大结肠仅 1 条带且近乎平滑。",
    },
    compare: {
      vi: "Người có 3 dải taenia trên đại tràng, chó gần như không có dải rõ. Ngựa dùng đại tràng làm thùng lên men nên cần diện tích và thời gian lưu lâu — túi phình chính là cách kéo dài thời gian ấy. Bò không cần vì đã lên men ở dạ cỏ phía TRƯỚC, nên đại tràng bò trơn hơn nhiều.",
      en: "Humans have three taeniae on the colon; the dog has almost none that are distinct. The horse uses its colon as a fermentation vat and so needs surface area and long retention — the haustra are how that time is bought. Cattle need none of this because fermentation already happened FORWARD in the rumen, so the bovine colon is far smoother.",
      zh: "人的结肠有 3 条结肠带，犬则几无明显带。马以结肠为发酵桶，需要表面积与长滞留时间——肠袋正是争取时间的方式。牛无此需求，因发酵已在前段瘤胃完成，故牛结肠平滑得多。",
    },
    clinical: {
      vi: "Đếm số dải taenia là cách bác sĩ phẫu thuật NHẬN RA mình đang cầm đoạn ruột nào khi mở bụng ngựa — trong ổ bụng đầy ruột giống nhau, đây là mốc định danh đáng tin nhất. Nhầm đoạn khi tháo xoắn là sai lầm chết người: đặt lại đại tràng sai chiều thì xoắn tái phát ngay.",
      en: "Counting the taeniae is how the surgeon IDENTIFIES which segment is in hand during equine laparotomy — in an abdomen full of similar-looking bowel it is the most reliable landmark. Mistaking the segment while derotating is a fatal error: replace the colon the wrong way round and the volvulus recurs at once.",
      zh: "清点结肠带数是外科医生在马开腹术中辨认所持肠段的方法——腹腔内诸肠外观相近，此为最可靠的标志。整复扭转时辨错肠段是致命错误：结肠方向放反，扭转立即复发。",
    },
    source: KL,
    keys: ["taenia", "haustra", "tui phinh", "dai co doc", "xoan dai trang", "volvulus"],
  },

  // ── NGỰA · KHỚP GỐI ──────────────────────────────────────────────────────
  {
    id: "horse-patellar-locking",
    species: ["horse"],
    system: "skeletal",
    region: "hindlimb",
    name: {
      vi: "Cơ chế khoá xương bánh chè",
      en: "The patellar locking mechanism",
      zh: "髌骨锁定机制",
    },
    nav: "Patella · Ligamentum patellae mediale",
    note: {
      vi: "Ròng rọc xương đùi ngựa có gờ TRONG phình to bất thường, và xương bánh chè có thêm sụn bánh chè phụ kéo dài về phía trong. Ngựa móc vòng dây chằng bánh chè trong qua gờ ấy như móc một cái then — gối bị khoá cứng ở tư thế duỗi, chi đứng vững mà cơ tứ đầu gần như không phải co. Đây là bộ phận khoá của bộ máy đứng, thứ cho phép ngựa ngủ đứng.",
      en: "The equine femoral trochlea has a markedly enlarged MEDIAL ridge, and the patella carries an additional parapatellar fibrocartilage extending medially. The horse hooks the loop of the medial patellar ligament over that ridge like throwing a latch — the stifle locks in extension and the limb stands firm with the quadriceps barely contracting. This is the locking element of the stay apparatus, and the reason a horse can sleep standing.",
      zh: "马的股骨滑车内侧嵴异常增大，髌骨另具向内延伸的副髌软骨。马将内侧髌韧带的环套挂于该嵴之上，如同扣上门闩——膝关节即锁定于伸展位，股四头肌几乎无需收缩即可稳固站立。此为站立装置的锁定环节，亦是马能站着睡觉的原因。",
    },
    compare: {
      vi: "Không loài nào khác trong sáu loài có cơ chế này. Chó mèo phải co cơ tứ đầu liên tục để đứng (nên nằm bất cứ khi nào được); người có khoá gối nhưng bằng cách xoay khoá cơ học của lồi cầu, không bằng dây chằng móc qua gờ xương. Bò đứng lâu được nhưng bằng sức cơ chứ không có then khoá.",
      en: "No other of the six species has this. Dog and cat must contract the quadriceps continuously to stand (hence they lie down whenever they can); humans do lock the knee, but by the screw-home rotation of the condyles rather than by a ligament hooked over a bony ridge. Cattle stand for long periods on muscular effort alone, with no latch.",
      zh: "六个物种中唯马独有此机制。犬猫须持续收缩股四头肌方能站立（故一有机会即卧下）；人虽能锁膝，但依靠髁的旋锁运动，而非韧带挂于骨嵴。牛可长时间站立，却全凭肌力，并无门闩。",
    },
    clinical: {
      vi: "Then khoá có thể không nhả ra được — gọi là kẹt xương bánh chè lên trên (upward fixation of the patella): chi sau duỗi cứng về phía sau, ngựa lê móng, rồi bật ra kèm tiếng khục. Hay gặp ở ngựa non gầy, cơ đùi yếu và góc chi thẳng. Chữa trước hết bằng cho vận động và tăng khối cơ tứ đầu; cắt dây chằng bánh chè trong là biện pháp cuối cùng vì hay để lại tổn thương xương bánh chè.",
      en: "The latch can fail to release — upward fixation of the patella: the hindlimb locks rigidly in extension behind the horse, the toe drags, then it snaps free with a click. It is seen in young, thin, straight-limbed horses with poor thigh muscle. Treatment starts with exercise to build the quadriceps; medial patellar desmotomy is a last resort because it often leaves patellar damage behind.",
      zh: "门闩可能无法解除——即髌骨向上固着：后肢强直伸于体后，蹄尖拖地，随后伴弹响突然解脱。多见于消瘦、肢势过直、股部肌肉薄弱的幼马。治疗首选运动以增强股四头肌；内侧髌韧带切断术为最后手段，因常遗留髌骨损伤。",
    },
    source: DYCE,
    keys: ["khoa banh che", "patellar locking", "upward fixation", "bo may dung", "ngu dung"],
  },

  // ── BÒ · DẠ CỎ ───────────────────────────────────────────────────────────
  {
    id: "cattle-rumen-sacs",
    species: ["cattle"],
    system: "digestive",
    region: "trunk",
    name: {
      vi: "Túi lưng, túi bụng và rãnh dọc dạ cỏ",
      en: "Dorsal and ventral sacs and the longitudinal groove",
      zh: "瘤胃背囊、腹囊与纵沟",
    },
    nav: "Saccus dorsalis · Saccus ventralis · Sulcus longitudinalis",
    note: {
      vi: "Dạ cỏ chiếm gần trọn nửa trái ổ bụng bò, chia thành túi lưng và túi bụng bởi một rãnh chạy vòng quanh ngoài mặt; bên trong rãnh ấy tương ứng với các TRỤ CƠ (pillars) dày nhô vào lòng dạ cỏ. Túi lưng chứa khí lên men, túi bụng chứa phần thức ăn đặc và dịch — hai pha luôn tách lớp theo trọng lực.",
      en: "The rumen fills nearly the whole left half of the bovine abdomen and is divided into dorsal and ventral sacs by a groove encircling its exterior; internally that groove corresponds to thick muscular PILLARS projecting into the lumen. The dorsal sac holds fermentation gas, the ventral sac the solid ingesta and fluid — the two phases always stratified by gravity.",
      zh: "瘤胃几乎充满牛腹腔整个左半部，由环绕其外表面的沟分为背囊与腹囊；该沟在内部对应突入胃腔的厚实肉柱。背囊容纳发酵气体，腹囊容纳固体食糜与液体——两相始终因重力而分层。",
    },
    compare: {
      vi: "Không loài dạ dày đơn nào có cấu trúc này. Ngựa cũng lên men vi sinh nhưng đặt thùng lên men ở SAU (manh tràng và đại tràng lớn), nên ngựa không ợ hơi được và chướng hơi ở ngựa là chuyện khác hẳn. Nguyên tắc chung: lên men trước dạ dày thì thu được cả protein vi sinh, lên men sau thì không.",
      en: "No monogastric species has this. The horse also ferments microbially but places the vat BEHIND (caecum and large colon), so the horse cannot eructate and equine tympany is an entirely different problem. The general rule: fermenting before the stomach harvests the microbial protein as well, fermenting after it does not.",
      zh: "单胃动物无此结构。马亦行微生物发酵，但发酵桶置于后段（盲肠与大结肠），故马不能嗳气，其臌气是完全不同的问题。通则：胃前发酵可一并获取微生物蛋白，胃后发酵则不能。",
    },
    clinical: {
      vi: "Khí luôn nổi lên túi lưng, nên chọc dò giải áp chướng hơi dạ cỏ phải đâm vào hõm hông TRÁI, ở đỉnh tam giác giữa mỏm ngang đốt thắt lưng, xương sườn cuối và mỏm hông. Chướng hơi bọt (frothy bloat, do ăn cỏ họ đậu non) thì chọc không ra vì khí nằm trong bọt — phải cho thuốc phá bọt, chọc chỉ tổ mất thì giờ.",
      en: "Gas always rises into the dorsal sac, so trocarisation for bloat must enter the LEFT paralumbar fossa, at the apex of the triangle between the lumbar transverse processes, the last rib and the tuber coxae. Frothy bloat (from lush legume pasture) will not release through a trocar because the gas is trapped in foam — an antifoaming agent is required and trocarisation only wastes time.",
      zh: "气体恒上浮至背囊，故臌气穿刺放气须于左侧肋腹窝进针，位于腰椎横突、最后肋与髋结节所围三角的顶点。泡沫性臌气（采食幼嫩豆科牧草所致）穿刺无法放气，因气体被困于泡沫中——须投予消泡剂，穿刺徒然贻误时机。",
    },
    source: KL,
    keys: ["tui lung", "tui bung", "tru co", "rumen pillars", "chuong hoi", "bloat", "choc do da co"],
  },
  {
    id: "cattle-hardware-disease",
    species: ["cattle"],
    system: "digestive",
    region: "trunk",
    name: {
      vi: "Bệnh ngoại vật — viêm dạ tổ ong màng bụng do chấn thương",
      en: "Hardware disease — traumatic reticuloperitonitis",
      zh: "创伤性网胃腹膜炎（金属异物病）",
    },
    nav: "Reticulum",
    note: {
      vi: "Bò nuốt không chọn lọc và không nhai kỹ trước khi nuốt, nên đinh, dây thép hay mảnh kim loại đi thẳng xuống dạ tổ ong — túi thấp nhất và nằm trước nhất trong bốn túi. Vật nhọn nằm đó, mỗi lần dạ tổ ong co bóp lại bị đẩy về phía trước, xuyên qua thành dạ dày rồi qua cơ hoành vào lồng ngực.",
      en: "Cattle swallow indiscriminately and without chewing thoroughly first, so nails, wire and metal fragments pass straight into the reticulum — the lowest and most cranial of the four compartments. The sharp object lodges there and, with every reticular contraction, is driven forwards through the stomach wall and on through the diaphragm into the chest.",
      zh: "牛采食不加选择且吞咽前咀嚼不充分，故钉、铁丝与金属碎片径入网胃——四胃中位置最低最靠前者。尖锐异物滞留其中，随网胃每次收缩被推向前方，穿透胃壁并继续穿过膈进入胸腔。",
    },
    compare: {
      vi: "Chó mèo nuốt dị vật thì tắc ruột hoặc thủng ruột; bò thì ra một bệnh hoàn toàn khác vì vị trí dạ tổ ong nằm NGAY sát cơ hoành và ngay dưới tim. Đó là lý do cùng một cái đinh, chó chết vì viêm màng bụng còn bò chết vì viêm màng ngoài tim.",
      en: "A swallowed foreign body in dog or cat causes obstruction or bowel perforation; in cattle it produces an entirely different disease because the reticulum lies IMMEDIATELY against the diaphragm and directly below the heart. Hence the same nail kills a dog through peritonitis and an ox through pericarditis.",
      zh: "犬猫吞入异物导致梗阻或肠穿孔；牛则引发完全不同的疾病，因网胃紧贴膈并正位于心脏下方。故同一枚铁钉，犬死于腹膜炎，牛死于心包炎。",
    },
    clinical: {
      vi: "Bò đứng ưỡn lưng, ngại đi xuống dốc, rên khi nằm xuống, sốt và tụt sữa đột ngột. Nghiệm pháp bấm vùng ức hoặc nhấc nếp da vai làm con vật rên là dấu hiệu đau. Vật nhọn xuyên tới màng ngoài tim thì nghe được tiếng lép bép như vò giấy — tiên lượng xấu, thường phải loại thải. Phòng bằng cho nuốt NAM CHÂM lồng, giữ kim loại lại trong dạ tổ ong suốt đời con vật.",
      en: "The cow stands with an arched back, is reluctant to walk downhill, grunts on lying down, is febrile and drops milk abruptly. A grunt on sternal pressure or on lifting a withers skin fold indicates pain. Once the object reaches the pericardium a crackling, paper-crumpling sound is heard — the prognosis is poor and culling usually follows. Prevention is an oral cage MAGNET, which retains metal in the reticulum for the animal's lifetime.",
      zh: "病牛弓背站立、不愿下坡、卧下时呻吟、发热并突然减产。胸骨部按压或提起鬐甲皮褶时呻吟，提示疼痛。异物一旦到达心包，可闻及揉纸样捻发音——预后不良，通常需淘汰。预防措施为投服笼式磁铁，可终生将金属滞留于网胃内。",
    },
    source: DYCE,
    keys: ["benh ngoai vat", "hardware disease", "da to ong", "reticulum", "nam cham", "viem mang ngoai tim"],
  },

  // ── BÒ · KHUNG CHẬU ──────────────────────────────────────────────────────
  {
    id: "cattle-pelvis-calving",
    species: ["cattle"],
    system: "skeletal",
    region: "trunk",
    name: {
      vi: "Khung chậu và đường sinh",
      en: "The pelvis and the birth canal",
      zh: "骨盆与产道",
    },
    nav: "Pelvis · Aditus pelvis",
    note: {
      vi: "Khung chậu bò gồm hai xương chậu hợp với xương cùng, quây thành một ống mà bê con phải chui qua. Lối vào chậu hình bầu dục, chiều đứng dài hơn chiều ngang; sàn chậu gần phẳng và dốc nhẹ lên phía sau. Hai mốc sờ được từ ngoài là mỏm hông (tuber coxae) ở trước trên và ụ ngồi (tuber ischiadicum) ở sau dưới.",
      en: "The bovine pelvis is two hip bones articulating with the sacrum, enclosing a canal through which the calf must pass. The pelvic inlet is oval, taller than it is wide; the pelvic floor is nearly flat and slopes gently upward caudally. Two externally palpable landmarks are the tuber coxae craniodorsally and the tuber ischiadicum caudoventrally.",
      zh: "牛骨盆由两块髋骨与荐骨构成，围成犊牛必须通过的产道。骨盆入口呈卵圆形，纵径大于横径；骨盆底近乎平坦并向后微微上倾。体外可触及的两个标志为前上方的髋结节与后下方的坐骨结节。",
    },
    compare: {
      vi: "Khung chậu người rộng theo chiều ngang và trục sinh cong hình chữ C, nên thai người phải xoay khi đi qua. Trục sinh của bò gần như THẲNG — bê không cần xoay, nhưng đổi lại kích thước chậu là giới hạn cứng: bê quá to thì không có cách nào lách qua. Ngựa có chậu rộng hơn tương đối nên đẻ khó do bất tương xứng kích thước hiếm hơn hẳn ở bò.",
      en: "The human pelvis is transversely wide with a C-shaped birth axis, so the human fetus must rotate on its way through. The bovine birth axis is nearly STRAIGHT — the calf need not rotate, but in exchange the pelvic dimensions are a hard limit: an oversized calf simply cannot squeeze through. The mare's pelvis is relatively roomier, which is why feto-pelvic disproportion is far rarer in horses than in cattle.",
      zh: "人骨盆横径宽阔、产轴呈 C 形，故胎儿须于通过时旋转。牛的产轴近乎直线——犊牛无需旋转，但骨盆尺寸因而成为硬性限制：过大的犊牛根本无法通过。马骨盆相对宽敞，故胎骨盆不相称在马远比在牛罕见。",
    },
    clinical: {
      vi: "Bất tương xứng thai – khung chậu là nguyên nhân đẻ khó số một ở bò tơ, nhất là khi phối bò tơ với giống bò thịt to. Đo chiều đứng và chiều ngang lối vào chậu qua trực tràng để chọn bò cái làm giống là biện pháp phòng có thật, làm được ngay tại trại. Khi kéo thai, phải kéo THEO trục chậu — kéo thẳng ra sau khi bê chưa qua khỏi lối vào là làm gãy chậu bò mẹ.",
      en: "Feto-pelvic disproportion is the leading cause of dystocia in heifers, especially when heifers are bred to large beef sires. Measuring the vertical and transverse diameters of the pelvic inlet per rectum when selecting replacement heifers is a real preventive measure that can be done on the farm. When traction is applied it must follow the pelvic axis — pulling straight backwards before the calf has cleared the inlet fractures the dam's pelvis.",
      zh: "胎骨盆不相称是初产母牛难产的首要原因，尤以初产牛配大型肉用种公牛时为甚。选留后备母牛时经直肠测量骨盆入口的纵径与横径，是可在场内实施的有效预防措施。牵引时必须顺产轴方向——犊牛尚未通过入口即向后直拉，会造成母牛骨盆骨折。",
    },
    source: KL,
    keys: ["khung chau bo", "de kho", "dystocia", "bat tuong xung", "mom hong", "u ngoi", "keo thai"],
  },
]);
