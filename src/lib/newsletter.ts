import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

let pending: Promise<unknown> = Promise.resolve();

/** Durable single-server registration, with idempotent concurrent requests. */
export function saveNewsletterEmail(email: string, filename = process.env.SOMA_NEWSLETTER_FILE || path.join(process.cwd(), "data/newsletter.jsonl")): Promise<void> {
  const operation = pending.then(async () => {
    await mkdir(path.dirname(filename), { recursive: true });
    let content = "";
    try { content = await readFile(filename, "utf8"); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    const rows = content.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line) as { email?: unknown });
    if (rows.some(row => row.email === email)) return;
    await appendFile(filename, JSON.stringify({ email, subscribedAt: new Date().toISOString() }) + "\n", "utf8");
  });
  pending = operation.catch(() => undefined);
  return operation;
}
