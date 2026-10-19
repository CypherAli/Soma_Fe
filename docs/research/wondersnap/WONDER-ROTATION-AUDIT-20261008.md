# Đối chiếu luồng xoay WonderSnap và Vision AI

Ngày 08/10/2026. Lượt này đọc mã và mô phỏng để giải thích chênh lệch; không thay đổi cơ chế điều khiển đang chạy.

## Bằng chứng trực tiếp

- Cùng file hand_landmarker.task: SHA256 FBC2A30080C3C557093B5DDFC334698132EB341044CCEE322CCF8BCF3607CDE1. Không phải do dùng một model nhận diện tay khác.
- WonderSnap/src/hands.js ưu tiên GPU, fallback CPU; detectForVideo nhận trực tiếp video 720p mỗi khung mới. Không có worker, resize ImageBitmap hoặc timer nhận diện.
- Soma_Fe/public/wonder/src/hands.js ưu tiên CPU worker. Ảnh gốc 720p nhưng gửi inference dưới dạng ImageBitmap 320 px; kết quả chuyển lại main thread và tiêu thụ ở poll kế tiếp. Timer giới hạn worker đã bỏ ở lượt trước; vẫn chỉ một request in flight. Tần suất thật vẫn phụ thuộc inference và resize/transfer/poll, không phải FPS vẽ.
- Ảnh người dùng trước đó hiển thị khoảng 10–11 Hz nhận diện, 60 FPS vẽ, CPU worker. HUD detectMs chỉ đo detectForVideo trong worker, chưa gồm capture/resize/transfer/poll. Không có phép đo webcam gốc trên cùng máy trong lượt này nên chưa kết luận GPU chắc chắn đạt 30 Hz.
- Hai Controller đều lấy góc atan2 từ wrist tới middle MCP, có aspect ratio. Cùng bộ lọc sai khác góc ngắn 0.5/mẫu. Gain yaw 2.2 và nội suy render exp(-9*dt) đã giống bản gốc.
- Bộ lọc 0.5/mẫu không có cùng đáp ứng thời gian khi input Hz khác nhau: tau = 1/(Hz*ln(2)). Tau khoảng 48 ms tại 30 Hz, 144 ms tại 10 Hz. Sao chép cùng hệ số ở 10 Hz làm bộ lọc chậm hơn.
- Parent useHandTracking trong page.tsx có paused: viewMode === control; vòng lặp bỏ detect khi pausedRef.current. Không có bằng chứng hai tracker đang cùng nhận diện trong mode điều khiển; không quy lỗi cho hai camera/tracker chạy song song.
- Renderer gốc là GPU points; Vision thêm mesh BodyParts3D, IBL, vật liệu, raycast và nhãn. Có thêm chi phí xử lý nhưng ảnh 60 FPS không cho phép kết luận chi phí mesh là nguyên nhân chính của độ trễ tay.

## Mô phỏng riêng ảnh hưởng tốc độ đầu vào

Cùng bước đầu vào 0.5 rad, filter 0.5/mẫu, gain 2.2, damping render 9, bước render 1/240 s. Lấy trung bình 20 pha lệch đầu vào. Không cộng độ trễ inference, ảnh camera hay tải render. Dùng công thức tương đối gốc để giữ duy nhất biến input Hz.

| Input Hz | Tau filter (ms) | Đạt 50% góc (ms) | Đạt 90% góc (ms) |
| --- | ---: | ---: | ---: |
| 6 | 240 | 284 | 696 |
| 10 | 144 | 212 | 496 |
| 11 | 131 | 204 | 472 |
| 30 | 48 | 130 | 317 |

Đây là kết quả mô phỏng có kiểm soát, không phải benchmark webcam người dùng. Chênh lệch cho thấy render 60 FPS không khắc phục dữ liệu tay chậm.

## Các khác biệt về trải nghiệm

- Bản gốc dùng mốc xoay tương đối, có pitch theo độ cao tay và tự ease về góc 3/4 khi bỏ tay ở view tách. Vision hiện dùng quy tắc đã được người dùng chốt: cổ tay dựng thẳng về Trước, chỉ yaw, không auto nghiêng. Không tự hoàn nguyên lựa chọn này.
- Vision có thêm like trái/phải, scan và selected-part split. POINT raw hoặc stable, pinch, navigation và hai tay đều có thể ngắt quyền xoay. Cùng một dropout 100 ms ảnh hưởng nhiều hơn khi đầu vào chỉ 10 Hz. Giữ grab ngắn và gate like đã giảm một số ngắt nhưng chưa có thống kê camera thật về số lần bị ngắt.
- Demo WonderSnap sinh hand angle theo sin ở 30 Hz, không qua camera. Test xoay dùng synthetic 30 Hz. Test camera dùng Chromium fake webcam không có tay, yêu cầu FPS >10. Những test này không chứng minh độ mượt cổ tay thật đạt một mức FPS cụ thể.
- Ảnh downscale 320 có ít chi tiết bàn tay hơn video gốc; đây là rủi ro độ chính xác cần so sánh dữ liệu thật, không tuyên bố đã đo sai số landmark.

## Thứ tự khắc phục đề xuất

1. Đo capture-to-result age, inference time, input Hz, render frame time và lý do ngắt xoay; HUD phải phân biệt các con số này.
2. So sánh CPU worker và GPU trong cùng điều kiện và trên máy thật, một tracker tại một thời điểm. Chọn theo cả độ trễ tay và frame time mô hình, không chọn vì nhãn GPU/CPU.
3. Chuyển lọc góc sang thời gian thực với tau dựa trên đáp ứng bản gốc ở 30 Hz, thay vì 0.5 cố định mỗi mẫu; đánh giá nhiễu/lag ở 6/10/30 Hz. Nội suy render vẫn theo thời gian. Không thêm lọc liên tiếp để che sự chậm của tracker.
4. Dùng xác nhận cử chỉ và short dropout ownership hợp lý để xoay không bị ngắt bởi một mẫu phân loại nhiễu; giữ yêu cầu tay thẳng về Trước và yaw only.
5. Kiểm tra A/B bằng cùng động tác/camera, báo số đo và cảm giác thực tế. Test công thức hoặc build pass chỉ chứng minh tính đúng, không chứng minh mượt webcam.