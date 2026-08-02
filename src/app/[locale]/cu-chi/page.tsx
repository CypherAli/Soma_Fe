"use client";

import { useCallback, useRef, useState } from "react";
import GestureArmScene, {
  defaultTransform,
  type LayerState,
} from "@/components/gesture/GestureArmScene";
import { CATS, type CatKey } from "@/lib/anatomy/layers";
import { detectMode, twoHandSpan, type GestureMode } from "@/lib/gesture/gestures";
import {
  HAND_BONES,
  useHandTracking,
  type FrameInfo,
  type TrackedHand,
} from "@/lib/gesture/useHandTracking";
import "../../home.css";

// ĐIỀU KHIỂN GIẢI PHẪU BẰNG CỬ CHỈ
//   Ngón trỏ            → con trỏ, giữ yên 1,5s = chọn
//   Chụm ngón + kéo     → xoay (ngang = quay, dọc = ngửa/cúi)
//   Nắm tay + kéo       → di chuyển mô hình
//   Hai tay chụm, dang  → phóng to / thu nhỏ
// Toàn bộ tính trong onFrame (ref-based) để không re-render mỗi khung hình.

const DWELL_MS = 1500;
const DWELL_MOVE_TOL_PX = 55;
const SHOWN_CATS: CatKey[] = ["skin", "muscle", "artery", "vein", "nerve", "bone"];
const ZOOM_MIN = 0.35;
const ZOOM_MAX = 3.5;

const MODE_LABEL: Record<GestureMode, string> = {
  idle: "Chưa thấy tay",
  point: "Trỏ / chọn",
  rotate: "Đang xoay",
  pan: "Đang di chuyển",
  zoom: "Đang phóng to/thu nhỏ",
};

