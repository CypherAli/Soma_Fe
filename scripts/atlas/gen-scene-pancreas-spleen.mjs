/**
 * Sinh scene "Tuỵ và lách" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-pancreas-spleen.mjs
 *
 * Khảo sát: FJ1895 "Pancreas" trùng FJ2629 "Parenchyma of pancreas" (0,7mm)
 * -> bỏ FJ1895. Ống tuỵ có hai mảnh (FJ1896, FJ2630) — xem EXCLUDE trong
 * emit (đã đo khoảng cách lưới). Mạch: thân tạng, ĐM lách (một bản FJ2562),
 * vị tá tràng, các ĐM tá tuỵ và tuỵ; TM lách.
 */
import { byRe, byName, emit } from "./lib.mjs";

const A = (re) => byRe(re, ["arterial"]);

emit({
  file: "pancreas-spleen",
  exportName: "pancreasSpleenScene",
  header: 'Scene "Tuỵ và lách" dựng từ bộ atlas BodyParts3D.',
  scene: {
    slug: "tuy-lach",
    title: { vi: "Tuỵ và lách", en: "Pancreas and Spleen", zh: "胰与脾" },
    latin: "Pancreas · Splen",
    intro: {
      vi: "Tuỵ nằm ngang sau dạ dày, đầu tuỵ ôm trong khung tá tràng, đuôi tuỵ chạm rốn lách. Nó vừa là tuyến ngoại tiết (dịch tiêu hoá đổ vào tá tràng qua ống tuỵ) vừa là tuyến nội tiết (insulin, glucagon). Lách là cơ quan bạch huyết lớn nhất, lọc hồng cầu già. Hai cơ quan dùng chung động mạch lách chạy dọc bờ trên tuỵ. Mỗi cấu trúc một màu.",
      en: "The pancreas lies across the back of the stomach: its head sits inside the duodenal C-loop and its tail reaches the hilum of the spleen. It is both an exocrine gland (digestive juice into the duodenum through the pancreatic duct) and an endocrine gland (insulin, glucagon). The spleen is the largest lymphoid organ and filters old red cells. The two share the splenic artery, which runs along the upper border of the pancreas. Each structure has its own colour.",
      zh: "胰横卧于胃后方，胰头位于十二指肠C形环内，胰尾抵达脾门。它既是外分泌腺（消化液经胰管排入十二指肠），又是内分泌腺（胰岛素、胰高血糖素）。脾是最大的淋巴器官，负责清除衰老红细胞。二者共用沿胰上缘走行的脾动脉。各结构以不同颜色显示。",
    },
  },
  exclude: ["FJ1895", "FJ1896", "FJ2013", "FJ3421"],
  groups: [
    {
      key: "tuy",
      tint: "#e0b36a",
      latin: "Pancreas",
      name: { vi: "Tuỵ", en: "Pancreas", zh: "胰" },
      note: {
        vi: "Đầu, cổ, thân, đuôi. Tuỵ nằm sau phúc mạc, trước cột sống L1–L2 — nên chấn thương bụng trên đè ép có thể dập tuỵ vào cột sống. Ung thư đầu tuỵ chèn ống mật chủ gây vàng da không đau.",
        en: "Head, neck, body and tail. It is retroperitoneal, in front of L1–L2 — so a blow to the upper abdomen can crush it against the spine. Cancer of the head compresses the bile duct and causes painless jaundice.",
        zh: "分为头、颈、体、尾。位于腹膜后、L1–L2前方——故上腹部钝性撞击可将胰挤压于脊柱上致伤。胰头癌压迫胆总管引起无痛性黄疸。",
      },
      ids: byRe(/^parenchyma of pancreas$/i),
    },
    {
      key: "ong-tuy",
      tint: "#6f9a4f",
      latin: "Ductus pancreaticus",
      name: { vi: "Ống tuỵ", en: "Pancreatic duct", zh: "胰管" },
      note: {
        vi: "Chạy suốt chiều dài tuỵ, hợp với ống mật chủ ở bóng Vater đổ vào đoạn hai tá tràng. Sỏi mật kẹt ở bóng Vater làm dịch mật trào ngược vào ống tuỵ — nguyên nhân hàng đầu của viêm tuỵ cấp.",
        en: "Runs the whole length of the pancreas and joins the common bile duct at the ampulla of Vater in the second part of the duodenum. A gallstone stuck at the ampulla lets bile reflux into the pancreatic duct — the leading cause of acute pancreatitis.",
        zh: "贯穿胰全长，与胆总管在十二指肠降部的Vater壶腹汇合。胆石嵌顿于壶腹可使胆汁反流入胰管——急性胰腺炎的首要原因。",
      },
      ids: byRe(/^pancreatic duct( tree)?$/i),
    },
    {
      key: "lach",
      tint: "#7a3a4f",
      latin: "Splen",
      name: { vi: "Lách", en: "Spleen", zh: "脾" },
      note: {
        vi: "Nằm ở hạ sườn trái, dưới xương sườn IX–XI. Là tạng dễ vỡ nhất trong chấn thương bụng kín — gãy sườn trái dưới cần nghĩ tới vỡ lách. Lách bình thường không sờ thấy; sờ thấy nghĩa là đã to gấp khoảng ba lần.",
        en: "Lies in the left upper quadrant under ribs IX–XI. It is the organ most often ruptured in blunt abdominal trauma — lower left rib fractures should raise the suspicion. A normal spleen is not palpable; if you can feel it, it is about three times its normal size.",
        zh: "位于左季肋区第9–11肋深面。是腹部闭合性损伤中最易破裂的器官——左下肋骨骨折应警惕脾破裂。正常脾不能触及；可触及时约已增大至正常的三倍。",
      },
      ids: byName("Spleen"),
    },
    {
      key: "ta-trang",
      latin: "Duodenum",
      name: { vi: "Tá tràng (khung)", en: "Duodenum (C-loop)", zh: "十二指肠（C形环）" },
      note: {
        vi: "Khung chữ C ôm đầu tuỵ. Để màu gốc làm mốc — đầu tuỵ và tá tràng dùng chung nguồn máu (các động mạch tá tuỵ), nên không thể cắt đầu tuỵ mà giữ tá tràng (phẫu thuật Whipple).",
        en: "The C-loop cradling the pancreatic head, shown in natural colour as a landmark. The head of the pancreas and duodenum share their blood supply (the pancreaticoduodenal arteries), so the head cannot be removed without the duodenum (Whipple's operation).",
        zh: "环抱胰头的C形肠段，以原色作为标志。胰头与十二指肠共用血供（胰十二指肠动脉），故切除胰头必须同时切除十二指肠（Whipple手术）。",
      },
      ids: byName("Duodenum"),
    },
    {
      key: "dm-lach-than-tang",
      tint: "#c05245",
      latin: "Truncus coeliacus · A. splenica",
      name: { vi: "Thân tạng và động mạch lách", en: "Coeliac trunk and splenic artery", zh: "腹腔干与脾动脉" },
      note: {
        vi: "Động mạch lách ngoằn ngoèo dọc bờ trên tuỵ, cho các nhánh tuỵ (tuỵ lưng, tuỵ lớn, đuôi tuỵ) rồi vào rốn lách. Viêm tuỵ có thể ăn mòn thành nó tạo giả phình — vỡ gây chảy máu ồ ạt.",
        en: "The tortuous splenic artery runs along the upper border of the pancreas, giving pancreatic branches (dorsal, great, caudal) before entering the splenic hilum. Pancreatitis can erode its wall into a pseudoaneurysm — rupture causes massive bleeding.",
        zh: "迂曲的脾动脉沿胰上缘走行，发出胰支（胰背动脉、胰大动脉、胰尾动脉）后进入脾门。胰腺炎可侵蚀其壁形成假性动脉瘤——破裂导致大出血。",
      },
      ids: byName("Celiac artery").concat(["FJ2562"], A(/dorsal pancreatic artery$|great pancreatic artery$|caudal pancreatic artery$|inferior pancreatic artery$/i)),
    },
    {
      key: "dm-ta-tuy",
      tint: "#e8883d",
      latin: "Aa. gastroduodenalis · pancreaticoduodenales",
      name: { vi: "Động mạch vị tá tràng và tá tuỵ", en: "Gastroduodenal and pancreaticoduodenal arteries", zh: "胃十二指肠动脉与胰十二指肠动脉" },
      note: {
        vi: "Vị tá tràng (từ gan chung) chạy sau đoạn một tá tràng — loét mặt sau hành tá tràng ăn thủng nó gây xuất huyết tiêu hoá nặng. Các cung tá tuỵ trên (từ thân tạng) và dưới (từ mạc treo tràng trên) nối hai vùng cấp máu.",
        en: "The gastroduodenal (from the common hepatic) runs behind the first part of the duodenum — a posterior duodenal ulcer eroding it causes severe GI bleeding. The superior (coeliac) and inferior (SMA) pancreaticoduodenal arcades link the two territories.",
        zh: "胃十二指肠动脉（发自肝总动脉）行于十二指肠球部后方——球后壁溃疡穿透此动脉可致上消化道大出血。胰十二指肠上（腹腔干）、下（肠系膜上动脉）动脉弓连接两个供血区。",
      },
      ids: A(/gastroduodenal artery$|pancreaticoduodenal artery$|common hepatic artery$/i),
    },
    {
      key: "tm-lach",
      tint: "#7a6aa6",
      latin: "V. splenica",
      name: { vi: "Tĩnh mạch lách và tá tuỵ", en: "Splenic and pancreaticoduodenal veins", zh: "脾静脉与胰十二指肠静脉" },
      note: {
        vi: "Tĩnh mạch lách chạy trong rãnh mặt sau tuỵ, hợp với mạc treo tràng trên thành tĩnh mạch cửa. Viêm tuỵ gây huyết khối tĩnh mạch lách → tăng áp cửa \"trái\" với giãn tĩnh mạch phình vị đơn độc.",
        en: "The splenic vein runs in a groove on the back of the pancreas and joins the superior mesenteric vein to form the portal vein. Pancreatitis can thrombose it → \"left-sided\" portal hypertension with isolated gastric fundal varices.",
        zh: "脾静脉走行于胰后面的沟内，与肠系膜上静脉汇合成门静脉。胰腺炎可致脾静脉血栓→“左侧”门静脉高压，出现孤立性胃底静脉曲张。",
      },
      ids: byRe(/^splenic vein$|pancreaticoduodenal vein$/i, ["venous"]),
    },
  ],
});
