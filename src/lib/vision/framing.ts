import { LM, type Landmark } from "@/lib/gesture/handModel";

// KHUNG CẮT — phần hình học THUẦN (không React, không MediaPipe),
// nên `npm run test:vision` chạy được trong node.
//
// CÁCH NGẮM KHUNG lấy theo PuzzleCam (github.com/mishu006/Puzzle) — bản mà
// người dùng chỉ đích danh "cắt kiểu này":
//   • Ô ngắm là hình chữ nhật giữa HAI ĐẦU NGÓN TRỎ, nới thêm một viền đệm.
//   • KHÔNG đòi tư thế tay đặc biệt: cứ hai bàn tay trong khung là có ô ngắm,
//     ô đi theo tay theo thời gian thực.
//   • Bên trong ô được đổ ĐEN–TRẮNG ngay (xem `drawFilmPreview` bên trang).
//     ĐÂY mới là thứ làm nó khác hẳn một khung kẻ suông: mắt thấy ngay "tấm
//     ảnh sắp chụp là đây", nên tay tự căn cho vừa. Hai bản trước (khung chữ L,
//     rồi khung vuông cố định) thiếu đúng phản hồi này nên ngắm bằng niềm tin.
//   • Chụm ngón CẢ HAI TAY và giữ → ô đóng băng → đếm ngược → chụp.
//
// NHƯNG CÁCH ĐÓ KHÔNG QUÉT ĐƯỢC CHÍNH BÀN TAY MÌNH — hai tay đang bận ngắm thì
// còn tay nào để đưa vào ô. Nên có thêm cách thứ hai, và nó mới là cách chính
// khi quét chi trên:
//   • CHỈ GIƠ MỘT BÀN TAY (xoè ra) → ô TỰ ÔM LẤY chính bàn tay đó, kéo dài
//     xuống phía cẳng tay. Giữ yên là chụp. Không cần tay thứ hai, không cần
//     đếm ngược, vì đối tượng vốn đã nằm sẵn trong ô.
//   • Đây chính là nguyên tắc đã chốt từ đầu của cả tính năng cử chỉ: cái gì
//     mô hình BIẾT CHẮC thì đừng bắt AI đoán. Vị trí bàn tay thì MediaPipe đã
//     cho sẵn 21 điểm — cắt theo đó luôn đúng, không phụ thuộc tay ngắm khéo
//     hay vụng.
//
// QUY ƯỚC TOẠ ĐỘ (sai chỗ này là sai trái/phải cả tính năng):
//   • Landmark tới đây ĐÃ được `useHandTracking` lật gương (`x: 1 - p.x`), tức
//     đã nằm trong "hệ MÀN HÌNH" — trùng thứ người dùng thấy qua thẻ <video>
//     bị lật bằng CSS. ĐỪNG lật thêm.
//   • Lúc CẮT ẢNH thật thì phải lật NGƯỢC lại — việc của `boxToSourceRect`.
//     Quên bước này thì ảnh gửi đi bị lật gương và mọi kết luận trái/phải đều sai.

export type Box = { x: number; y: number; w: number; h: number };

/**
 * Viền đệm quanh hai đầu ngón trỏ, tính theo tỉ lệ CHIỀU RỘNG khung hình.
 * PuzzleCam dùng 28 px cố định; ở đây dùng tỉ lệ để không phụ thuộc độ phân
 * giải camera (720p và 480p phải cho cùng cảm giác).
 */
export const FRAME_PAD = 0.035;

/** Ô nhỏ hơn ngần này thì bỏ qua — đó là hai tay đang khép lại chứ không phải đang ngắm.
 *  0,06 cho phép ngắm chính xác vùng nhỏ (mắt, tai) bằng cách chụm 2 đầu ngón
 *  trỏ sát vào — đúng ý "chụm vào giãn ra để tạo hình chữ nhật". */
export const MIN_BOX = 0.06;

/**
 * Hai đầu ngón trỏ phải CÁCH NHAU tối thiểu ngần này (đo trong hệ vuông, đã
 * nhân x với aspect) mới tính là đang ngắm. Chụm dính vào nhau thì đó là điểm
 * bắt đầu của cử chỉ "chụm rồi giãn", chưa phải khung hình — không có ngưỡng
 * này, chỉ riêng viền đệm cũng đủ nặn ra một ô 0,07 và máy ngắm "khí".
 */
export const TIP_MIN_SPREAD = 0.05;

/** Cạnh ảnh gửi đi nhận diện (mô hình thị giác nào cũng nhận 224–336 px vuông). */
export const CROP_SIZE = 336;

