# Kiểm tra Quiz — 13/10/2026

Đã khôi phục đường vào các công cụ cũ trên thanh đầu trang, gộp header đề, dùng token màu của website cho sáng/tối, bỏ thông báo ảnh thiếu, và tách header/gallery/dialog/xử lý bài lưu thành các module riêng.

## Đối chiếu tài liệu

- 30 PDF, 2.810 câu, 11.193 phương án, 1.417 lượt ảnh nhúng: không sai khác trong kiểm tra nguồn.
- Đối chiếu SHA-256 của PDF và ảnh gốc; khung phương án, nhãn, khóa đáp án, ranh giới câu, ngữ cảnh chung và vị trí ảnh.
- Sửa tiêu đề mục dính vào D của Ôn tập 1 câu 46; giữ ngữ cảnh đúng cho các nhóm câu, kể cả tiêu đề không có dấu hai chấm.
- Sửa phần chữ của E bị dính sang D ở Case lâm sàng câu 121 do ngắt trang.
- Khôi phục 7 dải ảnh chứa chữ trong gợi ý, trước đây bị loại bởi điều kiện chiều cao.
- Giải mã đủ 837 ảnh nguồn riêng biệt; sửa một WebP rỗng bằng ảnh gốc có hash khớp trong PDF. Xuất ảnh và JSON theo cách thay tệp nguyên vẹn; ghi width/height để giữ bố cục trước khi lazy load.
- Chi tiết: `quiz-source-audit.json`. Các khóa chấm điểm vẫn lấy từ dấu trong PDF, không suy đoán từ kiến thức hoặc lời giải.

## Kiểm tra tự động

| Phạm vi | Kết quả |
| --- | --- |
| Toàn bộ unit test frontend | 28/28 đạt |
| Toàn bộ unit test backend | 54/54 đạt, 9 suite |
| Đầu vào API trên localhost:3000 | 16/16 đạt |
| Ngân hàng đề mới và đề giáo trình cũ | Đạt |
| Bản dịch Quiz cũ, 175 khóa × 3 ngôn ngữ | Đạt |
| ESLint toàn thư mục Quiz và module dữ liệu/bài lưu mới | 0 lỗi, 0 cảnh báo |
| Build production toàn frontend | Đạt, 666 trang tĩnh |

## Kiểm tra giao diện

- Desktop 1440px và mobile 375px: một header đề, không có thanh trường riêng; mobile không tràn ngang, danh sách số câu thu gọn.
- Sáng/tối; tên dài xuống dòng đầy đủ; tìm không dấu `than nieu quan` trả đúng tên đầy đủ.
- Luyện tập nhiều đáp án A/D; kiểm tra đáp án; ảnh đúng câu và phóng to; Escape đóng ảnh.
- Nạp lại trang khôi phục bài; mở PDF rồi trở lại giữ nguyên lựa chọn.
- Thi thử 18 câu: không hiện khóa/hình gợi ý trước nộp; sau nộp kết quả 18 đúng, 0 sai, 0 bỏ qua; xem lại câu 5 mở đúng ảnh nguồn.
- Xác nhận nộp khi còn câu trống và hủy bằng Escape; thi lại; nguồn 3D và thoát bài; atlas chuyển từ ảnh che nhãn sang ảnh đầy đủ.
- PDF/Word, lộ trình và AI mở đúng panel/cổng đăng nhập cũ.
- Chữ chính/nhãn/phương án trong dark mode được đo tại màn hình làm bài, tỷ lệ tương phản tối thiểu 4,64:1.
- Thu gọn trợ lý trên Quiz để giữ nút chuyển câu dễ thấy; console không ghi lỗi mới trong phiên kiểm tra.

98 trường hợp kiểm thử tự động đã chạy đều đạt. Chưa kiểm thử upload/duyệt tài liệu, tạo đề AI và lưu lộ trình bằng tài khoản thật vì phiên trình duyệt chưa đăng nhập. Kết quả này không phải phép đo hay bảo hành “98% độ ổn định” của toàn sản phẩm.

## Bổ sung: tránh lộ ảnh lời giải trước khi trả lời

- Ảnh đề bài hiện ngay; ảnh gợi ý dùng chung điều kiện mở với lời giải. Luyện tập mở sau kiểm tra, thi thử mở sau nộp. Ẩn ảnh bìa nguồn khi đang làm bài.
- Kiểm tra trực tiếp Chi trên câu 1: chưa chọn và chọn A chưa kiểm tra đều có 0 ảnh gợi ý; chọn A/D rồi kiểm tra mở đúng 1 ảnh lời giải. Chuyển sang câu 2 lại ẩn ảnh.
- Thêm 4 kiểm thử hồi quy cho ảnh luyện tập, thi thử, ảnh đề bài và trạng thái chưa tải câu; toàn bộ unit test frontend đạt 32/32. ESLint các file sửa đạt, không cảnh báo.
- Ảnh kiểm chứng: `quiz-feedback-before-check.png`, `quiz-feedback-after-check.png`.
