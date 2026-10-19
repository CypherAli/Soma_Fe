
import { bindContentSource } from "@/lib/content/source";
/**
 * Bài bộ phận "Nhãn cầu — học theo lớp" học theo lớp — nhóm lấy từ eye.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partEyeScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/part-eye.ts#partEyeScene", {
  "slug": "bo-phan-mat",
  "title": {
    "vi": "Nhãn cầu — học theo lớp",
    "en": "The Eyeball — Layer by Layer",
    "zh": "眼球——分层学习"
  },
  "latin": "Bulbus oculi",
  "system": "visual",
  "intro": {
    "vi": "Nhãn cầu có ba lớp áo. Mở ra là lớp ngoài: củng mạc trắng và giác mạc trong. Tắt lớp ngoài để thấy lớp giữa (mống mắt, thể mi, màng mạch). Tắt tiếp để thấy lớp trong (võng mạc) cùng thể thuỷ tinh và dây thị giác. Đây là mắt trái (lưới mắt phải của bộ dữ liệu bị lỗi).",
    "en": "The eyeball has three coats. It opens on the outer coat: white sclera and clear cornea. Turn it off to see the middle coat (iris, ciliary body, choroid), then the inner coat (retina) with the lens and optic nerve. This is the left eye (the dataset's right-eye meshes are faulty).",
    "zh": "眼球壁有三层。打开时显示外层：白色巩膜和透明角膜。关闭外层可见中层（虹膜、睫状体、脉络膜），再关闭可见内层（视网膜）及晶状体和视神经。此为左眼（数据集右眼网格有误）。"
  },
  "layers": [
    {
      "key": "ngoai",
      "name": {
        "vi": "Lớp ngoài",
        "en": "Outer coat",
        "zh": "外层"
      },
      "groups": [
        "cung-mac",
        "giac-mac"
      ],
      "on": true
    },
    {
      "key": "giua",
      "name": {
        "vi": "Lớp giữa",
        "en": "Middle coat",
        "zh": "中层"
      },
      "groups": [
        "mong-mat",
        "the-mi",
        "mang-mach"
      ],
      "on": true
    },
    {
      "key": "trong",
      "name": {
        "vi": "Lớp trong và môi trường",
        "en": "Inner coat and media",
        "zh": "内层与屈光介质"
      },
      "groups": [
        "vong-mac",
        "thuy-tinh",
        "day-thi-giac"
      ],
      "on": true
    }
  ],
  "groups": [
    {
      "key": "cung-mac",
      "name": {
        "vi": "Củng mạc",
        "en": "Sclera",
        "zh": "巩膜"
      },
      "latin": "Sclera",
      "note": {
        "vi": "\"Lòng trắng\" — lớp xơ dai chiếm 5/6 sau vỏ nhãn cầu, là chỗ bám của các cơ vận nhãn. Phía sau bị dây thị giác xuyên qua ở mảnh sàng — điểm yếu nơi đĩa thị lõm sâu trong glôcôm.",
        "en": "The \"white of the eye\" — a tough fibrous coat forming the back five-sixths of the globe and anchoring the extraocular muscles. At the back it is pierced by the optic nerve at the lamina cribrosa — the weak point that cups deeply in glaucoma.",
        "zh": "即“眼白”——坚韧的纤维膜，占眼球壁后5/6，为眼外肌附着处。后方视神经穿过巩膜筛板——青光眼时视盘凹陷加深的薄弱处。"
      },
      "tint": "#ece6d6",
      "parts": [
        "FJ1317"
      ]
    },
    {
      "key": "giac-mac",
      "name": {
        "vi": "Giác mạc và tiền phòng",
        "en": "Cornea and anterior chamber",
        "zh": "角膜与前房"
      },
      "latin": "Cornea",
      "note": {
        "vi": "Giác mạc trong suốt, không có mạch máu, đảm nhận khoảng 2/3 lực khúc xạ của mắt — nên phẫu thuật khúc xạ (LASIK) mài giác mạc chứ không động tới thể thuỷ tinh. Tiền phòng chứa thuỷ dịch, thoát ra ở góc tiền phòng; góc bị đóng gây glôcôm góc đóng cấp.",
        "en": "The clear, avascular cornea provides about two-thirds of the eye's focusing power — which is why refractive surgery (LASIK) reshapes the cornea rather than the lens. The anterior chamber holds aqueous humour, which drains at the iridocorneal angle; if the angle closes, acute angle-closure glaucoma follows.",
        "zh": "透明无血管的角膜提供眼约2/3的屈光力——故屈光手术（LASIK）重塑角膜而非晶状体。前房充满房水，经前房角引流；房角关闭引起急性闭角型青光眼。"
      },
      "tint": "#a8d4e6",
      "parts": [
        "FJ1282",
        "FJ1289"
      ]
    },
    {
      "key": "mong-mat",
      "name": {
        "vi": "Mống mắt",
        "en": "Iris",
        "zh": "虹膜"
      },
      "latin": "Iris",
      "note": {
        "vi": "Màng có lỗ đồng tử ở giữa, điều chỉnh lượng sáng như màn chập máy ảnh: cơ vòng co đồng tử (phó giao cảm, dây III), cơ tia giãn đồng tử (giao cảm). Đồng tử co nhỏ một bên kèm sụp mi gợi ý hội chứng Horner.",
        "en": "A diaphragm with the pupil at its centre, controlling how much light enters like a camera aperture: the sphincter constricts the pupil (parasympathetic, nerve III), the dilator widens it (sympathetic). A small pupil with a drooping lid on one side suggests Horner syndrome.",
        "zh": "中央有瞳孔的隔膜，像相机光圈一样调节进光量：瞳孔括约肌缩瞳（副交感，动眼神经），瞳孔开大肌散瞳（交感）。单侧瞳孔缩小伴上睑下垂提示Horner综合征。"
      },
      "tint": "#7a9b5a",
      "parts": [
        "FJ1297"
      ]
    },
    {
      "key": "the-mi",
      "name": {
        "vi": "Thể mi và dây treo",
        "en": "Ciliary body and zonule",
        "zh": "睫状体与悬韧带"
      },
      "latin": "Corpus ciliare · Zonula ciliaris",
      "note": {
        "vi": "Cơ thể mi co làm dây treo CHÙNG lại (chứ không kéo căng), thể thuỷ tinh tự phồng lên để nhìn gần (điều tiết). Tuổi già thể thuỷ tinh cứng dần, không phồng được nữa — lão thị. Thể mi cũng tiết thuỷ dịch.",
        "en": "Contraction of the ciliary muscle SLACKENS the zonular fibres, letting the lens round up for near vision (accommodation). With age the lens stiffens and can no longer round up — presbyopia. The ciliary body also secretes aqueous humour.",
        "zh": "睫状肌收缩使悬韧带松弛，晶状体借自身弹性变凸以看近物（调节）。年老时晶状体变硬不再变凸——即老视。睫状体还分泌房水。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ1287",
        "FJ1320"
      ]
    },
    {
      "key": "mang-mach",
      "name": {
        "vi": "Màng mạch",
        "en": "Choroid",
        "zh": "脉络膜"
      },
      "latin": "Choroidea",
      "note": {
        "vi": "Lớp giàu mạch máu và sắc tố nằm giữa củng mạc và võng mạc, nuôi lớp tế bào cảm quang ngoài của võng mạc và hấp thụ ánh sáng tán xạ. Bong võng mạc tách võng mạc khỏi màng mạch — tế bào cảm quang mất nguồn nuôi và chết dần.",
        "en": "A vascular, pigmented layer between the sclera and retina that feeds the outer photoreceptor layer and absorbs stray light. Retinal detachment separates the retina from the choroid — the photoreceptors lose their supply and die.",
        "zh": "位于巩膜与视网膜之间、富含血管和色素的一层，营养视网膜外层感光细胞并吸收散射光。视网膜脱离使视网膜与脉络膜分开——感光细胞失去营养而逐渐死亡。"
      },
      "tint": "#7a3a4f",
      "parts": [
        "FJ1285",
        "FJ1286"
      ]
    },
    {
      "key": "vong-mac",
      "name": {
        "vi": "Võng mạc",
        "en": "Retina",
        "zh": "视网膜"
      },
      "latin": "Retina",
      "note": {
        "vi": "Lớp thần kinh chứa tế bào que (nhìn tối) và nón (màu, chi tiết). Hoàng điểm ở cực sau dày đặc tế bào nón — thị lực tinh nhất; đĩa thị (điểm mù) là chỗ sợi thần kinh rời nhãn cầu thành dây thị giác.",
        "en": "The neural layer with rods (dim light) and cones (colour, detail). The macula at the posterior pole is packed with cones — the sharpest vision; the optic disc (blind spot) is where the nerve fibres leave the globe as the optic nerve.",
        "zh": "神经层，含视杆细胞（暗视觉）和视锥细胞（色觉、精细视觉）。后极部黄斑视锥细胞密集——视力最敏锐；视盘（生理盲点）是神经纤维离开眼球形成视神经之处。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1316"
      ]
    },
    {
      "key": "thuy-tinh",
      "name": {
        "vi": "Thể thuỷ tinh và thể pha lê",
        "en": "Lens and vitreous body",
        "zh": "晶状体与玻璃体"
      },
      "latin": "Lens · Corpus vitreum",
      "note": {
        "vi": "Thể thuỷ tinh hai mặt lồi, trong suốt, treo sau mống mắt; đục thể thuỷ tinh là bệnh đục thuỷ tinh thể (cataract), mổ thay bằng thấu kính nhân tạo. Thể pha lê là khối gel chiếm 4/5 thể tích nhãn cầu, giữ võng mạc áp sát thành.",
        "en": "The clear biconvex lens hangs behind the iris; its clouding is a cataract, treated by replacing it with an artificial lens. The vitreous is a gel filling four-fifths of the globe, holding the retina against the wall.",
        "zh": "透明的双凸晶状体悬于虹膜后方；其混浊即白内障，手术以人工晶状体替换。玻璃体为凝胶，占眼球容积4/5，使视网膜贴附于眼球壁。"
      },
      "tint": "#e8d98a",
      "parts": [
        "FJ1305",
        "FJ1331"
      ]
    },
    {
      "key": "day-thi-giac",
      "name": {
        "vi": "Dây thần kinh thị giác (đoạn hốc mắt)",
        "en": "Optic nerve (orbital part)",
        "zh": "视神经（眶内段）"
      },
      "latin": "N. opticus (II)",
      "note": {
        "vi": "Thực chất là một bó chất trắng của não, được màng não bọc tới tận nhãn cầu — nên tăng áp lực nội sọ truyền theo bao màng gây phù đĩa thị, thấy được khi soi đáy mắt.",
        "en": "Really a white-matter tract of the brain, sheathed by the meninges all the way to the globe — so raised intracranial pressure is transmitted along the sheath and causes papilloedema, visible on fundoscopy.",
        "zh": "实为脑的白质纤维束，被脑膜包裹直至眼球——故颅内压增高沿鞘膜传导引起视盘水肿，眼底镜下可见。"
      },
      "tint": "#d9c27a",
      "parts": [
        "FJ1313"
      ]
    }
  ]
});
