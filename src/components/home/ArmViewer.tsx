"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Center, Bounds, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ---- các lớp giải phẫu + màu ----
type CatKey = "skin" | "muscle" | "brain" | "artery" | "vein" | "nerve" | "lymph" | "eye" | "organ" | "bone";
const CATS: { key: CatKey; label: string; color: string }[] = [
  { key: "skin", label: "Da", color: "#e2b48f" },
  { key: "muscle", label: "Cơ", color: "#9e2b23" },
  { key: "brain", label: "Não", color: "#d7a8a2" },
  { key: "organ", label: "Nội tạng", color: "#b56a5a" },
  { key: "artery", label: "Động mạch", color: "#c0392b" },
  { key: "vein", label: "Tĩnh mạch", color: "#2c5aa0" },
  { key: "nerve", label: "Thần kinh", color: "#dcb42e" },
  { key: "lymph", label: "Bạch huyết", color: "#5f9e57" },
  { key: "eye", label: "Mắt", color: "#5f7fa6" },
  { key: "bone", label: "Xương", color: "#e9dcbe" },
];
const MAT: Record<CatKey, THREE.MeshStandardMaterial> = {
  skin: new THREE.MeshStandardMaterial({ color: "#e8b696", roughness: 0.66, metalness: 0 }),
  muscle: new THREE.MeshStandardMaterial({ color: "#9e2b23", roughness: 0.72, metalness: 0 }),
  brain: new THREE.MeshStandardMaterial({ color: "#d7a8a2", roughness: 0.85, metalness: 0 }),
  organ: new THREE.MeshStandardMaterial({ color: "#b56a5a", roughness: 0.6, metalness: 0 }),
  artery: new THREE.MeshStandardMaterial({ color: "#c0392b", roughness: 0.55, metalness: 0 }),
  vein: new THREE.MeshStandardMaterial({ color: "#2c5aa0", roughness: 0.55, metalness: 0 }),
  nerve: new THREE.MeshStandardMaterial({ color: "#dcb42e", roughness: 0.6, metalness: 0 }),
  lymph: new THREE.MeshStandardMaterial({ color: "#5f9e57", roughness: 0.7, metalness: 0 }),
  eye: new THREE.MeshStandardMaterial({ color: "#eef0f4", roughness: 0.28, metalness: 0 }), // sclera (lòng trắng)
  bone: new THREE.MeshStandardMaterial({ color: "#e9dcbe", roughness: 0.75, metalness: 0 }),
};
// Vật liệu con của NỘI TẠNG — mỗi tạng một màu để phân biệt (fade theo lớp "organ").
const ORGAN_SUBMATS: { keys: string[]; mat: THREE.MeshStandardMaterial }[] = [
  { keys: ["atrium", "ventricle", "papillary", "valve", "leaflet", "chordae", "heart"],
    mat: new THREE.MeshStandardMaterial({ color: "#8e2f2a", roughness: 0.5 }) },       // tim
  { keys: ["lung", "lobe of", "pleura", "bronch", "trachea"],
    mat: new THREE.MeshStandardMaterial({ color: "#d98c94", roughness: 0.7 }) },        // phổi
  { keys: ["liver", "hepat"],
    mat: new THREE.MeshStandardMaterial({ color: "#6e3b34", roughness: 0.65 }) },       // gan
  { keys: ["spleen", "splenic"],
    mat: new THREE.MeshStandardMaterial({ color: "#6b3b5a", roughness: 0.6 }) },        // lách
  { keys: ["kidney", "renal", "ureter", "adrenal", "suprarenal"],
    mat: new THREE.MeshStandardMaterial({ color: "#7a4a3a", roughness: 0.6 }) },        // thận
  { keys: ["pancrea"],
    mat: new THREE.MeshStandardMaterial({ color: "#caa96b", roughness: 0.7 }) },        // tụy
  { keys: ["gallbladder", "bile", "cystic duct"],
    mat: new THREE.MeshStandardMaterial({ color: "#6e8c4a", roughness: 0.6 }) },        // túi mật
];
const ORGAN_GUT_MAT = new THREE.MeshStandardMaterial({ color: "#c98f63", roughness: 0.7 }); // ống tiêu hoá
function organMat(name: string): THREE.MeshStandardMaterial {
  const n = name.toLowerCase();
  for (const s of ORGAN_SUBMATS) if (s.keys.some((k) => n.includes(k))) return s.mat;
  return ORGAN_GUT_MAT; // dạ dày/ruột/mạc treo… màu nâu tiêu hoá
}
const ORGAN_ALL_SUBMATS = [...ORGAN_SUBMATS.map((s) => s.mat), ORGAN_GUT_MAT];
// Vật liệu con của MẮT để có lòng đen thật: mống mắt nâu, dịch kính tối (đồng tử),
// giác mạc trong suốt (không che mống mắt).
const IRIS_MAT = new THREE.MeshStandardMaterial({ color: "#4a3220", roughness: 0.35, metalness: 0 });
const VITREOUS_MAT = new THREE.MeshStandardMaterial({ color: "#15151c", roughness: 0.3, metalness: 0 });
const CORNEA_MAT = new THREE.MeshStandardMaterial({
  color: "#dfe7ee", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false,
});
const EYE_SUBMATS = [IRIS_MAT, VITREOUS_MAT, CORNEA_MAT];

