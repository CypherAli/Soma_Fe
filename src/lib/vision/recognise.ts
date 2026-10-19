import { guessFromArmChain, guessFromPose, handPathFallback } from "./bodyRegions";
import type { Box } from "./framing";
import type { Landmark } from "@/lib/gesture/handModel";
import { withTiers, type ConfidenceTier, type VisionGuess } from "./parts";
import type { PoseResult } from "./poseOnce";

// BỘ ĐIỀU PHỐI NHẬN DIỆN HAI TẦNG — tách khỏi component để KIỂM THỬ ĐƯỢC.
//
// Trước đây khối này nằm lẫn trong trang, và đó là chỗ yếu nhất của cả tính
// năng: nó có tới sáu nhánh (mốc đủ tin / mốc yếu / mốc quá hạn / GPU kịp /
// GPU trễ / người dùng đã chọn) mà không một khẳng định nào canh. Ở đây mọi
// thứ bên ngoài — Pose, GPU, đồng hồ — đều tiêm vào qua `deps`, nên kiểm thử
// dựng được đúng từng tình huống mà không cần webcam lẫn máy chủ.
//
// THỨ TỰ ƯU TIÊN, và lý do:
//   1. MỐC GIẢI PHẪU (trên máy, ~30 ms). Trùng khít thì DỪNG — không tốn một
//      vòng mạng nào. Nhanh nhất, lại giải thích được.
//   2. GPU chỉ là lưới an toàn cho ca mốc không thấy gì.
//   3. Không bao giờ để màn hình trống trong lúc chờ: có gì hiện nấy, rồi mới
//      nâng cấp. Nhưng một khi NGƯỜI DÙNG ĐÃ CHỌN thì cấm đổi kết quả dưới tay
//      họ — kết quả về muộn bị bỏ, không phải vì nó sai mà vì đổi lúc đó là
//      giật mất thứ người ta đang bấm.

/** Chờ tầng mốc tối đa (ms). Đo thật: suy luận 25–41 ms, nhưng lần đầu phải dựng model mất tới ~11 giây. */
export const POSE_BUDGET_MS = 1200;
/** IoU tối thiểu để tin hẳn mốc giải phẫu và bỏ qua GPU. */
export const POSE_TRUST_IOU = 0.28;
/**
 * Dưới ngưỡng này thì ĐỪNG ghi "từ mốc giải phẫu" nữa mà ghi "phỏng đoán thô".
 *
 * Đo thật trên người thật cho thấy vì sao cần: có lần ba ứng viên ra 39/37/25 —
 * ba con số xấp xỉ nhau nghĩa là KHÔNG cái nào khớp, vậy mà trang vẫn ghi "từ
 * mốc giải phẫu" như thể chắc chắn. Điểm chuẩn hoá luôn cộng lại bằng 1 nên
 * không nói lên độ khớp; chỉ IoU thô mới nói được.
 */
export const POSE_CLAIM_IOU = 0.16;
/** Chờ GPU tối đa (ms) — ngưỡng "cảm giác tức thì". */
export const GPU_BUDGET_MS = 800;

export type ResultSource = { kind: "pose" | "gpu" | "fallback"; ms: number };
export type RecogniseFailure = "low" | "failed" | "offline" | null;

/**
 * Trả lời của tầng GPU. Phân biệt "chưa cấu hình dịch vụ" với "hỏi rồi mà không
 * ra gì": hai chuyện đó cần hai câu nói khác nhau với người dùng, gộp lại là
 * bắt họ đoán xem hệ thống hỏng hay ảnh khó.
 */
export type GpuAnswer = { rows: VisionGuess[] | null; offline?: boolean };

export type RecogniseUpdate = {
  guesses: VisionGuess[];
  source: ResultSource | null;
  failure: RecogniseFailure;
};

export type RecogniseDeps = {
  /** Chạy Pose trên cả khung hình vừa chụp. */
  pose: () => Promise<PoseResult>;
  /** Hỏi dịch vụ GPU. */
  gpu: () => Promise<GpuAnswer>;
  /** Hẹn giờ — tiêm vào để kiểm thử không phải chờ thật. */
  wait: (ms: number) => Promise<void>;
  /** Người dùng đã chọn vùng chưa. */
  picked: () => boolean;
  /** Đẩy kết quả ra giao diện. Có thể được gọi NHIỀU LẦN (hiện tạm rồi nâng cấp). */
  emit: (update: RecogniseUpdate) => void;
};

/**
 * Kết quả của một cuộc đua có hạn giờ, gói dưới dạng có nhãn.
 * Dùng nhãn `ok` chứ không dùng một giá trị canh chừng: TypeScript thu hẹp kiểu
 * theo nhãn thì chắc chắn, còn so sánh với một symbol thì không thu hẹp được và
 * phải ép kiểu — chỗ nào phải ép kiểu là chỗ đó dễ sai về sau.
 */
type Raced<T> = { ok: true; value: T } | { ok: false };

function withDeadline<T>(work: Promise<T>, ms: number, wait: (ms: number) => Promise<void>): Promise<Raced<T>> {
  return Promise.race<Raced<T>>([
    work.then((value) => ({ ok: true, value })),
    wait(ms).then(() => ({ ok: false })),
  ]);
}

