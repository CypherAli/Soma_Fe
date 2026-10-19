// Kiểm thử đơn vị cho tầng lọc nhãn Vision AI — chạy bằng `npm run test:unit`
// (node --test có sẵn, không thêm phụ thuộc). Logic này quyết định máy mở đúng
// mô hình hay rớt về "tự chọn", nên phải gác bằng test chứ không chỉ verify tay.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { gpuTier, rankGuesses, withTiers } from "@/lib/vision/parts";

describe("rankGuesses", () => {
  it("loại nhãn lạ, điểm rác và trùng lặp, sắp xếp giảm dần, cắt top-3", () => {
    const out = rankGuesses([
      { part: "hand", score: 0.9 },
      { part: "mat", score: 0.99 },
      { part: "forearm", score: NaN },
      { part: "hand", score: 0.5 },
      { part: "neck", score: 0.4 },
      { part: "face", score: 0.7 },
      { part: "shoulder", score: 0.2 },
    ]);
    assert.deepEqual(
      out.map((g) => g.part),
      ["hand", "face", "neck"],
    );
  });

  it("kẹp điểm về [0, 1] và trả [] khi đầu vào không phải mảng", () => {
    assert.deepEqual(rankGuesses({}), []);
    assert.deepEqual(rankGuesses([{ part: "hand", score: 5 }]), [
      { part: "hand", score: 1 },
    ]);
  });
});

describe("gpuTier", () => {
  it("kNN được nói khớp rõ, zero-shot tối đa là có thể", () => {
    assert.equal(gpuTier(0.9, "knn"), "clear");
    assert.equal(gpuTier(0.9, "zero-shot"), "maybe");
    assert.equal(gpuTier(0.1, "knn"), "unsure");
  });
});

describe("withTiers", () => {
  it("gợi ý đầu giữ mức top, các gợi ý sau thấp hơn một bậc", () => {
    const out = withTiers(
      [
        { part: "hand", score: 0.9 },
        { part: "face", score: 0.7 },
      ],
      "clear",
    );
    assert.equal(out[0].tier, "clear");
    assert.equal(out[1].tier, "maybe");
  });
});
