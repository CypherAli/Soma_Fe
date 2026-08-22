/**
 * Render lại TOÀN BỘ ảnh thumbnail theo khung hình chuẩn.
 *
 *     node scripts/render-thumbnails.mjs            # tất cả
 *     node scripts/render-thumbnails.mjs khop-hang  # vài slug chỉ định
 *     node scripts/render-thumbnails.mjs --resume    # bỏ qua slug đã có .png
 *
 * Vì sao cần: bộ ảnh cũ render bằng công thức canh khung tự chế của
 * `render_glb_preview.py`, mỗi tấm một cỡ. Từ khi có `modelFrames.json`, trình
 * render đọc CÙNG bảng khung với viewer — nhưng ảnh cũ thì vẫn cũ, nên cả lưới
 * thẻ vẫn nhìn ra chỗ to chỗ nhỏ. Chạy lại một lượt là hết.
 *
 * Ảnh cũ được chép sang `public/thumbnails/_cu/` trước khi ghi đè, để so lại
 * hoặc trả về nếu có tấm nào ra xấu hơn.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { frameOf, primitives, readGlb } from "./model-frame.mjs";

const BLENDER = process.env.BLENDER ?? "C:/Program Files/Blender Foundation/Blender 5.1/blender.exe";
const THUMBS = "public/thumbnails";
const BACKUP = join(THUMBS, "_cu");

const args = process.argv.slice(2);
const resume = args.includes("--resume");
const only = args.filter((a) => !a.startsWith("--"));

/** slug -> đường dẫn model, quét mọi file scene. */
function sceneModels() {
  const map = new Map();
  const files = [
    ...readdirSync("src/lib/scenes").filter((f) => f.endsWith(".ts")).map((f) => join("src/lib/scenes", f)),
    "src/lib/sceneModules.ts",
  ];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    // Mỗi scene mở bằng `"slug": {` rồi vài dòng sau mới tới modelFile.
    for (const m of text.matchAll(/"([a-z0-9-]+)":\s*\{/g)) {
      const rest = text.slice(m.index, m.index + 8000);
      const model = rest.match(/modelFile:\s*"([^"]+)"/);
      const nextScene = rest.slice(1).search(/\n {2}"[a-z0-9-]+":\s*\{/);
      if (!model) continue;
      // modelFile phải nằm TRONG scene này, không phải của scene kế tiếp.
      if (nextScene !== -1 && model.index > nextScene) continue;
      map.set(m[1], model[1]);
    }
  }
  return map;
}

/** slug -> tên file ảnh, đọc bảng `thumbnails` trong catalog.ts. */
function thumbMap() {
  const text = readFileSync("src/lib/catalog.ts", "utf8");
  const map = new Map();
  for (const m of text.matchAll(/"([a-z0-9-]+)":\s*"\/thumbnails\/([^"]+)\.jpg"/g)) map.set(m[1], m[2]);
  return map;
}

/**
 * Model đối xứng hai bên thì chỉ chụp NỬA PHẢI — nhưng chỉ khi nó THẬT SỰ là
 * hai khối rời nhau.
 *
 * Hộp bao của model hai bên trùm cả khoảng trống ở giữa, nên chụp cả hai bên
 * thì mỗi bên chỉ còn một chấm nhỏ ở góc: hai bàn tay, hai nhãn cầu, hai chuỗi
 * xương con tai giữa đều vậy. Nhưng đếm hậu tố `.l`/`.r` thôi thì HỎNG với
 * model nằm giữa thân: cột sống ngực có đốt sống ở đường giữa và sườn hai bên,
 * cắt nửa phải là ra một cột sống cụt mất một bên sườn.
 *
 * Nên xét thêm KHỐI LƯỢNG Ở ĐƯỜNG GIỮA: mesh nào vắt qua mặt phẳng giữa thì
 * cộng số đỉnh của nó lại; chiếm từ 10% trở lên nghĩa là model có phần giữa
 * thật sự, không được cắt.
 */
function sideOf(glbPath) {
  const { json } = readGlb(glbPath);
  let left = 0;
  let right = 0;
  for (const n of json.nodes ?? []) {
    const name = (n.name ?? "").toLowerCase();
    if (/\.l(\.\d+)?$/.test(name)) left += 1;
    if (/\.r(\.\d+)?$/.test(name)) right += 1;
  }
  if (left < 5 || right < 5) return "";

  let midline = 0;
  let total = 0;
  for (const p of primitives(json)) {
    const w = Math.max(1, p.verts);
    total += w;
    if (p.lo[0] < 0.02 && p.hi[0] > -0.02) midline += w;
  }
  return total && midline / total >= 0.1 ? "" : "r";
}

const models = sceneModels();
const thumbs = thumbMap();
const jobs = [];
for (const [slug, name] of thumbs) {
  const model = models.get(slug);
  if (!model) {
    console.log(`bỏ qua ${slug}: không tìm thấy modelFile`);
    continue;
  }
  if (only.length && !only.includes(slug)) continue;
  jobs.push({ slug, name, glb: join("public", model.replace(/^\//, "")) });
}

if (!existsSync(BACKUP)) mkdirSync(BACKUP, { recursive: true });

console.log(`${jobs.length} ảnh cần render · Blender: ${BLENDER}`);
let done = 0;
let failed = 0;
const started = Date.now();

for (const job of jobs) {
  const png = join(THUMBS, `${job.name}.png`);
  const jpg = join(THUMBS, `${job.name}.jpg`);
  if (resume && existsSync(png)) {
    console.log(`~ ${job.slug} (đã có)`);
    continue;
  }
  if (existsSync(jpg) && !existsSync(join(BACKUP, `${job.name}.jpg`))) {
    copyFileSync(jpg, join(BACKUP, `${job.name}.jpg`));
  }

  const side = sideOf(job.glb);
  const frame = frameOf(job.glb);
  const label = `${job.slug} (${(frame.tris / 1000).toFixed(0)}k tris${side ? ", nửa phải" : ""})`;
  try {
    execFileSync(
      BLENDER,
      ["--background", "--python", "scripts/blender/render_glb_preview.py", "--",
        job.glb, png, "1.0", "head", "skin", "1.0", side],
      // Model nặng nhất (thành ngực 1,42 triệu tam giác) từng vượt 15 phút và
      // bị giết giữa chừng — để 30 phút cho chắc, còn hỏng thật thì vẫn có mốc
      // dừng chứ không treo cả mẻ.
      { stdio: "pipe", timeout: 30 * 60 * 1000 },
    );
    done += 1;
    const mins = ((Date.now() - started) / 60000).toFixed(1);
    console.log(`✓ ${done}/${jobs.length} ${label} · ${mins} phút`);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${label}: ${String(error.message).slice(0, 200)}`);
  }
}

console.log(`\nXong: ${done} ảnh, ${failed} lỗi. Ảnh cũ giữ ở ${BACKUP}.`);
console.log("Bước tiếp: node scripts/optimize-thumbnails.mjs");
process.exit(failed ? 1 : 0);
