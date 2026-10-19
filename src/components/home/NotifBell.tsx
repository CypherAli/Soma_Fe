"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useRef, useState } from "react";
import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { Icon } from "./IconSprite";

/**
 * Chuông thông báo bên trái avatar, kiểu Facebook.
 *
 * Hiện tại Soma chưa có hệ thống thông báo đẩy, nên bảng chỉ có trạng thái
 * trống trung thực — có hạ tầng sự kiện (lộ trình ôn, duyệt đề) mới cắm số
 * lượng thật vào đây, không bịa chấm đỏ.
 */
export default function NotifBell({ locale }: { locale: Loc }) {
  const cmsContent = useContent();
  const C = cmsContent.resolve(cmsSourceC());

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open ]);

  const A = C.account;
  return <ContentSurface scope="src/components/home/NotifBell.tsx">{(
    <div className="notif" ref={rootRef}>
      <button
        type="button"
        className="notif-btn"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={pick(A.notifications, locale)}
        title={pick(A.notifications, locale)}
      >
        <Icon id="i-bell" />
      </button>

      {open && (
        <div className="notif-panel" role="dialog" aria-label={pick(A.notifications, locale)}>
          <b>{pick(A.notifications, locale)}</b>
          <p className="notif-empty">{pick(A.emptyNotif, locale)}</p>
        </div>
      )}
    </div>
  )}</ContentSurface>;
}

function cmsSourceC() { return C; }
