/**
 * Sinh scene "Gan và đường mật" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-biliary.mjs
 *
 * Khác bài Giải phẫu Gan (phân thuỳ): bài này đi theo DÒNG MẬT — ống mật
 * phân thuỳ → ống gan phải/trái → ống gan chung → (+ ống túi mật) → tá tràng.
 * Gan tô một màu và làm mờ sẵn để thấy cây mật bên trong. Dùng đúng danh
 * sách 8 phân thuỳ và bản sao đã loại ở gen-scene-liver. Atlas KHÔNG có ống
 * mật chủ đoạn dưới tách riêng.
 */
import { byRe, byName, emit } from "./lib.mjs";

const LIVER = ["FJ2816", "FJ2818", "FJ2819", "FJ2820", "FJ2821", "FJ2822", "FJ2823", "FJ2824"];

emit({
  file: "biliary",
  exportName: "biliaryScene",
  header: 'Scene "Gan và đường mật" dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "gan-duong-mat",
    title: { vi: "Gan và đường mật", en: "Liver and Biliary Tree", zh: "肝与胆道" },
    latin: "Hepar · Viae biliferae",
    intro: {
      vi: "Tế bào gan tiết mật vào các vi quản mật, gom dần thành ống mật phân thuỳ, ống gan phải và trái, hợp thành ống gan chung ở rốn gan. Ống túi mật nhập vào tạo ống mật chủ đổ vào tá tràng. Giữa bữa ăn cơ vòng Oddi đóng nên mật dồn ngược lên túi mật để cô đặc. Gan để mờ sẵn; đường mật xanh lá, túi mật xanh đậm, mạch cửa tím, động mạch đỏ.",
      en: "Liver cells secrete bile into canaliculi, which gather into segmental ducts, then the right and left hepatic ducts, joining as the common hepatic duct at the hilum. The cystic duct joins it to form the common bile duct, which drains into the duodenum. Between meals the sphincter of Oddi is closed, so bile backs up into the gallbladder to be concentrated. The liver is pre-faded; bile ducts in green, gallbladder in dark green, portal vessels in violet, arteries in red.",
      zh: "肝细胞将胆汁分泌至毛细胆管，逐级汇合为段胆管、左右肝管，在肝门处合成肝总管。胆囊管汇入后形成胆总管，开口于十二指肠。餐间Oddi括约肌关闭，胆汁逆流入胆囊浓缩。肝脏预先淡化；胆管为绿色，胆囊深绿，门静脉紫色，动脉红色。",
    },
  },
  exclude: ["FJ3094", "FJ3077", "FJ3082", "FJ2386", "FJ2394"],
  faded: ["gan"],
  groups: [
    {
      key: "ong-gan-chung",
      tint: "#4f8a3a",
      latin: "Ductus hepaticus communis",
      name: { vi: "Ống gan phải, trái và ống gan chung", en: "Right, left and common hepatic ducts", zh: "左、右肝管与肝总管" },
      note: {
        vi: "Hai ống gan hợp ở rốn gan thành ống gan chung dài 3–4cm. U Klatskin (ung thư đường mật rốn gan) mọc đúng chỗ hợp lưu, gây vàng da tắc mật tăng dần.",
        en: "The two hepatic ducts join at the hilum as the common hepatic duct, 3–4cm long. A Klatskin tumour (hilar cholangiocarcinoma) grows right at this confluence and causes progressive obstructive jaundice.",
        zh: "左右肝管在肝门汇合成长3–4cm的肝总管。Klatskin瘤（肝门部胆管癌）恰生长于汇合处，引起进行性梗阻性黄疸。",
      },
      ids: byName("Right hepatic duct", "Left hepatic duct", "Common hepatic duct"),
    },
    {
      key: "ong-mat-phan-thuy",
      tint: "#7fb35a",
      latin: "Ductus biliferi segmentorum",
      name: { vi: "Ống mật phân thuỳ", en: "Segmental bile ducts", zh: "段胆管" },
      note: {
        vi: "Mỗi phân thuỳ Couinaud có ống mật riêng, đi cùng nhánh tĩnh mạch cửa và động mạch gan trong bao Glisson. Giãn đường mật trong gan trên siêu âm là dấu hiệu tắc ở dưới.",
        en: "Each Couinaud segment has its own duct, running with the portal vein and hepatic artery branches in Glisson's sheath. Dilated intrahepatic ducts on ultrasound signal an obstruction further down.",
        zh: "每个Couinaud肝段有自己的胆管，与门静脉支和肝动脉支同行于Glisson鞘内。超声显示肝内胆管扩张提示下游梗阻。",
      },
      ids: byRe(/hepatic biliary tree|duct of caudate lobe/i, ["digestive"]),
    },
    {
      key: "tui-mat",
      tint: "#3f6a2f",
      latin: "Vesica biliaris · Ductus cysticus",
      name: { vi: "Túi mật và ống túi mật", en: "Gallbladder and cystic duct", zh: "胆囊与胆囊管" },
      note: {
        vi: "Ống túi mật có van xoắn Heister. Tam giác Calot (ống túi mật – ống gan chung – bờ gan) chứa động mạch túi mật: phải nhận diện rõ trước khi kẹp khi mổ cắt túi mật, không thì dễ kẹp nhầm ống mật chủ.",
        en: "The cystic duct contains the spiral valve of Heister. Calot's triangle (cystic duct – common hepatic duct – liver edge) holds the cystic artery: it must be clearly identified before clipping in cholecystectomy, or the common bile duct may be clipped by mistake.",
        zh: "胆囊管内有Heister螺旋瓣。Calot三角（胆囊管—肝总管—肝下缘）内有胆囊动脉：胆囊切除术中夹闭前必须清楚辨认，否则易误夹胆总管。",
      },
      ids: byName("Gallbladder", "Cystic duct"),
    },
    {
      key: "tm-cua",
      tint: "#7a6aa6",
      latin: "V. portae hepatis",
      name: { vi: "Tĩnh mạch cửa", en: "Portal vein", zh: "门静脉" },
      note: {
        vi: "Nằm sau cùng trong cuống gan (sau ống mật chủ và động mạch gan). Nghiệm pháp Pringle — kẹp cuống gan — cắt cả dòng cửa lẫn động mạch để cầm máu khi mổ gan.",
        en: "The most posterior structure in the hepatic pedicle (behind the bile duct and hepatic artery). The Pringle manoeuvre — clamping the pedicle — stops both portal and arterial inflow to control bleeding in liver surgery.",
        zh: "位于肝蒂最后方（在胆总管和肝动脉之后）。Pringle手法——阻断肝蒂——同时阻断门静脉和肝动脉血流，用于肝手术止血。",
      },
      ids: byRe(/portal vein$/i, ["venous"]),
    },
    {
      key: "dm-gan",
      tint: "#c05245",
      latin: "A. hepatica",
      name: { vi: "Động mạch gan", en: "Hepatic artery", zh: "肝动脉" },
      note: {
        vi: "Nguồn nuôi DUY NHẤT của đường mật. Biến thể giải phẫu rất hay gặp (động mạch gan phải tách từ mạc treo tràng trên ở ~15% người) — phải biết trước khi mổ.",
        en: "The ONLY blood supply of the bile ducts. Anatomical variants are very common (a right hepatic artery arising from the SMA in ~15%) — they must be known before surgery.",
        zh: "胆管的唯一血供。解剖变异非常常见（约15%的人右肝动脉发自肠系膜上动脉）——术前必须明确。",
      },
      ids: byRe(/hepatic artery|branch of (left|right) hepatic artery/i, ["arterial"]),
    },
    {
      key: "ta-trang",
      latin: "Duodenum",
      name: { vi: "Tá tràng (nơi mật đổ vào)", en: "Duodenum (where bile enters)", zh: "十二指肠（胆汁排入处）" },
      note: {
        vi: "Mật đổ vào đoạn hai tá tràng qua bóng Vater, cùng dịch tuỵ. Để màu gốc làm mốc.",
        en: "Bile enters the second part of the duodenum at the ampulla of Vater, together with pancreatic juice. Shown in natural colour as a landmark.",
        zh: "胆汁与胰液一同经Vater壶腹排入十二指肠降部。以原色作为标志。",
      },
      ids: byName("Duodenum"),
    },
    {
      key: "gan",
      tint: "#9a4e3e",
      latin: "Hepar",
      name: { vi: "Nhu mô gan", en: "Liver parenchyma", zh: "肝实质" },
      note: {
        vi: "Tám phân thuỳ gộp một màu, làm mờ sẵn để nhìn thấu cây mật. Chi tiết từng phân thuỳ ở bài Giải phẫu Gan.",
        en: "The eight segments in one colour, pre-faded so the biliary tree shows through. Segment detail is in the Liver Anatomy lesson.",
        zh: "八个肝段合为一色并预先淡化，以透视胆道树。各肝段详见“肝脏解剖”一课。",
      },
      ids: LIVER,
    },
  ],
});