export function clampBox(box: Box): Box {
  const x = Math.min(Math.max(box.x, 0), 1);
  const y = Math.min(Math.max(box.y, 0), 1);
  return { x, y, w: Math.min(box.w, 1 - x), h: Math.min(box.h, 1 - y) };
}

/**
 * Ô ngắm giữa hai đầu ngón trỏ, đã nới viền đệm và kẹp trong khung hình.
 * `aspect` = rộng/cao của khung hình, để viền đệm dày ĐỀU bốn phía (cùng số
 * pixel) chứ không bẹt theo trục.
 */
export function boxFromIndexTips(a: Landmark[], b: Landmark[], aspect: number): Box | null {
  const ta = a[LM.INDEX_TIP];
  const tb = b[LM.INDEX_TIP];
  if (!ta || !tb) return null;
  // Hai đầu ngón dính nhau = chưa ngắm (xem TIP_MIN_SPREAD).
  if (Math.hypot((ta.x - tb.x) * aspect, ta.y - tb.y) < TIP_MIN_SPREAD) return null;
  const padX = FRAME_PAD;
  const padY = FRAME_PAD * aspect;
  const box = clampBox({
    x: Math.min(ta.x, tb.x) - padX,
    y: Math.min(ta.y, tb.y) - padY,
    w: Math.abs(ta.x - tb.x) + padX * 2,
    h: Math.abs(ta.y - tb.y) + padY * 2,
  });
  if (box.w < MIN_BOX || box.h < MIN_BOX) return null;
  return box;
}

/** Viền nới quanh bàn tay khi ô tự bám, tính theo CỠ BÀN TAY. */
export const HAND_MARGIN = 0.45;
/**
 * Kéo dài ô về phía cẳng tay, tính theo cỡ bàn tay.
 * Vì sao phải kéo dài: MediaPipe chỉ cho 21 điểm của BÀN TAY, không có cẳng
 * tay. Nhưng người học giơ tay lên thì phần lớn muốn xem cả cổ tay – cẳng tay,
 * và mô hình thị giác cũng cần nhìn thấy đoạn đó mới phân biệt nổi "bàn tay"
 * với "cẳng tay". Hướng cẳng tay suy từ trục khớp bàn ngón giữa → cổ tay.
 */
export const FOREARM_EXTEND = 1.8;

/**
 * Cỡ bàn tay (khoảng cách cổ tay → khớp bàn), ĐO TRONG HỆ VUÔNG.
 *
 * Vì sao phải đổi hệ: toạ độ chuẩn hoá 0..1 không vuông — một đơn vị trên trục
 * x dài bằng `aspect` lần một đơn vị trên trục y (16/9 ≈ 1,78 lần). Đo thẳng
 * bằng `hypot(dx, dy)` thì CÙNG một bàn tay cho cỡ khác nhau tuỳ nó đang nằm
 * ngang hay dựng đứng: tay dựng đứng ra 0,11 còn tay nằm ngang chỉ ra 0,06.
 * Viền nới tính theo con số ấy nên tay nằm ngang bị nới thiếu gần một nửa —
 * đúng triệu chứng "ô cắt gần đúng nhưng chưa bao trọn". Nhân trục x với
 * `aspect` là đưa về hệ pixel-vuông, đo xong bao nhiêu cũng đúng.
 */
function handSpan(lms: Landmark[], aspect: number): number {
  const w = lms[LM.WRIST];
  const a = Math.hypot((lms[LM.INDEX_MCP].x - w.x) * aspect, lms[LM.INDEX_MCP].y - w.y);
  const b = Math.hypot((lms[LM.PINKY_MCP].x - w.x) * aspect, lms[LM.PINKY_MCP].y - w.y);
  return Math.max(a, b, 1e-4);
}

/**
 * Ô TỰ BÁM một bàn tay: bao trọn 21 điểm, nới viền, và kéo dài về phía cẳng tay.
 *
 * Đây là câu trả lời cho "làm sao cắt được bàn tay / cẳng tay của chính mình":
 * không ngắm gì cả — giơ tay lên là ô đã ôm đúng nó.
 */
