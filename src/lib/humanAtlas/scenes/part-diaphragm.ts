
import { bindContentSource } from "@/lib/content/source";
/**
 * Bài bộ phận "Cơ hoành và cơ hô hấp — học theo lớp" học theo lớp — nhóm lấy từ diaphragm.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partDiaphragmScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/part-diaphragm.ts#partDiaphragmScene", {
  "slug": "bo-phan-co-hoanh",
  "title": {
    "vi": "Cơ hoành và cơ hô hấp — học theo lớp",
    "en": "Diaphragm and Breathing Muscles — Layer by Layer",
    "zh": "膈与呼吸肌——分层学习"
  },
  "latin": "Diaphragma",
  "system": "muscular",
  "intro": {
    "vi": "Mở ra là cơ hoành, vòm cơ ngăn ngực với bụng. Bật lớp Cơ hô hấp khác để thấy cơ gian sườn, các cơ hô hấp phụ và cơ thắt lưng. Bật lớp Cấu trúc xuyên hoành để thấy động mạch chủ, tĩnh mạch chủ dưới và tĩnh mạch thực quản chui qua ba lỗ ở các mức T8, T10 và T12.",
    "en": "It opens on the diaphragm, the muscular dome between chest and abdomen. Turn on Other breathing muscles for the intercostals, accessory muscles and psoas. Turn on Structures through the diaphragm for the aorta, inferior vena cava and oesophageal veins passing through the three openings at T8, T10 and T12.",
    "zh": "打开时显示膈——分隔胸腹的肌性穹窿。开启“其他呼吸肌”可见肋间肌、辅助呼吸肌和腰大肌；开启“穿膈结构”可见经T8、T10、T12三个裂孔穿过的主动脉、下腔静脉和食管静脉。"
  },
  "layers": [
    {
      "key": "hoanh",
      "name": {
        "vi": "Cơ hoành",
        "en": "Diaphragm",
        "zh": "膈"
      },
      "groups": [
        "co-hoanh"
      ],
      "on": true
    },
    {
      "key": "khac",
      "name": {
        "vi": "Cơ hô hấp khác",
        "en": "Other breathing muscles",
        "zh": "其他呼吸肌"
      },
      "groups": [
        "lien-suon-ngoai",
        "lien-suon-trong",
        "co-phu",
        "that-lung"
      ]
    },
    {
      "key": "xuyen",
      "name": {
        "vi": "Cấu trúc xuyên hoành",
        "en": "Structures through it",
        "zh": "穿膈结构"
      },
      "groups": [
        "mach-qua-hoanh",
        "tm-thuc-quan"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương",
        "en": "Bones",
        "zh": "骨"
      },
      "groups": [
        "xuong"
      ]
    }
  ],
  "groups": [
    {
      "key": "co-hoanh",
      "name": {
        "vi": "Cơ hoành",
        "en": "Diaphragm",
        "zh": "膈"
      },
      "latin": "Diaphragma",
      "note": {
        "vi": "Vòm cơ-gân ngăn ngực và bụng; trung tâm gân ở giữa, phần cơ toả ra bám xương ức, sườn và cột sống thắt lưng (trụ hoành). Do thần kinh hoành (C3–C5) chi phối — \"C3, 4, 5 keeps the diaphragm alive\" — nên chấn thương tuỷ cổ cao gây ngừng thở. Đau cơ hoành lan lên vai (cùng khoanh C4).",
        "en": "A musculotendinous dome separating chest from abdomen; a central tendon with muscle radiating to the sternum, ribs and lumbar spine (the crura). Supplied by the phrenic nerve (C3–C5) — \"C3, 4, 5 keeps the diaphragm alive\" — so a high cervical cord injury stops breathing. Diaphragmatic pain is referred to the shoulder (same C4 dermatome).",
        "zh": "分隔胸腔与腹腔的肌腱性穹窿；中央为中心腱，肌部放射状附着于胸骨、肋骨和腰椎（膈脚）。由膈神经（C3–C5）支配——“C3、4、5维持膈肌存活”——故高位颈髓损伤导致呼吸停止。膈肌疼痛可牵涉至肩部（同属C4皮节）。"
      },
      "tint": "#b36b5a",
      "parts": [
        "FJ3131"
      ]
    },
    {
      "key": "lien-suon-ngoai",
      "name": {
        "vi": "Cơ liên sườn ngoài",
        "en": "External intercostals",
        "zh": "肋间外肌"
      },
      "latin": "Mm. intercostales externi",
      "note": {
        "vi": "Thớ chạy chếch xuống-ra trước (như tay cho vào túi quần). Nâng sườn khi hít vào — động tác \"tay cầm xô\" ở sườn dưới và \"cán bơm\" ở sườn trên.",
        "en": "Fibres run down and forward (like hands in the front pockets). They raise the ribs in inspiration — the \"bucket-handle\" movement of the lower ribs and the \"pump-handle\" movement of the upper ones.",
        "zh": "肌纤维斜向前下（如手插入前裤袋的方向）。吸气时上提肋骨——下位肋呈“桶柄样”运动，上位肋呈“泵柄样”运动。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1451",
        "FJ1451M"
      ]
    },
    {
      "key": "lien-suon-trong",
      "name": {
        "vi": "Cơ liên sườn trong và trong cùng",
        "en": "Internal and innermost intercostals",
        "zh": "肋间内肌与肋间最内肌"
      },
      "latin": "Mm. intercostales interni et intimi",
      "note": {
        "vi": "Thớ vuông góc với lớp ngoài, kéo sườn xuống khi thở ra gắng sức. Bó mạch thần kinh liên sườn chạy giữa lớp trong và trong cùng, dọc BỜ DƯỚI mỗi xương sườn — nên chọc dịch màng phổi phải đi sát BỜ TRÊN xương sườn dưới.",
        "en": "Fibres at right angles to the outer layer, pulling the ribs down in forced expiration. The intercostal neurovascular bundle runs between the internal and innermost layers along the LOWER border of each rib — so a pleural tap must go just above the UPPER border of the rib below.",
        "zh": "肌纤维与外层垂直，用力呼气时下拉肋骨。肋间血管神经束行于肋间内肌与最内肌之间、每根肋骨下缘——故胸腔穿刺须紧贴下位肋骨上缘进针。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1454",
        "FJ1454M",
        "FJ1455",
        "FJ1455M"
      ]
    },
    {
      "key": "co-phu",
      "name": {
        "vi": "Cơ hô hấp phụ của thành ngực",
        "en": "Accessory chest-wall muscles",
        "zh": "胸壁辅助呼吸肌"
      },
      "latin": "Mm. transversus thoracis, levatores costarum, serrati posteriores",
      "note": {
        "vi": "Cơ ngang ngực (mặt trong xương ức), cơ nâng sườn và hai cơ răng sau (trên, dưới). Góp phần nhỏ khi thở bình thường; được huy động khi khó thở.",
        "en": "Transversus thoracis (behind the sternum), the levatores costarum and the two serratus posterior muscles (superior, inferior). They contribute little in quiet breathing but are recruited in respiratory distress.",
        "zh": "胸横肌（胸骨后面）、肋提肌及上、下后锯肌。平静呼吸时作用很小，呼吸困难时被动员。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1461",
        "FJ1461M",
        "FJ1541",
        "FJ1541M",
        "FJ1542",
        "FJ1542M"
      ]
    },
    {
      "key": "that-lung",
      "name": {
        "vi": "Cơ thắt lưng lớn",
        "en": "Psoas major",
        "zh": "腰大肌"
      },
      "latin": "M. psoas major",
      "note": {
        "vi": "Chui qua dưới dây chằng cung trong của cơ hoành. Liên quan cơ hoành ở phía sau; áp xe cạnh thận có thể lan theo nó. (Atlas không có cơ vuông thắt lưng.)",
        "en": "Passes under the medial arcuate ligament of the diaphragm, which relates it to the diaphragm posteriorly; perinephric abscesses can track along it. (The atlas has no quadratus lumborum.)",
        "zh": "穿过膈的内侧弓状韧带下方，与膈后部相邻；肾周脓肿可沿其蔓延。（图谱中无腰方肌。）"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ1431",
        "FJ1431M"
      ]
    },
    {
      "key": "mach-qua-hoanh",
      "name": {
        "vi": "Động mạch chủ và động mạch hoành dưới",
        "en": "Aorta and inferior phrenic arteries",
        "zh": "主动脉与膈下动脉"
      },
      "latin": "Aorta · Aa. phrenicae inferiores",
      "note": {
        "vi": "Động mạch chủ đi SAU cơ hoành qua lỗ động mạch chủ (T12) — thực chất là khe giữa hai trụ hoành, nên cơ hoành co không bóp động mạch chủ. Động mạch hoành dưới là nhánh đầu tiên của động mạch chủ bụng.",
        "en": "The aorta passes BEHIND the diaphragm through the aortic hiatus (T12) — really a gap between the two crura, so diaphragmatic contraction does not squeeze it. The inferior phrenic arteries are the first branches of the abdominal aorta.",
        "zh": "主动脉经主动脉裂孔（T12）从膈后方穿过——实为两膈脚之间的间隙，故膈收缩时不压迫主动脉。膈下动脉是腹主动脉的第一对分支。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1931",
        "FJ1932",
        "FJ1969",
        "FJ1979",
        "FJ3514",
        "FJ3515",
        "FJ3516",
        "FJ3517",
        "FJ3518",
        "FJ3519",
        "FJ3520",
        "FJ3619",
        "FJ3620",
        "FJ3621",
        "FJ3622",
        "FJ3623",
        "FJ3624",
        "FJ3625",
        "FJ3626"
      ]
    },
    {
      "key": "tm-thuc-quan",
      "name": {
        "vi": "Tĩnh mạch chủ dưới và thực quản",
        "en": "Inferior vena cava and oesophagus",
        "zh": "下腔静脉与食管"
      },
      "latin": "V. cava inferior · Oesophagus",
      "note": {
        "vi": "Tĩnh mạch chủ dưới xuyên qua trung tâm gân (T8) — hít vào cơ hoành co làm lỗ này RỘNG ra, giúp máu về tim. Thực quản qua lỗ cơ ở trụ phải (T10) — hít vào lỗ này THẮT lại, chống trào ngược.",
        "en": "The IVC passes through the central tendon (T8) — inspiration WIDENS this opening, helping venous return. The oesophagus passes through a muscular hiatus in the right crus (T10) — inspiration TIGHTENS it, resisting reflux.",
        "zh": "下腔静脉穿中心腱（T8）——吸气时此孔扩大，促进静脉回流。食管穿右膈脚形成的肌性裂孔（T10）——吸气时此孔收紧，防止反流。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2563",
        "FJ3441",
        "FJ3659"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương sườn, ức và cột sống (mốc)",
        "en": "Ribs, sternum and spine (landmarks)",
        "zh": "肋骨、胸骨与脊柱（标志）"
      },
      "latin": "Costae · Vertebrae · Sternum",
      "note": {
        "vi": "Mờ sẵn để thấy chỗ bám của cơ hoành và các lớp cơ liên sườn.",
        "en": "Faded to show where the diaphragm and intercostal layers attach.",
        "zh": "淡化以显示膈和肋间肌各层的附着处。"
      },
      "parts": [
        "FJ3153",
        "FJ3154",
        "FJ3155",
        "FJ3156",
        "FJ3157",
        "FJ3158",
        "FJ3159",
        "FJ3160",
        "FJ3162",
        "FJ3163",
        "FJ3165",
        "FJ3166",
        "FJ3168",
        "FJ3169",
        "FJ3171",
        "FJ3173",
        "FJ3174",
        "FJ3175",
        "FJ3178",
        "FJ3225",
        "FJ3226",
        "FJ3227",
        "FJ3228",
        "FJ3229",
        "FJ3230",
        "FJ3231",
        "FJ3232",
        "FJ3233",
        "FJ3234",
        "FJ3235",
        "FJ3236",
        "FJ3239",
        "FJ3242",
        "FJ3245",
        "FJ3248",
        "FJ3251",
        "FJ3254",
        "FJ3255",
        "FJ3290",
        "FJ3330",
        "FJ3331",
        "FJ3332",
        "FJ3333",
        "FJ3334",
        "FJ3335",
        "FJ3336",
        "FJ3337",
        "FJ3338",
        "FJ3339",
        "FJ3340",
        "FJ3341",
        "FJ3342",
        "FJ3343",
        "FJ3344",
        "FJ3345",
        "FJ3346",
        "FJ3347",
        "FJ3348"
      ]
    }
  ]
});
