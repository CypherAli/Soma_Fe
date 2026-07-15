"use client";

import { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { useAnatomyStore, type SelectedPart } from "@/store/useAnatomyStore";

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

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url, "/draco/");
  useEffect(() => {
    // Mỗi mesh một material riêng để highlight độc lập.
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((m) => m.clone())
          : mesh.material.clone();
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
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
        if (m.isMesh && m.name) return m;
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

export default function ModelScene({ url }: { url: string }) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 1.2], fov: 40, near: 0.01, far: 100 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={["#0b1220"]} />
      <hemisphereLight intensity={0.8} groundColor="#0b1220" />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} />
      <Bounds fit clip observe margin={1.1}>
        <Center>
          <Model url={url} />
        </Center>
      </Bounds>
      <Picker />
      <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={0.15} maxDistance={6} />
    </Canvas>
  );
}

useGLTF.preload("/models/cardiovascular.glb", "/draco/");
