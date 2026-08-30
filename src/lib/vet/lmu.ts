import type { T3 } from "@/lib/homeContent";
import { lmuModels, type LmuModel } from "./lmuData";
import type { VetSpeciesKey } from "./types";

/**
 * XẾP NHÓM VÀ DỊCH TÊN cho bộ mô hình xương của LMU München.
 *
 * Sổ đăng ký (`lmuData.ts`) sinh tự động từ tiêu đề Sketchfab nên
 * chỉ có tên tiếng Anh và tên Latin. Tệp này là phần BIÊN SOẠN TAY đặt lên
 * trên: xếp 108 mô hình vào sáu nhóm giải phẫu và dịch tên sang tiếng Việt,
 * tiếng Trung.
 *
 * Tách làm hai tệp là có chủ ý: chạy lại bộ nạp sẽ ghi đè tệp sinh tự động,
 * còn công sức biên soạn ở đây thì không bị mất.
 *
 * Tên Latin luôn hiện nguyên văn — đó là chuẩn NAV, thứ sinh viên thú y phải
 * thuộc, và cũng là thứ duy nhất không phụ thuộc ngôn ngữ.
 */
export type LmuGroupKey = "teeth" | "head" | "axial" | "forelimb" | "digit" | "hindlimb" | "organ";

export const LMU_GROUPS: { key: LmuGroupKey; label: T3 }[] = [
  { key: "teeth", label: { vi: "Răng", en: "Teeth", zh: "牙齿" } },
  { key: "head", label: { vi: "Đầu", en: "Head", zh: "头部" } },
  { key: "axial", label: { vi: "Thân và cột sống", en: "Trunk and spine", zh: "躯干与脊柱" } },
  { key: "forelimb", label: { vi: "Chi trước", en: "Forelimb", zh: "前肢" } },
  { key: "digit", label: { vi: "Ngón", en: "Digits", zh: "指（趾）" } },
  { key: "hindlimb", label: { vi: "Chi sau", en: "Hindlimb", zh: "后肢" } },
  { key: "organ", label: { vi: "Cơ quan", en: "Organs", zh: "器官" } },
];

/**
 * Xếp nhóm theo TỪ KHOÁ trong tên tiếng Anh.
 *
 * Thứ tự trong mảng có ý nghĩa: khớp cái đầu tiên rồi dừng. "radial carpal
 * bone" phải trúng "carpal" (chi trước) chứ không trúng "radial" — nên các từ
 * cụ thể hơn phải đứng trước.
 */
const RULES: { group: LmuGroupKey; words: string[] }[] = [
  { group: "teeth", words: ["incisor", "canine tooth", "cheek tooth", "premolar", "molar", "tooth"] },
  { group: "head", words: ["nasal", "skull", "cranium", "mandible", "jaw", "hyoid"] },
  { group: "organ", words: ["kidney", "heart", "liver", "lung", "spleen", "stomach"] },
  {
    group: "axial",
    words: ["vertebra", "sternebra", "manubrium", "xiphoid", "pelvic", "sacrum", "rib", "pygostyle"],
  },
  { group: "digit", words: ["phalanx", "phalanges"] },
  {
    group: "hindlimb",
    words: [
      "tarsal", "metatarsal", "femur", "shinbone", "calf bone", "kneecap", "patella",
      "heel bone", "talus", "navicular", "centroquartal", "fibula", "tibia",
    ],
  },
  {
    group: "forelimb",
    words: [
      "carpal", "metacarpal", "humerus", "radius", "ulna", "shoulder blade", "scapula",
      "clavicle", "coracoid", "wishbone", "furcula", "pisiform", "triquetral",
      "brachial bone", "radial bone",
    ],
  },
];

export function lmuGroupOf(model: LmuModel): LmuGroupKey {
  const n = model.nameEn.toLowerCase();
  for (const rule of RULES) {
    if (rule.words.some((w) => n.includes(w))) return rule.group;
  }
  return "axial";
}

