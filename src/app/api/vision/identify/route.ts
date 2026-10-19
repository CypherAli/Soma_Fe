import { NextResponse } from "next/server";
import { VISION_PART_KEYS, rankGuesses } from "@/lib/vision/parts";
import { clientIp, createLimiter, sameOrigin } from "@/lib/rateLimit";
import { readJsonObject } from "@/lib/requestBody";

/**
 * Route này chuyển tiếp thẳng sang máy GPU trả tiền theo giờ, nên mở toang là
 * một vòng lặp `curl` đốt được cả quỹ credit. Hai lớp chặn: mỗi IP tối đa 20
 * lượt/phút (người quét thật không bao giờ tới — mỗi lần quét phải giữ tay yên
 * hơn một giây), và trần tổng mỗi ngày đặt được qua biến môi trường.
 */
const perIp = createLimiter(20, 60_000);
const dailyCap = Number(process.env.SOMA_VISION_DAILY_CAP);
const perDay = createLimiter(Number.isSafeInteger(dailyCap) && dailyCap > 0 ? dailyCap : 500, 86_400_000);

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

/** Cho FE biết có GPU hay không để ẩn/hiện gợi ý quét mặt-cổ (không lộ URL/key). */
export async function GET() {
  return NextResponse.json({ configured: Boolean(process.env.SOMA_VISION_URL) });
}

/** ~1,4 MB base64 ≈ 1 MB ảnh — thừa sức cho một ảnh JPEG vuông 336 px. */
const MAX_IMAGE_CHARS = 1_400_000;
const TIMEOUT_MS = 12_000;

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden", message: "Chỉ nhận yêu cầu từ chính trang Soma." }, { status: 403 });
  }
  for (const [limiter, key, code] of [
    [perIp, clientIp(req), "rate-limited"],
    [perDay, "all", "daily-cap"],
  ] as const) {
    const r = limiter.hit(key);
    if (!r.ok) {
      return NextResponse.json(
        { error: code, message: "Quét quá nhanh — đợi một chút rồi thử lại." },
        { status: 429, headers: { "retry-after": String(r.retryAfter) } },
      );
    }
  }

  const endpoint = process.env.SOMA_VISION_URL;
  if (!endpoint) {
    return NextResponse.json(
      { error: "vision-offline", message: "Chưa cấu hình dịch vụ nhận diện (SOMA_VISION_URL)." },
      { status: 503 },
    );
  }

  const body = await readJsonObject(req);
  if (!body) {
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

    const data = (await res.json()) as { results?: unknown; mode?: unknown };
    const results = rankGuesses(data.results, 3);
    // "knn" (so với ảnh mẫu thật) hay "zero-shot" (so với câu chữ): giao diện cần
    // biết để không khoác áo "khớp rõ" cho một con số chưa hiệu chỉnh.
    const mode = data.mode === "knn" ? "knn" : "zero-shot";
    if (results.length === 0) {
      return NextResponse.json(
        { error: "no-match", message: "Không nhận ra bộ phận nào trong mẩu ảnh này." },
        { status: 200 },
      );
    }
    return NextResponse.json({ results, source: "gpu", mode });
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
