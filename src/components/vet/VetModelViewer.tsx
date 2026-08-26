"use client";

import dynamic from "next/dynamic";
import { pick, type Loc } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import type { VetModel } from "@/lib/vet/types";

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
  return (
    <figure className="vet-model">
      <div className="vet-model-stage">
        <VetModelScene url={`/models/vet/${model.file}`} />
        <p className="vet-model-hint">{t.modelHint}</p>
      </div>
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
