// KIỂM THỬ PHÉP TOÁN CỬ CHỈ — chạy: npm run test:gestures
//
// Vì sao cần: cử chỉ chỉ kiểm được bằng tay trước webcam, mà sửa một ngưỡng là
// có thể phá vỡ cử chỉ khác mà không ai thấy ngay. File này dựng các tư thế bàn
// tay bằng số (nắm tay, xoè tay, chỉ trỏ, chụm ngón…) rồi khẳng định mã đọc ra
// đúng chế độ — chạy trong node, không cần trình duyệt.
//
// Node ≥ 22.6 chạy trực tiếp .ts (chỉ xoá chú thích kiểu) nên không cần bước biên dịch.

import {
  PinchClick,
  ModeStabilizer,
  detectHandMode,
  readHand,
  zoomFromTwoHands,
  isPinching,
  twoHandSpan,
  deadzone,
  angleDelta,
  ZOOM_MIN,
  ZOOM_MAX,
  PINCH_ON,
  PINCH_OFF,
  type HandMode,
} from "../src/lib/gesture/gestures.ts";
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
 * Dựng một bàn tay tổng hợp. Lòng bàn tay nằm ngang tại y = 0.6, các ngón chỉ
 * LÊN (y giảm). Ngón "gập" thì đầu ngón quặt xuống dưới khớp giữa, khiến góc
 * tại khớp giữa nhỏ — đúng như bàn tay thật khi nắm lại.
 */
function makeHand(opts: {
  ext: { index: boolean; middle: boolean; ring: boolean; pinky: boolean };
  /** khoảng cách ngón cái ↔ đầu ngón trỏ, theo đơn vị "cỡ bàn tay" */
  pinch: number;
  /** góc nghiêng cả bàn tay (radian) */
  tilt?: number;
}): Landmark[] {
  const S = 0.2; // cỡ bàn tay: cổ tay → khớp bàn ngón
  const wrist = P(0.5, 0.7);
  const lms: Landmark[] = new Array(21).fill(null).map(() => P(0, 0));
  lms[LM.WRIST] = wrist;

  const mcpX = [0.44, 0.49, 0.54, 0.585]; // trỏ, giữa, nhẫn, út
  const groups: [number, number, number, number, boolean][] = [
    [LM.INDEX_MCP, LM.INDEX_PIP, LM.INDEX_DIP, LM.INDEX_TIP, opts.ext.index],
    [LM.MIDDLE_MCP, LM.MIDDLE_PIP, LM.MIDDLE_DIP, LM.MIDDLE_TIP, opts.ext.middle],
    [LM.RING_MCP, LM.RING_PIP, LM.RING_DIP, LM.RING_TIP, opts.ext.ring],
    [LM.PINKY_MCP, LM.PINKY_PIP, LM.PINKY_DIP, LM.PINKY_TIP, opts.ext.pinky],
  ];
  groups.forEach(([mcp, pip, dip, tip, extended], i) => {
    const x = mcpX[i];
    const my = wrist.y - S; // khớp bàn ngón cách cổ tay đúng 1 cỡ bàn tay
    lms[mcp] = P(x, my);
    lms[pip] = P(x, my - S * 0.45);
    if (extended) {
      lms[dip] = P(x, my - S * 0.7);
      lms[tip] = P(x, my - S * 0.9);
    } else {
      // gập: đầu ngón quặt về phía lòng bàn tay → góc ở PIP nhỏ
      lms[dip] = P(x + S * 0.12, my - S * 0.3);
      lms[tip] = P(x + S * 0.1, my - S * 0.05);
    }
  });

  // ngón cái: đặt sao cho khoảng cách tới ĐẦU ngón trỏ đúng bằng `pinch` × cỡ tay
  const idxTip = lms[LM.INDEX_TIP];
  lms[LM.THUMB_TIP] = P(idxTip.x - opts.pinch * S, idxTip.y);
  lms[LM.THUMB_CMC] = P(0.43, wrist.y - S * 0.2);
  lms[LM.THUMB_MCP] = P(0.4, wrist.y - S * 0.4);
  lms[LM.THUMB_IP] = P(
    (lms[LM.THUMB_MCP].x + lms[LM.THUMB_TIP].x) / 2,
    (lms[LM.THUMB_MCP].y + lms[LM.THUMB_TIP].y) / 2,
  );

  if (opts.tilt) {
    const c = Math.cos(opts.tilt);
    const s = Math.sin(opts.tilt);
    return lms.map((p) => {
      const dx = p.x - wrist.x;
      const dy = p.y - wrist.y;
      return P(wrist.x + dx * c - dy * s, wrist.y + dx * s + dy * c, p.z);
    });
  }
  return lms;
}

