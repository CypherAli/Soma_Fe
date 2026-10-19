"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { authRequest, isValidPassword } from "@/lib/auth";

const words = {
  vi: {
    title: "Đặt mật khẩu mới", sub: "Link chỉ sống 15 phút và dùng được một lần.",
    pass: "Mật khẩu mới", confirm: "Nhập lại mật khẩu mới", submit: "Đổi mật khẩu & đăng nhập lại",
    loading: "Đang xử lý…", home: "Trang chủ", show: "Hiện", hide: "Ẩn",
    errPass: "Mật khẩu ≥ 8 ký tự, gồm cả chữ và số", errConfirm: "Mật khẩu nhập lại chưa khớp",
    errToken: "Link thiếu token — hãy mở lại link trong email", done: "Đã đặt lại mật khẩu, hãy đăng nhập.",
    goLogin: "Tới đăng nhập",
  },
  en: {
    title: "Set a new password", sub: "The link lives 15 minutes and works once.",
    pass: "New password", confirm: "Confirm new password", submit: "Reset & go to sign in",
    loading: "Please wait…", home: "Home", show: "Show", hide: "Hide",
    errPass: "Password needs 8+ chars with letters and numbers", errConfirm: "Passwords do not match",
    errToken: "Missing token — reopen the link from your email", done: "Password reset, please sign in.",
    goLogin: "Go to sign in",
  },
  zh: {
    title: "设置新密码", sub: "链接 15 分钟有效，仅可使用一次。",
    pass: "新密码", confirm: "确认新密码", submit: "重置并去登录",
    loading: "处理中…", home: "首页", show: "显示", hide: "隐藏",
    errPass: "密码需 8 位以上，含字母和数字", errConfirm: "两次输入的密码不一致",
    errToken: "缺少令牌，请重新打开邮件中的链接", done: "密码已重置，请登录。",
    goLogin: "去登录",
  },
};

export default function ResetPasswordPage() {
  return <ContentSurface scope="src/app/[locale]/dat-lai-mat-khau/page.tsx">{(
    <Suspense>
      <ResetForm />
    </Suspense>
  )}</ContentSurface>;
}

function ResetForm() {
  const locale = useLocale() as keyof typeof words;
  const t = words[locale] ?? words.vi;
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!token) { setError(t.errToken); return; }
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("password") ?? "");
    if (!isValidPassword(newPassword)) { setError(t.errPass); return; }
    if (newPassword !== String(form.get("confirm") ?? "")) { setError(t.errConfirm); return; }
    setPending(true);
    try {
      await authRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setDone(true);
      setTimeout(() => router.replace("/dang-nhap"), 1500);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t.loading);
    } finally {
      setPending(false);
    }
  }

  return <ContentSurface scope="src/app/[locale]/dat-lai-mat-khau/page.tsx">{(
    <main className="auth-page auth-login">
      <section className="auth-panel" style={{ width: "100%" }}>
        <Link href="/" className="auth-back"><span>←</span>{t.home}</Link>
        <div className="auth-card">
          <div className="auth-heading"><span>SOMA 3D</span><h1>{t.title}</h1><p>{t.sub}</p></div>
          {done ? (
            <>
              <p className="auth-notice" role="status">{t.done}</p>
              <Link href="/dang-nhap" className="auth-submit" style={{ textDecoration: "none", textAlign: "center" }}>{t.goLogin}</Link>
            </>
          ) : (
            <form className="auth-form" onSubmit={submit}>
              <label><span>{t.pass}</span>
                <span className="password-wrap">
                  <input name="password" type={show ? "text" : "password"} minLength={8} maxLength={128} required autoFocus />
                  <button type="button" className="show-password" onClick={() => setShow(!show)}>{show ? t.hide : t.show}</button>
                </span>
              </label>
              <label><span>{t.confirm}</span><input name="confirm" type={show ? "text" : "password"} minLength={8} required /></label>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="auth-submit" disabled={pending}>{pending ? t.loading : t.submit}<span>→</span></button>
            </form>
          )}
        </div>
      </section>
    </main>
  )}</ContentSurface>;
}
