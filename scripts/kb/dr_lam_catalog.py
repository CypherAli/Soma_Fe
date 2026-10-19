"""Presentation metadata for the imported anatomy collection."""
import json
from pathlib import Path
from PIL import Image

TOPICS = {
    "giai-phau-chi-tren": "upper-limb",
    "giai-phau-chi-duoi": "lower-limb",
    "dau-mat-co": "head-neck",
    "mcq-dau-mat-co": "head-neck",
    "dung-sai-dau-mat-co": "head-neck",
    "giai-phau-mat": "senses",
    "giai-phau-tai": "senses",
    "giai-phau-nguc": "thorax",
    "giai-phau-than-kinh": "nervous",
    "than-kinh-trung-uong": "nervous",
    "tong-hop-cac-case-lam-sang-quan-trong": "clinical",
}


def build_entry(bank, group):
    exam_id = bank["id"]
    topic = "mock" if exam_id.startswith("de-thi-thu-") else "review" if exam_id.startswith("on-tap-") else TOPICS.get(exam_id, "abdomen-pelvis")
    pictures = [url for q in bank["questions"] for url in q["images"] + q["explanationImages"]]
    cover = None
    # Long screenshot strips and short text banners are retained in their
    # questions, but they make poor covers. Choose a readable source figure.
    for url in dict.fromkeys(pictures):
        file = Path(__file__).resolve().parents[2] / "public" / url.lstrip("/")
        with Image.open(file) as image:
            width, height = image.size
        if min(width, height) >= 180 and .65 <= width / height <= 1.9:
            cover = url
            break
    return {
        "id": exam_id, "title": bank["title"], "group": group,
        "topic": topic, "file": f"{exam_id}.json",
        "count": len(bank["questions"]),
        "gradableCount": sum(q["gradable"] for q in bank["questions"]),
        "imageCount": len(pictures),
        "illustratedCount": sum(bool(q["images"] or q["explanationImages"]) for q in bank["questions"]),
        "cover": cover,
        "sourceNote": bank["sourceNote"],
    }


def catalog_payload(entries):
    return {"schemaVersion": 1, "title": "Giải phẫu người · Đại học Y Hà Nội", "totalQuestions": sum(e["count"] for e in entries), "exams": entries}


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[2] / "public/kb/dr-lam"
    old = json.loads((root / "index.json").read_text(encoding="utf-8"))
    entries = [build_entry(json.loads((root / e["file"]).read_text(encoding="utf-8")), e["group"]) for e in old["exams"]]
    (root / "index.json").write_text(json.dumps(catalog_payload(entries), ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated catalog: {len(entries)} sets, {sum(e['imageCount'] for e in entries)} figure references.")
