
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Thần kinh mắt (V1)" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas CHỈ có nhánh V1 trong hốc mắt (không có hạch sinh ba, V2, V3). Bên trái (bẫy #13).
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const ophthalmicNerveScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/ophthalmic-nerve.ts#ophthalmicNerveScene", {
  "slug": "than-kinh-sinh-ba",
  "title": {
    "vi": "Thần kinh mắt (V1) và các dây trong hốc mắt",
    "en": "The Ophthalmic Nerve (V1) and Orbital Nerves",
    "zh": "眼神经（V1）与眶内神经"
  },
  "latin": "N. ophthalmicus",
  "intro": {
    "vi": "Dây sinh ba (V) có ba nhánh: mắt (V1), hàm trên (V2), hàm dưới (V3). Bộ dữ liệu chỉ có nhánh V1 trong hốc mắt nên scene tập trung vào đây. V1 là nhánh cảm giác, qua khe ổ mắt trên và chia ba: dây trán, dây lệ và dây mũi–mi. Dây trán cho dây trên ổ mắt và trên ròng rọc, nuôi cảm giác trán. Dây mũi–mi cho dây mi dài (cảm giác giác mạc) và dây sàng. Vì thế zona ở V1 có mụn nước đầu mũi (dấu Hutchinson), báo hiệu nguy cơ tổn thương mắt. Scene còn có dây vận nhãn III, IV và hạch mi để so sánh. Dây cảm giác màu vàng, dây vận động màu cam; nhãn cầu và cơ mờ sẵn.",
    "en": "The trigeminal nerve (V) has three divisions: ophthalmic (V1), maxillary (V2) and mandibular (V3). The dataset has only V1 in the orbit, so the scene focuses there. V1 is sensory; it passes through the superior orbital fissure and splits into three: frontal, lacrimal and nasociliary nerves. The frontal nerve gives the supraorbital and supratrochlear nerves to the forehead. The nasociliary gives the long ciliary nerves (corneal sensation) and ethmoidal nerves. So shingles in V1 with blisters on the nose tip (Hutchinson's sign) warns of eye involvement. The scene also shows the motor nerves III and IV and the ciliary ganglion for comparison. Sensory nerves are yellow, motor orange; the eyeball and muscles are faded.",
    "zh": "三叉神经（V）分三支：眼神经（V1）、上颌神经（V2）、下颌神经（V3）。数据集中仅有眶内的V1，故本场景以此为主。V1为感觉神经，经眶上裂分为额神经、泪腺神经和鼻睫神经。额神经发出眶上神经和滑车上神经，分布于前额；鼻睫神经发出睫状长神经（角膜感觉）和筛神经。故V1带状疱疹出现鼻尖水疱（Hutchinson征）提示眼部受累。场景还显示动眼、滑车神经及睫状神经节作对照。感觉神经黄色，运动神经橙色；眼球和眼肌淡化。"
  },
  "frameGroups": [
    "goc",
    "tran",
    "mui-mi",
    "le"
  ],
  "fadedGroups": [
    "mat"
  ],
  "groups": [
    {
      "key": "goc",
      "name": {
        "vi": "Thân dây mắt (V1)",
        "en": "Ophthalmic nerve trunk (V1)",
        "zh": "眼神经干（V1）"
      },
      "latin": "N. ophthalmicus",
      "note": {
        "vi": "Đi trong thành ngoài xoang tĩnh mạch hang rồi chia nhánh trước khi vào hốc mắt.",
        "en": "Runs in the lateral wall of the cavernous sinus and divides just before entering the orbit.",
        "zh": "行于海绵窦外侧壁，入眶前分支。"
      },
      "tint": "#d9a400",
      "parts": [
        "FJ1312"
      ]
    },
    {
      "key": "tran",
      "name": {
        "vi": "Dây trán và hai nhánh tận",
        "en": "Frontal nerve and its two terminal branches",
        "zh": "额神经及其两终支"
      },
      "latin": "N. frontalis · N. supraorbitalis · N. supratrochlearis",
      "note": {
        "vi": "Chạy trên cơ nâng mi, chia dây trên ổ mắt (qua khuyết trên ổ mắt) và dây trên ròng rọc. Hai dây này là đích gây tê vùng trán.",
        "en": "Runs on levator palpebrae and divides into the supraorbital nerve (through the supraorbital notch) and supratrochlear nerve — the targets for a forehead block.",
        "zh": "行于上睑提肌上方，分为眶上神经（经眶上切迹）和滑车上神经，为前额阻滞麻醉的靶点。"
      },
      "tint": "#f2c14e",
      "parts": [
        "FJ1290",
        "FJ1325",
        "FJ1326"
      ]
    },
    {
      "key": "mui-mi",
      "name": {
        "vi": "Dây mũi–mi và nhánh",
        "en": "Nasociliary nerve and branches",
        "zh": "鼻睫神经及分支"
      },
      "latin": "N. nasociliaris et rami",
      "note": {
        "vi": "Cho dây mi dài (cảm giác giác mạc, nhánh vào của phản xạ giác mạc), dây sàng trước và sau, dây dưới ròng rọc, cùng nhánh thông với hạch mi.",
        "en": "Gives the long ciliary nerves (corneal sensation, the afferent limb of the corneal reflex), the anterior and posterior ethmoidal nerves, the infratrochlear nerve and a communicating branch to the ciliary ganglion.",
        "zh": "发出睫状长神经（角膜感觉，角膜反射传入支）、筛前和筛后神经、滑车下神经，以及至睫状神经节的交通支。"
      },
      "tint": "#e6d36a",
      "parts": [
        "FJ1283",
        "FJ1296",
        "FJ1310",
        "FJ1311",
        "FJ1315",
        "FJ1318"
      ]
    },
    {
      "key": "le",
      "name": {
        "vi": "Dây lệ",
        "en": "Lacrimal nerve",
        "zh": "泪腺神经"
      },
      "latin": "N. lacrimalis",
      "note": {
        "vi": "Nhánh nhỏ nhất, chạy dọc bờ trên cơ thẳng ngoài tới tuyến lệ. Nó mang thêm sợi tiết dịch từ dây VII, mượn đường qua nhánh V2.",
        "en": "The smallest branch, running along the upper border of lateral rectus to the lacrimal gland. It also carries secretory fibres from nerve VII, borrowed via a V2 branch.",
        "zh": "最细的分支，沿外直肌上缘至泪腺，并借V2分支携带来自面神经的分泌纤维。"
      },
      "tint": "#c9b458",
      "parts": [
        "FJ1300"
      ]
    },
    {
      "key": "van-dong",
      "name": {
        "vi": "Dây vận nhãn III và IV (so sánh)",
        "en": "Oculomotor (III) and trochlear (IV) nerves (for comparison)",
        "zh": "动眼神经（III）与滑车神经（IV）（对照）"
      },
      "latin": "N. oculomotorius (rr. superior, inferior) · N. trochlearis",
      "note": {
        "vi": "Dây III chia nhánh trên (cơ thẳng trên, nâng mi) và nhánh dưới (thẳng trong, thẳng dưới, chéo dưới). Dây IV chỉ vận động cơ chéo trên.",
        "en": "Nerve III splits into a superior branch (superior rectus, levator) and an inferior branch (medial and inferior rectus, inferior oblique). Nerve IV supplies only superior oblique.",
        "zh": "动眼神经分上支（上直肌、上睑提肌）和下支（内直肌、下直肌、下斜肌）。滑车神经仅支配上斜肌。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1293",
        "FJ1321",
        "FJ1330"
      ]
    },
    {
      "key": "hach-mi",
      "name": {
        "vi": "Hạch mi và dây mi ngắn",
        "en": "Ciliary ganglion and short ciliary nerves",
        "zh": "睫状神经节与睫状短神经"
      },
      "latin": "Ganglion ciliare · Nn. ciliares breves",
      "note": {
        "vi": "Hạch phó giao cảm của dây III. Dây mi ngắn mang sợi làm co đồng tử và điều tiết. Đây là nhánh ra của phản xạ ánh sáng.",
        "en": "The parasympathetic ganglion of nerve III. The short ciliary nerves carry fibres that constrict the pupil and accommodate the lens — the efferent limb of the light reflex.",
        "zh": "动眼神经的副交感神经节。睫状短神经携带缩瞳和调节纤维，为光反射的传出支。"
      },
      "tint": "#6fae7f",
      "parts": [
        "FJ1288",
        "FJ1319"
      ]
    },
    {
      "key": "thi",
      "name": {
        "vi": "Dây thị giác (II)",
        "en": "Optic nerve (II)",
        "zh": "视神经（II）"
      },
      "latin": "N. opticus",
      "note": {
        "vi": "Mốc trung tâm của hốc mắt; động mạch mắt đi bên dưới nó qua ống thị giác.",
        "en": "The central landmark of the orbit; the ophthalmic artery runs beneath it through the optic canal.",
        "zh": "眶内中央标志；眼动脉在其下方经视神经管入眶。"
      },
      "tint": "#e3e0d6",
      "parts": [
        "FJ1313",
        "FJ1772"
      ]
    },
    {
      "key": "mat",
      "name": {
        "vi": "Nhãn cầu và cơ vận nhãn (mốc)",
        "en": "Eyeball and extraocular muscles (landmarks)",
        "zh": "眼球与眼外肌（标志）"
      },
      "latin": "Bulbus oculi · Mm. bulbi",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ1289",
        "FJ1294",
        "FJ1295",
        "FJ1304",
        "FJ1306",
        "FJ1308",
        "FJ1317",
        "FJ1322",
        "FJ1323"
      ]
    }
  ]
});
