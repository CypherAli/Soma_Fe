"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useRef, useState } from "react";
import { pick, type Loc } from "@/lib/homeContent";
import type { FilterTab } from "@/lib/exploreContent";
import AtlasIcon from "./AtlasIcon";

/**
 * Ô lọc trên thanh công cụ (VD "Hệ" ở trang Tất cả mô hình).
 *
 * Tự dựng thay vì dùng <select>: popup của select là do trình duyệt vẽ, không
 * đặt được chiều cao hay bề rộng, nên với 14 mục nó đổ dài gần hết màn hình.
 * Bảng chọn ở đây rộng ĐÚNG bằng nút và cao đúng 4 dòng (4 × 36px), phần còn
 * lại cuộn trong bảng.
 */
const ROW_H = 36;
const VISIBLE_ROWS = 4;

export default function FilterSelect({
  label,
  options,
  value,
  onChange,
  locale,
}: {
  /** Nhãn hiện khi chưa lọc — cũng là tên của bộ lọc. */
  label: string;
  options: FilterTab[];
  value: string;
  onChange: (key: string) => void;
  locale: Loc;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Đóng khi bấm ra ngoài hoặc bấm Esc.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Mở ra là cuộn thẳng tới mục đang chọn, khỏi phải tự tìm.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open]);

  const current = options.find((o) => o.key === value);
  const isDefault = value === options[0]?.key;

  return <ContentSurface scope="src/components/explore/FilterSelect.tsx">{(
    <div className="tb-filter" ref={rootRef}>
      <button
        type="button"
        className={`tb-filter-btn${open ? " open" : ""}${isDefault ? "" : " set"}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{isDefault || !current ? label : pick(current.label, locale)}</span>
        <AtlasIcon id="i-chev" />
      </button>

      {open && (
        <div
          className="tb-filter-list"
          role="listbox"
          ref={listRef}
          data-lenis-prevent
          style={{ maxHeight: ROW_H * VISIBLE_ROWS }}
        >
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              role="option"
              aria-selected={o.key === value}
              className={`tb-filter-opt${o.key === value ? " active" : ""}`}
              style={{ height: ROW_H }}
              onClick={() => {
                onChange(o.key);
                setOpen(false);
              }}
            >
              {pick(o.label, locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  )}</ContentSurface>;
}
