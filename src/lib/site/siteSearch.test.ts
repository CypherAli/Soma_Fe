import assert from "node:assert/strict";
import { test } from "node:test";
import { searchHref, searchWeb } from "./siteSearch";
import { quizDestination } from "./quizDestination";
import { allSiteFacts, searchSiteFacts } from "./siteKnowledge";
import { quizInventory, webFeatureGuides, webQuizGuides } from "./webFeatures";
import { hasValidCitations, isSystemNavigationQuestion, isUnsupportedTask } from "./grounding";

test("public search finds tools and real quiz sets with usable destinations", () => {
  assert.equal(searchWeb("PDF")[0].id, "feature:documents");
  assert.equal(searchWeb("đề giải phẫu chi trên")[0].id, "quiz:giai-phau-chi-tren");
  assert(!searchWeb("đề giải phẫu chi trên").some(item => item.id === "quiz:giai-phau-chi-duoi"));
  assert(searchWeb("liver model", "en").some(item => item.kind === "model"));
  const match = searchWeb("đề giải phẫu chi trên")[0];
  const params = Object.fromEntries(new URL(match.href, "http://localhost").searchParams);
  assert.deepEqual(quizDestination(params), { tool: "bank", examId: "giai-phau-chi-tren" });
  assert.equal(quizDestination({ tool: "pdf" }).tool, "pdf");
  assert.deepEqual(quizDestination({ tool: ["pdf", "ai"], de: "not-a-set" }), { tool: "bank", examId: undefined });
});

test("model lookup accepts Vietnamese without accents and Latin terms", () => {
  assert(searchWeb("mo hinh gan o dau").some(item => item.id === "model:giai-phau-gan"));
  assert(searchWeb("hepar").some(item => item.kind === "model"));
  assert.deepEqual(searchWeb(""), []);
  assert.deepEqual(searchWeb("xyz987-no-real-source"), []);
  const all = searchWeb("mô hình");
  assert.equal(new Set(all.map(item => item.href)).size, all.length);
  assert.equal(new URL(searchHref("gan & PDF"), "http://localhost").searchParams.get("q"), "gan & PDF");
});

test("navigation search and assistant share current source-based feature knowledge", () => {
  const facts = allSiteFacts();
  for (const guide of webFeatureGuides) {
    const fact = facts.find(item => item.id === guide.id);
    assert(fact);
    assert.deepEqual(fact.body, guide.body);
    assert.equal(fact.href, guide.href);
  }
  const quiz = facts.find(item => item.id === "feature:quiz")!;
  assert(quiz.body.vi.includes(`${quizInventory.sets} bộ đề`));
  assert(quiz.body.vi.includes(`${quizInventory.questions} câu`));
  const gesture = facts.find(item => item.id === "feature:gesture")!;
  assert(gesture.body.vi.includes("Like tay trái"));
  assert(gesture.body.vi.includes("1×"));
  assert(!gesture.body.vi.includes("xoè bàn tay để xoay"));
  assert.equal(facts.filter(item => item.kind === "quiz").length, webQuizGuides.length);
});

test("specific quiz retrieval outranks generic sets and stays outside medical queries", () => {
  assert.equal(searchSiteFacts("đề Y Hà Nội giải phẫu chi trên có bao nhiêu câu", "vi")[0].fact.id, "quiz:giai-phau-chi-tren");
  assert.equal(searchSiteFacts("đề Y Hà Nội có bao nhiêu bộ đề", "vi")[0].fact.id, "feature:quiz");
  assert(!searchSiteFacts("thần kinh giữa chi phối gì", "vi").some(hit => hit.fact.kind === "quiz"));
  assert(!searchSiteFacts("tay trái bị đau", "vi").some(hit => hit.fact.id === "feature:gesture" && hit.score >= 2));
  assert(searchSiteFacts("怎么进入测验", "zh").some(hit => hit.fact.id === "feature:quiz"));
  assert(searchWeb("how do I switch model").some(item => item.id === "feature:gesture"));
});

test("long system questions exclude unrelated source sets and distinguish 1 from 10", () => {
  const question = "đề Y Hà Nội giải phẫu chi trên có bao nhiêu câu";
  assert.deepEqual(searchWeb(question).filter(hit => hit.kind === "quiz").map(hit => hit.id), ["quiz:giai-phau-chi-tren"]);
  assert.deepEqual(searchSiteFacts(question, "vi", 100).filter(hit => hit.fact.kind === "quiz").map(hit => hit.fact.id), ["quiz:giai-phau-chi-tren"]);
  for (const number of [1, 9]) {
    const q = `Đề Y Hà Nội: đề thi thử ${number} có bao nhiêu câu?`;
    const expected = `quiz:de-thi-thu-${number}`;
    assert.equal(searchSiteFacts(q, "vi")[0].fact.id, expected);
    assert.deepEqual(searchWeb(q).filter(hit => hit.kind === "quiz").map(hit => hit.id), [expected]);
  }
  for (const number of [10, 11]) {
    const q = `Đề Y Hà Nội: đề thi thử ${number} có bao nhiêu câu?`;
    assert.deepEqual(searchSiteFacts(q, "vi", 100).filter(hit => hit.fact.kind === "quiz"), []);
    assert.deepEqual(searchWeb(q).filter(hit => hit.kind === "quiz"), []);
  }
  const comparison = searchSiteFacts("so sánh đề thi thử 1 và đề thi thử 9", "vi", 100).filter(hit => hit.fact.kind === "quiz");
  assert.deepEqual(new Set(comparison.map(hit => hit.fact.id)), new Set(["quiz:de-thi-thu-1", "quiz:de-thi-thu-9"]));
});

test("answers require real numbered citations and site words do not allow code tasks", () => {
  assert(hasValidCitations("Mở Quiz [1], chọn tài liệu [2].", 2));
  assert(!hasValidCitations("Mở trang theo trí nhớ.", 2));
  assert(!hasValidCitations("Mở Quiz [1] và [99].", 2));
  assert(!hasValidCitations("[0]", 2));
  assert(!hasValidCitations("[1]", 0));
  assert(isUnsupportedTask("viết code cho trang quiz Soma"));
  assert(isUnsupportedTask("write code for a Soma search tool"));
  assert(!isUnsupportedTask("tra mã ICD trong thư viện Soma"));
  assert(isUnsupportedTask("write a poem about Soma quiz"));
  assert(isSystemNavigationQuestion("mô hình đầu ở đâu"));
  assert(isSystemNavigationQuestion("PDF của tôi trên Soma ở đâu"));
  assert(!isSystemNavigationQuestion("tay trái bị đau"));
  assert(!isSystemNavigationQuestion("đau tay trên mô hình phải điều trị thế nào"));
});
