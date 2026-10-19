/**
 * Cổng kiểm tra ngân hàng đề trước khi commit.
 *
 *     npm run verify:quiz-bank
 *
 * Luật hợp lệ nằm ở `src/lib/anatomy/examBankRules.mjs` — cùng bộ luật mà trang
 * quiz chạy lúc nạp JSON, nên không có chuyện qua được kiểm ở đây rồi ra trình
 * duyệt lại hỏng.
 *
 * Chỉ gác CẤU TRÚC. Chữ hỏng do OCR là việc của `npm run audit:quiz-ocr`.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { countByRegion, examBankErrors } from "../src/lib/anatomy/examBankRules.mjs";

function fail(label, errors) {
  console.error(`${label} không đạt (${errors.length} lỗi):`);
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  if (errors.length > 50) console.error(`… và ${errors.length - 50} lỗi nữa.`);
  process.exit(1);
}

const bank = JSON.parse(await readFile(path.resolve("public/kb/anatomy-mcq.json"), "utf8"));
const errors = examBankErrors(bank);

if (errors.length) fail("Ngân hàng đề giáo trình", errors);

const counts = countByRegion(bank);
console.log(`Ngân hàng hợp lệ: ${bank.questions.length} câu, ${counts.size} vùng.`);
for (const [region, count] of [...counts.entries()].sort()) console.log(`- ${region}: ${count}`);

// Đề trường Y: index là danh mục duy nhất, mỗi file trong index phải qua cùng
// cổng kiểm — đề trường không rõ nguồn là không được vào thư viện mặc định.
const index = JSON.parse(await readFile(path.resolve("public/kb/schools/index.json"), "utf8"));
if (!Array.isArray(index?.schools)) {
  console.error("index đề trường phải có mảng `schools`.");
  process.exit(1);
}
const seen = new Set();
for (const entry of index.schools) {
  if (!entry?.id || !entry?.name || !entry?.file || seen.has(entry.id)) {
    console.error(`Mục đề trường thiếu id/tên/file hoặc trùng id: ${JSON.stringify(entry)}`);
    process.exit(1);
  }
  seen.add(entry.id);
  if (!/^[\w-]+\.json$/.test(entry.file)) {
    console.error(`Tên file không an toàn (chỉ chữ, số, gạch): ${entry.file}`);
    process.exit(1);
  }
  const school = JSON.parse(await readFile(path.resolve("public/kb/schools", entry.file), "utf8"));
  const schoolErrors = examBankErrors(school);
  if (schoolErrors.length) fail(`Đề ${entry.name}`, schoolErrors);
  console.log(`Đề ${entry.name}: ${school.questions.length} câu.`);
}
if (index.schools.length === 0) console.log("Chưa có đề trường nào (index rỗng) — nguồn này hiện trạng thái trống.");
