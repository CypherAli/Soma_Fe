import * as THREE from "three";

// Phân lớp giải phẫu dùng chung cho mọi viewer (bóc lớp, tô màu, tra cứu theo tên mesh).
// Z-Anatomy không xuất được material màu -> tô theo TÊN mesh.
// ---- các lớp giải phẫu + màu ----
export type CatKey = "skin" | "muscle" | "brain" | "artery" | "vein" | "nerve" | "lymph" | "eye" | "organ" | "bone";
export const CATS: { key: CatKey; label: string; color: string }[] = [
  { key: "skin", label: "Da", color: "#e2b48f" },
  { key: "muscle", label: "Cơ", color: "#9e2b23" },
  { key: "brain", label: "Não", color: "#d7a8a2" },
  { key: "organ", label: "Nội tạng", color: "#b56a5a" },
  { key: "artery", label: "Động mạch", color: "#c0392b" },
  { key: "vein", label: "Tĩnh mạch", color: "#2c5aa0" },
  { key: "nerve", label: "Thần kinh", color: "#dcb42e" },
  { key: "lymph", label: "Bạch huyết", color: "#5f9e57" },
  { key: "eye", label: "Mắt", color: "#5f7fa6" },
  { key: "bone", label: "Xương", color: "#e9dcbe" },
];
export const MAT: Record<CatKey, THREE.MeshStandardMaterial> = {
  skin: new THREE.MeshStandardMaterial({ color: "#e8b696", roughness: 0.66, metalness: 0 }),
  muscle: new THREE.MeshStandardMaterial({ color: "#9e2b23", roughness: 0.72, metalness: 0 }),
  brain: new THREE.MeshStandardMaterial({ color: "#d7a8a2", roughness: 0.85, metalness: 0 }),
  organ: new THREE.MeshStandardMaterial({ color: "#b56a5a", roughness: 0.6, metalness: 0 }),
  artery: new THREE.MeshStandardMaterial({ color: "#c0392b", roughness: 0.55, metalness: 0 }),
  vein: new THREE.MeshStandardMaterial({ color: "#2c5aa0", roughness: 0.55, metalness: 0 }),
  nerve: new THREE.MeshStandardMaterial({ color: "#dcb42e", roughness: 0.6, metalness: 0 }),
  lymph: new THREE.MeshStandardMaterial({ color: "#5f9e57", roughness: 0.7, metalness: 0 }),
  eye: new THREE.MeshStandardMaterial({ color: "#eef0f4", roughness: 0.28, metalness: 0 }), // sclera (lòng trắng)
  bone: new THREE.MeshStandardMaterial({ color: "#e9dcbe", roughness: 0.75, metalness: 0 }),
};
// Vật liệu con của NỘI TẠNG — mỗi tạng một màu để phân biệt (fade theo lớp "organ").
export const ORGAN_SUBMATS: { keys: string[]; mat: THREE.MeshStandardMaterial }[] = [
  { keys: ["atrium", "ventricle", "papillary", "valve", "leaflet", "chordae", "heart"],
    mat: new THREE.MeshStandardMaterial({ color: "#8e2f2a", roughness: 0.5 }) },       // tim
  { keys: ["lung", "lobe of", "pleura", "bronch", "trachea"],
    mat: new THREE.MeshStandardMaterial({ color: "#d98c94", roughness: 0.7 }) },        // phổi
  { keys: ["liver", "hepat"],
    mat: new THREE.MeshStandardMaterial({ color: "#6e3b34", roughness: 0.65 }) },       // gan
  { keys: ["spleen", "splenic"],
    mat: new THREE.MeshStandardMaterial({ color: "#6b3b5a", roughness: 0.6 }) },        // lách
  { keys: ["kidney", "renal", "ureter", "adrenal", "suprarenal"],
    mat: new THREE.MeshStandardMaterial({ color: "#7a4a3a", roughness: 0.6 }) },        // thận
  { keys: ["pancrea"],
    mat: new THREE.MeshStandardMaterial({ color: "#caa96b", roughness: 0.7 }) },        // tụy
  { keys: ["gallbladder", "bile", "cystic duct"],
    mat: new THREE.MeshStandardMaterial({ color: "#6e8c4a", roughness: 0.6 }) },        // túi mật
];
export const ORGAN_GUT_MAT = new THREE.MeshStandardMaterial({ color: "#c98f63", roughness: 0.7 }); // ống tiêu hoá
export function organMat(name: string): THREE.MeshStandardMaterial {
  const n = name.toLowerCase();
  for (const s of ORGAN_SUBMATS) if (s.keys.some((k) => n.includes(k))) return s.mat;
  return ORGAN_GUT_MAT; // dạ dày/ruột/mạc treo… màu nâu tiêu hoá
}
export const ORGAN_ALL_SUBMATS = [...ORGAN_SUBMATS.map((s) => s.mat), ORGAN_GUT_MAT];
// Vật liệu con của MẮT để có lòng đen thật: mống mắt nâu, dịch kính tối (đồng tử),
// giác mạc trong suốt (không che mống mắt).
export const IRIS_MAT = new THREE.MeshStandardMaterial({ color: "#4a3220", roughness: 0.35, metalness: 0 });
export const VITREOUS_MAT = new THREE.MeshStandardMaterial({ color: "#15151c", roughness: 0.3, metalness: 0 });
export const CORNEA_MAT = new THREE.MeshStandardMaterial({
  color: "#dfe7ee", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false,
});
export const EYE_SUBMATS = [IRIS_MAT, VITREOUS_MAT, CORNEA_MAT];

