
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Miệng, lưỡi và răng" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu cơ nội tại lưỡi, cơ trâm–lưỡi, khẩu cái–lưỡi, amidan.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const oralCavityScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/oral-cavity.ts#oralCavityScene", {
  "slug": "mieng-luoi-rang",
  "title": {
    "vi": "Ổ miệng: răng, lưỡi và vòm miệng",
    "en": "The Oral Cavity: Teeth, Tongue and Palate",
    "zh": "口腔：牙、舌与腭"
  },
  "latin": "Cavitas oris",
  "intro": {
    "vi": "Ổ miệng được giới hạn trước bởi môi, hai bên bởi má, trên bởi vòm miệng, dưới bởi lưỡi và sàn miệng. Người trưởng thành có 32 răng vĩnh viễn, mỗi cung 16 chiếc: 4 răng cửa, 2 răng nanh, 4 răng hàm nhỏ, 6 răng hàm lớn. Lưỡi là khối cơ di động do dây XII vận động. Cơ cằm–lưỡi, cơ chính của lưỡi, kéo lưỡi ra trước và giữ đường thở thông khi ngủ. Vòm miệng mềm nâng lên khi nuốt để bịt đường lên mũi. Mỗi nhóm răng một tông, lưỡi đỏ hồng, cơ vòm tím; xương hàm mờ sẵn.",
    "en": "The oral cavity is bounded by the lips in front, the cheeks at the sides, the palate above and the tongue and floor of the mouth below. Adults have 32 permanent teeth, 16 per arch: 4 incisors, 2 canines, 4 premolars, 6 molars. The tongue is a mobile mass of muscle moved by nerve XII. Genioglossus, its main muscle, protrudes it and keeps the airway open in sleep. The soft palate rises during swallowing to seal off the nose. Each tooth group has its own shade, the tongue is pink-red and the palatal muscles purple; the jaws are faded.",
    "zh": "口腔前界为唇，两侧为颊，上为腭，下为舌和口底。成人有32颗恒牙，每弓16颗：切牙4、尖牙2、前磨牙4、磨牙6。舌是由舌下神经支配的可动肌块。颏舌肌为舌的主要肌肉，使舌前伸并在睡眠时保持气道通畅。吞咽时软腭上提封闭鼻咽。每组牙一种色调，舌粉红，腭肌紫色；颌骨淡化。"
  },
  "frameGroups": [
    "cua-nanh",
    "ham-nho",
    "ham-lon",
    "luoi",
    "vom"
  ],
  "fadedGroups": [
    "ham"
  ],
  "groups": [
    {
      "key": "cua-nanh",
      "name": {
        "vi": "Răng cửa và răng nanh",
        "en": "Incisors and canines",
        "zh": "切牙与尖牙"
      },
      "latin": "Dentes incisivi et canini",
      "note": {
        "vi": "Răng cửa cắt, răng nanh xé. Răng nanh có chân dài nhất, là trụ góc của cung răng.",
        "en": "Incisors cut and canines tear. The canine has the longest root and anchors the corner of the arch.",
        "zh": "切牙切断，尖牙撕裂。尖牙牙根最长，是牙弓转角的支柱。"
      },
      "tint": "#f2ecd8",
      "parts": [
        "FJ1258",
        "FJ1259",
        "FJ1260",
        "FJ1265",
        "FJ1266",
        "FJ1267",
        "FJ1272",
        "FJ1273",
        "FJ1274",
        "FJ1279",
        "FJ1280",
        "FJ1281"
      ]
    },
    {
      "key": "ham-nho",
      "name": {
        "vi": "Răng hàm nhỏ",
        "en": "Premolars",
        "zh": "前磨牙"
      },
      "latin": "Dentes premolares",
      "note": {
        "vi": "Hai núm, nghiền thức ăn. Không có ở bộ răng sữa; răng hàm nhỏ thay chỗ răng hàm sữa.",
        "en": "Two cusps, for crushing. Absent from the milk dentition; they replace the milk molars.",
        "zh": "双尖，研磨食物。乳牙列中无；前磨牙替换乳磨牙。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ1255",
        "FJ1257",
        "FJ1262",
        "FJ1264",
        "FJ1269",
        "FJ1271",
        "FJ1277",
        "FJ1278"
      ]
    },
    {
      "key": "ham-lon",
      "name": {
        "vi": "Răng hàm lớn",
        "en": "Molars",
        "zh": "磨牙"
      },
      "latin": "Dentes molares",
      "note": {
        "vi": "Mặt nhai rộng, nhiều núm. Răng số 8 (hàm lớn thứ ba) mọc muộn nhất, hay mọc lệch; bộ dữ liệu không có răng này.",
        "en": "Broad multi-cusped chewing surfaces. The third molar (wisdom tooth) erupts last and is often impacted; the dataset lacks it.",
        "zh": "咬合面宽大多尖。第三磨牙（智齿）萌出最晚，常阻生；数据集中无此牙。"
      },
      "tint": "#d9c08a",
      "parts": [
        "FJ1254",
        "FJ1256",
        "FJ1261",
        "FJ1263",
        "FJ1268",
        "FJ1270",
        "FJ1275",
        "FJ1276"
      ]
    },
    {
      "key": "loi",
      "name": {
        "vi": "Lợi (nướu)",
        "en": "Gingiva",
        "zh": "牙龈"
      },
      "latin": "Gingiva",
      "note": {
        "vi": "Niêm mạc bám chặt vào xương ổ răng và cổ răng.",
        "en": "Mucosa bound tightly to the alveolar bone and the necks of the teeth.",
        "zh": "紧附于牙槽骨和牙颈的黏膜。"
      },
      "tint": "#e8a0a0",
      "parts": [
        "FJ1252",
        "FJ1253"
      ]
    },
    {
      "key": "luoi",
      "name": {
        "vi": "Lưỡi và cơ ngoại lai",
        "en": "Tongue and extrinsic muscles",
        "zh": "舌与舌外肌"
      },
      "latin": "Lingua · Mm. genioglossus, hyoglossus",
      "note": {
        "vi": "Liệt dây XII một bên: khi thè, lưỡi lệch về bên liệt vì cơ cằm–lưỡi bên lành đẩy mạnh hơn. Cơ móng–lưỡi kéo lưỡi xuống.",
        "en": "With one-sided nerve XII palsy, the protruded tongue deviates to the paralysed side because the healthy genioglossus pushes harder. Hyoglossus pulls the tongue down.",
        "zh": "单侧舌下神经麻痹时，伸舌偏向患侧，因健侧颏舌肌推力更强。舌骨舌肌使舌下降。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ2761",
        "FJ2738",
        "FJ2739",
        "FJ2750",
        "FJ2751"
      ]
    },
    {
      "key": "vom",
      "name": {
        "vi": "Cơ vòm miệng mềm",
        "en": "Muscles of the soft palate",
        "zh": "软腭肌"
      },
      "latin": "Mm. levator et tensor veli palatini, m. uvulae",
      "note": {
        "vi": "Cơ nâng màn hầu nâng vòm; cơ căng màn hầu căng vòm và mở vòi tai khi nuốt (vì thế nuốt giúp cân bằng áp suất tai khi đi máy bay). Liệt dây X một bên làm lưỡi gà lệch về bên lành.",
        "en": "Levator veli palatini raises the palate; tensor veli palatini tightens it and opens the auditory tube when we swallow (which is why swallowing equalises ear pressure on a plane). A one-sided vagal palsy deviates the uvula to the healthy side.",
        "zh": "腭帆提肌上提软腭；腭帆张肌紧张软腭并在吞咽时开放咽鼓管（故乘飞机时吞咽可平衡耳压）。单侧迷走神经麻痹时悬雍垂偏向健侧。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ2741",
        "FJ2748",
        "FJ2753",
        "FJ2760",
        "FJ2762"
      ]
    },
    {
      "key": "moi",
      "name": {
        "vi": "Môi",
        "en": "Lips",
        "zh": "唇"
      },
      "latin": "Labia oris",
      "note": {
        "vi": "Ranh giới trước của ổ miệng.",
        "en": "The front boundary of the oral cavity.",
        "zh": "口腔前界。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ2814"
      ]
    },
    {
      "key": "ham",
      "name": {
        "vi": "Xương hàm trên, hàm dưới, khẩu cái (mốc)",
        "en": "Maxillae, mandible, palatine bones (landmarks)",
        "zh": "上颌骨、下颌骨、腭骨（标志）"
      },
      "latin": "Maxilla · Mandibula · Os palatinum",
      "note": {
        "vi": "Mờ sẵn — xương hàm trên và khẩu cái tạo vòm miệng cứng.",
        "en": "Faded — the maxillae and palatine bones form the hard palate.",
        "zh": "淡化——上颌骨和腭骨构成硬腭。"
      },
      "parts": [
        "FJ3269",
        "FJ3273",
        "FJ3289",
        "FJ3375",
        "FJ3379"
      ]
    }
  ]
});
