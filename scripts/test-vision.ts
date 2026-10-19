// KIỂM THỬ TẦNG VISION AI — chạy: npm run test:vision
//
// Cùng lý do với test-gestures: phần này chỉ nghiệm thu được bằng cách giơ tay
// trước webcam, mà sửa một ngưỡng là có thể phá thứ khác không ai thấy ngay.
// Ở đây dựng khung/ảnh bằng số rồi khẳng định mã cư xử đúng, chạy trong node.
//
// Bài kiểm quan trọng nhất là bài cuối: MỌI slug scene gợi ý phải tồn tại thật
// trong sceneModules — gợi ý một slug không có thật là dẫn người dùng vào trang 404.

import {
  VISION_PARTS,
  VISION_PART_KEYS,
  getVisionPart,
  isVisionPartKey,
  rankGuesses,
  type VisionGuess,
} from "../src/lib/vision/parts.ts";
import {
  CROP_SIZE,
  FRAME_PAD,
  MIN_CROP_PX,
  assessCrop,
  boxFromHand,
  boxFromIndexTips,
  boxToSourceRect,
  clampBox,
  fitContain,
} from "../src/lib/vision/framing.ts";
import {
  FRAME_GRACE_MS,
  FREEZE_HOLD_MS,
  HAND_HOLD_MS,
  ScanMachine,
} from "../src/lib/vision/scanMachine.ts";
import {
  POSE,
  guessFromArmChain,
  guessFromPose,
  handPathFallback,
  segmentCoverage,
  iou,
  type PoseLm,
} from "../src/lib/vision/bodyRegions.ts";
import {
  GPU_BUDGET_MS,
  POSE_BUDGET_MS,
  recognise,
  type GpuAnswer,
  type RecogniseUpdate,
} from "../src/lib/vision/recognise.ts";
import type { PoseResult } from "../src/lib/vision/poseOnce.ts";
import {
  IMAGE_TO_THREE_ROLL,
  MODEL_UPRIGHT_DEG,
  atlasRoll,
  mirrorFor,
  sideFromCenterX,
  axisAngleDeg,
  normaliseDeg,
  orientationFor,
  orientationFromHand,
  orientationFromPose,
  rollFromAxis,
} from "../src/lib/vision/orientation.ts";
import { sceneModules } from "../src/lib/sceneModules.ts";
import { atlasScenes } from "../src/lib/humanAtlas/scenes/index.ts";
import { atlasLayerDefs, getControlModel, getGlbModel, initAtlasLayers } from "../src/lib/anatomy/controlModels.ts";
import { gpuTier, withTiers } from "../src/lib/vision/parts.ts";
import { createLimiter, sameOrigin } from "../src/lib/rateLimit.ts";
import { LM, type Landmark } from "../src/lib/gesture/handModel.ts";
import type { FingerState } from "../src/lib/gesture/gestures.ts";

let failed = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) console.log(`  ok   ${name}`);
  else {
    failed += 1;
    console.log(`  FAIL ${name}${extra ? " — " + extra : ""}`);
  }
}

const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) < tol;

// ---------------------------------------------------------------- dựng dữ liệu

/** FingerState tối thiểu; `pinch` = đang chụm ngón cái vào ngón trỏ. */
function fingers(over: Partial<FingerState> = {}): FingerState {
  return {
    index: true,
    middle: false,
    ring: false,
    pinky: false,
    thumbOut: true,
    pinchSpan: 1.2,
    angle: 0,
    extendedCount: 1,
    ...over,
  };
}

const pinched = () => fingers({ pinchSpan: 0.1 });

/**
 * Bàn tay tối thiểu nhưng ĐỦ để tính cỡ bàn tay: cổ tay và hai khớp bàn phải có
 * thật, vì mọi ngưỡng đều chuẩn hoá theo khoảng cách cổ tay–khớp bàn. Đặt tất cả
 * landmark vào một điểm thì cỡ bàn tay bằng 0 và độ mở hai tay hoá vô cực.
 * `x` là toạ độ MÀN HÌNH — đúng thứ `useHandTracking` trả ra (đã lật gương sẵn).
 */
function hand(x: number, y = 0.5, f: FingerState = fingers()) {
  const lms: Landmark[] = Array.from({ length: 21 }, () => ({ x, y, z: 0 }));
  lms[LM.WRIST] = { x, y: y + 0.1, z: 0 };
  lms[LM.INDEX_MCP] = { x: x + 0.05, y, z: 0 };
  lms[LM.PINKY_MCP] = { x: x - 0.05, y, z: 0 };
  lms[LM.INDEX_TIP] = { x, y: y - 0.05, z: 0 };
  return { landmarks: lms, fingers: f };
}

/** Bàn tay XOÈ: đầu ngón trải ra phía trên nên bao lồi có diện tích thật. */
function openHand(x: number, y = 0.5) {
  const h = hand(x, y, fingers({ middle: true, ring: true, pinky: true, extendedCount: 4 }));
  const tips = [LM.THUMB_TIP, LM.INDEX_TIP, LM.MIDDLE_TIP, LM.RING_TIP, LM.PINKY_TIP];
  tips.forEach((t, i) => {
    h.landmarks[t] = { x: x - 0.06 + i * 0.03, y: y - 0.12, z: 0 };
  });
  return h;
}

/** Bàn tay ĐANG NẮM: không ngón nào duỗi (cử chỉ chốt khung mới). */
const fisted = () => fingers({ index: false, thumbOut: false, pinchSpan: 1.2, extendedCount: 0 });

/** Ảnh RGBA đặc một màu. */
function flatImage(size: number, value: number) {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = value;
    data[i * 4 + 1] = value;
    data[i * 4 + 2] = value;
    data[i * 4 + 3] = 255;
  }
  return { data, width: size, height: size };
}

/** Ảnh caro 1 pixel — trường hợp NÉT nhất có thể. */
function checkerImage(size: number, lo = 60, hi = 200) {
  const img = flatImage(size, 0);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = (x + y) % 2 === 0 ? hi : lo;
      const p = (y * size + x) * 4;
      img.data[p] = v;
      img.data[p + 1] = v;
      img.data[p + 2] = v;
    }
  }
  return img;
}

// ------------------------------------------------------------------- ô ngắm

const ASPECT = 16 / 9;

console.log("\nÔ ngắm giữa hai đầu ngón trỏ");
{
  const box = boxFromIndexTips(hand(0.3, 0.35).landmarks, hand(0.7, 0.75).landmarks, ASPECT);
  check("có ô ngắm khi hai tay đủ xa nhau", !!box);
  check(
    "ô bao trọn hai đầu ngón trỏ và nới thêm viền đệm",
    !!box && box.x < 0.3 && box.y < 0.35 && box.x + box.w > 0.7 && box.y + box.h > 0.75,
    JSON.stringify(box),
  );
  check(
    "viền đệm dày ĐỀU bốn phía tính theo pixel",
    !!box && near((box.w - 0.4) / 2, FRAME_PAD, 1e-9) && near((box.h - 0.4) / 2, FRAME_PAD * ASPECT, 1e-9),
    JSON.stringify(box),
  );
}
check(
  "đổi thứ tự hai tay vẫn ra đúng ô đó",
  (() => {
    const a = boxFromIndexTips(hand(0.3, 0.35).landmarks, hand(0.7, 0.75).landmarks, ASPECT);
    const b = boxFromIndexTips(hand(0.7, 0.75).landmarks, hand(0.3, 0.35).landmarks, ASPECT);
    return !!a && !!b && near(a.x, b.x) && near(a.y, b.y) && near(a.w, b.w) && near(a.h, b.h);
  })(),
);
check(
  "KHÔNG cần tư thế tay đặc biệt: nắm tay, xoè tay đều ngắm được",
  !!boxFromIndexTips(
    hand(0.3, 0.35, fingers({ index: false, extendedCount: 0 })).landmarks,
    hand(0.7, 0.75, fingers({ middle: true, ring: true, pinky: true, extendedCount: 4 })).landmarks,
    ASPECT,
  ),
);
check(
  "hai tay sát nhau thì không tính là đang ngắm",
  boxFromIndexTips(hand(0.5, 0.5).landmarks, hand(0.5, 0.5).landmarks, ASPECT) === null,
);
check("ô luôn nằm trọn trong khung hình", (() => {
  const b = boxFromIndexTips(hand(0.02, 0.02).landmarks, hand(0.98, 0.98).landmarks, ASPECT);
  return !!b && b.x >= 0 && b.y >= 0 && b.x + b.w <= 1 + 1e-9 && b.y + b.h <= 1 + 1e-9;
})());
check("clampBox kẹp đúng", (() => {
  const b = clampBox({ x: -0.3, y: 0.9, w: 0.5, h: 0.5 });
  return b.x === 0 && near(b.y, 0.9) && near(b.h, 0.1);
})());

