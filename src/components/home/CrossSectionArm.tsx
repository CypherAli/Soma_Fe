"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as THREE from "three";

// ---- lớp + màu ----
type Cat = "skin" | "muscle" | "artery" | "vein" | "nerve" | "lymph" | "bone";
const COLOR: Record<Cat, string> = {
  skin: "#e2b48f", muscle: "#9e2b23", artery: "#c0392b", vein: "#2c5aa0",
  nerve: "#dcb42e", lymph: "#5f9e57", bone: "#e9dcbe",
};
const BONE_KEYS = ["humerus", "radius", "ulna", "scaphoid", "lunate", "triquetrum",
  "pisiform", "trapezium", "trapezoid", "capitate", "hamate", "metacarpal", "phalanx",
  "clavicle", "scapula", "bone"];
const NERVE_KEYS = ["nerve", "plexus", "cord", "trunk of brachial", "division of",
  "sympathetic", "roots of brachial"];
function pickCat(name: string): Cat {
  const n = name.toLowerCase();
  if (n.includes("skin") || n.includes("envelope") || n.includes("fascia")) return "skin";
  if (n.includes("lymph") || n.includes("node")) return "lymph";
  if (NERVE_KEYS.some((k) => n.includes(k))) return "nerve";
  if (n.includes("artery") || n.includes("palmar arch")) return "artery";
  if (n.includes("vein")) return "vein";
  if (BONE_KEYS.some((k) => n.includes(k))) return "bone";
  return "muscle";
}

function cleanGeom(src: THREE.BufferGeometry, m: THREE.Matrix4) {
  const g = src.index ? src.toNonIndexed() : src.clone();
  g.applyMatrix4(m);
  if (!g.getAttribute("normal")) g.computeVertexNormals();
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", g.getAttribute("position"));
  out.setAttribute("normal", g.getAttribute("normal"));
  return out;
}

// nhóm stencil (đếm front/back) cho 1 khối mô, cắt bởi plane
function stencilGroup(geo: THREE.BufferGeometry, plane: THREE.Plane, order: number) {
  const g = new THREE.Group();
  const base = new THREE.MeshBasicMaterial();
  base.depthWrite = false; base.depthTest = false; base.colorWrite = false;
  base.stencilWrite = true; base.stencilFunc = THREE.AlwaysStencilFunc;

  const back = base.clone();
  back.side = THREE.BackSide; back.clippingPlanes = [plane];
  back.stencilFail = THREE.IncrementWrapStencilOp;
  back.stencilZFail = THREE.IncrementWrapStencilOp;
  back.stencilZPass = THREE.IncrementWrapStencilOp;
  const mb = new THREE.Mesh(geo, back); mb.renderOrder = order; g.add(mb);

  const front = base.clone();
  front.side = THREE.FrontSide; front.clippingPlanes = [plane];
  front.stencilFail = THREE.DecrementWrapStencilOp;
  front.stencilZFail = THREE.DecrementWrapStencilOp;
  front.stencilZPass = THREE.DecrementWrapStencilOp;
  const mf = new THREE.Mesh(geo, front); mf.renderOrder = order; g.add(mf);
  return g;
}

