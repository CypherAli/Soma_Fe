# Audit giọng nói Vision AI — 2026-10-07

Kết luận: chưa đạt hỗ trợ Anh–Việt. Đây là kiểm tra nguồn và gọi trực tiếp parser/Voice/speak trong Node, không dùng micro/loa thật, không sửa tính năng trong lượt audit.

## Bằng chứng

- npm run test:voice đạt, nhưng script này import src/lib/voice/match.ts/globalCommands.ts, không import public/wonder/src/features.js đang dùng trong iframe Vision.
- Voice.start ở features.js:72 cố định rec.lang=vi-VN. Chưa có selector hoặc đồng bộ locale với iframe. Theo MDN SpeechRecognition.lang xác định ngôn ngữ phiên nhận dạng, không phải hỗ trợ hai ngôn ngữ chỉ nhờ parser.
- speak ở features.js:84-90 không gán utterance.lang/voice, không đợi voiceschanged, không báo thiếu giọng. index.html luôn lang=vi. Nội dung partSpeak/app.say chỉ label + info (tên Việt cộng tên nguồn Anh), bỏ description và learningNotes dù bảng chi tiết đã có.
- words ở features.js:23 xóa ký tự ngoài ASCII, KHÔNG normalize dấu. Tách lớp/phóng to/thu nhỏ/giải thích có dấu không tạo action, nhưng phiên bản không dấu làm được.
- Đọc chú thích -> model Cổ. Cơ cánh tay-quay trái -> model Cánh tay + record. Do not rotate/không xoay -> rotate. Đây là các câu tái hiện được trong vision-voice-audit.json, không phải lỗi nghe micro.
- English wrist/forearm/head/neck chưa khớp. show left brachioradialis trên labels forearm chọn index30 (Left anterior interosseous artery), do chỉ từ left đủ điểm còn tên English của cơ nằm trong info/sourceName không được đối chiếu.
- ALIASES còn Animal Cell/Sports Car ngoài catalog. app.voiceCommand findIndex=-1 gọi selectModel, WonderState.select modulo biến -1 thành model cuối; không báo không tìm thấy.
- toggleVoice đặt voiceOn=true trước rec.start; Voice.onerror chỉ tắt Voice.on khi không được phép, không cập nhật app.voiceOn/icon. start() nuốt exception nhưng vẫn trả true.
- Không có điều phối giữa TTS và SR trong features/app: micro có thể nghe tiếng loa rồi kích hoạt lệnh; đây là nguy cơ theo mã, chưa thử âm thanh vật lý.
- page.tsx:2456 đăng ký NO_VOICE_ACTIONS trong Control. Bot tổng và micro iframe không chung lệnh; lệnh scan/layers trước đây nằm trong nhánh scan cũ không được đăng ký ở giao diện hiện tại.

## Ưu tiên sửa

1. Tách trạng thái loa khỏi micro. Chọn Việt/English rõ ràng; TTS chọn voice cùng ngôn ngữ, đợi danh sách giọng và báo thiếu giọng, có dừng đọc; SR xử lý denied/network/end và dispose.
2. Một bộ intent cho nút/giọng/cử chỉ gọi đúng hành động Vision hiện tại. Ưu tiên cụm dài, giữ dấu gốc để phân biệt cơ/cổ, mắt/mặt, xử lý phủ định, không tách từ quay thành recording trong tên cơ.
3. Bỏ alias ngoài catalog. Ánh xạ bằng ID, chỉ chạy khi ID tồn tại. Alias Anh/Việt cho đủ30 model và cấu trúc, dùng sourceName/Latin đúng ID; không chọn chỉ vì left/right.
4. Nối lệnh Bot vào bridge iframe, giữ quyền sở hữu một phiên nghe, tạm ngừng nghe khi đọc, phục hồi nếu người dùng chưa tắt micro.
5. Nội dung đọc chọn theo ngôn ngữ và cấp độ (tên/mô tả/ghi chú nhóm); không tự dịch hoặc bịa phần nguồn chưa có.
6. Regression tests trực tiếp features.js + actual catalog + mock SR/TTS, sau đó nghiệm thu micro/loa Anh–Việt trên Chrome/Edge thực tế. Build/parse tests không đủ chứng nhận phát âm, giọng Việt có sẵn hoặc nhận dạng thuật ngữ y học.

Nguồn API: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/lang ; https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/lang ; https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
