import { authRequest, type Role } from "@/lib/auth";

/**
 * Máy khách gọi khu `/api/admin` của backend.
 *
 * Mọi hàm ở đây đều đi qua `authRequest`, tức là luôn kèm bearer token và luôn
 * ném lỗi mang đúng thông điệp tiếng Việt mà máy chủ trả về. Giao diện chỉ việc
 * bắt lỗi và hiện lên — KHÔNG tự đoán "chắc là không đủ quyền", vì đoán sai thì
 * người dùng đi sửa nhầm chỗ.
 *
 * Không chặn quyền ở đây: chặn thật nằm ở guard phía máy chủ. Phía web chỉ ẩn
 * bớt nút cho đỡ rối, ẩn được không có nghĩa là an toàn.
 */

export type Locale3 = "vi" | "en" | "zh";
export const LOCALES: Locale3[] = ["vi", "en", "zh"];

export type Overview = {
  content: {
    pathologies: number;
    needsReview: number;
    structures: number;
    systems: number;
    species: number;
    sources: number;
    quizQuestions: number;
  };
  locales: { locale: Locale3; filled: number; missing: number }[];
  quality: {
    machineTranslated: number;
    citations: number;
    unverifiedCitations: number;
    pathologiesWithoutCitation: number;
    pathologiesWithoutLesion: number;
  };
  people: { users: number; disabledUsers: number; attempts: number };
  recentAudit: AuditEntry[];
};

export type AuditEntry = {
  id: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string;
  entityLabel: string | null;
  before: unknown;
  after: unknown;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  disabledAt: string | null;
  createdAt: string;
  providers: string[];
  _count: { quizAttempts: number; personalDocs: number; reviewItems: number };
};

export type PathologyRow = {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  icdCode: string | null;
  severity: "info" | "warning" | "critical" | null;
  clinicalSystem: string | null;
  needsReview: boolean;
  lesionMesh: string | null;
  lesionSystem: string | null;
  source: string;
  sourcePage: number | null;
  structure: { code: string; nameVi: string } | null;
  citations: number;
  locales: string[];
  missingLocales: Locale3[];
  machineLocales: string[];
};

export type PathologyContent = {
  id: string;
  locale: string;
  description: string | null;
  clinical: string | null;
  imaging: string | null;
  progression: string | null;
  treatment: string | null;
  machineTranslated: boolean;
};

export type MedicalSource = {
  id: string;
  title: string;
  publisher: string;
  year: number | null;
  url: string;
  status: string;
  licenseNote: string | null;
  checkedAt: string;
  _count?: { citations: number };
};

export type Citation = {
  id: string;
  sourceId: string;
  pageOrSection: string | null;
  quote: string | null;
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  source: MedicalSource;
};

export type PathologyDetail = PathologyRow & {
  content: PathologyContent[];
  citations: Citation[];
};

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

/** Ghép query string, bỏ hẳn tham số rỗng để URL không có `?q=&page=`. */
function query(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const adminApi = {
  overview: () => authRequest<Overview>("/admin/overview"),

  users: (params: { q?: string; page?: number }) =>
    authRequest<Page<AdminUser>>(`/admin/users${query(params)}`),

  setRole: (id: string, role: Role) =>
    authRequest<AdminUser>(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  setDisabled: (id: string, disabled: boolean) =>
    authRequest<AdminUser>(`/admin/users/${id}/disabled`, {
      method: "PATCH",
      body: JSON.stringify({ disabled }),
    }),

  pathologies: (params: {
    q?: string;
    clinicalSystem?: string;
    needsReview?: boolean;
    missingLocale?: string;
    page?: number;
  }) => authRequest<Page<PathologyRow>>(`/admin/pathologies${query(params)}`),

  clinicalSystems: () =>
    authRequest<{ name: string; count: number }[]>("/admin/clinical-systems"),

  pathology: (id: string) =>
    authRequest<PathologyDetail>(`/admin/pathologies/${id}`),

  /**
   * Sửa thuộc tính của bản ghi bệnh lý.
   *
   * Không có `lesionMesh`/`lesionSystem`/`slug` — xem `UpdatePathologyMetaDto`
   * bên backend để biết vì sao ba trường đó không mở cho gõ tay.
   */
  updatePathology: (
    id: string,
    body: Partial<
      Pick<
        PathologyRow,
        | "nameVi"
        | "nameEn"
        | "nameZh"
        | "icdCode"
        | "severity"
        | "clinicalSystem"
        | "source"
        | "sourcePage"
      >
    >,
  ) =>
    authRequest<PathologyRow>(`/admin/pathologies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  saveContent: (
    id: string,
    locale: Locale3,
    body: Partial<Omit<PathologyContent, "id" | "locale">>,
  ) =>
    authRequest<PathologyContent>(`/admin/pathologies/${id}/content/${locale}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  setReviewed: (id: string, needsReview: boolean) =>
    authRequest<{ id: string; needsReview: boolean }>(
      `/admin/pathologies/${id}/reviewed`,
      { method: "PATCH", body: JSON.stringify({ needsReview }) },
    ),

  addCitation: (
    id: string,
    body: { sourceId: string; pageOrSection?: string; quote?: string },
  ) =>
    authRequest<Citation>(`/admin/pathologies/${id}/citations`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyCitation: (id: string, verified: boolean) =>
    authRequest<Citation>(`/admin/citations/${id}/verified`, {
      method: "PATCH",
      body: JSON.stringify({ verified }),
    }),

  removeCitation: (id: string) =>
    authRequest<{ deleted: boolean }>(`/admin/citations/${id}`, {
      method: "DELETE",
    }),

  sources: () => authRequest<MedicalSource[]>("/admin/sources"),

  updateSource: (id: string, body: Partial<MedicalSource>) =>
    authRequest<MedicalSource>(`/admin/sources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  audit: (params: { entity?: string; actorEmail?: string; page?: number }) =>
    authRequest<Page<AuditEntry>>(`/admin/audit${query(params)}`),
};
