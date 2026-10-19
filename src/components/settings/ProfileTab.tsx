"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useRef, useState } from "react";
import { pick, type Loc } from "@/lib/homeContent";
import { settingsContent as S } from "@/lib/settingsContent";
import { fileToAvatar, updateProfile, type AccountProfile } from "@/lib/account";
import { Avatar, Card, Notice, PlanBadge, errorText, formatDate } from "./parts";

/** Hồ sơ: ảnh đại diện, tên hiển thị, các thông tin chỉ đọc và gói tài khoản. */
export default function ProfileTab({
  locale,
  user,
  onChange,
}: {
  locale: Loc;
  user: AccountProfile;
  onChange: (user: AccountProfile) => void;
}) {
  const cmsContent = useContent();
  const S = cmsContent.resolve(cmsSourceS());

  const P = S.profile;
  const [name, setName] = useState(user.name);
  const [busy, setBusy] = useState<"name" | "avatar" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = name.trim() !== user.name;

  async function saveName(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setOk(null);
    if (name.trim().length < 2) return setError(pick(P.nameTooShort, locale));
    setBusy("name");
    try {
      onChange(await updateProfile({ name: name.trim() }));
      setOk(pick(S.saved, locale));
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setBusy(null);
    }
  }

  async function pickPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Dọn ngay để chọn lại ĐÚNG tệp vừa rồi vẫn kích hoạt sự kiện change.
    event.target.value = "";
    if (!file) return;
    setError(null);
    setOk(null);
    setBusy("avatar");
    try {
      onChange(await updateProfile({ avatar: await fileToAvatar(file) }));
      setOk(pick(S.saved, locale));
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setBusy(null);
    }
  }

  async function removePhoto() {
    setError(null);
    setOk(null);
    setBusy("avatar");
    try {
      onChange(await updateProfile({ avatar: null }));
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setBusy(null);
    }
  }

  return <ContentSurface scope="src/components/settings/ProfileTab.tsx">{(
    <>
      <Card title={pick(P.photo, locale)} note={pick(P.photoNote, locale)}>
        <div className="st-photo">
          <Avatar name={user.name} src={user.avatar} size={92} />
          <div className="st-photo-actions">
            <button
              type="button"
              className="st-btn"
              disabled={busy === "avatar"}
              onClick={() => fileRef.current?.click()}
            >
              {pick(busy === "avatar" ? S.saving : P.upload, locale)}
            </button>
            {user.avatar && (
              <button type="button" className="st-btn ghost" disabled={busy === "avatar"} onClick={() => void removePhoto()}>
                {pick(P.removePhoto, locale)}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => void pickPhoto(event)}
              hidden
            />
          </div>
        </div>
      </Card>

      <Card title={pick(P.name, locale)} note={pick(P.nameNote, locale)}>
        <form className="st-inline-form" onSubmit={(event) => void saveName(event)}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            aria-label={pick(P.name, locale)}
          />
          <button type="submit" className="st-btn primary" disabled={!dirty || busy === "name"}>
            {pick(busy === "name" ? S.saving : S.save, locale)}
          </button>
          {dirty && busy !== "name" && (
            <button type="button" className="st-btn ghost" onClick={() => setName(user.name)}>
              {pick(S.cancel, locale)}
            </button>
          )}
        </form>
        {error && <Notice kind="error">{error}</Notice>}
        {ok && <Notice kind="ok">{ok}</Notice>}
      </Card>

      <Card>
        <dl className="st-facts">
          <div>
            <dt>{pick(P.email, locale)}</dt>
            <dd>
              {user.email}
              <em>{pick(P.emailNote, locale)}</em>
            </dd>
          </div>
          <div>
            <dt>{pick(P.role, locale)}</dt>
            <dd>{pick(user.role === "user" ? P.roleUser : P.roleStaff, locale)}</dd>
          </div>
          <div>
            <dt>{pick(P.joined, locale)}</dt>
            <dd>{formatDate(user.createdAt, locale)}</dd>
          </div>
        </dl>
      </Card>

      <Card
        title={pick(S.plan.heading, locale)}
        aside={<PlanBadge plan={user.plan} locale={locale} />}
      >
        <p className="st-note">
          {pick(user.plan === "pro" ? S.plan.proActive : S.plan.freeBody, locale)}
        </p>
        {user.plan === "free" && (
          <div className="st-plan-soon">
            <span>{pick(S.plan.pro, locale)}</span>
            <b>{pick(S.plan.soon, locale)}</b>
            <p>{pick(S.plan.proBody, locale)}</p>
          </div>
        )}
      </Card>
    </>
  )}</ContentSurface>;
}

function cmsSourceS() { return S; }
