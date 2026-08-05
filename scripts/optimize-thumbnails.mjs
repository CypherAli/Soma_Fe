/**
 * Nén thumbnail render từ Blender: PNG 900x900 (~1,1MB) -> JPEG 600x600 (~70KB).
 *
 *     node scripts/optimize-thumbnails.mjs
 *
 * Card trên trang danh mục chỉ hiển thị ảnh rộng khoảng 300px, giữ PNG kích
 * thước đầy đủ làm repo phình lên hàng chục MB mà mắt thường không phân biệt
 * được. Script chạy lại được nhiều lần: chỉ xử lý .png còn sót lại.
 */
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = "public/thumbnails";
const pngs = readdirSync(dir).filter((f) => f.endsWith(".png"));
if (pngs.length === 0) {
  console.log("Không còn .png nào để nén.");
  process.exit(0);
}

let before = 0;
let after = 0;
for (const png of pngs) {
  const src = join(dir, png);
  const out = join(dir, png.replace(/\.png$/, ".jpg"));
  before += statSync(src).size;
  await sharp(src)
    .resize(600, 600, { fit: "inside" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  after += statSync(out).size;
  unlinkSync(src);
  console.log(`${png} -> ${png.replace(/\.png$/, ".jpg")}`);
}
const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`\n${pngs.length} ảnh: ${mb(before)}MB -> ${mb(after)}MB`);
