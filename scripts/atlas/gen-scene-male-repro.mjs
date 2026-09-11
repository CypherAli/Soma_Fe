/**
 * Sinh scene "Hệ sinh sản nam" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-male-repro.mjs
 *
 * Khảo sát: đủ tinh hoàn, mào tinh, ống dẫn tinh, túi tinh (hai bên), tiền
 * liệt, thể hang, thể xốp, quy đầu; mạch lưng dương vật, ĐM/TM tinh hoàn.
 * Không có ống phóng tinh riêng. Bàng quang và niệu đạo làm mốc.
 */
import { byRe, byName, emit } from "./lib.mjs";

emit({
  file: "male-repro",
  exportName: "maleReproScene",
  header: 'Scene "Hệ sinh sản nam" dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "he-sinh-san-nam",
    title: { vi: "Hệ sinh sản nam", en: "The Male Reproductive System", zh: "男性生殖系统" },
    latin: "Organa genitalia masculina",
    intro: {
      vi: "Tinh trùng tạo ở tinh hoàn, trưởng thành trong mào tinh, rồi đi theo ống dẫn tinh qua ống bẹn vào chậu hông, vòng qua niệu quản ra sau bàng quang, nhận dịch túi tinh và tiền liệt rồi đổ vào niệu đạo. Tinh hoàn nằm ngoài ổ bụng vì cần nhiệt độ thấp hơn thân nhiệt khoảng 2–3°C. Mỗi cơ quan một màu; bàng quang và niệu đạo để làm mốc.",
      en: "Sperm are made in the testis, mature in the epididymis, then travel along the ductus deferens through the inguinal canal into the pelvis, loop over the ureter behind the bladder, pick up fluid from the seminal vesicles and prostate, and enter the urethra. The testes lie outside the abdomen because they need a temperature 2–3°C below core. Each organ has its own colour; the bladder and urethra are landmarks.",
      zh: "精子在睾丸生成，于附睾内成熟，再经输精管穿腹股沟管入盆腔，绕过输尿管至膀胱后方，汇合精囊和前列腺的分泌液后进入尿道。睾丸位于腹腔外，因其需要比体温低2–3°C的环境。各器官以不同颜色显示；膀胱和尿道作为定位标志。",
    },
  },
  groups: [
    {
      key: "tinh-hoan",
      tint: "#c98a6b",
      latin: "Testis",
      name: { vi: "Tinh hoàn", en: "Testes", zh: "睾丸" },
      note: {
        vi: "Sinh tinh trùng và testosteron. Xuống bìu qua ống bẹn trước khi sinh; tinh hoàn ẩn không xuống tăng nguy cơ ung thư và vô sinh. Dẫn lưu bạch huyết về hạch cạnh động mạch chủ (theo đường đi xuống của nó), không về hạch bẹn.",
        en: "Produce sperm and testosterone. They descend through the inguinal canal into the scrotum before birth; an undescended testis carries a higher risk of cancer and infertility. Lymph drains to the para-aortic nodes (following its line of descent), not to the inguinal nodes.",
        zh: "产生精子和睾酮。出生前经腹股沟管下降入阴囊；隐睾增加癌变和不育风险。淋巴引流至腹主动脉旁淋巴结（沿其下降路径），而非腹股沟淋巴结。",
      },
      ids: byRe(/^(left|right) testis$/i),
    },
    {
      key: "mao-tinh",
      tint: "#d9a066",
      latin: "Epididymis",
      name: { vi: "Mào tinh", en: "Epididymis", zh: "附睾" },
      note: {
        vi: "Ống cuộn dài khoảng 6m ép gọn ở bờ sau tinh hoàn; tinh trùng mất 2–3 tuần đi qua đây để trưởng thành và có khả năng di động.",
        en: "A coiled tube about 6m long packed along the back of the testis; sperm take 2–3 weeks to pass through it, maturing and gaining motility.",
        zh: "长约6m的盘曲管道，紧贴睾丸后缘；精子需2–3周通过此处，逐渐成熟并获得运动能力。",
      },
      ids: byRe(/epididymis$/i),
    },
    {
      key: "ong-dan-tinh",
      tint: "#e0c78c",
      latin: "Ductus deferens",
      name: { vi: "Ống dẫn tinh", en: "Ductus deferens", zh: "输精管" },
      note: {
        vi: "Ống cơ thành dày, sờ thấy như sợi dây cứng trong thừng tinh — chỗ thắt khi triệt sản nam. Đi qua ống bẹn, bắt chéo TRÊN niệu quản (\"nước chảy dưới cầu\") rồi phình thành bóng ống dẫn tinh sau bàng quang.",
        en: "A thick-walled muscular tube felt as a firm cord in the spermatic cord — where it is cut in vasectomy. It passes through the inguinal canal and crosses ABOVE the ureter (\"water under the bridge\") before widening into the ampulla behind the bladder.",
        zh: "厚壁肌性管道，在精索中可触及为硬索——即输精管结扎处。穿过腹股沟管，于输尿管上方跨过（“桥下流水”），在膀胱后方膨大为输精管壶腹。",
      },
      ids: byRe(/deferent duct$/i),
    },
    {
      key: "tui-tinh",
      tint: "#b0708f",
      latin: "Glandula vesiculosa",
      name: { vi: "Túi tinh", en: "Seminal vesicles", zh: "精囊" },
      note: {
        vi: "Hai tuyến nằm sau đáy bàng quang, tiết khoảng 70% thể tích tinh dịch, giàu fructose nuôi tinh trùng. Ống túi tinh hợp với bóng ống dẫn tinh thành ống phóng tinh xuyên qua tiền liệt.",
        en: "Two glands behind the base of the bladder that secrete about 70% of the semen volume, rich in fructose to fuel sperm. Each duct joins the ampulla of the ductus deferens to form the ejaculatory duct, which runs through the prostate.",
        zh: "位于膀胱底后方的两个腺体，分泌约70%的精液量，富含果糖为精子供能。其排泄管与输精管壶腹汇合成射精管，穿过前列腺。",
      },
      ids: byRe(/seminal vesicle$/i),
    },
    {
      key: "tien-liet",
      tint: "#9b6fae",
      latin: "Prostata",
      name: { vi: "Tuyến tiền liệt", en: "Prostate", zh: "前列腺" },
      note: {
        vi: "Ôm quanh đoạn đầu niệu đạo dưới cổ bàng quang. Phì đại lành tính (vùng chuyển tiếp) bóp niệu đạo gây tiểu khó; ung thư thường ở vùng ngoại vi phía sau — sờ được qua thăm trực tràng.",
        en: "Wraps the first part of the urethra below the bladder neck. Benign hyperplasia (in the transition zone) squeezes the urethra and causes difficulty voiding; cancer usually arises in the posterior peripheral zone — palpable on rectal examination.",
        zh: "环绕膀胱颈下方的尿道起始段。良性增生（移行带）压迫尿道致排尿困难；癌多发生于后方外周带——直肠指检可触及。",
      },
      ids: byName("Prostate"),
    },
    {
      key: "duong-vat",
      tint: "#c05245",
      latin: "Corpora cavernosa · Corpus spongiosum",
      name: { vi: "Thể hang, thể xốp và quy đầu", en: "Corpora cavernosa, corpus spongiosum and glans", zh: "阴茎海绵体、尿道海绵体与阴茎头" },
      note: {
        vi: "Hai thể hang ở trên cương cứng khi máu dồn vào và tĩnh mạch bị ép; thể xốp ở dưới bọc niệu đạo, loe ra thành quy đầu, cương mềm hơn để niệu đạo không bị bịt khi xuất tinh.",
        en: "The two corpora cavernosa on top become rigid when blood fills them and the veins are compressed; the corpus spongiosum below surrounds the urethra and expands into the glans, staying softer so the urethra is not closed during ejaculation.",
        zh: "上方两条阴茎海绵体在血液充盈、静脉受压时变硬勃起；下方尿道海绵体包绕尿道并膨大为阴茎头，勃起时较软，以免射精时尿道被阻塞。",
      },
      ids: byRe(/corpus (cavernosum|spongiosum) of penis|glans penis/i),
    },
    {
      key: "mach",
      tint: "#e07a6a",
      latin: "Vasa testicularia · Vasa dorsalia penis",
      name: { vi: "Mạch tinh hoàn và lưng dương vật", en: "Testicular and dorsal penile vessels", zh: "睾丸血管与阴茎背血管" },
      note: {
        vi: "Động mạch tinh hoàn tách từ động mạch chủ ngang L2 — do tinh hoàn có nguồn gốc ở thắt lưng. Đám rối tĩnh mạch hình dây leo quanh động mạch làm mát máu đến; giãn đám rối (thường bên trái) là giãn tĩnh mạch thừng tinh.",
        en: "The testicular artery arises from the aorta at L2 — because the testis originates in the lumbar region. The pampiniform venous plexus around the artery cools incoming blood; its dilation (usually on the left) is a varicocele.",
        zh: "睾丸动脉于L2平面发自腹主动脉——因睾丸起源于腰部。环绕动脉的蔓状静脉丛可冷却流入的血液；其扩张（多见于左侧）即精索静脉曲张。",
      },
      ids: byRe(/testicular (artery|vein)$|dorsal artery of penis|dorsal vein of penis/i, ["arterial", "venous"]),
    },
    {
      key: "moc",
      latin: "Vesica urinaria · Urethra",
      name: { vi: "Bàng quang và niệu đạo (mốc)", en: "Bladder and urethra (landmarks)", zh: "膀胱与尿道（标志）" },
      note: {
        vi: "Mốc để thấy túi tinh và bóng ống dẫn tinh nằm sau đáy bàng quang, tiền liệt nằm dưới cổ bàng quang.",
        en: "Landmarks showing the seminal vesicles and ampulla behind the bladder base, and the prostate below the bladder neck.",
        zh: "定位标志：精囊和输精管壶腹位于膀胱底后方，前列腺位于膀胱颈下方。",
      },
      ids: byName("Urinary bladder", "Urethra"),
    },
  ],
});
