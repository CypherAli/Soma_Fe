"use client";

import { useTranslations } from "next-intl";
import { useAnatomyStore, SYSTEM_KEYS, type SystemKey } from "@/store/useAnatomyStore";

/**
 * Bảng LỚP GIẢI PHẪU của trang toàn thân.
 *
 * Trước đây chỉ là 7 công tắc bật/tắt, trông như bảng cài đặt. Nay mỗi hàng là
 * một lớp có ô màu đúng với màu mô trong scene và có hai thao tác tách bạch —
 * HIỆN/ẨN và RÕ/MỜ — giống bảng điều khiển của các model flagship (cánh tay,
 * đầu, thân), để bóc lớp chứ không chỉ tắt đi.
 *
 * Lớp "Da" đứng riêng trên cùng vì nó không phải hệ cơ quan mà là vỏ ngoài:
 * làm mờ nó là nhìn thấy toàn bộ cấu trúc bên dưới.
 */
const SYSTEM_SWATCH: Record<SystemKey, string> = {
  skeletal: "#e8dfc8",
  muscular: "#a5433e",
  nervous: "#e8c468",
  cardiovascular: "#c23b3b",
  visceral: "#c98a7c",
  lymphoid: "#a8c98a",
  joints: "#d9c9a0",
};

function EyeIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.6" />
      {!on && <path d="M4 4l16 16" />}
    </svg>
  );
}

function FadeIcon({ faded }: { faded: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path
        d={faded ? "M12 4a8 8 0 0 0 0 16" : "M12 4a8 8 0 0 1 0 16"}
        fill="currentColor"
        stroke="none"
        opacity={faded ? 0.35 : 1}
      />
    </svg>
  );
}

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const visibleSystems = useAnatomyStore((s) => s.visibleSystems);
  const toggleSystem = useAnatomyStore((s) => s.toggleSystem);
  const fadedSystems = useAnatomyStore((s) => s.fadedSystems);
  const toggleSystemFaded = useAnatomyStore((s) => s.toggleSystemFaded);
  const skinVisible = useAnatomyStore((s) => s.skinVisible);
  const skinFaded = useAnatomyStore((s) => s.skinFaded);
  const toggleSkin = useAnatomyStore((s) => s.toggleSkin);
  const toggleSkinFaded = useAnatomyStore((s) => s.toggleSkinFaded);

  const shown = SYSTEM_KEYS.filter((k) => visibleSystems[k]).length + (skinVisible ? 1 : 0);

  return (
    <aside className="viewer-rail" data-lenis-prevent>
      <div className="vr-head">
        <p className="vr-kicker">ATLAS TOÀN THÂN</p>
        <h2 className="vr-title">{t("systems")}</h2>
        <p className="vr-sub">{shown}/8 lớp đang hiện</p>
      </div>

      <div className="vr-list">
        <div className={`vr-row vr-skin${skinVisible ? "" : " off"}`}>
          <span className="vr-dot" style={{ background: "#e7b697" }} />
          <span className="vr-name">Da</span>
          <button
            type="button"
            className={`vr-act${skinFaded ? " on" : ""}`}
            onClick={toggleSkinFaded}
            title="Làm mờ lớp da để nhìn xuyên vào trong"
            aria-label="Làm mờ da"
          >
            <FadeIcon faded={skinFaded} />
          </button>
          <button
            type="button"
            className={`vr-act${skinVisible ? " on" : ""}`}
            onClick={toggleSkin}
            title={skinVisible ? "Ẩn lớp da" : "Hiện lớp da"}
            aria-label={skinVisible ? "Ẩn da" : "Hiện da"}
          >
            <EyeIcon on={skinVisible} />
          </button>
        </div>

        <p className="vr-label">Hệ cơ quan</p>

        {SYSTEM_KEYS.map((key) => {
          const on = visibleSystems[key];
          const faded = !!fadedSystems[key];
          return (
            <div key={key} className={`vr-row${on ? "" : " off"}`}>
              <span className="vr-dot" style={{ background: SYSTEM_SWATCH[key] }} />
              <span className="vr-name">{t(key)}</span>
              <button
                type="button"
                className={`vr-act${faded ? " on" : ""}`}
                onClick={() => toggleSystemFaded(key)}
                title="Làm mờ lớp này"
                aria-label={`Làm mờ ${t(key)}`}
              >
                <FadeIcon faded={faded} />
              </button>
              <button
                type="button"
                className={`vr-act${on ? " on" : ""}`}
                onClick={() => toggleSystem(key)}
                title={on ? "Ẩn lớp này" : "Hiện lớp này"}
                aria-label={`${on ? "Ẩn" : "Hiện"} ${t(key)}`}
              >
                <EyeIcon on={on} />
              </button>
            </div>
          );
        })}
      </div>

      <p className="vr-hint">
        Bóc theo thứ tự <b>Da → Cơ → Mạch → Thần kinh → Xương</b>. Bấm vào mô
        hình để xem thông tin bộ phận.
      </p>
    </aside>
  );
}
