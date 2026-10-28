# Voice: gom câu và giảm độ trễ — 29/10/2026

Người dùng kiểm thử thực tế tiếng Việt và phản ánh phải nói từng chữ, phải im lâu trước khi gửi, rồi chờ AI lâu. Kiểm thử giả lập trước đây chỉ xác nhận luồng sự kiện, không chứng minh độ chính xác nhận giọng thật.

## Bản sửa đã thực hiện

- Hội thoại gom các đoạn đã được recognizer xác nhận thành một câu, thay vì gọi bot sau mỗi đoạn. Khoảng gom mặc định 700 ms; đoạn đang nói tiếp chưa xác nhận chặn tự gửi. Kết thúc engine có thể chốt sớm hơn. Không biến bản chép tạm thành câu gửi tự động.
- Khi nhận `speechend`, sau 650 ms nếu chưa nói tiếp thì yêu cầu recognizer `stop()` để trả kết quả cuối, thay vì chờ timeout im lặng dài của dịch vụ. Không gọi `abort()` để ép chốt; nếu không hỗ trợ `stop()` vẫn dùng kết quả cuối thông thường.
- Nút Gửi/Enter có thể chốt phần chữ đang hiện, vẫn tiếp tục đường trả lời bằng giọng nói. Dừng nghe, đổi quyền sở hữu mic, lỗi hoặc bot đọc trả lời sẽ huỷ lượt đang gom. Giữ cơ chế chống tiếng loa thành câu hỏi mới.
- Bỏ khoảng chờ giao diện 1.400 ms ở trang trợ lý đầy đủ.
- Câu tra cứu có nguồn trực tiếp khớp rõ không cần gọi AI phân loại trước khi trả lời. Câu mơ hồ hoặc không có nguồn khớp chính xác vẫn đi qua bước viết lại. Giữ kiểm tra hạn mức trước mọi lượt AI và kiểm tra trích dẫn sau khi sinh trả lời.
- Các truy vấn viết lại được tra song song, vẫn giữ thứ tự trọng số và ranh giới người/động vật, Gan/Gân và nguồn hệ thống.
- Hội thoại giọng nói yêu cầu câu trả lời 2–4 câu ngắn và ngân sách 550 token; câu gõ giữ 900. Đây là giới hạn sinh trả lời, không phải cam kết thời gian phản hồi.

## Kiểm chứng và giới hạn

- 106 unit test, lint, typecheck và build production đạt.
- `node --import ./scripts/ts-resolve.mjs scripts/test-assistant-latency.mjs`: câu rõ Việt/Anh chỉ một lượt trả lời AI thay hai lượt nối tiếp; hạn mức vẫn kiểm tra trước, trích dẫn vẫn bắt buộc. Provider được giả lập, không thu tiền API.
- `node --import ./scripts/ts-resolve.mjs scripts/test-assistant-quota.mjs`: hết hạn mức hoặc backend lỗi không mở đường gọi AI.
- `node scripts/test-voice-conversation-browser.mjs`: QA browser cho VI/EN, câu chia thành nhiều mảnh, đọc trả lời, nghe tiếp, chốt bằng Gửi, chống echo và thiếu giọng đọc. Mic/loa/API dùng fixture; không thu âm thật trong QA.

Không công bố tỷ lệ nhận đúng hay thời gian đáp ứng đầu cuối từ các kiểm thử này. Engine STT/TTS vẫn của trình duyệt/hệ điều hành; chưa thay bằng dịch vụ nhận giọng riêng, chưa tích hợp voice vào APK/Expo laptop.

## Nâng cấp tiếp theo

Ưu tiên đánh giá STT riêng bằng bộ câu Việt/Anh người dùng nói tự nhiên, có nhiễu và thuật ngữ giải phẫu. So sánh bản chép và thời gian chốt câu trên cùng thiết bị. Ví dụ Cloud Speech-to-Text có `vi-VN` và `en-US`, nhưng chất lượng phù hợp phải đo trước khi kết nối dịch vụ mới. Sau đó mới đánh giá trả lời theo luồng và đọc từng câu có kiểm soát nguồn.

Tài liệu: [Web Speech recognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), [Google Cloud STT — ngôn ngữ hỗ trợ](https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages).
