"""Import the complete Dr. Lam PDF collection without OCR or inferred answers.

Usage: python scripts/kb/import_dr_lam.py [source_directory] [exam_ids_csv] [--text-only]
Answers come only from green option labels/circles in the original PDFs. Question and
explanation images are exported separately so answers remain hidden during exams.
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import re
import sys
import unicodedata

import pymupdf
from PIL import Image
from dr_lam_catalog import build_entry, catalog_payload

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[2]
arguments = [arg for arg in sys.argv[1:] if arg != "--text-only"]
TEXT_ONLY = "--text-only" in sys.argv[1:]
SOURCE = Path(arguments[0]) if arguments else ROOT.parent.parent / "Source_quiz_do_an"
OUT = ROOT / "public/kb/dr-lam"
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "images").mkdir(exist_ok=True)
verified_image_files = set()


def slug(text):
    text = unicodedata.normalize("NFD", text.lower().replace("đ", "d"))
    text = "".join(c for c in text if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def clean(lines):
    return re.sub(r"\s+", " ", " ".join(lines)).strip()


def write_json(path, value):
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def is_context_heading(value, spans):
    return value.startswith("Về ") and all("Bold" in s["font"] for s in spans)


def is_context_line(value, x, heading_x, phase, spans):
    return phase in ("option", "explanation") and is_context_heading(value, spans) and x <= heading_x + 4


def green(color):
    r, g, b = color >> 16, (color >> 8) & 255, color & 255
    return g > 95 and g > r * 1.5 and b < g * 1.1


def title_and_group(filename):
    title = filename.split("Lâm", 1)[-1].replace("·", " ").strip()
    title = title.replace("đề thi thửu", "đề thi thử")
    title = title[0].upper() + title[1:]
    group = "Đề thi thử" if "Đề thi thử" in title else "Ôn tập tổng hợp" if "Ôn tập" in title else "Case lâm sàng" if "case" in title else "Giải phẫu theo vùng"
    return title, group


def export_image(doc, info):
    if not info.get("xref"):
        return None
    raw = doc.extract_image(info["xref"])["image"]
    name = hashlib.sha256(raw).hexdigest()[:20] + ".webp"
    path = OUT / "images" / name
    valid = path in verified_image_files
    if not valid and path.exists():
        try:
            with Image.open(path) as existing:
                existing.load()
            valid = True
        except (OSError, ValueError):
            valid = False
    if not valid:
        im = Image.open(BytesIO(raw)).convert("RGB")
        im.thumbnail((1400, 1400))
        temporary = path.with_suffix(".webp.tmp")
        im.save(temporary, "WEBP", quality=90)
        temporary.replace(path)
    verified_image_files.add(path)
    return "/kb/dr-lam/images/" + name


selected = set(arguments[1].split(",")) if len(arguments) > 1 else None
entries = json.loads((OUT / "index.json").read_text(encoding="utf-8"))["exams"] if selected else []
report = json.loads((OUT / "import-report.json").read_text(encoding="utf-8")) if selected else []
entries = [e for e in entries if not selected or e["id"] not in selected]
report = [r for r in report if not selected or r["id"] not in selected]
processed = 0
for file in sorted(SOURCE.glob("*.pdf")):
    title, group = title_and_group(file.stem)
    exam_id = slug(title)
    if selected and exam_id not in selected:
        continue
    processed += 1
    source_hash = hashlib.sha256(file.read_bytes()).hexdigest()
    cached_questions = {}
    if TEXT_ONLY:
        cached = json.loads((OUT / f"{exam_id}.json").read_text(encoding="utf-8"))
        if cached["sourceHash"] != source_hash:
            raise ValueError("Source changed: run a full import for " + exam_id)
        cached_questions = {q["id"]: q for q in cached["questions"]}
    doc = pymupdf.open(file)
    expected = re.search(r"(\d+)\s+câu nhận diện", doc[0].get_text())
    source_note = "Bản PDF nguồn ghi nhận có tài nguyên ảnh chưa tải được." if "BẢN QUÉT CHƯA HOÀN TẤT" in doc[0].get_text() else None
    questions = []
    current, phase, option, pending_option = None, "stem", None, []
    context, question_x = None, 0
    for page_number, page in enumerate(doc, 1):
        events = []
        drawings = page.get_drawings()
        source_lines = []
        green_circles = [drawing["rect"] for drawing in drawings
                         if 15 < drawing["rect"].width < 30 and 0 < drawing["rect"].height < 30
                         and any(color and color[1] > .4 and color[0] < .2 and color[2] < color[1]
                                 for color in (drawing.get("fill"), drawing.get("color")))]
        for block in page.get_text("dict", flags=pymupdf.TEXTFLAGS_TEXT)["blocks"]:
            for line in block.get("lines", []):
                spans = line["spans"]
                text = "".join(s["text"] for s in spans).strip()
                box = line["bbox"]
                if not text or box[1] < 30 or box[3] > page.rect.height - 30:
                    continue
                # PDF block order keeps a vertically centered option label BEFORE
                # its multiline text. Sorting by y would shift text to the prior option.
                is_green = any(green(s["color"]) for s in spans) or any(rect.intersects(pymupdf.Rect(box)) for rect in green_circles)
                events.append((box[1], box[0], "text", text, spans, is_green))
                is_label = bool(re.fullmatch(r"[A-F]", text) and box[0] < 110 and any("Bold" in s["font"] for s in spans))
                source_lines.append((pymupdf.Rect(box), text, is_label))
        deferred_lines = set()
        for drawing in drawings:
            rect = drawing["rect"]
            if not ((32 < rect.x0 < 39 or 69 < rect.x0 < 72) and rect.width > 200 and rect.height > 10
                    and rect.y0 > 33.76 and rect.y1 >= page.rect.height - 35):
                continue
            enclosed = [line for line in source_lines if rect.contains((line[0].tl + line[0].br) / 2)]
            if enclosed and not any(line[2] or line[0].x0 < rect.x0 + 30 for line in enclosed):
                deferred_lines.update((line[0].y0, line[0].x0) for line in enclosed)
        for info in ([] if TEXT_ONLY else page.get_image_info(xrefs=True)):
            box = info["bbox"]
            if info.get("xref"):
                position = next((i for i, event in enumerate(events) if event[0] > box[1]), len(events))
                events.insert(position, (box[1], box[0], "image", info, None, False))
        for y, x, kind, value, spans, is_green in events:
            if kind == "image":
                if current:
                    url = export_image(doc, value)
                    if url:
                        key = "explanationImages" if phase == "explanation" else "images"
                        if url not in current[key]:
                            current[key].append(url)
                continue
            heading = re.fullmatch(r"Câu hỏi\s+(\d+)\s*:", value)
            if heading:
                current = {"id": f"{exam_id}-{heading[1]}", "number": int(heading[1]), "stem": [], "options": [], "answers": [], "explanation": [], "images": [], "explanationImages": [], "sourcePage": page_number}
                questions.append(current)
                question_x = x
                if context:
                    current["context"] = context
                phase, option, pending_option = "stem", None, []
            elif not current:
                if is_context_heading(value, spans) and x < 80:
                    context = value
                continue
            elif re.fullmatch(r"Gợi ý\s*:", value):
                phase, option = "explanation", None
            elif is_context_line(value, x, question_x, phase, spans):
                # Shared prompts precede the next numbered question and can
                # continue across several true/false items. Preserve them as
                # context instead of attaching them to the prior answer/hint.
                context = value
            elif phase != "explanation" and re.fullmatch(r"[A-F]", value) and x < 110 and any("Bold" in s["font"] for s in spans):
                # A PDF page break may put an option's body on one page and its
                # centered label on the following page. Keep that body with A.
                option = {"id": value, "text": pending_option}
                pending_option = []
                current["options"].append(option)
                phase = "option"
                if is_green:
                    current["answers"].append(value)
            elif phase != "explanation" and (y, x) in deferred_lines:
                # A new option can start at the bottom of this page while its
                # centred label appears on the next. Defer to that next label,
                # including B–F rather than appending to the preceding option.
                pending_option.append(value)
            elif phase == "explanation":
                current["explanation"].append(value)
            elif phase == "option":
                option["text"].append(value)
            elif x >= 110 and phase == "stem":
                pending_option.append(value)
            else:
                current["stem"].append(value)
    issues = []
    for q in questions:
        if TEXT_ONLY:
            original = cached_questions[q["id"]]
            q["images"] = original["images"]
            q["explanationImages"] = original["explanationImages"]
        q["stem"] = clean(q["stem"])
        q["explanation"] = "\n".join(q["explanation"]).strip()
        for o in q["options"]:
            o["text"] = clean(o["text"])
        q["gradable"] = bool(q["answers"]) and len(q["options"]) >= 2 and all(o["text"] for o in q["options"])
        if not q["gradable"]:
            issues.append({"number": q["number"], "page": q["sourcePage"], "options": len(q["options"]), "answers": q["answers"]})
    numbers = [q["number"] for q in questions]
    if numbers != list(range(1, len(questions) + 1)):
        raise ValueError(f"Nonsequential question numbers in {file.name}: {numbers}")
    if expected and len(questions) != int(expected[1]):
        raise ValueError(f"Missing questions in {file.name}: {len(questions)}/{expected[1]}")
    bank = {"schemaVersion": 1, "id": exam_id, "title": title, "sourceFile": file.name, "sourceNote": source_note, "sourceHash": source_hash, "pages": len(doc), "questions": questions}
    write_json(OUT / f"{exam_id}.json", bank)
    entries.append(build_entry(bank, group))
    report.append({"id": exam_id, "source": file.name, "sourceNote": source_note, "expected": int(expected[1]) if expected else None, "imported": len(questions), "review": issues})
    print(f"{title}: {len(questions)} questions, {len(issues)} need review", flush=True)
    doc.close()

if not processed:
    raise ValueError("No matching source PDF: " + str(selected or SOURCE))
groups = ["Giải phẫu theo vùng", "Case lâm sàng", "Ôn tập tổng hợp", "Đề thi thử"]
entries.sort(key=lambda e: (groups.index(e["group"]), int(re.search(r"\d+", e["title"])[0]) if re.search(r"\d+", e["title"]) else 0, e["title"]))
write_json(OUT / "index.json", catalog_payload(entries))
write_json(OUT / "import-report.json", report)
dimensions = {}
for image_path in (OUT / "images").glob("*.webp"):
    with Image.open(image_path) as picture:
        dimensions["/kb/dr-lam/images/" + image_path.name] = list(picture.size)
write_json(OUT / "image-dimensions.json", dimensions)
print(f"Imported {len(entries)} PDFs, {sum(e['count'] for e in entries)} questions.")
