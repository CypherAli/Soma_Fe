/**
 * Scene "Gân gót và ống cổ chân" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chày và mạc giữ gân gấp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const tarsalTunnelScene: AtlasSceneDef = {
  "slug": "gan-got-ong-co-chan",
  "title": {
    "vi": "Gân gót và ống cổ chân",
    "en": "Calcaneal Tendon and Tarsal Tunnel",
    "zh": "跟腱与踝管"
  },
  "latin": "Tendo calcaneus · Canalis malleolaris",
  "intro": {
    "vi": "Sau mắt cá trong là ống cổ chân, được mạc giữ gân gấp phủ lên. Các thành phần xếp từ trước ra sau: gân chày sau, gân gấp dài các ngón, động mạch và tĩnh mạch chày sau, dây chày, gân gấp dài ngón cái. Sinh viên thường nhớ thứ tự này bằng câu “Tom, Dick And Very Nervous Harry”. Bộ dữ liệu không có dây chày. Phía sau cùng là gân gót. Mỗi gân một màu, mạch máu đỏ–xanh, xương mờ sẵn.",
    "en": "Behind the medial malleolus lies the tarsal tunnel, roofed by the flexor retinaculum. From front to back its contents are: tibialis posterior tendon, flexor digitorum longus tendon, posterior tibial artery and veins, tibial nerve, and flexor hallucis longus tendon. Students remember the order as “Tom, Dick And Very Nervous Harry”. The dataset has no tibial nerve. Furthest back lies the calcaneal tendon. Each tendon has its own colour, vessels are red and blue, and bones are faded.",
    "zh": "内踝后方为踝管，由屈肌支持带覆盖。管内由前向后依次为：胫骨后肌腱、趾长屈肌腱、胫后动静脉、胫神经、拇长屈肌腱；学生常用口诀“Tom, Dick And Very Nervous Harry”记忆。数据集中无胫神经。最后方为跟腱。每条肌腱一种颜色，血管红蓝，骨骼淡化。"
  },
  "frameGroups": [
    "chay-sau",
    "gap-ngon",
    "mach",
    "gap-cai",
    "gan-got"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "chay-sau",
      "name": {
        "vi": "Gân chày sau (T)",
        "en": "Tibialis posterior (T)",
        "zh": "胫骨后肌腱（T）"
      },
      "latin": "M. tibialis posterior",
      "note": {
        "vi": "Nằm trước nhất, sát mắt cá trong, bám củ xương thuyền và toả ra gần hết các xương cổ chân ở gan chân.",
        "en": "The most anterior, right against the malleolus; it inserts on the navicular tuberosity and fans out to most tarsal bones on the sole.",
        "zh": "最靠前，紧贴内踝，止于足舟骨粗隆并扩展至足底大部分跗骨。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1440M"
      ]
    },
    {
      "key": "gap-ngon",
      "name": {
        "vi": "Gân gấp dài các ngón (D)",
        "en": "Flexor digitorum longus (D)",
        "zh": "趾长屈肌腱（D）"
      },
      "latin": "M. flexor digitorum longus",
      "note": {
        "vi": "Ở gan chân chia bốn gân tới đốt xa ngón II–V; cơ vuông gan chân kéo thẳng hướng lực của nó.",
        "en": "In the sole it splits into four tendons to the distal phalanges of toes 2–5; quadratus plantae straightens its line of pull.",
        "zh": "在足底分为四腱至第2–5趾远节趾骨；足底方肌校正其牵拉方向。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1414M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch chày sau (A)",
        "en": "Posterior tibial artery (A)",
        "zh": "胫后动脉（A）"
      },
      "latin": "A. tibialis posterior → Aa. plantares medialis et lateralis",
      "note": {
        "vi": "Bắt mạch được giữa mắt cá trong và gân gót. Dưới mạc giữ gân gấp, nó chia thành động mạch gan chân trong và ngoài. Mất mạch ở đây là dấu hiệu bệnh động mạch chi dưới.",
        "en": "Its pulse is felt between the medial malleolus and the calcaneal tendon. Under the retinaculum it divides into medial and lateral plantar arteries. An absent pulse here is a sign of lower-limb arterial disease.",
        "zh": "可在内踝与跟腱之间触及搏动。在屈肌支持带下分为足底内、外侧动脉。此处搏动消失提示下肢动脉疾病。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2079",
        "FJ2082",
        "FJ2087"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch chày sau (V)",
        "en": "Posterior tibial veins (V)",
        "zh": "胫后静脉（V）"
      },
      "latin": "Vv. tibiales posteriores (V)",
      "note": {
        "vi": "Thường đi thành đôi hai bên động mạch.",
        "en": "Usually paired, one on each side of the artery.",
        "zh": "通常成对伴行于动脉两侧。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ2118"
      ]
    },
    {
      "key": "gap-cai",
      "name": {
        "vi": "Gân gấp dài ngón cái (H)",
        "en": "Flexor hallucis longus (H)",
        "zh": "拇长屈肌腱（H）"
      },
      "latin": "M. flexor hallucis longus",
      "note": {
        "vi": "Nằm sau cùng trong ống, chạy trong rãnh ở mặt sau xương sên và dưới mỏm chân đế sên của xương gót. Nó là lực đẩy cuối khi rời ngón cái khỏi mặt đất.",
        "en": "The most posterior content, running in a groove on the back of the talus and under the sustentaculum tali. It gives the final push as the big toe leaves the ground.",
        "zh": "管内最靠后，行于距骨后面的沟内及跟骨载距突下方，是拇趾离地时的最后推力。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1415M"
      ]
    },
    {
      "key": "gan-got",
      "name": {
        "vi": "Gân gót và cơ dép",
        "en": "Calcaneal tendon and soleus",
        "zh": "跟腱与比目鱼肌"
      },
      "latin": "Tendo calcaneus · M. soleus",
      "note": {
        "vi": "Gân gót đứt thường ở đoạn cách chỗ bám 2–6cm, vùng ít mạch nuôi. Nghiệm pháp Thompson: bóp bắp chân mà bàn chân không gấp gan là gân đã đứt.",
        "en": "The tendon usually ruptures 2–6cm above its insertion, where blood supply is poorest. Thompson test: squeezing the calf fails to plantarflex the foot if the tendon is torn.",
        "zh": "跟腱断裂常发生于止点上方2–6cm的乏血管区。Thompson试验：挤压小腿足不跖屈即提示跟腱断裂。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1405M",
        "FJ1437M"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chày, mác, sên, gót (mốc)",
        "en": "Tibia, fibula, talus, calcaneus (landmarks)",
        "zh": "胫骨、腓骨、距骨、跟骨（标志）"
      },
      "latin": "Tibia · Fibula · Talus · Calcaneus",
      "note": {
        "vi": "Mờ sẵn. Mắt cá trong là mốc trước của ống.",
        "en": "Faded. The medial malleolus is the front landmark of the tunnel.",
        "zh": "淡化。内踝为踝管前方标志。"
      },
      "parts": [
        "FJ3256",
        "FJ3260",
        "FJ3280",
        "FJ3282"
      ]
    }
  ]
};
