"use client";




import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { ContentSurface } from "@/components/content/ContentProvider";
import { FormEvent, useState } from "react";
import { homeContent as C, pick, type Loc, type T3 } from "@/lib/homeContent";
import { Link } from "@/i18n/navigation";

const copy = bindContentSource("data:src/components/home/HomeFooter.tsx#copy", {
  newsletter: { vi: "Đăng ký ngay để nhận những thông tin mới nhất", en: "Subscribe now for the latest updates", zh: "立即订阅，获取最新资讯" },
  email: { vi: "Địa chỉ email của bạn", en: "Your email address", zh: "您的电子邮箱" },
  subscribe: { vi: "Đăng ký", en: "Subscribe", zh: "订阅" },
  subscribed: { vi: "Đã ghi nhận email", en: "Email saved", zh: "邮箱已保存" },
  copyright: { vi: "© 2026 Soma Atlas · Hà Nội", en: "© 2026 Soma Atlas · Hanoi", zh: "© 2026 Soma Atlas · 河内" },
} satisfies Record<string, T3>);

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    Facebook: "M13.135 22.9v-9.1h3.05l.455-3.55h-3.505V7.98c0-1.03.285-1.73 1.76-1.73h1.88V3.07c-.325-.043-1.44-.14-2.74-.14-2.71 0-4.57 1.655-4.57 4.695v2.62H6.4v3.55h3.065v9.1h3.67Z",
    Instagram: "M7.27 2h9.46A5.28 5.28 0 0 1 22 7.27v9.46A5.28 5.28 0 0 1 16.73 22H7.27A5.28 5.28 0 0 1 2 16.73V7.27A5.28 5.28 0 0 1 7.27 2Zm-.18 2A3.1 3.1 0 0 0 4 7.09v9.82A3.1 3.1 0 0 0 7.09 20h9.82A3.1 3.1 0 0 0 20 16.91V7.09A3.1 3.1 0 0 0 16.91 4H7.09ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.15 5.15 0 0 1 12 6.85Zm0 2A3.15 3.15 0 1 0 15.15 12 3.15 3.15 0 0 0 12 8.85Zm5.37-3.5a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Z",
    TikTok: "M14.5 2h3.2c.2 1.9 1.2 3.7 2.8 4.8v3.25a9.1 9.1 0 0 1-5.95-2.2v7.25a6.1 6.1 0 1 1-6.1-6.1c.38 0 .76.04 1.12.11v3.3a2.9 2.9 0 1 0 1.75 2.66V2h3.18Z",
    X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  };
  return <ContentSurface scope="src/components/home/HomeFooter.tsx"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg></ContentSurface>;
}

export default function HomeFooter({ locale }: { locale: Loc }) {
  const cmsContent = useContent();
  const C = cmsContent.resolve(cmsSourceC());
  const copy = cmsContent.resolve(cmsSourcecopy());

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const aboutGroup = C.footer.groups.find((group) => group.key === "about")!;
  const servicesGroup = C.footer.groups.find((group) => group.key === "services")!;
  const supportingGroups = C.footer.groups.filter((group) => !["about", "services"].includes(group.key));

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    if (!email || saving) return;
    setSaving(true); setSaved(false); setSaveError(false);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }), signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error("Subscription failed");
      setSaved(true);
    } catch { setSaveError(true); }
    finally { setSaving(false); }
  }

  return <ContentSurface scope="src/components/home/HomeFooter.tsx">{(
    <footer className="foot soma-footer">
      <div className="wrap">
        <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
          <div>
            <h2 id="footer-newsletter-title">{pick(copy.newsletter, locale)}</h2>
          </div>
          <form className="footer-subscribe" onSubmit={subscribe}>
            <label className="sr-only" htmlFor="footer-email">{pick(copy.email, locale)}</label>
            <input id="footer-email" name="email" type="email" required maxLength={254} disabled={saving} placeholder={pick(copy.email, locale)} onInput={() => { setSaved(false); setSaveError(false); }} />
            <button type="submit" disabled={saving || saved}>{saving ? pick({vi:"Đang lưu…",en:"Saving…",zh:"保存中…"},locale) : saved ? pick(copy.subscribed, locale) : pick(copy.subscribe, locale)} <span aria-hidden="true">→</span></button>
            {saveError && <span role="status" style={{gridColumn:"1 / -1",fontSize:12}}>{pick({vi:"Chưa lưu được email. Vui lòng thử lại.",en:"Could not save your email. Please try again.",zh:"邮箱尚未保存，请重试。"},locale)}</span>}
          </form>
        </section>

        <div className="footer-primary-grid">
          <section className="footer-about">
            <h3>{locale === "vi" ? "Về Soma" : pick(aboutGroup.heading, locale)}</h3>
            <p className="footer-about-copy">{pick(C.hero.lede, locale)}</p>
          </section>
          {[aboutGroup, servicesGroup].map((group) => (
            <nav key={group.key} aria-label={pick(group.heading, locale)}>
              <h4>{pick(group.heading, locale)}</h4>
              {group.links.map((item, i) => item.external
                ? <a key={item.href + "#" + i} href={item.href} target="_blank" rel="noopener noreferrer">{pick(item.label, locale)}</a>
                : item.href.startsWith("mailto:")
                  || item.href.startsWith("tel:")
                  ? <a key={item.href + "#" + i} href={item.href}>{pick(item.label, locale)}</a>
                  : <Link key={item.href + "#" + i} href={item.href}>{pick(item.label, locale)}</Link>)}
            </nav>
          ))}
        </div>

        <div className="footer-secondary-grid">
          {supportingGroups.map((group) => (
            <nav key={group.key} className={group.key === "connect" ? "footer-connect" : undefined} aria-label={pick(group.heading, locale)}>
              <h4>{pick(group.heading, locale)}</h4>
              {group.links.map((item, i) => item.external
                ? <a key={item.href + "#" + i} href={item.href} target="_blank" rel="noopener noreferrer">{pick(item.label, locale)}</a>
                : item.href.startsWith("mailto:") || item.href.startsWith("tel:")
                  ? <a key={item.href + "#" + i} href={item.href}>{pick(item.label, locale)}</a>
                  : <Link key={item.href + "#" + i} href={item.href}>{pick(item.label, locale)}</Link>)}
              {group.key === "connect" && <div className="footer-social">
                <p>{pick(C.footer.socialH, locale)}</p>
                <div>{C.footer.social.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}><SocialIcon name={social.label} /></a>)}</div>
              </div>}
            </nav>
          ))}
        </div>

        <div className="bottom">
          <span>{pick(copy.copyright, locale)}</span>
        </div>
      </div>
    </footer>
  )}</ContentSurface>;
}

function cmsSourceC() { return C; }
function cmsSourcecopy() { return copy; }
