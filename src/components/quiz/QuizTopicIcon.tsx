
import { ContentSurface } from "@/components/content/ContentProvider";
import { Icon } from "@/components/home/IconSprite";

export default function QuizTopicIcon({ name = "book" }: { name?: string }) {
  const icons: Record<string, string> = {
    grid: "i-grid",
    book: "i-bookmark",
    exam: "i-quiz",
    case: "i-steth",
    limb: "i-bone",
    head: "i-region",
    eye: "i-eye",
    thorax: "i-lungs",
    body: "i-system",
    brain: "i-brain",
  };
  return <ContentSurface scope="src/components/quiz/QuizTopicIcon.tsx"><Icon id={icons[name] ?? "i-bookmark"} /></ContentSurface>;
}
