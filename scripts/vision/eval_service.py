"""Chấm độ chính xác của dịch vụ nhận diện trên một bộ ảnh ĐÃ GÁN NHÃN.

Trả lời câu hỏi mà hội đồng sẽ hỏi: "nhận đúng bao nhiêu phần trăm?".

    python scripts/vision/eval_service.py --data scripts/vision/eval --url http://localhost:8000/

Cấu trúc thư mục giống hệt `refs/` của build_index.py — mỗi thư mục con là một
nhãn (trùng VisionPartKey trong src/lib/vision/parts.ts):

    eval/forearm/*.jpg   eval/knee/*.jpg   ...

QUAN TRỌNG: bộ ảnh CHẤM phải KHÁC bộ ảnh MẪU (refs/) — chấm trên chính ảnh mẫu
thì kNN luôn đúng 100% và con số đó vô nghĩa. Nên lấy ảnh của NGƯỜI KHÁC, hoặc
chụp ở buổi khác, ánh sáng khác.

In ra: top-1, top-3, độ chính xác từng nhãn, ma trận nhầm lẫn, độ trễ p50/p95.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import statistics
import time
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def ask(url: str, key: str, path: Path) -> tuple[list[dict], float]:
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    data = f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()
    body = json.dumps({"image": data}).encode()
    req = urllib.request.Request(url, data=body, headers={"content-type": "application/json"})
    if key:
        req.add_header("authorization", f"Bearer {key}")
    t0 = time.perf_counter()
    with urllib.request.urlopen(req, timeout=30) as res:
        out = json.loads(res.read())
    return out.get("results", []), (time.perf_counter() - t0) * 1000


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True, help="thư mục ảnh chấm, mỗi nhãn một thư mục con")
    ap.add_argument("--url", default="http://localhost:8000/")
    ap.add_argument("--key", default=os.environ.get("SOMA_VISION_KEY", ""))
    args = ap.parse_args()

    root = Path(args.data)
    samples = [(d.name, f) for d in sorted(root.iterdir()) if d.is_dir() for f in sorted(d.iterdir()) if f.suffix.lower() in EXTS]
    if not samples:
        raise SystemExit(f"Không thấy ảnh nào trong {root}")

    top1 = top3 = 0
    per = defaultdict(lambda: [0, 0])  # nhãn -> [đúng top-1, tổng]
    confusion: dict[str, Counter] = defaultdict(Counter)
    lat: list[float] = []
    for label, path in samples:
        results, ms = ask(args.url, args.key, path)
        lat.append(ms)
        parts = [r.get("part") for r in results]
        guess = parts[0] if parts else "(không)"
        confusion[label][guess] += 1
        per[label][1] += 1
        if guess == label:
            top1 += 1
            per[label][0] += 1
        if label in parts[:3]:
            top3 += 1

    n = len(samples)
    lat.sort()
    p95 = lat[min(n - 1, int(round(0.95 * (n - 1))))]
    print(f"# Kết quả chấm — {n} ảnh, {len(per)} nhãn\n")
    print(f"- Top-1: **{top1 / n:.1%}** ({top1}/{n})")
    print(f"- Top-3: **{top3 / n:.1%}** ({top3}/{n})")
    print(f"- Độ trễ: p50 {statistics.median(lat):.0f} ms · p95 {p95:.0f} ms\n")
    print("| Nhãn | Top-1 | Số ảnh | Hay nhầm thành |")
    print("|---|---|---|---|")
    for label in sorted(per):
        ok, total = per[label]
        wrong = [(g, c) for g, c in confusion[label].most_common() if g != label][:2]
        print(f"| {label} | {ok / total:.0%} | {total} | {', '.join(f'{g} ({c})' for g, c in wrong) or '—'} |")


if __name__ == "__main__":
    main()
