# Kiểm tra UI/UX Vision AI — 08/10/2026

## Kết luận

Trang `/cu-chi` đã có hướng thiết kế đúng cho một không gian học giải phẫu: nền xám than trung tính, mô hình đặc ở trung tâm, camera tích hợp trong cột công cụ, chọn mô hình theo vùng và có thao tác không cần camera. Desktop dùng được; chưa đạt mức hoàn thiện về responsive, khả năng tìm thấy thao tác và sự nhất quán của trạng thái.

Không chấm “98%/100%”: chưa có thử nghiệm với người dùng, thiết bị thật và kiểm tra đầy đủ khả năng tiếp cận. Đây là audit có bằng chứng tái hiện, không phải chứng nhận WCAG.

**Cập nhật sau audit:** đã thay 10 icon toolbar emoji bằng SVG nét đồng nhất, thêm tooltip/tên thao tác Việt–Anh và trạng thái accessibility. Trạng thái Tự xoay, Mặt cắt và các nút bật/tắt được đồng bộ từ trạng thái thật, bao gồm khi đổi góc nhìn/đặt lại. Đã kiểm tra hiển thị desktop/mobile, thao tác bật/tắt và build thành công. Các phát hiện về bố cục và nội dung dưới đây vẫn là danh sách cần xử lý. Ảnh mới: `VISION-ICONS-20261008.png`.

## Phạm vi đã kiểm tra

- Trang thật trên localhost, bản iframe `v=20261008-voice`, ngôn ngữ Việt, mô hình Cẳng tay.
- Viewport trình duyệt 1920×1080, 1366×768 và 390×844.
- Trạng thái camera tắt; bấm Quét bộ phận; mở Giọng nói; gửi lệnh văn bản `select left brachioradialis`; đóng chú thích; thu gọn panel; tách từng cơ tới 100%.
- Đối chiếu DOM, kích thước và mã nguồn HTML/CSS/app/bridge.
- Không thử webcam/micro vật lý, phát âm thực tế, xoay bằng tay thật hoặc mọi mô hình. FPS hiển thị trong môi trường thử không dùng để kết luận hiệu năng trên máy người dùng.
- Chỉ thêm tài liệu và ảnh bằng chứng. Không sửa UI ứng dụng. Đã trả viewport về mặc định và tải lại trang để xóa trạng thái thử.

## Các điểm nên giữ

1. Nền xám than và mô hình đặc có màu theo nguồn giải phẫu. Nền không tranh sự chú ý với mô hình.
2. Một không gian Vision, quét trực tiếp trên camera hiện có. Không thêm lại trang quét riêng.
3. Chọn vùng rồi chọn mô hình thay cho danh sách 30 nút trải ngang phía dưới.
4. Góc nhìn Trước/Sau/Bên/Đặt lại, tìm cấu trúc, tách theo hệ hoặc từng cơ, hỗ trợ chuột/bàn phím.
5. Button có focus-visible; nhiều select có label; panel có aria-expanded/aria-controls; trạng thái đọc/micro và thông báo có vùng live.
6. Thống kê có chiều cao cố định và số dạng tabular: đã giảm nhấp nhô so với trước.

## Vấn đề theo thứ tự ưu tiên

### P1 — Điện thoại bị chồng nhiều lớp giao diện

**Tái hiện:** viewport 390×844. Ngay khi Giọng nói và chú thích đều đóng, thanh góc nhìn đã đè lên tiêu đề Cẳng tay của bảng phía dưới. Header xuống dòng, tên trang bị cắt. Camera/công cụ vẫn chiếm cột bên phải; mô hình bị panel dưới che một phần.

**Đo:** iframe rộng khoảng 356.8 px sau lề trang; panel dưới rộng 336.8 px, cao 278.8 px. Panel bắt đầu ở y≈485.6 trong iframe; thanh góc nhìn bắt đầu y≈478.8, cao≈55.6 — hai vùng giao nhau. Cột phải rộng 132 px. Khi mở Giọng nói và chú thích, bề rộng phần nội dung chỉ khoảng 121.6 px, làm tên cấu trúc và nút xuống nhiều dòng.

