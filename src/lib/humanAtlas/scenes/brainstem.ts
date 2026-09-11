/**
 * Scene "Thân não" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu các dây thần kinh sọ III–XII (chỉ có dây II, IV và nhánh dây III trong hốc mắt).
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const brainstemScene: AtlasSceneDef = {
  "slug": "than-nao-day-so",
  "title": {
    "vi": "Thân não: trung não, cầu não, hành não",
    "en": "The Brainstem: Midbrain, Pons, Medulla",
    "zh": "脑干：中脑、脑桥、延髓"
  },
  "latin": "Truncus encephali",
  "intro": {
    "vi": "Thân não dài chỉ khoảng 7cm, nối đại não với tuỷ sống, gồm trung não, cầu não và hành não. Mọi đường vận động và cảm giác đi qua đây. Thân não chứa nhân các dây sọ III–XII, trung tâm hô hấp, tim mạch và hệ lưới giữ tỉnh táo. Vì thế một ổ tổn thương nhỏ ở thân não cũng có thể gây hôn mê hoặc tử vong. Mặt sau trung não có bốn củ não sinh tư (hai trên cho thị giác, hai dưới cho thính giác). Cống não đi qua trung não, nối não thất ba với não thất bốn. Mỗi tầng một màu; tiểu não và động mạch thân nền mờ sẵn. Bộ dữ liệu không có các dây thần kinh sọ bám thân não.",
    "en": "The brainstem is only about 7cm long and links cerebrum to spinal cord; it comprises midbrain, pons and medulla. Every motor and sensory pathway passes through it. It holds the nuclei of cranial nerves III–XII, the respiratory and cardiovascular centres and the reticular activating system that keeps us awake. So a small lesion here can cause coma or death. On the back of the midbrain are the four colliculi (the superior pair for vision, the inferior pair for hearing). The cerebral aqueduct runs through the midbrain, joining the third and fourth ventricles. Each level has its own colour; the cerebellum and basilar artery are faded. The dataset has no cranial nerve roots on the brainstem.",
    "zh": "脑干长约7cm，连接大脑与脊髓，由中脑、脑桥和延髓组成。所有运动和感觉通路均经此。脑干含第III–XII对脑神经核、呼吸与心血管中枢及维持清醒的网状激活系统，故小病灶即可致昏迷或死亡。中脑背面有四个丘（上丘司视觉，下丘司听觉）。中脑水管贯穿中脑，连接第三、第四脑室。每层一种颜色；小脑和基底动脉淡化。数据集中无附着于脑干的脑神经。"
  },
  "frameGroups": [
    "trung-nao",
    "cau",
    "hanh"
  ],
  "fadedGroups": [
    "tieu-nao",
    "than-nen"
  ],
  "groups": [
    {
      "key": "trung-nao",
      "name": {
        "vi": "Trung não và cuống đại não",
        "en": "Midbrain and cerebral peduncles",
        "zh": "中脑与大脑脚"
      },
      "latin": "Mesencephalon · Pedunculi cerebri · Fossa interpeduncularis",
      "note": {
        "vi": "Cuống đại não mang bó vỏ–gai xuống. Dây III thoát ra ở hố gian cuống. Thoát vị móc hải mã đè vào cuống và dây III, gây giãn đồng tử cùng bên, là dấu hiệu nguy hiểm trong chấn thương sọ não.",
        "en": "The peduncles carry the corticospinal tracts down. Nerve III emerges in the interpeduncular fossa. Uncal herniation presses on the peduncle and nerve III, dilating the pupil on the same side — a danger sign in head injury.",
        "zh": "大脑脚内有皮质脊髓束下行。动眼神经自脚间窝穿出。钩回疝压迫大脑脚和动眼神经致同侧瞳孔散大，是颅脑外伤的危险征象。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1763",
        "FJ1770",
        "FJ1774",
        "FJ1817",
        "FJ1821"
      ]
    },
    {
      "key": "cu",
      "name": {
        "vi": "Củ não sinh tư và cánh tay củ",
        "en": "Colliculi and their brachia",
        "zh": "上丘、下丘及其臂"
      },
      "latin": "Colliculi superiores et inferiores · Brachia",
      "note": {
        "vi": "Củ trên điều khiển phản xạ nhìn, nối với thể gối ngoài qua cánh tay củ trên. Củ dưới là trạm thính giác, nối với thể gối trong qua cánh tay củ dưới.",
        "en": "The superior colliculi drive visual reflexes and connect to the lateral geniculate body by the superior brachium. The inferior colliculi are an auditory relay, connected to the medial geniculate body by the inferior brachium.",
        "zh": "上丘司视觉反射，借上丘臂连外侧膝状体；下丘为听觉中继，借下丘臂连内侧膝状体。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1735",
        "FJ1736",
        "FJ1761",
        "FJ1762",
        "FJ1766",
        "FJ1779",
        "FJ1809",
        "FJ1810",
        "FJ1813",
        "FJ1816",
        "FJ1816M",
        "FJ1826"
      ]
    },
    {
      "key": "cau",
      "name": {
        "vi": "Cầu não",
        "en": "Pons",
        "zh": "脑桥"
      },
      "latin": "Pons",
      "note": {
        "vi": "Phần bụng phình to chứa nhân cầu, chuyển tín hiệu từ vỏ não sang tiểu não. Chứa nhân dây V–VIII. Xuất huyết cầu não gây đồng tử co nhỏ như đầu kim và hôn mê sâu.",
        "en": "Its bulging ventral part holds the pontine nuclei, relaying cortex to cerebellum. It houses the nuclei of nerves V–VIII. A pontine haemorrhage gives pinpoint pupils and deep coma.",
        "zh": "膨大的腹侧部含脑桥核，将皮质信息传至小脑；含第V–VIII对脑神经核。脑桥出血致针尖样瞳孔和深昏迷。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1775",
        "FJ1822"
      ]
    },
    {
      "key": "hanh",
      "name": {
        "vi": "Hành não",
        "en": "Medulla oblongata",
        "zh": "延髓"
      },
      "latin": "Medulla oblongata",
      "note": {
        "vi": "Có tháp hành, nơi bó vỏ–gai bắt chéo sang bên đối diện. Chứa trung tâm hô hấp, tim mạch và nhân dây IX–XII. Tụt kẹt hạnh nhân tiểu não chèn hành não gây ngừng thở.",
        "en": "Carries the pyramids, where the corticospinal tracts cross. It holds the respiratory and cardiovascular centres and the nuclei of nerves IX–XII. Tonsillar herniation compressing the medulla stops breathing.",
        "zh": "有锥体，皮质脊髓束在此交叉。含呼吸、心血管中枢和第IX–XII对脑神经核。小脑扁桃体疝压迫延髓致呼吸停止。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1769",
        "FJ1831"
      ]
    },
    {
      "key": "cong",
      "name": {
        "vi": "Cống não, não thất bốn, ống trung tâm",
        "en": "Cerebral aqueduct, fourth ventricle, central canal",
        "zh": "中脑水管、第四脑室、中央管"
      },
      "latin": "Aqueductus cerebri · Ventriculus quartus · Canalis centralis",
      "note": {
        "vi": "Cống não hẹp nhất trong hệ não thất. Hẹp cống bẩm sinh là nguyên nhân hay gặp của não úng thuỷ ở trẻ.",
        "en": "The aqueduct is the narrowest point of the ventricular system; congenital aqueductal stenosis is a common cause of hydrocephalus in infants.",
        "zh": "中脑水管是脑室系统最狭窄处，先天性水管狭窄是婴儿脑积水的常见原因。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ1731",
        "FJ1737",
        "FJ1738"
      ]
    },
    {
      "key": "tieu-nao",
      "name": {
        "vi": "Tiểu não (mốc)",
        "en": "Cerebellum (landmark)",
        "zh": "小脑（标志）"
      },
      "latin": "Cerebellum",
      "note": {
        "vi": "Mờ sẵn — nằm sau cầu não và hành não, làm mái não thất bốn.",
        "en": "Faded — lies behind the pons and medulla and roofs the fourth ventricle.",
        "zh": "淡化——位于脑桥和延髓后方，构成第四脑室顶。"
      },
      "parts": [
        "FJ1781",
        "FJ1830"
      ]
    },
    {
      "key": "than-nen",
      "name": {
        "vi": "Động mạch thân nền và đốt sống (mốc)",
        "en": "Basilar and vertebral arteries (landmarks)",
        "zh": "基底动脉与椎动脉（标志）"
      },
      "latin": "A. basilaris · Aa. vertebrales",
      "note": {
        "vi": "Mờ sẵn — nuôi toàn bộ thân não.",
        "en": "Faded — they supply the whole brainstem.",
        "zh": "淡化——供应整个脑干。"
      },
      "tint": "#d99a8f",
      "parts": [
        "FJ1672",
        "FJ1725",
        "FJ1725M"
      ]
    }
  ]
};
