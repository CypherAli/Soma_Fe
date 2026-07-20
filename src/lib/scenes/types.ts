import type { T3 } from "../homeContent";
import type { SystemKey } from "@/store/useAnatomyStore";

export type SceneHotspot = {
  key: string;
  /**
   * Tên mesh CHÍNH XÁC trong glTF gốc (Z-Anatomy/TA2), đã verify tồn tại
   * thật bằng cách đọc JSON chunk của .glb tương ứng — không tự đoán tên.
   */
  meshName: string;
  /** Lệch label so với điểm neo (px màn hình) — chỉ để tránh đè chữ giữa các pin. */
  offset: [number, number];
  /** Tên hiển thị chuẩn giải phẫu 3 ngôn ngữ — ưu tiên hơn tên kỹ thuật meshName. */
  label?: T3;
  /** Tên Latin/TA2 chuẩn (VD "Hepar"), hiển thị kèm trong bảng thông tin. */
  latinName?: string;
  /**
   * Ghi chú giải phẫu ngắn — hiển thị NGAY trong danh sách Nhãn (không cần
   * pin nổi trên mô hình 3D nữa, đã bỏ vì hay đặt lệch vị trí thật).
   */
  note?: T3;
};

export type SceneModule = {
  slug: string;
  title: T3;
  /**
   * Mô tả gốc tự viết dựa trên kiến thức giải phẫu phổ thông (mức đốt sống
   * T12), KHÔNG sao chép nguyên văn từ bất kỳ nguồn có bản quyền nào.
   */
  description: T3;
  /** Hệ mặc định bật khi vào scene — hệ khác tắt để đúng khung hình như tham khảo. */
  visibleSystems: SystemKey[];
  /**
   * Nếu có: đường dẫn tới model ĐÃ CẮT SẴN riêng cho scene (một phần cơ thể,
   * xuất từ Blender — cắt ngang + bịt nắp). Khi có, trang scene nạp ĐÚNG file
   * này thay vì full-body 7 hệ → nhẹ máy + đúng "từng phần" như BioDigital.
   */
  modelFile?: string;
  /**
   * Chỉ liệt kê cấu trúc ĐÃ XÁC NHẬN có mesh thật trong dữ liệu đã xuất.
   * Một số nhãn có trong tham khảo gốc (Spleen, Abdominal aorta, Inferior
   * vena cava, Liver) CHƯA đưa vào vì chưa có dữ liệu 3D tương ứng — xem
   * ghi chú trong Hotspots.tsx.
   */
  hotspots: SceneHotspot[];
};
