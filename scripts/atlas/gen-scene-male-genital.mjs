/**
 * Sinh scene "Cơ quan sinh dục nam" (slug co-quan-sinh-duc-nam).
 * Chạy: node scripts/atlas/gen-scene-male-genital.mjs
 *
 * Bài Z-Anatomy cũ trùng nội dung với he-sinh-san-nam. Dùng lại NGUYÊN các
 * nhóm đã sinh ở male-repro.ts (chạy SAU gen-scene-male-repro), chỉ đổi slug,
 * tiêu đề và lời dẫn — một nguồn dữ liệu, không lệch nhau khi sửa.
 */
import fs from "fs";
import { emit } from "./lib.mjs";

const src = fs.readFileSync(new URL("../../src/lib/humanAtlas/scenes/male-repro.ts", import.meta.url), "utf8");
const m = src.match(/"groups": (\[[\s\S]*\])\s*\}\s*;\s*$/);
if (!m) throw new Error("khong doc duoc groups trong male-repro.ts");
const groups = JSON.parse(m[1]).map((g) => ({ key: g.key, name: g.name, latin: g.latin, note: g.note, tint: g.tint, ids: g.parts }));

emit({
  file: "male-genital",
  exportName: "maleGenitalScene",
  header: 'Scene "Cơ quan sinh dục nam" — cùng nhóm với scene he-sinh-san-nam.',
  scene: {
    slug: "co-quan-sinh-duc-nam",
    title: { vi: "Cơ quan sinh dục nam", en: "Male Genital Organs", zh: "男性生殖器官" },
    latin: "Organa genitalia masculina",
    intro: {
      vi: "Cơ quan sinh dục trong (tinh hoàn, mào tinh, ống dẫn tinh, túi tinh, tiền liệt) tạo và dẫn tinh trùng; cơ quan sinh dục ngoài (dương vật với hai thể hang, thể xốp và quy đầu) là cơ quan giao hợp và đường ra chung của nước tiểu và tinh dịch. Mỗi cơ quan một màu; bàng quang và niệu đạo để làm mốc. Bộ dữ liệu không có ống phóng tinh tách riêng.",
      en: "The internal genital organs (testis, epididymis, ductus deferens, seminal vesicle, prostate) make and carry sperm; the external organ (the penis with its two corpora cavernosa, corpus spongiosum and glans) is the organ of copulation and the shared outlet for urine and semen. Each organ has its own colour; the bladder and urethra are landmarks. The dataset has no separate ejaculatory duct.",
      zh: "内生殖器（睾丸、附睾、输精管、精囊、前列腺）产生并输送精子；外生殖器（阴茎，含两条阴茎海绵体、尿道海绵体及阴茎头）为交接器官，也是尿液和精液的共同出口。各器官以不同颜色显示；膀胱和尿道作为标志。数据集中无单独的射精管。",
    },
  },
  groups,
});
