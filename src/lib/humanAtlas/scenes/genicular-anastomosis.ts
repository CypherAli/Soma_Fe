/**
 * Scene "Vòng nối động mạch quanh gối" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Vùng bẹn" cũ: atlas không có ống bẹn, dây chằng bẹn, thừng tinh.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const genicularAnastomosisScene: AtlasSceneDef = {
  "slug": "vung-ben",
  "title": {
    "vi": "Động mạch khoeo và vòng nối quanh gối",
    "en": "Popliteal Artery and the Genicular Anastomosis",
    "zh": "腘动脉与膝关节动脉网"
  },
  "latin": "A. poplitea · Rete articulare genus",
  "system": "cardiovascular",
  "intro": {
    "vi": "Động mạch đùi chui qua lỗ gân cơ khép ra sau gối thành động mạch khoeo. Đây là mạch nằm sâu nhất trong hố khoeo, sát xương đùi. Nó cho năm động mạch gối ôm quanh khớp, nối với động mạch gối xuống (từ động mạch đùi), nhánh xuống của động mạch mũ đùi ngoài và nhánh quặt ngược chày trước. Vòng nối này không đủ nuôi cẳng chân khi động mạch khoeo tắc đột ngột. Vì thế trật khớp gối có tổn thương động mạch là cấp cứu mạch máu. Mỗi nguồn một sắc đỏ, tĩnh mạch xanh, xương mờ sẵn.",
    "en": "The femoral artery passes through the adductor hiatus to the back of the knee as the popliteal artery. It is the deepest structure in the popliteal fossa, lying on the femur. It gives five genicular arteries that encircle the joint and join the descending genicular (from the femoral), the descending branch of the lateral circumflex femoral and the anterior tibial recurrent. This loop cannot sustain the leg if the popliteal artery is blocked suddenly. So a knee dislocation with arterial injury is a vascular emergency. Each source has its own shade of red, veins are blue and bones faded.",
    "zh": "股动脉穿收肌腱裂孔至膝后成为腘动脉，是腘窝内最深的结构，紧贴股骨。它发出五条膝动脉环绕关节，并与膝降动脉（来自股动脉）、旋股外侧动脉降支及胫前返动脉吻合。腘动脉突然阻塞时此吻合网不足以供应小腿，故膝关节脱位合并动脉损伤属血管急症。每个来源一种红色调，静脉蓝色，骨骼淡化。"
  },
  "frameGroups": [
    "khoeo",
    "goi",
    "tren",
    "duoi"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "khoeo",
      "name": {
        "vi": "Động mạch đùi và động mạch khoeo",
        "en": "Femoral and popliteal arteries",
        "zh": "股动脉与腘动脉"
      },
      "latin": "A. femoralis → A. poplitea",
      "note": {
        "vi": "Động mạch khoeo kết thúc ở bờ dưới cơ khoeo, chia thành động mạch chày trước và chày sau. Phình động mạch khoeo là phình mạch ngoại vi hay gặp nhất.",
        "en": "The popliteal artery ends at the lower border of popliteus by dividing into anterior and posterior tibial arteries. Popliteal aneurysm is the most common peripheral aneurysm.",
        "zh": "腘动脉在腘肌下缘分为胫前、胫后动脉。腘动脉瘤是最常见的周围动脉瘤。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2074",
        "FJ2086"
      ]
    },
    {
      "key": "goi",
      "name": {
        "vi": "Năm động mạch gối",
        "en": "The five genicular arteries",
        "zh": "五条膝动脉"
      },
      "latin": "Aa. genus superiores, media, inferiores",
      "note": {
        "vi": "Gối trên trong và trên ngoài vòng trên lồi cầu; gối dưới trong và dưới ngoài vòng dưới mâm chày; gối giữa xuyên bao khớp nuôi dây chằng chéo. Chúng dễ bị tổn thương khi phẫu thuật nội soi và thay khớp gối.",
        "en": "The medial and lateral superior genicular arteries circle above the condyles; the medial and lateral inferior circle below the tibial plateau; the middle genicular pierces the capsule to supply the cruciates. They are at risk in arthroscopy and knee replacement.",
        "zh": "膝上内、外侧动脉绕行髁上方；膝下内、外侧动脉绕行胫骨平台下方；膝中动脉穿关节囊供应交叉韧带。关节镜和膝关节置换术中易受损。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2076",
        "FJ2077",
        "FJ2080",
        "FJ2083",
        "FJ2084"
      ]
    },
    {
      "key": "tren",
      "name": {
        "vi": "Nguồn từ trên: gối xuống, nhánh xuống mũ đùi ngoài",
        "en": "From above: descending genicular, descending lateral circumflex",
        "zh": "上方来源：膝降动脉、旋股外侧动脉降支"
      },
      "latin": "A. descendens genus · R. descendens a. circumflexae femoris lateralis",
      "note": {
        "vi": "Động mạch gối xuống tách từ động mạch đùi trong ống cơ khép. Nhánh xuống của mũ đùi ngoài chạy trong cơ rộng ngoài xuống gối. Hai nguồn này nối vòng quanh gối với các động mạch gối.",
        "en": "The descending genicular leaves the femoral in the adductor canal. The descending branch of the lateral circumflex femoral runs down in vastus lateralis to the knee. Both join the genicular loop.",
        "zh": "膝降动脉在收肌管内发自股动脉；旋股外侧动脉降支沿股外侧肌下行至膝。二者参与膝周吻合。"
      },
      "tint": "#b03a48",
      "parts": [
        "FJ2063",
        "FJ2069"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Nguồn từ dưới: quặt ngược chày trước",
        "en": "From below: anterior tibial recurrent",
        "zh": "下方来源：胫前返动脉"
      },
      "latin": "A. recurrens tibialis anterior · A. tibialis anterior",
      "note": {
        "vi": "Tách từ động mạch chày trước ngay khi nó xuyên màng gian cốt. Nó đi ngược lên nối với hai động mạch gối dưới.",
        "en": "Arises from the anterior tibial artery just after it pierces the interosseous membrane, and climbs to join the inferior genicular arteries.",
        "zh": "胫前动脉穿骨间膜后即发出，逆行向上与膝下动脉吻合。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ2066"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch khoeo và tĩnh mạch gối",
        "en": "Popliteal and genicular veins",
        "zh": "腘静脉与膝静脉"
      },
      "latin": "V. poplitea · Vv. genus",
      "note": {
        "vi": "Tĩnh mạch khoeo nằm nông hơn động mạch. Huyết khối tĩnh mạch sâu ở đây có thể bong ra gây thuyên tắc phổi.",
        "en": "The popliteal vein lies superficial to the artery. A deep vein thrombosis here can break off and cause pulmonary embolism.",
        "zh": "腘静脉位于动脉浅面。此处深静脉血栓脱落可致肺栓塞。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2107",
        "FJ2108",
        "FJ2117",
        "FJ2124",
        "FJ2125"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương vùng gối (mốc)",
        "en": "Bones of the knee (landmarks)",
        "zh": "膝部骨（标志）"
      },
      "latin": "Femur · Tibia · Patella · Fibula",
      "note": {
        "vi": "Mờ sẵn để vòng mạch quanh khớp nổi rõ.",
        "en": "Faded so the vascular ring stands out.",
        "zh": "淡化，使关节周围血管环清晰。"
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
