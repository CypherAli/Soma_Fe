import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { fetchPathologies } from "./pathologies";

afterEach(() => mock.restoreAll());
test("pathology fetch keeps real records and supplies a bounded network signal", async () => {
  const item = { id: "sample", slug: "sample", nameVi: "Mục thử", nameEn: "Test entry", nameZh: "测试条目", source: "test" };
  mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    assert(options.signal instanceof AbortSignal);
    return Response.json([item]);
  });
  assert.deepEqual(await fetchPathologies(), { ok: true, items: [item] });
});
test("invalid backend JSON produces a controlled error instead of a render crash", async () => {
  for (const payload of [{ error: "bad schema" }, [null], [{ slug: "missing-id" }], [{ id: "a", slug: "a", nameVi: "a", content: "invalid" }]]) {
    const stub = mock.method(globalThis, "fetch", async () => Response.json(payload));
    const result = await fetchPathologies();
    assert.equal(result.ok, false);
    assert.deepEqual(result.items, []);
    stub.mock.restore();
  }
});
test("backend or network failure returns no fabricated pathology entries", async () => {
  mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  const result = await fetchPathologies();
  assert.equal(result.ok, false);
  assert.deepEqual(result.items, []);
});
