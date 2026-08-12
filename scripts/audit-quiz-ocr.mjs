/**
 * Soát chữ hỏng do OCR còn sót trong `public/kb/anatomy-mcq.json`.
 *
 *     npm run audit:quiz-ocr
 *
 * `verify-quiz-bank.mjs` chỉ gác CẤU TRÚC (đủ A–E, có khóa, có lời giải, có
 * trang nguồn). Nó không biết "xươns", "chuvển", "khóna" là chữ hỏng — câu vẫn
 * hiện ra cho người học đọc. Script này bắt đúng lớp lỗi đó.
 *
 * CÁCH BẮT: một âm tiết tiếng Việt luôn có dạng [phụ âm đầu][vần][phụ âm cuối],
 * trong đó phụ âm cuối chỉ có thể là p, t, c, ch, m, n, ng, nh. "xươns" kết
 * thúc bằng "ns" nên chắc chắn không phải tiếng Việt — đó là chữ 'g' bị OCR đọc
 * thành 's'. Bỏ dấu rồi đối chiếu khuôn này bắt được gần hết rác máy đọc.
 *
 * KHÔNG bắt được lỗi "đúng chính tả nhưng sai từ" (OCR đọc "phối" thành "phói",
 * "vị" thành "vỵ") — loại đó phải người đọc đối chiếu trang sách. Vì vậy báo
 * cáo in kèm số trang câu hỏi và trang đáp án của từng câu.
 *
 * Thoát mã 0: script này để soi, không phải cổng chặn — chặn ở đây thì mọi lệnh
 * build đều đỏ trong khi việc hiệu đính là việc của người, làm dần.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const bank = JSON.parse(await readFile(path.resolve("public/kb/anatomy-mcq.json"), "utf8"));

/** Khuôn âm tiết tiếng Việt sau khi bỏ dấu. */
const SYLLABLE = /^(ngh|ng|nh|gh|gi|qu|ch|kh|ph|th|tr|[bcdghklmnprstvx])?[aeiouy]+(ng|nh|ch|[ptcmn])?$/;

/** Từ mượn/viết tắt có thật trong ngân hàng, không phải rác OCR. */
const ALLOW = new Set([
  "tk", "dm", "tm", "l", "s", "c", "t", "d",
  "noradrenaline", "elip", "synap", "delta", "sigma",
  // Tên riêng trong giải phẫu — không phải chữ hỏng.
  "erb", "duchenne", "vater", "scarpa", "mc", "burney", "bell",
]);

/** Số La Mã: sách dùng cho dây TK sọ (TK V, TK VII…). */
const ROMAN = /^(?=[ivxl])(x{0,3})(ix|iv|v?i{0,3})$/;

/** Bỏ dấu về chữ cái trần. Hạ chữ thường TRƯỚC rồi mới đổi đ→d, không thì "Đi"
 *  thành "Đi" và bị chấm nhầm là chữ hỏng. */
const bare = (word) =>
  word.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

const broken = (text) =>
  [...new Set((text || "").split(/[^\p{L}]+/u).filter(Boolean))]
    .filter((word) => {
      const plain = bare(word);
      return plain.length > 1 && !ALLOW.has(plain) && !ROMAN.test(plain) && !SYLLABLE.test(plain);
    });

const rows = [];
for (const question of bank.questions) {
  const fields = {
    "câu hỏi": question.stem,
    ...Object.fromEntries(Object.entries(question.options).map(([k, v]) => [`phương án ${k}`, v])),
    "lời giải": question.explanation ?? "",
  };
  const hits = Object.entries(fields).flatMap(([field, text]) =>
    broken(text).map((word) => ({ field, word })));
  if (hits.length) rows.push({ question, hits });
}

const total = bank.questions.length;
console.log(`Ngân hàng: ${total} câu. Câu còn chữ hỏng OCR: ${rows.length} (${Math.round((rows.length / total) * 100)}%).`);
console.log("Số trang dưới đây là trang trong bản PDF giáo trình, dùng để đối chiếu khi hiệu đính.\n");

for (const { question, hits } of rows) {
  const page = question.source ? `tr.${question.source.questionPage}/đáp án tr.${question.source.answerPage}` : "không rõ trang";
  console.log(`${question.id}  [${question.region}]  ${page}`);
  for (const { field, word } of hits) console.log(`    ${field}: "${word}"`);
}

if (rows.length) {
  console.log(`\nCách sửa: thêm cặp sai→đúng vào FIXES trong scripts/kb/curate_anatomy_bank.py`);
  console.log(`rồi chạy lại pipeline, ĐỪNG sửa tay vào public/kb/anatomy-mcq.json (chạy lại là mất).`);
}
