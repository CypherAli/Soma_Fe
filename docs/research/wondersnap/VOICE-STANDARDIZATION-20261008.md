# Chuẩn hóa giọng nói Vision AI — 08/10/2026

## Phạm vi và kết quả

Chuẩn hóa bộ lệnh của `/cu-chi`, micro/loa trong iframe Vision và cầu nối Soma Bot. Giữ camera/quét tích hợp, mô hình đặc và cấu trúc nguồn hiện tại.

- Bộ lệnh thật nằm tại `Soma_Fe/public/wonder/src/logic/voice-commands.js`, được xuất qua `features.js` để giao diện và kiểm thử dùng cùng mã.
- Chuẩn hóa Unicode NFD, giữ lại bản có dấu để phân biệt cổ/cơ, mắt/mặt. Mục tiêu phải khớp duy nhất trong catalog hiện tại hoặc các cấu trúc của mô hình đã tải; không chấm điểm bằng từ rời/substring.
- Tên mô hình được ánh xạ theo ID thật của cả 30 preset. Không còn alias Animal Cell, xe hoặc mô hình ngoài catalog. Không dùng findIndex=-1 để chọn mô hình cuối.
- Lệnh xoay, mặt cắt, nhãn, ghi hình dùng ý nghĩa bật/tắt rõ ràng. “Không xoay” và “do not rotate” dừng tự xoay; lặp lại không bật ngược.
- Soma Bot khi ở Control chuyển lệnh đến iframe đang mở, không thao tác viewer cũ. Bộ khớp cho các action Vision dùng `exact:true`, giữ dấu trong tham số và chỉ cho phép tiền tố/hậu tố lịch sự.

## Micro và loa

`logic/speech.js` quản lý SpeechRecognition và SpeechSynthesis riêng biệt. Chọn Tiếng Việt/English áp dụng vi-VN/en-US cho nhận lời nói; giọng đọc phải có đúng mã ngôn ngữ hoặc tiền tố tương ứng. Không đọc tiếng Việt bằng giọng Anh khi thiếu giọng.

Micro có trạng thái off/starting/listening/paused/error/unsupported. Lỗi quyền, mạng hoặc start không thành công tắt trạng thái nghe, không tự thử vô hạn. Kết quả interim và sự kiện từ recognizer cũ bị bỏ qua. Pause/resume dùng các reason riêng; resume một reason chưa pause không khởi động recognizer lần hai. Abort chủ động đến muộn không làm tắt micro ngoài ý muốn.

Loa chờ voiceschanged có timeout và hủy được khi dừng/chuyển model/đổi ngôn ngữ. Trong lúc đọc, micro Vision tạm ngừng; hết đọc mới nghe lại nếu người dùng vẫn muốn bật. Dừng loa không tự bật micro đã tắt.

Soma Bot và Vision trao đổi ownership qua DOM event và message có kiểm tra origin/source. Đổi bên nghe sẽ hủy bản ghi âm nhận dạng dở, không gửi transcript dở thành lệnh. Mỗi bên chỉ hủy phần đọc đang thuộc quyền của mình; không hủy loa của bên kia khi bản thân đang idle.

## Nội dung đọc

Trong bảng Giọng nói có lựa chọn tên, tên + mô tả, hoặc kèm ghi chú nhóm; tự đọc khi chọn là lựa chọn độc lập với bật micro.

- Việt: tên Việt, mô tả riêng nếu có; ghi chú nhóm chỉ khi được chọn, có câu đánh dấu là ghi chú nhóm.
- Anh: tên nguồn English và descriptionEn/learningNotes.descriptionEn khi thực sự có. Thiếu mô tả Anh thì đọc tên và báo thiếu; không dùng mô tả Việt làm bản Anh.
- Bảo toàn sourceName/sourceId/descriptionEn khi xây runtime labels. Không nâng ghi chú nhóm thành mô tả riêng.
- Quiz dùng tên và câu phản hồi theo ngôn ngữ đọc.

## Một số lệnh nghiệm thu

| Việt | Anh | Hành vi |
|---|---|---|
| Tách lớp / lắp lại | Explode / assemble | Tách / gộp |
| Phóng to / thu nhỏ | Zoom in / zoom out | Thu phóng |
| Mở cổ tay | Open wrist | Chọn preset wrist |
| Chọn cơ cánh tay-quay trái | Select left brachioradialis | Chọn FJ1487M ở forearm |
| Chỉ xem cơ | Show only muscles | Lọc hệ cơ có trong mô hình |
| Ẩn lớp mạch máu | Hide layer blood vessels | Ẩn arterial + venous |
| Tách từng cơ | Separate muscles | Dùng tách từng mesh cơ |
| Không xoay | Do not rotate | Tắt tự xoay, lặp lại vẫn tắt |
| Đọc chú thích / dừng đọc | Read description / stop reading | Đọc / dừng nội dung |
| Quét / hủy quét | Scan / cancel scan | Camera hiện tại; cần camera đã bật |

Tên mơ hồ hoặc cấu trúc không có trong vùng hiện tại phải báo chưa khớp. Khi tên trùng nhiều mảnh, dùng mã FJ cụ thể.

## Giao diện

Micro và loa có trạng thái riêng. Các nút đọc/dừng không phụ thuộc micro. Bảng cấu trúc và bảng giọng nói cùng nằm trong cột tiện ích có cuộn; không chồng lên nhau. Các phần tử không co chiều cao khi mở thêm bảng, giữ HUD số liệu ổn định. Camera quét khi mở lớn có chiều rộng cột tương ứng để không bị overflow cắt mất.

## Kiểm chứng đã thực hiện

- `npm run test:vision-voice`: 189 assertions, dùng catalog thật và metadata forearm thật; có mô phỏng lifecycle nhận dạng/đọc.
- `npm run test:voice`: qua, gồm strict matching và giữ dấu tham số.
- `test-inspection-quality.mjs`, `test-wonder-surface-picking.mjs`, `test-wonder-camera.mjs`, `test-scan-control.mjs`, `test-muscle-separation.mjs`, `test-label-layout.mjs`: qua.
- `npm run build`: thành công, TypeScript qua và sinh 663 trang. Lần chạy sandbox không tải được Google Fonts; chạy lại với quyền mạng đã qua.
- Giao diện thật: lệnh Anh chọn FJ1487M; lệnh dừng xoay lặp hai lần giữ nút off; open wrist đổi đúng preset; Soma Bot mở cẳng tay và chọn đúng cơ ngay trong iframe, URL giữ `/cu-chi`.
- Bấm đọc Anh: giao diện phát sinh trạng thái đang đọc và thông báo thiếu mô tả Anh. Bấm đọc Việt: trình duyệt kiểm thử báo thiếu giọng Việt. Đây là kiểm chứng trạng thái phần mềm, chưa phải đánh giá âm thanh nghe được.
- Ảnh bằng chứng: `voice-standardization-20261008.png`.

## Giới hạn cần nghiệm thu trên thiết bị

Chưa kiểm chứng tiếng nói phát ra từ loa vật lý hoặc transcript từ micro của người dùng. Trình duyệt kiểm thử thiếu giọng Việt; cần giọng Việt trên thiết bị hoặc một dịch vụ TTS được chọn/cho phép riêng. Mô tả tiếng Anh chưa có ở nhiều cấu trúc nguồn. Không tuyên bố hoàn hảo 100% hoặc đã nghiệm thu webcam/micro chỉ dựa vào test mô phỏng.
