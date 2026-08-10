"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildQuiz, quizSystems, type QuizItem } from "@/lib/anatomy/quiz";
import { loadExamBank, examRegions, examToQuizItems, type ExamBank } from "@/lib/anatomy/examBank";
import type { Loc } from "@/lib/homeContent";
import type { SystemKey } from "@/store/useAnatomyStore";

/**
 * Bộ làm bài trắc nghiệm. Đề được SINH RA từ kho hotspot đã biên soạn
 * (`src/lib/anatomy/quiz.ts`) chứ không phải danh sách câu hỏi chép tay, nên
 * mỗi câu luôn kèm giải thích thật và một nút mở đúng cấu trúc trên mô hình 3D.
 *
 * Toàn bộ chạy phía client, không gọi API — trang quiz vẫn dùng được khi backend
 * chưa bật. Khi nào cần lưu điểm/lịch sử thì nối vào module `quizzes` sẵn có.
 */
const TXT = {
  vi: {
    eyebrow: "KIỂM TRA KIẾN THỨC",
    title: "Quiz giải phẫu",
    lead: "Đề được sinh từ thư viện cấu trúc 3D của Soma — mỗi câu đều mở được đúng cấu trúc trên mô hình.",
    all: "Tất cả",
    start: "Bắt đầu làm bài",
    restart: "Làm đề khác",
    next: "Câu tiếp",
    finish: "Xem kết quả",
    q: "Câu",
    of: "/",
    correct: "Chính xác",
    wrong: "Chưa đúng",
    view: "Xem trên mô hình 3D",
    scoreTitle: "Kết quả",
    scoreBody: (a: number, b: number) => `Đúng ${a}/${b} câu`,
    review: "Xem lại từng câu",
    numQ: "Số câu",
    empty: "Chưa đủ dữ liệu để ra đề cho mục này.",
    src: "Nguồn đề",
    srcModel: "Sinh từ mô hình 3D",
    srcBook: "Đề giáo trình",
    region: "Vùng cơ thể",
    loading: "Đang nạp ngân hàng đề…",
    mode: "Chế độ", modePractice: "Ôn tập", modeExam: "Thi thử",
    modeHintPractice: "Hiện đáp án và giải thích ngay sau mỗi câu.",
    modeHintExam: "Có đếm giờ, không hiện đáp án cho tới khi nộp bài.",
    minutes: "phút", submit: "Nộp bài", timeUp: "Hết giờ — bài đã tự nộp.",
    unanswered: "chưa trả lời", prev: "Câu trước",
  },
  en: {
    eyebrow: "KNOWLEDGE CHECK", title: "Anatomy quiz",
    lead: "Questions are generated from Soma's 3D structure library — every item opens the exact structure on the model.",
    all: "All", start: "Start quiz", restart: "New set", next: "Next", finish: "See results",
    q: "Question", of: "/", correct: "Correct", wrong: "Not quite", view: "View on the 3D model",
    scoreTitle: "Result", scoreBody: (a: number, b: number) => `${a}/${b} correct`,
    review: "Review answers", numQ: "Questions", empty: "Not enough data to build a quiz here.",
    src: "Question source", srcModel: "From the 3D library", srcBook: "Textbook bank",
    region: "Body region", loading: "Loading question bank…",
    mode: "Mode", modePractice: "Practice", modeExam: "Mock exam",
    modeHintPractice: "Shows the answer and explanation after each question.",
    modeHintExam: "Timed; answers stay hidden until you submit.",
    minutes: "min", submit: "Submit", timeUp: "Time is up — submitted automatically.",
    unanswered: "unanswered", prev: "Previous",
  },
  zh: {
    eyebrow: "知识测试", title: "解剖学测验",
    lead: "题目由 Soma 三维结构库生成——每题都可直接在模型上打开对应结构。",
    all: "全部", start: "开始测验", restart: "换一套", next: "下一题", finish: "查看结果",
    q: "第", of: "/", correct: "正确", wrong: "不对", view: "在三维模型中查看",
    scoreTitle: "结果", scoreBody: (a: number, b: number) => `答对 ${a}/${b} 题`,
    review: "回顾答案", numQ: "题数", empty: "该分类数据不足，暂时无法出题。",
    src: "题目来源", srcModel: "由三维库生成", srcBook: "教材题库",
    region: "身体部位", loading: "正在加载题库…",
    mode: "模式", modePractice: "练习", modeExam: "模拟考试",
    modeHintPractice: "每题作答后立即显示答案与解析。",
    modeHintExam: "限时作答，交卷后才显示答案。",
    minutes: "分钟", submit: "交卷", timeUp: "时间到——已自动交卷。",
    unanswered: "未作答", prev: "上一题",
  },
} as const;

