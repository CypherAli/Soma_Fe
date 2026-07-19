"use client";

import { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import type { SceneHotspot } from "@/lib/sceneModules";
import Hotspots from "./Hotspots";
import { getAllStd, prepareAnatomyScene, applyVisibility } from "./materials";

function SectionModel({ url }: { url: string }) {
  const { scene } = useGLTF(url, "/draco/");
  const hiddenIds = useAnatomyStore((s) => s.hiddenIds);
  const fadedIds = useAnatomyStore((s) => s.fadedIds);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);

  // Model cắt trộn nhiều loại mô (xương/cơ/tạng) — màu lấy theo TÊN material
  // nên fallback "visceral" chỉ dùng cho mesh trắng lạ.
  // KHÔNG ép DoubleSide toàn cục nữa: script Blender đã recalc_face_normals
  // cho mọi mesh (kể cả mặt nắp mới bịt) nên FrontSide mặc định đã đúng —
  // DoubleSide làm GPU vẽ gấp đôi số mặt, chính là nguyên nhân "load rồi
  // trắng" (WebGL Context Lost) trên GPU tích hợp yếu.
  useEffect(() => {
    prepareAnatomyScene(scene, "visceral");
  }, [scene]);

  useEffect(() => {
    applyVisibility(scene, hiddenIds, fadedIds, isolatedId);
  }, [scene, hiddenIds, fadedIds, isolatedId]);

  return <primitive object={scene} />;
}

/** Raycast hover + click cho model cắt (R3F event trên cây gltf ngoài không đáng tin). */
function Picker() {
  const { camera, gl, raycaster, scene } = useThree();
  const setActiveHotspotKey = useAnatomyStore((s) => s.setActiveHotspotKey);
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
      for (const std of getAllStd(mesh)) {
        std.emissive.copy(color ?? new THREE.Color("#000000"));
        std.emissiveIntensity = intensity;
      }
    };
    const pickAt = (cx: number, cy: number): THREE.Mesh | null => {
      const rect = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((cx - rect.left) / rect.width) * 2 - 1,
        -((cy - rect.top) / rect.height) * 2 + 1,
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
    const onDown = (e: PointerEvent) => { downRef.current = [e.clientX, e.clientY]; };
    const onUp = (e: PointerEvent) => {
      const d = downRef.current; downRef.current = null;
      if (!d) return;
      if (Math.abs(e.clientX - d[0]) > 5 || Math.abs(e.clientY - d[1]) > 5) return;
      const m = pickAt(e.clientX, e.clientY);
      if (selRef.current) paint(selRef.current, null, 0);
      selRef.current = m;
      if (m) {
        paint(m, HL_SEL, 0.6);
        // Zoom + hiện tên: giao lại cho Hotspots xử lý (đã có sẵn animation
        // camera + set InfoPanel), tránh viết 1 bộ camera-fly thứ 2 ở đây.
        setActiveHotspotKey(m.name);
      } else {
        // Click trượt ra khoảng trống (rất dễ xảy ra khi đang xoay mô hình)
        // CHỈ xoá thông tin đang hiện — KHÔNG kéo camera về vị trí gốc, vì
        // đó gây cảm giác "vừa zoom xong tự nhảy về" rất khó chịu. Muốn về
        // lại toàn cảnh, bấm lại đúng nhãn đang chọn (bỏ chọn tường minh).
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
  }, [camera, gl, raycaster, scene, setActiveHotspotKey, setSelected, setHovered]);

  return null;
}

export default function SectionModelScene({
  modelUrl,
  hotspots,
}: {
  modelUrl: string;
  hotspots: SceneHotspot[];
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.95, 1.35], fov: 42, near: 0.01, far: 100 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
    >
      <color attach="background" args={["#eef1f6"]} />
      <hemisphereLight args={["#fff4e6", "#c9ccd4", 0.55]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.25} color="#fff3e2" />
      <directionalLight position={[-5, 1, 2]} intensity={0.35} color="#dbe6f5" />
      <directionalLight position={[-2, 3, -6]} intensity={0.5} color="#ffffff" />
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <SectionModel url={modelUrl} />
        </Center>
      </Bounds>
      <Picker />
      {/* Model cắt đã sẵn hệ xương+nội tạng nên requiredSystems để trống (luôn sẵn sàng). */}
      <Hotspots controlsRef={controls} hotspots={hotspots} requiredSystems={[]} />
      <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={0.1} maxDistance={8} />
    </Canvas>
  );
}

useGLTF.preload("/models/abdomen_section.glb", "/draco/");
