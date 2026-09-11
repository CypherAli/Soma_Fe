/**
 * Bài bộ phận "Hốc mắt — học theo lớp" học theo lớp — nhóm lấy từ orbit.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partOrbitScene: AtlasSceneDef = {
  "slug": "bo-phan-hoc-mat",
  "title": {
    "vi": "Hốc mắt — học theo lớp",
    "en": "The Orbit — Layer by Layer",
    "zh": "眼眶——分层学习"
  },
  "latin": "Orbita",
  "system": "visual",
  "intro": {
    "vi": "Mở ra là nhãn cầu cùng các cơ vận nhãn: bốn cơ thẳng mọc từ vòng gân chung, hai cơ chéo và cơ nâng mi. Bật lớp Thần kinh để thấy dây thị giác, dây III, IV và các nhánh V1. Bật lớp Bộ lệ để thấy đường nước mắt. Đây là hốc mắt trái.",
    "en": "It opens on the eyeball with its muscles: the four recti arising from the common tendinous ring, the two obliques and levator palpebrae. Turn on Nerves for the optic nerve, nerves III and IV and the V1 branches. Turn on Lacrimal apparatus for the tear pathway. This is the left orbit.",
    "zh": "打开时显示眼球及眼外肌：起于总腱环的四条直肌、两条斜肌及上睑提肌；开启“神经”可见视神经、动眼神经、滑车神经和V1分支；开启“泪器”可见泪液通路。此为左眼眶。"
  },
  "layers": [
    {
      "key": "nhan-cau",
      "name": {
        "vi": "Nhãn cầu",
        "en": "Eyeball",
        "zh": "眼球"
      },
      "groups": [
        "nhan-cau"
      ],
      "on": true
    },
    {
      "key": "co",
      "name": {
        "vi": "Cơ vận nhãn",
        "en": "Eye muscles",
        "zh": "眼外肌"
      },
      "groups": [
        "thang-trong",
        "thang-ngoai",
        "thang-tren-duoi",
        "cheo-tren",
        "cheo-duoi",
        "nang-mi",
        "vong-gan"
      ],
      "on": true
    },
    {
      "key": "tk",
      "name": {
        "vi": "Thần kinh",
        "en": "Nerves",
        "zh": "神经"
      },
      "groups": [
        "than-kinh"
      ]
    },
    {
      "key": "le",
      "name": {
        "vi": "Bộ lệ",
        "en": "Lacrimal apparatus",
        "zh": "泪器"
      },
      "groups": [
        "bo-le"
      ]
    }
  ],
  "groups": [
    {
      "key": "nhan-cau",
      "name": {
        "vi": "Nhãn cầu",
        "en": "Eyeball",
        "zh": "眼球"
      },
      "latin": "Bulbus oculi",
      "note": {
        "vi": "Củng mạc, giác mạc và các cấu trúc trong nhãn cầu gộp làm một nhóm — chi tiết từng lớp xem ở bài Giải phẫu Mắt.",
        "en": "The sclera, cornea and inner structures grouped together — see the Anatomy of the Eye lesson for each layer.",
        "zh": "巩膜、角膜及眼内结构合为一组——各层细节见“眼解剖”一课。"
      },
      "parts": [
        "FJ1282",
        "FJ1285",
        "FJ1286",
        "FJ1287",
        "FJ1289",
        "FJ1297",
        "FJ1305",
        "FJ1316",
        "FJ1317",
        "FJ1320",
        "FJ1331"
      ]
    },
    {
      "key": "thang-trong",
      "name": {
        "vi": "Cơ thẳng trong",
        "en": "Medial rectus",
        "zh": "内直肌"
      },
      "latin": "M. rectus medialis",
      "note": {
        "vi": "Khép mắt vào trong (dây III). Là cơ khoẻ nhất trong sáu cơ vì cần cho quy tụ khi nhìn gần. Vỡ thành trong hốc mắt (xương giấy) có thể kẹt cơ này.",
        "en": "Adducts the eye (nerve III). The strongest of the six because convergence for near vision depends on it. A fracture of the thin medial orbital wall can trap it.",
        "zh": "使眼球内收（动眼神经）。六条中最强壮，因看近物时的集合运动依赖于它。菲薄的眶内侧壁骨折可嵌顿此肌。"
      },
      "tint": "#6f93b8",
      "parts": [
        "FJ1308"
      ]
    },
    {
      "key": "thang-ngoai",
      "name": {
        "vi": "Cơ thẳng ngoài",
        "en": "Lateral rectus",
        "zh": "外直肌"
      },
      "latin": "M. rectus lateralis",
      "note": {
        "vi": "Dạng mắt ra ngoài — do dây VI. Dây VI có đường đi trong sọ dài nhất nên liệt VI là dấu hiệu sớm, không định khu của tăng áp lực nội sọ: mắt lác trong, nhìn đôi khi nhìn ngang. (Atlas không có dây VI.)",
        "en": "Abducts the eye — nerve VI. Nerve VI has the longest intracranial course, so VI palsy is an early, non-localising sign of raised intracranial pressure: the eye turns in and double vision appears on sideways gaze. (The atlas has no nerve VI.)",
        "zh": "使眼球外展——展神经（VI）支配。展神经颅内行程最长，故其麻痹是颅内压增高的早期、非定位性体征：眼球内斜，侧视时复视。（图谱中无展神经。）"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1304"
      ]
    },
    {
      "key": "thang-tren-duoi",
      "name": {
        "vi": "Cơ thẳng trên và thẳng dưới",
        "en": "Superior and inferior recti",
        "zh": "上直肌与下直肌"
      },
      "latin": "Mm. recti superior et inferior",
      "note": {
        "vi": "Nâng và hạ nhãn cầu (dây III). Vì trục hốc mắt chếch ra ngoài 23° so với trục nhìn, chúng còn kéo mắt vào trong — muốn thử riêng cơ thẳng trên/dưới phải cho bệnh nhân nhìn ra ngoài trước.",
        "en": "Elevate and depress the globe (nerve III). Because the orbital axis points 23° outward from the line of sight, they also pull the eye inward — to test them in isolation the patient must first look outward.",
        "zh": "使眼球上转和下转（动眼神经）。因眶轴与视轴成23°外偏，二者还使眼球内收——单独检查时须先让患者向外看。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ1295",
        "FJ1323"
      ]
    },
    {
      "key": "cheo-tren",
      "name": {
        "vi": "Cơ chéo trên và ròng rọc",
        "en": "Superior oblique and trochlea",
        "zh": "上斜肌与滑车"
      },
      "latin": "M. obliquus superior",
      "note": {
        "vi": "Gân vòng qua ròng rọc ở góc trên-trong hốc mắt rồi quặt ra sau bám nhãn cầu, nên kéo mắt nhìn XUỐNG khi mắt đang khép — động tác nhìn xuống bậc thang. Liệt dây IV: khó xuống cầu thang, bệnh nhân nghiêng đầu sang bên lành để bù.",
        "en": "Its tendon hooks through the trochlea at the upper inner corner of the orbit and turns back to the globe, so it pulls the eye DOWN when adducted — looking down stairs. Nerve IV palsy: trouble going downstairs, with a head tilt toward the good side to compensate.",
        "zh": "肌腱穿过眶内上角的滑车后折向后方附着于眼球，故在内收位使眼球下转——即下楼梯时的视向。滑车神经麻痹：下楼困难，患者头向健侧倾斜以代偿。"
      },
      "tint": "#9b6fae",
      "parts": [
        "FJ1322",
        "FJ1329"
      ]
    },
    {
      "key": "cheo-duoi",
      "name": {
        "vi": "Cơ chéo dưới",
        "en": "Inferior oblique",
        "zh": "下斜肌"
      },
      "latin": "M. obliquus inferior",
      "note": {
        "vi": "Cơ vận nhãn duy nhất KHÔNG xuất phát từ đỉnh hốc mắt mà từ sàn hốc mắt phía trước. Nâng mắt khi mắt khép (dây III).",
        "en": "The only extraocular muscle that does NOT arise from the orbital apex — it starts from the front of the orbital floor. It elevates the adducted eye (nerve III).",
        "zh": "唯一不起自眶尖的眼外肌，起于眶底前部。在内收位使眼球上转（动眼神经）。"
      },
      "tint": "#b0708f",
      "parts": [
        "FJ1294"
      ]
    },
    {
      "key": "nang-mi",
      "name": {
        "vi": "Cơ nâng mi trên và sụn mi",
        "en": "Levator palpebrae and tarsal plates",
        "zh": "提上睑肌与睑板"
      },
      "latin": "M. levator palpebrae superioris",
      "note": {
        "vi": "Nâng mi trên (dây III, cùng phần cơ trơn Müller do giao cảm). Liệt dây III gây sụp mi hoàn toàn; hội chứng Horner chỉ sụp mi nhẹ. Sụn mi là tấm mô xơ đặc giữ dáng mi mắt.",
        "en": "Raises the upper lid (nerve III, with the smooth Müller's muscle under sympathetic control). Nerve III palsy gives complete ptosis; Horner syndrome only a mild droop. The tarsal plates are dense fibrous sheets shaping the lids.",
        "zh": "提升上睑（动眼神经，其中平滑肌部Müller肌受交感神经支配）。动眼神经麻痹致完全性上睑下垂；Horner综合征仅轻度下垂。睑板为致密纤维板，维持眼睑形态。"
      },
      "tint": "#d9a066",
      "parts": [
        "FJ1306",
        "FJ1324",
        "FJ1328"
      ]
    },
    {
      "key": "vong-gan",
      "name": {
        "vi": "Vòng gân chung và dây chằng hãm",
        "en": "Common tendinous ring and check ligaments",
        "zh": "总腱环与节制韧带"
      },
      "latin": "Anulus tendineus communis",
      "note": {
        "vi": "Vòng gân ở đỉnh hốc mắt, gốc của bốn cơ thẳng. Dây thị giác, dây III, VI và thần kinh mũi-mi đi qua bên trong vòng; dây IV đi ngoài vòng. Dây chằng hãm hạn chế biên độ cơ thẳng trong/ngoài.",
        "en": "The tendinous ring at the orbital apex, origin of the four recti. The optic nerve, nerves III and VI and the nasociliary nerve pass inside it; nerve IV passes outside. The check ligaments limit how far the medial and lateral recti can pull.",
        "zh": "位于眶尖的腱环，为四条直肌的起点。视神经、动眼神经、展神经和鼻睫神经从环内通过；滑车神经从环外通过。节制韧带限制内、外直肌的运动幅度。"
      },
      "tint": "#e3d3b0",
      "parts": [
        "FJ1284",
        "FJ1291",
        "FJ1292"
      ]
    },
    {
      "key": "than-kinh",
      "name": {
        "vi": "Thần kinh hốc mắt",
        "en": "Nerves of the orbit",
        "zh": "眶内神经"
      },
      "latin": "Nn. II, III, IV, V1",
      "note": {
        "vi": "Dây thị giác (II), vận nhãn (III, hai nhánh trên/dưới), ròng rọc (IV), và nhánh mắt dây V (trán, lệ, mũi-mi) cùng hạch mi. Dây III cũng mang sợi phó giao cảm co đồng tử qua hạch mi — nên chèn ép dây III làm giãn đồng tử trước tiên.",
        "en": "The optic (II), oculomotor (III, superior and inferior branches), trochlear (IV) and the ophthalmic division of V (frontal, lacrimal, nasociliary) with the ciliary ganglion. Nerve III also carries pupil-constricting parasympathetic fibres via the ciliary ganglion — so compression of III dilates the pupil first.",
        "zh": "视神经（II）、动眼神经（III，上、下支）、滑车神经（IV）及三叉神经眼支（额神经、泪腺神经、鼻睫神经）和睫状神经节。动眼神经还经睫状神经节传导缩瞳的副交感纤维——故动眼神经受压时最先出现瞳孔散大。"
      },
      "tint": "#e8c53d",
      "parts": [
        "FJ1283",
        "FJ1288",
        "FJ1290",
        "FJ1293",
        "FJ1296",
        "FJ1300",
        "FJ1310",
        "FJ1311",
        "FJ1312",
        "FJ1313",
        "FJ1315",
        "FJ1318",
        "FJ1321",
        "FJ1325",
        "FJ1326",
        "FJ1330"
      ]
    },
    {
      "key": "bo-le",
      "name": {
        "vi": "Bộ lệ",
        "en": "Lacrimal apparatus",
        "zh": "泪器"
      },
      "latin": "Apparatus lacrimalis",
      "note": {
        "vi": "Tuyến lệ ở góc trên-ngoài tiết nước mắt; nước mắt chảy qua mắt về hồ lệ góc trong, vào hai lệ quản, túi lệ, rồi ống lệ-mũi xuống ngách mũi dưới. Tắc ống lệ-mũi ở trẻ sơ sinh gây chảy nước mắt liên tục.",
        "en": "The lacrimal gland in the upper outer corner makes tears; they wash across the eye to the lacrimal lake at the inner corner, enter the two canaliculi, the lacrimal sac and the nasolacrimal duct down to the inferior meatus. A blocked nasolacrimal duct in newborns causes a constantly watering eye.",
        "zh": "位于眶外上角的泪腺分泌泪液；泪液流经眼表至内眦的泪湖，进入上下泪小管、泪囊，再经鼻泪管至下鼻道。新生儿鼻泪管阻塞导致持续流泪。"
      },
      "tint": "#6fb3d4",
      "parts": [
        "FJ1298",
        "FJ1299",
        "FJ1301",
        "FJ1302",
        "FJ1309"
      ]
    }
  ]
};
