"use client";




import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { ContentSurface } from "@/components/content/ContentProvider";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { API_URL } from "@/lib/auth";
import type { Loc } from "@/lib/homeContent";

const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

type Source = {
  id: string;
  title: string;
  publisher: string;
  year?: number;
  url: string;
  status: string;
  localFile?: string | null;
};
type Hit = {
  chunkId: string;
  page: number;
  printedPage?:number;
  text: string;
  citation: string;
  source: Source;
};
type PdfTarget = { url: string; page: number; title: string; externalUrl?: string };

const copy = bindContentSource("data:src/components/pathology/MedicalKnowledgePage.tsx#copy", {
  vi: {
    eyebrow: "KHO TÀI LIỆU CÓ DẪN NGUỒN",
    title: "Tra cứu nguồn y khoa",
    lead:
      "Cùng một kho tài liệu cho người biên tập và AI. Mỗi kết quả luôn kèm tài liệu, trang và mã đoạn để kiểm chứng.",
    placeholder: "Ví dụ: chẩn đoán viêm ruột thừa cấp",
    search: "Tra cứu",
    sources: "Danh mục nguồn",
    results: "Kết quả theo trang",
    empty: "Nhập một câu hỏi để tìm trong nội dung PDF đã lập chỉ mục.",
    noResults: "Không tìm thấy đoạn phù hợp trong các tài liệu đã lập chỉ mục. Thử thuật ngữ ngắn hơn hoặc tên cấu trúc.",
    open: "Mở nguồn",
    viewPage: "Xem tại trang",
    viewDoc: "Xem tài liệu",
    downloaded: "Đã lập chỉ mục",
    link: "Nguồn chính thức",
    restricted: "Cần quyền truy cập",
    hasPdf: "Có PDF",
    unavailable: "Không thể kết nối kho tài liệu. Hãy kiểm tra backend.",
    more: "Xem thêm",
    less: "Thu gọn",
    pdf: {
      close: "Đóng",
      page: "Trang",
      of: "/",
      loading: "Đang tải tài liệu...",
      error: "Không thể hiển thị tài liệu PDF. Vui lòng thử lại.",
      zoomIn: "Phóng to",
      zoomOut: "Thu nhỏ",
      fitWidth: "Vừa chiều ngang",
      openExternal: "Mở trong tab mới",
    },
  },
  en: {
    eyebrow: "REFERENCED DOCUMENT LIBRARY",
    title: "Medical source search",
    lead:
      "One evidence library for editors and AI. Every result includes its document, page and stable chunk identifier.",
    placeholder: "Example: acute appendicitis diagnosis",
    search: "Search",
    sources: "Source catalogue",
    results: "Page-level results",
    empty: "Enter a question to search indexed PDF content.",
    noResults: "No matching passages in the indexed documents. Try a shorter term or a structure name.",
    open: "Open source",
    viewPage: "View page",
    viewDoc: "View document",
    downloaded: "Indexed",
    link: "Official source",
    restricted: "Restricted",
    hasPdf: "Has PDF",
    unavailable: "The knowledge service is unavailable. Check the backend.",
    more: "Show more",
    less: "Show less",
    pdf: {
      close: "Close",
      page: "Page",
      of: "of",
      loading: "Loading document...",
      error: "Unable to display the PDF. Please try again.",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fitWidth: "Fit width",
      openExternal: "Open in new tab",
    },
  },
  zh: {
    eyebrow: "附有来源的医学资料库",
    title: "医学资料检索",
    lead: "为编辑人员与 AI 提供统一资料库。每项结果均标明文献、页码和稳定段落编号。",
    placeholder: "例如：急性阑尾炎的诊断",
    search: "检索",
    sources: "资料目录",
    results: "按页显示结果",
    empty: "请输入问题，检索已建立索引的 PDF 内容。",
    noResults: "已建立索引的文档中没有匹配段落。请尝试更短的术语或结构名称。",
    open: "打开来源",
    viewPage: "查看页面",
    viewDoc: "查看文档",
    downloaded: "已建立索引",
    link: "官方来源",
    restricted: "需要访问权限",
    hasPdf: "有PDF",
    unavailable: "无法连接知识库，请检查后端服务。",
    more: "查看更多",
    less: "收起",
    pdf: {
      close: "关闭",
      page: "页码",
      of: "/",
      loading: "正在加载文档...",
      error: "无法显示 PDF 文档，请重试。",
      zoomIn: "放大",
      zoomOut: "缩小",
      fitWidth: "适合宽度",
      openExternal: "在新标签页中打开",
    },
  },
});

/** Trích tên file từ localFile */
function pdfFilename(localFile: string | null | undefined): string | null {
  if (!localFile) return null;
  return localFile.split(/[\\/]/).pop() || null;
}

/** Sắp xếp: nguồn có PDF (downloaded) lên đầu */
function sortSources(sources: Source[]): Source[] {
  return [...sources].sort((a, b) => {
    const aHas = a.localFile ? 1 : 0;
    const bHas = b.localFile ? 1 : 0;
    if (aHas !== bHas) return bHas - aHas;
    return 0; // giữ nguyên thứ tự gốc trong cùng nhóm
  });
}

