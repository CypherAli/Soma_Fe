import type { T3 } from "@/lib/homeContent";

/**
 * GIẢI PHẪU THÚ Y — kiểu dữ liệu dùng chung.
 *
 * VÌ SAO KHÔNG DÙNG LẠI KIỂU CỦA BÊN NGƯỜI: bên người mỗi mục tri thức gắn với
 * một `meshName` có thật trong file .glb đã verify. Bên thú y KHÔNG có bộ mesh
 * gắn nhãn nào cấp phép sạch (Z-Anatomy chỉ có người; các scan thú y mở đều là
 * khối liền, không tên bộ phận). Nếu bê nguyên kiểu cũ sang thì mọi mục đều
 * phải bịa một `meshName` không tồn tại — đúng kiểu "làm cho có" rồi sập khi
 * verify. Ở đây tri thức đứng độc lập với mô hình: có mesh thì gắn thêm, chưa
 * có thì nội dung vẫn dùng được, tra được, ra đề trắc nghiệm được.
 *
 * NGUYÊN TẮC NỘI DUNG (giữ đúng như bên người):
 *   - Mỗi mục phải ghi `source` là giáo trình thú y thật, có lần xuất bản.
 *   - Thuật ngữ Latin theo NAV (Nomina Anatomica Veterinaria) — với gia cầm thì
 *     theo NAA (Nomina Anatomica Avium). Đây là chuẩn quốc tế của ngành thú y,
 *     KHÁC với Terminologia Anatomica của người: cùng một xương, người gọi
 *     "Tibia" thì thú y vẫn "Tibia", nhưng hướng thì người dùng "anterior /
 *     posterior" còn thú y dùng "cranial / caudal", "dorsal / ventral".
 *   - Trường `compare` là phần đắt giá nhất và là lý do tồn tại của trang này:
 *     sinh viên thú y học bằng cách đối chiếu — biết dạ dày bò khác dạ dày chó
 *     ở đâu thì mới hiểu vì sao bò chướng hơi dạ cỏ còn chó thì xoắn dạ dày.
 */

/** Sáu loài trong phạm vi — thú nhỏ, ngựa, gia súc lớn, lợn và gia cầm. */
export type VetSpeciesKey = "dog" | "cat" | "horse" | "cattle" | "pig" | "chicken";

export const VET_SPECIES: VetSpeciesKey[] = ["dog", "cat", "horse", "cattle", "pig", "chicken"];

export type VetSystemKey =
  | "skeletal"
  | "muscular"
  | "digestive"
  | "respiratory"
  | "cardiovascular"
  | "urogenital"
  | "nervous"
  | "senses"
  | "integument"
  | "lymphoid";

/** Vùng cơ thể theo cách chia của giải phẫu thú y (bốn chân, không phải chi trên/dưới). */
export type VetRegionKey = "head" | "neck" | "trunk" | "forelimb" | "hindlimb" | "tail" | "whole";

export type VetFact = {
  /** khoá duy nhất: <loài>-<slug ngắn> */
  id: string;
  /** Loài mà mục này mô tả. Nhiều loài khi nội dung đúng cho cả nhóm. */
  species: VetSpeciesKey[];
  system: VetSystemKey;
  region: VetRegionKey;
  name: T3;
  /** Thuật ngữ NAV/NAA (Latin). */
  nav: string;
  /** Mô tả cấu trúc — cái gì, nằm đâu, làm gì. */
  note: T3;
  /** Khác biệt so với người hoặc giữa các loài. Đây là phần cốt lõi. */
  compare?: T3;
  /** Ý nghĩa lâm sàng thú y: bệnh hay gặp, thủ thuật, mốc thăm khám. */
  clinical?: T3;
  /** Giáo trình + lần xuất bản. */
  source: string;
  /** Từ khoá tìm kiếm thêm (đã bỏ dấu), khi tên gọi dân gian khác tên sách. */
  keys?: string[];
};

/**
 * LỚP GIẢI PHẪU của một mô hình.
 *
 * Bên người bóc lớp được vì mọi lớp cùng đến từ MỘT bộ dữ liệu (Z-Anatomy) nên
 * chung một hệ toạ độ. Bên thú y thì mỗi lớp là một mẫu vật khác, do một cơ sở
 * khác quét, khác tỉ lệ và khác gốc toạ độ — chồng lên nhau sẽ lệch. Vì vậy ở
 * đây "lớp" là để CHUYỂN QUA LẠI, không phải để chồng trong suốt. Nói rõ chỗ
 * này để sau không ai cố ghép rồi tưởng mình làm sai.
 */
export type VetLayerKey =
  | "skin"
  | "muscle"
  | "vessel"
  | "nerve"
  | "viscera"
  | "senses"
  | "skeleton";

/**
 * Thứ tự bóc lớp — NGOÀI VÀO TRONG, đúng trình tự trên bàn giải phẫu:
 * da → cơ → mạch máu → thần kinh → nội tạng → giác quan → bộ xương.
 *
 * Thứ tự cũ đặt nội tạng ngay sau cơ là SAI trình tự: mạch máu và thần kinh
 * nằm giữa các lớp cơ và trên thành xoang, phải gỡ chúng TRƯỚC khi mở xoang
 * ngực – bụng. Mở tạng ra rồi mới quay lại tìm mạch là làm ngược, và người học
 * đi theo thứ tự ấy sẽ nhớ sai quan hệ vị trí.
 *
 * Lớp `skin` có trong danh sách dù CHƯA CÓ MẪU VẬT NÀO: đó là lớp đầu tiên
 * người ta gỡ, để trống mà không nói gì thì trang trông như bắt đầu từ giữa
 * chừng. Khung xem hiện đủ bảy lớp và ghi rõ lớp nào chưa có mẫu.
 */
