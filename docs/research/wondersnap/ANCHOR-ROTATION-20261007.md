# Điểm gắn, xoay và thông số

- Telemetry chia bốn dòng cố định, không wrap, số tabular; thời gian nhận diện có dòng riêng, zoom luôn hiện. Chiều cao 92px không thay đổi theo số FPS/ms.
- Controller đã unwrap góc liên tục; app không wrap lại chênh lệch với góc lúc bắt tay (gây nhảy khi vượt 180 độ). Giữ pitch khi mất tay trên mô hình đặc. Preset góc nhìn xóa grab cũ; ngưỡng xuất hiện lại đồng nhất 350ms.
- Điểm tag lấy đỉnh bề mặt gần centroid nhất trong đúng mesh, không lấy centroid nằm trong khoảng trống. Biến đổi tách lớp của surface tag dùng cùng smoothstep toàn cục như mesh đặc. Không đổi mã, số mặt hay cấu trúc nguồn.
- Thớ cơ: OBJ BodyParts3D giữ hình khối từng cơ và normals; không có UV/texture/normal map mô cơ. Màu theo hệ đồng nhất nên không phân biệt mọi cơ bằng màu riêng. Không vẽ thớ cơ ngẫu nhiên để giả chi tiết giải phẫu. Cần nguồn texture có hướng sợi đã xác thực nếu muốn mức mô học; chế độ xem riêng và chọn cấu trúc hiện giúp xem từng cơ thật.
- Chưa xác nhận độ xoay qua webcam vật lý; kiểm tra toán học và UI không thay thế thử tay thật.

## Tách cơ đã triển khai
- Cách tách mô hình > Tách từng cơ: chỉ hiện hệ cơ, trải từng mesh trên hai hàng; thanh Tách lớp điều chỉnh mức rời. Chọn cấu trúc để phóng to từng cơ. Đây là bố trí trưng bày, không phải thứ tự bóc nông–sâu.
- Trả về Tách các hệ phục hồi offset, tâm và fit nguyên bản. Tag dùng cùng offset mesh. Mô hình không có hệ cơ vô hiệu lựa chọn này.
- Xoay chuột nội suy theo thời gian (14/s); xoay tay làm mượt 6/s, giữ góc liên tục. Cần thử webcam thật.
- Test-muscle-separation, hand-rotation, label-layout đạt; build đạt.

