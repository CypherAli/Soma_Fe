import { setRequestLocale } from "next-intl/server";
import AnimalPage from "@/components/home/AnimalPage";
import type { Loc } from "@/lib/homeContent";
import "../../home.css";

export default async function AnimalsPage({params}:{params:Promise<{locale:string}>}){const{locale}=await params;setRequestLocale(locale);return <AnimalPage locale={locale as Loc}/>}
