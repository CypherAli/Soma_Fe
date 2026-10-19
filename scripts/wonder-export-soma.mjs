// Convert 1 scene atlas (BodyParts3D thật) thành model WonderSnap procedural.
// Chạy: node --import ./scripts/ts-resolve.mjs scripts/wonder-export-soma.mjs <slug> [--name=".."] [--seeds=30000]
// Ra: public/wonder/src/models/soma-<slug>.js (+ soma-cloud.js runtime chung).
// Làm từng bài một theo yêu cầu: xong bài nào báo để test rồi mới làm tiếp.
import { atlasScenes } from "../src/lib/humanAtlas/scenes/index.ts";
import { SYSTEMS } from "../src/lib/humanAtlas/anatomy.ts";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const opt = (k, d) => {
  const a = args.find((x) => x.startsWith(k + "="));
  return a ? a.slice(k.length + 1) : d;
};
if (!slug || !atlasScenes[slug]) {
  console.error("slug không có. Ví dụ: bo-phan-canh-tay");
  process.exit(1);
}
const SEED_BUDGET = parseInt(opt("--seeds", "30000"), 10);
const scene = atlasScenes[slug];
const shortDefault = scene.title.vi.split("—")[0].replace(/^Giải phẫu\s+/i, "").trim();
const MODEL_NAME = opt("--name", shortDefault);
const MODEL_FACT = opt("--fact", [scene.latin, `${scene.groups.length} nhóm`].filter(Boolean).join(" · "));

