"use client";

import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect } from "react";
type Theme = "light" | "dark";
export default function ThemeToggle({ fallback=false }:{ fallback?:boolean }) {
  useEffect(()=>{const saved=localStorage.getItem("soma3d-theme") as Theme|null;document.documentElement.dataset.theme=saved??"dark"},[]);
  function toggle(){const next=document.documentElement.dataset.theme==="dark"?"light":"dark";localStorage.setItem("soma3d-theme",next);document.documentElement.dataset.theme=next}
  return <ContentSurface scope="src/components/home/ThemeToggle.tsx"><button className={`theme-toggle${fallback?" theme-fallback":""}`} type="button" onClick={toggle} aria-label="Chuyển chế độ sáng hoặc tối" title="Sáng / tối"><svg className="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg className="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/></svg></button></ContentSurface>
}