/**
 * Tên xương bằng tiếng Việt và tiếng Trung.
 *
 * Khoá là tên tiếng Anh đã bỏ số thứ tự ("4th tarsal bone" → "tarsal bone") và
 * bỏ tên loài dính đuôi, vì LMU đặt tiêu đề không đều tay.
 */
const BONE: Record<string, T3> = {
  "incisor": { vi: "Răng cửa", en: "Incisor", zh: "门齿" },
  "canine tooth": { vi: "Răng nanh", en: "Canine tooth", zh: "犬齿" },
  "cheek tooth": { vi: "Răng má", en: "Cheek tooth", zh: "颊齿" },
  "nasal cartilages": { vi: "Sụn mũi", en: "Nasal cartilages", zh: "鼻软骨" },
  "thoracic vertebra": { vi: "Đốt sống ngực", en: "Thoracic vertebra", zh: "胸椎" },
  "caudal vertebra": { vi: "Đốt sống đuôi", en: "Caudal vertebra", zh: "尾椎" },
  "sternebra": { vi: "Đốt xương ức", en: "Sternebra", zh: "胸骨节" },
  "manubrium": { vi: "Cán xương ức", en: "Manubrium", zh: "胸骨柄" },
  "xiphoid process": { vi: "Mỏm mũi kiếm", en: "Xiphoid process", zh: "剑突" },
  "pelvic bones": { vi: "Xương chậu", en: "Pelvic bones", zh: "骨盆诸骨" },
  "pygostyle": { vi: "Xương đuôi cụt (pygostyle)", en: "Pygostyle", zh: "尾综骨" },
  "humerus": { vi: "Xương cánh tay", en: "Humerus", zh: "肱骨" },
  "brachial bone": { vi: "Xương cánh (chim)", en: "Brachial bone", zh: "肱骨（禽）" },
  "radius": { vi: "Xương quay", en: "Radius", zh: "桡骨" },
  "radial bone": { vi: "Xương quay (chim)", en: "Radial bone", zh: "桡骨（禽）" },
  "ulna": { vi: "Xương trụ", en: "Ulna", zh: "尺骨" },
  "shoulder blade": { vi: "Xương bả vai", en: "Shoulder blade", zh: "肩胛骨" },
  "clavicle": { vi: "Xương đòn", en: "Clavicle", zh: "锁骨" },
  "coracoid": { vi: "Xương quạ", en: "Coracoid", zh: "喙骨" },
  "wishbone": { vi: "Xương đòn chạc (furcula)", en: "Wishbone (furcula)", zh: "叉骨" },
  "carpal bone": { vi: "Xương cổ tay", en: "Carpal bone", zh: "腕骨" },
  "radial carpal bone": { vi: "Xương cổ tay quay", en: "Radial carpal bone", zh: "桡腕骨" },
  "ulnar carpal bone": { vi: "Xương cổ tay trụ", en: "Ulnar carpal bone", zh: "尺腕骨" },
  "intermedioradial carpal bone": {
    vi: "Xương cổ tay giữa–quay",
    en: "Intermedioradial carpal bone",
    zh: "中间桡腕骨",
  },
  "pisiform bone": { vi: "Xương đậu", en: "Pisiform bone", zh: "副腕骨" },
  "triquetral bone": { vi: "Xương tháp", en: "Triquetral bone", zh: "三角骨" },
  "metacarpal bone": { vi: "Xương bàn tay", en: "Metacarpal bone", zh: "掌骨" },
  "proximal phalanx": { vi: "Đốt ngón gần", en: "Proximal phalanx", zh: "近指节骨" },
  "middle phalanx": { vi: "Đốt ngón giữa", en: "Middle phalanx", zh: "中指节骨" },
  "femur": { vi: "Xương đùi", en: "Femur", zh: "股骨" },
  "shinbone": { vi: "Xương chày", en: "Tibia", zh: "胫骨" },
  "calf bone": { vi: "Xương mác", en: "Fibula", zh: "腓骨" },
  "kneecap": { vi: "Xương bánh chè", en: "Patella", zh: "膝盖骨" },
  "heel bone": { vi: "Xương gót", en: "Calcaneus", zh: "跟骨" },
  "talus": { vi: "Xương sên", en: "Talus", zh: "距骨" },
  "navicular bone": { vi: "Xương thuyền", en: "Navicular bone", zh: "舟骨" },
  "tarsal bone": { vi: "Xương cổ chân", en: "Tarsal bone", zh: "跗骨" },
  "central tarsal bone": { vi: "Xương cổ chân giữa", en: "Central tarsal bone", zh: "中央跗骨" },
  "centroquartal bone": { vi: "Xương cổ chân giữa–bốn", en: "Centroquartal bone", zh: "中央第四跗骨" },
  "metatarsal bone": { vi: "Xương bàn chân", en: "Metatarsal bone", zh: "跖骨" },
  "metatarsal bones": { vi: "Các xương bàn chân", en: "Metatarsal bones", zh: "跖骨" },
  "kidney": { vi: "Thận", en: "Kidney", zh: "肾" },
};