console.log("\nĐưa về ảnh vuông mà không bóp méo");
{
  const f = fitContain(400, 200, CROP_SIZE);
  check("ảnh ngang: vừa theo chiều rộng, giữ nguyên tỉ lệ 2:1", f.dw === CROP_SIZE && f.dh === CROP_SIZE / 2);
  check("ảnh ngang: viền xám chia đều trên–dưới", f.dx === 0 && f.dy === Math.round(CROP_SIZE / 4));
  const g = fitContain(200, 400, CROP_SIZE);
  check("ảnh dọc: vừa theo chiều cao, viền chia đều trái–phải", g.dh === CROP_SIZE && g.dx === Math.round(CROP_SIZE / 4));
  const h = fitContain(300, 300, CROP_SIZE);
  check("ảnh vuông thì phủ kín, không viền", h.dw === CROP_SIZE && h.dx === 0 && h.dy === 0);
}

console.log("\nCắt ảnh (đúng ô đã ngắm + lật gương)");
{
  const r = boxToSourceRect({ x: 0.0, y: 0.25, w: 0.25, h: 0.5 }, 1280, 720);
  check("cắt ĐÚNG tỉ lệ của ô, không ép vuông", r.sw === 320 && r.sh === 360, JSON.stringify(r));
  check("vùng cắt nằm trọn trong ảnh", r.sx >= 0 && r.sy >= 0 && r.sx + r.sw <= 1280 && r.sy + r.sh <= 720, JSON.stringify(r));
  check(
    "ô ở MÉP TRÁI màn hình phải cắt ở MÉP PHẢI ảnh camera (lật gương)",
    r.sx + r.sw > 1280 * 0.9,
    JSON.stringify(r),
  );
}
{
  const r = boxToSourceRect({ x: 0.4, y: 0.4, w: 0.2, h: 0.2 }, 1280, 720);
  check("ô giữa màn hình thì cắt ở giữa ảnh", Math.abs(r.sx + r.sw / 2 - 640) < 1, JSON.stringify(r));
}
{
  const r = boxToSourceRect({ x: 0, y: 0, w: 1, h: 1 }, 1280, 720);
  check("ô phủ kín thì cắt cả khung hình", r.sx === 0 && r.sy === 0 && r.sw === 1280 && r.sh === 720);
}


console.log("\nCổng chất lượng ảnh");
check("ảnh nét, đủ sáng, đủ lớn → qua", assessCrop(checkerImage(64), 400).ok);
check("ảnh phẳng lì (mất nét) → chặn", assessCrop(flatImage(64, 130), 400).reason === "blurry");
check("ảnh tối → chặn", assessCrop(checkerImage(64, 2, 10), 400).reason === "too-dark");
check("ảnh cháy sáng → chặn", assessCrop(checkerImage(64, 250, 255), 400).reason === "too-bright");
check(
  "vùng cắt quá nhỏ trên ảnh gốc → chặn dù ảnh gửi vào đã phóng to",
  assessCrop(checkerImage(CROP_SIZE), MIN_CROP_PX - 1).reason === "too-small",
);
// Những ô HẸP-DÀI là thứ người dùng thật sự cần (dải ngang hai mắt, vành tai,
// dải miệng). Bản trước đo cạnh NGẮN nên chặn oan cả ba — đo thật 03/09.
check(
  "dải ngang hai mắt (700×72) phải QUA được",
  assessCrop(checkerImage(CROP_SIZE), 700, 72).ok,
);
check("ô vành tai (179×158) phải QUA được", assessCrop(checkerImage(CROP_SIZE), 179, 158).ok);
check("dải miệng (205×58) phải QUA được", assessCrop(checkerImage(CROP_SIZE), 205, 58).ok);
check(
  "nhưng ô như sợi chỉ (38×22) vẫn bị chặn",
  assessCrop(checkerImage(CROP_SIZE), 38, 22).reason === "too-small",
);
check(
  "ô dài nhưng mỏng dính (400×20) cũng bị chặn",
  assessCrop(checkerImage(CROP_SIZE), 400, 20).reason === "too-small",
);

// ---------------------------------------------------------------- máy trạng thái

console.log("\nÔ tự bám bàn tay (cách quét chính tay mình)");
{
  const box = boxFromHand(openHand(0.5).landmarks, ASPECT);
  check("giơ một bàn tay là có ô ngay", !!box);
  check("ô bao trọn cả bàn tay", !!box && box.x < 0.44 && box.x + box.w > 0.56 && box.y < 0.38, JSON.stringify(box));
  check("ô kéo dài XUỐNG phía cẳng tay", !!box && box.y + box.h > 0.65, JSON.stringify(box));
}
{
  const m = new ScanMachine();
  let t = 0;
  const s0 = m.update([openHand(0.5)], ASPECT, t, true);
  check("một tay xoè thì ô TỰ BÁM tay, không phải ô ngắm hai tay", s0.mode === "hand" && !!s0.box);
  t += 40;
  const s1 = m.update([openHand(0.5)], ASPECT, t, true);
  check("giữ yên thì vòng tiến trình chạy", s1.phase === "locking" && s1.progress > 0);
  t += HAND_HOLD_MS;
  check("giữ đủ lâu là CHỤP LUÔN, không đếm ngược", m.update([openHand(0.5)], ASPECT, t, true).shoot === true);
}
{
  const m = new ScanMachine();
  let t = 0;
  m.update([openHand(0.3)], ASPECT, t, true);
  for (let i = 1; i <= 6; i++) {
    t += 120;
    check(`tay còn di chuyển (nhịp ${i}) thì chưa chụp`, m.update([openHand(0.3 + i * 0.06)], ASPECT, t, true).shoot === false);
  }
}
{
  const m = new ScanMachine();
  const pointing = [hand(0.5, 0.5, fingers({ extendedCount: 1 }))];
  let t = 0;
  m.update(pointing, ASPECT, t, true);
  t += HAND_HOLD_MS + 500;
  check("tay đang TRỎ thì không bao giờ tự chụp", m.update(pointing, ASPECT, t, true).shoot === false);
}

