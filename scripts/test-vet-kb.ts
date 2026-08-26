// KIỂM THỬ KHO GIẢI PHẪU THÚ Y — chạy: npm run test:vet-kb
//
// Kho này là dữ liệu biên soạn tay, không sinh ra từ mô hình 3D nào, nên KHÔNG
// có phép verify "mesh có tồn tại không" như bên người. Thứ thay thế được là
// kiểm tra kỷ luật biên soạn: đủ ba thứ tiếng, có nguồn, có thuật ngữ NAV, và
// tra cứu ra đúng thứ ở cả ba ngôn ngữ.

import {
  SPECIES,
  VET_REGION_LABEL,
  VET_SYSTEM_LABEL,
  allVetFacts,
  factsOfSpecies,
  relatedAcrossSpecies,
  searchVetFactsScored,
  vetStats,
} from "@/lib/vet/knowledge";
import { VET_SPECIES } from "@/lib/vet/types";
import { VET_MODEL_CANDIDATES, vetModels } from "@/lib/vet/models";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { buildVetQuiz } from "@/lib/vet/quiz";

let failed = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) console.log(`  ok   ${name}`);
  else {
    failed += 1;
    console.log(`  FAIL ${name}${extra ? " — " + extra : ""}`);
  }
}

const facts = allVetFacts();
const ids = (q: string, locale: "vi" | "en" | "zh" = "vi") =>
  searchVetFactsScored(q, locale, 5).map((x) => x.fact.id);

console.log("\n1. Kỷ luật biên soạn");
{
  check("kho không rỗng", facts.length > 0, `${facts.length} mục`);
  const noZh = facts.filter((f) => !f.name.zh || !f.note.zh || f.note.zh.length < 15);
  check("mọi mục đủ tiếng Trung", noZh.length === 0, noZh.map((f) => f.id).join(", "));
  const noEn = facts.filter((f) => !f.name.en || !f.note.en || f.note.en.length < 25);
  check("mọi mục đủ tiếng Anh", noEn.length === 0, noEn.map((f) => f.id).join(", "));
  const noVi = facts.filter((f) => !f.name.vi || !f.note.vi || f.note.vi.length < 25);
  check("mọi mục đủ tiếng Việt", noVi.length === 0, noVi.map((f) => f.id).join(", "));
  const noSrc = facts.filter((f) => !f.source || f.source.length < 10);
  check("mọi mục ghi nguồn giáo trình", noSrc.length === 0, noSrc.map((f) => f.id).join(", "));
  const noNav = facts.filter((f) => !f.nav);
  check("mọi mục có thuật ngữ NAV/NAA", noNav.length === 0, noNav.map((f) => f.id).join(", "));
  const noSpecies = facts.filter((f) => f.species.length === 0);
  check("mọi mục gắn ít nhất một loài", noSpecies.length === 0);

  // Phần "khác biệt" là lý do tồn tại của trang thú y — thiếu nó thì mục ấy chỉ
  // là tóm tắt sách, không giúp gì cho việc học so sánh.
  const noCompare = facts.filter((f) => !f.compare);
  check(
    "mọi mục có phần đối chiếu",
    noCompare.length === 0,
    noCompare.map((f) => f.id).join(", "),
  );
  const noClinical = facts.filter((f) => !f.clinical);
  check("mọi mục có ý nghĩa lâm sàng", noClinical.length === 0, noClinical.map((f) => f.id).join(", "));
}

console.log("\n2. Phủ đủ sáu loài");
{
  for (const s of VET_SPECIES) {
    const n = factsOfSpecies(s).length;
    // Dưới 5 mục thì trang loài đó rỗng tuếch, coi như chưa làm.
    check(`${s}: có ít nhất 5 mục`, n >= 5, `${n} mục`);
  }
  check(
    "danh sách loài và bảng thông tin loài khớp nhau",
    SPECIES.length === VET_SPECIES.length && SPECIES.every((s) => VET_SPECIES.includes(s.key)),
  );
  const badVitals = SPECIES.filter(
    (s) => !s.vitals.temp || !s.vitals.pulse || !s.vitals.resp || !s.vitals.lifespan,
  );
  check("mọi loài có đủ trị số tham chiếu", badVitals.length === 0, badVitals.map((s) => s.key).join(", "));
}

