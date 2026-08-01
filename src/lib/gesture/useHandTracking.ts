"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { Point2DFilter } from "./oneEuro";

// Chỉ số landmark hay dùng (MediaPipe Hands, 21 điểm/bàn tay).
export const LM = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_TIP: 8,
  MIDDLE_PIP: 10,
  MIDDLE_TIP: 12,
  RING_PIP: 14,
  RING_TIP: 16,
  PINKY_PIP: 18,
  PINKY_TIP: 20,
} as const;

/** Khung xương bàn tay để vẽ overlay. */
export const HAND_BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

export type Landmark = { x: number; y: number; z: number };
export type TrackedHand = {
  /** "Left" | "Right" theo MediaPipe (đã tính ảnh gương). */
  handedness: string;
  landmarks: Landmark[];
  /** Đầu ngón trỏ đã lọc rung, toạ độ chuẩn hoá 0..1 (x đã lật gương). */
  cursor: { x: number; y: number };
};

export type HandTrackingState = {
  hands: TrackedHand[];
  fps: number;
  status: "idle" | "loading" | "running" | "error";
  error: string | null;
};

/**
 * Bật webcam + MediaPipe HandLandmarker, chạy vòng lặp nhận diện theo rAF.
 * Model & WASM nạp từ /public (không phụ thuộc CDN).
 */
export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement | null>, enabled: boolean) {
  const [state, setState] = useState<HandTrackingState>({
    hands: [],
    fps: 0,
    status: "idle",
    error: null,
  });

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const filtersRef = useRef<Map<string, Point2DFilter>>(new Map());
  const fpsRef = useRef({ frames: 0, last: performance.now(), value: 0 });

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
  }, [videoRef]);

  useEffect(() => {
    if (!enabled) {
      stop();
      setState((s) => ({ ...s, status: "idle", hands: [] }));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setState((s) => ({ ...s, status: "loading", error: null }));

        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");
        const landmarker = await vision.HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: "/mediapipe/hand_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        setState((s) => ({ ...s, status: "running" }));

        const loop = () => {
          rafRef.current = requestAnimationFrame(loop);
          const v = videoRef.current;
          const lm = landmarkerRef.current;
          if (!v || !lm || v.readyState < 2) return;

          const now = performance.now();
          if (v.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = v.currentTime;
            let result: HandLandmarkerResult;
            try {
              result = lm.detectForVideo(v, now);
            } catch {
              return;
            }

            const hands: TrackedHand[] = result.landmarks.map((points, i) => {
              // MediaPipe trả handedness theo ảnh gốc; video hiển thị lật gương nên đảo lại
              const raw = result.handedness[i]?.[0]?.categoryName ?? "Right";
              const handedness = raw === "Left" ? "Right" : "Left";
              const key = `${handedness}-${i}`;
              let filter = filtersRef.current.get(key);
              if (!filter) {
                filter = new Point2DFilter(1.2, 0.03);
                filtersRef.current.set(key, filter);
              }
              const tip = points[LM.INDEX_TIP];
              const cursor = filter.filter(1 - tip.x, tip.y, now); // lật x cho khớp ảnh gương
              return {
                handedness,
                landmarks: points.map((p) => ({ x: 1 - p.x, y: p.y, z: p.z })),
                cursor,
              };
            });

            const f = fpsRef.current;
            f.frames += 1;
            if (now - f.last >= 500) {
              f.value = Math.round((f.frames * 1000) / (now - f.last));
              f.frames = 0;
              f.last = now;
            }
            setState((s) => ({ ...s, hands, fps: f.value }));
          }
        };
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setState((s) => ({ ...s, status: "error", error: msg }));
      }
    })();

    return () => {
      cancelled = true;
      stop();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [enabled, stop, videoRef]);

  return state;
}
