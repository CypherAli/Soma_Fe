import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import CategorySidebar from "@/components/explore/CategorySidebar";
import AtlasIcon from "@/components/explore/AtlasIcon";
import QuizRunner from "@/components/quiz/QuizRunner";
import { type Loc } from "@/lib/homeContent";
import "../../../home.css";

/**
 * "Trắc nghiệm giải phẫu" — mục trong sidebar Giải phẫu.
 *
 * Trước đây mục này bị GỠ KHỎI sidebar vì đường dẫn chưa tồn tại và bấm vào là
 * 404. Nay dựng thật, và cố ý KHÔNG chép lại trang /quiz: trang này nằm trong
 * khung duyệt Giải phẫu (giữ nguyên sidebar để quay lại danh mục model), và mở
 * sẵn bộ đề sinh từ CHÍNH THƯ VIỆN 3D — đúng ngữ cảnh người học vừa xem model
 * xong muốn tự kiểm tra. Ba nguồn đề còn lại (giáo trình, atlas, tài liệu
 * riêng) vẫn chọn được ngay trong bảng cấu hình như ở trang /quiz.
 */
export default async function TracNghiemGiaiPhauPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = (hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale) as Loc;

  const copy = {
    eyebrow: locale === "vi" ? "THƯ VIỆN GIẢI PHẪU" : locale === "zh" ? "解剖学图谱" : "ANATOMY LIBRARY",
    title:
      locale === "vi" ? "Trắc nghiệm giải phẫu"
        : locale === "zh" ? "解剖学测验" : "Anatomy quiz",
    lede:
      locale === "vi"
        ? "Đề sinh từ chính thư viện cấu trúc 3D của Soma — mỗi câu mở được đúng mô hình chứa cấu trúc đang hỏi. Đổi sang ngân hàng giáo trình, atlas hoặc tài liệu của bạn ngay trong bảng dưới."
        : locale === "zh"
          ? "题目由 Soma 的三维结构库生成——每题都可直接打开对应模型。也可在下方切换为教材题库、图谱或你自己的资料。"
          : "Questions generated from Soma's own 3D structure library — every item opens the model that contains it. Switch to the textbook bank, atlas or your own documents in the panel below.",
  };

  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />
      <div className="explore-shell">
        <CategorySidebar locale={locale} active="trac-nghiem" />
        <main className="explore-main">
          <header className="explore-heading">
            <span className="explore-eyebrow">{copy.eyebrow}</span>
            <div className="page-head">
              <span className="ic"><AtlasIcon id="i-quiz" /></span>
              <h1>{copy.title}</h1>
            </div>
            <div className="explore-heading-foot">
              <p>{copy.lede}</p>
            </div>
          </header>
          <QuizRunner locale={locale} defaultSource="model" />
        </main>
      </div>
    </div>
  );
}
