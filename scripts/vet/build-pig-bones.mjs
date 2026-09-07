#!/usr/bin/env node
// SỔ TÊN XƯƠNG LỢN — nguồn sự thật DUY NHẤT cho cả hình học lẫn nội dung.
//
// Z-PIG.blend (Z-Anatomy, CC BY-SA 4.0) là bộ xương lợn ĐÃ GẮN NHÃN TỪNG XƯƠNG,
// nhưng nhãn bằng TIẾNG PHÁP ("Vertèbre T7", "Os radial du carpe [Os scaphoïde]").
// Script này đổi chúng thành:
//   • một `slug` ổn định, không dấu   → dùng làm TÊN VẬT LIỆU trong file .glb;
//   • thuật ngữ NAV (Latin) + tên vi/en/zh → dùng cho trang xem.
//
// VÌ SAO PHẢI ĐI QUA MỘT TỆP JSON TRUNG GIAN, không chép tay hai nơi: bên
// Blender đặt tên vật liệu, bên TypeScript khai `parts` — hai danh sách ấy phải
// khớp từng ký tự, mà 120 xương thì chép tay kiểu gì cũng lệch. Cả hai nay đọc
// chung `scripts/vet/pig-bones.json`, sinh ra từ đúng file này.
//
//   node scripts/vet/build-pig-bones.mjs
//     → scripts/vet/pig-bones.json        (Blender đọc)
//     → src/lib/vet/pigBonesGenerated.ts (trang xem đọc)
//
// VÌ SAO TÊN VẬT LIỆU chứ không phải tên mesh: trang xem thú y
// (`VetModelScene`) gom mesh theo TÊN VẬT LIỆU — cách duy nhất tách được bộ
// phận trên các mẫu quét khối liền. Lợn không cần cách đó (mesh đã có tên
// thật), nhưng đi theo cùng một đường thì không phải viết nhánh thứ hai trong
// trang xem, và bước nén Draco cũng không đụng tới tên vật liệu.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

/** Số La Mã cho thuật ngữ NAV (Costa III, Vertebra thoracica VII…). */
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII"];

/** Số thứ tự tiếng Pháp dùng trong Z-PIG cho xương sườn và đốt ức. */
const FR_ORDINAL = {
  "Première": 1, "Deuxième": 2, "Troisième": 3, "Quatrième": 4, "Cinquième": 5,
  "Sixième": 6, "Septième": 7, "Huitième": 8, "Neuvième": 9, "Dixième": 10,
  "Onzième": 11, "Douzième": 12, "Treizième": 13, "Quatorzième": 14, "Quinzième": 15,
};

/** Ngón chân theo số — lợn có bốn ngón: III và IV chịu lực, II và V là móng treo. */
const FR_DIGIT = { deuxième: 2, troisième: 3, "troisème": 3, quatrième: 4, cinquième: 5, majeur: 3 };

const rows = [];
const add = (fr, slug, nav, vi, en, zh, group) =>
  rows.push({ fr, slug, nav, vi, en, zh, group });

// ── SỌ VÀ ĐẦU ──────────────────────────────────────────────────────────────
add("Crâne", "cranium", "Cranium", "Sọ", "Skull", "颅骨", "head");
add("Mandibule", "mandibula", "Mandibula", "Xương hàm dưới", "Mandible", "下颌骨", "head");
add("Os hyoïde", "os-hyoideum", "Os hyoideum", "Xương móng", "Hyoid bone", "舌骨", "head");

// ── CỘT SỐNG ───────────────────────────────────────────────────────────────
add("Vertèbre C1 (Atlas)", "atlas", "Atlas [Vertebra cervicalis I]", "Đốt đội (C1)", "Atlas (C1)", "寰椎", "spine");
add("Vertèbre C2 (Axis)", "axis", "Axis [Vertebra cervicalis II]", "Đốt trục (C2)", "Axis (C2)", "枢椎", "spine");
for (let i = 3; i <= 7; i++)
  add(`Vertèbre C${i}`, `vertebra-c${i}`, `Vertebra cervicalis ${ROMAN[i]}`,
    `Đốt sống cổ C${i}`, `Cervical vertebra C${i}`, `颈椎 C${i}`, "spine");
