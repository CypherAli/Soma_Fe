/**
 * BÀI BỘ PHẬN học theo lớp (kiểu Complete Anatomy) — dựng từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-parts.mjs
 *
 * Khác bài chuyên đề: mở ra chỉ thấy lớp XƯƠNG, người học bật thêm lớp Cơ,
 * Mạch máu… thay vì mọi cấu trúc hiện cùng lúc (user chê bài chuyên đề nhìn
 * rối, khó học). Mỗi nhóm = một cấu trúc cụ thể, tô màu riêng để phân biệt.
 * Slug tiền tố `bo-phan-` — bài mới, không có SceneModule Z-Anatomy.
 */
import { byRe, emit, leftSide, betweenY, groupsFrom, OXY, DEOXY } from "./lib.mjs";

const L = (re, sys, y0 = 0, y1 = 1.8) => betweenY(leftSide(byRe(re, sys)), y0, y1);
const MU = ["muscular", "skeletal"];
const ART = ["arterial"];
const VEN = ["venous"];
const BONE = ["skeletal"];
const g = (key, tint, latin, vi, en, zh, nvi, nen, nzh, ids) => ({
  key, tint, latin, name: { vi, en, zh }, note: { vi: nvi, en: nen, zh: nzh }, ids,
});
const LAYERS = (bone, muscle, vessel) => [
  { key: "xuong", name: { vi: "Xương", en: "Bones", zh: "骨" }, groups: bone, on: true },
  { key: "co", name: { vi: "Cơ", en: "Muscles", zh: "肌" }, groups: muscle },
  { key: "mach", name: { vi: "Mạch máu", en: "Vessels", zh: "血管" }, groups: vessel },
];

// ───────────────────────── Bộ phận: GỐI ─────────────────────────
emit({
  file: "part-knee",
  script: "parts",
  exportName: "partKneeScene",
  header: 'Bài bộ phận "Gối" học theo lớp, dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng chéo/bên, sụn chêm, bao khớp.',
  scene: {
    slug: "bo-phan-goi",
    system: "skeletal",
    title: { vi: "Gối — học theo lớp", en: "The Knee — Layer by Layer", zh: "膝——分层学习" },
    latin: "Genu",
    intro: {
      vi: "Mở ra chỉ có lớp xương: đầu dưới xương đùi, xương bánh chè, đầu trên xương chày và xương mác. Bật lớp Cơ để thấy cơ nào bắt qua gối và kéo theo hướng nào. Bật lớp Mạch máu để thấy động mạch khoeo và năm động mạch gối. Bấm vào từng cấu trúc để đọc ghi chú, hoặc dùng nút Cô lập để xem riêng. Bộ dữ liệu không có dây chằng chéo, dây chằng bên và sụn chêm.",
      en: "It opens on the bones alone: the lower femur, patella, upper tibia and fibula. Turn on Muscles to see which muscles cross the knee and which way they pull. Turn on Vessels to see the popliteal artery and the five genicular arteries. Tap any structure to read its note, or Isolate it. The dataset has no cruciate or collateral ligaments and no menisci.",
      zh: "打开时仅显示骨层：股骨下端、髌骨、胫骨上端和腓骨。开启“肌”层可见跨膝的肌肉及其牵拉方向；开启“血管”层可见腘动脉和五条膝动脉。点击任一结构阅读注释，或使用“孤立”单独查看。数据集中无交叉韧带、侧副韧带和半月板。",
    },
  },
  // Căn theo VÙNG GỐI (bánh chè + cơ khoeo + mạch gối), không theo cả xương đùi/chày dài.
  frame: ["banh-che", "khoeo", "dm"],
  layers: LAYERS(["loi-cau", "banh-che", "mam-chay", "mac"], ["tu-dau", "dui-sau", "chan-ngong", "bung-chan", "khoeo", "chau-chay"], ["dm", "tm"]),
  groups: [
    g("loi-cau", "#e6d7b0", "Femur", "Xương đùi (lồi cầu trong, ngoài)", "Femur (medial and lateral condyles)", "股骨（内、外侧髁）",
      "Hai lồi cầu tròn lăn và trượt trên mâm chày. Lồi cầu trong dài hơn nên khi duỗi hết xương đùi xoay trong để khoá gối. Rãnh ròng rọc phía trước là nơi xương bánh chè trượt.",
      "The two rounded condyles roll and glide on the tibial plateau. The medial condyle is longer, so at full extension the femur rotates medially to lock the knee. The trochlear groove in front is where the patella glides.",
      "两个圆形股骨髁在胫骨平台上滚动和滑动。内侧髁较长，完全伸直时股骨内旋锁定膝关节。前方滑车沟为髌骨滑动之处。",
      L(/^(left )?femur$/i, BONE)),
    g("banh-che", "#f2c14e", "Patella", "Xương bánh chè", "Patella", "髌骨",
      "Xương vừng lớn nhất cơ thể, nằm trong gân cơ tứ đầu. Nó tăng cánh tay đòn khi duỗi gối khoảng 30%. Mặt sau có sụn dày nhất cơ thể.",
      "The largest sesamoid bone, lying in the quadriceps tendon. It lengthens the extensor lever arm by about 30%. Its back carries the thickest cartilage in the body.",
      "人体最大的籽骨，位于股四头肌腱内，使伸膝力臂增加约30%。其后面有全身最厚的软骨。",
      L(/^(left )?patella$/i, BONE)),
    g("mam-chay", "#d98c5f", "Tibia", "Xương chày (mâm chày, lồi củ chày)", "Tibia (plateau and tuberosity)", "胫骨（平台与粗隆）",
      "Mâm chày gần như phẳng, nên độ vững của gối dựa vào dây chằng và sụn chêm. Lồi củ chày phía trước là chỗ bám của gân bánh chè.",
      "The plateau is almost flat, so knee stability rests on ligaments and menisci. The tibial tuberosity in front anchors the patellar tendon.",
      "胫骨平台几乎平坦，膝关节稳定性依赖韧带和半月板。前方胫骨粗隆为髌韧带附着处。",
      L(/^(left )?tibia$/i, BONE)),
    g("mac", "#b8a88a", "Fibula", "Xương mác (chỏm mác)", "Fibula (head)", "腓骨（腓骨头）",
      "Không tham gia khớp gối nhưng chỏm mác là chỗ bám của nhị đầu đùi và dây chằng bên ngoài. Dây mác chung vòng quanh cổ xương mác.",
      "Takes no part in the knee joint, but its head anchors biceps femoris and the lateral collateral ligament. The common fibular nerve winds round its neck.",
      "不参与膝关节，但腓骨头为股二头肌和外侧副韧带附着处。腓总神经绕腓骨颈走行。",
      L(/^(left )?fibula$/i, BONE)),
    g("tu-dau", "#6f93b8", "M. quadriceps femoris", "Cơ tứ đầu đùi", "Quadriceps femoris", "股四头肌",
      "Bốn đầu: thẳng đùi, rộng ngoài, rộng giữa, rộng trong — hội vào gân bánh chè. Cơ duỗi gối duy nhất.",
      "Four heads — rectus femoris and vastus lateralis, intermedius and medialis — joining in the patellar tendon. The only knee extensor.",
      "四个头——股直肌、股外侧肌、股中间肌、股内侧肌——汇成髌韧带。唯一的伸膝肌。",
      L(/^(left |right )?(rectus femoris|vastus (lateralis|medialis|intermedius))$/i, MU, 0.4, 0.95)),
    g("dui-sau", "#c9705f", "Mm. ischiocrurales", "Nhóm đùi sau", "Hamstrings", "腘绳肌",
      "Bán gân, bán màng (trong) và nhị đầu đùi (ngoài) gấp gối, tạo hai bờ trên của hố khoeo.",
      "Semitendinosus and semimembranosus (medial) and biceps femoris (lateral) flex the knee and form the upper borders of the popliteal fossa.",
      "半腱肌、半膜肌（内侧）和股二头肌（外侧）屈膝，构成腘窝上界。",
      L(/head of (left |right )?biceps femoris$|^(left |right )?(semitendinosus|semimembranosus)$/i, MU, 0.3, 0.9)),
    g("chan-ngong", "#b58bc4", "Pes anserinus", "Cơ may, cơ thon (chân ngỗng)", "Sartorius and gracilis (pes anserinus)", "缝匠肌、股薄肌（鹅足）",
      "Cùng bán gân bám mặt trong đầu trên xương chày như bàn chân ngỗng.",
      "With semitendinosus they insert on the upper medial tibia like a goose's foot.",
      "与半腱肌共同止于胫骨上端内侧，形如鹅足。",
      L(/^(left |right )?(sartorius|gracilis)$/i, MU, 0.3, 0.95)),
    g("bung-chan", "#e8883d", "M. gastrocnemius · M. plantaris", "Cơ bụng chân và cơ gan chân", "Gastrocnemius and plantaris", "腓肠肌与跖肌",
      "Hai đầu bám hai lồi cầu đùi nên vừa gấp gối vừa gấp gan bàn chân.",
      "Its two heads arise from the femoral condyles, so it flexes both knee and ankle.",
      "两头起于股骨两髁，故既屈膝又跖屈足。",
      L(/head of (left |right )?gastrocnemius$|^(left |right )?plantaris$/i, MU, 0.2, 0.6)),
    g("khoeo", "#e6c14a", "M. popliteus", "Cơ khoeo", "Popliteus", "腘肌",
      "Mở khoá gối khi bắt đầu gấp bằng cách xoay ngoài xương đùi.",
      "Unlocks the knee at the start of flexion by rotating the femur laterally.",
      "屈膝开始时使股骨外旋以解锁膝关节。",
      L(/^(left |right )?popliteus$/i, MU)),
    g("chau-chay", "#9fb8a0", "Tractus iliotibialis", "Dải chậu–chày", "Iliotibial tract", "髂胫束",
      "Dải cân mặt ngoài đùi, bám lồi củ Gerdy của xương chày, giữ vững mặt ngoài gối.",
      "Fascial band of the outer thigh inserting on Gerdy's tubercle, steadying the outer knee.",
      "大腿外侧筋膜带，止于胫骨Gerdy结节，稳定膝外侧。",
      L(/^(left )?iliotibial tract$/i, ["skeletal", "connective"])),
    g("dm", OXY, "A. poplitea · Aa. genus", "Động mạch khoeo và năm động mạch gối", "Popliteal artery and the five genicular arteries", "腘动脉与五条膝动脉",
      "Động mạch khoeo nằm sâu nhất, sát xương đùi. Năm động mạch gối ôm quanh khớp thành vòng nối.",
      "The popliteal artery lies deepest, on the femur. Five genicular arteries ring the joint as an anastomosis.",
      "腘动脉位置最深，紧贴股骨。五条膝动脉环绕关节形成吻合。",
      L(/^(left |right )?popliteal artery$|genicular artery$/i, ART, 0.35, 0.6)),
    g("tm", DEOXY, "V. poplitea · V. saphena parva", "Tĩnh mạch khoeo, hiển bé, gối", "Popliteal, small saphenous and genicular veins", "腘静脉、小隐静脉与膝静脉",
      "Tĩnh mạch khoeo nằm nông hơn động mạch; tĩnh mạch hiển bé đổ vào nó.",
      "The popliteal vein lies superficial to the artery; the small saphenous joins it.",
      "腘静脉位于动脉浅面，小隐静脉注入其中。",
      L(/^(left |right )?(popliteal|genicular) vein$/i, VEN, 0.35, 0.6)),
  ].map(({ ids, ...rest }) => ({ ...rest, ids })),
});

/** Lớp tuỳ ý: [key, vi, en, zh, groups, on]. */
const LY = (...rows) => rows.map(([key, vi, en, zh, groups, on]) => ({ key, name: { vi, en, zh }, groups, ...(on ? { on } : {}) }));
const intro3 = (vi, en, zh) => ({ vi, en, zh });

