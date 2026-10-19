/** Object identities are local to a bundle; no request data is kept here. */
const bindings = new WeakMap<object, string>();

export function bindContentSource<T>(id: string, value: T): T {
  function visit(item: unknown, path: string) {
    if (!item || typeof item !== 'object' || bindings.has(item)) return;
    const prototype = Object.getPrototypeOf(item);
    if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== null) return;
    bindings.set(item, path);
    for (const [key, child] of Object.entries(item)) visit(child, `${path}/${key}`);
  }
  visit(value, id);
  return value;
}

export function contentSourceId(value: object) { return bindings.get(value); }

export function contentTextKey(value: string) {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return `t${(hash >>> 0).toString(36)}_${value.length}`;
}