const sysColor = new Map(SYSTEMS.map((s) => [s.id, s.color]));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "public/human-atlas/atlas.json"), "utf8"));
const partById = new Map(manifest.parts.map((p) => [p.id, p]));
const chunkCache = new Map();
function chunkBuffer(i) {
  if (!chunkCache.has(i)) {
    const c = manifest.chunks[i];
    const base = path.join(ROOT, "public/human-atlas");
    const names = [c.gzip, c.url].filter(Boolean);
    let raw = null;
    for (const n of names) {
      // URL có tiền tố /models/ nhưng file nằm thẳng trong human-atlas/.
      const tries = [path.join(base, n.replace(/^\//, "")), path.join(base, path.basename(n))];
      for (const f of tries) if (fs.existsSync(f)) { raw = fs.readFileSync(f); break; }
      if (raw) break;
    }
    if (!raw) throw new Error("thiếu chunk " + i);
    const buf = raw[0] === 0x1f && raw[1] === 0x8b ? zlib.gunzipSync(raw) : raw;
    if (buf.byteLength !== c.bytes) throw new Error(`chunk ${i} lệch ${buf.byteLength} != ${c.bytes}`);
    chunkCache.set(i, buf);
  }
  return chunkCache.get(i);
}

// Lấy mẫu đều trên mặt lưới theo diện tích tam giác.
function samplePart(buf, rec, count, out) {
  const pos = new Float32Array(buf.buffer, buf.byteOffset + rec.positions, rec.vertexCount * 3);
  const idx = rec.indexCount > 0 ? new Uint32Array(buf.buffer, buf.byteOffset + rec.indices, rec.indexCount) : null;
  const triCount = idx ? rec.indexCount / 3 : Math.floor(rec.vertexCount / 3);
  const ax = [0, 0, 0], bx = [0, 0, 0], cx = [0, 0, 0];
  const gv = (vi, o) => { o[0] = pos[vi * 3]; o[1] = pos[vi * 3 + 1]; o[2] = pos[vi * 3 + 2]; };
  const cum = new Float64Array(Math.max(triCount, 1));
  let total = 0;
  for (let t = 0; t < triCount; t++) {
    const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
    gv(a, ax); gv(b, bx); gv(c, cx);
    const ux = bx[0] - ax[0], uy = bx[1] - ax[1], uz = bx[2] - ax[2];
    const vx = cx[0] - ax[0], vy = cx[1] - ax[1], vz = cx[2] - ax[2];
    const crx = uy * vz - uz * vy, cry = uz * vx - ux * vz, crz = ux * vy - uy * vx;
    total += 0.5 * Math.hypot(crx, cry, crz);
    cum[t] = total;
  }
  const pts = [];
  if (total <= 1e-12) {
    for (let n = 0; n < count; n++) {
      const vi = (n * rec.vertexCount / Math.max(count, 1)) | 0;
      pts.push(pos[vi * 3], pos[vi * 3 + 1], pos[vi * 3 + 2]);
    }
    out.push(...pts);
    return 0;
  }
  for (let n = 0; n < count; n++) {
    const r = Math.random() * total;
    let lo = 0, hi = triCount - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < r) lo = mid + 1; else hi = mid; }
    const a = idx ? idx[lo * 3] : lo * 3, b = idx ? idx[lo * 3 + 1] : lo * 3 + 1, c = idx ? idx[lo * 3 + 2] : lo * 3 + 2;
    gv(a, ax); gv(b, bx); gv(c, cx);
    const r1 = Math.random(), r2 = Math.random(), s1 = Math.sqrt(r1);
    const u = 1 - s1, v = s1 * (1 - r2), w = s1 * r2;
    pts.push(ax[0] * u + bx[0] * v + cx[0] * w, ax[1] * u + bx[1] * v + cx[1] * w, ax[2] * u + bx[2] * v + cx[2] * w);
  }
  out.push(...pts);
  return total;
}

const trunc = (s, n) => {
  s = (s || "").replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  const cut = s.lastIndexOf(" ", n);
  return s.slice(0, cut > 40 ? cut : n) + "…";
};

// Đếm diện tích từng part để chia ngân sách seed.
const groupSeeds = [];
for (const g of scene.groups) {
  const parts = [];
  for (const pid of g.parts) {
    const rec = partById.get(pid);
    if (!rec) { console.warn("  thiếu part:", pid); continue; }
    parts.push({ rec, buf: chunkBuffer(rec.chunk) });
  }
  groupSeeds.push({ g, parts });
}
// Ước lượng diện tích nhanh bằng bounds (tránh đọc lưới 2 lần): dùng vertexCount làm proxy.
const weights = groupSeeds.map(({ parts }) => parts.reduce((a, p) => a + Math.max(p.rec.vertexCount, 1), 0));
const wTotal = weights.reduce((a, b) => a + b, 0) || 1;
let totalSeeds = 0;
const perGroup = groupSeeds.map(({ g, parts }) => {
  const perPart = parts.map((p) => Math.max(250, Math.round((SEED_BUDGET * Math.max(p.rec.vertexCount, 1)) / wTotal)));
  const n = perPart.reduce((a, b) => a + b, 0);
  totalSeeds += n;
  return { g, parts, perPart, n };
});

const allPts = [];
const groupsMeta = [];
for (const pg of perGroup) {
  const start = allPts.length / 3;
  const cx = [0, 0, 0];
  pg.parts.forEach((p, i) => {
    const before = allPts.length;
    samplePart(p.buf, p.rec, pg.perPart[i], allPts);
    for (let k = before; k < allPts.length; k += 3) { cx[0] += allPts[k]; cx[1] += allPts[k + 1]; cx[2] += allPts[k + 2]; }
  });
  const count = (allPts.length / 3) - start;
  const cen = count > 0 ? [cx[0] / count, cx[1] / count, cx[2] / count] : [0, 0, 0];
  groupsMeta.push({ ...pg, start, count, cen });
}
// Tâm + kích thước model từ toàn bộ seed.
const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < allPts.length; i += 3) {
  for (let k = 0; k < 3; k++) {
    if (allPts[i + k] < lo[k]) lo[k] = allPts[i + k];
    if (allPts[i + k] > hi[k]) hi[k] = allPts[i + k];
  }
}
const center = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
const maxDim = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2], 1e-6);
let maxDist = 1e-6;
const dists = groupsMeta.map((m) => Math.hypot(m.cen[0] - center[0], m.cen[1] - center[1], m.cen[2] - center[2]));
for (const d of dists) if (d > maxDist) maxDist = d;

