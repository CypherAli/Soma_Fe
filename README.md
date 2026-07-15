# Soma 3D

> Nền tảng **atlas giải phẫu 3D tương tác** cho ngành y — con người & thú y.
> Đồ án tốt nghiệp. Xem kế hoạch chi tiết tại [PLAN.md](./PLAN.md).

## Tính năng (P0 — nền tảng)

- Viewer 3D (React Three Fiber): xoay, zoom, click chọn bộ phận, highlight.
- Panel thông tin bộ phận (tên đa ngữ + Latin + mô tả).
- Sidebar hệ cơ quan với bật/tắt hiển thị.
- Giao diện đa ngữ: **Tiếng Việt · English · 中文** (next-intl).

> Hiện dùng *body giữ chỗ*. Mô hình giải phẫu thật (Z-Anatomy) sẽ được nạp ở giai đoạn P1.

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

## Dữ liệu & giấy phép

Mô hình giải phẫu dựa trên [Z-Anatomy](https://www.z-anatomy.com/) (CC-BY-SA, dẫn xuất từ
BodyParts3D). Thuật ngữ theo chuẩn Terminologia Anatomica (TA2). Nguồn được ghi đầy đủ.
