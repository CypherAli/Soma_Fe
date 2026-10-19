/**
 * Kiểm bản đồ bệnh → mesh tổn thương.
 *
 * Đối chiếu từng `mesh` trong soma_be/prisma/data/lesion-map.ts với tên mesh
 * THẬT đọc từ file .glb, và chỉ trong đúng model của `system` mà /viewer nạp.
 * Sai một tên là viewer cô lập vào hư vô mà không báo lỗi gì — nên script này
 * thoát mã 1 để chặn ở CI/pre-commit.
 *
 *   npm run verify:lesions
 *   node scripts/verify_lesions.mjs --sync  # xuất lại hợp đồng từ backend
 *
 * Checkout riêng frontend dùng scripts/fixtures/lesion-map.json. Khi có backend
 * cạnh frontend, bắt buộc bản xuất khớp nguồn trước khi đối chiếu mesh.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { meshNames } from "./list_meshes.mjs";

const MODELS_DIR = "public/models";
const LESION_MAP = "../soma_be/prisma/data/lesion-map.ts";
const SNAPSHOT = "scripts/fixtures/lesion-map.json";

/** Khớp SYSTEM_FILES + EXTRA_FILES trong src/components/viewer/ModelScene.tsx */
const SYSTEM_MODELS = {
  skeletal: ["skeletal"],
  muscular: ["muscular"],
  nervous: ["nervous"],
  cardiovascular: ["cardiovascular"],
  visceral: ["visceral", "visceral_gut_bp3d"],
  lymphoid: ["lymphoid"],
  joints: ["joints"],
};

// A frontend-only checkout uses the exported contract. In the full workspace,
// also reject a stale export instead of silently checking older backend data.
let sourceEntries;
if (existsSync(LESION_MAP)) {
  const src = readFileSync(LESION_MAP, "utf8");
  sourceEntries = [...src.matchAll(
    /\{\s*slug:\s*'([^']+)',\s*mesh:\s*'([^']+)',\s*system:\s*'([^']+)'/g,
  )].map(([, slug, mesh, system]) => ({ slug, mesh, system }));
}

if (process.argv.includes("--sync")) {
  if (!sourceEntries?.length) throw new Error(`Không đọc được nguồn ${LESION_MAP}`);
  writeFileSync(SNAPSHOT, JSON.stringify({
    source: "soma_be/prisma/data/lesion-map.ts",
    entries: sourceEntries,
  }, null, 2) + "\n");
}

const { entries } = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
if (!Array.isArray(entries) || entries.some(entry => !entry ||
  typeof entry.slug !== "string" || typeof entry.mesh !== "string" ||
  typeof entry.system !== "string")) {
  throw new Error(`Dữ liệu không hợp lệ: ${SNAPSHOT}`);
}
if (sourceEntries && JSON.stringify(sourceEntries) !== JSON.stringify(entries)) {
  throw new Error("Bản đồ bệnh lý đã đổi. Chạy node scripts/verify_lesions.mjs --sync rồi commit bản xuất.");
}

if (entries.length === 0) {
  console.error("Không đọc được mục nào từ lesion-map.ts — regex hỏng?");
  process.exit(1);
}

const cache = new Map();
const meshesOf = (model) => {
  if (!cache.has(model)) {
    try {
      cache.set(model, new Set(meshNames(join(MODELS_DIR, `${model}.glb`))));
    } catch {
      cache.set(model, null);
    }
  }
  return cache.get(model);
};

let bad = 0;
for (const { slug, mesh, system } of entries) {
  const models = SYSTEM_MODELS[system];
  if (!models) {
    console.error(`SAI HỆ    ${slug}: "${system}" không phải hệ mà viewer nạp`);
    bad++;
    continue;
  }
  const found = models.find((m) => meshesOf(m)?.has(mesh));
  if (found) {
    console.log(`ok        ${slug.padEnd(32)} ${mesh}  [${found}.glb]`);
  } else {
    console.error(`KHÔNG CÓ  ${slug.padEnd(32)} "${mesh}" không có trong ${models.join(".glb, ")}.glb`);
    bad++;
  }
}

console.log(`\n${entries.length - bad}/${entries.length} mục hợp lệ`);
if (bad) {
  console.error(`${bad} mục SAI — sửa lesion-map.ts trước khi seed.`);
  process.exit(1);
}
