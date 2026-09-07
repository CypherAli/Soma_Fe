import { fold } from "@/lib/anatomy/knowledge";
import type { T3 } from "@/lib/homeContent";

/**
 * KIẾN THỨC TỔNG QUAN — lớp thứ ba của trợ lý, cạnh 629 hotspot giải phẫu và
 * 2883 đoạn giáo trình bệnh học.
 *
 * VÌ SAO PHẢI CÓ: hai kho kia đều là kho CHI TIẾT. Kho hotspot mô tả từng cấu
 * trúc một ("Xương quay", "Thần kinh giữa"), kho giáo trình là các bài bệnh
 * học. Không kho nào chứa câu tổng quát kiểu "cơ thể người có bao nhiêu
 * xương" — không bài nào nói câu đó, nên trợ lý (vốn bị cấm dùng kiến thức
 * riêng của mô hình) buộc phải trả lời "thư viện chưa có". Người hỏi thì thấy
 * một trợ lý y khoa không biết điều sơ đẳng nhất.
 *
 * CÁCH CHỮA ĐÚNG là bổ sung tư liệu chứ không phải nới lỏng luật cấm bịa. Mỗi
 * mục dưới đây biên soạn tay từ sách giải phẫu chuẩn, có ghi rõ nguồn, và đi
 * vào trợ lý theo đúng đường mà mọi nguồn khác đi: thành một mục TƯ LIỆU có
 * số [n] để dẫn.
 *
 * QUY TẮC KHI THÊM MỤC MỚI:
 *   - Chỉ nhận con số có trong sách giải phẫu kinh điển. Số nào bản thân giới
 *     chuyên môn không thống nhất (số cơ, số khớp) thì phải NÓI RA là ước
 *     lượng và tuỳ cách đếm, đừng chốt một con số cho gọn.
 *   - `source` là nguồn thật, ghi cả lần xuất bản.
 *   - `keys` là mọi cách người ta hỏi, KHÔNG dấu, thường ba ngôn ngữ.
 */
export type GeneralFact = {
  id: string;
  /** từ khoá đã bỏ dấu; khớp theo cụm con trong câu hỏi */
  keys: string[];
  title: T3;
  body: T3;
  /** sách + lần xuất bản, hiện ngay dưới tên nguồn */
  source: string;
};

