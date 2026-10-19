/**
 * Liệt kê TÊN MESH THẬT trong từng file .glb, đọc thẳng chunk JSON của glTF.
 *
 * Vì sao cần: bản đồ bệnh → mesh phải neo vào tên có thật, không được đoán.
 * Script này là nguồn sự thật để `verify:lesions` đối chiếu.
 *
 * Tên mesh bị sanitize lúc chạy (khoảng trắng -> "_"), nên xuất cả hai dạng.
 *
 *   node scripts/list_meshes.mjs                    # tóm tắt mọi model
 *   node scripts/list_meshes.mjs liver_anatomy      # chi tiết một model
 *   node scripts/list_meshes.mjs --json > meshes.json
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = "public/models";
/** Giống hệt THREE.PropertyBinding.sanitizeNodeName mà GLTFLoader dùng đặt
 *  mesh.name: khoảng trắng -> "_", rồi BỎ mọi ký tự không phải \w hoặc "-".
 *  Bỏ sót vế thứ hai là sai với mọi tên có dấu chấm ("Oesophagus.001"). */
export const sanitize = (s) => s.replace(/\s/g, "_").replace(/[^\w-]/g, "");

export function meshNames(file) {
  const buf = readFileSync(file);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error(`không phải glb: ${file}`);
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));
  const names = new Set();
  for (const n of gltf.nodes ?? []) if (n.name && n.mesh !== undefined) names.add(n.name);
  for (const m of gltf.meshes ?? []) if (m.name) names.add(m.name);
  return [...names].sort((a, b) => a.localeCompare(b));
}

// Importing meshNames must not run this CLI with the caller's arguments.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const files = readdirSync(DIR).filter((f) => f.endsWith(".glb")).sort();

  if (args[0] === "--json") {
    const out = {};
    for (const f of files) {
      try {
        out[f.replace(/\.glb$/, "")] = meshNames(join(DIR, f));
      } catch (e) {
        out[f.replace(/\.glb$/, "")] = { error: String(e.message) };
      }
    }
    writeFileSync("scripts/meshes.json", JSON.stringify(out, null, 1), "utf8");
    const total = Object.values(out).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0);
    console.log(`${files.length} model, ${total} mesh -> scripts/meshes.json`);
  } else if (args[0]) {
    const f = args[0].endsWith(".glb") ? args[0] : `${args[0]}.glb`;
    const names = meshNames(join(DIR, f));
    console.log(`${f} — ${names.length} mesh\n`);
    for (const n of names) {
      const s = sanitize(n);
      console.log(`  ${n}${s !== n ? `   [runtime: ${s}]` : ""}`);
    }
  } else {
    for (const f of files) {
      try {
        console.log(`${String(meshNames(join(DIR, f)).length).padStart(4)}  ${f}`);
      } catch (e) {
        console.log(`   !  ${f}  ${e.message}`);
      }
    }
  }
}
