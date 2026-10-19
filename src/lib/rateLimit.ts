/**
 * GIỚI HẠN TẦN SUẤT GỌI — cửa sổ trượt trong bộ nhớ.
 *
 * Đủ cho một máy chủ Render đơn lẻ (đồ án không chạy nhiều bản song song). Nếu
 * sau này nhân bản thì phải chuyển bộ đếm sang kho dùng chung, vì mỗi bản sẽ đếm
 * riêng — ghi rõ ở đây để người sau khỏi tưởng nó đã chặn toàn cục.
 */

export type Limiter = {
  /** Ghi một lượt gọi. `ok=false` kèm số giây phải chờ khi đã vượt ngưỡng. */
  hit: (key: string, now?: number) => { ok: boolean; retryAfter: number };
};

export function createLimiter(
  limit: number,
  windowMs: number,
  maxKeys = 5000,
): Limiter {
  if (
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    !Number.isFinite(windowMs) ||
    windowMs <= 0 ||
    !Number.isSafeInteger(maxKeys) ||
    maxKeys < 1
  ) {
    throw new RangeError(
      "Limiter parameters must be positive, with integer limits.",
    );
  }
  const seen = new Map<string, number[]>();
  return {
    hit(key, now = Date.now()) {
      const from = now - windowMs;
      const list = (seen.get(key) ?? []).filter((t) => t > from);
      if (list.length >= limit) {
        seen.set(key, list);
        return {
          ok: false,
          retryAfter: Math.max(1, Math.ceil((list[0] + windowMs - now) / 1000)),
        };
      }
      list.push(now);
      seen.set(key, list);
      // Chặn bộ nhớ phình theo số IP lạ: quá ngưỡng thì bỏ khoá cũ nhất.
      if (seen.size > maxKeys) {
        const oldest = seen.keys().next().value;
        if (oldest !== undefined) seen.delete(oldest);
      }
      return { ok: true, retryAfter: 0 };
    },
  };
}

/** IP người gọi sau proxy của Render (`x-forwarded-for` lấy phần tử đầu). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (
    fwd?.split(",")[0].trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Lời gọi có đến từ chính trang web không. Trình duyệt luôn gửi `Origin` với
 * POST từ trang khác; không có `Origin` (curl, máy chủ) thì cho qua và để giới
 * hạn tần suất lo — chặn cả trường hợp đó là chặn luôn công cụ kiểm thử.
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
