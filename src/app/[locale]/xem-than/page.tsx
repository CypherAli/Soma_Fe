"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model thân trên flagship — đầy đủ cả nội tạng, bóc tách nhiều lớp.
export default function XemThan() {
  return <ContentSurface scope="src/app/[locale]/xem-than/page.tsx">{(
    <ArmScenePage
      slug="giai-phau-than"
      modelUrl="/models/trunk.glb"
      cats={["skin", "muscle", "organ", "artery", "vein", "nerve", "lymph", "bone"]}
      defaultFaded={["skin"]}
    />
  )}</ContentSurface>;
}
