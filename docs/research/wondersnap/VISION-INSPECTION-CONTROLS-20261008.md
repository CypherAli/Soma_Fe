# Vision AI: chọn bộ phận, xoay và tách riêng — 08/10/2026

## Nguyên nhân được xác nhận bằng mã nguồn

- `app.js` trước đây lấy `ctl.handY` để cộng pitch. Khi đổi từ trỏ sang xòe/nắm, lòng bàn tay đổi độ cao và làm mô hình nghiêng dù người dùng chỉ muốn xoay ngang. WonderSnap gốc cũng có hành vi này; sao chép nguyên bản không đáp ứng yêu cầu mới.
- Một biến `manualExplode` nhận độ mở tay cho cả mô hình, không phân biệt đang chọn hay chưa. Kéo riêng cấu trúc trước đây chỉ là bật/tắt bằng pinch.
- Trỏ tay dùng anchor gần nhất trong bán kính 120 px, còn chuột dùng raycast bề mặt thật. Hai cách cho kết quả khác nhau.
- Nhãn hệ dùng index của cấu trúc đầu tiên trong hệ. Chữ “Hệ xương” không có phạm vi chọn nhóm thực sự.

## Hợp đồng thao tác hiện tại

1. Tay và chuột chỉ điều khiển yaw. Độ cao tay không tham gia rotation. Giữ nguyên góc đang xem khi bỏ tay; không tự trở về góc 3/4.
2. Trỏ giữ 450 ms để chọn. Mô hình đặc dùng raycast; mỗi khung inference chỉ raycast một lần. Nhãn có vùng hit riêng và phạm vi đúng với nội dung nhãn.
3. Chưa chọn, đang hiện nhiều khối: xòe/nắm điều khiển mức tách toàn cảnh. Nếu chỉ một khối giải phẫu có từ hai cấu trúc nguồn đang hiển thị, tự chọn đúng khối đó và xòe/nắm tách các cấu trúc bên trong; không dịch cả hệ như một khối. Chọn một khối: đóng băng mức tách toàn cảnh, camera và transform các hệ khác; xòe/nắm tách từng cấu trúc nguồn bên trong khối đó, liên tục 0–1. Chọn đúng một cấu trúc nguồn: kéo riêng cấu trúc đó ra. Không tự bịa các lớp bên trong một mesh đơn.
4. Bỏ lựa chọn bằng Esc, đóng thẻ hoặc click khoảng trống. Chỉ trỏ ra ngoài không tự làm mất lựa chọn.
5. Sau khi trỏ hoặc đưa tay trở lại, lấy mốc mới; không lấy ngay độ mở hiện tại làm lệnh kéo. Nắm rồi xòe để bắt đầu kéo. Hai tay vẫn zoom toàn cảnh.
6. Slider, wheel, phím E/lên/xuống, nút Mở tay, Tách/Lắp lại và lệnh thoại tách/lắp phải cùng tác động lên phạm vi đang chọn. Nút góc nhìn/reset phải xóa mốc xoay cũ. Nút Tách xương sọ nằm ngay dưới danh sách mô hình, chọn đúng khối và tách bằng một lần bấm; bấm lại để lắp.
7. “Khối giải phẫu” cho phép chọn nhóm ngay cả khi chưa tách; khi mức tách >65% nhãn tổng quan được gom theo đúng phạm vi nhóm. “Từng cấu trúc”, chọn qua tìm kiếm và tách từng cơ giữ phạm vi một cấu trúc.
8. “Khối hộp sọ” là tập tên nguồn BodyParts3D được khai báo rõ, gồm xương sọ, hàm, răng/nướu. Không gồm đốt cổ, xương móng và sụn thanh quản. Không gọi toàn bộ nhóm skeletal là hộp sọ. Trong mẫu đầu hiện tại nhóm có 48 cấu trúc.
9. Like tay trái thực tế chuyển mô hình tổng kế tiếp và tự tạo hình. Like tay phải chuyển hệ bên trong cùng mô hình: Hệ cơ → Cơ quan giác quan → Tĩnh mạch → Động mạch → Hệ xương → các hệ còn lại, chỉ gồm hệ có trong nguồn và chưa ẩn. Xem riêng và chọn toàn bộ cấu trúc nguồn của hệ; nắm/xòe tiếp tục lắp/tách. Không nạp lại model hoặc camera khi chuyển hệ. Nút Hệ tiếp dùng cùng logic; dòng cạnh nút ghi hệ và vị trí trong chu kỳ.

