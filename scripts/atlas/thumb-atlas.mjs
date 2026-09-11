/**
 * Chụp thumbnail cho scene ATLAS bằng Chrome headless (WebGL qua SwiftShader).
 *
 *     node scripts/atlas/thumb-atlas.mjs              # mọi scene ĐỔI CHỦ ĐỀ (có khai `system`)
 *     node scripts/atlas/thumb-atlas.mjs co-mat hach-co
 *
 * Cần dev server ở http://localhost:3000. Chụp trang 1400×900, bỏ các tấm giao
 * diện (cột trái tới x=320, thanh công cụ phải từ x=1310, thanh Tách rời từ
 * y=725), tìm hộp bao phần có hình (pixel sáng hơn nền tối), cắt vuông quanh nó
 * rồi xuất JPEG 600×600 như bộ thumbnail cũ.
 *
 * Vì sao không dùng render-thumbnails.mjs: bộ đó render .glb Z-Anatomy qua
 * Blender; scene atlas không có file .glb, chỉ là danh sách mảnh.
 *
 * Ảnh cũ chép sang public/thumbnails/_cu/ trước khi ghi đè.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3000/vi/giai-phau/mo-hinh/";
const THUMBS = "public/thumbnails";
const BACKUP = join(THUMBS, "_cu");
// Trang mở ở chế độ `?thumb` (AtlasSceneViewer): không còn giao diện nào đè
// lên canvas, nhóm mốc mờ bị ẩn hẳn — cả khung hình là vùng dò hình.
const SIZE = 1000;
const REGION = { left: 0, top: 0, right: SIZE, bottom: SIZE };

/** Mọi scene atlas (cả scene viết tay: tim, gan… có khoá không ngoặc kép). */
function allSlugs() {
  const dir = "src/lib/humanAtlas/scenes";
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !["index.ts", "types.ts"].includes(f))
    .map((f) => readFileSync(join(dir, f), "utf8").match(/["']?slug["']?: "([^"]+)"/)?.[1])
    .filter(Boolean);
}

async function shoot(slug) {
  const png = join(tmpdir(), `thumb-${slug}.png`);
  execFileSync(CHROME, [
    "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
    `--window-size=${SIZE},${SIZE}`, "--hide-scrollbars", "--virtual-time-budget=25000",
    `--screenshot=${png}`, BASE + slug + "?thumb",
  // Chạy TUẦN TỰ: 6 Chrome SwiftShader song song làm CPU quá tải, gần như mọi bài
  // hết giờ (đã dính 100/121 bài ETIMEDOUT).
  ], { stdio: "ignore", timeout: 240000 });

  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = REGION.top; y < REGION.bottom; y++)
    for (let x = REGION.left; x < REGION.right; x++) {
      const i = (y * info.width + x) * info.channels;
      if (Math.max(data[i], data[i + 1], data[i + 2]) > 70) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  if (x1 < 0) throw new Error("khong thay hinh");
  const side = Math.min(info.height, Math.round(Math.max(x1 - x0, y1 - y0) * 1.12));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const left = Math.max(0, Math.min(info.width - side, Math.round(cx - side / 2)));
  const top = Math.max(0, Math.min(info.height - side, Math.round(cy - side / 2)));

  const out = join(THUMBS, `${slug}.jpg`);
  if (existsSync(out) && !existsSync(join(BACKUP, `${slug}.jpg`))) copyFileSync(out, join(BACKUP, `${slug}.jpg`));
  await sharp(png).extract({ left, top, width: side, height: side }).resize(600, 600).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  unlinkSync(png);
  return `${side}px`;
}

mkdirSync(BACKUP, { recursive: true });
const args = process.argv.slice(2);
const slugs = args.length ? args : allSlugs();
console.log(`chup ${slugs.length} scene`);
for (const s of slugs) {
  try { console.log(s.padEnd(28), await shoot(s)); }
  catch (e) { console.error(s.padEnd(28), "LOI", e.message); process.exitCode = 1; }
}
