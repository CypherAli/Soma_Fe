// TỆP SINH TỰ ĐỘNG — đừng sửa tay.
// Nguồn: scripts/vet/pig-bones.json, sinh bằng `node scripts/vet/build-pig-bones.mjs`.
// Tên vật liệu trong pig-skeleton.glb / pig-skull.glb do CHÍNH tệp đó đặt, nên
// hai bên không thể lệch nhau.
import type { VetModelPart } from "./types";

export type PigBoneGroup = "head" | "spine" | "thorax" | "forelimb" | "hindlimb";

/** Năm mục để trang xem khỏi đổ 120 xương thành một danh sách cuộn dài dằng dặc. */
export const PIG_PART_GROUPS: { key: PigBoneGroup; title: { vi: string; en: string; zh: string } }[] = [
  {
    "key": "head",
    "title": {
      "vi": "Đầu",
      "en": "Head",
      "zh": "头部"
    }
  },
  {
    "key": "spine",
    "title": {
      "vi": "Cột sống",
      "en": "Vertebral column",
      "zh": "脊柱"
    }
  },
  {
    "key": "thorax",
    "title": {
      "vi": "Lồng ngực",
      "en": "Thorax",
      "zh": "胸廓"
    }
  },
  {
    "key": "forelimb",
    "title": {
      "vi": "Chi trước",
      "en": "Forelimb",
      "zh": "前肢"
    }
  },
  {
    "key": "hindlimb",
    "title": {
      "vi": "Chi sau",
      "en": "Hindlimb",
      "zh": "后肢"
    }
  }
];

/** Nhóm giải phẫu của từng xương — để trang xem xếp 120 xương thành năm mục. */
export const PIG_BONE_GROUP_OF: Record<string, PigBoneGroup> = {
  "cranium": "head",
  "mandibula": "head",
  "os-hyoideum": "head",
  "atlas": "spine",
  "axis": "spine",
  "vertebra-c3": "spine",
  "vertebra-c4": "spine",
  "vertebra-c5": "spine",
  "vertebra-c6": "spine",
  "vertebra-c7": "spine",
  "vertebra-t1": "spine",
  "vertebra-t2": "spine",
  "vertebra-t3": "spine",
  "vertebra-t4": "spine",
  "vertebra-t5": "spine",
  "vertebra-t6": "spine",
  "vertebra-t7": "spine",
  "vertebra-t8": "spine",
  "vertebra-t9": "spine",
  "vertebra-t10": "spine",
  "vertebra-t11": "spine",
  "vertebra-t12": "spine",
  "vertebra-t13": "spine",
  "vertebra-l1": "spine",
  "vertebra-l2": "spine",
  "vertebra-l3": "spine",
  "vertebra-l4": "spine",
  "vertebra-l5": "spine",
  "vertebra-l6": "spine",
  "vertebra-l7": "spine",
  "vertebra-l8": "spine",
  "os-sacrum": "spine",
  "vertebra-cd1": "spine",
  "vertebra-cd2": "spine",
  "vertebra-cd3": "spine",
  "vertebra-cd4": "spine",
  "vertebra-cd5": "spine",
  "vertebra-cd6": "spine",
  "vertebra-cd7": "spine",
  "vertebra-cd8": "spine",
  "vertebra-cd9": "spine",
  "vertebra-cd10": "spine",
  "vertebra-cd11": "spine",
  "vertebra-cd12": "spine",
  "costa-1": "thorax",
  "costa-2": "thorax",
  "costa-3": "thorax",
  "costa-4": "thorax",
  "costa-5": "thorax",
  "costa-6": "thorax",
  "costa-7": "thorax",
  "costa-8": "thorax",
  "costa-9": "thorax",
  "costa-10": "thorax",
  "costa-11": "thorax",
  "costa-12": "thorax",
  "costa-13": "thorax",
  "costa-14": "thorax",
  "costa-15": "thorax",
  "cartilagines-costales": "thorax",
  "manubrium-sterni": "thorax",
  "sternebra-2": "thorax",
  "sternebra-3": "thorax",
  "sternebra-4": "thorax",
  "sternebra-5": "thorax",
  "sternebra-6": "thorax",
  "scapula": "forelimb",
  "humerus": "forelimb",
  "radius": "forelimb",
  "ulna": "forelimb",
  "os-carpi-radiale": "forelimb",
  "os-carpi-intermedium": "forelimb",
  "os-carpi-ulnare": "forelimb",
  "os-carpi-accessorium": "forelimb",
  "os-carpale-3": "forelimb",
  "os-carpale-4": "forelimb",
  "os-metacarpale-2": "forelimb",
  "os-metacarpale-3": "forelimb",
  "os-metacarpale-4": "forelimb",
  "os-metacarpale-5": "forelimb",
  "ossa-sesamoidea-manus": "forelimb",
  "os-coxae": "hindlimb",
  "os-femoris": "hindlimb",
  "tibia": "hindlimb",
  "fibula": "hindlimb",
  "calcaneus": "hindlimb",
  "talus": "hindlimb",
  "os-tarsi-centrale": "hindlimb",
  "os-tarsale-1": "hindlimb",
  "os-tarsale-2": "hindlimb",
  "os-tarsale-3": "hindlimb",
  "os-tarsale-4": "hindlimb",
  "os-metatarsale-2": "hindlimb",
  "os-metatarsale-3": "hindlimb",
  "os-metatarsale-4": "hindlimb",
  "os-metatarsale-5": "hindlimb",
  "phalanx-proximalis-manus-2": "forelimb",
  "phalanx-proximalis-pedis-2": "hindlimb",
  "phalanx-proximalis-manus-3": "forelimb",
  "phalanx-proximalis-pedis-3": "hindlimb",
  "phalanx-proximalis-manus-4": "forelimb",
  "phalanx-proximalis-pedis-4": "hindlimb",
  "phalanx-proximalis-manus-5": "forelimb",
  "phalanx-proximalis-pedis-5": "hindlimb",
  "phalanx-media-manus-2": "forelimb",
  "phalanx-media-pedis-2": "hindlimb",
  "phalanx-media-manus-3": "forelimb",
  "phalanx-media-pedis-3": "hindlimb",
  "phalanx-media-manus-4": "forelimb",
  "phalanx-media-pedis-4": "hindlimb",
  "phalanx-media-manus-5": "forelimb",
  "phalanx-media-pedis-5": "hindlimb",
  "phalanx-distalis-manus-2": "forelimb",
  "phalanx-distalis-pedis-2": "hindlimb",
  "phalanx-distalis-manus-3": "forelimb",
  "phalanx-distalis-pedis-3": "hindlimb",
  "phalanx-distalis-manus-4": "forelimb",
  "phalanx-distalis-pedis-4": "hindlimb",
  "phalanx-distalis-manus-5": "forelimb",
  "phalanx-distalis-pedis-5": "hindlimb"
};

