import { defineRouting } from "next-intl/routing";

// Soma 3D hỗ trợ 3 ngôn ngữ: Tiếng Việt (mặc định), English, 中文.
export const routing = defineRouting({
  locales: ["vi", "en", "zh"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
