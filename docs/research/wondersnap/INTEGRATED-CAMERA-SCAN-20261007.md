# Quét trong camera Vision

> Bản này mô tả lần tích hợp chụp thủ công ban đầu. Đã được thay thế bởi RESTORED-SCAN-20261007.md: dùng ScanMachine gốc, snapshot native resolution và GPU fallback chỉ khi có consent.

- UI chỉ còn Vision. Nút Quét bộ phận ở dưới camera; kết quả cùng khung, chọn mở model không unmount iframe hoặc dừng stream.
- Một tay: boxFromHand và cổ tay được dùng với chuỗi chi trên. Hai tay: boxFromIndexTips, không coi tay điều khiển là đối tượng. Không có tay: nhận diện toàn khung bằng Pose.
- Chụp frame 640px của camera đang hoạt động; reuse landmarks của worker hiện tại, không tạo một bộ HandLandmarker khác. Nhận diện Pose chạy theo yêu cầu trên máy; không gửi ảnh tới GPU ở luồng mới này.
- Message chỉ nhận từ đúng iframe và same origin. Một request đang chạy; generation ngăn kết quả muộn thay đổi lựa chọn đã chọn. Gợi ý hiển thị mức rõ/có thể/gợi ý, dedupe cùng model ID.
- URL cũ che-do=quet vẫn vào Vision; lệnh chuyển Quét mở nút tích hợp thay vì trang riêng. Mã giao diện cũ còn giữ trong nguồn để không xóa logic không liên quan, nhưng không còn truy cập bằng tab.
- UI đã xác nhận nút và thông báo camera tắt. Camera ownership/mapping tests đạt. Cần người dùng nghiệm thu quét webcam thật; không khẳng định nhận diện mọi vùng chính xác.
