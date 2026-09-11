/**
 * 11 icon dùng trong giao diện atlas, vẽ nội tuyến.
 *
 * Bản gốc human-atlas import `lucide-react`. Soma_Fe không có thư viện icon
 * nào — cả dự án dùng SVG viết tay — nên kéo về một gói chỉ để lấy 11 hình là
 * thừa. Đường dẫn hình lấy nguyên từ lucide-react v1.43.0 (giấy phép ISC,
 * © Lucide Icons and Contributors) nên nét vẽ khớp đúng bản gốc.
 *
 * Thêm icon mới thì chép `node` trong node_modules/lucide-react/dist/esm/icons/<tên>.mjs.
 */
import type { ReactNode } from "react";

const PATHS: Record<string, ReactNode> = {
  Activity: (
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  ),
  ArrowUpRight: (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  ChevronRight: <path d="m9 18 6-6-6-6" />,
  Focus: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </>
  ),
  Info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  Layers3: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  Pause: (
    <>
      <rect x="14" y="3" width="5" height="18" rx="1" />
      <rect x="5" y="3" width="5" height="18" rx="1" />
    </>
  ),
  RotateCcw: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  RotateCw: (
    <>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </>
  ),
  Search: (
    <>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </>
  ),
  X: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
};

function icon(name: keyof typeof PATHS) {
  function Icon({ size = 24 }: { size?: number }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {PATHS[name]}
      </svg>
    );
  }
  Icon.displayName = `Atlas${String(name)}Icon`;
  return Icon;
}

export const Activity = icon("Activity");
export const ArrowUpRight = icon("ArrowUpRight");
export const ChevronRight = icon("ChevronRight");
export const Focus = icon("Focus");
export const Info = icon("Info");
export const Layers3 = icon("Layers3");
export const Pause = icon("Pause");
export const RotateCcw = icon("RotateCcw");
export const RotateCw = icon("RotateCw");
export const Search = icon("Search");
export const X = icon("X");
