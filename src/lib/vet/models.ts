import type { VetModel, VetSpeciesKey } from "./types";
import { VET_LAYER_ORDER } from "./types";
import { generatedVetModels } from "./modelsGenerated";
import { PIG_BONES, PIG_BONE_GROUP_OF, PIG_PART_GROUPS } from "./pigBonesGenerated";

/**
 * MÔ HÌNH 3D THÚ Y — sổ đăng ký.
 *
 * TÌNH TRẠNG (01/09/2026): sáu mẫu đặt tay ở tệp này (ba bộ xương toàn thân,
 * ba sọ) CỘNG với lớp mô mềm nạp bằng script, khai ở `softTissue.ts` và sinh ra
 * `modelsGenerated.ts`.
 *
 * ĐÃ SỬA LẠI MỘT KẾT LUẬN CŨ. Chỗ này từng viết "khu thú y chỉ là mẫu vật minh
 * hoạ" vì tin rằng ngoài xương thì không có gì cấp phép sạch. Rà lại bằng
 * Sketchfab Data API (lọc `downloadable=true` + giấy phép cc0/by/by-sa, 29 truy
 * vấn × 15 tài khoản) thì ra 14 mẫu MÔ MỀM đều CC BY 4.0: cơ, nội tạng, mạch,
 * tai — của Ontario Veterinary College, FU Berlin, Pixelbeaker, 3DVet_Printing.
 * Bò từ chỗ KHÔNG có mô hình nào nay có ba.
 *
 * Vế vẫn đúng của kết luận cũ: KHÔNG bộ nào gắn nhãn từng bộ phận như
 * Z-Anatomy, nên hotspot vẫn phải đặt theo toạ độ, và các lớp KHÔNG chồng lên
 * nhau được (mỗi lớp một mẫu vật, khác tỉ lệ, khác gốc toạ độ) — trang loài
 * cho CHUYỂN lớp và nói rõ điều đó với người học.
 *
 * Lợn nay có bộ xương GẮN NHÃN TỪNG XƯƠNG lấy từ Z-PIG (Z-Anatomy, CC BY-SA)
 * — loài đầu tiên của khu thú y bấm vào từng xương ra đúng tên như bên người.
 * Còn thiếu hẳn: gà, và phần mềm của lợn. Xem VET_MODEL_CANDIDATES.
 *
 * Đường lấy được: Zenodo lưu bản sao Objaverse 1.0 của các mô hình Sketchfab
 * giấy phép CC — tải thẳng bằng HTTP. Còn Sketchfab thì tải bằng API token cá
 * nhân (xem `import-lmu-models.mjs` và `import-vet-soft-tissue.mjs`).
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
const handPickedVetModels: VetModel[] = [
  // ── BỘ XƯƠNG TOÀN THÂN ───────────────────────────────────────────────────
  // Ba mẫu này giấy phép CC BY (cho phép tác phẩm phái sinh) nên GIẢM LƯỚI ĐƯỢC,
  // khác hẳn bộ xương rời của LMU vốn mang ND. Nhờ vậy bộ xương chó 13,8 MB
  // xuống 1,1 MB và mèo 18,9 MB xuống 1,2 MB mà vẫn còn 260.000 tam giác — đủ
  // chi tiết để đọc từng đốt sống. Đã dựng lại ba trục bằng Blender để chắc
  // giảm lưới không làm vỡ hình.
  {
    slug: "dog-skeleton",
    species: "dog",
    layer: "skeleton",
    region: "whole",
    title: {
      vi: "Bộ xương chó, toàn thân",
      en: "Dog skeleton, whole body",
      zh: "犬全身骨骼",
    },
    file: "dog-skeleton.glb",
    license: "CC BY 4.0",
    attribution: "PratyushParag — “Dog Skeleton” (đã giảm lưới cho web)",
    sourceUrl: "https://sketchfab.com/3d-models/dog-skeleton-9d8a370acbd04f93a7a6fcd15ef36eda",
    hotspots: [
      { factId: "dogcat-vertebral-formula", position: [0.001, 0.19, -0.127] },
      { factId: "dogcat-clavicle", position: [0.072, 0.106, 0.233] },
    ],
  },
  {
    slug: "cat-skeleton",
    species: "cat",
    layer: "skeleton",
    region: "whole",
    title: {
      vi: "Bộ xương mèo, toàn thân",
      en: "Cat skeleton, whole body",
      zh: "猫全身骨骼",
    },
    file: "cat-skeleton.glb",
    license: "CC BY 4.0",
    attribution: "westerly — “Feline Skeleton Dec” (đã giảm lưới cho web)",
    sourceUrl: "https://sketchfab.com/3d-models/feline-skeleton-dec-a5d0bb8f55dc4f49b103cd20d65e0b17",
    hotspots: [
      { factId: "dogcat-vertebral-formula", position: [0.038, 0.794, -0.209] },
      { factId: "dogcat-clavicle", position: [0.225, 0.585, 0.92] },
    ],
  },
  {
    slug: "horse-skeleton",
    species: "horse",
    layer: "skeleton",
    region: "whole",
    title: {
      vi: "Bộ xương ngựa, toàn thân",
      en: "Horse skeleton, whole body",
      zh: "马全身骨骼",
    },
    file: "horse-skeleton.glb",
    license: "CC BY 4.0",
    attribution: "Diego Luján García — “Horse Skeleton”",
    sourceUrl: "https://sketchfab.com/3d-models/horse-skeleton-eaca504567604e879b8ab2cf2763025e",
    hotspots: [
      { factId: "horse-stay-apparatus", position: [0.62, -0.157, -2.192] },
      { factId: "horse-large-colon", position: [0.774, 0.391, -0.391] },
    ],
  },
  {
    slug: "dog-skull",
    species: "dog",
    layer: "skeleton",
    region: "head",
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
    layer: "skeleton",
    region: "head",
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
  // ── LỢN: bộ xương ĐÃ GẮN NHÃN TỪNG XƯƠNG ─────────────────────────────────
  // Bước ngoặt của khu thú y. Mọi mẫu trước đó là khối quét liền, tách bộ phận
  // phải dựa vào tên vật liệu do người quét tình cờ đặt, hoặc phải đánh dấu
  // bằng toạ độ. Z-PIG (Z-Anatomy) là bộ giải phẫu thú y dựng tay, 120 xương
  // mỗi cái một object có tên thật — nên lợn là loài ĐẦU TIÊN bấm vào từng
  // xương ra đúng tên như bên người.
  //
  // GIẤY PHÉP KHÁC HẲN phần còn lại: CC BY-SA 4.0 (ShareAlike). Tệp .glb dựng
  // ra từ nó là tác phẩm phái sinh nên phải phát hành lại CÙNG giấy phép —
  // ghi công thôi chưa đủ. Và đừng gộp mẫu này chung một tệp với mẫu CC BY của
  // nguồn khác: gộp là kéo cả tệp ấy vào ràng buộc ShareAlike.
  //
  // Tên bộ phận sinh từ `scripts/vet/build-pig-bones.mjs` (nhãn gốc tiếng Pháp
  // → slug + NAV + vi/en/zh). Cùng tệp đó đặt tên vật liệu trong .glb, nên
  // danh sách bộ phận và hình học không thể lệch nhau.
  {
    slug: "pig-skeleton",
    species: "pig",
    layer: "skeleton",
    region: "whole",
    title: {
      vi: "Bộ xương lợn, toàn thân",
      en: "Pig skeleton, whole body",
      zh: "猪全身骨骼",
    },
    file: "pig-skeleton.glb",
    license: "CC BY-SA 4.0",
    attribution: "Z-Anatomy — “Z-PIG” (đã giảm lưới cho web; phát hành lại theo CC BY-SA 4.0)",
    sourceUrl: "https://github.com/LluisV/Z-Anatomy",
    // Không cần điểm chú giải: mẫu này bấm thẳng vào từng xương ra tên, chứ
    // không phải khối liền cần đánh dấu bằng toạ độ như các mẫu quét khác.
    hotspots: [],
    parts: PIG_BONES,
    partGroups: PIG_PART_GROUPS,
    partsFrom: "atlas",
  },
  {
    slug: "pig-skull",
    species: "pig",
    layer: "skeleton",
    region: "head",
    title: {
      vi: "Sọ lợn, hàm dưới và xương móng",
      en: "Pig skull, mandible and hyoid",
      zh: "猪颅骨、下颌骨与舌骨",
    },
    file: "pig-skull.glb",
    license: "CC BY-SA 4.0",
    attribution: "Z-Anatomy — “Z-PIG” (phát hành lại theo CC BY-SA 4.0)",
    sourceUrl: "https://github.com/LluisV/Z-Anatomy",
    hotspots: [],
    partsFrom: "atlas",
    // Sọ tách riêng và KHÔNG giảm lưới: răng nanh sữa (“răng kim”) của lợn con
    // là nội dung dạy thật — giảm lưới xuống là mất luôn ranh giới từng răng.
    parts: PIG_BONES.filter((p) => PIG_BONE_GROUP_OF[p.material] === "head"),
  },
  {
    slug: "horse-skull",
    species: "horse",
    layer: "skeleton",
    region: "head",
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

/**
 * Sổ đăng ký cuối cùng = mẫu đặt tay + mẫu do `import-vet-soft-tissue.mjs` nạp.
 *
 * Tách hai nguồn vì tệp sinh ra bị GHI ĐÈ mỗi lần chạy script; trộn chung thì
 * một lần nạp lại là mất sạch phần biên tập tay.
 */
