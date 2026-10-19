
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Mũi và xoang cạnh mũi" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có lòng xoang và niêm mạc — xoang được học qua các xương chứa chúng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const noseSinusesScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/nose-sinuses.ts#noseSinusesScene", {
  "slug": "mui-xoang",
  "title": {
    "vi": "Mũi ngoài, hốc mũi và các xương chứa xoang",
    "en": "The Nose and Paranasal Sinuses",
    "zh": "外鼻、鼻腔与鼻窦"
  },
  "latin": "Nasus · Sinus paranasales",
  "intro": {
    "vi": "Mũi ngoài có khung trên là hai xương mũi, khung dưới là các sụn. Vách mũi gồm sụn vách, xương lá mía và mảnh thẳng xương sàng. Thành ngoài hốc mũi có ba xoăn mũi. Bốn đôi xoang cạnh mũi là các hốc khí trong xương hàm trên, trán, sàng và bướm, đều đổ vào hốc mũi. Bộ dữ liệu không dựng lòng xoang, nên scene tô từng xương chứa xoang để học vị trí. Ống lệ–mũi cũng đổ vào hốc mũi, dưới xoăn mũi dưới. Mỗi xương một màu; sụn màu xanh nhạt.",
    "en": "The external nose has two nasal bones above and cartilages below. The septum is septal cartilage, vomer and the perpendicular plate of the ethmoid. The lateral wall of the nasal cavity carries three conchae. The four pairs of paranasal sinuses are air cells in the maxilla, frontal, ethmoid and sphenoid bones, all draining into the nasal cavity. The dataset does not model the sinus cavities, so the scene colours each bone that holds a sinus. The nasolacrimal duct also opens into the nose, under the inferior concha. Each bone has its own colour; cartilage is pale blue.",
    "zh": "外鼻上部支架为两块鼻骨，下部为软骨。鼻中隔由鼻中隔软骨、犁骨和筛骨垂直板构成。鼻腔外侧壁有三个鼻甲。四对鼻窦是上颌骨、额骨、筛骨和蝶骨内的含气腔，均开口于鼻腔。数据集中未建窦腔，故本场景为含窦的各骨着色以学习位置。鼻泪管亦开口于鼻腔下鼻甲下方。每块骨一种颜色；软骨浅蓝。"
  },
  "frameGroups": [
    "sun",
    "mui",
    "ham-tren"
  ],
  "fadedGroups": [
    "tran"
  ],
  "groups": [
    {
      "key": "sun",
      "name": {
        "vi": "Sụn mũi: sụn vách, sụn bên, sụn cánh lớn",
        "en": "Nasal cartilages: septal, lateral, major alar",
        "zh": "鼻软骨：鼻中隔软骨、鼻外侧软骨、大翼软骨"
      },
      "latin": "Cartilagines nasi",
      "note": {
        "vi": "Sụn cánh lớn tạo đầu và cánh mũi. Phía trước dưới vách mũi có vùng Kiesselbach giàu mạch; khoảng 90% ca chảy máu mũi xuất phát từ đây.",
        "en": "The major alar cartilages shape the tip and wings. The front of the septum holds Kiesselbach's area, rich in vessels, where about 90% of nosebleeds arise.",
        "zh": "大翼软骨构成鼻尖和鼻翼。鼻中隔前下部为血管丰富的Kiesselbach区，约90%鼻出血源于此。"
      },
      "tint": "#a8d0e6",
      "parts": [
        "FJ2554",
        "FJ2555",
        "FJ2556",
        "FJ2557",
        "FJ2558"
      ]
    },
    {
      "key": "mui",
      "name": {
        "vi": "Xương mũi, lá mía, xoăn mũi dưới",
        "en": "Nasal bones, vomer, inferior conchae",
        "zh": "鼻骨、犁骨、下鼻甲"
      },
      "latin": "Ossa nasalia · Vomer · Conchae nasales inferiores",
      "note": {
        "vi": "Xương mũi hay gãy nhất vùng mặt. Xoăn mũi dưới là một xương riêng; ống lệ–mũi đổ vào ngách dưới nó.",
        "en": "The nasal bones are the most often broken facial bones. The inferior concha is a separate bone; the nasolacrimal duct opens into the meatus beneath it.",
        "zh": "鼻骨是面部最常骨折的骨。下鼻甲为独立骨，鼻泪管开口于其下方的下鼻道。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3263",
        "FJ3272",
        "FJ3369",
        "FJ3378",
        "FJ3395"
      ]
    },
    {
      "key": "ham-tren",
      "name": {
        "vi": "Xương hàm trên — xoang hàm",
        "en": "Maxilla — maxillary sinus",
        "zh": "上颌骨——上颌窦"
      },
      "latin": "Maxilla (sinus maxillaris)",
      "note": {
        "vi": "Xoang lớn nhất. Lỗ thông nằm cao trên thành trong nên dịch khó thoát khi nằm thẳng. Chân răng hàm trên sát sàn xoang, nên nhổ răng có thể thủng vào xoang và viêm răng lan thành viêm xoang.",
        "en": "The largest sinus. Its opening is high on the medial wall, so it drains poorly when upright. The roots of the upper molars lie against its floor, so an extraction can perforate it and dental infection can spread into it.",
        "zh": "最大的鼻窦。开口位于内侧壁高处，直立时引流不畅。上颌磨牙牙根紧邻窦底，拔牙可致穿孔，牙源性感染可蔓延为鼻窦炎。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3269",
        "FJ3375"
      ]
    },
    {
      "key": "tran",
      "name": {
        "vi": "Xương trán — xoang trán",
        "en": "Frontal bone — frontal sinus",
        "zh": "额骨——额窦"
      },
      "latin": "Os frontale (sinus frontalis)",
      "note": {
        "vi": "Nằm sau cung mày, đổ xuống ngách mũi giữa. Xoang trán chưa có lúc mới sinh, phát triển rõ sau khoảng 7 tuổi.",
        "en": "Behind the brow ridges, draining down into the middle meatus. It is absent at birth and becomes clear after about age 7.",
        "zh": "位于眉弓后方，向下开口于中鼻道。出生时缺如，约7岁后明显发育。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ3200"
      ]
    },
    {
      "key": "sang",
      "name": {
        "vi": "Xương sàng — các xoang sàng",
        "en": "Ethmoid — ethmoidal air cells",
        "zh": "筛骨——筛窦"
      },
      "latin": "Os ethmoidale (cellulae ethmoidales)",
      "note": {
        "vi": "Nhiều tế bào khí nhỏ giữa hốc mũi và hốc mắt, ngăn với hốc mắt bởi mảnh giấy rất mỏng. Viêm xoang sàng ở trẻ có thể lan vào hốc mắt.",
        "en": "Many small air cells between the nasal cavity and the orbit, separated from the orbit by the paper-thin lamina papyracea. Ethmoiditis in children can spread into the orbit.",
        "zh": "鼻腔与眼眶之间的众多小气房，借极薄的纸样板与眶相隔。儿童筛窦炎可蔓延入眶。"
      },
      "tint": "#6fae7f",
      "parts": [
        "FJ3199"
      ]
    },
    {
      "key": "buom",
      "name": {
        "vi": "Xương bướm — xoang bướm",
        "en": "Sphenoid — sphenoid sinus",
        "zh": "蝶骨——蝶窦"
      },
      "latin": "Os sphenoidale (sinus sphenoidalis)",
      "note": {
        "vi": "Nằm sâu nhất, ngay dưới tuyến yên, hai bên là động mạch cảnh trong và dây thị giác.",
        "en": "The deepest sinus, just under the pituitary, flanked by the internal carotids and optic nerves.",
        "zh": "位置最深，位于垂体正下方，两侧为颈内动脉和视神经。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3394"
      ]
    },
    {
      "key": "khau-cai",
      "name": {
        "vi": "Xương khẩu cái và xương lệ",
        "en": "Palatine and lacrimal bones",
        "zh": "腭骨与泪骨"
      },
      "latin": "Ossa palatina · Ossa lacrimalia",
      "note": {
        "vi": "Xương khẩu cái làm sàn sau hốc mũi; xương lệ ở thành trong hốc mắt, chứa hố túi lệ.",
        "en": "The palatine bones form the back of the nasal floor; the lacrimal bones sit in the medial orbital wall and hold the fossa for the lacrimal sac.",
        "zh": "腭骨构成鼻腔底后部；泪骨位于眶内侧壁，有泪囊窝。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3265",
        "FJ3273",
        "FJ3371",
        "FJ3379"
      ]
    }
  ]
});
