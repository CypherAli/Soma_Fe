
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";

const BODY = {
  vi: {
    title: "Chính sách bảo mật",
    updated: "Cập nhật tháng 9/2026.",
    items: [
      "Email đăng ký nhận tin chỉ dùng để gửi cập nhật học liệu; không bán, không chia sẻ cho bên thứ ba.",
      "Hình webcam ở chế độ điều khiển cử chỉ chạy ngay trong trình duyệt và không rời khỏi máy bạn.",
      "Chế độ quét: mẩu ảnh vuông đã cắt chỉ gửi lên máy chủ GPU sau khi bạn đồng ý; ảnh không dùng để định danh cá nhân.",
      "Muốn xóa email khỏi danh sách nhận tin, gửi yêu cầu tới trinhviethoangawm@gmail.com.",
    ],
  },
  en: {
    title: "Privacy policy",
    updated: "Updated September 2026.",
    items: [
      "Newsletter emails are only used for study updates; never sold or shared with third parties.",
      "Gesture-control webcam frames run inside your browser and never leave your device.",
      "Scan mode: the cropped square is sent to the GPU server only after your consent; images are not used for identification.",
      "To remove your email, contact trinhviethoangawm@gmail.com.",
    ],
  },
  zh: {
    title: "隐私政策",
    updated: "2026年9月更新。",
    items: [
      "订阅邮箱仅用于学习资讯推送，不出售、不分享给第三方。",
      "手势模式的摄像头画面仅在浏览器本地处理，不会离开本机。",
      "扫描模式仅在您同意后才将裁剪后的方形图像发送到 GPU 服务器，且不用于身份识别。",
      "如需删除订阅邮箱，请联系 trinhviethoangawm@gmail.com。",
    ],
  },
};

export default async function ChinhSachPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = BODY[(locale as keyof typeof BODY)] ?? BODY.vi;
  return <ContentSurface scope="src/app/[locale]/chinh-sach/page.tsx">{(
    <main className="bd mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <p className="mt-1 text-sm opacity-70">{t.updated}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
        {t.items.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </main>
  )}</ContentSurface>;
}
