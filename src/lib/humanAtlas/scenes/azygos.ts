
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Hệ tĩnh mạch đơn và mạch gian sườn" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Thần kinh tự chủ" cũ: atlas không có thân giao cảm, dây X, đám rối tạng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const azygosScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/azygos.ts#azygosScene", {
  "slug": "than-kinh-tu-chu",
  "title": {
    "vi": "Hệ tĩnh mạch đơn và mạch gian sườn",
    "en": "The Azygos System and Intercostal Vessels",
    "zh": "奇静脉系与肋间血管"
  },
  "latin": "Systema azygos · Vasa intercostalia",
  "system": "cardiovascular",
  "intro": {
    "vi": "Thành ngực được nuôi theo từng khoang gian sườn. Động mạch gian sườn sau từ động mạch chủ ngực, động mạch gian sườn trước từ động mạch ngực trong; hai nguồn nối nhau trong mỗi khoang. Máu tĩnh mạch về hệ tĩnh mạch đơn. Bên phải, tĩnh mạch đơn chạy dọc thân đốt, vòng qua cuống phổi phải rồi đổ vào tĩnh mạch chủ trên. Bên trái có tĩnh mạch bán đơn và bán đơn phụ, băng qua đường giữa đổ vào tĩnh mạch đơn. Khi tĩnh mạch chủ dưới bị tắc, hệ đơn là đường vòng đưa máu từ nửa dưới cơ thể về tim. Động mạch đỏ, tĩnh mạch xanh; lồng ngực mờ sẵn.",
    "en": "The chest wall is supplied space by space. Posterior intercostal arteries come from the thoracic aorta, anterior intercostals from the internal thoracic, and the two meet in each space. Venous blood returns through the azygos system. On the right, the azygos vein runs up the vertebral bodies, arches over the right lung root and enters the superior vena cava. On the left, the hemiazygos and accessory hemiazygos cross the midline to join the azygos. If the inferior vena cava is blocked, the azygos system is the bypass that returns blood from the lower body to the heart. Arteries red, veins blue; the rib cage is faded.",
    "zh": "胸壁按肋间隙分段供血：肋间后动脉来自胸主动脉，肋间前动脉来自胸廓内动脉，二者在各肋间隙吻合。静脉血经奇静脉系回流：右侧奇静脉沿椎体上行，绕右肺根上方注入上腔静脉；左侧半奇静脉和副半奇静脉越过中线汇入奇静脉。下腔静脉阻塞时，奇静脉系是下半身血液回心的侧支通路。动脉红，静脉蓝；胸廓淡化。"
  },
  "frameGroups": [
    "don",
    "ban-don",
    "gs-sau",
    "nguc-trong"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "don",
      "name": {
        "vi": "Tĩnh mạch đơn và tĩnh mạch chủ trên",
        "en": "Azygos vein and superior vena cava",
        "zh": "奇静脉与上腔静脉"
      },
      "latin": "V. azygos · V. cava superior",
      "note": {
        "vi": "Cung tĩnh mạch đơn vắt qua cuống phổi phải ngang T4. Trên phim X quang, nó là bóng tròn nhỏ ở góc khí–phế quản phải.",
        "en": "The azygos arch hooks over the right lung root at T4; on X-ray it is the small round shadow in the right tracheobronchial angle.",
        "zh": "奇静脉弓在T4平面跨越右肺根上方，X线上为右气管支气管角处的小圆形影。"
      },
      "tint": "#34597a",
      "parts": [
        "FJ3416",
        "FJ3645"
      ]
    },
    {
      "key": "ban-don",
      "name": {
        "vi": "Tĩnh mạch bán đơn và bán đơn phụ",
        "en": "Hemiazygos and accessory hemiazygos veins",
        "zh": "半奇静脉与副半奇静脉"
      },
      "latin": "V. hemiazygos · V. hemiazygos accessoria",
      "note": {
        "vi": "Bán đơn nhận các khoang gian sườn dưới trái, bán đơn phụ nhận các khoang giữa trái. Cả hai băng sau động mạch chủ, đổ vào tĩnh mạch đơn.",
        "en": "The hemiazygos drains the lower left spaces and the accessory hemiazygos the middle left spaces; both cross behind the aorta to the azygos.",
        "zh": "半奇静脉收集左下部肋间隙，副半奇静脉收集左中部肋间隙，二者均经主动脉后方汇入奇静脉。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ1981",
        "FJ3434"
      ]
    },
    {
      "key": "tm-gian-suon",
      "name": {
        "vi": "Tĩnh mạch gian sườn và dưới sườn",
        "en": "Intercostal and subcostal veins",
        "zh": "肋间静脉与肋下静脉"
      },
      "latin": "Vv. intercostales · V. subcostalis",
      "note": {
        "vi": "Tĩnh mạch gian sườn trên (khoang 2–3) đổ vào tĩnh mạch đơn bên phải và cánh tay–đầu bên trái.",
        "en": "The superior intercostal vein (spaces 2–3) drains to the azygos on the right and the brachiocephalic on the left.",
        "zh": "肋间最上静脉（第2–3间隙）右侧汇入奇静脉，左侧汇入头臂静脉。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1985",
        "FJ1986",
        "FJ1987",
        "FJ1991",
        "FJ1994",
        "FJ1995"
      ]
    },
    {
      "key": "gs-sau",
      "name": {
        "vi": "Động mạch chủ ngực và gian sườn sau",
        "en": "Thoracic aorta and posterior intercostal arteries",
        "zh": "胸主动脉与肋间后动脉"
      },
      "latin": "Aorta thoracica · Aa. intercostales posteriores · A. subcostalis",
      "note": {
        "vi": "Chín đôi gian sườn sau (khoang 3–11) và một đôi dưới sườn tách từ động mạch chủ ngực. Hai khoang đầu nhận từ thân sườn–cổ.",
        "en": "Nine pairs of posterior intercostals (spaces 3–11) and one subcostal pair arise from the thoracic aorta; the first two spaces are fed from the costocervical trunk.",
        "zh": "9对肋间后动脉（第3–11间隙）和1对肋下动脉发自胸主动脉；第1–2间隙由肋颈干供应。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1931",
        "FJ1935",
        "FJ1939",
        "FJ1950",
        "FJ1961",
        "FJ1967",
        "FJ1970",
        "FJ1973",
        "FJ1974",
        "FJ1975",
        "FJ1977"
      ]
    },
    {
      "key": "nguc-trong",
      "name": {
        "vi": "Động–tĩnh mạch ngực trong và nhánh tận",
        "en": "Internal thoracic vessels and terminal branches",
        "zh": "胸廓内动静脉及其终支"
      },
      "latin": "Vasa thoracica interna · Aa. musculophrenica, epigastrica superior",
      "note": {
        "vi": "Chạy dọc hai bờ xương ức, cách bờ khoảng 1cm. Ở khoang VI chia thành nhánh cơ–hoành và thượng vị trên.",
        "en": "Run beside the sternum about 1cm from its edge and divide at the sixth space into musculophrenic and superior epigastric branches.",
        "zh": "沿胸骨两侧缘约1cm下行，在第6肋间隙分为肌膈支和腹壁上支。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1936",
        "FJ1937",
        "FJ1969",
        "FJ1971",
        "FJ1972",
        "FJ1979",
        "FJ1988",
        "FJ1993",
        "FJ1996",
        "FJ3530",
        "FJ3615"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Lồng ngực (mốc)",
        "en": "Rib cage (landmark)",
        "zh": "胸廓（标志）"
      },
      "latin": "Costae · Vertebrae thoracicae · Sternum",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3225",
        "FJ3226",
        "FJ3227",
        "FJ3228",
        "FJ3229",
        "FJ3230",
        "FJ3231",
        "FJ3232",
        "FJ3233",
        "FJ3234",
        "FJ3235",
        "FJ3236",
        "FJ3330",
        "FJ3331",
        "FJ3332",
        "FJ3334",
        "FJ3336",
        "FJ3338",
        "FJ3340",
        "FJ3342",
        "FJ3344",
        "FJ3346",
        "FJ3347",
        "FJ3348",
        "FJ3154",
        "FJ3155",
        "FJ3156",
        "FJ3158",
        "FJ3160",
        "FJ3163",
        "FJ3166",
        "FJ3169",
        "FJ3171",
        "FJ3173",
        "FJ3174",
        "FJ3175",
        "FJ3153",
        "FJ3178",
        "FJ3290"
      ]
    }
  ]
});
