/**
 * Sinh scene "Cây động mạch chi dưới" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-leg-arteries.mjs
 *
 * Chi dưới TRÁI. Khảo sát: THIẾU động mạch đùi sâu (thân) và động mạch mác —
 * chỉ có nhánh của đùi sâu (mũ đùi ngoài, các động mạch xuyên). ĐM đùi dài
 * 36cm chỉ 208 tam giác (ống thô) — giữ vì là trục chính, ghi hạn chế.
 */
import { byRe, emit, leftSide } from "./lib.mjs";

const A = (re) => leftSide(byRe(re, ["arterial"]));

emit({
  file: "leg-arteries",
  exportName: "legArteriesScene",
  header: 'Scene "Cây động mạch chi dưới" (bên trái) dựng từ bộ atlas BodyParts3D.\n\nAtlas thiếu thân ĐM đùi sâu và ĐM mác.',
  scene: {
    slug: "dong-mach-chi-duoi",
    title: { vi: "Cây động mạch chi dưới", en: "Arteries of the Lower Limb", zh: "下肢动脉" },
    latin: "Arteriae membri inferioris",
    intro: {
      vi: "Động mạch chậu ngoài qua dưới dây chằng bẹn thành động mạch đùi, xuống ống cơ khép, qua lỗ gân cơ khép ra sau thành động mạch khoeo, rồi chia chày trước (ra mu chân) và chày sau (vào gan chân). Bốn điểm bắt mạch chi dưới — đùi, khoeo, chày sau, mu chân — dọc theo trục này. Bộ dữ liệu thiếu thân động mạch đùi sâu và động mạch mác; xương để làm mốc.",
      en: "The external iliac passes under the inguinal ligament to become the femoral artery, descends in the adductor canal, passes through the adductor hiatus to become the popliteal artery behind the knee, then divides into the anterior tibial (to the dorsum of the foot) and posterior tibial (to the sole). The four lower-limb pulses — femoral, popliteal, posterior tibial, dorsalis pedis — lie along this axis. The dataset lacks the trunk of the deep femoral and the fibular artery; bones are shown as landmarks.",
      zh: "髂外动脉经腹股沟韧带深面延续为股动脉，下行于收肌管，穿收肌腱裂孔至膝后成为腘动脉，再分为胫前动脉（至足背）和胫后动脉（至足底）。下肢四个脉搏点——股、腘、胫后、足背——均沿此轴分布。数据集缺股深动脉主干和腓动脉；骨骼作为定位标志。",
    },
  },
  faded: ["xuong-moc"],
  frame: ["dm-chau", "dm-dui", "dm-khoeo", "dm-chay-truoc", "dm-chay-sau", "dm-ban-chan"],
  groups: [
    {
      key: "dm-chau",
      tint: "#8f2f3a",
      latin: "Aa. iliacae",
      name: { vi: "Động mạch chậu chung, trong, ngoài", en: "Common, internal and external iliac arteries", zh: "髂总、髂内、髂外动脉" },
      note: {
        vi: "Chậu chung chia ngang khớp cùng-chậu: chậu trong xuống nuôi tạng chậu hông và mông, chậu ngoài chạy dọc bờ chậu hông ra đùi. Hẹp tắc chậu–đùi gây đau cách hồi ở mông và đùi, kèm liệt dương (hội chứng Leriche).",
        en: "The common iliac divides at the sacroiliac joint: the internal iliac drops to the pelvic organs and buttock, the external iliac follows the pelvic brim to the thigh. Aorto-iliac occlusion causes buttock and thigh claudication with impotence (Leriche syndrome).",
        zh: "髂总动脉在骶髂关节处分叉：髂内动脉下行供应盆腔脏器与臀部，髂外动脉沿骨盆缘至大腿。主-髂动脉闭塞导致臀部和大腿间歇性跛行伴阳痿（Leriche综合征）。",
      },
      ids: A(/(common|internal|external) iliac artery$/i),
    },
    {
      key: "dm-dui",
      tint: "#b8434f",
      latin: "A. femoralis",
      name: { vi: "Động mạch đùi và nhánh", en: "Femoral artery and branches", zh: "股动脉及分支" },
      note: {
        vi: "Bắt mạch ở điểm giữa dây chằng bẹn, là đường vào của ống thông tim. Nhánh của đùi sâu (mũ đùi ngoài, các động mạch xuyên) nuôi cơ đùi; động mạch gối xuống tách ở ống cơ khép. (Thân động mạch đùi sâu không có trong dữ liệu; ống động mạch đùi khá thô.)",
        en: "Its pulse is felt at the mid-inguinal point, and it is the access route for cardiac catheters. Branches of the deep femoral (lateral circumflex femoral, perforating arteries) supply the thigh muscles; the descending genicular arises in the adductor canal. (The deep femoral trunk is missing from the data; the femoral tube is coarse.)",
        zh: "于腹股沟中点可触及搏动，是心导管的入路。股深动脉的分支（旋股外侧动脉、穿动脉）供应大腿肌；膝降动脉发自收肌管。（数据中无股深动脉主干；股动脉网格较粗糙。）",
      },
      ids: A(/femoral artery$|circumflex femoral artery|perforating arteries|descending genicular artery$|superficial epigastric artery$/i),
    },
    {
      key: "dm-khoeo",
      tint: "#c05245",
      latin: "A. poplitea",
      name: { vi: "Động mạch khoeo và mạng gối", en: "Popliteal artery and genicular network", zh: "腘动脉与膝关节网" },
      note: {
        vi: "Nằm sâu nhất trong hố khoeo, sát xương đùi — nên gãy đầu dưới xương đùi hoặc trật khớp gối dễ làm rách nó. Năm động mạch gối tạo mạng quanh khớp. Phình động mạch khoeo là phình ngoại vi hay gặp nhất.",
        en: "The deepest structure in the popliteal fossa, lying against the femur — so a distal femoral fracture or knee dislocation readily tears it. Five genicular arteries form a network around the joint. Popliteal aneurysm is the commonest peripheral aneurysm.",
        zh: "位于腘窝最深处，紧贴股骨——故股骨远端骨折或膝关节脱位易致其撕裂。五条膝动脉在关节周围形成动脉网。腘动脉瘤是最常见的周围动脉瘤。",
      },
      ids: A(/popliteal artery$|genicular artery$/i),
    },
    {
      key: "dm-chay-truoc",
      tint: "#e07a6a",
      latin: "A. tibialis anterior · A. dorsalis pedis",
      name: { vi: "Động mạch chày trước và mu chân", en: "Anterior tibial and dorsalis pedis", zh: "胫前动脉与足背动脉" },
      note: {
        vi: "Xuyên qua màng gian cốt ra khoang trước cẳng chân; qua cổ chân thành động mạch mu chân — bắt mạch ở giữa hai gân duỗi ngón cái dài và duỗi ngón dài. Tăng áp lực khoang trước chèn nó gây mất mạch mu chân (dấu hiệu muộn).",
        en: "Pierces the interosseous membrane into the anterior compartment of the leg; past the ankle it becomes the dorsalis pedis — felt between the extensor hallucis longus and extensor digitorum longus tendons. Anterior compartment syndrome compresses it, and loss of the pedal pulse is a late sign.",
        zh: "穿骨间膜进入小腿前骨筋膜室，过踝后移行为足背动脉——在拇长伸肌腱与趾长伸肌腱之间可触及。前骨筋膜室综合征可压迫此动脉，足背动脉搏动消失为晚期征象。",
      },
      ids: A(/anterior tibial artery$|anterior tibial recurrent artery$|dorsalis pedis artery$|arcuate artery$|lateral tarsal artery$|deep plantar artery$/i),
    },
    {
      key: "dm-chay-sau",
      tint: "#d0685a",
      latin: "A. tibialis posterior",
      name: { vi: "Động mạch chày sau", en: "Posterior tibial artery", zh: "胫后动脉" },
      note: {
        vi: "Đi xuống khoang sau sâu, vòng sau mắt cá trong vào gan chân — bắt mạch ở giữa mắt cá trong và gót. Chia động mạch gan chân trong và ngoài. (Động mạch mác — nhánh lớn của nó — không có trong dữ liệu.)",
        en: "Descends in the deep posterior compartment and curves behind the medial malleolus into the sole — felt between the medial malleolus and the heel. It divides into the medial and lateral plantar arteries. (Its large fibular branch is missing from the data.)",
        zh: "下行于小腿后深骨筋膜室，绕内踝后方进入足底——在内踝与足跟之间可触及。分为足底内侧动脉和足底外侧动脉。（其大分支腓动脉在数据中缺失。）",
      },
      ids: A(/posterior tibial artery$|calcaneal branches of posterior tibial/i),
    },
    {
      key: "dm-ban-chan",
      tint: "#e8a33d",
      latin: "Arcus plantaris · Aa. digitales",
      name: { vi: "Cung gan chân và động mạch ngón", en: "Plantar arch and digital arteries", zh: "足底弓与趾动脉" },
      note: {
        vi: "Động mạch gan chân ngoài uốn thành cung gan chân sâu, nối với nhánh gan chân sâu của động mạch mu chân — vòng nối giữa hai trục chày trước và chày sau. Từ cung tách động mạch đốt bàn và ngón.",
        en: "The lateral plantar artery curves into the deep plantar arch, joining the deep plantar branch of the dorsalis pedis — the link between the anterior and posterior tibial axes. Metatarsal and digital arteries arise from the arch.",
        zh: "足底外侧动脉弯成足底深弓，与足背动脉的足底深支吻合——连接胫前、胫后两条轴线。跖动脉和趾动脉发自此弓。",
      },
      ids: A(/plantar artery$|plantar arch$|plantar metatarsal artery|plantar digital arter|dorsal digital artery of foot/i),
    },
    {
      key: "xuong-moc",
      latin: "Ossa membri inferioris",
      name: { vi: "Xương chi dưới (mốc)", en: "Lower limb bones (landmarks)", zh: "下肢骨（标志）" },
      note: {
        vi: "Chỉ để định vị: xương chậu, đùi, bánh chè, chày, mác và bàn chân. Làm mờ nhóm này để nhìn đường đi của mạch.",
        en: "Landmarks only: hip bone, femur, patella, tibia, fibula and the foot. Fade this group to follow the vessels.",
        zh: "仅作定位：髋骨、股骨、髌骨、胫骨、腓骨及足骨。淡化此组以观察血管走行。",
      },
      ids: leftSide(byRe(/hip bone$|femur$|patella$|tibia$|fibula$|talus$|calcaneus$|navicular bone of left foot|cuboid bone$|cuneiform bone$|metatarsal bone$|phalanx of left (big toe|second toe|third toe|fourth toe|little toe)$/i, ["skeletal"])),
    },
  ],
});
