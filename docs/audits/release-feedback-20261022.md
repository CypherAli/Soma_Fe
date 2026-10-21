# Kiểm tra các sửa chữa theo phản hồi — 22/10/2026

## Tóm tắt bệnh học hiển thị sẵn

Hồ sơ bệnh hiển thị ngay bản tóm lược đã biên soạn trong các trường tổng quan, lâm sàng/cận lâm sàng, hình ảnh, tiến triển và điều trị. Đưa phần này lên trước hình minh họa, dẫn nguồn và số trang ngay trong phần tóm tắt. Bỏ nút gọi AI để tạo lại tóm tắt. Hỏi đáp tùy chọn vẫn hoạt động riêng; đổi bệnh hoặc ngôn ngữ hủy lượt hỏi cũ.

Kiểm tra giao diện thật với Điện giật và Ngạt nước: đủ 5 mục, có nguồn/số trang, không còn nút tạo tóm tắt hay trạng thái chờ AI, không tràn ngang và không có lỗi console. Khi chuyển ở mục Cùng chuyên khoa, cửa sổ hồ sơ được tạo lại để vị trí cuộn về 0 và tóm tắt mới hiển thị từ đầu. Ảnh kiểm chứng được lưu trong `docs/kiem-tra-tom-tat-2026-10-22/` ở workspace cha.

Giữ nguyên toàn bộ câu trong các trường gốc, không lấy riêng câu đầu hay cắt theo số từ vì có thể bỏ mất điều kiện, ngoại lệ hoặc chống chỉ định. Không thêm khuyến cáo điều trị mới, không tự điền các mục thiếu. Giữ thông báo dịch máy, thiếu bản dịch và cờ `needsReview` theo dữ liệu.

API hiện có 106/106 hồ sơ đủ 5 trường tiếng Việt và nguồn dẫn. Đây là kiểm tra độ đầy đủ dữ liệu, không phải chứng nhận nội dung lâm sàng của 106 hồ sơ. Không thay đổi cờ thẩm định trong cơ sở dữ liệu. Nội dung biên soạn vẫn cần đối chiếu giáo trình và chuyên gia y khoa; không suy ra rằng một bản ghi đã được chuyên gia duyệt chỉ từ việc các kiểm thử phần mềm đạt.

Đối chiếu điểm an toàn của ví dụ Điện giật với [AHA 2025, Electrocution](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation/): bảo đảm an toàn hiện trường và hồi sức theo hướng dẫn tiêu chuẩn. Nguồn của hồ sơ vẫn là giáo trình Nội khoa ĐH Y Hà Nội (2020), không ghi nhầm nguồn thành AHA hay coi toàn bộ bài đã được cập nhật theo AHA.

## Kiểm tra hồi quy

- Frontend: 92/92 kiểm thử đơn vị; lint toàn bộ sạch; `npm run build` đạt, đủ 708 trang. Lần build đầu bị sandbox Windows chặn tạo thư mục đầu ra; chạy lại với quyền ghi phù hợp đã hoàn tất.
- Backend: 25/25 bộ, 172/172 kiểm thử; build NestJS đạt; lint các phần thay đổi sạch. Lần đầu có một timeout GLB khi máy thiếu RAM; chạy lại toàn bộ sau khi giải phóng tài nguyên đạt 172/172.
- Bộ đọc PDF Python: 3/3 kiểm thử, gồm khóa màu, hình lời giải và phương án vắt trang; ghi nhận kiểm tra trực tiếp PDF 113 trang → 152 câu trong [tài liệu backend](https://github.com/CypherAli/Soma_Be/blob/main/docs/personal-pdf-import.md).
- `verify:scenes`: 1.310 hotspot khớp mô hình thật.
- `verify:dr-lam`: 30 PDF nguồn, 2.810 câu, 1.417 tham chiếu hình; phân trang, một/nhiều đáp án và chấm điểm đạt.
- `verify:quiz-text`: 189 khóa × 3 ngôn ngữ.
- Vision: vùng nhận diện, cấu trúc nguồn, tách cơ, chọn mặt, camera, bản địa hóa, nguồn nhãn, chuyển mô hình và giọng nói đều đạt. Chi tiết kiểm tra trình duyệt ở `vision-detail-fixes-20261022.md`. Chưa đo độ chính xác nhận diện trên webcam thật.
- `verify:cms`: hợp đồng hai repo đồng bộ, schema 2; hash `bbd324e1eb6513db1fb2c629896fe00325c476cd0330db01c92f65745ed55bde`.

Docker backend đã bổ sung Python venv, PyMuPDF/Pillow và script đọc PDF trong image chạy. Chưa chạy được build image vì Docker Desktop Linux engine trên máy chưa hoạt động. Bộ đọc Python và backend được kiểm thử trực tiếp trên máy.
