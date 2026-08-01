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
  // Túi hoạt dịch chứa dịch — tông xanh nhạt để tách hẳn khỏi gân (#e0c98a)
  // và dây chằng (#e0d3a0) vốn nằm ngay cạnh nó trong scene mô liên kết.
  Bursa: "#a8ccd4",
  // Scene "Thân não & Dây TK sọ": Z-Anatomy đặt tên material theo CHỨC NĂNG
  // (không theo tên mô như Bone/Muscle) — tận dụng luôn để tô đúng quy ước
  // atlas thần kinh học: đỏ = nhân vận động (efferent), xanh = nhân cảm giác
  // (afferent), tan = nhân trung chuyển khác (nhân đỏ, củ não sinh tư, olive).
  "Nucleus (efferent fibers)": "#c25a4a",
  "Nucleus (afferent fibers)": "#4a7fc9",
  Nucleus: "#d9a86a",
  // "Brain-Inner": material riêng cho nhân dây XI (phụ) — cùng nhóm vận động.
  "Brain-Inner": "#c25a4a",
  // Chất não (thân não) — tông hồng-xám phân biệt với màu vàng của dây TK.
  Brain: "#d9b3a8",
  // Z-Anatomy tái sử dụng material "Frontal lobe" cho Midbrain (bug đặt tên
  // gốc, không phải do ta) — cùng tông chất não cho nhất quán.
  "Frontal lobe": "#d9b3a8",
  // Dịch não tuỷ trong hệ não thất (Aqueduct of midbrain, Fourth ventricle).
  LCR: "#bcdcec",
  // Chất trắng (bó sợi liên kết vùng não) — scene Gian não/Hệ viền dùng
  // material riêng "White matter" cho Hypothalamus/Fornix/Stria medullaris.
  "White matter": "#e8e2d0",
};

/**
 * BUG DỮ LIỆU Z-Anatomy đã xác nhận: "Hypoglossal nerve (XII).l/.r" bị gán
 * NHẦM material "Bone-4" (vốn dùng cho xương thật ở Hệ xương) thay vì
 * "Nerve-*" như 11 dây thần kinh sọ còn lại — nếu không ép riêng, dây XII sẽ
 * lên màu xương be nhạt thay vì màu vàng dây thần kinh, sai giải phẫu. Ép
 * theo TÊN MESH CHÍNH XÁC (không phải material) để không ảnh hưởng xương
 * thật dùng chung material "Bone-4" ở scene khác.
 */
export const NERVE_FIX_COLORS: Record<string, string> = {
  "Hypoglossal_nerve_(XII)l": "#e8c468",
  "Hypoglossal_nerve_(XII)r": "#e8c468",
};

/**
 * Scene "Tiểu não": mọi thuỳ dùng chung 1 material "Cerebellum" (không bug
 * trùng tên như Liver/Heart, nhưng đồng màu hết sẽ mất giá trị dạy 3 thuỳ
 * chức năng kinh điển) — tô riêng theo phân loại giải phẫu chuẩn: thuỳ trước
 * (vận động, cổ), thuỳ sau (lớn nhất, phối hợp tinh vi chi), thuỳ nốt-cuống
 * (thăng bằng, liên hệ nhân tiền đình). Cuống tiểu não trên là BÓ SỢI
 * (không phải thuỳ) nên tô tách biệt bằng tông chất trắng.
 */
export const CEREBELLUM_LOBE_COLORS: Record<string, string> = {
  // Thuỳ trước (anterior lobe)
  Lingula_of_cerebellum: "#c9a25a",
  Central_lobule: "#c9a25a",
  Wing_of_central_lobulel: "#c9a25a",
  Wing_of_central_lobuler: "#c9a25a",
  Culmen: "#c9a25a",
  Anterior_quadrangular_lobulel: "#c9a25a",
  Anterior_quadrangular_lobuler: "#c9a25a",
  // Thuỳ sau (posterior lobe) — chiếm phần lớn thể tích tiểu não người trưởng thành
  Posterior_quadrangular_lobulel: "#d9b878",
  Posterior_quadrangular_lobuler: "#d9b878",
  Declive: "#d9b878",
  Folium_of_vermis: "#d9b878",
  Tuber_of_vermis: "#d9b878",
  Pyramis_of_vermis: "#d9b878",
  Uvula_of_vermis: "#d9b878",
  Superior_semilunar_lobulel: "#d9b878",
  Superior_semilunar_lobuler: "#d9b878",
  Inferior_semilunar_lobulel: "#d9b878",
  Inferior_semilunar_lobuler: "#d9b878",
  Gracile_lobulel: "#d9b878",
  Gracile_lobuler: "#d9b878",
  Biventral_lobulel: "#d9b878",
  Biventral_lobuler: "#d9b878",
  Tonsil_of_cerebelluml: "#c0785a",
  Tonsil_of_cerebellumr: "#c0785a",
  // Thuỳ nốt-cuống (flocculonodular lobe) — cổ nhất về tiến hoá, liên hệ thăng bằng
  Nodule_of_vermis: "#6a8fc9",
  Flocculusl: "#6a8fc9",
  Flocculusr: "#6a8fc9",
  Peduncle_of_flocculusl: "#6a8fc9",
  Peduncle_of_flocculusr: "#6a8fc9",
  // Cuống tiểu não trên (bó sợi, không phải thuỳ)
  Superior_cerebellar_pedunclel: "#e8ddc8",
  Superior_cerebellar_peduncler: "#e8ddc8",
};

