import dimensions from "../../../public/kb/dr-lam/image-dimensions.json" with { type: "json" };

/** Reserve each source figure's real aspect ratio before lazy loading. */
export function quizImageSize(
  url: string,
): { width: number; height: number } | undefined {
  const size = (dimensions as Record<string, number[]>)[url];
  return size ? { width: size[0], height: size[1] } : undefined;
}
