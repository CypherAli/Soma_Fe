"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model đầu flagship — dùng chung layout, chỉ 4 lớp (Da/Cơ/Não/Xương).
export default function XemDau() {
  return <ContentSurface scope="src/app/[locale]/xem-dau/page.tsx">{(
    <ArmScenePage
      slug="giai-phau-dau"
      modelUrl="/models/head.glb"
      cats={["skin", "muscle", "artery", "vein", "nerve", "eye", "brain", "bone"]}
      defaultFaded={["skin"]}
    />
  )}</ContentSurface>;
}
