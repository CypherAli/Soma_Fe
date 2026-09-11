/**
 * Sinh scene "Chậu hông và đáy chậu" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-pelvic-floor.mjs
 *
 * Khảo sát (--dup): mỗi cơ đáy chậu có HAI bộ mảnh gần như trùng khít. Giữ
 * bộ FJ2542–FJ2553 (đủ hai bên), bỏ bộ FJ14xx:
 *   FJ1449M≈FJ2542 (0,6mm)  FJ1450≈FJ2548 (0,0mm)  FJ1450M≈FJ2543 (0,1mm)
 *   FJ1453M≈FJ2544 (0,9mm)  FJ1457M, FJ1458M cùng hộp bao FJ2545, FJ2546
 *   FJ1465, FJ1465M cùng hộp bao cung gân FJ2552, FJ2553
 * FJ1450 còn mang tên sai ("superficial perineal muscle" nhưng lưới là cơ
 * thắt hậu môn ngoài). THIẾU các dây chằng cùng-ụ ngồi/cùng-chậu và thần
 * kinh thẹn.
 */
import { byRe, byName, emit } from "./lib.mjs";

const M = (re) => byRe(re, ["muscular", "connective"]);

emit({
  file: "pelvic-floor",
  exportName: "pelvicFloorScene",
  header: 'Scene "Chậu hông và đáy chậu" dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu dây chằng chậu hông và thần kinh thẹn.',
  scene: {
    slug: "chau-hong-day-chau",
    title: { vi: "Chậu hông và đáy chậu", en: "Pelvis and Pelvic Floor", zh: "盆腔与盆底" },
    latin: "Pelvis · Diaphragma pelvis",
    intro: {
      vi: "Đáy chậu là \"cái võng\" cơ đỡ tạng chậu hông. Cơ nâng hậu môn (mu-cụt, mu-trực tràng, chậu-cụt) cùng cơ ụ ngồi-cụt tạo hoành chậu; bó mu-trực tràng vòng quanh chỗ nối hậu môn–trực tràng như dây thòng lọng, giữ góc trực tràng để tự chủ đại tiện. Tổn thương khi sinh đẻ làm yếu đáy chậu gây sa tạng và tiểu không tự chủ. Bộ dữ liệu chỉ có cơ thể nam, không có dây chằng chậu hông và thần kinh thẹn; xương mờ sẵn.",
      en: "The pelvic floor is a muscular hammock holding up the pelvic organs. Levator ani (pubococcygeus, puborectalis, iliococcygeus) together with coccygeus form the pelvic diaphragm; puborectalis loops around the anorectal junction like a sling, keeping the anorectal angle for faecal continence. Birth injury weakens the floor and leads to prolapse and incontinence. The dataset is a male body without pelvic ligaments or the pudendal nerve; bones are faded.",
      zh: "盆底是承托盆腔脏器的肌性“吊床”。肛提肌（耻尾肌、耻骨直肠肌、髂尾肌）与尾骨肌构成盆膈；耻骨直肠肌如吊带环绕肛管直肠连接处，维持肛直角以控制排便。分娩损伤削弱盆底，导致脏器脱垂和失禁。数据集为男性身体，无盆腔韧带和阴部神经；骨骼淡化。",
    },
  },
  exclude: ["FJ1449M", "FJ1450", "FJ1450M", "FJ1453M", "FJ1457M", "FJ1458M", "FJ1465", "FJ1465M"],
  faded: ["xuong"],
  // Căn theo phễu cơ và tạng: khung chậu (mờ) làm phễu cơ chỉ còn một chấm.
  frame: ["mu-cut", "mu-truc-trang", "chau-cut", "u-ngoi-cut", "that-hau-mon", "bit-trong", "tang"],
  groups: [
    {
      key: "mu-cut",
      tint: "#c05245",
      latin: "M. pubococcygeus",
      name: { vi: "Cơ mu-cụt", en: "Pubococcygeus", zh: "耻尾肌" },
      note: {
        vi: "Phần giữa cơ nâng hậu môn, từ mặt sau xương mu tới xương cụt, ôm hai bên niệu đạo, tiền liệt (nam) hoặc âm đạo (nữ). Là cơ được tập trong bài tập Kegel.",
        en: "The middle part of levator ani, from the back of the pubis to the coccyx, flanking the urethra and prostate (or vagina). It is the muscle trained in Kegel exercises.",
        zh: "肛提肌中部，自耻骨后面至尾骨，夹持尿道和前列腺（女性为阴道）两侧。即凯格尔运动所锻炼的肌肉。",
      },
      ids: M(/pubococcygeus$/i),
    },
    {
      key: "mu-truc-trang",
      tint: "#e8883d",
      latin: "M. puborectalis",
      name: { vi: "Cơ mu-trực tràng", en: "Puborectalis", zh: "耻骨直肠肌" },
      note: {
        vi: "Dải cơ hình chữ U vòng sau chỗ nối hậu môn–trực tràng, kéo nó ra trước tạo góc khoảng 90°. Khi rặn cơ này giãn, góc mở thẳng ra; co thắt nghịch thường gây táo bón.",
        en: "A U-shaped sling passing behind the anorectal junction and pulling it forward to make an angle of about 90°. It relaxes during defecation to straighten the angle; paradoxical contraction causes constipation.",
        zh: "U形肌束绕过肛管直肠连接处后方并将其向前牵拉，形成约90°的夹角。排便时此肌松弛使夹角变直；反常收缩导致便秘。",
      },
      ids: M(/puborectalis$/i),
    },
    {
      key: "chau-cut",
      tint: "#d98a2b",
      latin: "M. iliococcygeus · Arcus tendineus",
      name: { vi: "Cơ chậu-cụt và cung gân", en: "Iliococcygeus and tendinous arch", zh: "髂尾肌与肛提肌腱弓" },
      note: {
        vi: "Phần sau-ngoài mỏng của cơ nâng hậu môn, xuất phát từ cung gân — dải mạc dày trên mặt cơ bịt trong. Cùng các phần kia tạo thành phễu hoành chậu.",
        en: "The thin posterolateral part of levator ani, arising from the tendinous arch — a thickened band of fascia over obturator internus. With the other parts it forms the funnel of the pelvic diaphragm.",
        zh: "肛提肌薄弱的后外侧部，起自肛提肌腱弓——闭孔内肌表面增厚的筋膜带。与其他部分共同构成漏斗状盆膈。",
      },
      ids: M(/iliococcygeus$|tendinous arch of levator ani$/i),
    },
    {
      key: "u-ngoi-cut",
      tint: "#9b6fae",
      latin: "M. coccygeus",
      name: { vi: "Cơ ụ ngồi-cụt", en: "Coccygeus", zh: "尾骨肌" },
      note: {
        vi: "Phần sau cùng của hoành chậu, từ gai ngồi tới bờ xương cùng-cụt, nằm trên dây chằng cùng-gai.",
        en: "The most posterior part of the pelvic diaphragm, from the ischial spine to the edge of the sacrum and coccyx, lying on the sacrospinous ligament.",
        zh: "盆膈的最后部，自坐骨棘至骶骨和尾骨边缘，位于骶棘韧带之上。",
      },
      ids: M(/coccygeus$/i).filter((id) => !M(/pubococcygeus|iliococcygeus/i).includes(id)),
    },
    {
      key: "that-hau-mon",
      tint: "#b0708f",
      latin: "M. sphincter ani externus",
      name: { vi: "Cơ thắt hậu môn ngoài", en: "External anal sphincter", zh: "肛门外括约肌" },
      note: {
        vi: "Cơ vân tự chủ bao quanh ống hậu môn, do thần kinh thẹn chi phối. Rách cơ khi sinh (rách tầng sinh môn độ III–IV) gây đại tiện không tự chủ.",
        en: "A voluntary striated muscle ringing the anal canal, supplied by the pudendal nerve. Tearing it in childbirth (third- or fourth-degree perineal tear) causes faecal incontinence.",
        zh: "环绕肛管的随意横纹肌，受阴部神经支配。分娩时撕裂（III–IV度会阴裂伤）导致大便失禁。",
      },
      ids: M(/external anal sphincter$/i),
    },
    {
      key: "bit-trong",
      tint: "#6f93b8",
      latin: "M. obturator internus",
      name: { vi: "Cơ bịt trong", en: "Obturator internus", zh: "闭孔内肌" },
      note: {
        vi: "Lót thành bên chậu hông, chui qua khuyết ngồi bé ra ngoài xoay đùi. Mạc phủ cơ này tạo ống thẹn (Alcock) chứa bó mạch thần kinh thẹn.",
        en: "Lines the side wall of the pelvis and exits through the lesser sciatic notch to rotate the thigh. The fascia over it forms the pudendal (Alcock's) canal carrying the pudendal vessels and nerve.",
        zh: "衬于盆腔侧壁，经坐骨小孔穿出以旋转大腿。其表面筋膜形成阴部管（Alcock管），内有阴部血管神经。",
      },
      ids: byRe(/obturator internus$/i, ["muscular"]),
    },
    {
      key: "tang",
      latin: "Vesica · Prostata · Rectum",
      name: { vi: "Tạng chậu hông", en: "Pelvic organs", zh: "盆腔脏器" },
      note: {
        vi: "Bàng quang ở trước, tiền liệt dưới cổ bàng quang, trực tràng ở sau — tất cả tựa trên đáy chậu. Để màu gốc làm mốc.",
        en: "Bladder in front, prostate below the bladder neck, rectum behind — all resting on the pelvic floor. Shown in natural colour as landmarks.",
        zh: "膀胱在前，前列腺在膀胱颈下方，直肠在后——均承托于盆底之上。以原色作为标志。",
      },
      ids: byName("Urinary bladder", "Prostate", "Rectum", "Urethra"),
    },
    {
      key: "xuong",
      latin: "Os coxae · Os sacrum",
      name: { vi: "Xương chậu và xương cùng (mốc)", en: "Hip bones and sacrum (landmarks)", zh: "髋骨与骶骨（标志）" },
      note: {
        vi: "Khung chậu — mờ sẵn để thấy phễu cơ bên trong.",
        en: "The bony pelvis — faded so the muscular funnel inside shows.",
        zh: "骨盆——淡化以显示其内的肌性漏斗。",
      },
      ids: byRe(/hip bone$|^sacrum$/i, ["skeletal"]),
    },
  ],
});
