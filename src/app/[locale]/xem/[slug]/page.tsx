"use client";

import { use } from "react";
import ArmScenePage from "@/components/home/ArmScenePage";
import { getSceneModule } from "@/lib/sceneModules";
import { regionViewerConfig } from "@/lib/scenes/regions";
import "../../../home.css";

// Route dùng chung cho MỌI scene "vùng cơ thể nhiều lớp": /xem/<slug>.
// Trước đây mỗi model flagship phải có một file route riêng (xem-canh-tay,
// xem-dau, xem-co…) — với hơn hai chục vùng thì cách đó không còn hợp lý.
export default function XemVung({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const mod = getSceneModule(slug);
  const view = regionViewerConfig[slug];
  if (!mod?.modelFile || !view) return null;

  return (
    <ArmScenePage
      slug={slug}
      modelUrl={mod.modelFile}
      cats={view.cats}
      defaultFaded={view.faded}
    />
  );
}
