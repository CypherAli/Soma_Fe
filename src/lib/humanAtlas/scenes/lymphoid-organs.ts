/**
 * Scene "Tuyến ức và lách" dựng từ bộ atlas BodyParts3D.
 * 
 * Thay bài "Hệ bạch huyết" cũ: atlas không có hạch, mạch bạch huyết, ống ngực.
 *
 * SINH TỰ ĐỘNG bằng scripts/atlas/gen-scene-batch-e.mjs — mọi mã FJ đều là
 * mảnh CÓ THẬT trong manifest. Đừng sửa tay file này.
 */
import type { AtlasSceneDef } from "./types";

export const lymphoidOrgansScene: AtlasSceneDef = {
  "slug": "he-bach-huyet",
  "title": {
    "vi": "Cơ quan lympho: tuyến ức và lách",
    "en": "Lymphoid Organs: Thymus and Spleen",
    "zh": "淋巴器官：胸腺与脾"
  },
  "latin": "Organa lymphoidea: thymus, lien",
  "intro": {
    "vi": "Cơ quan lympho chia hai loại. Cơ quan trung ương (tuỷ xương, tuyến ức) là nơi lympho bào sinh ra và được huấn luyện. Cơ quan ngoại vi (lách, hạch, amidan) là nơi chúng gặp kháng nguyên. Tuyến ức ở trung thất trên huấn luyện lympho T nhận biết “ta” và “lạ”. Nó lớn nhất ở tuổi dậy thì rồi thoái hoá thành mỡ. Lách ở hạ sườn trái, lọc máu và loại hồng cầu già. Người đã cắt lách dễ bị nhiễm khuẩn có vỏ bọc nặng. Bộ dữ liệu không có hạch và mạch bạch huyết, nên scene chỉ dựng hai cơ quan này cùng mạch nuôi.",
    "en": "Lymphoid organs are of two kinds. Central organs (bone marrow, thymus) are where lymphocytes are made and trained. Peripheral organs (spleen, nodes, tonsils) are where they meet antigen. The thymus in the superior mediastinum trains T cells to tell self from non-self. It is largest at puberty, then turns to fat. The spleen, under the left ribs, filters blood and removes old red cells. People without a spleen are prone to severe infection by encapsulated bacteria. The dataset has no lymph nodes or lymphatic vessels, so the scene shows only these two organs and their vessels.",
    "zh": "淋巴器官分两类：中枢淋巴器官（骨髓、胸腺）是淋巴细胞生成和训练之处；周围淋巴器官（脾、淋巴结、扁桃体）是其接触抗原之处。上纵隔的胸腺训练T细胞识别“自我”与“非我”，青春期最大，此后逐渐脂肪化。脾位于左季肋区，滤血并清除衰老红细胞；脾切除者易发生荚膜菌重症感染。数据集中无淋巴结和淋巴管，故仅显示这两个器官及其血管。"
  },
  "frameGroups": [
    "uc",
    "lach"
  ],
  "fadedGroups": [
    "moc"
  ],
  "groups": [
    {
      "key": "uc",
      "name": {
        "vi": "Tuyến ức (hai thuỳ)",
        "en": "Thymus (two lobes)",
        "zh": "胸腺（左右叶）"
      },
      "latin": "Thymus (lobus dexter et sinister)",
      "note": {
        "vi": "Nằm sau cán ức, trước các mạch lớn. Ở trẻ nhỏ nó to, có thể thấy trên phim X quang như cánh buồm. Không có tuyến ức bẩm sinh (hội chứng DiGeorge) gây suy giảm miễn dịch tế bào.",
        "en": "Lies behind the manubrium in front of the great vessels. In infants it is large and can look like a sail on X-ray. Its congenital absence (DiGeorge syndrome) causes cellular immunodeficiency.",
        "zh": "位于胸骨柄后、大血管前。婴幼儿胸腺大，X线上可呈帆状。先天缺如（DiGeorge综合征）致细胞免疫缺陷。"
      },
      "tint": "#8fb0c8",
      "parts": [
        "FJ3150",
        "FJ3151"
      ]
    },
    {
      "key": "lach",
      "name": {
        "vi": "Lách",
        "en": "Spleen",
        "zh": "脾"
      },
      "latin": "Lien (splen)",
      "note": {
        "vi": "Nằm dọc sườn IX–XI bên trái, bình thường không sờ thấy. Là tạng hay vỡ nhất trong chấn thương bụng kín.",
        "en": "Lies along ribs 9–11 on the left and is normally not palpable. It is the organ most often ruptured in blunt abdominal trauma.",
        "zh": "沿左侧第9–11肋分布，正常时不能触及。是闭合性腹部外伤中最常破裂的脏器。"
      },
      "tint": "#8f5a8a",
      "parts": [
        "FJ2561"
      ]
    },
    {
      "key": "dm",
      "name": {
        "vi": "Động mạch lách và ngực trong",
        "en": "Splenic and internal thoracic arteries",
        "zh": "脾动脉与胸廓内动脉"
      },
      "latin": "A. splenica · A. thoracica interna",
      "note": {
        "vi": "Tuyến ức được nuôi chủ yếu bởi nhánh của động mạch ngực trong. Lách được nuôi bởi động mạch lách, chia 5–6 nhánh vào rốn lách; các nhánh là động mạch tận nên lách hay nhồi máu hình chêm.",
        "en": "The thymus is fed mainly by branches of the internal thoracic. The spleen is fed by the splenic artery, which splits into 5–6 end branches at the hilum, so splenic infarcts are wedge-shaped.",
        "zh": "胸腺主要由胸廓内动脉分支供血。脾由脾动脉供血，在脾门分为5–6条终支，故脾梗死呈楔形。"
      },
      "tint": "#c05245",
      "parts": [
        "FJ1937",
        "FJ1972",
        "FJ2562",
        "FJ3420",
        "FJ3544",
        "FJ3640"
      ]
    },
    {
      "key": "tm",
      "name": {
        "vi": "Tĩnh mạch lách và cánh tay–đầu",
        "en": "Splenic and brachiocephalic veins",
        "zh": "脾静脉与头臂静脉"
      },
      "latin": "V. splenica · Vv. brachiocephalicae",
      "note": {
        "vi": "Tĩnh mạch tuyến ức đổ vào tĩnh mạch cánh tay–đầu trái. Tĩnh mạch lách đổ về hệ cửa; tăng áp cửa làm lách to.",
        "en": "Thymic veins drain to the left brachiocephalic vein. The splenic vein drains to the portal system, so portal hypertension enlarges the spleen.",
        "zh": "胸腺静脉汇入左头臂静脉。脾静脉汇入门静脉系统，门静脉高压致脾大。"
      },
      "tint": "#527c9f",
      "parts": [
        "FJ3482",
        "FJ3583",
        "FJ3641"
      ]
    },
    {
      "key": "moc",
      "name": {
        "vi": "Xương ức, sườn, dạ dày, tuỵ (mốc)",
        "en": "Sternum, ribs, stomach, pancreas (landmarks)",
        "zh": "胸骨、肋骨、胃、胰（标志）"
      },
      "latin": "Sternum · Costae · Gaster · Pancreas",
      "note": {
        "vi": "Mờ sẵn.",
        "en": "Faded.",
        "zh": "淡化。"
      },
      "parts": [
        "FJ3153",
        "FJ3178",
        "FJ3290",
        "FJ1895",
        "FJ2564",
        "FJ3225",
        "FJ3226",
        "FJ3236"
      ]
    }
  ]
};
