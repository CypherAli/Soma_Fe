# Điều chỉnh độ mượt

Đã thêm bộ chọn Tự động/Mượt/Chi tiết ở sidebar, giữ camera và toolbar bên phải không bị chắn. Chỉ thay độ phân giải pixel, giữ lưới OBJ nhiều chi tiết và toàn bộ cấu trúc chọn được.

Mượt: DPR 1. Chi tiết: tối đa DPR thiết bị (desktop 2, mobile 1,5). Tự động: giảm 0,25 sau cửa sổ 2 giây dưới 38 FPS, tăng sau 4 cửa sổ trên 55 FPS; camera bật giới hạn auto 1,5. Không dùng tín hiệu tab ẩn hoặc đang tải để giảm chất lượng. Recording giữ mức hiện tại. Preview 20Hz, HUD 5Hz.

Build qua. Kiểm tra adaptive hysteresis/camera budget/visibility/loading/explicit choices qua; mirroring/shared stream/Scan-Control ownership qua; verify:scenes 1310 hotspot; toàn dự án lint vẫn 34 lỗi/969 cảnh báo baseline.

Trình duyệt thử nghiệm chưa có tín hiệu camera thật; không khẳng định FPS webcam hoặc nghiệm thu luồng Scan-Control thực tế đã đạt. Cần đo trên thiết bị người dùng.