/**
 * Scene "Gian não, Nhân nền & Hệ viền": mọi nhân xám dùng chung material
 * "Nucleus" (đã có màu tan mặc định) — quá đồng màu sẽ mất giá trị dạy 4
 * nhóm chức năng nằm sát nhau: đồi thị (xanh xám, trạm trung chuyển cảm
 * giác), vùng dưới đồi (cam đỏ, điều hoà nội tiết/tự chủ), nhân nền (3 sắc
 * vàng-nâu đậm dần, vận động ngoài tháp), hệ viền (xanh lá, cảm xúc/trí nhớ).
 */
export const DIENCEPHALON_LIMBIC_COLORS: Record<string, string> = {
  Thalamusl: "#8a9bc9",
  Thalamusr: "#8a9bc9",
  Lateral_geniculate_bodyl: "#8a9bc9",
  Lateral_geniculate_bodyr: "#8a9bc9",
  Medial_geniculate_bodyl: "#8a9bc9",
  Medial_geniculate_bodyr: "#8a9bc9",
  Habenula: "#8a9bc9",
  Stria_medullaris_thalamil: "#8a9bc9",
  Stria_medullaris_thalamir: "#8a9bc9",
  Hypothalamus: "#c97a5a",
  Mamillary_bodyl: "#c97a5a",
  Mamillary_bodyr: "#c97a5a",
  Caudate_nucleusl: "#c9a25a",
  Caudate_nucleusr: "#c9a25a",
  Putamenl: "#b58a4a",
  Putamenr: "#b58a4a",
  Globus_pallidusl: "#8a6a3a",
  Globus_pallidusr: "#8a6a3a",
  Amygdaloid_bodyl: "#6a9c6a",
  Amygdaloid_bodyr: "#6a9c6a",
  Hippocampusl: "#5a8c7a",
  Hippocampusr: "#5a8c7a",
  Fornixl: "#7ab08a",
  Fornixr: "#7ab08a",
  Septal_nuclei: "#6a9c6a",
  Stria_terminalisl: "#7ab08a",
  Stria_terminalisr: "#7ab08a",
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
  hypophysis: "#c88a9a",
  pineal: "#b58ac8",
  thyroid: "#c0504a",
  thymus: "#e0a5a5",
  pancreas: "#d9a878",
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

/**
 * Scene "Eye Anatomy": các lớp nhãn cầu dùng material chung ("Eye"/"Cornea"/
 * "Iris") nên đồng màu nếu không ép riêng. Tô theo TÊN MESH đã sanitize
 * (khoảng trắng + dấu chấm → "_"). Củng mạc trắng (lòng trắng), giác mạc xanh
 * trong, thuỷ tinh thể trong, võng mạc cam-đỏ (lớp mạch máu trong cùng).
 */
export const EYE_STRUCTURE_COLORS: Record<string, string> = {
  // sanitizeGltfName XOÁ dấu "." (không đổi "_") → "Sclera.l" thành "Scleral".
  Scleral: "#f2ede2",
  Corneal: "#b6d6e6",
  Lensl: "#cfe4ee",
  Retinal: "#c76b4a",
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
      LUNG_LOBE_COLORS[mesh.name] ??
      EYE_STRUCTURE_COLORS[mesh.name] ??
      NERVE_FIX_COLORS[mesh.name] ??
      CEREBELLUM_LOBE_COLORS[mesh.name] ??
      DIENCEPHALON_LIMBIC_COLORS[mesh.name];
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
      // Mạc và túi hoạt dịch cũng là tấm/bao mỏng một lớp, cùng lý do như trên:
      // scene Hệ mạc gồm 38 tấm mạc cong bao quanh cơ, nhìn từ trong ra sẽ
      // thủng thành mảng đen nếu để FrontSide.
      if (
        base === "Diaphragm" ||
        base === "Pleura" ||
        base === "Eye" ||
        base === "Iris" ||
        base === "Cornea" ||
        base === "Fascia" ||
        base === "Bursa"
      ) {
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