**Nguyên nhân:** CSS dùng các khối fixed và các mốc bottom độc lập: panel theo `36dvh`, góc nhìn theo `240px`; cột desktop vẫn tồn tại trên mobile. Nhiều lớp CSS ghi đè qua các breakpoint 900/820/720/600 tạo hành vi không thống nhất.

**Sửa:** mobile cần bố cục riêng: mô hình ưu tiên toàn vùng quan sát, toolbar ngắn, camera gọn, một bảng dưới có tab Mô hình/Lớp/Thông tin/Giọng nói. Mở một tab thay vì xếp nhiều panel hẹp đồng thời. Vị trí góc nhìn phải dựa trên vùng stage còn trống, không dùng mốc bottom đoán trước.

**Đạt khi:** ở 390×844 và các cỡ 360/430 px, không nút hoặc nội dung bắt buộc nào đè nhau; xoay/zoom/chọn cấu trúc vẫn thao tác được; đọc tên đầy đủ; không cần cuộn ngang.

### P1 — Camera tắt nhưng vẫn mời bấm Quét

**Tái hiện:** camera tắt, nút lớn vẫn là Quét bộ phận. Bấm vào nhận “Bật camera trong Vision trước khi quét.” Tuy nhiên dòng gợi ý chuyển thành “Điều chỉnh vùng rồi bấm Quét lại”, dù camera chưa bật. Người dùng phải tự tìm nút 📷 phía dưới.

**Sửa:** CTA theo trạng thái:

- Tắt → **Bật camera**.
- Xin quyền/đang nạp → trạng thái chờ có giải thích.
- Sẵn sàng → **Quét bộ phận**.
- Đang quét → tiến trình và **Hủy quét**.
- Có kết quả → **Mở mô hình** / **Quét lại**; camera tiếp tục chạy theo lựa chọn hiện tại.
- Lỗi → lý do và hành động khắc phục tương ứng.

Không hiển thị hướng dẫn chỉnh vùng khi không có hình camera. Các lệnh giọng nói và click phải dẫn đến cùng trạng thái.

### P1 — Giọng nói và chú thích gây cuộn lồng nhau

**Tái hiện:** 1366×768, mở Giọng nói rồi gửi lệnh chọn cơ cánh tay-quay. Cột phải clientHeight≈654 px nhưng scrollHeight≈998 px; phần thống kê phía trên bị cuộn khuất. Voice panel và part card lại có vùng overflow riêng. Trên mobile, mỗi bảng cao tối đa 280 px trong cột chỉ 132 px, nội dung dài hơn nhiều lần chiều cao nhìn thấy. Bot nổi đè lên một phần bảng.

**Sửa:** camera và thanh thao tác cơ bản ở vùng ổn định. Thông tin cấu trúc/Giọng nói dùng một vùng chi tiết có tab hoặc drawer đủ rộng; chỉ một vùng cuộn chính cho nội dung đang mở. Khi chọn cấu trúc, mở tab Thông tin nhưng không cuộn mất camera/nút thao tác. Chừa vùng cho Bot hoặc thu Bot về nút nhỏ khi bảng mở.

**Đạt khi:** mở voice + chọn cấu trúc không làm CTA camera hoặc tiêu đề đang cần dùng biến mất; tên, nút đóng, Đọc và Xem riêng luôn có thể tiếp cận.

### P1 — Trạng thái nút xoay không khớp trạng thái ứng dụng

**Bằng chứng DOM:** `#bRotate` có `class="icon on"` trên mô hình Cẳng tay.

**Bằng chứng nguồn:** constructor đặt autoRotate theo loại surface; `selectModel` và nút góc nhìn đặt `autoRotate=false`, nhưng không đồng bộ lớp `on` của `#bRotate`. Vì vậy nút có thể trông đang bật trong khi auto-rotate đã tắt.

**Sửa:** dùng một hàm cập nhật trạng thái chung cho click, phím tắt, giọng nói, chuyển mô hình, góc nhìn và reset. Đồng bộ vẻ ngoài, tooltip và `aria-pressed`. Nút đóng/mở panel cũng đổi tên hành động theo trạng thái, hiện vẫn giữ tooltip “Thu gọn” sau khi đã thu gọn.

**Đạt khi:** mọi đường kích hoạt cho kết quả hiển thị và trạng thái accessibility giống nhau.

