"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { API_URL, authRequest, saveAuth, type AuthResponse } from "@/lib/auth";
import ThemeToggle from "@/components/home/ThemeToggle";

type Mode = "login" | "register";
const words = {
  vi: { loginTitle:"Chào mừng trở lại", registerTitle:"Bắt đầu hành trình của bạn", loginSub:"Tiếp tục khám phá cơ thể người qua không gian 3D.", registerSub:"Tạo tài khoản miễn phí để lưu tiến trình học tập.", login:"Đăng nhập", register:"Đăng ký", name:"Họ và tên", email:"Email", password:"Mật khẩu", confirm:"Nhập lại mật khẩu", forgot:"Quên mật khẩu?", loading:"Đang xử lý…", home:"Trang chủ", or:"Hoặc tiếp tục với", new:"Bạn chưa có tài khoản?", old:"Bạn đã có tài khoản?", terms:"Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.", visual:"Khám phá giải phẫu theo một cách hoàn toàn mới.", visualSub:"Mô hình 3D chính xác, trực quan và được thiết kế cho việc học." },
  en: { loginTitle:"Welcome back", registerTitle:"Begin your journey", loginSub:"Continue exploring the human body in three dimensions.", registerSub:"Create a free account to save your learning progress.", login:"Sign in", register:"Create account", name:"Full name", email:"Email", password:"Password", confirm:"Confirm password", forgot:"Forgot password?", loading:"Please wait…", home:"Home", or:"Or continue with", new:"New to Soma 3D?", old:"Already have an account?", terms:"I agree to the Terms of Use and Privacy Policy.", visual:"Discover anatomy in an entirely new way.", visualSub:"Accurate, intuitive 3D models designed for learning." },
  zh: { loginTitle:"欢迎回来", registerTitle:"开启探索之旅", loginSub:"继续通过三维空间探索人体。", registerSub:"免费创建账户并保存学习进度。", login:"登录", register:"创建账户", name:"姓名", email:"电子邮箱", password:"密码", confirm:"确认密码", forgot:"忘记密码？", loading:"处理中…", home:"首页", or:"或使用以下方式", new:"还没有账户？", old:"已有账户？", terms:"我同意使用条款和隐私政策。", visual:"以全新方式探索人体解剖。", visualSub:"精准、直观，为学习而设计的三维模型。" },
};

function SocialIcon({ provider }: { provider: "google"|"facebook"|"github" }) {
  if (provider === "google") return <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h6a5.1 5.1 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.2Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11.2 11.2 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.7 14.1A6.7 6.7 0 0 1 5.4 12c0-.7.1-1.5.3-2.1V7H2A11.2 11.2 0 0 0 2 17l3.7-2.9Z"/><path fill="#EA4335" d="M12 5.3c1.7 0 3.1.6 4.3 1.7l3.2-3.2A10.8 10.8 0 0 0 12 1 11.2 11.2 0 0 0 2 7l3.7 2.9c.9-2.7 3.4-4.6 6.3-4.6Z"/></svg>;
  if (provider === "facebook") return <svg viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.8v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.4H14v8.4A12 12 0 0 0 24 12Z"/></svg>;
  return <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .7a11.6 11.6 0 0 0-3.7 22.6c.6.1.8-.2.8-.5v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8-.8c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.5A11.6 11.6 0 0 0 12 .7Z"/></svg>;
}

export default function AuthPage() {
  const locale = useLocale() as keyof typeof words; const t=words[locale]??words.vi; const router=useRouter();
  const [mode,setMode]=useState<Mode>("login"), [error,setError]=useState(""), [pending,setPending]=useState(false), [show,setShow]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError("");const form=new FormData(e.currentTarget);if(mode==="register"&&form.get("password")!==form.get("confirm")){setError("Mật khẩu nhập lại chưa khớp");return;}form.delete("confirm");form.delete("terms");setPending(true);try{const result=await authRequest<AuthResponse>(`/auth/${mode}`,{method:"POST",body:JSON.stringify(Object.fromEntries(form))});saveAuth(result);router.replace("/");}catch(reason){setError(reason instanceof Error?reason.message:"Đã có lỗi xảy ra");}finally{setPending(false)}}
  function changeMode(next:Mode){setMode(next);setError("");setShow(false)}
  return <main className={`auth-page auth-${mode}`}>
    <aside className="auth-visual">
      <Image src="/auth-anatomy-hero.png" alt="Mô hình giải phẫu 3D phần đầu và thân trên" fill priority sizes="(max-width: 700px) 100vw, 43vw" />
      <div className="auth-visual-shade" />
      <Link href="/" className="auth-logo"><i>S</i><span>Soma 3D</span></Link>
      <div className="auth-visual-copy"><span>ATLAS GIẢI PHẪU TƯƠNG TÁC</span><h2>{t.visual}</h2><p>{t.visualSub}</p></div>
      <div className="auth-visual-meta"><span>01</span><i/><span>HUMAN ANATOMY</span></div>
    </aside>
    <section className="auth-panel">
      <div className="auth-theme"><ThemeToggle /></div>
      <Link href="/" className="auth-back"><span>←</span>{t.home}</Link>
      <div className="auth-card">
        <div className="auth-heading"><span>SOMA 3D</span><h1>{mode==="login"?t.loginTitle:t.registerTitle}</h1><p>{mode==="login"?t.loginSub:t.registerSub}</p></div>
        <div className="auth-tabs" role="tablist"><button type="button" className={mode==="login"?"active":""} onClick={()=>changeMode("login")}>{t.login}</button><button type="button" className={mode==="register"?"active":""} onClick={()=>changeMode("register")}>{t.register}</button></div>
        <form className="auth-form" onSubmit={submit}>
          {mode==="register"&&<label><span>{t.name}</span><input name="name" autoComplete="name" placeholder="Nguyễn Văn An" minLength={2} maxLength={80} required/></label>}
          <label><span>{t.email}</span><input name="email" type="email" autoComplete="email" placeholder="name@example.com" required autoFocus={mode==="login"}/></label>
          <label><span className="label-row"><b>{t.password}</b>{mode==="login"&&<button type="button" className="forgot">{t.forgot}</button>}</span><span className="password-wrap"><input name="password" type={show?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"} placeholder="Tối thiểu 8 ký tự" minLength={8} maxLength={128} required/><button type="button" className="show-password" onClick={()=>setShow(!show)} aria-label="Hiện hoặc ẩn mật khẩu">{show?"Ẩn":"Hiện"}</button></span></label>
          {mode==="register"&&<><label><span>{t.confirm}</span><input name="confirm" type={show?"text":"password"} autoComplete="new-password" placeholder="Nhập lại mật khẩu" minLength={8} required/></label><label className="terms"><input name="terms" type="checkbox" required/><span>{t.terms}</span></label></>}
          {error&&<p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" disabled={pending}>{pending?t.loading:mode==="login"?t.login:t.register}<span>→</span></button>
        </form>
        <div className="auth-divider"><span>{t.or}</span></div>
        <div className="auth-socials">{(["google","facebook","github"] as const).map(p=><a key={p} href={`${API_URL}/auth/oauth/${p}`}><SocialIcon provider={p}/><span>{p[0].toUpperCase()+p.slice(1)}</span></a>)}</div>
        <p className="auth-switch">{mode==="login"?t.new:t.old} <button type="button" onClick={()=>changeMode(mode==="login"?"register":"login")}>{mode==="login"?t.register:t.login}</button></p>
      </div>
      <p className="auth-footer">© 2026 Soma 3D · Privacy · Terms</p>
    </section>
  </main>;
}
