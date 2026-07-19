import * as THREE from "three";
import type { SystemKey } from "@/store/useAnatomyStore";

export function getStd(mesh: THREE.Mesh): THREE.MeshStandardMaterial | null {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial
    ? (mat as THREE.MeshStandardMaterial)
    : null;
}

/**
 * Nhiều mesh (VD các thuỳ gan) có NHIỀU material slot trong 1 mesh (mạch
 * máu/ống mật bên trong tạng dùng material riêng). Chỉ xử lý `getStd()`
 * (material đầu tiên) bỏ sót các slot phụ này → chúng giữ nguyên màu gốc
 * (thường tối/đen), tạo cảm giác "lỗ thủng" khi nhìn dù thực ra không phải
 * lỗ hở. Dùng hàm này ở bất kỳ đâu cần tô màu/tô sáng TOÀN BỘ mesh.
 */
export function getAllStd(mesh: THREE.Mesh): THREE.MeshStandardMaterial[] {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.filter(
    (m): m is THREE.MeshStandardMaterial => !!m && (m as THREE.MeshStandardMaterial).isMeshStandardMaterial,
  );
}

/**
 * Màu mô theo tên material gốc Z-Anatomy (chỉ áp khi material còn trắng mặc
 * định). Bone sáng hơn + Muscle ngả nâu-xỉn (thay vì đỏ tươi) để 2 lớp này
 * không "đá màu" lẫn vào các tạng chính (xem HERO_ORGAN_COLORS) khi nhìn
 * mặt cắt — tương phản cao hơn giúp phân biệt xương/cơ/tạng dễ hơn.
 */
export const TISSUE_COLORS: Record<string, string> = {
  Bone: "#f0e6cc",
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
  Muscle: "#8b3f3a",
  Gallbladder: "#7a8a3f",
  Intestine: "#d99a8a",
  Cartilage: "#e8e0d0",
  Lung: "#d98a94",
  "Lung-base": "#d98a94",
  Diaphragm: "#a85a4a",
};

export const SYSTEM_FALLBACK_COLOR: Record<SystemKey, string> = {
  skeletal: "#f0e6cc",
  muscular: "#8b3f3a",
  nervous: "#e8c468",
  cardiovascular: "#c23b3b",
  visceral: "#c98a7c",
  lymphoid: "#a8c98a",
  joints: "#d9c9a0",
};

/**
 * Màu ép buộc lớp "vỏ ngoài" (Fascia/Superficial) → tông da ấm (lựa chọn 3A).
 * CHỈ áp cho scene KHÔNG PHẢI muscular — Z-Anatomy dùng lại đúng tên material
 * "Superficial" cho các cơ nằm lớp nông (VD Platysma, Frontalis) trong hệ
 * cơ, hoàn toàn khác nghĩa với lớp da/mạc ngoài ở scene mặt cắt cơ thể. Nếu
 * ép màu da cho scene cơ, cơ nông sẽ lẫn màu da thay vì màu cơ thống nhất.
 */
export const FORCED_COLORS: Record<string, string> = {
  Fascia: "#d8b090",
  Superficial: "#cfa07e",
};

/**
 * Z-Anatomy gộp mọi tạng đặc (gan/dạ dày/lách/thận) chung 1 material tên
 * "Organ" → cùng 1 màu nâu hồng, rất dễ nhầm lẫn giữa các tạng khi xem mặt
 * cắt. Ép màu riêng theo TÊN MESH (không phải material) cho từng tạng
 * chính, ưu tiên cao hơn màu theo material.
 */
export const HERO_ORGAN_COLORS: Record<string, string> = {
  liver: "#8a3823",
  kidney: "#d0853f",
  spleen: "#602f56",
  stomach: "#f2b9c2",
  appendix: "#c96b6b",
  suprarenal: "#e8c860",
  bladder: "#e0b87c",
};

/**
 * Scene "Liver Anatomy": tô riêng từng PHÂN THUỲ Couinaud (I-VIII) theo TÊN
 * MESH CHÍNH XÁC — bảng màu tương phản cao (không theo màu mô thật) vì mục
 * đích là dạy ranh giới phẫu thuật giữa các phân thuỳ, giống atlas y khoa
 * thật. Khớp trước HERO_ORGAN_COLORS (mọi tên đều chứa "liver" nên nếu để
 * heroKey xử lý trước sẽ tô đồng màu hết 8 phân thuỳ).
 *
 * Key dùng đúng dạng SAU KHI GLTFLoader sanitize (PropertyBinding.
 * sanitizeNodeName: khoảng trắng → "_", giữ nguyên ngoặc) — mesh.name lúc
 * runtime KHÔNG còn khoảng trắng như tên object gốc trong Blender. Sai chỗ
 * này làm cả 8 phân thuỳ rơi về đúng 1 màu hero chung (đã verify thật qua
 * screenshot: toàn gan 1 màu nâu, chỉ Gallbladder đúng màu vì tên không có
 * khoảng trắng nên không bị ảnh hưởng).
 */
/**
 * Scene "Heart Anatomy": 4 buồng tim + cơ nhú đều dùng chung material tên
 * "Trapezius" (Z-Anatomy tái sử dụng tên material cơ lưng cho mô tim — xem
 * bài học tương tự ở HERO_ORGAN_COLORS/gan) → không tô riêng sẽ đồng màu hết.
 * Theo quy ước atlas y khoa: đỏ = tim trái (máu giàu oxy), xanh = tim phải
 * (máu nghèo oxy). Key đã ở dạng sanitize (khoảng trắng → "_").
 */
