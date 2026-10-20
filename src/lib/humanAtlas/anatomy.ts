
import { bindContentSource } from "@/lib/content/source";
/**
 * Danh mục hệ cơ quan của atlas toàn thân — chuyển từ human-atlas/app/anatomy.ts.
 *
 * `id` và mã màu GIỮ NGUYÊN từ bản gốc: `system` của từng part trong
 * `atlas.json` tra thẳng vào đây, đổi một chữ là 2.234 mảnh mất màu. Chỉ tên
 * và mô tả được dịch sang tiếng Việt cho khớp phần còn lại của Soma 3D.
 *
 * Dữ liệu: BodyParts3D 4.0 © Database Center for Life Science, CC BY 4.0.
 * Xem public/human-atlas/ATTRIBUTION.md.
 */
export type SystemId =
  | "skeletal"
  | "muscular"
  | "arterial"
  | "venous"
  | "nervous"
  | "digestive"
  | "respiratory"
  | "urinary"
  | "reproductive"
  | "lymphatic"
  | "endocrine"
  | "integumentary"
  | "connective"
  | "sensory"
  | "cardiac";

export const SYSTEMS: {
  id: SystemId;
  name: string;
  color: string;
  description: string;
}[] = bindContentSource("data:src/lib/humanAtlas/anatomy.ts#SYSTEMS", [
  {
    id: "skeletal",
    name: "Hệ xương",
    color: "#e2d9ba",
    description:
      "Xương tạo nên bộ khung nâng đỡ cơ thể, bảo vệ nội tạng và làm điểm bám cho cơ. Mô bên trong xương còn dự trữ khoáng chất và sinh ra tế bào máu.",
  },
  {
    id: "muscular",
    name: "Hệ cơ",
    color: "#a85b50",
    description:
      "Cơ vân sinh ra vận động bằng cách kéo vào các điểm bám. Cùng với gân, chúng làm cử động khớp, giữ tư thế và sinh nhiệt.",
  },
  {
    id: "cardiac",
    name: "Tim",
    color: "#b96760",
    description:
      "Tim là khối cơ bơm máu với bốn buồng. Các van tim hướng dòng máu đi một chiều qua vòng tuần hoàn phổi và vòng tuần hoàn hệ thống.",
  },
  {
    id: "sensory",
    name: "Cơ quan giác quan",
    color: "#b0c8ce",
    description:
      "Các cấu trúc đảm nhiệm những giác quan đặc biệt như thị giác, thính giác và thăng bằng. Mô chuyên biệt của chúng bắt kích thích rồi phối hợp với hệ thần kinh để truyền tin.",
  },
  {
    id: "arterial",
    name: "Động mạch",
    color: "#c05245",
    description:
      "Tim đẩy máu đi khắp vòng tuần hoàn. Động mạch dẫn máu rời tim để nuôi mô, riêng vòng tiểu tuần hoàn thì dẫn máu lên phổi.",
  },
  {
    id: "venous",
    name: "Tĩnh mạch",
    color: "#527c9f",
    description:
      "Tĩnh mạch đưa máu trở về tim. Mạng nông và mạng sâu gom máu từ các mô; tĩnh mạch phổi mang máu giàu oxy từ phổi về.",
  },
  {
    id: "nervous",
    name: "Hệ thần kinh",
    color: "#d8b565",
    description:
      "Não, tuỷ sống và dây thần kinh ngoại biên dẫn truyền và xử lý tín hiệu, đảm nhiệm cảm giác, vận động, phối hợp và điều hoà tự động các chức năng cơ thể.",
  },
  {
    id: "respiratory",
    name: "Hệ hô hấp",
    color: "#b98991",
    description:
      "Đường dẫn khí đưa không khí tới phổi, nơi oxy và carbon dioxide trao đổi giữa khí và máu. Hô hấp dựa vào chênh lệch áp suất do các cơ hô hấp tạo ra.",
  },
  {
    id: "digestive",
    name: "Hệ tiêu hoá",
    color: "#b8916b",
    description:
      "Ống tiêu hoá phân giải thức ăn, hấp thu dưỡng chất và nước rồi đẩy chất thải đi tiếp. Các tạng phụ thuộc góp mật và men tiêu hoá.",
  },
  {
    id: "urinary",
    name: "Hệ tiết niệu",
    color: "#b47961",
    description:
      "Thận lọc máu và điều hoà cân bằng dịch, điện giải, toan kiềm. Nước tiểu theo niệu quản xuống bàng quang rồi ra ngoài qua niệu đạo.",
  },
  {
    id: "lymphatic",
    name: "Hệ bạch huyết",
    color: "#879f7c",
    description:
      "Mạch bạch huyết đưa dịch mô dư thừa trở lại tuần hoàn. Hạch bạch huyết và các cơ quan lympho khác đảm nhiệm giám sát và đáp ứng miễn dịch.",
  },
  {
    id: "endocrine",
    name: "Hệ nội tiết",
    color: "#c5a09a",
    description:
      "Các tuyến nội tiết tiết hormone vào máu để điều phối những quá trình như chuyển hoá, tăng trưởng, đáp ứng stress và sinh sản.",
  },
  {
    id: "reproductive",
    name: "Hệ sinh dục",
    color: "#bda098",
    description:
      "Các cấu trúc sinh dục nam trong bộ dữ liệu này tham gia sinh tinh, làm tinh trùng trưởng thành, vận chuyển tinh trùng và sản xuất hormone sinh dục.",
  },
  {
    id: "integumentary",
    name: "Bề mặt cơ thể",
    color: "#ba9b7d",
    description:
      "Bề mặt cơ thể là mốc giải phẫu bên ngoài. Hệ da tạo hàng rào bảo vệ, góp phần vào cảm giác và điều hoà thân nhiệt.",
  },
  {
    id: "connective",
    name: "Mô liên kết",
    color: "#aec3bb",
    description:
      "Sụn, dây chằng và các mô liên kết khác nâng đỡ, nối và ngăn cách các cấu trúc. Chúng giữ vững khớp và phân tán tải cơ học.",
  },
]);

