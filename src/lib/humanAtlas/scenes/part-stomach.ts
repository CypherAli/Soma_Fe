
import { bindContentSource } from "@/lib/content/source";
/**
 * Bài bộ phận "Dạ dày — học theo lớp" học theo lớp — nhóm lấy từ stomach.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partStomachScene: AtlasSceneDef = bindContentSource("data:src/lib/humanAtlas/scenes/part-stomach.ts#partStomachScene", {
  "slug": "bo-phan-da-day",
  "title": {
    "vi": "Dạ dày — học theo lớp",
    "en": "The Stomach — Layer by Layer",
    "zh": "胃——分层学习"
  },
  "latin": "Gaster",
  "system": "digestive",
  "intro": {
    "vi": "Mở ra là thực quản bụng, dạ dày và tá tràng. Bật lớp Mạch máu để thấy hai cung động mạch dọc bờ cong nhỏ và bờ cong lớn, cùng tĩnh mạch vị đổ về hệ cửa. Làm mờ dạ dày để thấy cung mạch ôm sát thành.",
    "en": "It opens on the abdominal oesophagus, stomach and duodenum. Turn on Vessels for the two arterial arcades along the lesser and greater curvatures and the gastric veins draining to the portal system. Fade the stomach to see the arcades hugging its wall.",
    "zh": "打开时显示腹段食管、胃和十二指肠。开启“血管”可见沿胃小弯和胃大弯的两条动脉弓及汇入门静脉系统的胃静脉。将胃淡化可见紧贴胃壁的血管弓。"
  },
  "layers": [
    {
      "key": "tang",
      "name": {
        "vi": "Dạ dày – tá tràng",
        "en": "Stomach – duodenum",
        "zh": "胃–十二指肠"
      },
      "groups": [
        "thuc-quan",
        "da-day",
        "ta-trang"
      ],
      "on": true
    },
    {
      "key": "mach",
      "name": {
        "vi": "Mạch máu",
        "en": "Vessels",
        "zh": "血管"
      },
      "groups": [
        "bo-cong-nho",
        "bo-cong-lon",
        "tm-vi"
      ]
    }
  ],
  "groups": [
    {
      "key": "da-day",
      "name": {
        "vi": "Dạ dày",
        "en": "Stomach",
        "zh": "胃"
      },
      "latin": "Gaster",
      "note": {
        "vi": "Tâm vị nối thực quản, đáy vị chứa khí (bóng hơi dạ dày trên phim), thân vị tiết acid, hang vị và môn vị điều tiết dòng dưỡng chấp xuống tá tràng. Hẹp môn vị bẩm sinh ở trẻ gây nôn vọt.",
        "en": "The cardia joins the oesophagus, the fundus holds gas (the gastric bubble on X-ray), the body secretes acid, and the antrum and pylorus meter chyme into the duodenum. Congenital pyloric stenosis in infants causes projectile vomiting.",
        "zh": "贲门连接食管，胃底储气（X线上的胃泡），胃体分泌胃酸，胃窦和幽门调控食糜进入十二指肠。婴儿先天性幽门狭窄引起喷射性呕吐。"
      },
      "tint": "#e8a37a",
      "parts": [
        "FJ2564"
      ]
    },
    {
      "key": "ta-trang",
      "name": {
        "vi": "Tá tràng",
        "en": "Duodenum",
        "zh": "十二指肠"
      },
      "latin": "Duodenum",
      "note": {
        "vi": "Bốn đoạn: hành tá tràng (trong phúc mạc, nơi loét hay gặp), đoạn xuống (có bóng Vater), đoạn ngang (bị động mạch mạc treo tràng trên bắt chéo phía trước), đoạn lên. Loét mặt sau hành tá tràng ăn thủng động mạch vị tá tràng gây chảy máu ồ ạt.",
        "en": "Four parts: the cap (intraperitoneal, where ulcers occur), the descending part (with the ampulla of Vater), the horizontal part (crossed in front by the SMA) and the ascending part. A posterior cap ulcer eroding the gastroduodenal artery causes massive bleeding.",
        "zh": "分四部：球部（腹膜内位，溃疡好发处）、降部（有Vater壶腹）、水平部（前方有肠系膜上动脉跨过）和升部。球后壁溃疡穿透胃十二指肠动脉可致大出血。"
      },
      "tint": "#e8c07a",
      "parts": [
        "FJ2573"
      ]
    },
    {
      "key": "thuc-quan",
      "name": {
        "vi": "Thực quản",
        "en": "Oesophagus",
        "zh": "食管"
      },
      "latin": "Oesophagus",
      "note": {
        "vi": "Đổ vào tâm vị. Góc His giữa thực quản và đáy vị cùng cơ hoành tạo cơ chế chống trào ngược; thoát vị khe thực quản làm mất góc này.",
        "en": "Enters at the cardia. The angle of His between the oesophagus and fundus, together with the diaphragm, forms the anti-reflux mechanism; a hiatus hernia flattens this angle.",
        "zh": "开口于贲门。食管与胃底之间的His角联合膈肌构成抗反流机制；食管裂孔疝使此角消失。"
      },
      "tint": "#c98a6b",
      "parts": [
        "FJ2563"
      ]
    },
    {
      "key": "bo-cong-nho",
      "name": {
        "vi": "Vòng mạch bờ cong nhỏ",
        "en": "Lesser-curvature arcade",
        "zh": "胃小弯动脉弓"
      },
      "latin": "Aa. gastricae sinistra et dextra",
      "note": {
        "vi": "Vị trái (từ thân tạng, lớn nhất trong các động mạch vị) nối với vị phải (từ gan riêng). Loét bờ cong nhỏ ăn vào động mạch vị trái gây nôn ra máu.",
        "en": "The left gastric (from the coeliac trunk, the largest gastric artery) joins the right gastric (from the proper hepatic). A lesser-curvature ulcer eroding the left gastric causes haematemesis.",
        "zh": "胃左动脉（发自腹腔干，胃的最大动脉）与胃右动脉（发自肝固有动脉）吻合。胃小弯溃疡侵蚀胃左动脉引起呕血。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1846",
        "FJ3078",
        "FJ3081",
        "FJ3499",
        "FJ3594"
      ]
    },
    {
      "key": "bo-cong-lon",
      "name": {
        "vi": "Vòng mạch bờ cong lớn và vị tá tràng",
        "en": "Greater-curvature arcade and gastroduodenal",
        "zh": "胃大弯动脉弓与胃十二指肠动脉"
      },
      "latin": "Aa. gastroomentales · A. gastroduodenalis",
      "note": {
        "vi": "Vị mạc nối phải (từ vị tá tràng) nối với vị mạc nối trái (từ động mạch lách) dọc bờ cong lớn. Vị tá tràng chạy ngay sau hành tá tràng.",
        "en": "The right gastro-omental (from the gastroduodenal) joins the left gastro-omental (from the splenic) along the greater curvature. The gastroduodenal runs right behind the duodenal cap.",
        "zh": "胃网膜右动脉（发自胃十二指肠动脉）与胃网膜左动脉（发自脾动脉）沿胃大弯吻合。胃十二指肠动脉紧贴十二指肠球部后方走行。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3432",
        "FJ3501",
        "FJ3596",
        "FJ2562"
      ]
    },
    {
      "key": "tm-vi",
      "name": {
        "vi": "Tĩnh mạch vị và tĩnh mạch cửa",
        "en": "Gastric veins and portal vein",
        "zh": "胃静脉与门静脉"
      },
      "latin": "Vv. gastricae",
      "note": {
        "vi": "Tĩnh mạch vị trái nối với tĩnh mạch thực quản — vòng nối cửa-chủ gây giãn tĩnh mạch thực quản khi xơ gan. Các tĩnh mạch vị mạc nối về tĩnh mạch lách và mạc treo tràng trên.",
        "en": "The left gastric vein connects with the oesophageal veins — the portocaval anastomosis that forms oesophageal varices in cirrhosis. The gastro-omental veins drain to the splenic and superior mesenteric veins.",
        "zh": "胃左静脉与食管静脉相通——肝硬化时形成食管静脉曲张的门-腔吻合。胃网膜静脉回流至脾静脉和肠系膜上静脉。"
      },
      "tint": "#7a6aa6",
      "parts": [
        "FJ1853",
        "FJ3500",
        "FJ3502",
        "FJ3595",
        "FJ3597",
        "FJ3641"
      ]
    }
  ]
});
