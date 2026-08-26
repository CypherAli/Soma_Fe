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

/** Một mô hình 3D thú y đã nạp được — xem `src/lib/vet/models.ts`. */
export type VetModel = {
  slug: string;
  species: VetSpeciesKey;
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
};
