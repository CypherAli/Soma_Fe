import type { T3 } from "@/lib/homeContent";

// KHÔNG GIAN NHÃN CỦA VISION AI — "quét bộ phận thật qua camera".
//
// Vì sao KHÔNG để mô hình thị giác chọn thẳng 1 trong ~190 scene: ảnh webcam
// một vùng da chỉ đủ thông tin để phân biệt VÙNG THÔ (cẳng tay, khuỷu, bàn
// tay…), không đủ để phân biệt "cổ tay và ống cổ tay" với "bàn tay chi tiết".
// Bắt nó chọn hẹp là chắc chắn sai. Nên tầng thị giác chỉ trả về một trong
// những nhãn dưới đây, rồi NGƯỜI DÙNG chọn scene trong danh sách gợi ý của
// nhãn đó — vừa đúng vừa dạy được người học vùng ấy có những mô hình nào.
//
// Phạm vi đã chốt với người dùng: chỉ CƠ THỂ CHÍNH NGƯỜI DÙNG trước webcam.
// Vì vậy danh sách chỉ gồm những vùng thực sự đưa được vào khung hình khi ngồi
// trước máy tính — không có nội tạng, không có mặt cắt, không có thú y.

export type VisionPartKey =
  | "head"
  | "face"
  | "eye"
  | "ear"
  | "mouth"
  | "neck"
  | "shoulder"
  | "upper-arm"
  | "elbow"
  | "forearm"
  | "wrist"
  | "hand"
  | "chest"
  | "abdomen"
  | "knee"
  | "foot";

export type VisionPart = {
  key: VisionPartKey;
  label: T3;
  /** Câu nhắc người dùng đưa bộ phận vào khung sao cho ảnh dùng được. */
  hint: T3;
  /**
   * Vùng con để đi sâu hơn. Quét cả cái đầu thì bước tự nhiên kế tiếp là soi
   * riêng mắt, tai hay miệng — cho sẵn lối rẽ ấy thay vì bắt người dùng quét lại.
   */
  children?: VisionPartKey[];
  /**
   * Scene gợi ý, xếp theo mức "sát với thứ vừa quét nhất" giảm dần.
   * MỌI slug ở đây đều phải tồn tại thật trong `sceneModules` HOẶC `atlasScenes`
   * (bài bộ phận `bo-phan-*` chỉ có trên atlas) — `npm run test:vision` kiểm điều
   * đó, đừng thêm slug tự nghĩ ra.
   *
   * Cập nhật 12/09/2026: nhiều slug cũ đã ĐỔI CHỦ ĐỀ khi thư viện chuyển sang atlas
   * (vd "co-mat" nay là khoang cẳng chân, "tai-day-du" là ĐM não trước) — quét mặt
   * mà gợi ý cẳng chân. Nay xếp bài bộ phận học theo lớp lên đầu, bỏ slug lạc chủ đề.
   */
  scenes: string[];
};

