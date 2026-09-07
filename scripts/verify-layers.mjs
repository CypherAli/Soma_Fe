/**
 * Kiểm tra BẢNG LỚP của từng scene vùng có khớp với mesh THẬT trong model hay
 * không.
 *
 *     node scripts/verify-layers.mjs            # tất cả scene có regionViewerConfig
 *     node scripts/verify-layers.mjs ho-khuyu   # vài slug chỉ định
 *
 * Vì sao cần: `verify:scenes` chỉ kiểm tên hotspot có tồn tại trong .glb. Nó
 * KHÔNG bắt được lỗi ngược lại — bảng lớp khai một lớp mà model không có mesh
 * nào thuộc lớp đó (bật/tắt không có tác dụng gì), hoặc model có cả một lớp
 * lớn mà bảng lớp không khai (người xem không có cách nào tắt nó đi). Cả hai
 * đều làm trang xem trông như hỏng dù model và hotspot đều đúng.
 *
 * Quy tắc phân lớp ở đây là BẢN SAO của `pickCat` trong src/lib/anatomy/layers.ts.
 * Đã cố ý chép chứ không import: file kia là TypeScript và kéo theo cả three.js,
 * không chạy thẳng bằng `node` được. Sửa `pickCat` thì sửa cả ở đây.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const BONE_KEYS = ["humerus", "radius", "ulna", "scaphoid", "lunate", "triquetrum",
  "pisiform", "trapezium", "trapezoid", "capitate", "hamate", "metacarpal", "phalanx",
  "clavicle", "scapula", "frontal", "parietal", "occipital", "temporal bone", "sphenoid",
  "ethmoid", "nasal", "lacrimal", "maxilla", "zygomatic", "palatine", "vomer", "mandible",
  "hyoid", "concha", "incus", "malleus", "stapes", "tooth", "incisor", "canine", "premolar",
  "molar", "cartilage", "tarsus", "bone",
  "vertebra", "atlas", "axis", "sacrum", "coccyx", "sternum", "manubrium", "xiphoid",
  "rib", "costal", "femur", "patella", "tibia", "fibula", "calcaneus", "talus",
  "navicular", "cuboid", "cuneiform", "metatarsal", "ilium", "ischium", "pubis"];
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
const BRAIN_CAVITY_NAMES = ["lateral ventricle", "third ventricle", "fourth ventricle",
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

function pickCat(name) {
  const n = name.toLowerCase();
  if (n.includes("skin") || n.includes("envelope") || n.includes("fascia") ||
      n.includes("aponeurosis") || n.includes("nail") || n.includes("perionyx") ||
      n.includes("onych") ||
      / region$/.test(n) || / region\.[lr]$/.test(n)) return "skin";
  if (n.includes("lymph") || n.includes("node")) return "lymph";
  if (EYE_KEYS.some((k) => n.includes(k))) return "eye";
  const isDuralSinus = /(sagittal|transverse|sigmoid|straight|occipital|petrosal|cavernous|intercavernous|sphenoparietal) sinus|confluence of sinus/.test(n);
  const isVein = n.includes("vein") || n.includes("venous") || n.includes("vena cava") ||
    n.includes("venae") || n.includes("coronary sinus") || isDuralSinus;
  if (!isVein && (n.includes("arter") || n.includes("aorta") || n.includes("pulmonary trunk") ||
      n.includes("palmar arch") || n.includes("carpal arch") || n.includes("anastomosis"))) return "artery";
  if (isVein) return "vein";
  if (BRAIN_CAVITY_NAMES.some((k) => n.includes(k))) return "brain";
  if (n.includes("cartilage")) return "bone";
  if (n.includes("nerve")) return "nerve";
  if (ORGAN_KEYS.some((k) => n.includes(k))) return "organ";
  if (NERVE_KEYS.some((k) => n.includes(k))) return "nerve";
  if (BRAIN_KEYS.some((k) => n.includes(k))) return "brain";
  if (CONNECTIVE_KEYS.some((k) => n.includes(k))) return "muscle";
  if (BONE_KEYS.some((k) => n.includes(k))) return "bone";
  return "muscle";
}

/** Tên node có mesh trong .glb (đọc chunk JSON, không giải nén Draco). */
function meshNodeNames(glbPath) {
  const buf = readFileSync(glbPath);
  const jsonLength = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLength).toString("utf8"));
  return (gltf.nodes ?? []).filter((n) => n.mesh !== undefined).map((n) => n.name ?? "");
}

/** slug -> { model, cats } đọc thẳng từ mã nguồn scene (dữ liệu thuần, regex đủ). */
function readScenes() {
  const dir = "src/lib/scenes";
  const models = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "types.ts")) {
    const src = readFileSync(join(dir, file), "utf8");
    const heads = [...src.matchAll(/^ {2}"([a-z0-9-]+)": \{$/gm)];
    heads.forEach((m, i) => {
      const block = src.slice(m.index, i + 1 < heads.length ? heads[i + 1].index : src.length);
      const model = block.match(/modelFile: "([^"]+)"/)?.[1];
      if (model) models.set(m[1], model);
    });
    // Bảng lớp nằm trong `regionViewerConfigN` cùng file scene.
    for (const m of src.matchAll(/^ {2}"([a-z0-9-]+)": \{ cats: \[([^\]]*)\](?:, faded: \[([^\]]*)\])? \},$/gm)) {
      const cats = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
      const faded = [...(m[3] ?? "").matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
      const entry = views.get(m[1]) ?? {};
      views.set(m[1], { ...entry, cats, faded });
    }
  }
  return models;
}

const views = new Map();
const models = readScenes();

// `--json`: in bảng slug -> {lớp: số mesh} để script khác dùng lại phép phân
// lớp này mà không phải chép quy tắc lần thứ ba.
const asJson = process.argv.includes("--json");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const jsonOut = {};
let problems = 0;
let checked = 0;

for (const [slug, view] of views) {
  if (only.length && !only.includes(slug)) continue;
  const model = models.get(slug);
  if (!model) {
    console.log(`✗ ${slug}: có bảng lớp nhưng KHÔNG tìm thấy modelFile`);
    problems++;
    continue;
  }
  const names = meshNodeNames(join("public", model.replace(/^\//, "")));
  const counts = {};
  for (const name of names) {
    const cat = pickCat(name);
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  checked++;
  jsonOut[slug] = counts;
  if (asJson) continue;

  const empty = view.cats.filter((c) => !counts[c]);
  const missing = Object.keys(counts).filter((c) => !view.cats.includes(c));
  const covered = view.cats.reduce((s, c) => s + (counts[c] ?? 0), 0);

  if (empty.length || missing.length) {
    problems++;
    console.log(`\n! ${slug}  (${names.length} mesh · bảng lớp phủ ${covered})`);
    if (empty.length) console.log(`    lớp KHAI nhưng model không có mesh nào: ${empty.join(", ")}`);
    if (missing.length) {
      console.log(`    lớp CÓ mesh nhưng bảng lớp không khai: ${
        missing.map((c) => `${c} (${counts[c]})`).join(", ")}`);
    }
  }
}

if (asJson) {
  console.log(JSON.stringify(jsonOut));
  process.exit(0);
}

console.log(`\n${checked} scene đã kiểm · ${problems} scene có vấn đề.`);
process.exit(problems ? 1 : 0);
