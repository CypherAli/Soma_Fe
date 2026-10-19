
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Bàn tay chi tiết" (bàn tay trái) dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu bao gân, dây chằng, thần kinh, móng.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-hand-detail.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const handDetailScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/hand-detail.ts#handDetailScene", {
  "slug": "giai-phau-ban-tay",
  "title": {
    "vi": "Bàn tay chi tiết",
    "en": "The Hand in Detail",
    "zh": "手部详解"
  },
  "latin": "Manus",
  "intro": {
    "vi": "Bàn tay có hai bộ cơ: cơ NGOẠI LAI từ cẳng tay (chỉ gân đi xuống — lực nắm mạnh) và cơ NỘI TẠI nằm hẳn trong bàn tay (động tác tinh). Nội tại gồm ô mô cái, ô mô út, cơ khép ngón cái, cơ giun và cơ gian cốt. Mạc giữ gân gấp căng qua máng cổ tay tạo ống cổ tay. Bộ dữ liệu không có bao hoạt dịch, bao xơ ngón, dây chằng, thần kinh và móng; xương mờ sẵn.",
    "en": "The hand has two sets of muscles: EXTRINSIC ones from the forearm (only their tendons come down — powerful grip) and INTRINSIC ones lying entirely within the hand (fine movement). The intrinsics are the thenar and hypothenar groups, adductor pollicis, lumbricals and interossei. The flexor retinaculum spans the carpal gutter to form the carpal tunnel. The dataset has no synovial or fibrous sheaths, ligaments, nerves or nails; bones are faded.",
    "zh": "手有两组肌肉：来自前臂的外在肌（仅肌腱下行——提供强握力）和完全位于手内的内在肌（精细动作）。内在肌包括鱼际肌、小鱼际肌、拇收肌、蚓状肌和骨间肌。屈肌支持带横跨腕骨沟形成腕管。数据集中无滑膜鞘、纤维鞘、韧带、神经和指甲；骨骼淡化。"
  },
  "frameGroups": [
    "o-mo-cai",
    "khep-cai",
    "o-mo-ut",
    "giun",
    "gian-cot",
    "ong-co-tay",
    "dm",
    "xuong"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "o-mo-cai",
      "name": {
        "vi": "Ô mô cái",
        "en": "Thenar eminence",
        "zh": "鱼际"
      },
      "latin": "Mm. thenares",
      "note": {
        "vi": "Dạng ngón cái ngắn, gấp ngón cái ngắn, đối chiếu ngón cái — nhánh quặt ngược thần kinh giữa chi phối (\"dây thần kinh triệu đô\": rạch nhầm là mất đối chiếu). Teo ô mô cái là dấu hiệu muộn của hội chứng ống cổ tay.",
        "en": "Abductor pollicis brevis, flexor pollicis brevis, opponens pollicis — supplied by the recurrent branch of the median nerve (the \"million-dollar nerve\": cut it and opposition is lost). Thenar wasting is a late sign of carpal tunnel syndrome.",
        "zh": "拇短展肌、拇短屈肌、拇对掌肌——受正中神经返支支配（“百万美元神经”：误切即丧失对掌功能）。鱼际萎缩是腕管综合征的晚期征象。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1469M",
        "FJ1483M",
        "FJ1501M",
        "FJ1514M"
      ]
    },
    {
      "key": "khep-cai",
      "name": {
        "vi": "Cơ khép ngón cái",
        "en": "Adductor pollicis",
        "zh": "拇收肌"
      },
      "latin": "M. adductor pollicis",
      "note": {
        "vi": "Hai đầu chéo và ngang, nằm sâu trong lòng bàn tay, do thần kinh TRỤ chi phối dù thuộc ngón cái. Dấu Froment: kẹp tờ giấy giữa ngón cái và ngón trỏ, bệnh nhân phải gấp đốt xa ngón cái để bù — liệt cơ khép.",
        "en": "Oblique and transverse heads deep in the palm, supplied by the ULNAR nerve even though it moves the thumb. Froment's sign: gripping paper between thumb and index finger, the patient bends the thumb tip to compensate — adductor paralysis.",
        "zh": "有斜头和横头，位于掌深部，虽作用于拇指却受尺神经支配。Froment征：拇指与示指夹纸时，患者需屈拇指末节代偿——提示拇收肌麻痹。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ1481M",
        "FJ1515M"
      ]
    },
    {
      "key": "o-mo-ut",
      "name": {
        "vi": "Ô mô út",
        "en": "Hypothenar eminence",
        "zh": "小鱼际"
      },
      "latin": "Mm. hypothenares",
      "note": {
        "vi": "Dạng, gấp ngắn và đối chiếu ngón út, đều do thần kinh trụ. Nằm cạnh ống Guyon — chèn ép thần kinh trụ ở đây (người đi xe đạp đường dài) teo ô mô út và cơ gian cốt nhưng chừa cảm giác mu tay.",
        "en": "Abductor, short flexor and opponens of the little finger, all by the ulnar nerve. They lie beside Guyon's canal — ulnar compression there (long-distance cyclists) wastes the hypothenar and interossei but spares dorsal hand sensation.",
        "zh": "小指展肌、小指短屈肌和小指对掌肌，均受尺神经支配。位于Guyon管旁——此处尺神经受压（长途骑行者）致小鱼际和骨间肌萎缩，但手背感觉保留。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1466M",
        "FJ1470M",
        "FJ1482M"
      ]
    },
    {
      "key": "giun",
      "name": {
        "vi": "Cơ giun",
        "en": "Lumbricals",
        "zh": "蚓状肌"
      },
      "latin": "Mm. lumbricales",
      "note": {
        "vi": "Bốn cơ nhỏ bám từ GÂN gấp các ngón sâu sang gân duỗi — cơ duy nhất cơ thể bám từ gân sang gân. Gấp khớp đốt bàn–ngón, duỗi khớp liên đốt. Hai cơ ngoài do thần kinh giữa, hai cơ trong do thần kinh trụ.",
        "en": "Four small muscles running from the TENDONS of flexor digitorum profundus to the extensor expansions — the only muscles in the body arising from tendon and inserting into tendon. They flex the MCP joints and extend the IP joints. The lateral two are median-supplied, the medial two ulnar.",
        "zh": "四条小肌自指深屈肌腱起始，止于伸肌腱膜——全身唯一起止均在肌腱上的肌肉。屈掌指关节、伸指间关节。外侧两条受正中神经、内侧两条受尺神经支配。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ1510M"
      ]
    },
    {
      "key": "gian-cot",
      "name": {
        "vi": "Cơ gian cốt mu và gan",
        "en": "Dorsal and palmar interossei",
        "zh": "骨间背侧肌与掌侧肌"
      },
      "latin": "Mm. interossei",
      "note": {
        "vi": "Gian cốt mu DẠNG ngón ra xa ngón giữa, gian cốt gan KHÉP về (mẹo DAB–PAD). Toàn bộ do nhánh sâu thần kinh trụ. Teo gian cốt mu tạo rãnh lõm giữa các xương đốt bàn ở mu tay.",
        "en": "Dorsal interossei ABduct the fingers away from the middle finger, palmar interossei ADduct them (DAB–PAD). All are supplied by the deep branch of the ulnar nerve. Wasting of the dorsal interossei leaves grooves between the metacarpals on the back of the hand.",
        "zh": "骨间背侧肌使手指远离中指外展，骨间掌侧肌使其内收（DAB–PAD）。均受尺神经深支支配。骨间背侧肌萎缩在手背掌骨间形成凹沟。"
      },
      "tint": "#5f9ea3",
      "parts": [
        "FJ1509M",
        "FJ1511M"
      ]
    },
    {
      "key": "ong-co-tay",
      "name": {
        "vi": "Mạc giữ gân gấp (trần ống cổ tay)",
        "en": "Flexor retinaculum (carpal tunnel roof)",
        "zh": "屈肌支持带（腕管顶）"
      },
      "latin": "Retinaculum musculorum flexorum",
      "note": {
        "vi": "Căng từ xương thuyền, thang sang xương đậu, móc. Ống cổ tay chứa 9 gân gấp và thần kinh giữa — phù nề hay thai kỳ làm thần kinh giữa bị chèn: tê ba ngón rưỡi ngoài về đêm. Mổ giải phóng là cắt dọc mạc này. (Atlas xếp mạc giữ gân vào hệ giác quan.)",
        "en": "Stretches from the scaphoid and trapezium to the pisiform and hamate. The tunnel holds 9 flexor tendons and the median nerve — swelling or pregnancy compresses the nerve: night-time numbness of the lateral three and a half fingers. Surgical release divides this band. (The atlas files it under the sense organs.)",
        "zh": "自手舟骨、大多角骨延至豌豆骨、钩骨。腕管内有9条屈肌腱和正中神经——水肿或妊娠可压迫正中神经：夜间外侧三个半手指麻木。手术松解即纵行切开此带。（图谱将其归入感觉器官。）"
      },
      "tint": "#e8e0c0",
      "parts": [
        "FJ1471M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Cung gan tay và động mạch ngón",
        "en": "Palmar arches and digital arteries",
        "zh": "掌弓与指动脉"
      },
      "latin": "Arcus palmares · Aa. digitales",
      "note": {
        "vi": "Cung nông ngang nếp gan tay giữa, cung sâu cao hơn khoảng 1cm; từ đó tách động mạch gan ngón chung rồi riêng chạy hai bên mỗi ngón.",
        "en": "The superficial arch lies at the mid-palmar crease, the deep arch about 1cm higher; they give common then proper palmar digital arteries running along each side of every finger.",
        "zh": "掌浅弓平掌中横纹，掌深弓约高1cm；由此发出指掌侧总动脉，再分为沿每指两侧走行的指掌侧固有动脉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2227",
        "FJ2231",
        "FJ2236",
        "FJ2237",
        "FJ2248",
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
        "FJ2339",
        "FJ2348"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch bàn tay",
        "en": "Veins of the hand",
        "zh": "手部静脉"
      },
      "latin": "Rete venosum dorsale manus",
      "note": {
        "vi": "Máu gan tay chủ yếu đổ ra mạng tĩnh mạch mu tay — nên nhiễm trùng gan tay thường gây sưng mu tay.",
        "en": "Most palmar blood drains to the dorsal venous network — which is why a palmar infection often swells the back of the hand.",
        "zh": "手掌血液主要回流至手背静脉网——因此手掌感染常导致手背肿胀。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2228",
        "FJ2229",
        "FJ2238",
        "FJ2249",
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
      "key": "xuong",
      "name": {
        "vi": "Xương bàn tay (mốc)",
        "en": "Hand bones (landmarks)",
        "zh": "手骨（标志）"
      },
      "latin": "Ossa manus",
      "note": {
        "vi": "8 xương cổ tay, 5 xương đốt bàn, 14 đốt ngón — mờ sẵn để thấy cơ và mạch.",
        "en": "8 carpals, 5 metacarpals, 14 phalanges — faded so the muscles and vessels show.",
        "zh": "8块腕骨、5块掌骨、14节指骨——淡化以显示肌肉与血管。"
      },
      "parts": [
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
        "FJ3278",
        "FJ3283",
        "FJ3284",
        "FJ3285",
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
