/**
 * Scene "Đa giác Willis" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-willis.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const willisScene: AtlasSceneDef = {
  "slug": "da-giac-willis",
  "title": {
    "vi": "Đa giác Willis",
    "en": "Circle of Willis",
    "zh": "Willis环"
  },
  "latin": "Circulus arteriosus cerebri",
  "intro": {
    "vi": "Não nhận máu từ hai hệ: hệ cảnh (hai động mạch cảnh trong, phía trước) và hệ đốt sống–nền (hai động mạch đốt sống hợp thành động mạch nền, phía sau). Ở đáy não hai hệ nối nhau thành một vòng khép kín — đa giác Willis — nhờ động mạch thông trước và hai động mạch thông sau. Khi một nguồn hẹp dần, vòng này chuyển máu từ nguồn khác sang. Mỗi đoạn tô một màu; hệ cảnh tông đỏ, hệ đốt sống–nền tông cam.",
    "en": "The brain is fed by two systems: the carotid system (the two internal carotids, in front) and the vertebrobasilar system (the two vertebrals joining into the basilar artery, behind). At the base of the brain they are linked into a closed ring — the circle of Willis — by the anterior communicating artery and the two posterior communicating arteries. If one inflow narrows slowly, the ring reroutes blood from another. Each segment has its own colour; the carotid system is in reds, the vertebrobasilar system in oranges.",
    "zh": "脑由两个系统供血：前方的颈内动脉系统（两条颈内动脉）和后方的椎-基底动脉系统（两条椎动脉汇合成基底动脉）。二者在脑底借前交通动脉和两条后交通动脉连成闭合环——Willis环。一条来源逐渐狭窄时，此环可从其他来源调配血流。各段以不同颜色显示；颈内动脉系统为红色系，椎-基底动脉系统为橙色系。"
  },
  "frameGroups": [
    "dm-canh-trong",
    "dm-nao-truoc",
    "dm-thong-truoc",
    "dm-thong-sau",
    "dm-nao-sau",
    "dm-nao-giua",
    "dm-nen"
  ],
  "groups": [
    {
      "key": "dm-canh-trong",
      "name": {
        "vi": "Động mạch cảnh trong",
        "en": "Internal carotid artery",
        "zh": "颈内动脉"
      },
      "latin": "A. carotis interna",
      "note": {
        "vi": "Nguồn cấp khoảng 80% máu cho não, đi qua ống cảnh và xoang hang rồi chia thành động mạch não trước và não giữa. Trước khi chia, nó cho động mạch mắt — nên tắc cảnh trong có thể báo trước bằng mù thoáng qua một mắt (amaurosis fugax).",
        "en": "Supplies about 80% of the brain's blood. It runs through the carotid canal and cavernous sinus, then divides into the anterior and middle cerebral arteries. Before dividing it gives off the ophthalmic artery — so carotid disease can announce itself as fleeting blindness in one eye (amaurosis fugax).",
        "zh": "提供脑约80%的血液，经颈动脉管和海绵窦后分为大脑前动脉和大脑中动脉。分叉前发出眼动脉——因此颈内动脉病变可先表现为一过性单眼黑矇。"
      },
      "tint": "#b8434f",
      "parts": [
        "FJ1682",
        "FJ1682M"
      ]
    },
    {
      "key": "dm-nao-truoc",
      "name": {
        "vi": "Động mạch não trước",
        "en": "Anterior cerebral artery",
        "zh": "大脑前动脉"
      },
      "latin": "A. cerebri anterior (A1)",
      "note": {
        "vi": "Chạy vào khe liên bán cầu, nuôi mặt trong thuỳ trán và đỉnh — nơi có vùng vận động của CHÂN. Vì vậy tắc động mạch não trước gây yếu chân nhiều hơn tay, ngược với tắc não giữa.",
        "en": "Runs into the interhemispheric fissure and supplies the medial frontal and parietal lobes — where the LEG motor area lies. That is why an anterior cerebral occlusion weakens the leg more than the arm, the reverse of a middle cerebral stroke.",
        "zh": "进入大脑纵裂，供应额叶和顶叶内侧面——下肢运动区所在处。因此大脑前动脉闭塞时下肢无力重于上肢，与大脑中动脉卒中相反。"
      },
      "tint": "#d0685a",
      "parts": [
        "FJ1654",
        "FJ1654M"
      ]
    },
    {
      "key": "dm-thong-truoc",
      "name": {
        "vi": "Động mạch thông trước",
        "en": "Anterior communicating artery",
        "zh": "前交通动脉"
      },
      "latin": "A. communicans anterior",
      "note": {
        "vi": "Đoạn ngắn nhất của vòng, nối hai động mạch não trước. Là vị trí phình mạch não hay gặp nhất — vỡ gây xuất huyết dưới nhện với cơn \"đau đầu dữ dội nhất đời\".",
        "en": "The shortest segment of the ring, linking the two anterior cerebrals. It is the commonest site of cerebral (berry) aneurysm — rupture causes subarachnoid haemorrhage with the \"worst headache of my life\".",
        "zh": "环中最短的一段，连接两侧大脑前动脉。是颅内（囊状）动脉瘤最常见的部位——破裂导致蛛网膜下腔出血，表现为“一生中最剧烈的头痛”。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ1655"
      ]
    },
    {
      "key": "dm-nao-giua",
      "name": {
        "vi": "Động mạch não giữa (đoạn M1)",
        "en": "Middle cerebral artery (M1)",
        "zh": "大脑中动脉（M1段）"
      },
      "latin": "A. cerebri media (M1)",
      "note": {
        "vi": "Nhánh tận lớn nhất của cảnh trong, đi ngang ra rãnh bên. Đoạn M1 cho các động mạch trung tâm trước-ngoài (động mạch bèo vân) nuôi bao trong — những mạch nhỏ, vuông góc, dễ vỡ khi tăng huyết áp. Tắc não giữa: liệt mặt và tay nửa người đối diện, mất ngôn ngữ nếu bên trội.",
        "en": "The largest terminal branch of the internal carotid, running laterally into the lateral sulcus. Its M1 segment gives the anterolateral central (lenticulostriate) arteries to the internal capsule — small vessels branching at right angles that rupture easily in hypertension. MCA occlusion: contralateral face and arm weakness, plus aphasia on the dominant side.",
        "zh": "颈内动脉最大的终支，向外进入外侧沟。M1段发出前外侧中央动脉（豆纹动脉）供应内囊——这些小动脉呈直角发出，高血压时易破裂。大脑中动脉闭塞：对侧面部和上肢瘫痪，优势侧还伴失语。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1662",
        "FJ1662M",
        "FJ1663",
        "FJ1663M",
        "FJ1692",
        "FJ1692M"
      ]
    },
    {
      "key": "dm-thong-sau",
      "name": {
        "vi": "Động mạch thông sau",
        "en": "Posterior communicating artery",
        "zh": "后交通动脉"
      },
      "latin": "A. communicans posterior",
      "note": {
        "vi": "Nối hệ cảnh với hệ đốt sống–nền. Chạy sát dây thần kinh vận nhãn (III): phình mạch ở đây chèn dây III gây sụp mi và giãn đồng tử cùng bên — dấu hiệu phải chụp mạch ngay.",
        "en": "Links the carotid and vertebrobasilar systems. It runs right beside the oculomotor nerve (III): an aneurysm here compresses III, causing ptosis and a dilated pupil on that side — a sign that demands urgent angiography.",
        "zh": "连接颈内动脉系统与椎-基底动脉系统，紧邻动眼神经（III）走行：此处动脉瘤压迫动眼神经可致同侧上睑下垂和瞳孔散大——需立即行血管造影的征象。"
      },
      "tint": "#e07a6a",
      "parts": [
        "FJ1713",
        "FJ1713M"
      ]
    },
    {
      "key": "dm-nao-sau",
      "name": {
        "vi": "Động mạch não sau",
        "en": "Posterior cerebral artery",
        "zh": "大脑后动脉"
      },
      "latin": "A. cerebri posterior (P1–P2)",
      "note": {
        "vi": "Nhánh tận của động mạch nền, vòng quanh cuống đại não ra sau nuôi thuỳ chẩm và mặt dưới thuỳ thái dương. Đoạn trước chỗ nối thông sau (P1) và sau đó (P2) được tách riêng trong dữ liệu. Tắc gây bán manh đối bên.",
        "en": "A terminal branch of the basilar artery, curving around the cerebral peduncle to supply the occipital lobe and the underside of the temporal lobe. The segment before the posterior communicating junction (P1) and after it (P2) are separate pieces in the data. Occlusion causes a contralateral hemianopia.",
        "zh": "基底动脉的终支，绕大脑脚向后供应枕叶及颞叶下面。数据中后交通动脉汇入点之前（P1）与之后（P2）为独立网格。闭塞导致对侧偏盲。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1714",
        "FJ1714M",
        "FJ1723",
        "FJ1723M"
      ]
    },
    {
      "key": "dm-nen",
      "name": {
        "vi": "Động mạch nền",
        "en": "Basilar artery",
        "zh": "基底动脉"
      },
      "latin": "A. basilaris",
      "note": {
        "vi": "Hai động mạch đốt sống hợp lại ở bờ dưới cầu não thành động mạch nền, chạy dọc mặt trước cầu não và chia đôi thành hai động mạch não sau. Tắc động mạch nền gây hội chứng khoá trong: tỉnh hoàn toàn nhưng chỉ còn cử động được mắt.",
        "en": "The two vertebral arteries join at the lower border of the pons to form the basilar artery, which runs up the front of the pons and splits into the two posterior cerebrals. Basilar occlusion causes locked-in syndrome: fully conscious but able to move only the eyes.",
        "zh": "两条椎动脉在脑桥下缘汇合成基底动脉，沿脑桥前面上行，分为两条大脑后动脉。基底动脉闭塞可致闭锁综合征：意识完全清醒但只能活动眼球。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ1672"
      ]
    },
    {
      "key": "dm-dot-song",
      "name": {
        "vi": "Động mạch đốt sống",
        "en": "Vertebral artery",
        "zh": "椎动脉"
      },
      "latin": "A. vertebralis",
      "note": {
        "vi": "Tách từ động mạch dưới đòn, đi lên trong lỗ mỏm ngang các đốt cổ C6–C1, vòng qua đốt đội rồi chui qua lỗ lớn vào sọ. Xoay hoặc ngửa cổ mạnh (nắn cột sống cổ) có thể bóc tách nó gây đột quỵ tuần hoàn sau.",
        "en": "Arises from the subclavian artery, climbs through the transverse foramina of C6–C1, loops over the atlas and enters the skull through the foramen magnum. Forceful neck rotation or extension (cervical manipulation) can dissect it and cause a posterior-circulation stroke.",
        "zh": "起自锁骨下动脉，穿C6–C1横突孔上行，绕过寰椎后经枕骨大孔入颅。颈部强力旋转或后伸（颈椎推拿）可致其夹层，引起后循环卒中。"
      },
      "tint": "#c9772e",
      "parts": [
        "FJ1725",
        "FJ1725M"
      ]
    },
    {
      "key": "dm-tieu-nao",
      "name": {
        "vi": "Ba động mạch tiểu não",
        "en": "The three cerebellar arteries",
        "zh": "三条小脑动脉"
      },
      "latin": "Aa. cerebelli superior, inferior anterior, inferior posterior",
      "note": {
        "vi": "Tiểu não trên (từ ngọn động mạch nền), tiểu não trước-dưới (từ thân nền) và tiểu não sau-dưới (từ động mạch đốt sống). Tắc tiểu não sau-dưới gây hội chứng Wallenberg — nhồi máu hành não bên: chóng mặt, nuốt khó, mất cảm giác đau-nhiệt mặt cùng bên và thân bên đối diện.",
        "en": "Superior cerebellar (from the top of the basilar), anterior inferior (from the basilar trunk) and posterior inferior (from the vertebral). PICA occlusion causes Wallenberg syndrome — lateral medullary infarction: vertigo, dysphagia, and loss of pain-temperature on the same side of the face and the opposite side of the body.",
        "zh": "小脑上动脉（发自基底动脉顶端）、小脑前下动脉（发自基底动脉干）和小脑后下动脉（发自椎动脉）。小脑后下动脉闭塞导致Wallenberg综合征——延髓背外侧梗死：眩晕、吞咽困难、同侧面部及对侧躯体痛温觉丧失。"
      },
      "tint": "#b5835a",
      "parts": [
        "FJ1656",
        "FJ1656M",
        "FJ1683",
        "FJ1683M",
        "FJ1688",
        "FJ1688M",
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
        "FJ1715M",
        "FJ1726",
        "FJ1726M",
        "FJ1728",
        "FJ1728M"
      ]
    }
  ]
};
