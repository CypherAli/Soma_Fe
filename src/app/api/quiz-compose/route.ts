import { NextResponse } from "next/server";
import { complete, isConfigured } from "@/lib/llm";
import { userFromRequest } from "@/lib/apiAuth";
import { retrieve, systemDigest } from "@/lib/anatomy/retrieve";

export const runtime = "nodejs";

// Phải khớp ĐÚNG SystemKey trong `@/store/useAnatomyStore`: trả về "lymphatic"
// là giao diện lọc theo một hệ không tồn tại -> đề rỗng mà không báo lỗi.
const SYSTEMS = ["skeletal", "muscular", "nervous", "cardiovascular", "visceral", "lymphoid", "joints"] as const;
type SystemCode = typeof SYSTEMS[number] | "all";

/**
 * Một phần của đề: bấy nhiêu câu thuộc bấy nhiêu hệ.
 *
 * Có `parts` thì mới diễn đạt được "20 câu thần kinh và 15 câu tiêu hoá" —
 * khuôn cũ chỉ có (count, system) buộc mô hình phải vứt đi một nửa yêu cầu rồi
 * vẫn báo "đã cấu hình xong", tức là nói dối người dùng một cách lịch sự.
 */
export type QuizPart = { system: SystemCode; count: number };

/** Trần số câu một đề trộn, để một lời nhắc không dựng ra bài 500 câu. */
const MAX_TOTAL = 120;
const MAX_PARTS = 4;

function normalise(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d");
}

/**
 * Đường lui khi chưa cấu hình khoá AI, và là lưới chặn cho câu trả lời của AI.
 *
 * Đọc từng cụm "<số> câu <nội dung>" rồi TRA KHO xem nội dung ấy ứng với hệ
 * nào — không dùng bảng từ khoá chép tay nữa: gõ "gan mật" hay "dạ dày" cũng
 * ra `visceral` vì trong kho có gan và dạ dày thật.
 */
export function fallbackCompose(text: string) {
  const value = normalise(text);
  const parts: QuizPart[] = [];

  // "20 câu hệ thần kinh 15 câu tiêu hoá" → hai cụm; phần mô tả của mỗi cụm
  // kéo dài tới ngay trước con số tiếp theo.
  const chunks = [...value.matchAll(/(\d{1,3})\s*(?:cau|questions?|题|道)?\s*([^\d]{0,60})/g)];
  for (const chunk of chunks) {
    const count = Number(chunk[1]);
    if (!Number.isFinite(count) || count < 1 || count > MAX_TOTAL) continue;
    const found = retrieve(chunk[2] ?? "", 15).systems;
    if (!found.length) continue;
    parts.push({ system: found[0] as SystemCode, count });
    if (parts.length >= MAX_PARTS) break;
  }

  // Không tách được cụm nào thì quay về đề một hệ như trước: lấy số câu đầu
  // tiên nhìn thấy và hệ khớp nhất với cả câu.
  const single = Number(value.match(/\b(\d{1,3})\b/)?.[1] ?? 0);
  const whole = retrieve(text, 20).systems;
  const merged = mergeParts(parts);

  return {
    parts: merged,
    count: merged.length
      ? merged.reduce((n, p) => n + p.count, 0)
      : clamp(single, 1, MAX_TOTAL, 20),
    system: (merged.length === 1 ? merged[0].system : (whole[0] as SystemCode)) ?? "all",
    mode: /thi thu|exam|gioi han|timed|考试/.test(value) ? "exam" : "practice",
    source: /atlas|hinh anh|image|图谱/.test(value) ? "atlas" : /giao trinh|book|textbook|教材/.test(value) ? "book" : "model",
    engine: "verified-rule" as const,
  };
}

export async function POST(request: Request) {
  // Cửa nằm ở ĐÂY chứ không phải ở giao diện: mỗi lời gọi là một lượt tiêu khoá
  // LLM, mà route để mở thì curl vẫn gọi được dù nút trên trang đã bị khoá.
  if (!(await userFromRequest(request))) {
    return NextResponse.json({ error: "Cần đăng nhập" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const brief = String(body.brief ?? "").trim().slice(0, 800);
  if (!brief) return NextResponse.json({ error: "empty brief" }, { status: 400 });
  const fallback = fallbackCompose(brief);
  if (!isConfigured()) return NextResponse.json(fallback);

  const found = retrieve(brief, 12);
  try {
    const raw = await complete({
      system: [
        "Convert the user's anatomy quiz request to JSON only.",
        'Keys: parts (array of {system, count}, one entry per distinct topic the user asked for — keep every topic, never merge or drop one),',
        "and mode (practice,exam). Do not choose the question source; the app decides that.",
        `Valid system codes: ${SYSTEMS.join(", ")}, all. Total questions across parts must be 1-${MAX_TOTAL}.`,
        "Structure library in this app:",
        ...systemDigest(),
        found.lines.length
          ? `Structures matching this request: ${found.lines.join(" | ")}`
          : "No structure in the library matches this request wording.",
        "Do not generate medical claims or questions; only map the request onto these fields.",
      ].join("\n"),
      user: brief,
      maxTokens: 400,
    });
    const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));

    const parts = mergeParts(
      (Array.isArray(parsed.parts) ? parsed.parts : [])
        .map((p: { system?: unknown; count?: unknown }) => ({
          system: String(p?.system ?? "") as SystemCode,
          count: clamp(p?.count, 1, MAX_TOTAL, 0),
        }))
        .filter(
          (p: QuizPart) =>
            p.count > 0 && ((SYSTEMS as readonly string[]).includes(p.system) || p.system === "all"),
        ),
    );

    // AI không dựng nổi phần nào hợp lệ thì dùng bản đọc bằng luật — thà ra đề
    // theo cách cũ còn hơn ra đề rỗng.
    const use = parts.length ? parts : fallback.parts;
    const total = use.reduce((n, p) => n + p.count, 0);

    return NextResponse.json({
      parts: use,
      count: total || fallback.count,
      system: use.length === 1 ? use[0].system : fallback.system,
      mode: parsed.mode === "exam" ? "exam" : "practice",
      // NGUỒN ĐỀ luôn lấy theo luật, không nghe AI: "12 câu xương, 8 câu tim
      // mạch" từng bị trả về nguồn "atlas" dù người dùng không hề nhắc tới
      // hình atlas — và đổi nguồn là bay luôn đề trộn vừa dựng.
      source: fallback.source,
      engine: parts.length ? ("ai" as const) : fallback.engine,
    });
  } catch {
    return NextResponse.json(fallback);
  }
}

/** Gộp phần trùng hệ và kẹp tổng số câu. Hỏi hai lần cùng một hệ là một đề. */
function mergeParts(parts: QuizPart[]): QuizPart[] {
  const bySystem = new Map<SystemCode, number>();
  for (const part of parts) {
    bySystem.set(part.system, (bySystem.get(part.system) ?? 0) + part.count);
  }
  const merged: QuizPart[] = [];
  let total = 0;
  for (const [system, count] of [...bySystem.entries()].slice(0, MAX_PARTS)) {
    const room = MAX_TOTAL - total;
    if (room <= 0) break;
    const take = Math.min(count, room);
    merged.push({ system, count: take });
    total += take;
  }
  return merged;
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
