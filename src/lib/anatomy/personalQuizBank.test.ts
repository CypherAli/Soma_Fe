import assert from "node:assert/strict";
import test from "node:test";
import { personalQuizBank, personalQuizEntry } from "./personalQuizBank";
import { drLamCorrect } from "./drLamBank";
import { drLamQuestionFeedback } from "./drLamFeedback";
import type { PersonalDoc, PersonalQuestion } from "../personalDocs";

const doc: PersonalDoc = { id: "private-doc", filename: "Tài liệu mới.pdf", pages: 113, bytes: 10, status: "ready", createdAt: "", note: null, questionCount: 2, approvedCount: 1 };
const q: PersonalQuestion = { id: "q1", number: 71, stem: "TM nền có các đặc điểm sau, TRỪ:", options: { A: "Một", B: "Hai", C: "Ba" }, answer: "B", answers: ["B", "C"], explanation: "Giải thích nguồn", explanationImages: ["data:image/webp;base64,UklGRg=="], page: 54, approved: true };

test("only approved private questions enter a document quiz and source numbers survive", () => {
  const bank = personalQuizBank(doc, [q, { ...q, id: "pending", approved: false }]);
  assert.equal(bank.questions.length, 1);
  assert.equal(bank.questions[0].number, 71);
  assert.equal(bank.questions[0].sourcePage, 54);
  assert.equal(personalQuizEntry(bank).illustratedCount, 1);
  assert.ok(!drLamCorrect(bank.questions[0], ["B"]));
  assert.ok(drLamCorrect(bank.questions[0], ["B", "C"]));
  assert.deepEqual(drLamQuestionFeedback(bank.questions[0], "exam", true, false).images, []);
  assert.deepEqual(drLamQuestionFeedback(bank.questions[0], "exam", true, true).images, q.explanationImages);
});
