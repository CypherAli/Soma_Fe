"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useState } from "react";

import { getControlModel } from "@/lib/anatomy/controlModels";
import { getScene } from "@/lib/catalog";
import { pick, type Loc } from "@/lib/homeContent";
import type { CropQuality } from "@/lib/vision/framing";
import { VISION_PARTS, getVisionPart, type VisionGuess, type VisionPartKey } from "@/lib/vision/parts";
import type { VisionText } from "@/lib/vision/visionText";
import { scanControlModel, scanControlModelName } from "@/lib/vision/scanControlModel";

// GIAO DIỆN CHẾ ĐỘ QUÉT — thuần trình bày, không giữ trạng thái, không đụng
// camera. Vòng lặp bàn tay nằm ở trang /cu-chi và điều khiển cả hai chế độ.
//
// Mọi nút ở đây đều mang `data-gesture-target` và gọi cùng một hàm `fire(key)` —
// đúng thuộc tính và đúng đường đi mà chế độ điều khiển đang dùng. Nhờ vậy con
// trỏ tay, lực hút, vòng dwell và cú bấm chuột đi chung một cơ chế cho cả hai
// chế độ; thêm một hệ chọn thứ hai là chắc chắn lệch nhau.

export type ScanStage = "scan" | "review";

/**
 * Tải mẩu ảnh vừa chụp về máy, tên tệp đã gắn nhãn vùng.
 *
 * Dựng thẻ <a> ngay trong hàm xử lý sự kiện chứ không đặt `download` lúc dựng
 * giao diện: tên tệp có dấu thời gian, mà gọi `Date.now()` trong lúc render là
 * hàm KHÔNG THUẦN — lint react-compiler chặn, và chặn đúng.
 */
function saveSample(dataUrl: string, part: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${part}-${Date.now()}.jpg`;
  a.click();
}

type OverlayProps = {
  t: VisionText;
  locale: Loc;
  stage: ScanStage;
  hint: string;
  shot: string | null;
  quality: CropQuality | null;
  guesses: VisionGuess[];
  failure: "offline" | "failed" | "low" | null;
  shownPart: VisionPartKey | null;
  /** Kết quả đang hiện do đâu mà có, và mất bao lâu. */
  source: { kind: "pose" | "gpu" | "fallback"; ms: number } | null;
  askConsent: boolean;
  /** Cùng hàm mà vòng dwell gọi — bấm chuột và giữ tay đi chung một đường. */
  fire: (key: string) => void;
};

/** Lớp phủ trên khung camera: câu nhắc khi đang ngắm, kết quả khi đã chụp. */
export function ScanOverlay({
  t,
  locale,
  stage,
  hint,
  shot,
  quality,
  guesses,
  failure,
  shownPart,
  source,
  askConsent,
  fire,
}: OverlayProps) {
  return <ContentSurface scope="src/components/vision/ScanPanels.tsx">{(
    <>
      {stage === "scan" && !askConsent && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-sm text-white">
          {hint}
        </div>
      )}

      {stage === "review" && (
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 bg-gradient-to-t from-black/85 to-transparent p-4">
          {shot && (
            <figure className="w-24 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot}
                alt={t.shot}
                className="aspect-square w-full rounded-lg border border-white/25 object-cover"
              />
              <figcaption className="mt-1 text-[11px] text-white/70">{t.shot}</figcaption>
            </figure>
          )}
          <div className="min-w-0 flex-1">
            {quality && !quality.ok ? (
              <p className="mb-2 text-sm text-amber-200">{t.quality[quality.reason]}</p>
            ) : failure ? (
              <p className="mb-2 text-sm text-amber-200">
                {failure === "offline" ? t.offline : failure === "low" ? t.lowConfidence : t.failed}
              </p>
            ) : guesses.length === 0 ? (
              <p className="mb-2 text-sm text-white/80">{t.hintBusy}</p>
            ) : (
              <>
                <p className="mb-2 text-xs uppercase tracking-wider text-white/60">
                  {t.results}
                  {/* Nói thẳng kết quả do đâu mà có: mốc giải phẫu trên máy hay
                      mô hình trên GPU, và mất bao lâu. Người dùng đọc được độ
                      tin cậy từ đó, và khi bảo vệ đồ án thì giải thích được. */}
                  {source && (
                    <span className="ml-2 normal-case tracking-normal text-white/45">
                      {source.kind === "pose" ? t.viaPose : source.kind === "gpu" ? t.viaGpu : t.viaFallback}
                      {source.ms > 0 ? ` · ${source.ms} ms` : ""}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {guesses.map((g) => {
                    const part = getVisionPart(g.part);
                    if (!part) return null;
                    const on = shownPart === g.part;
                    return (
                      <button
                        key={g.part}
                        data-gesture-target={`part:${g.part}`}
                        onClick={() => fire(`part:${g.part}`)}
                        className={`rounded-xl border px-4 py-2 text-left transition ${
                          on
                            ? "border-[#37c9b3] bg-[#0f8a7c]/30 text-white"
                            : "border-white/25 bg-black/50 text-white/90 hover:bg-black/70"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{pick(part.label, locale)}</span>
                        {/* MỨC TIN CẬY chứ không phải phần trăm — xem ConfidenceTier trong parts.ts. */}
                        <span className="block text-xs text-white/60">
                          {g.side ? `${t.side[g.side]} · ` : ""}
                          {t.tier[g.tier ?? "unsure"]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <button
              data-gesture-target="rescan"
              onClick={() => fire("rescan")}
              className="rounded-xl border border-white/30 bg-black/50 px-4 py-2 text-sm text-white hover:bg-black/70"
            >
              {t.retake}
            </button>
            {/* LƯU ẢNH MẪU — cách bộ dữ liệu tự lớn lên trong lúc dùng thật,
                thay vì bắt ngồi chụp hàng trăm tấm trước khi biết máy sai ở đâu.
                Ảnh tải thẳng về máy, tên tệp đã gắn nhãn vùng; KHÔNG tự gửi đi
                đâu cả. Gom được vài chục tấm thì chạy scripts/vision/build_index.py. */}
            {shot && shownPart && (
              <button
                onClick={() => saveSample(shot, shownPart)}
                className="rounded-xl border border-white/25 px-4 py-2 text-center text-xs text-white/80 hover:bg-black/60"
              >
                {t.saveSample}
              </button>
            )}
          </div>
        </div>
      )}

      {askConsent && (
        <div className="absolute inset-0 grid place-items-center bg-black/75 p-6">
          <div className="max-w-md rounded-xl border border-[var(--line)] bg-[var(--surf)] p-5">
            <h2 className="mb-2 text-sm font-semibold text-[var(--ink)]">{t.consentTitle}</h2>
            <p className="text-sm leading-relaxed text-[var(--body-fg)]">{t.consentBody}</p>
            <div className="mt-4 flex gap-2">
              <button
                data-gesture-target="consent:yes"
                onClick={() => fire("consent:yes")}
                className="flex-1 rounded-lg bg-[#0f8a7c] px-3 py-2 text-sm font-semibold text-white"
              >
                {t.consentAccept}
              </button>
              <button
                data-gesture-target="consent:no"
                onClick={() => fire("consent:no")}
                className="flex-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--body-fg)]"
              >
                {t.consentDecline}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )}</ContentSurface>;
}

