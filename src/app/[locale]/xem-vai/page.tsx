"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model đai vai – nách (khối vai phải cắt hộp), đủ lớp bóc tách.
export default function XemVai() {
  return <ContentSurface scope="src/app/[locale]/xem-vai/page.tsx">{(
    <ArmScenePage
      slug="giai-phau-dai-vai"
      modelUrl="/models/shoulder.glb"
      cats={["skin", "muscle", "artery", "vein", "nerve", "lymph", "bone"]}
      defaultFaded={["skin"]}
    />
  )}</ContentSurface>;
}
