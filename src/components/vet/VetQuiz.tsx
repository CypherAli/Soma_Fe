"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc } from "@/lib/homeContent";
import { recordAttempt } from "@/lib/study";
import { vetCopy, vetQuizCopy } from "@/lib/vet/copy";
import { SPECIES, speciesInfo } from "@/lib/vet/knowledge";
import { buildVetQuiz, vetQuizCapacity } from "@/lib/vet/quiz";
import type { VetSpeciesKey } from "@/lib/vet/types";

const COUNTS = [5, 10, 15];

/**
 * Trắc nghiệm của khu thú y.
 *
 * Cố ý KHÔNG nhồi thêm một nguồn đề vào `QuizRunner` bên người: bộ đó gắn chặt
 * với `sceneSlug`/`meshName` của mô hình 3D (mọi câu đều mở được cấu trúc trên
 * model), mà bên thú y chưa có model. Nhét vào sẽ phải bịa hai trường đó cho
 * mọi câu — đúng kiểu chắp vá mà rồi sẽ phải quay lại dọn.
 *
 * Lượt làm bài vẫn ghi vào tiến độ học chung (`recordAttempt`) để lịch sử của
 * người học là một dòng liền, không tách hai hệ.
 */
export default function VetQuiz({ locale }: { locale: Loc }) {
  const t = vetCopy(locale);
  const x = vetQuizCopy(locale);

  const [species, setSpecies] = useState<VetSpeciesKey | "all">("all");
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState<number | null>(null);
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const capacity = vetQuizCapacity(species);
  const items = useMemo(
    () => (seed === null ? [] : buildVetQuiz({ locale, count, seed, species })),
    [seed, locale, count, species],
  );
  const item = items[at];

  const start = () => {
    setSeed(Math.floor(Math.random() * 1e9));
    setAt(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const choose = (id: string) => {
    if (picked || !item) return;
    setPicked(id);
    if (item.options.find((o) => o.id === id)?.correct) setScore((s) => s + 1);
  };

  const advance = () => {
    if (at + 1 >= items.length) {
      setDone(true);
      // Ghi lượt làm bài; không chặn giao diện nếu máy chủ không trả lời.
      void recordAttempt({
        source: "vet",
        scope: species,
        mode: "practice",
        score,
        total: items.length,
      });
      return;
    }
    setAt(at + 1);
    setPicked(null);
  };

  return (
    <div className="bd animal-home">
      <IconSprite />
      <HomeNav section="vet" />

      <header className="vet-compare-head">
        <Link href="/dong-vat" className="vet-back">
          ← {x.back}
        </Link>
        <h1>{x.title}</h1>
        <p>{x.lead}</p>
      </header>

      {seed === null && (
        <section className="vet-quiz-setup">
          <div className="vet-filter">
            <button className={species === "all" ? "is-on" : ""} onClick={() => setSpecies("all")}>
              {x.all}
            </button>
            {SPECIES.map((s) => (
              <button
                key={s.key}
                className={species === s.key ? "is-on" : ""}
                onClick={() => setSpecies(s.key)}
              >
                {pick(s.name, locale)}
              </button>
            ))}
          </div>
          <div className="vet-filter">
            {COUNTS.filter((c) => c <= capacity).map((c) => (
              <button key={c} className={count === c ? "is-on" : ""} onClick={() => setCount(c)}>
                {x.countL}: {c}
              </button>
            ))}
          </div>
          <button className="pill pill-solid vet-quiz-start" onClick={start}>
            {x.start}
          </button>
        </section>
      )}

      {seed !== null && !done && item && (
        <section className="vet-quiz">
          <p className="vet-quiz-progress">{x.of(at + 1, items.length)}</p>
          <h2>{item.prompt}</h2>
          <p className="vet-quiz-q">{item.question}</p>
          <div className="vet-quiz-options">
            {item.options.map((o) => {
              const state = !picked ? "" : o.correct ? " is-right" : o.id === picked ? " is-wrong" : "";
              return (
                <button key={o.id} className={`vet-quiz-option${state}`} onClick={() => choose(o.id)}>
                  {o.text}
                </button>
              );
            })}
          </div>
          {picked && (
            <div className="vet-quiz-explain">
              <b>{item.options.find((o) => o.id === picked)?.correct ? x.correct : x.wrong}</b>
              <p>{item.explanation}</p>
              <p className="vet-source">
                {x.source}: {item.source}
              </p>
              <div className="vet-quiz-actions">
                <Link href={`/dong-vat/${item.speciesKey}`}>
                  {x.openSpecies} ({pick(speciesInfo(item.speciesKey).name, locale)}) →
                </Link>
                <button className="pill pill-solid" onClick={advance}>
                  {at + 1 >= items.length ? x.finish : x.next}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {done && (
        <section className="vet-quiz">
          <h2>{x.result(score, items.length)}</h2>
          <div className="vet-quiz-actions">
            <button className="pill pill-solid" onClick={start}>
              {x.again}
            </button>
            <Link href="/dong-vat">{t.backToSpecies} →</Link>
          </div>
        </section>
      )}

      <HomeFooter locale={locale} />
    </div>
  );
}
