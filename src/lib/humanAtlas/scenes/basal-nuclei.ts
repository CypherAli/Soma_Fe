/**
 * Scene "Nhân nền và bao trong" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Thân não đầy đủ" cũ (trùng nội dung với bài "Thân não"). Atlas thiếu nhân dưới đồi, chất đen.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const basalNucleiScene: AtlasSceneDef = {
  "slug": "than-nao-day-so-full",
  "title": {
    "vi": "Nhân nền và bao trong",
    "en": "The Basal Nuclei and Internal Capsule",
    "zh": "基底核与内囊"
  },
  "latin": "Nuclei basales · Capsula interna",
  "system": "nervous",
  "intro": {
    "vi": "Nhân nền là các khối chất xám nằm sâu trong bán cầu, điều hoà khởi động và dập tắt vận động. Nhân đuôi cong theo não thất bên. Nhân bèo gồm bèo sẫm ở ngoài và cầu nhạt ở trong. Nhân đuôi và bèo sẫm cùng gọi là thể vân. Bao trong là dải chất trắng hình chữ V kẹp giữa nhân đuôi, đồi thị và nhân bèo. Mọi đường vận động và cảm giác đi qua đây, nên một ổ nhồi máu nhỏ ở bao trong cũng gây liệt nửa người. Hạnh nhân nằm cuối đuôi nhân đuôi, thuộc hệ viền. Mỗi nhân một màu; não thất bên mờ sẵn.",
    "en": "The basal nuclei are deep grey masses in the hemisphere that help start and stop movement. The caudate curves along the lateral ventricle. The lentiform nucleus is the putamen outside and the globus pallidus inside. The caudate and putamen together are the striatum. The internal capsule is a V-shaped band of white matter squeezed between the caudate, thalamus and lentiform. Every motor and sensory pathway passes through it, so even a small infarct there causes hemiplegia. The amygdala sits at the tip of the caudate tail and belongs to the limbic system. Each nucleus has its own colour; the lateral ventricles are faded.",
    "zh": "基底核是大脑半球深部的灰质团块，调节运动的启动与终止。尾状核沿侧脑室弯曲；豆状核外为壳、内为苍白球；尾状核与壳合称纹状体。内囊是夹于尾状核、丘脑和豆状核之间的V形白质带，所有运动和感觉通路均经此，故内囊小梗死即可致偏瘫。杏仁体位于尾状核尾端，属边缘系统。每个核一种颜色；侧脑室淡化。"
  },
  "frameGroups": [
    "duoi",
    "beo-sam",
    "cau-nhat",
    "bao-trong",
    "doi-thi"
  ],
  "fadedGroups": [
    "nao-that"
  ],
  "groups": [
    {
      "key": "duoi",
      "name": {
        "vi": "Nhân đuôi",
        "en": "Caudate nucleus",
        "zh": "尾状核"
      },
      "latin": "Nucleus caudatus",
      "note": {
        "vi": "Đầu to lồi vào sừng trán não thất bên, thân và đuôi uốn theo não thất. Teo đầu nhân đuôi là dấu hiệu của bệnh Huntington (múa giật).",
        "en": "Its large head bulges into the frontal horn of the lateral ventricle; body and tail curve with the ventricle. Atrophy of the caudate head is the hallmark of Huntington's disease (chorea).",
        "zh": "头部膨大突入侧脑室前角，体、尾沿侧脑室弯曲。尾状核头萎缩是亨廷顿病（舞蹈病）的特征。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ1754",
        "FJ1802"
      ]
    },
    {
      "key": "beo-sam",
      "name": {
        "vi": "Bèo sẫm",
        "en": "Putamen",
        "zh": "壳"
      },
      "latin": "Putamen",
      "note": {
        "vi": "Phần ngoài của nhân bèo, cùng nhân đuôi nhận tín hiệu từ vỏ não và chất đen. Thiếu dopamin từ chất đen tới đây gây bệnh Parkinson. Đây cũng là vị trí xuất huyết não do tăng huyết áp hay gặp nhất.",
        "en": "The outer part of the lentiform nucleus; with the caudate it receives input from the cortex and substantia nigra. Loss of nigral dopamine here causes Parkinson's disease. It is also the commonest site of hypertensive haemorrhage.",
        "zh": "豆状核外侧部，与尾状核一起接受皮质和黑质的输入。黑质多巴胺缺失致帕金森病。也是高血压性脑出血最常见的部位。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1776",
        "FJ1823"
      ]
    },
    {
      "key": "cau-nhat",
      "name": {
        "vi": "Cầu nhạt",
        "en": "Globus pallidus",
        "zh": "苍白球"
      },
      "latin": "Globus pallidus",
      "note": {
        "vi": "Phần trong của nhân bèo, nhạt màu vì nhiều sợi có myelin. Đây là đầu ra chính của nhân nền, về đồi thị.",
        "en": "The inner part of the lentiform, pale from its many myelinated fibres. It is the main output of the basal nuclei, to the thalamus.",
        "zh": "豆状核内侧部，因富含有髓纤维而色淡，是基底核的主要输出核，投射至丘脑。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1757",
        "FJ1805"
      ]
    },
    {
      "key": "bao-trong",
      "name": {
        "vi": "Bao trong",
        "en": "Internal capsule",
        "zh": "内囊"
      },
      "latin": "Capsula interna",
      "note": {
        "vi": "Có trụ trước (giữa nhân đuôi và nhân bèo), gối, và trụ sau (giữa đồi thị và nhân bèo). Bó vỏ–gai đi ở trụ sau; bó vỏ–nhân đi ở gối.",
        "en": "Has an anterior limb (between caudate and lentiform), a genu, and a posterior limb (between thalamus and lentiform). The corticospinal tract runs in the posterior limb, the corticobulbar in the genu.",
        "zh": "分前肢（尾状核与豆状核之间）、膝和后肢（丘脑与豆状核之间）。皮质脊髓束行于后肢，皮质核束行于膝部。"
      },
      "tint": "#e3e0d6",
      "parts": [
        "FJ1750",
        "FJ1751"
      ]
    },
    {
      "key": "doi-thi",
      "name": {
        "vi": "Đồi thị (mốc phía trong)",
        "en": "Thalamus (medial landmark)",
        "zh": "丘脑（内侧标志）"
      },
      "latin": "Thalamus",
      "note": {
        "vi": "Không thuộc nhân nền nhưng là trạm trung chuyển của vòng nhân nền–đồi thị–vỏ não.",
        "en": "Not a basal nucleus, but the relay in the basal ganglia–thalamus–cortex loop.",
        "zh": "不属基底核，但为基底核–丘脑–皮质环路的中继站。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1782",
        "FJ1827"
      ]
    },
    {
      "key": "hanh-nhan",
      "name": {
        "vi": "Hạnh nhân",
        "en": "Amygdala",
        "zh": "杏仁体"
      },
      "latin": "Corpus amygdaloideum",
      "note": {
        "vi": "Nằm trong cực thái dương, ở cuối đuôi nhân đuôi. Xử lý sợ hãi và cảm xúc; chức năng thuộc hệ viền.",
        "en": "Lies in the temporal pole at the end of the caudate tail. It processes fear and emotion and belongs functionally to the limbic system.",
        "zh": "位于颞极内、尾状核尾端。处理恐惧和情绪，功能上属边缘系统。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1753",
        "FJ1829"
      ]
    },
    {
      "key": "nao-that",
      "name": {
        "vi": "Não thất bên (mốc)",
        "en": "Lateral ventricles (landmarks)",
        "zh": "侧脑室（标志）"
      },
      "latin": "Ventriculi laterales",
      "note": {
        "vi": "Mờ sẵn — thấy nhân đuôi uốn theo thành não thất.",
        "en": "Faded — showing the caudate following the ventricular wall.",
        "zh": "淡化——显示尾状核沿脑室壁弯曲。"
      },
      "parts": [
        "FJ1767",
        "FJ1814"
      ]
    }
  ]
};
