/**
 * Sinh scene "Cột sống thắt lưng" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-lumbar-spine.mjs
 *
 * Khảo sát: L1–L5, đĩa T12-L1 → L5-S1, xương cùng, cơ thắt lưng lớn và các
 * cơ gian mỏm ngang/gian gai thắt lưng. THIẾU đuôi ngựa, dây chằng dọc, dây
 * chằng vàng, nhân nhầy tách riêng — nêu trong intro.
 */
import { byRe, emit } from "./lib.mjs";

const SK = ["skeletal"];

emit({
  file: "lumbar-spine",
  exportName: "lumbarSpineScene",
  header: 'Scene "Cột sống thắt lưng" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu đuôi ngựa và dây chằng cột sống.',
  scene: {
    slug: "cot-song-that-lung",
    title: { vi: "Cột sống thắt lưng", en: "The Lumbar Spine", zh: "腰椎" },
    latin: "Vertebrae lumbales",
    intro: {
      vi: "Năm đốt thắt lưng to nhất cột sống, gánh gần trọn trọng lượng thân trên và là nơi đau lưng hay gặp nhất. Mặt khớp quay theo mặt phẳng đứng dọc nên cho gập–duỗi nhiều nhưng xoay rất ít. Đĩa L4–L5 và L5–S1 chịu tải lớn nhất — 95% thoát vị đĩa đệm thắt lưng xảy ra ở hai tầng này. Bộ dữ liệu không có đuôi ngựa và dây chằng cột sống.",
      en: "The five lumbar vertebrae are the largest in the spine, carrying almost the whole upper-body weight, and the commonest source of back pain. Their facet joints face in the sagittal plane, allowing plenty of flexion–extension but very little rotation. The L4–L5 and L5–S1 discs bear the greatest load — 95% of lumbar disc herniations happen at these two levels. The dataset has no cauda equina or spinal ligaments.",
      zh: "五块腰椎是脊柱中最大的椎骨，承担几乎全部上半身重量，也是腰痛最常见的来源。关节突关节面呈矢状位，屈伸幅度大而旋转极少。L4–L5和L5–S1椎间盘承受负荷最大——95%的腰椎间盘突出发生在这两个节段。数据集中无马尾和脊柱韧带。",
    },
  },
  // Cơ thắt lưng lớn bọc kín hai bên thân đốt — mở trang chỉ thấy cơ đỏ, không thấy
  // đốt sống là chủ thể của bài (đã chụp kiểm). Làm mờ sẵn nhóm cơ.
  faded: ["co-canh-song"],
  frame: ["l1-l3", "l4-l5", "dia-dem", "xuong-cung"],
  groups: [
    {
      key: "l1-l3",
      tint: "#7fa878",
      latin: "Vertebrae L1–L3",
      name: { vi: "Đốt thắt lưng L1–L3", en: "Lumbar vertebrae L1–L3", zh: "腰椎 L1–L3" },
      note: {
        vi: "Tuỷ sống thường tận ở ngang L1–L2 (nón tuỷ). Gãy lún L1 do loãng xương hay gặp ở chỗ chuyển tiếp ngực–thắt lưng.",
        en: "The spinal cord usually ends at L1–L2 (the conus medullaris). Osteoporotic compression fractures favour L1 at the thoracolumbar junction.",
        zh: "脊髓通常终止于L1–L2（脊髓圆锥）。骨质疏松性压缩骨折好发于胸腰交界处的L1。",
      },
      ids: byRe(/^(first|second|third) lumbar vertebra$/i, SK),
    },
    {
      key: "l4-l5",
      tint: "#5f9e6a",
      latin: "Vertebrae L4–L5",
      name: { vi: "Đốt thắt lưng L4–L5", en: "Lumbar vertebrae L4–L5", zh: "腰椎 L4–L5" },
      note: {
        vi: "Đường nối hai mào chậu cắt ngang mỏm gai L4 (đường Tuffier) — mốc chọc dò tuỷ sống ở khe L3–L4 hoặc L4–L5. Trượt đốt sống hay gặp ở L4–L5 và L5–S1.",
        en: "The line joining the iliac crests crosses the L4 spinous process (Tuffier's line) — the landmark for lumbar puncture at L3–L4 or L4–L5. Spondylolisthesis is commonest at L4–L5 and L5–S1.",
        zh: "两髂嵴最高点连线平L4棘突（Tuffier线）——在L3–L4或L4–L5间隙行腰椎穿刺的标志。椎体滑脱好发于L4–L5和L5–S1。",
      },
      ids: byRe(/^(fourth|fifth) lumbar vertebra$/i, SK),
    },
    {
      key: "dia-dem",
      tint: "#9fc6d6",
      latin: "Disci intervertebrales lumbales",
      name: { vi: "Đĩa gian đốt thắt lưng", en: "Lumbar intervertebral discs", zh: "腰椎间盘" },
      note: {
        vi: "Thoát vị sau-bên ở tầng L4–L5 chèn rễ L5 (không phải L4, vì rễ L4 đã ra lỗ liên hợp phía trên): yếu gấp mu ngón cái, tê mu bàn chân. L5–S1 chèn S1: mất phản xạ gót. (Nhân nhầy không tách riêng trong dữ liệu.)",
        en: "A posterolateral herniation at L4–L5 compresses the L5 root (not L4, which has already left through the foramen above): weak big-toe dorsiflexion, numb dorsum of the foot. At L5–S1 it hits S1: lost ankle jerk. (The nucleus pulposus is not separate in this data.)",
        zh: "L4–L5后外侧突出压迫L5神经根（而非L4，因L4已从上方椎间孔穿出）：拇趾背伸无力、足背麻木。L5–S1突出压迫S1：跟腱反射消失。（数据中髓核未单独分出。）",
      },
      ids: byRe(/^intervertebral disk of (first|second|third|fourth|fifth) lumbar vertebra|^intervertebral disk$/i, SK),
    },
    {
      key: "xuong-cung",
      tint: "#c98a6b",
      latin: "Os sacrum",
      name: { vi: "Xương cùng", en: "Sacrum", zh: "骶骨" },
      note: {
        vi: "Góc giữa L5 và xương cùng (góc thắt lưng–cùng) là điểm gấp khúc chịu lực cắt lớn — lý do L5–S1 hay thoái hoá và trượt.",
        en: "The angle between L5 and the sacrum (the lumbosacral angle) is a bend that takes heavy shear forces — why L5–S1 so often degenerates and slips.",
        zh: "L5与骶骨之间的夹角（腰骶角）是承受较大剪切力的转折点——这正是L5–S1易退变和滑脱的原因。",
      },
      ids: byRe(/^sacrum$/i, SK),
    },
    {
      key: "co-canh-song",
      tint: "#c05245",
      latin: "M. psoas major · Mm. intertransversarii · interspinales",
      name: { vi: "Cơ thắt lưng lớn và cơ nhỏ cạnh sống", en: "Psoas major and small paraspinal muscles", zh: "腰大肌与椎旁小肌" },
      note: {
        vi: "Cơ thắt lưng lớn bám thân và mỏm ngang L1–L5; các cơ gian mỏm ngang, gian gai, xoay nối từng đốt, cảm nhận tư thế và giữ vững từng tầng. Teo nhóm cơ sâu này gặp ở người đau lưng mạn.",
        en: "Psoas major attaches to the bodies and transverse processes of L1–L5; the intertransverse, interspinous and rotator muscles link each level, sensing posture and stabilising segment by segment. These deep muscles waste in chronic back pain.",
        zh: "腰大肌附着于L1–L5椎体和横突；横突间肌、棘间肌、回旋肌连接各节段，感知姿势并逐节稳定脊柱。慢性腰痛患者此深层肌群萎缩。",
      },
      ids: byRe(/psoas major$|lumbar intertransversarius$|interspinales lumborum$|lumbar rotator$/i, ["muscular"]),
    },
  ],
});
