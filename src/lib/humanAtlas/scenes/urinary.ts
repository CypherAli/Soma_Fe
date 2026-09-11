/**
 * Scene "Hệ tiết niệu" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có bể thận tách riêng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-urinary.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const urinaryScene: AtlasSceneDef = {
  "slug": "he-tiet-nieu",
  "title": {
    "vi": "Hệ tiết niệu",
    "en": "The Urinary System",
    "zh": "泌尿系统"
  },
  "latin": "Systema urinarium",
  "intro": {
    "vi": "Hai thận lọc khoảng 180 lít máu mỗi ngày, tạo 1–2 lít nước tiểu, đổ qua hai niệu quản xuống bàng quang rồi ra ngoài qua niệu đạo. Thận nằm sau phúc mạc ngang T12–L3, thận phải thấp hơn thận trái vì gan đè lên. Niệu quản có ba chỗ hẹp sinh lý — nơi sỏi hay kẹt. Mỗi cơ quan một màu; tuyến thượng thận úp trên cực trên thận nhưng thuộc hệ nội tiết.",
    "en": "The two kidneys filter about 180 litres of blood a day to make 1–2 litres of urine, which runs down the two ureters to the bladder and out through the urethra. The kidneys lie retroperitoneally at T12–L3, the right lower than the left because the liver sits on it. Each ureter has three physiological narrowings — where stones lodge. Each organ has its own colour; the adrenal glands cap the upper poles but belong to the endocrine system.",
    "zh": "两肾每天滤过约180升血液，生成1–2升尿液，经两条输尿管流入膀胱，再经尿道排出。肾位于腹膜后T12–L3水平，右肾因肝脏压迫而低于左肾。输尿管有三处生理性狭窄——结石易嵌顿于此。各器官以不同颜色显示；肾上腺覆于肾上极，但属于内分泌系统。"
  },
  "groups": [
    {
      "key": "than",
      "name": {
        "vi": "Thận",
        "en": "Kidneys",
        "zh": "肾"
      },
      "latin": "Ren",
      "note": {
        "vi": "Mỗi thận chứa khoảng một triệu đơn vị thận (nephron). Rốn thận quay vào trong, từ trước ra sau: tĩnh mạch, động mạch, bể thận. Thận phải thấp hơn trái khoảng 1–2cm. (Trong dữ liệu này bể thận và đài thận nằm lẫn trong khối thận, không tách riêng — bật mặt cắt để thấy khoang bên trong.)",
        "en": "Each kidney holds about a million nephrons. The hilum faces medially, containing from front to back: vein, artery, pelvis. The right kidney sits 1–2cm lower than the left. (In this dataset the renal pelvis and calyces are part of the kidney mesh, not separate — use the cross-section to look inside.)",
        "zh": "每侧肾约含一百万个肾单位。肾门朝向内侧，自前向后依次为：静脉、动脉、肾盂。右肾比左肾低1–2cm。（本数据集中肾盂和肾盏包含在肾网格内，未单独分出——开启切面可查看内部。）"
      },
      "tint": "#9a4e3e",
      "parts": [
        "FJ3145",
        "FJ3147"
      ]
    },
    {
      "key": "nieu-quan",
      "name": {
        "vi": "Niệu quản",
        "en": "Ureters",
        "zh": "输尿管"
      },
      "latin": "Ureter",
      "note": {
        "vi": "Ống cơ dài khoảng 25cm, đẩy nước tiểu bằng nhu động. Ba chỗ hẹp: khúc nối bể thận–niệu quản, chỗ bắt chéo động mạch chậu ở bờ chậu hông, và đoạn xuyên thành bàng quang. Sỏi kẹt ở đây gây cơn đau quặn lan xuống bẹn.",
        "en": "A muscular tube about 25cm long that moves urine by peristalsis. Three narrowings: the pelviureteric junction, where it crosses the iliac vessels at the pelvic brim, and its passage through the bladder wall. A stone stuck here causes colic radiating to the groin.",
        "zh": "长约25cm的肌性管道，借蠕动输送尿液。三处狭窄：肾盂输尿管连接处、越过骨盆缘髂血管处、穿膀胱壁段。结石嵌顿于此引起放射至腹股沟的绞痛。"
      },
      "tint": "#d9b25a",
      "parts": [
        "FJ3144",
        "FJ3146"
      ]
    },
    {
      "key": "bang-quang",
      "name": {
        "vi": "Bàng quang",
        "en": "Urinary bladder",
        "zh": "膀胱"
      },
      "latin": "Vesica urinaria",
      "note": {
        "vi": "Túi cơ chứa 400–600ml, nằm sau khớp mu. Khi đầy nó nhô lên trên khớp mu vào thành bụng trước — nên có thể chọc hút bàng quang trên xương mu mà không vào phúc mạc. Tam giác bàng quang (giữa hai lỗ niệu quản và lỗ niệu đạo) nhẵn, không có nếp.",
        "en": "A muscular sac holding 400–600ml behind the pubic symphysis. When full it rises above the pubis against the anterior abdominal wall — so suprapubic aspiration can enter it without crossing the peritoneum. The trigone (between the two ureteric openings and the urethral opening) is smooth, without folds.",
        "zh": "容量400–600ml的肌性囊，位于耻骨联合后方。充盈时上升至耻骨上方，贴近腹前壁——因此可经耻骨上穿刺而不经腹膜腔。膀胱三角（两输尿管口与尿道内口之间）光滑无皱襞。"
      },
      "tint": "#c9a06a",
      "parts": [
        "FJ3149"
      ]
    },
    {
      "key": "nieu-dao",
      "name": {
        "vi": "Niệu đạo (nam)",
        "en": "Urethra (male)",
        "zh": "尿道（男性）"
      },
      "latin": "Urethra masculina",
      "note": {
        "vi": "Niệu đạo nam dài khoảng 20cm, qua tuyến tiền liệt, hoành niệu dục rồi dương vật — dài và cong nên đặt thông tiểu ở nam khó hơn nữ. Tuyến tiền liệt phì đại bóp đoạn tiền liệt gây tiểu khó ở người già. (Atlas chỉ có cơ thể nam.)",
        "en": "The male urethra is about 20cm long, passing through the prostate, the urogenital diaphragm and the penis — long and curved, which makes catheterising men harder than women. An enlarged prostate squeezes the prostatic part and causes difficulty voiding in older men. (The atlas is a male body only.)",
        "zh": "男性尿道长约20cm，依次穿过前列腺、尿生殖膈和阴茎——长而弯曲，故男性导尿比女性困难。前列腺增生压迫前列腺部，引起老年男性排尿困难。（图谱仅有男性身体。）"
      },
      "tint": "#e0c78c",
      "parts": [
        "FJ3148"
      ]
    },
    {
      "key": "thuong-than",
      "name": {
        "vi": "Tuyến thượng thận",
        "en": "Adrenal glands",
        "zh": "肾上腺"
      },
      "latin": "Glandula suprarenalis",
      "note": {
        "vi": "Úp trên cực trên hai thận, trong cùng bao mỡ nhưng tách bằng vách mạc — nên thận sa xuống không kéo theo tuyến. Bên phải hình tháp, bên trái hình bán nguyệt. Vỏ tiết cortisol, aldosteron; tuỷ tiết adrenalin.",
        "en": "Sit on the upper poles of the kidneys, inside the same fat capsule but separated by a fascial septum — so a dropped kidney does not drag the gland with it. The right is pyramidal, the left crescent-shaped. The cortex secretes cortisol and aldosterone; the medulla secretes adrenaline.",
        "zh": "覆于两肾上极，与肾同在脂肪囊内但有筋膜隔分开——故肾下垂时不牵拉肾上腺。右侧呈三角形，左侧呈半月形。皮质分泌皮质醇和醛固酮；髓质分泌肾上腺素。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ3129",
        "FJ3130"
      ]
    },
    {
      "key": "dm-than",
      "name": {
        "vi": "Động mạch thận",
        "en": "Renal arteries",
        "zh": "肾动脉"
      },
      "latin": "Aa. renales",
      "note": {
        "vi": "Nhận khoảng 20% cung lượng tim. Chia nhánh trước và sau trong xoang thận, rồi thành các động mạch phân thuỳ — động mạch tận, nên tắc một nhánh gây nhồi máu một vùng. Hẹp động mạch thận gây tăng huyết áp qua hệ renin.",
        "en": "Receive about 20% of cardiac output. They divide into anterior and posterior divisions in the renal sinus, then into segmental arteries — end arteries, so blocking one infarcts a segment. Renal artery stenosis causes hypertension through the renin system.",
        "zh": "接受约20%的心输出量。在肾窦内分为前、后支，再分为段动脉——为终末动脉，一支阻塞即致相应肾段梗死。肾动脉狭窄通过肾素系统引起高血压。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2042",
        "FJ2043",
        "FJ2045",
        "FJ2049",
        "FJ2052",
        "FJ2053",
        "FJ2054",
        "FJ3458",
        "FJ3459",
        "FJ3460",
        "FJ3461",
        "FJ3462",
        "FJ3463",
        "FJ3473",
        "FJ3474",
        "FJ3475",
        "FJ3476",
        "FJ3481",
        "FJ3558",
        "FJ3559",
        "FJ3560",
        "FJ3561",
        "FJ3562",
        "FJ3563",
        "FJ3573",
        "FJ3574",
        "FJ3575",
        "FJ3576",
        "FJ3581",
        "FJ3582"
      ]
    },
    {
      "key": "tm-than",
      "name": {
        "vi": "Tĩnh mạch thận",
        "en": "Renal veins",
        "zh": "肾静脉"
      },
      "latin": "Vv. renales",
      "note": {
        "vi": "Tĩnh mạch thận trái dài hơn, bắt chéo trước động mạch chủ và nhận tĩnh mạch sinh dục trái — nên u thận trái có thể gây giãn tĩnh mạch thừng tinh trái đột ngột.",
        "en": "The left renal vein is longer, crosses in front of the aorta and receives the left gonadal vein — so a left kidney tumour can cause a sudden left varicocele.",
        "zh": "左肾静脉较长，跨腹主动脉前方并接受左生殖腺静脉——故左肾肿瘤可引起突发的左侧精索静脉曲张。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3477",
        "FJ3478",
        "FJ3480",
        "FJ3577",
        "FJ3578",
        "FJ3580"
      ]
    },
    {
      "key": "mach-lon",
      "name": {
        "vi": "Động mạch chủ bụng và tĩnh mạch chủ dưới (mốc)",
        "en": "Abdominal aorta and IVC (landmarks)",
        "zh": "腹主动脉与下腔静脉（标志）"
      },
      "latin": "Aorta · V. cava inferior",
      "note": {
        "vi": "Mốc định vị: động mạch chủ bên trái, tĩnh mạch chủ dưới bên phải — giải thích vì sao động mạch thận phải và tĩnh mạch thận trái dài hơn bên kia.",
        "en": "Landmarks: the aorta on the left, the IVC on the right — which explains why the right renal artery and left renal vein are the longer ones.",
        "zh": "定位标志：主动脉在左、下腔静脉在右——这解释了为何右肾动脉和左肾静脉较长。"
      },
      "parts": [
        "FJ1932",
        "FJ3441",
        "FJ3659"
      ]
    }
  ]
};
