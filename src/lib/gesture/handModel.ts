// MÔ TẢ BÀN TAY — phần dữ liệu THUẦN, không dính React, không dính MediaPipe.
//
// Vì sao tách riêng: `useHandTracking.ts` là một hook React và import cả
// @mediapipe/tasks-vision, nên mọi thứ import từ đó cũng bị kéo theo cả React.
// Phép toán cử chỉ (`gestures.ts`) lại là hàm thuần — tách hằng số và kiểu ra
// đây thì kiểm thử được bằng `node` mà không cần trình duyệt (xem
// `scripts/test-gestures.ts`).

/** Chỉ số landmark hay dùng (MediaPipe Hands, 21 điểm/bàn tay). */
export const LM = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
} as const;

/** Khung xương bàn tay để vẽ overlay. */
export const HAND_BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

export type Landmark = { x: number; y: number; z: number };

export type TrackedHand = {
  /** "Left" | "Right" — đã đảo cho khớp ảnh gương người dùng thấy. */
  handedness: string;
  /** Độ tin cậy của phán đoán trái/phải (0..1) — dưới ~0,6 thì đừng tin. */
  handednessScore: number;
  landmarks: Landmark[];
  /** Đầu ngón trỏ đã lọc rung, toạ độ chuẩn hoá 0..1 (x đã lật gương). */
  cursor: { x: number; y: number };
};

/** Kích thước khung video thật, cần để ánh xạ landmark ↔ pixel màn hình. */
export type FrameInfo = { width: number; height: number };

/** Thông tin kèm mỗi lần gọi `onFrame`. */
export type FrameMeta = {
  /**
   * true = khung này VỪA có kết quả nhận diện mới;
   * false = đang vẽ lại bằng dữ liệu của lần nhận diện gần nhất.
   *
   * Vẽ overlay thì dùng mọi khung (mượt theo màn hình); còn những việc chỉ nên
   * làm một lần cho mỗi lần đo thật (đếm dwell, bắt cử chỉ, cộng dồn di
   * chuyển) thì kiểm cờ này trước.
   */
  fresh: boolean;
};
