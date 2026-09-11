"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { markLocaleTransition } from "@/lib/localeTransition";
import { pick, type Loc } from "@/lib/homeContent";
import { settingsContent as S } from "@/lib/settingsContent";
import { deletePath } from "@/lib/study";
import { clearMemory } from "@/lib/chatMemory";
import { Card, Notice } from "./parts";

const LOCALE_LABELS: Record<Locale, string> = { vi: "Tiếng Việt", en: "English", zh: "中文" };
const LOCALE_CODES: Record<Locale, string> = { vi: "VI", en: "EN", zh: "中文" };

type Theme = "light" | "dark";

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** Báo lại khi <html data-theme> đổi — nút sáng/tối ngoài nav cũng sửa nó. */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Tuỳ chọn hiển thị và dọn dữ liệu học tập. */
export default function PrefsTab({ locale }: { locale: Loc }) {
  const P = S.prefs;
  const router = useRouter();
  const pathname = usePathname();
  const [flash, setFlash] = useState<string | null>(null);
  /**
   * Chủ đề nằm ở thuộc tính `data-theme` trên <html> chứ không ở React, nên đọc
   * bằng `useSyncExternalStore`: nút sáng/tối trên thanh nav đổi thuộc tính đó
   * thì thẻ chọn ở đây sáng theo ngay, khỏi giữ bản sao thứ hai dễ lệch.
   */
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "dark" as Theme);

  function applyTheme(nextTheme: Theme) {
    // Cùng khoá với `ThemeToggle` trên thanh nav: giữ một nguồn sự thật.
    localStorage.setItem("soma3d-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  function applyLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    markLocaleTransition(pathname);
    router.replace(pathname, { locale: nextLocale, scroll: false });
  }

  async function wipePath() {
    if (!window.confirm(pick(P.clearPathAsk, locale))) return;
    await deletePath();
    setFlash(pick(P.done, locale));
  }

  function wipeChat() {
    if (!window.confirm(pick(P.clearChatAsk, locale))) return;
    clearMemory();
    setFlash(pick(P.done, locale));
  }

  return (
    <>
      <Card title={pick(P.themeHeading, locale)} note={pick(P.themeNote, locale)}>
        <div className="st-choices">
          {(["light", "dark"] as Theme[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`st-choice${theme === item ? " is-on" : ""}`}
              aria-pressed={theme === item}
              onClick={() => applyTheme(item)}
            >
              {pick(item === "light" ? P.light : P.dark, locale)}
            </button>
          ))}
        </div>
      </Card>

      <Card title={pick(P.langHeading, locale)} note={pick(P.langNote, locale)}>
        <div className="st-choices">
          {routing.locales.map((item) => (
            <button
              key={item}
              type="button"
              className={`st-choice${item === locale ? " is-on" : ""}`}
              aria-pressed={item === locale}
              onClick={() => applyLocale(item)}
            >
              {LOCALE_LABELS[item]} <em>{LOCALE_CODES[item]}</em>
            </button>
          ))}
        </div>
      </Card>

      <Card title={pick(P.dataHeading, locale)}>
        <div className="st-row">
          <div>
            <b>{pick(P.clearPath, locale)}</b>
            <span>{pick(P.clearPathNote, locale)}</span>
          </div>
          <button type="button" className="st-btn small danger" onClick={() => void wipePath()}>
            {pick(P.clearPath, locale)}
          </button>
        </div>
        <div className="st-row">
          <div>
            <b>{pick(P.clearChat, locale)}</b>
            <span>{pick(P.clearChatNote, locale)}</span>
          </div>
          <button type="button" className="st-btn small danger" onClick={wipeChat}>
            {pick(P.clearChat, locale)}
          </button>
        </div>
        {flash && <Notice kind="ok">{flash}</Notice>}
      </Card>
    </>
  );
}