console.log("\nỔn định quét khi nhận diện hụt hoặc đổi số tay");
{
  const m = new ScanMachine();
  const open = [openHand(0.5)];
  m.update(open, ASPECT, 0, true);
  const held = m.update(open, ASPECT, 600, true);
  const missing = m.update([], ASPECT, 700, true);
  check("hụt tay ngắn không trả tiến trình về 0", missing.progress === held.progress && missing.phase === held.phase);
  const resumed = m.update(open, ASPECT, 800, true);
  check("thời gian mất dấu không được tính vào giữ yên", Math.abs(resumed.progress - 700 / HAND_HOLD_MS) < .01);
  check("mất dấu dài phải bỏ vùng cũ", m.update([], ASPECT, 1400, true).box === null);
  check("tay quay lại sau mất dấu dài phải giữ lại từ đầu", m.update(open, ASPECT, 1450, true).progress === 0);
}
{
  const m = new ScanMachine();
  const open = [openHand(0.5)];
  m.update(open, ASPECT, 0, true);
  const held = m.update(open, ASPECT, 600, true);
  const stray = m.update([open[0], hand(.72,.78)], ASPECT, 700, true);
  check("tay thứ hai thoáng xuất hiện không làm khung quét nhảy", stray.mode === 'hand' && stray.box?.x === held.box?.x && stray.progress === held.progress);
  const resumed = m.update(open, ASPECT, 780, true);
  check("một tay vẫn tiếp tục đúng chế độ sau nhịp nhiễu", resumed.mode === 'hand' && resumed.progress > 0);
  m.update([open[0], hand(.72,.78)], ASPECT, 850, true);
  check("hai tay xuất hiện ổn định mới đổi chế độ", m.update([open[0], hand(.72,.78)], ASPECT, 1050, true).mode === 'frame');
}
{
  const m = new ScanMachine();
  const open = [openHand(0.5)];
  m.update(open, ASPECT, 0, true);
  m.update(open, ASPECT, 1000, true);
  check("vẽ lại dữ liệu cũ không được tự chụp", !m.update(open, ASPECT, 1250, false).shoot);
  check("chụp cần lần xác nhận mới từ nhận diện", m.update(open, ASPECT, 1270, true).shoot);
}
{
  const m = new ScanMachine();
  m.update([openHand(.5)], ASPECT, 0, true);
  m.update([openHand(.5)], ASPECT, 700, true);
  const pair = [hand(.3,.3,fisted()), hand(.72,.78,fisted())];
  m.update(pair, ASPECT, 800, true);
  const switched = m.update(pair, ASPECT, 1000, true);
  check("đổi sang chốt hai tay không được dùng đồng hồ giữ một tay", !switched.shoot && switched.progress === 0);
  check("chốt hai tay phải giữ đủ thời gian riêng", m.update(pair, ASPECT, 1000 + FREEZE_HOLD_MS + 1, true).shoot);
}

console.log("\nNhịp quét (ngắm → nắm giữ → CHỤP NGAY)");
{
  const m = new ScanMachine();
  const pair = () => [hand(0.3, 0.3), hand(0.72, 0.78)];
  const pinchPair = () => [hand(0.3, 0.3, pinched()), hand(0.72, 0.78, pinched())];
  let t = 1000;

  check("chưa đủ hai tay thì chưa có ô", m.update([hand(0.3, 0.3)], ASPECT, t, true).box === null);
  const framing = m.update(pair(), ASPECT, t, true);
  check("hai tay vào khung là có ô ngay, KHÔNG cần tư thế gì", framing.phase === "framing" && !!framing.box);

  const lock0 = m.update(pinchPair(), ASPECT, t, true);
  check("chụm cả hai tay là bắt đầu giữ", lock0.phase === "locking");
  t += FREEZE_HOLD_MS / 2;
  const half = m.update(pinchPair(), ASPECT, t, true);
  check("giữ nửa chừng thì vòng tiến trình chạy được nửa", half.phase === "locking" && Math.abs(half.progress - 0.5) < 0.01);
  t += FREEZE_HOLD_MS / 2 + 10;
  const shot = m.update(pinchPair(), ASPECT, t, true);
  check("giữ đủ lâu thì NẮM LÀ CHỤP NGAY, không đếm ngược", shot.phase === "busy" && shot.shoot === true && !!shot.box);
  check("cờ chụp KHÔNG bắn lại ở khung sau", m.update(pinchPair(), ASPECT, t + 16, true).shoot === false);
  m.reset();
  check("reset xong thì về chờ và bỏ ô", (() => {
    const a = m.update([], ASPECT, t + 32, true);
    return a.phase === "idle" && a.box === null;
  })());
}
{
  // GIỮ NGUYÊN thế chụm/nắm thì đã CHỤP chứ không bao giờ tự huỷ — không còn
  // pha đếm ngược để mà huỷ nhầm nữa.
  const m = new ScanMachine();
  const pinchPair = () => [hand(0.3, 0.3, pinched()), hand(0.72, 0.78, pinched())];
  let t = 0;
  m.update(pinchPair(), ASPECT, t, true);
  t += FREEZE_HOLD_MS + 20;
  const shot = m.update(pinchPair(), ASPECT, t, true);
  check("giữ đủ lâu là chụp", shot.shoot === true && shot.phase === "busy");
  t += 500;
  check(
    "GIỮ NGUYÊN thế chụm sau khi chụp thì máy bận, không bắn thêm",
    m.update(pinchPair(), ASPECT, t, true).shoot === false,
  );
}
{
  // BUÔNG TAY giữa chừng (chưa giữ đủ lâu) thì KHÔNG chụp — ô quay về ngắm.
  const m = new ScanMachine();
  const pinchPair = () => [hand(0.3, 0.3, pinched()), hand(0.72, 0.78, pinched())];
  const pair = () => [hand(0.3, 0.3), hand(0.72, 0.78)];
  let t = 0;
  m.update(pair(), ASPECT, t, true);
  m.update(pinchPair(), ASPECT, t, true);
  t += FREEZE_HOLD_MS / 2;
  m.update(pinchPair(), ASPECT, t, true);
  t += 100;
  const released = m.update(pair(), ASPECT, t, true);
  check("buông chụm trước khi đủ giữ thì chưa chụp", released.shoot === false && released.phase !== "busy");
}
{
  // ĐÚNG THỨ NGƯỜI DÙNG YÊU CẦU: "hai tay nắm lại là chụp phần đó".
  // Nắm cả hai tay, giữ đủ giữ là CHỤP NGAY đúng chỗ vừa ngắm.
  const m = new ScanMachine();
  const pair = () => [hand(0.3, 0.3), hand(0.72, 0.78)];
  const fistPair = () => [hand(0.3, 0.3, fisted()), hand(0.72, 0.78, fisted())];
  let t = 0;
  const framing = m.update(pair(), ASPECT, t, true);
  check("ngắm bằng hai tay: có ô", framing.phase === "framing" && !!framing.box);
  const aimed = framing.box!;
  check("nắm cả hai tay là bắt đầu chốt", m.update(fistPair(), ASPECT, t, true).phase === "locking");
  t += FREEZE_HOLD_MS + 20;
  const shot = m.update(fistPair(), ASPECT, t, true);
  check("giữ đủ lâu thì chụp ngay", shot.shoot === true && shot.phase === "busy");
  check(
    "ô chụp ĐÚNG chỗ vừa ngắm, không co lại theo nắm đấm",
    !!shot.box && near(shot.box.x, aimed.x) && near(shot.box.w, aimed.w),
    JSON.stringify({ shot: shot.box, aimed }),
  );
}
{
  // Sau khi chụp, máy bận cho tới khi bấm "Quét lại" (reset) — nắm thêm cũng
  // không bắn cờ chụp lần nữa.
  const m = new ScanMachine();
  const pair = () => [hand(0.3, 0.3), hand(0.72, 0.78)];
  const fistPair = () => [hand(0.3, 0.3, fisted()), hand(0.72, 0.78, fisted())];
  let t = 0;
  m.update(pair(), ASPECT, t, true);
  m.update(fistPair(), ASPECT, t, true);
  t += FREEZE_HOLD_MS + 20;
  check("nắm giữ là chụp", m.update(fistPair(), ASPECT, t, true).shoot === true);
  t += 200;
  check("nắm tiếp cũng không chụp nữa khi chưa quét lại", m.update(fistPair(), ASPECT, t, true).shoot === false);
}
{
  const m = new ScanMachine();
  const pair = () => [hand(0.3, 0.3), hand(0.72, 0.78)];
  const t = 0;
  const first = m.update(pair(), ASPECT, t, true);
  // nhận diện hụt: tay biến mất chốc lát
  const grace = m.update([], ASPECT, t + FRAME_GRACE_MS - 50, true);
  check("mất dấu tay trong khoảng ân hạn thì ô cũ VẪN còn (không nhấp nháy)", !!grace.box && grace.box.x === first.box!.x);
  const gone = m.update([], ASPECT, t + FRAME_GRACE_MS + 50, true);
  check("quá khoảng ân hạn thì mới bỏ ô", gone.box === null && gone.phase === "idle");
}
{
  const m = new ScanMachine();
  const pinchPair = () => [hand(0.3, 0.3, pinched()), hand(0.72, 0.78, pinched())];
  const pair = () => [hand(0.3, 0.3), hand(0.72, 0.78)];
  let t = 0;
  m.update(pinchPair(), ASPECT, t, true);
  t += FREEZE_HOLD_MS / 2;
  check("buông chụm giữa chừng thì bỏ tiến trình", m.update(pair(), ASPECT, t, true).phase === "framing");
  t += FREEZE_HOLD_MS;
  check("và KHÔNG tự đóng băng sau đó", m.update(pair(), ASPECT, t, true).phase === "framing");
}
{
  const m = new ScanMachine();
  const one = [hand(0.3, 0.3, pinched())];
  check("một tay chụm thôi thì không làm gì cả", m.update(one, ASPECT, 0, true).phase === "idle");
}
{
  // Máy tự vào "bận" ngay khi bắn cờ chụp. Nếu bên ngoài bỏ lần chụp đó (không
  // có khung hình, không dựng nổi canvas…) mà quên reset thì máy KẸT VĨNH VIỄN:
  // ô ngắm vẫn vẽ nhưng không bao giờ chụp nữa, người dùng chẳng thấy lỗi gì.
  const m = new ScanMachine();
  const tay = () => [openHand(0.5)];
  let t = 0;
  m.update(tay(), ASPECT, t, true);
  t += HAND_HOLD_MS + 50;
  check("đã bắn cờ chụp", m.update(tay(), ASPECT, t, true).shoot === true);
  t += 50;
  check("và máy đang ở trạng thái bận", m.update(tay(), ASPECT, t, true).phase === "busy");
  t += 5000;
  check(
    "bận thì KHÔNG tự thoát dù đợi bao lâu — bên ngoài BẮT BUỘC phải reset",
    m.update(tay(), ASPECT, t, true).phase === "busy",
  );
  m.reset();
  t += 50;
  check("reset xong là ngắm lại được ngay", m.update(tay(), ASPECT, t, true).phase === "framing");
}
{
  // LÀM MƯỢT: user tả ô "khựng, không mượt". Ô phải ĐI DẦN tới vị trí mới chứ
  // không nhảy cóc, và phải đi cả ở những khung hình KHÔNG có dữ liệu mới
  // (nhận diện 20 Hz, màn hình 60 Hz).
  const m = new ScanMachine();
  let t = 0;
  const at = (dx: number) => [hand(0.2 + dx, 0.3), hand(0.6 + dx, 0.8)];
  const x0 = m.update(at(0), ASPECT, t, true).box!.x;
  t += 16;
  const x1 = m.update(at(0.2), ASPECT, t, true).box!.x;
  check("ô KHÔNG nhảy thẳng tới vị trí mới", x1 - x0 < 0.2 * 0.9, String(x1 - x0));
  check("nhưng có nhúc nhích về phía đó", x1 > x0, String(x1 - x0));
  // khung hình chỉ vẽ lại, không có dữ liệu mới → vẫn phải đi tiếp
  t += 16;
  const x2 = m.update(at(0.2), ASPECT, t, false).box!.x;
  check("khung hình vẽ lại vẫn đi tiếp (mượt 60 Hz dù đo 20 Hz)", x2 > x1, String(x2 - x1));
  for (let i = 0; i < 40; i++) {
    t += 16;
    m.update(at(0.2), ASPECT, t, true);
  }
  const cuoi = m.update(at(0.2), ASPECT, t + 16, true).box!.x;
  check("và cuối cùng bám đúng vị trí", Math.abs(cuoi - (x0 + 0.2)) < 0.01, String(cuoi));
}

