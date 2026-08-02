"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GestureArmScene, {
  defaultTransform,
  type LayerState,
} from "@/components/gesture/GestureArmScene";
import { CATS, type CatKey } from "@/lib/anatomy/layers";
import {
  MODE_LABEL,
  ModeStabilizer,
  analyze,
  zoomFromSpan,
  type HandMode,
} from "@/lib/gesture/gestures";
import {
  HAND_BONES,
  useHandTracking,
  type FrameInfo,
  type TrackedHand,
} from "@/lib/gesture/useHandTracking";
import "../../home.css";

// ĐIỀU KHIỂN GIẢI PHẪU BẰNG CỬ CHỈ — mỗi bàn tay là một "chuột" độc lập.
//   Chỉ ngón trỏ            → con trỏ; giữ yên 1,5s = chọn
//   Ngón cái + trỏ mở/khép  → phóng to / thu nhỏ
//   Xoè cả bàn tay rồi xoay → xoay mô hình theo bàn tay
//   Nắm tay rồi kéo         → di chuyển mô hình
// Mọi tính toán chạy trong onFrame (ref-based) — không re-render mỗi khung hình.

const DWELL_MS = 1500;
const DWELL_MOVE_TOL_PX = 55;
const SHOWN_CATS: CatKey[] = ["skin", "muscle", "artery", "vein", "nerve", "bone"];
// Giới hạn di chuyển: đo thực tế cho thấy quá 0.3 là mô hình gần như ra khỏi khung.
const PAN_LIMIT = 0.28;
const ROT_STEP_MAX = 0.25; // chặn bước xoay mỗi khung hình, tránh giật văng
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const CURSOR_COLOR: Record<HandMode, string> = {
  point: "#ffffff",
  zoom: "#b98cff",
  rotate: "#ffb347",
  pan: "#7fb2ff",
};

type DwellState = { key: string; start: number; x: number; y: number; progress: number };
const newDwell = (): DwellState => ({ key: "", start: 0, x: 0, y: 0, progress: 0 });

