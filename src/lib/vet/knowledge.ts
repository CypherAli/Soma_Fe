import { fold } from "@/lib/anatomy/knowledge";
import { pick, type Loc, type T3 } from "@/lib/homeContent";
import { largeAnimalFacts } from "./facts/largeAnimals";
import { poultryFacts } from "./facts/poultry";
import { smallAnimalFacts } from "./facts/smallAnimals";
import {
  VET_SPECIES,
  type VetFact,
  type VetRegionKey,
  type VetSpeciesKey,
  type VetSystemKey,
} from "./types";

/**
 * KHO TRI THỨC THÚ Y — gộp và tra cứu.
 *
 * Cùng lối làm với bên người (`src/lib/anatomy/knowledge.ts`): dữ liệu biên
 * soạn tay nằm trong các file riêng, file này chỉ gộp lại, chấm điểm tìm kiếm
 * và cung cấp nhãn hiển thị. Không sinh nội dung mới ở đây.
 */

export type { VetFact, VetSpeciesKey, VetSystemKey, VetRegionKey };
export { VET_SPECIES };

export type SpeciesInfo = {
  key: VetSpeciesKey;
  /** Tên khoa học — hiện nguyên văn, không dịch. */
  latin: string;
  name: T3;
  /** Một câu nói rõ vì sao loài này có trong chương trình thú y. */
  blurb: T3;
  /** Nhóm để xếp trang: thú nhỏ, thú lớn, gia cầm. */
  group: "small" | "large" | "poultry";
  /** Số đo sinh lý cơ bản — thứ tra bảng liên tục khi thực hành. */
  vitals: { temp: string; pulse: string; resp: string; lifespan: string };
};

export const SPECIES: SpeciesInfo[] = [
  {
    key: "dog",
    latin: "Canis lupus familiaris",
    name: { vi: "Chó", en: "Dog", zh: "犬" },
    blurb: {
      vi: "Loài thú nhỏ gặp nhiều nhất ở phòng khám; cũng là loài có biến dị hình thái theo giống lớn nhất trong các loài nuôi.",
      en: "The commonest small-animal patient, and the domestic species with the widest breed-related variation in body form.",
      zh: "诊所最常见的小动物患者，也是家养物种中品种形态差异最大的一种。",
    },
    group: "small",
    vitals: { temp: "37,5–39,2 °C", pulse: "70–160 /phút", resp: "10–30 /phút", lifespan: "10–14 năm" },
  },
  {
    key: "cat",
    latin: "Felis catus",
    name: { vi: "Mèo", en: "Cat", zh: "猫" },
    blurb: {
      vi: "Loài ăn thịt bắt buộc — nhiều đặc điểm giải phẫu và chuyển hoá không suy ra được từ chó.",
      en: "An obligate carnivore whose anatomy and metabolism cannot be extrapolated from the dog.",
      zh: "专性肉食动物，其解剖与代谢无法由犬类推。",
    },
    group: "small",
    vitals: { temp: "38,0–39,2 °C", pulse: "140–220 /phút", resp: "20–30 /phút", lifespan: "12–18 năm" },
  },
  {
    key: "horse",
    latin: "Equus caballus",
    name: { vi: "Ngựa", en: "Horse", zh: "马" },
    blurb: {
      vi: "Thú chạy nhanh, một ngón, lên men ở ruột sau — bộ máy tiêu hoá và chi của nó là hai chương riêng trong mọi giáo trình.",
      en: "A single-toed running animal that ferments in the hindgut — its gut and limbs each form a separate chapter in every textbook.",
      zh: "单趾奔跑动物，于后肠发酵——其消化道与四肢在各教材中各自成章。",
    },
    group: "large",
    vitals: { temp: "37,2–38,3 °C", pulse: "28–44 /phút", resp: "8–16 /phút", lifespan: "25–30 năm" },
  },
  {
    key: "cattle",
    latin: "Bos taurus",
    name: { vi: "Bò", en: "Cattle", zh: "牛" },
    blurb: {
      vi: "Loài nhai lại tiêu biểu: bốn túi dạ dày, vú bốn khoang, và gần như mọi thao tác lâm sàng làm trên con vật đang đứng.",
      en: "The archetypal ruminant: four stomach compartments, a four-quarter udder, and almost every clinical procedure done on the standing animal.",
      zh: "典型反刍动物：四室胃、四乳区乳房，几乎所有临床操作都在站立状态下完成。",
    },
    group: "large",
    vitals: { temp: "38,0–39,3 °C", pulse: "48–84 /phút", resp: "12–36 /phút", lifespan: "18–22 năm" },
  },
  {
    key: "pig",
    latin: "Sus scrofa domesticus",
    name: { vi: "Lợn", en: "Pig", zh: "猪" },
    blurb: {
      vi: "Loài ăn tạp một dạ dày, giải phẫu gần người nhất — nên vừa là vật nuôi chủ lực vừa là mô hình y sinh.",
      en: "A monogastric omnivore, anatomically the closest to the human — hence both a major production animal and a biomedical model.",
      zh: "单胃杂食动物，解剖上最接近人——既是主要生产动物，也是生物医学模型。",
    },
    group: "large",
    vitals: { temp: "38,0–40,0 °C", pulse: "60–90 /phút", resp: "10–20 /phút", lifespan: "10–15 năm" },
  },
  {
    key: "chicken",
    latin: "Gallus gallus domesticus",
    name: { vi: "Gà", en: "Chicken", zh: "鸡" },
    blurb: {
      vi: "Chim — bộ danh pháp riêng, phổi không giãn nở, túi khí, ổ nhớp: gần như không mục nào suy được từ thú có vú.",
      en: "A bird — its own nomenclature, a rigid lung, air sacs, a cloaca: almost nothing carries over from mammals.",
      zh: "鸟类——独立的命名体系、不扩张的肺、气囊、泄殖腔：几乎无一项可由哺乳动物推得。",
    },
    group: "poultry",
    vitals: { temp: "40,5–42,0 °C", pulse: "250–350 /phút", resp: "15–30 /phút", lifespan: "5–8 năm" },
  },
];

