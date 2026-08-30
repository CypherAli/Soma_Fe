"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { pick, type Loc } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import { allVetFacts } from "@/lib/vet/knowledge";
import type { VetModel } from "@/lib/vet/types";
import type { SceneHotspot } from "./VetModelScene";

const VetModelScene = dynamic(() => import("./VetModelScene"), {
  ssr: false,
  loading: () => <div className="vet-model-loading" />,
});

/**
 * Khung xem một mẫu vật thú y.
 *
 * Giấy phép, ghi công và đường dẫn tới bản gốc nằm NGAY dưới khung xem, không
 * giấu trong trang "nguồn dữ liệu": mọi mẫu ở đây đều là CC BY, mà CC BY bắt
 * buộc ghi công ở nơi người xem thấy được. Kiểu `VetModel` để ba trường ấy là
 * bắt buộc chính vì vậy.
 */
export default function VetModelViewer({ locale, model }: { locale: Loc; model: VetModel }) {
  const t = vetCopy(locale);
  const [active, setActive] = useState<string | null>(null);

  // Hotspot chỉ giữ `factId`; tên và nội dung lấy từ kho tri thức lúc dựng, để
  // sửa nội dung ở một chỗ là mọi nơi hiện theo — không chép tên vào models.ts.
  const facts = useMemo(() => allVetFacts(), []);
  const spots: SceneHotspot[] = useMemo(
    () =>
      model.hotspots.flatMap((h) => {
        const fact = facts.find((f) => f.id === h.factId);
        return fact ? [{ factId: h.factId, position: h.position, label: pick(fact.name, locale) }] : [];
      }),
    [model.hotspots, facts, locale],
  );
  const chosen = active ? facts.find((f) => f.id === active) : undefined;

  return (
    <figure className="vet-model">
      <div className="vet-model-stage">
        <VetModelScene
          url={`/models/vet/${model.file}`}
          hotspots={spots}
          active={active}
          onPick={(id) => setActive((prev) => (prev === id ? null : id))}
        />
        <p className="vet-model-hint">{spots.length ? t.modelHintSpots : t.modelHint}</p>
      </div>

      {chosen && (
        <div className="vet-model-pick">
          <h4>{pick(chosen.name, locale)}</h4>
          <em>{chosen.nav}</em>
          <p>{pick(chosen.note, locale)}</p>
          {chosen.clinical && (
            <p className="vet-model-pick-clin">
              <b>{t.clinical}:</b> {pick(chosen.clinical, locale)}
            </p>
          )}
          <small>
            {t.source}: {chosen.source}
          </small>
        </div>
      )}

      <figcaption>
        <strong>{pick(model.title, locale)}</strong>
        <span>
          {t.modelLicense}: {model.license} · {model.attribution} ·{" "}
          <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer">
            {t.modelSource}
          </a>
        </span>
        <em>{t.modelCaveat}</em>
      </figcaption>
    </figure>
  );
}