console.log("\n3. Nhãn hiển thị không thiếu");
{
  const usedSystems = new Set(facts.map((f) => f.system));
  const missS = [...usedSystems].filter((s) => !VET_SYSTEM_LABEL[s]?.zh);
  check("mọi hệ đang dùng đều có nhãn 3 thứ tiếng", missS.length === 0, missS.join(", "));
  const usedRegions = new Set(facts.map((f) => f.region));
  const missR = [...usedRegions].filter((r) => !VET_REGION_LABEL[r]?.zh);
  check("mọi vùng đang dùng đều có nhãn 3 thứ tiếng", missR.length === 0, missR.join(", "));
  check("số liệu thống kê đếm từ dữ liệu", vetStats.facts === facts.length);
}

console.log("\n4. Tra cứu ra đúng thứ");
{
  check("dạ dày bò (vi)", ids("dạ dày bò mấy túi").includes("cattle-four-stomachs"));
  check("răng chó (vi)", ids("chó có bao nhiêu răng").includes("dog-dental-formula"));
  check("ngựa không nôn (vi)", ids("vì sao ngựa không nôn được").includes("horse-no-vomiting"));
  check("cat teeth (en)", ids("how many teeth does a cat have", "en").includes("cat-dental-formula"));
  check("air sacs (en)", ids("chicken air sacs breathing", "en").includes("chicken-air-sacs"));
  // Tiếng Trung không tách từ bằng dấu cách — phải băm bigram mới khớp nổi.
  check("牛的胃 (zh)", ids("牛的胃有几个室", "zh").includes("cattle-four-stomachs"));
  check("蹄叶炎 (zh)", ids("马蹄叶炎", "zh").includes("horse-hoof"));
  check("câu rỗng trả về rỗng", searchVetFactsScored("   ", "vi").length === 0);
  check(
    "câu không liên quan không ra rác",
    searchVetFactsScored("hợp đồng bảo hiểm xe máy", "vi").length === 0,
    ids("hợp đồng bảo hiểm xe máy").join(", "),
  );
}

console.log("\n5. Ghép chủ đề giữa các loài");
{
  const cattleStomach = facts.find((f) => f.id === "cattle-four-stomachs")!;
  const rel = relatedAcrossSpecies(cattleStomach);
  check("dạ dày bò ghép được với loài khác", rel.length > 0, `${rel.length} mục`);
  check(
    "mục ghép không được cùng loài",
    rel.every((r) => !r.species.includes("cattle")),
  );
}

