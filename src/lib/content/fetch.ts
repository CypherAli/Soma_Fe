/** Public JSON datasets use the same published snapshot as the website. */
export function contentFetch(input: RequestInfo | URL, init?: RequestInit) {
  const url = typeof input === 'string' ? input : null;
  if (url && (url.startsWith('/kb/') || url === '/human-atlas/atlas.json' || url === '/atlas/index.json') && url.endsWith('.json')) {
    return fetch(`/api/site-data?path=${encodeURIComponent(url)}`, init);
  }
  return fetch(input, init);
}
