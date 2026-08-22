// KIỂM TRA MODEL THEO CHUẨN DỰNG (docs/CHUAN-DUNG-MODEL.md).
//
//   npm run verify:models
//
// Chạy sau mỗi lần xuất model từ Blender, cùng lúc với `npm run verify:scenes`
// (cái kia soát TÊN mesh trong nhãn, cái này soát HÌNH HỌC và khung hình).
//
// Bắt bốn thứ hay sai nhất, đều là thứ chỉ lộ ra khi mở trang lên nhìn:
//   1. bảng khung hình cũ hơn file .glb -> viewer canh khung theo số đo của
//      bản xuất trước, mô hình lệch khỏi giữa khung;
//   2. model bị lật trục (Z-up lọt ra ngoài) -> nằm ngang thay vì đứng;
//   3. quá ngân sách tam giác -> máy yếu tụt khung hình;
//   4. scene khai một file model không tồn tại -> khung xem trắng trơn.

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";

const MODELS = "public/models";
const FRAMES = "src/lib/anatomy/modelFrames.json";
// Ngân sách tam giác, tính theo TAM GIÁC TRONG .glb.
// Cẩn thận khi so với TRI_BUDGET=900_000 của export_region.py: chỗ đó đếm
// `len(o.data.polygons)` của Blender, mà lưới Z-Anatomy phần lớn là tứ giác —
// một polygon thành hai tam giác khi xuất glTF. Nên 900k polygon ≈ 1,8 triệu
// tam giác, và đó là con số dưới đây.
const TRI_BUDGET = 1_800_000;
/** Model cao hơn mức này là cả người; dưới mức này phải là một vùng. */
const FULLBODY_M = 1.5;

const problems = [];
const warnings = [];

const table = JSON.parse(readFileSync(FRAMES, "utf8"));
const frames = table.frames;
const files = readdirSync(MODELS).filter((f) => f.endsWith(".glb")).sort();

// 1. bảng khung hình phải khớp file trên đĩa
for (const file of files) {
  const frame = frames[file];
  if (!frame) {
    problems.push(`${file}: chưa có trong ${FRAMES} — chạy \`npm run models:frames\``);
    continue;
  }
  const bytes = statSync(join(MODELS, file)).size;
  if (bytes !== frame.bytes) {
    problems.push(
      `${file}: .glb đã đổi (${bytes} byte) mà bảng khung vẫn ghi ${frame.bytes} — chạy \`npm run models:frames\``,
    );
  }
}
for (const file of Object.keys(frames)) {
  if (!files.includes(file)) warnings.push(`${file}: có trong bảng khung nhưng KHÔNG còn file .glb`);
}

// 2..3. hình học từng model
for (const [file, frame] of Object.entries(frames)) {
  if (!files.includes(file)) continue;
  const [w, h, d] = frame.box.size;

  // Z-Anatomy xuất Y-up: người đứng thì chiều CAO phải là trục Y, model lớn mà
  // dày trước–sau hơn cả chiều cao thì gần như chắc chắn đã lọt trục Z-up. Chỉ
  // soi trên model LỚN: bàn chân, hộp sọ vốn dày hơn cao, báo ở đó chỉ là nhiễu.
  if (h > 0.5 && d > h * 1.2) {
    warnings.push(`${file}: dày trước–sau ${d.toFixed(2)}m > cao ${h.toFixed(2)}m — kiểm tra export_yup`);
  }
  if (frame.tris > TRI_BUDGET) {
    warnings.push(`${file}: ${frame.tris.toLocaleString()} tam giác > ngân sách ${TRI_BUDGET.toLocaleString()}`);
  }
  if (h > FULLBODY_M && !/^(skeletal|muscular|nervous|cardiovascular|lymphoid|joints|connective_tissue|fascia_system|fullbody|visceral)/.test(file)) {
    warnings.push(`${file}: cao ${h.toFixed(2)}m — model vùng mà lấy trọn cả người?`);
  }
  // Khung phân vị nhỏ hơn hộp thật quá nhiều = có cấu trúc trườn xa khỏi vùng.
  const spill = Math.max(...frame.box.size) / Math.max(...frame.size);
  if (spill > 1.35) {
    warnings.push(`${file}: hộp bao rộng gấp ${spill.toFixed(2)} lần khung — có mesh trườn ra ngoài vùng, soát lại hộp cắt`);
  }
  if (w <= 0 || h <= 0 || d <= 0) problems.push(`${file}: hộp bao rỗng`);
}

// 4. mọi scene phải trỏ tới file có thật
const scenes = [];
for (const src of readdirSync("src/lib/scenes").filter((f) => f.endsWith(".ts"))) {
  const text = readFileSync(join("src/lib/scenes", src), "utf8");
  for (const m of text.matchAll(/modelFile:\s*"([^"]+)"/g)) scenes.push([src, m[1]]);
}
const misc = readFileSync("src/lib/sceneModules.ts", "utf8");
for (const m of misc.matchAll(/modelFile:\s*"([^"]+)"/g)) scenes.push(["sceneModules.ts", m[1]]);

for (const [src, url] of scenes) {
  const file = url.split("/").pop();
  if (!existsSync(join("public", url.replace(/^\//, "")))) {
    problems.push(`${src}: model "${url}" không tồn tại`);
  } else if (!frames[file]) {
    problems.push(`${src}: model "${url}" chưa có khung hình chuẩn`);
  }
}

const used = new Set(scenes.map(([, u]) => u.split("/").pop()));
const orphan = files.filter((f) => !used.has(f));

console.log(`${files.length} model · ${scenes.length} scene trỏ tới ${used.size} model`);
if (orphan.length) console.log(`${orphan.length} model chưa scene nào dùng: ${orphan.join(", ")}`);
for (const w of warnings) console.log("  ! ", w);
for (const p of problems) console.error("  ✗ ", p);
console.log(problems.length ? `\nHỎNG ${problems.length} lỗi` : "\nĐẠT CHUẨN");
process.exit(problems.length ? 1 : 0);
