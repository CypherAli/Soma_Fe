"use client";




import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { ContentSurface } from "@/components/content/ContentProvider";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  API_URL,
  authRequest,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
  passwordStrength,
  saveAuth,
  type AuthResponse,
} from "@/lib/auth";
import ThemeToggle from "@/components/home/ThemeToggle";

type Mode = "login" | "register" | "forgot";

const words = bindContentSource("data:src/components/auth/AuthPage.tsx#words", {
  vi: {
    loginTitle: "Chào mừng trở lại", registerTitle: "Bắt đầu hành trình của bạn",
    forgotTitle: "Quên mật khẩu", loginSub: "Tiếp tục khám phá cơ thể người qua không gian 3D.",
    registerSub: "Tạo tài khoản miễn phí để lưu tiến trình học tập.",
    forgotSub: "Nhập email đã đăng ký, chúng tôi gửi link đặt lại trong 15 phút.",
    login: "Đăng nhập", register: "Đăng ký", sendLink: "Gửi link đặt lại",
    backToLogin: "Quay lại đăng nhập", name: "Họ và tên", email: "Email",
    password: "Mật khẩu", confirm: "Nhập lại mật khẩu", forgot: "Quên mật khẩu?",
    loading: "Đang xử lý…", home: "Trang chủ", or: "Hoặc tiếp tục với",
    new: "Bạn chưa có tài khoản?", old: "Bạn đã có tài khoản?",
    terms: "Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.",
    visual: "Khám phá giải phẫu theo một cách hoàn toàn mới.",
    visualSub: "Mô hình 3D chính xác, trực quan và được thiết kế cho việc học.",
    namePh: "Nguyễn Văn An", emailPh: "name@example.com", passPh: "Ít nhất 8 ký tự, gồm chữ và số",
    confirmPh: "Nhập lại mật khẩu", forgotSent: "Nếu email này đã đăng ký, link đặt lại đã được gửi. Kiểm tra hộp thư (kể cả Spam).",
    errEmail: "Email chưa đúng định dạng", errPass: "Mật khẩu ≥ 8 ký tự, gồm cả chữ và số",
    errConfirm: "Mật khẩu nhập lại chưa khớp", errName: "Họ tên phải có ít nhất 2 ký tự",
    errTerms: "Bạn cần đồng ý điều khoản", show: "Hiện", hide: "Ẩn",
    showPw: "Hiện hoặc ẩn mật khẩu", pwWeak: "Yếu", pwMedium: "Trung bình", pwStrong: "Mạnh",
  },
  en: {
    loginTitle: "Welcome back", registerTitle: "Begin your journey",
    forgotTitle: "Forgot password", loginSub: "Continue exploring the human body in three dimensions.",
    registerSub: "Create a free account to save your learning progress.",
    forgotSub: "Enter your registered email, we will send a reset link (15 minutes).",
    login: "Sign in", register: "Create account", sendLink: "Send reset link",
    backToLogin: "Back to sign in", name: "Full name", email: "Email",
    password: "Password", confirm: "Confirm password", forgot: "Forgot password?",
    loading: "Please wait…", home: "Home", or: "Or continue with",
    new: "New to Soma 3D?", old: "Already have an account?",
    terms: "I agree to the Terms of Use and Privacy Policy.",
    visual: "Discover anatomy in an entirely new way.",
    visualSub: "Accurate, intuitive 3D models designed for learning.",
    namePh: "Jane Doe", emailPh: "name@example.com", passPh: "At least 8 chars, letters + numbers",
    confirmPh: "Repeat your password", forgotSent: "If this email is registered, a reset link has been sent. Check inbox (and Spam).",
    errEmail: "Invalid email format", errPass: "Password needs 8+ chars with letters and numbers",
    errConfirm: "Passwords do not match", errName: "Name needs at least 2 characters",
    errTerms: "Please accept the terms", show: "Show", hide: "Hide",
    showPw: "Show or hide password", pwWeak: "Weak", pwMedium: "Medium", pwStrong: "Strong",
  },
  zh: {
    loginTitle: "欢迎回来", registerTitle: "开启探索之旅",
    forgotTitle: "忘记密码", loginSub: "继续通过三维空间探索人体。",
    registerSub: "免费创建账户并保存学习进度。",
    forgotSub: "输入注册邮箱，我们将发送重置链接（15 分钟有效）。",
    login: "登录", register: "创建账户", sendLink: "发送重置链接",
    backToLogin: "返回登录", name: "姓名", email: "电子邮箱",
    password: "密码", confirm: "确认密码", forgot: "忘记密码？",
    loading: "处理中…", home: "首页", or: "或使用以下方式",
    new: "还没有账户？", old: "已有账户？",
    terms: "我同意使用条款和隐私政策。",
    visual: "以全新方式探索人体解剖。",
    visualSub: "精准、直观，为学习而设计的三维模型。",
    namePh: "张三", emailPh: "name@example.com", passPh: "至少 8 位，含字母和数字",
    confirmPh: "再次输入密码", forgotSent: "如果该邮箱已注册，重置链接已发送，请查收（含垃圾箱）。",
    errEmail: "邮箱格式不正确", errPass: "密码需 8 位以上，含字母和数字",
    errConfirm: "两次输入的密码不一致", errName: "姓名至少 2 个字符",
    errTerms: "请先同意条款", show: "显示", hide: "隐藏",
    showPw: "显示或隐藏密码", pwWeak: "弱", pwMedium: "中", pwStrong: "强",
  },
});

