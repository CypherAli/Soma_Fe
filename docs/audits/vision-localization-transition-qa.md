# Kiểm tra tên Việt và chuyển mô hình — 13/10/2026

Trang `/cu-chi` dùng bộ dựng hình trong `public/wonder`, không dùng bộ nhãn của trang atlas React. Các nhãn chưa biên tập trước đây rơi về tên Anh; nhiều chuỗi giao diện cũng được viết song ngữ ngay trong HTML. URL iframe chứa mô hình đích nên đổi đích từ trang cha có thể nạp lại toàn bộ iframe.

- Xuất 827 nhãn cấu trúc qua `scripts/export-wonder-localized-names.ts`; kiểm tra đủ 1.450 lượt cấu trúc trong các vùng. Giữ nguyên ID, tên nguồn Anh, tọa độ và mô tả nguồn. Hồi trán trên, tiểu thùy đỉnh trên, chất trắng bán cầu và thần kinh sàng trước giữ đúng bên trái/phải. Cấu trúc chưa có tên riêng dùng ngữ cảnh nhóm kèm ID, không coi tên nhóm là tên cá thể.
- Giao diện Việt bỏ các chuỗi như “Anatomy”, “Giọng nói · Voice”, “Read”, “Run” và thông báo tiếng Anh. Chọn ngôn ngữ giọng nói không thay ngôn ngữ giao diện.
- Giữ URL iframe ổn định; cầu nối `enter()` chuyển đích. Bộ chuyển chờ hiệu ứng cũ hoàn tất, giữ hạt khi tài sản mới đang tải, rồi gom mô hình mới. Lựa chọn mới nhất thay lựa chọn đang chờ; chỉ phát một lệnh tạo hình. Các thao tác tách lớp tạm khóa trong lúc chuyển.

Kiểm tra đạt:

- `test-wonder-localization.mjs`: tên nguồn và tên bên, toàn bộ nhãn/tên mô hình, tách ngôn ngữ đọc và nhãn giao diện.
- `test-wonder-transition.mjs`: pha tan, tải chậm, kết quả cũ, chọn liên tục, tạo hình một lần và chế độ thủ công.
- `test-wonder-label-provenance.mjs`: 118 mô tả cá thể và 2.410 ghi chú nhóm giữ đúng ID nguồn.
- `test-hand-navigation.mjs`, `test-inspection-controls.mjs`, `test-label-layout.mjs`: cử chỉ mô phỏng, điều khiển tách/lắp và bố trí nhãn.
- `test-wonder-voice.mjs`: 189 khẳng định đạt. Toàn bộ unit test frontend 32/32 đạt; ESLint các module sửa không lỗi/cảnh báo; build production đạt, 666 trang tĩnh.
- UI kiểm thử xác định trên bộ dựng hình thật: cẳng tay hiện đầy đủ → lưới đặc tan thành hạt khi chưa thay mô hình → hạt gom xong mô hình đầu → các nhãn thần kinh hiện tiếng Việt. Ảnh: `vision-model-transition.png`, `vision-vietnamese-labels.png`.

Chạy `node scripts/transition-ui-fixture.mjs` để tạo UI kiểm thử tạm ở `/__transition-ui-fixture.html`. Xóa HTML tạm sau khi dùng. Phiên này không bật camera/micro thật; kiểm thử cử chỉ và giọng nói dùng dữ liệu mô phỏng.
