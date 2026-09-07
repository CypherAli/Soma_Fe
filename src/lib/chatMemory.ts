import { API_URL, getToken } from "@/lib/auth";

/**
 * Bộ nhớ hội thoại của trợ lý — hai chế độ RẤT KHÁC NHAU.
 *
 *   Đã đăng nhập  -> lưu ở máy chủ theo TÀI KHOẢN (đổi máy, xoá cache, ẩn danh
 *                    thì mạch hội thoại vẫn còn), kèm bản localStorage để lúc
 *                    mất mạng hay phiên hết hạn vẫn đọc được bản gần nhất.
 *   Chưa đăng nhập -> CHỈ giữ trong bộ nhớ trang. Chuyển trang trong ứng dụng
 *                    thì còn, F5 là mất sạch. KHÔNG ghi localStorage: hội thoại
 *                    y khoa của khách không có lý do gì nằm lại trên máy — máy
 *                    chung, máy phòng thực hành là chuyện thường ở trường y.
 *
 * Khách còn bị giới hạn GUEST_LIMIT câu mỗi phiên, hết thì mời đăng nhập. Bộ
 * đếm nằm cùng chỗ với hội thoại (trong bộ nhớ trang) nên F5 là được 2 câu mới
 * — đúng như thiết kế: đây là hàng rào mềm để mời tạo tài khoản, không phải
 * cơ chế chống lách.
 */

export type Turn = { role: "user" | "bot"; text: string };

/* Giữ nguyên khoá cũ: đổi tên khoá là xoá trắng lịch sử của người đã đăng nhập. */
const LOCAL_KEY = "soma3d-bot-history";
/** Đủ dài để nối mạch, đủ ngắn để không nặng localStorage. */
const LOCAL_LIMIT = 12;

/** Số câu khách được hỏi trước khi mời đăng nhập. */
export const GUEST_LIMIT = 2;

/* Sống theo vòng đời của tab: reload trang là module nạp lại, hai biến này về
   giá trị đầu. Đó chính là hành vi mong muốn cho chế độ khách. */
let guestTurns: Turn[] = [];
let guestAsked = 0;

export const isGuest = () => !getToken();

/** Số câu khách còn được hỏi trong phiên này (đã đăng nhập thì không giới hạn). */
export function guestQuotaLeft(): number {
  if (!isGuest()) return Infinity;
  return Math.max(0, GUEST_LIMIT - guestAsked);
}

/** Gọi ngay trước khi gửi câu hỏi của khách. */
export function countGuestQuestion() {
  if (isGuest()) guestAsked += 1;
}

function readLocal(): Turn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as Turn[]) : [];
  } catch {
    return []; // dữ liệu cũ hỏng thì bỏ, không chặn bot khởi động
  }
}

function writeLocal(turns: Turn[]) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(turns.slice(-LOCAL_LIMIT)));
  } catch {
    /* hết dung lượng thì thôi */
  }
}

function dropLocal() {
  try {
    window.localStorage.removeItem(LOCAL_KEY);
  } catch {
    /* không sao */
  }
}

/**
 * Nạp hội thoại.
 *
 * Khách: trả về đúng những gì đã hỏi trong tab này, đồng thời DỌN khoá cũ —
 * bản trước có ghi localStorage cho khách, nên máy nào từng dùng vẫn còn tồn
 * lịch sử; không xoá thì lời hứa "thoát ra là hết" chỉ đúng với máy mới.
 */
export async function loadMemory(): Promise<Turn[]> {
  const token = getToken();
  if (!token) {
    dropLocal();
    return guestTurns;
  }
  try {
    const res = await fetch(`${API_URL}/chat-memory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`http ${res.status}`);
    const data = (await res.json()) as { turns?: Turn[] };
    const turns = data.turns ?? [];
    writeLocal(turns);
    return turns;
  } catch {
    return readLocal();
  }
}

/**
 * Lưu hội thoại. Không chờ máy chủ trả lời: người dùng vừa gõ xong câu tiếp
 * theo thì việc lưu chỉ là chuyện hậu trường, hỏng cũng không được chặn họ.
 */
export function saveMemory(turns: Turn[]) {
  const token = getToken();
  if (!token) {
    guestTurns = turns.slice(-LOCAL_LIMIT);
    return;
  }
  writeLocal(turns);
  void fetch(`${API_URL}/chat-memory`, {
    method: "PUT",
    headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ turns }),
  }).catch(() => {
    /* mất mạng thì bản localStorage phía trên vẫn giữ được */
  });
}

/**
 * Xoá hội thoại ở mọi nơi đang giữ nó.
 *
 * KHÔNG reset bộ đếm của khách: nút "Xoá hội thoại" mà cấp lại lượt hỏi thì
 * giới hạn 2 câu thành vô nghĩa.
 */
export function clearMemory() {
  guestTurns = [];
  dropLocal();
  const token = getToken();
  if (!token) return;
  void fetch(`${API_URL}/chat-memory`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}
