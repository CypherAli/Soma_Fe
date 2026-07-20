import type { SceneModule } from "./types";

/**
 * Mô nền: hệ mạc và mô liên kết đặc — 2 scene.
 *
 * GIỚI HẠN DỮ LIỆU: Z-Anatomy KHÔNG có mesh nào cho mô mỡ (adipose) — đã tìm
 * theo "adipose", "fat", "fat pad", "fat body", kết quả bằng không. Vì vậy
 * dự án không có scene "Mô mỡ"; đây là thiếu dữ liệu nguồn chứ không phải
 * chưa dựng.
 *
 * Dây chằng (211 mesh) CỐ Ý không gộp vào scene mô liên kết vì chúng thuộc
 * bộ khớp và đã có trong dữ liệu khớp riêng.
 */
export const connectiveScenes: Record<string, SceneModule> = {
  "he-mac": {
    slug: "he-mac",
    title: {
      vi: "Hệ mạc — lớp bao liên tục của cơ thể",
      en: "Fascial System — the Body's Continuous Wrapping",
      zh: "筋膜系统——人体的连续包被层",
    },
    description: {
      vi: "Mạc là những tấm mô liên kết sợi bao bọc cơ, nhóm cơ và khoang cơ thể, tạo thành một mạng liên tục từ đầu tới chân chứ không phải các mảnh rời rạc. Mạc chia chi thành các khoang cơ có vách ngăn rõ, vừa giúp lực co cơ được truyền hiệu quả vừa là lý do giải phẫu của hội chứng khoang: khi áp lực trong một khoang tăng cao, lớp mạc dai không giãn được nên chèn ép mạch máu và thần kinh bên trong. Mô hình gồm 38 tấm mạc có thật trong dữ liệu nguồn, trải từ mạc thái dương ở đầu tới mạc cẳng chân.",
      en: "Fascia consists of fibrous connective-tissue sheets that wrap muscles, muscle groups, and body cavities, forming one continuous network from head to foot rather than separate patches. Fascia divides the limbs into well-defined muscular compartments, which both transmits contractile force efficiently and explains compartment syndrome anatomically: when pressure inside a compartment rises, the tough non-compliant fascia cannot expand and instead compresses the vessels and nerves within. The model contains the 38 fascial sheets present in the source data, spanning from the temporal fascia of the head to the crural fascia of the leg.",
      zh: "筋膜是包裹肌肉、肌群与体腔的纤维结缔组织膜，自头至足构成连续网络，而非彼此孤立的片块。筋膜将肢体分隔为界限分明的肌间隔，既有效传递收缩力，也从解剖上解释了骨筋膜室综合征：室内压升高时，坚韧而无弹性的筋膜无法扩张，转而压迫其内的血管与神经。模型包含源数据中真实存在的38片筋膜，自头部颞筋膜延伸至小腿筋膜。",
    },
    visibleSystems: ["muscular"],
    modelFile: "/models/fascia_system.glb",
    hotspots: [
      {
        key: "fascia-lata",
        meshName: "Fascia lata.l",
        offset: [-160, 60],
        label: { vi: "Mạc đùi", en: "Fascia lata", zh: "阔筋膜" },
        latinName: "Fascia lata",
        note: {
          vi: "Bao mạc dày bọc toàn bộ đùi. Phần dày lên ở mặt ngoài tạo thành dải chậu-chày, nơi cơ căng mạc đùi và cơ mông lớn bám vào để giữ vững khớp gối khi đứng và đi.",
          en: "The thick fascial sleeve investing the entire thigh. Its lateral thickening forms the iliotibial tract, into which tensor fasciae latae and gluteus maximus insert to stabilise the knee during standing and walking.",
          zh: "包裹整个大腿的厚筋膜鞘。其外侧增厚形成髂胫束，阔筋膜张肌与臀大肌止于此，于站立及行走时稳定膝关节。",
        },
      },
      {
        key: "thoracolumbar",
        meshName: "Posterior layer of thoracolumbar fascia.l",
        offset: [150, -30],
        label: { vi: "Mạc ngực-thắt lưng (lá sau)", en: "Thoracolumbar fascia (posterior layer)", zh: "胸腰筋膜（后层）" },
        latinName: "Fascia thoracolumbalis",
        note: {
          vi: "Mạc ba lá ở vùng lưng dưới, bao cơ dựng sống và là nơi bám của cơ lưng rộng cùng cơ ngang bụng. Nó truyền lực giữa chi trên, thân mình và chi dưới nên có vai trò trung tâm trong cơ học vùng thắt lưng. Mô hình có đủ cả ba lá trước, giữa và sau.",
          en: "A three-layered fascia of the lower back enclosing erector spinae and giving attachment to latissimus dorsi and transversus abdominis. It transmits load between upper limb, trunk, and lower limb, making it central to lumbar mechanics. All three layers — anterior, middle, and posterior — are present in the model.",
          zh: "腰背部的三层筋膜，包绕竖脊肌，并为背阔肌与腹横肌提供附着。它在上肢、躯干与下肢之间传递负荷，于腰部力学中居核心地位。模型含前、中、后三层。",
        },
      },
      {
        key: "crural",
        meshName: "Crural fascia.l",
        offset: [-150, 150],
        label: { vi: "Mạc cẳng chân", en: "Crural fascia", zh: "小腿筋膜" },
        latinName: "Fascia cruris",
        note: {
          vi: "Bao mạc của cẳng chân, cùng hai vách gian cơ và màng gian cốt chia cẳng chân thành bốn khoang. Đây là vị trí hay xảy ra hội chứng khoang nhất sau gãy xương chày.",
          en: "The fascial sleeve of the leg which, with two intermuscular septa and the interosseous membrane, divides it into four compartments. This is the commonest site of compartment syndrome after tibial fracture.",
          zh: "小腿的筋膜鞘，与两条肌间隔及骨间膜共同将小腿分为四个筋膜室。此处是胫骨骨折后骨筋膜室综合征最好发的部位。",
        },
      },
      {
        key: "transversalis",
        meshName: "Transversalis fascia",
        offset: [30, 40],
        label: { vi: "Mạc ngang", en: "Transversalis fascia", zh: "腹横筋膜" },
        latinName: "Fascia transversalis",
        note: {
          vi: "Lớp mạc lót mặt trong thành bụng, nằm giữa cơ ngang bụng và phúc mạc. Điểm yếu của lớp này ở vùng bẹn là nơi hình thành thoát vị bẹn trực tiếp.",
          en: "The fascial layer lining the inner surface of the abdominal wall, between transversus abdominis and the peritoneum. A weakness of this layer in the inguinal region is where a direct inguinal hernia forms.",
          zh: "衬于腹壁内面、介于腹横肌与腹膜之间的筋膜层。此层在腹股沟区的薄弱处即直疝的形成部位。",
        },
      },
      {
        key: "clavipectoral",
        meshName: "Clavipectoral fascia.l",
        offset: [140, -110],
        label: { vi: "Mạc đòn-ngực", en: "Clavipectoral fascia", zh: "锁胸筋膜" },
        latinName: "Fascia clavipectoralis",
        note: {
          vi: "Tấm mạc nằm sâu dưới cơ ngực lớn, căng từ xương đòn xuống. Thần kinh ngực ngoài, động mạch và tĩnh mạch cùng tên xuyên qua tấm mạc này.",
          en: "A fascial sheet deep to pectoralis major, stretching down from the clavicle. The lateral pectoral nerve and the thoraco-acromial vessels pierce it.",
          zh: "位于胸大肌深面、自锁骨向下张开的筋膜膜片。胸外侧神经与胸肩峰血管穿经其中。",
        },
      },
      {
        key: "antebrachial",
        meshName: "Antebrachial fascia.l",
        offset: [170, 90],
        label: { vi: "Mạc cẳng tay", en: "Antebrachial fascia", zh: "前臂筋膜" },
        latinName: "Fascia antebrachii",
        note: {
          vi: "Bao mạc của cẳng tay, dày lên ở cổ tay thành các mạc giữ gân gấp và duỗi giữ cho gân không bật ra khỏi trục xương khi gấp duỗi cổ tay.",
          en: "The fascial sleeve of the forearm, thickened at the wrist into the flexor and extensor retinacula that stop the tendons bowstringing away from the skeleton during wrist movement.",
          zh: "前臂的筋膜鞘，在腕部增厚为屈肌与伸肌支持带，防止腕部活动时肌腱弓弦样弹离骨骼。",
        },
      },
      {
        key: "diaphragmatic",
        meshName: "Diaphragmatic fascia",
        offset: [-60, -80],
        label: { vi: "Mạc hoành", en: "Diaphragmatic fascia", zh: "膈筋膜" },
        latinName: "Fascia diaphragmatica",
        note: {
          vi: "Lớp mạc phủ mặt bụng của cơ hoành, liên tục với mạc ngang của thành bụng — minh hoạ rõ tính liên tục của hệ mạc giữa các khoang cơ thể.",
          en: "The fascial layer covering the abdominal surface of the diaphragm, continuous with the transversalis fascia of the abdominal wall — a clear illustration of fascial continuity across body cavities.",
          zh: "覆盖膈腹侧面的筋膜层，与腹壁的腹横筋膜相延续——清晰体现筋膜跨体腔的连续性。",
        },
      },
      {
        key: "cervical",
        meshName: "Superficial investing cervical fascia.l",
        offset: [60, -160],
        label: { vi: "Mạc cổ nông", en: "Superficial investing cervical fascia", zh: "颈浅筋膜" },
        latinName: "Fascia cervicalis",
        note: {
          vi: "Lớp mạc bao quanh cổ, bọc cơ ức-đòn-chũm và cơ thang. Các lớp mạc cổ tạo nên những khoang có ranh giới rõ, và chính các khoang này quyết định đường lan của nhiễm trùng vùng cổ xuống trung thất.",
          en: "The fascial layer encircling the neck, enclosing sternocleidomastoid and trapezius. The cervical fascial layers create well-defined spaces, and it is these spaces that determine how neck infections spread down into the mediastinum.",
          zh: "环绕颈部的筋膜层，包裹胸锁乳突肌与斜方肌。颈筋膜诸层形成界限分明的间隙，正是这些间隙决定颈部感染向纵隔扩散的路径。",
        },
      },
    ],
  },

  "mo-lien-ket": {
    slug: "mo-lien-ket",
    title: {
      vi: "Mô liên kết đặc — cân, mạc giữ gân và túi hoạt dịch",
      en: "Dense Connective Tissue — Aponeuroses, Retinacula and Bursae",
      zh: "致密结缔组织——腱膜、支持带与滑膜囊",
    },
    description: {
      vi: "Ba dạng cấu trúc liên kết đặc phục vụ ba nhiệm vụ cơ học khác nhau. Cân là tấm gân dẹt rộng, giúp cơ bám vào một diện rộng thay vì một điểm. Mạc giữ gân là những dải ngang bắc qua cổ tay và cổ chân, giữ gân áp sát xương để lực kéo không bị chệch hướng khi khớp gấp. Túi hoạt dịch là những bao nhỏ chứa dịch nằm xen giữa gân, cơ và xương để giảm ma sát tại các điểm tì đè. Mô hình gồm 44 cấu trúc có thật, phân bố quanh các khớp lớn.",
      en: "Three forms of dense connective structure serving three different mechanical jobs. An aponeurosis is a broad flat tendon that lets a muscle attach over a wide area rather than a single point. Retinacula are transverse bands bridging the wrist and ankle, holding tendons against the skeleton so their line of pull is not lost when the joint flexes. Bursae are small fluid-filled sacs interposed between tendon, muscle, and bone to reduce friction at pressure points. The model contains 44 real structures distributed around the major joints.",
      zh: "三类致密结缔组织结构，承担三种不同的力学任务。腱膜为宽扁的腱性膜片，使肌肉得以在大面积而非单点附着。支持带为跨越腕、踝的横行纤维束，将肌腱固定于骨骼，使关节屈曲时牵拉方向不致偏移。滑膜囊为充液小囊，介于腱、肌与骨之间，于受压处减少摩擦。模型含44个真实结构，分布于各大关节周围。",
    },
    visibleSystems: ["muscular"],
    modelFile: "/models/connective_tissue.glb",
    hotspots: [
      {
        key: "epicranial",
        meshName: "Epicranial aponeurosis.l",
        offset: [0, -170],
        label: { vi: "Cân sọ (mũ gân)", en: "Epicranial aponeurosis (galea aponeurotica)", zh: "帽状腱膜" },
        latinName: "Galea aponeurotica",
        note: {
          vi: "Tấm gân rộng phủ vòm sọ, nối bụng trán và bụng chẩm của cơ chẩm-trán thành một đơn vị hoạt động chung. Vì cân dính chặt vào da đầu nên vết rách da đầu qua lớp này thường há rộng và chảy máu nhiều.",
          en: "A broad tendinous sheet over the cranial vault linking the frontal and occipital bellies of occipitofrontalis into a single working unit. Because it is firmly bound to the scalp, lacerations through this layer gape widely and bleed freely.",
          zh: "覆盖颅顶的宽阔腱性膜片，将枕额肌的额腹与枕腹连为一个功能单位。因其与头皮紧密结合，穿透此层的裂伤常明显裂开并大量出血。",
        },
      },
      {
        key: "palmar",
        meshName: "Palmar aponeurosis.l",
        offset: [170, 40],
        label: { vi: "Cân gan tay", en: "Palmar aponeurosis", zh: "掌腱膜" },
        latinName: "Aponeurosis palmaris",
        note: {
          vi: "Tấm gân hình tam giác ở gan bàn tay, bảo vệ gân gấp và mạch thần kinh bên dưới đồng thời giúp da bàn tay bám chắc khi cầm nắm. Xơ hoá và co rút tấm cân này gây co rút Dupuytren, kéo ngón áp út và ngón út gập vào lòng bàn tay.",
          en: "A triangular tendinous sheet in the palm that protects the underlying flexor tendons and neurovascular bundles while anchoring the palmar skin for grip. Fibrosis and contracture of this sheet cause Dupuytren contracture, drawing the ring and little fingers into the palm.",
          zh: "手掌内的三角形腱性膜片，保护深面的屈肌腱与神经血管束，并固定掌部皮肤以利抓握。此膜纤维化挛缩即致掌腱膜挛缩症，使环指与小指屈向掌心。",
        },
      },
      {
        key: "plantar",
        meshName: "Plantar aponeurosis.l",
        offset: [-160, 190],
        label: { vi: "Cân gan chân", en: "Plantar aponeurosis", zh: "足底腱膜" },
        latinName: "Aponeurosis plantaris",
        note: {
          vi: "Dải gân dày căng từ xương gót tới các ngón chân, giữ vòm dọc bàn chân như dây cung. Viêm tại chỗ bám vào xương gót là nguyên nhân thường gặp nhất của đau gót chân, điển hình là đau nhất ở những bước đầu tiên sau khi ngủ dậy.",
          en: "A thick tendinous band running from the calcaneus to the toes, holding up the longitudinal arch like a bowstring. Inflammation at its calcaneal attachment is the commonest cause of heel pain, classically worst on the first steps after rising.",
          zh: "自跟骨延伸至足趾的厚腱性束带，如弓弦般维持足纵弓。其跟骨附着处的炎症是足跟痛最常见的原因，典型表现为晨起最初几步时疼痛最剧。",
        },
      },
      {
        key: "flexor-retinaculum-wrist",
        meshName: "Flexor retinaculum of wrist.l",
        offset: [160, -60],
        label: { vi: "Mạc giữ gân gấp cổ tay", en: "Flexor retinaculum of the wrist", zh: "腕屈肌支持带" },
        latinName: "Retinaculum musculorum flexorum",
        note: {
          vi: "Dải xơ dày bắc ngang mặt gan cổ tay, cùng các xương cổ tay tạo thành ống cổ tay. Chín gân gấp và thần kinh giữa cùng chui qua ống này; khi khoang bị chèn ép sẽ gây hội chứng ống cổ tay với tê bì ba ngón rưỡi phía ngoài.",
          en: "A thick fibrous band spanning the palmar wrist which, with the carpal bones, forms the carpal tunnel. Nine flexor tendons and the median nerve pass through it; compression within this confined space produces carpal tunnel syndrome with numbness of the lateral three and a half digits.",
          zh: "横跨腕掌侧的厚纤维束带，与腕骨共同构成腕管。九条屈肌腱与正中神经由此通过；此狭窄间隙内受压即致腕管综合征，表现为桡侧三个半手指麻木。",
        },
      },
      {
        key: "extensor-retinaculum-ankle",
        meshName: "Superior extensor retinaculum of ankle.l",
        offset: [150, 200],
        label: { vi: "Mạc giữ gân duỗi cổ chân trên", en: "Superior extensor retinaculum of the ankle", zh: "踝上伸肌支持带" },
        latinName: "Retinaculum musculorum extensorum superius",
        note: {
          vi: "Dải ngang ở mặt trước cổ chân giữ các gân duỗi áp sát xương chày và xương mác khi gấp mu bàn chân, ngăn gân bật ra phía trước thành dây cung.",
          en: "A transverse band across the front of the ankle holding the extensor tendons against the tibia and fibula during dorsiflexion, preventing them from bowstringing forwards.",
          zh: "踝前方的横行束带，于背屈时将伸肌腱固定于胫、腓骨，防止其向前弓弦样弹起。",
        },
      },
      {
        key: "anserine-bursa",
        meshName: "Anserine bursa.l",
        offset: [-150, 120],
        label: { vi: "Túi hoạt dịch chân ngỗng", en: "Anserine bursa", zh: "鹅足滑囊" },
        latinName: "Bursa anserina",
        note: {
          vi: "Túi dịch nằm giữa mặt trong đầu trên xương chày và chỗ bám chung của ba gân cơ may, cơ thon và cơ bán gân. Viêm túi này gây đau mặt trong gối, hay gặp ở người chạy bộ và dễ bị nhầm với tổn thương sụn chêm trong.",
          en: "A fluid sac between the medial surface of the upper tibia and the conjoined insertion of sartorius, gracilis, and semitendinosus. Inflammation here causes medial knee pain, common in runners and easily mistaken for a medial meniscal tear.",
          zh: "位于胫骨上端内侧面与缝匠肌、股薄肌、半腱肌联合止点之间的液囊。此处炎症引起膝内侧疼痛，常见于跑步者，易误诊为内侧半月板损伤。",
        },
      },
      {
        key: "infrapatellar-bursa",
        meshName: "Deep infrapatellar bursa.l",
        offset: [140, 130],
        label: { vi: "Túi hoạt dịch dưới bánh chè sâu", en: "Deep infrapatellar bursa", zh: "髌下深囊" },
        latinName: "Bursa infrapatellaris profunda",
        note: {
          vi: "Túi dịch nằm giữa dây chằng bánh chè và mặt trước xương chày, giảm ma sát khi gối gấp duỗi liên tục.",
          en: "A fluid sac between the patellar ligament and the front of the tibia, reducing friction during repeated flexion and extension of the knee.",
          zh: "位于髌韧带与胫骨前面之间的液囊，减少膝反复屈伸时的摩擦。",
        },
      },
      {
        key: "trochanteric-bursa",
        meshName: "Sciatic bursa of gluteus maximus muscle.l",
        offset: [-140, 20],
        label: { vi: "Túi hoạt dịch cơ mông lớn", en: "Sciatic bursa of gluteus maximus", zh: "臀大肌坐骨囊" },
        latinName: "Bursa ischiadica musculi glutei maximi",
        note: {
          vi: "Túi dịch nằm giữa cơ mông lớn và ụ ngồi, chịu tải khi ngồi lâu trên nền cứng. Viêm túi vùng mông là một nguyên nhân gây đau mông dễ bị nhầm với đau thần kinh toạ.",
          en: "A fluid sac between gluteus maximus and the ischial tuberosity, loaded during prolonged sitting on hard surfaces. Bursitis here is a cause of buttock pain readily confused with sciatica.",
          zh: "位于臀大肌与坐骨结节之间的液囊，久坐硬面时承受负荷。此处滑囊炎所致臀痛易与坐骨神经痛混淆。",
        },
      },
    ],
  },
};
