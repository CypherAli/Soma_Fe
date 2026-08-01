"use client";

import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model cổ flagship — dùng chung layout, đầy đủ lớp bóc tách.
export default function XemCo() {
  return (
    <ArmScenePage
      slug="giai-phau-co"
      modelUrl="/models/neck.glb"
      cats={["skin", "muscle", "artery", "vein", "nerve", "lymph", "bone"]}
      defaultFaded={["skin"]}
    />
  );
}
