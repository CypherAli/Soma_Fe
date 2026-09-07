"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { searchScenes, systemByKey } from "@/lib/catalog";
import { Icon } from "./IconSprite";

const MAX_SUGGESTIONS = 6;

/**
 * Ô tìm kiếm trang chủ — lọc THẬT trên catalog scene.
 *
 * Khớp theo tên scene, tên hệ, và tên từng cấu trúc bên trong scene (Việt,
 * Anh, Latin) nên gõ "hepar" hay "ốc tai" đều ra đúng mô hình. Bỏ dấu tiếng
 * Việt nên "coi song" vẫn tìm được "Cột sống".
 */
export default function HomeSearch({ locale, compact = false }: { locale: Loc; compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => searchScenes(query, locale), [query, locale]);
  const suggestions = results.slice(0, MAX_SUGGESTIONS);
  const open = focused && query.trim().length > 0;

  const goToFirstResult = () => {
    if (results.length > 0) router.push(results[0].href);
  };

  return (
    <div className={`search-wrap${compact ? " search-compact" : ""}`}>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          goToFirstResult();
        }}
      >
        <svg className="search-leading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
            setFocused(true);
          }}
          // Hoãn đóng để cú click vào gợi ý kịp chạy trước khi panel biến mất
          onBlur={() => {
            blurTimer.current = setTimeout(() => setFocused(false), 150);
          }}
          placeholder={pick(C.hero.search, locale)}
          aria-label={pick(C.hero.search, locale)}
        />
        <button type="submit" className="go" disabled={!query.trim() || results.length === 0}>
          {!compact && <span>{pick(C.hero.searchBtn, locale)}</span>}
          {compact ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h13m-5-5 5 5-5 5"/></svg>
          )}
        </button>
      </form>

      {open && (
        <div className="search-panel">
          {suggestions.length === 0 ? (
            <p className="search-empty">{pick(C.hero.noResult, locale)}</p>
          ) : (
            <>
              {suggestions.map((scene) => {
                const group = systemByKey.get(scene.system);
                return (
                  <Link key={scene.slug} href={scene.href} className="search-hit">
                    <Icon id={group?.icon ?? "i-grid"} />
                    <span className="sh-title">{pick(scene.title, locale)}</span>
                    <span className="sh-sys">{group ? pick(group.label, locale) : ""}</span>
                  </Link>
                );
              })}
              {results.length > suggestions.length && (
                <Link href="/giai-phau/tat-ca" className="search-more">
                  {pick(C.sections.viewAll, locale)} ({results.length})
                </Link>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}
