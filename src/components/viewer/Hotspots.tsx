"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsComp } from "@react-three/drei";
import * as THREE from "three";
import { useAnatomyStore, type SelectedPart, type SystemKey } from "@/store/useAnatomyStore";
import type { SceneHotspot } from "@/lib/sceneModules";

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControlsComp>;

/**
 * GLTFLoader tự "làm sạch" tên node lúc dựng scene runtime — xoá các ký tự
 * dành riêng ([ ] . : /) và đổi khoảng trắng thành "_" (three.js
 * PropertyBinding.sanitizeNodeName). Vì vậy "Kidney.l" trong file gốc trở
 * thành mesh.name = "Kidneyl" lúc chạy — phải áp đúng quy tắc này khi tra
 * cứu theo tên, nếu không mesh sẽ không tìm thấy (không phải do sai vị trí).
 */
export function sanitizeGltfName(raw: string): string {
  return raw.replace(/\s/g, "_").replace(/[[\].:/]/g, "");
}

/** Bỏ hậu tố .l/.r/.j và ngoặc trong tên mesh Z-Anatomy gốc → tên hiển thị gọn. */
export function cleanName(raw: string): string {
  let n = raw.replace(/_/g, " ");
  const m = n.match(/\.(ol|or|l|r|j)$/i);
  let side = "";
  if (m) {
    const s = m[1].toLowerCase();
    side = s === "l" || s === "ol" ? " · trái" : s === "r" || s === "or" ? " · phải" : "";
    n = n.slice(0, m.index);
  }
  n = n.replace(/^\(/, "").replace(/\)$/, "").trim();
  return n + side;
}