export default function MedicalKnowledgePage({ locale,initialDocument }: { locale: Loc;initialDocument?:{file:string;page:number;title:string} }) {
  const cmsContent = useContent();
  const copy = cmsContent.resolve(cmsSourcecopy());

  const [sources, setSources] = useState<Source[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [pdfTarget, setPdfTarget] = useState<PdfTarget | null>(()=>initialDocument?{url:`${API_URL}/medical-knowledge/pdf/${encodeURIComponent(initialDocument.file)}`,page:initialDocument.page,title:initialDocument.title}:null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const t = copy[locale] ?? copy.en;

  const sortedSources = useMemo(() => sortSources(sources), [sources]);
  const visibleSources = sourcesExpanded
    ? sortedSources
    : sortedSources.slice(0, 8);

  useEffect(() => {
    fetch(`${API_URL}/medical-knowledge/sources`)
      .then((response) =>
        response.ok ? response.json() : Promise.reject(new Error()),
      )
      .then(setSources)
      .catch(() => setError(t.unavailable));
  }, [t.unavailable]);

  async function search(event: FormEvent) {
    event.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setHits([]);
    setSearched(true);
    setError("");
    setPdfTarget(null);
    try {
      const response = await fetch(
        `${API_URL}/medical-knowledge/search?q=${encodeURIComponent(query)}&limit=12`,
      );
      if (!response.ok) throw new Error();
      setHits((await response.json()).results);
    } catch {
      setError(t.unavailable);
    } finally {
      setLoading(false);
    }
  }

  const openPdf = useCallback(
    (localFile: string | null | undefined, page: number, title: string, externalUrl?: string) => {
      const filename = pdfFilename(localFile);
      if (!filename) {
        if (externalUrl) window.open(externalUrl, "_blank", "noreferrer");
        return;
      }
      setPdfTarget({
        url: `${API_URL}/medical-knowledge/pdf/${encodeURIComponent(filename)}`,
        page,
        title,
        externalUrl,
      });
    },
    [],
  );

  const closePdf = useCallback(() => setPdfTarget(null), []);

  return <ContentSurface scope="src/components/pathology/MedicalKnowledgePage.tsx">{(
    <main className="knowledge-page">
      <header>
        <span>{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.lead}</p>
      </header>
      <form onSubmit={search}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
        />
        <button disabled={loading}>{loading ? "..." : t.search}</button>
      </form>
      {error && <p className="knowledge-error">{error}</p>}
      <div className="knowledge-layout">
        <section>
          <div className="knowledge-section-head">
            <h2>{t.results}</h2>
            <b>{hits.length}</b>
          </div>
          {!hits.length ? (
            <div className="knowledge-empty" role="status">{loading ? t.pdf.loading : searched ? t.noResults : t.empty}</div>
          ) : (
            <div className="knowledge-results">
              {hits.map((hit) => {
                const hasLocal = !!pdfFilename(hit.source.localFile);
                return (
                  <article key={hit.chunkId}>
                    <div>
                      <span>{hit.printedPage?`${t.pdf.page} ${hit.printedPage} · PDF ${hit.page}`:`PDF · ${t.pdf.page} ${hit.page}`}</span>
                      <code>{hit.chunkId}</code>
                    </div>
                    <p>{hit.text}</p>
                    <footer>
                      <cite>{hit.citation}</cite>
                      {hasLocal ? (
                        <button
                          className="knowledge-view-btn"
                          onClick={() =>
                            openPdf(
                              hit.source.localFile,
                              hit.page,
                              hit.source.title,
                              hit.source.url,
                            )
                          }
                        >
                          {t.viewPage} · {hit.page}
                        </button>
                      ) : (
                        <a href={hit.source.url} target="_blank" rel="noreferrer">
                          {t.open} ↗
                        </a>
                      )}
                    </footer>
                  </article>
                );
              })}
            </div>
          )}

          {/* PDF viewer hiện INLINE ngay dưới kết quả, trải dài hết cột */}
          {pdfTarget && (
            <PdfViewer
              key={`${pdfTarget.url}:${pdfTarget.page}`}
              url={pdfTarget.url}
              initialPage={pdfTarget.page}
              title={pdfTarget.title}
              onClose={closePdf}
              labels={t.pdf}
              externalUrl={pdfTarget.externalUrl}
            />
          )}
        </section>
        <aside>
          <div className="knowledge-section-head">
            <h2>{t.sources}</h2>
            <b>{sortedSources.length}</b>
          </div>
          <div className="source-list">
            {visibleSources.map((source) => {
              const hasLocal = !!pdfFilename(source.localFile);
              const Tag = hasLocal ? "button" : "a";
              return (
                <Tag
                  key={source.id}
                  {...(hasLocal
                    ? {
                        type: "button" as const,
                        onClick: () =>
                          openPdf(source.localFile, 1, source.title, source.url),
                      }
                    : {
                        href: source.url,
                        target: "_blank",
                        rel: "noreferrer",
                      })}
                >
                  <span>
                    <i className={`source-status ${source.status}`} />
                    {hasLocal
                      ? t.hasPdf
                      : source.status.includes("restricted")
                        ? t.restricted
                        : t.link}
                  </span>
                  <strong>{source.title}</strong>
                  <small>
                    {source.publisher}
                    {source.year ? ` · ${source.year}` : ""}
                  </small>
                </Tag>
              );
            })}
          </div>
          {sortedSources.length > 8 && (
            <button
              type="button"
              className="source-more"
              onClick={() => setSourcesExpanded((v) => !v)}
            >
              {sourcesExpanded ? t.less : t.more}
            </button>
          )}
        </aside>
      </div>
    </main>
  )}</ContentSurface>;
}

function cmsSourcecopy() { return copy; }
