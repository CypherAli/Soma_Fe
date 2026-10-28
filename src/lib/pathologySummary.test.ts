import assert from "node:assert/strict";
import { test } from "node:test";
import { isSummaryRequest, preparedPathologySummary, summaryRecordForQuestion } from "./pathologySummary";
import type { Pathology } from "./pathologies";

test("Vietnamese and English summary requests stay on the prepared-content path", () => {
  for (const question of ["tóm tắt", "Tóm tắt bài viết này giúp tôi", "tom tat bai nay", "tóm lược", "rút gọn bài", "ý chính của bài", "khái quát bài này", "summary", "summarize this article", "Please summarise", "summarizing the article", "summarisation", "give me a recap", "sum it up", "sum up", "synopsis", "abstract", "short version", "TL;DR", "main points", "key points", "in a nutshell", "摘要"])
    assert.equal(isSummaryRequest(question), true, question);
  for (const question of ["Tiêu chuẩn chẩn đoán?", "Điều trị thế nào?", "Which imaging tests?", "summarily", "triệu chứng của gout"])
    assert.equal(isSummaryRequest(question), false, question);
});

const record: Pathology = {
  id: "test", slug: "test", nameVi: "Bài thử", nameEn: "Test article", nameZh: "测试",
  source: "Test source", sourcePage: 221,
  content: [{ locale: "vi", description: "Nội dung đã biên soạn. Giữ cả câu điều kiện tiếp theo.", clinical: "Dữ liệu lâm sàng có sẵn." }],
};

test("a named summary uses the loaded article list and never guesses an ambiguous record", () => {
  const diabetes = { ...record, nameVi: "Đái tháo đường", nameEn: "Diabetes mellitus" };
  assert.equal(summaryRecordForQuestion([diabetes], "tom tat dai thao duong"), diabetes);
  assert.equal(summaryRecordForQuestion([record], "summary Test article"), record);
  assert.equal(summaryRecordForQuestion([record, { ...record, id: "other" }], "summary Test article"), undefined);
  assert.equal(summaryRecordForQuestion([record], "summary"), undefined);
});

test("prepared summaries use short source excerpts and retain source attribution", () => {
  const summary = preparedPathologySummary(record, "vi");
  assert.equal(summary.engine, "prepared-summary");
  assert.equal(summary.sections.length, 2);
  assert.equal(summary.sections[0].body, "Nội dung đã biên soạn.");
  assert.equal(summary.sources[0].page, 221);
  assert.ok(!summary.answer.includes("**"));
  assert.ok(preparedPathologySummary(record, "en").answer.includes("Vietnamese"));
  const missing = preparedPathologySummary({ ...record, content: [] }, "vi");
  assert.deepEqual(missing.sections, []);
  assert.ok(missing.answer.includes("chưa có"));
});

test("long records produce at most three short points and leave treatment in the full article", () => {
  const content = {locale: "vi", description: "Một câu nguồn rất dài ".repeat(50), clinical: "Biểu hiện chính. Chi tiết thêm.", imaging: "Hình ảnh tham khảo.", progression: "Diễn biến.", treatment: "Điều trị cần đánh giá chuyên môn."};
  const summary = preparedPathologySummary({...record, content: [content]}, "vi");
  assert.equal(summary.sections.length, 3);
  assert.ok(summary.sections.every(section => section.body.length <= 180));
  assert.ok(!summary.answer.includes(content.treatment));
  assert.equal(content.clinical, "Biểu hiện chính. Chi tiết thêm.");
});
