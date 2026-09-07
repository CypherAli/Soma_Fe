import { LM, type Landmark } from "@/lib/gesture/handModel";
import { POSE, type PoseLm } from "./bodyRegions";
import type { VisionPartKey } from "./parts";

// XOAY MÔ HÌNH THEO ĐÚNG GÓC CỦA BỘ PHẬN THẬT.
//
// Ý của người dùng: "tay đang đặt đâu thì giải phẫu chuẩn góc độ đấy". Quét
// cẳng tay nằm ngang thì mô hình cũng phải nằm ngang, quét tay trái thì đừng
// hiện tay phải.
//
// ═══ THỨ MÁY BIẾT CHẮC, VÀ THỨ MÁY KHÔNG BIẾT ═══
//
// Đây là chỗ dễ làm ẩu nhất, nên nói rõ trước khi viết một dòng nào:
//
//  ✓ GÓC NGHIÊNG TRONG MẶT PHẲNG ẢNH (roll). Đo từ trục hai mốc — cổ tay →
//    khớp bàn ngón giữa, hay khuỷu → cổ tay. Chỉ là một phép atan2 trên hai
//    điểm nhìn rõ, sai số nhỏ. DÙNG.
//  ✓ TRÁI HAY PHẢI. MediaPipe cho sẵn, và mọi mô hình chi của dự án đều là
//    BÊN PHẢI (đọc mô tả scene: "cẳng tay – bàn tay phải", "chi trên phải",
//    "khối vai phải", "khớp gối phải"). Quét bên trái thì lật gương mô hình —
//    lật một mô hình chi phải đúng bằng một mô hình chi trái, về giải phẫu là
//    hợp lệ. DÙNG.
//  ✗ NGỬA HAY SẤP (nhìn thấy gan tay hay mu tay). Suy được về lý thuyết, nhưng
//    dấu của nó phụ thuộc quy ước lật gương — đúng loại nhầm lẫn đã cắn dự án
//    một lần. Chưa hiệu chỉnh được bằng bàn tay thật thì KHÔNG đoán: để mô hình
//    ở mặt mặc định còn hơn lật sai 180° rồi người học tưởng đó là sự thật.
//  ✗ NGỬA/CÚI VỀ PHÍA CAMERA (pitch). Toạ độ z của MediaPipe là tương đối và
//    nhiễu; suy ra góc từ nó là bịa một con số trông có vẻ chính xác.
//
// Nguyên tắc: chỉ xoay theo thứ đo được, và luôn để người dùng bấm "về vị trí
// ban đầu" — mô hình tự xoay mà không gỡ được thì thành cái bẫy chứ không phải
// tiện ích.

export type PartOrientation = {
  /** Góc nghiêng cần áp cho mô hình, RADIAN, hệ trục của Three.js. */
  rollRad: number;
  /** Lật gương (mô hình dựng sẵn là bên PHẢI, quét bên trái thì lật). */
  mirror: boolean;
  /** Đo được từ đâu — để giao diện nói thật với người dùng. */
  from: "hand" | "pose";
};

/**
 * Hướng "gốc" của các mô hình chi: dựng đứng, đầu xa (bàn tay/bàn chân) hướng
 * LÊN. Góc trong hệ toạ độ ảnh (y hướng xuống) của trục gốc → ngọn khi dựng
 * đứng là -90°.
 */
export const MODEL_UPRIGHT_DEG = -90;

/**
 * Dấu chuyển từ góc ảnh sang góc xoay của mô hình.
 *
 * ĐO CHỨ KHÔNG SUY. Lý thuyết ("trục y của ảnh hướng xuống, của Three.js hướng
 * lên, nên phải đổi dấu") cho ra −1, và ĐO THẬT NGÀY 03/09 CHO THẤY LÀ SAI:
 * đặt rotZ = +90° thì mô hình cẳng tay chỉ ngón sang PHẢI màn hình, −90° thì
 * chỉ sang TRÁI. Tức là trong khung cảnh này, rotZ dương hiện ra thành xoay
 * THEO chiều kim đồng hồ — cùng chiều với chiều tăng của atan2 trên ảnh. Nên
 * hệ số là +1.
 *
 * (Nguyên nhân nằm ở tư thế mô hình và hướng camera của scene; không cần truy
 * tới cùng, nhưng cần ghi rõ đây là con số ĐO ĐƯỢC, để ai đọc sau đừng "sửa
 * lại cho đúng lý thuyết" rồi làm hỏng.)
 */
export const IMAGE_TO_THREE_ROLL = 1;

