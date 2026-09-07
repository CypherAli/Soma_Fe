// Cho phép node chạy thẳng mã nguồn .ts của dự án.
//
// Mã trong src/ viết theo kiểu bundler: `import "./handModel"` (không đuôi) —
// đúng với Next/Turbopack nhưng node ESM thì bắt buộc phải có đuôi tệp. Hook
// này chỉ làm một việc: khi một đường dẫn tương đối không có đuôi, thử thêm
// `.ts` rồi `/index.ts`. Nhờ vậy `npm run test:gestures` chạy được mà không
// cần bước biên dịch hay thư viện ngoài nào.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { register } from "node:module";

const ROOT = new URL("../", import.meta.url);

export async function resolve(specifier, context, next) {
  // Alias "@/x" của dự án -> "src/x" (tsconfig paths). Node không đọc tsconfig
  // nên không có bước này thì mọi module trong src/ đều không nạp được.
  if (specifier.startsWith("@/")) {
    const base = new URL("src/" + specifier.slice(2), ROOT);
    for (const cand of [base.href, base.href + ".ts", base.href + "/index.ts"]) {
      if (existsSync(fileURLToPath(cand))) return next(cand, context);
    }
  }
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    const base = new URL(specifier, context.parentURL);
    for (const cand of [base.href + ".ts", base.href + "/index.ts"]) {
      if (existsSync(fileURLToPath(cand))) return next(cand, context);
    }
  }
  return next(specifier, context);
}

// Tự đăng ký chính mình làm hook khi được nạp bằng `node --import`.
register(import.meta.url);