// ───────────────────────── Bộ phận: VAI ─────────────────────────
emit({
  file: "part-shoulder", script: "parts", exportName: "partShoulderScene",
  header: 'Bài bộ phận "Vai" học theo lớp, dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu bao khớp, sụn viền, dây chằng quạ–cùng vai, đám rối cánh tay.',
  scene: {
    slug: "bo-phan-vai", system: "skeletal",
    title: { vi: "Vai — học theo lớp", en: "The Shoulder — Layer by Layer", zh: "肩——分层学习" }, latin: "Regio deltoidea · Articulatio humeri",
    intro: intro3(
      "Mở ra là lớp xương: xương đòn, xương vai và đầu trên xương cánh tay, ba xương tạo nên vai. Bật lớp Cơ sâu để thấy bốn cơ chóp xoay ôm chỏm xương cánh tay. Bật lớp Cơ nông để thấy cơ delta, cơ thang và cơ ngực phủ bên ngoài. Bật lớp Mạch máu để thấy động mạch nách và các nhánh vòng quanh vai. Bộ dữ liệu không có bao khớp, sụn viền và đám rối cánh tay.",
      "It opens on the bones: clavicle, scapula and upper humerus, the three bones of the shoulder. Turn on Deep muscles to see the four rotator cuff muscles hugging the humeral head. Turn on Superficial muscles for deltoid, trapezius and pectoralis on the outside. Turn on Vessels for the axillary artery and the branches that circle the shoulder. The dataset has no capsule, labrum or brachial plexus.",
      "打开时显示骨层：锁骨、肩胛骨和肱骨上端——构成肩部的三块骨。开启“深层肌”可见环抱肱骨头的四块肩袖肌；开启“浅层肌”可见外层的三角肌、斜方肌和胸肌；开启“血管”可见腋动脉及环绕肩部的分支。数据集中无关节囊、盂唇和臂丛。"),
  },
  frame: ["xuong-vai", "xuong-don", "delta"],
  layers: LY(
    ["xuong", "Xương", "Bones", "骨", ["xuong-don", "xuong-vai", "canh-tay"], true],
    ["co-sau", "Cơ sâu (chóp xoay)", "Deep muscles (rotator cuff)", "深层肌（肩袖）", ["tren-gai", "duoi-gai", "tron-be", "duoi-vai", "tron-lon"]],
    ["co-nong", "Cơ nông", "Superficial muscles", "浅层肌", ["delta", "thang", "nguc", "rang-truoc"]],
    ["mach", "Mạch máu", "Vessels", "血管", ["dm", "tm"]],
  ),
  groups: [
    g("xuong-don", "#e6d7b0", "Clavicula", "Xương đòn", "Clavicle", "锁骨", "Thanh chống giữ vai cách xa lồng ngực; gãy nhiều nhất ở chỗ nối 1/3 giữa và ngoài.", "The strut holding the shoulder off the chest; it breaks most often at the junction of the middle and outer thirds.", "使肩部远离胸廓的支撑杆，最常在中外1/3交界处骨折。", L(/^(left )?clavicle$/i, BONE)),
    g("xuong-vai", "#d9c08a", "Scapula", "Xương vai", "Scapula", "肩胛骨", "Có gai vai, mỏm cùng vai, mỏm quạ và ổ chảo nông — ổ chảo chỉ bằng khoảng 1/3 chỏm xương cánh tay.", "Carries the spine, acromion, coracoid and a shallow glenoid — only about a third the size of the humeral head.", "有肩胛冈、肩峰、喙突和浅的关节盂——关节盂仅约为肱骨头的1/3。", L(/^(left )?scapula$/i, BONE)),
    g("canh-tay", "#c9b98f", "Humerus", "Xương cánh tay (chỏm, củ lớn, củ bé)", "Humerus (head, tubercles)", "肱骨（头、大小结节）", "Củ lớn nhận cơ trên gai, dưới gai, tròn bé; củ bé nhận cơ dưới vai. Cổ phẫu thuật là chỗ hay gãy ở người già.", "The greater tubercle takes supraspinatus, infraspinatus and teres minor; the lesser tubercle takes subscapularis. The surgical neck is a common fracture site in the elderly.", "大结节接受冈上肌、冈下肌、小圆肌；小结节接受肩胛下肌。外科颈为老年人常见骨折部位。", L(/^(left )?humerus$/i, BONE)),
    g("tren-gai", "#d9534f", "M. supraspinatus", "Cơ trên gai", "Supraspinatus", "冈上肌", "Khởi động dạng vai; gân chui dưới mỏm cùng vai nên hay bị chèn ép và rách.", "Starts abduction; its tendon runs under the acromion and is the one most often impinged and torn.", "启动肩外展；肌腱经肩峰下，最易受撞击和撕裂。", L(/^(left |right )?supraspinatus( muscle)?$/i, MU, 1.3, 1.5)),
    g("duoi-gai", "#e8883d", "M. infraspinatus", "Cơ dưới gai", "Infraspinatus", "冈下肌", "Cơ xoay ngoài chính của cánh tay.", "The main lateral rotator of the arm.", "上臂的主要外旋肌。", L(/^(left |right )?infraspinatus( muscle)?$/i, MU, 1.25, 1.5)),
    g("tron-be", "#e6c14a", "M. teres minor", "Cơ tròn bé", "Teres minor", "小圆肌", "Xoay ngoài cùng cơ dưới gai; do dây nách chi phối.", "Rotates laterally with infraspinatus; supplied by the axillary nerve.", "与冈下肌共同外旋；受腋神经支配。", L(/^(left |right )?teres minor$/i, MU, 1.25, 1.5)),
    g("duoi-vai", "#5b9bd5", "M. subscapularis", "Cơ dưới vai", "Subscapularis", "肩胛下肌", "Cơ lớn nhất chóp xoay, xoay trong và chặn chỏm trượt ra trước.", "The largest cuff muscle; it rotates medially and stops the head sliding forward.", "肩袖中最大的肌肉，内旋并阻止肱骨头前滑。", L(/^(left |right )?subscapularis$/i, MU, 1.2, 1.5)),
    g("tron-lon", "#8d7bb5", "M. teres major", "Cơ tròn lớn", "Teres major", "大圆肌", "Không thuộc chóp xoay: khép và xoay trong cánh tay.", "Not a cuff muscle: it adducts and medially rotates the arm.", "不属肩袖：使上臂内收和内旋。", L(/^(left |right )?teres major$/i, MU, 1.2, 1.5)),
    g("delta", "#c9705f", "M. deltoideus", "Cơ delta", "Deltoid", "三角肌", "Tạo đường cong vai; phần cùng vai dạng tay từ khoảng 15° tới 90°. Dây nách chi phối.", "Gives the shoulder its contour; the acromial part abducts from about 15° to 90°. Supplied by the axillary nerve.", "形成肩部轮廓；肩峰部使臂外展约15°至90°。受腋神经支配。", L(/part of (left |right )?deltoid$/i, MU, 1.25, 1.5)),
    g("thang", "#b58bc4", "M. trapezius", "Cơ thang", "Trapezius", "斜方肌", "Nâng, kéo vào trong và xoay xương vai để ổ chảo hướng lên khi giơ tay cao.", "Elevates, retracts and rotates the scapula so the glenoid faces up when the arm is raised.", "上提、后缩并旋转肩胛骨，使举臂时关节盂朝上。", leftSide(byRe(/part of (left |right )?trapezius$/i, ["muscular"]))),
    g("nguc", "#e39a7a", "Mm. pectoralis major et minor", "Cơ ngực lớn, ngực bé", "Pectoralis major and minor", "胸大肌、胸小肌", "Ngực lớn khép và xoay trong cánh tay; ngực bé kéo mỏm quạ xuống trước.", "Pectoralis major adducts and medially rotates the arm; minor pulls the coracoid down and forward.", "胸大肌使臂内收内旋；胸小肌将喙突拉向前下。", leftSide(byRe(/part of (left |right )?pectoralis major$|^(left |right )?pectoralis minor$/i, ["muscular"]))),
    g("rang-truoc", "#f0a58a", "M. serratus anterior", "Cơ răng trước", "Serratus anterior", "前锯肌", "Ép xương vai vào lồng ngực; liệt gây xương vai vểnh.", "Holds the scapula to the chest; its palsy gives a winged scapula.", "使肩胛骨紧贴胸廓；麻痹致翼状肩胛。", leftSide(byRe(/^(left |right )?serratus anterior$/i, ["muscular"]))),
    g("dm", OXY, "A. axillaris et rami", "Động mạch nách và nhánh quanh vai", "Axillary artery and branches around the shoulder", "腋动脉及肩周分支", "Nhánh mũ cánh tay trước, sau vòng quanh cổ phẫu thuật; nhánh dưới vai và trên vai tạo vòng nối quanh xương vai.", "The circumflex humeral arteries ring the surgical neck; the subscapular and suprascapular branches form the scapular anastomosis.", "旋肱前、后动脉环绕外科颈；肩胛下支和肩胛上支构成肩胛动脉网。", L(/^(left |right )?(axillary|subscapular|circumflex scapular|thoracodorsal|anterior circumflex humeral|posterior circumflex humeral|suprascapular|dorsal scapular) artery$|thoraco-acromial artery$/i, ART, 1.25, 1.6)),
    g("tm", DEOXY, "V. axillaris · V. cephalica", "Tĩnh mạch nách, tĩnh mạch đầu", "Axillary and cephalic veins", "腋静脉、头静脉", "Tĩnh mạch đầu chạy trong rãnh delta–ngực, mốc đường mổ trước khớp vai.", "The cephalic vein runs in the deltopectoral groove, the landmark for the anterior approach to the shoulder.", "头静脉行于三角胸肌沟，是肩关节前入路的标志。", L(/^(left |right )?(axillary|cephalic|subscapular|circumflex scapular|anterior circumflex humeral) vein$/i, VEN, 1.25, 1.55)),
  ],
});

