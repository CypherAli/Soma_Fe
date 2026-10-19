"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import { API_URL } from "@/lib/auth";
import { pathologyContent, fetchPathologies, pathologyName, type Pathology, type Severity } from "@/lib/pathologies";
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
  return <ContentSurface scope="src/components/pathology/ViewerPathologyPanel.tsx"><PathologyList key={selected.id} structureId={selected.id} /></ContentSurface>;
}

function PathologyList({ structureId }: { structureId: string }) {
  const locale = useLocale() as Loc;
  const toggleIsolate = useAnatomyStore((s) => s.toggleIsolate);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);
  const [items, setItems] = useState<Pathology[]>([]);
  // Khởi tạo bằng true: component chỉ được gắn khi đã có cấu trúc để tra, nên
  // lượt tải luôn bắt đầu ngay — không cần setLoading(true) trong thân effect.
  const [loading, setLoading] = useState(true);
  const focusedPathologyId = useAnatomyStore((s) => s.focusedPathologyId);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    // Khi đến từ deep link, selection là TÊN MESH tổn thương chứ không phải mã
    // cấu trúc, nên tra theo structureId sẽ ra rỗng. Lấy thẳng bệnh theo id.
    const load = focusedPathologyId
      ? fetch(`${API_URL}/pathologies/${encodeURIComponent(focusedPathologyId)}`)
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((one: Pathology) => ({ items: [one] }))
          .catch(() => fetchPathologies(structureId))
      : fetchPathologies(structureId);
    load
      .then((result) => {
        if (!alive) return;
        setItems(result.items);
        // Mở sẵn đúng bệnh vừa bấm sang từ trang Bệnh lý. Không có bước này thì
        // người dùng rơi vào danh sách đóng và phải tự dò lại bệnh mình vừa xem.
        if (focusedPathologyId && result.items.some((x) => x.id === focusedPathologyId)) {
          setOpen(focusedPathologyId);
        }
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [structureId, focusedPathologyId]);

  const t = locale === "vi" ? { title:"Bệnh lý liên quan", empty:"Cấu trúc này chưa có bệnh lý được gắn.", loading:"Đang đối chiếu thư viện…", source:"Nguồn", highlight:"Làm nổi bật cấu trúc", active:"Đang làm nổi bật", pending:"Chưa có phần bệnh học chi tiết — xem nguồn bên dưới.", noTranslation:"Chưa có bản dịch — đang hiển thị nguyên văn tiếng Việt.", machine:"Bản dịch máy, chưa qua thẩm định chuyên môn.", sec:{overview:"Tổng quan",clinical:"Lâm sàng",imaging:"Hình ảnh",progression:"Tiến triển",treatment:"Điều trị"} } : locale === "zh" ? { title:"相关病理", empty:"此结构尚未关联病理。", loading:"正在查询资料库…", source:"来源", highlight:"突出显示结构", active:"正在突出显示", pending:"详细病理内容尚未撰写——请参见下方来源。", noTranslation:"尚无译文——此处显示越南语原文。", machine:"机器翻译，尚未经专业人员审核。", sec:{overview:"概述",clinical:"临床",imaging:"影像",progression:"进展",treatment:"治疗"} } : { title:"Related pathology", empty:"No pathology is linked to this structure yet.", loading:"Checking the clinical library…", source:"Source", highlight:"Highlight structure", active:"Structure highlighted", pending:"Detailed pathology not written yet — see the source below.", noTranslation:"Not translated yet — showing the Vietnamese original.", machine:"Machine translation, not reviewed by a clinician.", sec:{overview:"Overview",clinical:"Clinical",imaging:"Imaging",progression:"Progression",treatment:"Treatment"} };

  return <ContentSurface scope="src/components/pathology/ViewerPathologyPanel.tsx"><section className="viewer-pathology">
    <div className="vp-title"><span>{t.title}</span><b>{items.length}</b></div>
    {loading ? <p className="vp-empty">{t.loading}</p> : items.length === 0 ? <p className="vp-empty">{t.empty}</p> : <div className="vp-list">{items.map((p) => {
      const sev = (p.severity ?? "info") as Severity;
      const expanded = open === p.id;
      return <article key={p.id} className={`vp-item severity-${sev}`}>
        <button type="button" className="vp-item-head" onClick={()=>setOpen(expanded ? null : p.id)}><i/><span><strong>{pathologyName(p,locale)}</strong><small>{p.icdCode ? `ICD-10 · ${p.icdCode}` : "ICD-10 · —"}</small></span><b>{expanded ? "−" : "+"}</b></button>
        {expanded && (() => {
          const c = pathologyContent(p, locale);
          const parts = ([["overview", c?.description], ["clinical", c?.clinical], ["imaging", c?.imaging], ["progression", c?.progression], ["treatment", c?.treatment]] as const).filter(([, v]) => v);
          /* Cùng hai cảnh báo với trang Bệnh lý, KHÔNG được bỏ ở đây chỉ vì ngăn
             này hẹp: 212/318 bản ghi nội dung đang là dịch máy, và người đọc
             trong /viewer không có cách nào khác để biết điều đó.
             - chưa dịch -> đang đọc nguyên văn tiếng Việt
             - dịch máy  -> đúng ngôn ngữ nhưng chưa ai chuyên môn duyệt */
          const untranslated = locale !== "vi" && c?.locale === "vi";
          return <div className="vp-detail">
            {untranslated && <p className="vp-warn">{t.noTranslation}</p>}
            {c?.machineTranslated === true && <p className="vp-warn">{t.machine}</p>}
            {parts.length > 0
              ? parts.map(([k, v]) => <div key={k} className="vp-sec"><small>{t.sec[k]}</small><p>{v}</p></div>)
              : <p className="vp-pending">{t.pending}</p>}
            <button type="button" onClick={()=>toggleIsolate(structureId)}>{isolatedId === structureId ? t.active : t.highlight} <span>⌖</span></button>
            <footer><small>{t.source}</small><cite>{p.source}{p.sourcePage ? `, tr. ${p.sourcePage}` : ""}</cite></footer>
          </div>;
        })()}
      </article>;
    })}</div>}
  </section></ContentSurface>;
}
