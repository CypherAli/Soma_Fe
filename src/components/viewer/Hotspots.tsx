"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsComp } from "@react-three/drei";
import * as THREE from "three";
import { useAnatomyStore, type SelectedPart } from "@/store/useAnatomyStore";

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControlsComp>;

type HotspotDef = {
  key: string;
  /**
   * Tên mesh CHÍNH XÁC trong glTF (Z-Anatomy/TA2), đã verify tồn tại thật
   * trong public/models/visceral.glb bằng cách đọc JSON chunk của glb —
   * không tự đoán/đặt tên khác để tránh gắn nhầm vị trí.
   */
  meshName: string;
  /** Lệch label so với điểm neo (px màn hình) — chỉ để tránh đè chữ giữa các pin. */
  offset: [number, number];
};

// "Liver" cố ý CHƯA đưa vào: trong glTF nó là node cha chứa 8 mesh phân thùy
// con (không phải 1 mesh đơn), Ẩn/Cô lập theo đúng nghĩa "cả lá gan" cần xử lý
// riêng theo nhóm — để tạm ngoài danh sách thay vì gắn sai/nửa vời.
const VISCERAL_HOTSPOTS: HotspotDef[] = [
  { key: "stomach", meshName: "Stomach", offset: [120, -70] },
  { key: "gallbladder", meshName: "Gallbladder", offset: [150, 0] },
  { key: "pancreas", meshName: "Pancreas", offset: [-20, 95] },
  { key: "kidney-l", meshName: "Kidney.l", offset: [-150, 45] },
  { key: "kidney-r", meshName: "Kidney.r", offset: [160, 55] },
  { key: "bladder", meshName: "Urinary bladder", offset: [10, 130] },
];

/**
 * GLTFLoader tự "làm sạch" tên node lúc dựng scene runtime — xoá các ký tự
 * dành riêng ([ ] . : /) và đổi khoảng trắng thành "_" (three.js
 * PropertyBinding.sanitizeNodeName). Vì vậy "Kidney.l" trong file gốc trở
 * thành mesh.name = "Kidneyl" lúc chạy — phải áp đúng quy tắc này khi tra
 * cứu theo tên, nếu không mesh sẽ không tìm thấy (không phải do sai vị trí).
 */
function sanitizeGltfName(raw: string): string {
  return raw.replace(/\s/g, "_").replace(/[[\].:/]/g, "");
}

function cleanName(raw: string): string {
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
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera, scene } = useThree();
  const visceralOn = useAnatomyStore((s) => s.visibleSystems.visceral);
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const homeRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const animRef = useRef<CamAnim | null>(null);

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

  // Chỉ tìm mesh thật trong scene đã nạp — không có mesh khớp tên (vd hệ
  // đang tắt/chưa nạp xong) thì KHÔNG render pin đó, tránh pin lơ lửng sai vị trí.
  const resolved = useMemo(() => {
    if (!visceralOn) return [];
    return VISCERAL_HOTSPOTS.map((h) => {
      const mesh = scene.getObjectByName(sanitizeGltfName(h.meshName)) as THREE.Mesh | undefined;
      if (!mesh || !mesh.isMesh) return null;
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const radius = box.getSize(new THREE.Vector3()).length() / 2;
      return { def: h, mesh, center, radius };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    // scene.children.length như một proxy để re-chạy khi model nạp xong.
  }, [visceralOn, scene, scene.children.length]);

  const focus = (center: THREE.Vector3, radius: number, controls: OrbitControlsImpl) => {
    if (!homeRef.current) {
      homeRef.current = { pos: camera.position.clone(), target: controls.target.clone() };
    }
    const dir = camera.position.clone().sub(controls.target).normalize();
    const dist = Math.max(radius * 2.8, 0.12);
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

  const handleClick = (item: (typeof resolved)[number]) => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (activeKey === item.def.key) {
      reset(controls);
      setActiveKey(null);
      setSelected(null);
      return;
    }
    focus(item.center, item.radius, controls);
    setActiveKey(item.def.key);
    // Hiển thị dùng TÊN GỐC (item.def.meshName) — mesh.name lúc chạy đã bị
    // GLTFLoader khử ký tự (mất dấu chấm phân cách trái/phải) nên không còn
    // đúng định dạng để cleanName() tách "· trái/phải" chính xác.
    const payload: SelectedPart = {
      id: item.mesh.name,
      name: cleanName(item.def.meshName),
      latin: item.def.meshName.replace(/_/g, " "),
    };
    setSelected(payload);
  };

  return (
    <>
      {resolved.map((item) => {
        const active = activeKey === item.def.key;
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
                onClick={() => handleClick(item)}
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
