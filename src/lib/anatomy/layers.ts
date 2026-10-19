
import { bindContentSource } from "@/lib/content/source";
import * as THREE from "three";

// Phân lớp giải phẫu dùng chung cho mọi viewer (bóc lớp, tô màu, tra cứu theo tên mesh).
// Z-Anatomy không xuất được material màu -> tô theo TÊN mesh.
// ---- các lớp giải phẫu + màu ----
export type CatKey = "skin" | "muscle" | "brain" | "artery" | "vein" | "nerve" | "lymph" | "eye" | "organ" | "bone";
export const CATS: { key: CatKey; label: string; color: string }[] = bindContentSource("data:src/lib/anatomy/layers.ts#CATS", [
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
]);
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
  "molar", "cartilage", "tarsus", "bone",
  // Xương THÂN MÌNH và CHI DƯỚI vốn thiếu hẳn: chỉ những xương có sẵn chữ
  // "bone" trong tên (Hip bone, Hamate bone) mới lọt qua, còn đốt sống, xương
  // cùng, xương ức, xương sườn và cả xương đùi đều rơi xuống nhánh cuối và bị
  // tô màu CƠ — sai ở mọi scene cột sống, chậu hông và chi dưới.
  "vertebra", "atlas", "axis", "sacrum", "coccyx", "sternum", "manubrium", "xiphoid",
  "rib", "costal", "femur", "patella", "tibia", "fibula", "calcaneus", "talus",
  "navicular", "cuboid", "cuneiform", "metatarsal", "ilium", "ischium", "pubis"];

// Mô liên kết bám vào xương: có tên xương trong đó nhưng KHÔNG phải xương
// ("Ligament of head of femur", "Intervertebral disc"). Xét trước danh sách
// xương để chúng ở lại lớp mô mềm như từ trước tới nay.
const CONNECTIVE_KEYS = ["ligament", "membrane", "capsule", "labrum", "retinacul",
  "disc", "meniscus", "bursa", "tendon", "sheath"];
const NERVE_KEYS = ["nerve", "plexus", "cord", "trunk of brachial", "division of",
  "sympathetic", "roots of brachial"];
const BRAIN_KEYS = ["brain", "cerebr", "cerebell", "brainstem", "telencephal", "diencephal",
  "medulla", "midbrain", "pons", "thalam", "ventricle", "callosum", "gyrus", "white matter",
  // Khoang dịch não tuỷ và màng não: không có mấy từ này thì đám rối màng mạch,
  // vách trong suốt và màng cứng rơi xuống nhánh cuối và bị tô thành CƠ.
  "septum pellucidum", "aqueduct", "falx", "tentorium",
  "dura", "arachnoid", "pia mater", "subarachnoid",
  // Bổ sung 24/08/2026 sau khi `verify:layers` phát hiện: giao thoa và dải thị,
  // thể gối, củ não sinh tư, rãnh cựa, nêm chẩm, cực chẩm, các nhân thân não…
  // không khớp từ khoá nào nên rơi xuống nhánh cuối và bị tô màu CƠ giữa một
  // scene não; riêng "occipital pole" còn bị BONE_KEYS bắt mất thành XƯƠNG.
  "optic chiasm", "optic tract", "geniculate", "colliculus", "calcarine",
  "cuneus", "occipital pole", "frontal pole", "temporal pole", "insula",
  "caudate", "putamen", "pallidus", "fornix", "hippocamp", "amygdal",
  "peduncle", "olive", "flocculus", "tonsil of cerebell", "lingula of cerebell",
  "stria medullaris", "cochlear nucle", "vestibular nucle", "nucleus of",
  "spinal cord", "conus medullaris", "cauda equina", "denticulate"];

// Não thất tim và não thất não TRÙNG TỪ "ventricle". Vì lớp tạng được xét
// trước lớp não (mạch vành, cơ nhú phải ra tạng chứ không ra não), phải nhận
// diện đích danh mấy khoang não trước cả hai — nếu không "Lateral ventricle"
// bị tô màu nội tạng ngay giữa một scene não.
const BRAIN_CAVITY_NAMES = ["lateral ventricle", "third ventricle", "fourth ventricle",
  // "plexus" là từ khoá THẦN KINH nên đám rối màng mạch phải nhận đích danh ở
  // đây, không thì nó bị xếp vào lớp thần kinh giữa một scene não thất.
  "choroid plexus"];
