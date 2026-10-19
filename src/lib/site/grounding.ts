/** Reject unusable model citations; factual correctness still requires source review. */
export function hasValidCitations(answer: string, sourceCount: number): boolean {
  const citations = [...answer.matchAll(/\[(\d+)\]/g)].map(match => Number(match[1]));
  return citations.length > 0 && citations.every(index => index >= 1 && index <= sourceCount);
}

export function isUnsupportedTask(question: string): boolean {
  const q = question.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
  return /\b(viet|write|generate|lap trinh)\s+(?:(?:a|the|mot|bai)\s+)?(code|ma|script|poem|tho)\b/.test(q) ||
    /\b(giai|solve)\s+(?:(?:a|the|mot|bai)\s+)?(toan|equation|math)\b/.test(q);
}

/** Explicit product questions can use public system data without a medical lookup. */
export function isSystemNavigationQuestion(question: string): boolean {
  if (isUnsupportedTask(question)) return false;
  const q = question.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
  const clinical = q.replace(/\bo dau\b/g, "").replace(/\bmo hinh dau\b/g, "mo hinh head");
  if (/\b(dau|trieu chung|dieu tri|chan doan|pain|symptom|treatment|diagnos\w*)\b|症状|治疗|诊断/.test(clinical)) return false;
  return /\b(soma|web|website|quiz|pdf|word|trac nghiem|bo de|on thi|mo hinh|vision ai|cu chi|chuyen mo hinh|doi mo hinh|dang nhap|lich on|bao nhieu cau|model|gesture|thumbs up)\b|网站|测验|题库|模型|手势/.test(q);
}
