import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { complete, llmConfig } from "./llm";

const keys = ["AI_API_KEY", "AI_PROVIDER", "AI_BASE_URL", "AI_MODEL"] as const;
let previous: Partial<Record<typeof keys[number], string>>;
beforeEach(() => {
  previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  process.env.AI_API_KEY = "local-test-only";
  process.env.AI_PROVIDER = "openai";
  process.env.AI_BASE_URL = "http://test.invalid";
  process.env.AI_MODEL = "test-model";
});
afterEach(() => {
  mock.restoreAll();
  for (const key of keys) {
    if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key];
  }
});
test("AI completion preserves grounding instructions and includes a timeout signal", async () => {
  mock.method(globalThis, "fetch", async (url: unknown, options: RequestInit) => {
    assert.equal(url, "http://test.invalid/v1/chat/completions");
    assert(options.signal instanceof AbortSignal);
    const body = JSON.parse(options.body as string);
    assert.equal(body.messages[0].content, "Only use sources");
    assert.equal(body.messages[1].content, "Source [1]: /quiz");
    return Response.json({ choices: [{ message: { content: "Open /quiz [1]." } }] });
  });
  assert.equal(await complete({ system: "Only use sources", user: "Source [1]: /quiz" }), "Open /quiz [1].");
});

test("empty Compose values use the provider defaults", () => {
  process.env.AI_BASE_URL = '';
  process.env.AI_MODEL = '';
  const config = llmConfig();
  assert.ok(config?.baseUrl.startsWith('https://'));
  assert.ok(config?.model);
});
test("caller cancellation remains active alongside the provider timeout", async () => {
  const controller = new AbortController(); controller.abort();
  mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    assert.equal(options.signal?.aborted, true);
    throw new DOMException("Aborted", "AbortError");
  });
  await assert.rejects(complete({ system: "sources", user: "question", signal: controller.signal }), { name: "AbortError" });
});
test("empty provider responses fail instead of being presented as valid answers", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ choices: [] }));
  await assert.rejects(complete({ system: "sources", user: "question" }), /trả về rỗng/);
});
