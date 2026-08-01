import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Soma 3D — Atlas giải phẫu 3D tương tác",
  description:
    "Nền tảng giải phẫu 3D tương tác cho ngành y (người & thú y). Đồ án tốt nghiệp.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="h-full antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
