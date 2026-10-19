
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Động mạch cảnh và dưới đòn" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas KHÔNG có động mạch cảnh ngoài và nhánh — bài dạy cảnh chung, cảnh trong và các thân của ĐM dưới đòn.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const carotidSystemScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/carotid-system.ts#carotidSystemScene", {
  "slug": "dong-mach-canh",
  "title": {
    "vi": "Động mạch cảnh và dưới đòn vùng cổ",
    "en": "Carotid and Subclavian Arteries in the Neck",
    "zh": "颈部颈动脉与锁骨下动脉"
  },
  "latin": "Aa. carotides · A. subclavia",
  "intro": {
    "vi": "Bên phải, thân cánh tay–đầu tách từ cung động mạch chủ rồi chia thành động mạch cảnh chung và dưới đòn phải. Bên trái, hai động mạch này tách thẳng từ cung. Động mạch cảnh chung lên cổ trong bao cảnh, chia đôi ngang C4. Cảnh trong không cho nhánh nào ở cổ, đi thẳng vào sọ. Động mạch dưới đòn cho động mạch đốt sống, thân giáp–cổ, thân sườn–cổ và động mạch ngực trong. Hẹp gốc động mạch dưới đòn có thể làm máu chảy ngược động mạch đốt sống, gây chóng mặt khi dùng tay (hội chứng trộm máu dưới đòn). Bộ dữ liệu không có động mạch cảnh ngoài.",
    "en": "On the right, the brachiocephalic trunk leaves the aortic arch and divides into the right common carotid and subclavian arteries. On the left, both arise directly from the arch. The common carotid climbs the neck in the carotid sheath and divides at C4. The internal carotid gives no branches in the neck and goes straight into the skull. The subclavian gives the vertebral artery, the thyrocervical and costocervical trunks and the internal thoracic artery. Narrowing at the start of the subclavian can reverse flow in the vertebral artery and cause dizziness on using the arm (subclavian steal). The dataset has no external carotid artery.",
    "zh": "右侧头臂干发自主动脉弓，分为右颈总动脉和右锁骨下动脉；左侧二者直接发自主动脉弓。颈总动脉在颈动脉鞘内上行，于C4平面分叉。颈内动脉在颈部不发分支，直接入颅。锁骨下动脉发出椎动脉、甲状颈干、肋颈干和胸廓内动脉。锁骨下动脉起始部狭窄可致椎动脉血液逆流，用手时头晕（锁骨下动脉盗血综合征）。数据集中无颈外动脉。"
  },
  "frameGroups": [
    "goc",
    "canh-chung",
    "canh-trong",
    "dot-song",
    "duoi-don",
    "than"
  ],
  "fadedGroups": [
    "moc"
  ],
  "groups": [
    {
      "key": "goc",
      "name": {
        "vi": "Cung động mạch chủ và thân cánh tay–đầu",
        "en": "Aortic arch and brachiocephalic trunk",
        "zh": "主动脉弓与头臂干"
      },
      "latin": "Arcus aortae · Truncus brachiocephalicus",
      "note": {
        "vi": "Ba nhánh của cung, từ phải sang trái: thân cánh tay–đầu, cảnh chung trái, dưới đòn trái.",
        "en": "The arch's three branches, right to left: brachiocephalic trunk, left common carotid, left subclavian.",
        "zh": "主动脉弓三大分支自右向左：头臂干、左颈总动脉、左锁骨下动脉。"
      },
      "tint": "#8f2d2d",
      "parts": [
        "FJ3411",
        "FJ3417"
      ]
    },
    {
      "key": "canh-chung",
      "name": {
        "vi": "Động mạch cảnh chung",
        "en": "Common carotid artery",
        "zh": "颈总动脉"
      },
      "latin": "A. carotis communis",
      "note": {
        "vi": "Mạch cảnh bắt ở bờ trước cơ ức–đòn–chũm, ngang sụn giáp. Xơ vữa hay gặp nhất ở chỗ chia đôi; mảng bong ra gây đột quỵ.",
        "en": "The carotid pulse is felt at the front edge of sternocleidomastoid, level with the thyroid cartilage. Atheroma is commonest at the bifurcation; fragments break off and cause stroke.",
        "zh": "颈动脉搏动于胸锁乳突肌前缘、甲状软骨平面触及。动脉粥样硬化最常见于分叉处，斑块脱落致卒中。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ3483",
        "FJ3564"
      ]
    },
    {
      "key": "canh-trong",
      "name": {
        "vi": "Động mạch cảnh trong và động mạch mắt",
        "en": "Internal carotid and ophthalmic arteries",
        "zh": "颈内动脉与眼动脉"
      },
      "latin": "A. carotis interna · A. ophthalmica",
      "note": {
        "vi": "Nhánh đầu tiên trong sọ là động mạch mắt. Vì vậy mù thoáng qua một mắt (amaurosis fugax) là dấu hiệu báo trước của hẹp động mạch cảnh cùng bên.",
        "en": "Its first intracranial branch is the ophthalmic artery. So transient blindness in one eye (amaurosis fugax) warns of stenosis in the carotid on that side.",
        "zh": "其颅内第一分支为眼动脉，故一过性单眼黑矇是同侧颈动脉狭窄的预警。"
      },
      "tint": "#b03a48",
      "parts": [
        "FJ1682",
        "FJ1682M",
        "FJ1695",
        "FJ1695M"
      ]
    },
    {
      "key": "duoi-don",
      "name": {
        "vi": "Động mạch dưới đòn và ngực trong",
        "en": "Subclavian and internal thoracic arteries",
        "zh": "锁骨下动脉与胸廓内动脉"
      },
      "latin": "A. subclavia · A. thoracica interna",
      "note": {
        "vi": "Cơ bậc thang trước chia động mạch dưới đòn làm ba đoạn. Động mạch ngực trong (vú trong) đi dọc bờ xương ức, là mạch ghép bắc cầu chủ–vành bền nhất.",
        "en": "Scalenus anterior divides the subclavian into three parts. The internal thoracic (internal mammary) runs beside the sternum and is the most durable coronary bypass graft.",
        "zh": "前斜角肌将锁骨下动脉分为三段。胸廓内动脉沿胸骨缘下行，是最耐久的冠状动脉旁路移植血管。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1937",
        "FJ1972",
        "FJ3479",
        "FJ3579"
      ]
    },
    {
      "key": "dot-song",
      "name": {
        "vi": "Động mạch đốt sống",
        "en": "Vertebral artery",
        "zh": "椎动脉"
      },
      "latin": "A. vertebralis",
      "note": {
        "vi": "Nhánh đầu tiên của động mạch dưới đòn, chui lên qua lỗ mỏm ngang C6–C1.",
        "en": "The first branch of the subclavian, climbing through the transverse foramina of C6 to C1.",
        "zh": "锁骨下动脉第一分支，经C6至C1横突孔上行。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1725",
        "FJ1725M"
      ]
    },
    {
      "key": "than",
      "name": {
        "vi": "Thân giáp–cổ, sườn–cổ và nhánh",
        "en": "Thyrocervical and costocervical trunks and branches",
        "zh": "甲状颈干、肋颈干及分支"
      },
      "latin": "Truncus thyrocervicalis · Truncus costocervicalis",
      "note": {
        "vi": "Thân giáp–cổ cho động mạch giáp dưới (nuôi tuyến giáp và cận giáp, đi sát dây thanh quản quặt ngược), cổ nông, trên vai. Thân sườn–cổ cho động mạch cổ sâu và gian sườn trên cùng.",
        "en": "The thyrocervical trunk gives the inferior thyroid (to thyroid and parathyroids, close to the recurrent laryngeal nerve), superficial cervical and suprascapular arteries. The costocervical trunk gives the deep cervical and supreme intercostal arteries.",
        "zh": "甲状颈干发出甲状腺下动脉（供应甲状腺和甲状旁腺，紧邻喉返神经）、颈浅动脉和肩胛上动脉；肋颈干发出颈深动脉和最上肋间动脉。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1935",
        "FJ1970",
        "FJ2209",
        "FJ2210",
        "FJ2224",
        "FJ2226",
        "FJ2251",
        "FJ2255",
        "FJ2256",
        "FJ2276",
        "FJ2278",
        "FJ2303",
        "FJ2307",
        "FJ2308"
      ]
    },
    {
      "key": "moc",
      "name": {
        "vi": "Cột sống cổ, xương đòn, xương sườn I (mốc)",
        "en": "Cervical spine, clavicles, first ribs (landmarks)",
        "zh": "颈椎、锁骨、第1肋（标志）"
      },
      "latin": "Vertebrae cervicales · Clavicula · Costa I",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3161",
        "FJ3164",
        "FJ3167",
        "FJ3170",
        "FJ3172",
        "FJ3176",
        "FJ3177",
        "FJ3228",
        "FJ3237",
        "FJ3334",
        "FJ3362"
      ]
    }
  ]
});
