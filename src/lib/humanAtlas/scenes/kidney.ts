
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Thận, niệu quản và tuyến thượng thận" (bên phải) dựng từ bộ atlas BodyParts3D.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-kidney.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const kidneyScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/kidney.ts#kidneyScene", {
  "slug": "than-nieu-quan",
  "title": {
    "vi": "Thận, niệu quản và tuyến thượng thận",
    "en": "Kidney, Ureter and Adrenal Gland",
    "zh": "肾、输尿管与肾上腺"
  },
  "latin": "Ren · Ureter · Glandula suprarenalis",
  "intro": {
    "vi": "Thận phải và cuống thận. Động mạch thận chia nhánh trước và nhánh sau quanh bể thận, rồi thành các động mạch phân thuỳ; giữa hai vùng trước–sau có một đường vô mạch (đường Brödel) — chỗ rạch nhu mô ít chảy máu nhất khi mổ lấy sỏi. Mỗi nhánh một màu để thấy các phân thuỳ mạch. Bộ dữ liệu không có bể thận tách riêng.",
    "en": "The right kidney and its pedicle. The renal artery splits into anterior and posterior divisions around the pelvis, then into segmental arteries; between the anterior and posterior territories runs a relatively avascular plane (Brödel's line) — the least bloody place to incise the parenchyma when removing stones. Each branch has its own colour to show the vascular segments. The dataset has no separate renal pelvis.",
    "zh": "右肾及其肾蒂。肾动脉在肾盂周围分为前支和后支，再分为段动脉；前后两区之间有一相对无血管平面（Brödel线）——肾切开取石时切开实质出血最少处。各分支以不同颜色显示血管分段。数据集中无单独的肾盂。"
  },
  "frameGroups": [
    "than-phai",
    "dm-than-nhanh-truoc",
    "dm-than-nhanh-sau",
    "thuong-than-phai"
  ],
  "groups": [
    {
      "key": "than-phai",
      "name": {
        "vi": "Thận phải",
        "en": "Right kidney",
        "zh": "右肾"
      },
      "latin": "Ren dexter",
      "note": {
        "vi": "Dài khoảng 11cm, nằm thấp hơn thận trái vì gan. Mặt trước tiếp xúc gan, tá tràng, góc đại tràng phải — tá tràng đoạn hai nằm ngay trước rốn thận, dễ tổn thương khi mổ thận phải.",
        "en": "About 11cm long, lower than the left because of the liver. Its front touches the liver, duodenum and hepatic flexure — the second part of the duodenum lies right in front of the hilum and is at risk in right kidney surgery.",
        "zh": "长约11cm，因肝脏而低于左肾。前面与肝、十二指肠、结肠肝曲相邻——十二指肠降部紧贴肾门前方，右肾手术时易受损。"
      },
      "tint": "#9a4e3e",
      "parts": [
        "FJ3147"
      ]
    },
    {
      "key": "dm-than-nhanh-truoc",
      "name": {
        "vi": "Thân và nhánh trước động mạch thận",
        "en": "Renal artery trunk and anterior division",
        "zh": "肾动脉干与前支"
      },
      "latin": "A. renalis · rami anteriores",
      "note": {
        "vi": "Thân động mạch thận phải đi SAU tĩnh mạch chủ dưới. Nhánh trước chia các động mạch phân thuỳ trên, trên-trước, dưới-trước, dưới — nuôi khoảng 3/4 nhu mô.",
        "en": "The right renal artery trunk passes BEHIND the inferior vena cava. The anterior division gives the apical, anterosuperior, anteroinferior and inferior segmental arteries — supplying about three-quarters of the parenchyma.",
        "zh": "右肾动脉干经下腔静脉后方。前支分出上段、上前段、下前段和下段动脉——供应约3/4的肾实质。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2042",
        "FJ2043",
        "FJ3558",
        "FJ3559",
        "FJ3560",
        "FJ3561",
        "FJ3562",
        "FJ3563",
        "FJ3576"
      ]
    },
    {
      "key": "dm-than-nhanh-sau",
      "name": {
        "vi": "Nhánh sau động mạch thận",
        "en": "Posterior division of the renal artery",
        "zh": "肾动脉后支"
      },
      "latin": "A. renalis · ramus posterior",
      "note": {
        "vi": "Đi sau bể thận, nuôi phân thuỳ sau. Ranh giới giữa vùng nhánh trước và nhánh sau là đường vô mạch Brödel.",
        "en": "Runs behind the renal pelvis to supply the posterior segment. The border between the anterior and posterior territories is Brödel's avascular line.",
        "zh": "行于肾盂后方，供应后段。前后支供血区的分界即Brödel无血管线。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2045",
        "FJ3573",
        "FJ3574",
        "FJ3575"
      ]
    },
    {
      "key": "nieu-quan-phai",
      "name": {
        "vi": "Niệu quản phải và nhánh mạch niệu quản",
        "en": "Right ureter and ureteric vessels",
        "zh": "右输尿管及输尿管血管"
      },
      "latin": "Ureter dexter",
      "note": {
        "vi": "Niệu quản nhận máu từng đoạn: đoạn trên từ động mạch thận (nhánh niệu quản thấy ở đây), đoạn giữa từ động mạch chủ và sinh dục, đoạn dưới từ động mạch bàng quang. Bóc tách quá sát niệu quản khi mổ làm hoại tử và rò niệu quản.",
        "en": "The ureter gets blood segment by segment: the upper part from the renal artery (the ureteric branch shown here), the middle from the aorta and gonadal arteries, the lower from the vesical arteries. Stripping too close to it at surgery causes necrosis and a ureteric fistula.",
        "zh": "输尿管分段供血：上段来自肾动脉（此处可见输尿管支），中段来自主动脉和生殖腺动脉，下段来自膀胱动脉。手术时剥离过于贴近输尿管会导致其坏死和输尿管瘘。"
      },
      "tint": "#d9b25a",
      "parts": [
        "FJ3146",
        "FJ3581",
        "FJ3582"
      ]
    },
    {
      "key": "thuong-than-phai",
      "name": {
        "vi": "Tuyến thượng thận phải",
        "en": "Right adrenal gland",
        "zh": "右肾上腺"
      },
      "latin": "Glandula suprarenalis dextra",
      "note": {
        "vi": "Hình tháp, nằm sát sau tĩnh mạch chủ dưới; tĩnh mạch thượng thận phải rất ngắn đổ thẳng vào tĩnh mạch chủ — chỗ dễ rách chảy máu nhất khi cắt tuyến thượng thận phải.",
        "en": "Pyramidal, tucked right behind the IVC; the very short right adrenal vein empties straight into the cava — the riskiest point for bleeding in a right adrenalectomy.",
        "zh": "呈三角形，紧贴下腔静脉后方；右肾上腺静脉极短，直接汇入下腔静脉——右肾上腺切除时最易撕裂出血之处。"
      },
      "tint": "#e8a33d",
      "parts": [
        "FJ3130"
      ]
    },
    {
      "key": "tm-than-phai",
      "name": {
        "vi": "Tĩnh mạch thận phải và tĩnh mạch chủ dưới",
        "en": "Right renal vein and IVC",
        "zh": "右肾静脉与下腔静脉"
      },
      "latin": "V. renalis dextra",
      "note": {
        "vi": "Tĩnh mạch thận phải ngắn, đổ thẳng vào tĩnh mạch chủ dưới — vì vậy lấy thận ghép thường chọn thận TRÁI để có tĩnh mạch dài hơn. U thận có thể mọc theo lòng tĩnh mạch thận vào tĩnh mạch chủ.",
        "en": "The right renal vein is short and drains straight into the IVC — which is why the LEFT kidney is usually chosen from living donors, for its longer vein. Renal tumours can grow along the lumen of the renal vein into the cava.",
        "zh": "右肾静脉短，直接汇入下腔静脉——因此活体供肾通常选择左肾，以获得较长的静脉。肾肿瘤可沿肾静脉腔长入下腔静脉。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3577",
        "FJ3578",
        "FJ3441",
        "FJ3659"
      ]
    }
  ]
});
