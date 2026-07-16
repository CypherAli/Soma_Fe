"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { useAnatomyStore, type SelectedPart, type SystemKey } from "@/store/useAnatomyStore";
import Hotspots from "./Hotspots";

export const SYSTEM_FILES: Record<SystemKey, string> = {
  skeletal: "/models/skeletal.glb",
  muscular: "/models/muscular.glb",
  nervous: "/models/nervous.glb",
  cardiovascular: "/models/cardiovascular.glb",
  visceral: "/models/visceral.glb",
  lymphoid: "/models/lymphoid.glb",
  joints: "/models/joints.glb",
};

/** Bỏ hậu tố .l/.r/.j và ngoặc trong tên mesh Z-Anatomy → tên hiển thị gọn. */
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

function getStd(mesh: THREE.Mesh): THREE.MeshStandardMaterial | null {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial
    ? (mat as THREE.MeshStandardMaterial)
    : null;
}

/**
 * Màu mô THẬT theo đúng tên material gốc Z-Anatomy (đã đọc trực tiếp JSON
 * chunk của từng .glb để xác nhận tên tồn tại thật — không tự đặt tên khác).
 * Chỉ áp khi material KHÔNG có baseColorFactor thật trong file (mặc định
 * trắng [1,1,1] theo spec glTF) — các material đã có màu thật do Z-Anatomy
 * gán sẵn (VD Peritoneum cam, Lung hồng, Fascia xanh nhạt, Brain nâu đỏ...)
 * được GIỮ NGUYÊN, không ghi đè.
 */
const TISSUE_COLORS: Record<string, string> = {
  Bone: "#e8dfc8",
  Teeth: "#f2ede0",
  "Teeth-roots": "#f2ede0",
  Ligament: "#e0d3a0",
  Tendon: "#e0c98a",
  Artery: "#c23b3b",
  Vein: "#3a5fc2",
  Organ: "#c98a7c",
  Mucosa: "#d98a94",
  Gland: "#d9b89a",
  Bronchi: "#d9a08a",
  Ductus: "#d9b89a",
  Nerve: "#e8c468",
  "Articular capsule": "#d9c9a0",
};

const SYSTEM_FALLBACK_COLOR: Record<SystemKey, string> = {
  skeletal: "#e8dfc8",
  muscular: "#a5433e",
  nervous: "#e8c468",
  cardiovascular: "#c23b3b",
  visceral: "#c98a7c",
  lymphoid: "#a8c98a",
  joints: "#d9c9a0",
};

function SystemModel({
  url,
  visible,
  systemKey,
}: {
  url: string;
  visible: boolean;
  systemKey: SystemKey;
}) {
  const { scene } = useGLTF(url, "/draco/");
  const hiddenIds = useAnatomyStore((s) => s.hiddenIds);
  const fadedIds = useAnatomyStore((s) => s.fadedIds);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);

  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      // Mỗi mesh một material riêng để highlight độc lập.
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
      const std = getStd(mesh);
      if (!std) return;

      // Nhãn tổ chức Blender ("Text") bị lỡ xuất kèm mesh thật — không phải
      // giải phẫu, đánh dấu để luôn ẩn thay vì hiển thị lơ lửng trong scene.
      if (std.name === "Text") {
        mesh.userData.isLabel = true;
      }

      // Toàn bộ material export đều có emissiveFactor=[1,1,1] (tự phát sáng
      // trắng toàn phần) — lỗi ở bước export đè mất màu mô thật. Tắt hẳn.
      std.emissive.setScalar(0);
      std.emissiveIntensity = 0;

      // Chỉ điền màu khi material KHÔNG có màu thật (còn trắng mặc định).
      const isDefaultWhite = std.color.r === 1 && std.color.g === 1 && std.color.b === 1;
      if (isDefaultWhite) {
        const base = std.name.replace(/-\d+$/, "").trim();
        const fill = TISSUE_COLORS[base] ?? SYSTEM_FALLBACK_COLOR[systemKey];
        std.color.set(fill);
      }
    });
  }, [scene, systemKey]);

  // Ẩn/Mờ/Cô lập tra đúng theo TÊN MESH THẬT (m.name = tên giải phẫu gốc
  // Z-Anatomy/TA2) — không suy đoán theo nhóm, mỗi mesh xử lý độc lập.
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const isolatedOut = isolatedId !== null && mesh.name !== isolatedId;
      mesh.visible = !mesh.userData.isLabel && !hiddenIds[mesh.name] && !isolatedOut;
      const std = getStd(mesh);
      if (std) {
        const faded = !!fadedIds[mesh.name];
        std.transparent = faded;
        std.opacity = faded ? 0.15 : 1;
      }
    });
  }, [scene, hiddenIds, fadedIds, isolatedId]);

  return <primitive object={scene} visible={visible} />;
}

/**
 * Mặt cắt lát (clipping plane) toàn thân — áp `std.clippingPlanes` lên MỌI
 * mesh của cả 7 hệ, tính vị trí lát cắt từ bbox THẬT của scene đã nạp (không
 * đoán tọa độ cố định) nên luôn đúng theo kích thước model thực tế.
 * Bật DoubleSide khi cắt để lộ mặt trong của vỏ mesh thay vì để hổng/đen.
 */
