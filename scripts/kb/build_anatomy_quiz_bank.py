"""Bóc ngân hàng trắc nghiệm giải phẫu theo TỪNG VÙNG, kèm truy vết trang nguồn.

    python scripts/kb/build_anatomy_quiz_bank.py <giao-trinh.pdf> <thu-muc-out>

Đây là bản kế thừa `parse_anatomy_mcq.py`. Khác biệt đáng kể:
 1. đọc theo KHOẢNG TRANG khai báo sẵn cho từng vùng cơ thể, nên biết chính xác
    một câu nằm ở trang nào và đáp án nó nằm ở trang nào — về sau cổng chất
    lượng và người hiệu đính đối chiếu được với sách giấy;
 2. quét MỌI dấu đáp án rồi giữ bản có lời giải dài nhất: sách bị lặp trang,
    trang lặp sau thường OCR sạch hơn trang trước;
 3. nhận diện nhóm câu dùng chung phương án và câu phụ thuộc hình, đánh dấu
    `requiresSourceImage` thay vì lặng lẽ bỏ.

Xuất ba tệp vào <thu-muc-out>:
 - giai-phau-yhn-ngan-hang-kiem-tra.json  (toàn bộ, kèm cờ lỗi từng câu)
 - giai-phau-yhn-ung-vien-hieu-dinh.json  (chỉ câu đạt cấu trúc)
 - giai-phau-yhn-bao-cao-kiem-tra.txt     (báo cáo cho người duyệt)

KHÔNG nhập thẳng đầu ra vào `public/kb/`: phải qua `curate_anatomy_bank.py` rồi
mới tới người có chuyên môn duyệt.
"""
import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

if len(sys.argv) != 3:
    raise SystemExit(__doc__)

SOURCE = Path(sys.argv[1])
OUT_DIR = Path(sys.argv[2])
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_ALL = OUT_DIR / "giai-phau-yhn-ngan-hang-kiem-tra.json"
OUT_READY = OUT_DIR / "giai-phau-yhn-ung-vien-hieu-dinh.json"
OUT_REPORT = OUT_DIR / "giai-phau-yhn-bao-cao-kiem-tra.txt"

reader = PdfReader(str(SOURCE), strict=False)

# Số trang lấy từ chính bản PDF "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen". Đổi bản
# in khác thì phải dò lại, đừng tin số này.
SECTIONS = [
    {"key": "lower_limb", "label": "Chi dưới", "questionPages": (447, 453), "answerPages": (454, 457), "count": 59},
    {"key": "upper_limb", "label": "Chi trên", "questionPages": (458, 468), "answerPages": (468, 473), "count": 88},
    {"key": "pelvis_perineum", "label": "Chậu hông và đáy chậu", "questionPages": (474, 479), "answerPages": (479, 481), "count": 42},
    {"key": "abdomen", "label": "Bụng", "questionPages": (482, 488), "answerPages": (488, 490), "count": 53},
    {"key": "head_neck", "label": "Đầu cổ", "questionPages": (491, 504), "answerPages": (504, 510), "count": 98},
    # KHÔNG có mục "Ngực" — và đây không phải chỗ quên khai báo.
    #
    # Sách có "6. PHẦN NGỰC" thật, câu hỏi bắt đầu ở trang 511 ("6.1. Thành
    # ngực") và chạy tới hết trang 515. Nhưng BẢN PDF ĐANG DÙNG CHỈ CÓ 515
    # TRANG: phần đáp án và lời giải của vùng ngực nằm ở những trang sau đó,
    # không có trong bản quét này. Bóc câu hỏi mà không có khoá đáp án thì
    # không chấm được, nên vùng ngực bị để ngoài ngân hàng một cách CÓ Ý.
    #
    # Muốn bổ sung: cần bản quét đầy đủ (kiểm bằng `len(PdfReader(...).pages)`,
    # phải lớn hơn 515), rồi thêm vào đây một mục
    #   {"key": "thorax", "label": "Ngực", "questionPages": (511, 515),
    #    "answerPages": (<trang đầu đáp án>, <trang cuối>), "count": <số câu>}
    # và chạy lại build → curate như các vùng khác.
]

