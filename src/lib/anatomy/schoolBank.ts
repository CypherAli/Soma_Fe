
import { contentFetch } from '@/lib/content/fetch';
import type { QuizItem } from "./quiz";
import { rng, shuffle } from "./random";
import { examBankErrors } from "./examBankRules.mjs";
import type { ExamBank } from "./examBank";

/**
 * NGÂN HÀNG ĐỀ TRƯỜNG Y — nguồn đề chung thứ tư, cạnh đề sinh từ mô hình,
 * đề giáo trình và hình atlas.
 *
 * Mỗi trường một file JSON trong `public/kb/schools/`, cùng schema với ngân
 * hàng giáo trình (`ExamBank`: câu có id, stem, A–E, đáp án, lời giải, trang
 * truy vết) nên cổng kiểm `examBankErrors` dùng lại được — đề trường không rõ
 * nguồn là không được vào thư viện mặc định.
 *
 * `index.json` là danh mục duy nhất giao diện đọc: thêm trường mới chỉ cần
 * thêm file + một dòng trong index, không đụng code. Index rỗng thì nguồn này
 * hiện trạng thái trống trung thực chứ không bịa nút lọc.
 *
 * Nạp bằng fetch như hai kho tĩnh kia: JSON đề trường có thể nặng, chỉ tải khi
 * người dùng chọn đúng trường đó.
 */
export type SchoolEntry = {
  /** id ổn định, dùng trong khoá ôn tập: "y-ha-noi", "y-duoc-hue"… */
  id: string;
  /** tên hiện trên chip lọc: "ĐH Y Hà Nội"… */
  name: string;
  /** file JSON trong public/kb/schools/ */
  file: string;
};

export type SchoolIndex = { schools: SchoolEntry[] };

let indexCache: SchoolIndex | null = null;
const bankCache = new Map<string, ExamBank>();

export async function loadSchoolIndex(): Promise<SchoolIndex> {
  if (indexCache) return indexCache;
  try {
    const res = await contentFetch("/kb/schools/index.json");
    if (!res.ok) return (indexCache = { schools: [] });
    const candidate = (await res.json()) as unknown;
    const list = (candidate as SchoolIndex)?.schools;
    if (!Array.isArray(list)) return (indexCache = { schools: [] });
    // Chỉ giữ mục đủ ba trường — mục hỏng không được làm sập cả nguồn.
    const schools = list.filter(
      (s): s is SchoolEntry =>
        !!s && typeof s.id === "string" && !!s.id && typeof s.name === "string" && !!s.name && typeof s.file === "string" && !!s.file,
    );
    return (indexCache = { schools });
  } catch {
    return (indexCache = { schools: [] });
  }
}

export async function loadSchoolBank(entry: SchoolEntry): Promise<ExamBank> {
  const hit = bankCache.get(entry.id);
  if (hit) return hit;
  const res = await contentFetch(`/kb/schools/${entry.file}`);
  if (!res.ok) throw new Error(`school bank ${entry.id} ${res.status}`);
  const candidate = (await res.json()) as unknown;
  const errors = examBankErrors(candidate);
  if (errors.length) {
    throw new Error(`Đề ${entry.name} không hợp lệ (${errors.length} lỗi): ${errors[0]}`);
  }
  const bank = candidate as ExamBank;
  bankCache.set(entry.id, bank);
  return bank;
}

export function schoolQuestionCount(bank: ExamBank | null): number | null {
  return bank ? bank.questions.length : null;
}

/**
 * Đổi câu đề trường sang QuizItem dùng chung giao diện làm bài.
 *
 * id ghép thêm id trường (`y-ha-noi:gt-001`) để hai trường có câu trùng id
 * vẫn là hai câu khác nhau trong lịch ôn (`school:y-ha-noi:gt-001`).
 */
export function schoolToQuizItems(
  entry: SchoolEntry,
  bank: ExamBank,
  opts: { count?: number; seed?: number; only?: string[] },
): QuizItem[] {
  const { count = 10 } = opts;
  const rand = rng(opts.seed ?? Date.now());
  const only = opts.only?.length ? new Set(opts.only) : null;
  const pool = only
    ? bank.questions.filter((q) => only.has(`school:${entry.id}:${q.id}`))
    : bank.questions;

  return shuffle(pool, rand)
    .slice(0, count)
    .map((q) => ({
      id: `${entry.id}:${q.id}`,
      kind: "identify" as const,
      prompt: q.stem,
      options: shuffle(
        Object.entries(q.options).map(([letter, text]) => ({
          id: `${entry.id}:${q.id}:${letter}`,
          text,
          correct: letter === q.answer,
        })),
        rand,
      ),
      explanation: q.explanation ?? "",
      sceneSlug: "",
      meshName: "",
      sceneTitle: `${entry.name} · ${q.region}`,
    }));
}
