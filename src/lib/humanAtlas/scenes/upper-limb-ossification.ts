
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Xương chi trên và mốc cốt hoá" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có sụn tiếp hợp/điểm cốt hoá riêng — mốc thời gian ghi trong ghi chú từng xương.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-f.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const upperLimbOssificationScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/upper-limb-ossification.ts#upperLimbOssificationScene", {
  "slug": "moc-xuong-chi-tren",
  "title": {
    "vi": "Xương chi trên và mốc cốt hoá",
    "en": "Bones of the Upper Limb and their Ossification",
    "zh": "上肢骨及其骨化"
  },
  "latin": "Ossa membri superioris",
  "intro": {
    "vi": "Chi trên có 32 xương mỗi bên: đai vai (đòn, vai), cánh tay, cẳng tay (quay, trụ), 8 xương cổ tay, 5 xương đốt bàn và 14 đốt ngón. Hầu hết xương dài cốt hoá sụn: thân cốt hoá trước sinh, còn các đầu có điểm cốt hoá thứ phát xuất hiện rồi dính dần tới tuổi dậy thì. Xương đòn là ngoại lệ, cốt hoá màng sớm nhất cơ thể (tuần 5–6 thai kỳ). Mốc xuất hiện và dính của từng điểm dùng để đọc tuổi xương trên phim tay. Mỗi đoạn chi một màu; mốc cốt hoá ghi trong ghi chú. Bộ dữ liệu là xương người trưởng thành, không có sụn tiếp hợp.",
    "en": "Each upper limb has 32 bones: the girdle (clavicle, scapula), humerus, forearm (radius, ulna), 8 carpals, 5 metacarpals and 14 phalanges. Most long bones ossify in cartilage: the shaft ossifies before birth, while secondary centres appear at the ends and fuse gradually up to puberty. The clavicle is the exception, ossifying in membrane — the first bone in the body to do so (fetal weeks 5–6). The timing of each centre's appearance and fusion is used to read bone age on a hand X-ray. Each limb segment has its own colour; ossification timings are in the notes. The dataset is an adult skeleton with no growth plates.",
    "zh": "每侧上肢有32块骨：肩带（锁骨、肩胛骨）、肱骨、前臂（桡骨、尺骨）、8块腕骨、5块掌骨和14块指骨。大多数长骨为软骨内成骨：骨干于出生前骨化，两端的继发骨化中心相继出现并于青春期前后愈合。锁骨例外，为膜内成骨，是全身最早骨化的骨（胚胎第5–6周）。各骨化中心出现与愈合的时间用于手部X线判读骨龄。每段肢体一种颜色，骨化时间见注释。数据集为成人骨骼，无骺板。"
  },
  "frameGroups": [
    "dai-vai",
    "canh-tay",
    "cang-tay",
    "co-tay",
    "ban-ngon"
  ],
  "groups": [
    {
      "key": "dai-vai",
      "name": {
        "vi": "Đai vai: xương đòn, xương vai",
        "en": "Girdle: clavicle and scapula",
        "zh": "肩带：锁骨与肩胛骨"
      },
      "latin": "Clavicula · Scapula",
      "note": {
        "vi": "Xương đòn cốt hoá màng từ tuần 5–6 thai kỳ, nhưng đầu trong lại dính muộn nhất cơ thể (khoảng 25 tuổi). Xương vai có điểm cốt hoá ở mỏm quạ khoảng 1 tuổi. Mỏm cùng vai có thể không dính (os acromiale), dễ nhầm với gãy xương.",
        "en": "The clavicle ossifies in membrane from fetal weeks 5–6, yet its medial end is the last epiphysis in the body to fuse (about 25). The scapula's coracoid centre appears at about 1 year. The acromion may fail to fuse (os acromiale), easily mistaken for a fracture.",
        "zh": "锁骨于胚胎第5–6周膜内骨化，但其内侧端是全身最晚愈合的骨骺（约25岁）。肩胛骨喙突骨化中心约1岁出现；肩峰可不愈合（肩峰小骨），易误诊为骨折。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ3237",
        "FJ3279"
      ]
    },
    {
      "key": "canh-tay",
      "name": {
        "vi": "Xương cánh tay",
        "en": "Humerus",
        "zh": "肱骨"
      },
      "latin": "Humerus",
      "note": {
        "vi": "Đầu trên có ba điểm (chỏm, củ lớn, củ bé), dính khoảng 18–20 tuổi; đây là đầu “mọc” chính của xương. Đầu dưới có bốn điểm, xuất hiện theo thứ tự nhớ bằng chữ CRITOE: chỏm con (1 tuổi), chỏm quay (3), mỏm trên lồi cầu trong (5), ròng rọc (7), mỏm khuỷu (9), mỏm trên lồi cầu ngoài (11). Thứ tự này giúp đọc phim khuỷu ở trẻ.",
        "en": "The upper end has three centres (head, greater and lesser tubercles) fusing at about 18–20; it is the bone's main growing end. The lower end has four, and elbow centres appear in the order CRITOE: capitulum (1 year), radial head (3), medial epicondyle (5), trochlea (7), olecranon (9), lateral epicondyle (11). The order helps read children's elbow X-rays.",
        "zh": "上端有三个骨化中心（头、大结节、小结节），约18–20岁愈合，是肱骨的主要生长端。肘部骨化中心出现顺序可记为CRITOE：肱骨小头（1岁）、桡骨头（3）、内上髁（5）、滑车（7）、鹰嘴（9）、外上髁（11），用于判读儿童肘部X线。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ3262"
      ]
    },
    {
      "key": "cang-tay",
      "name": {
        "vi": "Xương quay và xương trụ",
        "en": "Radius and ulna",
        "zh": "桡骨与尺骨"
      },
      "latin": "Radius · Ulna",
      "note": {
        "vi": "Ở cả hai xương, đầu dưới là đầu mọc chính. Đầu dưới xương quay xuất hiện khoảng 1 tuổi và dính khoảng 18–20 tuổi. Gãy qua sụn tiếp hợp đầu dưới xương quay (phân loại Salter–Harris) là tổn thương sụn tiếp hợp hay gặp nhất ở trẻ.",
        "en": "In both bones the lower end is the main growing end. The distal radial centre appears at about 1 year and fuses at about 18–20. A fracture through the distal radial growth plate (Salter–Harris) is the commonest growth-plate injury in children.",
        "zh": "两骨均以下端为主要生长端。桡骨远端骨化中心约1岁出现、18–20岁愈合。经桡骨远端骺板的骨折（Salter–Harris分型）是儿童最常见的骺板损伤。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3277",
        "FJ3286"
      ]
    },
    {
      "key": "co-tay",
      "name": {
        "vi": "Tám xương cổ tay",
        "en": "The eight carpal bones",
        "zh": "八块腕骨"
      },
      "latin": "Ossa carpi",
      "note": {
        "vi": "Lúc sinh chưa có xương cổ tay nào cốt hoá. Xương cả và móc xuất hiện đầu tiên (khoảng 2–3 tháng), xương đậu cuối cùng (khoảng 9–12 tuổi). Đếm số xương cổ tay trên phim là cách ước tuổi xương đơn giản ở trẻ nhỏ.",
        "en": "No carpal bone is ossified at birth. The capitate and hamate appear first (about 2–3 months), the pisiform last (about 9–12 years). Counting carpals on an X-ray is a simple bone-age estimate in young children.",
        "zh": "出生时腕骨均未骨化。头状骨和钩骨最先出现（约2–3个月），豌豆骨最晚（约9–12岁）。在X线上计数腕骨是估计幼儿骨龄的简便方法。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3257",
        "FJ3261",
        "FJ3268",
        "FJ3276",
        "FJ3278",
        "FJ3283",
        "FJ3284",
        "FJ3285"
      ]
    },
    {
      "key": "ban-ngon",
      "name": {
        "vi": "Xương đốt bàn và đốt ngón",
        "en": "Metacarpals and phalanges",
        "zh": "掌骨与指骨"
      },
      "latin": "Ossa metacarpi · Phalanges",
      "note": {
        "vi": "Mỗi xương chỉ có một điểm cốt hoá đầu. Ở đốt bàn II–V điểm này nằm ở chỏm (đầu xa). Ở đốt bàn I và mọi đốt ngón, nó nằm ở nền (đầu gần). Vì thế đốt bàn I giống một đốt ngón hơn.",
        "en": "Each has only one epiphysis. In metacarpals 2–5 it is at the head (distal); in the first metacarpal and all phalanges it is at the base (proximal). That is why the first metacarpal behaves more like a phalanx.",
        "zh": "每骨仅一个骨骺：第2–5掌骨在头（远端），第1掌骨和所有指骨在底（近端）。因此第1掌骨更像一节指骨。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ3183",
        "FJ3184",
        "FJ3186",
        "FJ3187",
        "FJ3188",
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252",
        "FJ3291",
        "FJ3296",
        "FJ3297",
        "FJ3299",
        "FJ3313",
        "FJ3314",
        "FJ3316",
        "FJ3317",
        "FJ3318"
      ]
    }
  ]
});
