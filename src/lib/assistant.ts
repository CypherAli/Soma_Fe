import { pick, type Loc } from "@/lib/homeContent";
import { SYSTEM_LABEL, fold, searchFactsScored, type AnatomyFact } from "@/lib/anatomy/knowledge";
import { searchGeneralFacts, type GeneralFact } from "@/lib/anatomy/generalFacts";
import { citation, search as searchPathology, type Hit } from "@/lib/pathologyRetrieval";
import { complete, isConfigured } from "@/lib/llm";
import { fetchPathologies } from "@/lib/pathologies";
import { searchSiteFacts, type SiteFact } from "@/lib/site/siteKnowledge";
import { VET_SYSTEM_LABEL, searchVetFactsScored, speciesInfo } from "@/lib/vet/knowledge";
import type { VetFact } from "@/lib/vet/types";
import slugAlias from "@/../data/slug-alias.json";

/**
 * Lớp tra cứu HỢP NHẤT cho trợ lý: một câu hỏi, tra cả hai kho.
 *
 * Trước đây hai kho sống tách nhau: bot nổi chỉ biết 629 cấu trúc giải phẫu,
 * hộp trong trang bệnh lý chỉ biết 2829 đoạn giáo trình. Hỏi "bệnh gout điều
 * trị thế nào" ở bot nổi thì nó trả lời "thư viện chỉ có giải phẫu" — trong
 * khi câu trả lời nằm sẵn ở kho bên kia. Người dùng không có nghĩa vụ biết
 * mình đang đứng ở kho nào.
 */

export type UnifiedSource =
  | {
      /** giải phẫu thú y — xem @/lib/vet/knowledge */
      kind: "vet";
      id: string;
      title: string;
      detail: string;
      href: string;
      meta: string;
    }
  | {
      /** thông tin về CHÍNH hệ thống Soma — xem @/lib/site/siteKnowledge */
      kind: "site";
      id: string;
      title: string;
      detail: string;
      href: string;
      meta: string;
    }
  | {
      /** kiến thức tổng quan biên soạn tay — xem @/lib/anatomy/generalFacts */
      kind: "overview";
      id: string;
      title: string;
      detail: string;
      href: string;
      meta: string;
    }
  | {
      kind: "anatomy";
      id: string;
      title: string;
      detail: string;
      /** đường dẫn mở đúng cấu trúc trên mô hình 3D */
      href: string;
      meta: string;
    }
  | {
      kind: "pathology";
      id: string;
      title: string;
      detail: string;
      href: string;
      meta: string;
    };

/**
 * Mục thú y đưa vào trợ lý.
 *
 * Ghép cả ba phần đã biên soạn (mô tả + khác biệt + lâm sàng) vào `detail`:
 * người hỏi "dạ dày bò khác chó thế nào" cần đúng phần so sánh, mà nếu chỉ đưa
 * phần mô tả thì mô hình lại phải tự suy ra khác biệt — tức là tự bịa.
 */
const vetToSource = (f: VetFact, locale: Loc): UnifiedSource => {
  const parts = [pick(f.note, locale)];
  if (f.compare) parts.push(`${pick({ vi: "KHÁC BIỆT", en: "DIFFERENCE", zh: "差异" }, locale)}: ${pick(f.compare, locale)}`);
  if (f.clinical) parts.push(`${pick({ vi: "LÂM SÀNG", en: "CLINICAL", zh: "临床" }, locale)}: ${pick(f.clinical, locale)}`);
  return {
    kind: "vet",
    id: `vet:${f.id}`,
    title: pick(f.name, locale),
    detail: parts.join("\n"),
    href: `/dong-vat/${f.species[0]}`,
    meta: [
      f.species.map((sp) => pick(speciesInfo(sp).name, locale)).join(", "),
      pick(VET_SYSTEM_LABEL[f.system], locale),
      f.nav,
      f.source,
    ]
      .filter(Boolean)
      .join(" · "),
  };
};

