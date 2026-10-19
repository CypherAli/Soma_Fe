"""Decode every referenced image, optionally repair exports from the audited PDF.

Usage: python scripts/kb/verify_dr_lam_images.py [--repair]
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import sys

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BANKS = ROOT / "public/kb/dr-lam"
SOURCE = ROOT.parent.parent / "Source_quiz_do_an"
catalog = json.loads((BANKS / "index.json").read_text(encoding="utf-8"))
urls = set()
for entry in catalog["exams"]:
    bank = json.loads((BANKS / entry["file"]).read_text(encoding="utf-8"))
    for question in bank["questions"]:
        urls.update(question["images"] + question["explanationImages"])

evidence = {}
if "--repair" in sys.argv:
    report = json.loads((ROOT / "docs/audits/quiz-source-audit.json").read_text(encoding="utf-8"))
    for item in report["sets"]:
        for figures in item["figuresByQuestion"].values():
            for figure in figures:
                evidence[figure["url"]] = (item["pdf"], item["id"], figure["xref"])

dimensions, repaired = {}, []
for url in sorted(urls):
    path = ROOT / "public" / url.removeprefix("/")
    try:
        with Image.open(path) as picture:
            picture.load()
            dimensions[url] = list(picture.size)
    except (OSError, ValueError):
        if url not in evidence:
            raise ValueError("Unreadable source figure: " + url)
        filename, bank_id, xref = evidence[url]
        source = SOURCE / filename
        bank = json.loads((BANKS / (bank_id + ".json")).read_text(encoding="utf-8"))
        assert hashlib.sha256(source.read_bytes()).hexdigest() == bank["sourceHash"]
        with pymupdf.open(source) as pdf:
            raw = pdf.extract_image(xref)["image"]
        assert hashlib.sha256(raw).hexdigest()[:20] == path.stem
        picture = Image.open(BytesIO(raw)).convert("RGB")
        picture.thumbnail((1400, 1400))
        temporary = path.with_suffix(".webp.tmp")
        picture.save(temporary, "WEBP", quality=90)
        temporary.replace(path)
        with Image.open(path) as checked:
            checked.load()
            dimensions[url] = list(checked.size)
        repaired.append(url)

manifest = BANKS / "image-dimensions.json"
temporary = manifest.with_suffix(".json.tmp")
temporary.write_text(json.dumps(dimensions, indent=2), encoding="utf-8")
temporary.replace(manifest)
print(f"Decoded {len(dimensions)} referenced source images. Repaired {len(repaired)} exports.")
for url in repaired:
    print(url)
