/**
 * Scene "Hệ não thất" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu màng não (chỉ có lều tiểu não), khoang dưới nhện và các bể.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-d.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const ventriclesScene: AtlasSceneDef = {
  "slug": "nao-that-mang-nao",
  "title": {
    "vi": "Hệ não thất và dịch não tuỷ",
    "en": "The Ventricular System",
    "zh": "脑室系统"
  },
  "latin": "Systema ventriculare",
  "intro": {
    "vi": "Não có bốn khoang chứa dịch thông nhau. Hai não thất bên nằm trong hai bán cầu, thông với não thất ba qua lỗ gian não thất (lỗ Monro). Não thất ba thông với não thất bốn qua cống não. Đám rối mạch mạc tiết khoảng 500ml dịch não tuỷ mỗi ngày. Dịch chảy theo đường này, thoát ra khoang dưới nhện rồi được hấp thu. Tắc ở bất kỳ chỗ hẹp nào gây não úng thuỷ. Scene tô hệ não thất màu xanh dịch; đồi thị, nhân đuôi và thể chai (thành não thất) mờ sẵn. Bộ dữ liệu không có màng não ngoài lều tiểu não.",
    "en": "The brain has four connected fluid-filled cavities. The two lateral ventricles lie in the hemispheres and open into the third ventricle through the interventricular foramina (of Monro). The third ventricle opens into the fourth through the cerebral aqueduct. The choroid plexus secretes about 500ml of cerebrospinal fluid a day. The fluid flows along this path, leaves into the subarachnoid space and is absorbed. A block at any narrow point causes hydrocephalus. The scene colours the ventricles fluid-blue; thalamus, caudate and corpus callosum (the ventricular walls) are faded. The dataset has no meninges apart from the tentorium.",
    "zh": "脑内有四个相通的充液腔。两侧侧脑室位于大脑半球内，经室间孔（Monro孔）通第三脑室；第三脑室经中脑水管通第四脑室。脉络丛每日分泌约500ml脑脊液，沿此路径流动，进入蛛网膜下腔后被吸收。任何狭窄处阻塞均致脑积水。本场景将脑室涂成液体蓝色；丘脑、尾状核和胼胝体（脑室壁）淡化。数据集中除小脑幕外无脑膜。"
  },
  "frameGroups": [
    "ben",
    "ba",
    "bon"
  ],
  "fadedGroups": [
    "thanh"
  ],
  "groups": [
    {
      "key": "ben",
      "name": {
        "vi": "Hai não thất bên",
        "en": "The two lateral ventricles",
        "zh": "两侧侧脑室"
      },
      "latin": "Ventriculi laterales",
      "note": {
        "vi": "Mỗi não thất có sừng trán, phần trung tâm, sừng chẩm và sừng thái dương, uốn hình chữ C theo bán cầu. Chọc dẫn lưu não thất thường vào sừng trán bên phải.",
        "en": "Each has a frontal horn, central part, occipital horn and temporal horn, curving in a C with the hemisphere. External ventricular drains are usually placed in the right frontal horn.",
        "zh": "每侧有前角、中央部、后角和下角，随半球呈C形弯曲。脑室外引流通常置于右侧前角。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ1767",
        "FJ1814"
      ]
    },
    {
      "key": "monro",
      "name": {
        "vi": "Lỗ gian não thất (Monro)",
        "en": "Interventricular foramen (of Monro)",
        "zh": "室间孔（Monro孔）"
      },
      "latin": "Foramen interventriculare",
      "note": {
        "vi": "U nang keo ở não thất ba có thể bít lỗ này như nút van, gây đau đầu từng cơn và có thể đột tử.",
        "en": "A colloid cyst of the third ventricle can plug it like a ball valve, causing episodic headache and even sudden death.",
        "zh": "第三脑室胶样囊肿可如球阀般堵塞此孔，致阵发性头痛甚至猝死。"
      },
      "tint": "#8fc1e3",
      "parts": [
        "FJ1752"
      ]
    },
    {
      "key": "ba",
      "name": {
        "vi": "Não thất ba",
        "en": "Third ventricle",
        "zh": "第三脑室"
      },
      "latin": "Ventriculus tertius",
      "note": {
        "vi": "Khe hẹp giữa hai đồi thị. Sàn là vùng dưới đồi; mở thông sàn não thất ba qua nội soi là cách chữa não úng thuỷ tắc nghẽn.",
        "en": "A narrow slit between the two thalami, floored by the hypothalamus; endoscopic third ventriculostomy through this floor treats obstructive hydrocephalus.",
        "zh": "两丘脑间的狭窄裂隙，底为下丘脑；内镜第三脑室底造瘘术用于治疗梗阻性脑积水。"
      },
      "tint": "#3f7fbf",
      "parts": [
        "FJ1730"
      ]
    },
    {
      "key": "cong",
      "name": {
        "vi": "Cống não",
        "en": "Cerebral aqueduct",
        "zh": "中脑水管"
      },
      "latin": "Aqueductus cerebri",
      "note": {
        "vi": "Ống hẹp khoảng 1–2mm xuyên trung não, là chỗ tắc hay gặp nhất.",
        "en": "A 1–2mm channel through the midbrain, the commonest site of obstruction.",
        "zh": "贯穿中脑的1–2mm细管，是最常见的阻塞部位。"
      },
      "tint": "#2e5f8f",
      "parts": [
        "FJ1738"
      ]
    },
    {
      "key": "bon",
      "name": {
        "vi": "Não thất bốn và ống trung tâm",
        "en": "Fourth ventricle and central canal",
        "zh": "第四脑室与中央管"
      },
      "latin": "Ventriculus quartus · Canalis centralis",
      "note": {
        "vi": "Dịch thoát ra khoang dưới nhện qua lỗ giữa và hai lỗ bên của não thất bốn; phía dưới nối với ống trung tâm tuỷ sống.",
        "en": "Fluid leaves into the subarachnoid space through the median and two lateral apertures of the fourth ventricle; below, it continues as the central canal of the cord.",
        "zh": "脑脊液经第四脑室正中孔和两外侧孔进入蛛网膜下腔；向下续为脊髓中央管。"
      },
      "tint": "#6fae9f",
      "parts": [
        "FJ1731",
        "FJ1737"
      ]
    },
    {
      "key": "dam-roi",
      "name": {
        "vi": "Đám rối mạch mạc",
        "en": "Choroid plexus",
        "zh": "脉络丛"
      },
      "latin": "Plexus choroideus",
      "note": {
        "vi": "Mạng mao mạch phủ biểu mô, nằm trong não thất bên. Thường vôi hoá ở người lớn nên thấy trên phim CT.",
        "en": "A tuft of capillaries covered by epithelium in the lateral ventricles; often calcified in adults and visible on CT.",
        "zh": "覆有上皮的毛细血管丛，位于侧脑室内；成人常钙化，CT可见。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1755",
        "FJ1803"
      ]
    },
    {
      "key": "leu",
      "name": {
        "vi": "Lều tiểu não (màng cứng)",
        "en": "Tentorium cerebelli (dura)",
        "zh": "小脑幕（硬脑膜）"
      },
      "latin": "Tentorium cerebelli",
      "note": {
        "vi": "Phần màng cứng duy nhất có trong bộ dữ liệu.",
        "en": "The only part of the dura in the dataset.",
        "zh": "数据集中唯一的硬脑膜部分。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1843"
      ]
    },
    {
      "key": "thanh",
      "name": {
        "vi": "Đồi thị, nhân đuôi, thể chai (thành não thất)",
        "en": "Thalamus, caudate, corpus callosum (ventricular walls)",
        "zh": "丘脑、尾状核、胼胝体（脑室壁）"
      },
      "latin": "Thalamus · Nucleus caudatus · Corpus callosum",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ1742",
        "FJ1754",
        "FJ1782",
        "FJ1802",
        "FJ1827"
      ]
    }
  ]
};
