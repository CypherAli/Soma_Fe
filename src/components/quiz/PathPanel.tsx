"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useState } from "react";
import { AUTH_CHANGED_EVENT } from "@/lib/auth";
import {
  askPlanIntent,
  deletePath,
  expandBlock,
  getPath,
  isSignedIn,
  savePath,
  weakestScope,
  type PlanBlock,
  type StudyPath,
  type StudyPlan,
  type StudySession,
} from "@/lib/study";
import type { SystemKey } from "@/store/useAnatomyStore";
import type { QuizText } from "./quizText";
import SignInGate from "./SignInGate";

/**
 * LỘ TRÌNH HỌC.
 *
 * Hai tầng, cố ý tách rời:
 *  - DÀN BÀI cả quãng (bảng dưới) trả lời "một tháng tới học những gì": chia
 *    theo ngày / tuần / tháng tuỳ độ dài quãng, do `soma_be/src/study/plan.ts`
 *    dựng bằng luật nên mở máy nào cũng thấy đúng một bảng.
 *  - BUỔI HÔM NAY (bảng trên) trả lời "giờ ngồi vào thì làm gì": tính từ hàng
 *    đợi ôn tại đúng thời điểm mở trang, nghỉ ba hôm quay lại thì nó là những
 *    câu quá hạn chứ không phải "buổi số 4" của một cái lịch vẽ từ tuần trước.
 *
 * Đừng gộp hai tầng làm một. Dàn bài mà chốt cứng "ngày 12 học 20 câu này" thì
 * chỉ cần lỡ hai hôm là cả bảng thành lời hứa suông.
 */

/** Các quãng bày sẵn. Người dùng gõ mô tả cho AI thì được quãng bất kỳ 1–366. */
const HORIZONS = [7, 28, 90, 365] as const;

