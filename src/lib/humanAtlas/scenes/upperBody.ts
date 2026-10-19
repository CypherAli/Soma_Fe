
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Nửa thân trên" cho trang Vision AI (/cu-chi) — mô hình tia quét tầng 1.
 *
 * SINH TỰ ĐỘNG bằng hợp các bài vùng (head-overview, neck, carotid-system, thorax, chest-wall, shoulder, shoulder-girdle, upper-limb, arm-region, arm-muscles, arm-veins, arm-arteries, elbow-joint, cubital-fossa, forearm, hand, hand-detail) — đừng sửa tay.
 * Mỗi HỆ là một nhóm, KHÔNG đặt tint nên khung 3D tô đúng màu hệ của viewer.
 * Da mờ sẵn như viewer.
 */
import type { AtlasSceneDef } from "./types";

export const upperBodyScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/upperBody.ts#upperBodyScene", {
  "slug": "nua-than-tren",
  "title": {
    "vi": "Nửa thân trên",
    "en": "Upper body",
    "zh": "上半身"
  },
  "intro": {
    "vi": "Đầu, cổ, ngực, vai và hai cánh tay — mô hình tia quét của Vision AI.",
    "en": "Head, neck, chest, shoulders and both arms — the Vision AI scan model.",
    "zh": "头、颈、胸、肩及双臂——Vision AI扫描模型。"
  },
  "view": "front",
  "fadedGroups": ["integumentary"],
  "groups": [
    {
      "key": "skeletal",
      "name": { "vi": "Hệ xương", "en": "Skeletal system", "zh": "骨骼系统" },
      "parts": ["FJ3199","FJ3200","FJ3274","FJ3281","FJ3309","FJ3380","FJ3386","FJ3394","FJ3269","FJ3272","FJ3273","FJ3287","FJ3289","FJ3375","FJ3378","FJ3379","FJ3392","FJ3395","FJ1254","FJ1255","FJ1256","FJ1257","FJ1258","FJ1259","FJ1260","FJ1261","FJ1262","FJ1263","FJ1264","FJ1265","FJ1266","FJ1267","FJ1268","FJ1269","FJ1270","FJ1271","FJ1272","FJ1273","FJ1274","FJ1275","FJ1276","FJ1277","FJ1278","FJ1279","FJ1280","FJ1281","FJ2440","FJ2772","FJ2808","FJ3176","FJ3177","FJ3161","FJ3164","FJ3167","FJ3170","FJ3172","FJ3237","FJ3362","FJ3228","FJ3334","FJ3153","FJ3178","FJ3290","FJ3229","FJ3230","FJ3231","FJ3232","FJ3233","FJ3234","FJ3336","FJ3338","FJ3340","FJ3342","FJ3344","FJ3346","FJ3225","FJ3235","FJ3236","FJ3330","FJ3347","FJ3348","FJ3226","FJ3227","FJ3331","FJ3332","FJ3239","FJ3242","FJ3245","FJ3248","FJ3251","FJ3254","FJ3255","FJ3333","FJ3335","FJ3337","FJ3339","FJ3341","FJ3343","FJ3345","FJ3154","FJ3155","FJ3156","FJ3158","FJ3160","FJ3163","FJ3166","FJ3169","FJ3171","FJ3173","FJ3174","FJ3175","FJ1504M","FJ1532M","FJ3262","FJ3279","FJ3277","FJ3286","FJ3257","FJ3261","FJ3268","FJ3276","FJ3278","FJ3283","FJ3284","FJ3285","FJ3183","FJ3184","FJ3186","FJ3187","FJ3188","FJ3240","FJ3243","FJ3246","FJ3249","FJ3252","FJ3291","FJ3296","FJ3297","FJ3299","FJ3313","FJ3314","FJ3316","FJ3317","FJ3318"]
    },
    {
      "key": "muscular",
      "name": { "vi": "Hệ cơ", "en": "Muscular system", "zh": "肌肉系统" },
      "parts": ["FJ1294","FJ1295","FJ1304","FJ1308","FJ1322","FJ1323","FJ1573","FJ1595","FJ1565","FJ1574","FJ1575","FJ1577","FJ1586","FJ1596","FJ1597","FJ1599","FJ1555","FJ1556","FJ1559","FJ1560","FJ1562","FJ1576","FJ1578","FJ1579","FJ1580","FJ1583","FJ1598","FJ1570","FJ1571","FJ1572","FJ1592","FJ1593","FJ1594","FJ1557","FJ1561","FJ1566","FJ1569","FJ1582","FJ1588","FJ1591","FJ1600","FJ1601","FJ1558","FJ1587","FJ1451","FJ1451M","FJ1455","FJ1455M","FJ1454","FJ1454M","FJ1461","FJ1461M","FJ1467M","FJ1468M","FJ1513M","FJ1500M","FJ1506M","FJ1508M","FJ1507M","FJ1446M","FJ1447M","FJ1456M","FJ1460M","FJ1464M","FJ1459M","FJ1520M","FJ1521M","FJ1536M","FJ1537M","FJ1554M","FJ1478M","FJ1486M","FJ1488M","FJ1512M","FJ1477M","FJ1479M","FJ1480M","FJ1485M","FJ1487M","FJ1474M","FJ1503M","FJ1505M","FJ1516M","FJ1473M","FJ1475M","FJ1496M","FJ1499M","FJ1502M","FJ1518M","FJ1497M","FJ1498M","FJ1472M","FJ1484M","FJ1489M","FJ1490M","FJ1491M","FJ1492M","FJ1493M","FJ1494M","FJ1495M","FJ1517M","FJ1469M","FJ1481M","FJ1483M","FJ1501M","FJ1514M","FJ1515M","FJ1466M","FJ1470M","FJ1482M","FJ1509M","FJ1510M","FJ1511M"]
    },
    {
      "key": "sensory",
      "name": { "vi": "Cơ quan giác quan", "en": "Sensory organs", "zh": "感觉器官" },
      "parts": ["FJ3265","FJ3371","FJ1289","FJ1297","FJ1305","FJ1317","FJ1331","FJ1471M"]
    },
    {
      "key": "arterial",
      "name": { "vi": "Động mạch", "en": "Arteries", "zh": "动脉" },
      "parts": ["FJ1654","FJ1654M","FJ1655","FJ1660","FJ1660M","FJ1672","FJ1682","FJ1682M","FJ1692","FJ1692M","FJ1694","FJ1694M","FJ1713","FJ1713M","FJ1714","FJ1714M","FJ1723","FJ1723M","FJ1725","FJ1725M","FJ3483","FJ3564","FJ3411","FJ3417","FJ1695","FJ1695M","FJ1937","FJ1972","FJ3479","FJ3579","FJ1935","FJ1970","FJ2209","FJ2210","FJ2224","FJ2226","FJ2251","FJ2255","FJ2256","FJ2276","FJ2278","FJ2303","FJ2307","FJ2308","FJ1939","FJ1950","FJ1961","FJ1967","FJ1973","FJ1974","FJ1975","FJ1977","FJ1976","FJ2211","FJ2212","FJ2216","FJ2221","FJ2230","FJ2239","FJ2240","FJ2246","FJ2252","FJ2253","FJ2330","FJ2215","FJ2219","FJ2225","FJ2261","FJ2331","FJ2374","FJ2232","FJ2257","FJ2231","FJ2242","FJ2243","FJ2214","FJ2223","FJ2236","FJ2241","FJ2245","FJ2258","FJ2259","FJ2227","FJ2237","FJ2248","FJ2348","FJ2314","FJ2315","FJ2316","FJ2317","FJ2318","FJ2332","FJ2333","FJ2334","FJ2335","FJ2336","FJ2337","FJ2338","FJ2339"]
    },
    {
      "key": "venous",
      "name": { "vi": "Tĩnh mạch", "en": "Veins", "zh": "静脉" },
      "parts": ["FJ3482","FJ3485","FJ3486","FJ3583","FJ3585","FJ3587","FJ2213","FJ2217","FJ2220","FJ2222","FJ2233","FJ2247","FJ2254","FJ2218","FJ2313","FJ2234","FJ2235","FJ2228","FJ2229","FJ2238","FJ2244","FJ2249","FJ2260","FJ2319","FJ2320","FJ2321","FJ2322","FJ2323","FJ2324","FJ2325","FJ2326","FJ2327","FJ2328","FJ2329","FJ2340"]
    },
    {
      "key": "nervous",
      "name": { "vi": "Hệ thần kinh", "en": "Nervous system", "zh": "神经系统" },
      "parts": ["FJ1732","FJ1733","FJ1739","FJ1740","FJ1744","FJ1745","FJ1746","FJ1747","FJ1748","FJ1749","FJ1758","FJ1783","FJ1784","FJ1785","FJ1786","FJ1787","FJ1788","FJ1789","FJ1790","FJ1791","FJ1792","FJ1793","FJ1794","FJ1797","FJ1798","FJ1800","FJ1801","FJ1806","FJ1833","FJ1834","FJ1835","FJ1836","FJ1837","FJ1838","FJ1839","FJ1840","FJ1841","FJ1842","FJ1769","FJ1770","FJ1775","FJ1781","FJ1817","FJ1822","FJ1830","FJ1831"]
    },
    {
      "key": "respiratory",
      "name": { "vi": "Hệ hô hấp", "en": "Respiratory system", "zh": "呼吸系统" },
      "parts": ["FJ3263","FJ3369","FJ2740","FJ2742","FJ2747","FJ2752","FJ2754","FJ2759","FJ2541","FJ2770"]
    },
    {
      "key": "digestive",
      "name": { "vi": "Hệ tiêu hoá", "en": "Digestive system", "zh": "消化系统" },
      "parts": ["FJ2761"]
    },
    {
      "key": "connective",
      "name": { "vi": "Mô liên kết", "en": "Connective tissue", "zh": "结缔组织" },
      "parts": ["FJ1476M"]
    }
  ]
});
