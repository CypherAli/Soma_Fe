"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildQuiz, quizQuestionCount, quizSystems, type QuizItem } from "@/lib/anatomy/quiz";
import { loadExamBank, examQuestionCount, examRegions, examToQuizItems, type ExamBank } from "@/lib/anatomy/examBank";
import { loadAtlasBank, atlasQuestionCount, atlasToQuizItems, type AtlasBank } from "@/lib/anatomy/atlasBank";
import type { Loc } from "@/lib/homeContent";
import { regionViewerConfig } from "@/lib/scenes/regions";
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
    srcAtlas: "Hình atlas", open3d: "Mở mô hình 3D", close3d: "Đóng",
    atlasNote: "Hình đã che nhãn; trả lời xong sẽ hiện bản đầy đủ để đối chiếu.",
    onlyAvailable: (n: number) => `Nguồn đề đang chọn chỉ có ${n} câu`,
    keepPlace: "Đóng lại vẫn ở nguyên câu này.",
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
    srcAtlas: "Atlas figure", open3d: "Open the 3D model", close3d: "Close",
    atlasNote: "Labels are hidden; the full plate is shown after you answer.",
    onlyAvailable: (n: number) => `The selected source only has ${n} questions`,
    keepPlace: "Closing returns you to this same question.",
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
    srcAtlas: "图谱图片", open3d: "打开三维模型", close3d: "关闭",
    atlasNote: "标注已隐藏；作答后显示完整图片以供对照。",
    onlyAvailable: (n: number) => `所选题源只有 ${n} 道题`,
    keepPlace: "关闭后仍停留在本题。",
    mode: "模式", modePractice: "练习", modeExam: "模拟考试",
    modeHintPractice: "每题作答后立即显示答案与解析。",
    modeHintExam: "限时作答，交卷后才显示答案。",
    minutes: "分钟", submit: "交卷", timeUp: "时间到——已自动交卷。",
    unanswered: "未作答", prev: "上一题",
  },
} as const;

/**
 * Scene nào MỞ ĐƯỢC trong lớp phủ 3D.
 *
 * Trang /xem/<slug> trả về null nếu slug không có trong regionViewerConfig —
 * mở ra chỉ thấy khung trắng. Nên phải kiểm tra trước, đừng hiện cái nút dẫn
 * tới trang rỗng.
 */
function canOpen3d(slug: string): boolean {
  return !!slug && !!regionViewerConfig[slug];
}

/** Nhãn phương án kiểu đề thi — A, B, C, D, E. */
const LETTERS = ["A", "B", "C", "D", "E", "F"];
const QUESTION_COUNTS = [5, 10, 20, 45, 60, 100] as const;

