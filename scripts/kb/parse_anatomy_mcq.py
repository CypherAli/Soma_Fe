"""Bóc bộ câu hỏi trắc nghiệm giải phẫu từ PDF giáo trình ra JSON.

    python scripts/kb/parse_anatomy_mcq.py <file.pdf> <out.json>

Quyển "Giải Phẫu Người - ĐH Y Hà Nội" có Phần III là ngân hàng trắc nghiệm:
mỗi phần cơ thể gồm một vùng ĐỀ (câu hỏi + phương án A–E) rồi tới một vùng
ĐÁP ÁN dạng "29-C. <lời giải>". Script ghép hai vùng đó lại thành câu hỏi
hoàn chỉnh có sẵn đáp án và lời giải.

BA CÁI KHÓ CỦA BẢN OCR NÀY, xử lý ở dưới:
 1. phương án nằm CHUNG MỘT DÒNG với nhau ("A. Cơ may B. Cơ rộng trong c Cơ
    khép dài") — phải tách bằng regex chứ không tách theo dòng;
 2. chữ C hay bị OCR thành "c" thường, và dấu chấm sau nó thành khoảng trắng;
 3. có dạng câu "ghép nối" (câu 24–28 dùng chung một danh sách phương án đặt
    trước) — nhóm này KHÔNG có phương án riêng nên bị bỏ, đánh dấu để biết.
"""
import json
import re
import sys
import unicodedata

from pypdf import PdfReader

# ---- chuẩn hoá text OCR -------------------------------------------------

# Lỗi OCR ĐÃ THẤY TẬN MẮT trong bản này. Chỉ liệt kê dạng không thể nhầm sang
# từ khác trong văn cảnh giải phẫu — không tự động "đoán" dấu, sai còn tệ hơn.
OCR_FIX = [
    ("Mỏ tả", "Mô tả"), ("mỏ tả", "mô tả"), ("Mò tả", "Mô tả"), ("mò tả", "mô tả"),
    ("Mó tả", "Mô tả"), ("mó tả", "mô tả"), ("mô tá", "mô tả"),
    ("dáy chằng", "dây chằng"), ("dây chàng", "dây chằng"), ("bát chéo", "bắt chéo"),
    ("khớp gói", "khớp gối"), ("cảng tay", "cẳng tay"), ("cảng chân", "cẳng chân"),
    ("cẳng chán", "cẳng chân"), ("cãng mạc", "căng mạc"), ("câng mạc", "căng mạc"),
    ("đéu đúng", "đều đúng"), ("đềiL đúng", "đều đúng"), ("đàu đúng", "đều đúng"),
    ("sảy ra", "xảy ra"), ("thát hậu môn", "thắt hậu môn"), ("hậu món", "hậu môn"),
    ("mỏm vẹl", "mỏm vẹt"), ("ô mũi", "ổ mũi"), ("khe ổ mát", "khe ổ mắt"),
    ("mống mát", "mống mắt"), ("cơ vòng mát", "cơ vòng mắt"), ("TK giạng", "TK giạng"),
    ("nhiẽm trùng", "nhiễm trùng"), ("dẻ bị", "dễ bị"), ("ảnh hường", "ảnh hưởng"),
    ("trờ nên", "trở nên"), ("phâu thuật", "phẫu thuật"), ("dản đến", "dẫn đến"),
    ("gáy liệt", "gây liệt"), ("đáy?", "đây?"), ("sau đáy", "sau đây"),
    ("thanh hầu", "thanh hầu"), ("Vân động", "Vận động"), ("Đảy là", "Đây là"),
]


def fix_ocr(s: str) -> str:
    for bad, good in OCR_FIX:
        s = s.replace(bad, good)
    return s


def clean(s: str) -> str:
    s = unicodedata.normalize("NFC", s)
    s = s.replace(" ", " ")
    # OCR hay chèn khoảng trắng vào giữa các chữ viết tắt y khoa
    s = re.sub(r"\bĐ\s*M\b", "ĐM", s)
    s = re.sub(r"\bT\s*M\b", "TM", s)
    s = re.sub(r"\bT\s*K\b", "TK", s)
    s = re.sub(r"[ \t]+", " ", s)
    return fix_ocr(s)


PART_RE = re.compile(r"^\s*(\d)\.\s*(PHẦN|PHẨN)\s+([A-ZĐÀ-Ỹ\s\-–]+)$", re.M)
# "A. ..." / "c. ..." / "c ..." — chữ C thường là lỗi OCR quen thuộc
OPT_RE = re.compile(r"(?:(?<=^)|(?<=[\s]))([A-Ea-e])[\.\)]?\s+(?=[^\s])")
ANS_RE = re.compile(r"^\s*(\d{1,3})\s*[-–]\s*([A-Ea-e])[\.\s]", re.M)
Q_START_RE = re.compile(r"^\s*(\d{1,3})\.\s+(?=\D)", re.M)


