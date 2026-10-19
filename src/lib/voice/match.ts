/**
 * KHỚP LỆNH GIỌNG NÓI — phần thuần, không React, kiểm thử bằng node
 * (`npm run test:voice`).
 *
 * Vì sao khớp bằng LUẬT chứ không hỏi mô hình ngôn ngữ:
 *   • Lệnh phải chạy NGAY (bật lớp, tách lớp) — một vòng mạng tới LLM là trễ
 *     cả giây trong lúc người dùng đang nhìn mô hình.
 *   • Máy chủ không có khoá AI thì trợ lý chỉ còn trích nguyên văn; lệnh giọng
 *     nói không được chết theo.
 *   • Lệnh làm THAY ĐỔI giao diện. Luật thì đoán được và kiểm được; mô hình
 *     ngôn ngữ thỉnh thoảng "hiểu sáng tạo" — bật nhầm thứ không ai yêu cầu.
 * Câu nào không khớp lệnh thì mới chuyển cho trợ lý như một câu hỏi.
 *
 * Nhận dạng giọng nói của trình duyệt trả chữ CÓ DẤU, KHÔNG DẤU hay sai dấu tuỳ
 * máy ("bật lớp cơ" / "bat lop co" / "bậc lớp cơ"), nên mọi so khớp đều làm trên
 * chữ đã bỏ dấu.
 */

export type VoiceResult = { ok: boolean; say: string };

export type VoiceAction = {
  id: string;
  /** Match the whole request, allowing only a courtesy prefix/suffix. */
  exact?: boolean;
  /**
   * Mẫu câu, viết tự nhiên (có dấu cũng được — sẽ được chuẩn hoá). "{x}" là chỗ
   * tham số: "bật lớp {x}" khớp "bật lớp cơ gấp duỗi" với x = "cơ gấp duỗi".
   */
  phrases: string[];
  run: (arg: string) => VoiceResult | void | Promise<VoiceResult | void>;
};

/** Chữ thường, bỏ dấu (kể cả đ), bỏ dấu câu, gộp khoảng trắng. */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CJK = /[㐀-鿿]/;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Chứa trọn cụm từ, KHÔNG khớp giữa chừng một từ khác: "an" không được khớp
 * trong "ban tay". Tiếng Trung không có khoảng trắng giữa từ nên so chứa thẳng.
 */
function containsPhrase(text: string, phrase: string): boolean {
  if (!phrase) return false;
  if (CJK.test(phrase)) return text.includes(phrase);
  return ` ${text} `.includes(` ${phrase} `);
}

export type Matched = { action: VoiceAction; arg: string; score: number };

/**
 * Lấy lại tham số theo CHỮ GỐC CÒN DẤU. Khớp mẫu làm trên chữ đã bỏ dấu, nhưng
 * bỏ dấu thì tiếng Việt mất phân biệt: "mắt"/"mặt" cùng ra "mat", "cơ"/"cổ" cùng
 * ra "co". Chuẩn hoá không thêm bớt từ, nên từ thứ i của bản bỏ dấu đúng là từ
 * thứ i của câu gốc — ghép lại theo vị trí là ra tham số còn dấu.
 */
function rawArg(raw: string, text: string, charStart: number, arg: string): string {
  if (CJK.test(arg)) return arg;
  const rawTokens = keepTokens(raw);
  const normTokens = text.split(" ");
  if (rawTokens.length !== normTokens.length) return arg;
  const start = text.slice(0, charStart).split(" ").filter(Boolean).length;
  return rawTokens.slice(start, start + arg.split(" ").length).join(" ");
}

