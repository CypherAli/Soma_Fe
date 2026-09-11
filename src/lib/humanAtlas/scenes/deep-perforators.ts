/**
 * Scene "Nhánh xuyên sâu và động mạch mạch mạc" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Xoang tĩnh mạch màng cứng" cũ: atlas không có màng cứng (chỉ có lều tiểu não) và không có xoang tĩnh mạch.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const deepPerforatorsScene: AtlasSceneDef = {
  "slug": "xoang-tinh-mach-mang-cung",
  "title": {
    "vi": "Nhánh xuyên sâu và động mạch mạch mạc",
    "en": "Deep Perforating and Choroidal Arteries",
    "zh": "深穿支与脉络膜动脉"
  },
  "latin": "Aa. centrales · A. choroidea anterior",
  "system": "cardiovascular",
  "intro": {
    "vi": "Phần sâu của não (nhân nền, đồi thị, bao trong) không được nuôi bởi nhánh vỏ mà bởi các nhánh xuyên nhỏ tách thẳng từ vòng Willis và các thân động mạch lớn. Chúng là động mạch tận, không nối nhau. Tắc một nhánh xuyên gây nhồi máu nhỏ gọi là nhồi máu ổ khuyết. Ổ khuyết ở bao trong có thể gây liệt nửa người rất rõ dù ổ tổn thương chỉ vài milimét. Các động mạch mạch mạc nuôi đám rối mạch mạc tiết dịch não tuỷ. Mỗi nguồn một sắc đỏ; nhân nền và đồi thị mờ sẵn.",
    "en": "The deep brain (basal nuclei, thalamus, internal capsule) is fed not by cortical branches but by small perforators arising directly from the circle of Willis and the large trunks. They are end arteries with no anastomoses. Blocking one causes a small infarct called a lacune. A lacune in the internal capsule can cause a dense hemiplegia even though it measures only a few millimetres. The choroidal arteries feed the choroid plexus, which secretes cerebrospinal fluid. Each source has its own shade of red; basal nuclei and thalamus are faded.",
    "zh": "脑深部（基底核、丘脑、内囊）不由皮质支而由直接发自Willis环和大动脉干的细小穿支供血。它们是终动脉，无吻合。单支闭塞导致腔隙性梗死；内囊腔隙虽仅数毫米，也可引起明显偏瘫。脉络膜动脉供应分泌脑脊液的脉络丛。每个来源一种红色调；基底核和丘脑淡化。"
  },
  "frameGroups": [
    "van-dau",
    "mach-mac-truoc",
    "doi-thi",
    "mach-mac-sau"
  ],
  "fadedGroups": [
    "moc"
  ],
  "groups": [
    {
      "key": "van-dau",
      "name": {
        "vi": "Động mạch vân–đậu (từ não giữa)",
        "en": "Lenticulostriate arteries (from the middle cerebral)",
        "zh": "豆纹动脉（来自大脑中动脉）"
      },
      "latin": "Aa. centrales anterolaterales (từ ĐM não giữa)",
      "note": {
        "vi": "Nuôi nhân bèo, phần lớn nhân đuôi và nhánh trước bao trong. Là nơi hay gặp xuất huyết não do tăng huyết áp.",
        "en": "Feed the lentiform nucleus, most of the caudate and the anterior limb of the internal capsule; the classic site of hypertensive haemorrhage.",
        "zh": "供应豆状核、尾状核大部和内囊前肢，是高血压性脑出血的好发部位。"
      },
      "tint": "#d9534f",
      "parts": [
        "FJ1662",
        "FJ1662M",
        "FJ1663",
        "FJ1663M"
      ]
    },
    {
      "key": "mach-mac-truoc",
      "name": {
        "vi": "Động mạch mạch mạc trước",
        "en": "Anterior choroidal artery",
        "zh": "脉络膜前动脉"
      },
      "latin": "A. choroidea anterior",
      "note": {
        "vi": "Tách từ động mạch cảnh trong, nuôi đám rối mạch mạc sừng thái dương, dải thị và nhánh sau bao trong. Tắc nó gây liệt, mất cảm giác và mất nửa thị trường đối bên.",
        "en": "From the internal carotid, it feeds the choroid plexus of the temporal horn, the optic tract and the posterior limb of the internal capsule. Occlusion gives opposite hemiplegia, hemianaesthesia and hemianopia.",
        "zh": "发自颈内动脉，供应颞角脉络丛、视束和内囊后肢。闭塞致对侧偏瘫、偏身感觉障碍和偏盲。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1658",
        "FJ1658M",
        "FJ1674",
        "FJ1674M"
      ]
    },
    {
      "key": "doi-thi",
      "name": {
        "vi": "Nhánh xuyên đồi thị (từ não sau và thông sau)",
        "en": "Thalamic perforators (from the posterior cerebral and posterior communicating)",
        "zh": "丘脑穿支（来自大脑后动脉和后交通动脉）"
      },
      "latin": "Aa. thalamoperforantes · thalamogeniculatae · centrales posteromediales",
      "note": {
        "vi": "Động mạch xuyên đồi thị, gối–đồi thị và trung tâm sau trong nuôi đồi thị và vùng dưới đồi. Nhồi máu đồi thị có thể gây đau dữ dội nửa người đối bên (hội chứng Dejerine–Roussy).",
        "en": "The thalamoperforating, thalamogeniculate and posteromedial central arteries feed the thalamus and hypothalamus. A thalamic infarct can cause severe pain in the opposite half of the body (Dejerine–Roussy syndrome).",
        "zh": "丘脑穿通动脉、丘脑膝状体动脉和后内侧中央动脉供应丘脑和下丘脑。丘脑梗死可致对侧半身剧痛（Dejerine–Roussy综合征）。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1675",
        "FJ1675M",
        "FJ1679",
        "FJ1679M",
        "FJ1720",
        "FJ1720M",
        "FJ1721",
        "FJ1721M"
      ]
    },
    {
      "key": "mach-mac-sau",
      "name": {
        "vi": "Động mạch mạch mạc sau trong",
        "en": "Posterior medial choroidal artery",
        "zh": "脉络膜后内侧动脉"
      },
      "latin": "A. choroidea posterior medialis",
      "note": {
        "vi": "Từ động mạch não sau, nuôi đám rối mạch mạc não thất ba và mái não thất ba.",
        "en": "From the posterior cerebral, it feeds the choroid plexus and roof of the third ventricle.",
        "zh": "发自大脑后动脉，供应第三脑室脉络丛及其顶部。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1727",
        "FJ1727M"
      ]
    },
    {
      "key": "dam-roi",
      "name": {
        "vi": "Đám rối mạch mạc não thất bên",
        "en": "Choroid plexus of the lateral ventricle",
        "zh": "侧脑室脉络丛"
      },
      "latin": "Plexus choroideus",
      "note": {
        "vi": "Tiết khoảng 500ml dịch não tuỷ mỗi ngày.",
        "en": "Secretes about 500ml of cerebrospinal fluid a day.",
        "zh": "每日分泌约500ml脑脊液。"
      },
      "tint": "#9fb8a0",
      "parts": [
        "FJ1755",
        "FJ1803"
      ]
    },
    {
      "key": "moc",
      "name": {
        "vi": "Nhân nền, đồi thị, bao trong (mốc)",
        "en": "Basal nuclei, thalamus, internal capsule (landmarks)",
        "zh": "基底核、丘脑、内囊（标志）"
      },
      "latin": "Nuclei basales · Thalamus · Capsula interna",
      "note": {
        "vi": "Mờ sẵn — vùng nuôi của các nhánh xuyên.",
        "en": "Faded — the territory of the perforators.",
        "zh": "淡化——穿支的供血区。"
      },
      "parts": [
        "FJ1750",
        "FJ1751",
        "FJ1754",
        "FJ1757",
        "FJ1776",
        "FJ1782",
        "FJ1802",
        "FJ1805",
        "FJ1823",
        "FJ1827"
      ]
    }
  ]
};
