import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readJsonObject, readString } from "./requestBody";
import { bearerToken } from "./apiAuth";

describe("API input boundary", () => {
  it("rejects null, arrays, primitives and malformed JSON", async () => {
    for (const body of ["null", "[]", '"question"', "42", "{broken"]) {
      assert.equal(
        await readJsonObject(
          new Request("http://localhost/api/chat", { method: "POST", body }),
        ),
        null,
      );
    }
  });

  it("accepts objects and never coerces non-text fields into a question", async () => {
    const value = await readJsonObject(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: '{"question":" gan "}',
      }),
    );
    assert.equal(readString(value?.question, 500), "gan");
    assert.equal(readString({ text: "gan" }, 500), "");
    assert.equal(readString(["gan"], 500), "");
    assert.equal(readString("  abcdef  ", 3), "abc");
  });

  it("reads case-insensitive bearer schemes and rejects malformed tokens", () => {
    const request = (value: string) =>
      new Request("http://localhost", { headers: { authorization: value } });
    assert.equal(bearerToken(request("bearer token-a")), "token-a");
    assert.equal(bearerToken(request("Bearer    token-a")), "token-a");
    assert.equal(bearerToken(request("Bearer token-a extra")), undefined);
    assert.equal(bearerToken(request("Basic token-a")), undefined);
  });
});
