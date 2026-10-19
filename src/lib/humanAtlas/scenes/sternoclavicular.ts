
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Khớp ức–đòn" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu đĩa khớp, bao khớp, dây chằng ức–đòn và sườn–đòn — bài dạy xương + cơ + liên quan mạch.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const sternoclavicularScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/sternoclavicular.ts#sternoclavicularScene", {
  "slug": "khop-uc-don",
  "title": {
    "vi": "Khớp ức–đòn: xương, cơ và liên quan",
    "en": "The Sternoclavicular Joint: Bones, Muscles and Relations",
    "zh": "胸锁关节：骨、肌与毗邻"
  },
  "latin": "Articulatio sternoclavicularis",
  "intro": {
    "vi": "Khớp ức–đòn là khớp duy nhất nối chi trên với thân mình. Đầu trong xương đòn tựa vào khuyết đòn của cán ức và sụn sườn I. Mặt khớp không khớp nhau, được một đĩa sụn chêm vào giữa. Nhờ các dây chằng rất khoẻ, xương đòn gãy trước khi khớp này trật. Khi trật ra sau, đầu xương đòn có thể đè vào tĩnh mạch cánh tay–đầu, động mạch và khí quản ngay phía sau. Đây là cấp cứu. Scene cho thấy xương, cơ bám quanh khớp và mạch lớn liên quan. Bộ dữ liệu không có đĩa khớp và dây chằng.",
    "en": "The sternoclavicular joint is the only joint linking the upper limb to the trunk. The medial end of the clavicle rests on the clavicular notch of the manubrium and the first costal cartilage. The surfaces are incongruent and an articular disc sits between them. Its ligaments are so strong that the clavicle breaks before the joint dislocates. When it does dislocate backwards, the clavicle can press on the brachiocephalic vein, artery and trachea right behind it — an emergency. The scene shows the bones, the muscles around the joint and the great vessels nearby. The dataset has no disc or ligaments.",
    "zh": "胸锁关节是上肢与躯干之间唯一的关节。锁骨内侧端靠于胸骨柄锁切迹和第1肋软骨上，关节面不相适应，中间有关节盘。其韧带极强，锁骨往往先骨折而关节不脱位。若向后脱位，锁骨内端可压迫其正后方的头臂静脉、动脉和气管，属急症。本场景显示骨、关节周围肌肉及毗邻大血管。数据集中无关节盘和韧带。"
  },
  "frameGroups": [
    "xuong",
    "co",
    "mach"
  ],
  "groups": [
    {
      "key": "xuong",
      "name": {
        "vi": "Cán ức, xương đòn, xương sườn I và sụn sườn I",
        "en": "Manubrium, clavicle, first rib and costal cartilage",
        "zh": "胸骨柄、锁骨、第1肋及肋软骨"
      },
      "latin": "Manubrium sterni · Clavicula · Costa I",
      "note": {
        "vi": "Đầu trong xương đòn là nơi cốt hoá muộn nhất cơ thể (khoảng 25 tuổi). Pháp y dùng mốc này để ước tuổi.",
        "en": "The medial end of the clavicle is the last growth centre in the body to fuse (about age 25); forensic experts use it to estimate age.",
        "zh": "锁骨内侧端是全身最晚闭合的骨化中心（约25岁），法医以此推断年龄。"
      },
      "tint": "#d9cfb8",
      "parts": [
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
      "key": "co",
      "name": {
        "vi": "Cơ bám quanh khớp",
        "en": "Muscles around the joint",
        "zh": "关节周围肌"
      },
      "latin": "M. sternocleidomastoideus · M. subclavius · M. pectoralis major (pars clavicularis)",
      "note": {
        "vi": "Đầu ức và đầu đòn của cơ ức–đòn–chũm bám ngay trên khớp. Cơ dưới đòn giữ xương đòn áp vào khớp. Phần đòn cơ ngực lớn bám nửa trong xương đòn.",
        "en": "The sternal and clavicular heads of sternocleidomastoid attach right above the joint. Subclavius holds the clavicle against it. The clavicular part of pectoralis major attaches to the medial half of the clavicle.",
        "zh": "胸锁乳突肌胸骨头和锁骨头附于关节正上方；锁骨下肌将锁骨压向关节；胸大肌锁骨部附于锁骨内侧半。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1447",
        "FJ1447M",
        "FJ1460",
        "FJ1460M",
        "FJ1573",
        "FJ1595"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Tĩnh mạch cánh tay–đầu (ngay sau khớp)",
        "en": "Brachiocephalic veins (just behind the joint)",
        "zh": "头臂静脉（关节正后方）"
      },
      "latin": "Vv. brachiocephalicae · V. cava superior",
      "note": {
        "vi": "Tĩnh mạch cánh tay–đầu mỗi bên hình thành ngay sau khớp, do tĩnh mạch cảnh trong hợp với dưới đòn.",
        "en": "Each brachiocephalic vein forms just behind the joint, where the internal jugular meets the subclavian.",
        "zh": "每侧头臂静脉在关节正后方由颈内静脉与锁骨下静脉汇合而成。"
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
      "key": "dm",
      "name": {
        "vi": "Thân cánh tay–đầu, cảnh chung, dưới đòn",
        "en": "Brachiocephalic trunk, common carotid, subclavian",
        "zh": "头臂干、颈总动脉、锁骨下动脉"
      },
      "latin": "Truncus brachiocephalicus · Aa. carotis communis, subclavia",
      "note": {
        "vi": "Thân cánh tay–đầu chia đôi ngay sau khớp ức–đòn phải.",
        "en": "The brachiocephalic trunk divides just behind the right sternoclavicular joint.",
        "zh": "头臂干在右胸锁关节正后方分叉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ3411",
        "FJ3417",
        "FJ3479",
        "FJ3483",
        "FJ3564",
        "FJ3579"
      ]
    },
    {
      "key": "khi-quan",
      "name": {
        "vi": "Khí quản",
        "en": "Trachea",
        "zh": "气管"
      },
      "latin": "Trachea",
      "note": {
        "vi": "Nằm giữa hai khớp, sau cán ức.",
        "en": "Lies between the two joints, behind the manubrium.",
        "zh": "位于两关节之间、胸骨柄后方。"
      },
      "tint": "#6fae9f",
      "parts": [
        "FJ2541"
      ]
    }
  ]
});
