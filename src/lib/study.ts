import { API_URL, getToken } from "@/lib/auth";

/**
 * TIẾN ĐỘ HỌC — lượt làm bài, lộ trình, hàng đợi ôn theo khoảng cách.
 *
 * Chia đôi đúng như `chatMemory.ts`:
 *  - ĐÃ ĐĂNG NHẬP: máy chủ là nguồn sự thật, học máy nào cũng thấy tiến độ.
 *  - CHƯA ĐĂNG NHẬP: lượt làm bài vẫn ghi vào localStorage để nút "ôn nhanh
 *    điểm yếu" dùng được ngay, nhưng LỘ TRÌNH thì phải đăng nhập — nó là dữ
 *    liệu nhiều buổi, hứa hẹn nhiều tuần mà nằm trong cache trình duyệt thì
 *    xoá cache một cái là mất trắng kế hoạch của người ta.
 *
 * Ghi vào ĐÚNG MỘT nơi tuỳ trạng thái đăng nhập, không ghi cả hai: ghi cả hai
 * thì đăng nhập giữa chừng là cùng một lượt bị đếm hai lần.
 */

/* "vet" = trắc nghiệm khu thú y. Nằm chung một hệ tiến độ với các nguồn kia để
   lịch sử học của một người là MỘT dòng liền, không tách người/thú y. */
export type QuizSourceKey = "model" | "book" | "atlas" | "personal" | "vet";

export type GradedItem = {
  itemKey: string;
  source: QuizSourceKey;
  scope?: string;
  correct: boolean;
};

export type AttemptInput = {
  source: QuizSourceKey;
  scope?: string;
  mode?: "practice" | "exam";
  score: number;
  total: number;
  seconds?: number;
  items?: GradedItem[];
};

export type Attempt = {
  id?: string;
  source: string;
  scope: string;
  mode: string;
  score: number;
  total: number;
  seconds?: number;
  createdAt: string;
};

export type ScopeStat = {
  scope: string;
  score: number;
  total: number;
  attempts: number;
  accuracy: number | null;
};

export type History = {
  attempts: Attempt[];
  totals: { score: number; total: number; accuracy: number | null };
  byScope: ScopeStat[];
  streak: number;
  dueCount: number;
  trackedCount: number;
  /** true khi số liệu này chỉ nằm trên máy đang dùng */
  local: boolean;
};

export type StudyPath = {
  goal: string;
  daysPerWeek: number;
  minutesPerDay: number;
  systemKey: string;
  /** độ dài quãng học: 7 = một tuần, 28 = một tháng, 365 = một năm */
  horizonDays: number;
  /** thứ tự hệ cơ quan muốn học trước */
  focusSystems: string[];
  brief: string | null;
  startedAt?: string;
  updatedAt?: string;
};

/** Độ mịn của dàn bài, do máy chủ chọn theo độ dài quãng. */
export type Granularity = "day" | "week" | "month";

export type PlanBlock = {
  index: number;
  granularity: Granularity;
  startDay: number;
  days: number;
  from: string;
  to: string;
  systemKey: string;
  kind: "new" | "mixed" | "review" | "rest";
  sessions: number;
  questions: number;
  current: boolean;
  expandable: boolean;
};

export type StudyPlan = {
  horizonDays: number;
  granularity: Granularity;
  blocks: PlanBlock[];
  totalSessions: number;
  totalQuestions: number;
  dayIndex: number;
  daysLeft: number;
};

export type StudySession = {
  size: number;
  dueKeys: string[];
  dueByScope: { scope: string; count: number }[];
  newCount: number;
  systemKey: string;
};

const LOCAL_KEY = "soma3d-quiz-attempts";
const LOCAL_LIMIT = 80;

export function isSignedIn(): boolean {
  return !!getToken();
}

/**
 * Khoá ổn định của một câu, dùng cho lịch ôn.
 *
 * Đề sinh từ mô hình có id dạng `<factId>#<dạng câu>` — cắt phần dạng câu đi,
 * vì hỏi tên Latin hay hỏi hệ cơ quan thì vẫn đang ôn CÙNG MỘT cấu trúc, không
 * phải hai thứ cần nhớ riêng.
 */
export function itemKeyOf(source: QuizSourceKey, id: string): string {
  return `${source}:${id.split("#")[0]}`;
}

// ------------------------------------------------------------------ lượt làm bài

