
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Nhóm cơ khép đùi" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Khớp hông–đùi" cũ (trùng nội dung với "Khớp hông"; atlas không có dây chằng) bằng khoang trong của đùi.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const adductorsScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/adductors.ts#adductorsScene", {
  "slug": "khop-hang-dui",
  "title": {
    "vi": "Nhóm cơ khép đùi (khoang trong)",
    "en": "The Adductor Group (Medial Compartment)",
    "zh": "大腿内收肌群（内侧群）"
  },
  "latin": "Compartimentum femoris mediale",
  "system": "muscular",
  "intro": {
    "vi": "Khoang trong của đùi chứa các cơ khép, đi từ ngành xương mu và ngành ngồi tới đường ráp xương đùi. Xếp theo lớp: nông là cơ lược, khép dài và thon; giữa là khép ngắn; sâu là khép lớn và khép bé. Cơ bịt ngoài nằm sâu nhất. Các cơ này khép đùi và giữ khung chậu vững khi bước. Chúng hay bị căng rách ở người đá bóng. Dây bịt chi phối gần hết nhóm, nhưng bộ dữ liệu không có dây này. Mỗi lớp một tông màu, xương mờ sẵn.",
    "en": "The medial compartment of the thigh holds the adductors, running from the pubic and ischial rami to the linea aspera of the femur. By layer: superficial are pectineus, adductor longus and gracilis; middle is adductor brevis; deep are adductor magnus and minimus. Obturator externus lies deepest. They adduct the thigh and steady the pelvis in gait, and are often strained in footballers. The obturator nerve supplies most of the group, but it is not in the dataset. Each layer has its own colour family and bones are faded.",
    "zh": "大腿内侧群为内收肌，自耻骨支和坐骨支至股骨粗线。按层次：浅层为耻骨肌、长收肌和股薄肌；中层为短收肌；深层为大收肌和小收肌；闭孔外肌最深。它们内收大腿并在步行中稳定骨盆，足球运动员常拉伤。闭孔神经支配大部分肌肉，但数据集中无此神经。每层一种色系，骨骼淡化。"
  },
  "frameGroups": [
    "nong",
    "giua",
    "sau",
    "bit"
  ],
  "fadedGroups": [
    "xuong"
  ],
  "groups": [
    {
      "key": "nong",
      "name": {
        "vi": "Lớp nông: lược, khép dài, thon",
        "en": "Superficial layer: pectineus, adductor longus, gracilis",
        "zh": "浅层：耻骨肌、长收肌、股薄肌"
      },
      "latin": "Mm. pectineus, adductor longus, gracilis",
      "note": {
        "vi": "Khép dài tạo bờ trong tam giác đùi và là cơ khép hay bị căng nhất. Cơ thon là cơ duy nhất của nhóm vượt qua gối; nó thường được lấy làm mảnh ghép tái tạo dây chằng chéo.",
        "en": "Adductor longus forms the medial border of the femoral triangle and is the adductor most often strained. Gracilis is the only one that crosses the knee; it is often harvested for cruciate ligament reconstruction.",
        "zh": "长收肌构成股三角内侧界，是最常拉伤的内收肌。股薄肌是本组唯一跨膝的肌肉，常被取作交叉韧带重建的移植物。"
      },
      "tint": "#e39a7a",
      "parts": [
        "FJ1402M",
        "FJ1421M",
        "FJ1427M"
      ]
    },
    {
      "key": "giua",
      "name": {
        "vi": "Lớp giữa: khép ngắn",
        "en": "Middle layer: adductor brevis",
        "zh": "中层：短收肌"
      },
      "latin": "M. adductor brevis",
      "note": {
        "vi": "Nằm sau cơ lược và khép dài. Hai nhánh trước và sau của dây bịt kẹp cơ này ở giữa.",
        "en": "Lies behind pectineus and adductor longus. The anterior and posterior branches of the obturator nerve sandwich it.",
        "zh": "位于耻骨肌和长收肌后方；闭孔神经前、后支夹于其前后。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1401M"
      ]
    },
    {
      "key": "sau",
      "name": {
        "vi": "Lớp sâu: khép lớn, khép bé",
        "en": "Deep layer: adductor magnus and minimus",
        "zh": "深层：大收肌、小收肌"
      },
      "latin": "Mm. adductor magnus, adductor minimus",
      "note": {
        "vi": "Khép lớn có hai phần. Phần khép do dây bịt chi phối; phần gân (phần ụ ngồi) do dây ngồi chi phối và duỗi hông như nhóm đùi sau. Giữa hai phần có lỗ gân cơ khép, nơi mạch đùi ra khoeo. Khép bé là phần trên cùng tách riêng.",
        "en": "Adductor magnus has two parts. The adductor part is supplied by the obturator nerve; the hamstring (ischial) part is supplied by the sciatic nerve and extends the hip like the hamstrings. Between them is the adductor hiatus, where the femoral vessels pass to the popliteal fossa. Adductor minimus is its separate uppermost part.",
        "zh": "大收肌分两部：内收部受闭孔神经支配；腘绳部（坐骨部）受坐骨神经支配，如腘绳肌般伸髋。两部之间为收肌腱裂孔，股血管经此至腘窝。小收肌为其最上方独立部分。"
      },
      "tint": "#8a6fb0",
      "parts": [
        "FJ1403M",
        "FJ1404M"
      ]
    },
    {
      "key": "bit",
      "name": {
        "vi": "Cơ bịt ngoài",
        "en": "Obturator externus",
        "zh": "闭孔外肌"
      },
      "latin": "M. obturator externus",
      "note": {
        "vi": "Phủ mặt ngoài màng bịt, gân vòng sau cổ xương đùi. Nó xoay ngoài đùi và cũng được dây bịt chi phối.",
        "en": "Covers the outer face of the obturator membrane; its tendon passes behind the femoral neck. It rotates the thigh laterally and is also supplied by the obturator nerve.",
        "zh": "覆盖闭孔膜外面，肌腱经股骨颈后方；使大腿外旋，亦受闭孔神经支配。"
      },
      "tint": "#6f8fbf",
      "parts": [
        "FJ1425M"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Động mạch đùi và các động mạch xiên",
        "en": "Femoral and perforating arteries",
        "zh": "股动脉与穿动脉"
      },
      "latin": "A. femoralis · Aa. perforantes",
      "note": {
        "vi": "Động mạch đùi đi trong ống cơ khép giữa cơ rộng trong và khép dài. Các động mạch xiên (từ động mạch đùi sâu) xuyên qua chỗ bám khép lớn ra sau đùi.",
        "en": "The femoral artery runs in the adductor canal between vastus medialis and adductor longus. The perforating arteries (from the deep femoral) pierce the adductor magnus insertion to reach the back of the thigh.",
        "zh": "股动脉行于股内侧肌与长收肌之间的收肌管内。穿动脉（来自股深动脉）穿大收肌止点至大腿后部。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2074",
        "FJ2090",
        "FJ2094"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chậu và xương đùi (mốc)",
        "en": "Hip bone and femur (landmarks)",
        "zh": "髋骨与股骨（标志）"
      },
      "latin": "Os coxae · Femur",
      "note": {
        "vi": "Mờ sẵn — thấy nguyên uỷ ở ngành mu, ngồi và chỗ bám dọc đường ráp.",
        "en": "Faded — showing the origins on the pubic and ischial rami and the insertions along the linea aspera.",
        "zh": "淡化——显示耻骨支、坐骨支起点及沿股骨粗线的止点。"
      },
      "parts": [
        "FJ3259",
        "FJ3288"
      ]
    }
  ]
});
