"use client";




import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { ContentSurface } from "@/components/content/ContentProvider";
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
import { consumeLocaleTransition } from "@/lib/localeTransition";

type CatKey = "skin" | "muscle" | "brain" | "artery" | "vein" | "nerve" | "lymph" | "eye" | "organ" | "bone";

const SCENE_TEXT: Record<Loc, { back: string; reference: string; labels: string; guide: string; source: string; tips: string[]; sourceBody: string }> = bindContentSource("data:src/components/home/ArmScenePage.tsx#SCENE_TEXT", {
  vi: { back: "Quay lại", reference: "Mô hình nhiều lớp · đối chiếu Terminologia Anatomica và giáo trình ĐH Y Hà Nội", labels: "Nhãn", guide: "Hướng dẫn", source: "Nguồn dữ liệu", tips: ["Kéo chuột để xoay, lăn để phóng to.", "Chọn một cấu trúc trên mô hình hoặc trong danh sách để xem thông tin và thao tác riêng.", "Dùng bảng Lớp giải phẫu để ẩn, hiện hoặc làm mờ từng lớp.", "Thứ tự bóc lớp: Da → Cơ → Mạch → Thần kinh → Xương."], sourceBody: "Mô hình từ Z-Anatomy (CC BY-SA); thuật ngữ theo Terminologia Anatomica, đối chiếu Giáo trình Giải phẫu người — ĐH Y Hà Nội." },
  en: { back: "Back", reference: "Multi-layer model · aligned with Terminologia Anatomica and Hanoi Medical University references", labels: "Structures", guide: "How to use", source: "Data source", tips: ["Drag to rotate and scroll to zoom.", "Select a structure in the model or list to inspect and control it.", "Use Anatomical layers to show, hide, or fade each tissue layer.", "Suggested dissection order: Skin → Muscle → Vessels → Nerves → Bone."], sourceBody: "Model derived from Z-Anatomy (CC BY-SA); terminology follows Terminologia Anatomica and is cross-checked against Hanoi Medical University anatomy references." },
  zh: { back: "返回", reference: "多层模型 · 参照 Terminologia Anatomica 与河内医科大学教材", labels: "结构", guide: "使用说明", source: "数据来源", tips: ["拖动以旋转，滚动以缩放。", "在模型或列表中选择结构以查看并单独控制。", "使用解剖层面板显示、隐藏或淡化各组织层。", "建议剥离顺序：皮肤 → 肌肉 → 血管 → 神经 → 骨。"], sourceBody: "模型源自 Z-Anatomy（CC BY-SA）；术语遵循 Terminologia Anatomica，并参照河内医科大学解剖教材。" },
});

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
  const cmsContent = useContent();
  const SCENE_TEXT = cmsContent.resolve(cmsSourceSCENE_TEXT());

  const locale = useLocale() as Loc;
  const mod = getSceneModule(slug);
  const selected = useAnatomyStore((s) => s.selected);
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const resetViewer = useAnatomyStore((s) => s.resetViewer);

  // Vào scene mới: xoá sạch Ẩn/Mờ/Cô lập/lựa chọn của scene trước. KHÔNG truyền
  // patch hệ vì viewer vùng lọc theo LỚP (bảng Lớp giải phẫu) chứ không theo
  // `visibleSystems` — truyền patch sẽ tắt nhầm hệ cho các trang dùng store này.
  useEffect(() => {
    if (!mod) return;
    if (consumeLocaleTransition()) {
      const current = useAnatomyStore.getState().selected;
      const hotspot = current && mod.hotspots.find((item) => sanitizeGltfName(item.meshName) === current.id);
      if (current && hotspot) {
        useAnatomyStore.getState().setSelected({
          ...current,
          name: hotspot.label ? pick(hotspot.label, locale) : current.name,
          latin: hotspot.latinName ?? current.latin,
          description: hotspot.note ? pick(hotspot.note, locale) : current.description,
        });
      }
      return;
    }
    resetViewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, locale, mod]);

  if (!mod) return null;
  const text = SCENE_TEXT[locale];

  return <ContentSurface scope="src/components/home/ArmScenePage.tsx">{(
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
          {text.back}
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
              {text.reference}
            </p>
            <p className="text-sm leading-relaxed text-[var(--body-fg)]">
              {pick(mod.description, locale)}
            </p>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {text.labels}
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
              {text.guide}
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-[var(--body-fg)]">{text.tips.map((tip) => <li key={tip}>• {tip}</li>)}</ul>
            <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {text.source}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              {text.sourceBody}
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
  )}</ContentSurface>;
}

function cmsSourceSCENE_TEXT() { return SCENE_TEXT; }
