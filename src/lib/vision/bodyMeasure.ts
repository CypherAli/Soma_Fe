import { MIN_VISIBILITY, type PoseLm } from "./bodyRegions";

/**
 * SỐ ĐO SONG SINH (tầng 2 gương X-quang): đo tỉ lệ cơ thể người học từ pose.
 *
 * Nói rõ giới hạn: webcam đơn không có vật mốc tuyệt đối nên KHÔNG ra được cm
 * thật — mọi số đo là pixel trong khung video + tỉ lệ tương đối (lấy rộng vai
 * làm chuẩn 1.00). Đủ để scale model theo đúng người (tầng 2) và neo từng đoạn
 * xương lúc overlay (tầng 4). Đừng ghi "cm" ở UI.
 */

export type TwinMeasurements = {
  /** Kích thước khung video lúc đo (để đổi ra px khi cần). */
  vw: number;
  vh: number;
  /** Các độ dài theo pixel video. */
  shoulderW: number;
  torso: number;
  armL: number;
  armR: number;
  head: number;
  /** Điểm chuẩn hoá giữ lại để ánh xạ lên canvas lúc auto-zoom. */
  pts: { nose: { x: number; y: number }; shoL: { x: number; y: number }; shoR: { x: number; y: number }; hipL: { x: number; y: number }; hipR: { x: number; y: number } };
  at: number;
};

const ok = (p: PoseLm | undefined): p is PoseLm =>
  !!p && (p.visibility === undefined || p.visibility >= MIN_VISIBILITY);

const dist = (a: PoseLm, b: PoseLm, vw: number, vh: number): number =>
  Math.hypot((a.x - b.x) * vw, (a.y - b.y) * vh);

/**
 * Đo nửa thân trên. Cần đủ: mũi (0), vai (11,12), khuỷu (13,14), cổ tay
 * (15,16), hông (23,24) — thiếu/vùng mờ một mốc là trả null (đo thiếu còn hại
 * hơn không đo).
 */
export function measureUpperBody(lms: PoseLm[], vw: number, vh: number): TwinMeasurements | null {
  const need = [0, 11, 12, 13, 14, 15, 16, 23, 24];
  if (vw <= 0 || vh <= 0 || !need.every((i) => ok(lms[i]))) return null;
  const shoL = lms[11];
  const shoR = lms[12];
  const shoulderW = dist(shoL, shoR, vw, vh);
  const torso = dist(
    { x: (shoL.x + shoR.x) / 2, y: (shoL.y + shoR.y) / 2 },
    { x: (lms[23].x + lms[24].x) / 2, y: (lms[23].y + lms[24].y) / 2 },
    vw,
    vh,
  );
  const armL = dist(shoL, lms[13], vw, vh) + dist(lms[13], lms[15], vw, vh);
  const armR = dist(shoR, lms[14], vw, vh) + dist(lms[14], lms[16], vw, vh);
  const head = dist(lms[0], { x: (shoL.x + shoR.x) / 2, y: (shoL.y + shoR.y) / 2 }, vw, vh);
  if (!(shoulderW > 0 && torso > 0 && armL > 0 && armR > 0 && head > 0)) return null;
  return {
    vw,
    vh,
    shoulderW,
    torso,
    armL,
    armR,
    head,
    pts: {
      nose: { x: lms[0].x, y: lms[0].y },
      shoL: { x: shoL.x, y: shoL.y },
      shoR: { x: shoR.x, y: shoR.y },
      hipL: { x: lms[23].x, y: lms[23].y },
      hipR: { x: lms[24].x, y: lms[24].y },
    },
    at: Date.now(),
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Tỉ lệ zoom để model cao đúng bằng tỉ lệ người chiếm trên màn hình.
 *
 * Toàn bộ trong KHÔNG GIAN MÀN HÌNH (không đổi ra đơn vị thế giới nên không
 * bịa): chiều cao người (đỉnh đầu ước lượng = mũi − 0.5·đầu, tới hông) ánh xạ
 * qua đúng phép object-cover của khung hiển thị, chia cho chiều cao model mặc
 * định (~74% khung do FRAME_SIZE 1.3/1.75). Kẹp 0.5–1.6 để số đo lệch không
 * làm model biến mất hay tràn khung.
 */
export function zoomForTwin(
  m: TwinMeasurements,
  canvasW: number,
  canvasH: number,
  modelFrac = 0.74,
): number {
  if (canvasW <= 0 || canvasH <= 0) return 1;
  const scale = Math.max(canvasW / m.vw, canvasH / m.vh);
  // Cùng cộng oy (độ lệch cover) nên trừ nhau là triệt tiêu — chỉ còn tỉ lệ.
  const crownY = m.pts.nose.y - 0.5 * (m.head / m.vh);
  const hipY = Math.max(m.pts.hipL.y, m.pts.hipR.y);
  const userH = Math.max(1, hipY - crownY) * m.vh * scale;
  return clamp(userH / (modelFrac * canvasH), 0.5, 1.6);
}
