"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminApi,
  LOCALES,
  type Locale3,
  type PathologyRow,
} from "@/lib/admin";
import { hasAtLeast, type Role } from "@/lib/auth";
import PathologyDrawer from "./PathologyDrawer";

const SEVERITY_TONE: Record<string, string> = {
  info: "",
  warning: "warn",
  critical: "bad",
};

/**
 * Danh sách bệnh lý với các bộ lọc theo đúng những chỗ dữ liệu hay hổng.
 *
 * Bộ lọc "chưa có bản dịch" là bộ lọc quan trọng nhất ở đây: nó biến câu hỏi
 * "còn thiếu gì" — vốn phải mở từng bài mới trả lời được — thành một danh sách
 * bấm một cái là ra.
 */
export default function PathologyPanel({
  role,
  onChanged,
}: {
  role: Role;
  onChanged: () => void;
}) {
  const [rows, setRows] = useState<PathologyRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [system, setSystem] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");
  const [missingLocale, setMissingLocale] = useState("");
  const [systems, setSystems] = useState<{ name: string; count: number }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    // Nhường một nhịp trước khi chạm vào state, đúng quy ước đã dùng ở
    // `HomeNav`: gọi setState ĐỒNG BỘ trong thân effect thì React Compiler báo
    // lỗi "cascading renders", và cảnh báo đó đúng — lần dựng đầu sẽ render hai
    // lượt liền.
    await Promise.resolve();
    try {
      const result = await adminApi.pathologies({
        q: search,
        clinicalSystem: system,
        needsReview:
          reviewFilter === "" ? undefined : reviewFilter === "pending",
        missingLocale,
        page,
      });
      setRows(result.items);
      setTotal(result.total);
      setPageSize(result.pageSize);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không nạp được danh sách");
    } finally {
      setLoading(false);
    }
  }, [search, system, reviewFilter, missingLocale, page]);

  useEffect(() => {
    // Bọc trong một hàm async khai ngay trong effect và nhường một nhịp trước
    // khi gọi: gọi thẳng `load()` thì React Compiler coi là setState đồng bộ
    // trong effect và báo lỗi "cascading renders". Cùng khuôn với `HomeNav`.
    async function run() {
      await Promise.resolve();
      await load();
    }
    void run();
  }, [load]);

  useEffect(() => {
    adminApi
      .clinicalSystems()
      .then(setSystems)
      .catch(() => setSystems([]));
  }, []);

  // Đổi bộ lọc thì phải quay về trang 1: đang ở trang 4 mà lọc còn 12 kết quả
  // thì màn hình trống trơn, trông y như hỏng.
  const changeFilter = (apply: () => void) => {
    apply();
    setPage(1);
  };

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="bo-bar">
        <form
          className="grow"
          onSubmit={(event) => {
            event.preventDefault();
            changeFilter(() => setSearch(q.trim()));
          }}
        >
          <input
            className="bo-input"
            placeholder="Tìm theo tên, slug hoặc mã ICD…"
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
        </form>
        <select
          className="bo-select"
          style={{ width: "auto" }}
          value={system}
          onChange={(event) =>
            changeFilter(() => setSystem(event.target.value))
          }
        >
          <option value="">Mọi hệ lâm sàng</option>
          {systems.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.count})
            </option>
          ))}
        </select>
        <select
          className="bo-select"
          style={{ width: "auto" }}
          value={reviewFilter}
          onChange={(event) =>
            changeFilter(() => setReviewFilter(event.target.value))
          }
        >
          <option value="">Mọi trạng thái duyệt</option>
          <option value="pending">Chưa duyệt</option>
          <option value="done">Đã duyệt</option>
        </select>
        <select
          className="bo-select"
          style={{ width: "auto" }}
          value={missingLocale}
          onChange={(event) =>
            changeFilter(() => setMissingLocale(event.target.value))
          }
        >
          <option value="">Mọi ngôn ngữ</option>
          {LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              Chưa có bản {locale}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="bo-msg err">{error}</p>}

      <div className="bo-table-wrap">
        <table className="bo-table">
          <thead>
            <tr>
              <th>Bệnh</th>
              <th>Hệ lâm sàng</th>
              <th>Ngôn ngữ</th>
              <th>Trích dẫn</th>
              <th>Neo 3D</th>
              <th>Duyệt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => setOpenId(row.id)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <strong>{row.nameVi}</strong>
                  <em>
                    {row.slug}
                    {row.icdCode ? ` · ICD ${row.icdCode}` : ""}
                  </em>
                </td>
                <td>
                  {row.clinicalSystem ?? "—"}
                  {row.severity && (
                    <em>
                      <span
                        className={`bo-tag ${SEVERITY_TONE[row.severity] ?? ""}`}
                      >
                        {row.severity}
                      </span>
                    </em>
                  )}
                </td>
                <td>
                  <div className="bo-tags">
                    {LOCALES.map((locale) => {
                      const has = row.locales.includes(locale);
                      const machine = row.machineLocales.includes(locale);
                      return (
                        <span
                          key={locale}
                          className={`bo-tag ${has ? (machine ? "warn" : "good") : "bad"}`}
                          title={
                            !has
                              ? "Chưa có nội dung"
                              : machine
                                ? "Dịch máy, chưa có người duyệt"
                                : "Đã có người soạn/duyệt"
                          }
                        >
                          {locale}
                          {machine ? "*" : ""}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td>
                  <span className={`bo-tag ${row.citations ? "good" : "bad"}`}>
                    {row.citations}
                  </span>
                </td>
                <td>
                  {row.lesionMesh ? (
                    <em title={row.lesionMesh}>{row.lesionSystem ?? "có"}</em>
                  ) : (
                    <em>—</em>
                  )}
                </td>
                <td>
                  <span
                    className={`bo-tag ${row.needsReview ? "warn" : "good"}`}
                  >
                    {row.needsReview ? "chờ duyệt" : "đã duyệt"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && (
          <p className="bo-empty">Không có bệnh lý nào khớp bộ lọc.</p>
        )}
        {loading && <p className="bo-empty">Đang nạp…</p>}
      </div>

      <div className="bo-pager">
        <button
          type="button"
          className="bo-btn small"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Trước
        </button>
        <span>
          Trang {page}/{lastPage} · {total} bệnh
        </span>
        <button
          type="button"
          className="bo-btn small"
          disabled={page >= lastPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Sau
        </button>
      </div>

      {openId && (
        <PathologyDrawer
          id={openId}
          canReview={hasAtLeast(role, "admin")}
          onClose={() => setOpenId(null)}
          onSaved={() => {
            void load();
            onChanged();
          }}
        />
      )}
    </>
  );
}

export type { Locale3 };
