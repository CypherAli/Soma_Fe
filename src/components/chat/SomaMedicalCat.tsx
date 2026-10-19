
import { ContentSurface } from "@/components/content/ContentProvider";
export default function SomaMedicalCat() {
  return <ContentSurface scope="src/components/chat/SomaMedicalCat.tsx"><svg className="soma-medical-cat" viewBox="0 0 180 190" role="img" aria-label="Mèo trợ lý y khoa Soma">
    <defs>
      <linearGradient id="catCoat" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf8"/><stop offset="1" stopColor="#e8eee9"/></linearGradient>
      <linearGradient id="catScreen" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#163c42"/><stop offset="1" stopColor="#0e2429"/></linearGradient>
    </defs>
    <ellipse className="cat-shadow" cx="90" cy="174" rx="48" ry="8" fill="#071917" opacity=".18"/>
    <path className="cat-tail" d="M139 126c33 8 35-32 13-30-14 1-11 17-2 17" fill="none" stroke="#edf1ed" strokeWidth="15" strokeLinecap="round"/>
    <g className="cat-body">
      <rect x="48" y="85" width="84" height="78" rx="34" fill="url(#catCoat)" stroke="#b9cbc5" strokeWidth="2"/>
      <rect x="61" y="104" width="58" height="45" rx="13" fill="url(#catScreen)" stroke="#54d6cf" strokeWidth="2"/>
      <path className="cat-spine" d="M90 110v31m-7-26h14m-15 7h16m-15 7h14m-12 7h10" fill="none" stroke="#6ff4df" strokeWidth="3" strokeLinecap="round"/>
      <path d="M66 95c-3 12-13 17-16 30" fill="none" stroke="#243b46" strokeWidth="3" strokeLinecap="round"/>
      <path d="M114 95c4 12 14 17 16 30" fill="none" stroke="#243b46" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="49" cy="127" r="5" fill="#d9e2df" stroke="#48616a" strokeWidth="2"/><circle cx="131" cy="127" r="5" fill="#d9e2df" stroke="#48616a" strokeWidth="2"/>
      <circle cx="115" cy="103" r="6" fill="#f6fbf8" stroke="#526a72" strokeWidth="2"/><path d="M112 103h6m-3-3v6" stroke="#42bdb4" strokeWidth="1.7"/>
      <ellipse cx="70" cy="157" rx="17" ry="14" fill="#f7faf6" stroke="#b9cbc5" strokeWidth="2"/><ellipse cx="110" cy="157" rx="17" ry="14" fill="#f7faf6" stroke="#b9cbc5" strokeWidth="2"/>
    </g>
    <g className="cat-head">
      <path className="cat-ear cat-ear-left" d="M49 55 43 16l31 22" fill="#f7faf6" stroke="#b9cbc5" strokeWidth="2"/><path d="m50 43-3-19 17 15" fill="#eab9b0"/>
      <path className="cat-ear cat-ear-right" d="m108 38 30-22-7 41" fill="#f7faf6" stroke="#b9cbc5" strokeWidth="2"/><path d="m117 39 17-15-4 20" fill="#eab9b0"/>
      <rect x="45" y="31" width="90" height="72" rx="38" fill="url(#catCoat)" stroke="#b9cbc5" strokeWidth="2"/>
      <g className="cat-eyes"><ellipse cx="73" cy="63" rx="10" ry="13" fill="#183c41"/><ellipse cx="108" cy="63" rx="10" ry="13" fill="#183c41"/><ellipse cx="76" cy="58" rx="3" ry="4" fill="#fff"/><ellipse cx="111" cy="58" rx="3" ry="4" fill="#fff"/></g>
      <path d="m85 76 5-4 5 4-5 5z" fill="#df9189"/><path d="M90 81c-4 7-10 3-11 1m11-1c4 7 10 3 11 1" fill="none" stroke="#604f4b" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M63 80 43 76m20 11-22 3m76-10 20-4m-20 11 22 3" stroke="#889b96" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M61 94c14 7 44 8 59 0" fill="none" stroke="#29444c" strokeWidth="7" strokeLinecap="round"/><circle cx="91" cy="97" r="5" fill="#54d6cf" stroke="#fff" strokeWidth="1.5"/>
    </g>
    <g className="cat-paws">
      <g className="cat-paw-left"><ellipse cx="46" cy="121" rx="14" ry="18" fill="#f9fbf8" stroke="#b9cbc5" strokeWidth="2"/><circle cx="43" cy="117" r="4" fill="#eab9b0"/></g>
      <g className="cat-paw-right"><ellipse cx="134" cy="121" rx="14" ry="18" fill="#f9fbf8" stroke="#b9cbc5" strokeWidth="2"/><circle cx="137" cy="117" r="4" fill="#eab9b0"/></g>
    </g>
    <g className="cat-hologram"><rect x="103" y="66" width="53" height="39" rx="7" fill="#173b42" fillOpacity=".92" stroke="#64e6dd" strokeWidth="2"/><path d="M118 76v20m-5-15h10m-11 6h12m-10 6h8" stroke="#70f2e3" strokeWidth="2" strokeLinecap="round"/><path d="M135 88c0-8 12-8 12 0 0 6-6 9-6 9s-6-3-6-9Z" fill="#e1716d"/></g>
    <g className="cat-thinking-dots" fill="#65e5d8"><circle cx="137" cy="44" r="3"/><circle cx="147" cy="35" r="4"/><circle cx="158" cy="23" r="5"/></g>
  </svg></ContentSurface>;
}
