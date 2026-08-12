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

const bank = JSON.parse(await readFile(path.resolve("public/kb/anatomy-mcq.json"), "utf8"));
const errors = examBankErrors(bank);

if (errors.length) {
  console.error(`Ngân hàng đề không đạt (${errors.length} lỗi):`);
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  if (errors.length > 50) console.error(`… và ${errors.length - 50} lỗi nữa.`);
  process.exit(1);
}

const counts = countByRegion(bank);
console.log(`Ngân hàng hợp lệ: ${bank.questions.length} câu, ${counts.size} vùng.`);
for (const [region, count] of [...counts.entries()].sort()) console.log(`- ${region}: ${count}`);
