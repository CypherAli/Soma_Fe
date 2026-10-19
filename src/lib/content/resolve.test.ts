import test from 'node:test';
import assert from 'node:assert/strict';
import { contentKey, createContentResolver } from './resolve';
import { bindContentSource, contentTextKey } from './source';
import { homeContent } from '../homeContent';
import { atlasScenes } from '../humanAtlas/scenes';
import { heartScene } from '../humanAtlas/scenes/heart';

test('documents with identical text resolve independently by their source IDs', () => {
  const a = bindContentSource('data:a', { title: { vi: 'Tim', en: 'Heart' }, note: 'Gốc' });
  const b = bindContentSource('data:b', { title: { vi: 'Tim', en: 'Heart' }, note: 'Gốc' });
  const documents = { 'data:a': { value: { title: { vi: 'Tim trang A', en: 'Heart A' }, note: 'Gốc' } }, 'data:b': { value: { title: { vi: 'Tim trang B', en: 'Heart' }, note: 'Đã duyệt' } } };
  for (const entries of [Object.entries(documents), Object.entries(documents).reverse()]) {
    const resolver = createContentResolver({ documents: Object.fromEntries(entries) });
    assert.equal(resolver.resolve(a).title.vi, 'Tim trang A');
    assert.equal(resolver.resolve(b).note, 'Đã duyệt');
    assert.equal(resolver.resolve('Tim'), 'Tim');
    assert.equal(resolver.resolve({ title: 'Tim' }).title, 'Tim');
  }
  assert.equal(a.title.vi, 'Tim');
});

test('split records combine changes without replacing an unrelated parent', () => {
  const source = bindContentSource('data:questions', [{ id: 'a', title: 'Tim' }, { id: 'b', note: 'Gốc' }]);
  const resolver = createContentResolver({ documents: { 'data:questions/0': { value: { id: 'a', title: 'Mới' } }, 'data:questions/1': { value: { id: 'b', note: 'Đã duyệt' } } } });
  assert.deepEqual(resolver.resolve(source), [{ id: 'a', title: 'Mới' }, { id: 'b', note: 'Đã duyệt' }]);
  assert.equal(resolver.resolve(source), resolver.resolve(source));
});

test('copy belongs to a source file, including dynamic template values', () => {
  const key = contentTextKey('Khám phá');
  const template = contentTextKey('Đang xem {0} / {1}');
  const resolver = createContentResolver({ documents: { 'copy:page-a': { texts: { [key]: 'Khám phá A' } }, 'copy:page-b': { texts: { [key]: 'Khám phá B' } } }, rules: [{ id: 'copy:page-a', before: { [template]: 'Đang xem {0} / {1}' }, after: { [template]: 'Mục {0} trong {1}' } }] });
  assert.equal(resolver.copy('page-a', 'Khám phá'), 'Khám phá A');
  assert.equal(resolver.copy('page-b', 'Khám phá'), 'Khám phá B');
  assert.equal(resolver.copy('page-c', 'Khám phá'), 'Khám phá');
  assert.equal(resolver.copy('page-a', 'Đang xem 4 / 12'), 'Mục 4 trong 12');
});

test('JSON question records and atlas names use stable document IDs', () => {
  const resolver = createContentResolver({ documents: { 'json:/kb/test.json#0': { value: { id: 'q1', stem: 'Mới' } }, 'atlas:FJ1': { value: { id: 'FJ1', name: 'Tim mới' } } } });
  assert.equal(resolver.json('/kb/test.json', { questions: [{ id: 'q1', stem: 'Cũ' }] }).questions[0].stem, 'Mới');
  assert.equal(resolver.json('/human-atlas/atlas.json', { parts: [{ id: 'FJ1', name: 'Heart', system: 'arterial' }] }).parts[0].system, 'arterial');
  assert.equal(resolver.json('/human-atlas/atlas.json', { parts: [{ id: 'FJ1', name: 'Heart' }] }).parts[0].name, 'Tim mới');
});

test('home media is resolved before computing background styles', () => {
  const source = bindContentSource('data:home', { panels: [{ img: '/old.webp' }] });
  const resolved = createContentResolver({ documents: { 'data:home': { value: { panels: [{ img: '/new.webp' }] } } } }).resolve(source);
  assert.equal(`url(${resolved.panels[0].img})`, 'url(/new.webp)');
});

test('real home and enriched scene modules retain document bindings', () => {
  const scene = atlasScenes[heartScene.slug];
  assert.ok(scene);
  const updated = { ...scene, replacement: { modelFile: '/models/test.glb', hotspots: [] } };
  const home = { ...homeContent, twoCol: { ...homeContent.twoCol, corpus: { ...homeContent.twoCol.corpus, img: '/plates/test.webp' } } };
  const resolver = createContentResolver({ documents: {
    'data:src/lib/homeContent.ts#homeContent': { value: home },
    'data:src/lib/humanAtlas/scenes/heart.ts#heartScene': { value: updated },
  } });
  assert.equal(resolver.resolve(homeContent).twoCol.corpus.img, '/plates/test.webp');
  assert.equal(resolver.resolve(scene).replacement?.modelFile, '/models/test.glb');
});

test('source fallback preserves identity and renderer objects', () => {
  const resolver = createContentResolver({ documents: {} });
  const source = bindContentSource('data:original', { label: 'Tim' });
  assert.equal(resolver.resolve(source), source);
  const element = { $$typeof: Symbol.for('react.transitional.element'), props: { children: 'Tim' } };
  const ref = { current: source };
  assert.equal(resolver.resolve(element), element);
  assert.equal(resolver.resolve(ref), ref);
  const date = new Date(); assert.equal(resolver.resolve(date), date);
  assert.equal(contentKey({ a: 1, b: 2 }), contentKey({ b: 2, a: 1 }));
});
