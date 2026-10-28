/** Detail views stay directly selectable without extending the quick cycle. */
export function nextModelIndex(catalog, current, step = 1, pending = null) {
  if (!catalog.length) return -1;
  const origin = pending?.index ?? current;
  const direction = step < 0 ? -1 : 1;
  for (let offset = 1; offset <= catalog.length; offset++) {
    const index = ((origin + direction * offset) % catalog.length + catalog.length) % catalog.length;
    if (!catalog[index].detailOf) return index;
  }
  return ((origin % catalog.length) + catalog.length) % catalog.length;
}
