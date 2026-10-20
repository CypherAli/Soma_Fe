"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import InteractionResolution from "./InteractionResolution";
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

  return <ContentSurface scope="src/components/viewer/SectionModelScene.tsx"><primitive object={scene} /></ContentSurface>;
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
    let lastHover = -Infinity;
    const onMove = (e: PointerEvent) => {
      if (e.buttons || e.pointerType === "touch" || e.timeStamp - lastHover < 50) return;
      lastHover = e.timeStamp;
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


/**
 * Chỉ dựng <Canvas> KHI khung chứa đã có kích thước thật.
 *
 * Đo ngày 24/08/2026 trên /giai-phau/mo-hinh/* và /viewer: canvas nằm nguyên
 * cỡ mặc định 300x150, KHÔNG một file .glb nào được tải, trang xem trắng trơn
 * — mà chỉ cần cửa sổ đổi kích thước một lần là mọi thứ chạy ngay. Nguyên
 * nhân: khối 3D được nạp ĐỘNG (`next/dynamic`, ssr:false) nên lúc R3F đo khung
 * lần đầu, khung chứa còn 0x0; sau đó nó không đo lại nữa.
 *
 * Cách chắc chắn nhất là đảo ngược thứ tự: tự đo khung bằng ResizeObserver,
 * chỉ khi khung có kích thước thật mới gắn <Canvas> vào cây — khi đó phép đo
 * đầu tiên của R3F đã đúng, không cần mẹo bắn sự kiện resize.
 */
function useBoxReady() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 1 && r.height > 1) setReady(true);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    // Lưới an toàn: ResizeObserver chỉ được gọi trong bước dựng hình của trình
    // duyệt, nên nếu khung chứa mới có kích thước đúng lúc tab đang bị ẩn /
    // không dựng hình thì lần gọi ấy MẤT LUÔN, và trang đứng im vĩnh viễn với
    // một khung trắng. Vài lần kiểm lại bằng đồng hồ khiến việc đó không xảy ra.
    const timers = [150, 500, 1200, 2500].map((ms) => window.setTimeout(check, ms));
    return () => {
      ro.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  // Vẫn bắn một sự kiện resize sau khi <Canvas> đã gắn: đo trên chính máy dựng
  // (Chrome nhúng của công cụ) thấy ResizeObserver KHÔNG luôn kích hoạt lần
  // đầu, mà thư viện đo khung của R3F chỉ dựa vào ResizeObserver và sự kiện
  // resize của cửa sổ. Không có dòng này thì canvas vẫn kẹt ở cỡ 300x150 dù
  // khung chứa đã đúng kích thước.
  useEffect(() => {
    if (!ready) return;
    // Bắn VÀI LẦN chứ không một lần: bắn ngay ở khung hình kế tiếp thì bố cục
    // đôi khi chưa xong nên phép đo vẫn ra 0. Dừng ngay khi canvas đã được đặt
    // đúng cỡ (khác cỡ mặc định 300x150 của thẻ canvas).
    const timers = [0, 120, 400, 900].map((ms) =>
      window.setTimeout(() => {
        const el = ref.current?.querySelector("canvas");
        if (el && el.width > 300) return;
        window.dispatchEvent(new Event("resize"));
      }, ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [ready]);

  return { ref, ready };
}

export default function SectionModelScene({
  modelUrl,
  hotspots,
}: {
  modelUrl: string;
  hotspots: SceneHotspot[];
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  const { ref: boxRef, ready: boxReady } = useBoxReady();

  return <ContentSurface scope="src/components/viewer/SectionModelScene.tsx">{(
    <div ref={boxRef} style={{ width: "100%", height: "100%" }}>
    {boxReady && <Canvas
      dpr={[1, 1.75]}
      performance={{ min: 0.75 }}
      camera={{ position: [0, 0.95, 1.35], fov: 42, near: 0.01, far: 100 }}
      // Kích thước TƯỜNG MINH cho canvas: thiếu dòng này, R3F đo khung ở
      // lần dựng đầu ra 0 và KHÔNG khởi động lại — canvas nằm nguyên cỡ mặc
      // định 300x150, model không hề được tải và trang xem trắng trơn cho tới
      // khi người dùng đổi kích thước cửa sổ. Đã đo ngày 24/08/2026 trên trang
      // /giai-phau/mo-hinh/*: bắn một sự kiện resize là model tải ngay.
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
    >
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
      <InteractionResolution />
      <Picker />
      {/* Model cắt đã sẵn hệ xương+nội tạng nên requiredSystems để trống (luôn sẵn sàng). */}
      <Hotspots controlsRef={controls} hotspots={hotspots} requiredSystems={[]} />
      <OrbitControls ref={controls} makeDefault regress enablePan={false} minDistance={0.1} maxDistance={8} />
    </Canvas>}
    </div>
  )}</ContentSurface>;
}

// KHÔNG preload cứng một file ở đây. Trước đây dòng này preload
// "abdomen_section.glb" cho MỌI scene, nên mở scene bất kỳ (thính giác, mạc…)
// vẫn tải model bụng vô ích. Model đúng được nạp qua `useGLTF(modelUrl)`
// trong <SectionModel>, tức mỗi scene chỉ tải đúng file của nó.
