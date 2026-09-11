"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "./IconSprite";

/** Số thẻ hiện ngay khi vào trang; phần còn lại nằm sau nút "Xem thêm". */
const VISIBLE = 8;

export type SystemCard = {
  key: string;
  slug: string;
  accent: string;
  icon: string;
  label: string;
  count: number;
  countLabel: string;
};

export default function SystemGrid({
  cards,
  title,
  subtitle,
  moreLabel,
  lessLabel,
}: {
  cards: SystemCard[];
  title: string;
  subtitle: string;
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const hidden = cards.length - VISIBLE;
  const shown = open ? cards : cards.slice(0, VISIBLE);

  return (
    <>
      <div className="sec-head sys-head">
        <div className="sec-head-text">
          <h2>{title}</h2>
          <p className="sec-sub">{subtitle}</p>
        </div>
        {hidden > 0 && (
          <div className="sec-head-tools">
            <button type="button" className="sec-all sys-more-btn" onClick={() => setOpen((v) => !v)}>
              {open ? lessLabel : moreLabel}
            </button>
          </div>
        )}
      </div>

      <div className="sys-grid">
        {shown.map((card) => (
          <Link
            key={card.key}
            href={`/giai-phau/${card.slug}`}
            className={`sys-card ${card.accent}`}
          >
            <span className="sys-icon">
              <Icon id={card.icon} />
            </span>
            <h3>{card.label}</h3>
            <p>
              {card.count} {card.countLabel}
            </p>
          </Link>
        ))}
      </div>

    </>
  );
}
