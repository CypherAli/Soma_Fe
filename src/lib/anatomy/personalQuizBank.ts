import type { PersonalDoc, PersonalQuestion } from "@/lib/personalDocs";
import type { DrLamBank, DrLamEntry } from "./drLamBank";

export const personalKeys = (q: Pick<PersonalQuestion, "answer" | "answers">) =>
  q.answers?.length ? q.answers : q.answer ? [q.answer] : [];

/** Adapt approved private questions to the same player as the source library. */
export function personalQuizBank(doc: PersonalDoc, rows: PersonalQuestion[]): DrLamBank {
  const id = `personal-${doc.id}`;
  return {
    schemaVersion: 1, id, title: doc.filename.replace(/\.(pdf|docx)$/i, ""),
    sourceFile: doc.filename, sourceNote: null, sourceHash: "", pages: doc.pages,
    questions: rows.filter(q => q.approved).map((q, index) => {
      const answers = personalKeys(q);
      return {
        id: `${id}-${index + 1}`, number: q.number ?? index + 1,
        stem: q.stem, ...(q.context ? { context: q.context } : {}),
        options: Object.entries(q.options).map(([key, text]) => ({ id: key, text })),
        answers, explanation: q.explanation ?? "",
        images: q.images ?? [], explanationImages: q.explanationImages ?? [],
        sourcePage: q.page ?? 1,
        gradable: answers.length > 0 && answers.every(key => !!q.options[key]),
      };
    }),
  };
}

export function personalQuizEntry(bank: DrLamBank): DrLamEntry {
  return {
    id: bank.id, title: bank.title, file: "", group: "", topic: "document",
    sourceHash: "", count: bank.questions.length,
    gradableCount: bank.questions.filter(q => q.gradable).length,
    imageCount: bank.questions.reduce((sum, q) => sum + q.images.length + q.explanationImages.length, 0),
    illustratedCount: bank.questions.filter(q => q.images.length || q.explanationImages.length).length,
    cover: null, sourceNote: null,
  };
}
