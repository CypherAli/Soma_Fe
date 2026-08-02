"use client";

import { useCallback, useRef, useState } from "react";
import GestureArmScene, {
  type LayerState,
} from "@/components/gesture/GestureArmScene";
import { CATS, type CatKey } from "@/lib/anatomy/layers";
import {
  HAND_BONES,
  LM,
  useHandTracking,
  type FrameInfo,
  type TrackedHand,
} from "@/lib/gesture/useHandTracking";
import "../../home.css";

// ĐIỀU KHIỂN GIẢI PHẪU BẰNG CỬ CHỈ (bước 3)
// Ngón trỏ = con trỏ · giữ yên 1,5s = chọn · chụm ngón cái–trỏ rồi kéo = xoay mô hình.
// Mọi tính toán chạy trong onFrame (ref-based) để không kích re-render mỗi khung hình.

const DWELL_MS = 1500;
const DWELL_MOVE_TOL_PX = 55;
const SHOWN_CATS: CatKey[] = ["skin", "muscle", "artery", "vein", "nerve", "bone"];

export default function GestureControlPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneBoxRef = useRef<HTMLDivElement | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<{ name: string; cat: CatKey } | null>(null);
  const [picked, setPicked] = useState<{ name: string; cat: CatKey } | null>(null);
  const [layers, setLayers] = useState<LayerState>(
    () =>
      Object.fromEntries(
        CATS.map((c) => [c.key, { visible: true, faded: c.key === "skin" }]),
      ) as LayerState,
  );

  // ref dùng cho vòng lặp 3D (không gây re-render)
  const cursorRef = useRef({ x: 0.5, y: 0.5, active: false }); // toạ độ trong khung 3D
  const rotationRef = useRef(0);
  const explodeRef = useRef(0);
  const dwellRef = useRef({ key: "", start: 0, x: 0, y: 0, progress: 0 });
  const pinchRef = useRef({ active: false, lastX: 0 });
  const hoveredRef = useRef<{ name: string; cat: CatKey } | null>(null);

  const toggleLayer = useCallback((key: CatKey, field: "visible" | "faded") => {
    setLayers((s) => ({ ...s, [key]: { ...s[key], [field]: !s[key][field] } }));
  }, []);

  const handleHover = useCallback((info: { name: string; cat: CatKey } | null) => {
    const prev = hoveredRef.current;
    if (prev?.name === info?.name) return;
    hoveredRef.current = info;
    setHovered(info);
  }, []);

  const handleFrame = useCallback(
    (hands: TrackedHand[], frame: FrameInfo, now: number) => {
      // ---- 1) vẽ khung xương tay trong ô webcam nhỏ ----
      const cam = camCanvasRef.current;
      if (cam) {
        const cw = cam.clientWidth;
        const ch = cam.clientHeight;
        if (cam.width !== cw || cam.height !== ch) {
          cam.width = cw;
          cam.height = ch;
        }
        const ctx = cam.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, cw, ch);
          const va = frame.width / frame.height;
          const ca = cw / ch;
          const scale = ca > va ? cw / frame.width : ch / frame.height;
          const ox = ca > va ? 0 : (cw - frame.width * scale) / 2;
          const oy = ca > va ? (ch - frame.height * scale) / 2 : 0;
          const px = (nx: number, ny: number) => ({
            x: ox + nx * frame.width * scale,
            y: oy + ny * frame.height * scale,
          });
          for (const hand of hands) {
            ctx.strokeStyle = "rgba(55,201,179,.9)";
            ctx.lineWidth = 2;
            for (const [a, b] of HAND_BONES) {
              const pa = px(hand.landmarks[a].x, hand.landmarks[a].y);
              const pb = px(hand.landmarks[b].x, hand.landmarks[b].y);
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.stroke();
            }
            ctx.fillStyle = "#37c9b3";
            for (const p of hand.landmarks) {
              const q = px(p.x, p.y);
              ctx.beginPath();
              ctx.arc(q.x, q.y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      const primary = hands.find((h) => h.handedness === "Right") ?? hands[0];

      // ---- 2) con trỏ toàn màn hình + dwell trên nút có data-gesture-target ----
      const overlay = cursorCanvasRef.current;
      const ow = overlay?.clientWidth ?? 0;
      const oh = overlay?.clientHeight ?? 0;
      if (overlay && (overlay.width !== ow || overlay.height !== oh)) {
        overlay.width = ow;
        overlay.height = oh;
      }
      const octx = overlay?.getContext("2d");
      octx?.clearRect(0, 0, ow, oh);

      if (!primary) {
        cursorRef.current.active = false;
        dwellRef.current.key = "";
        dwellRef.current.progress = 0;
        pinchRef.current.active = false;
        return;
      }

      const sx = primary.cursor.x * ow;
      const sy = primary.cursor.y * oh;

      // toạ độ chuẩn hoá bên trong khung 3D (để raycast)
      const box = sceneBoxRef.current?.getBoundingClientRect();
      if (box) {
        const rx = (sx - box.left) / box.width;
        const ry = (sy - box.top) / box.height;
        cursorRef.current.x = rx;
        cursorRef.current.y = ry;
        cursorRef.current.active = rx >= 0 && rx <= 1 && ry >= 0 && ry <= 1;
      }

      // ---- 3) chụm ngón cái–trỏ rồi kéo ngang = xoay mô hình ----
      const tip = primary.landmarks[LM.INDEX_TIP];
      const thumb = primary.landmarks[LM.THUMB_TIP];
      const pinchDist = Math.hypot(tip.x - thumb.x, tip.y - thumb.y);
      const pinching = pinchDist < 0.06;
      if (pinching) {
        if (!pinchRef.current.active) {
          pinchRef.current.active = true;
          pinchRef.current.lastX = sx;
        } else {
          rotationRef.current += ((sx - pinchRef.current.lastX) / ow) * Math.PI * 2.2;
          pinchRef.current.lastX = sx;
        }
      } else {
        pinchRef.current.active = false;
      }

      // ---- 4) dwell: giữ yên trên nút hoặc trên cấu trúc 3D ----
      const d = dwellRef.current;
      let targetKey = "";
      let targetEl: HTMLElement | null = null;
      if (!pinching) {
        const el = document.elementFromPoint(sx, sy) as HTMLElement | null;
        targetEl = el?.closest<HTMLElement>("[data-gesture-target]") ?? null;
        targetKey = targetEl?.dataset.gestureTarget ?? "";
        if (!targetKey && cursorRef.current.active && hoveredRef.current) {
          targetKey = `mesh:${hoveredRef.current.name}`;
        }
      }

      if (!targetKey) {
        d.key = "";
        d.progress = 0;
      } else if (d.key !== targetKey || Math.hypot(sx - d.x, sy - d.y) > DWELL_MOVE_TOL_PX) {
        d.key = targetKey;
        d.start = now;
        d.x = sx;
        d.y = sy;
        d.progress = 0;
      } else {
        d.progress = Math.min((now - d.start) / DWELL_MS, 1);
        if (d.progress >= 1) {
          d.progress = 0;
          d.start = now;
          d.key = "";
          // kích hoạt hành động
          if (targetKey.startsWith("mesh:")) {
            setPicked(hoveredRef.current);
          } else if (targetKey.startsWith("layer:")) {
            const [, cat, field] = targetKey.split(":");
            toggleLayer(cat as CatKey, field as "visible" | "faded");
          } else if (targetKey === "clear") {
            setPicked(null);
          } else if (targetKey === "explode") {
            explodeRef.current = explodeRef.current > 0 ? 0 : 1;
          } else if (targetKey === "reset") {
            rotationRef.current = 0;
            explodeRef.current = 0;
          }
        }
      }

      // ---- 5) vẽ con trỏ + vòng tiến trình ----
      if (octx) {
        octx.beginPath();
        octx.arc(sx, sy, 9, 0, Math.PI * 2);
        octx.fillStyle = pinching ? "#ffb347" : "rgba(255,255,255,.95)";
        octx.fill();
        octx.strokeStyle = "rgba(0,0,0,.45)";
        octx.lineWidth = 1.5;
        octx.stroke();
        if (d.progress > 0) {
          octx.beginPath();
          octx.arc(sx, sy, 20, -Math.PI / 2, -Math.PI / 2 + d.progress * Math.PI * 2);
          octx.strokeStyle = "#37c9b3";
          octx.lineWidth = 4;
          octx.stroke();
        }
      }
    },
    [toggleLayer],
  );

  const { fps, handCount, status, error } = useHandTracking(videoRef, enabled, {
    onFrame: handleFrame,
    maxHands: 1,
  });

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <h1 className="text-sm font-semibold text-[var(--ink)]">
          Giải phẫu cẳng tay · điều khiển bằng cử chỉ
        </h1>
        <span className="hidden text-xs text-[var(--muted)] lg:inline">
          Ngón trỏ để trỏ · giữ yên 1,5s để chọn · chụm ngón rồi kéo để xoay
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-[var(--muted)]">
            FPS <b style={{ color: fps >= 24 ? "#0f8a7c" : fps >= 15 ? "#a9701a" : "#c0453b" }}>{fps}</b>
            {" · "}tay {handCount}
          </span>
          <button
            onClick={() => setEnabled((v) => !v)}
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
          >
            {enabled ? "Tắt camera" : "Bật camera"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <main
          ref={sceneBoxRef}
          className="relative flex-1 overflow-hidden rounded-xl border border-[var(--line)]"
        >
          <GestureArmScene
            layers={layers}
            cursorRef={cursorRef}
            onHover={handleHover}
            rotationRef={rotationRef}
            explodeRef={explodeRef}
          />

          {/* tên cấu trúc đang nhắm */}
          {hovered && (
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-[#1c1813]/85 px-4 py-2 text-sm font-semibold text-[#f4efe6]">
              {hovered.name}
            </div>
          )}

          {/* webcam nhỏ góc dưới-trái */}
          <div className="absolute bottom-3 left-3 w-52 overflow-hidden rounded-lg border border-[var(--line)] bg-black">
            <div className="relative aspect-[4/3]">
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <canvas ref={camCanvasRef} className="absolute inset-0 h-full w-full" />
              {!enabled && (
                <div className="absolute inset-0 grid place-items-center text-center text-xs text-white/70">
                  Bật camera để điều khiển
                </div>
              )}
            </div>
          </div>

          {status === "loading" && (
            <div className="absolute bottom-3 left-56 rounded-md bg-black/70 px-3 py-1.5 text-xs text-white">
              Đang nạp mô hình nhận diện tay…
            </div>
          )}
          {status === "error" && (
            <div className="absolute bottom-3 left-56 rounded-md bg-red-900/80 px-3 py-1.5 text-xs text-white">
              Lỗi camera: {error}
            </div>
          )}
        </main>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto" data-lenis-prevent>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Đang chọn
            </h2>
            <p className="text-sm font-semibold text-[var(--ink)]">
              {picked ? picked.name : "— chưa chọn —"}
            </p>
            <button
              data-gesture-target="clear"
              onClick={() => setPicked(null)}
              className="mt-3 w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
            >
              Hủy chọn
            </button>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Lớp giải phẫu
            </h2>
            <div className="space-y-1.5">
              {CATS.filter((c) => SHOWN_CATS.includes(c.key)).map((c) => {
                const st = layers[c.key];
                return (
                  <div key={c.key} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm border border-black/10"
                      style={{ background: c.color }}
                    />
                    <span className="flex-1" style={{ opacity: st.visible ? 1 : 0.45 }}>
                      {c.label}
                    </span>
                    <button
                      data-gesture-target={`layer:${c.key}:visible`}
                      onClick={() => toggleLayer(c.key, "visible")}
                      className="rounded-md border border-[var(--line)] px-2 py-1 text-xs hover:bg-[var(--surf-2)]"
                    >
                      {st.visible ? "Hiện" : "Ẩn"}
                    </button>
                    <button
                      data-gesture-target={`layer:${c.key}:faded`}
                      onClick={() => toggleLayer(c.key, "faded")}
                      className="rounded-md border border-[var(--line)] px-2 py-1 text-xs hover:bg-[var(--surf-2)]"
                    >
                      {st.faded ? "Mờ" : "Rõ"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Thao tác
            </h2>
            <div className="space-y-2">
              <button
                data-gesture-target="explode"
                onClick={() => (explodeRef.current = explodeRef.current > 0 ? 0 : 1)}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
              >
                Tách lớp / gộp lại
              </button>
              <button
                data-gesture-target="reset"
                onClick={() => {
                  rotationRef.current = 0;
                  explodeRef.current = 0;
                }}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
              >
                Về vị trí ban đầu
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              Đưa ngón trỏ tới nút và giữ yên 1,5 giây để bấm bằng cử chỉ.
            </p>
          </div>
        </aside>
      </div>

      {/* lớp phủ con trỏ toàn màn hình — không chặn chuột */}
      <canvas
        ref={cursorCanvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />
    </div>
  );
}
