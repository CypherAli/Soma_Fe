import type { T3 } from "./homeContent";
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

export const sceneModules: Record<string, SceneModule> = {
  "mat-cat-ngang-bung": {
    slug: "mat-cat-ngang-bung",
    title: {
      vi: "Mặt cắt ngang bụng",
      en: "Abdomen Transverse Section",
      zh: "腹部横切面",
    },
    description: {
      vi: "Mặt cắt ngang qua bụng ở mức đốt sống ngực T12 cho thấy các cơ quan tầng bụng trên nằm sát nhau. Do gan chiếm phần lớn không gian bên phải, thận phải thường thấp hơn thận trái khoảng nửa đốt sống — ở mức cắt này chỉ thận trái xuất hiện cùng dạ dày.",
      en: "A transverse section through the abdomen at the level of the 12th thoracic vertebra shows the closely packed upper abdominal organs. Because the liver occupies most of the right side, the right kidney sits roughly half a vertebra lower than the left — at this level only the left kidney appears alongside the stomach.",
      zh: "在第12胸椎水平的腹部横切面上，上腹部器官紧密排列。由于肝脏占据右侧大部分空间，右肾通常比左肾低约半个椎体——在此切面只能看到左肾与胃。",
    },
    visibleSystems: ["skeletal", "visceral"],
    modelFile: "/models/abdomen_section.glb",
    hotspots: [
      { key: "t12", meshName: "Vertebra T12", offset: [-150, -60] },
      { key: "liver", meshName: "Liver", offset: [-160, 30] },
      { key: "stomach", meshName: "Stomach", offset: [150, -70] },
      { key: "spleen", meshName: "Spleen", offset: [150, 40] },
      { key: "kidney-l", meshName: "Kidney.l", offset: [-150, 90] },
    ],
  },
};

export function getSceneModule(slug: string): SceneModule | undefined {
  return sceneModules[slug];
}

/**
 * Hotspot mặc định cho trang /viewer (toàn thân, hệ Nội tạng) — tách khỏi
 * Hotspots.tsx để dùng chung 1 nguồn dữ liệu duy nhất với các SceneModule.
 * "Liver" cố ý CHƯA đưa vào: trong glTF nó là node cha chứa 8 mesh phân
 * thùy con (không phải 1 mesh đơn) — Ẩn/Cô lập theo đúng nghĩa "cả lá gan"
 * cần xử lý riêng theo nhóm, để tạm ngoài danh sách thay vì gắn nửa vời.
 */
export const defaultViewerHotspots: SceneHotspot[] = [
  { key: "stomach", meshName: "Stomach", offset: [120, -70] },
  { key: "gallbladder", meshName: "Gallbladder", offset: [150, 0] },
  { key: "pancreas", meshName: "Pancreas", offset: [-20, 95] },
  { key: "kidney-l", meshName: "Kidney.l", offset: [-150, 45] },
  { key: "kidney-r", meshName: "Kidney.r", offset: [160, 55] },
  { key: "bladder", meshName: "Urinary bladder", offset: [10, 130] },
];
