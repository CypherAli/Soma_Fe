
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Bộ lệ" dựng từ bộ atlas BodyParts3D. Bên trái (bẫy #13).
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const lacrimalScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/lacrimal.ts#lacrimalScene", {
  "slug": "le-dao",
  "title": {
    "vi": "Bộ lệ: tuyến lệ và đường dẫn lệ",
    "en": "The Lacrimal Apparatus",
    "zh": "泪器"
  },
  "latin": "Apparatus lacrimalis",
  "intro": {
    "vi": "Nước mắt được tuyến lệ tiết ra ở góc trên ngoài hốc mắt. Mỗi lần chớp mắt, nước mắt được đẩy chéo qua giác mạc về góc trong, đọng ở hồ lệ. Từ đó nó chảy qua điểm lệ vào hai lệ quản trên và dưới, rồi vào túi lệ nằm trong hố xương lệ. Cuối cùng nó theo ống lệ–mũi xuống ngách mũi dưới. Vì thế khóc thì chảy nước mũi, và nhỏ thuốc mắt có thể thấy vị đắng ở họng. Tắc ống lệ–mũi bẩm sinh làm trẻ sơ sinh chảy nước mắt liên tục. Mỗi đoạn một sắc xanh; nhãn cầu và xương mờ sẵn.",
    "en": "Tears are secreted by the lacrimal gland in the upper outer corner of the orbit. Each blink sweeps them obliquely across the cornea to the inner corner, where they pool in the lacrimal lake. From there they drain through the puncta into the upper and lower canaliculi, then into the lacrimal sac in the fossa of the lacrimal bone. Finally they run down the nasolacrimal duct into the inferior meatus of the nose. That is why crying makes the nose run, and eye drops can be tasted in the throat. Congenital blockage of the nasolacrimal duct makes newborns' eyes water constantly. Each segment has its own shade of blue; the eyeball and bones are faded.",
    "zh": "泪液由位于眶外上角的泪腺分泌。每次眨眼将泪液斜向扫过角膜至内眦，积于泪湖；再经泪点进入上、下泪小管，汇入位于泪骨窝内的泪囊；最后沿鼻泪管下行至下鼻道。故哭泣时流鼻涕，滴眼药后咽部可尝到苦味。先天性鼻泪管阻塞致新生儿持续流泪。每段一种蓝色调；眼球和骨骼淡化。"
  },
  "frameGroups": [
    "tuyen",
    "ho",
    "le-quan",
    "tui",
    "ong"
  ],
  "fadedGroups": [
    "mat",
    "xuong"
  ],
  "groups": [
    {
      "key": "tuyen",
      "name": {
        "vi": "Tuyến lệ",
        "en": "Lacrimal gland",
        "zh": "泪腺"
      },
      "latin": "Glandula lacrimalis",
      "note": {
        "vi": "Gân cơ nâng mi chia tuyến thành phần ổ mắt và phần mi. Tuyến do sợi phó giao cảm của dây VII chi phối, nên liệt dây VII trước hạch gối gây khô mắt.",
        "en": "The levator aponeurosis divides it into orbital and palpebral parts. It is driven by parasympathetic fibres of nerve VII, so a facial palsy proximal to the geniculate ganglion causes a dry eye.",
        "zh": "上睑提肌腱膜将其分为眶部和睑部。受面神经副交感纤维支配，故膝神经节近端的面神经麻痹致眼干。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1299"
      ]
    },
    {
      "key": "ho",
      "name": {
        "vi": "Hồ lệ",
        "en": "Lacrimal lake",
        "zh": "泪湖"
      },
      "latin": "Lacus lacrimalis",
      "note": {
        "vi": "Khoang nhỏ ở góc mắt trong, nơi nước mắt đọng trước khi vào điểm lệ.",
        "en": "The small pool at the inner corner where tears collect before entering the puncta.",
        "zh": "内眦处的小凹，泪液在进入泪点前积聚于此。"
      },
      "tint": "#a8d0e6",
      "parts": [
        "FJ1301"
      ]
    },
    {
      "key": "le-quan",
      "name": {
        "vi": "Lệ quản trên và dưới",
        "en": "Upper and lower canaliculi",
        "zh": "上、下泪小管"
      },
      "latin": "Canaliculi lacrimales",
      "note": {
        "vi": "Mỗi lệ quản đi thẳng đứng khoảng 2mm rồi ngoặt ngang khoảng 8mm. Rách mi gần góc trong có thể đứt lệ quản, cần khâu nối sớm.",
        "en": "Each runs vertically for about 2mm then turns horizontally for about 8mm. An eyelid tear near the inner corner can sever one and needs early repair.",
        "zh": "各泪小管先垂直约2mm，再转为水平约8mm。内眦附近的眼睑裂伤可断裂泪小管，需早期吻合。"
      },
      "tint": "#8fc1e3",
      "parts": [
        "FJ1298"
      ]
    },
    {
      "key": "tui",
      "name": {
        "vi": "Túi lệ",
        "en": "Lacrimal sac",
        "zh": "泪囊"
      },
      "latin": "Saccus lacrimalis",
      "note": {
        "vi": "Nằm trong hố túi lệ giữa xương lệ và mỏm trán xương hàm trên. Viêm túi lệ gây sưng đỏ góc mắt trong.",
        "en": "Sits in the lacrimal fossa between the lacrimal bone and the frontal process of the maxilla. Dacryocystitis makes the inner corner red and swollen.",
        "zh": "位于泪骨与上颌骨额突之间的泪囊窝内。泪囊炎致内眦红肿。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ1309"
      ]
    },
    {
      "key": "ong",
      "name": {
        "vi": "Ống lệ–mũi",
        "en": "Nasolacrimal duct",
        "zh": "鼻泪管"
      },
      "latin": "Ductus nasolacrimalis",
      "note": {
        "vi": "Dài khoảng 12–18mm, đổ vào ngách mũi dưới dưới xoăn mũi dưới, có van Hasner ở đầu dưới.",
        "en": "About 12–18mm long, opening into the inferior meatus under the inferior concha, guarded below by the valve of Hasner.",
        "zh": "长约12–18mm，开口于下鼻甲下方的下鼻道，下端有Hasner瓣。"
      },
      "tint": "#2e5f8f",
      "parts": [
        "FJ1302"
      ]
    },
    {
      "key": "day-le",
      "name": {
        "vi": "Dây lệ",
        "en": "Lacrimal nerve",
        "zh": "泪腺神经"
      },
      "latin": "N. lacrimalis",
      "note": {
        "vi": "Nhánh V1 tới tuyến lệ, mang cảm giác và sợi tiết dịch mượn từ dây VII.",
        "en": "The V1 branch to the gland, carrying sensation and secretory fibres borrowed from nerve VII.",
        "zh": "至泪腺的V1分支，携带感觉纤维及借自面神经的分泌纤维。"
      },
      "tint": "#f2c14e",
      "parts": [
        "FJ1300"
      ]
    },
    {
      "key": "mi",
      "name": {
        "vi": "Sụn mi trên và dưới",
        "en": "Upper and lower tarsal plates",
        "zh": "上、下睑板"
      },
      "latin": "Tarsi superior et inferior",
      "note": {
        "vi": "Khung đặc của mi mắt, chứa tuyến Meibomius tiết lớp dầu của phim nước mắt.",
        "en": "The firm skeleton of the lids, holding the meibomian glands that make the oily layer of the tear film.",
        "zh": "眼睑的致密支架，内含睑板腺，分泌泪膜油脂层。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ1324",
        "FJ1328"
      ]
    },
    {
      "key": "mat",
      "name": {
        "vi": "Nhãn cầu (mốc)",
        "en": "Eyeball (landmark)",
        "zh": "眼球（标志）"
      },
      "latin": "Bulbus oculi",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ1289",
        "FJ1317"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương lệ, hàm trên, xoăn mũi dưới (mốc)",
        "en": "Lacrimal bone, maxilla, inferior concha (landmarks)",
        "zh": "泪骨、上颌骨、下鼻甲（标志）"
      },
      "latin": "Os lacrimale · Maxilla · Concha nasalis inferior",
      "note": {
        "vi": "Mờ sẵn — thấy đường ống đi xuống mũi.",
        "en": "Faded — showing the duct's course down into the nose.",
        "zh": "淡化——显示鼻泪管下行入鼻的走行。"
      },
      "parts": [
        "FJ3263",
        "FJ3265",
        "FJ3269"
      ]
    }
  ]
});
