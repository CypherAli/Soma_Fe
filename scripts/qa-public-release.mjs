import "./ts-resolve.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
const { allSiteFacts } = await import("../src/lib/site/siteKnowledge.ts");

// Read-only HTTP audit of the actual production build, including its assets.
// Mount the same public/static directories that the Docker image copies.
const root = process.cwd(), standalone = path.join(root, ".next/standalone");
const mounts = [];
for (const [source, destination] of [["public", "public"], [".next/static", ".next/static"]]) {
  const target = path.join(standalone, destination);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.symlinkSync(path.join(root, source), target, process.platform === "win32" ? "junction" : "dir");
    mounts.push(target);
  }
}
const lease = http.createServer();
await new Promise(resolve => lease.listen(0, "127.0.0.1", resolve));
const port = lease.address().port;
await new Promise(resolve => lease.close(resolve));
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [path.join(standalone, "server.js")], {
  cwd: root, windowsHide: true,
  env: { ...process.env, PORT: String(port), HOSTNAME: "127.0.0.1" },
  stdio: ["ignore", "ignore", "pipe"],
});
let serverErrors = "";
server.stderr.on("data", data => { serverErrors += data; });
const report = { startedAt: new Date().toISOString(), pages: [], assets: [], missingRoutes: [], excluded: "Login, password, OAuth and account-only settings. No forms submitted or database writes." };
const auth = /\/(dang-nhap|dat-lai-mat-khau|oauth-callback|cai-dat)(\/|\?|$)/;
const asset = /\.[a-z0-9]{2,16}(\?|$)/i;
const manifest = JSON.parse(fs.readFileSync(".next/prerender-manifest.json", "utf8"));
const routes = new Set(Object.keys(manifest.routes).filter(route => !route.startsWith("/_") && !route.endsWith("/gesture-test") && !auth.test(route) && !asset.test(route)));
for (const fact of allSiteFacts()) if (!auth.test(fact.href)) {
  for (const prefix of ["/vi", "/en", "/zh"]) routes.add(prefix + (fact.href === "/" ? "" : fact.href));
}
const assets = new Set(["/wonder/index.html", "/wonder/vendor/three.module.js", "/kb/dr-lam/index.json", "/pdf.worker.min.mjs"]);
const observedLinks = new Set(), done = new Set();
async function pool(values, handler) {
  let next = 0;
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (next < values.length) await handler(values[next++]);
  }));
}
async function inspect(route) {
  done.add(route);
  try {
    const response = await fetch(base + route, { signal: AbortSignal.timeout(20_000) });
    const html = await response.text();
    const language = html.match(/<html[^>]*\blang="([^"]+)"/)?.[1];
    const expected = route.startsWith("/en") ? "en" : route.startsWith("/zh") ? "zh" : "vi";
    const valid = response.status === 200 && /<main\b|<canvas\b|<iframe\b/.test(html) && language === expected;
    report.pages.push({ route, status: response.status, language, passed: valid });
    if (!valid) return;
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const url = new URL(href, base);
      const target = url.pathname + url.search;
      if (target.startsWith("/_next/") || asset.test(target)) assets.add(target);
      else if (!auth.test(target) && !target.startsWith("/api/")) observedLinks.add(target);
    }
  } catch (error) {
    report.pages.push({ route, passed: false, error: error.message });
  }
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(base + "/api/search?q=PDF", { signal: AbortSignal.timeout(1000) })).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert(ready, "Production fixture must start");
  await pool([...routes], inspect);
  console.log(`Checked ${report.pages.length} generated pages and public source destinations.`);
  const linked = [...observedLinks].filter(route => !done.has(route));
  assert(linked.length < 2000, "Unexpected navigation expansion");
  await pool(linked, inspect);
  await pool([...assets], async route => {
    try {
      const response = await fetch(base + route, { method: "HEAD", signal: AbortSignal.timeout(20_000) });
      report.assets.push({ route, status: response.status, passed: response.status === 200 });
    } catch (error) { report.assets.push({ route, passed: false, error: error.message }); }
  });
  for (const route of ["/vi/giai-phau/mo-hinh/no-such-model-987", "/en/no-such-page-987", "/vi/dong-vat/no-such-species-987", "/vi/gesture-test", "/en/gesture-test", "/zh/gesture-test"]) {
    const response = await fetch(base + route, { signal: AbortSignal.timeout(15_000) });
    report.missingRoutes.push({ route, status: response.status, passed: response.status === 404 });
    await response.text();
  }
} finally {
  server.kill();
  await new Promise(resolve => { if (server.exitCode !== null) resolve(); else server.once("close", resolve); });
  for (const target of mounts) {
    // Remove only verified links, never their source directories or contents.
    assert(fs.lstatSync(target).isSymbolicLink());
    if (process.platform === "win32") fs.rmdirSync(target); else fs.unlinkSync(target);
  }
  report.finishedAt = new Date().toISOString();
  report.failures = [...report.pages, ...report.assets, ...report.missingRoutes].filter(row => !row.passed);
  report.serverErrors = serverErrors;
  fs.writeFileSync("docs/audits/public-release-qa.json", JSON.stringify(report, null, 2) + "\n");
}
console.log(`${report.pages.length} pages, ${report.assets.length} assets, ${report.missingRoutes.length} 404 checks; ${report.failures.length} failures.`);
for (const failure of report.failures) console.log(JSON.stringify(failure));
if (report.failures.length) process.exitCode = 1;
