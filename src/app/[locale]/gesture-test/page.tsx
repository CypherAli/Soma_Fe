"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useCallback, useRef, useState } from "react";
import {
  HAND_BONES,
  LM,
  useHandTracking,
  type FrameInfo,
  type TrackedHand,
} from "@/lib/gesture/useHandTracking";
import "../../home.css";
import { notFound } from "next/navigation";

// P0 SPIKE — kiểm chứng hiệu năng & cơ chế điều khiển bằng cử chỉ trước khi build thật.
// Đo: FPS, độ mượt con trỏ ngón trỏ, cơ chế "dừng để chọn" (dwell).
// HIỆU NĂNG: mọi thứ chạy trong onFrame (ref-based) — KHÔNG setState mỗi khung hình.

const DWELL_MS = 1500; // thời gian giữ yên để chọn
const DWELL_MOVE_TOL = 0.05; // di quá ngưỡng này coi như rời mục tiêu
const TARGET_HIT = 0.08; // bán kính "chạm" mục tiêu (toạ độ chuẩn hoá)

type Target = { id: string; label: string; x: number; y: number };
const TARGETS: Target[] = [
  { id: "skin", label: "Da", x: 0.14, y: 0.24 },
  { id: "muscle", label: "Cơ", x: 0.14, y: 0.5 },
  { id: "bone", label: "Xương", x: 0.14, y: 0.76 },
];

