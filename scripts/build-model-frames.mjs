// Sinh `src/lib/anatomy/modelFrames.json` — khung hình chuẩn của mọi model.
//
//   npm run models:frames
//
// Chạy lại SAU MỖI LẦN xuất model từ Blender. Viewer và trình render ảnh đều
// đọc file này, nên khung hình trong trang web và trong ảnh thumbnail luôn khớp
// nhau, và không đổi giữa hai lần mở trang.
//
// `bytes` được lưu để `verify:models` biết file .glb đã thay đổi mà bảng khung
// hình chưa chạy lại.

import { readdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { frameOf, TRIM, FRAME_PAD } from "./model-frame.mjs";

const MODELS = "public/models";
const OUT = "src/lib/anatomy/modelFrames.json";

const files = readdirSync(MODELS).filter((f) => f.endsWith(".glb")).sort();
const frames = {};
const failed = [];

for (const file of files) {
  try {
    frames[file] = frameOf(join(MODELS, file));
  } catch (error) {
    failed.push(`${file}: ${error.message}`);
  }
}

const out = {
  // Ghi luôn tham số đã dùng: đọc file JSON mà không biết nó cắt phân vị bao
  // nhiêu thì không kiểm chứng lại được con số nào trong đó.
  rule: { trim: TRIM, pad: FRAME_PAD, unit: "m", up: "+Y", front: "+Z" },
  generatedFrom: `${files.length} .glb trong ${MODELS}`,
  frames,
};

let previous = "";
try {
  previous = readFileSync(OUT, "utf8");
} catch {
  /* lần đầu chưa có file */
}
const next = JSON.stringify(out, null, 2) + "\n";
if (next !== previous) writeFileSync(OUT, next);

console.log(`${Object.keys(frames).length}/${files.length} model -> ${OUT}${next === previous ? " (không đổi)" : ""}`);
for (const line of failed) console.error("  HỎNG", line);
process.exit(failed.length ? 1 : 0);