const BONE_KEYS = ["humerus", "radius", "ulna", "scaphoid", "lunate", "triquetrum",
  "pisiform", "trapezium", "trapezoid", "capitate", "hamate", "metacarpal", "phalanx",
  "clavicle", "scapula", "frontal", "parietal", "occipital", "temporal bone", "sphenoid",
  "ethmoid", "nasal", "lacrimal", "maxilla", "zygomatic", "palatine", "vomer", "mandible",
  "hyoid", "concha", "incus", "malleus", "stapes", "tooth", "incisor", "canine", "premolar",
  "molar", "cartilage", "tarsus", "bone"];
const NERVE_KEYS = ["nerve", "plexus", "cord", "trunk of brachial", "division of",
  "sympathetic", "roots of brachial"];
const BRAIN_KEYS = ["brain", "cerebr", "cerebell", "brainstem", "telencephal", "diencephal",
  "medulla", "midbrain", "pons", "thalam", "ventricle", "callosum", "gyrus", "white matter"];
const EYE_KEYS = ["sclera", "cornea", "iris", "eyeball", "vitreous", "lens of"];
const ORGAN_KEYS = ["lung", "lobe of", "pleura", "bronch", "trachea", "liver", "hepat",
  "stomach", "gastric", "colon", "intestine", "duoden", "jejunum", "ileum", "caecum",
  "cecum", "appendix", "rectum", "taenia", "omentum", "mesocolon", "mesentery", "meso-",
  "kidney", "renal pelvis", "ureter", "adrenal", "suprarenal", "pancrea", "spleen",
  "splenic", "gallbladder", "bile", "cystic", "oesophagus", "esophagus", "atrium",
  "ventricle", "papillary", "leaflet", "valve of", "chordae", "heart"];

function pickCat(name: string): CatKey {
  const n = name.toLowerCase();
  if (n.includes("skin") || n.includes("envelope") || n.includes("fascia")) return "skin";
  if (n.includes("lymph") || n.includes("node")) return "lymph";
  if (EYE_KEYS.some((k) => n.includes(k))) return "eye";
  // mạch lớn trước để không nhầm sang tạng
  if (n.includes("artery") || n.includes("arterial") || n.includes("aorta") ||
      n.includes("pulmonary trunk") || n.includes("palmar arch")) return "artery";
  if (n.includes("vein") || n.includes("venous") || n.includes("vena cava") ||
      n.includes("venae")) return "vein";
  if (ORGAN_KEYS.some((k) => n.includes(k))) return "organ";
  if (NERVE_KEYS.some((k) => n.includes(k))) return "nerve";
  if (BRAIN_KEYS.some((k) => n.includes(k))) return "brain";
  if (BONE_KEYS.some((k) => n.includes(k))) return "bone";
  return "muscle";
}

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
