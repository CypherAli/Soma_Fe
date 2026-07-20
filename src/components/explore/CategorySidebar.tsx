import { pick, homeContent, type Loc } from "@/lib/homeContent";
import { sidebarAllModels, sidebarAnatomy, type CategorySlug } from "@/lib/exploreContent";
import { systemGroups, scenesOfSystem } from "@/lib/catalog";
import { Link } from "@/i18n/navigation";
import { Icon } from "../home/IconSprite";

/**
 * Sidebar danh mục của trang Khám phá.
 *
 * Trước đây có 3 khối "Chuyên khoa" (20 mục), "Cộng đồng", "Bộ sưu tập
 * chuyên gia" render bằng <div> không dẫn đi đâu — đã bỏ. Mọi mục còn lại
 * đều là <Link> tới trang có nội dung thật.
 */
export default function CategorySidebar({
  locale,
  active,
}: {
  locale: Loc;
  /** Slug đang mở — khớp CategorySlug hoặc slug hệ cơ quan. */
  active: CategorySlug | string;
}) {
  return (
    <aside className="cat-sidebar">
      <div className="cat-sidebar-title">
        {pick(homeContent.mega.anatomyH, locale)}
        <Icon id="i-chev" />
      </div>

      <Link
        href={sidebarAllModels.href}
        className={`cat-item${sidebarAllModels.slug === active ? " active" : ""}`}
      >
        <Icon id={sidebarAllModels.icon} />
        {pick(sidebarAllModels.label, locale)}
      </Link>

      <p className="cat-label">{pick(homeContent.mega.anatomyH, locale)}</p>
      {sidebarAnatomy.map((item) => (
        <Link
          key={item.slug}
          href={item.href}
          className={`cat-item${item.slug === active ? " active" : ""}`}
        >
          <Icon id={item.icon} />
          {pick(item.label, locale)}
        </Link>
      ))}

      <p className="cat-label">{pick(homeContent.mega.systemsH, locale)}</p>
      {systemGroups.map((group) => (
        <Link
          key={group.key}
          href={`/giai-phau/${group.slug}`}
          className={`cat-item${group.slug === active ? " active" : ""}`}
        >
          <Icon id={group.icon} />
          {pick(group.label, locale)}
          <span className="cat-count">{scenesOfSystem(group.key).length}</span>
        </Link>
      ))}
    </aside>
  );
}
