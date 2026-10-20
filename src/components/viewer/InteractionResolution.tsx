"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/** OrbitControls regress lowers the pixel workload while the camera moves. */
export default function InteractionResolution() {
  const current = useThree((state) => state.performance.current);
  const initialDpr = useThree((state) => state.viewport.initialDpr);
  const setDpr = useThree((state) => state.setDpr);

  useEffect(() => {
    // Keep at least one rendered pixel per CSS pixel, even on a 1x display.
    setDpr(Math.max(Math.min(1, initialDpr), initialDpr * current));
  }, [current, initialDpr, setDpr]);

  return null;
}
