import { API_URL } from "./auth";
import type { Loc } from "./homeContent";

export type Severity = "info" | "warning" | "critical";
export type Pathology = {
  id: string; nameVi: string; nameEn: string; nameZh: string; latin?: string | null;
  icdCode?: string | null; severity?: Severity | null; descriptionVi?: string | null; source: string;
  structure: { code: string; meshName?: string | null; nameVi: string; nameEn: string; nameZh: string; latin?: string | null; system?: { code: string; nameVi: string; nameEn: string; nameZh: string } };
  citations?: { id: string; pageOrSection?: string | null; verified?: boolean; source: { title: string; publisher: string; year?: number | null; url: string } }[];
};

const fallbackPathologies: Pathology[] = [
  ["myocardial-infarction", "Nhồi máu cơ tim", "Myocardial infarction", "心肌梗死", "critical", "giai-phau-tim", "Tim", "Heart", "心脏", "cardiovascular", "Tim mạch", "Cardiovascular", "心血管", "Braunwald's Heart Disease: A Textbook of Cardiovascular Medicine, 12th ed. (2021)"],
  ["cirrhosis", "Xơ gan", "Cirrhosis of the liver", "肝硬化", "warning", "giai-phau-gan", "Gan", "Liver", "肝脏", "digestive", "Tiêu hóa", "Digestive", "消化系统", "Sherlock's Diseases of the Liver and Biliary System, 13th ed. (2018)"],
  ["cholelithiasis", "Sỏi mật", "Cholelithiasis", "胆石症", "info", "mat-cat-tui-mat", "Túi mật", "Gallbladder", "胆囊", "digestive", "Tiêu hóa", "Digestive", "消化系统", "Sabiston Textbook of Surgery, 21st ed. (2022)"],
  ["acute-appendicitis", "Viêm ruột thừa cấp", "Acute appendicitis", "急性阑尾炎", "warning", "mat-cat-ruot-gia", "Ruột thừa", "Appendix", "阑尾", "digestive", "Tiêu hóa", "Digestive", "消化系统", "Sabiston Textbook of Surgery, 21st ed. (2022)"],
  ["abdominal-aortic-aneurysm", "Phình động mạch chủ bụng", "Abdominal aortic aneurysm", "腹主动脉瘤", "critical", "mat-cat-dong-mach", "Động mạch chủ bụng", "Abdominal aorta", "腹主动脉", "cardiovascular", "Tim mạch", "Cardiovascular", "心血管", "Rutherford's Vascular Surgery and Endovascular Therapy, 10th ed. (2022)"],
].map(([id, nameVi, nameEn, nameZh, severity, code, structureVi, structureEn, structureZh, systemCode, systemVi, systemEn, systemZh, source]) => ({
  id, nameVi, nameEn, nameZh, severity: severity as Severity, source,
  structure: { code, nameVi: structureVi, nameEn: structureEn, nameZh: structureZh, system: { code: systemCode, nameVi: systemVi, nameEn: systemEn, nameZh: systemZh } },
}));

export const pathologyName = (p: Pathology, l: Loc) => l === "en" ? p.nameEn : l === "zh" ? p.nameZh : p.nameVi;
export const structureName = (p: Pathology, l: Loc) => l === "en" ? p.structure.nameEn : l === "zh" ? p.structure.nameZh : p.structure.nameVi;
export const systemName = (p: Pathology, l: Loc) => l === "en" ? p.structure.system?.nameEn : l === "zh" ? p.structure.system?.nameZh : p.structure.system?.nameVi;

export async function fetchPathologies(structure?: string): Promise<Pathology[]> {
  const url = `${API_URL}/pathologies${structure ? `?structure=${encodeURIComponent(structure)}` : ""}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API unavailable");
    return response.json();
  } catch {
    return structure
      ? fallbackPathologies.filter((item) => item.structure.code === structure || item.structure.meshName === structure)
      : fallbackPathologies;
  }
}