// ------------------------------------------------------ suy vùng từ mốc pose

/**
 * Bộ mốc pose của một người ngồi thẳng trước camera, TOẠ ĐỘ ẢNH GỐC (chưa lật).
 * Người quay mặt vào camera nên tay PHẢI của họ nằm bên TRÁI ảnh.
 * Ai sửa số ở đây nhớ giữ nguyên tính đối xứng, nếu không mọi khẳng định dưới
 * đều lệch theo.
 */
function seatedPose(): PoseLm[] {
  const lm: PoseLm[] = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, visibility: 0.0 }));
  const set = (i: number, x: number, y: number) => {
    lm[i] = { x, y, visibility: 0.99 };
  };
  set(POSE.NOSE, 0.5, 0.20);
  set(POSE.EYE_L, 0.46, 0.18);
  set(POSE.EYE_R, 0.54, 0.18);
  set(POSE.EAR_L, 0.42, 0.19);
  set(POSE.EAR_R, 0.58, 0.19);
  set(POSE.MOUTH_L, 0.48, 0.24);
  set(POSE.MOUTH_R, 0.52, 0.24);
  set(POSE.SHOULDER_L, 0.36, 0.36);
  set(POSE.SHOULDER_R, 0.64, 0.36);
  set(POSE.ELBOW_L, 0.30, 0.55);
  set(POSE.ELBOW_R, 0.70, 0.55);
  set(POSE.WRIST_L, 0.26, 0.74);
  set(POSE.WRIST_R, 0.74, 0.74);
  set(POSE.INDEX_L, 0.24, 0.82);
  set(POSE.INDEX_R, 0.76, 0.82);
  set(POSE.HIP_L, 0.40, 0.72);
  set(POSE.HIP_R, 0.60, 0.72);
  set(POSE.KNEE_L, 0.39, 0.90);
  set(POSE.KNEE_R, 0.61, 0.90);
  set(POSE.ANKLE_L, 0.38, 0.98);
  set(POSE.ANKLE_R, 0.62, 0.98);
  return lm;
}

/** Ô ngắm quanh một điểm ĐÃ LẬT GƯƠNG, cạnh `size` (theo trục x). */
function boxAround(mirroredX: number, y: number, size: number, aspect = ASPECT) {
  return { x: mirroredX - size / 2, y: y - (size * aspect) / 2, w: size, h: size * aspect };
}

/** Đổi toạ độ ảnh gốc sang toạ độ màn hình (ô ngắm luôn ở hệ đã lật). */
const mir = (x: number) => 1 - x;

