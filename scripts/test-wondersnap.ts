// KIỂM THỬ LỚP CỬ CHỈ WONDERSNAP — chạy: node --import ./scripts/ts-resolve.mjs scripts/test-wondersnap.ts
//
// Cùng truyền thống với `test-gestures.ts`: dựng bàn tay bằng số rồi khẳng định
// mã đọc ra đúng pose / snap / chuyển cảnh — chạy trong node, không cần webcam.

import {
  OPEN_SMOOTH_A,
  OPEN_SMOOTH_B,
  WONDER_BUSY_SPAN,
  WONDER_PULL_DIST,
  WonderPoseDebouncer,
  WonderScene,
  WonderSnapDetector,
  nextPullState,
  opennessOf,
  smoothOpen,
  wonderBusy,
  wonderFitZoom,
  wonderPoseOf,
  type WonderPose,
} from "../src/lib/gesture/wondersnap.ts";
import { readHand } from "../src/lib/gesture/gestures.ts";
import { LM, type Landmark } from "../src/lib/gesture/handModel.ts";

let failed = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) console.log(`  ok   ${name}`);
  else {
    failed += 1;
    console.log(`  FAIL ${name}${extra ? " — " + extra : ""}`);
  }
}

const P = (x: number, y: number, z = 0): Landmark => ({ x, y, z });

/**
 * Bàn tay tổng hợp: lòng bàn tay đứng yên, ngón duỗi thì thẳng đứng (góc PIP
 * 180°), ngón gập thì đầu ngón quặt về lòng bàn tay (góc PIP ~14°).
 */
function makeHand(opts: {
  ext: { index: boolean; middle: boolean; ring: boolean; pinky: boolean };
  thumbOut?: boolean;
  thumbAt?: { x: number; y: number };
}): Landmark[] {
  const S = 0.2;
  const wrist = P(0.5, 0.7);
  const lms: Landmark[] = new Array(21).fill(null).map(() => P(0, 0));
  lms[LM.WRIST] = wrist;
  const mcpX = [0.44, 0.49, 0.54, 0.585];
  const groups: [number, number, number, number, boolean][] = [
    [LM.INDEX_MCP, LM.INDEX_PIP, LM.INDEX_DIP, LM.INDEX_TIP, opts.ext.index],
    [LM.MIDDLE_MCP, LM.MIDDLE_PIP, LM.MIDDLE_DIP, LM.MIDDLE_TIP, opts.ext.middle],
    [LM.RING_MCP, LM.RING_PIP, LM.RING_DIP, LM.RING_TIP, opts.ext.ring],
    [LM.PINKY_MCP, LM.PINKY_PIP, LM.PINKY_DIP, LM.PINKY_TIP, opts.ext.pinky],
  ];
  groups.forEach(([mcp, pip, dip, tip, extended], i) => {
    const x = mcpX[i];
    const my = wrist.y - S;
    lms[mcp] = P(x, my);
    lms[pip] = P(x, my - S * 0.45);
    if (extended) {
      lms[dip] = P(x, my - S * 0.7);
      lms[tip] = P(x, my - S * 0.9);
    } else {
      lms[dip] = P(x + S * 0.12, my - S * 0.3);
      lms[tip] = P(x + S * 0.1, my - S * 0.05);
    }
  });
  lms[LM.THUMB_CMC] = P(0.43, wrist.y - S * 0.2);
  lms[LM.THUMB_MCP] = P(0.4, 0.55);
  lms[LM.THUMB_IP] = P(0.36, 0.53);
  if (opts.thumbAt) lms[LM.THUMB_TIP] = P(opts.thumbAt.x, opts.thumbAt.y);
  else if (opts.thumbOut) lms[LM.THUMB_TIP] = P(0.18, 0.5);
  else lms[LM.THUMB_TIP] = P(0.46, 0.52);
  return lms;
}

const OPEN = { index: true, middle: true, ring: true, pinky: true };
const FIST = { index: false, middle: false, ring: false, pinky: false };
const PEACE = { index: true, middle: true, ring: false, pinky: false };
const POINT = { index: true, middle: false, ring: false, pinky: false };

