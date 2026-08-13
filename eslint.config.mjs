import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Thư viện của bên thứ ba đặt nguyên xi trong public/ (bộ giải mã Draco của
    // Google, dạng đã minify). Không bỏ qua thì `npm run lint` báo gần 1.000 lỗi
    // và cảnh báo của file KHÔNG PHẢI mã của dự án, nhấn chìm mọi lỗi thật —
    // đúng lý do phần kiểm tra này bị bỏ dùng từ trước tới nay.
    "public/**",
  ]),
]);

export default eslintConfig;
