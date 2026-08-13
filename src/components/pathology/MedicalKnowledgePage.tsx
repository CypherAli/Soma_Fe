"use client";

import { FormEvent, useEffect, useState } from "react";
import { API_URL } from "@/lib/auth";
import type { Loc } from "@/lib/homeContent";

type Source = {
  id: string;
  title: string;
  publisher: string;
  year?: number;
  url: string;
  status: string;
};
type Hit = {
  chunkId: string;
  page: number;
  text: string;
  citation: string;
  source: Source;
};

const copy = {
  vi: {
    eyebrow: "KHO TRI THỨC ĐÃ KIỂM CHỨNG",
    title: "Tra cứu nguồn y khoa",
    lead:
      "Cùng một kho tài liệu cho người biên tập và AI. Mỗi kết quả luôn kèm tài liệu, trang và mã đoạn để kiểm chứng.",
    placeholder: "Ví dụ: chẩn đoán viêm ruột thừa cấp",
    search: "Tra cứu",
    sources: "Danh mục nguồn",
    results: "Kết quả theo trang",
    empty: "Nhập một câu hỏi để tìm trong nội dung PDF đã lập chỉ mục.",
    open: "Mở nguồn",
    downloaded: "Đã lập chỉ mục",
    link: "Nguồn chính thức",
    restricted: "Cần quyền truy cập",
    unavailable: "Không thể kết nối kho tài liệu. Hãy kiểm tra backend.",
  },
  en: {
    eyebrow: "VERIFIED KNOWLEDGE BASE",
    title: "Medical source search",
    lead:
      "One evidence library for editors and AI. Every result includes its document, page and stable chunk identifier.",
    placeholder: "Example: acute appendicitis diagnosis",
    search: "Search",
    sources: "Source catalogue",
    results: "Page-level results",
    empty: "Enter a question to search indexed PDF content.",
    open: "Open source",
    downloaded: "Indexed",
    link: "Official source",
    restricted: "Restricted",
    unavailable: "The knowledge service is unavailable. Check the backend.",
  },
  zh: {
    eyebrow: "经验证的医学知识库",
    title: "医学资料检索",
    lead: "为编辑人员与 AI 提供统一资料库。每项结果均标明文献、页码和稳定段落编号。",
    placeholder: "例如：急性阑尾炎的诊断",
    search: "检索",
    sources: "资料目录",
    results: "按页显示结果",
    empty: "请输入问题，检索已建立索引的 PDF 内容。",
    open: "打开来源",
    downloaded: "已建立索引",
    link: "官方来源",
    restricted: "需要访问权限",
    unavailable: "无法连接知识库，请检查后端服务。",
  },
};

export default function MedicalKnowledgePage({ locale }: { locale: Loc }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = copy[locale] ?? copy.en;

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
    if (!query.trim()) return;
    setLoading(true);
    setError("");
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

  return (
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
        <button disabled={loading}>{loading ? "…" : t.search}</button>
      </form>
      {error && <p className="knowledge-error">{error}</p>}
      <div className="knowledge-layout">
        <section>
          <div className="knowledge-section-head">
            <h2>{t.results}</h2>
            <b>{hits.length}</b>
          </div>
          {!hits.length ? (
            <div className="knowledge-empty">{t.empty}</div>
          ) : (
            <div className="knowledge-results">
              {hits.map((hit) => (
                <article key={hit.chunkId}>
                  <div>
                    <span>PAGE {hit.page}</span>
                    <code>{hit.chunkId}</code>
                  </div>
                  <p>{hit.text}</p>
                  <footer>
                    <cite>{hit.citation}</cite>
                    <a href={hit.source.url} target="_blank" rel="noreferrer">
                      {t.open} ↗
                    </a>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
        <aside>
          <div className="knowledge-section-head">
            <h2>{t.sources}</h2>
            <b>{sources.length}</b>
          </div>
          <div className="source-list">
            {sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.id}
              >
                <span>
                  <i className={`source-status ${source.status}`} />
                  {source.status === "downloaded"
                    ? t.downloaded
                    : source.status.includes("restricted")
                      ? t.restricted
                      : t.link}
                </span>
                <strong>{source.title}</strong>
                <small>
                  {source.publisher}
                  {source.year ? ` · ${source.year}` : ""}
                </small>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
