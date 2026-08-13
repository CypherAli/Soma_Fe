"use client";

import { useState } from "react";
import { pick, homeContent, type Loc } from "@/lib/homeContent";
import { sidebarAllModels, sidebarAnatomy, type CategorySlug } from "@/lib/exploreContent";
import { systemGroups, scenesOfSystem } from "@/lib/catalog";
import { Link } from "@/i18n/navigation";
import AtlasIcon from "./AtlasIcon";

/**
 * Sidebar danh mục của trang Khám phá.
 *
 * Trước đây có 3 khối "Chuyên khoa" (20 mục), "Cộng đồng", "Bộ sưu tập
 * chuyên gia" render bằng <div> không dẫn đi đâu — đã bỏ. Mọi mục còn lại
 * đều là <Link> tới trang có nội dung thật.
 *
 * Tiêu đề có mũi tên chevron nên trông như khối gập được: nay bấm vào thật sự
 * gập/mở danh mục (trước đó là <div> trơ, bấm không phản ứng).
 */
export default function CategorySidebar({
  locale,
  active,
}: {
  locale: Loc;
  /** Slug đang mở — khớp CategorySlug hoặc slug hệ cơ quan. */
  active: CategorySlug | string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <aside className="cat-sidebar">
      <button
        type="button"
        className="cat-sidebar-title"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="cat-sidebar-body"
        title={
          locale === "vi"
            ? open ? "Thu gọn danh mục" : "Mở danh mục"
            : locale === "zh"
              ? open ? "收起目录" : "展开目录"
              : open ? "Collapse categories" : "Expand categories"
        }
      >
        {pick(homeContent.mega.anatomyH, locale)}
        {/* xoay bằng inline style: home.css đang được sửa song song ở nhánh
            khác, đặt ở đây thì trạng thái mũi tên không phụ thuộc vào file đó */}
        <AtlasIcon
          id="i-chev"
          className="atlas-icon cat-chev"
          style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .2s ease" }}
        />
      </button>

      {open && (
        <div id="cat-sidebar-body">
          <Link
            href={sidebarAllModels.href}
            className={`cat-item${sidebarAllModels.slug === active ? " active" : ""}`}
          >
            <AtlasIcon id={sidebarAllModels.icon} />
            {pick(sidebarAllModels.label, locale)}
          </Link>

          <p className="cat-label">{pick(homeContent.mega.anatomyH, locale)}</p>
          {sidebarAnatomy.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className={`cat-item${item.slug === active ? " active" : ""}`}
            >
              <AtlasIcon id={item.icon} />
              {pick(item.label, locale)}
            </Link>
          ))}

          <p className="cat-label">{pick(homeContent.mega.systemsH, locale)}</p>
          {systemGroups.map((group) => (
            <Link
              key={group.key}
              href={`/giai-phau/${group.slug}`}
              className={`cat-item${group.slug === active ? " active" : ""}`}
            >
              <AtlasIcon id={group.icon} />
              {pick(group.label, locale)}
              <span className="cat-count">{scenesOfSystem(group.key).length}</span>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
