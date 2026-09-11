/**
 * Phần dùng chung của các bộ sinh scene chuyên đề (gen-scene-*.mjs).
 *
 * Tim, gan, não, sọ được viết trước khi có file này nên còn tự chứa; các
 * scene sau dùng chung để khỏi chép lại khối lọc-trùng-và-ghi-file.
 */
import fs from "fs";

const root = new URL("../../", import.meta.url);
export const atlas = JSON.parse(fs.readFileSync(new URL("public/human-atlas/atlas.json", root), "utf8"));
export const P = atlas.parts;

/** Lọc theo tên (regex). `systems` giới hạn hệ khi tên dễ dính mạch/cơ cùng tên. */
export const byRe = (re, systems) =>
  P.filter((p) => re.test(p.name) && (!systems || systems.includes(p.system))).map((p) => p.id);

export const byName = (...n) => P.filter((p) => n.includes(p.name)).map((p) => p.id);

/**
 * Chỉ mảnh nửa TRÁI cơ thể (x > 0 trong hệ toạ độ atlas), xét theo TÂM hộp
 * bao. Đừng xét mép trái: cơ mông lớn, cơ thang, cơ trám bám tới đường giữa
 * nên mép hộp bao lấn sang x < 0 và bị loại oan (đã dính).
 */
export const leftSide = (ids) =>
  ids.filter((id) => {
    const b = P.find((p) => p.id === id).bounds;
    return b[0][0] + b[1][0] > 0;
  });

/**
 * Chỉ mảnh có TÂM hộp bao nằm trong khoảng độ cao [yMin, yMax] (mét).
 * Bắt buộc cho scene chi: atlas có lưới đặt tên sai vùng — "Set of dorsal
 * digital arteries" FJ2093 nằm ở cẳng chân (y=0,21), "Dorsal metacarpal vein"
 * FJ2186 nằm ở bàn chân. Lọc theo tên + bên trái là KHÔNG đủ.
 */
export const betweenY = (ids, yMin, yMax) =>
  ids.filter((id) => {
    const b = P.find((p) => p.id === id).bounds;
    const y = (b[0][1] + b[1][1]) / 2;
    return y >= yMin && y <= yMax;
  });

/** Chi trên: từ khớp vai (~1,45m) xuống đầu ngón tay (~0,70m). */
export const upperLimbY = (ids) => betweenY(ids, 0.65, 1.5);

export const DEOXY = "#527c9f";
export const OXY = "#c05245";

/**
 * Lọc trùng giữa các nhóm (mảnh thuộc nhóm đầu tiên khai nó), bỏ EXCLUDE,
 * báo nhóm rỗng, rồi ghi `src/lib/humanAtlas/scenes/<file>.ts`.
 */
/**
 * Lưới TRÙNG đã xác minh bằng audit.mjs (trọng tâm lệch < 2mm, cùng tên) —
 * luôn loại, mọi scene. Giữ bản còn lại trong cặp.
 */
export const KNOWN_DUPLICATES = ["FJ1811", "FJ1812", "FJ1844", "FJ3201", "FJ2769", "FJ2013", "FJ3421", "FJ2025", "FJ2552", "FJ2011"];
// FJ2629 "Parenchyma of pancreas" KHÔNG phải bản trùng loại được: bài tuỵ–lách chỉ dùng
// đúng mảnh này cho nhóm tuỵ (đưa vào đây từng làm nhóm đó rỗng). Bài nội tiết tự chọn 1 trong 2.

