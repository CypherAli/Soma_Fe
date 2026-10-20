/** Chỉ dùng cho lời gọi từ Next server; không đưa hostname Docker vào bundle client. */
export function serverApiUrl() {
  return (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/+$/, "");
}
