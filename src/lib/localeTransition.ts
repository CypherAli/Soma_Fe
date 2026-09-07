const KEY = "soma:locale-transition";

const normalizePath = (path: string) => path.replace(/^\/(vi|en|zh)(?=\/|$)/, "") || "/";

export function markLocaleTransition(path: string) {
  sessionStorage.setItem(KEY, JSON.stringify({ path: normalizePath(path), at: Date.now() }));
}

export function consumeLocaleTransition(): boolean {
  const raw = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  if (!raw) return false;
  try {
    const value = JSON.parse(raw) as { path?: string; at?: number };
    return value.path === normalizePath(window.location.pathname) && Date.now() - (value.at ?? 0) < 10_000;
  } catch {
    return false;
  }
}
