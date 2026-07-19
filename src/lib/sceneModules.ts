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
  "giai-phau-so": {
    slug: "giai-phau-so",
    title: { vi: "Giải phẫu Sọ", en: "Skull Anatomy", zh: "颅骨解剖" },
    description: {
      vi: "Sọ gồm 2 phần: hộp sọ (8 xương bao quanh não) và khối xương mặt (14 xương). Các xương hộp sọ nối với nhau bằng khớp bất động gọi là đường khớp sọ (suture) — ở trẻ sơ sinh các khớp này còn hở (thóp) để hộp sọ giãn nở khi não phát triển, rồi cốt hóa dần và gần như liền hẳn ở tuổi trưởng thành.",
      en: "The skull has 2 parts: the cranial vault (8 bones surrounding the brain) and the facial skeleton (14 bones). The cranial bones are joined by immobile joints called sutures — in newborns these remain open (fontanelles) to let the skull expand as the brain grows, gradually ossifying until they are nearly fused in adulthood.",
      zh: "颅骨分为2部分：脑颅（8块骨包围大脑）和面颅（14块骨）。脑颅诸骨以不能活动的骨缝相连——新生儿骨缝尚未闭合（囟门），使颅骨能随脑发育而扩张，之后逐渐骨化，成年后几乎完全愈合。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/skull_anatomy.glb",
    hotspots: [
      {
        key: "frontal-bone",
        meshName: "Frontal bone",
        offset: [-140, -90],
        label: { vi: "Xương trán", en: "Frontal Bone", zh: "额骨" },
        latinName: "Os frontale",
        note: {
          vi: "Xương đơn tạo nên phần trán và trần hốc mắt — chứa xoang trán (khoang rỗng chứa khí) phía sau cung mày, giúp giảm trọng lượng hộp sọ và cộng hưởng âm giọng nói.",
          en: "A single bone forming the forehead and the roof of the eye sockets — contains the frontal sinus (an air-filled cavity) behind the brow ridge, which helps reduce skull weight and resonate the voice.",
          zh: "单块骨，构成前额及眼眶顶部——眉弓后方含额窦（充气空腔），有助于减轻颅骨重量并为发声共鸣。",
        },
      },
      {
        key: "parietal-l",
        meshName: "Parietal bone.l",
        offset: [-160, 0],
        label: { vi: "Xương đỉnh (trái)", en: "Parietal Bone (Left)", zh: "顶骨（左）" },
        latinName: "Os parietale",
        note: {
          vi: "Cặp xương lớn nhất hộp sọ, tạo nên phần đỉnh và bên đầu — nối với xương đối diện qua đường khớp dọc giữa (sagittal suture), mốc mổ thần kinh quan trọng.",
          en: "The largest pair of bones in the skull, forming the top and sides of the head — meets its counterpart at the midline sagittal suture, an important landmark in neurosurgery.",
          zh: "颅骨中最大的一对骨，构成头顶及两侧——在正中线经矢状缝与对侧顶骨相接，是神经外科手术的重要标志。",
        },
      },
      {
        key: "temporal-l",
        meshName: "Temporal bone.l",
        offset: [-170, 60],
        label: { vi: "Xương thái dương (trái)", en: "Temporal Bone (Left)", zh: "颞骨（左）" },
        latinName: "Os temporale",
        note: {
          vi: "Chứa cơ quan thính giác và tiền đình (tai trong) cùng chuỗi xương con — phần trai (squama) mỏng dễ vỡ khi chấn thương đầu ở vùng thái dương.",
          en: "Houses the organs of hearing and balance (inner ear) along with the auditory ossicles — its thin squamous part is prone to fracture in temporal head trauma.",
          zh: "内含听觉与前庭（内耳）器官及听小骨链——其鳞部薄弱，颞部头部外伤时容易骨折。",
        },
      },
      {
        key: "occipital-bone",
        meshName: "Occipital bone",
        offset: [0, 140],
        label: { vi: "Xương chẩm", en: "Occipital Bone", zh: "枕骨" },
        latinName: "Os occipitale",
        note: {
          vi: "Xương đơn ở đáy-sau hộp sọ, có lỗ lớn (foramen magnum) nơi tủy sống nối với hành não — 2 lồi cầu chẩm hai bên lỗ này khớp với đốt sống cổ Atlas (C1) tạo động tác gật đầu.",
          en: "A single bone at the back-base of the skull, containing the foramen magnum where the spinal cord connects to the medulla — the two occipital condyles beside this opening articulate with the Atlas (C1) vertebra, enabling the nodding motion of the head.",
          zh: "位于颅底后部的单块骨，含枕骨大孔，脊髓经此与延髓相连——孔两侧的枕髁与寰椎（C1）相关节，实现点头动作。",
        },
      },
      {
        key: "sphenoid-bone",
        meshName: "Sphenoid bone",
        offset: [130, -30],
        label: { vi: "Xương bướm", en: "Sphenoid Bone", zh: "蝶骨" },
        latinName: "Os sphenoidale",
        note: {
          vi: "Xương hình con bướm nằm giữa nền sọ, nối với hầu hết xương sọ khác — hố yên (sella turcica) ở giữa xương là nơi chứa tuyến yên (pituitary gland).",
          en: "A butterfly-shaped bone at the center of the skull base, articulating with nearly every other cranial bone — its central depression, the sella turcica, houses the pituitary gland.",
          zh: "位于颅底中央的蝶形骨，与几乎所有其他颅骨相连——其中央凹陷（蝶鞍）容纳垂体。",
        },
      },
      {
        key: "maxilla-l",
        meshName: "Maxilla.l",
        offset: [-130, 110],
        label: { vi: "Xương hàm trên (trái)", en: "Maxilla (Left)", zh: "上颌骨（左）" },
        latinName: "Maxilla",
        note: {
          vi: "Xương chính của khối mặt, chứa ổ răng hàm trên và xoang hàm (xoang cạnh mũi lớn nhất) — 2 xương hàm trên nối nhau tạo vòm miệng cứng.",
          en: "The main bone of the facial skeleton, containing the upper tooth sockets and the maxillary sinus (the largest paranasal sinus) — the two maxillae join to form the hard palate.",
          zh: "面颅的主要骨骼，容纳上颌牙槽及上颌窦（最大的鼻旁窦）——左右上颌骨相接构成硬腭。",
        },
      },
      {
        key: "mandible",
        meshName: "Mandible",
        offset: [40, 170],
        label: { vi: "Xương hàm dưới", en: "Mandible", zh: "下颌骨" },
        latinName: "Mandibula",
        note: {
          vi: "Xương duy nhất của sọ có thể cử động (khớp thái dương-hàm), cũng là xương mặt lớn và chắc nhất — chứa ổ răng hàm dưới, chịu lực nhai chính.",
          en: "The only movable bone of the skull (via the temporomandibular joint), and also the largest and strongest facial bone — contains the lower tooth sockets and bears the main chewing forces.",
          zh: "颅骨中唯一能活动的骨（经颞下颌关节），也是面颅中最大最坚固的骨——容纳下颌牙槽，承受主要咀嚼力。",
        },
      },
      {
        key: "zygomatic-l",
        meshName: "Zygomatic bone.l",
        offset: [-150, 140],
        label: { vi: "Xương gò má (trái)", en: "Zygomatic Bone (Left)", zh: "颧骨（左）" },
        latinName: "Os zygomaticum",
        note: {
          vi: "Tạo nên phần gò má nhô cao và thành ngoài hốc mắt — cùng mỏm gò má của xương thái dương tạo nên cung gò má (zygomatic arch), nơi bám của cơ nhai (masseter).",
          en: "Forms the prominent cheekbone and the lateral wall of the eye socket — together with the zygomatic process of the temporal bone it forms the zygomatic arch, where the masseter chewing muscle attaches.",
          zh: "构成突出的颧部及眼眶外侧壁——与颞骨颧突共同构成颧弓，是咬肌的附着处。",
        },
      },
      {
        key: "hyoid-bone",
        meshName: "Hyoid bone",
        offset: [10, 210],
        label: { vi: "Xương móng", en: "Hyoid Bone", zh: "舌骨" },
        latinName: "Os hyoideum",
        note: {
          vi: "Xương hình móng ngựa DUY NHẤT trong cơ thể không khớp trực tiếp với xương nào khác — treo lơ lửng ở cổ nhờ dây chằng và cơ, làm điểm tựa cho lưỡi, hầu và thanh quản khi nuốt/nói.",
          en: "A horseshoe-shaped bone — the ONLY bone in the body that doesn't directly articulate with any other bone — suspended in the neck by ligaments and muscles, serving as an anchor point for the tongue, pharynx, and larynx during swallowing and speech.",
          zh: "马蹄形骨——是人体唯一不与任何其他骨直接相关节的骨——借韧带与肌肉悬吊于颈部，是吞咽和发音时舌、咽、喉的支撑点。",
        },
      },
    ],
  },
  "xuong-con-tai-giua": {
    slug: "xuong-con-tai-giua",
    title: { vi: "Xương con Tai giữa", en: "Middle Ear Ossicles", zh: "中耳听小骨" },
    description: {
      vi: "3 xương nhỏ nhất cơ thể (dài 3-9mm), nằm trong tai giữa, khớp nối tiếp nhau thành 1 chuỗi dẫn truyền rung động từ màng nhĩ vào tai trong: xương búa (gắn màng nhĩ) → xương đe → xương bàn đạp (áp vào cửa sổ bầu dục). Cơ chế đòn bẩy này khuếch đại âm thanh khoảng 20 lần để bù cho sự khác biệt trở kháng giữa không khí và dịch tai trong.",
      en: "The 3 smallest bones in the body (3-9mm long), located in the middle ear, forming a jointed chain that conducts vibrations from the eardrum to the inner ear: malleus (attached to the eardrum) → incus → stapes (pressing into the oval window). This lever mechanism amplifies sound about 20-fold to compensate for the impedance mismatch between air and inner-ear fluid.",
      zh: "人体最小的3块骨（长3-9毫米），位于中耳，依次相连形成一条骨链，将振动从鼓膜传导至内耳：锤骨（连接鼓膜）→砧骨→镫骨（嵌入卵圆窗）。此杠杆机制将声音放大约20倍，以补偿空气与内耳液体之间的阻抗差异。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/ear_ossicles.glb",
    hotspots: [
      {
        key: "malleus-l",
        meshName: "Malleus.l",
        offset: [-130, -60],
        label: { vi: "Xương búa (trái)", en: "Malleus (Left)", zh: "锤骨（左）" },
        latinName: "Malleus",
        note: {
          vi: "Xương ngoài cùng của chuỗi, cán xương gắn chặt vào mặt trong màng nhĩ — rung động màng nhĩ truyền trực tiếp qua xương này đầu tiên.",
          en: "The outermost bone of the chain, its handle firmly attached to the inner surface of the eardrum — eardrum vibrations are transmitted through this bone first.",
          zh: "听小骨链最外侧的骨，其柄部紧贴鼓膜内面——鼓膜振动首先经此骨传导。",
        },
      },
      {
        key: "incus-l",
        meshName: "Incus.l",
        offset: [0, -100],
        label: { vi: "Xương đe (trái)", en: "Incus (Left)", zh: "砧骨（左）" },
        latinName: "Incus",
        note: {
          vi: "Xương ở giữa chuỗi, khớp với xương búa và xương bàn đạp — hình dạng giống răng hàm 2 chân, đóng vai trò cầu nối truyền lực.",
          en: "The middle bone of the chain, articulating with both the malleus and stapes — shaped like a two-rooted molar tooth, it serves as a force-transmitting bridge.",
          zh: "位于听小骨链中间，与锤骨及镫骨相关节——形似双根臼齿，是传力的桥梁。",
        },
      },
      {
        key: "stapes-l",
        meshName: "Stapes.l",
        offset: [130, -40],
        label: { vi: "Xương bàn đạp (trái)", en: "Stapes (Left)", zh: "镫骨（左）" },
        latinName: "Stapes",
        note: {
          vi: "Xương nhỏ nhất cơ thể, hình dạng giống bàn đạp yên ngựa — đế xương áp khít vào cửa sổ bầu dục của tai trong, biến rung động cơ học thành sóng trong dịch ốc tai.",
          en: "The smallest bone in the human body, shaped like a stirrup — its footplate fits snugly into the oval window of the inner ear, converting mechanical vibration into fluid waves within the cochlea.",
          zh: "人体最小的骨，形似马镫——其底板嵌入内耳卵圆窗，将机械振动转化为耳蜗液体中的波动。",
        },
      },
    ],
  },
  "cot-song": {
    slug: "cot-song",
    title: { vi: "Cột sống", en: "Vertebral Column", zh: "脊柱" },
    description: {
      vi: "Cột sống người trưởng thành gồm 26 xương: 7 đốt cổ (C1-C7), 12 đốt ngực (T1-T12, mỗi đốt khớp với 1 đôi xương sườn), 5 đốt thắt lưng (L1-L5, thân đốt lớn nhất vì chịu tải trọng lớn nhất), xương cùng (5 đốt cùng dính liền) và xương cụt (3-5 đốt thoái hoá dính liền). Nhìn nghiêng, cột sống có 4 đường cong sinh lý xen kẽ giúp hấp thu chấn động khi đi lại.",
      en: "The adult vertebral column has 26 bones: 7 cervical vertebrae (C1-C7), 12 thoracic vertebrae (T1-T12, each articulating with a pair of ribs), 5 lumbar vertebrae (L1-L5, with the largest vertebral bodies since they bear the greatest load), the sacrum (5 fused sacral vertebrae), and the coccyx (3-5 fused vestigial vertebrae). Viewed from the side, the spine has 4 alternating physiological curves that help absorb shock during movement.",
      zh: "成人脊柱由26块骨组成：7节颈椎（C1-C7）、12节胸椎（T1-T12，每节与一对肋骨相关节）、5节腰椎（L1-L5，椎体最大，因承受最大负荷）、骶骨（5节骶椎融合）及尾骨（3-5节退化椎体融合）。侧面观，脊柱有4个交替的生理弯曲，有助于行走时吸收震荡。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/vertebral_column.glb",
    hotspots: [
      {
        key: "atlas",
        meshName: "Atlas (C1)",
        offset: [-140, -180],
        label: { vi: "Đốt đội (C1)", en: "Atlas (C1)", zh: "寰椎 (C1)" },
        latinName: "Atlas",
        note: {
          vi: "Đốt sống cổ đầu tiên, không có thân đốt (hình vòng) — đỡ trực tiếp xương chẩm, cho phép động tác gật đầu (khớp chẩm-đội).",
          en: "The first cervical vertebra, lacking a vertebral body (ring-shaped) — directly supports the occipital bone, enabling the nodding motion (atlanto-occipital joint).",
          zh: "第一颈椎，无椎体（环状）——直接承托枕骨，实现点头动作（寰枕关节）。",
        },
      },
      {
        key: "axis",
        meshName: "Axis (C2)",
        offset: [-140, -130],
        label: { vi: "Đốt trục (C2)", en: "Axis (C2)", zh: "枢椎 (C2)" },
        latinName: "Axis",
        note: {
          vi: "Có mỏm răng (dens) nhô lên xuyên qua vòng đốt Atlas, tạo trục xoay cho khớp chẩm-đội — cho phép động tác lắc đầu sang 2 bên.",
          en: "Has an upward tooth-like projection (the dens/odontoid process) that passes through the ring of the atlas, forming a pivot for rotation — enabling side-to-side head-turning motion.",
          zh: "具有齿突，向上穿过寰椎环，形成旋转轴——实现头部左右转动。",
        },
      },
      {
        key: "vertebra-c7",
        meshName: "Vertebra C7",
        offset: [-150, -70],
        label: { vi: "Đốt sống cổ VII (C7)", en: "7th Cervical Vertebra (C7)", zh: "第7颈椎 (C7)" },
        latinName: "Vertebra prominens",
        note: {
          vi: "Gọi là 'đốt lồi' vì mỏm gai dài, sờ thấy rõ nhất dưới da gáy — mốc đếm đốt sống chuẩn khi khám lâm sàng.",
          en: "Called the 'vertebra prominens' because its long spinous process is the most palpable bump at the base of the neck — the standard landmark for counting vertebral levels in clinical exams.",
          zh: "因棘突长而突出，是颈根部皮下最易触及的骨性隆起，故称'隆椎'——临床检查中计数椎体节段的标准标志。",
        },
      },
      {
        key: "vertebra-t6",
        meshName: "Vertebra T6",
        offset: [140, -20],
        label: { vi: "Đốt sống ngực VI (T6)", en: "6th Thoracic Vertebra (T6)", zh: "第6胸椎 (T6)" },
        latinName: "Vertebra thoracica VI",
        note: {
          vi: "Đại diện vùng ngực — mỗi đốt ngực có 2 mặt khớp sườn (costal facet) trên thân đốt để khớp với đầu xương sườn tương ứng, đặc điểm riêng chỉ có ở vùng này.",
          en: "Representative of the thoracic region — each thoracic vertebra has costal facets on its body to articulate with the corresponding rib head, a feature unique to this region.",
          zh: "代表胸椎区域——每节胸椎椎体上有肋凹，与相应肋骨头相关节，此特征为胸椎区域所独有。",
        },
      },
      {
        key: "vertebra-l3",
        meshName: "Vertebra L3",
        offset: [140, 50],
        label: { vi: "Đốt sống thắt lưng III (L3)", en: "3rd Lumbar Vertebra (L3)", zh: "第3腰椎 (L3)" },
        latinName: "Vertebra lumbalis III",
        note: {
          vi: "Thân đốt to và chắc nhất cột sống, không có mặt khớp sườn hay lỗ ngang — vùng thắt lưng là nơi thoát vị đĩa đệm phổ biến nhất do chịu tải trọng lớn và biên độ vận động rộng.",
          en: "The largest and sturdiest vertebral body in the spine, lacking costal facets or transverse foramina — the lumbar region is the most common site of disc herniation due to its heavy load-bearing and wide range of motion.",
          zh: "脊柱中椎体最大最坚固，无肋凹或横突孔——腰段承重大、活动范围广，是椎间盘突出最常见的部位。",
        },
      },
      {
        key: "sacrum",
        meshName: "Sacrum",
        offset: [0, 150],
        label: { vi: "Xương cùng", en: "Sacrum", zh: "骶骨" },
        latinName: "Os sacrum",
        note: {
          vi: "5 đốt cùng dính liền thành 1 khối hình tam giác, nối cột sống với xương chậu qua khớp cùng-chậu (sacroiliac joint) — chịu toàn bộ trọng lượng phần trên cơ thể truyền xuống chi dưới.",
          en: "5 fused sacral vertebrae forming a single triangular bone, connecting the spine to the pelvis via the sacroiliac joint — bears the entire weight of the upper body transmitted down to the lower limbs.",
          zh: "5节骶椎融合为一块三角形骨，经骶髂关节将脊柱与骨盆相连——承担上半身全部重量并传递至下肢。",
        },
      },
      {
        key: "coccyx",
        meshName: "Coccyx",
        offset: [0, 210],
        label: { vi: "Xương cụt", en: "Coccyx", zh: "尾骨" },
        latinName: "Os coccygis",
        note: {
          vi: "3-5 đốt sống thoái hoá dính liền, di tích của đuôi tổ tiên linh trưởng — vẫn là điểm bám cho một số cơ và dây chằng sàn chậu.",
          en: "3-5 fused vestigial vertebrae, a remnant of the ancestral primate tail — still serves as an attachment point for several pelvic floor muscles and ligaments.",
          zh: "3-5节退化椎体融合而成，是灵长类祖先尾巴的残迹——仍是部分盆底肌肉和韧带的附着点。",
        },
      },
    ],
  },
  "long-nguc": {
    slug: "long-nguc",
    title: { vi: "Lồng ngực", en: "Thoracic Cage", zh: "胸廓" },
    description: {
      vi: "Lồng ngực gồm 12 đôi xương sườn, xương ức và 12 đốt sống ngực, tạo khoang bảo vệ tim-phổi và là bộ khung vận động cho hô hấp. 7 đôi sườn trên (sườn thật) nối trực tiếp với xương ức qua sụn sườn riêng; sườn 8-10 (sườn giả) nối gián tiếp qua sụn sườn 7; sườn 11-12 (sườn cụt/floating rib) không nối với xương ức, đầu trước tự do trong thành bụng.",
      en: "The thoracic cage consists of 12 pairs of ribs, the sternum, and 12 thoracic vertebrae, forming a protective cavity for the heart and lungs and a moving framework for breathing. The upper 7 pairs (true ribs) attach directly to the sternum via their own costal cartilage; ribs 8-10 (false ribs) attach indirectly via the 7th rib's cartilage; ribs 11-12 (floating ribs) don't attach to the sternum at all, their anterior ends free within the abdominal wall.",
      zh: "胸廓由12对肋骨、胸骨及12节胸椎构成，形成保护心肺的腔室，也是呼吸运动的骨性框架。上7对肋骨（真肋）经各自肋软骨直接连于胸骨；第8-10肋（假肋）经第7肋软骨间接相连；第11-12肋（浮肋）不与胸骨相连，前端游离于腹壁中。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/thoracic_cage.glb",
    hotspots: [
      {
        key: "manubrium",
        meshName: "Manubrium of sternum",
        offset: [0, -180],
        label: { vi: "Cán ức", en: "Manubrium of Sternum", zh: "胸骨柄" },
        latinName: "Manubrium sterni",
        note: {
          vi: "Phần trên cùng, dày nhất của xương ức — khớp với xương đòn 2 bên (khớp ức-đòn) và sụn sườn 1-2; bờ trên có khuyết trên ức (jugular notch), mốc sờ được ở hõm cổ.",
          en: "The uppermost, thickest part of the sternum — articulates with both clavicles (sternoclavicular joints) and the 1st-2nd costal cartilages; its upper border has the jugular notch, palpable at the base of the neck.",
          zh: "胸骨最上、最厚的部分——与两侧锁骨（胸锁关节）及第1-2肋软骨相关节；上缘有颈静脉切迹，为颈根部可触及的标志。",
        },
      },
      {
        key: "body-sternum",
        meshName: "Body of sternum",
        offset: [0, -100],
        label: { vi: "Thân ức", en: "Body of Sternum", zh: "胸骨体" },
        latinName: "Corpus sterni",
        note: {
          vi: "Phần dài nhất của xương ức, khớp với sụn sườn 2-7 — vị trí ép tim ngoài lồng ngực (CPR) chuẩn là nửa dưới thân ức.",
          en: "The longest part of the sternum, articulating with the 2nd-7th costal cartilages — the standard hand-placement site for chest compressions (CPR) is the lower half of the sternal body.",
          zh: "胸骨最长部分，与第2-7肋软骨相关节——心肺复苏（CPR）胸外按压的标准部位为胸骨体下半部。",
        },
      },
      {
        key: "xiphoid",
        meshName: "Xiphoid process",
        offset: [0, -20],
        label: { vi: "Mỏm mũi kiếm", en: "Xiphoid Process", zh: "剑突" },
        latinName: "Processus xiphoideus",
        note: {
          vi: "Phần nhỏ nhất, thấp nhất của xương ức, còn là sụn ở người trẻ và cốt hoá dần theo tuổi — mốc giải phẫu xác định góc dưới ức trong khám bụng.",
          en: "The smallest, lowest part of the sternum, cartilaginous in young people and gradually ossifying with age — an anatomical landmark marking the inferior sternal angle in abdominal examination.",
          zh: "胸骨最小、最低的部分，青年时为软骨，随年龄逐渐骨化——腹部检查中确定胸骨下角的解剖标志。",
        },
      },
      {
        key: "first-rib-l",
        meshName: "First rib.l",
        offset: [-160, -140],
        label: { vi: "Xương sườn I (trái)", en: "1st Rib (Left)", zh: "第1肋（左）" },
        latinName: "Costa I",
        note: {
          vi: "Ngắn nhất, cong nhất và nằm ngang nhất trong 12 đôi sườn — bờ trên có rãnh cho động mạch dưới đòn đi qua, dễ bị chèn ép trong hội chứng lối thoát ngực (thoracic outlet syndrome).",
          en: "The shortest, most curved, and most horizontal of the 12 rib pairs — its upper surface has a groove for the subclavian artery, which can become compressed in thoracic outlet syndrome.",
          zh: "12对肋骨中最短、弯曲度最大、最水平的一根——上面有沟容纳锁骨下动脉，胸廓出口综合征时易受压迫。",
        },
      },
      {
        key: "twelfth-rib-l",
        meshName: "Twelfth rib.l",
        offset: [-160, 140],
        label: { vi: "Xương sườn XII (trái)", en: "12th Rib (Left)", zh: "第12肋（左）" },
        latinName: "Costa XII",
        note: {
          vi: "Sườn cụt (floating rib) — đầu sau khớp với đốt sống T12 nhưng đầu trước tự do, không nối sụn với xương ức, chỉ gắn vào cơ thành bụng.",
          en: "A floating rib — its posterior end articulates with the T12 vertebra but the anterior end is free, with no cartilage connection to the sternum, attaching only to the abdominal wall muscles.",
          zh: "浮肋——后端与T12椎体相关节，但前端游离，不经软骨连于胸骨，仅附着于腹壁肌肉。",
        },
      },
    ],
  },
  "xuong-chau": {
    slug: "xuong-chau",
    title: { vi: "Xương chậu", en: "Pelvis Anatomy", zh: "骨盆解剖" },
    description: {
      vi: "Khung chậu gồm 2 xương chậu (hip bone, mỗi bên là 3 xương Chậu-Ngồi-Mu dính liền hoàn toàn từ tuổi trưởng thành nên xuất hiện như 1 mesh liền khối), xương cùng và xương cụt — nối nhau qua khớp cùng-chậu (gần bất động) và khớp mu (sụn sợi). Khung chậu nữ rộng và nông hơn nam (thích nghi sinh sản), là điểm khác biệt xương rõ rệt nhất giữa 2 giới trong toàn bộ hệ xương.",
      en: "The pelvic girdle consists of 2 hip bones (each formed by the ilium, ischium, and pubis, fully fused into a single mass by adulthood — hence appearing as one continuous mesh), the sacrum, and the coccyx — joined via the nearly immobile sacroiliac joints and the fibrocartilaginous pubic symphysis. The female pelvis is wider and shallower than the male's (an adaptation for childbirth), the most distinct skeletal difference between the sexes in the entire skeleton.",
      zh: "骨盆由2块髋骨（每侧由髂骨、坐骨、耻骨成年后完全融合，故呈现为单一整体网格）、骶骨及尾骨组成——经近乎不动的骶髂关节及耻骨联合（纤维软骨）相连。女性骨盆比男性更宽更浅（适应分娩），是整个骨骼系统中两性差异最明显的骨骼结构。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/pelvis_anatomy.glb",
    hotspots: [
      {
        key: "hip-bone-l",
        meshName: "Hip bone.l",
        offset: [-150, 0],
        label: { vi: "Xương chậu (trái)", en: "Hip Bone (Left)", zh: "髋骨（左）" },
        latinName: "Os coxae",
        note: {
          vi: "Khối xương lớn gồm 3 phần dính liền: cánh chậu (phía trên, rộng), ngồi (phía dưới-sau, chịu lực khi ngồi) và mu (phía trước-dưới) — ổ cối (acetabulum) ở giao điểm 3 xương khớp với chỏm xương đùi tạo khớp háng.",
          en: "A large bone formed by 3 fused parts: the ilium (upper, wide part), ischium (lower-posterior, bears weight when sitting), and pubis (lower-anterior) — the acetabulum at their junction articulates with the femoral head to form the hip joint.",
          zh: "由3部分融合而成的大骨：髂骨（上部，宽阔）、坐骨（下后部，坐位时承重）及耻骨（下前部）——三骨交界处的髋臼与股骨头相关节，构成髋关节。",
        },
      },
      {
        key: "sacrum-pelvis",
        meshName: "Sacrum",
        offset: [0, -110],
        label: { vi: "Xương cùng", en: "Sacrum", zh: "骶骨" },
        latinName: "Os sacrum",
        note: {
          vi: "Đỉnh tam giác của khung chậu, khớp với 2 xương chậu qua khớp cùng-chậu — đường kính khung chậu qua eo trên (pelvic inlet) là số đo quan trọng trong sản khoa để tiên lượng sinh thường.",
          en: "The triangular apex of the pelvic girdle, articulating with both hip bones via the sacroiliac joints — the pelvic inlet diameter is an important obstetric measurement for predicting the feasibility of vaginal delivery.",
          zh: "骨盆的三角形顶点，经骶髂关节与两侧髋骨相关节——骨盆入口径线是产科预测能否顺产的重要测量指标。",
        },
      },
      {
        key: "coccyx-pelvis",
        meshName: "Coccyx",
        offset: [0, 130],
        label: { vi: "Xương cụt", en: "Coccyx", zh: "尾骨" },
        latinName: "Os coccygis",
        note: {
          vi: "Đầu dưới cùng của khung chậu, có thể lệch ra sau trong lúc sinh để mở rộng đường ra của thai nhi rồi trở lại vị trí cũ.",
          en: "The lowest tip of the pelvic girdle, which can flex posteriorly during childbirth to widen the fetal exit pathway before returning to its original position.",
          zh: "骨盆最下端，分娩时可向后活动以扩大胎儿娩出通道，产后恢复原位。",
        },
      },
    ],
  },
  "dai-vai-chi-tren": {
    slug: "dai-vai-chi-tren",
    title: { vi: "Đai vai và Chi trên", en: "Shoulder Girdle and Upper Limb", zh: "肩带与上肢骨" },
    description: {
      vi: "Đai vai (xương đòn + xương bả vai) nối chi trên với thân mình — không khớp trực tiếp với cột sống, chỉ treo bằng cơ, cho phép biên độ vận động cánh tay rộng nhất trong mọi khớp cơ thể (đánh đổi bằng độ vững kém, dễ trật khớp vai). Xương cánh tay (humerus), 2 xương cẳng tay (radius/ulna) hoàn thiện chuỗi động học từ vai tới cổ tay.",
      en: "The shoulder girdle (clavicle + scapula) connects the upper limb to the trunk — it doesn't articulate directly with the spine, being suspended only by muscles, which gives the shoulder the widest range of motion of any joint in the body (traded off for lower stability and a higher risk of dislocation). The humerus and the two forearm bones (radius and ulna) complete the kinematic chain from shoulder to wrist.",
      zh: "肩带（锁骨+肩胛骨）连接上肢与躯干——不与脊柱直接相关节，仅靠肌肉悬吊，因而肩关节的活动范围是全身关节中最大的（代价是稳定性较差，易脱位）。肱骨及前臂两骨（桡骨、尺骨）完成从肩部到腕部的运动链。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/shoulder_upper_limb.glb",
    hotspots: [
      {
        key: "clavicle-l",
        meshName: "Clavicle.l",
        offset: [-150, -140],
        label: { vi: "Xương đòn (trái)", en: "Clavicle (Left)", zh: "锁骨（左）" },
        latinName: "Clavicula",
        note: {
          vi: "Xương duy nhất nằm ngang nối chi trên với khung xương trục (qua khớp ức-đòn) — xương dài dễ gãy nhất cơ thể, thường gãy khi ngã chống tay hoặc va đập vai.",
          en: "The only horizontal bone connecting the upper limb to the axial skeleton (via the sternoclavicular joint) — the most commonly fractured long bone in the body, typically breaking from a fall onto an outstretched hand or a direct blow to the shoulder.",
          zh: "唯一以水平方向连接上肢与中轴骨骼的骨（经胸锁关节）——是全身最常骨折的长骨，常因跌倒手撑地或肩部直接撞击而骨折。",
        },
      },
      {
        key: "scapula-l",
        meshName: "Scapula.l",
        offset: [-170, -60],
        label: { vi: "Xương bả vai (trái)", en: "Scapula (Left)", zh: "肩胛骨（左）" },
        latinName: "Scapula",
        note: {
          vi: "Xương phẳng hình tam giác trượt tự do trên thành ngực sau (chỉ giữ bởi cơ, không khớp xương-xương với sườn) — ổ chảo (glenoid cavity) nông khớp với chỏm xương cánh tay, tạo khớp vai linh hoạt nhưng kém vững.",
          en: "A flat, triangular bone that glides freely over the posterior chest wall (held only by muscles, with no bone-to-bone joint with the ribs) — its shallow glenoid cavity articulates with the humeral head, forming a highly mobile but inherently unstable shoulder joint.",
          zh: "扁平三角形骨，可在胸廓后壁自由滑动（仅靠肌肉固定，与肋骨无骨性连接）——其浅凹的关节盂与肱骨头相关节，构成灵活但欠稳定的肩关节。",
        },
      },
      {
        key: "humerus-l",
        meshName: "Humerus.l",
        offset: [-140, 40],
        label: { vi: "Xương cánh tay (trái)", en: "Humerus (Left)", zh: "肱骨（左）" },
        latinName: "Humerus",
        note: {
          vi: "Xương dài nhất và lớn nhất chi trên — chỏm hình cầu khớp với ổ chảo xương bả vai; đầu dưới khớp với cả xương quay lẫn xương trụ tại khớp khuỷu.",
          en: "The longest and largest bone of the upper limb — its rounded head articulates with the scapula's glenoid cavity; its lower end articulates with both the radius and ulna at the elbow joint.",
          zh: "上肢最长最大的骨——球形肱骨头与肩胛骨关节盂相关节；下端在肘关节处同时与桡骨、尺骨相关节。",
        },
      },
      {
        key: "radius-l",
        meshName: "Radius.l",
        offset: [-160, 120],
        label: { vi: "Xương quay (trái)", en: "Radius (Left)", zh: "桡骨（左）" },
        latinName: "Radius",
        note: {
          vi: "Xương cẳng tay phía ngoài (bên ngón cái) — xoay quanh xương trụ khi sấp/ngửa bàn tay (pronation/supination), động tác đặc trưng của cẳng tay người.",
          en: "The lateral (thumb-side) forearm bone — it rotates around the ulna during pronation and supination of the hand, a movement characteristic of the human forearm.",
          zh: "前臂外侧（拇指侧）骨——手部旋前/旋后时绕尺骨转动，是人类前臂特有的动作。",
        },
      },
      {
        key: "ulna-l",
        meshName: "Ulna.l",
        offset: [-100, 150],
        label: { vi: "Xương trụ (trái)", en: "Ulna (Left)", zh: "尺骨（左）" },
        latinName: "Ulna",
        note: {
          vi: "Xương cẳng tay phía trong (bên ngón út), dài hơn và ổn định hơn xương quay — mỏm khuỷu (olecranon) ở đầu trên tạo nên điểm nhô ra sờ thấy ở khuỷu tay, là nơi bám của cơ tam đầu.",
          en: "The medial (little-finger-side) forearm bone, longer and more stable than the radius — its upper olecranon process forms the palpable bony point of the elbow, serving as the attachment site for the triceps muscle.",
          zh: "前臂内侧（小指侧）骨，比桡骨更长更稳定——上端的鹰嘴突形成肘部可触及的骨性突起，是肱三头肌的附着处。",
        },
      },
    ],
  },
  "ban-tay": {
    slug: "ban-tay",
    title: { vi: "Xương Bàn tay", en: "Hand Bones", zh: "手骨" },
    description: {
      vi: "Mỗi bàn tay có 27 xương chia 3 nhóm: 8 xương cổ tay (carpal, xếp 2 hàng) tạo nền linh hoạt cho cổ tay; 5 xương bàn tay (metacarpal) tạo lòng bàn tay; 14 đốt ngón tay (phalanx) — ngón cái chỉ có 2 đốt (gốc+xa), 4 ngón còn lại mỗi ngón 3 đốt (gốc+giữa+xa). Số lượng xương nhỏ dày đặc này cho phép độ khéo léo vận động tinh vi nhất cơ thể.",
      en: "Each hand has 27 bones in 3 groups: 8 carpal bones (arranged in two rows) forming a flexible wrist base; 5 metacarpal bones forming the palm; 14 phalanges — the thumb has only 2 phalanges (proximal + distal), while the other 4 fingers each have 3 (proximal + middle + distal). This dense cluster of small bones enables the finest fine-motor dexterity in the human body.",
      zh: "每只手有27块骨，分3组：8块腕骨（排成两行）构成灵活的腕部基础；5块掌骨构成手掌；14节指骨——拇指仅2节（近节+远节），其余4指各3节（近节、中节、远节）。这密集的小骨群赋予人手全身最精细的运动灵巧性。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/hand_bones.glb",
    hotspots: [
      {
        key: "scaphoid-l",
        meshName: "Scaphoid bone.l",
        offset: [-150, -80],
        label: { vi: "Xương thuyền (trái)", en: "Scaphoid Bone (Left)", zh: "舟状骨（左）" },
        latinName: "Os scaphoideum",
        note: {
          vi: "Xương cổ tay lớn nhất hàng gần, bắc cầu giữa 2 hàng xương cổ tay — xương cổ tay dễ gãy nhất khi ngã chống bàn tay, nguy cơ hoại tử vô mạch cao vì mạch máu nuôi đi vào từ 1 đầu duy nhất.",
          en: "The largest carpal bone in the proximal row, bridging the two carpal rows — the most commonly fractured carpal bone in falls onto an outstretched hand, with a high risk of avascular necrosis since its blood supply enters from only one end.",
          zh: "近排腕骨中最大者，连接两排腕骨——跌倒手撑地时最常骨折的腕骨，因血供仅从一端进入，缺血性坏死风险较高。",
        },
      },
      {
        key: "third-metacarpal-l",
        meshName: "Third metacarpal bone.l",
        offset: [-120, 0],
        label: { vi: "Xương bàn tay III (trái)", en: "3rd Metacarpal Bone (Left)", zh: "第3掌骨（左）" },
        latinName: "Os metacarpale III",
        note: {
          vi: "Xương bàn tay dài nhất và ở vị trí trung tâm nhất, thẳng hàng với xương cổ tay Capitate — mốc giải phẫu chuẩn khi đo trục bàn tay.",
          en: "The longest metacarpal bone and the most centrally located, aligning with the capitate bone — the standard anatomical landmark for measuring the hand's axis.",
          zh: "最长且位置最居中的掌骨，与头状骨对齐——测量手部轴线的标准解剖标志。",
        },
      },
      {
        key: "thumb-proximal-l",
        meshName: "Proximal phalanx of first finger of hand.l",
        offset: [-170, 90],
        label: { vi: "Đốt gốc ngón cái (trái)", en: "Proximal Phalanx of Thumb (Left)", zh: "拇指近节指骨（左）" },
        latinName: "Phalanx proximalis pollicis",
        note: {
          vi: "Ngón cái chỉ có 2 đốt (thiếu đốt giữa so với 4 ngón còn lại) nhưng bù lại có khớp yên ngựa (saddle joint) ở gốc, cho phép đối ngón (opposition) — khả năng vận động độc nhất giúp bàn tay người cầm nắm chính xác.",
          en: "The thumb has only 2 phalanges (lacking the middle phalanx present in the other 4 fingers) but compensates with a saddle joint at its base, enabling opposition — a unique movement that gives the human hand precise grasping ability.",
          zh: "拇指仅有2节指骨（比其余4指少1节中节），但其基部具有鞍状关节，可实现拇指对掌——这一独特运动能力使人手能精确抓握。",
        },
      },
      {
        key: "middle-finger-distal-l",
        meshName: "Distal phalanx of third finger of hand.l",
        offset: [0, -160],
        label: { vi: "Đốt xa ngón giữa (trái)", en: "Distal Phalanx of Middle Finger (Left)", zh: "中指远节指骨（左）" },
        latinName: "Phalanx distalis digiti tertii",
        note: {
          vi: "Đốt ngón dài nhất trong bàn tay (ngón giữa dài nhất) — đầu xa hình móng ngựa nâng đỡ móng tay và các cấu trúc mô mềm đầu ngón (pulp).",
          en: "Part of the longest finger in the hand (the middle finger) — its horseshoe-shaped distal end supports the fingernail and the soft-tissue fingertip pulp.",
          zh: "属于手中最长的手指（中指）——远端呈马蹄形，支撑指甲及指尖软组织（指腹）。",
        },
      },
    ],
  },
  "chi-duoi": {
    slug: "chi-duoi",
    title: { vi: "Xương Chi dưới", en: "Lower Limb Bones", zh: "下肢骨" },
    description: {
      vi: "4 xương chính của chi dưới tự do: xương đùi (femur, xương dài và chắc nhất cơ thể), xương bánh chè (patella, xương vừng lớn nhất, nằm trong gân cơ tứ đầu đùi), xương chày (tibia, chịu lực chính) và xương mác (fibula, mảnh, chủ yếu làm điểm bám cơ chứ không chịu lực chính). Khác chi trên (ưu tiên linh hoạt), chi dưới ưu tiên độ vững chắc để chịu toàn bộ trọng lượng cơ thể khi đứng/đi.",
      en: "The 4 main bones of the free lower limb: the femur (the body's longest and strongest bone), the patella (the largest sesamoid bone, embedded in the quadriceps tendon), the tibia (bearing most of the load), and the fibula (slender, mainly a muscle attachment site rather than a major weight-bearer). Unlike the upper limb (which prioritizes mobility), the lower limb prioritizes stability to bear the body's full weight during standing and walking.",
      zh: "游离下肢的4块主要骨：股骨（人体最长最坚固的骨）、髌骨（最大的籽骨，嵌于股四头肌腱内）、胫骨（主要承重）及腓骨（细长，主要为肌肉附着点而非主要承重骨）。与上肢（优先灵活性）不同，下肢优先稳固性，以承受站立、行走时的全身重量。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/lower_limb_bones.glb",
    hotspots: [
      {
        key: "femur-l",
        meshName: "Femur.l",
        offset: [-140, -60],
        label: { vi: "Xương đùi (trái)", en: "Femur (Left)", zh: "股骨（左）" },
        latinName: "Femur",
        note: {
          vi: "Xương dài và chắc nhất cơ thể, chỏm hình cầu khớp với ổ cối xương chậu tạo khớp háng — có thể chịu lực nén gấp nhiều lần trọng lượng cơ thể khi chạy nhảy.",
          en: "The longest and strongest bone in the body, with a spherical head that articulates with the pelvic acetabulum to form the hip joint — capable of withstanding compressive forces many times body weight during running and jumping.",
          zh: "人体最长最坚固的骨，球形股骨头与髋臼相关节构成髋关节——跑跳时能承受数倍体重的压力。",
        },
      },
      {
        key: "patella-l",
        meshName: "Patella.l",
        offset: [-150, 20],
        label: { vi: "Xương bánh chè (trái)", en: "Patella (Left)", zh: "髌骨（左）" },
        latinName: "Patella",
        note: {
          vi: "Xương vừng (sesamoid bone) lớn nhất cơ thể, nằm trong gân cơ tứ đầu đùi — tăng hiệu quả đòn bẩy khi duỗi gối bằng cách nâng khoảng cách gân với trục xoay khớp.",
          en: "The largest sesamoid bone in the body, embedded within the quadriceps tendon — it increases lever efficiency during knee extension by raising the tendon's distance from the joint's axis of rotation.",
          zh: "人体最大的籽骨，嵌于股四头肌腱内——通过增大肌腱与关节旋转轴的距离，提高伸膝时的杠杆效率。",
        },
      },
      {
        key: "tibia-l",
        meshName: "Tibia.l",
        offset: [-140, 110],
        label: { vi: "Xương chày (trái)", en: "Tibia (Left)", zh: "胫骨（左）" },
        latinName: "Tibia",
        note: {
          vi: "Xương chịu lực chính của cẳng chân (khoảng 85% trọng lượng truyền qua) — mào chày (bờ trước sắc) sờ thấy rõ dưới da, vị trí hay bị va đập đau.",
          en: "The primary weight-bearing bone of the lower leg (carrying about 85% of the transmitted load) — its anterior border (the tibial crest, or 'shin') is sharply palpable under the skin, a common site of painful bumps.",
          zh: "小腿主要承重骨（约承担85%的传导重量）——胫骨前缘（胫骨嵴）皮下清晰可触，是常见的磕碰疼痛部位。",
        },
      },
      {
        key: "fibula-l",
        meshName: "Fibula.l",
        offset: [-90, 140],
        label: { vi: "Xương mác (trái)", en: "Fibula (Left)", zh: "腓骨（左）" },
        latinName: "Fibula",
        note: {
          vi: "Xương mảnh phía ngoài cẳng chân, chịu chưa tới 15% trọng lượng — chức năng chính là điểm bám cơ và tạo mắt cá ngoài (lateral malleolus) giữ vững khớp cổ chân.",
          en: "A slender bone on the lateral side of the lower leg, bearing less than 15% of the load — its main functions are as a muscle attachment site and forming the lateral malleolus, which stabilizes the ankle joint.",
          zh: "小腿外侧的细长骨，承重不足15%——主要功能是肌肉附着及构成外踝，稳定踝关节。",
        },
      },
    ],
  },
  "ban-chan": {
    slug: "ban-chan",
    title: { vi: "Xương Bàn chân", en: "Foot Bones", zh: "足骨" },
    description: {
      vi: "Mỗi bàn chân có 26 xương chia 3 nhóm: 7 xương cổ chân (tarsal — xương sên chịu toàn bộ trọng lượng từ cẳng chân, xương gót lớn nhất là điểm tựa khi đứng), 5 xương bàn chân (metatarsal) và 14 đốt ngón chân (phalanx, cấu trúc giống bàn tay nhưng ngắn hơn nhiều vì ưu tiên chịu lực hơn là khéo léo). Các xương này xếp thành 3 vòm dọc-ngang giúp phân tán lực và tạo hiệu ứng lò xo khi đi/chạy.",
      en: "Each foot has 26 bones in 3 groups: 7 tarsal bones (the talus bears the entire load transmitted from the leg; the calcaneus, the largest tarsal bone, is the main weight-bearing point when standing), 5 metatarsal bones, and 14 phalanges (structured like the hand's but much shorter, prioritizing load-bearing over dexterity). These bones are arranged into 3 longitudinal-transverse arches that help distribute force and create a spring-like effect during walking and running.",
      zh: "每只脚有26块骨，分3组：7块跗骨（距骨承接来自小腿的全部重量；跟骨是最大的跗骨，是站立时的主要承重点）、5块跖骨及14节趾骨（结构类似手指骨但短得多，因优先承重而非灵巧）。这些骨排列成3个纵横足弓，有助于分散力量并在行走、跑步时产生弹簧效应。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/foot_bones.glb",
    hotspots: [
      {
        key: "talus-l",
        meshName: "Talus.l",
        offset: [-150, -70],
        label: { vi: "Xương sên (trái)", en: "Talus (Left)", zh: "距骨（左）" },
        latinName: "Talus",
        note: {
          vi: "Xương duy nhất ở bàn chân không có cơ nào bám trực tiếp — nhận toàn bộ trọng lượng từ xương chày qua khớp cổ chân rồi phân phối xuống xương gót và phần trước bàn chân.",
          en: "The only foot bone with no muscles directly attached to it — receives the entire load from the tibia through the ankle joint, then distributes it down to the calcaneus and forefoot.",
          zh: "足部唯一没有肌肉直接附着的骨——经踝关节承接胫骨传来的全部重量，再分配至跟骨及前足。",
        },
      },
      {
        key: "calcaneus-l",
        meshName: "Calcaneus.l",
        offset: [-160, 0],
        label: { vi: "Xương gót (trái)", en: "Calcaneus (Left)", zh: "跟骨（左）" },
        latinName: "Calcaneus",
        note: {
          vi: "Xương lớn nhất và chắc nhất bàn chân, tạo nên gót chân — điểm bám của gân gót (gân Achilles), gân lớn nhất và khoẻ nhất cơ thể.",
          en: "The largest and sturdiest bone of the foot, forming the heel — the attachment site for the Achilles tendon, the largest and strongest tendon in the body.",
          zh: "足部最大最坚固的骨，构成足跟——跟腱（人体最大最强壮的肌腱）的附着处。",
        },
      },
      {
        key: "navicular-l",
        meshName: "Navicular bone.l",
        offset: [-150, 60],
        label: { vi: "Xương ghe (trái)", en: "Navicular Bone (Left)", zh: "舟骨（左）" },
        latinName: "Os naviculare",
        note: {
          vi: "Nằm ở đỉnh vòm dọc trong bàn chân, khớp với xương sên phía sau và 3 xương chêm phía trước — vị trí then chốt duy trì độ cong vòm bàn chân.",
          en: "Located at the apex of the medial longitudinal arch, articulating with the talus posteriorly and the three cuneiform bones anteriorly — a key position for maintaining the foot arch's curvature.",
          zh: "位于足内侧纵弓顶点，后与距骨、前与三块楔骨相关节——是维持足弓弧度的关键位置。",
        },
      },
      {
        key: "first-metatarsal-l",
        meshName: "First metatarsal bone.l",
        offset: [-100, 130],
        label: { vi: "Xương bàn chân I (trái)", en: "1st Metatarsal Bone (Left)", zh: "第1跖骨（左）" },
        latinName: "Os metatarsale I",
        note: {
          vi: "Ngắn và to nhất trong 5 xương bàn chân, chịu lực nhiều nhất khi đẩy người về trước lúc đi/chạy — đầu xa hay bị lệch trong bệnh ngón chân cái vẹo ngoài (hallux valgus/bunion).",
          en: "The shortest and thickest of the 5 metatarsal bones, bearing the most load during the push-off phase of walking and running — its distal end is commonly deviated in hallux valgus (bunion).",
          zh: "5块跖骨中最短最粗，行走、跑步蹬地阶段承受最大力量——远端在拇外翻（大脚趾囊肿）中常发生偏移。",
        },
      },
      {
        key: "big-toe-proximal-l",
        meshName: "Proximal phalanx of first finger of foot.l",
        offset: [0, 170],
        label: { vi: "Đốt gốc ngón cái chân (trái)", en: "Proximal Phalanx of Big Toe (Left)", zh: "拇趾近节趾骨（左）" },
        latinName: "Phalanx proximalis hallucis",
        note: {
          vi: "Giống ngón tay cái, ngón chân cái chỉ có 2 đốt (thiếu đốt giữa) — nhưng khác ngón tay cái, ngón chân cái KHÔNG có khả năng đối ngón, chỉ hỗ trợ giữ thăng bằng và đẩy người khi bước.",
          en: "Like the thumb, the big toe has only 2 phalanges (lacking a middle phalanx) — but unlike the thumb, the big toe has no opposition capability, serving only to aid balance and propulsion during walking.",
          zh: "与拇指相似，拇趾仅有2节趾骨（缺中节）——但与拇指不同，拇趾不具备对掌能力，仅辅助平衡及步行推进。",
        },
      },
    ],
  },
  "bo-rang": {
    slug: "bo-rang",
    title: { vi: "Bộ răng", en: "Dentition", zh: "牙列" },
    description: {
      vi: "Người trưởng thành có 32 răng vĩnh viễn chia đều 4 hàm góc (mỗi góc 8 răng: 2 cửa, 1 nanh, 2 tiền hàm, 3 hàm) — công thức răng đối xứng 2 bên trên cả hàm trên và hàm dưới. Mỗi loại răng có hình dạng chuyên biệt theo chức năng: răng cửa cắt, răng nanh xé, răng hàm (tiền hàm+hàm) nghiền — thể hiện rõ tính ăn tạp (omnivore) của loài người.",
      en: "Adults have 32 permanent teeth divided evenly among 4 dental quadrants (8 teeth each: 2 incisors, 1 canine, 2 premolars, 3 molars) — a bilaterally symmetric dental formula in both the upper and lower jaws. Each tooth type has a shape specialized for its function: incisors for cutting, canines for tearing, and molars (premolars + molars) for grinding — clearly reflecting humans' omnivorous diet.",
      zh: "成人有32颗恒牙，均匀分布于4个牙区（每区8颗：2颗切牙、1颗尖牙、2颗前磨牙、3颗磨牙）——上下颌左右对称的牙式。每种牙齿形态各异，功能专一：切牙用于切割，尖牙用于撕裂，磨牙（前磨牙+磨牙）用于研磨——清楚体现人类杂食性的饮食特点。",
    },
    visibleSystems: ["skeletal"],
    modelFile: "/models/dentition.glb",
    hotspots: [
      {
        key: "upper-medial-incisor-l",
        meshName: "Upper medial incisor.l",
        offset: [-100, -140],
        label: { vi: "Răng cửa giữa hàm trên (trái)", en: "Upper Medial Incisor (Left)", zh: "上颌中切牙（左）" },
        latinName: "Dens incisivus medialis",
        note: {
          vi: "Răng ở vị trí trung tâm nhất cung hàm trên, cạnh cắt mỏng sắc — răng cửa vĩnh viễn thường mọc sớm nhất trong bộ răng vĩnh viễn (khoảng 6-7 tuổi).",
          en: "The most centrally positioned tooth in the upper dental arch, with a thin, sharp cutting edge — permanent incisors are typically the first permanent teeth to erupt (around age 6-7).",
          zh: "位于上颌牙弓最中央的牙齿，切缘薄而锋利——恒切牙通常是恒牙列中最早萌出的牙齿（约6-7岁）。",
        },
      },
      {
        key: "upper-canine-l",
        meshName: "Upper canine.l",
        offset: [-150, -60],
        label: { vi: "Răng nanh hàm trên (trái)", en: "Upper Canine (Left)", zh: "上颌尖牙（左）" },
        latinName: "Dens caninus",
        note: {
          vi: "Răng có chân dài nhất trong toàn bộ răng, thân răng nhọn 1 múi — vị trí góc cung hàm, chịu lực xé thức ăn và là điểm tựa quan trọng khi hàm di chuyển sang bên.",
          en: "Has the longest root of any tooth, with a single pointed cusp on the crown — positioned at the corner of the dental arch, it bears the force of tearing food and serves as a key guide during lateral jaw movement.",
          zh: "牙根为全口牙齿中最长者，牙冠呈单尖锥形——位于牙弓转角处，承受撕裂食物的力量，也是下颌侧方运动的重要引导。",
        },
      },
      {
        key: "upper-first-premolar-l",
        meshName: "Upper first premolar.l",
        offset: [-150, 30],
        label: { vi: "Răng tiền hàm I hàm trên (trái)", en: "Upper 1st Premolar (Left)", zh: "上颌第一前磨牙（左）" },
        latinName: "Dens premolaris I",
        note: {
          vi: "Có 2 múi (buccal+lingual), thường có 2 chân răng riêng biệt ở hàm trên (khác hàm dưới chỉ 1 chân) — vị trí trung gian bắt đầu chức năng nghiền giữa răng nanh và răng hàm lớn.",
          en: "Has 2 cusps (buccal and lingual), typically with 2 separate roots in the upper jaw (unlike the lower premolar, which usually has just 1) — an intermediate tooth beginning the grinding function between the canine and molars.",
          zh: "具2个牙尖（颊尖+舌尖），上颌者常有2个独立牙根（下颌前磨牙则多为单根）——是位于尖牙与磨牙之间、开始承担研磨功能的过渡性牙齿。",
        },
      },
      {
        key: "upper-first-molar-l",
        meshName: "Upper first molar tooth.l",
        offset: [-130, 100],
        label: { vi: "Răng hàm lớn I hàm trên (trái)", en: "Upper 1st Molar (Left)", zh: "上颌第一磨牙（左）" },
        latinName: "Dens molaris I",
        note: {
          vi: "Răng lớn nhất và có diện tích mặt nhai rộng nhất trong bộ răng, thường 3 chân ở hàm trên — mọc lúc khoảng 6 tuổi, KHÔNG thay răng sữa (răng vĩnh viễn 'mọc thêm' phía sau cung hàm sữa) nên hay bị bỏ sót chăm sóc.",
          en: "The largest tooth with the widest chewing surface in the dentition, typically with 3 roots in the upper jaw — erupts around age 6 and does NOT replace a baby tooth (it 'adds on' behind the primary dental arch), which is why it's often overlooked in dental care.",
          zh: "牙列中体积最大、咬合面最宽的牙齿，上颌者通常为3根——约6岁萌出，且不替换乳牙（是在乳牙列后方'新增'的恒牙），因而常被忽视口腔护理。",
        },
      },
      {
        key: "mandible-teeth",
        meshName: "Mandible",
        offset: [0, 180],
        label: { vi: "Xương hàm dưới", en: "Mandible", zh: "下颌骨" },
        latinName: "Mandibula",
        note: {
          vi: "16 răng hàm dưới cắm vào ổ răng của xương hàm dưới — khác hàm trên (cố định vào sọ), xương hàm dưới di động qua khớp thái dương-hàm, thực hiện động tác cắn-nghiền.",
          en: "The 16 lower teeth are anchored in the tooth sockets of the mandible — unlike the maxilla (fixed to the skull), the mandible is mobile via the temporomandibular joint, performing the biting and grinding motions.",
          zh: "16颗下颌牙嵌入下颌骨牙槽——与固定于颅骨的上颌骨不同，下颌骨经颞下颌关节可活动，完成咬合与研磨动作。",
        },
      },
    ],
  },
  "co-mat": {
    slug: "co-mat",
    title: { vi: "Cơ Mặt", en: "Facial Muscles", zh: "面部肌肉" },
    description: {
      vi: "Khác với cơ xương thường (2 đầu bám vào 2 xương), phần lớn cơ mặt bám 1 đầu vào xương và đầu kia đan vào lớp da — co cơ trực tiếp làm da di chuyển, tạo nên biểu cảm khuôn mặt. Đây là điểm đặc trưng riêng của cơ mặt so với mọi nhóm cơ khác trong cơ thể, đồng thời giải thích vì sao liệt dây thần kinh mặt (dây VII) làm mất biểu cảm rõ rệt dù xương và khớp hoàn toàn bình thường.",
      en: "Unlike typical skeletal muscles (which attach to 2 bones), most facial muscles attach at one end to bone and the other end weaves into the skin — their contraction directly moves the skin, producing facial expression. This is unique to facial muscles among all muscle groups in the body, and explains why facial nerve (cranial nerve VII) palsy causes such visible loss of expression even though the bones and joints remain completely normal.",
      zh: "与典型骨骼肌（两端附着于两块骨）不同，大多数面部肌肉一端附着于骨，另一端编织进皮肤——收缩时直接牵动皮肤，产生面部表情。这是面部肌肉区别于全身其他肌群的独特之处，也解释了为何面神经（第七对脑神经）麻痹会导致表情明显丧失，即使骨骼和关节完全正常。",
    },
    visibleSystems: ["muscular"],
    modelFile: "/models/facial_muscles.glb",
    hotspots: [
      {
        key: "frontalis",
        meshName: "Frontalis muscle.l",
        offset: [-140, -160],
        label: { vi: "Cơ trán", en: "Frontalis Muscle", zh: "额肌" },
        latinName: "Musculus frontalis",
        note: {
          vi: "Kéo da đầu và lông mày lên trên, tạo nếp nhăn ngang trán — cùng cơ chẩm (occipitalis) phía sau đầu tạo thành cơ chẩm-trán (occipitofrontalis), nối nhau qua 1 dải gân rộng (galea aponeurotica) phủ đỉnh đầu.",
          en: "Raises the scalp and eyebrows, creating horizontal forehead wrinkles — together with the occipitalis muscle at the back of the head, it forms the occipitofrontalis muscle, connected by a broad tendinous sheet (galea aponeurotica) covering the top of the skull.",
          zh: "上提头皮和眉毛，产生额部横纹——与头后部的枕肌共同构成枕额肌，两者经覆盖颅顶的帽状腱膜相连。",
        },
      },
      {
        key: "orbicularis-oculi",
        meshName: "Orbital part of orbicularis oculi.l",
        offset: [-160, -90],
        label: { vi: "Cơ vòng mắt", en: "Orbicularis Oculi", zh: "眼轮匝肌" },
        latinName: "Musculus orbicularis oculi",
        note: {
          vi: "Cơ hình vòng bao quanh hốc mắt, chức năng nhắm mắt — phần hốc mắt (orbital) co mạnh khi nhắm chặt/nheo mắt, phần mi mắt (palpebral) co nhẹ khi chớp mắt bình thường.",
          en: "A ring-shaped muscle encircling the eye socket, responsible for closing the eyelids — its orbital part contracts strongly for tight squinting/closing, while its palpebral part contracts gently during normal blinking.",
          zh: "环绕眼眶的环形肌，负责闭眼——眶部强力收缩时用力闭眼/眯眼，睑部轻度收缩完成正常眨眼。",
        },
      },
      {
        key: "orbicularis-oris",
        meshName: "Orbicularis oris muscle.l",
        offset: [-150, 40],
        label: { vi: "Cơ vòng môi", en: "Orbicularis Oris", zh: "口轮匝肌" },
        latinName: "Musculus orbicularis oris",
        note: {
          vi: "Cơ hình vòng bao quanh miệng, đóng kín môi và tạo hình miệng khi phát âm — được gọi là 'cơ hôn' vì cũng là cơ chính khi chu môi/mím môi; hầu hết các cơ mặt khác đều bám tận vào cơ này.",
          en: "A ring-shaped muscle encircling the mouth, closing the lips and shaping the mouth during speech — nicknamed the 'kissing muscle' since it's also the primary muscle for puckering/pursing the lips; most other facial muscles insert into it.",
          zh: "环绕口部的环形肌，闭合口唇并在发音时塑造口型——因也是撅嘴/抿唇的主要肌肉而被称为'接吻肌'；大多数其他面部肌肉都止于此肌。",
        },
      },
      {
        key: "zygomaticus-major",
        meshName: "Zygomaticus major muscle.l",
        offset: [-170, 90],
        label: { vi: "Cơ gò má lớn", en: "Zygomaticus Major", zh: "颧大肌" },
        latinName: "Musculus zygomaticus major",
        note: {
          vi: "Kéo khoé miệng lên trên-ra ngoài, cơ chính tạo nụ cười — xuất phát từ xương gò má, bám tận vào khoé miệng.",
          en: "Pulls the corner of the mouth upward and outward, the primary muscle producing a smile — originates from the zygomatic bone and inserts at the corner of the mouth.",
          zh: "将嘴角向上外方牵拉，是产生微笑的主要肌肉——起自颧骨，止于口角。",
        },
      },
      {
        key: "platysma",
        meshName: "Platysma.l",
        offset: [0, 180],
        label: { vi: "Cơ bám da cổ", en: "Platysma", zh: "颈阔肌" },
        latinName: "Musculus platysma",
        note: {
          vi: "Tấm cơ mỏng, rộng phủ toàn bộ mặt trước-bên cổ, kéo dài từ xương hàm dưới xuống vùng ngực trên — co cơ làm căng da cổ, tham gia biểu cảm sợ hãi/căng thẳng; là cơ nông nhất vùng cổ, thường bị chọc kim xuyên qua đầu tiên khi tiêm dưới da vùng này.",
          en: "A thin, broad sheet of muscle covering the entire front-lateral neck, extending from the mandible down to the upper chest — its contraction tenses the neck skin, contributing to expressions of fear or strain; it's the most superficial muscle of the neck, typically the first layer pierced during subcutaneous injections in this region.",
          zh: "覆盖整个颈前外侧的薄而宽的肌片，从下颌骨延伸至胸上部——收缩时绷紧颈部皮肤，参与恐惧、紧张等表情；是颈部最浅层的肌肉，此区域皮下注射时通常首先穿过此肌。",
        },
      },
      {
        key: "masseter-context",
        meshName: "Mandible",
        offset: [0, 240],
        label: { vi: "Xương hàm dưới (nền)", en: "Mandible (context)", zh: "下颌骨（背景）" },
        latinName: "Mandibula",
        note: {
          vi: "Xương nền cho thấy điểm bám của các cơ mặt vùng dưới (Platysma, Depressor anguli oris, Mentalis...) — không phải cơ, chỉ hiển thị làm mốc tham chiếu vị trí.",
          en: "The underlying bone showing the attachment points of the lower facial muscles (Platysma, Depressor anguli oris, Mentalis...) — not a muscle itself, shown only as a positional reference landmark.",
          zh: "作为背景骨骼，显示下部面部肌肉（颈阔肌、口角降肌、颏肌等）的附着点——本身并非肌肉，仅作为位置参照标志显示。",
        },
      },
    ],
  },
  "co-dui-mong": {
    slug: "co-dui-mong",
    title: { vi: "Cơ Đùi và Mông", en: "Thigh and Gluteal Muscles", zh: "大腿与臀部肌肉" },
    description: {
      vi: "Nhóm cơ lớn và khoẻ nhất cơ thể, chia 3 khoang chức năng: khoang trước (cơ tứ đầu đùi — 4 cơ hợp lại thành gân bánh chè, duỗi gối), khoang sau (nhóm gân kheo — gấp gối, duỗi háng) và khoang trong (nhóm cơ khép — khép đùi vào giữa). Cơ mông lớn (gluteus maximus) là cơ đơn lẻ nặng nhất cơ thể, đặc trưng riêng của loài người do dáng đi thẳng đứng 2 chân.",
      en: "The largest and strongest muscle group in the body, divided into 3 functional compartments: anterior (the quadriceps — 4 muscles merging into the patellar tendon, extending the knee), posterior (the hamstrings — flexing the knee, extending the hip), and medial (the adductor group — pulling the thigh toward the midline). The gluteus maximus is the single heaviest muscle in the human body, a feature unique to humans due to upright bipedal walking.",
      zh: "人体最大最强壮的肌群，分为3个功能间室：前群（股四头肌——4块肌肉汇合成髌韧带，伸膝）、后群（腘绳肌群——屈膝、伸髋）及内侧群（内收肌群——将大腿向中线内收）。臀大肌是人体单块肌肉中最重的一块，是人类因直立双足行走而特有的特征。",
    },
    visibleSystems: ["muscular", "skeletal"],
    modelFile: "/models/thigh_gluteal_muscles.glb",
    hotspots: [
      {
        key: "gluteus-maximus",
        meshName: "Gluteus maximus muscle.l",
        offset: [-160, -100],
        label: { vi: "Cơ mông lớn", en: "Gluteus Maximus", zh: "臀大肌" },
        latinName: "Musculus gluteus maximus",
        note: {
          vi: "Cơ đơn lẻ nặng và lớn nhất cơ thể — chức năng chính là duỗi và xoay ngoài khớp háng, đặc biệt quan trọng khi leo cầu thang/đứng dậy từ tư thế ngồi. Vị trí tiêm bắp an toàn (góc phần tư trên-ngoài) để tránh dây thần kinh toạ đi ngay bên dưới.",
          en: "The single heaviest and largest muscle in the body — its main function is extending and externally rotating the hip, especially important when climbing stairs or rising from a seated position. Its upper-outer quadrant is a common safe intramuscular injection site, chosen to avoid the sciatic nerve running just beneath.",
          zh: "人体单块肌肉中最重最大者——主要功能是伸髋及髋关节外旋，在爬楼梯或从坐姿站起时尤为重要。其外上象限是常用的安全肌肉注射部位，以避开其深面走行的坐骨神经。",
        },
      },
      {
        key: "rectus-femoris",
        meshName: "Rectus femoris muscle.l",
        offset: [-160, -20],
        label: { vi: "Cơ thẳng đùi", en: "Rectus Femoris", zh: "股直肌" },
        latinName: "Musculus rectus femoris",
        note: {
          vi: "Duy nhất trong 4 đầu cơ tứ đầu đùi bắc qua CẢ khớp háng lẫn khớp gối (biarticular) — vừa gấp háng vừa duỗi gối, nên dễ căng cơ khi thực hiện động tác sút bóng (kết hợp cả 2 chuyển động cùng lúc).",
          en: "The only one of the 4 quadriceps heads that crosses BOTH the hip and knee joints (biarticular) — it both flexes the hip and extends the knee, making it prone to strain during kicking motions that combine both movements simultaneously.",
          zh: "是股四头肌4个头中唯一同时跨越髋、膝两个关节者（双关节肌）——既屈髋又伸膝，因此在踢球等同时结合两种动作的动作中容易拉伤。",
        },
      },
      {
        key: "vastus-lateralis",
        meshName: "Vastus lateralis muscle.l",
        offset: [-170, 40],
        label: { vi: "Cơ rộng ngoài", en: "Vastus Lateralis", zh: "股外侧肌" },
        latinName: "Musculus vastus lateralis",
        note: {
          vi: "Đầu lớn nhất trong 4 đầu cơ tứ đầu đùi — vị trí tiêm bắp ưu tiên ở trẻ sơ sinh/nhũ nhi vì cơ mông chưa phát triển đủ dày.",
          en: "The largest of the 4 quadriceps heads — the preferred intramuscular injection site in newborns and infants since the gluteal muscles are not yet sufficiently developed.",
          zh: "股四头肌4个头中最大者——因新生儿及婴儿臀肌尚未充分发育，是其首选的肌肉注射部位。",
        },
      },
      {
        key: "biceps-femoris",
        meshName: "Long head of biceps femoris.l",
        offset: [160, -60],
        label: { vi: "Cơ nhị đầu đùi (đầu dài)", en: "Biceps Femoris (Long Head)", zh: "股二头肌（长头）" },
        latinName: "Musculus biceps femoris caput longum",
        note: {
          vi: "1 trong 3 cơ nhóm gân kheo (hamstrings) ở khoang sau đùi — nhóm cơ hay bị căng/rách nhất khi chạy nước rút do phải giảm tốc đột ngột chân đang duỗi mạnh về trước.",
          en: "One of the 3 hamstring muscles in the posterior thigh compartment — this muscle group is the most commonly strained/torn during sprinting, due to the sudden deceleration required while the leg is swinging forcefully forward.",
          zh: "大腿后间室腘绳肌群3块肌肉之一——冲刺跑时因需在腿部强力前摆时骤然减速，此肌群是最常拉伤/撕裂的肌群。",
        },
      },
      {
        key: "adductor-longus",
        meshName: "Adductor longus.l",
        offset: [90, 60],
        label: { vi: "Cơ khép dài", en: "Adductor Longus", zh: "长收肌" },
        latinName: "Musculus adductor longus",
        note: {
          vi: "Cơ nông nhất trong nhóm cơ khép đùi, dễ sờ thấy gân ở bẹn khi khép đùi có kháng lực — chấn thương 'căng cơ háng' (groin strain) phổ biến ở vận động viên bóng đá thường liên quan cơ này.",
          en: "The most superficial muscle of the adductor group, its tendon easily palpable in the groin during resisted thigh adduction — the common 'groin strain' injury in soccer players frequently involves this muscle.",
          zh: "内收肌群中最浅表的一块，抗阻内收大腿时腱部易在腹股沟触及——足球运动员常见的'腹股沟拉伤'多与此肌相关。",
        },
      },
      {
        key: "iliacus",
        meshName: "Iliacus muscle.l",
        offset: [90, -140],
        label: { vi: "Cơ chậu", en: "Iliacus", zh: "髂肌" },
        latinName: "Musculus iliacus",
        note: {
          vi: "Cùng cơ thắt lưng lớn (psoas major) hợp thành cơ thắt lưng-chậu (iliopsoas) — cơ gấp háng mạnh nhất cơ thể, quan trọng khi bước đi (đưa chân về trước) và ngồi dậy từ tư thế nằm.",
          en: "Together with the psoas major, it forms the iliopsoas muscle — the strongest hip flexor in the body, essential for walking (swinging the leg forward) and sitting up from a lying position.",
          zh: "与腰大肌共同构成髂腰肌——是人体最强的屈髋肌，对行走（腿部前摆）及从卧位坐起至关重要。",
        },
      },
    ],
  },
  "co-canh-tay": {
    slug: "co-canh-tay",
    title: { vi: "Cơ Cánh tay", en: "Arm Muscles", zh: "上臂肌肉" },
    description: {
      vi: "Cánh tay chia 2 khoang đối lập chức năng: khoang trước (cơ nhị đầu, cơ cánh tay, cơ quạ-cánh tay — gấp khuỷu) và khoang sau (cơ tam đầu — duỗi khuỷu, cơ DUY NHẤT ở mặt sau cánh tay). Cơ nhị đầu có 2 đầu (dài+ngắn) và cơ tam đầu có 3 đầu (dài+ngoài+trong) — số lượng 'đầu' phản ánh số điểm bám gốc khác nhau trên xương bả vai/cánh tay, hội tụ về 1 gân bám tận chung.",
      en: "The arm is divided into 2 functionally opposing compartments: anterior (biceps brachii, brachialis, coracobrachialis — flexing the elbow) and posterior (triceps brachii — extending the elbow, the ONLY muscle on the back of the arm). The biceps has 2 heads (long+short) and the triceps has 3 heads (long+lateral+medial) — the number of 'heads' reflects distinct origin points on the scapula/humerus that converge into a single shared insertion tendon.",
      zh: "上臂分为2个功能相对的间室：前间室（肱二头肌、肱肌、喙肱肌——屈肘）与后间室（肱三头肌——伸肘，是上臂后面唯一的肌肉）。肱二头肌有2个头（长头+短头），肱三头肌有3个头（长头+外侧头+内侧头）——'头'的数量反映了在肩胛骨/肱骨上不同的起点，最终汇聚成共同的止点腱。",
    },
    visibleSystems: ["muscular", "skeletal"],
    modelFile: "/models/arm_muscles.glb",
    hotspots: [
      {
        key: "biceps-long-head",
        meshName: "Long head of biceps brachii.l",
        offset: [-160, -80],
        label: { vi: "Cơ nhị đầu (đầu dài)", en: "Biceps Brachii (Long Head)", zh: "肱二头肌（长头）" },
        latinName: "Musculus biceps brachii caput longum",
        note: {
          vi: "Gân đầu dài luồn qua rãnh gian củ xương cánh tay rồi vào trong khớp vai để bám vào ổ chảo — đường đi bất thường (đi xuyên bao khớp) khiến gân này dễ viêm/đứt do ma sát lặp lại.",
          en: "The long head's tendon runs through the intertubercular groove of the humerus and enters the shoulder joint to attach at the glenoid — this unusual path (passing through the joint capsule) makes the tendon prone to inflammation or rupture from repetitive friction.",
          zh: "长头肌腱经肱骨结节间沟进入肩关节，止于关节盂——这一特殊走行（穿过关节囊）使该肌腱因反复摩擦而易发炎或断裂。",
        },
      },
      {
        key: "brachialis",
        meshName: "Brachialis muscle.l",
        offset: [-170, 20],
        label: { vi: "Cơ cánh tay", en: "Brachialis", zh: "肱肌" },
        latinName: "Musculus brachialis",
        note: {
          vi: "Nằm sâu dưới cơ nhị đầu, là cơ gấp khuỷu MẠNH NHẤT (khoẻ hơn cả nhị đầu) vì bám trực tiếp vào xương trụ (không qua khớp xoay như nhị đầu) — hoạt động bất kể tư thế sấp/ngửa cẳng tay.",
          en: "Lying deep to the biceps, it is the STRONGEST elbow flexor (stronger than the biceps itself) because it attaches directly to the ulna (not through a rotating joint like the biceps) — it works regardless of forearm pronation or supination.",
          zh: "位于肱二头肌深面，是屈肘力量最强的肌肉（强于肱二头肌本身），因其直接止于尺骨（不像肱二头肌需经旋转关节）——无论前臂处于旋前或旋后位均能发挥作用。",
        },
      },
      {
        key: "triceps-long-head",
        meshName: "Long head of triceps brachii.l",
        offset: [160, -40],
        label: { vi: "Cơ tam đầu (đầu dài)", en: "Triceps Brachii (Long Head)", zh: "肱三头肌（长头）" },
        latinName: "Musculus triceps brachii caput longum",
        note: {
          vi: "Đầu duy nhất trong 3 đầu tam đầu bắc qua khớp vai (2 đầu còn lại chỉ bắc qua khuỷu) — vừa hỗ trợ duỗi khuỷu vừa hỗ trợ khép/duỗi vai.",
          en: "The only one of the 3 triceps heads that crosses the shoulder joint (the other 2 heads cross only the elbow) — it assists both elbow extension and shoulder adduction/extension.",
          zh: "肱三头肌3个头中唯一跨越肩关节者（另外2个头仅跨越肘关节）——既辅助伸肘，也辅助肩关节内收/后伸。",
        },
      },
      {
        key: "coracobrachialis",
        meshName: "Coracobrachialis muscle.l",
        offset: [-150, 90],
        label: { vi: "Cơ quạ-cánh tay", en: "Coracobrachialis", zh: "喙肱肌" },
        latinName: "Musculus coracobrachialis",
        note: {
          vi: "Cơ nhỏ và ngắn nhất trong khoang trước, xuất phát từ mỏm quạ xương bả vai — thường bị xuyên thủng bởi dây thần kinh cơ-bì (musculocutaneous nerve), mốc phẫu thuật quan trọng khi tiếp cận vùng nách.",
          en: "The smallest and shortest muscle of the anterior compartment, originating from the coracoid process of the scapula — it is typically pierced by the musculocutaneous nerve, an important surgical landmark when accessing the axillary region.",
          zh: "前间室中最小最短的肌肉，起自肩胛骨喙突——通常被肌皮神经穿过，是腋区手术入路的重要标志。",
        },
      },
    ],
  },
  "co-bung": {
    slug: "co-bung",
    title: { vi: "Cơ Thành bụng trước-bên", en: "Abdominal Wall Muscles", zh: "腹前外侧壁肌肉" },
    description: {
      vi: "Thành bụng trước-bên gồm 5 lớp cơ xếp theo hướng sợi khác nhau (giống gỗ dán nhiều lớp): cơ thẳng bụng (dọc, ở giữa), rồi 3 lớp cơ dẹt xếp chồng mỗi bên (chéo ngoài, chéo trong, ngang bụng) với hướng sợi chéo nhau — cấu trúc đa lớp chéo hướng này tạo ra thành bụng vừa chắc vừa linh hoạt, chịu được áp lực ổ bụng khi ho/rặn mà vẫn cho phép gập/xoay thân mình.",
      en: "The anterolateral abdominal wall consists of 5 layers of muscle arranged with differing fiber directions (like plywood): the rectus abdominis (vertical, at the midline), then 3 stacked flat muscles on each side (external oblique, internal oblique, transversus abdominis) with crisscrossing fiber orientations — this multi-layered crisscross structure creates a wall that is both strong and flexible, able to withstand rises in intra-abdominal pressure during coughing or straining while still allowing trunk flexion and rotation.",
      zh: "腹前外侧壁由5层肌肉组成，各层纤维方向不同（如同多层胶合板）：腹直肌（居中，纵向），再加两侧各3层扁肌叠加（腹外斜肌、腹内斜肌、腹横肌），纤维方向相互交错——这种多层交错结构使腹壁既坚固又灵活，既能承受咳嗽、用力时腹内压升高，又能保证躯干屈曲与旋转。",
    },
    visibleSystems: ["muscular"],
    modelFile: "/models/abdominal_wall_muscles.glb",
    hotspots: [
      {
        key: "rectus-abdominis",
        meshName: "Rectus abdominis muscle.l",
        offset: [-100, -60],
        label: { vi: "Cơ thẳng bụng", en: "Rectus Abdominis", zh: "腹直肌" },
        latinName: "Musculus rectus abdominis",
        note: {
          vi: "Cặp cơ dài chạy dọc 2 bên đường trắng giữa bụng, bị ngăn cách bởi 3-4 dải gân ngang (tendinous intersections) tạo hình 'múi bụng' (six-pack) khi phát triển và ít mỡ che phủ.",
          en: "A pair of long muscles running vertically on either side of the linea alba, interrupted by 3-4 transverse tendinous intersections that create the visible 'six-pack' appearance when well-developed and covered by little fat.",
          zh: "沿腹白线两侧纵向走行的一对长肌，被3-4条腱划横向分隔，发达且脂肪覆盖较少时呈现可见的'六块腹肌'外观。",
        },
      },
      {
        key: "external-oblique",
        meshName: "External abdominal oblique muscle.l",
        offset: [-170, 30],
        label: { vi: "Cơ chéo bụng ngoài", en: "External Abdominal Oblique", zh: "腹外斜肌" },
        latinName: "Musculus obliquus externus abdominis",
        note: {
          vi: "Lớp cơ NÔNG NHẤT trong 3 lớp cơ dẹt, sợi cơ chạy chếch xuống-vào-trong (hướng như 'tay đút túi quần trước') — bờ dưới cuộn lại tạo dây chằng bẹn (inguinal ligament), mốc giải phẫu quan trọng vùng bẹn.",
          en: "The MOST SUPERFICIAL of the 3 flat muscle layers, its fibers running diagonally downward-and-inward (like hands going into front pockets) — its lower border folds back to form the inguinal ligament, an important anatomical landmark in the groin.",
          zh: "3层扁肌中最浅表者，肌纤维斜向内下走行（如同双手插入前口袋的方向）——下缘卷折形成腹股沟韧带，是腹股沟区重要的解剖标志。",
        },
      },
      {
        key: "internal-oblique",
        meshName: "Internal abdominal oblique muscle.l",
        offset: [140, 0],
        label: { vi: "Cơ chéo bụng trong", en: "Internal Abdominal Oblique", zh: "腹内斜肌" },
        latinName: "Musculus obliquus internus abdominis",
        note: {
          vi: "Lớp giữa, sợi cơ chạy chếch theo hướng NGƯỢC với cơ chéo ngoài (lên-vào-trong) — sự đan chéo giữa 2 lớp chéo ngoài/trong (giống chữ X) là cơ chế chính giúp thành bụng chống xoay và chịu lực đa hướng.",
          en: "The middle layer, its fibers running diagonally in the OPPOSITE direction to the external oblique (upward-and-inward) — the crisscrossing of the external and internal oblique layers (forming an X pattern) is the main mechanism giving the abdominal wall its resistance to rotation and multidirectional forces.",
          zh: "中间层，肌纤维走行方向与腹外斜肌相反（斜向内上）——腹外斜肌与腹内斜肌呈X形交叉排列，是腹壁抵抗旋转及多方向受力的主要机制。",
        },
      },
      {
        key: "transversus-abdominis",
        meshName: "Transversus abdominis muscle.l",
        offset: [140, 80],
        label: { vi: "Cơ ngang bụng", en: "Transversus Abdominis", zh: "腹横肌" },
        latinName: "Musculus transversus abdominis",
        note: {
          vi: "Lớp SÂU NHẤT, sợi cơ chạy NGANG (không chéo như 2 lớp trên) — hoạt động như 'đai nịt bụng tự nhiên', co lại để ép tạng vào trong và ổn định cột sống trước khi thực hiện động tác nâng vật nặng.",
          en: "The DEEPEST layer, with fibers running HORIZONTALLY (unlike the diagonal orientation of the two layers above) — it functions like a natural 'corset', contracting to compress the abdominal organs inward and stabilize the spine before lifting heavy objects.",
          zh: "最深层，肌纤维呈水平走行（不同于上方两层的斜向排列）——其功能如同天然的'腹部束带'，收缩时向内压迫腹腔脏器，并在提举重物前稳定脊柱。",
        },
      },
    ],
  },
  "giai-phau-phoi": {
    slug: "giai-phau-phoi",
    title: { vi: "Giải phẫu Phổi", en: "Lung Anatomy", zh: "肺解剖" },
    description: {
      vi: "Hai phổi không đối xứng: phổi phải có 3 thuỳ (trên, giữa, dưới) ngăn bởi 2 khe, phổi trái chỉ có 2 thuỳ (trên, dưới) do phần không gian bên trái bị tim chiếm chỗ (khuyết tim). Khí quản ở giữa chia đôi thành 2 phế quản chính dẫn khí vào từng phổi. Mỗi thuỳ được tô một màu riêng để thấy rõ ranh giới — trên thực tế các thuỳ có cùng màu hồng.",
      en: "The two lungs are asymmetric: the right lung has 3 lobes (superior, middle, inferior) separated by 2 fissures, while the left lung has only 2 lobes (superior, inferior) because the heart occupies space on the left (the cardiac notch). The centrally placed trachea bifurcates into 2 main bronchi carrying air to each lung. Each lobe is given a distinct color here to make the boundaries clear — in reality the lobes share the same pink colour.",
      zh: "两肺不对称：右肺有3叶（上、中、下），由2条裂隙分隔；左肺仅有2叶（上、下），因心脏占据左侧空间（心切迹）。居中的气管分叉为2条主支气管，将空气送入各肺。此处每叶用不同颜色以显示分界——实际上各叶均为相同的粉红色。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/lung_anatomy.glb",
    hotspots: [
      {
        key: "sup-lobe-right",
        meshName: "Superior lobe of right lung",
        offset: [140, -70],
        label: { vi: "Thuỳ trên phổi phải", en: "Superior Lobe (Right)", zh: "右肺上叶" },
        latinName: "Lobus superior pulmonis dextri",
        note: {
          vi: "Thuỳ cao nhất của phổi phải, ngăn với thuỳ giữa bởi khe ngang (horizontal fissure) — khe này là đặc điểm chỉ có ở phổi phải, không có ở phổi trái.",
          en: "The uppermost lobe of the right lung, separated from the middle lobe by the horizontal fissure — this fissure is unique to the right lung and has no counterpart on the left.",
          zh: "右肺最上方的肺叶，借水平裂与中叶分隔——此裂为右肺所特有，左肺无对应结构。",
        },
      },
      {
        key: "mid-lobe-right",
        meshName: "Middle lobe of right lung",
        offset: [150, 10],
        label: { vi: "Thuỳ giữa phổi phải", en: "Middle Lobe (Right)", zh: "右肺中叶" },
        latinName: "Lobus medius pulmonis dextri",
        note: {
          vi: "Thuỳ nhỏ nhất, hình nêm ở mặt trước-ngoài phổi phải, nằm giữa khe ngang (trên) và khe chếch (dưới) — chỉ phổi phải mới có thuỳ này.",
          en: "The smallest, wedge-shaped lobe on the anterolateral aspect of the right lung, lying between the horizontal fissure (above) and the oblique fissure (below) — present only in the right lung.",
          zh: "右肺前外侧最小的楔形肺叶，位于水平裂（上）与斜裂（下）之间——仅见于右肺。",
        },
      },
      {
        key: "inf-lobe-right",
        meshName: "Inferior lobe of right lung",
        offset: [150, 90],
        label: { vi: "Thuỳ dưới phổi phải", en: "Inferior Lobe (Right)", zh: "右肺下叶" },
        latinName: "Lobus inferior pulmonis dextri",
        note: {
          vi: "Thuỳ lớn nhất phổi phải, nằm sau-dưới, ngăn với 2 thuỳ trên bởi khe chếch (oblique fissure). Vì nằm thấp và sau, đây là nơi dịch/mủ dễ đọng khi nằm lâu (viêm phổi hít).",
          en: "The largest lobe of the right lung, positioned posteroinferiorly and separated from the upper two lobes by the oblique fissure. Because it lies low and posterior, it is where fluid or pus tends to collect during prolonged recumbency (aspiration pneumonia).",
          zh: "右肺最大的肺叶，位于后下方，借斜裂与上两叶分隔。因位置低而靠后，长期卧床时液体或脓液易在此积聚（吸入性肺炎）。",
        },
      },
      {
        key: "sup-lobe-left",
        meshName: "Superior lobe of left lung",
        offset: [-150, -60],
        label: { vi: "Thuỳ trên phổi trái", en: "Superior Lobe (Left)", zh: "左肺上叶" },
        latinName: "Lobus superior pulmonis sinistri",
        note: {
          vi: "Thuỳ trên phổi trái, có phần lưỡi (lingula) nhô xuống trước — được coi là 'tương đương' thuỳ giữa phổi phải. Bờ trước lõm vào tạo khuyết tim (cardiac notch) nhường chỗ cho tim.",
          en: "The superior lobe of the left lung, bearing an inferior tongue-like projection (the lingula) — considered the 'equivalent' of the right middle lobe. Its anterior border is indented to form the cardiac notch, making room for the heart.",
          zh: "左肺上叶，向前下方伸出舌状突起（舌叶）——被视为右肺中叶的'对应结构'。其前缘凹陷形成心切迹，为心脏让出空间。",
        },
      },
      {
        key: "inf-lobe-left",
        meshName: "Inferior lobe of left lung",
        offset: [-150, 80],
        label: { vi: "Thuỳ dưới phổi trái", en: "Inferior Lobe (Left)", zh: "左肺下叶" },
        latinName: "Lobus inferior pulmonis sinistri",
        note: {
          vi: "Thuỳ dưới phổi trái, ngăn với thuỳ trên bởi khe chếch. Cùng với thuỳ dưới phổi phải, đây là vùng phổi tiếp xúc với cơ hoành nhiều nhất khi hít sâu.",
          en: "The inferior lobe of the left lung, separated from the superior lobe by the oblique fissure. Together with the right inferior lobe, this is the lung region that contacts the diaphragm most during deep inspiration.",
          zh: "左肺下叶，借斜裂与上叶分隔。与右肺下叶一起，是深吸气时与膈接触最多的肺区。",
        },
      },
      {
        key: "trachea",
        meshName: "Trachea",
        offset: [10, -130],
        label: { vi: "Khí quản", en: "Trachea", zh: "气管" },
        latinName: "Trachea",
        note: {
          vi: "Ống dẫn khí trung tâm dài ~10-12cm, giữ mở nhờ 16-20 vòng sụn hình chữ C (hở ở mặt sau giáp thực quản). Chia đôi tại carina (ngang mức đốt sống ngực T4-T5) thành phế quản chính phải và trái.",
          en: "The central airway, ~10-12cm long, held open by 16-20 C-shaped cartilage rings (open posteriorly against the oesophagus). It bifurcates at the carina (around the T4-T5 vertebral level) into the right and left main bronchi.",
          zh: "中央气道，长约10-12cm，由16-20个C形软骨环支撑保持开放（后方对食管处开口）。在气管隆嵴（约平第4-5胸椎）分为左右主支气管。",
        },
      },
    ],
  },
  "thanh-quan": {
    slug: "thanh-quan",
    title: { vi: "Giải phẫu Thanh quản", en: "Larynx Anatomy", zh: "喉解剖" },
    description: {
      vi: "Thanh quản là 'hộp phát âm' nối hầu với khí quản, vừa bảo vệ đường thở khi nuốt vừa tạo âm thanh. Khung của nó gồm các sụn (sụn giáp lớn nhất tạo 'trái cổ', sụn nhẫn hình nhẫn, cặp sụn phễu nhỏ điều khiển dây thanh) và nắp thanh môn đậy kín đường thở khi nuốt. Các cơ nội tại thanh quản kéo sụn phễu để mở/khép dây thanh, điều chỉnh cao độ giọng nói.",
      en: "The larynx is the 'voice box' connecting the pharynx to the trachea, both protecting the airway during swallowing and producing sound. Its framework consists of cartilages (the thyroid cartilage forms the 'Adam's apple', the ring-shaped cricoid, and the paired small arytenoids that steer the vocal folds) and the epiglottis that seals the airway during swallowing. The intrinsic laryngeal muscles rotate the arytenoids to open/close the vocal folds and adjust vocal pitch.",
      zh: "喉是连接咽与气管的'发声器官'，既在吞咽时保护气道，又产生声音。其支架由软骨组成（甲状软骨最大，形成'喉结'；环状软骨呈环形；成对的小杓状软骨控制声带），会厌在吞咽时封闭气道。喉内肌旋转杓状软骨以开闭声带并调节音高。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/larynx_anatomy.glb",
    hotspots: [
      {
        key: "thyroid-cartilage",
        meshName: "Thyroid cartilage",
        offset: [-140, -40],
        label: { vi: "Sụn giáp", en: "Thyroid Cartilage", zh: "甲状软骨" },
        latinName: "Cartilago thyroidea",
        note: {
          vi: "Sụn lớn nhất của thanh quản, gồm 2 mảnh gặp nhau ở đường giữa tạo góc nhô ra trước — chính là 'trái cổ' (Adam's apple), rõ hơn ở nam do góc nhọn hơn dưới tác động hormone tuổi dậy thì.",
          en: "The largest laryngeal cartilage, formed by two plates meeting anteriorly at the midline to create a forward projection — the 'Adam's apple', more prominent in males because the angle is sharper under the influence of pubertal hormones.",
          zh: "喉最大的软骨，由两块板在中线前方汇合形成向前突起——即'喉结'，男性因青春期激素作用角度更锐而更明显。",
        },
      },
      {
        key: "cricoid-cartilage",
        meshName: "Cricoid cartilage",
        offset: [-130, 70],
        label: { vi: "Sụn nhẫn", en: "Cricoid Cartilage", zh: "环状软骨" },
        latinName: "Cartilago cricoidea",
        note: {
          vi: "Sụn duy nhất tạo vòng KÍN hoàn toàn quanh đường thở (hình chiếc nhẫn, bản rộng ở sau) — là nền tựa cho toàn bộ thanh quản và mốc quan trọng trong đặt nội khí quản, mở khí quản cấp cứu.",
          en: "The only cartilage that forms a COMPLETE ring around the airway (shaped like a signet ring, with the broad plate at the back) — it is the foundation supporting the entire larynx and an important landmark for intubation and emergency airway procedures.",
          zh: "唯一在气道周围形成完整闭环的软骨（形似印戒，宽板位于后方）——是支撑整个喉的基础，也是气管插管与紧急气道操作的重要标志。",
        },
      },
      {
        key: "arytenoid",
        meshName: "Arytenoid cartilage.l",
        offset: [130, 30],
        label: { vi: "Sụn phễu", en: "Arytenoid Cartilage", zh: "杓状软骨" },
        latinName: "Cartilago arytaenoidea",
        note: {
          vi: "Cặp sụn nhỏ hình tháp ngồi trên bản sau sụn nhẫn — mỏm thanh âm của chúng bám vào dây thanh. Khi các cơ nội tại xoay sụn phễu, dây thanh mở ra (thở) hay khép lại (phát âm).",
          en: "A pair of small pyramidal cartilages sitting on the posterior plate of the cricoid — their vocal processes anchor the vocal folds. As the intrinsic muscles rotate the arytenoids, the vocal folds open (breathing) or close (phonation).",
          zh: "一对位于环状软骨后板上的小锥形软骨——其声带突固定声带。喉内肌旋转杓状软骨时，声带张开（呼吸）或闭合（发声）。",
        },
      },
      {
        key: "epiglottis",
        meshName: "Epiglottis",
        offset: [-40, -120],
        label: { vi: "Nắp thanh môn", en: "Epiglottis", zh: "会厌" },
        latinName: "Epiglottis",
        note: {
          vi: "Lá sụn đàn hồi hình chiếc lá ở phía trên thanh quản — khi nuốt, nó gập xuống đậy kín lối vào thanh quản, hướng thức ăn/nước vào thực quản phía sau, ngăn sặc vào đường thở.",
          en: "A leaf-shaped elastic cartilage above the larynx — during swallowing it folds down to seal the laryngeal inlet, directing food and liquid into the oesophagus behind and preventing aspiration into the airway.",
          zh: "喉上方的叶状弹性软骨——吞咽时向下折叠封闭喉入口，将食物和液体导入后方的食管，防止误吸入气道。",
        },
      },
      {
        key: "post-cricoarytenoid",
        meshName: "Posterior crico-arytenoid muscle.l",
        offset: [150, 100],
        label: { vi: "Cơ nhẫn-phễu sau", en: "Posterior Crico-arytenoid", zh: "环杓后肌" },
        latinName: "Musculus cricoarytaenoideus posterior",
        note: {
          vi: "Cơ nội tại DUY NHẤT mở dây thanh (dạng thanh môn) — kéo mỏm cơ của sụn phễu ra sau khiến dây thanh tách ra để thở. Liệt cả 2 bên cơ này gây khép dây thanh, tắc đường thở nguy hiểm.",
          en: "The ONLY intrinsic muscle that opens the vocal folds (abducts the glottis) — it pulls the muscular process of the arytenoid backward, separating the vocal folds for breathing. Bilateral paralysis of this muscle closes the folds and dangerously obstructs the airway.",
          zh: "唯一使声带张开（外展声门）的喉内肌——将杓状软骨的肌突向后牵拉，使声带分开以便呼吸。此肌双侧麻痹会致声带闭合，危险地阻塞气道。",
        },
      },
    ],
  },
  "he-tiet-nieu": {
    slug: "he-tiet-nieu",
    title: { vi: "Hệ tiết niệu", en: "Urinary System", zh: "泌尿系统" },
    description: {
      vi: "Hệ tiết niệu lọc máu và thải nước tiểu theo một đường liên tục: hai quả thận lọc máu tạo nước tiểu → bể thận hứng nước tiểu → hai niệu quản dẫn xuống → bàng quang chứa → niệu đạo thải ra ngoài. Ngồi úp trên mỗi thận là một tuyến thượng thận (màu vàng) — thực ra thuộc hệ nội tiết, không dẫn nước tiểu, nhưng nằm sát nên thường được xét cùng. Thận phải thường thấp hơn thận trái khoảng nửa đốt sống do bị gan đè phía trên.",
      en: "The urinary system filters blood and excretes urine along one continuous path: the two kidneys filter blood to produce urine → the renal pelvis collects it → the two ureters carry it down → the bladder stores it → the urethra expels it. Perched atop each kidney is a suprarenal (adrenal) gland (yellow) — which actually belongs to the endocrine system and carries no urine, but sits so close it is usually studied alongside. The right kidney typically sits about half a vertebra lower than the left because the liver presses down from above.",
      zh: "泌尿系统沿一条连续通路滤血并排尿：两肾滤血生成尿液 → 肾盂收集 → 两条输尿管下行 → 膀胱储存 → 尿道排出。每个肾上方各坐一个肾上腺（黄色）——实属内分泌系统、不输送尿液，但因紧邻常一并研究。右肾因上方受肝脏压迫，通常比左肾低约半个椎体。",
    },
    visibleSystems: ["visceral"],
    modelFile: "/models/urinary_system.glb",
    hotspots: [
      {
        key: "kidney-l",
        meshName: "Kidney.l",
        offset: [-140, -30],
        label: { vi: "Thận trái", en: "Left Kidney", zh: "左肾" },
        latinName: "Ren sinister",
        note: {
          vi: "Cơ quan lọc hình hạt đậu, mỗi quả chứa ~1 triệu đơn vị lọc (nephron). Lọc ~180 lít máu mỗi ngày nhưng chỉ thải ra ~1.5 lít nước tiểu — phần còn lại được tái hấp thu. Điều hoà huyết áp, cân bằng nước-điện giải và độ pH máu.",
          en: "A bean-shaped filtering organ, each containing ~1 million filtering units (nephrons). It filters ~180 litres of blood per day but excretes only ~1.5 litres of urine — the rest is reabsorbed. It regulates blood pressure, water-electrolyte balance, and blood pH.",
          zh: "豆形滤过器官，每个含约100万个滤过单位（肾单位）。每天滤过约180升血液，却仅排出约1.5升尿液——其余被重吸收。调节血压、水电解质平衡及血液pH。",
        },
      },
      {
        key: "kidney-r",
        meshName: "Kidney.r",
        offset: [150, 0],
        label: { vi: "Thận phải", en: "Right Kidney", zh: "右肾" },
        latinName: "Ren dexter",
        note: {
          vi: "Thận phải nằm THẤP hơn thận trái khoảng nửa đốt sống vì gan chiếm chỗ phía trên bên phải — đây là lý do khi khám bụng, thận phải đôi khi sờ được ở người gầy còn thận trái thì hiếm.",
          en: "The right kidney sits about half a vertebra LOWER than the left because the liver occupies the space above on the right — this is why, on abdominal examination, the right kidney is occasionally palpable in thin people while the left rarely is.",
          zh: "右肾比左肾低约半个椎体，因肝脏占据右上方空间——故腹部检查时，消瘦者偶可触及右肾，而左肾则罕能触及。",
        },
      },
      {
        key: "renal-pelvis-l",
        meshName: "Renal pelvis.l",
        offset: [-150, 60],
        label: { vi: "Bể thận", en: "Renal Pelvis", zh: "肾盂" },
        latinName: "Pelvis renalis",
        note: {
          vi: "Phễu hứng nước tiểu hình dẹt bên trong thận, gom nước tiểu từ các đài thận rồi đổ vào niệu quản. Sỏi thận kẹt ở chỗ nối bể thận-niệu quản là nguyên nhân cơn đau quặn thận dữ dội.",
          en: "A flattened funnel inside the kidney that collects urine from the calyces and channels it into the ureter. A kidney stone lodged at the pelvi-ureteric junction is a classic cause of severe renal colic.",
          zh: "肾内扁平的漏斗状结构，汇集肾盏的尿液并导入输尿管。结石嵌顿于肾盂输尿管连接处是剧烈肾绞痛的典型病因。",
        },
      },
      {
        key: "ureter-l",
        meshName: "Ureter.l",
        offset: [-140, 130],
        label: { vi: "Niệu quản", en: "Ureter", zh: "输尿管" },
        latinName: "Ureter",
        note: {
          vi: "Ống cơ dài ~25-30cm dẫn nước tiểu từ bể thận xuống bàng quang bằng các đợt SÓNG NHU ĐỘNG (không phải chảy thụ động theo trọng lực). Có 3 chỗ hẹp tự nhiên — nơi sỏi hay kẹt gây tắc.",
          en: "A muscular tube ~25-30cm long that carries urine from the renal pelvis to the bladder by waves of PERISTALSIS (not passive gravity flow). It has 3 natural constrictions — the sites where stones tend to lodge and cause obstruction.",
          zh: "长约25-30cm的肌性管道，借蠕动波（而非重力被动流动）将尿液从肾盂送至膀胱。有3处生理性狭窄——结石易嵌顿并致梗阻之处。",
        },
      },
      {
        key: "bladder",
        meshName: "Urinary bladder",
        offset: [10, 150],
        label: { vi: "Bàng quang", en: "Urinary Bladder", zh: "膀胱" },
        latinName: "Vesica urinaria",
        note: {
          vi: "Túi cơ rỗng chứa nước tiểu, thành có cơ trơn (cơ bàng quang / detrusor) co bóp khi tiểu. Chứa được ~400-600ml; cảm giác buồn tiểu bắt đầu khoảng 150-250ml. Khi rỗng nằm trong chậu hông, khi đầy phồng lên trên xương mu.",
          en: "A hollow muscular sac that stores urine, its wall containing smooth muscle (the detrusor) that contracts during urination. It holds ~400-600ml; the urge to void begins around 150-250ml. When empty it lies within the pelvis; when full it rises above the pubic bone.",
          zh: "储存尿液的中空肌囊，壁内含平滑肌（逼尿肌），排尿时收缩。容量约400-600ml；约150-250ml时开始产生尿意。空虚时位于盆腔内，充盈时隆起于耻骨上方。",
        },
      },
      {
        key: "urethra",
        meshName: "Urethra",
        offset: [10, 200],
        label: { vi: "Niệu đạo", en: "Urethra", zh: "尿道" },
        latinName: "Urethra",
        note: {
          vi: "Ống cuối cùng thải nước tiểu ra ngoài. Niệu đạo nữ ngắn (~4cm) nên nữ dễ nhiễm khuẩn tiết niệu hơn; niệu đạo nam dài (~20cm) đi qua tuyến tiền liệt và dương vật, kiêm cả đường dẫn tinh.",
          en: "The final tube that expels urine to the exterior. The female urethra is short (~4cm), making women more prone to urinary tract infections; the male urethra is long (~20cm), passing through the prostate and penis and doubling as the passage for semen.",
          zh: "将尿液排出体外的最后一段管道。女性尿道短（约4cm），故女性更易患尿路感染；男性尿道长（约20cm），穿过前列腺和阴茎，兼作精液通道。",
        },
      },
      {
        key: "suprarenal-l",
        meshName: "Suprarenal gland.l",
        offset: [-150, -100],
        label: { vi: "Tuyến thượng thận", en: "Suprarenal (Adrenal) Gland", zh: "肾上腺" },
        latinName: "Glandula suprarenalis",
        note: {
          vi: "Tuyến nội tiết hình mũ úp trên đỉnh mỗi thận (KHÔNG dẫn nước tiểu — hiển thị ở đây vì nằm sát thận). Vỏ tiết hormone steroid (cortisol, aldosterone), tuỷ tiết adrenaline điều khiển phản ứng 'chiến-hay-chạy'.",
          en: "An endocrine gland capping the top of each kidney (it carries NO urine — shown here because it sits directly on the kidney). Its cortex secretes steroid hormones (cortisol, aldosterone); its medulla secretes adrenaline, driving the 'fight-or-flight' response.",
          zh: "戴帽状覆于每个肾上端的内分泌腺（不输送尿液——因紧贴肾脏而在此显示）。皮质分泌类固醇激素（皮质醇、醛固酮），髓质分泌肾上腺素，驱动'战或逃'反应。",
        },
      },
    ],
  },
  "co-hoanh": {
    slug: "co-hoanh",
    title: { vi: "Cơ hoành", en: "Diaphragm", zh: "膈肌" },
    description: {
      vi: "Cơ hoành là cơ hô hấp CHÍNH: tấm cơ-gân hình vòm ngăn cách khoang ngực (trên) với khoang bụng (dưới). Khi hít vào, nó co lại và hạ xuống làm phẳng vòm, tăng thể tích lồng ngực để hút khí vào phổi; khi thở ra, nó giãn và trồi lên. Cơ hoành có 3 lỗ cho thực quản, động mạch chủ và tĩnh mạch chủ dưới đi xuyên qua. Được chi phối bởi thần kinh hoành (C3-C5) — nên tổn thương tuỷ cổ cao có thể làm ngừng thở.",
      en: "The diaphragm is the PRIMARY muscle of respiration: a dome-shaped musculotendinous sheet separating the thoracic cavity (above) from the abdominal cavity (below). On inspiration it contracts and descends, flattening the dome and increasing thoracic volume to draw air into the lungs; on expiration it relaxes and rises. It has 3 openings for the oesophagus, aorta, and inferior vena cava to pass through. Innervated by the phrenic nerve (C3-C5) — so a high cervical spinal cord injury can stop breathing.",
      zh: "膈是呼吸的主要肌肉：一片穹顶状的肌腱膜，分隔胸腔（上）与腹腔（下）。吸气时收缩下降，使穹顶变平、增大胸腔容积，将空气吸入肺；呼气时松弛上升。膈有3个孔，供食管、主动脉和下腔静脉穿过。由膈神经（C3-C5）支配——故高位颈髓损伤可致呼吸停止。",
    },
    visibleSystems: ["muscular"],
    modelFile: "/models/diaphragm.glb",
    hotspots: [
      {
        key: "diaphragm",
        meshName: "Diaphragm",
        offset: [140, 0],
        label: { vi: "Cơ hoành", en: "Diaphragm", zh: "膈肌" },
        latinName: "Diaphragma",
        note: {
          vi: "Vòm cơ có phần cơ ở ngoại vi (bám vào bờ dưới lồng ngực, xương ức, cột sống thắt lưng) hội tụ vào một tấm gân trung tâm (central tendon) ở đỉnh vòm — chính vùng gân này là nơi tim tựa lên qua màng ngoài tim.",
          en: "A muscular dome whose peripheral muscle fibers (attaching to the lower rib margin, sternum, and lumbar spine) converge onto a central tendon at the apex of the dome — this tendinous region is where the heart rests via the pericardium.",
          zh: "肌性穹顶，其周边肌纤维（附着于下肋缘、胸骨和腰椎）汇聚于穹顶顶部的中心腱——此腱性区域是心脏经心包所依托之处。",
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
