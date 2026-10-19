"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  drLamCatalog,
  drLamCorrect,
  drLamScore,
  loadDrLamBank,
  type DrLamBank,
  type DrLamQuestion,
} from "@/lib/anatomy/drLamBank";
import { rng, shuffle } from "@/lib/anatomy/random";
import { drLamQuestionFeedback } from "@/lib/anatomy/drLamFeedback";
import type { Loc } from "@/lib/homeContent";
import QuizLibrary from "./QuizLibrary";
import QuizTopicIcon from "./QuizTopicIcon";
import QuizSourceImages from "./QuizSourceImages";
import QuizExamHeader from "./QuizExamHeader";
import QuizConfirmDialog from "./QuizConfirmDialog";
import {
  parseDrLamSaved,
  resumableDrLamSession,
  drLamElapsed,
  completeDrLamAttempt,
  DR_LAM_STORAGE_KEY,
  type DrLamSession as Session,
  type DrLamSaved as Saved,
} from "@/lib/anatomy/drLamSession";
import { quizMatchesQuery, QUIZ_TOPICS, quizExamTitle } from "./quizTopics";
import "./dr-lam-quiz.css";

type Filter = "all" | "correct" | "wrong" | "skipped";
const multipleAnswers = (question: DrLamQuestion) =>
  question.answers.length > 1 || /các đáp án/i.test(question.stem);
function readSaved(): Saved {
  try {
    return parseDrLamSaved(localStorage.getItem(DR_LAM_STORAGE_KEY));
  } catch {
    return { sessions: {}, mistakes: {} };
  }
}

