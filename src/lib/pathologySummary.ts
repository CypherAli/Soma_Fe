import type { Loc } from "./homeContent";
import { pathologyContent, pathologyName, type Pathology } from "./pathologies";

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/đ/g, "d");
}

export function isSummaryRequest(question: string): boolean {
  const text = fold(question);
  return /\b(tom\s*(tat|luoc|gon)|rut\s*gon|y\s+chinh|noi\s+dung\s+chinh|khai\s+quat|ngan\s+gon|summar(?:y|ies|i[sz](?:e|es|ed|ing|ation))|sum\s+(?:(?:it|this|the\s+article)\s+)?up|recap|overview|synopsis|abstract|rundown|abridg(?:e|ed|ement)|condense|short\s+version|in\s+brief|tldr|tl\s*;\s*dr|(?:brief|short)\s+(?:summary|overview)|(?:main|key)\s+points|in\s+a\s+nutshell)\b|摘要|总结|總結|概括|概要/.test(text);
}

/** Resolve a named article from records already loaded by the library. */
export function summaryRecordForQuestion(records: Pathology[], question: string): Pathology | undefined {
  const text = fold(question);
  const matches = records.filter(record => [record.nameVi, record.nameEn, record.nameZh]
    .some(name => name && text.includes(fold(name))));
  return matches.length === 1 ? matches[0] : undefined;
}

const headings = {
  vi: ["Tổng quan", "Lâm sàng và chẩn đoán", "Chẩn đoán hình ảnh", "Tiến triển và biến chứng", "Điều trị tham khảo"],
  en: ["Overview", "Clinical findings and diagnosis", "Diagnostic imaging", "Progression and complications", "Treatment reference"],
  zh: ["概述", "临床与诊断", "医学影像", "进展与并发症", "参考治疗"],
};

/** Short source excerpts only; no generated claims, treatment instructions or API calls. */
export function preparedPathologySummary(record: Pathology, locale: Loc) {
  const content = pathologyContent(record, locale);
  const sections = (["description", "clinical", "imaging", "progression"] as const)
    .flatMap((field, index) => content?.[field]?.trim()
      ? [{ heading: headings[content.locale === "vi" ? "vi" : locale][index], body: shortExcerpt(content[field]!, content.locale) }]
      : []).slice(0, 3);
  const missing = locale === "en" ? "No prepared summary is available for this article yet. Please consult the cited source."
    : locale === "zh" ? "本篇尚无预先编写的摘要，请查阅所引来源。"
    : "Bài này chưa có bản tóm tắt biên soạn sẵn. Bạn có thể đọc giáo trình ở phần nguồn.";
  const languageNote = content?.locale === "vi" && locale !== "vi"
    ? locale === "en" ? "Showing the prepared Vietnamese summary; an English version is not available yet."
      : "暂无本篇译文，以下显示已编写的越南语摘要。" : "";
  return {
    sections,
    answer: sections.length ? [pathologyName(record, locale), languageNote,
      ...sections.map(section => `${section.heading}\n${section.body}`)].filter(Boolean).join("\n\n") : missing,
    sources: record.source ? [{ slug: record.slug, book: record.source, page: record.sourcePage ?? 0, excerpt: "" }] : [],
    engine: "prepared-summary" as const,
  };
}

function shortExcerpt(value: string, locale: string): string {
  const plain = value.replace(/\*{1,2}|#{1,6}\s*/g, "").replace(/\s+/g, " ").trim();
  const sentences = new Intl.Segmenter(locale, { granularity: "sentence" }).segment(plain);
  const first = [...sentences][0]?.segment.trim() ?? plain;
  if (first.length <= 180) return first;
  const boundary = first.lastIndexOf(" ", 177);
  return first.slice(0, boundary >= 110 ? boundary : 177).trimEnd() + "…";
}
