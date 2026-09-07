import type { Box } from "./framing";
import type { VisionGuess, VisionPartKey } from "./parts";

// SUY RA VÙNG CƠ THỂ TỪ MỐC GIẢI PHẪU — phần thuần, kiểm thử được bằng node.
//
// Ý TƯỞNG: đừng bắt mô hình thị giác ĐOÁN xem mẩu ảnh là bộ phận gì, khi máy
// hoàn toàn có thể BIẾT. MediaPipe Pose cho 33 mốc trên người (mắt, tai, miệng,
// vai, khuỷu, cổ tay, hông, gối, cổ chân). Mỗi vùng giải phẫu vì thế có một "ô
// tham chiếu" tính được. So ô người dùng vừa ngắm với các ô tham chiếu ấy là ra
// vùng — bằng hình học, giải thích được từng con số, không phụ thuộc dữ liệu
// huấn luyện.
//
// Đây đúng nguyên tắc đã chốt cho cả tính năng cử chỉ: chọn cấu trúc bằng
// raycast theo tên mesh chứ không để AI đoán ảnh.
//
// CÁCH CHẤM ĐIỂM: IoU (phần giao chia phần hợp) giữa ô đã ngắm và ô tham chiếu.
// IoU xử lý được cả hai lỗi cùng lúc — ngắm trượt chỗ, và ngắm quá rộng. Một ô
// ôm cả người thì "chứa" đầu gối thật, nhưng IoU với ô đầu gối rất thấp nên
// không bị nhận nhầm.
//
// LẬT GƯƠNG: Pose chạy trên ảnh camera GỐC nên toạ độ của nó chưa lật, trong
// khi ô ngắm nằm ở hệ màn hình đã lật. Hàm này lật mốc pose ngay khi nhận vào —
// giữ phép lật ở ĐÚNG MỘT chỗ, vì đây là loại lỗi đã cắn dự án một lần.

export type PoseLm = { x: number; y: number; visibility?: number };

/** Chỉ số mốc của BlazePose (33 điểm) — chỉ liệt kê những mốc thực sự dùng. */
export const POSE = {
  NOSE: 0,
  EYE_L: 2,
  EYE_R: 5,
  EAR_L: 7,
  EAR_R: 8,
  MOUTH_L: 9,
  MOUTH_R: 10,
  SHOULDER_L: 11,
  SHOULDER_R: 12,
  ELBOW_L: 13,
  ELBOW_R: 14,
  WRIST_L: 15,
  WRIST_R: 16,
  INDEX_L: 19,
  INDEX_R: 20,
  HIP_L: 23,
  HIP_R: 24,
  KNEE_L: 25,
  KNEE_R: 26,
  ANKLE_L: 27,
  ANKLE_R: 28,
  FOOT_L: 31,
  FOOT_R: 32,
} as const;

/** Mốc mờ hơn ngưỡng này thì coi như không thấy — thà thiếu còn hơn đoán bừa. */
export const MIN_VISIBILITY = 0.5;

type P = { x: number; y: number };

const has = (lm: PoseLm | undefined): lm is PoseLm =>
  !!lm && (lm.visibility === undefined || lm.visibility >= MIN_VISIBILITY);

function bboxOf(points: P[], padX: number, padY: number): Box {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = Math.min(...xs) - padX;
  const y = Math.min(...ys) - padY;
  return {
    x,
    y,
    w: Math.max(...xs) - Math.min(...xs) + padX * 2,
    h: Math.max(...ys) - Math.min(...ys) + padY * 2,
  };
}

/** Phần giao chia phần hợp của hai ô. 0 = rời nhau, 1 = trùng khít. */
export function iou(a: Box, b: Box): number {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  if (inter <= 0) return 0;
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
}

type RegionRef = { part: VisionPartKey; ref: Box };

/**
 * Dựng ô tham chiếu cho từng vùng từ các mốc pose ĐÃ LẬT GƯƠNG.
 * `scale` = bề ngang hai vai, dùng làm thước cho mọi kích thước.
 */
