/**
 * Scene "Chóp xoay vai" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu bao khớp, sụn viền ổ chảo và túi hoạt dịch dưới mỏm cùng vai.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const rotatorCuffScene: AtlasSceneDef = {
  "slug": "chop-xoay-vai",
  "title": {
    "vi": "Chóp xoay vai",
    "en": "The Rotator Cuff",
    "zh": "肩袖"
  },
  "latin": "Musculi rotatores humeri",
  "intro": {
    "vi": "Khớp vai có chỏm to trên một ổ chảo nông như quả bóng trên đĩa, nên rất linh động và cũng dễ trật. Bốn cơ chóp xoay ôm quanh chỏm, giữ nó áp vào ổ chảo trong mọi tư thế. Đó là cơ trên gai, dưới gai, tròn bé và dưới vai. Mỗi cơ tô một màu riêng để thấy chỗ bám trên các củ xương cánh tay. Cơ delta và xương làm mờ sẵn. Bộ dữ liệu không có bao khớp và túi hoạt dịch.",
    "en": "The shoulder is a large head on a shallow socket, like a ball on a saucer — very mobile and easy to dislocate. Four rotator cuff muscles wrap the head and keep it pressed into the glenoid in every position: supraspinatus, infraspinatus, teres minor and subscapularis. Each has its own colour to show where it inserts on the humeral tubercles. Deltoid and bones are faded. The dataset has no joint capsule or bursae.",
    "zh": "肩关节头大盂浅，如球置于碟上，灵活而易脱位。四块肩袖肌包绕肱骨头，在各种姿势下将其压向关节盂：冈上肌、冈下肌、小圆肌和肩胛下肌。每块肌肉一种颜色，以显示其在肱骨结节上的止点。三角肌和骨骼淡化。数据集中无关节囊和滑囊。"
  },
  "frameGroups": [
    "tren-gai",
    "duoi-gai",
    "tron-be",
    "duoi-vai"
  ],
  "fadedGroups": [
    "delta",
    "xuong"
  ],
  "groups": [
    {
      "key": "tren-gai",
      "name": {
        "vi": "Cơ trên gai",
        "en": "Supraspinatus",
        "zh": "冈上肌"
      },
      "latin": "M. supraspinatus",
      "note": {
        "vi": "Nằm trong hố trên gai, gân chui dưới mỏm cùng vai bám củ lớn. Khởi động dạng vai trong khoảng 15° đầu. Gân này bị kẹp và rách nhiều nhất trong hội chứng chèn ép dưới mỏm cùng vai.",
        "en": "Lies in the supraspinous fossa; its tendon passes under the acromion to the greater tubercle. It starts abduction over the first 15° or so. This tendon is the one most often impinged and torn under the acromion.",
        "zh": "位于冈上窝，肌腱经肩峰下止于大结节。启动肩外展（约前15°）。肩峰下撞击综合征中最常受压和撕裂的是此腱。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1506M"
      ]
    },
    {
      "key": "duoi-gai",
      "name": {
        "vi": "Cơ dưới gai",
        "en": "Infraspinatus",
        "zh": "冈下肌"
      },
      "latin": "M. infraspinatus",
      "note": {
        "vi": "Phủ hố dưới gai, bám mặt giữa củ lớn. Là cơ xoay ngoài chính của cánh tay. Cùng cơ trên gai do dây trên vai chi phối.",
        "en": "Fills the infraspinous fossa and inserts on the middle facet of the greater tubercle. It is the main lateral rotator of the arm. Like supraspinatus it is supplied by the suprascapular nerve.",
        "zh": "占据冈下窝，止于大结节中部压迹，是臂的主要外旋肌。与冈上肌同受肩胛上神经支配。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1500M"
      ]
    },
    {
      "key": "tron-be",
      "name": {
        "vi": "Cơ tròn bé",
        "en": "Teres minor",
        "zh": "小圆肌"
      },
      "latin": "M. teres minor",
      "note": {
        "vi": "Dọc bờ ngoài xương vai, bám mặt dưới củ lớn, xoay ngoài cùng cơ dưới gai. Do dây nách chi phối. Đừng nhầm với cơ tròn lớn: cơ đó không thuộc chóp xoay và xoay trong.",
        "en": "Runs along the lateral border of the scapula to the lower facet of the greater tubercle, rotating laterally with infraspinatus. Supplied by the axillary nerve. Do not confuse it with teres major, which is not part of the cuff and rotates medially.",
        "zh": "沿肩胛骨外侧缘止于大结节下压迹，与冈下肌共同外旋，受腋神经支配。勿与大圆肌混淆——后者不属肩袖，作用为内旋。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1508M"
      ]
    },
    {
      "key": "duoi-vai",
      "name": {
        "vi": "Cơ dưới vai",
        "en": "Subscapularis",
        "zh": "肩胛下肌"
      },
      "latin": "M. subscapularis",
      "note": {
        "vi": "Lót mặt trước xương vai, áp sát lồng ngực, bám củ bé. Là cơ lớn nhất chóp xoay và là cơ xoay trong chính. Nó chặn chỏm không trượt ra trước.",
        "en": "Lines the front of the scapula against the chest wall and inserts on the lesser tubercle. It is the largest cuff muscle and the main medial rotator. It stops the head sliding forward.",
        "zh": "衬于肩胛骨前面紧贴胸廓，止于小结节。是肩袖中最大的肌肉，也是主要内旋肌，阻止肱骨头向前滑脱。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ1504M"
      ]
    },
    {
      "key": "tron-lon",
      "name": {
        "vi": "Cơ tròn lớn (so sánh — không thuộc chóp xoay)",
        "en": "Teres major (for comparison — not a cuff muscle)",
        "zh": "大圆肌（对照——非肩袖肌）"
      },
      "latin": "M. teres major",
      "note": {
        "vi": "Đi từ góc dưới xương vai tới mép củ bé. Nó khép và xoay trong cánh tay, không bám bao khớp nên không giữ vững chỏm.",
        "en": "Runs from the inferior angle of the scapula to the crest of the lesser tubercle. It adducts and medially rotates the arm; it does not blend with the capsule, so it does not stabilise the head.",
        "zh": "自肩胛骨下角至小结节嵴。使臂内收和内旋；不与关节囊融合，故不稳定肱骨头。"
      },
      "tint": "#8d7bb5",
      "parts": [
        "FJ1507M"
      ]
    },
    {
      "key": "delta",
      "name": {
        "vi": "Cơ delta (mờ sẵn)",
        "en": "Deltoid (faded)",
        "zh": "三角肌（淡化）"
      },
      "latin": "M. deltoideus",
      "note": {
        "vi": "Phủ ngoài chóp xoay. Nếu chóp xoay yếu, lực kéo lên của delta đẩy chỏm chạm mỏm cùng vai thay vì làm dạng tay.",
        "en": "Covers the cuff. If the cuff is weak, deltoid's upward pull jams the head against the acromion instead of abducting the arm.",
        "zh": "覆盖肩袖外面。肩袖无力时，三角肌向上的拉力会使肱骨头撞击肩峰而非外展手臂。"
      },
      "tint": "#c9a79e",
      "parts": [
        "FJ1467M",
        "FJ1468M",
        "FJ1513M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương vai, cánh tay, đòn (mốc)",
        "en": "Scapula, humerus, clavicle (landmarks)",
        "zh": "肩胛骨、肱骨、锁骨（标志）"
      },
      "latin": "Scapula · Humerus · Clavicula",
      "note": {
        "vi": "Mờ sẵn. Chú ý ổ chảo chỉ bằng khoảng 1/3 diện tích chỏm xương cánh tay.",
        "en": "Faded. Note that the glenoid is only about a third the size of the humeral head.",
        "zh": "淡化。注意关节盂面积仅约为肱骨头的1/3。"
      },
      "parts": [
        "FJ3237",
        "FJ3262",
        "FJ3279"
      ]
    }
  ]
};
