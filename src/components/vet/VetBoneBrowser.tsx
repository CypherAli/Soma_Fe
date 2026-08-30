"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { pick, type Loc } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import { LMU_ATTRIBUTION } from "@/lib/vet/lmuData";
import { lmuGroupsOfSpecies, lmuName, type LmuGroupKey, type LmuModel } from "@/lib/vet/lmu";
import type { VetSpeciesKey } from "@/lib/vet/types";

const VetModelScene = dynamic(() => import("./VetModelScene"), {
  ssr: false,
  loading: () => <div className="vet-model-loading" />,
});

/**
 * Bộ xương của một loài: chọn theo vùng cơ thể, bấm vào xương nào thì xem
 * xương ấy.
 *
 * Đây là chỗ khu thú y bắt kịp bên người. Bên người bấm được vào từng cấu trúc
 * trên MỘT model nhiều lớp vì Z-Anatomy đã gắn nhãn từng mesh. Bộ LMU thì
 * ngược lại: mỗi xương là MỘT tệp riêng đã mang sẵn tên Latin — nên "chọn cấu
 * trúc" ở đây là chọn tệp, và tên hiện ra là tên thật do chính viện giải phẫu
 * đặt, không phải nhãn ta tự bịa.
 *
 * Giấy phép và tác giả hiện ngay dưới khung xem: phần lớn bộ này là CC BY-NC-ND,
 * ghi công là điều kiện bắt buộc chứ không phải phép lịch sự.
 */
export default function VetBoneBrowser({
  locale,
  species,
}: {
  locale: Loc;
  species: VetSpeciesKey;
}) {
  const t = vetCopy(locale);
  const groups = useMemo(() => lmuGroupsOfSpecies(species), [species]);
  const [group, setGroup] = useState<LmuGroupKey | null>(groups[0]?.key ?? null);
  const shownGroup = groups.find((g) => g.key === group) ?? groups[0];
  const [chosen, setChosen] = useState<LmuModel | null>(shownGroup?.models[0] ?? null);

  if (groups.length === 0) return null;
  const current = chosen && shownGroup?.models.includes(chosen) ? chosen : shownGroup?.models[0];

  return (
    <section className="vet-bones" aria-labelledby="vet-bones-h">
      <div className="vet-bones-head">
        <h2 id="vet-bones-h">{t.bonesH}</h2>
        <p>{t.bonesSub}</p>
      </div>

      <div className="vet-filter vet-bones-groups">
        {groups.map((g) => (
          <button
            key={g.key}
            className={g.key === shownGroup?.key ? "is-on" : ""}
            onClick={() => {
              setGroup(g.key);
              setChosen(g.models[0]);
            }}
          >
            {pick(g.label, locale)} <i>{g.models.length}</i>
          </button>
        ))}
      </div>

      <div className="vet-bones-body">
        <ul className="vet-bone-list">
          {shownGroup?.models.map((m) => {
            const label = lmuName(m);
            return (
              <li key={m.uid}>
                <button
                  className={current?.uid === m.uid ? "is-on" : ""}
                  onClick={() => setChosen(m)}
                >
                  <strong>{pick(label, locale)}</strong>
                  <em>{m.latin || "—"}</em>
                </button>
              </li>
            );
          })}
        </ul>

        {current && (
          <figure className="vet-bone-stage">
            {/* `refitKey` chứ không phải `key`: đổi xương thì ngắm lại khung
                nhưng GIỮ NGUYÊN ngữ cảnh WebGL — xem ghi chú trong VetModelScene. */}
            <VetModelScene url={`/models/vet/lmu/${current.file}`} refitKey={current.uid} />
            <figcaption>
              <strong>{pick(lmuName(current), locale)}</strong>
              <em>{current.latin}</em>
              {current.note && <span className="vet-bone-note">{current.note}</span>}
              <small>
                {t.modelLicense}: {current.license} · {LMU_ATTRIBUTION} ·{" "}
                <a href={current.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {t.modelSource}
                </a>
              </small>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