export interface Part {
  id: string;
  name: string;
  conceptId: string;
  system: SystemId;
  chunk: number;
  positions: number;
  normals: number;
  indices: number;
  vertexCount: number;
  indexCount: number;
  bounds: [number[], number[]];
}
export interface Concept {
  id: string;
  name: string;
  elements: string[];
}
export interface Atlas {
  version: string;
  sex?: "male";
  source?: string;
  scope?: string;
  parts: Part[];
  concepts: Concept[];
  chunks: { url: string; bytes: number; gzip?: string; gzipBytes?: number }[];
  triangles: number;
}
/** `top`/`bottom`: nhìn thẳng xuống/lên — dùng cho bài lát cắt ngang (không có nút riêng). */
export type View = "three-quarter" | "front" | "back" | "side" | "top" | "bottom";
export type ClipAxis = "x" | "y" | "z";

/** Mặt cắt lát toàn thân — bản gốc human-atlas không có, Soma 3D thêm vào. */
export interface ClipState {
  enabled: boolean;
  axis: ClipAxis;
  /** Vị trí lát cắt, tính theo % bề rộng model dọc trục đã chọn. */
  percent: number;
  /** true = giữ nửa dương của trục, false = giữ nửa âm. */
  keepPositive: boolean;
}

export const DEFAULT_CLIP: ClipState = {
  enabled: false,
  axis: "y",
  percent: 50,
  keepPositive: false,
};

/** Nhãn chỉ dẫn kiểu atlas giáo khoa: một nhãn cho mỗi nhóm cấu trúc. */
export interface SceneLabel {
  /** Original atlas coordinates; the renderer adds the owning mesh displacement. */
  anchor?: [number, number, number];
  title?: string;
  key: string;
  ids: string[];
  text: string;
  color: string;
}

export interface SceneState {
  /** Localized mesh names supplied by the viewer; source names remain lookup keys. */
  partNames?: Record<string, string>;
  inspectorOpen?: boolean;
  /** Nhãn chỉ dẫn (đường dẫn + tên) — chỉ trang chuyên đề. */
  labels?: SceneLabel[];
  showLabels?: boolean;
  /** Chế độ chụp ảnh bìa: bỏ mọi lề giao diện, mô hình lấp đầy khung. */
  bare?: boolean;
  explode: number;
  visible: SystemId[];
  selected: string[];
  isolate: boolean;
  /** Frozen isolation scope; selecting another visible mesh does not reveal the body. */
  isolated?: string[];
  view: View;
  rotate: boolean;
  reset: number;
  /**
   * Giới hạn scene: khi khác rỗng, CHỈ những mảnh này được vẽ và khung ngắm
   * căn theo chúng. Dùng cho các trang chuyên đề (tim, phổi…) — cùng một bộ
   * dữ liệu toàn thân, chỉ đổi tập mảnh.
   */
  focus: string[];
  /**
   * Tập mảnh dùng để CĂN KHUNG NGẮM, khi muốn khác `focus`. Ví dụ scene tim
   * hiện cả tĩnh mạch chủ dưới chạy dài xuống bụng; ôm cả nó vào hộp bao thì
   * quả tim bị thu nhỏ còn một góc. Rỗng = căn theo `focus`.
   */
  frame: string[];
  /**
   * Ghi đè màu theo TỪNG MẢNH: mã mảnh -> màu hex.
   *
   * Cần vì atlas tô màu theo HỆ (`arterial` đỏ, `venous` xanh), mà vòng tiểu
   * tuần hoàn là ngoại lệ lớn nhất của quy tắc đó: động mạch phổi mang máu
   * NGHÈO oxy (phải xanh) còn tĩnh mạch phổi mang máu GIÀU oxy (phải đỏ).
   * Để nguyên là dạy sai cho sinh viên y.
   */
  tint: Record<string, string>;
  /** Mảnh bị ẩn thủ công (nút "Ẩn" ở tấm chi tiết). */
  hidden: string[];
  /** Mảnh đang làm mờ (nút "Làm mờ") — vẫn thấy nhưng nhìn xuyên qua được. */
  faded: string[];
  clip: ClipState;
}

