#!/usr/bin/env node
// NẠP BỘ GIẢI PHẪU THÚ Y CỦA LMU MÜNCHEN
//
//   SKFB_TOKEN=<token> node scripts/vet/import-lmu-models.mjs
//   SKFB_TOKEN=<token> node scripts/vet/import-lmu-models.mjs --dry
//
// Nguồn: Chair of Anatomy, Histology and Embryology — Department of Veterinary
// Sciences, LMU München (sketchfab.com/vetanatMunich). Mỗi mô hình là MỘT xương
// hoặc MỘT cơ quan, có sẵn tên Latin trong tiêu đề — đây là điều bộ scan thú y
// mở khác không có, và là lý do bộ này đáng nạp.
//
// ────────────────────────────────────────────────────────────────────────────
// VÌ SAO KHÔNG VI PHẠM GIẤY PHÉP ND
//
// Phần lớn mô hình mang CC BY-NC-ND. ND cấm PHÁT HÀNH tác phẩm phái sinh, và
// giảm lưới thì đúng là tạo tác phẩm phái sinh — nên script này TUYỆT ĐỐI
// KHÔNG giảm lưới, không xuất lại, không đụng vào hình học.
//
// Nó tải đúng biến thể `.glb` do CHÍNH Sketchfab sinh ra và lưu nguyên vẹn.
// Kể cả việc đổi định dạng cũng đã được cho phép tường minh — CC 4.0 mục
// 2(a)(4): "the Licensor authorizes You to exercise the Licensed Rights in all
// media and formats… and to make technical modifications necessary to do so",
// và nói rõ "simply making modifications authorized by this Section 2(a)(4)
// never produces Adapted Material".
//
// Hai điều kiện còn lại cũng phải giữ, và được giữ ở chỗ khác trong mã:
//   NC — đồ án học tập, không thu tiền, không quảng cáo.
//   BY — giấy phép + tác giả + link bản gốc hiện NGAY dưới khung xem
//        (kiểu `VetModel` bắt buộc ba trường ấy; test:vet-kb chặn nếu thiếu).
//
// Vì thế mô hình nào NẶNG HƠN ngân sách tam giác thì BỎ QUA, không giảm lưới
// để nhét vào — thà thiếu một cái xương còn hơn phát hành một bản phái sinh
// không được phép.
// ────────────────────────────────────────────────────────────────────────────

import { createWriteStream, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const TOKEN = process.env.SKFB_TOKEN ?? argOf("--token");
const DRY = process.argv.includes("--dry");
const USER = "vetanatMunich";

/** Ngân sách tam giác của dự án, đúng con số `verify:models` dùng cho bên người. */
const FACE_BUDGET = 1_800_000;

/**
 * Trần DUNG LƯỢNG mỗi tệp, tính bằng byte.
 *
 * Số tam giác là chỉ báo tồi cho mẫu quét: phần lớn dung lượng nằm ở ảnh bề
 * mặt, không ở hình học. Đo thật 38 tệp đầu: trung vị 2,0 MB nhưng có tệp
 * MỘT CÁI RĂNG nặng 66 MB — vài con số ấy chiếm gần hết tổng 344 MB. Lọc theo
 * dung lượng giữ được 33/38 tệp mà tổng chỉ còn 67 MB.
 *
 * 4 MB xấp xỉ cỡ model lớn nhất bên người (trunk.glb 5,96 MB) nên hợp với
 * đường truyền mà trang này vốn đã chấp nhận.
 */
const SIZE_CAP = 4 * 1024 * 1024;

const OUT_DIR = path.join(process.cwd(), "public", "models", "vet", "lmu");
const REGISTRY = path.join(process.cwd(), "src", "lib", "vet", "lmuData.ts");

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

if (!TOKEN) {
  console.error(
    "\n✗ Thiếu token Sketchfab.\n" +
      "  Lấy ở: Sketchfab → Settings → Password & API → API Token\n" +
      "  Rồi chạy: SKFB_TOKEN=<token> node scripts/vet/import-lmu-models.mjs\n",
  );
  process.exit(1);
}

const H = { Authorization: `Token ${TOKEN}`, "User-Agent": "SomaAtlas/1.0" };

/**
 * Loài lấy từ tiêu đề. Tiêu đề LMU theo mẫu:
 *   "<tên tiếng Anh> (<tên Latin>) <loài> [(ghi chú)]"
 * ví dụ "4th tarsal bone (os tarsale quartum) dog".
 */
const SPECIES_WORDS = {
  dog: "dog",
  cat: "cat",
  horse: "horse",
  cow: "cattle",
  cattle: "cattle",
  bull: "cattle",
  pig: "pig",
  boar: "pig",
  chicken: "chicken",
  hen: "chicken",
  fowl: "chicken",
};

function parseTitle(title) {
  const latinMatch = title.match(/\(([^)]*)\)/);
  const latin = latinMatch ? latinMatch[1].trim() : "";
  const nameEn = (latinMatch ? title.slice(0, latinMatch.index) : title).trim();
  const rest = latinMatch ? title.slice(latinMatch.index + latinMatch[0].length) : "";
  const low = ` ${title.toLowerCase()} `;
  let species = null;
  for (const [word, key] of Object.entries(SPECIES_WORDS)) {
    if (new RegExp(`[^a-z]${word}[^a-z]`).test(low)) {
      species = key;
      break;
    }
  }
  const noteMatch = rest.match(/\(([^)]*)\)/);
  return { nameEn, latin, species, note: noteMatch ? noteMatch[1].trim() : "" };
}

