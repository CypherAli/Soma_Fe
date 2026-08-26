#!/usr/bin/env node
// NẠP MỘT MÔ HÌNH 3D THÚ Y VÀO ATLAS
//
//   node scripts/vet/import-vet-model.mjs <tệp .glb|.gltf|.obj|.stl|.ply> \
//        --species dog --slug dog-skull --license "CC BY 4.0" \
//        --by "Tên tác giả / bảo tàng" --url https://...
//
// Việc script làm:
//   1. Kiểm giấy phép có nằm trong danh sách CHO PHÉP không. Giấy phép ND
//      (NoDerivatives) bị TỪ CHỐI thẳng: ta buộc phải giảm lưới để chạy được
//      trên web, mà giảm lưới chính là tạo tác phẩm phái sinh.
//   2. Chuyển sang .glb và giảm lưới bằng Blender (dùng lại đúng đường ống của
//      bên người: scripts/blender/decimate_glb.py).
//   3. Chép vào public/models/vet/ và in ra đoạn mã cần dán vào
//      src/lib/vet/models.ts — kèm sẵn giấy phép và ghi công, để không thể
//      thêm mô hình mà quên nguồn gốc.
//
// KHÔNG tự tải từ mạng: các nguồn còn dùng được (Sketchfab, MorphoSource) đều
// đòi đăng nhập, và tải hộ bằng tài khoản người khác là chuyện không nên làm.

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";

const ALLOWED = [
  "CC0", "CC0 1.0", "Public Domain",
  "CC BY 4.0", "CC BY 3.0", "CC BY-SA 4.0",
  "CC BY-NC 4.0", "CC BY-NC-SA 4.0",
];

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const opt = (name, fallback = "") => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const species = opt("species");
const slug = opt("slug");
const license = opt("license");
const by = opt("by");
const url = opt("url");

const SPECIES = ["dog", "cat", "horse", "cattle", "pig", "chicken"];

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!file || !existsSync(file)) die("Thiếu tệp mô hình, hoặc đường dẫn không tồn tại.");
if (!SPECIES.includes(species)) die(`--species phải là một trong: ${SPECIES.join(", ")}`);
if (!slug || !/^[a-z0-9-]+$/.test(slug)) die("--slug chỉ gồm chữ thường, số và dấu gạch ngang.");
if (!license) die("--license bắt buộc. Không có giấy phép thì không nạp.");
if (!by) die("--by (ghi công tác giả/bảo tàng) bắt buộc.");
if (!url) die("--url (đường dẫn tới bản gốc) bắt buộc.");

if (/\bND\b|NoDerivatives|-ND/i.test(license)) {
  die(
    "Giấy phép ND (NoDerivatives) không dùng được: mô hình phải giảm lưới mới chạy nổi trên web,\n" +
      "  mà giảm lưới là tạo tác phẩm phái sinh — điều ND cấm.",
  );
}
if (!ALLOWED.some((l) => license.toUpperCase().includes(l.toUpperCase()))) {
  console.warn(
    `\n⚠ Giấy phép "${license}" không nằm trong danh sách quen thuộc:\n  ${ALLOWED.join(" · ")}\n` +
      "  Hãy đọc kỹ điều khoản gốc trước khi dùng. Vẫn tiếp tục nạp.\n",
  );
}

const OUT_DIR = path.join(process.cwd(), "public", "models", "vet");
mkdirSync(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, `${slug}.glb`);

const BLENDER = process.env.BLENDER ?? "blender";
const decimate = path.join(process.cwd(), "scripts", "blender", "decimate_glb.py");

console.log(`\n→ Nạp ${path.basename(file)} thành ${slug}.glb`);
try {
  execFileSync(
    BLENDER,
    ["--background", "--python", decimate, "--", path.resolve(file), out],
    { stdio: "inherit", env: { ...process.env, PYTHONIOENCODING: "utf-8" } },
  );
} catch {
  die(
    "Blender chạy không thành công. Đặt biến môi trường BLENDER trỏ tới tệp thực thi Blender,\n" +
      "  ví dụ: BLENDER='C:/Program Files/Blender Foundation/Blender 5.1/blender.exe'",
  );
}

if (!existsSync(out)) die("Không sinh ra được tệp .glb — xem lại thông báo của Blender ở trên.");
const mb = (statSync(out).size / 1048576).toFixed(1);
console.log(`✓ Đã ghi ${out} (${mb} MB)`);
if (Number(mb) > 12) {
  console.warn(
    `⚠ ${mb} MB là nặng cho một trang web. Giảm lưới thêm trước khi phát hành ` +
      "(bên người giữ mọi mô hình dưới ~12 MB).",
  );
}

console.log(`
Dán đoạn dưới đây vào mảng \`vetModels\` trong src/lib/vet/models.ts,
rồi đặt hotspot theo toạ độ và chạy: npm run test:vet-kb

  {
    slug: "${slug}",
    species: "${species}",
    title: { vi: "", en: "", zh: "" },
    file: "${slug}.glb",
    license: ${JSON.stringify(license)},
    attribution: ${JSON.stringify(by)},
    sourceUrl: ${JSON.stringify(url)},
    hotspots: [
      // { factId: "...", position: [0, 0, 0] },
    ],
  },
`);
