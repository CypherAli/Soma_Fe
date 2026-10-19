# Đánh giá lại bản phát hành — 14/10/2026

Phạm vi: chức năng công khai ngoài đăng nhập; đọc dữ liệu, tìm kiếm, AI theo nguồn, bộ đề, tài liệu PDF, renderer và điều khiển Vision, điều hướng, đa ngữ, sáng/tối và responsive. Không triển khai lên hosting, không gửi email thật, không sửa nội dung y khoa thành trạng thái đã được chuyên gia duyệt.

## Kết luận

Trong phạm vi đã chạy không còn lỗi chặn sử dụng tái hiện được. Bản công khai đủ ổn để demo các luồng đã xác minh. Đã tìm và sửa thêm năm nhóm vấn đề dưới đây, rồi build và chạy lại kiểm tra production. Không có cơ sở để gán con số 100% hoặc 98% cho độ ổn định tổng thể: quét HTTP không thay thế kiểm thử tương tác trên từng trang, và kiểm thử mô phỏng không thay thế webcam/microphone thật.

## Những vấn đề đã khắc phục trong đợt này

| Vấn đề thực tế | Thay đổi và kiểm chứng |
| --- | --- |
| Câu hỏi dài về đề Y Hà Nội đưa nhiều bộ đề không liên quan vào kết quả và nguồn AI; tên đề số 10 có thể khớp đề 1 | Dùng tên đầy đủ và ranh giới từ/số, giới hạn bộ đề theo chủ đề được yêu cầu. Đề 10/11 không có trong nguồn không còn bị khớp thành đề 1. So sánh hai đề vẫn giữ cả hai nguồn. Unit test hồi quy đạt; AI thật trả 145 câu, 91 câu có ảnh với đúng hai nguồn liên quan. |
| Thiếu vùng nội dung chính cho trình đọc màn hình ở trang chủ, người, thú y và chính sách | Bổ sung `main` vào bảy component/trang dùng chung; giữ menu/footer ở ngoài vùng chính. Bản production kiểm tra lại có đúng landmark và ngôn ngữ. |
| Footer báo đã lưu dù mạng/server lỗi; API chỉ ghi email vào log | Lưu đăng ký vào kho JSONL phía server trước khi trả thành công; không ghi email vào console hoặc localStorage. Gộp đăng ký trùng, giới hạn tần suất, kiểm tra cùng origin. UI chờ máy chủ, khóa gửi lặp và báo lỗi lưu. Unit test, API production và UI thật đã xác minh cả thành công/lỗi; dữ liệu giả lập đã dọn. |
| Thanh chuyển trang PDF có thể bị menu sticky che, bấm nhầm sang điều hướng | Đo chiều cao menu bằng ResizeObserver; đặt vị trí sticky và scroll margin của trình đọc bên dưới menu. UI xác minh trang 11 → 12 → 11 giữ nguyên URL, phóng to 120% và khôi phục 100%; kiểm tra thêm mobile. |
| Header chung bị cắt nút bên phải ở màn hình 375px | Thu gọn logo, khoảng cách và nút điều khiển trên toàn bộ header chung. Nút bên phải kết thúc ở khoảng x=350 trong viewport 375px; desktop 1280px vẫn đúng. |

## Kết quả cuối

| Kiểm tra | Kết quả |
| --- | --- |
| Frontend lint, TypeScript và production build cuối | Đạt; build sinh 670 trang |
| Bộ kiểm tra chức năng/dữ liệu frontend | 36/36 nhóm đạt, gồm 66 unit test |
| Quét URL public production, gồm các ngôn ngữ và liên kết từ nội dung | 925/925 URL đạt |
| Tài nguyên được tham chiếu trong HTML và các tài nguyên nền tảng | 273/273 đạt |
| URL không tồn tại và trang debug chủ đích ẩn ở production | 6/6 trả 404 đúng |
| API production: tìm kiếm/RAG, Vision và đăng ký nhận tin | 26/26 đạt; bên trong có thêm 17 trường hợp biên API ẩn danh |
| Backend unit test và HTTP test với AppModule thật | 84/84 unit, 19/19 HTTP đạt |
| Back office unit, lint và TypeScript | 7/7 unit, lint/typecheck đạt; không sửa code back office |
| Đối chiếu PDF gốc độc lập bằng vị trí câu/ảnh, đáp án, SHA-256 | 30 PDF, 2810 câu, 11193 lựa chọn, 1417 lượt ảnh; 0 sai khác |
| Nội dung bệnh lý từ backend thật | 106 bài, không thiếu chi tiết tiếng Việt, không thiếu nguồn hay trường nội dung yêu cầu |

Kiểm tra tương tác Vision dùng renderer/mô hình thật và tín hiệu tay giả lập qua trang fixture tạm: tay trái phát lệnh, mô hình cũ tan thành hạt trước khi đổi, mô hình mới về góc trước/1× và xóa lựa chọn cũ; danh sách/tìm kiếm/nhãn của 144 cấu trúc; hệ nội tiết và hô hấp được căn giữa; mô hình nằm trên bảng điều khiển ở khung 375×744. Sáu bước đều đạt. Fixture đã xóa khỏi `public`, không đưa vào bản phát hành.