def split_options(block: str):
    """Tách chuỗi '...A. x B. y c z' thành dict {A: x, B: y, C: z}."""
    marks = [(m.start(), m.group(1).upper(), m.end()) for m in OPT_RE.finditer(block)]
    # chỉ giữ dãy tăng dần A,B,C,D,E — tránh bắt nhầm chữ cái giữa câu
    seq, want = [], "A"
    for pos, letter, end in marks:
        if letter == want:
            seq.append((pos, letter, end))
            want = chr(ord(want) + 1)
    if len(seq) < 2:
        return {}, block.strip()
    stem = block[: seq[0][0]].strip()
    opts = {}
    for i, (pos, letter, end) in enumerate(seq):
        stop = seq[i + 1][0] if i + 1 < len(seq) else len(block)
        opts[letter] = re.sub(r"\s+", " ", block[end:stop]).strip(" .;")
    return opts, stem


def parse(pdf_path: str):
    reader = PdfReader(pdf_path)
    pages = [clean(p.extract_text() or "") for p in reader.pages]
    full = "\n".join(pages)

    # chỉ lấy từ chỗ bắt đầu ngân hàng câu hỏi
    # Bắt đầu từ CHÍNH dòng tiêu đề "1. PHẦN ..." chứ không phải từ chữ "PHẦN":
    # cắt vào giữa thì regex tách phần không thấy số thứ tự của phần đầu tiên
    # nên mất trọn phần CHI DƯỚI.
    m0 = re.search(r"^\s*1\.\s*(?:PHẦN|PHẨN)\s+CHI\s+DƯỚI", full, re.M)
    if not m0:
        raise SystemExit("Khong tim thay muc '1. PHAN CHI DUOI' — pdf khac cau truc?")
    body = full[m0.start():]

    # cắt theo từng phần cơ thể
    marks = [(m.start(), m.group(3).strip()) for m in PART_RE.finditer(body)]
    if not marks:
        marks = [(0, "CHI DƯỚI")]
    parts = []
    for i, (pos, name) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(body)
        parts.append((name, body[pos:end]))

    questions, stats = [], {"phan": len(parts), "co_dapan": 0, "thieu_dapan": 0, "bo_ghep_noi": 0}

    for part_name, chunk in parts:
        # vùng đáp án bắt đầu ở lần xuất hiện "N-X." đầu tiên
        first_ans = ANS_RE.search(chunk)
        q_zone = chunk[: first_ans.start()] if first_ans else chunk
        a_zone = chunk[first_ans.start():] if first_ans else ""

        # ---- đáp án + lời giải ----
        answers = {}
        hits = list(ANS_RE.finditer(a_zone))
        for i, m in enumerate(hits):
            stop = hits[i + 1].start() if i + 1 < len(hits) else len(a_zone)
            expl = re.sub(r"\s+", " ", a_zone[m.end():stop]).strip()
            expl = re.sub(r"<<<PAGE \d+>>>", "", expl).strip()
            answers[int(m.group(1))] = (m.group(2).upper(), expl)

        # ---- câu hỏi ----
        starts = list(Q_START_RE.finditer(q_zone))
        for i, m in enumerate(starts):
            num = int(m.group(1))
            stop = starts[i + 1].start() if i + 1 < len(starts) else len(q_zone)
            raw = q_zone[m.end():stop]
            raw = re.sub(r"<<<PAGE \d+>>>", " ", raw)
            opts, stem = split_options(raw)
            stem = re.sub(r"\s+", " ", stem).strip()
            # số trang chân trang hay dính vào cuối câu hỏi ("...nhất? 480")
            stem = re.sub(r"\s+\d{2,4}$", "", stem).strip()
            if len(opts) < 4 or len(stem) < 12:
                stats["bo_ghep_noi"] += 1      # câu ghép nối / câu bị OCR vỡ
                continue
            ans = answers.get(num)
            if ans:
                stats["co_dapan"] += 1
            else:
                stats["thieu_dapan"] += 1
            questions.append({
                "part": part_name,
                "number": num,
                "stem": stem,
                "options": opts,
                "answer": ans[0] if ans else None,
                "explanation": ans[1] if ans else None,
            })

    return questions, stats


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    src, dst = sys.argv[1], sys.argv[2]
    qs, st = parse(src)
    keep = [q for q in qs if q["answer"]]
    json.dump(keep, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"phan: {st['phan']}")
    print(f"boc duoc  : {len(qs)} cau")
    print(f"co dap an : {st['co_dapan']}  (ghi ra file)")
    print(f"thieu dap : {st['thieu_dapan']}")
    print(f"bo qua    : {st['bo_ghep_noi']} (cau ghep noi / OCR vo)")
