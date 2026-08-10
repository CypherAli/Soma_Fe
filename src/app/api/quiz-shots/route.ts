import { NextResponse } from "next/server";
import { sceneModules } from "@/lib/sceneModules";

/**
 * Bản kê để render ảnh câu hỏi Spotting: mỗi scene có file .glb riêng thì liệt
 * kê kèm danh sách hotspot của nó.
 *
 * Chỉ dùng lúc DỰNG dữ liệu (scripts/blender/render_quiz_shots.py gọi vào đây),
 * không phục vụ người dùng cuối. Đặt thành route thay vì viết lại logic đọc
 * file .ts bằng Python để chỉ có MỘT nguồn sự thật là sceneModules.
 */
export const runtime = "nodejs";

export async function GET() {
  const scenes = Object.entries(sceneModules)
    .filter(([, m]) => !!m.modelFile)
    .map(([slug, m]) => ({
      slug,
      modelFile: m.modelFile,
      hotspots: m.hotspots
        .filter((h) => h.label && h.note)
        .map((h) => ({
          key: h.key,
          meshName: h.meshName,
          // nhãn tiếng Việt để đối chiếu với tiêu đề trang atlas đã OCR
          label: h.label?.vi ?? "",
          latin: h.latinName ?? "",
        })),
    }))
    .filter((s) => s.hotspots.length > 0);

  return NextResponse.json({
    scenes,
    totalScenes: scenes.length,
    totalShots: scenes.reduce((n, s) => n + s.hotspots.length, 0),
  });
}
