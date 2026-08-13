import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import PathologyLibrary from "@/components/pathology/PathologyLibrary";
import type { Loc } from "@/lib/homeContent";
import "../../home.css";

export default async function PathologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return <div className="bd"><HomeNav/><PathologyLibrary locale={locale as Loc}/></div>;
}
