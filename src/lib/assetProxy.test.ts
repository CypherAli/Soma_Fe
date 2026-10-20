import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/content/assets/[id]/route';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const request = new Request('https://soma.test/api/content/assets/aa-bb');

test('public asset proxy forwards validated model bytes and never forwards a session', async () => {
  globalThis.fetch = async (input, init) => {
    assert.ok(String(input).endsWith('/api/content/assets/aa-bb'));
    assert.equal(new Headers(init?.headers).has('Authorization'), false);
    return new Response('glTF', { headers: { 'Content-Type': 'model/gltf-binary' } });
  };
  const response = await GET(request, { params: Promise.resolve({ id: 'aa-bb' }) });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'glTF');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('asset proxy rejects traversal and unexpected MIME types', async () => {
  globalThis.fetch = async () => { throw new Error('Invalid ID must not reach upstream'); };
  assert.equal((await GET(request, { params: Promise.resolve({ id: '../secret' }) })).status, 404);
  globalThis.fetch = async () => new Response('<script>', { headers: { 'Content-Type': 'text/html' } });
  assert.equal((await GET(request, { params: Promise.resolve({ id: 'aa-bb' }) })).status, 502);
});