// ---- pose ----
check("open", wonderPoseOf(readHand(makeHand({ ext: OPEN, thumbOut: true }))) === "open");
check("fist", wonderPoseOf(readHand(makeHand({ ext: FIST }))) === "fist");
check("peace", wonderPoseOf(readHand(makeHand({ ext: PEACE }))) === "peace");
check("point", wonderPoseOf(readHand(makeHand({ ext: POINT }))) === "point");
check("none khi mất tay", wonderPoseOf(null) === "none");
check(
  "xoè 4 ngón là open kể cả khi cái khép (tay mở tự nhiên)",
  wonderPoseOf(readHand(makeHand({ ext: OPEN }))) === "open",
);

// ---- openness ----
{
  const openLms = makeHand({ ext: OPEN, thumbOut: true });
  const fistLms = makeHand({ ext: FIST });
  const oOpen = opennessOf(readHand(openLms), openLms);
  const oFist = opennessOf(readHand(fistLms), fistLms);
  check("open ≈ 1", oOpen > 0.95, `got ${oOpen}`);
  check("fist ≈ 0", oFist < 0.05, `got ${oFist}`);
  check("smooth dưới ngưỡng = 0", smoothOpen(OPEN_SMOOTH_A, OPEN_SMOOTH_B, 0.05) === 0);
  check("smooth trên ngưỡng = 1", smoothOpen(OPEN_SMOOTH_A, OPEN_SMOOTH_B, 0.9) === 1);
  const mid = smoothOpen(OPEN_SMOOTH_A, OPEN_SMOOTH_B, 0.5);
  check("smooth giữa khoảng 0..1", mid > 0 && mid < 1, `got ${mid}`);
}

// ---- busy (giữ bung khi chỉ/chụm, lái khi mở/nắm) ----
{
  check("chỉ tay là bận", wonderBusy("point", 1.2));
  check("chụm là bận", wonderBusy("open", WONDER_BUSY_SPAN - 0.05));
  check("mở rộng là rảnh", !wonderBusy("open", 1.0));
  check("nắm là rảnh (về 0)", !wonderBusy("fist", 1.0));
  check("other duỗi là rảnh", !wonderBusy("other", 0.9));
}

// ---- pull (chụm để kéo part ra / đặt lại) ----
{
  check("kéo giãn hằng số", WONDER_PULL_DIST === 0.5);
  check("chưa chọn thì null (làm cú bấm)", nextPullState(null, null) === null);
  check("chụm khi đã chọn thì kéo", JSON.stringify(nextPullState(null, "skull")) === '{"key":"skull","target":1}');
  check(
    "chụm lại cùng part thì đặt về",
    nextPullState({ key: "skull", target: 1 }, "skull") === null,
  );
  check(
    "chụm khi chọn part khác thì chuyển sang kéo part đó",
    JSON.stringify(nextPullState({ key: "skull", target: 1 }, "jaw")) === '{"key":"jaw","target":1}',
  );
}

// ---- fit zoom ----
{
  check("gộp thì fit = 1", wonderFitZoom(0) === 1);
  const full = wonderFitZoom(1);
  check("bung hết lùi còn ~0.53", full > 0.5 && full < 0.56, `got ${full}`);
  check("đơn điệu giảm", wonderFitZoom(0.5) < 1 && wonderFitZoom(0.5) > full);
  check("bung vượt 1 (1.6) lùi tiếp ~0.41", wonderFitZoom(1.6) > 0.39 && wonderFitZoom(1.6) < 0.43);
  check("kẹp dưới 0", wonderFitZoom(-2) === 1);
}

