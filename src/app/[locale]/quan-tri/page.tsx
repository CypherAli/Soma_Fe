import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

/**
 * Back office.
 *
 * Cố ý KHÔNG dịch theo `locale`: đây là công cụ nội bộ cho người soạn nội dung
 * người Việt, dịch nó ra ba thứ tiếng là thêm ba bộ chữ phải nuôi mà không ai
 * đọc. Trang vẫn nằm dưới `[locale]` để dùng chung layout, phông chữ và chế độ
 * nền tối với phần còn lại của web.
 *
 * Chặn quyền nằm ở PHÍA MÁY CHỦ (guard của `soma_be`). Trang này chỉ ẩn giao
 * diện khi không đủ quyền — mọi dữ liệu đều phải xin từ API kèm token, nên ai
 * mở thẳng `/quan-tri` cũng chỉ thấy một cái vỏ rỗng.
 */
export const metadata: Metadata = {
  title: "Back office — Soma 3D",
  robots: { index: false, follow: false },
};

export default async function QuanTriPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminShell />;
}
