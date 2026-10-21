import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ContentSurface } from "@/components/content/ContentProvider";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { getContent } from "@/lib/content/server";
import { pick, type Loc } from "@/lib/homeContent";
import { informationGroups, informationPages, informationHref, type InformationGroup } from "@/lib/informationPages";
import "../../app/home.css";
import "./information.css";

export type InformationParams = Promise<{ locale: string; slug: string }>;

async function pageData(group: InformationGroup, params: InformationParams) {
  const { locale: requestedLocale, slug } = await params;
  const locale: Loc = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
  setRequestLocale(locale);
  const content = await getContent();
  const pages = content.resolve(informationPages);
  const page = pages[slug];
  if (!Object.hasOwn(informationPages, slug) || !page || page.group !== group) notFound();
  return { locale, slug, page, pages };
}

export async function informationMetadata(group: InformationGroup, params: InformationParams): Promise<Metadata> {
  const { locale, page } = await pageData(group, params);
  return { title: `${pick(page.title, locale)} | Soma Atlas`, description: pick(page.intro, locale) };
}

export async function renderInformationPage(group: InformationGroup, params: InformationParams) {
  const { locale, slug, page, pages } = await pageData(group, params);
  const groupTitle = pick(informationGroups[group], locale);
  const siblings = Object.entries(pages).filter(([, item]) => item.group === group);

  return <ContentSurface scope="src/components/information/InformationPage.tsx">
    <div className="bd">
      <IconSprite />
      <HomeNav />
      <main className="info-page wrap">
        <div className="info-banner">
          <div>
            <p>Soma Atlas</p>
            <h2>{groupTitle}</h2>
            <span>{locale === "vi" ? "Quan sát cấu trúc · Hiểu mối liên hệ · Học có dẫn nguồn" : locale === "en" ? "Observe structures · Understand relationships · Learn with references" : "观察结构 · 理解联系 · 有据学习"}</span>
          </div>
          <Image className="info-emblem-default" src="/brand/soma-emblem.png" alt="" width={130} height={130} priority />
          <Image className="info-emblem-light" src="/brand/soma-emblem-light.png" alt="" width={130} height={130} />
        </div>
        <nav className="info-breadcrumb" aria-label={locale === "vi" ? "Đường dẫn trang" : locale === "en" ? "Breadcrumb" : "面包屑导航"}>
          <Link href="/">{locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "首页"}</Link>
          <span aria-hidden="true">/</span>
          <Link href={informationHref(siblings[0][0], siblings[0][1])}>{groupTitle}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{pick(page.title, locale)}</span>
        </nav>
        <div className="info-layout">
          <aside className="info-sidebar">
            <nav aria-label={groupTitle}>
              <h2>{groupTitle}</h2>
              {siblings.map(([key, item]) => <Link key={key} href={informationHref(key, item)} aria-current={key === slug ? "page" : undefined}>{pick(item.title, locale)}</Link>)}
              {group === "chinh-sach" && <>
                <Link href="/nguon-du-lieu">{locale === "vi" ? "Nguồn dữ liệu" : locale === "en" ? "Data sources" : "数据来源"}</Link>
                <Link href="/dieu-khoan">{locale === "vi" ? "Điều khoản sử dụng" : locale === "en" ? "Terms of use" : "使用条款"}</Link>
                <Link href="/chinh-sach">{locale === "vi" ? "Chính sách bảo mật" : locale === "en" ? "Privacy policy" : "隐私政策"}</Link>
              </>}
            </nav>
            <div className="info-contact">
              <p>{locale === "vi" ? "Cần hỗ trợ thêm?" : locale === "en" ? "Need more help?" : "需要更多帮助？"}</p>
              <a href="mailto:trinhviethoangawm@gmail.com">trinhviethoangawm@gmail.com</a>
              <a href="tel:0848565650">0848 565 650</a>
            </div>
          </aside>
          <article className="info-article">
            <header>
              <h1>{pick(page.title, locale)}</h1>
              <p className="info-intro">{pick(page.intro, locale)}</p>
            </header>
            {page.sections.map((section, index) => <section key={index} className="info-section">
              <h2>{pick(section.title, locale)}</h2>
              {section.paragraphs.map((paragraph, i) => <p key={i}>{pick(paragraph, locale)}</p>)}
              {section.links && <div className="info-links">
                {section.links.map((link) => link.external || /^(mailto:|tel:)/.test(link.href)
                  ? <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}>{pick(link.label, locale)} <span aria-hidden="true">↗</span></a>
                  : <Link key={link.href} href={link.href}>{pick(link.label, locale)} <span aria-hidden="true">→</span></Link>)}
              </div>}
            </section>)}
          </article>
        </div>
      </main>
      <HomeFooter locale={locale} />
    </div>
  </ContentSurface>;
}
