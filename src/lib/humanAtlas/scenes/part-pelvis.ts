/**
 * Bài bộ phận "Chậu hông và đáy chậu — học theo lớp" học theo lớp — nhóm lấy từ pelvic-floor.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partPelvisScene: AtlasSceneDef = {
  "slug": "bo-phan-chau-hong",
  "title": {
    "vi": "Chậu hông và đáy chậu — học theo lớp",
    "en": "Pelvis and Pelvic Floor — Layer by Layer",
    "zh": "骨盆与盆底——分层学习"
  },
  "latin": "Pelvis · Diaphragma pelvis",
  "system": "muscular",
  "intro": {
    "vi": "Mở ra là khung chậu xương. Bật lớp Cơ nâng hậu môn để thấy ba bó mu–cụt, mu–trực tràng và chậu–cụt tạo nên phễu đáy chậu. Bật lớp Cơ khác để thấy cơ ụ ngồi–cụt, cơ thắt hậu môn ngoài và cơ bịt trong. Bật lớp Tạng để thấy các cơ quan tựa trên đáy chậu.",
    "en": "It opens on the bony pelvis. Turn on Levator ani for its three parts — pubococcygeus, puborectalis and iliococcygeus — which form the funnel of the pelvic floor. Turn on Other muscles for coccygeus, external anal sphincter and obturator internus. Turn on Organs for the viscera resting on the floor.",
    "zh": "打开时显示骨盆。开启“肛提肌”可见耻尾肌、耻骨直肠肌和髂尾肌三部构成盆底漏斗；开启“其他肌”可见尾骨肌、肛门外括约肌和闭孔内肌；开启“脏器”可见坐落于盆底的器官。"
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
        "xuong"
      ],
      "on": true
    },
    {
      "key": "nang",
      "name": {
        "vi": "Cơ nâng hậu môn",
        "en": "Levator ani",
        "zh": "肛提肌"
      },
      "groups": [
        "mu-cut",
        "mu-truc-trang",
        "chau-cut"
      ],
      "on": true
    },
    {
      "key": "khac",
      "name": {
        "vi": "Cơ khác",
        "en": "Other muscles",
        "zh": "其他肌"
      },
      "groups": [
        "u-ngoi-cut",
        "that-hau-mon",
        "bit-trong"
      ]
    },
    {
      "key": "tang",
      "name": {
        "vi": "Tạng",
        "en": "Organs",
        "zh": "脏器"
      },
      "groups": [
        "tang"
      ]
    }
  ],
  "groups": [
    {
      "key": "mu-cut",
      "name": {
        "vi": "Cơ mu-cụt",
        "en": "Pubococcygeus",
        "zh": "耻尾肌"
      },
      "latin": "M. pubococcygeus",
      "note": {
        "vi": "Phần giữa cơ nâng hậu môn, từ mặt sau xương mu tới xương cụt, ôm hai bên niệu đạo, tiền liệt (nam) hoặc âm đạo (nữ). Là cơ được tập trong bài tập Kegel.",
        "en": "The middle part of levator ani, from the back of the pubis to the coccyx, flanking the urethra and prostate (or vagina). It is the muscle trained in Kegel exercises.",
        "zh": "肛提肌中部，自耻骨后面至尾骨，夹持尿道和前列腺（女性为阴道）两侧。即凯格尔运动所锻炼的肌肉。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ2545",
        "FJ2550"
      ]
    },
    {
      "key": "mu-truc-trang",
      "name": {
        "vi": "Cơ mu-trực tràng",
        "en": "Puborectalis",
        "zh": "耻骨直肠肌"
      },
      "latin": "M. puborectalis",
      "note": {
        "vi": "Dải cơ hình chữ U vòng sau chỗ nối hậu môn–trực tràng, kéo nó ra trước tạo góc khoảng 90°. Khi rặn cơ này giãn, góc mở thẳng ra; co thắt nghịch thường gây táo bón.",
        "en": "A U-shaped sling passing behind the anorectal junction and pulling it forward to make an angle of about 90°. It relaxes during defecation to straighten the angle; paradoxical contraction causes constipation.",
        "zh": "U形肌束绕过肛管直肠连接处后方并将其向前牵拉，形成约90°的夹角。排便时此肌松弛使夹角变直；反常收缩导致便秘。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ2546",
        "FJ2551"
      ]
    },
    {
      "key": "chau-cut",
      "name": {
        "vi": "Cơ chậu-cụt và cung gân",
        "en": "Iliococcygeus and tendinous arch",
        "zh": "髂尾肌与肛提肌腱弓"
      },
      "latin": "M. iliococcygeus · Arcus tendineus",
      "note": {
        "vi": "Phần sau-ngoài mỏng của cơ nâng hậu môn, xuất phát từ cung gân — dải mạc dày trên mặt cơ bịt trong. Cùng các phần kia tạo thành phễu hoành chậu.",
        "en": "The thin posterolateral part of levator ani, arising from the tendinous arch — a thickened band of fascia over obturator internus. With the other parts it forms the funnel of the pelvic diaphragm.",
        "zh": "肛提肌薄弱的后外侧部，起自肛提肌腱弓——闭孔内肌表面增厚的筋膜带。与其他部分共同构成漏斗状盆膈。"
      },
      "tint": "#d98a2b",
      "parts": [
        "FJ2544",
        "FJ2549",
        "FJ2553"
      ]
    },
    {
      "key": "u-ngoi-cut",
      "name": {
        "vi": "Cơ ụ ngồi-cụt",
        "en": "Coccygeus",
        "zh": "尾骨肌"
      },
      "latin": "M. coccygeus",
      "note": {
        "vi": "Phần sau cùng của hoành chậu, từ gai ngồi tới bờ xương cùng-cụt, nằm trên dây chằng cùng-gai.",
        "en": "The most posterior part of the pelvic diaphragm, from the ischial spine to the edge of the sacrum and coccyx, lying on the sacrospinous ligament.",
        "zh": "盆膈的最后部，自坐骨棘至骶骨和尾骨边缘，位于骶棘韧带之上。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ2542",
        "FJ2547"
      ]
    },
    {
      "key": "that-hau-mon",
      "name": {
        "vi": "Cơ thắt hậu môn ngoài",
        "en": "External anal sphincter",
        "zh": "肛门外括约肌"
      },
      "latin": "M. sphincter ani externus",
      "note": {
        "vi": "Cơ vân tự chủ bao quanh ống hậu môn, do thần kinh thẹn chi phối. Rách cơ khi sinh (rách tầng sinh môn độ III–IV) gây đại tiện không tự chủ.",
        "en": "A voluntary striated muscle ringing the anal canal, supplied by the pudendal nerve. Tearing it in childbirth (third- or fourth-degree perineal tear) causes faecal incontinence.",
        "zh": "环绕肛管的随意横纹肌，受阴部神经支配。分娩时撕裂（III–IV度会阴裂伤）导致大便失禁。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ2543",
        "FJ2548"
      ]
    },
    {
      "key": "bit-trong",
      "name": {
        "vi": "Cơ bịt trong",
        "en": "Obturator internus",
        "zh": "闭孔内肌"
      },
      "latin": "M. obturator internus",
      "note": {
        "vi": "Lót thành bên chậu hông, chui qua khuyết ngồi bé ra ngoài xoay đùi. Mạc phủ cơ này tạo ống thẹn (Alcock) chứa bó mạch thần kinh thẹn.",
        "en": "Lines the side wall of the pelvis and exits through the lesser sciatic notch to rotate the thigh. The fascia over it forms the pudendal (Alcock's) canal carrying the pudendal vessels and nerve.",
        "zh": "衬于盆腔侧壁，经坐骨小孔穿出以旋转大腿。其表面筋膜形成阴部管（Alcock管），内有阴部血管神经。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1426",
        "FJ1426M"
      ]
    },
    {
      "key": "tang",
      "name": {
        "vi": "Tạng chậu hông",
        "en": "Pelvic organs",
        "zh": "盆腔脏器"
      },
      "latin": "Vesica · Prostata · Rectum",
      "note": {
        "vi": "Bàng quang ở trước, tiền liệt dưới cổ bàng quang, trực tràng ở sau — tất cả tựa trên đáy chậu. Để màu gốc làm mốc.",
        "en": "Bladder in front, prostate below the bladder neck, rectum behind — all resting on the pelvic floor. Shown in natural colour as landmarks.",
        "zh": "膀胱在前，前列腺在膀胱颈下方，直肠在后——均承托于盆底之上。以原色作为标志。"
      },
      "parts": [
        "FJ2571",
        "FJ3139",
        "FJ3148",
        "FJ3149"
      ]
    },
    {
      "key": "xuong",
      "name": {
        "vi": "Xương chậu và xương cùng (mốc)",
        "en": "Hip bones and sacrum (landmarks)",
        "zh": "髋骨与骶骨（标志）"
      },
      "latin": "Os coxae · Os sacrum",
      "note": {
        "vi": "Khung chậu — mờ sẵn để thấy phễu cơ bên trong.",
        "en": "The bony pelvis — faded so the muscular funnel inside shows.",
        "zh": "骨盆——淡化以显示其内的肌性漏斗。"
      },
      "parts": [
        "FJ3152",
        "FJ3288",
        "FJ3393"
      ]
    }
  ]
};
