"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Cảnh 3D cho một mẫu vật thú y.
 *
 * Cố ý KHÔNG dùng lại `ModelScene` bên người: cảnh đó đọc thẳng
 * `useAnatomyStore` (hệ đang bật, mesh đang ẩn/mờ/cô lập, mặt phẳng cắt) và
 * mọi thao tác của nó đều dựa trên tên mesh do Z-Anatomy gắn nhãn. Mẫu vật thú
 * y là một khối quét liền, tên mesh chỉ là "Object_0"…, nên bê sang thì toàn
 * bộ thanh điều khiển bên người hiện ra mà không điều khiển được gì.
 *
 * Ở đây chỉ cần đúng ba việc: dựng đúng khung, xoay được, và sáng đều để nhìn
 * rõ mào xương — nên cảnh này giữ nhỏ.
 */
function Specimen({ url }: { url: string }) {
  const { scene } = useGLTF(url, "/draco/");

  // Bản sao riêng cho mỗi lần gắn: `useGLTF` chia sẻ chung một cây scene giữa
  // các component, sửa material trực tiếp trên bản gốc là sửa cho cả trang.
  const model = useMemo(() => {
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
    return root;
  }, [scene]);

  return <primitive object={model} />;
}

export default function VetModelScene({ url }: { url: string }) {
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
          <Center>
            <Specimen url={url} />
          </Center>
        </Bounds>
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={0.6} maxDistance={12} />
    </Canvas>
  );
}