export const PIG_BONES: VetModelPart[] = [
  {
    "material": "cranium",
    "name": {
      "vi": "Sọ",
      "en": "Skull",
      "zh": "颅骨"
    },
    "nav": "Cranium",
    "group": "head"
  },
  {
    "material": "mandibula",
    "name": {
      "vi": "Xương hàm dưới",
      "en": "Mandible",
      "zh": "下颌骨"
    },
    "nav": "Mandibula",
    "group": "head"
  },
  {
    "material": "os-hyoideum",
    "name": {
      "vi": "Xương móng",
      "en": "Hyoid bone",
      "zh": "舌骨"
    },
    "nav": "Os hyoideum",
    "group": "head"
  },
  {
    "material": "atlas",
    "name": {
      "vi": "Đốt đội (C1)",
      "en": "Atlas (C1)",
      "zh": "寰椎"
    },
    "nav": "Atlas [Vertebra cervicalis I]",
    "group": "spine"
  },
  {
    "material": "axis",
    "name": {
      "vi": "Đốt trục (C2)",
      "en": "Axis (C2)",
      "zh": "枢椎"
    },
    "nav": "Axis [Vertebra cervicalis II]",
    "group": "spine"
  },
  {
    "material": "vertebra-c3",
    "name": {
      "vi": "Đốt sống cổ C3",
      "en": "Cervical vertebra C3",
      "zh": "颈椎 C3"
    },
    "nav": "Vertebra cervicalis III",
    "group": "spine"
  },
  {
    "material": "vertebra-c4",
    "name": {
      "vi": "Đốt sống cổ C4",
      "en": "Cervical vertebra C4",
      "zh": "颈椎 C4"
    },
    "nav": "Vertebra cervicalis IV",
    "group": "spine"
  },
  {
    "material": "vertebra-c5",
    "name": {
      "vi": "Đốt sống cổ C5",
      "en": "Cervical vertebra C5",
      "zh": "颈椎 C5"
    },
    "nav": "Vertebra cervicalis V",
    "group": "spine"
  },
  {
    "material": "vertebra-c6",
    "name": {
      "vi": "Đốt sống cổ C6",
      "en": "Cervical vertebra C6",
      "zh": "颈椎 C6"
    },
    "nav": "Vertebra cervicalis VI",
    "group": "spine"
  },
  {
    "material": "vertebra-c7",
    "name": {
      "vi": "Đốt sống cổ C7",
      "en": "Cervical vertebra C7",
      "zh": "颈椎 C7"
    },
    "nav": "Vertebra cervicalis VII",
    "group": "spine"
  },
  {
    "material": "vertebra-t1",
    "name": {
      "vi": "Đốt sống ngực T1",
      "en": "Thoracic vertebra T1",
      "zh": "胸椎 T1"
    },
    "nav": "Vertebra thoracica I",
    "group": "spine"
  },
  {
    "material": "vertebra-t2",
    "name": {
      "vi": "Đốt sống ngực T2",
      "en": "Thoracic vertebra T2",
      "zh": "胸椎 T2"
    },
    "nav": "Vertebra thoracica II",
    "group": "spine"
  },
  {
    "material": "vertebra-t3",
    "name": {
      "vi": "Đốt sống ngực T3",
      "en": "Thoracic vertebra T3",
      "zh": "胸椎 T3"
    },
    "nav": "Vertebra thoracica III",
    "group": "spine"
  },
  {
    "material": "vertebra-t4",
    "name": {
      "vi": "Đốt sống ngực T4",
      "en": "Thoracic vertebra T4",
      "zh": "胸椎 T4"
    },
    "nav": "Vertebra thoracica IV",
    "group": "spine"
  },
  {
    "material": "vertebra-t5",
    "name": {
      "vi": "Đốt sống ngực T5",
      "en": "Thoracic vertebra T5",
      "zh": "胸椎 T5"
    },
    "nav": "Vertebra thoracica V",
    "group": "spine"
  },
  {
    "material": "vertebra-t6",
    "name": {
      "vi": "Đốt sống ngực T6",
      "en": "Thoracic vertebra T6",
      "zh": "胸椎 T6"
    },
    "nav": "Vertebra thoracica VI",
    "group": "spine"
  },
  {
    "material": "vertebra-t7",
    "name": {
      "vi": "Đốt sống ngực T7",
      "en": "Thoracic vertebra T7",
      "zh": "胸椎 T7"
    },
    "nav": "Vertebra thoracica VII",
    "group": "spine"
  },
  {
    "material": "vertebra-t8",
    "name": {
      "vi": "Đốt sống ngực T8",
      "en": "Thoracic vertebra T8",
      "zh": "胸椎 T8"
    },
    "nav": "Vertebra thoracica VIII",
    "group": "spine"
  },
  {
    "material": "vertebra-t9",
    "name": {
      "vi": "Đốt sống ngực T9",
      "en": "Thoracic vertebra T9",
      "zh": "胸椎 T9"
    },
    "nav": "Vertebra thoracica IX",
    "group": "spine"
  },
  {
    "material": "vertebra-t10",
    "name": {
      "vi": "Đốt sống ngực T10",
      "en": "Thoracic vertebra T10",
      "zh": "胸椎 T10"
    },
    "nav": "Vertebra thoracica X",
    "group": "spine"
  },
  {
    "material": "vertebra-t11",
    "name": {
      "vi": "Đốt sống ngực T11",
      "en": "Thoracic vertebra T11",
      "zh": "胸椎 T11"
    },
    "nav": "Vertebra thoracica XI",
    "group": "spine"
  },
  {
    "material": "vertebra-t12",
    "name": {
      "vi": "Đốt sống ngực T12",
      "en": "Thoracic vertebra T12",
      "zh": "胸椎 T12"
    },
    "nav": "Vertebra thoracica XII",
    "group": "spine"
  },
  {
    "material": "vertebra-t13",
    "name": {
      "vi": "Đốt sống ngực T13",
      "en": "Thoracic vertebra T13",
      "zh": "胸椎 T13"
    },
    "nav": "Vertebra thoracica XIII",
    "group": "spine"
  },
  {
    "material": "vertebra-l1",
    "name": {
      "vi": "Đốt sống thắt lưng L1",
      "en": "Lumbar vertebra L1",
      "zh": "腰椎 L1"
    },
    "nav": "Vertebra lumbalis I",
    "group": "spine"
  },
  {
    "material": "vertebra-l2",
    "name": {
      "vi": "Đốt sống thắt lưng L2",
      "en": "Lumbar vertebra L2",
      "zh": "腰椎 L2"
    },
    "nav": "Vertebra lumbalis II",
    "group": "spine"
  },
  {
    "material": "vertebra-l3",
    "name": {
      "vi": "Đốt sống thắt lưng L3",
      "en": "Lumbar vertebra L3",
      "zh": "腰椎 L3"
    },
    "nav": "Vertebra lumbalis III",
    "group": "spine"
  },
  {
    "material": "vertebra-l4",
    "name": {
      "vi": "Đốt sống thắt lưng L4",
      "en": "Lumbar vertebra L4",
      "zh": "腰椎 L4"
    },
    "nav": "Vertebra lumbalis IV",
    "group": "spine"
  },
  {
    "material": "vertebra-l5",
    "name": {
      "vi": "Đốt sống thắt lưng L5",
      "en": "Lumbar vertebra L5",
      "zh": "腰椎 L5"
    },
    "nav": "Vertebra lumbalis V",
    "group": "spine"
  },
  {
    "material": "vertebra-l6",
    "name": {
      "vi": "Đốt sống thắt lưng L6",
      "en": "Lumbar vertebra L6",
      "zh": "腰椎 L6"
    },
    "nav": "Vertebra lumbalis VI",
    "group": "spine"
  },
  {
    "material": "vertebra-l7",
    "name": {
      "vi": "Đốt sống thắt lưng L7",
      "en": "Lumbar vertebra L7",
      "zh": "腰椎 L7"
    },
    "nav": "Vertebra lumbalis VII",
    "group": "spine"
  },
  {
    "material": "vertebra-l8",
    "name": {
      "vi": "Đốt sống thắt lưng L8",
      "en": "Lumbar vertebra L8",
      "zh": "腰椎 L8"
    },
    "nav": "Vertebra lumbalis VIII",
    "group": "spine"
  },
  {
    "material": "os-sacrum",
    "name": {
      "vi": "Xương cùng",
      "en": "Sacrum",
      "zh": "荐骨"
    },
    "nav": "Os sacrum",
    "group": "spine"
  },
  {
    "material": "vertebra-cd1",
    "name": {
      "vi": "Đốt sống đuôi Cd1",
      "en": "Caudal vertebra Cd1",
      "zh": "尾椎 Cd1"
    },
    "nav": "Vertebra caudalis I",
    "group": "spine"
  },
  {
    "material": "vertebra-cd2",
    "name": {
      "vi": "Đốt sống đuôi Cd2",
      "en": "Caudal vertebra Cd2",
      "zh": "尾椎 Cd2"
    },
    "nav": "Vertebra caudalis II",
    "group": "spine"
  },
  {
    "material": "vertebra-cd3",
    "name": {
      "vi": "Đốt sống đuôi Cd3",
      "en": "Caudal vertebra Cd3",
      "zh": "尾椎 Cd3"
    },
    "nav": "Vertebra caudalis III",
    "group": "spine"
  },
  {
    "material": "vertebra-cd4",
    "name": {
      "vi": "Đốt sống đuôi Cd4",
      "en": "Caudal vertebra Cd4",
      "zh": "尾椎 Cd4"
    },
    "nav": "Vertebra caudalis IV",
    "group": "spine"
  },
  {
    "material": "vertebra-cd5",
    "name": {
      "vi": "Đốt sống đuôi Cd5",
      "en": "Caudal vertebra Cd5",
      "zh": "尾椎 Cd5"
    },
    "nav": "Vertebra caudalis V",
    "group": "spine"
  },
  {
    "material": "vertebra-cd6",
    "name": {
      "vi": "Đốt sống đuôi Cd6",
      "en": "Caudal vertebra Cd6",
      "zh": "尾椎 Cd6"
    },
    "nav": "Vertebra caudalis VI",
    "group": "spine"
  },
  {
    "material": "vertebra-cd7",
    "name": {
      "vi": "Đốt sống đuôi Cd7",
      "en": "Caudal vertebra Cd7",
      "zh": "尾椎 Cd7"
    },
    "nav": "Vertebra caudalis VII",
    "group": "spine"
  },
  {
    "material": "vertebra-cd8",
    "name": {
      "vi": "Đốt sống đuôi Cd8",
      "en": "Caudal vertebra Cd8",
      "zh": "尾椎 Cd8"
    },
    "nav": "Vertebra caudalis VIII",
    "group": "spine"
  },
  {
    "material": "vertebra-cd9",
    "name": {
      "vi": "Đốt sống đuôi Cd9",
      "en": "Caudal vertebra Cd9",
      "zh": "尾椎 Cd9"
    },
    "nav": "Vertebra caudalis IX",
    "group": "spine"
  },
  {
    "material": "vertebra-cd10",
    "name": {
      "vi": "Đốt sống đuôi Cd10",
      "en": "Caudal vertebra Cd10",
      "zh": "尾椎 Cd10"
    },
    "nav": "Vertebra caudalis X",
    "group": "spine"
  },
  {
    "material": "vertebra-cd11",
    "name": {
      "vi": "Đốt sống đuôi Cd11",
      "en": "Caudal vertebra Cd11",
      "zh": "尾椎 Cd11"
    },
    "nav": "Vertebra caudalis XI",
    "group": "spine"
  },
  {
    "material": "vertebra-cd12",
    "name": {
      "vi": "Đốt sống đuôi Cd12",
      "en": "Caudal vertebra Cd12",
      "zh": "尾椎 Cd12"
    },
    "nav": "Vertebra caudalis XII",
    "group": "spine"
  },
  {
    "material": "costa-1",
    "name": {
      "vi": "Xương sườn 1",
      "en": "Rib 1",
      "zh": "第1肋骨"
    },
    "nav": "Costa I",
    "group": "thorax"
  },
  {
    "material": "costa-2",
    "name": {
      "vi": "Xương sườn 2",
      "en": "Rib 2",
      "zh": "第2肋骨"
    },
    "nav": "Costa II",
    "group": "thorax"
  },
  {
    "material": "costa-3",
    "name": {
      "vi": "Xương sườn 3",
      "en": "Rib 3",
      "zh": "第3肋骨"
    },
    "nav": "Costa III",
    "group": "thorax"
  },
  {
    "material": "costa-4",
    "name": {
      "vi": "Xương sườn 4",
      "en": "Rib 4",
      "zh": "第4肋骨"
    },
    "nav": "Costa IV",
    "group": "thorax"
  },
  {
    "material": "costa-5",
    "name": {
      "vi": "Xương sườn 5",
      "en": "Rib 5",
      "zh": "第5肋骨"
    },
    "nav": "Costa V",
    "group": "thorax"
  },
  {
    "material": "costa-6",
    "name": {
      "vi": "Xương sườn 6",
      "en": "Rib 6",
      "zh": "第6肋骨"
    },
    "nav": "Costa VI",
    "group": "thorax"
  },
  {
    "material": "costa-7",
    "name": {
      "vi": "Xương sườn 7",
      "en": "Rib 7",
      "zh": "第7肋骨"
    },
    "nav": "Costa VII",
    "group": "thorax"
  },
  {
    "material": "costa-8",
    "name": {
      "vi": "Xương sườn 8",
      "en": "Rib 8",
      "zh": "第8肋骨"
    },
    "nav": "Costa VIII",
    "group": "thorax"
  },
  {
    "material": "costa-9",
    "name": {
      "vi": "Xương sườn 9",
      "en": "Rib 9",
      "zh": "第9肋骨"
    },
    "nav": "Costa IX",
    "group": "thorax"
  },
  {
    "material": "costa-10",
    "name": {
      "vi": "Xương sườn 10",
      "en": "Rib 10",
      "zh": "第10肋骨"
    },
    "nav": "Costa X",
    "group": "thorax"
  },
  {
    "material": "costa-11",
    "name": {
      "vi": "Xương sườn 11",
      "en": "Rib 11",
      "zh": "第11肋骨"
    },
    "nav": "Costa XI",
    "group": "thorax"
  },
  {
    "material": "costa-12",
    "name": {
      "vi": "Xương sườn 12",
      "en": "Rib 12",
      "zh": "第12肋骨"
    },
    "nav": "Costa XII",
    "group": "thorax"
  },
  {
    "material": "costa-13",
    "name": {
      "vi": "Xương sườn 13",
      "en": "Rib 13",
      "zh": "第13肋骨"
    },
    "nav": "Costa XIII",
    "group": "thorax"
  },
  {
    "material": "costa-14",
    "name": {
      "vi": "Xương sườn 14",
      "en": "Rib 14",
      "zh": "第14肋骨"
    },
    "nav": "Costa XIV",
    "group": "thorax"
  },
  {
    "material": "costa-15",
    "name": {
      "vi": "Xương sườn 15",
      "en": "Rib 15",
      "zh": "第15肋骨"
    },
    "nav": "Costa XV",
    "group": "thorax"
  },
  {
    "material": "cartilagines-costales",
    "name": {
      "vi": "Sụn sườn",
      "en": "Costal cartilages",
      "zh": "肋软骨"
    },
    "nav": "Cartilagines costales",
    "group": "thorax"
  },
  {
    "material": "manubrium-sterni",
    "name": {
      "vi": "Cán ức",
      "en": "Manubrium of sternum",
      "zh": "胸骨柄"
    },
    "nav": "Manubrium sterni",
    "group": "thorax"
  },
  {
    "material": "sternebra-2",
    "name": {
      "vi": "Đốt ức 2",
      "en": "Sternebra 2",
      "zh": "第2胸骨节"
    },
    "nav": "Sternebra II",
    "group": "thorax"
  },
  {
    "material": "sternebra-3",
    "name": {
      "vi": "Đốt ức 3",
      "en": "Sternebra 3",
      "zh": "第3胸骨节"
    },
    "nav": "Sternebra III",
    "group": "thorax"
  },
  {
    "material": "sternebra-4",
    "name": {
      "vi": "Đốt ức 4",
      "en": "Sternebra 4",
      "zh": "第4胸骨节"
    },
    "nav": "Sternebra IV",
    "group": "thorax"
  },
  {
    "material": "sternebra-5",
    "name": {
      "vi": "Đốt ức 5",
      "en": "Sternebra 5",
      "zh": "第5胸骨节"
    },
    "nav": "Sternebra V",
    "group": "thorax"
  },
  {
    "material": "sternebra-6",
    "name": {
      "vi": "Đốt ức 6",
      "en": "Sternebra 6",
      "zh": "第6胸骨节"
    },
    "nav": "Sternebra VI",
    "group": "thorax"
  },
  {
    "material": "scapula",
    "name": {
      "vi": "Xương bả vai",
      "en": "Scapula",
      "zh": "肩胛骨"
    },
    "nav": "Scapula",
    "group": "forelimb"
  },
  {
    "material": "humerus",
    "name": {
      "vi": "Xương cánh tay",
      "en": "Humerus",
      "zh": "肱骨"
    },
    "nav": "Humerus",
    "group": "forelimb"
  },
  {
    "material": "radius",
    "name": {
      "vi": "Xương quay",
      "en": "Radius",
      "zh": "桡骨"
    },
    "nav": "Radius",
    "group": "forelimb"
  },
  {
    "material": "ulna",
    "name": {
      "vi": "Xương trụ",
      "en": "Ulna",
      "zh": "尺骨"
    },
    "nav": "Ulna",
    "group": "forelimb"
  },
  {
    "material": "os-carpi-radiale",
    "name": {
      "vi": "Xương cổ tay quay",
      "en": "Radial carpal bone",
      "zh": "桡腕骨"
    },
    "nav": "Os carpi radiale",
    "group": "forelimb"
  },
  {
    "material": "os-carpi-intermedium",
    "name": {
      "vi": "Xương cổ tay giữa",
      "en": "Intermediate carpal bone",
      "zh": "中间腕骨"
    },
    "nav": "Os carpi intermedium",
    "group": "forelimb"
  },
  {
    "material": "os-carpi-ulnare",
    "name": {
      "vi": "Xương cổ tay trụ",
      "en": "Ulnar carpal bone",
      "zh": "尺腕骨"
    },
    "nav": "Os carpi ulnare",
    "group": "forelimb"
  },
  {
    "material": "os-carpi-accessorium",
    "name": {
      "vi": "Xương cổ tay phụ",
      "en": "Accessory carpal bone",
      "zh": "副腕骨"
    },
    "nav": "Os carpi accessorium",
    "group": "forelimb"
  },
  {
    "material": "os-carpale-3",
    "name": {
      "vi": "Xương cổ tay III",
      "en": "Third carpal bone",
      "zh": "第三腕骨"
    },
    "nav": "Os carpale III",
    "group": "forelimb"
  },
  {
    "material": "os-carpale-4",
    "name": {
      "vi": "Xương cổ tay IV",
      "en": "Fourth carpal bone",
      "zh": "第四腕骨"
    },
    "nav": "Os carpale IV",
    "group": "forelimb"
  },
  {
    "material": "os-metacarpale-2",
    "name": {
      "vi": "Xương bàn trước II",
      "en": "Metacarpal II",
      "zh": "第2掌骨"
    },
    "nav": "Os metacarpale II",
    "group": "forelimb"
  },
  {
    "material": "os-metacarpale-3",
    "name": {
      "vi": "Xương bàn trước III",
      "en": "Metacarpal III",
      "zh": "第3掌骨"
    },
    "nav": "Os metacarpale III",
    "group": "forelimb"
  },
  {
    "material": "os-metacarpale-4",
    "name": {
      "vi": "Xương bàn trước IV",
      "en": "Metacarpal IV",
      "zh": "第4掌骨"
    },
    "nav": "Os metacarpale IV",
    "group": "forelimb"
  },
  {
    "material": "os-metacarpale-5",
    "name": {
      "vi": "Xương bàn trước V",
      "en": "Metacarpal V",
      "zh": "第5掌骨"
    },
    "nav": "Os metacarpale V",
    "group": "forelimb"
  },
  {
    "material": "ossa-sesamoidea-manus",
    "name": {
      "vi": "Xương vừng gần, chi trước",
      "en": "Proximal sesamoid bones, forelimb",
      "zh": "前肢近籽骨"
    },
    "nav": "Ossa sesamoidea proximalia (manus)",
    "group": "forelimb"
  },
  {
    "material": "os-coxae",
    "name": {
      "vi": "Xương chậu",
      "en": "Hip bone",
      "zh": "髋骨"
    },
    "nav": "Os coxae",
    "group": "hindlimb"
  },
  {
    "material": "os-femoris",
    "name": {
      "vi": "Xương đùi",
      "en": "Femur",
      "zh": "股骨"
    },
    "nav": "Os femoris",
    "group": "hindlimb"
  },
  {
    "material": "tibia",
    "name": {
      "vi": "Xương chày",
      "en": "Tibia",
      "zh": "胫骨"
    },
    "nav": "Tibia",
    "group": "hindlimb"
  },
  {
    "material": "fibula",
    "name": {
      "vi": "Xương mác",
      "en": "Fibula",
      "zh": "腓骨"
    },
    "nav": "Fibula",
    "group": "hindlimb"
  },
  {
    "material": "calcaneus",
    "name": {
      "vi": "Xương gót",
      "en": "Calcaneus",
      "zh": "跟骨"
    },
    "nav": "Calcaneus",
    "group": "hindlimb"
  },
  {
    "material": "talus",
    "name": {
      "vi": "Xương sên",
      "en": "Talus",
      "zh": "距骨"
    },
    "nav": "Talus",
    "group": "hindlimb"
  },
  {
    "material": "os-tarsi-centrale",
    "name": {
      "vi": "Xương cổ chân giữa",
      "en": "Central tarsal bone",
      "zh": "中央跗骨"
    },
    "nav": "Os tarsi centrale",
    "group": "hindlimb"
  },
  {
    "material": "os-tarsale-1",
    "name": {
      "vi": "Xương cổ chân I",
      "en": "Tarsal bone I",
      "zh": "第1跗骨"
    },
    "nav": "Os tarsale I",
    "group": "hindlimb"
  },
  {
    "material": "os-tarsale-2",
    "name": {
      "vi": "Xương cổ chân II",
      "en": "Tarsal bone II",
      "zh": "第2跗骨"
    },
    "nav": "Os tarsale II",
    "group": "hindlimb"
  },
  {
    "material": "os-tarsale-3",
    "name": {
      "vi": "Xương cổ chân III",
      "en": "Tarsal bone III",
      "zh": "第3跗骨"
    },
    "nav": "Os tarsale III",
    "group": "hindlimb"
  },
  {
    "material": "os-tarsale-4",
    "name": {
      "vi": "Xương cổ chân IV",
      "en": "Tarsal bone IV",
      "zh": "第4跗骨"
    },
    "nav": "Os tarsale IV",
    "group": "hindlimb"
  },
  {
    "material": "os-metatarsale-2",
    "name": {
      "vi": "Xương bàn sau II",
      "en": "Metatarsal II",
      "zh": "第2跖骨"
    },
    "nav": "Os metatarsale II",
    "group": "hindlimb"
  },
  {
    "material": "os-metatarsale-3",
    "name": {
      "vi": "Xương bàn sau III",
      "en": "Metatarsal III",
      "zh": "第3跖骨"
    },
    "nav": "Os metatarsale III",
    "group": "hindlimb"
  },
  {
    "material": "os-metatarsale-4",
    "name": {
      "vi": "Xương bàn sau IV",
      "en": "Metatarsal IV",
      "zh": "第4跖骨"
    },
    "nav": "Os metatarsale IV",
    "group": "hindlimb"
  },
  {
    "material": "os-metatarsale-5",
    "name": {
      "vi": "Xương bàn sau V",
      "en": "Metatarsal V",
      "zh": "第5跖骨"
    },
    "nav": "Os metatarsale V",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-proximalis-manus-2",
    "name": {
      "vi": "Đốt ngón gần, ngón II chi trước",
      "en": "Proximal phalanx, digit II forelimb",
      "zh": "前肢第2指近节"
    },
    "nav": "Phalanx proximalis digiti II manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-proximalis-pedis-2",
    "name": {
      "vi": "Đốt ngón gần, ngón II chi sau",
      "en": "Proximal phalanx, digit II hindlimb",
      "zh": "后肢第2趾近节"
    },
    "nav": "Phalanx proximalis digiti II pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-proximalis-manus-3",
    "name": {
      "vi": "Đốt ngón gần, ngón III chi trước",
      "en": "Proximal phalanx, digit III forelimb",
      "zh": "前肢第3指近节"
    },
    "nav": "Phalanx proximalis digiti III manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-proximalis-pedis-3",
    "name": {
      "vi": "Đốt ngón gần, ngón III chi sau",
      "en": "Proximal phalanx, digit III hindlimb",
      "zh": "后肢第3趾近节"
    },
    "nav": "Phalanx proximalis digiti III pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-proximalis-manus-4",
    "name": {
      "vi": "Đốt ngón gần, ngón IV chi trước",
      "en": "Proximal phalanx, digit IV forelimb",
      "zh": "前肢第4指近节"
    },
    "nav": "Phalanx proximalis digiti IV manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-proximalis-pedis-4",
    "name": {
      "vi": "Đốt ngón gần, ngón IV chi sau",
      "en": "Proximal phalanx, digit IV hindlimb",
      "zh": "后肢第4趾近节"
    },
    "nav": "Phalanx proximalis digiti IV pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-proximalis-manus-5",
    "name": {
      "vi": "Đốt ngón gần, ngón V chi trước",
      "en": "Proximal phalanx, digit V forelimb",
      "zh": "前肢第5指近节"
    },
    "nav": "Phalanx proximalis digiti V manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-proximalis-pedis-5",
    "name": {
      "vi": "Đốt ngón gần, ngón V chi sau",
      "en": "Proximal phalanx, digit V hindlimb",
      "zh": "后肢第5趾近节"
    },
    "nav": "Phalanx proximalis digiti V pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-media-manus-2",
    "name": {
      "vi": "Đốt ngón giữa, ngón II chi trước",
      "en": "Middle phalanx, digit II forelimb",
      "zh": "前肢第2指中节"
    },
    "nav": "Phalanx media digiti II manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-media-pedis-2",
    "name": {
      "vi": "Đốt ngón giữa, ngón II chi sau",
      "en": "Middle phalanx, digit II hindlimb",
      "zh": "后肢第2趾中节"
    },
    "nav": "Phalanx media digiti II pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-media-manus-3",
    "name": {
      "vi": "Đốt ngón giữa, ngón III chi trước",
      "en": "Middle phalanx, digit III forelimb",
      "zh": "前肢第3指中节"
    },
    "nav": "Phalanx media digiti III manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-media-pedis-3",
    "name": {
      "vi": "Đốt ngón giữa, ngón III chi sau",
      "en": "Middle phalanx, digit III hindlimb",
      "zh": "后肢第3趾中节"
    },
    "nav": "Phalanx media digiti III pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-media-manus-4",
    "name": {
      "vi": "Đốt ngón giữa, ngón IV chi trước",
      "en": "Middle phalanx, digit IV forelimb",
      "zh": "前肢第4指中节"
    },
    "nav": "Phalanx media digiti IV manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-media-pedis-4",
    "name": {
      "vi": "Đốt ngón giữa, ngón IV chi sau",
      "en": "Middle phalanx, digit IV hindlimb",
      "zh": "后肢第4趾中节"
    },
    "nav": "Phalanx media digiti IV pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-media-manus-5",
    "name": {
      "vi": "Đốt ngón giữa, ngón V chi trước",
      "en": "Middle phalanx, digit V forelimb",
      "zh": "前肢第5指中节"
    },
    "nav": "Phalanx media digiti V manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-media-pedis-5",
    "name": {
      "vi": "Đốt ngón giữa, ngón V chi sau",
      "en": "Middle phalanx, digit V hindlimb",
      "zh": "后肢第5趾中节"
    },
    "nav": "Phalanx media digiti V pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-distalis-manus-2",
    "name": {
      "vi": "Đốt ngón xa, ngón II chi trước",
      "en": "Distal phalanx, digit II forelimb",
      "zh": "前肢第2指远节"
    },
    "nav": "Phalanx distalis digiti II manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-distalis-pedis-2",
    "name": {
      "vi": "Đốt ngón xa, ngón II chi sau",
      "en": "Distal phalanx, digit II hindlimb",
      "zh": "后肢第2趾远节"
    },
    "nav": "Phalanx distalis digiti II pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-distalis-manus-3",
    "name": {
      "vi": "Đốt ngón xa, ngón III chi trước",
      "en": "Distal phalanx, digit III forelimb",
      "zh": "前肢第3指远节"
    },
    "nav": "Phalanx distalis digiti III manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-distalis-pedis-3",
    "name": {
      "vi": "Đốt ngón xa, ngón III chi sau",
      "en": "Distal phalanx, digit III hindlimb",
      "zh": "后肢第3趾远节"
    },
    "nav": "Phalanx distalis digiti III pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-distalis-manus-4",
    "name": {
      "vi": "Đốt ngón xa, ngón IV chi trước",
      "en": "Distal phalanx, digit IV forelimb",
      "zh": "前肢第4指远节"
    },
    "nav": "Phalanx distalis digiti IV manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-distalis-pedis-4",
    "name": {
      "vi": "Đốt ngón xa, ngón IV chi sau",
      "en": "Distal phalanx, digit IV hindlimb",
      "zh": "后肢第4趾远节"
    },
    "nav": "Phalanx distalis digiti IV pedis",
    "group": "hindlimb"
  },
  {
    "material": "phalanx-distalis-manus-5",
    "name": {
      "vi": "Đốt ngón xa, ngón V chi trước",
      "en": "Distal phalanx, digit V forelimb",
      "zh": "前肢第5指远节"
    },
    "nav": "Phalanx distalis digiti V manus",
    "group": "forelimb"
  },
  {
    "material": "phalanx-distalis-pedis-5",
    "name": {
      "vi": "Đốt ngón xa, ngón V chi sau",
      "en": "Distal phalanx, digit V hindlimb",
      "zh": "后肢第5趾远节"
    },
    "nav": "Phalanx distalis digiti V pedis",
    "group": "hindlimb"
  }
];
