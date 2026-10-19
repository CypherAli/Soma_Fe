import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { saveNewsletterEmail } from "./newsletter";

test("newsletter persists registrations and deduplicates simultaneous retries", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "soma-newsletter-"));
  try {
    const filename = path.join(directory, "subscriptions.jsonl");
    await Promise.all(Array.from({ length: 8 }, () => saveNewsletterEmail("qa@example.invalid", filename)));
    await saveNewsletterEmail("second@example.invalid", filename);
    const records = (await readFile(filename, "utf8")).trim().split("\n").map(line => JSON.parse(line));
    assert.deepEqual(records.map(row => row.email), ["qa@example.invalid", "second@example.invalid"]);
    assert(records.every(row => Number.isFinite(Date.parse(row.subscribedAt))));
  } finally { await unlink(path.join(directory, "subscriptions.jsonl")).catch(() => undefined); await rmdir(directory); }
});

test("newsletter storage failure cannot report success or block a later retry", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "soma-newsletter-"));
  try {
    const filename = path.join(directory, "subscriptions.jsonl");
    await writeFile(filename, "broken-json\n");
    await assert.rejects(saveNewsletterEmail("qa@example.invalid", filename));
    assert.equal(await readFile(filename, "utf8"), "broken-json\n");
    await writeFile(filename, "");
    await saveNewsletterEmail("qa@example.invalid", filename);
    assert.equal(JSON.parse((await readFile(filename, "utf8")).trim()).email, "qa@example.invalid");
  } finally { await unlink(path.join(directory, "subscriptions.jsonl")).catch(() => undefined); await rmdir(directory); }
});
