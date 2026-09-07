import { Fragment, type ReactNode } from "react";

/**
 * Hiển thị câu trả lời của trợ lý.
 *
 * VÌ SAO CẦN: mô hình trả về chữ có đánh dấu Markdown ("**4 buồng**") và số
 * trích dẫn ("[1][2]"). Trước đây phần này đổ thẳng vào <p>, nên người dùng
 * đọc được đúng những dấu sao đó trên màn hình — nhìn như chat chưa làm xong.
 *
 * Chọn tự dựng thay vì kéo thêm thư viện Markdown: đầu vào chỉ là văn xuôi y
 * khoa với đậm, nghiêng, gạch đầu dòng và số trích dẫn. Một thư viện đầy đủ
 * kéo theo cả bảng, ảnh, HTML thô — toàn thứ không dùng tới mà lại mở thêm
 * đường cho nội dung mô hình sinh ra chèn thẻ vào trang.
 *
 * KHÔNG dùng dangerouslySetInnerHTML ở đây, và đừng đổi sang cách đó: chữ này
 * do mô hình sinh ra từ tư liệu, tức là dữ liệu không tin cậy hoàn toàn.
 */

/** Bỏ mọi dấu Markdown và số trích dẫn — dùng cho phần đọc thành tiếng. */
export function plainText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(^|[\s(])[*_](\S(?:.*?\S)?)[*_]([\s).,;:!?]|$)/g, "$1$2$3")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[\d+\]/g, "") // "[1][2]" đọc thành "một hai" thì rất khó nghe
    .replace(/^\s*[-•*]\s+/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Đậm, nghiêng, mã và số trích dẫn trong một dòng. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Một biểu thức duy nhất cho mọi kiểu đánh dấu: quét một lượt thì thứ tự ưu
  // tiên rõ ràng, không có chuyện lượt sau cắt vào kết quả của lượt trước.
  const pattern = /\*\*(.+?)\*\*|(?<![*\w])[*_](\S(?:.*?\S)?)[*_](?![*\w])|`(.+?)`|\[(\d+)\]/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;
    if (match[1] !== undefined) out.push(<strong key={key}>{match[1]}</strong>);
    else if (match[2] !== undefined) out.push(<em key={key}>{match[2]}</em>);
    else if (match[3] !== undefined) out.push(<code key={key}>{match[3]}</code>);
    // Số trích dẫn thu nhỏ lên trên: vẫn đọc được là nguồn nào, nhưng không
    // còn cắt ngang mạch câu như "[1][2]" giữa dòng chữ.
    else out.push(<sup key={key} className="soma-cite">{match[4]}</sup>);
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const BULLET = /^\s*[-•*]\s+(.*)$/;
const NUMBER = /^\s*(\d+)[.)]\s+(.*)$/;

/**
 * Gom các dòng thành đoạn văn và danh sách.
 *
 * Dòng trống ngăn đoạn; các dòng gạch đầu dòng liền nhau gộp thành một danh
 * sách chứ không thành mỗi dòng một đoạn.
 */
export default function AnswerText({ text }: { text: string }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length === 0) return;
    const key = `p${blocks.length}`;
    blocks.push(<p key={key}>{inline(para.join(" "), key)}</p>);
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    const key = `l${blocks.length}`;
    const items = list.items.map((item, index) => (
      <li key={`${key}-${index}`}>{inline(item, `${key}-${index}`)}</li>
    ));
    blocks.push(
      list.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>,
    );
    list = null;
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBER.exec(line);
    if (bullet || numbered) {
      flushPara();
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet ? bullet[1] : numbered![2]).trim());
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();

  return <div className="soma-answer">{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
