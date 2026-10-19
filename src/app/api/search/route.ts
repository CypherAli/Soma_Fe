import { NextResponse } from "next/server";
import { searchWeb } from "@/lib/site/siteSearch";
import type { Loc } from "@/lib/homeContent";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  const locale = params.get("locale") ?? "vi";
  const limit = Number(params.get("limit") ?? "20");
  if (query.length > 500 || !["vi", "en", "zh"].includes(locale) ||
      !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 });
  }
  const items = searchWeb(query, locale as Loc);
  return NextResponse.json({ query, locale, total: items.length, items: items.slice(0, limit) });
}
