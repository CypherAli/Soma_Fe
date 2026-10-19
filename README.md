# Soma 3D

> Nền tảng **atlas giải phẫu 3D tương tác** cho ngành y — con người & thú y.
> Đồ án tốt nghiệp. Xem kế hoạch chi tiết tại [PLAN.md](./PLAN.md).

## Tính năng

- Viewer 3D (React Three Fiber): xoay, zoom, click chọn bộ phận, highlight.
- Panel thông tin bộ phận (tên đa ngữ + Latin + mô tả).
- Sidebar hệ cơ quan với bật/tắt hiển thị.
- Giao diện đa ngữ: **Tiếng Việt · English · 中文** (next-intl).
- Quiz/trắc nghiệm (`src/lib/anatomy/schoolBank.ts`, `examBank.ts` — hiện là ngân hàng cứng ở FE, chưa đồng bộ DB).
- Vision AI `/cu-chi` (điều khiển cử chỉ + quét camera; cần `SOMA_VISION_URL` nếu không chỉ còn tầng MediaPipe offline).
- Trợ lý tra cứu (`src/lib/llm.ts` — không có `AI_API_KEY` thì chỉ trả nguyên văn giáo trình).
- Trang debug `/gesture-test` chỉ dùng ở dev (tự 404 ở production).

## Công nghệ

Next.js 16 · React Three Fiber + drei · Zustand · Tailwind CSS v4 · next-intl

## Chạy dự án

```bash
npm install
npm run dev
# Mở http://localhost:3000
```

## Cấu trúc

```
messages/            # File dịch vi/en/zh
src/app/[locale]/    # Route đa ngữ
src/components/       # TopBar, Sidebar, InfoPanel, viewer/
src/i18n/            # Cấu hình next-intl
src/store/           # Zustand store
```

Thư mục gốc workspace chỉ có `soma_be`, `Soma_Bo` và `Soma_Fe`. Các tài nguyên
phụ được giữ trong project tương ứng:

- `../soma_be/resources/medical_kb/`: kho nguồn y khoa và công cụ dựng chỉ mục RAG.
- `docs/research/`: các bản nghiên cứu, đối chiếu và kiểm tra Vision trước đây.
- `docs/reference-assets/`: ảnh tham khảo; `thumbnails/` là cache ảnh xem trước.
- `../soma_be/deploy/`: Docker Compose cho toàn bộ stack.
- `.claude/skills/eli5/`: skill giải thích dễ hiểu, đã thêm vào bảng trong `AGENTS.md`.

ELI5 cũng được cài vào thư mục skill cá nhân của Codex (`~/.codex/skills/eli5`).
Có thể yêu cầu `$eli5` giải thích một khái niệm hoặc thành phần dự án bằng tiếng Việt.

## Lưu đăng ký nhận tin

Footer chỉ báo email đã lưu sau khi API ghi thành công. Mặc định bản local dùng
`data/newsletter.jsonl`, đã bỏ qua trong Git và Docker. Khi triển khai một máy chủ,
đặt `SOMA_NEWSLETTER_FILE` tới file trên volume lưu bền; thư mục phải ghi được.
Không dùng ổ đĩa tạm của nền tảng hosting để lưu đăng ký. Nếu chạy nhiều máy chủ,
chuyển kho này sang cơ sở dữ liệu dùng chung. Chức năng này ghi nhận đăng ký;
không tự gửi chiến dịch email.

## Quản trị nội dung từ BO

Content Studio tại `http://localhost:3001` quản trị các nguồn công khai của FE,
bao gồm cảnh 3D, mô hình GLB thay thế, chú giải, bài giải thích, câu hỏi, chữ và
hình ảnh giao diện. Chạy `npm run cms:sync` sau khi đổi dữ liệu nguồn để cập nhật
`../soma_be/resources/cms/catalog.json`; `npm run verify:cms` kiểm tra đồng bộ.
Hướng dẫn vận hành và kiểm thử: `../Soma_Bo/docs/CONTENT_STUDIO.md`.

Nội dung chạy theo bản đã xuất bản trong PostgreSQL, giữ cache công khai gần nhất khi API gián đoạn và chỉ fallback về dữ liệu
nguồn. Không cần build lại FE sau mỗi lần xuất bản. FE dùng
`API_INTERNAL_URL` cho kết nối backend nội bộ khi triển khai khác origin.

## Dữ liệu & giấy phép

Mô hình giải phẫu dựa trên [Z-Anatomy](https://www.z-anatomy.com/) (CC-BY-SA, dẫn xuất từ
BodyParts3D). Thuật ngữ theo chuẩn Terminologia Anatomica (TA2). Nguồn được ghi đầy đủ.
