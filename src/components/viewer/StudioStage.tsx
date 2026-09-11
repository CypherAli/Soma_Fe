"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Sân khấu "studio" của trang toàn thân — nền sáng, ánh sáng môi trường và bệ
 * đứng, dựng đúng theo cách human-atlas làm (app/scene.tsx của nó).
 *
 * Lý do tồn tại: `MeshStandardMaterial` KHÔNG có `scene.environment` thì thành
 * phần phản xạ gần như bằng 0 — chỉ còn khuếch tán Lambert, nên mô nào cũng ra
 * cảm giác "nhựa dẹt" dù model có 4,3 triệu tam giác. Ba đèn hướng không thay
 * được: đèn hướng cho MỘT điểm sáng cứng, còn IBL cho CẢ BẦU phản xạ mềm bao
 * quanh — chính thứ tạo chuyển sắc trên bụng cơ và đầu xương.
 *
 * PMREM dựng từ RoomEnvironment nên KHÔNG tải file HDR nào qua mạng (khác
 * <Environment preset> của drei, vốn kéo ~2MB từ CDN và hỏng khi offline).
 */
export default function StudioStage({
  target,
}: {
  /** Nhóm chứa model — dùng để đo bbox mà đặt bệ đúng dưới bàn chân. */
  target: RefObject<THREE.Group | null>;
}) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as
    | { target: THREE.Vector3; update: () => void }
    | null;
  const platformRef = useRef<THREE.Group>(null);

  // ---- Ánh sáng môi trường (IBL) -------------------------------------------
  // Gắn bằng <primitive attach="environment"> chứ không gán thẳng
  // `scene.environment`: R3F tự tháo khi component rời cây, và tránh luôn lỗi
  // lint react-hooks/immutability (cấm sửa giá trị lấy ra từ hook).
  const envRT = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const rt = pmrem.fromScene(room, 0.04);
    room.dispose();
    pmrem.dispose();
    return rt;
  }, [gl]);
  useEffect(() => () => envRT.dispose(), [envRT]);

  // ---- Bệ đứng + vòng tiếp đất ---------------------------------------------
  // Hình học tạo một lần, đặt lại vị trí/tỉ lệ theo bbox thật của model.
  const parts = useMemo(() => {
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(30, 96),
      new THREE.MeshStandardMaterial({ color: 0xd5d9dc, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.7, 0.028, 100),
      new THREE.MeshStandardMaterial({ color: 0xeeeeec, metalness: 0.12, roughness: 0.67 }),
    );

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.63, 0.632, 128),
      new THREE.MeshBasicMaterial({ color: 0x8c969f, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;

    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.551, 128),
      new THREE.MeshBasicMaterial({ color: 0xa4aeb8, transparent: true, opacity: 0.16, side: THREE.DoubleSide }),
    );
    innerRing.rotation.x = -Math.PI / 2;

    // Nền và bệ KHÔNG được ăn mặt cắt của ClipRig (nó duyệt cả scene) — đánh
    // dấu để ClipRig bỏ qua, nếu không bật mặt cắt là bệ bị xén mất một nửa.
    for (const m of [ground, platform, ring, innerRing]) m.userData.isStage = true;
    return { ground, platform, ring, innerRing };
  }, []);

  useEffect(() => {
    return () => {
      for (const m of Object.values(parts)) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    };
  }, [parts]);

  // Đo bbox model rồi hạ bệ xuống đúng gót chân và đặt máy ảnh. Phải đo trong vòng lặp chứ
  // không trong effect: các .glb nạp bất đồng bộ, lúc effect chạy cây còn rỗng.
  // Dừng đo khi kết quả đã đứng yên 5 lần liên tiếp để không tốn CPU vô ích.
  const measure = useRef({ tick: 0, stable: 0, last: Number.NaN, framed: false });
  useFrame(() => {
    const m = measure.current;
    if (m.stable >= 5) return;
    if (m.tick++ % 20 !== 0) return;
    const group = target.current;
    const rig = platformRef.current;
    if (!group || !rig) return;
    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const base = box.min.y;
    // Bán kính bệ tỉ lệ theo chiều cao model (human-atlas chuẩn ở người cao 1,7m).
    const k = THREE.MathUtils.clamp(size.y / 1.7, 0.4, 3);
    rig.scale.setScalar(k);
    rig.position.set(center.x, base, center.z);

    // Khung ngắm mặc định: chép đúng `fit('three-quarter')` của human-atlas.
    //
    // Đọc từ app/scene.tsx của nó: hướng (.35,.06,1) chuẩn hoá, khoảng cách 4,
    // tâm ngắm (0, .68, 0); còn atlas.json cho biết model của nó chân ở y=0 và
    // cao 1.7297. Quy về tỉ lệ để dùng được với model cao bao nhiêu cũng đúng:
    // tâm ngắm ở 39.3% chiều cao tính từ gót, máy ảnh lùi 2.31 lần chiều cao.
    //
    // Phải là góc CHÉO chứ không phải chính diện: đèn key của bộ này đặt ở
    // (-2,4,3), nhìn thẳng mặt thì mặt phẳng trước cơ thể nhận sáng gần như
    // đều nhau nên khối bị dẹt và bợt; lệch ~19° mới có dải sáng-tối vắt chéo
    // thân người như ảnh mẫu.
    if (!m.framed && controls) {
      const eye = new THREE.Vector3(0.35, 0.06, 1).normalize();
      const focus = new THREE.Vector3(center.x, base + size.y * 0.3932, center.z);
      camera.position.copy(focus).addScaledVector(eye, size.y * 2.3125);
      controls.target.copy(focus);
      controls.update();
      m.framed = true;
    }

    m.stable = Math.abs(base - m.last) < 1e-4 ? m.stable + 1 : 0;
    m.last = base;
  });

  return (
    <>
      <primitive object={envRT.texture} attach="environment" />
      {/* Đúng bộ đèn của human-atlas: hemisphere làm nền dịu, key ấm trước-trên
          -trái, rim lạnh sau-phải tách khối khỏi nền sáng. */}
      <hemisphereLight args={[0xffffff, 0xa7acb2, 1.05]} />
      <directionalLight color={0xfffaf4} intensity={2.3} position={[-2, 4, 3]} />
      <directionalLight color={0xe9f0ff} intensity={1.8} position={[2, 2, -3]} />
      <group ref={platformRef}>
        <primitive object={parts.ground} position-y={-0.019} />
        <primitive object={parts.platform} position-y={-0.016} />
        <primitive object={parts.ring} position-y={0.001} />
        <primitive object={parts.innerRing} position-y={0.001} />
      </group>
    </>
  );
}
