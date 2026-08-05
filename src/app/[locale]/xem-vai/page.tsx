"use client";

import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model đai vai – nách (khối vai phải cắt hộp), đủ lớp bóc tách.
export default function XemVai() {
  return (
    <ArmScenePage
      slug="giai-phau-dai-vai"
      modelUrl="/models/shoulder.glb"
      cats={["skin", "muscle", "artery", "vein", "nerve", "lymph", "bone"]}
      defaultFaded={["skin"]}
    />
  );
}
