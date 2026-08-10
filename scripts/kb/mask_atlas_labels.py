"""Che nhãn chữ trên ảnh atlas để dùng làm câu hỏi.

    python scripts/kb/mask_atlas_labels.py <thu_muc_atlas> <atlas.pdf>

Bản vẽ atlas in sẵn TOÀN BỘ tên cấu trúc ngay trên hình — kể cả tên đang hỏi.
Hỏi "đây là vị trí nào?" với ảnh nguyên bản thì nhìn là ra đáp án.

Trình tự dưới đây quan trọng, mỗi bước đều từ một lỗi thật:
 1. Dựng lại trang ở 300 DPI. OCR trên ảnh đã thu nhỏ bắt hụt chữ nhỏ, để sót
    nhãn và cả những mẩu chữ lẻ trông rất bẩn.
 2. CẮT dải đầu trang và chân trang theo HÌNH HỌC. Tiêu đề và chân trang của
    Netter chính là đáp án ("Tuyến Giáp: Nhìn Trước" / "TUYẾN GIÁP VÀ THANH
    QUẢN"), mà chân trang in đậm chữ hoa giãn cách nên Tesseract không đọc nổi
    -> không có hộp để che. Cắt thì chắc chắn hết, không phụ thuộc OCR.
 3. OCR phần còn lại, tô trắng TỪNG CHỮ. Không tô theo khối: khối của Tesseract
    gộp chữ ở hai đầu trang thành hộp rộng bằng cả trang, tô trắng là quét
    thành dải ngang cắt nát bản vẽ.
 4. Xoá vệt bút dạ người đọc tô trong bản PDF — Tesseract đọc hụt chữ trên nền
    bão hoà nên các nhãn đó sót lại nguyên vẹn.
 5. Thu nhỏ về khổ web RỒI MỚI vẽ dấu hỏi, để dấu hỏi đúng kích thước trên ảnh
    cuối (vẽ trước khi thu nhỏ thì nó teo thành chấm đỏ li ti).

Giữ nguyên ảnh gốc: sau khi trả lời, giao diện hiện lại bản đầy đủ nhãn để đối
chiếu. Vì thế bảng tra có cả `file` (gốc) lẫn `fileQuiz` (đã che).
"""
import json
import os
import re
import sys
import unicodedata

import pymupdf
import pytesseract
from PIL import Image, ImageDraw

