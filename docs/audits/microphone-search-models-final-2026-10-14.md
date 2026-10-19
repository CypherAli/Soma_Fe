# Kiểm tra cuối: micro, tìm kiếm, hộp hỏi và mô hình — 14/10/2026

## Kết luận

Các kiểm tra tự động và luồng tài khoản liệt kê dưới đây đều đạt trên bản build cuối. Đã thao tác giao diện tìm kiếm, hỏi AI và mô hình thật. Dịch vụ nhận giọng nói trong Codex In-app Browser trả lỗi `network` sau khi micro khởi động; chưa thể xác nhận độ chính xác phiên âm tiếng nói thực tế hoặc cử chỉ webcam thật trong lượt này. Không quy đổi số test đạt thành độ ổn định 98%/100%.

## Thay đổi đã hoàn tất

- **106 bài bệnh lý:** ghi nhận xác nhận của chủ website bằng API quản trị với tài khoản hiện hữu, `needsReview=false`, còn **0 bài chờ duyệt**. Có 106 bản ghi audit. So sánh SHA-256 xác minh nội dung, trích dẫn và nguồn không đổi. Đây là xác nhận của chủ website; không ghi thành một cuộc thẩm định y khoa độc lập và không đổi cờ xác minh của nguồn. Bằng chứng: `soma_be/docs/audits/owner-content-approval.json`.
- **Micro trợ lý:** dùng controller chung cho nghe một lần/liên tục. Hủy callback muộn, chỉ gửi câu đã nhận diện hoàn tất, giữ các đoạn nói trước, dừng khi rời trang/đổi tài khoản, kiểm soát lỗi quyền/thiết bị/mạng. Thời gian khởi động tối đa 10 giây; lỗi mạng không tạo vòng lặp khởi động. Khi loa đọc, micro liên tục tạm nghỉ để tránh nhận tiếng của chính trợ lý. Chờ danh sách giọng đọc và chọn đúng ngôn ngữ.
- **Micro Vision:** xử lý lỗi tạo engine, khởi động, mất mạng và quá thời gian chờ; vẫn dùng được thanh lệnh văn bản khi nhận giọng nói không hoạt động.
- **Các hộp hỏi:** hủy request cũ khi đổi bài/ngôn ngữ/chế độ, đóng/clear hoặc đổi tài khoản. Phản hồi muộn không ghi vào hội thoại mới. Tóm tắt bệnh lý lấy các đoạn từ chính bài đang mở, kể cả khi câu hỏi không chứa từ khóa bệnh. Trích dẫn ngoài danh sách nguồn bị từ chối và trả nội dung nguồn có kiểm soát. Giao diện Anh/Trung ghi rõ đoạn nguồn tiếng Việt.
- **Tìm kiếm:** đồng bộ từ khóa với URL khi điều hướng, hủy câu trả lời AI của truy vấn cũ. Đã xác minh tra cứu không dấu, bàn phím và câu hỏi về chính tính năng Soma có nguồn liên kết.
- **Mô hình:** kiểm tra toàn bộ GLB về cấu trúc file, buffer, mesh, accessor, node và transform; kiểm tra scene/hotspot/lesion với node thật. Canvas atlas dùng mô tả trợ năng đúng ngôn ngữ. Không đổi hoặc giản lược hình học trong lượt này.
- **Khôi phục mật khẩu:** không báo gửi thành công khi gửi mail thất bại; dọn chính token mới không sử dụng, không ghi token/liên kết reset vào log. SMTP xác minh kết nối và xác thực thành công, không gửi mail hay đổi mật khẩu người dùng.
- **OAuth:** endpoint capabilities chỉ trả cờ bật/tắt; UI vô hiệu hóa nhà cung cấp chưa cấu hình thay vì dẫn người dùng đến lỗi JSON. Google/GitHub/Facebook hiện chưa cấu hình.

## Kết quả kiểm thử bản cuối

| Phạm vi | Kết quả và giới hạn |
| --- | --- |
| Frontend lint, TypeScript, production build | Đạt, 670 trang được sinh |
| Chức năng/dữ liệu frontend | 36/36 nhóm; 66/66 unit test, gồm 13 ca micro và 2 ca lấy đoạn bài bệnh lý |
| Quét HTTP production | 925/925 URL, 273/273 tài nguyên, 6/6 trường hợp 404 đúng |
| API production | 26/26; kiểm tra biên ẩn danh bên trong 17/17; provider lỗi/quota/trích dẫn sai dùng provider thử cục bộ |
| Backend | 84/84 unit, 19/19 HTTP; lint và build đạt |
| Tài khoản + PostgreSQL thật | Chạy lại 38/38; PDF/DOCX, sửa/duyệt câu, ngân hàng, điểm, lịch ôn, lộ trình, bộ nhớ chat và phạm vi chủ sở hữu |
| Database chỉ đọc sau cleanup | 22/22, 15 migration, 20 khóa ngoại; không có dữ liệu mồ côi hoặc index lỗi |
| Backup/restore thật | Backup PostgreSQL khôi phục vào DB thử riêng; 22 bảng và 20 FK khớp. DB thử và dump đã dọn, không thay đổi DB đang dùng |
| Tải đọc cục bộ | 100 request, 20 đồng thời, 0 lỗi; p95 1086 ms. Không phải kiểm thử tải production quy mô lớn |
| Tính toàn vẹn GLB | 264/264 file đạt; không đồng nghĩa đã xem trực quan và thẩm định y khoa từng mô hình |
| Scene và dữ liệu 3D | 121 scene tham chiếu mô hình hợp lệ; 1310 hotspot, 49/49 tham chiếu tổn thương hợp lệ |
| Giọng nói/lệnh Vision | 194 assertion của bộ test đạt; không thay thế kiểm tra giọng nói hoặc bàn tay người thật |
| Back office | 7/7 unit, lint/typecheck đã đạt ở lượt trước; không sửa code BO trong lượt này |