export const speciesInfo = (key: VetSpeciesKey) =>
  SPECIES.find((s) => s.key === key) ?? SPECIES[0];

export type VetGroupKey = SpeciesInfo["group"];

/**
 * NHÓM LOÀI — tầng trên cùng của khu thú y.
 *
 * Điều hướng của khu này đi theo chiều sâu: nhóm → loài → cấu trúc. Nhóm chia
 * theo cách ngành thú y vẫn chia trên thực tế (và cũng đúng cách các giáo
 * trình tách chương), chứ không theo phân loại sinh học: chó mèo đi cùng nhau
 * vì cùng một loại phòng khám, ngựa–bò–lợn đi cùng nhau vì cùng bối cảnh chăn
 * nuôi và cùng kiểu thao tác trên con vật đang đứng.
 *
 * Thứ tự cố định, KHÔNG sắp theo số mục: người học tra theo nhóm quen thuộc,
 * đảo chỗ mỗi lần thêm nội dung là mất trí nhớ vị trí.
 *
 * Chưa có nhóm lưỡng cư / bò sát / thuỷ sản vì kho chưa có mục nào cho chúng.
 * Thêm nhóm mới thì thêm nhánh vào `SpeciesInfo["group"]` rồi khai ở đây —
 * kiểm thử sẽ báo ngay nếu có nhóm không loài nào thuộc về.
 */
export const VET_GROUPS: { key: VetGroupKey; label: T3; blurb: T3 }[] = [
  {
    key: "large",
    label: { vi: "Gia súc", en: "Livestock", zh: "家畜" },
    blurb: {
      vi: "Thú nuôi lấy sức kéo, thịt và sữa — phần lớn thao tác lâm sàng làm trên con vật đang đứng.",
      en: "Animals kept for draught, meat and milk — most clinical work is done on the standing animal.",
      zh: "役用、肉用与乳用家畜——多数临床操作在站立的动物身上完成。",
    },
  },
  {
    key: "poultry",
    label: { vi: "Gia cầm", en: "Poultry", zh: "家禽" },
    blurb: {
      vi: "Chim nuôi — bộ danh pháp riêng (NAA), phổi không giãn nở, túi khí và ổ nhớp.",
      en: "Domestic birds — their own nomenclature (NAA), rigid lungs, air sacs and a cloaca.",
      zh: "家养禽类——自成体系的命名法（NAA）、不扩张的肺、气囊与泄殖腔。",
    },
  },
  {
    key: "small",
    label: { vi: "Thú cảnh", en: "Companion animals", zh: "伴侣动物" },
    blurb: {
      vi: "Thú nhỏ nuôi trong nhà — nhóm gặp nhiều nhất ở phòng khám thú y.",
      en: "Small animals kept in the home — the commonest patients in small-animal practice.",
      zh: "家养小动物——小动物门诊中最常见的患者。",
    },
  },
];

/** Các loài thuộc một nhóm, giữ nguyên thứ tự khai trong `SPECIES`. */
export const speciesOfGroup = (group: VetGroupKey) => SPECIES.filter((s) => s.group === group);

