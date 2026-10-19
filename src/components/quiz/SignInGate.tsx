"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import Link from "next/link";
import type { QuizText } from "./quizText";

/**
 * Chắn đăng nhập cho các phần gắn với tài khoản (lộ trình, tài liệu cá nhân).
 *
 * Một dòng, không giải thích dài: người dùng chưa đăng nhập chỉ cần biết bấm
 * vào đâu, còn lý do thì đọc xong cũng không đổi quyết định.
 */
export default function SignInGate({ t }: { t: QuizText }) {
  return <ContentSurface scope="src/components/quiz/SignInGate.tsx">{(
    <section className="quiz-signin-gate">
      <b>{t.signInTitle}</b>
      <Link href="/dang-nhap" className="quiz-signin-cta">
        {t.signInCta} →
      </Link>
    </section>
  )}</ContentSurface>;
}
