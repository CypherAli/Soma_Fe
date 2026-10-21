"use client";

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createContentResolver, EMPTY_CONTENT, type ContentSnapshot } from '@/lib/content/resolve';
import { resolveContentSurface } from '@/lib/content/surface';

const ContentContext = createContext(createContentResolver(EMPTY_CONTENT));

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
  return resolveContentSurface(children, scope, useContent());
}