const BONE_KEYS = ["humerus", "radius", "ulna", "scaphoid", "lunate", "triquetrum",
  "pisiform", "trapezium", "trapezoid", "capitate", "hamate", "metacarpal", "phalanx",
  "clavicle", "scapula", "frontal", "parietal", "occipital", "temporal bone", "sphenoid",
  "ethmoid", "nasal", "lacrimal", "maxilla", "zygomatic", "palatine", "vomer", "mandible",
  "hyoid", "concha", "incus", "malleus", "stapes", "tooth", "incisor", "canine", "premolar",
  "molar", "cartilage", "tarsus", "bone"];
const NERVE_KEYS = ["nerve", "plexus", "cord", "trunk of brachial", "division of",
  "sympathetic", "roots of brachial"];
const BRAIN_KEYS = ["brain", "cerebr", "cerebell", "brainstem", "telencephal", "diencephal",
  "medulla", "midbrain", "pons", "thalam", "ventricle", "callosum", "gyrus", "white matter"];
const EYE_KEYS = ["sclera", "cornea", "iris", "eyeball", "vitreous", "lens of"];
const ORGAN_KEYS = ["lung", "lobe of", "pleura", "bronch", "trachea", "liver", "hepat",
  "stomach", "gastric", "colon", "intestine", "duoden", "jejunum", "ileum", "caecum",
  "cecum", "appendix", "rectum", "taenia", "omentum", "mesocolon", "mesentery", "meso-",
  "kidney", "renal pelvis", "ureter", "adrenal", "suprarenal", "pancrea", "spleen",
  "splenic", "gallbladder", "bile", "cystic", "oesophagus", "esophagus", "atrium",
  "ventricle", "papillary", "leaflet", "valve of", "chordae", "heart"];

export function pickCat(name: string): CatKey {
  const n = name.toLowerCase();
  if (n.includes("skin") || n.includes("envelope") || n.includes("fascia")) return "skin";
  if (n.includes("lymph") || n.includes("node")) return "lymph";
  if (EYE_KEYS.some((k) => n.includes(k))) return "eye";
  // mạch lớn trước để không nhầm sang tạng
  if (n.includes("artery") || n.includes("arterial") || n.includes("aorta") ||
      n.includes("pulmonary trunk") || n.includes("palmar arch")) return "artery";
  if (n.includes("vein") || n.includes("venous") || n.includes("vena cava") ||
      n.includes("venae")) return "vein";
  if (ORGAN_KEYS.some((k) => n.includes(k))) return "organ";
  if (NERVE_KEYS.some((k) => n.includes(k))) return "nerve";
  if (BRAIN_KEYS.some((k) => n.includes(k))) return "brain";
  if (BONE_KEYS.some((k) => n.includes(k))) return "bone";
  return "muscle";
}
