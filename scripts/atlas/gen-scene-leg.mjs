/**
 * Sinh scene "Cẳng chân và bàn chân" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-leg.mjs
 *
 * Bên TRÁI, lọc theo vị trí (leftSide + y < 0,55). Atlas xếp nhiều cơ cẳng chân
 * (fibularis, tibialis) vào hệ `skeletal` và gân gót vào `connective` — lọc cả ba.
 * Đủ 4 khoang cơ cẳng chân, cơ gan chân, ĐM/TM chày. THIẾU thần kinh chày/mác,
 * dây chằng cổ chân, cân gan chân, mạc giữ gân.
 */
import { byRe, emit, leftSide, betweenY, DEOXY, OXY } from "./lib.mjs";

const L = (re, sys = ["muscular", "skeletal", "connective"]) => betweenY(leftSide(byRe(re, sys)), 0, 0.55);

emit({
  file: "leg",
  exportName: "legScene",
  header: 'Scene "Cẳng chân và bàn chân" (bên trái) dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu thần kinh, dây chằng cổ chân, cân gan chân.',
  scene: {
    slug: "cang-chan-ban-chan",
    title: { vi: "Cẳng chân và bàn chân", en: "Leg and Foot", zh: "小腿与足" },
    latin: "Crus · Pes",
    intro: {
      vi: "Cẳng chân chia BỐN khoang, mỗi khoang một dây thần kinh và một động tác: TRƯỚC (xanh — gấp mu bàn chân, thần kinh mác sâu), NGOÀI (cam — nghiêng ngoài bàn chân, thần kinh mác nông), SAU NÔNG (đỏ — gấp gan bàn chân, bắp chân), SAU SÂU (tím — gấp ngón, nghiêng trong; thần kinh chày). Mạc sâu bó chặt các khoang nên chấn thương có thể gây hội chứng chèn ép khoang. Bộ dữ liệu không có thần kinh, dây chằng cổ chân và cân gan chân; xương mờ sẵn.",
      en: "The leg is divided into FOUR compartments, each with its own nerve and action: ANTERIOR (blue — dorsiflexion, deep fibular nerve), LATERAL (orange — eversion, superficial fibular nerve), SUPERFICIAL POSTERIOR (red — plantarflexion, the calf) and DEEP POSTERIOR (violet — toe flexion, inversion; tibial nerve). The deep fascia binds the compartments tightly, so trauma can cause compartment syndrome. The dataset has no nerves, ankle ligaments or plantar aponeurosis; bones are faded.",
      zh: "小腿分四个骨筋膜室，各有一条神经和一种动作：前群（蓝——足背屈，腓深神经）、外侧群（橙——足外翻，腓浅神经）、后浅群（红——足跖屈，小腿三头肌）、后深群（紫——屈趾、足内翻；胫神经）。深筋膜紧束各室，外伤可致骨筋膜室综合征。数据集中无神经、踝韧带和足底腱膜；骨骼淡化。",
    },
  },
  faded: ["xuong"],
  frame: ["khoang-truoc", "khoang-ngoai", "sau-nong", "sau-sau", "gan-chan", "mu-chan"],
  groups: [
    {
      key: "khoang-truoc",
      // Xanh ngọc, không trùng xanh tĩnh mạch.
      tint: "#5fa89e",
      latin: "Compartimentum cruris anterius",
      name: { vi: "Khoang trước", en: "Anterior compartment", zh: "前骨筋膜室" },
      note: {
        vi: "Chày trước, duỗi các ngón dài, duỗi ngón cái dài, mác ba — gấp mu bàn chân và duỗi ngón. Liệt (tổn thương thần kinh mác chung ở cổ xương mác) gây bàn chân rũ, đi phải nhấc cao gối (dáng đi bước cao).",
        en: "Tibialis anterior, extensor digitorum longus, extensor hallucis longus, fibularis tertius — dorsiflexing the foot and extending the toes. Paralysis (common fibular nerve injury at the fibular neck) causes foot drop and a high-stepping gait.",
        zh: "胫骨前肌、趾长伸肌、拇长伸肌、第三腓骨肌——足背屈并伸趾。其麻痹（腓骨颈处腓总神经损伤）致足下垂，呈跨阈步态。",
      },
      ids: L(/tibialis anterior$|extensor digitorum longus$|extensor hallucis longus$|fibularis tertius$/i),
    },
    {
      key: "khoang-ngoai",
      tint: "#e8883d",
      latin: "Compartimentum cruris laterale",
      name: { vi: "Khoang ngoài", en: "Lateral compartment", zh: "外侧骨筋膜室" },
      note: {
        vi: "Mác dài và mác ngắn — nghiêng ngoài bàn chân, gân vòng sau mắt cá ngoài. Gân mác dài bắt chéo gan chân tới xương chêm trong, đỡ vòm ngang. Lật cổ chân kéo gân mác ngắn làm gãy nền xương đốt bàn V.",
        en: "Fibularis longus and brevis — everting the foot, their tendons curving behind the lateral malleolus. The fibularis longus tendon crosses the sole to the medial cuneiform, supporting the transverse arch. An inversion sprain pulling on fibularis brevis fractures the base of the fifth metatarsal.",
        zh: "腓骨长肌与腓骨短肌——使足外翻，肌腱绕外踝后方。腓骨长肌腱横过足底至内侧楔骨，支撑横弓。足内翻扭伤牵拉腓骨短肌可致第五跖骨基底骨折。",
      },
      ids: L(/fibularis (longus|brevis)$/i),
    },
    {
      key: "sau-nong",
      // Cam hồng, không trùng đỏ động mạch.
      tint: "#e39a7a",
      latin: "M. triceps surae · M. plantaris",
      name: { vi: "Khoang sau nông (cơ tam đầu cẳng chân)", en: "Superficial posterior (triceps surae)", zh: "后浅群（小腿三头肌）" },
      note: {
        vi: "Hai đầu cơ bụng chân (vượt khớp gối) và cơ dép (không vượt gối) cùng bám gân gót — gân khoẻ nhất cơ thể. Cơ gan chân dài mảnh, hay dùng làm gân ghép. Đứt gân gót: nghiệm pháp Thompson — bóp bắp chân mà bàn chân không gập.",
        en: "The two heads of gastrocnemius (crossing the knee) and soleus (not crossing it) share the calcaneal tendon — the strongest tendon in the body. Plantaris is long and thin, a common graft. Achilles rupture: Thompson's test — squeezing the calf fails to plantarflex the foot.",
        zh: "腓肠肌两头（跨膝关节）和比目鱼肌（不跨膝）共同止于跟腱——人体最强韧的肌腱。跖肌细长，常用作移植肌腱。跟腱断裂：Thompson试验——挤压小腿时足不能跖屈。",
      },
      ids: L(/head of (left |right )?gastrocnemius$|soleus$|plantaris$|calcaneal tendon$/i),
    },
    {
      key: "sau-sau",
      tint: "#9b6fae",
      latin: "Compartimentum cruris posterius profundum",
      name: { vi: "Khoang sau sâu", en: "Deep posterior compartment", zh: "后深群" },
      note: {
        vi: "Cơ khoeo (mở khoá gối), chày sau, gấp các ngón dài, gấp ngón cái dài — gân vòng sau mắt cá trong theo thứ tự \"Tom, Dick And Very Nervous Harry\" (chày sau, gấp ngón dài, động mạch, tĩnh mạch, thần kinh, gấp ngón cái dài). Rối loạn gân chày sau là nguyên nhân hay gặp của bàn chân bẹt mắc phải.",
        en: "Popliteus (unlocking the knee), tibialis posterior, flexor digitorum longus, flexor hallucis longus — their tendons pass behind the medial malleolus in the order \"Tom, Dick And Very Nervous Harry\" (tibialis posterior, FDL, artery, vein, nerve, FHL). Tibialis posterior dysfunction is a common cause of acquired flat foot.",
        zh: "腘肌（解锁膝关节）、胫骨后肌、趾长屈肌、拇长屈肌——肌腱在内踝后方的排列顺序为“Tom, Dick And Very Nervous Harry”（胫骨后肌、趾长屈肌、动脉、静脉、神经、拇长屈肌）。胫骨后肌功能障碍是获得性扁平足的常见原因。",
      },
      ids: L(/popliteus$|tibialis posterior$|flexor digitorum longus$|flexor hallucis longus$/i),
    },
    {
      key: "gan-chan",
      tint: "#7fa878",
      latin: "Musculi plantae",
      name: { vi: "Cơ gan chân", en: "Muscles of the sole", zh: "足底肌" },
      note: {
        vi: "Bốn lớp: dạng ngón cái, gấp các ngón ngắn, dạng ngón út; vuông gan chân, cơ giun; gấp ngón cái ngắn, khép ngón cái, gấp ngón út ngắn; cơ gian cốt. Chúng giữ vòm dọc khi bước — mỏi lâu gây đau gan chân.",
        en: "Four layers: abductor hallucis, flexor digitorum brevis, abductor digiti minimi; quadratus plantae, lumbricals; flexor hallucis brevis, adductor hallucis, flexor digiti minimi brevis; interossei. They hold up the longitudinal arch in walking — prolonged fatigue causes sole pain.",
        zh: "分四层：拇展肌、趾短屈肌、小趾展肌；足底方肌、蚓状肌；拇短屈肌、拇收肌、小趾短屈肌；骨间肌。行走时维持纵弓——长期疲劳可致足底痛。",
      },
      ids: L(/abductor hallucis$|flexor digitorum brevis$|digiti minimi of foot$|flexor accessorius$|lumbrical of foot$|plantar interosseous of foot$|head of (left |right )?adductor hallucis$|head of (left |right )?flexor hallucis brevis$/i),
    },
    {
      key: "mu-chan",
      tint: "#6fa3c8",
      latin: "M. extensor hallucis brevis",
      name: { vi: "Cơ mu chân", en: "Dorsum of the foot", zh: "足背肌" },
      note: {
        vi: "Cơ duỗi ngón cái ngắn — một trong số ít cơ nội tại ở mu chân, do thần kinh mác sâu chi phối. (Atlas không có cơ duỗi các ngón ngắn.)",
        en: "Extensor hallucis brevis — one of the few intrinsic muscles on the dorsum, supplied by the deep fibular nerve. (The atlas has no extensor digitorum brevis.)",
        zh: "拇短伸肌——足背少数内在肌之一，受腓深神经支配。（图谱中无趾短伸肌。）",
      },
      ids: L(/extensor hallucis brevis$/i),
    },
    {
      key: "dm",
      tint: OXY,
      latin: "Aa. tibiales",
      name: { vi: "Động mạch chày trước, chày sau", en: "Tibial arteries", zh: "胫前、胫后动脉" },
      note: {
        vi: "Chày trước thành động mạch mu chân (bắt mạch giữa gân duỗi ngón cái dài và duỗi ngón dài); chày sau vòng sau mắt cá trong vào gan chân. (Atlas không có động mạch mác.)",
        en: "The anterior tibial becomes the dorsalis pedis (pulse between the EHL and EDL tendons); the posterior tibial curves behind the medial malleolus into the sole. (The atlas has no fibular artery.)",
        zh: "胫前动脉延续为足背动脉（在拇长伸肌腱与趾长伸肌腱之间可触及）；胫后动脉绕内踝后方进入足底。（图谱中无腓动脉。）",
      },
      ids: L(/tibial artery$|dorsalis pedis artery$|plantar artery$|plantar arch$|arcuate artery$/i, ["arterial"]),
    },
    {
      key: "tm",
      tint: DEOXY,
      latin: "Vv. saphenae · Vv. tibiales",
      name: { vi: "Tĩnh mạch hiển và tĩnh mạch sâu", en: "Saphenous and deep veins", zh: "隐静脉与深静脉" },
      note: {
        vi: "Hiển lớn trước mắt cá trong, hiển bé sau mắt cá ngoài; tĩnh mạch sâu đi đôi kèm động mạch. Bơm cơ bắp chân đẩy máu về — bất động lâu gây huyết khối tĩnh mạch sâu.",
        en: "The great saphenous passes in front of the medial malleolus, the small saphenous behind the lateral one; the deep veins accompany the arteries in pairs. The calf muscle pump drives return — prolonged immobility causes deep vein thrombosis.",
        zh: "大隐静脉经内踝前方，小隐静脉经外踝后方；深静脉成对伴行动脉。小腿肌泵推动回流——长期制动导致深静脉血栓。",
      },
      ids: L(/saphenous vein$|tibial vein$|fibular vein$/i, ["venous"]),
    },
    {
      key: "xuong",
      latin: "Tibia · Fibula · Ossa pedis",
      name: { vi: "Xương cẳng chân và bàn chân (mốc)", en: "Leg and foot bones (landmarks)", zh: "小腿骨与足骨（标志）" },
      note: {
        vi: "Mờ sẵn; màng gian cốt ngăn khoang trước và khoang sau.",
        en: "Faded; the interosseous membrane separates the anterior and posterior compartments.",
        zh: "已淡化；骨间膜分隔前、后骨筋膜室。",
      },
      ids: L(/tibia$|fibula$|talus$|calcaneus$|navicular bone of left foot|cuboid bone$|cuneiform bone$|metatarsal bone$|phalanx of left (big toe|second toe|third toe|fourth toe|little toe)$|interosseous membrane of (left |right )?leg/i, ["skeletal", "connective"]),
    },
  ],
});
