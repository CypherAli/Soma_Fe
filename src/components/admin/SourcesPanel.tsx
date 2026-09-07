"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type MedicalSource } from "@/lib/admin";

/**
 * Ý nghĩa của từng trạng thái tài liệu, và trạng thái đó có cho phép lưu bản
 * sao hay không.
 *
 * Viết ra ở đây vì đây là chỗ người ta chọn nó: một ô chọn với bảy chuỗi mã kỹ
 * thuật thì ai cũng chọn bừa, mà chọn sai `downloaded` cho một cuốn sách thương
 * mại là một tuyên bố sai về bản quyền.
 */
const STATUS: { value: string; label: string; tone: string }[] = [
  { value: "downloaded", label: "Đã tải toàn văn (giấy phép mở)", tone: "good" },
  { value: "official-link", label: "Chỉ liên kết chính thức", tone: "" },
  {
    value: "official-link-unavailable",
    label: "Liên kết chính thức đã hỏng",
    tone: "warn",
  },
  { value: "restricted-login", label: "Cần đăng nhập thư viện", tone: "warn" },
  { value: "commercial", label: "Sách thương mại — chỉ trích dẫn", tone: "warn" },
];

const toneOf = (status: string) =>
  STATUS.find((s) => s.value === status)?.tone ?? "";
const labelOf = (status: string) =>
  STATUS.find((s) => s.value === status)?.label ?? status;

export default function SourcesPanel() {
  const [rows, setRows] = useState<MedicalSource[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<MedicalSource>>({});
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    // Nhường một nhịp trước khi chạm vào state, đúng quy ước đã dùng ở
    // `HomeNav`: gọi setState ĐỒNG BỘ trong thân effect thì React Compiler báo
    // lỗi "cascading renders", và cảnh báo đó đúng — lần dựng đầu sẽ render hai
    // lượt liền.
    await Promise.resolve();
    try {
      const result = await adminApi.sources();
      setRows(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không nạp được danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const save = async (id: string) => {
    setError("");
    setNote("");
    try {
      await adminApi.updateSource(id, draft);
      setEditing(null);
      setDraft({});
      setNote("Đã lưu tài liệu.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được");
    }
  };

  return (
    <>
      {error && <p className="bo-msg err">{error}</p>}
      {note && <p className="bo-msg ok">{note}</p>}

      <div className="bo-table-wrap">
        <table className="bo-table">
          <thead>
            <tr>
              <th>Tài liệu</th>
              <th>Trạng thái</th>
              <th>Đang được trích</th>
              <th>Rà lần cuối</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((source) =>
              editing === source.id ? (
                <tr key={source.id}>
                  <td colSpan={5}>
                    <div className="bo-field">
                      <label htmlFor={`t-${source.id}`}>Tiêu đề</label>
                      <input
                        id={`t-${source.id}`}
                        className="bo-input"
                        value={draft.title ?? ""}
                        onChange={(event) =>
                          setDraft({ ...draft, title: event.target.value })
                        }
                      />
                    </div>
                    <div className="bo-field">
                      <label htmlFor={`p-${source.id}`}>Nhà xuất bản</label>
                      <input
                        id={`p-${source.id}`}
                        className="bo-input"
                        value={draft.publisher ?? ""}
                        onChange={(event) =>
                          setDraft({ ...draft, publisher: event.target.value })
                        }
                      />
                    </div>
                    <div className="bo-field">
                      <label htmlFor={`y-${source.id}`}>Năm</label>
                      <input
                        id={`y-${source.id}`}
                        className="bo-input"
                        type="number"
                        value={draft.year ?? ""}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            year: event.target.value
                              ? Number(event.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="bo-field">
                      <label htmlFor={`u-${source.id}`}>Liên kết</label>
                      <input
                        id={`u-${source.id}`}
                        className="bo-input"
                        value={draft.url ?? ""}
                        onChange={(event) =>
                          setDraft({ ...draft, url: event.target.value })
                        }
                      />
                    </div>
                    <div className="bo-field">
                      <label htmlFor={`s-${source.id}`}>Trạng thái</label>
                      <select
                        id={`s-${source.id}`}
                        className="bo-select"
                        value={draft.status ?? ""}
                        onChange={(event) =>
                          setDraft({ ...draft, status: event.target.value })
                        }
                      >
                        {STATUS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="bo-field">
                      <label htmlFor={`l-${source.id}`}>Ghi chú giấy phép</label>
                      <textarea
                        id={`l-${source.id}`}
                        className="bo-textarea"
                        style={{ minHeight: 64 }}
                        value={draft.licenseNote ?? ""}
                        onChange={(event) =>
                          setDraft({ ...draft, licenseNote: event.target.value })
                        }
                      />
                    </div>
                    <div className="bo-bar">
                      <button
                        type="button"
                        className="bo-btn primary"
                        onClick={() => save(source.id)}
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        className="bo-btn"
                        onClick={() => {
                          setEditing(null);
                          setDraft({});
                        }}
                      >
                        Huỷ
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={source.id}>
                  <td>
                    <strong>{source.title}</strong>
                    <em>
                      {source.publisher}
                      {source.year ? ` · ${source.year}` : ""}
                    </em>
                    <em>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.url}
                      </a>
                    </em>
                    {source.licenseNote && <em>{source.licenseNote}</em>}
                  </td>
                  <td>
                    <span className={`bo-tag ${toneOf(source.status)}`}>
                      {labelOf(source.status)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`bo-tag ${source._count?.citations ? "" : "warn"}`}
                    >
                      {source._count?.citations ?? 0} trích dẫn
                    </span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(source.checkedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="bo-btn small"
                      onClick={() => {
                        setEditing(source.id);
                        setDraft({
                          title: source.title,
                          publisher: source.publisher,
                          year: source.year ?? undefined,
                          url: source.url,
                          status: source.status,
                          licenseNote: source.licenseNote ?? "",
                        });
                      }}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {loading && <p className="bo-empty">Đang nạp…</p>}
        {!loading && rows.length === 0 && (
          <p className="bo-empty">Danh mục tài liệu đang trống.</p>
        )}
      </div>

      <p style={{ marginTop: 12, color: "var(--bo-muted)", fontSize: 12 }}>
        Danh mục này đồng bộ từ <code>medical_kb/catalog.json</code> bằng lệnh{" "}
        <code>npm run kb:sync</code> ở backend. Sửa ở đây là sửa bản trong cơ sở
        dữ liệu — muốn giữ vĩnh viễn thì cập nhật cả tệp catalog, nếu không lần
        đồng bộ sau sẽ ghi đè.
      </p>
    </>
  );
}
