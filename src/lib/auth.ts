/**
 * Phiên đăng nhập Soma 3D (opaque session token do BE cấp).
 *
 * `role` là vai trên back office, do `/auth/me` trả về.
 * Trang ngoài KHÔNG dùng nó để quyết định gì.
 */
export type Role = "user" | "editor" | "admin" | "super_admin";

export type AuthUser = { id: string; name: string; email: string; role: Role };
export type AuthResponse = { token: string; expiresAt: string; user: AuthUser };

const TOKEN_KEY = "soma3d_auth_token";
const EXPIRY_KEY = "soma3d_auth_expires_at";
export const AUTH_CHANGED_EVENT = "soma3d-auth-changed";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

// Keep the current tab usable when the browser blocks localStorage.
let tabAuth: { token: string; expiresAt: string | null } | null = null;
let storageUnavailable = false;

function notifyAuthChanged() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function getToken() {
  if (typeof window === "undefined") return null;
  let token = tabAuth?.token ?? null;
  let exp = tabAuth?.expiresAt ?? null;
  if (!storageUnavailable) {
    try {
      token = window.localStorage.getItem(TOKEN_KEY);
      exp = window.localStorage.getItem(EXPIRY_KEY);
    } catch {
      storageUnavailable = true;
    }
  }
  if (!token) return null;
  // Hết hạn thì coi như chưa đăng nhập, dọn luôn để khỏi gọi API vô ích.
  if (
    exp &&
    Number.isFinite(Date.parse(exp)) &&
    Date.parse(exp) <= Date.now()
  ) {
    clearAuth();
    return null;
  }
  return token;
}

export function isLoggedIn() {
  return getToken() !== null;
}

export function saveAuth(auth: AuthResponse) {
  if (typeof window === "undefined") return;
  tabAuth = { token: auth.token, expiresAt: auth.expiresAt || null };
  try {
    window.localStorage.setItem(TOKEN_KEY, auth.token);
    if (auth.expiresAt) window.localStorage.setItem(EXPIRY_KEY, auth.expiresAt);
    else window.localStorage.removeItem(EXPIRY_KEY);
    storageUnavailable = false;
  } catch {
    storageUnavailable = true;
    // The session remains available in this tab until the page is reloaded.
  }
  notifyAuthChanged();
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  tabAuth = null;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(EXPIRY_KEY);
  } catch {
    storageUnavailable = true;
    // Storage can be unavailable in private or restricted browser contexts.
  }
  notifyAuthChanged();
}

/** Chuẩn hoá email: trim + lowercase, tránh "Abc@Gmail.com " tạo 2 tài khoản. */
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Kiểm tra email hợp lệ (rộng hơn type=email của HTML). */
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export type PasswordCheck = { ok: boolean; label: string };

/** Thước đo mật khẩu: yếu / trung bình / mạnh (không chặn, chỉ gợi ý). */
export function passwordStrength(pw: string): PasswordCheck {
  if (pw.length < 8) return { ok: false, label: "weak" };
  let score = 0;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (pw.length >= 12) score += 1;
  if (score <= 2) return { ok: false, label: "weak" };
  if (score === 3) return { ok: true, label: "medium" };
  return { ok: true, label: "strong" };
}

/** Mật khẩu hợp lệ để gửi BE: ≥8 ký tự, có cả chữ và số. */
export function isValidPassword(pw: string) {
  return (
    pw.length >= 8 &&
    pw.length <= 128 &&
    /[A-Za-z]/.test(pw) &&
    /[0-9]/.test(pw)
  );
}

export async function authRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new Error("Không thể kết nối đến máy chủ, kiểm tra lại mạng");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Token chết/hết hạn/khoá tài khoản → đá về đăng nhập ngay, khỏi kẹt UI.
    if (
      response.status === 401 &&
      token &&
      getToken() === token &&
      headers.get("Authorization") === `Bearer ${token}` &&
      path !== "/auth/login"
    ) {
      clearAuth();
    }
    const message: unknown = data?.message ?? data?.error;
    const raw: unknown = Array.isArray(message)
      ? message.find((value) => typeof value === "string")
      : message;
    throw new Error(
      typeof raw === "string" && raw
        ? raw
        : `Yêu cầu thất bại (mã ${response.status})`,
    );
  }
  return data as T;
}
