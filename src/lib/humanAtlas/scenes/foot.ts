
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Xương Bàn chân" (bàn chân trái) dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-foot.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const footScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/foot.ts#footScene", {
  "slug": "ban-chan",
  "title": {
    "vi": "Xương Bàn chân",
    "en": "Bones of the Foot",
    "zh": "足骨"
  },
  "latin": "Ossa pedis",
  "intro": {
    "vi": "Bàn chân có 26 xương (chưa kể xương vừng): 7 xương cổ chân, 5 xương đốt bàn và 14 đốt ngón. Chúng xếp thành vòm dọc trong, vòm dọc ngoài và vòm ngang, giữ bằng dây chằng và cơ — vòm vừa phân tán trọng lượng vừa làm lò xo khi đi. Xương sên nhận toàn bộ trọng lượng cơ thể từ xương chày rồi chia về gót và mũi chân.",
    "en": "The foot has 26 bones (not counting sesamoids): 7 tarsals, 5 metatarsals and 14 phalanges. They form the medial and lateral longitudinal arches and the transverse arch, held by ligaments and muscles — the arches both spread body weight and act as springs in walking. The talus receives the entire body weight from the tibia and passes it back to the heel and forward to the ball of the foot.",
    "zh": "足有26块骨（不计籽骨）：7块跗骨、5块跖骨和14节趾骨。它们构成内侧纵弓、外侧纵弓和横弓，由韧带与肌肉维持——足弓既分散体重，又在行走时起弹簧作用。距骨接受来自胫骨的全部体重，再分向足跟与前足。"
  },
  "groups": [
    {
      "key": "xuong-sen",
      "name": {
        "vi": "Xương sên",
        "en": "Talus",
        "zh": "距骨"
      },
      "latin": "Talus",
      "note": {
        "vi": "Xương duy nhất của bàn chân khớp với cẳng chân, kẹp giữa hai mắt cá tạo khớp cổ chân. Không có cơ nào bám vào và 60% bề mặt là sụn khớp, nên máu nuôi ít — gãy cổ xương sên dễ hoại tử vô mạch.",
        "en": "The only foot bone that articulates with the leg, gripped between the two malleoli to form the ankle joint. No muscle attaches to it and 60% of its surface is articular cartilage, so its blood supply is poor — a talar neck fracture readily leads to avascular necrosis.",
        "zh": "足部唯一与小腿相关节的骨，被内外踝夹持构成踝关节。无肌肉附着，60%表面为关节软骨，血供差——距骨颈骨折易致缺血性坏死。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ3280"
      ]
    },
    {
      "key": "xuong-got",
      "name": {
        "vi": "Xương gót",
        "en": "Calcaneus",
        "zh": "跟骨"
      },
      "latin": "Calcaneus",
      "note": {
        "vi": "Xương lớn nhất bàn chân, là gót chân và chỗ bám của gân gót (Achilles). Ngã từ trên cao tiếp đất bằng gót làm vỡ xương gót — phải kiểm tra thêm cột sống thắt lưng vì lực truyền lên.",
        "en": "The largest foot bone, forming the heel and receiving the calcaneal (Achilles) tendon. Landing on the heels from a height shatters it — the lumbar spine must also be checked because the force travels upward.",
        "zh": "足部最大的骨，构成足跟，跟腱（阿基里斯腱）附着于此。高处坠落足跟着地可致跟骨粉碎——须同时检查腰椎，因暴力沿轴向上传导。"
      },
      "tint": "#c98a5a",
      "parts": [
        "FJ3256"
      ]
    },
    {
      "key": "co-chan-truoc",
      "name": {
        "vi": "Xương ghe, hộp và ba xương chêm",
        "en": "Navicular, cuboid and cuneiforms",
        "zh": "足舟骨、骰骨与楔骨"
      },
      "latin": "Os naviculare · Os cuboideum · Ossa cuneiformia",
      "note": {
        "vi": "Năm xương cổ chân trước. Xương ghe là đỉnh vòm dọc trong; xương hộp đỡ vòm dọc ngoài; ba xương chêm hình nêm xếp thành vòm ngang. Đường khớp giữa hàng sau (sên, gót) và hàng trước là khớp Chopart — mốc cắt cụt bàn chân.",
        "en": "The five anterior tarsals. The navicular is the keystone of the medial longitudinal arch; the cuboid supports the lateral arch; the three wedge-shaped cuneiforms build the transverse arch. The joint line between the posterior row (talus, calcaneus) and these bones is Chopart's joint — a landmark for foot amputation.",
        "zh": "五块前部跗骨。足舟骨为内侧纵弓的拱顶石；骰骨支撑外侧纵弓；三块楔形的楔骨构成横弓。后列（距骨、跟骨）与此列之间的关节线为Chopart关节——足部截肢的标志。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ3258",
        "FJ3264",
        "FJ3267",
        "FJ3271",
        "FJ3307"
      ]
    },
    {
      "key": "dot-ban-chan",
      "name": {
        "vi": "Xương đốt bàn chân (I–V)",
        "en": "Metatarsals (I–V)",
        "zh": "跖骨（I–V）"
      },
      "latin": "Ossa metatarsi I–V",
      "note": {
        "vi": "Năm xương dài. Đầu các xương đốt bàn là \"mũi chân\" chịu lực khi kiễng. Gãy do mỏi (gãy hành quân) hay gặp ở đốt bàn II–III; gãy nền đốt bàn V do lật cổ chân kéo gân mác ngắn.",
        "en": "Five long bones. Their heads form the ball of the foot, bearing weight when standing on tiptoe. Stress (march) fractures typically hit metatarsals II–III; a fracture at the base of the fifth follows an inversion sprain pulling on fibularis brevis.",
        "zh": "五块长骨，其头部构成前足掌，踮脚时承重。疲劳性（行军）骨折多见于第II–III跖骨；足内翻扭伤牵拉腓骨短肌可致第五跖骨基底骨折。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ3241",
        "FJ3244",
        "FJ3247",
        "FJ3250",
        "FJ3253"
      ]
    },
    {
      "key": "dot-ngon-chan",
      "name": {
        "vi": "Đốt ngón chân",
        "en": "Phalanges of the toes",
        "zh": "趾骨"
      },
      "latin": "Phalanges pedis",
      "note": {
        "vi": "14 đốt: ngón cái hai đốt, các ngón khác ba đốt (gần, giữa, xa). Ngón cái to và khoẻ, là điểm đẩy cuối cùng khi bước — lệch ngón cái (hallux valgus) làm hỏng cơ chế này.",
        "en": "14 phalanges: two in the big toe, three (proximal, middle, distal) in the others. The big toe is large and strong because it gives the final push-off in each step — hallux valgus disrupts this mechanism.",
        "zh": "共14节：拇趾两节，其余各趾三节（近节、中节、远节）。拇趾粗壮，是每一步最后的蹬离点——拇外翻会破坏这一机制。"
      },
      "tint": "#7fa878",
      "parts": [
        "FJ3179",
        "FJ3180",
        "FJ3181",
        "FJ3182",
        "FJ3185",
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
    },
    {
      "key": "xuong-vung",
      "name": {
        "vi": "Xương vừng ngón cái",
        "en": "Sesamoid bones of the big toe",
        "zh": "拇趾籽骨"
      },
      "latin": "Ossa sesamoidea",
      "note": {
        "vi": "Hai xương nhỏ nằm trong gân cơ gấp ngón cái ngắn, dưới đầu xương đốt bàn I. Chúng như ròng rọc tăng lực đòn bẩy và đỡ lực khi nhón chân — viêm xương vừng hay gặp ở vũ công ba lê.",
        "en": "Two small bones inside the flexor hallucis brevis tendon under the head of the first metatarsal. They act as pulleys, improving leverage and bearing load on tiptoe — sesamoiditis is common in ballet dancers.",
        "zh": "位于拇短屈肌腱内、第一跖骨头下方的两块小骨，起滑车作用增加力臂，并在踮脚时承重——籽骨炎常见于芭蕾舞者。"
      },
      "tint": "#cfa94f",
      "parts": [
        "FJ3266",
        "FJ3270"
      ]
    }
  ]
});