function Model({ url, cutRef }: { url: string; cutRef: React.MutableRefObject<number> }) {
  const { scene } = useGLTF(url, "/draco/");

  const built = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2;

    // gộp geometry theo mô, đưa về gốc toạ độ (trừ center)
    const T = new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z);
    const byCat: Record<string, THREE.BufferGeometry[]> = {};
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const cat = pickCat(`${mesh.name} ${mesh.parent?.name ?? ""}`);
        const m = mesh.matrixWorld.clone().premultiply(T);
        (byCat[cat] ||= []).push(cleanGeom(mesh.geometry, m));
      }
    });

    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const root = new THREE.Group();
    const caps: THREE.Mesh[] = [];
    let order = 1;

    (Object.keys(byCat) as Cat[]).forEach((cat) => {
      const merged = mergeGeometries(byCat[cat], false);
      if (!merged) return;
      const col = new THREE.Color(COLOR[cat]);
      // khối chính (đục), bị cắt bởi plane, 2 mặt để thấy trong
      const mat = new THREE.MeshStandardMaterial({
        color: col, roughness: cat === "skin" ? 0.9 : 0.72, metalness: 0,
        side: THREE.DoubleSide, clippingPlanes: [plane], clipShadows: true,
      });
      const mesh = new THREE.Mesh(merged, mat);
      mesh.renderOrder = 0;
      root.add(mesh);
      // nhóm stencil
      root.add(stencilGroup(merged, plane, order));
      // nắp mặt cắt (đặc, đúng màu mô)
      const capMat = new THREE.MeshStandardMaterial({
        color: col, metalness: 0, roughness: 0.8, side: THREE.DoubleSide,
        stencilWrite: true, stencilRef: 0, stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp,
        stencilZPass: THREE.ReplaceStencilOp,
      });
      const cap = new THREE.Mesh(new THREE.PlaneGeometry(radius * 4, radius * 4), capMat);
      cap.onAfterRender = (r) => r.clearStencil();
      cap.renderOrder = order + 0.1;
      caps.push(cap);
      root.add(cap);
      order += 1;
    });
    return { root, plane, caps, center, radius };
  }, [scene]);

  // Mặt phẳng cắt và các nắp bị SỬA mỗi khung hình. Giữ chúng sau một ref rồi
  // mới sửa: giá trị do useMemo trả về được coi là bất biến, sửa thẳng vào đó
  // vừa bị lint chặn vừa sai về lâu dài — React Compiler có quyền dùng lại giá
  // trị memo hoá cũ và những gì ta ghi đè lên nó sẽ biến mất.
  const liveRef = useRef(built);
  useEffect(() => { liveRef.current = built; }, [built]);

  useFrame(() => {
    const { plane, caps } = liveRef.current;
    plane.constant = cutRef.current;
    // đặt các nắp lên đúng mặt phẳng cắt
    for (const cap of caps) {
      plane.coplanarPoint(cap.position);
      cap.lookAt(cap.position.clone().add(plane.normal));
    }
  });

  return <ContentSurface scope="src/components/home/CrossSectionArm.tsx"><primitive object={built.root} /></ContentSurface>;
}

export default function CrossSectionArm({ url = "/models/arm.glb" }: { url?: string }) {
  const cutRef = useRef(0);
  const [cut, setCut] = useState(0);
  const range = 0.55; // nửa chiều cao model (xấp xỉ)

  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const t = setTimeout(fire, 300);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  return <ContentSurface scope="src/components/home/CrossSectionArm.tsx">{(
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0.7, 0.2, 1.2], fov: 42, near: 0.01, far: 100 }}
      // Kích thước TƯỜNG MINH cho canvas: thiếu dòng này, R3F đo khung ở
      // lần dựng đầu ra 0 và KHÔNG khởi động lại — canvas nằm nguyên cỡ mặc
      // định 300x150, model không hề được tải và trang xem trắng trơn cho tới
      // khi người dùng đổi kích thước cửa sổ. Đã đo ngày 24/08/2026 trên trang
      // /giai-phau/mo-hinh/*: bắn một sự kiện resize là model tải ngay.
      style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, stencil: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => { gl.localClippingEnabled = true; }}
      >
        <color attach="background" args={["#f4efe6"]} />
        <hemisphereLight args={["#fff6ea", "#cbb9a0", 0.8]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff3e2" />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#e7d9c4" />
        <Model url={url} cutRef={cutRef} />
        <OrbitControls makeDefault enablePan minDistance={0.2} maxDistance={6} />
      </Canvas>

      <div style={panel}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>MẶT CẮT NGANG</div>
        <input
          type="range" min={-range} max={range} step={0.002} value={cut}
          onChange={(e) => { const v = +e.target.value; setCut(v); cutRef.current = v; }}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: 12, color: "#6f665a", marginTop: 6 }}>
          Kéo để trượt lát cắt lên/xuống · xoay bằng chuột
        </div>
      </div>
    </div>
  )}</ContentSurface>;
}

const panel: React.CSSProperties = {
  position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
  width: 340, padding: "14px 18px", background: "rgba(255,253,248,.92)",
  border: "1px solid #ddd2c0", borderRadius: 10, boxShadow: "0 10px 30px rgba(60,40,20,.12)",
  color: "#1c1813", fontFamily: "var(--font-sans, sans-serif)", backdropFilter: "blur(6px)",
};

useGLTF.preload("/models/arm.glb", "/draco/");
