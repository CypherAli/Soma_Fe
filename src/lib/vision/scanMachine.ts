import { isPinching, type FingerState } from "@/lib/gesture/gestures";
import type { Landmark } from "@/lib/gesture/handModel";
import { boxFromHand, boxFromIndexTips, boxIsStable, type Box } from "./framing";

// MÁY TRẠNG THÁI CỦA NHỊP QUÉT — thuần, không React, kiểm thử được bằng node.
//
// HAI CÁCH NGẮM, MÁY TỰ CHỌN THEO SỐ TAY ĐANG THẤY. Không có nút chuyển, không
// phải học chế độ: giơ mấy tay thì ra cách đó.
//
// ┌─ MỘT TAY (cách chính khi quét chi trên) ─────────────────────────────────┐
// │ Giơ MỘT bàn tay xoè ra → ô TỰ ÔM lấy chính bàn tay đó, kéo dài xuống      │
// │ cẳng tay. Giữ yên ~1,4 s là chụp.                                        │
// │                                                                          │
// │ Đây là câu trả lời cho "làm sao cắt được bàn tay của mình": KHÔNG ngắm    │
// │ gì cả. Bắt người ta lấy hai tay vẽ ô rồi nhét tay vào ô là việc bất khả — │
// │ hai tay đang bận thì còn tay nào. Mà vị trí bàn tay thì MediaPipe đã cho  │
// │ sẵn 21 điểm: cắt theo đó vừa luôn đúng, vừa không cần ngắm khéo.          │
// │ Không cần đếm ngược, vì đối tượng vốn đã nằm trong ô.                     │
// └──────────────────────────────────────────────────────────────────────────┘
//
// ┌─ HAI TAY (cho mọi thứ KHÔNG phải bàn tay: mặt, cổ, vai, ngực, gối…) ─────┐
// │ Ô ngắm hiện giữa hai đầu ngón trỏ và đi theo tay: chụm vào là nhỏ lại,    │
// │ giãn ra là to ra, bên trong đổ đen–trắng (đó chính là tấm ảnh sắp chụp).   │
// │ NẮM CHẶT CẢ HAI TAY (hoặc chụm cả hai tay) và giữ ~0,4 giây → CHỤP NGAY    │
// │ đúng vùng trong ô, kể cả hai tay còn nằm trong khung. Không đếm ngược,    │
// │ không rút tay — người dùng muốn "nắm lại là chụp phần đó".                │
// └──────────────────────────────────────────────────────────────────────────┘
//
// KHOẢNG ÂN HẠN 450 ms (PuzzleCam gọi là FRAME_GRACE_MS): nhận diện hụt một
// nhịp thì ô cũ vẫn còn thay vì chớp tắt. Không có nó thì ô nhấp nháy liên tục.

/** Giữ cử chỉ chốt bao lâu thì CHỤP, ở cách hai tay (nắm là chụp ngay). */
export const FREEZE_HOLD_MS = 400;
/** Giữ yên bàn tay bao lâu thì chụp, ở cách một tay (kể cả GIƠ NGANG như ảnh
 *  chụp cẳng tay: trục tay nằm ngang, ô tự bám vẫn bao trọn nhờ boxFromHand đo
 *  trong hệ vuông — chỉ cần giữ yên là chụp, không cần ngắm). */
