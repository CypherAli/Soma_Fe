"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import { fetchPathologies, pathologyName, type Pathology, type Severity } from "@/lib/pathologies";
import type { Loc } from "@/lib/homeContent";

/**
 * Bảng bệnh lý của cấu trúc đang chọn.
 *
 * Chọn cấu trúc khác thì phải XOÁ SẠCH trạng thái cũ. Cách làm cũ là gọi
 * `setItems([])` ngay trong thân effect — vừa bị lint chặn (đặt state đồng bộ
 * trong effect làm render dây chuyền), vừa để hở một lỗi thật: lượt tải của
 * cấu trúc A về muộn sẽ ghi đè lên danh sách của cấu trúc B.
 *
 * Nay tách phần có state ra thành component riêng và gắn `key` theo id cấu
 * trúc, đúng cách React khuyến nghị để đặt lại toàn bộ state — đổi cấu trúc là
 * component cũ bị huỷ, không còn gì phải dọn bằng tay. Lượt tải cũ cũng bị cờ
 * `alive` chặn lại nên không ghi đè được nữa.
 */
export default function ViewerPathologyPanel() {
  const selected = useAnatomyStore((s) => s.selected);
  if (!selected) return null;
  return <PathologyList key={selected.id} structureId={selected.id} />;
}

function PathologyList({ structureId }: { structureId: string }) {
  const locale = useLocale() as Loc;
  const toggleIsolate = useAnatomyStore((s) => s.toggleIsolate);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);
  const [items, setItems] = useState<Pathology[]>([]);
  // Khởi tạo bằng true: component chỉ được gắn khi đã có cấu trúc để tra, nên
  // lượt tải luôn bắt đầu ngay — không cần setLoading(true) trong thân effect.
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPathologies(structureId)
      .then((list) => { if (alive) setItems(list); })
      .catch(() => { if (alive) setItems([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [structureId]);

  const t = locale === "vi" ? { title:"Bệnh lý liên quan", empty:"Cấu trúc này chưa có bệnh lý được gắn.", loading:"Đang đối chiếu thư viện…", source:"Nguồn", highlight:"Làm nổi bật cấu trúc", active:"Đang làm nổi bật" } : locale === "zh" ? { title:"相关病理", empty:"此结构尚未关联病理。", loading:"正在查询资料库…", source:"来源", highlight:"突出显示结构", active:"正在突出显示" } : { title:"Related pathology", empty:"No pathology is linked to this structure yet.", loading:"Checking the clinical library…", source:"Source", highlight:"Highlight structure", active:"Structure highlighted" };

  return <section className="viewer-pathology">
    <div className="vp-title"><span>{t.title}</span><b>{items.length}</b></div>
    {loading ? <p className="vp-empty">{t.loading}</p> : items.length === 0 ? <p className="vp-empty">{t.empty}</p> : <div className="vp-list">{items.map((p) => {
      const sev = (p.severity ?? "info") as Severity;
      const expanded = open === p.id;
      return <article key={p.id} className={`vp-item severity-${sev}`}>
        <button type="button" className="vp-item-head" onClick={()=>setOpen(expanded ? null : p.id)}><i/><span><strong>{pathologyName(p,locale)}</strong><small>{p.icdCode ? `ICD-11 · ${p.icdCode}` : "ICD-11 · —"}</small></span><b>{expanded ? "−" : "+"}</b></button>
        {expanded && <div className="vp-detail">{p.descriptionVi && <p>{p.descriptionVi}</p>}<button type="button" onClick={()=>toggleIsolate(structureId)}>{isolatedId === structureId ? t.active : t.highlight} <span>⌖</span></button><footer><small>{t.source}</small><cite>{p.source}</cite></footer></div>}
      </article>;
    })}</div>}
  </section>;
}
