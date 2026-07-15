import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Bỏ qua các đường dẫn nội bộ (_next), API, và file tĩnh (có dấu chấm).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
