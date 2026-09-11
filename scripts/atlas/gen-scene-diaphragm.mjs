/**
 * Sinh scene "Cơ hoành và cơ hô hấp" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-diaphragm.mjs
 *
 * Khảo sát: cơ hoành một khối (FJ3131, 15.000 tam giác), ba lớp cơ liên
 * sườn mỗi bên (mỗi lớp ~20–26k tam giác — lưới dày), cơ ngang ngực, nâng
 * sườn, răng sau, thắt lưng lớn, ĐM hoành dưới. THIẾU mạc cơ hoành và cơ
 * vuông thắt lưng. Xương sườn và cột sống mờ sẵn.
 */
import { byRe, byName, emit, DEOXY, OXY } from "./lib.mjs";

const M = (re) => byRe(re, ["muscular"]);

emit({
  file: "diaphragm",
  exportName: "diaphragmScene",
  header: 'Scene "Cơ hoành và cơ hô hấp" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu mạc cơ hoành và cơ vuông thắt lưng.',
  scene: {
    slug: "co-hoanh-day-du",
    title: { vi: "Cơ hoành và cơ hô hấp", en: "Diaphragm and Respiratory Muscles", zh: "膈与呼吸肌" },
    latin: "Diaphragma · Musculi respiratorii",
    intro: {
      vi: "Hít vào bình thường gần như chỉ nhờ cơ hoành: vòm hoành co, hạ xuống khoảng 1,5cm, kéo dài lồng ngực theo chiều đứng. Cơ liên sườn ngoài nâng sườn làm rộng ngực; thở ra bình thường là thụ động, thở ra gắng sức mới dùng cơ liên sườn trong và cơ bụng. Ba lỗ lớn của cơ hoành: tĩnh mạch chủ (T8), thực quản (T10), động mạch chủ (T12) — mẹo \"I 8 10 Eggs At 12\". Xương mờ sẵn; bộ dữ liệu không có mạc cơ hoành và cơ vuông thắt lưng.",
      en: "Quiet inspiration is almost entirely the diaphragm: its dome contracts and descends about 1.5cm, lengthening the chest vertically. The external intercostals raise the ribs to widen it; quiet expiration is passive, and only forced expiration recruits the internal intercostals and abdominal muscles. The three main openings: vena cava (T8), oesophagus (T10), aorta (T12) — \"I 8 10 Eggs At 12\". Bones are faded; the dataset has no diaphragmatic fascia or quadratus lumborum.",
      zh: "平静吸气几乎全靠膈肌：膈穹窿收缩下降约1.5cm，增加胸腔上下径。肋间外肌上提肋骨扩大胸廓；平静呼气是被动的，用力呼气才动用肋间内肌和腹肌。膈的三个主要裂孔：腔静脉孔（T8）、食管裂孔（T10）、主动脉裂孔（T12）——口诀“I 8 10 Eggs At 12”。骨骼淡化；数据集中无膈筋膜和腰方肌。",
    },
  },
  exclude: ["FJ3427"],
  faded: ["xuong"],
  groups: [
    {
      key: "co-hoanh",
      // Cơ màu nâu-hồng, KHÔNG dùng đỏ động mạch (ĐM chủ, ĐM hoành nằm sát).
      tint: "#b36b5a",
      latin: "Diaphragma",
      name: { vi: "Cơ hoành", en: "Diaphragm", zh: "膈" },
      note: {
        vi: "Vòm cơ-gân ngăn ngực và bụng; trung tâm gân ở giữa, phần cơ toả ra bám xương ức, sườn và cột sống thắt lưng (trụ hoành). Do thần kinh hoành (C3–C5) chi phối — \"C3, 4, 5 keeps the diaphragm alive\" — nên chấn thương tuỷ cổ cao gây ngừng thở. Đau cơ hoành lan lên vai (cùng khoanh C4).",
        en: "A musculotendinous dome separating chest from abdomen; a central tendon with muscle radiating to the sternum, ribs and lumbar spine (the crura). Supplied by the phrenic nerve (C3–C5) — \"C3, 4, 5 keeps the diaphragm alive\" — so a high cervical cord injury stops breathing. Diaphragmatic pain is referred to the shoulder (same C4 dermatome).",
        zh: "分隔胸腔与腹腔的肌腱性穹窿；中央为中心腱，肌部放射状附着于胸骨、肋骨和腰椎（膈脚）。由膈神经（C3–C5）支配——“C3、4、5维持膈肌存活”——故高位颈髓损伤导致呼吸停止。膈肌疼痛可牵涉至肩部（同属C4皮节）。",
      },
      ids: byName("Diaphragm"),
    },
    {
      key: "lien-suon-ngoai",
      tint: "#e8883d",
      latin: "Mm. intercostales externi",
      name: { vi: "Cơ liên sườn ngoài", en: "External intercostals", zh: "肋间外肌" },
      note: {
        vi: "Thớ chạy chếch xuống-ra trước (như tay cho vào túi quần). Nâng sườn khi hít vào — động tác \"tay cầm xô\" ở sườn dưới và \"cán bơm\" ở sườn trên.",
        en: "Fibres run down and forward (like hands in the front pockets). They raise the ribs in inspiration — the \"bucket-handle\" movement of the lower ribs and the \"pump-handle\" movement of the upper ones.",
        zh: "肌纤维斜向前下（如手插入前裤袋的方向）。吸气时上提肋骨——下位肋呈“桶柄样”运动，上位肋呈“泵柄样”运动。",
      },
      ids: M(/external intercostal muscle$/i),
    },
    {
      key: "lien-suon-trong",
      tint: "#6f93b8",
      latin: "Mm. intercostales interni et intimi",
      name: { vi: "Cơ liên sườn trong và trong cùng", en: "Internal and innermost intercostals", zh: "肋间内肌与肋间最内肌" },
      note: {
        vi: "Thớ vuông góc với lớp ngoài, kéo sườn xuống khi thở ra gắng sức. Bó mạch thần kinh liên sườn chạy giữa lớp trong và trong cùng, dọc BỜ DƯỚI mỗi xương sườn — nên chọc dịch màng phổi phải đi sát BỜ TRÊN xương sườn dưới.",
        en: "Fibres at right angles to the outer layer, pulling the ribs down in forced expiration. The intercostal neurovascular bundle runs between the internal and innermost layers along the LOWER border of each rib — so a pleural tap must go just above the UPPER border of the rib below.",
        zh: "肌纤维与外层垂直，用力呼气时下拉肋骨。肋间血管神经束行于肋间内肌与最内肌之间、每根肋骨下缘——故胸腔穿刺须紧贴下位肋骨上缘进针。",
      },
      ids: M(/internal intercostal muscle$|innermost intercostal muscle$/i),
    },
    {
      key: "co-phu",
      tint: "#9b6fae",
      latin: "Mm. transversus thoracis, levatores costarum, serrati posteriores",
      name: { vi: "Cơ hô hấp phụ của thành ngực", en: "Accessory chest-wall muscles", zh: "胸壁辅助呼吸肌" },
      note: {
        vi: "Cơ ngang ngực (mặt trong xương ức), cơ nâng sườn và hai cơ răng sau (trên, dưới). Góp phần nhỏ khi thở bình thường; được huy động khi khó thở.",
        en: "Transversus thoracis (behind the sternum), the levatores costarum and the two serratus posterior muscles (superior, inferior). They contribute little in quiet breathing but are recruited in respiratory distress.",
        zh: "胸横肌（胸骨后面）、肋提肌及上、下后锯肌。平静呼吸时作用很小，呼吸困难时被动员。",
      },
      ids: M(/transversus thoracis$|levatores costarum$|serratus posterior (superior|inferior)$/i),
    },
    {
      key: "that-lung",
      tint: "#7fa878",
      latin: "M. psoas major",
      name: { vi: "Cơ thắt lưng lớn", en: "Psoas major", zh: "腰大肌" },
      note: {
        vi: "Chui qua dưới dây chằng cung trong của cơ hoành. Liên quan cơ hoành ở phía sau; áp xe cạnh thận có thể lan theo nó. (Atlas không có cơ vuông thắt lưng.)",
        en: "Passes under the medial arcuate ligament of the diaphragm, which relates it to the diaphragm posteriorly; perinephric abscesses can track along it. (The atlas has no quadratus lumborum.)",
        zh: "穿过膈的内侧弓状韧带下方，与膈后部相邻；肾周脓肿可沿其蔓延。（图谱中无腰方肌。）",
      },
      ids: M(/psoas major$/i),
    },
    {
      key: "mach-qua-hoanh",
      tint: OXY,
      latin: "Aorta · Aa. phrenicae inferiores",
      name: { vi: "Động mạch chủ và động mạch hoành dưới", en: "Aorta and inferior phrenic arteries", zh: "主动脉与膈下动脉" },
      note: {
        vi: "Động mạch chủ đi SAU cơ hoành qua lỗ động mạch chủ (T12) — thực chất là khe giữa hai trụ hoành, nên cơ hoành co không bóp động mạch chủ. Động mạch hoành dưới là nhánh đầu tiên của động mạch chủ bụng.",
        en: "The aorta passes BEHIND the diaphragm through the aortic hiatus (T12) — really a gap between the two crura, so diaphragmatic contraction does not squeeze it. The inferior phrenic arteries are the first branches of the abdominal aorta.",
        zh: "主动脉经主动脉裂孔（T12）从膈后方穿过——实为两膈脚之间的间隙，故膈收缩时不压迫主动脉。膈下动脉是腹主动脉的第一对分支。",
      },
      ids: byName("Descending thoracic aorta", "Abdominal aorta").concat(byRe(/inferior phrenic artery$|musculophrenic artery$/i, ["arterial"])),
    },
    {
      key: "tm-thuc-quan",
      tint: DEOXY,
      latin: "V. cava inferior · Oesophagus",
      name: { vi: "Tĩnh mạch chủ dưới và thực quản", en: "Inferior vena cava and oesophagus", zh: "下腔静脉与食管" },
      note: {
        vi: "Tĩnh mạch chủ dưới xuyên qua trung tâm gân (T8) — hít vào cơ hoành co làm lỗ này RỘNG ra, giúp máu về tim. Thực quản qua lỗ cơ ở trụ phải (T10) — hít vào lỗ này THẮT lại, chống trào ngược.",
        en: "The IVC passes through the central tendon (T8) — inspiration WIDENS this opening, helping venous return. The oesophagus passes through a muscular hiatus in the right crus (T10) — inspiration TIGHTENS it, resisting reflux.",
        zh: "下腔静脉穿中心腱（T8）——吸气时此孔扩大，促进静脉回流。食管穿右膈脚形成的肌性裂孔（T10）——吸气时此孔收紧，防止反流。",
      },
      ids: byName("Inferior vena cava", "Esophagus"),
    },
    {
      key: "xuong",
      latin: "Costae · Vertebrae · Sternum",
      name: { vi: "Xương sườn, ức và cột sống (mốc)", en: "Ribs, sternum and spine (landmarks)", zh: "肋骨、胸骨与脊柱（标志）" },
      note: {
        vi: "Mờ sẵn để thấy chỗ bám của cơ hoành và các lớp cơ liên sườn.",
        en: "Faded to show where the diaphragm and intercostal layers attach.",
        zh: "淡化以显示膈和肋间肌各层的附着处。",
      },
      ids: byRe(/rib$|costal cartilage$|^\w+ thoracic vertebra$|^\w+ lumbar vertebra$|^manubrium$|^body of sternum$|^xiphoid process$/i, ["skeletal"]),
    },
  ],
});
