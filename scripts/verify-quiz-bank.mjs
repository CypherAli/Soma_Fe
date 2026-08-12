import { readFile } from "node:fs/promises";
import path from "node:path";

const bankPath = path.resolve("public/kb/anatomy-mcq.json");
const bank = JSON.parse(await readFile(bankPath, "utf8"));
const errors = [];
const ids = new Set();
const counts = new Map();

if (!bank?.source?.title) errors.push("Thiếu thông tin nguồn.");
if (!Array.isArray(bank?.questions) || bank.questions.length === 0) errors.push("Ngân hàng không có câu hỏi.");

for (const [index, question] of (bank.questions ?? []).entries()) {
  const label = question?.id || `index ${index}`;
  const letters = Object.keys(question?.options ?? {}).sort().join("");
  if (!question?.id || ids.has(question.id)) errors.push(`${label}: ID thiếu hoặc trùng.`);
  if (!question?.region?.trim()) errors.push(`${label}: thiếu vùng giải phẫu.`);
  if (!question?.stem?.trim()) errors.push(`${label}: thiếu câu hỏi.`);
  if (letters !== "ABCDE") errors.push(`${label}: phải có đúng A–E.`);
  if (!question?.answer || !(question.answer in (question.options ?? {}))) errors.push(`${label}: khóa đáp án không hợp lệ.`);
  if (!question?.explanation?.trim()) errors.push(`${label}: thiếu lời giải.`);
  if (!question?.source?.questionPage || !question?.source?.answerPage) errors.push(`${label}: thiếu trang truy vết nguồn.`);
  if (question?.id) ids.add(question.id);
  if (question?.region) counts.set(question.region, (counts.get(question.region) ?? 0) + 1);
}

if (errors.length) {
  console.error(`Ngân hàng đề không đạt (${errors.length} lỗi):`);
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Ngân hàng hợp lệ: ${bank.questions.length} câu, ${counts.size} vùng.`);
  for (const [region, count] of [...counts.entries()].sort()) console.log(`- ${region}: ${count}`);
}