export function boxFromHand(lms: Landmark[], aspect: number): Box | null {
  if (lms.length < 21) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const eat = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };
  for (const p of lms) eat(p.x, p.y);

  // Điểm cuối cẳng tay: từ khớp bàn ngón giữa kéo qua cổ tay rồi đi tiếp.
  // Hướng cũng phải tính TRONG HỆ VUÔNG rồi mới đổi ngược về toạ độ chuẩn hoá:
  // lấy thẳng (dx, dy) của hệ chữ nhật là một hướng BỊ BÓP MÉO, nên với bàn tay
  // chéo góc phần kéo dài đi lệch khỏi trục cẳng tay thật — ô vẫn "gần đúng"
  // nhưng cắt cụt một bên.
  const wrist = lms[LM.WRIST];
  const mid = lms[LM.MIDDLE_MCP];
  const span = handSpan(lms, aspect);
  const dx = (wrist.x - mid.x) * aspect;
  const dy = wrist.y - mid.y;
  const len = Math.hypot(dx, dy) || 1e-4;
  const reach = span * FOREARM_EXTEND;
  eat(wrist.x + ((dx / len) * reach) / aspect, wrist.y + (dy / len) * reach);

  // Viền nới dày ĐỀU bốn phía tính bằng pixel: trong hệ chuẩn hoá thì bề ngang
  // phải chia cho aspect.
  const pad = span * HAND_MARGIN;
  const padX = pad / aspect;
  const padY = pad;
  const box = clampBox({
    x: minX - padX,
    y: minY - padY,
    w: maxX - minX + padX * 2,
    h: maxY - minY + padY * 2,
  });
  if (box.w < MIN_BOX || box.h < MIN_BOX) return null;
  return box;
}

/** Hai ô có coi như đứng yên so với nhau không — dùng để biết tay đã giữ yên. */
export function boxIsStable(a: Box, b: Box, tol = 0.05): boolean {
  return (
    Math.abs(a.x - b.x) < tol &&
    Math.abs(a.y - b.y) < tol &&
    Math.abs(a.w - b.w) < tol * 1.5 &&
    Math.abs(a.h - b.h) < tol * 1.5
  );
}

export type SourceRect = { sx: number; sy: number; sw: number; sh: number };

/**
 * Đổi ô ngắm (hệ màn hình, đã lật gương) thành vùng pixel trên ảnh camera GỐC.
 *
 * Cắt ĐÚNG cái ô đang thấy — không nắn thành vuông, không nới thêm. Bản trước
 * ép vuông ngay ở bước này nên ô nhìn một đằng, ảnh cắt ra một nẻo. Việc đưa về
 * ảnh vuông cho mô hình thị giác là bước SAU, và làm bằng cách viền thêm hai
 * bên chứ không bóp méo (xem `fitContain`).
 */
export function boxToSourceRect(box: Box, videoW: number, videoH: number): SourceRect {
  const sw = Math.max(1, Math.min(box.w * videoW, videoW));
  const sh = Math.max(1, Math.min(box.h * videoH, videoH));
  const sy = Math.min(Math.max(box.y * videoH, 0), videoH - sh);
  const sxMirrored = Math.min(Math.max(box.x * videoW, 0), videoW - sw);
  // lật ngược trục x: hệ màn hình → hệ ảnh camera thật
  return { sx: videoW - sxMirrored - sw, sy, sw, sh };
}

/**
 * Đặt ảnh chữ nhật vào giữa khung VUÔNG cạnh `size` mà KHÔNG bóp méo: co cho
 * vừa cạnh dài, phần thừa để trống (trang sẽ tô xám trung tính).
 *
 * Vì sao không kéo giãn cho đầy: mô hình thị giác nhận ảnh vuông, mà kéo giãn
 * làm sai tỉ lệ giải phẫu — cẳng tay dài hoá cẳng tay mập — và độ chính xác
 * tụt thấy rõ. Viền xám thì mô hình chỉ thấy "ảnh nhỏ hơn", vô hại.
 */
export function fitContain(w: number, h: number, size: number) {
  const k = Math.min(size / w, size / h);
  const dw = Math.max(1, Math.round(w * k));
  const dh = Math.max(1, Math.round(h * k));
  return { dw, dh, dx: Math.round((size - dw) / 2), dy: Math.round((size - dh) / 2) };
}

export type CropQuality = {
  ok: boolean;
  /** Lý do từ chối — trùng khoá với câu nhắc trong `visionText`. */
  reason: "ok" | "too-small" | "too-dark" | "too-bright" | "blurry";
  /** Cạnh DÀI thật của vùng cắt, tính bằng pixel ảnh gốc. */
  sizePx: number;
  /** Độ sáng trung bình 0..255. */
  brightness: number;
  /** Phương sai Laplacian — càng cao càng nét. */
  sharpness: number;
};

