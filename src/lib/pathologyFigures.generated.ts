/* SINH TỰ ĐỘNG bởi medical_kb/scripts/sync_figures.py — đừng sửa tay.
 *
 * Hình quét từ giáo trình, dùng cho mục đích học tập và có ghi nguồn.
 * `page` là số trang IN trên sách (đọc từ chân trang), không phải số
 * trang của file PDF — hai số này lệch nhau.
 */
export type PathologyFigure = {
  src: string;
  /** chú thích nguyên văn in trong sách */
  caption: string;
  source: string;
  page: number | null;
  /** true = số trang suy từ độ lệch, chưa đọc được trực tiếp */
  pageInferred: boolean;
  /** book = hình trong chính bài bệnh; related = cấu trúc/cơ chế liên quan */
  kind: "book" | "related";
};

export const pathologyFigures: Record<string, PathologyFigure[]> = {
  "ap-xe-phoi": [
    { src: "/figures/ap-xe-phoi/ap-xe-phoi-01.jpg", caption: "Hình 1.1. Hình ảnh viêm phổ trái - thùy trên có phế quản hơi (air bronchogram) trên phim X-quang", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 18, pageInferred: false, kind: "book" },
    { src: "/figures/ap-xe-phoi/ap-xe-phoi-02.jpg", caption: "Hình 1.3a. Dẫn lưu thùy đỉnh Hình 1.3b. Dẫn lưu thùy đáy", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 26, pageInferred: false, kind: "book" },
  ],
  "benh-gout": [
    { src: "/figures/benh-gout/benh-gout-01.jpg", caption: "Hình 6.11. và 6.12. Viêm khớp trong gút cấp", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 184, pageInferred: false, kind: "book" },
    { src: "/figures/benh-gout/benh-gout-02.jpg", caption: "Hình 6.13 và 6.14. Hạt tophi", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 185, pageInferred: false, kind: "book" },
  ],
  "benh-hemophilia": [
    { src: "/figures/benh-hemophilia/benh-hemophilia-01.jpg", caption: "Sơ đồ 8.1. Tóm tắt quá trình tạo thromboplastin nội sinh", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 463, pageInferred: false, kind: "book" },
  ],
  "benh-phoi-tac-nghen-man-tinh": [
    { src: "/figures/benh-phoi-tac-nghen-man-tinh/benh-phoi-tac-nghen-man-tinh-01.jpg", caption: "Hình 1.4. Hình ảnh Xquang ngực của một bệnh nhân bị BPTNMT", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 32, pageInferred: false, kind: "book" },
    { src: "/figures/benh-phoi-tac-nghen-man-tinh/benh-phoi-tac-nghen-man-tinh-02.jpg", caption: "Hình 1.5. Kết quả đo chức năng hô hấp của bệnh nhân BPTNMT", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 354, pageInferred: false, kind: "book" },
  ],
  "benh-than-da-nang": [
    { src: "/figures/benh-than-da-nang/benh-than-da-nang-01.jpg", caption: "Hình 3.10. Thận đa nang", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 451, pageInferred: false, kind: "book" },
  ],
  "benh-than-lupus": [
    { src: "/figures/benh-than-lupus/benh-than-lupus-01.jpg", caption: "Hình 3.7. Sơ đồ cơ chế bệnh sinh của bệnh thận lgA", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 418, pageInferred: false, kind: "book" },
    { src: "/figures/benh-than-lupus/benh-than-lupus-02.jpg", caption: "Hình 3.8. Hình ảnh từ bệnh nhân nam bệnh thận IgA, 29 tuổi.", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 421, pageInferred: false, kind: "book" },
  ],
  "benh-than-man-va-suy-than-giai-doan-cuoi-dieu-tri-bao-ton-va-thay-the-than-suy": [
    { src: "/figures/benh-than-man-va-suy-than-giai-doan-cuoi-dieu-tri-bao-ton-va-thay-the-than-suy/benh-than-man-va-suy-than-giai-doan-cuoi-dieu-tri-bao-ton-va-thay-the-than-suy-01.jpg", caption: "Hình 3.13. AVF ở cổ tay", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 518, pageInferred: false, kind: "book" },
    { src: "/figures/benh-than-man-va-suy-than-giai-doan-cuoi-dieu-tri-bao-ton-va-thay-the-than-suy/benh-than-man-va-suy-than-giai-doan-cuoi-dieu-tri-bao-ton-va-thay-the-than-suy-02.jpg", caption: "Hình 3.14. Sơ đồ quá trình lọc máu bằng thận nhân tạo", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 519, pageInferred: false, kind: "book" },
  ],
  "benh-viem-khop-tu-phat-thieu-nien": [
    { src: "/figures/benh-viem-khop-tu-phat-thieu-nien/benh-viem-khop-tu-phat-thieu-nien-01.jpg", caption: "Hình 6.6. Viêm các khớp nhỏ ở bàn tay Hình 6.7. Biến dạng khớp: bàn tay gió thổi,", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 3, pageInferred: false, kind: "book" },
    { src: "/figures/benh-viem-khop-tu-phat-thieu-nien/benh-viem-khop-tu-phat-thieu-nien-02.jpg", caption: "Hình 6.8. X-quang cỗ tay: hẹp khe khớp, Hình 6.9. Tổn thương tại cột sống cổ", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 174, pageInferred: false, kind: "book" },
  ],
  "dau-vung-that-lung-va-dau-than-kinh-toa-do-thoat-vi-dia-dem": [
    { src: "/figures/dau-vung-that-lung-va-dau-than-kinh-toa-do-thoat-vi-dia-dem/dau-vung-that-lung-va-dau-than-kinh-toa-do-thoat-vi-dia-dem-02.jpg", caption: "Hình 6.27. Trượt đốt sống L5 ra trước Hình 6.28. Nghiệm pháp Lasègue", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 271, pageInferred: false, kind: "book" },
    { src: "/figures/dau-vung-that-lung-va-dau-than-kinh-toa-do-thoat-vi-dia-dem/dau-vung-that-lung-va-dau-than-kinh-toa-do-thoat-vi-dia-dem-03.jpg", caption: "Hình 6.29. Thoát vị đĩa đệm cột sống thắt lưng L4 -L5 trên MRI", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 273, pageInferred: false, kind: "book" },
  ],
  "dieu-tri-mot-so-roi-loan-nhip-tim-thuong-gap": [
    { src: "/figures/dieu-tri-mot-so-roi-loan-nhip-tim-thuong-gap/dieu-tri-mot-so-roi-loan-nhip-tim-thuong-gap-01.jpg", caption: "Hình 2.11. Rung nhĩ với đáp ứng thất nhanh, 130-140 CK/ph.", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 316, pageInferred: false, kind: "book" },
    { src: "/figures/dieu-tri-mot-so-roi-loan-nhip-tim-thuong-gap/dieu-tri-mot-so-roi-loan-nhip-tim-thuong-gap-02.jpg", caption: "Hình 2. 12. ng nhĩ với đáp ứng thất chậm và rất đều, tần số thất: 46 CK/ph.", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 317, pageInferred: false, kind: "book" },
  ],
  "gian-phe-quan": [
    { src: "/figures/gian-phe-quan/gian-phe-quan-01.jpg", caption: "Hình 1.10. Phân loại giãn phế quản dựa vào chụp phế quản cản quang", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 102, pageInferred: false, kind: "book" },
  ],
  "hen-phe-quan": [
    { src: "/figures/hen-phe-quan/hen-phe-quan-01.jpg", caption: "Hình 1.6. Lưu lượng đỉnh kế và đối chiếu kết quả theo tuổi, giới,", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 52, pageInferred: false, kind: "book" },
  ],
  "hep-van-hai-la": [
    { src: "/figures/hep-van-hai-la/hep-van-hai-la-01.jpg", caption: "Sơ đồ 2.1. Thái độ điều trị khi bệnh nhân bị HHL", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 194, pageInferred: false, kind: "book" },
  ],
  "ho-ra-mau": [
    { src: "/figures/ho-ra-mau/ho-ra-mau-01.jpg", caption: "Hình 1.15. Chụp động mạch phế quản trước (A) và sau khi nút", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 177, pageInferred: false, kind: "book" },
  ],
  "hoi-chung-cushing": [
    { src: "/figures/hoi-chung-cushing/hoi-chung-cushing-01.jpg", caption: "Hình 7.1. Sự điều hòa bài tiết cortisol từ tuyến yên-dưới đồi trường hợp bình thường (a),", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 397, pageInferred: false, kind: "book" },
  ],
  "hoi-chung-ngung-tho-khi-ngu": [
    { src: "/figures/hoi-chung-ngung-tho-khi-ngu/hoi-chung-ngung-tho-khi-ngu-01.jpg", caption: "Hình 1.7. Phân độ Mallampati [5]", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 65, pageInferred: false, kind: "book" },
  ],
  "hoi-chung-than-hu": [
    { src: "/figures/hoi-chung-than-hu/hoi-chung-than-hu-01.jpg", caption: "Hình 3.6. Cấu trúc màng lọc cầu thận. Ep: tế bào biểu mô tạng; Ed: tế bào nội mô;", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 395, pageInferred: false, kind: "book" },
  ],
  "huyet-khoi-tinh-mach-sau-chi-duoi": [
    { src: "/figures/huyet-khoi-tinh-mach-sau-chi-duoi/huyet-khoi-tinh-mach-sau-chi-duoi-01.jpg", caption: "Hình 2.35. HKTM cơ dép trên siêu âm Hình 2.36. Huyết khối trong ĐM phổi trên", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 352, pageInferred: false, kind: "book" },
    { src: "/figures/huyet-khoi-tinh-mach-sau-chi-duoi/huyet-khoi-tinh-mach-sau-chi-duoi-02.jpg", caption: "Hình 3.1. Viêm cầu thận gian mạch", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 385, pageInferred: false, kind: "book" },
  ],
  "nhiem-khuan-co-xuong-khop": [
    { src: "/figures/nhiem-khuan-co-xuong-khop/nhiem-khuan-co-xuong-khop-01.jpg", caption: "Hình 6.21. Viêm mô tế bào xuất hiện ở chỉ dưới, một bên, ranh giới vùng đỏ da do bị bệnh", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 238, pageInferred: false, kind: "book" },
    { src: "/figures/nhiem-khuan-co-xuong-khop/nhiem-khuan-co-xuong-khop-02.jpg", caption: "Hình 6.22. Hình ảnh tồn thương xương trong viêm Xương tủy xương trên X-quang quy ước", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 239, pageInferred: false, kind: "book" },
  ],
  "nhoi-mau-co-tim-va-hoi-chung-vanh-cap": [
    { src: "/figures/nhoi-mau-co-tim-va-hoi-chung-vanh-cap/nhoi-mau-co-tim-va-hoi-chung-vanh-cap-01.jpg", caption: "Hình 2.8. Giải phẫu hệ động mạch vành", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 228, pageInferred: false, kind: "book" },
    { src: "/figures/nhoi-mau-co-tim-va-hoi-chung-vanh-cap/nhoi-mau-co-tim-va-hoi-chung-vanh-cap-02.jpg", caption: "Sơ đồ 2.2. Phác đồ loại trừ và xác định NMCT ST không chênh lên trong 1 giờ bằng troponin", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 237, pageInferred: false, kind: "book" },
  ],
  "ran-doc-can": [
    { src: "/figures/ran-doc-can/ran-doc-can-03.jpg", caption: "siamensis (hình 6.7): thường gặp ở miền Nam, có hai vòng kính, có thể", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 608, pageInferred: false, kind: "book" },
    { src: "/figures/ran-doc-can/ran-doc-can-04.jpg", caption: "Hình 9.4. Rắn cạp nong Hình 9.5. Rắn cạp nia Nam Hình 9.6. Rắn cạp nia", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 608, pageInferred: false, kind: "book" },
  ],
  "roi-loan-kali-mau": [
    { src: "/figures/roi-loan-kali-mau/roi-loan-kali-mau-01.jpg", caption: "Hình 9.1. Thay đối điện tim của 1 trường hợp tăng kali máu. Trên: khi tăng kali máu nặng;", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 601, pageInferred: false, kind: "book" },
    { src: "/figures/roi-loan-kali-mau/roi-loan-kali-mau-03.jpg", caption: "Hình 9.3. Hình ảnh điện tim một trường hợp hạ kali máu với T dẹt (hoặc âm) và có sóng U.", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 605, pageInferred: false, kind: "book" },
  ],
  "soi-tiet-nieu": [
    { src: "/figures/soi-tiet-nieu/soi-tiet-nieu-01.jpg", caption: "Hình 3.12. Vị trí sói thường gặp: sỏi niệu đạo (17), sỏi tuyến tiền liệt (8),", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 462, pageInferred: false, kind: "book" },
  ],
  "suy-thuong-than-man-tinh": [
    { src: "/figures/suy-thuong-than-man-tinh/suy-thuong-than-man-tinh-01.jpg", caption: "Hình 7.1. Sự điều hòa bài tiết cortisol từ tuyến yên-dưới đồi trường hợp bình thường (a),", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 397, pageInferred: false, kind: "book" },
    { src: "/figures/suy-thuong-than-man-tinh/suy-thuong-than-man-tinh-02.jpg", caption: "Hình 7.2. Sạm da và niêm mạc trong suy thượng thận tiên phát", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 400, pageInferred: false, kind: "book" },
  ],
  "suy-tinh-mach-man-tinh": [
    { src: "/figures/suy-tinh-mach-man-tinh/suy-tinh-mach-man-tinh-02.jpg", caption: "Hình 4.2. Giãn tĩnh mạch thân Hình 4.3. Suy tĩnh mạch kèm theo viêm da", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 581, pageInferred: true, kind: "book" },
    { src: "/figures/suy-tinh-mach-man-tinh/suy-tinh-mach-man-tinh-03.jpg", caption: "Hình 4.4. Suy tĩnh mạch có loét chân", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 581, pageInferred: true, kind: "book" },
  ],
  "tang-huyet-ap": [
    { src: "/figures/tang-huyet-ap/tang-huyet-ap-01.jpg", caption: "Hình 2.1. Cơ chế tác động của men chuyển dạng angiotensin", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 211, pageInferred: false, kind: "book" },
    { src: "/figures/tang-huyet-ap/tang-huyet-ap-02.jpg", caption: "Hình 2.5. Gợi ý phối hợp thuốc hạ huyết áp", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 221, pageInferred: false, kind: "book" },
  ],
  "thoai-hoa-khop": [
    { src: "/figures/thoai-hoa-khop/thoai-hoa-khop-02.jpg", caption: "Hình 6.18. Hạt Heberden ở khớp ngón xa và hạt Bouchard", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 203, pageInferred: false, kind: "book" },
  ],
  "ton-thuong-than-cap": [
    { src: "/figures/ton-thuong-than-cap/ton-thuong-than-cap-01.jpg", caption: "Sơ đồ 3.2. Định hướng chẩn đoán nguyên nhân tổn thương thận cấp", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 483, pageInferred: false, kind: "book" },
  ],
  "tran-dich-mang-phoi": [
    { src: "/figures/tran-dich-mang-phoi/tran-dich-mang-phoi-01.jpg", caption: "Hình 1.12. Tràn dịch màng phối khu trú trên phim X-quang", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 128, pageInferred: false, kind: "book" },
  ],
  "tran-khi-mang-phoi": [
    { src: "/figures/tran-khi-mang-phoi/tran-khi-mang-phoi-01.jpg", caption: "Hình 1.13. Hình ảnh TKMP bên phải làm phổi co rúm vào rốn phổi", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 143, pageInferred: false, kind: "book" },
    { src: "/figures/tran-khi-mang-phoi/tran-khi-mang-phoi-02.jpg", caption: "Hình 1.14. Hình ảnh giả tràn khí màng phổi", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 144, pageInferred: false, kind: "book" },
  ],
  "ung-thu-bieu-mo-te-bao-gan": [
    { src: "/figures/ung-thu-bieu-mo-te-bao-gan/ung-thu-bieu-mo-te-bao-gan-01.jpg", caption: "Hình 5.1. Hình ảnh khối u gan sát tĩnh mạch cửa với viền giảm âm trên siêu âm", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 47, pageInferred: false, kind: "book" },
    { src: "/figures/ung-thu-bieu-mo-te-bao-gan/ung-thu-bieu-mo-te-bao-gan-02.jpg", caption: "Hình 5.2. Hình ảnh điển hình của ung thư biểu mô tế bào gan trên phim chụp CLVT: A- Khi", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 48, pageInferred: false, kind: "book" },
  ],
  "viem-khop-phan-ung": [
    { src: "/figures/viem-khop-phan-ung/viem-khop-phan-ung-01.jpg", caption: "Hình 6.37. Tổn thương Hình 6.38 Tổnthương dày. Hình 3.39 Tổn thương viêm", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 292, pageInferred: false, kind: "book" },
  ],
  "viem-mang-ngoai-tim": [
    { src: "/figures/viem-mang-ngoai-tim/viem-mang-ngoai-tim-01.jpg", caption: "Hình 2.9. Điện tâm đồ trong viêm màng ngoài tim với hình ảnh ST chênh lên", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 299, pageInferred: false, kind: "book" },
    { src: "/figures/viem-mang-ngoai-tim/viem-mang-ngoai-tim-02.jpg", caption: "Hình 2.10. Dịch màng ngoài tim ở sau thành sau thất trái và phía trước thất phải (hình bên trái),", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 300, pageInferred: false, kind: "book" },
  ],
  "viem-phoi-cong-dong": [
    { src: "/figures/viem-phoi-cong-dong/viem-phoi-cong-dong-01.jpg", caption: "Hình 1.8. Hình ảnh viêm phổi trái- thùy trên có phế quản hơi", source: "Bệnh học Nội khoa, tập 1 — Đại học Y Hà Nội (2020)", page: 18, pageInferred: false, kind: "book" },
  ],
  "viem-quanh-khop-vai": [
    { src: "/figures/viem-quanh-khop-vai/viem-quanh-khop-vai-01.jpg", caption: "Hình 6.30. Các móc giải phẫu của khớp vai", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 281, pageInferred: false, kind: "book" },
    { src: "/figures/viem-quanh-khop-vai/viem-quanh-khop-vai-02.jpg", caption: "Hình 6.31. Các thành phần khớp vai qua diện cắt đứng dọc", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 281, pageInferred: false, kind: "book" },
  ],
  "xo-cung-bi": [
    { src: "/figures/xo-cung-bi/xo-cung-bi-01.jpg", caption: "Hình 6. 1. Tổn thương xơ da trong. 'xơ cứng bì toàn thể. Tổn thương xơ da xuất hiện ở chi", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 145, pageInferred: false, kind: "book" },
    { src: "/figures/xo-cung-bi/xo-cung-bi-02.jpg", caption: "Hình 6.2. Tổn thương da khư trú trong xơ cứng bì thường xuất hiện ở mặt, cổ (A, B) hoặc", source: "Bệnh học Nội khoa, tập 2 — Đại học Y Hà Nội (2020)", page: 146, pageInferred: false, kind: "book" },
  ],
  "benh-than-iga": [
    { src: "/figures/benh-than-iga/benh-than-iga-ref-01.jpg", caption: "Hình 27.1. Sơ đồ hệ tiết niêu", source: "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf", page: null, pageInferred: false, kind: "related" },
  ],
  "benh-than-man": [
    { src: "/figures/benh-than-man/benh-than-man-ref-01.jpg", caption: "Hình 27.1. Sơ đồ hệ tiết niêu", source: "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf", page: null, pageInferred: false, kind: "related" },
  ],
  "ngung-tho-khi-ngu": [
    { src: "/figures/ngung-tho-khi-ngu/ngung-tho-khi-ngu-ref-01.jpg", caption: "Hình38.9 (A) Giải phẫu thanh quản. (B) Chức năng của thanh quản trong phát thanh, minh họa vịtrí của các dây thanh trong các kiểu phát thanh khác", source: "Guyton full Tiếng Việt 15th - Testyhoc.vn.pdf", page: null, pageInferred: false, kind: "related" },
  ],
  "nhiem-khuan-tiet-nieu": [
    { src: "/figures/nhiem-khuan-tiet-nieu/nhiem-khuan-tiet-nieu-ref-01.jpg", caption: "Hình 27.1. Sơ đồ hệ tiết niêu", source: "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf", page: null, pageInferred: false, kind: "related" },
  ],
  "suy-than-cap": [
    { src: "/figures/suy-than-cap/suy-than-cap-ref-01.jpg", caption: "Hình 27.1. Sơ đồ hệ tiết niêu", source: "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf", page: null, pageInferred: false, kind: "related" },
  ],
  "suy-than-giai-doan-cuoi": [
    { src: "/figures/suy-than-giai-doan-cuoi/suy-than-giai-doan-cuoi-ref-01.jpg", caption: "Hình 27.1. Sơ đồ hệ tiết niêu", source: "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf", page: null, pageInferred: false, kind: "related" },
  ],
  "viem-cau-than-cap-sau-lien-cau": [
    { src: "/figures/viem-cau-than-cap-sau-lien-cau/viem-cau-than-cap-sau-lien-cau-ref-01.jpg", caption: "Hình 27.1. Sơ đồ hệ tiết niêu", source: "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf", page: null, pageInferred: false, kind: "related" },
  ],
  "viem-khop-dang-thap": [
    { src: "/figures/viem-khop-dang-thap/viem-khop-dang-thap-ref-01.jpg", caption: "Hình 41.6. Các xương bàn tay bên phải, nhìn từ trước", source: "Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf", page: null, pageInferred: false, kind: "related" },
  ],
};
