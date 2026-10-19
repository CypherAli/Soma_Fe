// KIỂM THỬ LỆNH GIỌNG NÓI — chạy: npm run test:voice
//
// Chỉ kiểm phần THUẦN (chuẩn hoá chữ, khớp mẫu câu, chọn tên gần nhất, tra
// trang). Phần nghe micro là của trình duyệt, không kiểm được trong node.

import { bestByName, matchCommand, norm, resolveMany, wakeQuestion, type VoiceAction } from "../src/lib/voice/match.ts";
import { ROUTES, layeredFirst, resolveRoute } from "../src/lib/voice/globalCommands.ts";
import { catalogScenes } from "../src/lib/catalog.ts";
import { VISION_PARTS, voiceNamesOf } from "../src/lib/vision/parts.ts";

let failed = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) console.log(`  ok   ${name}`);
  else {
    failed += 1;
    console.log(`  FAIL ${name}${extra ? " — " + extra : ""}`);
  }
}

const noop = () => undefined;
const act = (id: string, phrases: string[]): VoiceAction => ({ id, phrases, run: noop });

console.log("Chuẩn hoá chữ");
check("bỏ dấu, kể cả chữ đ", norm("Đặt lại Mô hình") === "dat lai mo hinh");
check("bỏ dấu câu và gộp khoảng trắng", norm("  Bật   lớp, cơ! ") === "bat lop co");
check("giữ nguyên chữ Hán", norm("打开心脏模型") === "打开心脏模型");

console.log("\nKhớp mẫu câu");
const layerOn = act("layer-on", ["bật lớp {x}", "turn on {x}", "打开{x}层"]);
const explode = act("explode", ["tách lớp", "tách rời", "explode"]);
const openAny = act("open-any", ["mở {x}"]);
const openModel = act("open-model", ["mở mô hình {x}"]);
const exactRotate = { ...act("rotate", ["xoay", "rotate"]), exact: true };
const exactOpen = { ...openModel, exact: true };
check("Vision không xoay khi nghe câu phủ định", matchCommand("không xoay", [exactRotate]) === null);
check("Vision không chạy từ nằm giữa câu hỏi", matchCommand("why does it rotate", [exactRotate]) === null);
check("Vision giữ dấu tham số với lệnh lịch sự", matchCommand("Soma ơi mở mô hình cổ giúp mình", [exactOpen])?.arg === "cổ");
{
  const m = matchCommand("Bật lớp cơ gấp duỗi", [layerOn, explode]);
  check("có dấu: lấy đúng tham số, GIỮ NGUYÊN DẤU", m?.action.id === "layer-on" && m.arg === "cơ gấp duỗi", JSON.stringify(m && m.arg));
}
{
  const m = matchCommand("bat lop mach mau", [layerOn]);
  check("không dấu (máy nhận dạng hay trả vậy) vẫn khớp", m?.action.id === "layer-on" && m.arg === "mach mau");
}
{
  const m = matchCommand("Soma ơi tách lớp giúp mình", [layerOn, explode]);
  check("có từ đệm trước/sau vẫn nhận lệnh", m?.action.id === "explode");
}
{
  const m = matchCommand("turn on muscles", [layerOn]);
  check("tiếng Anh", m?.action.id === "layer-on" && m.arg === "muscles");
}
{
  const m = matchCommand("打开肌肉层", [layerOn]);
  check("tiếng Trung (không có khoảng trắng)", m?.action.id === "layer-on" && m.arg === "肌肉", JSON.stringify(m?.arg));
}
{
  const m = matchCommand("mở mô hình tim", [openAny, openModel]);
  check("mẫu DÀI hơn thắng: 'mở mô hình {x}' thắng 'mở {x}'", m?.action.id === "open-model" && m.arg === "tim");
}
{
  const page = act("page-open", ["mở {x}"]);
  const m = matchCommand("mở khuỷu", [page, openAny]);
  check("hoà điểm thì lệnh của TRANG (đăng ký trước) thắng lệnh chung", m?.action.id === "page-open");
}
check("không khớp gì thì trả null (để chuyển cho trợ lý)", matchCommand("tim có mấy buồng", [layerOn, explode]) === null);
check("không khớp giữa chừng một từ khác", matchCommand("ban tay", [act("an", ["ẩn"])]) === null);