/**
 * Bỏ số thứ tự đầu tên và tên loài dính đuôi để tra bảng dịch.
 *
 * Thứ tự hai phép thay QUAN TRỌNG: phải cắt "6th" nguyên cụm TRƯỚC, vì cắt chữ
 * số trần trước thì "6th cheek tooth" còn lại "th cheek tooth" — tra bảng
 * trượt sạch. Đúng lỗi đã làm 57/108 tên không dịch được.
 */
function baseName(nameEn: string): string {
  return nameEn
    .toLowerCase()
    .replace(/^\d+(st|nd|rd|th)\s+/, "")
    .replace(/^\d+\s*\.?\s*/, "")
    .replace(/\s+(dog|cat|horse|cow|cattle|pig|chicken).*$/, "")
    .trim();
}

/** Số thứ tự ở đầu tên, để hiện lại sau tên đã dịch ("Răng má 3"). */
function ordinalOf(nameEn: string): string {
  const m = nameEn.match(/^(\d+)(st|nd|rd|th)?\s*\.?\s/);
  return m ? m[1] : "";
}

/**
 * Tra bảng dịch: khớp đúng trước, không có thì khớp theo TIỀN TỐ dài nhất.
 *
 * Cần bước thứ hai vì LMU có những tiêu đề kể chuyện như "cheek tooth of a 44
 * years old horse" — vẫn là răng má, chỉ là mô tả thêm.
 */
function lookup(base: string): T3 | undefined {
  const exact = BONE[base];
  if (exact) return exact;
  const keys = Object.keys(BONE).sort((a, b) => b.length - a.length);
  const prefix = keys.find((k) => base.startsWith(k));
  return prefix ? BONE[prefix] : undefined;
}

export function lmuName(model: LmuModel): T3 {
  const base = baseName(model.nameEn);
  const hit = lookup(base);
  const ord = ordinalOf(model.nameEn);
  if (!hit) {
    // Chưa dịch thì hiện nguyên tên tiếng Anh ở cả ba ngôn ngữ — thà lộ ra một
    // tên chưa dịch còn hơn bịa hoặc bỏ trống mục.
    return { vi: model.nameEn, en: model.nameEn, zh: model.nameEn };
  }
  const suffix = ord ? ` ${ord}` : "";
  return { vi: hit.vi + suffix, en: hit.en + suffix, zh: hit.zh + suffix };
}

export const lmuOfSpecies = (species: VetSpeciesKey) =>
  lmuModels.filter((m) => m.species === species);

export function lmuGroupsOfSpecies(species: VetSpeciesKey) {
  const mine = lmuOfSpecies(species);
  return LMU_GROUPS.map((g) => ({
    ...g,
    models: mine.filter((m) => lmuGroupOf(m) === g.key),
  })).filter((g) => g.models.length > 0);
}

export { lmuModels };
export type { LmuModel };
