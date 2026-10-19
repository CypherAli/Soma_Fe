# Chú thích và giao diện Quét / Vision — 07/10/2026

- Chú thích có vùng an toàn, tránh panel/camera/thẻ thông tin và tránh nhau. Ưu tiên cấu trúc đang chọn; thiếu chỗ thì ẩn nhãn phụ. Không thay đổi dữ liệu picking.
- Tách >65%: tổng quan dùng một nhãn mỗi hệ kèm số cấu trúc hiện, chọn bộ phận vẫn hiện tên chính xác. Không đồng loạt bật hàng trăm nhãn.
- Nút “Xem riêng hệ này” dùng hệ thực tế của cấu trúc. Chỉ cung cấp các hệ có trong vùng đang xem.
- Sửa phân loại runtime đúng năm mã FJ1730, FJ1731, FJ1752, FJ1767, FJ1814 từ cardiac sang nervous; giữ sourceSystem, nguồn tham khảo, màu và hình học. Nhóm Tim trong vùng não thuần các mã này được đặt “Hệ não thất”. Không đổi nhóm hỗn hợp tim thật và não thất.
- Căn cứ: scenes/brain.ts đã ghi nhận lỗi atlas; NLM MeSH Cerebral Ventricles: https://meshb.nlm.nih.gov/record/ui?dcmsLinks=true&ui=D002552 .
- Quét dùng nền xám than và panel cùng màu Vision, hướng dẫn thu gọn, tên mô hình lấy từ cùng preset; loại lựa chọn trùng cùng ID. Không vẽ cảnh 3D bị camera che hoàn toàn ở chế độ Quét mặc định.
- Kiểm chứng: build thành công; kiểm tra label-layout, scan-control, wonder-camera, surface-picking, inspection-quality, regions và 1.310 hotspot đạt. Lint các file mục tiêu không có lỗi; lint toàn dự án còn 34 lỗi và 969 cảnh báo đã tồn tại.
- UI: đầu 551 cấu trúc, tách 100% không chồng nhãn, không còn nhãn “Tim” trong đầu; nút xem riêng chọn đúng system:nervous; chọn Đầu bên Quét mở Skull. Screenshot labels-exploded-fixed.jpg và scan-unified-fixed.jpg.
- Chưa nghiệm thu camera vật lý trong lượt này. Nguồn vẫn có tên tiếng Anh và không có texture mô thật; không tuyên bố hoàn hảo 100%.