export const HAND_HOLD_MS = 1200;
export const COUNTDOWN_MS = 3000;
/** Mất dấu tay dưới ngần này thì vẫn giữ ô cũ (chống nhấp nháy). */
export const FRAME_GRACE_MS = 450;
/** A briefly detected second hand must not replace an established scan box. */
export const MODE_HOLD_MS = 180;
/** Số ngón duỗi tối thiểu để coi một bàn tay là ĐỐI TƯỢNG cần quét. */
export const SUBJECT_MIN_FINGERS = 3;
/**
 * Hằng số thời gian làm mượt ô ngắm (ms).
 *
 * Vì sao phải có: nhận diện chỉ chạy ~20 lần/giây còn màn hình vẽ 60 lần/giây,
 * nên ô bám thẳng vào landmark thì vừa GIẬT THEO NHỊP 20 Hz vừa rung theo cái
 * run của tay — người dùng tả đúng là "khựng, không mượt". Làm mượt theo THỜI
 * GIAN THẬT (1 - e^(-dt/τ)) nên ô đi đều ở 60 Hz và không phụ thuộc tốc độ máy.
 * τ nhỏ thì bám sát tay nhưng còn rung; τ lớn thì mượt nhưng trễ. 90 ms làm
 * dịu bước nhảy của landmark thô từ worker; rAF vẫn nội suy ô giữa hai lần đo.
 */
export const SMOOTH_TAU_MS = 90;

/**
 * CỬ CHỈ CHỐT KHUNG (cách hai tay).
 *
 * Nắm đấm là cử chỉ chính — người dùng chốt vậy tự nhiên hơn hẳn chụm ngón, và
 * quan trọng hơn: bản trước lấy nắm đấm làm cử chỉ HUỶ, nên ai nắm hai tay lại
 * để chụp thì máy vừa chốt xong đã tự huỷ ngay, "nắm mãi không ra ảnh". Chụm
 * ngón vẫn được giữ lại vì đã quen tay (và trong thực tế nắm đấm cũng kéo ngón
 * cái sát ngón trỏ nên hai thế này chồng lên nhau).
 */
function isLockPose(f: FingerState): boolean {
  return f.extendedCount === 0 || isPinching(f);
}

export type ScanPhase =
  | "idle" // chưa ngắm được gì
  | "framing" // ô đang chạy theo tay
  | "locking" // đang giữ (chụm hai tay, hoặc giữ yên một tay)
  | "armed" // ô đã đóng băng, đang đếm ngược (chỉ ở cách hai tay)
  | "busy"; // đã chụp, đang kiểm tra/gửi — chờ bên ngoài gọi reset()

/** Ô này do đâu mà có — để giao diện nói đúng câu hướng dẫn. */
export type ScanMode = "none" | "hand" | "frame";

export type ScanState = {
  phase: ScanPhase;
  mode: ScanMode;
  /** Ô ngắm hiện tại (hệ màn hình), hoặc null khi chưa ngắm được. */
  box: Box | null;
  /** 0..1 — vòng giữ khi `locking`, vòng đếm ngược khi `armed`. */
  progress: number;
  /** Số giây còn lại khi đếm ngược (3, 2, 1). */
  countdown: number;
  /** true đúng MỘT lần, ở khung hình mà máy quyết định chụp. */
  shoot: boolean;
};

export type ScanHand = { landmarks: Landmark[]; fingers: FingerState };

export class ScanMachine {
  private phase: ScanPhase = "idle";
  private mode: ScanMode = "none";
  private box: Box | null = null;
  /** Ô mốc để đo "bàn tay đã đứng yên chưa". */
  private anchor: Box | null = null;
  private lastSeenAt = 0;
  private since = 0;
  private progress = 0;
  private missingSince: number | null = null;
  private candidateMode: ScanMode = "none";
  private candidateSince = 0;
  /** Ô đã làm mượt — thứ thực sự vẽ ra và thực sự dùng để cắt. */
  private smooth: Box | null = null;
  private lastNow = 0;
  /**
   * Ô đo được ở khung hình cuối cùng TRƯỚC khi ra cử chỉ chốt.
   *
   * Vì sao phải giữ riêng: ô hai tay đo bằng hai ĐẦU NGÓN TRỎ, mà nắm tay lại
   * thì đầu ngón trỏ cuộn vào lòng bàn tay — ô co rúm lại đúng lúc chốt và ảnh
   * cắt ra bé hơn hẳn thứ người dùng vừa ngắm. Chụp ô của khoảnh khắc TRƯỚC
   * cử chỉ chốt thì cắt đúng cái đã ngắm.
   */
  private framedBox: Box | null = null;

