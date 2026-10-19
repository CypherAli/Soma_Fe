
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Giải phẫu Cẳng tay – Bàn tay" (bên trái) dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu thần kinh giữa/trụ/quay và cân gan tay.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-forearm.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const forearmScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/forearm.ts#forearmScene", {
  "slug": "giai-phau-cang-tay",
  "title": {
    "vi": "Giải phẫu Cẳng tay – Bàn tay",
    "en": "Forearm and Hand",
    "zh": "前臂与手"
  },
  "latin": "Antebrachium · Manus",
  "intro": {
    "vi": "Cẳng tay chia hai khoang bởi xương quay, xương trụ và màng gian cốt. Khoang TRƯỚC (đỏ) gấp cổ tay, gấp ngón và sấp tay — hầu hết bám mỏm trên lồi cầu TRONG, do thần kinh giữa và trụ chi phối. Khoang SAU (xanh) duỗi cổ tay, duỗi ngón và ngửa tay — bám mỏm trên lồi cầu NGOÀI, do thần kinh quay chi phối. Gân của chúng tận hết ở bàn tay, nơi các cơ nội tại (cam, tím, lục) lo động tác tinh. Bộ dữ liệu không có dây thần kinh và cân gan tay; xương mờ sẵn.",
    "en": "The forearm is split into two compartments by the radius, ulna and interosseous membrane. The ANTERIOR compartment (red) flexes the wrist and fingers and pronates — mostly arising from the MEDIAL epicondyle, supplied by the median and ulnar nerves. The POSTERIOR compartment (blue) extends the wrist and fingers and supinates — arising from the LATERAL epicondyle, supplied by the radial nerve. Their tendons end in the hand, where the intrinsic muscles (orange, violet, green) handle fine movement. The dataset has no nerves or palmar aponeurosis; bones are faded.",
    "zh": "前臂由桡骨、尺骨和骨间膜分为两个骨筋膜室。前群（红色）屈腕、屈指并使前臂旋前——多起自肱骨内上髁，受正中神经和尺神经支配。后群（蓝色）伸腕、伸指并旋后——起自外上髁，受桡神经支配。其肌腱止于手部，由手内在肌（橙、紫、绿）完成精细动作。数据集中无神经和掌腱膜；骨骼淡化。"
  },
  "frameGroups": [
    "gap-nong",
    "gap-sau",
    "duoi",
    "ngua-sap",
    "o-mo-cai",
    "o-mo-ut",
    "giun-gian-cot"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "gap-nong",
      "name": {
        "vi": "Cơ gấp lớp nông và giữa",
        "en": "Superficial and intermediate flexors",
        "zh": "浅层与中层屈肌"
      },
      "latin": "Flexores superficiales antebrachii",
      "note": {
        "vi": "Từ ngoài vào: sấp tròn, gấp cổ tay quay, gan tay dài, gấp cổ tay trụ; lớp giữa là gấp các ngón nông. Tất cả chung một gân gốc ở mỏm trên lồi cầu trong — viêm chỗ bám này là \"khuỷu tay người chơi golf\". Cơ gan tay dài vắng mặt ở khoảng 15% người và là mảnh gân ghép hay dùng.",
        "en": "Lateral to medial: pronator teres, flexor carpi radialis, palmaris longus, flexor carpi ulnaris; the middle layer is flexor digitorum superficialis. All share a common origin on the medial epicondyle — inflammation there is \"golfer's elbow\". Palmaris longus is absent in about 15% of people and is a favourite tendon graft.",
        "zh": "由外向内：旋前圆肌、桡侧腕屈肌、掌长肌、尺侧腕屈肌；中层为指浅屈肌。均起自肱骨内上髁的屈肌总腱——此处炎症即“高尔夫球肘”。约15%的人缺如掌长肌，它是常用的肌腱移植材料。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1473M",
        "FJ1474M",
        "FJ1475M",
        "FJ1496M",
        "FJ1499M",
        "FJ1502M",
        "FJ1516M",
        "FJ1518M"
      ]
    },
    {
      "key": "gap-sau",
      "name": {
        "vi": "Cơ gấp lớp sâu",
        "en": "Deep flexors",
        "zh": "深层屈肌"
      },
      "latin": "Flexores profundi antebrachii",
      "note": {
        "vi": "Gấp các ngón sâu (gấp đốt xa — cơ duy nhất gấp được khớp liên đốt xa) và gấp ngón cái dài. Thử riêng: giữ đốt giữa, bảo bệnh nhân gập đốt xa. Nửa trong gấp các ngón sâu do thần kinh trụ, nửa ngoài do gian cốt trước (thần kinh giữa) — tổn thương mỗi dây mất một nửa.",
        "en": "Flexor digitorum profundus (flexing the distal phalanges — the only muscle that bends the distal interphalangeal joints) and flexor pollicis longus. To test it, hold the middle phalanx and ask the patient to bend the tip. The medial half of FDP is supplied by the ulnar nerve, the lateral half by the anterior interosseous (median) — each nerve injury loses one half.",
        "zh": "指深屈肌（屈远节指骨——唯一能屈远侧指间关节的肌肉）和拇长屈肌。检查时固定中节，让患者屈指尖。指深屈肌内侧半受尺神经、外侧半受骨间前神经（正中神经）支配——任一神经损伤丧失相应一半功能。"
      },
      "tint": "#e07a6a",
      "parts": [
        "FJ1497M",
        "FJ1498M"
      ]
    },
    {
      "key": "ngua-sap",
      "name": {
        "vi": "Cơ ngửa và cơ sấp vuông",
        "en": "Supinator and pronator quadratus",
        "zh": "旋后肌与旋前方肌"
      },
      "latin": "M. supinator · M. pronator quadratus",
      "note": {
        "vi": "Sấp vuông ở đầu dưới hai xương là cơ sấp chính khi không gắng sức. Cơ ngửa ôm cổ xương quay; nhánh sâu thần kinh quay chui qua cơ này (cung Frohse) — chỗ bị chèn gây yếu duỗi ngón mà không mất cảm giác.",
        "en": "Pronator quadratus at the lower ends of the two bones is the main pronator when no effort is needed. Supinator wraps the radial neck; the deep branch of the radial nerve passes through it (arcade of Frohse) — compression there weakens finger extension without sensory loss.",
        "zh": "旋前方肌位于两骨下端，是非用力时的主要旋前肌。旋后肌包绕桡骨颈；桡神经深支从中穿过（Frohse弓）——此处受压导致伸指无力而无感觉障碍。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ1503M",
        "FJ1505M"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Cơ duỗi cẳng tay",
        "en": "Forearm extensors",
        "zh": "前臂伸肌"
      },
      "latin": "Extensores antebrachii",
      "note": {
        "vi": "Duỗi cổ tay quay dài/ngắn, duỗi các ngón, duỗi ngón út, duỗi cổ tay trụ (lớp nông); dạng ngón cái dài, duỗi ngón cái ngắn/dài, duỗi ngón trỏ (lớp sâu). Chung gân gốc ở mỏm trên lồi cầu ngoài — viêm là \"khuỷu tay quần vợt\". Gân dạng dài + duỗi ngắn ngón cái viêm hẹp bao gân gây bệnh de Quervain.",
        "en": "Extensor carpi radialis longus/brevis, extensor digitorum, extensor digiti minimi, extensor carpi ulnaris (superficial); abductor pollicis longus, extensor pollicis brevis/longus, extensor indicis (deep). They share an origin on the lateral epicondyle — inflammation is \"tennis elbow\". Stenosing tenosynovitis of APL + EPB is de Quervain's disease.",
        "zh": "浅层：桡侧腕长/短伸肌、指伸肌、小指伸肌、尺侧腕伸肌；深层：拇长展肌、拇短/长伸肌、示指伸肌。共同起自外上髁——此处炎症即“网球肘”。拇长展肌与拇短伸肌腱鞘狭窄性腱鞘炎即de Quervain病。"
      },
      "tint": "#5fa89e",
      "parts": [
        "FJ1472M",
        "FJ1484M",
        "FJ1485M",
        "FJ1487M",
        "FJ1489M",
        "FJ1490M",
        "FJ1491M",
        "FJ1492M",
        "FJ1493M",
        "FJ1494M",
        "FJ1495M",
        "FJ1517M"
      ]
    },
    {
      "key": "o-mo-cai",
      "name": {
        "vi": "Ô mô cái và cơ khép ngón cái",
        "en": "Thenar muscles and adductor pollicis",
        "zh": "鱼际肌与拇收肌"
      },
      "latin": "Thenar",
      "note": {
        "vi": "Dạng ngón cái ngắn, gấp ngón cái ngắn, đối chiếu ngón cái (do thần kinh giữa, nhánh quặt ngược) và khép ngón cái (thần kinh trụ). Teo ô mô cái là dấu hiệu muộn của hội chứng ống cổ tay. Dấu Froment (gấp đốt xa khi kẹp giấy) cho thấy liệt cơ khép — tổn thương thần kinh trụ.",
        "en": "Abductor pollicis brevis, flexor pollicis brevis, opponens pollicis (median nerve, recurrent branch) and adductor pollicis (ulnar nerve). Thenar wasting is a late sign of carpal tunnel syndrome. Froment's sign (flexing the thumb tip to grip paper) reveals adductor paralysis — an ulnar nerve lesion.",
        "zh": "拇短展肌、拇短屈肌、拇对掌肌（正中神经返支）及拇收肌（尺神经）。鱼际萎缩是腕管综合征的晚期征象。Froment征（夹纸时屈拇指末节）提示拇收肌麻痹——尺神经损伤。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1469M",
        "FJ1481M",
        "FJ1483M",
        "FJ1501M",
        "FJ1514M",
        "FJ1515M"
      ]
    },
    {
      "key": "o-mo-ut",
      "name": {
        "vi": "Ô mô út",
        "en": "Hypothenar muscles",
        "zh": "小鱼际肌"
      },
      "latin": "Hypothenar",
      "note": {
        "vi": "Dạng ngón út, gấp ngón út ngắn, đối chiếu ngón út — cả ba do thần kinh trụ chi phối, nằm cạnh ống Guyon.",
        "en": "Abductor, short flexor and opponens of the little finger — all three supplied by the ulnar nerve, lying beside Guyon's canal.",
        "zh": "小指展肌、小指短屈肌、小指对掌肌——三者均受尺神经支配，位于Guyon管旁。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1466M",
        "FJ1470M",
        "FJ1482M"
      ]
    },
    {
      "key": "giun-gian-cot",
      "name": {
        "vi": "Cơ giun và cơ gian cốt",
        "en": "Lumbricals and interossei",
        "zh": "蚓状肌与骨间肌"
      },
      "latin": "Mm. lumbricales · interossei",
      "note": {
        "vi": "Gấp khớp đốt bàn–ngón và duỗi khớp liên đốt cùng lúc (tư thế \"cầm bút\"). Gian cốt mu DẠNG, gian cốt gan KHÉP ngón (mẹo DAB–PAD). Liệt do thần kinh trụ gây bàn tay vuốt trụ.",
        "en": "They flex the metacarpophalangeal joints while extending the interphalangeal joints (the \"writing\" position). Dorsal interossei ABduct, palmar interossei ADduct (DAB–PAD). Paralysis from an ulnar lesion causes the ulnar claw hand.",
        "zh": "同时屈掌指关节、伸指间关节（“执笔”姿势）。骨间背侧肌外展，骨间掌侧肌内收（DAB–PAD口诀）。尺神经损伤致其麻痹形成爪形手。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ1509M",
        "FJ1510M",
        "FJ1511M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch quay, trụ và cung gan tay",
        "en": "Radial and ulnar arteries, palmar arches",
        "zh": "桡、尺动脉与掌弓"
      },
      "latin": "Aa. radialis et ulnaris",
      "note": {
        "vi": "Động mạch quay nông ở cổ tay — chỗ bắt mạch; động mạch trụ vào ống Guyon. Hai động mạch nối nhau bằng cung gan tay nông (chủ yếu từ trụ) và sâu (chủ yếu từ quay).",
        "en": "The radial artery is superficial at the wrist — where the pulse is taken; the ulnar artery enters Guyon's canal. The two join in the superficial (mainly ulnar) and deep (mainly radial) palmar arches.",
        "zh": "桡动脉在腕部表浅——诊脉处；尺动脉进入Guyon管。二者借掌浅弓（主要来自尺动脉）和掌深弓（主要来自桡动脉）吻合。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2214",
        "FJ2223",
        "FJ2227",
        "FJ2231",
        "FJ2236",
        "FJ2242",
        "FJ2245",
        "FJ2248",
        "FJ2258",
        "FJ2314",
        "FJ2315",
        "FJ2316",
        "FJ2317",
        "FJ2332",
        "FJ2333",
        "FJ2334",
        "FJ2335",
        "FJ2336",
        "FJ2337",
        "FJ2338",
        "FJ2339"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch nông cẳng tay",
        "en": "Superficial forearm veins",
        "zh": "前臂浅静脉"
      },
      "latin": "Vv. superficiales membri superioris",
      "note": {
        "vi": "Mạng mu tay tạo tĩnh mạch đầu (ngoài) và nền (trong), nối nhau bằng tĩnh mạch giữa khuỷu — chỗ lấy máu.",
        "en": "The dorsal network gives rise to the cephalic (lateral) and basilic (medial) veins, linked by the median cubital vein — the blood-draw site.",
        "zh": "手背静脉网形成头静脉（外侧）和贵要静脉（内侧），二者借肘正中静脉相连——采血部位。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2218",
        "FJ2220",
        "FJ2228",
        "FJ2234",
        "FJ2235"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương cẳng tay và bàn tay (mốc)",
        "en": "Forearm and hand bones (landmarks)",
        "zh": "前臂骨与手骨（标志）"
      },
      "latin": "Radius · Ulna · Ossa manus",
      "note": {
        "vi": "Mờ sẵn để thấy chỗ bám và đường đi của gân.",
        "en": "Faded to show attachments and tendon courses.",
        "zh": "淡化以显示附着处与肌腱走行。"
      },
      "parts": [
        "FJ1471M",
        "FJ1476M",
        "FJ3183",
        "FJ3184",
        "FJ3186",
        "FJ3187",
        "FJ3188",
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252",
        "FJ3257",
        "FJ3261",
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
