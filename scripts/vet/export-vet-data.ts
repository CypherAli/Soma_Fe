// XUẤT KHO TRI THỨC THÚ Y RA JSON CHO BACKEND
//
//   npm run export:vet          — ghi đè soma_be/prisma/data/vet.json
//   npm run export:vet -- --check  — chỉ so, lệch thì thoát mã 1
//
// VÌ SAO CÓ TỆP NÀY: nội dung thú y biên soạn trong `src/lib/vet/` và trang web
// đọc thẳng từ đó (dựng tĩnh lúc build, không phụ thuộc backend — đúng cách bên
// người đang làm). Nhưng backend cũng cần biết sáu loài này để `/species`,
// `/anatomy-systems`, `/structures` trả về dữ liệu thật thay vì mỗi loài người.
//
// Hai nơi cùng giữ một nội dung thì kiểu gì cũng có ngày lệch. Cách chặn: BẢN
// TRONG DATABASE LÀ BẢN DẪN XUẤT, sinh ra từ đây, không bao giờ sửa tay. Chế độ
// `--check` chạy trong `npm run test:vet-kb` nên sửa nội dung mà quên xuất lại
// là kiểm thử đỏ ngay, chứ không âm thầm trôi hai bản.
//
// MÃ CÓ TIỀN TỐ "vet-": `AnatomySystem.code` và `Structure.code` bên backend là
// unique TOÀN CỤC (mọi service đều tra `where: { code }`), mà bên người đã dùng
// "muscular", "nervous"… rồi. Không đổi sang unique-theo-loài được nếu không
// sửa cả loạt endpoint đang chạy, nên tách bằng tiền tố. Vả lại đúng về nghĩa:
// hệ tiêu hoá của bò không phải cùng một thực thể với hệ tiêu hoá của người —
// khác thuật ngữ (NAV/NAA), khác nội dung.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SPECIES, VET_SYSTEM_LABEL, factsOfSpecies } from "@/lib/vet/knowledge";
import { VET_SPECIES } from "@/lib/vet/types";
import type { VetFact, VetSystemKey } from "@/lib/vet/types";

type Tri = { vi: string; en: string; zh: string };

type OutSpecies = { code: string; nameVi: string; nameEn: string; nameZh: string; latin: string };
type OutSystem = {
  code: string;
  speciesCode: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  order: number;
};
type OutStructure = {
  code: string;
  speciesCode: string;
  systemCode: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  /** Thuật ngữ NAV/NAA — cột `latin` bên backend. */
  latin: string;
  descriptionVi: string;
  descriptionEn: string;
  descriptionZh: string;
};

export type VetExport = {
  /** Đổi khuôn dạng thì tăng số này để bên backend biết mà báo lỗi rõ ràng. */
  format: 1;
  species: OutSpecies[];
  systems: OutSystem[];
  structures: OutStructure[];
};

const LABEL: Record<keyof Tri, { note: string; compare: string; clinical: string; source: string }> = {
  vi: { note: "Mô tả", compare: "Khác biệt", clinical: "Ý nghĩa lâm sàng", source: "Nguồn" },
  en: { note: "Description", compare: "Difference", clinical: "Clinical relevance", source: "Source" },
  zh: { note: "描述", compare: "差异", clinical: "临床意义", source: "来源" },
};

/**
 * Gộp bốn phần đã biên soạn thành một đoạn mô tả.
 *
 * Bảng `Structure` chỉ có ba cột mô tả (vi/en/zh), không có chỗ riêng cho
 * "khác biệt" và "lâm sàng". Cắt bớt thì bản trong database nghèo hơn hẳn bản
 * trên web — mà `compare` mới là phần đắt giá nhất của kho này. Nên gộp, có
 * nhãn rõ ràng, không mất chữ nào.
 */
