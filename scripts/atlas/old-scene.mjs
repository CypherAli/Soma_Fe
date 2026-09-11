/**
 * In nhãn của scene Z-Anatomy cũ để đối chiếu khi chuyển sang atlas.
 * Chạy: node scripts/atlas/old-scene.mjs <slug> [<slug>…]
 */
import fs from "fs";

const dir = new URL("../../src/lib/scenes/", import.meta.url);
const text = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => fs.readFileSync(new URL(f, dir), "utf8"))
  .join("\n");

for (const slug of process.argv.slice(2)) {
  const start = text.indexOf(`slug: "${slug}"`);
  if (start < 0) {
    console.log(`== ${slug}: KHONG THAY`);
    continue;
  }
  const next = text.indexOf('slug: "', start + 10);
  const block = text.slice(start, next < 0 ? undefined : next);
  const title = block.match(/title: \{ vi: "([^"]*)"/)?.[1] ?? "";
  console.log(`== ${slug} — ${title}`);
  for (const m of block.matchAll(/meshName: "([^"]*)"[\s\S]*?label: \{ vi: "([^"]*)"/g))
    console.log("  ", m[1].padEnd(55), m[2]);
}
