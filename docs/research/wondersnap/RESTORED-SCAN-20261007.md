# Khôi phục nhịp quét cũ ngay trong camera Vision — 2026-10-07

Tài liệu này thay thế mô tả luồng chụp thủ công trong INTEGRATED-CAMERA-SCAN-20261007.md.

## Hành vi cần giữ

- Một màn hình Vision, một camera và một worker nhận diện tay. Nút Quét bộ phận mở vùng camera lớn để ngắm; chọn kết quả hoặc Hủy quét thu nhỏ camera, giữ video và mô hình hiện tại.
- Bắt đầu quét chưa có tay: tia chạy toàn khung trong 2.2 giây rồi chụp toàn khung. Khi có tay, chuyển sang ScanMachine gốc.
- Một tay xoè ít nhất 3 ngón: ô ôm bàn tay và kéo xuống cẳng tay, giữ ổn định 1200ms tự chụp.
- Hai tay: ô giữa hai đầu ngón trỏ, preview đen trắng trong ô. Nắm cả hai tay hoặc chụm cả hai tay giữ 400ms để chụp. Dùng khung cuối trước lúc nắm; không để ô co theo ngón đang cuộn.
- ScanMachine giữ ân hạn 450ms khi hụt tay, chỉ bắn shoot một lần; Quét lại tạo nhịp mới.
- Trong quét và chờ chọn: worker vẫn theo dõi tay, nhưng ngừng thao tác xoay/tách/đổi/chọn/thu phóng mô hình do cử chỉ. Chọn hoặc hủy phục hồi điều khiển.
- Sau kết quả, bỏ tia hoạt động và đổi hướng dẫn sang chọn mô hình hoặc điều chỉnh vùng; không để chữ Đang nhận diện treo mãi.

## Nguồn và tọa độ

- src/app/[locale]/cu-chi/page.tsx tái sử dụng ScanMachine, readHand, recognise, assessCrop, fitContain, detectPoseOnce; không tự viết một máy cử chỉ khác.
- public/wonder/src/app.js cung cấp scanTracking (landmark nhẹ), scanFrame, scanUI, scanSnapshot (chỉ sao chép frame khi chụp).
- Landmark Wonder đã ở hệ selfie. Ô quét và previewPoint giữ cùng hệ, KHÔNG lật thêm. boxToSourceRect đổi ngược về ảnh nguồn đúng một lần khi cắt.
- Snapshot bất biến giữ độ phân giải video gốc. Crop336 giữ tỉ lệ bằng fitContain. Pose chạy trên bản full-frame640 riêng, không dùng frame thu nhỏ để đo sourcePx của quality gate.
- Camera mở rộng dùng đúng aspect nguồn, camera nhỏ dùng cover16:9. Nhãn tiến trình full-frame phải nằm trong canvas, đường viền inset để không bị cắt ở mép.

## Kết quả và vòng đời

- Dùng cùng preset ID/tên của Vision. Không đưa Animal Cell hoặc mô hình ngoài danh mục vào fallback.
- Nhãn rõ/có thể/gợi ý giữ nguyên mức tin cậy; không biến fallback thành kết luận chắc chắn.
- Một nhận diện đang chạy; generation vô hiệu kết quả sau hủy/chọn/unmount. Không nhận message khác origin hoặc khác contentWindow của iframe.
- Pose chạy trên máy. GPU fallback chỉ chạy nếu getConsent()===true; re-check consent và generation trước khi gửi; thử segmentPersonOnce trước khi gửi crop. Không ngầm gửi ảnh khi chưa đồng ý.
- Chất lượng crop quá nhỏ/tối/sáng/mờ phải báo nguyên nhân, không mở mô hình ngẫu nhiên.

## Kiểm chứng đã thực hiện

- npm run test:vision đạt: một tay, hai tay, giữ khung trước nắm, shoot một lần, mirror crop, chất lượng ảnh, local/GPU/fallback và kết quả muộn.
- test-wonder-camera.mjs đạt: một lần lật gương, aspect/crop, một suy luận đang chạy, stream chung và ownership.
- test-scan-control.mjs đạt: mapping scan -> đúng model ID, ownership không mất khi bỏ video scan cũ.
- test-hand-rotation.mjs đạt: góc liên tục, tracking tiếp tục trong lúc scan nhưng state.update bị chặn; điều khiển tiếp tục khi bỏ suspended.
- UI trên luồng video và mốc tay mô phỏng, có nhãn rõ ràng: toàn khung tự chụp và báo ảnh mờ; hủy thu camera vẫn live; một tay có gợi ý rồi chọn Cổ tay mở đúng model/camera vẫn live; hai tay ngắm rồi nắm chốt khung; hủy không đổi mô hình.
- Ảnh chứng cứ: restored-scan-results.jpg và restored-scan-framing.jpg. Các ảnh là kiểm thử mô phỏng, KHÔNG bằng chứng độ chính xác webcam hoặc FPS thiết bị thật.

## Chưa được chứng nhận

Webcam thật trong trình duyệt kiểm thử chưa cấp được luồng video (Requesting camera). Chưa kết luận chính xác nhận diện người thật, ánh sáng khó, xoay tay thật, thiết bị chậm hoặc mọi độ phân giải. Không tuyên bố hoàn hảo100%. Nguồn OBJ vẫn không có texture mô thật; sửa luồng quét không tự tạo thêm chi tiết giải phẫu.

Build cuối: npm run build thành công (exit0), log .cache/restored-scan-final-build-network.log. Lần build trước lỗi tải Inter/Playfair Display từ Google Fonts, chạy lại với kết nối mạng đã đạt.
Trang fixture tạm đã đóng và xóa. Chỉ giữ ảnh chứng cứ, không đưa mốc mô phỏng vào tính năng thật. FPS camera trong fixture không có giá trị đánh giá: poll được thay bằng mốc tay dựng sẵn nên bộ đếm worker không tiếp tục cập nhật.
