"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model cẳng tay – bàn tay flagship (mốc cắt tại khuỷu), đủ lớp bóc tách.
export default function XemCangTay() {
  return <ContentSurface scope="src/app/[locale]/xem-cang-tay/page.tsx">{(
    <ArmScenePage
      slug="giai-phau-cang-tay"
      modelUrl="/models/forearm.glb"
      cats={["skin", "muscle", "artery", "vein", "nerve", "bone"]}
      defaultFaded={["skin"]}
    />
  )}</ContentSurface>;
}