// ───────────────────────── Bộ phận: KHUỶU ─────────────────────────
emit({
  file: "part-elbow", script: "parts", exportName: "partElbowScene",
  header: 'Bài bộ phận "Khuỷu" học theo lớp, dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu bao khớp, dây chằng bên, dây chằng vòng, dây thần kinh.',
  scene: {
    slug: "bo-phan-khuyu", system: "skeletal",
    title: { vi: "Khuỷu — học theo lớp", en: "The Elbow — Layer by Layer", zh: "肘——分层学习" }, latin: "Cubitus",
    intro: intro3(
      "Mở ra là lớp xương: đầu dưới xương cánh tay, xương quay, xương trụ. Ròng rọc khớp với xương trụ như bản lề, chỏm con khớp với chỏm quay xoay tròn. Bật lớp Cơ gấp–duỗi, rồi lớp Cơ sấp–ngửa để phân biệt hai cặp động tác của khuỷu. Bật lớp Mạch máu để thấy động mạch cánh tay chia đôi ở hố khuỷu và vòng nối quanh khớp. Bộ dữ liệu không có dây chằng và dây thần kinh.",
      "It opens on the bones: lower humerus, radius and ulna. The trochlea hinges with the ulna and the capitulum meets the spinning radial head. Turn on Flexors–extensors, then Pronators–supinators, to separate the elbow's two pairs of movements. Turn on Vessels to see the brachial artery dividing in the cubital fossa and the loop around the joint. The dataset has no ligaments or nerves.",
      "打开时显示骨层：肱骨下端、桡骨和尺骨。滑车与尺骨构成铰链，肱骨小头与旋转的桡骨头相关节。先后开启“屈伸肌”和“旋前旋后肌”，区分肘的两组动作；开启“血管”可见肱动脉在肘窝分叉及关节周围的吻合环。数据集中无韧带和神经。"),
  },
  frame: ["co-khuyu", "ngua", "vong-noi"],
  layers: LY(
    ["xuong", "Xương", "Bones", "骨", ["canh-tay", "quay", "tru"], true],
    ["gap-duoi", "Cơ gấp–duỗi", "Flexors–extensors", "屈伸肌", ["nhi-dau", "co-canh-tay", "canh-tay-quay", "tam-dau", "co-khuyu"]],
    ["sap-ngua", "Cơ sấp–ngửa", "Pronators–supinators", "旋前旋后肌", ["sap-tron", "ngua"]],
    ["mach", "Mạch máu", "Vessels", "血管", ["dm", "vong-noi", "tm"]],
  ),
  groups: [
    g("canh-tay", "#e6d7b0", "Humerus", "Xương cánh tay (ròng rọc, chỏm con, hai mỏm trên lồi cầu)", "Humerus (trochlea, capitulum, epicondyles)", "肱骨（滑车、小头、内外上髁）", "Mỏm trên lồi cầu ngoài là nguyên uỷ cơ duỗi (đau ở đây là khuỷu tay quần vợt), mỏm trong là nguyên uỷ cơ gấp.", "The lateral epicondyle is the extensor origin (pain here is tennis elbow); the medial is the flexor origin.", "外上髁为伸肌起点（此处疼痛即网球肘），内上髁为屈肌起点。", L(/^(left )?humerus$/i, BONE)),
    g("quay", "#d98c5f", "Radius", "Xương quay", "Radius", "桡骨", "Chỏm quay xoay trong dây chằng vòng khi sấp–ngửa.", "The radial head spins in the annular ligament during pronation and supination.", "旋前旋后时桡骨头在环状韧带内旋转。", L(/^(left )?radius$/i, BONE)),
    g("tru", "#c9b98f", "Ulna", "Xương trụ (mỏm khuỷu, mỏm vẹt)", "Ulna (olecranon, coronoid)", "尺骨（鹰嘴、冠突）", "Mỏm khuỷu là điểm tì khi chống tay, nơi bám của cơ tam đầu.", "The olecranon is the point of the elbow and the triceps insertion.", "鹰嘴为肘尖，肱三头肌止点。", L(/^(left )?ulna$/i, BONE)),
    g("nhi-dau", "#c9705f", "M. biceps brachii", "Cơ nhị đầu", "Biceps", "肱二头肌", "Gấp khuỷu và là cơ ngửa mạnh nhất.", "Flexes the elbow and is the strongest supinator.", "屈肘，也是最强的旋后肌。", L(/head of (left |right )?biceps brachii$/i, MU, 1.05, 1.45)),
    g("co-canh-tay", "#e39a7a", "M. brachialis", "Cơ cánh tay", "Brachialis", "肱肌", "Cơ gấp khuỷu thuần tuý, nằm dưới nhị đầu.", "The pure elbow flexor, beneath biceps.", "单纯屈肘肌，位于肱二头肌深面。", L(/^(left |right )?brachialis$/i, MU)),
    g("canh-tay-quay", "#e8883d", "M. brachioradialis", "Cơ cánh tay–quay", "Brachioradialis", "肱桡肌", "Gấp khuỷu mạnh nhất ở tư thế nửa sấp, như khi cầm cốc.", "Strongest in mid-pronation, as when holding a cup.", "半旋前位（如握杯）时屈肘最强。", L(/^(left |right )?brachioradialis$/i, MU)),
    g("tam-dau", "#6f8fbf", "M. triceps brachii", "Cơ tam đầu", "Triceps", "肱三头肌", "Cơ duỗi khuỷu duy nhất đáng kể; ba đầu hội vào mỏm khuỷu.", "The main elbow extensor; its three heads meet on the olecranon.", "主要伸肘肌；三头汇于鹰嘴。", L(/head of (left |right )?triceps brachii$/i, MU, 1.05, 1.45)),
    g("co-khuyu", "#8fb0c8", "M. anconeus", "Cơ khuỷu", "Anconeus", "肘肌", "Cơ nhỏ phụ duỗi và căng bao khớp phía sau.", "A small helper in extension that tenses the back of the capsule.", "辅助伸肘并紧张关节囊后部的小肌。", L(/^(left |right )?anconeus$/i, MU)),
    g("sap-tron", "#b58bc4", "Mm. pronator teres et quadratus", "Cơ sấp tròn, sấp vuông", "Pronator teres and quadratus", "旋前圆肌、旋前方肌", "Kéo xương quay bắt chéo trước xương trụ — úp bàn tay.", "Swing the radius across the ulna, turning the palm down.", "使桡骨交叉于尺骨前方——使掌心向下。", L(/head of (left |right )?pronator teres$|^(left |right )?pronator quadratus$/i, MU, 0.88, 1.12)),
    g("ngua", "#9fb8a0", "M. supinator", "Cơ ngửa", "Supinator", "旋后肌", "Quấn quanh cổ xương quay, cùng nhị đầu ngửa bàn tay. Nhánh sâu dây quay xuyên qua cơ này.", "Wraps the radial neck and, with biceps, turns the palm up. The deep branch of the radial nerve pierces it.", "包绕桡骨颈，与肱二头肌共同使掌心向上。桡神经深支穿过此肌。", L(/^(left |right )?supinator$/i, MU)),
    g("dm", OXY, "A. brachialis → A. radialis, A. ulnaris", "Động mạch cánh tay, quay, trụ", "Brachial, radial and ulnar arteries", "肱动脉、桡动脉、尺动脉", "Động mạch cánh tay chia đôi ở hố khuỷu, ngay trong gân nhị đầu.", "The brachial divides in the cubital fossa, just medial to the biceps tendon.", "肱动脉在肘窝内、肱二头肌腱内侧分叉。", L(/^(left |right )?(brachial|radial|ulnar|common interosseous) artery$/i, ART, 0.95, 1.3)),
    // Đỏ tươi, KHÔNG cam: cam là màu cơ cánh tay–quay cùng bài (audit: CUNG MAU).
    g("vong-noi", "#d9534f", "Rete articulare cubiti", "Vòng nối quanh khuỷu", "Anastomosis around the elbow", "肘关节动脉网", "Nhánh bên của động mạch cánh tay đi xuống nối với nhánh quặt ngược đi lên.", "Collateral branches of the brachial descend to meet recurrent branches climbing up.", "肱动脉侧副支下行，与上行的返支吻合。", L(/(superior|inferior) ulnar collateral artery$|collateral branch of (left |right )?deep brachial artery$|recurrent artery$/i, ART, 1.0, 1.25)),
    g("tm", DEOXY, "Vv. superficiales cubiti", "Tĩnh mạch nông vùng khuỷu", "Superficial veins at the elbow", "肘部浅静脉", "Tĩnh mạch giữa khuỷu nối tĩnh mạch đầu với tĩnh mạch nền — chỗ lấy máu chuẩn.", "The median cubital vein links cephalic and basilic — the standard site for drawing blood.", "肘正中静脉连接头静脉与贵要静脉——标准采血部位。", L(/^(left |right )?(median cubital|cephalic|basilic|median antebrachial) vein$/i, VEN, 0.95, 1.25)),
  ],
});

// ───────────────────────── Bộ phận: BÀN TAY ─────────────────────────
emit({
  file: "part-hand", script: "parts", exportName: "partHandScene",
  header: 'Bài bộ phận "Bàn tay" học theo lớp, dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây thần kinh giữa/trụ, bao gân, cân gan tay.',
  scene: {
    slug: "bo-phan-ban-tay", system: "skeletal",
    title: { vi: "Bàn tay — học theo lớp", en: "The Hand — Layer by Layer", zh: "手——分层学习" }, latin: "Manus",
    intro: intro3(
      "Mở ra là 27 xương: 8 xương cổ tay, 5 xương đốt bàn và 14 đốt ngón, mỗi vùng một màu. Bật lớp Cơ nội tại để thấy ô mô cái, ô mô út và các cơ gian cốt, cơ giun làm nên sự khéo léo của bàn tay. Bật lớp Mạch máu để thấy hai cung động mạch gan tay nông và sâu. Bộ dữ liệu không có dây thần kinh và bao gân.",
      "It opens on the 27 bones: 8 carpals, 5 metacarpals and 14 phalanges, each region in its own colour. Turn on Intrinsic muscles to see the thenar and hypothenar eminences and the interossei and lumbricals behind the hand's dexterity. Turn on Vessels for the superficial and deep palmar arches. The dataset has no nerves or tendon sheaths.",
      "打开时显示27块骨：8块腕骨、5块掌骨和14块指骨，各区一种颜色。开启“手固有肌”可见鱼际、小鱼际及骨间肌、蚓状肌——手部灵巧的基础；开启“血管”可见掌浅弓和掌深弓。数据集中无神经和腱鞘。"),
  },
  layers: LY(
    ["xuong", "Xương", "Bones", "骨", ["co-tay", "dot-ban", "dot-ngon"], true],
    ["co", "Cơ nội tại", "Intrinsic muscles", "手固有肌", ["mo-cai", "mo-ut", "khep-cai", "gian-cot"]],
    ["mach", "Mạch máu", "Vessels", "血管", ["cung-nong", "cung-sau", "tm"]],
  ),
  groups: [
    g("co-tay", "#e6c14a", "Ossa carpi", "Tám xương cổ tay", "The eight carpals", "八块腕骨", "Hai hàng: thuyền, nguyệt, tháp, đậu và thang, thê, cả, móc. Xương thuyền gãy nhiều nhất khi ngã chống tay.", "Two rows: scaphoid, lunate, triquetrum, pisiform and trapezium, trapezoid, capitate, hamate. The scaphoid breaks most often in a fall on the hand.", "两列：手舟骨、月骨、三角骨、豌豆骨和大多角骨、小多角骨、头状骨、钩骨。摔倒手撑地时手舟骨最常骨折。", L(/^(left )?(scaphoid|lunate|triquetral|pisiform|trapezium|trapezoid|capitate|hamate)$/i, BONE)),
    g("dot-ban", "#d98c5f", "Ossa metacarpi", "Năm xương đốt bàn", "Five metacarpals", "五块掌骨", "Đốt bàn I ngắn, khớp yên ngựa với xương thang nên ngón cái đối chiếu được.", "The short first metacarpal has a saddle joint with the trapezium, so the thumb can oppose.", "第1掌骨短，与大多角骨构成鞍状关节，使拇指能对掌。", L(/^(left )?(first|second|third|fourth|fifth) metacarpal bone$/i, BONE)),
    g("dot-ngon", "#8fb0c8", "Phalanges", "Mười bốn đốt ngón", "Fourteen phalanges", "十四节指骨", "Ngón cái hai đốt, các ngón khác ba đốt.", "The thumb has two, the other fingers three.", "拇指两节，其余各指三节。", L(/phalanx of (left )?(thumb|index finger|middle finger|ring finger|little finger)$/i, BONE)),
    g("mo-cai", "#c9705f", "Eminentia thenaris", "Ô mô cái", "Thenar eminence", "鱼际", "Dạng ngắn, gấp ngắn và đối chiếu ngón cái — teo khi dây giữa bị chèn trong ống cổ tay.", "Abductor, flexor and opponens pollicis — they waste when the median nerve is compressed in the carpal tunnel.", "拇短展肌、拇短屈肌、拇对掌肌——腕管内正中神经受压时萎缩。", L(/^(left |right )?(abductor pollicis brevis|opponens pollicis|flexor pollicis brevis)$|superficial head of (left |right )?flexor pollicis brevis$/i, MU, 0.75, 0.95)),
    g("mo-ut", "#b58bc4", "Eminentia hypothenaris", "Ô mô út", "Hypothenar eminence", "小鱼际", "Dạng, gấp ngắn và đối chiếu ngón út; do dây trụ chi phối.", "Abductor, flexor and opponens digiti minimi; supplied by the ulnar nerve.", "小指展肌、小指短屈肌、小指对掌肌；受尺神经支配。", L(/digiti minimi( brevis)? of (left )?hand$/i, MU, 0.75, 0.95)),
    g("khep-cai", "#e8883d", "M. adductor pollicis", "Cơ khép ngón cái", "Adductor pollicis", "拇收肌", "Kẹp chặt ngón cái vào bàn tay; yếu cơ này làm dấu hiệu Froment dương tính.", "Clamps the thumb to the palm; its weakness gives a positive Froment sign.", "使拇指紧贴手掌；其无力致Froment征阳性。", L(/head of (left |right )?adductor pollicis$/i, MU, 0.75, 0.95)),
    g("gian-cot", "#6f93b8", "Mm. interossei · lumbricales", "Cơ gian cốt và cơ giun", "Interossei and lumbricals", "骨间肌与蚓状肌", "Gian cốt mu dạng, gian cốt gan khép ngón; cơ giun gấp khớp bàn–ngón và duỗi khớp liên đốt — tư thế cầm bút.", "Dorsal interossei abduct, palmar adduct; lumbricals flex the knuckles and straighten the finger joints — the pen-holding posture.", "骨间背侧肌外展、骨间掌侧肌内收；蚓状肌屈掌指关节、伸指间关节——握笔姿势。", L(/interossei of (left )?hand$|lumbricals of (left )?hand$/i, MU, 0.75, 0.95)),
    g("cung-nong", OXY, "Arcus palmaris superficialis", "Cung động mạch gan tay nông", "Superficial palmar arch", "掌浅弓", "Chủ yếu từ động mạch trụ, nằm ngang mép ngón cái dạng hết cỡ.", "Mainly from the ulnar artery, level with the web of the fully abducted thumb.", "主要来自尺动脉，平拇指充分外展时的指蹼。", L(/superficial palmar arterial arch$|common palmar digital artery$|proper palmar digital artery/i, ART, 0.72, 0.9)),
    g("cung-sau", "#d9534f", "Arcus palmaris profundus", "Cung động mạch gan tay sâu", "Deep palmar arch", "掌深弓", "Chủ yếu từ động mạch quay, cao hơn cung nông khoảng 1cm.", "Mainly from the radial artery, about 1cm higher.", "主要来自桡动脉，约高于掌浅弓1cm。", L(/deep palmar arch$|palmar metacarpal artery$|arteria princeps pollicis$|arteria radialis indicis$/i, ART, 0.75, 0.9)),
    g("tm", DEOXY, "Venae manus", "Tĩnh mạch bàn tay", "Veins of the hand", "手部静脉", "Máu dồn về mạng tĩnh mạch mu tay — chỗ đặt kim truyền quen thuộc.", "Blood gathers in the dorsal venous network — a familiar cannulation site.", "血液汇入手背静脉网——常用的输液部位。", L(/palmar venous arch$|dorsal venous network of (left )?hand$/i, VEN, 0.75, 0.92)),
  ],
});

