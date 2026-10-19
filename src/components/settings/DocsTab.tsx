"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import { settingsContent as S } from "@/lib/settingsContent";
import { listDocs, deleteDoc, type PersonalDoc } from "@/lib/personalDocs";
import { Card, Notice, Skeleton, errorText } from "./parts";

/** Tài liệu PDF cá nhân — nguồn của bộ đề riêng ở trang Trắc nghiệm. */
export default function DocsTab({ locale }: { locale: Loc }) {
  const cmsContent = useContent();
  const S = cmsContent.resolve(cmsSourceS());

  const D = S.docs;
  const [docs, setDocs] = useState<PersonalDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listDocs()
      .then((result) => setDocs(result.docs))
      .catch((cause: unknown) => {
        setDocs([]);
        setError(errorText(cause));
      });
  }, []);

  async function remove(doc: PersonalDoc) {
    if (!window.confirm(pick(D.removeAsk, locale))) return;
    try {
      await deleteDoc(doc.id);
      setDocs((list) => (list ?? []).filter((item) => item.id !== doc.id));
    } catch (cause) {
      setError(errorText(cause));
    }
  }

  const statusLabel = (doc: PersonalDoc) =>
    pick(doc.status === "ready" ? D.ready : doc.status === "failed" ? D.failed : D.processing, locale);

  return <ContentSurface scope="src/components/settings/DocsTab.tsx">{(
    <Card title={pick(D.heading, locale)} note={pick(D.intro, locale)}>
      {error && <Notice kind="error">{error}</Notice>}

      {docs === null ? (
        <Skeleton rows={3} />
      ) : docs.length === 0 ? (
        <div className="st-empty">
          <b>{pick(D.empty, locale)}</b>
          <Link href="/quiz" className="st-btn primary">
            {pick(D.upload, locale)} →
          </Link>
        </div>
      ) : (
        <div className="st-table-wrap" data-lenis-prevent>
          <table className="st-table">
            <thead>
              <tr>
                <th>{pick(D.colFile, locale)}</th>
                <th>{pick(D.colPages, locale)}</th>
                <th>{pick(D.colQuestions, locale)}</th>
                <th>{pick(D.colStatus, locale)}</th>
                <th aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <b>{doc.filename}</b>
                    <em>{(doc.bytes / 1024 / 1024).toFixed(1)} MB</em>
                  </td>
                  <td className="st-num">{doc.pages}</td>
                  <td className="st-num">
                    {doc.questionCount}
                    <em>
                      {doc.approvedCount} {pick(D.approved, locale)}
                    </em>
                  </td>
                  <td>
                    <span className={`st-tag ${doc.status}`}>{statusLabel(doc)}</span>
                  </td>
                  <td>
                    <button type="button" className="st-btn small danger" onClick={() => void remove(doc)}>
                      {pick(D.remove, locale)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )}</ContentSurface>;
}

function cmsSourceS() { return S; }