// ---- debouncer ----
{
  const d = new WonderPoseDebouncer(4, 6);
  let r: { stable: WonderPose; changed: boolean } = { stable: "none", changed: false };
  for (let i = 0; i < 3; i++) r = d.push("fist");
  check("3 khung chưa chốt", r.stable === "none" && !r.changed);
  r = d.push("fist");
  check("4 khung chốt fist", r.stable === "fist" && r.changed);
  const d2 = new WonderPoseDebouncer(4, 6);
  for (let i = 0; i < 5; i++) r = d2.push("peace");
  check("peace 5 khung chưa chốt", r.stable !== "peace");
  r = d2.push("peace");
  check("peace 6 khung mới chốt", r.stable === "peace" && r.changed);
}

// ---- snap ----
{
  // Nhấn: cái chạm giữa (tay mở, không phải nắm).
  const press = makeHand({ ext: OPEN, thumbAt: { x: 0.47, y: 0.32 } });
  // Bung: cái tách xa + ngón giữa quật xuống (búng thật).
  const release = makeHand({
    ext: { index: true, middle: false, ring: true, pinky: true },
    thumbAt: { x: 0.2, y: 0.32 },
  });
  const det = new WonderSnapDetector();
  check("nhấn không bắn", !det.push(press, readHand(press), 1000));
  check("bung nhanh bắn 1 lần", det.push(release, readHand(release), 1050));
  check("bung xong không bắn nữa", !det.push(release, readHand(release), 1100));
  // Cooldown 800 ms chặn cú liền kề.
  check("cooldown chặn búng dồn", !det.push(press, readHand(press), 1150) && !det.push(release, readHand(release), 1200));

  // Mở chậm (quá 100 ms) không tính.
  const det2 = new WonderSnapDetector();
  det2.push(press, readHand(press), 2000);
  check("mở chậm không bắn", !det2.push(release, readHand(release), 2500));

  // Nắm tay mở ra không phải búng.
  const det3 = new WonderSnapDetector();
  const fistPress = makeHand({ ext: FIST, thumbAt: { x: 0.47, y: 0.32 } });
  det3.push(fistPress, readHand(fistPress), 3000);
  check("nắm tay không nhấn búng", !det3.push(release, readHand(release), 3050));

  // Bung mà ngón giữa còn duỗi: loại.
  const det4 = new WonderSnapDetector();
  const releaseMidUp = makeHand({ ext: OPEN, thumbAt: { x: 0.2, y: 0.32 } });
  det4.push(press, readHand(press), 4000);
  check("giữa còn duỗi thì loại", !det4.push(releaseMidUp, readHand(releaseMidUp), 4050));

  // Mất dấu giữa chừng được du di dropout.
  const det5 = new WonderSnapDetector();
  det5.push(press, readHand(press), 5000);
  det5.push(null, null, 5050);
  check("dropout vẫn bắn", det5.push(release, readHand(release), 5100));
}

// ---- state machine ----
{
  const s = new WonderScene();
  check("mặc định hiện", s.state === "shown");
  check("snap khi hiện → tan", JSON.stringify(s.update("other", false, true)) === '["dissolve"]' && s.state === "hidden");
  check("snap khi ẩn → gọi", JSON.stringify(s.update("other", false, true)) === '["summon"]' && s.state === "shown");
  check("peace khi hiện → next", JSON.stringify(s.update("peace", true, false)) === '["next"]');
  check("fist khi hiện → assemble", JSON.stringify(s.update("fist", true, false)) === '["assemble"]');
  s.update("other", false, true); // ẩn đi
  const ev = s.update("fist", true, false);
  check("fist khi ẩn → gọi + gộp", JSON.stringify(ev) === '["summon","assemble"]' && s.state === "shown");
  check("open không đổi trạng thái", s.update("open", true, false).length === 0);
  const s2 = new WonderScene();
  s2.update("other", false, true); // ẩn đi
  check("peace khi ẩn → gọi + next", JSON.stringify(s2.update("peace", true, false)) === '["summon","next"]' && s2.state === "shown");
}

if (failed > 0) {
  console.log(`\n${failed} kiểm thử HỎNG`);
  process.exit(1);
} else console.log("\nTất cả kiểm thử WonderSnap đều qua.");
