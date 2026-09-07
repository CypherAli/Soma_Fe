"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminApi,
  LOCALES,
  type Locale3,
  type MedicalSource,
  type PathologyContent,
  type PathologyDetail,
} from "@/lib/admin";

/** Năm mục nội dung của một bài bệnh học, đúng thứ tự trang bệnh lý hiển thị. */
const FIELDS: {
  key: keyof Omit<PathologyContent, "id" | "locale" | "machineTranslated">;
  label: string;
}[] = [
  { key: "description", label: "Đại cương" },
  { key: "clinical", label: "Lâm sàng & cận lâm sàng" },
  { key: "imaging", label: "Chẩn đoán hình ảnh" },
  { key: "progression", label: "Tiến triển & biến chứng" },
  { key: "treatment", label: "Điều trị tham khảo" },
];

/** Bản nháp của MỘT ngôn ngữ: năm ô chữ, cộng cờ dịch máy. */
type TextField = (typeof FIELDS)[number]["key"];
type Draft = Record<TextField, string> & { machineTranslated: boolean };

const emptyDraft = (): Draft => ({
  description: "",
  clinical: "",
  imaging: "",
  progression: "",
  treatment: "",
  machineTranslated: false,
});

function toDraft(content: PathologyContent | undefined): Draft {
  if (!content) return emptyDraft();
  return {
    description: content.description ?? "",
    clinical: content.clinical ?? "",
    imaging: content.imaging ?? "",
    progression: content.progression ?? "",
    treatment: content.treatment ?? "",
    machineTranslated: content.machineTranslated,
  };
}

/**
 * Ngăn soạn một bài bệnh học.
 *
 * Bản nháp giữ RIÊNG cho từng ngôn ngữ và chỉ gửi đi khi bấm lưu: đổi tab ngôn
 * ngữ giữa chừng mà mất chữ đang gõ là mất công của người soạn, còn tự lưu theo
 * từng phím thì mỗi lần gõ lại đẻ ra một dòng nhật ký vô nghĩa.
 */
