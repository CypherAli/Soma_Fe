"""Dịch vụ nhận diện bộ phận cơ thể từ một mẩu ảnh webcam.

Chạy trên máy GPU (graphicsminer); Next.js gọi vào đây qua route
`/api/vision/identify` — trình duyệt KHÔNG gọi thẳng.

    pip install fastapi uvicorn torch open_clip_torch pillow numpy
    python scripts/vision/service.py --port 8000

HAI CHẾ ĐỘ, TỰ CHỌN:

  1. kNN trên ẢNH MẪU (chính xác hơn hẳn — dùng cái này khi đã có ảnh).
     Có tệp `index.npz` do `build_index.py` sinh ra thì dịch vụ so ảnh gửi lên
     với các ảnh mẫu đã gán nhãn, lấy trung bình k láng giềng gần nhất.

  2. ZERO-SHOT theo câu chữ (chạy được ngay ngày đầu, chưa cần ảnh nào).
     So ảnh với các câu mô tả tiếng Anh của từng vùng.

Vì sao ưu tiên kNN: CLIP zero-shot trên ảnh CẬN CẢNH một mảng da người rất yếu
— "cẳng tay" và "cánh tay" gần như cùng một câu mô tả với nó. Ba chục ảnh mẫu
tự chụp cho mỗi vùng đưa độ chính xác lên hẳn một bậc, và bồi thêm ảnh thì tốt
lên tiếp, không phải huấn luyện lại gì cả.
"""

from __future__ import annotations

import argparse
import base64
import io
import os
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
import torch
from fastapi import FastAPI, HTTPException, Request
from PIL import Image
from pydantic import BaseModel

MODEL_NAME = os.environ.get("SOMA_VISION_MODEL", "ViT-B-32")
PRETRAINED = os.environ.get("SOMA_VISION_PRETRAINED", "laion2b_s34b_b79k")
INDEX_PATH = Path(os.environ.get("SOMA_VISION_INDEX", Path(__file__).parent / "index.npz"))
API_KEY = os.environ.get("SOMA_VISION_KEY", "")
TOP_K = 5

# Câu mô tả cho chế độ zero-shot. Viết bằng tiếng Anh vì CLIP được huấn luyện
# bằng tiếng Anh; nhiều câu cho mỗi vùng rồi lấy trung bình thì ổn định hơn một
# câu duy nhất. KHOÁ phải trùng `VisionPartKey` bên `src/lib/vision/parts.ts`.
PROMPTS: dict[str, list[str]] = {
    "face": ["a close-up photo of a person's face", "a human face looking at the camera"],
    "eye": ["a close-up photo of a human eye", "a macro photo of an eye and eyelid"],
    "ear": ["a close-up photo of a human ear", "the outer ear of a person, side view"],
    "mouth": ["a close-up photo of a human mouth and teeth", "an open mouth showing teeth"],
    "neck": ["a close-up photo of a human neck", "the front of a person's neck and throat"],
    "shoulder": ["a photo of a bare human shoulder", "a person's shoulder joint"],
    "upper-arm": ["a photo of a human upper arm between shoulder and elbow", "a bare upper arm with biceps"],
    "elbow": ["a close-up photo of a human elbow", "a bent elbow joint"],
    "forearm": ["a photo of a human forearm between elbow and wrist", "a bare forearm, palm up"],
    "wrist": ["a close-up photo of a human wrist", "the inner wrist of a person"],
    "hand": ["a photo of an open human hand", "a human palm with fingers spread"],
    "chest": ["a photo of a human chest", "the bare chest of a person"],
    "abdomen": ["a photo of a human abdomen and belly", "a bare stomach of a person"],
    "knee": ["a close-up photo of a human knee", "a bare knee joint"],
    "foot": ["a photo of a human foot", "a bare foot with toes"],
    # Thiếu "head" từng khiến GPU KHÔNG BAO GIỜ trả về nhãn Đầu dù giao diện có nhãn đó.
    "head": ["a photo of a person's whole head including hair", "a human head from crown to chin"],
    "hip": ["a photo of a human hip", "the side of a person's hip and pelvis"],
    "thigh": ["a photo of a human thigh", "a bare upper leg between hip and knee"],
    "leg": ["a photo of a human lower leg and calf", "a bare shin between knee and ankle"],
    "ankle": ["a close-up photo of a human ankle", "an ankle joint with the ankle bone"],
}


@asynccontextmanager
async def lifespan(_: FastAPI):
    # `@app.on_event("startup")` đã lỗi thời trong FastAPI; lifespan là cách chính thức.
    load_model()
    yield


