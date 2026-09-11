/**
 * Sinh scene "Trung thất" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-mediastinum.mjs
 *
 * Khảo sát: tim (thành + buồng), tuyến ức, khí quản + phế quản gốc, thực
 * quản, cung và ĐM chủ ngực, TM chủ trên, tĩnh mạch cánh tay đầu, hệ đơn,
 * thân ĐM phổi. THIẾU dây X, chuỗi giao cảm, thần kinh hoành, ống ngực và
 * hạch — bài mất phần thần kinh, ghi ở intro. Xương ức mờ sẵn.
 * Bản sao cần bỏ: FJ3427 (ĐM chủ xuống thô).
 */
import { byRe, byName, emit, DEOXY, OXY } from "./lib.mjs";

emit({
  file: "mediastinum",
  exportName: "mediastinumScene",
  header: 'Scene "Trung thất" dựng từ bộ atlas BodyParts3D.\n\nAtlas không có dây X, chuỗi giao cảm, thần kinh hoành, ống ngực.',
  scene: {
    slug: "trung-that",
    title: { vi: "Trung thất", en: "The Mediastinum", zh: "纵隔" },
    latin: "Mediastinum",
    intro: {
      vi: "Trung thất là khoang giữa hai phổi, từ lỗ trên lồng ngực tới cơ hoành. Mặt phẳng qua góc ức (T4–T5) chia trung thất trên và dưới; trung thất dưới lại chia trước (tuyến ức ở trẻ), giữa (tim, màng ngoài tim) và sau (thực quản, động mạch chủ ngực, hệ tĩnh mạch đơn). Khối u trung thất được đoán theo ngăn chứa nó. Bộ dữ liệu không có dây X, chuỗi giao cảm, thần kinh hoành và ống ngực; xương ức mờ sẵn.",
      en: "The mediastinum is the space between the lungs, from the thoracic inlet to the diaphragm. The plane through the sternal angle (T4–T5) divides it into superior and inferior parts; the inferior is split into anterior (thymus in children), middle (heart and pericardium) and posterior (oesophagus, descending aorta, azygos system). A mediastinal mass is diagnosed by the compartment it sits in. The dataset lacks the vagus, sympathetic trunk, phrenic nerve and thoracic duct; the sternum is faded.",
      zh: "纵隔是两肺之间的间隙，上起胸廓上口，下至膈。经胸骨角（T4–T5）的平面将其分为上纵隔和下纵隔；下纵隔再分为前纵隔（儿童有胸腺）、中纵隔（心和心包）和后纵隔（食管、胸主动脉、奇静脉系统）。纵隔肿块依据所在分区进行诊断。数据集中无迷走神经、交感干、膈神经和胸导管；胸骨淡化。",
    },
  },
  exclude: ["FJ3427"],
  faded: ["xuong-uc"],
  groups: [
    {
      key: "tuyen-uc",
      tint: "#e8b3b8",
      latin: "Thymus",
      name: { vi: "Tuyến ức", en: "Thymus", zh: "胸腺" },
      note: {
        vi: "Trung thất trước-trên, lớn nhất ở tuổi dậy thì rồi teo thành mỡ. Nơi tế bào lympho T trưởng thành. U tuyến ức hay đi kèm bệnh nhược cơ.",
        en: "Anterosuperior mediastinum; largest at puberty, then replaced by fat. It is where T lymphocytes mature. A thymoma is often associated with myasthenia gravis.",
        zh: "位于前上纵隔，青春期最大，此后逐渐被脂肪替代。是T淋巴细胞成熟的场所。胸腺瘤常伴重症肌无力。",
      },
      ids: byRe(/lobe of thymus$/i),
    },
    {
      key: "tim",
      tint: "#b8434f",
      latin: "Cor",
      name: { vi: "Tim (trung thất giữa)", en: "Heart (middle mediastinum)", zh: "心（中纵隔）" },
      note: {
        vi: "Chiếm trung thất giữa trong túi màng ngoài tim. Tràn dịch màng ngoài tim nhiều gây chèn ép tim. Chi tiết buồng, van xem bài Giải phẫu Tim.",
        en: "Fills the middle mediastinum inside the pericardial sac. A large pericardial effusion causes tamponade. See the Heart lesson for chambers and valves.",
        zh: "位于中纵隔的心包腔内。大量心包积液导致心脏压塞。心腔与瓣膜详见“心脏解剖”一课。",
      },
      ids: byName("Wall of ventricle", "Wall of left atrium", "Wall of right atrium"),
    },
    {
      key: "dm-chu",
      tint: OXY,
      latin: "Arcus aortae · Aorta thoracica",
      name: { vi: "Cung và động mạch chủ ngực", en: "Aortic arch and descending aorta", zh: "主动脉弓与胸主动脉" },
      note: {
        vi: "Cung động mạch chủ ở trung thất trên, bắt đầu và kết thúc ngang góc ức; đoạn ngực chạy ở trung thất sau, bên trái thực quản. Trên phim X-quang tạo \"núm động mạch chủ\" ở bờ trái trung thất.",
        en: "The aortic arch lies in the superior mediastinum, starting and ending at the level of the sternal angle; the descending aorta runs in the posterior mediastinum, left of the oesophagus. On X-ray it forms the \"aortic knob\" on the left mediastinal border.",
        zh: "主动脉弓位于上纵隔，起止均平胸骨角；胸主动脉行于后纵隔、食管左侧。X线片上在纵隔左缘形成“主动脉结”。",
      },
      ids: byName("Ascending aorta", "Arch of aorta", "Descending thoracic aorta", "Brachiocephalic artery").concat(byRe(/(left|right) common carotid artery$|(left|right) subclavian artery$/i, ["arterial"])),
    },
    {
      key: "dm-phoi",
      tint: DEOXY,
      latin: "Truncus pulmonalis",
      name: { vi: "Thân và động mạch phổi", en: "Pulmonary trunk and arteries", zh: "肺动脉干及肺动脉" },
      note: {
        vi: "Chia đôi ngay dưới cung động mạch chủ; dây chằng động mạch nối chỗ chia với cung — di tích ống động mạch thời bào thai.",
        en: "Divides just beneath the aortic arch; the ligamentum arteriosum links the bifurcation to the arch — the remnant of the fetal ductus arteriosus.",
        zh: "在主动脉弓下方分叉；动脉韧带连接分叉处与主动脉弓——胎儿期动脉导管的遗迹。",
      },
      ids: byName("Pulmonary trunk", "Right pulmonary artery", "Left pulmonary artery"),
    },
    {
      key: "tm-chu-tren",
      tint: "#3f6a8f",
      latin: "V. cava superior · Vv. brachiocephalicae",
      name: { vi: "Tĩnh mạch chủ trên và cánh tay đầu", en: "Superior vena cava and brachiocephalic veins", zh: "上腔静脉与头臂静脉" },
      note: {
        vi: "Tĩnh mạch cánh tay đầu trái dài, bắt chéo trước ba nhánh cung động mạch chủ. Tĩnh mạch chủ trên nằm bên phải trung thất trên, nhận tĩnh mạch đơn ngay trước khi vào tim.",
        en: "The long left brachiocephalic vein crosses in front of the three arch branches. The superior vena cava lies on the right of the superior mediastinum and receives the azygos just before entering the heart.",
        zh: "左头臂静脉较长，横越主动脉弓三大分支前方。上腔静脉位于上纵隔右侧，入心前接受奇静脉。",
      },
      ids: byName("Superior vena cava").concat(byRe(/brachiocephalic vein$/i, ["venous"])),
    },
    {
      key: "tm-don",
      tint: "#6f8fb0",
      latin: "V. azygos · V. hemiazygos",
      name: { vi: "Hệ tĩnh mạch đơn", en: "Azygos system", zh: "奇静脉系统" },
      note: {
        vi: "Trung thất sau. Cung tĩnh mạch đơn vắt qua cuống phổi phải ngang T4 — mốc trong mổ cắt thực quản.",
        en: "Posterior mediastinum. The arch of the azygos hooks over the right lung root at T4 — a landmark in oesophagectomy.",
        zh: "位于后纵隔。奇静脉弓于T4平面跨过右肺根——食管切除术的标志。",
      },
      ids: byRe(/azygos vein$|superior intercostal vein$/i, ["venous"]),
    },
    {
      key: "khi-quan",
      tint: "#9fc6d6",
      latin: "Trachea · Bronchi principales",
      name: { vi: "Khí quản và phế quản gốc", en: "Trachea and main bronchi", zh: "气管与主支气管" },
      note: {
        vi: "Chia đôi ở carina ngang góc ức. Phế quản gốc phải ngắn, to và dốc đứng hơn — nên dị vật hít vào hay rơi xuống phổi phải.",
        en: "Divides at the carina at the level of the sternal angle. The right main bronchus is shorter, wider and more vertical — so inhaled foreign bodies usually fall into the right lung.",
        zh: "在胸骨角平面的隆嵴处分叉。右主支气管短、粗、走行较陡——故误吸异物多坠入右肺。",
      },
      ids: byName("Trachea", "Left main bronchus", "Right main bronchus proper"),
    },
    {
      key: "thuc-quan",
      tint: "#c98a6b",
      latin: "Oesophagus",
      name: { vi: "Thực quản", en: "Oesophagus", zh: "食管" },
      note: {
        vi: "Trung thất sau, ngay sau nhĩ trái — nên nhĩ trái to (hẹp van hai lá) đè lõm thực quản trên phim uống baryt, và siêu âm tim qua thực quản nhìn rõ nhĩ trái.",
        en: "Posterior mediastinum, directly behind the left atrium — so an enlarged left atrium (mitral stenosis) indents the oesophagus on a barium swallow, and transoesophageal echo gives a clear view of the left atrium.",
        zh: "位于后纵隔、左心房正后方——故左心房增大（二尖瓣狭窄）在钡餐造影中压迫食管形成压迹，经食管超声可清晰显示左心房。",
      },
      ids: byName("Esophagus"),
    },
    {
      key: "xuong-uc",
      latin: "Sternum",
      name: { vi: "Xương ức (mốc)", en: "Sternum (landmark)", zh: "胸骨（标志）" },
      note: {
        vi: "Góc ức (chỗ nối cán–thân) là mốc chia trung thất trên và dưới. Mờ sẵn.",
        en: "The sternal angle (manubriosternal joint) marks the superior/inferior mediastinal divide. Faded.",
        zh: "胸骨角（柄体结合处）是上、下纵隔分界的标志。已淡化。",
      },
      ids: byName("Manubrium", "Body of sternum", "Xiphoid process"),
    },
  ],
});
