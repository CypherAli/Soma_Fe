/**
 * Kiểm toán mọi scene atlas đã sinh — chạy: node scripts/atlas/audit.mjs > report.txt
 *
 * Với từng scene:
 *  1. Mỗi nhóm: số mảnh + tên thành viên (gộp trùng tên) để soát sai nhóm.
 *  2. Lưới TRÙNG trong cùng scene: trọng tâm lệch < 2mm và số đỉnh lệch < 25%.
 *  3. Mảnh LẠC CHỖ: trọng tâm cách trọng tâm nhóm > 3 lần bán kính trung vị.
 *  4. Nhóm tô cùng một màu với nhóm khác (khó phân biệt khi học).
 */
import fs from "fs";
import { P } from "./lib.mjs";
import { centroid } from "./survey.mjs";

const dir = new URL("../../src/lib/humanAtlas/scenes/", import.meta.url);
const byId = new Map(P.map((p) => [p.id, p]));
const cen = new Map();
const C = (id) => {
  if (!cen.has(id)) cen.set(id, centroid(byId.get(id)));
  return cen.get(id);
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && !["index.ts", "types.ts"].includes(f))) {
  const src = fs.readFileSync(new URL(f, dir), "utf8");
  // Neo vào "groups" CẤP ĐẦU (thụt 2 dấu cách): bài bộ phận có thêm khoá "groups"
  // bên trong từng LỚP, mẫu không neo bắt nhầm và JSON.parse sập (từng dừng ở 86/149).
  const m = src.match(/\n {2}["']?groups["']?: (\[[\s\S]*\])\s*,?\s*\}\s*;?\s*$/);
  if (!m) { console.log(`## ${f}: KHONG DOC DUOC`); continue; }
  const groups = JSON.parse(m[1]);
  const slug = src.match(/["']?slug["']?: "([^"]+)"/)[1];
  console.log(`\n## ${slug} (${f})`);
  const all = [];
  for (const g of groups) {
    const names = {};
    for (const id of g.parts) {
      const p = byId.get(id);
      if (!p) { console.log(`   !! MA KHONG TON TAI ${id}`); continue; }
      const n = p.name.replace(/\b(left|right)\b/gi, "*");
      names[n] = (names[n] || 0) + 1;
      all.push({ id, g: g.key });
    }
    console.log(`  [${g.key}] ${g.name.vi} (${g.parts.length}) ${g.tint ?? "-"}`);
    console.log("     " + Object.entries(names).map(([n, c]) => (c > 1 ? `${n} x${c}` : n)).join(" | "));
    // lạc chỗ
    if (g.parts.length >= 3) {
      const cs = g.parts.map(C);
      const mid = [0, 1, 2].map((k) => cs.reduce((s, c) => s + c[k], 0) / cs.length);
      const ds = cs.map((c) => dist(c, mid));
      const med = [...ds].sort((a, b) => a - b)[Math.floor(ds.length / 2)] || 0.001;
      g.parts.forEach((id, i) => {
        if (ds[i] > Math.max(3 * med, 0.05)) console.log(`     ?? LAC CHO ${id} ${byId.get(id).name} cach ${(ds[i] * 100).toFixed(1)}cm (trung vi ${(med * 100).toFixed(1)})`);
      });
    }
  }
  // trùng lưới
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      const a = byId.get(all[i].id), b = byId.get(all[j].id);
      if (Math.abs(a.vertexCount - b.vertexCount) / Math.max(a.vertexCount, b.vertexCount) > 0.25) continue;
      const d = dist(C(a.id), C(b.id));
      if (d < 0.002) console.log(`  !! TRUNG ${a.id} "${a.name}" [${all[i].g}] ~ ${b.id} "${b.name}" [${all[j].g}] ${(d * 1000).toFixed(2)}mm`);
    }
  // màu trùng
  const tints = {};
  groups.forEach((g) => g.tint && (tints[g.tint] = [...(tints[g.tint] || []), g.key]));
  Object.entries(tints).filter(([, k]) => k.length > 1).forEach(([t, k]) => console.log(`  ~~ CUNG MAU ${t}: ${k.join(", ")}`));
}
