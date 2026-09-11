/**
 * Chụp ảnh bìa scene atlas — MỘT Chrome dùng lại cho mọi bài, điều khiển qua
 * DevTools Protocol bằng WebSocket có sẵn của Node (không cần puppeteer).
 *
 *     node scripts/atlas/thumb-cdp.mjs              # mọi scene atlas
 *     node scripts/atlas/thumb-cdp.mjs --missing    # chỉ bài chưa chụp lại hôm nay
 *     node scripts/atlas/thumb-cdp.mjs co-mat hach-co
 *
 * Vì sao thay thumb-atlas.mjs: bản đó khởi động một Chrome SwiftShader cho MỖI
 * bài — đo được ~3 phút/bài (122 bài ≈ 6 giờ) và hay hết giờ. Ở đây Chrome mở
 * một lần, dùng GPU thật, mỗi bài chỉ chờ tới khi canvas vẽ xong.
 *
 * Cần dev server ở http://localhost:3000. Trang mở ở chế độ `?thumb`
 * (AtlasSceneViewer): không giao diện, nhóm mốc mờ bị ẩn.
 */
import { spawn } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3000/vi/giai-phau/mo-hinh/";
const THUMBS = "public/thumbnails";
const BACKUP = join(THUMBS, "_cu");
const SIZE = 1000;
const PORT = 9333;
/** Bài vùng sau cơ thể: chụp từ phía sau thì mới thấy chủ thể. */
const BACK = new Set([
  "vung-lung", "co-vung-gay", "vung-mong", "than-kinh-toa", "ho-khoeo",
  "co-bung", "gan-got-ong-co-chan", "chop-xoay-vai",
]);
/** Bài nhận ra rõ nhất khi nhìn chính diện (sọ: góc ¾ ra khối sau–dưới khó nhận). */
const FRONT = new Set(["bo-phan-so", "giai-phau-so"]);
/** Bài bộ phận mà ảnh bìa cần ĐỦ lớp (chỉ lớp nền thì hình thiếu hẳn một nửa). */
const ALL_LAYERS = new Set(["bo-phan-so"]);

function allSlugs() {
  const dir = "src/lib/humanAtlas/scenes";
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !["index.ts", "types.ts"].includes(f))
    .map((f) => readFileSync(join(dir, f), "utf8").match(/["']?slug["']?: "([^"]+)"/)?.[1])
    .filter(Boolean);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2);
  const today = new Date().toDateString();
  let slugs = args.filter((a) => !a.startsWith("--"));
  if (!slugs.length) slugs = allSlugs();
  if (args.includes("--missing"))
    slugs = slugs.filter((s) => {
      const f = join(THUMBS, `${s}.jpg`);
      return !existsSync(f) || statSync(f).mtime.toDateString() !== today;
    });
  mkdirSync(BACKUP, { recursive: true });
  console.log(`chup ${slugs.length} scene`);

  const profile = join(tmpdir(), "soma-thumb-profile");
  const chrome = spawn(CHROME, [
    "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    `--window-size=${SIZE},${SIZE}`, "--hide-scrollbars", "--ignore-gpu-blocklist",
    "--enable-gpu", "--enable-unsafe-swiftshader", "about:blank",
  ], { stdio: "ignore" });

  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(300);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      target = list.find((t) => t.type === "page");
    } catch { /* Chrome chưa sẵn sàng */ }
  }
  if (!target) throw new Error("khong ket noi duoc Chrome");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let seq = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      pending.set(id, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m.result)));
      ws.send(JSON.stringify({ id, method, params }));
    });
  const evalJs = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result.value;

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: SIZE, height: SIZE, deviceScaleFactor: 1, mobile: false });

  for (const slug of slugs) {
    const t0 = Date.now();
    try {
      const view = BACK.has(slug) ? "back" : FRONT.has(slug) ? "front" : "";
      await send("Page.navigate", { url: BASE + slug + "?thumb" + (view ? `&view=${view}` : "") + (ALL_LAYERS.has(slug) ? "&layers=all" : "") });
      // Chờ: đã vào chế độ thumb, hết màn "Đang chuẩn bị", canvas có kích thước.
      let ok = false;
      for (let i = 0; i < 120 && !ok; i++) {
        await sleep(500);
        ok = await evalJs(`!!document.querySelector('.atlas-scene.is-thumb') && !document.querySelector('.atlas-scene .loading') && (document.querySelector('.atlas-scene canvas')?.width ?? 0) > 100`).catch(() => false);
      }
      if (!ok) throw new Error("het gio cho tai");
      await sleep(1500); // khung ngắm căn lại sau khi tải xong
      const { data } = await send("Page.captureScreenshot", { format: "png" });
      const png = Buffer.from(data, "base64");

      const { data: px, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
      for (let y = 0; y < info.height; y++)
        for (let x = 0; x < info.width; x++) {
          const i = (y * info.width + x) * info.channels;
          if (Math.max(px[i], px[i + 1], px[i + 2]) > 70) {
            if (x < x0) x0 = x; if (x > x1) x1 = x;
            if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      if (x1 < 0) throw new Error("khong thay hinh");
      const side = Math.min(info.width, info.height, Math.round(Math.max(x1 - x0, y1 - y0) * 1.12));
      const left = Math.max(0, Math.min(info.width - side, Math.round((x0 + x1) / 2 - side / 2)));
      const top = Math.max(0, Math.min(info.height - side, Math.round((y0 + y1) / 2 - side / 2)));
      const out = join(THUMBS, `${slug}.jpg`);
      if (existsSync(out) && !existsSync(join(BACKUP, `${slug}.jpg`))) copyFileSync(out, join(BACKUP, `${slug}.jpg`));
      await sharp(png).extract({ left, top, width: side, height: side }).resize(600, 600).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
      console.log(slug.padEnd(28), `${side}px`, `${((Date.now() - t0) / 1000).toFixed(1)}s`);
    } catch (e) {
      console.log(slug.padEnd(28), "LOI", e.message);
      process.exitCode = 1;
    }
  }
  ws.close();
  chrome.kill();
}

main().catch((e) => { console.error(e); process.exit(1); });