export default function PathPanel({
  t,
  locale,
  systems,
  scopeLabel,
  onStartSession,
  onReviewWeakest,
}: {
  t: QuizText;
  locale: string;
  systems: { key: SystemKey; label: string }[];
  /** đổi mã phạm vi thô ("muscular") thành nhãn theo ngôn ngữ đang xem */
  scopeLabel: (scope: string) => string;
  /** vào học buổi hôm nay: truyền lên danh sách khoá câu đến hạn */
  onStartSession: (session: StudySession) => void;
  /** ôn ngay phạm vi đang yếu nhất, tính từ lịch sử làm bài */
  onReviewWeakest: (scope: string) => void;
}) {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<StudyPath | null>(null);
  const [session, setSession] = useState<StudySession | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [goal, setGoal] = useState<string>(t.pathGoalDefault);
  const [days, setDays] = useState(4);
  const [minutes, setMinutes] = useState(25);
  const [horizon, setHorizon] = useState<number>(28);
  const [systemKey, setSystemKey] = useState<string>("all");
  const [brief, setBrief] = useState("");
  const [weak, setWeak] = useState<string | null>(null);

  /** khối đang mở chi tiết, kèm các khối con đã tải về */
  const [opened, setOpened] = useState<{ index: number; blocks: PlanBlock[] } | null>(null);
  const [opening, setOpening] = useState(0);

  /**
   * Nạp lộ trình.
   *
   * Khai báo TRONG effect và `await` trước mọi setState — đúng cách `HomeNav`
   * nạp tài khoản. Đặt state ngay trong thân effect là ép React dựng lại hai
   * lần cho một lần mở trang.
   */
  useEffect(() => {
    async function load() {
      await Promise.resolve();
      if (!isSignedIn()) {
        setSignedIn(false);
        setLoading(false);
        return;
      }
      setSignedIn(true);
      try {
        const data = await getPath();
        setPath(data.path);
        setSession(data.session);
        setPlan(data.plan);
        if (data.path) {
          setGoal(data.path.goal);
          setDays(data.path.daysPerWeek);
          setMinutes(data.path.minutesPerDay);
          setSystemKey(data.path.systemKey);
          setHorizon(data.path.horizonDays ?? 28);
          setBrief(data.path.brief ?? "");
        }
        setEditing(!data.path);
        setWeak(await weakestScope());
      } catch {
        setError(t.pathSaveFailed);
      } finally {
        setLoading(false);
      }
    }
    void load();
    // Đăng nhập ở thanh điều hướng xong thì bảng này phải tự hiện lộ trình,
    // không bắt người dùng tải lại trang.
    window.addEventListener(AUTH_CHANGED_EVENT, load);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, load);
  }, [t]);

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      let chosenSystems = systemKey === "all" ? [] : [systemKey];
      let chosenGoal = goal;
      let chosenHorizon = horizon;
      let chosenDays = days;
      let chosenMinutes = minutes;

      if (mode === "ai" && brief.trim()) {
        // AI chỉ đọc Ý ĐỊNH thành mấy con số; dàn bài vẫn do máy chủ dựng bằng
        // luật. Nhờ vậy "thi sau ba tuần" ra đúng quãng 21 ngày mà bảng kế
        // hoạch vẫn là bảng kiểm tra được, không phải văn AI viết ra.
        const intent = await askPlanIntent(brief);
        if (!intent) throw new Error("ai failed");
        chosenGoal = intent.goal || goal;
        chosenHorizon = intent.horizonDays;
        chosenDays = intent.daysPerWeek;
        chosenMinutes = intent.minutesPerDay;
        chosenSystems = intent.focusSystems;
        setGoal(chosenGoal);
        setHorizon(chosenHorizon);
        setDays(chosenDays);
        setMinutes(chosenMinutes);
        setSystemKey(chosenSystems[0] ?? "all");
      }

      const data = await savePath({
        goal: chosenGoal,
        daysPerWeek: chosenDays,
        minutesPerDay: chosenMinutes,
        systemKey: chosenSystems[0] ?? "all",
        horizonDays: chosenHorizon,
        focusSystems: chosenSystems,
        brief: brief.trim() || null,
      });
      setPath(data.path);
      setSession(data.session);
      setPlan(data.plan);
      setOpened(null);
      setEditing(false);
    } catch {
      setError(t.pathSaveFailed);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t.pathDeleteConfirm)) return;
    setError("");
    try {
      await deletePath();
      setPath(null);
      setSession(null);
      setPlan(null);
      setOpened(null);
      setEditing(true);
    } catch { setError(t.pathDeleteFailed); }
  };

  /** Mở/đóng chi tiết một khối. Chỉ mở MỘT khối để bảng không dài vô tận. */
  const toggleBlock = async (block: PlanBlock) => {
    if (opened?.index === block.index) return setOpened(null);
    setOpening(block.index);
    setError("");
    try {
      const data = await expandBlock(block.index);
      setOpened({ index: block.index, blocks: data.blocks });
    } catch {
      setError(t.planExpandFailed);
    } finally {
      setOpening(0);
    }
  };

  if (loading) return <ContentSurface scope="src/components/quiz/PathPanel.tsx"><section className="quiz-path-builder"><p className="quiz-lead">{t.loading}</p></section></ContentSurface>;
  if (!signedIn) return <ContentSurface scope="src/components/quiz/PathPanel.tsx"><SignInGate t={t} /></ContentSurface>;

  return <ContentSurface scope="src/components/quiz/PathPanel.tsx">{(
    <section className="quiz-path-builder">
      <header>
        <div>
          <span>{t.pathKicker}</span>
          <h2>{path && !editing ? t.pathActive : t.pathTitle}</h2>
          <p>{path && !editing ? path.goal : t.pathLead}</p>
        </div>
        {/* Chỉ hiện khi ĐÃ có dữ liệu để biết đâu là chỗ yếu — nút "ôn điểm yếu"
            mà chưa làm bài nào thì bấm vào chỉ ra đề ngẫu nhiên, hứa suông. */}
        {weak && (
          <button type="button" className="quiz-repair" onClick={() => onReviewWeakest(weak)}>
            {/* "Tất cả" không phải một điểm yếu cụ thể — nêu tên chỉ khi có
                phạm vi thật, không thì nút đọc thành "ôn điểm yếu · tất cả" */}
            {weak === "all" ? t.pathWeak : `${t.pathWeak} · ${scopeLabel(weak)}`}
          </button>
        )}
      </header>

      {path && !editing ? (
        <>
          <div className="quiz-path-today">
            <b>{t.pathToday}</b>
            {session && (session.dueKeys.length || session.newCount) ? (
              <ul>
                {session.dueKeys.length > 0 && <li>{t.pathTodayDue(session.dueKeys.length)}</li>}
                {session.newCount > 0 && <li>{t.pathTodayNew(session.newCount)}</li>}
                {session.dueByScope.map((s) => (
                  <li key={s.scope} className="quiz-path-scope">
                    {scopeLabel(s.scope)} <i>{s.count}</i>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t.pathTodayEmpty}</p>
            )}
          </div>

          {plan && (
            <PlanOutline
              t={t}
              locale={locale}
              plan={plan}
              scopeLabel={scopeLabel}
              opened={opened}
              opening={opening}
              onToggle={toggleBlock}
            />
          )}

          <footer>
            <div className="quiz-path-preview">
              <b>{t.pathSessions(path.daysPerWeek)}</b>
              <span>{t.pathPerSession(path.minutesPerDay)}</span>
            </div>
            <button type="button" onClick={() => session && onStartSession(session)} disabled={!session}>
              {t.pathStart}
            </button>
          </footer>
          <div className="quiz-path-actions">
            <button type="button" onClick={() => setEditing(true)}>{t.pathEdit}</button>
            <button type="button" className="quiz-danger" onClick={() => void remove()}>
              {t.pathDelete}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="quiz-path-switch">
            <button type="button" className={mode === "manual" ? "on" : ""}
              aria-pressed={mode === "manual"} onClick={() => setMode("manual")}>
              {t.pathManual}
            </button>
            <button type="button" className={mode === "ai" ? "on" : ""}
              aria-pressed={mode === "ai"} onClick={() => setMode("ai")}>
              {t.pathAskAi}
            </button>
          </div>

          {mode === "ai" ? (
            <div className="quiz-path-ai">
              <label htmlFor="path-brief">{t.pathAiLabel}</label>
              <textarea id="path-brief" value={brief} lang={locale}
                onChange={(e) => setBrief(e.target.value)} placeholder={t.pathAiPlaceholder} />
              <p className="quiz-path-hint">{t.pathHorizonHint}</p>
            </div>
          ) : (
            <>
              <div className="quiz-path-horizon">
                <span>{t.pathHorizon}</span>
                <div role="group">
                  {HORIZONS.map((days_) => (
                    <button key={days_} type="button" aria-pressed={horizon === days_}
                      className={horizon === days_ ? "on" : ""} onClick={() => setHorizon(days_)}>
                      {horizonLabel(t, days_)}
                    </button>
                  ))}
                </div>
                <p className="quiz-path-hint">{t.pathHorizonHint}</p>
              </div>

              <div className="quiz-path-fields">
                <label>
                  <span>{t.pathGoal}</span>
                  <input value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={200} />
                </label>
                <label>
                  <span>{t.pathPriority}</span>
                  <select value={systemKey} onChange={(e) => setSystemKey(e.target.value)}>
                    <option value="all">{t.all}</option>
                    {systems.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </label>
                {/* kẹp ngay tại ô nhập: gõ 0 hoặc xoá trắng thì bản xem trước hiện
                    "NaN buổi/tuần" và lộ trình lưu xuống cũng vô nghĩa */}
                <label>
                  <span>{t.pathDays}</span>
                  <input type="number" min="1" max="7" value={days}
                    onChange={(e) => setDays(clamp(e.target.value, 1, 7, days))} />
                </label>
                <label>
                  <span>{t.pathMinutes}</span>
                  <input type="number" min="10" max="180" step="5" value={minutes}
                    onChange={(e) => setMinutes(clamp(e.target.value, 10, 180, minutes))} />
                </label>
              </div>
            </>
          )}

          <footer>
            <div className="quiz-path-preview">
              <b>{t.pathSessions(days)}</b>
              <span>{t.pathPerSession(minutes)}</span>
            </div>
            <button type="button" onClick={() => void submit()}
              disabled={saving || (mode === "ai" && !brief.trim())}>
              {saving ? t.pathPlanning : t.pathCreate}
            </button>
          </footer>
        </>
      )}

      {error && <div className="quiz-path-error" role="alert">{error}</div>}
    </section>
  )}</ContentSurface>;
}

/**
 * Bảng dàn bài: mỗi khối một dòng, khối đang chạy được đánh dấu.
 *
 * Khối tuần/tháng bung được xuống một tầng — đúng ý "một tháng thì rõ bốn
 * tuần, cần rõ ngày thì hỏi tiếp". Bung sẵn mọi tầng là bắt người đọc lướt qua
 * 365 dòng để tìm tuần mình quan tâm.
 */
function PlanOutline({
  t, locale, plan, scopeLabel, opened, opening, onToggle,
}: {
  t: QuizText;
  locale: string;
  plan: StudyPlan;
  scopeLabel: (scope: string) => string;
  opened: { index: number; blocks: PlanBlock[] } | null;
  opening: number;
  onToggle: (block: PlanBlock) => void;
}) {
  return <ContentSurface scope="src/components/quiz/PathPanel.tsx">{(
    <div className="quiz-path-plan">
      <div className="quiz-path-plan-head">
        <b>{t.planTitle}</b>
        <span>
          {plan.daysLeft > 0
            ? `${t.planProgress(plan.dayIndex, plan.horizonDays)} · ${t.planTotals(plan.totalSessions, plan.totalQuestions)}`
            : t.planEnded}
        </span>
      </div>
      <ol>
        {plan.blocks.map((block) => (
          <li key={block.index} className={block.current ? "now" : undefined}>
            <BlockRow t={t} locale={locale} block={block} scopeLabel={scopeLabel} />
            {block.expandable && (
              <button type="button" className="quiz-path-expand"
                aria-expanded={opened?.index === block.index}
                disabled={opening === block.index}
                onClick={() => onToggle(block)}>
                {opened?.index === block.index
                  ? t.planCollapse
                  : block.granularity === "month"
                    ? t.planExpandWeek
                    : t.planExpand}
              </button>
            )}
            {opened?.index === block.index && (
              <ol className="quiz-path-subplan">
                {opened.blocks.map((sub) => (
                  <li key={sub.index} className={sub.current ? "now" : undefined}>
                    <BlockRow t={t} locale={locale} block={sub} scopeLabel={scopeLabel} />
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
  )}</ContentSurface>;
}

function BlockRow({
  t, locale, block, scopeLabel,
}: {
  t: QuizText;
  locale: string;
  block: PlanBlock;
  scopeLabel: (scope: string) => string;
}) {
  return <ContentSurface scope="src/components/quiz/PathPanel.tsx">{(
    <div className="quiz-path-block">
      <b>{t.planBlock(block.granularity, block.index)}</b>
      <time dateTime={block.from}>{dateRange(locale, block.from, block.to)}</time>
      <span className="quiz-path-block-scope">
        {block.kind === "rest" ? t.planKindRest : scopeLabel(block.systemKey)}
      </span>
      <em className={`quiz-path-kind k-${block.kind}`}>{kindLabel(t, block.kind)}</em>
      {block.sessions > 0 && (
        <i>{`${t.planSessions(block.sessions)} · ${t.planQuestions(block.questions)}`}</i>
      )}
      {block.current && <u>{t.planNow}</u>}
    </div>
  )}</ContentSurface>;
}

function kindLabel(t: QuizText, kind: PlanBlock["kind"]): string {
  if (kind === "new") return t.planKindNew;
  if (kind === "mixed") return t.planKindMixed;
  if (kind === "review") return t.planKindReview;
  return t.planKindRest;
}

function horizonLabel(t: QuizText, days: number): string {
  if (days === 7) return t.pathHorizonWeek;
  if (days === 28) return t.pathHorizonMonth;
  if (days === 90) return t.pathHorizonQuarter;
  return t.pathHorizonYear;
}

/**
 * "20 thg 8 – 26 thg 8". Một khối dài đúng một ngày thì chỉ ghi một mốc.
 *
 * Dùng `Intl` chứ không tự ghép chuỗi: thứ tự ngày/tháng khác nhau giữa ba thứ
 * tiếng trang này hỗ trợ.
 */
function dateRange(locale: string, from: string, to: string): string {
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const start = fmt.format(new Date(`${from}T00:00:00`));
  if (from === to) return start;
  return `${start} – ${fmt.format(new Date(`${to}T00:00:00`))}`;
}

/** Đọc số từ ô nhập và kẹp vào khoảng cho phép; ô trống thì giữ giá trị cũ. */
function clamp(raw: string, min: number, max: number, fallback: number): number {
  const value = Number(raw);
  if (!raw.trim() || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}
