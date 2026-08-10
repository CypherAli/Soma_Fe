"""Dựng bộ câu hỏi ẢNH từ atlas giải phẫu: trích trang, khớp với cấu trúc 3D.

    python scripts/kb/build_atlas_shots.py <atlas.pdf> <netter.jsonl> <shots.json> <outdir>

Mỗi trang atlas là một bản vẽ có tiêu đề (đã OCR sẵn ở netter.jsonl). Script
khớp tiêu đề đó với nhãn tiếng Việt của các hotspot 3D; trang nào khớp thì
xuất ảnh ra web và ghi vào bảng tra, để câu hỏi "đây là vị trí nào?" có nút
mở đúng cấu trúc trên mô hình 3D.

KHỚP TÊN PHẢI ƯU TIÊN ĐÚNG DẤU. Bỏ dấu tiếng Việt gây nhập nhằng chết người:
"của" bỏ dấu thành "cua", đè lên "cửa" — nên "Các Tĩnh Mạch CỦA Vùng Miệng"
từng bị khớp nhầm thành "Tĩnh mạch CỬA". Vì thế chỉ khớp đúng dấu; bản không
dấu chỉ dùng để chuẩn hoá khoảng trắng và chữ hoa/thường.

Nguồn ảnh có bản quyền — bảng tra ghi kèm nhan đề sách và số trang để mọi ảnh
hiển thị trong ứng dụng đều dẫn được về đúng chỗ trong sách.
"""
import json
import os
import re
import sys
import unicodedata

import pymupdf
from PIL import Image

SOURCE = {
    "title": "Atlas Giải Phẫu Người — Frank H. Netter",
    "publisher": "Bản dịch tiếng Việt",
    "usage": "Ảnh dùng cho mục đích học tập trong đồ án; mỗi ảnh ghi rõ số trang nguồn.",
}


def norm(s: str) -> str:
    """Chuẩn hoá NHẸ: giữ nguyên dấu, chỉ gộp khoảng trắng và hạ chữ thường."""
    s = unicodedata.normalize("NFC", s or "")
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s


def page_title(text: str) -> str:
    for line in (text or "").split("\n"):
        line = line.strip()
        # bỏ dòng số trang, dòng quá ngắn, dòng toàn ký tự lạ
        if len(line) > 12 and not line[0].isdigit() and re.search(r"[a-zà-ỹ]", line.lower()):
            return line[:90]
    return ""


def main() -> None:
    pdf_path, ocr_path, shots_path, outdir = sys.argv[1:5]
    os.makedirs(outdir, exist_ok=True)

    facts = []
    for scene in json.load(open(shots_path, encoding="utf-8"))["scenes"]:
        for h in scene["hotspots"]:
            if h.get("label"):
                facts.append({
                    "label": h["label"], "n": norm(h["label"]),
                    "meshName": h["meshName"], "sceneSlug": scene["slug"], "key": h["key"],
                })
    # nhãn dài khớp trước: "Động mạch cảnh trong" phải thắng "Động mạch cảnh"
    facts.sort(key=lambda f: -len(f["n"]))

    pages = {}
    for line in open(ocr_path, encoding="utf-8"):
        r = json.loads(line)
        pages[r["page"]] = page_title(r["text"])

    doc = pymupdf.open(pdf_path)
    out, seen = [], set()
    for page, title in sorted(pages.items()):
        if not title:
            continue
        tn = norm(title)
        match = next((f for f in facts if len(f["n"]) > 5 and f["n"] in tn), None)
        if not match:
            continue
        # mỗi cấu trúc chỉ lấy MỘT trang đại diện, tránh hỏi đi hỏi lại một thứ
        if match["label"] in seen:
            continue
        seen.add(match["label"])

        fn = f"p{page:04d}.jpg"
        # Xuất ở DPI cao rồi thu nhỏ + nén, thay vì render thẳng ở DPI thấp:
        # bản vẽ atlas nhiều nét mảnh và chữ nhỏ, render thẳng nhỏ là chữ nhoè.
        # 110 DPI thô cho ra ~1,3MB/ảnh — 50 ảnh là 67MB, quá nặng cho web.
        pix = doc[page - 1].get_pixmap(dpi=150)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        w = 1100
        if img.width > w:
            img = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
        img.save(os.path.join(outdir, fn), "JPEG", quality=78, optimize=True, progressive=True)
        out.append({
            "page": page, "title": title, "file": fn,
            "label": match["label"], "meshName": match["meshName"],
            "sceneSlug": match["sceneSlug"], "hotspotKey": match["key"],
        })

    doc.close()
    json.dump({"source": SOURCE, "shots": out},
              open(os.path.join(outdir, "index.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"trang atlas doc duoc tieu de: {sum(1 for t in pages.values() if t)}")
    print(f"khop duoc cau truc 3D       : {len(out)} (moi cau truc 1 trang)")
    print(f"anh xuat ra                 : {outdir}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
