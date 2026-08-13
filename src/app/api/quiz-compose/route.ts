import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEMS = ["skeletal", "muscular", "nervous", "cardiovascular", "visceral", "lymphatic"] as const;
type SystemCode = typeof SYSTEMS[number] | "all";

function fallbackCompose(text: string) {
  const value = text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d");
  const requested = Number(value.match(/\b(5|10|20|45|60|100)\b/)?.[1] ?? 20);
  const rules: Array<[SystemCode, RegExp]> = [
    ["skeletal", /xuong|khop|skelet|bone|骨/], ["muscular", /\bco\b|muscl|肌/],
    ["nervous", /than kinh|nao|tuy|nerv|brain|神经/], ["cardiovascular", /tim|mach|cardio|heart|心/],
    ["lymphatic", /bach huyet|lymph|淋巴/], ["visceral", /noi tang|tieu hoa|ho hap|viscera|organ|内脏/],
  ];
  return {
    count: requested,
    system: rules.find(([, pattern]) => pattern.test(value))?.[0] ?? "all",
    mode: /thi thu|exam|gioi han|timed|考试/.test(value) ? "exam" : "practice",
    source: /atlas|hinh anh|image|图谱/.test(value) ? "atlas" : /giao trinh|book|textbook|教材/.test(value) ? "book" : "model",
    engine: "verified-rule",
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const brief = String(body.brief ?? "").trim().slice(0, 800);
  if (!brief) return NextResponse.json({ error: "empty brief" }, { status: 400 });
  const fallback = fallbackCompose(brief);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json(fallback);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-5", max_tokens: 250,
        system: "Convert the user's anatomy quiz request to JSON only. Keys: count (one of 5,10,20,45,60,100), system (all,skeletal,muscular,nervous,cardiovascular,visceral,lymphatic), mode (practice,exam), source (model,book,atlas). Do not generate medical claims or questions.",
        messages: [{ role: "user", content: brief }],
      }),
    });
    if (!response.ok) throw new Error("AI unavailable");
    const data = await response.json();
    const raw = String(data?.content?.find((item: { type?: string }) => item.type === "text")?.text ?? "");
    const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
    return NextResponse.json({
      count: [5, 10, 20, 45, 60, 100].includes(parsed.count) ? parsed.count : fallback.count,
      system: SYSTEMS.includes(parsed.system) || parsed.system === "all" ? parsed.system : fallback.system,
      mode: parsed.mode === "exam" ? "exam" : "practice",
      source: ["model", "book", "atlas"].includes(parsed.source) ? parsed.source : fallback.source,
      engine: "claude",
    });
  } catch {
    return NextResponse.json(fallback);
  }
}
