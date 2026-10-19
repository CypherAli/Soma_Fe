"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useState } from "react";
import QuizTopicIcon from "./QuizTopicIcon";
import AtlasIcon from "@/components/explore/AtlasIcon";
import { drLamCatalog } from "@/lib/anatomy/drLamBank";
import type { Loc } from "@/lib/homeContent";
import { quizMatchesQuery, QUIZ_TOPICS, quizExamTitle } from "./quizTopics";

export default function QuizLibrary({
  locale,
  onSelect,
  onOtherSources,
  completed,
}: {
  locale: Loc;
  onSelect: (id: string) => void;
  onOtherSources: () => void;
  completed: string[];
}) {
  const cmsContent = useContent();
  const QUIZ_TOPICS = cmsContent.resolve(cmsSourceQUIZ_TOPICS());
  const drLamCatalog = cmsContent.resolve(cmsSourcedrLamCatalog());

  const word = (vi: string, en: string, zh: string) =>
    locale === "vi" ? vi : locale === "zh" ? zh : en;
  const [topic, setTopic] = useState("all");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const topicName = (id: string) => {
    const t = QUIZ_TOPICS.find((t) => t.id === id);
    return t
      ? word(t.label, t.en, t.zh)
      : word("Tất cả bộ đề", "All question sets", "全部题库");
  };
  const matchesKind = (id: string) =>
    kind === "all" ||
    (kind === "regions"
      ? !["mock", "review", "clinical"].includes(id)
      : id === kind);
  const entries = drLamCatalog.exams
    .filter(
      (e) =>
        (topic === "all" || topic === e.topic) &&
        matchesKind(e.topic) &&
        quizMatchesQuery(
          `${quizExamTitle(e)} ${e.title} ${topicName(e.topic)}`,
          query,
        ),
    )
    .sort(
      (a, b) =>
        QUIZ_TOPICS.findIndex((t) => t.id === a.topic) -
        QUIZ_TOPICS.findIndex((t) => t.id === b.topic),
    );
  const selectKind = (id: string) => {
    setKind(id);
    setTopic("all");
  };

  return <ContentSurface scope="src/components/quiz/QuizLibrary.tsx">{(
    <section
      className="dl-quiz dl-library"
      aria-label={word(
        "Bộ đề Đại học Y Hà Nội",
        "Hanoi Medical University question bank",
        "河内医科大学题库",
      )}
    >
      <main className="dl-library-inner">
        <header className="dl-library-hero">
          <div>
            <span className="dl-institution">
              {word(
                "Đại học Y Hà Nội",
                "Hanoi Medical University",
                "河内医科大学",
              )}
            </span>
            <h1>
              {word(
                "Trắc nghiệm giải phẫu",
                "Anatomy question bank",
                "解剖学题库",
              )}
            </h1>
            <p>
              {word(
                "Học theo vùng cơ thể, ôn tập tổng hợp và luyện đề thi. Có hình minh họa từ tài liệu gốc.",
                "Study by body region, review anatomy and practice exams with illustrations from the source documents.",
                "按身体区域学习、综合复习与模拟考试，配有原文插图。",
              )}
            </p>
          </div>
          <div className="dl-library-stats">
            <div>
              <b>30</b>
              <span>{word("bộ đề", "question sets", "套试题")}</span>
            </div>
            <div>
              <b>2.810</b>
              <span>{word("câu hỏi", "questions", "道题")}</span>
            </div>
            <div>
              <b>{completed.length}/30</b>
              <span>{word("đã hoàn thành", "completed", "已完成")}</span>
            </div>
          </div>
        </header>

        <div className="dl-library-toolbar">
          <nav
            aria-label={word("Hình thức ôn tập", "Study format", "学习模式")}
          >
            {[
              { id: "all", title: word("Tất cả", "All", "全部") },
              {
                id: "regions",
                title: word("Theo vùng", "By region", "按区域"),
              },
              { id: "clinical", title: word("Lâm sàng", "Clinical", "临床") },
              { id: "review", title: word("Ôn tập", "Review", "复习") },
              { id: "mock", title: word("Thi thử", "Mock exams", "模拟考试") },
            ].map((k) => (
              <button
                type="button"
                key={k.id}
                className={kind === k.id ? "active" : ""}
                aria-pressed={kind === k.id}
                onClick={() => selectKind(k.id)}
              >
                {k.title}
              </button>
            ))}
          </nav>
          <label className="dl-library-search">
            <AtlasIcon id="i-search" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={word(
                "Tìm vùng giải phẫu hoặc tên đề",
                "Search a region or question set",
                "搜索区域或试卷",
              )}
              aria-label={word("Tìm bộ đề", "Search question sets", "搜索题库")}
            />
          </label>
        </div>

        <div className="dl-library-layout">
          <aside
            className="dl-topics"
            aria-label={word("Phân loại đề", "Question categories", "题库分类")}
          >
            <h2>{word("CHỦ ĐỀ", "TOPICS", "主题")}</h2>
            <button
              type="button"
              className={topic === "all" ? "active" : ""}
              onClick={() => setTopic("all")}
              aria-pressed={topic === "all"}
            >
              <QuizTopicIcon name="grid" />
              <span>
                {word("Tất cả bộ đề", "All question sets", "全部题库")}
              </span>
              <small>
                {drLamCatalog.exams.filter((e) => matchesKind(e.topic)).length}
              </small>
            </button>
            {QUIZ_TOPICS.filter((t) => matchesKind(t.id)).map((t) => (
              <button
                key={t.id}
                type="button"
                className={topic === t.id ? "active" : ""}
                aria-pressed={topic === t.id}
                onClick={() => setTopic(t.id)}
              >
                <QuizTopicIcon name={t.icon} />
                <span>{topicName(t.id)}</span>
                <small>
                  {drLamCatalog.exams.filter((e) => e.topic === t.id).length}
                </small>
              </button>
            ))}
            <div className="dl-topic-note">
              <QuizTopicIcon name="book" />
              <p>
                {word(
                  "Luyện tập có hình và giải thích. Thi thử có thời gian, xem đáp án sau khi nộp.",
                  "Practice with illustrations and explanations. Timed exams reveal answers after submission.",
                  "练习配有插图和解释；限时考试提交后显示答案。",
                )}
              </p>
            </div>
          </aside>
          <section className="dl-set-collection" aria-label={topicName(topic)}>
            <div className="dl-collection-heading">
              <h2>
                {topic === "all" && kind !== "all"
                  ? word(
                      kind === "regions"
                        ? "Giải phẫu theo vùng"
                        : kind === "mock"
                          ? "Đề thi thử"
                          : kind === "review"
                            ? "Ôn tập tổng hợp"
                            : "Ca lâm sàng",
                      kind === "mock"
                        ? "Mock exams"
                        : kind === "review"
                          ? "Review sets"
                          : kind === "clinical"
                            ? "Clinical cases"
                            : "Anatomy by region",
                      kind === "mock"
                        ? "模拟试卷"
                        : kind === "review"
                          ? "综合复习"
                          : kind === "clinical"
                            ? "临床案例"
                            : "区域解剖学",
                    )
                  : topicName(topic)}
              </h2>
              <span>
                {entries.length} {word("bộ đề", "sets", "套题")}
              </span>
            </div>
            <div className="dl-set-grid">
              {entries.map((e) => {
                const icon = QUIZ_TOPICS.find((t) => t.id === e.topic)?.icon;
                return (
                  <button
                    type="button"
                    key={e.id}
                    className="dl-set-card"
                    onClick={() => onSelect(e.id)}
                    aria-label={`${quizExamTitle(e)} · ${e.count} ${word("câu hỏi", "questions", "题")}`}
                  >
                    <span
                      className={`dl-set-cover${e.cover ? "" : " no-figure"}`}
                    >
                      {e.cover ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={e.cover} alt="" loading="lazy" />
                        </>
                      ) : (
                        <QuizTopicIcon name={icon} />
                      )}
                    </span>
                    <span className="dl-set-info">
                      <small>{topicName(e.topic)}</small>
                      <strong>{quizExamTitle(e)}</strong>
                      <span className="dl-set-meta">
                        <span>
                          {e.count} {word("câu hỏi", "questions", "题")}
                        </span>
                        {e.illustratedCount > 0 && (
                          <span>
                            {e.illustratedCount}{" "}
                            {word("câu có hình", "illustrated", "题带图")}
                          </span>
                        )}
                      </span>
                      <span
                        className={`dl-set-open${completed.includes(e.id) ? " complete" : ""}`}
                      >
                        {completed.includes(e.id)
                          ? word(
                              "Đã hoàn thành · xem lại",
                              "Completed · review",
                              "已完成 · 查看",
                            )
                          : word("Mở bộ đề", "Open set", "打开题库")}
                        <span aria-hidden="true">↗</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {!entries.length && (
              <div className="dl-empty">
                <h3>
                  {word("Không tìm thấy bộ đề", "No sets found", "未找到题库")}
                </h3>
                <p>
                  {word(
                    "Thử tên vùng giải phẫu hoặc xóa bộ lọc đang chọn.",
                    "Try a body region or clear the filters.",
                    "请尝试搜索身体区域或清除筛选。",
                  )}
                </p>
                <button
                  className="dl-button primary"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setKind("all");
                    setTopic("all");
                  }}
                >
                  {word("Xóa bộ lọc", "Clear filters", "清除筛选")}
                </button>
              </div>
            )}
          </section>
        </div>
        <footer className="dl-library-footer">
          <span>
            {word(
              "Nội dung được nhập từ 30 tài liệu PDF.",
              "Imported from 30 PDF documents.",
              "内容导入自 30 份 PDF 文档。",
            )}
          </span>
          <button type="button" onClick={onOtherSources}>
            {word(
              "Mô hình 3D & các nguồn học khác",
              "3D models & other study sources",
              "3D 模型与其他学习资源",
            )}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </footer>
      </main>
    </section>
  )}</ContentSurface>;
}

function cmsSourceQUIZ_TOPICS() { return QUIZ_TOPICS; }
function cmsSourcedrLamCatalog() { return drLamCatalog; }
