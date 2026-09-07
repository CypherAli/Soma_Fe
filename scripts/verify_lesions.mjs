/**
 * Kiểm bản đồ bệnh → mesh tổn thương.
 *
 * Đối chiếu từng `mesh` trong soma_be/prisma/data/lesion-map.ts với tên mesh
 * THẬT đọc từ file .glb, và chỉ trong đúng model của `system` mà /viewer nạp.
 * Sai một tên là viewer cô lập vào hư vô mà không báo lỗi gì — nên script này
 * thoát mã 1 để chặn ở CI/pre-commit.
 *
 *   npm run verify:lesions
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { meshNames } from "./list_meshes.mjs";

const MODELS_DIR = "public/models";
const LESION_MAP = "../soma_be/prisma/data/lesion-map.ts";

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

// Đọc bằng regex thay vì import: file .ts nằm ở project khác, không cùng tsconfig.
const src = readFileSync(LESION_MAP, "utf8");
const entries = [...src.matchAll(
  /\{\s*slug:\s*'([^']+)',\s*mesh:\s*'([^']+)',\s*system:\s*'([^']+)'/g,
)].map(([, slug, mesh, system]) => ({ slug, mesh, system }));

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
