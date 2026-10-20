# Tìm kiếm chỉ hiện cấu trúc vừa chọn

Ảnh phản hồi có 59 mảnh não đang chọn và 23 mảnh tim từ lớp trước vẫn bật, tổng cộng 82 mảnh. Dữ liệu não không chứa tim; luồng tìm kiếm trước đây cộng lựa chọn vào các lớp đang hiện.

Chọn concept từ tìm kiếm hoặc công cụ atlas nay tự cô lập tập mảnh của concept và đặt lại mức tách rời về 0. Các lớp nền được giữ để nút “Hiện lại giải phẫu xung quanh” có thể đưa ngữ cảnh trở lại. Click từng mảnh trực tiếp trên mô hình vẫn giữ hành vi đã có.

Kiểm chứng trên Chrome với server cổng 3000:

- Chỉ bật Tim (23 mảnh), sau đó tìm Não: tự cô lập 59 mảnh não.
- Hiện lại xung quanh: 82 mảnh, đúng lớp tim và não đang chọn.
- Chọn Tim: 83 mảnh của concept tim; chọn lại Não: 59 mảnh, không lẫn tim.
- Không có lỗi JavaScript trong lượt thử.
- ESLint, verify:cms và production build đều đạt; hợp đồng CMS không thay đổi.

Ảnh và kết quả nằm trong `docs/atlas-search-2026-10-21/` tại thư mục gốc đồ án.
