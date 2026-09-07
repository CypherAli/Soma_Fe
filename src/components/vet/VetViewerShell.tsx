"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc, type T3 } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import { VET_LAYER_LABEL, allVetFacts, speciesInfo } from "@/lib/vet/knowledge";
import { vetModelsOfSpecies } from "@/lib/vet/models";
import { VET_LAYER_ORDER, type VetLayerKey, type VetSpeciesKey } from "@/lib/vet/types";
import type { SceneHotspot } from "./VetModelScene";

const VetModelScene = dynamic(() => import("./VetModelScene"), {
  ssr: false,
  loading: () => <div className="vet-viewer-loading" />,
});

/**
 * KHUNG XEM MẪU VẬT THÚ Y — bố cục ba khoang, đúng ngôn ngữ của trang toàn thân
 * bên người: thanh lớp bên trái · sân khấu 3D ở giữa · bảng thông tin bên phải.
 *
 * VÌ SAO TÁCH KHỎI TRANG LOÀI. Trước đây khung xem nhét thẳng vào bài viết của
 * trang loài: mỗi mẫu vật là một khung 16:9 chiếm gần trọn màn hình, mà chó có
 * năm lớp và lớp tạng có ba mẫu — người học phải cuộn qua một dãy khung 3D mới
 * tới được phần chữ. Bên người không mắc lỗi ấy vì khung xem có TRANG RIÊNG
 * (`/viewer`) chiếm trọn chiều cao, còn phần chữ ở nơi khác. Đây là bản tương
 * đương cho thú y, dùng lại đúng lớp CSS `.viewer-rail` / `.vr-*` /
 * `.viewer-stage` của bên người để hai khu không trông như hai sản phẩm.
 *
 * Ba cấp trong thanh trái — LỚP → MẪU VẬT → BỘ PHẬN — phản ánh đúng thực tế dữ
 * liệu: lớp là thứ chuyển qua lại (mỗi lớp một mẫu vật khác, không chồng được),
 * mẫu vật là tệp .glb, bộ phận là các nhóm mesh chung tên vật liệu.
 */
/**
 * MÀU MÔ THEO LỚP — dùng lại đúng bảng màu của trang toàn thân bên người
 * (`src/components/Sidebar.tsx`, hằng `SYSTEM_SWATCH`).
 *
 * Chỉ áp cho mẫu KHÔNG có ảnh bề mặt. Phần lớn mẫu thú y mở là lưới trần, ra
 * màn hình là một khối xám trắng giống hệt nhau — khối cơ mà màu xương thì
 * phản trực giác, và ba lớp khác nhau trông y như một. Mẫu có texture (dạ cỏ
 * bò, hệ tiêu hoá mèo) thì giữ nguyên: ảnh mẫu vật thật bao giờ cũng đúng màu
 * hơn màu ta tự gán.
 */
const VET_LAYER_SWATCH: Record<VetLayerKey, string> = {
  skin: "#d8c3ad",
  muscle: "#a5433e",
  vessel: "#c23b3b",
  nerve: "#e8c468",
  viscera: "#c98a7c",
  senses: "#c9a86c",
  skeleton: "#e8dfc8",
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

function AloneIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="7" opacity={on ? 1 : 0.75} />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </svg>
  );
}

