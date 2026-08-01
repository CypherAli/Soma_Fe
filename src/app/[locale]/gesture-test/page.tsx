"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HAND_BONES, LM, useHandTracking, type TrackedHand } from "@/lib/gesture/useHandTracking";
import "../../home.css";

// P0 SPIKE — kiểm chứng hiệu năng & cơ chế điều khiển bằng cử chỉ trước khi build thật.
// Đo: FPS, độ mượt con trỏ ngón trỏ, cơ chế "dừng 1.8s để chọn" (dwell).

const DWELL_MS = 1800; // thời gian giữ yên để chọn
const DWELL_RADIUS = 0.045; // bán kính "đứng yên" (toạ độ chuẩn hoá)

type Target = { id: string; label: string; x: number; y: number };
const TARGETS: Target[] = [
  { id: "skin", label: "Da", x: 0.16, y: 0.24 },
  { id: "muscle", label: "Cơ", x: 0.16, y: 0.5 },
  { id: "bone", label: "Xương", x: 0.16, y: 0.76 },
];

export default function GestureTestPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const { hands, fps, status, error } = useHandTracking(videoRef, enabled);

  const [selected, setSelected] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const dwellRef = useRef<{ id: string | null; start: number; x: number; y: number }>({
    id: null,
    start: 0,
    x: 0,
    y: 0,
  });
  const [dwellProgress, setDwellProgress] = useState(0);

  // tay điều khiển: ưu tiên tay phải (tay thuận), không có thì lấy tay đầu tiên
  const primary: TrackedHand | undefined = useMemo(
    () => hands.find((h) => h.handedness === "Right") ?? hands[0],
    [hands],
  );

  // ---- cơ chế dwell: giữ con trỏ yên trên 1 mục tiêu đủ lâu = chọn ----
  useEffect(() => {
    if (!primary) {
      dwellRef.current.id = null;
      setDwellProgress(0);
      return;
    }
    const { x, y } = primary.cursor;
    const hit = TARGETS.find((t) => Math.hypot(t.x - x, t.y - y) < 0.075);
    const now = performance.now();
    const d = dwellRef.current;

    if (!hit) {
      d.id = null;
      setDwellProgress(0);
      return;
    }
    const moved = Math.hypot(x - d.x, y - d.y) > DWELL_RADIUS;
    if (d.id !== hit.id || moved) {
      d.id = hit.id;
      d.start = now;
      d.x = x;
      d.y = y;
      setDwellProgress(0);
      return;
    }
    const p = Math.min((now - d.start) / DWELL_MS, 1);
    setDwellProgress(p);
    if (p >= 1) {
      setSelected(hit.id);
      setLog((l) => [`Đã chọn "${hit.label}" · ${new Date().toLocaleTimeString()}`, ...l].slice(0, 5));
      d.id = null;
      d.start = now;
      setDwellProgress(0);
    }
  }, [primary]);

  // ---- vẽ overlay: khung xương tay + con trỏ + vòng tiến trình ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (const hand of hands) {
      const isPrimary = hand === primary;
      ctx.strokeStyle = isPrimary ? "rgba(55,201,179,.9)" : "rgba(120,160,200,.55)";
      ctx.lineWidth = 2;
      for (const [a, b] of HAND_BONES) {
        const pa = hand.landmarks[a];
        const pb = hand.landmarks[b];
        ctx.beginPath();
        ctx.moveTo(pa.x * w, pa.y * h);
        ctx.lineTo(pb.x * w, pb.y * h);
        ctx.stroke();
      }
      ctx.fillStyle = isPrimary ? "#37c9b3" : "#7aa0c8";
      for (const p of hand.landmarks) {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      // nhãn tay trái/phải ở cổ tay
      const wrist = hand.landmarks[LM.WRIST];
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.font = "12px system-ui";
      ctx.fillText(hand.handedness === "Right" ? "Tay phải" : "Tay trái", wrist.x * w + 8, wrist.y * h);
    }

    if (primary) {
      const cx = primary.cursor.x * w;
      const cy = primary.cursor.y * h;
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.95)";
      ctx.fill();
      if (dwellProgress > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, 20, -Math.PI / 2, -Math.PI / 2 + dwellProgress * Math.PI * 2);
        ctx.strokeStyle = "#37c9b3";
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
  }, [hands, primary, dwellProgress]);

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <h1 className="text-sm font-semibold text-[var(--ink)]">
          P0 · Kiểm chứng điều khiển bằng cử chỉ
        </h1>
        <span className="text-xs text-[var(--muted)]">
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
          <canvas
            ref={canvasRef}
            width={960}
            height={720}
            className="absolute inset-0 h-full w-full"
          />

          {/* mục tiêu để test dwell */}
          {TARGETS.map((t) => {
            const active = dwellRef.current.id === t.id;
            const isSel = selected === t.id;
            return (
              <div
                key={t.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                style={{
                  left: `${t.x * 100}%`,
                  top: `${t.y * 100}%`,
                  background: isSel ? "#37c9b3" : "rgba(255,255,255,.14)",
                  color: isSel ? "#06231f" : "#fff",
                  border: `2px solid ${active ? "#37c9b3" : "rgba(255,255,255,.3)"}`,
                  backdropFilter: "blur(4px)",
                }}
              >
                {t.label}
              </div>
            );
          })}

          {!enabled && (
            <div className="absolute inset-0 grid place-items-center text-center text-sm text-white/70">
              <div>
                <p className="mb-2 text-base font-semibold text-white">Bấm “Bật camera” để bắt đầu</p>
                <p>Giơ bàn tay lên trước webcam, dùng ngón trỏ làm con trỏ.</p>
                <p>Giữ yên trên một ô ~1.8 giây để chọn.</p>
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
                <dd className="font-semibold tabular-nums">{hands.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--muted)]">Trạng thái</dt>
                <dd className="font-semibold">
                  {status === "running" ? "Đang chạy" : status === "loading" ? "Đang nạp" : status === "error" ? "Lỗi" : "Chờ"}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              FPS ≥ 24 là mượt · 15–23 dùng được · dưới 15 phải tối ưu.
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
  );
}
