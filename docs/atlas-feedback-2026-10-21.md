# Sửa phản hồi atlas và ngôn ngữ — 21/10/2026

## Kết quả

- LocaleLayout dùng Next Script thay thẻ script DOM. Điều hướng Việt → Anh không còn cảnh báo script trong React client.
- Camera và thanh tách rời dùng chung vùng nhìn đã trừ bảng lớp và bảng chi tiết. Hai nút hai bên thanh có cùng kích thước; tâm slider khớp tâm mô hình.
- Tắt toàn bộ sàn/bệ/vòng tròn, tránh che giải phẫu khi xoay từ dưới lên.
- Tìm kiếm dùng màu nền/chữ của theme hiện tại, không ép nền trắng khi ở chế độ tối.
- Tên concept độc lập với tên từng mesh: `heart` là Tim, 83 mảnh; `pulmonary valve` là Van động mạch phổi, 3 mảnh (`FJ2417`, `FJ2427`, `FJ2434`). Trước đây tên concept bị thay bằng nhãn của mảnh đầu tiên.
- Giữ phạm vi cô lập độc lập với lựa chọn hiện tại. Chọn một mảnh sau khi tách rời không bật lại toàn thân; cùng cơ chế cũng áp dụng cho trang chuyên đề.
- Tim trong atlas toàn thân dùng bảng màu của bài tim; bỏ lớp tô sáng toàn khối che màu học tập. Có nút Nhãn để hiện/ẩn nhãn, bao gồm nhãn chi tiết của nhóm tim đang chọn.
- Sửa metadata phân hệ: 5 cấu trúc não thất/lỗ gian não thất chuyển về thần kinh; 5 mảnh cơ nhú chuyển về tim. Tái sinh nhóm toàn thân bằng `scripts/atlas/fix-system-classification.mjs`; không đổi tên hoặc hình học nguồn.
- Ghi công đầy đủ mở trang `/nguon-du-lieu` có tiêu đề, đoạn văn, danh sách và liên kết. Nội dung lấy từ bản ATTRIBUTION.md gốc; vẫn có thể tải bản Markdown.

Các mảnh chưa có tên dịch riêng giữ tên tiếng Anh nguồn cạnh tên nhóm, tránh gán nhầm tên nhóm thành tên một mảnh cụ thể.

## Kiểm chứng

- Production build và TypeScript: đạt, 678 trang được sinh trong bước build.
- ESLint toàn dự án và kiểm tra các tệp sửa bổ sung: đạt.
- CMS sync/check: 9.397 documents, 264 model GLB và 2.234 phần atlas.
- Verify scenes: 1.310 hotspot khớp node thật.
- Kiểm tra nhãn: phủ 148 trang; kiểm tra cô lập 1.137 nhóm.
- Ba regression test cho tên concept, nhận dạng lá van và phân hệ não thất/tim: đạt.
- Chrome production: 15 kiểm tra đạt; không có pageerror hoặc cảnh báo React về script/hydration trong lượt thử.
- Tâm slider đúng ở 1536 px, 1280 px, điện thoại 375 px; khi cô lập và tách rời tim; trên trang chuyên đề tim và sọ. Chênh lệch đo được: 0 px.
- Tim đang cô lập hiện 10 nhãn; chọn mảnh sau tách rời vẫn giữ 83 mảnh trong phạm vi. Van động mạch phổi cô lập đúng 3 mảnh.
- Trang ghi công tiếng Anh hiển thị và giữ 8 liên kết nguồn.

Kịch bản, kết quả JSON và ảnh ở thư mục `docs/atlas-feedback-2026-10-21/` của thư mục gốc đồ án. Các server và Chrome kiểm tra tạm đều tự đóng.

## Nạp bản sửa

Catalog được đọc khi backend khởi động. Dừng các server cũ bằng Ctrl+C trong terminal tương ứng, rồi chạy:

```powershell
# soma_be
npm start

# Soma_Fe — production đã được build
npm start
```

Tải lại trình duyệt bằng Ctrl+F5. Khi cần sửa mã tiếp, dùng `npm run dev` thay cho `npm start` ở frontend.
