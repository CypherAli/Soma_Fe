/**
 * Scene "Hệ đốt sống–thân nền và động mạch tiểu não" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Góc cầu–tiểu não" cũ: atlas không có dây VII, VIII và các dây sọ khác ở góc cầu–tiểu não.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const vertebrobasilarScene: AtlasSceneDef = {
  "slug": "goc-cau-tieu-nao",
  "title": {
    "vi": "Hệ đốt sống–thân nền và động mạch tiểu não",
    "en": "The Vertebrobasilar System and Cerebellar Arteries",
    "zh": "椎基底动脉系与小脑动脉"
  },
  "latin": "Systema vertebrobasilare",
  "system": "cardiovascular",
  "intro": {
    "vi": "Hai động mạch đốt sống đi qua lỗ lớn xương chẩm, chạy mặt trước hành não rồi hợp thành động mạch thân nền ở bờ dưới cầu não. Hệ này nuôi thân não, tiểu não và phần sau đại não. Mỗi tầng có một đôi động mạch tiểu não. Động mạch tiểu não sau dưới tách từ động mạch đốt sống, động mạch tiểu não trước dưới và động mạch tiểu não trên tách từ thân nền. Dọc thân nền còn có các nhánh cầu não. Tắc thân nền gây hội chứng khoá trong: tỉnh nhưng liệt tứ chi, chỉ còn cử động mắt dọc. Mỗi động mạch một sắc đỏ; thân não và tiểu não mờ sẵn.",
    "en": "The two vertebral arteries pass through the foramen magnum, run up the front of the medulla and join as the basilar artery at the lower border of the pons. This system feeds the brainstem, cerebellum and back of the cerebrum. Each level has a pair of cerebellar arteries. The posterior inferior cerebellar comes from the vertebral; the anterior inferior and superior cerebellar come from the basilar. Pontine branches arise along the basilar. Basilar occlusion causes locked-in syndrome: the patient is awake but quadriplegic, able to move only the eyes vertically. Each artery has its own shade of red; brainstem and cerebellum are faded.",
    "zh": "两侧椎动脉经枕骨大孔入颅，沿延髓前面上行，在脑桥下缘合成基底动脉。该系统供应脑干、小脑和大脑后部。每一平面有一对小脑动脉：小脑下后动脉发自椎动脉，小脑下前动脉和小脑上动脉发自基底动脉；沿基底动脉还有脑桥支。基底动脉闭塞致闭锁综合征：意识清醒但四肢瘫痪，仅能垂直运动眼球。每条动脉一种红色调；脑干和小脑淡化。"
  },
  "frameGroups": [
    "dot-song",
    "than-nen",
    "pica",
    "aica",
    "sca"
  ],
  "fadedGroups": [
    "nao"
  ],
  "groups": [
    {
      "key": "dot-song",
      "name": {
        "vi": "Động mạch đốt sống và tuỷ sống trước",
        "en": "Vertebral and anterior spinal arteries",
        "zh": "椎动脉与脊髓前动脉"
      },
      "latin": "A. vertebralis (pars intracranialis) · A. spinalis anterior",
      "note": {
        "vi": "Hai nhánh nhỏ từ hai động mạch đốt sống hợp thành động mạch tuỷ sống trước, đi xuống khe giữa trước của tuỷ, nuôi 2/3 trước tuỷ sống.",
        "en": "Small branches from both vertebrals unite as the anterior spinal artery, which descends in the anterior median fissure and supplies the front two-thirds of the spinal cord.",
        "zh": "两侧椎动脉的小支合成脊髓前动脉，沿前正中裂下行，供应脊髓前2/3。"
      },
      "tint": "#8f2d2d",
      "parts": [
        "FJ1657",
        "FJ1657M",
        "FJ1725",
        "FJ1725M"
      ]
    },
    {
      "key": "than-nen",
      "name": {
        "vi": "Động mạch thân nền và nhánh cầu",
        "en": "Basilar artery and pontine branches",
        "zh": "基底动脉与脑桥支"
      },
      "latin": "A. basilaris · Aa. pontis",
      "note": {
        "vi": "Nằm trong rãnh nền mặt trước cầu não. Nhánh cầu trong và cầu ngoài xuyên thẳng vào cầu não.",
        "en": "Lies in the basilar groove on the front of the pons. Medial and lateral pontine branches pierce straight into it.",
        "zh": "位于脑桥前面的基底沟内。脑桥内、外侧支直接穿入脑桥。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1672",
        "FJ1684",
        "FJ1684M",
        "FJ1689",
        "FJ1689M"
      ]
    },
    {
      "key": "pica",
      "name": {
        "vi": "Động mạch tiểu não sau dưới",
        "en": "Posterior inferior cerebellar artery (PICA)",
        "zh": "小脑下后动脉（PICA）"
      },
      "latin": "A. inferior posterior cerebelli (PICA)",
      "note": {
        "vi": "Nhánh lớn nhất của động mạch đốt sống, uốn quanh hành não, nuôi mặt dưới tiểu não và phần ngoài hành não. Tắc nó gây hội chứng hành não ngoài (Wallenberg): chóng mặt, nuốt khó, mất cảm giác đau–nhiệt ở mặt cùng bên và thân đối bên.",
        "en": "The largest branch of the vertebral; it loops round the medulla to the underside of the cerebellum and the lateral medulla. Occlusion gives lateral medullary (Wallenberg) syndrome: vertigo, dysphagia, loss of pain and temperature on the same side of the face and the opposite side of the body.",
        "zh": "椎动脉最大分支，绕延髓至小脑下面和延髓外侧。闭塞致延髓背外侧（Wallenberg）综合征：眩晕、吞咽困难、同侧面部和对侧躯体痛温觉丧失。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1700",
        "FJ1700M",
        "FJ1701",
        "FJ1701M",
        "FJ1702",
        "FJ1702M",
        "FJ1703",
        "FJ1703M",
        "FJ1704",
        "FJ1704M",
        "FJ1705",
        "FJ1705M",
        "FJ1706",
        "FJ1706M",
        "FJ1707",
        "FJ1707M",
        "FJ1708",
        "FJ1708M",
        "FJ1709",
        "FJ1709M",
        "FJ1710",
        "FJ1710M",
        "FJ1711",
        "FJ1711M",
        "FJ1715",
        "FJ1715M"
      ]
    },
    {
      "key": "aica",
      "name": {
        "vi": "Động mạch tiểu não trước dưới",
        "en": "Anterior inferior cerebellar artery (AICA)",
        "zh": "小脑下前动脉（AICA）"
      },
      "latin": "A. inferior anterior cerebelli (AICA)",
      "note": {
        "vi": "Chạy qua góc cầu–tiểu não, sát dây VII và VIII, thường cho động mạch mê đạo vào tai trong. Tắc nó có thể gây điếc đột ngột kèm chóng mặt.",
        "en": "Crosses the cerebellopontine angle beside nerves VII and VIII and often gives the labyrinthine artery to the inner ear. Occlusion can cause sudden deafness with vertigo.",
        "zh": "经脑桥小脑角，紧邻面神经和前庭蜗神经，常发出迷路动脉入内耳。闭塞可致突发性耳聋伴眩晕。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1656",
        "FJ1656M"
      ]
    },
    {
      "key": "sca",
      "name": {
        "vi": "Động mạch tiểu não trên và nhánh",
        "en": "Superior cerebellar artery and branches",
        "zh": "小脑上动脉及分支"
      },
      "latin": "A. superior cerebelli et rami",
      "note": {
        "vi": "Tách ngay dưới chỗ chia đôi thân nền, chia nhánh trong (có nhánh nhộng trên) và nhánh ngoài, nuôi mặt trên tiểu não. Một quai của nó có thể đè vào rễ dây V, gây đau dây sinh ba.",
        "en": "Arises just below the basilar bifurcation and divides into medial (with the superior vermian branch) and lateral branches to the upper cerebellum. A loop can press on the root of nerve V and cause trigeminal neuralgia.",
        "zh": "在基底动脉分叉稍下方发出，分为内侧支（含上蚓支）和外侧支，供应小脑上面。其襻可压迫三叉神经根致三叉神经痛。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1683",
        "FJ1683M",
        "FJ1688",
        "FJ1688M",
        "FJ1726",
        "FJ1726M",
        "FJ1728",
        "FJ1728M"
      ]
    },
    {
      "key": "nao",
      "name": {
        "vi": "Thân não và tiểu não (mốc)",
        "en": "Brainstem and cerebellum (landmarks)",
        "zh": "脑干与小脑（标志）"
      },
      "latin": "Truncus encephali · Cerebellum",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ1769",
        "FJ1770",
        "FJ1775",
        "FJ1781",
        "FJ1817",
        "FJ1822",
        "FJ1830",
        "FJ1831"
      ]
    }
  ]
};
