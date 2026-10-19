"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useState } from "react";
import { pick, type Loc } from "@/lib/homeContent";
import { settingsContent as S } from "@/lib/settingsContent";
import { authRequest, saveAuth, type AuthResponse } from "@/lib/auth";
import {
  describeDevice,
  listSessions,
  revokeOtherSessions,
  revokeSession,
  type AccountProfile,
  type DeviceSession,
} from "@/lib/account";
import { Card, Notice, Skeleton, errorText, formatDateTime } from "./parts";

/** Bảo mật: đổi mật khẩu và quản lý các phiên đăng nhập đang sống. */
export default function SecurityTab({
  locale,
  user,
  onSignedOut,
}: {
  locale: Loc;
  user: AccountProfile;
  onSignedOut: () => void;
}) {
  const cmsContent = useContent();
  const S = cmsContent.resolve(cmsSourceS());

  const C = S.security;
  return <ContentSurface scope="src/components/settings/SecurityTab.tsx">{(
    <>
      <PasswordCard locale={locale} user={user} />
      <DevicesCard locale={locale} />
      <Card>
        <button type="button" className="st-btn danger" onClick={onSignedOut}>
          {pick(C.signOut, locale)}
        </button>
      </Card>
    </>
  )}</ContentSurface>;
}

function PasswordCard({ locale, user }: { locale: Loc; user: AccountProfile }) {
  const cmsContent = useContent();
  const S = cmsContent.resolve(cmsSourceS());

  const C = S.security;
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!user.hasPassword) {
    return <ContentSurface scope="src/components/settings/SecurityTab.tsx">{(
      <Card title={pick(C.heading, locale)}>
        <p className="st-note">{pick(C.noPassword, locale)}</p>
      </Card>
    )}</ContentSurface>;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setDone(false);
    // Chặn tại chỗ đúng hai lỗi máy chủ cũng chặn — đỡ một vòng mạng.
    if (next.length < 8) return setError(pick(C.tooShort, locale));
    if (next !== repeat) return setError(pick(C.mismatch, locale));
    setBusy(true);
    try {
      // Máy chủ xoá SẠCH mọi phiên rồi cấp phiên mới. Không lưu token vừa trả
      // về là lần gọi API kế tiếp bị 401, người dùng bị đá ra ngay sau khi đổi
      // mật khẩu thành công.
      const renewed = await authRequest<AuthResponse>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      saveAuth(renewed);
      setCurrent("");
      setNext("");
      setRepeat("");
      setDone(true);
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setBusy(false);
    }
  }

  return <ContentSurface scope="src/components/settings/SecurityTab.tsx">{(
    <Card title={pick(C.heading, locale)}>
      <form className="st-form" onSubmit={(event) => void submit(event)}>
        <label>
          <span>{pick(C.current, locale)}</span>
          <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </label>
        <label>
          <span>{pick(C.next, locale)}</span>
          <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} />
          <em>{pick(C.rule, locale)}</em>
        </label>
        <label>
          <span>{pick(C.confirm, locale)}</span>
          <input type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} required minLength={8} />
        </label>
        {error && <Notice kind="error">{error}</Notice>}
        {done && <Notice kind="ok">{pick(C.changed, locale)}</Notice>}
        <button type="submit" className="st-btn primary" disabled={busy}>
          {pick(busy ? C.submitting : C.submit, locale)}
        </button>
      </form>
    </Card>
  )}</ContentSurface>;
}

function DevicesCard({ locale }: { locale: Loc }) {
  const cmsContent = useContent();
  const S = cmsContent.resolve(cmsSourceS());

  const C = S.security;
  const [rows, setRows] = useState<DeviceSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    void listSessions()
      .then(setRows)
      .catch((cause: unknown) => {
        setRows([]);
        setError(errorText(cause));
      });
  }, []);

  async function cut(id: string) {
    try {
      await revokeSession(id);
      setRows((list) => (list ?? []).filter((row) => row.id !== id));
      setFlash(pick(C.revoked, locale));
    } catch (cause) {
      setError(errorText(cause));
    }
  }

  async function cutOthers() {
    if (!window.confirm(pick(C.revokeOthersAsk, locale))) return;
    try {
      await revokeOtherSessions();
      setRows((list) => (list ?? []).filter((row) => row.current));
      setFlash(pick(C.revoked, locale));
    } catch (cause) {
      setError(errorText(cause));
    }
  }

  const others = (rows ?? []).filter((row) => !row.current).length;

  return <ContentSurface scope="src/components/settings/SecurityTab.tsx">{(
    <Card
      title={pick(C.devicesHeading, locale)}
      note={pick(C.devicesNote, locale)}
      aside={
        others > 0 ? (
          <button type="button" className="st-btn small danger" onClick={() => void cutOthers()}>
            {pick(C.revokeOthers, locale)}
          </button>
        ) : undefined
      }
    >
      {error && <Notice kind="error">{error}</Notice>}
      {flash && <Notice kind="ok">{flash}</Notice>}

      {rows === null ? (
        <Skeleton rows={2} />
      ) : (
        <ul className="st-devices">
          {rows.map((row) => (
            <li key={row.id} className={row.current ? "is-current" : ""}>
              <div>
                <b>
                  {describeDevice(row.userAgent)}
                  {row.current && <span className="st-tag now">{pick(C.thisDevice, locale)}</span>}
                </b>
                <em>
                  {pick(C.lastSeen, locale)}: {formatDateTime(row.lastSeenAt, locale)} · {pick(C.since, locale)}:{" "}
                  {formatDateTime(row.createdAt, locale)}
                </em>
              </div>
              {!row.current && (
                <button type="button" className="st-btn small" onClick={() => void cut(row.id)}>
                  {pick(C.revoke, locale)}
                </button>
              )}
            </li>
          ))}
          {others === 0 && <li className="st-devices-none">{pick(C.onlyOne, locale)}</li>}
        </ul>
      )}
    </Card>
  )}</ContentSurface>;
}

function cmsSourceS() { return S; }
