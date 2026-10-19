import "./ts-resolve.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";

// Real production routes, a local deterministic provider, and no real API key.
const report = { startedAt: new Date().toISOString(), checks: [] };
let mode = "valid", calls = 0, serverOutput = "";
let visionMode = "valid", visionCalls = 0;
const provider = http.createServer(async (req, res) => {
  let raw = ""; for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw);
  if (req.url === "/vision") {
    visionCalls++;
    if (visionMode === "fail") { res.writeHead(503); res.end("test GPU unavailable"); return; }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ mode: "knn", results: visionMode === "empty" ? [] : [
      { part: body.labels[0], score: .7 }, { part: "not-a-real-part", score: 1 }, { part: body.labels[1], score: "bad" },
    ] })); return;
  }
  calls++;
  const user = body.messages.at(-1).content;
  let content;
  if (body.max_tokens === 200) content = JSON.stringify({ intent: "lookup", queries: [user] });
  else if (mode === "fail") { res.writeHead(503); res.end("test provider unavailable"); return; }
  else if (mode === "bad-citation") content = "Bộ đề có 145 câu [99].";
  else {
    assert(user.includes("TƯ LIỆU:") && user.includes("Đường dẫn:"), "Actual prompt must contain evidence and navigable source links");
    assert(user.includes("145 câu"), "Actual source manifest must supply the count");
    content = "Bộ đề Giải phẫu chi trên có 145 câu [1].";
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ choices: [{ message: { content } }] }));
});
await new Promise(resolve => provider.listen(0, "127.0.0.1", resolve));
const providerPort = provider.address().port;
const lease = http.createServer(); await new Promise(resolve => lease.listen(0, "127.0.0.1", resolve));
const port = lease.address().port; await new Promise(resolve => lease.close(resolve));
const base = `http://127.0.0.1:${port}`;
const newsletterFile = path.resolve(`docs/audits/.newsletter-qa-${process.pid}.jsonl`);
const app = spawn(process.execPath, [".next/standalone/server.js"], {
  cwd: process.cwd(), windowsHide: true,
  env: { ...process.env, PORT: String(port), HOSTNAME: "127.0.0.1", AI_API_KEY: "local-test-only", AI_PROVIDER: "openai", AI_BASE_URL: `http://127.0.0.1:${providerPort}`, AI_MODEL: "local-test", SOMA_VISION_URL: `http://127.0.0.1:${providerPort}/vision`, SOMA_VISION_KEY: "local-test-only", SOMA_VISION_DAILY_CAP: "100", SOMA_NEWSLETTER_FILE: newsletterFile },
});
app.stdout.on("data", data => { serverOutput += data; });
app.stderr.on("data", data => { serverOutput += data; });
const check = async (name, action) => {
  try { await action(); report.checks.push({ name, passed: true }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, passed: false, error: error.message }); console.log(`FAIL ${name}: ${error.message}`); }
};
const post = async question => {
  const response = await fetch(`${base}/api/assistant`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, locale: "vi" }), signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200); return response.json();
};
try {
  let ready = false;
  for (let n = 0; n < 60; n++) {
    try { const response = await fetch(`${base}/api/search?q=PDF`, { signal: AbortSignal.timeout(1000) }); if (response.ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert(ready, "Local production server must start");
  await check("search API returns the real PDF tool", async () => {
    const response = await fetch(`${base}/api/search?q=PDF`); const data = await response.json();
    assert.equal(data.items[0].id, "feature:documents"); assert.equal(data.items[0].href, "/quiz?tool=pdf");
  });
  for (const params of ["limit=NaN", "limit=2.5", "limit=0", "limit=101", "locale=invalid"]) {
    await check(`search validation ${params}`, async () => assert.equal((await fetch(`${base}/api/search?q=PDF&${params}`)).status, 400));
  }
  await check("source-based AI receives current counts and links", async () => {
    mode = "valid"; const previous = calls;
    const data = await post("đề Y Hà Nội giải phẫu chi trên có bao nhiêu câu");
    assert.equal(data.engine, "ai"); assert(data.answer.includes("145"));
    assert.equal(data.sources[0].id, "quiz:giai-phau-chi-tren"); assert.equal(calls - previous, 1, "A clear system query needs no remote rewrite");
  });
  await check("invalid AI citations fall back to actual sources", async () => {
    mode = "bad-citation"; const data = await post("đề Y Hà Nội giải phẫu chi trên có bao nhiêu câu");
    assert.equal(data.engine, "lookup-fallback"); assert(!data.answer.includes("[99]")); assert(data.sources.length > 0);
  });
  await check("provider failure leaves source lookup usable", async () => {
    mode = "fail"; const data = await post("đề Y Hà Nội giải phẫu chi trên có bao nhiêu câu");
    assert.equal(data.engine, "lookup-fallback"); assert(data.answer.includes("145"));
  });
  await check("unsupported tasks refuse before any AI call", async () => {
    const previous = calls; const data = await post("viết code cho trang quiz Soma");
    assert.equal(data.engine, "refused"); assert.equal(calls, previous);
  });
  await check("oversized questions reject before inference", async () => {
    const previous = calls;
    const response = await fetch(`${base}/api/assistant`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: "a".repeat(501) }) });
    assert.equal(response.status, 400); assert.equal(calls, previous);
  });
  await check("pathology fallback uses interface language and identifies Vietnamese source excerpts", async () => {
    mode = "fail";
    for (const [locale, lead] of [["en", "Source excerpts (Vietnamese original"], ["zh", "来源原文（越南语"]]) {
      const response = await fetch(`${base}/api/pathology-chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: "Summarise this article", mode: "disease", slug: "xo-gan", locale }) });
      assert.equal(response.status, 200); const data = await response.json();
      assert(data.answer.startsWith(lead)); assert(data.sources.length > 0);
      assert(data.sources.every(source => source.slug === "xo-gan"));
    }
  });
  await check("pathology out-of-range citations fall back to the current article", async () => {
    mode = "bad-citation";
    const response = await fetch(`${base}/api/pathology-chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: "Tóm tắt bài này", mode: "disease", slug: "xo-gan", locale: "vi" }) });
    assert.equal(response.status, 200); const data = await response.json();
    assert.equal(data.engine, "lookup-fallback"); assert(!data.answer.includes("[99]"));
    assert(data.sources.every(source => source.slug === "xo-gan"));
  });
  await check("all public feature destinations are routable", async () => {
    const { allSiteFacts } = await import("../src/lib/site/siteKnowledge.ts");
    const failures = [];
    for (const fact of allSiteFacts().filter(fact => fact.kind === "feature")) {
      try {
        const response = await fetch(base + fact.href, { signal: AbortSignal.timeout(15_000) });
        assert.equal(response.status, 200, `${fact.id}: ${fact.href}`);
        await response.text();
      } catch (error) {
        let target = base + fact.href; const redirects = [];
        for(let n=0;n<4;n++) { const response=await fetch(target,{redirect:"manual"}); const location=response.headers.get("location");redirects.push({url:target,status:response.status,location});if(!location)break;target=new URL(location,target).href; }
        report.redirects = redirects;
        failures.push(`${fact.id} ${fact.href}: ${error.message} ${error.cause?.message ?? error.cause?.code ?? ""}; ${JSON.stringify(redirects)}`);
      }
    }
    assert.equal(failures.length, 0, failures.join("\n"));
  });
  await check("anonymous API boundaries", async () => {
    const result = await new Promise(resolve => {
      const child = spawn(process.execPath, ["scripts/test-api-boundary.mjs"], { cwd: process.cwd(), windowsHide: true, env: { ...process.env, SOMA_TEST_URL: base } });
      let output = ""; child.stdout.on("data", data => { output += data; }); child.stderr.on("data", data => { output += data; });
      child.on("close", code => resolve({ code, output }));
    });
    assert.equal(result.code, 0, result.output); report.boundaryOutput = result.output;
  });
  const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";
  const scan = (body, headers = {}) => fetch(`${base}/api/vision/identify`, {
    method: "POST", headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body), signal: AbortSignal.timeout(15_000),
  });
  await check("Vision validates malformed JSON before provider calls", async () => {
    const previous = visionCalls;
    for (const body of ["null", "{", { image: 42 }]) assert.equal((await scan(body)).status, 400);
    assert.equal(visionCalls, previous);
  });
  await check("Vision rejects cross-origin requests", async () => {
    const previous = visionCalls;
    assert.equal((await scan({ image }, { Origin: "https://unrelated.example" })).status, 403);
    assert.equal(visionCalls, previous);
  });
  await check("Vision rejects oversized cropped images", async () => {
    const previous = visionCalls;
    assert.equal((await scan({ image: image + "a".repeat(1_400_000) })).status, 413);
    assert.equal(visionCalls, previous);
  });
  await check("Vision accepts only real model labels and finite scores", async () => {
    visionMode = "valid"; const response = await scan({ image });
    assert.equal(response.status, 200); const data = await response.json();
    assert.equal(data.results.length, 1); assert.equal(data.results[0].score, .7); assert.equal(data.mode, "knn");
  });
  await check("Vision empty inference offers controlled no-match", async () => {
    visionMode = "empty"; const response = await scan({ image });
    assert.equal(response.status, 200); assert.equal((await response.json()).error, "no-match");
  });
  await check("Vision provider outage is handled without a page crash", async () => {
    visionMode = "fail"; const response = await scan({ image });
    assert.equal(response.status, 502); assert.equal((await response.json()).error, "vision-failed");
  });
  await check("Vision scan frequency cap returns retry-after", async () => {
    visionMode = "empty";
    let response;
    for (let n = 0; n < 21; n++) response = await scan({ image }, { "x-forwarded-for": "127.0.0.9" });
    assert.equal(response.status, 429); assert(Number(response.headers.get("retry-after")) >= 1);
  });
  const subscribe = (headers = {}) => fetch(`${base}/api/subscribe`, {
    method: "POST", headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ email: "QA@EXAMPLE.INVALID" }), signal: AbortSignal.timeout(15_000),
  });
  await check("newsletter saves and deduplicates actual concurrent registrations", async () => {
    const responses = await Promise.all(Array.from({ length: 3 }, () => subscribe()));
    for (const response of responses) { assert.equal(response.status, 200); assert.equal((await response.json()).ok, true); }
    const rows = fs.readFileSync(newsletterFile, "utf8").trim().split("\n").map(line => JSON.parse(line));
    assert.equal(rows.length, 1); assert.equal(rows[0].email, "qa@example.invalid");
  });
  await check("newsletter storage failure returns 503 instead of false success", async () => {
    fs.writeFileSync(newsletterFile, "broken-json\n");
    const response = await subscribe(); assert.equal(response.status, 503);
    assert.equal((await response.json()).error, "subscription-unavailable");
    assert.equal(fs.readFileSync(newsletterFile, "utf8"), "broken-json\n");
  });
  await check("newsletter cross-origin registration is rejected", async () => {
    assert.equal((await subscribe({ Origin: "https://unrelated.example" })).status, 403);
  });
  await check("newsletter rate cap returns retry-after", async () => {
    fs.writeFileSync(newsletterFile, ""); let response;
    for (let n = 0; n < 6; n++) response = await subscribe({ "x-forwarded-for": "127.0.0.10" });
    assert.equal(response.status, 429); assert(Number(response.headers.get("retry-after")) >= 1);
  });
} finally {
  app.kill(); await new Promise(resolve => provider.close(resolve));
  if (fs.existsSync(newsletterFile)) fs.unlinkSync(newsletterFile);
  report.finishedAt = new Date().toISOString(); report.failed = report.checks.filter(check => !check.passed).length;
  report.productionStartup = serverOutput.split(/\r?\n/).filter(line => /▲ Next|Ready in|Local:/.test(line));
  fs.writeFileSync("docs/audits/rag-api-qa.json", JSON.stringify(report, null, 2) + "\n");
}
if (report.failed) process.exitCode = 1;
console.log(`${report.checks.length - report.failed}/${report.checks.length} production API checks passed.`);