export async function recognise(
  box: Box,
  aspect: number,
  /**
   * Cổ tay của bàn tay đã sinh ra ô này (hệ màn hình), hoặc null nếu ô do hai
   * tay ngắm. Có nó thì chuyển hẳn sang lối suy theo CHUỖI CHI TRÊN.
   */
  handWrist: Landmark | null,
  deps: RecogniseDeps,
): Promise<void> {
  const fromHand = handWrist !== null;
  const posePromise = deps.pose();

  const localOf = (p: PoseResult) => {
    if (p.landmarks.length < 33) return null;
    if (handWrist) {
      // Đã biết chắc trong ô có bàn tay: chỉ còn tách bàn tay / cổ tay / cẳng
      // tay, và KHÔNG bao giờ để "mặt" lọt vào — giơ tay ngang mặt là chuyện
      // thường, ô chồng lên mặt không có nghĩa là đang quét mặt.
      const arm = guessFromArmChain(box, handWrist, p.landmarks);
      // Mức tin cậy theo HÌNH HỌC: ô ôm hẳn khuỷu / không chạm cẳng tay là rõ;
      // lấn nửa vời là "có thể"; không thấy khuỷu thì chỉ còn đoán.
      const tier: ConfidenceTier = arm.decisive ? "clear" : arm.coverage > 0 ? "maybe" : "unsure";
      return { guesses: withTiers(arm.guesses, tier), bestIou: 1 };
    }
    const g = guessFromPose(box, p.landmarks, aspect);
    const tier: ConfidenceTier =
      g.bestIou >= POSE_TRUST_IOU ? "clear" : g.bestIou >= POSE_CLAIM_IOU ? "maybe" : "unsure";
    return { guesses: withTiers(g.guesses, tier), bestIou: g.bestIou };
  };
  /** Đường lui khi Pose không giúp được: ba ứng viên, không cái nào được nói là chắc. */
  const fallback = () => withTiers(handPathFallback(), "unsure");

  const emitPose = (p: PoseResult): boolean => {
    const l = localOf(p);
    if (!l || l.guesses.length === 0) return false;
    deps.emit({
      guesses: l.guesses,
      // Khớp yếu thì gọi đúng tên là phỏng đoán thô, đừng khoác áo "mốc giải phẫu".
      source: { kind: l.bestIou >= POSE_CLAIM_IOU ? "pose" : "fallback", ms: Math.round(p.ms) },
      failure: null,
    });
    return true;
  };

  const first = await withDeadline(posePromise, POSE_BUDGET_MS, deps.wait);

  // ---- Mốc quá hạn (hầu như chỉ xảy ra ở lần quét đầu, lúc model còn đang dựng) ----
  if (!first.ok) {
    void posePromise.then((p) => {
      if (!deps.picked()) emitPose(p);
    });
    if (fromHand) {
      deps.emit({ guesses: fallback(), source: { kind: "fallback", ms: 0 }, failure: null });
    }
    const late = await deps.gpu();
    if (late.rows?.length && !deps.picked()) {
      deps.emit({ guesses: late.rows, source: { kind: "gpu", ms: 0 }, failure: null });
    } else if (!fromHand) {
      deps.emit({ guesses: [], source: null, failure: late.offline ? "offline" : "low" });
    }
    return;
  }

  const pose = first.value;
  const local = localOf(pose);

  // ---- Mốc trùng khít: biết chắc, dừng luôn ----
  if (local && local.bestIou >= POSE_TRUST_IOU) {
    emitPose(pose);
    return;
  }

  // ---- Mốc yếu: hiện tạm để không ai phải nhìn màn hình trống ----
  const weak: VisionGuess[] = local?.guesses.length
    ? local.guesses
    : fromHand
      ? fallback()
      : [];
  if (weak.length) {
    deps.emit({
      guesses: weak,
      source: {
        kind: local?.guesses.length && local.bestIou >= POSE_CLAIM_IOU ? "pose" : "fallback",
        ms: Math.round(pose.ms),
      },
      failure: null,
    });
  }

  // ---- Lưới an toàn: hỏi GPU, chờ có hạn ----
  const gpuPromise = deps.gpu();
  const raced = await withDeadline(gpuPromise, GPU_BUDGET_MS, deps.wait);

  const applyGpu = (answer: GpuAnswer) => {
    if (answer.rows?.length) {
      deps.emit({ guesses: answer.rows, source: { kind: "gpu", ms: 0 }, failure: null });
      return true;
    }
    return false;
  };

  if (raced.ok) {
    if (!applyGpu(raced.value) && weak.length === 0) {
      // Không mốc, không GPU: nói THẲNG là vì sao, đừng bịa và cũng đừng gộp
      // "chưa cấu hình dịch vụ" chung với "ảnh này khó quá".
      deps.emit({
        guesses: [],
        source: null,
        failure: raced.value.offline
          ? "offline"
          : pose.reason === "no-model"
            ? "failed"
            : "low",
      });
    }
    return;
  }

  // Quá hạn: giữ nguyên thứ đang hiện, vẫn đợi mạng ở nền.
  void gpuPromise.then((answer) => {
    if (!deps.picked()) applyGpu(answer);
  });
  if (weak.length === 0) deps.emit({ guesses: [], source: null, failure: "low" });
}
