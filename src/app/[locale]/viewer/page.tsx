
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import AtlasViewer from "@/components/viewer/atlas/AtlasViewer";
import "../../home.css";
import "./atlas.css";

/**
 * Trang toàn thân — dựng bằng bộ atlas BodyParts3D chuyển từ dự án human-atlas.
 *
 * KHÔNG có <TopBar>/<Sidebar>/<InfoPanel>: atlas là một mặt phẳng tràn viền,
 * mọi điều khiển (bảng lớp, tìm kiếm, tách rời, tấm chi tiết) đều nổi lên trên
 * cảnh 3D. Thêm một thanh header riêng phía trên vừa cắt mất chiều cao khung
 * hình — model nhỏ đi khoảng 11% — vừa tạo ra hai lớp điều hướng chồng nhau.
 * Logo và bộ đổi ngôn ngữ đã được đưa vào chính lớp nổi đó (xem AtlasViewer).
 *
 * Các trang mô hình chuyên đề (`/giai-phau/mo-hinh/*`) vẫn dùng Z-Anatomy và
 * vẫn giữ TopBar như cũ.
 *
 * Dữ liệu: BodyParts3D 4.0 © Database Center for Life Science, CC BY 4.0
 * (xem public/human-atlas/ATTRIBUTION.md). Mã giao diện và bộ dựng hình chuyển
 * từ human-atlas (MIT).
 */
export default async function ViewerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContentSurface scope="src/app/[locale]/viewer/page.tsx">{(
    <div className="bd">
      <AtlasViewer />
    </div>
  )}</ContentSurface>;
}