/** Mã mảnh của một scene ĐÃ SINH (đọc JSON trong file .ts), lọc theo khoá nhóm. */
export function fromScene(file, keys) {
  const src = fs.readFileSync(new URL(`src/lib/humanAtlas/scenes/${file}.ts`, root), "utf8");
  // Cùng mẫu với audit.mjs — scene viết tay (tim, gan…) có dấu phẩy cuối và khoá không ngoặc.
  const groups = JSON.parse(src.match(/\n {2}["']?groups["']?: (\[[\s\S]*\])\s*,?\s*\}\s*;?\s*$/)[1]);
  return groups.filter((g) => !keys || keys.includes(g.key)).flatMap((g) => g.parts);
}

/**
 * Nhóm ĐẦY ĐỦ (tên, Latin, ghi chú, màu) của một scene đã sinh, dạng dùng lại
 * được trong `groups` của emit (parts → ids). Bài bộ phận cơ quan dựng lại từ
 * bài chuyên đề đã kiểm, chỉ thêm lớp.
 */
export function groupsFrom(file) {
  const src = fs.readFileSync(new URL(`src/lib/humanAtlas/scenes/${file}.ts`, root), "utf8");
  const groups = JSON.parse(src.match(/\n {2}["']?groups["']?: (\[[\s\S]*\])\s*,?\s*\}\s*;?\s*$/)[1]);
  return groups.map(({ parts, ...g }) => ({ ...g, ids: parts }));
}

function clipOf(clip, groups) {
  if (clip.atY == null) return clip;
  const ids = new Set(groups.flatMap((g) => g.parts));
  let lo = Infinity, hi = -Infinity;
  for (const p of P) if (ids.has(p.id)) { lo = Math.min(lo, p.bounds[0][1]); hi = Math.max(hi, p.bounds[1][1]); }
  const { atY, ...rest } = clip;
  return { ...rest, axis: "y", percent: Math.round(((atY - lo) / (hi - lo)) * 100) };
}

export function emit({ file, exportName, header, scene, groups, exclude = [], frame, faded, clip, layers, script = file }) {
  const skip = new Set([...exclude, ...KNOWN_DUPLICATES]);
  const seen = new Set();
  const clean = [];
  for (const g of groups) {
    const ids = [...new Set(g.ids)].filter((id) => !seen.has(id) && !skip.has(id));
    ids.forEach((id) => seen.add(id));
    if (!ids.length) {
      console.error("NHOM RONG:", g.key);
      process.exitCode = 1;
      continue;
    }
    clean.push({ key: g.key, name: g.name, latin: g.latin, note: g.note, tint: g.tint, parts: ids });
  }
  console.log(`[${scene.slug}] so nhom: ${clean.length} | tong manh: ${seen.size}`);
  for (const g of clean)
    console.log(
      " ",
      g.key.padEnd(20),
      String(g.parts.length).padStart(3),
      (g.tint ?? "").padEnd(8),
      P.filter((p) => g.parts.includes(p.id)).map((p) => p.name).join(" | ").slice(0, 110),
    );

  const ts = `/**
 * ${header.split("\n").join("\n * ")}
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-${script}.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const ${exportName}: AtlasSceneDef = ${JSON.stringify(
    {
      slug: scene.slug,
      title: scene.title,
      latin: scene.latin,
      ...(scene.system ? { system: scene.system } : {}),
      ...(scene.view ? { view: scene.view } : {}),
      intro: scene.intro,
      ...(frame ? { frameGroups: frame.filter((k) => clean.some((g) => g.key === k)) } : {}),
      ...(faded ? { fadedGroups: faded.filter((k) => clean.some((g) => g.key === k)) } : {}),
      // `clip.atY` (mét): đổi độ cao cắt thành % theo hộp bao Y của CHÍNH scene — khỏi tự tính.
      ...(clip ? { clip: clipOf(clip, clean) } : {}),
      ...(layers ? { layers: layers.map((l) => ({ ...l, groups: l.groups.filter((k) => clean.some((g) => g.key === k)) })) } : {}),
      groups: clean,
    },
    null,
    2,
  )};
`;
  fs.writeFileSync(new URL(`src/lib/humanAtlas/scenes/${file}.ts`, root), ts);
  console.log(`da ghi src/lib/humanAtlas/scenes/${file}.ts`);
}