// ───────────────────────── Bộ phận: HÔNG ─────────────────────────
emit({
  file: "part-hip", script: "parts", exportName: "partHipScene",
  header: 'Bài bộ phận "Hông" học theo lớp, dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu bao khớp, dây chằng chậu–đùi, dây ngồi.',
  scene: {
    slug: "bo-phan-hong", system: "skeletal",
    title: { vi: "Hông — học theo lớp", en: "The Hip — Layer by Layer", zh: "髋——分层学习" }, latin: "Regio coxae",
    intro: intro3(
      "Mở ra là lớp xương: xương chậu với ổ cối sâu ôm chỏm xương đùi, cùng xương cùng. Bật lớp Cơ sâu để thấy cơ thắt lưng–chậu (gấp) và nhóm xoay ngoài ngắn. Bật lớp Cơ nông để thấy ba cơ mông và nhóm khép. Bật lớp Mạch máu để thấy động mạch đùi, nhánh mũ đùi và tĩnh mạch mông. Bộ dữ liệu không có bao khớp và dây ngồi.",
      "It opens on the bones: the hip bone with its deep acetabulum cupping the femoral head, and the sacrum. Turn on Deep muscles for iliopsoas (flexion) and the short lateral rotators. Turn on Superficial muscles for the three gluteals and the adductors. Turn on Vessels for the femoral artery, circumflex branches and gluteal veins. The dataset has no capsule or sciatic nerve.",
      "打开时显示骨层：髋骨（深的髋臼包绕股骨头）和骶骨。开启“深层肌”可见髂腰肌（屈髋）和短外旋肌群；开启“浅层肌”可见三块臀肌和内收肌群；开启“血管”可见股动脉、旋股支和臀静脉。数据集中无关节囊和坐骨神经。"),
  },
  frame: ["chau", "mong"],
  layers: LY(
    ["xuong", "Xương", "Bones", "骨", ["chau", "dui", "cung"], true],
    ["co-sau", "Cơ sâu", "Deep muscles", "深层肌", ["that-lung-chau", "xoay-ngoai"]],
    ["co-nong", "Cơ nông", "Superficial muscles", "浅层肌", ["mong", "khep"]],
    ["mach", "Mạch máu", "Vessels", "血管", ["dm", "tm"]],
  ),
  groups: [
    g("chau", "#e6d7b0", "Os coxae", "Xương chậu (ổ cối)", "Hip bone (acetabulum)", "髋骨（髋臼）", "Ba xương cánh chậu, ngồi, mu dính nhau ở ổ cối. Ổ cối sâu nên khớp hông vững hơn khớp vai nhiều.", "Ilium, ischium and pubis fuse at the acetabulum. The deep socket makes the hip far more stable than the shoulder.", "髂骨、坐骨、耻骨在髋臼处融合。髋臼深，使髋关节远比肩关节稳定。", L(/^(left )?hip bone$/i, BONE)),
    g("dui", "#d9c08a", "Femur", "Xương đùi (chỏm, cổ, hai mấu chuyển)", "Femur (head, neck, trochanters)", "股骨（头、颈、大小转子）", "Cổ xương đùi hợp với thân góc khoảng 125°; gãy cổ ở người già dễ hoại tử chỏm.", "The neck meets the shaft at about 125°; neck fractures in the elderly risk necrosis of the head.", "股骨颈与干约成125°；老年人股骨颈骨折易致股骨头坏死。", L(/^(left )?femur$/i, BONE)),
    g("cung", "#c9b98f", "Os sacrum", "Xương cùng", "Sacrum", "骶骨", "Khớp với xương chậu ở khớp cùng–chậu, truyền sức nặng thân mình xuống chi dưới.", "Joins the hip bones at the sacroiliac joints, passing body weight to the legs.", "借骶髂关节与髋骨相连，将躯干重量传至下肢。", byRe(/^sacrum$/i, BONE)),
    g("that-lung-chau", "#6f93b8", "M. iliopsoas", "Cơ thắt lưng–chậu", "Iliopsoas", "髂腰肌", "Cơ gấp hông mạnh nhất, bám mấu chuyển bé.", "The strongest hip flexor, inserting on the lesser trochanter.", "最强的屈髋肌，止于小转子。", L(/^(left |right )?(psoas major|iliacus)$/i, MU, 0.75, 1.2)),
    g("xoay-ngoai", "#e8883d", "Mm. pelvitrochanterici", "Nhóm xoay ngoài ngắn", "Short lateral rotators", "短外旋肌群", "Hình lê, sinh đôi, bịt trong–ngoài, vuông đùi — như chóp xoay của hông.", "Piriformis, gemelli, obturators, quadratus femoris — the hip's rotator cuff.", "梨状肌、上下孖肌、闭孔内外肌、股方肌——髋的“肩袖”。", L(/^(left |right )?(piriformis|gemellus (superior|inferior)|obturator (internus|externus)|quadratus femoris)$/i, MU)),
    g("mong", "#c9705f", "Mm. glutei", "Ba cơ mông", "The three gluteals", "三块臀肌", "Mông lớn duỗi hông; mông nhỡ, bé dạng hông và giữ khung chậu thăng bằng khi bước.", "Maximus extends the hip; medius and minimus abduct and keep the pelvis level in walking.", "臀大肌伸髋；臀中、小肌外展髋并在行走时维持骨盆水平。", L(/^(left |right )?gluteus (maximus|medius|minimus)$/i, MU)),
    g("khep", "#b58bc4", "Mm. adductores", "Nhóm cơ khép", "Adductors", "内收肌群", "Khép dài, ngắn, lớn, lược, thon — hay căng rách ở người đá bóng.", "Adductor longus, brevis and magnus, pectineus and gracilis — often strained in footballers.", "长收肌、短收肌、大收肌、耻骨肌、股薄肌——足球运动员常拉伤。", L(/^(left |right )?(adductor (longus|brevis|magnus|minimus)|pectineus|gracilis)$/i, MU, 0.55, 1.0)),
    g("dm", OXY, "A. femoralis · A. circumflexa femoris lateralis", "Động mạch đùi và mũ đùi", "Femoral and circumflex femoral arteries", "股动脉与旋股动脉", "Các nhánh mũ đùi vòng quanh cổ xương đùi và nuôi chỏm.", "The circumflex branches ring the femoral neck and feed the head.", "旋股支环绕股骨颈并供应股骨头。", L(/^(left |right )?(external iliac|femoral|lateral circumflex femoral) artery$/i, ART, 0.65, 1.0)),
    g("tm", DEOXY, "Vv. femoralis, gluteae", "Tĩnh mạch đùi, mông, mũ đùi", "Femoral, gluteal and circumflex veins", "股静脉、臀静脉、旋股静脉", "Tĩnh mạch mông trên, dưới đi qua hai lỗ trên và dưới cơ hình lê.", "The superior and inferior gluteal veins pass above and below piriformis.", "臀上、下静脉经梨状肌上、下孔。", L(/^(left |right )?(femoral|deep femoral|superior gluteal|inferior gluteal|lateral circumflex femoral|medial circumflex femoral) vein$/i, VEN, 0.65, 1.05)),
  ],
});

