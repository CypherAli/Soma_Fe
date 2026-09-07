"use client";

import type { Overview } from "@/lib/admin";

const LOCALE_NAME: Record<string, string> = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "中文",
};

const ACTION_NAME: Record<string, string> = {
  create: "tạo",
  update: "sửa",
  delete: "xoá",
  verify: "duyệt",
  role_change: "đổi quyền",
  disable: "khoá",
  enable: "mở khoá",
};

function Card({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: number;
  note?: string;
  tone?: "good" | "warn" | "bad";
}) {
  return (
    <div className="bo-card">
      <small>{label}</small>
      <b>{value.toLocaleString("vi-VN")}</b>
      {note && <i className={tone}>{note}</i>}
    </div>
  );
}

/**
 * Bảng điều khiển.
 *
 * Mỗi thẻ số kèm một dòng nói về phần CÒN THIẾU của chính con số đó. "106 bệnh
 * lý" là một lời khoe; "106 bệnh lý — 106 bài chưa ai duyệt" mới là một việc
 * phải làm, và đó mới là thứ người ngồi đây cần thấy.
 */
export default function OverviewPanel({
  data,
  onRefresh,
}: {
  data: Overview | null;
  onRefresh: () => void;
}) {
  if (!data) {
    return <p className="bo-empty">Đang nạp số liệu…</p>;
  }

  const { content, locales, quality, people, recentAudit } = data;
  const verified = quality.citations - quality.unverifiedCitations;

  return (
    <>
      <div className="bo-bar">
        <button type="button" className="bo-btn small" onClick={onRefresh}>
          Nạp lại số liệu
        </button>
      </div>

      <div className="bo-cards">
        <Card
          label="Bệnh lý"
          value={content.pathologies}
          note={
            content.needsReview > 0
              ? `${content.needsReview} bài chưa ai duyệt`
              : "đã duyệt hết"
          }
          tone={content.needsReview > 0 ? "warn" : "good"}
        />
        <Card
          label="Trích dẫn"
          value={quality.citations}
          note={
            quality.unverifiedCitations > 0
              ? `${verified} đã đối chiếu / ${quality.citations}`
              : "đã đối chiếu hết"
          }
          tone={quality.unverifiedCitations > 0 ? "warn" : "good"}
        />
        <Card
          label="Cấu trúc giải phẫu"
          value={content.structures}
          note={`${content.systems} hệ · ${content.species} loài`}
        />
        <Card
          label="Tài liệu y khoa"
          value={content.sources}
          note={
            quality.pathologiesWithoutCitation > 0
              ? `${quality.pathologiesWithoutCitation} bệnh chưa có nguồn`
              : "mọi bệnh đều có nguồn"
          }
          tone={quality.pathologiesWithoutCitation > 0 ? "bad" : "good"}
        />
        <Card
          label="Neo tổn thương 3D"
          value={content.pathologies - quality.pathologiesWithoutLesion}
          note={`${quality.pathologiesWithoutLesion} bệnh chưa neo vào mesh`}
        />
        <Card
          label="Tài khoản"
          value={people.users}
          note={
            people.disabledUsers > 0
              ? `${people.disabledUsers} đang bị khoá`
              : "không có tài khoản bị khoá"
          }
          tone={people.disabledUsers > 0 ? "warn" : undefined}
        />
        <Card label="Lượt làm bài đã nộp" value={people.attempts} />
        <Card label="Câu hỏi trong DB" value={content.quizQuestions} />
      </div>

      <section className="bo-section">
        <h2>Độ phủ nội dung theo ngôn ngữ</h2>
        <div className="bo-cards">
          {locales.map((row) => {
            const percent = content.pathologies
              ? Math.round((row.filled / content.pathologies) * 100)
              : 0;
            return (
              <div className="bo-meter" key={row.locale}>
                <header>
                  <span>{LOCALE_NAME[row.locale] ?? row.locale}</span>
                  <b>
                    {row.filled}/{content.pathologies}
                  </b>
                </header>
                <div>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <small style={{ color: "var(--bo-muted)", fontSize: 11 }}>
                  {row.missing > 0
                    ? `còn thiếu ${row.missing} bài`
                    : "đủ cả bộ"}
                </small>
              </div>
            );
          })}
        </div>
        {quality.machineTranslated > 0 && (
          <p
            style={{
              marginTop: 10,
              color: "var(--bo-muted)",
              fontSize: 12,
            }}
          >
            {quality.machineTranslated} bản ghi đang mang cờ <b>dịch máy</b> —
            người đọc thấy băng cảnh báo cho tới khi có người chuyên môn đọc lại
            và tắt cờ trong tab Bệnh lý.
          </p>
        )}
      </section>

      <section className="bo-section">
        <h2>Thao tác gần đây</h2>
        {recentAudit.length === 0 ? (
          <div className="bo-table-wrap">
            <p className="bo-empty">Chưa có thao tác nào được ghi lại.</p>
          </div>
        ) : (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Lúc</th>
                  <th>Người làm</th>
                  <th>Việc</th>
                  <th>Đối tượng</th>
                </tr>
              </thead>
              <tbody>
                {recentAudit.map((entry) => (
                  <tr key={entry.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(entry.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td>{entry.actorEmail}</td>
                    <td>
                      <span className="bo-tag">
                        {ACTION_NAME[entry.action] ?? entry.action}
                      </span>
                    </td>
                    <td>
                      <strong>{entry.entityLabel ?? entry.entityId}</strong>
                      <em>{entry.entity}</em>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
