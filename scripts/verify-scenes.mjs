/**
 * Kiểm tra mọi hotspot trong sceneModules có trỏ đúng một node có thật trong
 * file .glb tương ứng hay không.
 *
 *     node scripts/verify-scenes.mjs
 *
 * Vì sao cần: tên trong Blender và tên node trong glTF KHÔNG giống nhau, và
 * three.js còn sanitize thêm một lần nữa lúc chạy (khoảng trắng thành "_",
 * dấu chấm bị XOÁ HẲN: "Cochlea.l" -> "Cochleal"). Gõ sai một ký tự thì
 * hotspot lặng lẽ không khớp mesh nào — không có lỗi, chỉ là bấm vào không
 * phản ứng. Kiểm tra bằng script rẻ hơn nhiều so với mở từng scene trên trình
 * duyệt, nhất là khi WebGL không chạy được trong môi trường kiểm thử.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Cùng quy tắc với THREE.PropertyBinding.sanitizeNodeName. */
const sanitize = (raw) => raw.replace(/\s/g, "_").replace(/[[\].:/]/g, "");

/** Đọc tên node có mesh từ chunk JSON của file .glb. */
function readNodeNames(glbPath) {
  const buf = readFileSync(glbPath);
  const jsonLength = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLength).toString("utf8"));
  return (gltf.nodes ?? []).filter((n) => n.mesh !== undefined).map((n) => n.name ?? "");
}

/**
 * Rút hotspot từ mã nguồn TypeScript bằng regex thay vì import.
 * Các file scene là TS thuần dữ liệu, dùng regex tránh phải dựng cả pipeline
 * biên dịch chỉ để chạy một lần kiểm tra.
 */
function parseScenes(source) {
  const scenes = [];
  const sceneRe = /^ {2}"([a-z0-9-]+)": \{$/gm;
  const matches = [...source.matchAll(sceneRe)];

  matches.forEach((match, i) => {
    const start = match.index;
    const end = i + 1 < matches.length ? matches[i + 1].index : source.length;
    const block = source.slice(start, end);

    const modelFile = block.match(/modelFile: "([^"]+)"/)?.[1];
    const meshNames = [...block.matchAll(/meshName: "([^"]+)"/g)].map((m) => m[1]);
    scenes.push({ slug: match[1], modelFile, meshNames });
  });

  return scenes;
}

const sceneFiles = [
  "digestive", "cardiovascular", "skeletal", "muscular", "respiratory",
  "misc", "auditory", "reproductive", "connective", "nervous",
];

let totalHotspots = 0;
let totalProblems = 0;
const missingModels = [];

for (const file of sceneFiles) {
  const source = readFileSync(join(root, "src/lib/scenes", `${file}.ts`), "utf8");

  for (const scene of parseScenes(source)) {
    if (!scene.modelFile) continue; // scene dùng model toàn thân, bỏ qua

    const glbPath = join(root, "public", scene.modelFile);
    if (!existsSync(glbPath)) {
      missingModels.push(`${scene.slug} -> ${scene.modelFile}`);
      totalProblems++;
      continue;
    }

    const nodeNames = new Set(readNodeNames(glbPath).map(sanitize));
    const unmatched = scene.meshNames.filter((name) => !nodeNames.has(sanitize(name)));

    totalHotspots += scene.meshNames.length;
    if (unmatched.length > 0) {
      totalProblems += unmatched.length;
      console.log(`\n✗ ${scene.slug}  (${scene.modelFile})`);
      for (const name of unmatched) console.log(`    KHÔNG KHỚP: "${name}"`);
      console.log(`    node có trong file: ${[...nodeNames].slice(0, 12).join(", ")}`);
    }
  }
}

if (missingModels.length > 0) {
  console.log("\n✗ THIẾU FILE MODEL:");
  for (const m of missingModels) console.log(`    ${m}`);
}

console.log(
  totalProblems === 0
    ? `\n✓ ${totalHotspots} hotspot đều khớp node thật trong model.`
    : `\n✗ ${totalProblems} vấn đề trên tổng ${totalHotspots} hotspot.`,
);

process.exit(totalProblems === 0 ? 0 : 1);
