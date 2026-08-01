"use client";

import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model thân trên flagship — đầy đủ cả nội tạng, bóc tách nhiều lớp.
export default function XemThan() {
  return (
    <ArmScenePage
      slug="giai-phau-than"
      modelUrl="/models/trunk.glb"
      cats={["skin", "muscle", "organ", "artery", "vein", "nerve", "lymph", "bone"]}
      defaultFaded={["skin"]}
    />
  );
}
