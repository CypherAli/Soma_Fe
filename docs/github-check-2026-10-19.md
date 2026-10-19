# Kiểm tra trước khi đẩy GitHub — 19/10/2026

- npm run lint và npx tsc --noEmit: đạt.
- npm run test:unit: 75/75 đạt.
- npm run build: đạt; 675 trang được tạo.
- verify:quiz-bank, verify:scenes, verify:models, verify:lesions, verify:cms, verify:dr-lam: đạt.
- test:atlas, test:gestures, test:vision, test:voice: đạt.
- 1.310 hotspot khớp node model; 49/49 bệnh lý khớp mesh; 30 PDF với 2.810 câu và 1.417 tham chiếu hình hợp lệ.
- package.json và package-lock.json khớp dependencies/devDependencies.

Log tạm, biến môi trường thật và kết quả build không nằm trong tập commit. Kết quả kiểm tra HTTP production được ghi ở docs/audits/public-release-qa.json.

HTTP production: 840 trang, 257 tài nguyên và 6 trường hợp 404 đều đạt (0 lỗi).
API production: 17 tình huống dữ liệu sai định dạng hoặc thiếu xác thực đều bị chặn đúng trạng thái.
