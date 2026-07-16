import { pick, homeContent, type Loc } from "@/lib/homeContent";
import { sidebarAllModels, sidebarAnatomy, type CategorySlug } from "@/lib/exploreContent";
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

      <p className="cat-label">{pick(homeContent.mega.specialtiesH, locale)}</p>
      {homeContent.mega.specialties.map((sp, i) => (
        <div key={i} className="cat-item">
          <Icon id={sp.icon} />
          {pick(sp.label, locale)}
        </div>
      ))}

      <p className="cat-label">{pick(homeContent.mega.communityH, locale)}</p>
      {homeContent.mega.community.map((c, i) => (
        <div key={i} className="cat-item">
          <Icon id={c.icon} />
          {pick(c.label, locale)}
        </div>
      ))}

      <p className="cat-label">{pick(homeContent.mega.collectionsH, locale)}</p>
      {homeContent.collections.map((c, i) => (
        <div key={i} className="cat-item cat-collection">
          <div className="t">{pick(c.title, locale)}</div>
          <div className="c">{pick(c.author, locale)}</div>
        </div>
      ))}
    </aside>
  );
}