const EYE_KEYS = ["sclera", "cornea", "iris", "eyeball", "vitreous", "lens of"];
const ORGAN_KEYS = ["lung", "lobe of", "pleura", "bronch", "trachea", "liver", "hepat",
  "stomach", "gastric", "colon", "intestine", "duoden", "jejunum", "ileum", "caecum",
  "cecum", "appendix", "rectum", "taenia", "omentum", "mesocolon", "mesentery", "meso-",
  "kidney", "renal pelvis", "ureter", "adrenal", "suprarenal", "pancrea", "spleen",
  "splenic", "gallbladder", "bile", "cystic", "oesophagus", "esophagus", "atrium",
  "ventricle", "papillary", "leaflet", "valve of", "chordae", "heart",
  // Tuyến nội tiết và cơ quan sinh dục – tiết niệu: trước đây không có từ nào,
  // nên tuyến giáp, tuyến yên, tinh hoàn, tuyến tiền liệt đều bị tô thành cơ.
  "thyroid", "parathyroid", "hypophysis", "pituitary", "pineal", "thymus", "islet",
  "bladder", "urethra", "testis", "epididymis", "prostate", "seminal", "deferens",
  "ejaculatory", "penis", "penile", "cavernosum", "spongiosum", "glans", "scrotum",
  "uterus", "ovary", "vagina",
  // Bộ lệ: "lacrimal" có sẵn trong BONE_KEYS (xương lệ) nên tuyến lệ, túi lệ,
  // tiểu quản và ống lệ mũi đều bị tô màu XƯƠNG — gọi đích danh phần mềm ở đây
  // để chúng ra lớp tạng, còn "Lacrimal bone" vẫn rơi đúng vào xương.
  "lacrimal gland", "lacrimal sac", "lacrimal canaliculus", "nasolacrimal",
  "salivary", "parotid", "submandibular gland", "sublingual gland"];

export function pickCat(name: string): CatKey {
  const n = name.toLowerCase();
  // Cân/mạc (fascia, aponeurosis) xếp cùng lớp DA: đó là lớp bọc nông, bóc
  // cùng da mới lộ được cơ bên dưới (VD cân gan tay che kín các cơ bàn tay).
  // Móng tay/chân và mầm móng là phần phụ của DA (sừng hoá từ thượng bì) —
  // không có mấy từ này thì chúng rơi xuống nhánh cuối và bị tô màu CƠ, thành
  // ra năm cái móng đỏ chót ở đầu ngón.
  if (n.includes("skin") || n.includes("envelope") || n.includes("fascia") ||
      n.includes("aponeurosis") || n.includes("nail") || n.includes("perionyx") ||
      n.includes("onych") ||
      // Mảng nhãn VÙNG của hệ 9 ("Mammary region", "Inframammary region",
      // "Sternocleidomastoid region") là mảnh đắp trên bề mặt da, không phải cơ.
      / region$/.test(n) || / region\.[lr]$/.test(n)) return "skin";
  if (n.includes("lymph") || n.includes("node")) return "lymph";
  if (EYE_KEYS.some((k) => n.includes(k))) return "eye";
  // mạch lớn trước để không nhầm sang tạng.
  // Xét TĨNH MẠCH trước trong cùng một bước vì có tên vừa chứa từ khoá động
  // mạch vừa chứa "venous" ("Deep venous palmar arch" — cung TĨNH mạch).
  // "Coronary sinus" là tĩnh mạch lớn nhất của tim nhưng trong tên không có chữ
  // "vein" nào — không kể riêng thì nó rơi xuống nhánh cuối và bị tô thành cơ.
  // Xoang tĩnh mạch màng cứng KHÔNG có chữ "vein" trong tên nên trước đây rơi
  // xuống nhánh cuối và bị tô màu cơ. Gọi đích danh từng xoang thay vì bắt cả
  // chữ "sinus" — "Sinus of frontal bone" là xoang trán, phải ở lại lớp xương.
  const isDuralSinus = /(sagittal|transverse|sigmoid|straight|occipital|petrosal|cavernous|intercavernous|sphenoparietal) sinus|confluence of sinus/.test(n);
  const isVein = n.includes("vein") || n.includes("venous") || n.includes("vena cava") ||
    n.includes("venae") || n.includes("coronary sinus") || isDuralSinus;
  // "arter" (không phải "artery") để bắt cả số nhiều "arteries" và "arteriole".
  if (!isVein && (n.includes("arter") || n.includes("aorta") || n.includes("pulmonary trunk") ||
      n.includes("palmar arch") || n.includes("carpal arch") || n.includes("anastomosis"))) return "artery";
  if (isVein) return "vein";
  if (BRAIN_CAVITY_NAMES.some((k) => n.includes(k))) return "brain";
  // Sụn xét trước lớp tạng: "Thyroid cartilage" là SỤN GIÁP của thanh quản,
  // không phải tuyến giáp.
  if (n.includes("cartilage")) return "bone";
  // Có chữ "nerve" thì chắc chắn là thần kinh. Phải xét trước lớp tạng vì
  // "Ilio-hypogastric nerve" chứa chuỗi "gastric" nên trước đây bị xếp vào
  // nội tạng ngay giữa một scene đám rối thần kinh.
  if (n.includes("nerve")) return "nerve";
  // Frontalis/temporalis and other named muscles may also contain a bone keyword.
  if (n.includes("muscle")) return "muscle";
  if (ORGAN_KEYS.some((k) => n.includes(k))) return "organ";
  if (NERVE_KEYS.some((k) => n.includes(k))) return "nerve";
  if (BRAIN_KEYS.some((k) => n.includes(k))) return "brain";
  if (CONNECTIVE_KEYS.some((k) => n.includes(k))) return "muscle";
  if (BONE_KEYS.some((k) => n.includes(k))) return "bone";
  return "muscle";
}
