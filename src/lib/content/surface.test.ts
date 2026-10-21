import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement, lazy, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { jsxs } from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { createContentResolver, EMPTY_CONTENT } from './resolve';
import { bindContentSource, contentTextKey } from './source';
import { resolveContentSurface } from './surface';

const emptyResolver = createContentResolver(EMPTY_CONTENT);

test('leaves streamed lazy nodes for the React renderer to unwrap', () => {
  let starts = 0;
  // RSC children can be lazy nodes themselves, rather than elements with a lazy type.
  const streamed = lazy(async () => {
    starts++;
    return { default: () => createElement('svg') };
  }) as unknown as ReactNode;
  const tree = createElement('div', { className: 'bd home-motion-root' }, streamed);
  const result = resolveContentSurface(tree, 'home', emptyResolver) as ReactElement<{ children: ReactNode }>;
  assert.equal(starts, 0);
  assert.equal(result.props.children, streamed);
  assert.equal(resolveContentSurface(streamed, 'home', emptyResolver), streamed);
});

test('does not subscribe to or instrument pending server children', () => {
  let subscriptions = 0;
  const pending = { then() { subscriptions++; } };
  const children = [createElement('span', { key: 'label' }, 'Ready'), [pending as unknown as ReactNode]];
  const result = resolveContentSurface(children, 'home', emptyResolver) as ReactNode[];
  assert.equal(subscriptions, 0);
  assert.equal('status' in pending, false);
  assert.equal((result[1] as ReactNode[])[0], pending);
  assert.equal((result[0] as ReactElement).key, 'label');
});

test('resolves scoped copy and data without altering structural or interactive props', () => {
  const data = bindContentSource('data:card', { title: 'Original' });
  const resolver = createContentResolver({ documents: {
    'copy:home': { texts: { [contentTextKey('Explore')]: 'Khám phá' } },
    'data:card': { value: { title: 'Updated' } },
  } });
  const onClick = () => undefined;
  const style = { color: 'red' };
  const child = createElement<ComponentProps<'a'> & { 'data-label': string }>('a', { key: 'link', title: 'Explore', className: 'Explore', 'data-label': 'Explore', onClick, style }, 'Explore');
  const tree = createElement('div', { data, id: 'Explore' }, child);
  const result = resolveContentSurface(tree, 'home', resolver) as ReactElement<{ data: { title: string }; id: string; children: typeof child }>;
  assert.equal(result.props.data.title, 'Updated');
  assert.equal(result.props.id, 'Explore');
  assert.equal(result.props.children.key, 'link');
  assert.equal(result.props.children.props.children, 'Khám phá');
  assert.equal(result.props.children.props.title, 'Khám phá');
  assert.equal(result.props.children.props.className, 'Explore');
  assert.equal(result.props.children.props['data-label'], 'Explore');
  assert.equal(result.props.children.props.onClick, onClick);
  assert.equal(result.props.children.props.style, style);
});

test('static JSX siblings render without missing-key warnings after copying', (t) => {
  const errors = t.mock.method(console, 'error', () => undefined);
  const resolver = createContentResolver({ documents: {
    'copy:home': { texts: { [contentTextKey('Explore')]: 'Khám phá' } },
  } });
  const tree = jsxs('div', { children: [createElement('span', null, 'Explore'), createElement('svg')] });
  const output = renderToStaticMarkup(resolveContentSurface(tree, 'home', resolver));
  assert.equal(output, '<div><span>Khám phá</span><svg></svg></div>');
  assert.equal(errors.mock.callCount(), 0);
});

test('generated sibling keys do not collide with explicit keys', () => {
  const children = [createElement('span'), createElement('span', { key: '0' }), createElement('span', { key: '.0' })];
  const result = resolveContentSurface(children, 'home', emptyResolver) as ReactElement[];
  assert.equal(new Set(result.map((child) => child.key)).size, 3);
  assert.equal(result[1].key, '0');
  assert.equal(result[2].key, '.0');
});