/** Chữ thường CÒN DẤU, bỏ dấu câu, tách từ. */
function keepTokens(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Tìm lệnh khớp nhất. Mẫu DÀI hơn thắng: "bật lớp {x}" phải thắng "bật {x}",
 * "tách lớp" phải thắng "tách". Hoà điểm thì lệnh đăng ký TRƯỚC thắng — trang
 * đăng ký lệnh riêng của nó trước lệnh chung, nên "mở khuỷu" ở trang Vision AI
 * mở ngay trong trang chứ không chuyển sang thư viện.
 */
export function matchCommand(transcript: string | string[], actions: VoiceAction[]): Matched | null {
  // Nhiều PHƯƠNG ÁN NGHE (maxAlternatives): tiếng Việt hay bị nghe lệch dấu ở
  // phương án đầu ("bậc lớp cơ") trong khi phương án thứ hai đúng ("bật lớp cơ").
  // Phương án nào khớp được lệnh trước thì dùng phương án đó.
  if (Array.isArray(transcript)) {
    for (const t of transcript) {
      const m = matchCommand(t, actions);
      if (m) return m;
    }
    return null;
  }
  const original = transcript;
  const polite = transcript.trim().replace(/^(soma\s*(ơi|oi)?\s*|please\s+)/i, "").replace(/\s+(giúp mình|giup minh|please|nhé|nhe)$/i, "").trim();
  let text = norm(transcript);
  if (!text) return null;
  let best: Matched | null = null;
  for (const action of actions) {
    const request = action.exact ? polite : original;
    text = norm(request);
    for (const raw of action.phrases) {
      const p = norm(raw.replace("{x}", " XARG "));
      let hit: { arg: string; score: number } | null = null;
      if (p.includes("xarg")) {
        const [before, after] = p.split("xarg").map((s) => s.trim());
        const sep = CJK.test(before + after) ? "\\s*" : "\\s+";
        const head = before ? `${action.exact ? "^" : "(?:^|\\s)"}${esc(before)}${sep}` : "^";
        const tail = after ? `${sep}${esc(after)}${action.exact ? "$" : "(?:\\s|$)"}` : "$";
        const m = text.match(new RegExp(`${head}(.+?)${tail}`));
        const arg = m?.[1]?.trim() ?? "";
        if (m && arg) {
          const start = m.index! + m[0].indexOf(m[1]);
          hit = { arg: rawArg(request, text, start, arg), score: before.length + after.length };
        }
      } else if (action.exact ? text === p : containsPhrase(text, p)) {
        // Lệnh không tham số được cộng nửa điểm: "tách lớp" (không tham số) phải
        // thắng "tách {x}" khi người dùng nói đúng "tách lớp".
        hit = { arg: "", score: p.length + 0.5 };
      }
      if (hit && (!best || hit.score > best.score)) best = { action, ...hit };
    }
  }
  return best;
}

/** Từ đệm hay đi kèm tên khi nói ("lớp cơ", "cái mô hình tim", "the heart model"). */
const FILLER = new Set([
  "lop", "cai", "phan", "bai", "mo", "hinh", "trang", "vung", "nhom", "cua", "toi", "minh", "di", "nhe", "a",
  // Từ đệm lịch sự rất hay đi CUỐI câu nói tiếng Việt: "bật lớp cơ giúp mình nha".
  "giup", "gium", "dum", "nha", "nhen", "oi", "luon", "ngay", "ne", "soma", "xem",
  "the", "layer", "layers", "model", "page", "please", "a", "an", "my",
  "层", "模型", "页面", "的",
]);

/**
 * Từ đệm TRÙNG VỚI THUẬT NGỮ khi bỏ dấu: hộ/HỐ (hố khuỷu), nào/NÃO, hả/HẠ (hạ đồi),
 * với/VÒI (vòi nhĩ), cho/CHÓ. Bỏ theo chữ đã bỏ dấu thì "mở mô hình não" thành
 * rỗng và "Hố khuỷu" bị đọc thành "khuỷu" (đã bắt được bằng câu thử thật). Nên
 * những từ này CHỈ bị bỏ khi còn đúng dấu của từ đệm.
 */
const FILLER_EXACT = new Set(["hộ", "nào", "hả", "với", "cho"]);
const isFiller = (w: string) => FILLER.has(norm(w)) || FILLER_EXACT.has(w);

function strip(s: string): string {
  const n = norm(s);
  if (CJK.test(n)) return n.replace(/层|模型|页面|的/g, "").trim();
  const toks = keepTokens(s);
  const kept = toks.filter((w) => !isFiller(w));
  // Cả cụm toàn từ đệm thì giữ nguyên — trả chuỗi rỗng là mất luôn lệnh.
  return (kept.length ? kept : toks).map(norm).join(" ");
}

export type Named<K extends string = string> = { key: K; names: string[] };

/**
 * Chữ CHUNG của tên bài — không nói lên bài nào. Chỉ bỏ khi so theo kiểu "trùng
 * sau khi bỏ chữ chung"; so trùng TRỌN TÊN vẫn giữ nguyên, nên nói đủ "giải phẫu
 * cánh tay" vẫn mở đúng bài "Giải phẫu cánh tay".
 */
const GENERIC = new Set(["giai", "phau", "hoc", "theo", "tong", "quan", "anatomy", "by", "of"]);
function stripGeneric(s: string): string {
  return s
    .split(" ")
    .filter((w) => !GENERIC.has(w))
    .join(" ");
}

function keepWords(s: string): string {
  return keepTokens(s).filter((w) => !isFiller(w)).join(" ");
}

function accentMatch(arg: string, name: string): boolean {
  const a = keepWords(arg);
  const n = keepWords(name);
  return !!a && !CJK.test(a) && (a === n || ` ${n} `.includes(` ${a} `));
}

/**
 * Chọn mục có TÊN gần nhất với phần tham số người dùng nói ("cơ" → lớp "Cơ
 * gấp–duỗi" nếu chỉ có một lớp cơ). Trả `null` khi không đủ chắc — thà hỏi lại
 * còn hơn bật nhầm.
 */
export function bestByName<K extends string>(
  arg: string,
  items: Named<K>[],
  /**
   * Khi HAI MỤC KHỚP NGANG NHAU mà cả hai đều hợp lệ (vd "cánh tay" khớp cả
   * "Giải phẫu cánh tay" lẫn "Cánh tay — học theo lớp"), mục có điểm ưu tiên cao
   * hơn thắng thay vì trả null. Không truyền thì hoà vẫn là mơ hồ.
   */
  prefer?: (key: K) => number,
): K | null {
  const q = strip(arg);
  if (!q) return null;
  const qWords = q.split(" ");
  const qg = stripGeneric(q);
  let best: { key: K; score: number } | null = null;
  let tie = false;
  let tied: K[] = [];
  for (const item of items) {
    let score = 0;
    for (const name of item.names) {
      const n = strip(name);
      if (!n) continue;
      let s = 0;
      if (n === q) s = 3;
      // Trùng khi bỏ CHỮ CHUNG của tên bài ("giải phẫu", "học theo lớp"): "cánh tay"
      // phải khớp trọn "Giải phẫu cánh tay" và "Cánh tay — học theo lớp", chứ không
      // để bài "Cơ Cánh tay" thắng chỉ vì tên nó ngắn hơn (đã thấy khi thử câu thật).
      else if (qg && stripGeneric(n) === qg) s = 2.9;
      // Chứa theo RANH GIỚI TỪ (containsPhrase), không phải chuỗi con: "tim" không
      // được khớp vào giữa một từ khác chỉ vì trùng mấy chữ cái.
      else if (containsPhrase(n, q) || containsPhrase(q, n)) s = 2 + (0.8 * Math.min(n.length, q.length)) / Math.max(n.length, q.length);
      else if (!CJK.test(n)) {
        const nWords = new Set(n.split(" "));
        const overlap = qWords.filter((w) => nWords.has(w)).length;
        s = overlap / Math.max(qWords.length, nWords.size);
      }
      // Trùng cả DẤU thì hơn một bậc nhỏ: "mắt" phải ra Mắt chứ không hoà với Mặt.
      // Câu bị nghe lệch dấu thì không được cộng, nhưng vẫn khớp như trước.
      if (s > 0 && accentMatch(arg, name)) s += 0.25;
      score = Math.max(score, s);
    }
    if (score <= 0) continue;
    if (!best || score > best.score + 1e-9) {
      best = { key: item.key, score };
      tie = false;
      tied = [item.key];
    } else if (Math.abs(score - best.score) < 1e-9 && item.key !== best.key) {
      tie = true;
      tied.push(item.key);
    }
  }
  if (!best || best.score < 0.5) return null;
  // Hai mục khớp y như nhau ("cơ" khi có cả "Cơ gấp–duỗi" lẫn "Cơ sấp–ngửa")
  // là mơ hồ thật — không tự chọn bừa một cái.
  if (tie && prefer) {
    const top = Math.max(...tied.map(prefer));
    const winners = tied.filter((k) => prefer(k) === top);
    if (winners.length === 1) return winners[0];
  }
  if (tie && best.score < 3) return null;
  return best.key;
}

/** Mọi mục có tên CHỨA trọn cụm từ `q` (theo ranh giới từ). */
function allContaining<K extends string>(q: string, items: Named<K>[]): K[] {
  if (!q) return [];
  return items
    .filter((item) => item.names.some((name) => {
      const n = strip(name);
      return !!n && (n === q || containsPhrase(n, q));
    }))
    .map((item) => item.key);
}

/**
 * Chọn MỘT hoặc NHIỀU mục — dùng cho lệnh bật/tắt LỚP.
 *
 * Người Việt nói "bật lớp cơ" khi bài có "Cơ gấp–duỗi" và "Cơ sấp–ngửa" là muốn
 * bật CẢ HAI — không phải câu mơ hồ. Nên: khớp đúng một mục thì lấy mục đó;
 * không thì lấy mọi mục chứa cụm từ; vẫn không có thì thử TỪNG TỪ của câu (từ dài
 * trước), để "động mạch" vẫn tìm ra lớp "Mạch máu".
 */
export function resolveMany<K extends string>(arg: string, items: Named<K>[]): K[] {
  const one = bestByName(arg, items);
  if (one) return [one];
  const q = strip(arg);
  const all = allContaining(q, items);
  if (all.length) return all;
  if (CJK.test(q)) return [];
  const words = [...new Set(q.split(" "))].filter((w) => w.length >= 2).sort((a, b) => b.length - a.length);
  for (const w of words) {
    const hit = allContaining(w, items);
    if (hit.length) return hit;
  }
  return [];
}

/**
 * Câu nói ở chế độ rảnh tay có GỌI TÊN trợ lý không, và phần hỏi sau tên.
 * Nhận dạng tiếng Việt hiếm khi ra đúng chữ "Soma": hay ra "sô ma", "xô ma",
 * "sổ mà", "sơ ma" — so trên chữ đã bỏ dấu thì các biến thể ấy trùng nhau.
 */
export function wakeQuestion(transcript: string): string | null {
  const m = norm(transcript).match(/^(?:soma|so ma|xo ma|sho ma|thoma|hoi soma|hoi|ask|问)(?: oi)?\s+(.+)$/);
  if (!m) return null;
  // Trả lại phần hỏi theo CHỮ GỐC (còn dấu) để trợ lý hiểu đúng nghĩa.
  const words = transcript.trim().split(/\s+/);
  const skip = norm(transcript).split(" ").length - m[1].split(" ").length;
  return words.slice(skip).join(" ") || m[1];
}
