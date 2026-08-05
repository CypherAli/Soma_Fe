// Liệt kê tên node thật trong file .glb (đọc thẳng JSON chunk, không cần three.js).
// Dùng: node scripts/glb-nodes.mjs public/models/forearm.glb [lọc]
import { readFileSync } from "node:fs";

const file = process.argv[2];
const filter = (process.argv[3] || "").toLowerCase();
const buf = readFileSync(file);
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));
const names = (json.nodes || []).map((n) => n.name || "(unnamed)");
const out = filter ? names.filter((n) => n.toLowerCase().includes(filter)) : names;
out.sort((a, b) => a.localeCompare(b));
for (const n of out) console.log(n);
console.error(`--- ${out.length}/${names.length} node ---`);
