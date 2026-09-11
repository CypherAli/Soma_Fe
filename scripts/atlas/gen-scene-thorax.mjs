/**
 * Sinh scene "Lồng ngực" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-thorax.mjs
 *
 * Khảo sát: đủ 12 đôi xương sườn, cán/thân/mũi ức, T1–T12.
 * Sụn sườn CHỈ có I–VII; sụn của sườn VIII–X (tạo bờ sườn) không có trong
 * atlas — ghi rõ trong note nhóm sụn sườn.
 */
import { byRe, emit } from "./lib.mjs";

const SK = ["skeletal"];

emit({
  file: "thorax",
  exportName: "thoraxScene",
  header: 'Scene "Lồng ngực" dựng từ bộ atlas BodyParts3D.\n\nAtlas chỉ có sụn sườn I–VII.',
  scene: {
    slug: "long-nguc",
    title: { vi: "Lồng ngực", en: "The Thoracic Cage", zh: "胸廓" },
    latin: "Compages thoracis",
    intro: {
      vi: "Lồng ngực gồm xương ức ở trước, 12 đốt sống ngực ở sau và 12 đôi xương sườn nối giữa, bảo vệ tim, phổi và các tạng bụng trên. Xương sườn chia ba loại theo cách nối với xương ức: sườn thật I–VII nối thẳng bằng sụn riêng, sườn giả VIII–X nối gián tiếp qua sụn sườn trên, sườn cụt XI–XII không nối. Lồng ngực nở ra khi hít vào nhờ sườn nâng lên như quai xô.",
      en: "The thoracic cage is formed by the sternum in front, the 12 thoracic vertebrae behind and the 12 pairs of ribs between them, protecting the heart, lungs and upper abdominal organs. Ribs are grouped by how they reach the sternum: true ribs I–VII by their own cartilage, false ribs VIII–X indirectly through the cartilage above, floating ribs XI–XII not at all. The cage widens on inspiration as the ribs lift like bucket handles.",
      zh: "胸廓由前方的胸骨、后方的12块胸椎及其间的12对肋骨构成，保护心、肺及上腹部脏器。肋骨按与胸骨的连接方式分三类：真肋I–VII借各自肋软骨直接相连，假肋VIII–X经上位肋软骨间接相连，浮肋XI–XII不相连。吸气时肋骨如桶柄般上提，胸廓扩大。",
    },
  },
  frame: ["xuong-uc", "suon-that", "suon-gia", "suon-cut", "sun-suon"],
  groups: [
    {
      key: "xuong-uc",
      tint: "#d9a066",
      latin: "Sternum",
      name: { vi: "Xương ức", en: "Sternum", zh: "胸骨" },
      note: {
        vi: "Cán ức, thân ức và mũi ức. Chỗ nối cán–thân tạo góc ức (góc Louis) sờ được, ngang sụn sườn II — mốc đếm xương sườn và ngang mức chia đôi khí quản. Tim nằm ngay sau thân ức nên ép tim ngoài lồng ngực đặt tay ở nửa dưới xương ức.",
        en: "Manubrium, body and xiphoid process. The manubriosternal junction forms the palpable sternal angle (of Louis) at the level of the second costal cartilage — the landmark for counting ribs and the level of the tracheal bifurcation. The heart lies directly behind the body, which is why chest compressions go on the lower half of the sternum.",
        zh: "由胸骨柄、胸骨体和剑突组成。柄体结合处形成可触及的胸骨角（Louis角），平第二肋软骨——是计数肋骨的标志，也平气管分叉水平。心脏紧贴胸骨体后方，故胸外按压位于胸骨下半部。",
      },
      ids: byRe(/^manubrium$|^body of sternum$|^xiphoid process$/i, SK),
    },
    {
      key: "suon-that",
      tint: "#c98a5a",
      latin: "Costae verae I–VII",
      name: { vi: "Xương sườn thật (I–VII)", en: "True ribs (I–VII)", zh: "真肋（I–VII）" },
      note: {
        vi: "Mỗi xương nối thẳng vào xương ức bằng sụn sườn riêng. Sườn I ngắn, dẹt, nằm sâu dưới xương đòn — động mạch và tĩnh mạch dưới đòn cùng đám rối cánh tay bắt chéo trên mặt nó, gốc của hội chứng lối thoát ngực.",
        en: "Each joins the sternum directly by its own costal cartilage. Rib I is short and flat, tucked under the clavicle — the subclavian vessels and brachial plexus cross its upper surface, the basis of thoracic outlet syndrome.",
        zh: "每根均借自身肋软骨直接连于胸骨。第一肋短而扁，藏于锁骨下方——锁骨下动、静脉及臂丛跨越其上面，是胸廓出口综合征的解剖基础。",
      },
      ids: byRe(/(first|second|third|fourth|fifth|sixth|seventh) rib$/i, SK),
    },
    {
      key: "suon-gia",
      tint: "#e3c27a",
      latin: "Costae spuriae VIII–X",
      name: { vi: "Xương sườn giả (VIII–X)", en: "False ribs (VIII–X)", zh: "假肋（VIII–X）" },
      note: {
        vi: "Sụn của chúng nhập vào sụn sườn ngay trên, tạo nên bờ sườn — mốc sờ gan, lách khi khám bụng. (Atlas thiếu các đoạn sụn này nên đầu trước xương sườn giả bị hở.)",
        en: "Their cartilages join the cartilage above, forming the costal margin — the landmark for palpating the liver and spleen. (The atlas lacks these cartilages, so the front ends of the false ribs are open.)",
        zh: "其肋软骨连于上位肋软骨，形成肋弓——是腹部触诊肝、脾的标志。（图谱缺少这些软骨，故假肋前端呈游离状。）",
      },
      ids: byRe(/(eighth|ninth|tenth) rib$/i, SK),
    },
    {
      key: "suon-cut",
      tint: "#b9785a",
      latin: "Costae fluctuantes XI–XII",
      name: { vi: "Xương sườn cụt (XI–XII)", en: "Floating ribs (XI–XII)", zh: "浮肋（XI–XII）" },
      note: {
        vi: "Ngắn, đầu trước tự do trong thành bụng sau. Sườn XII bắt chéo mặt sau thận — vì vậy đường mổ vào thận hay đi dọc sườn XII, và gãy sườn cụt cần nghĩ tới dập thận.",
        en: "Short, with free front ends in the posterior abdominal wall. Rib XII crosses the back of the kidney — which is why kidney incisions often follow rib XII, and why a fractured floating rib should raise suspicion of renal injury.",
        zh: "短小，前端游离于腹后壁内。第十二肋斜跨肾后面——因此肾脏手术切口常沿第十二肋，浮肋骨折时应警惕肾挫伤。",
      },
      ids: byRe(/(eleventh|twelfth) rib$/i, SK),
    },
    {
      key: "sun-suon",
      tint: "#9fc6d6",
      latin: "Cartilagines costales",
      name: { vi: "Sụn sườn", en: "Costal cartilages", zh: "肋软骨" },
      note: {
        vi: "Sụn trong (sụn hyalin — không phải sụn chun) nối xương sườn với xương ức, cho lồng ngực dẻo khi thở và khi bị va đập. Người lớn tuổi sụn sườn cốt hoá dần nên lồng ngực kém đàn hồi. Atlas chỉ có sụn I–VII.",
        en: "Elastic hyaline cartilage linking the ribs to the sternum, giving the cage flexibility for breathing and absorbing impacts. In older people the costal cartilages gradually ossify and the cage stiffens. The atlas only has cartilages I–VII.",
        zh: "有弹性的透明软骨，连接肋骨与胸骨，使胸廓在呼吸和受撞击时具有柔韧性。老年人肋软骨逐渐骨化，胸廓弹性下降。图谱仅有第I–VII肋软骨。",
      },
      ids: byRe(/costal cartilage$/i, SK),
    },
    {
      key: "dot-song-nguc",
      latin: "Vertebrae thoracicae",
      name: { vi: "Đốt sống ngực (T1–T12)", en: "Thoracic vertebrae (T1–T12)", zh: "胸椎（T1–T12）" },
      note: {
        vi: "Thành sau lồng ngực. Mỗi xương sườn khớp với đốt sống ở hai chỗ: chỏm sườn với thân đốt, củ sườn với mỏm ngang — hai khớp này tạo trục cho xương sườn xoay khi thở.",
        en: "The back wall of the cage. Each rib articulates with the spine at two points: its head with the vertebral bodies and its tubercle with the transverse process — together these form the axis about which the rib swings during breathing.",
        zh: "胸廓后壁。每根肋骨在两处与脊柱相关节：肋头连椎体，肋结节连横突——两关节构成肋骨呼吸时转动的轴。",
      },
      // Neo ^ để không kéo "Intervertebral disk of … thoracic vertebra".
      ids: byRe(/^\w+ thoracic vertebra$/i, SK),
    },
  ],
});
