/**
 * Scene "Cây động mạch chi trên" (bên trái) dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-arm-arteries.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const armArteriesScene: AtlasSceneDef = {
  "slug": "dong-mach-chi-tren",
  "title": {
    "vi": "Cây động mạch chi trên",
    "en": "Arteries of the Upper Limb",
    "zh": "上肢动脉"
  },
  "latin": "Arteriae membri superioris",
  "intro": {
    "vi": "Một thân động mạch duy nhất đổi tên theo mốc xương: dưới đòn → nách (qua bờ ngoài xương sườn I) → cánh tay (qua bờ dưới cơ tròn lớn) → chia quay và trụ ở hố khuỷu → hai cung gan tay → động mạch ngón. Quanh khuỷu và vai có vòng nối nhánh bên–nhánh quặt ngược, nên thắt một đoạn không làm hoại tử chi. Mỗi đoạn một màu; xương để làm mốc.",
    "en": "A single arterial trunk changes its name at bony landmarks: subclavian → axillary (at the outer border of rib I) → brachial (at the lower border of teres major) → radial and ulnar at the cubital fossa → the two palmar arches → digital arteries. Around the shoulder and elbow, collateral and recurrent branches form anastomoses, so tying off one segment does not kill the limb. Each segment has its own colour; the bones are shown as landmarks.",
    "zh": "一条动脉主干按骨性标志更名：锁骨下动脉→腋动脉（第一肋外缘）→肱动脉（大圆肌下缘）→于肘窝分为桡动脉和尺动脉→两个掌弓→指动脉。肩、肘周围有侧副支与返支吻合，结扎某一段不致肢体坏死。各段以不同颜色显示；骨骼作为定位标志。"
  },
  "frameGroups": [
    "dm-duoi-don",
    "dm-nach",
    "dm-canh-tay",
    "dm-quay",
    "dm-tru",
    "cung-gan-tay",
    "dm-ngon"
  ],
  "fadedGroups": [
    "xuong-moc"
  ],
  "groups": [
    {
      "key": "dm-duoi-don",
      "name": {
        "vi": "Động mạch dưới đòn và nhánh",
        "en": "Subclavian artery and branches",
        "zh": "锁骨下动脉及分支"
      },
      "latin": "A. subclavia",
      "note": {
        "vi": "Bên trái tách thẳng từ cung động mạch chủ. Cho động mạch đốt sống, ngực trong, thân giáp-cổ và thân sườn-cổ. Hẹp đoạn đầu động mạch dưới đòn làm máu bị \"hút\" ngược từ động mạch đốt sống xuống tay khi vận động tay (hội chứng trộm máu dưới đòn) — chóng mặt khi giơ tay.",
        "en": "On the left it arises directly from the aortic arch. It gives the vertebral, internal thoracic, thyrocervical and costocervical branches. A stenosis at its origin lets the arm \"steal\" blood backwards down the vertebral artery during arm exercise (subclavian steal) — dizziness when using the arm.",
        "zh": "左侧直接发自主动脉弓，发出椎动脉、胸廓内动脉、甲状颈干和肋颈干。其起始段狭窄时，上肢运动会经椎动脉逆向“窃取”脑血（锁骨下动脉窃血综合征）——活动上肢时头晕。"
      },
      "tint": "#8f2f3a",
      "parts": [
        "FJ1972",
        "FJ2224",
        "FJ2232",
        "FJ2251",
        "FJ2255",
        "FJ2256",
        "FJ2257",
        "FJ3479"
      ]
    },
    {
      "key": "dm-nach",
      "name": {
        "vi": "Động mạch nách và nhánh",
        "en": "Axillary artery and branches",
        "zh": "腋动脉及分支"
      },
      "latin": "A. axillaris",
      "note": {
        "vi": "Từ bờ ngoài xương sườn I đến bờ dưới cơ tròn lớn, chia ba đoạn bởi cơ ngực bé. Cho thân cùng vai-ngực, ngực ngoài, dưới vai (với ngực lưng, mũ vai) và hai động mạch mũ cánh tay ôm cổ phẫu thuật — gãy cổ xương cánh tay có thể làm tổn thương mũ cánh tay sau cùng thần kinh nách.",
        "en": "From the outer border of rib I to the lower border of teres major, divided into three parts by pectoralis minor. It gives the thoraco-acromial trunk, lateral thoracic, subscapular (with thoracodorsal and circumflex scapular) and the two circumflex humeral arteries hugging the surgical neck — a surgical-neck fracture can injure the posterior circumflex humeral with the axillary nerve.",
        "zh": "自第一肋外缘至大圆肌下缘，被胸小肌分为三段。发出胸肩峰干、胸外侧动脉、肩胛下动脉（含胸背动脉、旋肩胛动脉）及环绕外科颈的两条旋肱动脉——肱骨外科颈骨折可伤及旋肱后动脉及腋神经。"
      },
      "tint": "#b8434f",
      "parts": [
        "FJ1976",
        "FJ2211",
        "FJ2212",
        "FJ2216",
        "FJ2221",
        "FJ2230",
        "FJ2239",
        "FJ2240",
        "FJ2246",
        "FJ2252",
        "FJ2253",
        "FJ2330"
      ]
    },
    {
      "key": "dm-canh-tay",
      "name": {
        "vi": "Động mạch cánh tay và nhánh bên",
        "en": "Brachial artery and collaterals",
        "zh": "肱动脉及侧副支"
      },
      "latin": "A. brachialis",
      "note": {
        "vi": "Chạy ở mặt trong cánh tay cạnh thần kinh giữa — chỗ đặt ống nghe khi đo huyết áp ở nếp khuỷu. Động mạch cánh tay sâu đi cùng thần kinh quay trong rãnh xoắn; các nhánh bên trụ trên/dưới nối với nhánh quặt ngược ở khuỷu. Gãy trên lồi cầu ở trẻ có thể kẹt động mạch này gây co rút thiếu máu Volkmann.",
        "en": "Runs down the medial arm beside the median nerve — where the stethoscope goes at the elbow crease for blood pressure. The deep brachial artery travels with the radial nerve in the spiral groove; the superior/inferior ulnar collaterals join recurrent branches at the elbow. A supracondylar fracture in a child can trap this artery and cause Volkmann's ischaemic contracture.",
        "zh": "沿上臂内侧与正中神经伴行——测血压时听诊器置于肘窝处。肱深动脉与桡神经同行于桡神经沟；尺侧上、下副动脉在肘部与返支吻合。儿童肱骨髁上骨折可卡压此动脉，导致Volkmann缺血性挛缩。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2215",
        "FJ2219",
        "FJ2225",
        "FJ2261",
        "FJ2331",
        "FJ2374"
      ]
    },
    {
      "key": "dm-quay",
      "name": {
        "vi": "Động mạch quay",
        "en": "Radial artery",
        "zh": "桡动脉"
      },
      "latin": "A. radialis",
      "note": {
        "vi": "Chạy phía ngón cái, nông ngay trên đầu dưới xương quay — nơi bắt mạch và lấy máu động mạch. Vòng ra mu tay qua hõm lào rồi xuyên vào gan tay tạo cung gan tay SÂU. Làm nghiệm pháp Allen trước khi chọc để chắc động mạch trụ đủ nuôi bàn tay.",
        "en": "Runs on the thumb side, superficial over the distal radius — where the pulse is felt and arterial blood is drawn. It crosses the anatomical snuffbox to the back of the hand, then pierces into the palm to form the DEEP palmar arch. Do an Allen test before puncture to make sure the ulnar artery can supply the hand.",
        "zh": "走行于拇指侧，在桡骨远端浅表处——即诊脉和采动脉血的部位。经鼻烟窝转至手背，再穿入手掌形成掌深弓。穿刺前应做Allen试验，确认尺动脉足以供应手部。"
      },
      "tint": "#e07a6a",
      "parts": [
        "FJ2231",
        "FJ2242",
        "FJ2243"
      ]
    },
    {
      "key": "dm-tru",
      "name": {
        "vi": "Động mạch trụ và gian cốt",
        "en": "Ulnar and interosseous arteries",
        "zh": "尺动脉与骨间动脉"
      },
      "latin": "A. ulnaris",
      "note": {
        "vi": "Nhánh lớn hơn trong hai nhánh tận, chạy phía ngón út cùng thần kinh trụ, qua ống Guyon vào gan tay tạo cung gan tay NÔNG. Động mạch gian cốt chung tách sớm, chia gian cốt trước và sau nuôi các cơ sâu cẳng tay.",
        "en": "The larger of the two terminal branches, running on the little-finger side with the ulnar nerve and through Guyon's canal to form the SUPERFICIAL palmar arch. The common interosseous artery branches off early and divides into anterior and posterior interosseous arteries for the deep forearm muscles.",
        "zh": "两条终支中较粗者，与尺神经伴行于小指侧，经Guyon管入掌形成掌浅弓。骨间总动脉早期发出，分为骨间前、后动脉，供应前臂深层肌。"
      },
      "tint": "#d0685a",
      "parts": [
        "FJ2214",
        "FJ2223",
        "FJ2236",
        "FJ2241",
        "FJ2245",
        "FJ2258",
        "FJ2259"
      ]
    },
    {
      "key": "cung-gan-tay",
      "name": {
        "vi": "Hai cung động mạch gan tay",
        "en": "Palmar arterial arches",
        "zh": "掌动脉弓"
      },
      "latin": "Arcus palmaris superficialis et profundus",
      "note": {
        "vi": "Cung nông (chủ yếu từ động mạch trụ) nằm ngang nếp gan tay giữa, ngay dưới cân gan tay — vết cắt sâu ở lòng bàn tay dễ chạm nó. Cung sâu (chủ yếu từ động mạch quay) nằm sâu hơn khoảng 1cm, sát nền xương đốt bàn.",
        "en": "The superficial arch (mainly ulnar) lies at the level of the mid-palmar crease just under the palmar aponeurosis — a deep palm laceration easily reaches it. The deep arch (mainly radial) lies about 1cm deeper, against the bases of the metacarpals.",
        "zh": "掌浅弓（主要来自尺动脉）平掌中横纹，位于掌腱膜深面——手掌深部切割伤易伤及。掌深弓（主要来自桡动脉）约深1cm，贴近掌骨底。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ2227",
        "FJ2237",
        "FJ2248",
        "FJ2348"
      ]
    },
    {
      "key": "dm-ngon",
      "name": {
        "vi": "Động mạch ngón tay",
        "en": "Digital arteries",
        "zh": "指动脉"
      },
      "latin": "Aa. digitales palmares",
      "note": {
        "vi": "Mỗi ngón có hai động mạch gan ngón riêng chạy dọc hai bên, cùng dây thần kinh ngón. Gây tê gốc ngón (phong bế Oberst) tiêm hai bên gốc ngón; tránh thuốc co mạch thể tích lớn vì đây là động mạch tận.",
        "en": "Each digit has two proper palmar digital arteries running along its sides with the digital nerves. A ring (Oberst) block injects on both sides of the finger base; avoid large volumes with vasoconstrictor because these are end arteries.",
        "zh": "每指两侧各有一条指掌侧固有动脉，与指神经伴行。指根阻滞（Oberst阻滞）在指根两侧注射；因属终末动脉，应避免大容量含血管收缩剂的药物。"
      },
      "tint": "#f0b46a",
      "parts": [
        "FJ2314",
        "FJ2315",
        "FJ2316",
        "FJ2317",
        "FJ2318",
        "FJ2332",
        "FJ2333",
        "FJ2334",
        "FJ2335",
        "FJ2336",
        "FJ2337",
        "FJ2338",
        "FJ2339"
      ]
    },
    {
      "key": "xuong-moc",
      "name": {
        "vi": "Xương chi trên (mốc)",
        "en": "Upper limb bones (landmarks)",
        "zh": "上肢骨（标志）"
      },
      "latin": "Ossa membri superioris",
      "note": {
        "vi": "Chỉ để định vị: xương sườn I, xương đòn, xương cánh tay, quay, trụ và bàn tay. Bấm Làm mờ nhóm này để nhìn rõ đường đi của mạch.",
        "en": "Landmarks only: rib I, clavicle, humerus, radius, ulna and the hand. Fade this group to follow the vessels clearly.",
        "zh": "仅作定位：第一肋、锁骨、肱骨、桡骨、尺骨及手骨。淡化此组可更清楚地观察血管走行。"
      },
      "parts": [
        "FJ3183",
        "FJ3184",
        "FJ3186",
        "FJ3187",
        "FJ3188",
        "FJ3228",
        "FJ3237",
        "FJ3240",
        "FJ3243",
        "FJ3246",
        "FJ3249",
        "FJ3252",
        "FJ3257",
        "FJ3261",
        "FJ3262",
        "FJ3268",
        "FJ3276",
        "FJ3277",
        "FJ3278",
        "FJ3283",
        "FJ3284",
        "FJ3285",
        "FJ3286",
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
};
