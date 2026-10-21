import { cloneElement, isValidElement, type ReactNode } from 'react';
import type { ContentResolver } from './resolve';

const untouched = new Set(['key', 'ref', 'className', 'id', 'htmlFor', 'name', 'type', 'role', 'method', 'target', 'rel', 'download', 'style', 'dangerouslySetInnerHTML', 'locale', 'lang', 'dir', 'value', 'defaultValue', 'checked', 'token', 'session', 'scope', 'systemId']);

export function resolveContentSurface(children: ReactNode, scope: string, { resolve, copy }: ContentResolver): ReactNode {
  function visit(node: ReactNode): ReactNode {
    if (typeof node === 'string') return copy(scope, node);
    if (Array.isArray(node)) {
      const keys = new Set(node.filter(isValidElement).map((child) => child.key));
      return node.map((child, index) => {
        const next = visit(child);
        if (!isValidElement(next) || next.key !== null) return next;
        // Cloned static JSX siblings need keys too; retain explicit list keys.
        let key = String(index);
        while (keys.has(key)) key = `.${key}`;
        keys.add(key);
        return cloneElement(next, { key });
      });
    }
    // Children.map unwraps RSC lazy nodes and subscribes to thenables during
    // render. Pass opaque children through so React owns their Suspense lifecycle.
    if (!isValidElement<Record<string, unknown>>(node)) return node;
    const props: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node.props)) {
      if (key === 'children') props.children = visit(value as ReactNode);
      else if (!untouched.has(key) && !key.startsWith('on') && !key.startsWith('data-') && typeof value !== 'function') props[key] = typeof value === 'string' ? copy(scope, value) : resolve(value);
    }
    return cloneElement(node, props);
  }
  return visit(children);
}
