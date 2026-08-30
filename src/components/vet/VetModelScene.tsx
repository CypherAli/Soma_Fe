"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type SceneHotspot = { factId: string; position: [number, number, number]; label: string };

/**
 * Cảnh 3D cho một mẫu vật thú y.
 *
 * Cố ý KHÔNG dùng lại `ModelScene` bên người: cảnh đó đọc thẳng
 * `useAnatomyStore` (hệ đang bật, mesh đang ẩn/mờ/cô lập, mặt phẳng cắt) và
 * mọi thao tác của nó đều dựa trên tên mesh do Z-Anatomy gắn nhãn. Mẫu vật thú
 * y là một khối quét liền, tên mesh chỉ là "Object_0"…, nên bê sang thì toàn
 * bộ thanh điều khiển bên người hiện ra mà không điều khiển được gì.
 */
function Specimen({
  url,
  hotspots,
  active,
  onPick,
}: {
  url: string;
  hotspots: SceneHotspot[];
  active: string | null;
  onPick: (factId: string) => void;
}) {
  const { scene } = useGLTF(url, "/draco/");

  // Bản sao riêng cho mỗi lần gắn: `useGLTF` chia sẻ chung một cây scene giữa
  // các component, sửa material trực tiếp trên bản gốc là sửa cho cả trang.
  const { model, centre, span } = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      // Mẫu quét photogrammetry hay để roughness thấp → xương bóng như nhựa.
      if (mat && "roughness" in mat) {
        mat.roughness = 0.85;
        mat.metalness = 0;
        mat.side = THREE.FrontSide;
      }
    });
    const box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    const s = Math.max(...box.getSize(new THREE.Vector3()).toArray());
    return { model: root, centre: c, span: s };
  }, [scene]);

  /*
   * Tự dời mẫu về gốc thay vì bọc <Center>.
   *
   * <Center> đo hộp bao của MỌI thứ bên trong nó, nên nhét thêm mấy quả cầu
   * hotspot vào là hộp bao đổi và cả mẫu vật xê dịch theo — điểm chú giải tự
   * đẩy chính nó ra khỏi chỗ cần chỉ. Dời bằng tâm hộp bao của riêng mẫu thì
   * toạ độ hotspot (vốn đo bằng ĐỘ LỆCH SO VỚI TÂM HỘP BAO, xem
   * scripts/vet/hotspot_probe.py) rơi đúng vào vị trí thật.
   */
  return (
    <>
      <group position={[-centre.x, -centre.y, -centre.z]}>
        <primitive object={model} />
      </group>
      {hotspots.map((h) => (
        <mesh
          key={h.factId}
          position={h.position}
          onClick={(e) => {
            e.stopPropagation();
            onPick(h.factId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <sphereGeometry args={[span * (active === h.factId ? 0.03 : 0.022), 20, 16]} />
          <meshStandardMaterial
            color={active === h.factId ? "#f0c674" : "#d06a50"}
            emissive={active === h.factId ? "#7a5a1f" : "#3a140c"}
            roughness={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

export default function VetModelScene({
  url,
  hotspots = [],
  active = null,
  onPick,
}: {
  url: string;
  hotspots?: SceneHotspot[];
  active?: string | null;
  onPick?: (factId: string) => void;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0d0f12"]} />
      {/* Ba nguồn sáng thay vì một: mẫu xương nhiều hốc, một đèn thì hốc mắt và
          xoang mũi đen kịt, không đọc được hình. */}
      <hemisphereLight intensity={0.55} groundColor="#1a1d22" />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-4, -1, -3]} intensity={0.6} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.15}>
          <Specimen
            url={url}
            hotspots={hotspots}
            active={active}
            onPick={(id) => onPick?.(id)}
          />
        </Bounds>
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={0.6} maxDistance={12} />
    </Canvas>
  );
}
