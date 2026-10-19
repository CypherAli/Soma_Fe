"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useId, useRef } from "react";
import "./quiz-confirm-dialog.css";

export default function QuizConfirmDialog({
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);
  return <ContentSurface scope="src/components/quiz/QuizConfirmDialog.tsx">{(
    <dialog
      ref={ref}
      className="quiz-confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={onCancel}
      data-lenis-prevent
    >
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      <div>
        <button
          type="button"
          className="quiz-confirm-cancel"
          autoFocus
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="quiz-confirm-accept"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )}</ContentSurface>;
}
