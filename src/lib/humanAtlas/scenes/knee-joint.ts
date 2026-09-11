/**
 * Scene "Khớp gối" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chằng chéo, dây chằng bên, sụn chêm và bao khớp — bài dạy xương + cơ vận động.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const kneeJointScene: AtlasSceneDef = {
  "slug": "khop-goi",
  "title": {
    "vi": "Khớp gối: xương và cơ vận động",
    "en": "The Knee Joint: Bones and Movers",
    "zh": "膝关节：骨与运动肌"
  },
  "latin": "Articulatio genus",
  "intro": {
    "vi": "Khớp gối là khớp lớn nhất cơ thể. Lồi cầu xương đùi tròn đặt trên mâm chày gần như phẳng, nên độ vững dựa gần hết vào dây chằng và cơ. Xương bánh chè nằm trong gân cơ tứ đầu, làm tăng cánh tay đòn khi duỗi gối. Xương mác không tham gia khớp gối. Scene chia cơ theo động tác: duỗi (tứ đầu), gấp (nhóm đùi sau, cơ bụng chân), và cơ khoeo mở khoá gối. Bộ dữ liệu không có dây chằng chéo, dây chằng bên và sụn chêm; phần này chỉ mô tả trong ghi chú.",
    "en": "The knee is the largest joint in the body. The rounded femoral condyles sit on an almost flat tibial plateau, so stability depends almost entirely on ligaments and muscles. The patella lies within the quadriceps tendon and lengthens its lever arm in extension. The fibula takes no part in the knee joint. The scene groups muscles by action: extension (quadriceps), flexion (hamstrings, gastrocnemius) and popliteus, which unlocks the knee. The dataset has no cruciate or collateral ligaments and no menisci; these appear only in the notes.",
    "zh": "膝关节是人体最大的关节。圆形的股骨髁置于近乎平坦的胫骨平台上，稳定性几乎全靠韧带和肌肉。髌骨位于股四头肌腱内，伸膝时增大力臂。腓骨不参与膝关节。本场景按动作分组：伸（股四头肌）、屈（腘绳肌、腓肠肌）以及解锁膝关节的腘肌。数据集中无交叉韧带、侧副韧带和半月板，仅在注释中描述。"
  },
  "frameGroups": [
    "xuong",
    "duoi",
    "gap",
    "khoeo"
  ],
  "groups": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương đùi, chày, bánh chè, mác",
        "en": "Femur, tibia, patella, fibula",
        "zh": "股骨、胫骨、髌骨、腓骨"
      },
      "latin": "Femur · Tibia · Patella · Fibula",
      "note": {
        "vi": "Khi duỗi hết, xương đùi xoay trong nhẹ trên xương chày để khoá gối, nhờ vậy đứng lâu mà cơ gần như nghỉ. Dây chằng chéo trước chặn xương chày trượt ra trước; đây là dây chằng hay đứt nhất khi xoay người đột ngột.",
        "en": "At full extension the femur rotates slightly medially on the tibia and locks the knee, so we can stand with the muscles almost at rest. The anterior cruciate ligament stops the tibia sliding forward; it is the ligament most often torn in a sudden pivot.",
        "zh": "完全伸直时股骨在胫骨上轻度内旋而锁定膝关节，使人站立时肌肉几乎放松。前交叉韧带阻止胫骨前移，是突然扭转时最常断裂的韧带。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3259",
        "FJ3260",
        "FJ3275",
        "FJ3282"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Cơ tứ đầu đùi (duỗi gối)",
        "en": "Quadriceps femoris (knee extensor)",
        "zh": "股四头肌（伸膝）"
      },
      "latin": "M. quadriceps femoris",
      "note": {
        "vi": "Gồm cơ thẳng đùi, rộng ngoài, rộng trong và rộng giữa, hội vào gân bánh chè bám lồi củ chày. Rộng trong có thớ dưới chếch, giữ bánh chè không trượt ra ngoài; cơ này teo sớm sau chấn thương gối.",
        "en": "Rectus femoris and vastus lateralis, medialis and intermedius converge on the patellar tendon to the tibial tuberosity. The oblique lower fibres of vastus medialis stop the patella slipping laterally; this muscle wastes early after a knee injury.",
        "zh": "由股直肌、股外侧肌、股内侧肌和股中间肌组成，汇成髌韧带止于胫骨粗隆。股内侧肌下部斜行纤维防止髌骨外滑；膝损伤后此肌最早萎缩。"
      },
      "tint": "#6f8fbf",
      "parts": [
        "FJ1433M",
        "FJ1441M",
        "FJ1442M",
        "FJ1443M"
      ]
    },
    {
      "key": "gap",
      "name": {
        "vi": "Cơ gấp gối: nhóm đùi sau và cơ bụng chân",
        "en": "Knee flexors: hamstrings and gastrocnemius",
        "zh": "屈膝肌：腘绳肌与腓肠肌"
      },
      "latin": "Mm. biceps femoris, semitendinosus, semimembranosus, gastrocnemius",
      "note": {
        "vi": "Nhị đầu đùi bám chỏm mác; bán gân và bán màng bám mặt trong xương chày. Cơ bụng chân có hai đầu bám hai lồi cầu đùi nên cũng gấp gối.",
        "en": "Biceps femoris inserts on the fibular head; semitendinosus and semimembranosus on the medial tibia. Gastrocnemius arises by two heads from the femoral condyles, so it also flexes the knee.",
        "zh": "股二头肌止于腓骨头；半腱肌和半膜肌止于胫骨内侧。腓肠肌两头起于股骨两髁，故亦屈膝。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1394M",
        "FJ1395M",
        "FJ1397M",
        "FJ1435M",
        "FJ1436M",
        "FJ1444M"
      ]
    },
    {
      "key": "chan-ngong",
      "name": {
        "vi": "Cơ may và cơ thon (chân ngỗng)",
        "en": "Sartorius and gracilis (pes anserinus)",
        "zh": "缝匠肌与股薄肌（鹅足）"
      },
      "latin": "Pes anserinus: Mm. sartorius, gracilis, semitendinosus",
      "note": {
        "vi": "Gân cơ may, cơ thon và cơ bán gân bám chung ở mặt trong đầu trên xương chày, xoè ra như chân ngỗng. Túi hoạt dịch dưới chỗ bám này hay viêm, gây đau mặt trong gối.",
        "en": "The tendons of sartorius, gracilis and semitendinosus insert together on the upper medial tibia, spreading like a goose's foot. The bursa beneath them often inflames, causing medial knee pain.",
        "zh": "缝匠肌、股薄肌和半腱肌腱共同止于胫骨上端内侧，展开如鹅足。其下滑囊常发炎，引起膝内侧疼痛。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1421M",
        "FJ1434M"
      ]
    },
    {
      "key": "khoeo",
      "name": {
        "vi": "Cơ khoeo (mở khoá gối)",
        "en": "Popliteus (unlocks the knee)",
        "zh": "腘肌（解锁膝关节）"
      },
      "latin": "M. popliteus",
      "note": {
        "vi": "Cơ nhỏ, chéo sau khớp, từ lồi cầu ngoài xương đùi tới mặt sau xương chày. Khi bắt đầu gấp, nó xoay ngoài xương đùi để mở khoá gối.",
        "en": "A small muscle crossing behind the joint from the lateral femoral condyle to the back of the tibia. At the start of flexion it rotates the femur laterally to unlock the knee.",
        "zh": "斜跨关节后方的小肌，自股骨外侧髁至胫骨后面。屈膝开始时使股骨外旋以解锁膝关节。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1430M"
      ]
    },
    {
      "key": "dai-chau-chay",
      "name": {
        "vi": "Dải chậu–chày",
        "en": "Iliotibial tract",
        "zh": "髂胫束"
      },
      "latin": "Tractus iliotibialis",
      "note": {
        "vi": "Dải cân dày ở mặt ngoài đùi, bám lồi củ Gerdy của xương chày, giữ vững mặt ngoài gối. Nó cọ vào lồi cầu ngoài xương đùi gây đau gối ở người chạy bộ.",
        "en": "A thick fascial band on the outer thigh inserting on Gerdy's tubercle of the tibia, steadying the outer knee. Friction over the lateral femoral condyle causes runner's knee pain.",
        "zh": "大腿外侧的厚筋膜带，止于胫骨Gerdy结节，稳定膝外侧。在股骨外侧髁上摩擦可致跑步者膝痛。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1423M"
      ]
    }
  ]
};
