import type { QuizItem } from "./quiz";
import { rng, shuffle } from "./random";
import { countByRegion, examBankErrors } from "./examBankRules.mjs";

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
  const candidate = (await res.json()) as unknown;
  // Kiểm ngay lúc nạp: JSON hỏng thì báo một lỗi đọc được, còn hơn để giao diện
  // render ra câu thiếu phương án rồi người học tưởng đề ra thế thật.
  const errors = examBankErrors(candidate);
  if (errors.length) {
    throw new Error(`Ngân hàng đề không hợp lệ (${errors.length} lỗi): ${errors[0]}`);
  }
  cache = candidate as ExamBank;
  return cache;
}

/** Danh sách vùng cơ thể có thật trong ngân hàng, kèm số câu — không bịa nút lọc. */
export function examRegions(bank: ExamBank): { key: string; count: number }[] {
  return [...countByRegion(bank).entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

/** Số câu khả dụng của một vùng — dùng để chặn chọn quá số câu ngân hàng có. */
export function examQuestionCount(bank: ExamBank, region = "all"): number {
  return region === "all" ? bank.questions.length : (countByRegion(bank).get(region) ?? 0);
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
