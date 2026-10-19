"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { Loc } from "@/lib/homeContent";
import DrLamQuiz from "./DrLamQuiz";
import type { QuizTool } from "./QuizRunner";

const QuizRunner = dynamic(() => import("./QuizRunner"));

export default function QuizPageContent({ locale, initialTool = "bank", initialExamId }: { locale: Loc; initialTool?: "bank" | QuizTool; initialExamId?: string }) {
  const [section, setSection] = useState<"bank" | QuizTool>(initialTool);
  const [runnerOpened, setRunnerOpened] = useState(initialTool !== "bank");
  const [runnerActive, setRunnerActive] = useState(false);
  const word = (vi: string, en: string, zh: string) =>
    locale === "vi" ? vi : locale === "zh" ? zh : en;
  const sections = [
    {
      id: "bank",
      label: word("Đề Y Hà Nội", "HMU question sets", "河内医科大学题库"),
    },
    {
      id: "quick",
      label: word(
        "Tạo đề & mô hình 3D",
        "Quiz & 3D models",
        "创建试卷与 3D 模型",
      ),
    },
    {
      id: "pdf",
      label: word("PDF & Word của tôi", "My PDF & Word", "我的 PDF 与 Word"),
    },
    {
      id: "adaptive",
      label: word("Lộ trình ôn tập", "Study plan", "复习计划"),
    },
    { id: "ai", label: word("AI tạo đề", "AI quiz composer", "AI 创建试卷") },
  ] as const;
  const locked = runnerActive;
  function select(id: "bank" | QuizTool) {
    if (locked && id !== section) return;
    if (id !== "bank") setRunnerOpened(true);
    setSection(id);
  }
  return <ContentSurface scope="src/components/quiz/QuizPageContent.tsx">{(
    <div className="quiz-hub">
      <nav
        className="quiz-hub-nav"
        aria-label={word("Công cụ trắc nghiệm", "Quiz tools", "测验工具")}
        data-lenis-prevent
      >
        {sections.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-current={section === item.id ? "page" : undefined}
            disabled={locked && section !== item.id}
            title={
              locked && section !== item.id
                ? word(
                    "Thoát hoặc hoàn thành bài đang làm để đổi công cụ.",
                    "Exit or finish your attempt to switch tools.",
                    "退出或完成答题后切换工具。",
                  )
                : undefined
            }
            onClick={() => select(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {locked && (
        <p className="sr-only">
          {word(
            "Thoát hoặc hoàn thành bài đang làm để đổi công cụ.",
            "Exit or finish your attempt to switch tools.",
            "退出或完成答题后切换工具。",
          )}
        </p>
      )}
      <div hidden={section !== "bank"}>
        <DrLamQuiz locale={locale} initialExamId={initialExamId} onOtherSources={() => select("quick")} />
      </div>
      {runnerOpened && (
        <div hidden={section === "bank"}>
          <QuizRunner
            locale={locale}
            embedded
            tool={section === "bank" ? "quick" : section}
            onToolChange={setSection}
            onSessionActiveChange={setRunnerActive}
          />
        </div>
      )}
    </div>
  )}</ContentSurface>;
}