export default function GestureControlPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneBoxRef = useRef<HTMLDivElement | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<{ name: string; cat: CatKey } | null>(null);
  const [picked, setPicked] = useState<{ name: string; cat: CatKey } | null>(null);
  const [mode, setMode] = useState<GestureMode>("idle");
  const [layers, setLayers] = useState<LayerState>(
    () =>
      Object.fromEntries(
        CATS.map((c) => [c.key, { visible: true, faded: c.key === "skin" }]),
      ) as LayerState,
  );

  // ref cho vòng lặp 3D — không gây re-render
  const cursorRef = useRef({ x: 0.5, y: 0.5, active: false });
  const transformRef = useRef(defaultTransform());
  const dwellRef = useRef({ key: "", start: 0, x: 0, y: 0, progress: 0 });
  const dragRef = useRef({ mode: "idle" as GestureMode, x: 0, y: 0, span: 0, zoom: 1 });
  const hoveredRef = useRef<{ name: string; cat: CatKey } | null>(null);
  const modeRef = useRef<GestureMode>("idle");

  const toggleLayer = useCallback((key: CatKey, field: "visible" | "faded") => {
    setLayers((s) => ({ ...s, [key]: { ...s[key], [field]: !s[key][field] } }));
  }, []);

  const handleHover = useCallback((info: { name: string; cat: CatKey } | null) => {
    if (hoveredRef.current?.name === info?.name) return;
    hoveredRef.current = info;
    setHovered(info);
  }, []);

  const resetView = useCallback(() => {
    const t = transformRef.current;
    t.rotX = 0;
    t.rotY = 0;
    t.zoom = 1;
    t.panX = 0;
    t.panY = 0;
  }, []);

  const handleFrame = useCallback(
    (hands: TrackedHand[], frame: FrameInfo, now: number) => {
      // ---- 1) khung xương tay trong ô webcam nhỏ ----
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

      const overlay = cursorCanvasRef.current;
      const ow = overlay?.clientWidth ?? 0;
      const oh = overlay?.clientHeight ?? 0;
      if (overlay && (overlay.width !== ow || overlay.height !== oh)) {
        overlay.width = ow;
        overlay.height = oh;
      }
      const octx = overlay?.getContext("2d");
      octx?.clearRect(0, 0, ow, oh);

      // ---- 2) xác định chế độ thao tác ----
      const gm = detectMode(hands);
      if (gm !== modeRef.current) {
        modeRef.current = gm;
        setMode(gm);
      }

      const primary = hands.find((h) => h.handedness === "Right") ?? hands[0];
      if (!primary) {
        cursorRef.current.active = false;
        dwellRef.current.key = "";
        dwellRef.current.progress = 0;
        dragRef.current.mode = "idle";
        return;
      }

      const sx = primary.cursor.x * ow;
      const sy = primary.cursor.y * oh;
      const t = transformRef.current;
      const drag = dragRef.current;

      // ---- 3) áp cử chỉ vào biến đổi mô hình ----
      if (gm === "zoom") {
        const span = twoHandSpan(hands);
        if (span !== null) {
          if (drag.mode !== "zoom") {
            drag.mode = "zoom";
            drag.span = span;
            drag.zoom = t.zoom;
          } else if (drag.span > 0.02) {
            const ratio = span / drag.span;
            t.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, drag.zoom * ratio));
          }
        }
      } else if (gm === "rotate") {
        if (drag.mode !== "rotate") {
          drag.mode = "rotate";
          drag.x = sx;
          drag.y = sy;
        } else {
          t.rotY += ((sx - drag.x) / Math.max(ow, 1)) * Math.PI * 2.4; // ngang: quay trái/phải
          t.rotX += ((sy - drag.y) / Math.max(oh, 1)) * Math.PI * 2.0; // dọc: ngửa/cúi
          t.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, t.rotX));
          drag.x = sx;
          drag.y = sy;
        }
      } else if (gm === "pan") {
        if (drag.mode !== "pan") {
          drag.mode = "pan";
          drag.x = sx;
          drag.y = sy;
        } else {
          t.panX += ((sx - drag.x) / Math.max(ow, 1)) * 2.2;
          t.panY -= ((sy - drag.y) / Math.max(oh, 1)) * 2.2;
          drag.x = sx;
          drag.y = sy;
        }
      } else {
        drag.mode = "idle";
      }

      // ---- 4) con trỏ trong khung 3D (để raycast) ----
      const box = sceneBoxRef.current?.getBoundingClientRect();
      if (box) {
        const rx = (sx - box.left) / box.width;
        const ry = (sy - box.top) / box.height;
        cursorRef.current.x = rx;
        cursorRef.current.y = ry;
        cursorRef.current.active = gm === "point" && rx >= 0 && rx <= 1 && ry >= 0 && ry <= 1;
      }

      // ---- 5) dwell: chỉ khi đang ở chế độ trỏ ----
      const d = dwellRef.current;
      let targetKey = "";
      if (gm === "point") {
        const el = document.elementFromPoint(sx, sy) as HTMLElement | null;
        targetKey = el?.closest<HTMLElement>("[data-gesture-target]")?.dataset.gestureTarget ?? "";
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
          if (targetKey.startsWith("mesh:")) {
            setPicked(hoveredRef.current);
          } else if (targetKey.startsWith("layer:")) {
            const [, cat, field] = targetKey.split(":");
            toggleLayer(cat as CatKey, field as "visible" | "faded");
          } else if (targetKey === "clear") {
            setPicked(null);
          } else if (targetKey === "explode") {
            t.explode = t.explode > 0 ? 0 : 1;
          } else if (targetKey === "reset") {
            resetView();
          }
        }
      }

      // ---- 6) vẽ con trỏ + vòng tiến trình ----
      if (octx) {
        const color =
          gm === "rotate" ? "#ffb347" : gm === "pan" ? "#7fb2ff" : gm === "zoom" ? "#b98cff" : "#ffffff";
        octx.beginPath();
        octx.arc(sx, sy, 9, 0, Math.PI * 2);
        octx.fillStyle = color;
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
    [resetView, toggleLayer],
  );

  const { fps, handCount, status, error } = useHandTracking(videoRef, enabled, {
    onFrame: handleFrame,
    maxHands: 2, // cần 2 tay cho cử chỉ phóng to/thu nhỏ
  });

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <h1 className="text-sm font-semibold text-[var(--ink)]">
          Giải phẫu cẳng tay · điều khiển bằng cử chỉ
        </h1>
        <span className="hidden rounded-full bg-[var(--surf-2)] px-3 py-1 text-xs text-[var(--body-fg)] md:inline">
          {MODE_LABEL[mode]}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-[var(--muted)]">
            FPS{" "}
            <b style={{ color: fps >= 24 ? "#0f8a7c" : fps >= 15 ? "#a9701a" : "#c0453b" }}>{fps}</b>
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
            transformRef={transformRef}
          />

          {hovered && (
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-[#1c1813]/85 px-4 py-2 text-sm font-semibold text-[#f4efe6]">
              {hovered.name}
            </div>
          )}

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
                onClick={() =>
                  (transformRef.current.explode = transformRef.current.explode > 0 ? 0 : 1)
                }
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
              >
                Tách lớp / gộp lại
              </button>
              <button
                data-gesture-target="reset"
                onClick={resetView}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
              >
                Về vị trí ban đầu
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Cử chỉ
            </h2>
            <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--body-fg)]">
              <li>• <b>Ngón trỏ</b> di chuyển → con trỏ; giữ yên 1,5s để chọn</li>
              <li>• <b>Chụm ngón cái–trỏ rồi kéo</b> → xoay: ngang là quay, dọc là ngửa/cúi</li>
              <li>• <b>Nắm tay rồi kéo</b> → di chuyển mô hình lên xuống, trái phải</li>
              <li>• <b>Hai tay cùng chụm, dang ra/khép vào</b> → phóng to / thu nhỏ</li>
            </ul>
          </div>
        </aside>
      </div>

      <canvas
        ref={cursorCanvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />
    </div>
  );
}
