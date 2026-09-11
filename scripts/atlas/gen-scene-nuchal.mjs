/**
 * Sinh scene "Vùng gáy và cơ sau cổ" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-nuchal.mjs
 *
 * Hai bên. Lọc cơ theo độ cao y 1,40–1,62 (vùng cổ–chẩm) vì cơ dựng sống
 * ("Spinalis", "longissimus thoracis") chạy suốt lưng. Có đủ nhóm dưới chẩm.
 * THIẾU dây XI, ĐM chẩm, dây chằng vàng, cơ nhiều chân cổ.
 */
import { byRe, byName, emit, betweenY, OXY } from "./lib.mjs";

const N = (re) => betweenY(byRe(re, ["muscular", "skeletal", "connective"]), 1.4, 1.62);

emit({
  file: "nuchal",
  exportName: "nuchalScene",
  header: 'Scene "Vùng gáy và cơ sau cổ" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây XI, ĐM chẩm, dây chằng vàng.',
  scene: {
    slug: "co-vung-gay",
    title: { vi: "Vùng gáy và cơ sau cổ", en: "The Nuchal Region", zh: "项区与颈后肌" },
    latin: "Regio cervicalis posterior",
    intro: {
      vi: "Các lớp cơ sau cổ, từ nông vào sâu: cơ thang; cơ gối (đầu, cổ) và cơ nâng vai; cơ bán gai và cơ dài; sâu nhất là bốn cơ dưới chẩm quanh đốt đội–trục, tạo tam giác dưới chẩm có động mạch đốt sống chạy ngang. Chúng giữ đầu nặng khoảng 5kg thăng bằng trên cột sống và tinh chỉnh tư thế đầu. Mỗi lớp một tông màu; xương mờ sẵn. Bộ dữ liệu không có dây XI, động mạch chẩm và dây chằng vàng.",
      en: "The posterior neck muscles, superficial to deep: trapezius; splenius (capitis, cervicis) and levator scapulae; semispinalis and longissimus; deepest of all the four suboccipital muscles around the atlas and axis, forming the suboccipital triangle crossed by the vertebral artery. Together they balance a head weighing about 5kg on the spine and fine-tune its posture. Each layer has its own colour family; bones are faded. The dataset has no accessory nerve, occipital artery or ligamenta flava.",
      zh: "颈后肌由浅入深：斜方肌；夹肌（头、颈）和肩胛提肌；半棘肌和最长肌；最深层为环绕寰枢椎的四块枕下肌，构成枕下三角，椎动脉横贯其中。它们在脊柱上平衡约5kg的头部并精细调节头部姿势。每层一种色系；骨骼淡化。数据集中无副神经、枕动脉和黄韧带。",
    },
  },
  faded: ["xuong"],
  groups: [
    {
      key: "thang",
      tint: "#b58bc4",
      latin: "M. trapezius, pars descendens",
      name: { vi: "Cơ thang (phần xuống)", en: "Trapezius (descending part)", zh: "斜方肌（降部）" },
      note: {
        vi: "Lớp nông nhất, từ ụ chẩm ngoài và dây chằng gáy xuống xương đòn. Nhún vai và giữ vai; do dây XI chi phối — tổn thương ở tam giác cổ sau (nạo hạch cổ) gây vai xệ, khó giơ tay quá đầu.",
        en: "The most superficial layer, from the external occipital protuberance and nuchal ligament down to the clavicle. It shrugs and holds the shoulder; supplied by nerve XI — injury in the posterior triangle (neck dissection) leaves a drooping shoulder and difficulty raising the arm overhead.",
        zh: "最浅层，自枕外隆凸和项韧带延至锁骨。耸肩并稳定肩部；受副神经支配——颈后三角损伤（颈淋巴结清扫）致肩下垂、举臂过头困难。",
      },
      ids: N(/descending part of (left |right )?trapezius$/i),
    },
    {
      key: "goi-nang-vai",
      tint: "#9b6fae",
      latin: "Mm. splenii · M. levator scapulae",
      name: { vi: "Cơ gối đầu, gối cổ và nâng vai", en: "Splenius capitis, splenius cervicis, levator scapulae", zh: "头夹肌、颈夹肌与肩胛提肌" },
      note: {
        vi: "Cơ gối như băng quấn (\"splenius\") ôm các cơ sâu, xoay và ngửa đầu cùng bên. Cơ nâng vai từ mỏm ngang C1–C4 xuống góc trên xương vai — hay co cứng gây đau vai gáy khi ngồi máy tính lâu.",
        en: "The splenius muscles wrap the deeper muscles like a bandage (\"splenius\"), rotating and extending the head to the same side. Levator scapulae runs from the transverse processes of C1–C4 to the superior angle of the scapula — often tight, causing neck–shoulder pain after long hours at a computer.",
        zh: "夹肌如绷带（splenius）包裹深层肌，使头转向同侧并后仰。肩胛提肌自C1–C4横突至肩胛骨上角——常因久坐电脑前紧张导致颈肩痛。",
      },
      ids: N(/splenius (capitis|cervicis)$|levator scapulae$/i),
    },
    {
      key: "ban-gai-dai",
      tint: "#6f93b8",
      latin: "Mm. semispinales · longissimi",
      name: { vi: "Cơ bán gai và cơ dài (đầu, cổ)", en: "Semispinalis and longissimus (capitis, cervicis)", zh: "半棘肌与最长肌（头、颈）" },
      note: {
        vi: "Cơ bán gai đầu là cơ lớn nhất vùng gáy, tạo hai gờ dọc hai bên đường giữa; cùng cơ dài ngửa đầu mạnh. Dây thần kinh chẩm lớn xuyên qua cơ bán gai đầu — bị kích thích gây đau đầu vùng chẩm.",
        en: "Semispinalis capitis is the largest muscle of the nape, forming the two vertical ridges beside the midline; with longissimus it powerfully extends the head. The greater occipital nerve pierces semispinalis capitis — irritation causes occipital headache.",
        zh: "头半棘肌是项部最大的肌肉，在中线两侧形成两条纵嵴；与最长肌共同有力地伸头。枕大神经穿过头半棘肌——受刺激引起枕部头痛。",
      },
      ids: N(/semispinalis (capitis|cervicis)$|longissimus (capitis|cervicis)$/i),
    },
    {
      key: "duoi-cham",
      // Cam hồng: đỏ OXY dành cho ĐM đốt sống chạy ngay trong tam giác dưới chẩm.
      tint: "#e39a7a",
      latin: "Mm. suboccipitales",
      name: { vi: "Bốn cơ dưới chẩm", en: "The four suboccipital muscles", zh: "四块枕下肌" },
      note: {
        vi: "Thẳng đầu sau lớn, thẳng đầu sau bé, chéo đầu trên, chéo đầu dưới — nối xương chẩm với đốt đội và trục, tinh chỉnh gật và xoay đầu. Thẳng lớn, chéo trên và chéo dưới tạo tam giác dưới chẩm: động mạch đốt sống và dây thần kinh dưới chẩm nằm trong tam giác này. Chúng dày đặc thụ thể cảm nhận tư thế.",
        en: "Rectus capitis posterior major and minor, obliquus capitis superior and inferior — linking the occiput to the atlas and axis to fine-tune nodding and turning. Rectus major and the two obliques form the suboccipital triangle, which holds the vertebral artery and suboccipital nerve. They are packed with position-sense receptors.",
        zh: "头后大直肌、头后小直肌、头上斜肌、头下斜肌——连接枕骨与寰枢椎，精细调节点头与转头。头后大直肌与两斜肌围成枕下三角，内有椎动脉和枕下神经。其富含本体感受器。",
      },
      ids: N(/rectus capitis posterior (major|minor)$|obliquus capitis (superior|inferior)$/i),
    },
    {
      key: "co-nho",
      tint: "#e8883d",
      latin: "Mm. interspinales, intertransversarii, rotatores cervicis",
      name: { vi: "Cơ gian gai, gian mỏm ngang, xoay cổ", en: "Interspinales, intertransversarii, rotatores", zh: "棘间肌、横突间肌、颈回旋肌" },
      note: {
        vi: "Lớp sâu nhất nối từng đốt với đốt kề — ổn định từng tầng và cảm nhận vị trí hơn là tạo lực.",
        en: "The deepest layer, linking each vertebra to the next — stabilising segment by segment and sensing position rather than generating force.",
        zh: "最深层，连接相邻椎骨——逐节稳定并感知位置，而非产生大力。",
      },
      ids: N(/interspinales cervicis$|cervical intertransversarii$|cervical rotator$/i),
    },
    {
      key: "dm-dot-song",
      tint: OXY,
      latin: "A. vertebralis",
      name: { vi: "Động mạch đốt sống", en: "Vertebral arteries", zh: "椎动脉" },
      note: {
        vi: "Ra khỏi lỗ mỏm ngang đốt đội, chạy ngang trên cung sau đốt đội trong tam giác dưới chẩm rồi xuyên màng đội–chẩm vào sọ. Ngửa và xoay cổ mạnh có thể bóc tách nó.",
        en: "Leaves the transverse foramen of the atlas, runs across the posterior arch of the atlas in the suboccipital triangle, then pierces the atlanto-occipital membrane into the skull. Forceful extension and rotation can dissect it.",
        zh: "穿出寰椎横突孔，在枕下三角内横行于寰椎后弓上方，再穿寰枕膜入颅。颈部强力后仰和旋转可致其夹层。",
      },
      ids: byRe(/^(left|right) vertebral artery$/i, ["arterial"]),
    },
    {
      key: "xuong",
      latin: "Os occipitale · Atlas · Axis · C3–C7",
      name: { vi: "Xương chẩm và đốt sống cổ (mốc)", en: "Occipital bone and cervical vertebrae (landmarks)", zh: "枕骨与颈椎（标志）" },
      note: {
        vi: "Mờ sẵn để thấy chỗ bám của các cơ dưới chẩm.",
        en: "Faded to show where the suboccipital muscles attach.",
        zh: "淡化以显示枕下肌的附着处。",
      },
      ids: byName("Occipital bone", "Atlas", "Axis").concat(byRe(/^(third|fourth|fifth|sixth|seventh) cervical vertebra$/i, ["skeletal"])),
    },
  ],
});