export default function GestureControlPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneBoxRef = useRef<HTMLDivElement | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<{ name: string; cat: CatKey } | null>(null);
  const [picked, setPicked] = useState<{ name: string; cat: CatKey } | null>(null);
  const [modeText, setModeText] = useState("Chưa thấy tay");
  const [layers, setLayers] = useState<LayerState>(
    () =>
      Object.fromEntries(
        CATS.map((c) => [c.key, { visible: true, faded: c.key === "skin" }]),
      ) as LayerState,
  );

  const cursorRef = useRef({ x: 0.5, y: 0.5, active: false });
  const transformRef = useRef(defaultTransform());
  const dwellsRef = useRef<Map<string, DwellState>>(new Map());
  const dragRef = useRef<
    Map<string, { mode: HandMode; x: number; y: number; angle: number; span: number; base: number; baseX: number }>
  >(new Map());
  const hoveredRef = useRef<{ name: string; cat: CatKey } | null>(null);
  const modeTextRef = useRef("");
  const stabilizersRef = useRef<Map<string, ModeStabilizer>>(new Map());

  // Móc gỡ lỗi: cho phép thử biến đổi mô hình từ console mà không cần webcam
  // (kiểm chứng mô hình không bao giờ trôi mất khi xoay/zoom tới biên).
  useEffect(() => {
    (window as unknown as { somaGesture?: unknown }).somaGesture = transformRef.current;
  }, []);

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

  /** Thực thi hành động khi một mục tiêu được giữ đủ lâu. */
  const fireTarget = useCallback(
    (targetKey: string) => {
      const t = transformRef.current;
      if (targetKey.startsWith("mesh:")) setPicked(hoveredRef.current);
      else if (targetKey.startsWith("layer:")) {
        const [, cat, field] = targetKey.split(":");
        toggleLayer(cat as CatKey, field as "visible" | "faded");
      } else if (targetKey === "clear") setPicked(null);
      else if (targetKey === "explode") t.explode = t.explode > 0 ? 0 : 1;
      else if (targetKey === "reset") resetView();
    },
    [resetView, toggleLayer],
  );

  const handleFrame = useCallback(
    (hands: TrackedHand[], frame: FrameInfo, now: number) => {
      const analyzed = analyze(hands, stabilizersRef.current);

      // ---- webcam nhỏ: khung xương + nhãn chế độ từng tay ----
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
          for (const a of analyzed) {
            ctx.strokeStyle = CURSOR_COLOR[a.mode];
            ctx.lineWidth = 2;
            for (const [i, j] of HAND_BONES) {
              const pa = px(a.hand.landmarks[i].x, a.hand.landmarks[i].y);
              const pb = px(a.hand.landmarks[j].x, a.hand.landmarks[j].y);
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.stroke();
            }
            ctx.fillStyle = CURSOR_COLOR[a.mode];
            for (const p of a.hand.landmarks) {
              const q = px(p.x, p.y);
              ctx.beginPath();
              ctx.arc(q.x, q.y, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
            const w = px(a.hand.landmarks[0].x, a.hand.landmarks[0].y);
            ctx.fillStyle = "rgba(0,0,0,.6)";
            ctx.fillRect(w.x - 2, w.y + 2, 74, 14);
            ctx.fillStyle = "#fff";
            ctx.font = "10px system-ui";
            ctx.fillText(MODE_LABEL[a.mode], w.x + 2, w.y + 13);
          }
        }
      }

      // ---- lớp phủ con trỏ ----
      const overlay = cursorCanvasRef.current;
      const ow = overlay?.clientWidth ?? 0;
      const oh = overlay?.clientHeight ?? 0;
      if (overlay && (overlay.width !== ow || overlay.height !== oh)) {
        overlay.width = ow;
        overlay.height = oh;
      }
      const octx = overlay?.getContext("2d");
      octx?.clearRect(0, 0, ow, oh);

      const label = analyzed.length
        ? analyzed.map((a) => `${a.hand.handedness === "Right" ? "Phải" : "Trái"}: ${MODE_LABEL[a.mode]}`).join(" · ")
        : "Chưa thấy tay";
      if (label !== modeTextRef.current) {
        modeTextRef.current = label;
        setModeText(label);
      }

      if (analyzed.length === 0) {
        cursorRef.current.active = false;
        dwellsRef.current.clear();
        dragRef.current.clear();
        return;
      }

      const t = transformRef.current;
      const box = sceneBoxRef.current?.getBoundingClientRect();

      for (const a of analyzed) {
        const id = a.hand.handedness;
        const sx = a.hand.cursor.x * ow;
        const sy = a.hand.cursor.y * oh;

        let drag = dragRef.current.get(id);
        if (!drag || drag.mode !== a.mode) {
          // vào chế độ mới: chốt mốc để tính tương đối, tránh nhảy giật
          drag = {
            mode: a.mode,
            x: sx,
            y: sy,
            angle: a.fingers.angle,
            span: a.fingers.pinchSpan,
            base: a.mode === "zoom" ? t.zoom : a.mode === "rotate" ? t.rotY : 0,
            baseX: a.mode === "rotate" ? t.rotX : 0,
          };
          dragRef.current.set(id, drag);
        }

        if (a.mode === "zoom") {
          // Ánh xạ TUYỆT ĐỐI: độ mở hai ngón quyết định luôn cỡ mô hình.
          // Không dùng tỉ lệ so với lúc bắt đầu nữa — kiểu đó nhân dồn và văng mất mô hình.
          t.zoom = zoomFromSpan(a.fingers.pinchSpan);
        } else if (a.mode === "rotate") {
          // xoay bàn tay trong mặt phẳng camera → quay mô hình
          let dA = a.fingers.angle - drag.angle;
          while (dA > Math.PI) dA -= Math.PI * 2;
          while (dA < -Math.PI) dA += Math.PI * 2;
          const targetY = drag.base + dA * 1.8;
          t.rotY += clamp(targetY - t.rotY, -ROT_STEP_MAX, ROT_STEP_MAX);
          // nâng/hạ bàn tay → ngửa/cúi mô hình
          const targetX = clamp(
            drag.baseX + ((sy - drag.y) / Math.max(oh, 1)) * Math.PI * 1.2,
            -Math.PI / 2,
            Math.PI / 2,
          );
          t.rotX += clamp(targetX - t.rotX, -ROT_STEP_MAX, ROT_STEP_MAX);
        } else if (a.mode === "pan") {
          // cộng dồn nhưng LUÔN kẹp trong giới hạn -> không thể trôi mất.
          // Mô hình càng thu nhỏ thì cho di chuyển càng ít, để luôn còn trong khung.
          const lim = PAN_LIMIT * Math.min(1, t.zoom);
          t.panX = clamp(t.panX + ((sx - drag.x) / Math.max(ow, 1)) * 1.8, -lim, lim);
          t.panY = clamp(t.panY - ((sy - drag.y) / Math.max(oh, 1)) * 1.8, -lim, lim);
          drag.x = sx;
          drag.y = sy;
        }

        // ---- con trỏ + dwell (chỉ ở chế độ trỏ) ----
        let dwell = dwellsRef.current.get(id);
        if (!dwell) {
          dwell = newDwell();
          dwellsRef.current.set(id, dwell);
        }

        if (a.mode === "point") {
          // tay phải điều khiển raycast trong khung 3D
          if (box && (id === "Right" || analyzed.length === 1)) {
            const rx = (sx - box.left) / box.width;
            const ry = (sy - box.top) / box.height;
            cursorRef.current.x = rx;
            cursorRef.current.y = ry;
            cursorRef.current.active = rx >= 0 && rx <= 1 && ry >= 0 && ry <= 1;
          }
          const el = document.elementFromPoint(sx, sy) as HTMLElement | null;
          let targetKey =
            el?.closest<HTMLElement>("[data-gesture-target]")?.dataset.gestureTarget ?? "";
          if (!targetKey && cursorRef.current.active && hoveredRef.current && id === "Right") {
            targetKey = `mesh:${hoveredRef.current.name}`;
          }

          if (!targetKey) {
            dwell.key = "";
            dwell.progress = 0;
          } else if (
            dwell.key !== targetKey ||
            Math.hypot(sx - dwell.x, sy - dwell.y) > DWELL_MOVE_TOL_PX
          ) {
            dwell.key = targetKey;
            dwell.start = now;
            dwell.x = sx;
            dwell.y = sy;
            dwell.progress = 0;
          } else {
            dwell.progress = Math.min((now - dwell.start) / DWELL_MS, 1);
            if (dwell.progress >= 1) {
              dwell.progress = 0;
              dwell.start = now;
              dwell.key = "";
              fireTarget(targetKey);
            }
          }
        } else {
          dwell.key = "";
          dwell.progress = 0;
          if (id === "Right") cursorRef.current.active = false;
        }

        // ---- vẽ con trỏ: vòng ngắm + chữ thập + nhãn, nhìn là biết ngay ----
        if (octx) {
          const color = CURSOR_COLOR[a.mode];
          octx.save();
          // vòng ngoài tối để nổi trên nền sáng
          octx.beginPath();
          octx.arc(sx, sy, 16, 0, Math.PI * 2);
          octx.strokeStyle = "rgba(0,0,0,.55)";
          octx.lineWidth = 3;
          octx.stroke();
          octx.beginPath();
          octx.arc(sx, sy, 16, 0, Math.PI * 2);
          octx.strokeStyle = color;
          octx.lineWidth = 2;
          octx.stroke();
          // chữ thập giữa
          octx.beginPath();
          octx.moveTo(sx - 7, sy);
          octx.lineTo(sx + 7, sy);
          octx.moveTo(sx, sy - 7);
          octx.lineTo(sx, sy + 7);
          octx.strokeStyle = color;
          octx.lineWidth = 2;
          octx.stroke();
          // chấm tâm
          octx.beginPath();
          octx.arc(sx, sy, 3, 0, Math.PI * 2);
          octx.fillStyle = color;
          octx.fill();
          // nhãn: tay nào + đang làm gì
          const text = `${id === "Right" ? "A" : "B"} · ${MODE_LABEL[a.mode]}`;
          octx.font = "600 12px system-ui";
          const tw = octx.measureText(text).width;
          octx.fillStyle = "rgba(20,16,12,.82)";
          octx.beginPath();
          octx.roundRect(sx + 22, sy - 22, tw + 14, 22, 6);
          octx.fill();
          octx.fillStyle = "#fff";
          octx.fillText(text, sx + 29, sy - 7);
          // vòng tiến trình chọn
          if (dwell.progress > 0) {
            octx.beginPath();
            octx.arc(sx, sy, 26, -Math.PI / 2, -Math.PI / 2 + dwell.progress * Math.PI * 2);
            octx.strokeStyle = "#37c9b3";
            octx.lineWidth = 5;
            octx.lineCap = "round";
            octx.stroke();
          }
          octx.restore();
        }
      }
    },
    [fireTarget],
  );

  const { fps, handCount, status, error } = useHandTracking(videoRef, enabled, {
    onFrame: handleFrame,
    maxHands: 2,
  });

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <h1 className="text-sm font-semibold text-[var(--ink)]">
          Giải phẫu cẳng tay · điều khiển bằng cử chỉ
        </h1>
        <span className="hidden rounded-full bg-[var(--surf-2)] px-3 py-1 text-xs text-[var(--body-fg)] md:inline">
          {modeText}
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
              <li>• <b>Chỉ giơ ngón trỏ</b> → con trỏ; giữ yên 1,5s để chọn</li>
              <li>• <b>Ngón cái + trỏ</b>: mở rộng ra = phóng to, khép lại = thu nhỏ</li>
              <li>• <b>Xoè cả bàn tay rồi xoay</b> → mô hình xoay theo; nâng/hạ tay = ngửa/cúi</li>
              <li>• <b>Nắm tay rồi kéo</b> → di chuyển mô hình</li>
              <li className="pt-1 text-[var(--muted)]">Hai tay dùng được cùng lúc: A = tay phải, B = tay trái.</li>
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
