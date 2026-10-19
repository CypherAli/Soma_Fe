import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { clientIp, createLimiter, sameOrigin } from "./rateLimit";

describe("request limits", () => {
  it("blocks the next hit and resumes exactly when the oldest hit expires", () => {
    const limiter = createLimiter(2, 1000);
    assert.equal(limiter.hit("a", 0).ok, true);
    assert.equal(limiter.hit("a", 100).ok, true);
    assert.deepEqual(limiter.hit("a", 200), { ok: false, retryAfter: 1 });
    assert.equal(limiter.hit("b", 200).ok, true);
    assert.equal(limiter.hit("a", 1000).ok, true);
  });

  it("rejects invalid configuration rather than emitting a NaN retry time", () => {
    for (const limit of [0, -1, NaN, Infinity, 1.5])
      assert.throws(() => createLimiter(limit, 1000), RangeError);
    assert.throws(() => createLimiter(1, 0), RangeError);
    assert.throws(() => createLimiter(1, 1000, 0), RangeError);
  });

  it("falls back from empty forwarding headers and checks the proxy host", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": " , 192.0.2.2",
        "x-real-ip": "192.0.2.1",
        "x-forwarded-host": "soma.example",
        origin: "https://soma.example",
      },
    });
    assert.equal(clientIp(request), "192.0.2.1");
    assert.equal(sameOrigin(request), true);
    assert.equal(
      sameOrigin(
        new Request("http://localhost", {
          headers: { host: "soma.example", origin: "https://other.example" },
        }),
      ),
      false,
    );
  });
});
