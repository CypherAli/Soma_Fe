
import { bindContentSource } from "@/lib/content/source";

import { contentFetch } from '@/lib/content/fetch';
import catalog from "../../../public/kb/dr-lam/index.json" with { type: "json" };

export type DrLamQuestion = {
  id: string;
  number: number;
  stem: string;
  context?: string;
  options: { id: string; text: string }[];
  answers: string[];
  explanation: string;
  images: string[];
  explanationImages: string[];
  sourcePage: number;
  gradable: boolean;
};

export type DrLamBank = {
  schemaVersion: number;
  id: string;
  title: string;
  sourceFile: string;
  sourceNote: string | null;
  sourceHash: string;
  pages: number;
  questions: DrLamQuestion[];
};

export const drLamCatalog = bindContentSource("data:src/lib/anatomy/drLamBank.ts#drLamCatalog", catalog);
export type DrLamEntry = (typeof catalog.exams)[number];
const cache = new Map<string, DrLamBank>();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const isText = (value: unknown): value is string =>
  typeof value === "string" && !!value.trim();
const isStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");

/** Check untrusted network data without throwing on absent arrays or null items. */
export function drLamBankErrors(bank: unknown): string[] {
  const errors: string[] = [];
  if (
    !isRecord(bank) ||
    bank.schemaVersion !== 1 ||
    !Array.isArray(bank.questions)
  )
    return ["Invalid bank schema"];
  if (
    !isText(bank.id) ||
    !isText(bank.title) ||
    !isText(bank.sourceFile) ||
    typeof bank.sourceHash !== "string" ||
    !/^[a-f0-9]{64}$/.test(bank.sourceHash) ||
    !Number.isInteger(bank.pages) ||
    (bank.pages as number) < 1
  )
    errors.push("Invalid source metadata");
  const seen = new Set<string>();
  bank.questions.forEach((q, i) => {
    if (!isRecord(q)) {
      errors.push(`Invalid question ${i + 1}`);
      return;
    }
    if (!isText(q.id)) {
      errors.push(`Missing id: ${i + 1}`);
      return;
    }
    if (seen.has(q.id)) errors.push(`Duplicate id: ${q.id}`);
    seen.add(q.id);
    if (q.context !== undefined && !isText(q.context))
      errors.push(`Invalid context: ${q.id}`);
    if (
      q.number !== i + 1 ||
      !isText(q.stem) ||
      typeof q.explanation !== "string"
    )
      errors.push(`Invalid question ${i + 1}`);
    if (
      !Number.isInteger(q.sourcePage) ||
      (q.sourcePage as number) < 1 ||
      (q.sourcePage as number) > (bank.pages as number)
    )
      errors.push(`Invalid source page: ${q.id}`);
    const options = Array.isArray(q.options) ? q.options : [];
    const optionsValid =
      options.length >= 2 &&
      options.every(
        (o, j) =>
          isRecord(o) && o.id === String.fromCharCode(65 + j) && isText(o.text),
      );
    if (!optionsValid) errors.push(`Invalid options: ${q.id}`);
    const answers = isStrings(q.answers) ? q.answers : null;
    if (
      !answers ||
      new Set(answers).size !== answers.length ||
      answers.some((a) => !options.some((o) => isRecord(o) && o.id === a))
    )
      errors.push(`Invalid answers: ${q.id}`);
    if (q.gradable !== (!!answers?.length && optionsValid))
      errors.push(`Invalid grading flag: ${q.id}`);
    for (const key of ["images", "explanationImages"]) {
      const urls = q[key];
      if (
        !isStrings(urls) ||
        new Set(urls).size !== urls.length ||
        urls.some(
          (url) => !/^(?:\/kb\/dr-lam\/images\/[a-f0-9]{20}\.webp|(?:https?:\/\/[^/]+)?\/api\/content\/assets\/[a-f0-9-]+)$/.test(url),
        )
      )
        errors.push(`Invalid ${key}: ${q.id}`);
    }
  });
  return errors;
}

export async function loadDrLamBank(entry: DrLamEntry): Promise<DrLamBank> {
  const existing = cache.get(entry.id);
  if (existing) return existing;
  const response = await contentFetch(`/kb/dr-lam/${entry.file}`);
  if (!response.ok) throw new Error(`Không tải được đề (${response.status}).`);
  const raw: unknown = await response.json();
  const errors = drLamBankErrors(raw);
  if (errors.length)
    throw new Error("Dữ liệu đề chưa đầy đủ. Vui lòng thử lại.");
  const bank = raw as DrLamBank;
  if (
    errors.length ||
    bank.id !== entry.id ||
    bank.questions.length !== entry.count
  )
    throw new Error("Dữ liệu đề chưa đầy đủ. Vui lòng thử lại.");
  cache.set(entry.id, bank);
  return bank;
}

/** Exact set comparison: a multi-answer item requires all and only its keys. */
export function drLamCorrect(
  question: DrLamQuestion,
  selection: string[] | undefined,
): boolean {
  return (
    question.gradable &&
    !!selection &&
    selection.length === question.answers.length &&
    question.answers.every((a) => selection.includes(a))
  );
}

export function drLamScore(
  questions: DrLamQuestion[],
  picks: Record<string, string[]>,
) {
  const gradable = questions.filter((q) => q.gradable);
  const correct = gradable.filter((q) => drLamCorrect(q, picks[q.id])).length;
  const skipped = gradable.filter((q) => !picks[q.id]?.length).length;
  return {
    correct,
    skipped,
    wrong: gradable.length - correct - skipped,
    total: gradable.length,
    ungraded: questions.length - gradable.length,
  };
}