app = FastAPI(title="Soma 3D vision", lifespan=lifespan)

_state: dict = {}


def load_model() -> None:
    import open_clip

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, _, preprocess = open_clip.create_model_and_transforms(MODEL_NAME, pretrained=PRETRAINED)
    model = model.to(device).eval()
    tokenizer = open_clip.get_tokenizer(MODEL_NAME)

    _state.update(model=model, preprocess=preprocess, device=device)

    # --- chế độ 1: chỉ mục ảnh mẫu ---
    if INDEX_PATH.exists():
        data = np.load(INDEX_PATH, allow_pickle=True)
        _state["index_vecs"] = data["vecs"].astype(np.float32)
        _state["index_labels"] = [str(x) for x in data["labels"]]
        print(f"[soma-vision] chỉ mục ảnh mẫu: {len(_state['index_labels'])} ảnh")
    else:
        print(f"[soma-vision] KHÔNG thấy {INDEX_PATH} — chạy zero-shot theo câu chữ")

    # --- chế độ 2: vector câu chữ (luôn dựng, dùng làm dự phòng) ---
    labels = list(PROMPTS.keys())
    with torch.no_grad():
        vecs = []
        for key in labels:
            toks = tokenizer(PROMPTS[key]).to(device)
            emb = model.encode_text(toks)
            emb = emb / emb.norm(dim=-1, keepdim=True)
            vecs.append(emb.mean(dim=0).cpu().numpy())
    text = np.stack(vecs).astype(np.float32)
    text /= np.linalg.norm(text, axis=1, keepdims=True)
    _state["text_vecs"] = text
    _state["text_labels"] = labels
    print(f"[soma-vision] sẵn sàng trên {device}")


def embed_image(img: Image.Image) -> np.ndarray:
    tensor = _state["preprocess"](img).unsqueeze(0).to(_state["device"])
    with torch.no_grad():
        vec = _state["model"].encode_image(tensor)
    vec = vec / vec.norm(dim=-1, keepdim=True)
    return vec.cpu().numpy()[0].astype(np.float32)


def softmax(x: np.ndarray, temperature: float) -> np.ndarray:
    z = (x - x.max()) / temperature
    e = np.exp(z)
    return e / e.sum()


class Body(BaseModel):
    image: str
    labels: list[str] | None = None


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "mode": "knn" if "index_vecs" in _state else "zero-shot",
        "device": _state.get("device", "?"),
        "labels": len(_state.get("text_labels", [])),
    }


@app.post("/")
def identify(body: Body, request: Request) -> dict:
    if API_KEY and request.headers.get("authorization") != f"Bearer {API_KEY}":
        raise HTTPException(status_code=401, detail="sai khoá")

    raw = body.image
    if raw.startswith("data:"):
        raw = raw.split(",", 1)[-1]
    try:
        img = Image.open(io.BytesIO(base64.b64decode(raw))).convert("RGB")
    except Exception as exc:  # ảnh hỏng — nói rõ thay vì để nổ 500 khó hiểu
        raise HTTPException(status_code=400, detail=f"không đọc được ảnh: {exc}") from exc

    vec = embed_image(img)

    # Chỉ xét những nhãn mà giao diện đang có. Thêm/bớt vùng ở parts.ts là dịch
    # vụ theo ngay, không phải sửa hai nơi.
    allowed = set(body.labels) if body.labels else None

    if "index_vecs" in _state:
        sims = _state["index_vecs"] @ vec
        per_label: dict[str, float] = {}
        for label in set(_state["index_labels"]):
            if allowed and label not in allowed:
                continue
            mask = [i for i, l in enumerate(_state["index_labels"]) if l == label]
            top = np.sort(sims[mask])[::-1][:TOP_K]
            per_label[label] = float(top.mean())
        if per_label:
            keys = list(per_label.keys())
            scores = softmax(np.array([per_label[k] for k in keys]), temperature=0.04)
            order = np.argsort(scores)[::-1][:3]
            return {"results": [{"part": keys[i], "score": float(scores[i])} for i in order], "mode": "knn"}

    labels = _state["text_labels"]
    keep = [i for i, k in enumerate(labels) if not allowed or k in allowed]
    sims = _state["text_vecs"][keep] @ vec
    scores = softmax(sims, temperature=0.01)
    order = np.argsort(scores)[::-1][:3]
    return {
        "results": [{"part": labels[keep[i]], "score": float(scores[i])} for i in order],
        "mode": "zero-shot",
    }


if __name__ == "__main__":
    import uvicorn

    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=8000)
    args = ap.parse_args()
    uvicorn.run(app, host=args.host, port=args.port)
