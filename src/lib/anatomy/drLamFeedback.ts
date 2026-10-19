import type { DrLamQuestion } from "./drLamBank";

/** Keep answer text and answer illustrations behind the same feedback gate. */
export function drLamQuestionFeedback(
  question: DrLamQuestion | undefined,
  mode: "practice" | "exam" | undefined,
  checked: boolean,
  finished: boolean,
) {
  const reveal = finished || (mode === "practice" && checked);
  const images = question
    ? [
        ...new Set([
          ...question.images,
          ...(reveal ? question.explanationImages : []),
        ]),
      ]
    : [];
  return { reveal, images };
}
