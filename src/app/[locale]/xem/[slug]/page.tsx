"use client";

import { use } from "react";
import { Link } from "@/i18n/navigation";
import ArmScenePage from "@/components/home/ArmScenePage";
import { getSceneModule } from "@/lib/sceneModules";
import { regionViewerConfig } from "@/lib/scenes/regions";
import "../../../home.css";

// Route dùng chung cho MỌI scene "vùng cơ thể nhiều lớp": /xem/<slug>.
// Trước đây mỗi model flagship phải có một file route riêng (xem-canh-tay,
// xem-dau, xem-co…) — với hơn hai chục vùng thì cách đó không còn hợp lý.
export default function XemVung({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const mod = getSceneModule(slug);
  const view = regionViewerConfig[slug];
  // Slug lạ (gõ tay sai, link cũ, hoặc scene vừa bị đổi tên): trước đây trả về
  // `null` — trình duyệt hiện một TRANG ĐEN TRỐNG không chữ nào, trông hệt như
  // trang hỏng. Nay báo rõ và chỉ đường về danh mục.
  if (!mod?.modelFile || !view) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--surf-3)] p-8 text-center">
        <p className="text-lg font-semibold text-[var(--body-fg)]">
          Không có mô hình nào ứng với đường dẫn “{slug}”.
        </p>
        <p className="max-w-md text-sm text-[var(--muted)]">
          Đường dẫn có thể đã đổi hoặc mô hình chưa được dựng. Xem danh sách mô hình
          hiện có ở trang Tất cả mô hình.
        </p>
        <Link href="/giai-phau/tat-ca" className="rounded-full border border-[var(--line)] px-5 py-2 text-sm text-[var(--body-fg)] hover:bg-[var(--surf-2)]">
          Tất cả mô hình
        </Link>
      </div>
    );
  }

  return (
    <ArmScenePage
      slug={slug}
      modelUrl={mod.modelFile}
      cats={view.cats}
      defaultFaded={view.faded}
    />
  );
}
