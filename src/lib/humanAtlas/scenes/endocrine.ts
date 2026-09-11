/**
 * Scene "Hệ nội tiết" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas KHÔNG có tuyến giáp và cận giáp — nói rõ trong intro, không thay bằng cấu trúc khác.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const endocrineScene: AtlasSceneDef = {
  "slug": "he-noi-tiet",
  "title": {
    "vi": "Các tuyến nội tiết",
    "en": "The Endocrine Glands",
    "zh": "内分泌腺"
  },
  "latin": "Glandulae endocrinae",
  "intro": {
    "vi": "Tuyến nội tiết đổ hormon thẳng vào máu, không qua ống dẫn. Chúng nằm rải khắp cơ thể. Vùng dưới đồi và tuyến yên ở nền não điều khiển các tuyến khác qua trục hạ đồi–tuyến yên. Tuyến tùng tiết melatonin theo nhịp ngày đêm. Tuyến ức nuôi lympho T, rất lớn ở trẻ em rồi teo dần. Tuyến thượng thận úp trên hai thận, tiết cortisol, aldosteron và adrenalin. Tuỵ nội tiết (đảo Langerhans) tiết insulin và glucagon. Tinh hoàn tiết testosteron. Bộ dữ liệu không có tuyến giáp và cận giáp. Scene có ít mảnh vì các tuyến nhỏ và xa nhau; mỗi tuyến một màu.",
    "en": "Endocrine glands release hormones straight into the blood, without ducts, and are scattered through the body. The hypothalamus and pituitary at the base of the brain control the others through the hypothalamic–pituitary axis. The pineal releases melatonin on a day–night rhythm. The thymus trains T lymphocytes; it is large in childhood and then shrinks. The adrenals sit on the kidneys and release cortisol, aldosterone and adrenaline. The endocrine pancreas (islets of Langerhans) releases insulin and glucagon. The testes release testosterone. The dataset has no thyroid or parathyroid glands. The scene has few pieces because the glands are small and far apart; each gland has its own colour.",
    "zh": "内分泌腺将激素直接释放入血，无导管，散布全身。脑底的下丘脑和垂体经下丘脑–垂体轴调控其他腺体。松果体按昼夜节律分泌褪黑素。胸腺培育T淋巴细胞，儿童期很大，此后逐渐萎缩。肾上腺位于两肾上方，分泌皮质醇、醛固酮和肾上腺素。胰腺内分泌部（胰岛）分泌胰岛素和胰高血糖素。睾丸分泌睾酮。数据集中无甲状腺和甲状旁腺。因腺体小且分散，场景部件较少；每个腺一种颜色。"
  },
  "groups": [
    {
      "key": "ha-doi-yen",
      "name": {
        "vi": "Vùng dưới đồi và tuyến yên",
        "en": "Hypothalamus and pituitary",
        "zh": "下丘脑与垂体"
      },
      "latin": "Hypothalamus · Hypophysis",
      "note": {
        "vi": "Tuyến yên nặng chưa tới 1g nhưng điều khiển tuyến giáp, thượng thận, sinh dục, và tiết hormon tăng trưởng, prolactin. Thuỳ sau chứa ADH và oxytocin do vùng dưới đồi làm ra.",
        "en": "The pituitary weighs under 1g yet drives the thyroid, adrenals and gonads and releases growth hormone and prolactin. Its posterior lobe stores ADH and oxytocin made in the hypothalamus.",
        "zh": "垂体不足1g，却调控甲状腺、肾上腺和性腺，并分泌生长激素和催乳素。垂体后叶储存下丘脑合成的抗利尿激素和催产素。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1760",
        "FJ1780",
        "FJ1796",
        "FJ1808",
        "FJ1828"
      ]
    },
    {
      "key": "tung",
      "name": {
        "vi": "Tuyến tùng",
        "en": "Pineal gland",
        "zh": "松果体"
      },
      "latin": "Glandula pinealis",
      "note": {
        "vi": "Tiết melatonin khi trời tối. Thường vôi hoá ở người lớn, là mốc đường giữa trên phim X quang và CT.",
        "en": "Releases melatonin in darkness. Often calcified in adults, a midline marker on X-ray and CT.",
        "zh": "黑暗时分泌褪黑素。成人常钙化，是X线和CT上的中线标志。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1795"
      ]
    },
    {
      "key": "uc",
      "name": {
        "vi": "Tuyến ức",
        "en": "Thymus",
        "zh": "胸腺"
      },
      "latin": "Thymus",
      "note": {
        "vi": "Nằm trung thất trên, sau xương ức. Tiết thymosin; u tuyến ức hay đi kèm bệnh nhược cơ.",
        "en": "In the superior mediastinum behind the sternum; it secretes thymosin. Thymoma is often associated with myasthenia gravis.",
        "zh": "位于胸骨后方的上纵隔，分泌胸腺素。胸腺瘤常伴重症肌无力。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ3150",
        "FJ3151"
      ]
    },
    {
      "key": "thuong-than",
      "name": {
        "vi": "Tuyến thượng thận",
        "en": "Adrenal glands",
        "zh": "肾上腺"
      },
      "latin": "Glandulae suprarenales",
      "note": {
        "vi": "Vỏ tiết corticoid, tuỷ tiết catecholamin. Tuyến phải hình tháp, tuyến trái hình bán nguyệt. Chi tiết ở bài Tuyến thượng thận.",
        "en": "The cortex makes corticosteroids and the medulla catecholamines. The right gland is pyramidal, the left crescentic. See the Adrenal scene for detail.",
        "zh": "皮质分泌皮质激素，髓质分泌儿茶酚胺。右侧呈锥形，左侧呈半月形。详见肾上腺场景。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3129",
        "FJ3130"
      ]
    },
    {
      "key": "tuy",
      "name": {
        "vi": "Tuỵ (phần nội tiết)",
        "en": "Pancreas (endocrine part)",
        "zh": "胰（内分泌部）"
      },
      "latin": "Pancreas (pars endocrina)",
      "note": {
        "vi": "Khoảng một triệu đảo Langerhans chỉ chiếm 1–2% khối tuỵ, tập trung nhiều ở đuôi tuỵ. Tế bào beta tiết insulin; mất chúng gây đái tháo đường týp 1.",
        "en": "About a million islets of Langerhans make up only 1–2% of the pancreas, most numerous in the tail. Beta cells make insulin; losing them causes type 1 diabetes.",
        "zh": "约100万个胰岛仅占胰腺的1–2%，以胰尾最多。β细胞分泌胰岛素，其丧失致1型糖尿病。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1895"
      ]
    },
    {
      "key": "tinh-hoan",
      "name": {
        "vi": "Tinh hoàn (tế bào Leydig)",
        "en": "Testes (Leydig cells)",
        "zh": "睾丸（间质细胞）"
      },
      "latin": "Testes",
      "note": {
        "vi": "Tế bào Leydig giữa các ống sinh tinh tiết testosteron dưới tác dụng của LH từ tuyến yên.",
        "en": "Leydig cells between the seminiferous tubules release testosterone under pituitary LH.",
        "zh": "生精小管之间的间质细胞在垂体LH作用下分泌睾酮。"
      },
      "tint": "#6fae7f",
      "parts": [
        "FJ3138",
        "FJ3142"
      ]
    }
  ]
};
