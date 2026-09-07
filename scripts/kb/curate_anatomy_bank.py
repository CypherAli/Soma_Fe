"""Cổng chất lượng: lọc ngân hàng ứng viên thành bộ đề dùng được cho trang quiz.

    python scripts/kb/curate_anatomy_bank.py <thu-muc-out-cua-buoc-truoc>

Đọc `giai-phau-yhn-ngan-hang-kiem-tra.json` do `build_anatomy_quiz_bank.py`
sinh ra, rồi LOẠI (không phải sửa bừa) mọi câu không đủ tin cậy:
 - không đúng năm phương án A–E,
 - khóa đáp án không nằm trong phương án,
 - lời giải rỗng hoặc quá ngắn,
 - còn dấu vết OCR/ghép trang theo `BAD_PATTERNS`,
 - phải nhìn hình trong sách mới trả lời được,
 - khóa và lời giải mâu thuẫn ngay trong nguồn.

Chỉ sửa các lỗi OCR trong `FIXES` — là những lỗi ĐÃ ĐỐI CHIẾU TẬN MẮT với trang
sách và không thể nhầm sang từ khác. Tuyệt đối không "đoán dấu" tiếng Việt:
đoán sai một dấu trong câu giải phẫu là đổi luôn nghĩa lâm sàng.

Xuất `anatomy-mcq-curated.json` + `anatomy-mcq-curated-report.txt`. Đây MỚI CHỈ
là cổng tự động — vẫn phải có người chuyên môn duyệt từng câu trước khi chép
đè lên `public/kb/anatomy-mcq.json`.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit(__doc__)

OUT_DIR = Path(sys.argv[1])
SRC = OUT_DIR / "giai-phau-yhn-ngan-hang-kiem-tra.json"
OUT = OUT_DIR / "anatomy-mcq-curated.json"
REPORT = OUT_DIR / "anatomy-mcq-curated-report.txt"

FIXES = {
    "Mỏ tả": "Mô tả", "mỏ tả": "mô tả", "dáy chằng": "dây chằng",
    "dây chàng": "dây chằng", "Dây chàng": "Dây chằng", "bát chéo": "bắt chéo",
    "khớp gói": "khớp gối", "gỏi": "gối", "chán": "chân", "chàv": "chày",
    "cùa": "của", "cua": "của", "trờ nên": "trở nên", "phâu thuật": "phẫu thuật",
    "Đảy là": "Đây là", "đáy là": "đây là", "nhản": "nhân", "bàng": "bằng",
    "gày": "gây", "mát": "mắt", "đỏi khi": "đôi khi", "mỏi lớn": "môi lớn",
    "bẽn": "bên", "nóng": "nông", "gán": "gân", "đáu": "đầu",
    "ốns": "ống", "de dàng": "dễ dàng", "nàv": "này", "lèn": "lên",
    "thảng": "thẳng", "đứne": "đứng", "sóp": "góp", "Xoãn": "Xoăn",
    "mans tai": "mang tai", "chi có": "chỉ có", "quàn": "quản",
    "ổ cói": "ổ cối", "Nó trùng": "Nó chùng", "ngân cản": "ngăn cản",
    "tư thê": "tư thế", "ung thư": "Ung thư", "Khỉ ĐM": "Khi ĐM",
    "sau đáy": "sau đây", "đáy?": "đây?", "dẻ bị": "dễ bị",
    "ảnh hường": "ảnh hưởng", "dản đến": "dẫn đến", "gáy liệt": "gây liệt",
    "nhiẽm trùng": "nhiễm trùng", "thát hậu môn": "thắt hậu môn",
    "hậu món": "hậu môn", "mỏm vẹl": "mỏm vẹt", "ô mũi": "ổ mũi",
    "khe ổ mát": "khe ổ mắt", "mống mát": "mống mắt", "cơ vòng mát": "cơ vòng mắt",
    "sảy ra": "xảy ra", "Vân động": "Vận động", "đéu đúng": "đều đúng",
    "đềiL đúng": "đều đúng", "đàu đúng": "đều đúng", "cảng tay": "cẳng tay",
    "cảng chân": "cẳng chân", "cẳng chán": "cẳng chân", "gấp mu chán": "gấp mu chân",
    "ờ mặt": "ở mặt", "ờ trên": "ở trên", "ờ sau": "ở sau", "ờ trước": "ở trước",
    "ờ lỗ": "ở lỗ", "ờ bờ": "ở bờ", "ờ cổ": "ở cổ", "ờ dưới": "ở dưới",
    "Mỏ tá": "Mô tả", "mỏ tá": "mô tả", "Mó tà": "Mô tả", "mó tà": "mô tả",
    "Mô tà": "Mô tả", "mô tà": "mô tả", "Mô tá": "Mô tả", "mô tá": "mô tả",
    "TRƯ:": "TRỪ:", "nguvén": "nguyên", "dao đám": "dao đâm",
    # Đợt hiệu đính 2026-08-19 — mỗi chỗ đều xác định được DUY NHẤT một từ nhờ
    # thuật ngữ giải phẫu đi kèm trong chính câu đó, không phải đoán dấu:
    "TK thanh quản Dgoài": "TK thanh quản ngoài",   # thanh quản ngoài/trong
    "thanh qaản": "thanh quản", "thực quảiv": "thực quản",
    "nhánh ihái dương": "nhánh thái dương",
    "giao cảm trirớc hạch": "giao cảm trước hạch",
    "khuyết CỊuax": "khuyết quay",                  # khuyết ròng rọc + khuyết quay
    "Cơ rốne trong": "Cơ rộng trong",               # vastus medialis
    "tam đáu cãns chán": "tam đầu cẳng chân",       # triceps surae
    "tam đầu cãns chân": "tam đầu cẳng chân",
    "sau đảv": "sau đây", "dưới đảv": "dưới đây",
    "dáv chằng": "dây chằng", "dáv chàng": "dây chằng", "dáv chăns": "dây chằng",
}

# Hai nhóm lỗi OCR CÓ QUY LUẬT của bản scan này, sửa theo cả từ nên không đụng
# nhầm từ khác: 'y' cuối âm tiết bị đọc thành 'v', và 'g' cuối / 'ng' đầu bị đọc
# thành 's' hoặc 'a'. Chỉ liệt kê từ mà dấu thanh còn nguyên nên đích đến là duy
# nhất — "tav" chỉ có thể là "tay". Những chữ hỏng mà dấu cũng sai ("ỏns" có thể
# là ống/ong/ông) KHÔNG sửa ở đây: để `npm run audit:quiz-ocr` liệt kê cho người
# đối chiếu trang sách, đoán dấu sai là đổi luôn nghĩa giải phẫu.
WORD_FIXES = {
    # y bị đọc thành v
    "tav": "tay", "quav": "quay", "xoav": "xoay", "chạv": "chạy",
    "đáv": "đáy", "dâv": "dây", "đâv": "đây",
    "tuvến": "tuyến", "chuvển": "chuyển", "nguvệt": "nguyệt", "nguvên": "nguyên",
    # g cuối bị đọc thành s hoặc a; ng đầu bị đọc thành ns
    "trons": "trong", "xươns": "xương", "màns": "màng", "cùns": "cùng",
    "nôns": "nông", "bụns": "bụng", "rộna": "rộng", "khóna": "không",
    "nsang": "ngang", "nsón": "ngón", "nsừa": "ngửa",
    # Mất dấu cách giữa "TK" và tên dây thần kinh, và một chữ 'i' rác chen vào.
    "TKđùi": "TK đùi", "TKbịt": "TK bịt", "TKnách": "TK nách",
    "TKcơbì": "TK cơ bì", "thanhiquản": "thanh quản",
    # Tên riêng: điểm McBurney.
    "Bumey": "Burney",
}

BAD_PATTERNS = [
    r"PH[ẦẨ]N\s+\d", r"ĐÁP\s*[ÁA]N", r"<<<PAGE", r"[<>]", r"\b\d{3}\b",
    r"\b(?:mỏ|mò) tả\b", r"\b(?:dáy|dáy) chằng\b", r"\bchàv\b", r"\bnàv\b",
    r"\bốns\b", r"\bgán\b", r"\bđáu\b", r"\bcùa\b", r"\btrono\b",
    r"\bnguvén\b", r"\bTRƯ\b", r"\b(?:mỏ|mó|mô)\s+(?:tà|tá)\b",
]

REGIONS = {
    "lower_limb": "CHI DƯỚI",
    "upper_limb": "CHI TRÊN",
    "pelvis_perineum": "CHẬU HÔNG VÀ ĐÁY CHẬU",
    "abdomen": "BỤNG",
    "head_neck": "ĐẦU CỔ",
}


WORD_FIXES_RE = re.compile(
    r"(?<![^\W\d_])(" + "|".join(map(re.escape, WORD_FIXES)) + r")(?![^\W\d_])"
)


def clean(value: str | None) -> str:
    text = unicodedata.normalize("NFC", value or "")
    for bad, good in FIXES.items():
        text = text.replace(bad, good)
    text = WORD_FIXES_RE.sub(lambda m: WORD_FIXES[m.group(1)], text)
    text = re.sub(r"\s+", " ", text).strip(" .")
    return text


def suspicious(text: str) -> bool:
    return any(re.search(pattern, text, re.I) for pattern in BAD_PATTERNS)


payload = json.loads(SRC.read_text(encoding="utf-8"))
accepted, rejected = [], []

for q in payload["questions"]:
    if not q.get("id"):
        rejected.append({"id": None, "sourcePage": q.get("sourcePage"), "reasons": ["missing_question_record"]})
        continue
    reasons = list(q.get("issues", []))
    stem = clean(q.get("question"))
    explanation = clean(q.get("explanation"))
    options = {item["id"]: clean(item["text"]) for item in q.get("options", [])}

    if q.get("status") != "ready":
        reasons.append("failed_structural_gate")
    if set(options) != {"A", "B", "C", "D", "E"}:
        reasons.append("requires_exactly_five_options")
    if q.get("correctAnswer") not in options:
        reasons.append("answer_not_in_options")
    if not explanation or len(explanation) < 18:
        reasons.append("explanation_too_short")
    combined = " ".join([stem, explanation, *options.values()])
    if suspicious(combined):
        reasons.append("ocr_or_page_artifact")
    if q.get("requiresSourceImage"):
        reasons.append("requires_source_image")

    # Lỗi nội tại đã được xác nhận trực tiếp ở trang đáp án: khóa B nhưng lời giải
    # mô tả cơ chân bướm ngoài (phương án D). Không tự ý sửa nguồn; loại khỏi bank.
    if q.get("id") == "yhn-anatomy-head_neck-001":
        reasons.append("source_key_explanation_conflict")

    if reasons:
        rejected.append({"id": q["id"], "sourcePage": q.get("sourcePage"), "reasons": sorted(set(reasons))})
        continue

    accepted.append({
        "id": q["id"],
        "region": REGIONS[q["section"]],
        "stem": stem,
        "options": options,
        "answer": q["correctAnswer"],
        "explanation": explanation,
        "source": {
            "title": "Giải Phẫu Người, Đại học Y Hà Nội (2006)",
            "questionPage": q.get("sourcePage"),
            "answerPage": q.get("answerPage"),
        },
    })

result = {
    "schemaVersion": 2,
    "source": {
        "title": "Giải Phẫu Người, Đại học Y Hà Nội (2006)",
        "section": "Phần III — Bộ câu hỏi trắc nghiệm",
        "note": "Bản đã qua cổng chất lượng tự động; câu phụ thuộc hình, thiếu lựa chọn, lỗi ghép trang và mâu thuẫn khóa đã bị loại.",
        "qualityPolicy": "Only structurally complete, five-option, non-image questions without detected OCR/page artifacts.",
    },
    "questions": accepted,
}
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

counts = {}
for item in accepted:
    counts[item["region"]] = counts.get(item["region"], 0) + 1
reason_counts = {}
for item in rejected:
    for reason in item["reasons"]:
        reason_counts[reason] = reason_counts.get(reason, 0) + 1

lines = [
    "BÁO CÁO CỔNG CHẤT LƯỢNG NGÂN HÀNG GIẢI PHẪU",
    f"Đạt cổng tự động: {len(accepted)}",
    f"Bị loại/chờ hiệu đính: {len(rejected)}",
    "",
    "Theo vùng:",
    *[f"- {key}: {value}" for key, value in sorted(counts.items())],
    "",
    "Lý do loại:",
    *[f"- {key}: {value}" for key, value in sorted(reason_counts.items())],
    "",
    "Lưu ý: cổng tự động xác nhận cấu trúc, dấu hiệu OCR và truy vết nguồn; không thay thế duyệt chuyên môn từng câu.",
]
REPORT.write_text("\n".join(lines), encoding="utf-8")
# ensure_ascii=True: console Windows mặc định cp1252, in tên vùng tiếng Việt ra
# stdout là văng UnicodeEncodeError sau khi đã ghi tệp xong — báo lỗi giả.
print(json.dumps({"accepted": len(accepted), "rejected": len(rejected), "regions": counts, "reasons": reason_counts}, ensure_ascii=True, indent=2))
