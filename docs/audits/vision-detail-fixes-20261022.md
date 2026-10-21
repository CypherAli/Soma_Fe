# Vision: chi tiết cấu trúc, chuyển hệ và vùng quét — 22/10/2026

## Nguyên nhân và thay đổi

- `body`, `bust`, `thorax` từng gộp hình học theo hệ. Metadata vẫn có từng mảnh nguồn nhưng bộ dựng hình chỉ tạo một nhãn cho mỗi hệ. `source-groups.js` khôi phục phạm vi tam giác của từng mảnh từ thứ tự xuất dữ liệu, giữ cả phạm vi mặt cắt kỹ thuật. Tên dịch chỉ theo bài tổng quát không được dùng làm tên riêng; các mục chưa có thuật ngữ Việt chính xác giữ tên gốc. Không thay hình học hoặc tạo cấu trúc mới.
- Thân trên có 1.062 cấu trúc nguồn, trong đó 356 cấu trúc động mạch; toàn thân có 2.234 cấu trúc. Nhóm bề mặt cơ thể được ẩn mặc định nên số cấu trúc trong danh sách thấp hơn tổng nguồn.
- Bộ dựng hình dùng chung bộ đệm vị trí/pháp tuyến, chỉ đổi phạm vi vẽ. Tổng quan dùng các khối hệ để giảm số lệnh vẽ; chọn/raycast vẫn dựa trên mảnh nguồn. Hệ được chọn hoặc đang tách cơ chuyển sang vẽ chi tiết. Các mặt cắt luôn đi cùng mảnh nguồn.
- Chi trên cũ bị cắt theo hộp tọa độ: mất phần lớn xương vai, thiếu xương đòn và lấy nhầm dải chậu chày/cơ căng mạc đùi. Đã xuất lại **chi trên trái** theo danh sách 149 mã nguồn cụ thể từ archive OBJ chính thức có sẵn trong `.cache/bodyparts3d`. Giữ nguyên các mảnh, không giản lược thêm; đủ đai vai, xương cánh tay, quay, trụ, 8 xương cổ tay và 14 đốt ngón. Không khẳng định bộ nguồn có mọi cấu trúc giải phẫu ngoài những mã này.
- Chuyển hệ, chế độ quan sát hoặc chọn cấu trúc trong danh sách dùng pha tan thành hạt → đổi phần ở độ mờ bằng 0 → lắp lại. Không tải lại mô hình hoặc đặt lại góc xoay. Chuyển toàn mô hình vẫn dùng cơ chế riêng đã có.
- Cột tiện ích có một vùng cuộn, lưới biểu tượng co theo chiều rộng và thẻ cấu trúc không bị giới hạn chiều cao riêng. Trang `/cu-chi` ẩn các tiện ích nổi của website để không che vùng điều khiển.
- Trang Vision khởi động bằng `toan-than`, độc lập với mô hình cẳng tay mặc định của các viewer khác. Bộ dựng hình báo mã mô hình đang chọn về trang cha; trang cha chỉ nhận mã có trong catalog từ đúng iframe/cùng nguồn. Kết nối lại giữ lựa chọn hiện tại. Thông báo khởi động mặc định không được ghi đè lựa chọn đang giữ ở trang cha khi tải lại iframe.
- Bộ nhận diện loại mốc không hữu hạn/ngoài ảnh, thêm vùng toàn thân và nửa thân trên, không gợi ý các vùng cánh tay nhỏ khi vùng khớp nhất là thân. Chỉ gợi ý toàn thân khi thấy cả đầu, hông và hai cổ chân. Kết quả khớp yếu bị từ chối thay vì chuẩn hóa thành một gợi ý có vẻ chắc chắn. Kết quả đến muộn không ghi đè lựa chọn của người dùng hoặc xóa kết quả mốc hợp lệ.

## Kiểm chứng

- `npm run test:vision`: hình học vùng, mốc ngoài ảnh, khung thân trên/toàn thân, trường hợp khớp yếu, ánh xạ mô hình, luồng bất đồng bộ và các scene thật.
- `node --import ./scripts/ts-resolve.mjs scripts/test-wonder-regions.mjs`: tất cả vùng, bộ đệm hữu hạn, nhãn nằm trên một trong các phạm vi nguồn của đúng cấu trúc, bố trí tách hệ không chồng nhau.
- `test-wonder-source-groups.mjs`: phủ toàn bộ dữ liệu tam giác, không trùng/thiếu phạm vi; chi trên đủ các xương và không chứa hai mảnh đùi; vòng đời holo.
- `test-muscle-separation.mjs`: tách từng cơ, giữ mặt cắt đi cùng cơ và khôi phục bố trí tổng quan.
- `test-wonder-surface-picking.mjs`, `test-wonder-camera.mjs`, `test-wonder-localization.mjs`, `test-wonder-label-provenance.mjs`, `test-wonder-transition.mjs`, `test-wonder-voice.mjs`.
- Kiểm tra trình duyệt qua `scripts/vision-detail-ui-fixture.mjs`, dùng bộ dựng hình và dữ liệu thật với đồng hồ xác định: tổng quan thân trên dưới 20 mesh đang vẽ; pha tan/gom có thay đổi độ mờ, chỉ đổi hệ sau pha tan, giữ góc xoay; 356 động mạch chọn/tách riêng; cuộn đọc hết thẻ; chi trên có đủ đai vai và ngón; toàn thân độc lập có 2.234 cấu trúc; kết nối lại và tải lại iframe giữ mô hình chi trên đã chọn. Fixture HTML chỉ dùng kiểm tra cục bộ, không giữ trong thư mục public sau khi hoàn tất.

Các kiểm tra nhận diện dùng mốc mô phỏng có kiểm soát. **Chưa đo độ chính xác trên webcam thật của người dùng và chưa huấn luyện lại mô hình thị giác.** Các sửa đổi giải quyết lỗi hình học/ánh xạ đã xác định; không xem kiểm thử này là bằng chứng về một tỷ lệ chính xác thực tế.

Ảnh kiểm tra: `../../../docs/kiem-tra-vision-2026-10-22/` trong workspace cha của frontend.

Kết quả cuối: ESLint phần thay đổi và các kiểm tra nêu trên đã qua; npm run build hoàn tất (708 trang). Hợp đồng CMS frontend/backend cùng hash b6cca4d956482976b2240ad152bb0295020fe52bf036b8c48e2d33881f7bd037. Đã kiểm tra trang /cu-chi thực tế mở region=body và không có tiện ích nổi che panel.
