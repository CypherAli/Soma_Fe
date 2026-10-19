
import { bindContentSource } from "@/lib/content/source";
import type { VetLayerKey, VetModelPart, VetRegionKey, VetSpeciesKey } from "./types";
import type { T3 } from "@/lib/homeContent";

/**
 * MÔ MỀM THÚ Y CẤP PHÉP TỰ DO — danh sách đã rà từng bản ghi (01/09/2026).
 *
 * ĐÂY LÀ CHỖ SỬA LẠI MỘT KẾT LUẬN CŨ. Ghi chú đầu `models.ts` từng viết rằng
 * "không tồn tại bộ dữ liệu thú y vừa gắn nhãn vừa cấp phép sạch", rồi từ đó
 * suy ra khu thú y chỉ có xương. Vế đầu vẫn đúng: KHÔNG có bộ nào gắn nhãn
 * từng bộ phận như Z-Anatomy. Nhưng vế sau thì sai — mô mềm CC BY tải được
 * thì CÓ, chỉ là nằm rải ở tài khoản của từng trường thú y chứ không gom vào
 * một bộ. Rà bằng Sketchfab Data API (`downloadable=true` + lọc giấy phép
 * cc0/by/by-sa) trên 29 truy vấn và 15 tài khoản mới lòi ra.
 *
 * MỌI MỤC DƯỚI ĐÂY ĐỀU LÀ **CC BY 4.0** và **cho tải**. Đã kiểm từng uid qua
 * `api.sketchfab.com/v3/models/<uid>` chứ không tin vào trang web. CC BY cho
 * phép tác phẩm phái sinh → GIẢM LƯỚI ĐƯỢC, khác hẳn bộ xương rời LMU vốn
 * mang ND và vì thế phải giữ nguyên hình học (xem `import-lmu-models.mjs`).
 *
 * VÌ SAO KHÔNG CHỒNG LỚP ĐƯỢC: mỗi mục là một mẫu vật riêng, do một cơ sở
 * riêng quét, khác tỉ lệ và khác gốc toạ độ. Chồng trong suốt như bên người sẽ
 * ra một đống lệch nhau. Nên `VetLayerKey` ở đây dùng để CHUYỂN lớp, và trang
 * loài nói thẳng điều đó với người học.
 *
 * CÁCH NẠP: `SKFB_TOKEN=<token> node scripts/vet/import-vet-soft-tissue.mjs`
 * — token lấy ở sketchfab.com/settings/password, mục "API token".
 */