  reset(): void {
    this.phase = "idle";
    this.mode = "none";
    this.box = null;
    this.anchor = null;
    this.lastSeenAt = 0;
    this.since = 0;
    this.progress = 0;
    this.missingSince = null;
    this.candidateMode = "none";
    this.lastNow = 0;
    this.smooth = null;
    this.framedBox = null;
  }

  /**
   * Kéo ô đang vẽ về phía ô vừa đo được, theo thời gian thật.
   * Gọi ở MỌI khung hình (kể cả khung không có dữ liệu nhận diện mới) — đó
   * chính là cách ô đi mượt 60 Hz dù chỉ đo được 20 Hz.
   */
  private smoothTo(target: Box, now: number): Box {
    const dt = Math.min(Math.max(now - this.lastNow, 0), 100);
    this.lastNow = now;
    if (!this.smooth) {
      this.smooth = { ...target };
      return { ...target };
    }
    const k = 1 - Math.exp(-dt / SMOOTH_TAU_MS);
    const s = this.smooth;
    s.x += (target.x - s.x) * k;
    s.y += (target.y - s.y) * k;
    s.w += (target.w - s.w) * k;
    s.h += (target.h - s.h) * k;
    return { ...s };
  }

  /**
   * Gọi mỗi khung hình.
   * @param aspect rộng/cao của khung hình camera (để viền nới đều bốn phía).
   * @param fresh khung này có dữ liệu nhận diện MỚI hay chỉ đang vẽ lại.
   */
  update(hands: ScanHand[], aspect: number, now: number, fresh: boolean): ScanState {
    if (this.phase === "busy") {
      return { phase: "busy", mode: this.mode, box: this.box, progress: 1, countdown: 0, shoot: false };
    }

    const two = hands.length >= 2;
    const bothLock = two && isLockPose(hands[0].fingers) && isLockPose(hands[1].fingers);
    const desiredMode: ScanMode = two ? "frame" : hands.length === 1 ? "hand" : "none";
    if (!fresh && now - this.lastSeenAt > FRAME_GRACE_MS) return this.idleOrGrace(now);
    if (desiredMode !== "none" && this.mode !== "none" && desiredMode !== this.mode) {
      if (this.candidateMode !== desiredMode) {
        this.candidateMode = desiredMode;
        this.candidateSince = now;
      }
      if (!fresh || now - this.candidateSince < MODE_HOLD_MS) return this.idleOrGrace(now);
      this.reset();
    } else if (fresh) {
      this.candidateMode = "none";
    }
    if (this.missingSince !== null && desiredMode !== "none" && fresh) {
      if (now - this.lastSeenAt > FRAME_GRACE_MS) this.reset();
      else {
        // Pause the hold timer during a dropout; do not erase the user's progress.
        this.since += now - this.missingSince;
        this.missingSince = null;
      }
    }

    // ---- CÁCH MỘT TAY: ô tự bám chính bàn tay đang giơ ----
    // Đòi bàn tay XOÈ (>= 3 ngón duỗi) mới coi là đối tượng: đang trỏ hay đang
    // chụm thì đó là cử chỉ điều khiển, chụp lúc đó là chụp nhầm.
    if (hands.length === 1) {
      const h = hands[0];
      const live =
        h.fingers.extendedCount >= SUBJECT_MIN_FINGERS ? boxFromHand(h.landmarks, aspect) : null;
      if (live) {
        const shown = this.smoothTo(live, now);
        this.mode = "hand";
        this.box = shown;
        if (fresh) this.lastSeenAt = now;
        if (!this.anchor || !boxIsStable(this.anchor, shown)) {
          // tay còn đang di chuyển → đặt lại mốc và đồng hồ
          this.anchor = shown;
          this.since = now;
          this.phase = "framing";
          this.progress = 0;
          return { phase: "framing", mode: "hand", box: shown, progress: 0, countdown: 0, shoot: false };
        }
        const held = now - this.since;
        if (held >= HAND_HOLD_MS && fresh) {
          this.phase = "busy";
          return { phase: "busy", mode: "hand", box: shown, progress: 1, countdown: 0, shoot: true };
        }
        this.phase = "locking";
        this.progress = Math.min(held / HAND_HOLD_MS, 0.99);
        return {
          phase: "locking",
          mode: "hand",
          box: shown,
          progress: this.progress,
          countdown: 0,
          shoot: false,
        };
      }
      // một tay nhưng đang trỏ/chụm → coi như chưa ngắm gì
      return this.idleOrGrace(now);
    }

    // ---- CÁCH HAI TAY: ô giữa hai đầu ngón trỏ ----
    const live = two ? boxFromIndexTips(hands[0].landmarks, hands[1].landmarks, aspect) : null;

    if (bothLock) {
      // ĐANG CHỐT: ô ĐỨNG YÊN ở chỗ vừa ngắm, không bám theo tay nữa. Nắm tay
      // lại là đầu ngón trỏ cuộn vào trong, ô đo mới sẽ co lại — bám theo nó
      // thì cắt hụt đúng thứ vừa ngắm.
      const shown = this.framedBox ?? (live ? this.smoothTo(live, now) : this.box);
      if (!shown) return this.idleOrGrace(now);
      this.mode = "frame";
      this.box = shown;
      this.framedBox = shown;
      if (fresh) this.lastSeenAt = now;
      this.anchor = null;

      if (this.phase !== "locking") {
        this.phase = "locking";
        this.since = now;
        this.progress = 0;
        return { phase: "locking", mode: "frame", box: shown, progress: 0, countdown: 0, shoot: false };
      }
      const held = now - this.since;
      if (held >= FREEZE_HOLD_MS && fresh) {
        // NẮM LÀ CHỤP NGAY đúng ô đã ngắm (framedBox — ô trước lúc nắm, vì
        // nắm vào là đầu ngón trỏ cuộn lại làm ô đo mới co rúm).
        this.phase = "busy";
        return { phase: "busy", mode: "frame", box: shown, progress: 1, countdown: 0, shoot: true };
      }
      this.progress = Math.min(held / FREEZE_HOLD_MS, 0.99);
      return {
        phase: "locking",
        mode: "frame",
        box: shown,
        progress: this.progress,
        countdown: 0,
        shoot: false,
      };
    }

    if (!live) return this.idleOrGrace(now);

    const shown = this.smoothTo(live, now);
    this.mode = "frame";
    this.box = shown;
    this.framedBox = shown;
    if (fresh) this.lastSeenAt = now;
    this.anchor = null;

    // Buông cử chỉ chốt giữa chừng thì bỏ tiến trình — nhưng chỉ khi có dữ liệu
    // nhận diện MỚI, để một nhịp đọc hụt không xoá công giữ tay.
    if (fresh || this.phase === "idle") { this.phase = "framing"; this.progress = 0; }
    return { phase: this.phase, mode: "frame", box: shown, progress: this.progress, countdown: 0, shoot: false };
  }

  /** Không ngắm được gì: giữ ô cũ trong khoảng ân hạn rồi mới buông. */
  private idleOrGrace(now: number): ScanState {
    if (now - this.lastSeenAt > FRAME_GRACE_MS) {
      this.reset();
      return { phase: "idle", mode: "none", box: null, progress: 0, countdown: 0, shoot: false };
    }
    if (this.missingSince === null) this.missingSince = now;
    return {
      phase: this.phase,
      mode: this.mode,
      box: this.box,
      progress: this.progress,
      countdown: 0,
      shoot: false,
    };
  }
}
