
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Cổ tay và ống cổ tay" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây giữa, dây trụ và các dây chằng cổ tay.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-a.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const carpalTunnelScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/carpal-tunnel.ts#carpalTunnelScene", {
  "slug": "co-tay-ong-co-tay",
  "title": {
    "vi": "Xương cổ tay và ống cổ tay",
    "en": "The Carpus and Carpal Tunnel",
    "zh": "腕骨与腕管"
  },
  "latin": "Carpus · Canalis carpi",
  "intro": {
    "vi": "Tám xương cổ tay xếp thành hai hàng và tạo một máng lõm ở mặt gan tay. Mạc giữ gân gấp căng ngang trên máng, biến nó thành ống cổ tay. Trong ống có chín gân gấp: bốn gân gấp nông, bốn gân gấp sâu, một gân gấp dài ngón cái. Dây giữa cũng chạy trong ống nhưng bộ dữ liệu không có. Ống chật nên chỉ cần phù nề nhẹ là dây giữa bị chèn ép, gây hội chứng ống cổ tay. Hai hàng xương mang hai màu, gân gấp mỗi cơ một màu.",
    "en": "The eight carpal bones form two rows and a hollow gutter on the palmar side. The flexor retinaculum spans the gutter and turns it into the carpal tunnel. Through it run nine flexor tendons: four of flexor superficialis, four of flexor profundus and one of flexor pollicis longus. The median nerve also runs through it but is not in the dataset. The tunnel is tight, so slight swelling compresses the median nerve and causes carpal tunnel syndrome. The two rows of bones have two colours, and each flexor has its own.",
    "zh": "八块腕骨排成两列，在掌侧形成凹槽；屈肌支持带横跨其上，构成腕管。管内有九条屈肌腱：指浅屈肌腱4条、指深屈肌腱4条、拇长屈肌腱1条。正中神经也经管内走行，但数据集中没有。腕管狭窄，轻度水肿即可压迫正中神经，引起腕管综合征。两列腕骨两种颜色，每块屈肌一种颜色。"
  },
  "frameGroups": [
    "hang-tren",
    "hang-duoi",
    "mac-giu",
    "gan"
  ],
  "fadedGroups": [
    "xuong-dai"
  ],
  "groups": [
    {
      "key": "hang-tren",
      "name": {
        "vi": "Hàng trên: thuyền, nguyệt, tháp, đậu",
        "en": "Proximal row: scaphoid, lunate, triquetrum, pisiform",
        "zh": "近侧列：手舟骨、月骨、三角骨、豌豆骨"
      },
      "latin": "Os scaphoideum, lunatum, triquetrum, pisiforme",
      "note": {
        "vi": "Xương thuyền gãy nhiều nhất khi ngã chống tay. Máu nuôi nó đi từ đầu xa lên, nên gãy ở eo dễ gây hoại tử cực gần. Xương nguyệt dễ trật ra trước và đè vào ống cổ tay.",
        "en": "The scaphoid is the bone most often broken in a fall on the outstretched hand. Its blood enters distally, so a waist fracture risks necrosis of the proximal pole. The lunate can dislocate forward into the carpal tunnel.",
        "zh": "手舟骨是摔倒手撑地时最常骨折的腕骨。其血供自远端进入，腰部骨折易致近端缺血坏死。月骨可向前脱位压入腕管。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3268",
        "FJ3276",
        "FJ3278",
        "FJ3285"
      ]
    },
    {
      "key": "hang-duoi",
      "name": {
        "vi": "Hàng dưới: thang, thê, cả, móc",
        "en": "Distal row: trapezium, trapezoid, capitate, hamate",
        "zh": "远侧列：大多角骨、小多角骨、头状骨、钩骨"
      },
      "latin": "Os trapezium, trapezoideum, capitatum, hamatum",
      "note": {
        "vi": "Xương cả lớn nhất, nằm giữa. Móc xương móc và xương đậu tạo bờ trong của ống; củ xương thang và củ xương thuyền tạo bờ ngoài. Xương thang khớp yên ngựa với xương đốt bàn I, nên ngón cái đối chiếu được.",
        "en": "The capitate is the largest and sits in the centre. The hook of the hamate and the pisiform form the medial wall of the tunnel; the tubercles of the trapezium and scaphoid form the lateral wall. The trapezium's saddle joint with the first metacarpal lets the thumb oppose.",
        "zh": "头状骨最大，居中。钩骨钩和豌豆骨构成腕管内侧壁，大多角骨结节和手舟骨结节构成外侧壁。大多角骨与第1掌骨构成鞍状关节，使拇指能对掌。"
      },
      "tint": "#d98c5f",
      "parts": [
        "FJ3257",
        "FJ3261",
        "FJ3283",
        "FJ3284"
      ]
    },
    {
      "key": "mac-giu",
      "name": {
        "vi": "Mạc giữ gân gấp (mái ống cổ tay)",
        "en": "Flexor retinaculum (roof of the tunnel)",
        "zh": "屈肌支持带（腕管顶）"
      },
      "latin": "Retinaculum musculorum flexorum",
      "note": {
        "vi": "Dải xơ dày căng từ xương đậu và móc xương móc sang xương thuyền và xương thang. Phẫu thuật giải phóng ống cổ tay là cắt dải này.",
        "en": "A thick fibrous band stretched from the pisiform and hook of hamate to the scaphoid and trapezium. Carpal tunnel release is division of this band.",
        "zh": "自豌豆骨和钩骨钩横跨至手舟骨和大多角骨的坚厚纤维带。腕管松解术即切开此带。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1471M"
      ]
    },
    {
      "key": "gan",
      "name": {
        "vi": "Ba cơ có gân đi trong ống",
        "en": "The three muscles whose tendons pass through",
        "zh": "腱穿腕管的三块肌"
      },
      "latin": "Mm. flexor digitorum superficialis et profundus, flexor pollicis longus",
      "note": {
        "vi": "Gấp nông (bốn gân, lớp trước) gấp đốt giữa; gấp sâu (bốn gân, lớp sau) gấp đốt xa; gấp dài ngón cái đi riêng phía ngoài. Bao hoạt dịch chung bọc các gân này; viêm bao gân cũng làm hẹp ống.",
        "en": "Superficialis (four tendons, front layer) flexes the middle phalanges; profundus (four tendons, back layer) flexes the distal phalanges; flexor pollicis longus runs separately on the lateral side. A common synovial sheath wraps them, and tenosynovitis also narrows the tunnel.",
        "zh": "指浅屈肌（4腱，前层）屈中节指骨；指深屈肌（4腱，后层）屈远节指骨；拇长屈肌腱单独行于外侧。屈肌总腱鞘包裹诸腱，腱鞘炎也会使腕管变窄。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1475M",
        "FJ1497M",
        "FJ1498M",
        "FJ1499M"
      ]
    },
    {
      "key": "ngoai-ong",
      "name": {
        "vi": "Gân nằm ngoài ống",
        "en": "Tendons outside the tunnel",
        "zh": "腕管外的肌腱"
      },
      "latin": "M. flexor carpi radialis · M. palmaris longus · M. flexor carpi ulnaris",
      "note": {
        "vi": "Gan tay dài đi nông trên mạc giữ gân gấp và là mốc tìm dây giữa ngay dưới nó; khoảng 14% người không có cơ này. Gấp cổ tay quay đi trong một ngăn riêng. Gấp cổ tay trụ bám xương đậu.",
        "en": "Palmaris longus runs superficial to the retinaculum and marks the median nerve just beneath it; about 14% of people lack it. Flexor carpi radialis runs in its own compartment. Flexor carpi ulnaris inserts on the pisiform.",
        "zh": "掌长肌行于屈肌支持带浅面，其下方即正中神经；约14%的人缺如。桡侧腕屈肌行于独立的鞘内；尺侧腕屈肌止于豌豆骨。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1473M",
        "FJ1496M",
        "FJ1502M",
        "FJ1518M"
      ]
    },
    {
      "key": "dm-tru",
      "name": {
        "vi": "Động mạch trụ và quay ở cổ tay",
        "en": "Ulnar and radial arteries at the wrist",
        "zh": "腕部尺动脉与桡动脉"
      },
      "latin": "A. ulnaris · A. radialis",
      "note": {
        "vi": "Động mạch trụ đi nông trên mạc giữ gân gấp, cạnh xương đậu, trong ống Guyon cùng dây trụ. Động mạch quay nằm ngoài gân gấp cổ tay quay, là chỗ bắt mạch quay.",
        "en": "The ulnar artery passes superficial to the retinaculum beside the pisiform, in Guyon's canal with the ulnar nerve. The radial artery lies lateral to the flexor carpi radialis tendon — the site of the radial pulse.",
        "zh": "尺动脉在豌豆骨旁行于屈肌支持带浅面，与尺神经同在Guyon管内。桡动脉位于桡侧腕屈肌腱外侧，是桡动脉搏动触诊处。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2242",
        "FJ2258"
      ]
    },
    {
      "key": "xuong-dai",
      "name": {
        "vi": "Xương quay, trụ, đốt bàn (mốc)",
        "en": "Radius, ulna, metacarpals (landmarks)",
        "zh": "桡骨、尺骨、掌骨（标志）"
      },
      "latin": "Radius · Ulna · Ossa metacarpi",
      "note": {
        "vi": "Mờ sẵn để hai hàng xương cổ tay nổi rõ.",
        "en": "Faded so the two carpal rows stand out.",
        "zh": "淡化，使两列腕骨突出。"
      },
      "parts": [
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252",
        "FJ3277",
        "FJ3286"
      ]
    }
  ]
});
