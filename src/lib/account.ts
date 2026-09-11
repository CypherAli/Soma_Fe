import { API_URL, AUTH_CHANGED_EVENT, authRequest } from "@/lib/auth";
import type { Role } from "@/lib/auth";
import { getToken } from "@/lib/auth";

/**
 * Khu tài khoản gọi các endpoint `/auth/*` của `soma_be`.
 *
 * Tách khỏi `lib/auth.ts` (chỉ lo phiên đăng nhập) để phần hồ sơ — vốn còn phải
 * lớn thêm khi làm gói Pro — không làm phình chỗ mà mọi trang đều nạp.
 */

export type Plan = "free" | "pro";
export type Provider = "google" | "github" | "facebook";

export type AccountProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  avatar: string | null;
  createdAt: string;
  /** Tài khoản đã có mật khẩu chưa (đăng ký bằng OAuth thì chưa). */
  hasPassword: boolean;
  connections: Record<Provider, boolean>;
};

export type DeviceSession = {
  id: string;
  userAgent: string | null;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  /** Đúng với chính phiên đang mở trang này. */
  current: boolean;
};

export const PROVIDERS: Provider[] = ["google", "github", "facebook"];

export const PROVIDER_LABELS: Record<Provider, string> = {
  google: "Google",
  github: "GitHub",
  facebook: "Facebook",
};

export function getProfile() {
  return authRequest<{ user: AccountProfile }>("/auth/me").then((r) => r.user);
}

export function updateProfile(patch: { name?: string; avatar?: string | null }) {
  return authRequest<{ user: AccountProfile }>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(patch),
  }).then((r) => {
    // Báo cho thanh điều hướng: nó giữ bản sao hồ sơ riêng, không bắn sự kiện
    // thì đổi tên hay ảnh xong avatar trên nav vẫn là cái cũ tới khi tải lại.
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    return r.user;
  });
}

export function listSessions() {
  return authRequest<{ sessions: DeviceSession[] }>("/auth/sessions").then((r) => r.sessions);
}

export function revokeSession(id: string) {
  return authRequest<{ success: boolean }>(`/auth/sessions/${id}`, { method: "DELETE" });
}

export function revokeOtherSessions() {
  return authRequest<{ revoked: number }>("/auth/sessions/others", { method: "DELETE" });
}

export function unlinkProvider(provider: Provider) {
  return authRequest<{ user: AccountProfile }>(`/auth/connections/${provider}`, {
    method: "DELETE",
  }).then((r) => r.user);
}

/**
 * Địa chỉ bắt đầu luồng liên kết.
 *
 * Token phiên đi trong tham số `link` vì đây là một lần chuyển trang thật sang
 * nhà cung cấp, không phải lời gọi fetch — không có chỗ nào đặt header. Token
 * chỉ sống một lần dùng ở bước tạo `state` phía máy chủ.
 */
export function linkUrl(provider: Provider) {
  return `${API_URL}/auth/oauth/${provider}?link=${encodeURIComponent(getToken() ?? "")}`;
}

/** Chữ cái đại diện khi chưa có ảnh: đầu họ + đầu tên ("Trịnh Việt Hoàng" → "TH"). */
export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/**
 * Đọc tệp ảnh và trả về data URL vuông 256px.
 *
 * Thu nhỏ NGAY Ở TRÌNH DUYỆT: ảnh máy ảnh điện thoại vài megabyte mà gửi
 * nguyên lên thì vừa vượt trần 200 KB của máy chủ, vừa nằm mãi trong cột
 * `users.avatar` khiến mọi truy vấn người dùng phải tải theo.
 */
export async function fileToAvatar(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Tệp không phải ảnh");
  const bitmap = await createImageBitmap(file);
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh");
  // Cắt vuông giữa ảnh trước khi thu nhỏ, không thì ảnh ngang bị bóp méo.
  const side = Math.min(bitmap.width, bitmap.height);
  context.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  bitmap.close();
  const url = canvas.toDataURL("image/webp", 0.86);
  return url.startsWith("data:image/webp") ? url : canvas.toDataURL("image/jpeg", 0.86);
}

/**
 * Đoán tên thiết bị từ chuỗi User-Agent.
 *
 * Cố ý thô sơ: chỉ cần đủ để người dùng nhận ra "máy nào là máy mình", không
 * phải một thư viện nhận diện trình duyệt.
 */
export function describeDevice(userAgent: string | null): string {
  if (!userAgent) return "Thiết bị không rõ";
  const ua = userAgent.toLowerCase();
  const browser = ua.includes("edg/")
    ? "Edge"
    : ua.includes("opr/") || ua.includes("opera")
      ? "Opera"
      : ua.includes("chrome") && !ua.includes("chromium")
        ? "Chrome"
        : ua.includes("firefox")
          ? "Firefox"
          : ua.includes("safari")
            ? "Safari"
            : "Trình duyệt khác";
  const os = ua.includes("windows")
    ? "Windows"
    : ua.includes("android")
      ? "Android"
      : ua.includes("iphone") || ua.includes("ipad")
        ? "iOS"
        : ua.includes("mac os")
          ? "macOS"
          : ua.includes("linux")
            ? "Linux"
            : "hệ điều hành khác";
  return `${browser} · ${os}`;
}
