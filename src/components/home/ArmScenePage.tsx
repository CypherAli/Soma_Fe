"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import { getSceneModule } from "@/lib/sceneModules";
import { sanitizeGltfName } from "@/components/viewer/Hotspots";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import InfoPanel from "@/components/InfoPanel";
import ArmViewer from "./ArmViewer";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";
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
  const selected = useAnatomyStore((s) => s.selected);
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const resetViewer = useAnatomyStore((s) => s.resetViewer);

  // Vào scene mới: xoá sạch Ẩn/Mờ/Cô lập/lựa chọn của scene trước. KHÔNG truyền
  // patch hệ vì viewer vùng lọc theo LỚP (bảng Lớp giải phẫu) chứ không theo
  // `visibleSystems` — truyền patch sẽ tắt nhầm hệ cho các trang dùng store này.
  useEffect(() => {
    resetViewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
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
              {mod.hotspots.map((h) => {
                // id = tên mesh SAU khi GLTFLoader sanitize — đúng khoá mà
                // Ẩn/Làm mờ/Cô lập trong InfoPanel dùng để tra trong scene.
                const id = sanitizeGltfName(h.meshName);
                const active = selected?.id === id;
                return (
                  <button
                    key={h.key}
                    type="button"
                    onClick={() =>
                      setSelected(
                        active
                          ? null
                          : {
                              id,
                              name: h.label ? pick(h.label, locale) : h.meshName,
                              latin: h.latinName ?? h.meshName.replace(/_/g, " "),
                              description: h.note ? pick(h.note, locale) : undefined,
                            },
                      )
                    }
                    className={`block w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      active
                        ? "bg-[color-mix(in_srgb,var(--blue)_10%,white)]"
                        : "hover:bg-[var(--surf-2)]"
                    }`}
                  >
                    <div>
                      <span
                        className={`text-sm font-semibold ${
                          active ? "text-[var(--blue)]" : "text-[var(--body-fg)]"
                        }`}
                      >
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hướng dẫn + nguồn dời xuống đây: cột phải nay dành cho THÔNG TIN
              BỘ PHẬN (Ẩn/Làm mờ/Cô lập + bệnh lý) như trang model mặt cắt. */}
          <div className="border-t border-[var(--line)] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Hướng dẫn
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-[var(--body-fg)]">
              <li>• Kéo chuột để <b>xoay</b>, lăn để <b>phóng to</b>.</li>
              <li>
                • <b>Bấm vào một cấu trúc</b> trên mô hình (hoặc một nhãn ở trên) để xem tên và{" "}
                <b>Ẩn / Làm mờ / Cô lập</b> riêng cấu trúc đó ở cột phải.
              </li>
              <li>• Bảng <b>Lớp giải phẫu</b> (góc trên-phải): bấm <b>Ẩn/Hiện</b> hoặc <b>Rõ/Mờ</b> cho cả một lớp để bóc tách.</li>
              <li>• Thứ tự peel: Da → Cơ → Mạch → Thần kinh → Xương.</li>
            </ul>
            <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Nguồn dữ liệu
            </h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              Mô hình dựng từ <b>Z-Anatomy</b> (CC BY-SA), thuật ngữ theo <b>Terminologia Anatomica</b>,
              đối chiếu <b>Giáo trình Giải phẫu người — ĐH Y Hà Nội</b>.
            </p>
          </div>
        </aside>

        {/* 3D giữa — ArmViewer (bảng lớp nổi góc trên-phải) */}
        <main className="relative flex-1 bg-[var(--surf-3)]">
          <ArmViewer
            url={modelUrl}
            cats={cats}
            defaultFaded={defaultFaded}
            hotspots={mod.hotspots}
          />
        </main>

        {/* Panel phải: thông tin bộ phận đang chọn + Ẩn/Làm mờ/Cô lập + bệnh lý */}
        <InfoPanel />
      </div>
    </div>
  );
}
