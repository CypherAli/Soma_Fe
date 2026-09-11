/**
 * Kiểm TỪNG TRANG scene atlas trong trình duyệt thật (Chrome headless qua
 * DevTools Protocol) — bổ sung cho audit.mjs (chỉ kiểm dữ liệu).
 *
 *     node scripts/atlas/audit-pages.mjs [slug…]   # cần dev server :3000
 *
 * Mỗi trang ghi: lỗi console/ngoại lệ, tải xong chưa, canvas có hình không (đếm
 * điểm ảnh sáng), khung hình có bị cắt mép không, mặt cắt bật sẵn đúng khai
 * báo không, số mục bài học = số nhóm, số nhãn hiện, số nút lớp. In bảng và
 * ghi ảnh chụp vào thư mục tạm để soát bằng mắt.
 */
import { spawn } from "node:child_process";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE ?? "http://localhost:3000/vi/giai-phau/mo-hinh/";
const W = 1600, H = 900, PORT = 9334;
const OUT = join(tmpdir(), "soma-audit-pages");
mkdirSync(OUT, { recursive: true });

const dir = "src/lib/humanAtlas/scenes";
const scenes = readdirSync(dir)
  .filter((f) => f.endsWith(".ts") && !["index.ts", "types.ts"].includes(f))
  .map((f) => {
    const t = readFileSync(join(dir, f), "utf8");
    return {
      file: f,
      slug: t.match(/["']?slug["']?: "([^"]+)"/)?.[1],
      // Đếm "parts" chứ không đếm "key": bài bộ phận có thêm khoá của các LỚP.
      groups: (t.match(/["']?parts["']?: \[/g) ?? []).length,
      clip: /["']?clip["']?: \{/.test(t),
      layers: /"layers": \[/.test(t),
    };
  })
  .filter((s) => s.slug);
const only = process.argv.slice(2);
const list = only.length ? scenes.filter((s) => only.includes(s.slug)) : scenes;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(tmpdir(), "soma-audit-profile")}`, `--window-size=${W},${H}`, "--hide-scrollbars", "--ignore-gpu-blocklist", "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(300);
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch { /* chưa sẵn */ }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0; const pending = new Map(); let logs = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") logs.push("EXC " + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).split("\n")[0]);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") logs.push("ERR " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 160));
});
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result))); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (x) => (await send("Runtime.evaluate", { expression: x, returnByValue: true })).result.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });

const rows = [];
for (const s of list) {
  logs = [];
  const issues = [];
  await send("Page.navigate", { url: BASE + s.slug });
  let ok = false;
  for (let i = 0; i < 120 && !ok; i++) {
    await sleep(500);
    ok = await ev(`!document.querySelector('.atlas-scene .loading') && (document.querySelector('.atlas-scene canvas')?.width ?? 0) > 100`).catch(() => false);
  }
  if (!ok) issues.push("KHONG TAI XONG");
  await sleep(1800);
  const info = await ev(`(() => {
    const q = (s) => [...document.querySelectorAll(s)];
    return {
      items: q('.lesson-item').length,
      labels: q('.scene-label').filter((b) => !b.hidden).length,
      chips: q('.layer-chips button').length,
      clipOn: document.querySelector('.clip-card [role=switch]')?.getAttribute('aria-checked') === 'true',
      title: document.querySelector('.scene-title h1')?.textContent ?? '',
    };
  })()`).catch(() => ({}));
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  const png = Buffer.from(data, "base64");
  writeFileSync(join(OUT, `${s.slug}.png`), png);
  // Điểm ảnh "có hình" trong vùng giữa (bỏ cột trái, thanh phải, dock dưới).
  const { data: px, info: im } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const L = 440, R = W - 120, T = 70, B = 720;
  let lit = 0, x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
  for (let y = T; y < B; y += 2) for (let x = L; x < R; x += 2) {
    const i = (y * im.width + x) * im.channels;
    if (Math.max(px[i], px[i + 1], px[i + 2]) > 70) { lit++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const area = (lit * 4) / ((R - L) * (B - T));
  if (lit < 400) issues.push("CANVAS TRONG");
  else if (area < 0.012) issues.push(`HINH NHO ${(area * 100).toFixed(1)}%`);
  if (lit >= 400 && (y0 <= T + 2 || y1 >= B - 3)) issues.push("CHAM MEP DOC");
  if (info.items !== s.groups) issues.push(`MUC ${info.items}/${s.groups}`);
  if (s.clip && !info.clipOn) issues.push("MAT CAT CHUA BAT");
  if (s.layers && !info.chips) issues.push("THIEU NUT LOP");
  if (!info.labels) issues.push("KHONG NHAN");
  issues.push(...logs.slice(0, 3));
  rows.push({ slug: s.slug, area: (area * 100).toFixed(1), labels: info.labels, issues });
  console.log(s.slug.padEnd(30), `hinh ${(area * 100).toFixed(1).padStart(5)}%`, `nhan ${String(info.labels).padStart(2)}`, issues.length ? "!! " + issues.join(" | ") : "ok");
}
writeFileSync(join(OUT, "report.json"), JSON.stringify(rows, null, 2));
console.log(`\n${rows.filter((r) => r.issues.length).length}/${rows.length} trang co van de. Anh: ${OUT}`);
ws.close(); chrome.kill();
