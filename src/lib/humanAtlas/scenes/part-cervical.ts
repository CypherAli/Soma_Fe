
import { bindContentSource } from "@/lib/content/source";
/**
 * Bài bộ phận "Cột sống cổ — học theo lớp" học theo lớp — nhóm lấy từ cervical-spine.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partCervicalScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/part-cervical.ts#partCervicalScene", {
  "slug": "bo-phan-cot-song-co",
  "title": {
    "vi": "Cột sống cổ — học theo lớp",
    "en": "The Cervical Spine — Layer by Layer",
    "zh": "颈椎——分层学习"
  },
  "latin": "Vertebrae cervicales",
  "system": "skeletal",
  "intro": {
    "vi": "Mở ra là bảy đốt sống cổ: đốt đội (C1) không có thân, đốt trục (C2) có mỏm răng, C3–C6 điển hình, C7 có gai dài nhất. Bật lớp Đĩa đệm để thấy các đĩa từ C2 trở xuống; giữa C1 và C2 không có đĩa. Bật lớp Mạch máu để thấy động mạch đốt sống chui qua lỗ mỏm ngang.",
    "en": "It opens on the seven cervical vertebrae: the atlas (C1) with no body, the axis (C2) with its dens, typical C3–C6, and C7 with the longest spine. Turn on Discs for the discs from C2 down; there is none between C1 and C2. Turn on Vessels for the vertebral artery threading the transverse foramina.",
    "zh": "打开时显示七块颈椎：无椎体的寰椎（C1）、有齿突的枢椎（C2）、典型的C3–C6以及棘突最长的C7。开启“椎间盘”可见C2以下的椎间盘（C1与C2之间无椎间盘）；开启“血管”可见椎动脉穿行横突孔。"
  },
  "layers": [
    {
      "key": "xuong",
      "name": {
        "vi": "Xương",
        "en": "Bones",
        "zh": "骨"
      },
      "groups": [
        "c1",
        "c2",
        "c3-c6",
        "c7"
      ],
      "on": true
    },
    {
      "key": "dia",
      "name": {
        "vi": "Đĩa đệm",
        "en": "Discs",
        "zh": "椎间盘"
      },
      "groups": [
        "dia-dem"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Mạch máu",
        "en": "Vessels",
        "zh": "血管"
      },
      "groups": [
        "dm-dot-song"
      ]
    }
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