console.log("\nSuy vùng từ mốc giải phẫu");
{
  const pose = seatedPose();
  const top = (box: { x: number; y: number; w: number; h: number }) =>
    guessFromPose(box, pose, ASPECT).guesses[0]?.part;

  // Ô to ôm cả vòm sọ → ĐẦU; ô sát khuôn mặt → MẶT. Người dùng báo đúng chỗ
  // này (03/09): ngắm cả cái đầu mà máy chỉ trả "Mặt" vì không gian nhãn thiếu
  // hẳn "Đầu".
  check("ô ôm cả đầu → đầu", top(boxAround(mir(0.5), 0.2, 0.26)) === "head", String(top(boxAround(mir(0.5), 0.2, 0.26))));
  check("ô sát khuôn mặt → mặt", top(boxAround(mir(0.5), 0.2, 0.16)) === "face", String(top(boxAround(mir(0.5), 0.2, 0.16))));
  check("ô nhỏ quanh một bên mắt → mắt", top(boxAround(mir(0.54), 0.18, 0.07)) === "eye", String(top(boxAround(mir(0.54), 0.18, 0.07))));
  check("ô nhỏ quanh vành tai → tai", top(boxAround(mir(0.58), 0.19, 0.07)) === "ear", String(top(boxAround(mir(0.58), 0.19, 0.07))));
  check("ô quanh khuỷu → khuỷu tay", top(boxAround(mir(0.70), 0.55, 0.11)) === "elbow", String(top(boxAround(mir(0.70), 0.55, 0.11))));
  check("ô quanh đầu gối → đầu gối", top(boxAround(mir(0.61), 0.90, 0.12)) === "knee", String(top(boxAround(mir(0.61), 0.90, 0.12))));
  check("ô quanh vai → vai", top(boxAround(mir(0.64), 0.36, 0.13)) === "shoulder", String(top(boxAround(mir(0.64), 0.36, 0.13))));
}
{
  const pose = seatedPose();
  // ô trải dọc từ khuỷu tới cổ tay của MỘT bên
  const box = { x: mir(0.76), y: 0.53, w: 0.16, h: 0.24 };
  const r = guessFromPose(box, pose, ASPECT);
  check("ô trải từ khuỷu tới cổ tay → cẳng tay", r.guesses[0]?.part === "forearm", JSON.stringify(r.guesses));
  check("có kèm mức tin cậy đọc được", r.bestIou > 0.2, String(r.bestIou));
}
{
  const pose = seatedPose();
  const box = { x: mir(0.72), y: 0.34, w: 0.16, h: 0.24 };
  check(
    "ô trải từ vai tới khuỷu → cánh tay",
    guessFromPose(box, pose, ASPECT).guesses[0]?.part === "upper-arm",
    JSON.stringify(guessFromPose(box, pose, ASPECT).guesses),
  );
}
check("LẬT GƯƠNG: quên lật là trỏ sang phía bên kia người", (() => {
  // Người đối xứng thì lật hay không cũng ra "khuỷu tay", nên phép kiểm phải
  // phá thế đối xứng: che hẳn nửa bên kia đi. Đây đúng là loại lỗi từng cắn dự
  // án (tay trái thành tay phải), nên phải có một khẳng định thật sự bắt được nó.
  const leftArm: number[] = [POSE.ELBOW_L, POSE.WRIST_L, POSE.SHOULDER_L, POSE.INDEX_L];
  const pose = seatedPose().map((p, i) => (leftArm.includes(i) ? { ...p, visibility: 0.05 } : p));
  const right = guessFromPose(boxAround(mir(0.7), 0.55, 0.11), pose, ASPECT).guesses[0]?.part;
  const wrong = guessFromPose(boxAround(0.7, 0.55, 0.11), pose, ASPECT).guesses[0]?.part;
  return right === "elbow" && wrong !== "elbow";
})());
check("mốc mờ (visibility thấp) bị bỏ qua", (() => {
  const pose = seatedPose().map((p, i) => (i === POSE.KNEE_R ? { ...p, visibility: 0.1 } : p));
  const g = guessFromPose(boxAround(mir(0.61), 0.9, 0.12), pose, ASPECT).guesses;
  return g.every((x) => x.part !== "knee");
})());
check("không đủ 33 mốc thì không đoán bừa", guessFromPose(boxAround(0.5, 0.5, 0.2), [], ASPECT).guesses.length === 0);
check("ô ở góc xa mọi mốc thì không trả về gì", guessFromPose({ x: 0.0, y: 0.0, w: 0.04, h: 0.04 }, seatedPose(), ASPECT).guesses.length === 0);
check("điểm cộng lại bằng 1 (dễ đọc thành phần trăm)", (() => {
  const g = guessFromPose(boxAround(mir(0.5), 0.2, 0.26), seatedPose(), ASPECT).guesses;
  return Math.abs(g.reduce((n, x) => n + x.score, 0) - 1) < 1e-9;
})());

console.log("\nIoU và đường lui");
check("hai ô trùng khít → IoU = 1", near(iou({ x: 0, y: 0, w: 1, h: 1 }, { x: 0, y: 0, w: 1, h: 1 }), 1));
check("hai ô rời nhau → IoU = 0", iou({ x: 0, y: 0, w: 0.2, h: 0.2 }, { x: 0.5, y: 0.5, w: 0.2, h: 0.2 }) === 0);
check("ô lớn trùm ô nhỏ vẫn cho IoU thấp", iou({ x: 0, y: 0, w: 1, h: 1 }, { x: 0.4, y: 0.4, w: 0.1, h: 0.1 }) < 0.02);
check("đường lui khi chỉ có bàn tay: ba ứng viên vùng chuyển tiếp", (() => {
  const g = handPathFallback();
  return g.length === 3 && g[0].part === "hand" && Math.abs(g.reduce((n, x) => n + x.score, 0) - 1) < 1e-9;
})());


// ------------------------------------------- bộ điều phối nhận diện hai tầng

/**
 * Dàn dựng một lần nhận diện với Pose và GPU giả.
 * `wait` KHÔNG chờ thật: hẹn giờ nào tới hạn trước thì hàm này quyết, nên kiểm
 * thử chạy tức thì mà vẫn dựng đúng thứ tự sự kiện.
 */
async function runRecognise(opts: {
  pose?: PoseResult | "hang";        // "hang" = Pose không bao giờ trả lời trong hạn
  poseLate?: PoseResult;             // Pose trả lời SAU khi đã quá hạn
  gpu?: VisionGuess[] | null | "cham" | "offline"; // "cham" = GPU trả lời sau hạn
  gpuLate?: VisionGuess[] | null;
  /** Cổ tay của bàn tay đã sinh ra ô — có nghĩa là "ô do một bàn tay tự bám". */
  handWrist?: { x: number; y: number; z: number } | null;
  picked?: boolean;
  box?: { x: number; y: number; w: number; h: number };
}) {
  const updates: RecogniseUpdate[] = [];
  // Giữ hai hàm "thả kết quả" trong một đối tượng: khai báo bằng `let ... = null`
  // rồi chỉ gán bên trong callback sẽ khiến TypeScript thu hẹp kiểu về `never`.
  const release: {
    pose?: (p: PoseResult) => void;
    gpu?: (r: GpuAnswer) => void;
  } = {};

  const posePromise =
    opts.pose === "hang"
      ? new Promise<PoseResult>((r) => {
          release.pose = r;
        })
      : Promise.resolve(opts.pose ?? { landmarks: [], ms: 5, reason: "no-person" as const });

  const gpuPromise: Promise<GpuAnswer> =
    opts.gpu === "cham"
      ? new Promise<GpuAnswer>((r) => {
          release.gpu = r;
        })
      : Promise.resolve(
          opts.gpu === "offline"
            ? { rows: null, offline: true }
            : { rows: (opts.gpu ?? null) as VisionGuess[] | null },
        );

  await recognise(
    opts.box ?? boxAround(mir(0.7), 0.55, 0.11),
    ASPECT,
    opts.handWrist ?? null,
    {
      pose: () => posePromise,
      gpu: () => gpuPromise,
      // Hạn giờ luôn "tới" ngay lập tức, nên nhánh quá hạn được kiểm tường minh.
      wait: () => Promise.resolve(),
      picked: () => opts.picked ?? false,
      emit: (u) => updates.push(u),
    },
  );

  // thả kết quả về muộn rồi nhường vài nhịp cho các then() chạy nốt
  if (opts.poseLate) release.pose?.(opts.poseLate);
  release.gpu?.({ rows: opts.gpuLate ?? null });
  for (let i = 0; i < 6; i++) await Promise.resolve();

  return updates;
}

