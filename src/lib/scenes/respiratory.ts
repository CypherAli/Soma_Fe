import type { SceneModule } from "./types";

/** He ho hap - 3 scene. */
export const respiratoryScenes: Record<string, SceneModule> = {
  "giai-phau-phoi": {
    slug: "giai-phau-phoi",
    title: { vi: "Giải phẫu Phổi", en: "Lung Anatomy", zh: "肺解剖" },
    description: {
      vi: "Hai phổi không đối xứng: phổi phải có 3 thuỳ (trên, giữa, dưới) ngăn bởi 2 khe, phổi trái chỉ có 2 thuỳ (trên, dưới) do phần không gian bên trái bị tim chiếm chỗ (khuyết tim). Khí quản ở giữa chia đôi thành 2 phế quản chính dẫn khí vào từng phổi. Mỗi thuỳ được tô một màu riêng để thấy rõ ranh giới — trên thực tế các thuỳ có cùng màu hồng.",
      en: "The two lungs are asymmetric: the right lung has 3 lobes (superior, middle, inferior) separated by 2 fissures, while the left lung has only 2 lobes (superior, inferior) because the heart occupies space on the left (the cardiac notch). The centrally placed trachea bifurcates into 2 main bronchi carrying air to each lung. Each lobe is given a distinct color here to make the boundaries clear — in reality the lobes share the same pink colour.",
      zh: "两肺不对称：右肺有3叶（上、中、下），由2条裂隙分隔；左肺仅有2叶（上、下），因心脏占据左侧空间（心切迹）。居中的气管分叉为2条主支气管，将空气送入各肺。此处每叶用不同颜色以显示分界——实际上各叶均为相同的粉红色。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/lung_anatomy.glb",
    hotspots: [
      {
        key: "sup-lobe-right",
        meshName: "Superior lobe of right lung",
        offset: [140, -70],
        label: { vi: "Thuỳ trên phổi phải", en: "Superior Lobe (Right)", zh: "右肺上叶" },
        latinName: "Lobus superior pulmonis dextri",
        note: {
          vi: "Thuỳ cao nhất của phổi phải, ngăn với thuỳ giữa bởi khe ngang (horizontal fissure) — khe này là đặc điểm chỉ có ở phổi phải, không có ở phổi trái.",
          en: "The uppermost lobe of the right lung, separated from the middle lobe by the horizontal fissure — this fissure is unique to the right lung and has no counterpart on the left.",
          zh: "右肺最上方的肺叶，借水平裂与中叶分隔——此裂为右肺所特有，左肺无对应结构。",
        },
      },
      {
        key: "mid-lobe-right",
        meshName: "Middle lobe of right lung",
        offset: [150, 10],
        label: { vi: "Thuỳ giữa phổi phải", en: "Middle Lobe (Right)", zh: "右肺中叶" },
        latinName: "Lobus medius pulmonis dextri",
        note: {
          vi: "Thuỳ nhỏ nhất, hình nêm ở mặt trước-ngoài phổi phải, nằm giữa khe ngang (trên) và khe chếch (dưới) — chỉ phổi phải mới có thuỳ này.",
          en: "The smallest, wedge-shaped lobe on the anterolateral aspect of the right lung, lying between the horizontal fissure (above) and the oblique fissure (below) — present only in the right lung.",
          zh: "右肺前外侧最小的楔形肺叶，位于水平裂（上）与斜裂（下）之间——仅见于右肺。",
        },
      },
      {
        key: "inf-lobe-right",
        meshName: "Inferior lobe of right lung",
        offset: [150, 90],
        label: { vi: "Thuỳ dưới phổi phải", en: "Inferior Lobe (Right)", zh: "右肺下叶" },
        latinName: "Lobus inferior pulmonis dextri",
        note: {
          vi: "Thuỳ lớn nhất phổi phải, nằm sau-dưới, ngăn với 2 thuỳ trên bởi khe chếch (oblique fissure). Vì nằm thấp và sau, đây là nơi dịch/mủ dễ đọng khi nằm lâu (viêm phổi hít).",
          en: "The largest lobe of the right lung, positioned posteroinferiorly and separated from the upper two lobes by the oblique fissure. Because it lies low and posterior, it is where fluid or pus tends to collect during prolonged recumbency (aspiration pneumonia).",
          zh: "右肺最大的肺叶，位于后下方，借斜裂与上两叶分隔。因位置低而靠后，长期卧床时液体或脓液易在此积聚（吸入性肺炎）。",
        },
      },
      {
        key: "sup-lobe-left",
        meshName: "Superior lobe of left lung",
        offset: [-150, -60],
        label: { vi: "Thuỳ trên phổi trái", en: "Superior Lobe (Left)", zh: "左肺上叶" },
        latinName: "Lobus superior pulmonis sinistri",
        note: {
          vi: "Thuỳ trên phổi trái, có phần lưỡi (lingula) nhô xuống trước — được coi là 'tương đương' thuỳ giữa phổi phải. Bờ trước lõm vào tạo khuyết tim (cardiac notch) nhường chỗ cho tim.",
          en: "The superior lobe of the left lung, bearing an inferior tongue-like projection (the lingula) — considered the 'equivalent' of the right middle lobe. Its anterior border is indented to form the cardiac notch, making room for the heart.",
          zh: "左肺上叶，向前下方伸出舌状突起（舌叶）——被视为右肺中叶的'对应结构'。其前缘凹陷形成心切迹，为心脏让出空间。",
        },
      },
      {
        key: "inf-lobe-left",
        meshName: "Inferior lobe of left lung",
        offset: [-150, 80],
        label: { vi: "Thuỳ dưới phổi trái", en: "Inferior Lobe (Left)", zh: "左肺下叶" },
        latinName: "Lobus inferior pulmonis sinistri",
        note: {
          vi: "Thuỳ dưới phổi trái, ngăn với thuỳ trên bởi khe chếch. Cùng với thuỳ dưới phổi phải, đây là vùng phổi tiếp xúc với cơ hoành nhiều nhất khi hít sâu.",
          en: "The inferior lobe of the left lung, separated from the superior lobe by the oblique fissure. Together with the right inferior lobe, this is the lung region that contacts the diaphragm most during deep inspiration.",
          zh: "左肺下叶，借斜裂与上叶分隔。与右肺下叶一起，是深吸气时与膈接触最多的肺区。",
        },
      },
      {
        key: "trachea",
        meshName: "Trachea",
        offset: [10, -130],
        label: { vi: "Khí quản", en: "Trachea", zh: "气管" },
        latinName: "Trachea",
        note: {
          vi: "Ống dẫn khí trung tâm dài ~10-12cm, giữ mở nhờ 16-20 vòng sụn hình chữ C (hở ở mặt sau giáp thực quản). Chia đôi tại carina (ngang mức đốt sống ngực T4-T5) thành phế quản chính phải và trái.",
          en: "The central airway, ~10-12cm long, held open by 16-20 C-shaped cartilage rings (open posteriorly against the oesophagus). It bifurcates at the carina (around the T4-T5 vertebral level) into the right and left main bronchi.",
          zh: "中央气道，长约10-12cm，由16-20个C形软骨环支撑保持开放（后方对食管处开口）。在气管隆嵴（约平第4-5胸椎）分为左右主支气管。",
        },
      },
    ],
  },
  "thanh-quan": {
    slug: "thanh-quan",
    title: { vi: "Giải phẫu Thanh quản", en: "Larynx Anatomy", zh: "喉解剖" },
    description: {
      vi: "Thanh quản là 'hộp phát âm' nối hầu với khí quản, vừa bảo vệ đường thở khi nuốt vừa tạo âm thanh. Khung của nó gồm các sụn (sụn giáp lớn nhất tạo 'trái cổ', sụn nhẫn hình nhẫn, cặp sụn phễu nhỏ điều khiển dây thanh) và nắp thanh môn đậy kín đường thở khi nuốt. Các cơ nội tại thanh quản kéo sụn phễu để mở/khép dây thanh, điều chỉnh cao độ giọng nói.",
      en: "The larynx is the 'voice box' connecting the pharynx to the trachea, both protecting the airway during swallowing and producing sound. Its framework consists of cartilages (the thyroid cartilage forms the 'Adam's apple', the ring-shaped cricoid, and the paired small arytenoids that steer the vocal folds) and the epiglottis that seals the airway during swallowing. The intrinsic laryngeal muscles rotate the arytenoids to open/close the vocal folds and adjust vocal pitch.",
      zh: "喉是连接咽与气管的'发声器官'，既在吞咽时保护气道，又产生声音。其支架由软骨组成（甲状软骨最大，形成'喉结'；环状软骨呈环形；成对的小杓状软骨控制声带），会厌在吞咽时封闭气道。喉内肌旋转杓状软骨以开闭声带并调节音高。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/larynx_anatomy.glb",
    hotspots: [
      {
        key: "thyroid-cartilage",
        meshName: "Thyroid cartilage",
        offset: [-140, -40],
        label: { vi: "Sụn giáp", en: "Thyroid Cartilage", zh: "甲状软骨" },
        latinName: "Cartilago thyroidea",
        note: {
          vi: "Sụn lớn nhất của thanh quản, gồm 2 mảnh gặp nhau ở đường giữa tạo góc nhô ra trước — chính là 'trái cổ' (Adam's apple), rõ hơn ở nam do góc nhọn hơn dưới tác động hormone tuổi dậy thì.",
          en: "The largest laryngeal cartilage, formed by two plates meeting anteriorly at the midline to create a forward projection — the 'Adam's apple', more prominent in males because the angle is sharper under the influence of pubertal hormones.",
          zh: "喉最大的软骨，由两块板在中线前方汇合形成向前突起——即'喉结'，男性因青春期激素作用角度更锐而更明显。",
        },
      },
      {
        key: "cricoid-cartilage",
        meshName: "Cricoid cartilage",
        offset: [-130, 70],
        label: { vi: "Sụn nhẫn", en: "Cricoid Cartilage", zh: "环状软骨" },
        latinName: "Cartilago cricoidea",
        note: {
          vi: "Sụn duy nhất tạo vòng KÍN hoàn toàn quanh đường thở (hình chiếc nhẫn, bản rộng ở sau) — là nền tựa cho toàn bộ thanh quản và mốc quan trọng trong đặt nội khí quản, mở khí quản cấp cứu.",
          en: "The only cartilage that forms a COMPLETE ring around the airway (shaped like a signet ring, with the broad plate at the back) — it is the foundation supporting the entire larynx and an important landmark for intubation and emergency airway procedures.",
          zh: "唯一在气道周围形成完整闭环的软骨（形似印戒，宽板位于后方）——是支撑整个喉的基础，也是气管插管与紧急气道操作的重要标志。",
        },
      },
      {
        key: "arytenoid",
        meshName: "Arytenoid cartilage.l",
        offset: [130, 30],
        label: { vi: "Sụn phễu", en: "Arytenoid Cartilage", zh: "杓状软骨" },
        latinName: "Cartilago arytaenoidea",
        note: {
          vi: "Cặp sụn nhỏ hình tháp ngồi trên bản sau sụn nhẫn — mỏm thanh âm của chúng bám vào dây thanh. Khi các cơ nội tại xoay sụn phễu, dây thanh mở ra (thở) hay khép lại (phát âm).",
          en: "A pair of small pyramidal cartilages sitting on the posterior plate of the cricoid — their vocal processes anchor the vocal folds. As the intrinsic muscles rotate the arytenoids, the vocal folds open (breathing) or close (phonation).",
          zh: "一对位于环状软骨后板上的小锥形软骨——其声带突固定声带。喉内肌旋转杓状软骨时，声带张开（呼吸）或闭合（发声）。",
        },
      },
      {
        key: "epiglottis",
        meshName: "Epiglottis",
        offset: [-40, -120],
        label: { vi: "Nắp thanh môn", en: "Epiglottis", zh: "会厌" },
        latinName: "Epiglottis",
        note: {
          vi: "Lá sụn đàn hồi hình chiếc lá ở phía trên thanh quản — khi nuốt, nó gập xuống đậy kín lối vào thanh quản, hướng thức ăn/nước vào thực quản phía sau, ngăn sặc vào đường thở.",
          en: "A leaf-shaped elastic cartilage above the larynx — during swallowing it folds down to seal the laryngeal inlet, directing food and liquid into the oesophagus behind and preventing aspiration into the airway.",
          zh: "喉上方的叶状弹性软骨——吞咽时向下折叠封闭喉入口，将食物和液体导入后方的食管，防止误吸入气道。",
        },
      },
      {
        key: "post-cricoarytenoid",
        meshName: "Posterior crico-arytenoid muscle.l",
        offset: [150, 100],
        label: { vi: "Cơ nhẫn-phễu sau", en: "Posterior Crico-arytenoid", zh: "环杓后肌" },
        latinName: "Musculus cricoarytaenoideus posterior",
        note: {
          vi: "Cơ nội tại DUY NHẤT mở dây thanh (dạng thanh môn) — kéo mỏm cơ của sụn phễu ra sau khiến dây thanh tách ra để thở. Liệt cả 2 bên cơ này gây khép dây thanh, tắc đường thở nguy hiểm.",
          en: "The ONLY intrinsic muscle that opens the vocal folds (abducts the glottis) — it pulls the muscular process of the arytenoid backward, separating the vocal folds for breathing. Bilateral paralysis of this muscle closes the folds and dangerously obstructs the airway.",
          zh: "唯一使声带张开（外展声门）的喉内肌——将杓状软骨的肌突向后牵拉，使声带分开以便呼吸。此肌双侧麻痹会致声带闭合，危险地阻塞气道。",
        },
      },
    ],
  },
  "co-hoanh": {
    slug: "co-hoanh",
    title: { vi: "Cơ hoành", en: "Diaphragm", zh: "膈肌" },
    description: {
      vi: "Cơ hoành là cơ hô hấp CHÍNH: tấm cơ-gân hình vòm ngăn cách khoang ngực (trên) với khoang bụng (dưới). Khi hít vào, nó co lại và hạ xuống làm phẳng vòm, tăng thể tích lồng ngực để hút khí vào phổi; khi thở ra, nó giãn và trồi lên. Cơ hoành có 3 lỗ cho thực quản, động mạch chủ và tĩnh mạch chủ dưới đi xuyên qua. Được chi phối bởi thần kinh hoành (C3-C5) — nên tổn thương tuỷ cổ cao có thể làm ngừng thở.",
      en: "The diaphragm is the PRIMARY muscle of respiration: a dome-shaped musculotendinous sheet separating the thoracic cavity (above) from the abdominal cavity (below). On inspiration it contracts and descends, flattening the dome and increasing thoracic volume to draw air into the lungs; on expiration it relaxes and rises. It has 3 openings for the oesophagus, aorta, and inferior vena cava to pass through. Innervated by the phrenic nerve (C3-C5) — so a high cervical spinal cord injury can stop breathing.",
      zh: "膈是呼吸的主要肌肉：一片穹顶状的肌腱膜，分隔胸腔（上）与腹腔（下）。吸气时收缩下降，使穹顶变平、增大胸腔容积，将空气吸入肺；呼气时松弛上升。膈有3个孔，供食管、主动脉和下腔静脉穿过。由膈神经（C3-C5）支配——故高位颈髓损伤可致呼吸停止。",
    },
    visibleSystems: ["muscular"],
    modelFile: "/models/diaphragm.glb",
    hotspots: [
      {
        key: "diaphragm",
        meshName: "Diaphragm",
        offset: [140, 0],
        label: { vi: "Cơ hoành", en: "Diaphragm", zh: "膈肌" },
        latinName: "Diaphragma",
        note: {
          vi: "Vòm cơ có phần cơ ở ngoại vi (bám vào bờ dưới lồng ngực, xương ức, cột sống thắt lưng) hội tụ vào một tấm gân trung tâm (central tendon) ở đỉnh vòm — chính vùng gân này là nơi tim tựa lên qua màng ngoài tim.",
          en: "A muscular dome whose peripheral muscle fibers (attaching to the lower rib margin, sternum, and lumbar spine) converge onto a central tendon at the apex of the dome — this tendinous region is where the heart rests via the pericardium.",
          zh: "肌性穹顶，其周边肌纤维（附着于下肋缘、胸骨和腰椎）汇聚于穹顶顶部的中心腱——此腱性区域是心脏经心包所依托之处。",
        },
      },
    ],
  },
};
