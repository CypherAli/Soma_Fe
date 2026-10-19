"use client";


import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useMemo, useState } from "react";
import Image from "next/image";
import { catalogScenes, systemByKey, systemGroups } from "@/lib/catalog";
import { atlasScenes } from "@/lib/humanAtlas/scenes";
import { pick, type Loc } from "@/lib/homeContent";
import { Link } from "@/i18n/navigation";
import AtlasIcon from "../explore/AtlasIcon";

const fold = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d");
function mode(slug: string) {
  return atlasScenes[slug]?.layers?.length
    ? "layers"
    : /^(he-|giai-phau-|toan-than)/.test(slug)
      ? "overview"
      : "detail";
}
export default function LibraryResults({ locale }: { locale: Loc }) {
  const cmsContent = useContent();
  const systemGroups = cmsContent.resolve(cmsSourcesystemGroups());

  const [query, setQuery] = useState(""),
    [system, setSystem] = useState("all"),
    [kind, setKind] = useState("all"),
    [sort, setSort] = useState("az");
  const text = (vi: string, en: string, zh: string) =>
    pick({ vi, en, zh }, locale);
  const kinds = {
    all: text("Mọi cách học", "All lesson types", "所有课程类型"),
    overview: text("Tổng quan", "Overview", "概览"),
    detail: text("Cấu trúc chuyên đề", "Structure lessons", "专题结构"),
    layers: text("Học theo lớp", "Layer by layer", "分层学习"),
  };
  const results = useMemo(() => {
    const tokens = fold(query.trim()).split(/\s+/).filter(Boolean);
    return catalogScenes
      .filter(
        (scene) =>
          (system === "all" || scene.system === system) &&
          (kind === "all" || mode(scene.slug) === kind) &&
          tokens.every((token) =>
            fold(
              scene.searchText + " " + pick(scene.description, locale),
            ).includes(token),
          ),
      )
      .sort((a, b) =>
        sort === "count"
          ? b.structureCount - a.structureCount
          : pick(a.title, locale).localeCompare(
              pick(b.title, locale),
              locale === "zh" ? "zh" : locale,
            ),
      );
  }, [query, system, kind, sort, locale]);
  return <ContentSurface scope="src/components/library/LibraryResults.tsx">{(
    <main className="simple-page model-library">
      <header className="page-head">
        <h1>
          {text(
            "Thư viện mô hình giải phẫu",
            "Anatomy model library",
            "解剖模型库",
          )}
        </h1>
        <span className="count" aria-live="polite">
          {results.length} / {catalogScenes.length}{" "}
          {text("bài", "lessons", "课程")}
        </span>
      </header>
      <p>
        {text(
          "Tìm theo tên bài, cấu trúc, thuật ngữ Anh hoặc Latin. Chọn hệ cơ quan và cách học để mở đúng bài.",
          "Search lessons, structures, English or Latin terms. Choose a system and lesson type to open the right model.",
          "按课程、结构、英文或拉丁术语搜索。选择器官系统与课程类型。",
        )}
      </p>
      <div className="library-controls">
        <input
          aria-label={text("Tìm mô hình", "Search models", "搜索模型")}
          placeholder={text(
            "Ví dụ: khớp dọc, van hai lá, sulcus…",
            "Example: sagittal suture, mitral valve, sulcus…",
            "例如：矢状缝、二尖瓣、sulcus…",
          )}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label={text("Hệ cơ quan", "Organ system", "器官系统")}
          value={system}
          onChange={(event) => setSystem(event.target.value)}
        >
          <option value="all">
            {text("Tất cả hệ cơ quan", "All organ systems", "所有器官系统")}
          </option>
          {systemGroups.map((group) => (
            <option key={group.key} value={group.key}>
              {pick(group.label, locale)}
            </option>
          ))}
        </select>
        <select
          aria-label={text("Cách học", "Lesson type", "课程类型")}
          value={kind}
          onChange={(event) => setKind(event.target.value)}
        >
          {Object.entries(kinds).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          aria-label={text("Sắp xếp", "Sort", "排序")}
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="az">{text("Tên A–Z", "Name A–Z", "名称A–Z")}</option>
          <option value="count">
            {text(
              "Nhiều nhóm cấu trúc trước",
              "Most structure groups first",
              "结构分组最多优先",
            )}
          </option>
        </select>
      </div>
      {!results.length ? (
        <div className="empty-state">
          <h2>
            {text(
              "Không có bài phù hợp",
              "No matching lessons",
              "没有匹配课程",
            )}
          </h2>
          <p>
            {text(
              "Thử tên khác hoặc bỏ bớt bộ lọc.",
              "Try another term or fewer filters.",
              "请尝试其他术语或减少筛选。",
            )}
          </p>
          <button
            className="cta"
            onClick={() => {
              setQuery("");
              setSystem("all");
              setKind("all");
            }}
          >
            {text("Xóa bộ lọc", "Clear filters", "清除筛选")}
          </button>
        </div>
      ) : (
        <div className="library-grid">
          {results.map((scene) => (
            <Link key={scene.slug} className="library-card" href={scene.href}>
              <div className="library-thumb">
                <AtlasIcon
                  id={systemByKey.get(scene.system)?.icon ?? "i-cell"}
                />
                {scene.thumb && (
                  <Image
                    src={scene.thumb}
                    alt=""
                    fill
                    sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                  />
                )}
              </div>
              <div>
                <small>
                  {kinds[mode(scene.slug)]} ·{" "}
                  {pick(
                    systemByKey.get(scene.system)?.label ?? {
                      vi: "Giải phẫu",
                      en: "Anatomy",
                      zh: "解剖",
                    },
                    locale,
                  )}
                </small>
                <h2>{pick(scene.title, locale)}</h2>
                <p>{pick(scene.description, locale)}</p>
                <span>
                  {scene.structureCount}{" "}
                  {text("nhóm cấu trúc", "structure groups", "结构分组")} ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )}</ContentSurface>;
}

function cmsSourcesystemGroups() { return systemGroups; }
