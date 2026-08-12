import type { QuizItem } from "./quiz";

/**
 * NGÂN HÀNG ĐỀ TỪ GIÁO TRÌNH — nguồn câu hỏi thứ hai, song song với đề sinh
 * từ thư viện 3D (`quiz.ts`).
 *
 * Ngân hàng được bóc từ "Phần III: Bộ câu hỏi trắc nghiệm" của giáo trình
 * Giải Phẫu Người (ĐH Y Hà Nội), sau đó đi qua cổng kiểm tra cấu trúc, đáp án,
 * phương án, lời giải và dấu vết trang nguồn.
 *
 * Nạp bằng fetch chứ KHÔNG import thẳng: 135KB JSON mà import tĩnh là nằm luôn
 * trong bundle của mọi trang, trong khi chỉ trang quiz mới cần.
 */
export type ExamQuestion = {
  id: string;
  /** vùng cơ thể theo cách chia của giáo trình: CHI TRÊN, BỤNG, ĐẦU CỔ… */
  region: string;
  stem: string;
  options: Record<string, string>;
  answer: string;
  explanation: string | null;
  source?: { title: string; questionPage: number; answerPage: number };
};

export type ExamBank = {
  schemaVersion?: number;
  source: { title: string; section: string; note: string; qualityPolicy?: string };
  questions: ExamQuestion[];
};

let cache: ExamBank | null = null;

export async function loadExamBank(): Promise<ExamBank> {
  if (cache) return cache;
  const res = await fetch("/kb/anatomy-mcq.json");
  if (!res.ok) throw new Error(`exam bank ${res.status}`);
  const candidate = (await res.json()) as ExamBank;
  assertExamBank(candidate);
  cache = candidate;
  return cache;
}

function assertExamBank(bank: ExamBank): asserts bank is ExamBank {
  if (!bank?.source?.title || !Array.isArray(bank.questions) || bank.questions.length === 0) {
    throw new Error("Ngân hàng đề không đúng định dạng hoặc đang rỗng");
  }
  const ids = new Set<string>();
  for (const question of bank.questions) {
    const letters = Object.keys(question.options ?? {}).sort().join("");
    if (!question.id || ids.has(question.id)) throw new Error(`ID câu hỏi bị thiếu hoặc trùng: ${question.id}`);
    if (!question.stem.trim() || !question.explanation?.trim()) throw new Error(`Câu ${question.id} thiếu nội dung hoặc lời giải`);
    if (letters !== "ABCDE") throw new Error(`Câu ${question.id} phải có đúng năm phương án A–E`);
    if (!(question.answer in question.options)) throw new Error(`Câu ${question.id} có khóa đáp án không hợp lệ`);
    ids.add(question.id);
  }
}

/** Danh sách vùng cơ thể có thật trong ngân hàng, kèm số câu — không bịa nút lọc. */
export function examRegions(bank: ExamBank): { key: string; count: number }[] {
  const m = new Map<string, number>();
  for (const q of bank.questions) m.set(q.region, (m.get(q.region) ?? 0) + 1);
  return [...m.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function examQuestionCount(bank: ExamBank, region = "all"): number {
  return region === "all"
    ? bank.questions.length
    : bank.questions.filter((question) => question.region === region).length;
}

function shuffle<T>(a: T[], rand: () => number): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/**
 * Đổi câu trong ngân hàng sang đúng kiểu QuizItem để dùng chung một giao diện
 * làm bài với đề sinh từ mô hình. Câu giáo trình KHÔNG gắn với mesh 3D nào nên
 * sceneSlug rỗng — giao diện tự ẩn nút "xem trên mô hình".
 */
export function examToQuizItems(
  bank: ExamBank,
  opts: { region?: string; count?: number; seed?: number },
): QuizItem[] {
  const { region = "all", count = 10 } = opts;
  const rand = rng(opts.seed ?? Date.now());
  const pool = bank.questions.filter((q) => region === "all" || q.region === region);

  return shuffle(pool, rand)
    .slice(0, count)
    .map((q) => ({
      id: q.id,
      kind: "identify" as const,
      prompt: q.stem,
      options: shuffle(
        Object.entries(q.options).map(([letter, text]) => ({
          id: `${q.id}:${letter}`,
          text,
          correct: letter === q.answer,
        })),
        rand,
      ),
      explanation: q.explanation ?? "",
      sceneSlug: "",
      meshName: "",
      sceneTitle: q.region,
    }));
}