console.log("\nChọn tên gần nhất");
const layers = [
  { key: "xuong", names: ["Xương", "Bones"] },
  { key: "gap-duoi", names: ["Cơ gấp–duỗi", "Flexors–extensors"] },
  { key: "sap-ngua", names: ["Cơ sấp–ngửa", "Pronators–supinators"] },
  { key: "mach", names: ["Mạch máu", "Vessels"] },
];
check("khớp đúng tên", bestByName("xương", layers) === "xuong");
check("bỏ từ đệm 'lớp'", bestByName("lớp mạch máu", layers) === "mach");
check("khớp một phần tên", bestByName("gấp duỗi", layers) === "gap-duoi");
check("tên tiếng Anh", bestByName("vessels", layers) === "mach");
check("MƠ HỒ ('cơ' khớp hai lớp) thì không tự chọn bừa", bestByName("cơ", layers) === null);
check("không liên quan thì trả null", bestByName("gan", layers) === null);

console.log("\nTIẾNG VIỆT — những kiểu nhận dạng giọng nói hay trả về");
{
  const on = act("layer-on", ["bật lớp {x}", "bậc lớp {x}"]);
  const off = act("layer-off", ["tắt lớp {x}", "tắc lớp {x}"]);
  check("nghe lệch 'bật' thành 'bậc' vẫn là bật lớp", matchCommand("Bậc lớp xương", [on, off])?.action.id === "layer-on");
  check("nghe lệch 'tắt' thành 'tắc' vẫn là tắt lớp", matchCommand("tắc lớp mạch máu", [on, off])?.action.id === "layer-off");
  const m = matchCommand("Soma ơi bật lớp mạch máu giúp mình nha", [on]);
  check("từ đệm lịch sự cuối câu không làm hỏng tên lớp", bestByName(m?.arg ?? "", layers) === "mach", JSON.stringify(m?.arg));
  check("có dấu câu, viết hoa như máy trả về", matchCommand("Bật lớp Xương.", [on])?.action.id === "layer-on");
  const pick = matchCommand(["bậc lớp xương", "bật lớp xương"], [act("only-exact", ["bật lớp {x}"])]);
  check("nhiều phương án nghe: phương án đầu lệch, phương án sau đúng → vẫn chạy", pick?.action.id === "only-exact");
  check("không phương án nào là lệnh → null (chuyển cho trợ lý)", matchCommand(["tim có mấy buồng", "tìm có mấy buồng"], [on, off]) === null);
}
{
  // Bỏ dấu thì "mắt" = "mặt" = "mat"; phải phân biệt được bằng dấu gốc.
  const parts = VISION_PARTS.map((p) => ({ key: p.key as string, names: voiceNamesOf(p) }));
  const sel = act("pick", ["chọn {x}"]);
  const pickPart = (s: string) => bestByName(matchCommand(s, [sel])?.arg ?? "", parts);
  check("'chọn mắt' ra Mắt, không lẫn với Mặt", pickPart("chọn mắt") === "eye", String(pickPart("chọn mắt")));
  check("'chọn mặt' ra Mặt, không lẫn với Mắt", pickPart("chọn mặt") === "face", String(pickPart("chọn mặt")));
  check("'chọn cổ tay' ra Cổ tay, không phải Cổ", pickPart("chọn cổ tay") === "wrist");
  check("tiếng địa phương: 'cùi chỏ' là khuỷu tay", pickPart("chọn cùi chỏ") === "elbow");
  check("'bắp chân' là cẳng chân", pickPart("chọn bắp chân") === "leg");
  check("'mắt cá' là cổ chân, không phải mắt", pickPart("chọn mắt cá") === "ankle", String(pickPart("chọn mắt cá")));
  check("'đầu gối' và 'gối' đều ra gối", pickPart("chọn đầu gối") === "knee" && pickPart("chọn gối") === "knee");
}
{
  const kneeLayers = [
    { key: "xuong", names: ["Xương"] },
    { key: "gap-duoi", names: ["Cơ gấp–duỗi"] },
    { key: "sap-ngua", names: ["Cơ sấp–ngửa"] },
    { key: "mach", names: ["Mạch máu"] },
  ];
  const r = resolveMany("cơ", kneeLayers);
  check("'bật lớp cơ' khi có hai lớp cơ → bật CẢ HAI", r.length === 2 && r.includes("gap-duoi") && r.includes("sap-ngua"), JSON.stringify(r));
  check("'động mạch' vẫn tìm ra lớp Mạch máu", JSON.stringify(resolveMany("động mạch", kneeLayers)) === '["mach"]');
  check("tên rõ ràng thì chỉ một lớp", JSON.stringify(resolveMany("gấp duỗi", kneeLayers)) === '["gap-duoi"]');
  check("không liên quan thì không bật gì", resolveMany("gan", kneeLayers).length === 0);
}
check("gọi tên trợ lý: 'Soma ơi, tim có mấy buồng'", wakeQuestion("Soma ơi, tim có mấy buồng") === "tim có mấy buồng", String(wakeQuestion("Soma ơi, tim có mấy buồng")));
check("nhận dạng ra 'Sô ma' / 'xô ma' vẫn là gọi trợ lý", !!wakeQuestion("Sô ma gan nằm ở đâu") && !!wakeQuestion("xô ma ơi van hai lá là gì"));
check("không gọi tên thì KHÔNG gửi câu hỏi (nghe liên tục)", wakeQuestion("hôm nay trời đẹp quá") === null);

