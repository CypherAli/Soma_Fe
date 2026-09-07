import { NextResponse } from "next/server";
import { VISION_PART_KEYS, rankGuesses } from "@/lib/vision/parts";

/**
 * NHẬN DIỆN BỘ PHẬN TỪ MỘT MẨU ẢNH WEBCAM.
 *
 * Trình duyệt gửi lên đúng MỘT mẩu ảnh vuông đã cắt (không phải cả khung hình),
 * route này chuyển tiếp sang dịch vụ thị giác chạy trên GPU
 * (`scripts/vision/service.py`) rồi trả về top-3 nhãn.
 *
 * VÌ SAO PHẢI ĐI QUA ĐÂY chứ không gọi thẳng GPU từ trình duyệt:
 *  1. Khoá của dịch vụ GPU không được lộ ra máy khách.
 *  2. Địa chỉ GPU đổi (đổi máy, đổi cổng) thì chỉ sửa biến môi trường.
 *  3. Chặn ảnh quá lớn và kiểm nhãn trả về NGAY tại biên — dịch vụ ngoài trả
 *     nhãn lạ thì bị loại ở đây, giao diện không bao giờ nhận nhãn không có
 *     trong danh sách của mình.
 *
 * Không cấu hình GPU thì route trả 503 kèm mã `vision-offline`; giao diện hiểu
 * mã đó và chuyển sang bảng chọn tay, KHÔNG báo lỗi đỏ.
 */
export const runtime = "nodejs";

/** ~1,4 MB base64 ≈ 1 MB ảnh — thừa sức cho một ảnh JPEG vuông 336 px. */
const MAX_IMAGE_CHARS = 1_400_000;
const TIMEOUT_MS = 12_000;

type Body = { image?: unknown };

export async function POST(req: Request) {
  const endpoint = process.env.SOMA_VISION_URL;
  if (!endpoint) {
    return NextResponse.json(
      { error: "vision-offline", message: "Chưa cấu hình dịch vụ nhận diện (SOMA_VISION_URL)." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad-request", message: "Thân yêu cầu không phải JSON." }, { status: 400 });
  }

  const image = body.image;
  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "bad-request", message: "Thiếu trường image (data URL của ảnh đã cắt)." },
      { status: 400 },
    );
  }
  if (image.length > MAX_IMAGE_CHARS) {
    return NextResponse.json(
      { error: "too-large", message: "Ảnh quá lớn — chỉ gửi mẩu đã cắt, không gửi cả khung hình." },
      { status: 413 },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.SOMA_VISION_KEY ? { authorization: `Bearer ${process.env.SOMA_VISION_KEY}` } : {}),
      },
      // Gửi kèm danh sách nhãn để dịch vụ và giao diện không bao giờ lệch nhau:
      // thêm một vùng cơ thể ở `parts.ts` là dịch vụ biết ngay, không phải sửa
      // hai nơi rồi quên một nơi.
      body: JSON.stringify({ image, labels: VISION_PART_KEYS }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "vision-failed", message: `Dịch vụ nhận diện trả lỗi ${res.status}.`, detail: detail.slice(0, 400) },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { results?: unknown };
    const results = rankGuesses(data.results, 3);
    if (results.length === 0) {
      return NextResponse.json(
        { error: "no-match", message: "Không nhận ra bộ phận nào trong mẩu ảnh này." },
        { status: 200 },
      );
    }
    return NextResponse.json({ results, source: "gpu" });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        error: aborted ? "timeout" : "vision-failed",
        message: aborted
          ? "Dịch vụ nhận diện không trả lời kịp."
          : "Không gọi được dịch vụ nhận diện.",
      },
      { status: 504 },
    );
  } finally {
    clearTimeout(timer);
  }
}