const siteToSource = (f: SiteFact, locale: Loc): UnifiedSource => ({
  kind: "site",
  id: f.id,
  title: pick(f.title, locale),
  detail: pick(f.body, locale),
  href: f.href,
  meta:
    f.kind === "model"
      ? pick({ vi: "Mô hình 3D trong Soma", en: "3D model in Soma", zh: "Soma 三维模型" }, locale)
      : pick({ vi: "Hướng dẫn dùng Soma", en: "Using Soma", zh: "Soma 使用说明" }, locale),
});

const generalToSource = (f: GeneralFact, locale: Loc): UnifiedSource => ({
  kind: "overview",
  id: `overview:${f.id}`,
  title: pick(f.title, locale),
  detail: pick(f.body, locale),
  // Không trỏ vào một mesh nào cả: đây là kiến thức tổng quan, chỗ đọc tiếp
  // hợp lý là trang giải phẫu chung chứ không phải một cấu trúc cụ thể.
  href: "/giai-phau",
  meta: f.source,
});

const anatomyToSource = (f: AnatomyFact, locale: Loc): UnifiedSource => ({
  kind: "anatomy",
  /* Khoá theo TÊN chứ không theo id: một cấu trúc có mặt ở nhiều scene nên
     cùng "Thần kinh giữa" từng hiện hai dòng nguồn giống hệt nhau, chỉ khác
     scene phía sau. Người đọc không cần biết chuyện đó. */
  id: `anatomy:${fold(pick(f.label, locale))}`,
  title: pick(f.label, locale),
  detail: pick(f.note, locale),
  href: `/xem/${f.sceneSlug}?structure=${encodeURIComponent(f.meshName)}`,
  meta: [f.latinName, f.systems.map((s) => pick(SYSTEM_LABEL[s], locale)).join(", ")]
    .filter(Boolean)
    .join(" · "),
});

/* Chunk chỉ mang slug, mà slug không phải thứ để đưa cho người đọc: nguồn
   từng hiện "benh gout" thay vì "Bệnh gout". Nạp danh mục bệnh một lần rồi
   tra tên thật theo đúng ngôn ngữ. */
/* Slug của kho chunk (đặt theo tên file bài trong giáo trình) lệch với slug
   trong DB ở 25/103 bài — "benh-cuong-giap" vs "cuong-giap". Không quy về một
   mối thì tên nguồn hiện ra slug thô và link mở hồ sơ bệnh trỏ vào hư không.
   Bảng ánh xạ sinh bằng cách so tên bài với tên bệnh trong DB. */
const ALIAS = slugAlias as Record<string, string>;
const dbSlug = (chunkSlug: string) => ALIAS[chunkSlug] ?? chunkSlug;

let nameCache: Map<string, { vi: string; en: string; zh: string }> | null = null;

async function slugNames() {
  if (nameCache) return nameCache;
  const result = await fetchPathologies();
  const map = new Map<string, { vi: string; en: string; zh: string }>();
  for (const p of result.items) {
    map.set(p.slug, { vi: p.nameVi, en: p.nameEn, zh: p.nameZh });
  }
  // Máy chủ dữ liệu chết thì đừng nhớ bảng rỗng, lần sau còn thử lại được.
  if (result.ok) nameCache = map;
  return map;
}

const pathologyToSource = (
  h: Hit,
  names: Map<string, { vi: string; en: string; zh: string }>,
  locale: Loc,
): UnifiedSource => {
  const slug = dbSlug(h.slug);
  return {
    kind: "pathology",
    // Gộp theo BÀI chứ không theo từng trang: sáu đoạn của cùng một bài hiện
    // sáu dòng nguồn giống hệt nhau thì người đọc chẳng thêm được gì.
    id: `pathology:${slug}`,
    title: names.get(slug)?.[locale] ?? slug.replace(/-/g, " "),
    detail: h.text.slice(0, 700),
    href: `/benh-ly?open=${slug}`,
    meta: citation(h),
  };
};

