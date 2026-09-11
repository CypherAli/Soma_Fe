/**
 * Scene "Giải phẫu Thanh quản" dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-larynx.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const larynxScene: AtlasSceneDef = {
  "slug": "thanh-quan",
  "title": {
    "vi": "Giải phẫu Thanh quản",
    "en": "Anatomy of the Larynx",
    "zh": "喉解剖"
  },
  "latin": "Larynx",
  "intro": {
    "vi": "Thanh quản là khung sụn nối hầu với khí quản, vừa là van bảo vệ đường thở khi nuốt vừa là cơ quan phát âm. Hai dây thanh căng giữa sụn giáp (phía trước) và hai sụn phễu (phía sau); các cơ nội thanh quản xoay, trượt sụn phễu để mở, khép và căng dây thanh. Sụn tô tông vàng-xanh, cơ tô theo chức năng: đỏ mở, cam khép, tím căng.",
    "en": "The larynx is a cartilaginous framework linking the pharynx to the trachea — both a valve protecting the airway during swallowing and the organ of voice. The two vocal cords stretch between the thyroid cartilage (in front) and the two arytenoids (behind); the intrinsic muscles rotate and slide the arytenoids to open, close and tense the cords. Cartilages are in yellow-blue tones; muscles are coloured by function: red opens, orange closes, violet tenses.",
    "zh": "喉是连接咽与气管的软骨支架，既是吞咽时保护气道的阀门，又是发音器官。两条声带张于前方的甲状软骨与后方的两块杓状软骨之间；喉内肌使杓状软骨旋转、滑动，从而开大、关闭和紧张声带。软骨为黄蓝色调；肌肉按功能着色：红色开大、橙色关闭、紫色紧张。"
  },
  "groups": [
    {
      "key": "sun-giap",
      "name": {
        "vi": "Sụn giáp",
        "en": "Thyroid cartilage",
        "zh": "甲状软骨"
      },
      "latin": "Cartilago thyroidea",
      "note": {
        "vi": "Sụn lớn nhất, hai mảnh gặp nhau ở trước tạo lồi thanh quản (\"trái cổ\") — góc nhọn hơn ở nam nên lồi rõ hơn. Dây thanh bám vào mặt sau góc này.",
        "en": "The largest cartilage; its two plates meet in front to form the laryngeal prominence (\"Adam's apple\") — a sharper angle in men, so more prominent. The vocal cords attach to the back of this angle.",
        "zh": "最大的喉软骨，两块板在前方相接形成喉结——男性夹角较锐故更突出。声带附着于此角的后面。"
      },
      "tint": "#d9c27a",
      "parts": [
        "FJ2808"
      ]
    },
    {
      "key": "sun-nhan",
      "name": {
        "vi": "Sụn nhẫn",
        "en": "Cricoid cartilage",
        "zh": "环状软骨"
      },
      "latin": "Cartilago cricoidea",
      "note": {
        "vi": "Vòng sụn KÍN duy nhất của đường thở, hình nhẫn có mặt nhẫn quay ra sau. Mốc ngang C6. Màng nhẫn-giáp giữa sụn nhẫn và sụn giáp là chỗ mở khí quản cấp cứu khi không đặt được nội khí quản.",
        "en": "The only COMPLETE ring of cartilage in the airway, shaped like a signet ring with the signet behind. It marks the C6 level. The cricothyroid membrane between it and the thyroid cartilage is where an emergency airway is cut when intubation fails.",
        "zh": "气道中唯一完整的软骨环，形如印戒，戒面朝后，平C6水平。环甲膜位于其与甲状软骨之间，插管失败时可在此行紧急环甲膜切开。"
      },
      "tint": "#8fb3c9",
      "parts": [
        "FJ2440",
        "FJ2789"
      ]
    },
    {
      "key": "nap-thanh-mon",
      "name": {
        "vi": "Nắp thanh môn",
        "en": "Epiglottis",
        "zh": "会厌"
      },
      "latin": "Epiglottis",
      "note": {
        "vi": "Sụn chun hình lá, gập xuống che lối vào thanh quản khi nuốt. Viêm nắp thanh môn ở trẻ gây sưng nhanh tắc thở — không được đè lưỡi khám họng.",
        "en": "A leaf-shaped elastic cartilage that folds down over the laryngeal inlet during swallowing. Epiglottitis in children swells fast and obstructs the airway — never press the tongue down to examine the throat.",
        "zh": "叶状弹性软骨，吞咽时向下覆盖喉口。儿童会厌炎肿胀迅速可阻塞气道——切勿用压舌板检查咽部。"
      },
      "tint": "#b5c77a",
      "parts": [
        "FJ2770",
        "FJ2771",
        "FJ2807"
      ]
    },
    {
      "key": "sun-pheu",
      "name": {
        "vi": "Sụn phễu, sụn sừng, sụn chêm",
        "en": "Arytenoid, corniculate and cuneiform cartilages",
        "zh": "杓状、小角、楔状软骨"
      },
      "latin": "Cartilagines arytenoideae, corniculatae, cuneiformes",
      "note": {
        "vi": "Đôi sụn phễu ngồi trên bờ sau sụn nhẫn, là \"bản lề\" của dây thanh: mỏm thanh âm nhận dây thanh, mỏm cơ nhận các cơ. Đặt nội khí quản thô bạo có thể làm trật sụn phễu gây khàn tiếng kéo dài.",
        "en": "The paired arytenoids sit on the back rim of the cricoid and act as the \"hinges\" of the vocal cords: the vocal process takes the cord, the muscular process the muscles. Rough intubation can dislocate an arytenoid and leave lasting hoarseness.",
        "zh": "成对的杓状软骨坐于环状软骨后缘，是声带的“铰链”：声带突连声带，肌突连喉肌。粗暴插管可致杓状软骨脱位，引起持续声嘶。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ2773",
        "FJ2775",
        "FJ2776",
        "FJ2792",
        "FJ2793",
        "FJ2795"
      ]
    },
    {
      "key": "day-thanh",
      "name": {
        "vi": "Dây thanh và nón đàn hồi",
        "en": "Vocal ligaments and conus elasticus",
        "zh": "声韧带与弹性圆锥"
      },
      "latin": "Lig. vocale · Conus elasticus",
      "note": {
        "vi": "Dây chằng thanh âm là bờ trên tự do của nón đàn hồi, căng từ sụn giáp đến sụn phễu. Khe giữa hai dây thanh (thanh môn) là chỗ hẹp nhất đường thở người lớn — dị vật hay kẹt ở đây.",
        "en": "The vocal ligament is the free upper edge of the conus elasticus, stretched from the thyroid cartilage to the arytenoid. The gap between the two cords (the rima glottidis) is the narrowest point of the adult airway — where foreign bodies lodge.",
        "zh": "声韧带是弹性圆锥的游离上缘，自甲状软骨张至杓状软骨。两声带之间的裂隙（声门裂）是成人气道最狭窄处——异物常嵌顿于此。"
      },
      "tint": "#e8e0c0",
      "parts": [
        "FJ2777",
        "FJ2787",
        "FJ2794",
        "FJ2805"
      ]
    },
    {
      "key": "co-mo",
      "name": {
        "vi": "Cơ mở dây thanh (nhẫn-phễu sau)",
        "en": "Abductor: posterior crico-arytenoid",
        "zh": "外展肌：环杓后肌"
      },
      "latin": "M. cricoarytenoideus posterior",
      "note": {
        "vi": "Cơ DUY NHẤT mở thanh môn — xoay mỏm thanh âm ra ngoài. Liệt cả hai bên (tổn thương hai dây quặt ngược, ví dụ sau mổ tuyến giáp) làm hai dây thanh đứng giữa, gây khó thở rít cấp cứu.",
        "en": "The ONLY muscle that opens the glottis — it rotates the vocal processes outward. Bilateral paralysis (both recurrent laryngeal nerves injured, e.g. after thyroid surgery) leaves both cords in the midline and causes emergency stridor.",
        "zh": "唯一开大声门的肌肉——使声带突向外旋转。双侧麻痹（如甲状腺术后双侧喉返神经损伤）使两侧声带居中，导致需紧急处理的喉鸣和呼吸困难。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2782",
        "FJ2800"
      ]
    },
    {
      "key": "co-khep",
      "name": {
        "vi": "Cơ khép thanh môn",
        "en": "Adductors of the glottis",
        "zh": "声门内收肌"
      },
      "latin": "Mm. cricoarytenoideus lateralis, arytenoidei, aryepiglotticus",
      "note": {
        "vi": "Nhẫn-phễu bên, phễu ngang, phễu chéo và phễu-nắp thanh môn kéo hai sụn phễu lại gần, đóng thanh môn khi nói, ho, nuốt. Tất cả do dây quặt ngược chi phối.",
        "en": "The lateral crico-arytenoid, transverse and oblique arytenoids and aryepiglotticus draw the arytenoids together, closing the glottis for speech, coughing and swallowing. All are supplied by the recurrent laryngeal nerve.",
        "zh": "环杓侧肌、杓横肌、杓斜肌及杓会厌肌使两杓状软骨靠拢，在发音、咳嗽、吞咽时关闭声门。均受喉返神经支配。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2774",
        "FJ2778",
        "FJ2780",
        "FJ2791",
        "FJ2796",
        "FJ2798",
        "FJ2809"
      ]
    },
    {
      "key": "co-cang",
      "name": {
        "vi": "Cơ căng và chỉnh dây thanh",
        "en": "Tensors of the vocal cords",
        "zh": "声带紧张肌"
      },
      "latin": "Mm. cricothyroideus, thyroarytenoideus, vocalis",
      "note": {
        "vi": "Cơ nhẫn-giáp nghiêng sụn giáp ra trước làm căng dây thanh, nâng giọng cao — cơ duy nhất do dây thanh quản TRÊN (nhánh ngoài) chi phối; tổn thương gây giọng yếu, mất âm cao. Cơ giáp-phễu và cơ thanh âm (nằm trong dây thanh) chỉnh độ căng tinh tế.",
        "en": "Cricothyroid tilts the thyroid cartilage forward to tense the cords and raise pitch — the only muscle supplied by the SUPERIOR laryngeal nerve (external branch); injury gives a weak voice that cannot reach high notes. Thyro-arytenoid and vocalis (inside the cord) fine-tune the tension.",
        "zh": "环甲肌使甲状软骨前倾以紧张声带、提高音调——唯一由喉上神经（外支）支配的喉肌；损伤致声音无力、不能发高音。甲杓肌和声带肌（位于声带内）精细调节张力。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ2781",
        "FJ2783",
        "FJ2784",
        "FJ2785",
        "FJ2788",
        "FJ2799",
        "FJ2801",
        "FJ2802",
        "FJ2803",
        "FJ2806"
      ]
    },
    {
      "key": "xuong-mong-mang",
      "name": {
        "vi": "Xương móng và màng giáp-móng",
        "en": "Hyoid bone and thyrohyoid membrane",
        "zh": "舌骨与甲状舌骨膜"
      },
      "latin": "Os hyoideum · Membrana thyrohyoidea",
      "note": {
        "vi": "Thanh quản treo vào xương móng qua màng giáp-móng — nên thanh quản nhô lên khi nuốt. Bó mạch thanh quản trên và nhánh trong dây thanh quản trên xuyên qua màng này.",
        "en": "The larynx hangs from the hyoid by the thyrohyoid membrane — which is why it rises when you swallow. The superior laryngeal vessels and the internal branch of the superior laryngeal nerve pierce this membrane.",
        "zh": "喉借甲状舌骨膜悬挂于舌骨——故吞咽时喉上提。喉上血管和喉上神经内支穿过此膜。"
      },
      "tint": "#b0a27a",
      "parts": [
        "FJ2772",
        "FJ2779",
        "FJ2786",
        "FJ2790",
        "FJ2797",
        "FJ2804"
      ]
    }
  ]
};
