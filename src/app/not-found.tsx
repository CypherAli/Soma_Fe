
import { ContentSurface } from "@/components/content/ContentProvider";
export default function NotFound() {
  return <ContentSurface scope="src/app/not-found.tsx">{(
    <div style={{ maxWidth: 560, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>404 — Không tìm thấy trang</h1>
      <p style={{ marginTop: 8, opacity: 0.7 }}>Trang bạn mở không tồn tại hoặc đã chuyển đi nơi khác.</p>
      <Link href="/vi" style={{ display: "inline-block", marginTop: 16, textDecoration: "underline" }}>
        Về trang chủ
      </Link>
    </div>
  )}</ContentSurface>;
}
import Link from "next/link";