export async function recordAttempt(input: AttemptInput): Promise<void> {
  const token = getToken();
  if (!token) {
    writeLocalAttempt({
      source: input.source,
      scope: input.scope ?? "all",
      mode: input.mode ?? "practice",
      score: input.score,
      total: input.total,
      seconds: input.seconds,
      createdAt: new Date().toISOString(),
    });
    return;
  }
  try {
    const res = await fetch(`${API_URL}/study/attempts`, {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`http ${res.status}`);
  } catch {
    // Mất mạng giữa chừng thì vẫn giữ lại ở máy để không mất công người học;
    // lần sau vào có mạng, phần lịch sử sẽ gộp cả hai nguồn.
    writeLocalAttempt({
      source: input.source,
      scope: input.scope ?? "all",
      mode: input.mode ?? "practice",
      score: input.score,
      total: input.total,
      seconds: input.seconds,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function getHistory(): Promise<History> {
  const token = getToken();
  if (token) {
    try {
      const res = await fetch(`${API_URL}/study/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`http ${res.status}`);
      return { ...((await res.json()) as Omit<History, "local">), local: false };
    } catch {
      /* máy chủ không trả lời thì vẫn hiện được phần đã lưu ở máy */
    }
  }
  return localHistory();
}

/** Phạm vi có tỷ lệ đúng thấp nhất — dùng cho nút "ôn nhanh điểm yếu". */
export async function weakestScope(): Promise<string | null> {
  const history = await getHistory();
  const ranked = history.byScope.filter((s) => s.attempts > 0 && s.accuracy !== null);
  return ranked.length ? ranked[0].scope : null;
}

// -------------------------------------------------------------------- lộ trình

export type PathReply = {
  path: StudyPath | null;
  session: StudySession | null;
  plan: StudyPlan | null;
};

export async function getPath(): Promise<PathReply> {
  const token = getToken();
  if (!token) return { path: null, session: null, plan: null };
  const res = await fetch(`${API_URL}/study/path`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
}

export async function savePath(
  input: Omit<StudyPath, "updatedAt" | "startedAt">,
): Promise<PathReply> {
  const token = getToken();
  if (!token) throw new Error("Cần đăng nhập để lưu lộ trình");
  const res = await fetch(`${API_URL}/study/path`, {
    method: "PUT",
    headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      goal: input.goal,
      daysPerWeek: input.daysPerWeek,
      minutesPerDay: input.minutesPerDay,
      systemKey: input.systemKey,
      horizonDays: input.horizonDays,
      focusSystems: input.focusSystems,
      brief: input.brief ?? undefined,
    }),
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
}

export type PlanIntent = {
  goal: string;
  horizonDays: number;
  daysPerWeek: number;
  minutesPerDay: number;
  focusSystems: string[];
  engine: "ai" | "verified-rule";
};

/**
 * Nhờ AI đọc mô tả bằng lời thành tham số lộ trình.
 *
 * Gọi route của Next chứ không gọi thẳng nhà cung cấp AI: khoá nằm ở máy chủ,
 * và route đó còn tra kho cấu trúc để mô hình khỏi đoán mã hệ cơ quan.
 */
export async function askPlanIntent(brief: string): Promise<PlanIntent | null> {
  const token = getToken();
  try {
    const res = await fetch("/api/study-plan", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ brief }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Bung một khối của dàn bài xuống tầng mịn hơn.
 *
 * Gọi riêng chứ không nhận sẵn mọi tầng cùng lộ trình: lộ trình một năm mà kể
 * sẵn cả 365 ngày là tải thừa vài chục lần dữ liệu cho một dòng người dùng mở.
 */
export async function expandBlock(
  index: number,
): Promise<{ parent: PlanBlock | null; granularity?: Granularity; blocks: PlanBlock[] }> {
  const token = getToken();
  if (!token) return { parent: null, blocks: [] };
  const res = await fetch(`${API_URL}/study/path/expand?block=${index}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
}

export async function deletePath(): Promise<void> {
  const token = getToken();
  if (!token) return;
  await fetch(`${API_URL}/study/path`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => undefined);
}

// ---------------------------------------------------------- phần lưu ở máy

function readLocalAttempts(): Attempt[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((a) => a && typeof a.total === "number" && typeof a.score === "number")
      .map((a) => ({
        source: String(a.source ?? "model"),
        // Bản cũ lưu khoá `system`; đọc cả hai để lịch sử của người đã dùng
        // trước đây không biến mất sau khi nâng cấp.
        scope: String(a.scope ?? a.system ?? "all"),
        mode: String(a.mode ?? "practice"),
        score: a.score,
        total: a.total,
        seconds: a.seconds,
        createdAt: a.createdAt ?? new Date(a.at ?? Date.now()).toISOString(),
      }));
  } catch {
    return [];
  }
}

function writeLocalAttempt(attempt: Attempt) {
  try {
    const all = [...readLocalAttempts(), attempt].slice(-LOCAL_LIMIT);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  } catch {
    /* chế độ riêng tư chặn localStorage — làm bài vẫn phải chạy được */
  }
}

/** Tính đúng những con số máy chủ trả về, nhưng từ dữ liệu ở máy. */
function localHistory(): History {
  const attempts = readLocalAttempts().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totals = attempts.reduce(
    (acc, a) => ({ score: acc.score + a.score, total: acc.total + a.total }),
    { score: 0, total: 0 },
  );
  const byScope = new Map<string, ScopeStat>();
  for (const a of attempts) {
    const row = byScope.get(a.scope) ?? { scope: a.scope, score: 0, total: 0, attempts: 0, accuracy: null };
    row.score += a.score;
    row.total += a.total;
    row.attempts += 1;
    byScope.set(a.scope, row);
  }
  return {
    attempts,
    totals: { ...totals, accuracy: totals.total ? totals.score / totals.total : null },
    byScope: [...byScope.values()]
      .map((s) => ({ ...s, accuracy: s.total ? s.score / s.total : null }))
      .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1)),
    streak: streakDays(attempts.map((a) => new Date(a.createdAt))),
    // Chưa đăng nhập thì không có lịch ôn — nói 0 chứ đừng bịa ra con số.
    dueCount: 0,
    trackedCount: 0,
    local: true,
  };
}

function streakDays(dates: Date[]): number {
  if (!dates.length) return 0;
  const days = new Set(dates.map(dayKey));
  const today = new Date();
  let cursor = days.has(dayKey(today)) ? today : addDays(today, -1);
  if (!days.has(dayKey(cursor))) return 0;
  let n = 0;
  while (days.has(dayKey(cursor))) {
    n += 1;
    cursor = addDays(cursor, -1);
  }
  return n;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function addDays(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}
