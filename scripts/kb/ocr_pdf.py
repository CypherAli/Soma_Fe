"""OCR sách scan tiếng Việt ra JSONL, CHẠY TIẾP ĐƯỢC khi bị dừng giữa chừng.

    python scripts/kb/ocr_pdf.py <file.pdf> <out.jsonl> [--dpi 300] [--from 0] [--to 999999]

Bốn quyển trong "tài liệu y khoa" là ảnh scan, không có lớp text: Netter,
Bệnh học nội khoa 1+2, Sinh lý học. Muốn dùng nội dung phải OCR trước.

Vì sao ghi JSONL mỗi trang một dòng chứ không ghi một file text lớn: sách
2297 trang chạy mất ~2,5 giờ, đứt mạng hay đóng máy giữa chừng là mất hết.
Kiểu này chạy lại chỉ làm tiếp những trang còn thiếu.

Cần: Tesseract + gói tiếng Việt (vie.traineddata). Đặt TESSDATA_PREFIX trỏ
tới thư mục chứa file đó nếu không ghi được vào Program Files.
"""
import argparse
import json
import os
import sys
import time

import pymupdf
import pytesseract
from PIL import Image

TESSERACT = os.environ.get("TESSERACT_EXE", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
TESSDATA = os.environ.get("TESSDATA_PREFIX", os.path.expanduser(r"~\tessdata"))


def done_pages(path: str) -> set:
    """Các trang đã OCR xong ở lần chạy trước."""
    if not os.path.exists(path):
        return set()
    got = set()
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            try:
                got.add(json.loads(line)["page"])
            except Exception:
                continue          # dòng ghi dở do bị ngắt giữa chừng
    return got


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("out")
    ap.add_argument("--dpi", type=int, default=300)
    ap.add_argument("--lang", default="vie")
    ap.add_argument("--from", dest="start", type=int, default=0)
    ap.add_argument("--to", dest="end", type=int, default=10 ** 9)
    a = ap.parse_args()

    pytesseract.pytesseract.tesseract_cmd = TESSERACT
    os.environ["TESSDATA_PREFIX"] = TESSDATA

    doc = pymupdf.open(a.pdf)
    last = min(len(doc) - 1, a.end)
    skip = done_pages(a.out)
    todo = [p for p in range(a.start, last + 1) if p not in skip]
    print(f"{os.path.basename(a.pdf)}: {len(doc)} trang | da xong {len(skip)} | can lam {len(todo)}", flush=True)

    t0 = time.time()
    with open(a.out, "a", encoding="utf-8") as fh:
        for i, p in enumerate(todo, 1):
            pix = doc[p].get_pixmap(dpi=a.dpi)
            img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            try:
                text = pytesseract.image_to_string(img, lang=a.lang)
            except Exception as e:
                text = ""
                print(f"  trang {p+1} LOI: {e}", flush=True)
            fh.write(json.dumps({"page": p + 1, "text": text.strip()}, ensure_ascii=False) + "\n")
            fh.flush()            # ghi ngay, đừng đệm — đứt là mất
            if i % 20 == 0 or i == len(todo):
                spent = time.time() - t0
                eta = spent / i * (len(todo) - i)
                print(f"  {i}/{len(todo)} trang | {spent/i:.1f}s/trang | con ~{eta/60:.0f} phut", flush=True)
    doc.close()
    print("XONG", a.out, flush=True)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