// ─────────────────── Bộ phận: CỔ CHÂN – BÀN CHÂN ───────────────────
emit({
  file: "part-foot", script: "parts", exportName: "partFootScene",
  header: 'Bài bộ phận "Cổ chân–bàn chân" học theo lớp, dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng delta, dây chằng bên ngoài, cân gan chân, dây thần kinh.',
  scene: {
    slug: "bo-phan-co-chan-ban-chan", system: "skeletal",
    title: { vi: "Cổ chân và bàn chân — học theo lớp", en: "Ankle and Foot — Layer by Layer", zh: "踝与足——分层学习" }, latin: "Tarsus · Pes",
    intro: intro3(
      "Mở ra là 26 xương bàn chân cùng đầu dưới xương chày, xương mác. Hậu túc, trung túc và tiền túc mỗi vùng một màu, dễ thấy các vòm bàn chân. Bật lớp Gân cẳng chân để thấy các gân từ cẳng chân vòng qua mắt cá xuống bàn chân. Bật lớp Cơ gan chân để thấy các cơ nội tại. Bật lớp Mạch máu để thấy động mạch mu chân và động mạch gan chân. Bộ dữ liệu không có dây chằng cổ chân và cân gan chân.",
      "It opens on the 26 bones of the foot with the lower tibia and fibula. Hindfoot, midfoot and forefoot each have a colour, so the arches stand out. Turn on Leg tendons to see the tendons curving round the malleoli into the foot. Turn on Sole muscles for the intrinsic muscles. Turn on Vessels for the dorsalis pedis and plantar arteries. The dataset has no ankle ligaments or plantar aponeurosis.",
      "打开时显示足部26块骨及胫腓骨下端。后足、中足、前足各一种颜色，足弓清晰可见。开启“小腿肌腱”可见绕踝进入足部的肌腱；开启“足底肌”可见足固有肌；开启“血管”可见足背动脉和足底动脉。数据集中无踝韧带和足底腱膜。"),
  },
  frame: ["hau-tuc", "trung-tuc", "tien-tuc"],
  layers: LY(
    ["xuong", "Xương", "Bones", "骨", ["cang-chan", "hau-tuc", "trung-tuc", "tien-tuc"], true],
    ["gan", "Gân cẳng chân", "Leg tendons", "小腿肌腱", ["gap-mu", "mac", "gan-got", "sau-sau"]],
    ["co", "Cơ gan chân", "Sole muscles", "足底肌", ["co-gan-chan"]],
    ["mach", "Mạch máu", "Vessels", "血管", ["dm-mu", "dm-gan", "tm"]],
  ),
  groups: [
    g("cang-chan", "#e6d7b0", "Tibia · Fibula", "Đầu dưới xương chày và mác (hai mắt cá)", "Lower tibia and fibula (the malleoli)", "胫腓骨下端（内外踝）", "Hai mắt cá kẹp xương sên như một cái mộng.", "The two malleoli grip the talus like a mortise.", "内外踝如榫卯般夹住距骨。", L(/^(left )?(tibia|fibula)$/i, BONE)),
    g("hau-tuc", "#d98c5f", "Talus · Calcaneus", "Hậu túc: sên, gót", "Hindfoot: talus and calcaneus", "后足：距骨、跟骨", "Xương sên không có cơ bám, máu nuôi nghèo; xương gót lớn nhất, chịu lực khi tiếp đất.", "The talus has no muscle attachments and a poor blood supply; the calcaneus is the largest and takes heel strike.", "距骨无肌肉附着、血供差；跟骨最大，承受足跟着地冲击。", L(/^(left )?(talus|calcaneus)$/i, BONE)),
    g("trung-tuc", "#e6c14a", "Os naviculare, cuboideum, cuneiformia", "Trung túc: thuyền, hộp, ba chêm", "Midfoot: navicular, cuboid, cuneiforms", "中足：足舟骨、骰骨、楔骨", "Xương thuyền là đỉnh vòm dọc trong; ba xương chêm khoá vòm ngang.", "The navicular crowns the medial arch; the cuneiforms lock the transverse arch.", "足舟骨为内侧纵弓顶点；三块楔骨锁住横弓。", L(/^(left )?(navicular bone of foot|cuboid bone|(medial|intermediate|lateral) cuneiform bone)$/i, BONE)),
    g("tien-tuc", "#9fb8a0", "Metatarsi · Phalanges", "Tiền túc: đốt bàn, đốt ngón, xương vừng", "Forefoot: metatarsals, phalanges, sesamoids", "前足：跖骨、趾骨、籽骨", "Đốt bàn II dài và cố định nhất, hay gãy mỏi ở người lính.", "The second metatarsal is the longest and most fixed, the site of march fractures.", "第2跖骨最长最固定，是行军骨折的好发部位。", L(/metatarsal bone$|phalanx of (left )?(big|second|third|fourth|little) toe$|^sesamoid bone of (left )?foot$/i, BONE)),
    g("gap-mu", "#6f93b8", "Tendines compartimenti anterioris", "Gân khoang trước (gấp mu)", "Anterior compartment tendons (dorsiflexors)", "前群肌腱（背屈）", "Chày trước, duỗi dài ngón cái, duỗi dài các ngón, mác ba đi trước cổ chân.", "Tibialis anterior, extensor hallucis and digitorum longus and fibularis tertius cross the front of the ankle.", "胫骨前肌、拇长伸肌、趾长伸肌、第三腓骨肌经踝前方。", L(/^(left |right )?(tibialis anterior|extensor hallucis longus|extensor digitorum longus|fibularis tertius|extensor hallucis brevis)$/i, MU, 0, 0.5)),
    g("mac", "#e8883d", "Mm. fibulares", "Gân cơ mác (lật ngoài)", "Fibular tendons (evertors)", "腓骨肌腱（外翻）", "Vòng sau mắt cá ngoài; mác dài luồn dưới gan chân tới đốt bàn I.", "They pass behind the lateral malleolus; longus crosses the sole to the first metatarsal.", "经外踝后方；腓骨长肌腱经足底至第1跖骨。", L(/^(left |right )?fibularis (longus|brevis)$/i, MU, 0, 0.5)),
    g("gan-got", "#c9705f", "Tendo calcaneus · M. triceps surae", "Gân gót và tam đầu cẳng chân", "Calcaneal tendon and triceps surae", "跟腱与小腿三头肌", "Gân to và khoẻ nhất cơ thể, lực đẩy chính khi bước.", "The body's thickest, strongest tendon — the main push-off in walking.", "人体最粗最强的肌腱，行走时的主要推进力。", L(/^(left )?calcaneal tendon$/i, ["connective"]).concat(L(/^(left |right )?soleus$|head of (left |right )?gastrocnemius$/i, MU, 0.1, 0.5))),
    g("sau-sau", "#b58bc4", "Tendines compartimenti posterioris profundi", "Gân khoang sau sâu (ống cổ chân)", "Deep posterior tendons (tarsal tunnel)", "后群深层肌腱（踝管）", "Chày sau, gấp dài các ngón, gấp dài ngón cái vòng sau mắt cá trong.", "Tibialis posterior, flexor digitorum longus and flexor hallucis longus pass behind the medial malleolus.", "胫骨后肌、趾长屈肌、拇长屈肌经内踝后方。", L(/^(left |right )?(tibialis posterior|flexor digitorum longus|flexor hallucis longus)$/i, MU, 0, 0.5)),
    g("co-gan-chan", "#e39a7a", "Mm. plantae", "Cơ gan chân", "Muscles of the sole", "足底肌", "Bốn lớp cơ dưới cân gan chân giữ các vòm khi đứng và bước.", "Four layers under the plantar aponeurosis hold the arches in standing and walking.", "足底腱膜下的四层肌在站立和行走时维持足弓。", L(/of (left )?foot$|^(left |right )?(abductor hallucis|flexor digitorum brevis|flexor accessorius)$|head of (left |right )?(flexor hallucis brevis|adductor hallucis)$/i, MU, 0, 0.12)),
    g("dm-mu", OXY, "A. dorsalis pedis", "Động mạch mu chân", "Dorsalis pedis artery", "足背动脉", "Bắt mạch giữa gân duỗi dài ngón cái và gân duỗi các ngón.", "Its pulse is felt between the extensor hallucis longus and extensor digitorum tendons.", "在拇长伸肌腱与趾长伸肌腱之间可触及搏动。", L(/^(left |right )?(anterior tibial|dorsalis pedis|arcuate|lateral tarsal|deep plantar) artery$/i, ART, 0, 0.3)),
    g("dm-gan", "#d9534f", "Aa. plantares", "Động mạch chày sau và gan chân", "Posterior tibial and plantar arteries", "胫后动脉与足底动脉", "Bắt mạch chày sau giữa mắt cá trong và gân gót.", "The posterior tibial pulse is felt between the medial malleolus and the calcaneal tendon.", "胫后动脉搏动于内踝与跟腱之间触及。", L(/^(left |right )?(posterior tibial|medial plantar|lateral plantar) artery$|^(left )?plantar arch$/i, ART, 0, 0.3)),
    g("tm", DEOXY, "Venae pedis", "Tĩnh mạch bàn chân", "Veins of the foot", "足部静脉", "Cung tĩnh mạch mu chân là gốc của tĩnh mạch hiển lớn và hiển bé.", "The dorsal venous arch gives rise to the great and small saphenous veins.", "足背静脉弓为大、小隐静脉的起源。", L(/venous arch of (left )?foot$|^(left |right )?posterior tibial vein$/i, VEN, 0, 0.3)),
  ],
});

// ─────────── Bộ phận CƠ QUAN — dựng lại từ bài chuyên đề đã kiểm, thêm lớp ───────────
const organ = ({ file, exportName, slug, system, title, latin, intro, from, layers, faded }) =>
  emit({
    file, script: "parts", exportName,
    header: `Bài bộ phận "${title.vi}" học theo lớp — nhóm lấy từ ${from}.ts (đã kiểm), chỉ thêm lớp.`,
    scene: { slug, system, title, latin, intro },
    groups: groupsFrom(from),
    layers,
    ...(faded ? { faded } : {}),
  });

organ({
  file: "part-heart", exportName: "partHeartScene", slug: "bo-phan-tim", system: "cardiovascular", from: "heart",
  title: { vi: "Tim — học theo lớp", en: "The Heart — Layer by Layer", zh: "心——分层学习" }, latin: "Cor",
  intro: intro3(
    "Mở ra là bốn buồng tim và vách tim, cùng mạch vành nằm trên mặt tim. Bấm từng buồng trong danh sách để làm nổi và đọc ghi chú, hoặc bật Mặt cắt để nhìn vào lòng buồng. Bật lớp Van để thấy bốn van. Bật lớp Mạch lớn để thấy động mạch chủ, thân động mạch phổi (máu nghèo oxy, tô xanh) và tĩnh mạch phổi (máu giàu oxy, tô đỏ). Tắt lớp Mạch vành nếu muốn nhìn riêng hình dạng các buồng.",
    "It opens on the four chambers and the septum, with the coronary vessels on the surface. Tap a chamber in the list to highlight it and read its note, or turn on Section to look inside. Turn on Valves for the four valves. Turn on Great vessels for the aorta, the pulmonary trunk (deoxygenated, blue) and the pulmonary veins (oxygenated, red). Turn off Coronary vessels to see the chambers' shape alone.",
    "打开时显示四个心腔和间隔，以及心表面的冠状血管。点击列表中的心腔可高亮并阅读注释，或开启“剖面”查看腔内。开启“瓣膜”可见四个瓣膜；开启“大血管”可见主动脉、肺动脉干（缺氧血，蓝色）和肺静脉（含氧血，红色）。关闭“冠状血管”可单独观察心腔形态。"),
  layers: LY(
    ["buong", "Buồng tim", "Chambers", "心腔", ["nhi-phai", "that-phai", "nhi-trai", "that-trai", "thanh-that"], true],
    ["van", "Van tim", "Valves", "瓣膜", ["van-ba-la", "van-hai-la", "van-dm-phoi", "van-dm-chu"]],
    ["mach-lon", "Mạch lớn", "Great vessels", "大血管", ["than-dm-phoi", "tm-phoi", "dm-chu"]],
    ["vanh", "Mạch vành", "Coronary vessels", "冠状血管", ["dm-vanh", "tm-vanh"], true],
  ),
});

