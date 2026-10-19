"use client";

import { Children, cloneElement, createContext, isValidElement, useContext, useMemo, type ReactNode } from 'react';
import { createContentResolver, EMPTY_CONTENT, type ContentSnapshot } from '@/lib/content/resolve';

const ContentContext = createContext(createContentResolver(EMPTY_CONTENT));
const untouched = new Set(['key', 'ref', 'className', 'id', 'htmlFor', 'name', 'type', 'role', 'method', 'target', 'rel', 'download', 'style', 'dangerouslySetInnerHTML', 'locale', 'lang', 'dir', 'value', 'defaultValue', 'checked', 'token', 'session', 'scope', 'systemId']);

export function ContentProvider({ snapshot, preview, children }: { snapshot: ContentSnapshot; preview: boolean; children: ReactNode }) {
  const resolver = useMemo(() => createContentResolver(snapshot), [snapshot]);
  const appearance = snapshot.documents['site:appearance']?.value;
  const theme = appearance && typeof appearance === 'object' ? Object.entries(appearance).filter(([key, value]) => /^--[a-z-]+$/.test(key) && typeof value === 'string' && /^#[a-f0-9]{3,8}$/i.test(value)).map(([key, value]) => `${key}:${value}`).join(';') : '';
  return <ContentContext.Provider value={resolver}>
    {theme && <style>{`html[data-theme] .bd{${theme}}`}</style>}
    {preview && <div role="status" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, padding: '8px 16px', background: '#fff1ce', color: '#634400', textAlign: 'center', font: '13px sans-serif' }}>Đang xem bản nháp · Chưa xuất bản</div>}
    {children}
  </ContentContext.Provider>;
}

export function useContent() { return useContext(ContentContext); }

/** Resolves public presentation values through React, before the child renders. */
export function ContentSurface({ children, scope = '' }: { children: ReactNode; scope?: string }) {
  const { resolve, copy } = useContent();
  function visit(node: ReactNode): ReactNode {
    if (typeof node === 'string') return copy(scope, node);
    if (!isValidElement<Record<string, unknown>>(node)) return node;
    const props: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node.props)) {
      if (key === 'children') props.children = Children.map(value as ReactNode, visit);
      else if (!untouched.has(key) && !key.startsWith('on') && !key.startsWith('data-') && typeof value !== 'function') props[key] = typeof value === 'string' ? copy(scope, value) : resolve(value);
    }
    return cloneElement(node, props);
  }
  return Children.map(children, visit);
}
