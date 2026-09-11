/**
 * Scene "Khoang sau phúc mạc" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu cơ vuông thắt lưng và mạc thận.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-retroperitoneum.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const retroperitoneumScene: AtlasSceneDef = {
  "slug": "khoang-sau-phuc-mac",
  "title": {
    "vi": "Khoang sau phúc mạc",
    "en": "The Retroperitoneum",
    "zh": "腹膜后隙"
  },
  "latin": "Spatium retroperitoneale",
  "intro": {
    "vi": "Nằm giữa phúc mạc thành sau và thành bụng sau. Tạng sau phúc mạc nhớ bằng mẹo SAD PUCKER: tuyến thượng thận, động mạch chủ/tĩnh mạch chủ, tá tràng (trừ hành), tuỵ (trừ đuôi), niệu quản, đại tràng lên và xuống, thận, thực quản, trực tràng. Chấn thương ở đây chảy máu âm thầm, khám bụng ít dấu hiệu. Tạng tô theo hệ; cột sống mờ sẵn. Bộ dữ liệu không có cơ vuông thắt lưng.",
    "en": "The space between the posterior parietal peritoneum and the posterior abdominal wall. Retroperitoneal organs are remembered as SAD PUCKER: suprarenals, aorta/IVC, duodenum (except the cap), pancreas (except the tail), ureters, colon (ascending and descending), kidneys, oesophagus, rectum. Injuries here bleed silently with few abdominal signs. Organs are coloured by system; the spine is faded. The dataset has no quadratus lumborum.",
    "zh": "位于腹后壁腹膜与腹后壁之间。腹膜后器官可用SAD PUCKER记忆：肾上腺、主动脉/下腔静脉、十二指肠（球部除外）、胰（尾除外）、输尿管、升结肠与降结肠、肾、食管、直肠。此处损伤出血隐匿，腹部体征少。器官按系统着色；脊柱淡化。数据集中无腰方肌。"
  },
  "fadedGroups": [
    "cot-song"
  ],
  "groups": [
    {
      "key": "than",
      "name": {
        "vi": "Thận",
        "en": "Kidneys",
        "zh": "肾"
      },
      "latin": "Renes",
      "note": {
        "vi": "Nằm trong bao mỡ quanh thận và mạc thận (Gerota). Mạc thận khép kín ở trên nhưng hở ở dưới — nên dịch hay mủ quanh thận lan xuống chậu hông.",
        "en": "Lie within perirenal fat and the renal (Gerota's) fascia. The fascia is closed above but open below — so perirenal fluid or pus tracks down into the pelvis.",
        "zh": "位于肾周脂肪和肾筋膜（Gerota筋膜）内。肾筋膜上方封闭而下方开放——故肾周积液或积脓可向下蔓延至盆腔。"
      },
      "tint": "#9a4e3e",
      "parts": [
        "FJ3145",
        "FJ3147"
      ]
    },
    {
      "key": "thuong-than",
      "name": {
        "vi": "Tuyến thượng thận",
        "en": "Adrenal glands",
        "zh": "肾上腺"
      },
      "latin": "Glandulae suprarenales",
      "note": {
        "vi": "U tuyến thượng thận phát hiện tình cờ trên CT (incidentaloma) rất hay gặp — phải kiểm tra xem có tăng tiết hormon không.",
        "en": "Adrenal masses found incidentally on CT (incidentalomas) are very common — they must be checked for hormone excess.",
        "zh": "CT偶然发现的肾上腺肿块（偶发瘤）非常常见——须检查是否有激素分泌过多。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ3129",
        "FJ3130"
      ]
    },
    {
      "key": "nieu-quan",
      "name": {
        "vi": "Niệu quản",
        "en": "Ureters",
        "zh": "输尿管"
      },
      "latin": "Ureteres",
      "note": {
        "vi": "Chạy xuống trên mặt cơ thắt lưng lớn, dưới mạch sinh dục (\"nước chảy dưới cầu\"). Mổ vùng chậu hông dễ cắt nhầm niệu quản.",
        "en": "Descend on the front of psoas major, beneath the gonadal vessels (\"water under the bridge\"). Pelvic surgery can injure them by mistake.",
        "zh": "沿腰大肌前面下行，在生殖腺血管后方（“桥下流水”）。盆腔手术易误伤输尿管。"
      },
      "tint": "#d9b25a",
      "parts": [
        "FJ3144",
        "FJ3146"
      ]
    },
    {
      "key": "mach-lon",
      "name": {
        "vi": "Động mạch chủ bụng và nhánh tạng",
        "en": "Abdominal aorta and visceral branches",
        "zh": "腹主动脉及脏支"
      },
      "latin": "Aorta abdominalis",
      "note": {
        "vi": "Nằm hơi lệch trái trước cột sống. Thân tạng (T12), mạc treo tràng trên (L1), thận (L1–L2), mạc treo tràng dưới (L3), chia đôi (L4). Vỡ phình động mạch chủ bụng gây máu tụ sau phúc mạc — đau lưng, tụt huyết áp.",
        "en": "Lies slightly left of midline in front of the spine. Coeliac (T12), SMA (L1), renals (L1–L2), IMA (L3), bifurcation (L4). A ruptured aortic aneurysm bleeds into the retroperitoneum — back pain and shock.",
        "zh": "位于脊柱前方略偏左。腹腔干（T12）、肠系膜上动脉（L1）、肾动脉（L1–L2）、肠系膜下动脉（L3）、分叉（L4）。腹主动脉瘤破裂出血至腹膜后——背痛伴休克。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1846",
        "FJ1928",
        "FJ1932",
        "FJ3442",
        "FJ3464",
        "FJ3476",
        "FJ3565",
        "FJ3576"
      ]
    },
    {
      "key": "tm-chu-duoi",
      "name": {
        "vi": "Tĩnh mạch chủ dưới và tĩnh mạch thận",
        "en": "Inferior vena cava and renal veins",
        "zh": "下腔静脉与肾静脉"
      },
      "latin": "V. cava inferior",
      "note": {
        "vi": "Bên phải động mạch chủ. Tĩnh mạch thận trái bắt chéo trước động mạch chủ, ngay dưới gốc mạc treo tràng trên.",
        "en": "To the right of the aorta. The left renal vein crosses in front of the aorta just below the origin of the SMA.",
        "zh": "位于主动脉右侧。左肾静脉在肠系膜上动脉起点稍下方横越主动脉前方。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3441",
        "FJ3659",
        "FJ3465",
        "FJ3477",
        "FJ3478",
        "FJ3480",
        "FJ3566",
        "FJ3577",
        "FJ3578",
        "FJ3580"
      ]
    },
    {
      "key": "tuy-ta-trang",
      "name": {
        "vi": "Tuỵ và tá tràng",
        "en": "Pancreas and duodenum",
        "zh": "胰与十二指肠"
      },
      "latin": "Pancreas · Duodenum",
      "note": {
        "vi": "Tạng sau phúc mạc thứ phát — lúc phôi có mạc treo, sau dính vào thành sau. Vỡ tá tràng sau phúc mạc (tai nạn đập vào tay lái) dễ bỏ sót vì không có khí tự do trong ổ bụng.",
        "en": "Secondarily retroperitoneal — they had a mesentery in the embryo and later fused to the back wall. A retroperitoneal duodenal rupture (steering-wheel injury) is easily missed because there is no free intra-abdominal gas.",
        "zh": "继发性腹膜后器官——胚胎期有系膜，后贴附于腹后壁。腹膜后十二指肠破裂（方向盘撞击伤）因腹腔内无游离气体而易漏诊。"
      },
      "tint": "#e0b36a",
      "parts": [
        "FJ2573",
        "FJ2629"
      ]
    },
    {
      "key": "dai-trang",
      "name": {
        "vi": "Đại tràng lên và xuống",
        "en": "Ascending and descending colon",
        "zh": "升结肠与降结肠"
      },
      "latin": "Colon ascendens et descendens",
      "note": {
        "vi": "Cũng là tạng sau phúc mạc thứ phát. Khi mổ, bóc dọc đường trắng Toldt ở bờ ngoài để lật đại tràng vào giữa, vào khoang sau phúc mạc mà không làm chảy máu.",
        "en": "Also secondarily retroperitoneal. At surgery, incising along the white line of Toldt on their lateral side lets them be swung medially to enter the retroperitoneum bloodlessly.",
        "zh": "亦为继发性腹膜后器官。术中沿其外侧的Toldt白线切开，可将结肠翻向内侧，无出血地进入腹膜后隙。"
      },
      "tint": "#a8764f",
      "parts": [
        "FJ2566",
        "FJ2567"
      ]
    },
    {
      "key": "that-lung",
      "name": {
        "vi": "Cơ thắt lưng lớn",
        "en": "Psoas major",
        "zh": "腰大肌"
      },
      "latin": "M. psoas major",
      "note": {
        "vi": "Sàn của khoang, hai bên cột sống. Dấu hiệu cơ thắt lưng (đau khi duỗi háng) gợi ý viêm ruột thừa sau manh tràng hoặc áp xe sau phúc mạc.",
        "en": "The floor of the space either side of the spine. The psoas sign (pain on hip extension) suggests retrocaecal appendicitis or a retroperitoneal abscess.",
        "zh": "构成腹膜后隙的底，位于脊柱两侧。腰大肌征（伸髋时疼痛）提示盲肠后位阑尾炎或腹膜后脓肿。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ1431",
        "FJ1431M"
      ]
    },
    {
      "key": "cot-song",
      "name": {
        "vi": "Cột sống thắt lưng (mốc)",
        "en": "Lumbar spine (landmark)",
        "zh": "腰椎（标志）"
      },
      "latin": "Vertebrae lumbales",
      "note": {
        "vi": "L1–L5 và T12, mờ sẵn để đối chiếu mức đốt sống của các nhánh động mạch chủ.",
        "en": "L1–L5 and T12, faded to read off the vertebral level of each aortic branch.",
        "zh": "L1–L5及T12，淡化以对照主动脉各分支的椎体平面。"
      },
      "parts": [
        "FJ3156",
        "FJ3157",
        "FJ3159",
        "FJ3162",
        "FJ3165",
        "FJ3168"
      ]
    }
  ]
};
