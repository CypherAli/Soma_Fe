
import { bindContentSource } from "@/lib/content/source";
/**
 * Scene "Cột sống cổ" dựng từ bộ atlas BodyParts3D.
 * 
 * Atlas không có dây chằng cột sống.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-cervical-spine.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const cervicalSpineScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/cervical-spine.ts#cervicalSpineScene", {
  "slug": "cot-song-co",
  "title": {
    "vi": "Cột sống cổ",
    "en": "The Cervical Spine",
    "zh": "颈椎"
  },
  "latin": "Vertebrae cervicales",
  "intro": {
    "vi": "Bảy đốt cổ là đoạn cột sống di động nhất và mảnh nhất, mang cả hộp sọ nặng khoảng 5kg. C1–C2 là đốt đặc biệt cho động tác gật và xoay đầu; C3–C7 là đốt điển hình với lỗ mỏm ngang cho động mạch đốt sống đi lên não. Thoái hoá hay gặp nhất ở C5–C6 — đoạn chịu uốn nhiều nhất. Bộ dữ liệu không có dây chằng cột sống; xương chẩm để mờ làm mốc.",
    "en": "The seven cervical vertebrae are the most mobile and slender part of the spine, yet carry a skull weighing about 5kg. C1–C2 are specialised for nodding and turning the head; C3–C7 are typical vertebrae whose transverse foramina carry the vertebral arteries up to the brain. Degeneration is commonest at C5–C6 — the level that bends most. The dataset has no spinal ligaments; the occipital bone is faded as a landmark.",
    "zh": "七块颈椎是脊柱最灵活、最纤细的部分，却要承托约5kg的头颅。C1–C2为特殊椎骨，负责点头与转头；C3–C7为典型椎骨，横突孔内有椎动脉上行入脑。退变以C5–C6最多见——活动度最大的节段。数据集中无脊柱韧带；枕骨淡化作为标志。"
  },
  "frameGroups": [
    "c1",
    "c2",
    "c3-c6",
    "c7",
    "dia-dem"
  ],
  "fadedGroups": [
    "xuong-cham"
  ],
  "groups": [
    {
      "key": "c1",
      "name": {
        "vi": "Đốt đội (C1)",
        "en": "Atlas (C1)",
        "zh": "寰椎（C1）"
      },
      "latin": "Atlas (C1)",
      "note": {
        "vi": "Vòng xương không thân. Gãy vỡ vòng C1 (gãy Jefferson) do lực dọc trục như lặn đầu xuống nước nông — khối bên bị toác ra ngoài.",
        "en": "A ring of bone with no body. A burst fracture of C1 (Jefferson fracture) comes from an axial load such as diving into shallow water — the lateral masses are forced apart.",
        "zh": "无椎体的骨环。轴向暴力（如浅水跳水）可致寰椎爆裂骨折（Jefferson骨折）——两侧块向外分离。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ3176"
      ]
    },
    {
      "key": "c2",
      "name": {
        "vi": "Đốt trục (C2)",
        "en": "Axis (C2)",
        "zh": "枢椎（C2）"
      },
      "latin": "Axis (C2)",
      "note": {
        "vi": "Mỏm răng là trục xoay. Gãy qua cuống C2 (gãy người treo cổ) do ngửa cổ quá mức kèm kéo giãn — gặp trong tai nạn xe đâm trực diện.",
        "en": "The dens is the pivot. A fracture through the pedicles of C2 (hangman's fracture) results from forced hyperextension with distraction — seen in head-on car crashes.",
        "zh": "齿突是旋转轴。过伸加牵张暴力导致枢椎椎弓根骨折（绞刑者骨折）——见于正面撞车事故。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ3177"
      ]
    },
    {
      "key": "c3-c6",
      "name": {
        "vi": "Đốt sống cổ C3–C6",
        "en": "Cervical vertebrae C3–C6",
        "zh": "颈椎 C3–C6"
      },
      "latin": "Vertebrae C3–C6",
      "note": {
        "vi": "Đốt điển hình: thân nhỏ hình chữ nhật, mỏm móc hai bên thân tạo khớp Luschka, mỏm gai chẻ đôi. Gai xương ở khớp Luschka hẹp lỗ liên hợp gây đau rễ cổ lan xuống tay.",
        "en": "Typical vertebrae: small rectangular bodies, uncinate processes on either side forming the joints of Luschka, bifid spinous processes. Osteophytes at the Luschka joints narrow the foramina and cause cervical root pain down the arm.",
        "zh": "典型颈椎：椎体小呈长方形，两侧钩突构成钩椎关节（Luschka关节），棘突分叉。钩椎关节骨赘使椎间孔狭窄，引起向上肢放射的神经根痛。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ3161",
        "FJ3164",
        "FJ3167",
        "FJ3170"
      ]
    },
    {
      "key": "c7",
      "name": {
        "vi": "Đốt sống lồi (C7)",
        "en": "Vertebra prominens (C7)",
        "zh": "隆椎（C7）"
      },
      "latin": "Vertebra prominens (C7)",
      "note": {
        "vi": "Mỏm gai dài, không chẻ đôi, sờ rõ ở gáy khi cúi đầu — mốc đếm đốt sống. Lỗ mỏm ngang C7 thường không có động mạch đốt sống đi qua (động mạch vào từ C6).",
        "en": "A long, non-bifid spinous process, easily felt at the base of the neck when the head is bent — the landmark for counting vertebrae. The transverse foramen of C7 usually carries no vertebral artery (it enters at C6).",
        "zh": "棘突长且不分叉，低头时在颈后易于触及——计数椎骨的标志。C7横突孔通常无椎动脉通过（椎动脉自C6进入）。"
      },
      "tint": "#5f9ea3",
      "parts": [
        "FJ3172"
      ]
    },
    {
      "key": "dia-dem",
      "name": {
        "vi": "Đĩa gian đốt sống cổ",
        "en": "Cervical intervertebral discs",
        "zh": "颈椎间盘"
      },
      "latin": "Disci intervertebrales cervicales",
      "note": {
        "vi": "Không có đĩa giữa C1–C2 và giữa chẩm–C1. Thoát vị đĩa C5–C6 chèn rễ C6: đau lan ngón cái, yếu gập khuỷu, giảm phản xạ gân cơ nhị đầu và cánh tay-quay.",
        "en": "There is no disc between C1 and C2, nor between the occiput and C1. A C5–C6 herniation compresses the C6 root: pain radiating to the thumb, weak elbow flexion, reduced biceps and brachioradialis reflexes.",
        "zh": "寰枢之间及枕寰之间无椎间盘。C5–C6椎间盘突出压迫C6神经根：疼痛放射至拇指，屈肘无力，肱二头肌和肱桡肌反射减弱。"
      },
      "tint": "#9fc6d6",
      "parts": [
        "FJ3202",
        "FJ3213",
        "FJ3218",
        "FJ3219",
        "FJ3220",
        "FJ3221"
      ]
    },
    {
      "key": "dm-dot-song",
      "name": {
        "vi": "Động mạch đốt sống",
        "en": "Vertebral arteries",
        "zh": "椎动脉"
      },
      "latin": "A. vertebralis",
      "note": {
        "vi": "Đi lên trong lỗ mỏm ngang C6–C1, uốn cong quanh khối bên đốt đội rồi vào sọ qua lỗ lớn. Gai xương mỏm móc có thể ép nó khi xoay đầu, gây chóng mặt tư thế.",
        "en": "Climbs through the transverse foramina of C6–C1, bends around the lateral mass of the atlas and enters the skull through the foramen magnum. Uncinate osteophytes can pinch it on head turning, causing positional dizziness.",
        "zh": "穿C6–C1横突孔上行，绕寰椎侧块弯曲后经枕骨大孔入颅。钩突骨赘可在转头时压迫椎动脉，引起体位性眩晕。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1725",
        "FJ1725M"
      ]
    },
    {
      "key": "xuong-cham",
      "name": {
        "vi": "Xương chẩm (mốc)",
        "en": "Occipital bone (landmark)",
        "zh": "枕骨（标志）"
      },
      "latin": "Os occipitale",
      "note": {
        "vi": "Lồi cầu chẩm tiếp khớp với đốt đội. Làm mờ sẵn để thấy khớp chẩm-đội.",
        "en": "The occipital condyles articulate with the atlas. Faded so the atlanto-occipital joint shows.",
        "zh": "枕髁与寰椎相关节。淡化以显示寰枕关节。"
      },
      "parts": [
        "FJ3309"
      ]
    }
  ]
});
