"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AUTH_CHANGED_EVENT,
  authRequest,
  clearAuth,
  getToken,
  hasAtLeast,
  type AuthUser,
} from "@/lib/auth";
import { adminApi, type Overview } from "@/lib/admin";
import OverviewPanel from "./OverviewPanel";
import PathologyPanel from "./PathologyPanel";
import UsersPanel from "./UsersPanel";
import SourcesPanel from "./SourcesPanel";
import AuditPanel from "./AuditPanel";

type TabKey = "overview" | "pathologies" | "sources" | "users" | "audit";

const TABS: {
  key: TabKey;
  label: string;
  title: string;
  hint: string;
  /** Bậc quyền tối thiểu, khớp với `@MinRole` của backend. */
  min: "editor" | "admin";
}[] = [
  {
    key: "overview",
    label: "Bảng điều khiển",
    title: "Bảng điều khiển",
    hint: "Số liệu nội dung và phần dữ liệu còn hổng",
    min: "editor",
  },
  {
    key: "pathologies",
    label: "Bệnh lý",
    title: "Bệnh lý",
    hint: "Soạn nội dung ba ngôn ngữ, trích dẫn và duyệt chuyên môn",
    min: "editor",
  },
  {
    key: "sources",
    label: "Tài liệu y khoa",
    title: "Tài liệu y khoa",
    hint: "Danh mục nguồn mà nội dung bệnh lý đang dựa vào",
    min: "editor",
  },
  {
    key: "users",
    label: "Tài khoản",
    title: "Tài khoản",
    hint: "Phân quyền và khoá tài khoản",
    min: "admin",
  },
  {
    key: "audit",
    label: "Nhật ký",
    title: "Nhật ký thao tác",
    hint: "Ai đã đổi gì, đổi lúc nào, giá trị trước khi đổi",
    min: "admin",
  },
];

/**
 * Khung của back office: kiểm tra quyền, điều hướng, và nạp số liệu tổng quan
 * một lần cho cả trang.
 *
 * Số liệu tổng quan nằm ở đây chứ không nằm trong tab "Bảng điều khiển" vì
 * thanh điều hướng cũng cần nó: con số "106 bài chưa duyệt" phải nhìn thấy
 * ngay cả khi đang đứng ở tab khác, nếu không thì việc tồn đọng sẽ trôi.
 */
export default function AdminShell() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<TabKey>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    const load = async () => {
      // Nhường một nhịp trước khi chạm vào state — xem chú thích cùng loại ở
      // `HomeNav`. Nhánh "không có token" bên dưới đặt state ngay lập tức nên
      // nếu không nhường thì lần dựng đầu render hai lượt liền.
      await Promise.resolve();
      if (!getToken()) {
        setUser(null);
        setChecking(false);
        return;
      }
      try {
        const result = await authRequest<{ user: AuthUser }>("/auth/me");
        setUser(result.user);
      } catch {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    void load();
    window.addEventListener(AUTH_CHANGED_EVENT, load);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, load);
  }, []);

  const refreshOverview = useCallback(async () => {
    try {
      const data = await adminApi.overview();
      setOverview(data);
    } catch {
      // Số liệu tổng quan hỏng thì các tab khác vẫn dùng được — không dựng rào
      // chắn cả trang chỉ vì một widget đếm số.
    }
  }, []);

  const allowed = hasAtLeast(user?.role, "editor");

  useEffect(() => {
    if (!allowed) return;
    // Cùng lý do với các panel: nhường một nhịp trong một hàm khai tại chỗ.
    async function run() {
      await Promise.resolve();
      await refreshOverview();
    }
    void run();
  }, [allowed, refreshOverview]);

  if (checking) {
    return (
      <div className="bo-gate">
        <div>
          <p>Đang kiểm tra quyền truy cập…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bo-gate">
        <div>
          <h1>Cần đăng nhập</h1>
          <p>Khu quản trị chỉ mở cho tài khoản có quyền biên tập trở lên.</p>
          <Link href="/dang-nhap">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="bo-gate">
        <div>
          <h1>Không đủ quyền</h1>
          <p>
            Tài khoản <b>{user.email}</b> đang ở mức <b>{user.role}</b>. Khu quản
            trị cần từ mức <b>editor</b> trở lên — liên hệ super admin để được
            cấp quyền.
          </p>
          <Link href="/">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const visibleTabs = TABS.filter((t) => hasAtLeast(user.role, t.min));
  const current = visibleTabs.find((t) => t.key === tab) ?? visibleTabs[0];

  /** Số việc còn tồn hiện cạnh tên tab. Không có số thì không hiện gì. */
  const badge = (key: TabKey) => {
    if (!overview) return null;
    if (key === "pathologies" && overview.content.needsReview > 0) {
      return overview.content.needsReview;
    }
    if (key === "sources" && overview.quality.unverifiedCitations > 0) {
      return overview.quality.unverifiedCitations;
    }
    if (key === "users" && overview.people.disabledUsers > 0) {
      return overview.people.disabledUsers;
    }
    return null;
  };

  return (
    <div className="bo">
      <aside className="bo-side">
        <div className="bo-brand">
          <b>Soma 3D</b>
          <span>Back office</span>
        </div>
        <nav className="bo-nav">
          {visibleTabs.map((t) => {
            const count = badge(t.key);
            return (
              <button
                key={t.key}
                type="button"
                className={t.key === current.key ? "is-on" : ""}
                onClick={() => setTab(t.key)}
              >
                <span>{t.label}</span>
                {count !== null && <em>{count}</em>}
              </button>
            );
          })}
        </nav>
        <div className="bo-me">
          <b>{user.name}</b>
          <span>{user.email}</span>
          <span className="bo-tag">{user.role}</span>
          <Link href="/">Xem trang ngoài</Link>
          <button
            type="button"
            onClick={() => {
              clearAuth();
              setUser(null);
            }}
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="bo-main">
        <header className="bo-head">
          <div>
            <h1>{current.title}</h1>
            <p>{current.hint}</p>
          </div>
        </header>
        <div className="bo-body">
          {current.key === "overview" && (
            <OverviewPanel data={overview} onRefresh={refreshOverview} />
          )}
          {current.key === "pathologies" && (
            <PathologyPanel role={user.role} onChanged={refreshOverview} />
          )}
          {current.key === "sources" && <SourcesPanel />}
          {current.key === "users" && (
            <UsersPanel me={user} onChanged={refreshOverview} />
          )}
          {current.key === "audit" && <AuditPanel />}
        </div>
      </main>
    </div>
  );
}
