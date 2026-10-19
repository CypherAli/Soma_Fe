
import { bindContentSource } from "@/lib/content/source";
import type { SceneModule } from "./types";

/**
 * Hệ sinh sản — 1 scene (nam).
 *
 * GIỚI HẠN DỮ LIỆU QUAN TRỌNG: cả Z-Anatomy lẫn BodyParts3D đều dựng trên cơ
 * thể NAM, nên không có bất kỳ mesh nào cho buồng trứng, tử cung, vòi tử
 * cung, âm đạo hay cổ tử cung. Đã tra cả hai bảng tra của BodyParts3D
 * (partof + isa) và toàn bộ object trong Z-Anatomy, kết quả bằng không.
 * Vì vậy dự án CHƯA có scene sinh sản nữ — đây là thiếu dữ liệu nguồn, không
 * phải bỏ sót khi dựng.
 */
export const reproductiveScenes: Record<string, SceneModule> = bindContentSource("data:src/lib/scenes/reproductive.ts#reproductiveScenes", {
  "he-sinh-san-nam": {
    slug: "he-sinh-san-nam",
    title: {
      vi: "Hệ sinh sản nam",
      en: "Male Reproductive System",
      zh: "男性生殖系统",
    },
    description: {
      vi: "Đường đi của tinh trùng từ tinh hoàn ra ngoài: tinh hoàn sinh tinh, mào tinh lưu trữ và làm trưởng thành, ống dẫn tinh vận chuyển lên chậu hông, túi tinh và tuyến tiền liệt góp dịch tạo thành tinh dịch, rồi niệu đạo dẫn ra qua dương vật. Bàng quang được giữ lại làm mốc định vị vì tuyến tiền liệt nằm ngay dưới cổ bàng quang — vị trí giải thích vì sao tuyến này phì đại thì gây bí tiểu.",
      en: "The path of sperm from testis to exterior: the testis produces sperm, the epididymis stores and matures it, the ductus deferens carries it up into the pelvis, the seminal gland and prostate add secretions to form semen, and the urethra conveys it out through the penis. The urinary bladder is kept as a landmark because the prostate sits directly beneath the bladder neck — the relationship that explains urinary obstruction when the gland enlarges.",
      zh: "精子自睾丸至体外的通路：睾丸产生精子，附睾贮存并使其成熟，输精管将其输送入盆腔，精囊与前列腺分泌液体形成精液，最后经尿道通过阴茎排出。保留膀胱作为定位标志，因前列腺紧位于膀胱颈下方——这一关系解释了腺体增生时为何引起排尿困难。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/male_reproductive.glb",
    hotspots: [
      {
        key: "testis",
        meshName: "Testis.l",
        offset: [-150, 90],
        label: { vi: "Tinh hoàn", en: "Testis", zh: "睾丸" },
        latinName: "Testis",
        note: {
          vi: "Tuyến sinh dục nam, vừa sinh tinh trùng trong các ống sinh tinh vừa tiết testosterone từ tế bào Leydig. Nằm ngoài ổ bụng trong bìu vì quá trình sinh tinh cần nhiệt độ thấp hơn thân nhiệt khoảng 2-3°C.",
          en: "The male gonad, producing sperm in the seminiferous tubules and secreting testosterone from Leydig cells. It lies outside the abdomen in the scrotum because spermatogenesis requires a temperature about 2-3°C below core body temperature.",
          zh: "男性性腺，在生精小管内产生精子，并由间质细胞分泌睾酮。位于腹腔外的阴囊内，因生精过程需低于体核温度约2-3°C。",
        },
      },
      {
        key: "epididymis",
        meshName: "Epididymis.l",
        offset: [-170, 30],
        label: { vi: "Mào tinh", en: "Epididymis", zh: "附睾" },
        latinName: "Epididymis",
        note: {
          vi: "Ống cuộn dài áp sát mặt sau tinh hoàn, nơi tinh trùng hoàn thiện khả năng di động và được lưu trữ. Nếu duỗi thẳng, ống này dài khoảng 6 mét.",
          en: "A long coiled duct applied to the posterior testis where sperm acquire motility and are stored. Uncoiled, the duct measures roughly 6 metres.",
          zh: "紧贴睾丸后方的长盘曲管道，精子在此获得运动能力并被贮存。若拉直，全长约6米。",
        },
      },
      {
        key: "ductus-deferens",
        meshName: "Ductus deferens.l",
        offset: [160, -10],
        label: { vi: "Ống dẫn tinh", en: "Ductus deferens", zh: "输精管" },
        latinName: "Ductus deferens",
        note: {
          vi: "Ống cơ dày thành dẫn tinh trùng từ mào tinh, đi trong thừng tinh qua ống bẹn vào chậu hông rồi đổ vào ống phóng tinh. Đây chính là ống được cắt và thắt trong thủ thuật triệt sản nam.",
          en: "A thick-walled muscular tube conveying sperm from the epididymis, running in the spermatic cord through the inguinal canal into the pelvis to join the ejaculatory duct. This is the duct divided and ligated in vasectomy.",
          zh: "管壁厚的肌性管道，将精子自附睾输送，经精索穿腹股沟管入盆腔，汇入射精管。此即输精管结扎术所切断结扎的管道。",
        },
      },
      {
        key: "seminal-gland",
        meshName: "Seminal gland.l",
        offset: [150, 60],
        label: { vi: "Túi tinh", en: "Seminal gland", zh: "精囊" },
        latinName: "Glandula vesiculosa",
        note: {
          vi: "Tuyến cuộn nằm sau bàng quang, tiết dịch kiềm giàu fructose cung cấp năng lượng cho tinh trùng. Dịch túi tinh chiếm phần lớn thể tích tinh dịch.",
          en: "A coiled gland behind the bladder secreting alkaline, fructose-rich fluid that fuels sperm. Seminal gland secretion makes up the greater part of semen volume.",
          zh: "位于膀胱后方的盘曲腺体，分泌富含果糖的碱性液体为精子供能。精囊分泌液占精液容积的大部分。",
        },
      },
      {
        key: "prostate",
        meshName: "Prostate",
        offset: [0, 120],
        label: { vi: "Tuyến tiền liệt", en: "Prostate", zh: "前列腺" },
        latinName: "Prostata",
        note: {
          vi: "Tuyến bao quanh đoạn niệu đạo ngay dưới cổ bàng quang, tiết dịch loãng chứa men làm loãng tinh dịch sau xuất tinh. Vì niệu đạo xuyên qua giữa tuyến nên tăng sinh lành tính tuyến tiền liệt ở nam giới lớn tuổi gây tiểu khó, tiểu đêm.",
          en: "A gland encircling the urethra just below the bladder neck, secreting a thin fluid whose enzymes liquefy semen after ejaculation. Because the urethra passes through it, benign prostatic enlargement in older men causes hesitancy and nocturia.",
          zh: "环绕膀胱颈下方尿道的腺体，分泌含酶的稀薄液体，射精后使精液液化。因尿道穿经其中，老年男性良性前列腺增生可致排尿困难与夜尿。",
        },
      },
      {
        key: "corpus-cavernosum",
        meshName: "Corpus cavernosum of penis",
        offset: [-140, 160],
        label: { vi: "Thể hang", en: "Corpus cavernosum", zh: "阴茎海绵体" },
        latinName: "Corpus cavernosum penis",
        note: {
          vi: "Hai khối mô cương ở mặt lưng dương vật. Khi các xoang mạch trong đó giãn và chứa đầy máu, lớp bao trắng bên ngoài chèn ép tĩnh mạch dẫn lưu khiến máu bị giữ lại — cơ chế của hiện tượng cương.",
          en: "The two erectile bodies on the dorsal aspect of the penis. When their vascular spaces dilate and fill with blood, the surrounding tunica albuginea compresses the draining veins and traps the blood — the mechanism of erection.",
          zh: "阴茎背侧的两个勃起体。其血窦扩张充血时，外周白膜压迫回流静脉使血液滞留——即勃起机制。",
        },
      },
      {
        key: "corpus-spongiosum",
        meshName: "Corpus spongiosum of penis",
        offset: [150, 170],
        label: { vi: "Thể xốp", en: "Corpus spongiosum", zh: "尿道海绵体" },
        latinName: "Corpus spongiosum penis",
        note: {
          vi: "Khối mô cương ở mặt bụng bao quanh niệu đạo. Nó cương ít hơn thể hang, nhờ vậy niệu đạo không bị ép kín khi cương và tinh dịch vẫn đi qua được.",
          en: "The ventral erectile body surrounding the urethra. It becomes less rigid than the corpora cavernosa, so the urethra is not occluded during erection and semen can still pass.",
          zh: "位于腹侧、包绕尿道的勃起体。其硬度低于阴茎海绵体，故勃起时尿道不被压闭，精液仍可通过。",
        },
      },
      {
        key: "glans-penis",
        meshName: "Glans penis",
        offset: [140, 210],
        label: { vi: "Quy đầu", en: "Glans penis", zh: "阴茎头" },
        latinName: "Glans penis",
        note: {
          vi: "Phần tận cùng phình ra của thể xốp, có mật độ thần kinh cảm giác rất cao. Lỗ niệu đạo ngoài mở ở đỉnh quy đầu.",
          en: "The expanded distal end of the corpus spongiosum, densely supplied with sensory nerve endings. The external urethral orifice opens at its tip.",
          zh: "尿道海绵体末端的膨大部，感觉神经末梢密集。尿道外口开于其顶端。",
        },
      },
      {
        key: "bladder",
        meshName: "Urinary bladder",
        offset: [-40, -70],
        label: { vi: "Bàng quang (mốc định vị)", en: "Urinary bladder (landmark)", zh: "膀胱（定位标志）" },
        latinName: "Vesica urinaria",
        note: {
          vi: "Không thuộc hệ sinh sản, giữ lại để định vị: tuyến tiền liệt và túi tinh nằm ngay dưới và sau bàng quang. Ở nam giới niệu đạo là đường chung cho cả nước tiểu lẫn tinh dịch, nhưng hai dòng không bao giờ đi cùng lúc vì cổ bàng quang đóng khi xuất tinh.",
          en: "Not part of the reproductive system; retained as a landmark, since the prostate and seminal glands lie immediately below and behind it. In males the urethra is a shared channel for urine and semen, but the two never flow together because the bladder neck closes during ejaculation.",
          zh: "不属生殖系统，保留作定位之用，因前列腺与精囊紧位于其下方与后方。男性尿道为尿液与精液的共同通道，但两者不会同时通过，因射精时膀胱颈关闭。",
        },
      },
    ],
  },
});