/**
 * Cạnh DÀI nhất phải đạt ngần này. Câu hỏi thật sự là "cắt xong có phải PHÓNG TO
 * điểm ảnh lên không", mà việc đó do cạnh dài quyết định: ảnh gửi đi vừa khung
 * vuông 336 theo cạnh dài, nên cạnh dài ≥ 200 là không phải phóng to.
 *
 * Bản trước đo cạnh NGẮN và đó là lỗi chặn oan: ngắm một dải ngang để lấy hai
 * con mắt, hay một ô hẹp lấy vành tai, thì cạnh ngắn đương nhiên bé — máy từ
 * chối đúng những vùng người dùng cần nhất (đo thật 03/09: ba lần liên tiếp
 * quét mắt, tai, miệng đều bị báo "khung quá nhỏ").
 *
 * PHÂN CÔNG GIỮA HAI CỔNG: cổng kích thước chỉ loại những ô bé tới mức vô
 * nghĩa; việc phán "ảnh này dùng được không" là của CỔNG ĐỘ NÉT. Một ô nhỏ mà
 * ảnh gốc sắc thì phóng lên 2 lần vẫn còn cạnh, vẫn qua được phương sai
 * Laplacian; ô nhỏ mà nhoè thì chính cổng nét chặn. Đặt ngưỡng kích thước cao
 * là làm thay việc của cổng nét, và làm sai.
 */
export const MIN_CROP_PX = 130;
/**
 * Cạnh ngắn vẫn phải có một sàn: dưới mức này thì đó là một sợi chỉ, cắt ra
 * cũng không nhìn được gì.
 */
export const MIN_CROP_SHORT_PX = 40;
export const MIN_BRIGHTNESS = 42;
export const MAX_BRIGHTNESS = 232;
/**
 * Ngưỡng nét. Đo bằng phương sai Laplacian trên ảnh xám: ảnh webcam trong nhà
 * chụp đứng yên thường 120–400; nhoè vì rung tay hoặc vì đưa vật quá gần
 * (webcam laptop lấy nét cố định, dưới ~20 cm là mất nét) tụt xuống dưới 40.
 */
export const MIN_SHARPNESS = 55;

/**
 * CỔNG CHẤT LƯỢNG — chạy TRƯỚC khi gửi ảnh đi.
 *
 * Lý do có bước này: gửi một khung nhoè lên GPU vừa tốn 300–500 ms vừa nhận về
 * kết quả rác, và người dùng không hiểu vì sao máy đoán sai. Chặn tại chỗ rồi
 * nói thẳng "giữ yên tay" / "bật thêm đèn" thì họ sửa được ngay.
 */
export function assessCrop(
  img: { data: Uint8ClampedArray; width: number; height: number },
  /**
   * Cạnh DÀI thật của vùng cắt trên ảnh camera (px). Phải truyền vào vì ảnh
   * đưa tới đây đã co về cỡ gửi đi: đo trên nó thì ô nào cũng "đủ lớn", kể cả
   * ô bé xíu vừa bị phóng to lên.
   */
  sourcePx?: number,
  /** Cạnh NGẮN thật — chỉ để chặn những ô mảnh như sợi chỉ. */
  shortPx?: number,
): CropQuality {
  const { data, width, height } = img;
  const n = width * height;
  const gray = new Float32Array(n);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    // hệ số Rec. 601 — đủ tốt và rẻ hơn chuyển không gian màu đầy đủ
    const g = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
    gray[i] = g;
    sum += g;
  }
  const brightness = n > 0 ? sum / n : 0;

  // Laplacian 4 lân cận, bỏ viền 1 pixel
  let lapSum = 0;
  let lapSqSum = 0;
  let count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const lap = gray[i - 1] + gray[i + 1] + gray[i - width] + gray[i + width] - 4 * gray[i];
      lapSum += lap;
      lapSqSum += lap * lap;
      count++;
    }
  }
  const mean = count > 0 ? lapSum / count : 0;
  const sharpness = count > 0 ? lapSqSum / count - mean * mean : 0;

  const sizePx = sourcePx ?? Math.min(width, height);
  let reason: CropQuality["reason"] = "ok";
  if (sizePx < MIN_CROP_PX || (shortPx ?? sizePx) < MIN_CROP_SHORT_PX) reason = "too-small";
  else if (brightness < MIN_BRIGHTNESS) reason = "too-dark";
  else if (brightness > MAX_BRIGHTNESS) reason = "too-bright";
  else if (sharpness < MIN_SHARPNESS) reason = "blurry";

  return { ok: reason === "ok", reason, sizePx, brightness, sharpness };
}
