"use client";

import { useTranslations } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";

const AXES: Array<"x" | "y" | "z"> = ["x", "y", "z"];

export default function ClipControls() {
  const t = useTranslations("clip");
  const clipEnabled = useAnatomyStore((s) => s.clipEnabled);
  const clipAxis = useAnatomyStore((s) => s.clipAxis);
  const clipPercent = useAnatomyStore((s) => s.clipPercent);
  const setClipEnabled = useAnatomyStore((s) => s.setClipEnabled);
  const setClipAxis = useAnatomyStore((s) => s.setClipAxis);
  const setClipPercent = useAnatomyStore((s) => s.setClipPercent);
  const toggleClipDirection = useAnatomyStore((s) => s.toggleClipDirection);

  return (
    <div className="absolute left-4 top-4 z-10 w-64 rounded-lg border border-[var(--line)] bg-white/95 p-3 shadow-lg backdrop-blur">
      <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">
        {t("title")}
        <input
          type="checkbox"
          checked={clipEnabled}
          onChange={(e) => setClipEnabled(e.target.checked)}
          className="h-4 w-4 accent-[var(--blue)]"
        />
      </label>

      {clipEnabled && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-1">
            {AXES.map((axis) => (
              <button
                key={axis}
                type="button"
                onClick={() => setClipAxis(axis)}
                className={`flex-1 rounded border px-2 py-1 text-xs font-medium uppercase ${
                  clipAxis === axis
                    ? "border-[var(--blue)] bg-[color-mix(in_srgb,var(--blue)_12%,white)] text-[var(--blue)]"
                    : "border-[var(--line)] text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
                }`}
              >
                {axis}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={clipPercent}
            onChange={(e) => setClipPercent(Number(e.target.value))}
            className="w-full accent-[var(--blue)]"
          />

          <button
            type="button"
            onClick={toggleClipDirection}
            className="w-full rounded border border-[var(--line)] px-2 py-1 text-xs font-medium text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
          >
            {t("flip")}
          </button>
        </div>
      )}
    </div>
  );
}
