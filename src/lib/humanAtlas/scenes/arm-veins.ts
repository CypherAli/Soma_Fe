
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Tĩnh mạch chi trên" (bên trái) dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-arm-veins.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const armVeinsScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/arm-veins.ts#armVeinsScene", {
  "slug": "tinh-mach-chi-tren",
  "title": {
    "vi": "Tĩnh mạch chi trên",
    "en": "Veins of the Upper Limb",
    "zh": "上肢静脉"
  },
  "latin": "Venae membri superioris",
  "intro": {
    "vi": "Hệ NÔNG (xanh nhạt) bắt đầu ở mạng tĩnh mạch mu tay: bờ ngoài đi lên thành tĩnh mạch đầu, bờ trong thành tĩnh mạch nền; ở khuỷu chúng nối nhau bằng tĩnh mạch giữa khuỷu — nơi lấy máu hằng ngày. Hệ SÂU (xanh đậm) là các tĩnh mạch đi đôi kèm động mạch cùng tên, hợp thành tĩnh mạch nách rồi dưới đòn. Xương mờ sẵn làm mốc.",
    "en": "The SUPERFICIAL system (light blue) starts in the dorsal venous network of the hand: its radial side rises as the cephalic vein, its ulnar side as the basilic; at the elbow they are linked by the median cubital vein — the everyday site for drawing blood. The DEEP system (dark blue) is the paired veins accompanying the arteries of the same name, joining into the axillary and then subclavian vein. Bones are faded as landmarks.",
    "zh": "浅静脉（浅蓝）起自手背静脉网：桡侧上行为头静脉，尺侧上行为贵要静脉；在肘部由肘正中静脉相连——日常采血部位。深静脉（深蓝）为与同名动脉伴行的成对静脉，汇合成腋静脉，再延续为锁骨下静脉。骨骼淡化作为标志。"
  },
  "frameGroups": [
    "tm-dau",
    "tm-nen",
    "tm-giua",
    "tm-mu-tay",
    "tm-sau-cang",
    "tm-canh-tay-nach"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "tm-dau",
      "name": {
        "vi": "Tĩnh mạch đầu",
        "en": "Cephalic vein",
        "zh": "头静脉"
      },
      "latin": "V. cephalica",
      "note": {
        "vi": "Đi dọc bờ ngoài cẳng tay và cánh tay, qua rãnh delta-ngực rồi xuyên mạc đòn-ngực đổ vào tĩnh mạch nách. Là tĩnh mạch hay dùng để luồn điện cực máy tạo nhịp.",
        "en": "Runs along the lateral forearm and arm, through the deltopectoral groove, then pierces the clavipectoral fascia to join the axillary vein. It is often used to pass pacemaker leads.",
        "zh": "沿前臂和上臂外侧上行，经三角肌胸大肌间沟，穿锁胸筋膜注入腋静脉。常用于置入起搏器电极。"
      },
      "tint": "#8fb6d9",
      "parts": [
        "FJ2220"
      ]
    },
    {
      "key": "tm-nen",
      "name": {
        "vi": "Tĩnh mạch nền",
        "en": "Basilic vein",
        "zh": "贵要静脉"
      },
      "latin": "V. basilica",
      "note": {
        "vi": "Đi dọc bờ trong, xuyên mạc sâu ở giữa cánh tay rồi nhập tĩnh mạch cánh tay thành tĩnh mạch nách. To và thẳng — đường ưu tiên đặt catheter trung tâm từ ngoại vi (PICC).",
        "en": "Runs along the medial side, pierces the deep fascia at mid-arm and joins the brachial veins to form the axillary vein. Large and straight — the preferred route for a peripherally inserted central catheter (PICC).",
        "zh": "沿内侧上行，在上臂中部穿深筋膜，与肱静脉汇合成腋静脉。管径粗且走行直——经外周置入中心静脉导管（PICC）的首选途径。"
      },
      "tint": "#a9c7e3",
      "parts": [
        "FJ2218"
      ]
    },
    {
      "key": "tm-giua",
      "name": {
        "vi": "Tĩnh mạch giữa khuỷu và giữa cẳng tay",
        "en": "Median cubital and median antebrachial veins",
        "zh": "肘正中静脉与前臂正中静脉"
      },
      "latin": "V. mediana cubiti · V. mediana antebrachii",
      "note": {
        "vi": "Tĩnh mạch giữa khuỷu nối chéo tĩnh mạch đầu với tĩnh mạch nền ở nếp khuỷu, nằm trên cân cơ nhị đầu — lớp cân này che động mạch cánh tay và thần kinh giữa ở dưới, nên lấy máu ở đây an toàn.",
        "en": "The median cubital vein runs obliquely from cephalic to basilic across the elbow crease, lying on the bicipital aponeurosis — which shields the brachial artery and median nerve beneath, making venepuncture here safe.",
        "zh": "肘正中静脉在肘窝斜行连接头静脉与贵要静脉，位于肱二头肌腱膜浅面——腱膜保护其深面的肱动脉和正中神经，故在此采血安全。"
      },
      "tint": "#b6a6d6",
      "parts": [
        "FJ2234",
        "FJ2235"
      ]
    },
    {
      "key": "tm-mu-tay",
      "name": {
        "vi": "Mạng tĩnh mạch mu tay và ngón",
        "en": "Dorsal venous network and digital veins",
        "zh": "手背静脉网与指静脉"
      },
      "latin": "Rete venosum dorsale manus",
      "note": {
        "vi": "Mạng tĩnh mạch nông ở mu bàn tay nhận máu từ các ngón — vị trí đặt kim truyền thông dụng. Máu gan tay chủ yếu đổ ra mu tay, nên nắm tay lại làm mạng này nổi rõ.",
        "en": "The superficial network on the back of the hand collects from the fingers — a common site for IV cannulas. Most blood from the palm drains to the back, which is why making a fist makes this network stand out.",
        "zh": "手背浅静脉网接受手指静脉血——常用的静脉输液部位。手掌血液主要回流至手背，故握拳时此静脉网更加明显。"
      },
      "tint": "#7aa3c8",
      "parts": [
        "FJ2228"
      ]
    },
    {
      "key": "tm-sau-cang",
      "name": {
        "vi": "Tĩnh mạch quay, trụ và gan tay",
        "en": "Radial, ulnar and palmar veins",
        "zh": "桡、尺静脉与掌静脉"
      },
      "latin": "Vv. radiales · Vv. ulnares",
      "note": {
        "vi": "Mỗi động mạch có hai tĩnh mạch đi kèm (tĩnh mạch tuỳ hành), cùng hai cung tĩnh mạch gan tay. Chúng nằm dưới mạc, bị ép bởi co cơ khi vận động — bơm cơ đẩy máu lên.",
        "en": "Each artery has two accompanying veins (venae comitantes), plus two palmar venous arches. They lie under the fascia and are squeezed by muscle contraction — the muscle pump pushing blood upward.",
        "zh": "每条动脉有两条伴行静脉，另有两个掌静脉弓。位于深筋膜下，运动时受肌肉收缩挤压——肌泵推动血液上行。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2229",
        "FJ2238",
        "FJ2244",
        "FJ2249",
        "FJ2260",
        "FJ2319",
        "FJ2320",
        "FJ2321",
        "FJ2322",
        "FJ2323",
        "FJ2324",
        "FJ2325",
        "FJ2326",
        "FJ2327",
        "FJ2328",
        "FJ2329",
        "FJ2340"
      ]
    },
    {
      "key": "tm-canh-tay-nach",
      "name": {
        "vi": "Tĩnh mạch cánh tay, nách, dưới đòn",
        "en": "Brachial, axillary and subclavian veins",
        "zh": "肱、腋、锁骨下静脉"
      },
      "latin": "Vv. brachiales · V. axillaris · V. subclavia",
      "note": {
        "vi": "Tĩnh mạch nách thành tĩnh mạch dưới đòn ở bờ ngoài xương sườn I. Tĩnh mạch dưới đòn nằm trước cơ bậc thang trước, sau xương đòn — chỗ đặt catheter tĩnh mạch trung tâm; chọc sâu quá dễ gây tràn khí màng phổi. Tập tay quá đầu lặp lại có thể gây huyết khối tĩnh mạch dưới đòn (Paget-Schroetter).",
        "en": "The axillary becomes the subclavian vein at the outer border of rib I. The subclavian lies in front of scalenus anterior, behind the clavicle — a central line site; going too deep risks a pneumothorax. Repeated overhead exercise can thrombose it (Paget-Schroetter syndrome).",
        "zh": "腋静脉在第一肋外缘移行为锁骨下静脉。锁骨下静脉位于前斜角肌前方、锁骨后方——中心静脉置管部位；进针过深易致气胸。反复过头运动可致锁骨下静脉血栓（Paget-Schroetter综合征）。"
      },
      "tint": "#3f6a8f",
      "parts": [
        "FJ2217",
        "FJ2313",
        "FJ3486"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chi trên (mốc)",
        "en": "Upper limb bones (landmarks)",
        "zh": "上肢骨（标志）"
      },
      "latin": "Ossa membri superioris",
      "note": {
        "vi": "Mờ sẵn để thấy đường đi của tĩnh mạch nông trên mặt xương.",
        "en": "Faded so the superficial veins can be followed over the bones.",
        "zh": "淡化以便沿骨面追踪浅静脉走行。"
      },
      "parts": [
        "FJ3183",
        "FJ3184",
        "FJ3186",
        "FJ3187",
        "FJ3188",
        "FJ3237",
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252",
        "FJ3257",
        "FJ3261",
        "FJ3262",
        "FJ3268",
        "FJ3276",
        "FJ3277",
        "FJ3278",
        "FJ3283",
        "FJ3284",
        "FJ3285",
        "FJ3286",
        "FJ3291",
        "FJ3296",
        "FJ3297",
        "FJ3299",
        "FJ3313",
        "FJ3314",
        "FJ3316",
        "FJ3317",
        "FJ3318"
      ]
    }
  ]
});
