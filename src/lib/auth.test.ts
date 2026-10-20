import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  authRequest,
  clearAuth,
  getToken,
  saveAuth,
  AUTH_CHANGED_EVENT,
  type AuthResponse,
} from "./auth";
import { listDocs, uploadPdf } from "./personalDocs";
import { deletePath } from "./study";
import { beginProviderLink } from "./account";

const browser = new EventTarget();
const storage = new Map<string, string>();
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalFetch = globalThis.fetch;
const auth = (token = "session-a"): AuthResponse => ({
  token,
  expiresAt: new Date(Date.now() + 60_000).toISOString(),
  user: { id: "user-a", name: "Test", email: "test@example.com", role: "user" },
});

beforeEach(() => {
  storage.clear();
  Object.defineProperty(browser, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: browser,
  });
  saveAuth(auth());
});

afterEach(() => {
  clearAuth();
  globalThis.fetch = originalFetch;
  if (originalWindow)
    Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

describe("auth sessions and requests", () => {
  it("starts OAuth linking with a bearer POST and never places the session in a URL", async () => {
    globalThis.fetch = async (input, init) => {
      assert.ok(String(input).endsWith('/auth/oauth/google/link'));
      assert.ok(!String(input).includes('session-a'));
      assert.equal(init?.method, 'POST');
      assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer session-a');
      return Response.json({ url: 'https://accounts.google.com/o/oauth2/v2/auth?state=one-time-state' });
    };
    assert.equal(await beginProviderLink('google'), 'https://accounts.google.com/o/oauth2/v2/auth?state=one-time-state');
    globalThis.fetch = async () => Response.json({ url: 'https://attacker.test/' });
    await assert.rejects(beginProviderLink('google'));
  });
  it("uses a tab session when storage writes fail, even if reads still work", () => {
    Object.defineProperty(browser, "localStorage", {
      configurable: true,
      value: {
        getItem: () => "old-token",
        setItem: () => {
          throw new Error("quota");
        },
        removeItem: () => {
          throw new Error("blocked");
        },
      },
    });
    saveAuth(auth("session-b"));
    assert.equal(getToken(), "session-b");
    clearAuth();
    assert.equal(getToken(), null);
  });

  it("clears an expired token once without recursively notifying listeners", () => {
    saveAuth({ ...auth(), expiresAt: new Date(Date.now() - 1).toISOString() });
    let changes = 0;
    const listener = () => {
      changes += 1;
      assert.equal(getToken(), null);
    };
    browser.addEventListener(AUTH_CHANGED_EVENT, listener);
    try {
      assert.equal(getToken(), null);
      assert.equal(changes, 1);
    } finally {
      browser.removeEventListener(AUTH_CHANGED_EVENT, listener);
    }
  });

  it("preserves Headers and tuple headers supplied by the caller", async () => {
    const received: Headers[] = [];
    globalThis.fetch = async (_input, init) => {
      received.push(new Headers(init?.headers));
      return Response.json({ ok: true });
    };
    await authRequest("/auth/me", {
      headers: new Headers({ "X-Trace": "one" }),
    });
    await authRequest("/auth/me", {
      headers: [
        ["X-Trace", "two"],
        ["Authorization", "Bearer explicit"],
      ],
    });
    assert.equal(received[0].get("x-trace"), "one");
    assert.equal(received[0].get("authorization"), "Bearer session-a");
    assert.equal(received[1].get("x-trace"), "two");
    assert.equal(received[1].get("authorization"), "Bearer explicit");
  });

  it("lets fetch generate the multipart boundary for uploads", async () => {
    globalThis.fetch = async (_input, init) => {
      assert.equal(new Headers(init?.headers).has("content-type"), false);
      return Response.json({ ok: true });
    };
    await authRequest("/personal-docs", {
      method: "POST",
      body: new FormData(),
    });
    await uploadPdf(
      new File(["test"], "test.pdf", { type: "application/pdf" }),
    );
  });

  it("does not clear a newer session when an old request returns 401", async () => {
    globalThis.fetch = async () => {
      saveAuth(auth("session-b"));
      return Response.json({ message: "expired" }, { status: 401 });
    };
    await assert.rejects(authRequest("/auth/me"), /expired/);
    assert.equal(getToken(), "session-b");
  });

  it("clears a rejected session exactly once", async () => {
    let changes = 0;
    const listener = () => {
      changes += 1;
    };
    browser.addEventListener(AUTH_CHANGED_EVENT, listener);
    try {
      globalThis.fetch = async () =>
        Response.json({ message: "expired" }, { status: 401 });
      await assert.rejects(authRequest("/auth/me"), /expired/);
      assert.equal(getToken(), null);
      assert.equal(changes, 1);
    } finally {
      browser.removeEventListener(AUTH_CHANGED_EVENT, listener);
    }
  });

  it("applies session invalidation to personal documents through the shared client", async () => {
    globalThis.fetch = async () =>
      Response.json({ message: "expired" }, { status: 401 });
    await assert.rejects(listDocs(), /expired/);
    assert.equal(getToken(), null);
  });

  it("handles null error bodies and leaves valid sessions on network failure", async () => {
    globalThis.fetch = async () => Response.json(null, { status: 502 });
    await assert.rejects(authRequest("/auth/me"), /502/);
    globalThis.fetch = async () => {
      throw new TypeError("offline");
    };
    await assert.rejects(authRequest("/auth/me"), /Không thể kết nối/);
    assert.equal(getToken(), "session-a");
  });

  it("preserves cancellation so callers can distinguish it from network failure", async () => {
    const controller = new AbortController();
    const reason = new DOMException("Cancelled", "AbortError");
    controller.abort(reason);
    globalThis.fetch = async () => {
      throw reason;
    };
    await assert.rejects(
      authRequest("/auth/me", { signal: controller.signal }),
      (error) => error === reason,
    );
  });

  it("path deletion rejects HTTP and network failures instead of reporting success", async () => {
    globalThis.fetch = async (url, init) => {
      assert.equal(String(url), "http://localhost:4000/api/study/path");
      assert.equal(init?.method, "DELETE");
      assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer session-a");
      return Response.json({ message: "storage unavailable" }, { status: 503 });
    };
    await assert.rejects(deletePath(), /storage unavailable/);
    globalThis.fetch = async () => { throw new TypeError("offline"); };
    await assert.rejects(deletePath(), /Không thể kết nối/);
    assert.equal(getToken(), "session-a");
  });

  it("path deletion succeeds only after a server confirmation", async () => {
    globalThis.fetch = async () => Response.json({ success: true });
    await assert.doesNotReject(deletePath());
    assert.equal(getToken(), "session-a");
  });

  it("path deletion expires a rejected session and refuses without login", async () => {
    globalThis.fetch = async () => Response.json({ message: "expired" }, { status: 401 });
    await assert.rejects(deletePath(), /expired/);
    assert.equal(getToken(), null);
    globalThis.fetch = async () => { throw new Error("Must not request without a session"); };
    await assert.rejects(deletePath(), /Cần đăng nhập/);
  });
});
