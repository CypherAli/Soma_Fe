import type { QuizItem } from "./quiz";

/**
 * NGÂN HÀNG ĐỀ TỪ GIÁO TRÌNH — nguồn câu hỏi thứ hai, song song với đề sinh
 * từ thư viện 3D (`quiz.ts`).
 *
 * 215 câu bóc từ "Phần III: Bộ câu hỏi trắc nghiệm" của giáo trình Giải Phẫu
 * Người (ĐH Y Hà Nội) bằng `scripts/kb/parse_anatomy_mcq.py`, mỗi câu đã kèm
 * sẵn đáp án và lời giải của chính sách.
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
};

export type ExamBank = {
  source: { title: string; section: string; note: string };
  questions: ExamQuestion[];
};

let cache: ExamBank | null = null;

export async function loadExamBank(): Promise<ExamBank> {
  if (cache) return cache;
  const res = await fetch("/kb/anatomy-mcq.json");
  if (!res.ok) throw new Error(`exam bank ${res.status}`);
  cache = (await res.json()) as ExamBank;
  return cache;
}

/** Danh sách vùng cơ thể có thật trong ngân hàng, kèm số câu — không bịa nút lọc. */
export function examRegions(bank: ExamBank): { key: string; count: number }[] {
  const m = new Map<string, number>();
  for (const q of bank.questions) m.set(q.region, (m.get(q.region) ?? 0) + 1);
  return [...m.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
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
