"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc } from "@/lib/homeContent";
import { itemKeyOf, recordAttempt } from "@/lib/study";
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
  /* Đáp án đã chọn của TỪNG câu, không phải một ô nhớ dùng lại. Bản trước giữ
     một `picked` và một `score` cộng dồn, nên lúc nộp bài `score` trong closure
     vẫn là giá trị TRƯỚC khi câu cuối được cộng — trả lời đúng câu cuối mà điểm
     gửi lên máy chủ vẫn thiếu một. Giữ mảng rồi tính điểm ra thì không có trạng
     thái nào để lệch. */
  const [picked, setPicked] = useState<(string | null)[]>([]);
  const [done, setDone] = useState(false);
  const startedAt = useRef<number | null>(null);
  const recordedSeed = useRef<number | null>(null);

  const capacity = vetQuizCapacity(species);
  const items = useMemo(
    () => (seed === null ? [] : buildVetQuiz({ locale, count, seed, species })),
    [seed, locale, count, species],
  );
  const item = items[at];
  const pick0 = picked[at] ?? null;
  const score = items.reduce(
    (n, it, i) => n + (it.options.find((o) => o.id === picked[i])?.correct ? 1 : 0),
    0,
  );

  const start = () => {
    setSeed(Math.floor(Math.random() * 1e9));
    setAt(0);
    setPicked([]);
    setDone(false);
    startedAt.current = Date.now();
  };

  const choose = (id: string) => {
    if (pick0 || !item) return;
    setPicked((prev) => {
      const next = [...prev];
      next[at] = id;
      return next;
    });
  };

  const advance = () => {
    if (at + 1 >= items.length) return setDone(true);
    setAt(at + 1);
  };

  /**
   * Nộp bài xong thì ghi lượt VÀ kết quả từng câu.
   *
   * Phải gửi `items` thì máy chủ mới xếp được lịch ôn (đúng thì giãn ra, sai thì
   * kéo về hôm sau). Bản trước chỉ gửi mỗi điểm tổng, nên câu thú y không bao
   * giờ vào hàng đợi ôn tập — lộ trình học coi như không biết khu thú y tồn tại.
   *
   * Khoá ôn lấy theo `factId` chứ không theo `id` của câu: cùng một mục kiến
   * thức có thể sinh ra nhiều dạng câu hỏi khác nhau, mà thứ người học cần gặp
   * lại là MỤC ấy, không phải một cách hỏi cụ thể.
   *
   * `recordedSeed` chặn ghi trùng vì effect chạy lại mỗi khi `score` đổi.
   */
  useEffect(() => {
    if (!done || seed === null || recordedSeed.current === seed || !items.length) return;
    recordedSeed.current = seed;
    void recordAttempt({
      source: "vet",
      scope: species,
      mode: "practice",
      score,
      total: items.length,
      seconds: startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0,
      items: items.map((it, i) => ({
        itemKey: itemKeyOf("vet", it.factId),
        source: "vet",
        scope: species,
        correct: !!it.options.find((o) => o.id === picked[i])?.correct,
      })),
    });
    // `picked` cố ý không nằm trong danh sách phụ thuộc: nó đã đứng yên khi
    // `done` bật lên, thêm vào chỉ khiến effect chạy lại vô ích.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, seed, items, score, species]);

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
              const state = !pick0 ? "" : o.correct ? " is-right" : o.id === pick0 ? " is-wrong" : "";
              return (
                <button key={o.id} className={`vet-quiz-option${state}`} onClick={() => choose(o.id)}>
                  {o.text}
                </button>
              );
            })}
          </div>
          {pick0 && (
            <div className="vet-quiz-explain">
              <b>{item.options.find((o) => o.id === pick0)?.correct ? x.correct : x.wrong}</b>
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
