// Named model actions are resolved against the catalog, never guessed by an LLM.
export function modelVoiceCommand(raw, catalog, normalize, resolveTarget) {
  const words = raw.replace(/°/g, ' độ ').replace(/[^\p{L}\p{N}\s-]/gu, ' ').trim().split(/\s+/);
  const text = normalize(words.join(' '));
  if (/\b(khong|dung|do not|dont|don t|never)\b/.test(text) || /-\s*\d/.test(raw)) return null;
  const resolve = query => {
    const name = query.replace(/^(?:giải phẫu|giai phau|mô hình|mo hinh|the|model)\s+/i, '').replace(/\s+model$/i, '');
    return resolveTarget(name, catalog, [], true);
  };
  const split = text.match(/^(tach giai phau|tach mo hinh|tach lop|tach roi|explode|separate) (.+)$/);
  if (split) {
    const model = resolve(words.slice(split[1].split(' ').length).join(' '));
    return model ? { type: 'explode', modelId: model.id } : null;
  }
  if (!/^(xoay|quay|rotate|turn) .+ (do|degrees?)$/.test(text)) return null;
  const body = words.slice(1, -1);
  const units = { khong: 0, mot: 1, hai: 2, ba: 3, bon: 4, tu: 4, nam: 5, lam: 5, sau: 6, bay: 7, tam: 8, chin: 9 };
  function number(tokens) {
    const value = normalize(tokens.join(' '));
    if (/^\d+$/.test(value)) return Number(value);
    let rest = value.split(' '), result = 0;
    if (rest.length >= 2 && rest[1] === 'tram' && rest[0] in units) {
      result = units[rest[0]] * 100;
      rest = rest.slice(2);
      if (['linh', 'le'].includes(rest[0])) rest = rest.slice(1);
      if (!rest.length) return result;
    }
    if (rest.length === 1 && rest[0] in units) return result + units[rest[0]];
    if (rest[0] === 'muoi' && rest.length <= 2 && (rest.length === 1 || rest[1] in units)) return result + 10 + (units[rest[1]] ?? 0);
    if (rest.length >= 2 && rest.length <= 3 && rest[0] in units && units[rest[0]] >= 2 && rest[1] === 'muoi' && (rest.length === 2 || rest[2] in units)) return result + units[rest[0]] * 10 + (units[rest[2]] ?? 0);
    return null;
  }
  // Prefer the longest valid spoken number ("ba mươi" rather than "mươi").
  for (let count = Math.min(7, body.length); count >= 1; count--) {
    const degrees = number(body.slice(-count));
    if (degrees === null || degrees <= 0 || degrees > 360) continue;
    let target = body.slice(0, -count), sign = 1;
    const direction = normalize(target.join(' ')).match(/(?:^| )((?:sang )?(?:trai|phai)|left|right)$/);
    if (direction) {
      sign = /trai|left/.test(direction[1]) ? -1 : 1;
      target = target.slice(0, -direction[1].split(' ').length);
    }
    const model = target.length ? resolve(target.join(' ')) : null;
    if (target.length && !model) continue;
    return { type: 'rotateDegrees', degrees: degrees * sign, ...(model ? { modelId: model.id } : {}) };
  }
  return null;
}
