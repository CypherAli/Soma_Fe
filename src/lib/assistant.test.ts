import assert from 'node:assert/strict';
import { after, mock, test } from 'node:test';
import { retrieveMany } from './assistant';

// Pathology display names come from the backend; retrieval itself uses local
// source data. Keep these regressions deterministic and independent of services.
mock.method(globalThis, 'fetch', async () => Response.json([]));
after(() => mock.restoreAll());

test('a liver question preserves spelling and excludes veterinary sources', async () => {
  const sources = await retrieveMany(['Gan nằm ở đâu?'], 'vi');
  assert(sources.some(source => source.title === 'Gan'));
  assert(!sources.some(source => source.title === 'Gân'));
  assert(!sources.some(source => source.kind === 'vet'));
});

test('a tendon question remains distinguishable from liver', async () => {
  const sources = await retrieveMany(['Gân là gì?'], 'vi');
  assert(sources.some(source => source.title === 'Gân'));
  assert(!sources.some(source => source.title === 'Gan'));
});

test('animal questions use veterinary sources, comparisons retain human sources', async () => {
  const animal = await retrieveMany(['Dạ dày bò có mấy túi?', 'Dạ dày có mấy túi?'], 'vi');
  assert(animal.some(source => source.kind === 'vet'));
  assert(animal.every(source => source.kind === 'vet' || source.kind === 'site'));
  const comparison = await retrieveMany(['Dạ dày người và bò khác nhau thế nào?'], 'vi');
  assert(comparison.some(source => source.kind === 'vet'));
  assert(comparison.some(source => source.kind === 'anatomy'));
});

test('system retrieval uses current public guides and precise source set counts', async () => {
  const sources = await retrieveMany(['đề Y Hà Nội giải phẫu chi trên có bao nhiêu câu'], 'vi');
  assert.equal(sources[0].id, 'quiz:giai-phau-chi-tren');
  assert(sources[0].detail.includes('145 câu'));
  assert.equal(sources[0].href, '/quiz?de=giai-phau-chi-tren');
  assert(sources.every(source => source.kind === 'site'));
  const gesture = await retrieveMany(['Vision AI đổi mô hình bằng tay trái thế nào'], 'vi');
  assert(gesture.some(source => source.detail.includes('Like tay trái')));
  assert(gesture.some(source => source.detail.includes('1×')));
});

test('animal model requests do not cite a human model or a human source exam', async () => {
  const sources = await retrieveMany(['mở mô hình dạ dày bò ở đâu'], 'vi');
  assert(sources.some(source => source.kind === 'vet' || source.id === 'feature:vet'));
  assert(!sources.some(source => /^(model:|quiz:)/.test(source.id)));
});
