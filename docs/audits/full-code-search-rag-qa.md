# Kiểm tra code và tìm kiếm RAG — 14/10/2026

## Thay đổi đã hoàn thành

- Tìm kiếm công khai dùng chung một bộ truy xuất cho ô tìm kiếm trang chủ, trang `/tim-kiem` và API `/api/search`. Kết quả gồm mô hình thật, 30 bộ đề PDF và hướng dẫn tính năng hiện có. Có lọc loại kết quả, phân trang, tìm không dấu, điều hướng bằng bàn phím và liên kết mở đúng bộ đề hoặc công cụ PDF/Word.
- AI truy xuất hướng dẫn hệ thống và manifest bộ đề hiện tại trước khi diễn giải. Prompt chứa nội dung nguồn và đường dẫn. Kiểm tra chỉ số trích dẫn; khi nhà cung cấp lỗi hoặc trích dẫn không hợp lệ, trả nội dung truy xuất có nguồn. Có timeout, hủy yêu cầu cũ và xử lý dữ liệu nguồn sai định dạng. Tài liệu cá nhân không được đưa vào kho tìm kiếm công khai.
- Phân biệt truy vấn hệ thống, y khoa và thú y; không dùng mô hình người hoặc đề giải phẫu người làm nguồn cho yêu cầu mô hình động vật. Loại bỏ mô tả trang trắc nghiệm thú y chưa tồn tại và sửa liên kết tính năng sai.
- Sửa nguyên nhân hydration ở iframe Vision: bỏ phiên bản ngày tháng gõ tay, tách thư mục build development `.next-dev` khỏi production `.next`. Sửa vòng lặp redirect trang production `/thu-vien` bằng cấu hình `skipProxyUrlNormalize`, kiểm tra bằng máy chủ standalone thật.
- Backend kiểm tra query tìm kiếm qua DTO: độ dài, chuỗi, giới hạn số nguyên 1–30; dữ liệu không hợp lệ trả 400. Sửa `start:prod` thành `node dist/src/main.js`, đúng đầu ra build hiện tại.

## Kết quả xác minh

| Phạm vi | Kết quả |
| --- | --- |
| Frontend: lint, TypeScript, build production | Đạt; build sinh 670 trang |
| Frontend: nhóm kiểm thử và xác minh dữ liệu | 36/36 nhóm đạt, gồm 45 unit test |
| Backend: unit test | 62/62 đạt, 10 suite |
| Backend: HTTP với AppModule thật và ValidationPipe | 18/18 đạt |
| Backend: lint và build | Đạt, lint 0 lỗi/0 cảnh báo |
| Back office: unit test, lint, TypeScript, build | 7/7 test đạt; các kiểm tra còn lại đạt |
| Production frontend: tìm kiếm/RAG và liên kết tính năng | 13/13 đạt trên standalone server |
| Backend đang chạy, cổng 4000 | `/api/health` 200, DB up; limit=2.5 và query dạng mảng trả 400 |
| Giao diện tìm kiếm/AI | Kiểm tra tiếng Việt, sáng/tối, desktop và mobile 375px; đáp án thật có nguồn; không có lỗi console/hydration trên trang tìm kiếm |
| Ô tìm kiếm trang chủ bằng bàn phím | Enter mở `/tim-kiem?q=PDF`; ArrowDown rồi Enter mở `/quiz?tool=pdf` và công cụ tài liệu cũ |

Kiểm thử production dùng nhà cung cấp AI giả lập cục bộ để tái hiện lỗi provider, trích dẫn sai và yêu cầu vượt giới hạn, không dùng khóa AI thật. Giao diện được kiểm tra thêm với AI đã cấu hình sẵn: đề Giải phẫu chi trên trả 145 câu, 145 câu chấm điểm, 91 câu có ảnh và liên kết `/quiz?de=giai-phau-chi-tren`.

Đối chiếu bộ đề ở đợt trước: 30 PDF, 2810 câu hỏi, 1417 lượt ảnh, 837 ảnh duy nhất; audit không có sai khác với dữ liệu nguồn đã nhập. Ảnh giải thích chỉ hiện sau khi kiểm tra đáp án trong luyện tập hoặc sau khi nộp bài thi; ảnh cần để đọc câu hỏi vẫn hiện trước khi trả lời. Báo cáo chi tiết: `quiz-source-audit.json` và `quiz-vision-release-qa.md`.

## Bằng chứng và cách chạy lại

- `full-functional-tests.json`: kết quả từng nhóm test, mã thoát và output.
- `rag-api-qa.json`: kết quả API trên production mới nhất, gồm kiểm tra URL tính năng và biên API ẩn danh.
- `backend-lint.json`: kết quả lint backend.
- `search-ai-final.png`, `search-ai-dark-final.png`, `search-mobile-final.png`: giao diện thực tế.
- Frontend: `node scripts/audit-functional-checks.mjs`; sau `npm run build`, chạy `node scripts/qa-rag-api.mjs`.
- Backend: `npm test -- --runInBand`, `npm run test:e2e -- --runInBand`, `npm run build`, `npm run start:prod`.

## Giới hạn của đợt kiểm tra

Các luồng đăng nhập bằng tài khoản thật, gửi email/OAuth, tải tài liệu cá nhân có đăng nhập và thao tác quản trị ghi dữ liệu chưa được chạy từ đầu đến cuối bằng tài khoản người dùng. Guard, parser, session và xử lý lỗi liên quan được kiểm tra tự động. Camera/microphone thật chưa được bật; Vision đã có kiểm thử nhận diện cử chỉ, chuyển hệ, reset vị trí, bố cục và renderer bằng dữ liệu kiểm thử ở báo cáo trước. Một cảnh báo precision của trình biên dịch GPU trên Vision là cảnh báo không gây lỗi, không phải hydration.

Các kiểm tra đạt chứng minh những hành vi trong phạm vi trên. Không có phép đo đủ cơ sở để tuyên bố độ ổn định 98% hoặc mọi chức năng hoàn hảo.