const hexRe = /^#[0-9a-fA-F]{6}$/;
const colorOf = (g, parts) => {
  let hex = g.tint;
  if (!hex || !hexRe.test(hex)) {
    const sys = parts.length ? partById.get(parts[0])?.system : null;
    hex = (sys && sysColor.get(sys)) || "#e8e2d0";
  }
  return hex;
};
const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const G = groupsMeta.map((m, gi) => {
  const d = dists[gi];
  let dir = [m.cen[0] - center[0], m.cen[1] - center[1], m.cen[2] - center[2]];
  const l = Math.hypot(...dir);
  if (l < 1e-9) {
    const a = (gi / Math.max(groupsMeta.length, 1)) * Math.PI * 2;
    dir = [Math.cos(a), 0, Math.sin(a)];
  } else dir = [dir[0] / l, dir[1] / l, dir[2] / l];
  const mag = maxDim * 0.5;
  const hex = colorOf(m.g, m.parts.map((p) => p.rec.id));
  return {
    label: m.g.name.vi,
    info: trunc(m.g.note?.vi, 110),
    color: hex,
    rgb: toRgb(hex),
    offset: [dir[0] * mag, dir[1] * mag, dir[2] * mag],
    stage: +(0.55 * (d / maxDist)).toFixed(3),
    start: m.start,
    count: m.count,
  };
});
const jitter = maxDim * 0.002;
const f32 = new Float32Array(allPts);
const b64 = Buffer.from(f32.buffer, f32.byteOffset, f32.byteLength).toString("base64");
const biggest = [...G].sort((a, b) => b.count - a.count)[0];

const cloudJs = `// Runtime chung cho model convert từ atlas (Soma -> WonderSnap). Worker-safe.
import { Part } from '../lib/sampling.js';
const _dc = new Map();
export function decodeCloud(b64) {
  let f = _dc.get(b64.length + ":" + b64.slice(0, 16));
  if (!f) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    f = new Float32Array(bytes.buffer);
    _dc.set(b64.length + ":" + b64.slice(0, 16), f);
  }
  return f;
}
export function cloudPart(data, start, count, jitter) {
  return new Part((rng, o, i) => {
    const s = (start + ((rng.random() * count) | 0)) * 3;
    const j = i * 3;
    o[j] = data[s] + rng.normal() * jitter;
    o[j + 1] = data[s + 1] + rng.normal() * jitter;
    o[j + 2] = data[s + 2] + rng.normal() * jitter;
  }, count);
}
export function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
`;
const outDir = path.join(ROOT, "public/wonder/src/models");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "soma-cloud.js"), cloudJs);

const varName = "SOMA_" + slug.toUpperCase().replace(/-/g, "_");
const lines = [];
lines.push(`// Model convert từ atlas Soma (scene ${slug}) — SINH TỰ ĐỘNG, đừng sửa tay.`);
lines.push(`// Chạy lại: node --import ./scripts/ts-resolve.mjs scripts/wonder-export-soma.mjs ${slug}`);
lines.push(`import { decodeCloud, cloudPart, hexRgb } from './soma-cloud.js';`);
lines.push(`const DATA = decodeCloud("${b64}");`);
lines.push(`const JITTER = ${jitter};`);
lines.push(`const GROUPS = ${JSON.stringify(G.map((g) => ({ ...g, rgb: undefined })), null, 1)};`);
lines.push(`let _d = null;`);
lines.push(`export const ${varName} = {`);
lines.push(`  name: ${JSON.stringify(MODEL_NAME)},`);
lines.push(`  fact: ${JSON.stringify(MODEL_FACT)},`);
lines.push(`  color: ${JSON.stringify(biggest.rgb)},`);
lines.push(`  groups() {`);
lines.push(`    _d ??= DATA;`);
lines.push(`    return GROUPS.map((g) => ({ label: g.label, info: g.info, color: hexRgb(g.color), offset: g.offset, stage: g.stage, parts: [cloudPart(_d, g.start, g.count, JITTER)] }));`);
lines.push(`  },`);
lines.push(`};`);
fs.writeFileSync(path.join(outDir, `soma-${slug}.js`), lines.join("\n") + "\n");

console.log(`model: ${MODEL_NAME} | fact: ${MODEL_FACT}`);
console.log(`groups: ${G.length} | seeds: ${totalSeeds} | ${(b64.length / 1024).toFixed(0)} KB base64`);
for (const g of G) console.log(` - ${g.label} [${g.count}] ${g.color} off=[${g.offset.map((v) => v.toFixed(2)).join(",")}] st=${g.stage}`);
console.log(`\nfile: public/wonder/src/models/soma-${slug}.js`);
console.log(`\n-- them vao public/wonder/src/models/catalog.js --`);
console.log(`import { ${varName} } from './soma-${slug}.js';`);
console.log(`...[...ANATOMY, ...ANATOMY2, ...BODY, ${varName}].map(...)`);
console.log(`VN_ALIAS thêm: ${slug.replace(/-/g, " ")} / tên rút gọn`);
fs.unlinkSync(path.join(ROOT, "scripts/tmp-list-scenes.mjs"));
