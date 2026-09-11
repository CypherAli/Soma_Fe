/**
 * Scene "Khớp khuỷu" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu bao khớp, dây chằng bên và dây chằng vòng — bài dạy xương khớp + cơ vận động + vòng nối mạch.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const elbowJointScene: AtlasSceneDef = {
  "slug": "khop-khuyu",
  "title": {
    "vi": "Khớp khuỷu: xương, cơ vận động và vòng nối mạch",
    "en": "The Elbow Joint: Bones, Movers and Anastomosis",
    "zh": "肘关节：骨、运动肌与动脉网"
  },
  "latin": "Articulatio cubiti",
  "intro": {
    "vi": "Khớp khuỷu gồm ba khớp chung một bao. Khớp cánh tay–trụ và cánh tay–quay cho gấp và duỗi; khớp quay–trụ trên cho sấp và ngửa cẳng tay. Scene chia cơ theo động tác: gấp, duỗi, sấp–ngửa. Màng gian cốt nối hai xương cẳng tay. Quanh khuỷu có vòng nối giữa nhánh bên động mạch cánh tay và các nhánh quặt ngược. Bộ dữ liệu không có bao khớp và dây chằng, nên phần dây chằng chỉ được mô tả trong ghi chú.",
    "en": "The elbow is three joints sharing one capsule. The humero-ulnar and humeroradial joints flex and extend; the proximal radio-ulnar joint pronates and supinates the forearm. The scene groups the muscles by action: flexion, extension, pronation–supination. The interosseous membrane ties the two forearm bones. Around the elbow, collateral branches of the brachial artery join recurrent branches. The dataset has no capsule or ligaments, so those appear only in the notes.",
    "zh": "肘关节由三个关节共用一个关节囊：肱尺关节和肱桡关节司屈伸，桡尺近侧关节司前臂旋前旋后。本场景按动作分组：屈、伸、旋前旋后。骨间膜连接前臂两骨。肘周肱动脉侧副支与返支吻合。数据集中无关节囊和韧带，仅在注释中描述。"
  },
  "frameGroups": [
    "xuong",
    "gap",
    "duoi",
    "sap-ngua"
  ],
  "groups": [
    {
      "key": "xuong",
      "name": {
        "vi": "Ba xương tạo khớp",
        "en": "The three articulating bones",
        "zh": "构成关节的三块骨"
      },
      "latin": "Humerus · Radius · Ulna",
      "note": {
        "vi": "Ròng rọc xương cánh tay khớp khuyết ròng rọc xương trụ như bản lề; chỏm con khớp chỏm xương quay. Chỏm quay xoay trong dây chằng vòng. Ở trẻ nhỏ, kéo mạnh tay có thể làm chỏm quay tuột khỏi dây chằng này.",
        "en": "The trochlea of the humerus fits the trochlear notch of the ulna like a hinge; the capitulum meets the radial head. The radial head spins inside the annular ligament. In small children a sharp pull on the arm can slip the radial head out of it.",
        "zh": "肱骨滑车与尺骨滑车切迹构成铰链；肱骨小头与桡骨头相关节。桡骨头在环状韧带内旋转；幼儿手臂被猛拉时桡骨头可从中滑脱（牵拉肘）。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3262",
        "FJ3277",
        "FJ3286"
      ]
    },
    {
      "key": "gap",
      "name": {
        "vi": "Cơ gấp khuỷu",
        "en": "Elbow flexors",
        "zh": "屈肘肌"
      },
      "latin": "Mm. biceps brachii, brachialis, brachioradialis",
      "note": {
        "vi": "Cơ cánh tay gấp ở mọi tư thế cẳng tay; nhị đầu mạnh nhất khi ngửa; cánh tay–quay mạnh nhất ở tư thế nửa sấp, như khi cầm cốc.",
        "en": "Brachialis flexes in every forearm position; biceps is strongest in supination; brachioradialis is strongest in mid-pronation, as when holding a cup.",
        "zh": "肱肌在前臂任何位置都能屈肘；肱二头肌在旋后位最强；肱桡肌在半旋前位（如握杯）最强。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1478M",
        "FJ1486M",
        "FJ1487M",
        "FJ1512M"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Cơ duỗi khuỷu",
        "en": "Elbow extensors",
        "zh": "伸肘肌"
      },
      "latin": "M. triceps brachii · M. anconeus",
      "note": {
        "vi": "Tam đầu bám mỏm khuỷu; cơ khuỷu nhỏ căng bao khớp phía sau khi duỗi.",
        "en": "Triceps inserts on the olecranon; the small anconeus tenses the back of the capsule during extension.",
        "zh": "肱三头肌止于鹰嘴；小的肘肌在伸肘时紧张关节囊后部。"
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
      "key": "sap-ngua",
      "name": {
        "vi": "Cơ sấp và cơ ngửa",
        "en": "Pronators and supinator",
        "zh": "旋前肌与旋后肌"
      },
      "latin": "Mm. pronator teres, pronator quadratus, supinator",
      "note": {
        "vi": "Sấp tròn và sấp vuông kéo xương quay bắt chéo trước xương trụ. Cơ ngửa, cùng nhị đầu, xoay nó về lại. Ngửa mạnh hơn sấp, nên ốc vít có ren thuận cho người thuận tay phải.",
        "en": "Pronator teres and pronator quadratus swing the radius across the ulna. Supinator, with biceps, turns it back. Supination is the stronger movement, which is why screws are threaded for right-handers.",
        "zh": "旋前圆肌与旋前方肌使桡骨交叉于尺骨前方；旋后肌与肱二头肌使其转回。旋后力量大于旋前，因此螺丝的螺纹为右利手设计。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1474M",
        "FJ1503M",
        "FJ1505M",
        "FJ1516M"
      ]
    },
    {
      "key": "mang",
      "name": {
        "vi": "Màng gian cốt cẳng tay",
        "en": "Interosseous membrane of the forearm",
        "zh": "前臂骨间膜"
      },
      "latin": "Membrana interossea antebrachii",
      "note": {
        "vi": "Thớ màng chạy chếch xuống trong, từ xương quay sang xương trụ. Nhờ vậy lực đè lên bàn tay (tì vào xương quay) được chuyển sang xương trụ rồi lên khuỷu.",
        "en": "Its fibres run obliquely down and medially from radius to ulna. So force through the hand, which bears on the radius, passes to the ulna and on to the elbow.",
        "zh": "纤维自桡骨斜向内下至尺骨，使经手传至桡骨的力转移到尺骨再传向肘部。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1476M"
      ]
    },
    {
      "key": "vong-noi",
      "name": {
        "vi": "Vòng nối động mạch quanh khuỷu",
        "en": "Arterial anastomosis around the elbow",
        "zh": "肘关节动脉网"
      },
      "latin": "Rete articulare cubiti",
      "note": {
        "vi": "Các nhánh bên trụ trên và dưới, nhánh bên quay và bên giữa của động mạch cánh tay đi xuống. Chúng nối với nhánh quặt ngược quay, quặt ngược trụ và quặt ngược gian cốt đi lên. Vòng nối nuôi chi khi động mạch cánh tay bị tắc dưới nhánh sâu.",
        "en": "The superior and inferior ulnar collaterals and the radial and middle collaterals descend from the brachial artery. They meet the radial, ulnar and interosseous recurrent arteries climbing up. The loop keeps the limb supplied if the brachial is blocked below the deep branch.",
        "zh": "尺侧上、下副动脉及桡侧副动脉、中副动脉自肱动脉下行，与上行的桡侧返动脉、尺侧返动脉、骨间返动脉吻合。当肱动脉在肱深动脉以下阻塞时，此网维持肢体血供。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2215",
        "FJ2241",
        "FJ2243",
        "FJ2245",
        "FJ2259",
        "FJ2261",
        "FJ2331",
        "FJ2374"
      ]
    }
  ]
};