/** Dùng lại ở khu tài khoản (`components/settings/ConnectionsTab`). */
export function SocialIcon({ provider }: { provider: "google" | "facebook" | "github" }) {
  if (provider === "google") return <ContentSurface scope="src/components/auth/AuthPage.tsx"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h6a5.1 5.1 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.2Z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11.2 11.2 0 0 0 12 23Z" /><path fill="#FBBC05" d="M5.7 14.1A6.7 6.7 0 0 1 5.4 12c0-.7.1-1.5.3-2.1V7H2A11.2 11.2 0 0 0 2 17l3.7-2.9Z" /><path fill="#EA4335" d="M12 5.3c1.7 0 3.1.6 4.3 1.7l3.2-3.2A10.8 10.8 0 0 0 12 1 11.2 11.2 0 0 0 2 7l3.7 2.9c.9-2.7 3.4-4.6 6.3-4.6Z" /></svg></ContentSurface>;
  if (provider === "facebook") return <ContentSurface scope="src/components/auth/AuthPage.tsx"><svg viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.8v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.4H14v8.4A12 12 0 0 0 24 12Z" /></svg></ContentSurface>;
  return <ContentSurface scope="src/components/auth/AuthPage.tsx"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .7a11.6 11.6 0 0 0-3.7 22.6c.6.1.8-.2.8-.5v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8-.8c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.5A11.6 11.6 0 0 0 12 .7Z" /></svg></ContentSurface>;
}