export const VET_SYSTEM_LABEL: Record<VetSystemKey, T3> = {
  skeletal: { vi: "Hệ xương", en: "Skeletal system", zh: "骨骼系统" },
  muscular: { vi: "Hệ cơ", en: "Muscular system", zh: "肌肉系统" },
  digestive: { vi: "Hệ tiêu hoá", en: "Digestive system", zh: "消化系统" },
  respiratory: { vi: "Hệ hô hấp", en: "Respiratory system", zh: "呼吸系统" },
  cardiovascular: { vi: "Hệ tuần hoàn", en: "Cardiovascular system", zh: "循环系统" },
  urogenital: { vi: "Hệ tiết niệu – sinh dục", en: "Urogenital system", zh: "泌尿生殖系统" },
  nervous: { vi: "Hệ thần kinh", en: "Nervous system", zh: "神经系统" },
  senses: { vi: "Cơ quan cảm giác", en: "Sense organs", zh: "感觉器官" },
  integument: { vi: "Da và phần phụ", en: "Skin and appendages", zh: "皮肤及其附属结构" },
  lymphoid: { vi: "Hệ bạch huyết", en: "Lymphoid system", zh: "淋巴系统" },
};

export const VET_REGION_LABEL: Record<VetRegionKey, T3> = {
  head: { vi: "Đầu", en: "Head", zh: "头部" },
  neck: { vi: "Cổ", en: "Neck", zh: "颈部" },
  trunk: { vi: "Thân", en: "Trunk", zh: "躯干" },
  forelimb: { vi: "Chi trước", en: "Forelimb", zh: "前肢" },
  hindlimb: { vi: "Chi sau", en: "Hindlimb", zh: "后肢" },
  tail: { vi: "Đuôi và vùng chậu", en: "Tail and pelvic region", zh: "尾与骨盆区" },
  whole: { vi: "Toàn thân", en: "Whole body", zh: "全身" },
};

let cache: VetFact[] | null = null;

export function allVetFacts(): VetFact[] {
  if (cache) return cache;
  const out = [...smallAnimalFacts, ...largeAnimalFacts, ...poultryFacts];
  // Trùng id là lỗi dữ liệu chứ không phải chuyện nhỏ: hai mục cùng id thì mục
  // sau che mục trước ở mọi phép tra, mà không có gì báo. Chặn ngay ở đây.
  const seen = new Set<string>();
  for (const f of out) {
    if (seen.has(f.id)) throw new Error(`Trùng id mục thú y: ${f.id}`);
    seen.add(f.id);
  }
  cache = out;
  return out;
}

export const factsOfSpecies = (key: VetSpeciesKey) =>
  allVetFacts().filter((f) => f.species.includes(key));

export const vetFact = (id: string) => allVetFacts().find((f) => f.id === id);

/** Số mục theo loài — dùng cho thẻ loài ở trang chủ thú y. */
export function vetCounts(): Record<VetSpeciesKey, number> {
  const out = {} as Record<VetSpeciesKey, number>;
  for (const s of VET_SPECIES) out[s] = factsOfSpecies(s).length;
  return out;
}

export const vetStats = {
  get facts() {
    return allVetFacts().length;
  },
  get species() {
    return SPECIES.length;
  },
  get systems() {
    return new Set(allVetFacts().map((f) => f.system)).size;
  },
};

/**
 * Các mục nói về CÙNG một chủ đề ở loài khác — nền của trang đối chiếu.
 *
 * Ghép theo hệ + vùng, và chỉ nhận mục của loài KHÁC. Cách này thô nhưng đúng
 * bản chất việc học so sánh: "cùng hệ tiêu hoá vùng thân thì loài kia thế nào".
 */
