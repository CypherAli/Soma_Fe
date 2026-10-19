"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { AUTH_CHANGED_EVENT, authRequest, clearAuth, getToken } from "@/lib/auth";
import { getProfile, type AccountProfile } from "@/lib/account";
import { Avatar, PlanBadge } from "../settings/parts";
import { Icon } from "./IconSprite";

/**
 * Nút tài khoản trên thanh điều hướng: avatar chữ cái, bấm vào mở bảng gồm
 * tên/email và năm lối vào — Tài khoản · Tài liệu · Thư viện · Cài đặt · Đăng xuất.
 *
 * Bảng này CHỈ điều hướng, không chứa công tắc thao tác: mọi tuỳ chọn nằm ở
 * `/cai-dat` để chỉ có một chỗ duy nhất chỉnh, khỏi lệch giữa hai nơi.
 */
export default function AccountMenu({ locale }: { locale: Loc }) {
  const cmsContent = useContent();
  const C = cmsContent.resolve(cmsSourceC());

  const [user, setUser] = useState<AccountProfile | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let revision = 0;
    async function loadUser() {
      const current = ++revision;
      await Promise.resolve();
      const token = getToken();
      if (!token) return setUser(null);
      try {
        const profile = await getProfile();
        if (current === revision && getToken() === token) setUser(profile);
      } catch {
        // authRequest clears rejected sessions; a temporary network error
        // must not destroy a valid login or overwrite a newer profile.
        if (current === revision && !getToken()) setUser(null);
      }
    }
    void loadUser();
    window.addEventListener(AUTH_CHANGED_EVENT, loadUser);
    return () => {
      revision += 1;
      window.removeEventListener(AUTH_CHANGED_EVENT, loadUser);
    };
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

  if (!user) return <ContentSurface scope="src/components/home/AccountMenu.tsx"><Link href="/dang-nhap" className="btn-signin">{pick(C.nav.signIn, locale)}</Link></ContentSurface>;

  const A = C.account;
  return <ContentSurface scope="src/components/home/AccountMenu.tsx">{(
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
        <Avatar name={user.name} src={user.avatar} size={34} />
      </button>

      {open && (
        <div className="account-menu" role="menu">
          <Link href="/cai-dat/tai-khoan" className="account-profile" onClick={() => setOpen(false)}>
            <Avatar name={user.name} src={user.avatar} size={40} />
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <PlanBadge plan={user.plan} locale={locale} />
          </Link>

          <div className="account-links">
            <Link href="/cai-dat/tai-khoan" onClick={() => setOpen(false)}>
              <span className="am-ico"><Icon id="i-sliders" /></span>
              <span className="am-label">{pick(A.account, locale)}</span>
              <span className="am-chev"><Icon id="i-right" /></span>
            </Link>
            <Link href="/cai-dat/tai-lieu" onClick={() => setOpen(false)}>
              <span className="am-ico"><Icon id="i-bookmark" /></span>
              <span className="am-label">{pick(A.docs, locale)}</span>
              <span className="am-chev"><Icon id="i-right" /></span>
            </Link>
            <Link href="/thu-vien" onClick={() => setOpen(false)}>
              <span className="am-ico"><Icon id="i-grid" /></span>
              <span className="am-label">{pick(C.nav.library, locale)}</span>
              <span className="am-chev"><Icon id="i-right" /></span>
            </Link>
            <Link href="/cai-dat" onClick={() => setOpen(false)}>
              <span className="am-ico"><Icon id="i-help" /></span>
              <span className="am-label">{pick(A.settings, locale)}</span>
              <span className="am-chev"><Icon id="i-right" /></span>
            </Link>
          </div>

          <button type="button" className="account-out" onClick={logout}>
            <span className="am-ico danger"><Icon id="i-close" /></span>
            <span className="am-label">{pick(C.nav.signOut, locale)}</span>
          </button>
        </div>
      )}
    </div>
  )}</ContentSurface>;
}

function cmsSourceC() { return C; }
