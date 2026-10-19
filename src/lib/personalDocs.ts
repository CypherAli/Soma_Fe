import { authRequest, getToken } from "@/lib/auth";
import type { QuizItem } from "@/lib/anatomy/quiz";
import { rng, shuffle } from "@/lib/anatomy/random";

/**
 * BỘ ĐỀ RIÊNG dựng từ tài liệu người dùng tải lên.
 *
 * Khác hai ngân hàng kia (`examBank`, `atlasBank`) ở chỗ nó KHÔNG phải tệp tĩnh
 * trong `public/` mà là dữ liệu của một tài khoản, nên bắt buộc phải đăng nhập
 * và mọi lời gọi đều kèm token.
 */

export type PersonalDoc = {
  id: string;
  filename: string;
  bytes: number;
  pages: number;
  status: "processing" | "ready" | "failed";
  note: string | null;
  createdAt: string;
  questionCount: number;
  approvedCount: number;
};

export type PersonalQuestion = {
  id: string;
  stem: string;
  options: Record<string, string>;
  answer: string;
  explanation: string | null;
  page: number | null;
  approved: boolean;
  /** "parser" = bộ luật bóc ra, "ai" = mô hình đọc hộ khi bộ luật bó tay */
  origin?: string;
};

export type UploadResult = {
  doc: Omit<PersonalDoc, "questionCount" | "approvedCount">;
  parsed: number;
  missingAnswer: number;
  malformed: number;
  /**
   * Văn bản tài liệu, CHỈ có khi bộ luật không bóc được câu nào.
   *
   * Máy chủ không giữ tệp gốc, nên đây là cơ hội duy nhất để nhờ AI đọc lại mà
   * không bắt người dùng tải lên lần nữa.
   */
  text?: string | null;
};

/**
 * Nhờ AI đọc bộ đề trong văn bản tài liệu, rồi cất vào đúng tài liệu đó.
 *
 * Hai chặng, cố ý: route của Next giữ khoá AI, còn máy chủ Nest giữ dữ liệu.
 * Văn bản chỉ rời máy người dùng khi chính họ bấm nút.
 */
export async function askAiForQuestions(
  docId: string,
  text: string,
): Promise<{ parsed: number; note: string | null }> {
  const read = await fetch("/api/pdf-mcq", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ text }),
  });
  const { questions } = await json<{ questions: unknown[] }>(read);

  const result = await personalRequest<{
    parsed: number;
    doc: { note: string | null };
  }>(`/${docId}/ai-questions`, {
    method: "POST",
    body: JSON.stringify({ questions }),
  });
  return { parsed: result.parsed, note: result.doc.note };
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) throw new Error("Cần đăng nhập");
  return { Authorization: `Bearer ${token}` };
}

async function json<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const raw: unknown = data?.message ?? data?.error;
    const message: unknown = Array.isArray(raw)
      ? raw.find((value) => typeof value === "string")
      : raw;
    throw new Error(
      typeof message === "string" && message
        ? message
        : `Máy chủ trả về lỗi ${res.status}`,
    );
  }
  return data as T;
}

function personalRequest<T>(path = "", init: RequestInit = {}): Promise<T> {
  if (!getToken()) return Promise.reject(new Error("Cần đăng nhập"));
  return authRequest<T>(`/personal-docs${path}`, init);
}

export async function uploadPdf(file: File): Promise<UploadResult> {
  const body = new FormData();
  body.append("file", file);
  // KHÔNG đặt content-type bằng tay: trình duyệt phải tự thêm ranh giới
  // multipart, gán tay là máy chủ không tách được tệp.
  return personalRequest("", { method: "POST", body });
}

export async function listDocs(): Promise<{ docs: PersonalDoc[] }> {
  return personalRequest();
}

export async function docQuestions(
  docId: string,
): Promise<{ doc: PersonalDoc; questions: PersonalQuestion[] }> {
  return personalRequest(`/${docId}/questions`);
}

export async function approveAll(
  docId: string,
): Promise<{ approved: number; skipped: number }> {
  return personalRequest(`/${docId}/approve-all`, { method: "POST" });
}

export async function editQuestion(
  id: string,
  patch: Partial<
    Pick<
      PersonalQuestion,
      "stem" | "options" | "answer" | "explanation" | "approved"
    >
  >,
): Promise<PersonalQuestion> {
  return personalRequest(`/questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteQuestion(id: string): Promise<void> {
  await personalRequest(`/questions/${id}`, { method: "DELETE" });
}

export async function deleteDoc(id: string): Promise<void> {
  await personalRequest(`/${id}`, { method: "DELETE" });
}

export type PersonalBank = {
  questions: {
    id: string;
    stem: string;
    options: Record<string, string>;
    answer: string;
    explanation: string | null;
    page: number | null;
    /** tên tệp gốc — dùng làm nhãn "vùng" để người học biết câu này từ đâu */
    region: string;
  }[];
};

export async function loadPersonalBank(): Promise<PersonalBank> {
  return personalRequest("/bank");
}

export function personalQuestionCount(bank: PersonalBank): number {
  return bank.questions.length;
}

/**
 * Đổi sang `QuizItem` để dùng chung giao diện làm bài với ba nguồn kia.
 *
 * Giống `examToQuizItems`: không gắn với mesh 3D nào nên `sceneSlug` rỗng, giao
 * diện tự ẩn nút "xem trên mô hình".
 */
export function personalToQuizItems(
  bank: PersonalBank,
  opts: { count?: number; seed?: number; only?: string[] },
): QuizItem[] {
  const { count = 10 } = opts;
  const rand = rng(opts.seed ?? Date.now());
  const only = opts.only?.length ? new Set(opts.only) : null;
  const pool = only
    ? bank.questions.filter((q) => only.has(`personal:${q.id}`))
    : bank.questions;

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
      sceneTitle: q.page ? `${q.region} — tr.${q.page}` : q.region,
    }));
}