type SidebarProps = {
  t: VisionText;
  locale: Loc;
  shownPart: VisionPartKey | null;
  consent: boolean | null;
  fire: (key: string) => void;
};

/** Cột phải của chế độ quét: các bước, tự chọn vùng, mô hình, giới hạn camera. */
export function ScanSidebar({ t, locale, shownPart, consent, fire }: SidebarProps) {
  const cmsContent = useContent();
  const VISION_PARTS = cmsContent.resolve(cmsSourceVISION_PARTS());

  const part = shownPart ? getVisionPart(shownPart) : undefined;
  const scenes = (part?.scenes ?? []).filter((slug,index,list)=>list.findIndex(other=>scanControlModel(other,shownPart)===scanControlModel(slug,shownPart))===index);
  // Hỏi server có GPU không; chưa có thì hiện badge để khỏi hiểu lầm
  // (quét mặt/cổ lúc này chỉ còn tầng MediaPipe → rớt về tự chọn).
  const [gpu, setGpu] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/vision/identify").then((r) => r.json()).then(
      (d) => setGpu(Boolean((d as { configured?: boolean }).configured)),
      () => setGpu(null),
    );
  }, []);

  return <ContentSurface scope="src/components/vision/ScanPanels.tsx">{(
    <>
      {gpu === false && (
        <details className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-3 text-xs leading-relaxed text-[var(--muted)]"><summary className="cursor-pointer text-[var(--ink)]">{locale==='vi'?'Khả năng nhận diện':locale==='zh'?'识别能力':'Recognition availability'}</summary><p className="mt-2">
          {locale === "vi"
            ? "Chưa cấu hình GPU nhận diện — quét bàn tay/cẳng tay vẫn ra kết quả (tầng mốc trên máy), quét mặt/cổ/vai chỉ tự chọn vùng."
            : locale === "zh"
              ? "未配置 GPU 识别——手/前臂扫描仍可用（本机标志点），面部/颈/肩仅手动选择。"
              : "GPU recognition not configured — hand/forearm scan still works (on-device landmarks); face/neck/shoulder falls back to manual pick."}
        </p></details>
      )}
      <details className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--ink)]">
          {t.title}
        </summary>
        <p className="my-3 text-xs leading-relaxed text-[var(--muted)]">{locale==='vi'?'Quét → chọn vùng → mở mô hình trong Vision. Camera tiếp tục dùng để điều khiển.':locale==='zh'?'扫描 → 选择部位 → 在 Vision 中打开模型。摄像头继续用于控制。':'Scan → select a region → open its model in Vision. The camera continues for gesture control.'}</p>
        <ol className="space-y-2 text-sm leading-relaxed text-[var(--body-fg)]">
          {t.steps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--surf-2)] text-[11px] font-semibold">
                {i + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
            </li>
          ))}
        </ol>
        <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs leading-relaxed text-[var(--muted)]">
          {t.voiceHint}
        </p>
      </details>

      {part && (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
          <h2 className="mb-1 text-sm font-semibold text-[var(--ink)]">{pick(part.label, locale)}</h2>
          <p className="mb-3 text-xs text-[var(--muted)]">{t.models(scenes.length)}</p>
          {/* MỌI mô hình gợi ý đều mở NGAY TRONG TRANG NÀY ở chế độ điều khiển —
              luật đã chốt: không bao giờ chuyển sang trang thư viện (camera tắt,
              người dùng phải cầm chuột lại). Giữ đúng thứ tự của `parts.ts`: bài
              bộ phận học theo lớp đứng đầu. Tên lấy từ CHÍNH mô hình sẽ nạp, nên
              nút ghi gì thì hiện ra đúng cái đó. */}
          <div className="flex flex-col gap-2">
            {scenes.map((slug) => {
              const model = getControlModel(slug);
              if (!model) return null;
              const thumb = getScene(slug)?.thumb;
              return (
                <button
                  key={slug}
                  data-gesture-target={`control:${slug}`}
                  onClick={() => fire(`control:${slug}`)}
                  className="flex items-center gap-2.5 rounded-lg border border-[#0f8a7c]/60 bg-[#0f8a7c]/10 p-1.5 pr-3 text-left text-sm text-[var(--ink)] hover:border-[#0f8a7c]"
                >
                  {/* Ảnh bìa: nhìn ảnh nhận ra bài nhanh hơn đọc tên, nhất là khi đang
                      giơ tay dwell chứ không cầm chuột. */}
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-10 w-10 shrink-0 rounded-md bg-[var(--surf-2)] object-cover" />
                  ) : (
                    <span className="h-10 w-10 shrink-0 rounded-md bg-[var(--surf-2)]" />
                  )}
                  <span className="min-w-0">
                    {scanControlModelName(slug,shownPart)}
                    <span className="block text-xs text-[#0f8a7c]">{t.openGesture}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">{pick(part.hint, locale)}</p>
          {part.note && (
            <p className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-2 text-xs leading-relaxed text-[var(--body-fg)]">
              {pick(part.note, locale)}
            </p>
          )}

          {/* LỐI RẼ XUỐNG VÙNG CON. Quét cả cái đầu thì bước tự nhiên kế tiếp
              là soi riêng mắt, tai hay miệng — cho sẵn đường đi thay vì bắt
              người dùng quét lại từ đầu. */}
          {(part.children?.length ?? 0) > 0 && (
            <div className="mt-3 border-t border-[var(--line)] pt-3">
              <p className="mb-2 text-xs text-[var(--muted-2)]">{t.drillDown}</p>
              <div className="flex flex-wrap gap-1.5">
                {part.children!.map((k) => {
                  const child = getVisionPart(k);
                  if (!child) return null;
                  return (
                    <button
                      key={k}
                      data-gesture-target={`part:${k}`}
                      onClick={() => fire(`part:${k}`)}
                      className="rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-xs text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
                    >
                      {pick(child.label, locale)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
          {t.manual}
        </h2>
        <p className="mb-3 text-xs text-[var(--muted)]">{t.manualHint}</p>
        <div className="flex flex-wrap gap-1.5">
          {VISION_PARTS.map((p) => (
            <button
              key={p.key}
              data-gesture-target={`part:${p.key}`}
              onClick={() => fire(`part:${p.key}`)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                shownPart === p.key
                  ? "border-[#0f8a7c] bg-[#0f8a7c]/12 text-[var(--ink)]"
                  : "border-[var(--line)] text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
              }`}
            >
              {pick(p.label, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Gập lại mặc định: bốn giới hạn camera là thứ cần biết khi gặp trục trặc,
          không phải thứ phải đọc hết trước khi được quét. */}
      <details className="group rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
        <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
          {t.limitsTitle} <span className="inline-block transition group-open:rotate-90">›</span>
        </summary>
        <ul className="mt-2 space-y-2 text-xs leading-relaxed text-[var(--muted)]">
          {t.limits.map((l, i) => (
            <li key={i}>· {l}</li>
          ))}
        </ul>
      </details>

      {/* Quyền gửi ảnh thì KHÔNG được giấu trong khối gập: người dùng phải luôn
          thấy mình đang bật hay tắt, và đổi được ngay. */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          {t.privacy}
        </p>
        {/* Đổi ý lúc nào cũng được — chọn "không" một lần rồi kẹt luôn thì lựa
            chọn đó không còn là lựa chọn nữa. */}
        <button
          data-gesture-target={consent ? "consent:no" : "consent:yes"}
          onClick={() => fire(consent ? "consent:no" : "consent:yes")}
          className="mt-2 w-full rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
        >
          {consent ? t.consentOn : t.consentOff}
        </button>
      </div>
    </>
  )}</ContentSurface>;
}

function cmsSourceVISION_PARTS() { return VISION_PARTS; }
