import {
  drLamCatalog,
  drLamCorrect,
  type DrLamBank,
  type DrLamQuestion,
} from "./drLamBank";

export type DrLamSession = {
  examId: string;
  order: string[];
  picks: Record<string, string[]>;
  checked: string[];
  index: number;
  mode: "practice" | "exam";
  startedAt: number;
  finishedAt: number | null;
};
export type DrLamSaved = {
  sessions: Record<string, DrLamSession>;
  mistakes: Record<string, string[]>;
};
export const DR_LAM_STORAGE_KEY = "soma.dr-lam.quiz.v1";
const catalogIds = new Set(drLamCatalog.exams.map((entry) => entry.id));
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");
const unique = (values: string[]) => new Set(values).size === values.length;
const belongs = (examId: string, id: string) =>
  id.startsWith(`${examId}-`) && /^[1-9]\d*$/.test(id.slice(examId.length + 1));

export function validDrLamSession(value: unknown): value is DrLamSession {
  if (!record(value)) return false;
  const s = value;
  if (typeof s.examId !== "string" || !catalogIds.has(s.examId)) return false;
  if (
    !strings(s.order) ||
    !s.order.length ||
    !unique(s.order) ||
    !s.order.every((id) => belongs(s.examId as string, id))
  )
    return false;
  if (
    !record(s.picks) ||
    !Object.entries(s.picks).every(
      ([id, answers]) =>
        s.order instanceof Array &&
        s.order.includes(id) &&
        strings(answers) &&
        unique(answers) &&
        answers.every((a) => /^[A-F]$/.test(a)),
    )
  )
    return false;
  if (
    !strings(s.checked) ||
    !unique(s.checked) ||
    !s.checked.every((id) => (s.order as string[]).includes(id))
  )
    return false;
  return (
    Number.isInteger(s.index) &&
    (s.index as number) >= 0 &&
    (s.index as number) < s.order.length &&
    (s.mode === "practice" || s.mode === "exam") &&
    typeof s.startedAt === "number" &&
    Number.isFinite(s.startedAt) &&
    s.startedAt > 0 &&
    (s.finishedAt === null ||
      (typeof s.finishedAt === "number" &&
        Number.isFinite(s.finishedAt) &&
        s.finishedAt >= s.startedAt))
  );
}

/** Ignore invalid stored entries independently, preserving the other valid attempts. */
export function parseDrLamSaved(raw: string | null): DrLamSaved {
  const empty: DrLamSaved = { sessions: {}, mistakes: {} };
  try {
    const data: unknown = JSON.parse(raw ?? "{}");
    if (!record(data)) return empty;
    const sessions = record(data.sessions)
      ? (Object.fromEntries(
          Object.entries(data.sessions).filter(
            ([id, s]) => validDrLamSession(s) && s.examId === id,
          ),
        ) as Record<string, DrLamSession>)
      : {};
    const mistakes = record(data.mistakes)
      ? Object.fromEntries(
          Object.entries(data.mistakes)
            .filter(([id, ids]) => catalogIds.has(id) && strings(ids))
            .map(([id, ids]) => [
              id,
              [...new Set((ids as string[]).filter((q) => belongs(id, q)))],
            ]),
        )
      : {};
    return { sessions, mistakes };
  } catch {
    return empty;
  }
}

export function resumableDrLamSession(
  bank: DrLamBank | null,
  session: DrLamSession | undefined,
): DrLamSession | null {
  if (
    !bank ||
    !session ||
    session.examId !== bank.id ||
    !validDrLamSession(session)
  )
    return null;
  const questions = new Map(bank.questions.map((q) => [q.id, q]));
  if (!session.order.every((id) => questions.has(id))) return null;
  if (
    !Object.entries(session.picks).every(([id, answers]) =>
      answers.every((a) => questions.get(id)?.options.some((o) => o.id === a)),
    )
  )
    return null;
  return session;
}

export function drLamElapsed(session: DrLamSession, now = Date.now()): number {
  return Math.max(
    0,
    Math.floor(((session.finishedAt ?? now) - session.startedAt) / 1000),
  );
}

export function completeDrLamAttempt(
  saved: DrLamSaved,
  session: DrLamSession,
  questions: DrLamQuestion[],
  now = Date.now(),
): DrLamSaved {
  if (session.finishedAt !== null) return saved;
  const mistakes = new Set(saved.mistakes[session.examId] ?? []);
  for (const q of questions) {
    if (!q.gradable) continue;
    if (drLamCorrect(q, session.picks[q.id])) mistakes.delete(q.id);
    else mistakes.add(q.id);
  }
  return {
    sessions: {
      ...saved.sessions,
      [session.examId]: { ...session, finishedAt: now },
    },
    mistakes: { ...saved.mistakes, [session.examId]: [...mistakes] },
  };
}
