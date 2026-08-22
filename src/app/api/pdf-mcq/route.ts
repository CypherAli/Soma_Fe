import { NextResponse } from "next/server";
import { complete, isConfigured } from "@/lib/llm";
import { userFromRequest } from "@/lib/apiAuth";

export const runtime = "nodejs";

/**
 * AI ĐỌC HỘ BỘ ĐỀ TRONG PDF khi bộ luật ở máy chủ bó tay.
 *
 * Bộ luật (`soma_be/src/personal-docs/mcq-parser.ts`) chỉ nhận ra tài liệu
 * đúng khuôn: câu đánh số, phương án A–E, một vùng đáp án. Giáo trình đánh số
 * kiểu khác, đề trong bảng, hay bản scan lệch dòng thì nó trả về 0 câu — mà
 * người tải lên không có cách nào cứu ngoài việc gõ lại bằng tay.
 *
 * Ở đây mô hình chỉ ĐỌC LẠI đúng những gì có trong tài liệu, không được nghĩ
 * thêm câu mới: tài liệu là của người học, đề bịa ra rồi trộn vào đó là làm
 * hỏng chính thứ họ mang tới. Câu đọc được vẫn phải qua màn duyệt.
 *
 * Route này chỉ chạy khi người dùng BẤM NÚT — văn bản tài liệu đi ra dịch vụ
 * AI bên ngoài, nên không được làm lặng lẽ thay họ.
 */

/** Cắt nhỏ để một lời gọi không vượt cửa sổ ngữ cảnh, có phần chồng lấn nhẹ. */
const CHUNK_CHARS = 14_000;
const OVERLAP_CHARS = 600;
/** Trần số lời gọi cho một tài liệu — chặn PDF 400 trang đốt sạch hạn mức. */
const MAX_CHUNKS = 6;

const SYSTEM_PROMPT = [
  "You extract multiple-choice questions that already exist in the given document text.",
  'Return JSON only: {"questions":[{"stem","options":{"A","B","C","D"},"answer","explanation","page"}]}.',
  "Rules:",
  "- Copy the wording of the document; translate nothing and invent nothing.",
  "- Never write a question, an option, or an answer that is not in the text.",
  "- answer must be the letter key of the correct option, taken from the document's answer key.",
  "- If the correct answer is not stated anywhere in the text, omit that question entirely.",
  '- page is the number in the nearest "[trang N]" marker.',
  '- If the text contains no multiple-choice questions at all, return {"questions":[]}.',
].join("\n");

export async function POST(request: Request) {
  if (!(await userFromRequest(request))) {
    return NextResponse.json({ error: "Cần đăng nhập" }, { status: 401 });
  }
  if (!isConfigured()) {
    return NextResponse.json({ error: "Chưa cấu hình AI" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const text = String(body.text ?? "");
  if (text.trim().length < 40) {
    return NextResponse.json({ questions: [], chunks: 0 });
  }

  const chunks = splitText(text);
  const questions: unknown[] = [];
  let failed = 0;

  for (const chunk of chunks) {
    try {
      const raw = await complete({
        system: SYSTEM_PROMPT,
        user: chunk,
        maxTokens: 4000,
      });
      const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
      const list = Array.isArray(parsed) ? parsed : parsed?.questions;
      if (Array.isArray(list)) questions.push(...list);
    } catch {
      // Một mẩu hỏng không được kéo theo cả tài liệu: mẩu khác vẫn có thể ra
      // câu dùng được, và số mẩu hỏng sẽ báo lại cho người dùng biết.
      failed += 1;
    }
  }

  // Các mẩu chồng lấn nhau nên câu ở mép hay ra hai lần — bỏ trùng theo phần
  // dẫn, không thì màn duyệt bắt người dùng đọc lại cùng một câu.
  return NextResponse.json({ questions: dedupe(questions), chunks: chunks.length, failed });
}

function dedupe(questions: unknown[]): unknown[] {
  const seen = new Set<string>();
  const out: unknown[] = [];
  for (const q of questions) {
    const stem = String((q as { stem?: unknown })?.stem ?? "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
    if (!stem || seen.has(stem)) continue;
    seen.add(stem);
    out.push(q);
  }
  return out;
}

function splitText(text: string): string[] {
  const chunks: string[] = [];
  for (let at = 0; at < text.length && chunks.length < MAX_CHUNKS; ) {
    chunks.push(text.slice(at, at + CHUNK_CHARS));
    at += CHUNK_CHARS - OVERLAP_CHARS;
  }
  return chunks;
}
