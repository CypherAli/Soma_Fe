
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Tam giác cổ" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây X, XI, XII, đám rối cổ, ĐM cảnh ngoài và tĩnh mạch cảnh ngoài.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const neckTrianglesScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/neck-triangles.ts#neckTrianglesScene", {
  "slug": "tam-giac-co",
  "title": {
    "vi": "Các tam giác cổ",
    "en": "The Triangles of the Neck",
    "zh": "颈部三角"
  },
  "latin": "Trigona colli",
  "intro": {
    "vi": "Cơ ức–đòn–chũm chéo qua cổ, chia mỗi bên thành tam giác cổ trước và tam giác cổ sau. Tam giác trước giới hạn bởi đường giữa, bờ hàm dưới và cơ ức–đòn–chũm. Hai bụng cơ hai bụng và cơ vai–móng chia nó thành bốn tam giác nhỏ: dưới cằm, dưới hàm, cảnh, cơ. Tam giác cảnh chứa bó mạch cảnh, gồm động mạch cảnh chung và cảnh trong cùng tĩnh mạch cảnh trong. Tam giác sau nằm giữa cơ ức–đòn–chũm, cơ thang và xương đòn. Các cơ ranh giới mỗi cơ một màu; mạch đỏ–xanh. Bộ dữ liệu không có thần kinh và động mạch cảnh ngoài.",
    "en": "Sternocleidomastoid runs obliquely across the neck and divides each side into anterior and posterior triangles. The anterior triangle is bounded by the midline, the lower border of the mandible and sternocleidomastoid. The two bellies of digastric and omohyoid divide it into four smaller triangles: submental, submandibular, carotid and muscular. The carotid triangle holds the carotid sheath: common and internal carotid arteries and the internal jugular vein. The posterior triangle lies between sternocleidomastoid, trapezius and the clavicle. Each boundary muscle has its own colour; vessels are red and blue. The dataset has no nerves or external carotid artery.",
    "zh": "胸锁乳突肌斜跨颈部，将每侧分为颈前三角和颈后三角。颈前三角由中线、下颌骨下缘和胸锁乳突肌围成，被二腹肌两腹和肩胛舌骨肌分为四个小三角：颏下、下颌下、颈动脉和肌三角。颈动脉三角内有颈动脉鞘：颈总动脉、颈内动脉和颈内静脉。颈后三角位于胸锁乳突肌、斜方肌和锁骨之间。各边界肌一种颜色；血管红蓝。数据集中无神经和颈外动脉。"
  },
  "frameGroups": [
    "uc-don-chum",
    "thang",
    "hai-bung",
    "vai-mong",
    "canh",
    "tm"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "uc-don-chum",
      "name": {
        "vi": "Cơ ức–đòn–chũm (ranh giới chung)",
        "en": "Sternocleidomastoid (the dividing muscle)",
        "zh": "胸锁乳突肌（分界肌）"
      },
      "latin": "M. sternocleidomastoideus",
      "note": {
        "vi": "Co một bên làm nghiêng đầu cùng bên và xoay mặt sang bên đối diện. Co rút bẩm sinh gây vẹo cổ ở trẻ sơ sinh.",
        "en": "Acting alone it tilts the head to its own side and turns the face to the opposite side. Congenital shortening causes torticollis in infants.",
        "zh": "单侧收缩使头倾向同侧、面转向对侧。先天性挛缩致婴儿斜颈。"
      },
      "tint": "#b58bc4",
      "parts": [
        "FJ1573",
        "FJ1595"
      ]
    },
    {
      "key": "thang",
      "name": {
        "vi": "Cơ thang (bờ sau tam giác sau)",
        "en": "Trapezius (posterior border of the posterior triangle)",
        "zh": "斜方肌（颈后三角后界）"
      },
      "latin": "M. trapezius (pars descendens)",
      "note": {
        "vi": "Dây XI chạy chéo qua tam giác sau, nông ngay dưới da, rồi vào mặt sâu cơ thang. Sinh thiết hạch ở vùng này dễ cắt phải dây.",
        "en": "Nerve XI crosses the posterior triangle just under the skin to reach the deep surface of trapezius; a lymph node biopsy here can easily cut it.",
        "zh": "副神经斜穿颈后三角，位置表浅，再进入斜方肌深面。此处淋巴结活检易误伤。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1521",
        "FJ1521M"
      ]
    },
    {
      "key": "hai-bung",
      "name": {
        "vi": "Cơ hai bụng và trâm–móng (bờ trên)",
        "en": "Digastric and stylohyoid (upper boundaries)",
        "zh": "二腹肌与茎突舌骨肌（上界）"
      },
      "latin": "M. digastricus · M. stylohyoideus",
      "note": {
        "vi": "Bụng sau cơ hai bụng là bờ trên tam giác cảnh; bụng trước tạo tam giác dưới cằm với đường giữa.",
        "en": "The posterior belly is the upper border of the carotid triangle; the anterior belly forms the submental triangle with the midline.",
        "zh": "二腹肌后腹为颈动脉三角上界；前腹与中线围成颏下三角。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1555",
        "FJ1556",
        "FJ1560",
        "FJ1576",
        "FJ1578",
        "FJ1579",
        "FJ1598"
      ]
    },
    {
      "key": "vai-mong",
      "name": {
        "vi": "Cơ vai–móng (chia tam giác cảnh và tam giác cơ)",
        "en": "Omohyoid (divides carotid from muscular triangle)",
        "zh": "肩胛舌骨肌（分隔颈动脉三角与肌三角）"
      },
      "latin": "M. omohyoideus",
      "note": {
        "vi": "Bụng trên là bờ dưới tam giác cảnh; bụng dưới chia tam giác sau thành tam giác chẩm và tam giác vai–đòn.",
        "en": "Its superior belly is the lower border of the carotid triangle; the inferior belly divides the posterior triangle into occipital and supraclavicular parts.",
        "zh": "上腹为颈动脉三角下界；下腹将颈后三角分为枕三角和锁骨上三角。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ1565",
        "FJ1586"
      ]
    },
    {
      "key": "canh",
      "name": {
        "vi": "Động mạch cảnh chung và cảnh trong",
        "en": "Common and internal carotid arteries",
        "zh": "颈总动脉与颈内动脉"
      },
      "latin": "Aa. carotides communis et interna",
      "note": {
        "vi": "Chia đôi ngang bờ trên sụn giáp (C3–C4). Xoang cảnh ở chỗ chia là thụ thể áp lực; xoa vùng này làm chậm nhịp tim.",
        "en": "Divides at the upper border of the thyroid cartilage (C3–C4). The carotid sinus at the bifurcation is a baroreceptor; massaging it slows the heart.",
        "zh": "在甲状软骨上缘（C3–C4）分叉。分叉处的颈动脉窦为压力感受器，按摩可减慢心率。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1682",
        "FJ1682M",
        "FJ3483",
        "FJ3564"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch cảnh trong",
        "en": "Internal jugular vein",
        "zh": "颈内静脉"
      },
      "latin": "V. jugularis interna",
      "note": {
        "vi": "Nằm ngoài động mạch cảnh trong bao cảnh. Là đường đặt catheter tĩnh mạch trung tâm, vào ở đỉnh tam giác giữa hai bó cơ ức–đòn–chũm.",
        "en": "Lies lateral to the carotid in the sheath; the route for central venous catheters, entered at the apex of the triangle between the two heads of sternocleidomastoid.",
        "zh": "在颈动脉鞘内位于颈动脉外侧；中心静脉置管常于胸锁乳突肌两头间三角尖端穿刺。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3485",
        "FJ3585"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Hàm dưới, xương móng, xương đòn (mốc)",
        "en": "Mandible, hyoid, clavicles (landmarks)",
        "zh": "下颌骨、舌骨、锁骨（标志）"
      },
      "latin": "Mandibula · Os hyoideum · Clavicula",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ2772",
        "FJ3237",
        "FJ3289",
        "FJ3362"
      ]
    }
  ]
});
