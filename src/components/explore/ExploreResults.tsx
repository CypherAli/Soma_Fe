"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import { contentTypeTabs, type CategoryData, type ResultCard } from "@/lib/exploreContent";
import AtlasIcon from "./AtlasIcon";

const IMG_ICON_FALLBACK: Record<string, string> = {
  "an-heart": "i-heart", "an-skel": "i-bone", "an-muscle": "i-muscle",
  "an-nerve": "i-brain", "an-organ": "i-stomach", "an-lung": "i-lungs",
  "an-vessel": "i-droplet", "an-cell": "i-cell", "an-brain": "i-brain",
};

function systemPlaceholderIcon(c: ResultCard): string {
  return c.icon ?? IMG_ICON_FALLBACK[c.img] ?? "i-cell";
}

const SPECIMEN_LABELS: Record<string, { vi: string; en: string; zh: string }> = {
  "i-stomach": { vi: "Hệ tiêu hóa", en: "Digestive system", zh: "消化系统" },
  "i-heart": { vi: "Tim mạch", en: "Cardiovascular", zh: "心血管" },
  "i-bone": { vi: "Xương học", en: "Osteology", zh: "骨学" },
  "i-muscle": { vi: "Cơ học", en: "Myology", zh: "肌学" },
  "i-brain": { vi: "Thần kinh", en: "Neurology", zh: "神经学" },
  "i-lungs": { vi: "Hô hấp", en: "Respiratory", zh: "呼吸系统" },
  "i-nephro": { vi: "Tiết niệu", en: "Urinary", zh: "泌尿系统" },
  "i-eye": { vi: "Thị giác", en: "Ophthalmic", zh: "视觉系统" },
  "i-ear": { vi: "Thính giác", en: "Auditory", zh: "听觉系统" },
  "i-cell": { vi: "Vi giải phẫu", en: "Microanatomy", zh: "微观解剖" },
};

function specimenLabel(c: ResultCard, locale: Loc) {
  const label = SPECIMEN_LABELS[systemPlaceholderIcon(c)] ?? SPECIMEN_LABELS["i-cell"];
  return label[locale];
}

/** Thứ tự sắp xếp của nút bên phải thanh công cụ. */
const SORT_MODES = ["relevance", "az", "za"] as const;
type SortMode = (typeof SORT_MODES)[number];

const SORT_LABELS: Record<SortMode, { vi: string; en: string; zh: string }> = {
  relevance: { vi: "Liên quan", en: "Relevance", zh: "相关性" },
  az: { vi: "Tên A → Z", en: "Name A → Z", zh: "名称 A → Z" },
  za: { vi: "Tên Z → A", en: "Name Z → A", zh: "名称 Z → A" },
};

export default function ExploreResults({ data, locale }: { data: CategoryData; locale: Loc }) {
  const isAllModels = data.filters.length === 0;
  const [active, setActive] = useState("all");
  const [contentType, setContentType] = useState<"all" | "anatomy" | "condition" | "procedure">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("relevance");
  const router = useRouter();

  const cards = useMemo(() => {
    const filtered = data.cards.filter((c) => {
      const matchesFilter = active === "all" || c.filters.includes(active);
      const matchesType = contentType === "all" || c.type === contentType;
      const matchesQuery = query.trim() === "" || pick(c.title, locale).toLowerCase().includes(query.trim().toLowerCase());
      return matchesFilter && matchesType && matchesQuery;
    });
    if (sort === "relevance") return filtered; // giữ nguyên thứ tự biên tập
    const dir = sort === "az" ? 1 : -1;
    return [...filtered].sort(
      (a, b) => dir * pick(a.title, locale).localeCompare(pick(b.title, locale), locale === "zh" ? "zh" : "vi"),
    );
  }, [data.cards, active, contentType, query, sort, locale]);

  return (
    <>
      <div className="toolbar">
        <div className="tb-search">
          <AtlasIcon id="i-search" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "vi" ? `Tìm trong ${pick(data.title, locale)}` : locale === "zh" ? `在${pick(data.title, locale)}中搜索` : `Search ${pick(data.title, locale)}`}
            aria-label={locale === "vi" ? "Tìm kiếm mô hình" : locale === "zh" ? "搜索模型" : "Search models"}
          />
        </div>
        <div className="tb-right">
          <span className="visible-count">{cards.length} {locale === "vi" ? "kết quả" : locale === "zh" ? "个结果" : "results"}</span>
          <button
            className="tb-btn"
            type="button"
            onClick={() => setSort(SORT_MODES[(SORT_MODES.indexOf(sort) + 1) % SORT_MODES.length])}
            title={locale === "vi" ? "Bấm để đổi cách sắp xếp" : locale === "zh" ? "点击切换排序方式" : "Click to change sorting"}
            aria-label={locale === "vi" ? `Sắp xếp: ${SORT_LABELS[sort].vi}` : `Sort: ${SORT_LABELS[sort].en}`}
          >
            <AtlasIcon id="i-sort" />
            {SORT_LABELS[sort][locale]}
          </button>
        </div>
      </div>

      {isAllModels ? (
        <div className="content-tabs">
          {contentTypeTabs.map((t) => <button key={t.key} className={`content-tab${contentType === t.key ? " active" : ""}`} onClick={() => setContentType(t.key)}>{pick(t.label, locale)}</button>)}
        </div>
      ) : (
        <div className="filter-tabs">
          {data.filters.map((f) => <button key={f.key} className={`filter-tab${active === f.key ? " active" : ""}`} onClick={() => setActive(f.key)}>{pick(f.label, locale)}</button>)}
        </div>
      )}

      {cards.length === 0 ? (
        <p className="content-empty">{locale === "vi" ? "Chưa có nội dung ở mục này." : locale === "zh" ? "此分类暂无内容。" : "No content in this category yet."}</p>
      ) : (
        <div className="results-grid">
          {cards.map((c, i) => (
            <button type="button" key={`${pick(c.title, "en")}-${i}`} className="result-card" onClick={() => c.href && router.push(c.href)} disabled={!c.href}>
              <div className={`thumb ${c.img}${c.thumb ? " has-photo" : ""}`}>
                {c.thumb ? <img src={c.thumb} alt={pick(c.title, locale)} loading="lazy" /> : (
                  <div className="anatomy-plate" aria-hidden="true">
                    <span className="plate-kicker">SPECIMEN · {String(i + 1).padStart(3, "0")}</span>
                    <AtlasIcon id={systemPlaceholderIcon(c)} className="atlas-icon thumb-icon" />
                    <span className="plate-system">{specimenLabel(c, locale)}</span>
                    <i className="plate-scale"><b /><b /><b /><b /><b /></i>
                  </div>
                )}
                <span className="card-index">{String(i + 1).padStart(2, "0")}</span>
                {c.real ? <span className="badge-real">{locale === "vi" ? "MÔ HÌNH 3D" : locale === "zh" ? "三维模型" : "3D MODEL"}</span> : <span className="badge-soon">{locale === "vi" ? "SẮP CÓ" : locale === "zh" ? "即将推出" : "COMING SOON"}</span>}
                <div className="figline" />
              </div>
              <div className="rc-label">
                <span><small>{locale === "vi" ? "ATLAS TƯƠNG TÁC" : locale === "zh" ? "交互式图谱" : "INTERACTIVE ATLAS"}</small><strong>{pick(c.title, locale)}</strong></span>
                <b aria-hidden="true">↗</b>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