/**
 * Điểm của hai kho không cùng thang đo (một bên đếm từ khoá, một bên BM25),
 * nên KHÔNG trộn điểm để xếp hạng chung. Thay vào đó lấy vài kết quả tốt nhất
 * của mỗi bên rồi để mô hình tự chọn phần nào trả lời được — mô hình đọc được
 * nội dung, còn điểm số thì không biết câu hỏi đang hỏi cái gì.
 */
/** Dưới ngưỡng này là chưa khớp trọn một từ nào trong TÊN cấu trúc — chỉ tình
    cờ trùng chữ trong phần giải thích, không đáng làm nguồn. */
const ANATOMY_FLOOR = 12;

/** Cụm hai tiếng liền nhau của câu hỏi, đã bỏ dấu. */
function bigrams(text: string): string[] {
  const w = fold(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return w.slice(0, -1).map((x, i) => `${x} ${w[i + 1]}`);
}

/**
 * Cấu trúc này có THẬT SỰ liên quan câu hỏi không.
 *
 * Điểm số thôi chưa đủ, vì tiếng Việt đơn âm: "tiểu" trong "tiểu đường" khớp
 * trọn từ với "tiểu não" và ăn đủ 12 điểm, nên hỏi về đái tháo đường lại ra
 * hạnh nhân tiểu não. Đòi tên cấu trúc chứa nguyên một CỤM HAI TIẾNG của câu
 * hỏi thì hết hẳn kiểu trùng hợp đó — "tieu duong" không nằm trong "tieu nao".
 * Câu hỏi chỉ có một tiếng thì không có cụm nào, lúc đó điểm số là căn cứ duy
 * nhất và vẫn dùng được.
 */
function anatomyRelevant(fact: AnatomyFact, locale: Loc, question: string): boolean {
  const q = fold(question);
  // Xét nhãn của ngôn ngữ đang xem VÀ tiếng Việt: câu hỏi có thể lệch ngôn ngữ
  // với giao diện.
  const labels = [...new Set([fold(pick(fact.label, locale)), fold(pick(fact.label, "vi"))])];
  const label = labels.find((l) => q.includes(l)) ?? labels[0];

  // Tên cấu trúc xuất hiện NGUYÊN VẸN trong câu hỏi thì chắc chắn liên quan,
  // kể cả tên một tiếng: "gan nằm ở đâu" phải ra Gan, mà "gan" không tạo được
  // cụm hai tiếng nào nên nếu chỉ xét cụm thì bị loại oan.
  const tokens = q.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (tokens.includes(label) || (label.includes(" ") && q.includes(label))) return true;

  const grams = bigrams(question);
  if (grams.length === 0) return true;
  const name = fold(`${label} ${fact.latinName ?? ""} ${fact.meshName}`);
  return grams.some((g) => name.includes(g));
}

/**
 * Câu hỏi có gọi tên một loài vật không?
 *
 * Cần thiết vì tên cấu trúc thì giống nhau ở mọi loài: hỏi "dạ dày bò có mấy
 * túi" thì kho giải phẫu NGƯỜI khớp ngay chữ "dạ dày" và chiếm mất chỗ, còn
 * mục "Bốn túi dạ dày của loài nhai lại" lại xếp dưới. Có tên loài trong câu
 * thì phải ưu tiên hẳn tư liệu thú y.
 *
 * So khớp theo TỪ và GIỮ DẤU: "bò" không được trúng "bó", "gà" không được
 * trúng "ga" — bài học đã trả giá ở kho hệ thống ("ở đâu" trúng "Đầu").
 */
const SPECIES_WORDS = new Set([
  "chó", "mèo", "ngựa", "bò", "lợn", "heo", "gà", "gia cầm", "thú y", "gia súc",
  "dog", "dogs", "cat", "cats", "horse", "equine", "cattle", "cow", "bovine",
  "pig", "swine", "porcine", "chicken", "poultry", "avian", "canine", "feline",
  "veterinary", "犬", "猫", "马", "牛", "猪", "鸡", "禽", "兽医",
]);

function namesAnimal(question: string): boolean {
  const raw = question.toLowerCase();
  const words = raw.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (words.some((w) => SPECIES_WORDS.has(w))) return true;
  // Tiếng Trung không tách từ bằng dấu cách nên phải dò chuỗi con.
  return [...SPECIES_WORDS].some((w) => /[㐀-鿿]/.test(w) && raw.includes(w));
}

export async function retrieve(
  question: string,
  locale: Loc,
): Promise<{ rel: number; src: UnifiedSource }[]> {
  /* Dò tên cấu trúc trên CẢ BA ngôn ngữ, không chỉ ngôn ngữ giao diện.
     Người Việt vẫn hỏi tiếng Việt khi đang để giao diện tiếng Anh — lúc đó
     nhãn đem ra so là "Median nerve" nên "dây thần kinh giữa" không khớp nổi
     và trợ lý trả về toàn nguồn bệnh học lạc đề. Giữ điểm cao nhất đạt được
     ở bất kỳ ngôn ngữ nào, còn hiển thị thì vẫn theo ngôn ngữ đang xem. */
  const langs: Loc[] = [...new Set<Loc>([locale, "vi", "en"])];
  const [perLang, hits, names] = await Promise.all([
    Promise.all(langs.map((l) => Promise.resolve(searchFactsScored(question, l, 6)))),
    searchPathology(question, { limit: 6 }),
    slugNames(),
  ]);

  const bestByFact = new Map<string, { fact: AnatomyFact; score: number }>();
  for (const list of perLang) {
    for (const item of list) {
      const prev = bestByFact.get(item.fact.id);
      if (!prev || item.score > prev.score) bestByFact.set(item.fact.id, item);
    }
  }
  const facts = [...bestByFact.values()].sort((a, b) => b.score - a.score).slice(0, 6);

  const strongFacts = facts.filter(
    (f) => f.score >= ANATOMY_FLOOR && anatomyRelevant(f.fact, locale, question),
  );
  // Điểm hai kho khác thang đo nên chuẩn hoá theo ĐỈNH CỦA CHÍNH KHO ĐÓ rồi
  // mới xếp chung; so điểm thô giữa hai bên là so táo với cam.
  /* Gọi ĐÚNG TÊN thì phải đứng đầu. Cách chấm điểm của kho giải phẫu cộng
     điểm theo từng từ, nên "Thần kinh gian cốt trước" (trúng "thần" + "kinh",
     lại được thêm điểm vì phần giải thích có nhắc thần kinh giữa) vượt lên
     trên chính "Thần kinh giữa" khi người dùng hỏi "dây thần kinh giữa chi
     phối gì". Tên cấu trúc nằm nguyên vẹn trong câu hỏi là tín hiệu mạnh hơn
     mọi cách cộng điểm theo từ, nên nhân đôi để nó vượt lên hẳn. */
  const foldedQ = fold(question);
  const namedExactly = (f: AnatomyFact) =>
    langs.some((l) => {
      const label = fold(pick(f.label, l));
      return label.length >= 3 && foldedQ.includes(label);
    });

  const topA = strongFacts[0]?.score ?? 1;
  const topP = hits[0]?.score ?? 1;
  const merged = [
    /* Câu hỏi về CHÍNH trang web thì mục hệ thống phải đứng trên tất cả: hỏi
       "web có bao nhiêu mô hình" mà xếp một hotspot xương lên trước thì mô
       hình trả lời sẽ bám vào nguồn sai. rel 4/3 tuỳ độ chắc của phép khớp. */
    ...searchSiteFacts(question, locale).map((x) => ({
      // Khớp chắc (đúng tên / đúng từ khoá) thì cho vượt mọi nguồn khác; khớp
      // lỏng thì để dưới nguồn y khoa, chỉ làm phần bổ sung.
      rel: x.score >= 2 ? 4 : 0.6,
      src: siteToSource(x.fact, locale),
    })),
    /* Mục thú y: chấm điểm theo thang riêng của kho đó rồi chuẩn hoá về đỉnh
       của chính nó, y như hai kho kia — không so điểm thô giữa các kho. */
    ...(() => {
      const hits = searchVetFactsScored(question, locale, 5);
      const top = hits[0]?.score ?? 1;
      // Gọi tên loài -> tư liệu thú y phải đứng trên tư liệu người (hệ số 3
      // vượt cả nguồn giải phẫu gọi đúng tên, tối đa 2). Không gọi tên loài thì
      // chỉ là nguồn bổ sung, không được lấn câu hỏi về người.
      const weight = namesAnimal(question) ? 3 : 0.9;
      return hits
        .filter((h) => h.score >= 10) // dưới 10 là chưa khớp trọn từ nào trong TÊN
        .map((h) => ({ rel: (h.score / top) * weight, src: vetToSource(h.fact, locale) }));
    })(),
    /* Kiến thức tổng quan đứng ĐẦU khi khớp: nó chỉ khớp với câu hỏi tổng quát
       ("cơ thể có bao nhiêu xương"), mà đúng loại câu đó thì mọi nguồn còn lại
       — một hotspot xương quay, một bài loãng xương — đều lạc đề. rel = 3 để
       vượt cả nguồn giải phẫu gọi đúng tên (tối đa 2). */
    ...searchGeneralFacts(question).map((g) => ({ rel: 3, src: generalToSource(g.fact, locale) })),
    ...strongFacts.map((f) => ({
      rel: (f.score / topA) * (namedExactly(f.fact) ? 2 : 1),
      src: anatomyToSource(f.fact, locale),
    })),
    // Đoạn nào điểm quá thấp so với đoạn tốt nhất thì bỏ: giữ lại chỉ tổ làm
    // loãng ngữ cảnh đưa cho mô hình.
    ...hits.filter((h) => h.score >= 0.35 * topP).map((h) => ({ rel: h.score / topP, src: pathologyToSource(h, names, locale) })),
  ];
  merged.sort((a, b) => b.rel - a.rel);
  return merged;
}

/* ------------------------------------------------------------------ *
 * Chuẩn hoá câu hỏi
 * ------------------------------------------------------------------ */

/** Việc người dùng đang muốn làm — quyết định trợ lý trả lời hay từ chối. */
export type Intent = "lookup" | "offtopic";

export type Understood = {
  intent: Intent;
  /** câu truy vấn đã viết lại bằng THUẬT NGỮ SÁCH để tra kho */
  queries: string[];
};

const UNDERSTAND_SYSTEM = `Bạn là bộ phân tích câu hỏi cho trợ lý tra cứu giải phẫu và bệnh học.
Nhiệm vụ: đọc câu hỏi của người dùng rồi trả về JSON, KHÔNG trả lời câu hỏi đó.

{"intent":"lookup"|"offtopic","queries":["...","..."]}

intent="offtopic" khi người dùng yêu cầu việc ngoài tra cứu y khoa: viết mã, giải toán,
vẽ hình, dịch văn bản chung, trò chuyện phiếm, hỏi thời tiết, làm hộ bài tập.
intent="lookup" cho mọi câu hỏi về cấu trúc cơ thể, chức năng, bệnh, triệu chứng,
chẩn đoán, điều trị, xét nghiệm.
intent="lookup" CẢ KHI câu hỏi về ĐỘNG VẬT: chó, mèo, ngựa, bò, lợn, gà — thư viện có
phần giải phẫu thú y so sánh. Câu kiểu "dạ dày bò có mấy túi", "chó có bao nhiêu răng",
"gà thở thế nào" là tra cứu hợp lệ, không phải lạc đề.
intent="lookup" CẢ KHI người dùng hỏi về chính trang Soma: có bao nhiêu mô hình, mô hình
nào có sẵn, vào phần trắc nghiệm / mốc xương / mặt cắt / bệnh lý ở đâu, cách bật tắt lớp,
cách đổi ngôn ngữ, điều khiển bằng cử chỉ. Đó KHÔNG phải lạc đề — thư viện có sẵn phần
hướng dẫn dùng Soma. Với loại câu này, giữ nguyên cách người dùng nói trong queries
thay vì dịch sang thuật ngữ giáo trình.

queries: 2-4 cách diễn đạt cùng một ý bằng THUẬT NGỮ GIÁO TRÌNH tiếng Việt, để tra
sách. Đây là phần quan trọng nhất: người dùng hỏi bằng lời thường, sách viết bằng
thuật ngữ. Ví dụ:
- "bệnh tiểu đường chữa sao" -> ["điều trị đái tháo đường","đái tháo đường typ 2 điều trị","kiểm soát glucose huyết"]
- "đau ngực trái lan tay" -> ["đau thắt ngực","hội chứng vành cấp triệu chứng","nhồi máu cơ tim lâm sàng"]
- "xương ống chân" -> ["xương chày","xương mác","cẳng chân giải phẫu"]
- "怎么进入测验" -> lookup (hỏi về trang Soma) -> ["怎么进入测验","vào phần trắc nghiệm","quiz"]
- "how do I hide the muscle layer" -> lookup (hỏi về trang Soma) -> ["hide muscle layer","bật tắt lớp cơ","xem theo lớp"]
Giữ nguyên tên riêng, tên thuốc, mã ICD. Chỉ trả JSON, không thêm chữ nào khác.`;

/**
 * Hiểu câu hỏi trước khi tra.
 *
 * Đây là chỗ xử lý nỗi lo "mười người hỏi cùng một ý bằng mười kiểu chữ".
 * Tra thẳng chữ người dùng gõ thì "bệnh tiểu đường chữa sao" không khớp nổi
 * "điều trị đái tháo đường" trong sách. Bảng đồng nghĩa tay chỉ phủ được vài
 * chục cặp; để mô hình viết lại câu hỏi thì phủ được mọi cách diễn đạt.
 *
 * Không có khoá AI thì trả về chính câu gốc — trợ lý vẫn chạy, chỉ kém nhạy
 * với cách diễn đạt lạ.
 */
export async function understand(question: string): Promise<Understood> {
  if (!isConfigured()) return { intent: "lookup", queries: [question] };
  try {
    const raw = await complete({
      system: UNDERSTAND_SYSTEM,
      user: question,
      maxTokens: 200,
    });
    const parsed = JSON.parse(raw.replace(/^```(?:json)?|```$/gm, "").trim()) as Understood;
    const queries = (parsed.queries ?? []).filter((q) => typeof q === "string" && q.trim());
    return {
      intent: parsed.intent === "offtopic" ? "offtopic" : "lookup",
      // Luôn giữ câu gốc: bản viết lại có thể chệch ý, câu gốc là mỏ neo.
      queries: [question, ...queries].slice(0, 5),
    };
  } catch {
    return { intent: "lookup", queries: [question] };
  }
}

/**
 * Tra bằng nhiều cách diễn đạt rồi XẾP HẠNG LẠI TRÊN TOÀN BỘ.
 *
 * Bản trước nối kết quả theo thứ tự truy vấn, nên nguồn tốt nhất của câu viết
 * lại thứ hai lại đứng trên nguồn tốt nhất của chính câu người dùng hỏi: hỏi
 * "dây thần kinh giữa chi phối gì" thì Thần kinh gian cốt trước xếp trên Thần
 * kinh giữa. Giờ mỗi nguồn giữ điểm CAO NHẤT đạt được ở bất kỳ cách hỏi nào,
 * rồi sắp lại toàn cục.
 *
 * Câu gốc (queries[0]) được nhân hệ số cao hơn: bản viết lại có thể chệch ý,
 * còn chữ người dùng gõ ra mới là thứ cần bám.
 */
export async function retrieveMany(queries: string[], locale: Loc) {
  const best = new Map<string, { rel: number; src: UnifiedSource }>();
  for (const [i, q] of queries.entries()) {
    const weight = i === 0 ? 1 : 0.85;
    for (const { rel, src } of await retrieve(q, locale)) {
      const score = rel * weight;
      const prev = best.get(src.id);
      if (!prev || score > prev.rel) best.set(src.id, { rel: score, src });
    }
  }
  return [...best.values()]
    .sort((a, b) => b.rel - a.rel)
    .slice(0, 8)
    .map((x) => x.src);
}
