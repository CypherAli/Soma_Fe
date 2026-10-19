
import { ContentSurface } from "@/components/content/ContentProvider";
import type { ReactNode, SVGProps } from "react";

const p: Record<string, ReactNode> = {
  "i-grid": <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></>,
  "i-region": <><circle cx="12" cy="6" r="3"/><path d="M7.5 21v-5.2a4.5 4.5 0 0 1 9 0V21M4 12h3m-1.5-1.5v3M17 12h3m-1.5-1.5v3"/></>,
  "i-system": <><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="4.5" r="1.5"/><circle cx="5.5" cy="16" r="1.5"/><circle cx="18.5" cy="16" r="1.5"/><path d="M12 9.5V6m-2.1 7.4-3.1 1.8m7.3-1.8 3.1 1.8"/></>,
  "i-full": <><circle cx="12" cy="4.5" r="2.2"/><path d="M8.5 10.5 7 15m8.5-4.5L17 15M9 8h6l-1 6 .8 7m-5.6 0 .8-7-1-6M10 14h4"/></>,
  "i-cross": <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5" opacity=".35"/><path d="M12 7v10M7 12h10"/></>,
  "i-bone": <><path d="m8.5 14.8 6.3-6.3M6.8 17.2a2.4 2.4 0 1 1-3.4-3.4c.7-.7 1.6-.9 2.5-.6l7.3-7.3a2.4 2.4 0 1 1 3.4 3.4c-.7.7-1.6.9-2.5.6l-7.3 7.3Z"/><path d="M6.8 17.2a2.4 2.4 0 1 1 3.4 3.4M17.2 6.8a2.4 2.4 0 1 0 3.4-3.4"/></>,
  "i-muscle": <><path d="M5 11.5c1.8-1 3-2.8 3.3-5.1L8.5 5a2 2 0 0 1 4 .5v2.2c0 1 .8 1.8 1.8 1.8h1.2c1.2 0 2.3-.7 2.8-1.8l.4-.9c1.2 1.7 1.6 3.7 1 5.8C18.8 16.4 15.4 19 11.5 19H8a4 4 0 0 1-3-6.5Z"/><path d="M10 13.5c1.8 1.4 4.2 1.4 6 0"/></>,
  "i-brain": <><path d="M10.5 4.2A3 3 0 0 0 5.8 7a3 3 0 0 0-.7 5.5A3.4 3.4 0 0 0 10 18.8l2-1.3V6l-1.5-1.8Z"/><path d="M13.5 4.2A3 3 0 0 1 18.2 7a3 3 0 0 1 .7 5.5 3.4 3.4 0 0 1-4.9 6.3l-2-1.3V6l1.5-1.8ZM8 9.5h4m4 3h-4M8.5 15l3.5-2"/></>,
  "i-heart": <><path d="M12 20.5S4 16 4 9.7A4.2 4.2 0 0 1 11.5 7l.5.7.5-.7A4.2 4.2 0 0 1 20 9.7c0 6.3-8 10.8-8 10.8Z"/><path d="m7.5 12 2-2 2.2 4 2-3 2.8 1"/></>,
  "i-stomach": <><path d="M9 3v6.2c0 1.3 1 2.3 2.3 2.3h.8c1.1 0 1.9-.9 1.9-2V7.8c0-1.1.9-2 2-2 2.2 0 4 1.8 4 4V13c0 4.4-3.6 8-8 8H9.5A5.5 5.5 0 0 1 4 15.5V12"/><path d="M8.2 17.8c1.6-1.4 3.8-1.5 5.8-.5"/></>,
  "i-lungs": <path d="M12 3v9m0-3-3-3M9 7.5v11c-1.5 1.4-5 1-5-2.8 0-3.6 1.5-7.9 5-8.2Zm6 0v11c1.5 1.4 5 1 5-2.8 0-3.6-1.5-7.9-5-8.2ZM12 9l3-3"/>,
  "i-nephro": <><path d="M9.5 3.5C6.2 3.5 4 6 4 9.7c0 4 2.2 7.1 5 8.1 1.7.6 3-1.1 2.3-2.7-.6-1.4-2.3-2-2.3-4.4 0-2 1.2-3.3 3-3.3V5.2a3.7 3.7 0 0 0-2.5-1.7Z"/><path d="M14.5 3.5C17.8 3.5 20 6 20 9.7c0 4-2.2 7.1-5 8.1-1.7.6-3-1.1-2.3-2.7.6-1.4 2.3-2 2.3-4.4 0-2-1.2-3.3-3-3.3V5.2c.7-.9 1.5-1.5 2.5-1.7Z"/></>,
  "i-eye": <><path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></>,
  "i-ear": <><path d="M7 9a6 6 0 1 1 11.5 2.4c-.9 2.1-2.7 2.3-3.5 4.3-.5 1.4-.8 3.3-3.2 3.3A3.8 3.8 0 0 1 8 15.2"/><path d="M10 9a3 3 0 0 1 6 0c0 2.6-3 2.8-3 5"/></>,
  "i-cell": <><path d="M20 12a8 8 0 0 1-8 8c-4.4 0-8-3.1-8-7.5S7.4 4 12 4c4.4 0 8 3.6 8 8Z"/><circle cx="12" cy="12" r="2.7"/><path d="M7.5 8.5h.01M16.8 14.8h.01M8 16h.01"/></>,
  "i-droplet": <path d="M12 3.5S6.5 9.8 6.5 14a5.5 5.5 0 0 0 11 0c0-4.2-5.5-10.5-5.5-10.5Z"/>,
  "i-gyn": <><circle cx="12" cy="9" r="5.5"/><path d="M12 14.5V21m-3-3h6"/></>,
  "i-search": <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></>,
  "i-sort": <><path d="M8 4v16m0-16L5 7m3-3 3 3M16 20V4m0 16-3-3m3 3 3-3"/></>,
  "i-chev": <path d="m7 9.5 5 5 5-5"/>,
};

export default function AtlasIcon({ id, className = "atlas-icon", ...props }: { id: string } & SVGProps<SVGSVGElement>) {
  return <ContentSurface scope="src/components/explore/AtlasIcon.tsx"><svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{p[id] ?? p["i-cell"]}</svg></ContentSurface>;
}
