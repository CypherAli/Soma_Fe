import { pick, homeContent, type Loc } from "@/lib/homeContent";
import { sidebarAnatomy, type CategorySlug } from "@/lib/exploreContent";
import { Link } from "@/i18n/navigation";
import { Icon } from "../home/IconSprite";

export default function CategorySidebar({
  locale,
  active,
}: {
  locale: Loc;
  active: CategorySlug;
}) {
  return (
    <aside className="cat-sidebar">
      <div className="cat-sidebar-title">
        {pick(homeContent.mega.anatomyH, locale)}
        <Icon id="i-chev" />
      </div>
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
    </aside>
  );
}