### P2 — Quá nhiều biểu tượng thiếu giải thích và phân cấp

Có 10 nút emoji: 📷/🏷️/⟳/🔄/✂/🎓/🎤/⏺/▶/?. Hai biểu tượng xoay khó phân biệt. Hầu hết chỉ có title tiếng Anh; không có aria-pressed cho nút bật/tắt. Emoji khác nhau giữa hệ điều hành, chưa tạo cảm giác một hệ giao diện thống nhất.

**Đo:** desktop khoảng 38×36 px; mobile 30×30 px. Không tự kết luận vi phạm WCAG về target size: mức AA yêu cầu tối thiểu 24×24 CSS px hoặc các ngoại lệ/điều kiện spacing. Nhưng tác vụ cảm ứng và điều khiển bằng tay nên có vùng bấm thoải mái hơn, hướng tới 44×44 px cho nút chính.

**Sửa:** dùng icon SVG cùng bộ; giữ nút thường dùng có nhãn: Camera, Nhãn, Tự xoay, Micro. Gộp Quiz/Ghi hình/Demo/Trợ giúp vào menu Công cụ. Phân biệt rõ “Tự xoay” và “Xoay bằng tay”. Có tên truy cập, trạng thái, tooltip theo ngôn ngữ và phản hồi hành động.

### P2 — Chữ và ngôn ngữ thiếu nhất quán

Nhiều nhãn chỉ 10–12 px; camera mobile có chữ 9 px. Bảng điều khiển 1920×1080 vẫn phải cuộn: cao≈907 px, nội dung≈1006 px. Khối thông tin OBJ, đường biên hở, texture và mã FJ xuất hiện giữa tác vụ học bình thường.

Route Việt vẫn có Anatomy, camera off, “Assembling”, title tiếng Anh và trợ giúp “engines & car”. Voice hiển thị hai ngôn ngữ trên mọi nhãn khiến select và nút dễ chật. Tên mạch máu trong danh sách vẫn nhiều mục tiếng Anh. Đây là thiếu hoàn thiện nội dung, độc lập với parser giọng nói đã được chuẩn hóa.

**Sửa:** UI chỉ dùng ngôn ngữ được chọn; tên gốc/Latin ở dòng phụ khi cần. Nhãn cơ bản 13–14 px, nội dung đọc 14–16 px là mục tiêu thiết kế, cần kiểm tra với mật độ thực tế. Đưa chất lượng render và dữ liệu nguồn vào “Nâng cao/Thông tin nguồn”. Đặt tìm cấu trúc gần đầu vùng lớp. Không dùng mã FJ như thông tin chính; giữ mã trong chi tiết hoặc cho tìm kiếm chuyên môn.

### P2 — Tách hết cơ làm mất khả năng đọc chi tiết

**Tái hiện:** Cẳng tay, Tách từng cơ, 100%. Từng mảnh không chồng như ảnh lỗi cũ, nhưng nhiều cơ trở thành mảnh nhỏ trong lưới. Một số nhãn dễ đọc hơn chính cơ. Không nên tăng số tag để giải quyết cảm giác thiếu chi tiết.

**Sửa:** giữ tổng quan để chọn nhanh; click một cơ → focus/zoom cơ đó và hiển thị thông tin, có nút trở lại tổng quan. Có tùy chọn nhóm nông/sâu/gấp/duỗi khi dữ liệu đã được xác minh. Có mô hình ngữ cảnh mờ hoặc thao tác ráp lại để hiểu vị trí gốc. Nhãn ưu tiên phần đang chọn/hover và các mốc cần học; tên dài hiển thị trong thẻ chi tiết. Không bịa texture thớ cơ để làm đẹp: lưới và texture nguồn hiện có giới hạn riêng.

### P2 — Header và thống kê lặp, còn nội dung cũ

Vision AI xuất hiện ở header, pill và brand trong stage. Header chỉ có một nút “Điều khiển” nhưng trông như tab. Bộ đếm ngoài hiển thị nhận diện/vẽ/tay 0 trong khi iframe hiển thị FPS render khác 0. Dễ tạo cảm giác dữ liệu mâu thuẫn; cần nối đúng nguồn hoặc loại khỏi luồng chính.

