
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Khớp cùng–chậu và vành chậu" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas thiếu dây chằng cùng–chậu, cùng–gai, cùng–củ và xương cụt.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-b.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const sacroiliacScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/sacroiliac.ts#sacroiliacScene", {
  "slug": "khop-cung-chau",
  "title": {
    "vi": "Khớp cùng–chậu và vành chậu",
    "en": "The Sacroiliac Joint and Pelvic Ring",
    "zh": "骶髂关节与骨盆环"
  },
  "latin": "Articulatio sacroiliaca · Cingulum pelvicum",
  "intro": {
    "vi": "Vành chậu là một vòng xương khép kín. Phía sau là xương cùng, kẹp giữa hai xương chậu bằng hai khớp cùng–chậu. Phía trước hai xương chậu gặp nhau ở khớp mu. Khớp cùng–chậu gần như không cử động. Mặt khớp gồ ghề, cài vào nhau, cùng các dây chằng rất khoẻ phía sau, truyền toàn bộ sức nặng thân mình xuống chi dưới. Vì là vòng kín, vỡ vành chậu thường gãy ở hai chỗ. Cơ hình lê đi qua khuyết ngồi lớn và là mốc của vùng này. Bộ dữ liệu không có dây chằng và xương cụt.",
    "en": "The pelvic ring is a closed ring of bone. Behind, the sacrum is wedged between the two hip bones at the two sacroiliac joints. In front, the hip bones meet at the pubic symphysis. The sacroiliac joint barely moves. Its rough, interlocking surfaces and very strong posterior ligaments carry the whole weight of the trunk to the lower limbs. Because the ring is closed, pelvic ring fractures usually break in two places. Piriformis passes through the greater sciatic notch and is the key landmark here. The dataset has no ligaments or coccyx.",
    "zh": "骨盆环是闭合的骨环：后方骶骨借两侧骶髂关节嵌于两髋骨之间，前方两髋骨在耻骨联合相接。骶髂关节几乎不动，其粗糙交锁的关节面和强大的后部韧带将躯干全部重量传至下肢。由于为闭合环，骨盆环骨折常有两处断裂。梨状肌穿坐骨大切迹，是本区关键标志。数据集中无韧带和尾骨。"
  },
  "frameGroups": [
    "cung",
    "chau",
    "l5"
  ],
  "groups": [
    {
      "key": "cung",
      "name": {
        "vi": "Xương cùng",
        "en": "Sacrum",
        "zh": "骶骨"
      },
      "latin": "Os sacrum",
      "note": {
        "vi": "Năm đốt cùng dính thành một khối tam giác. Mặt nhĩ ở hai bên khớp với xương chậu. Các lỗ cùng trước cho các nhánh trước dây sống cùng đi ra.",
        "en": "Five sacral vertebrae fused into a triangle. The auricular surfaces on each side articulate with the hip bones. The anterior sacral foramina transmit the anterior rami of the sacral nerves.",
        "zh": "五块骶椎融合成三角形骨块。两侧耳状面与髋骨相关节。骶前孔有骶神经前支穿出。"
      },
      "tint": "#e6c14a",
      "parts": [
        "FJ3393"
      ]
    },
    {
      "key": "chau",
      "name": {
        "vi": "Hai xương chậu",
        "en": "The two hip bones",
        "zh": "两块髋骨"
      },
      "latin": "Os coxae (ilium, ischium, pubis)",
      "note": {
        "vi": "Mỗi xương do cánh chậu, xương ngồi, xương mu dính lại ở ổ cối, hoàn tất lúc khoảng 16–18 tuổi. Mào chậu ngang mức L4, là mốc chọc dò tuỷ sống.",
        "en": "Each is the ilium, ischium and pubis fused at the acetabulum, complete by about 16–18 years. The iliac crests lie level with L4, the landmark for lumbar puncture.",
        "zh": "每块由髂骨、坐骨、耻骨在髋臼处融合而成，约16–18岁完成。两侧髂嵴最高点连线平L4，为腰椎穿刺标志。"
      },
      "tint": "#d9cfb8",
      "parts": [
        "FJ3152",
        "FJ3288"
      ]
    },
    {
      "key": "l5",
      "name": {
        "vi": "Đốt sống L5 và đĩa L5–S1",
        "en": "L5 vertebra and the L5–S1 disc",
        "zh": "L5椎骨与L5–S1椎间盘"
      },
      "latin": "Vertebra L5 · Discus L5–S1",
      "note": {
        "vi": "Khớp thắt lưng–cùng chịu lực cắt lớn vì mặt trên xương cùng nghiêng ra trước. Đĩa L5–S1 cùng L4–L5 là hai đĩa thoát vị nhiều nhất.",
        "en": "The lumbosacral junction bears high shear because the top of the sacrum tilts forward. The L5–S1 disc, with L4–L5, is the one most often herniated.",
        "zh": "由于骶骨上面前倾，腰骶连接承受较大剪力。L5–S1与L4–L5椎间盘是最常突出的两个。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ3168",
        "FJ3217"
      ]
    },
    {
      "key": "hinh-le",
      "name": {
        "vi": "Cơ hình lê",
        "en": "Piriformis",
        "zh": "梨状肌"
      },
      "latin": "M. piriformis",
      "note": {
        "vi": "Mọc từ mặt trước xương cùng, qua khuyết ngồi lớn tới mấu chuyển lớn. Nó chia khuyết ngồi lớn thành hai lỗ trên và dưới cơ hình lê. Dây ngồi thường ra ở lỗ dưới; khi dây xuyên qua cơ có thể gây hội chứng cơ hình lê.",
        "en": "Arises from the front of the sacrum and passes through the greater sciatic notch to the greater trochanter. It divides the notch into spaces above and below it. The sciatic nerve usually exits below it; when the nerve pierces the muscle, piriformis syndrome can result.",
        "zh": "起于骶骨前面，穿坐骨大切迹止于大转子，将坐骨大孔分为梨状肌上孔和下孔。坐骨神经通常经下孔穿出；神经穿过肌肉时可致梨状肌综合征。"
      },
      "tint": "#c9705f",
      "parts": [
        "FJ1428",
        "FJ1428M"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch cùng và chậu–thắt lưng",
        "en": "Sacral and iliolumbar veins",
        "zh": "骶静脉与髂腰静脉"
      },
      "latin": "Vv. sacrales laterales · V. sacralis mediana · V. iliolumbalis",
      "note": {
        "vi": "Đám rối tĩnh mạch trước xương cùng rất dày. Gãy xương cùng hoặc mổ vùng này có thể chảy máu khó cầm.",
        "en": "The presacral venous plexus is dense; sacral fractures or surgery here can bleed heavily and be hard to control.",
        "zh": "骶前静脉丛密集，骶骨骨折或手术时出血难以控制。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3510",
        "FJ3526",
        "FJ3541",
        "FJ3603",
        "FJ3611"
      ]
    }
  ]
});