export const vetModels: VetModel[] = [...handPickedVetModels, ...generatedVetModels];

export const vetModelsOfSpecies = (species: VetSpeciesKey) =>
  vetModels.filter((m) => m.species === species);

/** Các lớp có mẫu vật thật cho một loài, xếp theo thứ tự bóc lớp. */
export const vetLayersOfSpecies = (species: VetSpeciesKey) => {
  const have = new Set(vetModelsOfSpecies(species).map((m) => m.layer));
  return VET_LAYER_ORDER.filter((l) => have.has(l));
};

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
    what: "Sọ bò (Bos taurus) — bò đã có khung chậu, chi trước và dạ cỏ, còn thiếu đúng cái sọ",
    where: "MorphoSource / Sketchfab — Zenodo KHÔNG có (rà 25+ truy vấn ngày 27/08/2026, thứ ra được chỉ là phù điêu đầu bò trang trí ở lâu đài Beynac)",
    license: "Thay đổi theo từng mẫu — phải kiểm trước khi dùng",
    howToGet: "Đăng nhập MorphoSource rồi tải thủ công; hoặc chờ Objaverse đợt sau đổ thêm lên Zenodo.",
  },
  {
    species: "pig",
    what: "MÔ MỀM lợn (nội tạng, cơ) — XƯƠNG THÌ XONG RỒI, xem pig-skeleton và pig-skull",
    where: "Z-PIG chỉ dựng hệ xương. Phần mềm phải rà tiếp bằng Sketchfab Data API như đợt mô mềm chó/mèo/bò",
    license: "Phần lớn CC BY-NC — kiểm từng bản ghi",
    howToGet: "Chạy lại vòng rà với từ khoá lợn / sus scrofa / porcine; loại ND vì ta có giảm lưới.",
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
