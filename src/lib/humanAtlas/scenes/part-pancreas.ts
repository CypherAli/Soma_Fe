/**
 * Bài bộ phận "Tuỵ và lách — học theo lớp" học theo lớp — nhóm lấy từ pancreas-spleen.ts (đã kiểm), chỉ thêm lớp.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-parts.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const partPancreasScene: AtlasSceneDef = {
  "slug": "bo-phan-tuy-lach",
  "title": {
    "vi": "Tuỵ và lách — học theo lớp",
    "en": "Pancreas and Spleen — Layer by Layer",
    "zh": "胰与脾——分层学习"
  },
  "latin": "Pancreas · Lien",
  "system": "digestive",
  "intro": {
    "vi": "Mở ra là tuỵ, lách và tá tràng ôm đầu tuỵ. Bật lớp Ống tuỵ để thấy ống tuỵ chạy suốt dọc tuyến, đổ vào tá tràng. Bật lớp Mạch máu để thấy động mạch lách chạy ngoằn ngoèo dọc bờ trên tuỵ, vòng mạch tá–tuỵ và tĩnh mạch lách đổ về tĩnh mạch cửa.",
    "en": "It opens on the pancreas, spleen and the duodenum around the pancreatic head. Turn on Pancreatic duct for the duct running the length of the gland into the duodenum. Turn on Vessels for the tortuous splenic artery along the upper border, the pancreaticoduodenal arcades and the splenic vein draining to the portal vein.",
    "zh": "打开时显示胰、脾及环绕胰头的十二指肠。开启“胰管”可见贯穿胰腺全长、开口于十二指肠的胰管；开启“血管”可见沿胰上缘迂曲走行的脾动脉、胰十二指肠动脉弓及汇入门静脉的脾静脉。"
  },
  "layers": [
    {
      "key": "tang",
      "name": {
        "vi": "Tuỵ, lách, tá tràng",
        "en": "Pancreas, spleen, duodenum",
        "zh": "胰、脾、十二指肠"
      },
      "groups": [
        "tuy",
        "lach",
        "ta-trang"
      ],
      "on": true
    },
    {
      "key": "ong",
      "name": {
        "vi": "Ống tuỵ",
        "en": "Pancreatic duct",
        "zh": "胰管"
      },
      "groups": [
        "ong-tuy"
      ]
    },
    {
      "key": "mach",
      "name": {
        "vi": "Mạch máu",
        "en": "Vessels",
        "zh": "血管"
      },
      "groups": [
        "dm-lach-than-tang",
        "dm-ta-tuy",
        "tm-lach"
      ]
    }
  ],
  "groups": [
    {
      "key": "tuy",
      "name": {
        "vi": "Tuỵ",
        "en": "Pancreas",
        "zh": "胰"
      },
      "latin": "Pancreas",
      "note": {
        "vi": "Đầu, cổ, thân, đuôi. Tuỵ nằm sau phúc mạc, trước cột sống L1–L2 — nên chấn thương bụng trên đè ép có thể dập tuỵ vào cột sống. Ung thư đầu tuỵ chèn ống mật chủ gây vàng da không đau.",
        "en": "Head, neck, body and tail. It is retroperitoneal, in front of L1–L2 — so a blow to the upper abdomen can crush it against the spine. Cancer of the head compresses the bile duct and causes painless jaundice.",
        "zh": "分为头、颈、体、尾。位于腹膜后、L1–L2前方——故上腹部钝性撞击可将胰挤压于脊柱上致伤。胰头癌压迫胆总管引起无痛性黄疸。"
      },
      "tint": "#e0b36a",
      "parts": [
        "FJ2629"
      ]
    },
    {
      "key": "ong-tuy",
      "name": {
        "vi": "Ống tuỵ",
        "en": "Pancreatic duct",
        "zh": "胰管"
      },
      "latin": "Ductus pancreaticus",
      "note": {
        "vi": "Chạy suốt chiều dài tuỵ, hợp với ống mật chủ ở bóng Vater đổ vào đoạn hai tá tràng. Sỏi mật kẹt ở bóng Vater làm dịch mật trào ngược vào ống tuỵ — nguyên nhân hàng đầu của viêm tuỵ cấp.",
        "en": "Runs the whole length of the pancreas and joins the common bile duct at the ampulla of Vater in the second part of the duodenum. A gallstone stuck at the ampulla lets bile reflux into the pancreatic duct — the leading cause of acute pancreatitis.",
        "zh": "贯穿胰全长，与胆总管在十二指肠降部的Vater壶腹汇合。胆石嵌顿于壶腹可使胆汁反流入胰管——急性胰腺炎的首要原因。"
      },
      "tint": "#6f9a4f",
      "parts": [
        "FJ2630"
      ]
    },
    {
      "key": "lach",
      "name": {
        "vi": "Lách",
        "en": "Spleen",
        "zh": "脾"
      },
      "latin": "Splen",
      "note": {
        "vi": "Nằm ở hạ sườn trái, dưới xương sườn IX–XI. Là tạng dễ vỡ nhất trong chấn thương bụng kín — gãy sườn trái dưới cần nghĩ tới vỡ lách. Lách bình thường không sờ thấy; sờ thấy nghĩa là đã to gấp khoảng ba lần.",
        "en": "Lies in the left upper quadrant under ribs IX–XI. It is the organ most often ruptured in blunt abdominal trauma — lower left rib fractures should raise the suspicion. A normal spleen is not palpable; if you can feel it, it is about three times its normal size.",
        "zh": "位于左季肋区第9–11肋深面。是腹部闭合性损伤中最易破裂的器官——左下肋骨骨折应警惕脾破裂。正常脾不能触及；可触及时约已增大至正常的三倍。"
      },
      "tint": "#7a3a4f",
      "parts": [
        "FJ2561"
      ]
    },
    {
      "key": "ta-trang",
      "name": {
        "vi": "Tá tràng (khung)",
        "en": "Duodenum (C-loop)",
        "zh": "十二指肠（C形环）"
      },
      "latin": "Duodenum",
      "note": {
        "vi": "Khung chữ C ôm đầu tuỵ. Để màu gốc làm mốc — đầu tuỵ và tá tràng dùng chung nguồn máu (các động mạch tá tuỵ), nên không thể cắt đầu tuỵ mà giữ tá tràng (phẫu thuật Whipple).",
        "en": "The C-loop cradling the pancreatic head, shown in natural colour as a landmark. The head of the pancreas and duodenum share their blood supply (the pancreaticoduodenal arteries), so the head cannot be removed without the duodenum (Whipple's operation).",
        "zh": "环抱胰头的C形肠段，以原色作为标志。胰头与十二指肠共用血供（胰十二指肠动脉），故切除胰头必须同时切除十二指肠（Whipple手术）。"
      },
      "parts": [
        "FJ2573"
      ]
    },
    {
      "key": "dm-lach-than-tang",
      "name": {
        "vi": "Thân tạng và động mạch lách",
        "en": "Coeliac trunk and splenic artery",
        "zh": "腹腔干与脾动脉"
      },
      "latin": "Truncus coeliacus · A. splenica",
      "note": {
        "vi": "Động mạch lách ngoằn ngoèo dọc bờ trên tuỵ, cho các nhánh tuỵ (tuỵ lưng, tuỵ lớn, đuôi tuỵ) rồi vào rốn lách. Viêm tuỵ có thể ăn mòn thành nó tạo giả phình — vỡ gây chảy máu ồ ạt.",
        "en": "The tortuous splenic artery runs along the upper border of the pancreas, giving pancreatic branches (dorsal, great, caudal) before entering the splenic hilum. Pancreatitis can erode its wall into a pseudoaneurysm — rupture causes massive bleeding.",
        "zh": "迂曲的脾动脉沿胰上缘走行，发出胰支（胰背动脉、胰大动脉、胰尾动脉）后进入脾门。胰腺炎可侵蚀其壁形成假性动脉瘤——破裂导致大出血。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1846",
        "FJ2562",
        "FJ3419",
        "FJ3430",
        "FJ3433",
        "FJ3444"
      ]
    },
    {
      "key": "dm-ta-tuy",
      "name": {
        "vi": "Động mạch vị tá tràng và tá tuỵ",
        "en": "Gastroduodenal and pancreaticoduodenal arteries",
        "zh": "胃十二指肠动脉与胰十二指肠动脉"
      },
      "latin": "Aa. gastroduodenalis · pancreaticoduodenales",
      "note": {
        "vi": "Vị tá tràng (từ gan chung) chạy sau đoạn một tá tràng — loét mặt sau hành tá tràng ăn thủng nó gây xuất huyết tiêu hoá nặng. Các cung tá tuỵ trên (từ thân tạng) và dưới (từ mạc treo tràng trên) nối hai vùng cấp máu.",
        "en": "The gastroduodenal (from the common hepatic) runs behind the first part of the duodenum — a posterior duodenal ulcer eroding it causes severe GI bleeding. The superior (coeliac) and inferior (SMA) pancreaticoduodenal arcades link the two territories.",
        "zh": "胃十二指肠动脉（发自肝总动脉）行于十二指肠球部后方——球后壁溃疡穿透此动脉可致上消化道大出血。胰十二指肠上（腹腔干）、下（肠系膜上动脉）动脉弓连接两个供血区。"
      },
      "tint": "#e8883d",
      "parts": [
        "FJ3078",
        "FJ3401",
        "FJ3409",
        "FJ3432",
        "FJ3446",
        "FJ3546",
        "FJ3557"
      ]
    },
    {
      "key": "tm-lach",
      "name": {
        "vi": "Tĩnh mạch lách và tá tuỵ",
        "en": "Splenic and pancreaticoduodenal veins",
        "zh": "脾静脉与胰十二指肠静脉"
      },
      "latin": "V. splenica",
      "note": {
        "vi": "Tĩnh mạch lách chạy trong rãnh mặt sau tuỵ, hợp với mạc treo tràng trên thành tĩnh mạch cửa. Viêm tuỵ gây huyết khối tĩnh mạch lách → tăng áp cửa \"trái\" với giãn tĩnh mạch phình vị đơn độc.",
        "en": "The splenic vein runs in a groove on the back of the pancreas and joins the superior mesenteric vein to form the portal vein. Pancreatitis can thrombose it → \"left-sided\" portal hypertension with isolated gastric fundal varices.",
        "zh": "脾静脉走行于胰后面的沟内，与肠系膜上静脉汇合成门静脉。胰腺炎可致脾静脉血栓→“左侧”门静脉高压，出现孤立性胃底静脉曲张。"
      },
      "tint": "#7a6aa6",
      "parts": [
        "FJ3545",
        "FJ3641",
        "FJ3646",
        "FJ3655"
      ]
    }
  ]
};
