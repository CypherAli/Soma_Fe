
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Xương móng và cơ trên–dưới móng" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Hạch cổ" cũ: atlas không có hạch bạch huyết.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-c.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const hyoidMusclesScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/hyoid-muscles.ts#hyoidMusclesScene", {
  "slug": "hach-co",
  "title": {
    "vi": "Xương móng và cơ trên–dưới móng",
    "en": "The Hyoid and Supra- and Infrahyoid Muscles",
    "zh": "舌骨与舌骨上、下肌群"
  },
  "latin": "Os hyoideum · Mm. suprahyoidei et infrahyoidei",
  "system": "muscular",
  "intro": {
    "vi": "Xương móng hình chữ U, là xương duy nhất không khớp với xương nào khác, treo giữa hàm dưới và thanh quản bằng hai nhóm cơ. Nhóm trên móng (hai bụng, trâm–móng, hàm–móng, cằm–móng) nâng xương móng và làm sàn miệng. Nhóm dưới móng, gọi là cơ dải (ức–móng, ức–giáp, giáp–móng, vai–móng), hạ xương móng và thanh quản. Hai nhóm phối hợp khi nuốt và nói. Mỗi nhóm một tông màu; xương hàm, sọ và cột sống cổ mờ sẵn.",
    "en": "The U-shaped hyoid is the only bone that articulates with no other bone; it hangs between the mandible and larynx on two groups of muscles. The suprahyoids (digastric, stylohyoid, mylohyoid, geniohyoid) raise the hyoid and form the floor of the mouth. The infrahyoids, or strap muscles (sternohyoid, sternothyroid, thyrohyoid, omohyoid), lower the hyoid and larynx. The two groups work together in swallowing and speech. Each group has its own colour family; mandible, skull and cervical spine are faded.",
    "zh": "U形舌骨是唯一不与其他骨相关节的骨，借两组肌肉悬于下颌骨与喉之间。舌骨上肌群（二腹肌、茎突舌骨肌、下颌舌骨肌、颏舌骨肌）上提舌骨并构成口底；舌骨下肌群即带状肌（胸骨舌骨肌、胸骨甲状肌、甲状舌骨肌、肩胛舌骨肌）下降舌骨和喉。两组在吞咽和发音时协同。每组一种色系；下颌骨、颅骨和颈椎淡化。"
  },
  "frameGroups": [
    "mong",
    "tren",
    "duoi"
  ],
  "fadedGroups": [
    "moc"
  ],
  "groups": [
    {
      "key": "mong",
      "name": {
        "vi": "Xương móng và sụn giáp",
        "en": "Hyoid bone and thyroid cartilage",
        "zh": "舌骨与甲状软骨"
      },
      "latin": "Os hyoideum · Cartilago thyroidea",
      "note": {
        "vi": "Gãy xương móng gợi ý bị bóp cổ trong pháp y. Màng giáp–móng nối xương móng với sụn giáp.",
        "en": "A fractured hyoid suggests manual strangulation in forensic practice. The thyrohyoid membrane joins it to the thyroid cartilage.",
        "zh": "法医学中舌骨骨折提示扼颈。甲状舌骨膜连接舌骨与甲状软骨。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ2772",
        "FJ2808",
        "FJ2779",
        "FJ2786",
        "FJ2790",
        "FJ2797",
        "FJ2804"
      ]
    },
    {
      "key": "tren",
      "name": {
        "vi": "Nhóm trên móng",
        "en": "Suprahyoid group",
        "zh": "舌骨上肌群"
      },
      "latin": "Mm. digastricus, stylohyoideus, mylohyoideus, geniohyoideus",
      "note": {
        "vi": "Cơ hai bụng có gân trung gian treo vào xương móng qua quai xơ. Cơ hàm–móng là sàn miệng thật sự. Nhóm này kéo xương móng lên trước khi nuốt, mở lối vào thực quản.",
        "en": "Digastric has an intermediate tendon slung to the hyoid by a fibrous loop. Mylohyoid is the true floor of the mouth. The group pulls the hyoid up and forward in swallowing, opening the way into the oesophagus.",
        "zh": "二腹肌中间腱借纤维襻悬于舌骨。下颌舌骨肌构成真正的口底。吞咽时此组肌将舌骨拉向前上，开放食管入口。"
      },
      "tint": "#e8883d",
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
        "FJ1598",
        "FJ1581"
      ]
    },
    {
      "key": "duoi",
      "name": {
        "vi": "Nhóm dưới móng (cơ dải)",
        "en": "Infrahyoid (strap) group",
        "zh": "舌骨下肌群（带状肌）"
      },
      "latin": "Mm. sternohyoideus, sternothyroideus, thyrohyoideus, omohyoideus",
      "note": {
        "vi": "Do quai cổ chi phối. Khi mổ tuyến giáp phải tách đường giữa hai cơ ức–móng để vào tuyến. Cơ vai–móng có hai bụng, bắt chéo trước bó mạch cảnh.",
        "en": "Supplied by the ansa cervicalis. In thyroid surgery the surgeon splits the midline between the sternohyoids to reach the gland. Omohyoid has two bellies and crosses in front of the carotid sheath.",
        "zh": "受颈袢支配。甲状腺手术需沿两侧胸骨舌骨肌之间的中线分开进入。肩胛舌骨肌有两个肌腹，斜跨颈动脉鞘前方。"
      },
      "tint": "#6f93b8",
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
      "key": "moc",
      "name": {
        "vi": "Xương hàm dưới, thái dương, đốt cổ, xương ức (mốc)",
        "en": "Mandible, temporal bones, cervical vertebrae, sternum (landmarks)",
        "zh": "下颌骨、颞骨、颈椎、胸骨（标志）"
      },
      "latin": "Mandibula · Os temporale · Vertebrae cervicales · Sternum",
      "note": {
        "vi": "Mờ sẵn — thấy các điểm treo của hai nhóm cơ.",
        "en": "Faded — showing where the two groups are anchored.",
        "zh": "淡化——显示两组肌肉的附着点。"
      },
      "parts": [
        "FJ3161",
        "FJ3164",
        "FJ3167",
        "FJ3170",
        "FJ3172",
        "FJ3281",
        "FJ3289",
        "FJ3386"
      ]
    }
  ]
});
