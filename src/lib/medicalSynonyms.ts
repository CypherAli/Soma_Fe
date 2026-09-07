/**
 * Từ đồng nghĩa và viết tắt y khoa tiếng Việt, dùng để nới câu hỏi trước khi
 * tra kho giáo trình.
 *
 * Vì sao cần: tra theo từ khoá chỉ khớp đúng chữ trong sách. Sinh viên gõ
 * "tiểu đường" thì trượt sạch, vì giáo trình viết "đái tháo đường"; gõ "cao
 * huyết áp" trượt "tăng huyết áp"; gõ "chụp X quang" trượt "XQ".
 *
 * Nguyên tắc khi thêm nhóm mới:
 *   • Chỉ gộp những từ CÙNG CHỈ MỘT THỨ. "đau ngực" và "nhồi máu cơ tim" là
 *     triệu chứng và bệnh, KHÔNG được gộp — gộp vào là biến tra cứu thành suy
 *     đoán chẩn đoán.
 *   • Viết không dấu cũng được, hàm fold() sẽ chuẩn hoá.
 *   • Từ nới ra bị hạ trọng số ở bước chấm điểm, nên thêm nhầm một từ hiếm thì
 *     nhiễu nhẹ chứ không lật ngược kết quả.
 */
export const SYNONYM_GROUPS: string[][] = [
  // --- tên bệnh: cách gọi dân gian vs thuật ngữ giáo trình ---
  ["gout", "gút", "thống phong"],
  ["đái tháo đường", "tiểu đường", "đtđ"],
  ["tăng huyết áp", "cao huyết áp", "tha"],
  ["nhồi máu cơ tim", "nmct", "hội chứng vành cấp"],
  ["tai biến mạch máu não", "đột quỵ", "đột quỵ não"],
  ["viêm khớp dạng thấp", "vkdt", "thấp khớp"],
  ["bệnh phổi tắc nghẽn mạn tính", "copd"],
  ["hen phế quản", "hen suyễn", "suyễn"],
  ["loét dạ dày tá tràng", "loét dạ dày", "viêm loét dạ dày"],
  ["xơ gan", "gan xơ"],
  ["hội chứng thận hư", "thận hư"],
  ["suy thận mạn", "bệnh thận mạn"],
  ["sỏi mật", "sỏi túi mật"],
  ["nhiễm khuẩn tiết niệu", "viêm đường tiết niệu", "nhiễm trùng tiểu"],
  ["cường giáp", "basedow", "nhiễm độc giáp"],
  ["suy giáp", "nhược giáp"],
  ["thiếu máu", "giảm hồng cầu"],
  ["xuất huyết giảm tiểu cầu", "giảm tiểu cầu"],
  ["viêm tuỵ cấp", "viêm tụy cấp"],
  ["suy tim", "suy tim sung huyết"],

  // --- xét nghiệm và thăm dò ---
  ["x quang", "xq", "chụp x quang", "phim x quang"],
  ["siêu âm", "sa"],
  ["cắt lớp vi tính", "ct", "chụp cắt lớp"],
  ["cộng hưởng từ", "mri"],
  ["điện tâm đồ", "ecg", "điện tim"],
  ["acid uric", "au", "axit uric"],
  ["creatinin", "creatinine"],
  ["mức lọc cầu thận", "gfr", "độ lọc cầu thận"],
  ["đường huyết", "glucose máu", "đường máu"],
  ["công thức máu", "huyết đồ"],

  // --- triệu chứng: chỉ gộp cách nói khác của CÙNG một dấu hiệu ---
  ["khó thở", "thở khó", "hụt hơi"],
  ["phù", "sưng nề", "ứ dịch"],
  ["sốt", "tăng thân nhiệt"],
  ["đau bụng", "đau vùng bụng"],
  ["mệt mỏi", "suy nhược", "yếu sức"],
  ["buồn nôn", "nôn ói", "nôn mửa"],
  ["sụt cân", "gầy sút", "giảm cân"],
  ["tiểu buốt", "đái buốt"],
  ["tiểu máu", "đái máu"],
  ["vàng da", "hoàng đảm"],
  ["hạt tophi", "tô phi", "tophus"],

  // --- điều trị ---
  ["kháng viêm không steroid", "nsaid", "chống viêm không steroid"],
  ["corticoid", "corticosteroid", "glucocorticoid"],
  ["kháng sinh", "thuốc kháng sinh"],
  ["lợi tiểu", "thuốc lợi tiểu"],
];
