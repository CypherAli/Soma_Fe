import assert from "node:assert/strict";
import test from "node:test";
import { catalogScenes, scenesOfSystem, searchScenes } from "./catalog";
import { atlasSceneAliases, atlasScenes } from "./humanAtlas/scenes";
import { modelSearchScore } from "./modelSearch";

test("heart search excludes Latin substrings in limb and intercostal lessons", () => {
  for (const query of ["tim", "TIM", " Tim "]) {
    const matches = searchScenes(query);
    assert(matches.length > 0);
    assert(matches.slice(0, 3).every((scene) => scene.title.vi.toLowerCase().includes("tim")));
    for (const slug of ["co-mat", "cang-chan-ban-chan", "bo-phan-cang-chan", "bo-phan-co-chan-ban-chan", "thanh-nguc"]) {
      const scene = catalogScenes.find((item) => item.slug === slug)!;
      assert(scene, slug);
      assert.equal(modelSearchScore(scene, query, "vi"), 0, slug);
      assert(!matches.some((item) => item.slug === slug), slug);
    }
  }
});

test("model search keeps accent-free, Latin, Chinese and combined structure queries", () => {
  assert(searchScenes("gan").some((scene) => scene.slug === "giai-phau-gan"));
  assert(searchScenes("Hepar").some((scene) => scene.slug === "giai-phau-gan"));
  assert(searchScenes("心脏", "zh").some((scene) => scene.slug === "giai-phau-tim"));
  assert(searchScenes("xương búa").some((scene) => scene.slug === "he-thinh-giac"));
  assert(searchScenes("xoang vanh").some((scene) => scene.slug === "dong-mach-vanh"));
  assert.deepEqual(searchScenes("xyz-nonexistent-987"), []);
  assert.deepEqual(searchScenes(""), []);
});

test("the male reproductive model is listed once while its old URL resolves to it", () => {
  assert.deepEqual(scenesOfSystem("reproductive").map((scene) => scene.slug), ["he-sinh-san-nam"]);
  assert.equal(atlasSceneAliases["co-quan-sinh-duc-nam"], "he-sinh-san-nam");
  assert(atlasScenes[atlasSceneAliases["co-quan-sinh-duc-nam"]]);
  assert.equal(atlasScenes["co-quan-sinh-duc-nam"], undefined);
});
