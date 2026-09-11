/**
 * Scene "Khớp cổ chân" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chằng delta, dây chằng bên ngoài và mạc giữ gân — bài dạy xương + cơ vận động.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const ankleJointScene: AtlasSceneDef = {
  "slug": "khop-co-chan",
  "title": {
    "vi": "Khớp cổ chân: xương và cơ vận động",
    "en": "The Ankle: Bones and Movers",
    "zh": "踝关节：骨与运动肌"
  },
  "latin": "Articulatio talocruralis",
  "intro": {
    "vi": "Khớp cổ chân (khớp sên–cẳng chân) là một mộng. Hai mắt cá chày và mác kẹp ròng rọc xương sên, cho gấp mu và gấp gan. Lật trong và lật ngoài diễn ra ở khớp dưới sên, giữa xương sên và xương gót. Mọi gân vận động cổ chân chạy qua đây từ cẳng chân. Scene chia chúng theo tác dụng: gấp mu (khoang trước), gấp gan (tam đầu cẳng chân), lật trong (chày sau) và lật ngoài (cơ mác). Bộ dữ liệu không có dây chằng; bong gân lật trong chỉ được mô tả trong ghi chú.",
    "en": "The ankle (talocrural) joint is a mortise: the tibial and fibular malleoli grip the trochlea of the talus, allowing dorsiflexion and plantarflexion. Inversion and eversion take place at the subtalar joint, between talus and calcaneus. Every tendon that moves the ankle crosses here from the leg. The scene groups them by action: dorsiflexion (anterior compartment), plantarflexion (triceps surae), inversion (tibialis posterior) and eversion (fibulares). The dataset has no ligaments; the classic inversion sprain appears only in the notes.",
    "zh": "踝关节（距小腿关节）呈榫卯结构：胫、腓两踝夹住距骨滑车，产生背屈和跖屈；内翻、外翻发生在距骨与跟骨间的距下关节。所有运动踝的肌腱均自小腿经此。本场景按作用分组：背屈（前群）、跖屈（小腿三头肌）、内翻（胫骨后肌）、外翻（腓骨肌）。数据集中无韧带；典型的内翻扭伤仅在注释中描述。"
  },
  "frameGroups": [
    "xuong",
    "gap-mu",
    "gap-gan",
    "lat-trong",
    "lat-ngoai"
  ],
  "groups": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chày, mác, sên, gót, thuyền",
        "en": "Tibia, fibula, talus, calcaneus, navicular",
        "zh": "胫骨、腓骨、距骨、跟骨、足舟骨"
      },
      "latin": "Tibia · Fibula · Talus · Calcaneus · Os naviculare",
      "note": {
        "vi": "Ròng rọc xương sên phía trước rộng hơn phía sau, nên khi gấp mu khớp khít và vững nhất. Khi gấp gan (đi giày cao gót, bước hụt) khớp lỏng, dễ lật. Dây chằng sên–mác trước ở mặt ngoài là dây rách đầu tiên trong bong gân lật trong.",
        "en": "The talar trochlea is wider in front than behind, so the joint is tightest and most stable in dorsiflexion. In plantarflexion (high heels, a missed step) it is loose and rolls easily. The anterior talofibular ligament on the outer side is the first to tear in an inversion sprain.",
        "zh": "距骨滑车前宽后窄，背屈时关节最紧密稳定；跖屈时（穿高跟鞋、踩空）松弛易翻转。外侧的距腓前韧带是内翻扭伤中最先撕裂的韧带。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3256",
        "FJ3260",
        "FJ3280",
        "FJ3282"
      ]
    },
    {
      "key": "gap-mu",
      "name": {
        "vi": "Gấp mu: khoang trước cẳng chân",
        "en": "Dorsiflexors: anterior compartment",
        "zh": "背屈肌：小腿前群"
      },
      "latin": "Mm. tibialis anterior, extensor hallucis longus, extensor digitorum longus, fibularis tertius",
      "note": {
        "vi": "Chày trước là cơ gấp mu mạnh nhất và cũng lật trong. Duỗi dài ngón cái, duỗi dài các ngón và mác ba đi cùng. Liệt dây mác sâu làm bàn chân rũ, người bệnh phải nhấc cao gối khi bước.",
        "en": "Tibialis anterior is the strongest dorsiflexor and also inverts. Extensor hallucis longus, extensor digitorum longus and fibularis tertius join it. Deep fibular nerve palsy gives foot drop, and the patient lifts the knee high to walk.",
        "zh": "胫骨前肌是最强的背屈肌并使足内翻；拇长伸肌、趾长伸肌和第三腓骨肌协同。腓深神经麻痹致足下垂，患者行走需高抬膝（跨阈步态）。"
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
      "key": "gap-gan",
      "name": {
        "vi": "Gấp gan: cơ tam đầu cẳng chân và gân gót",
        "en": "Plantarflexors: triceps surae and calcaneal tendon",
        "zh": "跖屈肌：小腿三头肌与跟腱"
      },
      "latin": "M. triceps surae · Tendo calcaneus",
      "note": {
        "vi": "Hai đầu cơ bụng chân và cơ dép hội thành gân gót, bám mặt sau xương gót. Đây là gân to và khoẻ nhất cơ thể, là lực đẩy chính khi đi, chạy, nhảy.",
        "en": "The two heads of gastrocnemius and soleus merge into the calcaneal tendon on the back of the calcaneus — the thickest and strongest tendon in the body, the main push-off in walking, running and jumping.",
        "zh": "腓肠肌两头与比目鱼肌合成跟腱，止于跟骨后面——全身最粗最强的肌腱，是行走、奔跑和跳跃的主要蹬地力量。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1394M",
        "FJ1397M",
        "FJ1429M",
        "FJ1437M",
        "FJ1405M"
      ]
    },
    {
      "key": "lat-trong",
      "name": {
        "vi": "Lật trong và gấp gan phụ: khoang sau sâu",
        "en": "Invertors: deep posterior compartment",
        "zh": "内翻肌：小腿后群深层"
      },
      "latin": "Mm. tibialis posterior, flexor digitorum longus, flexor hallucis longus",
      "note": {
        "vi": "Ba gân vòng sau mắt cá trong. Chày sau là cơ lật trong chính và đỡ vòm dọc trong; suy gân chày sau là nguyên nhân hay gặp của bàn chân bẹt mắc phải ở người lớn.",
        "en": "Three tendons pass behind the medial malleolus. Tibialis posterior is the main invertor and supports the medial longitudinal arch; its tendon failure is a common cause of acquired flat foot in adults.",
        "zh": "三条肌腱绕内踝后方。胫骨后肌是主要内翻肌，并支撑足内侧纵弓；其肌腱功能不全是成人获得性扁平足的常见原因。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1414M",
        "FJ1415M",
        "FJ1440M"
      ]
    },
    {
      "key": "lat-ngoai",
      "name": {
        "vi": "Lật ngoài: cơ mác dài và mác ngắn",
        "en": "Evertors: fibularis longus and brevis",
        "zh": "外翻肌：腓骨长肌与腓骨短肌"
      },
      "latin": "Mm. fibularis longus et brevis",
      "note": {
        "vi": "Hai gân vòng sau mắt cá ngoài. Mác ngắn bám nền xương đốt bàn V; mác dài luồn dưới gan chân tới xương đốt bàn I. Chúng chống lại lật trong; khi bong gân mạnh, mác ngắn có thể giật bong mảnh nền xương đốt bàn V.",
        "en": "Two tendons pass behind the lateral malleolus. Fibularis brevis inserts on the base of the fifth metatarsal; fibularis longus crosses under the sole to the first metatarsal. They resist inversion; in a severe sprain brevis can avulse the base of the fifth metatarsal.",
        "zh": "两条肌腱绕外踝后方。腓骨短肌止于第5跖骨底；腓骨长肌经足底至第1跖骨。二者对抗内翻；严重扭伤时腓骨短肌可撕脱第5跖骨底。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1409M",
        "FJ1410M"
      ]
    }
  ]
};
