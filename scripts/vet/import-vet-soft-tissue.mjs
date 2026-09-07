#!/usr/bin/env node
// NẠP LỚP MÔ MỀM THÚ Y (cơ · nội tạng · mạch · giác quan)
//
//   SKFB_TOKEN=<token> node scripts/vet/import-vet-soft-tissue.mjs
//   SKFB_TOKEN=<token> node scripts/vet/import-vet-soft-tissue.mjs --dry
//   SKFB_TOKEN=<token> node scripts/vet/import-vet-soft-tissue.mjs --only cat
//
// Danh sách nguồn nằm ở `src/lib/vet/softTissue.ts` — mỗi mục đã kiểm từng uid
// qua Sketchfab Data API và ĐỀU LÀ CC BY 4.0, cho tải.
//
// ────────────────────────────────────────────────────────────────────────────
// KHÁC GÌ `import-lmu-models.mjs`
//
// Bộ LMU mang CC BY-NC-ND. ND cấm phát hành tác phẩm phái sinh nên script kia
// TUYỆT ĐỐI không đụng vào hình học, và mô hình nào quá nặng thì bỏ hẳn.
//
// Bộ này là CC BY thuần — CHO PHÉP tác phẩm phái sinh. Vì thế ở đây được phép
// giảm lưới, và đó là điều bắt buộc: “Becken Rind” 4,4 triệu mặt gấp 2,4 lần
// ngân sách 1,8 triệu của dự án, để nguyên thì máy tích hợp GPU yếu mở không
// nổi. Đổi lại, CC BY vẫn buộc ghi công, và phần ghi công đi thẳng vào registry
// sinh ra ở cuối script nên không thể nạp mà quên nguồn.
//
// Điều kiện NC thì bộ này KHÔNG có, nên nhẹ hơn LMU một ràng buộc.
// ────────────────────────────────────────────────────────────────────────────

import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const TOKEN = process.env.SKFB_TOKEN ?? argOf("--token");
const DRY = process.argv.includes("--dry");
const ONLY = argOf("--only");
const BLENDER = process.env.BLENDER ?? "blender";

/** Ngân sách tam giác của dự án — đúng con số `verify:models` dùng cho bên người. */
const FACE_BUDGET = 1_800_000;

/**
 * TRẦN DUNG LƯỢNG mỗi tệp — và đây mới là ràng buộc thật sự cắn.
 *
 * Lần chạy đầu lọc theo số tam giác thôi thì 14 tệp ra 306 MB: "Bovine Rumen"
 * đúng ngân sách tam giác nhưng nặng 54,6 MB, "Rind Vordergliedmaße" 48,8 MB.
 * Đúng cái bẫy bộ LMU đã dính — SỐ TAM GIÁC LÀ CHỈ BÁO TỒI cho mẫu quét, dung
 * lượng nằm gần hết ở ẢNH BỀ MẶT chứ không ở hình học.
 *
 * Nên sau khi giảm lưới (nếu cần) mọi tệp còn phải đi qua `gltf-transform
 * optimize`: hạ ảnh xuống 2048, nén WebP, nén hình học bằng Draco. Tệp nào vẫn
 * quá trần thì hạ tiếp ảnh xuống 1024 rồi 512. Trần 8 MB, hơi rộng hơn model
 * lớn nhất bên người (trunk.glb 5,96 MB): phải nới vì bước nén KHÔNG được phép
 * gộp mesh nữa (xem `optimize`), mà không gộp thì tệp nhỉnh hơn chút.
 */
const SIZE_CAP = 8 * 1024 * 1024;
const TEXTURE_STEPS = [2048, 1024, 512];

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "models", "vet");
const WORK_DIR = path.join(ROOT, ".cache", "vet-soft-tissue");
const REGISTRY = path.join(ROOT, "src", "lib", "vet", "modelsGenerated.ts");
const DECIMATE = path.join(ROOT, "scripts", "blender", "decimate_glb.py");
const SEGMENT = path.join(ROOT, "scripts", "vet", "segment_by_seeds.py");
const GLTF_TRANSFORM = path.join(ROOT, "node_modules", "@gltf-transform", "cli", "bin", "cli.js");

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

if (!TOKEN) {
  console.error(
    "\n✗ Thiếu token Sketchfab.\n" +
      "  Lấy ở: Sketchfab → Settings → Password & API → API Token\n" +
      "  Rồi chạy: SKFB_TOKEN=<token> node scripts/vet/import-vet-soft-tissue.mjs\n",
  );
  process.exit(1);
}

