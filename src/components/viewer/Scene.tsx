"use client";

import { useRef } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useAnatomyStore, type SelectedPart } from "@/store/useAnatomyStore";

/**
 * Bộ phận giữ chỗ ở P0. Ở P1 sẽ được thay bằng mesh thật nạp từ glTF
 * (Z-Anatomy). Mỗi part đã có sẵn tên Latin/mô tả để chạy trọn vòng
 * tương tác: click -> highlight -> panel thông tin.
 */
type PlaceholderPart = {
  id: string;
  name: string;
  latin: string;
  description: string;
  color: string;
  position: [number, number, number];
  args: [number, number, number];
};

const PARTS: PlaceholderPart[] = [
  {
    id: "head",
    name: "Đầu",
    latin: "Caput",
    description: "Phần trên cùng của cơ thể chứa não bộ và các giác quan.",
    color: "#e8c8a0",
    position: [0, 2.1, 0],
    args: [0.55, 0.7, 0.55],
  },
  {
    id: "thorax",
    name: "Ngực",
    latin: "Thorax",
    description: "Khoang ngực chứa tim và phổi, được bảo vệ bởi lồng ngực.",
    color: "#d98c8c",
    position: [0, 1.0, 0],
    args: [1.1, 1.3, 0.6],
  },
  {
    id: "abdomen",
    name: "Bụng",
    latin: "Abdomen",
    description: "Khoang bụng chứa các cơ quan tiêu hóa.",
    color: "#d9a88c",
    position: [0, -0.2, 0],
    args: [0.95, 1.0, 0.55],
  },
  {
    id: "arm-left",
    name: "Cánh tay trái",
    latin: "Membrum superius sinistrum",
    description: "Chi trên bên trái, gồm cánh tay, cẳng tay và bàn tay.",
    color: "#e8c8a0",
    position: [-0.95, 0.9, 0],
    args: [0.32, 1.8, 0.32],
  },
  {
    id: "arm-right",
    name: "Cánh tay phải",
    latin: "Membrum superius dextrum",
    description: "Chi trên bên phải, gồm cánh tay, cẳng tay và bàn tay.",
    color: "#e8c8a0",
    position: [0.95, 0.9, 0],
    args: [0.32, 1.8, 0.32],
  },
  {
    id: "leg-left",
    name: "Chân trái",
    latin: "Membrum inferius sinistrum",
    description: "Chi dưới bên trái, gồm đùi, cẳng chân và bàn chân.",
    color: "#e8c8a0",
    position: [-0.45, -1.9, 0],
    args: [0.42, 2.0, 0.42],
  },
  {
    id: "leg-right",
    name: "Chân phải",
    latin: "Membrum inferius dextrum",
    description: "Chi dưới bên phải, gồm đùi, cẳng chân và bàn chân.",
    color: "#e8c8a0",
    position: [0.45, -1.9, 0],
    args: [0.42, 2.0, 0.42],
  },
];

function Part({ part }: { part: PlaceholderPart }) {
  const selected = useAnatomyStore((s) => s.selected?.id === part.id);
  const hovered = useAnatomyStore((s) => s.hovered === part.id);
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const setHovered = useAnatomyStore((s) => s.setHovered);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const payload: SelectedPart = {
      id: part.id,
      name: part.name,
      latin: part.latin,
      description: part.description,
    };
    setSelected(payload);
  };

  const emissive = selected ? "#38bdf8" : hovered ? "#0ea5e9" : "#000000";
  const emissiveIntensity = selected ? 0.6 : hovered ? 0.3 : 0;

  return (
    <mesh
      position={part.position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(part.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = "default";
      }}
      castShadow
    >
      <boxGeometry args={part.args} />
      <meshStandardMaterial
        color={part.color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.7}
        metalness={0.05}
      />
    </mesh>
  );
}

export default function Scene() {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const clearSelection = useAnatomyStore((s) => s.setSelected);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.5, 8], fov: 42 }}
      // Kích thước TƯỜNG MINH cho canvas: thiếu dòng này, R3F đo khung ở
      // lần dựng đầu ra 0 và KHÔNG khởi động lại — canvas nằm nguyên cỡ mặc
      // định 300x150, model không hề được tải và trang xem trắng trơn cho tới
      // khi người dùng đổi kích thước cửa sổ. Đã đo ngày 24/08/2026 trên trang
      // /giai-phau/mo-hinh/*: bắn một sự kiện resize là model tải ngay.
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => clearSelection(null)}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true }}
    >
      <hemisphereLight intensity={0.6} groundColor="#0b1220" />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <group>
        {PARTS.map((p) => (
          <Part key={p.id} part={p} />
        ))}
      </group>
      <ContactShadows
        position={[0, -3.05, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={5}
      />
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
