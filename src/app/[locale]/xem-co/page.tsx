"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model cổ flagship — dùng chung layout, đầy đủ lớp bóc tách.
export default function XemCo() {
  return <ContentSurface scope="src/app/[locale]/xem-co/page.tsx">{(
    <ArmScenePage
      slug="giai-phau-co"
      modelUrl="/models/neck.glb"
      cats={["skin", "muscle", "artery", "vein", "nerve", "lymph", "bone"]}
      defaultFaded={["skin"]}
    />
  )}</ContentSurface>;
}
