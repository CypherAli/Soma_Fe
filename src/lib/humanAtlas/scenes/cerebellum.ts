
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Tiểu não" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas có một lưới tiểu não cho mỗi bên (không tách thuỳ, nhộng, nhân răng, cuống tiểu não).
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const cerebellumScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/cerebellum.ts#cerebellumScene", {
  "slug": "tieu-nao",
  "title": {
    "vi": "Tiểu não và liên quan",
    "en": "The Cerebellum and its Relations",
    "zh": "小脑及其毗邻"
  },
  "latin": "Cerebellum",
  "intro": {
    "vi": "Tiểu não nằm trong hố sọ sau, dưới lều tiểu não, sau cầu não và hành não. Nó chỉ nặng khoảng 10% khối lượng não nhưng chứa hơn một nửa số neuron. Tiểu não không khởi động vận động mà so sánh ý định với thực hiện, rồi chỉnh cho mượt và chính xác. Tổn thương tiểu não gây mất điều hoà cùng bên: đi loạng choạng, run khi với đồ, nói ngắt quãng. Scene cho thấy tiểu não, lều tiểu não, não thất bốn mà nó làm mái, thân não phía trước và ba đôi động mạch nuôi. Bộ dữ liệu không tách thuỳ, nhộng và nhân tiểu não.",
    "en": "The cerebellum sits in the posterior cranial fossa, under the tentorium, behind the pons and medulla. It is only about 10% of brain mass but holds more than half its neurons. It does not start movement; it compares intention with performance and smooths and corrects it. Cerebellar damage causes ataxia on the same side: a staggering gait, tremor on reaching, broken speech. The scene shows the cerebellum, the tentorium, the fourth ventricle it roofs, the brainstem in front and the three pairs of arteries that feed it. The dataset does not separate lobes, vermis or cerebellar nuclei.",
    "zh": "小脑位于颅后窝、小脑幕下、脑桥和延髓后方。其重量仅占脑的约10%，却含一半以上的神经元。小脑不启动运动，而是比较意图与执行并加以平滑校正。小脑损伤致同侧共济失调：步态蹒跚、意向性震颤、言语断续。本场景显示小脑、小脑幕、其构成顶部的第四脑室、前方的脑干及三对供血动脉。数据集中未分出小脑叶、蚓部和小脑核。"
  },
  "frameGroups": [
    "tieu-nao",
    "leu",
    "mach"
  ],
  "fadedGroups": [
    "than-nao"
  ],
  "groups": [
    {
      "key": "tieu-nao",
      "name": {
        "vi": "Tiểu não (hai bán cầu)",
        "en": "Cerebellum (two hemispheres)",
        "zh": "小脑（两半球）"
      },
      "latin": "Cerebellum",
      "note": {
        "vi": "Nhộng ở giữa điều hoà thăng bằng thân mình; bán cầu ở hai bên điều hoà vận động chi cùng bên. Hạnh nhân tiểu não có thể tụt qua lỗ lớn khi tăng áp lực nội sọ.",
        "en": "The midline vermis governs trunk balance; the hemispheres coordinate the limbs on the same side. The cerebellar tonsils can herniate through the foramen magnum when intracranial pressure rises.",
        "zh": "中线蚓部调节躯干平衡；两侧半球协调同侧肢体。颅内压增高时小脑扁桃体可疝入枕骨大孔。"
      },
      "tint": "#c98bb0",
      "parts": [
        "FJ1781",
        "FJ1830"
      ]
    },
    {
      "key": "leu",
      "name": {
        "vi": "Lều tiểu não",
        "en": "Tentorium cerebelli",
        "zh": "小脑幕"
      },
      "latin": "Tentorium cerebelli",
      "note": {
        "vi": "Nếp màng cứng như mái lều, ngăn đại não với tiểu não. Khuyết lều ở phía trước cho thân não đi qua; móc hải mã có thể tụt qua khuyết này.",
        "en": "A tent-like fold of dura separating cerebrum from cerebellum. The tentorial notch in front lets the brainstem through; the uncus can herniate through it.",
        "zh": "帐篷状硬脑膜皱襞，分隔大脑与小脑。前方的幕切迹供脑干通过，钩回可经此疝出。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1843"
      ]
    },
    {
      "key": "nao-that",
      "name": {
        "vi": "Não thất bốn",
        "en": "Fourth ventricle",
        "zh": "第四脑室"
      },
      "latin": "Ventriculus quartus",
      "note": {
        "vi": "Nằm giữa tiểu não ở sau và cầu–hành ở trước. U tiểu não ở trẻ em (u nguyên bào tuỷ) hay chèn não thất này, gây não úng thuỷ.",
        "en": "Lies between the cerebellum behind and the pons and medulla in front. Childhood cerebellar tumours (medulloblastoma) often block it and cause hydrocephalus.",
        "zh": "位于后方小脑与前方脑桥、延髓之间。儿童小脑肿瘤（髓母细胞瘤）常压迫之致脑积水。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ1731"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Ba đôi động mạch tiểu não",
        "en": "The three pairs of cerebellar arteries",
        "zh": "三对小脑动脉"
      },
      "latin": "Aa. cerebelli superior, inferior anterior, inferior posterior",
      "note": {
        "vi": "Tiểu não trên (mặt trên), tiểu não trước dưới (mặt trước dưới) và tiểu não sau dưới (mặt sau dưới). Chi tiết hơn ở bài hệ đốt sống–thân nền.",
        "en": "Superior (upper surface), anterior inferior (front of the underside) and posterior inferior (back of the underside). See the vertebrobasilar scene for detail.",
        "zh": "小脑上动脉（上面）、小脑下前动脉（下面前部）和小脑下后动脉（下面后部）。详见椎基底动脉系场景。"
      },
      "tint": "#c05245",
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
    },
    {
      "key": "than-nao",
      "name": {
        "vi": "Thân não (mốc)",
        "en": "Brainstem (landmark)",
        "zh": "脑干（标志）"
      },
      "latin": "Truncus encephali",
      "note": {
        "vi": "Mờ sẵn — tiểu não nối với thân não qua ba đôi cuống tiểu não (không có trong bộ dữ liệu).",
        "en": "Faded — the cerebellum joins the brainstem by three pairs of peduncles (not in the dataset).",
        "zh": "淡化——小脑借三对小脑脚与脑干相连（数据集中无）。"
      },
      "parts": [
        "FJ1769",
        "FJ1770",
        "FJ1775",
        "FJ1817",
        "FJ1822",
        "FJ1831"
      ]
    }
  ]
});
