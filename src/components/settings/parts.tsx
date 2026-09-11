"use client";

import { initialsOf, type Plan } from "@/lib/account";
import { pick, type Loc } from "@/lib/homeContent";
import { settingsContent as S } from "@/lib/settingsContent";

/**
 * Mảnh dùng chung của khu tài khoản.
 *
 * Ảnh đại diện đi qua `<img>` chứ không phải `next/image`: nguồn là data URL do
 * người dùng vừa chọn, bộ tối ưu ảnh của Next không xử lý được và cũng không có
 * gì để tối ưu — ảnh đã thu về 256px trước khi rời trình duyệt.
 */
export function Avatar({
  name,
  src,
  size = 44,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  return (
    <span className="ava" style={{ width: size, height: size, fontSize: Math.round(size / 2.9) }}>
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt="" width={size} height={size} />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}

/** Nhãn gói. Vuông góc mềm chứ không phải viên thuốc — đỡ giống badge mặc định. */
export function PlanBadge({ plan, locale }: { plan: Plan; locale: Loc }) {
  return (
    <span className={`plan-badge${plan === "pro" ? " pro" : ""}`}>
      {pick(plan === "pro" ? S.plan.proShort : S.plan.freeShort, locale)}
    </span>
  );
}

/** Khung thẻ hai lớp: vỏ ngoài mảnh, lõi trong đậm hơn. */
export function Card({
  title,
  note,
  children,
  aside,
}: {
  title?: string;
  note?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="st-card">
      {(title || aside) && (
        <header className="st-card-head">
          <div>
            {title && <h2>{title}</h2>}
            {note && <p>{note}</p>}
          </div>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

/** Khung xương lúc chờ dữ liệu — không dùng vòng xoay chung chung. */
export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="st-skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

export function Notice({ kind, children }: { kind: "error" | "ok"; children: React.ReactNode }) {
  return (
    <p className={kind === "error" ? "st-error" : "st-ok"} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}

export function errorText(cause: unknown) {
  return cause instanceof Error ? cause.message : String(cause);
}

/** Ngày dạng "12 tháng 8, 2026" theo đúng ngôn ngữ đang xem. */
export function formatDate(value: string, locale: Loc) {
  const tag = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-GB";
  return new Date(value).toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateTime(value: string, locale: Loc) {
  const tag = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-GB";
  return new Date(value).toLocaleString(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