/** Kết quả Pose giả: người ngồi thẳng, nhận diện mất 30 ms. */
const posedOk = (): PoseResult => ({ landmarks: seatedPose(), ms: 30 });

console.log("\nQuét chính bàn tay mình (tình huống đo thật 03/09)");
{
  // Tay PHẢI giơ lên ngang mặt — đúng tư thế trong ảnh người dùng gửi.
  // Cổ tay ở ngay cạnh mặt, khuỷu thấp hơn nhiều.
  const pose = seatedPose();
  const wristScreen = { x: mir(0.62), y: 0.30, z: 0 };
  // Ô CHỈ ÔM BÀN TAY: mép dưới mới chớm qua cổ tay, gần như không lấn xuống
  // cẳng tay. (Xảy ra khi bàn tay ở xa camera nên cỡ tay nhỏ, ô nới ra cũng nhỏ.)
  const box = { x: mir(0.62) - 0.13, y: 0.16, w: 0.26, h: 0.18 };

  const chiTay = guessFromArmChain(box, wristScreen, pose);
  check(
    "ô ôm bàn tay giơ ngang mặt: KHÔNG bao giờ ra 'mặt'",
    chiTay.guesses.every((g) => g.part !== "face"),
    JSON.stringify(chiTay.guesses),
  );
  check(
    "ba ứng viên đều thuộc chi trên",
    chiTay.guesses.every((g) => ["hand", "wrist", "forearm", "elbow"].includes(g.part)),
  );
  check(
    "ô chỉ ôm bàn tay → bàn tay đứng đầu",
    chiTay.guesses[0].part === "hand",
    JSON.stringify(chiTay.guesses) + " phủ " + chiTay.coverage.toFixed(2),
  );
  check("và đo đúng là lấn rất ít xuống cẳng tay", chiTay.coverage < 0.25, String(chiTay.coverage));

  // Cảnh ĐÚNG NHƯ ẢNH NGƯỜI DÙNG GỬI (03/09): bàn tay giơ gần camera nên ô nới
  // ra lấn được khoảng nửa cẳng tay. "Cẳng tay" đứng đầu là ĐÚNG, không phải lỗi
  // — lỗi hôm đó là "Mặt 37%" chen vào, và đó là thứ nay không thể xảy ra nữa.
  const boxNua = { x: mir(0.62) - 0.13, y: 0.16, w: 0.26, h: 0.28 };
  const chiNua = guessFromArmChain(boxNua, wristScreen, pose);
  check(
    "ô lấn nửa cẳng tay → cẳng tay đứng đầu, vẫn không có 'mặt'",
    chiNua.guesses[0].part === "forearm" && chiNua.guesses.every((g) => g.part !== "face"),
    JSON.stringify(chiNua.guesses),
  );

  // ô kéo dài hẳn xuống tới khuỷu
  const elbow = { x: mir(0.70), y: 0.55 };
  const boxDai = {
    x: Math.min(wristScreen.x, elbow.x) - 0.08,
    y: Math.min(wristScreen.y, elbow.y) - 0.05,
    w: Math.abs(wristScreen.x - elbow.x) + 0.16,
    h: Math.abs(wristScreen.y - elbow.y) + 0.10,
  };
  const chiCang = guessFromArmChain(boxDai, wristScreen, pose);
  check("ô lấn tới khuỷu → cẳng tay đứng đầu", chiCang.guesses[0].part === "forearm", JSON.stringify(chiCang.guesses));
  check("đo được phần cẳng tay lọt vào ô", chiCang.coverage > 0.8, String(chiCang.coverage));
}
check("không thấy khuỷu thì chỉ dám nói có bàn tay", (() => {
  const noElbow = seatedPose().map((p, i) =>
    ([POSE.ELBOW_L, POSE.ELBOW_R] as number[]).includes(i) ? { ...p, visibility: 0.05 } : p,
  );
  const r = guessFromArmChain({ x: 0.3, y: 0.3, w: 0.2, h: 0.2 }, { x: 0.4, y: 0.4 }, noElbow);
  return r.guesses[0].part === "hand" && r.coverage === 0;
})());
check("đoạn nằm trọn trong ô → phủ 100%", segmentCoverage({ x: 0, y: 0, w: 1, h: 1 }, { x: 0.2, y: 0.2 }, { x: 0.8, y: 0.8 }) === 1);
check("đoạn nằm ngoài ô → phủ 0%", segmentCoverage({ x: 0, y: 0, w: 0.1, h: 0.1 }, { x: 0.5, y: 0.5 }, { x: 0.9, y: 0.9 }) === 0);
check("lọc theo danh sách vùng cho phép", (() => {
  const g = guessFromPose(boxAround(mir(0.5), 0.2, 0.26), seatedPose(), ASPECT, ["hand", "wrist", "forearm"]);
  return g.guesses.every((x) => x.part !== "face");
})());


console.log("\nXoay mô hình theo góc bộ phận thật");
const doRad = (r: number) => (r * 180) / Math.PI;

/** Bàn tay với trục cổ tay → khớp bàn ngón giữa đặt ở một góc cho trước (độ, hệ ảnh). */
function handAtAngle(angleDeg: number): Landmark[] {
  const lms: Landmark[] = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  const r = (angleDeg * Math.PI) / 180;
  lms[LM.WRIST] = { x: 0.5, y: 0.5, z: 0 };
  lms[LM.MIDDLE_MCP] = { x: 0.5 + Math.cos(r) * 0.15, y: 0.5 + Math.sin(r) * 0.15, z: 0 };
  lms[LM.INDEX_MCP] = { x: 0.55, y: 0.45, z: 0 };
  lms[LM.PINKY_MCP] = { x: 0.45, y: 0.45, z: 0 };
  return lms;
}

check("quy góc về (-180,180]", normaliseDeg(190) === -170 && normaliseDeg(-190) === 170 && normaliseDeg(180) === 180);
check("góc trục: sang phải = 0°", Math.abs(axisAngleDeg({ x: 0, y: 0 }, { x: 1, y: 0 })) < 1e-9);
check("góc trục: hướng LÊN trên ảnh = -90°", Math.abs(axisAngleDeg({ x: 0, y: 1 }, { x: 0, y: 0 }) + 90) < 1e-9);

