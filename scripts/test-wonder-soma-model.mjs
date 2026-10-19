import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { CATALOG, buildModelAsync } from "../public/wonder/src/models/catalog.js";
// Kiểm tra model convert (node scripts/test-wonder-soma-model.mjs "Cánh tay")
const name = process.argv[2] || "Cánh tay";
const i = CATALOG.findIndex((d) => d.name === name);
if (i < 0) { console.error("không thấy model:", name); process.exit(1); }
// Source regions load asynchronously in production; read the same local assets.
globalThis.fetch = async url => new Response(await readFile(new URL(url)));
const m = await buildModelAsync(i, 20000);
assert(m.labels.length > 0);
assert(m.target.every(Number.isFinite));
assert(m.offset.every(Number.isFinite));
console.log("index:", i, "| labels:", m.labels.length, "| fitScale:", m.fitScale.toFixed(3), "| ms:", m.ms.toFixed(0));
let bad = 0;
for (let k = 0; k < m.pick.length; k++) if (!(m.pick[k] >= 0 && m.pick[k] < m.labels.length)) bad++;
console.log("pick invalid:", bad, "| groups:", m.groups.join(" / ").slice(0, 200));
if (bad > 0) process.exit(1);