export default function DrLamQuiz({
  locale,
  onOtherSources,
  initialExamId,
}: {
  locale: Loc;
  onOtherSources: () => void;
  initialExamId?: string;
}) {
  const cmsContent = useContent();
  const drLamCatalog = cmsContent.resolve(cmsSourcedrLamCatalog());
  const QUIZ_TOPICS = cmsContent.resolve(cmsSourceQUIZ_TOPICS());

  const word = (vi: string, en: string, zh: string) =>
    locale === "vi" ? vi : locale === "zh" ? zh : en;
  const [examId, setExamId] = useState(initialExamId ?? "de-thi-thu-9");
  const [library, setLibrary] = useState(!initialExamId);
  const [bank, setBank] = useState<DrLamBank | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [numbersOpen, setNumbersOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [saved, setSaved] = useState<Saved>({ sessions: {}, mistakes: {} });
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [view, setView] = useState<"overview" | "questions" | "mistakes">(
    "overview",
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [mix, setMix] = useState(false);
  const [submitPrompt, setSubmitPrompt] = useState(false);
  const [leavePrompt, setLeavePrompt] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const questionRef = useRef<HTMLElement>(null);
  const entry = drLamCatalog.exams.find((e) => e.id === examId)!;

  useEffect(() => {
    const data = readSaved();
    const frame = requestAnimationFrame(() => {
      setSaved(data);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;
    loadDrLamBank(entry)
      .then((value) => {
        if (active) {
          setBank(value);
          setError("");
        }
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Không tải được đề.",
          );
      });
    return () => {
      active = false;
    };
  }, [entry, reload]);

  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    try {
      localStorage.setItem(DR_LAM_STORAGE_KEY, JSON.stringify(saved));
    } catch {
      frame = requestAnimationFrame(() => setStorageError(true));
    }
    return () => cancelAnimationFrame(frame);
  }, [saved, ready]);

  useEffect(() => {
    if (!session) return;
    const tick = () => setElapsed(drLamElapsed(session));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const loaded = bank?.id === examId ? bank : null;
  const questionsById = useMemo(
    () => new Map(loaded?.questions.map((q) => [q.id, q]) ?? []),
    [loaded],
  );
  const sessionOrder = session?.order;
  const sessionExamId = session?.examId;
  const questions = useMemo(() => {
    if (sessionExamId !== examId || !sessionOrder) return [];
    return sessionOrder
      .map((id) => questionsById.get(id))
      .filter((q): q is DrLamQuestion => !!q);
  }, [questionsById, sessionOrder, sessionExamId, examId]);
  const score = useMemo(
    () => drLamScore(questions, session?.picks ?? {}),
    [questions, session?.picks],
  );
  const finished = !!session?.finishedAt;
  const current = questions[session?.index ?? 0];
  const checked =
    !!current && (finished || !!session?.checked.includes(current.id));
  const { reveal, images: figureUrls } = drLamQuestionFeedback(
    current,
    session?.mode,
    checked,
    finished,
  );
  const mistakes = saved.mistakes[examId] ?? [];
  const mistakeQuestions =
    loaded?.questions.filter((q) => mistakes.includes(q.id)) ?? [];
  const stored = saved.sessions[examId];
  const resumable = resumableDrLamSession(loaded, stored);
  const percent = score.total
    ? Math.round((score.correct / score.total) * 100)
    : 0;
  const answeredCount = questions.filter(
    (q) => session?.picks[q.id]?.length,
  ).length;
  const remaining = Math.max(0, questions.length * 45 - elapsed);
  const duration = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const update = useCallback((next: Session) => {
    setSession(next);
    setSaved((prev) => ({
      ...prev,
      sessions: { ...prev.sessions, [next.examId]: next },
    }));
  }, []);

  const finish = useCallback(() => {
    if (!session || session.finishedAt) return;
    const next = { ...session, finishedAt: Date.now() };
    setSession(next);
    setSaved((prev) =>
      completeDrLamAttempt(prev, session, questions, next.finishedAt),
    );
    setSubmitPrompt(false);
    setView("overview");
    setFilter("all");
  }, [session, questions, setSession, setSaved, setSubmitPrompt, setView, setFilter]);

  useEffect(() => {
    if (
      session?.mode !== "exam" ||
      finished ||
      !questions.length ||
      remaining > 0
    )
      return;
    const frame = requestAnimationFrame(finish);
    return () => cancelAnimationFrame(frame);
  }, [session?.mode, finished, remaining, questions.length, finish]);

  useEffect(() => {
    if (!session || finished || !storageError) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [session, finished, storageError]);

  function start(mode: Session["mode"], pool = loaded?.questions ?? []) {
    if (!pool.length) return;
    const order = (mix ? shuffle(pool, rng(Date.now())) : pool).map(
      (q) => q.id,
    );
    update({
      examId,
      order,
      picks: {},
      checked: [],
      index: 0,
      mode,
      startedAt: Date.now(),
      finishedAt: null,
    });
    setElapsed(0);
    setFilter("all");
    setView("questions");
    setSubmitPrompt(false);
  }

  function chooseExam(id: string) {
    if (id === examId) return;
    if (session && !finished) {
      setLeavePrompt(id);
      return;
    }
    changeExam(id);
  }

  function changeExam(id: string) {
    setExamId(id);
    setSession(null);
    setView("overview");
    setFilter("all");
    setError("");
    setSubmitPrompt(false);
    setLeavePrompt(null);
  }

  function chooseOption(id: string) {
    if (
      !session ||
      !current ||
      finished ||
      (session.mode === "practice" && checked)
    )
      return;
    const old = session.picks[current.id] ?? [];
    const multiple = multipleAnswers(current);
    const selection = multiple
      ? old.includes(id)
        ? old.filter((a) => a !== id)
        : [...old, id]
      : [id];
    update({
      ...session,
      picks: { ...session.picks, [current.id]: selection },
      checked:
        !multiple && session.mode === "practice"
          ? [...new Set([...session.checked, current.id])]
          : session.checked,
    });
  }

  function jump(index: number) {
    if (!session) return;
    update({ ...session, index });
    if (window.innerWidth < 760)
      questionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  const status = (q: DrLamQuestion) => {
    if (!session?.picks[q.id]?.length) return "skipped";
    if (!q.gradable || (!finished && !session.checked.includes(q.id)))
      return "answered";
    return drLamCorrect(q, session.picks[q.id]) ? "correct" : "wrong";
  };
  const filterCount = (key: Filter) =>
    key === "all"
      ? questions.length
      : questions.filter((q) => status(q) === key).length;
  const visible = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => filter === "all" || status(q) === filter);
  const completed = Object.values(saved.sessions)
    .filter((s) => s.finishedAt)
    .map((s) => s.examId);

  if (library)
    return <ContentSurface scope="src/components/quiz/DrLamQuiz.tsx">{(
      <QuizLibrary
        locale={locale}
        onSelect={(id) => {
          changeExam(id);
          setLibrary(false);
        }}
        onOtherSources={onOtherSources}
        completed={completed}
      />
    )}</ContentSurface>;

  return <ContentSurface scope="src/components/quiz/DrLamQuiz.tsx">{(
    <section
      className={`dl-quiz${sidebar ? " has-sidebar" : ""}${view === "questions" ? " dl-study" : ""}`}
      aria-label={word(
        "Bộ đề Đại học Y Hà Nội",
        "Hanoi Medical University question bank",
        "河内医科大学题库",
      )}
    >
      <div className="dl-workspace">
        <main className="dl-main">
          <QuizExamHeader
            locale={locale}
            entry={entry}
            showCover={view !== "questions"}
            completed={completed}
            sidebar={sidebar}
            finished={finished}
            score={score}
            percent={percent}
            elapsed={elapsed}
            onBack={() => setLibrary(true)}
            onToggleSidebar={() => setSidebar(!sidebar)}
          />

          {storageError && (
            <p className="dl-source-note" role="status">
              {word(
                "Trình duyệt không lưu được tiến độ. Bạn vẫn có thể tiếp tục làm bài.",
                "Browser storage is unavailable. You can still continue.",
                "无法保存进度，仍可继续答题。",
              )}
            </p>
          )}
          {error ? (
            <div className="dl-empty" role="alert">
              <p>{error}</p>
              <button
                className="dl-button primary"
                onClick={() => setReload((r) => r + 1)}
                type="button"
              >
                {word("Thử lại", "Retry", "重试")}
              </button>
            </div>
          ) : !loaded ? (
            <div className="dl-loading" role="status">
              <span />
              <span />
              <span />
              <p>
                {word("Đang tải đề…", "Loading questions…", "正在加载题目…")}
              </p>
            </div>
          ) : (
            <>
              {view === "overview" && (
                <section className="dl-overview">
                  <h2>
                    {finished
                      ? word(
                          "Ôn tập sau bài thi",
                          "Review your exam",
                          "考后复习",
                        )
                      : word("Sẵn sàng làm bài", "Ready to begin", "准备开始")}
                  </h2>
                  <p>
                    {word(
                      "Luyện tập để xem đáp án sau từng câu, hoặc thi thử để xem kết quả khi nộp bài.",
                      "Practice reveals answers after each question. Mock exams reveal them after submission.",
                      "练习模式每题显示答案；模拟考试提交后显示结果。",
                    )}
                  </p>
                  <div className="dl-main-actions">
                    {finished ? (
                      <>
                        <button
                          type="button"
                          className="dl-button dark"
                          onClick={() => {
                            setView("questions");
                            setFilter("all");
                          }}
                        >
                          {word("Xem kết quả", "Review answers", "查看答案")}
                        </button>
                        <button
                          type="button"
                          className="dl-button danger"
                          disabled={!mistakeQuestions.length}
                          onClick={() => start("practice", mistakeQuestions)}
                        >
                          {word("Làm câu sai", "Practice mistakes", "重做错题")}
                        </button>
                        <button
                          type="button"
                          className="dl-button info"
                          onClick={() => setView("mistakes")}
                        >
                          {word("Kho câu sai", "Mistake bank", "错题库")} (
                          {mistakeQuestions.length})
                        </button>
                        <button
                          type="button"
                          className="dl-button success"
                          onClick={() => start(session!.mode)}
                        >
                          {word("Thi lại", "Retake", "重新考试")}
                        </button>
                      </>
                    ) : (
                      <>
                        {resumable && (
                          <button
                            type="button"
                            className="dl-button dark"
                            onClick={() => {
                              setElapsed(drLamElapsed(resumable));
                              setSession(resumable);
                              setView(
                                resumable.finishedAt ? "overview" : "questions",
                              );
                            }}
                          >
                            {resumable.finishedAt
                              ? word(
                                  "Xem lần làm trước",
                                  "Previous result",
                                  "上次结果",
                                )
                              : word(
                                  "Tiếp tục bài đã lưu",
                                  "Resume saved attempt",
                                  "继续答题",
                                )}
                          </button>
                        )}
                        <button
                          type="button"
                          className="dl-button primary"
                          onClick={() => start("practice")}
                        >
                          {word(
                            "Bắt đầu luyện tập",
                            "Start practicing",
                            "开始练习",
                          )}
                        </button>
                        <button
                          type="button"
                          className="dl-button outline"
                          onClick={() => start("exam")}
                        >
                          {word("Thi thử", "Mock exam", "模拟考试")} ·{" "}
                          {Math.ceil((entry.count * 45) / 60)}{" "}
                          {word("phút", "min", "分钟")}
                        </button>
                        {mistakeQuestions.length > 0 && (
                          <button
                            type="button"
                            className="dl-button info"
                            onClick={() => setView("mistakes")}
                          >
                            {word("Kho câu sai", "Mistake bank", "错题库")} (
                            {mistakeQuestions.length})
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <label className="dl-shuffle">
                    <input
                      type="checkbox"
                      checked={mix}
                      onChange={(e) => setMix(e.target.checked)}
                    />
                    {word(
                      "Xáo trộn câu hỏi",
                      "Shuffle questions",
                      "随机题目顺序",
                    )}
                  </label>
                  <p className="dl-save-note">
                    {word(
                      "Tiến độ và kho câu sai được lưu trên trình duyệt này.",
                      "Progress and mistakes are saved in this browser.",
                      "进度与错题保存在当前浏览器。",
                    )}
                  </p>
                  {entry.gradableCount < entry.count && (
                    <p className="dl-source-note">
                      {entry.count - entry.gradableCount}{" "}
                      {word(
                        "câu chưa có đáp án đánh dấu trong PDF, được giữ lại để đọc và không tính điểm.",
                        "items have no marked key in the PDF; they remain available and are not scored.",
                        "题无标注答案，保留阅读但不计分。",
                      )}
                    </p>
                  )}
                </section>
              )}

              {view === "mistakes" && (
                <section className="dl-mistakes">
                  <div className="dl-detail-heading">
                    <button
                      className="dl-round"
                      type="button"
                      onClick={() => setView("overview")}
                      aria-label={word("Quay lại", "Back", "返回")}
                    >
                      ←
                    </button>
                    <h2>{word("Kho câu sai", "Mistake bank", "错题库")}</h2>
                    <b>
                      {mistakeQuestions.length} {word("câu", "questions", "题")}
                    </b>
                  </div>
                  {mistakeQuestions.length ? (
                    <>
                      <p>
                        {word(
                          "Gồm câu sai và câu chưa trả lời trong những bài đã nộp. Trả lời đúng khi ôn lại sẽ xóa câu khỏi kho.",
                          "Includes wrong and skipped items from submitted attempts. Correct answers remove them from this bank.",
                          "包含已提交试卷的错题和未答题；重做正确后移除。",
                        )}
                      </p>
                      <button
                        type="button"
                        className="dl-button primary"
                        onClick={() => start("practice", mistakeQuestions)}
                      >
                        {word(
                          "Ôn lại các câu này",
                          "Practice these items",
                          "重做这些题",
                        )}
                      </button>
                      <div className="dl-mistake-list">
                        {mistakeQuestions.map((q) => (
                          <article key={q.id}>
                            <b>
                              {word("Câu", "Question", "题")} {q.number}
                            </b>
                            <p>{q.stem}</p>
                          </article>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="dl-empty">
                      <p>
                        {word(
                          "Chưa có câu sai trong đề này.",
                          "No mistakes saved for this set.",
                          "此题库暂无错题。",
                        )}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {view === "questions" && current && session && (
                <section className="dl-details">
                  <div className="dl-detail-heading">
                    <button
                      className="dl-round"
                      type="button"
                      onClick={() => setView("overview")}
                      aria-label={word(
                        "Quay lại thông tin đề",
                        "Back to overview",
                        "返回题库信息",
                      )}
                    >
                      ←
                    </button>
                    <h2>
                      {finished
                        ? word("Chi tiết bài làm", "Answer review", "答题详情")
                        : word("Bài làm của bạn", "Your attempt", "答题")}
                    </h2>
                    <div className="dl-doing-progress">
                      <span>
                        {finished
                          ? word("ĐANG XEM", "REVIEWING", "查看中")
                          : word("ĐÃ TRẢ LỜI", "ANSWERED", "已答")}
                      </span>
                      <b>
                        {answeredCount} / {questions.length}{" "}
                        {word("câu hỏi", "questions", "题")}
                      </b>
                      {!finished && (
                        <time
                          className={
                            remaining <= 60 && session.mode === "exam"
                              ? "warn"
                              : ""
                          }
                        >
                          {session.mode === "exam"
                            ? duration(remaining)
                            : duration(elapsed)}
                        </time>
                      )}
                    </div>
                  </div>
                  <div className="dl-detail-grid">
                    <aside
                      className={`dl-question-nav${numbersOpen ? " numbers-open" : ""}`}
                      aria-label={word(
                        "Danh sách câu hỏi",
                        "Question list",
                        "题目列表",
                      )}
                    >
                      <h3>
                        {word("DANH SÁCH CÂU HỎI", "QUESTION LIST", "题目列表")}
                      </h3>
                      <button
                        className="dl-mobile-numbers"
                        type="button"
                        aria-expanded={numbersOpen}
                        aria-controls="dl-number-panel"
                        onClick={() => setNumbersOpen(!numbersOpen)}
                      >
                        {word("Danh sách câu hỏi", "Question list", "题目列表")}{" "}
                        <span>
                          {questions.length} · {numbersOpen ? "−" : "+"}
                        </span>
                      </button>
                      <div className="dl-number-panel" id="dl-number-panel">
                        <div className="dl-filters">
                          {(
                            ["all", "correct", "wrong", "skipped"] as Filter[]
                          ).map((key) => (
                            <button
                              key={key}
                              type="button"
                              className={`${key}${filter === key ? " active" : ""}`}
                              disabled={
                                !finished &&
                                session.mode === "exam" &&
                                (key === "correct" || key === "wrong")
                              }
                              aria-pressed={filter === key}
                              onClick={() => setFilter(key)}
                            >
                              <span>
                                {key === "all"
                                  ? word("Tất cả", "All", "全部")
                                  : key === "correct"
                                    ? word("Đúng", "Correct", "正确")
                                    : key === "wrong"
                                      ? word("Sai", "Wrong", "错误")
                                      : word("Bỏ qua", "Skipped", "未答")}
                              </span>
                              <b>{filterCount(key)}</b>
                            </button>
                          ))}
                        </div>
                        <div className="dl-number-scroll" data-lenis-prevent>
                          <div className="dl-numbers">
                            {visible.map(({ q, index }) => (
                              <button
                                type="button"
                                key={q.id}
                                className={`${status(q)}${session.index === index ? " current" : ""}`}
                                aria-current={
                                  session.index === index ? "step" : undefined
                                }
                                aria-label={`${word("Câu", "Question", "题")} ${q.number}`}
                                onClick={() => jump(index)}
                              >
                                {q.number}
                              </button>
                            ))}
                          </div>
                          {!visible.length && (
                            <p>
                              {word(
                                "Không có câu trong nhóm này.",
                                "No items in this filter.",
                                "此筛选暂无题目。",
                              )}
                            </p>
                          )}
                        </div>
                        <div className="dl-legend">
                          <span>
                            <i className="answered" />
                            {word("Đã chọn", "Answered", "已答")}
                          </span>
                          <span>
                            <i className="skipped" />
                            {word("Chưa chọn", "Unanswered", "未答")}
                          </span>
                        </div>
                        {!finished && (
                          <button
                            className="dl-button primary"
                            type="button"
                            onClick={() => setSubmitPrompt(true)}
                          >
                            {word("Nộp bài", "Submit", "交卷")}
                          </button>
                        )}
                      </div>
                    </aside>

                    <article
                      className="dl-question"
                      ref={questionRef}
                      tabIndex={-1}
                    >
                      <div className="dl-question-source">
                        <span>
                          {word("Câu hỏi", "Question", "题")} {current.number}
                        </span>
                        <span>
                          {word(
                            "PDF nguồn · trang",
                            "Source PDF · page",
                            "来源 PDF · 页",
                          )}{" "}
                          {current.sourcePage}
                        </span>
                      </div>
                      <div
                        className={`dl-question-layout${figureUrls.length ? " with-figure" : ""}`}
                      >
                        <div className="dl-question-copy">
                          {current.context && (
                            <p className="dl-question-context">
                              {current.context}
                            </p>
                          )}
                          <h3>{current.stem}</h3>
                          {multipleAnswers(current) && (
                            <p className="dl-multiple-note">
                              {word(
                                "Chọn tất cả đáp án đúng.",
                                "Select all correct answers.",
                                "选择所有正确答案。",
                              )}
                            </p>
                          )}
                          <div
                            className="dl-options"
                            role="group"
                            aria-label={current.stem}
                          >
                            {current.options.map((option) => {
                              const selected = !!session.picks[
                                current.id
                              ]?.includes(option.id);
                              const isCorrect = current.answers.includes(
                                option.id,
                              );
                              const state =
                                reveal && current.gradable
                                  ? isCorrect
                                    ? " correct"
                                    : selected
                                      ? " wrong"
                                      : " muted"
                                  : selected
                                    ? " selected"
                                    : "";
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  className={`dl-option${state}`}
                                  aria-pressed={selected}
                                  disabled={
                                    finished ||
                                    (session.mode === "practice" && checked)
                                  }
                                  onClick={() => chooseOption(option.id)}
                                >
                                  <span className="dl-option-letter">
                                    {option.id}
                                  </span>
                                  <span>{option.text}</span>
                                  {reveal && current.gradable && isCorrect && (
                                    <span
                                      className="dl-answer-check"
                                      aria-label={word(
                                        "Đáp án đúng",
                                        "Correct answer",
                                        "正确答案",
                                      )}
                                    >
                                      ✓
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {!current.gradable && (
                            <p className="dl-source-note">
                              {word(
                                "PDF chưa đánh dấu đáp án cho câu này. Câu được giữ để đọc và không tính điểm.",
                                "The PDF has no marked answer key for this item. It is not scored.",
                                "原始 PDF 未标注此题答案，不计分。",
                              )}
                            </p>
                          )}
                          {!finished &&
                            session.mode === "practice" &&
                            !checked &&
                            multipleAnswers(current) && (
                              <button
                                type="button"
                                className="dl-button primary dl-check-button"
                                disabled={!session.picks[current.id]?.length}
                                onClick={() =>
                                  update({
                                    ...session,
                                    checked: [...session.checked, current.id],
                                  })
                                }
                              >
                                {word(
                                  "Kiểm tra đáp án",
                                  "Check answers",
                                  "检查答案",
                                )}
                              </button>
                            )}
                          {reveal && (
                            <div className="dl-hint" role="status">
                              <b>
                                {word(
                                  "GỢI Ý & GIẢI THÍCH",
                                  "HINT & EXPLANATION",
                                  "提示与解释",
                                )}
                              </b>
                              {current.gradable && (
                                <p className="dl-answer-line">
                                  {word("Đáp án", "Answer", "答案")}:{" "}
                                  {current.answers.join(", ")}
                                  {session.picks[current.id]?.length
                                    ? ` · ${drLamCorrect(current, session.picks[current.id]) ? word("Bạn trả lời đúng", "Correct", "回答正确") : word("Bạn trả lời sai", "Incorrect", "回答错误")}`
                                    : ""}
                                </p>
                              )}
                              <p className="dl-explanation">
                                {current.explanation ||
                                  word(
                                    "Nguồn PDF không có gợi ý cho câu này.",
                                    "No explanation is provided in the source PDF.",
                                    "原始 PDF 未提供解释。",
                                  )}
                              </p>
                            </div>
                          )}
                          {!figureUrls.length &&
                            !finished &&
                            session.mode === "exam" &&
                            current.explanationImages.length > 0 && (
                              <p className="dl-exam-figure-note">
                                {word(
                                  "Hình gợi ý của câu này sẽ mở khi xem kết quả.",
                                  "This item's reference illustrations are available after submission.",
                                  "提交后可查看本题参考插图。",
                                )}
                              </p>
                            )}
                        </div>
                        {figureUrls.length > 0 && (
                          <aside className="dl-question-figure">
                            <div className="dl-figure-heading">
                              <QuizTopicIcon name="book" />
                              <span>
                                {word(
                                  current.images.length
                                    ? "Hình của đề bài"
                                    : "Hình giải thích đáp án",
                                  current.images.length
                                    ? "Question illustrations"
                                    : "Answer illustrations",
                                  current.images.length
                                    ? "题目插图"
                                    : "答案插图",
                                )}
                              </span>
                              <small>{figureUrls.length}</small>
                            </div>
                            <QuizSourceImages
                              key={current.id}
                              urls={figureUrls}
                              title={`${word(current.images.length ? "Hình đề bài câu" : "Hình giải thích câu", current.images.length ? "Question illustration" : "Answer illustration", current.images.length ? "题目插图" : "答案插图")} ${current.number}`}
                              zoomLabel={word(
                                "Phóng to hình",
                                "Enlarge image",
                                "放大图片",
                              )}
                              closeLabel={word(
                                "Đóng hình",
                                "Close image",
                                "关闭图片",
                              )}
                            />
                            <p>
                              {word(
                                "Bấm vào hình để phóng to và xem chú thích.",
                                "Click an illustration to enlarge its labels.",
                                "点击图片放大查看标注。",
                              )}
                            </p>
                          </aside>
                        )}
                      </div>
                      <nav
                        className="dl-question-actions"
                        aria-label={word(
                          "Điều hướng câu hỏi",
                          "Question navigation",
                          "题目导航",
                        )}
                      >
                        <button
                          type="button"
                          className="dl-button outline"
                          disabled={session.index === 0}
                          onClick={() => jump(session.index - 1)}
                        >
                          ← {word("Câu trước", "Previous", "上一题")}
                        </button>
                        <span>
                          {session.index + 1}/{questions.length}
                        </span>
                        {session.index + 1 < questions.length ? (
                          <button
                            type="button"
                            className="dl-button primary"
                            onClick={() => jump(session.index + 1)}
                          >
                            {word("Câu tiếp", "Next", "下一题")} →
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="dl-button primary"
                            onClick={() =>
                              finished
                                ? setView("overview")
                                : setSubmitPrompt(true)
                            }
                          >
                            {finished
                              ? word("Kết quả", "Result", "结果")
                              : word("Nộp bài", "Submit", "交卷")}
                          </button>
                        )}
                      </nav>
                    </article>
                  </div>
                </section>
              )}
            </>
          )}
          <footer className="dl-bottom">
            <button type="button" onClick={onOtherSources}>
              {word(
                "Nguồn học khác: mô hình 3D, giáo trình, atlas, tài liệu của bạn",
                "Other sources: 3D models, textbook, atlas, your documents",
                "其他来源：3D 模型、教材、图谱、个人资料",
              )}{" "}
              →
            </button>
            <span>
              {word(
                "Nguồn: 30 PDF do bạn cung cấp",
                "Source: your 30 PDFs",
                "来源：您提供的 30 份 PDF",
              )}
            </span>
          </footer>
        </main>

        {sidebar && (
          <aside
            className="dl-catalog"
            id="dl-catalog"
            aria-label={word("Nội dung khóa học", "Course content", "课程内容")}
          >
            <div className="dl-catalog-heading">
              <h2>{word("Nội dung bộ đề", "Question sets", "题库内容")}</h2>
              <button
                type="button"
                onClick={() => setSidebar(false)}
                aria-label={word(
                  "Thu gọn danh mục",
                  "Collapse catalog",
                  "收起目录",
                )}
              >
                ›
              </button>
            </div>
            <div className="dl-search">
              <input
                type="search"
                placeholder={word(
                  "Tìm kiếm tên đề…",
                  "Search sets…",
                  "搜索题库…",
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={word("Tìm kiếm tên đề", "Search sets", "搜索题库")}
              />
            </div>
            <div className="dl-catalog-scroll" data-lenis-prevent>
              {QUIZ_TOPICS.map((topic) => {
                const group = word(topic.label, topic.en, topic.zh);
                const list = drLamCatalog.exams.filter(
                  (e) =>
                    e.topic === topic.id &&
                    quizMatchesQuery(quizExamTitle(e) + " " + e.title, search),
                );
                if (!list.length) return null;
                return (
                  <details
                    open={topic.id === entry.topic || !!search}
                    key={topic.id}
                  >
                    <summary>
                      {group}
                      <span>{list.length}</span>
                    </summary>
                    <div>
                      {list.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          className={`dl-exam-link${e.id === examId ? " active" : ""}`}
                          aria-current={e.id === examId ? "page" : undefined}
                          onClick={() => chooseExam(e.id)}
                        >
                          <span
                            className={`dl-exam-status${saved.sessions[e.id]?.finishedAt ? " complete" : ""}`}
                          >
                            {saved.sessions[e.id]?.finishedAt ? "✓" : "○"}
                          </span>
                          <span>
                            {quizExamTitle(e)}
                            <small>
                              {e.count} {word("câu hỏi", "questions", "题")}
                            </small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </details>
                );
              })}
              {!drLamCatalog.exams.some((e) =>
                quizMatchesQuery(quizExamTitle(e) + " " + e.title, search),
              ) &&
                search && (
                  <p className="dl-search-empty">
                    {word(
                      "Không tìm thấy đề. Tìm theo tên vùng hoặc số đề.",
                      "No sets found. Search by region or exam number.",
                      "未找到题库，请按区域或编号搜索。",
                    )}
                  </p>
                )}
            </div>
          </aside>
        )}
      </div>

      {submitPrompt && (
        <QuizConfirmDialog
          title={word("Nộp bài làm?", "Submit your attempt?", "提交试卷？")}
          description={
            questions.length - answeredCount > 0
              ? `${word("Còn", "Remaining:", "剩余")} ${questions.length - answeredCount} ${word("câu chưa trả lời. Bạn có thể quay lại để hoàn thành.", "unanswered items. You can return to finish them.", "题未答。可返回继续作答。")}`
              : word(
                  "Bạn đã trả lời tất cả câu hỏi. Nộp bài để xem kết quả.",
                  "All items answered. Submit to view results.",
                  "所有题目已回答。提交查看结果。",
                )
          }
          cancelLabel={word("Tiếp tục làm", "Keep working", "继续答题")}
          confirmLabel={word("Nộp bài", "Submit", "交卷")}
          onCancel={() => setSubmitPrompt(false)}
          onConfirm={finish}
        />
      )}
      {leavePrompt && (
        <QuizConfirmDialog
          title={word(
            "Chuyển sang đề khác?",
            "Switch question sets?",
            "切换题库？",
          )}
          description={word(
            "Bài đang làm đã được lưu. Bạn có thể tiếp tục khi quay lại đề này.",
            "Your attempt is saved. You can resume it when you return.",
            "当前进度已保存，可返回继续答题。",
          )}
          cancelLabel={word("Ở lại", "Stay", "留下")}
          confirmLabel={word("Chuyển đề", "Switch", "切换")}
          onCancel={() => setLeavePrompt(null)}
          onConfirm={() => changeExam(leavePrompt)}
        />
      )}
    </section>
  )}</ContentSurface>;
}

function cmsSourcedrLamCatalog() { return drLamCatalog; }
function cmsSourceQUIZ_TOPICS() { return QUIZ_TOPICS; }
