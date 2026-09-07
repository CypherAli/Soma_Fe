"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type AdminUser } from "@/lib/admin";
import { ROLES, hasAtLeast, type AuthUser, type Role } from "@/lib/auth";

const ROLE_LABEL: Record<Role, string> = {
  user: "Người học",
  editor: "Biên tập",
  admin: "Quản trị",
  super_admin: "Super admin",
};

/**
 * Quản lý tài khoản.
 *
 * Nút nào không dùng được thì KHÔNG hiện, và hiện lý do thay vào chỗ đó: một
 * nút bấm vào chỉ để nhận thông báo lỗi là một cái bẫy. Ràng buộc thật vẫn nằm
 * ở máy chủ — ở đây chỉ nói trước cho đỡ mất công bấm.
 */
export default function UsersPanel({
  me,
  onChanged,
}: {
  me: AuthUser;
  onChanged: () => void;
}) {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
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
      const result = await adminApi.users({ q: search, page });
      setRows(result.items);
      setTotal(result.total);
      setPageSize(result.pageSize);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không nạp được danh sách");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

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

  const act = async (run: () => Promise<unknown>, ok: string) => {
    setError("");
    setNote("");
    try {
      await run();
      setNote(ok);
      await load();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Thao tác không thành công");
    }
  };

  const canManage = (user: AdminUser) =>
    user.id !== me.id && !hasAtLeast(user.role, me.role);

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="bo-bar">
        <form
          className="grow"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(q.trim());
            setPage(1);
          }}
        >
          <input
            className="bo-input"
            placeholder="Tìm theo tên hoặc email…"
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
        </form>
      </div>

      {error && <p className="bo-msg err">{error}</p>}
      {note && <p className="bo-msg ok">{note}</p>}

      <div className="bo-table-wrap">
        <table className="bo-table">
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Đăng nhập bằng</th>
              <th>Hoạt động</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                  <em>{user.email}</em>
                  <em>
                    tham gia{" "}
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </em>
                </td>
                <td>
                  <div className="bo-tags">
                    {user.providers.length === 0 ? (
                      <span className="bo-tag">mật khẩu</span>
                    ) : (
                      user.providers.map((p) => (
                        <span className="bo-tag" key={p}>
                          {p}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td>
                  <em>{user._count.quizAttempts} lượt làm bài</em>
                  <em>{user._count.reviewItems} câu đang ôn</em>
                  <em>{user._count.personalDocs} tài liệu riêng</em>
                </td>
                <td>
                  {me.role === "super_admin" && canManage(user) ? (
                    <select
                      className="bo-select"
                      value={user.role}
                      onChange={(event) =>
                        act(
                          () =>
                            adminApi.setRole(user.id, event.target.value as Role),
                          `Đã đổi quyền của ${user.email}.`,
                        )
                      }
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABEL[role]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                      <span className="bo-tag">{ROLE_LABEL[user.role]}</span>
                      {user.id === me.id && <em>chính bạn</em>}
                      {user.id !== me.id && !canManage(user) && (
                        <em>ngang hoặc trên bậc bạn</em>
                      )}
                      {user.id !== me.id &&
                        canManage(user) &&
                        me.role !== "super_admin" && <em>cần super admin</em>}
                    </>
                  )}
                </td>
                <td>
                  <span
                    className={`bo-tag ${user.disabledAt ? "bad" : "good"}`}
                  >
                    {user.disabledAt ? "đã khoá" : "đang hoạt động"}
                  </span>
                  {canManage(user) && (
                    <em>
                      <button
                        type="button"
                        className={`bo-btn small ${user.disabledAt ? "" : "danger"}`}
                        style={{ marginTop: 6 }}
                        onClick={() => {
                          if (
                            !user.disabledAt &&
                            !confirm(
                              `Khoá ${user.email}? Mọi phiên đang đăng nhập sẽ bị cắt ngay.`,
                            )
                          ) {
                            return;
                          }
                          void act(
                            () =>
                              adminApi.setDisabled(user.id, !user.disabledAt),
                            user.disabledAt
                              ? `Đã mở khoá ${user.email}.`
                              : `Đã khoá ${user.email}.`,
                          );
                        }}
                      >
                        {user.disabledAt ? "Mở khoá" : "Khoá"}
                      </button>
                    </em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && (
          <p className="bo-empty">Không có tài khoản nào khớp.</p>
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
          Trang {page}/{lastPage} · {total} tài khoản
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
