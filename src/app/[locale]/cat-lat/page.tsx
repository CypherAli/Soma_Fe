"use client";

import CrossSectionArm from "@/components/home/CrossSectionArm";
import "../../home.css";

// Demo mặt cắt ngang đặc (capped cross-section) trên model cánh tay.
export default function CatLat() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f4efe6" }}>
      <CrossSectionArm />
    </div>
  );
}
