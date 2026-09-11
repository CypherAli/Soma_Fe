/**
 * Bệnh → bài học 3D + ĐÚNG nhóm cấu trúc bị bệnh.
 *
 * Vì sao cần bảng tay: mã cấu trúc trong DB bệnh lý là slug của các scene Z-Anatomy
 * CŨ. Từ khi toàn bộ thư viện chuyển sang atlas, nhiều bài đã đổi chủ đề (vd
 * "tuyen-noi-tiet" nay là Lỗ trên lồng ngực), còn bệnh có `lesionMesh` hay không
 * gắn cấu trúc thì bị đẩy về trang TOÀN THÂN — user báo: "mở bệnh nào phải chuyển
 * đúng đến bộ phận liên quan chứ không phải mở ra toàn thân".
 *
 * `focus` là khoá NHÓM trong scene (xem src/lib/humanAtlas/scenes/*.ts) — trang
 * scene đọc `?focus=` để làm nổi nhóm đó, mở ghi chú, bật lớp chứa nó.
 * Chọn theo giáo trình: bệnh nhược cơ → tuyến ức (u tuyến ức), viêm cột sống
 * dính khớp → khớp cùng–chậu, ho ra máu → động mạch phế quản, bệnh máu → tuỷ
 * xương chậu (nơi sinh thiết tuỷ)… Atlas không có tuyến giáp: bệnh tuyến giáp mở
 * bài cơ dưới móng — lớp cơ phủ ngay trên tuyến.
 */
export type PathologyTarget = { scene: string; focus?: string };

