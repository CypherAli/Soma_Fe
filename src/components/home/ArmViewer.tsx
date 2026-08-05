"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Center, Bounds, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  CATS,
  CORNEA_MAT,
  EYE_SUBMATS,
  IRIS_MAT,
  MAT,
  ORGAN_ALL_SUBMATS,
  VITREOUS_MAT,
  organMat,
  pickCat,
  type CatKey,
} from "@/lib/anatomy/layers";

type LayerState = Record<CatKey, { visible: boolean; faded: boolean }>;

function ArmModel({ url, layers }: { url: string; layers: LayerState }) {
  const { scene } = useGLTF(url, "/draco/");

  const scn = useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const cat = pickCat(`${m.name} ${m.parent?.name ?? ""}`);
        m.userData.cat = cat;
        m.material = MAT[cat];
        m.renderOrder = cat === "skin" ? 10 : 0; // da vẽ sau để trong suốt đúng
        if (cat === "eye") {
          const nm = m.name.toLowerCase();
          if (nm.includes("iris")) m.material = IRIS_MAT;
          else if (nm.includes("vitreous") || nm.includes("posterior segment")) m.material = VITREOUS_MAT;
          else if (nm.includes("cornea")) { m.material = CORNEA_MAT; m.renderOrder = 11; }
          // còn lại (sclera) giữ MAT.eye trắng
        } else if (cat === "organ") {
          m.material = organMat(m.name); // mỗi tạng một màu
        }
      }
    });
    return scene;
  }, [scene]);

  useEffect(() => {
    // độ mờ theo lớp (chỉnh trên material dùng chung của cả nhóm)
    CATS.forEach((c) => {
      const mat = MAT[c.key];
      if (layers[c.key].faded) {
        mat.transparent = true; mat.opacity = 0.12; mat.depthWrite = false;
      } else {
        mat.transparent = false; mat.opacity = 1; mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
    // mắt: các vật liệu con theo trạng thái mờ của lớp "Mắt"
    const eyeFaded = layers.eye?.faded;
    EYE_SUBMATS.forEach((mat) => {
      if (eyeFaded) {
        mat.transparent = true; mat.opacity = 0.12; mat.depthWrite = false;
      } else if (mat === CORNEA_MAT) {
        mat.transparent = true; mat.opacity = 0.16; mat.depthWrite = false;
      } else {
        mat.transparent = false; mat.opacity = 1; mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
    // nội tạng: các vật liệu con theo trạng thái mờ của lớp "Nội tạng"
    const organFaded = layers.organ?.faded;
    ORGAN_ALL_SUBMATS.forEach((mat) => {
      if (organFaded) {
        mat.transparent = true; mat.opacity = 0.12; mat.depthWrite = false;
      } else {
        mat.transparent = false; mat.opacity = 1; mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
    scn.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.visible = layers[m.userData.cat as CatKey]?.visible ?? true;
    });
  }, [scn, layers]);

  return <primitive object={scn} />;
}

export default function ArmViewer({
  url = "/models/arm.glb",
  cats,
  defaultFaded,
}: {
  url?: string;
  cats?: CatKey[]; // giới hạn lớp hiện trong bảng (mặc định: đủ 8)
  defaultFaded?: CatKey[]; // lớp mở ra ở trạng thái MỜ sẵn (vd da) để lộ chi tiết bên trong
}) {
  const shown = cats ? CATS.filter((c) => cats.includes(c.key)) : CATS;
  const [layers, setLayers] = useState<LayerState>(() =>
    Object.fromEntries(
      CATS.map((c) => [c.key, { visible: true, faded: defaultFaded?.includes(c.key) ?? false }]),
    ) as LayerState,
  );

  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const t1 = setTimeout(fire, 150);
    const t2 = setTimeout(fire, 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const toggle = (k: CatKey, field: "visible" | "faded") =>
    setLayers((s) => ({ ...s, [k]: { ...s[k], [field]: !s[k][field] } }));

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.1, 2.6], fov: 40, near: 0.01, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#f4efe6"]} />
        <hemisphereLight args={["#fff6ea", "#cbb9a0", 0.75]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff3e2" />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#e7d9c4" />
        <directionalLight position={[0, -3, 2]} intensity={0.3} color="#ffffff" />
        <Bounds fit clip observe margin={1.15}>
          <Center>
            <ArmModel url={url} layers={layers} />
          </Center>
        </Bounds>
        <OrbitControls makeDefault enablePan minDistance={0.3} maxDistance={8}
          autoRotate autoRotateSpeed={0.4} />
      </Canvas>

      {/* Bảng điều khiển lớp */}
      <div style={panelStyle}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, letterSpacing: ".04em" }}>
          LỚP GIẢI PHẪU
        </div>
        {shown.map((c) => {
          const st = layers[c.key];
          return (
            <div key={c.key} style={rowStyle}>
              <span style={{ ...dotStyle, background: c.color }} />
              <span style={{ flex: 1, opacity: st.visible ? 1 : 0.4 }}>{c.label}</span>
              <button style={btnStyle(st.visible)} onClick={() => toggle(c.key, "visible")}>
                {st.visible ? "Hiện" : "Ẩn"}
              </button>
              <button style={btnStyle(!st.faded)} onClick={() => toggle(c.key, "faded")}>
                {st.faded ? "Mờ" : "Rõ"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  position: "absolute", top: 20, right: 20, width: 230, padding: "14px 16px", zIndex: 5,
  background: "rgba(255,253,248,.92)", border: "1px solid #ddd2c0", borderRadius: 10,
  boxShadow: "0 10px 30px rgba(60,40,20,.12)", fontFamily: "var(--font-sans, sans-serif)",
  color: "#1c1813", backdropFilter: "blur(6px)",
};
const rowStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13.5,
};
const dotStyle: React.CSSProperties = {
  width: 12, height: 12, borderRadius: 3, flexShrink: 0, border: "1px solid rgba(0,0,0,.12)",
};
const btnStyle = (on: boolean): React.CSSProperties => ({
  fontSize: 11, padding: "3px 9px", borderRadius: 6, cursor: "pointer",
  border: "1px solid #ddd2c0", background: on ? "#1c1813" : "transparent",
  color: on ? "#f4efe6" : "#6f665a", minWidth: 40,
});

useGLTF.preload("/models/arm.glb", "/draco/");