organ({
  file: "part-liver", exportName: "partLiverScene", slug: "bo-phan-gan", system: "digestive", from: "liver",
  title: { vi: "Gan — học theo lớp", en: "The Liver — Layer by Layer", zh: "肝——分层学习" }, latin: "Hepar",
  intro: intro3(
    "Mở ra là tám phân thùy gan theo Couinaud, mỗi phân thùy một màu. Mỗi phân thùy có cuống mạch–mật riêng nên có thể cắt riêng từng phân thùy. Bật lớp Đường mật để thấy túi mật và cây đường mật. Bật lớp Mạch máu để thấy tĩnh mạch cửa, động mạch gan (hai nguồn máu vào) và tĩnh mạch gan (đường ra). Nên làm mờ các phân thùy để nhìn cây mạch bên trong.",
    "It opens on the eight Couinaud segments, each in its own colour. Each segment has its own vascular–biliary pedicle, so it can be removed on its own. Turn on Bile ducts for the gallbladder and biliary tree. Turn on Vessels for the portal vein and hepatic artery (the two inflows) and the hepatic veins (the outflow). Fade the segments to see the trees inside.",
    "打开时显示Couinaud八个肝段，每段一种颜色。每段有独立的血管–胆管蒂，可单独切除。开启“胆道”可见胆囊和胆管树；开启“血管”可见门静脉、肝动脉（两路入肝血流）及肝静脉（出肝通路）。将肝段淡化可见内部管道树。"),
  layers: LY(
    ["phan-thuy", "Phân thùy", "Segments", "肝段", ["phan-thuy-1", "phan-thuy-2", "phan-thuy-3", "phan-thuy-4", "phan-thuy-5", "phan-thuy-6", "phan-thuy-7", "phan-thuy-8"], true],
    ["mat", "Đường mật", "Bile ducts", "胆道", ["tui-mat", "duong-mat"]],
    ["mach", "Mạch máu", "Vessels", "血管", ["tm-cua", "dm-gan", "tm-gan"]],
  ),
});

organ({
  file: "part-brain", exportName: "partBrainScene", slug: "bo-phan-nao", system: "nervous", from: "brain",
  title: { vi: "Não — học theo lớp", en: "The Brain — Layer by Layer", zh: "脑——分层学习" }, latin: "Encephalon",
  intro: intro3(
    "Mở ra là vỏ đại não chia thùy (trán, đỉnh, thái dương, chẩm, đảo), cùng thân não và tiểu não. Tắt lớp Vỏ não rồi bật lớp Cấu trúc sâu để thấy thể chai, nhân nền, gian não và hệ viền. Bật lớp Não thất để thấy hệ khoang chứa dịch não tuỷ.",
    "It opens on the cerebral cortex by lobe (frontal, parietal, temporal, occipital, insula) with the brainstem and cerebellum. Turn off Cortex and turn on Deep structures to see the corpus callosum, basal nuclei, diencephalon and limbic system. Turn on Ventricles for the fluid-filled cavities.",
    "打开时显示按叶划分的大脑皮质（额、顶、颞、枕、岛叶）及脑干和小脑。关闭“皮质”并开启“深部结构”可见胼胝体、基底核、间脑和边缘系统；开启“脑室”可见脑脊液腔。"),
  layers: LY(
    ["vo", "Vỏ não", "Cortex", "皮质", ["thuy-tran", "hoi-truoc-trung-tam", "hoi-sau-trung-tam", "thuy-dinh", "thuy-thai-duong", "thuy-cham", "thuy-dao"], true],
    ["sau", "Cấu trúc sâu", "Deep structures", "深部结构", ["he-vien", "the-chai", "nhan-nen", "gian-nao", "chat-trang"]],
    ["nao-that", "Não thất", "Ventricles", "脑室", ["nao-that"]],
    ["sau-duoi", "Thân não – tiểu não", "Brainstem – cerebellum", "脑干–小脑", ["than-nao", "tieu-nao", "leu-tieu-nao"], true],
  ),
});

organ({
  file: "part-eye", exportName: "partEyeScene", slug: "bo-phan-mat", system: "visual", from: "eye",
  title: { vi: "Nhãn cầu — học theo lớp", en: "The Eyeball — Layer by Layer", zh: "眼球——分层学习" }, latin: "Bulbus oculi",
  intro: intro3(
    "Nhãn cầu có ba lớp áo. Mở ra là lớp ngoài: củng mạc trắng và giác mạc trong. Tắt lớp ngoài để thấy lớp giữa (mống mắt, thể mi, màng mạch). Tắt tiếp để thấy lớp trong (võng mạc) cùng thể thuỷ tinh và dây thị giác. Đây là mắt trái (lưới mắt phải của bộ dữ liệu bị lỗi).",
    "The eyeball has three coats. It opens on the outer coat: white sclera and clear cornea. Turn it off to see the middle coat (iris, ciliary body, choroid), then the inner coat (retina) with the lens and optic nerve. This is the left eye (the dataset's right-eye meshes are faulty).",
    "眼球壁有三层。打开时显示外层：白色巩膜和透明角膜。关闭外层可见中层（虹膜、睫状体、脉络膜），再关闭可见内层（视网膜）及晶状体和视神经。此为左眼（数据集右眼网格有误）。"),
  layers: LY(
    ["ngoai", "Lớp ngoài", "Outer coat", "外层", ["cung-mac", "giac-mac"], true],
    ["giua", "Lớp giữa", "Middle coat", "中层", ["mong-mat", "the-mi", "mang-mach"], true],
    ["trong", "Lớp trong và môi trường", "Inner coat and media", "内层与屈光介质", ["vong-mac", "thuy-tinh", "day-thi-giac"], true],
  ),
});

organ({
  file: "part-skull", exportName: "partSkullScene", slug: "bo-phan-so", system: "skeletal", from: "skull",
  title: { vi: "Sọ — học theo lớp", en: "The Skull — Layer by Layer", zh: "颅骨——分层学习" }, latin: "Cranium",
  intro: intro3(
    "Mở ra là tám xương sọ não bọc não, mỗi xương một màu, thấy rõ các đường khớp. Bật lớp Sọ mặt để thấy hàm trên, gò má, mũi, hàm dưới. Bật lớp Răng để thấy bộ răng vĩnh viễn. Tắt sọ não để nhìn xuyên vào nền sọ từ trên.",
    "It opens on the eight bones of the braincase, each in its own colour, so the sutures stand out. Turn on Facial skeleton for the maxillae, zygomatic, nasal bones and mandible. Turn on Teeth for the permanent dentition. Turn off the braincase to look down onto the cranial base.",
    "打开时显示包裹脑的八块脑颅骨，每骨一种颜色，骨缝清晰。开启“面颅”可见上颌骨、颧骨、鼻骨和下颌骨；开启“牙”可见恒牙列。关闭脑颅可从上方俯视颅底。"),
  layers: LY(
    ["so-nao", "Sọ não", "Braincase", "脑颅", ["xuong-tran", "xuong-dinh", "xuong-cham", "xuong-thai-duong", "xuong-buom", "xuong-sang"], true],
    ["so-mat", "Sọ mặt", "Facial skeleton", "面颅", ["xuong-ham-tren", "xuong-go-ma", "xuong-mui-le", "xuong-khau-cai-la-mia", "xuong-ham-duoi", "xuong-mong"]],
    ["rang", "Răng", "Teeth", "牙", ["rang"]],
  ),
});

organ({
  file: "part-larynx", exportName: "partLarynxScene", slug: "bo-phan-thanh-quan", system: "respiratory", from: "larynx",
  title: { vi: "Thanh quản — học theo lớp", en: "The Larynx — Layer by Layer", zh: "喉——分层学习" }, latin: "Larynx",
  intro: intro3(
    "Mở ra là khung sụn: sụn giáp, sụn nhẫn, nắp thanh môn, hai sụn phễu, cùng xương móng và các màng. Bật lớp Dây thanh để thấy nếp thanh âm. Bật lớp Cơ để phân biệt ba nhóm cơ mở, khép và căng dây thanh.",
    "It opens on the cartilage frame: thyroid, cricoid, epiglottis, the two arytenoids, with the hyoid and membranes. Turn on Vocal folds for the vocal cords. Turn on Muscles to tell apart the three groups that open, close and tense the cords.",
    "打开时显示软骨支架：甲状软骨、环状软骨、会厌、两块杓状软骨，以及舌骨和各膜。开启“声带”可见声襞；开启“肌”可区分开大、关闭和紧张声带的三组肌。"),
  layers: LY(
    ["sun", "Sụn và màng", "Cartilages and membranes", "软骨与膜", ["sun-giap", "sun-nhan", "nap-thanh-mon", "sun-pheu", "xuong-mong-mang"], true],
    ["day", "Dây thanh", "Vocal folds", "声带", ["day-thanh"]],
    ["co", "Cơ", "Muscles", "肌", ["co-mo", "co-khep", "co-cang"]],
  ),
});

organ({
  file: "part-stomach", exportName: "partStomachScene", slug: "bo-phan-da-day", system: "digestive", from: "stomach",
  title: { vi: "Dạ dày — học theo lớp", en: "The Stomach — Layer by Layer", zh: "胃——分层学习" }, latin: "Gaster",
  intro: intro3(
    "Mở ra là thực quản bụng, dạ dày và tá tràng. Bật lớp Mạch máu để thấy hai cung động mạch dọc bờ cong nhỏ và bờ cong lớn, cùng tĩnh mạch vị đổ về hệ cửa. Làm mờ dạ dày để thấy cung mạch ôm sát thành.",
    "It opens on the abdominal oesophagus, stomach and duodenum. Turn on Vessels for the two arterial arcades along the lesser and greater curvatures and the gastric veins draining to the portal system. Fade the stomach to see the arcades hugging its wall.",
    "打开时显示腹段食管、胃和十二指肠。开启“血管”可见沿胃小弯和胃大弯的两条动脉弓及汇入门静脉系统的胃静脉。将胃淡化可见紧贴胃壁的血管弓。"),
  layers: LY(
    ["tang", "Dạ dày – tá tràng", "Stomach – duodenum", "胃–十二指肠", ["thuc-quan", "da-day", "ta-trang"], true],
    ["mach", "Mạch máu", "Vessels", "血管", ["bo-cong-nho", "bo-cong-lon", "tm-vi"]],
  ),
});

// ═══════════════════ ĐỢT 2 BÀI BỘ PHẬN (14 bài) ═══════════════════
const XUONG = ["xuong", "Xương", "Bones", "骨"];
const MACH = ["mach", "Mạch máu", "Vessels", "血管"];

organ({
  file: "part-arm", exportName: "partArmScene", slug: "bo-phan-canh-tay", system: "muscular", from: "arm-muscles",
  title: { vi: "Cánh tay — học theo lớp", en: "The Arm — Layer by Layer", zh: "上臂——分层学习" }, latin: "Brachium",
  intro: intro3(
    "Mở ra là cả hai khu cơ quanh xương cánh tay. Khu trước là các cơ gấp (nhị đầu, cơ cánh tay, quạ–cánh tay, cánh tay–quay), khu sau là cơ duỗi tam đầu và cơ khuỷu. Tắt một khu để nhìn rõ khu kia, sẽ nhớ nguyên tắc: khu trước gấp, khu sau duỗi.",
    "It opens with both muscle compartments around the humerus: the anterior flexors (biceps, brachialis, coracobrachialis, brachioradialis) and the posterior extensors (triceps and anconeus). Turn one compartment off to see the other clearly, and the rule sticks: front flexes, back extends.",
    "打开时显示肱骨周围的两个肌群：前群屈肌（肱二头肌、肱肌、喙肱肌、肱桡肌）和后群伸肌（肱三头肌、肘肌）。关闭其中一群即可看清另一群，从而记住规律：前群屈、后群伸。"),
  layers: LY([...XUONG, ["xuong"], true],
    // Bài vùng CƠ: lớp cơ bật sẵn — chỉ bật xương thì mở ra một que xương trắng, chẳng có gì để học.
    ["truoc", "Khu trước (gấp)", "Anterior (flexors)", "前群（屈肌）", ["nhi-dau", "canh-tay", "qua-canh-tay", "canh-tay-quay"], true],
    ["sau", "Khu sau (duỗi)", "Posterior (extensors)", "后群（伸肌）", ["tam-dau", "khuyu"], true]),
});