check(
  "tay giơ THẲNG ĐỨNG → không xoay gì cả (trùng tư thế gốc của mô hình)",
  Math.abs(rollFromAxis(MODEL_UPRIGHT_DEG)) < 1e-9,
);
{
  // Tay NẰM NGANG, ngón chỉ sang phải màn hình: trục 0°, lệch +90° so với
  // tư thế đứng. Trục y của ảnh hướng xuống còn của Three.js hướng lên nên
  // góc đổi dấu.
  const roll = rollFromAxis(0);
  check("tay nằm ngang → nghiêng đúng 90°", Math.abs(Math.abs(doRad(roll)) - 90) < 1e-9, String(doRad(roll)));
  check("và đúng chiều theo hệ trục Three.js", Math.sign(doRad(roll)) === IMAGE_TO_THREE_ROLL);
}
{
  const upright = orientationFromHand(handAtAngle(MODEL_UPRIGHT_DEG), "Right");
  check("tay phải dựng đứng: không nghiêng, không lật", !!upright && Math.abs(upright.rollRad) < 1e-9 && upright.mirror === false);
  const left = orientationFromHand(handAtAngle(MODEL_UPRIGHT_DEG), "Left");
  check("quét tay TRÁI thì phải LẬT GƯƠNG (mô hình dựng bên phải)", !!left && left.mirror === true);
  const tilt = orientationFromHand(handAtAngle(MODEL_UPRIGHT_DEG + 30), "Right");
  check("nghiêng tay 30° thì mô hình nghiêng 30°", !!tilt && Math.abs(Math.abs(doRad(tilt.rollRad)) - 30) < 1e-6, String(tilt && doRad(tilt.rollRad)));
  check("nguồn góc ghi đúng là từ bàn tay", tilt?.from === "hand");
}
{
  const pose = seatedPose();
  const fa = orientationFromPose("forearm", pose);
  check("cẳng tay từ mốc pose: có góc", !!fa && fa.from === "pose");
  const trai = orientationFromPose("forearm", pose, "left");
  const phai = orientationFromPose("forearm", pose, "right");
  check("bên TRÁI thì lật, bên PHẢI thì không", trai?.mirror === true && phai?.mirror === false);
  check("hai bên đối xứng nên góc ngược dấu nhau", !!trai && !!phai && Math.abs(doRad(trai.rollRad) + doRad(phai.rollRad)) < 1e-6);
}
check("mặt / cổ / ngực KHÔNG có trục → không bịa góc", (() => {
  const pose = seatedPose();
  return (["face", "head", "neck", "chest", "abdomen"] as const).every(
    (k) => orientationFromPose(k, pose) === null,
  );
})());
check("không có mốc nào thì trả null chứ không xoay bừa", orientationFor("forearm", {}) === null);
check("ưu tiên mốc BÀN TAY khi quét bàn tay", (() => {
  const o = orientationFor("hand", {
    hand: { landmarks: handAtAngle(MODEL_UPRIGHT_DEG), handedness: "Right" },
    pose: seatedPose(),
  });
  return o?.from === "hand";
})());

console.log("\nBên trái/phải của mô hình");
// Số đo trên atlas.json: "Left humerus" x = 0,14…0,24, "Right humerus" x = −0,24…−0,14.
check("tâm x dương là bên TRÁI của người (đo trên dữ liệu)", sideFromCenterX(0.19) === "left");
check("tâm x âm là bên PHẢI", sideFromCenterX(-0.19) === "right");
check("sát đường giữa (tim, sọ) thì không có bên", sideFromCenterX(0.01) === "mid" && sideFromCenterX(-0.03) === "mid");
check("mô hình .glb (bên phải): quét tay trái → lật, tay phải → không", mirrorFor(true, "right") && !mirrorFor(false, "right"));
check(
  "mô hình atlas bên TRÁI: quét tay trái → KHÔNG lật, tay phải → lật",
  !mirrorFor(true, "left") && mirrorFor(false, "left"),
);
check("mô hình ở đường giữa thì không bao giờ lật", !mirrorFor(true, "mid") && !mirrorFor(false, "mid"));
check("chưa quét gì thì không lật", !mirrorFor(null, "left") && !mirrorFor(null, "right"));
check("atlas ở tư thế giải phẫu: tay dựng đứng thì mô hình quay nửa vòng", near(Math.abs(atlasRoll(0)), Math.PI));
check("và góc luôn quy về (−π, π]", (() => {
  const r = atlasRoll(Math.PI * 0.9);
  return r > -Math.PI && r <= Math.PI && near(r, -Math.PI * 0.1, 1e-9);
})());


console.log("\nBộ điều phối hai tầng");
{
  const u = await runRecognise({ pose: posedOk(), gpu: [{ part: "face", score: 0.9 }] });
  check("mốc trùng khít → dùng mốc và KHÔNG hỏi GPU", u.length === 1 && u[0].source?.kind === "pose", JSON.stringify(u.map((x) => x.source)));
  check("kết quả là khuỷu tay đúng như hình học", u[0].guesses[0]?.part === "elbow");
  check("có kèm thời gian đo được", u[0].source?.ms === 30);
}
{
  // ô ở góc, mốc không khớp gì → phải rơi xuống GPU
  const u = await runRecognise({
    pose: posedOk(),
    box: { x: 0.01, y: 0.01, w: 0.05, h: 0.05 },
    gpu: [{ part: "hand", score: 0.8 }],
  });
  check("mốc không khớp → lấy kết quả GPU", u[u.length - 1].source?.kind === "gpu");
  check("kết quả GPU là thứ cuối cùng hiện ra", u[u.length - 1].guesses[0]?.part === "hand");
}
{
  const u = await runRecognise({
    pose: posedOk(),
    box: { x: 0.01, y: 0.01, w: 0.05, h: 0.05 },
    gpu: null,
  });
  check("không mốc, không GPU → báo không đủ chắc chắn chứ không bịa", u[u.length - 1].failure === "low" && u[u.length - 1].guesses.length === 0);
}
{
  const u = await runRecognise({
    pose: { landmarks: [], ms: 0, reason: "no-model" },
    box: { x: 0.01, y: 0.01, w: 0.05, h: 0.05 },
    gpu: null,
  });
  check("thiếu hẳn model tư thế → báo lỗi kỹ thuật, không phải 'không chắc'", u[u.length - 1].failure === "failed");
}
{
  const u = await runRecognise({ pose: "hang", handWrist: { x: 0.5, y: 0.6, z: 0 }, gpu: null });
  check("mốc quá hạn mà ô do bàn tay sinh ra → hiện ngay đường lui", u[0].source?.kind === "fallback" && u[0].guesses[0]?.part === "hand");
  check("và KHÔNG báo lỗi, vì vẫn có cái để chọn", u.every((x) => x.failure === null));
}
{
  const u = await runRecognise({ pose: "hang", poseLate: posedOk(), gpu: null });
  check("mốc về MUỘN vẫn được nhận nếu người dùng chưa chọn", u[u.length - 1].source?.kind === "pose" && u[u.length - 1].guesses[0]?.part === "elbow", JSON.stringify(u.map((x) => x.source)));
}
{
  const u = await runRecognise({ pose: "hang", poseLate: posedOk(), gpu: null, picked: true });
  check("NGƯỜI DÙNG ĐÃ CHỌN thì kết quả về muộn bị bỏ, không giật dưới tay họ", u.every((x) => x.source?.kind !== "pose"));
}
{
  const u = await runRecognise({
    pose: posedOk(),
    box: { x: 0.01, y: 0.01, w: 0.05, h: 0.05 },
    gpu: "cham",
    gpuLate: [{ part: "knee", score: 0.7 }],
  });
  check("GPU quá hạn rồi mới về → vẫn được nhận khi chưa ai chọn", u[u.length - 1].guesses[0]?.part === "knee");
}
{
  const u = await runRecognise({
    pose: posedOk(),
    box: { x: 0.01, y: 0.01, w: 0.05, h: 0.05 },
    gpu: "cham",
    gpuLate: [{ part: "knee", score: 0.7 }],
    picked: true,
  });
  check("GPU về muộn khi đã chọn rồi thì bị bỏ", u.every((x) => x.guesses[0]?.part !== "knee"));
}
{
  const u = await runRecognise({
    pose: posedOk(),
    box: { x: 0.01, y: 0.01, w: 0.05, h: 0.05 },
    gpu: "offline",
  });
  check(
    "CHƯA CẤU HÌNH dịch vụ thì nói đúng thế, không gộp thành 'không đủ chắc chắn'",
    u[u.length - 1].failure === "offline",
    String(u[u.length - 1].failure),
  );
}
check("ngân sách thời gian đúng như đã chốt", POSE_BUDGET_MS === 1200 && GPU_BUDGET_MS === 800);