export const HEART_CHAMBER_COLORS: Record<string, string> = {
  Left_atrium: "#c9576b",
  Right_atrium: "#4a7fc9",
  Left_ventricle: "#b5342a",
  Right_ventricle: "#2d4a94",
  Anterior_papillary_muscle_of_right_ventricle: "#24407d",
  Inferior_papillary_muscle_of_right_ventricle: "#24407d",
  Septal_papillary_muscle_of_right_ventricle: "#24407d",
  Inferior_papillary_muscle_of_left_ventricle: "#9c2b22",
};

/**
 * Scene "Lung Anatomy": 5 thuỳ phổi (trái 2, phải 3) dùng chung material
 * "Lung-*" nên đồng màu nếu không ép riêng. Tô 5 màu phân biệt theo TÊN MESH
 * đã sanitize (khoảng trắng → "_") để dạy ranh giới thuỳ, giống atlas hô hấp.
 */
export const LUNG_LOBE_COLORS: Record<string, string> = {
  Superior_lobe_of_left_lung: "#d98a94",
  Inferior_lobe_of_left_lung: "#b56a8a",
  Superior_lobe_of_right_lung: "#e0a07c",
  Middle_lobe_of_right_lung: "#c97c6b",
  Inferior_lobe_of_right_lung: "#a85a6a",
};

export const LIVER_SEGMENT_COLORS: Record<string, string> = {
  "Posterior_segment_of_liver_(I)": "#b5651d",
  "Left_posterior_lateral_segment_of_liver_(II)": "#4a7fc9",
  "Left_anterior_lateral_segment_of_liver_(III)": "#5fb85f",
  "Left_medial_segment_of_liver_(IV)": "#d4b83f",
  "Anterior_medial_segment_of_liver_(V)": "#c9576b",
  "Anterior_lateral_segment_of_liver_(VI)": "#8a5fc9",
  "Posterior_lateral_segment_of_liver_(VII)": "#4fb8a8",
  "Posterior_medial_segment_of_liver_(VIII)": "#c98a3f",
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

    // Xử lý HẾT mọi material slot trong mesh (không chỉ slot đầu) — mesh
    // nhiều thuỳ/tạng phức tạp (VD Gan) thường có thêm slot cho mạch/ống
    // bên trong, bỏ sót slot nào thì slot đó giữ màu gốc (hay là đen/trắng
    // lạ), nhìn như lỗ thủng dù mesh vẫn nguyên vẹn.
    const segmentColor =
      LIVER_SEGMENT_COLORS[mesh.name] ??
      HEART_CHAMBER_COLORS[mesh.name] ??
      LUNG_LOBE_COLORS[mesh.name];
    const heroKey = Object.keys(HERO_ORGAN_COLORS).find((k) => mesh.name.toLowerCase().includes(k));
    for (const std of getAllStd(mesh)) {
      std.emissive.setScalar(0);
      std.emissiveIntensity = 0;

      const base = std.name.replace(/-\d+$/, "").trim();
      const isDefaultWhite = std.color.r === 1 && std.color.g === 1 && std.color.b === 1;
      if (segmentColor) {
        std.color.set(segmentColor);
      } else if (heroKey) {
        std.color.set(HERO_ORGAN_COLORS[heroKey]);
      } else if (FORCED_COLORS[base] && fallbackSystem !== "muscular") {
        std.color.set(FORCED_COLORS[base]);
      } else if (isDefaultWhite) {
        std.color.set(TISSUE_COLORS[base] ?? SYSTEM_FALLBACK_COLOR[fallbackSystem]);
      }

      std.metalness = 0;
      const roughKey = Object.keys(TISSUE_ROUGHNESS).find((k) => base.startsWith(k));
      std.roughness = roughKey ? TISSUE_ROUGHNESS[roughKey] : 0.5;

      // Màng cơ MỎNG hình vòm/tấm (cơ hoành, màng phổi) là bề mặt 1 lớp — nhìn
      // vào mặt lõm sẽ thấy mặt sau bị cull thành mảng đen. Bật DoubleSide RIÊNG
      // cho từng mesh mỏng này (an toàn: chỉ vài nghìn tris/mesh, KHÁC hẳn bug
      // ép DoubleSide toàn cục cho scene 2600 mesh gây WebGL Context Lost).
      if (base === "Diaphragm" || base === "Pleura") {
        std.side = THREE.DoubleSide;
      }
    }
  });
}

function isSelfOrDescendantOf(obj: THREE.Object3D, root: THREE.Object3D): boolean {
  let cur: THREE.Object3D | null = obj;
  while (cur) {
    if (cur === root) return true;
    cur = cur.parent;
  }
  return false;
}

/**
 * Áp trạng thái Ẩn/Mờ/Cô lập lên toàn scene theo tên mesh. Cô lập so khớp
 * theo CÂY CON (không chỉ tên tuyệt đối) vì nhiều "tạng" (VD Liver) là 1
 * Group cha chứa nhiều mesh phân đoạn con tên khác nhau (các thuỳ gan) —
 * so khớp tên tuyệt đối sẽ ẩn nhầm hết mọi mesh con, làm cả mô hình biến mất.
 */
export function applyVisibility(
  scene: THREE.Object3D,
  hiddenIds: Record<string, boolean>,
  fadedIds: Record<string, boolean>,
  isolatedId: string | null,
) {
  const isolatedRoot = isolatedId ? scene.getObjectByName(isolatedId) ?? null : null;
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const isolatedOut = isolatedRoot !== null && !isSelfOrDescendantOf(mesh, isolatedRoot);
    mesh.visible = !mesh.userData.isLabel && !hiddenIds[mesh.name] && !isolatedOut;
    const std = getStd(mesh);
    if (std) {
      const faded = !!fadedIds[mesh.name];
      std.transparent = faded;
      std.opacity = faded ? 0.15 : 1;
    }
  });
}