// Lợn có 14–15 đốt ngực, đúng với 14–15 đôi sườn; mẫu này dựng 13 đốt ngực.
for (let i = 1; i <= 13; i++)
  add(`Vertèbre T${i}`, `vertebra-t${i}`, `Vertebra thoracica ${ROMAN[i]}`,
    `Đốt sống ngực T${i}`, `Thoracic vertebra T${i}`, `胸椎 T${i}`, "spine");
for (let i = 1; i <= 8; i++)
  add(`Vertèbre L${i}`, `vertebra-l${i}`, `Vertebra lumbalis ${ROMAN[i]}`,
    `Đốt sống thắt lưng L${i}`, `Lumbar vertebra L${i}`, `腰椎 L${i}`, "spine");
add("Sacrum", "os-sacrum", "Os sacrum", "Xương cùng", "Sacrum", "荐骨", "spine");
for (let i = 1; i <= 12; i++)
  add(`Vertèbre Cc${i}`, `vertebra-cd${i}`, `Vertebra caudalis ${ROMAN[i]}`,
    `Đốt sống đuôi Cd${i}`, `Caudal vertebra Cd${i}`, `尾椎 Cd${i}`, "spine");

// ── LỒNG NGỰC ──────────────────────────────────────────────────────────────
for (const [fr, n] of Object.entries(FR_ORDINAL))
  add(`${fr} côte`, `costa-${n}`, `Costa ${ROMAN[n]}`,
    `Xương sườn ${n}`, `Rib ${n}`, `第${n}肋骨`, "thorax");
add("Cartilages costaux", "cartilagines-costales", "Cartilagines costales",
  "Sụn sườn", "Costal cartilages", "肋软骨", "thorax");
add("Manubrium sternal", "manubrium-sterni", "Manubrium sterni",
  "Cán ức", "Manubrium of sternum", "胸骨柄", "thorax");
for (const [fr, n] of Object.entries(FR_ORDINAL)) {
  if (n < 2 || n > 6) continue;
  add(`${fr} sternèbre`, `sternebra-${n}`, `Sternebra ${ROMAN[n]}`,
    `Đốt ức ${n}`, `Sternebra ${n}`, `第${n}胸骨节`, "thorax");
}

// ── CHI TRƯỚC ──────────────────────────────────────────────────────────────
add("Scapula", "scapula", "Scapula", "Xương bả vai", "Scapula", "肩胛骨", "forelimb");
add("Humérus", "humerus", "Humerus", "Xương cánh tay", "Humerus", "肱骨", "forelimb");
add("Radius", "radius", "Radius", "Xương quay", "Radius", "桡骨", "forelimb");
add("Ulna", "ulna", "Ulna", "Xương trụ", "Ulna", "尺骨", "forelimb");
add("Os radial du carpe [Os scaphoïde]", "os-carpi-radiale", "Os carpi radiale",
  "Xương cổ tay quay", "Radial carpal bone", "桡腕骨", "forelimb");
add("Os intermédiaire du carpe [Os lunatum]", "os-carpi-intermedium", "Os carpi intermedium",
  "Xương cổ tay giữa", "Intermediate carpal bone", "中间腕骨", "forelimb");
add("Os ulnaire du carpe [Os triquetrum]", "os-carpi-ulnare", "Os carpi ulnare",
  "Xương cổ tay trụ", "Ulnar carpal bone", "尺腕骨", "forelimb");
add("Os accessoire du carpe [Os pisiforme]", "os-carpi-accessorium", "Os carpi accessorium",
  "Xương cổ tay phụ", "Accessory carpal bone", "副腕骨", "forelimb");
add("Os carpien III [Os capitatum]", "os-carpale-3", "Os carpale III",
  "Xương cổ tay III", "Third carpal bone", "第三腕骨", "forelimb");
add("Os carpien IV [Os hamatum]", "os-carpale-4", "Os carpale IV",
  "Xương cổ tay IV", "Fourth carpal bone", "第四腕骨", "forelimb");
