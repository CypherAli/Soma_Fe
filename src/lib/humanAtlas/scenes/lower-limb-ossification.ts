/**
 * Scene "Xương chi dưới và mốc cốt hoá" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có sụn tiếp hợp/điểm cốt hoá riêng — mốc thời gian ghi trong ghi chú từng xương.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-f.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const lowerLimbOssificationScene: AtlasSceneDef = {
  "slug": "moc-xuong-chi-duoi",
  "title": {
    "vi": "Xương chi dưới và mốc cốt hoá",
    "en": "Bones of the Lower Limb and their Ossification",
    "zh": "下肢骨及其骨化"
  },
  "latin": "Ossa membri inferioris",
  "intro": {
    "vi": "Chi dưới có 31 xương mỗi bên: xương chậu, đùi, bánh chè, chày, mác, 7 xương cổ chân, 5 xương đốt bàn và 14 đốt ngón. Xương chậu hình thành từ ba xương (cánh chậu, ngồi, mu) dính nhau ở ổ cối. Điểm cốt hoá đầu dưới xương đùi có từ lúc sinh, nên pháp y dùng nó xác định thai đủ tháng. Chi dưới mọc dài chủ yếu quanh gối, ở đầu dưới xương đùi và đầu trên xương chày. Mỗi đoạn một màu; mốc cốt hoá ghi trong ghi chú. Bộ dữ liệu là xương người trưởng thành, không có sụn tiếp hợp.",
    "en": "Each lower limb has 31 bones: hip bone, femur, patella, tibia, fibula, 7 tarsals, 5 metatarsals and 14 phalanges. The hip bone forms from three bones (ilium, ischium, pubis) fusing at the acetabulum. The centre for the lower femur is present at birth, so forensic experts use it to confirm a full-term fetus. The lower limb grows mainly around the knee, at the lower femur and upper tibia. Each segment has its own colour; ossification timings are in the notes. The dataset is an adult skeleton with no growth plates.",
    "zh": "每侧下肢有31块骨：髋骨、股骨、髌骨、胫骨、腓骨、7块跗骨、5块跖骨和14块趾骨。髋骨由髂骨、坐骨、耻骨在髋臼处融合而成。股骨下端骨化中心出生时即已存在，法医据此判定足月胎儿。下肢主要在膝周（股骨下端和胫骨上端）生长。每段一种颜色，骨化时间见注释。数据集为成人骨骼，无骺板。"
  },
  "frameGroups": [
    "chau",
    "dui",
    "cang-chan",
    "co-chan",
    "ban-ngon"
  ],
  "groups": [
    {
      "key": "chau",
      "name": {
        "vi": "Xương chậu",
        "en": "Hip bone",
        "zh": "髋骨"
      },
      "latin": "Os coxae",
      "note": {
        "vi": "Sụn chữ Y ở ổ cối nối cánh chậu, xương ngồi, xương mu, dính khoảng 15–17 tuổi. Mào chậu cốt hoá từ ngoài vào trong. Mức độ cốt hoá mào chậu (dấu Risser) cho biết cột sống còn phát triển hay không, dùng khi theo dõi vẹo cột sống.",
        "en": "The Y-shaped triradiate cartilage in the acetabulum joins ilium, ischium and pubis and fuses at about 15–17. The iliac crest ossifies from lateral to medial; its extent (Risser sign) shows whether the spine is still growing, used in managing scoliosis.",
        "zh": "髋臼内Y形软骨连接髂骨、坐骨和耻骨，约15–17岁愈合。髂嵴由外向内骨化，其程度（Risser征）反映脊柱是否仍在生长，用于脊柱侧弯的随访。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ3288"
      ]
    },
    {
      "key": "dui",
      "name": {
        "vi": "Xương đùi và xương bánh chè",
        "en": "Femur and patella",
        "zh": "股骨与髌骨"
      },
      "latin": "Femur · Patella",
      "note": {
        "vi": "Đầu dưới xương đùi xuất hiện khoảng tuần 36 thai kỳ. Chỏm xương đùi xuất hiện khoảng 6 tháng tuổi; ở trẻ 10–15 tuổi, chỏm có thể trượt khỏi sụn tiếp hợp (trượt chỏm xương đùi). Bánh chè là xương vừng lớn nhất, cốt hoá khoảng 3–6 tuổi; nhiều điểm không dính tạo bánh chè hai mảnh.",
        "en": "The lower femoral centre appears at about fetal week 36. The femoral head appears at about 6 months; between 10 and 15 it can slip off its growth plate (slipped capital femoral epiphysis). The patella, the largest sesamoid, ossifies at 3–6 years; unfused centres give a bipartite patella.",
        "zh": "股骨下端骨化中心约胚胎第36周出现。股骨头约6月龄出现；10–15岁时可沿骺板滑脱（股骨头骨骺滑脱）。髌骨为最大的籽骨，3–6岁骨化；多个中心不愈合形成二分髌骨。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ3259",
        "FJ3275"
      ]
    },
    {
      "key": "cang-chan",
      "name": {
        "vi": "Xương chày và xương mác",
        "en": "Tibia and fibula",
        "zh": "胫骨与腓骨"
      },
      "latin": "Tibia · Fibula",
      "note": {
        "vi": "Đầu trên xương chày xuất hiện lúc sinh, dính khoảng 16–18 tuổi. Lồi củ chày là mỏm riêng; ở trẻ hay chơi thể thao, gân bánh chè kéo liên tục gây đau lồi củ (bệnh Osgood–Schlatter). Xương mác là ngoại lệ: đầu dưới xuất hiện trước và dính trước đầu trên.",
        "en": "The upper tibial centre is present at birth and fuses at 16–18. The tibial tuberosity is a separate apophysis; in sporty children repeated pull of the patellar tendon makes it painful (Osgood–Schlatter disease). The fibula is the exception: its lower end appears and fuses before its upper end.",
        "zh": "胫骨上端骨化中心出生时即有，16–18岁愈合。胫骨粗隆为独立骨突，爱运动的儿童因髌韧带反复牵拉致其疼痛（Osgood–Schlatter病）。腓骨例外：下端比上端先出现、先愈合。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3260",
        "FJ3282"
      ]
    },
    {
      "key": "co-chan",
      "name": {
        "vi": "Bảy xương cổ chân",
        "en": "The seven tarsal bones",
        "zh": "七块跗骨"
      },
      "latin": "Ossa tarsi",
      "note": {
        "vi": "Xương gót và xương sên đã cốt hoá lúc sinh, xương hộp ngay trước hoặc sau sinh. Xương thuyền xuất hiện muộn nhất (khoảng 3 tuổi); thiếu máu nuôi lúc này gây hoại tử xương thuyền ở trẻ (bệnh Köhler). Mỏm sau xương gót có điểm riêng, hay đau ở trẻ 8–12 tuổi (bệnh Sever).",
        "en": "The calcaneus and talus are ossified at birth, the cuboid around birth. The navicular is last (about 3 years); a blood-supply lapse then causes its necrosis in children (Köhler disease). The back of the calcaneus has its own apophysis, often painful at 8–12 years (Sever disease).",
        "zh": "跟骨和距骨出生时已骨化，骰骨在出生前后骨化。足舟骨最晚（约3岁），此时血供不足可致儿童足舟骨坏死（Köhler病）。跟骨后部有独立骨突，8–12岁常疼痛（Sever病）。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3256",
        "FJ3258",
        "FJ3264",
        "FJ3267",
        "FJ3271",
        "FJ3280"
      ]
    },
    {
      "key": "ban-ngon",
      "name": {
        "vi": "Xương đốt bàn và đốt ngón chân",
        "en": "Metatarsals and phalanges of the foot",
        "zh": "跖骨与趾骨"
      },
      "latin": "Ossa metatarsi · Phalanges",
      "note": {
        "vi": "Như bàn tay: đốt bàn II–V có điểm ở chỏm, còn đốt bàn I và các đốt ngón có điểm ở nền. Nền đốt bàn V có mỏm riêng ở trẻ, dễ nhầm với gãy.",
        "en": "As in the hand: metatarsals 2–5 have their epiphysis at the head, the first metatarsal and phalanges at the base. The base of the fifth metatarsal has its own apophysis in children, easily mistaken for a fracture.",
        "zh": "同手部：第2–5跖骨骨骺在头，第1跖骨和趾骨在底。儿童第5跖骨底有独立骨突，易误诊为骨折。"
      },
      "tint": "#6f93b8",
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
        "FJ3266",
        "FJ3270",
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