console.log("\nMở mô hình bằng câu nói thật (dữ liệu thư viện thật)");
{
  const sceneItems = catalogScenes.map((s) => ({ key: s.slug, names: [s.title.vi, s.title.en, s.title.zh] }));
  const openModel = act("open-model", ["mở mô hình {x}", "mở bài {x}"]);
  const open = (said: string) => bestByName(matchCommand(said, [openModel])?.arg ?? "", sceneItems, layeredFirst);
  const cases: [string, string][] = [
    ["mở mô hình giải phẫu cánh tay", "giai-phau-canh-tay"],
    ["Mở mô hình giải phẩu cánh tay", "giai-phau-canh-tay"],
    ["mo mo hinh giai phau canh tay", "giai-phau-canh-tay"],
    ["Soma ơi mở mô hình giải phẫu cánh tay giúp mình", "giai-phau-canh-tay"],
    ["mở mô hình cánh tay", "bo-phan-canh-tay"],
    ["mở mô hình cơ cánh tay", "co-canh-tay"],
    ["mở mô hình tim", "bo-phan-tim"],
    ["mở mô hình khuỷu", "bo-phan-khuyu"],
    // Từ đệm trùng thuật ngữ khi bỏ dấu: hộ/hố, nào/não.
    ["mở mô hình hố khuỷu", "ho-khuyu"],
    ["mở mô hình não", "bo-phan-nao"],
    ["mở mô hình tim giúp mình với", "bo-phan-tim"],
    ["mở mô hình gan nha", "bo-phan-gan"],
  ];
  for (const [said, want] of cases) {
    const got = open(said);
    check(`"${said}" → ${want}`, got === want, String(got));
  }
}

console.log("\nTra trang");
check("'trang đầu' → trang chủ", resolveRoute("trang đầu") === "/");
check("'làm bài' → trắc nghiệm", resolveRoute("làm bài") === "/quiz");
check("'bệnh lý' → /benh-ly", resolveRoute("bệnh lý") === "/benh-ly");
check("'trắc nghiệm' → /quiz", resolveRoute("trắc nghiệm") === "/quiz");
check("'tất cả mô hình' → /giai-phau/tat-ca", resolveRoute("tất cả mô hình") === "/giai-phau/tat-ca");
check("'vision ai' → /cu-chi", resolveRoute("vision ai") === "/cu-chi");
check("tiếng Anh 'pathology'", resolveRoute("pathology") === "/benh-ly");
check("tiếng Trung '病理'", resolveRoute("病理") === "/benh-ly");
check("khoá đường dẫn không trùng nhau", new Set(ROUTES.map((r) => r.key)).size === ROUTES.length);
check("tên trang không lạ thì không đoán", resolveRoute("con mèo") === null);

console.log(failed ? `\n${failed} KHẲNG ĐỊNH SAI` : "\nTẤT CẢ ĐỀU ĐÚNG");
process.exit(failed ? 1 : 0);
