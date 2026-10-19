import { NextResponse } from "next/server";
import { readJsonObject, readString } from "@/lib/requestBody";
import { saveNewsletterEmail } from "@/lib/newsletter";
import { clientIp, createLimiter, sameOrigin } from "@/lib/rateLimit";

/**
 * Store registrations before acknowledging success. In production set
 * SOMA_NEWSLETTER_FILE to a file on a persistent volume (single server).
 */
export const runtime = "nodejs";
const limiter = createLimiter(5, 60_000);
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await readJsonObject(req);
  if (!body) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const email = readString(body.email, 255).toLowerCase();
  if (typeof body.email !== "string" || body.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  }
  const quota = limiter.hit(clientIp(req));
  if (!quota.ok) return NextResponse.json({ error: "rate-limited" }, { status: 429, headers: { "Retry-After": String(quota.retryAfter) } });
  try {
    await saveNewsletterEmail(email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "subscription-unavailable" }, { status: 503 });
  }
}
