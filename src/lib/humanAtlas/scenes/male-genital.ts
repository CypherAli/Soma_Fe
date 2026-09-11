/**
 * Scene "Cơ quan sinh dục nam" — cùng nhóm với scene he-sinh-san-nam.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-male-genital.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const maleGenitalScene: AtlasSceneDef = {
  "slug": "co-quan-sinh-duc-nam",
  "title": {
    "vi": "Cơ quan sinh dục nam",
    "en": "Male Genital Organs",
    "zh": "男性生殖器官"
  },
  "latin": "Organa genitalia masculina",
  "intro": {
    "vi": "Cơ quan sinh dục trong (tinh hoàn, mào tinh, ống dẫn tinh, túi tinh, tiền liệt) tạo và dẫn tinh trùng; cơ quan sinh dục ngoài (dương vật với hai thể hang, thể xốp và quy đầu) là cơ quan giao hợp và đường ra chung của nước tiểu và tinh dịch. Mỗi cơ quan một màu; bàng quang và niệu đạo để làm mốc. Bộ dữ liệu không có ống phóng tinh tách riêng.",
    "en": "The internal genital organs (testis, epididymis, ductus deferens, seminal vesicle, prostate) make and carry sperm; the external organ (the penis with its two corpora cavernosa, corpus spongiosum and glans) is the organ of copulation and the shared outlet for urine and semen. Each organ has its own colour; the bladder and urethra are landmarks. The dataset has no separate ejaculatory duct.",
    "zh": "内生殖器（睾丸、附睾、输精管、精囊、前列腺）产生并输送精子；外生殖器（阴茎，含两条阴茎海绵体、尿道海绵体及阴茎头）为交接器官，也是尿液和精液的共同出口。各器官以不同颜色显示；膀胱和尿道作为标志。数据集中无单独的射精管。"
  },
  "groups": [
    {
      "key": "tinh-hoan",
      "name": {
        "vi": "Tinh hoàn",
        "en": "Testes",
        "zh": "睾丸"
      },
      "latin": "Testis",
      "note": {
        "vi": "Sinh tinh trùng và testosteron. Xuống bìu qua ống bẹn trước khi sinh; tinh hoàn ẩn không xuống tăng nguy cơ ung thư và vô sinh. Dẫn lưu bạch huyết về hạch cạnh động mạch chủ (theo đường đi xuống của nó), không về hạch bẹn.",
        "en": "Produce sperm and testosterone. They descend through the inguinal canal into the scrotum before birth; an undescended testis carries a higher risk of cancer and infertility. Lymph drains to the para-aortic nodes (following its line of descent), not to the inguinal nodes.",
        "zh": "产生精子和睾酮。出生前经腹股沟管下降入阴囊；隐睾增加癌变和不育风险。淋巴引流至腹主动脉旁淋巴结（沿其下降路径），而非腹股沟淋巴结。"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ3138",
        "FJ3142"
      ]
    },
    {
      "key": "mao-tinh",
      "name": {
        "vi": "Mào tinh",
        "en": "Epididymis",
        "zh": "附睾"
      },
      "latin": "Epididymis",
      "note": {
        "vi": "Ống cuộn dài khoảng 6m ép gọn ở bờ sau tinh hoàn; tinh trùng mất 2–3 tuần đi qua đây để trưởng thành và có khả năng di động.",
        "en": "A coiled tube about 6m long packed along the back of the testis; sperm take 2–3 weeks to pass through it, maturing and gaining motility.",
        "zh": "长约6m的盘曲管道，紧贴睾丸后缘；精子需2–3周通过此处，逐渐成熟并获得运动能力。"
      },
      "tint": "#d9a066",
      "parts": [
        "FJ3136",
        "FJ3141"
      ]
    },
    {
      "key": "ong-dan-tinh",
      "name": {
        "vi": "Ống dẫn tinh",
        "en": "Ductus deferens",
        "zh": "输精管"
      },
      "latin": "Ductus deferens",
      "note": {
        "vi": "Ống cơ thành dày, sờ thấy như sợi dây cứng trong thừng tinh — chỗ thắt khi triệt sản nam. Đi qua ống bẹn, bắt chéo TRÊN niệu quản (\"nước chảy dưới cầu\") rồi phình thành bóng ống dẫn tinh sau bàng quang.",
        "en": "A thick-walled muscular tube felt as a firm cord in the spermatic cord — where it is cut in vasectomy. It passes through the inguinal canal and crosses ABOVE the ureter (\"water under the bridge\") before widening into the ampulla behind the bladder.",
        "zh": "厚壁肌性管道，在精索中可触及为硬索——即输精管结扎处。穿过腹股沟管，于输尿管上方跨过（“桥下流水”），在膀胱后方膨大为输精管壶腹。"
      },
      "tint": "#e0c78c",
      "parts": [
        "FJ3135",
        "FJ3140"
      ]
    },
    {
      "key": "tui-tinh",
      "name": {
        "vi": "Túi tinh",
        "en": "Seminal vesicles",
        "zh": "精囊"
      },
      "latin": "Glandula vesiculosa",
      "note": {
        "vi": "Hai tuyến nằm sau đáy bàng quang, tiết khoảng 70% thể tích tinh dịch, giàu fructose nuôi tinh trùng. Ống túi tinh hợp với bóng ống dẫn tinh thành ống phóng tinh xuyên qua tiền liệt.",
        "en": "Two glands behind the base of the bladder that secrete about 70% of the semen volume, rich in fructose to fuel sperm. Each duct joins the ampulla of the ductus deferens to form the ejaculatory duct, which runs through the prostate.",
        "zh": "位于膀胱底后方的两个腺体，分泌约70%的精液量，富含果糖为精子供能。其排泄管与输精管壶腹汇合成射精管，穿过前列腺。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ3137",
        "FJ3143"
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
        "vi": "Ôm quanh đoạn đầu niệu đạo dưới cổ bàng quang. Phì đại lành tính (vùng chuyển tiếp) bóp niệu đạo gây tiểu khó; ung thư thường ở vùng ngoại vi phía sau — sờ được qua thăm trực tràng.",
        "en": "Wraps the first part of the urethra below the bladder neck. Benign hyperplasia (in the transition zone) squeezes the urethra and causes difficulty voiding; cancer usually arises in the posterior peripheral zone — palpable on rectal examination.",
        "zh": "环绕膀胱颈下方的尿道起始段。良性增生（移行带）压迫尿道致排尿困难；癌多发生于后方外周带——直肠指检可触及。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ3139"
      ]
    },
    {
      "key": "duong-vat",
      "name": {
        "vi": "Thể hang, thể xốp và quy đầu",
        "en": "Corpora cavernosa, corpus spongiosum and glans",
        "zh": "阴茎海绵体、尿道海绵体与阴茎头"
      },
      "latin": "Corpora cavernosa · Corpus spongiosum",
      "note": {
        "vi": "Hai thể hang ở trên cương cứng khi máu dồn vào và tĩnh mạch bị ép; thể xốp ở dưới bọc niệu đạo, loe ra thành quy đầu, cương mềm hơn để niệu đạo không bị bịt khi xuất tinh.",
        "en": "The two corpora cavernosa on top become rigid when blood fills them and the veins are compressed; the corpus spongiosum below surrounds the urethra and expands into the glans, staying softer so the urethra is not closed during ejaculation.",
        "zh": "上方两条阴茎海绵体在血液充盈、静脉受压时变硬勃起；下方尿道海绵体包绕尿道并膨大为阴茎头，勃起时较软，以免射精时尿道被阻塞。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ3132",
        "FJ3133",
        "FJ3134"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Mạch tinh hoàn và lưng dương vật",
        "en": "Testicular and dorsal penile vessels",
        "zh": "睾丸血管与阴茎背血管"
      },
      "latin": "Vasa testicularia · Vasa dorsalia penis",
      "note": {
        "vi": "Động mạch tinh hoàn tách từ động mạch chủ ngang L2 — do tinh hoàn có nguồn gốc ở thắt lưng. Đám rối tĩnh mạch hình dây leo quanh động mạch làm mát máu đến; giãn đám rối (thường bên trái) là giãn tĩnh mạch thừng tinh.",
        "en": "The testicular artery arises from the aorta at L2 — because the testis originates in the lumbar region. The pampiniform venous plexus around the artery cools incoming blood; its dilation (usually on the left) is a varicocele.",
        "zh": "睾丸动脉于L2平面发自腹主动脉——因睾丸起源于腰部。环绕动脉的蔓状静脉丛可冷却流入的血液；其扩张（多见于左侧）即精索静脉曲张。"
      },
      "tint": "#e07a6a",
      "parts": [
        "FJ2056",
        "FJ2208",
        "FJ3426",
        "FJ3496",
        "FJ3497",
        "FJ3532",
        "FJ3533",
        "FJ3592",
        "FJ3593",
        "FJ3617",
        "FJ3618",
        "FJ3637"
      ]
    },
    {
      "key": "moc",
      "name": {
        "vi": "Bàng quang và niệu đạo (mốc)",
        "en": "Bladder and urethra (landmarks)",
        "zh": "膀胱与尿道（标志）"
      },
      "latin": "Vesica urinaria · Urethra",
      "note": {
        "vi": "Mốc để thấy túi tinh và bóng ống dẫn tinh nằm sau đáy bàng quang, tiền liệt nằm dưới cổ bàng quang.",
        "en": "Landmarks showing the seminal vesicles and ampulla behind the bladder base, and the prostate below the bladder neck.",
        "zh": "定位标志：精囊和输精管壶腹位于膀胱底后方，前列腺位于膀胱颈下方。"
      },
      "parts": [
        "FJ3148",
        "FJ3149"
      ]
    }
  ]
};
