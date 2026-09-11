/**
 * Scene "Nền sọ" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu các dây thần kinh sọ qua lỗ nền sọ (trừ dây II) và xoang tĩnh mạch.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const skullBaseScene: AtlasSceneDef = {
  "slug": "so-nen-so",
  "title": {
    "vi": "Nền sọ và các cấu trúc đi qua",
    "en": "The Cranial Base",
    "zh": "颅底"
  },
  "latin": "Basis cranii",
  "view": "top",
  "intro": {
    "vi": "Nhìn từ trên, nền sọ chia thành ba hố như bậc thang. Hố sọ trước (xương trán, sàng) đỡ thuỳ trán. Hố sọ giữa (xương bướm, thái dương) đỡ thuỳ thái dương và có hố yên chứa tuyến yên. Hố sọ sau (xương chẩm, thái dương) chứa tiểu não và thân não, có lỗ lớn cho hành não đi qua. Động mạch cảnh trong chui qua ống cảnh; động mạch đốt sống qua lỗ lớn. Vỡ nền sọ trước gây chảy dịch não tuỷ qua mũi và bầm quanh mắt (mắt gấu trúc). Mỗi xương một màu; não mờ sẵn.",
    "en": "Seen from above, the cranial base steps down in three fossae. The anterior fossa (frontal, ethmoid) carries the frontal lobes. The middle fossa (sphenoid, temporal) carries the temporal lobes and holds the sella turcica with the pituitary. The posterior fossa (occipital, temporal) holds the cerebellum and brainstem and has the foramen magnum for the medulla. The internal carotid enters through the carotid canal, the vertebral through the foramen magnum. An anterior base fracture leaks cerebrospinal fluid from the nose and bruises round the eyes (raccoon eyes). Each bone has its own colour; the brain is faded.",
    "zh": "从上面观，颅底呈阶梯状分为三个窝：颅前窝（额骨、筛骨）承托额叶；颅中窝（蝶骨、颞骨）承托颞叶，有容纳垂体的蝶鞍；颅后窝（枕骨、颞骨）容纳小脑和脑干，有供延髓通过的枕骨大孔。颈内动脉经颈动脉管入颅，椎动脉经枕骨大孔入颅。颅前窝骨折致脑脊液鼻漏和眶周淤血（熊猫眼）。每块骨一种颜色；脑淡化。"
  },
  "frameGroups": [
    "tran-sang",
    "buom",
    "thai-duong",
    "cham"
  ],
  "fadedGroups": [
    "nao"
  ],
  "clip": {
    "keepPositive": false,
    "axis": "y",
    "percent": 64
  },
  "groups": [
    {
      "key": "tran-sang",
      "name": {
        "vi": "Hố trước: xương trán và xương sàng",
        "en": "Anterior fossa: frontal and ethmoid",
        "zh": "颅前窝：额骨与筛骨"
      },
      "latin": "Os frontale · Os ethmoidale",
      "note": {
        "vi": "Mảnh sàng thủng lỗ cho sợi khứu giác. Nó rất mỏng, nên vỡ ở đây gây mất ngửi và rò dịch não tuỷ ra mũi.",
        "en": "The cribriform plate is perforated for the olfactory fibres. It is very thin, so a fracture here causes loss of smell and CSF rhinorrhoea.",
        "zh": "筛板有嗅丝穿过的小孔，非常薄，骨折致嗅觉丧失和脑脊液鼻漏。"
      },
      "tint": "#e6d7b0",
      "parts": [
        "FJ3199",
        "FJ3200"
      ]
    },
    {
      "key": "buom",
      "name": {
        "vi": "Hố giữa: xương bướm (hố yên)",
        "en": "Middle fossa: sphenoid (sella turcica)",
        "zh": "颅中窝：蝶骨（蝶鞍）"
      },
      "latin": "Os sphenoidale",
      "note": {
        "vi": "Thân xương bướm có hố yên ở giữa. Hai cánh bướm có khe ổ mắt trên, lỗ tròn, lỗ bầu dục cho các dây III–VI và nhánh dây V. Phẫu thuật u tuyến yên thường đi qua xoang bướm từ mũi.",
        "en": "Its body carries the sella turcica. The wings hold the superior orbital fissure, foramen rotundum and foramen ovale for nerves III–VI and branches of V. Pituitary tumours are usually removed through the sphenoid sinus via the nose.",
        "zh": "蝶骨体中央有蝶鞍。蝶骨翼有眶上裂、圆孔、卵圆孔，供第III–VI对脑神经及三叉神经分支通过。垂体瘤常经鼻蝶窦入路切除。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3394"
      ]
    },
    {
      "key": "thai-duong",
      "name": {
        "vi": "Xương thái dương (phần đá)",
        "en": "Temporal bones (petrous part)",
        "zh": "颞骨（岩部）"
      },
      "latin": "Os temporale (pars petrosa)",
      "note": {
        "vi": "Phần đá như bờ đá ngăn hố giữa với hố sau, chứa tai giữa, tai trong và ống cảnh. Vỡ xương đá gây chảy máu hoặc dịch não tuỷ qua tai và bầm sau tai (dấu hiệu Battle).",
        "en": "The petrous ridge separates the middle and posterior fossae and houses the middle and inner ear and the carotid canal. A petrous fracture causes blood or CSF from the ear and bruising behind it (Battle's sign).",
        "zh": "岩部如岩嵴分隔颅中窝与颅后窝，内含中耳、内耳和颈动脉管。岩部骨折致耳漏血或脑脊液及耳后淤斑（Battle征）。"
      },
      "tint": "#d98c5f",
      "parts": [
        "FJ3281",
        "FJ3386"
      ]
    },
    {
      "key": "cham",
      "name": {
        "vi": "Hố sau: xương chẩm (lỗ lớn)",
        "en": "Posterior fossa: occipital (foramen magnum)",
        "zh": "颅后窝：枕骨（枕骨大孔）"
      },
      "latin": "Os occipitale",
      "note": {
        "vi": "Lỗ lớn cho hành não, động mạch đốt sống và rễ tuỷ của dây XI đi qua. Hai lồi cầu chẩm khớp với đốt đội.",
        "en": "The foramen magnum passes the medulla, the vertebral arteries and the spinal roots of nerve XI. The occipital condyles articulate with the atlas.",
        "zh": "枕骨大孔有延髓、椎动脉和副神经脊髓根通过。枕髁与寰椎相关节。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ3309"
      ]
    },
    {
      "key": "yen",
      "name": {
        "vi": "Tuyến yên, giao thị, dây thị giác",
        "en": "Pituitary, optic chiasm, optic nerves",
        "zh": "垂体、视交叉、视神经"
      },
      "latin": "Hypophysis · Chiasma opticum · Nn. optici",
      "note": {
        "vi": "Giao thị nằm ngay trên tuyến yên. U tuyến yên phát triển lên trên đè giao thị, gây mất hai nửa thị trường phía thái dương.",
        "en": "The optic chiasm lies just above the pituitary. A pituitary tumour growing upward presses on it, causing loss of both temporal visual fields.",
        "zh": "视交叉位于垂体正上方。垂体瘤向上生长压迫视交叉，致双颞侧偏盲。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1796",
        "FJ1313",
        "FJ1364",
        "FJ1771",
        "FJ1772",
        "FJ1818",
        "FJ1819"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch cảnh trong, đốt sống, thân nền",
        "en": "Internal carotid, vertebral and basilar arteries",
        "zh": "颈内动脉、椎动脉、基底动脉"
      },
      "latin": "A. carotis interna · A. vertebralis · A. basilaris",
      "note": {
        "vi": "Động mạch cảnh trong đi qua ống cảnh trong xương đá, rồi uốn cong hình chữ S cạnh thân xương bướm (xi phông cảnh).",
        "en": "The internal carotid runs through the carotid canal in the petrous bone, then bends in an S beside the sphenoid body (the carotid siphon).",
        "zh": "颈内动脉经岩部的颈动脉管，再在蝶骨体旁呈S形弯曲（颈动脉虹吸部）。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1672",
        "FJ1682",
        "FJ1682M",
        "FJ1725",
        "FJ1725M"
      ]
    },
    {
      "key": "nao",
      "name": {
        "vi": "Thân não và tiểu não (mốc)",
        "en": "Brainstem and cerebellum (landmarks)",
        "zh": "脑干与小脑（标志）"
      },
      "latin": "Truncus encephali · Cerebellum",
      "note": {
        "vi": "Mờ sẵn — nằm trong hố sọ sau.",
        "en": "Faded — they fill the posterior fossa.",
        "zh": "淡化——位于颅后窝。"
      },
      "parts": [
        "FJ1769",
        "FJ1770",
        "FJ1775",
        "FJ1781",
        "FJ1817",
        "FJ1822",
        "FJ1830",
        "FJ1831"
      ]
    }
  ]
};