export type VetSoftTissueSource = {
  /** uid Sketchfab — khoá để tải, đồng thời là bằng chứng truy vết. */
  uid: string;
  /** slug tệp đích trong /public/models/vet/. */
  slug: string;
  species: VetSpeciesKey;
  layer: VetLayerKey;
  region: VetRegionKey;
  title: T3;
  /** Ghi công theo yêu cầu của CC BY — tên hiển thị đúng như trên Sketchfab. */
  attribution: string;
  /** Số mặt của bản GỐC, để biết mục nào chắc chắn phải giảm lưới. */
  faces: number;
  /**
   * Bộ phận tách được, khai theo TÊN VẬT LIỆU trong tệp gốc.
   *
   * Đọc ra bằng cách nào: `node scripts/vet/inspect-glb.cjs .cache/vet-soft-tissue/<uid>.glb` in
   * ra danh sách vật liệu. Mẫu nào chỉ ra một vật liệu ("material_0", "Solid",
   * "Scene_-_Root") thì đúng là khối quét liền — để trống, ĐỪNG bịa bộ phận.
   *
   * Ba mẫu dưới đây là toàn bộ số mẫu trong 14 mẫu có nhãn thật. Tên bộ phận
   * dịch theo nhãn gốc của tác giả, KHÔNG suy diễn thêm: nhãn ghi
   * "vascular_liver_pancreas" thì để nguyên là một cụm ba thứ, không tách bừa
   * thành gan riêng tuỵ riêng vì hình học vốn dính làm một.
   */
  parts?: VetModelPart[];
  /**
   * Điểm chú giải đặt theo TOẠ ĐỘ, ánh xạ tới một mục tri thức qua `factId`.
   *
   * Dùng khi mẫu vật KHÔNG tách được bộ phận nhưng vẫn cần chỉ tên cấu trúc —
   * đúng cách atlas giấy vẫn đánh số trên hình cả trăm năm nay. Écorché mèo là
   * ví dụ: một vật liệu duy nhất, tách theo mảnh rời thì ra 9.050 mảnh vụn của
   * phép quét chứ không phải từng cơ, nên `parts` vô dụng còn hotspot thì được.
   *
   * Toạ độ dò bằng `scripts/vet/hotspot_probe.py` TRÊN ĐÚNG TỆP ĐÃ NÉN trong
   * public/ — giảm lưới đổi hộp bao, dò trên bản gốc là lệch.
   */
  hotspots?: { factId: string; position: [number, number, number] }[];
  /**
   * CẮT MẪU THÀNH TỪNG VÙNG theo chính các điểm chú giải ở trên.
   *
   * Bật cờ này thì `import-vet-soft-tissue.mjs` chạy thêm `segment_by_seeds.py`:
   * mỗi hotspot thành một điểm mồi, lưới bị chia thành ngần ấy vùng, mỗi vùng
   * đặt tên đúng bằng `factId`. Từ đó trang xem ẩn được, cô lập được và bấm chọn
   * được TỪNG VÙNG — đúng như bên người, thay vì chỉ hắt sáng một vòng tròn.
   *
   * CHỈ bật cho mẫu MỘT vật liệu. Mẫu đã có nhãn bộ phận sẵn (hệ tiêu hoá mèo,
   * ổ bụng chó) thì nhãn của tác giả bao giờ cũng đúng hơn phép cắt của ta.
   */
  segment?: boolean;
};

const skfb = (uid: string) => `https://sketchfab.com/3d-models/${uid}`;