function buildRefs(lm: (PoseLm | undefined)[], scale: number, aspect: number): RegionRef[] {
  const out: RegionRef[] = [];
  const k = (f: number) => ({ px: scale * f, py: scale * f * aspect });

  /** Vùng quanh MỘT mốc, ô vuông theo pixel. */
  const around = (part: VisionPartKey, idx: number[], f: number) => {
    for (const i of idx) {
      const p = lm[i];
      if (!has(p)) continue;
      const { px, py } = k(f);
      out.push({ part, ref: { x: p.x - px, y: p.y - py, w: px * 2, h: py * 2 } });
    }
  };

  /** Vùng giữa HAI mốc (đoạn chi), nới thêm viền. */
  const between = (part: VisionPartKey, pairs: [number, number][], f: number) => {
    for (const [i, j] of pairs) {
      const a = lm[i];
      const b = lm[j];
      if (!has(a) || !has(b)) continue;
      const { px, py } = k(f);
      out.push({ part, ref: bboxOf([a, b], px, py) });
    }
  };

  around("eye", [POSE.EYE_L, POSE.EYE_R], 0.16);
  around("ear", [POSE.EAR_L, POSE.EAR_R], 0.16);
  between("mouth", [[POSE.MOUTH_L, POSE.MOUTH_R]], 0.12);

  const faceIdx = [POSE.NOSE, POSE.EYE_L, POSE.EYE_R, POSE.EAR_L, POSE.EAR_R, POSE.MOUTH_L, POSE.MOUTH_R];
  const facePts = faceIdx.map((i) => lm[i]).filter(has);
  if (facePts.length >= 4) {
    out.push({ part: "face", ref: bboxOf(facePts, k(0.14).px, k(0.14).py) });
    // ĐẦU = bao mặt nới rộng hẳn. Pose KHÔNG có mốc đỉnh đầu (mốc trên cùng là
    // mắt và tai), nên phần sọ phía trên phải suy ra bằng cách nới — nới nhiều
    // hơn ở trên vì tóc và vòm sọ nằm cả ở đó.
    const box = bboxOf(facePts, k(0.34).px, k(0.30).py);
    out.push({ part: "head", ref: { ...box, y: box.y - k(0.22).py, h: box.h + k(0.22).py } });
  }

  const shL = lm[POSE.SHOULDER_L];
  const shR = lm[POSE.SHOULDER_R];
  const hipL = lm[POSE.HIP_L];
  const hipR = lm[POSE.HIP_R];

  // cổ: từ miệng xuống đường nối hai vai
  const mouthL = lm[POSE.MOUTH_L];
  const mouthR = lm[POSE.MOUTH_R];
  if (has(shL) && has(shR) && has(mouthL) && has(mouthR)) {
    const mouthMid = { x: (mouthL.x + mouthR.x) / 2, y: (mouthL.y + mouthR.y) / 2 };
    const shMid = { x: (shL.x + shR.x) / 2, y: (shL.y + shR.y) / 2 };
    const { px, py } = k(0.16);
    out.push({ part: "neck", ref: bboxOf([mouthMid, shMid], px, py) });
  }

  around("shoulder", [POSE.SHOULDER_L, POSE.SHOULDER_R], 0.3);
  between("upper-arm", [[POSE.SHOULDER_L, POSE.ELBOW_L], [POSE.SHOULDER_R, POSE.ELBOW_R]], 0.12);
  around("elbow", [POSE.ELBOW_L, POSE.ELBOW_R], 0.22);
  between("forearm", [[POSE.ELBOW_L, POSE.WRIST_L], [POSE.ELBOW_R, POSE.WRIST_R]], 0.12);
  around("wrist", [POSE.WRIST_L, POSE.WRIST_R], 0.18);
  between("hand", [[POSE.WRIST_L, POSE.INDEX_L], [POSE.WRIST_R, POSE.INDEX_R]], 0.16);
  around("knee", [POSE.KNEE_L, POSE.KNEE_R], 0.26);
  between("foot", [[POSE.ANKLE_L, POSE.FOOT_L], [POSE.ANKLE_R, POSE.FOOT_R]], 0.14);

  // Ngực và bụng: chia đôi khoảng vai → hông. Không có mốc xương nào ở giữa
  // thân, nên đây là hai vùng suy đoán yếu nhất — và đó là sự thật cần nói ra
  // chứ không phải chỗ để nguỵ tạo độ tin cậy.
  if (has(shL) && has(shR) && has(hipL) && has(hipR)) {
    const top = (shL.y + shR.y) / 2;
    const bottom = (hipL.y + hipR.y) / 2;
    const left = Math.min(shL.x, shR.x, hipL.x, hipR.x);
    const right = Math.max(shL.x, shR.x, hipL.x, hipR.x);
    const mid = top + (bottom - top) * 0.5;
    out.push({ part: "chest", ref: { x: left, y: top, w: right - left, h: mid - top } });
    out.push({ part: "abdomen", ref: { x: left, y: mid, w: right - left, h: bottom - mid } });
  }

  return out;
}

