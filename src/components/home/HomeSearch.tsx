"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { searchHref, searchWeb } from "@/lib/site/siteSearch";
import { Icon } from "./IconSprite";

const MAX_SUGGESTIONS = 6;

/**
 * Shared public search: real model names/structures, source sets and tools.
 * Enter opens the complete result page; arrow keys can choose a suggestion.
 */
export default function HomeSearch({ locale, compact = false }: { locale: Loc; compact?: boolean }) {
  const cmsContent = useContent();
  const C = cmsContent.resolve(cmsSourceC());

  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (blurTimer.current) clearTimeout(blurTimer.current); }, []);
  const results = useMemo(() => searchWeb(query, locale), [query, locale]);
  const suggestions = results.slice(0, MAX_SUGGESTIONS);
  const open = focused && query.trim().length > 0;

  const submitSearch = () => {
    if (!query.trim()) return;
    router.push(open && active >= 0 && suggestions[active] ? suggestions[active].href : searchHref(query));
  };

  return <ContentSurface scope="src/components/home/HomeSearch.tsx">{(
    <div className={`search-wrap${compact ? " search-compact" : ""}`}>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
      >
        <svg className="search-leading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(-1); }}
          maxLength={500}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={open && suggestions.length > 0 ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          onKeyDown={event => {
            if (event.key === "Escape") { setFocused(false); setActive(-1); }
            if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length) {
              event.preventDefault(); setFocused(true);
              setActive(index => event.key === "ArrowDown" ? (index + 1) % suggestions.length : (index <= 0 ? suggestions.length : index) - 1);
            }
          }}
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
            setFocused(true);
          }}
          // Hoãn đóng để cú click vào gợi ý kịp chạy trước khi panel biến mất
          onBlur={() => {
            blurTimer.current = setTimeout(() => setFocused(false), 150);
          }}
          placeholder={pick({vi:"Tìm mô hình, bộ đề, tính năng…",en:"Search models, quizzes, features…",zh:"搜索模型、题库、功能…"}, locale)}
          aria-label={pick({vi:"Tìm trong Soma",en:"Search Soma",zh:"搜索 Soma"}, locale)}
        />
        <button type="submit" className="go" disabled={!query.trim()}>
          {!compact && <span>{pick(C.hero.searchBtn, locale)}</span>}
          {compact ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h13m-5-5 5 5-5 5"/></svg>
          )}
        </button>
      </form>

      {open && (
        <div className="search-panel" data-lenis-prevent>
          {suggestions.length === 0 ? (
            <p className="search-empty">{pick(C.hero.noResult, locale)}</p>
          ) : (
            <>
              <div id={listId} role="listbox" aria-label={pick({vi:"Gợi ý tìm kiếm",en:"Search suggestions",zh:"搜索建议"},locale)}>
              {suggestions.map((item, index) => {
                return (
                  <Link key={item.id} id={`${listId}-${index}`} role="option" aria-selected={active === index} href={item.href} className="search-hit">
                    <Icon id={item.kind === "model" ? "i-grid" : "i-search"} />
                    <span className="sh-title">{item.title}</span>
                    <span className="sh-sys">{item.section}</span>
                  </Link>
                );
              })}
              </div>
              {results.length > suggestions.length && (
                <Link href={searchHref(query)} className="search-more">
                  {pick(C.sections.viewAll, locale)} ({results.length})
                </Link>
              )}
            </>
          )}
          <Link href={searchHref(query)} className="search-more">
            {pick({vi:"Xem kết quả & hỏi AI theo nguồn →",en:"View results & ask with sources →",zh:"查看结果及有据问答 →"},locale)}
          </Link>
        </div>
      )}

    </div>
  )}</ContentSurface>;
}

function cmsSourceC() { return C; }