def clean(text: str) -> str:
    text = text.replace("­", "").replace("\x00", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    return re.sub(r"\s+", " ", text).strip(" .\n")

def pages_text(start: int, end: int, layout: bool = True) -> str:
    chunks = []
    for page_no in range(start, end + 1):
        text = reader.pages[page_no - 1].extract_text(extraction_mode="layout") if layout else reader.pages[page_no - 1].extract_text()
        chunks.append(f"\n<<<PAGE:{page_no}>>>\n{text or ''}")
    return "".join(chunks)

def nearest_page(text: str, pos: int) -> int | None:
    matches = list(re.finditer(r"<<<PAGE:(\d+)>>>", text[:pos]))
    return int(matches[-1].group(1)) if matches else None

def option_map(text: str) -> dict[str, str]:
    # Layout extraction preserves option columns as large spaces.
    pattern = re.compile(r"(?m)(?:^|\s{3,})([A-Ka-kc])\.\s+")
    matches = list(pattern.finditer(text))
    result = {}
    for i, match in enumerate(matches):
        label = match.group(1).upper()
        if label == "C":
            label = "C"
        value = clean(text[match.end(): matches[i + 1].start() if i + 1 < len(matches) else len(text)])
        value = re.sub(r"<<<PAGE:\d+>>>", " ", value)
        value = re.sub(r"\s+\d{3}\s*$", "", value).strip()
        if label not in result and value:
            result[label] = value
    return result

def sequential_markers(text: str, count: int, answer: bool = False):
    markers = []
    cursor = 0
    for number in range(1, count + 1):
        if answer:
            pattern = re.compile(rf"(?m)^\s*{number}\s*[-:]\s*([A-Ka-k])(?:[\.:;\s]|$)")
        else:
            pattern = re.compile(rf"(?m)^ {{3,9}}{number}\.\s+")
        match = pattern.search(text, cursor)
        if match:
            markers.append((number, match))
            cursor = match.end()
    return markers

def parse_answers(section):
    text = pages_text(*section["answerPages"], layout=False)
    answers = {}
    # Scan every valid answer marker; later duplicate pages repair poor OCR in earlier pages.
    marker_re = re.compile(r"(?m)^\s*(\d{1,3})\s*[-:]\s*([A-Ka-k])(?:[\.:;\s]|$)")
    matches = list(marker_re.finditer(text))
    for i, match in enumerate(matches):
        number = int(match.group(1))
        if not 1 <= number <= section["count"]:
            continue
        answer = match.group(2).upper()
        explanation = clean(text[match.end(): matches[i + 1].start() if i + 1 < len(matches) else len(text)])
        explanation = re.sub(r"<<<PAGE:\d+>>>", " ", explanation)
        explanation = re.sub(r"\s+\d{3}\s*$", "", explanation).strip()
        candidate = {"answer": answer, "explanation": explanation, "page": nearest_page(text, match.start())}
        if number not in answers or len(explanation) > len(answers[number]["explanation"]):
            answers[number] = candidate
    return answers

def parse_questions(section, answers):
    text = pages_text(*section["questionPages"], layout=True)
    # Keep only the question portion when an answer heading shares the last page.
    answer_heading = re.search(r"(?im)^.*ĐÁP\s+ÁN.*GIẢI\s+THÍCH.*$", text)
    if answer_heading:
        text = text[:answer_heading.start()]
    markers = sequential_markers(text, section["count"], answer=False)
    by_number = {number: match for number, match in markers}
    groups = {}
    questions = []
    for number in range(1, section["count"] + 1):
        match = by_number.get(number)
        next_match = by_number.get(number + 1)
        if not match:
            questions.append({"number": number, "issues": ["missing_question_marker"]})
            continue
        end = next_match.start() if next_match else len(text)
        block = text[match.end():end]
        # Group instructions and shared options are usually printed at the end of the previous item.
        group_match = re.search(r"(?is)(?:Các\s+câu\s+hỏi\s+)?(\d{1,3})\s*[-–]\s*(\d{1,3}).*?(?:Hãy|Dùng|Sử dụng)", block)
        if not group_match:
            group_match = re.search(r"(?is)Hãy.*?\((\d{1,3})\s*[-–]\s*(\d{1,3})\)", block)
        if group_match:
            group_start = group_match.start()
            group_text = block[group_start:]
            start_no, end_no = int(group_match.group(1)), int(group_match.group(2))
            groups[(start_no, end_no)] = {
                "options": option_map(group_text),
                "instruction": clean(re.split(r"(?m)(?:^|\s{3,})[A-Ka-kc]\.\s+", group_text, maxsplit=1)[0]),
                "imageDependent": bool(re.search(r"sơ\s*đồ|hình\s+(?:dưới|sau|bên)", group_text, re.I)),
            }
            block = block[:group_start]
        options = option_map(block)
        stem_end = len(block)
        option_first = re.search(r"(?m)(?:^|\s{3,})[A-Ka-kc]\.\s+", block)
        if option_first:
            stem_end = option_first.start()
        stem = clean(re.sub(r"<<<PAGE:\d+>>>", " ", block[:stem_end]))
        shared = None
        for (start_no, end_no), group in groups.items():
            if start_no <= number <= end_no:
                shared = group
                break
        if not options and shared:
            options = shared["options"]
        answer_data = answers.get(number)
        issues = []
        if not stem or len(stem) < 8:
            issues.append("missing_or_short_stem")
        if len(options) < 2:
            issues.append("missing_options")
        if not answer_data:
            issues.append("missing_answer")
        elif answer_data["answer"] not in options:
            issues.append("answer_not_in_options")
        image_dependent = bool(re.search(r"sơ\s*đồ|hình\s+(?:dưới|sau|bên)", stem, re.I)) or bool(shared and shared["imageDependent"])
        if image_dependent:
            issues.append("requires_source_image")
        if any(token in stem for token in ("<<<PAGE", "ĐÁP ÁN")):
            issues.append("page_artifact")
        questions.append({
            "id": f"yhn-anatomy-{section['key']}-{number:03d}",
            "section": section["key"],
            "sectionLabel": section["label"],
            "number": number,
            "question": stem,
            "options": [{"id": key, "text": value} for key, value in sorted(options.items())],
            "correctAnswer": answer_data["answer"] if answer_data else None,
            "explanation": answer_data["explanation"] if answer_data else None,
            "sourcePage": nearest_page(text, match.start()),
            "answerPage": answer_data["page"] if answer_data else None,
            "sharedInstruction": shared["instruction"] if shared else None,
            "requiresSourceImage": image_dependent,
            "status": "ready" if not issues else "review",
            "issues": issues,
        })
    return questions

all_questions = []
section_stats = []
for section in SECTIONS:
    answers = parse_answers(section)
    questions = parse_questions(section, answers)
    all_questions.extend(questions)
    section_stats.append({
        "key": section["key"],
        "label": section["label"],
        "expected": section["count"],
        "answersFound": len(answers),
        "ready": sum(q.get("status") == "ready" for q in questions),
        "review": sum(q.get("status") == "review" for q in questions),
    })

source_meta = {
    "title": "Giải Phẫu Người Y Hà Nội 2006 - Bộ câu hỏi trắc nghiệm",
    "sourceFile": str(SOURCE),
    "questionPages": "447-504",
    "answerPages": "454-510",
    "note": "Part 6 (chest) is excluded because the supplied PDF ends before its answer key.",
}
payload = {"schemaVersion": 1, "source": source_meta, "stats": section_stats, "questions": all_questions}
ready = [q for q in all_questions if q.get("status") == "ready"]
ready_payload = {
    "schemaVersion": 1,
    "source": source_meta,
    "importPolicy": "DO_NOT_AUTO_IMPORT: structurally complete candidates; Vietnamese OCR and clinical answer consistency still require human proofreading.",
    "questions": ready,
}
OUT_ALL.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
OUT_READY.write_text(json.dumps(ready_payload, ensure_ascii=False, indent=2), encoding="utf-8")

issue_counts = {}
for question in all_questions:
    for issue in question.get("issues", []):
        issue_counts[issue] = issue_counts.get(issue, 0) + 1
report = [
    "BÁO CÁO KIỂM TRA NGÂN HÀNG ĐỀ GIẢI PHẪU Y HÀ NỘI",
    f"Tổng câu có khóa đáp án dự kiến: {sum(s['expected'] for s in section_stats)}",
    f"Câu đạt kiểm tra cấu trúc (chưa duyệt nội dung): {len(ready)}",
    f"Câu lỗi cấu trúc/thiếu dữ liệu: {len(all_questions) - len(ready)}",
    "",
]
for stat in section_stats:
    report.append(f"- {stat['label']}: dự kiến {stat['expected']}; tìm thấy đáp án {stat['answersFound']}; đạt cấu trúc {stat['ready']}; có bản ghi lỗi {stat['review']}")
report.extend(["", "Lý do cần xem lại:"])
for issue, count in sorted(issue_counts.items()):
    report.append(f"- {issue}: {count}")
report.extend([
    "",
    "Phần ngực không được nhập: bản PDF kết thúc ở trang 515 trước khi xuất hiện khóa đáp án.",
    "Các câu cần hình nguồn không được đưa vào tệp ứng viên hiệu đính.",
    f"KHÔNG TỰ ĐỘNG NHẬP {len(ready)} CÂU ỨNG VIÊN: lớp chữ PDF lỗi dấu tiếng Việt ở nhiều vị trí.",
    "Phát hiện khóa/giải thích có thể mâu thuẫn ngay trong nguồn (ví dụ Đầu cổ câu 1: khóa B nhưng giải thích mô tả cơ chân bướm ngoài).",
    "Chỉ nhập sau khi người có chuyên môn đối chiếu từng câu với trang nguồn và duyệt nội dung.",
])
OUT_REPORT.write_text("\n".join(report), encoding="utf-8")
print(json.dumps({"stats": section_stats, "ready": len(ready), "review": len(all_questions) - len(ready), "issues": issue_counts}, ensure_ascii=True, indent=2))