/** Bề ngang hai vai — thước đo của mọi kích thước vùng. */
function bodyScale(lm: (PoseLm | undefined)[]): number {
  const shL = lm[POSE.SHOULDER_L];
  const shR = lm[POSE.SHOULDER_R];
  if (has(shL) && has(shR)) {
    const d = Math.hypot(shL.x - shR.x, shL.y - shR.y);
    if (d > 0.02) return d;
  }
  // Không thấy vai (đưa tay/mặt sát camera): lấy khoảng cách hai mắt nhân 3,5.
  const eL = lm[POSE.EYE_L];
  const eR = lm[POSE.EYE_R];
  if (has(eL) && has(eR)) {
    const d = Math.hypot(eL.x - eR.x, eL.y - eR.y);
    if (d > 0.005) return d * 3.5;
  }
  return 0;
}

export type PoseGuessResult = {
  guesses: VisionGuess[];
  /** IoU thô của lựa chọn tốt nhất — để biết kết quả này đáng tin tới đâu. */
  bestIou: number;
};

/**
 * Suy ra vùng từ ô đã ngắm + mốc pose.
 *
 * @param box ô đã ngắm, hệ MÀN HÌNH (đã lật gương).
 * @param pose 33 mốc pose lấy từ ảnh camera GỐC (hàm tự lật).
 * @param aspect rộng/cao khung hình, để ô tham chiếu vuông theo pixel.
 */
export function guessFromPose(
  box: Box,
  pose: PoseLm[],
  aspect: number,
  /**
   * Chỉ xét những vùng này. Dùng khi đã BIẾT CHẮC đang quét cái gì — quét bàn
   * tay thì đừng bao giờ để "mặt" lọt vào danh sách, dù ô có chồng lên mặt
   * (giơ tay lên ngang mặt là chuyện thường).
   */
  only?: VisionPartKey[],
): PoseGuessResult {
  if (!pose || pose.length < 33) return { guesses: [], bestIou: 0 };
  // LẬT GƯƠNG ở đúng một chỗ duy nhất trong toàn bộ tầng này.
  const lm: (PoseLm | undefined)[] = pose.map((p) => ({ ...p, x: 1 - p.x }));

  const scale = bodyScale(lm);
  if (scale <= 0) return { guesses: [], bestIou: 0 };

  const allow = only ? new Set<VisionPartKey>(only) : null;
  const best = new Map<VisionPartKey, number>();
  for (const { part, ref } of buildRefs(lm, scale, aspect)) {
    if (allow && !allow.has(part)) continue;
    const v = iou(box, ref);
    if (v > (best.get(part) ?? 0)) best.set(part, v);
  }

  const rows = [...best.entries()].filter(([, v]) => v > 0.04).sort((a, b) => b[1] - a[1]);
  if (rows.length === 0) return { guesses: [], bestIou: 0 };

  const top = rows.slice(0, 3);
  const sum = top.reduce((n, [, v]) => n + v, 0);
  return {
    guesses: top.map(([part, v]) => ({ part, score: v / sum })),
    bestIou: rows[0][1],
  };
}

/**
 * ĐƯỜNG LUI khi Pose không thấy người, mà ô lại do CHÍNH BÀN TAY sinh ra.
 *
 * Hay gặp nhất và cũng tự nhiên nhất: đưa bàn tay sát camera để quét chính nó —
 * lúc đó không còn thân người nào trong khung cho Pose bám. Nhưng ta vẫn biết
 * chắc một điều: trong ô có một bàn tay.
 *
 * Cố ý KHÔNG suy ra "bàn tay hay cẳng tay" từ kích thước ô: ô đó do mã tự nới
 * xuống cẳng tay một đoạn cố định, nên nó phản ánh hằng số của ta chứ không
 * phản ánh ý người dùng. Suy từ đó là tự lừa mình. Trả về đúng ba ứng viên của
 * vùng chuyển tiếp, để người dùng chọn.
 */