/**
 * Gọi API, tự lùi khi bị chặn tốc độ.
 *
 * Sketchfab trả 429 khi gọi dồn: lần chạy đầu mất 113/151 mô hình vì lỗi này mà
 * script chỉ ghi cảnh báo rồi đi tiếp. Nay đợi theo `Retry-After` nếu máy chủ
 * nói, không thì lùi theo cấp số nhân.
 */
async function api(url, tries = 5) {
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    const res = await fetch(url, { headers: H });
    if (res.ok) return res.json();
    if (res.status !== 429 || attempt === tries) {
      throw new Error(`${res.status} ${res.statusText} — ${url}`);
    }
    const after = Number(res.headers.get("retry-after"));
    const wait = Number.isFinite(after) && after > 0 ? after * 1000 : 2000 * 2 ** (attempt - 1);
    process.stdout.write(`
  bị chặn tốc độ, đợi ${Math.round(wait / 1000)}s…            `);
    await new Promise((r) => setTimeout(r, wait));
  }
  throw new Error("hết lượt thử");
}

async function listAll() {
  let url = `https://api.sketchfab.com/v3/models?user=${USER}&count=24`;
  const out = [];
  while (url) {
    const page = await api(url);
    out.push(...page.results);
    url = page.next;
    await new Promise((r) => setTimeout(r, 200));
  }
  return out;
}