const deg = (rad: number) => (rad * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

/** Quy góc về khoảng (-180, 180]. */
export function normaliseDeg(d: number): number {
  let x = d;
  while (x > 180) x -= 360;
  while (x <= -180) x += 360;
  return x;
}

/** Góc của trục a→b trong hệ toạ độ ẢNH, tính bằng độ. */
export function axisAngleDeg(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return deg(Math.atan2(b.y - a.y, b.x - a.x));
}

/**
 * Đổi một góc trục đo được trên ảnh thành góc xoay cho mô hình.
 * `uprightDeg` là góc của chính trục ấy khi mô hình đứng ở tư thế gốc.
 */
export function rollFromAxis(axisDeg: number, uprightDeg = MODEL_UPRIGHT_DEG): number {
  return rad(normaliseDeg(axisDeg - uprightDeg)) * IMAGE_TO_THREE_ROLL;
}

/**
 * Hướng suy từ chính bàn tay đang quét — trục cổ tay → khớp bàn ngón giữa.
 * Đây là phép đo chắc chắn nhất trong cả tệp này: hai mốc luôn nhìn rõ và cách
 * nhau đủ xa.
 */
export function orientationFromHand(lms: Landmark[], handedness: string): PartOrientation | null {
  const wrist = lms[LM.WRIST];
  const mid = lms[LM.MIDDLE_MCP];
  if (!wrist || !mid) return null;
  return {
    rollRad: rollFromAxis(axisAngleDeg(wrist, mid)),
    mirror: handedness === "Left",
    from: "hand",
  };
}

/** Cặp mốc pose dựng nên trục của từng vùng, và bên trái/phải tương ứng. */
const POSE_AXIS: Partial<Record<VisionPartKey, [number, number][]>> = {
  // [gốc, ngọn] — ngọn là đầu XA của chi, để trùng quy ước "đầu xa hướng lên"
  forearm: [
    [POSE.ELBOW_L, POSE.WRIST_L],
    [POSE.ELBOW_R, POSE.WRIST_R],
  ],
  "upper-arm": [
    [POSE.SHOULDER_L, POSE.ELBOW_L],
    [POSE.SHOULDER_R, POSE.ELBOW_R],
  ],
  hand: [
    [POSE.WRIST_L, POSE.INDEX_L],
    [POSE.WRIST_R, POSE.INDEX_R],
  ],
  wrist: [
    [POSE.ELBOW_L, POSE.WRIST_L],
    [POSE.ELBOW_R, POSE.WRIST_R],
  ],
  elbow: [
    [POSE.SHOULDER_L, POSE.ELBOW_L],
    [POSE.SHOULDER_R, POSE.ELBOW_R],
  ],
  knee: [
    [POSE.HIP_L, POSE.KNEE_L],
    [POSE.HIP_R, POSE.KNEE_R],
  ],
  foot: [
    [POSE.ANKLE_L, POSE.FOOT_L],
    [POSE.ANKLE_R, POSE.FOOT_R],
  ],
};

const visible = (p?: PoseLm) => !!p && (p.visibility === undefined || p.visibility >= 0.5);

/**
 * Hướng suy từ mốc pose, cho những vùng KHÔNG phải bàn tay.
 *
 * Chỉ làm với các đoạn CHI — đoạn chi có trục rõ ràng nên góc nghiêng có nghĩa.
 * Mặt, cổ, ngực, bụng thì không có "trục" nào để nói, xoay theo là bịa; những
 * vùng ấy trả về null và mô hình giữ nguyên tư thế gốc.
 *
 * @param pose mốc pose ở toạ độ ảnh GỐC — hàm tự lật gương.
 * @param side bên nào (nếu đã biết từ tầng nhận diện); không truyền thì tự chọn
 *   bên nào nhìn rõ hơn.
 */
export function orientationFromPose(
  part: VisionPartKey,
  pose: PoseLm[],
  side?: "left" | "right",
): PartOrientation | null {
  const pairs = POSE_AXIS[part];
  if (!pairs || pose.length < 33) return null;
  const lm: PoseLm[] = pose.map((p) => ({ ...p, x: 1 - p.x }));

  const order: 0[] | 1[] | (0 | 1)[] = side === "left" ? [0] : side === "right" ? [1] : [0, 1];
  for (const i of order) {
    const [from, to] = pairs[i];
    if (!visible(lm[from]) || !visible(lm[to])) continue;
    return {
      rollRad: rollFromAxis(axisAngleDeg(lm[from], lm[to])),
      mirror: i === 0, // chỉ số 0 là bên TRÁI của người, mà mô hình dựng bên phải
      from: "pose",
    };
  }
  return null;
}

/** Ảnh chụp lại mọi thứ cần để suy hướng, ghi ngay lúc bấm chụp. */
export type OrientationSnapshot = {
  hand?: { landmarks: Landmark[]; handedness: string };
  pose?: PoseLm[];
};

/**
 * Hướng cho vùng người dùng vừa chọn.
 *
 * Ưu tiên mốc BÀN TAY khi vùng đó thuộc bàn tay và ta có sẵn mốc — chính xác
 * hơn hẳn mốc pose lúc tay ở gần camera.
 */
export function orientationFor(
  part: VisionPartKey,
  snap: OrientationSnapshot,
): PartOrientation | null {
  const handParts: VisionPartKey[] = ["hand", "wrist"];
  if (snap.hand && handParts.includes(part)) {
    return orientationFromHand(snap.hand.landmarks, snap.hand.handedness);
  }
  if (snap.pose) {
    const fromPose = orientationFromPose(part, snap.pose);
    if (fromPose) return fromPose;
  }
  // Không có mốc pose (tay sát camera) nhưng vẫn có bàn tay: trục cẳng tay
  // suy từ chính bàn tay còn hơn không có gì.
  if (snap.hand && POSE_AXIS[part]) {
    return orientationFromHand(snap.hand.landmarks, snap.hand.handedness);
  }
  return null;
}
