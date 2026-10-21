import type { Loc, T3 } from "./homeContent";

export function foldModelSearch(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
}

/** Match whole Latin-script words: "tim" must not match "compartimentum". */
function containsTerm(text: string, term: string): boolean {
  if (/[\u3400-\u9fff]/u.test(term)) return text.includes(term);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, "u").test(text);
}

export function modelSearchScore(
  model: { title: T3; searchText?: string },
  query: string,
  locale: Loc,
): number {
  const q = foldModelSearch(query.trim());
  if (!q) return 1;
  const terms = q.match(/[\p{L}\p{N}]+/gu) ?? [];
  if (!terms.length) return 0;
  const titles = Object.values(model.title).map(foldModelSearch);
  const haystack = `${titles.join(" ")} ${foldModelSearch(model.searchText ?? "")}`;
  if (!terms.every((term) => containsTerm(haystack, term))) return 0;
  const localTitle = foldModelSearch(model.title[locale]);
  if (localTitle === q) return 120;
  if (terms.every((term) => containsTerm(localTitle, term))) return 100;
  if (titles.some((title) => terms.every((term) => containsTerm(title, term)))) return 80;
  return 20;
}
