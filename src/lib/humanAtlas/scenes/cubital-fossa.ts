
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Hố khuỷu" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây giữa, cân nhị đầu và gân nhị đầu tách riêng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const cubitalFossaScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/cubital-fossa.ts#cubitalFossaScene", {
  "slug": "ho-khuyu",
  "title": {
    "vi": "Hố khuỷu",
    "en": "The Cubital Fossa",
    "zh": "肘窝"
  },
  "latin": "Fossa cubitalis",
  "intro": {
    "vi": "Hố khuỷu là hõm tam giác ở mặt trước khuỷu. Bờ ngoài là cơ cánh tay–quay, bờ trong là cơ sấp tròn, nền là cơ cánh tay và cơ ngửa. Trong hố, động mạch cánh tay chia đôi thành động mạch quay và trụ, ngay trong gân nhị đầu. Dây giữa nằm trong nữa nhưng bộ dữ liệu không có. Phía nông là mạng tĩnh mạch hình chữ M, nơi lấy máu và truyền dịch. Xương làm mờ sẵn.",
    "en": "The cubital fossa is the triangular hollow at the front of the elbow. Its lateral border is brachioradialis, its medial border pronator teres, and its floor brachialis and supinator. Inside it the brachial artery divides into radial and ulnar arteries, just medial to the biceps tendon. The median nerve lies further medial but is not in the dataset. Superficially lies the M-shaped venous pattern used for blood draws and drips. Bones are faded.",
    "zh": "肘窝是肘前方的三角形凹陷：外侧界为肱桡肌，内侧界为旋前圆肌，窝底为肱肌和旋后肌。窝内肱动脉在肱二头肌腱内侧分为桡动脉和尺动脉；正中神经位于更内侧，但数据集中没有。浅层为M形静脉网，用于抽血和输液。骨骼淡化。"
  },
  "frameGroups": [
    "bo",
    "nen",
    "nhi-dau",
    "dm",
    "tm-nong"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "bo",
      "name": {
        "vi": "Hai bờ: cơ cánh tay–quay và cơ sấp tròn",
        "en": "The borders: brachioradialis and pronator teres",
        "zh": "两侧界：肱桡肌与旋前圆肌"
      },
      "latin": "M. brachioradialis · M. pronator teres",
      "note": {
        "vi": "Cơ cánh tay–quay (bờ ngoài) gấp khuỷu ở tư thế nửa sấp, do dây quay chi phối. Cơ sấp tròn (bờ trong) có hai đầu; dây giữa chui giữa hai đầu này và có thể bị chèn ép tại đây.",
        "en": "Brachioradialis (lateral border) flexes the elbow in mid-pronation and is supplied by the radial nerve. Pronator teres (medial border) has two heads; the median nerve passes between them and can be compressed there.",
        "zh": "肱桡肌（外侧界）在半旋前位屈肘，受桡神经支配。旋前圆肌（内侧界）有两个头，正中神经穿行其间，可在此受压。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1474M",
        "FJ1487M",
        "FJ1516M"
      ]
    },
    {
      "key": "nen",
      "name": {
        "vi": "Nền hố: cơ cánh tay và cơ ngửa",
        "en": "The floor: brachialis and supinator",
        "zh": "窝底：肱肌与旋后肌"
      },
      "latin": "M. brachialis · M. supinator",
      "note": {
        "vi": "Cơ cánh tay bám mỏm vẹt xương trụ; cơ ngửa quấn quanh cổ xương quay. Nhánh sâu dây quay xuyên qua cơ ngửa.",
        "en": "Brachialis inserts on the coronoid process of the ulna; supinator wraps the neck of the radius. The deep branch of the radial nerve pierces supinator.",
        "zh": "肱肌止于尺骨冠突；旋后肌包绕桡骨颈。桡神经深支穿旋后肌。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1486M",
        "FJ1505M"
      ]
    },
    {
      "key": "nhi-dau",
      "name": {
        "vi": "Cơ nhị đầu (gân vào hố)",
        "en": "Biceps brachii (tendon enters the fossa)",
        "zh": "肱二头肌（腱入肘窝）"
      },
      "latin": "M. biceps brachii",
      "note": {
        "vi": "Gân nhị đầu là mốc sờ được giữa hố: động mạch cánh tay nằm ngay trong gân. Cân nhị đầu (không có trong bộ dữ liệu) trải chéo vào trong, che động mạch.",
        "en": "The biceps tendon is the palpable landmark in the middle of the fossa: the brachial artery lies just medial to it. The bicipital aponeurosis (not in the dataset) fans medially over the artery.",
        "zh": "肱二头肌腱是窝中可触及的标志，肱动脉紧贴其内侧。肱二头肌腱膜（数据集中无）向内斜铺，覆盖动脉。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1478M",
        "FJ1512M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch cánh tay chia đôi",
        "en": "Brachial artery and its bifurcation",
        "zh": "肱动脉分叉"
      },
      "latin": "A. brachialis → A. radialis, A. ulnaris",
      "note": {
        "vi": "Chia đôi ngang cổ xương quay. Động mạch quay đi nông ra ngoài. Động mạch trụ chui sâu dưới cơ sấp tròn và cho động mạch gian cốt chung. Các nhánh quặt ngược đi lên, nối với các nhánh bên của động mạch cánh tay.",
        "en": "Divides at the level of the neck of the radius. The radial artery runs superficially and laterally. The ulnar artery dives deep to pronator teres and gives the common interosseous artery. Recurrent branches climb to join the collateral branches of the brachial.",
        "zh": "在桡骨颈平面分叉。桡动脉浅行向外；尺动脉潜入旋前圆肌深面并发出骨间总动脉。各返支上行，与肱动脉的侧副支吻合。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2219",
        "FJ2223",
        "FJ2241",
        "FJ2242",
        "FJ2243",
        "FJ2258",
        "FJ2259"
      ]
    },
    {
      "key": "tm-nong",
      "name": {
        "vi": "Tĩnh mạch nông vùng khuỷu",
        "en": "Superficial veins at the elbow",
        "zh": "肘部浅静脉"
      },
      "latin": "V. mediana cubiti · V. cephalica · V. basilica",
      "note": {
        "vi": "Tĩnh mạch giữa khuỷu nối tĩnh mạch đầu (ngoài) với tĩnh mạch nền (trong). Nó to, cố định và nằm trên cân nhị đầu, cân này ngăn nó với động mạch. Vì thế đây là chỗ lấy máu chuẩn.",
        "en": "The median cubital vein links the cephalic vein (lateral) to the basilic vein (medial). It is large and fixed, and it lies on the bicipital aponeurosis, which separates it from the artery. That makes it the standard site for drawing blood.",
        "zh": "肘正中静脉连接头静脉（外侧）和贵要静脉（内侧）。它粗大、固定，位于肱二头肌腱膜之上，腱膜将其与动脉隔开，因此是标准的采血部位。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2218",
        "FJ2220",
        "FJ2234",
        "FJ2235"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Đầu dưới xương cánh tay, xương quay, trụ (mốc)",
        "en": "Distal humerus, radius, ulna (landmarks)",
        "zh": "肱骨下端、桡骨、尺骨（标志）"
      },
      "latin": "Humerus · Radius · Ulna",
      "note": {
        "vi": "Mờ sẵn. Đường nối hai mỏm trên lồi cầu là bờ trên của hố.",
        "en": "Faded. The line between the two epicondyles is the upper border of the fossa.",
        "zh": "淡化。两上髁连线为肘窝上界。"
      },
      "parts": [
        "FJ3262",
        "FJ3277",
        "FJ3286"
      ]
    }
  ]
});
