// QUYỀN GỬI ẢNH LÊN GPU — một kho nhỏ ngoài React, đọc/ghi localStorage.
//
// Vì sao KHÔNG để thẳng trong useState:
//  • Đọc localStorage ngay trong initializer thì máy chủ dựng ra "chưa chọn"
//    còn trình duyệt dựng ra "đã đồng ý" → React báo lỗi hydration và vứt cả
//    cây HTML của máy chủ đi.
//  • Đọc trong useEffect rồi setState thì vi phạm luật react-compiler của dự án
//    (setState trong effect gây render dây chuyền).
//  `useSyncExternalStore` sinh ra đúng cho tình huống này: có ảnh chụp riêng cho
//  máy chủ (luôn là "chưa chọn"), và trình duyệt tự đồng bộ lại sau khi gắn.
//
// Kho còn nghe sự kiện `storage` nên mở hai tab thì tắt quyền ở tab này, tab kia
// cũng ngừng gửi ảnh — quyền riêng tư phải có hiệu lực ngay, không đợi tải lại.

const KEY = "soma.vision.consent";

/** null = chưa từng chọn (KHÔNG được hiểu là đồng ý). */
export type Consent = boolean | null;

let cached: Consent | undefined;
const listeners = new Set<() => void>();

function read(): Consent {
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved === "yes" ? true : saved === "no" ? false : null;
  } catch {
    // Cửa sổ ẩn danh hoặc trình duyệt chặn lưu trữ — vẫn chạy, chỉ là không nhớ.
    return null;
  }
}

function emit(): void {
  for (const l of listeners) l();
}

export function subscribeConsent(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cached = undefined;
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Ảnh chụp phía trình duyệt. Phải trả về giá trị NGUYÊN THUỶ ổn định. */
export function getConsent(): Consent {
  if (cached === undefined) cached = read();
  return cached;
}

/** Ảnh chụp phía máy chủ: luôn "chưa chọn" — máy chủ không biết gì về máy người dùng. */
export function getServerConsent(): Consent {
  return null;
}

export function setConsent(value: boolean): void {
  cached = value;
  try {
    window.localStorage.setItem(KEY, value ? "yes" : "no");
  } catch {
    /* không lưu được thì thôi, lựa chọn vẫn có hiệu lực trong phiên này */
  }
  emit();
}
