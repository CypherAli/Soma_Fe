/**
 * Scene "Thành bụng trước bên" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas KHÔNG có cơ thẳng bụng, chéo bụng trong, ngang bụng, bao cơ thẳng — chỉ có chéo bụng ngoài và đường trắng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const abdominalWallScene: AtlasSceneDef = {
  "slug": "thanh-bung",
  "title": {
    "vi": "Thành bụng trước bên: cơ chéo ngoài, đường trắng, mạch thượng vị",
    "en": "The Anterolateral Abdominal Wall",
    "zh": "腹前外侧壁"
  },
  "latin": "Paries abdominis anterolateralis",
  "intro": {
    "vi": "Thành bụng trước bên có ba lớp cơ dẹt: chéo ngoài, chéo trong và ngang bụng. Thớ của ba lớp bắt chéo nhau như ván ép, nên thành bụng mỏng mà chắc. Ở giữa, cân của chúng bọc cơ thẳng bụng rồi gặp nhau thành đường trắng. Bộ dữ liệu chỉ có cơ chéo ngoài, đường trắng và các mạch thượng vị, nên scene dạy lớp nông và hệ mạch. Động mạch thượng vị trên (từ ngực trong) và thượng vị dưới (từ chậu ngoài) nối nhau trong bao cơ thẳng. Đó là một đường vòng nối giữa chi trên và chi dưới. Cơ màu đỏ, cân trắng, mạch đỏ–xanh; khung xương mờ sẵn.",
    "en": "The anterolateral abdominal wall has three flat muscle layers: external oblique, internal oblique and transversus abdominis. Their fibres cross like plywood, so the wall is thin but strong. In the midline their aponeuroses sheath rectus abdominis and meet as the linea alba. The dataset has only external oblique, the linea alba and the epigastric vessels, so the scene teaches the superficial layer and the vessels. The superior epigastric artery (from the internal thoracic) and the inferior epigastric (from the external iliac) join inside the rectus sheath. This is a bypass route between the upper and lower body. Muscle is red, aponeurosis white, vessels red and blue; the skeleton is faded.",
    "zh": "腹前外侧壁有三层扁肌：腹外斜肌、腹内斜肌和腹横肌，纤维如胶合板般交叉，使腹壁薄而坚韧。在中线处其腱膜包裹腹直肌后汇合成白线。数据集中仅有腹外斜肌、白线和腹壁血管，故本场景讲授浅层和血管。腹壁上动脉（来自胸廓内动脉）与腹壁下动脉（来自髂外动脉）在腹直肌鞘内吻合，是上下半身之间的侧支通路。肌红色，腱膜白色，血管红蓝；骨架淡化。"
  },
  "frameGroups": [
    "cheo-ngoai",
    "duong-trang",
    "dm",
    "tm"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "cheo-ngoai",
      "name": {
        "vi": "Cơ chéo bụng ngoài",
        "en": "External oblique",
        "zh": "腹外斜肌"
      },
      "latin": "M. obliquus externus abdominis",
      "note": {
        "vi": "Mọc từ 8 xương sườn dưới, đan răng cưa với cơ răng trước. Bờ dưới cân của nó cuộn lại thành dây chằng bẹn (không có trong bộ dữ liệu).",
        "en": "Arises from the lower eight ribs, interdigitating with serratus anterior. The lower edge of its aponeurosis rolls under to form the inguinal ligament (not in the dataset).",
        "zh": "起于下8肋，与前锯肌呈锯齿状交错。其腱膜下缘卷曲形成腹股沟韧带（数据集中无）。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1452",
        "FJ1452M"
      ]
    },
    {
      "key": "duong-trang",
      "name": {
        "vi": "Đường trắng",
        "en": "Linea alba",
        "zh": "白线"
      },
      "latin": "Linea alba",
      "note": {
        "vi": "Dải cân giữa, từ mũi ức tới khớp mu, ít mạch máu nên là đường mổ bụng kinh điển. Rốn nằm trên đường này. Chỗ yếu có thể gây thoát vị trên rốn.",
        "en": "The midline aponeurotic band from xiphoid to pubic symphysis; nearly bloodless, it is the classic incision. The umbilicus lies on it, and weak spots cause epigastric hernias.",
        "zh": "自剑突至耻骨联合的中线腱膜带，血管少，为经典腹部切口。脐位于其上，薄弱处可致上腹疝。"
      },
      "tint": "#f0ede4",
      "parts": [
        "FJ1448"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch thượng vị trên, dưới, nông",
        "en": "Superior, inferior and superficial epigastric arteries",
        "zh": "腹壁上、下、浅动脉"
      },
      "latin": "Aa. epigastricae superior, inferior, superficialis",
      "note": {
        "vi": "Động mạch thượng vị dưới là mốc phân biệt thoát vị bẹn trực tiếp (trong mạch) và gián tiếp (ngoài mạch). Chọc dẫn lưu bụng phải tránh đường đi của nó.",
        "en": "The inferior epigastric artery separates direct (medial) from indirect (lateral) inguinal hernias; abdominal drains must avoid its course.",
        "zh": "腹壁下动脉是区分腹股沟直疝（内侧）与斜疝（外侧）的标志；腹腔穿刺引流须避开其走行。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1936",
        "FJ1937",
        "FJ1969",
        "FJ1971",
        "FJ1972",
        "FJ1979",
        "FJ3511",
        "FJ3529",
        "FJ3604",
        "FJ3614"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch thượng vị",
        "en": "Epigastric veins",
        "zh": "腹壁静脉"
      },
      "latin": "Vv. epigastricae",
      "note": {
        "vi": "Trong tăng áp tĩnh mạch cửa, tĩnh mạch quanh rốn nối với tĩnh mạch thượng vị giãn to, toả ra như đầu sứa.",
        "en": "In portal hypertension the paraumbilical veins link to the epigastric veins, which dilate and radiate like a medusa's head.",
        "zh": "门静脉高压时脐周静脉与腹壁静脉吻合并扩张，呈放射状如海蛇头。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2122",
        "FJ2178",
        "FJ3512",
        "FJ3530",
        "FJ3605",
        "FJ3615"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Bờ sườn và xương chậu (mốc)",
        "en": "Costal margin and hip bones (landmarks)",
        "zh": "肋弓与髋骨（标志）"
      },
      "latin": "Costae VII–XII · Ossa coxae",
      "note": {
        "vi": "Mờ sẵn — hai khung bám trên và dưới của thành bụng.",
        "en": "Faded — the upper and lower frames of the wall.",
        "zh": "淡化——腹壁上下附着框架。"
      },
      "parts": [
        "FJ3152",
        "FJ3153",
        "FJ3225",
        "FJ3226",
        "FJ3227",
        "FJ3234",
        "FJ3235",
        "FJ3236",
        "FJ3255",
        "FJ3288",
        "FJ3330",
        "FJ3331",
        "FJ3332",
        "FJ3345",
        "FJ3346",
        "FJ3347",
        "FJ3348"
      ]
    }
  ]
};
