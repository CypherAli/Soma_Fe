Đã cập nhật Next/eslint-config-next 16.4.2 và script Windows dùng webpack với SWC WASM khi DLL native bị Application Control chặn. Sửa import constants ESM và giới hạn export của route handler theo phiên bản mới.

OAuth liên kết dùng Bearer POST; các lời gọi server dùng API_INTERNAL_URL. Asset CMS dùng proxy cùng origin giới hạn ID/MIME. Web gửi phương án lên backend để chấm; không gửi điểm tự tính. CMS sync chuẩn hóa CRLF/LF và xuất dữ liệu atlas/trường cho backend. Docker nhận public URL lúc build và dùng volume newsletter khi chạy qua Compose.

Audit production: 0. Các cảnh báo braces ở công cụ dev được giảm thiểu bằng scripts/patch-dependencies.cjs qua postinstall; kiểm tra bằng npm run test:security. Giữ phiên bản package gốc và ghi nhận npm audit vẫn có thể báo advisory dev.

Kiểm tra đạt: lint, build, 78 unit test của lượt đầy đủ và 2 test asset bổ sung; verify:cms/scenes/models; HTTP 840 trang, 262 tài nguyên, 6 tình huống 404 và 17 trường hợp biên API. Viewer 3D dựng được và phản hồi khi kéo xoay trong Chrome headless.

Cần triển khai cùng backend mới do định dạng POST /study/attempts đã đổi. Khi đổi public URL trong Docker, build lại image. Guard bảo mật được áp dụng qua npm install/npm ci có lifecycle scripts.
