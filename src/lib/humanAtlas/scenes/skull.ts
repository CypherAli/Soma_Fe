/**
 * Scene "Giải phẫu Sọ" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-skull.mjs — mọi mã FJ đều là mảnh
 * CÓ THẬT trong manifest. Đừng sửa tay file này.
 *
 * Đã xử lý: xương lệ (`sensory`) và xoăn mũi dưới (`respiratory`) bị xếp nhầm
 * hệ nên lấy theo tên; bỏ bản sao xương móng FJ3201; bỏ lợi (mô mềm).
 */
import type { AtlasSceneDef } from "./types";

export const skullScene: AtlasSceneDef = {
  slug: "giai-phau-so",
  title: { vi: "Giải phẫu Sọ", en: "Anatomy of the Skull", zh: "颅骨解剖" },
  latin: "Cranium",
  intro: {
    vi: "Sọ gồm hộp sọ não (8 xương: trán, 2 đỉnh, chẩm, 2 thái dương, bướm, sàng) bao bọc não, và khối xương mặt (14 xương) nâng đỡ mặt, hốc mắt, hốc mũi, cung răng. Các xương gắn chặt bằng khớp sợi (khớp vành, khớp dọc, khớp lam-đa); chỉ xương hàm dưới cử động được. Mỗi xương tô một màu để thấy đường khớp — ngoài đời cùng màu ngà. Bật Tách rời để tách từng xương khỏi nhau.",
    en: "The skull consists of the neurocranium (8 bones: frontal, 2 parietal, occipital, 2 temporal, sphenoid, ethmoid) enclosing the brain, and the facial skeleton (14 bones) supporting the face, orbits, nasal cavity and dental arches. The bones are locked together by fibrous sutures (coronal, sagittal, lambdoid); only the mandible moves. Each bone has its own colour to reveal the sutures — in life they are all ivory. Use Explode to pull the bones apart.",
    zh: "颅骨由包绕脑的脑颅（8块：额骨、2块顶骨、枕骨、2块颞骨、蝶骨、筛骨）和支撑面部、眼眶、鼻腔及牙弓的面颅（14块）组成。各骨借纤维性缝（冠状缝、矢状缝、人字缝）紧密相连，仅下颌骨可活动。每块骨各用一色以显示骨缝——实际均为象牙色。使用“分解”可将各骨分开。",
  },
  frameGroups: ["xuong-tran","xuong-dinh","xuong-cham","xuong-thai-duong","xuong-buom","xuong-sang","xuong-ham-tren","xuong-go-ma","xuong-mui-le","xuong-khau-cai-la-mia","xuong-ham-duoi"],
  groups: [
    {
        "key": "xuong-tran",
        "name": {
            "vi": "Xương trán",
            "en": "Frontal bone",
            "zh": "额骨"
        },
        "latin": "Os frontale",
        "note": {
            "vi": "Xương đơn tạo trán và trần hốc mắt, chứa xoang trán. Khớp với hai xương đỉnh qua khớp vành — nơi thóp trước (thóp lớn) đóng lúc trẻ khoảng 18 tháng.",
            "en": "A single bone forming the forehead and the roof of the orbits; it contains the frontal sinus. It meets the two parietal bones at the coronal suture, where the anterior fontanelle closes at about 18 months.",
            "zh": "单块骨，构成前额与眶顶，内含额窦。与两块顶骨以冠状缝相接，前囟约在18个月时闭合于此。"
        },
        "tint": "#d9a066",
        "parts": [
            "FJ3200"
        ]
    },
    {
        "key": "xuong-dinh",
        "name": {
            "vi": "Xương đỉnh",
            "en": "Parietal bones",
            "zh": "顶骨"
        },
        "latin": "Os parietale",
        "note": {
            "vi": "Cặp xương lớn nhất vòm sọ, gặp nhau ở đường giữa qua khớp dọc. Mặt trong có rãnh của động mạch màng não giữa — vỡ xương vùng thái dương-đỉnh làm rách mạch này gây máu tụ ngoài màng cứng với \"khoảng tỉnh\" kinh điển.",
            "en": "The largest pair of vault bones, meeting in the midline at the sagittal suture. Their inner surface is grooved by the middle meningeal artery — a temporoparietal fracture that tears it causes an extradural haematoma with the classic \"lucid interval\".",
            "zh": "颅盖最大的一对骨，在中线以矢状缝相接。其内面有脑膜中动脉沟——颞顶部骨折撕裂该动脉可导致硬膜外血肿，典型表现为“中间清醒期”。"
        },
        "tint": "#e3c27a",
        "parts": [
            "FJ3274",
            "FJ3380"
        ]
    },
    {
        "key": "xuong-cham",
        "name": {
            "vi": "Xương chẩm",
            "en": "Occipital bone",
            "zh": "枕骨"
        },
        "latin": "Os occipitale",
        "note": {
            "vi": "Tạo phần sau và đáy hộp sọ, có lỗ lớn cho hành não đi qua nối với tuỷ sống. Hai lồi cầu chẩm khớp với đốt đội (C1) cho động tác gật đầu.",
            "en": "Forms the back and base of the skull and contains the foramen magnum, through which the medulla continues into the spinal cord. Its two occipital condyles articulate with the atlas (C1) for nodding.",
            "zh": "构成颅后部与颅底，有枕骨大孔供延髓与脊髓相连。两个枕髁与寰椎（C1）相关节，完成点头动作。"
        },
        "tint": "#c98a5a",
        "parts": [
            "FJ3309"
        ]
    },
    {
        "key": "xuong-thai-duong",
        "name": {
            "vi": "Xương thái dương",
            "en": "Temporal bones",
            "zh": "颞骨"
        },
        "latin": "Os temporale",
        "note": {
            "vi": "Chứa ống tai ngoài và phần đá — nơi đặt tai giữa, tai trong. Mỏm chũm ở sau tai là chỗ bám cơ ức-đòn-chũm; mỏm gò má cùng xương gò má tạo cung gò má. Hố hàm dưới tiếp khớp với lồi cầu xương hàm dưới. (Atlas không có ba xương con trong tai giữa.)",
            "en": "Houses the external acoustic meatus and the petrous part, which encloses the middle and inner ear. The mastoid process behind the ear anchors sternocleidomastoid; its zygomatic process joins the zygomatic bone to form the zygomatic arch. The mandibular fossa receives the condyle of the mandible. (The atlas has no middle-ear ossicles.)",
            "zh": "含外耳道与岩部，岩部容纳中耳和内耳。耳后的乳突为胸锁乳突肌附着处；颧突与颧骨共同构成颧弓。下颌窝与下颌骨髁突相关节。（图谱中无中耳听小骨。）"
        },
        "tint": "#b9785a",
        "parts": [
            "FJ3281",
            "FJ3386"
        ]
    },
    {
        "key": "xuong-buom",
        "name": {
            "vi": "Xương bướm",
            "en": "Sphenoid bone",
            "zh": "蝶骨"
        },
        "latin": "Os sphenoidale",
        "note": {
            "vi": "Xương hình cánh bướm nằm giữa nền sọ, tiếp khớp với gần như mọi xương sọ khác. Hố yên trên thân xương chứa tuyến yên — u tuyến yên phát triển lên trên chèn giao thoa thị giác gây bán manh hai thái dương.",
            "en": "A butterfly-shaped bone in the middle of the skull base that articulates with almost every other cranial bone. The sella turcica on its body holds the pituitary gland — a pituitary tumour growing upward compresses the optic chiasm and causes bitemporal hemianopia.",
            "zh": "位于颅底中央的蝶形骨，几乎与所有其他颅骨相关节。体部的蝶鞍容纳垂体——垂体瘤向上生长压迫视交叉，导致双颞侧偏盲。"
        },
        "tint": "#9b6fae",
        "parts": [
            "FJ3394"
        ]
    },
    {
        "key": "xuong-sang",
        "name": {
            "vi": "Xương sàng",
            "en": "Ethmoid bone",
            "zh": "筛骨"
        },
        "latin": "Os ethmoidale",
        "note": {
            "vi": "Xương nhẹ, nhiều hốc khí nằm giữa hai hốc mắt. Mảnh sàng thủng lỗ cho sợi khứu giác đi lên — vỡ nền sọ trước làm rách màng cứng ở đây gây chảy dịch não tuỷ qua mũi và mất khứu giác.",
            "en": "A light, air-cell-filled bone between the two orbits. Its cribriform plate is perforated for the olfactory fibres — an anterior skull-base fracture that tears the dura here causes CSF rhinorrhoea and loss of smell.",
            "zh": "位于两眶之间、充满气房的轻薄骨。筛板上有孔供嗅神经纤维穿过——颅前窝骨折撕裂此处硬膜可导致脑脊液鼻漏及嗅觉丧失。"
        },
        "tint": "#7d9e6a",
        "parts": [
            "FJ3199"
        ]
    },
    {
        "key": "xuong-ham-tren",
        "name": {
            "vi": "Xương hàm trên",
            "en": "Maxillae",
            "zh": "上颌骨"
        },
        "latin": "Maxilla",
        "note": {
            "vi": "Cặp xương trung tâm của khối mặt: mang cung răng trên, tạo nền hốc mắt, thành ngoài hốc mũi và phần trước khẩu cái cứng. Thân xương rỗng là xoang hàm — xoang lớn nhất, chân răng hàm trên có thể nhô vào sàn xoang nên nhiễm trùng răng lan thành viêm xoang.",
            "en": "The central pair of the facial skeleton: it carries the upper teeth and forms the floor of the orbit, the lateral wall of the nasal cavity and the front of the hard palate. Its hollow body is the maxillary sinus — the largest sinus; upper molar roots can project into its floor, so dental infection spreads into sinusitis.",
            "zh": "面颅中央的一对骨：承载上牙列，构成眶底、鼻腔外侧壁及硬腭前部。其中空的体部为上颌窦——最大的鼻旁窦；上颌磨牙根可突入窦底，故牙源性感染可蔓延为鼻窦炎。"
        },
        "tint": "#6f93b8",
        "parts": [
            "FJ3269",
            "FJ3375"
        ]
    },
    {
        "key": "xuong-go-ma",
        "name": {
            "vi": "Xương gò má",
            "en": "Zygomatic bones",
            "zh": "颧骨"
        },
        "latin": "Os zygomaticum",
        "note": {
            "vi": "Tạo gò má và thành ngoài hốc mắt; mỏm thái dương của nó cùng mỏm gò má xương thái dương tạo cung gò má. Là xương mặt hay gãy do va đập — gãy di lệch có thể kẹt cơ vận nhãn gây nhìn đôi.",
            "en": "Forms the cheek prominence and the lateral wall of the orbit; its temporal process joins the zygomatic process of the temporal bone to make the zygomatic arch. It is a commonly fractured facial bone — a displaced fracture can trap an extraocular muscle and cause double vision.",
            "zh": "构成颧部隆起与眶外侧壁；其颞突与颞骨颧突共同构成颧弓。是面部骨折的常见部位——移位骨折可嵌顿眼外肌导致复视。"
        },
        "tint": "#5f9ea3",
        "parts": [
            "FJ3287",
            "FJ3392"
        ]
    },
    {
        "key": "xuong-mui-le",
        "name": {
            "vi": "Xương mũi và xương lệ",
            "en": "Nasal and lacrimal bones",
            "zh": "鼻骨与泪骨"
        },
        "latin": "Os nasale · Os lacrimale",
        "note": {
            "vi": "Hai xương mũi tạo sống mũi — xương mặt gãy nhiều nhất. Xương lệ mỏng như giấy ở thành trong hốc mắt, có hố chứa túi lệ; ống lệ-mũi đi từ đây xuống ngách mũi dưới nên khóc thì chảy nước mũi. (Atlas xếp xương lệ vào hệ giác quan.)",
            "en": "The two nasal bones form the bridge of the nose — the most frequently fractured facial bones. The paper-thin lacrimal bone in the medial orbital wall holds the lacrimal sac; the nasolacrimal duct runs from here to the inferior meatus, which is why crying makes the nose run. (The atlas files the lacrimal bone under the sense organs.)",
            "zh": "两块鼻骨构成鼻梁——面部最易骨折的骨。菲薄如纸的泪骨位于眶内侧壁，容纳泪囊；鼻泪管由此通向下鼻道，故哭泣时会流鼻涕。（图谱将泪骨归入感觉器官。）"
        },
        "tint": "#8aa7c9",
        "parts": [
            "FJ3265",
            "FJ3272",
            "FJ3371",
            "FJ3378"
        ]
    },
    {
        "key": "xuong-khau-cai-la-mia",
        "name": {
            "vi": "Xương khẩu cái, lá mía, xoăn mũi dưới",
            "en": "Palatine bones, vomer, inferior conchae",
            "zh": "腭骨、犁骨、下鼻甲"
        },
        "latin": "Os palatinum · Vomer · Concha nasalis inferior",
        "note": {
            "vi": "Nhóm xương sâu của hốc mũi. Xương khẩu cái tạo phần sau khẩu cái cứng; khe hở vòm miệng là do hai mảnh khẩu cái không liền ở đường giữa. Xương lá mía tạo phần sau vách ngăn mũi. Xoăn mũi dưới là xương riêng, làm ấm và ẩm không khí hít vào. (Atlas xếp xoăn mũi dưới vào hệ hô hấp.)",
            "en": "The deep bones of the nasal cavity. The palatine bones form the back of the hard palate; cleft palate results when the palatal shelves fail to fuse in the midline. The vomer forms the back of the nasal septum. The inferior concha is a separate bone that warms and humidifies inhaled air. (The atlas files the inferior concha under the respiratory system.)",
            "zh": "鼻腔深部的骨。腭骨构成硬腭后部；腭裂即两侧腭突未在中线融合所致。犁骨构成鼻中隔后部。下鼻甲为独立的骨，温暖和湿润吸入的空气。（图谱将下鼻甲归入呼吸系统。）"
        },
        "tint": "#7c86b8",
        "parts": [
            "FJ3263",
            "FJ3273",
            "FJ3369",
            "FJ3379",
            "FJ3395"
        ]
    },
    {
        "key": "xuong-ham-duoi",
        "name": {
            "vi": "Xương hàm dưới",
            "en": "Mandible",
            "zh": "下颌骨"
        },
        "latin": "Mandibula",
        "note": {
            "vi": "Xương duy nhất của sọ cử động được, khớp với xương thái dương qua khớp thái dương-hàm. Hình chữ U nên thường gãy ở HAI chỗ cùng lúc (ví dụ thân bên này và lồi cầu bên kia) — thấy một đường gãy phải tìm đường thứ hai.",
            "en": "The only movable bone of the skull, joined to the temporal bone at the temporomandibular joint. Because it is a U-shaped ring it usually breaks in TWO places at once (e.g. the body on one side and the condyle on the other) — find one fracture and you must look for the second.",
            "zh": "颅骨中唯一可活动的骨，经颞下颌关节与颞骨相连。由于呈U形环状，常同时在两处骨折（如一侧体部和对侧髁突）——发现一处骨折必须寻找第二处。"
        },
        "parts": [
            "FJ3289"
        ]
    },
    {
        "key": "rang",
        "name": {
            "vi": "Răng vĩnh viễn",
            "en": "Permanent teeth",
            "zh": "恒牙"
        },
        "latin": "Dentes permanentes",
        "note": {
            "vi": "28 răng vĩnh viễn trên hai cung: mỗi phần tư có 2 răng cửa, 1 răng nanh, 2 răng tiền hàm, 2 răng hàm. Bộ dữ liệu không có răng khôn (răng hàm thứ ba) nên thiếu 4 chiếc so với bộ 32 răng đầy đủ.",
            "en": "28 permanent teeth in two arches: each quadrant has 2 incisors, 1 canine, 2 premolars and 2 molars. The dataset has no wisdom teeth (third molars), so it has 4 fewer than the full set of 32.",
            "zh": "上下两弓共28颗恒牙：每个象限有2颗切牙、1颗尖牙、2颗前磨牙和2颗磨牙。数据集中无智齿（第三磨牙），故比完整的32颗少4颗。"
        },
        "parts": [
            "FJ1254",
            "FJ1255",
            "FJ1256",
            "FJ1257",
            "FJ1258",
            "FJ1259",
            "FJ1260",
            "FJ1261",
            "FJ1262",
            "FJ1263",
            "FJ1264",
            "FJ1265",
            "FJ1266",
            "FJ1267",
            "FJ1268",
            "FJ1269",
            "FJ1270",
            "FJ1271",
            "FJ1272",
            "FJ1273",
            "FJ1274",
            "FJ1275",
            "FJ1276",
            "FJ1277",
            "FJ1278",
            "FJ1279",
            "FJ1280",
            "FJ1281"
        ]
    },
    {
        "key": "xuong-mong",
        "name": {
            "vi": "Xương móng",
            "en": "Hyoid bone",
            "zh": "舌骨"
        },
        "latin": "Os hyoideum",
        "note": {
            "vi": "Xương hình móng ngựa ở cổ, là xương DUY NHẤT không khớp với xương nào khác — chỉ treo bằng cơ và dây chằng. Làm điểm tựa cho lưỡi và nuốt. Gãy xương móng ở người chết gợi ý bị bóp cổ.",
            "en": "A horseshoe-shaped bone in the neck and the ONLY bone that articulates with no other bone — it is slung by muscles and ligaments alone. It anchors the tongue and swallowing. A fractured hyoid at autopsy suggests manual strangulation.",
            "zh": "位于颈部的马蹄形骨，是唯一不与其他骨相关节的骨——仅由肌肉和韧带悬吊。为舌及吞咽提供支点。尸检发现舌骨骨折提示扼颈。"
        },
        "tint": "#b0a27a",
        "parts": [
            "FJ2772"
        ]
    }
],
};
