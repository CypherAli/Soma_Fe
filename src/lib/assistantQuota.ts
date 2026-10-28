import { NextResponse } from "next/server";
import { bearerToken } from "./apiAuth";
import { serverApiUrl } from "./serverApi";
import type { Loc } from "./homeContent";

/** Enforce the account quota before any classifier or answer can spend tokens. */
export async function reserveAssistantQuestion(request: Request, locale: Loc) {
  const token = bearerToken(request);
  const message = (vi: string, en: string, zh: string) => locale === "en" ? en : locale === "zh" ? zh : vi;
  if (!token) return NextResponse.json({ error: message("Đăng nhập để hỏi trợ lý: Thường 10 câu/tháng, Premium 30 câu/tháng.", "Sign in to ask: Standard 10 questions/month, Premium 30/month.", "请登录：普通套餐每月10次，Premium每月30次。") }, { status: 401 });
  try {
    const response = await fetch(`${serverApiUrl()}/membership/consume`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (response.ok) return null;
    if (response.status === 429) {
      const status = await response.json();
      return NextResponse.json({ error: message("Bạn đã dùng hết lượt hỏi tháng này. Gói Thường có 10 câu, Premium có 30 câu/tháng. Bạn có thể xem gói trong Tài khoản.", "You have used this month's questions. Standard includes 10 and Premium 30 per month. See your account plan.", "本月提问次数已用完。普通套餐每月10次，Premium每月30次，请查看账户套餐。"), code: "MONTHLY_QUOTA_EXCEEDED", remaining: status.remaining, limit: status.limit, resetsAt: status.resetsAt }, { status: 429 });
    }
    return NextResponse.json({ error: message("Không xác minh được hạn mức tài khoản. Hãy đăng nhập lại hoặc thử sau.", "Unable to verify your quota. Sign in again or retry later.", "无法验证额度，请重新登录或稍后重试。") }, { status: response.status === 401 ? 401 : 503 });
  } catch {
    return NextResponse.json({ error: message("Chưa kết nối được dịch vụ tài khoản. Vui lòng thử lại sau.", "Account service unavailable. Please retry later.", "账户服务暂不可用，请稍后重试。") }, { status: 503 });
  }
}
