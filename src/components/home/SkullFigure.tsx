"use client";

import dynamic from "next/dynamic";

// Canvas WebGL chỉ chạy client — tắt SSR để không lỗi khi render server.
const SkullTurntable = dynamic(() => import("./SkullTurntable"), {
  ssr: false,
  loading: () => <div className="skull-loading" aria-hidden />,
});

export default function SkullFigure() {
  return (
    <div className="human-fig human-fig-3d" aria-hidden>
      {/* Tô màu từng xương như bài "Giải phẫu sọ" — user chọn kiểu này thay khối ngà trơn. */}
      <SkullTurntable colored />
    </div>
  );
}
