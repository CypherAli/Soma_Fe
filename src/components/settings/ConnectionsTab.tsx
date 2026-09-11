"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import { settingsContent as S } from "@/lib/settingsContent";
import {
  PROVIDERS,
  PROVIDER_LABELS,
  linkUrl,
  unlinkProvider,
  type AccountProfile,
  type Provider,
} from "@/lib/account";
import { SocialIcon } from "@/components/auth/AuthPage";
import { Card, Notice, errorText } from "./parts";

/**
 * Kết nối Google · GitHub · Facebook.
 *
 * Nút "Liên kết" là một thẻ `<a>` chuyển trang thật, không phải fetch: luồng
 * OAuth phải rời khỏi trang để người dùng đăng nhập ở nhà cung cấp rồi quay về
 * `?linked=<provider>`.
 */
export default function ConnectionsTab({
  locale,
  user,
  onChange,
}: {
  locale: Loc;
  user: AccountProfile;
  onChange: (user: AccountProfile) => void;
}) {
  const C = S.connections;
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  /** Máy chủ đưa về `?linked=<provider>` sau khi liên kết xong. */
  const justLinked = params.get("linked");
  useEffect(() => {
    if (!justLinked) return;
    // Bỏ tham số khỏi URL để tải lại trang không báo "đã liên kết" lần nữa.
    // Chỉ đụng lịch sử trình duyệt, không đặt state: lời nhắn phía dưới suy ra
    // thẳng từ tham số nên không cần bản sao trong React.
    window.history.replaceState(null, "", window.location.pathname);
  }, [justLinked]);

  /** Số lối vào còn lại nếu gỡ một cái: dưới 1 là tự khoá mình ra ngoài. */
  const methods =
    (user.hasPassword ? 1 : 0) + PROVIDERS.filter((item) => user.connections[item]).length;

  async function unlink(provider: Provider) {
    if (!window.confirm(pick(C.disconnectAsk, locale))) return;
    setError(null);
    try {
      onChange(await unlinkProvider(provider));
    } catch (cause) {
      setError(errorText(cause));
    }
  }

  return (
    <Card title={pick(C.heading, locale)} note={pick(C.note, locale)}>
      {error && <Notice kind="error">{error}</Notice>}
      {justLinked && <Notice kind="ok">{pick(C.linkedJust, locale)}</Notice>}

      <ul className="st-conns">
        {PROVIDERS.map((provider) => {
          const linked = user.connections[provider];
          const last = linked && methods <= 1;
          return (
            <li key={provider}>
              <span className={`st-conn-icon ${provider}`}>
                <SocialIcon provider={provider} />
              </span>
              <div>
                <b>{PROVIDER_LABELS[provider]}</b>
                <em>{pick(linked ? C.connected : C.notConnected, locale)}</em>
                {last && <em className="st-conn-warn">{pick(C.lastMethod, locale)}</em>}
              </div>
              {linked ? (
                <button
                  type="button"
                  className="st-btn small danger"
                  disabled={last}
                  onClick={() => void unlink(provider)}
                >
                  {pick(C.disconnect, locale)}
                </button>
              ) : (
                <a className="st-btn small" href={linkUrl(provider)}>
                  {pick(C.connect, locale)}
                </a>
              )}
            </li>
          );
        })}

        <li className="st-conn-pass">
          <span className="st-conn-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="4" y="10" width="16" height="10" rx="2.5" />
              <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
            </svg>
          </span>
          <div>
            <b>{pick(C.passwordMethod, locale)}</b>
            <em>{pick(user.hasPassword ? C.passwordSet : C.passwordUnset, locale)}</em>
          </div>
        </li>
      </ul>
    </Card>
  );
}
