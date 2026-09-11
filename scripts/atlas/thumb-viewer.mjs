/**
 * Ảnh bìa thẻ "Giải phẫu toàn thân (7 hệ)" — chụp THẲNG trang /viewer bằng
 * Chrome headless (DevTools Protocol), ẩn toàn bộ giao diện, nền tối liền mạch,
 * cắt vuông quanh cơ thể. Cùng phong cách với ảnh bìa các scene atlas.
 *
 *     node scripts/atlas/thumb-viewer.mjs      # cần dev server :3000
 *
 * Ảnh cũ (nền xám, bộ xương trần) chép sang public/thumbnails/_cu/.
 */
import { spawn } from "node:child_process";
import { existsSync, copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.env.URL ?? "http://localhost:3000/vi/viewer";
const OUT = "public/thumbnails/toan-than-7-he.jpg";
const W = 1200, H = 1400, PORT = 9335;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(tmpdir(), "soma-viewer-thumb")}`, `--window-size=${W},${H}`, "--hide-scrollbars", "--ignore-gpu-blocklist", "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(300);
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch { /* chưa sẵn */ }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result))); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (x) => (await send("Runtime.evaluate", { expression: x, returnByValue: true })).result.value;

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
// Chế độ tối TRƯỚC khi trang dựng (giao diện đọc localStorage) — nền đen như ảnh bìa scene.
await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem('theme','dark')}catch{};document.documentElement.dataset.theme='dark';` });
await send("Page.navigate", { url: URL });
let ok = false;
for (let i = 0; i < 160 && !ok; i++) {
  await sleep(500);
  ok = await ev(`!document.querySelector('.atlas-studio .loading') && (document.querySelector('.atlas-studio canvas')?.width ?? 0) > 100`).catch(() => false);
}
if (!ok) throw new Error("viewer khong tai xong");
await ev(`(() => { document.documentElement.dataset.theme='dark';
  const s = document.createElement('style');
  s.textContent = '.atlas-studio > :not(.scene){display:none!important} .soma-bot-launcher,.part-hover{display:none!important} body{background:#0b0c0e!important}';
  document.head.appendChild(s); window.dispatchEvent(new Event('resize')); })()`);
await sleep(2500);
const { data } = await send("Page.captureScreenshot", { format: "png" });
const png = Buffer.from(data, "base64");

const { data: px, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  const i = (y * info.width + x) * info.channels;
  if (Math.max(px[i], px[i + 1], px[i + 2]) > 70) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
}
if (x1 < 0) throw new Error("khong thay hinh");
const side = Math.min(info.width, info.height, Math.round(Math.max(x1 - x0, y1 - y0) * 1.08));
const left = Math.max(0, Math.min(info.width - side, Math.round((x0 + x1) / 2 - side / 2)));
const top = Math.max(0, Math.min(info.height - side, Math.round((y0 + y1) / 2 - side / 2)));
mkdirSync("public/thumbnails/_cu", { recursive: true });
if (existsSync(OUT) && !existsSync("public/thumbnails/_cu/toan-than-7-he.jpg")) copyFileSync(OUT, "public/thumbnails/_cu/toan-than-7-he.jpg");
await sharp(png).extract({ left, top, width: side, height: side }).resize(600, 600).jpeg({ quality: 84, mozjpeg: true }).toFile(OUT);
console.log("da ghi", OUT, `${side}px`);
ws.close(); chrome.kill();
