import { API_URL } from "./auth";
import type { Loc } from "./homeContent";

export type Severity = "info" | "warning" | "critical";

export type PathologyContent = {
  locale: string;
  /** true = bản dịch máy, chưa có người chuyên môn duyệt. */
  machineTranslated?: boolean;
  description?: string | null;
  clinical?: string | null;
  imaging?: string | null;
  progression?: string | null;
  treatment?: string | null;
};

export type PathologyStructure = {
  code: string;
  meshName?: string | null;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  latin?: string | null;
  system?: { code: string; nameVi: string; nameEn: string; nameZh: string };
};

export type Pathology = {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  latin?: string | null;
  icdCode?: string | null;
  severity?: Severity | null;
  /** Hệ lâm sàng theo giáo trình (Hô hấp, Tim mạch…) — khác hệ giải phẫu. */
  clinicalSystem?: string | null;
  source: string;
  sourcePage?: number | null;
  needsReview?: boolean;
  /** Rỗng với bệnh không thuộc một cấu trúc 3D đơn lẻ (huyết học, cấp cứu…). */
  structure?: PathologyStructure | null;
  /** Mesh vị trí tổn thương; có giá trị này thì cũng có ảnh /lesions/<slug>.png
      do `npm run render:lesions` sinh ra từ chính model của dự án. */
  lesionMesh?: string | null;
  lesionSystem?: string | null;
  content?: PathologyContent[];
  citations?: {
    id: string;
    pageOrSection?: string | null;
    verified?: boolean;
    source: { title: string; publisher: string; year?: number | null; url: string };
  }[];
};

export const pathologyName = (p: Pathology, l: Loc) =>
  l === "en" ? p.nameEn : l === "zh" ? p.nameZh : p.nameVi;

export const structureName = (p: Pathology, l: Loc) =>
  !p.structure ? null : l === "en" ? p.structure.nameEn : l === "zh" ? p.structure.nameZh : p.structure.nameVi;

export const systemName = (p: Pathology, l: Loc) =>
  !p.structure?.system
    ? null
    : l === "en"
      ? p.structure.system.nameEn
      : l === "zh"
        ? p.structure.system.nameZh
        : p.structure.system.nameVi;

/** Nội dung bệnh học theo ngôn ngữ, lùi về tiếng Việt nếu chưa dịch. */
export const pathologyContent = (p: Pathology, l: Loc): PathologyContent | undefined =>
  p.content?.find((c) => c.locale === l) ?? p.content?.find((c) => c.locale === "vi");

export type PathologyResult =
  | { ok: true; items: Pathology[] }
  | { ok: false; items: Pathology[]; error: string };

/**
 * Trả về cả trạng thái lỗi thay vì nuốt im lặng.
 *
 * Bản trước `catch` rồi trả về một danh sách hardcode, nên khi backend chết
 * trang vẫn hiện 5 bệnh như thể bình thường — và 3 trong 5 bản ghi đó trỏ tới
 * mã cấu trúc đã không còn tồn tại. Giờ gọi được thì trả dữ liệu thật, không
 * gọi được thì nói rõ là không gọi được.
 */
export async function fetchPathologies(structure?: string): Promise<PathologyResult> {
  const url = `${API_URL}/pathologies${structure ? `?structure=${encodeURIComponent(structure)}` : ""}`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(item => item && typeof item === "object" &&
      typeof item.id === "string" && typeof item.slug === "string" && typeof item.nameVi === "string" &&
      (item.content === undefined || (Array.isArray(item.content) && item.content.every((content: unknown) =>
        !!content && typeof content === "object" && "locale" in content && typeof content.locale === "string"))))) {
      throw new Error("Invalid pathology response");
    }
    return { ok: true, items: data as Pathology[] };
  } catch (error) {
    return {
      ok: false,
      items: [],
      error: error instanceof Error ? error.message : "network error",
    };
  }
}
