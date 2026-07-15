import { setRequestLocale } from "next-intl/server";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import InfoPanel from "@/components/InfoPanel";
import AnatomyViewer from "@/components/viewer/AnatomyViewer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex h-full flex-col bg-slate-950">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 bg-slate-950">
          <AnatomyViewer />
        </main>
        <InfoPanel />
      </div>
    </div>
  );
}
