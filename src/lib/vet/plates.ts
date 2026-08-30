import type { T3 } from "@/lib/homeContent";
import type { VetSpeciesKey } from "./types";

/**
 * BẢN KHẮC GIẢI PHẪU TOÀN THÂN — mỗi loài một tấm.
 *
 * Vì sao là bản khắc cổ chứ không phải sơ đồ hiện đại: cần SÁU tấm cùng một
 * ngôn ngữ hình ảnh thì khối "Động vật" mới ra dáng một atlas, mà tranh giải
 * phẫu hiện đại cấp phép mở thì mỗi loài một phong cách, lại không phủ nổi cả
 * sáu. Bản khắc cuối thế kỷ 19 thì cùng một lối dựng hình: bộ xương đặt trong
 * đường viền thân, nhìn ngang, có đánh số.
 *
 * Không có MỘT bộ nào phủ đủ sáu loài — đã rà thật, đừng rà lại từ đầu:
 *   • Ellenberger, Baum & Dittrich (Anatomie der Tiere für Künstler) là bộ tốt
 *     nhất nhưng trên Wikimedia Commons chỉ có tấm toàn thân của CHÓ và BÒ
 *     (thêm dê, sư tử — để dành nếu mở rộng loài). Tập "Das Pferd" không có
 *     tấm toàn thân nào trên Commons.
 *   • Lợn phải lấy của Pander & D'Alton, mèo của The Book of the Cat, gà của
 *     A. B. Meyer, ngựa của một bản khắc 1802 do Wellcome số hoá.
 *
 * Ảnh cắt khỏi trang sách, chuyển xám, cân sáng rồi xuất PNG NỀN TRONG SUỐT
 * bằng scripts/vet/prepare-plates.py — mực thành độ đục, giấy thành trong. Nhờ
 * vậy cùng một tệp dùng được cho cả hai theme (theme tối chỉ cần đảo RGB, alpha
 * giữ nguyên) và ô ảnh không còn là một hình chữ nhật khác màu dán lên trang.
 */
export type VetPlate = {
  species: VetSpeciesKey;
  /** Tệp trong /public/plates/vet/. */
  file: string;
  /** Tên tấm, đọc lên là biết đang xem gì. */
  title: T3;
  /** Sách và tác giả gốc. */
  source: string;
  license: string;
  /** Đường dẫn tới bản gốc trên Wikimedia Commons. */
  sourceUrl: string;
  /** Ghi chú khi mẫu vật không đúng hệt loài đang xem. */
  caveat?: T3;
};

export const vetPlates: VetPlate[] = [
  {
    species: "horse",
    file: "horse.png",
    title: {
      vi: "Bộ xương ngựa, nhìn ngang",
      en: "Skeleton of the horse, lateral view",
      zh: "马骨骼，侧面观",
    },
    source: "“Anatomy of the Horse”, Plate I — Longman & Rees, London, 1802; engr. Milton",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Skeleton_of_a_horse;_outline_diagram_Wellcome_V0008070.jpg",
  },
  {
    species: "cattle",
    file: "cattle.png",
    title: {
      vi: "Bộ xương bò, nhìn ngang",
      en: "Skeleton of the ox, lateral view",
      zh: "牛骨骼，侧面观",
    },
    source: "Ellenberger, Baum & Dittrich, “Anatomie der Tiere für Künstler”, Bd. II: Das Rind, Taf. 3",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Das_Rind,_Tafel_3.jpg",
  },
  {
    species: "pig",
    file: "pig.png",
    title: {
      vi: "Bộ xương lợn, nhìn ngang",
      en: "Skeleton of the pig, lateral view",
      zh: "猪骨骼，侧面观",
    },
    source: "Pander & D’Alton, “Skelett des Schweins”",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Skeleton_of_pig_D%27Alton.jpg",
  },
  {
    species: "chicken",
    file: "chicken.png",
    title: {
      vi: "Bộ xương gà, nhìn ngang",
      en: "Skeleton of the fowl, lateral view",
      zh: "鸡骨骼，侧面观",
    },
    source: "A. B. Meyer, “Abbildungen von Vogelskeletten”, Taf. IX — Römmler & Jonas, Dresden",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Abbildungen_von_Vogel-Skeletten_(Tafel_IX)_(6981794457).jpg",
    // Nói rõ chứ không lờ đi: bản khắc ghi Gallus bankiva, tức gà rừng lông đỏ.
    caveat: {
      vi: "Mẫu vật trong bản khắc là gà rừng lông đỏ (Gallus bankiva) — chính là loài tổ tiên hoang dã mà gà nhà thuộc về; bộ xương không khác về cấu tạo.",
      en: "The specimen engraved is the red junglefowl (Gallus bankiva) — the wild form of the same species the domestic chicken belongs to; the skeleton does not differ structurally.",
      zh: "图中标本为红原鸡（Gallus bankiva）——家鸡所属物种的野生型，骨骼构造并无差异。",
    },
  },
  {
    species: "dog",
    file: "dog.png",
    title: {
      vi: "Bộ xương chó, nhìn ngang",
      en: "Skeleton of the dog, lateral view",
      zh: "犬骨骼，侧面观",
    },
    source: "Ellenberger, Baum, Dittrich & Müller, “Anatomie des Hundes”, Taf. 3",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Dog_anatomy_lateral_skeleton_view_(full).jpg",
  },
  {
    species: "cat",
    file: "cat.png",
    title: {
      vi: "Bộ xương mèo, nhìn ngang",
      en: "Skeleton of the cat, lateral view",
      zh: "猫骨骼，侧面观",
    },
    source: "“The Book of the Cat”, Fig. VIII — R. C. Holding",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_book_of_the_cat_(Page_355,_Fig._VIII)_BHL23996663.jpg",
  },
];

export const vetPlateOf = (species: VetSpeciesKey) => vetPlates.find((p) => p.species === species);
