/**
 * Danh mục scene 3D — file tổng hợp.
 *
 * Nội dung từng scene nằm trong `scenes/<hệ>.ts` (trước đây tất cả dồn vào
 * một file 2666 dòng, sửa một scene phải cuộn qua toàn bộ các hệ khác).
 * File này chỉ gộp lại và giữ nguyên API cũ (`sceneModules`, `getSceneModule`,
 * `defaultViewerHotspots`, các type) nên mọi nơi đang import không phải sửa.
 *
 * Thêm scene mới: tạo/ mở file trong `scenes/`, rồi thêm vào phép gộp bên dưới.
 */

import { digestiveScenes } from "./scenes/digestive";
import { cardiovascularScenes } from "./scenes/cardiovascular";
import { skeletalScenes } from "./scenes/skeletal";
import { muscularScenes } from "./scenes/muscular";
import { respiratoryScenes } from "./scenes/respiratory";
import { miscScenes } from "./scenes/misc";
import { auditoryScenes } from "./scenes/auditory";
import { reproductiveScenes } from "./scenes/reproductive";
import { connectiveScenes } from "./scenes/connective";
import type { SceneHotspot, SceneModule } from "./scenes/types";

export type { SceneHotspot, SceneModule };

/**
 * Thứ tự gộp = thứ tự hiển thị "mới cập nhật" trên trang chủ (catalog đảo
 * ngược mảng này), nên hệ dựng sau đặt ở cuối.
 */
export const sceneModules: Record<string, SceneModule> = {
  ...digestiveScenes,
  ...cardiovascularScenes,
  ...skeletalScenes,
  ...muscularScenes,
  ...respiratoryScenes,
  ...miscScenes,
  ...auditoryScenes,
  ...reproductiveScenes,
  ...connectiveScenes,
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
