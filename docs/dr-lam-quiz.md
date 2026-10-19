# Bộ đề Đại học Y Hà Nội trên trang Quiz

Trang `/quiz` mở thư viện có 10 chủ đề: chi trên, chi dưới, đầu mặt cổ, mắt tai, ngực, bụng chậu, thần kinh, ca lâm sàng, ôn tập và thi thử. Tên hiển thị là **Đại học Y Hà Nội** theo yêu cầu. Tên file PDF gốc và dấu vết nguồn được giữ nguyên. Thanh công cụ đầu trang mở trực tiếp **Tạo đề & mô hình 3D**, **PDF & Word của tôi**, **Lộ trình ôn tập** và **AI tạo đề**, giữ nguyên các luồng tài liệu và nguồn học cũ. Thư viện và trình làm bài cũ giữ state khi chuyển mục. Có thể mở tài liệu khi đang luyện đề Y Hà Nội rồi trở lại đúng câu đang làm; thi thử vẫn tính thời gian. Với bài tạo từ công cụ cũ, thoát hoặc hoàn thành bài trước khi đổi mục.

30 PDF trong `Source_quiz_do_an` được nhập thành 30 đề, tổng cộng 2.810 câu. Mỗi đề được tải riêng khi chọn. Số thứ tự, nội dung phương án, hình câu hỏi, đáp án và gợi ý được giữ theo nguồn. Những câu lặp giữa các đề vẫn được giữ vì chúng thuộc các đề gốc khác nhau.

## Nhập lại dữ liệu

Chạy tại thư mục `Soma_Fe`, với Python có `pymupdf` và `Pillow`:

```powershell
$env:PYTHONIOENCODING='utf-8'
python scripts/kb/import_dr_lam.py 'C:\Users\trinh\Downloads\Source_quiz_do_an'
node --import ./scripts/ts-resolve.mjs scripts/verify-dr-lam-bank.ts
npm run build
```

Script trích chữ trực tiếp, lấy khóa đáp án từ nhãn hoặc vòng tròn màu xanh trong PDF. Script xử lý cả khóa nhiều phương án, dấu đáp án bị cắt tại ngắt trang và trường hợp nội dung phương án ở trang trước nhãn của nó. Không suy đoán đáp án từ kiến thức hay lời giải. Câu chưa có khóa, nếu gặp ở lần nhập sau, vẫn được giữ và loại khỏi mẫu số chấm điểm.

Các tiêu đề chung in đậm như **Về bộ răng sữa** được giữ thành `context` cho nhóm câu sau, có hoặc không có dấu hai chấm. Chúng không bị dính vào phương án hoặc lời giải của câu trước. Có thể dùng `--text-only` để cập nhật chữ mà giữ nguyên ảnh đã trích, chỉ khi SHA-256 của PDF vẫn khớp; không dùng ảnh lưu cũ nếu tài liệu nguồn thay đổi. Có thể chỉ định một id đề sau đường dẫn nguồn để nhập lại riêng đề đó. Các JSON được ghi qua tệp tạm rồi thay thế nguyên tệp để tránh trình duyệt đọc dở dữ liệu.

- `public/kb/dr-lam/index.json`: danh mục và số câu.
- `public/kb/dr-lam/<id>.json`: dữ liệu từng đề, trang nguồn và SHA-256 của PDF.
- `public/kb/dr-lam/images/`: hình đã trích, định danh theo hash để dùng chung giữa các đề.
- `public/kb/dr-lam/image-dimensions.json`: kích thước của ảnh để giữ bố cục trước khi tải ảnh.
- `public/kb/dr-lam/import-report.json`: đối chiếu số câu nhận diện trong PDF và câu cần kiểm tra.

Một số PDF có thông báo bản quét thiếu tài nguyên ảnh. Metadata `sourceNote` được giữ để đối chiếu nguồn, không hiển thị thông báo này trên giao diện theo yêu cầu. Chỉ những hình thực sự có trong PDF được trích.

