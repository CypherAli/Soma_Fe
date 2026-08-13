import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import InfoPanel from "@/components/InfoPanel";
import ModelViewer from "@/components/viewer/ModelViewer";
import ViewerPathologyDeepLink from "@/components/pathology/ViewerPathologyDeepLink";
import "../../home.css";

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      {/* Đọc query ?structure= nên phải bọc Suspense: useSearchParams làm cả
          trang bỏ prerender tĩnh, `next build` dừng hẳn với lỗi
          missing-suspense-with-csr-bailout. Component này chỉ chạy hiệu ứng và
          trả về null nên fallback rỗng là đủ. */}
      <Suspense fallback={null}>
        <ViewerPathologyDeepLink />
      </Suspense>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 bg-[var(--surf-3)]">
          <ModelViewer />
        </main>
        <InfoPanel />
      </div>
    </div>
  );
}
