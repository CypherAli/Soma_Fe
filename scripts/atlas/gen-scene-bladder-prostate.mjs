/**
 * Sinh scene "Bàng quang và tiền liệt tuyến" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-bladder-prostate.mjs
 *
 * Khảo sát: bàng quang, tiền liệt, túi tinh, ống dẫn tinh, đoạn cuối niệu
 * quản, niệu đạo, thể xốp, cơ đáy chậu (bộ FJ25xx — xem gen-scene-pelvic-
 * floor), khớp mu thuộc xương chậu. THIẾU ống phóng tinh riêng.
 */
import { byRe, byName, emit } from "./lib.mjs";

emit({
  file: "bladder-prostate",
  exportName: "bladderProstateScene",
  header: 'Scene "Bàng quang và tiền liệt tuyến" dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "bang-quang-tien-liet",
    title: { vi: "Bàng quang và tiền liệt tuyến", en: "Bladder and Prostate", zh: "膀胱与前列腺" },
    latin: "Vesica urinaria · Prostata",
    intro: {
      vi: "Ở nam, tiền liệt ôm lấy niệu đạo ngay dưới cổ bàng quang; túi tinh và bóng ống dẫn tinh nằm sau đáy bàng quang, trước trực tràng. Vì vậy tiền liệt to lên chèn niệu đạo gây tiểu khó, và sờ được qua thăm trực tràng. Niệu quản đi vào đáy bàng quang, bị ống dẫn tinh bắt chéo phía trên. Mỗi cơ quan một màu; xương chậu và trực tràng mờ sẵn.",
      en: "In men the prostate wraps the urethra just below the bladder neck; the seminal vesicles and ampullae of the vas lie behind the bladder base, in front of the rectum. That is why an enlarged prostate squeezes the urethra and makes voiding difficult, and why it can be felt on rectal examination. The ureters enter the bladder base, crossed from above by the vas. Each organ has its own colour; the pelvis and rectum are faded.",
      zh: "男性前列腺环抱膀胱颈下方的尿道；精囊和输精管壶腹位于膀胱底后方、直肠前方。因此前列腺增大压迫尿道致排尿困难，且可经直肠指检触及。输尿管进入膀胱底，其上方有输精管跨过。各器官以不同颜色显示；骨盆和直肠淡化。",
    },
  },
  exclude: ["FJ1449M", "FJ1450", "FJ1450M", "FJ1453M", "FJ1457M", "FJ1458M"],
  faded: ["moc"],
  // Căn theo tạng: xương chậu (mờ) làm khung phình gấp đôi.
  frame: ["bang-quang", "tien-liet", "tui-tinh", "ong-dan-tinh", "nieu-dao", "day-chau"],
  groups: [
    {
      key: "bang-quang",
      tint: "#c9a06a",
      latin: "Vesica urinaria",
      name: { vi: "Bàng quang", en: "Urinary bladder", zh: "膀胱" },
      note: {
        vi: "Đỉnh, thân, đáy và cổ bàng quang. Mặt trên phủ phúc mạc; khi đầy bàng quang nâng phúc mạc lên khỏi khớp mu, tạo \"cửa sổ\" để chọc trên xương mu. Vỡ bàng quang ngoài phúc mạc hay đi kèm gãy khung chậu.",
        en: "Apex, body, fundus and neck. Its upper surface is covered by peritoneum; when full it lifts the peritoneum off the pubis, opening a \"window\" for suprapubic puncture. Extraperitoneal bladder rupture often accompanies a pelvic fracture.",
        zh: "分尖、体、底、颈。上面覆有腹膜；充盈时将腹膜抬离耻骨，形成耻骨上穿刺的“窗口”。腹膜外膀胱破裂常伴骨盆骨折。",
      },
      ids: byName("Urinary bladder"),
    },
    {
      key: "tien-liet",
      tint: "#9b6fae",
      latin: "Prostata",
      name: { vi: "Tuyến tiền liệt", en: "Prostate", zh: "前列腺" },
      note: {
        vi: "Kích thước bằng quả óc chó, gồm vùng chuyển tiếp (quanh niệu đạo — nơi phì đại lành tính), vùng trung tâm và vùng ngoại vi (phía sau — nơi 70% ung thư). Tiết khoảng 30% tinh dịch và PSA.",
        en: "Walnut-sized, with a transition zone (around the urethra — where benign hyperplasia arises), a central zone and a peripheral zone (posterior — where 70% of cancers arise). It makes about 30% of the semen and secretes PSA.",
        zh: "核桃大小，分移行带（环绕尿道——良性增生好发处）、中央带和外周带（后部——70%的癌发生于此）。分泌约30%的精液及PSA。",
      },
      ids: byName("Prostate"),
    },
    {
      key: "tui-tinh",
      tint: "#b0708f",
      latin: "Glandulae vesiculosae",
      name: { vi: "Túi tinh", en: "Seminal vesicles", zh: "精囊" },
      note: {
        vi: "Hai túi cuộn ở sau-dưới bàng quang, ngoài bóng ống dẫn tinh. Ung thư tiền liệt xâm lấn túi tinh là giai đoạn T3b — tiên lượng xấu hơn.",
        en: "Two coiled sacs behind and below the bladder, lateral to the ampullae. Prostate cancer invading them is stage T3b — a worse prognosis.",
        zh: "膀胱后下方的两个盘曲囊状腺体，位于输精管壶腹外侧。前列腺癌侵犯精囊为T3b期——预后较差。",
      },
      ids: byRe(/seminal vesicle$/i),
    },
    {
      key: "ong-dan-tinh",
      tint: "#e0c78c",
      latin: "Ductus deferentes",
      name: { vi: "Ống dẫn tinh", en: "Ductus deferens", zh: "输精管" },
      note: {
        vi: "Từ lỗ bẹn sâu đi dọc thành chậu, bắt chéo TRÊN niệu quản rồi phình thành bóng sau bàng quang, hợp ống túi tinh thành ống phóng tinh xuyên tiền liệt.",
        en: "From the deep inguinal ring along the pelvic wall, it crosses ABOVE the ureter, widens into the ampulla behind the bladder and joins the seminal vesicle duct to form the ejaculatory duct through the prostate.",
        zh: "自腹股沟管深环沿盆壁走行，于输尿管上方跨过，在膀胱后方膨大为壶腹，与精囊排泄管汇合成射精管穿过前列腺。",
      },
      ids: byRe(/deferent duct$/i),
    },
    {
      key: "nieu-quan",
      tint: "#d9b25a",
      latin: "Ureteres",
      name: { vi: "Niệu quản (đoạn chậu)", en: "Ureters (pelvic part)", zh: "输尿管（盆段）" },
      note: {
        vi: "Chạy chếch qua thành bàng quang khoảng 2cm — đoạn trong thành bị ép khi bàng quang căng, tạo van chống trào ngược. Chỗ nối niệu quản–bàng quang là chỗ hẹp nhất, sỏi hay kẹt.",
        en: "Runs obliquely through the bladder wall for about 2cm — this intramural part is compressed when the bladder fills, acting as an anti-reflux valve. The vesicoureteric junction is the narrowest point, where stones often lodge.",
        zh: "斜穿膀胱壁约2cm——此壁内段在膀胱充盈时受压，起抗反流瓣膜作用。输尿管膀胱连接处最狭窄，结石常嵌顿于此。",
      },
      ids: byRe(/(left|right) ureter$/i),
    },
    {
      key: "nieu-dao",
      tint: "#e8883d",
      latin: "Urethra · Corpus spongiosum",
      name: { vi: "Niệu đạo và thể xốp", en: "Urethra and corpus spongiosum", zh: "尿道与尿道海绵体" },
      note: {
        vi: "Niệu đạo nam: đoạn tiền liệt, đoạn màng (qua đáy chậu — hẹp nhất, dễ rách khi vỡ khung chậu), đoạn xốp. Tổn thương niệu đạo màng: không được đặt thông tiểu mù.",
        en: "The male urethra has prostatic, membranous (through the pelvic floor — the narrowest, torn in pelvic fractures) and spongy parts. With a membranous urethral injury, a blind catheter must not be passed.",
        zh: "男性尿道分前列腺部、膜部（穿盆底——最狭窄，骨盆骨折时易撕裂）和海绵体部。膜部尿道损伤时不可盲目插导尿管。",
      },
      ids: byName("Urethra", "Corpus spongiosum of penis"),
    },
    {
      key: "day-chau",
      tint: "#c05245",
      latin: "M. levator ani",
      name: { vi: "Cơ nâng hậu môn", en: "Levator ani", zh: "肛提肌" },
      note: {
        vi: "Đỡ đáy bàng quang và tiền liệt. Bó mu-cụt ôm hai bên tiền liệt (cơ nâng tiền liệt) — tập cơ đáy chậu giúp hồi phục kiểm soát tiểu sau mổ cắt tiền liệt.",
        en: "Supports the bladder base and prostate. Pubococcygeus flanks the prostate (levator prostatae) — pelvic floor training helps recover continence after prostatectomy.",
        zh: "承托膀胱底和前列腺。耻尾肌夹持前列腺两侧（前列腺提肌）——盆底肌训练有助于前列腺切除术后恢复控尿。",
      },
      ids: byRe(/pubococcygeus$|puborectalis$|iliococcygeus$/i, ["muscular"]),
    },
    {
      key: "moc",
      latin: "Os coxae · Rectum",
      name: { vi: "Xương chậu và trực tràng (mốc)", en: "Hip bones and rectum (landmarks)", zh: "髋骨与直肠（标志）" },
      note: {
        vi: "Khớp mu ở trước, trực tràng ở sau — mờ sẵn để thấy quan hệ trước–sau của bàng quang, tiền liệt, túi tinh.",
        en: "The pubic symphysis in front, the rectum behind — faded to show the front-to-back relations of bladder, prostate and seminal vesicles.",
        zh: "前方为耻骨联合，后方为直肠——淡化以显示膀胱、前列腺、精囊的前后关系。",
      },
      ids: byRe(/hip bone$/i, ["skeletal"]).concat(byName("Rectum")),
    },
  ],
});
