"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import { settingsContent as S } from "@/lib/settingsContent";
import { AUTH_CHANGED_EVENT, authRequest, clearAuth, getToken } from "@/lib/auth";
import { getProfile, type AccountProfile } from "@/lib/account";
import { Avatar, PlanBadge, Skeleton } from "./parts";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import ConnectionsTab from "./ConnectionsTab";
import DocsTab from "./DocsTab";
import PrefsTab from "./PrefsTab";

export type SettingsTab = "profile" | "security" | "connections" | "docs" | "prefs";

const TABS: {
  key: SettingsTab;
  href: string;
  label: keyof typeof S.tabs;
  note: keyof typeof S.tabs;
}[] = [
  { key: "profile", href: "/cai-dat/tai-khoan", label: "profile", note: "profileNote" },
  { key: "security", href: "/cai-dat/bao-mat", label: "security", note: "securityNote" },
  { key: "connections", href: "/cai-dat/ket-noi", label: "connections", note: "connectionsNote" },
  { key: "docs", href: "/cai-dat/tai-lieu", label: "docs", note: "docsNote" },
  { key: "prefs", href: "/cai-dat", label: "prefs", note: "prefsNote" },
];

/**
 * Khu tài khoản. Năm đường dẫn dùng chung khung này, chỉ khác `tab`.
 *
 * Hồ sơ nạp MỘT lần ở đây rồi truyền xuống: để mỗi tab tự gọi `/auth/me` thì
 * bấm qua lại giữa các mục là mỗi lần chớp một nhịp trắng, mà dữ liệu vẫn thế.
 */
export default function SettingsPage({ locale, tab }: { locale: Loc; tab: SettingsTab }) {
  const [user, setUser] = useState<AccountProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      // Nhường một nhịp trước khi đụng state: đặt state ngay trong thân effect
      // là thêm một vòng render thừa đúng lúc trang vừa dựng.
      await Promise.resolve();
      if (!getToken()) {
        setUser(null);
        setReady(true);
        return;
      }
      try {
        setUser(await getProfile());
      } catch {
        clearAuth();
        setUser(null);
      }
      setReady(true);
    }
    void load();
    // Đăng nhập/đăng xuất ở nơi khác (thanh nav) cũng phải cập nhật trang này.
    window.addEventListener(AUTH_CHANGED_EVENT, load);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, load);
  }, []);

  async function signOut() {
    try { await authRequest("/auth/logout", { method: "POST" }); } catch { /* vẫn xoá phiên cục bộ khi API ngoại tuyến */ }
    clearAuth();
    setUser(null);
  }

  return (
    <main className="st-page">
      <header className="st-head">
        <p className="st-eyebrow">Soma 3D</p>
        <h1>{pick(S.title, locale)}</h1>
        <p className="st-sub">{pick(S.subtitle, locale)}</p>
      </header>

      <div className="st-body">
        <aside className="st-rail">
          {user && (
            <div className="st-me">
              <Avatar name={user.name} src={user.avatar} size={46} />
              <div className="st-me-id">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <PlanBadge plan={user.plan} locale={locale} />
            </div>
          )}

          <nav className="st-nav">
            {TABS.map((item) => (
              <Link key={item.key} href={item.href} className={item.key === tab ? "is-on" : ""}>
                <b>{pick(S.tabs[item.label], locale)}</b>
                <em>{pick(S.tabs[item.note], locale)}</em>
              </Link>
            ))}
            <Link href="/thu-vien" className="st-nav-out">
              <b>{pick(S.tabs.library, locale)}</b>
              <em aria-hidden="true">↗</em>
            </Link>
          </nav>
        </aside>

        <div className="st-main">
          {!ready ? (
            <div className="st-card"><Skeleton rows={4} /></div>
          ) : !user ? (
            <div className="st-card st-gate">
              <b>{pick(S.signInTitle, locale)}</b>
              <p>{pick(S.signInBody, locale)}</p>
              <Link href="/dang-nhap" className="st-btn primary">{pick(S.signInCta, locale)} →</Link>
            </div>
          ) : tab === "profile" ? (
            <ProfileTab locale={locale} user={user} onChange={setUser} />
          ) : tab === "security" ? (
            <SecurityTab locale={locale} user={user} onSignedOut={() => void signOut()} />
          ) : tab === "connections" ? (
            <ConnectionsTab locale={locale} user={user} onChange={setUser} />
          ) : tab === "docs" ? (
            <DocsTab locale={locale} />
          ) : (
            <PrefsTab locale={locale} />
          )}
        </div>
      </div>
    </main>
  );
}
