# Sắp xếp workspace Soma — 14/10/2026

Thư mục `đồ án` hiện chỉ chứa ba project:

```text
đồ án/
├── soma_be/
│   ├── deploy/                 # docker-compose.yml, .env.compose.example
│   └── resources/medical_kb/   # kho nguồn, corpus, chỉ mục và Git riêng
├── Soma_Bo/                    # giao diện quản trị
└── Soma_Fe/
    ├── .claude/skills/eli5/    # skill giải thích dễ hiểu của project
    └── docs/
        ├── research/          # hồ sơ kiểm tra/nghiên cứu Vision cũ
        └── reference-assets/  # sáu ảnh rời và thumbnails/
```

`medical_kb` là dữ liệu đang dùng cho tìm trong tài liệu, PDF và RAG, không phải
thư mục thừa. `research` là hồ sơ phát triển, không phải dịch vụ cần khởi động.
Các ảnh rời và thumbnails phục vụ tham khảo/xem trước, không phải một ứng dụng.
Docker Compose chạy đồng thời database và ba project; đặt trong backend để gốc gọn.

Đã cập nhật đường dẫn backend, script đồng bộ danh mục/bản dịch, công cụ xử lý
corpus Python, script dựng chú thích atlas và hướng dẫn back office. Không chạy
seed hoặc nhập lại dữ liệu; không thay đổi database khi sắp xếp thư mục.

Skill ELI5 có bản project và bản cài cá nhân ở `~/.codex/skills/eli5`. Bản mới
giải thích theo ngôn ngữ người dùng, đọc nguồn/code trước khi giải thích nội dung
cụ thể và không yêu cầu CLI Feynman chưa có trên máy. Cả hai bản được validator
skill kiểm tra. Việc cài skill không tự thêm chế độ ELI5 vào sản phẩm web.

Bằng chứng bảo toàn dữ liệu và các file trong Git của kho y khoa nằm tại
`soma_be/docs/audits/workspace-layout.json`: 1.020 SHA-256 khớp sau di chuyển.
Script và README được chủ động chỉnh đường dẫn nên không nằm trong tập bất biến.
Chạy lại từ gốc: `node soma_be/scripts/qa-workspace-layout.mjs`.

Docker Compose đã kiểm tra cấu hình; chưa tạo container, volume hoặc áp migration
bằng Docker trong lượt này. Dùng lệnh trong README backend khi muốn chạy cả stack.

Frontend lint/build, backend lint/build + 84 unit/19 HTTP test, back office
lint/typecheck và cú pháp/đường dẫn của công cụ Python đều đạt sau thay đổi.
Backend đã khởi động lại với code mới. Kiểm tra HTTP thật cuối cho health/PDF/RAG
chưa chạy: hệ thống duyệt tự động không hoàn tất do tài khoản Codex hết hạn mức.
Đây là giới hạn của lượt kiểm tra, không phải kết quả test API đạt hoặc lỗi ứng dụng.