organ({
  file: "part-forearm", exportName: "partForearmScene", slug: "bo-phan-cang-tay", system: "muscular", from: "forearm",
  title: { vi: "Cẳng tay — học theo lớp", en: "The Forearm — Layer by Layer", zh: "前臂——分层学习" }, latin: "Antebrachium",
  intro: intro3(
    "Mở ra là xương quay, xương trụ cùng hai nhóm cơ chính: cơ gấp ở mặt trước và cơ duỗi ở mặt sau. Cẳng tay có hơn 20 cơ, nên hãy tắt bớt rồi bật từng lớp: Cơ gấp (lớp nông rồi lớp sâu), Cơ duỗi, Cơ sấp–ngửa, rồi Cơ bàn tay. Bật lớp Mạch máu sau cùng để thấy động mạch quay, trụ đi giữa các lớp cơ.",
    "It opens on the radius and ulna with the two main groups: flexors in front and extensors behind. The forearm has over 20 muscles, so switch layers off and on one at a time: Flexors (superficial, then deep), Extensors, Pronators–supinators, then Hand muscles. Turn on Vessels last to see the radial and ulnar arteries running between the layers.",
    "打开时显示桡骨、尺骨及前面的屈肌群和后面的伸肌群。前臂有20多块肌，请逐层关闭和开启：屈肌（浅层再深层）、伸肌、旋前旋后肌，最后手肌。最后开启“血管”可见桡、尺动脉行于肌层之间。"),
  layers: LY([...XUONG, ["xuong"], true],
    ["gap", "Cơ gấp", "Flexors", "屈肌", ["gap-nong", "gap-sau"], true],
    ["duoi", "Cơ duỗi", "Extensors", "伸肌", ["duoi"], true],
    ["sap-ngua", "Cơ sấp–ngửa", "Pronators–supinators", "旋前旋后肌", ["ngua-sap"]],
    ["ban-tay", "Cơ bàn tay", "Hand muscles", "手肌", ["o-mo-cai", "o-mo-ut", "giun-gian-cot"]],
    [...MACH, ["dm", "tm"]]),
});

organ({
  file: "part-thigh", exportName: "partThighScene", slug: "bo-phan-dui", system: "muscular", from: "thigh-muscles",
  title: { vi: "Đùi và mông — học theo lớp", en: "Thigh and Buttock — Layer by Layer", zh: "大腿与臀——分层学习" }, latin: "Femur · Regio glutealis",
  intro: intro3(
    "Mở ra là ba khoang cơ đùi quanh xương đùi; tắt bật từng khoang để học. Khoang trước là tứ đầu và cơ may, duỗi gối, do dây đùi chi phối. Khoang trong là nhóm khép, do dây bịt chi phối. Khoang sau là nhóm ụ ngồi–cẳng chân, gấp gối, do dây ngồi chi phối. Lớp Mông gồm ba cơ mông và nhóm xoay ngoài.",
    "It opens on the three muscle compartments around the femur; switch them off and on one at a time. The anterior compartment is quadriceps and sartorius: they extend the knee, supplied by the femoral nerve. The medial compartment is the adductors, supplied by the obturator nerve. The posterior compartment is the hamstrings: they flex the knee, supplied by the sciatic nerve. The Gluteal layer holds the three gluteals and the lateral rotators.",
    "打开时显示股骨周围的三个肌群，请逐一关闭和开启：前群为股四头肌和缝匠肌，伸膝，受股神经支配；内侧群为内收肌群，受闭孔神经支配；后群为腘绳肌，屈膝，受坐骨神经支配。“臀部”层含三块臀肌和外旋肌群。"),
  layers: LY([...XUONG, ["xuong"], true],
    ["mong", "Vùng mông", "Gluteal region", "臀部", ["mong-lon", "mong-nho-be", "xoay-ngoai"]],
    ["truoc", "Khoang trước", "Anterior compartment", "前群", ["tu-dau", "may-that-lung-chau"], true],
    ["trong", "Khoang trong", "Medial compartment", "内侧群", ["khep"], true],
    ["sau", "Khoang sau", "Posterior compartment", "后群", ["u-ngoi-cang"], true]),
});

organ({
  file: "part-leg", exportName: "partLegScene", slug: "bo-phan-cang-chan", system: "muscular", from: "leg",
  title: { vi: "Cẳng chân — học theo lớp", en: "The Leg — Layer by Layer", zh: "小腿——分层学习" }, latin: "Crus",
  intro: intro3(
    "Mở ra là các khoang cơ quanh xương chày và xương mác. Cẳng chân chia bốn khoang cân kín; tắt bật từng khoang để học. Khoang trước gấp mu, khoang ngoài lật ngoài, khoang sau nông là tam đầu cẳng chân, khoang sau sâu gồm các cơ đi qua ống cổ chân. Lớp Bàn chân gồm cơ gan chân và mu chân. Bật lớp Mạch máu sau cùng.",
    "It opens on the muscle compartments around the tibia and fibula. The leg has four closed fascial compartments; switch them off and on one at a time. The anterior compartment dorsiflexes, the lateral everts, the superficial posterior is the triceps surae, and the deep posterior holds the muscles that pass through the tarsal tunnel. The Foot layer holds the sole and dorsal muscles. Turn on Vessels last.",
    "打开时显示胫腓骨周围的各肌群。小腿有四个封闭骨筋膜鞘，请逐一关闭和开启：前群背屈，外侧群外翻，后群浅层为小腿三头肌，后群深层为经踝管的肌肉。“足部”层含足底和足背肌。最后开启“血管”。"),
  layers: LY([...XUONG, ["xuong"], true],
    ["truoc", "Khoang trước", "Anterior", "前群", ["khoang-truoc"], true],
    ["ngoai", "Khoang ngoài", "Lateral", "外侧群", ["khoang-ngoai"], true],
    ["sau", "Khoang sau (nông, sâu)", "Posterior (superficial, deep)", "后群（浅、深）", ["sau-nong", "sau-sau"], true],
    ["ban-chan", "Bàn chân", "Foot", "足部", ["gan-chan", "mu-chan"]],
    [...MACH, ["dm", "tm"]]),
});

organ({
  file: "part-cervical", exportName: "partCervicalScene", slug: "bo-phan-cot-song-co", system: "skeletal", from: "cervical-spine",
  title: { vi: "Cột sống cổ — học theo lớp", en: "The Cervical Spine — Layer by Layer", zh: "颈椎——分层学习" }, latin: "Vertebrae cervicales",
  intro: intro3(
    "Mở ra là bảy đốt sống cổ: đốt đội (C1) không có thân, đốt trục (C2) có mỏm răng, C3–C6 điển hình, C7 có gai dài nhất. Bật lớp Đĩa đệm để thấy các đĩa từ C2 trở xuống; giữa C1 và C2 không có đĩa. Bật lớp Mạch máu để thấy động mạch đốt sống chui qua lỗ mỏm ngang.",
    "It opens on the seven cervical vertebrae: the atlas (C1) with no body, the axis (C2) with its dens, typical C3–C6, and C7 with the longest spine. Turn on Discs for the discs from C2 down; there is none between C1 and C2. Turn on Vessels for the vertebral artery threading the transverse foramina.",
    "打开时显示七块颈椎：无椎体的寰椎（C1）、有齿突的枢椎（C2）、典型的C3–C6以及棘突最长的C7。开启“椎间盘”可见C2以下的椎间盘（C1与C2之间无椎间盘）；开启“血管”可见椎动脉穿行横突孔。"),
  layers: LY([...XUONG, ["c1", "c2", "c3-c6", "c7"], true],
    ["dia", "Đĩa đệm", "Discs", "椎间盘", ["dia-dem"]],
    [...MACH, ["dm-dot-song"]]),
});

organ({
  file: "part-lumbar", exportName: "partLumbarScene", slug: "bo-phan-cot-song-that-lung", system: "skeletal", from: "lumbar-spine",
  title: { vi: "Cột sống thắt lưng — học theo lớp", en: "The Lumbar Spine — Layer by Layer", zh: "腰椎——分层学习" }, latin: "Vertebrae lumbales",
  intro: intro3(
    "Mở ra là năm đốt thắt lưng và xương cùng. Đây là các đốt to nhất vì chịu sức nặng lớn nhất. Bật lớp Đĩa đệm để thấy đĩa L4–L5 và L5–S1, hai đĩa thoát vị nhiều nhất. Bật lớp Cơ để thấy cơ dựng sống và cơ thắt lưng hai bên cột sống.",
    "It opens on the five lumbar vertebrae and the sacrum, the largest vertebrae because they carry the most weight. Turn on Discs for L4–L5 and L5–S1, the two most often herniated. Turn on Muscles for erector spinae and psoas beside the spine.",
    "打开时显示五块腰椎和骶骨，因承重最大而最粗大。开启“椎间盘”可见最常突出的L4–L5和L5–S1椎间盘；开启“肌”可见脊柱两侧的竖脊肌和腰大肌。"),
  layers: LY([...XUONG, ["l1-l3", "l4-l5", "xuong-cung"], true],
    ["dia", "Đĩa đệm", "Discs", "椎间盘", ["dia-dem"]],
    ["co", "Cơ", "Muscles", "肌", ["co-canh-song"]]),
});

organ({
  file: "part-thorax", exportName: "partThoraxScene", slug: "bo-phan-long-nguc", system: "skeletal", from: "thorax",
  title: { vi: "Lồng ngực — học theo lớp", en: "The Rib Cage — Layer by Layer", zh: "胸廓——分层学习" }, latin: "Compages thoracis",
  intro: intro3(
    "Mở ra là xương ức và bảy đôi sườn thật, loại sườn nối thẳng vào xương ức. Bật lớp Sườn giả–cụt để thấy sườn VIII–XII. Bật lớp Sụn sườn để thấy khung sụn đàn hồi. Bật lớp Cột sống ngực để thấy mười hai đốt ngực khớp với các sườn phía sau.",
    "It opens on the sternum and the seven pairs of true ribs, which join the sternum directly. Turn on False and floating ribs for ribs 8–12. Turn on Costal cartilages for the springy cartilage frame. Turn on Thoracic spine for the twelve vertebrae the ribs meet behind.",
    "打开时显示胸骨和直接连于胸骨的七对真肋。开启“假肋与浮肋”可见第8–12肋；开启“肋软骨”可见富有弹性的软骨框架；开启“胸椎”可见后方与肋相关节的十二块胸椎。"),
  layers: LY(["that", "Xương ức, sườn thật", "Sternum and true ribs", "胸骨与真肋", ["xuong-uc", "suon-that"], true],
    ["gia", "Sườn giả–cụt", "False and floating ribs", "假肋与浮肋", ["suon-gia", "suon-cut"]],
    ["sun", "Sụn sườn", "Costal cartilages", "肋软骨", ["sun-suon"]],
    ["song", "Cột sống ngực", "Thoracic spine", "胸椎", ["dot-song-nguc"]]),
});

organ({
  file: "part-pelvis", exportName: "partPelvisScene", slug: "bo-phan-chau-hong", system: "muscular", from: "pelvic-floor",
  title: { vi: "Chậu hông và đáy chậu — học theo lớp", en: "Pelvis and Pelvic Floor — Layer by Layer", zh: "骨盆与盆底——分层学习" }, latin: "Pelvis · Diaphragma pelvis",
  intro: intro3(
    "Mở ra là khung chậu xương. Bật lớp Cơ nâng hậu môn để thấy ba bó mu–cụt, mu–trực tràng và chậu–cụt tạo nên phễu đáy chậu. Bật lớp Cơ khác để thấy cơ ụ ngồi–cụt, cơ thắt hậu môn ngoài và cơ bịt trong. Bật lớp Tạng để thấy các cơ quan tựa trên đáy chậu.",
    "It opens on the bony pelvis. Turn on Levator ani for its three parts — pubococcygeus, puborectalis and iliococcygeus — which form the funnel of the pelvic floor. Turn on Other muscles for coccygeus, external anal sphincter and obturator internus. Turn on Organs for the viscera resting on the floor.",
    "打开时显示骨盆。开启“肛提肌”可见耻尾肌、耻骨直肠肌和髂尾肌三部构成盆底漏斗；开启“其他肌”可见尾骨肌、肛门外括约肌和闭孔内肌；开启“脏器”可见坐落于盆底的器官。"),
  layers: LY([...XUONG, ["xuong"], true],
    ["nang", "Cơ nâng hậu môn", "Levator ani", "肛提肌", ["mu-cut", "mu-truc-trang", "chau-cut"], true],
    ["khac", "Cơ khác", "Other muscles", "其他肌", ["u-ngoi-cut", "that-hau-mon", "bit-trong"]],
    ["tang", "Tạng", "Organs", "脏器", ["tang"]]),
});

