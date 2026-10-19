
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Hệ tĩnh mạch chi dưới" (bên trái) dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-leg-veins.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const legVeinsScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/leg-veins.ts#legVeinsScene", {
  "slug": "tinh-mach-hien",
  "title": {
    "vi": "Hệ tĩnh mạch chi dưới",
    "en": "Veins of the Lower Limb",
    "zh": "下肢静脉"
  },
  "latin": "Venae membri inferioris",
  "intro": {
    "vi": "Chân có hai hệ tĩnh mạch. Hệ NÔNG (xanh nhạt) nằm dưới da: tĩnh mạch hiển lớn dọc mặt trong và hiển bé ở bắp chân. Hệ SÂU (xanh đậm) đi kèm động mạch cùng tên, mang khoảng 90% máu về. Tĩnh mạch xuyên nối hai hệ và có van chỉ cho máu đi từ nông vào sâu; cơ bắp chân co bóp đẩy máu lên tim. Van hỏng thì máu dồn ngược ra hệ nông — giãn tĩnh mạch, loét quanh mắt cá trong.",
    "en": "The leg has two venous systems. The SUPERFICIAL system (light blue) lies under the skin: the great saphenous along the medial side and the small saphenous in the calf. The DEEP system (dark blue) accompanies the arteries of the same name and carries about 90% of the return. Perforating veins link the two, with valves that let blood pass only from superficial to deep; the calf muscle pump pushes it up to the heart. When the valves fail, blood refluxes into the superficial veins — varicose veins and ulcers above the medial malleolus.",
    "zh": "下肢有两套静脉系统。浅静脉（浅蓝）位于皮下：大隐静脉沿内侧上行，小隐静脉位于小腿后方。深静脉（深蓝）与同名动脉伴行，承担约90%的回流。穿静脉连接两者，其瓣膜只允许血液由浅入深；小腿肌泵将血液推回心脏。瓣膜功能不全时血液反流入浅静脉——形成静脉曲张及内踝上方溃疡。"
  },
  "frameGroups": [
    "hien-lon",
    "hien-be",
    "tm-sau-dui",
    "tm-sau-cang",
    "tm-xuyen",
    "tm-ban-chan"
  ],
  "fadedGroups": [
    "xuong-moc"
  ],
  "groups": [
    {
      "key": "hien-lon",
      "name": {
        "vi": "Tĩnh mạch hiển lớn",
        "en": "Great saphenous vein",
        "zh": "大隐静脉"
      },
      "latin": "V. saphena magna",
      "note": {
        "vi": "Tĩnh mạch dài nhất cơ thể: từ bờ trong cung tĩnh mạch mu chân, đi TRƯỚC mắt cá trong (chỗ bộc lộ khi cấp cứu không lấy được ven), dọc mặt trong gối và đùi, đổ vào tĩnh mạch đùi ở lỗ hiển dưới dây chằng bẹn. Là đoạn ghép hay dùng trong mổ bắc cầu mạch vành.",
        "en": "The longest vein in the body: from the medial end of the dorsal venous arch, passing IN FRONT of the medial malleolus (the cut-down site when no other vein can be found), up the medial knee and thigh, into the femoral vein at the saphenous opening below the inguinal ligament. It is the usual graft in coronary bypass surgery.",
        "zh": "全身最长的静脉：起自足背静脉弓内侧端，经内踝前方（静脉切开的常用部位），沿膝、大腿内侧上行，于腹股沟韧带下方的隐静脉裂孔注入股静脉。是冠状动脉旁路移植术常用的移植血管。"
      },
      "tint": "#8fb6d9",
      "parts": [
        "FJ2103",
        "FJ2122"
      ]
    },
    {
      "key": "hien-be",
      "name": {
        "vi": "Tĩnh mạch hiển bé",
        "en": "Small saphenous vein",
        "zh": "小隐静脉"
      },
      "latin": "V. saphena parva",
      "note": {
        "vi": "Từ bờ ngoài cung mu chân, đi SAU mắt cá ngoài, lên giữa bắp chân rồi xuyên mạc đổ vào tĩnh mạch khoeo. Chạy cạnh thần kinh bì bắp chân — lột tĩnh mạch hiển bé có thể gây tê bờ ngoài bàn chân.",
        "en": "From the lateral end of the dorsal arch it passes BEHIND the lateral malleolus, up the middle of the calf, and pierces the fascia to join the popliteal vein. It runs beside the sural nerve — stripping it can numb the lateral edge of the foot.",
        "zh": "起自足背静脉弓外侧端，经外踝后方，沿小腿后正中上行，穿深筋膜注入腘静脉。与腓肠神经伴行——剥脱小隐静脉可致足外侧缘麻木。"
      },
      "tint": "#a9c7e3",
      "parts": [
        "FJ2121"
      ]
    },
    {
      "key": "tm-xuyen",
      "name": {
        "vi": "Tĩnh mạch xuyên",
        "en": "Perforating veins",
        "zh": "穿静脉"
      },
      "latin": "Vv. perforantes",
      "note": {
        "vi": "Xuyên qua mạc sâu nối hệ nông với hệ sâu; van chỉ mở chiều nông → sâu. Van tĩnh mạch xuyên vùng cẳng chân trong hỏng là nguyên nhân chính của loét tĩnh mạch quanh mắt cá trong.",
        "en": "Pierce the deep fascia to link the superficial and deep systems; their valves open only superficial → deep. Failed perforator valves in the medial lower leg are the main cause of venous ulcers above the medial malleolus.",
        "zh": "穿过深筋膜连接浅、深静脉，瓣膜只允许由浅入深开放。小腿内侧穿静脉瓣膜功能不全是内踝上方静脉性溃疡的主要原因。"
      },
      "tint": "#b6a6d6",
      "parts": [
        "FJ2100",
        "FJ2119"
      ]
    },
    {
      "key": "tm-sau-dui",
      "name": {
        "vi": "Tĩnh mạch sâu đùi và khoeo",
        "en": "Deep veins of the thigh and knee",
        "zh": "大腿与腘部深静脉"
      },
      "latin": "V. femoralis · V. poplitea",
      "note": {
        "vi": "Tĩnh mạch khoeo lên thành tĩnh mạch đùi, nằm TRONG động mạch đùi ở tam giác đùi — nên đặt catheter tĩnh mạch đùi chọc phía trong mạch đập. Huyết khối ở đoạn đùi–khoeo dễ bong gây thuyên tắc phổi hơn huyết khối bắp chân.",
        "en": "The popliteal vein continues as the femoral vein, which lies MEDIAL to the femoral artery in the femoral triangle — so a femoral venous line goes just medial to the pulse. Thrombus in the femoropopliteal segment embolises to the lungs far more often than calf thrombus.",
        "zh": "腘静脉上行延续为股静脉，在股三角内位于股动脉内侧——故股静脉穿刺在搏动点内侧进针。股-腘段血栓比小腿血栓更易脱落导致肺栓塞。"
      },
      "tint": "#3f6a8f",
      "parts": [
        "FJ2099",
        "FJ2102",
        "FJ2107",
        "FJ2108",
        "FJ2117",
        "FJ2124",
        "FJ2125",
        "FJ2188",
        "FJ2189"
      ]
    },
    {
      "key": "tm-sau-cang",
      "name": {
        "vi": "Tĩnh mạch sâu cẳng chân",
        "en": "Deep veins of the leg",
        "zh": "小腿深静脉"
      },
      "latin": "Vv. tibiales · Vv. fibulares",
      "note": {
        "vi": "Tĩnh mạch chày trước, chày sau và mác — mỗi động mạch có HAI tĩnh mạch đi kèm. Nằm giữa các cơ bắp chân nên được \"bơm cơ\" ép lên mỗi bước đi; bất động lâu (bay đường dài, sau mổ) làm máu ứ, tạo huyết khối tĩnh mạch sâu.",
        "en": "The anterior tibial, posterior tibial and fibular veins — each artery is accompanied by TWO veins. Lying between the calf muscles, they are squeezed upward by the \"muscle pump\" with every step; long immobility (long flights, after surgery) lets blood pool and deep vein thrombosis form.",
        "zh": "胫前静脉、胫后静脉和腓静脉——每条动脉有两条伴行静脉。位于小腿肌之间，每走一步都被“肌泵”向上挤压；长期制动（长途飞行、术后）导致血液淤滞，形成深静脉血栓。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2097",
        "FJ2118",
        "FJ2183",
        "FJ2184",
        "FJ2187",
        "FJ2190"
      ]
    },
    {
      "key": "tm-ban-chan",
      "name": {
        "vi": "Tĩnh mạch bàn chân",
        "en": "Veins of the foot",
        "zh": "足静脉"
      },
      "latin": "Arcus venosus dorsalis et plantaris pedis",
      "note": {
        "vi": "Cung tĩnh mạch mu chân (nông) là gốc của hai tĩnh mạch hiển; cung gan chân (sâu) đổ vào tĩnh mạch chày sau. Mỗi bước dồn trọng lượng lên gan chân ép cung này — \"bơm gan chân\" khởi đầu dòng máu về.",
        "en": "The dorsal venous arch (superficial) is the origin of both saphenous veins; the plantar arch (deep) drains into the posterior tibial veins. Each step loads the sole and squeezes this arch — the \"foot pump\" that starts venous return.",
        "zh": "足背静脉弓（浅）是两条隐静脉的起点；足底静脉弓（深）汇入胫后静脉。每走一步足底受压挤压此弓——即启动静脉回流的“足泵”。"
      },
      "tint": "#7aa3c8",
      "parts": [
        "FJ2113",
        "FJ2115",
        "FJ2120",
        "FJ2128",
        "FJ2185",
        "FJ2191"
      ]
    },
    {
      "key": "xuong-moc",
      "name": {
        "vi": "Xương chi dưới (mốc)",
        "en": "Lower limb bones (landmarks)",
        "zh": "下肢骨（标志）"
      },
      "latin": "Ossa membri inferioris",
      "note": {
        "vi": "Chỉ để định vị, nhất là hai mắt cá — mốc phân biệt hiển lớn (trước mắt cá trong) và hiển bé (sau mắt cá ngoài).",
        "en": "Landmarks only, especially the two malleoli — the key to telling the great saphenous (in front of the medial malleolus) from the small saphenous (behind the lateral malleolus).",
        "zh": "仅作定位，尤其是内外踝——区分大隐静脉（内踝前）与小隐静脉（外踝后）的关键标志。"
      },
      "parts": [
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
        "FJ3259",
        "FJ3260",
        "FJ3264",
        "FJ3267",
        "FJ3271",
        "FJ3275",
        "FJ3280",
        "FJ3282",
        "FJ3293",
        "FJ3294",
        "FJ3295",
        "FJ3298",
        "FJ3307",
        "FJ3311",
        "FJ3312",
        "FJ3315",
        "FJ3328",
        "FJ3329"
      ]
    }
  ]
});