/** Nhãn phương án kiểu đề thi — A, B, C, D, E. */
const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizRunner({ locale }: { locale: Loc }) {
  const t = TXT[locale] ?? TXT.vi;
  const systems = useMemo(() => quizSystems(locale), [locale]);

  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [left, setLeft] = useState<number | null>(null);   // giây còn lại
  const [timedOut, setTimedOut] = useState(false);
  const [source, setSource] = useState<"model" | "book">("model");
  const [bank, setBank] = useState<ExamBank | null>(null);
  const [region, setRegion] = useState<string>("all");
  const [system, setSystem] = useState<SystemKey | "all">("all");
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  // Nạp ngân hàng đề giáo trình khi người dùng chọn nguồn đó (lười nạp: 135KB
  // JSON không nên tải cho người chỉ làm đề sinh từ mô hình).
  useEffect(() => {
    if (source !== "book" || bank) return;
    let alive = true;
    loadExamBank().then((b) => alive && setBank(b)).catch(() => alive && setBank(null));
    return () => { alive = false; };
  }, [source, bank]);

  const items: QuizItem[] = useMemo(() => {
    if (seed === null) return [];
    if (source === "book") {
      return bank ? examToQuizItems(bank, { region, count, seed }) : [];
    }
    return buildQuiz({ locale, system, count, seed });
  }, [seed, locale, system, count, source, bank, region]);

  const start = () => {
    setSeed(Math.floor(Math.random() * 2 ** 31));
    setIdx(0);
    setPicked({});
    setDone(false);
    setTimedOut(false);
    // 45 giây mỗi câu — bằng nhịp đề thi giải phẫu thường gặp (40 câu / 30 phút)
    setLeft(mode === "exam" ? count * 45 : null);
  };

  // Đồng hồ chỉ chạy ở chế độ thi và khi chưa nộp bài.
  useEffect(() => {
    if (left === null || done) return;
    if (left <= 0) { setTimedOut(true); setDone(true); return; }
    const id = setTimeout(() => setLeft((v) => (v === null ? null : v - 1)), 1000);
    return () => clearTimeout(id);
  }, [left, done]);

  const mmss = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.max(0, sec % 60)).padStart(2, "0")}`;

  const score = items.reduce(
    (n, it, i) => n + (it.options.find((o) => o.id === picked[i])?.correct ? 1 : 0),
    0,
  );

  if (seed === null) {
    return (
      <main className="quiz-shell">
        <span className="quiz-eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p className="quiz-lead">{t.lead}</p>

        <div className="quiz-setup">
          <div className="quiz-field">
            <label>{t.numQ}</label>
            <div className="quiz-chips">
              {[5, 10, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`quiz-chip${count === n ? " on" : ""}`}
                  onClick={() => setCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-field">
            <label>{t.mode}</label>
            <div>
              <div className="quiz-chips">
                <button type="button" className={`quiz-chip${mode === "practice" ? " on" : ""}`}
                  onClick={() => setMode("practice")}>{t.modePractice}</button>
                <button type="button" className={`quiz-chip${mode === "exam" ? " on" : ""}`}
                  onClick={() => setMode("exam")}>
                  {t.modeExam} <i>{Math.round((count * 45) / 60)} {t.minutes}</i>
                </button>
              </div>
              <p className="quiz-srcnote">
                {mode === "exam" ? t.modeHintExam : t.modeHintPractice}
              </p>
            </div>
          </div>

          <div className="quiz-field">
            <label>{t.src}</label>
            <div className="quiz-chips">
              <button type="button" className={`quiz-chip${source === "model" ? " on" : ""}`}
                onClick={() => setSource("model")}>{t.srcModel}</button>
              <button type="button" className={`quiz-chip${source === "book" ? " on" : ""}`}
                onClick={() => setSource("book")}>{t.srcBook}</button>
            </div>
          </div>

          {source === "book" ? (
            <div className="quiz-field">
              <label>{t.region}</label>
              {!bank ? (
                <p className="quiz-lead">{t.loading}</p>
              ) : (
                <>
                  <div className="quiz-chips">
                    <button type="button" className={`quiz-chip${region === "all" ? " on" : ""}`}
                      onClick={() => setRegion("all")}>{t.all}</button>
                    {examRegions(bank).map((r) => (
                      <button key={r.key} type="button"
                        className={`quiz-chip${region === r.key ? " on" : ""}`}
                        onClick={() => setRegion(r.key)}>
                        {r.key} <i>{r.count}</i>
                      </button>
                    ))}
                  </div>
                  <p className="quiz-srcnote">{bank.source.title} — {bank.source.section}</p>
                </>
              )}
            </div>
          ) : (
          <div className="quiz-field">
            <label>{t.all === "All" ? "System" : "Hệ cơ quan"}</label>
            <div className="quiz-chips">
              <button
                type="button"
                className={`quiz-chip${system === "all" ? " on" : ""}`}
                onClick={() => setSystem("all")}
              >
                {t.all}
              </button>
              {systems.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`quiz-chip${system === s.key ? " on" : ""}`}
                  onClick={() => setSystem(s.key)}
                >
                  {s.label} <i>{s.count}</i>
                </button>
              ))}
            </div>
          </div>
          )}

          <button type="button" className="quiz-start" onClick={start}
            disabled={source === "book" && !bank}>
            {t.start}
          </button>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="quiz-shell">
        <h1>{t.title}</h1>
        <p className="quiz-lead">{t.empty}</p>
        <button type="button" className="quiz-start" onClick={() => setSeed(null)}>
          {t.restart}
        </button>
      </main>
    );
  }

  if (done) {
    return (
      <main className="quiz-shell">
        <span className="quiz-eyebrow">{t.scoreTitle}</span>
        {timedOut && <p className="quiz-timeup">{t.timeUp}</p>}
        <div className="quiz-score">
          <div
            className="quiz-ring"
            style={{ "--p": Math.round((score / items.length) * 100) } as React.CSSProperties}
          >
            <span>{Math.round((score / items.length) * 100)}%</span>
          </div>
          <div className="quiz-score-txt">
            <b>{t.scoreBody(score, items.length)}</b>
            <p>{items[0]?.sceneTitle ? `${t.review}` : ""}</p>
          </div>
        </div>
        <div className="quiz-review">
          {items.map((it, i) => {
            const chosen = it.options.find((o) => o.id === picked[i]);
            const ok = !!chosen?.correct;
            return (
              <article key={it.id} className={`quiz-rev${ok ? " ok" : " no"}`}>
                <b>{i + 1}. {it.prompt.split("\n")[0]}</b>
                <p className="quiz-rev-q">{it.prompt.split("\n").slice(1).join(" ").trim()}</p>
                <p className="quiz-rev-a">
                  <span>{ok ? t.correct : t.wrong}</span>
                  {" · "}
                  {it.options.find((o) => o.correct)?.text}
                </p>
                <p className="quiz-exp">{it.explanation}</p>
                {it.sceneSlug && (
                  <Link className="quiz-link" href={`/xem/${it.sceneSlug}`}>
                    {t.view} →
                  </Link>
                )}
              </article>
            );
          })}
        </div>
        <button type="button" className="quiz-start" onClick={start}>
          {t.restart}
        </button>
      </main>
    );
  }

  const item = items[idx];
  const chosen = picked[idx];
  // Ở chế độ thi, chọn xong vẫn KHÔNG lộ đáp án — chỉ đánh dấu ô đã chọn.
  const answered = chosen !== undefined && mode === "practice";
  const examPicked = chosen !== undefined && mode === "exam";
  const chosenOpt = item.options.find((o) => o.id === chosen);

  return (
    <main className="quiz-shell">
      <div className="quiz-head">
        <span className="quiz-count">
          <b>{idx + 1}</b> {t.of} {items.length}
        </span>
        <span className="quiz-tag">
          {left !== null && <b className={`quiz-clock${left <= 60 ? " warn" : ""}`}>{mmss(left)}</b>}
          {item.sceneTitle}
        </span>
      </div>
      <div className="quiz-bar">
        <i style={{ width: `${((idx + (answered ? 1 : 0)) / items.length) * 100}%` }} />
      </div>

      <h2 className="quiz-prompt">{item.prompt.split("\n")[0]}</h2>
      {item.prompt.split("\n").slice(1).join(" ").trim() && (
        <p className="quiz-desc">{item.prompt.split("\n").slice(1).join(" ").trim()}</p>
      )}

      <div className="quiz-options">
        {item.options.map((o, i) => {
          const state = answered
            ? o.correct ? " ok" : o.id === chosen ? " no" : " dim"
            : o.id === chosen ? " picked" : "";
          return (
            <button
              key={o.id}
              type="button"
              className={`quiz-opt${state}`}
              disabled={answered}
              onClick={() => setPicked({ ...picked, [idx]: o.id })}
            >
              <kbd>{LETTERS[i]}</kbd>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`quiz-feedback${chosenOpt?.correct ? " ok" : " no"}`}>
          <b>{chosenOpt?.correct ? t.correct : t.wrong}</b>
          <p>{item.explanation}</p>
          {item.sceneSlug && (
            <Link className="quiz-link" href={`/xem/${item.sceneSlug}`}>
              {t.view} — {item.sceneTitle} →
            </Link>
          )}
        </div>
      )}

      {(answered || mode === "exam") && (
        <div className="quiz-actions">
          {mode === "exam" && idx > 0 && (
            <button type="button" className="quiz-ghost" onClick={() => setIdx(idx - 1)}>
              ← {t.prev}
            </button>
          )}
          {idx + 1 < items.length ? (
            <button type="button" className="quiz-start" onClick={() => setIdx(idx + 1)}>
              {t.next}
            </button>
          ) : (
            <button type="button" className="quiz-start" onClick={() => setDone(true)}>
              {mode === "exam" ? t.submit : t.finish}
            </button>
          )}
          {mode === "exam" && (
            <span className="quiz-left">
              {items.length - Object.keys(picked).length} {t.unanswered}
            </span>
          )}
        </div>
      )}
    </main>
  );
}
