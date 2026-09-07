import { redirect } from "@/i18n/navigation";

/**
 * `/quet` là ĐƯỜNG DẪN TẮT, không còn là trang riêng.
 *
 * Việc quét bộ phận qua camera nay là một chế độ của trang Vision AI `/cu-chi`
 * — gộp lại để hai chế độ dùng chung MỘT luồng camera, một lần xin quyền và
 * một hệ con trỏ/dwell. Giữ đường dẫn này vì nó ngắn, dễ đọc, và đã lỡ đưa vào
 * kho kiến thức của trợ lý.
 */
export default async function ScanRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/cu-chi?che-do=quet", locale });
}
