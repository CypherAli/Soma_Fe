/**
 * Liệt kê cấu trúc có thật trong một file .glb, gom theo lớp giải phẫu.
 *
 *     node scripts/model-structures.mjs public/models/knee_joint.glb [--all]
 *
 * Dùng khi VIẾT NHÃN cho scene mới: tên trong `meshName` phải trùng tuyệt đối
 * với node trong file, nếu không `npm run verify:scenes` sẽ báo lỗi. Đọc thẳng
 * JSON chunk của glB nên không cần Blender hay thư viện ngoài.
 *
 * Mặc định chỉ in mesh "đáng làm nhãn" (bỏ nhánh mạch/thần kinh con và các
 * mesh phụ đuôi _1/_2 do trình xuất tách theo material); `--all` in tất cả.
 */
import { readFileSync } from "node:fs";

const file = process.argv[2];
const showAll = process.argv.includes("--all");
if (!file) {
  console.error("Thiếu đường dẫn .glb");
  process.exit(1);
}

const buf = readFileSync(file);
if (buf.readUInt32LE(0) !== 0x46546c67) {
  console.error("Không phải file glB hợp lệ");
  process.exit(1);
}
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));
const names = (gltf.nodes || []).filter((n) => n.mesh !== undefined).map((n) => n.name || "");

/** Cùng quy tắc với pickCat ở src/lib/anatomy/layers.ts để đọc cho khớp viewer. */
function cat(raw) {
  const n = raw.toLowerCase();
  if (/skin|envelope|fascia|aponeuros/.test(n)) return "da / cân";
  if (/lymph|node/.test(n)) return "bạch huyết";
  const vein = /vein|venous|vena cava|venae/.test(n);
  if (!vein && /arter|aorta|trunk|arch|anastomosis/.test(n)) return "động mạch";
  if (vein) return "tĩnh mạch";
  if (/nerve|plexus|ganglion|ramus|root of/.test(n)) return "thần kinh";
  if (/ligament|capsule|meniscus|labrum|bursa|retinaculum|membrane|disc|symphysis|cartilage/.test(n))
    return "khớp / dây chằng";
  if (/bone|femur|tibia|fibula|patella|vertebra|rib|sternum|scapula|clavicle|humerus|radius|ulna|sacrum|calcaneus|talus|metatarsal|phalanx|mandible|maxilla|hyoid/.test(n))
    return "xương";
  if (/muscle|musculus|tendon|head of|part of/.test(n)) return "cơ / gân";
  return "khác";
}

const groups = new Map();
for (const raw of names) {
  // Mesh phụ do glTF tách theo material: "<tên>_1" — không phải cấu trúc riêng.
  if (!showAll && /_\d+$/.test(raw) && !/\.\d{3}$/.test(raw)) continue;
  const k = cat(raw);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(raw);
}

console.log(`${file} — ${names.length} mesh\n`);
for (const [k, list] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`## ${k} (${list.length})`);
  for (const n of list.sort()) console.log("   " + n);
  console.log();
}
