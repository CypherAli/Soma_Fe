/**
 * Scene "Giải phẫu cánh tay" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu thần kinh ngoại biên (cơ bì, quay, trụ, giữa) và vách gian cơ.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const armRegionScene: AtlasSceneDef = {
  "slug": "giai-phau-canh-tay",
  "title": {
    "vi": "Giải phẫu cánh tay",
    "en": "Anatomy of the Arm",
    "zh": "臂部解剖"
  },
  "latin": "Brachium",
  "intro": {
    "vi": "Cánh tay là đoạn chi trên từ vai tới khuỷu, quanh một xương duy nhất là xương cánh tay. Vách gian cơ chia nó thành hai khu. Khu trước là các cơ gấp: nhị đầu, cơ cánh tay và quạ–cánh tay. Khu sau là cơ duỗi tam đầu. Động mạch cánh tay đi dọc rãnh nhị đầu trong; động mạch cánh tay sâu vòng ra sau theo rãnh thần kinh quay. Mỗi khu cơ một tông màu, động mạch đỏ, tĩnh mạch xanh. Bộ dữ liệu không có thần kinh ngoại biên và vách gian cơ.",
    "en": "The arm is the segment of the upper limb from shoulder to elbow, built around a single bone, the humerus. Intermuscular septa divide it into two compartments. The anterior compartment holds the flexors: biceps, brachialis and coracobrachialis. The posterior compartment holds the extensor, triceps. The brachial artery runs in the medial bicipital groove; the deep brachial artery winds backwards along the radial groove. Each compartment has its own colour family, arteries are red and veins blue. The dataset has no peripheral nerves or intermuscular septa.",
    "zh": "臂是上肢从肩到肘的一段，只有一块骨——肱骨。肌间隔将其分为两个骨筋膜鞘：前群为屈肌（肱二头肌、肱肌、喙肱肌），后群为伸肌肱三头肌。肱动脉行于肱二头肌内侧沟，肱深动脉沿桡神经沟绕向后方。每个肌群一种色系，动脉红色、静脉蓝色。数据集中无周围神经和肌间隔。"
  },
  "frameGroups": [
    "truoc",
    "sau",
    "xuong"
  ],
  "fadedGroups": [
    "xuong-vai"
  ],
  "groups": [
    {
      "key": "truoc",
      "name": {
        "vi": "Khu cơ trước (cơ gấp)",
        "en": "Anterior compartment (flexors)",
        "zh": "前群（屈肌）"
      },
      "latin": "Compartimentum brachii anterius",
      "note": {
        "vi": "Nhị đầu (đầu dài, đầu ngắn) gấp khuỷu và là cơ ngửa cẳng tay mạnh nhất. Cơ cánh tay nằm dưới nó, là cơ gấp khuỷu thuần tuý. Quạ–cánh tay khép và gấp vai. Cả ba do dây cơ bì chi phối.",
        "en": "Biceps (long and short heads) flexes the elbow and is the strongest supinator of the forearm. Brachialis lies beneath it and is a pure elbow flexor. Coracobrachialis flexes and adducts the shoulder. All three are supplied by the musculocutaneous nerve.",
        "zh": "肱二头肌（长头、短头）屈肘，也是最强的前臂旋后肌。肱肌位于其深面，是单纯的屈肘肌。喙肱肌使肩屈和内收。三者均受肌皮神经支配。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1478M",
        "FJ1486M",
        "FJ1488M",
        "FJ1512M"
      ]
    },
    {
      "key": "sau",
      "name": {
        "vi": "Khu cơ sau (cơ duỗi)",
        "en": "Posterior compartment (extensors)",
        "zh": "后群（伸肌）"
      },
      "latin": "Compartimentum brachii posterius",
      "note": {
        "vi": "Tam đầu có ba đầu: đầu dài bám củ dưới ổ chảo nên còn duỗi vai; đầu ngoài và đầu trong bám thân xương cánh tay, hai bên rãnh thần kinh quay. Ba đầu hợp thành gân bám mỏm khuỷu. Cơ khuỷu nhỏ phụ duỗi. Dây quay chi phối.",
        "en": "Triceps has three heads: the long head arises from the infraglenoid tubercle and so also extends the shoulder; the lateral and medial heads arise from the humeral shaft on either side of the radial groove. They unite in a tendon on the olecranon. The small anconeus assists extension. Supplied by the radial nerve.",
        "zh": "肱三头肌有三个头：长头起于盂下结节，故亦伸肩；外侧头和内侧头起于肱骨干桡神经沟两侧。三头合成肌腱止于鹰嘴。小的肘肌辅助伸肘。受桡神经支配。"
      },
      "tint": "#6f8fbf",
      "parts": [
        "FJ1477M",
        "FJ1479M",
        "FJ1480M",
        "FJ1485M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch cánh tay và nhánh bên",
        "en": "Brachial artery and its branches",
        "zh": "肱动脉及其分支"
      },
      "latin": "A. brachialis · A. profunda brachii",
      "note": {
        "vi": "Tiếp nối động mạch nách từ bờ dưới cơ tròn lớn, đi dọc bờ trong nhị đầu tới hố khuỷu. Nhánh cánh tay sâu đi cùng dây quay; các nhánh bên trụ trên và dưới nối với nhánh quặt ngược quanh khuỷu. Đây là chỗ đo huyết áp và bắt mạch ở nếp khuỷu.",
        "en": "Continues the axillary artery from the lower border of teres major and runs along the medial border of biceps to the cubital fossa. The deep brachial branch travels with the radial nerve; the superior and inferior ulnar collaterals join recurrent branches around the elbow. This is where blood pressure is measured and the pulse felt at the elbow crease.",
        "zh": "自大圆肌下缘续于腋动脉，沿肱二头肌内侧缘下行至肘窝。肱深动脉伴桡神经；尺侧上、下副动脉与肘关节周围的返动脉吻合。此处为测血压和肘窝触脉之处。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2215",
        "FJ2219",
        "FJ2225",
        "FJ2261",
        "FJ2331",
        "FJ2374"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch nông và sâu",
        "en": "Superficial and deep veins",
        "zh": "浅静脉与深静脉"
      },
      "latin": "V. cephalica · V. basilica · Vv. brachiales",
      "note": {
        "vi": "Tĩnh mạch đầu chạy ngoài nhị đầu lên rãnh delta–ngực; tĩnh mạch nền chạy trong, xuyên cân giữa cánh tay đổ vào tĩnh mạch cánh tay. Tĩnh mạch cánh tay đi kèm động mạch.",
        "en": "The cephalic vein runs lateral to biceps up to the deltopectoral groove; the basilic vein runs medially and pierces the deep fascia at mid-arm to join the brachial veins, which accompany the artery.",
        "zh": "头静脉行于肱二头肌外侧，上至三角胸肌沟；贵要静脉行于内侧，在臂中部穿深筋膜汇入肱静脉。肱静脉伴行动脉。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2218",
        "FJ2220",
        "FJ2313"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương cánh tay",
        "en": "Humerus",
        "zh": "肱骨"
      },
      "latin": "Humerus",
      "note": {
        "vi": "Xương dài duy nhất của cánh tay. Gãy thân xương ngang rãnh thần kinh quay dễ gây liệt dây quay, biểu hiện bàn tay rũ.",
        "en": "The only long bone of the arm. A shaft fracture at the radial groove readily injures the radial nerve, causing wrist drop.",
        "zh": "臂部唯一的长骨。桡神经沟处骨干骨折易损伤桡神经，致腕下垂。"
      },
      "parts": [
        "FJ3262"
      ]
    },
    {
      "key": "xuong-vai",
      "name": {
        "vi": "Xương vai và xương đòn (mốc)",
        "en": "Scapula and clavicle (landmarks)",
        "zh": "肩胛骨与锁骨（标志）"
      },
      "latin": "Scapula · Clavicula",
      "note": {
        "vi": "Mờ sẵn — chỉ để thấy nguyên uỷ của nhị đầu, quạ–cánh tay và đầu dài tam đầu.",
        "en": "Faded — shown only for the origins of biceps, coracobrachialis and the long head of triceps.",
        "zh": "淡化——仅用于显示肱二头肌、喙肱肌和肱三头肌长头的起点。"
      },
      "parts": [
        "FJ3237",
        "FJ3279"
      ]
    }
  ]
};
