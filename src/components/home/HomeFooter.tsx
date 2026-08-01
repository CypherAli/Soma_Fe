import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { Link } from "@/i18n/navigation";

export default function HomeFooter({ locale }: { locale: Loc }) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="grid">
          <div>
            <div className="brandmark">Soma&nbsp;3D</div>
            <p className="lic">{pick(C.footer.lic, locale)}</p>
          </div>
          <div>
            <h4>{pick(C.footer.productH, locale)}</h4>
            {C.footer.product.map((item) => (
              <Link key={item.href} href={item.href}>
                {pick(item.label, locale)}
              </Link>
            ))}
          </div>
          <div>
            <h4>{pick(C.footer.resourcesH, locale)}</h4>
            {C.footer.resources.map((item) =>
              item.external ? (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                  {pick(item.label, locale)}
                </a>
              ) : (
                <Link key={item.href} href={item.href}>
                  {pick(item.label, locale)}
                </Link>
              ),
            )}
          </div>
          <div>
            <h4>{pick(C.footer.languageH, locale)}</h4>
            {C.footer.languages.map((lang) => (
              <Link key={lang.loc} href="/" locale={lang.loc}>
                {lang.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="bottom">
          <span>© 2026 Soma 3D · Hà Nội</span>
          <span>Tài liệu phục vụ mục đích học tập</span>
        </div>
      </div>
    </footer>
  );
}
