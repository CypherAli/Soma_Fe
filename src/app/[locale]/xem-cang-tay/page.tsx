"use client";

import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model cẳng tay – bàn tay flagship (mốc cắt tại khuỷu), đủ lớp bóc tách.
export default function XemCangTay() {
  return (
    <ArmScenePage
      slug="giai-phau-cang-tay"
      modelUrl="/models/forearm.glb"
      cats={["skin", "muscle", "artery", "vein", "nerve", "bone"]}
      defaultFaded={["skin"]}
    />
  );
}