function ClipRig() {
  const { scene } = useThree();
  const clipEnabled = useAnatomyStore((s) => s.clipEnabled);
  const clipAxis = useAnatomyStore((s) => s.clipAxis);
  const clipPercent = useAnatomyStore((s) => s.clipPercent);
  const clipKeepPositive = useAnatomyStore((s) => s.clipKeepPositive);

  const plane = useMemo(() => {
    if (!clipEnabled) return null;
    const box = new THREE.Box3().setFromObject(scene);
    if (box.isEmpty()) return null;
    const min = box.min[clipAxis];
    const max = box.max[clipAxis];
    const cut = min + ((max - min) * clipPercent) / 100;
    const axisUnit = new THREE.Vector3(
      clipAxis === "x" ? 1 : 0,
      clipAxis === "y" ? 1 : 0,
      clipAxis === "z" ? 1 : 0,
    );
    // Giữ nửa dương: normal cùng chiều trục, constant = -cut (dot(N,p)+C>=0 <=> p>=cut).
    // Giữ nửa âm: normal ngược chiều trục, constant = +cut (<=> p<=cut).
    const normal = clipKeepPositive ? axisUnit.clone() : axisUnit.clone().negate();
    const constant = clipKeepPositive ? -cut : cut;
    return new THREE.Plane(normal, constant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, clipEnabled, clipAxis, clipPercent, clipKeepPositive, scene.children.length]);

  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const std = getStd(mesh);
      if (!std) return;
      std.clippingPlanes = plane ? [plane] : null;
      std.clipShadows = true;
      std.side = plane ? THREE.DoubleSide : THREE.FrontSide;
    });
  }, [scene, plane]);

  return null;
}

/** Tự raycast hover + click (R3F event không nhận cây gltf ngoài đáng tin cậy). */
function Picker() {
  const { camera, gl, raycaster, scene } = useThree();
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const setHovered = useAnatomyStore((s) => s.setHovered);
  const hoverRef = useRef<THREE.Mesh | null>(null);
  const selRef = useRef<THREE.Mesh | null>(null);
  const downRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const el = gl.domElement;
    const HL_HOVER = new THREE.Color("#0ea5e9");
    const HL_SEL = new THREE.Color("#38bdf8");

    const paint = (mesh: THREE.Mesh | null, color: THREE.Color | null, intensity: number) => {
      if (!mesh) return;
      const std = getStd(mesh);
      if (std) {
        std.emissive.copy(color ?? new THREE.Color("#000000"));
        std.emissiveIntensity = intensity;
      }
    };

    const pickAt = (clientX: number, clientY: number): THREE.Mesh | null => {
      const rect = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const h of hits) {
        const m = h.object as THREE.Mesh;
        if (m.isMesh && m.name && m.visible) return m;
      }
      return null;
    };

    const onMove = (e: PointerEvent) => {
      const m = pickAt(e.clientX, e.clientY);
      if (m === hoverRef.current) return;
      if (hoverRef.current && hoverRef.current !== selRef.current) paint(hoverRef.current, null, 0);
      hoverRef.current = m;
      if (m && m !== selRef.current) paint(m, HL_HOVER, 0.35);
      setHovered(m ? m.name : null);
      el.style.cursor = m ? "pointer" : "default";
    };

    const onDown = (e: PointerEvent) => {
      downRef.current = [e.clientX, e.clientY];
    };

    const onUp = (e: PointerEvent) => {
      const d = downRef.current;
      downRef.current = null;
      if (!d) return;
      if (Math.abs(e.clientX - d[0]) > 5 || Math.abs(e.clientY - d[1]) > 5) return; // drag = xoay
      const m = pickAt(e.clientX, e.clientY);
      if (selRef.current) paint(selRef.current, null, 0);
      selRef.current = m;
      if (m) {
        paint(m, HL_SEL, 0.6);
        const payload: SelectedPart = { id: m.name, name: cleanName(m.name), latin: m.name.replace(/_/g, " ") };
        setSelected(payload);
      } else {
        setSelected(null);
      }
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, [camera, gl, raycaster, scene, setSelected, setHovered]);

  return null;
}

export default function ModelScene() {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const visibleSystems = useAnatomyStore((s) => s.visibleSystems);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 2.6], fov: 40, near: 0.01, far: 100 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
    >
      <color attach="background" args={["#0b1220"]} />
      <hemisphereLight intensity={0.8} groundColor="#0b1220" />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} />
      <Bounds fit clip observe margin={1.1}>
        <Center>
          <group>
            {(Object.keys(SYSTEM_FILES) as SystemKey[]).map((key) => (
              <SystemModel
                key={key}
                url={SYSTEM_FILES[key]}
                visible={visibleSystems[key]}
                systemKey={key}
              />
            ))}
          </group>
        </Center>
      </Bounds>
      <Picker />
      <ClipRig />
      <Hotspots controlsRef={controls} />
      <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={0.15} maxDistance={10} />
    </Canvas>
  );
}

Object.values(SYSTEM_FILES).forEach((url) => useGLTF.preload(url, "/draco/"));