export const VET_LAYER_ORDER: VetLayerKey[] = [
  "skin",
  "muscle",
  "vessel",
  "nerve",
  "viscera",
  "senses",
  "skeleton",
];

/**
 * MỘT BỘ PHẬN TÁCH ĐƯỢC trong mẫu vật, nhận diện qua TÊN VẬT LIỆU.
 *
 * Bên người nhận diện cấu trúc qua tên mesh do Z-Anatomy gắn. Mẫu quét thú y
 * không có thứ đó — mesh toàn tên "Object_0". Nhưng vài mẫu (của Pixelbeaker
 * và OVC) lại gắn nhãn giải phẫu ở TÊN VẬT LIỆU: "default_05b_Liver_1",
 * "default_06b_Intestines_dec"… Đó là chỗ bấu víu duy nhất, và nó đủ để tách
 * từng cơ quan như bên người.
 *
 * Vì thế bước nén trong `import-vet-soft-tissue.mjs` bị cấm gộp mesh/trộn vật
 * liệu: gộp là mất nhãn. Mẫu nào chỉ có một vật liệu thì thật sự là khối liền,
 * `parts` để trống và trang nói thẳng là không tách được.
 */
export type VetModelPart = {
  /** Tên vật liệu trong tệp .glb — khoá để gom mesh lúc chạy. */
  material: string;
  /**
   * Mục tri thức mà bộ phận này ứng với.
   *
   * Vùng do `segment_by_seeds.py` cắt ra lấy luôn `factId` làm TÊN VẬT LIỆU,
   * nên hình học và nội dung nối nhau bằng đúng một khoá — không phải chép tên
   * vào hai chỗ rồi để chúng lệch nhau. Có `factId` thì tên và thuật ngữ NAV
   * đọc thẳng từ kho tri thức.
   */
  factId?: string;
  /** Tên tự đặt, cho bộ phận KHÔNG ứng với mục tri thức nào (lớp da, khối máu). */
  name?: T3;
  /** Thuật ngữ NAV nếu bộ phận ứng với một cấu trúc có tên. */
  nav?: string;
  /**
   * Khoá nhóm, khớp với `VetModel.partGroups`.
   *
   * Chỉ cần khi mẫu vật có QUÁ NHIỀU bộ phận để đọc thành một danh sách phẳng.
   * Bộ xương lợn có 120 xương: không chia mục thì thanh bên thành một dải cuộn
   * dài, muốn tìm xương sườn số 9 phải lăn qua cả cột sống.
   */
  group?: string;
};

/** Một mô hình 3D thú y đã nạp được — xem `src/lib/vet/models.ts`. */
export type VetModel = {
  slug: string;
  species: VetSpeciesKey;
  /** Lớp giải phẫu mà mẫu vật này thuộc về — dùng cho bộ chuyển lớp. */
  layer: VetLayerKey;
  /** Vùng cơ thể mẫu vật bao phủ; `whole` là toàn thân. */
  region: VetRegionKey;
  title: T3;
  /** Tệp trong /public/models/vet/. */
  file: string;
  /** Giấy phép và nguồn gốc — BẮT BUỘC, hiện ngay trên trang xem. */
  license: string;
  attribution: string;
  sourceUrl: string;
  /**
   * Điểm chú giải đặt THEO TOẠ ĐỘ, không theo tên mesh.
   *
   * Scan thú y mở là một khối liền không có tên bộ phận, nên không thể gắn nhãn
   * theo `meshName` như bên người. Mỗi điểm là một vị trí trên bề mặt mẫu vật,
   * ánh xạ tới một mục tri thức qua `factId`.
   */
  hotspots: { factId: string; position: [number, number, number] }[];
  /**
   * Vùng được CẮT RA bằng `segment_by_seeds.py`, không phải nhãn của tác giả.
   *
   * Ranh giới giữa hai vùng nằm ở chỗ cách đều hai điểm mồi trên bề mặt, không
   * phải ở chỗ hai cơ thật sự giáp nhau. Trang xem phải nói thẳng điều này —
   * người học không được tưởng đây là mesh gắn nhãn như Z-Anatomy.
   */
  segmented?: boolean;
  /** Bộ phận tách được. Vắng mặt = mẫu là khối liền, không tách được. */
  parts?: VetModelPart[];
  /**
   * Mục để xếp `parts` — theo ĐÚNG thứ tự khai ở đây. Không khai thì danh sách
   * bộ phận hiện phẳng như cũ.
   */
  partGroups?: { key: string; title: T3 }[];
  /**
   * Tên bộ phận ở đâu ra — quyết định câu giải thích hiện dưới bảng thông tin.
   *
   * "scan-materials" (mặc định) là mẫu quét mà tác giả tình cờ đặt tên vật liệu
   * theo cơ quan. "atlas" là bộ giải phẫu dựng tay, mỗi cấu trúc một vật thể
   * riêng có tên NAV thật (Z-PIG). Hai nguồn ấy tin được ở mức KHÁC HẲN nhau,
   * nên không được nói với người học bằng cùng một câu.
   */
  partsFrom?: "scan-materials" | "atlas";
};
