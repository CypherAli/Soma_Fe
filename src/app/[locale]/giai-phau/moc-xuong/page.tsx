
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { categoryData } from "@/lib/exploreContent";
import ExplorePage from "@/components/explore/ExplorePage";
import type { Loc } from "@/lib/homeContent";

/**
 * "Mốc xương, nguyên uỷ & bám tận" — mục trong sidebar Giải phẫu, trước đây
 * chưa có trang nên đã bị gỡ khỏi sidebar.
 *
 * Dùng chung khung duyệt với các mục khác (`ExplorePage`) và bày hai model dựng
 * riêng cho mục này: bộ xương chi trên và chi dưới kèm TOÀN BỘ mảng nguyên uỷ –
 * bám tận của các cơ, lấy từ hệ 2 của Z-Anatomy.
 */
export default async function MocXuongPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = (hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale) as Loc;

  return <ContentSurface scope="src/app/[locale]/giai-phau/moc-xuong/page.tsx"><ExplorePage data={categoryData["moc-xuong"]} locale={locale} /></ContentSurface>;
}