export default function AuthPage() {
  const cmsContent = useContent();
  const words = cmsContent.resolve(cmsSourcewords());

  const locale = useLocale() as keyof typeof words;
  const t = words[locale] ?? words.vi;
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("link_provider")) {
      url.searchParams.delete("link_provider");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }, []);
  const [oauth, setOAuth] = useState({ google: false, facebook: false, github: false });
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`${API_URL}/auth/capabilities`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const data = await response.json() as { oauth?: Record<string, unknown> };
        if (!controller.signal.aborted) setOAuth({ google: data.oauth?.google === true, facebook: data.oauth?.facebook === true, github: data.oauth?.github === true });
      }).catch(() => {});
    return () => controller.abort();
  }, []);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pw, setPw] = useState("");

  const strength = useMemo(() => passwordStrength(pw), [pw]);
  const strengthLabel = strength.label === "weak" ? t.pwWeak : strength.label === "medium" ? t.pwMedium : t.pwStrong;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending || cooldown > 0) return;
    setError("");
    setNotice("");
    const form = new FormData(e.currentTarget);
    const email = normalizeEmail(String(form.get("email") ?? ""));
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    if (!isValidEmail(email)) { setError(t.errEmail); return; }

    // Quên mật khẩu: chỉ cần email.
    if (mode === "forgot") {
      setPending(true);
      try {
        const res = await authRequest<{ message: string }>("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        setNotice(res.message || t.forgotSent);
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown((c) => {
            if (c <= 1) { clearInterval(timer); return 0; }
            return c - 1;
          });
        }, 1000);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : t.loading);
      } finally {
        setPending(false);
      }
      return;
    }

    if (!isValidPassword(password)) { setError(t.errPass); return; }
    if (mode === "register") {
      if (name.length < 2) { setError(t.errName); return; }
      if (password !== String(form.get("confirm") ?? "")) { setError(t.errConfirm); return; }
      if (!form.get("terms")) { setError(t.errTerms); return; }
    }

    setPending(true);
    try {
      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password };
      const result = await authRequest<AuthResponse>(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      saveAuth(result);
      router.replace("/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t.loading);
    } finally {
      setPending(false);
    }
  }

  function changeMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
    setShowPw(false);
    setShowConfirm(false);
  }

  const title = mode === "login" ? t.loginTitle : mode === "register" ? t.registerTitle : t.forgotTitle;
  const sub = mode === "login" ? t.loginSub : mode === "register" ? t.registerSub : t.forgotSub;

  return <ContentSurface scope="src/components/auth/AuthPage.tsx">{(
    <main className={`auth-page auth-${mode}`}>
      <aside className="auth-visual">
        <Image src="/auth-anatomy-hero.png" alt="3D anatomy" fill priority sizes="(max-width: 700px) 100vw, 43vw" />
        <div className="auth-visual-shade" />
        <Link href="/" className="auth-logo"><i>S</i><span>Soma 3D</span></Link>
        <div className="auth-visual-copy"><span>INTERACTIVE ANATOMY ATLAS</span><h2>{t.visual}</h2><p>{t.visualSub}</p></div>
        <div className="auth-visual-meta"><span>01</span><i /><span>HUMAN ANATOMY</span></div>
      </aside>
      <section className="auth-panel">
        <div className="auth-theme"><ThemeToggle /></div>
        <Link href="/" className="auth-back"><span>←</span>{t.home}</Link>
        <div className="auth-card">
          <div className="auth-heading"><span>SOMA 3D</span><h1>{title}</h1><p>{sub}</p></div>
          <div className="auth-tabs" role="tablist">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>{t.login}</button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")}>{t.register}</button>
          </div>
          <form className="auth-form" onSubmit={submit} noValidate={false}>
            {mode === "register" && (
              <label><span>{t.name}</span><input name="name" autoComplete="name" placeholder={t.namePh} minLength={2} maxLength={80} required /></label>
            )}
            <label><span>{t.email}</span><input name="email" type="email" autoComplete="email" placeholder={t.emailPh} required autoFocus={mode === "login"} /></label>
            {mode !== "forgot" && (
              <label>
                <span className="label-row">
                  <b>{t.password}</b>
                  {mode === "login" && <button type="button" className="forgot" onClick={() => changeMode("forgot")}>{t.forgot}</button>}
                </span>
                <span className="password-wrap">
                  <input
                    name="password" type={showPw ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    placeholder={t.passPh} minLength={8} maxLength={128} required
                    value={pw} onChange={(e) => setPw(e.target.value)}
                  />
                  <button type="button" className="show-password" onClick={() => setShowPw(!showPw)} aria-label={t.showPw}>{showPw ? t.hide : t.show}</button>
                </span>
                {mode === "register" && pw.length > 0 && (
                  <small className={`pw-strength pw-${strength.label}`}>
                    {strengthLabel} · {pw.length}/12+
                  </small>
                )}
              </label>
            )}
            {mode === "register" && (
              <>
                <label><span>{t.confirm}</span>
                  <span className="password-wrap">
                    <input name="confirm" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder={t.confirmPh} minLength={8} required />
                    <button type="button" className="show-password" onClick={() => setShowConfirm(!showConfirm)} aria-label={t.showPw}>{showConfirm ? t.hide : t.show}</button>
                  </span>
                </label>
                <label className="terms"><input name="terms" type="checkbox" required /><span>{t.terms}</span></label>
              </>
            )}
            {error && <p className="auth-error" role="alert">{error}</p>}
            {notice && <p className="auth-notice" role="status">{notice}</p>}
            <button className="auth-submit" disabled={pending || cooldown > 0}>
              {pending ? t.loading : mode === "login" ? t.login : mode === "register" ? t.register : `${t.sendLink}${cooldown > 0 ? ` (${cooldown}s)` : ""}`}
              <span>→</span>
            </button>
            {mode === "forgot" && (
              <button type="button" className="auth-backlink" onClick={() => changeMode("login")}>← {t.backToLogin}</button>
            )}
          </form>
          {mode !== "forgot" && (
            <>
              <div className="auth-divider"><span>{t.or}</span></div>
              <div className="auth-socials">
                {(["google", "facebook", "github"] as const).map((p) => (
                  <a key={p} href={oauth[p] ? `${API_URL}/auth/oauth/${p}` : undefined} role="link" aria-disabled={!oauth[p]} tabIndex={oauth[p] ? 0 : -1} style={oauth[p] ? undefined : { opacity: 0.45, pointerEvents: "none" }} title={oauth[p] ? undefined : locale === "vi" ? "Cách đăng nhập này chưa được cấu hình" : locale === "zh" ? "此登录方式尚未配置" : "This sign-in method is not configured"}>
                    <SocialIcon provider={p} /><span>{p[0].toUpperCase() + p.slice(1)}</span>
                  </a>
                ))}
              </div>
              <p className="auth-switch">
                {mode === "login" ? t.new : t.old}{" "}
                <button type="button" onClick={() => changeMode(mode === "login" ? "register" : "login")}>
                  {mode === "login" ? t.register : t.login}
                </button>
              </p>
            </>
          )}
        </div>
        <p className="auth-footer">© 2026 Soma 3D · Privacy · Terms</p>
      </section>
    </main>
  )}</ContentSurface>;
}

function cmsSourcewords() { return words; }