organ({
  file: "part-diaphragm", exportName: "partDiaphragmScene", slug: "bo-phan-co-hoanh", system: "muscular", from: "diaphragm",
  title: { vi: "Cơ hoành và cơ hô hấp — học theo lớp", en: "Diaphragm and Breathing Muscles — Layer by Layer", zh: "膈与呼吸肌——分层学习" }, latin: "Diaphragma",
  intro: intro3(
    "Mở ra là cơ hoành, vòm cơ ngăn ngực với bụng. Bật lớp Cơ hô hấp khác để thấy cơ gian sườn, các cơ hô hấp phụ và cơ thắt lưng. Bật lớp Cấu trúc xuyên hoành để thấy động mạch chủ, tĩnh mạch chủ dưới và tĩnh mạch thực quản chui qua ba lỗ ở các mức T8, T10 và T12.",
    "It opens on the diaphragm, the muscular dome between chest and abdomen. Turn on Other breathing muscles for the intercostals, accessory muscles and psoas. Turn on Structures through the diaphragm for the aorta, inferior vena cava and oesophageal veins passing through the three openings at T8, T10 and T12.",
    "打开时显示膈——分隔胸腹的肌性穹窿。开启“其他呼吸肌”可见肋间肌、辅助呼吸肌和腰大肌；开启“穿膈结构”可见经T8、T10、T12三个裂孔穿过的主动脉、下腔静脉和食管静脉。"),
  layers: LY(["hoanh", "Cơ hoành", "Diaphragm", "膈", ["co-hoanh"], true],
    ["khac", "Cơ hô hấp khác", "Other breathing muscles", "其他呼吸肌", ["lien-suon-ngoai", "lien-suon-trong", "co-phu", "that-lung"]],
    ["xuyen", "Cấu trúc xuyên hoành", "Structures through it", "穿膈结构", ["mach-qua-hoanh", "tm-thuc-quan"]],
    [...XUONG, ["xuong"]]),
});

organ({
  file: "part-lung", exportName: "partLungScene", slug: "bo-phan-phoi", system: "respiratory", from: "lung-root",
  title: { vi: "Phổi — học theo lớp", en: "The Lungs — Layer by Layer", zh: "肺——分层学习" }, latin: "Pulmones",
  intro: intro3(
    "Mở ra là cây phế quản hai bên: phải ba thuỳ, trái hai thuỳ. Bật lớp Động mạch phổi (xanh, máu nghèo oxy) để thấy mỗi nhánh đi sát phế quản cùng tên. Bật lớp Tĩnh mạch phổi (đỏ, máu giàu oxy) để thấy chúng chạy giữa các phân thùy. Bật lớp Động mạch phế quản để thấy hệ nuôi thành phế quản. Bộ dữ liệu không có nhu mô phổi.",
    "It opens on both bronchial trees: three lobes right, two left. Turn on Pulmonary arteries (blue, deoxygenated) to see each branch hugging the bronchus of the same name. Turn on Pulmonary veins (red, oxygenated) to see them running between segments. Turn on Bronchial arteries for the supply of the airway walls. The dataset has no lung tissue.",
    "打开时显示两侧支气管树：右肺三叶、左肺两叶。开启“肺动脉”（蓝色，缺氧血）可见各支紧贴同名支气管；开启“肺静脉”（红色，含氧血）可见其行于肺段之间；开启“支气管动脉”可见营养气道壁的血管。数据集中无肺实质。"),
  layers: LY(["phe-quan", "Cây phế quản", "Bronchial tree", "支气管树", ["phe-quan-p", "phe-quan-t"], true],
    ["dm", "Động mạch phổi", "Pulmonary arteries", "肺动脉", ["dm-phoi"]],
    ["tm", "Tĩnh mạch phổi", "Pulmonary veins", "肺静脉", ["tm-phoi"]],
    ["pq", "Động mạch phế quản", "Bronchial arteries", "支气管动脉", ["phe-quan-dm"]]),
  faded: ["tim"],
});

organ({
  file: "part-kidney", exportName: "partKidneyScene", slug: "bo-phan-than", system: "urinary", from: "kidney",
  title: { vi: "Thận — học theo lớp", en: "The Kidney — Layer by Layer", zh: "肾——分层学习" }, latin: "Ren",
  intro: intro3(
    "Mở ra là thận phải. Bật lớp Mạch máu để thấy động mạch thận chia nhánh trước và sau bể thận. Giữa hai nhánh có một mặt phẳng ít mạch (đường Brödel), là đường rạch khi mổ lấy sỏi. Bật lớp Niệu quản để thấy đường dẫn nước tiểu, và lớp Thượng thận để thấy tuyến úp trên cực trên thận.",
    "It opens on the right kidney. Turn on Vessels to see the renal artery dividing into branches in front of and behind the pelvis. Between them lies a relatively bloodless plane (Brödel's line) used for stone surgery. Turn on Ureter for the urinary outflow, and Adrenal for the gland capping the upper pole.",
    "打开时显示右肾。开启“血管”可见肾动脉分为肾盂前、后支，两支之间为少血管平面（Brödel线），是取石手术的切口；开启“输尿管”可见尿液排出通路；开启“肾上腺”可见覆于肾上极的腺体。"),
  layers: LY(["than", "Thận", "Kidney", "肾", ["than-phai"], true],
    [...MACH, ["dm-than-nhanh-truoc", "dm-than-nhanh-sau", "tm-than-phai"]],
    ["nieu", "Niệu quản", "Ureter", "输尿管", ["nieu-quan-phai"]],
    ["thuong", "Thượng thận", "Adrenal", "肾上腺", ["thuong-than-phai"]]),
});

organ({
  file: "part-pancreas", exportName: "partPancreasScene", slug: "bo-phan-tuy-lach", system: "digestive", from: "pancreas-spleen",
  title: { vi: "Tuỵ và lách — học theo lớp", en: "Pancreas and Spleen — Layer by Layer", zh: "胰与脾——分层学习" }, latin: "Pancreas · Lien",
  intro: intro3(
    "Mở ra là tuỵ, lách và tá tràng ôm đầu tuỵ. Bật lớp Ống tuỵ để thấy ống tuỵ chạy suốt dọc tuyến, đổ vào tá tràng. Bật lớp Mạch máu để thấy động mạch lách chạy ngoằn ngoèo dọc bờ trên tuỵ, vòng mạch tá–tuỵ và tĩnh mạch lách đổ về tĩnh mạch cửa.",
    "It opens on the pancreas, spleen and the duodenum around the pancreatic head. Turn on Pancreatic duct for the duct running the length of the gland into the duodenum. Turn on Vessels for the tortuous splenic artery along the upper border, the pancreaticoduodenal arcades and the splenic vein draining to the portal vein.",
    "打开时显示胰、脾及环绕胰头的十二指肠。开启“胰管”可见贯穿胰腺全长、开口于十二指肠的胰管；开启“血管”可见沿胰上缘迂曲走行的脾动脉、胰十二指肠动脉弓及汇入门静脉的脾静脉。"),
  layers: LY(["tang", "Tuỵ, lách, tá tràng", "Pancreas, spleen, duodenum", "胰、脾、十二指肠", ["tuy", "lach", "ta-trang"], true],
    ["ong", "Ống tuỵ", "Pancreatic duct", "胰管", ["ong-tuy"]],
    [...MACH, ["dm-lach-than-tang", "dm-ta-tuy", "tm-lach"]]),
});

organ({
  file: "part-orbit", exportName: "partOrbitScene", slug: "bo-phan-hoc-mat", system: "visual", from: "orbit",
  title: { vi: "Hốc mắt — học theo lớp", en: "The Orbit — Layer by Layer", zh: "眼眶——分层学习" }, latin: "Orbita",
  intro: intro3(
    "Mở ra là nhãn cầu cùng các cơ vận nhãn: bốn cơ thẳng mọc từ vòng gân chung, hai cơ chéo và cơ nâng mi. Bật lớp Thần kinh để thấy dây thị giác, dây III, IV và các nhánh V1. Bật lớp Bộ lệ để thấy đường nước mắt. Đây là hốc mắt trái.",
    "It opens on the eyeball with its muscles: the four recti arising from the common tendinous ring, the two obliques and levator palpebrae. Turn on Nerves for the optic nerve, nerves III and IV and the V1 branches. Turn on Lacrimal apparatus for the tear pathway. This is the left orbit.",
    "打开时显示眼球及眼外肌：起于总腱环的四条直肌、两条斜肌及上睑提肌；开启“神经”可见视神经、动眼神经、滑车神经和V1分支；开启“泪器”可见泪液通路。此为左眼眶。"),
  layers: LY(["nhan-cau", "Nhãn cầu", "Eyeball", "眼球", ["nhan-cau"], true],
    ["co", "Cơ vận nhãn", "Eye muscles", "眼外肌", ["thang-trong", "thang-ngoai", "thang-tren-duoi", "cheo-tren", "cheo-duoi", "nang-mi", "vong-gan"], true],
    ["tk", "Thần kinh", "Nerves", "神经", ["than-kinh"]],
    ["le", "Bộ lệ", "Lacrimal apparatus", "泪器", ["bo-le"]]),
});

organ({
  file: "part-bladder", exportName: "partBladderScene", slug: "bo-phan-bang-quang", system: "urinary", from: "bladder-prostate",
  title: { vi: "Bàng quang và tuyến tiền liệt — học theo lớp", en: "Bladder and Prostate — Layer by Layer", zh: "膀胱与前列腺——分层学习" }, latin: "Vesica urinaria · Prostata",
  intro: intro3(
    "Mở ra là bàng quang cùng niệu quản đổ vào và niệu đạo đi ra. Bật lớp Sinh dục để thấy tuyến tiền liệt ôm niệu đạo ngay dưới cổ bàng quang, túi tinh và ống dẫn tinh phía sau. Vì vị trí này, phì đại tuyến tiền liệt gây tiểu khó. Khung chậu và đáy chậu mờ sẵn làm mốc.",
    "It opens on the bladder with the ureters coming in and the urethra going out. Turn on Reproductive for the prostate wrapped round the urethra just below the bladder neck, with the seminal vesicles and ductus deferens behind. That position is why an enlarged prostate makes urination difficult. The bony pelvis and pelvic floor are faded as landmarks.",
    "打开时显示膀胱及注入的输尿管和排出的尿道。开启“生殖”可见紧贴膀胱颈下方环绕尿道的前列腺，以及后方的精囊和输精管——前列腺增生因此导致排尿困难。骨盆和盆底淡化作为标志。"),
  layers: LY(["tiet-nieu", "Đường tiết niệu", "Urinary tract", "泌尿道", ["bang-quang", "nieu-quan", "nieu-dao"], true],
    ["sinh-duc", "Sinh dục", "Reproductive", "生殖", ["tien-liet", "tui-tinh", "ong-dan-tinh"], true]),
  faded: ["day-chau", "moc"],
});