const ALL = { index: true, middle: true, ring: true, pinky: true };
const NONE = { index: false, middle: false, ring: false, pinky: false };
const ONLY_INDEX = { index: true, middle: false, ring: false, pinky: false };

console.log("\n1. Đọc ngón duỗi / gập");
{
  const open = readHand(makeHand({ ext: ALL, pinch: 1.0 }));
  check("xoè cả bàn tay → 4 ngón duỗi", open.extendedCount === 4, `được ${open.extendedCount}`);
  const fist = readHand(makeHand({ ext: NONE, pinch: 0.3 }));
  check("nắm tay → 0 ngón duỗi", fist.extendedCount === 0, `được ${fist.extendedCount}`);
  const one = readHand(makeHand({ ext: ONLY_INDEX, pinch: 1.0 }));
  check(
    "chỉ ngón trỏ → đúng 1 ngón duỗi và là ngón trỏ",
    one.extendedCount === 1 && one.index,
    `được ${one.extendedCount}`,
  );
}

console.log("\n2. Cỡ bàn tay không ảnh hưởng ngưỡng (tay xa / gần camera)");
{
  const near = readHand(makeHand({ ext: ONLY_INDEX, pinch: 0.35 }));
  // thu nhỏ toàn bộ bàn tay 3 lần = tay ở xa camera
  const small = makeHand({ ext: ONLY_INDEX, pinch: 0.35 }).map((p) =>
    P(0.5 + (p.x - 0.5) / 3, 0.5 + (p.y - 0.5) / 3, p.z),
  );
  const far = readHand(small);
  check(
    "pinchSpan gần như không đổi khi tay ở xa",
    Math.abs(near.pinchSpan - far.pinchSpan) < 0.02,
    `${near.pinchSpan.toFixed(3)} vs ${far.pinchSpan.toFixed(3)}`,
  );
  check(
    "chế độ cũng không đổi theo khoảng cách",
    detectHandMode(near) === detectHandMode(far),
  );
}

console.log("\n3. Nhận chế độ");
{
  const m = (h: Landmark[]): HandMode => detectHandMode(readHand(h));
  check("nắm tay → di chuyển", m(makeHand({ ext: NONE, pinch: 0.3 })) === "pan");
  check("xoè tay → xoay", m(makeHand({ ext: ALL, pinch: 1.0 })) === "rotate");
  check(
    "trỏ + ngón cái tách xa → VẪN là trỏ (một tay không còn zoom nữa)",
    m(makeHand({ ext: ONLY_INDEX, pinch: 1.2 })) === "point",
  );
  check(
    "trỏ + ngón cái chụm sát → vẫn là trỏ (đó là cú bấm)",
    m(makeHand({ ext: ONLY_INDEX, pinch: 0.3 })) === "point",
  );
  check(
    "xoè tay nghiêng 40° vẫn là xoay (không đọc thành nắm tay)",
    m(makeHand({ ext: ALL, pinch: 1.0, tilt: (40 * Math.PI) / 180 })) === "rotate",
  );
  check(
    "nắm tay nghiêng 40° vẫn là di chuyển",
    m(makeHand({ ext: NONE, pinch: 0.3, tilt: (40 * Math.PI) / 180 })) === "pan",
  );
}

console.log("\n4. Góc bàn tay theo động tác xoay");
{
  const a0 = readHand(makeHand({ ext: ALL, pinch: 1.0 })).angle;
  const a30 = readHand(makeHand({ ext: ALL, pinch: 1.0, tilt: 0.5 })).angle;
  check(
    "xoay tay 0,5 rad → góc đọc được lệch đúng ~0,5 rad",
    Math.abs(Math.abs(a30 - a0) - 0.5) < 0.05,
    `lệch ${(a30 - a0).toFixed(3)}`,
  );
}

console.log("\n5. Bấm bằng chụm ngón (trễ hai ngưỡng + chống bấm kép)");
{
  const c = new PinchClick();
  check("mở ngón thì không bấm", c.push(1.0, 0) === false);
  check("chụm lại → bấm 1 lần", c.push(PINCH_ON - 0.05, 100) === true);
  check("giữ nguyên không bấm thêm", c.push(PINCH_ON - 0.05, 150) === false);
  check("hé nhẹ trong vùng trễ vẫn coi là đang chụm", c.push(0.5, 200) === false);
  check("đang chụm thì isClosed = true", c.isClosed === true);
  check("nhả hẳn ra", c.push(PINCH_OFF + 0.1, 400) === false && c.isClosed === false);
  check("chụm lại ngay sau 40 ms → bị chặn (chống bấm kép)", c.push(0.2, 440) === false);
  const c2 = new PinchClick();
  c2.push(0.2, 0);
  c2.push(1.0, 500);
  check("chụm lại sau 600 ms → bấm được", c2.push(0.2, 600) === true);
}

