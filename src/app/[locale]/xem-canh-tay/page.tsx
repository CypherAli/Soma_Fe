"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import ArmScenePage from "@/components/home/ArmScenePage";
import "../../home.css";

// Trang model cánh tay flagship — layout scene (header + sidebar + 3D + panel).
export default function XemCanhTay() {
  return <ContentSurface scope="src/app/[locale]/xem-canh-tay/page.tsx"><ArmScenePage /></ContentSurface>;
}
