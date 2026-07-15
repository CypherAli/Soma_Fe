# Soma 3D — Kế hoạch đồ án tốt nghiệp

> **Soma 3D** — Nền tảng atlas giải phẫu 3D tương tác cho ngành y (con người & thú y).
> *soma* (σῶμα, tiếng Hy Lạp) = "cơ thể".

Tài liệu này là kế hoạch tổng thể của đồ án: mục tiêu, phạm vi, kiến trúc kỹ thuật,
nguồn dữ liệu, lộ trình theo giai đoạn, phân tích rủi ro và tiêu chí nghiệm thu.

---

## 1. Bối cảnh & Vấn đề

Sinh viên và giảng viên ngành y/thú y hiện học giải phẫu qua atlas 2D (sách Netter,
Gray's Anatomy) hoặc mô hình nhựa — khó hình dung không gian 3 chiều, không tương tác,
không cập nhật. Các nền tảng 3D thương mại như **BioDigital Human** giải quyết được điều
này nhưng có nhiều hạn chế:

| Hạn chế của BioDigital | Hướng giải quyết của Soma 3D |
|---|---|
| Đóng, trả phí, không tùy biến | Mã nguồn mở, dữ liệu mở (Z-Anatomy CC-BY-SA) |
| Chỉ có giải phẫu người | **Bổ sung thú y** — điểm khác biệt cốt lõi |
| Không hỗ trợ tiếng Việt | Đa ngữ **Việt – Anh – Trung**, kèm thuật ngữ Latin chuẩn |
| Không có công cụ học tập/kiểm tra | Quiz, bài tập, bệnh lý có trích nguồn y khoa |
| Không tích hợp AI | (Giai đoạn sau) Hỏi–đáp & điều khiển mô hình bằng ngôn ngữ tự nhiên |

**Tuyên bố bài toán:** Xây dựng một nền tảng web giải phẫu 3D tương tác, chính xác về
mặt y khoa, đa ngôn ngữ, chạy mượt trên máy tính phổ thông, mở rộng được từ người sang
thú y, có công cụ học tập đi kèm.

---

## 2. Mục tiêu

**Mục tiêu chính (con người — hoàn thành trước):**
1. Hiển thị mô hình giải phẫu người 3D, xoay/zoom mượt.
2. Bóc tách theo lớp: da → cơ → xương → nội tạng.
3. Click vào bộ phận → highlight + hiển thị thông tin (tên đa ngữ, Latin, mô tả).
4. Bật/tắt hiển thị theo hệ cơ quan; tìm kiếm bộ phận.
5. Giao diện đa ngữ Việt – Anh – Trung.

**Mục tiêu mở rộng (sau khi phần người hoàn thiện):**
6. Module học tập: quiz, bài tập, gắn bệnh lý vào cơ quan (có trích dẫn nguồn chuẩn).
7. Bổ sung mô hình giải phẫu **thú y** (chó/mèo trước).
8. Tích hợp AI hỗ trợ hỏi–đáp và điều khiển mô hình.

---

## 3. Phạm vi (Scope)

**Trong phạm vi:** ứng dụng web (desktop-first), giải phẫu người đại thể (gross anatomy)
theo hệ cơ quan chính, dữ liệu song ngữ có thuật ngữ Latin, công cụ học tập cơ bản, một
loài thú y mẫu.

**Ngoài phạm vi (giới hạn đồ án):** mô phỏng sinh lý động (dòng máu, điện tim), giải phẫu
vi thể/mô học, ứng dụng di động native, tính năng đa người dùng thời gian thực.

---

## 4. Kiến trúc kỹ thuật

### 4.1 Công nghệ

| Lớp | Công nghệ | Lý do |
|---|---|---|
| Framework | **Next.js 16** (App Router) | SSR/SSG, routing, tối ưu sẵn |
| 3D | **React Three Fiber + drei** (Three.js) | React hoá Three.js, hệ sinh thái mạnh |
| State | **Zustand** | Nhẹ, đơn giản cho trạng thái chọn/hiển thị |
| UI | **Tailwind CSS v4** | Dựng giao diện nhanh, nhất quán |
| Đa ngữ | **next-intl** | i18n chuẩn cho App Router (vi/en/zh) |
| Dữ liệu | JSON → **PostgreSQL + Prisma** (giai đoạn sau) | Tách nội dung khỏi mã |

### 4.2 Cấu trúc thư mục

```
soma-3d/
├── messages/              # File dịch: vi.json, en.json, zh.json
├── src/
│   ├── app/[locale]/      # Route đa ngữ (layout, page)
│   ├── components/
│   │   ├── viewer/        # Scene.tsx, AnatomyViewer.tsx (WebGL)
│   │   ├── TopBar.tsx     # Thanh trên: logo, tìm kiếm, đổi ngôn ngữ
│   │   ├── Sidebar.tsx    # Cây hệ cơ quan, bật/tắt lớp
│   │   └── InfoPanel.tsx  # Panel thông tin bộ phận
│   ├── i18n/              # Cấu hình next-intl (routing, request, navigation)
│   └── store/             # Zustand store trạng thái giải phẫu
└── PLAN.md                # Tài liệu này
```

### 4.3 Luồng tương tác lõi (đã hiện thực ở P0)

```
Người dùng click mesh
   → onClick raycast trúng bộ phận
   → cập nhật Zustand store (selected)
   → Scene highlight mesh (emissive)
   → InfoPanel hiển thị tên đa ngữ + Latin + mô tả
```

---

## 5. Pipeline dữ liệu & mô hình 3D (khâu kỹ thuật trọng yếu)

Đây là phần khó và ăn điểm nhất, vì mô hình giải phẫu đầy đủ rất nặng còn máy demo là
laptop tích hợp (Intel Iris Xe). Biến ràng buộc phần cứng thành bài toán tối ưu.

**Nguồn dữ liệu nền:** [Z-Anatomy](https://www.z-anatomy.com/) — atlas giải phẫu mã nguồn
mở, dẫn xuất từ **BodyParts3D** (Đại học Tokyo), giấy phép **CC-BY-SA**. Mỗi bộ phận là một
mesh riêng có **tên Latin theo chuẩn Terminologia Anatomica (TA2)**.

**Các bước pipeline:**
1. Tải file `.blend` Z-Anatomy vào Blender.
2. Script Python (Blender API) tự động: gom nhóm theo hệ cơ quan, làm sạch, giảm lưới.
3. Xuất **glTF/GLB nén Draco** (giảm ~70–90% dung lượng), giữ `mesh.name` = tên bộ phận.
4. Sinh cây phân cấp (hierarchy) + bảng tên đa ngữ Việt/Anh/Latin từ chính tên mesh.
5. Kỹ thuật tối ưu hiển thị: **LOD**, tải theo hệ cơ quan (lazy), ẩn mesh không nhìn thấy.

**Nguồn dữ liệu nội dung y khoa (trích dẫn chuẩn, không bịa):**
- Thuật ngữ: *Terminologia Anatomica (TA2)*, FIPAT.
- Mô tả/bệnh lý: *Gray's Anatomy*, *Netter's Atlas*, tài liệu giảng dạy chính thống.
- Thú y: *Miller's Anatomy of the Dog*, nguồn atlas thú y mở.

---

## 6. Lộ trình theo giai đoạn

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| **P0 — Nền tảng** | Khởi tạo dự án, khung viewer, đa ngữ, store, tài liệu plan | ✅ Xong |
| **P1 — Clone BioDigital (người)** | Nạp model Z-Anatomy thật, tách lớp da/cơ/xương/tạng, cây bộ phận đầy đủ, tìm kiếm | ⏳ Kế tiếp |
| **P2 — Nâng cấp học tập** | UI/UX riêng, quiz, bài tập, gắn bệnh lý (có nguồn) | ◻ |
| **P3 — Thú y** | Khảo sát & nạp mô hình chó/mèo | ◻ |
| **P4 — AI** | Hỏi–đáp & điều khiển mô hình bằng ngôn ngữ tự nhiên | ◻ |

**P0 đã hoàn thành:** dự án chạy được, có khung giao diện chuẩn BioDigital (viewer 3D +
sidebar + panel), đa ngữ VI/EN/ZH, vòng tương tác click→highlight→thông tin hoạt động
với body giữ chỗ (sẽ thay bằng mesh thật ở P1).

---

## 7. Rủi ro & Giải pháp

| Rủi ro | Mức | Giải pháp |
|---|---|---|
| Model giải phẫu quá nặng → giật khi demo | Cao | Pipeline nén Draco + LOD + tải theo hệ cơ quan |
| Máy demo không có card rời | Cao | Tối ưu polygon, giới hạn DPR, tránh hiệu ứng nặng |
| Dữ liệu thú y hiếm | Trung bình | Khảo sát nguồn sớm ở P3, chọn loài có dữ liệu tốt |
| Độ chính xác thuật ngữ y khoa | Trung bình | Bám chuẩn TA2 + trích nguồn, nhờ giảng viên y kiểm tra |
| License dữ liệu | Thấp | Dùng CC-BY-SA (Z-Anatomy), ghi nguồn đầy đủ |

---

## 8. Tiêu chí nghiệm thu

- [ ] Nạp và hiển thị mô hình giải phẫu người thật, xoay/zoom mượt (≥ 30 FPS trên máy demo).
- [ ] Bóc tách được tối thiểu 4 lớp (da, cơ, xương, nội tạng).
- [ ] Click ≥ 100 bộ phận có tên đa ngữ + Latin + mô tả.
- [ ] Tìm kiếm bộ phận theo tên.
- [ ] Giao diện đầy đủ 3 ngôn ngữ Việt/Anh/Trung.
- [ ] Có tối thiểu một bộ quiz/bài tập có trích nguồn.
- [ ] Có một loài thú y mẫu.

---

## 9. Nguồn tham khảo & Giấy phép

- **Z-Anatomy** — atlas giải phẫu mở, CC-BY-SA — https://www.z-anatomy.com/
- **BodyParts3D** — The Database Center for Life Science (DBCLS), CC-BY-SA.
- **Terminologia Anatomica (TA2)** — FIPAT, chuẩn thuật ngữ giải phẫu quốc tế.
- **Three.js / React Three Fiber / drei** — MIT.

*Mọi dữ liệu giải phẫu sử dụng trong đồ án đều tuân thủ giấy phép gốc và ghi nguồn đầy đủ.*
