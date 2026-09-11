/**
 * Sinh scene "Tim: buồng, van và mạch vành" (slug tim-day-du).
 * Chạy: node scripts/atlas/gen-scene-heart-full.mjs
 *
 * Bài Z-Anatomy cũ trùng nội dung với scene mẫu giai-phau-tim. Thay vì viết
 * lại, lấy NGUYÊN các nhóm đã duyệt của heart.ts (sinh bởi gen-scene-heart)
 * rồi thay nhóm động mạch vành gộp bằng các nhánh chi tiết của
 * gen-scene-coronary — để bài "đầy đủ" thật sự chi tiết hơn bài mẫu.
 * Chạy SAU gen-scene-heart và gen-scene-coronary.
 */
import fs from "fs";
import { emit } from "./lib.mjs";

const root = new URL("../../", import.meta.url);
const readGroups = (file) => {
  const src = fs.readFileSync(new URL(`src/lib/humanAtlas/scenes/${file}.ts`, root), "utf8");
  const m = src.match(/groups["']?: (\[[\s\S]*\])\s*,?\s*\}\s*;?\s*$/);
  if (!m) throw new Error("khong doc duoc groups trong " + file);
  return JSON.parse(m[1]);
};

const heart = readGroups("heart").filter((g) => g.key !== "dm-vanh" && g.key !== "tm-vanh");
const coronary = readGroups("coronary").filter((g) => g.key !== "thanh-tim");
const toDef = (g) => ({ key: g.key, name: g.name, latin: g.latin, note: g.note, tint: g.tint, ids: g.parts });

emit({
  file: "heart-full",
  exportName: "heartFullScene",
  header: 'Scene "Tim: buồng, van và mạch vành" — ghép nhóm đã duyệt của scene tim mẫu\nvà scene động mạch vành.',
  scene: {
    slug: "tim-day-du",
    title: { vi: "Tim: buồng, van và mạch vành", en: "The Heart: Chambers, Valves & Coronaries", zh: "心脏：心腔、瓣膜与冠脉" },
    latin: "Cor",
    intro: {
      vi: "Bài đầy đủ: bốn buồng tim với cơ nhú, bốn van, các mạch lớn và cây mạch vành chi tiết tới từng nhánh (LAD, mũ, vành phải, liên thất sau) cùng các tĩnh mạch tim đổ về xoang vành. Buồng và mạch lớn tô theo mức oxy (xanh nghèo oxy, đỏ giàu oxy); mạch vành mỗi nhánh một màu. Bật mặt cắt để thấy van và cơ nhú bên trong.",
      en: "The complete lesson: the four chambers with their papillary muscles, the four valves, the great vessels and a detailed coronary tree down to each branch (LAD, circumflex, right coronary, posterior descending) with the cardiac veins draining to the coronary sinus. Chambers and great vessels follow oxygen level (blue poor, red rich); each coronary branch has its own colour. Turn on the cross-section to see the valves and papillary muscles inside.",
      zh: "完整课程：四个心腔及乳头肌、四个瓣膜、大血管，以及细化至各分支的冠状动脉树（前降支、旋支、右冠状动脉、后降支）和汇入冠状窦的心静脉。心腔和大血管按含氧量着色（蓝为低氧，红为富氧）；每条冠脉分支各一色。开启切面可见内部的瓣膜和乳头肌。",
    },
  },
  groups: heart.map(toDef).concat(coronary.map(toDef)),
  frame: heart.map((g) => g.key),
});
