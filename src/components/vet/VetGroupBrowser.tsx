"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import type { SpeciesInfo } from "@/lib/vet/knowledge";
import { vetModelsOfSpecies } from "@/lib/vet/models";
import { vetPlateOf } from "@/lib/vet/plates";
import { vetCopy } from "@/lib/vet/copy";
import type { VetSpeciesKey } from "@/lib/vet/types";

/**
 * Một nhóm loài: lưới thẻ bên trái, bản khắc giải phẫu bên phải.
 *
 * Ô bản khắc LUÔN chiếm chỗ, kể cả khi chưa rê vào loài nào — nó chỉ đổi từ
 * trong suốt sang hiện hình. Nếu để nó xuất hiện lúc rê thì hàng phải cao lên,
 * và mọi thứ bên dưới bị đẩy xuống ngay dưới con trỏ: rê vào một thẻ là cả
 * trang nhảy. Chiều cao ô cố định `min-height` nên bố cục đứng yên tuyệt đối.
 *
 * Ảnh trượt từ trái sang phải khi hiện ra, để mắt bắt được là nó vừa đổi —
 * đổi ảnh tại chỗ giữa hai loài trông giống lỗi nhấp nháy hơn là một chuyển động.
 */
export default function VetGroupBrowser({
  locale,
  species,
  counts,
}: {
  locale: Loc;
  species: SpeciesInfo[];
  counts: Record<VetSpeciesKey, number>;
}) {
  // Gọi vetCopy tại đây chứ KHÔNG nhận `t` từ trang server: đối tượng chữ nghĩa
  // có `entries` là một hàm, mà hàm thì không truyền qua ranh giới server →
  // client được ("Functions cannot be passed directly to Client Components").
  const t = vetCopy(locale);
  const [hover, setHover] = useState<VetSpeciesKey | null>(null);
  const shown = hover ?? null;
  const plate = shown ? vetPlateOf(shown) : undefined;
  const info = shown ? species.find((s) => s.key === shown) : undefined;

  return (
    <div className="vet-group-body">
      <div className="vet-species-grid">
        {species.map((s) => (
          <Link
            key={s.key}
            href={`/dong-vat/${s.key}`}
            className={`vet-species-card${hover === s.key ? " is-hot" : ""}`}
            onMouseEnter={() => setHover(s.key)}
            onFocus={() => setHover(s.key)}
            onMouseLeave={() => setHover((k) => (k === s.key ? null : k))}
            onBlur={() => setHover((k) => (k === s.key ? null : k))}
          >
            <h4>{pick(s.name, locale)}</h4>
            <em>{s.latin}</em>
            <p>{pick(s.blurb, locale)}</p>
            <b>
              {t.entries(counts[s.key])}
              {vetModelsOfSpecies(s.key).length > 0 && <i className="vet-has-model">3D</i>}
            </b>
          </Link>
        ))}
      </div>

      <figure className={`vet-plate${plate ? " is-on" : ""}`} aria-hidden={!plate}>
        {plate && info && (
          <>
            <Image
              src={`/plates/vet/${plate.file}`}
              alt={pick(plate.title, locale)}
              width={1500}
              height={1100}
              sizes="(max-width: 1000px) 90vw, 42vw"
            />
            <figcaption>
              <strong>{pick(info.name, locale)}</strong>
              <span>{pick(plate.title, locale)}</span>
              {plate.caveat && <em>{pick(plate.caveat, locale)}</em>}
              <small>
                {plate.source} · {plate.license}
              </small>
            </figcaption>
          </>
        )}
      </figure>
    </div>
  );
}