**Sửa:** một tên trang, một thanh công cụ ngắn. Badge chính chỉ nêu trạng thái camera/micro/hệ đang xem; số FPS/worker/GPU trong popup Chẩn đoán hoặc chế độ phát triển. Chỉnh hướng dẫn nói về “mô hình đặc/giải phẫu” thay cho “gọi hạt” và “engines & car”.

## Hướng thiết kế đề xuất

Desktop: một header; panel trái cho Vùng/Mô hình/Tìm cấu trúc/Lớp; stage giữa; camera phải; công cụ chính có nhãn; vùng Thông tin/Giọng nói có tab và chiều rộng đủ đọc. Chỉ bật mở phần nâng cao khi cần. Nền stage giữ xám than hiện tại; màu nhấn xanh ngọc hiện tại dùng nhất quán cho lựa chọn và thao tác chính.

Laptop: panel có thể thu gọn, vùng chi tiết mở theo nhu cầu và không giấu CTA camera. Mobile: bỏ bố cục ba cột, dùng một bottom sheet có tab và camera nhỏ có thể mở rộng khi quét; khi quét mở rộng phải thể hiện rõ đây là bước đang thao tác, có đường trở về.

## Thứ tự triển khai và nghiệm thu

1. Làm vùng stage/panel responsive; sửa chồng panel/góc nhìn/header.
2. Chuẩn hóa camera state + CTA; sửa trạng thái tự xoay và các toggle.
3. Làm vùng chi tiết có tab, bỏ cuộn lồng và tránh Bot che điều khiển.
4. Chuẩn hóa bộ icon, nhãn Việt/Anh, chữ và phân cấp thông tin.
5. Focus từng cơ, chú thích theo ngữ cảnh; đối chiếu tên/mã/anchor với mesh thực tế.
6. Kiểm thử keyboard, focus, screen reader, zoom trình duyệt 200%, reduced motion, camera bị từ chối/mất kết nối; quét thật và chuyển mẫu; micro/loa thật cả Việt/Anh.

Mỗi bước cần ảnh trước/sau ở 1920×1080, 1366×768, 768×1024, 390×844. Không kết luận đã hoàn hảo chỉ bằng ảnh desktop hoặc FPS. Với mô hình tương tác 3D có các ngoại lệ reflow cần xem xét theo tiêu chuẩn; các panel văn bản và control vẫn phải dùng được.

## Bằng chứng hình ảnh

- [Desktop 1920×1080](UI-UX-desktop-20261008.png)
- [Laptop mở Giọng nói và chọn cấu trúc](UI-UX-laptop-20261008.png)
- [Điện thoại, bảng phụ đóng](UI-UX-mobile-20261008.png)
- [Điện thoại, Giọng nói và chú thích cùng mở](UI-UX-mobile-expanded-20261008.png)
- [Bấm quét khi camera tắt](UI-UX-camera-off-20261008.png)
- [Tách từng cơ 100%](UI-UX-muscles-20261008.png)

## Nguồn đối chiếu tiêu chuẩn

- [W3C — WCAG 2.2, Target Size Minimum (AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): 24×24 CSS px hoặc điều kiện/ngoại lệ tương ứng.
- [W3C — Target Size Enhanced (AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size): mục tiêu 44×44 CSS px; không nhầm với ngưỡng AA.
- [W3C — WCAG](https://www.w3.org/TR/wcag/): dùng làm cơ sở nghiệm thu accessibility; cần audit riêng để xác nhận conformance.

## Vị trí nguồn cần xử lý khi triển khai

- `Soma_Fe/public/wonder/styles.css`: breakpoint mobile, panel fixed, view-presets, top-right/voice-panel/part-card overflow và các lớp ghi đè.
- `Soma_Fe/public/wonder/index.html`: toolbar, camera CTA, nhãn/help, vai trò trạng thái/toggle.
- `Soma_Fe/public/wonder/src/app.js`: camera state/result hints, toggle sync, selectModel/view presets, focus cấu trúc.
- `Soma_Fe/src/app/[locale]/cu-chi/page.tsx`: header, bộ đếm ngoài, bridge scan và giới hạn stage.
- Soma Bot/theme control: vùng an toàn khi panel chi tiết mở, nhất là màn hình nhỏ.