console.log("\nMức tin cậy (thay cho phần trăm) và bên trái/phải");
{
  const u = await runRecognise({ pose: posedOk(), gpu: null });
  const g = u[0].guesses[0];
  check("mốc trùng khít → 'khớp rõ'", g?.tier === "clear", JSON.stringify(g));
  check("và biết vùng đó ở bên nào của người", g?.side === "left" || g?.side === "right", JSON.stringify(g));
  check("gợi ý phụ không bao giờ ngang hàng gợi ý đầu", u[0].guesses.slice(1).every((x) => x.tier !== "clear"));
}
{
  const u = await runRecognise({ pose: "hang", handWrist: { x: 0.5, y: 0.6, z: 0 }, gpu: null });
  check("đường lui (không thấy người) → mọi gợi ý đều 'chưa chắc'", u[0].guesses.every((x) => x.tier === "unsure"));
}
check("gợi ý đầu mang mức được giao, gợi ý sau thấp hơn một bậc", (() => {
  const r = withTiers([{ part: "elbow", score: 0.5 }, { part: "forearm", score: 0.3 }], "clear");
  return r[0].tier === "clear" && r[1].tier === "maybe";
})());
check("GPU zero-shot (chưa hiệu chỉnh) KHÔNG BAO GIỜ được nói 'khớp rõ', dù điểm 99%", gpuTier(0.99, "zero-shot") !== "clear");
console.log("\nChặn gọi dồn route nhận diện (máy GPU trả tiền theo giờ)");
{
  const lim = createLimiter(3, 60_000);
  const t0 = 1_000_000;
  const hits = [0, 1, 2, 3].map((i) => lim.hit("1.2.3.4", t0 + i));
  check("cho qua đúng số lượt trong cửa sổ, lượt thứ tư bị chặn", hits.slice(0, 3).every((h) => h.ok) && !hits[3].ok);
  check("bị chặn thì báo số giây phải chờ (> 0)", hits[3].retryAfter > 0 && hits[3].retryAfter <= 60);
  check("IP khác không bị vạ lây", lim.hit("5.6.7.8", t0 + 5).ok);
  check("hết cửa sổ thì được gọi lại", lim.hit("1.2.3.4", t0 + 60_001).ok);
  const req = (origin: string | null, host: string) =>
    new Request("http://x/api/vision/identify", { method: "POST", headers: { host, ...(origin ? { origin } : {}) } });
  check("cùng nguồn thì cho qua", sameOrigin(req("https://soma.onrender.com", "soma.onrender.com")));
  check("trang lạ gọi sang thì chặn", !sameOrigin(req("https://evil.example", "soma.onrender.com")));
  check("không có Origin (curl, kiểm thử) thì để giới hạn tần suất lo", sameOrigin(req(null, "soma.onrender.com")));
}
check("GPU kNN: cao → rõ, vừa → có thể, thấp → chưa chắc", gpuTier(0.8, "knn") === "clear" && gpuTier(0.4, "knn") === "maybe" && gpuTier(0.1, "knn") === "unsure");


console.log("\nKhông gian nhãn");
check("khoá nhãn không trùng nhau", new Set(VISION_PART_KEYS).size === VISION_PART_KEYS.length);
check("mọi vùng con đều là nhãn có thật", VISION_PARTS.every((p) => (p.children ?? []).every(isVisionPartKey)));
check("đầu có lối rẽ xuống mắt/tai/miệng", (getVisionPart("head")?.children ?? []).length >= 3);
check("tra ngược theo khoá chạy đúng", getVisionPart("forearm")?.key === "forearm" && getVisionPart("xyz") === undefined);
check("isVisionPartKey chặn khoá lạ", isVisionPartKey("hand") && !isVisionPartKey("tail"));

for (const p of VISION_PARTS) {
  check(`[${p.key}] có đủ nhãn vi/en/zh`, !!p.label.vi && !!p.label.en && !!p.label.zh);
  check(`[${p.key}] có câu nhắc đưa vào khung`, !!p.hint.vi && !!p.hint.en && !!p.hint.zh);
  check(`[${p.key}] có ít nhất một scene gợi ý`, p.scenes.length > 0);
  check(`[${p.key}] không gợi ý trùng scene`, new Set(p.scenes).size === p.scenes.length);
  // Bài bộ phận (bo-phan-*) chỉ có trên atlas — vẫn là trang có thật (/giai-phau/mo-hinh/<slug>).
  const missing = p.scenes.filter((slug) => !(slug in sceneModules) && !(slug in atlasScenes));
  check(`[${p.key}] mọi scene gợi ý đều CÓ THẬT`, missing.length === 0, missing.join(", "));
  // LUẬT ĐÃ CHỐT: mô hình gợi ý phải mở NGAY TRONG TRANG Vision AI, không chuyển trang.
  const stuck = p.scenes.filter((slug) => !getControlModel(slug));
  check(`[${p.key}] mọi gợi ý đều mở được ngay trong trang (chế độ điều khiển)`, stuck.length === 0, stuck.join(", "));
  // Slug có trên atlas thì phải nạp BÀI ATLAS — thư viện hiện tên bài atlas, nạp .glb cũ là tên một đằng mô hình một nẻo.
  const wrong = p.scenes.filter((slug) => slug in atlasScenes && getControlModel(slug)?.kind !== "atlas");
  check(`[${p.key}] nạp đúng bài atlas mà thư viện đang hiện`, wrong.length === 0, wrong.join(", "));
  const first = getControlModel(p.scenes[0]);
  check(
    `[${p.key}] gợi ý đầu tiên có lớp để bóc và mở ra có thứ để nhìn`,
    first?.kind === "atlas" &&
      atlasLayerDefs(first.scene).length > 0 &&
      Object.values(initAtlasLayers(first.scene)).some((s) => s.visible),
  );
  // Vùng chạm-là-mở-thẳng-bản-glb: bản đó phải có thật và đủ lớp da–xương để
  // bóc (mọi lớp mặc định đều hiện, da ở dạng mờ để nhìn xuyên).
  if (p.openGlb) {
    const glb = getGlbModel(p.openGlb);
    check(
      `[${p.key}] bản glb mở thẳng (${p.openGlb}) có thật và đủ lớp để bóc`,
      !!glb && glb.kind === "glb" && glb.cats.includes("skin") && glb.cats.includes("bone"),
      glb?.kind ?? "thiếu",
    );
  }
}

console.log("\nXếp hạng dự đoán");
check("bỏ nhãn lạ, sắp theo điểm giảm dần", (() => {
  const r = rankGuesses([
    { part: "hand", score: 0.2 },
    { part: "chi-tren", score: 0.9 },
    { part: "forearm", score: 0.7 },
  ]);
  return r.length === 2 && r[0].part === "forearm" && r[1].part === "hand";
})());
check("cắt còn top-3", rankGuesses(VISION_PART_KEYS.map((k, i) => ({ part: k, score: 1 - i / 100 }))).length === 3);
check("bỏ bản ghi trùng nhãn", rankGuesses([{ part: "hand", score: 0.9 }, { part: "hand", score: 0.5 }]).length === 1);
check("điểm bị kẹp về [0,1]", rankGuesses([{ part: "hand", score: 4 }])[0].score === 1);
check("dữ liệu rác trả về mảng rỗng", rankGuesses(null).length === 0 && rankGuesses(["x", 3, {}]).length === 0);

console.log(failed === 0 ? "\nTẤT CẢ ĐỀU ĐÚNG" : `\n${failed} khẳng định SAI`);
process.exit(failed === 0 ? 0 : 1);
