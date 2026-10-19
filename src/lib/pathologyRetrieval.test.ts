import assert from "node:assert/strict";
import { test } from "node:test";
import { articlePassages } from "./pathologyRetrieval.ts";

test("contextual summaries retrieve only the current article without relying on question keywords", async () => {
  const hits = await articlePassages("xo-gan");
  assert.equal(hits.length, 4);
  assert(hits.every(hit => hit.slug === "xo-gan" && hit.text.length > 0 && hit.page > 0));
  assert.equal(new Set(hits.map(hit => `${hit.page}:${hit.text}`)).size, hits.length);
});
test("an absent article never borrows passages from another disease", async () => {
  assert.deepEqual(await articlePassages("SOMA_QA_no_such_article"), []);
});