pytesseract.pytesseract.tesseract_cmd = os.environ.get(
    "TESSERACT_EXE", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
os.environ.setdefault("TESSDATA_PREFIX", os.path.expanduser(r"~\tessdata"))

PAD = 4              # nới hộp chữ vài pixel cho hết chân chữ
DPI = 300            # OCR + che ở độ phân giải cao rồi mới thu nhỏ
WEB_W = 1100         # bề ngang ảnh xuất ra web
CROP_TOP = 0.075     # cắt dải tiêu đề
CROP_BOTTOM = 0.075  # cắt dải chân trang


def norm(s: str) -> str:
    s = unicodedata.normalize("NFC", s or "")
    return re.sub(r"\s+", " ", s).strip().lower()


def blocks_of(data: dict, min_conf: int = 35):
    """Gom chữ thành KHỐI theo block/par — nhãn hai dòng như 'Động mạch và /
    tĩnh mạch giáp trên' phải được coi là một nhãn. Chỉ dùng để TÌM ĐÍCH."""
    groups: dict = {}
    for i, txt in enumerate(data["text"]):
        if not txt or not txt.strip():
            continue
        try:
            if int(data["conf"][i]) < min_conf:
                continue
        except (ValueError, TypeError):
            continue
        key = (data["block_num"][i], data["par_num"][i])
        g = groups.setdefault(key, {"w": [], "x0": 10 ** 9, "y0": 10 ** 9, "x1": 0, "y1": 0})
        g["w"].append(txt.strip())
        x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
        g["x0"] = min(g["x0"], x); g["y0"] = min(g["y0"], y)
        g["x1"] = max(g["x1"], x + w); g["y1"] = max(g["y1"], y + h)
    return [{"text": " ".join(g["w"]), "box": (g["x0"], g["y0"], g["x1"], g["y1"])}
            for g in groups.values()]


def highlighter_boxes(img: Image.Image):
    """Vệt bút dạ (xanh lá / xanh lơ) người đọc tô trong bản PDF.

    RÀNG BUỘC HÌNH DẠNG là mấu chốt: vệt bút dạ luôn RỘNG VÀ DẸT (phủ một dòng
    chữ), còn tĩnh mạch trong hình thì dài, cong và mảnh. Không có ràng buộc
    này thì luật bắt xanh lơ tóm luôn các tĩnh mạch và đục thủng bản vẽ.
    """
    k = 4
    small = img.convert("RGB").resize((max(1, img.width // k), max(1, img.height // k)))
    px = small.load()
    hit = set()
    for y in range(small.height):
        for x in range(small.width):
            r, g, b = px[x, y]
            green = g > 175 and r < 175 and b < 175 and g - max(r, b) > 50
            cyan = g > 185 and b > 185 and r < 170 and min(g, b) - r > 50
            if green or cyan:
                hit.add((x, y))

    boxes, used = [], set()
    for p in hit:
        if p in used:
            continue
        stack, comp = [p], []
        used.add(p)
        while stack:
            cx, cy = stack.pop()
            comp.append((cx, cy))
            for dx in (-2, -1, 0, 1, 2):
                for dy in (-1, 0, 1):
                    n = (cx + dx, cy + dy)
                    if n in hit and n not in used:
                        used.add(n); stack.append(n)
        if len(comp) < 8:
            continue
        xs = [c[0] for c in comp]; ys = [c[1] for c in comp]
        w = max(xs) - min(xs) + 1
        h = max(ys) - min(ys) + 1
        # chỉ nhận vùng RỘNG GẤP 3 LẦN CAO và không quá dày -> đúng dáng một
        # dòng chữ bị bôi; mạch máu dài cong mảnh sẽ trượt điều kiện này
        if w < h * 3 or h > small.height * 0.035:
            continue
        boxes.append((min(xs) * k, min(ys) * k, (max(xs) + 1) * k, (max(ys) + 1) * k))
    return boxes


def erase_if_on_paper(img: Image.Image, box, ring: int = 6) -> bool:
    """Xoá một vùng CHỈ KHI nó nằm trên nền giấy trắng.

    Nhãn của Netter luôn in ở lề trắng rồi kéo nét chỉ vào hình. Ngược lại, hộp
    mà OCR nhận nhầm hầu như luôn nằm ĐÈ LÊN BẢN VẼ. Nên lấy màu viền quanh hộp
    làm trọng tài: viền trắng -> đúng là nhãn, tô trắng; viền có màu -> bỏ qua,
    đừng đụng vào hình.

    Đã thử hai cách sai trước đó: tô trắng tất (đục lỗ trắng giữa tạng) và tô
    bằng màu trung vị của viền (ra mảng màu loang lổ như giấy vụn).
    """
    x0, y0, x1, y1 = [int(v) for v in box]
    x0 = max(0, x0); y0 = max(0, y0)
    x1 = min(img.width, x1); y1 = min(img.height, y1)
    if x1 <= x0 or y1 <= y0:
        return False
    px = img.load()
    samples = []
    for x in range(max(0, x0 - ring), min(img.width, x1 + ring)):
        for y in (max(0, y0 - ring), min(img.height - 1, y1 + ring - 1)):
            samples.append(px[x, y])
    for y in range(max(0, y0 - ring), min(img.height, y1 + ring)):
        for x in (max(0, x0 - ring), min(img.width - 1, x1 + ring - 1)):
            samples.append(px[x, y])
    if not samples:
        return False
    samples.sort(key=lambda c: c[0] + c[1] + c[2])
    r, g, b = samples[len(samples) // 2]
    if min(r, g, b) < 225:
        return False              # viền có màu -> đang nằm trên hình, không đụng
    ImageDraw.Draw(img).rectangle([x0, y0, x1, y1], fill=(255, 255, 255))
    return True


def draw_marker(d: ImageDraw.ImageDraw, cx: int, cy: int, r: int) -> None:
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(154, 51, 36), outline="white", width=3)
    d.arc([cx - r * 0.42, cy - r * 0.58, cx + r * 0.42, cy - r * 0.02],
          start=195, end=360, fill="white", width=max(3, r // 6))
    d.line([cx + r * 0.12, cy - r * 0.06, cx, cy + r * 0.26], fill="white", width=max(3, r // 6))
    d.ellipse([cx - r * 0.12, cy + r * 0.40, cx + r * 0.12, cy + r * 0.64], fill="white")


def main() -> None:
    root, pdf_path = sys.argv[1], sys.argv[2]
    only = {int(x) for x in sys.argv[3].split(",")} if len(sys.argv) > 3 else None
    idx_path = os.path.join(root, "index.json")
    idx = json.load(open(idx_path, encoding="utf-8"))
    doc = pymupdf.open(pdf_path)

    done, no_target = 0, []
    for shot in idx["shots"]:
        if only and shot["page"] not in only:
            continue
        pix = doc[shot["page"] - 1].get_pixmap(dpi=DPI)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        # (2) cắt tiêu đề + chân trang TRƯỚC khi OCR, để mọi toạ độ nhất quán
        h0 = img.height
        img = img.crop((0, int(h0 * CROP_TOP), img.width, int(h0 * (1 - CROP_BOTTOM))))

        # HAI LƯỢT OCR. Chế độ mặc định phân tích bố cục theo khối nên bỏ sót
        # nhãn nằm rải rác một mình giữa hình ("Thùy giáp", "Cơ nhẫn - giáp"
        # từng sót lại nguyên). psm 11 quét "chữ thưa", bắt được những cái đó.
        # Che theo HỢP của hai lượt; tìm đích thì dùng lượt mặc định vì nó gom
        # nhãn nhiều dòng thành khối đúng hơn.
        data = pytesseract.image_to_data(img, lang="vie", output_type=pytesseract.Output.DICT)
        sparse = pytesseract.image_to_data(img, lang="vie", config="--psm 11",
                                           output_type=pytesseract.Output.DICT)

        # tìm đích TRƯỚC khi tô trắng
        label = norm(shot["label"])
        target = None
        for b in blocks_of(data):
            t = norm(b["text"])
            if label and (label in t or t in label) and len(t) >= 4:
                if target is None or len(t) < len(norm(target["text"])):
                    target = b

        d = ImageDraw.Draw(img)
        # Cả hai lượt đều lọc theo độ tin cậy. Trước đây lượt mặc định che tất
        # để khỏi sót nhãn bị bôi bút dạ (chúng bị chấm điểm rất thấp) — nhưng
        # nay vệt bút dạ đã được xử lý riêng bằng MÀU, nên lọc được, và lọc thì
        # hết mấy ô trắng lạc do OCR nhận nhầm mảng màu trong hình là chữ.
        # Lượt "chữ thưa": PHẢI lọc theo độ tin cậy, vì nó nhận nhầm cả mảng
        # trong bản vẽ là chữ và đục ô trắng ngay lên tạng (đã dính: mấy ô
        # trắng nằm giữa tuyến giáp).
        for src, min_conf in ((data, -1), (sparse, 30)):
            for i, txt in enumerate(src["text"]):
                if not txt or not txt.strip():
                    continue
                if min_conf >= 0:
                    try:
                        if int(src["conf"][i]) < min_conf:
                            continue
                    except (ValueError, TypeError):
                        continue
                    # chữ thật luôn có bề ngang lớn hơn chiều cao hoặc gần vuông;
                    # mảng màu bị nhận nhầm thường cao lêu nghêu
                    if src["height"][i] > src["width"][i] * 2.2:
                        continue
                x, y = src["left"][i], src["top"][i]
                w, h = src["width"][i], src["height"][i]
                # psm 11 thỉnh thoảng trả về một hộp ôm gần hết trang -> bỏ
                if w <= 0 or h <= 0 or w > img.width * 0.9 or h > img.height * 0.25:
                    continue
                erase_if_on_paper(img, (x - PAD, y - PAD, x + w + PAD, y + h + PAD))

        for box in highlighter_boxes(img):
            # vệt bút dạ luôn bôi trên chữ ở lề -> ép xoá, không cần xét viền
            ImageDraw.Draw(img).rectangle(list(box), fill=(255, 255, 255))

        # (5) thu nhỏ RỒI mới vẽ dấu hỏi
        scale = 1.0
        if img.width > WEB_W:
            scale = WEB_W / img.width
            img = img.resize((WEB_W, round(img.height * scale)), Image.LANCZOS)
        if target:
            x0, y0, x1, y1 = target["box"]
            draw_marker(ImageDraw.Draw(img),
                        int((x0 + x1) / 2 * scale), int((y0 + y1) / 2 * scale),
                        max(18, int(WEB_W * 0.022)))
        else:
            no_target.append(shot["page"])

        out_name = "q" + shot["file"]
        img.save(os.path.join(root, out_name), "JPEG", quality=80, optimize=True, progressive=True)
        shot["fileQuiz"] = out_name
        shot["hasMarker"] = bool(target)
        done += 1

    doc.close()
    json.dump(idx, open(idx_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"da che nhan  : {done} anh")
    print(f"co dau hoi   : {done - len(no_target)}")
    print(f"thieu dau hoi: {len(no_target)} -> trang {no_target[:12]}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