export default function GestureTestPage() {
  // Trang debug nội bộ — ẩn ở production để khỏi lộ công cụ test.
  if (process.env.NODE_ENV === "production") notFound();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const dwellRef = useRef({ id: null as string | null, start: 0, x: 0, y: 0, progress: 0 });

  /**
   * Ánh xạ toạ độ chuẩn hoá của landmark → pixel canvas, bù đúng cách video bị
   * cắt bởi object-cover (nếu không, con trỏ sẽ lệch khỏi ngón tay thật).
   */
  const mapper = useCallback((frame: FrameInfo, cw: number, ch: number) => {
    const va = frame.width / frame.height;
    const ca = cw / ch;
    let scale: number, ox: number, oy: number;
    if (ca > va) {
      scale = cw / frame.width;
      ox = 0;
      oy = (ch - frame.height * scale) / 2;
    } else {
      scale = ch / frame.height;
      ox = (cw - frame.width * scale) / 2;
      oy = 0;
    }
    return (nx: number, ny: number) => ({
      x: ox + nx * frame.width * scale,
      y: oy + ny * frame.height * scale,
    });
  }, []);

  const handleFrame = useCallback(
    (hands: TrackedHand[], frame: FrameInfo, now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const toPx = mapper(frame, cw, ch);
      ctx.clearRect(0, 0, cw, ch);

      // tay điều khiển: ưu tiên tay phải, không có thì lấy tay đầu tiên
      const primary = hands.find((h) => h.handedness === "Right") ?? hands[0];

      for (const hand of hands) {
        const isPrimary = hand === primary;
        ctx.strokeStyle = isPrimary ? "rgba(55,201,179,.95)" : "rgba(140,170,205,.5)";
        ctx.lineWidth = isPrimary ? 2.5 : 1.5;
        for (const [a, b] of HAND_BONES) {
          const pa = toPx(hand.landmarks[a].x, hand.landmarks[a].y);
          const pb = toPx(hand.landmarks[b].x, hand.landmarks[b].y);
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
        ctx.fillStyle = isPrimary ? "#37c9b3" : "#8caacd";
        for (const p of hand.landmarks) {
          const q = toPx(p.x, p.y);
          ctx.beginPath();
          ctx.arc(q.x, q.y, isPrimary ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        const wrist = toPx(hand.landmarks[LM.WRIST].x, hand.landmarks[LM.WRIST].y);
        ctx.fillStyle = "rgba(255,255,255,.9)";
        ctx.font = "12px system-ui";
        ctx.fillText(hand.handedness === "Right" ? "Tay phải" : "Tay trái", wrist.x + 10, wrist.y);
      }

      // ---- cơ chế dwell: giữ con trỏ yên trên một mục tiêu đủ lâu = chọn ----
      const d = dwellRef.current;
      if (!primary) {
        d.id = null;
        d.progress = 0;
      } else {
        const { x, y } = primary.cursor;
        const hit = TARGETS.find((t) => Math.hypot(t.x - x, t.y - y) < TARGET_HIT);
        if (!hit) {
          d.id = null;
          d.progress = 0;
        } else if (d.id !== hit.id || Math.hypot(x - d.x, y - d.y) > DWELL_MOVE_TOL) {
          d.id = hit.id;
          d.start = now;
          d.x = x;
          d.y = y;
          d.progress = 0;
        } else {
          d.progress = Math.min((now - d.start) / DWELL_MS, 1);
          if (d.progress >= 1) {
            d.id = null;
            d.progress = 0;
            d.start = now;
            setSelected(hit.id); // sự kiện thật -> mới được setState
            setLog((l) =>
              [`Chọn “${hit.label}” · ${new Date().toLocaleTimeString()}`, ...l].slice(0, 6),
            );
          }
        }

        // con trỏ + vòng tiến trình
        const c = toPx(primary.cursor.x, primary.cursor.y);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,.95)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (d.progress > 0) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 19, -Math.PI / 2, -Math.PI / 2 + d.progress * Math.PI * 2);
          ctx.strokeStyle = "#37c9b3";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // viền sáng mục tiêu đang được nhắm
      for (const t of TARGETS) {
        if (t.id !== d.id) continue;
        const p = toPx(t.x, t.y);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 46, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(55,201,179,.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    },
    [mapper],
  );

  const { fps, handCount, status, error } = useHandTracking(videoRef, enabled, {
    onFrame: handleFrame,
    maxHands: 2,
  });

  return <ContentSurface scope="src/app/[locale]/gesture-test/page.tsx">{(
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <h1 className="text-sm font-semibold text-[var(--ink)]">
          P0 · Kiểm chứng điều khiển bằng cử chỉ
        </h1>
        <span className="hidden text-xs text-[var(--muted)] md:inline">
          Đo FPS · độ mượt con trỏ · cơ chế dừng-để-chọn
        </span>
        <button
          onClick={() => setEnabled((v) => !v)}
          className="ml-auto rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
        >
          {enabled ? "Tắt camera" : "Bật camera"}
        </button>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <main className="relative flex-1 overflow-hidden rounded-xl border border-[var(--line)] bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          {TARGETS.map((t) => {
            const isSel = selected === t.id;
            return (
              <div
                key={t.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-xl px-5 py-3 text-sm font-semibold"
                style={{
                  left: `${t.x * 100}%`,
                  top: `${t.y * 100}%`,
                  background: isSel ? "#37c9b3" : "rgba(255,255,255,.16)",
                  color: isSel ? "#06231f" : "#fff",
                  border: "2px solid rgba(255,255,255,.35)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {t.label}
              </div>
            );
          })}

          {!enabled && (
            <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-white/70">
              <div>
                <p className="mb-2 text-base font-semibold text-white">
                  Bấm “Bật camera” để bắt đầu
                </p>
                <p>Giơ bàn tay lên trước webcam, ngón trỏ làm con trỏ.</p>
                <p>Giữ yên trên một ô ~1,5 giây để chọn.</p>
              </div>
            </div>
          )}
          {status === "loading" && (
            <div className="absolute inset-0 grid place-items-center text-sm text-white/80">
              Đang nạp mô hình nhận diện tay…
            </div>
          )}
          {status === "error" && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-red-300">
              Không bật được camera: {error}
            </div>
          )}
        </main>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto" data-lenis-prevent>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Chỉ số
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex items-baseline justify-between">
                <dt className="text-[var(--muted)]">FPS</dt>
                <dd
                  className="text-2xl font-semibold tabular-nums"
                  style={{ color: fps >= 24 ? "#0f8a7c" : fps >= 15 ? "#a9701a" : "#c0453b" }}
                >
                  {fps}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--muted)]">Số tay thấy</dt>
                <dd className="font-semibold tabular-nums">{handCount}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--muted)]">Trạng thái</dt>
                <dd className="font-semibold">
                  {status === "running"
                    ? "Đang chạy"
                    : status === "loading"
                      ? "Đang nạp"
                      : status === "error"
                        ? "Lỗi"
                        : "Chờ"}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              FPS ≥ 24 mượt · 15–23 dùng được · dưới 15 phải tối ưu.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Đã chọn
            </h2>
            <p className="text-sm font-semibold text-[var(--ink)]">
              {selected ? TARGETS.find((t) => t.id === selected)?.label : "— chưa chọn —"}
            </p>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="mt-3 w-full rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm hover:bg-[var(--surf-2)]"
              >
                Hủy chọn
              </button>
            )}
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Nhật ký
            </h2>
            {log.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">Chưa có thao tác nào.</p>
            ) : (
              <ul className="space-y-1 text-xs text-[var(--body-fg)]">
                {log.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  )}</ContentSurface>;
}