export const VISION_PARTS: VisionPart[] = [
  {
    key: "head",
    label: { vi: "Đầu", en: "Head", zh: "头部" },
    hint: {
      vi: "Ngắm ô ôm trọn cả đầu, từ đỉnh tới cằm.",
      en: "Frame the whole head, from crown to chin.",
      zh: "取景整个头部，从头顶到下巴。",
    },
    children: ["face", "eye", "ear", "mouth"],
    scenes: ["bo-phan-so", "bo-phan-nao", "giai-phau-dau", "so-nen-so", "nao-that-mang-nao"],
  },
  {
    key: "face",
    label: { vi: "Mặt", en: "Face", zh: "面部" },
    hint: {
      vi: "Đưa cả khuôn mặt vào khung, nhìn thẳng camera.",
      en: "Fit the whole face in the box, looking straight at the camera.",
      zh: "让整张脸进入取景框，正视摄像头。",
    },
    children: ["eye", "ear", "mouth"],
    // Atlas không có cơ bám da mặt: mặt học qua khung xương mặt, mũi–xoang, dây V1, bộ lệ.
    scenes: ["giai-phau-dau", "bo-phan-so", "mui-xoang", "than-kinh-sinh-ba", "le-dao"],
  },
  {
    key: "eye",
    label: { vi: "Mắt", en: "Eye", zh: "眼" },
    hint: {
      vi: "Đưa vùng quanh một bên mắt vào khung, mở to mắt.",
      en: "Frame the area around one eye and open it wide.",
      zh: "取景一只眼睛周围区域，睁大眼睛。",
    },
    scenes: ["bo-phan-mat", "bo-phan-hoc-mat", "giai-phau-mat", "hoc-mat", "duong-thi-giac", "le-dao"],
  },
  {
    key: "ear",
    label: { vi: "Tai", en: "Ear", zh: "耳" },
    hint: {
      vi: "Nghiêng đầu để lộ hẳn vành tai rồi đưa vào khung.",
      en: "Turn your head so the outer ear is fully visible, then frame it.",
      zh: "侧头露出耳廓后取景。",
    },
    // Atlas KHÔNG có tai (chỉ một lưới tai ngoài). Gợi ý gần nhất: nền sọ — phần đá xương
    // thái dương chứa tai giữa–tai trong; hệ đốt sống–thân nền — ĐM tiểu não trước dưới cho
    // nhánh mê đạo nuôi tai trong.
    scenes: ["so-nen-so", "goc-cau-tieu-nao"],
  },
  {
    key: "mouth",
    label: { vi: "Miệng – răng", en: "Mouth and teeth", zh: "口与牙" },
    hint: {
      vi: "Đưa vùng miệng vào khung, há miệng cho thấy răng.",
      en: "Frame the mouth and open it so the teeth show.",
      zh: "取景口部并张口露出牙齿。",
    },
    scenes: ["mieng-luoi-rang", "bo-rang", "tuyen-nuoc-bot", "hau-thanh-quan"],
  },
  {
    key: "neck",
    label: { vi: "Cổ", en: "Neck", zh: "颈部" },
    hint: {
      vi: "Ngửa nhẹ cằm để lộ hết vùng cổ trước.",
      en: "Lift your chin slightly so the front of the neck shows.",
      zh: "微抬下巴，露出整个颈前区。",
    },
    scenes: ["giai-phau-co", "tam-giac-co", "bo-phan-cot-song-co", "dong-mach-canh", "hach-co", "bo-phan-thanh-quan"],
  },
  {
    key: "shoulder",
    label: { vi: "Vai", en: "Shoulder", zh: "肩部" },
    hint: {
      vi: "Quay người lấy trọn một bên vai, để hở vùng khớp vai.",
      en: "Turn so one whole shoulder, joint included, is in frame.",
      zh: "转身使整个肩部连同肩关节入镜。",
    },
    scenes: ["bo-phan-vai", "giai-phau-dai-vai", "chop-xoay-vai", "vai-ho-nach", "khop-vai-khuyu"],
  },
  {
    key: "upper-arm",
    label: { vi: "Cánh tay", en: "Upper arm", zh: "上臂" },
    hint: {
      vi: "Lấy đoạn từ vai tới khuỷu, tay hơi co cho nổi cơ.",
      en: "Frame shoulder to elbow, arm slightly flexed.",
      zh: "取景肩到肘的一段，手臂略屈。",
    },
    scenes: ["bo-phan-canh-tay", "giai-phau-canh-tay", "co-canh-tay", "dong-mach-chi-tren", "moc-xuong-chi-tren"],
  },
  {
    key: "elbow",
    label: { vi: "Khuỷu tay", en: "Elbow", zh: "肘部" },
    hint: {
      vi: "Lấy riêng khớp khuỷu, gấp khoảng 90 độ.",
      en: "Frame the elbow joint alone, bent about 90 degrees.",
      zh: "单独取景肘关节，屈约 90 度。",
    },
    scenes: ["bo-phan-khuyu", "khop-khuyu", "ho-khuyu"],
  },
  {
    key: "forearm",
    label: { vi: "Cẳng tay", en: "Forearm", zh: "前臂" },
    hint: {
      vi: "Lấy đoạn từ khuỷu tới cổ tay, ngửa lòng bàn tay lên.",
      en: "Frame elbow to wrist with the palm facing up.",
      zh: "取景肘到腕的一段，掌心朝上。",
    },
    scenes: ["bo-phan-cang-tay", "giai-phau-cang-tay", "dong-mach-chi-tren", "tinh-mach-chi-tren", "moc-xuong-chi-tren"],
  },
  {
    key: "wrist",
    label: { vi: "Cổ tay", en: "Wrist", zh: "腕部" },
    hint: {
      vi: "Lấy riêng cổ tay, đưa mặt gan tay về phía camera.",
      en: "Frame the wrist alone, palm side toward the camera.",
      zh: "单独取景腕部，掌面朝向摄像头。",
    },
    scenes: ["co-tay-ong-co-tay", "bo-phan-ban-tay", "giai-phau-ban-tay", "ban-tay"],
  },
  {
    key: "hand",
    label: { vi: "Bàn tay", en: "Hand", zh: "手" },
    hint: {
      vi: "Xoè bàn tay, lấy trọn từ cổ tay tới đầu ngón.",
      en: "Spread the hand; frame from wrist to fingertips.",
      zh: "张开手掌，从腕到指尖完整入镜。",
    },
    scenes: ["bo-phan-ban-tay", "giai-phau-ban-tay", "ban-tay", "dam-roi-canh-tay", "co-tay-ong-co-tay"],
  },
  {
    key: "chest",
    label: { vi: "Ngực", en: "Chest", zh: "胸部" },
    hint: {
      vi: "Lùi ra cho lấy được cả lồng ngực trước.",
      en: "Move back so the whole front of the chest fits.",
      zh: "后退使整个胸前区入镜。",
    },
    scenes: ["bo-phan-long-nguc", "thanh-nguc", "vung-nguc-tuyen-vu", "bo-phan-tim", "bo-phan-phoi"],
  },
  {
    key: "abdomen",
    label: { vi: "Bụng", en: "Abdomen", zh: "腹部" },
    hint: {
      vi: "Lùi ra cho lấy được cả vùng bụng trước.",
      en: "Move back so the whole front of the abdomen fits.",
      zh: "后退使整个腹前区入镜。",
    },
    scenes: ["thanh-bung", "mat-cat-ngang-bung", "tong-quan-he-tieu-hoa", "bo-phan-gan", "bo-phan-da-day"],
  },
  {
    key: "knee",
    label: { vi: "Đầu gối", en: "Knee", zh: "膝部" },
    hint: {
      vi: "Lấy riêng khớp gối, chân duỗi thẳng.",
      en: "Frame the knee joint alone with the leg straight.",
      zh: "单独取景膝关节，腿伸直。",
    },
    scenes: ["bo-phan-goi", "khop-goi", "ho-khoeo", "vung-ben", "moc-xuong-chi-duoi"],
  },
  {
    key: "foot",
    label: { vi: "Bàn chân", en: "Foot", zh: "足" },
    hint: {
      vi: "Lấy trọn bàn chân từ cổ chân tới đầu ngón.",
      en: "Frame the whole foot from ankle to toes.",
      zh: "从踝到趾完整取景足部。",
    },
    scenes: ["bo-phan-co-chan-ban-chan", "ban-chan-chi-tiet", "ban-chan", "khop-co-chan", "gan-got-ong-co-chan"],
  },
];

