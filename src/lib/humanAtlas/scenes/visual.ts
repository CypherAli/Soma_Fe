/**
 * Scene "Đường dẫn truyền thị giác" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-visual.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const visualScene: AtlasSceneDef = {
  "slug": "duong-thi-giac",
  "title": {
    "vi": "Đường dẫn truyền thị giác",
    "en": "The Visual Pathway",
    "zh": "视觉传导通路"
  },
  "latin": "Via optica",
  "intro": {
    "vi": "Võng mạc → dây thị giác → giao thoa thị giác → dải thị giác → thể gối ngoài → tia thị → vỏ thị giác thuỳ chẩm. Tại giao thoa, sợi từ nửa võng mạc PHÍA MŨI bắt chéo sang bên kia, sợi phía thái dương đi thẳng — nên mỗi bán cầu nhìn nửa thị trường bên đối diện. Vị trí tổn thương quyết định kiểu mất thị trường, và đó là cách định khu tổn thương. Mỗi chặng một màu; thuỳ chẩm để mờ.",
    "en": "Retina → optic nerve → optic chiasm → optic tract → lateral geniculate body → optic radiation → visual cortex in the occipital lobe. At the chiasm, fibres from the NASAL half of each retina cross to the other side while temporal fibres stay — so each hemisphere sees the opposite half of the visual field. Where the lesion is decides the pattern of field loss, which is how lesions are localised. Each stage has its own colour; the occipital lobes are faded.",
    "zh": "视网膜→视神经→视交叉→视束→外侧膝状体→视辐射→枕叶视皮质。在视交叉处，来自每侧视网膜鼻侧半的纤维交叉至对侧，颞侧纤维不交叉——因此每侧半球看到对侧半视野。病变部位决定视野缺损类型，据此进行定位诊断。各段以不同颜色显示；枕叶淡化。"
  },
  "fadedGroups": [
    "thuy-cham"
  ],
  "groups": [
    {
      "key": "vong-mac",
      "name": {
        "vi": "Võng mạc hai mắt",
        "en": "Retinas",
        "zh": "双眼视网膜"
      },
      "latin": "Retina",
      "note": {
        "vi": "Điểm khởi đầu. Thấu kính mắt đảo ngược ảnh: thị trường bên THÁI DƯƠNG rơi lên võng mạc phía MŨI. Nhớ điều này mới hiểu vì sao u đè giao thoa (chỉ cắt sợi mũi) lại mất hai thị trường thái dương.",
        "en": "The starting point. The eye's optics invert the image: the TEMPORAL visual field lands on the NASAL retina. Keep this in mind to see why a tumour pressing on the chiasm (cutting only nasal fibres) removes both temporal fields.",
        "zh": "起点。眼的屈光系统使物像倒置：颞侧视野的光落在鼻侧视网膜上。记住这一点才能理解为何压迫视交叉的肿瘤（只切断鼻侧纤维）会导致双颞侧视野缺损。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1316",
        "FJ1367"
      ]
    },
    {
      "key": "day-thi",
      "name": {
        "vi": "Dây thần kinh thị giác",
        "en": "Optic nerves",
        "zh": "视神经"
      },
      "latin": "N. opticus (II)",
      "note": {
        "vi": "Từ đĩa thị qua ống thị giác vào sọ. Tổn thương một dây (viêm thị thần kinh, chấn thương) gây mù hoàn toàn MỘT mắt đó, và mất phản xạ đồng tử trực tiếp khi chiếu đèn vào mắt ấy.",
        "en": "From the optic disc through the optic canal into the skull. Damage to one nerve (optic neuritis, trauma) blinds THAT eye completely and abolishes its direct pupillary light reflex.",
        "zh": "自视盘经视神经管入颅。一侧视神经损伤（视神经炎、外伤）导致该眼完全失明，照射该眼时直接对光反射消失。"
      },
      "tint": "#d9c27a",
      "parts": [
        "FJ1313",
        "FJ1364",
        "FJ1772",
        "FJ1819"
      ]
    },
    {
      "key": "giao-thoa",
      "name": {
        "vi": "Giao thoa thị giác",
        "en": "Optic chiasm",
        "zh": "视交叉"
      },
      "latin": "Chiasma opticum",
      "note": {
        "vi": "Nằm ngay trên hố yên. U tuyến yên phát triển lên trên đè vào giữa giao thoa — nơi các sợi mũi bắt chéo — gây bán manh hai thái dương: người bệnh hay va vào vật hai bên.",
        "en": "Sits just above the sella turcica. A pituitary tumour growing upward presses on the middle of the chiasm — where the nasal fibres cross — causing bitemporal hemianopia: patients bump into things on both sides.",
        "zh": "位于蝶鞍正上方。垂体瘤向上生长压迫视交叉中部——鼻侧纤维交叉处——导致双颞侧偏盲：患者常碰撞两侧物体。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1771",
        "FJ1818"
      ]
    },
    {
      "key": "dai-thi",
      "name": {
        "vi": "Dải thị giác",
        "en": "Optic tracts",
        "zh": "视束"
      },
      "latin": "Tractus opticus",
      "note": {
        "vi": "Sau giao thoa, mỗi dải chứa sợi thái dương cùng bên và sợi mũi bên kia — tức toàn bộ nửa thị trường ĐỐI BÊN. Tổn thương một dải gây bán manh đồng danh bên đối diện.",
        "en": "After the chiasm each tract carries temporal fibres from its own side and nasal fibres from the other — the whole OPPOSITE half of the visual field. A tract lesion causes a contralateral homonymous hemianopia.",
        "zh": "视交叉之后，每侧视束含同侧颞侧纤维和对侧鼻侧纤维——即对侧的整个半视野。一侧视束损伤导致对侧同向偏盲。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1773",
        "FJ1820"
      ]
    },
    {
      "key": "the-goi-ngoai",
      "name": {
        "vi": "Thể gối ngoài",
        "en": "Lateral geniculate bodies",
        "zh": "外侧膝状体"
      },
      "latin": "Corpus geniculatum laterale",
      "note": {
        "vi": "Trạm chuyển tiếp ở đồi thị, sáu lớp nhận xen kẽ từ mắt cùng bên và mắt đối bên. Từ đây tia thị toả ngược ra sau vòng quanh sừng thái dương (quai Meyer) tới thuỳ chẩm.",
        "en": "The thalamic relay, with six layers taking alternate input from each eye. From here the optic radiation fans backward, looping around the temporal horn (Meyer's loop) to the occipital lobe.",
        "zh": "丘脑的中继核，六层交替接受同侧眼和对侧眼的输入。视辐射由此向后扇形展开，绕过侧脑室下角（Meyer袢）至枕叶。"
      },
      "tint": "#5f9e9a",
      "parts": [
        "FJ1766",
        "FJ1813"
      ]
    },
    {
      "key": "cu-nao-tren",
      "name": {
        "vi": "Củ não sinh tư trên",
        "en": "Superior colliculi",
        "zh": "上丘"
      },
      "latin": "Colliculus superior",
      "note": {
        "vi": "Một phần sợi dải thị rẽ khỏi đường chính đi tới củ não sinh tư trên và vùng trước mái — điều khiển phản xạ đồng tử và phản xạ quay mắt về phía vật chuyển động. Vì vậy phản xạ đồng tử còn nguyên dù vỏ thị giác bị hỏng (mù vỏ).",
        "en": "Some tract fibres leave the main path for the superior colliculus and pretectal area — driving the pupillary reflex and reflex eye turning towards moving objects. That is why the pupil reflex survives even when the visual cortex is destroyed (cortical blindness).",
        "zh": "部分视束纤维离开主通路至上丘及顶盖前区——控制瞳孔对光反射及眼球转向运动物体的反射。因此即使视皮质受损（皮质盲），瞳孔反射仍保留。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ1735",
        "FJ1736",
        "FJ1779",
        "FJ1826"
      ]
    },
    {
      "key": "thuy-cham",
      "name": {
        "vi": "Thuỳ chẩm (vỏ thị giác)",
        "en": "Occipital lobes (visual cortex)",
        "zh": "枕叶（视皮质）"
      },
      "latin": "Lobus occipitalis",
      "note": {
        "vi": "Vỏ thị giác chính quanh rãnh cựa ở mặt trong. Hoàng điểm chiếu lên vùng rộng ở cực chẩm, có máu từ cả động mạch não giữa và não sau — nên tắc não sau gây bán manh nhưng chừa hoàng điểm. (Dữ liệu chỉ có thuỳ chẩm nguyên khối, không tách rãnh cựa.)",
        "en": "The primary visual cortex lines the calcarine sulcus on the medial surface. The macula projects to a large area at the occipital pole, supplied by both middle and posterior cerebral arteries — so a posterior cerebral occlusion causes hemianopia with macular sparing. (The data has the occipital lobe as one block, without a separate calcarine sulcus.)",
        "zh": "初级视皮质位于内侧面距状沟周围。黄斑投射至枕极的广大区域，由大脑中动脉和大脑后动脉双重供血——故大脑后动脉闭塞引起偏盲但黄斑回避。（数据中枕叶为整块，未单独分出距状沟。）"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ1791",
        "FJ1792"
      ]
    }
  ]
};