export const VET_SOFT_TISSUE: VetSoftTissueSource[] = bindContentSource("data:src/lib/vet/softTissue.ts#VET_SOFT_TISSUE", [
  // ── MÈO ──────────────────────────────────────────────────────────────────
  {
    uid: "4c08824eb4914ff4b6e71b4dc2ba080e",
    slug: "cat-ecorche",
    species: "cat",
    layer: "muscle",
    region: "whole",
    title: {
      vi: "Mèo lột da — lớp cơ toàn thân",
      en: "Cat écorché — whole-body musculature",
      zh: "猫去皮标本 — 全身肌肉",
    },
    attribution: "westerly — “Feline Ecorche Dec”",
    faces: 451202,
    // Mười nhóm cơ đọc được từ ngoài ở tư thế đứng, dò trên ảnh chiếu trực
    // giao mặt bên (đầu bên trái) rồi bắn tia vào lưới; đã dựng lại điểm và
    // render kiểm tra để chắc không có điểm nào trượt ra ngoài mặt cơ.
    segment: true,
    hotspots: [
      { factId: "dogcat-masseter", position: [0.223, 0.596, 1.78] },
      { factId: "dogcat-brachiocephalicus", position: [0.174, 0.596, 1.405] },
      { factId: "dogcat-trapezius", position: [0.089, 0.852, 1.107] },
      { factId: "dogcat-deltoideus", position: [0.28, 0.532, 0.958] },
      { factId: "dogcat-triceps-brachii", position: [0.318, 0.256, 0.873] },
      { factId: "dogcat-pectoralis", position: [0.096, 0.106, 0.703] },
      { factId: "dogcat-antebrachial-extensors", position: [0.273, -0.256, 0.894] },
      { factId: "dogcat-latissimus-dorsi", position: [0.246, 0.596, 0.511] },
      { factId: "dogcat-obliquus-externus", position: [0.274, 0.341, 0.17] },
      { factId: "dogcat-gluteus-medius", position: [0.246, 0.809, -0.767] },
      { factId: "dogcat-biceps-femoris", position: [0.277, 0.426, -1.022] },
      { factId: "dogcat-semitendinosus", position: [0.179, 0.256, -1.214] },
      { factId: "dogcat-quadriceps", position: [0.312, 0.256, -0.703] },
      { factId: "dogcat-gastrocnemius", position: [0.354, -0.149, -0.937] },
    ],
  },
  {
    uid: "ab92a2a9d9024447b0ed4c080ad17106",
    slug: "cat-digestive",
    species: "cat",
    layer: "viscera",
    region: "trunk",
    title: {
      vi: "Hệ tiêu hoá mèo, bình thường",
      en: "Normal feline digestive system",
      zh: "猫消化系统（正常）",
    },
    attribution: "Pixelbeaker — “Normal Feline Anatomy: Digestive System”",
    faces: 2265174,
    parts: [
      { material: "default_00b_Skin_dec", name: { vi: "Da và thành bụng", en: "Skin and body wall", zh: "皮肤与腹壁" } },
      { material: "default_08_Stomach_UpperGI_1", name: { vi: "Dạ dày và đường tiêu hoá trên", en: "Stomach and upper GI tract", zh: "胃与上消化道" }, nav: "Gaster" },
      { material: "default_06b_Intestines_dec", name: { vi: "Ruột", en: "Intestines", zh: "肠" }, nav: "Intestinum" },
      { material: "default_05b_Liver_1", name: { vi: "Gan", en: "Liver", zh: "肝" }, nav: "Hepar" },
      { material: "default_07b_Pancreas_dec", name: { vi: "Tuỵ", en: "Pancreas", zh: "胰" }, nav: "Pancreas" },
      { material: "default_09c_Kidneys_1", name: { vi: "Thận", en: "Kidneys", zh: "肾" }, nav: "Ren" },
      { material: "default_10_Bladder_1", name: { vi: "Bàng quang", en: "Urinary bladder", zh: "膀胱" }, nav: "Vesica urinaria" },
      { material: "default_01c_Blood_Volume_ab_dec", name: { vi: "Khối máu trong mạch", en: "Blood volume", zh: "血管内血流" } },
    ],
  },
  {
    uid: "71427ab47c1f4fa8b1efdc5986c97e1c",
    slug: "cat-liver",
    species: "cat",
    layer: "viscera",
    region: "trunk",
    title: { vi: "Gan mèo", en: "Cat liver", zh: "猫肝" },
    attribution: "3DVet_Printing — “Cat, Liver”",
    faces: 348200,
  },

  // ── CHÓ ──────────────────────────────────────────────────────────────────
  {
    uid: "98b75ec29f8649da888ed28f42505ad5",
    slug: "dog-forelimb-muscles",
    species: "dog",
    layer: "muscle",
    region: "forelimb",
    title: {
      vi: "Cơ chi trước chó",
      en: "Canine forelimb musculature",
      zh: "犬前肢肌肉",
    },
    attribution: "OVCanatomy (Ontario Veterinary College) — “Canine Forelimb V1”",
    faces: 99044,
    segment: true,
    hotspots: [
      { factId: "dog-thoracic-limb-weight", position: [-0.077, 0.038, -0.007] },
      { factId: "dogcat-deltoideus", position: [-0.031, 0.051, 0.002] },
      { factId: "dogcat-triceps-brachii", position: [-0.041, -0.005, 0.013] },
    ],
  },
  {
    uid: "962de878d2e94b75b10075931f0edaa3",
    slug: "dog-abdomen",
    species: "dog",
    layer: "viscera",
    region: "trunk",
    title: {
      vi: "Ổ bụng chó, bình thường",
      en: "Normal canine abdomen",
      zh: "犬腹腔（正常）",
    },
    attribution: "Pixelbeaker — “3D Canine Anatomy: Normal Abdomen”",
    faces: 1289511,
    parts: [
      { material: "default", name: { vi: "Da và thành bụng", en: "Skin and body wall", zh: "皮肤与腹壁" } },
      { material: "default_intestines", name: { vi: "Ruột", en: "Intestines", zh: "肠" }, nav: "Intestinum" },
      { material: "default_vascular_liver_pancreas", name: { vi: "Gan, tuỵ và mạch máu", en: "Liver, pancreas and vasculature", zh: "肝、胰与血管" } },
      { material: "default_lungs", name: { vi: "Phổi", en: "Lungs", zh: "肺" }, nav: "Pulmones" },
      { material: "default_blood", name: { vi: "Khối máu trong mạch", en: "Blood volume", zh: "血管内血流" } },
    ],
  },
  {
    uid: "b0836f9e9ec645a0971f7fb9629d7e44",
    slug: "dog-liver",
    species: "dog",
    layer: "viscera",
    region: "trunk",
    title: { vi: "Gan chó", en: "Dog liver", zh: "犬肝" },
    attribution: "3DVet_Printing — “Dog, Liver”",
    faces: 906180,
    segment: true,
    hotspots: [
      { factId: "dogcat-liver-lobes", position: [-74.316, -12.386, 9.805] },
      { factId: "dogcat-gallbladder", position: [-12.386, 0.0, 30.229] },
    ],
  },
  {
    uid: "5b4dec17040248948059e998b46f0b86",
    slug: "dog-heart",
    species: "dog",
    layer: "viscera",
    region: "trunk",
    title: { vi: "Tim chó, bình thường", en: "Normal canine heart", zh: "犬心（正常）" },
    attribution: "Pixelbeaker — “Normal Canine Heart Anatomy”",
    faces: 1418940,
    segment: true,
    hotspots: [
      { factId: "dogcat-aortic-arch", position: [0.194, 0.418, 0.139] },
      { factId: "dogcat-heart-position", position: [0.025, -0.418, 0.042] },
    ],
  },
  {
    uid: "a74ef26cf06e4679838cc2090aef9f87",
    slug: "dog-heart-blood-volume",
    species: "dog",
    layer: "vessel",
    region: "trunk",
    title: {
      vi: "Khối máu trong tim chó — động mạch và tĩnh mạch",
      en: "Canine heart blood volume — arterial & venous",
      zh: "犬心腔血流铸型 — 动脉与静脉",
    },
    attribution: "Pixelbeaker — “Canine Heart Blood Volume: arterial & venous”",
    faces: 632706,
    parts: [
      { material: "default", name: { vi: "Cơ tim", en: "Heart wall", zh: "心壁" }, nav: "Myocardium" },
      { material: "default_02_BV_arterial", name: { vi: "Khối máu động mạch", en: "Arterial blood volume", zh: "动脉血流" } },
      { material: "default_02_BV_venous", name: { vi: "Khối máu tĩnh mạch", en: "Venous blood volume", zh: "静脉血流" } },
    ],
  },
  {
    uid: "e9644a7370b641e1aa1cfc7c523514f2",
    slug: "dog-ear",
    species: "dog",
    layer: "senses",
    region: "head",
    title: { vi: "Tai chó", en: "Canine ear", zh: "犬耳" },
    attribution: "Pixelbeaker — “Canine Ear Trainer”",
    faces: 96918,
    segment: true,
    hotspots: [
      { factId: "dogcat-ear-canal", position: [-33.838, 9.023, -2.571] },
      { factId: "dog-tympanic-bulla", position: [-9.023, -7.895, 26.731] },
    ],
  },

  // ── NGỰA ─────────────────────────────────────────────────────────────────
  {
    uid: "b89f51941d4e4b67a73639f3c810ad96",
    slug: "horse-colon",
    species: "horse",
    layer: "viscera",
    region: "trunk",
    title: { vi: "Đại tràng ngựa", en: "Equine colon", zh: "马结肠" },
    attribution: "OVCanatomy (Ontario Veterinary College) — “Equine Colon”",
    faces: 99999,
    segment: true,
    hotspots: [
      { factId: "horse-pelvic-flexure", position: [-2.139, 0.113, 0.973] },
      { factId: "horse-colon-taeniae", position: [-1.407, -0.9, 0.938] },
      { factId: "horse-large-colon", position: [-1.013, 0.957, 0.648] },
    ],
  },
  {
    uid: "09b73c91eb3e4cb2b5c363d6b399ce54",
    slug: "horse-stifle",
    species: "horse",
    layer: "skeleton",
    region: "hindlimb",
    title: { vi: "Khớp gối ngựa", en: "Equine stifle", zh: "马膝关节" },
    attribution: "OVCanatomy (Ontario Veterinary College) — “Equine Stifle”",
    faces: 161938,
    segment: true,
    hotspots: [
      { factId: "horse-patellar-locking", position: [0.063, 0.333, 0.274] },
      { factId: "horse-stay-apparatus", position: [0.102, -0.157, 0.0] },
    ],
  },

  // ── BÒ ───────────────────────────────────────────────────────────────────
  // Ba mục này là mô hình 3D ĐẦU TIÊN của loài bò trong dự án. Trước đây bò
  // nằm trong VET_MODEL_CANDIDATES với ghi chú "rà 25+ truy vấn Zenodo không
  // ra gì" — đúng với Zenodo, nhưng chưa rà tài khoản của các trường thú y.
  {
    uid: "ec58bb93101448349c4551c89a41429c",
    slug: "cattle-rumen",
    species: "cattle",
    layer: "viscera",
    region: "trunk",
    title: { vi: "Dạ cỏ bò", en: "Bovine rumen", zh: "牛瘤胃" },
    attribution: "OVCanatomy (Ontario Veterinary College) — “Bovine Rumen”",
    faces: 1500000,
    segment: true,
    hotspots: [
      { factId: "cattle-hardware-disease", position: [0.77, -0.373, 7.079] },
      { factId: "cattle-rumen-sacs", position: [4.69, 3.353, -0.931] },
      { factId: "cattle-four-stomachs", position: [2.51, -2.981, -0.373] },
    ],
  },
  {
    uid: "12e2bc7b98d04f9e91ccfc89b0bc4937",
    slug: "cattle-forelimb",
    species: "cattle",
    layer: "muscle",
    region: "forelimb",
    title: {
      vi: "Chi trước bò",
      en: "Bovine forelimb",
      zh: "牛前肢",
    },
    attribution: "FU Berlin Veterinary Anatomy — “Rind Vordergliedmaße”",
    faces: 1672141,
    segment: true,
    hotspots: [
      { factId: "dog-thoracic-limb-weight", position: [0.153, 11.2, 1.28] },
      { factId: "cattle-cloven-hoof", position: [1.569, -12.8, 0.0] },
    ],
  },
  {
    uid: "3b9fd01589b34855be90da07e5f95ec1",
    slug: "cattle-pelvis",
    species: "cattle",
    layer: "skeleton",
    region: "hindlimb",
    title: { vi: "Khung chậu bò", en: "Bovine pelvis", zh: "牛骨盆" },
    attribution: "FU Berlin Veterinary Anatomy — “Becken Rind”",
    faces: 4405376,
    segment: true,
    hotspots: [
      { factId: "cattle-pelvis-calving", position: [-51.562, 63.374, 0.0] },
      { factId: "cattle-paralumbar-fossa", position: [-59.752, 195.403, 184.84] },
    ],
  },
]);

export const softTissueSourceUrl = (s: VetSoftTissueSource) => skfb(s.uid);

export const softTissueOf = (species: VetSpeciesKey) =>
  VET_SOFT_TISSUE.filter((s) => s.species === species);
