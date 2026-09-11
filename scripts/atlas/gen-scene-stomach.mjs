/**
 * Sinh scene "Dạ dày và tá tràng" từ atlas BodyParts3D.
 * Chạy: node scripts/atlas/gen-scene-stomach.mjs
 *
 * Khảo sát: dạ dày, tá tràng, đoạn cuối thực quản; vòng động mạch bờ cong
 * nhỏ (vị trái/phải) và bờ cong lớn (vị mạc nối), vị tá tràng; tĩnh mạch vị
 * về hệ cửa. Atlas KHÔNG có mạc nối nhỏ/lớn. ĐM lách giữ bản FJ2562.
 */
import { byRe, byName, emit } from "./lib.mjs";

const A = (re) => byRe(re, ["arterial"]);

emit({
  file: "stomach",
  exportName: "stomachScene",
  header: 'Scene "Dạ dày và tá tràng" dựng từ bộ atlas BodyParts3D.\n\nAtlas không có mạc nối.',
  scene: {
    slug: "da-day-ta-trang",
    title: { vi: "Dạ dày và tá tràng", en: "Stomach and Duodenum", zh: "胃与十二指肠" },
    latin: "Gaster · Duodenum",
    intro: {
      vi: "Dạ dày được nuôi bởi hai vòng động mạch, cả hai từ thân tạng: vòng bờ cong NHỎ (vị trái + vị phải) và vòng bờ cong LỚN (vị mạc nối phải + trái). Tĩnh mạch đi kèm đổ về hệ cửa. Tá tràng ôm đầu tuỵ, nhận mật và dịch tuỵ. Hiểu hai vòng mạch này là hiểu vì sao chảy máu do loét có thể rất nặng. Tạng để màu gốc, động mạch tông đỏ, tĩnh mạch tím; bộ dữ liệu không có mạc nối.",
      en: "The stomach is supplied by two arterial arcades, both from the coeliac trunk: the LESSER-curvature arcade (left + right gastric) and the GREATER-curvature arcade (right + left gastro-omental). The accompanying veins drain to the portal system. The duodenum wraps the pancreatic head and receives bile and pancreatic juice. Knowing these arcades explains why ulcer bleeding can be so severe. Organs in natural colour, arteries in reds, veins in violet; the dataset has no omenta.",
      zh: "胃由两个动脉弓供血，均来自腹腔干：胃小弯动脉弓（胃左+胃右动脉）和胃大弯动脉弓（胃网膜右+左动脉）。伴行静脉回流至门静脉系统。十二指肠环抱胰头，接受胆汁和胰液。理解这两个动脉弓便能明白溃疡出血为何可能十分凶险。器官为原色，动脉红色系，静脉紫色；数据集中无网膜。",
    },
  },
  // Căn theo dạ dày – tá tràng và vòng mạch; thực quản 27cm kéo dạ dày nhỏ lại.
  frame: ["da-day", "ta-trang", "bo-cong-nho", "bo-cong-lon", "tm-vi"],
  groups: [
    {
      key: "da-day",
      tint: "#e8a37a",
      latin: "Gaster",
      name: { vi: "Dạ dày", en: "Stomach", zh: "胃" },
      note: {
        vi: "Tâm vị nối thực quản, đáy vị chứa khí (bóng hơi dạ dày trên phim), thân vị tiết acid, hang vị và môn vị điều tiết dòng dưỡng chấp xuống tá tràng. Hẹp môn vị bẩm sinh ở trẻ gây nôn vọt.",
        en: "The cardia joins the oesophagus, the fundus holds gas (the gastric bubble on X-ray), the body secretes acid, and the antrum and pylorus meter chyme into the duodenum. Congenital pyloric stenosis in infants causes projectile vomiting.",
        zh: "贲门连接食管，胃底储气（X线上的胃泡），胃体分泌胃酸，胃窦和幽门调控食糜进入十二指肠。婴儿先天性幽门狭窄引起喷射性呕吐。",
      },
      ids: byName("Stomach"),
    },
    {
      key: "ta-trang",
      tint: "#e8c07a",
      latin: "Duodenum",
      name: { vi: "Tá tràng", en: "Duodenum", zh: "十二指肠" },
      note: {
        vi: "Bốn đoạn: hành tá tràng (trong phúc mạc, nơi loét hay gặp), đoạn xuống (có bóng Vater), đoạn ngang (bị động mạch mạc treo tràng trên bắt chéo phía trước), đoạn lên. Loét mặt sau hành tá tràng ăn thủng động mạch vị tá tràng gây chảy máu ồ ạt.",
        en: "Four parts: the cap (intraperitoneal, where ulcers occur), the descending part (with the ampulla of Vater), the horizontal part (crossed in front by the SMA) and the ascending part. A posterior cap ulcer eroding the gastroduodenal artery causes massive bleeding.",
        zh: "分四部：球部（腹膜内位，溃疡好发处）、降部（有Vater壶腹）、水平部（前方有肠系膜上动脉跨过）和升部。球后壁溃疡穿透胃十二指肠动脉可致大出血。",
      },
      ids: byName("Duodenum"),
    },
    {
      key: "thuc-quan",
      tint: "#c98a6b",
      latin: "Oesophagus",
      name: { vi: "Thực quản", en: "Oesophagus", zh: "食管" },
      note: {
        vi: "Đổ vào tâm vị. Góc His giữa thực quản và đáy vị cùng cơ hoành tạo cơ chế chống trào ngược; thoát vị khe thực quản làm mất góc này.",
        en: "Enters at the cardia. The angle of His between the oesophagus and fundus, together with the diaphragm, forms the anti-reflux mechanism; a hiatus hernia flattens this angle.",
        zh: "开口于贲门。食管与胃底之间的His角联合膈肌构成抗反流机制；食管裂孔疝使此角消失。",
      },
      ids: byName("Esophagus"),
    },
    {
      key: "bo-cong-nho",
      tint: "#c05245",
      latin: "Aa. gastricae sinistra et dextra",
      name: { vi: "Vòng mạch bờ cong nhỏ", en: "Lesser-curvature arcade", zh: "胃小弯动脉弓" },
      note: {
        vi: "Vị trái (từ thân tạng, lớn nhất trong các động mạch vị) nối với vị phải (từ gan riêng). Loét bờ cong nhỏ ăn vào động mạch vị trái gây nôn ra máu.",
        en: "The left gastric (from the coeliac trunk, the largest gastric artery) joins the right gastric (from the proper hepatic). A lesser-curvature ulcer eroding the left gastric causes haematemesis.",
        zh: "胃左动脉（发自腹腔干，胃的最大动脉）与胃右动脉（发自肝固有动脉）吻合。胃小弯溃疡侵蚀胃左动脉引起呕血。",
      },
      ids: A(/\bgastric artery$|celiac artery$|hepatic artery proper$|common hepatic artery$/i).filter((id) => !["FJ2013", "FJ3421"].includes(id)),
    },
    {
      key: "bo-cong-lon",
      tint: "#e8883d",
      latin: "Aa. gastroomentales · A. gastroduodenalis",
      name: { vi: "Vòng mạch bờ cong lớn và vị tá tràng", en: "Greater-curvature arcade and gastroduodenal", zh: "胃大弯动脉弓与胃十二指肠动脉" },
      note: {
        vi: "Vị mạc nối phải (từ vị tá tràng) nối với vị mạc nối trái (từ động mạch lách) dọc bờ cong lớn. Vị tá tràng chạy ngay sau hành tá tràng.",
        en: "The right gastro-omental (from the gastroduodenal) joins the left gastro-omental (from the splenic) along the greater curvature. The gastroduodenal runs right behind the duodenal cap.",
        zh: "胃网膜右动脉（发自胃十二指肠动脉）与胃网膜左动脉（发自脾动脉）沿胃大弯吻合。胃十二指肠动脉紧贴十二指肠球部后方走行。",
      },
      ids: A(/gastro-epiploic artery$|gastroduodenal artery$/i).concat(["FJ2562"]),
    },
    {
      key: "tm-vi",
      tint: "#7a6aa6",
      latin: "Vv. gastricae",
      name: { vi: "Tĩnh mạch vị và tĩnh mạch cửa", en: "Gastric veins and portal vein", zh: "胃静脉与门静脉" },
      note: {
        vi: "Tĩnh mạch vị trái nối với tĩnh mạch thực quản — vòng nối cửa-chủ gây giãn tĩnh mạch thực quản khi xơ gan. Các tĩnh mạch vị mạc nối về tĩnh mạch lách và mạc treo tràng trên.",
        en: "The left gastric vein connects with the oesophageal veins — the portocaval anastomosis that forms oesophageal varices in cirrhosis. The gastro-omental veins drain to the splenic and superior mesenteric veins.",
        zh: "胃左静脉与食管静脉相通——肝硬化时形成食管静脉曲张的门-腔吻合。胃网膜静脉回流至脾静脉和肠系膜上静脉。",
      },
      ids: byRe(/\bgastric vein$|gastroepiploic vein$|^hepatic portal vein$|^splenic vein$/i, ["venous"]),
    },
  ],
});