export default function VetViewerShell({
  locale,
  speciesKey,
}: {
  locale: Loc;
  speciesKey: VetSpeciesKey;
}) {
  const t = vetCopy(locale);
  const info = speciesInfo(speciesKey);
  const models = useMemo(() => vetModelsOfSpecies(speciesKey), [speciesKey]);
  /*
   * Thanh trái hiện ĐỦ BẢY LỚP theo thứ tự bóc, kể cả lớp chưa có mẫu vật.
   *
   * Chỉ liệt kê lớp đã có mẫu thì trang trông như con vật bắt đầu từ lớp cơ —
   * người học không thấy là còn lớp da ở ngoài, và không biết chỗ nào của atlas
   * còn trống. Lớp rỗng hiện mờ, bấm không được, kèm chữ "chưa có mẫu".
   */
  const layers = useMemo(
    () => VET_LAYER_ORDER.map((key) => ({ key, n: models.filter((m) => m.layer === key).length })),
    [models],
  );
  const filled = layers.filter((l) => l.n > 0);
  const facts = useMemo(() => allVetFacts(), []);

  const [layer, setLayer] = useState<VetLayerKey | null>(null);
  const shownLayer =
    layer && filled.some((l) => l.key === layer) ? layer : (filled[0]?.key ?? null);
  const layerModels = models.filter((m) => m.layer === shownLayer);

  const [specimen, setSpecimen] = useState<string | null>(null);
  const model = layerModels.find((m) => m.slug === specimen) ?? layerModels[0] ?? null;

  // Trạng thái bóc lớp thuộc về MẪU VẬT đang xem. Đổi mẫu mà giữ nguyên danh
  // sách ẩn thì tên vật liệu của mẫu cũ chẳng khớp gì ở mẫu mới, người dùng
  // thấy một bảng có mấy hàng "đang tắt" mà hình thì không đổi.
  const [hidden, setHidden] = useState<string[]>([]);
  const [alone, setAlone] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [fact, setFact] = useState<string | null>(null);

  // Tên cấu trúc đang rê chuột tới, hiện ở thanh gợi ý dưới sân khấu. Đây là
  // thứ thay cho việc luôn bày mười quả cầu đánh dấu trên mình con vật.
  const [hovered, setHovered] = useState<string | null>(null);
  const [showMarkers, setShowMarkers] = useState(false);

  const resetParts = () => {
    setHidden([]);
    setAlone(null);
    setPicked(null);
    setFact(null);
  };

  const parts = model?.parts ?? [];
  const pickedPart = parts.find((p) => p.material === picked) ?? null;

  /*
   * Tên bộ phận: ưu tiên đọc từ kho tri thức qua `factId`.
   *
   * Vùng do `segment_by_seeds.py` cắt lấy chính `factId` làm tên vật liệu, nên
   * không có tên riêng — và cũng không nên có: chép tên vào hai chỗ là để chúng
   * lệch nhau. Bộ phận do tác giả mẫu vật gắn nhãn (lớp da, khối máu) thì mới
   * dùng `name` tự đặt.
   */
  const partLabel = (part: { factId?: string; name?: import("@/lib/vet/types").VetModelPart["name"] }) => {
    const f = part.factId ? facts.find((x) => x.id === part.factId) : undefined;
    if (f) return pick(f.name, locale);
    return part.name ? pick(part.name, locale) : "";
  };
  const partNav = (part: { factId?: string; nav?: string }) => {
    const f = part.factId ? facts.find((x) => x.id === part.factId) : undefined;
    return f ? f.nav : part.nav;
  };
  const chosenFact = fact ? facts.find((f) => f.id === fact) : undefined;

  /*
   * XẾP BỘ PHẬN THÀNH TỪNG MỤC.
   *
   * Mẫu quét thú y trước nay có 3–8 bộ phận nên đổ phẳng ra là đọc được. Bộ
   * xương lợn có 120 xương: đổ phẳng thì muốn tìm xương sườn số 9 phải lăn qua
   * cả cột sống. Mẫu nào khai `partGroups` thì xếp theo đúng thứ tự khai; bộ
   * phận không thuộc mục nào rơi xuống cuối, KHÔNG bị bỏ sót.
   */
  const partGroups = model?.partGroups ?? [];
  const partSections: { key: string; title: T3 | null; items: typeof parts }[] = [
    ...partGroups.map((g) => ({
      key: g.key,
      title: g.title as T3 | null,
      items: parts.filter((p) => p.group === g.key),
    })),
    // Bộ phận không thuộc mục nào rơi xuống cuối — kể cả mẫu không khai mục
    // nào thì tất cả rơi vào đây, tức là danh sách phẳng y như trước.
    { key: "", title: null, items: parts.filter((p) => !partGroups.some((g) => g.key === p.group)) },
  ].filter((sec) => sec.items.length > 0);

  // Không bọc `useMemo`: React Compiler từ chối giữ lại bản ghi nhớ thủ công ở
  // đây (`model` là kết quả `find` nên nó không chứng minh được là bất biến) và
  // bỏ luôn việc tối ưu CẢ component. Để trần thì trình biên dịch tự ghi nhớ —
  // danh sách chỉ vài chục hotspot, tính lại cũng không đáng kể.
  const spots: SceneHotspot[] = model
    ? model.hotspots.flatMap((h) => {
        const f = facts.find((x) => x.id === h.factId);
        return f ? [{ factId: h.factId, position: h.position, label: pick(f.name, locale) }] : [];
      })
    : [];

  return (
    <div className="bd vet-viewer">
      <IconSprite />
      <HomeNav section="vet" />

      <div className="vet-viewer-body">
        <aside className="viewer-rail" data-lenis-prevent>
          <div className="vr-head">
            <p className="vr-kicker">ANIMA · {info.latin.toUpperCase()}</p>
            <h2 className="vr-title">{pick(info.name, locale)}</h2>
            <p className="vr-sub">
              {filled.length}/{layers.length} {t.viewerLayerCount} · {models.length}{" "}
              {t.viewerSpecimenCount}
            </p>
          </div>

          {filled.length > 0 && (
            <div className="vr-list">
              <p className="vr-label">{t.modelLayerH}</p>
              {layers.map(({ key, n }) => (
                <button
                  key={key}
                  type="button"
                  disabled={n === 0}
                  className={`vr-row vet-vr-pick${key === shownLayer ? " is-on" : ""}${n === 0 ? " is-empty" : ""}`}
                  onClick={() => {
                    setLayer(key);
                    setSpecimen(null);
                    resetParts();
                  }}
                >
                  <span className="vr-name">{pick(VET_LAYER_LABEL[key], locale)}</span>
                  <span className="vet-vr-count">{n > 0 ? n : t.viewerLayerEmpty}</span>
                </button>
              ))}

              {layerModels.length > 1 && (
                <>
                  <p className="vr-label">{t.viewerSpecimenH}</p>
                  {layerModels.map((m) => (
                    <button
                      key={m.slug}
                      type="button"
                      className={`vr-row vet-vr-pick${m.slug === model?.slug ? " is-on" : ""}`}
                      onClick={() => {
                        setSpecimen(m.slug);
                        resetParts();
                      }}
                    >
                      <span className="vr-name">{pick(m.title, locale)}</span>
                    </button>
                  ))}
                </>
              )}

              {parts.length > 0 && (
                <>
                  <p className="vr-label">
                    {t.partsH} · {parts.length}
                  </p>
                  {partSections.map((sec) => (
                  <Fragment key={sec.key || "all"}>
                  {sec.title && (
                    <div className="vr-row vet-vr-group">
                      <span className="vr-name">
                        {pick(sec.title, locale)} · {sec.items.length}
                      </span>
                      <button
                        type="button"
                        className={`vr-act${sec.items.some((p) => !hidden.includes(p.material)) ? " on" : ""}`}
                        title={t.viewerHide}
                        aria-label={t.viewerHide}
                        onClick={() => {
                          // Ẩn/hiện CẢ MỤC. Trên bộ xương đây là thao tác hay
                          // dùng nhất: giấu lồng ngực đi mới nhìn rõ cột sống.
                          const mats = sec.items.map((p) => p.material);
                          const anyOn = mats.some((m) => !hidden.includes(m));
                          setHidden((h) =>
                            anyOn
                              ? [...new Set([...h, ...mats])]
                              : h.filter((m) => !mats.includes(m)),
                          );
                        }}
                      >
                        <EyeIcon on={sec.items.some((p) => !hidden.includes(p.material))} />
                      </button>
                    </div>
                  )}
                  {sec.items.map((p) => {
                    const on = !hidden.includes(p.material);
                    const isAlone = alone === p.material;
                    return (
                      <div key={p.material} className={`vr-row${on ? "" : " off"}`}>
                        <button
                          type="button"
                          className="vet-vr-label"
                          onClick={() => {
                            setPicked(p.material);
                            setFact(p.factId ?? null);
                          }}
                        >
                          <span className="vr-name">{partLabel(p)}</span>
                          {partNav(p) && <em>{partNav(p)}</em>}
                        </button>
                        <button
                          type="button"
                          className={`vr-act${isAlone ? " on" : ""}`}
                          title={t.partsIsolate}
                          aria-label={t.partsIsolate}
                          onClick={() => setAlone((v) => (v === p.material ? null : p.material))}
                        >
                          <AloneIcon on={isAlone} />
                        </button>
                        <button
                          type="button"
                          className={`vr-act${on ? " on" : ""}`}
                          title={on ? t.viewerHide : t.viewerShow}
                          aria-label={on ? t.viewerHide : t.viewerShow}
                          onClick={() =>
                            setHidden((h) =>
                              h.includes(p.material)
                                ? h.filter((x) => x !== p.material)
                                : [...h, p.material],
                            )
                          }
                        >
                          <EyeIcon on={on} />
                        </button>
                      </div>
                    );
                  })}
                  </Fragment>
                  ))}
                </>
              )}
            </div>
          )}

          <p className="vr-hint">
            {parts.length > 0 ? t.viewerRailHint : t.partsSolid}{" "}
            {model?.segmented && <>{t.partsApprox}{" "}</>}
            <Link href={`/dong-vat/${speciesKey}`}>{t.viewerBackToText}</Link>
          </p>
        </aside>

        <main className="vet-viewer-stage viewer-stage">
          {model ? (
            <>
              <VetModelScene
                url={`/models/vet/${model.file}`}
                refitKey={model.slug}
                hotspots={spots}
                active={fact}
                onPick={(id) => setFact((v) => (v === id ? null : id))}
                hiddenParts={hidden}
                activePart={alone}
                onPickPart={(m) => {
                  setPicked(m);
                  // Mẫu đã cắt vùng: tên vật liệu chính là `factId`, nên bấm vào
                  // hình là mở luôn nội dung, không phải bấm thêm ở thanh trái.
                  const part = parts.find((p) => p.material === m);
                  setFact(part?.factId ?? null);
                }}
                onHover={setHovered}
                showMarkers={showMarkers}
                tint={VET_LAYER_SWATCH[model.layer]}
              />
              <p className={`vet-viewer-hint${hovered ? " is-name" : ""}`}>
                {hovered
                  ? (facts.find((f) => f.id === hovered)?.name
                      ? pick(facts.find((f) => f.id === hovered)!.name, locale)
                      : t.modelHint)
                  : spots.length
                    ? t.modelHintSpots
                    : t.modelHint}
              </p>
              {spots.length > 0 && (
                <button
                  type="button"
                  className={`vet-viewer-markers${showMarkers ? " is-on" : ""}`}
                  onClick={() => setShowMarkers((v) => !v)}
                >
                  {showMarkers ? t.viewerMarkersOff : t.viewerMarkersOn}
                </button>
              )}
              {(hidden.length > 0 || alone) && (
                <button type="button" className="vet-viewer-reset" onClick={resetParts}>
                  {t.partsAll}
                </button>
              )}
            </>
          ) : (
            <p className="vet-viewer-empty">{t.modelNone}</p>
          )}
        </main>

        <aside className="vet-viewer-info" data-lenis-prevent>
          <div className="vvi-head">
            <h2>{t.viewerInfoH}</h2>
          </div>

          {chosenFact ? (
            <div className="vvi-body">
              <h3>{pick(chosenFact.name, locale)}</h3>
              <em>{chosenFact.nav}</em>
              <p>{pick(chosenFact.note, locale)}</p>
              {chosenFact.compare && (
                <>
                  <h4>{t.difference}</h4>
                  <p>{pick(chosenFact.compare, locale)}</p>
                </>
              )}
              {chosenFact.clinical && (
                <>
                  <h4>{t.clinical}</h4>
                  <p>{pick(chosenFact.clinical, locale)}</p>
                </>
              )}
              <small>
                {t.source}: {chosenFact.source}
              </small>
            </div>
          ) : pickedPart ? (
            <div className="vvi-body">
              <h3>{partLabel(pickedPart)}</h3>
              {partNav(pickedPart) && <em>{partNav(pickedPart)}</em>}
              <div className="vvi-acts">
                <button
                  type="button"
                  className={hidden.includes(pickedPart.material) ? "is-on" : ""}
                  onClick={() =>
                    setHidden((h) =>
                      h.includes(pickedPart.material)
                        ? h.filter((x) => x !== pickedPart.material)
                        : [...h, pickedPart.material],
                    )
                  }
                >
                  {hidden.includes(pickedPart.material) ? t.viewerShow : t.viewerHide}
                </button>
                <button
                  type="button"
                  className={alone === pickedPart.material ? "is-on" : ""}
                  onClick={() =>
                    setAlone((v) => (v === pickedPart.material ? null : pickedPart.material))
                  }
                >
                  {t.partsIsolate}
                </button>
              </div>
              <p className="vvi-note">
                {model?.partsFrom === "atlas" ? t.viewerPartNoteAtlas : t.viewerPartNote}
              </p>
            </div>
          ) : (
            <div className="vvi-empty">
              <p>{parts.length > 0 ? t.viewerInfoEmpty : t.partsSolid}</p>
            </div>
          )}

          {model && (
            <div className="vvi-cred">
              <p className="vvi-cred-title">{pick(model.title, locale)}</p>
              <p>
                {t.modelLicense}: {model.license}
                <br />
                {model.attribution}
              </p>
              <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer">
                {t.modelSource} ↗
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
