"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type AuditEntry } from "@/lib/admin";

const ACTION_NAME: Record<string, string> = {
  create: "tạo",
  update: "sửa",
  delete: "xoá",
  verify: "duyệt",
  role_change: "đổi quyền",
  disable: "khoá",
  enable: "mở khoá",
};

const ENTITIES = [
  { value: "", label: "Mọi đối tượng" },
  { value: "pathology", label: "Bệnh lý" },
  { value: "pathology_content", label: "Nội dung bệnh lý" },
  { value: "pathology_citation", label: "Trích dẫn" },
  { value: "medical_source", label: "Tài liệu y khoa" },
  { value: "user", label: "Tài khoản" },
];

/** Rút gọn ảnh chụp JSON cho vừa một ô bảng, bấm mới xem đầy đủ. */
function summarise(value: unknown) {
  if (value === null || value === undefined) return "—";
  const text = JSON.stringify(value);
  return text.length > 90 ? `${text.slice(0, 90)}…` : text;
}

export default function AuditPanel() {
  const [rows, setRows] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [entity, setEntity] = useState("");
  const [actor, setActor] = useState("");
  const [actorInput, setActorInput] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    // Nhường một nhịp trước khi chạm vào state, đúng quy ước đã dùng ở
    // `HomeNav`: gọi setState ĐỒNG BỘ trong thân effect thì React Compiler báo
    // lỗi "cascading renders", và cảnh báo đó đúng — lần dựng đầu sẽ render hai
    // lượt liền.
    await Promise.resolve();
    try {
      const result = await adminApi.audit({ entity, actorEmail: actor, page });
      setRows(result.items);
      setTotal(result.total);
      setPageSize(result.pageSize);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không nạp được nhật ký");
    } finally {
      setLoading(false);
    }
  }, [entity, actor, page]);

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

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="bo-bar">
        <select
          className="bo-select"
          style={{ width: "auto" }}
          value={entity}
          onChange={(event) => {
            setEntity(event.target.value);
            setPage(1);
          }}
        >
          {ENTITIES.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <form
          className="grow"
          onSubmit={(event) => {
            event.preventDefault();
            setActor(actorInput.trim());
            setPage(1);
          }}
        >
          <input
            className="bo-input"
            placeholder="Lọc theo email người thao tác…"
            value={actorInput}
            onChange={(event) => setActorInput(event.target.value)}
          />
        </form>
      </div>

      {error && <p className="bo-msg err">{error}</p>}

      <div className="bo-table-wrap">
        <table className="bo-table">
          <thead>
            <tr>
              <th>Lúc</th>
              <th>Người làm</th>
              <th>Việc</th>
              <th>Đối tượng</th>
              <th>Trước khi sửa</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setExpanded(expanded === row.id ? null : row.id)
                }
              >
                <td style={{ whiteSpace: "nowrap" }}>
                  {new Date(row.createdAt).toLocaleString("vi-VN")}
                </td>
                <td>{row.actorEmail}</td>
                <td>
                  <span className="bo-tag">
                    {ACTION_NAME[row.action] ?? row.action}
                  </span>
                </td>
                <td>
                  <strong>{row.entityLabel ?? row.entityId}</strong>
                  <em>{row.entity}</em>
                </td>
                <td style={{ maxWidth: 320 }}>
                  {expanded === row.id ? (
                    <>
                      <em>trước:</em>
                      <pre
                        style={{
                          margin: "4px 0",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                          fontSize: 11,
                        }}
                      >
                        {JSON.stringify(row.before, null, 1) ?? "—"}
                      </pre>
                      <em>sau:</em>
                      <pre
                        style={{
                          margin: "4px 0",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                          fontSize: 11,
                        }}
                      >
                        {JSON.stringify(row.after, null, 1) ?? "—"}
                      </pre>
                    </>
                  ) : (
                    <em>{summarise(row.before)}</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="bo-empty">Đang nạp…</p>}
        {!loading && rows.length === 0 && (
          <p className="bo-empty">Chưa có thao tác nào khớp bộ lọc.</p>
        )}
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
          Trang {page}/{lastPage} · {total} bản ghi · bấm một dòng để xem đầy đủ
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
    </>
  );
}
