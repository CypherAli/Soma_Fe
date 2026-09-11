/**
 * Scene "Khoang cẳng chân trước và ngoài" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Cơ mặt" cũ: atlas không có cơ bám da mặt.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const legAnteriorLateralScene: AtlasSceneDef = {
  "slug": "co-mat",
  "title": {
    "vi": "Khoang cẳng chân trước và ngoài",
    "en": "Anterior and Lateral Compartments of the Leg",
    "zh": "小腿前群与外侧群"
  },
  "latin": "Compartimentum cruris anterius et laterale",
  "system": "muscular",
  "intro": {
    "vi": "Cẳng chân được xương chày, xương mác, màng gian cốt và vách gian cơ chia thành các khoang cân kín. Khoang trước chứa bốn cơ gấp mu và động mạch chày trước. Khoang ngoài chứa cơ mác dài và mác ngắn. Vì khoang bó chặt trong cân, chảy máu hay phù sau gãy xương chày làm áp lực tăng nhanh, gây hội chứng chèn ép khoang. Khoang trước bị nhiều nhất và phải mở cân cấp cứu. Mỗi khoang một tông màu, mạch máu đỏ–xanh, xương mờ sẵn.",
    "en": "The tibia, fibula, interosseous membrane and intermuscular septa divide the leg into closed fascial compartments. The anterior compartment holds four dorsiflexors and the anterior tibial artery. The lateral compartment holds fibularis longus and brevis. Because they are tightly bound, bleeding or swelling after a tibial fracture raises the pressure fast and causes compartment syndrome. The anterior compartment is the most often affected and needs an emergency fasciotomy. Each compartment has its own colour family, vessels are red and blue, and bones are faded.",
    "zh": "胫骨、腓骨、骨间膜和肌间隔将小腿分为封闭的骨筋膜鞘。前群含四块背屈肌和胫前动脉；外侧群含腓骨长肌和腓骨短肌。由于筋膜紧束，胫骨骨折后出血或水肿使压力迅速升高，引起骨筋膜室综合征，前群最常受累，需紧急切开减压。每群一种色系，血管红蓝，骨骼淡化。"
  },
  "frameGroups": [
    "truoc",
    "ngoai",
    "dm"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "truoc",
      "name": {
        "vi": "Khoang trước: bốn cơ gấp mu",
        "en": "Anterior compartment: four dorsiflexors",
        "zh": "前群：四块背屈肌"
      },
      "latin": "Mm. tibialis anterior, extensor hallucis longus, extensor digitorum longus, fibularis tertius",
      "note": {
        "vi": "Từ trong ra ngoài: chày trước, duỗi dài ngón cái, duỗi dài các ngón, mác ba. Gân chày trước là gân nổi rõ nhất ở trước cổ chân khi kéo mũi chân lên. Dây mác sâu chi phối.",
        "en": "From medial to lateral: tibialis anterior, extensor hallucis longus, extensor digitorum longus, fibularis tertius. The tibialis anterior tendon is the most prominent at the front of the ankle when the toes are pulled up. Supplied by the deep fibular nerve.",
        "zh": "由内向外：胫骨前肌、拇长伸肌、趾长伸肌、第三腓骨肌。勾脚时胫骨前肌腱在踝前最为明显。受腓深神经支配。"
      },
      "tint": "#6f8fbf",
      "parts": [
        "FJ1406M",
        "FJ1408M",
        "FJ1411M",
        "FJ1439M"
      ]
    },
    {
      "key": "mu-chan",
      "name": {
        "vi": "Cơ duỗi ngắn ngón cái (mu chân)",
        "en": "Extensor hallucis brevis (dorsum of foot)",
        "zh": "拇短伸肌（足背）"
      },
      "latin": "M. extensor hallucis brevis",
      "note": {
        "vi": "Cơ nội tại duy nhất ở mu chân có trong bộ dữ liệu, cũng do dây mác sâu chi phối.",
        "en": "The only intrinsic muscle of the dorsum in the dataset; also supplied by the deep fibular nerve.",
        "zh": "数据集中足背唯一的足固有肌，亦受腓深神经支配。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ1407M"
      ]
    },
    {
      "key": "ngoai",
      "name": {
        "vi": "Khoang ngoài: mác dài và mác ngắn",
        "en": "Lateral compartment: fibularis longus and brevis",
        "zh": "外侧群：腓骨长肌与腓骨短肌"
      },
      "latin": "Mm. fibularis longus et brevis",
      "note": {
        "vi": "Lật ngoài bàn chân. Mác dài còn đỡ vòm ngang khi luồn dưới gan chân. Dây mác nông chi phối.",
        "en": "They evert the foot; fibularis longus also supports the transverse arch as it crosses the sole. Supplied by the superficial fibular nerve.",
        "zh": "使足外翻；腓骨长肌腱经足底时还支撑横弓。受腓浅神经支配。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1409M",
        "FJ1410M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch chày trước và mu chân",
        "en": "Anterior tibial and dorsalis pedis arteries",
        "zh": "胫前动脉与足背动脉"
      },
      "latin": "A. tibialis anterior → A. dorsalis pedis",
      "note": {
        "vi": "Xuyên màng gian cốt vào khoang trước, đi xuống trên màng này, qua trước cổ chân thành động mạch mu chân. Khoang ngoài không có động mạch riêng; máu nuôi đến từ nhánh động mạch mác.",
        "en": "Pierces the interosseous membrane into the anterior compartment, descends on it and crosses the ankle as the dorsalis pedis. The lateral compartment has no artery of its own and is fed by fibular branches.",
        "zh": "穿骨间膜入前群，沿骨间膜下行，经踝前成为足背动脉。外侧群无自己的动脉，由腓动脉分支供血。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2065",
        "FJ2066",
        "FJ2073"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch chày trước",
        "en": "Anterior tibial veins",
        "zh": "胫前静脉"
      },
      "latin": "Vv. tibiales anteriores",
      "note": {
        "vi": "Đi kèm động mạch, đổ lên tĩnh mạch khoeo.",
        "en": "Accompany the artery and drain up to the popliteal vein.",
        "zh": "伴行动脉，上行注入腘静脉。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2097",
        "FJ2183"
      ]
    },
    {
      "key": "mang",
      "name": {
        "vi": "Màng gian cốt cẳng chân",
        "en": "Interosseous membrane of the leg",
        "zh": "小腿骨间膜"
      },
      "latin": "Membrana interossea cruris",
      "note": {
        "vi": "Vách sau của khoang trước, cũng là chỗ bám của nhiều cơ.",
        "en": "The back wall of the anterior compartment and an attachment for many muscles.",
        "zh": "前群的后壁，也是多块肌肉的附着处。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1392M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chày, mác và bàn chân (mốc)",
        "en": "Tibia, fibula and foot bones (landmarks)",
        "zh": "胫骨、腓骨与足骨（标志）"
      },
      "latin": "Tibia · Fibula · Ossa pedis",
      "note": {
        "vi": "Mờ sẵn. Mặt trong xương chày nằm ngay dưới da, không có cơ che.",
        "en": "Faded. The medial surface of the tibia lies just under the skin with no muscle cover.",
        "zh": "淡化。胫骨内侧面直接位于皮下，无肌肉覆盖。"
      },
      "parts": [
        "FJ3260",
        "FJ3282",
        "FJ3179",
        "FJ3180",
        "FJ3181",
        "FJ3182",
        "FJ3185",
        "FJ3241",
        "FJ3244",
        "FJ3247",
        "FJ3250",
        "FJ3253",
        "FJ3256",
        "FJ3258",
        "FJ3264",
        "FJ3266",
        "FJ3267",
        "FJ3270",
        "FJ3271",
        "FJ3280",
        "FJ3293",
        "FJ3294",
        "FJ3295",
        "FJ3298",
        "FJ3311",
        "FJ3312",
        "FJ3315",
        "FJ3328",
        "FJ3329"
      ]
    }
  ]
};
