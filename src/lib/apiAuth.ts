import { API_URL } from "@/lib/auth";

/**
 * Xác thực người gọi ở PHÍA MÁY CHỦ cho các route trong `src/app/api`.
 *
 * Chặn ở giao diện là chặn cho có: `/api/quiz-compose` vẫn nhận mọi lời gọi
 * curl, mà mỗi lời gọi là một lượt tiêu khoá LLM của chủ dự án. Cửa thật phải
 * nằm ở route, giao diện chỉ là chỗ nói trước cho người dùng đỡ mất công.
 *
 * Nguồn sự thật về phiên đăng nhập là `soma_be` (bảng `Session`), nên ở đây chỉ
 * hỏi lại nó — không tự đọc cơ sở dữ liệu, không tự ký token song song.
 */
export type ApiUser = { id: string; name: string; email: string };

export function bearerToken(request: Request): string | undefined {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : undefined;
}

/**
 * Trả về người dùng của token, hoặc `null` khi thiếu/sai/hết hạn.
 *
 * Backend không chạy cũng trả `null`: thà từ chối còn hơn mở toang cửa AI mỗi
 * khi dịch vụ xác thực chập chờn.
 */
export async function userFromRequest(request: Request): Promise<ApiUser | null> {
  const token = bearerToken(request);
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: ApiUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}
