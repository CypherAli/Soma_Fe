# Quét trong camera Vision AI — sửa nhấp nháy và bố cục

## Nguyên nhân đã xác minh trong mã

- `ScanMachine.idleOrGrace()` giữ ô nhưng trả tiến trình về 0 trong một nhịp mất dấu; đổi số tay cũng đổi ngay phương thức ngắm.
- Vòng vẽ có thể tính thời gian giữ từ landmark cũ và chụp mà không có lần nhận diện mới.
- Preview ưu tiên bitmap 320 px từ worker, rồi phóng lên canvas 640 px và card lớn. Đây là ảnh dùng cho suy luận, không phù hợp làm nguồn xem trước.
- Card 640 px có cuộn riêng bên trong cột phải cũng cuộn, tiếp tục có vùng kết quả cuộn. Nút và hướng dẫn bị đẩy ra ngoài khung.
- Pipeline có thể trả gợi ý ban đầu rồi tinh chỉnh; dựng lại ảnh/nút mỗi lần trả kết quả dễ làm mất focus và thay đổi bố cục.

## Thay đổi

- Giữ ô và tiến trình trong khoảng mất dấu 450 ms; tạm ngừng đồng hồ giữ khi không có tay. Đổi một/hai tay cần ổn định 180 ms. Chụp phải được xác nhận bằng dữ liệu nhận diện mới. Làm mượt ô với hằng số 90 ms.
- Chỉ toàn khung có tia quét chuyển động. Quét tay dùng ô ổn định; hướng dẫn và phần trăm đặt ngoài ảnh, tránh nhãn bị cắt ở mép trên.
- Capture yêu cầu 1280×720 theo khả năng thiết bị; preview và ảnh chụp ưu tiên video gốc. Suy luận vẫn thu xuống 320 px và chỉ có một yêu cầu đang chạy.
- Một card quét có chiều cao cố định, rộng tối đa 440 px, nút cuối luôn hiện. Tạm ẩn các công cụ phụ trong cột phải; chỉ vùng kết quả cuộn nếu thiếu chỗ. Màn hình ngang thấp nhường chỗ cho kết quả sau chụp.
- Có trạng thái chuẩn bị, quét toàn khung, ngắm tay, ngắm hai tay, chờ tay, đang nhận diện, kết quả và lỗi. Chặn quét lại trong lúc đang chụp/nhận diện. Hủy hoặc chọn mô hình trở về camera nhỏ; không tắt camera.
- Nút quét khi camera tắt tự mở camera. Hủy rồi thử lại dùng chung yêu cầu mở camera còn chờ. Retry thay phiên quét cũ, bỏ kết quả đến muộn; tác vụ cũ không được xóa trạng thái tác vụ mới.
- Kết quả giữ lại ảnh và nút theo mã mô hình khi có tinh chỉnh, không dựng lại toàn bộ DOM.

## Kiểm chứng

- `npm run test:vision`: toàn bộ kiểm thử qua, gồm mất dấu ngắn/dài, nhiễu tay thứ hai, xác nhận mới khi chụp và đồng hồ riêng cho hai tay.
- `node scripts/test-wonder-camera.mjs`: căn gương/crop, chỉ một inference, sở hữu stream, nguồn preview gốc và fallback qua.
- `node --import ./scripts/ts-resolve.mjs scripts/test-scan-control.mjs`: mapping và camera handoff qua.
- `node scripts/test-hand-rotation.mjs`: xoay và ngừng/tiếp tục cử chỉ khi quét qua.
- `npm run test:vision-voice`: 189 assertions qua.
- `npm run build`: bản cuối biên dịch và kiểm tra TypeScript thành công, tạo 663 trang. Cảnh báo middleware chuyển sang proxy là cảnh báo có sẵn của dự án.
- Kiểm tra trình duyệt bằng markup/CSS/module thật qua fixture mô phỏng: một tay, hai tay, toàn khung, busy, kết quả, lỗi ảnh mờ, retry và chọn mô hình. Đã kiểm ở 1280×720, 390×620, 844×390; trang thật ở 1366×768.
- Mobile 390×620: vị trí footer trước/sau kết quả đều y=459,6…518,4 px; card không tự cuộn. Màn hình ngang có vùng kết quả cuộn và footer vẫn nằm trong card.
- Fixture tạo bằng `node scripts/scan-ui-fixture.mjs`; file `public/__scan-ui-fixture.html` chỉ dùng kiểm thử, xóa sau QA.

## Giới hạn kiểm chứng

Trình duyệt kiểm thử không cung cấp được camera thật; mở camera dừng ở yêu cầu thiết bị. Đã kiểm được trạng thái chuẩn bị và hủy trên trang thật. Khung tay/kết quả trong fixture là dữ liệu mô phỏng, không phải bằng chứng nhận diện webcam thật. Chưa xác nhận độ chính xác nhận diện hoặc mức nhấp nháy thực tế trong ánh sáng và thiết bị của người dùng. Cổng chất lượng ảnh vẫn giữ nguyên; ảnh ít chi tiết thật vẫn có thể bị báo mờ.

Ảnh: `VISION-SCAN-LAYOUT-20261008.png` (trang thật, chuẩn bị camera) và `VISION-SCAN-MOBILE-QA-20261008.png` (fixture mô phỏng).