for (const [fr, n] of Object.entries(FR_DIGIT)) {
  if (fr === "majeur" || fr === "troisème") continue;
  add(`${fr[0].toUpperCase()}${fr.slice(1)} métacarpien`, `os-metacarpale-${n}`,
    `Os metacarpale ${ROMAN[n]}`, `Xương bàn trước ${ROMAN[n]}`,
    `Metacarpal ${ROMAN[n]}`, `第${n}掌骨`, "forelimb");
}
add("Os sésamoïdes proximaux du majeur de la main", "ossa-sesamoidea-manus",
  "Ossa sesamoidea proximalia (manus)", "Xương vừng gần, chi trước",
  "Proximal sesamoid bones, forelimb", "前肢近籽骨", "forelimb");

// ── CHI SAU ────────────────────────────────────────────────────────────────
add("Os coxal", "os-coxae", "Os coxae", "Xương chậu", "Hip bone", "髋骨", "hindlimb");
add("Fémur", "os-femoris", "Os femoris", "Xương đùi", "Femur", "股骨", "hindlimb");
add("Tibia", "tibia", "Tibia", "Xương chày", "Tibia", "胫骨", "hindlimb");
add("Fibula", "fibula", "Fibula", "Xương mác", "Fibula", "腓骨", "hindlimb");
add("Calcaneus", "calcaneus", "Calcaneus", "Xương gót", "Calcaneus", "跟骨", "hindlimb");
add("Talus", "talus", "Talus", "Xương sên", "Talus", "距骨", "hindlimb");
add("Os central du tarse [Os naviculaire]", "os-tarsi-centrale", "Os tarsi centrale",
  "Xương cổ chân giữa", "Central tarsal bone", "中央跗骨", "hindlimb");
for (let i = 1; i <= 4; i++) {
  const fr = { 1: "Os tarsien I [Os cunéiforme médial]", 2: "Os tarsien II [Os cunéiforme intermédiaire]",
    3: "Os tarsien III [Os cunéiforme latéral]", 4: "Os tarsien IV" }[i];
  add(fr, `os-tarsale-${i}`, `Os tarsale ${ROMAN[i]}`,
    `Xương cổ chân ${ROMAN[i]}`, `Tarsal bone ${ROMAN[i]}`, `第${i}跗骨`, "hindlimb");
}
for (const [fr, n] of Object.entries(FR_DIGIT)) {
  if (fr === "majeur" || fr === "troisème") continue;
  // Z-PIG viết xương bàn sau không đồng nhất: "Deuxième os métatarsien" nhưng
  // "Troisième métatarsien". Khai cả hai dạng, dạng nào có trong file thì khớp.
  const cap = `${fr[0].toUpperCase()}${fr.slice(1)}`;
  const entry = [`${cap} métatarsien`, `${cap} os métatarsien`];
  add(entry, `os-metatarsale-${n}`, `Os metatarsale ${ROMAN[n]}`,
    `Xương bàn sau ${ROMAN[n]}`, `Metatarsal ${ROMAN[n]}`, `第${n}跖骨`, "hindlimb");
}

