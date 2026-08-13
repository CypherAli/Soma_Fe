"use client";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { saveAuth, type AuthResponse } from "@/lib/auth";
export default function OAuthCallbackPage() {
  const router = useRouter();
  useEffect(() => { const p = new URLSearchParams(location.hash.slice(1)); try { const token=p.get("token"), expiresAt=p.get("expiresAt"), user=p.get("user"); if(!token||!expiresAt||!user) throw new Error(); saveAuth({token,expiresAt,user:JSON.parse(user)} as AuthResponse); history.replaceState(null,"",location.pathname); router.replace("/"); } catch { router.replace("/dang-nhap"); } }, [router]);
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center"}}>Đang hoàn tất đăng nhập…</main>;
}
