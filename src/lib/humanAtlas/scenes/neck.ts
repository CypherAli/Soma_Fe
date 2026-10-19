
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Giải phẫu Cổ" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu tuyến giáp, ĐM cảnh ngoài, dây X/XI, hạch cổ.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-neck.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const neckScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/neck.ts#neckScene", {
  "slug": "giai-phau-co",
  "title": {
    "vi": "Giải phẫu Cổ",
    "en": "Anatomy of the Neck",
    "zh": "颈部解剖"
  },
  "latin": "Collum",
  "intro": {
    "vi": "Cơ ức–đòn–chũm chéo qua cổ chia hai tam giác lớn: tam giác cổ TRƯỚC (chứa thanh quản, bó mạch cảnh, cơ trên và dưới móng) và tam giác cổ SAU (chứa cơ bậc thang, rễ đám rối cánh tay). Xương móng là mốc chia cơ trên móng (nâng thanh quản khi nuốt) và cơ dưới móng (hạ thanh quản). Bộ dữ liệu không có tuyến giáp, động mạch cảnh ngoài, dây X, XI và hạch cổ; cột sống cổ mờ sẵn.",
    "en": "Sternocleidomastoid runs obliquely across the neck, dividing it into two large triangles: the ANTERIOR triangle (larynx, carotid sheath, supra- and infrahyoid muscles) and the POSTERIOR triangle (scalenes, roots of the brachial plexus). The hyoid separates the suprahyoid muscles (raising the larynx in swallowing) from the infrahyoid muscles (lowering it). The dataset has no thyroid gland, external carotid, vagus, accessory nerve or cervical nodes; the cervical spine is faded.",
    "zh": "胸锁乳突肌斜跨颈部，将其分为两个大三角：颈前三角（喉、颈动脉鞘、舌骨上下肌群）和颈后三角（斜角肌、臂丛根）。舌骨分隔舌骨上肌（吞咽时上提喉）与舌骨下肌（下降喉）。数据集中无甲状腺、颈外动脉、迷走神经、副神经和颈淋巴结；颈椎淡化。"
  },
  "frameGroups": [
    "uc-don-chum",
    "duoi-mong",
    "tren-mong",
    "bac-thang",
    "truoc-song",
    "thanh-quan",
    "dm-canh",
    "tm-canh"
  ],
  "fadedGroups": [
    "xuong",
    "bam-da"
  ],
  "groups": [
    {
      "key": "uc-don-chum",
      "name": {
        "vi": "Cơ ức–đòn–chũm",
        "en": "Sternocleidomastoid",
        "zh": "胸锁乳突肌"
      },
      "latin": "M. sternocleidomastoideus",
      "note": {
        "vi": "Hai đầu (ức, đòn) lên mỏm chũm. Co một bên: nghiêng đầu cùng bên, xoay mặt sang bên kia. Cơ co rút bẩm sinh ở trẻ gây vẹo cổ. Bờ trước là mốc bắt mạch cảnh; do dây XI chi phối.",
        "en": "Two heads (sternal, clavicular) rising to the mastoid process. One side contracting tilts the head to that side and turns the face to the other. A congenitally shortened muscle causes torticollis in infants. Its anterior border is the landmark for the carotid pulse; supplied by nerve XI.",
        "zh": "有胸骨头和锁骨头，止于乳突。一侧收缩使头偏向同侧、面转向对侧。先天性挛缩致婴儿斜颈。其前缘是触摸颈动脉搏动的标志；受副神经支配。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1573",
        "FJ1595"
      ]
    },
    {
      "key": "duoi-mong",
      "name": {
        "vi": "Cơ dưới móng (cơ dải)",
        "en": "Infrahyoid (strap) muscles",
        "zh": "舌骨下肌群（带状肌）"
      },
      "latin": "Mm. infrahyoidei",
      "note": {
        "vi": "Ức–móng, ức–giáp, giáp–móng, vai–móng: hạ xương móng và thanh quản sau khi nuốt, cố định móng khi nói. Phủ lên tuyến giáp — phẫu thuật tuyến giáp phải tách chúng ra đường giữa. Do quai cổ (C1–C3) chi phối.",
        "en": "Sternohyoid, sternothyroid, thyrohyoid, omohyoid: they lower the hyoid and larynx after swallowing and steady the hyoid in speech. They cover the thyroid gland — thyroid surgery separates them in the midline. Supplied by the ansa cervicalis (C1–C3).",
        "zh": "胸骨舌骨肌、胸骨甲状肌、甲状舌骨肌、肩胛舌骨肌：吞咽后下降舌骨和喉，说话时固定舌骨。覆盖甲状腺——甲状腺手术需在中线将其分开。受颈袢（C1–C3）支配。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1565",
        "FJ1574",
        "FJ1575",
        "FJ1577",
        "FJ1586",
        "FJ1596",
        "FJ1597",
        "FJ1599"
      ]
    },
    {
      "key": "tren-mong",
      "name": {
        "vi": "Cơ trên móng",
        "en": "Suprahyoid muscles",
        "zh": "舌骨上肌群"
      },
      "latin": "Mm. suprahyoidei",
      "note": {
        "vi": "Nhị thân, hàm–móng, cằm–móng, trâm–móng: nâng xương móng và thanh quản khi nuốt, hạ hàm dưới khi há miệng mạnh. Cơ hàm–móng làm sàn miệng.",
        "en": "Digastric, mylohyoid, geniohyoid, stylohyoid: they raise the hyoid and larynx in swallowing and depress the mandible in forceful opening. Mylohyoid forms the floor of the mouth.",
        "zh": "二腹肌、下颌舌骨肌、颏舌骨肌、茎突舌骨肌：吞咽时上提舌骨和喉，用力张口时下降下颌骨。下颌舌骨肌构成口底。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ1555",
        "FJ1556",
        "FJ1559",
        "FJ1560",
        "FJ1562",
        "FJ1576",
        "FJ1578",
        "FJ1579",
        "FJ1580",
        "FJ1583",
        "FJ1598"
      ]
    },
    {
      "key": "bac-thang",
      "name": {
        "vi": "Ba cơ bậc thang",
        "en": "Scalene muscles",
        "zh": "斜角肌"
      },
      "latin": "Mm. scaleni",
      "note": {
        "vi": "Trước, giữa, sau — từ mỏm ngang đốt cổ xuống xương sườn I, II; cơ hô hấp phụ. Rễ đám rối cánh tay và động mạch dưới đòn chui qua khe giữa bậc thang trước và giữa; tĩnh mạch dưới đòn đi trước bậc thang trước — gốc của hội chứng lối thoát ngực.",
        "en": "Anterior, middle, posterior — from the cervical transverse processes to ribs I and II; accessory muscles of respiration. The brachial plexus roots and subclavian artery pass through the gap between the anterior and middle scalenes, the subclavian vein in front of the anterior scalene — the basis of thoracic outlet syndrome.",
        "zh": "前、中、后斜角肌——自颈椎横突至第一、二肋；为辅助呼吸肌。臂丛根和锁骨下动脉穿过前、中斜角肌间隙，锁骨下静脉行于前斜角肌前方——胸廓出口综合征的解剖基础。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1570",
        "FJ1571",
        "FJ1572",
        "FJ1592",
        "FJ1593",
        "FJ1594"
      ]
    },
    {
      "key": "truoc-song",
      "name": {
        "vi": "Cơ trước sống",
        "en": "Prevertebral muscles",
        "zh": "椎前肌"
      },
      "latin": "Mm. prevertebrales",
      "note": {
        "vi": "Dài cổ, dài đầu, thẳng đầu trước và ngoài — gấp đầu, cổ, nằm sát mặt trước thân đốt sống sau hầu. Căng giãn nhóm này là cơ chế chính của chấn thương \"roi quất\" khi xe bị tông từ sau.",
        "en": "Longus colli, longus capitis, rectus capitis anterior and lateralis — flexing the head and neck, lying directly on the front of the vertebral bodies behind the pharynx. Their overstretching is the main mechanism of whiplash in rear-end collisions.",
        "zh": "颈长肌、头长肌、头前直肌和头外侧直肌——屈头和颈，紧贴咽后方的椎体前面。其过度牵拉是追尾事故中挥鞭伤的主要机制。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1557",
        "FJ1561",
        "FJ1566",
        "FJ1569",
        "FJ1582",
        "FJ1588",
        "FJ1591",
        "FJ1600",
        "FJ1601"
      ]
    },
    {
      "key": "bam-da",
      "name": {
        "vi": "Cơ bám da cổ",
        "en": "Platysma",
        "zh": "颈阔肌"
      },
      "latin": "Platysma",
      "note": {
        "vi": "Tấm cơ mỏng ngay dưới da, căng da cổ và hạ khoé miệng; do dây VII chi phối. Khi mổ vùng cổ phải khâu lại lớp này để sẹo đẹp.",
        "en": "A thin sheet just under the skin that tenses the neck skin and pulls down the corners of the mouth; supplied by nerve VII. It is repaired as a separate layer after neck incisions for a neat scar.",
        "zh": "皮下薄层肌，紧张颈部皮肤并下拉口角；受面神经支配。颈部手术后需单独缝合此层以使瘢痕美观。"
      },
      "tint": "#e8b3b8",
      "parts": [
        "FJ1558",
        "FJ1587"
      ]
    },
    {
      "key": "thanh-quan",
      "name": {
        "vi": "Xương móng và khung thanh quản",
        "en": "Hyoid and laryngeal framework",
        "zh": "舌骨与喉支架"
      },
      "latin": "Os hyoideum · Larynx",
      "note": {
        "vi": "Mốc đường giữa: xương móng (C3), sụn giáp (C4–C5), sụn nhẫn (C6). Sờ được từ trên xuống khi khám cổ; màng nhẫn–giáp là chỗ mở đường thở cấp cứu. Chi tiết xem bài Giải phẫu Thanh quản.",
        "en": "Midline landmarks: hyoid (C3), thyroid cartilage (C4–C5), cricoid (C6). They can be felt in sequence on examining the neck; the cricothyroid membrane is the emergency airway site. See the Larynx lesson for detail.",
        "zh": "中线标志：舌骨（C3）、甲状软骨（C4–C5）、环状软骨（C6）。颈部检查时可自上而下依次触及；环甲膜是紧急气道开放部位。详见“喉解剖”一课。"
      },
      "tint": "#d9c27a",
      "parts": [
        "FJ2440",
        "FJ2541",
        "FJ2770",
        "FJ2772",
        "FJ2808"
      ]
    },
    {
      "key": "dm-canh",
      "name": {
        "vi": "Động mạch cảnh chung và cảnh trong",
        "en": "Common and internal carotid arteries",
        "zh": "颈总动脉与颈内动脉"
      },
      "latin": "Aa. carotides",
      "note": {
        "vi": "Trong bao cảnh cùng tĩnh mạch cảnh trong (ngoài) và dây X (sau, không có trong dữ liệu). Chia đôi ngang bờ trên sụn giáp (C4) — xoang cảnh ở chỗ chia nhận cảm áp; xoa mạnh gây chậm nhịp tim. (Atlas không có động mạch cảnh ngoài.)",
        "en": "In the carotid sheath with the internal jugular vein (lateral) and vagus (posterior, not in this data). It bifurcates at the upper border of the thyroid cartilage (C4) — the carotid sinus there senses pressure, and firm massage slows the heart. (The atlas has no external carotid.)",
        "zh": "与颈内静脉（外侧）和迷走神经（后方，数据中缺失）同在颈动脉鞘内。于甲状软骨上缘（C4）分叉——分叉处的颈动脉窦感受血压，用力按摩可致心率减慢。（图谱中无颈外动脉。）"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1682",
        "FJ1682M",
        "FJ1725",
        "FJ1725M",
        "FJ3483",
        "FJ3564"
      ]
    },
    {
      "key": "tm-canh",
      "name": {
        "vi": "Tĩnh mạch cảnh trong và dưới đòn",
        "en": "Internal jugular and subclavian veins",
        "zh": "颈内静脉与锁骨下静脉"
      },
      "latin": "V. jugularis interna",
      "note": {
        "vi": "Tĩnh mạch cảnh trong chạy ngoài động mạch cảnh, hợp tĩnh mạch dưới đòn thành tĩnh mạch cánh tay đầu. Chọc đặt catheter tĩnh mạch trung tâm ở đỉnh tam giác giữa hai đầu cơ ức–đòn–chũm.",
        "en": "The internal jugular runs lateral to the carotid and joins the subclavian to form the brachiocephalic vein. Central lines are placed at the apex of the triangle between the two heads of sternocleidomastoid.",
        "zh": "颈内静脉行于颈动脉外侧，与锁骨下静脉汇合成头臂静脉。中心静脉置管在胸锁乳突肌两头之间三角的顶点处进针。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3482",
        "FJ3485",
        "FJ3486",
        "FJ3583",
        "FJ3585",
        "FJ3587"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Cột sống cổ và xương đòn (mốc)",
        "en": "Cervical spine and clavicles (landmarks)",
        "zh": "颈椎与锁骨（标志）"
      },
      "latin": "Vertebrae cervicales · Clavicula",
      "note": {
        "vi": "Mờ sẵn; xương đòn là bờ dưới của tam giác cổ sau.",
        "en": "Faded; the clavicle forms the lower border of the posterior triangle.",
        "zh": "已淡化；锁骨构成颈后三角的下界。"
      },
      "parts": [
        "FJ3176",
        "FJ3177",
        "FJ3161",
        "FJ3164",
        "FJ3167",
        "FJ3170",
        "FJ3172",
        "FJ3237",
        "FJ3362"
      ]
    }
  ]
});
