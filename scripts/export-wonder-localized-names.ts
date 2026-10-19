import fs from "node:fs/promises";
import { localizedPartName } from "../src/lib/humanAtlas/partNames";

// Individual terms named in the project's brain, cortex and ophthalmic lessons.
// Preserve the original English name and side; never copy a group description to a part.
const terms: Record<string, string> = {
  "superior frontal gyrus": "Hồi trán trên",
  "middle frontal gyrus": "Hồi trán giữa",
  "inferior frontal gyrus": "Hồi trán dưới",
  "orbital gyrus": "Hồi ổ mắt",
  "precentral gyrus": "Hồi trước trung tâm",
  "postcentral gyrus": "Hồi sau trung tâm",
  "superior parietal lobule": "Tiểu thùy đỉnh trên",
  "inferior parietal lobule": "Tiểu thùy đỉnh dưới",
  "supramarginal gyrus": "Hồi trên viền",
  "angular gyrus": "Hồi góc",
  "superior temporal gyrus": "Hồi thái dương trên",
  "middle temporal gyrus": "Hồi thái dương giữa",
  "inferior temporal gyrus": "Hồi thái dương dưới",
  "anterior part of superior temporal gyrus": "Phần trước hồi thái dương trên",
  "posterior part of superior temporal gyrus": "Phần sau hồi thái dương trên",
  "white matter of cerebral hemisphere": "Chất trắng bán cầu đại não",
  "anterior ethmoidal nerve": "Thần kinh sàng trước",
  "posterior ethmoidal nerve": "Thần kinh sàng sau",
  "infratrochlear nerve": "Thần kinh dưới ròng rọc",
  "supratrochlear nerve": "Thần kinh trên ròng rọc",
  "supra-orbital nerve": "Thần kinh trên ổ mắt",
  "nasociliary nerve": "Thần kinh mũi-mi",
  "frontal nerve": "Thần kinh trán",
  "long ciliary nerve": "Thần kinh mi dài",
  "short ciliary nerve": "Thần kinh mi ngắn",
  "ciliary ganglion": "Hạch mi",
  "trochlear nerve": "Thần kinh ròng rọc",
};
const translatedTerm = (name: string) => {
  const side = /\bleft\b/i.test(name)
    ? "trái"
    : /\bright\b/i.test(name)
      ? "phải"
      : "";
  const key = name
    .toLowerCase()
    .replace(/\b(left|right)\s+/g, "")
    .trim();
  const term = terms[key];
  return term ? term + (side ? ` (${side})` : "") : null;
};

const directory = "public/wonder/assets/regions";
const names: Record<string, string> = {};
let exact = 0;
for (const file of (await fs.readdir(directory))
  .filter((name) => name.endsWith(".json"))
  .sort()) {
  const meta = JSON.parse(await fs.readFile(`${directory}/${file}`, "utf8"));
  for (const group of meta.groups) {
    const part = meta.parts.find(
      (part: { id: string }) => part.id === group.id,
    );
    if (!part) continue;
    const sourceName = group.sourceName || part.name;
    const term = translatedTerm(sourceName);
    if (term) {
      names[part.id] = term;
      exact++;
    } else if (group.label !== sourceName && group.label !== group.info) {
      names[part.id] = group.label;
    } else {
      const name = localizedPartName(part, "vi");
      // A broad lesson group is context, not an exact individual translation.
      names[part.id] =
        name.includes(`· ${part.id}`) && !name.startsWith("Cấu trúc")
          ? `Cấu trúc thuộc ${name}`
          : name;
    }
  }
}
await fs.writeFile(
  "public/wonder/assets/anatomy-names.json",
  JSON.stringify({ schemaVersion: 1, vi: names }),
);
console.log(
  `Exported ${Object.keys(names).length} Vietnamese structure labels; ${exact} exact head/cortex term occurrences. Source English names remain unchanged.`,
);
