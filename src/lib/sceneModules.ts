import type { T3 } from "./homeContent";
import type { SystemKey } from "@/store/useAnatomyStore";

export type SceneHotspot = {
  key: string;
  /**
   * Tên mesh CHÍNH XÁC trong glTF gốc (Z-Anatomy/TA2), đã verify tồn tại
   * thật bằng cách đọc JSON chunk của .glb tương ứng — không tự đoán tên.
   */
  meshName: string;
  /** Lệch label so với điểm neo (px màn hình) — chỉ để tránh đè chữ giữa các pin. */
  offset: [number, number];
  /** Tên hiển thị chuẩn giải phẫu 3 ngôn ngữ — ưu tiên hơn tên kỹ thuật meshName. */
  label?: T3;
  /** Tên Latin/TA2 chuẩn (VD "Hepar"), hiển thị kèm trong bảng thông tin. */
  latinName?: string;
  /**
   * Ghi chú giải phẫu ngắn — hiển thị NGAY trong danh sách Nhãn (không cần
   * pin nổi trên mô hình 3D nữa, đã bỏ vì hay đặt lệch vị trí thật).
   */
  note?: T3;
};

export type SceneModule = {
  slug: string;
  title: T3;
  /**
   * Mô tả gốc tự viết dựa trên kiến thức giải phẫu phổ thông (mức đốt sống
   * T12), KHÔNG sao chép nguyên văn từ bất kỳ nguồn có bản quyền nào.
   */
  description: T3;
  /** Hệ mặc định bật khi vào scene — hệ khác tắt để đúng khung hình như tham khảo. */
  visibleSystems: SystemKey[];
  /**
   * Nếu có: đường dẫn tới model ĐÃ CẮT SẴN riêng cho scene (một phần cơ thể,
   * xuất từ Blender — cắt ngang + bịt nắp). Khi có, trang scene nạp ĐÚNG file
   * này thay vì full-body 7 hệ → nhẹ máy + đúng "từng phần" như BioDigital.
   */
  modelFile?: string;
  /**
   * Chỉ liệt kê cấu trúc ĐÃ XÁC NHẬN có mesh thật trong dữ liệu đã xuất.
   * Một số nhãn có trong tham khảo gốc (Spleen, Abdominal aorta, Inferior
   * vena cava, Liver) CHƯA đưa vào vì chưa có dữ liệu 3D tương ứng — xem
   * ghi chú trong Hotspots.tsx.
   */
  hotspots: SceneHotspot[];
};

