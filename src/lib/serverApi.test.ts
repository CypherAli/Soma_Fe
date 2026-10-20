import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { userFromRequest } from './apiAuth';

const originalFetch = globalThis.fetch;
const internal = process.env.API_INTERNAL_URL;
afterEach(() => { globalThis.fetch = originalFetch; if (internal === undefined) delete process.env.API_INTERNAL_URL; else process.env.API_INTERNAL_URL = internal; });

test('server authentication reaches the Docker backend through its internal URL', async () => {
  process.env.API_INTERNAL_URL = 'http://be:4000/api/';
  globalThis.fetch = async (input, init) => {
    assert.equal(input, 'http://be:4000/api/auth/me');
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer session');
    return Response.json({ user: { id: 'owner' } });
  };
  assert.deepEqual(await userFromRequest(new Request('https://soma.test/api/quiz-compose', { headers: { Authorization: 'Bearer session' } })), { id: 'owner' });
});