Hai tài liệu cá nhân, 20 câu, ba lượt làm bài, 37 mục ôn và hai lộ trình gốc được giữ nguyên. Snapshot trước/sau kiểm thử tài khoản khớp. Chỉ dọn ID của dữ liệu thử; phiên đăng nhập browser người dùng được giữ, phiên QA được đăng xuất riêng. Không tạo tài khoản hoặc thay đổi quyền.

Lượt quét production đầu bị tiến trình Node trên Windows dừng đột ngột. Đã dọn đúng hai junction thử sau khi xác minh đích, giảm số request đồng thời của script từ 5 xuống 2 và chạy lại toàn bộ thành công. Đây là thay đổi công cụ kiểm thử, không phải thay đổi server ứng dụng.

## Giao diện thực tế đã xác minh

1. Trang người: tìm `co tay`, dùng ArrowDown chọn gợi ý, Escape bỏ chọn, Enter mở kết quả đầy đủ. Kết quả dẫn đúng atlas cổ tay.
2. Trang tìm kiếm: hỏi “Trang quiz có những công cụ nào?” trả lời từ hướng dẫn Soma, nêu đúng bốn công cụ, 30 đề/2810 câu và liên kết nguồn `/quiz`. Không ghi bộ nhớ chat trong database.
3. Atlas cổ tay: 26 mảnh BodyParts3D, tách lớp 45%, chọn Xương nguyệt, đối chiếu mã FJ3268, đổi góc và đặt lại. Hình 3D tải/render được, nhãn và chi tiết hoạt động.
4. Vision: lệnh văn bản “mở cổ tay” kích hoạt trạng thái “Đang tách thành hạt…” rồi render cổ tay. Tìm `nguyet` lọc đúng Xương nguyệt FJ3268, chọn cấu trúc và “tách lớp” kéo phần chọn ra. Chuyển mô hình tiếp sau khi đổi góc và chọn phần: render Bàn tay chi tiết, zoom 1.00×, tách 0%, ô tìm kiếm trống, thẻ phần cũ đóng. Camera được giữ tắt. FPS của tab nền IAB bị throttling nên không dùng để kết luận hiệu năng khi trình chiếu.
5. Quiz/Soma Bot: bật micro thành công, có trạng thái “Đang nghe…”, sau lỗi dịch vụ `network` nút trở lại “Nói với Soma”, hiện hướng dẫn lỗi mạng và vẫn có thể gõ. Không tự gửi câu hỏi rỗng hoặc dang dở.

Sau các thao tác trên, công cụ không ghi nhận lỗi console tại hai tab quiz và Vision.

## Phần còn phụ thuộc môi trường

- Nhận giọng nói thật cần thử Chrome/Edge có dịch vụ SpeechRecognition hoạt động và kết nối mạng. Code đã xử lý lỗi; không có bằng chứng đủ để kết luận phiên âm thật đạt.
- Webcam/tay trái thật cần thử trên thiết bị dùng demo. Logic, hiệu ứng, reset và renderer đã có kiểm thử; lượt này dùng thanh lệnh văn bản và kiểm tra tự động.
- OAuth cần khóa cấu hình nhà cung cấp. Chưa thử gửi email khôi phục hay đổi mật khẩu; chỉ xác minh SMTP và test lifecycle bằng mock.
- Hộp chọn file của IAB chưa được công cụ xác minh; upload multipart thật và phần sửa/duyệt/làm bài browser đã đạt.
- Khi triển khai cần volume lưu bền cho `SOMA_NEWSLETTER_FILE`; nếu dùng nhiều server cần kho đăng ký dùng chung. Chưa triển khai hay thay cấu hình hosting.

## Bằng chứng

- FE: `full-functional-tests.json`, `public-release-qa.json`, `rag-api-qa.json`, `glb-integrity-qa.json`.
- BE: `database-audit.json`, `authenticated-api-qa.json`, `owner-content-approval.json`, `backup-restore-qa.json`, `read-load-qa.json`.
- Giao diện: `microphone-network-final-qa.png`, `search-rag-final-qa.png`, `model-final-qa.png`, `vision-model-switch-final-qa.png`.

Các báo cáo nằm trong `docs/audits` của project tương ứng. Mật khẩu, token và cấu hình SMTP không có trong báo cáo.