async function download(uid, dest) {
  const links = await api(`https://api.sketchfab.com/v3/models/${uid}/download`);
  // Lấy thẳng biến thể .glb do Sketchfab sinh — không qua bước xuất lại nào của
  // ta, nên tệp phát hành đúng bằng tệp bên cấp phép tạo ra.
  const glb = links.glb;
  if (!glb?.url) throw new Error("bản ghi không có biến thể .glb");
  // Endpoint khai sẵn dung lượng, nên tệp quá nặng thì loại TRƯỚC khi tải —
  // không tải về rồi mới xoá.
  if (glb.size && glb.size > SIZE_CAP) {
    return { skipped: `${(glb.size / 1048576).toFixed(0)} MB, quá trần` };
  }
  const res = await fetch(glb.url);
  if (!res.ok) throw new Error(`tải .glb lỗi ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return { size: statSync(dest).size };
}

const main = async () => {
  console.log(`→ Liệt kê mô hình của ${USER}…`);
  const all = await listAll();
  console.log(`  ${all.length} mô hình.`);

  const wanted = all
    .map((m) => ({ raw: m, parsed: parseTitle(m.name) }))
    .filter(({ raw, parsed }) => {
      if (!raw.isDownloadable) return false;
      if (!parsed.species) return false;
      // Quá ngân sách thì bỏ, KHÔNG giảm lưới (xem ghi chú giấy phép ở đầu tệp).
      if ((raw.faceCount ?? 0) > FACE_BUDGET) return false;
      return true;
    });

  // LMU đăng trùng khá nhiều (cùng một cái răng lợn có hai bản, mỗi bản 66 MB).
  // Giữ bản NHẸ nhất của mỗi (loài + tên + tên Latin).
  const bestOf = new Map();
  for (const w of wanted) {
    const key = `${w.parsed.species}|${w.parsed.nameEn.toLowerCase()}|${w.parsed.latin.toLowerCase()}`;
    const cur = bestOf.get(key);
    if (!cur || (w.raw.faceCount ?? 0) < (cur.raw.faceCount ?? 0)) bestOf.set(key, w);
  }
  const unique = [...bestOf.values()];
  console.log(
    `  ${wanted.length} mô hình thuộc sáu loài, tải được → ${unique.length} sau khi bỏ bản trùng.`,
  );
  const perSpecies = {};
  for (const w of unique) perSpecies[w.parsed.species] = (perSpecies[w.parsed.species] ?? 0) + 1;
  console.log("  " + Object.entries(perSpecies).map(([k, v]) => `${k} ${v}`).join(" · "));

  if (DRY) {
    for (const w of unique) console.log(`   ${w.parsed.species.padEnd(8)} ${w.raw.name}`);
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const entries = [];
  let bytes = 0;
  let skipped = 0;
  for (const { raw, parsed } of unique) {
    const file = `${raw.uid}.glb`;
    const dest = path.join(OUT_DIR, file);
    try {
      if (existsSync(dest)) {
        if (statSync(dest).size > SIZE_CAP) {
          rmSync(dest);
          skipped += 1;
          continue;
        }
        bytes += statSync(dest).size;
      } else {
        const result = await download(raw.uid, dest);
        if (result.skipped) {
          skipped += 1;
          continue;
        }
        bytes += result.size;
        await new Promise((r) => setTimeout(r, 700));
      }
      entries.push({
        uid: raw.uid,
        file,
        species: parsed.species,
        nameEn: parsed.nameEn,
        latin: parsed.latin,
        note: parsed.note,
        faces: raw.faceCount ?? 0,
        license: (raw.license?.label ?? "").trim(),
        author: raw.user?.displayName ?? USER,
        sourceUrl: raw.viewerUrl ?? `https://sketchfab.com/3d-models/${raw.uid}`,
      });
      process.stdout.write(`\r  đã tải ${entries.length}/${wanted.length}   `);
    } catch (error) {
      console.warn(`\n  ⚠ bỏ qua ${raw.name}: ${error.message}`);
    }
  }
  console.log(`\n  Tổng ${(bytes / 1048576).toFixed(1)} MB.`);

  writeRegistry(entries);
};

function writeRegistry(entries) {
  const body = `// TỆP SINH TỰ ĐỘNG — đừng sửa tay.
// Sinh bởi scripts/vet/import-lmu-models.mjs từ sketchfab.com/${USER}.
//
// Mỗi mô hình là bản .glb do chính Sketchfab sinh ra, KHÔNG giảm lưới và không
// xuất lại — xem ghi chú giấy phép ở đầu script nạp. Giấy phép, tác giả và link
// bản gốc đi kèm từng mục và bắt buộc hiện trên trang.

export type LmuModel = {
  uid: string;
  file: string;
  species: string;
  nameEn: string;
  latin: string;
  note: string;
  faces: number;
  license: string;
  author: string;
  sourceUrl: string;
};

export const LMU_ATTRIBUTION =
  "Chair of Anatomy, Histology and Embryology, Department of Veterinary Sciences, LMU München";

export const lmuModels: LmuModel[] = ${JSON.stringify(entries, null, 2)};

export const lmuOfSpecies = (species: string) => lmuModels.filter((m) => m.species === species);
`;
  writeFileSync(REGISTRY, body, "utf8");
  console.log(`✓ Đã ghi ${REGISTRY} (${entries.length} mục)`);
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}\n`);
  process.exit(1);
});
