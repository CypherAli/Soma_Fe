
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Lỗ trên lồng ngực" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Tuyến nội tiết" cũ (trùng "he-noi-tiet"; atlas không có tuyến giáp). Atlas thiếu đám rối cánh tay, dây hoành, dây X.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-f.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const thoracicOutletScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/thoracic-outlet.ts#thoracicOutletScene", {
  "slug": "tuyen-noi-tiet",
  "title": {
    "vi": "Lỗ trên lồng ngực và các cấu trúc đi qua",
    "en": "The Superior Thoracic Aperture",
    "zh": "胸廓上口"
  },
  "latin": "Apertura thoracis superior",
  "system": "cardiovascular",
  "intro": {
    "vi": "Lỗ trên lồng ngực là vòng xương hình quả thận, giới hạn bởi đốt T1, đôi xương sườn I và bờ trên cán ức. Nó nghiêng xuống trước, nên đỉnh phổi nhô lên trên xương đòn. Qua lỗ này có khí quản, thực quản, các động mạch cảnh chung và dưới đòn, tĩnh mạch cánh tay–đầu và tuyến ức. Ở hai bên, bó mạch dưới đòn vượt qua xương sườn I giữa các cơ bậc thang và xương đòn. Xương sườn cổ hoặc cơ bậc thang phì đại có thể chèn vào đây. Mỗi hệ một màu; xương đóng khung.",
    "en": "The superior thoracic aperture is a kidney-shaped bony ring bounded by T1, the first ribs and the upper border of the manubrium. It slopes down and forward, so the lung apex rises above the clavicle. Through it pass the trachea, oesophagus, common carotid and subclavian arteries, brachiocephalic veins and thymus. At the sides the subclavian vessels cross the first rib between the scalenes and the clavicle. A cervical rib or bulky scalene can compress them there. Each system has its own colour; the bones frame the view.",
    "zh": "胸廓上口为肾形骨环，由T1、第1肋和胸骨柄上缘围成，向前下倾斜，故肺尖高出锁骨。经此通过的有气管、食管、颈总动脉和锁骨下动脉、头臂静脉及胸腺。两侧锁骨下血管在斜角肌与锁骨之间越过第1肋，颈肋或肥大的斜角肌可在此压迫之。每个系统一种颜色；骨骼构成框架。"
  },
  "frameGroups": [
    "xuong",
    "dm",
    "tm",
    "tang"
  ],
  "groups": [
    {
      "key": "xuong",
      "name": {
        "vi": "Vòng xương: T1, sườn I, cán ức, xương đòn",
        "en": "The bony ring: T1, first ribs, manubrium, clavicles",
        "zh": "骨环：T1、第1肋、胸骨柄、锁骨"
      },
      "latin": "Vertebra T1 · Costae I · Manubrium",
      "note": {
        "vi": "Xương sườn I ngắn, dẹt, rộng nhất; có rãnh cho động mạch và tĩnh mạch dưới đòn ở hai bên củ cơ bậc thang.",
        "en": "The first rib is the shortest, flattest and broadest, grooved for the subclavian artery and vein on either side of the scalene tubercle.",
        "zh": "第1肋最短、最扁、最宽，斜角肌结节前后有锁骨下静脉沟和动脉沟。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3158",
        "FJ3228",
        "FJ3237",
        "FJ3239",
        "FJ3290",
        "FJ3333",
        "FJ3334",
        "FJ3362"
      ]
    },
    {
      "key": "bac-thang",
      "name": {
        "vi": "Cơ bậc thang trước và giữa",
        "en": "Scalenus anterior and medius",
        "zh": "前、中斜角肌"
      },
      "latin": "Mm. scaleni anterior et medius",
      "note": {
        "vi": "Khe bậc thang giữa hai cơ là chỗ chèn ép hay gặp nhất của hội chứng lối ra lồng ngực.",
        "en": "The interscalene gap between them is the commonest site of compression in thoracic outlet syndrome.",
        "zh": "两肌之间的斜角肌间隙是胸廓出口综合征最常见的受压部位。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1570",
        "FJ1571",
        "FJ1592",
        "FJ1593"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch: cung chủ, cánh tay–đầu, cảnh chung, dưới đòn",
        "en": "Arteries: aortic arch, brachiocephalic, common carotid, subclavian",
        "zh": "动脉：主动脉弓、头臂干、颈总动脉、锁骨下动脉"
      },
      "latin": "Arcus aortae · Truncus brachiocephalicus · Aa. carotides communes, subclaviae",
      "note": {
        "vi": "Động mạch dưới đòn đi sau cơ bậc thang trước. Bị chèn lâu có thể gây phình sau chỗ hẹp và cục máu đông trôi xuống tay.",
        "en": "The subclavian artery passes behind scalenus anterior. Long-standing compression can cause a post-stenotic aneurysm and clots that travel to the hand.",
        "zh": "锁骨下动脉经前斜角肌后方。长期受压可致狭窄后动脉瘤及血栓脱落至手部。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1937",
        "FJ1972",
        "FJ2255",
        "FJ2307",
        "FJ3411",
        "FJ3417",
        "FJ3479",
        "FJ3483",
        "FJ3564",
        "FJ3579"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch: dưới đòn, cảnh trong, cánh tay–đầu, chủ trên",
        "en": "Veins: subclavian, internal jugular, brachiocephalic, SVC",
        "zh": "静脉：锁骨下、颈内、头臂静脉与上腔静脉"
      },
      "latin": "Vv. subclaviae, jugulares internae, brachiocephalicae · V. cava superior",
      "note": {
        "vi": "Tĩnh mạch dưới đòn đi trước cơ bậc thang trước, giữa xương đòn và sườn I. Vận động tay quá mức ở vận động viên có thể gây huyết khối ở đây (hội chứng Paget–Schroetter).",
        "en": "The subclavian vein runs in front of scalenus anterior, between clavicle and first rib; strenuous arm use in athletes can cause thrombosis here (Paget–Schroetter syndrome).",
        "zh": "锁骨下静脉经前斜角肌前方、锁骨与第1肋之间；运动员过度用臂可致此处血栓（Paget–Schroetter综合征）。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3482",
        "FJ3485",
        "FJ3486",
        "FJ3583",
        "FJ3585",
        "FJ3587",
        "FJ3645"
      ]
    },
    {
      "key": "tang",
      "name": {
        "vi": "Khí quản, thực quản, tuyến ức",
        "en": "Trachea, oesophagus, thymus",
        "zh": "气管、食管、胸腺"
      },
      "latin": "Trachea · Oesophagus · Thymus",
      "note": {
        "vi": "Thực quản nằm sau khí quản, trước cột sống. Tuyến ức ở trẻ lớn có thể lên tới cổ qua lỗ này.",
        "en": "The oesophagus lies behind the trachea and in front of the spine. In children the thymus can extend up into the neck through the aperture.",
        "zh": "食管位于气管后方、脊柱前方。儿童胸腺可经此口向上延伸至颈部。"
      },
      "tint": "#6fae9f",
      "parts": [
        "FJ2541",
        "FJ2563",
        "FJ3150",
        "FJ3151"
      ]
    }
  ]
});