Quiz: khôi phục bài lưu giữ nguyên câu đã trả lời, câu chưa kiểm tra không hiện hình giải thích, câu đã kiểm tra hiện đúng hình nguồn. Không nộp hoặc ghi đè bài lưu có sẵn để làm thử. Chấm điểm, nhiều đáp án, làm lại câu sai, storage lỗi, thời gian và hiển thị ảnh được kiểm tra tự động trong các nhóm test.

Tài liệu công khai: danh mục tải được 18 nguồn; tra cứu có kết quả và mã đoạn, mở đúng trang PDF nguồn và canvas/text layer tải được; các điều khiển trang và zoom hoạt động. Nội dung tiếng Anh trong tài liệu nguồn được giữ nguyên, giao diện điều khiển dùng tiếng Việt.

## Những điểm chưa thể nghiệm thu hoàn toàn

- **Duyệt nội dung:** theo xác nhận trực tiếp của chủ website ngày 14/10 đã ghi nhận 106 bài, `needsReview=false`, còn 0 bài chờ duyệt và có 106 bản ghi audit. Nội dung/nguồn/trích dẫn giữ nguyên theo SHA-256. Đây là xác nhận của chủ website, không phải thẩm định y khoa độc lập; cờ xác minh nguồn không đổi. Bằng chứng trong `soma_be/docs/audits/owner-content-approval.json`.
- **Thiết bị thật:** đã bật micro trong IAB; engine khởi động nhưng dịch vụ nhận giọng nói báo `network`. Giao diện thoát nghe và báo lỗi đúng, chưa xác minh phiên âm tiếng nói thực tế. Webcam/góc tay/ánh sáng thật vẫn cần thử trên thiết bị demo; logic cử chỉ, renderer, hiệu ứng và reset đã được kiểm thử. Chi tiết trong `microphone-search-models-final-2026-10-14.md`.
- **Luồng cần tài khoản:** sau khi người dùng mở rộng phạm vi và đăng nhập ngày 14/10, đã chạy 38/38 kiểm tra API với tài khoản hiện hữu và PostgreSQL thật, gồm PDF/Word cá nhân, duyệt câu, điểm/lịch ôn, lộ trình, bộ nhớ chat và quản trị chỉ đọc. Browser kiểm tra sửa/duyệt đề, làm bài 1/2 và đối chiếu bản ghi, bung lộ trình cũ; dữ liệu thử đã dọn, dữ liệu cũ được so sánh và khôi phục đúng. Có thêm bản sửa đồng hồ thi, xác thực dữ liệu lượt làm bài, gộp lịch ôn trùng và chặn mã câu cá nhân không hợp lệ. Chi tiết trong `soma_be/docs/audits/account-database-qa-2026-10-14.md`. Chưa kiểm chứng tự động hộp chọn file của IAB, OAuth, đổi mật khẩu hoặc quản trị ghi dữ liệu chuyên môn.
- **Lưu nhận tin khi triển khai:** kho JSONL hiện phù hợp một máy chủ. Cần đặt `SOMA_NEWSLETTER_FILE` trên volume lưu bền; ổ đĩa tạm của hosting không đảm bảo giữ đăng ký qua lần triển khai mới. Hướng dẫn đã thêm vào README. Nếu chạy nhiều máy chủ cần kho dữ liệu dùng chung. Chức năng hiện ghi nhận đăng ký, không tự gửi chiến dịch email.

## Bằng chứng và chạy lại

- `public-release-qa.json`: từng URL, tài nguyên, mã HTTP và ngôn ngữ của bản production cuối.
- `rag-api-qa.json`: 26 kiểm tra API, gồm mất provider, trích dẫn sai, quota, lưu trùng, lỗi lưu, ngôn ngữ hỏi bệnh lý và nguồn tóm tắt bài.
- `full-functional-tests.json`: 36 nhóm test và output, frontend unit mới nhất 66 ca.
- `quiz-source-audit.json`: đối chiếu vật lý 30 PDF gốc, không dùng cùng event stream với bộ nhập.
- `pathology-content.json`: kiểm kê nội dung và trạng thái duyệt từ backend đang chạy.
- `vision-reaudit.png`, `pdf-mobile-reaudit.png`, `search-reaudit.png`: ảnh kiểm tra giao diện.

Sau `npm run build`, chạy `node scripts/qa-public-release.mjs` và `node scripts/qa-rag-api.mjs` để kiểm tra production. Chạy `node scripts/audit-functional-checks.mjs` để kiểm tra các nhóm chức năng/dữ liệu. Các test API chỉ dùng email giả lập, provider cục bộ, không gửi email thật; file thử và các junction chỉ phục vụ kiểm thử được dọn sau khi chạy.