/**
 * `integumentary` cố ý KHÔNG có ở đây — giống hệt bản gốc, lớp "Bề mặt cơ thể"
 * (5 mảnh) mặc định TẮT nên khung hình đầu tiên hiện 2.229/2.234 mảnh.
 */
export const DEFAULT_VISIBLE: SystemId[] = [
  "cardiac",
  "sensory",
  "skeletal",
  "muscular",
  "arterial",
  "venous",
  "nervous",
  "respiratory",
  "digestive",
  "urinary",
  "lymphatic",
  "endocrine",
  "reproductive",
  "connective",
];

/** Chú giải riêng cho vài tạng lớn; tra theo tên concept tiếng Anh của BodyParts3D. */
export const EXPLANATIONS: Record<string, string> = {
  heart:
    "Khối cơ bơm máu nằm trong lồng ngực. Nửa phải đẩy máu lên phổi, nửa trái đẩy máu đi khắp vòng tuần hoàn hệ thống.",
  liver:
    "Tạng lớn nằm dưới vòm hoành bên phải. Gan xử lý dưỡng chất hấp thu được, sản xuất mật và tổng hợp nhiều protein lưu hành trong máu.",
  brain:
    "Cơ quan trung tâm của hệ thần kinh. Các vùng liên kết với nhau đảm nhiệm tri giác, vận động, trí nhớ, ngôn ngữ và điều hoà chức năng cơ thể.",
  stomach:
    "Buồng cơ nằm giữa thực quản và ruột non. Dạ dày chứa và nhào trộn thức ăn với acid cùng men tiêu hoá trước khi đẩy xuống tá tràng.",
  spleen:
    "Cơ quan lympho ở vùng bụng trên bên trái. Lách lọc máu, loại bỏ tế bào máu già và tham gia đáp ứng miễn dịch.",
  pancreas:
    "Tạng trong ổ bụng vừa có vai trò tiêu hoá vừa nội tiết. Tụy cấp men cho ruột non và tiết các hormone trong đó có insulin và glucagon.",
  "urinary bladder":
    "Túi chứa bằng cơ nằm trong chậu hông, giữ nước tiểu từ thận đổ xuống qua niệu quản.",
  trachea:
    "Đường thở chính nối thanh quản với các phế quản. Các vòng sụn nâng đỡ giữ cho đường thở luôn mở khi hô hấp.",
  diaphragm:
    "Cơ dẹt rộng ngăn giữa lồng ngực và ổ bụng. Khi co, nó làm tăng thể tích lồng ngực và giúp hút khí vào phổi.",
};

export function explanation(name: string, system: SystemId) {
  return (
    EXPLANATIONS[name.toLowerCase()] ??
    SYSTEMS.find((s) => s.id === system)?.description ??
    ""
  );
}

/**
 * Bản gốc phục vụ atlas ở `/models/`, còn Soma_Fe đã có `public/models/` của
 * Z-Anatomy nên bộ này nằm ở `/human-atlas/`. Đổi đường dẫn ở ĐÂY chứ không
 * sửa `atlas.json` để file dữ liệu giữ nguyên y như bản phát hành gốc — nguồn
 * gốc và giấy phép còn truy được.
 */
export const ATLAS_BASE = "/human-atlas";
export const ATLAS_MANIFEST = `${ATLAS_BASE}/atlas.json`;
export function atlasAsset(url: string) {
  return url.replace(/^\/models\//, `${ATLAS_BASE}/`);
}
