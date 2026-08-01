"use client";

import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Center, Bounds, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * Sọ 3D xoay bàn tròn cho hero trang Người.
 * Model: /models/skull.glb (export từ Z-Anatomy, 22 xương sọ, Draco).
 * Vật liệu ngà thống nhất + nền trong suốt để hoà vào ô kem.
 */
function Skull({ url }: { url: string }) {
  const { scene } = useGLTF(url, "/draco/");

  const prepared = useMemo(() => {
    const bone = new THREE.MeshStandardMaterial({
      color: "#e9dcc2",
      roughness: 0.82,
      metalness: 0.0,
    });
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = bone;
        m.castShadow = false;
        m.receiveShadow = false;
      }
    });
    return scene;
  }, [scene]);

  return <primitive object={prepared} />;
}

export default function SkullTurntable({ url = "/models/skull.glb" }: { url?: string }) {
  // R3F đôi khi đo khung = 0 lúc mount (canvas kẹt 300×150). Bắn resize ở
  // frame kế để react-use-measure đọc lại đúng kích thước ô.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const t1 = setTimeout(fire, 120);
    const t2 = setTimeout(fire, 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.1, 2.4], fov: 38, near: 0.01, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* nền trong suốt: không <color attach="background"> */}
      <hemisphereLight args={["#fff6ea", "#cbb9a0", 0.7]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} color="#fff3e2" />
      <directionalLight position={[-4, 1, -3]} intensity={0.4} color="#e7d9c4" />
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <Skull url={url} />
        </Center>
      </Bounds>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.9}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/skull.glb", "/draco/");
