import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import MedicalKnowledgePage from "@/components/pathology/MedicalKnowledgePage";
import type { Loc } from "@/lib/homeContent";
import "../../home.css";
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;setRequestLocale(locale);return <div className="bd"><HomeNav/><MedicalKnowledgePage locale={locale as Loc}/></div>}
