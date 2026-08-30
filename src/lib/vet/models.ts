import type { VetModel, VetSpeciesKey } from "./types";

/**
 * MÔ HÌNH 3D THÚ Y — sổ đăng ký.
 *
 * TÌNH TRẠNG (27/08/2026): ba mẫu vật thật — sọ chó, sọ mèo, sọ ngựa.
 *
 * Vẫn KHÔNG tồn tại bộ dữ liệu thú y vừa gắn nhãn vừa cấp phép sạch nào tương
 * đương Z-Anatomy, nên khu thú y vẫn lấy tri thức so sánh làm gốc và mô hình
 * chỉ là mẫu vật minh hoạ, không phải bản đồ có tên từng bộ phận.
 *
 * Đường lấy được: Zenodo lưu bản sao Objaverse 1.0 của các mô hình Sketchfab
 * giấy phép CC — tải thẳng bằng HTTP, KHÔNG cần OAuth như tải qua Sketchfab.
 * Đây là điều đã sửa lại kết luận cũ "Sketchfab đòi đăng nhập nên chịu".
 *
 * Bò, lợn, gà: đã rà hơn 25 truy vấn trên Zenodo, không có mẫu nào vừa đúng
 * loài vừa CC0/CC-BY — thứ ra được chỉ là phù điêu đầu bò trang trí và tượng
 * lợn ở hầm mộ Paris, không dùng cho giải phẫu được. Xem VET_MODEL_CANDIDATES.
 *
 * CÁCH THÊM MỘT MÔ HÌNH (xem `scripts/vet/import-vet-model.mjs`):
 *   1. Tải tệp về, đọc kỹ giấy phép — CC0 và CC-BY dùng được; CC-BY-NC chỉ
 *      dùng cho mục đích học tập phi thương mại và phải ghi rõ; ND thì KHÔNG
 *      dùng được vì ta có giảm lưới.
 *   2. `node scripts/vet/import-vet-model.mjs <tệp> --species dog --slug dog-skull`
 *      — script giảm lưới, chuyển sang .glb nén Draco, chép vào public/models/vet.
 *   3. Thêm một mục vào mảng dưới đây, ĐIỀN ĐỦ `license`, `attribution`,
 *      `sourceUrl`. Ba trường này hiện ngay trên trang xem; thiếu là kiểm thử
 *      `npm run test:vet-kb` báo lỗi.
 *   4. Đặt hotspot theo TOẠ ĐỘ (scan thú y là khối liền, không có tên bộ phận),
 *      mỗi hotspot trỏ tới `factId` có thật trong kho tri thức.
 */
export const vetModels: VetModel[] = [
  {
    slug: "dog-skull",
    species: "dog",
    title: {
      vi: "Sọ chó nhà (đực)",
      en: "Domestic dog skull (male)",
      zh: "家犬颅骨（雄）",
    },
    file: "dog-skull.glb",
    license: "CC BY 4.0",
    attribution: "agancz — “Canis Familiaris (Dog) Skull”, mẫu vật phòng thí nghiệm khảo cổ, UNC-Chapel Hill",
    sourceUrl: "https://zenodo.org/records/10327538",
    hotspots: [
      { factId: "dog-dental-formula", position: [-0.587, -0.235, 0.304] },
      { factId: "dogcat-third-eyelid", position: [-0.047, 0.094, 0.196] },
      { factId: "dog-tympanic-bulla", position: [0.611, -0.188, 0.401] },
    ],
  },
  {
    slug: "cat-cranium",
    species: "cat",
    title: {
      vi: "Sọ mèo nhà",
      en: "Domestic cat cranium",
      zh: "家猫颅骨",
    },
    file: "cat-cranium.glb",
    license: "CC BY 4.0",
    attribution: "CUDAP — “Cat Cranium (CUDAP_6_28)”, quét Artec Space Spider, Castleton University",
    sourceUrl: "https://zenodo.org/records/10231479",
    hotspots: [
      { factId: "dogcat-third-eyelid", position: [13.878, 0, -12.132] },
      { factId: "cat-dental-formula", position: [-6.939, -26.368, 28.492] },
    ],
  },
  {
    slug: "horse-skull",
    species: "horse",
    title: {
      vi: "Sọ ngựa",
      en: "Horse skull",
      zh: "马颅骨",
    },
    file: "horse-skull.glb",
    license: "CC BY 4.0",
    attribution: "matousekfoto / ảnh Aleš Bárta — “Lebka koně”, Bảo tàng Thành phố Ústí nad Labem",
    sourceUrl: "https://zenodo.org/records/10302350",
    hotspots: [
      { factId: "dogcat-third-eyelid", position: [-417.514, 626.271, 595.13] },
      { factId: "horse-guttural-pouch", position: [-974.2, 69.586, 550.346] },
    ],
  },
];

export const vetModelsOfSpecies = (species: VetSpeciesKey) =>
  vetModels.filter((m) => m.species === species);

export const vetModel = (slug: string) => vetModels.find((m) => m.slug === slug);

/**
 * Ứng viên đã rà giấy phép — để người làm dự án tải về rồi nạp bằng script.
 *
 * Cố ý để trong mã nguồn chứ không phải trong một tệp ghi chú rời: danh sách
 * này là một phần của quy trình dữ liệu, và mỗi lần thêm mô hình phải sửa
 * đúng chỗ này để biết mô hình đến từ đâu.
 */
export type VetModelCandidate = {
  species: VetSpeciesKey;
  what: string;
  where: string;
  license: string;
  /** Việc cần làm để lấy được — nói thật, không hứa suông. */
  howToGet: string;
};

export const VET_MODEL_CANDIDATES: VetModelCandidate[] = [
  {
    species: "cattle",
    what: "Sọ bò (Bos taurus)",
    where: "MorphoSource / Sketchfab — Zenodo KHÔNG có (rà 25+ truy vấn ngày 27/08/2026, thứ ra được chỉ là phù điêu đầu bò trang trí ở lâu đài Beynac)",
    license: "Thay đổi theo từng mẫu — phải kiểm trước khi dùng",
    howToGet: "Đăng nhập MorphoSource rồi tải thủ công; hoặc chờ Objaverse đợt sau đổ thêm lên Zenodo.",
  },
  {
    species: "pig",
    what: "Sọ lợn (Sus scrofa)",
    where: "MorphoSource (oVert) — Zenodo không có mẫu giải phẫu nào đúng loài",
    license: "Phần lớn CC BY-NC — kiểm từng bản ghi",
    howToGet: "Cần tài khoản MorphoSource; nếu chỉ có ảnh CT thì phải dựng mesh bằng 3D Slicer.",
  },
  {
    species: "chicken",
    what: "Bộ xương gà (Gallus gallus)",
    where: "MorphoSource / Phenome10k — Zenodo không có",
    license: "Phần lớn CC BY-NC",
    howToGet: "Cần tài khoản; ưu tiên bản đã có mesh .ply hoặc .stl.",
  },
];

/**
 * Đã rà và dùng được, nhưng chưa thuộc sáu loài trong phạm vi — ghi lại để
 * khỏi phải rà lại khi mở rộng sang dê, cừu, thỏ:
 *   • “Goat Skull”, Zenodo 10357643, CC BY 4.0, .glb 4,4 MB — sọ dê.
 *   • “Poodle Skull”, Zenodo 10288701, CC0, .glb 108,7 MB — một sọ chó nữa,
 *     nặng nhưng giấy phép rộng nhất (CC0) nếu cần bản không ràng buộc ghi công.
 */