## Quy tắc cho agent tiếp theo

- `inspection-controls.js` là logic thuần cho yaw, tách riêng và tập selection. `selection.ids` là nguồn chung cho mesh, particle mask và anchor. Không thêm thuật toán chọn khác riêng cho tay/chuột.
- Không đổi màu, mesh nguồn, taxonomy giải phẫu khi sửa cử chỉ. Không làm giả texture/thớ cơ để che hạn chế nguồn.
- GPU pick buffer được remap chỉ khi đổi lựa chọn; bản pick nguồn không bị sửa. Không upload mask mỗi animation frame.
- Anchor, mesh và particle phải dùng cùng `partTransform`/smoothstep của cùng khung render. Tách riêng không được thay đổi transform của mesh ngoài selection.
- Giới hạn độ kéo bằng envelope chia 32 dải theo chiều cao từ các đỉnh lưới nguồn, FOV, chiều cao viewport và khoảng cách camera hiện tại. Không dùng một bounding box chung: góc giả ghép đỉnh sọ với hàm có thể chặn hoàn toàn khoảng kéo. Envelope được tính khi đổi selection, không duyệt cả lưới mỗi frame. Test trình duyệt đối chiếu mọi đỉnh thật sau khi kéo.
- Bản đầu chỉ kéo nhóm như một khối, nên các xương sọ vẫn dính nhau. Đã thay bằng `partLayout`: tính bounding box từ đỉnh nguồn theo pick ID; xếp ô theo kích thước thật với khoảng hở 9% kích thước lớn nhất. Răng nhỏ dùng ô nhỏ. Áp một tỉ lệ đồng nhất cho các mesh đã chọn và nội suy về tọa độ gốc; không sửa các đỉnh nguồn hay tỉ lệ tương đối của xương. Tập 48 cấu trúc bao gồm cả răng/nướu, không gọi chúng là 48 xương.
- Bố cục được tính một lần khi chọn, có giới hạn bán kính theo FOV và viewport. GPU nhận offset riêng từng cấu trúc qua attribute; pick ID chỉ remap để highlight cả nhóm. `simRef.js` phải đổi cùng shader và có kiểm tra GPU/CPU thực tế. Không upload offset từng khung hình.
- Khi khối tách >12%, hiện tên từng cấu trúc thay cho nhãn tổng quan của khối; hit target và đường nối dùng đúng anchor đã biến đổi. Chế độ hiển thị đổi thành Tách cấu trúc trong khối, bỏ chọn khôi phục chế độ trước.
- Không hứa “100% hoàn hảo” dựa trên test mô phỏng. Kiểm chứng webcam thật còn phụ thuộc FPS inference, ánh sáng, tư thế và thiết bị.
- `singleVisibleGroup` chỉ định tuyến tự động khi tất cả pick thực sự hiện có cùng semantic key và có ít nhất hai cấu trúc. Lọc trực tiếp từ surface, profile, hiddenSystems, cover và focus; không dùng danh sách anchor cũ khi đổi bộ lọc. Trỏ/chọn rõ ràng vẫn ưu tiên và giữ mốc tương đối. Khi tự chọn khối đang hiện, độ mở tay ban đầu là lệnh tách, nên người dùng đã xòe tay không phải nắm lại để kích hoạt. Sau đó nút/slider giữ quyền điều khiển đến lần thay đổi độ mở chủ động tiếp theo.
- Khi đổi chế độ quan sát, xóa cả mức tách đích và mức tách hiện tại để loại bỏ offset hệ cũ. Nút tách ưu tiên khối đang hiển thị; dòng ngay dưới nút ghi số cấu trúc và thao tác xòe/nắm.
- `hand-navigation.js`: giữ handedness và score trên từng mảng landmark ở cả CPU worker và fallback, trước khi chọn tay chính. Đầu vào inference hiện không lật gương; `mirrorHandResults` sửa nhãn theo quy ước đầu vào selfie của MediaPipe rồi lật tọa độ đúng một lần. Không dùng vị trí trái/phải trên màn hình để đoán tay thực tế; tay bắt chéo vẫn giữ hành động. Tham khảo [MediaPipe Hands — handedness](https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/hands.md#multi_handedness). Webcam phần cứng chưa được kiểm chứng; kiểm tra nhãn Tay trái/Tay phải hiện trên pill khi thử thực tế.
- Like cần score ≥0.75 và giữ 0.4 giây theo thời gian thật. Mỗi tay có latch riêng, neutral 0.2 giây hoặc vắng 0.8 giây mới rearm. Dropout ngắn không lặp. Hai tay cùng like bị chặn; camera scan không điều hướng. Like chặn xoay, tách và zoom cùng lúc. Camera THUMB không đi qua lệnh next cũ trong WonderState; Controller xếp action để App xử lý.
- Scope `system` chọn đúng tất cả pick có system đang xem; scope `group` vẫn giữ semantic skull riêng. Chuyển hệ đóng băng các gesture khác, cập nhật filter và chọn sau khi common draw transform đã tính, tránh layout dùng scale/offset cũ.

## Kiểm chứng

- `node scripts/test-inspection-controls.mjs`: yaw ở 30/60/120 FPS, seam, mất/đưa tay lại; chu kỳ mở/đóng và nút; tập hộp sọ đối chiếu manifest thật; remap particle; transform của lớp `AtlasSurface.draw` thật; tải toàn bộ mesh đầu nguồn, chứng minh 48 cấu trúc có ô riêng và không giao nhau ở góc trước, lắp lại chính xác và attribute GPU khớp offset.
- `node scripts/inspection-ui-fixture.mjs`: sinh HTML QA tạm. Nút Run chạy ứng dụng thật, synthetic landmark qua Controller và App; test trỏ chọn nhãn, 48 cấu trúc di chuyển riêng, mở/đóng, mesh khác bất biến, nâng/hạ không pitch, xoay ngang và tái bắt tay, nút tách từ màn hình Xương và khớp, khoảng hở và kiểm tra từng đỉnh trong viewport. Đối chiếu một bước transform feedback GPU với CPU. Xóa HTML sinh ra sau QA.
- Các regression cũ: hand rotation, label layout, camera/handoff, scan control và voice (189 assertions) đạt.
- Regression cẳng tay bổ sung: chọn Cẳng tay, lọc Xương và khớp, xòe tay ngay khi chưa chọn/nút nào. Ba cấu trúc nguồn tách thành ba ô có nhãn riêng, mọi đỉnh nằm trên thanh công cụ; nắm trả đúng pose và scale nguồn, xòe lại hoạt động. Nút lắp lại không bị tay đang xòe ghi đè; nút tách từ view đã lọc chọn đúng ba cấu trúc. Đạt trên ứng dụng thật với landmark mô phỏng; ảnh `VISION-FOREARM-SPLIT-20261008.png`.
- `node scripts/test-hand-navigation.mjs`: physical side metadata/worker structuredClone, 6/11/30 FPS one-shot, screen-position independence, neutral/dropout guard, simultaneous likes, scan suspension, right-hand isolation from model-next, real fingers manifest system membership. UI fixture: right like cycles muscles (29 structures), sensory, veins without changing model/surface; open/fist splits current system; left like changes one main model and completes solid reveal, holding either side never repeats.
- ESLint cho các JS sửa: không có error; hai warning cũ trong app.js (`e`, `wide`). Build Next.js đạt, 663 trang. Webcam vật lý chưa kiểm chứng trong môi trường thử này.

## Khôi phục kỹ thuật cổ tay WonderSnap và ẩn tag khi thu tay

- So sánh trực tiếp với `wondersnap/src/logic/controller.js` và `wondersnap/src/app.js`: góc lấy từ cổ tay tới MCP ngón giữa, có hiệu chỉnh aspect; lọc sai khác góc ngắn bằng 0.5 mỗi mẫu; mốc grab tương đối, gain 2.2; nội suy render `1-exp(-9*dt)`. Khôi phục nguyên các hệ số và bỏ dead zone riêng 0.018 trước đó. Chỉ áp dụng yaw theo yêu cầu người dùng; không khôi phục pitch từ độ cao tay hay tự trở về góc 3/4 của bản gốc.
- Một mẫu trỏ chưa ổn định hoặc mất landmark ngắn được phép giữ grab tối đa 180 ms trong lúc góc mô hình đứng yên. Cử chỉ xác nhận, mất tay lâu, chọn cấu trúc, quét và nút góc nhìn vẫn xóa grab để bắt lại không nhảy góc.
- Like hợp lệ cần score/side và giữ tối thiểu 120 ms mới chặn xoay; lệnh chuyển vẫn cần 400 ms. Hai like đồng thời chặn cả zoom. Giữ nguyên điều hướng tay trái/tay phải.
- Worker lấy khung mới ngay khi hết request đang chạy, bỏ timer giới hạn 20 Hz. Vẫn chỉ một request đang xử lý, không xếp hàng ảnh cũ. GPU fallback không còn timer 10 Hz; CPU fallback trên UI thread vẫn giới hạn để tránh khóa giao diện. CPU worker vẫn là mặc định: chưa đo GPU và webcam phần cứng ở lượt này, không tuyên bố đạt 30 Hz nhận diện.
- Tag và hitbox tag ẩn khi thu các ngón (độ mở dưới 0.55), hoặc ngay lúc target tách giảm trong khi mô hình còn đang ráp. Khối đã ráp không giữ tag dày đặc chỉ vì vẫn được chọn. Xòe tách lại hiện tag; trỏ có thể hiện nhãn trong trạng thái khớp, nút Chú thích áp dụng cho cả nhãn đang chọn.
- `test-hand-rotation.mjs` đối chiếu từng bước công thức WonderSnap gốc ở 6/11/30 Hz đầu vào và 30/60/120 FPS render. `test-inspection-controls.mjs` kiểm tra giữ grab ngắn và ẩn nhãn trong lúc ráp. `test-hand-navigation.mjs` kiểm tra like nhiễu không giành xoay và chặn zoom khi hai like. `test-wonder-camera.mjs` kiểm tra khung kế tiếp không bị timer chặn và backpressure vẫn chỉ một request.
- UI fixture ứng dụng thật bổ sung kiểm tra nhãn biến mất khi hộp sọ còn đang ráp, nhãn cẳng tay ẩn khi nắm và trở lại khi xòe. Landmark mô phỏng, không phải xác nhận độ mượt webcam thực tế.
## Quy tắc trung tính đã được người dùng chốt (thay mốc tương đối)

Người dùng chọn: “Tay dựng thẳng đưa mô hình về góc Trước; nghiêng cổ tay để xoay trái/phải.”

- Vision sử dụng `HandYaw({upright:true})`: góc cổ tay thẳng theo trục dọc ảnh là yaw 0, vùng trung tính ±5 độ, bên ngoài vẫn gain 2.2 và damping `1-exp(-9*dt)`. Vị trí tay trái/phải hoặc cao/thấp trong khung không tham gia góc. Khi tay rời khung giữ góc đang xem; khi tay thẳng trở lại nội suy về Trước, không nhảy ngay. Đây là khác biệt có chủ ý so với mốc tương đối của WonderSnap gốc, theo lựa chọn của người dùng.
- Khi bắt đầu xoay, Controller lấy lại góc từ landmark cổ tay hiện tại trước khi tạo grab, loại bỏ đuôi lọc từ trỏ/like. Nếu không sửa, một bàn tay đã đứng yên vẫn đổi góc mô hình do roll còn đang hội tụ. Sau khi bắt mốc vẫn lọc sai khác góc ngắn bằng 0.5 mỗi mẫu như bản gốc.
- App nội suy từ tổng yaw hiện tại (`spin+dragYaw`) rồi chuyển quyền sang tay, xóa offset mouse/preset. Do đó nút Sau/Bên hoặc drag trước đó không làm tay thẳng vẫn giữ mô hình quay ngang. Khi không có tay, chuột và preset tiếp tục hoạt động.
- Không thay mesh, hệ tọa độ nguồn hay tính đúng giải phẫu. Khi yaw gần 90 độ, khoảng cách tách theo X vốn cũng bị xoay vào chiều sâu, khiến các khối nhìn chồng như ảnh người dùng. Quy tắc tay thẳng về Trước giúp trở về bố cục mở ngang.
- Unit: kiểm tra đuôi lọc ở 6/10/30 Hz; góc trung tính, jitter ±4.6 độ, hai chiều và mất/bắt tay ở render 30/60/120 FPS; công thức lọc và nội suy WonderSnap vẫn được đối chiếu riêng.
- UI fixture: đạt trên ứng dụng thật với landmark mô phỏng. Sau góc xoay, tay thẳng về Trước; sau trỏ không còn góc lọc dư; preset Sau không còn offset thứ hai; di chuyển tay thẳng qua các góc ảnh không gây xoay hoặc pitch. Cuối bài kiểm tra mở Cẳng tay, tay thẳng, yaw gần 0. Ảnh `VISION-UPRIGHT-FRONT-20261008.png`. Không coi đây là xác nhận webcam vật lý.