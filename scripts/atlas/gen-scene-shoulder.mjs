/**
 * Sinh scene "Vai và hố nách" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-shoulder.mjs
 *
 * Bên TRÁI. Khảo sát: đủ cơ đai vai và chóp xoay, cơ ngực, răng trước, động
 * mạch/tĩnh mạch nách. THIẾU: đám rối cánh tay và mọi dây thần kinh ngoại
 * biên (atlas chỉ có thần kinh hốc mắt), cơ lưng rộng. Nêu rõ trong intro.
 * Atlas xếp cơ dưới vai vào `skeletal` — lọc cả hai hệ.
 */
import { byRe, emit, leftSide, DEOXY, OXY } from "./lib.mjs";

const M = (re) => leftSide(byRe(re, ["muscular", "skeletal"]));

emit({
  file: "shoulder",
  exportName: "shoulderScene",
  header: 'Scene "Vai và hố nách" (bên trái) dựng từ bộ atlas BodyParts3D.\n\nAtlas không có đám rối cánh tay, thần kinh ngoại biên và cơ lưng rộng.',
  scene: {
    slug: "vai-ho-nach",
    title: { vi: "Vai và hố nách", en: "Shoulder and Axilla", zh: "肩部与腋窝" },
    latin: "Regio deltoidea · Fossa axillaris",
    intro: {
      vi: "Khớp vai linh hoạt nhất cơ thể nhờ ổ chảo nông, nên độ vững dựa hẳn vào cơ: bốn cơ chóp xoay (trên gai, dưới gai, tròn bé, dưới vai) ghì chỏm xương cánh tay vào ổ chảo, cơ delta nâng tay. Hố nách là khoang hình tháp giữa cơ ngực (trước), cơ dưới vai (sau), cơ răng trước (trong) — đường đi của bó mạch thần kinh xuống tay. Bộ dữ liệu không có đám rối cánh tay và cơ lưng rộng; ở đây chỉ thấy động mạch và tĩnh mạch nách.",
      en: "The shoulder is the most mobile joint in the body thanks to its shallow glenoid, so its stability rests on muscle: the four rotator cuff muscles (supraspinatus, infraspinatus, teres minor, subscapularis) hold the humeral head in the socket while deltoid raises the arm. The axilla is a pyramidal space between the pectorals (front), subscapularis (back) and serratus anterior (medial) — the passage for the neurovascular bundle to the arm. The dataset lacks the brachial plexus and latissimus dorsi; only the axillary artery and vein are shown.",
      zh: "肩关节因关节盂浅而成为全身最灵活的关节，其稳定性完全依赖肌肉：四块肩袖肌（冈上肌、冈下肌、小圆肌、肩胛下肌）将肱骨头固定于关节盂内，三角肌则负责抬臂。腋窝是位于胸肌（前）、肩胛下肌（后）、前锯肌（内）之间的锥形间隙——血管神经束通往上肢的通道。数据集中缺臂丛和背阔肌；此处仅显示腋动脉和腋静脉。",
    },
  },
  faded: ["xuong"],
  groups: [
    {
      key: "delta",
      // Không dùng đỏ động mạch — cơ delta nằm ngay cạnh ĐM nách.
      tint: "#b58bc4",
      latin: "M. deltoideus",
      name: { vi: "Cơ delta", en: "Deltoid", zh: "三角肌" },
      note: {
        vi: "Ba phần: đòn (trước), cùng vai (giữa), gai (sau). Phần giữa dạng tay từ 15° tới 90° (cơ trên gai khởi động 15° đầu). Thần kinh nách vòng quanh cổ phẫu thuật xương cánh tay chi phối cơ này — trật khớp vai hay gãy cổ phẫu thuật có thể làm liệt delta, mất cảm giác vùng \"miếng vá\" ngoài vai.",
        en: "Three parts: clavicular (front), acromial (middle), spinal (back). The middle part abducts the arm from 15° to 90° (supraspinatus starts the first 15°). The axillary nerve curving around the surgical neck of the humerus supplies it — a shoulder dislocation or surgical-neck fracture can paralyse deltoid and numb the \"regimental badge\" patch.",
        zh: "分三部：锁骨部（前）、肩峰部（中）、肩胛冈部（后）。中部使上臂外展15°至90°（前15°由冈上肌启动）。绕肱骨外科颈的腋神经支配此肌——肩关节脱位或外科颈骨折可致三角肌麻痹及肩外侧“臂章区”感觉丧失。",
      },
      ids: M(/part of (left )?deltoid$/i),
    },
    {
      key: "chop-xoay",
      tint: "#e8883d",
      latin: "Mm. supraspinatus, infraspinatus, teres minor, subscapularis",
      name: { vi: "Bốn cơ chóp xoay", en: "Rotator cuff", zh: "肩袖" },
      note: {
        vi: "Trên gai (dạng 15° đầu), dưới gai và tròn bé (xoay ngoài), dưới vai (xoay trong). Gân trên gai chạy dưới mỏm cùng vai nên hay bị kẹt, rách khi giơ tay lâu — \"cung đau\" 60–120°. Mẹo nhớ SITS.",
        en: "Supraspinatus (first 15° of abduction), infraspinatus and teres minor (lateral rotation), subscapularis (medial rotation). The supraspinatus tendon runs under the acromion and is pinched or torn with repeated overhead use — the \"painful arc\" of 60–120°. Mnemonic: SITS.",
        zh: "冈上肌（外展前15°）、冈下肌和小圆肌（外旋）、肩胛下肌（内旋）。冈上肌腱行于肩峰下方，反复举臂易受撞击或撕裂——出现60–120°的“疼痛弧”。记忆法：SITS。",
      },
      ids: M(/supraspinatus|infraspinatus|teres minor$|subscapularis$/i),
    },
    {
      key: "tron-lon",
      tint: "#d98a2b",
      latin: "M. teres major",
      name: { vi: "Cơ tròn lớn", en: "Teres major", zh: "大圆肌" },
      note: {
        vi: "Không thuộc chóp xoay. Bờ dưới của nó là mốc đổi tên động mạch nách thành động mạch cánh tay; khép và xoay trong cánh tay.",
        en: "Not part of the rotator cuff. Its lower border is where the axillary artery becomes the brachial artery; it adducts and medially rotates the arm.",
        zh: "不属于肩袖。其下缘是腋动脉移行为肱动脉的标志；使上臂内收、内旋。",
      },
      ids: M(/teres major$/i),
    },
    {
      key: "nguc",
      tint: "#b8434f",
      latin: "Mm. pectoralis major et minor · M. subclavius",
      name: { vi: "Cơ ngực lớn, ngực bé và dưới đòn", en: "Pectoralis major, minor and subclavius", zh: "胸大肌、胸小肌与锁骨下肌" },
      note: {
        vi: "Thành trước hố nách. Cơ ngực bé chia động mạch nách thành ba đoạn (trên, sau, dưới cơ) — mốc để nhớ nhánh của từng đoạn. Cơ ngực lớn khép và xoay trong cánh tay.",
        en: "The front wall of the axilla. Pectoralis minor divides the axillary artery into three parts (above, behind, below it) — the key to remembering each part's branches. Pectoralis major adducts and medially rotates the arm.",
        zh: "腋窝前壁。胸小肌将腋动脉分为三段（肌上、肌后、肌下）——记忆各段分支的关键。胸大肌使上臂内收、内旋。",
      },
      ids: M(/pectoralis (major|minor)$|part of (left )?pectoralis major$|subclavius$/i),
    },
    {
      key: "rang-truoc",
      tint: "#7fa878",
      latin: "M. serratus anterior",
      name: { vi: "Cơ răng trước", en: "Serratus anterior", zh: "前锯肌" },
      note: {
        vi: "Thành trong hố nách, ghì xương vai vào thành ngực và xoay xương vai khi giơ tay quá đầu. Tổn thương thần kinh ngực dài (khi nạo hạch nách) gây xương vai \"cánh gà\" khi đẩy tay vào tường.",
        en: "The medial wall of the axilla, holding the scapula against the chest wall and rotating it for overhead reaching. Injury to the long thoracic nerve (during axillary node clearance) gives a \"winged\" scapula when pushing against a wall.",
        zh: "腋窝内侧壁，将肩胛骨固定于胸壁并在举臂过头时旋转肩胛骨。胸长神经损伤（腋窝淋巴结清扫时）导致推墙时出现“翼状肩胛”。",
      },
      ids: M(/serratus anterior$/i),
    },
    {
      key: "thang-nang-vai",
      tint: "#6f93b8",
      latin: "Mm. trapezius, levator scapulae, rhomboidei",
      name: { vi: "Cơ thang, nâng vai và trám", en: "Trapezius, levator scapulae and rhomboids", zh: "斜方肌、肩胛提肌与菱形肌" },
      note: {
        vi: "Nhóm cơ lưng nông treo và điều khiển xương vai. Cơ thang (thần kinh XI) nhún vai — liệt khi tổn thương dây XI ở tam giác cổ sau, vai xệ xuống.",
        en: "The superficial back muscles that suspend and steer the scapula. Trapezius (nerve XI) shrugs the shoulder — it is paralysed when XI is injured in the posterior triangle of the neck, and the shoulder droops.",
        zh: "悬吊并操控肩胛骨的背浅层肌。斜方肌（副神经）耸肩——颈后三角内副神经损伤时麻痹，肩部下垂。",
      },
      ids: M(/part of (left )?trapezius$|levator scapulae$|rhomboid (major|minor)$/i),
    },
    {
      key: "mach-nach",
      tint: OXY,
      latin: "A. axillaris",
      name: { vi: "Động mạch nách và nhánh", en: "Axillary artery and branches", zh: "腋动脉及分支" },
      note: {
        vi: "Chạy giữa hố nách, đi cùng các bó đám rối cánh tay (không có trong dữ liệu). Các nhánh: ngực trên, cùng vai-ngực, ngực ngoài, dưới vai, hai mũ cánh tay.",
        en: "Runs through the middle of the axilla alongside the cords of the brachial plexus (absent in this data). Branches: superior thoracic, thoraco-acromial, lateral thoracic, subscapular and the two circumflex humerals.",
        zh: "行于腋窝中央，与臂丛各束伴行（数据中缺失）。分支：胸上动脉、胸肩峰动脉、胸外侧动脉、肩胛下动脉及两条旋肱动脉。",
      },
      ids: leftSide(byRe(/axillary artery$|thoraco-acromial artery|lateral thoracic artery$|subscapular artery$|thoracodorsal artery$|circumflex scapular artery$|circumflex humeral artery$/i, ["arterial"])),
    },
    {
      key: "tm-nach",
      tint: DEOXY,
      latin: "V. axillaris",
      name: { vi: "Tĩnh mạch nách và nhánh", en: "Axillary vein and tributaries", zh: "腋静脉及属支" },
      note: {
        vi: "Nằm phía trong động mạch, nhận tĩnh mạch nền và tĩnh mạch đầu. Nạo hạch nách trong ung thư vú tiến hành dọc bờ dưới tĩnh mạch này.",
        en: "Lies medial to the artery and receives the basilic and cephalic veins. Axillary node clearance for breast cancer is carried out along its lower border.",
        zh: "位于动脉内侧，接受贵要静脉和头静脉。乳腺癌腋窝淋巴结清扫沿此静脉下缘进行。",
      },
      ids: leftSide(byRe(/axillary vein$|lateral thoracic vein$|subscapular vein$|thoracodorsal vein$|circumflex scapular vein$|\bcephalic vein$|anterior circumflex humeral vein$/i, ["venous"])),
    },
    {
      key: "xuong",
      latin: "Scapula · Clavicula · Humerus",
      name: { vi: "Xương (mốc)", en: "Bones (landmarks)", zh: "骨（标志）" },
      note: {
        vi: "Xương vai, đòn, cánh tay và các xương sườn trên — mờ sẵn làm mốc.",
        en: "Scapula, clavicle, humerus and upper ribs — faded as landmarks.",
        zh: "肩胛骨、锁骨、肱骨及上位肋骨——淡化作为标志。",
      },
      ids: leftSide(byRe(/scapula$|clavicle$|humerus$|(first|second|third|fourth|fifth) rib$/i, ["skeletal"])),
    },
  ],
});
