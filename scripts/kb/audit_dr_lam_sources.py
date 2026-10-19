"""Independent, geometry-based audit of PDF question/image ownership.

Does not use the importer's event stream. Figure ownership is determined by
physical question boundaries across pages, then checked against every JSON set.
"""
from pathlib import Path
from bisect import bisect_right
from collections import defaultdict
import hashlib
import json
import re
import sys

import pymupdf

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent.parent / "Source_quiz_do_an"
BANKS = ROOT / "public/kb/dr-lam"
REPORT = ROOT / "docs/audits/quiz-source-audit.json"
catalog = json.loads((BANKS / "index.json").read_text(encoding="utf-8"))
selected = sys.argv[2] if len(sys.argv) > 2 else None
if selected:
    catalog["exams"] = [e for e in catalog["exams"] if e["id"] == selected]
    if not catalog["exams"]:
        raise ValueError("Unknown question set: " + selected)
    REPORT = REPORT.with_name("quiz-source-audit-" + selected + ".json")
rows = []

for entry in catalog["exams"]:
    bank = json.loads((BANKS / entry["file"]).read_text(encoding="utf-8"))
    source = SOURCE / bank["sourceFile"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == bank["sourceHash"], source.name
    pdf = pymupdf.open(source)
    starts, hints, images, text_lines, answer_labels, option_rows, contexts = [], [], [], [], [], [], []
    page_offset = 0
    native_image_count, small_images = 0, []
    for page_number, page in enumerate(pdf, 1):
        drawings = page.get_drawings()
        page_lines = []
        marks = [d["rect"] for d in drawings
                 if 15 < d["rect"].width < 30 and 0 < d["rect"].height < 30
                 and any(c and c[1] > .4 and c[0] < .2 and c[2] < c[1] for c in (d.get("fill"), d.get("color")))]
        for block in page.get_text("dict", flags=pymupdf.TEXTFLAGS_TEXT)["blocks"]:
            for line in block.get("lines", []):
                text = "".join(span["text"] for span in line["spans"]).strip()
                if not text or line["bbox"][1] < 30 or line["bbox"][3] > page.rect.height - 30:
                    continue
                position = page_offset + line["bbox"][1]
                is_label = re.fullmatch(r"[A-F]", text) and line["bbox"][0] < 110 and any("Bold" in s["font"] for s in line["spans"])
                page_lines.append({"position": position, "text": text, "box": pymupdf.Rect(line["bbox"]), "label": bool(is_label)})
                if is_label:
                    label_green = any((s["color"] >> 8 & 255) > 95 and (s["color"] >> 8 & 255) > (s["color"] >> 16) * 1.5 and (s["color"] & 255) < (s["color"] >> 8 & 255) * 1.1 for s in line["spans"])
                    if label_green or any(mark.intersects(pymupdf.Rect(line["bbox"])) for mark in marks):
                        answer_labels.append((position, text))
                else:
                    text_lines.append((position, text))
                    if text.startswith("Về ") and all("Bold" in s["font"] for s in line["spans"]):
                        contexts.append((position, text, line["bbox"][0]))
                question = re.fullmatch(r"Câu hỏi\s+(\d+)\s*:", text)
                if question:
                    starts.append((page_offset + line["bbox"][1], int(question[1]), page_number, line["bbox"][0]))
                elif re.fullmatch(r"Gợi ý\s*:", text):
                    hints.append(page_offset + line["bbox"][1])
        # Source option outlines enclose their own label and complete body,
        # independently of PDF block order or the importer's phase state.
        seen_rows = set()
        for drawing in drawings:
            box = drawing["rect"]
            if not ((32 < box.x0 < 39 or 69 < box.x0 < 72) and box.width > 200 and box.height > 10):
                continue
            contained = [line for line in page_lines if box.contains((line["box"].tl + line["box"].br) / 2)]
            labels = [line for line in contained if line["label"]]
            bodies = [line for line in contained if not line["label"] and line["box"].x0 >= box.x0 + 30]
            if len(labels) > 1 or any(not line["label"] and (line["box"].x0 < box.x0 + 30 or re.fullmatch(r"(?:Gợi ý|Câu hỏi\s+\d+)\s*:", line["text"])) for line in contained):
                continue  # Outer question cards and hint containers.
            if not bodies and not labels:
                continue
            signature = tuple((line["position"], line["text"]) for line in contained)
            if signature in seen_rows:
                continue  # Separate fill/stroke and dashed border paths.
            seen_rows.add(signature)
            option_rows.append({"position": min(line["position"] for line in contained), "label": labels[0]["text"] if labels else None, "texts": [line["text"] for line in bodies], "page": page_number, "clippedTop": box.y0 <= 33.76, "clippedBottom": box.y1 >= page.rect.height - 35})
        for info in page.get_image_info(xrefs=True):
            box = info["bbox"]
            if info["xref"]:
                native_image_count += 1
            if info["xref"] and (box[2] - box[0] <= 40 or box[3] - box[1] <= 30):
                small_images.append({"page": page_number, "bbox": list(box), "xref": info["xref"]})
            if not info["xref"]:
                continue
            # Only the visible portion of a figure may lie on this page.
            visible_top = max(33.75, box[1])
            raw = pdf.extract_image(info["xref"])["image"]
            url = "/kb/dr-lam/images/" + hashlib.sha256(raw).hexdigest()[:20] + ".webp"
            images.append({"position": page_offset + visible_top, "url": url, "page": page_number, "bbox": list(box), "xref": info["xref"]})
        page_offset += page.rect.height
    starts.sort()
    boundaries = [s[0] for s in starts]
    hints.sort()
    expected = defaultdict(lambda: {"images": [], "explanationImages": [], "evidence": []})
    original_text = defaultdict(list)
    original_answers = defaultdict(list)
    original_options = defaultdict(list)
    option_rows.sort(key=lambda row: row["position"])
    for row in option_rows:
        i = bisect_right(boundaries, row["position"]) - 1
        row["question"] = starts[i][1] if i >= 0 else None
    for i, row in enumerate(option_rows):
        label = row["label"]
        if not label:
            # A row clipped at a PDF page break may show its body before its
            # vertically centred label, which appears on the next page.
            previous = next((r for r in reversed(option_rows[:i]) if r["question"] == row["question"] and r["label"]), None)
            if row["clippedTop"] and previous and previous["clippedBottom"] and previous["page"] + 1 == row["page"]:
                label = previous["label"]
            else:
                following = next((r for r in option_rows[i + 1:] if r["question"] == row["question"] and r["label"]), None)
                label = following["label"] if following else None
        if label:
            original_options[(row["question"], label)].extend(row["texts"])
    first_options = {}
    for row in option_rows:
        first_options.setdefault(row["question"], row["position"])
    context_headings = []
    for position, text, x in contexts:
        i = bisect_right(boundaries, position) - 1
        if (i < 0 and x <= starts[0][3] + 4) or (i >= 0 and x <= starts[i][3] + 4 and position > first_options.get(starts[i][1], float("inf"))):
            context_headings.append((position, text))
    for position, text in text_lines:
        i = bisect_right(boundaries, position) - 1
        if i >= 0:
            original_text[starts[i][1]].append(text)
    for position, label in answer_labels:
        i = bisect_right(boundaries, position) - 1
        if i >= 0:
            original_answers[starts[i][1]].append(label)
    def compact(text):
        return re.sub(r"\s+", "", text)
    for figure in images:
        i = bisect_right(boundaries, figure["position"]) - 1
        if i < 0:
            continue
        start, number, _, _ = starts[i]
        hint_i = bisect_right(hints, start)
        hint = hints[hint_i] if hint_i < len(hints) else float("inf")
        section = "explanationImages" if figure["position"] >= hint else "images"
        if figure["url"] not in expected[number][section]:
            expected[number][section].append(figure["url"])
        expected[number]["evidence"].append({k: v for k, v in figure.items() if k != "position"} | {"section": section})
    differences = []
    for question in bank["questions"]:
        number = question["number"]
        start = next(s[0] for s in starts if s[1] == number)
        source_context = next((text for position, text in reversed(context_headings) if position < start), None)
        if question.get("context") != source_context:
            differences.append({"question": number, "field": "context", "imported": question.get("context"), "physical": source_context})
        if set(question["answers"]) != set(original_answers[number]):
            differences.append({"question": number, "field": "answers", "imported": question["answers"], "physical": original_answers[number]})
        for option in question["options"]:
            source_option = " ".join(original_options[(number, option["id"])])
            if compact(option["text"]) != compact(source_option):
                differences.append({"question": number, "field": "option mapping " + option["id"], "imported": option["text"], "physical": source_option})
        physical_text = compact(" ".join(original_text[number]))
        for key, text in [("stem", question["stem"]), ("explanation", question["explanation"])] + [("option " + o["id"], o["text"]) for o in question["options"]]:
            if text and compact(text) not in physical_text:
                differences.append({"question": number, "field": key, "imported": text, "reason": "Text not found within physical question boundaries"})
        physical = expected[question["number"]]
        for key in ("images", "explanationImages"):
            if set(question[key]) != set(physical[key]):
                differences.append({"question": question["number"], "field": key, "imported": question[key], "physical": physical[key]})
    row = {"id": entry["id"], "pdf": bank["sourceFile"], "sha256Verified": True, "sourceQuestions": len(starts), "importedQuestions": len(bank["questions"]), "optionsVerified": sum(len(q["options"]) for q in bank["questions"]), "contextHeadings": len(context_headings), "nativeImageOccurrences": native_image_count, "smallImages": small_images, "figureOccurrences": len(images), "differences": differences, "figuresByQuestion": {str(n): v["evidence"] for n, v in expected.items()}}
    rows.append(row)
    print(f"{entry['id']}: {len(starts)} questions, {len(images)} figures, {len(differences)} differences", flush=True)
    if selected and differences:
        print(json.dumps(differences, ensure_ascii=False, indent=2), flush=True)
    pdf.close()

REPORT.parent.mkdir(parents=True, exist_ok=True)
summary = {"method": "Physical PDF question boundaries; option outlines independently map each label to its text including clipped rows; original text coverage and latest shared context; marked answer keys; SHA-256 of embedded images and source files", "pdfs": len(rows), "questions": sum(r["sourceQuestions"] for r in rows), "options": sum(r["optionsVerified"] for r in rows), "figureOccurrences": sum(r["figureOccurrences"] for r in rows), "differences": sum(len(r["differences"]) for r in rows), "sets": rows}
REPORT.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Audit: {summary['pdfs']} PDFs, {summary['questions']} questions, {summary['figureOccurrences']} figure occurrences; {summary['differences']} differences.")
sys.exit(1 if summary["differences"] or any(r["sourceQuestions"] != r["importedQuestions"] for r in rows) else 0)
