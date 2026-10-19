import test from 'node:test';
import assert from 'node:assert/strict';
import { PublicationCache } from './publication-cache';
const snapshot = { schemaVersion: 2, contractHash: 'current', documents: { home: { value: { title: 'Đã xuất bản' } } } };
const fail = async () => { throw new Error('API offline'); };
const noop = async () => undefined;
test('outage keeps the most recent publication; a new process can recover from disk', async () => {
  const cache = new PublicationCache('current');
  let disk: unknown;
  assert.deepEqual(await cache.load(async () => snapshot, fail, async (value) => { disk = value; }, noop), snapshot);
  assert.deepEqual(await cache.load(fail, fail, noop, noop), snapshot);
  assert.deepEqual(await new PublicationCache('current').load(fail, async () => disk, noop, noop), snapshot);
});
test('a deployment never uses content cached for another source contract', async () => {
  const result = await new PublicationCache('different').load(async () => snapshot, async () => snapshot, noop, noop);
  assert.deepEqual(result.documents, {});
});