export function handPathFallback(): VisionGuess[] {
  return [
    { part: "hand", score: 0.45 },
    { part: "wrist", score: 0.3 },
    { part: "forearm", score: 0.25 },
  ];
}

/** Bao nhiêu phần của đoạn A→B nằm trong ô (lấy mẫu đều). */
export function segmentCoverage(box: Box, a: P, b: P, samples = 11): number {
  let inside = 0;
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) inside++;
  }
  return inside / samples;
}

export type ArmGuessResult = {
  guesses: VisionGuess[];
  /** Phần đoạn cổ tay→khuỷu nằm trong ô — chính là "chụp được bao nhiêu cẳng tay". */
  coverage: number;
};

/**
 * SUY VÙNG CHO ĐƯỜNG QUÉT MỘT TAY — không dùng IoU.
 *
 * Vì sao phải khác: ô ở đường này do MÃ tự dựng quanh bàn tay (nới 0,45 cỡ tay,
 * kéo dài 1,15 cỡ tay xuống cẳng tay), nên kích thước của nó chẳng liên quan gì
 * tới kích thước các ô tham chiếu tinh chỉnh cho đường ngắm hai tay. Đo IoU
 * giữa hai thứ lệch cỡ như vậy cho điểm thấp đều — nhìn ngoài thì ra ba con số
 * xấp xỉ nhau (39/37/25), trông như máy đang cân nhắc, thật ra là máy không
 * khớp được gì cả.
 *
 * Ở đây câu hỏi thu về đúng một chuyện đo được: **ô lấn được bao nhiêu phần
 * đoạn cổ tay → khuỷu**. Bàn tay thì chắc chắn nằm trong ô rồi (ô sinh ra từ
 * chính nó), nên chỉ còn phải tách bàn tay / cổ tay / cẳng tay.
 *
 * @param wrist cổ tay lấy từ MỐC BÀN TAY (chính xác hơn mốc pose khi tay ở gần).
 * @param pose  mốc pose ảnh gốc — chỉ cần để lấy vị trí khuỷu.
 */
export function guessFromArmChain(box: Box, wrist: P, pose: PoseLm[]): ArmGuessResult {
  const lm: (PoseLm | undefined)[] = pose.map((p) => ({ ...p, x: 1 - p.x }));
  const elbows = [lm[POSE.ELBOW_L], lm[POSE.ELBOW_R]].filter(has);
  // Khuỷu gần cổ tay nhất chính là khuỷu của cánh tay đang giơ.
  const elbow = elbows.sort(
    (a, b) => Math.hypot(a.x - wrist.x, a.y - wrist.y) - Math.hypot(b.x - wrist.x, b.y - wrist.y),
  )[0];

  if (!elbow) {
    // Không thấy khuỷu (tay che mất, hoặc đưa quá sát camera): chỉ biết chắc là
    // có bàn tay. Nói đúng chừng đó.
    return { guesses: handPathFallback(), coverage: 0 };
  }

  const coverage = segmentCoverage(box, wrist, elbow);
  const inside =
    elbow.x >= box.x && elbow.x <= box.x + box.w && elbow.y >= box.y && elbow.y <= box.y + box.h;

  if (inside || coverage > 0.6) {
    return {
      guesses: [
        { part: "forearm", score: 0.54 },
        { part: "wrist", score: 0.27 },
        { part: "hand", score: 0.19 },
      ],
      coverage,
    };
  }
  if (coverage > 0.25) {
    return {
      guesses: [
        { part: "forearm", score: 0.4 },
        { part: "hand", score: 0.33 },
        { part: "wrist", score: 0.27 },
      ],
      coverage,
    };
  }
  return {
    guesses: [
      { part: "hand", score: 0.52 },
      { part: "wrist", score: 0.28 },
      { part: "forearm", score: 0.2 },
    ],
    coverage,
  };
}
