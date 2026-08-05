"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import { getSceneModule } from "@/lib/sceneModules";
import ArmViewer from "./ArmViewer";
import "../../app/home.css";

type CatKey = "skin" | "muscle" | "brain" | "artery" | "vein" | "nerve" | "lymph" | "eye" | "organ" | "bone";

export default function ArmScenePage({
  slug = "giai-phau-canh-tay",
  modelUrl = "/models/arm.glb",
  cats,
  defaultFaded,
}: {
  slug?: string;
  modelUrl?: string;
  cats?: CatKey[];
  defaultFaded?: CatKey[];
}) {
  const locale = useLocale() as Loc;
  const mod = getSceneModule(slug);
  if (!mod) return null;

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <Link
          href="/nguoi"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-[var(--body-fg)] transition-colors hover:bg-[var(--surf-2)]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </Link>
        <h1 className="text-sm font-semibold text-[var(--ink)]">{pick(mod.title, locale)}</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar trái: mô tả + nhãn */}
        <aside
          className="flex w-80 shrink-0 flex-col overflow-y-auto border-r border-[var(--line)] bg-[var(--surf)]"
          data-lenis-prevent
        >
          <div className="space-y-3 border-b border-[var(--line)] p-4">
            <h2 className="text-lg font-semibold text-[var(--ink)]">{pick(mod.title, locale)}</h2>
            <p className="text-[11px] italic text-[var(--muted-2)]">
              Mô hình nhiều lớp · đối chiếu Terminologia Anatomica & giáo trình ĐH Y Hà Nội
            </p>
            <p className="text-sm leading-relaxed text-[var(--body-fg)]">
              {pick(mod.description, locale)}
            </p>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Nhãn
            </h3>
            <div className="space-y-1">
              {mod.hotspots.map((h) => (
                <div key={h.key} className="rounded-lg px-3 py-2 hover:bg-[var(--surf-2)]">
                  <div>
                    <span className="text-sm font-semibold text-[var(--body-fg)]">
                      {h.label ? pick(h.label, locale) : h.meshName}
                    </span>
                    {h.latinName && (
                      <span className="ml-2 text-xs italic text-[var(--muted)]">{h.latinName}</span>
                    )}
                  </div>
                  {h.note && (
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted-2)]">
                      {pick(h.note, locale)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* 3D giữa — ArmViewer (bảng lớp nổi góc trên-phải) */}
        <main className="relative flex-1 bg-[var(--surf-3)]">
          <ArmViewer url={modelUrl} cats={cats} defaultFaded={defaultFaded} />
        </main>

        {/* Panel phải: hướng dẫn + nguồn */}
        <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-[var(--line)] bg-[var(--surf)] p-4 lg:flex">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
            Hướng dẫn
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--body-fg)]">
            <li>• Kéo chuột để <b>xoay</b>, lăn để <b>phóng to</b>.</li>
            <li>• Bảng <b>Lớp giải phẫu</b> (góc trên-phải): bấm <b>Ẩn/Hiện</b> hoặc <b>Rõ/Mờ</b> từng lớp để bóc tách.</li>
            <li>• Thứ tự peel: Da → Cơ → Mạch → Thần kinh → Xương.</li>
          </ul>
          <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
            Nguồn dữ liệu
          </h3>
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            Mô hình dựng từ <b>Z-Anatomy</b> (CC BY-SA), thuật ngữ theo <b>Terminologia Anatomica</b>,
            đối chiếu <b>Giáo trình Giải phẫu người — ĐH Y Hà Nội</b>.
          </p>
        </aside>
      </div>
    </div>
  );
}
