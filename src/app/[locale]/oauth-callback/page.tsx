"use client";

import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { saveAuth, type AuthUser } from "@/lib/auth";

function validUser(u: unknown): u is AuthUser {
  if (!u || typeof u !== "object") return false;
  const o = u as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    typeof o.name === "string" &&
    (o.role === "user" ||
      o.role === "editor" ||
      o.role === "admin" ||
      o.role === "super_admin")
  );
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const completedRef = useRef(false);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    void Promise.resolve().then(() => {
      if (!active || completedRef.current) return;
      try {
        const p = new URLSearchParams(location.hash.slice(1));
        const token = p.get("token");
        const expiresAt = p.get("expiresAt");
        const userRaw = p.get("user");
        if (!token || token.length < 10 || !expiresAt || !userRaw)
          throw new Error("invalid");
        if (!Number.isFinite(Date.parse(expiresAt))) throw new Error("invalid");
        if (new Date(expiresAt) <= new Date()) throw new Error("expired");
        const user = JSON.parse(userRaw);
        if (!validUser(user)) throw new Error("invalid");
        saveAuth({ token, expiresAt, user });
        history.replaceState(null, "", location.pathname);
        completedRef.current = true;
        router.replace("/");
      } catch {
        setError(
          "Đăng nhập thất bại hoặc link đã hết hạn, đang đưa bạn về trang đăng nhập…",
        );
        timer = setTimeout(() => router.replace("/dang-nhap"), 1200);
      }
    });
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [router]);
  return <ContentSurface scope="src/app/[locale]/oauth-callback/page.tsx">{(
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      {error ? <p role="alert">{error}</p> : <p>Đang hoàn tất đăng nhập…</p>}
    </main>
  )}</ContentSurface>;
}
