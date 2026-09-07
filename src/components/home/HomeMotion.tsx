"use client";

import { useEffect } from "react";

export default function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-motion-root");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("motion-enabled");

    const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduced) {
      reveals.forEach((node) => node.classList.add("is-visible"));
      return () => root.classList.remove("motion-enabled");
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
      { threshold: 0.16, rootMargin: "0px 0px -8%" },
    );
    reveals.forEach((node) => observer.observe(node));

    const panels = Array.from(root.querySelectorAll<HTMLElement>(".tc-panel"));
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewportCenter) / window.innerHeight));
        panel.style.setProperty("--scroll-y", `${(progress * -18).toFixed(2)}px`);
      });
    };
    const requestParallax = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax);
    };
    const pointImage = (event: PointerEvent) => {
      const panel = (event.target as Element | null)?.closest<HTMLElement>(".tc-panel");
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - .5) * 10}px`);
      panel.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - .5) * 8}px`);
    };
    const resetImage = (event: PointerEvent) => {
      const panel = (event.target as Element | null)?.closest<HTMLElement>(".tc-panel");
      panel?.style.setProperty("--pointer-x", "0px");
      panel?.style.setProperty("--pointer-y", "0px");
    };

    updateParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
    root.addEventListener("pointermove", pointImage, { passive: true });
    root.addEventListener("pointerleave", resetImage, { passive: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestParallax);
      root.removeEventListener("pointermove", pointImage);
      root.removeEventListener("pointerleave", resetImage);
      root.classList.remove("motion-enabled");
    };
  }, []);

  return null;
}