function describe(fact: VetFact, loc: keyof Tri): string {
  const L = LABEL[loc];
  const parts = [`${L.note}: ${fact.note[loc]}`];
  if (fact.compare) parts.push(`${L.compare}: ${fact.compare[loc]}`);
  if (fact.clinical) parts.push(`${L.clinical}: ${fact.clinical[loc]}`);
  parts.push(`${L.source}: ${fact.source}`);
  return parts.join("\n\n");
}

export function buildVetExport(): VetExport {
  const species: OutSpecies[] = SPECIES.map((s) => ({
    code: s.key,
    nameVi: s.name.vi,
    nameEn: s.name.en,
    nameZh: s.name.zh,
    latin: s.latin,
  }));

  const systems: OutSystem[] = [];
  const structures: OutStructure[] = [];

  for (const key of VET_SPECIES) {
    const facts = factsOfSpecies(key);
    // Chỉ khai những hệ loài này THỰC SỰ có mục — dựng đủ mười hệ cho mọi loài
    // thì API trả về một đống hệ rỗng, gọi ra rồi không có gì bên trong.
    const used: VetSystemKey[] = [...new Set(facts.map((f) => f.system))];
    used.forEach((sys, i) => {
      const label = VET_SYSTEM_LABEL[sys];
      systems.push({
        code: `vet-${key}-${sys}`,
        speciesCode: key,
        nameVi: label.vi,
        nameEn: label.en,
        nameZh: label.zh,
        order: i,
      });
    });

    for (const fact of facts) {
      structures.push({
        // Có cả mã loài vì một mục dùng chung cho nhiều loài (mí mắt thứ ba
        // đúng cho chó, mèo, ngựa, bò, lợn) mà mỗi `Structure` chỉ thuộc về
        // MỘT loài — phải tách thành từng dòng riêng.
        code: `vet-${key}-${fact.id}`,
        speciesCode: key,
        systemCode: `vet-${key}-${fact.system}`,
        nameVi: fact.name.vi,
        nameEn: fact.name.en,
        nameZh: fact.name.zh,
        latin: fact.nav,
        descriptionVi: describe(fact, "vi"),
        descriptionEn: describe(fact, "en"),
        descriptionZh: describe(fact, "zh"),
      });
    }
  }

  return { format: 1, species, systems, structures };
}

const OUT = path.resolve(process.cwd(), "..", "soma_be", "prisma", "data", "vet.json");

function main() {
  const data = buildVetExport();
  const text = `${JSON.stringify(data, null, 2)}\n`;
  const check = process.argv.includes("--check");

  if (check) {
    let current = "";
    try {
      current = readFileSync(OUT, "utf8");
    } catch {
      console.error(`\n✗ Chưa có ${OUT}. Chạy: npm run export:vet\n`);
      process.exit(1);
    }
    // So theo NỘI DUNG chứ không so từng byte: git ở máy Windows đổi tệp đã
    // commit sang CRLF, mà bộ xuất luôn ghi LF — so byte thì lần nào cũng báo
    // lệch trong khi dữ liệu y hệt nhau, và một cảnh báo luôn sai thì chẳng mấy
    // chốc không ai thèm đọc.
    const norm = (v: string) => v.split("\r").join("").trim();
    if (norm(current) !== norm(text)) {
      console.error(
        "\n✗ vet.json đã lệch với kho tri thức trong src/lib/vet/.\n" +
          "  Nội dung vừa sửa chưa được xuất sang backend. Chạy: npm run export:vet\n",
      );
      process.exit(1);
    }
    console.log(
      `✓ vet.json khớp kho tri thức (${data.species.length} loài · ` +
        `${data.systems.length} hệ · ${data.structures.length} cấu trúc)`,
    );
    return;
  }

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, text, "utf8");
  console.log(
    `✓ Đã ghi ${OUT}\n  ${data.species.length} loài · ${data.systems.length} hệ · ` +
      `${data.structures.length} cấu trúc`,
  );
}

main();
