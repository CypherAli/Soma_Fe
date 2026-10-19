
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";

const BODY = {
  vi: {
    title: "Điều khoản sử dụng",
    updated: "Cập nhật tháng 9/2026.",
    items: [
      "Soma Atlas là đồ án tốt nghiệp phục vụ học tập, không thay thế chẩn đoán hay chỉ định điều trị của bác sĩ.",
      "Dữ liệu giải phẫu dựa trên Z-Anatomy (CC BY-SA) và BodyParts3D (CC BY-SA 2.1 JP), thuật ngữ theo Terminologia Anatomica; nguồn trích dẫn kèm theo từng bài.",
      "Nghiêm cấm cào dữ liệu hàng loạt, mạo danh nguồn y khoa chính thống, hoặc dùng hình ảnh mô hình cho mục đích thương mại trái giấy phép CC BY-SA.",
      "Chế độ quét camera: mẩu ảnh vuông đã cắt chỉ được gửi đi khi bạn đồng ý rõ ràng; từ chối vẫn dùng được chế độ chọn tay.",
    ],
  },
  en: {
    title: "Terms of use",
    updated: "Updated September 2026.",
    items: [
      "Soma Atlas is a graduation project for study purposes and does not replace a doctor's diagnosis or treatment.",
      "Anatomy data is based on Z-Anatomy (CC BY-SA) and BodyParts3D (CC BY-SA 2.1 JP), terminology per Terminologia Anatomica, with cited sources.",
      "Bulk scraping, impersonating official medical sources, or commercial reuse against the CC BY-SA licence is prohibited.",
      "Camera scan mode: the cropped square is only sent after your explicit consent; declining still allows manual selection.",
    ],
  },
  zh: {
    title: "使用条款",
    updated: "2026年9月更新。",
    items: [
      "Soma Atlas 为毕业设计学习项目，不能替代医生的诊断与治疗。",
      "解剖数据基于 Z-Anatomy（CC BY-SA）与 BodyParts3D（CC BY-SA 2.1 JP），术语依据 Terminologia Anatomica，并附引用来源。",
      "禁止批量抓取、冒充官方医学来源，或违反 CC BY-SA 许可进行商业使用。",
      "摄像头扫描模式：仅在您明确同意后才发送裁剪后的方形图像；拒绝后仍可手动选择。",
    ],
  },
};

export default async function DieuKhoanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = BODY[(locale as keyof typeof BODY)] ?? BODY.vi;
  return <ContentSurface scope="src/app/[locale]/dieu-khoan/page.tsx">{(
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