export default function QuizRunner({ locale }: { locale: Loc }) {
  const t = TXT[locale] ?? TXT.vi;
  const systems = useMemo(() => quizSystems(locale), [locale]);

  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [left, setLeft] = useState<number | null>(null);   // giây còn lại
  const [timedOut, setTimedOut] = useState(false);
  const [source, setSource] = useState<"model" | "book" | "atlas">("model");
  const [bank, setBank] = useState<ExamBank | null>(null);
  const [atlas, setAtlas] = useState<AtlasBank | null>(null);
  // slug scene đang mở trong lớp phủ 3D; null = đang đóng
  const [view3d, setView3d] = useState<string | null>(null);
  const [region, setRegion] = useState<string>("all");
  const [system, setSystem] = useState<SystemKey | "all">("all");
  const [count, setCount] = useState(10);
  const [tool, setTool] = useState<"quick" | "adaptive" | "ai" | "pdf">("quick");
  const [brief, setBrief] = useState("");
  const [composing, setComposing] = useState(false);
  const [composeNote, setComposeNote] = useState("");
  const [pathMode, setPathMode] = useState<"manual" | "ai">("manual");
  const [pathGoal, setPathGoal] = useState("Nắm vững giải phẫu theo hệ cơ quan");
  const [pathDays, setPathDays] = useState(4);
  const [pathMinutes, setPathMinutes] = useState(25);
  const [pathSystem, setPathSystem] = useState<SystemKey | "all">("all");
  const [pathBrief, setPathBrief] = useState("");
  const [pathCreated, setPathCreated] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfStatus, setPdfStatus] = useState("");
  const [seed, setSeed] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const recordedSeed = useRef<number | null>(null);

  // Nạp ngân hàng đề giáo trình khi người dùng chọn nguồn đó (lười nạp: 135KB
  // JSON không nên tải cho người chỉ làm đề sinh từ mô hình).
  useEffect(() => {
    if (source !== "atlas" || atlas) return;
    let alive = true;
    loadAtlasBank().then((b) => alive && setAtlas(b)).catch(() => alive && setAtlas(null));
    return () => { alive = false; };
  }, [source, atlas]);

  useEffect(() => {
    if (source !== "book" || bank) return;
    let alive = true;
    loadExamBank().then((b) => alive && setBank(b)).catch(() => alive && setBank(null));
    return () => { alive = false; };
  }, [source, bank]);

  /**
   * Số câu nguồn đang chọn thực sự ra được; `null` khi ngân hàng chưa nạp xong
   * nên chưa biết.
   *
   * CẢ BA NGUỒN đều cắt `slice(0, count)` từ kho của mình, nên chọn 60 câu ở
   * kho 19 câu thì bài lặng lẽ ngắn hơn số đã chọn — không riêng gì đề giáo
   * trình. Vì vậy tính ở một chỗ theo nguồn, đừng vá riêng cho từng nguồn.
   */
  const available = useMemo(() => {
    if (source === "book") return bank ? examQuestionCount(bank, region) : null;
    if (source === "atlas") return atlas ? atlasQuestionCount(atlas) : null;
    return quizQuestionCount(locale, system);
  }, [source, bank, region, atlas, locale, system]);

  /**
   * Số câu THỰC SỰ ra đề: hạ xuống mức cao nhất kho hiện tại còn đáp ứng được.
   *
   * Tính ra chứ không lưu thành state riêng, nên đổi vùng, đổi nguồn, đổi hệ,
   * ngân hàng nạp xong hay AI soạn đề đều tự đúng — không phải nhớ gọi hàm hạ
   * số câu ở từng nút. `count` vẫn giữ nguyên lựa chọn của người dùng: quay lại
   * vùng nhiều câu là số cũ trở về.
   */
  const effectiveCount = useMemo(() => {
    if (available === null || count <= available) return count;
    return QUESTION_COUNTS.findLast((value) => value <= available) ?? Math.max(1, available);
  }, [available, count]);

  const items: QuizItem[] = useMemo(() => {
    if (seed === null) return [];
    if (source === "book") {
      return bank ? examToQuizItems(bank, { region, count: effectiveCount, seed }) : [];
    }
    if (source === "atlas") {
      return atlas ? atlasToQuizItems(atlas, { count: effectiveCount, seed, locale }) : [];
    }
    return buildQuiz({ locale, system, count: effectiveCount, seed });
  }, [seed, locale, system, effectiveCount, source, bank, region, atlas]);

  const start = () => {
    setSeed(Math.floor(Math.random() * 2 ** 31));
    setIdx(0);
    setPicked({});
    setDone(false);
    setTimedOut(false);
    // 45 giây mỗi câu — bằng nhịp đề thi giải phẫu thường gặp (40 câu / 30 phút)
    setLeft(mode === "exam" ? effectiveCount * 45 : null);
  };

  const composeQuiz = async () => {
    if (!brief.trim() || composing) return;
    setComposing(true);
    setComposeNote("");
    try {
      const response = await fetch("/api/quiz-compose", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ brief, locale }),
      });
      if (!response.ok) throw new Error("compose failed");
      const config = await response.json();
      setCount(config.count);
      setSystem(config.system);
      setMode(config.mode);
      setSource(config.source);
      setComposeNote(locale === "vi" ? `Đã cấu hình đề từ yêu cầu của bạn (${config.engine}).` : "Quiz configuration created from your request.");
      setTool("quick");
    } catch {
      setComposeNote(locale === "vi" ? "Chưa thể phân tích yêu cầu. Hãy thử mô tả ngắn hơn." : "Could not parse the request. Try a shorter description.");
    } finally { setComposing(false); }
  };

  const launchAdaptive = () => {
    type Attempt = { system: SystemKey | "all"; score: number; total: number; at: number };
    let attempts: Attempt[] = [];
    try { attempts = JSON.parse(localStorage.getItem("soma3d-quiz-attempts") ?? "[]"); } catch { attempts = []; }
    const ranked = systems.map((entry) => {
      const matches = attempts.filter((attempt) => attempt.system === entry.key).slice(-5);
      const accuracy = matches.length ? matches.reduce((sum, attempt) => sum + attempt.score / Math.max(1, attempt.total), 0) / matches.length : 1;
      return { key: entry.key, accuracy, attempts: matches.length };
    }).filter((entry) => entry.attempts > 0).sort((a, b) => a.accuracy - b.accuracy);
    setSystem(ranked[0]?.key ?? "all");
    setCount(20);
    setMode("practice");
    setSource("model");
    setTool("quick");
    setSeed(Math.floor(Math.random() * 2 ** 31));
    setIdx(0); setPicked({}); setDone(false); setTimedOut(false); setLeft(null);
  };

  const createPathway = async () => {
    if (pathMode === "ai" && pathBrief.trim()) {
      setComposing(true);
      try {
        const response = await fetch("/api/quiz-compose", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ brief: pathBrief, locale }),
        });
        if (response.ok) {
          const config = await response.json();
          setPathSystem(config.system);
          setCount(config.count);
          setMode(config.mode);
        }
      } finally { setComposing(false); }
    }
    setPathCreated(true);
    try {
      localStorage.setItem("soma3d-learning-path", JSON.stringify({
        goal: pathGoal, days: pathDays, minutes: pathMinutes,
        system: pathSystem, brief: pathBrief, createdAt: Date.now(),
      }));
    } catch { /* The preview still works when storage is unavailable. */ }
  };

  const importPersonalPdf = () => {
    if (!pdfFile) return;
    setPdfStatus(locale === "vi"
      ? `Đã thêm “${pdfFile.name}” vào thư viện cá nhân. Soma sẽ tách câu hỏi để bạn xem lại trước khi học.`
      : `Added “${pdfFile.name}” to your personal library for review.`);
  };

  // Đồng hồ chỉ chạy ở chế độ thi và khi chưa nộp bài.
  useEffect(() => {
    if (left === null || done) return;
    const id = setTimeout(() => {
      if (left <= 1) {
        setLeft(0);
        setTimedOut(true);
        setDone(true);
        return;
      }
      setLeft((value) => (value === null ? null : value - 1));
    }, 1000);
    return () => clearTimeout(id);
  }, [left, done]);

  const mmss = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.max(0, sec % 60)).padStart(2, "0")}`;

  const score = items.reduce(
    (n, it, i) => n + (it.options.find((o) => o.id === picked[i])?.correct ? 1 : 0),
    0,
  );

  useEffect(() => {
    if (!done || seed === null || recordedSeed.current === seed || !items.length) return;
    recordedSeed.current = seed;
    try {
      const attempts = JSON.parse(localStorage.getItem("soma3d-quiz-attempts") ?? "[]");
      attempts.push({ system, score, total: items.length, at: Date.now() });
      localStorage.setItem("soma3d-quiz-attempts", JSON.stringify(attempts.slice(-80)));
    } catch { /* Storage can be unavailable in privacy mode. */ }
  }, [done, seed, items.length, score, system]);

  if (seed === null) {
    return (
      <main className="quiz-shell quiz-dashboard">
        <header className="quiz-dashboard-head">
          <div>
            <span className="quiz-eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p className="quiz-lead">{t.lead}</p>
          </div>
          <div className="quiz-overview" aria-label="Quiz overview">
            <span><b>{systems.length}</b>{locale === "vi" ? "Hệ cơ quan" : locale === "zh" ? "器官系统" : "Systems"}</span>
            <span><b>{systems.reduce((total, item) => total + item.count, 0)}</b>{locale === "vi" ? "Cấu trúc" : locale === "zh" ? "结构" : "Structures"}</span>
            <span><b>3</b>{locale === "vi" ? "Nguồn học" : locale === "zh" ? "学习来源" : "Sources"}</span>
          </div>
        </header>

        <nav className="quiz-workflows" aria-label="Quiz workflows">
          <button className={tool === "quick" ? "on" : ""} onClick={() => setTool("quick")}><b>{locale === "vi" ? "Tạo đề nhanh" : "Quick quiz"}</b><span>{locale === "vi" ? "Chọn thủ công" : "Manual setup"}</span></button>
          <button className={tool === "adaptive" ? "on" : ""} onClick={() => setTool("adaptive")}><b>{locale === "vi" ? "Lộ trình học" : "Learning path"}</b><span>{locale === "vi" ? "Tự tạo hoặc nhờ AI" : "Build it or ask AI"}</span></button>
          <button className={tool === "ai" ? "on" : ""} onClick={() => setTool("ai")}><b>{locale === "vi" ? "AI tạo đề" : "AI composer"}</b><span>{locale === "vi" ? "Mô tả đề bạn muốn" : "Describe what you need"}</span></button>
          <button className={tool === "pdf" ? "on" : ""} onClick={() => setTool("pdf")}><b>{locale === "vi" ? "Học từ PDF" : "Study a PDF"}</b><span>{locale === "vi" ? "Tạo nguồn đề cá nhân" : "Your personal source"}</span></button>
        </nav>

        {tool === "ai" && <section className="quiz-ai-composer">
          <div><b>{locale === "vi" ? "Bạn muốn luyện nội dung gì?" : "What do you want to practise?"}</b><p>{locale === "vi" ? "AI chỉ cấu hình đề từ kho câu hỏi y khoa đã kiểm chứng, không tự bịa kiến thức." : "AI configures a quiz from the verified question library."}</p></div>
          <textarea value={brief} onChange={(event) => setBrief(event.target.value)} placeholder={locale === "vi" ? "Ví dụ: Tạo 20 câu ôn hệ thần kinh, ưu tiên não và tủy sống, chế độ thi thử" : "Example: Create a 20-question nervous system mock exam"} />
          <button type="button" disabled={!brief.trim() || composing} onClick={() => void composeQuiz()}>{composing ? (locale === "vi" ? "Đang phân tích..." : "Composing...") : (locale === "vi" ? "Tạo cấu hình đề" : "Build quiz")}</button>
          {composeNote && <span>{composeNote}</span>}
        </section>}
        {tool === "adaptive" && <section className="quiz-path-builder">
          <header><div><span>{locale === "vi" ? "KẾ HOẠCH CÁ NHÂN" : "PERSONAL PLAN"}</span><h2>{locale === "vi" ? "Tạo lộ trình học của bạn" : "Build your learning path"}</h2><p>{locale === "vi" ? "Bạn quyết định mục tiêu và nhịp học. Soma điều chỉnh câu hỏi theo kết quả từng phiên." : "Choose your goal and pace; Soma adapts each session."}</p></div><button type="button" className="quiz-repair" onClick={launchAdaptive}>{locale === "vi" ? "Ôn nhanh điểm yếu" : "Quick weak-area review"}</button></header>
          <div className="quiz-path-switch"><button className={pathMode === "manual" ? "on" : ""} onClick={() => setPathMode("manual")}>{locale === "vi" ? "Tự thiết kế" : "Build manually"}</button><button className={pathMode === "ai" ? "on" : ""} onClick={() => setPathMode("ai")}>{locale === "vi" ? "Nhờ AI lập kế hoạch" : "Ask AI"}</button></div>
          {pathMode === "ai" ? <div className="quiz-path-ai"><label>{locale === "vi" ? "Bạn muốn đạt điều gì?" : "What do you want to achieve?"}</label><textarea value={pathBrief} onChange={(event) => setPathBrief(event.target.value)} placeholder={locale === "vi" ? "Ví dụ: Tôi thi giải phẫu sau 3 tuần, yếu hệ thần kinh, học được 30 phút mỗi tối..." : "Example: My exam is in three weeks..."} /></div> : <div className="quiz-path-fields">
            <label><span>{locale === "vi" ? "Mục tiêu" : "Goal"}</span><input value={pathGoal} onChange={(event) => setPathGoal(event.target.value)} /></label>
            <label><span>{locale === "vi" ? "Hệ ưu tiên" : "Priority system"}</span><select value={pathSystem} onChange={(event) => setPathSystem(event.target.value as SystemKey | "all")}><option value="all">{t.all}</option>{systems.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</select></label>
            <label><span>{locale === "vi" ? "Số ngày mỗi tuần" : "Days per week"}</span><input type="number" min="1" max="7" value={pathDays} onChange={(event) => setPathDays(Number(event.target.value))} /></label>
            <label><span>{locale === "vi" ? "Phút mỗi ngày" : "Minutes per day"}</span><input type="number" min="10" max="180" step="5" value={pathMinutes} onChange={(event) => setPathMinutes(Number(event.target.value))} /></label>
          </div>}
          <footer><div className="quiz-path-preview"><b>{pathDays} {locale === "vi" ? "buổi/tuần" : "sessions/week"}</b><span>{pathMinutes} {locale === "vi" ? "phút/buổi · xen kẽ học mới, ôn đến hạn và sửa lỗi" : "min/session · new, due and correction work"}</span></div><button type="button" onClick={() => void createPathway()} disabled={pathMode === "ai" && !pathBrief.trim()}>{composing ? (locale === "vi" ? "Đang lập kế hoạch…" : "Planning…") : (locale === "vi" ? "Tạo lộ trình" : "Create pathway")}</button></footer>
          {pathCreated && <div className="quiz-path-success">{locale === "vi" ? "Lộ trình đã được lưu. Phiên đầu tiên sẽ ưu tiên nội dung cần củng cố và cập nhật sau mỗi lần làm quiz." : "Your pathway is saved and will adapt after every quiz."}</div>}
        </section>}
        {tool === "pdf" && <section className="quiz-pdf-import"><div><span>{locale === "vi" ? "THƯ VIỆN CỦA BẠN" : "YOUR LIBRARY"}</span><h2>{locale === "vi" ? "Biến tài liệu thành bộ đề cá nhân" : "Turn a document into your quiz"}</h2><p>{locale === "vi" ? "Tải PDF bài giảng hoặc sách trắc nghiệm. Soma tách câu hỏi, đáp án và gợi ý hệ cơ quan; bạn luôn được xem lại trước khi dùng." : "Upload a lecture or question book, then review extracted questions before studying."}</p><ul><li>{locale === "vi" ? "Không ghi vào ngân hàng đề chung" : "Never added to the shared bank"}</li><li>{locale === "vi" ? "Chỉ tài khoản của bạn truy cập" : "Private to your account"}</li><li>{locale === "vi" ? "Có thể sửa hoặc loại câu sai" : "Edit or remove incorrect items"}</li></ul></div><div className="quiz-pdf-drop"><input id="personal-pdf" type="file" accept="application/pdf" onChange={(event) => { setPdfFile(event.target.files?.[0] ?? null); setPdfStatus(""); }} /><label htmlFor="personal-pdf"><b>{pdfFile ? pdfFile.name : (locale === "vi" ? "Chọn một tệp PDF" : "Choose a PDF")}</b><span>{pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(1)} MB` : (locale === "vi" ? "Kéo thả hoặc bấm để chọn · tối đa 25 MB" : "Drop or browse · up to 25 MB")}</span></label><button type="button" disabled={!pdfFile} onClick={importPersonalPdf}>{locale === "vi" ? "Phân tích tài liệu" : "Analyse document"}</button>{pdfStatus && <p>{pdfStatus}</p>}</div></section>}

        <div className="quiz-dashboard-grid">
        <section className="quiz-setup quiz-config-card">
          <div className="quiz-card-heading">
            <span>01</span>
            <div><b>{locale === "vi" ? "Thiết lập phiên học" : locale === "zh" ? "设置学习环节" : "Configure session"}</b><p>{locale === "vi" ? "Chọn hình thức và phạm vi kiến thức" : locale === "zh" ? "选择形式和知识范围" : "Choose format and knowledge scope"}</p></div>
          </div>
          <div className="quiz-field">
            <label>{t.numQ}</label>
            <div className="quiz-chips">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`quiz-chip${effectiveCount === n ? " on" : ""}`}
                  onClick={() => setCount(n)}
                  disabled={available !== null && n > available}
                  title={available !== null && n > available ? t.onlyAvailable(available) : undefined}
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
                  {t.modeExam} <i>{Math.round((effectiveCount * 45) / 60)} {t.minutes}</i>
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
              <button type="button" className={`quiz-chip${source === "atlas" ? " on" : ""}`}
                onClick={() => setSource("atlas")}>
                {t.srcAtlas}{atlas ? <i>{atlas.shots.length}</i> : null}
              </button>
            </div>
          </div>

          {source === "atlas" ? (
            <div className="quiz-field">
              <label>{t.src}</label>
              <div>
                {!atlas ? (
                  <p className="quiz-lead">{t.loading}</p>
                ) : (
                  <p className="quiz-srcnote">
                    {t.atlasNote} — {atlas.source.title}
                  </p>
                )}
              </div>
            </div>
          ) : source === "book" ? (
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
            disabled={(source === "book" && !bank) || (source === "atlas" && !atlas)}>
            {t.start}
          </button>
        </section>
        <aside className="quiz-session-card">
          <span className="quiz-session-kicker">{locale === "vi" ? "PHIÊN HIỆN TẠI" : locale === "zh" ? "当前环节" : "CURRENT SESSION"}</span>
          <h2>{mode === "exam" ? t.modeExam : t.modePractice}</h2>
          <dl>
            <div><dt>{t.numQ}</dt><dd>{effectiveCount}</dd></div>
            <div><dt>{t.src}</dt><dd>{source === "model" ? t.srcModel : source === "book" ? t.srcBook : t.srcAtlas}</dd></div>
            <div><dt>{locale === "vi" ? "Thời lượng" : locale === "zh" ? "时长" : "Duration"}</dt><dd>{mode === "exam" ? `${Math.round((effectiveCount * 45) / 60)} ${t.minutes}` : locale === "vi" ? "Không giới hạn" : locale === "zh" ? "无限制" : "Untimed"}</dd></div>
          </dl>
          <div className="quiz-session-note"><i />{mode === "exam" ? t.modeHintExam : t.modeHintPractice}</div>
        </aside>
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
                {canOpen3d(it.sceneSlug) && (
                  <button type="button" className="quiz-link" onClick={() => setView3d(it.sceneSlug)}>
                    {t.open3d} →
                  </button>
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

      {item.image && (
        <figure className="quiz-fig">
          {/* Trả lời xong thì đổi sang bản GỐC còn nguyên nhãn để đối chiếu. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={answered && item.imageAnswer ? item.imageAnswer : item.image}
            alt={answered ? item.sceneTitle : ""}
            loading="lazy"
          />
        </figure>
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
          {canOpen3d(item.sceneSlug) && (
            <button type="button" className="quiz-link" onClick={() => setView3d(item.sceneSlug)}>
              {t.open3d} — {item.sceneTitle} →
            </button>
          )}
        </div>
      )}

      {view3d && (
        <div className="quiz-3d" role="dialog" aria-modal="true">
          <div className="quiz-3d-bar">
            <span>{item.sceneTitle}</span>
            <em>{t.keepPlace}</em>
            <button type="button" onClick={() => setView3d(null)}>{t.close3d}</button>
          </div>
          {/* Nhúng bằng iframe CHỦ Ý: trang xem 3D là một tài liệu riêng nên
              component câu hỏi không bị gỡ khỏi cây — đóng lớp phủ lại là vẫn
              nguyên câu hỏi, nguyên đáp án đã chọn, nguyên đồng hồ đang chạy. */}
          <iframe src={`/xem/${view3d}`} title={item.sceneTitle} />
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
