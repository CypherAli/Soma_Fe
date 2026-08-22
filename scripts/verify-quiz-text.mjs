/**
 * Kiểm ba cột chữ của trang quiz có cân nhau không.
 *
 *     node scripts/verify-quiz-text.mjs
 *
 * `quizText.ts` là bảng ba thứ tiếng vi/en/zh. Thêm khoá mà quên một cột thì
 * TypeScript KHÔNG báo — nó chỉ suy ra kiểu từ hợp của ba đối tượng, và người
 * đọc cột thiếu sẽ nhận `undefined` in ra màn hình. Lỗi này đã xảy ra một lần
 * (cả bảng điều khiển hiện tiếng Anh cho người đọc tiếng Trung), nên kiểm bằng
 * máy thay vì trông vào trí nhớ.
 */
import { readFileSync } from "node:fs";

const SRC = "src/components/quiz/quizText.ts";
const source = readFileSync(SRC, "utf8");

const blocks = [...source.matchAll(/^ {2}(vi|en|zh): \{(.*?)^ {2}\},/gms)];
if (blocks.length !== 3) {
  console.error(`Không đọc được đủ ba cột vi/en/zh trong ${SRC} (thấy ${blocks.length}).`);
  process.exit(1);
}

const keys = new Map(
  blocks.map(([, locale, body]) => [
    locale,
    new Set([...body.matchAll(/^ {4}(\w+):/gm)].map((m) => m[1])),
  ]),
);

const base = keys.get("vi");
let bad = 0;
for (const locale of ["en", "zh"]) {
  const missing = [...base].filter((k) => !keys.get(locale).has(k));
  const extra = [...keys.get(locale)].filter((k) => !base.has(k));
  if (missing.length) {
    console.error(`${locale}: thiếu ${missing.length} khoá — ${missing.join(", ")}`);
    bad += missing.length;
  }
  if (extra.length) {
    console.error(`${locale}: thừa ${extra.length} khoá — ${extra.join(", ")}`);
    bad += extra.length;
  }
}

if (bad) {
  console.error("\nMỗi khoá phải có đủ cả ba thứ tiếng.");
  process.exit(1);
}
console.log(`Chữ trang quiz hợp lệ: ${base.size} khoá × 3 thứ tiếng.`);
