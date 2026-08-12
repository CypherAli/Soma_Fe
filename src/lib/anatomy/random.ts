/**
 * Ngẫu nhiên CÓ HẠT, dùng chung cho cả ba nguồn đề (`quiz.ts`, `examBank.ts`,
 * `atlasBank.ts`).
 *
 * Cùng một hạt phải cho ra cùng một đề: người học làm lại đúng đề cũ để đối
 * chiếu, và bản dựng trên máy chủ với bản chạy trên trình duyệt không được lệch
 * nhau. Vì vậy KHÔNG dùng `Math.random()` ở khâu sinh đề.
 */

/** xorshift32 — nhỏ, không phụ thuộc môi trường, đủ ngẫu nhiên để trộn đề. */
export function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** Fisher-Yates trên bản sao — mảng nguồn giữ nguyên. */
export function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