export const PATHOLOGY_SCENE: Record<string, PathologyTarget> = {
  // ── Cơ xương khớp
  "benh-gout": { scene: "bo-phan-co-chan-ban-chan", focus: "tien-tuc" },
  "benh-ly-phan-mem-canh-khop": { scene: "mo-lien-ket", focus: "gan" },
  "benh-nhuoc-co": { scene: "he-bach-huyet", focus: "uc" },
  "viem-khop-tu-phat-thieu-nien": { scene: "bo-phan-goi", focus: "loi-cau" },
  "thoat-vi-dia-dem-that-lung": { scene: "bo-phan-cot-song-that-lung", focus: "dia-dem" },
  "loan-duong-co": { scene: "bo-phan-dui", focus: "tu-dau" },
  "loang-xuong": { scene: "cot-song", focus: "dot-that-lung" },
  "lupus-ban-do-he-thong": { scene: "bo-phan-than", focus: "than-phai" },
  "nhiem-khuan-co-xuong-khop": { scene: "bo-phan-goi", focus: "loi-cau" },
  "thoai-hoa-khop": { scene: "bo-phan-goi", focus: "mam-chay" },
  "viem-co-nhiem-khuan": { scene: "bo-phan-dui", focus: "tu-dau" },
  "viem-cot-song-dinh-khop": { scene: "khop-cung-chau", focus: "cung" },
  "viem-da-co-viem-da-co-tu-mien": { scene: "bo-phan-dui", focus: "tu-dau" },
  "viem-dia-dem-dot-song": { scene: "bo-phan-cot-song-that-lung", focus: "dia-dem" },
  "viem-khop-dang-thap": { scene: "bo-phan-ban-tay", focus: "dot-ngon" },
  "viem-khop-phan-ung": { scene: "bo-phan-goi", focus: "loi-cau" },
  "viem-quanh-khop-vai": { scene: "bo-phan-vai", focus: "tren-gai" },
  "xo-cung-bi": { scene: "bo-phan-ban-tay", focus: "dot-ngon" },
  // ── Hô hấp
  "ap-xe-phoi": { scene: "bo-phan-phoi", focus: "phe-quan-p" },
  copd: { scene: "bo-phan-phoi", focus: "phe-quan-p" },
  "gian-phe-quan": { scene: "phoi-cay-phe-quan", focus: "duoi" },
  "hen-phe-quan": { scene: "phoi-cay-phe-quan", focus: "khi-quan" },
  "ho-ra-mau": { scene: "giai-phau-phoi", focus: "phe-quan-dm" },
  "ngung-tho-khi-ngu": { scene: "mieng-luoi-rang", focus: "luoi" },
  "hoi-chung-trung-that": { scene: "trung-that" },
  "lao-phoi": { scene: "phoi-cay-phe-quan", focus: "tren" },
  "tam-phe-man": { scene: "bo-phan-tim", focus: "that-phai" },
  "tran-dich-mang-phoi": { scene: "thanh-nguc", focus: "gian-trong" },
  "tran-khi-mang-phoi": { scene: "thanh-nguc", focus: "gian-trong" },
  "ung-thu-phoi": { scene: "bo-phan-phoi", focus: "phe-quan-p" },
  "viem-phe-quan-cap": { scene: "phoi-cay-phe-quan", focus: "khi-quan" },
  "viem-phoi-benh-vien": { scene: "phoi-cay-phe-quan", focus: "duoi" },
  "viem-phoi-cong-dong": { scene: "phoi-cay-phe-quan", focus: "duoi" },
  // ── Hồi sức cấp cứu
  "cap-cuu-ngung-tuan-hoan": { scene: "bo-phan-tim", focus: "that-trai" },
  "dien-giat": { scene: "bo-phan-tim", focus: "that-trai" },
  "ngo-doc-cap-thuong-gap": { scene: "bo-phan-gan" },
  "ngat-nuoc": { scene: "bo-phan-phoi", focus: "phe-quan-p" },
  "phu-phoi-cap": { scene: "giai-phau-phoi", focus: "tm-phoi" },
  "roi-loan-kali-mau": { scene: "bo-phan-tim", focus: "that-trai" },
  "roi-loan-nuoc-natri": { scene: "bo-phan-than", focus: "than-phai" },
  "roi-loan-toan-kiem": { scene: "bo-phan-than", focus: "than-phai" },
  soc: { scene: "bo-phan-tim", focus: "that-trai" },
  // Vết rắn cắn phần lớn ở bàn chân–cẳng chân: mở khoang cẳng chân (phù, chèn ép khoang).
  "ran-doc-can": { scene: "bo-phan-cang-chan" },
  // ── Huyết học — bệnh tuỷ: xương chậu (mào chậu là nơi chọc hút/sinh thiết tuỷ)
  "da-hong-cau-tien-phat": { scene: "bo-phan-chau-hong", focus: "xuong" },
  "da-u-tuy-xuong": { scene: "cot-song", focus: "dot-that-lung" },
  hemophilia: { scene: "bo-phan-goi", focus: "loi-cau" },
  "hoi-chung-roi-loan-sinh-tuy": { scene: "bo-phan-chau-hong", focus: "xuong" },
  "lo-xe-mi-cap": { scene: "bo-phan-chau-hong", focus: "xuong" },
  "lo-xe-mi-kinh-dong-bach-cau-hat": { scene: "he-bach-huyet", focus: "lach" },
  "suy-tuy-xuong": { scene: "bo-phan-chau-hong", focus: "xuong" },
  "tang-tieu-cau-tien-phat": { scene: "bo-phan-chau-hong", focus: "xuong" },
  "thieu-mau": { scene: "bo-phan-chau-hong", focus: "xuong" },
  "thieu-mau-tan-mau": { scene: "he-bach-huyet", focus: "lach" },
  "u-lympho-ac-tinh": { scene: "he-bach-huyet", focus: "lach" },
  "xuat-huyet-giam-tieu-cau-vo-can": { scene: "he-bach-huyet", focus: "lach" },
  // ── Lão khoa
  "dot-quy-nao": { scene: "khop-thai-duong-ham", focus: "goc" },
  "phi-dai-lanh-tinh-tuyen-tien-liet": { scene: "bo-phan-bang-quang", focus: "tien-liet" },
  "sa-sut-tri-tue": { scene: "gian-nao-he-vien", focus: "hai-ma" },
  "suy-tinh-mach-man-tinh": { scene: "tinh-mach-hien", focus: "hien-lon" },
  // ── Nội tiết
  "cuong-giap": { scene: "hach-co", focus: "duoi" },
  "suy-giap": { scene: "hach-co", focus: "duoi" },
  "buou-giap-don-thuan": { scene: "hach-co", focus: "duoi" },
  "benh-to-cac-vien-cuc": { scene: "he-noi-tiet", focus: "ha-doi-yen" },
  "hoi-chung-sheehan": { scene: "he-noi-tiet", focus: "ha-doi-yen" },
  "dai-thao-nhat": { scene: "he-noi-tiet", focus: "ha-doi-yen" },
  "cuong-aldosteron": { scene: "tuyen-giap", focus: "tuyen" },
  "hoi-chung-cushing": { scene: "tuyen-giap", focus: "tuyen" },
  "suy-thuong-than-man-tinh": { scene: "tuyen-giap", focus: "tuyen" },
  "u-tuy-thuong-than": { scene: "tuyen-giap", focus: "tuyen" },
  "dai-thao-duong": { scene: "bo-phan-tuy-lach", focus: "tuy" },
  "ha-glucose-huyet": { scene: "bo-phan-tuy-lach", focus: "tuy" },
  // ── Thận – tiết niệu
  "benh-than-da-nang": { scene: "bo-phan-than", focus: "than-phai" },
  "benh-than-iga": { scene: "bo-phan-than", focus: "than-phai" },
  "benh-than-lupus": { scene: "bo-phan-than", focus: "than-phai" },
  "benh-than-man": { scene: "bo-phan-than", focus: "than-phai" },
  "hoi-chung-than-hu": { scene: "bo-phan-than", focus: "than-phai" },
  "nhiem-khuan-tiet-nieu": { scene: "bo-phan-bang-quang", focus: "bang-quang" },
  "soi-tiet-nieu": { scene: "he-tiet-nieu", focus: "nieu-quan" },
  "suy-than-cap": { scene: "bo-phan-than", focus: "than-phai" },
  "suy-than-giai-doan-cuoi": { scene: "bo-phan-than", focus: "than-phai" },
  "ton-thuong-than-cap": { scene: "bo-phan-than", focus: "than-phai" },
  "viem-cau-than-cap-sau-lien-cau": { scene: "bo-phan-than", focus: "than-phai" },
  // ── Tiêu hoá
  "ap-xe-gan": { scene: "bo-phan-gan", focus: "phan-thuy-7" },
  "benh-gan-do-ruou": { scene: "bo-phan-gan" },
  "benh-tri": { scene: "chau-hong-day-chau", focus: "that-hau-mon" },
  "hoi-chung-ruot-kich-thich": { scene: "ruot-non-ruot-gia", focus: "dai-trang-xuong" },
  "loet-da-day-ta-trang": { scene: "da-day-ta-trang", focus: "da-day" },
  "soi-mat": { scene: "gan-duong-mat", focus: "tui-mat" },
  "tao-bon": { scene: "ruot-non-ruot-gia", focus: "dai-trang-xuong" },
  "ung-thu-bieu-mo-te-bao-gan": { scene: "bo-phan-gan" },
  "viem-gan-b-man": { scene: "bo-phan-gan" },
  "viem-gan-c": { scene: "bo-phan-gan" },
  "viem-ruot-thua-cap": { scene: "ruot-non-ruot-gia", focus: "ruot-thua" },
  "viem-tuy-cap": { scene: "bo-phan-tuy-lach", focus: "tuy" },
  "xo-gan": { scene: "bo-phan-gan", focus: "tm-cua" },
  "xhth-do-loet-da-day-ta-trang": { scene: "da-day-ta-trang", focus: "ta-trang" },
  "xhth-tang-ap-luc-tinh-mach-cua": { scene: "thuc-quan", focus: "thuc-quan" },
  // ── Tim mạch
  "hep-van-hai-la": { scene: "bo-phan-tim", focus: "van-hai-la" },
  "huyet-khoi-tinh-mach-sau": { scene: "ho-khoeo", focus: "tm" },
  "nhoi-mau-co-tim": { scene: "dong-mach-vanh", focus: "lad" },
  "phinh-dong-mach-chu-bung": { scene: "he-dong-mach-chu", focus: "dm-chu-bung" },
  "roi-loan-nhip-tim": { scene: "bo-phan-tim", focus: "nhi-phai" },
  "suy-tim": { scene: "bo-phan-tim", focus: "that-trai" },
  "tang-huyet-ap": { scene: "bo-phan-tim", focus: "that-trai" },
  "viem-mang-ngoai-tim": { scene: "bo-phan-tim" },
  "viem-noi-tam-mac-nhiem-khuan": { scene: "bo-phan-tim", focus: "van-hai-la" },
};

/** Đường dẫn bài 3D của bệnh, hoặc undefined nếu bệnh không có bộ phận đích. */
export function pathologySceneHref(slug: string): string | undefined {
  const t = PATHOLOGY_SCENE[slug];
  if (!t) return undefined;
  return `/giai-phau/mo-hinh/${t.scene}${t.focus ? `?focus=${encodeURIComponent(t.focus)}` : ""}`;
}