const H = { Authorization: `Token ${TOKEN}`, "User-Agent": "SomaAtlas/1.0" };

/**
 * Đọc danh sách nguồn từ `softTissue.ts` mà KHÔNG cần bước biên dịch TypeScript.
 *
 * Script chạy bằng `node` trần (giống hai script nạp sẵn có), nên không import
 * được tệp .ts. Thay vì dựng thêm một đường ống ts-node chỉ để đọc một mảng
 * hằng, trích thẳng bằng biểu thức chính quy — và kiểm ngay số mục đọc được so
 * với số lần xuất hiện `uid:` trong tệp, để một ngày nào đó định dạng tệp đổi
 * thì script BÁO LỖI chứ không âm thầm nạp thiếu.
 */
function readSources() {
  // Chuan hoa CRLF sang LF truoc khi khop: repo nay luu tep bang CRLF, ma moi
  // bieu thuc duoi day neo vao dau dong LF. Lan dau chay duoc chi vi tep luc do
  // tinh co la LF; sua tep mot lan nua la script im lang doc ra 0 muc.
  const src = readFileSync(path.join(ROOT, "src", "lib", "vet", "softTissue.ts"), "utf8")
    .replace(/\r\n/g, "\n");
  const body = src.slice(src.indexOf("VET_SOFT_TISSUE: VetSoftTissueSource[] = ["));
  const field = (block, name) => {
    const m = block.match(new RegExp(`\\b${name}:\\s*"([^"]*)"`));
    return m ? m[1] : "";
  };
  const out = [];
  for (const block of body.split(/\n  \{\n/).slice(1)) {
    const uid = field(block, "uid");
    if (!uid) continue;
    const t = block.match(/title:\s*\{([\s\S]*?)\}/);
    const lang = (code) => {
      const m = t ? t[1].match(new RegExp(`${code}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)) : null;
      return m ? m[1] : "";
    };
    out.push({
      uid,
      slug: field(block, "slug"),
      species: field(block, "species"),
      layer: field(block, "layer"),
      region: field(block, "region"),
      attribution: field(block, "attribution"),
      faces: Number((block.match(/faces:\s*(\d+)/) ?? [])[1] ?? 0),
      title: { vi: lang("vi"), en: lang("en"), zh: lang("zh") },
      // Khối `parts` chép NGUYÊN VĂN sang registry chứ không phân tích rồi dựng
      // lại: nó chỉ là chữ nghĩa ba thứ tiếng, phân tích lại chỉ thêm chỗ sai.
      partsSrc: (block.match(/\n    parts: \[\n([\s\S]*?)\n    \],/) ?? [])[1] ?? "",
      hotspotsSrc: (block.match(/\n    hotspots: \[\n([\s\S]*?)\n    \],/) ?? [])[1] ?? "",
      segment: /\n    segment: true,/.test(block),
      // Toạ độ dạng số cho bước cắt vùng — `hotspotsSrc` là chữ để chép thẳng
      // sang registry, còn Blender thì cần số.
      spots: [...(block.matchAll(/factId: "([^"]+)", position: \[([^\]]+)\]/g))].map((m) => ({
        factId: m[1],
        position: m[2].split(",").map(Number),
      })),
    });
  }
  const declared = (body.match(/^    uid:/gm) ?? []).length;
  if (out.length !== declared) {
    throw new Error(
      `đọc được ${out.length} mục nhưng softTissue.ts khai ${declared} — định dạng tệp đã đổi, sửa readSources() trước khi chạy tiếp`,
    );
  }
  for (const s of out) {
    if (!s.slug || !s.species || !s.layer || !s.region || !s.attribution || !s.title.vi) {
      throw new Error(`mục ${s.uid} thiếu trường bắt buộc`);
    }
  }
  return out;
}

/**
 * Gọi API, tự lùi khi bị chặn tốc độ (Sketchfab trả 429 khi gọi dồn).
 *
 * `auth = false` cho phần TRA CỨU: endpoint đọc bản ghi vốn công khai, mà gửi
 * kèm một token hỏng thì máy chủ trả 401 và ta mất luôn khả năng nói cho người
 * chạy biết giấy phép hiện là gì. Token chỉ thật sự cần ở endpoint tải.
 */
async function api(url, { auth = true, tries = 5 } = {}) {
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    const res = await fetch(url, { headers: auth ? H : { "User-Agent": H["User-Agent"] } });
    if (res.ok) return res.json();
    if (res.status !== 429 || attempt === tries) {
      throw new Error(`${res.status} ${res.statusText} — ${url}`);
    }
    const after = Number(res.headers.get("retry-after"));
    const wait = Number.isFinite(after) && after > 0 ? after * 1000 : 2000 * 2 ** (attempt - 1);
    process.stdout.write(`\n  bị chặn tốc độ, đợi ${Math.round(wait / 1000)}s…            `);
    await new Promise((r) => setTimeout(r, wait));
  }
  throw new Error("hết lượt thử");
}

/**
 * Kiểm giấy phép TẠI THỜI ĐIỂM TẢI, không tin vào ghi chú trong mã.
 *
 * Tác giả có quyền đổi giấy phép bất cứ lúc nào. Danh sách trong softTissue.ts
 * ghi lại kết quả rà ngày 01/09/2026; nếu hôm nay một mô hình đã chuyển sang ND
 * thì giảm lưới nó là vi phạm. Nên mỗi lần chạy đều hỏi lại máy chủ, và mục nào
 * không còn là giấy phép cho phái sinh thì BỎ, kèm lời giải thích.
 */
const DERIVATIVES_OK = /^(CC0|CC Attribution$|CC Attribution-ShareAlike|Public Domain)/i;

async function inspect(uid) {
  const m = await api(`https://api.sketchfab.com/v3/models/${uid}`, { auth: false });
  return {
    license: (m.license?.label ?? "").trim(),
    downloadable: Boolean(m.isDownloadable),
    faces: m.faceCount ?? 0,
    author: m.user?.displayName ?? m.user?.username ?? "",
    url: m.viewerUrl ?? `https://sketchfab.com/3d-models/${uid}`,
  };
}

async function download(uid, dest) {
  const links = await api(`https://api.sketchfab.com/v3/models/${uid}/download`);
  const glb = links.glb;
  if (!glb?.url) throw new Error("bản ghi không có biến thể .glb");
  const res = await fetch(glb.url);
  if (!res.ok) throw new Error(`tải .glb lỗi ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return statSync(dest).size;
}

function decimate(src, dst) {
  execFileSync(BLENDER, ["--background", "--python", DECIMATE, "--", src, dst, String(FACE_BUDGET)], {
    stdio: "pipe",
  });
}

/**
 * Nén một .glb cho web. Trả về dung lượng cuối.
 *
 * `--simplify false`: việc giảm tam giác đã do Blender làm theo đúng ngân sách
 * của dự án; để gltf-transform giảm thêm một lần nữa là giảm hai lần chồng lên
 * nhau, mẫu vật quét sẽ vỡ mặt.
 *
 * `--join/--flatten/--palette/--instance false`: ĐÂY LÀ ĐIỀU QUAN TRỌNG NHẤT
 * của bước này, và là một lỗi đã mắc rồi sửa. Lệnh `optimize` mặc định gộp mesh
 * và trộn vật liệu để giảm draw call. Nhưng mẫu quét thú y KHÔNG có tên bộ phận
 * ở mesh (toàn `Object_0`) — thứ duy nhất mang nhãn giải phẫu là TÊN VẬT LIỆU
 * ("default_05b_Liver_1", "default_06b_Intestines_dec"…). Gộp là xoá sạch nhãn,
 * và mất luôn khả năng tách từng cơ quan. Chấp nhận nhiều draw call hơn để giữ
 * nhãn: hệ tiêu hoá mèo nhờ vậy tách được 8 cơ quan, ổ bụng chó 5, khối máu tim
 * chó 3. Xem `parts` trong `softTissue.ts`.
 */
/**
 * Cắt mẫu thành từng vùng theo các điểm chú giải.
 *
 * Chạy TRƯỚC bước nén và SAU bước giảm lưới: toạ độ điểm mồi đo trên lưới đã
 * giảm, còn bước nén thì không đụng vào vị trí đỉnh nên chạy sau vẫn khớp.
 */
function segment(src, dst, spots) {
  const seedFile = path.join(WORK_DIR, `${path.basename(dst, ".glb")}.seeds.json`);
  writeFileSync(seedFile, JSON.stringify(spots.map((h) => ({ id: h.factId, position: h.position }))), "utf8");
  execFileSync(BLENDER, ["--background", "--python", SEGMENT, "--", src, dst, seedFile], {
    stdio: "pipe",
  });
}

function gltf(argv) {
  execFileSync(process.execPath, [GLTF_TRANSFORM, ...argv], { stdio: "pipe" });
}

/**
 * Nén một .glb cho web. Trả về dung lượng cuối.
 *
 * `--simplify false`: việc giảm tam giác đã do Blender làm theo đúng ngân sách
 * của dự án; để gltf-transform giảm thêm một lần nữa là giảm hai lần chồng lên
 * nhau, mẫu vật quét sẽ vỡ mặt.
 *
 * `--join/--flatten/--palette/--instance false`: lệnh `optimize` mặc định gộp
 * mesh và trộn vật liệu để giảm draw call. Nhưng thứ duy nhất mang nhãn giải
 * phẫu trên mẫu quét thú y là TÊN VẬT LIỆU — gộp là xoá sạch nhãn và mất luôn
 * khả năng tách bộ phận. Chấp nhận nhiều draw call hơn để giữ nhãn.
 *
 * MẪU ĐÃ CẮT VÙNG thì KHÔNG dùng `optimize` được nữa, dù đã tắt hết mấy cờ
 * trên: bên trong nó còn chạy `dedup`, mà 14 vùng vừa cắt có vật liệu giống
 * hệt nhau nên bị nhập làm một — 14 nhãn về còn 1, im lặng. Với chúng thì chạy
 * tay từng lệnh, và `dedup` không nằm trong danh sách.
 */
function compress(src, dst, textureSize, segmented) {
  if (!segmented) {
    gltf([
      "optimize", src, dst,
      "--texture-size", String(textureSize),
      "--texture-compress", "webp",
      "--compress", "draco",
      "--simplify", "false",
      "--join", "false",
      "--flatten", "false",
      "--palette", "false",
      "--instance", "false",
    ]);
    return statSync(dst).size;
  }
  const tmpA = path.join(WORK_DIR, `${path.basename(dst, ".glb")}.rs.glb`);
  const tmpB = path.join(WORK_DIR, `${path.basename(dst, ".glb")}.wp.glb`);
  gltf(["resize", src, tmpA, "--width", String(textureSize), "--height", String(textureSize)]);
  gltf(["webp", tmpA, tmpB]);
  gltf(["draco", tmpB, dst]);
  return statSync(dst).size;
}

const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

/**
 * Bộ phận của mẫu ĐÃ CẮT VÙNG suy thẳng ra từ điểm mồi: tên vật liệu chính là
 * `factId`, nên chỉ cần trỏ `factId` là trang xem tự đọc tên và thuật ngữ NAV
 * từ kho tri thức. Không chép tên vào đây — chép là để hai nơi lệch nhau.
 */
function partsFromSpots(spots) {
  if (!spots?.length) return "";
  const rows = spots
    .map((h) => `      { material: "${h.factId}", factId: "${h.factId}" },`)
    .join("\n");
  return `\n    parts: [\n${rows}\n    ],`;
}

function writeRegistry(entries) {
  const head = readFileSync(REGISTRY, "utf8").split("export const generatedVetModels")[0];
  const body = entries
    .map(
      (e) => `  {
    slug: "${e.slug}",
    species: "${e.species}",
    layer: "${e.layer}",
    region: "${e.region}",
    title: {
      vi: "${esc(e.title.vi)}",
      en: "${esc(e.title.en)}",
      zh: "${esc(e.title.zh)}",
    },
    file: "${e.file}",
    license: "${esc(e.license)}",
    attribution: "${esc(e.attribution)}",
    sourceUrl: "${e.sourceUrl}",
    segmented: ${e.segment && e.spots.length >= 2 ? "true" : "false"},
    hotspots: [${e.hotspotsSrc ? `\n${e.hotspotsSrc}\n  ` : ""}],${e.segment ? partsFromSpots(e.spots) : e.partsSrc ? `\n    parts: [\n${e.partsSrc}\n    ],` : ""}
  },`,
    )
    .join("\n");
  writeFileSync(REGISTRY, `${head}export const generatedVetModels: VetModel[] = [\n${body}\n];\n`, "utf8");
}

const main = async () => {
  let sources = readSources();
  if (ONLY) sources = sources.filter((s) => s.species === ONLY);
  if (!sources.length) {
    console.error(`✗ Không có nguồn nào khớp --only ${ONLY}`);
    process.exit(1);
  }

  console.log(`\n→ ${sources.length} nguồn mô mềm cần kiểm giấy phép…\n`);

  const ready = [];
  for (const s of sources) {
    const info = await inspect(s.uid);
    const ok = info.downloadable && DERIVATIVES_OK.test(info.license);
    console.log(
      `  ${ok ? "✓" : "✗"} ${s.slug.padEnd(24)} ${info.license || "(không rõ giấy phép)"}` +
        `${info.downloadable ? "" : " · KHÔNG cho tải"} · ${info.faces.toLocaleString("vi")} mặt`,
    );
    if (ok) ready.push({ ...s, ...info });
    await new Promise((r) => setTimeout(r, 250));
  }

  if (ready.length < sources.length) {
    console.log(
      `\n  ${sources.length - ready.length} mục bị bỏ: giấy phép đã đổi hoặc tác giả tắt tải.\n` +
        "  Cập nhật src/lib/vet/softTissue.ts cho khớp thực tế thay vì bỏ qua.",
    );
  }
  if (DRY) return;

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(WORK_DIR, { recursive: true });

  const entries = [];
  for (const s of ready) {
    const raw = path.join(WORK_DIR, `${s.uid}.glb`);
    const dest = path.join(OUT_DIR, `${s.slug}.glb`);
    process.stdout.write(`\n  ${s.slug}: `);
    try {
      if (!existsSync(raw)) {
        process.stdout.write("tải… ");
        await download(s.uid, raw);
      }
      const rawSize = statSync(raw).size;
      process.stdout.write(`gốc ${mb(rawSize)} · `);

      // Bước 1 — vượt ngân sách tam giác thì giảm lưới bằng Blender.
      let staged = raw;
      if (s.faces > FACE_BUDGET) {
        process.stdout.write("giảm lưới… ");
        staged = path.join(WORK_DIR, `${s.uid}.dec.glb`);
        decimate(raw, staged);
      }

      // Bước 1b — cắt mẫu thành từng vùng theo điểm chú giải, nếu có khai.
      // Đặt SAU giảm lưới (toạ độ mồi đo trên lưới đã giảm) và TRƯỚC nén (nén
      // giữ nguyên vị trí đỉnh nên thứ tự này không làm lệch điểm mồi).
      if (s.segment && s.spots.length >= 2) {
        process.stdout.write(`cắt ${s.spots.length} vùng… `);
        const cut = path.join(WORK_DIR, `${s.uid}.seg.glb`);
        segment(staged, cut, s.spots);
        staged = cut;
      }

      // Bước 2 — nén cho web, hạ dần độ phân giải ảnh cho tới khi lọt trần.
      let size = 0;
      for (const px of TEXTURE_STEPS) {
        process.stdout.write(`nén ${px}px… `);
        size = compress(staged, dest, px, Boolean(s.segment && s.spots.length >= 2));
        if (size <= SIZE_CAP) break;
      }
      process.stdout.write(`xong ${mb(size)}${size > SIZE_CAP ? " (VẪN QUÁ TRẦN)" : ""}`);

      entries.push({
        slug: s.slug,
        species: s.species,
        layer: s.layer,
        region: s.region,
        title: s.title,
        file: `${s.slug}.glb`,
        license: s.license === "CC Attribution" ? "CC BY 4.0" : s.license,
        attribution: s.attribution,
        sourceUrl: s.url,
        partsSrc: s.partsSrc,
        hotspotsSrc: s.hotspotsSrc,
        spots: s.spots,
        segment: s.segment,
      });
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      process.stdout.write(`LỖI — ${err.message}`);
      if (existsSync(dest)) rmSync(dest);
    }
  }

  writeRegistry(entries);
  console.log(
    `\n\n✓ Nạp ${entries.length}/${sources.length} mô hình · đã ghi ${path.relative(ROOT, REGISTRY)}\n` +
      "  Bước tiếp: npm run test:vet-kb, rồi dò hotspot bằng scripts/vet/hotspot_probe.py\n" +
      "  và chép toạ độ vào handPickedVetModels trong src/lib/vet/models.ts.\n",
  );
};

main().catch((err) => {
  console.error(`\n✗ ${err.message}\n`);
  process.exit(1);
});