export function relatedAcrossSpecies(fact: VetFact, limit = 4): VetFact[] {
  return allVetFacts()
    .filter(
      (f) =>
        f.id !== fact.id &&
        f.system === fact.system &&
        f.region === fact.region &&
        !f.species.some((s) => fact.species.includes(s)),
    )
    .slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * Tìm kiếm
 * ------------------------------------------------------------------ */

const hay = (f: VetFact, locale: Loc) =>
  fold(
    [
      pick(f.name, locale),
      pick(f.name, "vi"),
      pick(f.name, "en"),
      f.nav,
      (f.keys ?? []).join(" "),
      pick(f.note, locale),
      f.compare ? pick(f.compare, locale) : "",
      f.clinical ? pick(f.clinical, locale) : "",
    ].join(" "),
  );

/**
 * Chấm điểm: khớp ở TÊN hoặc từ khoá nặng hơn khớp trong phần mô tả.
 *
 * Cùng bài học đã trả giá bên người: nếu khớp một từ trong đoạn giải thích cũng
 * được điểm như khớp tên, thì câu hỏi nào cũng ra hàng loạt mục chỉ vì tình cờ
 * trùng một chữ ("bò" nằm trong "bò sát", "gà" nằm trong "gan").
 */
/** Khớp CẢ TỪ, không khớp lọt giữa từ khác ("may" không được trúng "máy" trong
 *  "bộ máy đứng" khi người dùng đang hỏi chuyện khác — xem chú thích bên dưới). */
function wordIn(haystack: string, term: string): boolean {
  const i = haystack.indexOf(term);
  if (i < 0) return false;
  const before = haystack[i - 1];
  const after = haystack[i + term.length];
  const isLetter = (c?: string) => !!c && /[\p{L}\p{N}]/u.test(c);
  return !isLetter(before) && !isLetter(after);
}

export function searchVetFactsScored(
  query: string,
  locale: Loc,
  limit = 6,
): { fact: VetFact; score: number }[] {
  const q = fold(query.trim());
  if (!q) return [];
  const terms = q.split(/[^\p{L}\p{N}]+/u).filter((t) => t.length > 1);
  /* Tiếng Trung KHÔNG tách từ bằng dấu cách, nên tách theo dấu cách xong chỉ
     còn đúng một "từ" là cả câu — không khớp nổi tên mục nào. Đo thật: câu
     "鸡为什么不能呕吐" trả về rỗng. Cách xử lý chuẩn của tìm kiếm tiếng Trung là
     băm câu thành các cụm HAI KÝ TỰ (bigram) rồi so từng cụm; thêm cả từng ký
     tự đơn vì mỗi chữ Hán đã là một hình vị mang nghĩa. */
  const cjk = q.match(/[㐀-鿿]/gu) ?? [];
  const grams: string[] = [];
  for (let i = 0; i + 1 < cjk.length; i += 1) grams.push(cjk[i] + cjk[i + 1]);
  if (!terms.length && !cjk.length) return [];

  return allVetFacts()
    .map((fact) => {
      const name = fold(
        `${pick(fact.name, locale)} ${pick(fact.name, "vi")} ${pick(fact.name, "en")} ${fact.nav} ${(fact.keys ?? []).join(" ")}`,
      );
      const body = hay(fact, locale);
      let score = 0;
      /* Đếm riêng số từ khớp ở TÊN và độ dài từ dài nhất khớp được: tiếng Việt
         một âm tiết nên chỉ một từ ngắn trùng tên là chuyện ngẫu nhiên thường
         xuyên. Đo thật: "hợp đồng bảo hiểm xe máy" trúng "máy" trong "Bộ máy
         đứng" và lôi về năm mục thú y. */
      let nameHits = 0;
      let longestNameHit = 0;
      let longestBodyHit = 0;
      for (const t of terms) {
        if (wordIn(name, t)) {
          score += 10;
          nameHits += 1;
          longestNameHit = Math.max(longestNameHit, t.length);
        } else if (body.includes(t)) {
          score += 2;
          longestBodyHit = Math.max(longestBodyHit, t.length);
        }
      }
      for (const g of grams) {
        if (name.includes(g)) {
          score += 10;
          nameHits += 1;
          longestNameHit = Math.max(longestNameHit, 2);
        } else if (body.includes(g)) score += 2;
      }
      for (const c of new Set(cjk)) {
        if (name.includes(c)) {
          score += 4;
          nameHits += 1;
        }
      }
      let keyHit = false;
      for (const k of fact.keys ?? []) {
        if (k.length >= 4 && q.includes(k)) {
          score += 15;
          keyHit = true;
        }
      }
      /* Một từ trúng tên là chưa đủ, TRỪ KHI có kèm một từ dài (≥5 ký tự) khớp
         ở phần mô tả: "how many teeth does a cat have" chỉ trúng "cat" ở tên,
         nhưng "teeth" trong phần mô tả xác nhận đúng chủ đề. Từ ngắn (hop,
         dong, bao, may…) thì không xác nhận được gì. */
      const solid =
        keyHit || nameHits >= 2 || longestNameHit >= 5 || (nameHits >= 1 && longestBodyHit >= 5);
      return { fact, score: solid ? score : 0 };
    })
    .filter((x) => x.score >= 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export const searchVetFacts = (query: string, locale: Loc, limit = 6) =>
  searchVetFactsScored(query, locale, limit).map((x) => x.fact);
