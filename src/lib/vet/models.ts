import type { VetModel, VetSpeciesKey } from "./types";

/**
 * MÔ HÌNH 3D THÚ Y — sổ đăng ký.
 *
 * TÌNH TRẠNG (26/08/2026): CHƯA có mô hình nào. Đây không phải chỗ trống bỏ
 * quên mà là kết quả của một đợt rà nguồn thật:
 *
 *   • Z-Anatomy (nền của atlas người) chỉ có người, không có loài vật nào.
 *   • Zenodo / figshare: có scan lẻ (một sọ chó .glb CC-BY-NC-SA, một sọ mèo
 *     .obj 493 MB CC-BY từ một bài khảo cổ, sọ bò rừng…) — rời rạc, không phủ
 *     nổi sáu loài, và phần lớn là mẫu vật khảo cổ chứ không phải mẫu giải phẫu.
 *   • Sketchfab: có nhiều sọ chó/mèo/ngựa giấy phép CC-BY, NHƯNG tải về đòi
 *     đăng nhập bằng tài khoản người dùng (OAuth), không lấy tự động được.
 *   • MorphoSource: có scan CT của các loài nuôi, nhưng tải cần tài khoản và
 *     phần lớn là chuỗi ảnh CT chứ không phải mesh dựng sẵn.
 *   • ThreeDScans: chỉ là tượng nghệ thuật, không dùng được.
 *
 * KẾT LUẬN: KHÔNG tồn tại bộ dữ liệu thú y vừa GẮN NHÃN vừa CẤP PHÉP SẠCH nào
 * tương đương Z-Anatomy. Vì vậy khu thú y lấy tri thức so sánh làm gốc, và mô
 * hình 3D chỉ được thêm khi có giấy phép nói ra được.
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
export const vetModels: VetModel[] = [];

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
    species: "dog",
    what: "Sọ chó nhà (Canis lupus familiaris), quét 3D, tệp .glb",
    where: "Zenodo — bản ghi 'Dog skull'",
    license: "CC BY-NC-SA 4.0 — dùng được cho học tập phi thương mại, phải ghi công và chia sẻ cùng điều kiện",
    howToGet: "Tải trực tiếp từ Zenodo, không cần tài khoản.",
  },
  {
    species: "cat",
    what: "Sọ mèo nhà (Felis catus), quét từ bài báo khảo cổ, .obj ~493 MB",
    where: "Zenodo — '3D models related to the article: The earliest domestic cat on the Silk Road'",
    license: "CC BY 4.0 — dùng được kể cả thương mại, chỉ cần ghi công",
    howToGet: "Tải trực tiếp; tệp rất nặng, phải giảm lưới mạnh trước khi đưa lên web.",
  },
  {
    species: "horse",
    what: "Sọ ngựa / xương bàn ngựa",
    where: "Sketchfab — lọc 'downloadable' + giấy phép CC Attribution",
    license: "CC BY 4.0 (tuỳ mô hình — phải đọc từng cái)",
    howToGet: "Cần đăng nhập tài khoản Sketchfab để bấm tải; không lấy tự động được.",
  },
  {
    species: "cattle",
    what: "Sọ bò (Bos taurus)",
    where: "Sketchfab / MorphoSource",
    license: "Thay đổi theo từng mẫu — phải kiểm trước khi dùng",
    howToGet: "Đăng nhập rồi tải thủ công.",
  },
  {
    species: "pig",
    what: "Sọ lợn (Sus scrofa)",
    where: "MorphoSource (oVert) — có chuỗi ảnh CT và một số mesh dựng sẵn",
    license: "Phần lớn CC BY-NC — kiểm từng bản ghi",
    howToGet: "Cần tài khoản MorphoSource; nếu chỉ có ảnh CT thì phải dựng mesh bằng 3D Slicer.",
  },
  {
    species: "chicken",
    what: "Bộ xương gà (Gallus gallus)",
    where: "MorphoSource / Phenome10k",
    license: "Phần lớn CC BY-NC",
    howToGet: "Cần tài khoản; ưu tiên bản đã có mesh .ply hoặc .stl.",
  },
];
