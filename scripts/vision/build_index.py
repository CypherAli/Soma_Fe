"""Dựng chỉ mục ảnh mẫu cho dịch vụ nhận diện.

    python scripts/vision/build_index.py --refs scripts/vision/refs

Cây thư mục ảnh mẫu — tên thư mục CHÍNH LÀ nhãn, phải trùng `VisionPartKey`
trong `src/lib/vision/parts.ts`:

    refs/
      forearm/  001.jpg 002.jpg …
      elbow/    …
      hand/     …

CHỤP ẢNH MẪU THẾ NÀO CHO CÓ TÁC DỤNG (đây mới là phần quyết định độ chính xác,
không phải mô hình):
  • Chụp bằng CHÍNH webcam sẽ dùng, ở đúng khoảng cách và ánh sáng thường ngồi.
    Ảnh mẫu lấy từ Internet chụp bằng máy ảnh xịn sẽ lệch hẳn phân bố.
  • Mỗi vùng ≥ 20 ảnh, đổi: sáng/tối, xoay ngang/dọc, hai bên trái–phải, tay áo
    xắn/không, nhiều người khác nhau nếu được.
  • Cắt VUÔNG đúng như lúc quét thật (khung ngắm nào thì ảnh mẫu như thế).
    Cách nhanh nhất: bật trang /quet, quét vài chục lần rồi lưu lại mẩu ảnh.
  • Nhãn sai còn hại hơn thiếu ảnh — thà bỏ ảnh khó phân định còn hơn gán bừa.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import torch
from PIL import Image

MODEL_NAME = "ViT-B-32"
PRETRAINED = "laion2b_s34b_b79k"
EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--refs", default=str(Path(__file__).parent / "refs"))
    ap.add_argument("--out", default=str(Path(__file__).parent / "index.npz"))
    ap.add_argument("--model", default=MODEL_NAME)
    ap.add_argument("--pretrained", default=PRETRAINED)
    args = ap.parse_args()

    import open_clip

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, _, preprocess = open_clip.create_model_and_transforms(args.model, pretrained=args.pretrained)
    model = model.to(device).eval()

    refs = Path(args.refs)
    if not refs.is_dir():
        raise SystemExit(f"Không thấy thư mục ảnh mẫu: {refs}")

    vecs: list[np.ndarray] = []
    labels: list[str] = []
    for folder in sorted(p for p in refs.iterdir() if p.is_dir()):
        files = [f for f in sorted(folder.iterdir()) if f.suffix.lower() in EXTS]
        if not files:
            continue
        batch = []
        for f in files:
            try:
                batch.append(preprocess(Image.open(f).convert("RGB")))
            except Exception as exc:
                print(f"  bỏ qua {f.name}: {exc}")
        if not batch:
            continue
        with torch.no_grad():
            emb = model.encode_image(torch.stack(batch).to(device))
            emb = emb / emb.norm(dim=-1, keepdim=True)
        arr = emb.cpu().numpy().astype(np.float32)
        vecs.append(arr)
        labels.extend([folder.name] * len(arr))
        print(f"  {folder.name}: {len(arr)} ảnh")

    if not vecs:
        raise SystemExit("Không có ảnh nào — xem hướng dẫn chụp ở đầu tệp này.")

    all_vecs = np.concatenate(vecs, axis=0)
    np.savez_compressed(args.out, vecs=all_vecs, labels=np.array(labels))
    print(f"\nĐã ghi {args.out}: {len(labels)} ảnh, {len(set(labels))} nhãn")

    # Cảnh báo sớm: nhãn quá ít ảnh thì kNN sẽ đoán bừa cho vùng đó.
    thin = sorted({l for l in labels if labels.count(l) < 10})
    if thin:
        print("CẢNH BÁO — dưới 10 ảnh, độ chính xác sẽ kém: " + ", ".join(thin))


if __name__ == "__main__":
    main()
