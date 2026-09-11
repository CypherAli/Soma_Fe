/**
 * Scene "Hố khoeo" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chày, dây mác chung và hạch khoeo.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const poplitealFossaScene: AtlasSceneDef = {
  "slug": "ho-khoeo",
  "title": {
    "vi": "Hố khoeo",
    "en": "The Popliteal Fossa",
    "zh": "腘窝"
  },
  "latin": "Fossa poplitea",
  "intro": {
    "vi": "Hố khoeo là hõm hình trám sau gối. Bờ trên trong là cơ bán gân và bán màng, bờ trên ngoài là nhị đầu đùi. Hai bờ dưới là hai đầu cơ bụng chân (và cơ gan chân ở ngoài). Nền hố là mặt sau xương đùi và cơ khoeo. Từ nông vào sâu có dây chày, tĩnh mạch khoeo, rồi động mạch khoeo nằm sâu nhất; bộ dữ liệu không có dây thần kinh. Bắt mạch khoeo phải gấp gối nhẹ cho cân chùng. Các cơ bờ mỗi bên một tông, mạch máu đỏ–xanh, xương mờ sẵn.",
    "en": "The popliteal fossa is the diamond-shaped hollow behind the knee. Its upper medial border is semitendinosus and semimembranosus, its upper lateral border biceps femoris. The two lower borders are the heads of gastrocnemius (with plantaris laterally). Its floor is the back of the femur and popliteus. From superficial to deep lie the tibial nerve, the popliteal vein and, deepest, the popliteal artery; the dataset has no nerves. To feel the popliteal pulse, flex the knee slightly so the fascia slackens. Border muscles have one colour family per side, vessels red and blue, bones faded.",
    "zh": "腘窝是膝后菱形凹陷：上内侧界为半腱肌和半膜肌，上外侧界为股二头肌，下两界为腓肠肌两头（外侧有跖肌）；窝底为股骨后面和腘肌。由浅入深为胫神经、腘静脉，最深为腘动脉；数据集中无神经。触摸腘动脉需轻度屈膝使筋膜松弛。两侧界肌各一色系，血管红蓝，骨骼淡化。"
  },
  "frameGroups": [
    "tren-trong",
    "tren-ngoai",
    "duoi",
    "nen",
    "dm",
    "tm"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "tren-trong",
      "name": {
        "vi": "Bờ trên trong: bán gân, bán màng",
        "en": "Upper medial border: semitendinosus, semimembranosus",
        "zh": "上内侧界：半腱肌、半膜肌"
      },
      "latin": "Mm. semitendinosus, semimembranosus",
      "note": {
        "vi": "Bán gân có gân dài mảnh nằm nông; bán màng dẹt nằm dưới. Kén khoeo (kén Baker) thường thoát ra giữa cơ bán màng và đầu trong cơ bụng chân.",
        "en": "Semitendinosus has a long slender superficial tendon; semimembranosus lies flat beneath it. A Baker's cyst usually bulges between semimembranosus and the medial head of gastrocnemius.",
        "zh": "半腱肌腱细长位于浅层；半膜肌扁平位于其深面。腘窝囊肿（Baker囊肿）常突出于半膜肌与腓肠肌内侧头之间。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1435M",
        "FJ1436M"
      ]
    },
    {
      "key": "tren-ngoai",
      "name": {
        "vi": "Bờ trên ngoài: nhị đầu đùi",
        "en": "Upper lateral border: biceps femoris",
        "zh": "上外侧界：股二头肌"
      },
      "latin": "M. biceps femoris",
      "note": {
        "vi": "Dây mác chung chạy sát bờ trong gân nhị đầu rồi vòng quanh cổ xương mác. Gãy cổ xương mác hoặc bó bột chật có thể làm liệt dây này, gây bàn chân rũ.",
        "en": "The common fibular nerve hugs the medial edge of the biceps tendon, then winds round the fibular neck. A fibular-neck fracture or a tight cast can paralyse it, causing foot drop.",
        "zh": "腓总神经紧贴股二头肌腱内缘，再绕腓骨颈。腓骨颈骨折或石膏过紧可致其麻痹，出现足下垂。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1395M",
        "FJ1444M"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Hai bờ dưới: cơ bụng chân và cơ gan chân",
        "en": "Lower borders: gastrocnemius and plantaris",
        "zh": "下两界：腓肠肌与跖肌"
      },
      "latin": "M. gastrocnemius · M. plantaris",
      "note": {
        "vi": "Hai đầu cơ bụng chân đóng hai cạnh dưới của hình trám. Cơ gan chân nhỏ, gân dài nhất cơ thể, hay được lấy làm mảnh ghép gân.",
        "en": "The two heads of gastrocnemius close the lower sides of the diamond. The small plantaris has the longest tendon in the body and is often harvested as a tendon graft.",
        "zh": "腓肠肌两头构成菱形下两边。跖肌细小，其肌腱为全身最长，常被取作肌腱移植材料。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1394M",
        "FJ1397M",
        "FJ1429M"
      ]
    },
    {
      "key": "nen",
      "name": {
        "vi": "Nền: cơ khoeo",
        "en": "Floor: popliteus",
        "zh": "窝底：腘肌"
      },
      "latin": "M. popliteus",
      "note": {
        "vi": "Phủ mặt sau xương chày, là phần dưới của nền hố. Phần trên của nền là mặt khoeo xương đùi.",
        "en": "Covers the back of the tibia and forms the lower floor; the upper floor is the popliteal surface of the femur.",
        "zh": "覆盖胫骨后面，构成窝底下部；上部为股骨腘面。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1430M"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch khoeo và nhánh gối",
        "en": "Popliteal artery and genicular branches",
        "zh": "腘动脉及膝支"
      },
      "latin": "A. poplitea",
      "note": {
        "vi": "Nằm sâu nhất, sát xương đùi, nên gãy trên lồi cầu xương đùi có thể làm đoạn gãy đâm vào nó.",
        "en": "The deepest structure, lying on the femur, so a supracondylar femoral fracture can drive a fragment into it.",
        "zh": "位置最深，紧贴股骨，故股骨髁上骨折时骨折端可刺伤它。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2069",
        "FJ2076",
        "FJ2077",
        "FJ2080",
        "FJ2083",
        "FJ2084",
        "FJ2086"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch khoeo và tĩnh mạch hiển bé",
        "en": "Popliteal and small saphenous veins",
        "zh": "腘静脉与小隐静脉"
      },
      "latin": "V. poplitea · V. saphena parva",
      "note": {
        "vi": "Tĩnh mạch hiển bé đi dọc bắp chân phía sau, xuyên cân khoeo đổ vào tĩnh mạch khoeo. Van ở chỗ đổ này hỏng gây giãn tĩnh mạch bắp chân.",
        "en": "The small saphenous vein runs up the back of the calf and pierces the popliteal fascia to join the popliteal vein. Failure of the valve at this junction causes calf varicose veins.",
        "zh": "小隐静脉沿小腿后面上行，穿腘筋膜注入腘静脉。此处瓣膜功能不全导致小腿静脉曲张。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2107",
        "FJ2108",
        "FJ2117",
        "FJ2121",
        "FJ2124",
        "FJ2125"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương đùi, chày, mác (mốc)",
        "en": "Femur, tibia, fibula (landmarks)",
        "zh": "股骨、胫骨、腓骨（标志）"
      },
      "latin": "Femur · Tibia · Fibula",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3259",
        "FJ3260",
        "FJ3275",
        "FJ3282"
      ]
    }
  ]
};
