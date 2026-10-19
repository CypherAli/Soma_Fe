import quizCatalog from "../../../public/kb/dr-lam/index.json" with { type: "json" };

export type QuizDestinationTool = "bank" | "quick" | "pdf" | "adaptive" | "ai";
export function quizDestination(params: Record<string, string | string[] | undefined>) {
  const tools: QuizDestinationTool[] = ["bank", "quick", "pdf", "adaptive", "ai"];
  const tool = typeof params.tool === "string" && tools.includes(params.tool as QuizDestinationTool)
    ? params.tool as QuizDestinationTool : "bank";
  const examId = typeof params.de === "string" && quizCatalog.exams.some(exam => exam.id === params.de)
    ? params.de : undefined;
  return { tool, examId };
}