## Làm bài và chấm điểm

Ảnh thuộc đề bài (`images`) hiện ngay. Ảnh thuộc phần gợi ý hoặc lời giải của PDF (`explanationImages`) chỉ hiện cùng lời giải: sau khi kiểm tra đáp án trong luyện tập, hoặc sau khi nộp bài trong thi thử. Chọn một phần đáp án ở câu nhiều lựa chọn chưa mở ảnh gợi ý. Ảnh bìa nguồn chỉ hiện ở màn thông tin đề, được ẩn khi làm bài để tránh lộ thông tin trả lời. Danh mục ghi đúng số câu có hình (bao gồm hình trong phần gợi ý).

Luyện tập hiện khóa đáp án sau khi chọn phương án; câu nhiều đáp án cần bấm **Kiểm tra đáp án**. Thi thử cho 45 giây mỗi câu và chỉ hiện khóa sau khi nộp hoặc hết giờ. Câu nhiều đáp án được tính đúng khi chọn đủ và chỉ các phương án trong khóa.

Đúng, sai và bỏ qua là ba nhóm không trùng nhau. Kho câu sai gồm câu sai và câu bỏ qua từ các bài đã nộp; khi làm đúng trong lần ôn tiếp theo, câu đó được xóa khỏi kho. Có thể xáo trộn thứ tự câu nhưng luôn giữ nhãn A/B/C/D của nguồn.

Tiến độ, bài đang làm và kho câu sai lưu tại `localStorage` với khóa `soma.dr-lam.quiz.v1`, riêng trên trình duyệt hiện tại. Bài lưu được khôi phục qua nút **Tiếp tục bài đã lưu**. Chế độ thi thử tính thời gian đã trôi qua kể cả khi rời trang.

## Đối chiếu nguồn và cấu trúc code

`npm run audit:dr-lam-source` chạy bộ đối chiếu độc lập với luồng event của importer. Script kiểm tra SHA-256 của 30 PDF, ranh giới câu theo tọa độ trang, khung từng phương án để ghép chính xác nhãn A/B/C/D với chữ (kể cả khung bị cắt ở ngắt trang), text đề bài/lời giải, ngữ cảnh chung gần nhất, dấu đáp án và hash của ảnh nhúng. Báo cáo `docs/audits/quiz-source-audit.json` ghi trang, bbox, xref, URL và phần sở hữu của từng ảnh. Kết quả hiện tại: 2.810 câu, 1.417 lượt ảnh, không sai khác theo các phép kiểm tra này. Việc khớp PDF không phải chứng nhận tính đúng y khoa của tài liệu.

`drLamSession.ts` xử lý xác thực dữ liệu lưu, khôi phục, tính thời gian và cập nhật kho câu sai; có kiểm thử dữ liệu lỗi, câu nhiều khóa và nộp bài. `QuizExamHeader`, `QuizSourceImages`, `QuizTopicIcon`, `QuizConfirmDialog` tách phần hiển thị khỏi luồng làm bài. Hộp thoại xác nhận dùng HTML dialog, hỗ trợ focus, Tab và Escape của trình duyệt. Header đề gộp trường, tên đề, số câu, tiến độ và đổi đề; màu sáng/tối kế thừa token của website.

`npm run verify:dr-lam-images` giải mã toàn bộ ảnh được tham chiếu và ghi lại kích thước. Nếu cần sửa tệp xuất bị hỏng, chạy `python scripts/kb/verify_dr_lam_images.py --repair`; công cụ dùng xref trong báo cáo đối chiếu, kiểm tra hash PDF và hash ảnh gốc trước khi thay tệp. Kết quả hiện tại: 837 ảnh riêng biệt giải mã được. Ảnh và JSON được thay tệp nguyên vẹn để tránh tệp rỗng khi tiến trình bị ngắt.
