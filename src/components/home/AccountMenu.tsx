"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { AUTH_CHANGED_EVENT, authRequest, clearAuth, getToken } from "@/lib/auth";
import { getProfile, type AccountProfile } from "@/lib/account";
import { Avatar, PlanBadge } from "../settings/parts";

/**
 * Nút tài khoản trên thanh điều hướng: avatar chữ cái, bấm vào mở bảng gồm
 * tên/email và năm lối vào — Tài khoản · Tài liệu · Thư viện · Cài đặt · Đăng xuất.
 *
 * Bảng này CHỈ điều hướng, không chứa công tắc thao tác: mọi tuỳ chọn nằm ở
 * `/cai-dat` để chỉ có một chỗ duy nhất chỉnh, khỏi lệch giữa hai nơi.
 */
export default function AccountMenu({ locale }: { locale: Loc }) {
  const [user, setUser] = useState<AccountProfile | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      await Promise.resolve();
      if (!getToken()) return setUser(null);
      try {
        setUser(await getProfile());
      } catch {
        clearAuth();
        setUser(null);
      }
    }
    void loadUser();
    window.addEventListener(AUTH_CHANGED_EVENT, loadUser);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, loadUser);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  async function logout() {
    try { await authRequest("/auth/logout", { method: "POST" }); } catch { /* Xóa phiên cục bộ kể cả khi API ngoại tuyến. */ }
    clearAuth();
    setUser(null);
    setOpen(false);
  }

  if (!user) return <Link href="/dang-nhap" className="btn-signin">{pick(C.nav.signIn, locale)}</Link>;

  const A = C.account;
  return (
    <div className="account" ref={rootRef}>
      <button
        type="button"
        className="account-avatar"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={pick(A.open, locale)}
        title={user.name}
      >
        <Avatar name={user.name} src={user.avatar} size={42} />
      </button>

      {open && (
        <div className="account-menu" role="menu">
          <div className="account-head">
            <Avatar name={user.name} src={user.avatar} size={38} />
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <PlanBadge plan={user.plan} locale={locale} />
          </div>

          <div className="account-links">
            <Link href="/cai-dat/tai-khoan" onClick={() => setOpen(false)}>{pick(A.account, locale)}</Link>
            <Link href="/cai-dat/tai-lieu" onClick={() => setOpen(false)}>{pick(A.docs, locale)}</Link>
            <Link href="/thu-vien" onClick={() => setOpen(false)}>{pick(C.nav.library, locale)}</Link>
            <Link href="/cai-dat" onClick={() => setOpen(false)}>{pick(A.settings, locale)}</Link>
          </div>

          <button type="button" className="account-out" onClick={logout}>{pick(C.nav.signOut, locale)}</button>
        </div>
      )}
    </div>
  );
}