// ── ĐỐT NGÓN ───────────────────────────────────────────────────────────────
// Lợn là thú móng guốc ngón chẵn: ngón III và IV chịu lực, ngón II và V là
// móng treo không chạm đất. Giữ đủ cả bốn ngón vì đây chính là điểm so sánh
// với chó/mèo mà sinh viên phải nhận ra trên mẫu vật.
const PHALANX = [
  ["proximale", "proximalis", "gần", "Proximal", "近"],
  ["moyenne", "media", "giữa", "Middle", "中"],
  ["distale", "distalis", "xa", "Distal", "远"],
];
for (const [frP, laP, viP, enP, zhP] of PHALANX) {
  for (const [frD, n] of Object.entries(FR_DIGIT)) {
    if (frD === "majeur" || frD === "troisème") continue;
    // Chi trước thì Z-PIG viết "de la main", chi sau viết "de pied" — và có vài
    // chỗ gõ thiếu dấu ("troisème", "cinquème"). Khai mọi biến thể gặp thật.
    const alt = frD === "troisième" ? ["troisième", "troisème"]
      : frD === "cinquième" ? ["cinquième", "cinquème"] : [frD];
    add(alt.map((d) => `Phalange ${frP} du ${d} doigt de la main`),
      `phalanx-${laP}-manus-${n}`, `Phalanx ${laP} digiti ${ROMAN[n]} manus`,
      `Đốt ngón ${viP}, ngón ${ROMAN[n]} chi trước`,
      `${enP} phalanx, digit ${ROMAN[n]} forelimb`, `前肢第${n}指${zhP}节`, "forelimb");
    add(alt.map((d) => `Phalange ${frP} du ${d} doigt de pied`),
      `phalanx-${laP}-pedis-${n}`, `Phalanx ${laP} digiti ${ROMAN[n]} pedis`,
      `Đốt ngón ${viP}, ngón ${ROMAN[n]} chi sau`,
      `${enP} phalanx, digit ${ROMAN[n]} hindlimb`, `后肢第${n}趾${zhP}节`, "hindlimb");
  }
}

// ── kiểm tra tại chỗ ───────────────────────────────────────────────────────
const slugs = new Set();
for (const r of rows) {
  if (slugs.has(r.slug)) throw new Error(`slug trùng: ${r.slug}`);
  slugs.add(r.slug);
  if (!/^[a-z0-9-]+$/.test(r.slug)) throw new Error(`slug có ký tự lạ: ${r.slug}`);
}

const json = rows.map((r) => ({ ...r, fr: Array.isArray(r.fr) ? r.fr : [r.fr] }));
writeFileSync(join(HERE, "pig-bones.json"), `${JSON.stringify(json, null, 2)}\n`, "utf8");

const GROUP_TITLE = {
  head: { vi: "Đầu", en: "Head", zh: "头部" },
  spine: { vi: "Cột sống", en: "Vertebral column", zh: "脊柱" },
  thorax: { vi: "Lồng ngực", en: "Thorax", zh: "胸廓" },
  forelimb: { vi: "Chi trước", en: "Forelimb", zh: "前肢" },
  hindlimb: { vi: "Chi sau", en: "Hindlimb", zh: "后肢" },
};

const ts = `// TỆP SINH TỰ ĐỘNG — đừng sửa tay.
// Nguồn: scripts/vet/pig-bones.json, sinh bằng \`node scripts/vet/build-pig-bones.mjs\`.
// Tên vật liệu trong pig-skeleton.glb / pig-skull.glb do CHÍNH tệp đó đặt, nên
// hai bên không thể lệch nhau.
import type { VetModelPart } from "./types";

export type PigBoneGroup = "head" | "spine" | "thorax" | "forelimb" | "hindlimb";

/** Năm mục để trang xem khỏi đổ 120 xương thành một danh sách cuộn dài dằng dặc. */
export const PIG_PART_GROUPS: { key: PigBoneGroup; title: { vi: string; en: string; zh: string } }[] = ${
  JSON.stringify(Object.entries(GROUP_TITLE).map(([key, title]) => ({ key, title })), null, 2)
};

/** Nhóm giải phẫu của từng xương — để trang xem xếp 120 xương thành năm mục. */
export const PIG_BONE_GROUP_OF: Record<string, PigBoneGroup> = ${
  JSON.stringify(Object.fromEntries(rows.map((r) => [r.slug, r.group])), null, 2)
};

export const PIG_BONES: VetModelPart[] = ${
  JSON.stringify(rows.map((r) => ({
    material: r.slug,
    name: { vi: r.vi, en: r.en, zh: r.zh },
    nav: r.nav,
    group: r.group,
  })), null, 2)
};
`;
writeFileSync(join(ROOT, "src", "lib", "vet", "pigBonesGenerated.ts"), ts, "utf8");

console.log(`pig-bones.json: ${rows.length} xương`);
console.log(`nhóm: ${Object.entries(rows.reduce((a, r) => ({ ...a, [r.group]: (a[r.group] ?? 0) + 1 }), {}))
  .map(([k, v]) => `${k} ${v}`).join(" · ")}`);
