
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import HomeFooter from "@/components/home/HomeFooter";
import MedicalKnowledgePage from "@/components/pathology/MedicalKnowledgePage";
import type { Loc } from "@/lib/homeContent";
import "../../home.css";
export default async function Page({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{file?:string;page?:string}>}){const {locale}=await params;setRequestLocale(locale);const query=await searchParams;const file=query.file;const initialDocument=file?.endsWith(".pdf")&&!/[\\/]/.test(file)?{file,page:Math.max(1,Number.parseInt(query.page??"1",10)||1),title:file.replace(/\.pdf$/i,"")}:undefined;return <ContentSurface scope="src/app/[locale]/tai-lieu-y-khoa/page.tsx"><div className="bd"><IconSprite /><HomeNav/><MedicalKnowledgePage locale={locale as Loc} initialDocument={initialDocument}/><HomeFooter locale={locale as Loc}/></div></ContentSurface>}
