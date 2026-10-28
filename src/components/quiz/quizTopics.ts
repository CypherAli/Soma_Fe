
import { bindContentSource } from "@/lib/content/source";
import type { DrLamEntry } from "@/lib/anatomy/drLamBank";

export const QUIZ_TOPICS = bindContentSource("data:src/components/quiz/quizTopics.ts#QUIZ_TOPICS", [
  { id: "upper-limb", label: "Chi trên", en: "Upper limb", zh: "上肢", icon: "limb" },
  { id: "lower-limb", label: "Chi dưới", en: "Lower limb", zh: "下肢", icon: "limb" },
  { id: "head-neck", label: "Đầu, mặt & cổ", en: "Head & neck", zh: "头颈", icon: "head" },
  { id: "senses", label: "Mắt & tai", en: "Eye & ear", zh: "眼耳", icon: "eye" },
  { id: "thorax", label: "Ngực", en: "Thorax", zh: "胸部", icon: "thorax" },
  { id: "abdomen-pelvis", label: "Bụng & chậu", en: "Abdomen & pelvis", zh: "腹盆部", icon: "body" },
  { id: "nervous", label: "Thần kinh", en: "Nervous system", zh: "神经系统", icon: "brain" },
  { id: "clinical", label: "Ca lâm sàng", en: "Clinical cases", zh: "临床案例", icon: "case" },
  { id: "review", label: "Ôn tập tổng hợp", en: "Review sets", zh: "综合复习", icon: "book" },
  { id: "mock", label: "Đề thi thử", en: "Mock exams", zh: "模拟试卷", icon: "exam" },
] as const);

export function sourceDisplayLabel(value: string): string {
  return value.replace(/\bdr[.\s]*l[âa]m\b/giu, "").replace(/\s+\.(pdf|docx)\b/gi, ".$1").replace(/[ \t]{2,}/g, " ").trim();
}

export function quizExamTitle(entry: DrLamEntry): string {
  const titles: Record<string, string> = {
    "cau-hoi-dung-sai-co-than-chung-la-bung": "Đúng / sai · giải phẫu bụng",
    "da-day-gan-ruot": "Dạ dày, gan & ruột",
    "giai-phau-than-tu-cung-nieu-quan-am-dao": "Thận, niệu quản & cơ quan sinh dục nữ",
    "giai-phau-thanh-bung-ong-ben": "Thành bụng & ống bẹn",
    "mcq-dau-mat-co": "Trắc nghiệm · đầu, mặt & cổ",
    "dung-sai-dau-mat-co": "Đúng / sai · đầu, mặt & cổ",
    "dau-mat-co": "Giải phẫu đầu, mặt & cổ",
    "tong-hop-cac-case-lam-sang-quan-trong": "Các ca lâm sàng quan trọng",
  };
  return sourceDisplayLabel(titles[entry.id] ?? entry.title);
}

export const normalizeQuizSearch = (text: string) => text.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
export function quizMatchesQuery(text: string, query: string): boolean {
  const searchable = normalizeQuizSearch(text);
  return normalizeQuizSearch(query).split(/\s+/).filter(Boolean).every(token => searchable.includes(token));
}