console.log("\n6. Mô hình 3D phải nói được nguồn gốc");
{
  // Mô hình nào ĐƯỢC thêm thì bắt buộc đủ giấy phép, ghi công, đường dẫn gốc,
  // và mọi hotspot phải trỏ tới một mục tri thức CÓ THẬT.
  const bad = vetModels.filter((m) => !m.license || !m.attribution || !m.sourceUrl);
  check("mọi mô hình ghi đủ giấy phép và nguồn", bad.length === 0, bad.map((m) => m.slug).join(", "));

  // Tệp phải có thật trong public/. Một mục trong sổ đăng ký trỏ tới tệp không
  // tồn tại thì trang loài hiện một khung đen im lặng — không lỗi, không ảnh.
  const missing = vetModels.filter((m) => !existsSync(join("public", "models", "vet", m.file)));
  check("tệp .glb của mọi mô hình có thật", missing.length === 0, missing.map((m) => m.file).join(", "));

  const noTitle = vetModels.filter((m) => !m.title.vi || !m.title.en || !m.title.zh);
  check("mô hình nào cũng có tên đủ ba ngôn ngữ", noTitle.length === 0, noTitle.map((m) => m.slug).join(", "));

  // ND cấm tác phẩm phái sinh, mà mọi mô hình ở đây đều đã qua giảm lưới.
  const nd = vetModels.filter((m) => /\\bND\\b|NoDerivatives/i.test(m.license));
  check("không mô hình nào mang giấy phép ND", nd.length === 0, nd.map((m) => m.slug).join(", "));

  const orphan = vetModels.flatMap((m) =>
    m.hotspots.filter((h) => !facts.some((f) => f.id === h.factId)).map((h) => `${m.slug}:${h.factId}`),
  );
  check("mọi hotspot trỏ tới mục tri thức có thật", orphan.length === 0, orphan.join(", "));

  // Bất biến thật sự cần giữ: mỗi loài PHẢI có đường đi rõ ràng — hoặc đã có
  // mẫu vật, hoặc còn một ứng viên đã rà giấy phép. Không loài nào được rơi
  // vào khoảng lặng "chưa có gì và cũng không biết lấy ở đâu".
  const stranded = VET_SPECIES.filter(
    (sp) => !vetModels.some((m) => m.species === sp) && !VET_MODEL_CANDIDATES.some((c) => c.species === sp),
  );
  check("loài nào cũng có mẫu vật hoặc ứng viên đã rà", stranded.length === 0, stranded.join(", "));

  const noLic = VET_MODEL_CANDIDATES.filter((c) => !c.license || !c.howToGet);
  check("mỗi ứng viên ghi rõ giấy phép và cách lấy", noLic.length === 0);
}

console.log("\n7. Sinh đề trắc nghiệm");
{
  for (const locale of ["vi", "en", "zh"] as const) {
    const items = buildVetQuiz({ locale, count: 12, seed: 42, species: "all" });
    check(`${locale}: ra đủ số câu`, items.length === 12, `${items.length} câu`);
    const oneAnswer = items.every((q) => q.options.filter((o) => o.correct).length === 1);
    check(`${locale}: mỗi câu đúng một đáp án`, oneAnswer);
    const distinct = items.every((q) => new Set(q.options.map((o) => o.text)).size === q.options.length);
    check(`${locale}: phương án không trùng nhau`, distinct);
    const fourOpts = items.every((q) => q.options.length === 4);
    check(`${locale}: mỗi câu bốn phương án`, fourOpts);
    const hasSource = items.every((q) => q.source && q.explanation);
    check(`${locale}: câu nào cũng có giải thích và nguồn`, hasSource);
    /* Lộ đáp án là lỗi âm thầm nguy hiểm nhất của quiz sinh tự động: nếu phần
       đề bài còn nguyên tên cấu trúc thì người làm chỉ cần dò chữ. */
    const leaked = items.filter((q) => {
      const answer = q.options.find((o) => o.correct)!.text.toLowerCase();
      return answer.length > 4 && q.question.toLowerCase().includes(answer);
    });
    check(`${locale}: đề bài không lộ đáp án`, leaked.length === 0, leaked.map((q) => q.id).join(", "));
  }
  const same = buildVetQuiz({ locale: "vi", count: 6, seed: 7 });
  const again = buildVetQuiz({ locale: "vi", count: 6, seed: 7 });
  check(
    "cùng hạt giống thì ra cùng đề",
    same.map((q) => q.id).join() === again.map((q) => q.id).join(),
  );
  const dogOnly = buildVetQuiz({ locale: "vi", count: 8, seed: 3, species: "dog" });
  check(
    "lọc theo loài thì chỉ ra câu của loài đó",
    dogOnly.every((q) => facts.find((f) => f.id === q.factId)!.species.includes("dog")),
  );
}

console.log(
  failed === 0 ? "\n✓ Toàn bộ kiểm thử kho thú y đạt\n" : `\n✗ ${failed} kiểm thử KHÔNG đạt\n`,
);
process.exit(failed === 0 ? 0 : 1);