export const GENERAL_FACTS: GeneralFact[] = [
  {
    id: "bone-count",
    keys: ["bao nhieu xuong", "so luong xuong", "tong so xuong", "how many bones", "number of bones", "bone count", "多少块骨", "骨头数量"],
    title: { vi: "Số lượng xương của cơ thể người", en: "Number of bones in the human body", zh: "人体骨骼数量" },
    body: {
      vi: "Bộ xương người trưởng thành có 206 xương, chia thành xương trục (80 xương: sọ, cột sống, lồng ngực) và xương chi (126 xương: đai vai, chi trên, đai chậu, chi dưới). Trẻ sơ sinh có khoảng 270 mảnh xương; số này giảm dần vì nhiều xương hợp nhất trong quá trình lớn lên (xương cùng, xương cụt, các xương sọ). Con số 206 không kể xương vừng thay đổi theo từng người, trừ hai xương bánh chè vốn luôn được tính.",
      en: "The adult human skeleton has 206 bones: 80 in the axial skeleton (skull, vertebral column, thoracic cage) and 126 in the appendicular skeleton (shoulder girdle, upper limbs, pelvic girdle, lower limbs). A newborn has about 270 bony elements; the number falls as bones fuse during growth (sacrum, coccyx, skull bones). The count of 206 excludes variable sesamoid bones, apart from the two patellae, which are always included.",
      zh: "成人骨骼共 206 块：中轴骨 80 块（颅骨、脊柱、胸廓），附肢骨 126 块（肩带、上肢、骨盆带、下肢）。新生儿约有 270 块骨性结构，随生长发育多处融合（骶骨、尾骨、颅骨）而减少。206 这一数字不含个体差异较大的籽骨，但始终包括两块髌骨。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "muscle-count",
    keys: ["bao nhieu co", "so luong co", "how many muscles", "number of muscles", "多少块肌肉", "肌肉数量"],
    title: { vi: "Số lượng cơ vân của cơ thể người", en: "Number of skeletal muscles", zh: "人体骨骼肌数量" },
    body: {
      vi: "Thường nêu con số khoảng 640 cơ vân có tên. Đây là con số ƯỚC LƯỢNG chứ không phải hằng số: các tài liệu đếm từ 600 đến hơn 800 tuỳ chỗ có tách cơ nhiều đầu, nhiều bụng thành các cơ riêng hay không, và tuỳ có tính các cơ chỉ có ở một phần dân số hay không. Cơ vân chiếm khoảng 40% khối lượng cơ thể người trưởng thành.",
      en: "The figure usually quoted is about 640 named skeletal muscles. This is an ESTIMATE rather than a fixed number: sources count anywhere from 600 to over 800, depending on whether muscles with several heads or bellies are counted separately and whether variant muscles present in only part of the population are included. Skeletal muscle makes up roughly 40% of adult body mass.",
      zh: "通常引用的数字约为 640 块有名称的骨骼肌。这是估计值而非定数：不同文献从 600 到 800 余块不等，取决于是否将多头、多腹的肌肉分开计数，以及是否计入仅部分人群存在的变异肌。骨骼肌约占成人体重的 40%。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "vertebral-column",
    keys: ["bao nhieu dot song", "cot song co bao nhieu", "so dot song", "how many vertebrae", "vertebral column regions", "脊柱 多少", "椎骨数量"],
    title: { vi: "Cột sống — số đốt và các đoạn", en: "Vertebral column — number and regions", zh: "脊柱的分段与椎骨数" },
    body: {
      vi: "Cột sống gồm 33 đốt sống: 7 đốt sống cổ, 12 đốt sống ngực, 5 đốt sống thắt lưng, 5 đốt sống cùng (hợp nhất thành xương cùng) và 4 đốt sống cụt (hợp nhất thành xương cụt). Ở người trưởng thành chỉ còn 24 đốt sống rời, ngăn cách nhau bởi 23 đĩa gian đốt sống — không có đĩa giữa C1 và C2. Cột sống có bốn đoạn cong: cong ưỡn cổ, cong gù ngực, cong ưỡn thắt lưng, cong gù cùng.",
      en: "The vertebral column has 33 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 5 sacral (fused into the sacrum) and 4 coccygeal (fused into the coccyx). In the adult only 24 remain separate, joined by 23 intervertebral discs — there is no disc between C1 and C2. The column has four curvatures: cervical and lumbar lordosis, thoracic and sacral kyphosis.",
      zh: "脊柱由 33 块椎骨组成：颈椎 7、胸椎 12、腰椎 5、骶椎 5（融合为骶骨）、尾椎 4（融合为尾骨）。成人仅 24 块保持分离，由 23 个椎间盘连接——寰椎与枢椎之间没有椎间盘。脊柱有四个生理弯曲：颈曲、腰曲前凸，胸曲、骶曲后凸。",
    },
    source: "Moore, Clinically Oriented Anatomy, 9th ed. (2023)",
  },
  {
    id: "ribs",
    keys: ["bao nhieu xuong suon", "may doi xuong suon", "how many ribs", "rib pairs", "多少对肋骨"],
    title: { vi: "Xương sườn", en: "The ribs", zh: "肋骨" },
    body: {
      vi: "Có 12 đôi xương sườn ở cả nam và nữ. Bảy đôi trên (I–VII) là sườn thật, nối trực tiếp với xương ức bằng sụn sườn riêng. Đôi VIII–X là sườn giả, sụn sườn của chúng gắn vào sụn của sườn ngay trên. Đôi XI và XII là sườn cụt, đầu trước tự do trong thành bụng.",
      en: "There are 12 pairs of ribs in both sexes. The upper seven (I–VII) are true ribs, joined to the sternum by their own costal cartilage. Pairs VIII–X are false ribs, whose cartilages attach to the cartilage of the rib above. Pairs XI and XII are floating ribs, ending freely in the abdominal wall.",
      zh: "男女均为 12 对肋骨。上 7 对（I–VII）为真肋，借自身肋软骨与胸骨相连；第 8–10 对为假肋，其肋软骨附着于上一肋的软骨；第 11、12 对为浮肋，前端游离于腹壁内。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "skull-bones",
    keys: ["bao nhieu xuong so", "hop so gom", "so xuong so", "how many skull bones", "颅骨 多少块"],
    title: { vi: "Xương sọ", en: "Bones of the skull", zh: "颅骨的组成" },
    body: {
      vi: "Sọ gồm 22 xương: 8 xương sọ não (trán, chẩm, bướm, sàng, hai xương đỉnh, hai xương thái dương) và 14 xương sọ mặt (hai hàm trên, hai xương gò má, hai xương mũi, hai xương lệ, hai xương khẩu cái, hai xoăn mũi dưới, xương lá mía và xương hàm dưới). Ngoài 22 xương này còn 6 xương con của tai (búa, đe, bàn đạp mỗi bên) nằm trong xương thái dương, và xương móng không khớp với xương nào.",
      en: "The skull comprises 22 bones: 8 cranial (frontal, occipital, sphenoid, ethmoid, two parietal, two temporal) and 14 facial (two maxillae, two zygomatic, two nasal, two lacrimal, two palatine, two inferior nasal conchae, the vomer and the mandible). In addition there are 6 auditory ossicles (malleus, incus, stapes on each side) within the temporal bones, and the hyoid bone, which articulates with no other bone.",
      zh: "颅由 22 块骨组成：脑颅 8 块（额骨、枕骨、蝶骨、筛骨、顶骨 2、颞骨 2），面颅 14 块（上颌骨 2、颧骨 2、鼻骨 2、泪骨 2、腭骨 2、下鼻甲 2、犁骨、下颌骨）。此外颞骨内另有 6 块听小骨（锤骨、砧骨、镫骨各两侧），舌骨则不与任何骨形成关节。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "hand-foot-bones",
    keys: ["bao nhieu xuong ban tay", "xuong ban chan bao nhieu", "bones in the hand", "bones in the foot", "手 多少块骨", "足 多少块骨"],
    title: { vi: "Xương bàn tay và bàn chân", en: "Bones of the hand and foot", zh: "手与足的骨骼" },
    body: {
      vi: "Mỗi bàn tay có 27 xương: 8 xương cổ tay, 5 xương đốt bàn tay, 14 xương đốt ngón (ngón cái hai đốt, bốn ngón còn lại ba đốt). Mỗi bàn chân có 26 xương: 7 xương cổ chân, 5 xương đốt bàn chân, 14 xương đốt ngón. Hai bàn tay và hai bàn chân cộng lại đã chiếm hơn một nửa tổng số xương cơ thể.",
      en: "Each hand has 27 bones: 8 carpals, 5 metacarpals and 14 phalanges (two in the thumb, three in each other digit). Each foot has 26 bones: 7 tarsals, 5 metatarsals and 14 phalanges. Together the two hands and two feet account for more than half of all the bones in the body.",
      zh: "每只手有 27 块骨：腕骨 8、掌骨 5、指骨 14（拇指 2 节，其余各 3 节）。每只足有 26 块骨：跗骨 7、跖骨 5、趾骨 14。双手双足合计已超过全身骨骼总数的一半。",
    },
    source: "Moore, Clinically Oriented Anatomy, 9th ed. (2023)",
  },
  {
    id: "cranial-nerves",
    keys: ["day than kinh so", "bao nhieu doi day than kinh so", "12 doi day than kinh", "cranial nerves", "how many cranial nerves", "脑神经 多少对"],
    title: { vi: "Dây thần kinh sọ", en: "The cranial nerves", zh: "脑神经" },
    body: {
      vi: "Có 12 đôi dây thần kinh sọ, đánh số bằng chữ số La Mã theo thứ tự trước ra sau: I khứu giác, II thị giác, III vận nhãn, IV ròng rọc, V sinh ba, VI dạng, VII mặt, VIII tiền đình – ốc tai, IX thiệt hầu, X lang thang, XI phụ, XII hạ thiệt. Hai đôi đầu thực chất là phần kéo dài của não bộ; mười đôi còn lại xuất phát từ thân não.",
      en: "There are 12 pairs of cranial nerves, numbered in Roman numerals from front to back: I olfactory, II optic, III oculomotor, IV trochlear, V trigeminal, VI abducens, VII facial, VIII vestibulocochlear, IX glossopharyngeal, X vagus, XI accessory, XII hypoglossal. The first two are in fact extensions of the brain itself; the remaining ten arise from the brainstem.",
      zh: "脑神经共 12 对，自前向后以罗马数字编号：I 嗅神经、II 视神经、III 动眼神经、IV 滑车神经、V 三叉神经、VI 展神经、VII 面神经、VIII 前庭蜗神经、IX 舌咽神经、X 迷走神经、XI 副神经、XII 舌下神经。前两对实为脑的延伸，其余十对起自脑干。",
    },
    source: "Moore, Clinically Oriented Anatomy, 9th ed. (2023)",
  },
  {
    id: "spinal-nerves",
    keys: ["day than kinh song", "bao nhieu doi day than kinh song", "spinal nerves", "how many spinal nerves", "脊神经 多少对"],
    title: { vi: "Dây thần kinh sống", en: "The spinal nerves", zh: "脊神经" },
    body: {
      vi: "Có 31 đôi dây thần kinh sống: 8 đôi cổ, 12 đôi ngực, 5 đôi thắt lưng, 5 đôi cùng và 1 đôi cụt. Có 8 đôi cổ trong khi chỉ có 7 đốt sống cổ vì đôi C1 thoát ra phía trên đốt C1, còn từ T1 trở xuống mỗi dây thoát ra dưới đốt sống cùng tên. Tuỷ sống ở người trưởng thành kết thúc ngang mức L1–L2, nên các rễ phía dưới đi tiếp thành chùm đuôi ngựa.",
      en: "There are 31 pairs of spinal nerves: 8 cervical, 12 thoracic, 5 lumbar, 5 sacral and 1 coccygeal. There are 8 cervical pairs but only 7 cervical vertebrae because C1 emerges above the C1 vertebra, while from T1 downwards each nerve emerges below its like-named vertebra. In the adult the spinal cord ends at the L1–L2 level, so the lower roots continue as the cauda equina.",
      zh: "脊神经共 31 对：颈 8、胸 12、腰 5、骶 5、尾 1。颈椎虽只有 7 块却有 8 对颈神经，因为第 1 对自寰椎上方穿出，而自 T1 起各神经均在同名椎骨下方穿出。成人脊髓终止于 L1–L2 水平，其下方的神经根延续为马尾。",
    },
    source: "Moore, Clinically Oriented Anatomy, 9th ed. (2023)",
  },
  {
    id: "organ-systems",
    keys: ["bao nhieu he co quan", "co the co nhung he nao", "organ systems", "how many organ systems", "人体 系统 多少"],
    title: { vi: "Các hệ cơ quan của cơ thể", en: "The organ systems of the body", zh: "人体的器官系统" },
    body: {
      vi: "Cơ thể người thường được mô tả theo 11 hệ cơ quan: hệ da, hệ xương, hệ khớp, hệ cơ, hệ thần kinh, hệ nội tiết, hệ tim mạch, hệ bạch huyết – miễn dịch, hệ hô hấp, hệ tiêu hoá, hệ tiết niệu và hệ sinh dục (hai hệ sau đôi khi gộp thành hệ niệu – sinh dục). Cách chia này là quy ước để mô tả và giảng dạy; trên thực tế các hệ đan xen nhau về cấu trúc lẫn chức năng.",
      en: "The body is conventionally described as 11 organ systems: integumentary, skeletal, articular, muscular, nervous, endocrine, cardiovascular, lymphatic–immune, respiratory, digestive, urinary and reproductive (the last two are sometimes combined as the urogenital system). The division is a convention for description and teaching; in reality the systems overlap in both structure and function.",
      zh: "人体通常按 11 个器官系统描述：皮肤系统、骨骼系统、关节系统、肌系统、神经系统、内分泌系统、心血管系统、淋巴免疫系统、呼吸系统、消化系统、泌尿系统与生殖系统（后两者有时合称泌尿生殖系统）。这种划分是描述与教学的惯例，实际上各系统在结构与功能上相互交织。",
    },
    source: "Terminologia Anatomica, 2nd ed. (FIPAT, 2019)",
  },
  {
    id: "heart-overview",
    keys: ["tim co may buong", "buong tim", "van tim", "chambers of the heart", "heart valves", "心脏 几个腔"],
    title: { vi: "Tim — buồng và van", en: "The heart — chambers and valves", zh: "心脏的腔与瓣膜" },
    body: {
      vi: "Tim có 4 buồng: tâm nhĩ phải, tâm thất phải, tâm nhĩ trái, tâm thất trái. Có 4 van: van ba lá và van hai lá (van nhĩ – thất), van động mạch phổi và van động mạch chủ (van tổ chim). Tim người trưởng thành nặng khoảng 250–350 g, nằm trong trung thất giữa, khoảng hai phần ba khối lượng lệch sang trái đường giữa. Lưu lượng tim lúc nghỉ khoảng 5 L/phút.",
      en: "The heart has 4 chambers: right atrium, right ventricle, left atrium, left ventricle. It has 4 valves: the tricuspid and mitral (atrioventricular) valves and the pulmonary and aortic (semilunar) valves. The adult heart weighs about 250–350 g and lies in the middle mediastinum, with roughly two-thirds of its mass to the left of the midline. Resting cardiac output is about 5 L/min.",
      zh: "心脏有 4 个腔：右心房、右心室、左心房、左心室；有 4 个瓣膜：三尖瓣与二尖瓣（房室瓣）、肺动脉瓣与主动脉瓣（半月瓣）。成人心脏重约 250–350 g，位于中纵隔，约三分之二的体积位于正中线左侧。静息心输出量约 5 L/分。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "lungs-overview",
    keys: ["phoi co may thuy", "thuy phoi", "phe nang", "lobes of the lung", "how many lobes", "肺 几叶"],
    title: { vi: "Phổi — thuỳ và phế nang", en: "The lungs — lobes and alveoli", zh: "肺的分叶与肺泡" },
    body: {
      vi: "Phổi phải có 3 thuỳ (trên, giữa, dưới) ngăn nhau bởi rãnh chếch và rãnh ngang; phổi trái chỉ có 2 thuỳ (trên, dưới) vì phải nhường chỗ cho tim, chỗ khuyết đó gọi là khuyết tim và phần lưỡi phổi. Về phân thuỳ phế quản – phổi, phổi phải có 10, phổi trái thường có 8–10. Toàn bộ hai phổi chứa khoảng 300 triệu phế nang, tổng diện tích trao đổi khí khoảng 70 m².",
      en: "The right lung has 3 lobes (superior, middle, inferior) separated by the oblique and horizontal fissures; the left lung has only 2 (superior, inferior) because it accommodates the heart, leaving the cardiac notch and the lingula. In bronchopulmonary segments, the right lung has 10 and the left usually 8–10. Together the lungs contain some 300 million alveoli, with a gas-exchange surface of about 70 m².",
      zh: "右肺有 3 叶（上、中、下），由斜裂与水平裂分隔；左肺仅 2 叶（上、下），因需容纳心脏而形成心切迹与左肺小舌。支气管肺段方面，右肺 10 个，左肺通常 8–10 个。两肺共含约 3 亿个肺泡，气体交换总面积约 70 m²。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "brain-overview",
    keys: ["nao nang bao nhieu", "bao nhieu no ron", "neuron", "brain weight", "how many neurons", "大脑 重量", "神经元 数量"],
    title: { vi: "Não bộ — khối lượng và số tế bào thần kinh", en: "The brain — weight and neuron number", zh: "脑的重量与神经元数量" },
    body: {
      vi: "Não người trưởng thành nặng khoảng 1.300–1.400 g, chiếm chừng 2% trọng lượng cơ thể nhưng tiêu thụ khoảng 20% lượng oxy và glucose lúc nghỉ. Số tế bào thần kinh ước tính khoảng 86 tỷ, trong đó gần 80% nằm ở tiểu não dù tiểu não chỉ chiếm khoảng 10% thể tích não. Não được chia thành đại não, tiểu não và thân não (trung não, cầu não, hành não).",
      en: "The adult brain weighs about 1,300–1,400 g — roughly 2% of body weight, yet it consumes some 20% of resting oxygen and glucose. The neuron count is estimated at about 86 billion, nearly 80% of which lie in the cerebellum even though it makes up only about 10% of brain volume. The brain is divided into cerebrum, cerebellum and brainstem (midbrain, pons, medulla oblongata).",
      zh: "成人脑重约 1300–1400 g，约占体重的 2%，却消耗静息状态下约 20% 的氧与葡萄糖。神经元数量估计约 860 亿，其中近 80% 位于小脑，而小脑仅占脑容积的约 10%。脑分为大脑、小脑和脑干（中脑、脑桥、延髓）。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "teeth",
    keys: ["bao nhieu cai rang", "so rang", "rang sua", "how many teeth", "牙齿 多少颗"],
    title: { vi: "Số răng", en: "Number of teeth", zh: "牙齿数目" },
    body: {
      vi: "Người trưởng thành có 32 răng vĩnh viễn, mỗi phần tư hàm gồm 2 răng cửa, 1 răng nanh, 2 răng hàm nhỏ và 3 răng hàm lớn — răng hàm lớn thứ ba (răng khôn) có thể thiếu bẩm sinh hoặc không mọc. Bộ răng sữa có 20 chiếc, mỗi phần tư hàm 2 răng cửa, 1 răng nanh và 2 răng hàm sữa.",
      en: "An adult has 32 permanent teeth: per quadrant, 2 incisors, 1 canine, 2 premolars and 3 molars — the third molar (wisdom tooth) may be congenitally absent or fail to erupt. The deciduous dentition has 20 teeth: per quadrant, 2 incisors, 1 canine and 2 molars.",
      zh: "成人恒牙 32 颗，每一象限为切牙 2、尖牙 1、前磨牙 2、磨牙 3——第三磨牙（智齿）可先天缺失或不萌出。乳牙共 20 颗，每一象限为切牙 2、尖牙 1、乳磨牙 2。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "skin",
    keys: ["da la co quan", "dien tich da", "cac lop da", "largest organ", "layers of skin", "皮肤 面积", "最大的器官"],
    title: { vi: "Da — cơ quan lớn nhất", en: "The skin — the largest organ", zh: "皮肤——最大的器官" },
    body: {
      vi: "Da là cơ quan lớn nhất cơ thể: diện tích khoảng 1,5–2 m² ở người trưởng thành và chiếm khoảng 15% trọng lượng cơ thể. Da gồm ba lớp: biểu bì (thượng bì), trung bì (chân bì) và hạ bì (mô dưới da). Bề dày thay đổi từ khoảng 0,5 mm ở mi mắt tới 4 mm ở gan bàn chân.",
      en: "The skin is the largest organ of the body: about 1.5–2 m² in an adult and roughly 15% of body weight. It has three layers: epidermis, dermis and hypodermis (subcutaneous tissue). Thickness ranges from about 0.5 mm on the eyelid to 4 mm on the sole.",
      zh: "皮肤是人体最大的器官：成人面积约 1.5–2 m²，约占体重的 15%。皮肤分三层：表皮、真皮和皮下组织。厚度自眼睑处约 0.5 mm 到足底约 4 mm 不等。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "liver-overview",
    keys: ["gan nang bao nhieu", "thuy gan", "phan thuy gan", "couinaud", "liver lobes", "肝 分叶"],
    title: { vi: "Gan — khối lượng và cách phân thuỳ", en: "The liver — mass and segmentation", zh: "肝的重量与分段" },
    body: {
      vi: "Gan là tuyến lớn nhất cơ thể, nặng khoảng 1,4–1,6 kg ở người trưởng thành, nằm chủ yếu ở hạ sườn phải. Về hình thái ngoài, gan có 4 thuỳ: thuỳ phải, thuỳ trái, thuỳ vuông và thuỳ đuôi. Về ngoại khoa, gan được chia thành 8 phân thuỳ theo Couinaud dựa trên phân nhánh tĩnh mạch cửa và các tĩnh mạch gan — đây mới là cách phân chia dùng khi cắt gan.",
      en: "The liver is the largest gland in the body, weighing about 1.4–1.6 kg in the adult and lying mainly in the right hypochondrium. Morphologically it has 4 lobes: right, left, quadrate and caudate. Surgically it is divided into 8 Couinaud segments based on the branching of the portal vein and the hepatic veins — this is the division used for hepatic resection.",
      zh: "肝是人体最大的腺体，成人重约 1.4–1.6 kg，主要位于右季肋区。按外形分为 4 叶：右叶、左叶、方叶与尾状叶。外科上则依门静脉分支与肝静脉走行分为 Couinaud 8 段，肝切除术采用的是这一分段。",
    },
    source: "Moore, Clinically Oriented Anatomy, 9th ed. (2023)",
  },
  {
    id: "kidney-overview",
    keys: ["than co bao nhieu nephron", "don vi than", "nephron", "kidney nephrons", "肾单位 数量"],
    title: { vi: "Thận — đơn vị thận và lưu lượng lọc", en: "The kidney — nephrons and filtration", zh: "肾单位与滤过率" },
    body: {
      vi: "Mỗi thận chứa khoảng một triệu đơn vị thận (nephron), gồm tiểu cầu thận và hệ ống thận. Hai thận nhận khoảng 20–25% lưu lượng tim dù chỉ nặng chừng 300 g, và lọc khoảng 180 lít huyết tương mỗi ngày, trong đó hơn 99% được tái hấp thu. Mức lọc cầu thận bình thường ở người trưởng thành khoảng 90–120 mL/phút/1,73 m².",
      en: "Each kidney contains about one million nephrons, each comprising a renal corpuscle and a tubular system. The two kidneys receive some 20–25% of cardiac output despite weighing only about 300 g together, and filter roughly 180 litres of plasma a day, of which more than 99% is reabsorbed. Normal adult glomerular filtration rate is about 90–120 mL/min/1.73 m².",
      zh: "每侧肾约含 100 万个肾单位，每个肾单位由肾小体与肾小管系统构成。两肾合重仅约 300 g，却接受心输出量的 20–25%，每日滤过血浆约 180 升，其中 99% 以上被重吸收。成人正常肾小球滤过率约 90–120 mL/分/1.73 m²。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "gi-length",
    keys: ["ruot dai bao nhieu", "chieu dai ruot non", "ruot gia dai", "length of the intestine", "small intestine length", "肠 长度"],
    title: { vi: "Chiều dài ống tiêu hoá", en: "Length of the gastrointestinal tract", zh: "消化道长度" },
    body: {
      vi: "Số đo kinh điển trên tử thi: ruột non dài khoảng 6–7 m (tá tràng 25 cm, hỗng tràng khoảng hai phần năm và hồi tràng khoảng ba phần năm phần còn lại), ruột già khoảng 1,5 m. Trên người sống, trương lực cơ làm ruột ngắn hơn nhiều — đo trong mổ hoặc nội soi thường chỉ được khoảng 3–5 m ruột non. Vì vậy nêu con số phải nói rõ đo trên tử thi hay người sống.",
      en: "Classic cadaveric measurements: the small intestine is about 6–7 m long (duodenum 25 cm, with the jejunum about two-fifths and the ileum about three-fifths of the remainder) and the large intestine about 1.5 m. In the living, muscle tone makes the gut considerably shorter — intraoperative or endoscopic measurement usually gives about 3–5 m of small intestine. Any figure quoted should therefore state whether it is cadaveric or in vivo.",
      zh: "尸体上的经典测量：小肠长约 6–7 m（十二指肠 25 cm，其余部分空肠约占五分之二、回肠约占五分之三），大肠约 1.5 m。活体因肌张力而明显缩短，术中或内镜下测量小肠通常仅约 3–5 m。因此引用数字时应说明是尸体测量还是活体测量。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "blood-volume",
    keys: ["bao nhieu lit mau", "the tich mau", "blood volume", "how much blood", "血量 多少"],
    title: { vi: "Thể tích máu", en: "Blood volume", zh: "血量" },
    body: {
      vi: "Thể tích máu ở người trưởng thành khoảng 7–8% trọng lượng cơ thể, tức chừng 5 lít ở người nặng 70 kg (nam khoảng 70 mL/kg, nữ khoảng 65 mL/kg). Huyết tương chiếm khoảng 55% thể tích, phần tế bào (chủ yếu là hồng cầu) chiếm khoảng 45% — chính là hematocrit. Trẻ nhỏ có thể tích máu theo cân nặng cao hơn, khoảng 80 mL/kg.",
      en: "Adult blood volume is about 7–8% of body weight, roughly 5 litres in a 70 kg person (about 70 mL/kg in men, 65 mL/kg in women). Plasma makes up about 55% of the volume and the cellular fraction — mostly red cells — about 45%, which is the haematocrit. Infants have a higher volume per body weight, about 80 mL/kg.",
      zh: "成人血量约为体重的 7–8%，70 kg 者约 5 升（男性约 70 mL/kg，女性约 65 mL/kg）。血浆约占 55%，细胞成分（主要为红细胞）约占 45%，即血细胞比容。婴幼儿按体重计血量更高，约 80 mL/kg。",
    },
    source: "Guyton & Hall, Textbook of Medical Physiology, 14th ed. (2021)",
  },
  {
    id: "extremes",
    keys: ["xuong dai nhat", "xuong nho nhat", "co lon nhat", "co quan lon nhat", "longest bone", "smallest bone", "largest muscle", "最长的骨", "最小的骨"],
    title: { vi: "Những cấu trúc \"nhất\" của cơ thể", en: "Extremes of the body", zh: "人体之最" },
    body: {
      vi: "Xương dài nhất và nặng nhất là xương đùi (khoảng một phần tư chiều cao cơ thể). Xương nhỏ nhất là xương bàn đạp trong tai giữa, dài khoảng 3 mm. Cơ lớn nhất theo tiết diện là cơ mông lớn, cơ dài nhất là cơ may, cơ nhỏ nhất là cơ bàn đạp. Cơ quan lớn nhất là da; tuyến lớn nhất là gan; động mạch lớn nhất là động mạch chủ; dây thần kinh dài nhất là thần kinh ngồi.",
      en: "The longest and heaviest bone is the femur (about a quarter of body height). The smallest is the stapes in the middle ear, about 3 mm long. The largest muscle by cross-section is gluteus maximus, the longest is sartorius and the smallest is stapedius. The largest organ is the skin; the largest gland is the liver; the largest artery is the aorta; the longest nerve is the sciatic nerve.",
      zh: "最长最重的骨是股骨（约为身高的四分之一）；最小的骨是中耳的镫骨，长约 3 mm。横截面最大的肌是臀大肌，最长的肌是缝匠肌，最小的肌是镫骨肌。最大的器官是皮肤，最大的腺体是肝，最大的动脉是主动脉，最长的神经是坐骨神经。",
    },
    source: "Gray's Anatomy, 42nd ed. (2021)",
  },
  {
    id: "anatomical-position",
    keys: ["tu the giai phau", "mat phang giai phau", "mat phang doc giua", "anatomical position", "anatomical planes", "解剖学姿势", "解剖平面"],
    title: { vi: "Tư thế giải phẫu và các mặt phẳng", en: "Anatomical position and planes", zh: "解剖学姿势与平面" },
    body: {
      vi: "Mọi mô tả giải phẫu đều quy chiếu về tư thế giải phẫu: đứng thẳng, mắt nhìn ngang ra trước, hai tay buông xuôi sát thân, lòng bàn tay hướng ra trước, hai chân khép, bàn chân song song hướng trước. Ba mặt phẳng chuẩn: mặt phẳng đứng dọc (chia phải – trái; đi qua đường giữa gọi là mặt phẳng dọc giữa), mặt phẳng đứng ngang hay trán (chia trước – sau), mặt phẳng nằm ngang (chia trên – dưới). Nhờ quy ước này, \"trên\" và \"dưới\" luôn có nghĩa xác định dù người bệnh đang nằm.",
      en: "All anatomical description refers to the anatomical position: standing erect, eyes forward, arms at the sides with palms facing forwards, feet together and pointing forwards. Three standard planes are used: sagittal (dividing right from left; through the midline it is the median plane), coronal or frontal (dividing anterior from posterior) and transverse or axial (dividing superior from inferior). Because of this convention, \"superior\" and \"inferior\" keep a fixed meaning even when the patient is lying down.",
      zh: "一切解剖描述均以解剖学姿势为准：身体直立，两眼平视前方，上肢下垂于躯干两侧，掌心向前，两足并拢、足尖向前。三个标准平面：矢状面（分左右，经正中者为正中矢状面）、冠状面（分前后）、横断面（分上下）。有了这一约定，即使患者卧位，\"上\"\"下\"仍具有确定含义。",
    },
    source: "Terminologia Anatomica, 2nd ed. (FIPAT, 2019)",
  },
];

export type GeneralHit = { fact: GeneralFact; score: number };

/**
 * Tra kiến thức tổng quan bằng cách khớp cụm từ khoá.
 *
 * Chỉ 20 mục nên không cần thang điểm phức tạp: cụm khoá dài khớp được là tín
 * hiệu rất mạnh ("bao nhieu xuong" không thể tình cờ nằm trong câu hỏi khác),
 * nên chấm điểm theo ĐỘ DÀI cụm khớp được. Không khớp cụm nào thì trả về rỗng
 * — kho này chỉ nhảy vào khi đúng là câu hỏi tổng quát, không bao giờ chen
 * ngang câu hỏi về một cấu trúc cụ thể.
 */
export function searchGeneralFacts(question: string, limit = 2): GeneralHit[] {
  const q = fold(question).replace(/\s+/g, " ");
  const out: GeneralHit[] = [];
  for (const fact of GENERAL_FACTS) {
    let best = 0;
    for (const key of fact.keys) {
      if (q.includes(key) && key.length > best) best = key.length;
    }
    if (best > 0) out.push({ fact, score: best });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}
