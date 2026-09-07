// KIỂM THỬ KHO TRI THỨC VỀ HỆ THỐNG — chạy: npm run test:site-kb
//
// Vì sao cần: đây là kho DUY NHẤT mà trợ lý dùng để trả lời câu hỏi về chính
// trang web, và nó khớp bằng chuỗi. Một thay đổi nhỏ ở cách sinh khoá là hỏng
// âm thầm — không có lỗi, không có cảnh báo, chỉ là trợ lý bỗng trả lời trượt.
// Mỗi khẳng định dưới đây tương ứng một lỗi đã thật sự xảy ra khi làm.

import { allSiteFacts, searchSiteFacts } from "@/lib/site/siteKnowledge";
import { catalogScenes, catalogStats } from "@/lib/catalog";

let failed = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) console.log(`  ok   ${name}`);
  else {
    failed += 1;
    console.log(`  FAIL ${name}${extra ? " — " + extra : ""}`);
  }
}

const ids = (q: string, locale: "vi" | "en" | "zh" = "vi") =>
  searchSiteFacts(q, locale, 6).map((x) => x.fact.id);
const strong = (q: string, locale: "vi" | "en" | "zh" = "vi") =>
  searchSiteFacts(q, locale, 6).filter((x) => x.score >= 2).map((x) => x.fact.id);

console.log("\n1. Kho dựng đủ và bám dữ liệu thật");
{
  const facts = allSiteFacts();
  const models = facts.filter((f) => f.kind === "model");
  check(
    "mỗi mô hình trong danh mục có đúng một mục",
    models.length === catalogScenes.length,
    `${models.length} vs ${catalogScenes.length}`,
  );
  check("có mục hướng dẫn", facts.some((f) => f.kind === "feature"));
  check(
    "số mô hình trong lời văn lấy từ danh mục, không gõ tay",
    facts.find((f) => f.id === "feature:catalog")!.body.vi.includes(String(catalogStats.scenes)),
  );
  check(
    "mọi mục đều có đường dẫn mở được",
    facts.every((f) => f.href.startsWith("/")),
  );
  check(
    "đủ ba thứ tiếng, không mục nào bỏ trống",
    facts.every((f) => f.title.vi && f.title.en && f.title.zh && f.body.zh.length > 20),
  );
}

console.log("\n2. Câu hỏi về trang web tìm đúng mục");
{
  check("hỏi số lượng mô hình", strong("web này có bao nhiêu mô hình 3D").includes("feature:catalog"));
  check("hỏi trắc nghiệm (vi)", strong("làm sao ôn thi bằng trang này").includes("feature:quiz"));
  check("hỏi trắc nghiệm (zh)", strong("怎么进入测验", "zh").includes("feature:quiz"));
  check("hỏi mặt cắt", strong("làm sao xem mặt cắt ngang").includes("feature:section"));
  check("hỏi bật tắt lớp (en)", strong("how do I hide the muscle layer", "en").includes("feature:viewer"));
  check("hỏi trang là gì (en)", strong("what can this website do", "en").includes("feature:about"));
  check("hỏi điều khiển cử chỉ", strong("điều khiển bằng cử chỉ tay dùng thế nào").includes("feature:gesture"));
}

console.log("\n3. Gọi tên mô hình theo lối nói thường");
{
  check("mở mô hình tim ở đâu", strong("mở mô hình tim ở đâu").includes("model:giai-phau-tim"));
  check("mô hình gan (gõ thiếu dấu)", strong("mo hinh gan o dau").includes("model:giai-phau-gan"));
  check(
    "liver model (tiếng Anh)",
    strong("where can I open the liver model", "en").some((id) => id.includes("gan")),
  );
  check(
    "hỏi 'có mô hình não không' ra các mô hình về não",
    strong("có mô hình não không").includes("model:tieu-nao"),
  );
  check(
    'chữ "ở đâu" KHÔNG được kéo theo mô hình "Giải phẫu Đầu"',
    !ids("mô hình về gan xem ở đâu").includes("model:giai-phau-dau"),
    ids("mô hình về gan xem ở đâu").join(" | "),
  );
  check(
    'nhưng hỏi thẳng "mô hình đầu" thì vẫn phải ra',
    strong("mô hình đầu xem ở đâu").includes("model:giai-phau-dau"),
  );
}

console.log("\n4. Không lấn sân câu hỏi y khoa");
{
  // Không có dấu hiệu hỏi về trang web thì tên mô hình KHÔNG được khớp — nếu
  // không, hỏi "tim có mấy buồng" sẽ lôi mục "mô hình Tim" lên trên kiến thức
  // về tim.
  for (const q of ["tim có mấy buồng", "triệu chứng viêm ruột thừa cấp", "bệnh gout điều trị thế nào"]) {
    check(
      `"${q}" không kéo theo mục mô hình nào`,
      searchSiteFacts(q, "vi", 6).every((x) => x.fact.kind !== "model"),
      searchSiteFacts(q, "vi", 6).map((x) => x.fact.id).join(" | "),
    );
  }
}

console.log(
  failed === 0 ? "\n✓ Toàn bộ kiểm thử kho hệ thống đạt\n" : `\n✗ ${failed} kiểm thử KHÔNG đạt\n`,
);
process.exit(failed === 0 ? 0 : 1);
