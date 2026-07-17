import * as THREE from "three";
import type { SystemKey } from "@/store/useAnatomyStore";

export function getStd(mesh: THREE.Mesh): THREE.MeshStandardMaterial | null {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial
    ? (mat as THREE.MeshStandardMaterial)
    : null;
}

/** Màu mô theo tên material gốc Z-Anatomy (chỉ áp khi material còn trắng mặc định). */
export const TISSUE_COLORS: Record<string, string> = {
  Bone: "#e8dfc8",
  Teeth: "#f2ede0",
  "Teeth-roots": "#f2ede0",
  Ligament: "#e0d3a0",
  Tendon: "#e0c98a",
  Artery: "#c23b3b",
  Vein: "#3a5fc2",
  Organ: "#c98a7c",
  Mucosa: "#d98a94",
  Gland: "#d9b89a",
  Bronchi: "#d9a08a",
  Ductus: "#d9b89a",
  Nerve: "#e8c468",
  "Articular capsule": "#d9c9a0",
  Muscle: "#a5433e",
};

export const SYSTEM_FALLBACK_COLOR: Record<SystemKey, string> = {
  skeletal: "#e8dfc8",
  muscular: "#a5433e",
  nervous: "#e8c468",
  cardiovascular: "#c23b3b",
  visceral: "#c98a7c",
  lymphoid: "#a8c98a",
  joints: "#d9c9a0",
};

/** Màu ép buộc lớp "vỏ ngoài" (Fascia/Superficial) → tông da ấm (lựa chọn 3A). */
export const FORCED_COLORS: Record<string, string> = {
  Fascia: "#d8b090",
  Superficial: "#cfa07e",
};

/** Độ nhám theo loại mô để bớt cảm giác phẳng nhựa. */
export const TISSUE_ROUGHNESS: Record<string, number> = {
  Organ: 0.42,
  Mucosa: 0.38,
  Intestine: 0.45,
  Gallbladder: 0.4,
  Lung: 0.55,
  Peritoneum: 0.35,
  Gland: 0.45,
  Bone: 0.7,
  Teeth: 0.35,
  Cartilage: 0.5,
  Fascia: 0.78,
  Superficial: 0.72,
  Ligament: 0.6,
  Tendon: 0.55,
  Artery: 0.5,
  Vein: 0.5,
  Nerve: 0.6,
};

/**
 * Chuẩn hoá 1 scene glTF vừa nạp: clone material để highlight độc lập, ẩn
 * mesh nhãn ("VISCERAL SYSTEMS"...), tắt emissive lỗi export, tô màu mô +
 * độ nhám. `fallbackSystem` chỉ dùng cho mesh trắng không rõ loại.
 */
export function prepareAnatomyScene(scene: THREE.Object3D, fallbackSystem: SystemKey) {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;

    // Ẩn nhãn text 3D (tên hệ nổi lơ lửng): tên kết thúc "_systemg"/"_systemsg"
    // hoặc material "Text". Một số nhãn KHÔNG có material nên phải lọc theo tên.
    const stdEarly = getStd(mesh);
    if (/_systems?g$/i.test(mesh.name) || stdEarly?.name === "Text") {
      mesh.userData.isLabel = true;
    }

    if (!mesh.material) return;
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map((m) => m.clone())
      : mesh.material.clone();
    const std = getStd(mesh);
    if (!std) return;

    std.emissive.setScalar(0);
    std.emissiveIntensity = 0;

    const base = std.name.replace(/-\d+$/, "").trim();
    const isDefaultWhite = std.color.r === 1 && std.color.g === 1 && std.color.b === 1;
    if (FORCED_COLORS[base]) {
      std.color.set(FORCED_COLORS[base]);
    } else if (isDefaultWhite) {
      std.color.set(TISSUE_COLORS[base] ?? SYSTEM_FALLBACK_COLOR[fallbackSystem]);
    }

    std.metalness = 0;
    const roughKey = Object.keys(TISSUE_ROUGHNESS).find((k) => base.startsWith(k));
    std.roughness = roughKey ? TISSUE_ROUGHNESS[roughKey] : 0.5;
  });
}

/** Áp trạng thái Ẩn/Mờ/Cô lập lên toàn scene theo tên mesh. */
export function applyVisibility(
  scene: THREE.Object3D,
  hiddenIds: Record<string, boolean>,
  fadedIds: Record<string, boolean>,
  isolatedId: string | null,
) {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const isolatedOut = isolatedId !== null && mesh.name !== isolatedId;
    mesh.visible = !mesh.userData.isLabel && !hiddenIds[mesh.name] && !isolatedOut;
    const std = getStd(mesh);
    if (std) {
      const faded = !!fadedIds[mesh.name];
      std.transparent = faded;
      std.opacity = faded ? 0.15 : 1;
    }
  });
}
