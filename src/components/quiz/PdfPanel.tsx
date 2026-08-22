"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveAll,
  askAiForQuestions,
  deleteDoc,
  deleteQuestion,
  docQuestions,
  editQuestion,
  listDocs,
  uploadPdf,
  type PersonalDoc,
  type PersonalQuestion,
} from "@/lib/personalDocs";
import { AUTH_CHANGED_EVENT } from "@/lib/auth";
import { isSignedIn } from "@/lib/study";
import type { QuizText } from "./quizText";
import SignInGate from "./SignInGate";

const MAX_BYTES = 25 * 1024 * 1024;

/**
 * HỌC TỪ PDF — tải tài liệu lên, máy chủ bóc đề, người tải lên DUYỆT rồi mới học.
 *
 * Bước duyệt không phải thủ tục cho có: bóc đề từ PDF không bao giờ đúng hết,
 * mà sai một dấu trong câu giải phẫu là học sai luôn. Vì vậy câu mới bóc nằm ở
 * trạng thái chờ, và chỉ câu đã duyệt mới vào nguồn đề "Đề của tôi".
 */
export default function PdfPanel({ t, onBankChanged }: { t: QuizText; onBankChanged: () => void }) {
  const [signedIn, setSignedIn] = useState(false);
  const [docs, setDocs] = useState<PersonalDoc[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  /**
   * Tài liệu bộ luật vừa bó tay, kèm văn bản của nó.
   *
   * Giữ ở đây chứ không gửi thẳng cho AI: văn bản này đi ra dịch vụ ngoài, nên
   * phải do người tải lên bấm nút — trang đang hứa "chỉ tài khoản của bạn truy
   * cập", tự động gửi đi là phá lời hứa đó mà họ không hề biết.
   */
  const [needsAi, setNeedsAi] = useState<{ id: string; text: string } | null>(null);
  const [questions, setQuestions] = useState<PersonalQuestion[] | null>(null);

  const refresh = useCallback(async () => {
    await Promise.resolve();
    if (!isSignedIn()) {
      setSignedIn(false);
      return;
    }
    setSignedIn(true);
    try {
      setDocs((await listDocs()).docs);
    } catch {
      setDocs([]);
    }
  }, []);

  useEffect(() => {
    async function sync() {
      await Promise.resolve();
      await refresh();
    }
    void sync();
    // Đăng nhập/đăng xuất ở thanh điều hướng thì danh sách tài liệu phải đổi
    // theo ngay, không bắt người dùng tải lại trang.
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, sync);
  }, [refresh]);

  const upload = async () => {
    if (!file || busy) return;
    if (file.size > MAX_BYTES) { setStatus(t.pdfTooBig); return; }
    setBusy(true);
    setStatus(t.pdfUploading);
    try {
      const result = await uploadPdf(file);
      setStatus(result.doc.note ?? t.pdfResult(result.parsed, result.missingAnswer + result.malformed));
      setFile(null);
      setNeedsAi(!result.parsed && result.text ? { id: result.doc.id, text: result.text } : null);
      await refresh();
      if (result.parsed) setOpenDoc(result.doc.id);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  /** Nạp các câu của một tài liệu để duyệt. */
  const loadQuestions = useCallback(async (id: string) => {
    await Promise.resolve();
    try {
      setQuestions((await docQuestions(id)).questions);
    } catch {
      setQuestions([]);
    }
  }, []);

  useEffect(() => {
    if (!openDoc) return;
    async function open(id: string) {
      // Xoá danh sách cũ SAU khi nhường một nhịp, không thì đây là setState
      // đồng bộ ngay trong thân effect.
      await Promise.resolve();
      setQuestions(null);
      await loadQuestions(id);
    }
    void open(openDoc);
  }, [openDoc, loadQuestions]);

  const patch = async (id: string, change: Partial<PersonalQuestion>) => {
    try {
      const updated = await editQuestion(id, change);
      setQuestions((prev) => prev?.map((q) => (q.id === updated.id ? updated : q)) ?? prev);
      onBankChanged();
      void refresh();
    } catch (error) {
      setStatus((error as Error).message || t.pdfSaveFailed);
    }
  };

  const removeQuestion = async (id: string) => {
    await deleteQuestion(id).catch(() => undefined);
    setQuestions((prev) => prev?.filter((q) => q.id !== id) ?? prev);
    onBankChanged();
    void refresh();
  };

  /** Nhờ AI đọc lại tài liệu bộ luật không bóc được. Chỉ chạy khi người dùng bấm. */
  const retryWithAi = async () => {
    if (!needsAi || busy) return;
    setBusy(true);
    setStatus(t.pdfAiWorking);
    try {
      const result = await askAiForQuestions(needsAi.id, needsAi.text);
      setStatus(result.note ?? t.pdfResult(result.parsed, 0));
      setNeedsAi(null);
      await refresh();
      if (result.parsed) setOpenDoc(needsAi.id);
    } catch (error) {
      setStatus((error as Error).message || t.pdfAiFailed);
    } finally {
      setBusy(false);
    }
  };

  if (!signedIn) return <SignInGate t={t} />;

  if (openDoc && questions) {
    const doc = docs?.find((d) => d.id === openDoc);
    const pending = questions.filter((q) => !q.approved).length;
    return (
      <section className="quiz-pdf-review">
        <header>
          <button type="button" className="quiz-link" onClick={() => { setOpenDoc(null); setQuestions(null); }}>
            {t.pdfBack}
          </button>
          <h2>{doc?.filename}</h2>
          <p>
            {t.pdfApprovedCount(questions.length - pending)} · {t.pdfPending(pending)}
          </p>
          <button type="button" className="quiz-start" disabled={!pending}
            onClick={async () => {
              const r = await approveAll(openDoc).catch(() => null);
              if (r) setStatus(t.pdfApproveResult(r.approved, r.skipped));
              await loadQuestions(openDoc);
              onBankChanged();
              void refresh();
            }}>
            {t.pdfApproveAll}
          </button>
        </header>
        {status && <p className="quiz-srcnote" role="status">{status}</p>}

        <ol className="quiz-pdf-questions">
          {questions.map((q) => (
            <li key={q.id} className={q.approved ? "ok" : ""}>
              <textarea defaultValue={q.stem} rows={2} aria-label={t.pdfReview}
                onBlur={(e) => e.target.value !== q.stem && void patch(q.id, { stem: e.target.value })} />
              <ul>
                {Object.entries(q.options).map(([letter, text]) => (
                  <li key={letter} className={letter === q.answer ? "right" : ""}>
                    <kbd>{letter}</kbd>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="quiz-pdf-row">
                <label>
                  <span>{t.pdfAnswerLabel}</span>
                  <select value={q.answer} onChange={(e) => void patch(q.id, { answer: e.target.value })}>
                    {Object.keys(q.options).map((letter) => (
                      <option key={letter} value={letter}>{letter}</option>
                    ))}
                  </select>
                </label>
                {q.page && <span className="quiz-srcnote">tr.{q.page}</span>}
                {q.origin === "ai" && <span className="quiz-pdf-aitag">{t.pdfAiTag}</span>}
                <button type="button" onClick={() => void patch(q.id, { approved: !q.approved })}>
                  {q.approved ? t.pdfUnapprove : t.pdfApprove}
                </button>
                <button type="button" className="quiz-danger" onClick={() => void removeQuestion(q.id)}>
                  {t.pdfRemove}
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="quiz-pdf-import">
      <div>
        <span>{t.pdfKicker}</span>
        <h2>{t.pdfTitle}</h2>
        <p>{t.pdfLead}</p>
        <ul><li>{t.pdfB1}</li><li>{t.pdfB2}</li><li>{t.pdfB3}</li></ul>
        <p className="quiz-srcnote">{t.pdfNoteHelp}</p>
      </div>

      <div className="quiz-pdf-drop">
        <input id="personal-pdf" type="file" accept="application/pdf"
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); setStatus(""); }} />
        <label htmlFor="personal-pdf">
          <b>{file ? file.name : t.pdfChoose}</b>
          <span>{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : t.pdfHint}</span>
        </label>
        <button type="button" disabled={!file || busy} onClick={() => void upload()}>
          {busy ? t.pdfUploading : t.pdfAnalyse}
        </button>
        {status && <p role="status">{status}</p>}

        {needsAi && (
          <div className="quiz-pdf-ai">
            <b>{t.pdfAiOffer}</b>
            <p>{t.pdfAiWarning}</p>
            <button type="button" disabled={busy} onClick={() => void retryWithAi()}>
              {busy ? t.pdfAiWorking : t.pdfAiAsk}
            </button>
          </div>
        )}

        <b className="quiz-progress-h">{t.pdfDocs}</b>
        {docs && docs.length ? (
          <ul className="quiz-pdf-docs">
            {docs.map((d) => (
              <li key={d.id}>
                <button type="button" className="quiz-link" onClick={() => setOpenDoc(d.id)}>
                  {d.filename}
                </button>
                <span>
                  {d.status === "failed"
                    ? t.pdfStatusFailed
                    : `${t.pdfApprovedCount(d.approvedCount)} · ${t.pdfPending(d.questionCount - d.approvedCount)}`}
                </span>
                <button type="button" className="quiz-danger"
                  onClick={async () => {
                    if (!window.confirm(t.pdfDeleteConfirm)) return;
                    await deleteDoc(d.id).catch(() => undefined);
                    onBankChanged();
                    void refresh();
                  }}>
                  {t.pdfDeleteDoc}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="quiz-srcnote">{t.pdfNone}</p>
        )}
      </div>
    </section>
  );
}
