"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import { searchHref, searchWeb, type WebSearchItem } from "@/lib/site/siteSearch";
import AnswerText from "@/components/chat/AnswerText";

type Source = { id: string; title: string; detail: string; href: string; meta?: string };
type Answer = { answer: string; sources: Source[]; engine: string };
function readAnswer(value: unknown): Answer {
  if (!value || typeof value !== "object" || !("answer" in value) || typeof value.answer !== "string") {
    throw new Error("Invalid answer");
  }
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.sources) || data.sources.length > 8) throw new Error("Invalid source list");
  const sources = (Array.isArray(data.sources) ? data.sources : []).filter((source): source is Source =>
    !!source && typeof source === "object" && typeof source.title === "string" &&
    typeof source.href === "string" && /^\/(?!\/)/.test(source.href) &&
    typeof source.detail === "string",
  );
  if (sources.length !== data.sources.length) throw new Error("Invalid source list");
  return { answer: value.answer, sources, engine: typeof data.engine === "string" ? data.engine : "lookup" };
}

export default function SiteSearchResults({ locale, initialQuery }: { locale: Loc; initialQuery: string }) {
  const router = useRouter(), inputId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [kind, setKind] = useState<"all" | WebSearchItem["kind"]>("all");
  const [visible, setVisible] = useState(20);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const request = useRef<AbortController | null>(null), generation = useRef(0);
  useEffect(() => () => { request.current?.abort(); }, []);
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      generation.current++; request.current?.abort();
      setQuery(initialQuery); setVisible(20); setAnswer(null); setError(""); setBusy(false);
    });
    return () => { active = false; };
  }, [initialQuery]);
  const text = (vi: string, en: string, zh: string) => pick({ vi, en, zh }, locale);
  const all = useMemo(() => searchWeb(query, locale), [query, locale]);
  const results = kind === "all" ? all : all.filter(item => item.kind === kind);
  const kinds = {
    all: text("Tất cả", "All", "全部"), model: text("Mô hình", "Models", "模型"),
    quiz: text("Bộ đề", "Question sets", "题库"), feature: text("Tính năng", "Features", "功能"),
  };
  function changeQuery(value: string) {
    generation.current++; request.current?.abort();
    setQuery(value); setVisible(20); setAnswer(null); setError(""); setBusy(false);
  }
  async function ask() {
    const question = query.trim();
    if (!question) return;
    request.current?.abort();
    const controller = new AbortController(), current = ++generation.current;
    request.current = controller; setBusy(true); setError(""); setAnswer(null);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale }), signal: controller.signal,
      });
      if (!response.ok) throw new Error("Request failed");
      const result = readAnswer(await response.json());
      if (generation.current === current) setAnswer(result);
    } catch {
      if (!controller.signal.aborted && generation.current === current) {
        setError(text("Chưa nhận được câu trả lời. Bạn vẫn có thể mở các nguồn bên dưới hoặc thử lại.", "No answer yet. You can still open the sources below or try again.", "暂未收到回答，仍可打开下方来源或重试。"));
      }
    } finally {
      if (generation.current === current) setBusy(false);
    }
  }
  return <ContentSurface scope="src/components/search/SiteSearchResults.tsx">{(
    <main className="site-search-page">
      <header className="site-search-heading">
        <span>SOMA ATLAS</span>
        <h1>{text("Tìm trong Soma", "Search Soma", "搜索 Soma")}</h1>
        <p>{text("Mô hình, bộ đề và hướng dẫn sử dụng. Hỏi AI để nhận câu trả lời kèm nguồn.", "Models, question sets and feature guides. Ask AI for an answer with sources.", "搜索模型、题库及使用指南，或获取附来源的 AI 回答。")}</p>
      </header>
      <nav className="site-search-modes" aria-label={text("Cách tra cứu", "Search mode", "检索方式")}>
        <button type="button" aria-pressed={mode === "search"} onClick={() => setMode("search")}>{text("Tìm kiếm", "Search", "搜索")}</button>
        <button type="button" aria-pressed={mode === "ai"} onClick={() => setMode("ai")}>{text("Hỏi AI theo nguồn", "Ask AI with sources", "有据 AI 问答")}</button>
      </nav>
      <form className="site-search-form" onSubmit={event => {
        event.preventDefault();
        if (mode === "ai") void ask(); else if (query.trim()) router.replace(searchHref(query));
      }}>
        <label htmlFor={inputId}>{mode === "ai" ? text("Câu hỏi của bạn", "Your question", "您的问题") : text("Từ khóa", "Keywords", "关键词")}</label>
        <div>
          <input id={inputId} type="search" maxLength={500} value={query} onChange={event => changeQuery(event.target.value)} placeholder={text("Ví dụ: đề giải phẫu chi trên, PDF, đổi mô hình bằng tay trái…", "Example: liver model, PDF tools, left-hand model switching…", "例如：肝脏模型、PDF 工具、手势切换模型…")} />
          <button type="submit" disabled={!query.trim() || (mode === "ai" && busy)}>{busy && mode === "ai" ? text("Đang tra…", "Searching…", "检索中…") : mode === "ai" ? text("Hỏi AI", "Ask AI", "询问 AI") : text("Tìm kiếm", "Search", "搜索")}</button>
        </div>
      </form>
      {mode === "ai" && (
        <section className="site-search-answer" aria-label={text("Câu trả lời theo nguồn", "Source-grounded answer", "有据回答")} aria-busy={busy} aria-live="polite">
          {busy && <p role="status">{text("Đang tìm nguồn phù hợp trong hệ thống…", "Finding relevant sources in Soma…", "正在 Soma 内查找相关来源…")}</p>}
          {error && <p role="alert">{error}</p>}
          {!busy && !answer && !error && <p>{text("Đặt câu hỏi về nội dung hoặc cách dùng Soma. Những thông tin chưa có nguồn sẽ được nói rõ.", "Ask about Soma's content or features. Missing evidence will be stated clearly.", "可询问 Soma 内容或使用方法；缺少依据时会明确说明。")}</p>}
          {answer && <>
            <span className="site-search-engine">{answer.engine === "ai" ? text("AI diễn giải từ nguồn", "AI explanation from sources", "AI 依据来源解释") : text("Nội dung từ nguồn", "Retrieved source material", "检索来源内容")}</span>
            <div className="site-search-answer-text"><AnswerText text={answer.answer} /></div>
            {!!answer.sources.length && <ol className="site-search-sources">
              {answer.sources.map((source, index) => <li key={source.id || `${source.href}:${index}`}><Link href={source.href}>[{index + 1}] {source.title}</Link>{source.meta && <small>{source.meta}</small>}</li>)}
            </ol>}
          </>}
        </section>
      )}
      <section className="site-search-results" aria-label={text("Kết quả trong web", "Website results", "网站结果")}>
        <div className="site-search-results-head">
          <h2>{text("Kết quả trong web", "Website results", "网站结果")} <small>{results.length}</small></h2>
          <nav aria-label={text("Loại kết quả", "Result type", "结果类型")}>
            {(Object.keys(kinds) as (keyof typeof kinds)[]).map(value => <button type="button" key={value} aria-pressed={kind === value} onClick={() => { setKind(value); setVisible(20); }}>{kinds[value]}</button>)}
          </nav>
        </div>
        {!query.trim() ? <p>{text("Nhập tên mô hình, bộ đề hoặc tính năng để bắt đầu.", "Enter a model, question set or feature to begin.", "输入模型、题库或功能名称开始搜索。")}</p> : !results.length ? <p>{text("Chưa có kết quả phù hợp. Thử tên khác hoặc hỏi AI theo nguồn ở trên.", "No matching result. Try another term or ask with sources above.", "暂无匹配结果，请尝试其他名称或在上方获取有据回答。")}</p> :
          <ol className="site-search-list">{results.slice(0, visible).map(item => <li key={item.id}>
            <span>{kinds[item.kind]} · {item.section}</span>
            <h3><Link href={item.href}>{item.title}<span aria-hidden="true">↗</span></Link></h3>
            <p>{item.excerpt.length > 260 ? `${item.excerpt.slice(0, 260)}…` : item.excerpt}</p>
          </li>)}</ol>}
        {results.length > visible && <button className="site-search-more" type="button" onClick={() => setVisible(count => count + 20)}>{text("Xem thêm kết quả", "Show more results", "查看更多结果")}</button>}
      </section>
    </main>
  )}</ContentSurface>;
}