export const VISION_PART_KEYS: VisionPartKey[] = VISION_PARTS.map((p) => p.key);

const byKey = new Map<string, VisionPart>(VISION_PARTS.map((p) => [p.key, p]));

export const getVisionPart = (key: string): VisionPart | undefined => byKey.get(key);

export const isVisionPartKey = (key: string): key is VisionPartKey => byKey.has(key);

/** Một dự đoán của tầng nhận diện. `score` là 0..1, đã chuẩn hoá. */
export type VisionGuess = { part: VisionPartKey; score: number };

/**
 * Ngưỡng tin cậy. Dưới ngưỡng này thì không coi kết quả nào là đáng tin nữa mà
 * chuyển sang bảng chọn tay — thà bắt người dùng chọn còn hơn mở nhầm mô hình.
 */
export const VISION_MIN_SCORE = 0.18;

/** Lọc, sắp xếp và cắt còn top-N dự đoán hợp lệ. */
export function rankGuesses(raw: unknown, limit = 3): VisionGuess[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: VisionGuess[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const part = (item as { part?: unknown }).part;
    const score = (item as { score?: unknown }).score;
    if (typeof part !== "string" || !isVisionPartKey(part)) continue;
    if (typeof score !== "number" || !Number.isFinite(score)) continue;
    if (seen.has(part)) continue;
    seen.add(part);
    out.push({ part, score: Math.min(1, Math.max(0, score)) });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit);
}
