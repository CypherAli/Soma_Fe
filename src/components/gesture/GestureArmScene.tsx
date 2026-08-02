"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bounds, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  CATS,
  MAT,
  ORGAN_ALL_SUBMATS,
  organMat,
  pickCat,
  type CatKey,
} from "@/lib/anatomy/layers";

export type LayerState = Record<CatKey, { visible: boolean; faded: boolean }>;

/** Vật liệu tô sáng cấu trúc đang được ngón trỏ nhắm tới. */
const HIGHLIGHT = new THREE.MeshStandardMaterial({
  color: "#ffb347",
  emissive: "#c2600c",
  emissiveIntensity: 0.55,
  roughness: 0.5,
});

/** Đọc tên hiển thị gọn từ tên mesh glTF (bỏ hậu tố .r/.001, gạch dưới…). */
export function prettyMeshName(raw: string): string {
  return raw
    .replace(/\.\d+$/, "")
    .replace(/\.[lr]$/i, "")
    .replace(/_/g, " ")
    .trim();
}

function ForearmModel({
  url,
  layers,
  cursorRef,
  onHover,
  rotationRef,
  explodeRef,
}: {
  url: string;
  layers: LayerState;
  cursorRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  onHover: (info: { name: string; cat: CatKey } | null) => void;
  rotationRef: React.RefObject<number>;
  explodeRef: React.RefObject<number>;
}) {
  const { scene } = useGLTF(url, "/draco/");
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hoveredRef = useRef<THREE.Mesh | null>(null);

  // gán vật liệu theo lớp + ghi nhớ vị trí gốc để "tách lớp"
  const scn = useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const cat = pickCat(`${m.name} ${m.parent?.name ?? ""}`);
      m.userData.cat = cat;
      m.userData.baseMaterial = cat === "organ" ? organMat(m.name) : MAT[cat];
      m.material = m.userData.baseMaterial;
      m.renderOrder = cat === "skin" ? 10 : 0;
      if (!m.userData.homePosition) m.userData.homePosition = m.position.clone();
    });
    return scene;
  }, [scene]);

  // hiện/mờ theo lớp
  useEffect(() => {
    CATS.forEach((c) => {
      const mat = MAT[c.key];
      const faded = layers[c.key]?.faded;
      mat.transparent = !!faded;
      mat.opacity = faded ? 0.12 : 1;
      mat.depthWrite = !faded;
      mat.needsUpdate = true;
    });
    const organFaded = layers.organ?.faded;
    ORGAN_ALL_SUBMATS.forEach((mat) => {
      mat.transparent = !!organFaded;
      mat.opacity = organFaded ? 0.12 : 1;
      mat.depthWrite = !organFaded;
      mat.needsUpdate = true;
    });
    scn.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.visible = layers[m.userData.cat as CatKey]?.visible ?? true;
    });
  }, [scn, layers]);

  useFrame(() => {
    const group = groupRef.current;
    if (group) group.rotation.y = rotationRef.current ?? 0;

    // "tách lớp": đẩy từng nhóm ra xa tâm theo hệ số explode
    const k = explodeRef.current ?? 0;
    const offsets: Record<string, number> = {
      skin: 0.16, muscle: 0.09, artery: 0.045, vein: 0.03, nerve: 0.015, bone: 0,
    };
    scn.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.userData.homePosition) return;
      const off = offsets[m.userData.cat as string] ?? 0.05;
      m.position.copy(m.userData.homePosition as THREE.Vector3);
      m.position.x += off * k;
    });

    // raycast từ con trỏ ngón trỏ vào mô hình
    const cur = cursorRef.current;
    if (!cur?.active) {
      if (hoveredRef.current) {
        hoveredRef.current.material = hoveredRef.current.userData.baseMaterial;
        hoveredRef.current = null;
        onHover(null);
      }
      return;
    }
    const ndc = new THREE.Vector2(cur.x * 2 - 1, -(cur.y * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObject(scn, true);
    const hit = hits.find((h) => {
      const m = h.object as THREE.Mesh;
      return m.isMesh && m.visible && (m.material as THREE.Material)?.opacity !== 0.12;
    });
    const mesh = (hit?.object as THREE.Mesh) ?? null;

    if (mesh !== hoveredRef.current) {
      if (hoveredRef.current) hoveredRef.current.material = hoveredRef.current.userData.baseMaterial;
      hoveredRef.current = mesh;
      if (mesh) {
        mesh.material = HIGHLIGHT;
        onHover({ name: prettyMeshName(mesh.name), cat: mesh.userData.cat as CatKey });
      } else {
        onHover(null);
      }
    }
    void size;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scn} />
    </group>
  );
}

export default function GestureArmScene(props: {
  url?: string;
  layers: LayerState;
  cursorRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  onHover: (info: { name: string; cat: CatKey } | null) => void;
  rotationRef: React.RefObject<number>;
  explodeRef: React.RefObject<number>;
}) {
  const { url = "/models/forearm.glb", ...rest } = props;
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 2.4], fov: 40, near: 0.01, far: 100 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#f4efe6"]} />
      <hemisphereLight args={["#fff6ea", "#cbb9a0", 0.75]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} color="#fff3e2" />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#e7d9c4" />
      <Bounds fit clip observe margin={1.1}>
        <Center>
          <ForearmModel url={url} {...rest} />
        </Center>
      </Bounds>
    </Canvas>
  );
}

useGLTF.preload("/models/forearm.glb", "/draco/");
