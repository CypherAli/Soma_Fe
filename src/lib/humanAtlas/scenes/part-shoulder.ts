
import { bindContentSource } from "@/lib/content/source";
/**
 * Bài bộ phận "Vai" học theo lớp, dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu bao khớp, sụn viền, dây chằng quạ–cùng vai, đám rối cánh tay.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partShoulderScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/part-shoulder.ts#partShoulderScene", {
  "slug": "bo-phan-vai",
  "title": {
    "vi": "Vai — học theo lớp",
    "en": "The Shoulder — Layer by Layer",
    "zh": "肩——分层学习"
  },
  "latin": "Regio deltoidea · Articulatio humeri",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là lớp xương: xương đòn, xương vai và đầu trên xương cánh tay, ba xương tạo nên vai. Bật lớp Cơ sâu để thấy bốn cơ chóp xoay ôm chỏm xương cánh tay. Bật lớp Cơ nông để thấy cơ delta, cơ thang và cơ ngực phủ bên ngoài. Bật lớp Mạch máu để thấy động mạch nách và các nhánh vòng quanh vai. Bộ dữ liệu không có bao khớp, sụn viền và đám rối cánh tay.",
    "en": "It opens on the bones: clavicle, scapula and upper humerus, the three bones of the shoulder. Turn on Deep muscles to see the four rotator cuff muscles hugging the humeral head. Turn on Superficial muscles for deltoid, trapezius and pectoralis on the outside. Turn on Vessels for the axillary artery and the branches that circle the shoulder. The dataset has no capsule, labrum or brachial plexus.",
    "zh": "打开时显示骨层：锁骨、肩胛骨和肱骨上端——构成肩部的三块骨。开启“深层肌”可见环抱肱骨头的四块肩袖肌；开启“浅层肌”可见外层的三角肌、斜方肌和胸肌；开启“血管”可见腋动脉及环绕肩部的分支。数据集中无关节囊、盂唇和臂丛。"
  },
  "frameGroups": [
    "xuong-vai",
    "xuong-don",
    "delta"
  ],
  "layers": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương",
        "en": "Bones",
        "zh": "骨"
      },
      "groups": [
        "xuong-don",
        "xuong-vai",
        "canh-tay"
      ],
      "on": true
    },
    {
      "key": "co-sau",
      "name": {
        "vi": "Cơ sâu (chóp xoay)",
        "en": "Deep muscles (rotator cuff)",
        "zh": "深层肌（肩袖）"
      },
      "groups": [
        "tren-gai",
        "duoi-gai",
        "tron-be",
        "duoi-vai",
        "tron-lon"
      ]
    },
    {
      "key": "co-nong",
      "name": {
        "vi": "Cơ nông",
        "en": "Superficial muscles",
        "zh": "浅层肌"
      },
      "groups": [
        "delta",
        "thang",
        "nguc",
        "rang-truoc"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Mạch máu",
        "en": "Vessels",
        "zh": "血管"
      },
      "groups": [
        "dm",
        "tm"
      ]
    }
  ],
  "groups": [
    {
      "key": "xuong-don",
      "name": {
        "vi": "Xương đòn",
        "en": "Clavicle",
        "zh": "锁骨"
      },
      "latin": "Clavicula",
      "note": {
        "vi": "Thanh chống giữ vai cách xa lồng ngực; gãy nhiều nhất ở chỗ nối 1/3 giữa và ngoài.",
        "en": "The strut holding the shoulder off the chest; it breaks most often at the junction of the middle and outer thirds.",
        "zh": "使肩部远离胸廓的支撑杆，最常在中外1/3交界处骨折。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3237"
      ]
    },
    {
      "key": "xuong-vai",
      "name": {
        "vi": "Xương vai",
        "en": "Scapula",
        "zh": "肩胛骨"
      },
      "latin": "Scapula",
      "note": {
        "vi": "Có gai vai, mỏm cùng vai, mỏm quạ và ổ chảo nông — ổ chảo chỉ bằng khoảng 1/3 chỏm xương cánh tay.",
        "en": "Carries the spine, acromion, coracoid and a shallow glenoid — only about a third the size of the humeral head.",
        "zh": "有肩胛冈、肩峰、喙突和浅的关节盂——关节盂仅约为肱骨头的1/3。"
      },
      "tint": "#d9c08a",
      "parts": [
        "FJ3279"
      ]
    },
    {
      "key": "canh-tay",
      "name": {
        "vi": "Xương cánh tay (chỏm, củ lớn, củ bé)",
        "en": "Humerus (head, tubercles)",
        "zh": "肱骨（头、大小结节）"
      },
      "latin": "Humerus",
      "note": {
        "vi": "Củ lớn nhận cơ trên gai, dưới gai, tròn bé; củ bé nhận cơ dưới vai. Cổ phẫu thuật là chỗ hay gãy ở người già.",
        "en": "The greater tubercle takes supraspinatus, infraspinatus and teres minor; the lesser tubercle takes subscapularis. The surgical neck is a common fracture site in the elderly.",
        "zh": "大结节接受冈上肌、冈下肌、小圆肌；小结节接受肩胛下肌。外科颈为老年人常见骨折部位。"
      },
      "tint": "#c9b98f",
      "parts": [
        "FJ3262"
      ]
    },
    {
      "key": "tren-gai",
      "name": {
        "vi": "Cơ trên gai",
        "en": "Supraspinatus",
        "zh": "冈上肌"
      },
      "latin": "M. supraspinatus",
      "note": {
        "vi": "Khởi động dạng vai; gân chui dưới mỏm cùng vai nên hay bị chèn ép và rách.",
        "en": "Starts abduction; its tendon runs under the acromion and is the one most often impinged and torn.",
        "zh": "启动肩外展；肌腱经肩峰下，最易受撞击和撕裂。"
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
        "vi": "Cơ xoay ngoài chính của cánh tay.",
        "en": "The main lateral rotator of the arm.",
        "zh": "上臂的主要外旋肌。"
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
        "vi": "Xoay ngoài cùng cơ dưới gai; do dây nách chi phối.",
        "en": "Rotates laterally with infraspinatus; supplied by the axillary nerve.",
        "zh": "与冈下肌共同外旋；受腋神经支配。"
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
        "vi": "Cơ lớn nhất chóp xoay, xoay trong và chặn chỏm trượt ra trước.",
        "en": "The largest cuff muscle; it rotates medially and stops the head sliding forward.",
        "zh": "肩袖中最大的肌肉，内旋并阻止肱骨头前滑。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ1504M"
      ]
    },
    {
      "key": "tron-lon",
      "name": {
        "vi": "Cơ tròn lớn",
        "en": "Teres major",
        "zh": "大圆肌"
      },
      "latin": "M. teres major",
      "note": {
        "vi": "Không thuộc chóp xoay: khép và xoay trong cánh tay.",
        "en": "Not a cuff muscle: it adducts and medially rotates the arm.",
        "zh": "不属肩袖：使上臂内收和内旋。"
      },
      "tint": "#8d7bb5",
      "parts": [
        "FJ1507M"
      ]
    },
    {
      "key": "delta",
      "name": {
        "vi": "Cơ delta",
        "en": "Deltoid",
        "zh": "三角肌"
      },
      "latin": "M. deltoideus",
      "note": {
        "vi": "Tạo đường cong vai; phần cùng vai dạng tay từ khoảng 15° tới 90°. Dây nách chi phối.",
        "en": "Gives the shoulder its contour; the acromial part abducts from about 15° to 90°. Supplied by the axillary nerve.",
        "zh": "形成肩部轮廓；肩峰部使臂外展约15°至90°。受腋神经支配。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1467M",
        "FJ1468M",
        "FJ1513M"
      ]
    },
    {
      "key": "thang",
      "name": {
        "vi": "Cơ thang",
        "en": "Trapezius",
        "zh": "斜方肌"
      },
      "latin": "M. trapezius",
      "note": {
        "vi": "Nâng, kéo vào trong và xoay xương vai để ổ chảo hướng lên khi giơ tay cao.",
        "en": "Elevates, retracts and rotates the scapula so the glenoid faces up when the arm is raised.",
        "zh": "上提、后缩并旋转肩胛骨，使举臂时关节盂朝上。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1520M",
        "FJ1521M",
        "FJ1554M"
      ]
    },
    {
      "key": "nguc",
      "name": {
        "vi": "Cơ ngực lớn, ngực bé",
        "en": "Pectoralis major and minor",
        "zh": "胸大肌、胸小肌"
      },
      "latin": "Mm. pectoralis major et minor",
      "note": {
        "vi": "Ngực lớn khép và xoay trong cánh tay; ngực bé kéo mỏm quạ xuống trước.",
        "en": "Pectoralis major adducts and medially rotates the arm; minor pulls the coracoid down and forward.",
        "zh": "胸大肌使臂内收内旋；胸小肌将喙突拉向前下。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1446M",
        "FJ1447M",
        "FJ1456M",
        "FJ1464M"
      ]
    },
    {
      "key": "rang-truoc",
      "name": {
        "vi": "Cơ răng trước",
        "en": "Serratus anterior",
        "zh": "前锯肌"
      },
      "latin": "M. serratus anterior",
      "note": {
        "vi": "Ép xương vai vào lồng ngực; liệt gây xương vai vểnh.",
        "en": "Holds the scapula to the chest; its palsy gives a winged scapula.",
        "zh": "使肩胛骨紧贴胸廓；麻痹致翼状肩胛。"
      },
      "tint": "#f0a58a",
      "parts": [
        "FJ1459M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch nách và nhánh quanh vai",
        "en": "Axillary artery and branches around the shoulder",
        "zh": "腋动脉及肩周分支"
      },
      "latin": "A. axillaris et rami",
      "note": {
        "vi": "Nhánh mũ cánh tay trước, sau vòng quanh cổ phẫu thuật; nhánh dưới vai và trên vai tạo vòng nối quanh xương vai.",
        "en": "The circumflex humeral arteries ring the surgical neck; the subscapular and suprascapular branches form the scapular anastomosis.",
        "zh": "旋肱前、后动脉环绕外科颈；肩胛下支和肩胛上支构成肩胛动脉网。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2211",
        "FJ2212",
        "FJ2216",
        "FJ2221",
        "FJ2230",
        "FJ2232",
        "FJ2239",
        "FJ2240",
        "FJ2246",
        "FJ2251",
        "FJ2252",
        "FJ2253",
        "FJ2330"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch nách, tĩnh mạch đầu",
        "en": "Axillary and cephalic veins",
        "zh": "腋静脉、头静脉"
      },
      "latin": "V. axillaris · V. cephalica",
      "note": {
        "vi": "Tĩnh mạch đầu chạy trong rãnh delta–ngực, mốc đường mổ trước khớp vai.",
        "en": "The cephalic vein runs in the deltopectoral groove, the landmark for the anterior approach to the shoulder.",
        "zh": "头静脉行于三角胸肌沟，是肩关节前入路的标志。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2213",
        "FJ2217",
        "FJ2222",
        "FJ2247"
      ]
    }
  ]
});
