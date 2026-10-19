import { catalogScenes, systemByKey } from "@/lib/catalog";
import { pick, type Loc } from "@/lib/homeContent";
import { allSiteFacts } from "./siteKnowledge";
import { mentionedQuizSets } from "./webFeatures";

export type WebSearchItem = {
  id: string;
  kind: "model" | "feature" | "quiz";
  title: string;
  excerpt: string;
  href: string;
  section: string;
  score: number;
};

const fold = (text: string) => text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
const words = (text: string) => fold(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const stop = new Set("cua la nhung soma tren cach co the nao o toi can trang web website mo hinh model models bang bao nhieu may where can open how what which the a an of to on this i with is are do does many".split(" "));
const cjk = /[㐀-鿿]/;
function phrase(hay: string, needle: string) {
  if (!needle) return false;
  if (cjk.test(needle)) return hay.includes(needle);
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, "u").test(hay);
}

type Indexed = Omit<WebSearchItem, "score"> & { hay: string; terms: Set<string>; keys: string[] };
const indexes = new Map<Loc, Indexed[]>();
function index(locale: Loc): Indexed[] {
  const cached = indexes.get(locale);
  if (cached) return cached;
  const guides: Indexed[] = allSiteFacts().filter(fact => fact.kind !== "model").map(guide => {
    const body = pick(guide.body, locale), title = pick(guide.title, locale);
    const hay = fold([title, body, ...guide.keys].join(" "));
    return {
      id: guide.id, kind: guide.kind, title, excerpt: body, href: guide.href,
      section: guide.kind === "quiz" ? pick({ vi: "Đại học Y Hà Nội", en: "Hanoi Medical University", zh: "河内医科大学" }, locale) : "Soma",
      hay, terms: new Set(words(hay)), keys: guide.keys.map(fold),
    };
  });
  const models: Indexed[] = catalogScenes.map(scene => {
    const title = pick(scene.title, locale), description = pick(scene.description, locale);
    const group = systemByKey.get(scene.system);
    const hay = fold([scene.searchText, description, group && pick(group.label, locale)].join(" "));
    return {
      id: `model:${scene.slug}`, kind: "model", title, href: scene.href, excerpt: description,
      section: group ? pick(group.label, locale) : "3D",
      hay, terms: new Set(words(hay)), keys: [fold(title)],
    };
  });
  const result = [...guides, ...models];
  indexes.set(locale, result);
  return result;
}

/** Ranked public-site lookup, independent of an AI provider or login state. */
export function searchWeb(query: string, locale: Loc = "vi"): WebSearchItem[] {
  const raw = query.trim().slice(0, 500);
  if (!raw) return [];
  const q = fold(raw);
  const subject = fold(raw.replace(/^(tìm kiếm|tìm|mở|xem|search for|find)\s+/iu, "")).replace(/\bo dau\b/gu, "");
  const protectedTerms = new Set(/\bchi tren\b/.test(subject) ? ["tren"] : []);
  const meaningful = words(subject).filter(term => !stop.has(term) || protectedTerms.has(term));
  const tokens = meaningful.length ? meaningful : words(subject);
  const results: WebSearchItem[] = [];
  const namedSets = mentionedQuizSets(raw);
  for (const item of index(locale)) {
    if (item.kind === "quiz" && namedSets.size && !namedSets.has(item.id)) continue;
    const title = fold(item.title);
    const key = item.keys.some(key => key.length >= 2 && phrase(q, key));
    const titleMatch = phrase(title, q) || phrase(q, title);
    const hits = tokens.filter(term => cjk.test(term) ? item.hay.includes(term) : item.terms.has(term));
    if (!key && !titleMatch && (!tokens.length || hits.length !== tokens.length)) continue;
    const exactRaw = item.title.toLocaleLowerCase().includes(raw.toLocaleLowerCase());
    const score = (titleMatch ? 100 : 0) + (key ? 65 : 0) + (exactRaw ? 25 : 0) +
      hits.length * 3 + tokens.filter(term => phrase(title, term)).length * 8;
    const { hay: _hay, terms: _terms, keys: _keys, ...display } = item;
    void _hay; void _terms; void _keys;
    results.push({ ...display, score });
  }
  results.sort((a, b) => b.score - a.score ||
    ({ feature: 0, quiz: 1, model: 2 }[a.kind] - { feature: 0, quiz: 1, model: 2 }[b.kind]) || a.title.localeCompare(b.title, locale));
  // An exact title/tool match should not be buried among incidental body words.
  const top = results[0]?.score ?? 0;
  const cutoff = top >= 80 ? Math.max(40, top * .25) : 0;
  const seen = new Set<string>();
  return results.filter(item => {
    if (item.score < cutoff) return false;
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

export function searchHref(query: string) {
  return `/tim-kiem?q=${encodeURIComponent(query.trim().slice(0, 500))}`;
}
