/**
 * ĐIỀU KIỆN HỢP LỆ CỦA NGÂN HÀNG ĐỀ — một bản định nghĩa duy nhất.
 *
 * Dùng ở hai chỗ chạy khác nhau:
 *  - `examBank.ts` gọi lúc trình duyệt nạp JSON, để file hỏng thì báo lỗi rõ
 *    chứ không render ra câu thiếu phương án;
 *  - `scripts/verify-quiz-bank.mjs` gọi lúc kiểm trước khi commit, in hết lỗi.
 *
 * Viết bằng .mjs chứ không phải .ts vì script Node chạy thẳng, không qua bước
 * biên dịch. Tách đôi thì thêm luật một bên là bên kia lặng lẽ lạc hậu.
 *
 * @typedef {{ id: string, region: string, stem: string, options: Record<string, string>,
 *             answer: string, explanation: string | null,
 *             source?: { title: string, questionPage: number, answerPage: number } }} ExamQuestion
 * @typedef {{ schemaVersion?: number, source: { title: string, section: string, note: string,
 *             qualityPolicy?: string }, questions: ExamQuestion[] }} ExamBank
 */

/** Phương án bắt buộc của đề trắc nghiệm giáo trình. */
export const REQUIRED_LETTERS = "ABCDE";

/**
 * Liệt kê mọi lỗi của ngân hàng đề. Mảng rỗng nghĩa là hợp lệ.
 * @param {unknown} value
 * @returns {string[]}
 */
export function examBankErrors(value) {
  const bank = /** @type {ExamBank} */ (value);
  if (!bank?.source?.title) return ["Thiếu thông tin nguồn."];
  if (!Array.isArray(bank.questions) || bank.questions.length === 0) return ["Ngân hàng không có câu hỏi."];

  const errors = [];
  const ids = new Set();
  for (const [index, question] of bank.questions.entries()) {
    const label = question?.id || `vị trí ${index}`;
    const letters = Object.keys(question?.options ?? {}).sort().join("");
    if (!question?.id || ids.has(question.id)) errors.push(`${label}: ID thiếu hoặc trùng.`);
    if (!question?.region?.trim()) errors.push(`${label}: thiếu vùng giải phẫu.`);
    if (!question?.stem?.trim()) errors.push(`${label}: thiếu câu hỏi.`);
    if (letters !== REQUIRED_LETTERS) errors.push(`${label}: phải có đúng A–E.`);
    if (!question?.answer || !(question.answer in (question?.options ?? {}))) errors.push(`${label}: khóa đáp án không hợp lệ.`);
    if (!question?.explanation?.trim()) errors.push(`${label}: thiếu lời giải.`);
    if (!question?.source?.questionPage || !question?.source?.answerPage) errors.push(`${label}: thiếu trang truy vết nguồn.`);
    if (question?.id) ids.add(question.id);
  }
  return errors;
}

/**
 * Số câu theo từng vùng cơ thể, dùng cho cả báo cáo kiểm tra lẫn nút lọc.
 * @param {ExamBank} bank
 * @returns {Map<string, number>}
 */
export function countByRegion(bank) {
  const counts = new Map();
  for (const question of bank.questions) {
    if (question?.region) counts.set(question.region, (counts.get(question.region) ?? 0) + 1);
  }
  return counts;
}
