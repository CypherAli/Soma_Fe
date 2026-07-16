"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import type { CategoryData } from "@/lib/exploreContent";
import { Icon } from "../home/IconSprite";

export default function ExploreResults({
  data,
  locale,
}: {
  data: CategoryData;
  locale: Loc;
}) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const cards = useMemo(() => {
    return data.cards.filter((c) => {
      const matchesFilter = active === "all" || c.filters.includes(active);
      const matchesQuery =
        query.trim() === "" || pick(c.title, locale).toLowerCase().includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [data.cards, active, query, locale]);

  return (
    <>
      <div className="toolbar">
        <div className="tb-search">
          <Icon id="i-search" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              locale === "vi"
                ? `Tìm trong ${pick(data.title, locale)}`
                : locale === "zh"
                  ? `在${pick(data.title, locale)}中搜索`
                  : `Search ${pick(data.title, locale)}`
            }
          />
        </div>
        <button className="tb-btn">
          <Icon id="i-sliders" />
          {locale === "vi" ? "Lọc" : locale === "zh" ? "筛选" : "Filter"}
        </button>
        <div className="tb-right">
          <button className="tb-btn"><Icon id="i-globe" />{locale.toUpperCase()}</button>
          <button className="tb-btn">
            <Icon id="i-sort" />
            {locale === "vi" ? "Liên quan" : locale === "zh" ? "相关性" : "Relevance"}
          </button>
          <button className="tb-btn"><Icon id="i-dots" /></button>
        </div>
      </div>

      <div className="filter-tabs">
        {data.filters.map((f) => (
          <button
            key={f.key}
            className={`filter-tab${active === f.key ? " active" : ""}`}
            onClick={() => setActive(f.key)}
          >
            {pick(f.label, locale)}
          </button>
        ))}
      </div>

      <div className="results-grid">
        {cards.map((c, i) => (
          <div
            key={i}
            className="result-card"
            onClick={() => c.href && router.push(c.href)}
          >
            <div className={`thumb ${c.img}`}>
              {c.real && (
                <span className="badge-real">
                  {locale === "vi" ? "MÔ HÌNH THẬT" : locale === "zh" ? "真实模型" : "REAL MODEL"}
                </span>
              )}
              <div className="figline" />
            </div>
            <div className="rc-label">{pick(c.title, locale)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
