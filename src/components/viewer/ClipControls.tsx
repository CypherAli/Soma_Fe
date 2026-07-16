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
    <div className="absolute left-4 top-4 z-10 w-64 rounded-lg border border-slate-800 bg-slate-900/90 p-3 backdrop-blur">
      <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        {t("title")}
        <input
          type="checkbox"
          checked={clipEnabled}
          onChange={(e) => setClipEnabled(e.target.checked)}
          className="h-4 w-4 accent-sky-500"
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
                    ? "border-sky-400 bg-sky-500/20 text-sky-300"
                    : "border-slate-700 text-slate-300 hover:bg-slate-800"
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
            className="w-full accent-sky-500"
          />

          <button
            type="button"
            onClick={toggleClipDirection}
            className="w-full rounded border border-slate-700 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            {t("flip")}
          </button>
        </div>
      )}
    </div>
  );
}
