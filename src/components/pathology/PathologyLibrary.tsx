"use client";

import { useEffect, useMemo, useState } from "react";
import type { Loc } from "@/lib/homeContent";
import {
  fetchPathologies,
  pathologyName,
  structureName,
  systemName,
  type Pathology,
  type Severity,
} from "@/lib/pathologies";
import { Link } from "@/i18n/navigation";

const severityCopy: Record<Loc, Record<Severity, string>> = {
  vi: { info: "Theo dõi", warning: "Cảnh báo", critical: "Nghiêm trọng" },
  en: { info: "Informational", warning: "Warning", critical: "Critical" },
  zh: { info: "信息", warning: "警告", critical: "严重" },
};

const severityFilters: { key: "all" | Severity; vi: string; en: string; zh: string }[] = [
  { key: "all", vi: "Tất cả mức độ", en: "All levels", zh: "所有级别" },
  { key: "info", vi: "Theo dõi", en: "Informational", zh: "信息" },
  { key: "warning", vi: "Cảnh báo", en: "Warning", zh: "警告" },
  { key: "critical", vi: "Nghiêm trọng", en: "Critical", zh: "严重" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function PathologyLibrary({ locale }: { locale: Loc }) {
  const [items, setItems] = useState<Pathology[]>([]);
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState("all");
  const [severity, setSeverity] = useState<"all" | Severity>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pathology | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    fetchPathologies().then(setItems).finally(() => setLoading(false));
    Promise.resolve().then(() => {
      try { setBookmarks(JSON.parse(localStorage.getItem("soma3d-pathology-bookmarks") ?? "[]")); } catch { setBookmarks([]); }
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  const systems = useMemo(
    () => Array.from(new Map(items.filter((p) => p.structure.system).map((p) => [p.structure.system!.code, systemName(p, locale)])).entries()),
    [items, locale],
  );

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    return items.filter((p) => {
      const haystack = normalize([
        p.nameVi, p.nameEn, p.nameZh, p.latin, p.icdCode,
        structureName(p, locale), systemName(p, locale), p.source,
      ].filter(Boolean).join(" "));
      return (system === "all" || p.structure.system?.code === system)
        && (severity === "all" || p.severity === severity)
        && (!savedOnly || bookmarks.includes(p.id))
        && (!needle || haystack.includes(needle));
    });
  }, [items, system, severity, savedOnly, bookmarks, query, locale]);

  const suggestions = query.trim().length > 0
    ? visible.slice(0, 5)
    : [];
  const criticalCount = items.filter((item) => item.severity === "critical").length;
  const sourcedCount = items.filter((item) => item.source || item.citations?.length).length;

  function toggleBookmark(id: string) {
    setBookmarks((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("soma3d-pathology-bookmarks", JSON.stringify(next));
      return next;
    });
  }

  const t = locale === "vi"
    ? { eyebrow: "THƯ VIỆN LÂM SÀNG", title: "Tra cứu bệnh lý", lead: "Tìm kiếm theo bệnh, mã phân loại và hệ cơ quan; đối chiếu trực tiếp với cấu trúc giải phẫu 3D.", search: "Tên bệnh, triệu chứng, Latin hoặc ICD-10 / ICD-11", all: "Tất cả hệ", result: "kết quả", source: "Nguồn y khoa", linked: "Cấu trúc liên quan", empty: "Không có bệnh lý phù hợp với bộ lọc.", loading: "Đang tải dữ liệu bệnh lý…", saved: "Đã lưu", detail: "Hồ sơ bệnh học", overview: "Tổng quan", clinical: "Lâm sàng & cận lâm sàng", imaging: "Chẩn đoán hình ảnh", progression: "Tiến triển & biến chứng", treatment: "Điều trị tham khảo", coverage: "Mức độ hoàn thiện hồ sơ", pending: "Chờ dữ liệu kiểm chứng", unavailable: "Chưa có dữ liệu đã kiểm chứng trong thư viện.", view3d: "Xem cấu trúc 3D", close: "Đóng" }
    : locale === "zh"
      ? { eyebrow: "临床资料库", title: "病理检索", lead: "按疾病、分类代码和器官系统搜索，并与三维解剖结构对照。", search: "疾病、症状、拉丁名或 ICD-10 / ICD-11", all: "所有系统", result: "项结果", source: "医学来源", linked: "相关结构", empty: "没有符合筛选条件的病理。", loading: "正在加载病理数据…", saved: "已收藏", detail: "病理档案", overview: "概述", clinical: "临床与实验室", imaging: "医学影像", progression: "进展与并发症", treatment: "参考治疗", coverage: "档案完整度", pending: "等待核实资料", unavailable: "资料库中暂无经核实的数据。", view3d: "查看三维结构", close: "关闭" }
      : { eyebrow: "CLINICAL LIBRARY", title: "Pathology lookup", lead: "Search by disease, classification code and organ system, then correlate with 3D anatomy.", search: "Disease, symptom, Latin or ICD-10 / ICD-11", all: "All systems", result: "results", source: "Medical source", linked: "Related structure", empty: "No conditions match the selected filters.", loading: "Loading pathology data…", saved: "Saved", detail: "Pathology profile", overview: "Overview", clinical: "Clinical & laboratory", imaging: "Diagnostic imaging", progression: "Progression & complications", treatment: "Treatment reference", coverage: "Record completeness", pending: "Awaiting verified data", unavailable: "No verified data is available in the library yet.", view3d: "View 3D structure", close: "Close" };

  return <main className="pathology-page">
    <header className="pathology-hero">
      <span>{t.eyebrow}</span>
      <div><h1>{t.title}</h1><p>{t.lead}</p></div>
      <aside><b>{visible.length}</b><small>{t.result}</small></aside>
    </header>

    <section className="clinical-summary-strip" aria-label={locale === "vi" ? "Tổng quan thư viện" : "Library overview"}>
      <div><small>{locale === "vi" ? "Hồ sơ hiện có" : "Available records"}</small><strong>{String(items.length).padStart(2, "0")}</strong></div>
      <div><small>{locale === "vi" ? "Có nguồn tham khảo" : "With references"}</small><strong>{String(sourcedCount).padStart(2, "0")}</strong></div>
      <div><small>{locale === "vi" ? "Mức nghiêm trọng" : "Critical priority"}</small><strong>{String(criticalCount).padStart(2, "0")}</strong></div>
      <p>{locale === "vi" ? "Nội dung phục vụ học tập và tra cứu, không thay thế chẩn đoán hoặc chỉ định điều trị." : "Educational reference only; not a substitute for diagnosis or treatment."}</p>
    </section>

    <section className="pathology-tools">
      <div className="pathology-search-row">
        <div className="clinical-search">
          <label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label>
          {suggestions.length > 0 && <div className="clinical-suggestions">
            {suggestions.map((item) => <button key={item.id} onClick={() => { setSelected(item); setQuery(pathologyName(item, locale)); }}><strong>{pathologyName(item, locale)}</strong><small>{item.icdCode || structureName(item, locale)}</small></button>)}
          </div>}
        </div>
        <Link href="/tai-lieu-y-khoa" className="knowledge-link">{locale === "vi" ? "Tra cứu nguồn" : locale === "zh" ? "查阅来源" : "Search sources"} ↗</Link>
      </div>
      <div className="clinical-filter-groups">
        <div className="system-filters"><button className={system === "all" ? "active" : ""} onClick={() => setSystem("all")}>{t.all}</button>{systems.map(([key, name]) => <button key={key} className={system === key ? "active" : ""} onClick={() => setSystem(key)}>{name}</button>)}</div>
        <div className="system-filters severity-filters">{severityFilters.map((filter) => <button key={filter.key} className={severity === filter.key ? "active" : ""} onClick={() => setSeverity(filter.key)}>{filter[locale]}</button>)}</div>
        <button className={`saved-filter${savedOnly ? " active" : ""}`} onClick={() => setSavedOnly((value) => !value)}>♡ {t.saved} ({bookmarks.length})</button>
      </div>
    </section>

    {!loading && visible.length > 0 && <div className="pathology-list-head"><span>№</span><span>{locale === "vi" ? "Bệnh lý / thuật ngữ" : "Condition / terminology"}</span><span>ICD</span><span>{locale === "vi" ? "Hệ & cấu trúc" : "System & structure"}</span><span>{locale === "vi" ? "Mức độ" : "Priority"}</span><span>{locale === "vi" ? "Bằng chứng" : "Evidence"}</span></div>}
    {loading ? <div className="pathology-skeleton" aria-label={t.loading}>{[0, 1, 2, 3].map((item) => <div key={item}><i /><span /><b /></div>)}</div> : visible.length === 0 ? <div className="pathology-state">{t.empty}</div> : <section className="pathology-grid">{visible.map((p, i) => {
      const sev = (p.severity ?? "info") as Severity;
      const saved = bookmarks.includes(p.id);
      return <article className={`pathology-card severity-${sev}`} key={p.id} onClick={() => setSelected(p)}>
        <div className="path-card-top"><span className="path-index">{String(i + 1).padStart(2, "0")}</span><span className="severity-badge"><i />{severityCopy[locale][sev]}</span><button className={`path-bookmark${saved ? " saved" : ""}`} aria-label={t.saved} onClick={(event) => { event.stopPropagation(); toggleBookmark(p.id); }}>{saved ? "♥" : "♡"}</button></div>
        <div className="path-card-body"><div className="path-name"><p className="path-system">{systemName(p, locale) ?? t.linked}</p><h2>{pathologyName(p, locale)}</h2>{p.latin && <em>{p.latin}</em>}</div><div className="path-code"><small>ICD-10 / ICD-11</small><b>{p.icdCode || "—"}</b></div><div className="path-structure"><small>{t.linked}</small><b>{structureName(p, locale)}</b></div><div className={`path-priority priority-${sev}`}><i />{severityCopy[locale][sev]}</div><div className="path-evidence"><span>{p.citations?.some((citation) => citation.verified) ? (locale === "vi" ? "Đã thẩm định" : locale === "zh" ? "已审核" : "Verified") : (locale === "vi" ? "Có nguồn" : locale === "zh" ? "有来源" : "Sourced")}</span><small>{p.source}</small></div></div>
        <footer><span>{locale === "vi" ? "Mở hồ sơ" : "Open record"} →</span></footer>
      </article>;
    })}</section>}

    {selected && <div className="pathology-drawer-backdrop" onClick={() => setSelected(null)}>
      <aside className="pathology-drawer" onClick={(event) => event.stopPropagation()} data-lenis-prevent>
        <header><div><small>{t.detail}</small><h2>{pathologyName(selected, locale)}</h2>{selected.latin && <em>{selected.latin}</em>}</div><button onClick={() => setSelected(null)} aria-label={t.close}>×</button></header>
        <div className="drawer-tags"><span>{severityCopy[locale][(selected.severity ?? "info") as Severity]}</span><span>{selected.icdCode || "ICD —"}</span><span>{systemName(selected, locale)}</span></div>
        <section><h3>{t.overview}</h3><p>{selected.descriptionVi || t.unavailable}</p></section>
        <section className="clinical-coverage"><h3>{t.coverage}</h3><div>{[t.clinical, t.imaging, t.progression, t.treatment].map((heading) => <p key={heading}><span>{heading}</span><small>{t.pending}</small></p>)}</div></section>
        <section className="drawer-source"><h3>{t.source}</h3><cite>{selected.source}</cite>{selected.citations?.map((citation) => <a key={citation.id} href={citation.source.url} target="_blank" rel="noreferrer">{citation.source.title} ↗</a>)}</section>
        <div className="drawer-actions"><button onClick={() => toggleBookmark(selected.id)}>{bookmarks.includes(selected.id) ? "♥" : "♡"} {t.saved}</button><Link href={`/viewer?structure=${encodeURIComponent(selected.structure.code)}&pathology=${selected.id}`}>{t.view3d} ↗</Link></div>
      </aside>
    </div>}
  </main>;
}
