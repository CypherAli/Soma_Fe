import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { drLamBankErrors, drLamCatalog, drLamCorrect, drLamScore, type DrLamBank } from "../src/lib/anatomy/drLamBank.ts";

const directory = path.resolve("public/kb/dr-lam");
const report = JSON.parse(readFileSync(path.join(directory, "import-report.json"), "utf8")) as { id: string; imported: number; expected: number; review: unknown[] }[];
assert.equal(drLamCatalog.exams.length, 30);
let count = 0, imageCount = 0;
const banks = new Map<string, DrLamBank>();
for (const entry of drLamCatalog.exams) {
  const bank = JSON.parse(readFileSync(path.join(directory, entry.file), "utf8")) as DrLamBank;
  assert.deepEqual(drLamBankErrors(bank), [], entry.id);
  assert.equal(bank.questions.length, entry.count);
  assert.equal(bank.id, entry.id);
  assert.equal(bank.questions.filter(q => q.gradable).length, entry.gradableCount);
  assert.equal(entry.gradableCount, entry.count, `All supplied questions have original marked keys: ${entry.id}`);
  assert.ok(["upper-limb", "lower-limb", "head-neck", "senses", "thorax", "abdomen-pelvis", "nervous", "clinical", "review", "mock"].includes(entry.topic), `Missing topic: ${entry.id}`);
  const figures = bank.questions.flatMap(q => [...q.images, ...q.explanationImages]);
  assert.equal(entry.imageCount, figures.length, `Figure coverage: ${entry.id}`);
  assert.equal(entry.illustratedCount, bank.questions.filter(q => q.images.length || q.explanationImages.length).length);
  if (entry.cover) assert.ok(figures.includes(entry.cover), `Cover must come from this source: ${entry.id}`);
  const imported = report.find(r => r.id === entry.id)!;
  assert.equal(imported.imported, imported.expected, `PDF completeness: ${entry.id}`);
  assert.equal(imported.review.length, entry.count - entry.gradableCount);
  for (const q of bank.questions) {
    assert.ok(!/chrome-extension:|Câu hỏi\s+\d+:/.test(q.stem + q.explanation), `Page artifact: ${q.id}`);
    for (const url of [...q.images, ...q.explanationImages]) {
      assert.ok(existsSync(path.resolve("public", url.slice(1))), `Missing image ${url}`);
      imageCount++;
    }
  }
  count += bank.questions.length;
  banks.set(entry.id, bank);
}
assert.equal(count, 2810);
assert.equal(drLamCatalog.totalQuestions, count);
assert.equal(drLamCatalog.exams.filter(e => e.topic === "mock").length, 9);
assert.equal(drLamCatalog.exams.filter(e => e.topic === "review").length, 4);
assert.equal(drLamCatalog.exams.filter(e => e.topic === "abdomen-pelvis").length, 6);

// The user's screenshot provides an independent known answer (C).
const first = banks.get("de-thi-thu-9")!.questions[0];
assert.deepEqual(first.answers, ["C"]);
assert.equal(first.stem, "Các mô tả sau đây về cử động ngửa cẳng tay đều đúng trừ:");
assert.equal(first.options[0].text, "ngửa là làm tay hướng ra trước.");
assert.ok(drLamCorrect(first, ["C"]));
assert.ok(!drLamCorrect(first, ["A"]));
assert.ok(!drLamCorrect(first, undefined));

const multi = banks.get("cau-hoi-dung-sai-co-than-chung-la-bung")!.questions[1];
assert.deepEqual(multi.answers, ["A", "C", "D"]);
assert.ok(drLamCorrect(multi, ["D", "A", "C"]));
assert.ok(!drLamCorrect(multi, ["A", "C"]));
assert.ok(!drLamCorrect(multi, ["A", "B", "C", "D"]));

// Option body and label cross a physical PDF page break.
const split = banks.get("giai-phau-chi-tren")!.questions[136];
assert.equal(split.options[0].text, "nó là một trong số hai nhánh tận của động mạch cánh tay.");
assert.ok(!split.stem.includes("nó là một trong"));
assert.deepEqual(banks.get("da-day-gan-ruot")!.questions[39].answers, ["C"]);

// A shared section prompt must not contaminate the preceding option or hint.
const review = banks.get("on-tap-giai-phau-1")!.questions;
assert.equal(review[45].options[3].text, "Xương sườn thứ 3");
assert.equal(review[46].context, "Về bộ răng vĩnh viễn:");
assert.equal(review[50].context, "Về bộ răng sữa");
assert.equal(review[54].context, "Về cấu tạo của răng:");
const clinicalSplit = banks.get("tong-hop-cac-case-lam-sang-quan-trong")!.questions[120];
assert.equal(clinicalSplit.options[3].text, "Giãn\\ Giãn\\ Giãn\\ Giãn.");
assert.equal(clinicalSplit.options[4].text, "Bình thường\\ Bình thường\\ Giãn\\ Giãn.");

const picks = { [first.id]: ["C"], [multi.id]: ["A"] };
const totals = drLamScore([first, multi, split], picks);
assert.deepEqual(totals, { correct: 1, wrong: 1, skipped: 1, total: 3, ungraded: 0 });
const withoutKey = { ...first, id: "no-key", answers: [], gradable: false };
assert.deepEqual(drLamScore([first, withoutKey], picks), { correct: 1, wrong: 0, skipped: 0, total: 1, ungraded: 1 });
console.log(`Verified 30 source PDFs: ${count} questions, ${imageCount} image references; single/multiple answers, pagination, scoring passed.`);
