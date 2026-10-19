import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const steps = [
  { name: "frontend-unit", args: ["--import", "./scripts/ts-resolve.mjs", "--test", "src/**/*.test.ts"] },
  ...fs.readdirSync("scripts").filter(name => /^test-.*\.(mjs|ts)$/.test(name) && name !== "test-api-boundary.mjs")
    .sort().map(name => ({ name, args: [...(name.endsWith(".ts") ? ["--import", "./scripts/ts-resolve.mjs"] : []), `scripts/${name}`] })),
  ...["verify-scenes.mjs", "verify-models.mjs", "verify-layers.mjs", "verify-quiz-bank.mjs", "verify-quiz-text.mjs"].map(name => ({ name, args: [`scripts/${name}`] })),
  { name: "verify-dr-lam-bank", args: ["--import", "./scripts/ts-resolve.mjs", "scripts/verify-dr-lam-bank.ts"] },
  { name: "verify-vet-export", args: ["--import", "./scripts/ts-resolve.mjs", "scripts/vet/export-vet-data.ts", "--check"] },
];
const destination = path.resolve("docs/audits/full-functional-tests.json");
fs.mkdirSync(path.dirname(destination), { recursive: true });
const requested = process.argv.slice(2);
const selected = requested.length ? steps.filter(step => requested.includes(step.name)) : steps;
if (requested.some(name => !steps.some(step => step.name === name))) throw new Error("Unknown check name");
const report = requested.length && fs.existsSync(destination)
  ? JSON.parse(fs.readFileSync(destination, "utf8"))
  : { startedAt: new Date().toISOString(), checks: [] };
for (const step of selected) {
  const start = performance.now();
  const result = await new Promise(resolve => {
    const child = spawn(process.execPath, step.args, { cwd: process.cwd(), windowsHide: true });
    let output = "";
    const collect = chunk => { output += chunk.toString(); };
    child.stdout.on("data", collect); child.stderr.on("data", collect);
    child.on("error", error => resolve({ code: 1, output: error.message }));
    child.on("close", code => resolve({ code: code ?? 1, output }));
  });
  const record = { name: step.name, args: step.args, ...result, durationMs: Math.round(performance.now() - start) };
  const previous = report.checks.findIndex(check => check.name === step.name);
  if (previous >= 0) report.checks[previous] = record; else report.checks.push(record);
  fs.writeFileSync(destination, JSON.stringify(report, null, 2) + "\n");
  console.log(`${result.code === 0 ? "PASS" : "FAIL"} ${step.name}`);
}
report.finishedAt = new Date().toISOString();
report.passed = report.checks.filter(check => check.code === 0).length;
report.failed = report.checks.length - report.passed;
fs.writeFileSync(destination, JSON.stringify(report, null, 2) + "\n");
console.log(`${report.passed}/${report.checks.length} checks passed; report: ${destination}`);
process.exitCode = report.failed ? 1 : 0;
