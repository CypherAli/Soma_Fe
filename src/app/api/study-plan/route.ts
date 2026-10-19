import { NextResponse } from "next/server";
import { complete, isConfigured } from "@/lib/llm";
import { userFromRequest } from "@/lib/apiAuth";
import { retrieve, systemDigest } from "@/lib/anatomy/retrieve";
import { readJsonObject, readString } from "@/lib/requestBody";

export const runtime = "nodejs";

/**
 * ĐỌC LỜI NGƯỜI HỌC THÀNH THAM SỐ LỘ TRÌNH.
 *
 * AI ở đây chỉ làm MỘT việc: hiểu ý định ("thi sau ba tuần, yếu thần kinh, tối
 * học 30 phút") thành mấy con số. Dàn bài — chia bao nhiêu khối, khối nào học
 * gì, rơi vào ngày nào — do `soma_be/src/study/plan.ts` dựng bằng luật, vì đó
 * là phần phải luôn ra cùng một kết quả và phải kiểm tra được bằng test.
 *
 * Trước khi hỏi, ta TRA KHO cấu trúc có thật rồi đưa kèm kết quả tra được. Mô
 * hình nhờ đó biết "tiêu hoá" ứng với hệ nào trong đúng bảy mã hệ của dự án,
 * thay vì tự nghĩ ra một mã không tồn tại rồi trả về lộ trình rỗng.
 */

const SYSTEMS = [
  "skeletal", "muscular", "nervous", "cardiovascular", "visceral", "lymphoid", "joints",
] as const;

export type PlanIntent = {
  goal: string;
  horizonDays: number;
  daysPerWeek: number;
  minutesPerDay: number;
  focusSystems: string[];
  engine: "ai" | "verified-rule";
};

/** Số ngày ứng với mỗi đơn vị thời gian người ta hay nói. */
const UNIT_DAYS: [RegExp, number][] = [
  [/nam|year|年/, 365],
  [/thang|month|个?月/, 30],
  [/tuan|week|周|星期/, 7],
  [/ngay|day|天/, 1],
];

/** "một", "hai"… cũng phải hiểu — người ta viết "một tháng" nhiều hơn "1 tháng". */
const WORD_NUMBER: Record<string, number> = {
  mot: 1, hai: 2, ba: 3, bon: 4, nam: 5, sau: 6, bay: 7, tam: 8, chin: 9, muoi: 10,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 1,
};

function normalise(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d");
}

/** Đọc số lượng đứng trước đơn vị: "3" hay "ba" đều ra 3; không đọc được thì 1. */
function countOf(token: string): number {
  const digits = Number(token);
  if (Number.isFinite(digits) && digits > 0) return digits;
  return WORD_NUMBER[token] ?? 1;
}

/**
 * Đường lui khi chưa cấu hình khoá AI — và cũng là lưới an toàn cho câu trả
 * lời của AI. Chỉ đọc con số, không đọc kiến thức giải phẫu.
 */
export function ruleIntent(text: string): PlanIntent {
  const value = normalise(text);

  // Quãng học: bắt cụm ĐƠN VỊ đầu tiên đi kèm số, "3 tuần nữa" và "sau 3 tuần"
  // đều ra 21. Không thấy gì thì một tháng — quãng người học hay chọn nhất.
  let horizonDays = 28;
  for (const [unit, days] of UNIT_DAYS) {
    const m = value.match(new RegExp(`(\\d{1,3}|[a-z]+)\\s*(?:${unit.source})`));
    if (m) {
      horizonDays = Math.min(366, Math.max(1, countOf(m[1]) * days));
      break;
    }
  }

  // Nhịp học: "4 buổi/tuần", "học mỗi ngày", "tối nào cũng học".
  const perWeek = value.match(/(\d)\s*(?:buoi|session|ngay\s*mot\s*tuan|days?\s*(?:a|per)\s*week)/);
  const daysPerWeek = /moi ngay|hang ngay|every ?day|daily|mỗi tối|moi toi/.test(value)
    ? 7
    : Math.min(7, Math.max(1, Number(perWeek?.[1]) || 4));

  // Thời lượng mỗi buổi.
  const minutes = value.match(/(\d{2,3})\s*(?:phut|min|minute|分钟)/);
  const hours = value.match(/(\d)\s*(?:tieng|gio|hour|小时)/);
  const minutesPerDay = Math.min(
    180,
    Math.max(10, Number(minutes?.[1]) || (hours ? Number(hours[1]) * 60 : 25)),
  );

  return {
    goal: text.trim().slice(0, 200),
    horizonDays,
    daysPerWeek,
    minutesPerDay,
    // Hệ ưu tiên lấy từ KHO cấu trúc, không từ một bảng từ khoá chép tay: gõ
    // "gan mật" cũng ra visceral vì trong kho có gan thật.
    focusSystems: retrieve(text, 20).systems.slice(0, 3),
    engine: "verified-rule",
  };
}

export async function POST(request: Request) {
  // Cửa nằm ở đây chứ không ở giao diện: mỗi lời gọi tiêu một lượt khoá AI.
  if (!(await userFromRequest(request))) {
    return NextResponse.json({ error: "Cần đăng nhập" }, { status: 401 });
  }

  const body = await readJsonObject(request);
  if (!body) return NextResponse.json({ error: "body không phải JSON object" }, { status: 400 });
  const brief = readString(body.brief, 800);
  if (!brief) return NextResponse.json({ error: "empty brief" }, { status: 400 });

  const fallback = ruleIntent(brief);
  if (!isConfigured()) return NextResponse.json(fallback);

  const found = retrieve(brief, 12);
  try {
    const raw = await complete({
      system: [
        "Read the learner's request and return JSON only, no prose.",
        'Keys: goal (short string in the learner\'s own language), horizonDays (integer 1-366; "1 tuần"=7, "1 tháng"=28, "1 năm"=365),',
        "daysPerWeek (1-7), minutesPerDay (10-180), focusSystems (array of 0-3 codes, most important first).",
        `Valid system codes: ${SYSTEMS.join(", ")}.`,
        "Structure library in this app:",
        ...systemDigest(),
        found.lines.length
          ? `Structures matching this request: ${found.lines.join(" | ")}`
          : "No structure in the library matches this request wording.",
        "Do not invent anatomy facts and do not write study advice; only map the request onto these fields.",
      ].join("\n"),
      user: brief,
      maxTokens: 300,
    });
    const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
    const focus = Array.isArray(parsed.focusSystems)
      ? parsed.focusSystems.filter((s: unknown) => (SYSTEMS as readonly string[]).includes(String(s)))
      : [];
    return NextResponse.json({
      goal: String(parsed.goal ?? fallback.goal).slice(0, 200) || fallback.goal,
      horizonDays: clamp(parsed.horizonDays, 1, 366, fallback.horizonDays),
      daysPerWeek: clamp(parsed.daysPerWeek, 1, 7, fallback.daysPerWeek),
      minutesPerDay: clamp(parsed.minutesPerDay, 10, 180, fallback.minutesPerDay),
      // AI không nêu được hệ nào hợp lệ thì dùng hệ tra được từ kho, đừng để
      // lộ trình rơi về "học đều tất cả" trong khi người ta đã nói rõ chỗ yếu.
      focusSystems: (focus.length ? focus : fallback.focusSystems).slice(0, 3),
      engine: "ai" as const,
    });
  } catch {
    return NextResponse.json(fallback);
  }
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
