"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { pick, homeContent as C, type Loc } from "@/lib/homeContent";
import { systemByKey, type CatalogScene } from "@/lib/catalog";
import { Icon } from "./IconSprite";

/**
 * Hàng card mô hình cuộn ngang.
 *
 * Trước đây 2 mũi tên là <span> trang trí không làm gì. Giờ chúng cuộn thật
 * và tự vô hiệu hoá khi đã ở đầu/cuối hàng.
 */
export default function SceneCarousel({
  title,
  subtitle,
  scenes,
  locale,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  scenes: CatalogScene[];
  locale: Loc;
  viewAllHref?: string;
}) {
  const cmsContent = useContent();
  const C = cmsContent.resolve(cmsSourceC());

  const rowRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncArrows = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    // Dung sai 1px cho sai số làm tròn khi zoom trình duyệt
    setAtStart(row.scrollLeft <= 1);
    setAtEnd(row.scrollLeft + row.clientWidth >= row.scrollWidth - 1);
  }, []);

  useEffect(() => {
    syncArrows();
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(syncArrows);
    observer.observe(row);
    return () => observer.disconnect();
  }, [syncArrows, scenes.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
    // Không chỉ dựa vào sự kiện `scroll`: có môi trường không phát sự kiện này
    // khi cuộn bằng script, làm nút kẹt trạng thái bật/tắt. Dùng setTimeout chứ
    // KHÔNG dùng requestAnimationFrame — rAF bị treo hoàn toàn khi tài liệu ở
    // trạng thái hidden, đúng lúc ta vẫn cần trạng thái nút chính xác.
    for (const delay of [80, 200, 400, 700]) setTimeout(syncArrows, delay);
  };

  if (scenes.length === 0) return null;

  return <ContentSurface scope="src/components/home/SceneCarousel.tsx">{(
    <section className="sec">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head-text">
            <h2>{title}</h2>
            {subtitle && <p className="sec-sub">{subtitle}</p>}
          </div>
          <div className="sec-head-tools">
            {viewAllHref && (
              <Link href={viewAllHref} className="sec-all">
                {pick(C.sections.viewAll, locale)}
              </Link>
            )}
            <div className="arrows">
              <button
                type="button"
                className="arrow"
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Trước"
              >
                <Icon id="i-left" />
              </button>
              <button
                type="button"
                className="arrow"
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Sau"
              >
                <Icon id="i-right" />
              </button>
            </div>
          </div>
        </div>

        <div className="row scroller" ref={rowRef} onScroll={syncArrows}>
          {scenes.map((scene) => (
            <SceneCard key={scene.slug} scene={scene} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )}</ContentSurface>;
}

export function SceneCard({ scene, locale }: { scene: CatalogScene; locale: Loc }) {
  const cmsContent = useContent();
  const C = cmsContent.resolve(cmsSourceC());

  const group = systemByKey.get(scene.system);
  return <ContentSurface scope="src/components/home/SceneCarousel.tsx">{(
    <Link href={scene.href} className="card sm">
      <div className={`img ${group?.accent ?? "g-organ"}`}>
        {scene.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={scene.thumb} alt="" loading="lazy" />
        ) : (
          <span className="thumb-icon">
            <Icon id={group?.icon ?? "i-grid"} />
          </span>
        )}
      </div>
      <div className="cap">
        <div className="t">{pick(scene.title, locale)}</div>
        <div className="s">
          {group ? pick(group.label, locale) : ""}
          {scene.structureCount > 0 && (
            <> · {scene.structureCount} {pick(C.sections.structureCount, locale)}</>
          )}
        </div>
      </div>
    </Link>
  )}</ContentSurface>;
}

function cmsSourceC() { return C; }
