
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Cây phế quản phân thùy" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có nhu mô phổi — cây phế quản là hình ảnh chính của phổi trong bộ dữ liệu.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const bronchialTreeScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/bronchial-tree.ts#bronchialTreeScene", {
  "slug": "phoi-cay-phe-quan",
  "title": {
    "vi": "Khí quản và cây phế quản phân thùy",
    "en": "Trachea and the Segmental Bronchial Tree",
    "zh": "气管与肺段支气管树"
  },
  "latin": "Trachea · Arbor bronchialis",
  "intro": {
    "vi": "Khí quản chia hai phế quản gốc ở carina (ngang T4–T5). Phế quản gốc phải ngắn, to, gần thẳng đứng, chia ba phế quản thùy (trên, giữa, dưới). Phế quản gốc trái dài, nằm ngang hơn để vòng dưới cung động mạch chủ, chia hai phế quản thùy (trên kèm lưỡi, và dưới). Mỗi phế quản thùy lại chia thành phế quản phân thùy, là đơn vị để đọc phim và phẫu thuật. Scene tô mỗi thuỳ một màu. Nhờ vậy dễ nhận ra phân thùy nào ứng với thuỳ nào, và vì sao dị vật hay rơi vào phế quản phải.",
    "en": "The trachea divides into the two main bronchi at the carina (T4–T5). The right main bronchus is short, wide and nearly vertical, and splits into three lobar bronchi (upper, middle, lower). The left is longer and more horizontal, passing under the aortic arch, and splits into two (upper with lingula, and lower). Each lobar bronchus divides into segmental bronchi, the units for reading scans and for surgery. The scene gives each lobe its own colour. That makes it easy to see which segment belongs to which lobe, and why inhaled objects usually go right.",
    "zh": "气管在隆嵴（T4–T5）分为左右主支气管。右主支气管短、粗、近乎垂直，分为三个叶支气管（上、中、下）；左主支气管较长、较水平，从主动脉弓下方绕过，分为两个叶支气管（上叶含舌段、下叶）。每个叶支气管再分为段支气管，是阅片和手术的单位。本场景每叶一种颜色，便于辨认各段所属肺叶，以及异物为何多入右侧。"
  },
  "frameGroups": [
    "khi-quan",
    "tren",
    "giua",
    "luoi",
    "duoi"
  ],
  "groups": [
    {
      "key": "khi-quan",
      "name": {
        "vi": "Khí quản và phế quản gốc",
        "en": "Trachea and main bronchi",
        "zh": "气管与主支气管"
      },
      "latin": "Trachea · Bronchi principales",
      "note": {
        "vi": "Khí quản dài khoảng 10–12cm, có 16–20 vòng sụn hình chữ C hở phía sau. Carina là vùng rất nhạy, chạm vào gây ho dữ dội.",
        "en": "The trachea is 10–12cm long with 16–20 C-shaped cartilage rings open behind. The carina is exquisitely sensitive; touching it triggers violent coughing.",
        "zh": "气管长约10–12cm，有16–20个后方开口的C形软骨环。隆嵴极为敏感，触及可引起剧烈咳嗽。"
      },
      "tint": "#e3e0d6",
      "parts": [
        "FJ2450",
        "FJ2539",
        "FJ2541"
      ]
    },
    {
      "key": "tren",
      "name": {
        "vi": "Thuỳ trên: đỉnh, sau, trước",
        "en": "Upper lobe: apical, posterior, anterior",
        "zh": "上叶：尖段、后段、前段"
      },
      "latin": "Bronchi segmentales lobi superioris (B1–B3)",
      "note": {
        "vi": "Phân thùy đỉnh và sau thuỳ trên là nơi lao phổi hay khu trú, vì nơi này thông khí tốt hơn tưới máu.",
        "en": "The apical and posterior upper-lobe segments are the favourite site of tuberculosis, where ventilation exceeds blood flow.",
        "zh": "上叶尖段和后段是肺结核好发部位，因该处通气大于血流。"
      },
      "tint": "#5b9bd5",
      "parts": [
        "FJ2443",
        "FJ2444",
        "FJ2447",
        "FJ2453",
        "FJ2454",
        "FJ2458",
        "FJ2460",
        "FJ2461",
        "FJ2462",
        "FJ2463",
        "FJ2464",
        "FJ2465",
        "FJ2466",
        "FJ2467",
        "FJ2468",
        "FJ2469",
        "FJ2471",
        "FJ2472",
        "FJ2473",
        "FJ2474",
        "FJ2509",
        "FJ2510",
        "FJ2511",
        "FJ2512",
        "FJ2513",
        "FJ2514",
        "FJ2515",
        "FJ2516",
        "FJ2517",
        "FJ2518",
        "FJ2519",
        "FJ2520",
        "FJ2521",
        "FJ2522",
        "FJ2523",
        "FJ2524",
        "FJ2525",
        "FJ2526"
      ]
    },
    {
      "key": "giua",
      "name": {
        "vi": "Thuỳ giữa (phải): ngoài, trong",
        "en": "Middle lobe (right): lateral, medial",
        "zh": "中叶（右）：外侧段、内侧段"
      },
      "latin": "Bronchi segmentales lobi medii (B4–B5)",
      "note": {
        "vi": "Chỉ có ở phổi phải.",
        "en": "Present only in the right lung.",
        "zh": "仅右肺有。"
      },
      "tint": "#6fae7f",
      "parts": [
        "FJ2449",
        "FJ2451",
        "FJ2503",
        "FJ2504",
        "FJ2505",
        "FJ2506",
        "FJ2507",
        "FJ2508"
      ]
    },
    {
      "key": "luoi",
      "name": {
        "vi": "Lưỡi phổi (trái): trên, dưới",
        "en": "Lingula (left): superior, inferior",
        "zh": "舌段（左）：上舌段、下舌段"
      },
      "latin": "Bronchi lingulares (B4–B5 trái)",
      "note": {
        "vi": "Thuộc thuỳ trên trái, tương ứng thuỳ giữa phải.",
        "en": "Part of the left upper lobe, matching the right middle lobe.",
        "zh": "属左上叶，相当于右中叶。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ2441",
        "FJ2475",
        "FJ2476",
        "FJ2477",
        "FJ2478",
        "FJ2540"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Thuỳ dưới: trên và bốn phân thùy nền",
        "en": "Lower lobe: superior and four basal segments",
        "zh": "下叶：上段与四个基底段"
      },
      "latin": "Bronchi segmentales lobi inferioris (B6–B10)",
      "note": {
        "vi": "Phân thùy nền sau là nơi dịch hít sặc đọng khi người bệnh ngồi hoặc đứng.",
        "en": "The posterior basal segment is where aspirated fluid settles when the patient is upright.",
        "zh": "直立位时误吸液体积聚于后基底段。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2442",
        "FJ2445",
        "FJ2446",
        "FJ2448",
        "FJ2452",
        "FJ2455",
        "FJ2456",
        "FJ2457",
        "FJ2459",
        "FJ2470",
        "FJ2479",
        "FJ2480",
        "FJ2481",
        "FJ2482",
        "FJ2483",
        "FJ2484",
        "FJ2485",
        "FJ2486",
        "FJ2487",
        "FJ2488",
        "FJ2489",
        "FJ2490",
        "FJ2491",
        "FJ2492",
        "FJ2493",
        "FJ2494",
        "FJ2495",
        "FJ2496",
        "FJ2497",
        "FJ2498",
        "FJ2499",
        "FJ2500",
        "FJ2501",
        "FJ2502",
        "FJ2527",
        "FJ2528",
        "FJ2529",
        "FJ2530",
        "FJ2531",
        "FJ2532",
        "FJ2533",
        "FJ2534",
        "FJ2535",
        "FJ2536",
        "FJ2537",
        "FJ2538"
      ]
    }
  ]
});
