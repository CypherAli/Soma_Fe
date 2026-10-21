
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Cơ trước cột sống cổ và cơ bậc thang" dựng từ bộ atlas BodyParts3D.
 * 
 * Bài cơ cổ độc lập; mô hình tai Z-Anatomy giữ đường dẫn he-thinh-giac.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-f.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const prevertebralScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/prevertebral.ts#prevertebralScene", {
  "slug": "co-truoc-cot-song-co",
  "title": {
    "vi": "Cơ trước cột sống cổ và cơ bậc thang",
    "en": "Prevertebral and Scalene Muscles",
    "zh": "椎前肌与斜角肌"
  },
  "latin": "Mm. prevertebrales · Mm. scaleni",
  "system": "muscular",
  "intro": {
    "vi": "Sát mặt trước cột sống cổ là nhóm cơ trước cột sống: cơ dài cổ, dài đầu, thẳng đầu trước và thẳng đầu ngoài. Chúng gấp cổ và đầu, và giữ đường cong cổ. Bị giãn đột ngột khi va chạm xe từ phía sau, chúng gây chấn thương kiểu “roi quất”. Ở hai bên là ba cơ bậc thang, đi từ mỏm ngang đốt cổ xuống xương sườn I và II. Chúng nâng sườn khi hít vào gắng sức. Giữa cơ bậc thang trước và giữa có khe cho động mạch dưới đòn và đám rối cánh tay đi qua. Khe hẹp gây hội chứng lối ra lồng ngực. Mỗi nhóm một tông màu; cột sống mờ sẵn.",
    "en": "Against the front of the cervical spine lie the prevertebral muscles: longus colli, longus capitis, rectus capitis anterior and rectus capitis lateralis. They flex the neck and head and hold the cervical curve. Suddenly stretched in a rear-end collision, they are injured in whiplash. At the sides are the three scalenes, running from the cervical transverse processes to ribs 1 and 2. They lift the ribs in forced inspiration. Between scalenus anterior and medius is a gap for the subclavian artery and brachial plexus. A tight gap causes thoracic outlet syndrome. Each group has its own colour family; the spine is faded.",
    "zh": "紧贴颈椎前面为椎前肌：颈长肌、头长肌、头前直肌和头外侧直肌，屈颈屈头并维持颈曲；追尾车祸时突然被牵拉而致“挥鞭伤”。两侧为三块斜角肌，自颈椎横突至第1、2肋，用力吸气时提肋。前、中斜角肌之间的间隙有锁骨下动脉和臂丛通过，间隙狭窄致胸廓出口综合征。每组一种色系；脊柱淡化。"
  },
  "frameGroups": [
    "truoc-song",
    "bac-thang"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "truoc-song",
      "name": {
        "vi": "Cơ dài cổ và dài đầu",
        "en": "Longus colli and longus capitis",
        "zh": "颈长肌与头长肌"
      },
      "latin": "Mm. longus colli, longus capitis",
      "note": {
        "vi": "Cơ dài cổ có ba phần (chéo trên, dọc giữa, chéo dưới) ôm mặt trước thân đốt từ đốt đội tới T3. Thân giao cảm cổ nằm ngay trên mặt trước cơ.",
        "en": "Longus colli has three parts (superior oblique, vertical, inferior oblique) hugging the vertebral bodies from atlas to T3. The cervical sympathetic trunk lies on its front.",
        "zh": "颈长肌分上斜部、垂直部、下斜部，贴附寰椎至T3椎体前面。颈交感干位于其前面。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1557",
        "FJ1561",
        "FJ1582",
        "FJ1600",
        "FJ1601"
      ]
    },
    {
      "key": "thang-dau",
      "name": {
        "vi": "Cơ thẳng đầu trước và ngoài",
        "en": "Rectus capitis anterior and lateralis",
        "zh": "头前直肌与头外侧直肌"
      },
      "latin": "Mm. rectus capitis anterior et lateralis",
      "note": {
        "vi": "Hai cơ ngắn nối đốt đội với nền xương chẩm, gấp và nghiêng đầu tại khớp đội–chẩm.",
        "en": "Two short muscles linking the atlas to the occipital base, flexing and tilting the head at the atlanto-occipital joint.",
        "zh": "两块短肌连接寰椎与枕骨底，在寰枕关节处屈头和侧屈头。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1566",
        "FJ1569",
        "FJ1588",
        "FJ1591"
      ]
    },
    {
      "key": "bac-thang",
      "name": {
        "vi": "Ba cơ bậc thang",
        "en": "The three scalenes",
        "zh": "三块斜角肌"
      },
      "latin": "Mm. scaleni anterior, medius, posterior",
      "note": {
        "vi": "Bậc thang trước bám củ cơ bậc thang ở sườn I. Dây hoành chạy chéo trên mặt trước cơ này. Tĩnh mạch dưới đòn đi trước cơ, còn động mạch dưới đòn đi sau.",
        "en": "Scalenus anterior inserts on the scalene tubercle of rib 1. The phrenic nerve slants down across its front. The subclavian vein passes in front of it, the artery behind.",
        "zh": "前斜角肌止于第1肋斜角肌结节，膈神经斜行于其前面。锁骨下静脉经其前方，锁骨下动脉经其后方。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1570",
        "FJ1571",
        "FJ1572",
        "FJ1592",
        "FJ1593",
        "FJ1594"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch dưới đòn và đốt sống",
        "en": "Subclavian and vertebral arteries",
        "zh": "锁骨下动脉与椎动脉"
      },
      "latin": "A. subclavia · A. vertebralis",
      "note": {
        "vi": "Động mạch đốt sống chui vào lỗ mỏm ngang C6, trong tam giác giữa cơ dài cổ và bậc thang trước.",
        "en": "The vertebral artery enters the C6 transverse foramen from the triangle between longus colli and scalenus anterior.",
        "zh": "椎动脉自颈长肌与前斜角肌之间的三角进入C6横突孔。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1725",
        "FJ1725M",
        "FJ3479",
        "FJ3579"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Cột sống cổ, sườn I–II, xương chẩm (mốc)",
        "en": "Cervical spine, ribs 1–2, occipital (landmarks)",
        "zh": "颈椎、第1–2肋、枕骨（标志）"
      },
      "latin": "Vertebrae cervicales · Costae I–II · Os occipitale",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3158",
        "FJ3160",
        "FJ3161",
        "FJ3163",
        "FJ3164",
        "FJ3167",
        "FJ3170",
        "FJ3172",
        "FJ3176",
        "FJ3177",
        "FJ3228",
        "FJ3229",
        "FJ3309",
        "FJ3334",
        "FJ3336"
      ]
    }
  ]
});
