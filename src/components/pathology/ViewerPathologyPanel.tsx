"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import { fetchPathologies, pathologyName, type Pathology, type Severity } from "@/lib/pathologies";
import type { Loc } from "@/lib/homeContent";

export default function ViewerPathologyPanel() {
  const locale = useLocale() as Loc;
  const selected = useAnatomyStore((s) => s.selected);
  const toggleIsolate = useAnatomyStore((s) => s.toggleIsolate);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);
  const [items, setItems] = useState<Pathology[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setItems([]); setOpen(null);
    if (!selected) return;
    setLoading(true);
    fetchPathologies(selected.id).then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, [selected]);

  const t = locale === "vi" ? { title:"Bệnh lý liên quan", empty:"Cấu trúc này chưa có bệnh lý được gắn.", loading:"Đang đối chiếu thư viện…", source:"Nguồn", highlight:"Làm nổi bật cấu trúc", active:"Đang làm nổi bật" } : locale === "zh" ? { title:"相关病理", empty:"此结构尚未关联病理。", loading:"正在查询资料库…", source:"来源", highlight:"突出显示结构", active:"正在突出显示" } : { title:"Related pathology", empty:"No pathology is linked to this structure yet.", loading:"Checking the clinical library…", source:"Source", highlight:"Highlight structure", active:"Structure highlighted" };
  if (!selected) return null;

  return <section className="viewer-pathology">
    <div className="vp-title"><span>{t.title}</span><b>{items.length}</b></div>
    {loading ? <p className="vp-empty">{t.loading}</p> : items.length === 0 ? <p className="vp-empty">{t.empty}</p> : <div className="vp-list">{items.map((p) => {
      const sev = (p.severity ?? "info") as Severity;
      const expanded = open === p.id;
      return <article key={p.id} className={`vp-item severity-${sev}`}>
        <button type="button" className="vp-item-head" onClick={()=>setOpen(expanded ? null : p.id)}><i/><span><strong>{pathologyName(p,locale)}</strong><small>{p.icdCode ? `ICD-11 · ${p.icdCode}` : "ICD-11 · —"}</small></span><b>{expanded ? "−" : "+"}</b></button>
        {expanded && <div className="vp-detail">{p.descriptionVi && <p>{p.descriptionVi}</p>}<button type="button" onClick={()=>toggleIsolate(selected.id)}>{isolatedId === selected.id ? t.active : t.highlight} <span>⌖</span></button><footer><small>{t.source}</small><cite>{p.source}</cite></footer></div>}
      </article>;
    })}</div>}
  </section>;
}
