/**
 * Scene "Bàng quang và tiền liệt tuyến" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-bladder-prostate.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const bladderProstateScene: AtlasSceneDef = {
  "slug": "bang-quang-tien-liet",
  "title": {
    "vi": "Bàng quang và tiền liệt tuyến",
    "en": "Bladder and Prostate",
    "zh": "膀胱与前列腺"
  },
  "latin": "Vesica urinaria · Prostata",
  "intro": {
    "vi": "Ở nam, tiền liệt ôm lấy niệu đạo ngay dưới cổ bàng quang; túi tinh và bóng ống dẫn tinh nằm sau đáy bàng quang, trước trực tràng. Vì vậy tiền liệt to lên chèn niệu đạo gây tiểu khó, và sờ được qua thăm trực tràng. Niệu quản đi vào đáy bàng quang, bị ống dẫn tinh bắt chéo phía trên. Mỗi cơ quan một màu; xương chậu và trực tràng mờ sẵn.",
    "en": "In men the prostate wraps the urethra just below the bladder neck; the seminal vesicles and ampullae of the vas lie behind the bladder base, in front of the rectum. That is why an enlarged prostate squeezes the urethra and makes voiding difficult, and why it can be felt on rectal examination. The ureters enter the bladder base, crossed from above by the vas. Each organ has its own colour; the pelvis and rectum are faded.",
    "zh": "男性前列腺环抱膀胱颈下方的尿道；精囊和输精管壶腹位于膀胱底后方、直肠前方。因此前列腺增大压迫尿道致排尿困难，且可经直肠指检触及。输尿管进入膀胱底，其上方有输精管跨过。各器官以不同颜色显示；骨盆和直肠淡化。"
  },
  "frameGroups": [
    "bang-quang",
    "tien-liet",
    "tui-tinh",
    "ong-dan-tinh",
    "nieu-dao",
    "day-chau"
  ],
  "fadedGroups": [
    "moc"
  ],
  "groups": [
    {
      "key": "bang-quang",
      "name": {
        "vi": "Bàng quang",
        "en": "Urinary bladder",
        "zh": "膀胱"
      },
      "latin": "Vesica urinaria",
      "note": {
        "vi": "Đỉnh, thân, đáy và cổ bàng quang. Mặt trên phủ phúc mạc; khi đầy bàng quang nâng phúc mạc lên khỏi khớp mu, tạo \"cửa sổ\" để chọc trên xương mu. Vỡ bàng quang ngoài phúc mạc hay đi kèm gãy khung chậu.",
        "en": "Apex, body, fundus and neck. Its upper surface is covered by peritoneum; when full it lifts the peritoneum off the pubis, opening a \"window\" for suprapubic puncture. Extraperitoneal bladder rupture often accompanies a pelvic fracture.",
        "zh": "分尖、体、底、颈。上面覆有腹膜；充盈时将腹膜抬离耻骨，形成耻骨上穿刺的“窗口”。腹膜外膀胱破裂常伴骨盆骨折。"
      },
      "tint": "#c9a06a",
      "parts": [
        "FJ3149"
      ]
    },
    {
      "key": "tien-liet",
      "name": {
        "vi": "Tuyến tiền liệt",
        "en": "Prostate",
        "zh": "前列腺"
      },
      "latin": "Prostata",
      "note": {
        "vi": "Kích thước bằng quả óc chó, gồm vùng chuyển tiếp (quanh niệu đạo — nơi phì đại lành tính), vùng trung tâm và vùng ngoại vi (phía sau — nơi 70% ung thư). Tiết khoảng 30% tinh dịch và PSA.",
        "en": "Walnut-sized, with a transition zone (around the urethra — where benign hyperplasia arises), a central zone and a peripheral zone (posterior — where 70% of cancers arise). It makes about 30% of the semen and secretes PSA.",
        "zh": "核桃大小，分移行带（环绕尿道——良性增生好发处）、中央带和外周带（后部——70%的癌发生于此）。分泌约30%的精液及PSA。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ3139"
      ]
    },
    {
      "key": "tui-tinh",
      "name": {
        "vi": "Túi tinh",
        "en": "Seminal vesicles",
        "zh": "精囊"
      },
      "latin": "Glandulae vesiculosae",
      "note": {
        "vi": "Hai túi cuộn ở sau-dưới bàng quang, ngoài bóng ống dẫn tinh. Ung thư tiền liệt xâm lấn túi tinh là giai đoạn T3b — tiên lượng xấu hơn.",
        "en": "Two coiled sacs behind and below the bladder, lateral to the ampullae. Prostate cancer invading them is stage T3b — a worse prognosis.",
        "zh": "膀胱后下方的两个盘曲囊状腺体，位于输精管壶腹外侧。前列腺癌侵犯精囊为T3b期——预后较差。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ3137",
        "FJ3143"
      ]
    },
    {
      "key": "ong-dan-tinh",
      "name": {
        "vi": "Ống dẫn tinh",
        "en": "Ductus deferens",
        "zh": "输精管"
      },
      "latin": "Ductus deferentes",
      "note": {
        "vi": "Từ lỗ bẹn sâu đi dọc thành chậu, bắt chéo TRÊN niệu quản rồi phình thành bóng sau bàng quang, hợp ống túi tinh thành ống phóng tinh xuyên tiền liệt.",
        "en": "From the deep inguinal ring along the pelvic wall, it crosses ABOVE the ureter, widens into the ampulla behind the bladder and joins the seminal vesicle duct to form the ejaculatory duct through the prostate.",
        "zh": "自腹股沟管深环沿盆壁走行，于输尿管上方跨过，在膀胱后方膨大为壶腹，与精囊排泄管汇合成射精管穿过前列腺。"
      },
      "tint": "#e0c78c",
      "parts": [
        "FJ3135",
        "FJ3140"
      ]
    },
    {
      "key": "nieu-quan",
      "name": {
        "vi": "Niệu quản (đoạn chậu)",
        "en": "Ureters (pelvic part)",
        "zh": "输尿管（盆段）"
      },
      "latin": "Ureteres",
      "note": {
        "vi": "Chạy chếch qua thành bàng quang khoảng 2cm — đoạn trong thành bị ép khi bàng quang căng, tạo van chống trào ngược. Chỗ nối niệu quản–bàng quang là chỗ hẹp nhất, sỏi hay kẹt.",
        "en": "Runs obliquely through the bladder wall for about 2cm — this intramural part is compressed when the bladder fills, acting as an anti-reflux valve. The vesicoureteric junction is the narrowest point, where stones often lodge.",
        "zh": "斜穿膀胱壁约2cm——此壁内段在膀胱充盈时受压，起抗反流瓣膜作用。输尿管膀胱连接处最狭窄，结石常嵌顿于此。"
      },
      "tint": "#d9b25a",
      "parts": [
        "FJ3144",
        "FJ3146"
      ]
    },
    {
      "key": "nieu-dao",
      "name": {
        "vi": "Niệu đạo và thể xốp",
        "en": "Urethra and corpus spongiosum",
        "zh": "尿道与尿道海绵体"
      },
      "latin": "Urethra · Corpus spongiosum",
      "note": {
        "vi": "Niệu đạo nam: đoạn tiền liệt, đoạn màng (qua đáy chậu — hẹp nhất, dễ rách khi vỡ khung chậu), đoạn xốp. Tổn thương niệu đạo màng: không được đặt thông tiểu mù.",
        "en": "The male urethra has prostatic, membranous (through the pelvic floor — the narrowest, torn in pelvic fractures) and spongy parts. With a membranous urethral injury, a blind catheter must not be passed.",
        "zh": "男性尿道分前列腺部、膜部（穿盆底——最狭窄，骨盆骨折时易撕裂）和海绵体部。膜部尿道损伤时不可盲目插导尿管。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3133",
        "FJ3148"
      ]
    },
    {
      "key": "day-chau",
      "name": {
        "vi": "Cơ nâng hậu môn",
        "en": "Levator ani",
        "zh": "肛提肌"
      },
      "latin": "M. levator ani",
      "note": {
        "vi": "Đỡ đáy bàng quang và tiền liệt. Bó mu-cụt ôm hai bên tiền liệt (cơ nâng tiền liệt) — tập cơ đáy chậu giúp hồi phục kiểm soát tiểu sau mổ cắt tiền liệt.",
        "en": "Supports the bladder base and prostate. Pubococcygeus flanks the prostate (levator prostatae) — pelvic floor training helps recover continence after prostatectomy.",
        "zh": "承托膀胱底和前列腺。耻尾肌夹持前列腺两侧（前列腺提肌）——盆底肌训练有助于前列腺切除术后恢复控尿。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2544",
        "FJ2545",
        "FJ2546",
        "FJ2549",
        "FJ2550",
        "FJ2551"
      ]
    },
    {
      "key": "moc",
      "name": {
        "vi": "Xương chậu và trực tràng (mốc)",
        "en": "Hip bones and rectum (landmarks)",
        "zh": "髋骨与直肠（标志）"
      },
      "latin": "Os coxae · Rectum",
      "note": {
        "vi": "Khớp mu ở trước, trực tràng ở sau — mờ sẵn để thấy quan hệ trước–sau của bàng quang, tiền liệt, túi tinh.",
        "en": "The pubic symphysis in front, the rectum behind — faded to show the front-to-back relations of bladder, prostate and seminal vesicles.",
        "zh": "前方为耻骨联合，后方为直肠——淡化以显示膀胱、前列腺、精囊的前后关系。"
      },
      "parts": [
        "FJ3152",
        "FJ3288",
        "FJ2571"
      ]
    }
  ]
};
