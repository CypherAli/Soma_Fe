/**
 * Khảo sát hình học các mảnh atlas — bước 1 của sổ tay, bằng SỐ chứ không đoán.
 * Chạy: node scripts/atlas/survey.mjs <regex tên> [--dup]
 *
 * In mỗi mảnh: id, hệ, số tam giác, kích thước (cm), trọng tâm đỉnh (m),
 * tỉ lệ dài/mảnh. `--dup` báo các cặp mảnh có CÙNG lưới (trọng tâm lệch
 * < 1mm và cùng số đỉnh) — atlas có nhiều bản sao trùng tên khác mã.
 */
import fs from "fs";

const root = new URL("../../", import.meta.url);
const atlas = JSON.parse(fs.readFileSync(new URL("public/human-atlas/atlas.json", root), "utf8"));
const bufs = new Map();
const chunk = (i) => {
  if (!bufs.has(i)) {
    const b = fs.readFileSync(new URL("public" + atlas.chunks[i].url.replace("/models", "/human-atlas"), root));
    bufs.set(i, b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  }
  return bufs.get(i);
};

export function centroid(p) {
  const v = new Float32Array(chunk(p.chunk), p.positions, p.vertexCount * 3);
  const c = [0, 0, 0];
  for (let i = 0; i < v.length; i += 3) for (let k = 0; k < 3; k++) c[k] += v[i + k];
  return c.map((x) => x / p.vertexCount);
}

const size = (p) => [0, 1, 2].map((i) => (p.bounds[1][i] - p.bounds[0][i]) * 100);

if (process.argv[1]?.endsWith("survey.mjs")) {
  const re = new RegExp(process.argv[2] ?? ".", "i");
  const list = atlas.parts.filter((p) => re.test(p.name) || re.test(p.id));
  const rows = list.map((p) => {
    const s = size(p);
    const c = centroid(p);
    const sorted = [...s].sort((a, b) => b - a);
    return { p, s, c, ratio: sorted[0] / Math.max(sorted[1], 0.01) };
  });
  for (const r of rows)
    console.log(
      r.p.id.padEnd(8),
      r.p.system.padEnd(11),
      String(r.p.indexCount / 3).padStart(6),
      r.s.map((x) => x.toFixed(1)).join("x").padEnd(15),
      r.c.map((x) => x.toFixed(3)).join(",").padEnd(22),
      r.ratio.toFixed(1).padStart(5),
      r.p.name,
    );
  if (process.argv.includes("--dup")) {
    console.log("--- trung luoi ---");
    for (let i = 0; i < rows.length; i++)
      for (let j = i + 1; j < rows.length; j++) {
        const a = rows[i], b = rows[j];
        const d = Math.hypot(...a.c.map((x, k) => x - b.c[k]));
        if (d < 0.001 && Math.abs(a.p.vertexCount - b.p.vertexCount) / a.p.vertexCount < 0.2)
          console.log(a.p.id, b.p.id, a.p.name, "|", b.p.name, (d * 1000).toFixed(2) + "mm");
      }
  }
  console.log("tong", rows.length);
}