console.log("\n6. Chế độ chỉ đổi khi tư thế lặp lại đủ lâu");
{
  const st = new ModeStabilizer(4);
  check("khởi đầu là trỏ", st.push("point") === "point");
  check("1 khung nhiễu chưa đổi", st.push("pan") === "point");
  check("2 khung chưa đổi", st.push("pan") === "point");
  check("3 khung chưa đổi", st.push("pan") === "point");
  check("4 khung liên tiếp mới đổi", st.push("pan") === "pan");
  const st2 = new ModeStabilizer(4);
  st2.push("pan");
  st2.push("pan");
  st2.push("rotate"); // nhiễu xen giữa phải reset bộ đếm
  st2.push("pan");
  st2.push("pan");
  check("nhiễu xen giữa làm đếm lại từ đầu", st2.push("pan") === "point");
}


console.log("\n7. Zoom bằng HAI TAY, neo cố định + vùng chết");
{
  const pinchHand = readHand(makeHand({ ext: ONLY_INDEX, pinch: 0.3 }));
  const openHand = readHand(makeHand({ ext: ONLY_INDEX, pinch: 1.2 }));
  check("chụm ngón thì isPinching = true", isPinching(pinchHand));
  check("tách ngón thì isPinching = false", !isPinching(openHand));

  const shift = (lms: Landmark[], dx: number) => lms.map((p) => P(p.x + dx, p.y, p.z));
  const h = makeHand({ ext: ONLY_INDEX, pinch: 0.3 });
  const near = twoHandSpan(h, shift(h, 0.2));
  const far = twoHandSpan(h, shift(h, 0.4));
  check("hai tay xa nhau hơn → khoảng cách đo được lớn hơn", far > near);
  // cùng thế tay nhưng cả hai bàn tay nhỏ đi = người ngồi lùi ra xa camera
  const small = (lms: Landmark[]) =>
    lms.map((p) => P(0.5 + (p.x - 0.5) / 2, 0.5 + (p.y - 0.5) / 2, p.z));
  const sameFar = twoHandSpan(small(h), small(shift(h, 0.4)));
  check(
    "ngồi xa camera không làm đổi khoảng cách đã chuẩn hoá",
    Math.abs(sameFar - far) < 0.05,
    `${sameFar.toFixed(3)} vs ${far.toFixed(3)}`,
  );

  const anchor = 2.0;
  check("vừa neo xong, cỡ mô hình KHÔNG nhảy", zoomFromTwoHands(anchor, anchor, 1.4) === 1.4);
  check("nhích nhẹ trong vùng chết vẫn giữ nguyên", zoomFromTwoHands(anchor + 0.1, anchor, 1.4) === 1.4);
  check("kéo hai tay xa ra → to lên", zoomFromTwoHands(anchor + 1.0, anchor, 1.4) > 1.4);
  check("đưa hai tay lại gần → nhỏ đi", zoomFromTwoHands(anchor - 1.0, anchor, 1.4) < 1.4);
  let inRange = true;
  for (let d = -8; d <= 8; d += 0.25) {
    const z = zoomFromTwoHands(anchor + d, anchor, 1.4);
    if (!(z >= ZOOM_MIN && z <= ZOOM_MAX) || Number.isNaN(z)) inRange = false;
  }
  check("kéo tay kiểu gì cỡ mô hình cũng nằm trong [0,5 – 2,6]", inRange);
}

console.log("\n8. Vùng chết và chênh lệch góc");
{
  check("lệch nhỏ hơn vùng chết → bỏ qua hẳn", deadzone(0.03, 0.05) === 0);
  check("vượt vùng chết thì tính TỪ 0, không giật nảy", Math.abs(deadzone(0.06, 0.05) - 0.01) < 1e-9);
  check("chiều âm cũng vậy", Math.abs(deadzone(-0.06, 0.05) + 0.01) < 1e-9);
  check("góc qua mốc ±π không nhảy 2π", Math.abs(angleDelta(-3.1, 3.1) - 0.0832) < 0.01);
}


console.log(
  failed === 0 ? "\n✓ Toàn bộ kiểm thử cử chỉ đạt\n" : `\n✗ ${failed} kiểm thử KHÔNG đạt\n`,
);
process.exit(failed === 0 ? 0 : 1);
