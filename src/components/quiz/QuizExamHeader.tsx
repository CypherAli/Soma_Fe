"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import type { Loc } from "@/lib/homeContent";
import {
  drLamCatalog,
  type DrLamEntry,
  type drLamScore,
} from "@/lib/anatomy/drLamBank";
import { quizExamTitle } from "./quizTopics";
import QuizTopicIcon from "./QuizTopicIcon";

export default function QuizExamHeader({
  locale,
  entry,
  showCover,
  completed,
  sidebar,
  finished,
  score,
  percent,
  elapsed,
  onBack,
  onToggleSidebar,
}: {
  locale: Loc;
  entry: DrLamEntry;
  showCover: boolean;
  completed: string[];
  sidebar: boolean;
  finished: boolean;
  score: ReturnType<typeof drLamScore>;
  percent: number;
  elapsed: number;
  onBack: () => void;
  onToggleSidebar: () => void;
}) {
  const cmsContent = useContent();
  const drLamCatalog = cmsContent.resolve(cmsSourcedrLamCatalog());

  const word = (vi: string, en: string, zh: string) =>
    locale === "vi" ? vi : locale === "zh" ? zh : en;
  const title = quizExamTitle(entry);
  const duration = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  return <ContentSurface scope="src/components/quiz/QuizExamHeader.tsx">{(
    <section className="dl-exam-hero">
      <div className="dl-exam-toolbar">
        <button
          className="dl-course-back"
          onClick={() => onBack()}
          type="button"
          aria-label={word("Tất cả bộ đề", "All question sets", "全部题库")}
        >
          ←
        </button>
        <span>
          {word("Đại học Y Hà Nội", "Hanoi Medical University", "河内医科大学")}
        </span>
        <small>
          {completed.length}/{drLamCatalog.exams.length}{" "}
          {word("đề hoàn thành", "sets completed", "套已完成")}
        </small>
        <button
          className="dl-menu-toggle"
          onClick={() => onToggleSidebar()}
          aria-expanded={sidebar}
          aria-controls="dl-catalog"
          type="button"
        >
          <QuizTopicIcon name="grid" />
          <span>{word("Đổi bộ đề", "Change set", "切换题库")}</span>
        </button>
      </div>
      <div className="dl-exam-summary">
        <div className="dl-exam-heading">
          {showCover && entry.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="dl-cover"
              src={entry.cover}
              alt={word(
                "Hình từ bộ đề này",
                "Illustration from this question set",
                "本题库插图",
              )}
            />
          )}
          <div>
            <h1>{title}</h1>
            <p>
              {entry.count} {word("câu hỏi", "questions", "题")}
              {entry.illustratedCount > 0 &&
                ` · ${entry.illustratedCount} ${word("câu có hình minh họa", "illustrated questions", "题带插图")}`}
            </p>
          </div>
        </div>
        {finished && (
          <section
            className="dl-result"
            aria-label={word("Kết quả bài thi", "Exam result", "考试结果")}
          >
            <div className="dl-result-head">
              <b>{word("Kết quả bài thi", "Exam result", "考试结果")}</b>
              <span>{duration(elapsed)}</span>
            </div>
            <strong>
              {percent}%{" "}
              <small>
                ({score.correct}/{score.total})
              </small>
            </strong>
            <span className="dl-eyebrow">
              {word("TỈ LỆ CHÍNH XÁC", "ACCURACY", "正确率")}
            </span>
            <progress
              max={Math.max(score.total, 1)}
              value={score.correct}
              aria-label={word("Tỉ lệ chính xác", "Accuracy", "正确率")}
            />
            <div className="dl-result-counts">
              <span className="correct">
                <b>{score.correct}</b>
                {word("Đúng", "Correct", "正确")}
              </span>
              <span className="wrong">
                <b>{score.wrong}</b>
                {word("Sai", "Wrong", "错误")}
              </span>
              <span>
                <b>{score.skipped}</b>
                {word("Bỏ qua", "Skipped", "未答")}
              </span>
            </div>
            {!!score.ungraded && (
              <p>
                {score.ungraded}{" "}
                {word(
                  "câu chưa có khóa, không tính điểm",
                  "items without keys, excluded from score",
                  "题无答案，不计分",
                )}
              </p>
            )}
          </section>
        )}
      </div>
    </section>
  )}</ContentSurface>;
}

function cmsSourcedrLamCatalog() { return drLamCatalog; }
