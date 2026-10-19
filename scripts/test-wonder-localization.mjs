import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { CATALOG } from "../public/wonder/src/models/catalog.js";
import { readingText } from "../public/wonder/src/logic/voice-commands.js";

const names = JSON.parse(
  await fs.readFile("public/wonder/assets/anatomy-names.json", "utf8"),
).vi;
assert.equal(
  readingText(
    {
      label: "Left source nerve",
      labelVi: "Thần kinh (trái)",
      sourceName: "Left source nerve",
    },
    null,
    "vi",
    "name",
  ).text,
  "Thần kinh (trái)",
  "Speech language must remain independent from the interface label",
);
assert.equal(names.FJ1833, "Hồi trán trên (trái)");
assert.equal(names.FJ1834, "Hồi trán trên (phải)");
assert.equal(names.FJ1758, "Chất trắng bán cầu đại não (trái)");
assert.equal(names.FJ1806, "Chất trắng bán cầu đại não (phải)");
assert.equal(names.FJ1835, "Tiểu thùy đỉnh trên (trái)");
assert.equal(names.FJ1283, "Thần kinh sàng trước (trái)");
let total = 0;
for (const file of (await fs.readdir("public/wonder/assets/regions")).filter(
  (file) => file.endsWith(".json"),
)) {
  const meta = JSON.parse(
    await fs.readFile("public/wonder/assets/regions/" + file, "utf8"),
  );
  for (const group of meta.groups) {
    const part = meta.parts.find((part) => part.id === group.id);
    if (!part) continue;
    assert.ok(names[part.id], `${file}/${part.id} needs an interface label`);
    assert.ok(
      !/\b(left|right|gyrus|nerve|white matter|muscle)\b/i.test(names[part.id]),
      `${file}/${part.id} leaked an English source label`,
    );
    const label = {
      ...group,
      label: names[part.id],
      sourceName: group.sourceName || part.name,
    };
    assert.equal(
      readingText(label, null, "en", "name").text,
      group.sourceName || part.name,
      "English reading must retain the exact source name",
    );
    total++;
  }
}
for (const model of CATALOG) {
  const vi = readingText(null, model, "vi", "name").text;
  assert.ok(
    !/Human|Kidney|Lungs|Skeleton|Skull|Tooth/.test(vi),
    `Untranslated model name: ${model.id}`,
  );
}
const html = await fs.readFile("public/wonder/index.html", "utf8");
assert.ok(
  !/Giọng nói · Voice|Tên · Name|Nội dung đọc · Read|Anatomy<\/div>/.test(html),
);
console.log(
  `PASS Vietnamese labels for ${total} source structure occurrences, sided head names, all model titles and preserved English reading`,
);
