"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Props = {
  url: string;
  initialPage: number;
  title: string;
  onClose: () => void;
  labels: {
    close: string;
    page: string;
    of: string;
    loading: string;
    error: string;
    zoomIn: string;
    zoomOut: string;
    fitWidth: string;
    openExternal: string;
  };
  externalUrl?: string;
};

const ZOOM_STEP = 0.2;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3.0;

export default function PdfViewer({
  url,
  initialPage,
  title,
  onClose,
  labels,
  externalUrl,
}: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNum, setPageNum] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [loadError, setLoadError] = useState(false);
  const [pageInput, setPageInput] = useState(String(initialPage));
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pageWidth,setPageWidth]=useState<number>();
  const [navOffset, setNavOffset] = useState(96);
  useEffect(()=>{
    const element=canvasRef.current;if(!element)return;
    const observer=new ResizeObserver(entries=>setPageWidth(Math.max(200,entries[0].contentRect.width-32)));
    observer.observe(element);
    const nav = document.querySelector<HTMLElement>(".bd > .nav");
    const syncNav = () => setNavOffset(Math.ceil(nav?.getBoundingClientRect().height ?? 0) + 12);
    syncNav();
    const navObserver = new ResizeObserver(syncNav);
    if (nav) navObserver.observe(nav);
    return()=>{ observer.disconnect(); navObserver.disconnect(); };
  },[]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
      const page=Math.max(1,Math.min(initialPage,n));
      setPageNum(page);
      setPageInput(String(page));
    },
    [initialPage],
  );

  function goPage(n: number) {
    if(!numPages)return;
    const clamped = Math.max(1, Math.min(n, numPages));
    setPageNum(clamped);
    setPageInput(String(clamped));
  }

  function handlePageInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const n = parseInt(pageInput, 10);
      if (!isNaN(n)) goPage(n);
    }
  }

  function zoom(delta: number) {
    setScale((s) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, s + delta)));
  }

  /* Scroll to top of viewer when opening */
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return <ContentSurface scope="src/components/pathology/PdfViewer.tsx">{(
    <section className="pdf-inline" ref={containerRef} style={{scrollMarginTop:navOffset}}>
      {/* Toolbar */}
      <header className="pdf-toolbar" style={{top:navOffset}}>
        <div className="pdf-toolbar-title">
          <strong>{title}</strong>
        </div>

        <nav className="pdf-toolbar-nav">
          <button
            onClick={() => goPage(pageNum - 1)}
            disabled={!numPages || pageNum <= 1}
            aria-label={`${labels.page} ${Math.max(1,pageNum-1)}`}
          >
            ‹
          </button>
          <span className="pdf-page-info">
            <input
              type="text"
              inputMode="numeric"
              disabled={!numPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={handlePageInput}
              onBlur={() => {
                const n = parseInt(pageInput, 10);
                if (!isNaN(n)) goPage(n);
              }}
              aria-label={labels.page}
            />
            <span>
              {labels.of} {numPages || "..."}
            </span>
          </span>
          <button
            onClick={() => goPage(pageNum + 1)}
            disabled={pageNum >= numPages}
            aria-label={`${labels.page} ${pageNum+1}`}
          >
            ›
          </button>
        </nav>

        <div className="pdf-toolbar-zoom">
          <button
            onClick={() => zoom(-ZOOM_STEP)}
            disabled={scale <= ZOOM_MIN}
            aria-label={labels.zoomOut}
          >
            −
          </button>
          <span className="pdf-zoom-pct">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => zoom(ZOOM_STEP)}
            disabled={scale >= ZOOM_MAX}
            aria-label={labels.zoomIn}
          >
            +
          </button>
          <button onClick={() => setScale(1.0)} aria-label={labels.fitWidth}>
            ↔
          </button>
        </div>

        <div className="pdf-toolbar-end">
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="pdf-ext-link"
              aria-label={labels.openExternal}
            >
              ↗
            </a>
          )}
          <button
            className="pdf-close"
            onClick={onClose}
            aria-label={labels.close}
          >
            ✕
          </button>
        </div>
      </header>

      {/* PDF canvas */}
      <div className="pdf-canvas" ref={canvasRef} data-lenis-prevent>
        {loadError ? (
          <div className="pdf-error">{labels.error}</div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={() => setLoadError(true)}
            loading={
              <div className="pdf-loading">
                <div className="pdf-skeleton" />
                <p>{labels.loading}</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNum}
              width={pageWidth}
              scale={scale}
              loading={
                <div className="pdf-loading">
                  <div className="pdf-skeleton" />
                </div>
              }
            />
          </Document>
        )}
      </div>
    </section>
  )}</ContentSurface>;
}
