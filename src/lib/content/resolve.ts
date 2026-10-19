import { contentSourceId, contentTextKey } from './source';

export type ContentRule = { id: string; before: unknown; after: unknown };
export type ContentSnapshot = {
  schemaVersion?: number;
  contractHash?: string;
  documents: Record<string, { value?: unknown; texts?: Record<string, string> }>;
  rules?: ContentRule[];
};
export const EMPTY_CONTENT: ContentSnapshot = { schemaVersion: 2, documents: {} };

export function contentKey(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(contentKey).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${contentKey(item)}`).join(',')}}`;
  return JSON.stringify(value) ?? '';
}

export function createContentResolver(snapshot: ContentSnapshot) {
  const hasData = Object.keys(snapshot.documents).some((id) => !id.startsWith('copy:'));
  const memo = new WeakMap<object, unknown>();
  const templates = new Map<string, { pattern: RegExp; replacement: string }[]>();
  for (const rule of snapshot.rules ?? []) {
    if (!rule.id?.startsWith('copy:') || !rule.before || !rule.after) continue;
    for (const [key, before] of Object.entries(rule.before)) {
      const after = (rule.after as Record<string, unknown>)[key];
      if (typeof before !== 'string' || typeof after !== 'string' || before === after || !/\{\d+\}/.test(before)) continue;
      const escaped = before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{\d+\\\}/g, '([\\s\\S]*?)');
      const list = templates.get(rule.id) ?? [];
      list.push({ pattern: new RegExp(`^${escaped}$`), replacement: after });
      templates.set(rule.id, list);
    }
  }

  function resolve<T>(value: T): T {
    if (!hasData) return value;
    if (!value || typeof value !== 'object') return value;
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== null) return value;
    if ('$$typeof' in value || ('current' in value && Object.keys(value).length === 1)) return value;
    if (memo.has(value)) return memo.get(value) as T;
    const id = contentSourceId(value);
    if (id && Object.hasOwn(snapshot.documents[id] ?? {}, 'value')) {
      const replacement = snapshot.documents[id].value as T;
      memo.set(value, replacement);
      return replacement;
    }
    let changed = false;
    const output = Array.isArray(value) ? value.map((item) => {
      const next = resolve(item); changed ||= next !== item; return next;
    }) : Object.fromEntries(Object.entries(value).map(([key, item]) => {
      const next = resolve(item); changed ||= next !== item; return [key, next];
    }));
    memo.set(value, changed ? output : value);
    return (changed ? output : value) as T;
  }

  function document<T>(id: string, fallback: T): T {
    return Object.hasOwn(snapshot.documents[id] ?? {}, 'value') ? snapshot.documents[id].value as T : resolve(fallback);
  }

  return {
    resolve, document,
    /** Copy documents own a file-local key; data documents never replace strings. */
    copy(scope: string, value: string): string {
      const id = `copy:${scope}`;
      const replacement = snapshot.documents[id]?.texts?.[contentTextKey(value)];
      if (replacement !== undefined) return replacement;
      for (const template of templates.get(id) ?? []) {
        const match = value.match(template.pattern);
        if (match) return template.replacement.replace(/\{(\d+)\}/g, (_, index: string) => match[Number(index) + 1] ?? '');
      }
      return value;
    },
    json<T>(path: string, value: T): T {
      if (path === '/human-atlas/atlas.json' && value && typeof value === 'object' && 'parts' in value) {
        const atlas = value as T & { parts: { id: string; name: string }[] };
        return { ...atlas, parts: atlas.parts.map((part) => ({ ...part, ...document(`atlas:${part.id}`, { id: part.id, name: part.name }) })) };
      }
      if (Array.isArray(value)) return value.map((item, index) => document(`json:${path}#${index}`, item)) as T;
      if (value && typeof value === 'object' && 'questions' in value && Array.isArray(value.questions)) return { ...value, questions: value.questions.map((item, index) => document(`json:${path}#${index}`, item)) };
      return resolve(value);
    },
  };
}

export type ContentResolver = ReturnType<typeof createContentResolver>;