export const sceneModules: Record<string, SceneModule> = {
  "mat-cat-ngang-bung": {
    slug: "mat-cat-ngang-bung",
    title: {
      vi: "Mặt cắt ngang bụng",
      en: "Abdomen Transverse Section",
      zh: "腹部横切面",
    },
    description: {
      vi: "Mặt cắt ngang qua bụng ở mức đốt sống ngực T12 cho thấy các cơ quan tầng bụng trên nằm sát nhau. Do gan chiếm phần lớn không gian bên phải, thận phải thường thấp hơn thận trái khoảng nửa đốt sống — ở mức cắt này chỉ thận trái xuất hiện cùng dạ dày.",
      en: "A transverse section through the abdomen at the level of the 12th thoracic vertebra shows the closely packed upper abdominal organs. Because the liver occupies most of the right side, the right kidney sits roughly half a vertebra lower than the left — at this level only the left kidney appears alongside the stomach.",
      zh: "在第12胸椎水平的腹部横切面上，上腹部器官紧密排列。由于肝脏占据右侧大部分空间，右肾通常比左肾低约半个椎体——在此切面只能看到左肾与胃。",
    },
    visibleSystems: ["skeletal", "visceral"],
    modelFile: "/models/abdomen_section.glb",
    hotspots: [
      {
        key: "t12",
        meshName: "Vertebra T12",
        offset: [-150, -60],
        label: { vi: "Đốt sống ngực XII (T12)", en: "12th Thoracic Vertebra (T12)", zh: "第12胸椎 (T12)" },
        latinName: "Vertebra thoracica XII",
        note: {
          vi: "Đốt sống ngực cuối cùng, nơi xương sườn 12 (sườn cụt) gắn vào — mốc chuẩn xác định mức cắt qua tầng bụng trên. Tuỷ sống ở mức này đã kết thúc thành chóp tuỷ (conus medullaris) ở người trưởng thành, phía sau là các cơ dựng sống (erector spinae).",
          en: "The last thoracic vertebra, where the 12th (floating) rib attaches — the standard landmark for this upper-abdominal cross-section. In adults the spinal cord has already tapered into the conus medullaris near this level; the erector spinae muscles lie just posterior to the vertebral body.",
          zh: "最后一节胸椎，第12肋（浮肋）附着处——此腹上区横切面的标准解剖标志。成人此水平脊髓已终止为脊髓圆锥，椎体后方紧邻竖脊肌。",
        },
      },
      {
        key: "liver",
        meshName: "Liver",
        offset: [-160, 30],
        label: { vi: "Gan", en: "Liver", zh: "肝脏" },
        latinName: "Hepar",
        note: {
          vi: "Tuyến lớn nhất cơ thể, chiếm phần lớn không gian dưới sườn phải — chuyển hoá dưỡng chất, thải độc và tiết mật. Nhận máu từ 2 nguồn: động mạch gan (giàu oxy) và tĩnh mạch cửa (giàu dưỡng chất từ ruột) — đặc điểm tuần hoàn kép chỉ có ở gan.",
          en: "The body's largest gland, filling most of the space under the right ribs — handles metabolism, detoxification, and bile production. It has a unique dual blood supply: the hepatic artery (oxygen-rich) and the portal vein (nutrient-rich blood from the intestines).",
          zh: "人体最大的腺体，占据右肋下大部分空间——负责代谢、解毒和分泌胆汁。肝脏有独特的双重血供：肝动脉（富氧）与门静脉（富含肠道吸收的营养）。",
        },
      },
      {
        key: "stomach",
        meshName: "Stomach",
        offset: [150, -70],
        label: { vi: "Dạ dày", en: "Stomach", zh: "胃" },
        latinName: "Gaster (Ventriculus)",
        note: {
          vi: "Túi cơ hình chữ J dưới sườn trái, nối thực quản với tá tràng — co bóp và tiết acid (pH ~1.5-3.5) để tiêu hoá thức ăn. Mặt sau dạ dày áp sát tuỵ và lách, mặt trước liên quan gan trái.",
          en: "A J-shaped muscular pouch under the left ribs, connecting the esophagus to the duodenum — churns food and secretes acid (pH ~1.5-3.5) for digestion. Its posterior wall lies against the pancreas and spleen; its anterior surface relates to the left lobe of the liver.",
          zh: "位于左肋下呈J形的肌性囊袋，连接食道与十二指肠——通过蠕动和分泌胃酸（pH约1.5-3.5）消化食物。胃后壁紧贴胰腺与脾脏，前壁与肝左叶相邻。",
        },
      },
      {
        key: "spleen",
        meshName: "Spleen",
        offset: [150, 40],
        label: { vi: "Lách", en: "Spleen", zh: "脾脏" },
        latinName: "Splen (Lien)",
        note: {
          vi: "Cơ quan bạch huyết nằm sau dạ dày, dưới vòm hoành trái — lọc máu, phá huỷ hồng cầu già và tham gia miễn dịch. Được bảo vệ bởi xương sườn 9-11 nên ít khi sờ thấy khi khám bụng bình thường; dễ vỡ khi chấn thương bụng kín.",
          en: "A lymphoid organ behind the stomach, under the left side of the diaphragm — filters blood, recycles old red cells, and supports immunity. Protected by ribs 9-11, it is not normally palpable on exam but is prone to rupture in blunt abdominal trauma.",
          zh: "位于胃后方、左膈下方的淋巴器官——过滤血液、清除衰老红细胞并参与免疫功能。受第9-11肋保护，正常触诊摸不到，但腹部钝挫伤时容易破裂。",
        },
      },
      {
        key: "kidney-l",
        meshName: "Kidney.l",
        offset: [-150, 90],
        label: { vi: "Thận trái", en: "Left Kidney", zh: "左肾" },
        latinName: "Ren sinister",
        note: {
          vi: "Cơ quan lọc máu hình hạt đậu, nằm sau phúc mạc (retroperitoneal). Ở mức T12 chỉ thấy thận trái vì gan đẩy thận phải xuống thấp hơn khoảng nửa đốt sống. Mỗi ngày lọc khoảng 180 lít máu qua các đơn vị thận (nephron).",
          en: "A bean-shaped, blood-filtering organ lying behind the peritoneum (retroperitoneal). At the T12 level only the left kidney appears — the liver pushes the right kidney about half a vertebra lower. Together the kidneys filter roughly 180 liters of blood per day through their nephrons.",
          zh: "位于腹膜后的豆状滤血器官。在T12水平只能看到左肾，因为肝脏将右肾推低约半个椎体。双肾每天通过肾单位过滤约180升血液。",
        },
      },
      {
        key: "pancreas",
        meshName: "Pancreas",
        offset: [160, 100],
        label: { vi: "Tuỵ", en: "Pancreas", zh: "胰腺" },
        latinName: "Pancreas",
        note: {
          vi: "Tuyến vừa nội tiết (tiết insulin, glucagon từ đảo tuỵ) vừa ngoại tiết (tiết dịch tiêu hoá qua ống tuỵ), nằm vắt ngang phía sau dạ dày, ở vị trí retroperitoneal nên ít khi sờ thấy khi khám.",
          en: "A gland with both endocrine (insulin and glucagon from the islets) and exocrine (digestive enzymes via the pancreatic duct) roles, lying horizontally behind the stomach in a retroperitoneal position — rarely palpable on exam.",
          zh: "兼具内分泌（胰岛分泌胰岛素与胰高血糖素）与外分泌（经胰管分泌消化酶）功能的腺体，横卧于胃后方，位于腹膜后，触诊很难摸到。",
        },
      },
    ],
  },
  "giai-phau-gan": {
    slug: "giai-phau-gan",
    title: {
      vi: "Giải phẫu Gan (phân thuỳ Couinaud)",
      en: "Liver Anatomy (Couinaud Segments)",
      zh: "肝脏解剖（Couinaud分段）",
    },
    description: {
      vi: "Gan được chia thành 8 phân thuỳ chức năng độc lập theo hệ thống Couinaud, dựa trên sự phân nhánh của tĩnh mạch cửa và tĩnh mạch gan — mỗi phân thuỳ có nguồn cấp máu, dẫn lưu mật và dẫn lưu tĩnh mạch riêng, cho phép phẫu thuật viên cắt bỏ từng phần mà không ảnh hưởng các phần còn lại. Túi mật nằm trong hố giữa phân thuỳ IV và V.",
      en: "The liver is divided into 8 functionally independent segments under the Couinaud system, based on the branching pattern of the portal and hepatic veins — each segment has its own blood supply, biliary drainage, and venous outflow, allowing surgeons to resect individual segments without compromising the rest of the organ. The gallbladder sits in the fossa between segments IV and V.",
      zh: "根据Couinaud分段系统，肝脏依据门静脉与肝静脉的分支模式被划分为8个功能独立的分段——每段拥有各自的血供、胆汁引流与静脉回流，使外科医生可以单独切除某一分段而不影响其余部分。胆囊位于IV段与V段之间的胆囊窝内。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/liver_anatomy.glb",
    hotspots: [
      {
        key: "liver-1",
        meshName: "Posterior segment of liver (I)",
        offset: [-140, -40],
        label: { vi: "Phân thuỳ I (thuỳ đuôi)", en: "Segment I (Caudate Lobe)", zh: "I段（尾状叶）" },
        latinName: "Segmentum posterius hepatis (I)",
        note: {
          vi: "Thuỳ đuôi — phân thuỳ độc lập duy nhất, nhận máu từ cả nhánh gan trái và phải nhưng đổ tĩnh mạch trực tiếp vào tĩnh mạch chủ dưới (không qua 3 tĩnh mạch gan chính), nên vẫn hoạt động tốt khi 2 phân thuỳ kia bị tổn thương.",
          en: "The caudate lobe — the only segment with dual portal inflow (from both left and right branches) yet drains directly into the inferior vena cava rather than through the three main hepatic veins, letting it stay functional even when major hepatic vein outflow is compromised.",
          zh: "尾状叶——唯一同时接受肝左、右两支门静脉血供的独立分段，但直接汇入下腔静脉而非经三条主肝静脉回流，因此在其他肝静脉受损时仍能维持功能。",
        },
      },
      {
        key: "liver-2",
        meshName: "Left posterior lateral segment of liver (II)",
        offset: [-170, 20],
        label: { vi: "Phân thuỳ II", en: "Segment II", zh: "II段" },
        latinName: "Segmentum posterius laterale sinistrum hepatis (II)",
        note: {
          vi: "Phân thuỳ sau-ngoài trái, cùng phân thuỳ III tạo nên thuỳ gan trái theo giải phẫu kinh điển (ranh giới là dây chằng liềm) — nhận máu từ nhánh trái tĩnh mạch cửa, dẫn lưu qua tĩnh mạch gan trái.",
          en: "The left posterolateral segment; together with segment III it forms the classically-described anatomical left lobe (bounded by the falciform ligament) — supplied by the left portal branch and drained by the left hepatic vein.",
          zh: "左后外侧段，与III段共同构成传统解剖学意义上的肝左叶（以镰状韧带为界）——由门静脉左支供血，经肝左静脉回流。",
        },
      },
      {
        key: "liver-3",
        meshName: "Left anterior lateral segment of liver (III)",
        offset: [-170, 80],
        label: { vi: "Phân thuỳ III", en: "Segment III", zh: "III段" },
        latinName: "Segmentum anterius laterale sinistrum hepatis (III)",
        note: {
          vi: "Phân thuỳ trước-ngoài trái, nằm dưới phân thuỳ II — cùng thuộc thuỳ gan trái kinh điển, thường là vị trí lấy mảnh ghép gan cho trẻ em vì kích thước nhỏ gọn, mạch máu tương đối đơn giản.",
          en: "The left anterolateral segment, sitting below segment II — part of the classic left lobe and a common graft site for pediatric living-donor liver transplants due to its compact size and relatively simple vasculature.",
          zh: "左前外侧段，位于II段下方——属于传统肝左叶，因体积适中、血管结构相对简单，常作为儿童活体肝移植的供体部位。",
        },
      },
      {
        key: "liver-4",
        meshName: "Left medial segment of liver (IV)",
        offset: [-60, 110],
        label: { vi: "Phân thuỳ IV", en: "Segment IV", zh: "IV段" },
        latinName: "Segmentum mediale sinistrum hepatis (IV)",
        note: {
          vi: "Phân thuỳ giữa trái (thường chia IVa trên, IVb dưới), nằm giữa dây chằng liềm và hố túi mật — theo phân loại chức năng (Couinaud) thuộc nửa gan PHẢI dù nằm bên trái về giải phẫu kinh điển, vì cùng nguồn cấp máu với phân thuỳ V và VIII.",
          en: "The left medial segment (often split into IVa above, IVb below), between the falciform ligament and the gallbladder fossa — functionally (Couinaud) it belongs to the right hemiliver despite lying on the anatomical left, since it shares vascular inflow with segments V and VIII.",
          zh: "左内侧段（常分为上方IVa、下方IVb），位于镰状韧带与胆囊窝之间——按Couinaud功能分类属于肝右半，尽管解剖位置在左侧，因其与V、VIII段共享血供来源。",
        },
      },
      {
        key: "liver-5",
        meshName: "Anterior medial segment of liver (V)",
        offset: [70, 110],
        label: { vi: "Phân thuỳ V", en: "Segment V", zh: "V段" },
        latinName: "Segmentum anterius mediale dextrum hepatis (V)",
        note: {
          vi: "Phân thuỳ trước phải, áp sát hố túi mật — cùng phân thuỳ VIII tạo thành khu trước phải (right anterior section), là vùng hay bị ảnh hưởng khi viêm túi mật lan rộng do vị trí liền kề.",
          en: "The right anterior segment, abutting the gallbladder fossa — together with segment VIII it forms the right anterior section; its proximity to the gallbladder means it can be affected when cholecystitis spreads locally.",
          zh: "肝右前段，紧邻胆囊窝——与VIII段共同构成右前区；因位置紧邻胆囊，胆囊炎扩散时常波及此段。",
        },
      },
      {
        key: "liver-6",
        meshName: "Anterior lateral segment of liver (VI)",
        offset: [170, 60],
        label: { vi: "Phân thuỳ VI", en: "Segment VI", zh: "VI段" },
        latinName: "Segmentum anterius laterale dextrum hepatis (VI)",
        note: {
          vi: "Phân thuỳ ngoài phải, cùng phân thuỳ VII tạo khu sau phải (right posterior section) — nằm ở phần thấp nhất, ngoài cùng bên phải của gan, thường là phần dễ tiếp cận nhất khi siêu âm qua khoang liên sườn phải.",
          en: "The right lateral (inferior) segment; with segment VII it forms the right posterior section — the lowest, most lateral part of the liver, often the easiest to access on right intercostal ultrasound.",
          zh: "肝右外侧段，与VII段共同构成右后区——位于肝脏最低、最外侧的部位，经右肋间超声检查时通常最易探及。",
        },
      },
      {
        key: "liver-7",
        meshName: "Posterior lateral segment of liver (VII)",
        offset: [170, -20],
        label: { vi: "Phân thuỳ VII", en: "Segment VII", zh: "VII段" },
        latinName: "Segmentum posterius laterale dextrum hepatis (VII)",
        note: {
          vi: "Phân thuỳ sau phải, nằm cao nhất phía sau-trên của gan, sát vòm hoành phải — cùng phân thuỳ VI tạo khu sau phải, ít khi sờ thấy khi khám bụng vì bị lồng ngực che khuất.",
          en: "The right posterior (superior) segment, the highest and most posterior part of the liver, tucked against the right hemidiaphragm — paired with segment VI in the right posterior section, and rarely palpable on exam because the rib cage covers it.",
          zh: "肝右后段，位于肝脏最高、最靠后的部位，紧贴右膈——与VI段构成右后区，因被肋骨遮挡，体格检查时很难触及。",
        },
      },
      {
        key: "liver-8",
        meshName: "Posterior medial segment of liver (VIII)",
        offset: [40, -60],
        label: { vi: "Phân thuỳ VIII", en: "Segment VIII", zh: "VIII段" },
        latinName: "Segmentum posterius mediale dextrum hepatis (VIII)",
        note: {
          vi: "Phân thuỳ giữa phải, nằm cao phía sau-trên, sát tĩnh mạch gan giữa và phải — cùng phân thuỳ V tạo khu trước phải, là phân thuỳ có thể tích lớn nhất trong 8 phân thuỳ ở phần lớn người trưởng thành.",
          en: "The right posteromedial segment, high and posterior, adjacent to the middle and right hepatic veins — paired with segment V in the right anterior section, and typically the largest of the eight segments in most adults.",
          zh: "肝右后内侧段，位置高且靠后，邻近肝中静脉与肝右静脉——与V段构成右前区，在大多数成年人中是八个分段里体积最大的一段。",
        },
      },
      {
        key: "gallbladder",
        meshName: "Gallbladder",
        offset: [10, 150],
        label: { vi: "Túi mật", en: "Gallbladder", zh: "胆囊" },
        latinName: "Vesica biliaris",
        note: {
          vi: "Túi mật hình quả lê nằm trong hố túi mật giữa phân thuỳ IV và V — dự trữ và cô đặc mật do gan tiết ra (tới gấp 10 lần), co bóp tống mật vào tá tràng qua ống túi mật khi có mỡ trong bữa ăn.",
          en: "A pear-shaped sac lying in the gallbladder fossa between segments IV and V — it stores and concentrates bile produced by the liver (up to 10-fold) and contracts to release it into the duodenum via the cystic duct when a fatty meal is detected.",
          zh: "梨形囊袋，位于IV段与V段之间的胆囊窝——储存并浓缩肝脏分泌的胆汁（可浓缩达10倍），进食高脂食物时收缩，经胆囊管将胆汁排入十二指肠。",
        },
      },
    ],
  },
  "mat-cat-da-day": {
    slug: "mat-cat-da-day",
    title: {
      vi: "Mặt cắt dạ dày",
      en: "Stomach Cross Section",
      zh: "胃横切面",
    },
    description: {
      vi: "Dạ dày được cắt theo mặt phẳng đứng để lộ lòng rỗng hình chữ J bên trong — nơi thức ăn được nhào trộn với dịch vị. Tá tràng, đoạn đầu ruột non, vẫn giữ nguyên để thấy rõ điểm nối qua môn vị.",
      en: "The stomach is sliced along a vertical plane to reveal its hollow J-shaped interior, where food is churned with gastric juice. The duodenum, the first part of the small intestine, is left intact to show the pyloric junction.",
      zh: "胃沿垂直平面被切开，露出内部J形的空腔——食物在此与胃液混合搅拌。十二指肠（小肠起始段）保持完整，以展示幽门连接处。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/stomach_section.glb",
    hotspots: [
      {
        key: "stomach",
        meshName: "Stomach",
        offset: [-150, -40],
        label: { vi: "Dạ dày (mặt cắt)", en: "Stomach (sectioned)", zh: "胃（切面）" },
        latinName: "Gaster (Ventriculus)",
        note: {
          vi: "Túi cơ hình chữ J co bóp và tiết acid (pH ~1.5-3.5) để tiêu hoá thức ăn. Từ trên xuống gồm tâm vị (nối thực quản), đáy vị, thân vị và phần môn vị (nối tá tràng) — mặt cắt này cho thấy độ dày thành và lòng rỗng bên trong, do dữ liệu gốc không có lớp niêm mạc riêng nên chưa thể hiện các nếp nhăn niêm mạc (rugae).",
          en: "A J-shaped muscular sac that churns food and secretes acid (pH ~1.5-3.5). From top to bottom it has the cardia (joining the esophagus), fundus, body, and pyloric part (joining the duodenum) — this section shows wall thickness and the hollow interior; the source data has no separate mucosal layer, so the mucosal folds (rugae) are not depicted.",
          zh: "J形肌性囊袋，通过蠕动和分泌胃酸（pH约1.5-3.5）消化食物。自上而下依次为贲门（连接食道）、胃底、胃体和幽门部（连接十二指肠）——此切面展示了胃壁厚度与内部空腔；因原始数据没有独立的黏膜层，胃黏膜皱襞（rugae）暂未呈现。",
        },
      },
      {
        key: "duodenum",
        meshName: "Duodenum",
        offset: [150, 60],
        label: { vi: "Tá tràng", en: "Duodenum", zh: "十二指肠" },
        latinName: "Duodenum",
        note: {
          vi: "Đoạn đầu tiên và ngắn nhất của ruột non, hình chữ C ôm quanh đầu tuỵ — nhận thức ăn đã tiêu hoá một phần từ dạ dày qua môn vị, đồng thời nhận dịch mật và dịch tuỵ để tiếp tục tiêu hoá.",
          en: "The first and shortest part of the small intestine, C-shaped and curving around the head of the pancreas — it receives partially digested food from the stomach through the pylorus, along with bile and pancreatic juice for further digestion.",
          zh: "小肠的第一段，也是最短的一段，呈C形环绕胰头——经幽门接收胃部初步消化的食物，同时接收胆汁与胰液以继续消化过程。",
        },
      },
    ],
  },
  "giai-phau-tuy": {
    slug: "giai-phau-tuy",
    title: {
      vi: "Giải phẫu Tuỵ",
      en: "Pancreas Anatomy",
      zh: "胰腺解剖",
    },
    description: {
      vi: "Tuỵ là tuyến vừa nội tiết vừa ngoại tiết nằm vắt ngang sau phúc mạc, gồm 4 phần từ phải sang trái: đầu (nằm trong vòng cung tá tràng), cổ, thân và đuôi (chạm tới lách). Tá tràng được giữ lại để thấy rõ mối liên hệ giải phẫu mật thiết giữa 2 cơ quan này.",
      en: "The pancreas is a gland with both endocrine and exocrine functions, lying horizontally in the retroperitoneum. It has four parts from right to left: the head (cradled by the duodenal curve), neck, body, and tail (reaching toward the spleen). The duodenum is kept in view to show how closely the two organs relate.",
      zh: "胰腺是兼具内分泌与外分泌功能的腺体，横卧于腹膜后。从右到左分为四部分：胰头（被十二指肠环绕）、胰颈、胰体和胰尾（延伸至脾脏附近）。保留十二指肠以展示两个器官之间紧密的解剖关系。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/pancreas_anatomy.glb",
    hotspots: [
      {
        key: "pancreas",
        meshName: "Pancreas",
        offset: [-150, -30],
        label: { vi: "Tuỵ", en: "Pancreas", zh: "胰腺" },
        latinName: "Pancreas",
        note: {
          vi: "Tuyến dài khoảng 15cm, nằm vắt ngang phía sau dạ dày ở vị trí retroperitoneal. Chức năng NGOẠI TIẾT: tiết dịch tuỵ chứa enzym tiêu hoá (amylase, lipase, trypsin) đổ vào tá tràng qua ống tuỵ. Chức năng NỘI TIẾT: các đảo tuỵ (đảo Langerhans) tiết insulin và glucagon thẳng vào máu để điều hoà đường huyết — 2 chức năng khác biệt hoàn toàn trong cùng 1 cơ quan.",
          en: "A gland roughly 15cm long, lying horizontally behind the stomach in a retroperitoneal position. Its EXOCRINE role secretes pancreatic juice with digestive enzymes (amylase, lipase, trypsin) into the duodenum via the pancreatic duct. Its ENDOCRINE role: the islets of Langerhans release insulin and glucagon directly into the bloodstream to regulate blood sugar — two entirely distinct functions within the same organ.",
          zh: "长约15厘米的腺体，横卧于胃后方，位于腹膜后。其外分泌功能：分泌含消化酶（淀粉酶、脂肪酶、胰蛋白酶）的胰液，经胰管注入十二指肠。其内分泌功能：胰岛（朗格汉斯岛）直接向血液释放胰岛素与胰高血糖素以调节血糖——同一器官内两种截然不同的功能。",
        },
      },
      {
        key: "duodenum",
        meshName: "Duodenum",
        offset: [150, 60],
        label: { vi: "Tá tràng", en: "Duodenum", zh: "十二指肠" },
        latinName: "Duodenum",
        note: {
          vi: "Đoạn ruột hình chữ C ôm lấy đầu tuỵ — điểm nối này quan trọng về mặt lâm sàng vì khối u đầu tuỵ có thể chèn ép tá tràng hoặc ống mật chủ đi qua khu vực này, gây tắc nghẽn.",
          en: "The C-shaped segment of bowel cradling the head of the pancreas — this junction matters clinically because a tumor in the pancreatic head can compress the duodenum or the common bile duct passing through this region, causing obstruction.",
          zh: "呈C形环绕胰头的肠段——此连接处具有重要临床意义，因为胰头肿瘤可能压迫经过此区域的十二指肠或胆总管，造成梗阻。",
        },
      },
    ],
  },
  "mat-cat-ruot-non": {
    slug: "mat-cat-ruot-non",
    title: {
      vi: "Mặt cắt ruột non (hỗng tràng)",
      en: "Small Intestine Cross Section (Jejunum)",
      zh: "小肠横切面（空肠）",
    },
    description: {
      vi: "Ruột non cuộn nhiều vòng trong khoang bụng để đủ chiều dài (~6-7m) trong không gian hạn chế. Một mặt phẳng cắt ngang qua khối cuộn này lộ ra NHIỀU mặt cắt tròn cùng lúc — mỗi vòng cắt là một lát ngang qua ống ruột tại một điểm khác nhau dọc chiều dài. Đoạn mô hình hoá ở đây là hỗng tràng (jejunum), phần giữa của ruột non; ranh giới với hồi tràng (ileum) không rõ rệt về mặt giải phẫu đại thể nên không có mesh riêng trong dữ liệu nguồn.",
      en: "The small intestine coils repeatedly within the abdominal cavity to fit its full length (~6-7m) into a confined space. A single cutting plane through this coiled mass reveals MULTIPLE circular cross-sections at once — each ring is a slice through the tube at a different point along its length. The segment modeled here is the jejunum, the middle portion of the small intestine; its boundary with the ileum is not a distinct gross-anatomical landmark, so the source data has no separate ileum mesh.",
      zh: "小肠在腹腔内反复盘绕，以便将约6-7米的全长容纳在有限空间内。一个平面切过这团盘绕的肠管，会同时露出多个圆形横切面——每个环都是肠管在不同位置的切片。此处建模的是空肠，即小肠的中段；空肠与回肠之间在大体解剖上没有明确分界标志，因此原始数据中没有单独的回肠网格。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/small_intestine_section.glb",
    hotspots: [
      {
        key: "jejunum",
        meshName: "Jejunum",
        offset: [0, -140],
        label: { vi: "Hỗng tràng", en: "Jejunum", zh: "空肠" },
        latinName: "Jejunum",
        note: {
          vi: "Đoạn giữa của ruột non, tiếp theo tá tràng — thành ruột dày và nhiều nếp gấp niêm mạc (plicae circulares) hơn hồi tràng phía sau, giúp tăng diện tích hấp thu dưỡng chất đã được tiêu hoá gần hết. Mỗi vòng tròn trong mặt cắt này là 1 lát cắt qua cùng 1 ống ruột dài, cuộn qua lại nhiều lần trong khoang bụng.",
          en: "The middle segment of the small intestine, following the duodenum — its wall is thicker with more circular mucosal folds (plicae circulares) than the ileum further along, increasing surface area for absorbing nearly fully digested nutrients. Each ring visible in this section is a slice through the same long tube, which loops back and forth repeatedly within the abdominal cavity.",
          zh: "小肠的中段，紧接十二指肠——与后段的回肠相比，其肠壁更厚，环状皱襞（plicae circulares）更多，可增加吸收已基本消化完全的营养物质的表面积。此切面中看到的每个圆环都是同一条长管在腹腔内反复盘绕后被切到的切片。",
        },
      },
    ],
  },
  "mat-cat-ruot-gia": {
    slug: "mat-cat-ruot-gia",
    title: {
      vi: "Đại-trực tràng và mặt cắt đại tràng xích-ma",
      en: "Colorectal Anatomy and Sigmoid Colon Cross Section",
      zh: "大肠、直肠与乙状结肠横切面",
    },
    description: {
      vi: "Đại tràng tạo thành 1 khung bao quanh ổ bụng: đi lên bên phải (đại tràng lên), vắt ngang qua trên (đại tràng ngang), đi xuống bên trái (đại tràng xuống), rồi uốn hình chữ S vào khung chậu (đại tràng xích-ma) trước khi nối trực tràng. Đại tràng xích-ma được cắt hở để lộ lòng ống; ruột thừa và điểm nối hồi-manh tràng vẫn giữ nguyên. Trực tràng và điểm nối hồi-manh tràng lấy từ nguồn BodyParts3D (CC BY-SA 2.1 JP, cùng gốc dữ liệu mà Z-Anatomy dẫn xuất) vì Startup.blend hiện tại không có 2 cấu trúc này; toạ độ đã được canh khớp thủ công với phần đại tràng còn lại. Manh tràng dạng túi hoàn chỉnh chưa có sẵn ở nguồn nào đã kiểm tra — điểm nối hồi-manh tràng là cấu trúc gần nhất thể hiện được vị trí này.",
      en: "The large intestine forms a frame around the abdominal cavity: rising on the right (ascending colon), crossing the top (transverse colon), descending on the left (descending colon), then curving in an S-shape into the pelvis (sigmoid colon) before joining the rectum. The sigmoid colon is sliced open to reveal its hollow interior; the vermiform appendix and the ileocecal junction are left intact. The rectum and ileocecal junction are sourced from BodyParts3D (CC BY-SA 2.1 JP, the same lineage Z-Anatomy itself derives from), since the current Startup.blend lacks these two structures; their position was manually aligned to match the rest of the colon. A complete cecal pouch mesh was not found in any source checked — the ileocecal junction is the closest available structure representing this region.",
      zh: "大肠在腹腔内形成一个环状框架：右侧上行（升结肠）、顶部横跨（横结肠）、左侧下行（降结肠），再呈S形弯入盆腔（乙状结肠），最后与直肠相连。乙状结肠被切开以展示其中空的内部；阑尾与回盲交界保持完整。直肠与回盲交界取自BodyParts3D（CC BY-SA 2.1 JP，与Z-Anatomy同源）——因目前的Startup.blend缺少这两个结构，其位置已手动对齐至与其余结肠部分匹配。经检索的所有数据源均未找到完整的盲肠囊网格——回盲交界是目前能呈现此区域最接近的结构。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/large_intestine_section.glb",
    hotspots: [
      {
        key: "ascending-colon",
        meshName: "Ascending colon",
        offset: [150, 60],
        label: { vi: "Đại tràng lên", en: "Ascending Colon", zh: "升结肠" },
        latinName: "Colon ascendens",
        note: {
          vi: "Đoạn đầu tiên của đại tràng, đi thẳng lên dọc bên phải ổ bụng từ hố chậu phải tới gan — nằm cố định sau phúc mạc (retroperitoneal), không có mạc treo di động như ruột non.",
          en: "The first part of the colon, running straight up the right side of the abdomen from the right iliac fossa to the liver — fixed retroperitoneally, unlike the mobile, mesentery-suspended small intestine.",
          zh: "结肠的第一段，从右髂窝沿腹腔右侧垂直上行至肝脏附近——固定于腹膜后，不像小肠那样由可移动的肠系膜悬挂。",
        },
      },
      {
        key: "transverse-colon",
        meshName: "Transverse colon",
        offset: [0, -150],
        label: { vi: "Đại tràng ngang", en: "Transverse Colon", zh: "横结肠" },
        latinName: "Colon transversum",
        note: {
          vi: "Đoạn dài nhất và di động nhất của đại tràng, vắt ngang từ góc gan (phải) sang góc lách (trái) — có mạc treo riêng (mesocolon ngang) nên có thể chùng võng xuống thấp, đặc biệt ở người có thành bụng yếu.",
          en: "The longest and most mobile part of the colon, crossing from the hepatic flexure (right) to the splenic flexure (left) — it has its own mesentery (transverse mesocolon), allowing it to sag downward, especially in people with a lax abdominal wall.",
          zh: "结肠中最长且活动度最大的一段，从肝曲（右）横跨至脾曲（左）——拥有自己的系膜（横结肠系膜），因此可能下垂，在腹壁松弛的人群中尤为明显。",
        },
      },
      {
        key: "descending-colon",
        meshName: "Descending colon",
        offset: [-150, 60],
        label: { vi: "Đại tràng xuống", en: "Descending Colon", zh: "降结肠" },
        latinName: "Colon descendens",
        note: {
          vi: "Đi xuống dọc bên trái ổ bụng từ góc lách tới hố chậu trái, cũng nằm cố định sau phúc mạc như đại tràng lên — khẩu kính hẹp hơn đại tràng lên nên phân đã cô đặc hơn khi đi qua đoạn này.",
          en: "Runs down the left side of the abdomen from the splenic flexure to the left iliac fossa, fixed retroperitoneally like the ascending colon — its narrower caliber means stool is already more solid by the time it passes through here.",
          zh: "沿腹腔左侧从脾曲下行至左髂窝，与升结肠一样固定于腹膜后——管径较窄，粪便经过此处时已变得更加成形。",
        },
      },
      {
        key: "sigmoid-colon",
        meshName: "Sigmoid colon",
        offset: [-100, 150],
        label: { vi: "Đại tràng xích-ma (mặt cắt)", en: "Sigmoid Colon (sectioned)", zh: "乙状结肠（切面）" },
        latinName: "Colon sigmoideum",
        note: {
          vi: "Đoạn cong hình chữ S nối đại tràng xuống với trực tràng, có mạc treo riêng nên khá di động — vị trí hay xảy ra viêm túi thừa (diverticulitis) nhất trong toàn bộ đại tràng do áp lực trong lòng ống cao và khẩu kính hẹp.",
          en: "The S-shaped segment connecting the descending colon to the rectum, suspended by its own mesentery and fairly mobile — the most common site for diverticulitis in the entire colon, due to high intraluminal pressure and narrow caliber.",
          zh: "呈S形连接降结肠与直肠的肠段，由自身系膜悬吊，活动度较大——因肠腔内压力高、管径窄，是整个结肠中最常发生憩室炎的部位。",
        },
      },
      {
        key: "vermiform-appendix",
        meshName: "Vermiform appendix",
        offset: [120, 130],
        label: { vi: "Ruột thừa", en: "Vermiform Appendix", zh: "阑尾" },
        latinName: "Appendix vermiformis",
        note: {
          vi: "Túi cụt nhỏ hình con giun gắn gần manh tràng (đầu đại tràng lên) — chứa nhiều mô lympho, được xem là có vai trò miễn dịch. Viêm ruột thừa (appendicitis) là một trong những nguyên nhân đau bụng cấp ngoại khoa phổ biến nhất.",
          en: "A small, worm-shaped blind pouch attached near the cecum (the start of the ascending colon) — rich in lymphoid tissue and thought to play an immune role. Appendicitis is one of the most common causes of acute surgical abdominal pain.",
          zh: "附着于盲肠（升结肠起始部分）附近的小型蠕虫状盲袋——富含淋巴组织，被认为具有免疫功能。阑尾炎是急性外科腹痛最常见的病因之一。",
        },
      },
      {
        key: "ileocecal-junction",
        meshName: "Ileocecal junction",
        offset: [180, 90],
        label: { vi: "Điểm nối hồi-manh tràng", en: "Ileocecal Junction", zh: "回盲交界" },
        latinName: "Ostium ileale (khu vực van hồi-manh tràng)",
        note: {
          vi: "Vùng hồi tràng (đoạn cuối ruột non) đổ vào manh tràng (túi cùng đầu đại tràng lên) qua van hồi-manh tràng — van này có vai trò 1 chiều, ngăn chất trong đại tràng trào ngược lại ruột non. Nguồn: BodyParts3D (không có trong Z-Anatomy).",
          en: "The region where the ileum (final part of the small intestine) empties into the cecum (the pouch at the start of the ascending colon) through the ileocecal valve — a one-way valve preventing colonic contents from refluxing back into the small intestine. Source: BodyParts3D (not present in Z-Anatomy).",
          zh: "回肠（小肠末段）经回盲瓣汇入盲肠（升结肠起始处的囊袋）的区域——该瓣膜为单向结构，防止结肠内容物逆流回小肠。数据来源：BodyParts3D（Z-Anatomy中没有此结构）。",
        },
      },
      {
        key: "rectum",
        meshName: "Rectum",
        offset: [-120, 200],
        label: { vi: "Trực tràng", en: "Rectum", zh: "直肠" },
        latinName: "Rectum",
        note: {
          vi: "Đoạn cuối ống tiêu hoá, nối đại tràng xích-ma với ống hậu môn — thẳng hơn các đoạn đại tràng khác (dù tên gọi Latin nghĩa là \"thẳng\", thực tế vẫn có 3 đường cong nhẹ theo mặt phẳng ngang). Thành trực tràng giãn nở được để chứa phân trước khi đại tiện; cảm giác mót rặn xuất hiện khi thành trực tràng căng đủ ngưỡng. Nguồn: BodyParts3D (không có trong Z-Anatomy).",
          en: "The final segment of the digestive tube, connecting the sigmoid colon to the anal canal — straighter than other colon segments (though its Latin name means \"straight,\" it actually has 3 gentle lateral curves). Its wall is distensible to store stool before defecation; the urge to defecate arises once the rectal wall stretches past a threshold. Source: BodyParts3D (not present in Z-Anatomy).",
          zh: "消化管的最后一段，连接乙状结肠与肛管——比其他结肠节段更直（尽管其拉丁名意为\"直的\"，实际上仍有3处轻微的侧向弯曲）。肠壁可扩张以在排便前储存粪便；当直肠壁扩张超过阈值时便产生便意。数据来源：BodyParts3D（Z-Anatomy中没有此结构）。",
        },
      },
    ],
  },
  "co-that-hau-mon": {
    slug: "co-that-hau-mon",
    title: {
      vi: "Cơ thắt hậu môn và cơ nâng hậu môn",
      en: "Anal Sphincter and Levator Ani Muscles",
      zh: "肛门括约肌与提肛肌",
    },
    description: {
      vi: "Kiểm soát đại tiện dựa vào 2 lớp cơ khác nhau: cơ thắt ngoài hậu môn (vòng cơ vân nhỏ, chủ động co thắt được) và cơ mu-hậu môn — một phần của cơ nâng hậu môn (cơ vân tạo thành dây treo hình phễu nâng đỡ sàn chậu). Dữ liệu nguồn không có ống hậu môn/trực tràng dưới dạng mesh riêng (chỉ có 2 nhóm cơ này), nên scene tập trung vào cơ chế cơ học kiểm soát chứ không phải lớp niêm mạc ống hậu môn.",
      en: "Bowel continence relies on two distinct muscle layers: the external anal sphincter (a small ring of skeletal muscle under voluntary control) and the puboanalis muscle — part of the levator ani, a funnel-shaped sling of skeletal muscle that supports the pelvic floor. The source data has no separate mesh for the anal canal or rectum (only these two muscle groups), so this scene focuses on the muscular continence mechanism rather than the canal lining.",
      zh: "排便控制依赖两层不同的肌肉：肛门外括约肌（一圈可自主收缩的小型骨骼肌环）与耻骨肛门肌——提肛肌的一部分，是支撑盆底的漏斗状骨骼肌吊带。原始数据没有肛管或直肠的独立网格（仅有这两组肌肉），因此本场景聚焦于控便的肌肉机制，而非肛管内壁。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/anal_sphincter.glb",
    hotspots: [
      {
        key: "external-anal-sphincter",
        meshName: "External anal sphincter.l",
        offset: [0, 20],
        label: { vi: "Cơ thắt ngoài hậu môn", en: "External Anal Sphincter", zh: "肛门外括约肌" },
        latinName: "Sphincter externus ani",
        note: {
          vi: "Vòng cơ vân (kiểm soát được ý thức) bao quanh ống hậu môn, phối hợp với cơ thắt trong hậu môn (cơ trơn, không tự chủ, không có mesh riêng trong data) để giữ khép hậu môn — đây là cơ duy nhất trong cơ chế kiểm soát đại tiện mà con người có thể chủ động co thắt.",
          en: "A ring of skeletal (voluntary) muscle encircling the anal canal, working alongside the internal anal sphincter (smooth, involuntary muscle, not separately modeled here) to keep the anus closed — it is the only muscle in the continence mechanism a person can consciously contract.",
          zh: "环绕肛管的骨骼肌（可自主控制）环，与肛门内括约肌（平滑肌、不随意，本数据未单独建模）协同工作以保持肛门闭合——它是控便机制中唯一可由人主动收缩的肌肉。",
        },
      },
      {
        key: "pubo-analis",
        meshName: "Pubo-analis muscle.l",
        offset: [-160, -30],
        label: { vi: "Cơ mu-hậu môn", en: "Puboanalis Muscle", zh: "耻骨肛门肌" },
        latinName: "Musculus puboanalis",
        note: {
          vi: "Một phần của cơ nâng hậu môn (levator ani) — nhóm cơ vân rộng tạo thành sàn chậu hình phễu, nâng đỡ trực tràng/hậu môn cùng các tạng chậu khác. Yếu cơ nâng hậu môn (VD sau sinh thường) là nguyên nhân chính gây sa tạng chậu và một số dạng són phân.",
          en: "Part of the levator ani — a broad sling of skeletal muscle forming the funnel-shaped pelvic floor, supporting the rectum/anus along with the other pelvic organs. Weakness of the levator ani (e.g., after vaginal childbirth) is a leading cause of pelvic organ prolapse and some forms of fecal incontinence.",
          zh: "提肛肌的一部分——一片宽阔的骨骼肌吊带，构成漏斗状的盆底，支撑直肠/肛门及其他盆腔器官。提肛肌无力（如经阴道分娩后）是盆腔器官脱垂及部分大便失禁的主要原因。",
        },
      },
    ],
  },
  "mat-cat-tui-mat": {
    slug: "mat-cat-tui-mat",
    title: {
      vi: "Mặt cắt túi mật",
      en: "Gallbladder Cross Section",
      zh: "胆囊切面",
    },
    description: {
      vi: "Túi mật được cắt theo mặt phẳng đứng để lộ khoang chứa mật rỗng bên trong. Ống mật, đi ra từ cổ túi mật, được giữ nguyên để thấy đường mật nối tiếp về phía ống mật chủ.",
      en: "The gallbladder is sliced along a vertical plane to reveal its hollow bile-storing cavity. The bile duct, emerging from the gallbladder neck, is left intact to show the biliary pathway continuing toward the common bile duct.",
      zh: "胆囊沿垂直平面被切开，露出内部储存胆汁的空腔。从胆囊颈发出的胆管保持完整，以展示胆道向胆总管延续的走向。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/gallbladder_section.glb",
    hotspots: [
      {
        key: "gallbladder-section",
        meshName: "Gallbladder",
        offset: [-150, 0],
        label: { vi: "Túi mật (mặt cắt)", en: "Gallbladder (sectioned)", zh: "胆囊（切面）" },
        latinName: "Vesica biliaris",
        note: {
          vi: "Túi cơ trơn hình quả lê, thành gồm 3 lớp (niêm mạc gấp nếp, cơ, thanh mạc) tương tự ống tiêu hoá — cô đặc mật gan tiết ra bằng cách hấp thu nước, có thể chứa 30-50ml mật giữa các bữa ăn. Sỏi mật (gallstones) hình thành khi cholesterol hoặc sắc tố mật kết tinh trong khoang này.",
          en: "A pear-shaped sac of smooth muscle with 3 wall layers (folded mucosa, muscle, serosa) similar to the digestive tube — it concentrates liver-produced bile by absorbing water, holding roughly 30-50ml between meals. Gallstones form when cholesterol or bile pigments crystallize inside this cavity.",
          zh: "梨形平滑肌囊袋，管壁分3层（皱褶黏膜、肌层、浆膜），与消化管结构类似——通过吸收水分浓缩肝脏分泌的胆汁，两餐之间可容纳约30-50毫升胆汁。当胆固醇或胆色素在此腔内结晶时便形成胆结石。",
        },
      },
      {
        key: "bile-duct",
        meshName: "Bile duct",
        offset: [150, -60],
        label: { vi: "Ống mật", en: "Bile Duct", zh: "胆管" },
        latinName: "Ductus biliaris",
        note: {
          vi: "Đường dẫn mật từ cổ túi mật (ống túi mật) hợp với ống gan chung để tạo thành ống mật chủ, đổ vào tá tràng qua bóng Vater. Tắc nghẽn đường mật (VD do sỏi kẹt) gây vàng da tắc mật — mật ứ lại trào ngược vào máu.",
          en: "The biliary pathway from the gallbladder neck (cystic duct) joins the common hepatic duct to form the common bile duct, which empties into the duodenum at the ampulla of Vater. Obstruction of this pathway (e.g., a lodged gallstone) causes obstructive jaundice, as backed-up bile refluxes into the bloodstream.",
          zh: "从胆囊颈（胆囊管）发出的胆道与肝总管汇合形成胆总管，经Vater壶腹注入十二指肠。此通路阻塞（如结石嵌顿）会导致阻塞性黄疸——淤积的胆汁反流入血液。",
        },
      },
    ],
  },
  "tong-quan-he-tieu-hoa": {
    slug: "tong-quan-he-tieu-hoa",
    title: {
      vi: "Tổng quan hệ tiêu hoá (tạng bụng)",
      en: "Digestive System Overview (Abdominal Viscera)",
      zh: "消化系统总览（腹腔脏器）",
    },
    description: {
      vi: "Toàn bộ các tạng tiêu hoá đã mô hình hoá được lắp ráp lại đúng vị trí giải phẫu gốc — từ dạ dày, qua tá tràng và hỗng tràng cuộn nhiều vòng, tới khung đại tràng bao quanh ổ bụng, cùng gan/túi mật/tuỵ hỗ trợ tiêu hoá. Đây là góc nhìn tổng thể; xem từng cơ quan chi tiết hơn (mặt cắt, phân thuỳ) ở các trang riêng.",
      en: "All the digestive organs modeled so far are assembled in their original anatomical positions — from the stomach, through the duodenum and coiled jejunum, to the colon frame surrounding the abdominal cavity, alongside the liver, gallbladder, and pancreas that support digestion. This is the big-picture view; see the dedicated pages for detailed cross-sections and segmentation of each organ.",
      zh: "目前已建模的所有消化器官均按原始解剖位置组装——从胃、十二指肠、盘绕的空肠，到环绕腹腔的结肠框架，以及协助消化的肝脏、胆囊与胰腺。此为整体视角；各器官的详细切面与分段请查看对应的专门页面。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/digestive_system_overview.glb",
    hotspots: [
      {
        key: "liver-overview",
        meshName: "Posterior segment of liver (I)",
        offset: [-160, -100],
        label: { vi: "Gan", en: "Liver", zh: "肝脏" },
        latinName: "Hepar",
        note: {
          vi: "Tuyến lớn nhất cơ thể, hiển thị ở đây dưới dạng 8 phân thuỳ Couinaud tô màu riêng — xem chi tiết từng phân thuỳ ở trang \"Giải phẫu Gan\".",
          en: "The body's largest gland, shown here as its 8 individually colored Couinaud segments — see the \"Liver Anatomy\" page for detail on each segment.",
          zh: "人体最大的腺体，此处以8个独立着色的Couinaud分段呈现——各分段详情见\"肝脏解剖\"页面。",
        },
      },
      {
        key: "gallbladder-overview",
        meshName: "Gallbladder",
        offset: [-160, -20],
        label: { vi: "Túi mật", en: "Gallbladder", zh: "胆囊" },
        latinName: "Vesica biliaris",
        note: {
          vi: "Nằm áp sát mặt dưới gan, dự trữ và cô đặc mật — xem mặt cắt chi tiết ở trang \"Mặt cắt túi mật\".",
          en: "Tucked against the underside of the liver, storing and concentrating bile — see the \"Gallbladder Cross Section\" page for its interior.",
          zh: "紧贴肝脏下方，储存并浓缩胆汁——内部结构详见\"胆囊切面\"页面。",
        },
      },
      {
        key: "stomach-overview",
        meshName: "Stomach",
        offset: [150, -90],
        label: { vi: "Dạ dày", en: "Stomach", zh: "胃" },
        latinName: "Gaster (Ventriculus)",
        note: {
          vi: "Túi cơ hình chữ J tiếp nhận thức ăn từ thực quản, co bóp và tiết acid tiêu hoá trước khi đẩy xuống tá tràng.",
          en: "A J-shaped muscular pouch receiving food from the esophagus, churning it with acid before pushing it into the duodenum.",
          zh: "J形肌性囊袋，接收来自食道的食物，通过胃酸搅拌消化后推入十二指肠。",
        },
      },
      {
        key: "pancreas-overview",
        meshName: "Pancreas",
        offset: [150, -20],
        label: { vi: "Tuỵ", en: "Pancreas", zh: "胰腺" },
        latinName: "Pancreas",
        note: {
          vi: "Nằm vắt ngang sau dạ dày, đầu tuỵ lọt trong vòng cung tá tràng — vừa tiết enzym tiêu hoá (ngoại tiết) vừa tiết insulin/glucagon (nội tiết).",
          en: "Lies horizontally behind the stomach, its head cradled by the duodenal curve — secretes both digestive enzymes (exocrine) and insulin/glucagon (endocrine).",
          zh: "横卧于胃后方，胰头被十二指肠环抱——兼具分泌消化酶（外分泌）与胰岛素/胰高血糖素（内分泌）的功能。",
        },
      },
      {
        key: "duodenum-overview",
        meshName: "Duodenum",
        offset: [160, 40],
        label: { vi: "Tá tràng", en: "Duodenum", zh: "十二指肠" },
        latinName: "Duodenum",
        note: {
          vi: "Đoạn đầu ruột non, hình chữ C, nhận thức ăn từ dạ dày cùng dịch mật và dịch tuỵ để tiếp tục tiêu hoá.",
          en: "The first, C-shaped part of the small intestine, receiving food from the stomach along with bile and pancreatic juice for continued digestion.",
          zh: "小肠的第一段，呈C形，接收来自胃的食物及胆汁、胰液以继续消化。",
        },
      },
      {
        key: "jejunum-overview",
        meshName: "Jejunum",
        offset: [0, 60],
        label: { vi: "Hỗng tràng (ruột non)", en: "Jejunum (Small Intestine)", zh: "空肠（小肠）" },
        latinName: "Jejunum",
        note: {
          vi: "Cuộn nhiều vòng để chứa đủ chiều dài ~6-7m trong khoang bụng — nơi hấp thu phần lớn dưỡng chất đã tiêu hoá.",
          en: "Coiled repeatedly to fit its ~6-7m length within the abdominal cavity — the main site where digested nutrients are absorbed.",
          zh: "反复盘绕以将约6-7米的长度容纳于腹腔内——是吸收已消化营养物质的主要场所。",
        },
      },
      {
        key: "colon-overview",
        meshName: "Ascending colon",
        offset: [180, 120],
        label: { vi: "Đại tràng", en: "Large Intestine (Colon)", zh: "大肠（结肠）" },
        latinName: "Colon",
        note: {
          vi: "Tạo khung bao quanh ổ bụng (lên → ngang → xuống → xích-ma), hấp thu nước và tạo khuôn phân — xem chi tiết từng đoạn ở trang \"Đại tràng\".",
          en: "Forms a frame around the abdominal cavity (ascending → transverse → descending → sigmoid), absorbing water and forming stool — see the \"Large Intestine\" page for each segment.",
          zh: "在腹腔内形成环状框架（升→横→降→乙状），吸收水分并形成粪便——各段详情见\"大肠\"页面。",
        },
      },
      {
        key: "appendix-overview",
        meshName: "Vermiform appendix",
        offset: [180, 170],
        label: { vi: "Ruột thừa", en: "Vermiform Appendix", zh: "阑尾" },
        latinName: "Appendix vermiformis",
        note: {
          vi: "Túi cụt nhỏ gắn gần điểm nối ruột non-đại tràng, giàu mô lympho.",
          en: "A small blind pouch near the small-intestine–colon junction, rich in lymphoid tissue.",
          zh: "位于小肠与大肠交界附近的小盲袋，富含淋巴组织。",
        },
      },
      {
        key: "rectum-overview",
        meshName: "Rectum",
        offset: [-140, 190],
        label: { vi: "Trực tràng", en: "Rectum", zh: "直肠" },
        latinName: "Rectum",
        note: {
          vi: "Đoạn cuối ống tiêu hoá, nối đại tràng xích-ma với ống hậu môn, giãn nở chứa phân trước khi đại tiện. Nguồn: BodyParts3D — xem chi tiết ở trang \"Đại-trực tràng\".",
          en: "The final segment of the digestive tube, connecting the sigmoid colon to the anal canal, distending to store stool before defecation. Source: BodyParts3D — see the \"Colorectal Anatomy\" page for detail.",
          zh: "消化管的最后一段，连接乙状结肠与肛管，可扩张以储存排便前的粪便。数据来源：BodyParts3D——详情见\"大肠与直肠\"页面。",
        },
      },
    ],
  },
  "phuc-mac": {
    slug: "phuc-mac",
    title: {
      vi: "Phúc mạc: mạc nối và mạc treo",
      en: "Peritoneum: Omenta and Mesenteries",
      zh: "腹膜：网膜与系膜",
    },
    description: {
      vi: "Phúc mạc là màng thanh dịch lót ổ bụng, gấp nếp tạo thành nhiều cấu trúc treo/che các tạng: mạc nối lớn (rủ xuống như tấm màn từ dạ dày), mạc nối nhỏ (nối gan với dạ dày-tá tràng), mạc treo đại tràng ngang và mạc treo ruột thừa. Dạ dày, đại tràng ngang và ruột thừa được giữ lại làm điểm neo để thấy rõ mỗi nếp phúc mạc gắn vào đâu.",
      en: "The peritoneum is a serous membrane lining the abdominal cavity, folding into several structures that suspend or drape over the organs: the greater omentum (hanging like a curtain from the stomach), the lesser omentum (connecting the liver to the stomach and duodenum), the transverse mesocolon, and the meso-appendix. The stomach, transverse colon, and appendix are kept as anchor points to show where each fold attaches.",
      zh: "腹膜是衬于腹腔内的浆膜，折叠形成多种悬吊或覆盖器官的结构：大网膜（像帘幕一样从胃垂下）、小网膜（连接肝脏与胃、十二指肠）、横结肠系膜与阑尾系膜。保留胃、横结肠与阑尾作为锚点，以展示每个腹膜皱襞的附着位置。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/peritoneum.glb",
    hotspots: [
      {
        key: "greater-omentum",
        meshName: "Greater omentum",
        offset: [-150, 80],
        label: { vi: "Mạc nối lớn", en: "Greater Omentum", zh: "大网膜" },
        latinName: "Omentum majus",
        note: {
          vi: "Nếp phúc mạc lớn 2 lớp gấp đôi, rủ từ bờ cong lớn dạ dày xuống che phủ phần lớn ruột non như 1 tấm màn — chứa nhiều mô mỡ và hạch bạch huyết nhỏ, có vai trò \"cảnh sát bụng\": di chuyển tới bọc kín ổ viêm (VD viêm ruột thừa) để ngăn nhiễm trùng lan rộng.",
          en: "A large, doubled-over peritoneal fold draping from the greater curvature of the stomach down over most of the small intestine like a curtain — rich in fat and small lymphoid aggregates. It acts as the abdomen's \"policeman,\" migrating to wall off sites of infection (e.g., appendicitis) and limit its spread.",
          zh: "一片巨大的双层腹膜皱襞，从胃大弯垂下，像帘幕一样覆盖大部分小肠——富含脂肪组织与小淋巴组织聚集体。它被称为腹腔的\"警察\"，会移动至感染部位（如阑尾炎）将其包裹，防止感染扩散。",
        },
      },
      {
        key: "lesser-omentum",
        meshName: "Lesser omentum",
        offset: [-150, -30],
        label: { vi: "Mạc nối nhỏ", en: "Lesser Omentum", zh: "小网膜" },
        latinName: "Omentum minus",
        note: {
          vi: "Nếp phúc mạc nối mặt tạng của gan với bờ cong nhỏ dạ dày và đoạn đầu tá tràng — bờ tự do phía sau chứa ống mật chủ, tĩnh mạch cửa và động mạch gan riêng (bó mạch gan), tạo thành ranh giới trước của khe Winslow (lối vào túi mạc nối nhỏ/hậu cung mạc nối).",
          en: "A peritoneal fold connecting the visceral surface of the liver to the lesser curvature of the stomach and the start of the duodenum — its free posterior edge contains the common bile duct, portal vein, and proper hepatic artery (the portal triad), forming the anterior boundary of the epiploic foramen (entrance to the lesser sac).",
          zh: "连接肝脏脏面与胃小弯及十二指肠起始段的腹膜皱襞——其游离后缘包含胆总管、门静脉与肝固有动脉（门静脉三联结构），构成网膜孔（通往网膜囊的入口）的前界。",
        },
      },
      {
        key: "transverse-mesocolon",
        meshName: "Mesocolon",
        offset: [150, -40],
        label: { vi: "Mạc treo đại tràng ngang", en: "Transverse Mesocolon", zh: "横结肠系膜" },
        latinName: "Mesocolon",
        note: {
          vi: "Nếp phúc mạc treo đại tràng ngang vào thành bụng sau, chứa mạch máu nuôi đoạn ruột này — chính nhờ mạc treo riêng mà đại tràng ngang (khác với đại tràng lên/xuống nằm cố định retroperitoneal) có thể di động, đôi khi chùng võng xuống thấp.",
          en: "A peritoneal fold suspending the transverse colon from the posterior abdominal wall, carrying the blood vessels that supply this segment — this dedicated mesentery is why the transverse colon (unlike the fixed, retroperitoneal ascending/descending colon) can move and sometimes sags downward.",
          zh: "将横结肠悬吊于腹后壁的腹膜皱襞，内含供应此段肠管的血管——正因拥有独立的系膜，横结肠（不同于固定在腹膜后的升、降结肠）才具有一定活动度，有时会下垂。",
        },
      },
      {
        key: "meso-appendix",
        meshName: "Meso-appendix",
        offset: [150, 60],
        label: { vi: "Mạc treo ruột thừa", en: "Meso-appendix", zh: "阑尾系膜" },
        latinName: "Mesoappendix",
        note: {
          vi: "Nếp phúc mạc tam giác nhỏ treo ruột thừa vào mạc treo hồi tràng, mang mạch máu ruột thừa — trong phẫu thuật cắt ruột thừa, mạc treo này phải được thắt và cắt trước khi cắt bỏ ruột thừa để cầm máu.",
          en: "A small triangular peritoneal fold suspending the appendix from the ileal mesentery, carrying the appendicular vessels — during appendectomy, this mesentery must be ligated and divided before the appendix itself is removed, to control bleeding.",
          zh: "悬吊阑尾于回肠系膜的小三角形腹膜皱襞，内含阑尾血管——阑尾切除术中，须先结扎并离断此系膜以止血，再切除阑尾本身。",
        },
      },
    ],
  },
  "giai-phau-tim": {
    slug: "giai-phau-tim",
    title: {
      vi: "Giải phẫu Tim",
      en: "Heart Anatomy",
      zh: "心脏解剖",
    },
    description: {
      vi: "Tim gồm 4 buồng: 2 tâm nhĩ nhận máu trở về, 2 tâm thất bơm máu đi. Tim phải (tâm nhĩ+thất phải, tô xanh) bơm máu nghèo oxy lên phổi; tim trái (tô đỏ) bơm máu giàu oxy đi khắp cơ thể — thành tâm thất trái dày hơn hẳn thất phải vì phải tạo áp lực lớn hơn nhiều. Các van tim (lá van mỏng) đảm bảo máu chỉ chảy 1 chiều qua từng buồng.",
      en: "The heart has 4 chambers: 2 atria receiving returning blood, 2 ventricles pumping blood out. The right heart (right atrium+ventricle, colored blue) pumps oxygen-poor blood to the lungs; the left heart (colored red) pumps oxygen-rich blood throughout the body — the left ventricle's wall is much thicker than the right's because it must generate far higher pressure. The heart valves (thin leaflets) ensure blood flows in one direction only through each chamber.",
      zh: "心脏由4个腔室组成：2个心房接收回流血液，2个心室将血液泵出。右心（右心房+右心室，蓝色）将缺氧血泵向肺部；左心（红色）将富氧血泵向全身——左心室壁远比右心室壁厚，因为它需要产生高得多的压力。心脏瓣膜（薄叶片）确保血液在每个腔室中只能单向流动。",
    },
    visibleSystems: ["cardiovascular"],
    modelFile: "/models/heart_anatomy.glb",
    hotspots: [
      {
        key: "left-atrium",
        meshName: "Left atrium",
        offset: [-150, -60],
        label: { vi: "Tâm nhĩ trái", en: "Left Atrium", zh: "左心房" },
        latinName: "Atrium sinistrum",
        note: {
          vi: "Nhận máu giàu oxy từ phổi qua 4 tĩnh mạch phổi, đổ xuống tâm thất trái qua van hai lá. Thành mỏng vì chỉ cần đẩy máu 1 khoảng ngắn xuống thất ngay bên dưới.",
          en: "Receives oxygen-rich blood from the lungs via 4 pulmonary veins, passing it down to the left ventricle through the mitral valve. Its wall is thin since it only needs to push blood a short distance to the ventricle just below.",
          zh: "经4条肺静脉接收来自肺部的富氧血，经二尖瓣流入左心室。因只需将血液推送到正下方心室的短距离内，其壁较薄。",
        },
      },
      {
        key: "right-atrium",
        meshName: "Right atrium",
        offset: [150, -60],
        label: { vi: "Tâm nhĩ phải", en: "Right Atrium", zh: "右心房" },
        latinName: "Atrium dextrum",
        note: {
          vi: "Nhận máu nghèo oxy từ khắp cơ thể qua tĩnh mạch chủ trên và dưới, đổ xuống tâm thất phải qua van ba lá. Nút xoang nhĩ (sinoatrial node) — máy tạo nhịp tự nhiên của tim — nằm trong thành buồng này.",
          en: "Receives oxygen-poor blood from the whole body via the superior and inferior venae cavae, passing it down to the right ventricle through the tricuspid valve. The sinoatrial node — the heart's natural pacemaker — sits within this chamber's wall.",
          zh: "经上、下腔静脉接收来自全身的缺氧血，经三尖瓣流入右心室。窦房结——心脏的天然起搏点——就位于此腔室的壁内。",
        },
      },
      {
        key: "left-ventricle",
        meshName: "Left ventricle",
        offset: [-150, 100],
        label: { vi: "Tâm thất trái", en: "Left Ventricle", zh: "左心室" },
        latinName: "Ventriculus sinister",
        note: {
          vi: "Buồng bơm chính của tim, thành cơ dày nhất (8-12mm, dày gấp 2-3 lần thất phải) vì phải tạo đủ áp lực đẩy máu đi khắp cơ thể qua động mạch chủ. Huyết áp đo được (VD 120/80) phản ánh trực tiếp áp lực buồng này tạo ra.",
          en: "The heart's main pumping chamber, with the thickest muscular wall (8-12mm, 2-3x thicker than the right ventricle) because it must generate enough pressure to push blood through the aorta to the entire body. Measured blood pressure (e.g., 120/80) directly reflects the pressure this chamber generates.",
          zh: "心脏的主要泵血腔室，肌壁最厚（8-12毫米，比右心室厚2-3倍），因为它必须产生足够压力将血液经主动脉泵向全身。测得的血压（如120/80）直接反映此腔室产生的压力。",
        },
      },
      {
        key: "right-ventricle",
        meshName: "Right ventricle",
        offset: [150, 100],
        label: { vi: "Tâm thất phải", en: "Right Ventricle", zh: "右心室" },
        latinName: "Ventriculus dexter",
        note: {
          vi: "Bơm máu nghèo oxy lên phổi qua thân động mạch phổi — thành mỏng hơn thất trái vì tuần hoàn phổi là hệ áp lực thấp (khoảng cách bơm ngắn hơn nhiều so với đi khắp cơ thể).",
          en: "Pumps oxygen-poor blood to the lungs via the pulmonary trunk — its wall is thinner than the left ventricle's because the pulmonary circulation is a low-pressure system (a much shorter pumping distance than the whole body).",
          zh: "经肺动脉干将缺氧血泵向肺部——其壁比左心室薄，因为肺循环是低压系统（泵送距离远短于全身循环）。",
        },
      },
      {
        key: "pulmonary-trunk",
        meshName: "Pulmonary trunk",
        offset: [0, -140],
        label: { vi: "Thân động mạch phổi", en: "Pulmonary Trunk", zh: "肺动脉干" },
        latinName: "Truncus pulmonalis",
        note: {
          vi: "Mạch máu duy nhất mang máu NGHÈO oxy nhưng lại là ĐỘNG MẠCH (định nghĩa động/tĩnh mạch dựa vào chiều rời/về tim, không phải hàm lượng oxy) — tách đôi thành động mạch phổi trái và phải ngay sau khi rời tâm thất phải.",
          en: "The only artery carrying oxygen-POOR blood (arteries/veins are defined by direction away/toward the heart, not oxygen content) — it splits into the left and right pulmonary arteries shortly after leaving the right ventricle.",
          zh: "唯一一条运输缺氧血的动脉（动脉/静脉的定义依据是离心/回心方向，而非含氧量）——离开右心室后不久即分为左、右肺动脉。",
        },
      },
      {
        key: "mitral-valve",
        meshName: "Posterior leaflet of left atrioventricular valve",
        offset: [-160, 20],
        label: { vi: "Van hai lá", en: "Mitral Valve", zh: "二尖瓣" },
        latinName: "Valva atrioventricularis sinistra",
        note: {
          vi: "Van giữa nhĩ trái và thất trái, gồm 2 lá van (chỉ còn thấy lá sau trong mô hình này) — hở van hai lá (mitral regurgitation) là 1 trong những bệnh van tim phổ biến nhất, khiến máu trào ngược lên nhĩ trái khi thất co bóp.",
          en: "The valve between the left atrium and ventricle, made of 2 leaflets (only the posterior leaflet is shown in this model) — mitral regurgitation is one of the most common valve diseases, letting blood leak back into the left atrium when the ventricle contracts.",
          zh: "位于左心房与左心室之间的瓣膜，由2片瓣叶组成（本模型仅显示后叶）——二尖瓣反流是最常见的瓣膜疾病之一，心室收缩时血液会反流回左心房。",
        },
      },
      {
        key: "tricuspid-valve",
        meshName: "Septal leaflet of right atrioventricular valve",
        offset: [160, 20],
        label: { vi: "Van ba lá", en: "Tricuspid Valve", zh: "三尖瓣" },
        latinName: "Valva atrioventricularis dextra",
        note: {
          vi: "Van giữa nhĩ phải và thất phải, gồm 3 lá van (mô hình này thể hiện lá vách) — tên gọi \"ba lá\" chính là nguồn gốc của quy ước phân biệt van hai lá (trái, 2 lá)/ba lá (phải, 3 lá) trong giải phẫu tim.",
          en: "The valve between the right atrium and ventricle, made of 3 leaflets (this model shows the septal leaflet) — its \"tri-cuspid\" name is the origin of the anatomical convention distinguishing the mitral (left, 2 leaflets) from the tricuspid (right, 3 leaflets) valve.",
          zh: "位于右心房与右心室之间的瓣膜，由3片瓣叶组成（本模型显示隔叶）——其\"三尖\"之名正是心脏解剖学中区分二尖瓣（左侧，2叶）与三尖瓣（右侧，3叶）这一惯例的由来。",
        },
      },
      {
        key: "pulmonary-valve",
        meshName: "Anterior semilunar leaflet of pulmonary valve",
        offset: [40, -180],
        label: { vi: "Van động mạch phổi", en: "Pulmonary Valve", zh: "肺动脉瓣" },
        latinName: "Valva trunci pulmonalis",
        note: {
          vi: "Van tổ chim gồm 3 lá hình bán nguyệt, nằm giữa tâm thất phải và thân động mạch phổi — đóng lại ngay khi thất phải giãn ra (đầu thì tâm trương) để ngăn máu trào ngược, tạo ra thành phần thứ 2 của tiếng tim T2.",
          en: "A semilunar valve with 3 crescent-shaped cusps, between the right ventricle and pulmonary trunk — it snaps shut as soon as the right ventricle relaxes (start of diastole) to prevent backflow, contributing to the second heart sound (S2).",
          zh: "由3片半月形瓣叶组成的半月瓣，位于右心室与肺动脉干之间——右心室一舒张（舒张期开始）即迅速关闭以防止血液反流，是第二心音（S2）的成分之一。",
        },
      },
    ],
  },
  "mat-cat-vanh-tim": {
    slug: "mat-cat-vanh-tim",
    title: {
      vi: "Mặt cắt vành tim",
      en: "Heart Coronal Cross Section",
      zh: "心脏冠状切面",
    },
    description: {
      vi: "Cả 4 buồng tim được cắt cùng lúc theo 1 mặt phẳng vành (trước-sau) để so sánh trực tiếp độ dày thành cơ và kích thước khoang rỗng — khác với trang \"Giải phẫu Tim\" chỉ xem nguyên khối từng buồng. Sự khác biệt rõ rệt giữa thành thất trái (dày) và thất phải (mỏng) chỉ thấy được qua mặt cắt này.",
      en: "All 4 heart chambers are sliced together along a single coronal (front-to-back) plane to directly compare wall thickness and chamber volume — unlike the \"Heart Anatomy\" page, which shows each whole, uncut chamber. The stark difference between the thick left ventricular wall and the thin right ventricular wall is only visible in this cross-section.",
      zh: "4个心腔沿同一冠状面（前后向）一同被切开，以直接比较肌壁厚度与腔室容积——不同于\"心脏解剖\"页面展示的完整、未切开的腔室。左心室壁的厚实与右心室壁的单薄之间的鲜明差异，唯有在此切面中才能看到。",
    },
    visibleSystems: ["cardiovascular"],
    modelFile: "/models/heart_coronal_section.glb",
    hotspots: [
      {
        key: "left-ventricle-wall",
        meshName: "Left ventricle",
        offset: [-150, 80],
        label: { vi: "Thành thất trái (mặt cắt)", en: "Left Ventricular Wall (sectioned)", zh: "左心室壁（切面）" },
        latinName: "Ventriculus sinister",
        note: {
          vi: "Ở mặt cắt này, thành cơ tim trái hiện rõ dày 8-12mm — gấp 2-3 lần thành thất phải bên cạnh — vì phải bơm máu qua toàn bộ vòng tuần hoàn hệ thống (đi khắp cơ thể) chứ không chỉ lên phổi.",
          en: "In this section, the left ventricular myocardium is clearly 8-12mm thick — 2-3 times thicker than the adjacent right ventricular wall — because it must pump blood through the entire systemic circulation (the whole body), not just to the lungs.",
          zh: "在此切面中，左心室心肌壁厚度明显达8-12毫米——比相邻的右心室壁厚2-3倍——因为它必须将血液泵送至整个体循环（全身），而不仅仅是肺部。",
        },
      },
      {
        key: "right-ventricle-wall",
        meshName: "Right ventricle",
        offset: [150, 80],
        label: { vi: "Thành thất phải (mặt cắt)", en: "Right Ventricular Wall (sectioned)", zh: "右心室壁（切面）" },
        latinName: "Ventriculus dexter",
        note: {
          vi: "Thành mỏng hơn hẳn thất trái dù khoang chứa thể tích máu tương đương mỗi nhịp bơm — minh chứng trực quan rằng độ dày cơ tim phản ánh ÁP LỰC cần tạo ra, không phải THỂ TÍCH máu cần bơm.",
          en: "Its wall is much thinner than the left ventricle's despite pumping a roughly equal blood volume per beat — visual proof that myocardial wall thickness reflects the PRESSURE that must be generated, not the VOLUME of blood pumped.",
          zh: "尽管每次搏动泵出的血量与左心室大致相当，其壁却薄得多——直观证明心肌壁厚度反映的是需要产生的压力，而非泵出的血量。",
        },
      },
      {
        key: "left-atrium-wall",
        meshName: "Left atrium",
        offset: [-150, -80],
        label: { vi: "Thành nhĩ trái (mặt cắt)", en: "Left Atrial Wall (sectioned)", zh: "左心房壁（切面）" },
        latinName: "Atrium sinistrum",
        note: {
          vi: "Thành nhĩ mỏng hơn nhiều so với thành thất ngay bên dưới — nhĩ chỉ cần đẩy máu 1 khoảng ngắn xuống thất chứ không phải bơm đi xa.",
          en: "The atrial wall is much thinner than the ventricular wall just below it — the atrium only needs to push blood a short distance into the ventricle, not pump it far away.",
          zh: "心房壁远比其下方的心室壁薄——心房只需将血液推送很短的距离进入心室，而无需将其泵送到远处。",
        },
      },
      {
        key: "right-atrium-wall",
        meshName: "Right atrium",
        offset: [150, -80],
        label: { vi: "Thành nhĩ phải (mặt cắt)", en: "Right Atrial Wall (sectioned)", zh: "右心房壁（切面）" },
        latinName: "Atrium dextrum",
        note: {
          vi: "Khoang rỗng bên trong tiếp nhận máu từ tĩnh mạch chủ trên và dưới — thể tích khoang tương đối lớn so với thành mỏng, đặc trưng của buồng chứa áp lực thấp.",
          en: "The hollow interior receives blood from the superior and inferior venae cavae — a relatively large chamber volume paired with a thin wall, typical of a low-pressure holding chamber.",
          zh: "内部空腔接收来自上、下腔静脉的血液——腔室容积相对较大而壁薄，是低压储血腔室的典型特征。",
        },
      },
    ],
  },
  "dong-mach-vanh": {
    slug: "dong-mach-vanh",
    title: {
      vi: "Động mạch vành",
      en: "Coronary Arteries",
      zh: "冠状动脉",
    },
    description: {
      vi: "Chính bản thân tim cũng cần nguồn máu nuôi riêng — 2 động mạch vành (trái và phải) tách ra ngay từ gốc động mạch chủ, ngay sau van động mạch chủ, chạy trên bề mặt tim trong các rãnh giữa các buồng để nuôi toàn bộ cơ tim. Tắc nghẽn động mạch vành (do xơ vữa) là nguyên nhân gây nhồi máu cơ tim.",
      en: "The heart itself needs its own blood supply — the 2 coronary arteries (left and right) branch off right at the root of the aorta, just past the aortic valve, running along the heart's surface within the grooves between chambers to nourish the entire cardiac muscle. Blockage of a coronary artery (from atherosclerosis) causes a heart attack (myocardial infarction).",
      zh: "心脏本身也需要专属的血液供应——左、右冠状动脉从主动脉根部、紧邻主动脉瓣之后发出分支，沿心脏表面各腔室间的沟槽走行，滋养整个心肌。冠状动脉阻塞（因动脉粥样硬化）会导致心肌梗死。",
    },
    visibleSystems: ["cardiovascular"],
    modelFile: "/models/coronary_arteries.glb",
    hotspots: [
      {
        key: "left-coronary-artery",
        meshName: "Left coronary artery",
        offset: [-160, -60],
        label: { vi: "Động mạch vành trái", en: "Left Coronary Artery", zh: "左冠状动脉" },
        latinName: "Arteria coronaria sinistra",
        note: {
          vi: "Tách ra từ xoang Valsalva trái của động mạch chủ, đi 1 đoạn ngắn rồi chia thành động mạch liên thất trước và động mạch mũ — nuôi phần lớn thất trái, vách liên thất và phần trước tim.",
          en: "Branches off the left Valsalva sinus of the aorta, runs a short distance, then splits into the anterior interventricular and circumflex arteries — supplying most of the left ventricle, the interventricular septum, and the front of the heart.",
          zh: "从主动脉左瓦氏窦发出，走行一小段后分为前室间支与旋支——供应左心室大部、室间隔及心脏前部。",
        },
      },
      {
        key: "right-coronary-artery",
        meshName: "Right coronary artery",
        offset: [-160, 40],
        label: { vi: "Động mạch vành phải", en: "Right Coronary Artery", zh: "右冠状动脉" },
        latinName: "Arteria coronaria dextra",
        note: {
          vi: "Tách ra từ xoang Valsalva phải, chạy trong rãnh vành bên phải — nuôi tâm nhĩ phải, phần lớn tâm thất phải, và ở đa số người còn cấp máu cho nút xoang nhĩ (máy tạo nhịp tự nhiên của tim).",
          en: "Branches off the right Valsalva sinus, running in the right coronary groove — supplying the right atrium, most of the right ventricle, and in most people also the sinoatrial node (the heart's natural pacemaker).",
          zh: "从主动脉右瓦氏窦发出，走行于右冠状沟内——供应右心房、右心室大部，在大多数人中还供应窦房结（心脏的天然起搏点）。",
        },
      },
      {
        key: "anterior-interventricular-artery",
        meshName: "Anterior interventricular artery",
        offset: [160, -40],
        label: { vi: "Động mạch liên thất trước", en: "Anterior Interventricular Artery", zh: "前室间支" },
        latinName: "Arteria interventricularis anterior",
        note: {
          vi: "Nhánh lớn nhất của động mạch vành trái, còn gọi là \"LAD\" trong lâm sàng — chạy dọc rãnh liên thất trước, nuôi phần lớn vách liên thất và thành trước thất trái. Tắc LAD (\"widow maker\") là dạng nhồi máu cơ tim nguy hiểm nhất do vùng cơ tim bị ảnh hưởng rất rộng.",
          en: "The largest branch of the left coronary artery, clinically known as the \"LAD\" — runs along the anterior interventricular groove, supplying most of the interventricular septum and the anterior wall of the left ventricle. LAD occlusion (the \"widow maker\") is the most dangerous type of heart attack because of the large area of muscle affected.",
          zh: "左冠状动脉最大的分支，临床上称为\"LAD\"——沿前室间沟走行，供应室间隔大部及左心室前壁。LAD阻塞（\"寡妇制造者\"）是最危险的心肌梗死类型，因受累心肌范围极广。",
        },
      },
      {
        key: "coronary-sinus",
        meshName: "Coronary sinus",
        offset: [160, 60],
        label: { vi: "Xoang vành", en: "Coronary Sinus", zh: "冠状窦" },
        latinName: "Sinus coronarius",
        note: {
          vi: "Tĩnh mạch lớn thu gom hầu hết máu tĩnh mạch từ cơ tim (qua các tĩnh mạch tim nhỏ hơn), đổ trực tiếp vào tâm nhĩ phải — đường dẫn chính đưa máu đã nuôi tim trở về vòng tuần hoàn.",
          en: "The large vein collecting most of the venous blood from the heart muscle (via smaller cardiac veins), draining directly into the right atrium — the main pathway returning blood that has nourished the heart back into circulation.",
          zh: "收集心肌大部分静脉血（经由较小的心静脉）的大静脉，直接汇入右心房——是滋养心脏后的血液返回循环的主要通路。",
        },
      },
    ],
  },
  "da-giac-willis": {
    slug: "da-giac-willis",
    title: {
      vi: "Đa giác Willis",
      en: "Circle of Willis",
      zh: "威利斯环",
    },
    description: {
      vi: "Vòng nối động mạch ở nền sọ, nơi 2 hệ thống cấp máu não (động mạch cảnh trong ở trước, hệ đốt sống-thân nền ở sau) nối thông với nhau qua các động mạch thông trước và thông sau. Cấu trúc vòng khép kín này là cơ chế \"dự phòng\" tự nhiên: nếu 1 nhánh bị tắc, máu vẫn có thể đến đủ vùng não nhờ đi vòng qua các nhánh còn lại — dù trên thực tế chỉ khoảng 1/3 dân số có vòng nối hoàn chỉnh đối xứng.",
      en: "The arterial ring at the base of the skull, where the brain's two blood supply systems (the internal carotid arteries in front, the vertebrobasilar system behind) connect via the anterior and posterior communicating arteries. This closed-loop structure is a natural \"backup\" mechanism: if one branch is blocked, blood can still reach the affected brain region by rerouting through the remaining branches — though in practice only about a third of people have a fully complete, symmetric ring.",
      zh: "位于颅底的动脉环，大脑的两套血供系统（前方的颈内动脉、后方的椎-基底动脉系统）在此经前、后交通动脉相互连通。这种闭环结构是一种天然的\"备用\"机制：若某一分支被阻塞，血液仍可绕行其余分支到达受影响的脑区——不过实际上只有约三分之一的人拥有完整对称的环状结构。",
    },
    visibleSystems: ["cardiovascular"],
    modelFile: "/models/circle_of_willis.glb",
    hotspots: [
      {
        key: "internal-carotid-artery",
        meshName: "Internal carotid artery.l",
        offset: [-150, 100],
        label: { vi: "Động mạch cảnh trong", en: "Internal Carotid Artery", zh: "颈内动脉" },
        latinName: "Arteria carotis interna",
        note: {
          vi: "Nguồn cấp máu chính cho não trước, đi từ cổ lên qua nền sọ mà không cho nhánh nào ở vùng cổ (khác động mạch cảnh ngoài nuôi mặt/da đầu) — vỡ hoặc bóc tách động mạch này là cấp cứu thần kinh nghiêm trọng.",
          en: "The main blood supply to the front of the brain, running from the neck up through the base of the skull without giving off any branches in the neck (unlike the external carotid, which supplies the face/scalp) — rupture or dissection of this artery is a serious neurological emergency.",
          zh: "大脑前部的主要血供来源，从颈部上行穿过颅底，途中不发出任何颈部分支（不同于供应面部/头皮的颈外动脉）——此动脉破裂或夹层是严重的神经系统急症。",
        },
      },
      {
        key: "anterior-cerebral-artery",
        meshName: "Anterior cerebral artery.l",
        offset: [0, -170],
        label: { vi: "Động mạch não trước", en: "Anterior Cerebral Artery", zh: "大脑前动脉" },
        latinName: "Arteria cerebri anterior",
        note: {
          vi: "Nuôi mặt trong 2 bán cầu đại não (vùng vận động/cảm giác chi dưới) — 2 động mạch não trước 2 bên nối với nhau qua động mạch thông trước ngay phía trước, khép kín phần trước của vòng Willis.",
          en: "Supplies the medial surface of both cerebral hemispheres (the motor/sensory region for the lower limbs) — the two anterior cerebral arteries connect to each other via the anterior communicating artery just in front, closing the front of the Circle of Willis.",
          zh: "供应双侧大脑半球内侧面（下肢的运动/感觉区域）——两条大脑前动脉经其前方的前交通动脉相互连接，闭合威利斯环的前部。",
        },
      },
      {
        key: "anterior-communicating-artery",
        meshName: "Anterior communicating artery",
        offset: [0, -100],
        label: { vi: "Động mạch thông trước", en: "Anterior Communicating Artery", zh: "前交通动脉" },
        latinName: "Arteria communicans anterior",
        note: {
          vi: "Đoạn nối ngắn giữa 2 động mạch não trước trái-phải, khép kín cạnh trước của vòng Willis — vị trí hay gặp nhất của phình mạch não (aneurysm) trong toàn bộ hệ động mạch não.",
          en: "The short connecting segment between the left and right anterior cerebral arteries, closing the front side of the Circle of Willis — the single most common site for cerebral aneurysms in the entire brain arterial system.",
          zh: "连接左右大脑前动脉的短小节段，闭合威利斯环的前侧——是整个脑动脉系统中脑动脉瘤最常见的发生部位。",
        },
      },
      {
        key: "posterior-communicating-artery",
        meshName: "Posterior communicating artery.l",
        offset: [-160, 20],
        label: { vi: "Động mạch thông sau", en: "Posterior Communicating Artery", zh: "后交通动脉" },
        latinName: "Arteria communicans posterior",
        note: {
          vi: "Nối động mạch cảnh trong với động mạch não sau ở mỗi bên — đây là mối nối giữa 2 hệ thống cấp máu não trước và sau, hoàn thiện vòng khép kín. Cũng là vị trí phình mạch phổ biến thứ 2.",
          en: "Connects the internal carotid artery to the posterior cerebral artery on each side — this is the junction between the anterior and posterior brain blood supply systems, completing the closed ring. Also the second most common aneurysm site.",
          zh: "在两侧分别连接颈内动脉与大脑后动脉——这是脑前、后血供系统之间的连接点，完成了这个闭合环。也是第二常见的动脉瘤发生部位。",
        },
      },
      {
        key: "posterior-cerebral-artery",
        meshName: "Posterior cerebral artery.l",
        offset: [160, -60],
        label: { vi: "Động mạch não sau", en: "Posterior Cerebral Artery", zh: "大脑后动脉" },
        latinName: "Arteria cerebri posterior",
        note: {
          vi: "Nuôi thuỳ chẩm (vỏ não thị giác) và mặt dưới thuỳ thái dương — tắc động mạch này gây mất thị trường 1 bên (hemianopia) chứ không yếu liệt như tắc động mạch não giữa.",
          en: "Supplies the occipital lobe (visual cortex) and the underside of the temporal lobe — occlusion causes a one-sided visual field loss (hemianopia) rather than the weakness seen with middle cerebral artery occlusion.",
          zh: "供应枕叶（视觉皮层）及颞叶下面——此动脉阻塞会导致单侧视野缺损（偏盲），而非大脑中动脉阻塞常见的肢体无力。",
        },
      },
      {
        key: "basilar-artery",
        meshName: "Basilar artery",
        offset: [40, 80],
        label: { vi: "Động mạch nền", en: "Basilar Artery", zh: "基底动脉" },
        latinName: "Arteria basilaris",
        note: {
          vi: "Hình thành từ sự hợp nhất của 2 động mạch đốt sống, chạy dọc mặt trước thân não — nuôi cầu não, tiểu não và tách đôi thành 2 động mạch não sau ở đỉnh. Tắc động mạch nền là cấp cứu thần kinh cực nặng (hội chứng \"khoá trong\" - locked-in syndrome).",
          en: "Formed by the merger of the two vertebral arteries, running along the front of the brainstem — supplies the pons and cerebellum, then splits into the two posterior cerebral arteries at its top. Basilar artery occlusion is a devastating neurological emergency (can cause locked-in syndrome).",
          zh: "由左右椎动脉汇合而成，沿脑干前面走行——供应脑桥与小脑，顶端分为左右大脑后动脉。基底动脉阻塞是极其严重的神经系统急症（可导致闭锁综合征）。",
        },
      },
      {
        key: "vertebral-artery",
        meshName: "Vertebral artery.l",
        offset: [-160, 150],
        label: { vi: "Động mạch đốt sống", en: "Vertebral Artery", zh: "椎动脉" },
        latinName: "Arteria vertebralis",
        note: {
          vi: "Tách ra từ động mạch dưới đòn, đi lên qua các lỗ mỏm ngang của 6 đốt sống cổ trên rồi chui vào hộp sọ — 2 động mạch đốt sống trái phải hợp lại thành động mạch nền, tạo nên nguồn cấp máu phía sau của não.",
          en: "Branches off the subclavian artery, ascending through the transverse foramina of the upper 6 cervical vertebrae before entering the skull — the left and right vertebral arteries merge to form the basilar artery, forming the brain's posterior blood supply.",
          zh: "从锁骨下动脉发出，向上穿经上6节颈椎的横突孔后进入颅腔——左右椎动脉汇合形成基底动脉，构成大脑的后部血供。",
        },
      },
    ],
  },
  "mat-cat-dong-mach": {
    slug: "mat-cat-dong-mach",
    title: {
      vi: "Mặt cắt động mạch chủ bụng",
      en: "Abdominal Aorta Cross Section",
      zh: "腹主动脉横切面",
    },
    description: {
      vi: "Một đoạn động mạch chủ bụng được cắt ngang để lộ khẩu kính lòng mạch. Lưu ý: dữ liệu nguồn thể hiện mạch máu dưới dạng ống trơn 1 lớp (không có 3 lớp thành mạch thật — nội mạc/áo giữa/áo ngoài), nên mặt cắt chỉ cho thấy hình dạng và khẩu kính, không phải cấu trúc mô học thành mạch.",
      en: "A segment of the abdominal aorta is sliced crosswise to reveal the vessel's lumen caliber. Note: the source data models blood vessels as a single smooth tube (not the true 3-layer wall — intima/media/adventitia), so this section shows shape and caliber only, not the histological wall structure.",
      zh: "腹主动脉的一段被横向切开，以展示血管管腔的口径。请注意：原始数据将血管建模为单层光滑管道（并非真实的3层管壁结构——内膜/中膜/外膜），因此此切面仅展示形状与口径，并非管壁的组织学结构。",
    },
    visibleSystems: ["cardiovascular"],
    modelFile: "/models/artery_section.glb",
    hotspots: [
      {
        key: "abdominal-aorta",
        meshName: "Abdominal aorta",
        offset: [130, 0],
        label: { vi: "Động mạch chủ bụng (mặt cắt)", en: "Abdominal Aorta (sectioned)", zh: "腹主动脉（切面）" },
        latinName: "Aorta abdominalis",
        note: {
          vi: "Đoạn tiếp theo của động mạch chủ ngực, đi từ cơ hoành xuống tới ngang đốt sống thắt lưng IV thì chia đôi thành 2 động mạch chậu chung — là mạch máu lớn nhất cơ thể, đường kính thật khoảng 2cm ở người trưởng thành. Phình động mạch chủ bụng (AAA) là bệnh lý mạch máu nguy hiểm thường gặp ở người lớn tuổi.",
          en: "The continuation of the thoracic aorta, running from the diaphragm down to about the level of the 4th lumbar vertebra, where it splits into the two common iliac arteries — the body's largest blood vessel, roughly 2cm in diameter in adults. Abdominal aortic aneurysm (AAA) is a common and dangerous vascular condition in older adults.",
          zh: "胸主动脉的延续，从膈肌下行至约第4腰椎水平，分为左右髂总动脉——是人体最大的血管，成人直径约2厘米。腹主动脉瘤（AAA）是老年人常见且危险的血管疾病。",
        },
      },
    ],
  },
  "mat-cat-tinh-mach": {
    slug: "mat-cat-tinh-mach",
    title: {
      vi: "Mặt cắt tĩnh mạch chủ dưới",
      en: "Inferior Vena Cava Cross Section",
      zh: "下腔静脉横切面",
    },
    description: {
      vi: "Một đoạn tĩnh mạch chủ dưới (phần bụng) được cắt ngang để lộ khẩu kính lòng mạch — cùng lưu ý về dữ liệu như scene động mạch chủ bụng: chỉ thể hiện hình dạng/khẩu kính, không có 3 lớp thành mạch thật.",
      en: "A segment of the inferior vena cava (abdominal part) is sliced crosswise to reveal the vessel's lumen caliber — the same data caveat as the abdominal aorta scene applies: shape/caliber only, not the true 3-layer wall.",
      zh: "下腔静脉（腹部段）的一段被横向切开，以展示血管管腔的口径——与腹主动脉切面场景相同的说明适用：仅展示形状/口径，并非真实的3层管壁结构。",
    },
    visibleSystems: ["cardiovascular"],
    modelFile: "/models/vein_section.glb",
    hotspots: [
      {
        key: "inferior-vena-cava",
        meshName: "Inferior vena cava (abdominal part)",
        offset: [130, 0],
        label: { vi: "Tĩnh mạch chủ dưới (mặt cắt)", en: "Inferior Vena Cava (sectioned)", zh: "下腔静脉（切面）" },
        latinName: "Vena cava inferior (pars abdominis)",
        note: {
          vi: "Tĩnh mạch lớn nhất cơ thể, thu gom máu từ toàn bộ nửa dưới cơ thể (chi dưới, tạng bụng-chậu) đổ về tâm nhĩ phải — nằm ngay bên phải động mạch chủ bụng, thành mỏng hơn nhiều so với động mạch cùng cỡ vì áp lực trong lòng mạch thấp hơn hẳn.",
          en: "The body's largest vein, collecting blood from the entire lower half of the body (lower limbs, abdominal-pelvic organs) and returning it to the right atrium — it lies just to the right of the abdominal aorta, with a much thinner wall than an artery of similar size because its internal pressure is far lower.",
          zh: "人体最大的静脉，收集来自全身下半身（下肢、腹盆腔器官）的血液并送回右心房——位于腹主动脉右侧，管壁比同等大小的动脉薄得多，因为其管腔内压力低得多。",
        },
      },
    ],
  },
};

export function getSceneModule(slug: string): SceneModule | undefined {
  return sceneModules[slug];
}

/**
 * Hotspot mặc định cho trang /viewer (toàn thân, hệ Nội tạng) — tách khỏi
 * Hotspots.tsx để dùng chung 1 nguồn dữ liệu duy nhất với các SceneModule.
 * "Liver" cố ý CHƯA đưa vào: trong glTF nó là node cha chứa 8 mesh phân
 * thùy con (không phải 1 mesh đơn) — Ẩn/Cô lập theo đúng nghĩa "cả lá gan"
 * cần xử lý riêng theo nhóm, để tạm ngoài danh sách thay vì gắn nửa vời.
 */
export const defaultViewerHotspots: SceneHotspot[] = [
  { key: "stomach", meshName: "Stomach", offset: [120, -70] },
  { key: "gallbladder", meshName: "Gallbladder", offset: [150, 0] },
  { key: "pancreas", meshName: "Pancreas", offset: [-20, 95] },
  { key: "kidney-l", meshName: "Kidney.l", offset: [-150, 45] },
  { key: "kidney-r", meshName: "Kidney.r", offset: [160, 55] },
  { key: "bladder", meshName: "Urinary bladder", offset: [10, 130] },
];
