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
    // Clone TRƯỚC khi đè vật liệu: `useGLTF` trả về một cây scene dùng chung
    // theo url. Sọ mèo ở hero khu thú y và khung xem trên trang Mèo là cùng
    // một tệp — đè thẳng lên bản gốc thì vào hero một lần là mẫu vật bên trang
    // loài cũng hoá màu ngà, mất luôn màu quét thật.
    const root = scene.clone(true);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = bone;
        m.castShadow = false;
        m.receiveShadow = false;
      }
    });
    // CHUẨN HOÁ KÍCH THƯỚC về cạnh dài nhất = 1.
    //
    // Vì sao bắt buộc: <Bounds fit> lùi camera theo cỡ THẬT của mẫu. Sọ người
    // rộng 0,2 đơn vị nên camera đứng cách ~0,4 — vừa vặn. Sọ mèo quét ra 71
    // đơn vị thì camera phải lùi ~133, mà `far` của camera là 100 ⇒ toàn bộ
    // mẫu nằm ngoài mặt phẳng cắt xa và KHÔNG VẼ GÌ CẢ: ô hero đen trơn, không
    // một lỗi nào trong console, tệp .glb vẫn tải về đủ.
    //
    // Chuẩn hoá ở đây thay vì nới `far` để mọi mẫu sau này — dù quét ra theo
    // milimet hay theo mét — đều rơi vào cùng một dải số. <Bounds> vốn không
    // phụ thuộc tỉ lệ nên khung hình của sọ người không đổi.
    const box = new THREE.Box3().setFromObject(root);
    const span = Math.max(...box.getSize(new THREE.Vector3()).toArray());
    if (span > 0) root.scale.setScalar(1 / span);

    return root;
  }, [scene]);

  return <primitive object={prepared} />;
}

export default function SkullTurntable({
  url = "/models/skull.glb",
  margin = 1.13,
}: {
  url?: string;
  /** Hệ số khung của <Bounds>. Đo theo từng model — xem ghi chú ở <Bounds>. */
  margin?: number;
}) {
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
      camera={{ position: [0, 0.1, 2.8], fov: 38, near: 0.01, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* nền trong suốt: không <color attach="background"> */}
      <hemisphereLight args={["#fff6ea", "#cbb9a0", 0.7]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} color="#fff3e2" />
      <directionalLight position={[-4, 1, -3]} intensity={0.4} color="#e7d9c4" />
      {/* bbox world-space của skull.glb: 0.1487 rộng × 0.2092 cao × 0.2036 sâu.
          maxSize = 0.2092 rơi vào trục CAO ⇒ Bounds fit luôn căn theo chiều cao,
          và sọ hiện ra cao đúng bằng (chiều cao ô) / margin.

          <Center> đưa TÂM BBOX về gốc và Bounds ngắm vào gốc đó, nên khung đối
          xứng quanh tâm. Ràng buộc vì thế KHÔNG phải (max-min) mà là
          2*max(|lệch so với tâm|): hàm dưới thò xuống dưới tâm nhiều hơn vòm sọ
          thò lên, nên thiếu margin là cắt CẰM trước.

          Đo thật 62.546 đỉnh, quét toàn dải polar (scripts/blender):
            polar ±21° (cũ) → cần margin 1.200   ← 1.2 gốc chuẩn đến từng phần nghìn
            polar ±10°      → cần margin 1.115
            polar  ±8°      → cần margin 1.094
          Kẹp polar về ±8° (bàn xoay trang trí, không cần ngửa/cúi nhiều) để hạ
          margin xuống 1.13 — dư 3.2% ≈ 9px mỗi phía ở ô cao 560px.
          Muốn sọ to hơn nữa thì tăng chiều cao ô .human-fig-3d, ĐỪNG hạ margin.

          SỌ MÈO (/models/vet/cat-cranium.glb) có tỉ lệ khác nên margin khác.
          Đo 253.450 đỉnh: bbox 61,83 × 71,31 × 65,46; bán kính khi xoay quanh
          trục đứng = 47,19, maxSize = 71,31 ⇒ 2·r/maxSize = 1,323 so với 1,204
          của sọ người. Nhân theo tỉ lệ đó: 1,13 × 1,323/1,204 ≈ 1,24 — lấy
          1,28 cho dư. Sọ mèo ngắn và bè hơn sọ người, thiếu margin là cắt gò má.
          Bỏ `clip`: nó ép near/far theo bounding box, quay nghiêng là cắt mặt. */}
      <Bounds fit observe margin={margin}>
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
        minPolarAngle={THREE.MathUtils.degToRad(82)}
        maxPolarAngle={THREE.MathUtils.degToRad(98)}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/skull.glb", "/draco/");
