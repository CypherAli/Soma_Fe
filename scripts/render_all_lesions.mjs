/**
 * Render ảnh minh hoạ vị trí tổn thương cho mọi bệnh có `lesionMesh`.
 *
 * Đọc soma_be/prisma/data/lesion-map.ts, gọi Blender cho từng mục, ghi ra
 * public/lesions/<slug>.png. Bỏ qua ảnh đã có trừ khi truyền --force.
 *
 *   node scripts/render_all_lesions.mjs
 *   node scripts/render_all_lesions.mjs --force
 *   node scripts/render_all_lesions.mjs benh-gout      # chỉ một bệnh
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BLENDER = "C:/Program Files/Blender Foundation/Blender 5.1/blender.exe";
const SCRIPT = "scripts/blender/render_lesion.py";
const OUT_DIR = "public/lesions";
const MAP = "../soma_be/prisma/data/lesion-map.ts";

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

const src = readFileSync(MAP, "utf8");
const entries = [...src.matchAll(
  /\{\s*slug:\s*'([^']+)',\s*mesh:\s*'([^']+)',\s*system:\s*'([^']+)'/g,
)].map(([, slug, mesh, system]) => ({ slug, mesh, system }));

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.find((a) => !a.startsWith("--"));
const todo = only ? entries.filter((e) => e.slug === only) : entries;

mkdirSync(OUT_DIR, { recursive: true });
let done = 0, skipped = 0, failed = [];

for (const { slug, mesh, system } of todo) {
  const out = join(OUT_DIR, `${slug}.png`);
  if (!force && existsSync(out)) { skipped++; continue; }

  // Mesh có thể nằm ở file chính hoặc file bù của cùng hệ (Rectum ở bp3d).
  let ok = false;
  for (const model of SYSTEM_MODELS[system] ?? []) {
    const glb = `public/models/${model}.glb`;
    if (!existsSync(glb)) continue;
    try {
      const log = execFileSync(BLENDER, [
        "-b", "--factory-startup", "--python", SCRIPT, "--", glb, mesh, out,
      ], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 300000 });
      if (log.includes("RENDERED")) {
        const kb = Math.round(statSync(out).size / 1024);
        const hit = (log.match(/LESION_HIT (\d+)/) ?? [])[1] ?? "?";
        console.log(`ok    ${slug.padEnd(32)} ${hit} mesh, ${kb}KB  [${model}]`);
        ok = true;
        break;
      }
    } catch {
      /* thử model kế tiếp của cùng hệ */
    }
  }
  if (ok) done++; else { failed.push(`${slug} (${mesh} / ${system})`); console.error(`LỖI  ${slug}`); }
}

console.log(`\nrender ${done}, bỏ qua ${skipped} (đã có), lỗi ${failed.length}`);
if (failed.length) {
  failed.forEach((f) => console.error("  " + f));
  process.exit(1);
}