type CamAnim = {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  t0: number;
  duration: number;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Hotspots({
  controlsRef,
  hotspots,
  requiredSystems,
  autoFocusOnLoad = false,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  hotspots: SceneHotspot[];
  /** Hotspot chỉ render khi TẤT CẢ các hệ này đang bật (tránh pin nổi khi hệ chứa nó đã tắt). */
  requiredSystems: SystemKey[];
  /** Tự động zoom camera vào gộp toàn bộ hotspot khi vào scene lần đầu (dùng cho trang scene riêng). */
  autoFocusOnLoad?: boolean;
}) {
  const { camera, scene } = useThree();
  const visibleSystems = useAnatomyStore((s) => s.visibleSystems);
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const activeHotspotKey = useAnatomyStore((s) => s.activeHotspotKey);
  const setActiveHotspotKey = useAnatomyStore((s) => s.setActiveHotspotKey);
  const systemsReady = requiredSystems.every((k) => visibleSystems[k]);

  const homeRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const animRef = useRef<CamAnim | null>(null);
  const prevActiveKeyRef = useRef<string | null>(null);
  const didAutoFocusRef = useRef(false);

  useFrame(() => {
    const controls = controlsRef.current;
    const anim = animRef.current;
    if (!anim || !controls) return;
    const t = Math.min(1, (performance.now() - anim.t0) / anim.duration);
    const e = easeOutCubic(t);
    camera.position.lerpVectors(anim.fromPos, anim.toPos, e);
    controls.target.lerpVectors(anim.fromTarget, anim.toTarget, e);
    controls.update();
    if (t >= 1) animRef.current = null;
  });

  // Chỉ tìm object thật trong scene đã nạp — không khớp tên (vd hệ đang
  // tắt/chưa nạp xong) thì KHÔNG render pin đó, tránh pin lơ lửng sai vị trí.
  // Chấp nhận cả Group (VD "Vertebra_T12" là node cha chứa 2 mesh con thân
  // đốt sống + cung đốt sống, không phải mesh đơn) — Box3().setFromObject
  // vẫn tính đúng bbox gộp cả con cho Group, chỉ mesh đơn mới có
  // material để paint highlight lúc chọn.
  const resolved = useMemo(() => {
    if (!systemsReady) return [];
    return hotspots.map((h) => {
      const obj = scene.getObjectByName(sanitizeGltfName(h.meshName));
      if (!obj) return null;
      const box = new THREE.Box3().setFromObject(obj);
      if (box.isEmpty()) return null;
      const center = box.getCenter(new THREE.Vector3());
      const radius = box.getSize(new THREE.Vector3()).length() / 2;
      return { def: h, obj, center, radius };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    // scene.children.length như một proxy để re-chạy khi model nạp xong.
  }, [systemsReady, hotspots, scene, scene.children.length]);

  const focus = (
    center: THREE.Vector3,
    radius: number,
    controls: OrbitControlsImpl,
    distanceMultiplier = 2.8,
  ) => {
    if (!homeRef.current) {
      homeRef.current = { pos: camera.position.clone(), target: controls.target.clone() };
    }
    const dir = camera.position.clone().sub(controls.target).normalize();
    const dist = Math.max(radius * distanceMultiplier, 0.12);
    const toPos = center.clone().add(dir.multiplyScalar(dist));
    animRef.current = {
      fromPos: camera.position.clone(),
      toPos,
      fromTarget: controls.target.clone(),
      toTarget: center.clone(),
      t0: performance.now(),
      duration: 650,
    };
  };

  const reset = (controls: OrbitControlsImpl) => {
    const home = homeRef.current;
    if (!home) return;
    animRef.current = {
      fromPos: camera.position.clone(),
      toPos: home.pos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: home.target.clone(),
      t0: performance.now(),
      duration: 650,
    };
    homeRef.current = null;
  };

  // Tự động zoom vào gộp toàn bộ hotspot khi mới vào scene (1 lần duy nhất),
  // dùng đúng bbox thật của các mesh đã resolve — không đoán camera cố định.
  useEffect(() => {
    if (!autoFocusOnLoad || didAutoFocusRef.current) return;
    if (resolved.length !== hotspots.length) return;
    const controls = controlsRef.current;
    if (!controls) return;
    didAutoFocusRef.current = true;
    const box = new THREE.Box3();
    resolved.forEach((r) => box.expandByObject(r.obj));
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2;
    // Multiplier lớn hơn zoom 1 điểm — gộp nhiều mesh cách xa nhau (VD đốt
    // sống ở sau lưng + tạng ở phía trước) cần lùi camera đủ xa để cả cụm
    // còn nằm trong khung hình, tránh điểm rìa bị rơi ra sau lưng camera.
    focus(center, radius, controls, 4.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocusOnLoad, resolved, hotspots.length, controlsRef]);

  // Toggle active hotspot đến từ CẢ pin 3D lẫn danh sách Labels bên panel
  // (cùng ghi vào store.activeHotspotKey) — effect này phản ứng chung 1 chỗ.
  useEffect(() => {
    if (activeHotspotKey === prevActiveKeyRef.current) return;
    const controls = controlsRef.current;
    if (!controls) return;
    prevActiveKeyRef.current = activeHotspotKey;
    if (activeHotspotKey === null) {
      reset(controls);
      setSelected(null);
      return;
    }
    const item = resolved.find((r) => r.def.key === activeHotspotKey);
    if (!item) return;
    focus(item.center, item.radius, controls);
    const payload: SelectedPart = {
      id: item.obj.name,
      name: cleanName(item.def.meshName),
      latin: item.def.meshName.replace(/_/g, " "),
    };
    setSelected(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHotspotKey, resolved]);

  const toggle = (key: string) => {
    setActiveHotspotKey(activeHotspotKey === key ? null : key);
  };

  return (
    <>
      {resolved.map((item) => {
        const active = activeHotspotKey === item.def.key;
        const [dx, dy] = item.def.offset;
        return (
          <Html key={item.def.key} position={item.center} zIndexRange={[10, 0]} sprite>
            <div className="pointer-events-none relative">
              <svg
                className="absolute left-0 top-0 overflow-visible"
                width={1}
                height={1}
              >
                <line
                  x1={0}
                  y1={0}
                  x2={dx}
                  y2={dy}
                  stroke={active ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={1.5}
                />
              </svg>
              <button
                type="button"
                onClick={() => toggle(item.def.key)}
                className={`pointer-events-auto flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-sm font-bold shadow ${
                  active
                    ? "border-sky-400 bg-sky-500 text-white"
                    : "border-slate-300 bg-white/90 text-slate-700 hover:bg-white"
                }`}
              >
                {active ? "−" : "+"}
              </button>
              <div
                className="pointer-events-none absolute whitespace-nowrap rounded border border-slate-300 bg-white/95 px-2 py-1 text-xs font-medium text-slate-800 shadow"
                style={{
                  left: dx,
                  top: dy,
                  transform: `translate(${dx > 0 ? "0%" : "-100%"}, -50%)`,
                }}
              >
                {cleanName(item.def.meshName)}
              </div>
            </div>
          </Html>
        );
      })}
    </>
  );
}
