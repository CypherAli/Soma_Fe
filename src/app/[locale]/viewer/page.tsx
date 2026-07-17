import { setRequestLocale } from "next-intl/server";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import InfoPanel from "@/components/InfoPanel";
import ModelViewer from "@/components/viewer/ModelViewer";
import "../../home.css";

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 bg-[var(--surf-3)]">
          <ModelViewer />
        </main>
        <InfoPanel />
      </div>
    </div>
  );
}
