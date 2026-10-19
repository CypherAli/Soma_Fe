"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useRef, useState } from "react";
import { quizImageSize } from "@/lib/anatomy/quizImageSizes";

export default function QuizSourceImages({
  urls,
  title,
  zoomLabel = "Phóng to hình",
  closeLabel = "Đóng hình",
}: {
  urls: string[];
  title: string;
  zoomLabel?: string;
  closeLabel?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected !== null && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [selected]);
  if (!urls.length) return null;
  return <ContentSurface scope="src/components/quiz/QuizSourceImages.tsx">{(
    <>
      <div className="dl-images">
        {urls.map((url, i) => (
          <figure key={url}>
            <button
              type="button"
              className="dl-figure-open"
              onClick={() => setSelected(i)}
              aria-label={`${zoomLabel} · ${title} ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                {...quizImageSize(url)}
                alt={`${title} · ${i + 1}`}
                loading="lazy"
              />
              <span className="dl-zoom-hint" aria-hidden="true">
                ⤢
              </span>
            </button>
          </figure>
        ))}
      </div>
      {selected !== null && (
        <dialog
          className="dl-image-dialog"
          ref={dialog}
          onCancel={() => setSelected(null)}
          onClose={() => setSelected(null)}
          aria-label={title}
          data-lenis-prevent
        >
          <div className="dl-image-dialog-bar">
            <span>
              {title} · {selected + 1}/{urls.length}
            </span>
            <button
              type="button"
              onClick={() => {
                dialog.current?.close();
                setSelected(null);
              }}
              aria-label={closeLabel}
            >
              ×
            </button>
          </div>
          <div className="dl-image-dialog-picture">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urls[selected]}
              {...quizImageSize(urls[selected])}
              alt={`${title} · ${selected + 1}`}
            />
          </div>
          {urls.length > 1 && (
            <nav>
              <button
                type="button"
                disabled={selected === 0}
                onClick={() => setSelected(selected - 1)}
              >
                ←
              </button>
              <button
                type="button"
                disabled={selected + 1 === urls.length}
                onClick={() => setSelected(selected + 1)}
              >
                →
              </button>
            </nav>
          )}
        </dialog>
      )}
    </>
  )}</ContentSurface>;
}