export default function PathologyDrawer({
  id,
  canReview,
  onClose,
  onSaved,
}: {
  id: string;
  canReview: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [data, setData] = useState<PathologyDetail | null>(null);
  const [locale, setLocale] = useState<Locale3>("vi");
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [sources, setSources] = useState<MedicalSource[]>([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  /**
   * Bản nháp phần THUỘC TÍNH (tên, ICD, mức độ…), tách khỏi nháp nội dung.
   *
   * `null` = chưa mở khung sửa. Không đổ sẵn từ `data` ngay khi nạp: mở bài nào
   * cũng thấy một loạt ô nhập là mời gõ nhầm, mà ở đây gõ nhầm là sai dữ liệu y
   * khoa chứ không phải sai một cái nhãn.
   */
  const [meta, setMeta] = useState<{
    nameVi: string;
    nameEn: string;
    nameZh: string;
    icdCode: string;
    severity: string;
    clinicalSystem: string;
    source: string;
    sourcePage: string;
  } | null>(null);

  const [citeSource, setCiteSource] = useState("");
  const [citePage, setCitePage] = useState("");
  const [citeQuote, setCiteQuote] = useState("");

  const load = useCallback(async () => {
    // Nhường một nhịp trước khi chạm vào state, đúng quy ước đã dùng ở
    // `HomeNav`: gọi setState ĐỒNG BỘ trong thân effect thì React Compiler báo
    // lỗi "cascading renders", và cảnh báo đó đúng — lần dựng đầu sẽ render hai
    // lượt liền.
    await Promise.resolve();
    try {
      const detail = await adminApi.pathology(id);
      setData(detail);
      setError("");
      setDrafts(
        Object.fromEntries(
          LOCALES.map((l) => [
            l,
            toDraft(detail.content.find((c) => c.locale === l)),
          ]),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không nạp được bệnh lý");
    }
  }, [id]);

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
      .sources()
      .then(setSources)
      .catch(() => setSources([]));
  }, []);

  // Escape để đóng: người soạn dùng bàn phím là chính, với tay ra chuột để đóng
  // một ngăn là quãng đường thừa lặp lại vài trăm lần một buổi.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!data) {
    return (
      <div className="bo-drawer">
        <button type="button" aria-label="Đóng" onClick={onClose} />
        <section>
          <header>
            <h2>{error ? "Lỗi" : "Đang nạp…"}</h2>
          </header>
          <div className="bo-body">
            {error && <p className="bo-msg err">{error}</p>}
          </div>
        </section>
      </div>
    );
  }

  const draft = drafts[locale] ?? emptyDraft();
  const setText = (key: TextField, value: string) =>
    setDrafts((all) => ({ ...all, [locale]: { ...draft, [key]: value } }));
  const setMachine = (value: boolean) =>
    setDrafts((all) => ({
      ...all,
      [locale]: { ...draft, machineTranslated: value },
    }));

  const saveContent = async () => {
    setSaving(true);
    setError("");
    setNote("");
    try {
      await adminApi.saveContent(id, locale, {
        description: draft.description,
        clinical: draft.clinical,
        imaging: draft.imaging,
        progression: draft.progression,
        treatment: draft.treatment,
        machineTranslated: draft.machineTranslated,
      });
      setNote(`Đã lưu bản ${locale}.`);
      await load();
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được");
    } finally {
      setSaving(false);
    }
  };

  const act = async (run: () => Promise<unknown>, ok: string) => {
    setError("");
    setNote("");
    try {
      await run();
      setNote(ok);
      await load();
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Thao tác không thành công");
    }
  };

  return (
    <div className="bo-drawer">
      <button type="button" aria-label="Đóng" onClick={onClose} />
      <section>
        <header>
          <div>
            <h2>{data.nameVi}</h2>
            <p>
              {data.slug}
              {data.icdCode ? ` · ICD ${data.icdCode}` : ""}
              {data.clinicalSystem ? ` · ${data.clinicalSystem}` : ""}
            </p>
          </div>
          <button type="button" className="bo-btn small" onClick={onClose}>
            Đóng
          </button>
        </header>

        <div className="bo-body">
          {error && <p className="bo-msg err">{error}</p>}
          {note && <p className="bo-msg ok">{note}</p>}

          <div className="bo-bar">
            <span
              className={`bo-tag ${data.needsReview ? "warn" : "good"}`}
              style={{ padding: "6px 10px" }}
            >
              {data.needsReview ? "Chưa có người duyệt" : "Đã duyệt chuyên môn"}
            </span>
            {canReview && (
              <button
                type="button"
                className="bo-btn small"
                onClick={() =>
                  act(
                    () => adminApi.setReviewed(id, !data.needsReview),
                    data.needsReview
                      ? "Đã đánh dấu duyệt."
                      : "Đã trả về hàng chờ duyệt.",
                  )
                }
              >
                {data.needsReview ? "Đánh dấu đã duyệt" : "Trả về chờ duyệt"}
              </button>
            )}
            <a
              className="bo-btn small"
              href={`/benh-ly?slug=${data.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem ngoài trang
            </a>
          </div>

          <section className="bo-section" style={{ marginTop: 8 }}>
            <h2>Thuộc tính bài bệnh</h2>
            {meta === null ? (
              <div className="bo-cite">
                <span>
                  Mức độ: <b>{data.severity ?? "chưa đặt"}</b> · ICD:{" "}
                  <b>{data.icdCode ?? "chưa có"}</b> · Hệ lâm sàng:{" "}
                  <b>{data.clinicalSystem ?? "chưa xếp"}</b>
                </span>
                <span>
                  Nguồn: {data.source}
                  {data.sourcePage ? ` · tr. ${data.sourcePage}` : ""}
                </span>
                <span>
                  Neo tổn thương 3D:{" "}
                  <b>{data.lesionMesh ?? "chưa neo"}</b>
                  {data.lesionSystem ? ` (${data.lesionSystem})` : ""} — chỉ sửa
                  được bằng dữ liệu nguồn rồi chạy <code>npm run verify:lesions</code>,
                  vì tên mesh phải khớp đúng model glTF.
                </span>
                <footer>
                  <button
                    type="button"
                    className="bo-btn small"
                    onClick={() =>
                      setMeta({
                        nameVi: data.nameVi,
                        nameEn: data.nameEn,
                        nameZh: data.nameZh,
                        icdCode: data.icdCode ?? "",
                        severity: data.severity ?? "",
                        clinicalSystem: data.clinicalSystem ?? "",
                        source: data.source,
                        sourcePage: data.sourcePage?.toString() ?? "",
                      })
                    }
                  >
                    Sửa thuộc tính
                  </button>
                </footer>
              </div>
            ) : (
              <div className="bo-cite">
                {(
                  [
                    ["nameVi", "Tên tiếng Việt"],
                    ["nameEn", "Tên tiếng Anh"],
                    ["nameZh", "Tên tiếng Trung"],
                    ["icdCode", "Mã ICD-11"],
                    ["clinicalSystem", "Hệ lâm sàng"],
                    ["source", "Nguồn (chữ)"],
                    ["sourcePage", "Trang nguồn"],
                  ] as const
                ).map(([key, label]) => (
                  <div className="bo-field" key={key}>
                    <label htmlFor={`m-${key}`}>{label}</label>
                    <input
                      id={`m-${key}`}
                      className="bo-input"
                      value={meta[key]}
                      onChange={(event) =>
                        setMeta({ ...meta, [key]: event.target.value })
                      }
                    />
                  </div>
                ))}
                <div className="bo-field">
                  <label htmlFor="m-severity">Mức độ ưu tiên hiển thị</label>
                  <select
                    id="m-severity"
                    className="bo-select"
                    value={meta.severity}
                    onChange={(event) =>
                      setMeta({ ...meta, severity: event.target.value })
                    }
                  >
                    <option value="">— chưa đặt —</option>
                    <option value="info">info — thông tin</option>
                    <option value="warning">warning — cần lưu ý</option>
                    <option value="critical">critical — nguy kịch</option>
                  </select>
                </div>
                <footer>
                  <button
                    type="button"
                    className="bo-btn primary"
                    onClick={() =>
                      act(async () => {
                        await adminApi.updatePathology(id, {
                          nameVi: meta.nameVi,
                          nameEn: meta.nameEn,
                          nameZh: meta.nameZh,
                          // Ô để trống nghĩa là "không có", gửi `undefined` thì
                          // DTO bỏ qua và giá trị cũ ở lại — người sửa tưởng đã
                          // xoá mà thực ra chưa.
                          icdCode: meta.icdCode.trim() || undefined,
                          severity:
                            (meta.severity as PathologyDetail["severity"]) ||
                            undefined,
                          clinicalSystem:
                            meta.clinicalSystem.trim() || undefined,
                          source: meta.source,
                          sourcePage: meta.sourcePage
                            ? Number(meta.sourcePage)
                            : undefined,
                        });
                        setMeta(null);
                      }, "Đã lưu thuộc tính.")
                    }
                  >
                    Lưu thuộc tính
                  </button>
                  <button
                    type="button"
                    className="bo-btn"
                    onClick={() => setMeta(null)}
                  >
                    Huỷ
                  </button>
                </footer>
              </div>
            )}
          </section>

          <section className="bo-section">
            <h2>Nội dung theo ngôn ngữ</h2>
            <div className="bo-locale-tabs">
              {LOCALES.map((l) => {
                const existing = data.content.find((c) => c.locale === l);
                return (
                  <button
                    key={l}
                    type="button"
                    className={l === locale ? "is-on" : ""}
                    onClick={() => setLocale(l)}
                  >
                    {l}
                    <span
                      className={`bo-tag ${
                        !existing
                          ? "bad"
                          : existing.machineTranslated
                            ? "warn"
                            : "good"
                      }`}
                    >
                      {!existing
                        ? "trống"
                        : existing.machineTranslated
                          ? "dịch máy"
                          : "đã soạn"}
                    </span>
                  </button>
                );
              })}
            </div>

            {FIELDS.map((field) => (
              <div className="bo-field" key={field.key}>
                <label htmlFor={`f-${field.key}`}>{field.label}</label>
                <textarea
                  id={`f-${field.key}`}
                  className="bo-textarea"
                  value={draft[field.key]}
                  onChange={(event) => setText(field.key, event.target.value)}
                />
              </div>
            ))}

            <label className="bo-check">
              <input
                type="checkbox"
                checked={draft.machineTranslated}
                onChange={(event) => setMachine(event.target.checked)}
              />
              Đây là bản dịch máy chưa có người chuyên môn duyệt
            </label>
            <p
              style={{
                margin: "6px 0 12px",
                color: "var(--bo-muted)",
                fontSize: 11.5,
              }}
            >
              Cờ này đi thẳng ra băng cảnh báo mà người đọc nhìn thấy. Chỉ bỏ
              tick khi đã thật sự đọc lại và chịu trách nhiệm về nội dung.
            </p>

            <button
              type="button"
              className="bo-btn primary"
              disabled={saving}
              onClick={saveContent}
            >
              {saving ? "Đang lưu…" : `Lưu bản ${locale}`}
            </button>
          </section>

          <section className="bo-section">
            <h2>Trích dẫn ({data.citations.length})</h2>
            {data.citations.map((cite) => (
              <div className="bo-cite" key={cite.id}>
                <b>{cite.source.title}</b>
                <span>
                  {cite.source.publisher}
                  {cite.source.year ? ` · ${cite.source.year}` : ""}
                  {cite.pageOrSection ? ` · ${cite.pageOrSection}` : ""}
                </span>
                {cite.quote && <blockquote>{cite.quote}</blockquote>}
                <footer>
                  <span className={`bo-tag ${cite.verified ? "good" : "warn"}`}>
                    {cite.verified
                      ? `đã đối chiếu — ${cite.verifiedBy}`
                      : "chưa ai đối chiếu"}
                  </span>
                  {canReview && (
                    <>
                      <button
                        type="button"
                        className="bo-btn small"
                        onClick={() =>
                          act(
                            () =>
                              adminApi.verifyCitation(cite.id, !cite.verified),
                            cite.verified
                              ? "Đã bỏ dấu đối chiếu."
                              : "Đã ghi nhận đối chiếu.",
                          )
                        }
                      >
                        {cite.verified ? "Bỏ đối chiếu" : "Xác nhận đã đối chiếu"}
                      </button>
                      <button
                        type="button"
                        className="bo-btn small danger"
                        onClick={() => {
                          if (!confirm("Xoá trích dẫn này?")) return;
                          void act(
                            () => adminApi.removeCitation(cite.id),
                            "Đã xoá trích dẫn.",
                          );
                        }}
                      >
                        Xoá
                      </button>
                    </>
                  )}
                </footer>
              </div>
            ))}

            <form
              className="bo-cite"
              onSubmit={(event) => {
                event.preventDefault();
                if (!citeSource) return;
                void act(async () => {
                  await adminApi.addCitation(id, {
                    sourceId: citeSource,
                    pageOrSection: citePage || undefined,
                    quote: citeQuote || undefined,
                  });
                  setCiteSource("");
                  setCitePage("");
                  setCiteQuote("");
                }, "Đã thêm trích dẫn.");
              }}
            >
              <b>Thêm trích dẫn</b>
              <select
                className="bo-select"
                value={citeSource}
                onChange={(event) => setCiteSource(event.target.value)}
                required
              >
                <option value="">— chọn tài liệu —</option>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.title}
                    {source.year ? ` (${source.year})` : ""}
                  </option>
                ))}
              </select>
              <input
                className="bo-input"
                placeholder='Trang hoặc mục, ví dụ "tr. 214"'
                value={citePage}
                onChange={(event) => setCitePage(event.target.value)}
              />
              <textarea
                className="bo-textarea"
                style={{ minHeight: 64 }}
                placeholder="Trích nguyên văn để người sau đối chiếu (không bắt buộc)"
                value={citeQuote}
                onChange={(event) => setCiteQuote(event.target.value)}
              />
              <div>
                <button type="submit" className="bo-btn">
                  Thêm
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </div>
  );
}
